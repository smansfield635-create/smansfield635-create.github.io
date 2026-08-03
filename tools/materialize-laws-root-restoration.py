#!/usr/bin/env python3
"""Materialize the bounded Laws root experiential restoration as full-file replacements."""
from __future__ import annotations

import hashlib
from pathlib import Path

CONTRACT = "LAWS_EXPERIENTIAL_ARCHITECTURE_RESTORATION_v1"
EXPECTED_INPUTS = {
    "laws/index.html": "8bf549a8a64ea391281d62a78ad668d5d96b2a0ae45c137d105fdea1b56a4d31",
    "laws/index.experience.polish.css": "66922148b792e631216c8ba629205591141ecb3178f9bf94d9ab85a8f25aec70",
    "laws/index.experience.js": "48a02d6896ec64b4ca12ffa2ba6c770c21d7e997198256ee2441ac44e10e4cd2",
}
EXPECTED_OUTPUTS = {
    "laws/index.html": "8fff5010933b90ffd396fddab393fb4044954b1b2838299b2a454f598c246854",
    "laws/index.experience.polish.css": "e5a289b9e6792f7549be7797880ffe6911a6fea3e4f5e02b48ada1b71158a59f",
    "laws/index.experience.js": "2722d0f4da22b07d40fb2ecd14eea0d07c9bb21181013352136800a4934a9062",
}

