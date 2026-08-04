#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

const ROOT = 'control-plane/methods-information-benchmark/role6-developmental-baseline-successor';
const args = Object.fromEntries(process.argv.slice(2).reduce((a,v,i,all)=>{
  if (v.startsWith('--')) a.push([v.slice(2), all[i+1]]);
  return a;
}, []));
const expectedHead = args['expected-head'];
const holder = args.holder;
const outputDir = args['output-dir'];
if (!expectedHead || !holder || !outputDir) throw new Error('missing required arguments');
fs.mkdirSync(outputDir, { recursive: true });

const read = p => fs.readFileSync(p);
const readJson = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const sha256 = b => crypto.createHash('sha256').update(b).digest('hex');
const gitText = (...a) => execFileSync('git', a, { encoding: 'utf8' }).trim();
const gitBytes = (...a) => execFileSync('git', a);
const canonical = v => {
  if (Array.isArray(v)) return `[${v.map(canonical).join(',')}]`;
  if (v && typeof v === 'object') return `{${Object.keys(v).sort().map(k => `${JSON.stringify(k)}:${canonical(v[k])}`).join(',')}}`;
  return JSON.stringify(v);
};
const assert = (condition, message) => { if (!condition) throw new Error(message); };

const packetPath = `${ROOT}/methods-role6-developmental-baseline-successor.packet.v1.json`;
const baselineManifestPath = `${ROOT}/developmental-baseline-manifest.v1.json`;
const dependencyManifestPath = `${ROOT}/dependency-manifest.v1.json`;
const changedManifestPath = `${ROOT}/changed-path-manifest.v1.json`;
const answerSetPath = `${ROOT}/user-origin-developmental-answer-set.v1.md`;
const acceptancePath = `${ROOT}/instrument-chamber-acceptance.v1.json`;

const packet = readJson(packetPath);
const baseline = readJson(baselineManifestPath);
const dependency = readJson(dependencyManifestPath);
const changed = readJson(changedManifestPath);

const executedHead = gitText('rev-parse', 'HEAD^{commit}');
assert(executedHead === expectedHead, 'exact successor head mismatch');
execFileSync('git', ['merge-base', '--is-ancestor', changed.baseHead, executedHead]);
assert(gitText('status', '--porcelain') === '', 'worktree not clean');

const actualChanged = gitText('diff', '--name-only', `${changed.baseHead}...${executedHead}`)
  .split('\n').filter(Boolean).sort();
const expectedChanged = [...changed.expectedChangedPaths].sort();
assert(JSON.stringify(actualChanged) === JSON.stringify(expectedChanged), 'changed path set mismatch');

const packetHashInput = structuredClone(packet);
packetHashInput.packetSha256 = null;
const packetCanonicalSha256 = sha256(Buffer.from(canonical(packetHashInput), 'utf8'));
assert(packetCanonicalSha256 === packet.packetSha256, 'packet canonical hash mismatch');
assert(sha256(read(packetPath)) === dependency.packetFileSha256, 'packet file hash mismatch');
assert(sha256(read(answerSetPath)) === dependency.userAnswerSetSha256, 'answer-set hash mismatch');
assert(sha256(read(acceptancePath)) === dependency.instrumentChamberAcceptanceSha256, 'acceptance hash mismatch');
assert(sha256(read(baselineManifestPath)) === dependency.developmentalBaselineManifestSha256, 'baseline manifest hash mismatch');
assert(sha256(read(changedManifestPath)) === dependency.changedPathManifestSha256, 'changed manifest hash mismatch');

const objectIdentity = (head, filePath) => {
  execFileSync('git', ['cat-file', '-e', `${head}^{commit}`]);
  const blob = gitText('rev-parse', `${head}:${filePath}`);
  const bytes = gitBytes('show', `${head}:${filePath}`);
  return { head, path: filePath, gitBlob: blob, sha256: sha256(bytes), size: bytes.length };
};
const baselinePathMap = baseline.primaryOperationalBaseline.paths.map(p =>
  objectIdentity(baseline.primaryOperationalBaseline.exactCandidateHead, p));
const baselinePathMapFingerprint = sha256(Buffer.from(canonical(baselinePathMap), 'utf8'));
const corpusIdentity = objectIdentity(baseline.canonicalCorpus.head, baseline.canonicalCorpus.path);
const reviewCarrierIdentity = objectIdentity(
  baseline.reviewDeliveryCarrier.mergedCarrierCommit,
  baseline.reviewDeliveryCarrier.path
);

for (const entry of baseline.developmentalLineage) {
  execFileSync('git', ['cat-file', '-e', `${entry.head}^{commit}`]);
}
const lineageFingerprint = sha256(Buffer.from(canonical(baseline.developmentalLineage), 'utf8'));

const candidateBytes = baseline.primaryOperationalBaseline.paths
  .map(p => gitBytes('show', `${baseline.primaryOperationalBaseline.exactCandidateHead}:${p}`))
  .reduce((a,b)=>Buffer.concat([a,b]), Buffer.alloc(0));
