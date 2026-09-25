/**
 * H_EARTH_R2_DEPTH_OWNERSHIP_INSTRUMENT_v1
 * Read-only epistemic measurement instrument.
 * Frozen subject: 53305f5dfcdce51406363cba21c665d4e44701ad
 * Product geometry / renderer / representation mutation: PROHIBITED.
 */
import { constructHEarthRun8BSuccessorTerrainAndMountain } from '../../showroom/globe/h-earth/render/geometry-successor-terrain.run8b.js';
import { constructHEarthDistantContextGeometry } from '../../showroom/globe/h-earth/render/geometry-distant-context.js';

const WITNESSES = Object.freeze([5937,6160,5936,5935,5713]);
const CAMERA = Object.freeze({
  position:Object.freeze({x:28,y:10.5,z:-82}),
  target:Object.freeze({x:-34,y:5.5,z:-214}),
  up:Object.freeze({x:0,y:1,z:0}),
  verticalFovDegrees:56,nearPlane:.25,farPlane:512
});
const VIEWPORT=Object.freeze({width:1440,height:900});
const finite=n=>typeof n==='number'&&Number.isFinite(n);
const v=(x=0,y=0,z=0)=>({x,y,z});
const sub=(a,b)=>v(a.x-b.x,a.y-b.y,a.z-b.z);
const mul=(a,s)=>v(a.x*s,a.y*s,a.z*s);
const dot=(a,b)=>a.x*b.x+a.y*b.y+a.z*b.z;
const cross=(a,b)=>v(a.y*b.z-a.z*b.y,a.z*b.x-a.x*b.z,a.x*b.y-a.y*b.x);
const len=a=>Math.hypot(a.x,a.y,a.z);
const norm=a=>{const m=len(a);if(!(m>Number.EPSILON))throw new Error('DEGENERATE_CAMERA_BASIS');return mul(a,1/m)};
const forward=norm(sub(CAMERA.target,CAMERA.position));
const right=norm(cross(forward,CAMERA.up));
const up=norm(cross(right,forward));
const focal=1/Math.tan(CAMERA.verticalFovDegrees*Math.PI/360);
const aspect=VIEWPORT.width/VIEWPORT.height;
const basis=Object.freeze({...CAMERA,forward,right,up,focal});
const cam=p=>{const r=sub(p,basis.position);return{x:dot(r,basis.right),y:dot(r,basis.up),z:dot(r,basis.forward)}};
const pd=(p,plane)=>{switch(plane){case'NEAR':return p.z-basis.nearPlane;case'FAR':return basis.farPlane-p.z;case'LEFT':return p.x+p.z*aspect/basis.focal;case'RIGHT':return p.z*aspect/basis.focal-p.x;case'BOTTOM':return p.y+p.z/basis.focal;case'TOP':return p.z/basis.focal-p.y;default:return NaN}};
const interp=(a,b,t)=>({x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t,z:a.z+(b.z-a.z)*t});
function clipPlane(points,plane){if(!points.length)return[];const out=[];let prev=points.at(-1),dp=pd(prev,plane),pin=finite(dp)&&dp>=0;for(const cur of points){const dc=pd(cur,plane),cin=finite(dc)&&dc>=0;if(cin!==pin){const den=dp-dc;if(finite(den)&&Math.abs(den)>Number.EPSILON)out.push(interp(prev,cur,Math.max(0,Math.min(1,dp/den))))}if(cin)out.push(cur);prev=cur;dp=dc;pin=cin}return out}
function clip(points){let p=[...points];for(const plane of['NEAR','FAR','LEFT','RIGHT','BOTTOM','TOP']){p=clipPlane(p,plane);if(!p.length)break}return p}
function project(p){return{x:(p.x*basis.focal/(p.z*aspect)+1)*.5*VIEWPORT.width,y:(1-p.y*basis.focal/p.z)*.5*VIEWPORT.height,z:p.z,invZ:1/p.z}}
function fragments(primitive,family){const vs=primitive.geometry.vertices,is=primitive.geometry.indices,out=[];for(let ti=0,o=0;o+2<is.length;o+=3,ti++){const world=[vs[is[o]],vs[is[o+1]],vs[is[o+2]]],clipped=clip(world.map(cam));if(clipped.length<3)continue;for(let fan=1;fan+1<clipped.length;fan++){let pts=[project(clipped[0]),project(clipped[fan]),project(clipped[fan+1])];let area=(pts[1].x-pts[0].x)*(pts[2].y-pts[0].y)-(pts[1].y-pts[0].y)*(pts[2].x-pts[0].x);if(!finite(area)||Math.abs(area)<1e-7)continue;if(area<0){pts=[pts[0],pts[2],pts[1]];area=-area}out.push({family,primitiveId:primitive.primitiveId,sourceTriangleIndex:ti,points:pts,area})}}return out}
const edge=(a,b,x,y)=>(x-a.x)*(b.y-a.y)-(y-a.y)*(b.x-a.x);
function sample(fragment,x,y){const [a,b,c]=fragment.points,area=edge(a,b,c.x,c.y),w0=edge(b,c,x,y)/area,w1=edge(c,a,x,y)/area,w2=edge(a,b,x,y)/area;if(w0< -1e-8||w1< -1e-8||w2< -1e-8)return null;
 // Renderer-equivalent camera-depth interpolation at raster pixel center.
 // Current renderer linearly interpolates projected camera z using screen barycentrics.
 const z=w0*a.z+w1*b.z+w2*c.z;return finite(z)?z:null}
