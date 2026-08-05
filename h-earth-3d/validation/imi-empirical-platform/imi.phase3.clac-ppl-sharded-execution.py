#!/usr/bin/env python3
"""Deterministically shard and merge the frozen CLAC Phase 3 PPL computation."""
from __future__ import annotations

import argparse
import hashlib
import json
import math
import os
from pathlib import Path
from typing import Any

EXPECTED_PACKAGE_SHA256 = "52df6e548c512239337281bb5f0e461a4751f6068f75db197bd2ad323b3ad171"
MISTRAL_Q5_SHA256 = "c4b062ec7f0f160e848a0e34c4e291b9e39b3fc60df5b201c038e7064dbbdcdc"


def canonical_sha256(value: Any) -> str:
    text = json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False)
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def write_payload(path: Path, body: dict[str, Any]) -> None:
    payload = {**body, "payloadSha256": canonical_sha256(body)}
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(json.dumps({
        "result": payload.get("result"),
        "rows": len(payload.get("rows", [])),
        "payloadSha256": payload["payloadSha256"],
    }, indent=2))


def verify_payload(payload: dict[str, Any]) -> None:
    expected = payload.get("payloadSha256")
    body = {key: value for key, value in payload.items() if key != "payloadSha256"}
    if expected != canonical_sha256(body):
        raise RuntimeError(f"PPL_SHARD_PAYLOAD_DIGEST_MISMATCH:{expected}:{canonical_sha256(body)}")


def load_records(package_path: Path) -> tuple[dict[str, Any], list[dict[str, Any]]]:
    package = json.loads(package_path.read_text(encoding="utf-8"))
    if package.get("packageSha256") != EXPECTED_PACKAGE_SHA256:
        raise RuntimeError("CLAC_PACKAGE_SHA256_MISMATCH")
    sheets = package.get("metadata", {}).get("sheets", [])
    if len(sheets) != 1:
        raise RuntimeError("CLAC_METADATA_SHEET_COUNT_INVALID")
    metadata = {str(row.get("speakerID")): row for row in sheets[0].get("rows", [])}
    transcripts = package.get("cookieTheft", {}).get("transcripts", [])
    if len(transcripts) != 240:
        raise RuntimeError(f"CLAC_TRANSCRIPT_COUNT_INVALID:{len(transcripts)}")
    records = []
    for item in transcripts:
        speaker_id = str(item["speakerId"])
        meta = metadata.get(speaker_id)
        if meta is None:
            raise RuntimeError(f"CLAC_METADATA_NOT_FOUND:{speaker_id}")
        text = str(item.get("text", "")).strip()
        if not text:
            raise RuntimeError(f"CLAC_EMPTY_TRANSCRIPT:{speaker_id}")
        records.append({
            "speakerId": speaker_id,
            "speakerNumber": int(item["speakerNumber"]),
            "language": "EN",
            "group": str(meta.get("gender", "")).strip().lower(),
            "text": text,
        })
    records.sort(key=lambda row: row["speakerNumber"])
    return package, records


def extract(args: argparse.Namespace) -> int:
    import numpy as np
    from llama_cpp import Llama

    package_path = Path(args.package)
    model_path = Path(args.model_path)
    output_path = Path(args.output)
    shard_index = int(args.shard_index)
    shard_count = int(args.shard_count)
    if shard_count < 1 or shard_index < 0 or shard_index >= shard_count:
        raise RuntimeError(f"PPL_SHARD_IDENTITY_INVALID:{shard_index}:{shard_count}")

    package, records = load_records(package_path)
    selected = [row for position, row in enumerate(records) if position % shard_count == shard_index]
    model_digest = sha256_file(model_path)
    if model_digest != MISTRAL_Q5_SHA256:
        raise RuntimeError(f"MISTRAL_Q5_SHA256_MISMATCH:{model_digest}:{MISTRAL_Q5_SHA256}")

    llm = Llama(
        model_path=str(model_path),
        n_ctx=2048,
        n_batch=512,
        n_threads=max(1, os.cpu_count() or 1),
        logits_all=True,
        verbose=False,
    )
    rows = []
    for record in selected:
        tokens = llm.tokenize(record["text"].encode("utf-8"), add_bos=True, special=False)
        if len(tokens) < 2:
            loss = None
            ppl = None
        else:
            if len(tokens) > 2048:
                raise RuntimeError(f"PPL_CONTEXT_LIMIT_EXCEEDED:{record['speakerId']}:{len(tokens)}")
            llm.reset()
            llm.eval(tokens)
            logits = np.asarray(llm._scores[:len(tokens) - 1], dtype=np.float64)
            targets = np.asarray(tokens[1:], dtype=np.int64)
            row_max = np.max(logits, axis=1)
            logsumexp = row_max + np.log(np.exp(logits - row_max[:, None]).sum(axis=1))
            nll = logsumexp - logits[np.arange(len(targets)), targets]
            loss_value = float(np.mean(nll))
            loss = loss_value if math.isfinite(loss_value) else None
            ppl_value = float(math.exp(min(loss_value, 700.0)))
            ppl = ppl_value if math.isfinite(ppl_value) else None
        rows.append({
            "speakerNumber": record["speakerNumber"],
            "speakerId": record["speakerId"],
            "language": record["language"],
            "group": record["group"],
            "MISTRAL_TokenNum": len(tokens),
            "PPL_CrossEntropy": loss,
            "PPL": ppl,
        })

    write_payload(output_path, {
        "schemaVersion": "IMI_PHASE_3_CLAC_PPL_SHARD_v1",
        "result": "PASS_CLAC_PPL_SHARD_EXTRACTION_Q5_K_M_DECLARED",
        "mode": "ppl_shard",
        "observedAt": args.clock,
        "sourcePackageSha256": package["packageSha256"],
        "model": {
            "baseModel": "mistralai/Mistral-7B-Instruct-v0.1",
            "representation": "Q5_K_M",
            "path": str(model_path),
            "sha256": model_digest,
            "fullPrecisionEquivalenceClaimed": False,
        },
        "shard": {
            "index": shard_index,
            "count": shard_count,
            "selectedRows": len(rows),
            "totalRows": len(records),
            "partitionRule": "ZERO_BASED_RECORD_POSITION_MODULO_SHARD_COUNT",
        },
        "rows": rows,
    })
    return 0


