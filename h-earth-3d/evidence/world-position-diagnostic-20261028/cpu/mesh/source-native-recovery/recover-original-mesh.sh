#!/usr/bin/env bash
# H-Earth original indexed-mesh recovery; source-only, fail closed, no product mutation.
set -Eeuo pipefail
SOURCE='cb57c275b95d0d48883bc4da4dcfcf17cbec5060'
GEN2666='5ac87e31a543473040a18b6ea00b62b6f0690553'
EXPECTED_ASSET='48f754ca1b11b8fe7eeb0e8d4573f6b6cb544cf438322a115eb52c44d3b29d5a'
EXPECTED_WORLD_ZIP='36bda9bb3fe0d3711fe1ef557c07505c2e93316de4a39f1321b50e8ab4cce4a3'
EXPECTED_POS='342a2a788009410bf48a6b5889a55cad4afd97552ff02b72f98b1308f7f84b83'
EXPECTED_IDX='483f7693f29225e52fa90700837015741e78edb291de9adb785a8db3a74d616c'
ASSET='showroom/globe/h-earth/render/assets/h-earth-canonical-base-world.v1.json.gz'
PREFIX='h-earth-3d/evidence/world-position-diagnostic-20261028'
MODE="${1:---asset}"; OUT="${2:-}"
if [[ "$MODE" != --asset && "$MODE" != --mesh && "$MODE" != --regen-proof ]]; then
  echo 'Usage: recover-original-mesh.sh [--asset|--mesh|--regen-proof] /absolute/empty/output' >&2; exit 64
