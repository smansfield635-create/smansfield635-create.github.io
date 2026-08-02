#!/usr/bin/env python3
"""Apply the exact retained Laws CP6 synchronization deltas.

This patch is intentionally non-generative. It changes only:
1. Signals 20-cycle study context;
2. Measure 20-cycle study context;
3. Reverse Audit held-out sample/comparator context;
4. collapsible destination navigation layered onto the accepted zero-open engine;
5. the bounded battery-context module on the Laws landing page.

It refuses broad rewrites and preserves the PR #494 exclusive-or-zero reading contract.
"""

from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

SIGNALS = ROOT / "laws/categories/flow/signals/index.html"
MEASURE = ROOT / "laws/categories/reality/measure.html"
REVERSE = ROOT / "laws/test/reverse-audit/index.html"
RENEWAL_JS = ROOT / "assets/laws-destination/renewal.js"
LAWS_INDEX = ROOT / "laws/index.html"
RECEIPT = ROOT / "laws/control-plane/renewal/laws-complete-renewal-batch-materialization-receipt-v1.json"

SIGNALS_OLD = (
    "In the selected battery study, a combined representation ranked the defined near-term event "
    "strongly in three complete cells excluded from development: AUROC 0.9394 across 1,653 final-test "
    "records. That is bounded held-out support for detection of the defined event, not proof of a "
    "distinct mechanism."
)
SIGNALS_NEW = (
    "In the selected battery study, the defined near-term event was evaluated within the next 20 cycles. "
    "A combined representation ranked that event strongly in three complete cells excluded from "
    "development: AUROC 0.9394 across 1,653 final-test records. That is bounded held-out support for "
    "detection of the defined event, not proof of a distinct mechanism."
)

MEASURE_OLD = (
    "The selected battery study reported ranking metrics for one defined near-term event. "
    "The values below remain inseparable from the cell-disjoint evaluation, event definition, "
    "comparators, and unresolved transfer conditions."
)
MEASURE_NEW = (
    "The selected battery study reported ranking metrics for one defined near-term event evaluated "
    "within the next 20 cycles. The values below remain inseparable from the cell-disjoint evaluation, "
    "event definition, comparators, and unresolved transfer conditions."
)

REVERSE_HEADING = "<h3>The selected battery result did not survive every interpretation.</h3>"
REVERSE_NEW = (
    REVERSE_HEADING
    + "\n            <p>The defined battery event was evaluated within the next 20 cycles across 1,653 final-test "
      "cycle records from three held-out cells, and reverse challenge preserved the stronger conventional "
      "aging-burden comparator at AUROC 0.9704 against the combined model at AUROC 0.9394 before component "
      "ablations and threshold behavior were considered.</p>"
)

NAV_STYLE = """  const navigationStylesheet = '/assets/laws-destination/renewal-navigation.css?v=LAWS_COMPLETE_RENEWAL_COLLAPSIBLE_NAVIGATION_V1';
  if (!document.querySelector(`link[href^="${navigationStylesheet.split('?')[0]}"]`)) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = navigationStylesheet;
    link.dataset.lawsRenewalNavigation = 'true';
    document.head.appendChild(link);
  }

"""

NAV_FUNCTION = """  const setupCollapsibleNavigation = () => {
    const compactQuery = window.matchMedia('(max-width: 920px)');

    document.querySelectorAll('.lr-topbar').forEach((topbar, index) => {
      const nav = topbar.querySelector('.lr-nav');
      if (!nav || topbar.querySelector('.lr-nav-toggle')) return;

      if (!nav.id) nav.id = `lr-page-navigation-${index + 1}`;

      const toggle = document.createElement('button');
      toggle.className = 'lr-nav-toggle';
      toggle.type = 'button';
      toggle.setAttribute('aria-controls', nav.id);
      toggle.innerHTML = '<span class="lr-nav-toggle__label">Page menu</span><span class="lr-nav-toggle__icon" aria-hidden="true">⌄</span>';

      let userOverride = false;
      const setExpanded = (expanded, returnFocus = false) => {
        toggle.setAttribute('aria-expanded', String(expanded));
        toggle.setAttribute('aria-label', expanded ? 'Collapse page menu' : 'Expand page menu');
        topbar.dataset.lrNavExpanded = String(expanded);
        nav.hidden = !expanded;

        if (!expanded && nav.contains(document.activeElement)) {
          toggle.focus();
        } else if (returnFocus) {
          toggle.focus();
        }
      };

      const applyViewportDefault = () => {
        if (userOverride) return;
        setExpanded(!compactQuery.matches);
      };

      toggle.addEventListener('click', () => {
        userOverride = true;
        setExpanded(toggle.getAttribute('aria-expanded') !== 'true');
      });

      toggle.addEventListener('keydown', (event) => {
        if (event.key !== 'ArrowDown' || toggle.getAttribute('aria-expanded') === 'true') return;
        event.preventDefault();
        userOverride = true;
        setExpanded(true);
        const firstLink = nav.querySelector('a, button, [tabindex]:not([tabindex="-1"])');
        if (firstLink) firstLink.focus();
      });

      nav.addEventListener('keydown', (event) => {
        if (event.key !== 'Escape') return;
        event.preventDefault();
        userOverride = true;
        setExpanded(false, true);
      });

      topbar.insertBefore(toggle, nav);
      applyViewportDefault();

      if (typeof compactQuery.addEventListener === 'function') {
        compactQuery.addEventListener('change', applyViewportDefault);
      }
    });
  };

"""

