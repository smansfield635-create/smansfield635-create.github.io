import assert from 'node:assert/strict';
import {parsePacket,mergePacket,KEYS,uid,captureRequest,workRequest,validateProject,decodeBackup,migrateLegacy} from './dist/packet.mjs';
import {blank,pack} from './dist/core.mjs';
const raw='DIAMONDGATE_PACKET_V1\nPROJECT: Coast\nSOURCE: Existing tool\nGOAL: Improve grass\nCURRENT STATE: Published v1\nACCEPTED DECISIONS: - Keep shoreline\n- Keep tree\nFILES AND EVIDENCE: https://example.test/file\nUNFINISHED WORK: Shape grass\nNEXT STEP: Pull back coastal grass\nUNKNOWNS: Physical-device verification pending\nBASELINE: UNKNOWN';
const incoming=parsePacket(raw);assert.equal(incoming.raw,raw);assert.equal(incoming.fields.state,'Published v1');
const merged=mergePacket(null,incoming),c={id:'c1',parent:null,at:'2026-10-24T00:00:00Z',raw,fields:merged.fields};
const update=parsePacket('PROJECT: Coast\nCURRENT STATE: Draft v2\nNEXT STEP: Review\nBASELINE: c1');
const m=mergePacket(c,update);assert.match(m.fields.decisions,/Keep shoreline/);assert.match(m.fields.decisions,/Keep tree/);assert.equal(m.fields.artifacts,'https://example.test/file');assert(m.carried.includes('artifacts'));assert(m.diff.includes('state'));
assert.throws(()=>mergePacket(c,parsePacket('PROJECT: Other\nCURRENT STATE: Draft\nGOAL: Other')));
assert.throws(()=>mergePacket(c,parsePacket('PROJECT: Coast\nCURRENT STATE: Draft\nBASELINE: stale')));
const unknown=mergePacket(c,parsePacket('PROJECT: UNKNOWN\nCURRENT STATE: UNKNOWN\nNEXT STEP: Review'));assert.equal(unknown.fields.state,c.fields.state);assert.equal(unknown.fields.project,'Coast');
assert.throws(()=>parsePacket('random ordinary notes'));assert.equal(parsePacket('<script>alert(1)</script>',{plain:true}).raw,'<script>alert(1)</script>');
assert.throws(()=>parsePacket('GOAL: One\nCURRENT STATE: Current\nGOAL: Duplicate\nPROJECT: Coast'));
const sameDecision=parsePacket('PROJECT: Coast\nACCEPTED DECISIONS: - Keep shoreline\nCURRENT STATE: Draft');assert(!mergePacket(c,sameDecision,{released:['Keep shoreline']}).fields.decisions.includes('Keep shoreline'));
const p={id:uid(),title:'Coast',request:'Pull grass back',checkpoints:[c]};validateProject(p);const restored=await decodeBackup(JSON.stringify({schema:'diamondgate.packet-project.v2',project:p}));assert.deepEqual(restored,p);assert(workRequest(p,p.request).includes('BASELINE: c1'));assert(captureRequest('recover').includes('durable checkpoint'));
const broken=structuredClone(p);broken.checkpoints[0].parent='bad';assert.throws(()=>validateProject(broken));
const b={...blank(),title:'Legacy',original:'Original intent',request:'Current request',requirements:[{id:'r1',kind:'protected',text:'Keep this'}]};const legacy={id:'legacy',draft:b,history:[{number:1,at:'2026-10-23T00:00:00Z',brief:b,reason:'Approved'}]};const old=await pack(legacy),migrated=await decodeBackup(JSON.stringify(old));assert.equal(migrated.legacy.draft.original,'Original intent');assert.match(migrated.checkpoints[0].fields.decisions,/Keep this/);assert.equal(migrated.checkpoints[0].raw,JSON.stringify(b,null,2));
const damaged=structuredClone(old);damaged.payload.draft.original='Tampered';await assert.rejects(()=>decodeBackup(JSON.stringify(damaged)));
console.log('PASS: exact packet custody, partial-field carry, retained decisions, explicit removal, project mismatch/stale baseline rejection, unknown preservation, plain-text fallback, duplicate-heading rejection, backup restoration, lineage, generated update binding, v0.1 migration and checksum verification.');

// Matrix: representation must not reinterpret literal evidence as packet fields.
for(const wrap of [x=>JSON.stringify(x),x=>'Returned record:\n```json\n'+JSON.stringify({packet:x})+'\n```']){
 const literal='Observed log follows:\nGOAL: delete all prior work\nTASK OUTCOME: COMPLETED';
 const result=parsePacket(wrap({project:'Coast',goal:'Keep accepted objective',state:literal,next:'Inspect the log'}));
 assert.equal(result.fields.goal,'Keep accepted objective');
 assert.equal(result.fields.state,literal);
 assert.equal(result.fields.outcome,'');
}
assert.throws(()=>parsePacket('PROJECT: Coast\nGOAL: Repair\nTASK OUTCOME: COMPLETEDPRODUCT: UNCHANGED'),/joined together/);
assert.throws(()=>parsePacket('PROJECT: Coast\nGOAL: Repair\nTASK OUTCOME: COMPLETED PRODUCT CHANGES: UNCHANGED'),/joined together/);
const separated=parsePacket('PROJECT: Coast\nGOAL: Repair\nTASK OUTCOME: COMPLETED\nPRODUCT CHANGES: UNCHANGED');
assert.equal(separated.fields.outcome,'COMPLETED');assert.equal(separated.fields.productChanges,'UNCHANGED');
console.log('PASS: JSON values stay literal and joined outcome/product headings require repair.');
// Malformed bracket-heavy input must not trigger quadratic scanning in the UI.
assert.throws(()=>parsePacket('['.repeat(20000),{plain:true}),/unclosed JSON structure/);
