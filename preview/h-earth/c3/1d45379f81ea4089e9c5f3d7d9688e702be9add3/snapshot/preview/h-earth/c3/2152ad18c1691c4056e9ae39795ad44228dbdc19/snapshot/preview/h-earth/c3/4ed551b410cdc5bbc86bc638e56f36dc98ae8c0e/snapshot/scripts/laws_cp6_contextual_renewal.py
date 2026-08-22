#!/usr/bin/env python3
"""Apply the source-bound Checkpoint 6 Laws contextual renewal.

The transform is deliberately bounded:
- preserves all existing routes and migrated content;
- adds contextual study views without duplicating the complete Frontier record;
- does not touch Compass controller/runtime assets;
- does not claim future Frontier deployment or upgrade evidence status.
"""

from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
AUTH_DIR = ROOT / "laws/control-plane/cp6-context"
CROSSWALK = AUTH_DIR / "laws-frontier-compatibility-crosswalk-v1.json"
BATTERY = AUTH_DIR / "laws-battery-study-contextual-interpretation-record-v1.json"
STYLE = ROOT / "laws/cp6-contextual-renewal.css"
VERIFY = AUTH_DIR / "contextual-renewal-verification-v1.json"

STYLE_HREF = "/laws/cp6-contextual-renewal.css?v=LAWS_CP6_CONTEXTUAL_RENEWAL_V1"
STYLE_TAG = f'<link data-laws-cp6-contextual-renewal="true" href="{STYLE_HREF}" rel="stylesheet"/>'

