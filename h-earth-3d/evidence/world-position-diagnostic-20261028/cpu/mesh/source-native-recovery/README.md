# H-Earth: source-native binary recovery precedent and original indexed-mesh gate

**Status: READY-TO-EXECUTE SOURCE PROCEDURE; NOT YET EXECUTED ON THE ACTUAL 11,736,235-BYTE ASSET OR FULL 2D MESH.** No shader, foliage, geometry, Pages, or GPU changes.

## The recovered precedent

The original compressed world is **not a lost Work-session artifact**. It is an immutable Git blob in the public H-Earth repository. Its Git object identity is `3d11947ad94f98736035cbdf0e021e5f324659fb`; its 11,736,235 original bytes must hash to `48f754ca1b11b8fe7eeb0e8d4573f6b6cb544cf438322a115eb52c44d3b29d5a`. The frozen `cb57c275b95d0d48883bc4da4dcfcf17cbec5060` source tree contains it, and an original Gen2666 commit `5ac87e31a543473040a18b6ea00b62b6f0690553` recorded the same object. Both identities were read through connected GitHub.

**First source:** execute `git show cb57c275:showroom/globe/h-earth/render/assets/h-earth-canonical-base-world.v1.json.gz` inside a GitHub-hosted checkout, then independently check full byte length and SHA-256. `git show` is binary-preserving; no ChatGPT text connector has to serialize the 11.7 MB. `git archive` from the same commit can materialize the 716 frozen source files already enumerated in `cpu/mesh/source-paths.txt`.

**Fallback only if the original object cannot be rehydrated:** use `h-earth-3d/validation/h-earth.canonical-base-world-precompute.v1.mjs --build` from the **original Gen2666 commit** `5ac87e31`, not from `cb57c275` or current `main`. Eight source Git blob identities at Gen2666 match that version of its `SOURCE_BLOBS` contract. Several source files later changed, so rebuilding with the current source would be invalid. The script explicitly excludes the missing gzip from the historical source archive; it then checks that newly generated gzip against the exact original 11,736,235-byte length and SHA-256. Node22 is required; the original archived parity receipt used Node 22.23.3. Successful fallback is not presumed until the hash check passes.

Existing precedent: the fixed H-Earth GitHub Actions runner already checked out exact commits and checked `sha256sum` of this binary, and the original Node generator was qualified for raw/canonical source parity. Also, GitHub Actions ZIP artifacts have been downloaded through the connected GitHub artifact interface in this project, bypassing the text-only 1-MB source-content limitation. A new general-purpose execution transport is **not** needed.

## How to run (on an authorized GitHub-hosted checkout)

Check out an immutable diagnostic candidate that contains this script plus the existing committed `cpu/mesh/` reconstruction sources. Node 22 and Python3 with NumPy, SciPy, Shapely 2+, and Pillow are required. `git` must be able to fetch the source commits from `origin`; no browser/GPU credentials are needed.

```
bash h-earth-3d/evidence/world-position-diagnostic-20261028/cpu/mesh/source-native-recovery/recover-original-mesh.sh --asset /tmp/h-earth-verified-asset
bash h-earth-3d/evidence/world-position-diagnostic-20261028/cpu/mesh/source-native-recovery/recover-original-mesh.sh --mesh /tmp/h-earth-mesh-replay
```

`--asset` verifies the exact source bytes, `--mesh` additionally reconstructs the original immutable package from those bytes, independently replays original modules and upload normal/coast operations, checks position and index SHA-256, and then runs the corrected v3 2D closure gate with the archived 2,484 sample witnesses and all 2,575 candidate memberships. It does not assume that the gate will pass: a real near/far seam or support failure is evidence to retain, not a reason to tune thresholds. Each execution requires a **new output directory** and refuses to overwrite existing output.

`--regen-proof /tmp/h-earth-gen2666-proof` executes only the original source constructor, is explicitly separate from importing a mismatched Gen2824 candidate, and must return exactly the original asset hash or fail closed.

## Existing fixed runner reuse (proposed, not activated)

Following Gen2944 precedent, extend only the existing registered `.github/workflows/h-earth-neutral-exact-head-runner.yml` *through applicable canonical admission and independent review*, with one new fixed `route_query=qualification=h-earth-original-indexed-mesh-v1` profile. The selected job must pin exact diagnostic candidate/tooling SHA, use immutable checkout/fetch of the two source commits, execute `recover-original-mesh.sh --mesh` in clean runner temp, upload `world.gz`, original uploaded position/index binary receipts, reconstruction reports, and `mesh-gate.json` using the existing `actions/upload-artifact` mechanism **even when an exact mesh assertion fails**. No general agent workflow, arbitrary `run` input, new Codespace, renderer modification, extra GPU capture or publication. Return the Actions run link, then stop until completion; analyze its existing artifact with the connected GitHub download tool.

The already closed Gen2964 eight-frame diagnostic admission does **not** authorize an additional launch. The exact current active canonical intake/continuation disposition must be checked before registering the bounded read-only qualification. The proposed fixed qualification uses the same existing runner, not a new workflow class.

## Current verified boundary

Local execution environment has no GitHub DNS or complete source checkout. Its GitHub connector returns metadata but no binary contents for the large `.gz` blob; the Gen2824 recovery ZIP is a **different** binary (`e4ff829a51...`, 11,736,511 bytes), and historical thin Git bundles lack prerequisite objects. None should replace the source package. Only the 5 fail-closed/bootstrap syntax tests run locally. The source/method contract is ready; the real indexed mesh is *not yet reconstructed here*, and original H-Earth visual defects remain open.