#!/usr/bin/env python3
"""Materialize the frozen Laws Chamber renewal across the remaining routes.

This script is deterministic and presentation-only. It consumes the frozen narrative,
route, and battery-scope authorities already present in the repository. Existing public
page content is preserved inside a collapsed custody disclosure; no evidence, equation,
claim ceiling, canonical owner, route, or Frontier ownership is changed.
"""

from __future__ import annotations

import html
import json
import re
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
NARRATIVE_PATH = ROOT / "laws/control-plane/narrative/laws-complete-narrative-map-v1.json"
ROUTE_MANIFEST_PATH = ROOT / "laws/control-plane/renewal/laws-complete-renewal-remaining-20-route-migration-manifest-v1.json"
BATTERY_SCOPE_PATH = ROOT / "laws/control-plane/renewal/laws-complete-renewal-battery-study-presentation-scope-v1.json"
OUTPUT_RECEIPT_PATH = ROOT / "laws/control-plane/renewal/laws-complete-renewal-batch-materialization-receipt-v1.json"

BATTERY = {
    "study_id": "BATTERY_COHERENCE_HELDOUT_STUDY_v1",
    "label": "Battery health held-out study",
    "cells": "3 held-out cells",
    "records": "1,653 final-test cycle records",
    "horizon": "20-cycle warning horizon",
    "combined": "Combined model AUROC 0.9394",
    "burden": "Burden comparator AUROC 0.9704",
    "frontier": "/frontier/energy/battery-coherence-study/",
    "authority": "/laws/control-plane/cp6-context/laws-battery-study-contextual-interpretation-record-v1.json",
}

FAMILY_META = {
    "FLOW": {
        "route": "/laws/categories/flow/",
        "question": "How does battery health change become detectable, repeat, and accumulate over cycles?",
        "role": "Flow separates signal detection from recurrence and keeps the warning horizon distinct from physical cause.",
        "expression": "SIGNAL → CYCLE → HORIZON → BOUNDED WARNING",
        "children": [("Signals", "/laws/categories/flow/signals/"), ("Cycles", "/laws/categories/flow/cycles/")],
        "practical": "Recognize the reading and the cycle interval in which attention may be warranted.",
        "engineering": "Keep source measurements, feature construction, cycle identity, threshold, and warning horizon explicit.",
        "empirical": "Report held-out discrimination and comparator performance without converting ranking into mechanism.",
        "boundary": "The study supports a bounded warning relationship. It does not establish physical causation or operational alert readiness.",
    },
    "INTEGRITY": {
        "route": "/laws/categories/integrity/",
        "question": "What remained consistent, continuous, and coherent across held-out battery cells?",
        "role": "Integrity asks whether the study's identities, procedures, and relationships remain traceable across separated cells and records.",
        "expression": "IDENTITY → CONSISTENCY → CONTINUITY → COHERENCE",
        "children": [("Consistency", "/laws/categories/integrity/consistency/"), ("Continuity", "/laws/categories/integrity/continuity/"), ("Coherence", "/laws/categories/integrity/coherence/")],
        "practical": "Ask whether the warning means the same thing when the held-out cell changes.",
        "engineering": "Preserve cell-disjoint separation, feature definitions, observation ordering, custody, and comparator identity.",
        "empirical": "Inspect whether performance survives held-out cells and whether conventional aging burden explains more than the combined model.",
        "boundary": "Cross-cell consistency within three held-out cells is not external replication or fleet-wide generality.",
    },
    "REALITY": {
        "route": "/laws/categories/reality/",
        "question": "What does the battery evidence support, and where does the public claim stop?",
        "role": "Reality separates admitted observations, measured performance, interpretation, and the claim ceiling.",
        "expression": "EVIDENCE → MEASURE → INTERPRETATION → LIMIT",
        "children": [("Evidence", "/laws/categories/reality/evidence/"), ("Measure", "/laws/categories/reality/measure.html"), ("Limits", "/laws/categories/reality/limits/")],
        "practical": "State what was observed and what decision the result might eventually inform.",
        "engineering": "Expose sample identity, target horizon, metrics, comparators, missing controls, and validation state.",
        "empirical": "Preserve all measured results, including the stronger burden comparator and negative or mixed findings.",
        "boundary": "The held-out result is domain-specific support, not proof of cause, deployment fitness, or universal law.",
    },
    "STRUCTURE": {
        "route": "/laws/categories/structure/",
        "question": "Which constraints and boundaries shaped the battery study and its admissible interpretation?",
        "role": "Structure makes the study population, held-out split, horizon, comparator set, operating envelope, and transfer boundary visible.",
        "expression": "CONSTRAINTS + BOUNDARIES → ADMISSIBLE CLAIM",
        "children": [("Constraints", "/laws/categories/structure/constraints/"), ("Boundaries", "/laws/categories/structure/boundaries/")],
        "practical": "Show the tested batteries, records, horizon, and the practical conditions that remain outside scope.",
        "engineering": "Bind the cell-disjoint split, target definition, feature availability, comparator set, and route ownership.",
        "empirical": "Keep observed performance inside the tested population and preserve unresolved transfer and deployment questions.",
        "boundary": "A result cannot be transferred beyond the declared study and operating boundaries without new evidence.",
    },
}


