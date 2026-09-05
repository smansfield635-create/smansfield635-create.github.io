import fs from 'node:fs';
import {execFileSync} from 'node:child_process';

const BASE='2f158b755644f4fb54309ed21c465aa4e863a361';
const allowed=new Set([
  'characters/forest-system.mjs',
  'characters/cloud-system.mjs',
  'control-plane/whole-estate/characters-reconstruction-v1/s2-s3-perceptual-reconciliation-contract.v1.json',
  'control-plane/whole-estate/characters-reconstruction-v1/verify-s2-s3-perceptual-reconciliation.v1.mjs',
  '.github/workflows/characters-s2-s3-perceptual-reconciliation-v1.yml'
]);
const fail=(m)=>{throw new Error(m)};
const read=(p)=>fs.readFileSync(p,'utf8');
const atBase=(p)=>execFileSync('git',['show',`${BASE}:${p}`],{encoding:'utf8'});

const changed=execFileSync('git',['diff','--name-only',`${BASE}...HEAD`],{encoding:'utf8'}).trim().split(/\n/).filter(Boolean);
for(const path of changed) if(!allowed.has(path)) fail(`PATH_SCOPE_VIOLATION:${path}`);

const forest=read('characters/forest-system.mjs');
const forestBase=atBase('characters/forest-system.mjs');
const forestAuthority=s=>s.split('function pushTri')[0];
if(forestAuthority(forest)!==forestAuthority(forestBase)) fail('FOREST_ROOT_OR_REGION_DIVERGENCE');
if(!forest.includes('function groundCluster(')) fail('FOREST_GROUND_INTEGRATION_MISSING');
if(!forest.includes('const sides=12,rings=5')) fail('FOREST_CROWN_REFINEMENT_MISSING');
if(!forest.includes('groundCluster(verts,t)')) fail('FOREST_UNDERSTORY_CONTINUITY_MISSING');

const cloud=read('characters/cloud-system.mjs');
const cloudBase=atBase('characters/cloud-system.mjs');
const cloudAuthority=s=>s.split('const VS=')[0];
if(cloudAuthority(cloud)!==cloudAuthority(cloudBase)) fail('CLOUD_BANK_IDENTITY_DIVERGENCE');
if(read('characters/cloud-traversal.mjs')!==atBase('characters/cloud-traversal.mjs')) fail('CLOUD_TRAVEL_AUTHORITY_DIVERGENCE');
if(!cloud.includes('latBands=9,lonBands=18')) fail('CLOUD_TESSELLATION_RECONCILIATION_MISSING');
if(!cloud.includes('vDepth')) fail('CLOUD_NEAR_FIELD_DEPTH_SIGNAL_MISSING');
if(!cloud.includes('nearFade')) fail('CLOUD_NEAR_FIELD_GEOMETRY_SUPPRESSION_MISSING');
if(!cloud.includes('irregularity')) fail('CLOUD_IRREGULAR_VOLUME_REPRESENTATION_MISSING');

const receipt={
  schema:'MIRRORLAND_S2_S3_PERCEPTUAL_RECONCILIATION_RECEIPT_v1',
  result:'PASS',
  base:BASE,
  head:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),
  changed,
  forestPopulationAuthorityPreserved:true,
  cloudBankIdentityPreserved:true,
  cloudTravelAuthorityPreserved:true,
  forestGroundIntegration:true,
  forestCrownRefinement:true,
  cloudIrregularShell:true,
  cloudNearFieldSuppression:true
};
fs.writeFileSync('s2-s3-perceptual-reconciliation-receipt.json',JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify(receipt,null,2));
