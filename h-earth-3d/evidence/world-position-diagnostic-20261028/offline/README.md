# Offline conservative blend design

Status: algebra screened; scene evaluator incomplete. This is not a product patch or visual repair.

The complete composition is Q=(1-wG)*((1-wI)*P+wI*TI)+wG*TG. Define D=Q-P, L=D(c,f0), R=D(c,f)-L, and Q'=P+H(L)+R. The reference f0 is not a measured mean. A qualified split must recompute incoming P, both targets, both weights and their fine interactions; preserving P grain alone is insufficient.

The executable specimen transports L by symmetric area-mass flux, using one RGB edge limiter to keep final Q within gamut without clamping. Equal/opposite accepted flux conserves full RGB area mean, even when R has nonzero mean. Protected nodes and R remain unchanged. A zero-flux orientation bug found by independent review was fixed before qualification. 100 randomized cases and 250 independent boundary cases pass. These inputs are synthetic, not H-Earth scene samples.

Ideal pixel-ray refinement was rejected: float32 uploaded matrices still give 273/1107 near and462/1377 far empty intersections with measured scalar boxes. No tolerance tuning or invalid-point removal was used. Capture calibration remains valid; ideal geometric interpretation is not established.

The next action is exact CPU scene extraction/evaluation: reproduce immutable package4f1b7ff2 buffers and rendered mesh topology, reconcile archived material values, explicitly define/recompute the full coarse/detail source split, and then test fixed witnesses using real mesh-area/protection bounds. Do not launch another GPU run on the strength of algebraic tests. No new runtime source, GPU capture, merge or publication occurred. Chamber synchronization remains unverified.

Reproduction: Python/NumPy/Pillow. The preserved scripts use their original /tmp capture paths: extract run-40790969812-raw.zip to /tmp/diagnostic; transport specimen lives at /tmp/world-offline/conservative-blend.py for review-transport.py. Run conservative-blend.py and review-transport.py; ray-screen.py reproduces the failed ideal-ray screen. Input source is approved cb57c275b95d0d48883bc4da4dcfcf17cbec5060, with renderer fa6acc426c75c3b2292b3ed76a756157698d8e7a5562511ad7ced5af58e25dec.
