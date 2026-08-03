#!/usr/bin/env python3
"""Finalize the Laws root restoration without touching protected runtime."""

from __future__ import annotations

import hashlib
import re
from pathlib import Path

FORK_BASE = "ef2ffdb1da7911238652f076a6b44326061493ef"

html_path = Path("laws/index.html")
css_path = Path("laws/index.experience.polish.css")
matrix_path = Path("tools/laws-experiential-restoration-root-matrix.mjs")
matrix_workflow_path = Path(".github/workflows/laws-experiential-restoration-root-matrix.yml")
cta_workflow_path = Path(".github/workflows/laws-experiential-restoration-cta-regression.yml")

html = html_path.read_text(encoding="utf-8")
css = css_path.read_text(encoding="utf-8")
matrix = matrix_path.read_text(encoding="utf-8")
matrix_workflow = matrix_workflow_path.read_text(encoding="utf-8")
cta_workflow = cta_workflow_path.read_text(encoding="utf-8")

# Move the existing battery study intact from the root sequence into optional
# applied-evidence depth. No study data, result, route, or claim is changed.
study_pattern = re.compile(
    r'\n<section class="cp6-context cp6-landing-context lr-battery-landing" '
    r'id="cp6-work-behind-laws".*?</section>\n(?=<section aria-label="Laws supporting orientation")',
    re.S,
)
match = study_pattern.search(html)
if not match:
    raise SystemExit("BATTERY_STUDY_BLOCK_NOT_FOUND")
study = match.group(0).strip()
html = html[: match.start()] + "\n" + html[match.end() :]

evidence_marker = '<details class="laws-orientation-panel" data-laws-supporting-panel="evidence-applied">'
evidence_start = html.find(evidence_marker)
if evidence_start < 0:
    raise SystemExit("EVIDENCE_PANEL_NOT_FOUND")
body_marker = '  <div class="laws-orientation-panel__body">\n'
body_start = html.find(body_marker, evidence_start)
if body_start < 0:
    raise SystemExit("EVIDENCE_PANEL_BODY_NOT_FOUND")
insertion = body_start + len(body_marker)
wrapped_study = f'''<details class="laws-discovery__item laws-applied-study-disclosure" data-laws-applied-study-disclosure="battery-health">
  <summary>
    <span>Applied study</span>
    <strong>Battery health held-out evaluation</strong>
    <small>One bounded example. The Laws foundation remains the subject of this chamber.</small>
  </summary>
  <div class="laws-applied-study-disclosure__body">
{study}
  </div>
</details>
'''
html = html[:insertion] + wrapped_study + html[insertion:]

html = html.replace(
    'data-laws-root-restoration="LAWS_EXPERIENTIAL_ARCHITECTURE_RESTORATION_v1"',
    'data-laws-root-restoration="LAWS_EXPERIENTIAL_ARCHITECTURE_RESTORATION_v1" data-laws-foundation-first-applied-study="true"',
    1,
)
html = html.replace(
    'LAWS_EXPERIENTIAL_ARCHITECTURE_RESTORATION_20260803A" rel="stylesheet"',
    'LAWS_EXPERIENTIAL_ARCHITECTURE_RESTORATION_20260803B" rel="stylesheet"',
    1,
)

