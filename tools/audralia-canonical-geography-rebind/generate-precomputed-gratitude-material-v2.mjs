// Gen2826 bounded AUDGMV1 material-only rebake. Never use the historical
// generator's old governing head or its obsolete extra write paths.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import zlib from 'node:zlib';
import {execFileSync} from 'node:child_process';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {createContinentalMaterialColor} from './continental-material-v2.mjs';
import {SHA,encodeMeshes,verifyMaterialDelta,verifyGzipParts,verifyFileOutput,COUNTS} from './validate-precomputed-gratitude-material-v2.mjs';

const ROOT=path.resolve(fileURLToPath(new URL('../../',import.meta.url)));
const BRANCH='agent/audralia-gratitude-continental-material-v2-gen2826';
const ID='AUDRALIA_GRATITUDE_CONTINENTAL_MATERIAL_V2_20261019_001';
const TARGET='showroom/globe/h-earth/terrain-estate-construction-v1/';
const GEO='inspection/audralia-24057-exact/snapshot/h-earth-3d/integration/audralia.gratitude-geographic-transfer.v1.js';
const TERRAIN='inspection/audralia-24057-exact/snapshot/h-earth-3d/terrain/h-earth.terrain-field.js';
const RENDER='inspection/audralia-24057-exact/snapshot/showroom/globe/h-earth/terrain-estate-construction-v1/renderer.mjs';
const LOADER=TARGET+'precomputed-gratitude-mesh-v1.mjs';
const PROV=TARGET+'gratitude-mesh-v1.provenance.json';
const INDEX='showroom/globe/audralia/index.html';
const EXPECT=Object.freeze({
  geo:'50991dd777ccd015fd8a6d8eae7b4d02b4a8450c',
  terrain:'f4f65b05ab303a11fb1d9c4e25de211fde73722a',
  renderer:'872d20b17bb0cd89d9613ca0262b25350890a617',
  loader:'1000c4a56837f5ec8a06abfb51cdb3246780be77',
  provenance:'6bc19a1da2a78971cc1d893db3d4701fd830e97a',
  payload:'f8dd85dca58c88df5fe71fc9fd6d10d4859744d5e03322e6c8a1700afccd8569'
});
const fail=s=>{throw Error('FAIL_CLOSED_'+s)};
const abs=x=>path.join(ROOT,x),read=x=>fs.readFileSync(abs(x));
const sha1=x=>crypto.createHash('sha1').update(Buffer.from('blob '+x.length+'\0')).update(x).digest('hex');
function pinned(x,hash){const b=read(x);if(sha1(b)!==hash)fail('PINNED_GIT_BLOB_MISMATCH:'+x);return b}
function one(text,from,to,label){const i=text.indexOf(from);if(i<0||text.indexOf(from,i+from.length)>=0)fail('SOURCE_MARKER_NOT_UNIQUE:'+label);return text.slice(0,i)+to+text.slice(i+from.length)}
const oldUrl='https://cdn.jsdelivr.net/gh/smansfield635-create/smansfield635-create.github.io@519e423d21fa9e4fcbb68c65050577c4c4ab6f49/'+LOADER;
const newUrl='/'+LOADER+'?cb=GRATITUDE_MACRO_MATERIAL_V2_GEN2826';

if(process.argv.length!==2)fail('NO_CALLER_SUPPLIED_ARGUMENTS');
const branch=execFileSync('git',['branch','--show-current'],{cwd:ROOT,encoding:'utf8'}).trim();
if(branch!==BRANCH)fail('NON_ADMITTED_BRANCH:'+branch);
const baselineProv=JSON.parse(pinned(PROV,EXPECT.provenance).toString('utf8'));
const geoBytes=pinned(GEO,EXPECT.geo);
pinned(TERRAIN,EXPECT.terrain);
const rendererBytes=pinned(RENDER,EXPECT.renderer),loaderBytes=pinned(LOADER,EXPECT.loader);
if(baselineProv.mesh.payloadSha256!==EXPECT.payload||baselineProv.mesh.payloadBytes!==9169742||baselineProv.mesh.partCount!==8)fail('BASELINE_PROVENANCE_MISMATCH');
const indexBefore=read(INDEX).toString('utf8');
const indexAfter=one(indexBefore,oldUrl,newUrl,'INDEX_PRECOMPUTED_LOADER_CDN_PIN');
if(indexAfter===indexBefore)fail('INDEX_BINDING_UNCHANGED');
if(!indexAfter.includes(newUrl)||indexAfter.includes(oldUrl))fail('CANDIDATE_LOADER_URL_INVALID');

