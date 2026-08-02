#!/usr/bin/env python3
"""Apply the final bounded Checkpoint 6 battery-result wording correction."""

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
APPLIED = ROOT / "laws/research/applied-investigations/index.html"

OLD = "Burden reached 0.9704 and may encode conventional aging or accumulated use."
NEW = "Burden AUROC 0.9704 may largely encode conventional aging or accumulated use."

REQUIRED = (
    "Combined-axis AUROC 0.9394",
    "Burden AUROC 0.9704",
    "1,653 final-test cycle records",
    "three cells excluded from development",
    "may largely encode conventional aging or accumulated use",
)


def main() -> None:
    text = APPLIED.read_text(encoding="utf-8")
    old_count = text.count(OLD)
    new_count = text.count(NEW)

    if old_count == 1 and new_count == 0:
        text = text.replace(OLD, NEW, 1)
        APPLIED.write_text(text, encoding="utf-8")
    elif old_count == 0 and new_count == 1:
        pass
    else:
        raise SystemExit(
            f"Applied Investigations result wording drift: old={old_count}, new={new_count}"
        )

    final = APPLIED.read_text(encoding="utf-8")
    for required in REQUIRED:
        if required not in final:
            raise SystemExit(f"Applied Investigations missing required result text: {required}")

    print("LAWS_CP6_FINAL_BATTERY_RESULT_RECONCILIATION=PASS")
    print("APPLIED_INVESTIGATIONS_BURDEN_AUROC=0.9704")
    print("PRODUCT_SCOPE=laws/research/applied-investigations/index.html")


if __name__ == "__main__":
    main()