def merge(args: argparse.Namespace) -> int:
    input_dir = Path(args.inputs_dir)
    output_path = Path(args.output)
    paths = sorted(input_dir.rglob("clac-ppl-shard-*.v1.json"))
    if not paths:
        raise RuntimeError("PPL_SHARD_INPUTS_NOT_FOUND")
    payloads = [json.loads(path.read_text(encoding="utf-8")) for path in paths]
    for payload in payloads:
        verify_payload(payload)
        if payload.get("schemaVersion") != "IMI_PHASE_3_CLAC_PPL_SHARD_v1":
            raise RuntimeError("PPL_SHARD_SCHEMA_MISMATCH")
        if payload.get("result") != "PASS_CLAC_PPL_SHARD_EXTRACTION_Q5_K_M_DECLARED":
            raise RuntimeError("PPL_SHARD_RESULT_MISMATCH")

    shard_counts = {int(payload["shard"]["count"]) for payload in payloads}
    if len(shard_counts) != 1:
        raise RuntimeError(f"PPL_SHARD_COUNT_INCONSISTENT:{shard_counts}")
    shard_count = shard_counts.pop()
    indexes = sorted(int(payload["shard"]["index"]) for payload in payloads)
    if indexes != list(range(shard_count)):
        raise RuntimeError(f"PPL_SHARD_INDEX_SET_INVALID:{indexes}:{shard_count}")

    source_digests = {payload["sourcePackageSha256"] for payload in payloads}
    model_digests = {payload["model"]["sha256"] for payload in payloads}
    clocks = {payload["observedAt"] for payload in payloads}
    if source_digests != {EXPECTED_PACKAGE_SHA256}:
        raise RuntimeError(f"PPL_SHARD_SOURCE_DIGEST_MISMATCH:{source_digests}")
    if model_digests != {MISTRAL_Q5_SHA256}:
        raise RuntimeError(f"PPL_SHARD_MODEL_DIGEST_MISMATCH:{model_digests}")
    if len(clocks) != 1:
        raise RuntimeError(f"PPL_SHARD_CLOCK_MISMATCH:{clocks}")

    rows = [row for payload in payloads for row in payload.get("rows", [])]
    if len(rows) != 240:
        raise RuntimeError(f"PPL_SHARD_MERGED_ROW_COUNT_INVALID:{len(rows)}")
    speaker_numbers = [int(row["speakerNumber"]) for row in rows]
    speaker_ids = [str(row["speakerId"]) for row in rows]
    if len(set(speaker_numbers)) != 240 or len(set(speaker_ids)) != 240:
        raise RuntimeError("PPL_SHARD_DUPLICATE_PARTICIPANT")
    rows.sort(key=lambda row: int(row["speakerNumber"]))
    final_rows = [
        {key: value for key, value in row.items() if key != "speakerNumber"}
        for row in rows
    ]

    write_payload(output_path, {
        "schemaVersion": "IMI_PHASE_3_CLAC_PPL_FEATURES_v1",
        "result": "PASS_CLAC_PPL_FEATURE_EXTRACTION_Q5_K_M_DECLARED",
        "mode": "ppl",
        "observedAt": clocks.pop(),
        "sourcePackageSha256": EXPECTED_PACKAGE_SHA256,
        "model": {
            "baseModel": "mistralai/Mistral-7B-Instruct-v0.1",
            "representation": "Q5_K_M",
            "path": "SHARDED_EXECUTION_HASH_BOUND_MODEL",
            "sha256": MISTRAL_Q5_SHA256,
            "fullPrecisionEquivalenceClaimed": False,
        },
        "executionPartition": {
            "scientificSemanticsChanged": False,
            "shardCount": shard_count,
            "partitionRule": "ZERO_BASED_RECORD_POSITION_MODULO_SHARD_COUNT",
            "mergedShardPayloadSha256": [payload["payloadSha256"] for payload in sorted(payloads, key=lambda value: int(value["shard"]["index"]))],
        },
        "rows": final_rows,
    })
    return 0


def main() -> int:
    parser = argparse.ArgumentParser()
    subparsers = parser.add_subparsers(dest="command", required=True)

    extract_parser = subparsers.add_parser("extract")
    extract_parser.add_argument("--package", required=True)
    extract_parser.add_argument("--model-path", required=True)
    extract_parser.add_argument("--shard-index", required=True, type=int)
    extract_parser.add_argument("--shard-count", required=True, type=int)
    extract_parser.add_argument("--output", required=True)
    extract_parser.add_argument("--clock", required=True)
    extract_parser.set_defaults(handler=extract)

    merge_parser = subparsers.add_parser("merge")
    merge_parser.add_argument("--inputs-dir", required=True)
    merge_parser.add_argument("--output", required=True)
    merge_parser.set_defaults(handler=merge)

    args = parser.parse_args()
    return int(args.handler(args))


if __name__ == "__main__":
    raise SystemExit(main())