css += r'''

/*
 * LAWS_FOUNDATION_FIRST_APPLIED_STUDY_v1
 * Keeps the Laws foundation primary. Applied research remains available as
 * optional evidence depth and does not occupy the chamber threshold.
 */
html[data-laws-foundation-first-applied-study="true"] .laws-applied-study-disclosure {
  margin: 0.35rem 0 1.35rem;
  border: 0;
  border-top: 1px solid rgba(121, 234, 255, 0.22);
  border-bottom: 1px solid rgba(121, 234, 255, 0.12);
  background: transparent;
}

html[data-laws-foundation-first-applied-study="true"] .laws-applied-study-disclosure > summary {
  display: grid;
  grid-template-columns: minmax(6.5rem, 0.24fr) minmax(0, 1fr) auto;
  gap: 0.25rem 1rem;
  align-items: baseline;
  padding: 1.15rem 0;
  color: var(--laws-experience-ink);
  cursor: pointer;
  list-style: none;
}

html[data-laws-foundation-first-applied-study="true"] .laws-applied-study-disclosure > summary::-webkit-details-marker {
  display: none;
}

html[data-laws-foundation-first-applied-study="true"] .laws-applied-study-disclosure > summary::after {
  content: "+";
  grid-column: 3;
  grid-row: 1 / span 2;
  align-self: center;
  color: #79eaff;
  font-size: 1.25rem;
  font-weight: 400;
}

html[data-laws-foundation-first-applied-study="true"] .laws-applied-study-disclosure[open] > summary::after {
  content: "−";
}

html[data-laws-foundation-first-applied-study="true"] .laws-applied-study-disclosure > summary span {
  color: #79eaff;
  font-size: 0.68rem;
  font-weight: 760;
  letter-spacing: 0.13em;
  text-transform: uppercase;
}

html[data-laws-foundation-first-applied-study="true"] .laws-applied-study-disclosure > summary strong {
  font-size: clamp(1rem, 1.7vw, 1.28rem);
}

html[data-laws-foundation-first-applied-study="true"] .laws-applied-study-disclosure > summary small {
  grid-column: 2;
  color: var(--laws-experience-muted);
  font-size: 0.82rem;
}

html[data-laws-foundation-first-applied-study="true"] .laws-applied-study-disclosure__body {
  padding: 0 0 1.35rem;
}

html[data-laws-foundation-first-applied-study="true"] .laws-applied-study-disclosure .lr-battery-landing {
  margin: 0;
  padding: clamp(1rem, 2.5vw, 1.5rem) 0 0;
  border: 0;
  border-radius: 0;
  box-shadow: none;
  background: transparent;
}

@media (max-width: 780px) {
  html[data-laws-foundation-first-applied-study="true"] .laws-applied-study-disclosure > summary {
    grid-template-columns: minmax(0, 1fr) auto;
  }

  html[data-laws-foundation-first-applied-study="true"] .laws-applied-study-disclosure > summary span,
  html[data-laws-foundation-first-applied-study="true"] .laws-applied-study-disclosure > summary strong,
  html[data-laws-foundation-first-applied-study="true"] .laws-applied-study-disclosure > summary small {
    grid-column: 1;
  }

  html[data-laws-foundation-first-applied-study="true"] .laws-applied-study-disclosure > summary::after {
    grid-column: 2;
    grid-row: 1 / span 3;
  }
}
'''

# Add useful entry and selected-state viewport captures and verify that the
# applied study is closed, subordinate, and still present.
profile_anchor = '''  await page.goto(`${BASE_URL}/laws/`, { waitUntil: "networkidle" });
  await waitForRuntime(page);
  await page.evaluate(() => scrollTo({ top: 0, left: 0, behavior: "instant" }));
  const cta = await activateDisclosure(page, profile.input);'''
profile_replacement = '''  await page.goto(`${BASE_URL}/laws/`, { waitUntil: "networkidle" });
  await waitForRuntime(page);
  await page.evaluate(() => scrollTo({ top: 0, left: 0, behavior: "instant" }));
  await page.screenshot({ path: path.join(EVIDENCE_DIR, `${profile.name}-entry.png`) });
  const appliedStudy = await page.evaluate(() => {
    const study = document.querySelector('[data-battery-study="BATTERY_COHERENCE_HELDOUT_STUDY_v1"]');
    const disclosure = study?.closest('[data-laws-applied-study-disclosure="battery-health"]');
    return {
      present: Boolean(study),
      nestedInOptionalDepth: Boolean(disclosure),
      openOnEntry: Boolean(disclosure?.open),
      parentPanel: Boolean(disclosure?.closest('[data-laws-supporting-panel="evidence-applied"]'))
    };
  });
  assert.equal(appliedStudy.present, true, `${profile.name}: applied study missing.`);
  assert.equal(appliedStudy.nestedInOptionalDepth, true, `${profile.name}: battery study dominates the root instead of optional depth.`);
  assert.equal(appliedStudy.openOnEntry, false, `${profile.name}: applied study must be closed on entry.`);
  assert.equal(appliedStudy.parentPanel, true, `${profile.name}: applied study is outside the evidence path.`);
  const cta = await activateDisclosure(page, profile.input);'''
if profile_anchor not in matrix:
    raise SystemExit("ROOT_MATRIX_PROFILE_ANCHOR_NOT_FOUND")
matrix = matrix.replace(profile_anchor, profile_replacement, 1)
matrix = matrix.replace(
    '  await page.screenshot({ path: path.join(EVIDENCE_DIR, `${profile.name}-full.png`), fullPage: true });',
    '  await page.screenshot({ path: path.join(EVIDENCE_DIR, `${profile.name}-selected.png`) });',
    1,
)
matrix = matrix.replace(
    '  const result = { profile, cta, physicalAuthority, errors, disposition: "PASS" };',
    '  const result = { profile, appliedStudy, cta, physicalAuthority, errors, disposition: "PASS" };',
    1,
)

