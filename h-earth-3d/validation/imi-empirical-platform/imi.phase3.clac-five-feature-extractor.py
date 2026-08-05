#!/usr/bin/env python3
"""Extract the frozen CLAC Phase 3 speech features without route retuning."""
from __future__ import annotations

import argparse
import hashlib
import json
import math
import os
from pathlib import Path
from typing import Any

EXPECTED_PACKAGE_SHA256 = "52df6e548c512239337281bb5f0e461a4751f6068f75db197bd2ad323b3ad171"
BERT_MODEL = "google-bert/bert-base-uncased"
BERT_REVISION = "86b5e0934494bd15c9632b12f734a8a67f723594"
MISTRAL_Q5_SHA256 = "c4b062ec7f0f160e848a0e34c4e291b9e39b3fc60df5b201c038e7064dbbdcdc"
CLIP_WEIGHT_SHA256 = "b8cca3fd41ae0c99ba7e8951adf17d267cdb84cd88be6f7c2e0eca1737a03836"
REQUIRED_FEATURES = ("FT_GSim", "BERT_GSim", "CLIP", "ADD", "PPL", "BERT_TTR")


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
        "result": body.get("result"),
        "mode": body.get("mode"),
        "rows": len(body.get("rows", [])),
        "payloadSha256": payload["payloadSha256"],
    }, indent=2))


def load_records(package_path: Path) -> tuple[dict[str, Any], list[dict[str, Any]]]:
    package = json.loads(package_path.read_text(encoding="utf-8"))
    if package.get("packageSha256") != EXPECTED_PACKAGE_SHA256:
        raise RuntimeError(
            f"CLAC_PACKAGE_SHA256_MISMATCH:{package.get('packageSha256')}:{EXPECTED_PACKAGE_SHA256}"
        )
    sheets = package.get("metadata", {}).get("sheets", [])
    if len(sheets) != 1:
        raise RuntimeError(f"CLAC_METADATA_SHEET_COUNT_INVALID:{len(sheets)}")
    metadata_rows = sheets[0].get("rows", [])
    metadata = {str(row.get("speakerID")): row for row in metadata_rows}
    transcripts = package.get("cookieTheft", {}).get("transcripts", [])
    if len(transcripts) != 240:
        raise RuntimeError(f"CLAC_TRANSCRIPT_COUNT_INVALID:{len(transcripts)}")
    records: list[dict[str, Any]] = []
    for item in transcripts:
        speaker_id = str(item["speakerId"])
        row = metadata.get(speaker_id)
        if row is None:
            raise RuntimeError(f"CLAC_METADATA_NOT_FOUND:{speaker_id}")
        text = str(item.get("text", "")).strip()
        if not text:
            raise RuntimeError(f"CLAC_EMPTY_TRANSCRIPT:{speaker_id}")
        records.append({
            "speakerId": speaker_id,
            "speakerNumber": int(item["speakerNumber"]),
            "language": "EN",
            "group": str(row.get("gender", "")).strip().lower(),
            "ageYears": row.get("age (years)"),
            "educationYears": row.get("education (years)"),
            "workerCountry": row.get("worker_country"),
            "symptoms": row.get("symptoms"),
            "textSha256": item.get("textSha256"),
            "text": text,
        })
    records.sort(key=lambda item: item["speakerNumber"])
    groups = sorted({row["group"] for row in records if row["group"]})
    if len(groups) < 2:
        raise RuntimeError(f"CLAC_DECLARED_GROUP_MINIMUM_NOT_MET:{groups}")
    return package, records


def mean_lower_triangle_cosine(embeddings: Any) -> float:
    import numpy as np

    matrix = np.asarray(embeddings, dtype=np.float64)
    if matrix.ndim != 2 or matrix.shape[0] < 2:
        return float("nan")
    norms = np.linalg.norm(matrix, axis=1)
    valid = norms > 0
    matrix = matrix[valid]
    norms = norms[valid]
    if matrix.shape[0] < 2:
        return float("nan")
    normalized = matrix / norms[:, None]
    similarities = normalized @ normalized.T
    values = similarities[np.tril_indices(similarities.shape[0], k=-1)]
    return float(np.nanmean(values))


def load_spacy():
    import spacy

    return spacy.load("en_core_web_sm")