RESTORATION_CSS = r'''/*
 * LAWS_EXPERIENTIAL_ARCHITECTURE_RESTORATION_v1
 * Restores the F.I.R.S.T. rail to the declaration side of the split hero,
 * removes the detached Compass-zone sequence, and keeps the native disclosure
 * response adjacent to its activation point on tablet viewports.
 * Presentation only: no route, controller, record, evidence, or claim authority.
 */
html[data-laws-root-restoration="LAWS_EXPERIENTIAL_ARCHITECTURE_RESTORATION_v1"] .laws-first > .laws-first-rail {
  position: relative;
  z-index: 5;
  width: min(100%, 34rem);
  margin: clamp(1.65rem, 3.5vh, 2.65rem) 0 0;
  padding: 0;
  border: 0;
  background: transparent;
}

html[data-laws-root-restoration="LAWS_EXPERIENTIAL_ARCHITECTURE_RESTORATION_v1"] .laws-first-rail__list {
  isolation: isolate;
  position: relative;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 0;
  margin: 0;
  padding: 0;
  list-style: none;
}

html[data-laws-root-restoration="LAWS_EXPERIENTIAL_ARCHITECTURE_RESTORATION_v1"] .laws-first-rail__list::before {
  content: "";
  position: absolute;
  z-index: -1;
  top: 0.43rem;
  right: 0.4rem;
  left: 0.4rem;
  height: 1px;
  background: linear-gradient(90deg, rgba(121, 234, 255, 0.58), var(--laws-experience-line), rgba(121, 234, 255, 0.28));
  box-shadow: 0 0 14px rgba(121, 234, 255, 0.14);
}

html[data-laws-root-restoration="LAWS_EXPERIENTIAL_ARCHITECTURE_RESTORATION_v1"] .laws-first-rail__item {
  position: relative;
  min-width: 0;
  padding: 1.35rem 0.15rem 0;
  opacity: 0.5;
  text-align: center;
  transition: opacity 220ms ease, transform 220ms ease;
}

html[data-laws-root-restoration="LAWS_EXPERIENTIAL_ARCHITECTURE_RESTORATION_v1"] .laws-first-rail__light {
  position: absolute;
  top: 0;
  left: 50%;
  box-sizing: border-box;
  width: 0.9rem;
  height: 0.9rem;
  border: 2px solid rgba(116, 229, 255, 0.56);
  border-radius: 50%;
  background: #07101f;
  box-shadow: 0 0 12px rgba(116, 229, 255, 0.18);
  transform: translateX(-50%);
  transition: background-color 180ms ease, border-color 180ms ease, box-shadow 220ms ease, transform 180ms ease;
}

html[data-laws-root-restoration="LAWS_EXPERIENTIAL_ARCHITECTURE_RESTORATION_v1"] .laws-first-rail__label {
  display: block;
  min-width: 0;
  overflow-wrap: anywhere;
  color: var(--laws-experience-ink);
  font-size: clamp(0.53rem, 0.75vw, 0.66rem);
  font-weight: 760;
  letter-spacing: 0.035em;
  text-transform: uppercase;
}

html[data-laws-root-restoration="LAWS_EXPERIENTIAL_ARCHITECTURE_RESTORATION_v1"] .laws-first-rail__question {
  display: none;
}

html[data-laws-root-restoration="LAWS_EXPERIENTIAL_ARCHITECTURE_RESTORATION_v1"] .laws-first-rail__item[data-laws-experience-active="true"] {
  opacity: 1;
  transform: translateY(-0.12rem);
}

html[data-laws-root-restoration="LAWS_EXPERIENTIAL_ARCHITECTURE_RESTORATION_v1"] .laws-first-rail__item[data-laws-experience-active="true"] .laws-first-rail__light {
  border-color: #e7fcff;
  background: #79eaff;
  box-shadow: 0 0 0 4px rgba(121, 234, 255, 0.12), 0 0 12px rgba(121, 234, 255, 0.92), 0 0 28px rgba(121, 234, 255, 0.74);
  transform: translateX(-50%) scale(1.16);
}

@media (min-width: 781px) and (max-width: 1200px) {
  html[data-laws-root-restoration="LAWS_EXPERIENTIAL_ARCHITECTURE_RESTORATION_v1"] .laws-experience-hero,
  html[data-laws-root-restoration="LAWS_EXPERIENTIAL_ARCHITECTURE_RESTORATION_v1"] .laws-experience-hero:has(.laws-first__disclosure[open]) {
    min-height: calc(100svh - 5rem);
    display: grid;
    grid-template-columns: minmax(17rem, 0.8fr) minmax(0, 1.2fr);
    align-items: start;
    gap: clamp(1.5rem, 3.2vw, 3rem);
    padding: clamp(2rem, 5vh, 4rem) 0 clamp(3rem, 7vh, 5rem);
  }

  html[data-laws-root-restoration="LAWS_EXPERIENTIAL_ARCHITECTURE_RESTORATION_v1"] .laws-first {
    position: relative;
    width: 100%;
    align-self: start;
  }

  html[data-laws-root-restoration="LAWS_EXPERIENTIAL_ARCHITECTURE_RESTORATION_v1"] .laws-first__disclosure[open] .laws-first__disclosure-body {
    position: static;
    width: 100%;
    max-width: 34rem;
    margin: 1.35rem 0 0;
    padding: 1.2rem 0 0;
    border-top: 1px solid var(--laws-experience-line);
    background: transparent;
    backdrop-filter: none;
  }

  html[data-laws-root-restoration="LAWS_EXPERIENTIAL_ARCHITECTURE_RESTORATION_v1"] .laws-first__disclosure[open] .laws-first__question-grid {
    width: 100%;
    grid-template-columns: minmax(0, 1fr);
    gap: 0;
  }

  html[data-laws-root-restoration="LAWS_EXPERIENTIAL_ARCHITECTURE_RESTORATION_v1"] .laws-first__disclosure[open] .laws-first__question-grid::before {
    display: none;
  }

  html[data-laws-root-restoration="LAWS_EXPERIENTIAL_ARCHITECTURE_RESTORATION_v1"] .laws-first__disclosure[open] .laws-first__question-grid article {
    display: grid;
    grid-template-columns: minmax(5.25rem, 0.34fr) minmax(0, 1fr);
    gap: 0.75rem;
    align-items: baseline;
    padding: 0.72rem 0 0.72rem 1.45rem;
    border-bottom: 1px solid rgba(121, 234, 255, 0.09);
  }

  html[data-laws-root-restoration="LAWS_EXPERIENTIAL_ARCHITECTURE_RESTORATION_v1"] .laws-first__disclosure[open] .laws-first__question-grid article::before {
    top: 0.9rem;
    left: 0;
  }

  html[data-laws-root-restoration="LAWS_EXPERIENTIAL_ARCHITECTURE_RESTORATION_v1"] .laws-first__disclosure[open] .laws-first__question-grid p {
    max-width: none;
    margin: 0;
    font-size: 0.88rem;
  }

  html[data-laws-root-restoration="LAWS_EXPERIENTIAL_ARCHITECTURE_RESTORATION_v1"] .laws-first__disclosure[open] .laws-first__research-record {
    grid-template-columns: minmax(5.25rem, 0.34fr) minmax(0, 1fr);
    gap: 0.75rem;
    margin-top: 0.4rem;
    padding: 0.85rem 0 0 1.45rem;
  }

  html[data-laws-root-restoration="LAWS_EXPERIENTIAL_ARCHITECTURE_RESTORATION_v1"] .laws-compass-primary {
    position: sticky;
    top: 1rem;
    width: 100%;
    align-self: start;
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    margin: 0;
  }

  html[data-laws-root-restoration="LAWS_EXPERIENTIAL_ARCHITECTURE_RESTORATION_v1"] .laws-orbit {
    min-height: clamp(31rem, 70vw, 44rem);
  }

  html[data-laws-root-restoration="LAWS_EXPERIENTIAL_ARCHITECTURE_RESTORATION_v1"] .laws-controller-panel {
    width: min(96%, 38rem);
    margin: -3.5rem auto 0;
  }
}

@media (max-width: 780px) {
  html[data-laws-root-restoration="LAWS_EXPERIENTIAL_ARCHITECTURE_RESTORATION_v1"] .laws-first > .laws-first-rail {
    width: 100%;
    margin-top: 1.4rem;
  }

  html[data-laws-root-restoration="LAWS_EXPERIENTIAL_ARCHITECTURE_RESTORATION_v1"] .laws-first-rail__label {
    font-size: clamp(0.52rem, 2.45vw, 0.65rem);
  }
}

@media (prefers-reduced-motion: reduce) {
  html[data-laws-root-restoration="LAWS_EXPERIENTIAL_ARCHITECTURE_RESTORATION_v1"] .laws-first-rail__item,
  html[data-laws-root-restoration="LAWS_EXPERIENTIAL_ARCHITECTURE_RESTORATION_v1"] .laws-first-rail__light {
    transition: none !important;
  }
}
'''

