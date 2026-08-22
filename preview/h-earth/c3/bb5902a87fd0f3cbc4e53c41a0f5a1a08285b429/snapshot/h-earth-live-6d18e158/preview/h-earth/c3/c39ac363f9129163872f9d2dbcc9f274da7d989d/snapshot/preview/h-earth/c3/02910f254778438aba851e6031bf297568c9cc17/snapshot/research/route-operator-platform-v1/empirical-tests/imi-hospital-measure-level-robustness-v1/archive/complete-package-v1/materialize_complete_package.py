#!/usr/bin/env python3
from __future__ import annotations
import argparse, base64, hashlib
from pathlib import Path
EXPECTED = "e818c9b16b8b493d27da9e2d37f9503944b0d7699497a705ad5ec9ddbfefe32d"

def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", type=Path, default=Path("HOSPITAL_MEASURE_LEVEL_IMI_ROBUSTNESS_EXTENSION_1B_COMPLETE_PACKAGE_v1.zip"))
    args = parser.parse_args()
    source = Path(__file__).with_name("HOSPITAL_MEASURE_LEVEL_IMI_ROBUSTNESS_EXTENSION_1B_COMPLETE_PACKAGE_v1.zip.base64")
    raw = base64.b64decode(source.read_text(encoding="ascii"))
    actual = hashlib.sha256(raw).hexdigest()
    if actual != EXPECTED:
        raise SystemExit(f"ZIP SHA-256 mismatch: {actual}")
    args.output.write_bytes(raw)
    print(f"PASS {args.output} {actual}")

if __name__ == "__main__":
    main()
