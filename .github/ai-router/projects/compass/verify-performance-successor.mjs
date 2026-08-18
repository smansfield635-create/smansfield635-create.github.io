#!/usr/bin/env node
import fs from 'node:fs';
import {spawnSync} from 'node:child_process';

const OP='COMPASS_GEN1526_VISUALS_GEN1531_RUNTIME_RECONCILIATION';
const LOCK=1531;
const GEN1531_BASE='74de0882af55fed53272a191b173e45f5cdbd551';
const RECONCILIATION_BASE='add183b9fcfc560a4c1bde311be28159b374c411';
const OUT=process.env.COMPASS_PERFORMANCE_OUTPUT||'/tmp/compass-gen1531-performance.json';
const EXPECTED_BLOBS=Object.freeze({
  'assets/compass/compass.identity-3d.js':'04df9de4b20b1420a707d25c2f2b28664a90ca65',
  'assets/compass/compass.brain-scene.js':'80553f1a689b1724f60bd8c7a65da96da592b40d',
  'assets/compass/compass.identity-3d.css':'707a5aea4f7981570452c3dd02d0d2306085acb0',
  'assets/compass/compass.crystals.js':'9fed7adbfdeec37a734fc4a125acc5f4617d50bc',
  'assets/compass/compass.mirrorland-window.js':'f99d3ffedf7b7654d067d21d9363eb287877f852'
});
const ALLOWED_RECONCILIATION_SCOPE=new Set([
  '.github/ai-router/projects/compass/verify-display-continuity.v1.mjs',
  '.github/ai-router/projects/compass/verify-performance-successor.mjs',
  '.github/workflows/compass-carousel-successor-live-qualification.yml',
  '.github/workflows/compass-display-continuity-validation.yml',
  '.github/workflows/compass-live-byte-verification.yml',
  '.github/workflows/compass-reconcile-gen1526-visuals.yml',
  'assets/compass/compass.brain-scene.js',
  'assets/compass/compass.identity-3d.css',
  'assets/compass/compass.identity-3d.js',
  'index.html'
]);
const git=args=>spawnSync('git',args,{encoding:'utf8'});
const read=p=>fs.readFileSync(p,'utf8');
const checks=[];
const check=(id,pass,evidence)=>checks.push({id,pass:Boolean(pass),evidence});
const blobAt=(ref,path)=>git(['rev-parse',`${ref}:${path}`]).stdout.trim();

const head=git(['rev-parse','HEAD^{commit}']).stdout.trim();
const expected=(process.env.COMPASS_CANDIDATE_HEAD||head).trim();
check('EXACT_HEAD',head===expected,{head,expected});
check('GEN1531_BASE_ANCESTOR',git(['merge-base','--is-ancestor',GEN1531_BASE,head]).status===0,{base:GEN1531_BASE,head});
check('RECONCILIATION_BASE_ANCESTOR',git(['merge-base','--is-ancestor',RECONCILIATION_BASE,head]).status===0,{base:RECONCILIATION_BASE,head});

const changed=git(['diff','--name-only',`${RECONCILIATION_BASE}...${head}`]).stdout.trim().split(/\r?\n/).filter(Boolean);
check('EXACT_RECONCILIATION_SCOPE',changed.length>0&&changed.every(p=>ALLOWED_RECONCILIATION_SCOPE.has(p)),changed);
for(const [path,expectedBlob] of Object.entries(EXPECTED_BLOBS)){
  const actualBlob=blobAt(head,path);
  check(`EXACT_RECONCILED_BLOB_${path.split('/').pop().replace(/\W/g,'_').toUpperCase()}`,actualBlob===expectedBlob,{path,expectedBlob,actualBlob});
}
for(const path of ['assets/compass/upstream-compass.renderer.js','assets/compass/compass.controller.js']){
  check(`GEN1531_BYTE_PRESERVED_${path.split('/').pop().replace(/\W/g,'_').toUpperCase()}`,git(['diff','--quiet',GEN1531_BASE,head,'--',path]).status===0,path);
}

const m=read('assets/compass/compass.mirrorland-window.js');
const c=read('assets/compass/compass.crystals.js');
const identity=read('assets/compass/compass.identity-3d.js');
const brain=read('assets/compass/compass.brain-scene.js');
check('MIRRORLAND_DEMAND_DRIVEN',m.includes('function transitionNeedsFrames()')&&m.includes('function requestRender()')&&m.includes('if (transitionNeedsFrames())')&&m.includes('DGB_MIRRORLAND_WINDOW_REVEAL_REQUEST')&&m.includes('DGB_MIRRORLAND_WINDOW_WITHDRAW_REQUEST'),'reveal/withdraw only continuous scheduling');
check('MIRRORLAND_IDENTITY_PRESERVED',m.includes('SELF_CONTAINED_2D_CRYSTALLINE_STAINED_GLASS')&&m.includes('paneCount')&&m.includes('MIRRORLAND_WINDOW_REVEAL_COMPLETE')&&m.includes('MIRRORLAND_WINDOW_WITHDRAWAL_COMPLETE'),'stained glass + lifecycle');
check('CRYSTAL_DEMAND_DRIVEN',c.includes('function needsAnotherFrame()')&&c.includes('function requestRender()')&&c.includes('function bindRenderInvalidation()')&&c.includes('MutationObserver')&&c.includes('SETTLE_EPSILON'),'interaction/convergence/invalidation scheduling');
check('CRYSTAL_TOPOLOGY_PRESERVED',c.includes('registryCardinalCount')&&c.includes('registryRoomCount')&&c.includes('sphericalConstellationEnabled'),'cardinal/room semantic renderer retained');
check('NO_PERPETUAL_MIRRORLAND_CONTINUATION',!m.includes('drawWindow();\n\n    requestRender();\n  }'),'no unconditional mirror continuation');
check('NO_PERPETUAL_CRYSTAL_CONTINUATION',!c.includes('emitReceipt({\n      status:\n        "available"')||c.includes('if (needsAnotherFrame())'),'crystal continuation gated');
check('CANONICAL_SCOUTCRAFT_PRESENT',identity.includes('DGB_SCOUTCRAFT_01'),'Gen1526 canonical spacecraft retained');
check('INTEGRATED_BRAINSTEM_PRESENT',['midbrain','pons','medulla'].every(x=>brain.includes(x)),'Gen1526 continuous brainstem retained');
check('SINGLE_INTEGRATED_CEREBELLUM',brain.includes('cerebellum')&&!brain.includes('cerebellum-left')&&!brain.includes('cerebellum-right'),'single integrated cerebellum retained');

const failures=checks.filter(x=>!x.pass);
const receipt={schema:'COMPASS_GEN1526_VISUALS_GEN1531_PERFORMANCE_RECONCILIATION_RECEIPT_v1',operationId:OP,lockGeneration:LOCK,governingHead:GEN1531_BASE,reconciliationBase:RECONCILIATION_BASE,candidateHead:head,result:failures.length?'FAIL_CLOSED':'PASS_CLOSED',checks,failures:failures.map(x=>x.id)};
fs.writeFileSync(OUT,JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify(receipt,null,2));
if(failures.length)process.exit(1);