DISCLOSURE_JS = r'''  function firstDisclosureSnapshot() {
    const summaryRect = firstDisclosureSummary?.getBoundingClientRect();
    const bodyRect = firstDisclosureBody?.getBoundingClientRect();
    const gap = summaryRect && bodyRect
      ? bodyRect.top - summaryRect.bottom
      : null;
    const bodyIntersectsViewport = Boolean(
      bodyRect && bodyRect.bottom > 0 && bodyRect.top < innerHeight
    );

    return Object.freeze({
      open: Boolean(firstDisclosure?.open),
      inlineViewport: Boolean(matchMedia?.(INLINE_DISCLOSURE_MEDIA).matches),
      gap,
      bodyIntersectsViewport,
      immediateVisibleConsequence: Boolean(
        firstDisclosure?.open &&
        bodyIntersectsViewport &&
        gap !== null &&
        gap <= MAX_IMMEDIATE_DISCLOSURE_GAP
      )
    });
  }

  function commitFirstDisclosureContinuity(source = "toggle") {
    if (!firstDisclosure || !firstDisclosureSummary || !firstDisclosureBody) {
      return;
    }

    const open = Boolean(firstDisclosure.open);
    firstDisclosureSummary.setAttribute("aria-expanded", String(open));
    documentElement.dataset.lawsFirstDisclosure = open ? "open" : "closed";

    requestAnimationFrame(() => {
      let snapshot = firstDisclosureSnapshot();
      if (
        open &&
        snapshot.inlineViewport &&
        !snapshot.immediateVisibleConsequence
      ) {
        firstDisclosureBody.scrollIntoView({
          block: "nearest",
          inline: "nearest",
          behavior: reducedMotion ? "auto" : "smooth"
        });
        snapshot = firstDisclosureSnapshot();
      }

      globalThis.dispatchEvent(new CustomEvent("LAWS_FIRST_DISCLOSURE_CONTINUITY", {
        detail: Object.freeze({
          contract: CONTRACT,
          source,
          ...snapshot,
          navigationAuthority: false,
          controllerAuthority: false,
          contentAuthority: false
        })
      }));
    });
  }

  function installFirstDisclosureContinuity() {
    if (!firstDisclosure) {
      return;
    }

    firstDisclosure.addEventListener("toggle", () => {
      commitFirstDisclosureContinuity("native-details-toggle");
    });
    commitFirstDisclosureContinuity("initialize");
  }

'''