def fasttext_mode(package_path: Path, output_path: Path, model_path: Path, clock: str) -> None:
    import numpy as np
    from gensim.models.fasttext import load_facebook_vectors
    from nltk.corpus import stopwords

    package, records = load_records(package_path)
    model_digest = sha256_file(model_path)
    nlp = load_spacy()
    fillers = [
        "'s", "'t", "'d", "'m", "'ve", "'ll", "'re", "'o", "'y", "'ain",
        "could", "might", "must", "need", "shall", "would", "n't",
        "um", "umm", "uh", "uhh", "yeah", "oh", "ah", "okay", "hm",
        "mhmm", "hmm", "hmmm", "well", "alright",
    ]
    stop_words = set(stopwords.words("english") + fillers)
    vectors = load_facebook_vectors(str(model_path))
    rows = []
    for record in records:
        doc = nlp(record["text"])
        tokens = [
            token.text
            for token in doc
            if token.text.lower() not in stop_words and token.pos_ not in {"SPACE", "PUNCT"}
        ]
        if len(tokens) < 2:
            ft_gsim = None
            ft_ttr = None
        else:
            embeddings = np.asarray([vectors[token] for token in tokens], dtype=np.float32)
            value = mean_lower_triangle_cosine(embeddings)
            ft_gsim = value if math.isfinite(value) else None
            ft_ttr = len(set(tokens)) / len(tokens)
        rows.append({
            "speakerId": record["speakerId"],
            "language": record["language"],
            "group": record["group"],
            "FT_WordNum": len(tokens),
            "FT_TTR": ft_ttr,
            "FT_GSim": ft_gsim,
        })
    write_payload(output_path, {
        "schemaVersion": "IMI_PHASE_3_CLAC_FASTTEXT_FEATURES_v1",
        "result": "PASS_CLAC_FASTTEXT_FEATURE_EXTRACTION",
        "mode": "fasttext",
        "observedAt": clock,
        "sourcePackageSha256": package["packageSha256"],
        "model": {
            "id": "FASTTEXT_COMMON_CRAWL_ENGLISH_300D",
            "path": str(model_path),
            "sha256": model_digest,
        },
        "rows": rows,
    })


def bert_add_mode(package_path: Path, output_path: Path, clock: str) -> None:
    import numpy as np
    import torch
    from transformers import BertModel, BertTokenizer

    package, records = load_records(package_path)
    nlp = load_spacy()
    tokenizer = BertTokenizer.from_pretrained(BERT_MODEL, revision=BERT_REVISION)
    model = BertModel.from_pretrained(BERT_MODEL, revision=BERT_REVISION)
    model.eval()
    rows = []
    with torch.no_grad():
        for record in records:
            encoded = tokenizer(record["text"], truncation=True, return_tensors="pt")
            hidden = model(
                input_ids=encoded["input_ids"],
                attention_mask=encoded["attention_mask"],
                return_dict=False,
            )[0][0].detach().cpu().numpy()
            bert_gsim_value = mean_lower_triangle_cosine(hidden)
            token_ids = encoded["input_ids"][0][1:-1].detach().cpu().numpy().tolist()
            bert_ttr = len(set(token_ids)) / len(token_ids) if token_ids else None

            doc = nlp(record["text"])
            sentence_means = []
            for sentence in doc.sents:
                distances = [
                    abs(token.i - token.head.i)
                    for token in sentence
                    if token.dep_ != "punct"
                ]
                if distances:
                    sentence_means.append(float(np.nanmean(distances)))
            add_value = float(np.nanmean(sentence_means)) if sentence_means else float("nan")
            rows.append({
                "speakerId": record["speakerId"],
                "language": record["language"],
                "group": record["group"],
                "BERT_TokenNum": len(token_ids),
                "BERT_TTR": bert_ttr,
                "BERT_GSim": bert_gsim_value if math.isfinite(bert_gsim_value) else None,
                "ADD": add_value if math.isfinite(add_value) else None,
            })
    write_payload(output_path, {
        "schemaVersion": "IMI_PHASE_3_CLAC_BERT_ADD_FEATURES_v1",
        "result": "PASS_CLAC_BERT_ADD_FEATURE_EXTRACTION",
        "mode": "bert_add",
        "observedAt": clock,
        "sourcePackageSha256": package["packageSha256"],
        "model": {
            "id": BERT_MODEL,
            "revision": BERT_REVISION,
        },
        "spacy": {
            "model": "en_core_web_sm",
        },
        "rows": rows,
    })


