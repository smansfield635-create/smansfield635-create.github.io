import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const read=name=>fs.readFileSync(path.join(here,name),'utf8');
const sha256=text=>crypto.createHash('sha256').update(text).digest('hex');
const fail=(code,detail='')=>{throw new Error(detail?`${code}:${detail}`:code)};
const assert=(condition,code,detail='')=>{if(!condition)fail(code,detail)};
const manifestText=read('source-manifest.v1.json');
const html=read('capture-source.html');
const source=read('capture-source.mjs');
const verifier=read('verify.mjs');
const manifest=JSON.parse(manifestText);

assert(manifest.schema==='COMPASS_V2_R3_CAPTURE_SOURCE_MANIFEST_v1','MANIFEST_SCHEMA_MISMATCH');
assert(manifest.operation.operationId==='COMPASS_V2_R3_CAPTURE_SOURCE_RECONSTRUCTION_20260906_001','OPERATION_ID_MISMATCH');
assert(manifest.operation.generation===1979,'GENERATION_MISMATCH');
assert(manifest.operation.lockCommit==='c2abec4b7b30aabca349b9d4cd6a49e794b054b7','LOCK_COMMIT_MISMATCH');
assert(manifest.operation.exactGoverningHead==='24eba044e3c4943756ee2412cb81f35a440f9608','GOVERNING_HEAD_MISMATCH');
assert(manifest.operation.r1r2AuthorityBase==='f6dfa02fbb1d15ee4093d696f4ce3f6fe99a6d9c','R1_R2_BASE_MISMATCH');
assert(manifest.capture.masterDurationMs===38000,'MASTER_DURATION_MISMATCH');
assert(manifest.capture.nominalFrameRate===30&&manifest.capture.nominalFrameCount===1140,'FRAME_CONTRACT_MISMATCH');
assert(manifest.capture.timelineClock==='NONE','TIMELINE_CLOCK_NOT_DETACHED');

const expectedEvents=[
 ['S01',250,900,3500,4850],['S02',4500,5150,8550,9850],['S03',9500,10150,13550,14850],
 ['S04-A',14500,15050,16150,16850],['S04-B',16500,17050,18550,19850],['S05',19500,20150,23150,24850],
 ['S06',24500,25050,28050,29350],['S07-A',29000,29450,30550,31350],['S07-B',31000,31450,32550,33350],
 ['S07-C',33000,33450,34550,35350],['S08',35000,35400,37200,38000]
];
assert(manifest.editorialLaw.events.length===expectedEvents.length,'EVENT_COUNT_MISMATCH');
for(let i=0;i<expectedEvents.length;i++){
 const [id,textIn,imageIn,textOut,imageOut]=expectedEvents[i],event=manifest.editorialLaw.events[i];
 assert(event.id===id&&event.textIn===textIn&&event.imageIn===imageIn&&event.textOut===textOut&&event.imageOut===imageOut,'EVENT_MAP_MISMATCH',id);
 assert(textIn<imageIn&&imageIn<textOut&&textOut<imageOut,'EVENT_ORDER_FAILURE',id);
 assert(imageIn-textIn<=650,'IMAGE_RESPONSE_DELAY_FAILURE',id);
 if(i>0)assert(expectedEvents[i-1][4]-textIn===350,'CARRY_MISMATCH',`${expectedEvents[i-1][0]}->${id}`);
}

const exactAuthorities=new Map([
 ['assets/compass/compass.cosmos.js','4fe781df1a8876218c6f081b6ec88d5d2d6044c7'],
 ['assets/compass/compass.crystals.js','cd2cbad0494852cc80c51959a6827407d037b8fb'],
 ['assets/compass/compass.controller.js','568a6b2cd608a4cbcd62cf70ed59b241c39c90d2'],
 ['index.html','c7cecb616a90f7d40389c6f04cb5a5ddee5166cd'],
 ['assets/compass/compass.readiness-context-v1.js','dd6220df67cc73d57150f8fa498d0cf477298ded'],
 ['assets/shared/mirrorland-window.geometry.js','fb3ee8ab92fa4b08e7708b83780de75d1a6f8595'],
 ['assets/compass/compass.mirrorland-window.js','f99d3ffedf7b7654d067d21d9363eb287877f852'],
 ['characters/index.html','043ba9a4b8a03d182f41d665128a20b8ce1d8e4d'],
 ['characters/app.mjs','0f5bb56068bdbb47b904788f8a4853dd9e74e353'],
 ['characters/cloud-system.mjs','47482fd1c37267a2c5e76a3b833210984fe9b505'],
 ['showroom/globe/audralia/index.html','96bf20a3189182683bc94c08e2ad7c0dba740f07'],
 ['inspection/audralia-24057-exact/snapshot/showroom/globe/h-earth/terrain-estate-construction-v1/renderer.mjs','872d20b17bb0cd89d9613ca0262b25350890a617'],
 ['assets/compass/compass.hra-brain-scene.js','c26603744e55c8ede2c82944bd0fd117d04dcbdb'],
 ['assets/compass/compass.trophy-scene.js','d281e18b06128671ffe2a19e8fdb272cc5544e31'],
 ['assets/compass/compass.house-scene.js','a82e3c963a10808b9f8f1922faab45155ea4a62b'],
 ['assets/manor-blueprint/manor.estate.gothic-detail-phase3.mjs','38bc8fa60a251681cb5484926409290f66460ad0']
]);
const flattened=Object.values(manifest.sourceAuthorities).flat();
for(const [authorityPath,blob] of exactAuthorities){const entry=flattened.find(item=>item.path===authorityPath);assert(entry?.blob===blob,'SOURCE_AUTHORITY_DRIFT',authorityPath)}