def read_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def esc(value: Any) -> str:
    return html.escape(str(value or ""), quote=True)


def slug(value: str) -> str:
    cleaned = re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")
    return cleaned or "laws-page"


def body_fragment(source: str) -> str:
    match = re.search(r"<main\b[^>]*>(.*?)</main>", source, flags=re.I | re.S)
    if not match:
        match = re.search(r"<body\b[^>]*>(.*?)</body>", source, flags=re.I | re.S)
    fragment = match.group(1) if match else source
    fragment = re.sub(r"<script\b[^>]*>.*?</script>", "", fragment, flags=re.I | re.S)
    fragment = re.sub(r"<style\b[^>]*>.*?</style>", "", fragment, flags=re.I | re.S)
    fragment = re.sub(r"\s+id=(['\"])main\1", "", fragment, flags=re.I)
    fragment = re.sub(r"\s+autofocus(?:=(['\"]).*?\1)?", "", fragment, flags=re.I)
    return fragment.strip()


def source_fragment(path: Path) -> str:
    if not path.exists():
        return '<p data-lr-source-missing="true">The prior public source was not present at materialization time.</p>'
    return body_fragment(path.read_text(encoding="utf-8"))


def family_route(authority: str) -> str:
    upper = authority.upper()
    if upper in {"FLOW", "INTEGRITY", "REALITY", "STRUCTURE"}:
        return f"/laws/categories/{upper.lower()}/"
    if upper == "TEST":
        return "/laws/test/"
    if upper == "RESEARCH":
        return "/laws/research/"
    return "/laws/"


def relation_status(page: dict[str, Any]) -> str:
    related = page.get("related_study") or {}
    return str(related.get("relationship_status") or "NO_CURRENT_ADMITTED_STUDY")


def visual_nodes(expression: str) -> list[str]:
    if not expression:
        return []
    pieces = re.split(r"\s*(?:→|←|↔|⇄|\+|\|)\s*", expression)
    cleaned = [p.strip() for p in pieces if p.strip()]
    if len(cleaned) <= 1 and "=" not in expression:
        cleaned = [expression.strip()]
    return cleaned[:8]


def render_visual(page: dict[str, Any]) -> str:
    visual = page.get("primary_visual_or_equation") or {}
    visual_type = esc(visual.get("type", "RELATIONSHIP_MAP")).replace("_", " ")
    expression = str(visual.get("expression") or "")
    delivery = str(visual.get("delivery") or "The relationship is presented as a structured, bounded visual rather than decorative notation.")
    is_formula = "=" in expression or "EQUATION" in str(visual.get("type", "")) or "FORMULA" in str(visual.get("type", ""))
    nodes = visual_nodes(expression)
    if is_formula:
        expression_html = f'<pre class="lr-formula"><code>{esc(expression)}</code></pre>'
    else:
        expression_html = f'<p class="lr-visual-board__expression">{esc(expression)}</p>' if expression else ""
    node_html = "".join(
        f'<div class="lr-visual-board__node"><strong>{esc(node)}</strong><span>Distinct stage in the declared relationship.</span></div>'
        for node in nodes
    )
    return f"""
      <div class="lr-visual-board" data-lr-visual-type="{slug(str(visual.get('type', 'relationship-map')))}">
        <span class="lr-visual-board__type">{visual_type}</span>
        {expression_html}
        <p class="lr-visual-board__delivery">{esc(delivery)}</p>
        <div class="lr-visual-board__nodes">{node_html}</div>
      </div>
    """


def render_tabs(page: dict[str, Any], page_slug: str) -> str:
    primary = str(page.get("primary_lens") or "PRACTICAL").upper()
    lenses = [
        ("PRACTICAL", "Practical", page.get("practical_lens") or "Translate the relationship into the real decision or experience it is intended to clarify."),
        ("ENGINEERING", "Engineering", page.get("engineering_lens") or "Expose components, variables, thresholds, dependencies, and execution state."),
        ("EMPIRICAL", "Empirical", page.get("empirical_lens") or "State the admitted observations, measured result, uncertainty, and unresolved evidence."),
    ]
    buttons = []
    panels = []
    for key, label, copy in lenses:
        selected = key == primary
        buttons.append(
            f'<button class="lr-tab" id="{page_slug}-tab-{key.lower()}" role="tab" aria-selected="{str(selected).lower()}" type="button">{label}</button>'
        )
        panels.append(
            f'<article class="lr-panel" id="{page_slug}-panel-{key.lower()}" role="tabpanel"><h3>{label} reading</h3><p>{esc(copy)}</p></article>'
        )
    return f"""
      <div class="lr-tabs" data-lr-tabs>
        <div class="lr-tablist" role="tablist" aria-label="{esc(page.get('page_title'))} reading layers">{''.join(buttons)}</div>
        <div class="lr-panels">{''.join(panels)}</div>
      </div>
    """


