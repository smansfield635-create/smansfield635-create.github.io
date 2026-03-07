(function(){
"use strict";

/* ══════════════════════════════════════════════════════════════════════
REGION_ROUTER_v1
MODE: EXECUTION-ONLY · NON-DRIFT · REGION NAVIGATION AUTHORITY
OWNER: SEAN

PURPOSE
Resolve pathname → region → biome → traversal options using the
canonical world kernel and island regions authority.

REQUIRES
window.WORLD_KERNEL from /world/world_kernel.js
window.ISLAND_REGIONS from /world/island_regions.js

OUTPUT
window.REGION_ROUTER
══════════════════════════════════════════════════════════════════════ */

const kernel=window.WORLD_KERNEL;
const regionsApi=window.ISLAND_REGIONS;

if(!kernel){
console.error("REGION_ROUTER_v1: WORLD_KERNEL missing.");
return;
}
if(!regionsApi){
console.error("REGION_ROUTER_v1: ISLAND_REGIONS missing.");
return;
}

const REGION_ID_BY_SUMMIT_KEY=Object.freeze({
gratitude:"gratitude_southlands",
generosity:"generosity_delta",
dependability:"dependability_pass",
accountability:"accountability_canyon",
humility:"humility_terrace",
forgiveness:"forgiveness_fields",
self_control:"selfcontrol_ridge",
patience:"patience_expanse",
purity:"purity_crown"
});

function normalizeRoute(route){
if(!route)return "/";
let out=String(route).trim();
if(!out.startsWith("/"))out="/"+out;
out=out.replace(/\/{2,}/g,"/");
if(!out.endsWith("/"))out+="/";
return out;
}

function currentPathname(){
try{
return normalizeRoute(window.location.pathname||"/");
}catch(_e){
return "/";
}
}

function getRegionById(regionId){
return regionsApi.byId(regionId);
}

function getRegionByRoute(route){
return regionsApi.byRoute(normalizeRoute(route));
}

function getCurrentRegion(){
const region=getRegionByRoute(currentPathname());
return region||getRegionById("harbor_core");
}

function resolveSummitRegionIds(){
const out=Object.create(null);
const keys=Object.keys(REGION_ID_BY_SUMMIT_KEY);
for(let i=0;i<keys.length;i++){
const key=keys[i];
out[key]=REGION_ID_BY_SUMMIT_KEY[key];
}
return out;
}

function resolvePrimaryPathRegions(){
const ids=kernel.traversal&&Array.isArray(kernel.traversal.primary)?kernel.traversal.primary:[];
const out=[];
for(let i=0;i<ids.length;i++){
const id=ids[i]==="harbor"?"harbor_core":REGION_ID_BY_SUMMIT_KEY[ids[i]]||ids[i];
const region=getRegionById(id);
if(region)out.push(region);
}
return out;
}

function resolveBranchesForRegion(regionId){
const region=getRegionById(regionId);
if(!region)return [];

const result=[];
const branches=kernel.traversal&&kernel.traversal.branches?kernel.traversal.branches:{};
const summitKey=region.summitKey||null;
if(!summitKey)return result;

const nextKeys=branches[summitKey]||[];
for(let i=0;i<nextKeys.length;i++){
const nextRegionId=REGION_ID_BY_SUMMIT_KEY[nextKeys[i]]||nextKeys[i];
const nextRegion=getRegionById(nextRegionId);
if(nextRegion)result.push(nextRegion);
}
return result;
}

function resolveReturnTarget(regionId){
const region=getRegionById(regionId);
if(!region)return null;

if(region.id==="harbor_core")return null;

if(region.summitKey){
const returns=kernel.traversal&&kernel.traversal.returns?kernel.traversal.returns:{};
const targetKey=returns[region.summitKey];
if(targetKey==="harbor"){
return getRegionById("harbor_core");
}
if(targetKey){
const targetId=REGION_ID_BY_SUMMIT_KEY[targetKey]||targetKey;
return getRegionById(targetId);
}
}

return getRegionById("harbor_core");
}

function getNeighbors(regionId){
const region=getRegionById(regionId);
if(!region)return [];

const ids=[].concat(region.ingress||[],region.egress||[]);
const seen=Object.create(null);
const out=[];

for(let i=0;i<ids.length;i++){
const id=ids[i];
if(!id||seen[id])continue;
seen[id]=true;
const target=getRegionById(id);
if(target)out.push(target);
}
return out;
}

function getNextPrimary(regionId){
return regionsApi.nextPrimary(regionId);
}

function getPreviousPrimary(regionId){
return regionsApi.previousPrimary(regionId);
}

function getBiomeForRegion(regionId){
const region=getRegionById(regionId);
return region?region.biome:"HARBOR_DUSK";
}

function getRouteForRegion(regionId){
const region=getRegionById(regionId);
return region?region.route:null;
}

function getRegionContext(input){
const region=typeof input==="string"
? (getRegionById(input)||getRegionByRoute(input)||getCurrentRegion())
: (input&&input.id?input:getCurrentRegion());

if(!region)return null;

return{
regionId:region.id,
label:region.label,
type:region.type,
route:region.route,
biome:region.biome,
anchor:region.anchor,
summitKey:region.summitKey||null,
localBudget:region.localBudget||null,
neighbors:getNeighbors(region.id),
nextPrimary:getNextPrimary(region.id),
previousPrimary:getPreviousPrimary(region.id),
branches:resolveBranchesForRegion(region.id),
returnTarget:resolveReturnTarget(region.id)
};
}

function navigateToRegion(regionId){
const route=getRouteForRegion(regionId);
if(!route)return false;
window.location.href=route;
return true;
}

function navigateNextPrimary(){
const ctx=getRegionContext();
if(!ctx||!ctx.nextPrimary)return false;
return navigateToRegion(ctx.nextPrimary.id);
}

function navigatePreviousPrimary(){
const ctx=getRegionContext();
if(!ctx||!ctx.previousPrimary)return false;
return navigateToRegion(ctx.previousPrimary.id);
}

function navigateReturn(){
const ctx=getRegionContext();
if(!ctx||!ctx.returnTarget)return false;
return navigateToRegion(ctx.returnTarget.id);
}

function compassTargetMap(regionId){
const ctx=getRegionContext(regionId);
if(!ctx)return null;

const defaults={
N:ctx.nextPrimary?ctx.nextPrimary.id:null,
S:ctx.returnTarget?ctx.returnTarget.id:"harbor_core",
E:null,
W:null,
C:"harbor_core",
M:"dragon_corridor"
};

const neighbors=ctx.neighbors||[];
for(let i=0;i<neighbors.length;i++){
const n=neighbors[i];
if(!defaults.E&&/east|trade/i.test(n.id))defaults.E=n.id;
if(!defaults.W&&/west|wilds|forgiveness/i.test(n.id))defaults.W=n.id;
}
if(!defaults.E&&neighbors[0])defaults.E=neighbors[0].id;
if(!defaults.W&&neighbors[1])defaults.W=neighbors[1].id;

return defaults;
}

window.REGION_ROUTER={
version:"REGION_ROUTER_v1",
normalizeRoute,
currentPathname,
getRegionById,
getRegionByRoute,
getCurrentRegion,
getPrimaryPathRegions:resolvePrimaryPathRegions,
getNeighbors,
getNextPrimary,
getPreviousPrimary,
getBiomeForRegion,
getRouteForRegion,
getRegionContext,
compassTargetMap,
navigateToRegion,
navigateNextPrimary,
navigatePreviousPrimary,
navigateReturn
};

})();
