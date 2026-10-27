/** Source-first actual Gen2928 groundcover mask census.
 * Calculates published GLSL land factors at deterministic world XZ coordinates.
 * No shader, asset, vegetation, geometry, camera, or publication mutations.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {sampleHEarthRun8BSuccessorTerrainField} from '../../terrain/h-earth.successor-terrain-field.run8b.js';
import {getHEarthSignedCoastDistanceMeters} from '../../../showroom/globe/h-earth/render/gpu-upload-views.run8e-r2d.js';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../..');
const renderer=fs.readFileSync(path.join(root,'showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js'),'utf8');
const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
if(sha(renderer)!=='fa6acc426c75c3b2292b3ed76a756157698d8e7a5562511ad7ced5af58e25dec')throw Error('PUBLISHED_RENDERER_SHA_DRIFT');
for(const anchor of ['float groundcoverOasisX=max(max(-18.0-world.x,0.0),world.x-34.0);','float groundcoverEstateX=max(max(18.0-world.x,0.0),world.x-132.0);','float groundcoverPatch=smoothstep(','float groundcoverWeight=0.88*groundcoverPatch*','(1.0-0.25*groundcoverPatchContinuity)*','float groundcoverSuitability='])
 if(!renderer.includes(anchor))throw Error('PUBLISHED_PROTECTION_SOURCE_CHANGED:'+anchor);
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
const smooth=(a,b,v)=>{const f=clamp((v-a)/(b-a));return f*f*(3-2*f);};
const fract=v=>v-Math.floor(v);
const hash21=(xx,yy)=>{let x=fract(xx*123.34),y=fract(yy*456.21);const d=x*(x+45.32)+y*(y+45.32);x+=d;y+=d;return fract(x*y);};
const noise2=(x,y)=>{const ix=Math.floor(x),iy=Math.floor(y);let fx=fract(x),fy=fract(y);fx=fx*fx*(3-2*fx);fy=fy*fy*(3-2*fy);
 const a=hash21(ix,iy),b=hash21(ix+1,iy),c=hash21(ix,iy+1),d=hash21(ix+1,iy+1);
 return ((a*(1-fx)+b*fx)*(1-fy)+(c*(1-fx)+d*fx)*fy);};
const distOutside=([x0,z0,x1,z1],x,z)=>Math.hypot(Math.max(x0-x,0,x-x1),Math.max(z0-z,0,z-z1));
function sampleGroundcover(x,z){
 const t=sampleHEarthRun8BSuccessorTerrainField(x,z);
 if(t?.valid!==true||!Number.isFinite(t.normal?.y)||!Number.isFinite(t.elevation))throw Error('TERRAIN_SOURCE_INVALID:'+x+','+z);
 const slope=1-clamp(t.normal.y),elevationMix=smooth(-1,34,t.elevation),rockExposure=clamp(smooth(.16,.68,slope)*.72+elevationMix*.10);
 const distance=Math.max(0,getHEarthSignedCoastDistanceMeters(x,z));
 const broad=noise2(x*.035,z*.035),macro=noise2(x*.018+5,z*.018-11),meso=noise2(x*.082-13,z*.082+7);
 const domainX=(.8*x-.6*z)*.018+5+.65*(broad-.5),domainZ=(.6*x+.8*z)*.018-11+.65*(macro-.5);
 const organic=noise2(domainX,domainZ),patch=smooth(.20,.66,organic*.78+meso*.22);
 const continuity=smooth(.30,.85,patch);
 const xOasis=distOutside([-18,-204,34,-131],x,z),xEstate=distOutside([18,-210,132,-125],x,z);
 const routeT=clamp((z-x+192)/96),routeD=Math.hypot(x-(48-48*routeT),z-(-144+48*routeT));
 // Published shader: protectedGrove=1-smooth(22,42,d), then protection multiplies (1-protectedGrove).
 const grove=smooth(22,42,Math.hypot(x+139.40268,z+210.74617));
 const protection=smooth(0,12,xOasis)*smooth(0,10,xEstate)*smooth(4,9,routeD)*grove;
 const coastSuit=smooth(28,72,distance),slopeSuit=1-smooth(.12,.42,slope),rockSuit=1-smooth(.18,.58,rockExposure);
 const suitability=coastSuit*slopeSuit*rockSuit;
 const maxPossible=.88*patch*(1-.25*continuity)*protection;
 const weight=maxPossible*suitability;
 return {x,z,elevation:t.elevation,slope,rockExposure,coastDistance:distance,patch,suitability,protection,weight,maxPossible,source:'RUN8B_CANONICAL_FIELD_AND_GLSL_SCALAR_CPU_EMULATION'};
}
const round=x=>Number(x.toFixed(6));
const compact=v=>Object.fromEntries(Object.entries(v).map(([k,x])=>[k,typeof x==='number'?round(x):x]));
const estate=[];
for(let z=-208;z<=-126;z+=2){
 const inside=sampleGroundcover(130,z),near=sampleGroundcover(134,z),middle=sampleGroundcover(138,z),outside=sampleGroundcover(144,z);
 if(inside.weight>1e-7)throw Error('PROTECTED_ESTATE_HAS_GROUNDCOVER:'+z);
 estate.push({z,inside:compact(inside),twoMetresOutside:compact(near),sixMetresOutside:compact(middle),twelveMetresOutside:compact(outside),
  increaseAtFullDistance:round(outside.weight-inside.weight)});
}
const ranked=estate.toSorted((a,b)=>b.increaseAtFullDistance-a.increaseAtFullDistance);
const stats={transects:estate.length,positiveBeyond12m:estate.filter(x=>x.twelveMetresOutside.weight>.02).length,
 maxExactApproximateBlend:ranked[0].increaseAtFullDistance,
 maxPoint:ranked[0],top:ranked.slice(0,14).map(x=>({z:x.z,insideWeight:x.inside.weight,at2m:x.twoMetresOutside.weight,at6m:x.sixMetresOutside.weight,at12m:x.twelveMetresOutside.weight,suitabilityAt12m:x.twelveMetresOutside.suitability,patchAt12m:x.twelveMetresOutside.patch}))};
const inlandFar=[];
for(let z=-770;z<=-650;z+=10)for(let x=-240;x<=-160;x+=10){
 const s=sampleGroundcover(x,z);
 inlandFar.push({x,z,patch:round(s.patch),actualBlend:round(s.weight),suitability:round(s.suitability),protection:round(s.protection)});
}
const result={
 schema:'H_EARTH_GEN2935_PUBLISHED_GROUNDCOVER_SOURCE_SPATIAL_CENSUS_v1',
 head:'cb57c275b95d0d48883bc4da4dcfcf17cbec5060',
 rendererSha256:sha(renderer),
 result:'SOURCE_PROTECTION_AND_ORGANIC_PATCH_SCALAR_CALCULATED',
 formula:'EXACT_PUBLISHED_GLSL_SCALAR_LAWS_WITH_JS_DOUBLE_NOISE_AND_CANONICAL_RUN8B_SAMPLE_NOT_FINAL_GPU_PIXEL_COLOR',
 estateBoundary:{kind:'ACTUAL_GROUNDCOVER_PROTECTION_RECTANGLE',worldBounds:[18,-210,132,-125],straightEastEdgeX:132,extentZ:[-210,-125],outsideRampMetres:10,stats,allTransects:estate},
 inlandFarGrid:{kind:'PROCEDURAL_ORGANIC_NOISE_PATCH',sampleCount:inlandFar.length,maxWeight:Math.max(...inlandFar.map(x=>x.actualBlend)),minWeight:Math.min(...inlandFar.map(x=>x.actualBlend)),cells:inlandFar},
 limitations:'Run8B canonical derivative differs slightly from interpolated GPU geometric normals. JavaScript double precision noise is an approximation to fragment GPU float. Visibility, primitive ownership, habitat/soil overlays and final lit RGB require matching renderer frame. No owner screenshot exact camera match.',
 noProductModification:true,noRelease:true
};
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const argv=process.argv.slice(2);if(argv.length!==2||argv[0]!=='--output')throw Error('REQUIRE_OUTPUT');
 const p=path.resolve(argv[1]);fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,JSON.stringify(result,null,2)+'\n');
 console.log(JSON.stringify({result:result.result,estate:stats,farGridMax:result.inlandFarGrid.maxWeight,farGridMin:result.inlandFarGrid.minWeight,output:p}).slice(0,4000));
}
