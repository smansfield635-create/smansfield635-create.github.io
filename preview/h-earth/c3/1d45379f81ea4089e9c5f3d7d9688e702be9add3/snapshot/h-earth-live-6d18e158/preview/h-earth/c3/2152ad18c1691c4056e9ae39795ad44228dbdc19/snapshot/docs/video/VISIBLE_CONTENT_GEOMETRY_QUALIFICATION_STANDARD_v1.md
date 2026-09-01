# VISIBLE_CONTENT_GEOMETRY_QUALIFICATION_STANDARD_v1

Status: GOVERNING / FAIL-CLOSED
Applies to: website cinematic masters derived from portrait or device captures

## Governing distinction
`SOURCE_GEOMETRY != ENCODE_GEOMETRY != VISIBLE_CONTENT_GEOMETRY`

A 1920x1080 encoded canvas is never evidence by itself of cinematic 16:9 framing.

## Defect that triggered this standard
The rejected Compass C4 picture successor was technically 1920x1080 but visually retained a narrow horizontal extraction of portrait-source content surrounded by inactive black field. This is classified `D1_FALSE_LANDSCAPE_SOURCE_STRIP`.

Whole-phone-in-black-field and cropped-phone-strip-in-black-field are independent prohibited failure modes.

## Required geometry laboratory before full-film render
Before any new full-length render from portrait/device footage, select one representative difficult source moment and construct three 1920x1080 proofs from the exact same source frame:

1. `REFRAME` — genuine 16:9 crop in which useful source content occupies the field.
2. `PAN_SCAN` — a valid 16:9 crop positioned as a moving crop window would occupy during motion.
3. `COMPOSITE` — a deliberately authored full-field environment integrating the primary subject without reading as a portrait strip over filler.

Using the same source moment isolates geometry behavior from content differences.

## Visual acceptance gate
Every proof must satisfy all predicates:
- no phone-screen silhouette;
- no central portrait strip;
- no black pillars or dominant black bands;
- no source strip surrounded by dead field;
- no blurred/duplicated side field that reads as obvious filler;
- primary subject is large enough to judge;
- useful image content materially occupies the 16:9 field;
- frame reads as one deliberate cinematic composition.

Failure of any predicate is `FAIL_CLOSED` and prohibits a full-film render.

## Shot-specific geometry law
A successful primitive does not become a universal recipe. Final geometry remains shot-specific:
`SHOT_CLASS -> GEOMETRY_MODE -> SAFE_CROP / MOTION / COMPOSITE`.

Different shots may lawfully use different primitives.

## Qualification evidence
Metadata may verify encode geometry, codec, duration, and frame rate. It cannot close visible-content geometry.
Representative frame inspection is mandatory for this defect class.

## Full-film admission predicate
A full picture render is admitted only after:
`REFRAME_PROOF_PASS && PAN_SCAN_PROOF_PASS && COMPOSITE_PROOF_PASS`.

The subsequent picture audit must sample representative frames from every shot class and reapply the same visible-content predicates.
