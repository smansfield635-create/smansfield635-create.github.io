import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readFile, stat, mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { executeHEarthCapacityCameraRendererH0Controls } from './h-earth-capacity-camera-renderer-correspondence-authority-lock.mjs';
import { executeHEarthCapacityCameraRendererH1Controls } from './h-earth-capacity-camera-renderer-correspondence-measurement-contract.mjs';
import { executeH2Controls } from './h-earth-capacity-camera-renderer-correspondence-h2-controls.mjs';
import { executeH3Controls } from './h-earth-capacity-camera-renderer-correspondence-h3-controls.mjs';
import { executeH4Controls } from './h-earth-capacity-camera-renderer-correspondence-h4-controls.mjs';
import { executeH5Controls } from './h-earth-capacity-camera-renderer-correspondence-h5-controls.mjs';
import { executeH6Controls } from './h-earth-capacity-camera-renderer-correspondence-h6-controls.mjs';

const here = dirname(fileURLToPath(import.meta.url));
export const H7_CONTRACT = Object.freeze(JSON.parse(await readFile(resolve(here, 'h-earth-capacity-camera-renderer-correspondence-h7-contract.json'), 'utf8')));

const stable = value => Array.isArray(value)
  ? value.map(stable)
  : value && typeof value === 'object'
    ? Object.fromEntries(Object.keys(value).sort().map(key => [key, stable(value[key])]))
    : value;
export const digest = value => createHash('sha256').update(JSON.stringify(stable(value))).digest('hex');
const fail = (code, details = null) => { const error = new Error(code); error.code = code; error.details = details; throw error; };
const git = (root, args) => execFileSync('git', ['-C', root, ...args], { encoding: 'utf8' }).trim();
const sha256File = async path => createHash('sha256').update(await readFile(path)).digest('hex');

export function validateH7Contract(candidate = H7_CONTRACT) {
  if (candidate.toolId !== 'H_EARTH_CAPACITY_CAMERA_AND_RENDERER_CORRESPONDENCE_VERIFIER_v1') fail('H7_TOOL_ID_MISMATCH');
  if (candidate.parentCheckpointCommit !== '6688a557d2239d0fb11b06a2a588f905784b5bfc') fail('H7_PARENT_CHECKPOINT_COMMIT_MISMATCH');
  if (candidate.sourceCommit !== 'ba0f3ecf3087f91d2cb3ff6aa4dd3c040107712e') fail('H7_SOURCE_COMMIT_MISMATCH');
  if (candidate.productionMutationAuthority !== 'NONE') fail('H7_PRODUCTION_MUTATION_AUTHORITY_PROHIBITED');
  if (!Array.isArray(candidate.checkpointChain) || candidate.checkpointChain.length !== 7) fail('H7_CHECKPOINT_CHAIN_INVALID');
  if (!Array.isArray(candidate.authorizedCheckpointPaths) || candidate.authorizedCheckpointPaths.length !== 4) fail('H7_AUTHORIZED_PATH_SET_INVALID');
  const claims = candidate.claims;
  if (claims.h8RetiredIntoH7 !== true || claims.productionMutationAuthorized !== false || claims.productionFilesChanged !== 0 || claims.productionCorrectionStarted !== false || claims.mergePerformed !== false) fail('H7_STOP_BOUNDARY_VIOLATION');
  return true;
}

function expectedVerifierPaths() {
  return [
    '.github/workflows/h-earth-capacity-camera-correspondence-h2.yml',
    '.github/workflows/h-earth-capacity-camera-correspondence-h3.yml',
    '.github/workflows/h-earth-capacity-camera-correspondence-h4.yml',
    '.github/workflows/h-earth-capacity-camera-correspondence-h5.yml',
    '.github/workflows/h-earth-capacity-camera-correspondence-h6.yml',
    '.github/workflows/h-earth-capacity-camera-correspondence-h7-final.yml',
    'tools/h-earth-capacity-camera-renderer-correspondence-authority-lock.mjs',
    'tools/h-earth-capacity-camera-renderer-correspondence-measurement-contract.mjs',
    'tools/h-earth-capacity-camera-renderer-correspondence-h2-common.mjs',
    'tools/h-earth-capacity-camera-renderer-correspondence-h2-contract.json',
    'tools/h-earth-capacity-camera-renderer-correspondence-h2-controls.mjs',
    'tools/h-earth-capacity-camera-renderer-correspondence-h2-facts.mjs',
    'tools/h-earth-capacity-camera-renderer-correspondence-h2-observer.mjs',
    'tools/h-earth-capacity-camera-renderer-correspondence-h3-contract.json',
    'tools/h-earth-capacity-camera-renderer-correspondence-h3-controls.mjs',
    'tools/h-earth-capacity-camera-renderer-correspondence-h3-engine.mjs',
    'tools/h-earth-capacity-camera-renderer-correspondence-h4-contract.json',
    'tools/h-earth-capacity-camera-renderer-correspondence-h4-controls.mjs',
    'tools/h-earth-capacity-camera-renderer-correspondence-h4-evaluator.mjs',
    'tools/h-earth-capacity-camera-renderer-correspondence-h5-contract.json',
    'tools/h-earth-capacity-camera-renderer-correspondence-h5-controls.mjs',
    'tools/h-earth-capacity-camera-renderer-correspondence-h5-taxonomy.mjs',
    'tools/h-earth-capacity-camera-renderer-correspondence-h6-contract.json',
    'tools/h-earth-capacity-camera-renderer-correspondence-h6-controls.mjs',
    'tools/h-earth-capacity-camera-renderer-correspondence-h6-correspondence.mjs',
    'tools/h-earth-capacity-camera-renderer-correspondence-h7-contract.json',
    'tools/h-earth-capacity-camera-renderer-correspondence-h7-controls.mjs',
    'tools/h-earth-capacity-camera-renderer-correspondence-h7-finalizer.mjs'
  ].sort();
}

