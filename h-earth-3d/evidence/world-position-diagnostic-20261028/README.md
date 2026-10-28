# H-Earth world-position diagnostic — generation 2964

This diagnostic captures four encoded quantities at each frozen inland near/far pose: X, Y, Z and signed coast distance. The observed scene is the approved baseline cb57c275b95d0d48883bc4da4dcfcf17cbec5060; tooling history retains prior rejected candidates without presenting those product bytes.

The source-bound overlay is served by interception only. It preserves geometry, original clipping/discards and assets, encodes opaque RGB, and marks nonterrain invalid. Calibration traverses the same RGBA8 framebuffer and presentation path as terrain. The captured actual camera packet must match the expected frozen matrix. Invalid calibration, alpha, out-of-range terrain, mask drift, or asset drift fails the capture.

Recovery verified the existing successor admission, not a new admission. The original timeout was followed by commit048eb40fdd7a651c6bec7b01fb0d9ae97d7d0242. See admission-receipt.json for unchanged canonical verifier outputs and the recorded live-evidence replay method.

One explicit launch, eight saved diagnostic frames, no automatic retry. Existing bounded asset settling renders remain; one measured submission per mode is retained. No performance claim, material correction, visual acceptance, merge or publication is authorized by these measurements.

Native Mesa compilation qualifies the changed shaders. The unchanged global-cover vertex shader has the same reserved-identifier failure under native Mesa before/after; actual browser runtime is the selected GPU qualification. See glsl-compile-receipt.json.

On launch return the run URL and stop without polling. After owner reports completion, retrieve raw captures, verify hashes/calibration/source/poses, then analyze measured coordinates against the preserved material evidence.