def battery_stats() -> str:
    pairs = [
        ("Held-out population", BATTERY["cells"]),
        ("Final-test observations", BATTERY["records"]),
        ("Warning target", BATTERY["horizon"]),
        ("Combined model", "AUROC 0.9394"),
        ("Burden comparator", "AUROC 0.9704"),
    ]
    return '<div class="lr-study-stats">' + "".join(
        f'<div><span>{esc(label)}</span><strong>{esc(value)}</strong></div>' for label, value in pairs
    ) + "</div>"


def render_study(page: dict[str, Any]) -> str:
    status = relation_status(page)
    if status == "NO_CURRENT_ADMITTED_STUDY":
        return f"""
        <article class="lr-no-study-card">
          <p class="lr-kicker">Study discipline</p>
          <h3>No current admitted study</h3>
          <p>This page keeps its law or procedural relationship available without inserting the battery study merely to fill the presentation.</p>
          <p><strong>Boundary:</strong> A future study relationship requires separate source admission and cannot be inferred from visual similarity.</p>
        </article>
        """
    return f"""
        <article class="lr-study-card" data-battery-study="{BATTERY['study_id']}">
          <p class="lr-kicker">Materially admitted study relationship</p>
          <h3>{esc(BATTERY['label'])}</h3>
          <p>This page presents only its assigned Laws or Test slice. The complete execution record remains in Frontier.</p>
          {battery_stats()}
          <p><strong>Preserved finding:</strong> the conventional aging-burden comparator performed better than the combined model. This negative or mixed result remains part of the public interpretation.</p>
          <div class="lr-action-row">
            <a href="{BATTERY['frontier']}">Complete Frontier record</a>
            <a href="/laws/research/evidence-and-sources/">Evidence and sources</a>
            <a href="/laws/research/methods-and-models/">Methods and models</a>
            <a href="/laws/research/findings-and-boundaries/">Findings and boundaries</a>
          </div>
        </article>
    """


def render_story_link(item: dict[str, Any], direction: str) -> str:
    label = item.get("label") or ("Previous" if direction == "previous" else "Next")
    route = item.get("route") or "/laws/"
    return f'<a href="{esc(route)}"><span>{direction.title()}</span><strong>{esc(label)}</strong></a>'


def canonical_url(route: str) -> str:
    served = route
    if route == "/laws/categories/reality/measure/":
        served = "/laws/categories/reality/measure.html"
    return "https://diamondgatebridge.com" + served


