#!/usr/bin/env node
/** Gen2710: short, source-bound presentation regression test (no world rebuild). */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {selectWoodlandFineGrass} from '../../showroom/globe/h-earth/render/woodland-fine-grass.v1.js?rev=gen2710-stable-grass-beach-v1';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const sha=v=>createHash('sha256').update(v).digest('hex');
const rev='gen2710-stable-grass-beach-v1';
const moduleChain=[
 ['showroom/globe/h-earth/index.html','public-live-gpu-integration.run8e-r3e.receipt.js?v=run8e-cache-coherence-v1&cb=meadow-distribution-20261006&rev='+rev],
 ['showroom/globe/h-earth/functional-landscape/public-live-gpu-integration.run8e-r3e.receipt.js','public-live-gpu-integration.run8e-r3e.js?v=run8e-cache-coherence-v1&cb=meadow-distribution-20261006&rev='+rev],
 ['showroom/globe/h-earth/functional-landscape/public-live-gpu-integration.run8e-r3e.js','live-gpu-binding.js?v=run8e-cache-coherence-v1&cb=meadow-distribution-20261006&rev='+rev],
 ['showroom/globe/h-earth/diagnostic/run8e-r3d/live-gpu-binding.js','cp2-additive-bandlimited-relief-v2.js?cb=meadow-distribution-20261006&rev='+rev],
 ['showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js','woodland-fine-grass.v1.js?rev='+rev],
 ['showroom/globe/h-earth/render/woodland-fine-grass.v1.js','landscape-groundcover.global-v1.js?cb=gen2671-visible-three-strata-20261012&rev='+rev],
];
for(const [file,needle] of moduleChain)assert(read(file).includes(needle),'MODULE_CACHE_CHAIN_BROKEN:'+file);

const manifest=JSON.parse(read('showroom/globe/h-earth/render/assets/h-earth-canonical-base-world.v1.manifest.json'));
assert.equal(manifest.binary.sha256,'48f754ca1b11b8fe7eeb0e8d4573f6b6cb544cf438322a115eb52c44d3b29d5a','IMMUTABLE_WORLD_BINARY_IDENTITY_DRIFT');
const rendererPath='showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js';
const woodlandPath='showroom/globe/h-earth/render/woodland-fine-grass.v1.js';
const renderer=read(rendererPath),woodland=read(woodlandPath),global=read('showroom/globe/h-earth/render/landscape-groundcover.global-v1.js');
const pins={[rendererPath]:'0b083da10ea36a18547faf19cc06dad4f9e6b4c6',[woodlandPath]:'1f9bb61c244a162d3e52507b9e94da3d7efcf37b'};
for(const [p,pin] of Object.entries(pins))assert.equal(manifest.sourceBlobs[p],pin,'HISTORIC_WORLD_SOURCE_PIN_CHANGED:'+p);
assert(global.includes("m.surfaceClass==='DRY_SAND'"),'DRY_SAND_SOURCE_ROLE_MISSING');
assert(renderer.includes('if(duneStratum>.5)gl_Position=vec4(2.0,2.0,2.0,1.0)'),'DRY_SAND_DUNE_NOT_VISUALLY_EXCLUDED');
assert(renderer.includes(".replace('gl_Position=uViewProjection*vec4(vWorldPosition,1.0);'"),'MEADOW_SHADER_REPLACEMENT_BROKEN');
assert(renderer.includes("if(uMeadowGeometryPass==0)"),'MEADOW_FINE_LOD_MISSING');
assert(renderer.includes('float legacyFine=1.0-step(1.5,aParameters.w)')&&renderer.includes('vec2 narrowLocalXZ='),'GIANT_LEGACY_FAN_NOT_RETIRED');
assert(renderer.includes('vec3 tip=leaf%11==0?vec3(.094,.245,.063)'),'GOLD_LEGACY_MID_DISTANCE_PALETTE_NOT_RETIRED');
assert(woodland.includes("(types[0]===0||types[0]===3)"),'P2_LEGACY_BLADE_RETIREMENT_REMOVED');
assert(woodland.includes('c.persistentIndices')&&woodland.includes('fixedCount'),'WORLD_FIXED_UNDERLAY_NOT_IMPLEMENTED');