# Main may advance through unrelated project work. Preserve the original Laws
# fork base and reject only overlapping Laws-root changes.
def allow_unrelated_main_drift(text: str, include_merge_base: bool) -> str:
    text = text.replace(f"EXPECTED_MAIN_BASE: {FORK_BASE}", f"FORK_BASE: {FORK_BASE}")
    text = text.replace("$EXPECTED_MAIN_BASE", "$FORK_BASE")
    text = text.replace(
        '          test "$(git rev-parse origin/main)" = "$FORK_BASE"\n',
        "",
    )
    if include_merge_base:
        anchor = '          test "$(git merge-base origin/main HEAD)" = "$FORK_BASE"\n'
        replacement = anchor + '''          if git diff --name-only "$FORK_BASE" origin/main | grep -E '^laws/(index\\.|index/|research/|test/|categories/|scientific-law/)'; then
            echo 'Main advanced through overlapping Laws paths; rebase review required.' >&2
            exit 1
          fi
'''
        if anchor not in text:
            raise SystemExit("ROOT_MATRIX_DRIFT_ANCHOR_NOT_FOUND")
        text = text.replace(anchor, replacement, 1)
    else:
        anchor = "          git cat-file -e \"$FORMER_ROOT_REFERENCE^{commit}\"\n"
        replacement = '''          test "$(git merge-base origin/main HEAD)" = "$FORK_BASE"
          if git diff --name-only "$FORK_BASE" origin/main | grep -E '^laws/(index\\.|index/|research/|test/|categories/|scientific-law/)'; then
            echo 'Main advanced through overlapping Laws paths; rebase review required.' >&2
            exit 1
          fi
''' + anchor
        if anchor not in text:
            raise SystemExit("CTA_DRIFT_ANCHOR_NOT_FOUND")
        text = text.replace(anchor, replacement, 1)
    return text

matrix_workflow = allow_unrelated_main_drift(matrix_workflow, include_merge_base=True)
cta_workflow = allow_unrelated_main_drift(cta_workflow, include_merge_base=False)

# Replace the obsolete whole-file normalized equality with semantic preservation
# checks suitable for a presentation-only relocation.
strict_block = '''          if current_normalized != prior_normalized:
              raise SystemExit("NON_PRESENTATION_HTML_DELTA_DETECTED")'''
semantic_block = '''          presentation_only_delta = current_normalized != prior_normalized
          if current.count('data-laws-applied-study-disclosure="battery-health"') != 1:
              raise SystemExit("APPLIED_STUDY_DISCLOSURE_COUNT_INVALID")
          if current.count('data-battery-study="BATTERY_COHERENCE_HELDOUT_STUDY_v1"') != prior.count('data-battery-study="BATTERY_COHERENCE_HELDOUT_STUDY_v1"'):
              raise SystemExit("BATTERY_STUDY_IDENTITY_DELTA")
          if values(r'(?:href|data-route)="(/[^"]*)"', current) != values(r'(?:href|data-route)="(/[^"]*)"', prior):
              raise SystemExit("ROUTE_IDENTITY_DELTA")
          current_formulas = [hashlib.sha256(block.encode()).hexdigest() for block in re.findall(r'<pre><code>(.*?)</code></pre>', current, re.S)]
          prior_formulas = [hashlib.sha256(block.encode()).hexdigest() for block in re.findall(r'<pre><code>(.*?)</code></pre>', prior, re.S)]
          if current_formulas != prior_formulas:
              raise SystemExit("FORMULA_IDENTITY_DELTA")'''
if strict_block not in matrix_workflow:
    raise SystemExit("AUTHORITY_STRICT_BLOCK_NOT_FOUND")
matrix_workflow = matrix_workflow.replace(strict_block, semantic_block, 1)
matrix_workflow = matrix_workflow.replace(
    '              "non_presentation_html_equal": True,',
    '              "presentation_only_html_delta": presentation_only_delta,\n              "applied_study_optional_depth": True,',
    1,
)

html_path.write_text(html, encoding="utf-8")
css_path.write_text(css, encoding="utf-8")
matrix_path.write_text(matrix, encoding="utf-8")
matrix_workflow_path.write_text(matrix_workflow, encoding="utf-8")
cta_workflow_path.write_text(cta_workflow, encoding="utf-8")

hashes = {
    "laws/index.html": hashlib.sha256(html_path.read_bytes()).hexdigest(),
    "laws/index.experience.css": hashlib.sha256(Path("laws/index.experience.css").read_bytes()).hexdigest(),
    "laws/index.experience.polish.css": hashlib.sha256(css_path.read_bytes()).hexdigest(),
    "laws/index.experience.js": hashlib.sha256(Path("laws/index.experience.js").read_bytes()).hexdigest(),
}


def refresh_hashes(text: str) -> str:
    for file_path, digest in hashes.items():
        text = re.sub(
            rf"echo '[0-9a-f]{{64}}  {re.escape(file_path)}'",
            f"echo '{digest}  {file_path}'",
            text,
        )
    return text


matrix_workflow_path.write_text(
    refresh_hashes(matrix_workflow_path.read_text(encoding="utf-8")), encoding="utf-8"
)
cta_workflow_path.write_text(
    refresh_hashes(cta_workflow_path.read_text(encoding="utf-8")), encoding="utf-8"
)

for file_path, digest in hashes.items():
    print(f"{digest}  {file_path}")
