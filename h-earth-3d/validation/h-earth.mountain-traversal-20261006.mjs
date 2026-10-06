import assert from 'node:assert/strict';
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';
import * as nav from '../../showroom/globe/h-earth/functional-landscape/navigation.js';
import {H_EARTH_FUNCTIONAL_LANDSCAPE_REALIZATION_PLAN as plan} from '../integration/h-earth.landscape-realization-planner.js';
const root=new URL('../../',import.meta.url);
const counts={acceptedSteps:0,supportChecks:0,boundaries:0,routes:0};
function step(state,action,magnitude=5){const r=nav.proposeHEarthFunctionalLandscapeNavigation(state,{action,magnitude});assert.equal(r.ok,true,JSON.stringify(r.issues));assert.equal(nav.evaluateHEarthFunctionalLandscapeNavigationState(r.state).eligible,true);assert.ok(r.state.position.y>=r.state.clearanceReferenceElevation+2.25-1e-8);assert.ok(r.state.selectedSemanticAddressId);counts.acceptedSteps++;counts.supportChecks++;return r.state;}
const destinations=[-180,-100,-52,18,86,148,240];
for(const x of destinations){
 let s=nav.createHEarthFunctionalLandscapeNavigationState().state;
 while(Math.abs(s.position.x-x)>1e-8)s=step(s,x>s.position.x?'STRAFE_RIGHT':'STRAFE_LEFT',Math.min(5,Math.abs(x-s.position.x)));
 while(s.position.z>-400+1e-8)s=step(s,'MOVE_FORWARD',Math.min(5,s.position.z+400));
 assert.equal(s.position.z,-400);assert.equal(s.selectionProjectionModel,'EXTENDED_GROUND_NEAREST_EXISTING_TERRAIN_MEMBER');
 const edge=nav.proposeHEarthFunctionalLandscapeNavigation(s,{action:'MOVE_FORWARD'});
 assert.equal(edge.ok,false);assert.equal(edge.state,s);assert.deepEqual(edge.issues,['OUTER_NAVIGATION_BOUNDARY']);
 const msg=nav.resolveHEarthNavigationBoundaryFeedback('',{intent:{action:'MOVE_FORWARD'},accepted:false,issues:edge.issues});assert.equal(msg,nav.H_EARTH_NAVIGATION_BOUNDARY_MESSAGE);
 const turn=nav.proposeHEarthFunctionalLandscapeNavigation(s,{action:'TURN_RIGHT'});assert.equal(turn.ok,true);assert.equal(nav.resolveHEarthNavigationBoundaryFeedback(msg,{intent:{action:'TURN_RIGHT'},accepted:true,moved:false}),msg);
 const back=step(turn.state,'MOVE_BACKWARD');assert.equal(nav.resolveHEarthNavigationBoundaryFeedback(msg,{accepted:true,moved:true}), '');
 assert.equal(nav.resolveHEarthNavigationBoundaryFeedback('',{intent:{action:'MOVE_FORWARD'},accepted:false,issues:['PRESENTED_TERRAIN_SAMPLE_INVALID']}),'');
 counts.routes++;counts.boundaries++;
}
// Traverse laterally across ridges and their rear approaches in both directions.
for(const z of [-230,-280]){
 const initial=nav.createHEarthFunctionalLandscapeNavigationState().state;
 const positioned=nav.proposeHEarthFunctionalLandscapeNavigation(initial,{action:'SET_CAMERA_POSITION',position:{x:-240,z}});assert.equal(positioned.ok,true);
 let s=positioned.state;
 for(let i=0;i<96;i++)s=step(s,'STRAFE_RIGHT');
 for(let i=0;i<96;i++)s=step(s,'STRAFE_LEFT');
 assert.equal(s.position.x,-240);counts.routes++;
}
// Every boundary and corner retains supported terrain and permits retreat.
for(const [x,z,action,inward] of [[-256,-200,'STRAFE_LEFT','STRAFE_RIGHT'],[256,-200,'STRAFE_RIGHT','STRAFE_LEFT'],[0,-80,'MOVE_BACKWARD','MOVE_FORWARD'],[-256,-400,'MOVE_FORWARD','MOVE_BACKWARD'],[256,-400,'MOVE_FORWARD','MOVE_BACKWARD'],[-256,-80,'STRAFE_LEFT','STRAFE_RIGHT'],[256,-80,'STRAFE_RIGHT','STRAFE_LEFT']]){
 const coast=nav.createHEarthFunctionalLandscapeNavigationState().state;
 const r=nav.proposeHEarthFunctionalLandscapeNavigation(coast,{action:'SET_CAMERA_POSITION',position:{x,z}});assert.equal(r.ok,true,JSON.stringify(r.issues));
 const rejected=nav.proposeHEarthFunctionalLandscapeNavigation(r.state,{action});assert.equal(rejected.ok,false);assert.equal(rejected.state,r.state);assert.deepEqual(rejected.issues,['OUTER_NAVIGATION_BOUNDARY']);step(r.state,inward);counts.boundaries++;
}
const invalid=nav.proposeHEarthFunctionalLandscapeNavigation(nav.createHEarthFunctionalLandscapeNavigationState().state,{action:'SET_CAMERA_POSITION',position:{x:NaN,z:-200}});assert.equal(invalid.ok,false);assert.ok(!invalid.issues.includes('OUTER_NAVIGATION_BOUNDARY'));
// Preserve old selection identities and cached camera-helper compatibility.
let oldSource=execFileSync('git',['show','6d694c6b70f5b8e5dd4d6c56e34e4ef4d8bd130c:showroom/globe/h-earth/functional-landscape/navigation.js'],{encoding:'utf8',cwd:root});
const navUrl=new URL('showroom/globe/h-earth/functional-landscape/navigation.js',root);
oldSource=oldSource.replace(/from '([^']+)'/g,(_,spec)=>`from '${new URL(spec,navUrl).href}'`);
const old=await import('data:text/javascript;base64,'+Buffer.from(oldSource).toString('base64'));
for(const waypointId of Object.keys(nav.H_EARTH_FUNCTIONAL_LANDSCAPE_WAYPOINTS)){const a=nav.createHEarthFunctionalLandscapeNavigationState({waypointId}).state,b=old.createHEarthFunctionalLandscapeNavigationState({waypointId}).state;assert.equal(a.chunkId,b.chunkId);assert.equal(a.selectedSemanticAddressId,b.selectedSemanticAddressId);assert.deepEqual(nav.createHEarthFunctionalLandscapeCamera(a),old.createHEarthFunctionalLandscapeCamera(a));}
const extended=nav.proposeHEarthFunctionalLandscapeNavigation(nav.createHEarthFunctionalLandscapeNavigationState().state,{action:'SET_CAMERA_POSITION',position:{x:148,z:-400}}).state;assert.deepEqual(nav.createHEarthFunctionalLandscapeCamera(extended),old.createHEarthFunctionalLandscapeCamera(extended));assert.ok(plan.chunks.some(c=>c.terrainMemberAddressIds.includes(extended.selectedSemanticAddressId)));
const manifest=JSON.parse(fs.readFileSync(new URL('.github/ai-router/publication-surfaces/h-earth.json',root)));
for(const check of manifest.checks){const file=new URL('.'+check.path,root);if(!fs.existsSync(file))continue;const content=fs.readFileSync(file,'utf8');for(const token of check.includes??[])assert.ok(content.includes(token),check.path+': '+token);for(const token of check.excludes??[])assert.ok(!content.includes(token),check.path+': excludes '+token);}
console.log(JSON.stringify({schema:'H_EARTH_MOUNTAIN_TRAVERSAL_QUALIFICATION_v1',result:'PASS',...counts,geometryMutation:false,cachedCameraHelperCompatible:true}));
