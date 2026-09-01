# H-Earth / Audralia Successor-Control Continuity Packet

## Purpose

This document is the repository-resident recovery authority for continuing H-Earth / Audralia development if conversational continuity is lost.

The governing development chain is:

**ACCEPTED BASELINE → ONE NAMED DEFECT → ONE OWNING AUTHORITY → BOUNDED DELTA → EXACT-HEAD VERIFICATION → OWNER INSPECTION**

The governing principle is: **Do not redesign an accepted system to fix a bounded defect.** Use the last owner-accepted baseline, identify the exact visible defect, prove which runtime/rendering/geometry/interaction authority owns it, freeze everything else, make the smallest lawful correction, verify the exact head, then return it for owner inspection.

---

## 1. Non-Negotiable Successor Laws

### 1.1 Accepted baseline is protected

The most recent owner-accepted candidate is the default starting point. Do not begin from the latest failed candidate merely because it is newer.

If a candidate regresses, return to the last good ancestor and construct a new bounded successor from there.

**GOOD BASELINE + MINIMUM REQUIRED CORRECTION**

not:

**FAILED CANDIDATE + PATCH + PATCH + PATCH**

### 1.2 Code change is not experience improvement

**CODE DELTA ≠ EXPERIENCE DELTA**

Never treat implementation activity as proof of progress. A candidate advances only when the intended experience-level improvement is visible or otherwise directly verified.

### 1.3 No mutation before ownership

**NO PRODUCT MUTATION UNTIL DEFECT OWNER IS IDENTIFIED**

Possible ownership layers include canonical state/world law, geometry, material/optical law, coverage geometry, renderer, GPU upload path, compositor, atmosphere pass, macro weather, local volumetrics, lighting, LOD, camera, interaction/traversal, and route/deployment.

If ownership is uncertain, perform a decomposition trace first.

### 1.4 Freeze all non-owning subsystems

Once the owner is identified, every unrelated subsystem is frozen unless evidence proves it must change. No opportunistic polish, no “while we are here” adjustments, and no unrelated architecture work.

### 1.5 Protected references are evidence

Owner-supplied videos, screenshots, or previously accepted candidates are evidence, not inspiration. If an older reference visibly contains the desired quality, reproduce that quality first and repair only the defect around it.

**THE OWNER'S VISUAL REFERENCE IS EVIDENCE**

### 1.6 Optical authority and coverage authority remain distinct

**OPTICAL LAW ≠ COVERAGE GEOMETRY**

Examples: do not stretch a beach mesh to make ocean color continue; do not add global density to solve sparse macro weather; do not add haze to hide exposed geometry; do not redesign local volumetrics to solve planetary occupancy.

### 1.7 Reject regressions internally

A candidate must not be handed to the owner merely because it runs. If the target improves but any protected quality materially degrades, reject it internally.

---

## 2. Standard Replacement-Room Header

Paste this into a replacement room:

> **CONTINUITY / SUCCESSOR-CONTROL MODE**
>
> This room is continuing an existing development line. Use: **ACCEPTED BASELINE → NAMED DEFECT → DEFECT OWNER → BOUNDED DELTA → EXACT-HEAD VERIFICATION → OWNER INSPECTION**. Do not redesign accepted architecture unless direct evidence requires it. Do not treat implementation change as visual progress. Do not start from a failed candidate when a protected good ancestor exists. Owner-provided visual references are evidence and must be preserved unless explicitly superseded. Before product mutation: state the exact visible defect, identify its owning layer, freeze non-owning systems, and define binary acceptance predicates. After mutation: verify the exact candidate head through the actual runtime path, compare against the protected reference, reject internally if any protected quality regresses, and only then provide the owner-inspection environment.

---

## 3. Candidate Definition Template

### Candidate Identity

- Project:
- Candidate name:
- Exact baseline SHA / branch:
- Exact candidate SHA / branch:
- Owner-accepted predecessor:
- Protected visual reference(s):
- Failed candidates that must NOT become ancestry:

### Exact Target Defect

State the defect in one sentence.

### Acceptance Predicates

The candidate passes only if:

- [predicate 1]
- [predicate 2]
- [predicate 3]

The candidate automatically fails if:

- a protected quality regresses;
- a representation leak appears;
- performance falls below the accepted floor;
- unrelated subsystems change.

### Proven Defect Owner

- Owning layer:
- Evidence proving ownership:
- Diagnostic method:
- Non-owning layers explicitly frozen:

### Authorized Delta

Only named files / authorities may change. Everything else remains frozen.

### Verification

- Syntax / structural:
- Exact-page runtime:
- Visual A/B:
- Mobile/browser:
- Performance:
- Owner-inspection link:

### Disposition

Choose one:

- PASS — SUCCESSOR CANDIDATE
- REPAIR REQUIRED
- REJECTED — RETURN TO PROTECTED BASELINE
- PROMOTION READY

---

## 4. Render-Pass Ownership Diagnostic

When a representation artifact cannot be attributed confidently, freeze atmospheric/render parameters and decompose the frame:

- **F0 = terrain/world only**
- **F1 = F0 + planetary atmosphere**
- **F2 = F1 + macro weather**
- **F3 = F2 + W5 local volumetrics**
- **F4 = F3 + celestial / overlay**

At the same fixed camera, capture each pass incrementally. Capture the suspect pass normally and as a flat diagnostic mask.

**Fn clean + Fn+1 defective ⇒ PASS n+1 OWNS DEFECT**

Only the owning pass may then change.

---

## 5. H-Earth / Audralia Atmospheric Authority Map

### FAP1 = macro weather authority

Owns planetary weather organization, weather-system geographic placement, cloud-bearing regional occupancy, altitude-family assignment, clear-air corridors, macro cyclone organization, and weather-scale haze support.

Does not own W5 local cloud morphology, L5 local volumetric lighting, terrain, camera, navigation, or LOD architecture.

### W5 = proximity volumetric authority

Owns local cloud bodies, cloud approach, cloud interior, local density architecture, cavities/masses/local morphology, and spatial cloud occupation at proximity.

### L5 = local volumetric lighting authority

Owns directional illumination through local cloud volume, extinction, core/edge lighting separation, and local scattering presentation.

### LOD = scale-transition authority

Owns how representations simplify/refine across distance and continuity of scale handoff.

---

## 6. Protected Atmospheric References

### 24049 — Macro Weather Visual Reference

Protect for planetary cloud organization, world-scale meteorological identity, macro composition, ambiance, and irregular weather distribution. Do not revert the architecture to 24049 if doing so loses later proximity capability.

### 24055 — Local Volume Reference

Protect for proximity volume, cloud-interior credibility, local density variation, and volumetric advancement. Known issue: severe stepped/geometric horizon representation leak.

### 24056 — Architectural Baseline

**24056 = protected architectural baseline.**

It is the strongest combined system so far: it retains much of 24049 macro character, retains 24055 volumetric progress, and materially reduces the stepped-horizon problem. The system should now be finished rather than rewritten.

Remaining ceiling work includes stronger individual cloud morphology, better local lighting extraction, removal of residual altitude-band tells, improved cloud coverage without veil, and preservation of macro/local continuity.

Do not architecturally rewrite 24056 without compelling new evidence.

---

## 7. 24057 Failure Classification

**24057 = REPAIR REQUIRED.**

What improved: planetary weather occupancy, opening macro presence, and visible cyclone alignment work.

What regressed: descent often became broad low-information blue/gray veil; macro coverage did not resolve into corresponding local W5 bodies; orbit → regional → local continuity weakened; smooth synthetic limb remained perceptually visible; local volume/morphology read lower than 24056.

Key diagnosis:

**WEATHER OCCUPANCY IMPROVED WITHOUT WEATHER RESOLUTION ACROSS SCALE**

Do not continue building on 24057 as though it were the new good baseline. Return to 24056 for successor construction.

---

## 8. Current Coverage Strategy

Current complaint: too much empty planetary space without clouds.

Correct interpretation:

**CLOUD QUALITY = STRONGER**

but

**CLOUD COVERAGE / OCCUPANCY = TOO SPARSE**

Wrong solutions: global density increase, global haze, shader-only cloud decoration with no local descendant, adding cloud everywhere, or sacrificing clear-air corridors.

Correct objective:

**MORE CLOUD-BEARING REGIONS ≠ DENSER CLOUDS EVERYWHERE**

Preferred implementation strategy:

1. Start from 24056.
2. Use existing FAP1 weather systems as authoritative coverage carriers.
3. Increase or rebalance their geographic footprints modestly.
4. Keep weather identity stable where possible.
5. Ensure every added macro-covered region resolves into an existing/local volumetric authority.
6. Do not add shader-only planetary cloud masses that disappear into veil at proximity.
7. A/B orbital coverage and descent behavior separately.

Coverage acceptance requires:

**ORBITAL WEATHER OCCUPANCY IMPROVES**

AND

**DESCENT RESOLVES INTO DISTINCT LOCAL CLOUD BODIES**

AND

**NO GLOBAL VEIL**

AND

**NO MATERIAL PERFORMANCE REGRESSION**

---

## 9. Cyclone Placement Contract

Named system: **SOUTHERN_OCEAN_CYCLONE**.

Earlier center: latitude -36°, longitude -126°.

Moved target: approximately latitude -20°, longitude +20°.