function bbox(f){const p=f.points;return{minX:Math.max(0,Math.floor(Math.min(...p.map(q=>q.x)))),maxX:Math.min(VIEWPORT.width-1,Math.ceil(Math.max(...p.map(q=>q.x)))),minY:Math.max(0,Math.floor(Math.min(...p.map(q=>q.y)))),maxY:Math.min(VIEWPORT.height-1,Math.ceil(Math.max(...p.map(q=>q.y))))}}
function primitiveByFarClass(dc,c){return dc.primitives.find(p=>p?.metadata?.farSurfaceClass===c)}
const terrainResult=constructHEarthRun8BSuccessorTerrainAndMountain();
const dc=constructHEarthDistantContextGeometry({cameraWorld:CAMERA.position});
if(terrainResult?.ok!==true||dc?.ok!==true)throw new Error('FROZEN_CONSTRUCTOR_FAILURE');
const terrain=terrainResult.primitive,ocean=primitiveByFarClass(dc,'OCEAN'),land=primitiveByFarClass(dc,'LAND');
if(!terrain||!ocean||!land)throw new Error('REQUIRED_PRIMITIVE_MISSING');
const tf=fragments(terrain,'RUN8B'),of=fragments(ocean,'FAR_OCEAN'),lf=fragments(land,'FAR_LAND');
const competitors=[...tf,...lf];
const witnessFragments=new Map(WITNESSES.map(id=>[id,of.filter(f=>f.sourceTriangleIndex===id)]));
const rows=[];
for(const witness of WITNESSES){const wf=witnessFragments.get(witness)??[];const pixels=new Map();
 for(const f of wf){const b=bbox(f);for(let y=b.minY;y<=b.maxY;y++)for(let x=b.minX;x<=b.maxX;x++){const px=x+.5,py=y+.5,oz=sample(f,px,py);if(oz===null)continue;const key=y*VIEWPORT.width+x;const prior=pixels.get(key);if(!prior||oz<prior.oceanDepth)pixels.set(key,{x,y,oceanDepth:oz})}}
 let sharedRun8B=0,sharedLand=0,oceanWins=0,run8bWins=0,landWins=0;const deltas=[];const winnerCounts=new Map();
 for(const p of pixels.values()){let best={family:'FAR_OCEAN',primitiveId:ocean.primitiveId,sourceTriangleIndex:witness,depth:p.oceanDepth};let sawRun=false,sawLand=false;
  for(const c of competitors){const b=bbox(c);if(p.x<b.minX||p.x>b.maxX||p.y<b.minY||p.y>b.maxY)continue;const z=sample(c,p.x+.5,p.y+.5);if(z===null)continue;if(c.family==='RUN8B')sawRun=true;else sawLand=true;if(z<best.depth)best={family:c.family,primitiveId:c.primitiveId,sourceTriangleIndex:c.sourceTriangleIndex,depth:z}}
  if(sawRun)sharedRun8B++;if(sawLand)sharedLand++;if(best.family==='FAR_OCEAN')oceanWins++;else if(best.family==='RUN8B')run8bWins++;else landWins++;
  winnerCounts.set(`${best.family}:${best.sourceTriangleIndex}`,(winnerCounts.get(`${best.family}:${best.sourceTriangleIndex}`)??0)+1);
  const ds=[p.oceanDepth];for(const c of competitors){const b=bbox(c);if(p.x<b.minX||p.x>b.maxX||p.y<b.minY||p.y>b.maxY)continue;const z=sample(c,p.x+.5,p.y+.5);if(z!==null)ds.push(z)}ds.sort((a,b)=>a-b);if(ds.length>1)deltas.push(ds[1]-ds[0]);
 }
 deltas.sort((a,b)=>a-b);const med=deltas.length?deltas[Math.floor(deltas.length/2)]:null,min=deltas.length?deltas[0]:null;
 const dominant=[...winnerCounts.entries()].sort((a,b)=>b[1]-a[1])[0]??null;
 rows.push({witness,coveredPixels:pixels.size,sharedRun8B,sharedFarLand:sharedLand,oceanWins,run8bWins,farLandWins:landWins,oceanWinPercent:pixels.size?100*oceanWins/pixels.size:0,dominantWinner:dominant?.[0]??null,dominantWinnerPixels:dominant?.[1]??0,minimumDepthDelta:min,medianDepthDelta:med});
}
const disposition=rows.every(r=>r.oceanWins>r.run8bWins+r.farLandWins)?'OCEAN_DEPTH_OWNERSHIP_CONFIRMED':rows.every(r=>r.run8bWins>r.oceanWins+r.farLandWins)?'RUN8B_DEPTH_OWNERSHIP_CONFIRMED':rows.every(r=>r.farLandWins>r.oceanWins+r.run8bWins)?'FAR_LAND_DEPTH_OWNERSHIP_CONFIRMED':'MIXED_OR_NONIDENTIFIABLE';
const receipt={instrument:'H_EARTH_R2_DEPTH_OWNERSHIP_INSTRUMENT_v1',immutableSubject:'53305f5dfcdce51406363cba21c665d4e44701ad',camera:CAMERA,viewport:VIEWPORT,witnesses:WITNESSES,fragmentCounts:{run8b:tf.length,farOcean:of.length,farLand:lf.length},rows,disposition,geometryMutation:false,representationLawMutation:false};
console.log(JSON.stringify(receipt,null,2));
