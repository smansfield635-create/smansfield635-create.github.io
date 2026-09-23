#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root=process.cwd();
const p={
  index:'showroom/globe/h-earth/awards/index.html',
  a:'showroom/globe/h-earth/awards/living-objects/experience-cycle-a.mjs',
  b:'showroom/globe/h-earth/awards/living-objects/world-cycle-b.mjs',
  c:'showroom/globe/h-earth/awards/living-objects/coherence-cycle-c.mjs',
  d:'showroom/globe/h-earth/awards/living-objects/trust-cycle-d.mjs',
  e:'showroom/globe/h-earth/awards/living-objects/estate-cycle-e.mjs',
  f:'showroom/globe/h-earth/awards/living-objects/shared-carousel-cycle-f.mjs',
  ledger:'showroom/globe/h-earth/awards/qualification/awards-living-object-cycle-ledger.v1.json'
};
const expectedBlobs={a:'8ea491a1936ec5e5d6dbe9f31d7e73658e2a6494',b:'d0e6238befcfd06dc7abc0fce91605b85a8846d2',c:'3d1e43417d915ca81a4a4c827f65543e5b4a4ddd',d:'efa3d115080c831966b6c4d292a1ef2eb4150e4b',e:'fd1899c7c156ccffa36dfd8177e30f093e335643'};
const read=x=>fs.readFileSync(path.join(root,x),'utf8');
const gitBlobSha=text=>crypto.createHash('sha1').update(`blob ${Buffer.byteLength(text)}\0`).update(text).digest('hex');
const fail=(code,detail='')=>{throw new Error(`${code}${detail?':'+detail:''}`)};
const has=(text,literal,code)=>{if(!text.includes(literal))fail(code,literal)};

for(const key of ['a','b','c','d','e']){const actual=gitBlobSha(read(p[key]));if(actual!==expectedBlobs[key])fail('PRIOR_CYCLE_IDENTITY_DRIFT',`${key}:${actual}`)}

const index=read(p.index),f=read(p.f),ledger=JSON.parse(read(p.ledger));
if(ledger.schema!=='AWARDS_LIVING_OBJECT_CYCLE_LEDGER_v1')fail('LEDGER_SCHEMA_FAILURE');
if(ledger.operationId!=='AWARDS_LIVING_OBJECT_SHARED_CAROUSEL_CYCLE_F_20260912_001')fail('LEDGER_OPERATION_ID_FAILURE');
if(ledger.lockGeneration!==2121)fail('LEDGER_GENERATION_FAILURE');
if(ledger.governingHead!=='a7399e6c08378e59b3544f3cf6839a1abf8dd8f9')fail('LEDGER_GOVERNING_HEAD_FAILURE');
for(const k of ['A_EXPERIENCE','B_WORLD','C_COHERENCE','D_TRUST','E_ESTATE','F_SHARED_COMPOSITION'])if(ledger.cycles?.[k]?.status!=='PASS_CLOSED')fail('CYCLE_NOT_PASS_CLOSED',k);
const F=ledger.cycles.F_SHARED_COMPOSITION;
if(F.semanticBinding?.objectIdentityLost!==false)fail('OBJECT_IDENTITY_LOSS');
if(F.semanticBinding?.maxActiveLivingObjectInstances!==1||F.semanticBinding?.rearHeavyRuntime!==false||F.semanticBinding?.inactiveTeardown!==true)fail('RUNTIME_CEILING_FAILURE');
if(F.semanticBinding?.exactHashFocusRestReturn!==true||F.semanticBinding?.swipeDragTraversal!==true||F.semanticBinding?.rearCardTapToFront!==true||F.semanticBinding?.activeCardSelectToReader!==true||F.semanticBinding?.keyboardTraversal!==true)fail('TRAVERSAL_OR_RETURN_FAILURE');
if(F.semanticBinding?.reducedMotionEquivalent!==true)fail('REDUCED_MOTION_FAILURE');
if(F.semanticBinding?.bottomTrophyCarouselRedesigned!==false||ledger.invariants?.bottomTrophyCarouselMutationAuthorized!==false)fail('BOTTOM_CAROUSEL_DRIFT');
if(ledger.invariants?.deploymentPublicationAuthorized!==false)fail('AUTHORITY_WIDENING');

