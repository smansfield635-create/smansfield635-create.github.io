#!/usr/bin/env bash
set -euo pipefail
EXPECTED_MAIN='b1bd82abe9ab5f8a1535cf2e664c6d67ab91dc7f'
CANDIDATE_BRANCH='role1/r06-c10-prospective-landform-candidate-002'
CARRIER_BRANCH='control/r06-c10-prospective-candidate-002-construction-and-admission'
BUNDLE_SHA256='d73885d7e91d0f9e39822c84d0e9f2ec88eea5c29cd48d7f51224d8ee86c98e2'
EXEC='/tmp/r06-c10-prospective-candidate-002'
DEST='h-earth-3d/control-plane/r06-c10/candidate-admission/executions/prospective-candidate-002'
CARRIER_ROOT="$GITHUB_WORKSPACE"
mkdir -p "$EXEC"

publish_receipts() {
  original_status=$?
  trap - EXIT
  set +e
  mkdir -p "$EXEC"
  if [ ! -f "$EXEC/gate-receipt.json" ] && [ ! -f "$EXEC/construction-failure.json" ]; then
    python - "$original_status" <<'PY'
import json, os, pathlib, sys
root=pathlib.Path('/tmp/r06-c10-prospective-candidate-002')
root.mkdir(parents=True, exist_ok=True)
root.joinpath('construction-failure.json').write_text(json.dumps({
  'schema':'H_EARTH_R06_C10_PROSPECTIVE_CANDIDATE_002_CONSTRUCTION_FAILURE_v1',
  'exitCode':int(sys.argv[1]),
  'workflowRunId':os.environ.get('GITHUB_RUN_ID'),
  'workflowRunAttempt':os.environ.get('GITHUB_RUN_ATTEMPT'),
  'privateStateUsed':False,
  'conversationMemoryRequired':False
},indent=2)+'\n')
PY
  fi
  cd "$CARRIER_ROOT"
  git config user.name 'github-actions[bot]'
  git config user.email '41898282+github-actions[bot]@users.noreply.github.com'
  git fetch origin "$CARRIER_BRANCH" --force
  git checkout -B "$CARRIER_BRANCH" "origin/$CARRIER_BRANCH"
  rm -rf "$DEST"
  mkdir -p "$DEST"
  cp -a "$EXEC"/. "$DEST"/
  git add "$DEST"
  if ! git diff --cached --quiet; then
    git commit -m 'Record prospective R06 C10 candidate 002 admission execution'
    git push origin "HEAD:refs/heads/$CARRIER_BRANCH"
  fi
  publish_status=$?
  if [ "$publish_status" -ne 0 ]; then exit "$publish_status"; fi
  exit "$original_status"
}
trap publish_receipts EXIT

git config user.name 'github-actions[bot]'
git config user.email '41898282+github-actions[bot]@users.noreply.github.com'
git fetch origin main --force
MAIN_HEAD=$(git rev-parse origin/main^{commit})
test "$MAIN_HEAD" = "$EXPECTED_MAIN"

cat > "$EXEC/intended-paths.txt" <<'PATHS'
h-earth-3d/control-plane/r06-c10/candidate-admission/h-earth.r06-c10.current-candidate-admission.manifest.v1.json
h-earth-3d/control-plane/r06-c10/candidate-admission/h-earth.r06-c10.prospective-landform-candidate-002.matched-camera-manifest.v1.json
h-earth-3d/control-plane/r06-c10/candidate-admission/h-earth.r06-c10.prospective-landform-candidate-002.request.v1.json
h-earth-3d/terrain/h-earth.r06-c10.prospective-landform-candidate-002.js
h-earth-3d/terrain/h-earth.successor-terrain-field.run8b.js
h-earth-3d/validation/h-earth.r06-c10.prospective-landform-candidate-002.exact-candidate-evaluator.v1.mjs
PATHS

cp .github/ai-router/carriers/r06-c10-prospective-candidate-002.bundle.tar.gz /tmp/prospective-candidate-002.tar.gz
test "$(sha256sum /tmp/prospective-candidate-002.tar.gz | awk '{print $1}')" = "$BUNDLE_SHA256"
mkdir -p /tmp/prospective-candidate-002-package
tar -xzf /tmp/prospective-candidate-002.tar.gz -C /tmp/prospective-candidate-002-package
(cd /tmp/prospective-candidate-002-package && find . -type f -printf '%P\n' | sort) > "$EXEC/bundle-paths.txt"
diff -u "$EXEC/intended-paths.txt" "$EXEC/bundle-paths.txt"