def render_child(page: dict[str, Any], source_path: str) -> str:
    route = str(page["route"])
    title = str(page.get("page_title") or "Laws")
    authority = str(page.get("authority") or "LAWS").upper()
    page_slug = slug(f"{authority}-{title}")
    old = source_fragment(ROOT / source_path)
    audit = page.get("audit_record") or {}
    sequence = page.get("sequence_index") or "—"
    previous = page.get("previous_story_beat") or {"label": "Laws Compass", "route": "/laws/"}
    next_item = page.get("next_story_beat") or {"label": "Laws Compass", "route": "/laws/"}
    related = relation_status(page)
    return f"""<!doctype html>
<html lang="en" data-route="{esc(route)}" data-narrative-route="{esc(route)}" data-page-family="{esc(authority)}_CHILD" data-laws-complete-renewal="v1" data-laws-story-sequence="{esc(sequence)}" data-study-relationship="{esc(related)}" data-scientific-validation-claimed="false" data-universal-law-proven="false">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
  <title>{esc(title)} · {esc(authority.title())} · Laws · Diamond Gate Bridge</title>
  <meta name="description" content="{esc(page.get('question_answered'))}">
  <link rel="canonical" href="{canonical_url(route)}">
  <link rel="icon" href="data:,">
  <link rel="stylesheet" href="/assets/laws-destination/renewal.css?v=LAWS_COMPLETE_RENEWAL_V1">
  <link rel="stylesheet" href="/assets/laws-destination/renewal-navigation.css?v=LAWS_COMPLETE_RENEWAL_COLLAPSIBLE_NAVIGATION_V1">
  <link rel="stylesheet" href="/assets/laws-destination/renewal-batch.css?v=LAWS_COMPLETE_RENEWAL_BATCH_V1">
  <script defer src="/assets/laws-destination/renewal.js?v=LAWS_COMPLETE_RENEWAL_COLLAPSIBLE_NAVIGATION_V1"></script>
</head>
<body>
<a class="lr-skip" href="#main">Skip to {esc(title)}</a>
<div class="lr-shell">
  <header class="lr-topbar">
    <a class="lr-brand" href="/laws/" aria-label="Return to Laws Chamber">
      <span class="lr-brand__mark" aria-hidden="true"><span>LAW</span></span>
      <span class="lr-brand__copy"><small>{esc(authority.title())} · Story {esc(sequence)} of 24</small><strong>{esc(title)}</strong></span>
    </a>
    <nav class="lr-nav" aria-label="{esc(title)} navigation">
      <a href="/">Main Compass</a><a href="/laws/">Laws Compass</a><a href="{family_route(authority)}">{esc(authority.title())} family</a>
    </nav>
  </header>
  <main class="lr-main" id="main">
    <section class="lr-hero" aria-labelledby="page-title">
      <p class="lr-kicker">{esc(authority.title())} · {esc(page.get('story_phase', 'Chamber relationship'))}</p>
      <h1 class="lr-title" id="page-title">{esc(title)}</h1>
      <p class="lr-question">{esc(page.get('question_answered'))}</p>
      <p class="lr-lede">{esc(page.get('page_role'))}</p>
      <dl class="lr-status-grid">
        <div><dt>Story position</dt><dd>{esc(sequence)} of 24</dd></div>
        <div><dt>Primary reading</dt><dd>{esc(page.get('primary_lens', 'PRACTICAL')).title()}</dd></div>
        <div><dt>Study relationship</dt><dd>{esc(related.replace('_', ' ').title())}</dd></div>
      </dl>
    </section>
    <section class="lr-section" aria-labelledby="relationship-title">
      <header class="lr-section__head"><p class="lr-kicker">Primary relationship</p><h2 id="relationship-title">The page-specific relationship</h2><p>{esc((page.get('primary_visual_or_equation') or {}).get('delivery'))}</p></header>
      {render_visual(page)}
    </section>
    <section class="lr-section" aria-labelledby="lenses-title">
      <header class="lr-section__head"><p class="lr-kicker">Reading layers</p><h2 id="lenses-title">Practical, Engineering, and Empirical claims remain separate.</h2><p>One lens is active on entry. The other readings remain available without being treated as interchangeable.</p></header>
      {render_tabs(page, page_slug)}
    </section>
    <section class="lr-section" aria-labelledby="study-title">
      <header class="lr-section__head"><p class="lr-kicker">Applied relationship</p><h2 id="study-title">Where this page meets real research</h2></header>
      {render_study(page)}
    </section>
    <section class="lr-boundary" aria-labelledby="boundary-title"><p class="lr-kicker">Claim boundary</p><h2 id="boundary-title">Where the interpretation stops</h2><p>{esc(page.get('boundary_statement'))}</p></section>
    <nav class="lr-story-nav" aria-label="Laws narrative context">{render_story_link(previous, 'previous')}{render_story_link(next_item, 'next')}</nav>
    <details class="lr-audit" data-lr-audit>
      <summary>Canonical record, source presentation, and custody</summary>
      <div class="lr-audit__body">
        <div class="lr-audit__meta">
          <div><span>Audit record</span><strong>{esc(audit.get('record_id', 'PRESERVED_SOURCE_RECORD'))}</strong></div>
          <div><span>Source path</span><strong>{esc(source_path)}</strong></div>
          <div><span>Presentation status</span><strong>Collapsed source and custody layer</strong></div>
        </div>
        <p>The prior public source is preserved below as the custody and historical presentation layer. Its evidence statements, canonical IDs, equations, and record ownership remain unchanged.</p>
        <div class="lr-legacy-source">{old}</div>
      </div>
    </details>
  </main>
  <footer class="lr-footer"><span>Diamond Gate Bridge · Laws Chamber</span><a href="/laws/">Return to the Laws Compass</a></footer>
</div>
</body>
</html>
"""


def synthetic_page_for_family(authority: str) -> dict[str, Any]:
    meta = FAMILY_META[authority]
    return {
        "page_title": f"{authority.title()} and the battery study",
        "primary_lens": "EMPIRICAL" if authority == "REALITY" else "ENGINEERING",
        "practical_lens": meta["practical"],
        "engineering_lens": meta["engineering"],
        "empirical_lens": meta["empirical"],
    }


