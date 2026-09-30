# Chapter 02 Successor — Frozen Music Window and Shot Table

Status: `FROZEN_PRE_RENDER_EDITORIAL_AUTHORITY`
Date: `2026-09-12`
Controlling corrective issue: `#3182`
Target chapter: `02 · 3D World & Game Design`

This document is the exact pre-render editorial authority for the Chapter 02 successor after owner rejection of the Gen2128 published master. It freezes the music window, runtime, shot order, source mapping, text timing, collage focus cycles, and coherence purpose before another render is allowed.

It does not authorize product mutation, merge, deployment, or publication.

---

## 1. Frozen music authority

Soundtrack:

- Antonio Vivaldi — *Summer, I. Allegro non molto, RV 315*
- John Harrison, violin
- Robert Turizziani, conductor
- Wichita State University Chamber Players
- Wikimedia Commons / CC BY-SA 4.0

Prior approved Chapter 02 thematic anchor:

- `167.000 s = 02:47.000`

The prior world reel used that musical entrance successfully. The successor adds exactly ten seconds of runway before that anchor while preserving the forward musical arc.

### Frozen successor music window

- canonical music IN: `157.000 s = 02:37.000`
- thematic anchor: `167.000 s = 02:47.000`
- canonical music OUT: `197.200 s = 03:17.200`
- exact film runtime: `40.200 s`
- continuity: `ONE_CONTINUOUS_FORWARD_WINDOW`
- wrap/restart: `PROHIBITED`

Mapping law:

`FILM_TIME = CANONICAL_MUSIC_TIME - 157.000`

Therefore:

- film `00:00.000` = music `02:37.000`
- film `00:10.000` = music `02:47.000`
- film `00:25.000` = music `03:02.000`
- film `00:30.000` = music `03:07.000`
- film `00:40.200` = music `03:17.200`

The music may not be moved tens of seconds later to fill runtime. The recording may not wrap to `00:00`. The established `02:47` entrance is the thematic arrival and must coincide with entry into H-Earth.

---

## 2. Primary picture authority

### `23774.mp4` — globe-scale approach / return

- SHA-256: `aa73e60ca419b0b8aaed0332e5d97bbd516533c75d7512a9385168b2004845d4`
- duration: `62.663756 s`
- role: globe/orbit orientation, Audralia approach, return toward orbit

### `23775.mp4` — H-Earth handoff / traversal

- SHA-256: `20028cc073a552e66a876ccefe27e1fa11e414a3ef7810b00b9370e0ad7eda5a`
- duration: `90.810938 s`
- role: direct proof of entering and traversing H-Earth

Combined governing grammar:

`ORBIT -> ORIENTATION -> COASTLINE -> ENTRY -> TRAVERSAL -> RETURN TO PLANETARY SCALE`

These two sources are experiential evidence. They are not merely cinematography references and may not be replaced wholesale by synthetic procedural geography.

---

## 3. Supporting collage authorities

The final collage uses four recognizable estate objects only. Each object must be understandable in isolation before it is admitted.

1. **Characters / shared-world traversal**
   - source: `1000002020.mp4`
   - SHA-256: `8653f6c56d58884d28f9330b39b64660e67331e3bf61b033b200df2b270f0c43`
   - selected source interval: `00:22.000–00:24.400`

2. **Mirrorland / Experience window**
   - source module: `showroom/globe/h-earth/awards/living-objects/experience-cycle-a.mjs`
   - frozen blob at editorial head: `3fe650a4abe2a4c2a1f93c4c1002037e80080b36`
   - selected state: recognizable Mirrorland window / clear-reveal state

3. **Coherence / Brain**
   - source module: `showroom/globe/h-earth/awards/living-objects/coherence-cycle-c.mjs`
   - frozen blob at editorial head: `f991a55ac286a4deca907f36faa7665d71d5306a`
   - selected state: recognizable brain / resolved coherence state

4. **Estate / Manor**
   - source module: `showroom/globe/h-earth/awards/living-objects/estate-cycle-e.mjs`
   - frozen blob at editorial head: `85a8e771ddec807faade1f7cbb98ebbe0fc470ac`
   - selected state: recognizable coherent Manor core

If any of these source identities move before construction, exact-current source identity must be revalidated. The object role/order may not silently change.

---

## 4. Exact shot / music / text table