const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'gratitude-material-gen2826-'));
try{
  const geoUrl=pathToFileURL(abs(GEO)).href;
  const colorUrl=pathToFileURL(abs('tools/audralia-canonical-geography-rebind/continental-material-v2.mjs')).href;
  const importMarker="from '../../../../h-earth-3d/integration/audralia.gratitude-geographic-transfer.v1.js';";
  const buildMarker='function buildGratitudeMeshes(){';
  const sampleMarker='function sampleCanonicalGratitude(u,v){';
  const handoff='let elevation=baseElevation,color=macroColor(u,v,baseElevation,coast),local=sampleLocalSource(u,z),terrain=null;';
  let base=rendererBytes.toString('utf8');
  base=one(base,importMarker,"from '"+geoUrl+"';",'CANONICAL_GEOGRAPHY_IMPORT');
  base=one(base,buildMarker,'export '+buildMarker,'BUILD_EXPORT');
  base=one(base,sampleMarker,'export '+sampleMarker,'SAMPLE_EXPORT');
  let material="import {AUDRALIA_GRATITUDE_GEOGRAPHIC_PROVINCES} from '"+geoUrl+"';\n"+
    "import {createContinentalMaterialColor} from '"+colorUrl+"';\n"+base;
  material=one(material,sampleMarker.startsWith('function')?'export '+sampleMarker:sampleMarker,
    'const continentalMaterialColor=createContinentalMaterialColor(AUDRALIA_GRATITUDE_GEOGRAPHIC_PROVINCES,HYDRO.seaLevelY);\nexport '+sampleMarker,
    'COLOR_MODEL_BINDING');
  material=one(material,handoff,handoff+
    'if(coast.inside&&local===null&&!bar?.inside){'+
    'const materialRgb=continentalMaterialColor(u,v,baseElevation,coast);'+
    'color=mix3(color,materialRgb,smooth(72,144,coast.distance));}',
    'ELIGIBLE_MACRO_RGB_HANDOFF');
  const baseFile=path.join(tmp,'renderer.baseline.mjs'),nextFile=path.join(tmp,'renderer.material.mjs');
  fs.writeFileSync(baseFile,base);fs.writeFileSync(nextFile,material);
  const baselineModule=await import(pathToFileURL(baseFile).href);
  const candidateModule=await import(pathToFileURL(nextFile).href);
  const original=baselineModule.buildGratitudeMeshes(),candidate=candidateModule.buildGratitudeMeshes();
  const originalPayload=encodeMeshes(original),candidatePayload=encodeMeshes(candidate);
  if(SHA(originalPayload)!==EXPECT.payload||originalPayload.length!==9169742)fail('BASELINE_MESH_BYTES_NOT_REPRODUCIBLE');
  const comparison=verifyMaterialDelta(original,candidate);
  if(candidatePayload.length!==originalPayload.length)fail('PAYLOAD_RESIZED');
  let protectedSamples=0;
  for(let i=0;i<22;i++)for(let j=0;j<15;j++){
    const u=-2110+i*190,v=-2140+j*162;
    const a=baselineModule.sampleCanonicalGratitude(u,v),b=candidateModule.sampleCanonicalGratitude(u,v);
    if(a.inside!==b.inside||!Object.is(a.elevation,b.elevation))fail('SAMPLED_GEOGRAPHY_DELTA');
    if(a.terrain||!a.inside||a.bar?.inside||a.coast.distance<=72){
      if(a.color.some((value,k)=>!Object.is(value,b.color[k])))fail('PROTECTED_SOURCE_COLOR_DELTA');
      protectedSamples++;
    }
  }
  if(protectedSamples<20)fail('INSUFFICIENT_PROTECTED_SAMPLE_WITNESSES');
  const chunks=[],parts=[];
  for(let offset=0,index=0;offset<candidatePayload.length;offset+=1200000,index++){
    const expanded=candidatePayload.subarray(offset,Math.min(offset+1200000,candidatePayload.length));
    const compressed=zlib.gzipSync(expanded,{level:9,mtime:0});
    const file='gratitude-mesh-v1.part-'+String(index).padStart(2,'0')+'.gz';
    chunks.push(compressed);parts.push({index,file,expandedBytes:expanded.length,compressedBytes:compressed.length,expandedSha256:SHA(expanded),compressedSha256:SHA(compressed)});
  }
  if(chunks.length!==8)fail('PART_COUNT_NOT_EIGHT');
  const gz=zlib.gzipSync(candidatePayload,{level:9,mtime:0});
  const matBytes=read('tools/audralia-canonical-geography-rebind/continental-material-v2.mjs');
  const generatorBytes=read('tools/audralia-canonical-geography-rebind/generate-precomputed-gratitude-material-v2.mjs');
  const provenance={
    ...baselineProv,operationId:ID,
    generator:{path:'tools/audralia-canonical-geography-rebind/generate-precomputed-gratitude-material-v2.mjs',
      sha256:SHA(generatorBytes),deterministicGzipMtime:0,targetExpandedPartBytes:1200000},
    material:{model:'GRATITUDE_MACRO_MATERIAL_V2',donorEcologyGitBlob:'7bb01259f2dc4b614a77c5f9c1626ffe55115b08',
      modelSourceSha256:SHA(matBytes),eligibleLandOnly:true,colorChannels:[6,7,8],
      localHearthProtected:true,coastMinimumColorDistance:72,coastFullWeightDistance:144,
      provinceIds:baselineProv.hydrology?.provinceIds??[
        'ANCIENT_WESTERN_SHIELD','GRATITUDE_OROGEN','WESTERN_RIFT_COAST','GREAT_INTERIOR_BASIN',
        'EASTERN_GLACIAL_HIGHLANDS','SOUTHERN_DELTA_LOWLANDS','RAIN_SHADOW_STEPPE','FORESTED_WINDWARD_FOOTHILLS']},
    mesh:{...baselineProv.mesh,payloadSha256:SHA(candidatePayload),payloadBytes:candidatePayload.length,
      fullGzipBytes:gz.length,fullGzipSha256:SHA(gz),parts,partCount:8,
      landVertexLength:COUNTS.land,landIndexLength:COUNTS.indices,
      waterVertexLength:COUNTS.water,waterIndexLength:COUNTS.waterIndices,
      statisticsSha256:SHA(Buffer.from(JSON.stringify({land:candidate.landMesh.statistics,water:candidate.coastalWaterMesh.statistics})))}
  };
  verifyGzipParts(candidatePayload,chunks,provenance);
  if(!zlib.gunzipSync(gz).equals(candidatePayload))fail('FULL_GZIP_ROUNDTRIP');
  const out=abs(TARGET);
  fs.writeFileSync(path.join(out,'gratitude-mesh-v1.bin.gz'),gz);
  chunks.forEach((part,i)=>fs.writeFileSync(path.join(out,parts[i].file),part));
  fs.writeFileSync(abs(PROV),JSON.stringify(provenance,null,2)+'\n');
  fs.writeFileSync(abs(INDEX),indexAfter);
  const disk=verifyFileOutput(out,provenance);
  process.stdout.write(JSON.stringify({
    schema:'AUDRALIA_GEN2826_MATERIAL_BUILD_RECEIPT_v1',result:'GENERATED_NOT_PUBLISHED',
    branch,operationId:ID,baselineSha256:EXPECT.payload,candidateSha256:SHA(candidatePayload),
    preserve:comparison,protectedSampleWitnesses:protectedSamples,partValidation:disk,
    loaderUrl:newUrl,publication:false,ownerVisualDisposition:'PENDING'},null,2)+'\n');
}finally{fs.rmSync(tmp,{recursive:true,force:true})}
