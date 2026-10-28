# Composed groundcover source finding and bounded candidate

Status: source and CPU algebra qualified; GPU comparison and visual decision remain pending. This inventory does not claim that the broad band or the separately unresolved straight/curved cutoff classes are repaired.

## Exact custody

Renderer: `showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js`.

- Approved baseline: Gen2928 `cb57c275b95d0d48883bc4da4dcfcf17cbec5060`, SHA-256 `fa6acc426c75c3b2292b3ed76a756157698d8e7a5562511ad7ced5af58e25dec`.
- Rejected footprint predecessor: `1e4eeaaec018b92e7eeade9ba17b773a4ea4ccef`.
- Candidate renderer SHA-256: `0a8eecd0c4dc87d4521f403331ff642955e23b1255f4da52a2319751c23008d2`.
- Removing the one marked `H_EARTH_GROUNDCOVER_SOIL_RELATIVE_TARGET` block reconstructs the approved baseline hash exactly. All three rejected footprint blocks are absent. This binds unchanged shader weight, suitability, protection, relief, downstream overlays and lighting, rather than asserting their preservation from selected snippets alone.

## Complete incoming color, endpoint and weight

The shared `FS` first constructs landform soil/rock colors and material variation. Eligible inland soil then receives the approved image texture: `worldSoilReference=pow(worldSoilTexel,vec3(2.2))*0.75`, moisture/elevation tint, and broad tonal variation form `worldSoilActualAlbedo`. Coast authority and slope/rock eligibility compose this into `palette`. Texture-derived normals separately enter `shadingNormal` and `terrainReliefEnvelope`.

Next, environmental identity mixes six continuous soil families into that textured palette. `identityWeight` depends on inland distance, protected grove and identity contrast. Thus the input to groundcover is the **already composed soil plus identity**, not raw vertex color and not the soil texture alone.

The original target `groundcoverTone` independently mixes `(0.110,0.118,0.075)` and `(0.075,0.090,0.055)` by moisture, then `(0.175,0.150,0.095)` by dryness, and multiplies by `0.88+0.24*materialVariation`. It does not inherit the actual soil texel or the incoming composed palette.

The original spatial field rotates/warps world position, combines organic noise and meso field through `smoothstep(0.20,0.66,...)`, and produces:

```
w = 0.88 * groundcoverPatch
    * (1 - 0.25 * smoothstep(0.30,0.85,groundcoverPatch))
    * groundcoverSuitability * groundcoverProtection
```

Suitability retains coast, slope and rock-exposure masks. Protection retains oasis, estate, approach route and accepted grove. The candidate changes none of this expression, its constants, domains or masks.

The exact composition under test is `palette=mix(palette,groundcoverTone,groundcoverWeight)`. Writing incoming soil as S and target as T gives `C=(1-w)S+wT`. Its spatial gradient contains `(T-S)∇w`. A dark independent endpoint therefore turns a broad coverage transition into a broad brightness boundary. At fixed cover/material signals the contribution of incoming texture detail is multiplied by `(1-w)`; at the original maximum weight .66 only .34 remains. The independently varying coarse `materialVariation` in T does not restore the omitted photographic texture detail.

Prior staged and removal GPU evidence establishes this stage at the archived inland band. The rejected footprint result constrains the new question: does replacing the independent dark endpoint with substrate-relative chroma remove the objectionable broad transition while retaining controls? The algebra establishes a mechanism capable of producing the boundary; it does not establish that changing it will satisfy visual acceptance.

## Active consumers and explicit exclusions

| Producer / program | Actual execution of groundcover |
| --- | --- |
| Main geometry program `GF`, using common `FS`; ordinary near terrain | Executes for role1 unless primitive62001. |
| Exact FAR continuation, same `GF` / `FS` | Executes through the exact `uGlobalCoverFarPrimitiveIndex` predicate. Normal correction and existing FAR handling remain unchanged. |
| Geological upload: `ERODED_TERRAIN`, `MOUNTAIN_OVERBURDEN` | Actual upload assigns primitive62000 / role1. Executes the same ordinary-ground expression. |
| Geological upload: `NATURAL_CLIFF_FACE`, `CAVERN_PHYSICAL_SHELL` | Actual upload assigns primitive62001. They enter world-soil processing but `!geologicalEarthRock` excludes identity/groundcover. |
| `WOODLAND_FINE_GRASS_FS`, derived from `FS`, compiled as woodland fine grass | Source contains the shared expression, but grass vertices assign primitive65535 / role3, bypassing it. |
| `GLOBAL_COVER_PATCH_SUPPRESSION_FS`, derived from `FS`, compiled as `GLOBAL_COVER_FS` and `LOCAL_PREVIEW_FS` | Source contains it; inherited global-cover vertices assign primitive65535 / role3, including meadow near/mid derivative variants. Bypassed. |
| Authored and generated trees/cavern vegetation | Role3, excluded. Actual geological upload uses tree62004 or cavern62002/62003, not terrain62000 role1. |
| Ocean / freshwater | Role4, excluded. Freshwater primitive62000 alone does not make it soil. |
| Depth, clearing shadow and present-color programs | Separate shaders; no groundcover expression. |

The operative predicate is `(primitive62001 OR role1 OR exactFAR) AND NOT primitive62001`. No archived shader copy is a repair target. This inventory resolves the shared expression's consumers; it does not claim to requalify every runtime surface or map-wide boundary class.

## Candidate and limitations

Let `L=(.2126,.7152,.0722)`. Form `Q=S*T`, then `T'=Q*(dot(S,L)/dot(Q,L))` for positive denominator; use S for the zero case. Keep the existing `mix(S,T',w)`.

This retains incoming linear luminance for every weight and preserves scalar texture variation: scaling S by k scales both T' and the result by k. Substrate channel ratios remain present, modified by existing cover chroma; the candidate does not replace them with one absolute endpoint. Zero protection/weight remains identity, and all normal/relief/light code is unchanged. The original tone's scalar material-variation multiplier cancels under normalization; the incoming soil's material and texture variation remains instead. This is an intentional change in endpoint composition, not amplitude attenuation or threshold adjustment.

Downstream manor, ravine/local earth, sand/bank, shoreline soil, woodland litter and habitat contributions still run in their original order, followed by sun/shadow, fog and gamma/clipping. Equal stage linear luminance is not a guarantee of equal final perceived luminance under chromatic lighting, nor a guarantee that a chromatic boundary disappears. Existing groundcover hues can still alter healthy areas where weight is nonzero. Those are reasons for the frozen comparison and rejection gate, not reasons to assume success.

## Executed qualification

`node --test h-earth-3d/evidence/groundcover-composed-target-20261028/target.test.mjs`: 6/6 pass. The tests bind the approved source hash, evaluate the actual marked target arithmetic after explicit GLSL-to-JavaScript vector translation, check luminance and scalar-detail preservation across weights and representative soil/cover inputs, zero identities, substrate chromatic retention, the old endpoint's loss mechanism, and source consumer bindings.

These are CPU/source tests, not a full shader compiler, GPU capture, physical-device result or independent visual approval. The source analyst implemented this candidate and therefore cannot serve as its independent final West reviewer.

Next decision: compare the one candidate at the frozen defect/control poses. Keep only if the established broad band visibly improves with healthy controls intact; otherwise preserve the failed assertion and reject. No merge, publication or global closure follows from these tests.
