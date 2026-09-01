#!/usr/bin/env bash
set -euo pipefail

PAGES_STAGE="$1"
TARGET_SHA="$2"
MANIFEST_PATH="$3"
BASELINE_SHA="1d45379f81ea4089e9c5f3d7d9688e702be9add3"
STAGE1_SHA="039e60498ab8d5fc96d16ecdd9fa5f4d9e8220a4"
BASELINE_ROOT="$PAGES_STAGE/inspection/h-earth/24056"
STAGE1_ROOT="$PAGES_STAGE/inspection/h-earth/stage1-cost-decoupling"

rsync -a --prune-empty-dirs --exclude='.git/' --exclude='.github/' --exclude='preview/' --exclude='h-earth-live-6d18e158/' ./ "$PAGES_STAGE/"

rm -rf "$PAGES_STAGE/showroom/globe/h-earth"
mkdir -p "$PAGES_STAGE/showroom/globe/h-earth"
rsync -a --delete h-earth-live-6d18e158/showroom/globe/h-earth/ "$PAGES_STAGE/showroom/globe/h-earth/"

git fetch --no-tags --depth=1 origin "$BASELINE_SHA" "$STAGE1_SHA"
rm -rf "$BASELINE_ROOT" "$STAGE1_ROOT"
mkdir -p "$BASELINE_ROOT" "$STAGE1_ROOT"
git archive "$BASELINE_SHA" showroom/globe/audralia showroom/globe/h-earth h-earth-3d | tar -x -C "$BASELINE_ROOT"
git archive "$STAGE1_SHA" showroom/globe/audralia showroom/globe/h-earth h-earth-3d | tar -x -C "$STAGE1_ROOT"

python3 <<PY
from pathlib import Path
p=Path('$STAGE1_ROOT/showroom/globe/audralia/weather-presentation-reconciliation/index.html')
text=p.read_text()
marker='<script type="module" src="./app.mjs?cb=2c64ff2e477f6dd2"></script>'
assert marker in text
prefix='''<script type="module" src="../fap1-stage1-cost-decoupling-v1.mjs?cb=STAGE1_COST_DECOUPLING_v1"></script>\n  <script type="module" src="../acf1-cloud-presentation-v1.mjs?cb=ACF1_v3"></script>\n  <script type="module" src="../fap1-xyz-volumetric-depth-v1.mjs?cb=FAP1_XYZ_DEPTH_v1"></script>\n  <script type="module" src="../fap1-weather-presentation-v1.mjs?cb=FAP1_CANDIDATE_A_VISUAL_v4"></script>\n  '''
p.write_text(text.replace(marker,prefix+marker,1))
PY

test -f "$BASELINE_ROOT/showroom/globe/audralia/weather-presentation-reconciliation/index.html"
test -f "$STAGE1_ROOT/showroom/globe/audralia/fap1-stage1-cost-decoupling-v1.mjs"
grep -q 'fap1-stage1-cost-decoupling-v1.mjs' "$STAGE1_ROOT/showroom/globe/audralia/weather-presentation-reconciliation/index.html"
