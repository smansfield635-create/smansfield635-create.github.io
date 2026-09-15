import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import {gzipSync} from 'node:zlib';
import {pathToFileURL} from 'node:url';

const ROOT=process.cwd();
const rel=p=>path.join(ROOT,...p.split('/'));
const OUT='showroom/globe/h-earth/terrain-estate-construction-v1';
const RENDERER='inspection/audralia-24057-exact/snapshot/showroom/globe/h-earth/terrain-estate-construction-v1/renderer.mjs';
const GEOGRAPHY='inspection/audralia-24057-exact/snapshot/h-earth-3d/integration/audralia.gratitude-geographic-transfer.v1.js';
const TERRAIN='inspection/audralia-24057-exact/snapshot/h-earth-3d/terrain/h-earth.terrain-field.js';
const EXPECTED=Object.freeze({
  renderer:'872d20b17bb0cd89d9613ca0262b25350890a617',
  geography:'50991dd777ccd015fd8a6d8eae7b4d02b4a8450c',
  terrain:'f4f65b05ab303a11fb1d9c4e25de211fde73722a'
});
const CANONICAL_CONTRACT='AUDRALIA_GRATITUDE_GEOGRAPHIC_TRANSFER_AUTHORITY_v1';
const REVISION=5;
const PART_COUNT=8;
const MAX_EXPANDED_PART_BYTES=1_200_000;

const bytes=file=>fs.readFileSync(rel(file));
const sha256=value=>crypto.createHash('sha256').update(value).digest('hex');
const gitBlob=value=>crypto.createHash('sha1').update(Buffer.from(`blob ${value.length}\0`)).update(value).digest('hex');
const assert=(condition,code)=>{if(!condition)throw new Error(code);};
const verifyBlob=(file,expected)=>{const value=bytes(file),actual=gitBlob(value);assert(actual===expected,`FROZEN_BLOB_MISMATCH:${file}:${actual}:${expected}`);return value;};

function serializeMesh(mesh){
  const landV=mesh.landMesh.vertices,landI=mesh.landMesh.indices,waterV=mesh.coastalWaterMesh.vertices,waterI=mesh.coastalWaterMesh.indices;
  assert(landV instanceof Float32Array&&landI instanceof Uint32Array&&waterV instanceof Float32Array&&waterI instanceof Uint32Array,'MESH_TYPED_ARRAY_CONTRACT_MISSING');
  const stats=Buffer.from(JSON.stringify({land:mesh.landMesh.statistics,water:mesh.coastalWaterMesh.statistics}),'utf8');
  const header=Buffer.alloc(32);
  header.write('AUDGMV1',0,'ascii');
  header.writeUInt32LE(1,8);
  header.writeUInt32LE(landV.length,12);
  header.writeUInt32LE(landI.length,16);
  header.writeUInt32LE(waterV.length,20);
  header.writeUInt32LE(waterI.length,24);
  header.writeUInt32LE(stats.length,28);
  const typed=a=>Buffer.from(a.buffer,a.byteOffset,a.byteLength);
  return Buffer.concat([header,typed(landV),typed(landI),typed(waterV),typed(waterI),stats]);
}

function splitEight(raw){
  const partLength=Math.ceil(raw.length/PART_COUNT);
  assert(partLength<=MAX_EXPANDED_PART_BYTES,`EXPANDED_PART_BUDGET_EXCEEDED:${partLength}`);
  const parts=[];
  for(let i=0;i<PART_COUNT;i++){
    const start=i*partLength,end=i===PART_COUNT-1?raw.length:Math.min(raw.length,(i+1)*partLength);
    assert(end>start,`EMPTY_PART:${i}`);
    parts.push(raw.subarray(start,end));
  }
  return parts;
}

const rendererBytes=verifyBlob(RENDERER,EXPECTED.renderer);
verifyBlob(GEOGRAPHY,EXPECTED.geography);
verifyBlob(TERRAIN,EXPECTED.terrain);

const geoUrl=pathToFileURL(rel(GEOGRAPHY)).href;
let source=rendererBytes.toString('utf8');
const legacyImport="../../../../h-earth-3d/integration/audralia.gratitude-geographic-transfer.v1.js";
assert(source.includes(legacyImport),'SNAPSHOT_RENDERER_GEOGRAPHY_IMPORT_NOT_FOUND');
source=source.replace(legacyImport,geoUrl);
source+='\nexport {buildGratitudeMeshes as __AUDRALIA_BUILD_CANONICAL_GRATITUDE_MESH__};\n';
const tempDir=fs.mkdtempSync(path.join(os.tmpdir(),'audralia-rev5-mesh-'));
const tempModule=path.join(tempDir,'renderer-generator.mjs');
fs.writeFileSync(tempModule,source);

