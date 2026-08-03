#!/usr/bin/env python3
"""Append the bounded desktop F.I.R.S.T. disclosure correction."""

from pathlib import Path

path = Path("laws/index.experience.polish.css")
text = path.read_text(encoding="utf-8")
marker = "LAWS_DESKTOP_FIRST_DISCLOSURE_ADJACENCY_v1"
if marker in text:
    raise SystemExit("DESKTOP_DISCLOSURE_CORRECTION_ALREADY_PRESENT")

text += r'''

/*
 * LAWS_DESKTOP_FIRST_DISCLOSURE_ADJACENCY_v1
 * Keeps the Explore response adjacent to its control on wide desktop screens.
 * Presentation only: no route, controller, evidence, formula, or claim authority.
 */
@media (min-width: 1201px) {
  html[data-laws-root-restoration="LAWS_EXPERIENTIAL_ARCHITECTURE_RESTORATION_v1"] .laws-experience-hero:has(.laws-first__disclosure[open]) {
    min-height: max(100svh, 58rem);
    padding-bottom: clamp(3rem, 7vh, 5rem);
  }

  html[data-laws-root-restoration="LAWS_EXPERIENTIAL_ARCHITECTURE_RESTORATION_v1"] .laws-experience-hero:has(.laws-first__disclosure[open]) .laws-first {
    position: relative;
  }

  html[data-laws-root-restoration="LAWS_EXPERIENTIAL_ARCHITECTURE_RESTORATION_v1"] .laws-first__disclosure[open] .laws-first__disclosure-body {
    position: static;
    left: auto;
    right: auto;
    bottom: auto;
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
    grid-template-columns: minmax(5.75rem, 0.34fr) minmax(0, 1fr);
    gap: 0.85rem;
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
    grid-template-columns: minmax(5.75rem, 0.34fr) minmax(0, 1fr);
    gap: 0.85rem;
    margin-top: 0.4rem;
    padding: 0.85rem 0 0 1.45rem;
  }
}
'''

path.write_text(text, encoding="utf-8")
