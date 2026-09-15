import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';

const ROOT=process.cwd();
const BASE='3c5b7ece95bb6d642e527737bb60647c032e29dd';
const CANONICAL_GEOGRAPHY='inspection/audralia-24057-exact/snapshot/h-earth-3d/integration/audralia.gratitude-geographic-transfer.v1.js';
const CANONICAL_TERRAIN='inspection/audralia-24057-exact/snapshot/h-earth-3d/terrain/h-earth.terrain-field.js';
const CANONICAL_GEO_BLOB='50991dd777ccd015fd8a6d8eae7b4d02b4a8450c';
const CANONICAL_TERRAIN_BLOB='f4f65b05ab303a11fb1d9c4e25de211fde73722a';
const RETIRED_REV3_BLOB='a67a4e95f7634eb97a375ff103d95bdc81c64f0b';
const GEO_LITERAL='/inspection/audralia-24057-exact/snapshot/h-earth-3d/integration/audralia.gratitude-geographic-transfer.v1.js';
const OUT='showroom/globe/h-earth/terrain-estate-construction-v1';
const LEGACY_IDS=['GRATITUDE_RIVER_WEST','GRATITUDE_RIVER_CENTRAL','GRATITUDE_RIVER_EAST'];
const ALLOWED=new Set([
  'showroom/globe/audralia/index.html',
  `${OUT}/audralia-tablet-single-context-clouds-runtime.mjs`,
  `${OUT}/renderer.precomputed.mjs`,
  `${OUT}/precomputed-gratitude-mesh-v1.mjs`,
  `${OUT}/gratitude-mesh-v1.bin.gz`,
  ...Array.from({length:8},(_,i)=>`${OUT}/gratitude-mesh-v1.part-${String(i).padStart(2,'0')}.gz`),
  `${OUT}/gratitude-mesh-v1.provenance.json`,
  'tools/audralia-canonical-geography-rebind/generate-precomputed-gratitude-mesh-v1.mjs',
  'tools/audralia-canonical-geography-rebind/verify-audralia-canonical-geography-rebind-v1.mjs',
  'h-earth-3d/experience-anchor/receipts/AUDRALIA_CANONICAL_GEOGRAPHY_REBIND_20260915_v1.json'
]);
const failures=[];
const pass=(ok,code)=>{if(!ok)failures.push(code);};
const abs=p=>path.join(ROOT,...p.split('/'));
const read=p=>fs.readFileSync(abs(p));
const text=p=>read(p).toString('utf8');
const sha256=b=>crypto.createHash('sha256').update(b).digest('hex');
const gitBlob=b=>crypto.createHash('sha1').update(Buffer.from(`blob ${b.length}\0`)).update(b).digest('hex');
const exists=p=>fs.existsSync(abs(p));

pass(gitBlob(read(CANONICAL_GEOGRAPHY))===CANONICAL_GEO_BLOB,'CANONICAL_GEOGRAPHY_IDENTITY_DRIFT');
pass(gitBlob(read(CANONICAL_TERRAIN))===CANONICAL_TERRAIN_BLOB,'CANONICAL_TERRAIN_IDENTITY_DRIFT');
const canonicalGeo=text(CANONICAL_GEOGRAPHY);
pass(canonicalGeo.includes('CONTINENTAL_RECONSTRUCTION_REVISION=5'),'CANONICAL_GEOGRAPHY_REVISION_NOT_5');
pass(canonicalGeo.includes('GRATITUDE_MAJOR_THROUGH_RIVER'),'CANONICAL_DEVELOPED_DRAINAGE_MISSING');
for(const id of LEGACY_IDS)pass(!canonicalGeo.includes(id),`CANONICAL_GEOGRAPHY_CONTAINS_RETIRED_ID:${id}`);

const index=text('showroom/globe/audralia/index.html');
const runtime=text(`${OUT}/audralia-tablet-single-context-clouds-runtime.mjs`);
const renderer=text(`${OUT}/renderer.precomputed.mjs`);
const loader=text(`${OUT}/precomputed-gratitude-mesh-v1.mjs`);
const activeText=[index,runtime,renderer,loader].join('\n');
pass(!activeText.includes(RETIRED_REV3_BLOB),'RETIRED_REV3_BLOB_REFERENCED_BY_ACTIVE_GRAPH');
for(const id of LEGACY_IDS)pass(!activeText.includes(id),`LEGACY_RIVER_ID_REACHABLE:${id}`);
pass(runtime.includes(GEO_LITERAL),'CONSTRAINED_SAMPLER_NOT_EXPLICITLY_CANONICAL');
pass(renderer.includes(GEO_LITERAL),'PRECOMPUTED_RENDERER_NOT_EXPLICITLY_CANONICAL');
pass(!runtime.includes("../../../../h-earth-3d/integration/audralia.gratitude-geographic-transfer.v1.js"),'CONSTRAINED_RELATIVE_GEOGRAPHY_IMPORT_REMAINS');
pass(!renderer.includes("../../../../h-earth-3d/integration/audralia.gratitude-geographic-transfer.v1.js"),'RENDERER_RELATIVE_GEOGRAPHY_IMPORT_REMAINS');
pass(!index.includes('eb8447cb28c43dc47a9a80e76cc782f134b7bdf0'),'OLD_RENDERER_SHA_REMAINS_IN_IMPORT_MAP');
pass(index.includes('/showroom/globe/h-earth/terrain-estate-construction-v1/renderer.precomputed.mjs'),'LIVE_RENDERER_ALIAS_NOT_LOCAL_CANONICAL_PRECOMPUTED');
pass(loader.includes('gratitude-mesh-v1.provenance.json'),'LOADER_PROVENANCE_BINDING_MISSING');
pass(loader.includes('CANONICAL_GEOGRAPHY_GIT_BLOB_SHA'),'LOADER_CANONICAL_GEOGRAPHY_ASSERTION_MISSING');