def render_family(authority: str, source_path: str) -> str:
    meta = FAMILY_META[authority]
    old = source_fragment(ROOT / source_path)
    page_slug = slug(f"family-{authority}")
    child_cards = "".join(
        f'<article><h3><a href="{esc(route)}">{esc(label)}</a></h3><p>This admitted child owns one distinct relationship slice and returns to the complete Frontier record.</p></article>'
        for label, route in meta["children"]
    )
    synthetic = synthetic_page_for_family(authority)
    return f"""<!doctype html>
<html lang="en" data-route="{meta['route']}" data-page-family="LAW_FAMILY" data-laws-category="{authority.lower()}" data-laws-complete-renewal="v1" data-battery-study="{BATTERY['study_id']}" data-universal-law-proven="false">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
  <title>{authority.title()} · Battery study relationships · Laws</title>
  <meta name="description" content="{esc(meta['question'])}">
  <link rel="canonical" href="https://diamondgatebridge.com{meta['route']}"><link rel="icon" href="data:,">
  <link rel="stylesheet" href="/assets/laws-destination/renewal.css?v=LAWS_COMPLETE_RENEWAL_V1">
  <link rel="stylesheet" href="/assets/laws-destination/renewal-navigation.css?v=LAWS_COMPLETE_RENEWAL_COLLAPSIBLE_NAVIGATION_V1">
  <link rel="stylesheet" href="/assets/laws-destination/renewal-batch.css?v=LAWS_COMPLETE_RENEWAL_BATCH_V1">
  <script defer src="/assets/laws-destination/renewal.js?v=LAWS_COMPLETE_RENEWAL_COLLAPSIBLE_NAVIGATION_V1"></script>
</head>
<body><a class="lr-skip" href="#main">Skip to {authority.title()}</a><div class="lr-shell">
<header class="lr-topbar"><a class="lr-brand" href="/laws/"><span class="lr-brand__mark" aria-hidden="true"><span>LAW</span></span><span class="lr-brand__copy"><small>Law family · Battery relationship overview</small><strong>{authority.title()}</strong></span></a><nav class="lr-nav" aria-label="{authority.title()} navigation"><a href="/">Main Compass</a><a href="/laws/">Laws Compass</a><a href="{BATTERY['frontier']}">Complete battery study</a></nav></header>
<main class="lr-main" id="main">
<section class="lr-hero"><p class="lr-kicker">{authority.title()} · Source-bound applied relationship</p><h1 class="lr-title">{authority.title()}</h1><p class="lr-question">{esc(meta['question'])}</p><p class="lr-lede">{esc(meta['role'])}</p><dl class="lr-status-grid"><div><dt>Study</dt><dd>{BATTERY['label']}</dd></div><div><dt>Relationship children</dt><dd>{len(meta['children'])} admitted</dd></div><div><dt>Claim posture</dt><dd>Domain-specific, bounded, non-causal</dd></div></dl></section>
<section class="lr-section"><header class="lr-section__head"><p class="lr-kicker">Family relationship</p><h2>One family, distinct child slices</h2><p>The battery study appears only where the frozen narrative map admits a material relationship.</p></header><div class="lr-visual-board"><span class="lr-visual-board__type">{authority.title()} relationship map</span><p class="lr-visual-board__expression">{esc(meta['expression'])}</p><p class="lr-visual-board__delivery">{esc(meta['role'])}</p><div class="lr-family-grid">{child_cards}</div></div></section>
<section class="lr-section"><header class="lr-section__head"><p class="lr-kicker">Reading layers</p><h2>Practical, Engineering, and Empirical readings</h2></header>{render_tabs(synthetic, page_slug)}</section>
<section class="lr-section"><header class="lr-section__head"><p class="lr-kicker">Held-out result</p><h2>The evidence carried into this family</h2></header><article class="lr-family-study">{battery_stats()}<p><strong>Negative or mixed finding preserved:</strong> the burden comparator AUROC 0.9704 exceeded the combined model AUROC 0.9394.</p><div class="lr-action-row"><a href="{BATTERY['frontier']}">Complete Frontier record</a><a href="/laws/research/evidence-and-sources/">Evidence</a><a href="/laws/research/findings-and-boundaries/">Boundaries</a></div></article></section>
<section class="lr-boundary"><p class="lr-kicker">Claim boundary</p><h2>Where this family interpretation stops</h2><p>{esc(meta['boundary'])}</p></section>
<details class="lr-audit"><summary>Complete prior family record and custody</summary><div class="lr-audit__body"><div class="lr-audit__meta"><div><span>Source path</span><strong>{esc(source_path)}</strong></div><div><span>Complete study owner</span><strong>Frontier</strong></div><div><span>Evidence upgrade</span><strong>Prohibited</strong></div></div><div class="lr-legacy-source">{old}</div></div></details>
</main><footer class="lr-footer"><span>Diamond Gate Bridge · Laws Chamber</span><a href="/laws/">Return to Laws Compass</a></footer></div></body></html>
"""


