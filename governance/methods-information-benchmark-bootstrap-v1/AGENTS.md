# Methods information benchmark pre-role bootstrap

This directory is a nonproduct role-genesis instrument.

Rules:

1. No permanent role authority exists merely because a role contract is present.
2. The Bootstrap Builder may construct inactive outputs but may not verify, activate, ratify, or assign them.
3. The Bootstrap Verifier must regenerate from the committed origin seed and registries. It may not import Builder output or repair any discrepancy.
4. Activation is mechanical and fail-closed. Production activation requires an explicit user-acceptance receipt bound to the verified fingerprint.
5. Role-holder admission requires compare-and-swap against the current assignment-ledger head.
6. Methods pages, renderers, native candidates, benchmark semantics, deployment, release, and merge are outside this package's authority.
7. All generated fingerprints use UTF-8, canonical JSON, sorted object keys, declared array order, normalized relative paths, and no timestamps, process IDs, host names, ports, temporary paths, or artifact IDs.