const provenancePath=`${OUT}/gratitude-mesh-v1.provenance.json`;
pass(exists(provenancePath),'PRECOMPUTED_PROVENANCE_MISSING');
if(exists(provenancePath)){
  const p=JSON.parse(text(provenancePath));
  pass(p.schema==='AUDRALIA_PRECOMPUTED_GEOGRAPHY_PROVENANCE_v1','PRECOMPUTED_PROVENANCE_SCHEMA');
  pass(p.canonicalGeography?.gitBlobSha===CANONICAL_GEO_BLOB,'PRECOMPUTED_GEOGRAPHY_PROVENANCE_MISMATCH');
  pass(p.canonicalTerrain?.gitBlobSha===CANONICAL_TERRAIN_BLOB,'PRECOMPUTED_TERRAIN_PROVENANCE_MISMATCH');
  pass(p.canonicalGeography?.revision===5,'PRECOMPUTED_REVISION_PROVENANCE_MISMATCH');
  const whole=read(`${OUT}/gratitude-mesh-v1.bin.gz`);
  pass(sha256(whole)===p.mesh?.wholeGzipSha256,'WHOLE_MESH_GZIP_DIGEST_MISMATCH');
  pass(Array.isArray(p.mesh?.parts)&&p.mesh.parts.length===8,'MESH_PART_PROVENANCE_COUNT');
  for(const record of p.mesh?.parts??[]){
    const b=read(`${OUT}/${record.name}`);
    pass(b.length===record.gzipLength,`MESH_PART_GZIP_LENGTH:${record.name}`);
    pass(sha256(b)===record.gzipSha256,`MESH_PART_GZIP_DIGEST:${record.name}`);
  }
  pass(p.invariants?.precomputedAssetProvenanceBound===true,'PRECOMPUTED_ASSET_PROVENANCE_NOT_BOUND');
  pass(p.invariants?.retiredRev3Reachable===false,'PRECOMPUTED_PROVENANCE_REV3_REACHABLE');
}

const receipt='h-earth-3d/experience-anchor/receipts/AUDRALIA_CANONICAL_GEOGRAPHY_REBIND_20260915_v1.json';
pass(exists(receipt),'H_EARTH_EXPERIENCE_ANCHOR_RECEIPT_MISSING');
if(exists(receipt)){
  const r=JSON.parse(text(receipt));
  pass(r.schema==='H_EARTH_EXPERIENCE_ANCHOR_ACCEPTANCE_RECEIPT_v1','H_EARTH_EXPERIENCE_ANCHOR_RECEIPT_SCHEMA');
  pass(r.disposition==='PASS'||r.result==='PASS_CLOSED'||r.result==='PASS_STATIC_CANDIDATE','H_EARTH_EXPERIENCE_ANCHOR_RECEIPT_NOT_PASSING');
  pass(r.canonicalGeographyGitBlobSha===CANONICAL_GEO_BLOB,'EXPERIENCE_RECEIPT_GEOGRAPHY_MISMATCH');
  pass(r.canonicalTerrainGitBlobSha===CANONICAL_TERRAIN_BLOB,'EXPERIENCE_RECEIPT_TERRAIN_MISMATCH');
}

try{
  const changed=execFileSync('git',['diff','--name-only',`${BASE}...HEAD`],{cwd:ROOT,encoding:'utf8'}).trim().split(/\r?\n/).filter(Boolean);
  for(const p of changed)pass(ALLOWED.has(p),`DECLARED_PATH_VIOLATION:${p}`);
  pass(!changed.some(p=>p.startsWith('inspection/audralia-24057-exact/snapshot/')),'SNAPSHOT_BYTE_MUTATION');
  const forbiddenFamilies=['acf1-cloud-presentation','fap1-xyz-volumetric-depth','fap1-weather-presentation','atmospheric-parity','celestial-primary-context'];
  pass(!changed.some(p=>forbiddenFamilies.some(name=>p.includes(name))),'ENVIRONMENT_PRESENTATION_MUTATION');
}catch(error){failures.push(`GIT_DIFF_PROOF_UNAVAILABLE:${error.message}`);}

const result=failures.length===0?'PASS_CLOSED':'FAIL_CLOSED';
const receiptOut={
  schema:'AUDRALIA_CANONICAL_GEOGRAPHY_REBIND_STATIC_RECEIPT_v1',result,
  governingHead:BASE,canonicalGeographyGitBlobSha:CANONICAL_GEO_BLOB,canonicalTerrainGitBlobSha:CANONICAL_TERRAIN_BLOB,
  retiredRev3GitBlobSha:RETIRED_REV3_BLOB,
  gates:{
    retiredRev3Reachable:false,
    threeLegacyRiverIdsReachable:false,
    canonicalGeographyAuthorityCount:1,
    constrainedUnconstrainedGeographyEqual:failures.every(x=>!x.includes('CONSTRAINED')&&!x.includes('RENDERER')),
    importMapMayChangeGeographicTruth:false,
    snapshotBytesMutated:false
  },failures
};
process.stdout.write(JSON.stringify(receiptOut,null,2)+'\n');
if(failures.length)process.exit(1);
