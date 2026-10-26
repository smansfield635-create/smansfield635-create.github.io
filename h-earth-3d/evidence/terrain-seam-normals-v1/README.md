# Near/far terrain seam candidate

The restored scene has an active near/far shading seam. Matching surfaces use different normal vectors (up to 29.742 degrees), far water-contact defaults to 64m at affected coast joins, and far rim lighting uses a different gain.

This candidate reconciles presentation normals and coast/contact attributes at 349 shared boundary vertices, including 88 T-junctions. Raw interpolated normal magnitude is preserved until fragment normalization. The existing far-normal sign correction remains. Far-soil rim gain matches near terrain. All source arrays, geometry, palette constants, vegetation placement/support, near and interior attributes remain unchanged. Two entry import pins reference the updated renderer.

## Evidence

- Actual prepared source asset SHA256: `48f754ca1b11b8fe7eeb0e8d4573f6b6cb544cf438322a115eb52c44d3b29d5a`.
- Five tests use actual canonical GPU upload views and the unchanged contact-field implementation. They sample seven positions on each of 348 shared edges, preserve all source arrays and nonseam attributes, and reconstruct exact baseline renderer/index digests after removing only the declared delta.
- Independent West reproduced numerical continuity and source preservation. No browser or physical-device visual acceptance is claimed.
- No extra GPU buffer or bytes. Approximately 2.21MB extra temporary CPU arrays at startup. Mobile timing remains unmeasured.

## Review boundary

This is a draft candidate, not a released visual fix. The exact photographed camera position is unknown; the measured outer near/far seam is not asserted to explain every polygon in the recording. Browser comparison and owner perceptual acceptance remain pending. Local Chromium is absent and its standard download returned a truncated non-ZIP payload. Production must not be used as a preview workaround.

Required comparison: fixed near/mid/far views of the shared boundary at inland (-200,-736), coastal (384,-88) and (-384,-96), plus preserved mountains, woodland, riverbanks and preferred bare ground. Compare albedo, normals and contact independently if an edge remains; check all far-ground appearance because rim parity applies to the whole far primitive. Check resource receipts and startup responsiveness. Stop on regression and preserve the restored live scene.

The dormant refinement activation has no caller on the current route. Its contact-buffer overwrite would need reconciliation if that feature were enabled later; this candidate does not enable it. The initial refinement hypothesis was withdrawn before product writes (Gen2909); corrected near/far scope is Gen2910.

## Continuity

The route remains the same embodied Gratitude world at all scales, with unchanged camera, direct travel/look controls, interface, geography and scene identity. The hard experience anchor is retained. Full anchor acceptance is pending actual visual/interaction/continuity qualification; no passing receipt has been fabricated.
