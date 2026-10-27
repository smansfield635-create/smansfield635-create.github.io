
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import zlib from 'node:zlib';
import {fileURLToPath} from 'node:url';

export const PUBLISHED_HEAD='cb57c275b95d0d48883bc4da4dcfcf17cbec5060';
export const PUBLISHED_RENDERER_SHA='fa6acc426c75c3b2292b3ed76a756157698d8e7a5562511ad7ced5af58e25dec';
const SHADER='showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js';
const HILLSIDE='showroom/globe/h-earth/render/hillside-shoreline-field.v1.js';
const COAST='showroom/globe/h-earth/render/grass-coastal-field.v1.js';
const MANIFEST='showroom/globe/h-earth/render/assets/precomputed-grass.v1.json';
const PACKED='showroom/globe/h-earth/render/assets/precomputed-grass.v1.bin.gz';
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
export const smooth=(a,b,x)=>{const t=clamp((x-a)/(b-a));return t*t*(3-2*t);};
export function outsideDistance([x0,z0,x1,z1],x,z){
 return Math.hypot(Math.max(x0-x,0,x-x1),Math.max(z0-z,0,z-z1));
}
export function groundProtection(x,z){
 const oasis=outsideDistance([-18,-204,34,-131],x,z);
 const estate=outsideDistance([18,-210,132,-125],x,z);
 const t=clamp((z-x+192)/96);
 const route=Math.hypot(x-(48-48*t),z-(-144+48*t));
 const protectedGrove=1-smooth(22,42,Math.hypot(x+139.40268,z+210.74617));
 return smooth(0,12,oasis)*smooth(0,10,estate)*smooth(4,9,route)*(1-protectedGrove);
}
export function piecewiseDivide(x,spine){
 if(x<=spine[0][0])return spine[0][1];
 for(let i=1;i<spine.length;i++)if(x<=spine[i][0]){
  const [a,b]=spine[i-1],[c,d]=spine[i];
  return b+(d-b)*(x-a)/(c-a);
 }
 return spine.at(-1)[1];
}
export function hillsideResponse(x,z,spine){return smooth(-48,-24,z-piecewiseDivide(x,spine));}
function sampleAtlas(mask,region,x,z,width){
 const b=region.bounds;
 if(!(x>b[0]&&x<b[2]&&z>b[1]&&z<b[3]))return 0;
 const dist=Math.min(x-b[0],b[2]-x,z-b[1],b[3]-z);
 const n=mask.size,panel=region.panel;
 const u=clamp((x-b[0])/(b[2]-b[0])*n-.5,0,n-1);
 const v=clamp((z-b[1])/(b[3]-b[1])*n-.5,0,n-1);
 const x0=Math.floor(u),z0=Math.floor(v),x1=Math.min(n-1,x0+1),z1=Math.min(n-1,z0+1),tx=u-x0,tz=v-z0;
 const pixel=(ix,iz)=>mask.bytes[iz*mask.width+panel*n+ix]/255;
 const a=pixel(x0,z0)*(1-tx)+pixel(x1,z0)*tx;
 const c=pixel(x0,z1)*(1-tx)+pixel(x1,z1)*tx;
 return (a*(1-tz)+c*tz)*smooth(0,width,dist)*.68;
}
export function atlasCrossSections(mask,region,width){
 const [x0,z0,x1,z1]=region.bounds;
 const lines=[
  {side:'west',len:z1-z0,point:(t,d)=>[x0+d,z0+t]},
  {side:'east',len:z1-z0,point:(t,d)=>[x1-d,z0+t]},
  {side:'south',len:x1-x0,point:(t,d)=>[x0+t,z0+d]},
  {side:'north',len:x1-x0,point:(t,d)=>[x0+t,z1-d]}
 ];
 const results=[];
 for(const line of lines)for(let t=2;t<line.len-2;t+=4){
  const contrast=(distance)=>{const inside=line.point(t,distance),outside=line.point(t,-distance);return Math.abs(sampleAtlas(mask,region,...inside,width)-sampleAtlas(mask,region,...outside,width));};
  const p=line.point(t,0);
  results.push({side:line.side,x:Number(p[0].toFixed(2)),z:Number(p[1].toFixed(2)),zeroLimit:contrast(0.001),oneMetre:contrast(1),twoMetres:contrast(2),fourMetres:contrast(4),eightMetres:contrast(8)});
 }
 results.sort((a,b)=>b.twoMetres-a.twoMetres||b.fourMetres-a.fourMetres);
 return {region:region.name,atlasPanel:region.panel,widthMetres:width,examined:results.length,maxTwoMetreContrastProxy:Number((results[0]?.twoMetres??0).toFixed(6)),maxEightMetreContrastProxy:Number((Math.max(...results.map(v=>v.eightMetres),0)).toFixed(6)),largestTwoMetre:results.slice(0,12),mode:'APPROXIMATE_BILINEAR_ATLAS_COVERAGE_PROXY_NOT_FULL_RENDERED_RGB'};
}
function rectangleLines(bounds){
 const [x0,z0,x1,z1]=bounds;
 return [
  {side:'west',len:z1-z0,point:(t,d)=>[x0+d,z0+t]},
  {side:'east',len:z1-z0,point:(t,d)=>[x1-d,z0+t]},
  {side:'south',len:x1-x0,point:(t,d)=>[x0+t,z0+d]},
  {side:'north',len:x1-x0,point:(t,d)=>[x0+t,z1-d]}
 ];
}
export function protectionCrossSections(bounds,name){
 const points=[];
 for(const e of rectangleLines(bounds))for(let t=2;t<e.len-2;t+=2){
  const inside=e.point(t,2),outside=e.point(t,-2);
  const a=groundProtection(...inside),b=groundProtection(...outside);
  points.push({side:e.side,x:Number(e.point(t,0)[0].toFixed(2)),z:Number(e.point(t,0)[1].toFixed(2)),twoMetreMaskContrast:Number(Math.abs(a-b).toFixed(6)),inside:Number(a.toFixed(5)),outside:Number(b.toFixed(5))});
 }
 points.sort((a,b)=>b.twoMetreMaskContrast-a.twoMetreMaskContrast);
 return {name,bounds,examined:points.length,maximumTwoMetreMaskContrast:points[0]?.twoMetreMaskContrast??0,ranked:points.slice(0,12),mode:'EXACT_SHADER_PROTECTION_MASK_ALONE_EXCLUDES_NOISE_SUITABILITY_AND_ALBEDO'};
}
export function sourceFirstCensus(root){
 const read=rel=>fs.readFileSync(path.join(root,rel));
 const shader=read(SHADER).toString('utf8');
 if(sha(shader)!==PUBLISHED_RENDERER_SHA)throw Error('PUBLISHED_RENDERER_FINGERPRINT_MISMATCH');
 const hillside=read(HILLSIDE).toString('utf8'),coast=read(COAST).toString('utf8');
 const required=[
  'float groundcoverOasisX=max(max(-18.0-world.x,0.0),world.x-34.0);',
  'float groundcoverEstateX=max(max(18.0-world.x,0.0),world.x-132.0);',
  'float groundcoverRouteDistance=distance(',
  'vec2 soilUv=(world-vec2(-18.0,-204.0))/vec2(52.0,73.0);',
  'if(world.x>-180.0 && world.x<-24.0 && world.y>-380.0 && world.y<-190.0){',
  'float habitatEdgeWeight(float x,float z,vec4 bounds,float width){',
  'habitatCoverage=max(habitatCoverage,texture(uWoodlandHabitat,coastalUv).r*habitatEdgeWeight',
  'float groundcoverWeight=0.88*groundcoverPatch*'
 ];
 for(const v of required)if(!shader.includes(v))throw Error('SOURCE_BOUNDARY_ANCHOR_MISSING:'+v);
 if(!hillside.includes('return smooth(-48,-24,z-coastalDivide(x))')||!hillside.includes('return smoothstep(-48.,-24.,p.y-hillsideDivide(p.x))'))throw Error('HILLSIDE_SHADER_RULE_DRIFT');
 const spineMatch=coast.match(/const spine=(\[\[[^;]+\]);/);
 if(!spineMatch)throw Error('COASTAL_SPINE_MISSING');
 const spine=JSON.parse(spineMatch[1]);
 const manifest=JSON.parse(read(MANIFEST).toString('utf8'));
 const h=manifest.habitat;
 if(h.size!==192||h.width!==576||h.height!==192||manifest.rootCount!==2858738)throw Error('PUBLISHED_HABITAT_IDENTITY_DRIFT');
 const packed=read(PACKED),raw=zlib.gunzipSync(packed),offset=manifest.rootCount*52;
 if(raw.length!==manifest.rawBytes||raw.length-offset!==h.width*h.height)throw Error('HABITAT_ASSET_INCONSISTENCY');
 const mask={bytes:raw.subarray(offset),size:h.size,width:h.width};
 const regions=[
  {name:'woodland',bounds:h.bounds,panel:0},
  {name:'ravine',bounds:h.ravine.bounds,panel:1},
  {name:'coastal',bounds:h.coastal.bounds,panel:2}
 ];
 const atlas=regions.map(q=>({bounds:q.bounds,conservativeFourMetre:atlasCrossSections(mask,q,4),sevenMetreEnvelope:atlasCrossSections(mask,q,7),actualWidthRule:q.name==='woodland'?'EXACT_6_METRES':'4_TO_7_METRES_PER_FRAGMENT_NOISE_DEPENDENT'}));
 const protection=[
  protectionCrossSections([-18,-204,34,-131],'oasis-protection'),
  protectionCrossSections([18,-210,132,-125],'estate-protection')
 ];
 const divides=spine.map(([x,z],i)=>{
  const actual=piecewiseDivide(x,spine);
  if(Math.abs(actual-z)>1e-9)throw Error('SPINE_VALUE_DRIFT');
  const centerZ=actual-36,lowerZ=actual-48,upperZ=actual-24;
  const difference=Math.abs(hillsideResponse(x,centerZ+2,spine)-hillsideResponse(x,centerZ-2,spine));
  return {node:i,x,dividerZ:z,transitionLowerZ:lowerZ,transitionCenterZ:centerZ,transitionUpperZ:upperZ,hillsideWeightAtCenter:hillsideResponse(x,centerZ,spine),fourMetreAcrossCenterMaskContrast:Number(difference.toFixed(6))};
 });
 const distinct=[
  {rule:'shoreline-soil-rectangle',bounds:[-18,-204,34,-131],condition:'HARD_INSIDE_OUTSIDE_GUARD',risk:'POTENTIAL_MASK_CUTOFF',textureBoundaryPixelsRead:false,visualJumpEstablished:false},
  {rule:'woodland-litter-rectangle',bounds:[-180,-380,-24,-190],condition:'HARD_INSIDE_OUTSIDE_GUARD',risk:'POTENTIAL_FOOTPRINT_CUTOFF',textureBoundaryPixelsRead:false,visualJumpEstablished:false},
  {rule:'near-far-primitive',condition:'PRIMITIVE_ROLE_SWITCH',risk:'PRE_WORLD_SOIL_EDGE_CANDIDATE',location:'REQUIRES_PRESENTED_MESH_EDGE_ARRAY',visualJumpEstablished:false}
 ];
 const ranked=[
  ...protection.flatMap(x=>x.ranked.slice(0,5).map(v=>({rule:x.name,kind:'mask-gradient',x:v.x,z:v.z,twoMetreWeightProxy:v.twoMetreMaskContrast}))),
  ...atlas.flatMap(x=>x.conservativeFourMetre.largestTwoMetre.slice(0,5).map(v=>({rule:x.conservativeFourMetre.region+'-habitat-atlas',kind:'atlas-gradient-upper-envelope',x:v.x,z:v.z,twoMetreWeightProxy:Number(v.twoMetres.toFixed(6))})))
 ].sort((a,b)=>b.twoMetreWeightProxy-a.twoMetreWeightProxy).slice(0,40);
 return {
  schema:'H_EARTH_GEN2935_SOURCE_FIRST_BOUNDARY_CENSUS_v1',
  result:'SOURCE_GEOGRAPHIC_BOUNDARIES_MEASURED_VISUAL_CAUSE_NOT_PROVEN',
  source:{publishedHead:PUBLISHED_HEAD,rendererSha256:sha(shader),hillsideSha256:sha(hillside),coastalFieldSha256:sha(coast),habitatManifestSha256:sha(read(MANIFEST)),compressedAtlasSha256:sha(packed),rootCount:manifest.rootCount,atlasPixels:h.width*h.height,atlasRegions:regions},
  highLevel:{knownCoordinates:true,sourceFirst:true,prior60ImageRerun:false,productBytesMutated:false,shaderEdited:false,geometryEdited:false,vegetationEdited:false,ownerScreenshotPoseMatched:false},
  groundcoverProtection:protection,
  atlasCoverage:atlas,
  coastalDivide:{spine,linearContinuous:true,shoreSideWidthMetres:24,knotValues:divides,mechanism:'CONTINUOUS_PIECEWISE_DIVIDE_WITH_DERIVATIVE_KNOTS'},
  candidateHardGuards:distinct,
  strongestSourceDerivedSamplePoints:ranked,
  interpretation:'A binary condition or weight gradient is a source-defined candidate, not a measured terrain-color discontinuity. Texture-derived habitat proxy samples are bilinear approximations with 4m/7m envelopes, not exact noise-width lit RGB. Rank is for targeted camera captures only; never claim screenshot correspondence or universal cause.',
  next:'At top calculated hotspots, bind actual rendered terrain primitive, sample exact same-camera stage RGB across the source-defined line; retain attractive controls. Do not repeat 60-view general search. No product repair until observed boundary corresponds.'
 };
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const args=process.argv.slice(2);if(args.length!==4||args[0]!=='--root'||args[2]!=='--output')throw Error('CENSUS_USAGE_EXPECTED_ROOT_OUTPUT');
 const root=path.resolve(args[1]),out=path.resolve(args[3]);
 const receipt=sourceFirstCensus(root);
 fs.mkdirSync(path.dirname(out),{recursive:true});
 fs.writeFileSync(out,JSON.stringify(receipt,null,2)+'\n');
 console.log(JSON.stringify({result:receipt.result,publishedHead:receipt.source.publishedHead,regions:receipt.source.atlasRegions.length,rankedPoints:receipt.strongestSourceDerivedSamplePoints.length,output:out}));
}