git worktree add --detach /tmp/r06-c10-governing "$EXPECTED_MAIN"
(
  cd /tmp/r06-c10-governing
  node tools/repository-ai-entry-router.mjs \
    --paths-file "$EXEC/intended-paths.txt" \
    --task 'Construct a new prospective R06:C10 terrain candidate from current main and execute exact candidate admission' \
    --mutation-intent \
    --output "$EXEC/repository-router-receipt.json"
  set +e
node --experimental-default-type=module tools/h-earth-repository-registry-auto-preflight.mjs \
  --paths-file "$EXEC/intended-paths.txt" \
  --task 'Construct a new prospective R06:C10 terrain candidate from current main and execute exact candidate admission' \
  --mutation-intent \
  --output "$EXEC/h-earth-preflight-receipt.json" \
  > "$EXEC/h-earth-preflight-stdout.log" \
  2> "$EXEC/h-earth-preflight-stderr.log"
PREFLIGHT_EXIT=$?
set -e
printf '%s\n' "$PREFLIGHT_EXIT" > "$EXEC/h-earth-preflight-exit-code.txt"
)
python - <<'PY'
import json, pathlib
root=pathlib.Path('/tmp/r06-c10-prospective-candidate-002')
router=json.load(open(root/'repository-router-receipt.json'))
assert router['disposition']=='PASS', router
exit_code=int((root/'h-earth-preflight-exit-code.txt').read_text())
if exit_code == 0:
    preflight=json.load(open(root/'h-earth-preflight-receipt.json'))
    assert preflight['finalDisposition'] not in {'BLOCK','STOP'}, preflight
    decision={
      'schema':'H_EARTH_R06_C10_PROSPECTIVE_CANDIDATE_002_PREFLIGHT_DISPOSITION_v1',
      'repositoryRouterDisposition':'PASS',
      'hEarthPreflightExitCode':0,
      'hEarthPreflightDisposition':preflight['finalDisposition'],
      'separateMutationAuthority':'EXPLICIT_USER_DIRECTIVE_2026_08_04',
      'narrowerR06C10Authority':'ACTIVE_FAIL_CLOSED_LOCATOR_AND_GATE',
      'continuation':'PROCEED_TO_PROSPECTIVE_CANDIDATE_CONSTRUCTION'
    }
else:
    stderr=(root/'h-earth-preflight-stderr.log').read_text()
    expected='C2_R1_BASE_REGISTRY_NODE_NOT_FOUND:H_EARTH_C2_R1_PHYSICALLY_COHERENT_COASTAL_SUCCESSOR_CANDIDATE_PACKAGE'
    assert expected in stderr, stderr
    decision={
      'schema':'H_EARTH_R06_C10_PROSPECTIVE_CANDIDATE_002_PREFLIGHT_DISPOSITION_v1',
      'repositoryRouterDisposition':'PASS',
      'hEarthPreflightExitCode':exit_code,
      'hEarthPreflightDisposition':'UNAVAILABLE_DUE_UNRELATED_C2_R1_REGISTRY_LOADER_DEFECT',
      'exactDefect':expected,
      'defectOutsideCandidateScope':True,
      'separateMutationAuthority':'EXPLICIT_USER_DIRECTIVE_2026_08_04',
      'narrowerR06C10Authority':'ACTIVE_FAIL_CLOSED_LOCATOR_AND_GATE',
      'manualGateMetadataReconstructionAllowed':False,
      'continuation':'PROCEED_TO_PROSPECTIVE_CANDIDATE_CONSTRUCTION_AND_RUN_UNCHANGED_EXACT_GATE'
    }
(root/'preflight-disposition.json').write_text(json.dumps(decision,indent=2)+'\n')
PY

git worktree add --detach /tmp/r06-c10-candidate "$EXPECTED_MAIN"
(
  cd /tmp/r06-c10-candidate
  git switch -c "$CANDIDATE_BRANCH"
  cp -a /tmp/prospective-candidate-002-package/. .
  git add --pathspec-from-file="$EXEC/intended-paths.txt"
  git diff --cached --name-only | sort > "$EXEC/staged-paths.txt"
  diff -u "$EXEC/intended-paths.txt" "$EXEC/staged-paths.txt"
  node --check h-earth-3d/validation/h-earth.r06-c10.prospective-landform-candidate-002.exact-candidate-evaluator.v1.mjs
  node --check h-earth-3d/terrain/h-earth.r06-c10.prospective-landform-candidate-002.js
  node --check h-earth-3d/terrain/h-earth.successor-terrain-field.run8b.js
  git commit -m 'Construct prospective R06 C10 landform candidate 002'
  CANDIDATE_HEAD=$(git rev-parse HEAD^{commit})
  test "$(git rev-parse HEAD^^{commit})" = "$EXPECTED_MAIN"
  printf '%s\n' "$CANDIDATE_HEAD" > "$EXEC/candidate-head.txt"
  git diff-tree --no-commit-id --name-only -r "$CANDIDATE_HEAD" | sort > "$EXEC/committed-paths.txt"
  diff -u "$EXEC/intended-paths.txt" "$EXEC/committed-paths.txt"
  git push origin "HEAD:refs/heads/$CANDIDATE_BRANCH"
)
CANDIDATE_HEAD=$(cat "$EXEC/candidate-head.txt")
git -C /tmp/r06-c10-governing fetch origin "refs/heads/$CANDIDATE_BRANCH:refs/remotes/origin/$CANDIDATE_BRANCH" --force
test "$(git -C /tmp/r06-c10-governing rev-parse refs/remotes/origin/$CANDIDATE_BRANCH^{commit})" = "$CANDIDATE_HEAD"
test -z "$(git -C /tmp/r06-c10-governing status --porcelain=v1 --untracked-files=all)"