BATTERY_STYLESHEET = '<link data-laws-complete-renewal-battery="true" rel="stylesheet" href="/assets/laws-destination/renewal-batch.css?v=LAWS_COMPLETE_RENEWAL_BATCH_V1">'
BATTERY_SECTION = """<section class="cp6-context cp6-landing-context lr-battery-landing" id="cp6-work-behind-laws" aria-labelledby="cp6-work-behind-laws-title" data-battery-study="BATTERY_COHERENCE_HELDOUT_STUDY_v1">
  <p class="cp6-eyebrow">The work behind the Laws</p>
  <h2 id="cp6-work-behind-laws-title">One real study moves through the entire chamber without becoming twenty-seven different studies.</h2>
  <p>The current source-confirmed example is battery health. Laws separates the real problem, admitted evidence, methods, recurring relationships, tests, findings, and limits. Frontier retains the complete study record.</p>
  <div class="lr-study-stats"><div><span>Held-out population</span><strong>3 held-out cells</strong></div><div><span>Final-test observations</span><strong>1,653 final-test cycle records</strong></div><div><span>Warning target</span><strong>20-cycle warning horizon</strong></div><div><span>Combined model</span><strong>AUROC 0.9394</strong></div><div><span>Burden comparator</span><strong>AUROC 0.9704</strong></div></div>
  <p><strong>Boundary retained:</strong> the combined model showed strong held-out discrimination, but the conventional burden comparator performed better. No causal, external-replication, or operational-readiness claim is made.</p>
  <div class="lr-action-row"><a href="/laws/research/applied-investigations/">Enter the Laws interpretation</a><a href="/frontier/energy/battery-coherence-study/">Open the complete Frontier record</a></div>
</section>"""


def exact_replace(path: Path, old: str, new: str) -> bool:
    text = path.read_text(encoding="utf-8")
    if new in text:
        return False
    if text.count(old) != 1:
        raise SystemExit(f"EXACT_TARGET_COUNT_INVALID:{path}:{text.count(old)}")
    path.write_text(text.replace(old, new, 1), encoding="utf-8")
    return True


def patch_navigation() -> bool:
    text = RENEWAL_JS.read_text(encoding="utf-8")
    if "collapsePanels(buttons, panels)" not in text:
        raise SystemExit("ZERO_OPEN_ENGINE_NOT_PRESENT")
    if "activate(tabs, panels" in text:
        raise SystemExit("OBSOLETE_PRESELECTED_TAB_ENGINE_PRESENT")

    changed = False
    if "const navigationStylesheet" not in text:
        anchor = "  root.classList.add('lr-js');\n\n"
        if text.count(anchor) != 1:
            raise SystemExit("NAV_STYLE_ANCHOR_INVALID")
        text = text.replace(anchor, anchor + NAV_STYLE, 1)
        changed = True

    if "const setupCollapsibleNavigation" not in text:
        anchor = "  const collapsePanels = (buttons, panels) => {"
        if text.count(anchor) != 1:
            raise SystemExit("NAV_FUNCTION_ANCHOR_INVALID")
        text = text.replace(anchor, NAV_FUNCTION + anchor, 1)
        changed = True

    if "  setupCollapsibleNavigation();\n\n  document.querySelectorAll('.lr-status-grid')" not in text:
        anchor = "  document.querySelectorAll('.lr-status-grid').forEach((grid) => {"
        if text.count(anchor) != 1:
            raise SystemExit("NAV_CALL_ANCHOR_INVALID")
        text = text.replace(anchor, "  setupCollapsibleNavigation();\n\n" + anchor, 1)
        changed = True

    if changed:
        RENEWAL_JS.write_text(text, encoding="utf-8")
    return changed


