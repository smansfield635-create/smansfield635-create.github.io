#!/usr/bin/env python3
"""Run the OSF corpus harvester with registration-file support.

The base harvester uses the node file endpoint. Public registrations expose files
through the parallel registrations endpoint. This wrapper preserves the base
harvester while selecting the first valid provider endpoint for each resource.
"""

from __future__ import annotations

import sys
from typing import Any

import harvest_osf_corpus as base


def _collect_from_endpoint(endpoint: str, resource_id: str) -> tuple[list[dict[str, Any]], list[str]]:
    files: list[dict[str, Any]] = []
    errors: list[str] = []
    providers = base.paginate(endpoint)
    for provider in providers:
        provider_name = (provider.get("attributes") or {}).get("name") or provider.get("id") or "unknown"
        href = base.relationship_href(provider, "files")
        if not href:
            continue
        queue = [href]
        seen: set[str] = set()
        while queue:
            current = queue.pop(0)
            if current in seen:
                continue
            seen.add(current)
            try:
                entries = base.paginate(current)
            except Exception as exc:  # noqa: BLE001
                errors.append(f"files:{resource_id}:{provider_name}: {exc}")
                continue
            for entry in entries:
                entry["_provider"] = provider_name
                files.append(entry)
                attrs = entry.get("attributes") or {}
                if attrs.get("kind") == "folder":
                    child_href = base.relationship_href(entry, "files")
                    if child_href:
                        queue.append(child_href)
    return files, errors


def registration_aware_list_files(resource_id: str) -> tuple[list[dict[str, Any]], list[str]]:
    attempts: list[str] = []
    for collection in ("registrations", "nodes"):
        endpoint = f"{base.API_ROOT}/{collection}/{resource_id}/files/?page%5Bsize%5D=100"
        try:
            return _collect_from_endpoint(endpoint, resource_id)
        except Exception as exc:  # noqa: BLE001
            attempts.append(f"{collection}:{exc}")
    return [], [f"providers:{resource_id}: " + " | ".join(attempts)]


base.list_node_files = registration_aware_list_files

if __name__ == "__main__":
    raise SystemExit(base.main())