DESTINATION_BLOCKS = {
    "laws/research/applied-investigations/index.html": r'''
<section class="cp6-context cp6-study-index" id="cp6-battery-study-index" data-cp6-contextual-renewal="applied-investigations">
  <p class="cp6-eyebrow">The work behind the Laws · Selected study</p>
  <h2>Battery health: a real system, a held-out test, and a bounded result</h2>
  <p class="cp6-lead">Frontier preserves the complete battery investigation. Laws explains why it matters, what was measured, what happened, and where the conclusion stops.</p>
  <div class="cp6-domain-grid" aria-label="Future Frontier organizational domains">
    <article class="cp6-domain-card cp6-domain-card--active"><span>Power and Energy</span><h3>Battery held-out degradation study</h3><dl><div><dt>What was studied</dt><dd>Cycle-level records from research battery cells.</dd></div><div><dt>Why it matters</dt><dd>Earlier health warning could support inspection and intervention before battery-supported continuity is lost.</dd></div><div><dt>Evidence status</dt><dd>Domain-specific cell-disjoint held-out empirical support.</dd></div><div><dt>Strongest bounded result</dt><dd>Combined-axis AUROC 0.9394 across 1,653 final-test records from three cells excluded from development.</dd></div><div><dt>Unresolved issue</dt><dd>Burden reached 0.9704 and may encode conventional aging or accumulated use.</dd></div></dl><p class="cp6-actions"><a href="/frontier/energy/battery-coherence-study/">Open complete Frontier study</a><a href="/laws/research/evidence-and-sources/">Evidence</a><a href="/laws/research/methods-and-models/">Method</a><a href="/laws/research/findings-and-boundaries/">Findings</a></p></article>
    <article class="cp6-domain-card"><span>Water, Contamination and Health</span><p>No additional source-confirmed study is admitted into this Checkpoint 6 candidate.</p></article>
    <article class="cp6-domain-card"><span>Materials, Waste and Recovery</span><p>No additional source-confirmed study is admitted into this Checkpoint 6 candidate.</p></article>
    <article class="cp6-domain-card"><span>Infrastructure, Transport and Resilience</span><p>No additional source-confirmed study is admitted into this Checkpoint 6 candidate.</p></article>
    <article class="cp6-domain-card"><span>Housing, Cities and Community Systems</span><p>No additional source-confirmed study is admitted into this Checkpoint 6 candidate.</p></article>
  </div>
  <details class="cp6-audit"><summary>Organizational boundary</summary><p>The five-domain and two-laboratory model is an accepted organizational target. It does not claim that future Frontier routes or a Frontier Compass are deployed. Current Frontier routes remain the active compatibility and source surfaces.</p></details>
</section>''',
    "laws/research/evidence-and-sources/index.html": r'''
<section class="cp6-context" id="cp6-battery-evidence" data-cp6-contextual-renewal="evidence-and-sources">
  <p class="cp6-eyebrow">Selected study · Battery health</p><h2>What evidence entered the study?</h2>
  <div class="cp6-fact-grid"><article><h3>Dataset or source type</h3><p>Cycle-level research battery records preserved through the complete Frontier study and its pinned structured evidence authority.</p></article><article><h3>Observation unit</h3><p>One cycle-level evaluation record. Final evaluation contained 1,653 records from CS2_34, CS2_36, and CS2_38.</p></article><article><h3>Evidence window</h3><p>Three complete cells excluded from development; target event was crossing below 80% retained capacity within the next 20 cycles. No calendar-date window is stated in the pinned public source.</p></article><article><h3>Provenance</h3><p>Structured authority: <code>assets/evidence/battery-coherence-heldout-study-v1.js</code>, pinned to the frozen Checkpoint 6 baseline.</p></article><article><h3>Exclusions</h3><p>Consumer-phone usage data, other chemistries, deployed critical systems, and independent external replication are not established by this record.</p></article><article><h3>Missing evidence</h3><p>Conventional-aging controls, burden ablation, chemistry transfer, external replication, threshold calibration, and operational false-alarm analysis remain required.</p></article></div>
  <div class="cp6-boundary-grid"><article><h3>What it can support</h3><p>A strong cell-disjoint held-out ranking result inside the stated battery evaluation.</p></article><article><h3>What it cannot establish</h3><p>Causation, a distinct coherence mechanism, universal chemistry transfer, critical-system deployment, infrastructure validation, or a universal law.</p></article></div>
  <p class="cp6-actions"><a href="/frontier/energy/battery-coherence-study/">Complete study</a><a href="/laws/research/applied-investigations/">Study view</a><a href="/laws/research/methods-and-models/">Method view</a><a href="/laws/research/findings-and-boundaries/">Findings view</a></p>
</section>''',
    "laws/research/methods-and-models/index.html": r'''
<section class="cp6-context" id="cp6-battery-method" data-cp6-contextual-renewal="methods-and-models">
  <p class="cp6-eyebrow">Selected study · Battery health</p><h2>How was the result constructed?</h2>
  <div class="cp6-fact-grid"><article><h3>Variables</h3><p>Direct physical battery inputs informed derived B/P/E/I/V representations. The pinned public source does not contain a complete field-level data dictionary.</p></article><article><h3>Equations</h3><p><strong>Not restated here.</strong> Exact B/P/E/I/V equations are not present in the pinned public authority, so this page admits the procedure and reported outputs without reconstructing decorative mathematics.</p></article><article><h3>Baseline and comparators</h3><p>Raw physical baseline 0.7850; burden 0.9704; H* 0.7712; raw plus H* 0.7770; weakest-axis risk 0.6743; hard MQ threshold evaluated separately.</p></article><article><h3>Procedure</h3><p>Freeze the representation, separate development and final evaluation by complete cell, evaluate the fixed 80%-within-20-cycles event, compare components and baselines, and preserve negative results.</p></article><article><h3>Expected output</h3><p>Ranking performance for the defined near-term event, reported primarily by AUROC, plus component and threshold outcomes.</p></article><article><h3>Falsification rule</h3><p>The representation could fail through chance-level held-out ranking, loss to ordinary baselines, no incremental component value, failed threshold behavior, or disappearance after conventional-aging controls.</p></article></div>
  <p class="cp6-status-line"><strong>Status:</strong> executed cell-disjoint held-out evaluation. Mechanistic specificity, chemistry transfer, external replication, and operational deployment remain unresolved.</p>
  <p class="cp6-actions"><a href="/frontier/energy/battery-coherence-study/">Complete study</a><a href="/laws/research/applied-investigations/">Study view</a><a href="/laws/research/evidence-and-sources/">Evidence view</a><a href="/laws/research/findings-and-boundaries/">Findings view</a></p>
</section>''',
    "laws/research/findings-and-boundaries/index.html": r'''
<section class="cp6-context" id="cp6-battery-findings" data-cp6-contextual-renewal="findings-and-boundaries">
  <p class="cp6-eyebrow">Selected study · Battery health</p><h2>What held, what failed, and where the claim stops</h2>
  <div class="cp6-result-stack"><article class="cp6-result cp6-result--supported"><h3>Supported result</h3><p>The combined representation ranked the defined event strongly in three cells excluded from development: AUROC 0.9394 across 1,653 final-test records.</p></article><article class="cp6-result cp6-result--negative"><h3>Negative result</h3><p>H* did not improve the raw model; incremental delta was −0.0080. The hard MQ threshold produced zero sensitivity and balanced accuracy 0.4994.</p></article><article class="cp6-result cp6-result--mixed"><h3>Mixed result</h3><p>Weakest-axis risk reached 0.6743, above chance but insufficient for a general weakest-axis law.</p></article><article class="cp6-result cp6-result--open"><h3>Competing explanation</h3><p>Burden reached 0.9704 and may re-express cycle age, accumulated throughput, current capacity, or recent decline.</p></article></div>
  <div class="cp6-boundary-grid"><article><h3>Claim ceiling</h3><p>Strong domain-specific cell-disjoint held-out empirical support for the defined event within the named three-cell evaluation.</p></article><article><h3>Replication status</h3><p>Independent external replication is not complete.</p></article><article><h3>Prohibited claims</h3><p>No general battery validation, universal chemistry support, distinct mechanism, critical-system approval, infrastructure validation, fusion validation, or universal coherence-law validation.</p></article><article><h3>Required next study</h3><p>Control conventional aging, ablate burden, test incremental value, transfer across cell families and chemistries, externally replicate, and calibrate operational thresholds without test leakage.</p></article></div>
  <p class="cp6-actions"><a href="/frontier/energy/battery-coherence-study/">Complete study</a><a href="/laws/research/applied-investigations/">Study view</a><a href="/laws/research/evidence-and-sources/">Evidence view</a><a href="/laws/research/methods-and-models/">Method view</a></p>
</section>''',
    "laws/test/admission-and-baseline/index.html": r'''
<section class="cp6-context cp6-test-view" id="cp6-battery-admission" data-selected-study="BATTERY_COHERENCE_HELDOUT_STUDY_v1">
  <p class="cp6-eyebrow">Selected study · Battery health · Test 1 of 4</p><h2>Admission and Baseline</h2><p class="cp6-lead">What was allowed into the study?</p>
  <dl class="cp6-test-ledger"><div><dt>Practical system</dt><dd>Research battery cells observed through cycle-level records.</dd></div><div><dt>Final-test admission</dt><dd>CS2_34, CS2_36, and CS2_38; all excluded from development.</dd></div><div><dt>Observation count</dt><dd>1,653 cycle-level final-test records.</dd></div><div><dt>Fixed outcome</dt><dd>Crossing below 80% retained capacity within the next 20 cycles.</dd></div><div><dt>Baseline</dt><dd>Raw physical model, AUROC 0.7850.</dd></div><div><dt>Excluded inference</dt><dd>No general chemistry, critical-system, infrastructure, clinical, or universal-law inference.</dd></div></dl>
  <p class="cp6-actions"><a href="/frontier/energy/battery-coherence-study/">Complete study view</a><a href="/laws/research/evidence-and-sources/">Evidence view</a><a href="/laws/research/methods-and-models/">Method view</a><a href="/laws/research/findings-and-boundaries/">Findings view</a></p>
</section>''',
    "laws/test/forward-construction/index.html": r'''
<section class="cp6-context cp6-test-view" id="cp6-battery-forward" data-selected-study="BATTERY_COHERENCE_HELDOUT_STUDY_v1">
  <p class="cp6-eyebrow">Selected study · Battery health · Test 2 of 4</p><h2>Forward Construction</h2><p class="cp6-lead">What was specified before the final result?</p>
  <dl class="cp6-test-ledger"><div><dt>Design</dt><dd>Cell-disjoint held-out evaluation: development and final evaluation separated by complete battery cell.</dd></div><div><dt>Target</dt><dd>A fixed retained-capacity event within a fixed 20-cycle horizon.</dd></div><div><dt>Primary construction</dt><dd>Combined B/P/E/I/V-derived ranking model.</dd></div><div><dt>Required comparisons</dt><dd>Burden, raw physical baseline, H*, raw plus H*, weakest-axis risk, and hard MQ threshold.</dd></div><div><dt>Failure exposure</dt><dd>The primary model could lose to conventional predictors; components or thresholds could fail; support could disappear under aging controls.</dd></div><div><dt>Construction status</dt><dd>Executed for the reported held-out evaluation. Exact equations are not reconstructed because they are absent from the pinned public source.</dd></div></dl>
  <p class="cp6-actions"><a href="/frontier/energy/battery-coherence-study/">Complete study view</a><a href="/laws/research/evidence-and-sources/">Evidence view</a><a href="/laws/research/methods-and-models/">Method view</a><a href="/laws/research/findings-and-boundaries/">Findings view</a></p>
</section>''',
    "laws/test/reverse-audit/index.html": r'''
<section class="cp6-context cp6-test-view" id="cp6-battery-reverse" data-selected-study="BATTERY_COHERENCE_HELDOUT_STUDY_v1">
  <p class="cp6-eyebrow">Selected study · Battery health · Test 3 of 4</p><h2>Reverse Audit</h2><p class="cp6-lead">How was the result challenged?</p>
  <div class="cp6-result-stack"><article class="cp6-result cp6-result--open"><h3>Stronger ordinary explanation</h3><p>Burden reached AUROC 0.9704, exceeding the combined model and leaving conventional aging or accumulated use open.</p></article><article class="cp6-result cp6-result--negative"><h3>Incremental challenge</h3><p>Raw plus H* reached 0.7770 versus raw 0.7850; H* incremental delta was −0.0080.</p></article><article class="cp6-result cp6-result--mixed"><h3>Weakest-axis challenge</h3><p>AUROC 0.6743 was above chance but remained preliminary.</p></article><article class="cp6-result cp6-result--negative"><h3>Threshold challenge</h3><p>The hard MQ conjunction produced zero true positives, zero sensitivity, and balanced accuracy 0.4994.</p></article></div>
  <p class="cp6-status-line"><strong>Audit consequence:</strong> the result remains promising inside the battery domain, while mechanism, confound independence, external replication, and operational use remain open.</p>
  <p class="cp6-actions"><a href="/frontier/energy/battery-coherence-study/">Complete study view</a><a href="/laws/research/evidence-and-sources/">Evidence view</a><a href="/laws/research/methods-and-models/">Method view</a><a href="/laws/research/findings-and-boundaries/">Findings view</a></p>
</section>''',
    "laws/test/result-and-record/index.html": r'''
<section class="cp6-context cp6-test-view" id="cp6-battery-result" data-selected-study="BATTERY_COHERENCE_HELDOUT_STUDY_v1">
  <p class="cp6-eyebrow">Selected study · Battery health · Test 4 of 4</p><h2>Result and Record</h2><p class="cp6-lead">What conclusion and claim ceiling were preserved?</p>
  <div class="cp6-boundary-grid"><article><h3>Preserved result</h3><p>Combined-axis AUROC 0.9394 across 1,653 held-out records from three cells excluded from development.</p></article><article><h3>Preserved limitation</h3><p>Burden reached 0.9704 and may reflect ordinary aging exposure; decisive controls remain incomplete.</p></article><article><h3>Preserved failures</h3><p>No incremental H* gain; weakest-axis result preliminary; hard MQ threshold unsupported.</p></article><article><h3>Claim ceiling</h3><p>Strong domain-specific cell-disjoint held-out support only. No universal law, mechanism, chemistry-transfer, critical-system, or deployment claim.</p></article></div>
  <p class="cp6-actions"><a href="/frontier/energy/battery-coherence-study/">Complete study view</a><a href="/laws/research/evidence-and-sources/">Evidence view</a><a href="/laws/research/methods-and-models/">Method view</a><a href="/laws/research/findings-and-boundaries/">Findings view</a></p>
</section>''',
}