const tiles=[],cell=4;
for(let tz=-236;tz<=-216;tz+=cell)for(let tx=-152;tx<=-132;tx+=cell){
 const roots=[];
 for(let iz=0;iz<8;iz++)for(let ix=0;ix<8;ix++){
  const x=Math.fround(tx+.20+ix*.46),z=Math.fround(tz+.20+iz*.46),seed=(Math.imul(Math.trunc(x*1000),73856093)^Math.imul(Math.trunc(z*1000),19349663))>>>0;
  roots.push({x,y:Math.fround(-.2),z,angle:Math.fround((seed%6283)/1000),seed,triangleId:0,slope:0});
 }
 tiles.push({id:tx+':'+tz,minX:tx,minZ:tz,roots});
}
const presentation={tiles},a={x:-141.0001,z:-226},b={x:-139.9999,z:-226},away={x:-110,z:-215};
const choose=c=>selectWoodlandFineGrass(presentation,c,{maximumParents:16});
const A=choose(a),B=choose(b),C=choose(away),again=choose(a);
const keyset=s=>new Set(s.chunks.flatMap(c=>c.roots.map(r=>r.x+':'+r.z)));
const ka=keyset(A),kb=keyset(B),kc=keyset(C),retained=[...ka].filter(id=>kb.has(id)).length;
assert(A.contactCount>0&&B.contactCount>0&&C.contactCount>0,'PRESENTATION_EMPTY');
assert(A.persistentContactCount>0,'WORLD_FIXED_BASELINE_EMPTY');
assert.equal(A.persistentContactCount,B.persistentContactCount,'CAMERA_DRIFT_CHANGED_PERMANENT_UNDERLAY');
assert.equal(A.persistentContactCount,C.persistentContactCount,'DISTANCE_CHANGED_PERMANENT_UNDERLAY');
assert(retained/ka.size>=.20,'CELL_CROSSING_REMOVED_MOST_GRASS');
assert.deepEqual([...ka].sort(),[...keyset(again)].sort(),'A_B_A_WORLD_ROOT_IDENTITIES_CHANGED');
assert.equal(sha(Buffer.from(A.pixels.buffer,A.pixels.byteOffset,A.pixels.byteLength)),sha(Buffer.from(again.pixels.buffer,again.pixels.byteOffset,again.pixels.byteLength)),'A_B_A_GPU_ROOT_PIXELS_CHANGED');
assert.equal(new Set(A.chunks.flatMap(c=>c.roots.map(r=>r.seed))).size,A.contactCount,'DUPLICATE_GPU_WORLD_ROOT');
for(const x of [A,B,C]){assert(x.parentCount<=16,'WOODLAND_PARENT_BUDGET');assert(x.draws<=3,'WOODLAND_DRAW_BUDGET');assert(x.pixels.byteLength<=16*64*16,'WOODLAND_TEXTURE_BUDGET');}
const page=JSON.parse(read('.github/ai-router/publication-surfaces/h-earth.json'));
const receipt=page.checks.find(t=>t.path==='/showroom/globe/h-earth/functional-landscape/public-live-gpu-integration.run8e-r3e.receipt.js');
assert(receipt?.includes?.some(t=>t.includes('&rev='+rev)),'PUBLICATION_MANIFEST_CACHE_DRIFT');
const report={schema:'H_EARTH_GEN2710_GRASS_SAND_BEACH_PERSISTENCE_TEST_v1',result:'PASS_SOURCE_AND_SYNTHETIC_SELECTION_ONLY',revision:rev,moduleLinks:moduleChain.length,worldBinarySha256:manifest.binary.sha256,historicalWorldSourcePinsPreserved:true,syntheticRootCount:tiles.reduce((n,t)=>n+t.roots.length,0),cameraAContacts:A.contactCount,cameraBContacts:B.contactCount,persistentContacts:A.persistentContactCount,boundaryRetainedFraction:retained/ka.size,awayContacts:C.contactCount,abaSameRootIds:true,abaSameGpuPixelPayload:true,legacyGiantFanSourceRetired:true,drySandDuneTag4HiddenInShader:true,canonicalDrySandSourceRecordsPreserved:true,renderedPixelsVerified:false,ownerVisualAcceptance:'PENDING',publicationAuthorized:false};
console.log(JSON.stringify(report,null,2));
