# Characters Task 17R-B — Spatial Field Foundation

Status: construction candidate under canonical successor operation `CHARACTERS_TASK17R_SPATIAL_FIELD_FOUNDATION_20260831_002`, generation 1888, governing head `248c9ba0acbd3e29da0fce8d137fb95b94226a5c`.

This directory is an isolated foundation proving the replacement presentation class before any production character content is mounted.

## What it is

A lightweight H-Earth-compatible spatial information composition built from native HTML/CSS and one bounded 2D canvas graphics layer. It establishes environmental depth, coast/water/terrain language, responsive spatial staging, and eight placeholder anchor positions for later character content.

The supplied H-Earth reference image is inspiration only. It is not loaded, embedded, reproduced as a world runtime, or treated as an exact geometry specification.

## What it is not

- not the public `/characters/` replacement yet;
- not a full H-Earth or Audralia environment;
- no first-person or free-camera navigation;
- no terrain simulation or world traversal;
- no production character cards, dossiers, chronology, relationships, P12 content, or carousel content;
- no legacy dossier iframe, legacy card shell, or legacy crosswalk presentation;
- no merge, deployment, or publication authority.

## Rendering architecture

`HTML SEMANTIC SHELL`
→ `CSS ENVIRONMENTAL MASSES / WATER / SHORE / ATMOSPHERE`
→ `BOUNDED CANVAS CONTOUR + WATER-LINE GRAPHICS`
→ `DOM PLACEHOLDER ANCHORS`

The canvas never captures pointer/touch input. The field declares `touch-action: pan-y pinch-zoom`, does not call `preventDefault()`, and leaves document scrolling and browser pinch zoom in browser ownership.

The canvas pixel ratio is capped at `1.75` and its contour resolution drops on narrow viewports. Animation is limited to subtle water/light phase movement and is disabled when `prefers-reduced-motion: reduce` is active or when the document is not visible.

## Hard negatives

The foundation fails if any of the following become true:

- reference environment loaded as runtime;
- full-world runtime imported;
- free camera or first-person navigation introduced;
- visible legacy character card shell introduced;
- legacy dossier iframe introduced;
- legacy crosswalk becomes the primary presentation;
- production character content mounted before foundation freeze;
- primary touch causes a crash or blocks normal document scrolling.

## Next boundary

Qualify this exact foundation candidate structurally and in rendered desktop/tablet/phone states. Only after the field is frozen should a later operation define carousel motion and mount real character information onto these spatial anchors.
