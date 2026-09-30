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
const S=Object.fromEntries(Object.entries(P).slice(0,6).map(([k,v])=>[k,read(v)]));
const fail=[];
const ok=(name,v)=>{if(!v)fail.push(name);return!!v};
const has=(s,...xs)=>xs.every(x=>s.includes(x));

for(const[k,s] of Object.entries(S).filter(([k])=>k!=='shared')){
  ok(`${k}.canvas`,has(s,"createElement('canvas')"));
  ok(`${k}.webgl`,s.includes("getContext('webgl2'")&&s.includes("getContext('webgl'"));
  ok(`${k}.contextOne`,/webglContexts\s*:\s*1/.test(s));
  ok(`${k}.loseContext`,s.includes('WEBGL_lose_context'));
  ok(`${k}.noGeneratedImage`,!/(data:image|new\s+Image\s*\(|<img\b)/i.test(s));
}

ok('experience.referenceBlob',blob(P.experience)==='3fe650a4abe2a4c2a1f93c4c1002037e80080b36');
ok('experience.identity',has(S.experience,"recognizableObject:'MIRRORLAND_WINDOW'","paneCount:21","OPAQUE_CATHEDRAL_GLASS_TO_CLEAR_AUDRALIA_TO_OPAQUE"));

ok('world.identity',has(S.world,"recognizableObject:'H_EARTH_AUDRALIA_WORLD'","renderer:'WEBGL_3D_CONNECTED_TERRAIN'"));
ok('world.sourceFidelity',has(S.world,"getHEarth3DSharedShorelineBoundary","connectedTerrain:true","shorelineRecession:true","depthLayers:'NEAR_MID_FAR'"));
ok('world.perspective',has(S.world,"cameraMode:'PERSPECTIVE_TERRAIN_FLYBY'","fovDegrees:46","targetFrameOccupancy:.86"));

ok('coherence.identity',has(S.coherence,"recognizableObject:'BRAIN'","renderer:'WEBGL_3D_QUALIFIED_GLB'"));
ok('coherence.exactAsset',S.coherence.includes('https://ccf-ontology.hubmapconsortium.org/objects/v1.2/Allen_M_Brain.glb'));
ok('coherence.geometryFrozen',has(S.coherence,"meshes:283","triangles:656268","vertexMutation:'FORBIDDEN'","topologyMutation:'FORBIDDEN'","componentRemodeling:'FORBIDDEN'"));
ok('coherence.dominantComposition',has(S.coherence,"targetFrameOccupancy:.92","hostShape:'COMPACT_ANATOMICAL_FIELD'","gl.uniform1f(U.zoom,1.36"));

ok('trust.identity',has(S.trust,"recognizableObject:'NINE_SUMMITS'","summitCount:9","distinctSummitCount:9"));
ok('trust.nineCenters',has(S.trust,'const SUMMITS=Object.freeze([','SUMMITS.length'));
ok('trust.connectedButSeparated',has(S.trust,'ONE_CONNECTED_RANGE_WITH_NINE_VISUALLY_SEPARABLE_SUMMIT_EVENTS','const crown=a*.52','dx*dx/.050','dz*dz/.070'));
ok('trust.panorama',has(S.trust,"cameraDistance:2.72","targetFrameOccupancy:.90","hostShape:'PANORAMIC_MOUNTAIN_RANGE'"));

ok('estate.identity',has(S.estate,"recognizableObject:'HOUSE_MANOR'","renderer:'WEBGL_3D_DONOR_MESH'"));
ok('estate.donorSources',has(S.estate,"buildNeutralMesh","buildPhase1DetailMesh","ARCHITECTURAL_CORE_IDS"));
ok('estate.roofLaw',has(S.estate,"roofStampedWindows:false","GOTHIC_PHASE1_RULES.roofStampedWindows!==false"));
ok('estate.facadeLedComposition',has(S.estate,"cameraMode:'FRONTAL_THREE_QUARTER_ARCHITECTURAL'","cameraDistance:2.78","targetFrameOccupancy:.90","hostShape:'ARCHITECTURAL_THREE_QUARTER_FIELD'","gl.uniform1f(up,-.11)","gl.uniform1f(uy,-.38"));

ok('shared.noCommonCage',has(S.shared,"sharedCircleForbidden:true","objectSpecificFootprints:true","integrationMayNotDegradeStandaloneRecognition:true","[data-living-host]::before{display:none!important"));
for(const story of ['experience','world','coherence','trust','estate'])ok(`shared.profile.${story}`,S.shared.includes(`[data-living-host][data-story-kind=\\"${story}\\"]`)||S.shared.includes(`[data-living-host][data-story-kind="${story}"]`));
ok('shared.oneHeavyRuntime',has(S.shared,'maxActiveLivingObjectInstances:1','rearHeavyRuntime:false','inactiveTeardown:true'));
ok('shared.order',has(S.shared,"const expected=['experience','world','coherence','trust','estate']"));

const ledger=JSON.parse(read(P.ledger));
ok('ledger.operation',ledger?.operationId==='AWARDS_RECOGNITION_FIRST_RECOVERY_20260912_001'&&ledger?.lockGeneration===2164);
ok('ledger.semanticReviewRequired',ledger?.recognitionRecovery?.semanticRecognitionStatus==='REVIEW_REQUIRED');
ok('ledger.sharedHostDefectRecorded',ledger?.recognitionRecovery?.disprovenAssumption==='COMMON_SQUARE_CIRCLE_HOST_PRESERVES_RECOGNITION');
ok('ledger.oneHeavyRuntime',ledger?.recognitionRecovery?.maxActiveLivingObjectInstances===1&&ledger?.recognitionRecovery?.inactiveTeardown===true);
ok('ledger.noGeneratedImages',ledger?.recognitionRecovery?.generatedImageAssetsIntroduced===false);
ok('index.preserved',blob(P.index)==='1e7317a6543e21a74ceaba208d027bc6ff79267a');

const receipt={
  schema:'AWARDS_RECOGNITION_FIRST_MECHANICAL_QUALIFICATION_RECEIPT_v1',
  operationId:'AWARDS_RECOGNITION_FIRST_RECOVERY_20260912_001',
  lockGeneration:2164,
  result:fail.length?'FAIL_CLOSED':'PASS_CLOSED',
  semanticRecognitionStatus:'REVIEW_REQUIRED',
  recognitionAuthority:'RENDERED_PIXELS_AND_OWNER_VISUAL_REVIEW_NOT_SOURCE_STRINGS',
  checks:{
    frozenObjectCrosswalkPreserved:!fail.some(x=>/identity|referenceBlob/.test(x)),
    sourceFidelityPreserved:!fail.some(x=>/sourceFidelity|exactAsset|geometryFrozen|donorSources|roofLaw/.test(x)),
    commonCircleHostRemoved:!fail.includes('shared.noCommonCage'),
    objectSpecificFootprintsPresent:!fail.some(x=>x.startsWith('shared.profile.')),
    oneActiveHeavyRuntime:!fail.includes('shared.oneHeavyRuntime'),
    generatedImagesIntroduced:false,
    awardsIndexPreserved:!fail.includes('index.preserved'),
    semanticRecognitionClaimedByThisVerifier:false
  },
  failures:fail
};
console.log(JSON.stringify(receipt,null,2));
if(fail.length)process.exit(1);