def clip_mode(package_path: Path, output_path: Path, image_path: Path, clock: str) -> None:
    import numpy as np
    import torch
    from PIL import Image
    import clip

    package, records = load_records(package_path)
    image_digest = sha256_file(image_path)
    nlp = load_spacy()
    device = "cpu"
    model, preprocess = clip.load("ViT-L/14", device=device, jit=False)
    model.eval()
    rows = []
    with torch.no_grad():
        image = preprocess(Image.open(image_path).convert("RGB")).unsqueeze(0).to(device)
        image_features = model.encode_image(image).float()
        image_features /= image_features.norm(dim=-1, keepdim=True)
        for record in records:
            doc = nlp(record["text"])
            sentences = [sentence.text.strip() for sentence in doc.sents if sentence.text.strip()]
            if not sentences:
                sentences = [record["text"]]
            similarities = []
            for start in range(0, len(sentences), 32):
                tokens = clip.tokenize(sentences[start:start + 32], truncate=True).to(device)
                text_features = model.encode_text(tokens).float()
                text_features /= text_features.norm(dim=-1, keepdim=True)
                batch = (text_features @ image_features.T).squeeze(1).detach().cpu().numpy()
                similarities.extend(float(value) for value in batch)
            clip_value = float(np.nanmean(similarities)) if similarities else float("nan")
            rows.append({
                "speakerId": record["speakerId"],
                "language": record["language"],
                "group": record["group"],
                "sentenceCount": len(sentences),
                "CLIP": clip_value if math.isfinite(clip_value) else None,
            })
    weight_path = Path.home() / ".cache" / "clip" / "ViT-L-14.pt"
    weight_digest = sha256_file(weight_path) if weight_path.exists() else None
    if weight_digest != CLIP_WEIGHT_SHA256:
        raise RuntimeError(f"CLIP_WEIGHT_SHA256_MISMATCH:{weight_digest}:{CLIP_WEIGHT_SHA256}")
    write_payload(output_path, {
        "schemaVersion": "IMI_PHASE_3_CLAC_CLIP_FEATURES_v1",
        "result": "PASS_CLAC_CLIP_FEATURE_EXTRACTION",
        "mode": "clip",
        "observedAt": clock,
        "sourcePackageSha256": package["packageSha256"],
        "stimulusImage": {
            "path": str(image_path),
            "sha256": image_digest,
        },
        "model": {
            "id": "ViT-L/14",
            "weightSha256": weight_digest,
        },
        "rows": rows,
    })


def ppl_mode(package_path: Path, output_path: Path, model_path: Path, clock: str) -> None:
    import numpy as np
    from llama_cpp import Llama

    package, records = load_records(package_path)
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
    for record in records:
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
            "speakerId": record["speakerId"],
            "language": record["language"],
            "group": record["group"],
            "MISTRAL_TokenNum": len(tokens),
            "PPL_CrossEntropy": loss,
            "PPL": ppl,
        })
    write_payload(output_path, {
        "schemaVersion": "IMI_PHASE_3_CLAC_PPL_FEATURES_v1",
        "result": "PASS_CLAC_PPL_FEATURE_EXTRACTION_Q5_K_M_DECLARED",
        "mode": "ppl",
        "observedAt": clock,
        "sourcePackageSha256": package["packageSha256"],
        "model": {
            "baseModel": "mistralai/Mistral-7B-Instruct-v0.1",
            "representation": "Q5_K_M",
            "path": str(model_path),
            "sha256": model_digest,
            "fullPrecisionEquivalenceClaimed": false
        },
        "rows": rows,
    })