LANDING_BLOCK = r'''
<section class="cp6-context cp6-landing-context" id="cp6-work-behind-laws" aria-labelledby="cp6-work-behind-laws-title">
  <p class="cp6-eyebrow">The work behind the Laws</p><h2 id="cp6-work-behind-laws-title">Real research gives the Compass something concrete to explain.</h2>
  <blockquote>Frontier examines real systems such as batteries, water, pollution, infrastructure, and cities. The Laws Chamber explains how those investigations relate to Flow, Integrity, Reality, Structure, and Test—without changing their evidence status or replacing the complete Frontier record.</blockquote>
  <p>The current source-confirmed example is battery health: three held-out cells, 1,653 final-test records, a 20-cycle warning horizon, a strong bounded result, a stronger conventional-aging explanation, and preserved negative findings.</p>
  <p class="cp6-actions"><a href="/laws/research/applied-investigations/">Understand the study in Laws</a><a href="/frontier/energy/battery-coherence-study/">Open the complete Frontier record</a></p>
</section>'''

RELATIONSHIPS = {
    "laws/categories/flow/index.html": [
        ("Signals", "/laws/categories/flow/signals/", "Cycle-level measurements and derived axes were evaluated as warning signals for a defined near-term capacity event.", "Signal ranking does not establish physical cause or operational alert readiness."),
        ("Cycles", "/laws/categories/flow/cycles/", "The observation unit was cycle-level and the target horizon was the next 20 cycles.", "The 20-cycle horizon is study-specific, not a universal warning interval."),
    ],
    "laws/categories/integrity/index.html": [
        ("Consistency", "/laws/categories/integrity/consistency/", "The final test asked whether ranking remained informative after evaluation moved to three cells excluded from development.", "The result does not establish consistency across all cells or chemistries."),
        ("Continuity", "/laws/categories/integrity/continuity/", "Earlier battery-health warning could support future inspection or intervention before battery-supported service is interrupted.", "No continuity benefit was validated in a deployed critical system."),
        ("Coherence", "/laws/categories/integrity/coherence/", "The combined B/P/E/I/V representation was tested jointly while component failures and rival explanations were preserved.", "A distinct coherence mechanism remains unresolved because burden and conventional aging may explain the result."),
    ],
    "laws/categories/reality/index.html": [
        ("Evidence", "/laws/categories/reality/evidence/", "The admitted record contains 1,653 held-out cycle-level observations from CS2_34, CS2_36, and CS2_38.", "This operation did not reopen raw execution artifacts or establish external replication."),
        ("Measure", "/laws/categories/reality/measure/", "AUROC and threshold outcomes distinguish the primary model, comparators, mixed result, and failed MQ test.", "AUROC measures ranking; it does not prove causation or deployment utility."),
        ("Limits", "/laws/categories/reality/limits/", "The record separates battery-domain support from mechanism, chemistry transfer, replication, and deployment claims.", "The claim ceiling remains domain-specific held-out empirical support only."),
    ],
    "laws/categories/structure/index.html": [
        ("Constraints", "/laws/categories/structure/constraints/", "Case selection, a fixed event, a fixed horizon, comparators, and required controls shaped what the study could conclude.", "Changing those constraints creates a different study requiring new evaluation."),
        ("Boundaries", "/laws/categories/structure/boundaries/", "The record marks the boundary between a strong held-out battery result and unproven mechanism, transfer, deployment, or universal law.", "No Laws relationship may imply stronger evidence than the complete Frontier record supports."),
    ],
}