def render_wrapper(route: str, source_path: str, label: str) -> str:
    old = source_fragment(ROOT / source_path)
    return f"""<!doctype html>
<html lang="en" data-route="{esc(route)}" data-page-family="BATTERY_COMPATIBILITY_WRAPPER" data-laws-complete-renewal="v1" data-battery-study="{BATTERY['study_id']}">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><title>{esc(label)} · Battery study · Laws</title><meta name="description" content="Compatibility route for the battery health held-out study and its current canonical Laws and Frontier owners."><link rel="canonical" href="https://diamondgatebridge.com{esc(route)}"><link rel="icon" href="data:,"><link rel="stylesheet" href="/assets/laws-destination/renewal.css?v=LAWS_COMPLETE_RENEWAL_V1"><link rel="stylesheet" href="/assets/laws-destination/renewal-navigation.css?v=LAWS_COMPLETE_RENEWAL_COLLAPSIBLE_NAVIGATION_V1"><link rel="stylesheet" href="/assets/laws-destination/renewal-batch.css?v=LAWS_COMPLETE_RENEWAL_BATCH_V1"><script defer src="/assets/laws-destination/renewal.js?v=LAWS_COMPLETE_RENEWAL_COLLAPSIBLE_NAVIGATION_V1"></script></head>
<body><a class="lr-skip" href="#main">Skip to battery study routes</a><div class="lr-shell"><header class="lr-topbar"><a class="lr-brand" href="/laws/"><span class="lr-brand__mark" aria-hidden="true"><span>BAT</span></span><span class="lr-brand__copy"><small>Compatibility route</small><strong>{esc(label)}</strong></span></a><nav class="lr-nav"><a href="/">Main Compass</a><a href="/laws/">Laws Compass</a><a href="{BATTERY['frontier']}">Complete study</a></nav></header><main class="lr-main" id="main">
<section class="lr-hero"><p class="lr-kicker">Compatibility without duplication</p><h1 class="lr-title">Battery health held-out study</h1><p class="lr-question">Where should this historical route take the reader now?</p><p class="lr-lede">This address remains available for continuity. It does not own a second copy of the study. Laws provides bounded interpretation; Frontier retains the complete execution record.</p><dl class="lr-status-grid"><div><dt>Route status</dt><dd>Retained compatibility wrapper</dd></div><div><dt>Complete owner</dt><dd>Frontier</dd></div><div><dt>Claim status</dt><dd>Unchanged</dd></div></dl></section>
<section class="lr-section"><header class="lr-section__head"><p class="lr-kicker">Choose the correct record</p><h2>One study, distinct reading destinations</h2></header><div class="lr-wrapper-grid"><article><h3>Laws interpretation</h3><p>Read the problem, evidence, method, findings, and limits as separate chamber slices.</p><div class="lr-action-row"><a href="/laws/research/applied-investigations/">Start in Laws</a><a href="/laws/research/findings-and-boundaries/">Findings and boundaries</a></div></article><article><h3>Complete Frontier record</h3><p>Inspect the complete study, held-out design, metrics, comparator result, and full execution context.</p><div class="lr-action-row"><a href="{BATTERY['frontier']}">Open complete study</a></div></article></div></section>
<section class="lr-section"><article class="lr-study-card">{battery_stats()}<p>The burden comparator remained stronger than the combined model. This finding is preserved in every route.</p></article></section>
<section class="lr-boundary"><p class="lr-kicker">Compatibility boundary</p><h2>This route does not become a second canonical study.</h2><p>No metric, result, evidence status, ownership, or claim ceiling is changed by this wrapper.</p></section>
<details class="lr-audit"><summary>Historical route source and custody</summary><div class="lr-audit__body"><div class="lr-audit__meta"><div><span>Source path</span><strong>{esc(source_path)}</strong></div><div><span>Disposition</span><strong>Concise compatibility wrapper</strong></div><div><span>Canonical owner</span><strong>{BATTERY['frontier']}</strong></div></div><div class="lr-legacy-source">{old}</div></div></details>
</main><footer class="lr-footer"><span>Diamond Gate Bridge · Laws Chamber</span><a href="{BATTERY['frontier']}">Complete battery study</a></footer></div></body></html>
"""