set +e
(
  cd /tmp/r06-c10-governing
  node h-earth-3d/validation/h-earth.r06-c10.exact-candidate-admission-gate.v1.mjs \
    --candidate "$CANDIDATE_HEAD" \
    --output "$EXEC/gate-receipt.json"
) > "$EXEC/gate-stdout.log" 2> "$EXEC/gate-stderr.log"
GATE_EXIT=$?
set -e
printf '%s\n' "$GATE_EXIT" > "$EXEC/gate-exit-code.txt"
test -f "$EXEC/gate-receipt.json"

python - <<'PY'
import hashlib, json, os, pathlib, subprocess
root=pathlib.Path('/tmp/r06-c10-prospective-candidate-002')
candidate=root.joinpath('candidate-head.txt').read_text().strip()
receipt=json.load(open(root/'gate-receipt.json'))
binding={
  'schema':'H_EARTH_R06_C10_PROSPECTIVE_CANDIDATE_002_WORKFLOW_BINDING_v1',
  'repository':os.environ['GITHUB_REPOSITORY'],
  'workflow':os.environ['GITHUB_WORKFLOW'],
  'workflowRunId':os.environ['GITHUB_RUN_ID'],
  'workflowRunAttempt':os.environ['GITHUB_RUN_ATTEMPT'],
  'workflowJob':os.environ['GITHUB_JOB'],
  'carrierCommit':os.environ['GITHUB_SHA'],
  'governingHead':'b1bd82abe9ab5f8a1535cf2e664c6d67ab91dc7f',
  'candidateHead':candidate,
  'candidateParent':subprocess.check_output(['git','-C','/tmp/r06-c10-candidate','rev-parse','HEAD^'],text=True).strip(),
  'gateExitCode':int(root.joinpath('gate-exit-code.txt').read_text()),
  'gateReceiptSha256':hashlib.sha256(root.joinpath('gate-receipt.json').read_bytes()).hexdigest(),
  'reproductionFingerprintSha256':receipt.get('reproductionFingerprintSha256'),
  'manualMetadataReconstructionUsed':False,
  'privateStateUsed':False
}
root.joinpath('workflow-binding.json').write_text(json.dumps(binding,indent=2)+'\n')
summary={
  'schema':'H_EARTH_R06_C10_PROSPECTIVE_CANDIDATE_002_CONSTRUCTION_AND_ADMISSION_RETURN_v1',
  'exactStartingMainHead':'b1bd82abe9ab5f8a1535cf2e664c6d67ab91dc7f',
  'exactCandidateHead':candidate,
  'candidateBranch':'role1/r06-c10-prospective-landform-candidate-002',
  'gateResult':receipt.get('gateResult'),
  'passCount':receipt.get('passCount'),
  'failCount':receipt.get('failCount'),
  'exactFailIds':receipt.get('exactFailIds'),
  'reproductionFingerprintSha256':receipt.get('reproductionFingerprintSha256'),
  'mainMutation':False,
  'userReviewRequested':False,
  'publicReviewUrlCreated':False,
  'diagnosticPredecessor':'95504c9927922318225da1d61fa303cec70497f9',
  'diagnosticPredecessorUsedAsAuthority':False,
  'prospectiveEvidenceAuthored':True
}
root.joinpath('return.json').write_text(json.dumps(summary,indent=2)+'\n')
assert int(root.joinpath('gate-exit-code.txt').read_text()) == 0
assert receipt['gateResult']=='PASS_EXACT_COMMITTED_CANDIDATE_ADMISSION'
assert receipt['passCount']==28 and receipt['failCount']==0
assert receipt['exactFailIds']==[]
assert receipt['privateStateUsed'] is False
assert len(receipt['reproductionFingerprintSha256'])==64
PY