CSS = r'''
.cp6-context{width:min(1120px,calc(100% - 2rem));margin:clamp(1.25rem,3vw,2.5rem) auto;padding:clamp(1.25rem,3vw,2.25rem);border:1px solid color-mix(in srgb,currentColor 16%,transparent);border-radius:1.5rem;background:linear-gradient(145deg,rgba(255,255,255,.075),rgba(255,255,255,.025));box-shadow:0 1.4rem 4rem rgba(0,0,0,.24)}
.cp6-context h2{font-size:clamp(1.75rem,4vw,3rem);line-height:1.05;margin:.35rem 0 1rem}.cp6-context h3{margin:.2rem 0 .55rem;font-size:1.05rem}.cp6-context p{max-width:78ch}.cp6-eyebrow{font-size:.76rem;font-weight:800;letter-spacing:.14em;text-transform:uppercase;opacity:.72}.cp6-lead{font-size:clamp(1.05rem,2vw,1.3rem);opacity:.86}.cp6-domain-grid,.cp6-fact-grid,.cp6-boundary-grid,.cp6-result-stack,.cp6-relationship-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem;margin-top:1.2rem}.cp6-domain-card,.cp6-fact-grid article,.cp6-boundary-grid article,.cp6-result,.cp6-relationship{padding:1rem;border:1px solid color-mix(in srgb,currentColor 14%,transparent);border-radius:1rem;background:rgba(0,0,0,.18)}.cp6-domain-card--active{grid-column:1/-1}.cp6-domain-card>span,.cp6-relationship>span{display:block;font-size:.75rem;font-weight:800;letter-spacing:.1em;text-transform:uppercase;opacity:.72}.cp6-domain-card dl,.cp6-test-ledger{display:grid;gap:.7rem}.cp6-domain-card dl div,.cp6-test-ledger div{display:grid;grid-template-columns:minmax(9rem,.4fr) 1fr;gap:1rem;padding-top:.7rem;border-top:1px solid color-mix(in srgb,currentColor 12%,transparent)}.cp6-context dt{font-weight:800}.cp6-context dd{margin:0;opacity:.86}.cp6-actions{display:flex;flex-wrap:wrap;gap:.65rem;margin-top:1.2rem}.cp6-actions a{display:inline-flex;padding:.62rem .85rem;border:1px solid color-mix(in srgb,currentColor 22%,transparent);border-radius:999px;text-decoration:none;background:rgba(255,255,255,.055)}.cp6-audit{margin-top:1rem;padding:1rem;border-top:1px solid color-mix(in srgb,currentColor 14%,transparent)}.cp6-result--supported{border-left:.3rem solid #72d9a4}.cp6-result--negative{border-left:.3rem solid #e08b8b}.cp6-result--mixed{border-left:.3rem solid #dbbf6a}.cp6-result--open{border-left:.3rem solid #78bfe8}.cp6-status-line,.cp6-relationship-boundary{padding:1rem;border-radius:1rem;background:rgba(0,0,0,.2)}.cp6-landing-context blockquote{margin:1rem 0;padding:1rem 1.2rem;border-left:.25rem solid currentColor;font-size:clamp(1.05rem,2vw,1.3rem);opacity:.9}.cp6-relationship h3 a{color:inherit}.cp6-relationship .cp6-actions{margin-top:.8rem}.cp6-relationship .cp6-actions a{font-size:.8rem;padding:.45rem .65rem}@media(max-width:760px){.cp6-domain-grid,.cp6-fact-grid,.cp6-boundary-grid,.cp6-result-stack,.cp6-relationship-grid{grid-template-columns:1fr}.cp6-domain-card--active{grid-column:auto}.cp6-domain-card dl div,.cp6-test-ledger div{grid-template-columns:1fr;gap:.25rem}.cp6-context{width:min(100% - 1rem,1120px);padding:1rem;border-radius:1.1rem}.cp6-actions a{width:100%;justify-content:center}}
@media(prefers-reduced-motion:reduce){.cp6-context *{scroll-behavior:auto!important;transition:none!important;animation:none!important}}
'''