def digest(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def read_locked(path: Path, relative: str) -> str:
    text = path.read_text(encoding="utf-8")
    actual = digest(text)
    expected = EXPECTED_INPUTS[relative]
    if actual != expected:
        raise SystemExit(f"INPUT_HASH_MISMATCH {relative}: expected {expected}, got {actual}")
    return text


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"ANCHOR_COUNT_{label}={count}")
    return text.replace(old, new, 1)


def materialize_html(text: str) -> str:
    text = replace_once(
        text,
        'data-cp6-experiential-presentation="candidate" data-laws-first-rail-architecture="persistent-compass-zone-v2" data-laws-tablet-hero-reflow="single-column-at-1100px"',
        'data-cp6-experiential-presentation="candidate" data-laws-root-restoration="LAWS_EXPERIENTIAL_ARCHITECTURE_RESTORATION_v1" data-laws-first-rail-architecture="integrated-hero-v1" data-laws-tablet-hero-reflow="split-composition-until-780px"',
        "HTML_ROOT_ATTRIBUTES",
    )
    text = replace_once(
        text,
        '/laws/index.experience.polish.css?v=LAWS_FIRST_RAIL_ARCHITECTURE_20260802B',
        '/laws/index.experience.polish.css?v=LAWS_EXPERIENTIAL_ARCHITECTURE_RESTORATION_20260803A',
        "HTML_POLISH_VERSION",
    )
    text = replace_once(
        text,
        '/laws/index.experience.js?v=LAWS_FIRST_RAIL_ARCHITECTURE_20260802B',
        '/laws/index.experience.js?v=LAWS_EXPERIENTIAL_ARCHITECTURE_RESTORATION_20260803A',
        "HTML_JS_VERSION",
    )
    rail = '''<section class="laws-first-rail" data-laws-first-rail="" aria-label="F.I.R.S.T. Compass state">
<p class="sr-only" id="laws-first-rail-guidance">The illuminated marker follows the current Compass authority.</p>
<ol class="laws-first-rail__list" aria-describedby="laws-first-rail-guidance">
<li class="laws-first-rail__item" data-laws-experience-indicator="flow" data-laws-experience-active="false" aria-current="false"><span class="laws-first-rail__light" aria-hidden="true"></span><span class="laws-first-rail__label">Flow</span><span class="laws-first-rail__question">What changed?</span></li>
<li class="laws-first-rail__item" data-laws-experience-indicator="integrity" data-laws-experience-active="false" aria-current="false"><span class="laws-first-rail__light" aria-hidden="true"></span><span class="laws-first-rail__label">Integrity</span><span class="laws-first-rail__question">What remained intact?</span></li>
<li class="laws-first-rail__item" data-laws-experience-indicator="reality" data-laws-experience-active="false" aria-current="false"><span class="laws-first-rail__light" aria-hidden="true"></span><span class="laws-first-rail__label">Reality</span><span class="laws-first-rail__question">What does the evidence show?</span></li>
<li class="laws-first-rail__item" data-laws-experience-indicator="structure" data-laws-experience-active="false" aria-current="false"><span class="laws-first-rail__light" aria-hidden="true"></span><span class="laws-first-rail__label">Structure</span><span class="laws-first-rail__question">What conditions shaped the result?</span></li>
<li class="laws-first-rail__item" data-laws-experience-indicator="test" data-laws-experience-active="false" aria-current="false"><span class="laws-first-rail__light" aria-hidden="true"></span><span class="laws-first-rail__label">Test</span><span class="laws-first-rail__question">What was actually tested?</span></li>
</ol>
</section>'''
    old = '</div>\n</details>\n</section>\n<div class="laws-compass-primary" data-laws-compass-primary="">\n' + rail + '\n<section aria-describedby="laws-orbit-guidance"'
    new = '</div>\n</details>\n' + rail + '\n</section>\n<div class="laws-compass-primary" data-laws-compass-primary="">\n<section aria-describedby="laws-orbit-guidance"'
    text = replace_once(text, old, new, "HTML_RAIL_MOVE")
    return text


def materialize_polish(text: str) -> str:
    marker = "/*\n * LAWS_FIRST_PERSISTENT_COMPASS_RAIL_AND_TABLET_REFLOW_v2"
    index = text.find(marker)
    if index < 0:
        raise SystemExit("POLISH_RAIL_MARKER_MISSING")
    return text[:index].rstrip() + "\n\n" + RESTORATION_CSS


