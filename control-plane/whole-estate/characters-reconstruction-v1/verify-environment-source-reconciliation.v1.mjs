import fs from 'node:fs';
import {execFileSync} from 'node:child_process';

const BASE='6d786a9a6bb0c91f7bae3c46b286ddb7bd0e033b';
const STAGE1='077fbdb09c4990f41abd37ce99a17b6187c74992';
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
const at=(ref,p)=>execFileSync('git',['show',`${ref}:${p}`],{encoding:'utf8'});
const atBase=p=>at(BASE,p);
const changed=execFileSync('git',['diff','--name-only',`${BASE}...HEAD`],{encoding:'utf8'}).trim().split(/\n/).filter(Boolean);
for(const p of changed)if(!allowed.has(p))fail(`PATH_SCOPE_VIOLATION:${p}`);

const cloud=read('characters/cloud-system.mjs');
const stage1Cloud=at(STAGE1,'characters/cloud-system.mjs');
if(cloud!==stage1Cloud)fail('STAGE1_CLOUD_IDENTITY_DIVERGENCE_DURING_VEGETATION_STAGE');
for(const token of [
  "AUDRALIA_VOLUMETRIC_GEOMETRY_MODEL='PR780_DENSITY_SAMPLED_VOLUME_CELLS'",
  "exactHead:'65aedb63832c4774f4a7326297fadbfb14552955'",
  'function morphologyDensity(',
  'function buildVolumetricCells(',
  'gl.drawArrays(gl.POINTS,0,cellCount)'
])if(!cloud.includes(token))fail(`STAGE1_CLOUD_BINDING_MISSING:${token}`);
for(const token of ['function weatherCarrier(','function bankEnvelope(','verts=geometry(layout)'])if(cloud.includes(token))fail(`LEGACY_CLOUD_CARRIER_RETURNED:${token}`);

for(const p of [
  'characters/cloud-traversal.mjs',
  'characters/night-renderer.mjs',
  'characters/gratitude-geography.adapter.mjs',
  'characters/step9-regional-geography.mjs',
  'characters/coast-map.mjs',
  'characters/app.mjs',
  'characters/index.html'
])if(read(p)!==atBase(p))fail(`STAGE2_PROTECTED_AUTHORITY_MUTATION:${p}`);

const forest=read('characters/forest-system.mjs');
const forestBase=atBase('characters/forest-system.mjs');
const populationAuthority=s=>s.slice(0,s.indexOf('function pushTri('));
if(populationAuthority(forest)!==populationAuthority(forestBase))fail('FOREST_ROOT_REGION_POPULATION_AUTHORITY_DIVERGENCE');
const scaleToken='export const FOREST_PRESENTATION_SCALE=.58;';
if(!forest.includes(scaleToken)||!forestBase.includes(scaleToken))fail('FOREST_PRESENTATION_SCALE_DIVERGENCE');
for(const token of [
  "FOREST_MATERIAL_MODEL='GRATITUDE_COAST_NIGHT_INTEGRATED_V2'",
  "FOREST_ATMOSPHERE_MODEL='BASIN_MIST_HORIZON_SCATTER_DISTANCE_DESATURATION'",
  'float fbm(vec2 p)',
  'float basinMist=',
  'float horizonHaze=',
  'float distanceDesaturation=',
  'vec3 nightVegetation=',
  'materialModel:FOREST_MATERIAL_MODEL',
  'atmosphereModel:FOREST_ATMOSPHERE_MODEL'
])if(!forest.includes(token))fail(`VEGETATION_MATURITY_BINDING_MISSING:${token}`);
for(const token of [
  'vec3 terrainVegetation=mix(uRockLow,uMarsh,.38+.36*broad);',
  'float haze=smoothstep(620.0,1500.0,radial);'
])if(forest.includes(token))fail(`LEGACY_FOREST_MATERIAL_GRAMMAR_REMAINS:${token}`);

const contract=JSON.parse(read('control-plane/whole-estate/characters-reconstruction-v1/environment-source-reconciliation-contract.v1.json'));
if(contract.schema!=='MIRRORLAND_ENVIRONMENT_MATURITY_PARITY_CONTRACT_v1')fail('CONTRACT_SCHEMA_MISMATCH');
if(contract.operationId!==OPERATION||contract.governingHead!==BASE||contract.lockGeneration!==1955)fail('CONTRACT_GOVERNING_IDENTITY_MISMATCH');
if(contract.program?.stage1Status!=='PASS_CLOSED'||contract.program?.stage2Status!=='AUTHORIZED_ACTIVE')fail('CONTRACT_STAGE_ORDER_MISMATCH');
if(contract.stage1?.qualifiedCandidate!==STAGE1||contract.stage1?.qualifiedCloudBlob!=='49fb5a185935aaa59894137659b27272ebc100b5')fail('CONTRACT_STAGE1_IDENTITY_MISMATCH');
if(contract.program?.governanceReopenBetweenStages!==false||contract.stage2?.governanceReopenRequired!==false)fail('CONTRACT_GOVERNANCE_REOPEN_MISMATCH');

const head=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
const forestBlob=execFileSync('git',['rev-parse','HEAD:characters/forest-system.mjs'],{encoding:'utf8'}).trim();
const cloudBlob=execFileSync('git',['rev-parse','HEAD:characters/cloud-system.mjs'],{encoding:'utf8'}).trim();
const receipt={
  schema:'MIRRORLAND_ENVIRONMENT_MATURITY_PARITY_RECEIPT_v1',
  operationId:OPERATION,
  result:'PASS_CLOSED',
  stage:'VEGETATION_MATURITY_PARITY',
  stageResult:'ENVIRONMENT_MATURITY_PARITY_PASS',
  base:BASE,
  stage1Candidate:STAGE1,
  head,
  changed,
  cloudBlob,
  forestBlob,
  cloudGeometryStagePreserved:true,
  cloudTravelAuthorityPreserved:true,
  forestPopulationAuthorityPreserved:true,
  forestRootRegionIdentityPreserved:true,
  forestPresentationScalePreserved:true,
  nightMaterialAuthorityReadOnly:true,
  matureNightPaletteBound:true,
  lunarResponseBound:true,
  basinMistBound:true,
  horizonScatteringBound:true,
  distanceDesaturationBound:true,
  protectedAuthoritiesPreserved:true,
  governanceReopenOccurred:false,
  mergeDeploymentPublicationAuthorized:false
};
fs.writeFileSync('environment-source-reconciliation-receipt.json',JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify(receipt,null,2));