def load_authorities() -> tuple[dict, dict]:
    crosswalk = json.loads(CROSSWALK.read_text(encoding="utf-8"))
    battery = json.loads(BATTERY.read_text(encoding="utf-8"))
    assert crosswalk["contract"] == "LAWS_FRONTIER_COMPATIBILITY_CROSSWALK_v1"
    assert len(crosswalk["mappings"]) == 11
    assert battery["contract"] == "LAWS_BATTERY_STUDY_CONTEXTUAL_INTERPRETATION_RECORD_v1"
    assert battery["data_and_observation_units"]["held_out_cell_count"] == 3
    assert battery["data_and_observation_units"]["final_test_record_count"] == 1653
    assert battery["data_and_observation_units"]["warning_horizon_cycles"] == 20
    assert battery["baselines_and_comparators"][0]["auroc"] == 0.9394
    assert battery["baselines_and_comparators"][1]["auroc"] == 0.9704
    return crosswalk, battery


def add_style(text: str) -> str:
    if STYLE_HREF in text:
        return text
    if "</head>" not in text:
        raise RuntimeError("Missing </head> marker")
    return text.replace("</head>", STYLE_TAG + "</head>", 1)


def insert_after_hero(text: str, block: str) -> str:
    marker = re.search(r'id="(cp6-[^"]+)"', block)
    if marker and marker.group(1) in text:
        return text
    main = re.search(r'<main\b[^>]*\bid="main"[^>]*>', text, flags=re.I)
    if not main:
        raise RuntimeError("Missing main#main")
    hero = re.search(r'<section\b[^>]*class="[^"]*\bhero\b[^"]*"[^>]*>', text[main.end():], flags=re.I)
    if not hero:
        raise RuntimeError("Missing hero section")
    hero_start = main.end() + hero.start()
    hero_end = text.find("</section>", hero_start)
    if hero_end < 0:
        raise RuntimeError("Unclosed hero section")
    hero_end += len("</section>")
    return text[:hero_end] + block + text[hero_end:]


