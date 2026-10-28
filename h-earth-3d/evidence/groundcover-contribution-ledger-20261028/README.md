# Groundcover contribution ledger — generation2957

Status: capture recovered and contribution analysis independently verified. No new product shader candidate.

Gen2956 rejected the resident-field substitution. Its exact source and captured evidence remain at1e39f93a07eb2cc5156483b899094937ba2149db. The next gap is quantitative separation of incoming soil P, groundcover target T and weight w at the same observed bands.

Capture only eight frames: two existing inland poses times four existing diagnostic modes (before, target, raw weight, after). Tooling is pinned to the exact PR head; one scene checkout is pinned to1e39f93a. No baseline or healthy-control rerender. Renderer SHA256 must remain b4bda2b8953b5bcc3cd65e101a447a878c2d033ec683af53a93ff211c13cdf70.

analysis-plan.json predeclares the image-space transects, linear color treatment, signed decomposition, reconstruction residual and quantization limitations before seeing the new output. The previous packet's Gen2928 baseline reference is historical comparison custody; this diagnostic executes only the exact frozen resident scene, not that baseline.

## Recovered after room interruption

The existing successful run [40739898768](https://github.com/smansfield635-create/smansfield635-create.github.io/actions/runs/40739898768) produced artifact 12839995220. Its ZIP SHA256 is `6c3ffd91d89e8309e5f486844804935834753670162f68bdd860d7014a4d3a74`. All eight original PNGs and the losslessly compressed receipt are preserved in `run40739898768/`. Image digests, byte sizes, exact scene/tooling identity, frozen poses, frame correspondence, and asset/vegetation signatures passed verification. No new GPU run was needed.

`analyze-capture.py` reconstructs the analysis from the precommitted plan. `recovered-analysis/analysis-rows.json` retains all 3,360 comparisons. All 31,104 sampled pixels are eligible; none fails the reconstruction interval check under the plan's assumed +/-1 combined output-code error. The nominal residual is not zero; agreement is conditional on those conservative bounds, not proof of exact GPU floating-point equality.

Coverage variation exceeds the combined soil and target variation, including conservative uncertainty, in 263 overlapping row comparisons. The six transect counts are near 37/30/45 and far 46/49/56. This establishes localized coverage-driven contrast, not a global prevalence estimate. These are linear RGB L1 magnitudes, not perceptual color distances. Independent review reproduced every count and the complete analysis output.

Two strongest witnesses, selected after analysis within the predeclared transects:

| View and crossing | Coverage lower bound | Soil + target upper bound |
| --- | ---: | ---: |
| Near x264, y269 to285 | 0.155004 | 0.055267 |
| Far x396, y488 to504 | 0.140188 | 0.028673 |

The relevant identity is `deltaC=(1-meanW)*deltaP+meanW*deltaT+deltaW*(meanT-meanP)`. The measured coverage term is `deltaW*(meanT-meanP)`. A visually smooth weight field can still create a conspicuous broad color region. This result alone does not identify every owner's straight/curved cutoff, establish mask behavior beyond these captures, or prove a repair.

## Reproduce without rendering

From the repository root, with Python, numpy, Pillow and Node available:

```sh
python h-earth-3d/evidence/groundcover-contribution-ledger-20261028/analyze-capture.py --capture h-earth-3d/evidence/groundcover-contribution-ledger-20261028/run40739898768 --output /tmp/hearth-contribution-analysis
python h-earth-3d/evidence/groundcover-contribution-ledger-20261028/test-analysis.py
node --test tools/h-earth-ground-material-comparison.v1.test.mjs
```

The analysis validates the imported capture validator against immutable tooling head `59af7c4ab16743704c6427ad5acd518f1f84434c`. Four arithmetic tests and all 42 current comparator tests pass. The older PR's reported 47-test total is preserved as historical reporting, not repeated as the current result. The initial recovery test attempt lacked sparse-checkout fixtures; restoring the existing fixtures resolved it without changing code.

## Continuation boundary

Generation2957 remains diagnostic-only. Read-only recovery confirmed its existing active admission, and `recovery-continuity.json` records carry-forward across unrelated BUILD changes on main. All new evidence stays inside the admitted evidence directory. No renderer, vegetation, geometry, camera, workflow, main, merge or deployment change was made by this recovery.

The interrupted room's unsaved residual-transfer candidate was not recovered. Do not describe a newly reconstructed proposal as recovered implementation. First preserve and independently read back this evidence commit; then use the existing canonical lifecycle for any separately bounded source-justified repair and fixed-pose comparison. No rerender of these diagnostic intermediates is required. Visual repair and owner acceptance remain unproven.
