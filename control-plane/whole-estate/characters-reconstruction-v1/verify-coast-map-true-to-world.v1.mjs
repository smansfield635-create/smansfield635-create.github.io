#!/usr/bin/env node
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {buildCoastMapSurfaceModel,COAST_MAP_RENDERER_ID} from '../../../characters/coast-map-renderer.mjs';
import {buildForestPopulation} from '../../../characters/forest-system.mjs';
import {resolveCoastlinePolyline} from '../../../characters/gratitude-geography.adapter.mjs';

const BASE='928567148818c8618032394abc4ee3690dea1e9c';
const allowed=new Set([
  'characters/index.html','characters/app.mjs','characters/coast-map-renderer.mjs',
  'control-plane/whole-estate/characters-reconstruction-v1/coast-map-true-to-world-contract.v1.json',
  'control-plane/whole-estate/characters-reconstruction-v1/verify-coast-map-true-to-world.v1.mjs',
  '.github/workflows/characters-coast-map-true-to-world-v1.yml'
]);
const protectedPaths=[
  'characters/gratitude-geography.adapter.mjs','characters/step9-regional-geography.mjs','characters/coast-map.mjs',
  'characters/forest-system.mjs','characters/cloud-traversal.mjs','characters/cloud-system.mjs'
];
const run=(...args)=>execFileSync('git',args,{encoding:'utf8'}).trim();
const near=(a,b,t=1e-12)=>Math.abs(a-b)<=t;
const checks=[];
const check=(id,pass,detail=null)=>checks.push({id,pass:Boolean(pass),detail});

let head='UNKNOWN';
try{head=run('rev-parse','HEAD');}catch{}
let changed=[];
try{changed=run('diff','--name-only',`${BASE}...HEAD`).split('\n').filter(Boolean);}catch{}
check('EXACT_HEAD_DESCENDS_FROM_GOVERNING_HEAD',(()=>{try{run('merge-base','--is-ancestor',BASE,'HEAD');return true;}catch{return false;}})(),{base:BASE,head});
check('PATH_SCOPE',changed.every(p=>allowed.has(p)),{changed});
for(const path of protectedPaths){
  let baseBlob=null,headBlob=null;
  try{baseBlob=run('rev-parse',`${BASE}:${path}`);headBlob=run('rev-parse',`HEAD:${path}`);}catch{}
  check(`PROTECTED_IDENTITY:${path}`,baseBlob&&baseBlob===headBlob,{baseBlob,headBlob});
}

const contract=JSON.parse(fs.readFileSync('control-plane/whole-estate/characters-reconstruction-v1/coast-map-true-to-world-contract.v1.json','utf8'));
check('CONTRACT_FROZEN',contract.schema==='MIRRORLAND_COAST_MAP_TRUE_TO_WORLD_CONTRACT_v1'&&contract.status==='FROZEN');
check('CONTRACT_GOVERNING_HEAD',contract.governingHead===BASE);

const desktop=buildCoastMapSurfaceModel({compact:false});
const mobile=buildCoastMapSurfaceModel({compact:true});
const canonicalCoast=resolveCoastlinePolyline({sampleCount:129});
check('RENDERER_ID',desktop.rendererId===COAST_MAP_RENDERER_ID);
check('CANONICAL_SHORELINE_RENDERED',desktop.coastline.points.length===canonicalCoast.points.length&&desktop.coastline.points.every((x,i)=>near(x.map.u,canonicalCoast.points[i].map.u)&&near(x.map.v,canonicalCoast.points[i].map.v)));
check('TERRAIN_RELIEF_DERIVED_FROM_WORLD_FIELD',desktop.terrain.cells.length===48*34&&desktop.terrain.cells.some(c=>c.land)&&desktop.terrain.cells.some(c=>!c.land)&&desktop.terrain.max>desktop.terrain.min,{minimum:desktop.terrain.min,maximum:desktop.terrain.max});
const forest=buildForestPopulation({compact:false});
check('FOREST_REGIONS_DERIVED_FROM_QUALIFIED_FOREST_AUTHORITY',JSON.stringify(desktop.forestRegions)===JSON.stringify(forest.regions)&&desktop.forestRegions.length===7,{regionCount:desktop.forestRegions.length});
check('MOBILE_WORLD_MODEL_EQUIVALENT',JSON.stringify(desktop.coastline)===JSON.stringify(mobile.coastline)&&JSON.stringify(desktop.forestRegions)===JSON.stringify(mobile.forestRegions));
check('NO_GEOGRAPHY_STATE_CHANGE',desktop.geographyStateChanged===false&&desktop.markerAuthorityChanged===false);

const html=fs.readFileSync('characters/index.html','utf8');
const app=fs.readFileSync('characters/app.mjs','utf8');
check('NO_FIXED_CSS_SCHEMATIC_GEOGRAPHY',!html.includes('#315d65 0 22%')&&!html.includes('#d4bb79 22% 27%')&&!html.includes('#2a4837 27% 100%'));
check('WORLD_DERIVED_RENDERER_LOADED',html.includes('<script type="module" src="./coast-map-renderer.mjs"></script>')&&html.includes('.coast-map-surface'));
check('MARKERS_USE_FROZEN_SEQUENCE_1_PROJECTION',app.includes('const map=step9MapPosition(d.siteId);')&&app.includes('m.style.left=`${8+map.u*84}%`')&&app.includes('m.style.top=`${10+map.v*78}%`'));
check('DISCOVERY_LABEL_SEMANTICS_PRESERVED',app.includes("visited.has(d.id)||active===d?d.title:'Unexplored'")&&app.includes("d.mapButton.hidden=state.signalState==='UNSEEN'"));
check('NO_SEQUENCE_5_PLUS_MUTATION',!changed.some(p=>/knowledge-card|destination-registry|orientation-shell|cloud-system|cloud-traversal/.test(p)));

const fail=checks.filter(c=>!c.pass);
const receipt={
  schema:'MIRRORLAND_COAST_MAP_TRUE_TO_WORLD_RECEIPT_v1',
  result:fail.length?'FAIL_CLOSED':'PASS_MACHINE_BROWSER_EVIDENCE_REQUIRED',
  operationId:'MIRRORLAND_COAST_MAP_TRUE_TO_WORLD_20260903_014',
  governingHead:BASE,
  candidateHead:head,
  checkCount:checks.length,
  passCount:checks.length-fail.length,
  failCount:fail.length,
  browserEvidenceRequired:true,
  checks
};
fs.writeFileSync('coast-map-true-to-world-receipt.json',JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify(receipt,null,2));
process.exitCode=fail.length?1:0;