export function verifyCheckpointChain(repositoryRoot, headSha) {
  const actualHead = git(repositoryRoot, ['rev-parse', 'HEAD']);
  if (headSha && actualHead !== headSha) fail('H7_HEAD_SHA_MISMATCH', { expected: headSha, actual: actualHead });
  for (const item of H7_CONTRACT.checkpointChain) {
    try { execFileSync('git', ['-C', repositoryRoot, 'merge-base', '--is-ancestor', item.commit, actualHead]); }
    catch { fail('H7_CHECKPOINT_NOT_ANCESTOR', item); }
  }
  return { headSha: actualHead, checkpointCount: H7_CONTRACT.checkpointChain.length };
}

export async function buildSourceManifest(repositoryRoot) {
  const paths = git(repositoryRoot, ['diff', '--name-only', `${H7_CONTRACT.sourceCommit}...HEAD`]).split('\n').filter(Boolean).sort();
  const expected = expectedVerifierPaths();
  if (paths.length !== expected.length || paths.some((path, index) => path !== expected[index])) fail('H7_VERIFIER_PATH_INVENTORY_MISMATCH', { expected, actual: paths });
  if (paths.some(path => path.startsWith('showroom/') || path.startsWith('h-earth-3d/'))) fail('H7_PRODUCTION_PATH_MUTATION_DETECTED');
  const files = [];
  for (const path of paths) {
    const absolute = resolve(repositoryRoot, path);
    files.push({ path, gitBlob: git(repositoryRoot, ['hash-object', path]), byteLength: (await stat(absolute)).size, sha256: await sha256File(absolute) });
  }
  const body = { contractId: 'H_EARTH_CAPACITY_CAMERA_RENDERER_CORRESPONDENCE_H7_SOURCE_MANIFEST_v1', sourceCommit: H7_CONTRACT.sourceCommit, fileCount: files.length, files };
  return { ...body, deterministicReceiptSha256: digest(body) };
}

export async function executeFullChain(repositoryRoot) {
  const receipts = {
    H0: executeHEarthCapacityCameraRendererH0Controls(),
    H1: executeHEarthCapacityCameraRendererH1Controls(),
    H2: await executeH2Controls({ repositoryRoot }),
    H3: await executeH3Controls({ repositoryRoot }),
    H4: await executeH4Controls({ repositoryRoot }),
    H5: await executeH5Controls({ repositoryRoot }),
    H6: await executeH6Controls({ repositoryRoot })
  };
  for (const [checkpoint, receipt] of Object.entries(receipts)) {
    if (receipt?.status !== 'PASS') fail('H7_CHECKPOINT_EXECUTION_NOT_PASS', { checkpoint, status: receipt?.status });
  }
  if (receipts.H6.actualCorrespondence?.terminalClassification !== 'CAPACITY_AUTHORITY_GAP_RENDERER_NODE_BUDGET_REJECTION_CORRESPONDS') fail('H7_H6_CORRESPONDENCE_MISMATCH');
  return receipts;
}

export async function writeCheckpointReceipts(repositoryRoot, receipts) {
  const root = resolve(repositoryRoot, 'artifacts/h-earth-capacity-camera-h7/checkpoints');
  await mkdir(root, { recursive: true });
  for (const [checkpoint, receipt] of Object.entries(receipts)) await writeFile(resolve(root, `${checkpoint}.receipt.json`), `${JSON.stringify(receipt, null, 2)}\n`);
}

export async function buildArtifactInventory(repositoryRoot) {
  const checkpointPaths = ['H0','H1','H2','H3','H4','H5','H6'].map(id => `artifacts/h-earth-capacity-camera-h7/checkpoints/${id}.receipt.json`);
  const rendererPaths = [
    'artifacts/h-earth-renderer-corridor/aggregate.receipt.json',
    'artifacts/h-earth-renderer-corridor/SMALL_MOBILE_PORTRAIT_DPR_2.receipt.json',
    'artifacts/h-earth-renderer-corridor/LARGE_MOBILE_PORTRAIT_DPR_3.receipt.json',
    'artifacts/h-earth-renderer-corridor/TABLET_PORTRAIT_DPR_2.receipt.json',
    'artifacts/h-earth-renderer-corridor/DESKTOP_LANDSCAPE_DPR_1.receipt.json',
    'artifacts/h-earth-renderer-corridor/DESKTOP_LANDSCAPE_DPR_2.receipt.json',
    'artifacts/h-earth-capacity-camera-h7/renderer-tool-source-custody.json'
  ];
  const expected = [...checkpointPaths, ...rendererPaths];
  const entries = [];
  for (const path of expected) {
    const absolute = resolve(repositoryRoot, path);
    let info;
    try { info = await stat(absolute); } catch { fail('H7_REQUIRED_ARTIFACT_MISSING', { path }); }
    if (!info.isFile()) fail('H7_REQUIRED_ARTIFACT_NOT_FILE', { path });
    entries.push({ path, byteLength: info.size, sha256: await sha256File(absolute) });
  }
  const body = { contractId: 'H_EARTH_CAPACITY_CAMERA_RENDERER_CORRESPONDENCE_H7_ARTIFACT_INVENTORY_v1', artifactCount: entries.length, entries };
  return { ...body, deterministicReceiptSha256: digest(body) };
}