for(const [story,headline] of [
 ['experience','A website can behave like a place.'],
 ['world','The browser was not the window. It became the world.'],
 ['coherence','Coherence moved from idea to instrument.'],
 ['trust','Software should have to earn the right to say it worked.'],
 ['estate','The surprise is not one feature. It is that the pieces belong together.']
]){
 has(index,`data-story="${story}"`,'TOP_CAROUSEL_IDENTITY_MISSING');
 has(index,`<h3>${headline}</h3>`,'TOP_CAROUSEL_HEADLINE_DRIFT');
 has(index,`awards-achievement-${story}`,'TOP_CAROUSEL_HASH_MISSING');
}
for(const stale of ['data-story="native"','data-story="governed"','data-story="continuity"','data-story="platform"'])if(index.includes(stale))fail('LEGACY_TOP_CARD_IDENTITY_REMAINS',stale);
has(index,"import {createAwardsSharedCarouselCycleF} from './living-objects/shared-carousel-cycle-f.mjs';",'CYCLE_F_RUNTIME_NOT_BOUND');
has(index,'const living=createAwardsSharedCarouselCycleF(achievementCards,{reducedMotion:reduced});','CYCLE_F_RUNTIME_NOT_INSTANTIATED');
has(index,"readerReturn:'EXACT_ORIGIN_HASH_FOCUS_AND_RESTING_POSE'",'EXACT_RETURN_CONTRACT_MISSING');
has(index,"ArrowRight",'KEYBOARD_TRAVERSAL_MISSING');has(index,"pointermove",'SWIPE_DRAG_TRAVERSAL_MISSING');

for(const literal of [
 "import {mountExperienceLivingObject,AWARDS_EXPERIENCE_CYCLE_A_CONTRACT} from './experience-cycle-a.mjs';",
 "import {mountWorldLivingObject,AWARDS_WORLD_CYCLE_B_CONTRACT} from './world-cycle-b.mjs';",
 "import {mountCoherenceLivingObject,AWARDS_COHERENCE_CYCLE_C_CONTRACT} from './coherence-cycle-c.mjs';",
 "import {mountTrustLivingObject,AWARDS_TRUST_CYCLE_D_CONTRACT} from './trust-cycle-d.mjs';",
 "import {createAwardsEstateCycleE,AWARDS_ESTATE_CYCLE_E_CONTRACT} from './estate-cycle-e.mjs';",
 "maxActiveLivingObjectInstances:1",
 "rearHeavyRuntime:false",
 "inactiveTeardown:true",
 "paintRear(activeCard,reducedMotion)",
 "destroyActive()",
 "reducedMotionEquivalent:true",
 "bottomTrophyCarouselMutationAuthorized:false"
])has(f,literal,'SHARED_COMPOSITION_CONTRACT_FAILURE');

const trophy=index.match(/<section class="surface" id="trophy-standard"[\s\S]*?<\/section>/)?.[0]||'';
for(const literal of [
 'data-lens-key="compass"','data-lens-key="world"','data-lens-key="ip"','data-lens-key="ai"','data-lens-key="diagnostic"','data-lens-key="independent"',
 'diamond-gate-compass-mirrorland-36s.mp4','diamond-gate-h-earth-audralia-30s-vivaldi.mp4',
 'A website can behave like a place.','The browser becomes a world you can touch.','A world becomes convincing when its parts remember they belong together.','What if the intelligence belonged to the world?','Reasoning becomes more useful when you can inspect it.','The origin story is part of the evidence.'
])has(trophy,literal,'BOTTOM_TROPHY_CONTRACT_FAILURE');
if((trophy.match(/data-lens-key=/g)||[]).length!==6)fail('BOTTOM_TROPHY_CARDINALITY_DRIFT');

const receipt={schema:'CYCLE_F_QUALIFICATION_RECEIPT_v1',result:'PASS_CLOSED',operationId:ledger.operationId,lockGeneration:ledger.lockGeneration,checks:{priorCycleBlobIdentity:'PASS',fiveClosedObjects:'PASS',topCrosswalk:'PASS',sharedLifecycle:'PASS',spatialTraversal:'PASS',rearTapToFront:'PASS',activeSelectReader:'PASS',exactReturn:'PASS',oneActiveObjectCeiling:'PASS',inactiveTeardown:'PASS',keyboardTraversal:'PASS',reducedMotionEquivalent:'PASS',bottomTrophyPreserved:'PASS',objectIdentityLoss:'NONE',authorityWidening:'NONE'}};
process.stdout.write(JSON.stringify(receipt,null,2)+'\n');
