import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import {integrateFourSpaceDisplay,validateApprovedData,QUALIFIED_FILES} from './public-safe-four-space-display.v1.mjs';
const root=path.dirname(new URL(import.meta.url).pathname);
const hex=s=>crypto.createHash('sha256').update(s).digest('hex');
const fixture=()=>({schema:'DGB_OPERATIONS_CHAMBER_DASHBOARD_DATA_v1',observedAt:'2026-10-14T21:59:10Z',commandsEnabled:false,projects:[],repositories:[],instruments:{records:[]},study:{status:'AVAILABLE',cutoff:'2026-08-25T18:25:55Z'},rollingStudySummary:{schema:'DGB_CHAMBER_PUBLIC_SAFE_AGGREGATE_v1',capturedAt:'2026-10-14T21:58:00Z',savedThrough:'2026-10-14T21:57:00Z',metrics:{classified:1707,unresolved:0,reviews:390,auditFlags:4}}});
async function setup(mutator){let dir=await fs.mkdtemp(path.join(os.tmpdir(),'chamber-four-space-'));let d=fixture();if(mutator)mutator(d);await fs.writeFile(path.join(dir,'data.json'),JSON.stringify(d));await fs.writeFile(path.join(dir,'.nojekyll'),'');await fs.writeFile(path.join(dir,'index.html'),'<div id="rolling-summary"></div>');await fs.writeFile(path.join(dir,'dashboard.mjs'),'const rollingStudySummary=true;');return dir;}
async function cleanup(dir){await fs.rm(dir,{recursive:true,force:true})}
test('source identities are pinned',async()=>{for(const [name,value] of Object.entries(QUALIFIED_FILES))assert.equal(hex(await fs.readFile(path.join(root,'four-space',name))),value)});
test('positive integration preserves the saved JSON byte-for-byte and only replaces UI',async()=>{const dir=await setup();try{const before=await fs.readFile(path.join(dir,'data.json'));const r=await integrateFourSpaceDisplay({siteDir:dir});assert.equal(r.result,'FOUR_SPACE_PRESENTATION_PREPARED_NOT_PUBLISHED');assert.equal(r.classified,1707);assert.deepEqual(await fs.readFile(path.join(dir,'data.json')),before);assert.equal((await fs.readFile(path.join(dir,'index.html'),'utf8')).match(/class="space-portal /g).length,4);assert.equal((await fs.readdir(dir)).sort().join(','),['.nojekyll','dashboard.mjs','data.json','index.html'].sort().join(','));}finally{await cleanup(dir)}});
test('missing rolling source fails closed without changing original files',async()=>{const dir=await setup(d=>delete d.rollingStudySummary);try{await assert.rejects(()=>integrateFourSpaceDisplay({siteDir:dir}),/VERIFIED_ROLLING_AGGREGATE_MISSING_OR_INVALID/);assert.equal(await fs.readFile(path.join(dir,'index.html'),'utf8'),'<div id="rolling-summary"></div>')}finally{await cleanup(dir)}});
test('unexpected aggregate fields are rejected',()=>{const d=fixture();d.rollingStudySummary.secrets='NOT_APPROVED';assert.throws(()=>validateApprovedData(d),/VERIFIED_ROLLING_AGGREGATE_MISSING_OR_INVALID/)});
test('contradictory classifications are rejected',()=>{const d=fixture();d.rollingStudySummary.metrics.unresolved=1708;assert.throws(()=>validateApprovedData(d),/VERIFIED_ROLLING_AGGREGATE_MISSING_OR_INVALID/)});
test('future saved study versus captured time is rejected',()=>{const d=fixture();d.rollingStudySummary.savedThrough='2026-10-14T23:57:00Z';assert.throws(()=>validateApprovedData(d),/ROLLING_AGGREGATE_TIME_CONTRADICTION/)});
test('unexpected output file blocks publication integration',async()=>{const dir=await setup();try{await fs.writeFile(path.join(dir,'secret.key'),'private');await assert.rejects(()=>integrateFourSpaceDisplay({siteDir:dir}),/EXISTING_PUBLISHER_FILE_ALLOWLIST_MISMATCH/)}finally{await cleanup(dir)}});
test('requires the previously qualified rolling adapter before replacing UI',async()=>{const dir=await setup();try{await fs.writeFile(path.join(dir,'dashboard.mjs'),'old source');await assert.rejects(()=>integrateFourSpaceDisplay({siteDir:dir}),/QUALIFIED_PRIOR_ADAPTER_NOT_PRESENT/)}finally{await cleanup(dir)}});
test('refuses tampered new presentation identity before output mutation',async()=>{const dir=await setup(),temp=await fs.mkdtemp(path.join(os.tmpdir(),'chamber-tampered-'));try{for(const name of Object.keys(QUALIFIED_FILES))await fs.copyFile(path.join(root,'four-space',name),path.join(temp,name));await fs.appendFile(path.join(temp,'dashboard.mjs'),'// tamper');await assert.rejects(()=>integrateFourSpaceDisplay({siteDir:dir,templateDir:temp}),/QUALIFIED_FOUR_SPACE_TEMPLATE_MISMATCH/);assert.equal(await fs.readFile(path.join(dir,'dashboard.mjs'),'utf8'),'const rollingStudySummary=true;')}finally{await cleanup(dir);await cleanup(temp)}});

test('continuous classification stays current while historical records remain accessible',async()=>{
 const html=await fs.readFile(path.join(root,'four-space','index.html'),'utf8');
 assert.match(html,/Current classification/);
 assert.match(html,/Classification continues/);
 assert.match(html,/id="rolling-summary"/);
 assert.match(html,/id="archive-dialog"/);
 assert.doesNotMatch(html,/The production study ends August 25/);
 assert.doesNotMatch(html,/September and October are not measured here/);
});
