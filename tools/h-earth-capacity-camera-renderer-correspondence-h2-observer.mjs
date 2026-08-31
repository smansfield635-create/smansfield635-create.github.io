import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  H_EARTH_CAPACITY_CAMERA_RENDERER_CORRESPONDENCE_TOOL_ID as TOOL_ID,
  H_EARTH_CAPACITY_CAMERA_RENDERER_CORRESPONDENCE_H0_LOCK as H0,
  validateHEarthCapacityCameraRendererH0Lock as validateH0
} from './h-earth-capacity-camera-renderer-correspondence-authority-lock.mjs';
import {
  H_EARTH_CAPACITY_CAMERA_RENDERER_CORRESPONDENCE_H1_CONTRACT as H1,
  validateHEarthCapacityCameraRendererH1Contract as validateH1
} from './h-earth-capacity-camera-renderer-correspondence-measurement-contract.mjs';
import { freeze, digest, fail, sha256, gitBlobSha } from './h-earth-capacity-camera-renderer-correspondence-h2-common.mjs';
import { extractProductionFacts, validateProductionFacts } from './h-earth-capacity-camera-renderer-correspondence-h2-facts.mjs';

const here = dirname(fileURLToPath(import.meta.url));
export const DEFAULT_REPOSITORY_ROOT = resolve(here, '..');
export const H2_CONTRACT = freeze(JSON.parse(await readFile(resolve(here, 'h-earth-capacity-camera-renderer-correspondence-h2-contract.json'), 'utf8')));

export function validateH2Contract(candidate = H2_CONTRACT) {
  validateH0(H0); validateH1(H1);
  if (candidate.contractId !== H2_CONTRACT.contractId) fail('H2_CONTRACT_ID_MISMATCH');
  if (candidate.toolId !== TOOL_ID) fail('H2_TOOL_ID_MISMATCH');
  if (candidate.parentCheckpointContractId !== H1.contractId) fail('H2_PARENT_CHECKPOINT_CONTRACT_MISMATCH');
  if (candidate.sourceCommit !== H0.baseCommit) fail('H2_SOURCE_COMMIT_MISMATCH');
  if (candidate.sourcePosture !== 'READ_ONLY_EXECUTION') fail('H2_SOURCE_POSTURE_INVALID');
  if (candidate.productionMutationAuthority !== 'NONE') fail('H2_PRODUCTION_MUTATION_AUTHORITY_PROHIBITED');
  if (digest(candidate.authorizedCheckpointPaths) !== digest(H2_CONTRACT.authorizedCheckpointPaths)) fail('H2_AUTHORIZED_CHECKPOINT_PATH_SET_INVALID');
  const claims=candidate.claims;
  if (claims.productionFilesChanged!==0 || claims.productionCorrectionStarted!==false || claims.rendererExecutionAuthorized!==false || claims.h3Started!==false || claims.mergePerformed!==false) fail('H2_STOP_BOUNDARY_VIOLATION');
  return true;
}

export function validateCustody(records) {
  if (!Array.isArray(records) || records.length !== H0.protectedProductionSources.length) fail('H2_SOURCE_CUSTODY_RECORD_COUNT_MISMATCH');
  H0.protectedProductionSources.forEach((expected,index)=>{const actual=records[index];
    if (actual.path!==expected.path) fail('H2_SOURCE_PATH_MISMATCH',{index}); if (actual.gitBlob!==expected.gitBlob) fail('H2_SOURCE_BLOB_MISMATCH',{index});
    if (!Number.isSafeInteger(actual.byteLength)||actual.byteLength<=0) fail('H2_SOURCE_BYTE_LENGTH_INVALID',{index}); if (!/^[0-9a-f]{64}$/.test(actual.sha256)) fail('H2_SOURCE_SHA256_INVALID',{index});});
  return true;
}

export async function observeCustody(repositoryRoot = DEFAULT_REPOSITORY_ROOT) {
  const records=[];
  for (const source of H0.protectedProductionSources) {const bytes=await readFile(resolve(repositoryRoot,source.path));const gitBlob=gitBlobSha(bytes);
    if (gitBlob!==source.gitBlob) fail('H2_SOURCE_BLOB_MISMATCH',{path:source.path,expected:source.gitBlob,actual:gitBlob});
    records.push({path:source.path,role:source.role,gitBlob,byteLength:bytes.byteLength,sha256:sha256(bytes)});}
  validateCustody(records); return freeze(records);
}

export async function executeH2Observation({repositoryRoot = DEFAULT_REPOSITORY_ROOT} = {}) {
  validateH2Contract(); const sourceCustody=await observeCustody(repositoryRoot);
  const bytes=await readFile(resolve(repositoryRoot,H2_CONTRACT.primaryCapacityAuthorityPath));
  const module=await import(`data:text/javascript;base64,${bytes.toString('base64')}`);
  const productionFacts=extractProductionFacts(module),factValidation=validateProductionFacts(productionFacts,H2_CONTRACT.expectedFacts);
  const body={contractId:'H_EARTH_CAPACITY_CAMERA_RENDERER_CORRESPONDENCE_H2_PRODUCTION_OBSERVATION_RECEIPT_v1',toolId:TOOL_ID,checkpoint:'H2',sourceCommit:H2_CONTRACT.sourceCommit,
    sourceCustody,productionFacts,factValidation,terminalClassification:'PRODUCTION_CAPACITY_OBSERVED_SOURCE_CUSTODY_PASS',
    claims:{productionCapacityObserved:true,sourceIdentityEstablished:true,observationMutationPerformed:false,rendererExecutionPerformed:false,productionFilesChanged:0,productionCorrectionStarted:false,h3Started:false,mergePerformed:false}};
  return freeze({...body,deterministicReceiptSha256:digest(body)});
}
