import crypto from 'node:crypto';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import registryFacade, {
  H_EARTH_GRATITUDE_REGION_FINAL_SPATIAL_PLACEMENT_DISPOSITION_SCOPE_NODE as REGISTRY_NODE,
  H_EARTH_GRATITUDE_REGION_FINAL_SPATIAL_PLACEMENT_DISPOSITION_EVIDENCE as REGISTRY_EVIDENCE
} from '../registry/accepted-amendments/h-earth.repository-registry.gratitude-region-final-spatial-placement-disposition.js';
import { loadHEarthRepositoryRegistryValidatorDependencies } from '../registry/h-earth.repository-registry.validator-engine.loader.js';

const ADMISSION_MAIN_HEAD = '0bf5bcd63132d92fa6a4758a4f57ef2a6f524038';
const VERIFIED_CONTROLLING_BASE = '554a693c82876d9533bd577475a818a570d03b0d';
const DISPOSITION_PATH = 'h-earth-3d/control-plane/region-001-reconciliation/h-earth.region-001.gratitude-region-final-spatial-placement-disposition.v1.json';
const RECEIPT_PATH = 'h-earth-3d/validation/h-earth.gratitude-region.final-spatial-placement-disposition.receipt.v1.json';
const TEMPORARY_WORKFLOW_PATH = '.github/workflows/h-earth-gratitude-region-final-placement-freeze.yml';
const EXPECTED_DURABLE_PATHS = Object.freeze([
  DISPOSITION_PATH,
  'h-earth-3d/validation/h-earth.gratitude-region.final-spatial-placement-disposition.mjs',
  'h-earth-3d/validation/h-earth.gratitude-region.final-spatial-placement-disposition.runner.mjs',
  RECEIPT_PATH,
  'h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.gratitude-region-final-spatial-placement-disposition.js',
  'h-earth-3d/registry/h-earth.repository-registry.validator-engine.loader.js'
]);
const freeze=(value,seen=new WeakSet())=>{if(value===null||typeof value!=='object'||seen.has(value))return value;seen.add(value);Object.values(value).forEach(v=>freeze(v,seen));return Object.isFrozen(value)?value:Object.freeze(value)};
const stable=value=>value===null||typeof value!=='object'?JSON.stringify(value):Array.isArray(value)?`[${value.map(stable).join(',')}]`:`{${Object.keys(value).sort().map(k=>`${JSON.stringify(k)}:${stable(value[k])}`).join(',')}}`;
const digest=value=>crypto.createHash('sha256').update(stable(value)).digest('hex');
const git=(...args)=>execFileSync('git',args,{encoding:'utf8'}).trim();
const readJson=path=>JSON.parse(fs.readFileSync(path,'utf8'));
const sortedUnique=values=>[...new Set(values)].sort();
const exact=(a,b)=>stable(a)===stable(b);

