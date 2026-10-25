import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';

const moduleFile = process.env.H_EARTH_GEN323_MODULE
  ? resolve(process.env.H_EARTH_GEN323_MODULE)
  : resolve(import.meta.dirname,'../../../showroom/globe/h-earth/functional-landscape/visible-terrain-clearance.js');
const source = readFileSync(moduleFile,'utf8');
const match=source.match(/function continuousObserverViewMargin\([\s\S]*?\n\}/);
assert.ok(match, 'Exact Gen323 margin implementation must exist');
const clamp=(x,a,b)=>Math.min(b,Math.max(a,x));
const margin=new Function('clamp',`${match[0]};return continuousObserverViewMargin;`)(clamp);
const reference=(center,points)=>Math.max(...points.map(p=>p.y+margin(center,p.y,p.distance)));

const old=(center,y,dist)=>Math.max(0,y-center)<2?0:clamp(3+Math.max(0,y-center)*.32+Math.max(0,6-dist)*.3,3,14);

test('Gen323 transitions smoothly through the former prominence threshold',()=>{
 const pointsA=[{y:1.999999, distance:10},{y:0,distance:0}];
 const pointsB=[{y:2.000001,distance:10},{y:0,distance:0}];
 assert.ok(old(0,2.000001,10)-old(0,1.999999,10)>3);
 assert.ok(Math.abs(reference(0,pointsB)-reference(0,pointsA))<0.00005);
});

test('Gen323 sample selection does not abruptly transfer one winner distance boost',()=>{
 const nearFirst=[{y:3.00001,distance:1},{y:3,distance:10}];
 const farFirst=[{y:3,distance:1},{y:3.00001,distance:10}];
 assert.ok(Math.abs(reference(0,nearFirst)-reference(0,farFirst))<0.00005);
});

test('No geometric support floor lost across deterministic terrain sample groups',()=>{
 let seed=124679;
 const rand=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 for(let i=0;i<20000;i++){
   const center=(rand()-.5)*60;
   const points=Array.from({length:24},()=>({y:center+(rand()-.25)*10,distance:rand()*12}));
   const ref=reference(center,points),highest=Math.max(...points.map(x=>x.y));
   assert.ok(Number.isFinite(ref)&&ref>=highest-1e-12);
 }
});

test('Preserve dense camera volume and product authority boundaries',()=>{
 assert.ok(source.includes('cameraVolumePoints(worldX,worldZ'));
 assert.ok(source.includes('critical.some(x=>x.sample.valid!==true)'));
 assert.ok(source.includes('continuousObserverViewMarginCandidate:true'));
 assert.ok(source.includes('legacyViewStandOffRequirementRelaxed:true'));
 assert.ok(!source.includes('function observerViewStandOff({centerElevation,highestElevation,highestDistance})'));
});
