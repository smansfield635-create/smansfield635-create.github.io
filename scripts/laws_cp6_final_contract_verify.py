#!/usr/bin/env python3
"""Compatibility entrypoint for the current CP6 authority verifier."""

import re
from pathlib import Path
import laws_cp6_current_authority_verify as verifier


def current_ids(path: str) -> set[str]:
    text = (Path(__file__).resolve().parents[1] / path).read_text(encoding="utf-8")
    if path.endswith("canonical-records-v1.html"):
        return set(re.findall(r'(CP6-CONTENT-\d+)', text))
    return set(re.findall(r'data-content-id="(CP6-CONTENT-\d+)"', text))


verifier.ids = current_ids

if __name__ == "__main__":
    verifier.main()