Intent: majority of storm visible in daylight, minority crossing darkness, preserve storm structure, and do not change size/morphology merely to change lighting exposure.

Target visual split: **~70–80% daylight + ~20–30% night**.

Cyclone geographic relocation is FAP1-only.

---

## 10. Horizon / Limb Contract

Historical stepped horizon diagnosis isolated the severe artifact to **F1 = planetary atmosphere**.

Cause: atmosphere pass used a rasterized planet-mesh/depth silhouette as a sky cutoff, exposing polygonal/stepped geometry.

Repair principle: analytic sphere/tangent authority, preserve terrain occlusion, do not mask with haze, and do not alter cloud density to hide horizon defects.

Residual issue: a very clean analytic tangent can still read as a synthetic dark curved limb. Do not reintroduce a risky limb experiment while solving unrelated cloud coverage. Coverage and limb refinement should be independently bounded whenever possible.

---

## 11. H-Earth Coastal Recovery Lessons

The failed coastal sequence repeatedly changed ribbon widths, colors, shoreline geometry, inactive renderer paths, and depth variables while the live WebGL path was flattening the intended presentation.

Critical discovery:

**THE ACTIVE RUNTIME PATH, NOT THE PLAUSIBLE SOURCE FILE, OWNS THE SCREEN**

Before claiming an optical repair, trace the data all the way to the pixels: semantic geometry → admission → render material → GPU upload → shader role/color attributes → active compositor.

---

## 12. Environment Successor Discipline

For any future H-Earth visual defect:

### A — Freeze
Record last accepted exact SHA, visual reference video, and protected subsystems.

### B — Name
Reduce the complaint to one or two visible defects.

### C — Trace
Prove the active owning layer.

### D — Bound
Authorize the minimum delta only.

### E — Verify
Run structural checks, exact runtime, actual active render-path verification, A/B against protected video, and performance checks where relevant.

### F — Inspect
Only provide an owner link after the stated predicates are actually present.

### G — Promote
Promote only the accepted successor, not an intermediate debugging branch.

---

## 13. Anti-Digression Rules

Stop and reassess if:

- more than one unrelated subsystem must change;
- a visual complaint is being solved by generalized haze;
- coverage is being solved by density everywhere;
- an older known-good optical reference is being reinterpreted rather than reproduced;
- a failed candidate becomes the default baseline;
- implementation sophistication is cited instead of visible improvement;
- unrelated touch-ups begin before the requested defect is closed;
- the actual active render path has not been proven;
- the same owner complaint survives two candidate cycles.

If the same visible complaint survives two cycles:

**STOP PATCHING. RE-TRACE OWNERSHIP.**

---

## 14. Owner Handoff Format

Every candidate handoff should state:

1. Protected baseline.
2. Exact defect being addressed.
3. Proven owning authority.
4. Exact files/layers changed.
5. Explicitly frozen systems.
6. Exact SHA.
7. What was internally verified.
8. What remains owner-judgment only.
9. Direct inspection link.
10. Whether the candidate is diagnostic, inspection candidate, qualified successor, or promotion-ready.

Avoid language such as “improved” unless the improvement was actually observed in rendered output.

---

## 15. Current Strategic Summary

The current atmospheric system is a **finishing problem, not an architecture-replacement problem**.

Protected architectural base: **24056**.

Protected macro reference: **24049**.

Protected local-volume reference: **24055 / 24056**.

Current target:

**24056 ARCHITECTURE + BETTER PLANETARY COVERAGE + PRESERVED LOCAL VOLUME + INVISIBLE REPRESENTATION**

Primary risk: improving orbital cloud occupancy in a way that becomes generalized veil during descent.

Governing multiscale acceptance chain:

**ORBITAL WEATHER → REGIONAL SYSTEM → LOCAL CLOUD BODY → CLOUD INTERIOR → EXIT**

Every visible macro system must have a credible local descendant.

---

## 16. Emergency Restart Prompt

> Continue H-Earth/Audralia in strict successor-control mode. Treat 24056 as the protected architectural baseline, 24049 as the protected macro-weather visual reference, and 24055/24056 as the protected local-volume reference. Do not rewrite the cloud architecture. The current issue is planetary cloud coverage: there is too much empty space, but the solution must not increase density globally or create shader-only cloud masses that collapse into veil during descent. Use FAP1 for macro coverage, W5 for proximity volume, L5 for local lighting, and keep those authorities separate. Start from the last accepted good ancestor, identify the exact defect owner before mutation, freeze all non-owning systems, make the smallest possible delta, verify the exact active runtime/render path, reject regressions internally, and only provide an inspection link once orbital occupancy improves while descent still resolves into distinct local cloud bodies without representation leaks or material performance regression.