assert(manifest.continuity.S05_MIRRORLAND_WINDOW_REVEALED_SUBJECT==='AUDRALIA_AUTHORITY_PACKET_A1','S05_AUDRALIA_BINDING_FAILURE');
assert(manifest.continuity.S06_FULL_FRAME_AUDRALIA==='AUDRALIA_AUTHORITY_PACKET_A1','S06_AUDRALIA_BINDING_FAILURE');
assert(manifest.continuity.worldInstanceRule==='ONE_AUDRALIA_RENDERER_INSTANCE_PERSISTS_ACROSS_S05_TO_S06','AUDRALIA_WORLD_INSTANCE_RULE_FAILURE');
assert((source.match(/createMapWideEnvironmentRenderer\(worldCanvas\)/g)||[]).length===1,'AUDRALIA_RENDERER_INSTANCE_COUNT_FAILURE');
assert(source.includes("AUDRALIA_AUTHORITY='AUDRALIA_AUTHORITY_PACKET_A1'"),'AUDRALIA_AUTHORITY_NOT_FROZEN');
assert(source.includes('DGB_MIRRORLAND_WINDOW_GEOMETRY'),'MIRRORLAND_SHARED_GEOMETRY_NOT_USED');
assert(source.includes('CompassBrainScene?.mount'),'BRAIN_DIRECT_DONOR_NOT_USED');
assert(source.includes('CompassTrophyScene?.mount'),'TROPHY_DIRECT_DONOR_NOT_USED');
assert(source.includes('CompassHouseScene?.mount'),'HOUSE_DIRECT_DONOR_NOT_USED');
assert(source.includes('function seek(ms)'),'EXPLICIT_SEEK_API_MISSING');
assert(source.includes('normalizedMs'),'TIME_CLAMP_MISSING');
assert(!source.includes('Date.now'),'WALL_CLOCK_DEPENDENCE_PRESENT');
assert(!source.includes('performance.now'),'WALL_CLOCK_DEPENDENCE_PRESENT');

for(const banned of ['pushState','replaceState','sendBeacon','gtag(','analytics.track','compass-main-orientation-final-v1.mp4']){
 assert(!html.includes(banned)&&!source.includes(banned),'LIVE_SIDE_EFFECT_OR_V1_MEDIA_REFERENCE',banned);
}
assert(html.includes('data-r3-source="detached"'),'DETACHED_ROOT_MARKER_MISSING');
assert(!html.includes('<video'),'VIDEO_PLAYER_NOT_ALLOWED_IN_R3_SOURCE');
assert(html.includes('/assets/shared/mirrorland-window.geometry.js'),'MIRRORLAND_GEOMETRY_SCRIPT_MISSING');
assert(html.includes('/assets/compass/compass.hra-brain-scene.js'),'BRAIN_DONOR_SCRIPT_MISSING');
assert(html.includes('/assets/compass/compass.trophy-scene.js'),'TROPHY_DONOR_SCRIPT_MISSING');
assert(html.includes('/assets/compass/compass.house-scene.js'),'HOUSE_DONOR_SCRIPT_MISSING');

const exactArtifactNames=['capture-source.html','capture-source.mjs','source-manifest.v1.json','verify.mjs'];
assert(manifest.artifactPaths.map(item=>path.basename(item)).join('|')===exactArtifactNames.join('|'),'ARTIFACT_ALLOWLIST_MISMATCH');
const receipt={
 schema:'COMPASS_V2_R3_CAPTURE_SOURCE_VERIFICATION_RECEIPT_v1',
 result:'PASS',
 testCommand:'COMPASS_V2_R3_CAPTURE_SOURCE_READY_V1',
 operationId:manifest.operation.operationId,
 generation:manifest.operation.generation,
 governingHead:manifest.operation.exactGoverningHead,
 masterDurationMs:manifest.capture.masterDurationMs,
 eventCount:manifest.editorialLaw.events.length,
 audraliaAuthority:'AUDRALIA_AUTHORITY_PACKET_A1',
 exactArtifactCount:4,
 sha256:{
  'capture-source.html':sha256(html),
  'capture-source.mjs':sha256(source),
  'source-manifest.v1.json':sha256(manifestText),
  'verify.mjs':sha256(verifier)
 }
};
console.log(JSON.stringify(receipt,null,2));
