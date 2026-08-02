#!/usr/bin/env python3
"""Complete required Checkpoint 6 public contextual fields without widening scope."""

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

APPLIED = ROOT / "laws/research/applied-investigations/index.html"
LAW_FILES = {
    ROOT / "laws/categories/flow/index.html": 2,
    ROOT / "laws/categories/integrity/index.html": 3,
    ROOT / "laws/categories/reality/index.html": 3,
    ROOT / "laws/categories/structure/index.html": 2,
}

OLD_APPLIED = (
    '<div><dt>What was studied</dt><dd>Cycle-level records from research battery cells.</dd></div>'
    '<div><dt>Why it matters</dt><dd>Earlier health warning could support inspection and intervention before battery-supported continuity is lost.</dd></div>'
    '<div><dt>Evidence status</dt><dd>Domain-specific cell-disjoint held-out empirical support.</dd></div>'
)

NEW_APPLIED = (
    '<div><dt>What was studied</dt><dd>Cycle-level records from research battery cells.</dd></div>'
    '<div><dt>Why it matters</dt><dd>Earlier health warning could support inspection and intervention before battery-supported continuity is lost.</dd></div>'
    '<div><dt>System examined</dt><dd>Research battery cells evaluated through cycle-level operating records.</dd></div>'
    '<div><dt>Data or observations</dt><dd>1,653 final-test cycle records from CS2_34, CS2_36, and CS2_38, evaluated against the below-80%-retained-capacity event within 20 cycles.</dd></div>'
    '<div><dt>Current evidence status</dt><dd>Domain-specific cell-disjoint held-out empirical support.</dd></div>'
    '<div><dt>Primary Frontier authority</dt><dd>Power and Energy is the accepted future organizational authority. The current active compatibility and source surface remains Energy at /explore/frontier/energy/.</dd></div>'
)

OBSERVED = (
    '<p><strong>What the study observed:</strong> The combined model reached AUROC 0.9394 across '
    '1,653 held-out cycle records from three cells; the burden comparator reached AUROC 0.9704.</p>'
)


def replace_exact(path: Path, old: str, new: str, expected: int) -> None:
    text = path.read_text(encoding="utf-8")
    count = text.count(old)
    if count != expected:
        raise SystemExit(f"{path}: expected {expected} occurrences, found {count}")
    path.write_text(text.replace(old, new), encoding="utf-8")


def main() -> None:
    replace_exact(APPLIED, OLD_APPLIED, NEW_APPLIED, 1)

    for path, expected in LAW_FILES.items():
        text = path.read_text(encoding="utf-8")
        header_old = '<span>Battery health · Power and Energy</span>'
        header_new = '<span><strong>Study:</strong> Battery health · <strong>Primary Frontier domain:</strong> Power and Energy</span>'
        if text.count(header_old) != expected:
            raise SystemExit(f"{path}: relationship header count drift")
        text = text.replace(header_old, header_new)

        boundary_marker = '</p><p><strong>Where the claim stops:</strong>'
        if text.count(boundary_marker) != expected:
            raise SystemExit(f"{path}: claim-boundary count drift")
        text = text.replace(boundary_marker, f'</p>{OBSERVED}<p><strong>Where the claim stops:</strong>')
        path.write_text(text, encoding="utf-8")

    applied_text = APPLIED.read_text(encoding="utf-8")
    for required in (
        'System examined',
        'Data or observations',
        'Current evidence status',
        'Primary Frontier authority',
        '/explore/frontier/energy/',
    ):
        if required not in applied_text:
            raise SystemExit(f"Applied Investigations missing {required}")

    total_relationships = 0
    for path, expected in LAW_FILES.items():
        text = path.read_text(encoding="utf-8")
        if text.count('<strong>What the study observed:</strong>') != expected:
            raise SystemExit(f"{path}: observation-field count drift")
        if text.count('<strong>Primary Frontier domain:</strong>') != expected:
            raise SystemExit(f"{path}: domain-field count drift")
        total_relationships += expected

    if total_relationships != 10:
        raise SystemExit(f"Expected ten material law relationships, found {total_relationships}")

    print('LAWS_CP6_CONTEXT_FIELD_RECONCILIATION=PASS')
    print('APPLIED_REQUIRED_FIELDS=PASS')
    print('MATERIAL_LAW_RELATIONSHIPS=10')


if __name__ == '__main__':
    main()