def materialize_js(text: str) -> str:
    text = replace_once(text, 'const CONTRACT = "LAWS_CP6_EXPERIENTIAL_PRESENTATION_v3";', 'const CONTRACT = "LAWS_EXPERIENTIAL_ARCHITECTURE_RESTORATION_v1";', "JS_CONTRACT")
    text = replace_once(
        text,
        'const COMPASS_PRELOAD_MARGIN = "1200px 0px";',
        'const COMPASS_PRELOAD_MARGIN = "1200px 0px";\n  const INLINE_DISCLOSURE_MEDIA = "(min-width: 781px) and (max-width: 1200px)";\n  const MAX_IMMEDIATE_DISCLOSURE_GAP = 160;',
        "JS_CONSTANTS",
    )
    text = replace_once(
        text,
        '  const indicatorNodes = Array.from(document.querySelectorAll("[data-laws-experience-indicator]"));\n  const stageNodes = Array.from(document.querySelectorAll("[data-laws-experience-stage]"));\n',
        '  const indicatorNodes = Array.from(document.querySelectorAll("[data-laws-experience-indicator]"));\n  const stageNodes = Array.from(document.querySelectorAll("[data-laws-experience-stage]"));\n  const firstDisclosure = document.querySelector("details[data-laws-first-disclosure]");\n  const firstDisclosureSummary = firstDisclosure?.querySelector(":scope > summary") || null;\n  const firstDisclosureBody = firstDisclosure?.querySelector(":scope > .laws-first__disclosure-body") || null;\n',
        "JS_DISCLOSURE_NODES",
    )
    text = replace_once(text, '  function installStageObserver() {\n', DISCLOSURE_JS + '  function installStageObserver() {\n', "JS_DISCLOSURE_FUNCTIONS")
    text = replace_once(text, '    installCompassPreload();\n    installStageObserver();', '    installCompassPreload();\n    installFirstDisclosureContinuity();\n    installStageObserver();', "JS_INITIALIZE")
    text = replace_once(
        text,
        '      requestCompassRuntimePreload: () => requestCompassRuntimePreload("manual-presentation-request"),\n      navigationAuthority: false,',
        '      requestCompassRuntimePreload: () => requestCompassRuntimePreload("manual-presentation-request"),\n      getFirstDisclosureSnapshot: firstDisclosureSnapshot,\n      refreshFirstDisclosure: () => commitFirstDisclosureContinuity("manual-refresh"),\n      navigationAuthority: false,',
        "JS_API",
    )
    text = replace_once(
        text,
        '          compassPreloadMargin: COMPASS_PRELOAD_MARGIN,\n          reducedMotion',
        '          compassPreloadMargin: COMPASS_PRELOAD_MARGIN,\n          firstDisclosureMedia: INLINE_DISCLOSURE_MEDIA,\n          maxImmediateDisclosureGap: MAX_IMMEDIATE_DISCLOSURE_GAP,\n          reducedMotion',
        "JS_READY_DETAIL",
    )
    return text


def main() -> None:
    root = Path.cwd()
    operations = {
        "laws/index.html": materialize_html,
        "laws/index.experience.polish.css": materialize_polish,
        "laws/index.experience.js": materialize_js,
    }
    for relative, operation in operations.items():
        path = root / relative
        source = read_locked(path, relative)
        output = operation(source)
        actual = digest(output)
        expected = EXPECTED_OUTPUTS[relative]
        if actual != expected:
            raise SystemExit(f"OUTPUT_HASH_MISMATCH {relative}: expected {expected}, got {actual}")
        path.write_text(output, encoding="utf-8")
        print(f"MATERIALIZED {relative} sha256={actual}")

    unchanged = root / "laws/index.experience.css"
    unchanged_hash = hashlib.sha256(unchanged.read_bytes()).hexdigest()
    if unchanged_hash != "4a48242720d7f42dcf582ff910766882091c1b00a0ad3fad72807d5a5090d196":
        raise SystemExit(f"UNTOUCHED_FILE_HASH_MISMATCH laws/index.experience.css: {unchanged_hash}")
    print(f"PRESERVED laws/index.experience.css sha256={unchanged_hash}")
    print(f"CONTRACT={CONTRACT}")


if __name__ == "__main__":
    main()
