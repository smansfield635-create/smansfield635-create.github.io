# Chapter 02 — Award-Facing Fault Taxonomy v1

Status: FROZEN EVALUATION STANDARD
Date: 2026-09-23
Authority: Chapter 02 cinematic production lineage
Reference artifact: CHAPTER02_V23_BOUNDED_INTRO_REPAIR.mp4

## Purpose

This document freezes the six-category fault model used to evaluate Chapter 02 successors. Future audits must report against the same categories so improvement, regression, and unresolved faults remain comparable between versions.

This taxonomy is diagnostic. It does not authorize picture, editorial, typography, audio, runtime, publication, or deployment mutations.

## 1. Editorial Composition

Governs sequence, timing, information flow, transitions, reading states, and the relationship between language and picture.

Questions:
- Is the right information presented at the right moment?
- Do statements enter, hold, resolve, and clear cleanly?
- Do transitions preserve comprehension and dramatic rhythm?
- Does picture support rather than compete with the active narrative state?

V23 observations:
- Some typography handoffs visually compete.
- The middle becomes busier than the opening.
- Some reading states require cleaner resolution.

## 2. Shot Design / Framing

Governs camera position, scale, composition, movement, subject placement, visual progression, and whether an image reads as an authored shot rather than navigation.

Questions:
- Is each frame intentionally composed?
- Does camera motion have narrative purpose?
- Are scale and subject placement controlled?
- Does the sequence progress through distinct cinematic views rather than merely traversing an environment?

V23 observation:
- Portions of the terrain traversal read more as navigation than deliberately authored cinematic shots.

## 3. Visual Fidelity / Art Direction

Governs lighting, atmosphere, geometry, materials, terrain realism, color, depth, environmental detail, and overall image sophistication.

Questions:
- Does the environment withstand cinematic scrutiny?
- Are geometry, lighting, materials, atmosphere, and depth mutually coherent?
- Does the image avoid synthetic, flat, or game-like cues unless intentionally required?

V23 observation:
- The terrain material is visibly flatter and more synthetic than the planetary opening, creating the largest aesthetic quality gap.

## 4. Graphic / Typography Direction

Governs type scale, placement, hierarchy, treatment, contrast, entrance/exit behavior, and CTA presentation.

Questions:
- Does typography belong to the cinematography rather than sit on top of it?
- Is hierarchy immediately legible?
- Are entrance, hold, transition, and exit behaviors intentional?
- Does graphic treatment remain consistent with the film's established sophistication?

V23 observations:
- Opening typography is comparatively sophisticated.
- Later treatment becomes more conventional/caption-like.
- Terminal CTA presentation is less resolved than the principal cinematic language.

## 5. Technical Cleanliness / Finishing

Governs unintended UI, debug artifacts, markers, overlays, encoding defects, mastering faults, audio delivery safety, and anything exposing the production apparatus.

Questions:
- Is every visible element intentional?
- Are runtime/debug controls absent?
- Are audio/video delivery parameters safe and technically clean?
- Are there any artifacts that would disqualify an otherwise finished master?

V23 observations:
- Visible touch-device/runtime-style overlay.
- Visible center marker/crosshair.
- Measured true peak approximately +0.2 dBTP and should be brought into safe final-master headroom.

## 6. Cinematic Continuity / Cohesion

This is the integration qualification layer. It asks whether Editorial Composition, Shot Design, Visual Fidelity, Graphic Direction, and Technical Finishing resolve as one film.

Questions:
- Does the entire piece feel authored by one coherent production system?
- Does any section fall below the visual or editorial contract established elsewhere?
- Are transitions between production modes invisible or intentionally expressive?
- Does the weakest production tier betray the strongest one?

V23 observation:
- Planetary imagery and terrain imagery currently feel like different production tiers. The middle breaks the visual contract established by the opening.

## Frozen Evaluation Order

EDITORIAL COMPOSITION
→ SHOT DESIGN / FRAMING
→ VISUAL FIDELITY / ART DIRECTION
→ GRAPHIC / TYPOGRAPHY DIRECTION
→ TECHNICAL CLEANLINESS / FINISHING
→ CINEMATIC CONTINUITY / COHESION

## Important Separation Rules

Shot Design and Visual Fidelity are not interchangeable. A high-fidelity environment can be poorly photographed, while an imperfect environment can still be photographed effectively.

Editorial Composition and Graphic/Typography Direction are not interchangeable. Editorial Composition determines what information belongs when; Graphic/Typography Direction determines how that authorized information is visually expressed.

Cinematic Continuity / Cohesion is not a substitute for the first five categories. It is the final integration test across them.

## Successor Audit Rule

Every future Chapter 02 candidate should classify each material finding under one of these six categories and identify it as:
- IMPROVED
- UNCHANGED
- REGRESSED
- RESOLVED
- NEW FAULT

The categories themselves remain frozen unless explicitly reopened by owner authority.