def render_frontier(source_path: str) -> str:
    old = source_fragment(ROOT / source_path)
    page = {
        "page_title": "Battery health held-out study",
        "primary_lens": "EMPIRICAL",
        "practical_lens": "The study asks whether cycle-level information can warn of a defined near-term capacity event early enough to merit further investigation.",
        "engineering_lens": "Three cells were held out, 1,653 final-test cycle records were evaluated, the target horizon was 20 cycles, and the combined model was compared with conventional aging burden.",
        "empirical_lens": "The combined model reached AUROC 0.9394; the burden comparator reached AUROC 0.9704. Negative and mixed findings remain controlling.",
    }
    return f"""<!doctype html>
<html lang="en" data-route="{BATTERY['frontier']}" data-page-family="FRONTIER_COMPLETE_STUDY" data-laws-complete-renewal="v1" data-battery-study="{BATTERY['study_id']}" data-complete-record-owner="FRONTIER" data-operational-readiness-claimed="false" data-external-replication-claimed="false">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><title>Battery health held-out study · Frontier</title><meta name="description" content="Complete held-out battery health study record with evidence, method, result, comparator, limitations, and custody."><link rel="canonical" href="https://diamondgatebridge.com{BATTERY['frontier']}"><link rel="icon" href="data:,"><link rel="stylesheet" href="/assets/laws-destination/renewal.css?v=LAWS_COMPLETE_RENEWAL_V1"><link rel="stylesheet" href="/assets/laws-destination/renewal-navigation.css?v=LAWS_COMPLETE_RENEWAL_COLLAPSIBLE_NAVIGATION_V1"><link rel="stylesheet" href="/assets/laws-destination/renewal-batch.css?v=LAWS_COMPLETE_RENEWAL_BATCH_V1"><script defer src="/assets/laws-destination/renewal.js?v=LAWS_COMPLETE_RENEWAL_COLLAPSIBLE_NAVIGATION_V1"></script></head>
<body><a class="lr-skip" href="#main">Skip to battery study</a><div class="lr-shell"><header class="lr-topbar"><a class="lr-brand" href="/frontier/"><span class="lr-brand__mark" aria-hidden="true"><span>FRT</span></span><span class="lr-brand__copy"><small>Frontier · Complete research record</small><strong>Battery health held-out study</strong></span></a><nav class="lr-nav"><a href="/">Main Compass</a><a href="/frontier/">Frontier</a><a href="/laws/research/applied-investigations/">Laws interpretation</a></nav></header><main class="lr-main" id="main">
<section class="lr-hero"><p class="lr-kicker">Power and Energy · Complete study record</p><h1 class="lr-title">Battery health held-out study</h1><p class="lr-question">Can a cycle-level model warn of a defined near-term capacity event on cells excluded from training?</p><p class="lr-lede">Frontier owns the complete study. This presentation exposes the practical problem, held-out design, measured results, stronger comparator, limitations, and full custody without converting bounded support into deployment readiness.</p><dl class="lr-status-grid"><div><dt>Held-out population</dt><dd>3 cells</dd></div><div><dt>Final-test observations</dt><dd>1,653 cycles</dd></div><div><dt>Claim posture</dt><dd>Domain-specific held-out support</dd></div></dl></section>
<section class="lr-section"><header class="lr-section__head"><p class="lr-kicker">Study relationship</p><h2>Evidence moves through a declared held-out test.</h2><p>Every stage remains inspectable: source observations, feature construction, target horizon, cell-disjoint evaluation, comparator, result, and claim ceiling.</p></header><div class="lr-visual-board"><span class="lr-visual-board__type">Held-out study pathway</span><p class="lr-visual-board__expression">CYCLE OBSERVATIONS → MODEL + COMPARATOR → HELD-OUT CELLS → BOUNDED RESULT</p><p class="lr-visual-board__delivery">The study measures discrimination under its declared held-out design. It does not prove mechanism or operational alert readiness.</p><div class="lr-visual-board__nodes"><div class="lr-visual-board__node"><strong>Observations</strong><span>Cycle-level records and derived axes.</span></div><div class="lr-visual-board__node"><strong>Target</strong><span>Defined event within the next 20 cycles.</span></div><div class="lr-visual-board__node"><strong>Held-out test</strong><span>Three excluded cells, 1,653 final-test records.</span></div><div class="lr-visual-board__node"><strong>Comparator</strong><span>Conventional aging burden remained stronger.</span></div></div></div></section>
<section class="lr-section"><header class="lr-section__head"><p class="lr-kicker">Complete study readings</p><h2>Practical, Engineering, and Empirical views</h2></header>{render_tabs(page, 'frontier-battery')}</section>
<section class="lr-section"><header class="lr-section__head"><p class="lr-kicker">Measured result</p><h2>The supported and limiting findings remain together.</h2></header><article class="lr-frontier-summary">{battery_stats()}<p><strong>Result interpretation:</strong> the combined model showed strong held-out discrimination, while the conventional burden comparator performed better. That comparison constrains novelty and mechanism claims.</p><div class="lr-action-row"><a href="/laws/research/evidence-and-sources/">Laws evidence reading</a><a href="/laws/research/methods-and-models/">Laws method reading</a><a href="/laws/research/findings-and-boundaries/">Laws findings reading</a></div></article></section>
<section class="lr-boundary"><p class="lr-kicker">Claim ceiling</p><h2>What this study does not establish</h2><p>No external replication, physical causation, production validation, fleet-wide transfer, alert threshold, or operational deployment readiness is claimed.</p></section>
<details class="lr-audit"><summary>Complete prior Frontier record, methods, evidence, and custody</summary><div class="lr-audit__body"><div class="lr-audit__meta"><div><span>Owner</span><strong>Frontier</strong></div><div><span>Source path</span><strong>{esc(source_path)}</strong></div><div><span>Evidence status</span><strong>Preserved without upgrade</strong></div></div><div class="lr-legacy-source">{old}</div></div></details>
</main><footer class="lr-footer"><span>Diamond Gate Bridge · Frontier</span><a href="/laws/research/applied-investigations/">Read the Laws interpretation</a></footer></div></body></html>
"""


