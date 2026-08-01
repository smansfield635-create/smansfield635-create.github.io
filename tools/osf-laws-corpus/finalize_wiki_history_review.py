#!/usr/bin/env python3
"""Complete OSF wiki-history review and correct the Lane 2 receipt."""
from __future__ import annotations

import argparse
import json
import os
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import quote

import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

ALLOWED = {"REVIEWED", "ABSENT", "PRESENT_BUT_UNAVAILABLE"}


def session() -> requests.Session:
    s = requests.Session()
    retry = Retry(
        total=3,
        backoff_factor=0.7,
        status_forcelist=(429, 500, 502, 503, 504),
        allowed_methods=("GET",),
    )
    s.mount("https://", HTTPAdapter(max_retries=retry))
    s.headers["User-Agent"] = "laws-chamber-wiki-history-review/1.0"
    return s


def get_json(s: requests.Session, url: str) -> tuple[str, dict | None]:
    try:
        response = s.get(url, timeout=30)
        if response.status_code == 404:
            return "ABSENT", None
        if response.status_code in (401, 403):
            return "PRESENT_BUT_UNAVAILABLE", None
        response.raise_for_status()
        return "REVIEWED", response.json()
    except Exception as exc:
        return "PENDING", {"error": f"{type(exc).__name__}: {exc}", "url": url}


def count(payload: dict | None) -> int:
    return len(payload.get("data", [])) if isinstance(payload, dict) else 0


def related_versions_url(wiki: dict) -> str | None:
    rel = wiki.get("relationships", {}).get("versions", {}).get("links", {}).get("related")
    if isinstance(rel, str):
        return rel
    if isinstance(rel, dict):
        return rel.get("href")
    return None


def review_history(s: requests.Session, resource: dict) -> tuple[str, int, list[dict]]:
    if resource.get("WIKI_STATUS") == "ABSENT":
        return "ABSENT", 0, []
    if resource.get("WIKI_STATUS") == "PRESENT_BUT_UNAVAILABLE":
        return "PRESENT_BUT_UNAVAILABLE", 0, []
    if resource.get("WIKI_STATUS") != "REVIEWED":
        return "PENDING", 0, [{"error": "Wiki landing review is not complete."}]

    osf_id = resource["OSF_ID"]
    kind = "registrations" if resource.get("PROJECT_OR_REGISTRATION") == "REGISTRATION" else "nodes"
    status, payload = get_json(s, f"https://api.osf.io/v2/{kind}/{osf_id}/wikis/")
    if status != "REVIEWED":
        return status, 0, [payload or {}]

    wikis = payload.get("data", []) if isinstance(payload, dict) else []
    if not wikis:
        return "ABSENT", 0, []

    statuses: list[str] = []
    versions = 0
    details: list[dict] = []
    for wiki in wikis:
        wiki_id = str(wiki.get("id", ""))
        url = related_versions_url(wiki)
        if not url and wiki_id:
            url = f"https://api.osf.io/v2/wikis/{quote(wiki_id, safe='')}/versions/"
        if not url:
            statuses.append("PENDING")
            details.append({"wiki_id": wiki_id, "status": "PENDING", "error": "No versions endpoint resolved."})
            continue
        item_status, item_payload = get_json(s, url)
        statuses.append(item_status)
        item_count = count(item_payload) if item_status == "REVIEWED" else 0
        versions += item_count
        details.append({"wiki_id": wiki_id, "status": item_status, "version_count": item_count, "url": url})

    if any(value == "PENDING" for value in statuses):
        overall = "PENDING"
    elif all(value == "PRESENT_BUT_UNAVAILABLE" for value in statuses):
        overall = "PRESENT_BUT_UNAVAILABLE"
    elif all(value in {"REVIEWED", "ABSENT"} for value in statuses):
        overall = "REVIEWED"
    else:
        overall = "PRESENT_BUT_UNAVAILABLE"
    return overall, versions, details


def write_json(path: Path, payload: dict) -> None:
    path.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--registry", default="research/osf-laws-corpus/source-registry/registry.json")
    parser.add_argument("--receipt", default="research/osf-laws-corpus/source-registry/LANE_2_COMPLETION_RECEIPT.json")
    args = parser.parse_args()

    registry_path = Path(args.registry)
    receipt_path = Path(args.receipt)
    registry = json.loads(registry_path.read_text(encoding="utf-8"))
    receipt = json.loads(receipt_path.read_text(encoding="utf-8"))
    s = session()

    for resource in registry["resources"]:
        status, version_count, details = review_history(s, resource)
        resource["WIKI_HISTORY_STATUS"] = status
        review = resource.setdefault("REVIEW_SURFACES", {})
        review["wiki_history_status"] = status
        review["wiki_history_version_count"] = version_count
        review["wiki_history_details"] = details

    registry["summary"]["wiki_history_status_counts"] = dict(
        Counter(resource["WIKI_HISTORY_STATUS"] for resource in registry["resources"])
    )
    registry["wiki_history_review_completed_at"] = datetime.now(timezone.utc).isoformat()
    registry["wiki_history_review_source_head"] = os.getenv("GITHUB_SHA", "LOCAL_OR_UNRECORDED")

    complete = all(
        resource["WIKI_STATUS"] in ALLOWED and resource["WIKI_HISTORY_STATUS"] in ALLOWED
        for resource in registry["resources"]
    )
    receipt["wiki_review_complete"] = complete
    receipt["status"] = "PASS_COMPLETE" if complete else "PASS_WITH_EXPLICIT_PENDING_LIVE_SURFACES"
    receipt["wiki_history_status_counts"] = registry["summary"]["wiki_history_status_counts"]
    receipt["wiki_history_review_completed_at"] = registry["wiki_history_review_completed_at"]

    write_json(registry_path, registry)
    write_json(receipt_path, receipt)
    print(json.dumps({
        "status": receipt["status"],
        "wiki_review_complete": complete,
        "wiki_history_status_counts": registry["summary"]["wiki_history_status_counts"],
    }, indent=2))


if __name__ == "__main__":
    main()
