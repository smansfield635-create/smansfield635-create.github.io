#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const root = process.cwd();
const read = p => fs.readFileSync(path.join(root,p),'utf8');
const exists = p => fs.existsSync(path.join(root,p));
const args = process.argv.slice(2);
const cycleArg = args.indexOf('--cycle');
const cycle = cycleArg >= 0 ? String(args[cycleArg+1]||'').toUpperCase() : null;
const all = args.includes('--all-cycles-self-test');

const P = Object.freeze({
  experience:'showroom/globe/h-earth/awards/living-objects/experience-cycle-a.mjs',
  world:'showroom/globe/h-earth/awards/living-objects/world-cycle-b.mjs',
  coherence:'showroom/globe/h-earth/awards/living-objects/coherence-cycle-c.mjs',
  trust:'showroom/globe/h-earth/awards/living-objects/trust-cycle-d.mjs',
  estate:'showroom/globe/h-earth/awards/living-objects/estate-cycle-e.mjs',
  shared:'showroom/globe/h-earth/awards/living-objects/shared-cycle-f.mjs',
  css:'showroom/globe/h-earth/awards/living-objects/living-objects.v1.css',
  ledger:'showroom/globe/h-earth/awards/qualification/awards-living-object-cycle-ledger.v1.json'
});

function pass(payload){ console.log(JSON.stringify({result:'PASS', verifier:'AWARDS_LIVING_OBJECT_VERIFIER_v1', ...payload},null,2)); }
function fail(code, detail){ console.error(JSON.stringify({result:'FAIL_CLOSED', verifier:'AWARDS_LIVING_OBJECT_VERIFIER_v1', errorCode:code, detail},null,2)); process.exit(1); }
function requireText(text, tokens, label){ for(const token of tokens) assert.ok(text.includes(token), `${label} missing ${token}`); }

function verifyA(){
  assert.ok(exists(P.experience),'Cycle A object missing');
  assert.ok(exists(P.css),'shared living object CSS missing');
  assert.ok(exists(P.ledger),'cycle ledger missing');
  const js=read(P.experience), css=read(P.css), ledger=JSON.parse(read(P.ledger));
  requireText(js,[
    'AWARDS_EXPERIENCE_LIVING_OBJECT_CYCLE_A_V1',
    'A_EXPERIENCE',
    'A website can behave like a place.',
    '568a6b2cd608a4cbcd62cf70ed59b241c39c90d2',
    'fe35d8d844859a6af810684ace53d2c65258522f',
    '965376dd8a92686bc7008d1fea4846b5f8300872',
    'f99d3ffedf7b7654d067d21d9363eb287877f852',
    'FOUR_CARDINAL_SPHERICAL_CONSTELLATION',
    'CARDINAL_FOCUS_TO_ROOM_CLUSTER',
    'ROOM_SELECTION',
    'MIRRORLAND_REVEAL_AND_FOCUS',
    'EXACT_RESTORATION',
    "['REAR_INERT','APPROACHING','FOREGROUND_REST','SIGNATURE_PLAY','FOREGROUND_IDLE','SELECT_RESPONSE','READER_OPEN','RETURN_RESTORING']",
    'mountExperienceLivingObject',
    'webglContexts:0',
    "phase('orient')",
    "phase('cluster')",
    "phase('select')",
    "phase('threshold')",
    "phase('travel')",
    "phase('restore')"
  ],'Cycle A JS');
  requireText(css,[
    '.awards-lo--experience',
    'perspective:760px',
    'transform-style:preserve-3d',
    '.exp-field',
    '.exp-node',
    '.exp-cluster',
    '.exp-threshold',
    '[data-exp-phase="travel"]',
    '[data-exp-phase="equivalent"]',
    '@media(max-width:760px)',
    '@media(prefers-reduced-motion:reduce)'
  ],'Cycle A CSS');
  assert.equal(ledger.operationId,'AWARDS_TOP_CAROUSEL_LIVING_OBJECT_SUCCESSOR_20260911_001');
  assert.equal(ledger.lockGeneration,2102);
  assert.ok(['CANDIDATE_FROZEN_AWAITING_FRESH_QUALIFICATION','PASS_CLOSED'].includes(ledger.cycles.A_EXPERIENCE.status));
  for(const id of ['B_WORLD','C_COHERENCE','D_TRUST','E_ESTATE','F_SHARED_COMPOSITION']) assert.equal(ledger.cycles[id].status,'NOT_STARTED');
  assert.equal(ledger.invariants.canonicalIntakeCount,1);
  assert.equal(ledger.invariants.bottomTrophyCarouselMutationAuthorized,false);
  return {cycle:'A_EXPERIENCE', static3d:true, webglContextsExpected:0, laterCyclesUntouched:true};
}

try{
  if(cycle==='A'){ pass(verifyA()); process.exit(0); }
  if(all){
    const a=verifyA();
    const ledger=JSON.parse(read(P.ledger));
    const required=['A_EXPERIENCE','B_WORLD','C_COHERENCE','D_TRUST','E_ESTATE','F_SHARED_COMPOSITION'];
    for(const id of required) assert.equal(ledger.cycles[id]?.status,'PASS_CLOSED',`${id} not PASS_CLOSED`);
    for(const p of [P.experience,P.world,P.coherence,P.trust,P.estate,P.shared,P.css,P.ledger]) assert.ok(exists(p),`missing terminal artifact ${p}`);
    pass({mode:'ALL_CYCLES_SELF_TEST', cycles:required, cycleA:a});
    process.exit(0);
  }
  fail('USAGE','Use --cycle A or --all-cycles-self-test');
}catch(error){ fail('QUALIFICATION_ASSERTION_FAILED',error?.message||String(error)); }