| Shot | Film time | Music time | Picture source | Source interval / state | Treatment | Text | Viewer must understand | Transition cause |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S01 — ORBIT ORIENTATION | `00:00.000–00:04.800` | `02:37.000–02:41.800` | `23774.mp4` | `00:03.200–00:08.000` | Shot-aware 16:9 crop around globe/horizon; remove browser/OS chrome; no synthetic replacement | `What makes something real?` visible `00:00.800–00:04.100` | `THIS IS A WORLD.` | Existing camera motion begins the approach |
| S02 — AUDRALIA APPROACH | `00:04.800–00:10.000` | `02:41.800–02:47.000` | `23774.mp4` | `00:20.000–00:25.200` | Match-direction cut from S01; coast/continent grows; preserve shoreline/relief | `What wasn't before doesn't define what is possible.` visible `00:05.100–00:09.650` | `I AM APPROACHING A REAL PLACE INSIDE THIS WORLD.` | Forward geographic motion fills the frame and motivates entry |
| S03 — H-EARTH ENTRY | `00:10.000–00:13.500` | `02:47.000–02:50.500` | `23775.mp4` | `00:10.000–00:13.500` | Thematic entrance lands exactly here; soft geographic fade/dissolve only if required to remove load artifact | No new sentence | `THE WORLD CAN BE ENTERED.` | Audralia/world-scale image gives way to the live H-Earth environment |
| S04 — COASTAL ARRIVAL | `00:13.500–00:17.500` | `02:50.500–02:54.500` | `23775.mp4` | `00:18.000–00:22.000` | Clean crop on ground-scale terrain/water; preserve spatial depth; no debug/UI as design | `The experience creates reality.` begins `00:14.600` | `I AM NOW INSIDE THE WORLD.` | Entry resolves into embodied ground scale |
| S05 — H-EARTH TRAVERSAL | `00:17.500–00:24.800` | `02:54.500–03:01.800` | `23775.mp4` | `00:55.000–01:02.300` | Preserve actual traversal/movement; choose crop that retains route/depth/water/terrain; no procedural substitute | `The experience creates reality.` ends `00:20.300`; no text afterward | `THIS IS NOT A PICTURE; IT IS A TRAVERSABLE 3D ENVIRONMENT.` | User/world motion proves interaction, then clears visual bandwidth for exit |
| S06A — WITHDRAWAL START | `00:24.800–00:27.300` | `03:01.800–03:04.300` | `23774.mp4` | `00:43.000–00:45.500` | Start physical withdrawal from regional/terrain scale | `So where does reality begin?` begins `00:25.100` | `I AM LEAVING THE LOCAL EXPERIENCE.` | Ground-scale experience releases into widening atmospheric motion |
| S06B — GLOBE RESTORED | `00:27.300–00:29.800` | `03:04.300–03:06.800` | `23774.mp4` | `01:00.160–01:02.660` | Match-motion bridge / bounded acceleration between S06A and resolved globe; globe must be unmistakable by end | `So where does reality begin?` ends `00:29.300` | `THE LOCAL EXPERIENCE AND THE PLANETARY WORLD ARE THE SAME CONTINUOUS PLACE.` | Planetary context is restored and becomes the launch field for collage |
| S07 — COLLAGE SPIN ESTABLISH | `00:29.800–00:30.600` | `03:06.800–03:07.600` | Authored collage system | N/A | Begin rotating estate field; all objects secondary/equivalent; no selected object yet | None | `THERE IS MORE THAN ONE EXPERIENCE.` | Restored globe/context decomposes into estate field |
| S08 — CHARACTERS FOCUS | `00:30.600–00:33.000` | `03:07.600–03:10.000` | `1000002020.mp4` | `00:22.000–00:24.400` | `0.6 s` approach -> background blur -> `1.4 s` sharp prominence -> `0.4 s` recede | None | `CHARACTERS IS A REAL SHARED-WORLD EXPERIENCE.` | Selected picture exits; collage regains focus and spin |
| S09 — MIRRORLAND FOCUS | `00:33.000–00:35.400` | `03:10.000–03:12.400` | `experience-cycle-a.mjs` | `CLEAR_REVEAL_STATE` | `0.6 s` approach -> background blur -> `1.4 s` sharp prominence -> `0.4 s` recede | None | `MIRRORLAND IS ANOTHER RECOGNIZABLE ESTATE EXPERIENCE.` | Window recedes; cyclone resumes |
| S10 — BRAIN FOCUS | `00:35.400–00:37.900` | `03:12.400–03:14.900` | `coherence-cycle-c.mjs` | `RESOLVED_BRAIN_STATE` | `0.6 s` approach -> background blur -> `1.5 s` sharp prominence -> `0.4 s` recede | None | `COHERENCE IS ANOTHER DISTINCT EXPERIENCE / INSTRUMENT.` | Brain recedes; final cycle accelerates into climax |
| S11 — MANOR CLIMAX / TERMINAL | `00:37.900–00:40.200` | `03:14.900–03:17.200` | `estate-cycle-e.mjs` | `COHERENT_MANOR_CORE_STATE` | `0.5 s` approach -> background falls soft -> `1.8 s` dominant hold; no recede before cut | `DIAMONDGATEBRIDGE.COM` visible `00:39.000–00:40.200` only | `THE EXPERIENCES BELONG TO ONE ESTATE.` | Musical/visual climax ends with Manor still resolved; picture ends with score window |

