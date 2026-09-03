#!/usr/bin/env node
import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {buildForestPopulation,FOREST_ARCHETYPES,FOREST_BUDGETS,FOREST_REPRESENTATION_SOURCE_SHA,FOREST_SIGHTLINE_EXCLUSIONS} from '../../../characters/forest-system.mjs';
import {step9TerrainHeight,step9ShorelineZ} from '../../../characters/step9-regional-geography.mjs';

const app=fs.readFileSync('characters/app.mjs','utf8');
const forest=fs.readFileSync('characters/forest-system.mjs','utf8');
const contract=JSON.parse(fs.readFileSync('control-plane/whole-estate/characters-reconstruction-v1/forest-population-contract.v1.json','utf8'));
const checks=[];
const check=(id,fn)=>{try{fn();checks.push({id,result:'PASS'});}catch(error){checks.push({id,result:'FAIL',detail:error.message});}};

const desktop=buildForestPopulation({compact:false});
const mobile=buildForestPopulation({compact:true});
const fingerprint=p=>crypto.createHash('sha256').update(JSON.stringify(p.instances.map(t=>[t.id,t.region,t.archetype,+t.x.toFixed(5),+t.y.toFixed(5),+t.z.toFixed(5),t.lod]))).digest('hex');

check('REPRESENTATION_SOURCE_EXACT',()=>assert.equal(FOREST_REPRESENTATION_SOURCE_SHA,'35e8e2fb3e4a093fb3bc8ecc4239e8564bd7938a'));
check('SIX_ARCHETYPE_RUNTIME_CONSUMPTION',()=>{assert.deepEqual(FOREST_ARCHETYPES,contract.archetypes);const seen=new Set(desktop.instances.map(t=>t.archetype));assert.equal(seen.size,6);for(const a of FOREST_ARCHETYPES)assert.ok(seen.has(a),`missing ${a}`);});
check('CANONICAL_TERRAIN_BINDING',()=>{for(const t of [...desktop.instances,...mobile.instances])assert.ok(Math.abs(t.y-step9TerrainHeight(t.x,t.z))<1e-9,`root mismatch ${t.id}`);assert.ok(forest.includes('step9TerrainHeight(x,z)'));});
check('CANONICAL_SHORELINE_SETBACK',()=>{for(const t of [...desktop.instances,...mobile.instances])assert.ok(t.z<=step9ShorelineZ(t.x)-48+1e-9,`shore setback ${t.id}`);assert.ok(forest.includes('step9ShorelineZ(x)'));});
check('CLUSTERED_NOT_UNIFORM_PLACEMENT',()=>{assert.equal(contract.placement.uniformScatterAllowed,false);assert.equal(desktop.regions.length,7);assert.ok(desktop.instances.some(t=>t.core));assert.ok(desktop.instances.some(t=>t.edge));const perRegion=new Map();for(const t of desktop.instances)perRegion.set(t.region,(perRegion.get(t.region)||0)+1);assert.ok(perRegion.size>=5);});
check('DENSE_CORE_AND_TRANSITIONAL_EDGE',()=>{const core=desktop.instances.filter(t=>t.core).length,edge=desktop.instances.filter(t=>t.edge).length;assert.ok(core>80,`core=${core}`);assert.ok(edge>10,`edge=${edge}`);});
check('LANDMARK_SIGHTLINE_EXCLUSIONS',()=>{assert.ok(FOREST_SIGHTLINE_EXCLUSIONS.length>=8);for(const t of desktop.instances)for(const s of FOREST_SIGHTLINE_EXCLUSIONS)assert.ok(Math.hypot(t.x-s.x,t.z-s.z)>=s.radius-1e-9,`${t.id} intrudes ${s.id}`);});
check('DESKTOP_MOBILE_BUDGETS',()=>{assert.ok(desktop.instances.length>250&&desktop.instances.length<=FOREST_BUDGETS.desktop.max,`desktop=${desktop.instances.length}`);assert.ok(mobile.instances.length>100&&mobile.instances.length<=FOREST_BUDGETS.mobile.max,`mobile=${mobile.instances.length}`);assert.ok(mobile.instances.length<desktop.instances.length);});
check('DETERMINISTIC_POPULATION',()=>{assert.equal(fingerprint(desktop),fingerprint(buildForestPopulation({compact:false})));assert.equal(fingerprint(mobile),fingerprint(buildForestPopulation({compact:true})));});
check('LOD_AND_NON_CONE_GEOMETRY',()=>{for(const lod of ['near','mid','far'])assert.ok(desktop.instances.some(t=>t.lod===lod),`missing ${lod}`);assert.equal(contract.lod.stackedConesAllowed,false);for(const forbidden of ['coneGeometry','stackedCone','TRIANGLE_FAN_TREE'])assert.equal(forest.includes(forbidden),false,forbidden);assert.ok(forest.includes('canopyBlob'));assert.ok(forest.includes('prism('));});
check('NO_PER_LEAF_CPU_ANIMATION',()=>{assert.equal(contract.wind.perLeafCpuAnimation,false);assert.ok(forest.includes('BATCHED_SHADER_SPACE_CANOPY_SWAY')||contract.wind.mode==='BATCHED_SHADER_SPACE_CANOPY_SWAY');});
check('NO_WORLD_EDGE_CONCEALMENT_DEPENDENCY',()=>{assert.equal(contract.placement.worldEdgeConcealmentDependencyAllowed,false);assert.ok(contract.placement.frameInsetFraction>0);});
check('APP_RUNTIME_INTEGRATION',()=>{assert.ok(app.includes("from './forest-system.mjs'"),'forest import missing');assert.ok(app.includes('createForestSystem(gl,{compact})'),'forest init missing');assert.ok(app.includes('forest.draw(vp'),'forest draw missing');});
check('NO_SEQUENCE_3_PLUS_MUTATION',()=>{for(const forbidden of ['./cloud-traversal.mjs','knowledge-card','coast-map.mjs'])assert.equal(forest.includes(forbidden),false,forbidden);});

const failures=checks.filter(c=>c.result!=='PASS');
const receipt={schema:'MIRRORLAND_FOREST_POPULATION_RECEIPT_v1',result:failures.length?'FAIL_CLOSED':'PASS_CLOSED',representationSource:FOREST_REPRESENTATION_SOURCE_SHA,desktopTrees:desktop.instances.length,mobileTrees:mobile.instances.length,desktopFingerprint:fingerprint(desktop),mobileFingerprint:fingerprint(mobile),archetypes:[...new Set(desktop.instances.map(t=>t.archetype))].sort(),regionCount:new Set(desktop.instances.map(t=>t.region)).size,coreCount:desktop.instances.filter(t=>t.core).length,edgeCount:desktop.instances.filter(t=>t.edge).length,sightlineExclusionCount:FOREST_SIGHTLINE_EXCLUSIONS.length,checks};
fs.writeFileSync('forest-population-receipt.json',JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify(receipt,null,2));
if(failures.length)process.exit(1);
