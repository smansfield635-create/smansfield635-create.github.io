# Methods Nonproduct Harness Adapter State-Reach Correction v1

This verification-only harness executes `METHODS_NONPRODUCT_HARNESS_ADAPTER_STATE_REACH_CORRECTION_v1` against the exact `METHODS_MODELS_EUCLIDEAN_SHOWROOM_v3` source at candidate head `66a2105e96e84c5b482f783010779f87a90a28ee` and emits evidence compatible with `METHODS_MODELS_COHERENCE_INSTRUMENT@1.0.0`.

It does not modify the public Methods source. The workflow rejects any branch delta outside this runner, this README, and its workflow.

The corrected adapter:

- traverses native state in the required order `family → model → lens`, because native family and model changes reset the lens to Practical;
- refuses to count an observation until native family, model, lens, X/Y/Z datasets, active-state cardinality, and stable transition state all match the requested coordinate;
- records a state-reach receipt for every requested coordinate;
- does not write synthetic coordinate or camera labels into the candidate DOM;
- distinguishes operational focus conditions from native camera-state evidence;
- treats missing or unreached native states according to `INVALID > UNEVALUABLE > FAIL > PASS`;
- maps keyboard, pointer, touch, reduced-motion, JavaScript-disabled, focus, geometry, inspection, restoration, screenshot, source, and custody evidence into registered findings.

The execution surface remains:

- 75 semantic coordinates across nine viewports and two requested camera observations: 1,350 stable-stage attempts;
- 25 model inspection-and-return cycles across nine viewports: 225 attempts;
- deterministic risk screenshots and a required human-review receipt template.

Workflow success means the evidence operation completed. It does not mean the Methods candidate passed. Human visual review remains a required gate, and public Methods mutation, merge, and product acceptance remain unauthorized.
