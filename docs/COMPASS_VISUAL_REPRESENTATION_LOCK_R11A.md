# Compass Visual Representation Lock — R11A

Status: **OWNER-APPROVED VISUAL IDENTITY LOCK**

This document exists to prevent any future Compass cinematic, screenshot, proof, reconstruction, or release from substituting a different object for the approved Diamond Gate Compass representation.

## Governing visual law

For R11A S01, **Compass means the four-cardinal crystal-star constellation presentation** shown in the owner-supplied approved moving reference. It does **not** mean the separate fixed-center `upstream-compass.*` instrument.

The approved visual identity is:

- a dark celestial/starfield field;
- four faceted cardinal crystal stars arranged in spherical constellation space;
- the large silver/white `ORIENTATION` crystal star as the dominant foreground subject;
- the three other colored cardinal stars remaining visibly present around it;
- real depth, scale, prominence, halo, and constellation spacing from the Compass crystal renderer;
- the surrounding stars are part of the Compass identity and must not be collapsed into a single icon, ring, diamond, flat emblem, card, or generic compass symbol.

The positive-control frame is visual-identity evidence only. Its historical page copy (for example `Welcome to the Compass.`) does not override the separately frozen R11A contextual line.

## Owner-supplied positive visual control

Source video supplied by the owner:

- filename: `1000001192.mp4`
- bytes: `21,908,630`
- SHA-256: `e7ecee2cd31e4238846319c55efdf238642d0b8c45c213106b58b050261a9fe4`

Representative approved Compass frame extracted at approximately `11.0 s`:

- local extraction name: `approved_compass_from_1000001192_t11s.png`
- bytes: `282,431`
- SHA-256: `e9adf7a975b6de7578876a43d70039a4e9083dd1920a46c1a6c7d8da555c5759`

A future room that has the source video must verify the video SHA-256 before using the timestamp. If the exact extracted PNG is available, verify the frame SHA-256 as well.

## Exact website source authority at governing R11A head

Governing head for this lock: `8f97bb035dce439cf28ca156b2fcd5bdfc6a1953`.

The approved Compass visual family is the spherical constellation system:

- `assets/compass/compass.crystals.js` — Git blob `cd2cbad0494852cc80c51959a6827407d037b8fb`
  - owns the four cardinal crystal stars;
  - owns the spherical cardinal constellation rendering;
  - owns crystal shaders, materials, camera/projection, depth, scale, prominence, halo, and star positioning.
- `assets/compass/compass.cosmos.js` — Git blob `4fe781df1a8876218c6f081b6ec88d5d2d6044c7`
  - owns the celestial/night context companion used around the Compass.
- `assets/compass/compass.controller.js` — Git blob `568a6b2cd608a4cbcd62cf70ed59b241c39c90d2`
  - owns the four-cardinal spherical constellation state and behavior;
  - does not render the crystals itself and remains protected/read-only.

## Explicit source-identity correction

The following separate component is **not** R11A S01 visible-Compass authority:

- `assets/compass/upstream-compass.geometry.js`
- `assets/compass/upstream-compass.renderer.js`
- `assets/compass/upstream-compass.css`

Those files define a different fixed-center Home Compass instrument. They must never be substituted for the owner-approved four-crystal constellation in R11A S01 simply because they contain the word `Compass`.

Any R11A manifest or construction record that binds S01 visible identity to `upstream-compass.*` is stale/incorrect and must be corrected before S01 capture or qualification.

## Forbidden substitutions — automatic FAIL_CLOSED

Any of the following is an immediate visual-identity failure:

- fixed-center metallic ring/instrument Compass substituted for the four-star constellation;
- diamond-in-circle or diamond-field proxy;
- generated image, illustration, or image-model output;
- geometry-derived redraw that is merely similar;
- flat compass icon or cardinal diagram;
- single-star presentation that removes the other cardinal stars;
- generic orbit/constellation lines without the four recognizable crystal stars;
- generic card or text panel standing in for the Compass;
- text-only S01 with no approved Compass visual;
- screenshot/reference from a different Compass component treated as positive authority;
- any representation that would not be immediately recognizable as the four-crystal Compass shown in the owner-supplied video.

## R11A S01 acceptance law

`S01_PASS` requires all of the following:

1. The visible subject is rendered from the canonical `compass.crystals.js` constellation family, with the protected controller consumed read-only.
2. All four cardinal crystal stars remain part of the composition.
3. `ORIENTATION` is the dominant/foreground star in the approved Compass presentation grammar.
4. The celestial context is preserved; the shot may be cinematically framed, but must not become a different object.
5. The shot carries the separately frozen R11A context: `Discover our ideas, enter the story, or explore your own.`
6. A browser-rendered S01 proof frame is shown to the owner before any full R11A master is permitted.
7. Owner-visible mismatch means `FAIL_CLOSED`; source hashes or technical validity cannot overrule a visible mismatch.

## No reinterpretation rule

`COMPASS` in this cinematic is not a semantic category from which a new compass may be designed.

It is a preservation-locked recognizable visual identity:

`FOUR-CARDINAL CRYSTAL CONSTELLATION -> ORIENTATION FOREGROUND -> APPROVED COMPASS`

No future construction pass may replace that identity with another Compass implementation without explicit new owner authorization.

Disposition:

`R11A_COMPASS_VISUAL_IDENTITY_LOCKED_FOUR_CARDINAL_CRYSTAL_CONSTELLATION_ONLY`
