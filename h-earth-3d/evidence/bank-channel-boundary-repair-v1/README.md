# H-Earth bank, channel, scenic continuation and boundary repair

Operation `H_EARTH_BANK_CHANNEL_BOUNDARY_REPAIR_20261017_001`, canonical generation 2799. Exact governing/published baseline: `79c8f92318b876276268e1778c493daa0a2014e6`. Authentic canonical admission: `717dd7718400d1cb8b209c828ef11c39a40ac8b5`. Intake packet and N/E planning source: [issue 6426](https://github.com/smansfield635-create/smansfield635-create.github.io/issues/6426#issuecomment-6243633838). This evidence creates no additional authority.

## Implemented delta

- A shared planned 12-metre channel footprint plus the existing emitted oasis/river footprint excludes habitat and roots independently of support height and paused rear water. Actual admission is tested at support heights -100, 0 and 1000 metres; every emitted root is checked against the complete footprint.
- Dense banks use the existing 192-square ravine raster, existing accessible ravine bounds and shared eligibility. The ravine budget is independent of the preserved woodland; if exceeded, candidates farther from the channel yield before the dense core. Organic outer shoulders taper before the old broad reach. The unchanged atlas upload remains 73,728 bytes; no shader or loader/scheduler contract changes.
- The accepted 32 stations / 64-metre dry extension is retained. An explicitly authored scenic continuation runs through (-112,-448), (-160,-472), (-208,-488), (-256,-512), ending at (-272,-544), behind the existing ridge. The proposed (-280,-544) endpoint failed actual emitted-bank visibility and was moved eight metres east within admitted canonical terrain. The 78-station original survey, 79 original runtime drainage points, all water geometry and rear-water pause remain unchanged. No new surveyed hydrology or connected outlet is claimed.
- Original replacement terrain plus one bounded 2-metre south patch form an L-shaped union. Canonical triangle retirement uses exactly that union. Original upper-left woodland terrain is retained, preserving exact root heights. All six exterior segments/corners blend original normal/color/material/coast/contact attributes; the shared internal seam is not treated as an exterior boundary.
- The actual public route invokes the existing boundary feedback helper: rejected outer-boundary travel displays the notice, turning retains it, and accepted return travel clears it. Walking bounds remain x[-256,256], z[-400,-80].

## Actual bank density

The measured windows are both 8–10-metre bank strips along the accepted straight 64-metre extension: four 16-metre sections per bank, starting at z=-352 and ending at z=-416. Each geometric strip is 32 m². Eligible area is independently sampled on a 0.25-metre grid using final visible terrain, shared admission, material, slope and protected footprints. Counts are actual contacted roots, not candidate density or a raw region population. Both banks have nonvacuous eligible sections. These numbers do not claim uniform density across the entire ravine or beyond the unchanged accessible vegetation atlas.

| Bank | Section | Geometric m² | Eligible m² | Actual roots | Roots / eligible m² |
| --- | ---: | ---: | ---: | ---: | ---: |
| West | 1 | 32 | 32 | 1131 | 35.3438 |
| West | 2 | 32 | 32 | 1077 | 33.6562 |
| West | 3 | 32 | 32 | 1134 | 35.4375 |
| West | 4 | 32 | 31.9375 | 992 | 31.0607 |
| East | 1 | 32 | 32 | 1090 | 34.0625 |
| East | 2 | 32 | 32 | 1033 | 32.2812 |
| East | 3 | 32 | 32 | 1040 | 32.5000 |
| East | 4 | 32 | 32 | 1100 | 34.3750 |

Same canonical fixture woodland comparison: x[-152,-136], z[-236,-220], 256 geometric m², 252.75 fully eligible m², 7354 preserved actual root XY positions, 29.095945 roots / eligible m². Candidate XY equals actual root XY because all 385,944 woodland candidates are retained and their exact persistent XYZ/angle/seed identity is unchanged. Material/slope/shared/protected checks use the same independent 0.25-metre area method. The earlier [N/E preplan](https://github.com/smansfield635-create/smansfield635-create.github.io/issues/6426#issuecomment-6243654711) reported 100,881 / 2,801 ≈36.016 on a different, broader shared-admission-only denominator; it is not substituted for this fully eligible comparison.

## Source and CPU qualification

Exact admitted command:

```sh
node --test h-earth-3d/validation/h-earth.bank-channel-boundary-repair.v1.test.mjs h-earth-3d/validation/h-earth.terrain-cavern-seam-repair.v1.test.mjs h-earth-3d/validation/h-earth.corridor-bank-expansion.v1.test.mjs
```

Result: 13 tests passed, zero failed. The first measured density attempt exceeded 36 in two west-bank sections (36.53125); the bounded probability correction was then rerun against the unchanged 30–36 acceptance range.

- Woodland: 385,944; ravine: 98,671; total: 484,615; extension roots south of z=-352: 36,003. Maximum tile: 816. Packed roots: 7,753,840 bytes.
- Hard ceilings remain 450,000 woodland / 150,000 ravine / 600,000 total / 1,600 per tile / 9,600,000 packed bytes.
- Every one of 484,615 actual roots has final triangle contact (maximum contact error 0 m), shared eligibility and no planned-water footprint overlap. All protected-channel centerline atlas samples are zero, including direct bilinear R8 sampling.
- Woodland persistent XYZ/angle/seed SHA-256: `e40321b7e6d05793f66431f38c669055a563c3229970aa6ecda3d838c3d298a5`. Original candidate identity: `e24e0d29da4da6435f043ee0449c0b1ff6abfa057abded77e6db5eceee2b590b`. Woodland raster identity: `6f982e28c97146a2aea6bf9dbd8b7e8848daf251004dff57b2febbd452759fbe`.
- Original survey identity: `42ce8fc5a14247dd9a8e42394cc4d4e7e59a082abe5e7992fa22cebb24c617ef`. Original runtime drainage identity: `7799cf58594ec0c6494a2431bd41196204f82c043da7c6f0cde38d9ffcf54990`. Existing river/oasis, cavern shell, upper mantle and cliff mesh identities are asserted unchanged.
- Final emitted terrain LOS: 149 full-circle terminal cut/bank vertices, including conservative outer shoulders, × 208 stations around all four walking-boundary sides = 30,992 rays, zero visible. Observer eye height is 2.25 m above actual canonical terrain; all observer, terminal and ray terrain heights must be finite. No fog, camera or clipping workaround. Independent West review additionally checks 832 stations at 2-metre spacing (123,968 rays) against exact source custody.
- Cavern contact: 140 mouth samples, maximum gap 4.22e-7 m. Traversal: 909 supported samples. Full L perimeter: 746 vertices, six segments and six corners, maximum attribute error 3.72e-6; 11,160 between-vertex interpolation diagnostics.

## Limits and next release boundary

These are source/CPU contact, density and visibility checks. They do not establish rendered visual richness, new GPU timings, tablet performance or owner physical-device acceptance. The visual anchor remains the same canonical navigable world and existing globe/region/ground continuity. Four approved trees, ocean, cavern/gallery/mantle/threshold, canonical world asset, shaders, loader, scheduler and prior performance contracts remain protected. Publication must still use the registered preflight, authorized qualified release and authoritative live exact-head verification, followed by owner review. No new repair is described as live by this source evidence.