def renew_landing(path: Path) -> bool:
    if not path.exists():
        return False
    source = path.read_text(encoding="utf-8")
    css_link = '<link data-laws-complete-renewal-battery="true" rel="stylesheet" href="/assets/laws-destination/renewal-batch.css?v=LAWS_COMPLETE_RENEWAL_BATCH_V1">'
    if "renewal-batch.css" not in source:
        source = re.sub(r"</head>", css_link + "</head>", source, count=1, flags=re.I)
    replacement = f"""<section class="cp6-context cp6-landing-context lr-battery-landing" id="cp6-work-behind-laws" aria-labelledby="cp6-work-behind-laws-title" data-battery-study="{BATTERY['study_id']}">
  <p class="cp6-eyebrow">The work behind the Laws</p>
  <h2 id="cp6-work-behind-laws-title">One real study moves through the entire chamber without becoming twenty-seven different studies.</h2>
  <p>The current source-confirmed example is battery health. Laws separates the real problem, admitted evidence, methods, recurring relationships, tests, findings, and limits. Frontier retains the complete study record.</p>
  {battery_stats()}
  <p><strong>Boundary retained:</strong> the combined model showed strong held-out discrimination, but the conventional burden comparator performed better. No causal, external-replication, or operational-readiness claim is made.</p>
  <div class="lr-action-row"><a href="/laws/research/applied-investigations/">Enter the Laws interpretation</a><a href="{BATTERY['frontier']}">Open the complete Frontier record</a></div>
</section>"""
    pattern = re.compile(r'<section class="cp6-context cp6-landing-context"\s+id="cp6-work-behind-laws".*?</section>', flags=re.I | re.S)
    if pattern.search(source):
        source = pattern.sub(replacement, source, count=1)
    elif "id=\"cp6-work-behind-laws\"" not in source:
        source = source.replace("<section aria-label=\"Laws supporting orientation\"", replacement + "\n<section aria-label=\"Laws supporting orientation\"", 1)
    path.write_text(source, encoding="utf-8")
    return True


def main() -> int:
    narrative = read_json(NARRATIVE_PATH)
    manifest = read_json(ROUTE_MANIFEST_PATH)
    battery_scope = read_json(BATTERY_SCOPE_PATH)
    pages_by_route = {str(page["route"]): page for page in narrative.get("pages", [])}

    changed: list[str] = []
    missing: list[str] = []

    for wave in manifest.get("migration_waves", []):
        for entry in wave.get("routes", []):
            route = str(entry["story_route"])
            source_path = str(entry["source_path"])
            page = pages_by_route.get(route)
            if page is None:
                missing.append(route)
                continue
            target = ROOT / source_path
            target.write_text(render_child(page, source_path), encoding="utf-8")
            changed.append(source_path)

    family_paths = {
        "FLOW": "laws/categories/flow/index.html",
        "INTEGRITY": "laws/categories/integrity/index.html",
        "REALITY": "laws/categories/reality/index.html",
        "STRUCTURE": "laws/categories/structure/index.html",
    }
    for authority, source_path in family_paths.items():
        (ROOT / source_path).write_text(render_family(authority, source_path), encoding="utf-8")
        changed.append(source_path)

    wrappers = [
        ("/laws/battery-heldout-study/", "laws/battery-heldout-study/index.html", "Battery study"),
        ("/laws/scientific-law/battery-heldout-study/", "laws/scientific-law/battery-heldout-study/index.html", "Scientific Law battery study"),
        ("/laws/categories/reality/battery-heldout-study/", "laws/categories/reality/battery-heldout-study/index.html", "Reality battery study"),
    ]
    for route, source_path, label in wrappers:
        (ROOT / source_path).write_text(render_wrapper(route, source_path, label), encoding="utf-8")
        changed.append(source_path)

    frontier_path = "frontier/energy/battery-coherence-study/index.html"
    (ROOT / frontier_path).write_text(render_frontier(frontier_path), encoding="utf-8")
    changed.append(frontier_path)

    if renew_landing(ROOT / "laws/index.html"):
        changed.append("laws/index.html")

    expected_battery_count = int(battery_scope.get("public_surface_count", 0))
    if expected_battery_count != 27:
        raise SystemExit(f"Battery authority count drift: expected 27, found {expected_battery_count}")
    if missing:
        raise SystemExit("Narrative routes missing from frozen map: " + ", ".join(missing))
    if len(manifest.get("accepted_child_routes", [])) + len([p for wave in manifest.get("migration_waves", []) for p in wave.get("routes", [])]) != 24:
        raise SystemExit("Twenty-four child route invariant failed")

    receipt = {
        "contract": "LAWS_COMPLETE_RENEWAL_BATCH_MATERIALIZATION_RECEIPT_v1",
        "status": "MATERIALIZED_PENDING_EXECUTED_VERIFICATION",
        "generator": "scripts/laws_complete_renewal_batch.py",
        "remaining_child_routes_materialized": 20,
        "battery_public_surface_scope": 27,
        "product_files_written": sorted(set(changed)),
        "product_file_count": len(set(changed)),
        "accepted_representative_pages_preserved": [
            "laws/categories/flow/signals/index.html",
            "laws/categories/reality/measure.html",
            "laws/test/reverse-audit/index.html",
            "laws/research/findings-and-boundaries/index.html",
            "laws/industrial-posture/index.html",
        ],
        "preserved_boundaries": {
            "route_deletion_or_rename": False,
            "compass_runtime_mutation": False,
            "frontier_mutation_outside_complete_battery_record": False,
            "equation_identity_mutation": False,
            "canonical_owner_mutation": False,
            "evidence_status_upgrade": False,
            "claim_ceiling_upgrade": False,
        },
        "next_gate": "STATIC_AND_EXECUTED_BROWSER_CROSS_COMPATIBILITY",
    }
    OUTPUT_RECEIPT_PATH.write_text(json.dumps(receipt, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(receipt, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