def insert_landing(text: str) -> str:
    if 'id="cp6-work-behind-laws"' in text:
        return text
    lowered = text.lower()
    phrase = "the work behind the laws"
    index = lowered.find(phrase)
    if index >= 0:
        section = lowered.rfind("<section", 0, index)
        if section >= 0:
            return text[:section] + LANDING_BLOCK + text[section:]
    end = lowered.rfind("</main>")
    if end < 0:
        raise RuntimeError("Missing landing </main>")
    return text[:end] + LANDING_BLOCK + text[end:]


def relationship_block(rows: list[tuple[str, str, str, str]]) -> str:
    cards = []
    for title, route, explains, boundary in rows:
        cards.append(f'''<article class="cp6-relationship"><span>Battery health · Power and Energy</span><h3><a href="{route}">{title}</a></h3><p><strong>Current evidence:</strong> domain-specific cell-disjoint held-out empirical support.</p><p><strong>What this law explains:</strong> {explains}</p><p><strong>Why it matters:</strong> the relationship connects an abstract law term to an observed battery study without changing the study's evidence status.</p><p><strong>Where the claim stops:</strong> {boundary}</p><p class="cp6-actions"><a href="/frontier/energy/battery-coherence-study/">Complete study</a><a href="/laws/research/evidence-and-sources/">Evidence</a><a href="/laws/research/methods-and-models/">Method</a><a href="/laws/research/findings-and-boundaries/">Findings</a></p></article>''')
    return '''<section class="cp6-context cp6-law-relationships" id="cp6-battery-law-relationships"><p class="cp6-eyebrow">Where this appears in real research</p><h2>Battery health relationships admitted for this law family</h2><div class="cp6-relationship-grid">''' + "".join(cards) + '''</div><p class="cp6-relationship-boundary"><strong>Relationship boundary:</strong> Only materially relevant children are shown. The complete study remains in Frontier, and no relationship upgrades its claim status.</p></section>'''