const candidateText = candidateBytes.toString('utf8');
const repositorySupportedMechanismSignatures = {
  perspectiveTokenPresent: /\bperspective\b/i.test(candidateText),
  preserve3dTokenPresent: /preserve-3d/i.test(candidateText),
  cameraTokenPresent: /\bcamera\b/i.test(candidateText),
  spatialSceneRootPresent: /spatial-scene-root/i.test(candidateText),
  pointerOrTouchMechanismPresent: /(pointer(move|down|up)|touch(move|start|end))/i.test(candidateText),
  explicitReturnMechanismPresent: /(return-to-corpus|return to corpus|exact.?return)/i.test(candidateText),
  canonicalCorpusFetchPresent: /laws\/research\/methods-and-models\/showroom\.js/i.test(candidateText),
  webglOrCanvasTokenPresent: /(webgl|getContext\s*\(|<canvas)/i.test(candidateText),
  interpretationBoundary: 'TOKEN_PRESENCE_ONLY_NOT_PROOF_OF_SUCCESS_FAILURE_OR_CAUSE'
};
const mechanismFingerprint = sha256(Buffer.from(canonical(repositorySupportedMechanismSignatures), 'utf8'));

async function githubJson(apiPath) {
  const token = process.env.GH_TOKEN;
  const repo = process.env.REPOSITORY;
  assert(token && repo, 'missing GitHub API environment');
  const response = await fetch(`https://api.github.com/repos/${repo}${apiPath}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'methods-role6-developmental-baseline-successor'
    }
  });
  assert(response.ok, `GitHub API ${apiPath} failed: ${response.status}`);
  return response.json();
}
const pr544 = await githubJson('/pulls/544');
const pr547 = await githubJson('/pulls/547');
const pr555 = await githubJson('/pulls/555');
const artifact = await githubJson(`/actions/artifacts/${baseline.empiricalWorkflowEvidence.artifactId}`);
assert(pr544.head.sha === baseline.primaryOperationalBaseline.exactCandidateHead && pr544.merged === true, 'PR 544 identity mismatch');
assert(pr547.head.sha === baseline.reviewDeliveryCarrier.sourceBranchHead && pr547.merged === true, 'PR 547 identity mismatch');
assert(pr555.head.sha === changed.baseHead && pr555.merged === false, 'PR 555 identity mismatch');
assert(artifact.digest === baseline.empiricalWorkflowEvidence.artifactDigest, 'empirical artifact digest mismatch');
assert(artifact.workflow_run.head_sha === baseline.empiricalWorkflowEvidence.artifactHead, 'empirical artifact head mismatch');
assert(artifact.expired === false, 'empirical artifact expired');

const externalEvidence = {
  pr544: { head: pr544.head.sha, merged: pr544.merged },
  pr547: { head: pr547.head.sha, merged: pr547.merged },
  pr555: { head: pr555.head.sha, merged: pr555.merged, draft: pr555.draft },
  artifact: {
    id: artifact.id, name: artifact.name, digest: artifact.digest,
    head: artifact.workflow_run.head_sha, expired: artifact.expired
  }
};
const externalEvidenceFingerprint = sha256(Buffer.from(canonical(externalEvidence), 'utf8'));
const dependencyClosure = {
  packetCanonicalSha256,
  packetFileSha256: dependency.packetFileSha256,
  answerSetSha256: dependency.userAnswerSetSha256,
  acceptanceSha256: dependency.instrumentChamberAcceptanceSha256,
  baselineManifestSha256: dependency.developmentalBaselineManifestSha256,
  changedPathManifestSha256: dependency.changedPathManifestSha256,
  baselinePathMapFingerprint,
  corpusIdentity,
  reviewCarrierIdentity,
  lineageFingerprint,
  mechanismFingerprint,
  externalEvidenceFingerprint
};
const dependencyClosureFingerprint = sha256(Buffer.from(canonical(dependencyClosure), 'utf8'));

const receipt = {
  schema: 'METHODS_ROLE6_DEVELOPMENTAL_BASELINE_SUCCESSOR_BUILDER_RECEIPT_v1',
  pass: true,
  executedHead,
  holder,
  predecessorPacketCarrierHead: changed.baseHead,
  packetCanonicalSha256,
  packetFileSha256: dependency.packetFileSha256,
  answerSetSha256: dependency.userAnswerSetSha256,
  acceptanceSha256: dependency.instrumentChamberAcceptanceSha256,
  baselineManifestSha256: dependency.developmentalBaselineManifestSha256,
  exactChangedPaths: actualChanged,
  baselinePathMap,
  baselinePathMapFingerprint,
  corpusIdentity,
  reviewCarrierIdentity,
  lineageFingerprint,
  repositorySupportedMechanismSignatures,
  mechanismFingerprint,
  externalEvidence,
  externalEvidenceFingerprint,
  dependencyClosure,
  dependencyClosureFingerprint,
  requiredSubstantiveOutputCount: packet.requiredSubstantiveOutputs.length,
  requiredReturnArtifactCount: packet.requiredReturnArtifacts.length,
  roleAuthorityAcquired: false,
  assignmentPerformed: false,
  assignmentAuthorizationIssued: false,
  substantiveOperationExecuted: false,
  publicMethodsMutation: false,
  publicLawsMutation: false,
  repairPerformed: false,
  privateStateDependency: false,
  mergePerformed: false,
  nextAuthorizedStage: 'SEPARATE_USER_ATOMIC_ASSIGNMENT_AUTHORIZATION'
};
fs.writeFileSync(path.join(outputDir, 'successor-builder-receipt.json'), JSON.stringify(receipt, null, 2) + '\n');
fs.writeFileSync(path.join(outputDir, 'baseline-path-blob-sha256-map.json'), JSON.stringify(baselinePathMap, null, 2) + '\n');
fs.writeFileSync(path.join(outputDir, 'repository-supported-mechanism-signatures.json'), JSON.stringify(repositorySupportedMechanismSignatures, null, 2) + '\n');
fs.writeFileSync(path.join(outputDir, 'external-evidence.json'), JSON.stringify(externalEvidence, null, 2) + '\n');
console.log(JSON.stringify({ pass: true, executedHead, baselinePathMapFingerprint, dependencyClosureFingerprint }, null, 2));