def assemble_mode(
    package_path: Path,
    output_path: Path,
    fasttext_path: Path,
    bert_add_path: Path,
    clip_path: Path,
    ppl_path: Path,
    clock: str,
) -> None:
    package, records = load_records(package_path)
    feature_payloads = {
        "fasttext": json.loads(fasttext_path.read_text(encoding="utf-8")),
        "bert_add": json.loads(bert_add_path.read_text(encoding="utf-8")),
        "clip": json.loads(clip_path.read_text(encoding="utf-8")),
        "ppl": json.loads(ppl_path.read_text(encoding="utf-8")),
    }
    for name, payload in feature_payloads.items():
        if payload.get("sourcePackageSha256") != package["packageSha256"]:
            raise RuntimeError(f"FEATURE_SOURCE_PACKAGE_MISMATCH:{name}")
        if len(payload.get("rows", [])) != 240:
            raise RuntimeError(f"FEATURE_ROW_COUNT_INVALID:{name}:{len(payload.get('rows', []))}")
    indexes = {
        name: {row["speakerId"]: row for row in payload["rows"]}
        for name, payload in feature_payloads.items()
    }
    rows = []
    unevaluable = []
    for record in records:
        speaker_id = record["speakerId"]
        merged = {
            "participant_id": speaker_id,
            "language": record["language"],
            "group": record["group"],
            "age_years": record["ageYears"],
            "education_years": record["educationYears"],
            "worker_country": record["workerCountry"],
            "symptoms": record["symptoms"],
            "text_sha256": record["textSha256"],
        }
        for index in indexes.values():
            feature_row = index.get(speaker_id)
            if feature_row is None:
                raise RuntimeError(f"FEATURE_PARTICIPANT_MISSING:{speaker_id}")
            for key in REQUIRED_FEATURES:
                if key in feature_row:
                    merged[key] = feature_row[key]
        missing = [
            key for key in REQUIRED_FEATURES
            if not isinstance(merged.get(key), (int, float)) or not math.isfinite(float(merged[key]))
        ]
        if missing:
            unevaluable.append({"participant_id": speaker_id, "missingFeatures": missing})
        rows.append(merged)
    write_payload(output_path, {
        "schemaVersion": "IMI_PHASE_3_CLAC_FIVE_FEATURE_PACKAGE_v1",
        "result": (
            "PASS_CLAC_FIVE_FEATURE_PACKAGE_COMPLETE"
            if not unevaluable else
            "HELD_CLAC_FIVE_FEATURE_PACKAGE_CONTAINS_UNEVALUABLE_CASES"
        ),
        "mode": "assemble",
        "observedAt": clock,
        "sourcePackageSha256": package["packageSha256"],
        "featurePayloadSha256": {
            name: payload["payloadSha256"] for name, payload in feature_payloads.items()
        },
        "participantCount": len(rows),
        "declaredGroups": sorted({row["group"] for row in rows}),
        "unevaluable": unevaluable,
        "rows": rows,
    })


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--mode", required=True, choices=["fasttext", "bert_add", "clip", "ppl", "assemble"])
    parser.add_argument("--package", required=True)
    parser.add_argument("--output", required=True)
    parser.add_argument("--model-path")
    parser.add_argument("--image-path")
    parser.add_argument("--fasttext-features")
    parser.add_argument("--bert-add-features")
    parser.add_argument("--clip-features")
    parser.add_argument("--ppl-features")
    parser.add_argument("--clock", default="2026-08-05T20:05:00.000Z")
    args = parser.parse_args()

    package_path = Path(args.package)
    output_path = Path(args.output)
    if args.mode == "fasttext":
        if not args.model_path:
            parser.error("--model-path is required for fasttext")
        fasttext_mode(package_path, output_path, Path(args.model_path), args.clock)
    elif args.mode == "bert_add":
        bert_add_mode(package_path, output_path, args.clock)
    elif args.mode == "clip":
        if not args.image_path:
            parser.error("--image-path is required for clip")
        clip_mode(package_path, output_path, Path(args.image_path), args.clock)
    elif args.mode == "ppl":
        if not args.model_path:
            parser.error("--model-path is required for ppl")
        ppl_mode(package_path, output_path, Path(args.model_path), args.clock)
    else:
        required = [
            args.fasttext_features,
            args.bert_add_features,
            args.clip_features,
            args.ppl_features,
        ]
        if any(value is None for value in required):
            parser.error("all four --*-features paths are required for assemble")
        assemble_mode(
            package_path,
            output_path,
            Path(args.fasttext_features),
            Path(args.bert_add_features),
            Path(args.clip_features),
            Path(args.ppl_features),
            args.clock,
        )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
