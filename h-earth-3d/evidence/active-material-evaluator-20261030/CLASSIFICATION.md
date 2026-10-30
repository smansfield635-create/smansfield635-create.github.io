# Conditional material transition classification — Gen3000

The active terrain census now has ordered conditional material coefficients at all 40,960 centers. The strongest 20 eligible neighbor differences are driven by the native sand stage. This is a source classification, not evidence that those sand boundaries are defective or need smoothing.

Frozen product: `3ea149e5b56e8cc0d5aac192bce0cdd47da7e626`. Prior evaluator checkpoint: `aaf01a8452ac080b0a7507c9f49ed85472457fd7`. Existing admission: `H_EARTH_ACTIVE_MATERIAL_EVALUATOR_20261030_001`, generation 3000, issue6911 receipt6527846342. Writes remain confined to this evidence directory. Main movement through `eade51f8d684da2056353cbb4f8b7bf4a8759b6c` is two analytics-only commits/seven paths disjoint from the admitted scope and frozen dependencies.

## Census and ranking

| Result | Count |
|---|---:|
| Evaluated centers | 40,960 |
| Eligible centers | 39,372 |
| All grid neighbor pairs | 81,504 |
| Eligible same-owner pairs | 77,644 |
| Pairs excluded for endpoint support | 3,562 |
| Remaining pairs excluded for different surface owners | 298 |
| Evaluation errors | 0 |

The inherited local bounds are [-256,-400,256,-80], sampled at two-unit spacing. Ranking excludes nonsoil co-support, extrapolated differential helpers, shared-edge parent ambiguity and declared manor nested-derivative uncertainty. The census contains 782 nonsoil co-support centers, two extrapolated-derivative centers, 88 shared-edge centers and 716 uncertain-model centers; these categories are not asserted disjoint.

At each center the ordered material is `A * P + B`, where P is the symbolic pre-identity substrate. For each eligible neighbor pair, the score is `max_channel(max(abs(deltaB), abs(deltaA + deltaB))) / world_distance`, holding the same P in [0,1]^3 at both endpoints. It is an exact conditional coefficient bound under that assumption, not a bound on actual spatially varying substrate colors or a visible image gradient.

The full grid uses camera-distance state zero and synthetic quarter-metre world-XZ parent-plane differential quads. The deterministic phase chooses the fewest outside helpers, then lane order. These are not camera raster derivatives. Two additional camera-distance states are checked only on the selected top20 pairs; they are not independently ranked full grids.

All top20 drivers are sand, all on original-near terrain, with scores from approximately 0.403956 to 0.405843 per metre. Rank1 connects local (-165,-129) to (-165,-127). Stage attribution is computed only for the selected top20, so this is not a map-wide stage-frequency result.

## Ordered attribution

The symmetric identity `delta(g*C+b) = mean(g)*deltaC + delta(g)*mean(C) + delta(b)` propagates preceding signed contributions through later mean gains and assigns each stage its own operand change. Additive margin changes remain relative to the original substrate. Constant later attenuation receives no invented own contribution. Signed terms sum to the total coefficient difference; cancellation and local operand changes remain recorded. This is a two-point algebraic allocation, not a unique causal explanation.

## Validation and review

The full suite passes 27 Node tests, including the previous 18 Python regressions and eight new classification regressions. Independent algebra checks compare 1,000 random fifteen-stage traces and adversarial replacement/cancellation cases. See `classification-tests.txt` and `independent-attribution-review.json`.

Independent West review passes for this bounded source classification (`classification-review.json`). It reranks all 81,504 grid neighbors and 77,644 eligible pairs without calling the candidate ranker, reproducing top20 order with maximum score difference 5.55e-17. It checks all eligible-edge coefficient conservation and replays 294 distinct source queries (256 predetermined stratified centers plus 39 distinct top endpoints, with one overlap). Sampled coefficients, operands and traces reproduce exactly; all 60 selected camera pairs reproduce exactly.

All top20 have at least one common contained differential phase. Every tested common phase retains the sand driver, with zero score spread and no change from the adaptive-phase score. No top20 endpoint lies in the checked grove/oasis/estate/route cores or their native groundcover-protection fringe. These checks do not establish segment-interior support, protected-region crossing, visible ownership or a defective boundary. Independent review does not replay all 40,960 model evaluations.

## Reproduce

Prepare the authenticated source, geometry, attributes and textures using the previous README, ATTRIBUTES, INPUTS and MATERIAL procedures. Preserve their reports and retained artifact inputs. From this evidence directory:

```sh
python3 classify_material.py . /tmp/source /tmp/geometry-output /tmp/attribute-output /tmp/texture-inputs /path/to/original-mesh/mesh /path/to/candidate/receipt.json /tmp/classification.json
python3 review_classification.py . /tmp/source /tmp/geometry-output /tmp/attribute-output /tmp/texture-inputs /path/to/original-mesh/mesh /path/to/candidate/receipt.json /tmp/classification.json /tmp/classification-review.json
```

The classifier also writes `/tmp/classification.intermediates.npz`. Its raw arrays are reproducible intermediates, not committed evidence. Five declared array hashes are committed in `classification.json`; the review separately records observed coordinate/owner hashes. Replay requires the authenticated input artifacts and preceding preparation steps, not merely this JSON. The independent ranking check consumes those arrays, while its source replay is a bounded sample rather than an independent full-grid model run.

## Boundary and one next action

Trace the rank1 sand-coverage transition in source along its two-unit segment, resolving its contact/coast/slope operands and continuous surface/protected-context support before deciding whether it is an intended shoreline boundary or an eligible repair target. Keep this source-only and preserve dark/light cores, native texture and the earlier local correction.

The prior atlas/margin specimen near world Z=-735 and its saved-camera queries lie outside this census. Zero correction influence here does not invalidate that improvement. Final substrate RGB, soil mip/filtering, GPU precision/derivatives, depth visibility and visual acceptance remain unresolved. No product correction, GPU run, merge, deployment or publication is authorized by this classification. Chamber publication synchronization remains unverified; the authorized GitHub continuation retains the checkpoint.
