#!/usr/bin/env node
import fs from 'node:fs';
import {spawnSync} from 'node:child_process';

const OP='COMPASS_GEN1526_VISUALS_GEN1531_RUNTIME_RECONCILIATION';
const LOCK=1531;
const BASE='74de0882af55fed53272a191b173e45f5cdbd551';
const OUT=process.env.COMPASS_VERIFICATION_OUTPUT||'/tmp/compass-gen1531-display.json';
const EXPECTED_BLOBS=Object.freeze({
  'assets/compass/compass.identity-3d.js':'04df9de4b20b1420a707d25c2f2b28664a90ca65',
  'assets/compass/compass.brain-scene.js':'80553f1a689b1724f60bd8c7a65da96da592b40d',
  'assets/compass/compass.crystals.js':'9fed7adbfdeec37a734fc4a125acc5f4617d50bc',
  'assets/compass/compass.mirrorland-window.js':'f99d3ffedf7b7654d067d21d9363eb287877f852'
});
const PRESERVED_FROM_BASE=Object.freeze([
  'assets/compass/upstream-compass.renderer.js',
  'assets/compass/compass.controller.js',
  'assets/compass/compass.capability-carousel.js'
]);
const git=args=>spawnSync('git',args,{encoding:'utf8'});
const read=p=>fs.readFileSync(p,'utf8');
const checks=[];
const check=(id,pass,evidence)=>checks.push({id,pass:Boolean(pass),evidence});
const blobAt=(ref,path)=>git(['rev-parse',`${ref}:${path}`]).stdout.trim();

const head=git(['rev-parse','HEAD^{commit}']).stdout.trim();
const expected=(process.env.COMPASS_CANDIDATE_HEAD||head).trim();
check('EXACT_HEAD',head===expected,{head,expected});
check('GEN1531_BASE_ANCESTOR',git(['merge-base','--is-ancestor',BASE,head]).status===0,{base:BASE,head});

for(const [path,expectedBlob] of Object.entries(EXPECTED_BLOBS)){
  const actualBlob=blobAt(head,path);
  check(`EXACT_RECONCILED_BLOB_${path.split('/').pop().replace(/\W/g,'_').toUpperCase()}`,actualBlob===expectedBlob,{path,expectedBlob,actualBlob});
}
for(const path of PRESERVED_FROM_BASE){
  check(`BYTE_PRESERVED_${path.split('/').pop().replace(/\W/g,'_').toUpperCase()}`,git(['diff','--quiet',BASE,head,'--',path]).status===0,path);
}

const html=read('index.html');
const m=read('assets/compass/compass.mirrorland-window.js');
const c=read('assets/compass/compass.crystals.js');
const identity=read('assets/compass/compass.identity-3d.js');
const brain=read('assets/compass/compass.brain-scene.js');
check('FOUR_CARDINALS',(html.match(/data-cardinal-id="(north|east|south|west)"/g)||[]).length===4,'4');
check('NINETEEN_ROOMS',(html.match(/data-compass-room data-compass-destination/g)||[]).length===19,'19');
check('MIRRORLAND_ROUTES',['Enter the Narrative','Enter the Demo','See the World Map','Return to Compass'].every(x=>html.includes(x)),'routes');
check('MIRRORLAND_STATE_MEANING',['MIRRORLAND_REVEALING','MIRRORLAND_FOCUSED','MIRRORLAND_WITHDRAWING','MIRRORLAND_WINDOW_REVEAL_COMPLETE','MIRRORLAND_WINDOW_WITHDRAWAL_COMPLETE'].every(x=>m.includes(x)),'state meaning preserved');
check('MIRRORLAND_GEOMETRY_PRESENT',m.includes('function buildPanes()')&&m.includes('createPane(')&&m.includes('paneCount'),'stained-glass geometry retained');
check('CRYSTAL_INTERACTION_PRESENT',c.includes('bindPointerBridge')&&c.includes('bindSemanticFocusBridge')&&c.includes('gestureActive'),'gesture/focus bridges retained');
check('CANONICAL_SCOUTCRAFT_PRESENT',identity.includes('DGB_SCOUTCRAFT_01'),'Gen1526 Laws-derived spacecraft identity present');
check('INTEGRATED_BRAINSTEM_PRESENT',['midbrain','pons','medulla'].every(x=>brain.includes(x)),'continuous Gen1526 brainstem components present');
check('SINGLE_INTEGRATED_CEREBELLUM',brain.includes('cerebellum')&&!brain.includes('cerebellum-left')&&!brain.includes('cerebellum-right'),'single integrated cerebellum retained');

const perf=spawnSync(process.execPath,['.github/ai-router/projects/compass/verify-performance-successor.mjs'],{encoding:'utf8',env:{...process.env,COMPASS_CANDIDATE_HEAD:head}});
check('STATIC_PERFORMANCE_PASS',perf.status===0,{status:perf.status,stderr:(perf.stderr||'').slice(-500)});

const failures=checks.filter(x=>!x.pass);
const receipt={schema:'COMPASS_GEN1526_VISUALS_GEN1531_RECONCILIATION_RECEIPT_v1',operationId:OP,lockGeneration:LOCK,governingHead:BASE,candidateHead:head,expectedBlobs:EXPECTED_BLOBS,result:failures.length?'FAIL_CLOSED':'PASS_CLOSED',checks,failures:failures.map(x=>x.id)};
fs.writeFileSync(OUT,JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify(receipt,null,2));
if(failures.length)process.exit(1);
