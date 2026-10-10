#!/usr/bin/env node
// Gen2636: controlled source and real terrain-supported navigation verification.
// Static/Node verification is NOT a browser visual or physical-device performance PASS.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const root=process.cwd();
const read=(p)=>fs.readFileSync(path.resolve(root,p),'utf8');
const nav=await import(pathToFileURL(path.resolve(root,'showroom/globe/h-earth/functional-landscape/navigation.js')).href);
const normal=nav.createHEarthFunctionalLandscapeNavigationState();
const explicit=nav.createHEarthFunctionalLandscapeNavigationState({waypointId:'WOODLAND_CLEARING_FOUR_TREES'});
assert.equal(normal.ok,true,'COAST_NAVIGATION_MUST_REMAIN_VALID');
assert.deepEqual({x:normal.state.position.x,z:normal.state.position.z},{x:0,z:-96},'COAST_DEFAULT_IDENTITY_CHANGED');
assert.equal(explicit.ok,true,'FOUR_TREE_TERRAIN_NAVIGATION_REJECTED');
assert.equal(explicit.state.terrainSupported,true,'FOUR_TREE_TERRAIN_CLEARANCE_MISSING');
assert.equal(explicit.state.action,'GOTO_WAYPOINT:WOODLAND_CLEARING_FOUR_TREES');
assert.equal(explicit.state.yawDegrees,0);
assert.equal(explicit.state.pitchDegrees,16);
assert.equal(explicit.state.position.x,-139.40267987050615);
assert.equal(explicit.state.position.z,-194.5);

const pointer=read('showroom/globe/h-earth/diagnostic/run8e-r3d/pointer-touch-intake.js');
const html=read('showroom/globe/h-earth/index.html');
const treeSource=read('showroom/globe/h-earth/render/geometry-woodland-tree-trial.js');
const landscape=read('showroom/globe/h-earth/render/geometry-landscape-sector.p2.js');
const ownerSourceDigest=crypto.createHash('sha256').update(treeSource).digest('hex');
assert.equal(ownerSourceDigest,'15ef7838a2c47ad0ef219b57da80373d8ba48ebb3bda271bcf7cdaa0c23a3e36','APPROVED_FOUR_TREE_GEOMETRY_CHANGED');
assert.match(pointer,/get\('arrival'\) === 'approved-four-trees'/,'ARRIVAL_PARAMETER_MATCH_MISSING');
assert.match(pointer,/explicitFourTreeVisit \? 'WOODLAND_CLEARING_FOUR_TREES' : 'COAST'/,'COAST_FALLBACK_CHANGED');
assert.match(html,/id="h-earth-visit-approved-trees"[^>]*>/,'VISIT_FOUR_TREES_LINK_MISSING');
assert.match(html,/href="\?arrival=approved-four-trees#h-earth-live-world"/,'VISIT_FOUR_TREES_LINK_NOT_BOUND');
assert.match(html,/href="#h-earth-live-world">Enter and explore/,'COAST_ENTRY_LINK_CHANGED');
for(const id of ['P2_TREE_A_03','P2_TREE_A_06','P2_TREE_A_08','P2_TREE_A_11'])assert.ok(landscape.includes('H_EARTH_WOODLAND_CLEARING_TREE_IDS.includes(id)')&&treeSource.includes("H_EARTH_WOODLAND_CLEARING_TREE_IDS"),'TREE_ADOPTION_CONTRACT_CHANGED:'+id);
// Reproduce frozen deterministic cluster A location calculation and assert
// the existing woodland walking observer faces the four approved tree roots.
const seed='WEST_WOODLAND_P2_20261006';
const hash=(id,channel)=>{let h=2166136261;for(const c of `${seed}:${id}:${channel}`)h=Math.imul(h^c.charCodeAt(0),16777619);return(h>>>0)/4294967296;};
const observer=explicit.state.position;
const targets=[3,6,8,11].map(i=>{
 const id=`P2_TREE_A_${String(i).padStart(2,'0')}`;
 const angle=i*2.399963229728653+hash(id,'angle');
 const radius=Math.sqrt((i+.4)/15);
 const x=-145+Math.cos(angle)*radius*23;
 const z=-230+Math.sin(angle)*radius*23;
 const distance=Math.hypot(x-observer.x,z-observer.z);
 assert.ok(z<observer.z&&distance<30,'APPROVED_TREE_NOT_AHEAD_OF_WALKING_VIEW:'+id);
 return {id,x,z,distance};
});
const receipt={schema:'H_EARTH_FOUR_TREE_VISIBLE_ARRIVAL_STATIC_RECEIPT_v1',result:'PASS',coastDefaultUnchanged:true,clearingTerrainNavigation:true,approvedGeometrySha256:ownerSourceDigest,targets,limitations:['ACTUAL_BROWSER_VISUAL_READBACK_PENDING','OWNER_PHONE_PERFORMANCE_NOT_YET_REMEASURED','PHYSICAL_DEVICE_REVIEW_PENDING']};
process.stdout.write(JSON.stringify(receipt,null,2)+'\n');
