import fs from 'node:fs';
import {execFileSync} from 'node:child_process';

const BASE='6d786a9a6bb0c91f7bae3c46b286ddb7bd0e033b';
const OPERATION='MIRRORLAND_AUDRALIA_CLOUD_GEOMETRY_ADOPTION_20260905_001';
const allowed=new Set([
  'characters/forest-system.mjs',
  'characters/cloud-system.mjs',
  'control-plane/whole-estate/characters-reconstruction-v1/environment-source-reconciliation-contract.v1.json',
  'control-plane/whole-estate/characters-reconstruction-v1/verify-environment-source-reconciliation.v1.mjs',
  '.github/workflows/characters-environment-source-reconciliation-v1.yml'
]);
const fail=m=>{throw new Error(m)};
const read=p=>fs.readFileSync(p,'utf8');
const atBase=p=>execFileSync('git',['show',`${BASE}:${p}`],{encoding:'utf8'});
const changed=execFileSync('git',['diff','--name-only',`${BASE}...HEAD`],{encoding:'utf8'}).trim().split(/\n/).filter(Boolean);
for(const p of changed)if(!allowed.has(p))fail(`PATH_SCOPE_VIOLATION:${p}`);

const cloud=read('characters/cloud-system.mjs');
const cloudBase=atBase('characters/cloud-system.mjs');
const bankAuthority=s=>s.slice(s.indexOf('export const CLOUD_PRESENTATION_BY_STATE'),s.indexOf('export function resolveCloudPresentation'));
if(bankAuthority(cloud)!==bankAuthority(cloudBase))fail('CLOUD_WORLD_ANCHOR_OR_STATE_AUTHORITY_DIVERGENCE');
for(const token of [
  "AUDRALIA_VOLUMETRIC_GEOMETRY_MODEL='PR780_DENSITY_SAMPLED_VOLUME_CELLS'",
  "exactHead:'65aedb63832c4774f4a7326297fadbfb14552955'",
  'function morphologyDensity(',
  'function buildVolumetricCells(',
  'function bankVolumeBounds(',
  'gl_PointCoord',
  'gl.drawArrays(gl.POINTS,0,cellCount)',
  'geometryModel:AUDRALIA_VOLUMETRIC_GEOMETRY_MODEL'
])if(!cloud.includes(token))fail(`AUDRALIA_CLOUD_GEOMETRY_BINDING_MISSING:${token}`);
for(const token of ['function weatherCarrier(','function bankEnvelope(','verts=geometry(layout)','gl.drawArrays(gl.TRIANGLES,0,verts.length/8)'])if(cloud.includes(token))fail(`ELLIPSOID_OR_SURFACE_CARRIER_REMAINS:${token}`);
if(!cloud.includes('nearExclusion=smoothstep(150.0,420.0,vDepth)'))fail('PR780_NEAR_FIELD_EXCLUSION_MISSING');

for(const p of [
  'characters/cloud-traversal.mjs',
  'characters/forest-system.mjs',
  'characters/night-renderer.mjs',
  'characters/gratitude-geography.adapter.mjs',
  'characters/step9-regional-geography.mjs',
  'characters/coast-map.mjs',
  'characters/app.mjs',
  'characters/index.html'
])if(read(p)!==atBase(p))fail(`STAGE1_PROTECTED_AUTHORITY_MUTATION:${p}`);

const contract=JSON.parse(read('control-plane/whole-estate/characters-reconstruction-v1/environment-source-reconciliation-contract.v1.json'));
if(contract.schema!=='MIRRORLAND_ENVIRONMENT_MATURITY_PARITY_CONTRACT_v1')fail('CONTRACT_SCHEMA_MISMATCH');
if(contract.operationId!==OPERATION)fail('CONTRACT_OPERATION_ID_MISMATCH');
if(contract.governingHead!==BASE||contract.lockGeneration!==1955)fail('CONTRACT_GOVERNING_IDENTITY_MISMATCH');
if(contract.authority?.audraliaCloudGeometry?.acceptedExactHead!=='65aedb63832c4774f4a7326297fadbfb14552955')fail('CONTRACT_AUDRALIA_AUTHORITY_MISMATCH');
if(contract.stage1?.geometryModel!=='PR780_DENSITY_SAMPLED_VOLUME_CELLS')fail('CONTRACT_GEOMETRY_MODEL_MISMATCH');
if(contract.program?.stage1Status!=='AUTHORIZED_ACTIVE'||contract.program?.stage2Status!=='BLOCKED_UNTIL_STAGE1_PASS')fail('CONTRACT_STAGE_ORDER_MISMATCH');
if(contract.program?.governanceReopenBetweenStages!==false||contract.stage2?.governanceReopenRequired!==false)fail('CONTRACT_GOVERNANCE_REOPEN_MISMATCH');

const head=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
const receipt={
  schema:'MIRRORLAND_ENVIRONMENT_MATURITY_PARITY_RECEIPT_v1',
  operationId:OPERATION,
  result:'PASS_CLOSED',
  stage:'AUDRALIA_CLOUD_GEOMETRY_ADOPTION',
  stageResult:'CLOUD_GEOMETRY_STAGE_PASS',
  base:BASE,
  head,
  changed,
  audraliaSourceExactHead:'65aedb63832c4774f4a7326297fadbfb14552955',
  geometryModel:'PR780_DENSITY_SAMPLED_VOLUME_CELLS',
  densityDerivedGeometry:true,
  ellipsoidSurfaceCarrierRejected:true,
  cloudWorldAnchorsPreserved:true,
  cloudPresentationStatesPreserved:true,
  cloudTravelAuthorityPreserved:true,
  forestBytesPreservedDuringStage1:true,
  protectedAuthoritiesPreserved:true,
  vegetationStageUnlocked:true,
  governanceReopenRequiredBeforeVegetation:false,
  mergeDeploymentPublicationAuthorized:false
};
fs.writeFileSync('environment-source-reconciliation-receipt.json',JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify(receipt,null,2));