def patch_landing() -> bool:
    text = LAWS_INDEX.read_text(encoding="utf-8")
    changed = False
    if BATTERY_STYLESHEET not in text:
        if text.count("</head>") != 1:
            raise SystemExit("HEAD_CLOSE_COUNT_INVALID")
        text = text.replace("</head>", BATTERY_STYLESHEET + "\n</head>", 1)
        changed = True

    pattern = re.compile(
        r'<section class="cp6-context cp6-landing-context(?: lr-battery-landing)?" id="cp6-work-behind-laws".*?</section>',
        flags=re.S,
    )
    matches = pattern.findall(text)
    if len(matches) != 1:
        raise SystemExit(f"BATTERY_SECTION_COUNT_INVALID:{len(matches)}")
    if matches[0] != BATTERY_SECTION:
        text = pattern.sub(BATTERY_SECTION, text, count=1)
        changed = True

    if changed:
        LAWS_INDEX.write_text(text, encoding="utf-8")
    return changed


def main() -> int:
    required = [SIGNALS, MEASURE, REVERSE, RENEWAL_JS, LAWS_INDEX, RECEIPT]
    missing = [str(path) for path in required if not path.exists()]
    if missing:
        raise SystemExit(f"MISSING_REQUIRED_FILES:{missing}")

    changes = {
        "signals": exact_replace(SIGNALS, SIGNALS_OLD, SIGNALS_NEW),
        "measure": exact_replace(MEASURE, MEASURE_OLD, MEASURE_NEW),
        "reverse_audit": exact_replace(REVERSE, REVERSE_HEADING, REVERSE_NEW),
        "collapsible_navigation": patch_navigation(),
        "laws_landing_battery_context": patch_landing(),
    }

    for path in [SIGNALS, MEASURE, REVERSE, LAWS_INDEX]:
        normalized = "\n".join(line.rstrip() for line in path.read_text(encoding="utf-8").splitlines()) + "\n"
        path.write_text(normalized, encoding="utf-8")

    receipt = json.loads(RECEIPT.read_text(encoding="utf-8"))
    receipt["final_synchronization"] = {
        "contract": "LAWS_CP6_FINAL_SYNCHRONIZATION_v1",
        "status": "APPLIED_PENDING_EXACT_HEAD_VERIFICATION",
        "changes": changes,
        "zero_open_entry_preserved": True,
        "collapsible_navigation_preserved": True,
        "battery_public_surface_scope": 27,
        "held_out_cells": 3,
        "final_test_cycle_records": 1653,
        "warning_horizon_cycles": 20,
        "combined_model_auroc": 0.9394,
        "burden_comparator_auroc": 0.9704,
        "evidence_status_upgrade": False,
        "claim_ceiling_upgrade": False,
        "route_mutation": False,
        "compass_runtime_authority_change": False,
    }
    RECEIPT.write_text(json.dumps(receipt, indent=2) + "\n", encoding="utf-8")

    checks = {
        "signals_context": SIGNALS_NEW in SIGNALS.read_text(encoding="utf-8"),
        "measure_context": MEASURE_NEW in MEASURE.read_text(encoding="utf-8"),
        "reverse_context": REVERSE_NEW in REVERSE.read_text(encoding="utf-8"),
        "zero_open_engine": "collapsePanels(buttons, panels)" in RENEWAL_JS.read_text(encoding="utf-8"),
        "nav_toggle": "setupCollapsibleNavigation" in RENEWAL_JS.read_text(encoding="utf-8"),
        "battery_module": BATTERY_SECTION in LAWS_INDEX.read_text(encoding="utf-8"),
        "battery_stylesheet": BATTERY_STYLESHEET in LAWS_INDEX.read_text(encoding="utf-8"),
    }
    if not all(checks.values()):
        raise SystemExit(f"POSTCHECK_FAILED:{checks}")

    print(json.dumps({"changes": changes, "checks": checks}, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
