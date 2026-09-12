#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';

const ROOT=process.cwd();
const rel=p=>path.join(ROOT,p);
const read=p=>fs.readFileSync(rel(p),'utf8');
const blob=p=>execFileSync('git',['hash-object',p],{cwd:ROOT,encoding:'utf8'}).trim();

const P={
  experience:'showroom/globe/h-earth/awards/living-objects/experience-cycle-a.mjs',
  world:'showroom/globe/h-earth/awards/living-objects/world-cycle-b.mjs',
  coherence:'showroom/globe/h-earth/awards/living-objects/coherence-cycle-c.mjs',
  trust:'showroom/globe/h-earth/awards/living-objects/trust-cycle-d.mjs',
  estate:'showroom/globe/h-earth/awards/living-objects/estate-cycle-e.mjs',
  shared:'showroom/globe/h-earth/awards/living-objects/shared-carousel-cycle-f.mjs',
  index:'showroom/globe/h-earth/awards/index.html',
  ledger:'showroom/globe/h-earth/awards/qualification/awards-living-object-cycle-ledger.v1.json'
};
const S=Object.fromEntries(Object.entries(P).slice(0,5).map(([k,v])=>[k,read(v)]));
const fail=[];
const ok=(name,v)=>{if(!v)fail.push(name);return!!v};
const has=(s,...xs)=>xs.every(x=>s.includes(x));

