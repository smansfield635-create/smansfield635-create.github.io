import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {root,source,block,blockPattern,rendererPath,sample} from './sample-shader.mjs';
const baseline='68e3a38eb51f43c50fadd019eac9103b69dbe102';
const git=p=>execFileSync('git',['show',baseline+':'+p],{cwd:root,maxBuffer:4*1024*1024,encoding:'utf8'});
const digest=s=>createHash('sha256').update(s).digest('hex');

test('one bounded terrain-only insertion preserves all geometry, vegetation, water and rendering-resource code',()=>{
 assert.equal(source.replace(blockPattern,''),git(rendererPath).replace(blockPattern,''));
 const before=source.slice(0,source.indexOf(block));
 assert.ok(before.lastIndexOf('if(!geologicalEarthRock){')>before.lastIndexOf('if(worldSoilTerrain){'));
 assert.match(before,/bool worldSoilTerrain=geologicalEarthRock\|\|vRoleCode==1u\|\|\s*int\(vPrimitiveIndex\)==uGlobalCoverFarPrimitiveIndex;/);
 assert.ok(source.indexOf(block)<source.indexOf('// SHORELINE_SOIL_BEGIN shade'));
 assert.doesNotMatch(block,/\b(?:texture|uniform|discard|dFdx|dFdy)\s*\(|\b(?:uCameraPosition|distanceToCamera|nearMaterial|upperDry)\b|vWorldPosition\.y|gl\.|Math\.random/);
 assert.equal((block.match(/palette=/g)||[]).length,1);
 assert.equal((block.match(/noise2\(/g)||[]).length,1);
 const oldBlock=git(rendererPath).match(blockPattern)[0];
 for(const [start,end] of [['float groundcoverOasisX','float groundcoverPatch'],['float groundcoverSuitability','vec3 groundcoverTone']]){
  const section=b=>b.slice(b.indexOf(start),b.indexOf(end)).replace(/      \/\/ Rotate and softly warp[\s\S]*$/,'');
  assert.equal(section(block).trimEnd(),section(oldBlock).trimEnd());
 }
});

test('near and far suitable land receive material cover, while dry regions remain bare',()=>{
 for(const [x,z] of [[220,-360],[-350,-450],[900,-1700],[-1800,-3200]]){
   assert.ok(sample({x,z,noise2:()=>1}).weight>0.75);
   assert.equal(sample({x,z,noise2:()=>0,mesoField:0.15}).weight,0);
 }
 const weights=[];
 for(let i=0;i<=100;i++)weights.push(sample({noise2:()=>i/100,mesoField:.5}).weight);
 assert.ok(weights.some(w=>w===0)); assert.ok(weights.some(w=>w>.8));
 for(let i=1;i<weights.length;i++)assert.ok(weights[i]>=weights[i-1]);
 assert.ok(sample({moistShelter:.9,terrainWetness:.8}).dry<sample({moistShelter:0,terrainWetness:0}).dry);
});

test('accepted oasis, grove walking capsule, manor and estate stay unchanged',()=>{
 for(let x=-18;x<=34;x+=2)for(let z=-204;z<=-131;z++)assert.equal(sample({x,z}).weight,0);
 for(let x=18;x<=132;x+=3)for(let z=-210;z<=-125;z+=5)assert.equal(sample({x,z}).weight,0);
 for(let a=0;a<360;a+=5)for(const radius of [0,10,21.99]){
   const x=-139.40268+radius*Math.cos(a*Math.PI/180),z=-210.74617+radius*Math.sin(a*Math.PI/180);
   assert.equal(sample({x,z}).weight,0);
 }
 // Existing woodland walking capsule: x=-145, z=-194..-230, radius 1.5m.
 for(let z=-230;z<=-194;z++)for(let a=0;a<360;a+=15){
   assert.equal(sample({x:-145+1.5*Math.cos(a*Math.PI/180),z:z+1.5*Math.sin(a*Math.PI/180)}).weight,0);
 }
 // Declared estate approach polyline, including its last 4m-radius capsule.
 const route=[[80,-172],[64,-172],[48,-144],[0,-96]];
 for(let i=1;i<route.length;i++)for(let j=0;j<=100;j++)for(let a=0;a<360;a+=30){
   const t=j/100,x=route[i-1][0]*(1-t)+route[i][0]*t+3.999*Math.cos(a*Math.PI/180),z=route[i-1][1]*(1-t)+route[i][1]*t+3.999*Math.sin(a*Math.PI/180);
   assert.equal(sample({x,z}).weight,0);
 }
});

test('waterward ground, beaches, steep faces and exposed mineral have zero added cover',()=>{
 for(const vCoastDistanceMeters of [-300,-1,0,12,28])assert.equal(sample({vCoastDistanceMeters}).weight,0);
 for(const slope of [.42,.7,1])assert.equal(sample({slope}).weight,0);
 for(const rockExposure of [.58,.8,1])assert.equal(sample({rockExposure}).weight,0);
});

test('all sampled weights are finite, bounded, repeatable, and feather boundaries are continuous',()=>{
 for(let i=0;i<1000;i++){
   const input={x:-400+i*.71,z:-500+i*.31,macroField:(i*37%1000)/999,mesoField:(i*61%1000)/999,slope:(i%100)/100,rockExposure:(i%73)/73,vCoastDistanceMeters:(i%210)-40};
   const a=sample(input); assert.deepEqual(a,sample(input));
   for(const v of Object.values(a))assert.ok(Number.isFinite(v)&&v>=0&&v<=1);
   assert.ok(a.weight<=.88);
 }
 for(const [key,at,extra] of [['x',-18,{z:-160}],['x',-30,{z:-160}],['x',132,{z:-165}],['x',142,{z:-165}],['vCoastDistanceMeters',28,{}],['vCoastDistanceMeters',72,{}],['slope',.12,{}],['slope',.42,{}],['rockExposure',.18,{}],['rockExposure',.58,{}]]){
   const a=sample({...extra,[key]:at-1e-5}).weight,b=sample({...extra,[key]:at+1e-5}).weight;
   assert.ok(Math.abs(a-b)<1e-4,`${key}=${at}: ${a} / ${b}`);
 }
});

test('both renderer import aliases use exact updated content identity; every other entry byte is preserved',()=>{
 const p='showroom/globe/h-earth/index.html',html=fs.readFileSync(new URL(p,root),'utf8'),old=git(p);
 const suffix='sha-'+digest(source).slice(0,12);
 assert.equal(html.split(suffix).length-1,2);
 assert.equal(html.replaceAll(suffix,'sha-eda2606001ef'),old);
 const manifest=JSON.parse(git('showroom/globe/h-earth/render/assets/precomputed-procedural-vegetation.v1.json'));
 assert.ok(!JSON.stringify(manifest.sources).includes(rendererPath));
 assert.ok(!JSON.stringify(manifest.inputComponents).includes(rendererPath));
});
