# H-Earth Live Package vs Exact-Candidate Inspection Package Parity Audit v1

Status: FROZEN READ-ONLY
Disposition: PARITY FAIL — INSPECTION OUTPUT MUST NOT BE USED AS A LIVE-VISUAL PROXY UNTIL CORRIDOR PARITY IS PROVEN.

## Evidence

### 1. Live public route is not the R3C exact-candidate inspection corridor
The public route `showroom/globe/h-earth/index.js` explicitly imports and hands off to:
- `./compositor.js`
- `./renderer.js`

The public renderer identifies its output model as:
`DOM_CSS3D_PROJECTED_ENVIRONMENT`.

Its documented materialization path is admitted geometry -> semantic DOM/CSS layers -> presentation mapping.

### 2. The exact-candidate inspections used during the September terrain work exercise a different presentation corridor
Those inspections expose the Run8E/R3C WebGL package path (immutable package, GPU upload views, R3C persistent renderer, R3A frame uniforms). The resulting frames are therefore not presentation-parity evidence for the public DOM/CSS renderer.

This explains the observed class difference:
- public live: strong striated/gradient mountain material expression and richer water;
- inspection: broad flat polygon/color fields even when source geography is related.

### 3. Public live renderer bytes are preserved in the repository live snapshot
Current:
`showroom/globe/h-earth/renderer.js`
blob: `799d37cec5244e6aa19b7d94dffe37e182b85884`

Live snapshot:
`h-earth-live-6d18e158/showroom/globe/h-earth/renderer.js`
blob: `799d37cec5244e6aa19b7d94dffe37e182b85884`

These are byte-identical. Therefore the visible live advantage is not evidence that the current public renderer file was lost.

### 4. Compositor lineage is not byte-identical
Current:
`showroom/globe/h-earth/compositor.js`
blob: `ae69d5a26604a7bd12a685c283211afe61b46dbd`

Live snapshot:
`h-earth-live-6d18e158/showroom/globe/h-earth/compositor.js`
blob: `3764f0d53b0564de7a5e983bd339dda75017bc82`

This requires a separate semantic diff before claiming complete live-package identity.

### 5. Exact-candidate preview contract does not authorize corridor substitution
The repository preview contract requires an immutable candidate and a renderable target review surface. It does not state that a different renderer may stand in for the target public renderer while retaining perceptual-equivalence authority.

## Deterministic conclusion

The recent custody screenshots were useful for diagnosing the R3C package, but they were **not a valid whole-product live visual comparison**.

The earlier statement that I1 was "live visual lineage + two corrections" was therefore too strong. It preserved source-side components but the inspection surface did not preserve the public presentation corridor.

## Required next construction law

A valid live-vs-candidate visual gate for H-Earth must execute the candidate through the same public corridor:

candidate bytes
-> public `index.js`
-> public `compositor.js`
-> public `renderer.js`
-> same DOM/CSS materialization
-> physical-device inspection.

The candidate may change admitted source dependencies, but the comparison renderer/compositor/presentation corridor must remain the same unless the renderer itself is the admitted target of the experiment.

## Immediate next steps

1. Diff current compositor against the known live snapshot and classify every semantic difference.
2. Establish an exact-SHA public-route preview that loads the candidate's actual `showroom/globe/h-earth/index.html`, `index.js`, `compositor.js`, `renderer.js`, CSS and transitive dependencies—not an R3C substitute.
3. Re-run the two proven architecture corrections inside that corridor.
4. Compare live and candidate at matched cells/view headings.
5. Reject automatically if the public visual floor is not preserved.

## Protection

- I1 PR #4309 is rejected/closed.
- No production deployment is authorized by this audit.
- No R3C custody screenshot may be treated as public-route visual parity evidence.