try{
  const [rendererModule,geoModule]=await Promise.all([
    import(`${pathToFileURL(tempModule).href}?v=${Date.now()}`),
    import(`${geoUrl}?authority=${EXPECTED.geography}`)
  ]);
  const transfer=geoModule.AUDRALIA_GRATITUDE_GEOGRAPHIC_TRANSFER;
  const hydro=geoModule.H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_HYDROLOGY;
  assert(transfer?.contractId===CANONICAL_CONTRACT,'CANONICAL_GEOGRAPHY_CONTRACT_MISMATCH');
  assert(transfer?.revision===REVISION,'CANONICAL_GEOGRAPHY_REVISION_MISMATCH');
  assert(typeof rendererModule.__AUDRALIA_BUILD_CANONICAL_GRATITUDE_MESH__==='function','CANONICAL_MESH_BUILDER_NOT_EXPOSED');
  const mesh=rendererModule.__AUDRALIA_BUILD_CANONICAL_GRATITUDE_MESH__();
  const raw=serializeMesh(mesh);
  const rawDigest=sha256(raw);
  const wholeGzip=gzipSync(raw,{level:9,mtime:0});
  const expandedParts=splitEight(raw);
  const partRecords=[];
  fs.mkdirSync(rel(OUT),{recursive:true});
  fs.writeFileSync(rel(`${OUT}/gratitude-mesh-v1.bin.gz`),wholeGzip);
  for(let i=0;i<expandedParts.length;i++){
    const expanded=expandedParts[i],compressed=gzipSync(expanded,{level:9,mtime:0});
    const name=`gratitude-mesh-v1.part-${String(i).padStart(2,'0')}.gz`;
    fs.writeFileSync(rel(`${OUT}/${name}`),compressed);
    partRecords.push(Object.freeze({
      name,
      expandedLength:expanded.length,
      expandedSha256:sha256(expanded),
      gzipLength:compressed.length,
      gzipSha256:sha256(compressed)
    }));
  }
  const generatorBytes=fs.readFileSync(new URL(import.meta.url));
  const hydrologyIdentity=Object.freeze({
    seaLevelY:hydro?.seaLevelY??null,
    continentalDerivationLaw:hydro?.continental?.derivationLaw??null,
    riverIds:(hydro?.continental?.rivers??[]).map(r=>r.id),
    lakeIds:(hydro?.continental?.lakes??[]).map(l=>l.id)
  });
  const provenance={
    schema:'AUDRALIA_PRECOMPUTED_GEOGRAPHY_PROVENANCE_v1',
    status:'BOUND_TO_CANONICAL_AUTHORITY',
    operationId:'AUDRALIA_CANONICAL_GEOGRAPHY_REBIND_20260915_001',
    governingHead:'3c5b7ece95bb6d642e527737bb60647c032e29dd',
    generator:{
      path:'tools/audralia-canonical-geography-rebind/generate-precomputed-gratitude-mesh-v1.mjs',
      gitBlobSha:gitBlob(generatorBytes),
      sha256:sha256(generatorBytes)
    },
    rendererGeneratorSource:{path:RENDERER,gitBlobSha:EXPECTED.renderer},
    canonicalGeography:{path:GEOGRAPHY,gitBlobSha:EXPECTED.geography,contractId:CANONICAL_CONTRACT,revision:REVISION},
    canonicalTerrain:{path:TERRAIN,gitBlobSha:EXPECTED.terrain,contractId:'H_EARTH_CANONICAL_TERRAIN_FIELD_RUN_6B_v1'},
    hydrologyIdentity,
    hydrologyFingerprintSha256:sha256(Buffer.from(JSON.stringify(hydrologyIdentity))),
    mesh:{
      format:'AUDGMV1',version:1,expandedLength:raw.length,expandedSha256:rawDigest,
      wholeGzipLength:wholeGzip.length,wholeGzipSha256:sha256(wholeGzip),parts:partRecords
    },
    consumingRenderer:'showroom/globe/h-earth/terrain-estate-construction-v1/renderer.precomputed.mjs',
    invariants:{
      precomputedAssetProvenanceBound:true,
      retiredRev3Reachable:false,
      canonicalGeographyAuthorityCount:1,
      generatorMutatesSnapshot:false,
      generatorMutatesCanonicalSources:false
    }
  };
  fs.writeFileSync(rel(`${OUT}/gratitude-mesh-v1.provenance.json`),JSON.stringify(provenance,null,2)+'\n');
  process.stdout.write(JSON.stringify({result:'PASS',rawDigest,expandedBytes:raw.length,parts:partRecords.length,provenance:`${OUT}/gratitude-mesh-v1.provenance.json`},null,2)+'\n');
}finally{
  fs.rmSync(tempDir,{recursive:true,force:true});
}
