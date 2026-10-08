/** Bounded western woodland candidate. South constructs; caller owns West admission.
 * Stable identities/hash channels do not consume an order-dependent random stream.
 * Ground anchors use the rendered Float32 NEAR triangles, never a second surface.
 */
import {constructHEarthTriangleMesh,H_EARTH_3D_GEOMETRY_SOUTH_ENUMS as E} from './geometry-kernel.south.js';
import {H_EARTH_GEN311_ESTATE_PLACEMENT_POLICY as policy} from '../../../../h-earth-3d/environment/h-earth.gen2514-qualified-placement-authority.js';
import {sampleHEarthRun8CSuccessorSurfaceMaterial} from '../../../../h-earth-3d/environment/h-earth.gen2514-qualified-surface-material.run8c.js';
import {buildHEarthWoodlandGrassTuft} from './grass-lowland-trial.js?cb=meadow-fan-20261006';
const SEED='WEST_WOODLAND_P2_20261006';
const hash=(id,channel)=>{let h=2166136261;for(const c of `${SEED}:${id}:${channel}`)h=Math.imul(h^c.charCodeAt(0),16777619);return (h>>>0)/4294967296;};
const bounds={minX:-180,maxX:-24,minZ:-380,maxZ:-190};
const mesh=()=>({vertices:[],indices:[],colors:[]});
const v=(m,x,y,z,c)=>{m.vertices.push({x,y,z});m.colors.push(c.map((q,i)=>i===3?255:Math.max(0,Math.min(255,Math.round(q)))));return m.vertices.length-1;};
const face=(m,a,b,c)=>m.indices.push(a,b,c);
function segmentDistance(x,z,a,b){const dx=b.x-a.x,dz=b.z-a.z,t=Math.max(0,Math.min(1,((x-a.x)*dx+(z-a.z)*dz)/(dx*dx+dz*dz)));return Math.hypot(x-a.x-t*dx,z-a.z-t*dz);}
function clearFootprint(x,z,r){
  if(x-r<bounds.minX||x+r>bounds.maxX||z-r<bounds.minZ||z+r>bounds.maxZ)return false;
  for(const b of [policy.manorCore,policy.gardens,policy.outbuildingProposal,policy.acceptedEnvelope,policy.viewProposal])if(Math.hypot(x-Math.max(b.minX,Math.min(b.maxX,x)),z-Math.max(b.minZ,Math.min(b.maxZ,z)))<=r)return false;
  return !policy.footRoute.slice(1).some((b,i)=>segmentDistance(x,z,policy.footRoute[i],b)<=r+policy.footRouteRadius);
}
function sampler(primitive){
  const g=primitive?.geometry;if(!Array.isArray(g?.vertices)||!Array.isArray(g?.indices))return null;
  const bins=new Map(),key=(x,z)=>`${Math.floor(x/16)},${Math.floor(z/16)}`;
  for(let i=0;i<g.indices.length;i+=3){const t=g.indices.slice(i,i+3).map(j=>{const p=g.vertices[j];return{x:Math.fround(p.x),y:Math.fround(p.y),z:Math.fround(p.z)};});
    const loX=Math.min(...t.map(p=>p.x)),hiX=Math.max(...t.map(p=>p.x)),loZ=Math.min(...t.map(p=>p.z)),hiZ=Math.max(...t.map(p=>p.z));
    if(hiX<bounds.minX||loX>bounds.maxX||hiZ<bounds.minZ||loZ>bounds.maxZ)continue;
    for(let x=Math.floor(loX/16);x<=Math.floor(hiX/16);x++)for(let z=Math.floor(loZ/16);z<=Math.floor(hiZ/16);z++){const k=`${x},${z}`;if(!bins.has(k))bins.set(k,[]);bins.get(k).push({t,triangle:i/3});}
  }
  const exactSamples=new Map();
  const evaluate=(x,z)=>{for(const {t:[a,b,c],triangle} of bins.get(key(x,z))??[]){const d=(b.z-c.z)*(a.x-c.x)+(c.x-b.x)*(a.z-c.z);if(Math.abs(d)<1e-10)continue;const u=((b.z-c.z)*(x-c.x)+(c.x-b.x)*(z-c.z))/d,w=((c.z-a.z)*(x-c.x)+(a.x-c.x)*(z-c.z))/d,q=1-u-w;if(Math.min(u,w,q)<-1e-7)continue;const dx=((b.y-a.y)*(c.z-a.z)-(c.y-a.y)*(b.z-a.z))/((b.x-a.x)*(c.z-a.z)-(c.x-a.x)*(b.z-a.z)),dz=((b.x-a.x)*(c.y-a.y)-(c.x-a.x)*(b.y-a.y))/((b.x-a.x)*(c.z-a.z)-(c.x-a.x)*(b.z-a.z));return{y:u*a.y+w*b.y+q*c.y,slope:Math.hypot(dx,dz),triangle};}return null;};
  // Repeated root-support and eligibility checks share exact Number coordinates.
  // Keep the original bin scan, triangle order and arithmetic on every cache miss.
  return(x,z)=>{
    if(!Number.isFinite(x)||!Number.isFinite(z)||x===0||z===0)return evaluate(x,z);
    let row=exactSamples.get(x);
    if(row?.has(z)){const result=row.get(z);return result?{...result}:null;}
    const result=evaluate(x,z);
    if(!row){row=new Map();exactSamples.set(x,row);}
    row.set(z,result);
    return result;
  };
}
// Closed tapered branch, including basal root flare. Its own axial frame avoids
// skewed horizontal branch cross-sections and preserves consistent winding.
function branch(m,a,b,r0,r1,color){const d=[b[0]-a[0],b[1]-a[1],b[2]-a[2]],len=Math.hypot(...d);d.forEach((q,i)=>d[i]=q/len);let u=[d[1],-d[0],0];const ul=Math.hypot(...u);u=u.map(q=>q/ul);const w=[d[1]*u[2]-d[2]*u[1],d[2]*u[0]-d[0]*u[2],d[0]*u[1]-d[1]*u[0]];const ids=[];
 for(let k=0;k<2;k++)for(let j=0;j<6;j++){const t=j*Math.PI/3,r=k?r1:r0,p=k?b:a;ids.push(v(m,...p.map((q,i)=>q+r*(u[i]*Math.cos(t)+w[i]*Math.sin(t))),color.map((q,i)=>i===3?q:q*(.76+.24*Math.cos(t-.5)))));}
 for(let j=0;j<6;j++){const n=(j+1)%6;face(m,ids[j],ids[n],ids[6+j]);face(m,ids[n],ids[6+n],ids[6+j]);}for(let j=1;j<5;j++){face(m,ids[0],ids[j+1],ids[j]);face(m,ids[6],ids[6+j],ids[6+j+1]);}
}
function lobe(m,id,c,r,color,rough=.13){const base=m.vertices.length,indexStart=m.indices.length;
 const bottom=v(m,c[0],c[1]-r[1],c[2],color.map((q,i)=>i===3?q:q*.55));
 for(let j=1;j<=3;j++){const phi=j*Math.PI/4;for(let k=0;k<8;k++){const theta=k*Math.PI/4,noise=1+rough*(hash(id,`lobe-${j}-${k}`)-.5)*2;const light=.58+.29*(1-Math.cos(phi))*.5+.12*Math.cos(theta-.7);v(m,c[0]+r[0]*Math.sin(phi)*Math.cos(theta)*noise,c[1]-r[1]*Math.cos(phi),c[2]+r[2]*Math.sin(phi)*Math.sin(theta)*noise,color.map((q,i)=>i===3?q:q*light));}}
 const top=v(m,c[0],c[1]+r[1],c[2],color);for(let k=0;k<8;k++){const n=(k+1)%8;face(m,bottom,base+1+n,base+1+k);for(let j=0;j<2;j++){const a=base+1+j*8+k,b=base+1+j*8+n;face(m,a,b,a+8);face(m,b,b+8,a+8);}face(m,base+17+k,base+17+n,top);}for(let i=indexStart;i<m.indices.length;i+=3){const q=m.indices[i+1];m.indices[i+1]=m.indices[i+2];m.indices[i+2]=q;}
}
// Three scaffold families only affect A; other authored trees keep their bytes.
function openWoodlandTree(bark,foliage,p,height,leanX,leanZ) {
 const {id,x,z,radius,anchor}=p,y=anchor.y,style=Number(id.slice(-2))%3;
 const rotation=hash(id,'open-scaffold-heading')*Math.PI*2;
 const forkHeight=height*[.38,.54,.30][style];
 const trunkRadius=.32+height*.018;
 branch(bark,[x,y,z],[x+leanX*.7,y+forkHeight,z+leanZ*.7],trunkRadius,.19,[93,75,52,255]);
 const count=[4,5,6][style],crownParts=[];
 for(let j=0;j<count;j++){
  const angle=rotation+j*(style===1?2.4:Math.PI*2/count),reach=radius*(style===1?.40:.48)*(j%2?.86:1);
  const dx=Math.cos(angle)*reach,dz=Math.sin(angle)*reach;
  const level=style===0?(j<2?.78:.61):style===1?(.51+j*.095):(.66+(j%3)*.055);
  const center=[x+dx,y+height*level,z+dz],r=radius*(style===1?.34:.36),ry=radius*(style===2?.32:.38);
  const elbow=[x+dx*.51,y+forkHeight+(height*level-forkHeight)*.49,z+dz*.51];
  branch(bark,[x+leanX*.7,y+forkHeight,z+leanZ*.7],elbow,.19-j*.014,.10,[94,76,53,255]);
  branch(bark,elbow,center,.105,.035,[94,76,53,255]);
  lobe(foliage,`${id}:OPEN:${j}`,center,[r,ry,r*.79],[76+hash(id,'tint')*22,100+hash(id,'tint')*22,44+hash(id,'tint')*12,255],.25);
  crownParts.push({x:center[0],y:center[1],z:center[2],radius:r*1.25,heightRadius:ry});
  if(j<2){
   const satellite=[center[0]+Math.cos(angle+1.1)*radius*.18,center[1]+ry*(j?.35:-.3),center[2]+Math.sin(angle+1.1)*radius*.18],sr=radius*(j?.19:.16);
   lobe(foliage,`${id}:SATELLITE:${j}`,satellite,[sr,sr*.72,sr*.85],[80+hash(id,'tint')*22,105+hash(id,'tint')*22,47+hash(id,'tint')*12,255],.25);
   crownParts.push({x:satellite[0],y:satellite[1],z:satellite[2],radius:sr*1.25,heightRadius:sr*.72});
  }
 }
 return{style:['LEANING_OPEN_FORK','INTERRUPTED_TALL_SCAFFOLD','ASYMMETRIC_LOW_SPREAD'][style],crownParts,trunkRadius};
}
function fractureWedge(m,id,x,y,z,r,h,side,rotation) {
 const start=m.vertices.length,lo=side<0?-.92:.045,hi=side<0?-.045:.89;
 const corners=[[lo,-.62],[hi,-.55],[hi*.93,.60],[lo*.91,.50]],c=Math.cos(rotation),s=Math.sin(rotation);
 for(let layer=0;layer<2;layer++)for(let j=0;j<4;j++){
  const taper=layer?.63+.17*hash(id,`fracture-taper-${side}-${j}`):1;
  const dx=corners[j][0]*taper+(layer?.11*side:0),dz=corners[j][1]*taper+(layer?-.09:0),height=layer?h*(.48+.34*hash(id,`fracture-top-${side}-${j}`)+(j===2?.18:0)):-.65;
  v(m,x+r*(dx*c-dz*s),y+height,z+r*(dx*s+dz*c),[128,118,95,255].map((q,i)=>i===3?q:q*(layer?.93+.1*hash(id,`rock-light-${j}`):.58)));
 }
 for(const f of [[0,1,2],[0,2,3],[4,6,5],[4,7,6]])face(m,...f.map(i=>start+i));
 for(let j=0;j<4;j++){const n=(j+1)%4;face(m,start+j,start+j+4,start+n);face(m,start+n,start+j+4,start+n+4);}
 return start;
}
// Witness the actual polygon edges, not just an analytic center. Sampling every
// quarter edge also catches changes of supporting NEAR triangle within a collar.
function burySupport(m, start, ringStart, count, ground, wholeObject) {
 const samples=[];
 for(let j=0;j<count;j++){
  const a=m.vertices[ringStart+j],b=m.vertices[ringStart+(j+1)%count];
  for(let k=0;k<4;k++){const t=k/4,x=a.x+(b.x-a.x)*t,z=a.z+(b.z-a.z)*t,y=a.y+(b.y-a.y)*t,g=ground(x,z);if(!g)return null;samples.push({x,z,surfaceY:g.y,meshY:y,groundTriangle:g.triangle});}
 }
 const minimumBurial=.12,shift=Math.max(0,...samples.map(p=>p.meshY-p.surfaceY+minimumBurial));
 const end=wholeObject?m.vertices.length:ringStart+count;
 for(let j=wholeObject?start:ringStart;j<end;j++)m.vertices[j].y-=shift;
 for(const p of samples){p.meshY-=shift;p.burial=p.surfaceY-p.meshY;}
 return{minimumBurial,downwardShift:shift,minimumMeasuredBurial:Math.min(...samples.map(p=>p.burial)),witnesses:samples};
}
export function buildHEarthLandscapeSector({terrainPrimitive,reverseGenerationOrder=false,grassCellOrder='FORWARD'}={}){
 const ground=sampler(terrainPrimitive),issues=[],manifest=[],rejections=[];
 if(!ground)return{eligible:false,primitives:[],manifest,diagnostics:{},issues:['PROJECTED_NEAR_TRIANGLES_REQUIRED']};
 const candidates=[];
 for(const [cluster,cx,cz,n,rx,rz] of [['A',-145,-230,15,23,23],['B',-125,-285,17,27,23],['C',-65,-315,15,22,20]])for(let i=0;i<n;i++){const id=`P2_TREE_${cluster}_${String(i).padStart(2,'0')}`,angle=i*2.399963229728653+hash(id,'angle'),radius=Math.sqrt((i+.4)/n);candidates.push({id,x:cx+Math.cos(angle)*radius*rx,z:cz+Math.sin(angle)*radius*rz});}
 for(let i=0;i<23;i++){const id=`P2_TREE_REAR_${String(i).padStart(2,'0')}`;if(i===9||i===10||i===17)continue;candidates.push({id,x:-171+i*6.1+(hash(id,'x')-.5)*3,z:-357+(hash(id,'z')-.5)*22});}
 if(reverseGenerationOrder)candidates.reverse();
 candidates.sort((a,b)=>a.id.localeCompare(b.id));
 const accepted=[];for(const p of candidates){const radius=2.4+hash(p.id,'crown')*2,anchor=ground(p.x,p.z),material=sampleHEarthRun8CSuccessorSurfaceMaterial(p.x,p.z);const reason=!clearFootprint(p.x,p.z,radius)?'FOOTPRINT_EXCLUDED':!anchor?'GROUND_MISSING':anchor.slope>.72?'STEEP_SLOPE':!['LOWLAND_SOIL','COASTAL_SOIL'].includes(material?.surfaceClass)?'HABITAT_EXCLUDED':accepted.some(q=>Math.hypot(p.x-q.x,p.z-q.z)<(radius+q.radius)*.65)?'TRUNK_SPACING_CONFLICT':null;if(reason){rejections.push({id:p.id,reason});continue;}accepted.push({...p,radius,anchor,material});}
 accepted.sort((a,b)=>a.id.localeCompare(b.id));const bark=mesh(),foliage=mesh(),stone=mesh(),grass=mesh();
 for(const p of accepted){const {id,x,z,radius,anchor}=p,y=anchor.y,height=8+hash(id,'height')*8,leanX=(hash(id,'leanX')-.5)*1.1,leanZ=(hash(id,'leanZ')-.5)*1.1;
 const barkVertexStart=bark.vertices.length,canopyVertexStart=foliage.vertices.length;
 let scaffold=null;
 if(id.startsWith('P2_TREE_A_'))scaffold=openWoodlandTree(bark,foliage,p,height,leanX,leanZ);else {
 branch(bark,[x,y,z],[x+leanX,y+height*.72,z+leanZ],.32+height*.018,.10,[93,75,52,255]);
 for(let j=0;j<5;j++){const angle=j*2.399+hash(id,'rotation')*6.28,offset=j===4?.15:radius*.33,dx=Math.cos(angle)*offset,dz=Math.sin(angle)*offset,cy=y+height*(j===4?.81:.62+hash(id,`tier${j}`)*.1);branch(bark,[x+leanX*.35,y+height*.35,z+leanZ*.35],[x+dx,cy,z+dz],.15,.055,[94,76,53,255]);const r=radius*(j===4?.59:.58);lobe(foliage,`${id}:${j}`,[x+dx,cy,z+dz],[r,(y+height-cy)*(j===4?1:.76),r*.92],[72+hash(id,'tint')*22,99+hash(id,'tint')*22,42+hash(id,'tint')*12,255]);}
 }
 const support=burySupport(bark,barkVertexStart,barkVertexStart,6,ground,false);if(!support){issues.push(`ROOT_SUPPORT_MISSING:${id}`);continue;}
 manifest.push({...(scaffold?{scaffoldStyle:scaffold.style,crownParts:scaffold.crownParts,trunkRadius:scaffold.trunkRadius,refinementCluster:'A'}:{}),support,barkVertexStart,barkVertexCount:bark.vertices.length-barkVertexStart,canopyVertexStart,canopyVertexCount:foliage.vertices.length-canopyVertexStart,id,kind:'TREE',x,y,z,height,crownRadius:radius,groundTriangle:anchor.triangle,groundSlope:anchor.slope,surfaceClass:p.material.surfaceClass,footprintClear:true});
 }
 for(let i=0;i<14;i++){
  const id=`P2_ROCK_${String(i).padStart(2,'0')}`,x=-79+i*2.65+(hash(id,'x')-.5)*5,z=-239+i*1.9+(hash(id,'z')-.5)*8,r=2+hash(id,'size')*2.7,a=ground(x,z);
  if(!a||!clearFootprint(x,z,r*1.35))continue;
  const h=1.5+hash(id,'height')*2.5,stoneVertexStart=stone.vertices.length,supportRings=[],witnesses=[];
  for(const side of [-1,1]){
   const start=fractureWedge(stone,id,x,a.y,z,r,h,side,hash(id,'fracture-heading')*6.28),support=burySupport(stone,start,start,4,ground,true);
   if(!support){issues.push(`ROCK_SUPPORT_MISSING:${id}`);continue;}
   supportRings.push({start,count:4});witnesses.push(...support.witnesses);
  }
  manifest.push({support:{minimumBurial:.12,minimumMeasuredBurial:Math.min(...witnesses.map(p=>p.burial)),witnesses},supportRings,stoneVertexStart,stoneVertexCount:stone.vertices.length-stoneVertexStart,id,kind:'ROCK',form:'PAIRED_FRACTURE_WEDGES',x,y:a.y,z,height:h*.86,crownRadius:r*1.35,groundTriangle:a.triangle,footprintClear:true});
 }
 // One authored ecotone replaces A grass; all existing tree/rock construction stays intact.
 const trialSeed='ECOTONE_A_MEADOW_COVER_20261006';
 const trialHash=(id,channel)=>{let h=2166136261;for(const c of `${trialSeed}:${id}:${channel}`)h=Math.imul(h^c.charCodeAt(0),16777619);return(h>>>0)/4294967296;};
 const smooth=(a,b,value)=>{const t=Math.max(0,Math.min(1,(value-a)/(b-a)));return t*t*(3-2*t);};
 const clusterTrees=manifest.filter(p=>p.refinementCluster==='A'),allTrees=manifest.filter(p=>p.kind==='TREE');
 const ellipse=(x,z)=>Math.hypot((x+141)/33,(z+226)/32);
 const walkingDistance=(x,z)=>segmentDistance(x,z,{x:-145,z:-194},{x:-145,z:-230});
 const reservationClear=(x,z,r)=>clearFootprint(x,z,r)&&![policy.terrainBuffer].filter(Boolean).some(b=>Math.hypot(x-Math.max(b.minX,Math.min(b.maxX,x)),z-Math.max(b.minZ,Math.min(b.maxZ,z)))<=r);
 const insideTrial=(x,z)=>ellipse(x,z)<=1&&walkingDistance(x,z)>1.5&&reservationClear(x,z,0);
 const groundReason=(x,z)=>{const t=ground(x,z),m=sampleHEarthRun8CSuccessorSurfaceMaterial(x,z);return !t?'GROUND_MISSING':t.slope>.45?'STEEP_SLOPE':!['LOWLAND_SOIL','COASTAL_SOIL'].includes(m?.surfaceClass)?'HABITAT_EXCLUDED':allTrees.some(p=>Math.hypot(x-p.x,z-p.z)<(p.trunkRadius??(.32+p.height*.018))+.5)?'TRUNK_CLEARANCE':null;};
 const grassEligible=(x,z)=>insideTrial(x,z)&&groundReason(x,z)===null;
 const sample=(x,z)=>{const g=ground(x,z);return g?{x,y:Math.fround(g.y),z,triangleId:g.triangle,terrainPrimitiveId:terrainPrimitive.primitiveId}:null;};
 const grassCells=[];
 for(let iz=0;iz<=25;iz++)for(let ix=0;ix<=22;ix++){
  const id=`MEADOW_COVER_${ix}_${iz}`,jitterAngle=trialHash(id,'center-jitter-angle')*Math.PI*2,jitterRadius=Math.sqrt(trialHash(id,'center-jitter-radius'))*.90;
  grassCells.push({id,ix,iz,x:-174+ix*3+(iz%2)*1.5+Math.cos(jitterAngle)*jitterRadius,z:-258+iz*3*Math.sqrt(3)/2+Math.sin(jitterAngle)*jitterRadius});
 }
 const densityField=(x,z)=>{const fx=(x+174)/9,fz=(z+258)/9,ix=Math.floor(fx),iz=Math.floor(fz),u=fx-ix,v=fz-iz,at=(a,b)=>trialHash(`FIELD_${a}_${b}`,'density');return at(ix,iz)*(1-u)*(1-v)+at(ix+1,iz)*u*(1-v)+at(ix,iz+1)*(1-u)*v+at(ix+1,iz+1)*u*v;};
 if(reverseGenerationOrder||grassCellOrder==='REVERSE')grassCells.reverse();
 if(grassCellOrder==='CHUNKED')grassCells.sort((a,b)=>(a.ix%3)-(b.ix%3)||b.iz-a.iz);
 const grassCandidates=[],grassDecisions=[];
 for(const p of grassCells){
  const {id,x,z}=p,radial=ellipse(x,z),canopy=clusterTrees.reduce((n,t)=>Math.max(n,1-smooth(.48,1.08,Math.hypot(x-t.x,z-t.z)/t.crownRadius)),0),edge=smooth(0,8,(1-radial)*32),density=(.18+.70*(1-canopy))*edge,selection=densityField(x,z),g=ground(x,z),material=sampleHEarthRun8CSuccessorSurfaceMaterial(x,z);
  const reason=radial>1?'OUTSIDE_TRIAL':walkingDistance(x,z)<=2.3?'WALKING_CAPSULE_MARGIN':!reservationClear(x,z,.8)?'FOOTPRINT_EXCLUDED':groundReason(x,z)??(selection>density?'DENSITY_REJECTED':null);
  const decision={...p,canopy,edge,density,selection,groundTriangle:g?.triangle??null,groundSlope:g?.slope??null,surfaceClass:material?.surfaceClass??null,eligible:!reason||reason==='DENSITY_REJECTED',accepted:false,reason};
  grassDecisions.push(decision);if(!reason)grassCandidates.push({...p,canopy,edge,density,decision});
 }
 // Fail the entire trial rather than order-dependent trimming or global reranking.
 if(grassCandidates.length>250)throw new Error('ECOTONE_TRIAL_TUFT_BUDGET_EXCEEDED');
 grassCandidates.sort((a,b)=>a.id.localeCompare(b.id));
 for(const p of grassCandidates){
  const bladeCount=4,palette=trialHash(p.id,'palette'),pocket=palette<.25+.5*p.canopy?'OLIVE':palette<.65+.25*p.canopy?'GOLD':'BROWN';
  let tuft;try{tuft=buildHEarthWoodlandGrassTuft({...p,bladeCount,pocket,sample,eligible:grassEligible,inside:insideTrial});}catch(e){if(String(e.message).startsWith('GRASS_TRIAL_INSUFFICIENT_ELIGIBLE_ROOTS')){p.decision.reason='INSUFFICIENT_ELIGIBLE_ROOT_COLUMNS';continue;}throw e;}
  if(tuft.metadata.oasisFoliage.rootPoints.length!==12)throw new Error('ECOTONE_TRIAL_ROOT_COLUMN_COUNT');
  const grassVertexStart=grass.vertices.length,offset=grassVertexStart;
  grass.vertices.push(...tuft.geometry.vertices);grass.indices.push(...tuft.geometry.indices.map(i=>i+offset));grass.colors.push(...tuft.metadata.oasisFoliage.vertexColorsSrgb.map(c=>[...c.map(v=>Math.round(v*255)),255]));
  p.decision.accepted=true;p.decision.reason='ACCEPTED';
  manifest.push({id:p.id,kind:'GRASS',x:p.x,y:sample(p.x,p.z).y,z:p.z,grassVertexStart,grassVertexCount:tuft.geometry.vertices.length,bladeCount,pocket,canopyCoverage:p.canopy,edgeFeather:p.edge,targetDensity:p.density,rootPoints:tuft.metadata.oasisFoliage.rootPoints.map(p=>({...p,vertexIndex:p.vertexIndex+offset})),crownRadius:.8,footprintClear:true,recipe:'OASIS_COMPACT_LEAF_7_VERTICES_6_TRIANGLES_PERPENDICULAR_FAN'});
 }
 // Connected woodland-A coverage pass; authored density, no hydrology claim.
 const coverageSeed='WOODLAND_A_CONNECTED_COVER_20261007';
 const coverageHash=(id,channel)=>{let h=2166136261;for(const c of `${coverageSeed}:${id}:${channel}`)h=Math.imul(h^c.charCodeAt(0),16777619);return(h>>>0)/4294967296;};
 const coverageInside=(x,z)=>ellipse(x,z)<=1.25&&reservationClear(x,z,0)&&walkingDistance(x,z)>1.5;
 const coverageEligible=(x,z)=>coverageInside(x,z)&&groundReason(x,z)===null;
 const oldGrass=manifest.filter(p=>p.kind==='GRASS');
 const coverageCells=[];
 for(let iz=0;iz<=51;iz++)for(let ix=0;ix<=55;ix++){
  const id=`CONNECTED_COVER_${ix}_${iz}`,angle=coverageHash(id,'jitter-angle')*Math.PI*2,r=Math.sqrt(coverageHash(id,'jitter-radius'))*.48;
  coverageCells.push({id,ix,iz,x:-181+ix*1.9+(iz%2)*.95+Math.cos(angle)*r,z:-267+iz*1.9*Math.sqrt(3)/2+Math.sin(angle)*r});
 }
 if(reverseGenerationOrder||grassCellOrder==='REVERSE')coverageCells.reverse();
 if(grassCellOrder==='CHUNKED')coverageCells.sort((a,b)=>(a.ix%3)-(b.ix%3)||b.iz-a.iz);
 coverageCells.sort((a,b)=>a.id.localeCompare(b.id));
 const coverageDecisions=[];
 for(const p of coverageCells){
  const radial=ellipse(p.x,p.z),canopy=allTrees.reduce((n,t)=>Math.max(n,1-smooth(.48,1.08,Math.hypot(p.x-t.x,p.z-t.z)/t.crownRadius)),0),edge=smooth(0,4,(1.25-radial)*32),density=(.42+.48*(1-canopy))*edge,selection=coverageHash(`FIELD_${Math.floor((p.x+181)/6)}_${Math.floor((p.z+267)/6)}`,'density');
  const reason=!coverageInside(p.x,p.z)?'OUTSIDE_OR_RESERVED':walkingDistance(p.x,p.z)<=2.3?'WALKING_CAPSULE_MARGIN':!reservationClear(p.x,p.z,.8)?'FOOTPRINT_EXCLUDED':groundReason(p.x,p.z)??(oldGrass.some(q=>Math.hypot(p.x-q.x,p.z-q.z)<.65)?'EXISTING_TUFT_CLEARANCE':selection>density?'DENSITY_REJECTED':null);
  const decision={...p,canopy,edge,density,selection,accepted:false,reason};coverageDecisions.push(decision);if(reason)continue;
  const pocket=coverageHash(p.id,'palette')<.25+.5*canopy?'OLIVE':coverageHash(p.id,'palette')<.65+.25*canopy?'GOLD':'BROWN';
  let tuft;try{tuft=buildHEarthWoodlandGrassTuft({...p,bladeCount:4,pocket,sample,eligible:coverageEligible,inside:coverageInside});}catch(e){if(['GRASS_TRIAL_INSUFFICIENT_ELIGIBLE_ROOTS','WOODLAND_FAN_ROOT_INVALID','WOODLAND_FAN_DOMAIN_INVALID'].some(code=>String(e.message).startsWith(code))){decision.reason='INSUFFICIENT_ELIGIBLE_ROOT_COLUMNS';continue;}throw e;}
  const offset=grass.vertices.length;
  grass.vertices.push(...tuft.geometry.vertices);grass.indices.push(...tuft.geometry.indices.map(i=>i+offset));grass.colors.push(...tuft.metadata.oasisFoliage.vertexColorsSrgb.map(c=>[...c.map(v=>Math.round(v*255)),255]));
  decision.accepted=true;decision.reason='ACCEPTED';
  manifest.push({id:p.id,kind:'GRASS',x:p.x,y:sample(p.x,p.z).y,z:p.z,grassVertexStart:offset,grassVertexCount:28,bladeCount:4,pocket,canopyCoverage:canopy,edgeFeather:edge,targetDensity:density,rootPoints:tuft.metadata.oasisFoliage.rootPoints.map(r=>({...r,vertexIndex:r.vertexIndex+offset})),crownRadius:.8,footprintClear:true,recipe:'OASIS_COMPACT_LEAF_7_VERTICES_6_TRIANGLES_PERPENDICULAR_FAN',habitatPatch:'WOODLAND_A_CONNECTED_COVER'});
 }
 const addedTuftCount=coverageDecisions.filter(p=>p.accepted).length;
 if(oldGrass.length+addedTuftCount>1500)throw new Error(`CONNECTED_COVER_TUFT_BUDGET_EXCEEDED:${oldGrass.length+addedTuftCount}`);
 const connectedCover={schema:'H_EARTH_CONNECTED_WOODLAND_COVER_v1',seed:coverageSeed,extent:{center:[-141,-226],radii:[33,32],maximumEllipseRadius:1.25},cellMeters:1.9,jitterRadius:.48,densityFieldMeters:6,edgeFeatherMeters:4,baselineTuftCount:oldGrass.length,addedTuftCount,decisions:coverageDecisions,moistureClaim:false,canonicalPopulationChanged:false};
 grassDecisions.sort((a,b)=>a.id.localeCompare(b.id));
 const grassTrial={schema:'H_EARTH_WOODLAND_MEADOW_TRIAL_v1',seed:trialSeed,extent:{center:[-141,-226],radii:[33,32]},walkingCapsule:{a:[-145,-194],b:[-145,-230],radius:1.5,centerMargin:.8},cellMeters:3,rowStep:3*Math.sqrt(3)/2,oddRowOffset:1.5,childJitterRadius:.90,centerJitterChannels:['center-jitter-angle','center-jitter-radius'],distributionBaseline:'7804b359aa032caa00f8dd526f8e4186df97fac9',densityFieldMeters:9,selectedCenterCount:grassCandidates.length,decisions:grassDecisions,fieldProvenance:{ground:'FINAL_PROJECTED_FLOAT32_NEAR_TRIANGLES',soil:'QUALIFIED_SURFACE_CLASS_PROXY',canopy:'AUTHORED_ACCEPTED_A_CROWN_INFLUENCE_NOT_MEASURED_SHADE',edge:'AUTHORED_8M_EQUIVALENT_FEATHER',palette:'AUTHORED_CANOPY_COLOR_PROXY_NO_MOISTURE_CLAIM'}};
 const primitives=[];for(const [name,m,kind,rgba] of [['BARK',bark,'TREE',[81,64,44,255]],['CANOPY',foliage,'TREE',[66,92,38,255]],['ROCK',stone,'ROCK',[121,113,91,255]],['GRASS',grass,'GRASS',[120,117,61,255]]]){if(!m.indices.length)continue;const id=`H_EARTH_LANDSCAPE_P2_${name}`,r=constructHEarthTriangleMesh({primitiveId:id,geometryId:`${id}:GEOMETRY`,vertices:m.vertices,indices:m.indices,normalMode:E.normalMode.FACE_AND_VERTEX,expectedClosure:E.expectedClosure.OPEN_ALLOWED,semanticRole:`LANDSCAPE_SECTOR_${kind}`,metadata:{landscapeSectorKind:kind,landscapeSectorId:'WESTERN_P2',seed:SEED},source:{sourceType:'DETERMINISTIC_BOUNDED_LANDSCAPE_SOUTH'}});if(r.valid!==true){issues.push(`SOUTH_CONSTRUCTION_FAILED:${name}:${JSON.stringify(r.issues)}`);continue;}primitives.push({...r.primitiveRecord,renderMaterial:{rgba,vertexRgba:m.colors,transparencyClass:'OPAQUE'}});}
 const triangles=primitives.reduce((s,p)=>s+p.geometry.indices.length/3,0);if(accepted.length>128||triangles>64000)issues.push('SECTOR_BUDGET_EXCEEDED');if(!accepted.length)issues.push('NO_ACCEPTED_TREES');
 manifest.sort((a,b)=>a.id.localeCompare(b.id));rejections.sort((a,b)=>a.id.localeCompare(b.id));
 return{eligible:issues.length===0,primitives,manifest,diagnostics:{grassTrial,connectedCover,seed:SEED,bounds,treeCount:accepted.length,grassTuftCount:manifest.filter(p=>p.kind==='GRASS').length,grassBladeCount:manifest.filter(p=>p.kind==='GRASS').reduce((n,p)=>n+p.bladeCount,0),grassTriangleCount:grass.indices.length/3,rockCount:manifest.filter(p=>p.kind==='ROCK').length,triangleCount:triangles,primitiveCount:primitives.length,rejections,groundSource:'PROJECTED_FLOAT32_NEAR_TRIANGLES',existingGrassModified:true,canonicalVegetationPopulationModified:false,replacedClusterAGrass:true,reservationPolicySha256:policy.reservationSha256},issues};
}
