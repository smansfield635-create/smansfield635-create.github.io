import fs from 'node:fs';
import {execFileSync} from 'node:child_process';

const BASE='9e824463723ddf9e67994590e5328643d0f3326c';
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

const forest=read('characters/forest-system.mjs');
const forestBase=atBase('characters/forest-system.mjs');
const forestAuthority=s=>s.slice(s.indexOf('export const FOREST_ARCHETYPES'),s.indexOf('function pushTri'));
if(forestAuthority(forest)!==forestAuthority(forestBase))fail('FOREST_ROOT_REGION_OR_POPULATION_DIVERGENCE');
if(!forest.includes('FOREST_PRESENTATION_SCALE=.58'))fail('FOREST_SCALE_CORRECTION_DIVERGENCE');
if(!forest.includes("import {GRATITUDE_COAST_NIGHT} from './night-renderer.mjs'"))fail('FOREST_NIGHT_MATERIAL_BINDING_MISSING');
for(const token of ['material.moon.direction','material.moon.color','material.terrain.ambient','material.terrain.rockLow','material.terrain.marsh','material.sky.horizon'])if(!forest.includes(token))fail(`FOREST_NIGHT_MATERIAL_TOKEN_MISSING:${token}`);
if(forest.includes('vec3(.012,.060,.041)')||forest.includes('vec3(.078,.175,.105)'))fail('INDEPENDENT_FIXED_GREEN_FOREST_SHADING_REMAINS');

if(read('characters/cloud-traversal.mjs')!==atBase('characters/cloud-traversal.mjs'))fail('CLOUD_TRAVEL_AUTHORITY_DIVERGENCE');
const cloud=read('characters/cloud-system.mjs');
const cloudBase=atBase('characters/cloud-system.mjs');
const bankAuthority=s=>s.slice(s.indexOf('const DESKTOP_BANKS='),s.indexOf('export function resolveCloudPresentation'));
const normalizeBank=s=>s.replace(/const AUDRALIA_GENUS_SEQUENCE=.*?;\n/s,'').replace(/,genus:AUDRALIA_GENUS_SEQUENCE\[bankIndex%AUDRALIA_GENUS_SEQUENCE.length\]/g,'');
if(normalizeBank(bankAuthority(cloud))!==normalizeBank(bankAuthority(cloudBase)))fail('CLOUD_BANK_LAYOUT_IDENTITY_DIVERGENCE');
for(const token of ['AUDRALIA_WEATHER_PRESENTATION_SOURCE','65aedb63832c4774f4a7326297fadbfb14552955','function morphology(','float fbm(','nearExclusion=smoothstep(150.0,420.0,vDepth)','genus:AUDRALIA_GENUS_SEQUENCE'])if(!cloud.includes(token))fail(`AUDRALIA_SOURCE_BINDING_MISSING:${token}`);
if(cloud.includes('function irregularBankVolume('))fail('OLD_BESPOKE_CLOUD_MORPHOLOGY_REMAINS');

for(const p of ['characters/night-renderer.mjs','characters/gratitude-geography.adapter.mjs','characters/step9-regional-geography.mjs','characters/coast-map.mjs','characters/app.mjs','characters/index.html'])if(read(p)!==atBase(p))fail(`PROTECTED_AUTHORITY_MUTATION:${p}`);

const contract=JSON.parse(read('control-plane/whole-estate/characters-reconstruction-v1/environment-source-reconciliation-contract.v1.json'));
if(contract.operationId!=='MIRRORLAND_ENVIRONMENT_SOURCE_RECONCILIATION_20260905_002')fail('CONTRACT_OPERATION_ID_MISMATCH');
if(contract.authority?.audraliaWeatherPresentation?.acceptedExactHead!=='65aedb63832c4774f4a7326297fadbfb14552955')fail('CONTRACT_AUDRALIA_AUTHORITY_MISMATCH');

const receipt={
  schema:'MIRRORLAND_ENVIRONMENT_SOURCE_RECONCILIATION_RECEIPT_v1',
  result:'PASS',
  base:BASE,
  head:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),
  changed,
  forestPopulationAuthorityPreserved:true,
  forestPresentationScale:.58,
  forestNightMaterialAuthorityBound:true,
  independentFixedGreenForestShaderRejected:true,
  cloudTravelAuthorityPreserved:true,
  cloudBankLayoutIdentityPreserved:true,
  audraliaWeatherPresentationSourceBound:true,
  oldBespokeCloudMorphologyRejected:true,
  sequence1Protected:true,
  sequence4Protected:true,
  sequence5PlusUntouched:true
};
fs.writeFileSync('environment-source-reconciliation-receipt.json',JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify(receipt,null,2));