for(const[k,s]of Object.entries(S)){
  ok(`${k}.canvas`,has(s,"createElement('canvas')"));
  ok(`${k}.webgl`,s.includes("getContext('webgl2'")&&s.includes("getContext('webgl'"));
  ok(`${k}.contextOne`,/webglContexts\s*:\s*1/.test(s));
  ok(`${k}.loseContext`,s.includes('WEBGL_lose_context'));
  ok(`${k}.noContextZero`,!s.includes('webglContexts:0'));
  ok(`${k}.noGeneratedImage`,!/(data:image|new\s+Image\s*\(|<img\b)/i.test(s));
}

// Only WORLD may change in Generation 2152.
ok('experience.byteIdentity',blob(P.experience)==='3fe650a4abe2a4c2a1f93c4c1002037e80080b36');
ok('coherence.byteIdentity',blob(P.coherence)==='c759bc0a7b3ebb309aafa784e9d16e598ad5fb0b');
ok('trust.byteIdentity',blob(P.trust)==='65edf31f8c34e44ea1c1a997522c520acaec1c32');
ok('estate.byteIdentity',blob(P.estate)==='cdcd77debf24a130724a6d47f2934b212502bbf2');

ok('world.object',has(S.world,"recognizableObject:'H_EARTH_AUDRALIA_WORLD'","renderer:'WEBGL_3D_CONNECTED_TERRAIN'"));
ok('world.shorelineImport',S.world.includes("import {getHEarth3DSharedShorelineBoundary} from '/showroom/globe/h-earth/environment.js'"));
ok('world.shorelineConsumed',has(S.world,'getHEarth3DSharedShorelineBoundary()','normalizeBoundary(boundary)','shoreAt(pts,x)'));
ok('world.connectedTerrain',has(S.world,'const NX=45,NZ=31','for(let j=0;j<NZ-1;j++)for(let i=0;i<NX-1;i++)','idx.push(a,d,b,b,d,e)','connectedTerrain:true'));
ok('world.waterDepthMesh',has(S.world,'const WNX=28,WNZ=15','waterBase','z=-3.05*(1-v)+(shore-.035)*v'));
ok('world.perspectiveProjection',has(S.world,'function perspective(','function lookAt(','u_view','u_proj','perspectiveProjection:true'));
ok('world.nearMidFar',has(S.world,"depthLayers:'NEAR_MID_FAR'","cameraMode:'PERSPECTIVE_TERRAIN_FLYBY'"));
ok('world.cameraDepthMotion',has(S.world,"const eye=[-.18+drift+fly,.98+resolve*.08,-3.35+resolve*.22]","const target=[.16+fly*.28,.20,.78+resolve*.30]"));
ok('world.noOldTrianglePeakRow',!S.world.includes('for(let i=0;i<9;i++){const x=-1.58')&&!S.world.includes("T(m,[x-.30,.18,z]"));
ok('world.noFlatBandBuilder',!S.world.includes('back0=[x0,.28+.12*Math.sin')&&!S.world.includes('Q(m,[-2.2,-.08,-1.45]'));

const ledger=JSON.parse(read(P.ledger));
ok('ledger.gen2152',ledger?.worldVisualCorrective?.lockGeneration===2152);
ok('ledger.operation',ledger?.worldVisualCorrective?.operationId==='AWARDS_WORLD_TRUE_3D_VISUAL_CORRECTIVE_20260912_001_REBIND_001');
ok('ledger.connectedTerrain',ledger?.worldVisualCorrective?.connectedTerrainRequired===true);
ok('ledger.perspective',ledger?.worldVisualCorrective?.perspectiveCameraRequired===true);
ok('ledger.no2dRead',ledger?.worldVisualCorrective?.twoDimensionalCanvasIllustrationReadForbidden===true);
ok('ledger.browserEvidence',ledger?.worldVisualCorrective?.browserRenderedMobileEvidenceRequired===true);
ok('ledger.builderCannotVisualPass',ledger?.worldVisualCorrective?.builderMaySelfDeclareVisualPass===false);
ok('ledger.nonWorldFrozen',ledger?.invariants?.experienceByteIdentical===true&&ledger?.invariants?.coherenceByteIdentical===true&&ledger?.invariants?.trustByteIdentical===true&&ledger?.invariants?.estateByteIdentical===true);
ok('ledger.contextOne',ledger?.worldVisualCorrective?.webglContextsPerActiveObject===1);
ok('ledger.noGeneratedImages',ledger?.worldVisualCorrective?.generatedImageAssetsIntroduced===false);

ok('shared.blobIdentity',blob(P.shared)==='eed0c1782cb258d03e4eb740b86d95e6ed9fd2dc');
ok('index.blobIdentity',blob(P.index)==='1e7317a6543e21a74ceaba208d027bc6ff79267a');

const forbidden=[...Object.values(S)].join('\n');
ok('global.noGeneratedImages',!/(data:image|new\s+Image\s*\(|<img\b)/i.test(forbidden));

const receipt={
  schema:'AWARDS_WORLD_TRUE_3D_VISUAL_QUALIFICATION_RECEIPT_v1',
  operationId:'AWARDS_WORLD_TRUE_3D_VISUAL_CORRECTIVE_20260912_001_REBIND_001',
  lockGeneration:2152,
  governingHead:'244d232532cf7d045bcff87e708b10a2c4ab0fc1',
  result:fail.length?'FAIL_CLOSED':'PASS_STATIC_CONTRACT_BROWSER_VISUAL_STILL_REQUIRED',
  checks:{
    worldConnectedTerrain:!fail.some(x=>x.startsWith('world.connected')),
    worldPerspectiveProjection:!fail.some(x=>x.startsWith('world.perspective')),
    worldShorelineRecession:!fail.some(x=>x.startsWith('world.shoreline')),
    worldWaterDepthMesh:!fail.includes('world.waterDepthMesh'),
    oldFlatPeakBandRemoved:!fail.includes('world.noOldTrianglePeakRow'),
    nonWorldByteIdentity:!fail.some(x=>/^(experience|coherence|trust|estate)\.byteIdentity$/.test(x)),
    sharedCarouselByteIdentical:!fail.includes('shared.blobIdentity'),
    awardsIndexByteIdentical:!fail.includes('index.blobIdentity'),
    browserRenderedMobileEvidenceRequired:true,
    browserVisualPassSelfDeclared:false,
    generatedImagesIntroduced:false
  },
  failures:fail
};
console.log(JSON.stringify(receipt,null,2));
if(fail.length)process.exit(1);
