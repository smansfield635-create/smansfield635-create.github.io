from __future__ import annotations

from pathlib import Path

BRANCH = "agent/laws-cp6-workflow-containment-001"

H_EARTH_WORKFLOWS = [
    ".github/workflows/h-earth-run8a-dimensional-reconciliation-validation.yml",
    ".github/workflows/h-earth-run8e-r1-material-ledger.yml",
    ".github/workflows/h-earth-run8e-mobile-navigation-correction.yml",
    ".github/workflows/h-earth-post-merge-scope-disposition-audit.yml",
    ".github/workflows/h-earth-functional-environment-run7h-live-verification.yml",
    ".github/workflows/h-earth-functional-environment-run7i-public-route-validation.yml",
    ".github/workflows/h-earth-run8e-r1-reference-device-mobile-compatibility.yml",
    ".github/workflows/h-earth-gratitude-region-coordinate-reconciliation.yml",
    ".github/workflows/h-earth-run8e-r1-profiling.yml",
    ".github/workflows/h-earth-functional-landscape-run6-validation.yml",
    ".github/workflows/h-earth-run8e-direct-inspection-restoration.yml",
    ".github/workflows/h-earth-run8-phase3-live-browser-proof.yml",
    ".github/workflows/h-earth-functional-environment-run7i-live-verification.yml",
]

METAVERSE_WORKFLOWS = [
    ".github/workflows/metaverse-benchmark-four-compass-tool.yml",
    ".github/workflows/metaverse-benchmark-four-compass-tool-smoke.yml",
]

H_EARTH_PATHS = [
    "h-earth-3d/**",
    "h-earth/**",
    "showroom/globe/h-earth/**",
    "preview/h-earth/**",
    ".h-earth-evaluation/**",
    "gauges/h-earth/**",
    "tools/h-earth-*",
]

METAVERSE_PATHS = [
    "verification/benchmark-tools/four-compass-benchmark-v1/**",
    "assets/compass/**",
    "products/index.html",
    "products/index.js",
    "showroom/index.html",
    "showroom/index.js",
]


def pull_request_block(text: str) -> tuple[int, int] | None:
    lines = text.splitlines(keepends=True)
    start = None
    for index, line in enumerate(lines):
        if line.rstrip("\r\n") == "  pull_request:":
            start = index
            break
    if start is None:
        return None
    end = len(lines)
    for index in range(start + 1, len(lines)):
        raw = lines[index].rstrip("\r\n")
        if raw and not raw.startswith(" "):
            end = index
            break
        if raw.startswith("  ") and not raw.startswith("    "):
            end = index
            break
    return start, end


def ensure_paths(path: str, patterns: list[str]) -> bool:
    file_path = Path(path)
    if not file_path.exists():
        raise SystemExit(f"MISSING_WORKFLOW:{path}")
    text = file_path.read_text(encoding="utf-8")
    lines = text.splitlines(keepends=True)
    block = pull_request_block(text)
    if block is None:
        raise SystemExit(f"MISSING_PULL_REQUEST_TRIGGER:{path}")
    start, end = block
    block_text = "".join(lines[start:end])
    if "\n    paths:\n" in block_text or "\r\n    paths:\r\n" in block_text:
        return False

    insertion = None
    for index in range(start + 1, end):
        raw = lines[index].rstrip("\r\n")
        if raw == "    branches:":
            insertion = index + 1
            while insertion < end:
                candidate = lines[insertion].rstrip("\r\n")
                if candidate.startswith("      - "):
                    insertion += 1
                    continue
                break
            break
    if insertion is None:
        insertion = start + 1

    scoped = list(patterns) + [path]
    addition = ["    paths:\n"] + [f"      - '{item}'\n" for item in scoped]
    lines[insertion:insertion] = addition
    file_path.write_text("".join(lines), encoding="utf-8")
    return True


changed: list[str] = []
for workflow in H_EARTH_WORKFLOWS:
    if ensure_paths(workflow, H_EARTH_PATHS):
        changed.append(workflow)

for workflow in METAVERSE_WORKFLOWS:
    if ensure_paths(workflow, METAVERSE_PATHS):
        changed.append(workflow)

four_compass = Path(".github/workflows/laws-four-compass-exact-head-regression.yml").read_text(encoding="utf-8")
if '      - "laws/**"' in four_compass:
    raise SystemExit("LAWS_FOUR_COMPASS_REMAINS_BROAD")

standalone_first = Path(".github/workflows/laws-compass-first-test-benchmark.yml").read_text(encoding="utf-8")
if "pull_request:" in standalone_first:
    raise SystemExit("STANDALONE_FIRST_REMAINS_AUTOMATIC")
if "workflow_dispatch:" not in standalone_first:
    raise SystemExit("STANDALONE_FIRST_MANUAL_TRIGGER_MISSING")

for workflow in H_EARTH_WORKFLOWS + METAVERSE_WORKFLOWS:
    text = Path(workflow).read_text(encoding="utf-8")
    block = pull_request_block(text)
    if block is None:
        raise SystemExit(f"POSTCHECK_MISSING_PULL_REQUEST:{workflow}")
    lines = text.splitlines(keepends=True)
    start, end = block
    if "paths:" not in "".join(lines[start:end]):
        raise SystemExit(f"POSTCHECK_UNSCOPED_PULL_REQUEST:{workflow}")

Path(".github/workflows/laws-cp6-workflow-containment-materialize.yml").unlink(missing_ok=True)
Path("scripts/laws_cp6_workflow_containment_materialize.py").unlink(missing_ok=True)

print({
    "branch": BRANCH,
    "changed_workflows": changed,
    "h_earth_workflow_count": len(H_EARTH_WORKFLOWS),
    "metaverse_workflow_count": len(METAVERSE_WORKFLOWS),
    "temporary_carrier_removed": True,
})
