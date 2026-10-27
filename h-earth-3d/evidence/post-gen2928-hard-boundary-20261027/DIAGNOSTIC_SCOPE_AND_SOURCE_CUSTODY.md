# Post-Gen2928 hard terrain-boundary stage probe — diagnostic-only

Canonical admission: issue #6911 comment 6451232197, Gen2935. Published source baseline: `cb57c275b95d0d48883bc4da4dcfcf17cbec5060`; shader SHA-256 `fa6acc426c75c3b2292b3ed76a756157698d8e7a5562511ad7ced5af58e25dec`. Verified prior publication: workflow #40562757844. Gen2932 prior publication lock closed in workflow #40565641917 and issue #6911 comment 6451132766.

## New owner observations

The owner submitted October 27 production screenshots `30108.jpg` (strong curved tan/olive boundary), `30106.jpg` (long nearly straight material division), and `30099.jpg` (polygonal regions amidst retained grass). The earlier Gen2928 approval was based on four grass-hidden material diagnostic cameras, not globally exhaustive visuals. Current source changes only the amplitude of groundcover contribution; its base patch, protection, world-soil identity, coast and habitat material masks remain. See issue #6911 comment 6451079127. **The owner's exact camera telemetry remains unknown. No new pose in this diagnostic is claimed to match those screenshots.**

## New evaluation

Use the current exact published renderer for both source-bound local GPU checkouts; install a temporary browser-only shader instrument. From six NEW camera headings covering inland near/far, coast, river, foothill and dry mountain, capture ten identical-camera modes: reference lit without grass, pre-soil albedo, post-soil, post-identity, post-groundcover, post-local shore/bank/litter, post-habitat, raw groundcover blend, raw habitat blend, and reference lit WITH untouched grass. Shader stage probes preserve other draw and source operations; module substitution occurs in headless browser traffic rather than tracked product files.

Output 60 camera/viewport/source/asset-matched PNGs and immutable hashes in the GitHub Actions artifact. Important: source-bound stage differences are causal *candidates*, not a proven fix. Use actual images to pick a conspicuous owner-recognizable hard border and attribute the earliest introduced stage across identical screen pixels; a stage already present before world-soil or only visible in lighting needs different attribution. Require primitive/geometry telemetry or flag `INSTRUMENTATION_GAP` when stage colors alone cannot isolate the cause. The renderer does not change and this operation neither merges nor deploys.

## Completion boundaries

This diagnostic cannot close the user's map-wide issue on its own. Successful job means exact 60-image capture, not perceptual acceptance, and the selected camera may still miss the photographed class. Do not repeat old four-image Gen2928 comparisons, present guessed poses as exact owner telemetry, or modify vegetation, land geometry, navigation or coast. Independent review and a separate future bounded repair admission are required before any production change.