def insert_before_main_end(text: str, block: str) -> str:
    if 'id="cp6-battery-law-relationships"' in text:
        return text
    end = text.lower().rfind("</main>")
    if end < 0:
        raise RuntimeError("Missing </main>")
    return text[:end] + block + text[end:]


def write_changed(path: Path, content: str) -> bool:
    previous = path.read_text(encoding="utf-8")
    if previous == content:
        return False
    path.write_text(content, encoding="utf-8")
    return True


def main() -> None:
    crosswalk, battery = load_authorities()
    changed: list[str] = []
    STYLE.write_text(CSS.strip() + "\n", encoding="utf-8")
    changed.append(str(STYLE.relative_to(ROOT)))

    for relative, block in DESTINATION_BLOCKS.items():
        path = ROOT / relative
        text = path.read_text(encoding="utf-8")
        revised = insert_after_hero(add_style(text), block)
        if write_changed(path, revised):
            changed.append(relative)

    landing = ROOT / "laws/index.html"
    landing_text = landing.read_text(encoding="utf-8")
    if write_changed(landing, insert_landing(add_style(landing_text))):
        changed.append("laws/index.html")

    for relative, rows in RELATIONSHIPS.items():
        path = ROOT / relative
        text = path.read_text(encoding="utf-8")
        revised = insert_before_main_end(add_style(text), relationship_block(rows))
        if write_changed(path, revised):
            changed.append(relative)

    required_markers = {
        "laws/index.html": "cp6-work-behind-laws",
        "laws/research/applied-investigations/index.html": "cp6-battery-study-index",
        "laws/research/evidence-and-sources/index.html": "cp6-battery-evidence",
        "laws/research/methods-and-models/index.html": "cp6-battery-method",
        "laws/research/findings-and-boundaries/index.html": "cp6-battery-findings",
        "laws/test/admission-and-baseline/index.html": "cp6-battery-admission",
        "laws/test/forward-construction/index.html": "cp6-battery-forward",
        "laws/test/reverse-audit/index.html": "cp6-battery-reverse",
        "laws/test/result-and-record/index.html": "cp6-battery-result",
        "laws/categories/flow/index.html": "cp6-battery-law-relationships",
        "laws/categories/integrity/index.html": "cp6-battery-law-relationships",
        "laws/categories/reality/index.html": "cp6-battery-law-relationships",
        "laws/categories/structure/index.html": "cp6-battery-law-relationships",
    }
    for relative, marker in required_markers.items():
        content = (ROOT / relative).read_text(encoding="utf-8")
        assert marker in content, f"Missing {marker} in {relative}"
        assert STYLE_HREF in content, f"Missing shared style in {relative}"

    verification = {
        "contract": "LAWS_CP6_CONTEXTUAL_RENEWAL_VERIFICATION_v1",
        "status": "STATIC_TRANSFORM_PASS",
        "authority_inputs": [crosswalk["contract"], battery["contract"]],
        "selected_study": battery["study_identity"]["study_id"],
        "changed_product_files": sorted([p for p in changed if not p.startswith("laws/control-plane/")]),
        "expected_product_file_count": 14,
        "landing_pages_mutated": 1,
        "research_children_mutated": 4,
        "test_children_mutated": 4,
        "law_family_authorities_mutated": 4,
        "shared_stylesheets_created": 1,
        "route_deletions": 0,
        "redirects_created": 0,
        "frontier_files_mutated": 0,
        "compass_controller_files_mutated": 0,
        "compass_runtime_files_mutated": 0,
        "evidence_status_upgrades": 0,
        "future_frontier_deployment_claims": 0,
        "complete_frontier_study_duplications": 0,
        "quantitative_values_source_bound": True,
        "exact_equations_reconstructed": False,
        "public_audit_separation_present": True,
        "reduced_motion_rule_present": True,
        "required_next_verification": [
            "HTML_STRUCTURE_AND_LINK_CHECK",
            "PHONE_BROWSER_PRESENTATION",
            "TABLET_BROWSER_PRESENTATION",
            "DESKTOP_BROWSER_PRESENTATION",
            "REDUCED_MOTION_BROWSER_PRESENTATION",
            "STATIC_PRESENTATION",
            "KEYBOARD_AND_TOUCH_OPERATION",
            "LIVE_USER_VISUAL_REVIEW"
        ]
    }
    VERIFY.write_text(json.dumps(verification, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(verification, indent=2))


if __name__ == "__main__":
    main()