function executeOnce(){
  const disposition=readJson(DISPOSITION_PATH);
  const receipt=readJson(RECEIPT_PATH);
  const issues=[];
  const actualHead=git('rev-parse','HEAD');
  const mergeBase=git('merge-base',ADMISSION_MAIN_HEAD,'HEAD');
  const changedPaths=sortedUnique(git('diff','--name-only',`${mergeBase}..HEAD`).split('\n').filter(Boolean));
  const allowed=new Set([...EXPECTED_DURABLE_PATHS,TEMPORARY_WORKFLOW_PATH]);
  const unexpected=changedPaths.filter(path=>!allowed.has(path));
  if(unexpected.length)issues.push(`UNEXPECTED_CHANGED_PATHS:${unexpected.join(',')}`);
  const durablePresent=EXPECTED_DURABLE_PATHS.every(path=>fs.existsSync(path));
  if(!durablePresent)issues.push('DURABLE_PATH_MISSING');
  if(!exact(disposition.plannedDurableCandidatePaths,EXPECTED_DURABLE_PATHS))issues.push('PLANNED_DURABLE_PATH_SET_MISMATCH');
  if(disposition.artifactIdentity?.verifiedControllingBase!==VERIFIED_CONTROLLING_BASE)issues.push('VERIFIED_CONTROLLING_BASE_MISMATCH');
  if(disposition.artifactIdentity?.admissionMainHead!==ADMISSION_MAIN_HEAD)issues.push('ADMISSION_MAIN_HEAD_MISMATCH');
  const frozen=(disposition.frozenInputInventory??[]).map(record=>{
    const durableMutationTarget=EXPECTED_DURABLE_PATHS.includes(record.path);
    const currentExists=fs.existsSync(record.path);
    const actualGitBlob=durableMutationTarget
      ? git('rev-parse',`${VERIFIED_CONTROLLING_BASE}:${record.path}`)
      : currentExists?git('hash-object',record.path):null;
    const matches=actualGitBlob===record.gitBlob;
    if(!matches)issues.push(`FROZEN_INPUT_MISMATCH:${record.path}:${actualGitBlob}:${record.gitBlob}`);
    return freeze({...record,currentExists,verifiedAt:durableMutationTarget?VERIFIED_CONTROLLING_BASE:'CURRENT_HEAD',actualGitBlob,matches});
  });
  if(frozen.length!==24)issues.push(`FROZEN_INPUT_COUNT:${frozen.length}`);
  if(receipt.status!=='FINAL_PLACEMENT_DISPOSITION_RESOLVED_PASS_CLOSED'||receipt.eligible!==true)issues.push('FP05_RECEIPT_NOT_PASS_CLOSED');
  if(receipt.areaDispositionCount!==4||receipt.completeLifecycleDispositionCount!==4)issues.push('AREA_DISPOSITION_COUNT_MISMATCH');
  if(receipt.pairRelationshipCount!==6||receipt.allPairRelationshipsPass!==true)issues.push('PAIR_RELATIONSHIP_MATRIX_FAILURE');
  if(receipt.preservationLawCount!==13||receipt.allPreservationLawsPass!==true)issues.push('PRESERVATION_LAW_FAILURE');
  if(receipt.registryPreflightStatus!=='PASS')issues.push('RECEIPT_REGISTRY_PREFLIGHT_NOT_PASS');
  if(receipt.unresolvedRequiredPlacementFieldCount!==0)issues.push('UNRESOLVED_REQUIRED_PLACEMENT_FIELDS');
  const expectedComposite={entryZone:'ACCEPTED',mirrorManorSiteEnvelope:'ACCEPTED',cavernCurrentExteriorRelation:'ACCEPTED',frontierPlains:'RETAINED_ELIGIBLE_NONFINAL'};
  if(!exact(receipt.regionalComposite,expectedComposite)||!exact(disposition.finalRegionalComposite,expectedComposite))issues.push('REGIONAL_COMPOSITE_MISMATCH');
  if(receipt.finalPlacementPrMergeAuthorized!==false||receipt.constructionAuthorized!==false)issues.push('SOURCE_EXECUTION_AUTHORITY_OVERREACH');
  if(Object.values(disposition.authorityBoundary??{}).some(Boolean))issues.push('DURABLE_AUTHORITY_BOUNDARY_OVERREACH');
  const loader=loadHEarthRepositoryRegistryValidatorDependencies();
  if(loader.identityVerified!==true)issues.push('REGISTRY_IDENTITY_PREFLIGHT_FAIL');
  if(loader.finalPlacementDispositionVerified!==true)issues.push('FINAL_PLACEMENT_REGISTRY_PREFLIGHT_FAIL');
  if(REGISTRY_NODE.lifecycleStatus!=='ACCEPTED_FINAL_PLACEMENT_DISPOSITION')issues.push('REGISTRY_NODE_LIFECYCLE_MISMATCH');
  if(REGISTRY_EVIDENCE.finalPlacementStatus!=='FINAL_PLACEMENT_DISPOSITION_RESOLVED_PASS_CLOSED')issues.push('REGISTRY_EVIDENCE_STATUS_MISMATCH');
  if(registryFacade.resolveHEarthRepositoryRegistryPath(`/${RECEIPT_PATH}`).resolved!==true)issues.push('FINAL_RECEIPT_PATH_NOT_REGISTRY_RESOLVED');
  const pairPass=(receipt.pairRelationshipMatrix??[]).every(record=>record.status==='PASS');
  const preservationPass=(receipt.preservationLaws??[]).every(record=>record.status==='PASS');
  const protectedMutationPaths=frozen
    .filter(record=>changedPaths.includes(record.path)&&!EXPECTED_DURABLE_PATHS.includes(record.path))
    .map(record=>record.path);
  if(protectedMutationPaths.length)issues.push(`PROTECTED_MUTATION_PATHS:${protectedMutationPaths.join(',')}`);
  return freeze({
    schemaVersion:'H_EARTH_GRATITUDE_REGION_FINAL_PLACEMENT_REPOSITORY_ADMISSION_RECEIPT_v1',
    eligible:issues.length===0,
    status:issues.length===0?'FINAL_PLACEMENT_REPOSITORY_ADMISSION_PASS_CLOSED':'FINAL_PLACEMENT_REPOSITORY_ADMISSION_FAIL_STOPPED',
    admissionMainHead:ADMISSION_MAIN_HEAD,
    verifiedControllingBase:VERIFIED_CONTROLLING_BASE,
    mergeBase,
    executedHead:actualHead,
    changedPaths,
    expectedDurablePaths:EXPECTED_DURABLE_PATHS,
    exactExpectedPathSet:unexpected.length===0&&EXPECTED_DURABLE_PATHS.every(path=>changedPaths.includes(path)),
    frozenInputCount:frozen.length,
    exactFrozenInputMatchCount:frozen.filter(record=>record.matches).length,
    protectedMutationPaths,
    finalPlacementStatus:receipt.status,
    areaDispositionCount:receipt.areaDispositionCount,
    completeLifecycleDispositionCount:receipt.completeLifecycleDispositionCount,
    pairRelationshipCount:receipt.pairRelationshipCount,
    allPairRelationshipsPass:pairPass,
    preservationLawCount:receipt.preservationLawCount,
    allPreservationLawsPass:preservationPass,
    registryPreflightStatus:loader.finalPlacementDispositionVerified?'PASS':'FAIL',
    unresolvedRequiredPlacementFieldCount:receipt.unresolvedRequiredPlacementFieldCount,
    regionalComposite:receipt.regionalComposite,
    productPathsChanged:changedPaths.some(path=>path.startsWith('showroom/')||path.startsWith('products/')||path.startsWith('laws/')),
    livePagePathsChanged:changedPaths.some(path=>path.startsWith('showroom/')),
    constructionAuthorized:false,
    issues:freeze(issues)
  });
}

export function executeGratitudeRegionFinalPlacementRepositoryAdmission(){
  const first=executeOnce();
  const second=executeOnce();
  const firstExecutionDigest=digest(first);
  const secondExecutionDigest=digest(second);
  const issues=[...first.issues];
  if(firstExecutionDigest!==secondExecutionDigest)issues.push('REPOSITORY_ADMISSION_NONDETERMINISTIC');
  return freeze({...first,eligible:first.eligible&&issues.length===0,status:first.eligible&&issues.length===0?'FINAL_PLACEMENT_REPOSITORY_ADMISSION_PASS_CLOSED':'FINAL_PLACEMENT_REPOSITORY_ADMISSION_FAIL_STOPPED',firstExecutionDigest,secondExecutionDigest,deterministicRepeatExecution:firstExecutionDigest===secondExecutionDigest,issues:freeze(issues)});
}

export default executeGratitudeRegionFinalPlacementRepositoryAdmission;