---

## 5. Cyclone / collage hard law

The collage is preserved. Its behavior is no longer an uninterrupted storm.

Exact grammar:

`SPIN -> SELECT -> APPROACH -> BACKGROUND BLUR/SOFTEN -> OBJECT DOMINATES -> HOLD -> RECEDE -> REORIENT -> SPIN AGAIN`

Recognition requirements:

- selected object sharpness is primary;
- nonselected objects remain visible enough to preserve the sense of a larger field but are visibly subordinate;
- no selected object receives less than `1.0 s` of dominant readable prominence;
- default hold is `1.4–1.5 s`;
- terminal Manor hold is `1.8 s`;
- approach/recede motion may accelerate with music;
- hold duration may not collapse to preserve edit rate;
- the cyclone is transport, not content.

---

## 6. Typography freeze

Conceptual text is limited to four complete statements:

1. `What makes something real?`
2. `What wasn't before doesn't define what is possible.`
3. `The experience creates reality.`
4. `So where does reality begin?`

Terminal text:

- `DIAMONDGATEBRIDGE.COM`

`DISCOVER` and `EXPLORE` are **not part of this proof cut**. They are intentionally removed from the frozen pre-render table because the collage already performs the invitation function and additional words would compete with object recognition during the climax.

Text rules:

- no word-by-word semantic fragmentation;
- no new sentence during H-Earth entry;
- no conceptual prose during the collage;
- text position must avoid the primary moving subject;
- use the restrained older Chapter 02 visual language as typography precedent;
- phone readability is mandatory.

---

## 7. Reframe / source-treatment law

The two primary captures are `1080 × 2340` portrait source evidence. Final picture treatment is shot-aware rather than universal.

Allowed:

- non-destructive crop/reframe;
- bounded stabilization when source shake is demonstrably distracting;
- modest exposure/contrast continuity matching;
- match-direction cuts and short dissolves where they preserve geographic continuity;
- removal from frame of browser chrome, Android controls, and debug/state labels through crop/reframe.

Prohibited:

- blurred duplicate side-fill;
- phone/device bezel simulation;
- stretching portrait into landscape;
- synthetic replacement terrain;
- regenerated geography;
- retired three-river Gratitude terrain;
- generic decorative globe replacement;
- crop that removes the spatial evidence the shot exists to prove.

---

## 8. Coherence gate

Every shot must pass this chain:

`SOURCE PROOF -> CONTEXT -> MUSIC -> TRANSITION -> RECOGNITION -> NEXT BEAT`

Exact viewer-question mapping:

- S01: Where am I? -> `A WORLD.`
- S02: Where am I going? -> `AUDRALIA.`
- S03: What is happening? -> `I AM ENTERING IT.`
- S04/S05: Why does it matter? -> `I CAN EXPERIENCE / MOVE THROUGH IT.`
- S06: What did I just experience? -> `ONE LOCAL EXPERIENCE INSIDE THE SAME WORLD.`
- S07–S11: What is the larger meaning? -> `THIS WORLD IS ONE PART OF A LARGER COHERENT ESTATE.`

If a shot cannot answer its assigned question, it is removed before render.

---

## 9. Pre-render stop conditions

Do not render if any of the following is unresolved:

- source identities for `23774` / `23775` are not available and hash-verifiable in the render environment;
- canonical soundtrack cannot be extracted as one continuous `157.000–197.200 s` window;
- the `02:47.000` musical anchor does not land at film `00:10.000`;
- a shot requires retired three-river geography;
- H-Earth traversal is replaced by procedural reconstruction;
- any collage object cannot hold at least `1.0 s` at recognizable prominence;
- typography requires semantic fragmentation to fit;
- source crop would retain browser/debug chrome as intentional design;
- final proof cannot end at exactly `40.200 s` with continuous audio.

---

## 10. Next authorized editorial boundary

`MUSIC_WINDOW = FROZEN`

`RUNTIME = 40.200 s FROZEN`

`SHOT_ORDER = FROZEN`

`PRIMARY_SOURCE_SPINE = 23774 + 23775 FROZEN`

`COLLAGE_OBJECT_ORDER = CHARACTERS -> MIRRORLAND -> BRAIN -> MANOR FROZEN`

`COLLAGE_MINIMUM_HOLDS = FROZEN`

`TYPOGRAPHY_ARGUMENT = FROZEN`

`NEXT = LOW_COST_PROOF_CUT / COHERENCE REVIEW`

No final-resolution master should be encoded before the low-cost proof cut confirms that the geographic entry, H-Earth interaction proof, return-to-globe, collage hesitation, and musical climax read coherently in motion.