fi
if [[ -z "$OUT" || "$OUT" != /* || "$OUT" == / || -e "$OUT" ]]; then
  echo 'FAIL_CLOSED: output must be a new absolute path (never overwrite)' >&2; exit 64
fi
for cmd in git sha256sum node python3 tar; do command -v "$cmd" >/dev/null || { echo "MISSING_COMMAND:$cmd" >&2; exit 2; }; done
REPO="$(git rev-parse --show-toplevel)" || { echo 'FAIL_CLOSED: NOT_A_REPOSITORY' >&2; exit 2; }
[[ "$(git -C "$REPO" config --get remote.origin.url)" == *smansfield635-create.github.io* ]] || {
  echo 'FAIL_CLOSED: REPOSITORY_IDENTITY_NOT_PROVEN' >&2; exit 2;
}
mkdir -p "$OUT"
LOG="$OUT/recovery-log.txt"
exec > >(tee -a "$LOG") 2>&1
fail(){ printf 'FAIL_CLOSED:%s\n' "$1"; exit 2; }
require_commit(){
  local c="$1"
  if ! git -C "$REPO" cat-file -e "$c^{commit}" 2>/dev/null; then
    echo "FETCH_EXACT_IMMUTABLE_COMMIT:$c"
    git -C "$REPO" fetch --no-tags --depth=1 origin "$c" || fail "SOURCE_COMMIT_FETCH:$c"
  fi
  git -C "$REPO" cat-file -e "$c^{commit}" || fail "SOURCE_COMMIT_NOT_PRESENT:$c"
}
require_asset(){
  require_commit "$SOURCE"
  echo "EXTRACT_EXACT_GIT_OBJECT:$SOURCE:$ASSET"
  if git -C "$REPO" cat-file -e "$SOURCE:$ASSET" 2>/dev/null &&
     git -C "$REPO" show "$SOURCE:$ASSET" > "$OUT/world.gz"; then
    echo 'SOURCE_GIT_BLOB_MATERIALIZED'
  else
    rm -f "$OUT/world.gz"
    echo 'EXACT_ASSET_GIT_READ_UNAVAILABLE_TRY_ORIGINAL_GEN2666_CONSTRUCTOR'
    regen_proof
    cp "$OUT/gen2666/$ASSET" "$OUT/world.gz" || fail 'GEN2666_ASSET_COPY'
  fi
  [[ "$(stat -c %s "$OUT/world.gz")" == 11736235 ]] || fail 'WORLD_ASSET_LENGTH'
  printf '%s  %s\n' "$EXPECTED_ASSET" "$OUT/world.gz" | sha256sum -c - || fail 'WORLD_ASSET_SHA256'
  echo 'ORIGINAL_WORLD_ASSET_BYTES_VERIFIED'
}
# No historical worktree is overwritten. This is a verified fallback if exact
# asset retrieval becomes unavailable but historical source modules survive.
regen_proof(){
  require_commit "$GEN2666"
  mkdir -p "$OUT/gen2666"
  # Archive SOURCE entries, deliberately excluding the missing binary itself.
  # A directory pathspec would accidentally demand that Git rehydrate that blob.
  mapfile -t genpaths < <(git -C "$REPO" ls-tree -r --name-only "$GEN2666" -- \
    package.json h-earth-3d showroom/globe/h-earth/render | \
    grep -v -Fx "$ASSET")
  [[ "${#genpaths[@]}" -gt 15 ]] || fail 'GEN2666_SOURCE_TREE_INCOMPLETE'
  git -C "$REPO" archive --format=tar "$GEN2666" "${genpaths[@]}" | \
    tar -xf - -C "$OUT/gen2666" || fail 'GEN2666_SOURCE_ARCHIVE'
  [[ "$(node -p 'process.versions.node.split(".")[0]')" == 22 ]] || fail 'GEN2666_REQUIRES_NODE22'
  (cd "$OUT/gen2666" && node h-earth-3d/validation/h-earth.canonical-base-world-precompute.v1.mjs --build) || fail 'GEN2666_RECONSTRUCTION'
  local produced="$OUT/gen2666/$ASSET"
  [[ "$(stat -c %s "$produced")" == 11736235 ]] || fail 'GEN2666_BYTES_DIFFER'
  printf '%s  %s\n' "$EXPECTED_ASSET" "$produced" | sha256sum -c - || fail 'GEN2666_SHA_DIFFER'
  echo 'GEN2666_INDEPENDENT_RECONSTRUCTION_EXACT_SHA_MATCH'
  [[ ! -f "$OUT/world.gz" ]] || cmp -s "$produced" "$OUT/world.gz" || fail 'GEN2666_VS_ORIGINAL_BYTES_DIFFER'
}
if [[ "$MODE" == --regen-proof ]]; then regen_proof; exit 0; fi
require_asset
if [[ "$MODE" == --asset ]]; then echo 'PASS:EXACT_ASSET_RETRIEVED'; exit 0; fi
[[ "$(node -p 'process.versions.node.split(".")[0]')" == 22 ]] || fail 'CPU_REPLAY_REQUIRES_NODE22'
python3 -c 'import numpy,scipy,shapely,PIL; from importlib.metadata import version; assert int(version("shapely").split(".")[0]) >= 2' || fail 'MESH_PYTHON_DEPENDENCY_MISSING_OR_OLD_SHAPELY'
mkdir -p "$OUT/scene" "$OUT/mesh"
SOURCE_PATHS="$REPO/$PREFIX/cpu/mesh/source-paths.txt"
[[ -f "$SOURCE_PATHS" ]] || fail 'SOURCE_PATHS_MISSING'
mapfile -t paths < "$SOURCE_PATHS"
[[ "${#paths[@]}" -eq 716 ]] || fail 'SOURCE_PATH_COUNT'
# The frozen source tree has NO root package.json. Preserve only pinned entries.
paths+=("$ASSET")
echo "ARCHIVE_SOURCE_FILE_COUNT:${#paths[@]}"
git -C "$REPO" archive --format=tar "$SOURCE" "${paths[@]}" | tar -xf - -C "$OUT/scene" || fail 'FROZEN_SOURCE_MATERIALIZATION'
cmp -s "$OUT/world.gz" "$OUT/scene/$ASSET" || fail 'FROZEN_ARCHIVE_ASSET_MISMATCH'
for record in \
  "reconstruct.mjs d098a00ae9402b5f4bc5b91b3cdceab732d0f617" \
  "reconstruct-direct.mjs c527bc22da4bbc9730ffe499854a6694270b6d84" \
  "upload-replay.mjs af971305e366347be8a9e79712636b0c2cada65c" \
  "surface-samples.json c3142fa6eaf0ac305e1e446ce0498c5f3fb4efbf"; do
  read -r file blob <<< "$record"
  [[ "$(git -C "$REPO" hash-object "$REPO/$PREFIX/cpu/mesh/$file")" == "$blob" ]] || fail "SOURCE_EVIDENCE_BLOB_DRIFT:$file"
done
[[ "$(git -C "$REPO" hash-object "$REPO/$PREFIX/cpu/mesh/next-gate/mesh_domain_gate.py")" == 2033596bf75ccd3dbd9664a55460df037e4be2b1 ]] || fail MESH_GATE_V3_DRIFT
for file in reconstruct.mjs reconstruct-direct.mjs upload-replay.mjs surface-samples.json; do
  cp "$REPO/$PREFIX/cpu/mesh/$file" "$OUT/mesh/" || fail "MESH_SOURCE_COPY:$file"
done
cp "$REPO/$PREFIX/cpu/mesh/next-gate/mesh_domain_gate.py" "$OUT/mesh/"
# Original source modules use absolute /tmp paths; GitHub-hosted runner must be clean.
for reserved in /tmp/h-earth-scene-cb57 /tmp/mesh-cpu /tmp/base-world.json.gz /tmp/raw-package.js /tmp/verified-planting-packet.mjs; do
  [[ ! -e "$reserved" ]] || fail "NONEMPTY_RESERVED_LOCAL_SOURCE_PATH:$reserved"
done
ln -s "$OUT/scene" /tmp/h-earth-scene-cb57
ln -s "$OUT/mesh" /tmp/mesh-cpu
ln -s "$OUT/world.gz" /tmp/base-world.json.gz
ln -s "$OUT/scene/showroom/globe/h-earth/render/live-render-package.run8e-r2.js" /tmp/raw-package.js
ln -s "$OUT/scene/showroom/globe/h-earth/render/verified-planting-packet.v1.js" /tmp/verified-planting-packet.mjs
node "$OUT/mesh/reconstruct.mjs" > "$OUT/mesh/reconstruct-stdout.json" || fail 'SOURCE_PACKAGE_RECONSTRUCTION'
node "$OUT/mesh/reconstruct-direct.mjs" > "$OUT/mesh/reconstruct-direct-stdout.json" || fail 'ORIGINAL_MODULE_PARITY'
node "$OUT/mesh/upload-replay.mjs" > "$OUT/mesh/upload-stdout.json" || fail 'ORIGINAL_UPLOAD_REPLAY'
printf '%s  %s\n' "$EXPECTED_POS" "$OUT/mesh/upload-positions.bin" | sha256sum -c - || fail 'ORIGINAL_UPLOAD_POSITION_DIGEST'
printf '%s  %s\n' "$EXPECTED_IDX" "$OUT/mesh/upload-indices.bin" | sha256sum -c - || fail 'ORIGINAL_UPLOAD_INDEX_DIGEST'
# Existing independently reviewed capture associations retained; none dropped.
python3 "$OUT/mesh/mesh_domain_gate.py" --mesh-dir "$OUT/mesh" --report "$OUT/mesh/mesh-gate.json" \
  || fail 'SOURCE_MESH_GATE_FAILED_PRESERVE_REPORT'
echo 'PASS:ORIGINAL_SOURCE_MESH_GATE_QUALIFIED'