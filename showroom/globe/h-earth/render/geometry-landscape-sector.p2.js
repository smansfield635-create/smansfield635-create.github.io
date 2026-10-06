/** Bounded western woodland candidate. South constructs; caller owns West admission.
 * Stable identities/hash channels do not consume an order-dependent random stream.
 * Ground anchors use the rendered Float32 NEAR triangles, never a second surface.
 */
import {constructHEarthTriangleMesh,H_EARTH_3D_GEOMETRY_SOUTH_ENUMS as E} from './geometry-kernel.south.js';
import {H_EARTH_GEN311_ESTATE_PLACEMENT_POLICY as policy} from '../../../../h-earth-3d/environment/h-earth.gen2514-qualified-placement-authority.js';
import {sampleHEarthRun8CSuccessorSurfaceMaterial} from '../../../../h-earth-3d/environment/h-earth.gen2514-qualified-surface-material.run8c.js';
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
  return(x,z)=>{for(const {t:[a,b,c],triangle} of bins.get(key(x,z))??[]){const d=(b.z-c.z)*(a.x-c.x)+(c.x-b.x)*(a.z-c.z);if(Math.abs(d)<1e-10)continue;const u=((b.z-c.z)*(x-c.x)+(c.x-b.x)*(z-c.z))/d,w=((c.z-a.z)*(x-c.x)+(a.x-c.x)*(z-c.z))/d,q=1-u-w;if(Math.min(u,w,q)<-1e-7)continue;const dx=((b.y-a.y)*(c.z-a.z)-(c.y-a.y)*(b.z-a.z))/((b.x-a.x)*(c.z-a.z)-(c.x-a.x)*(b.z-a.z)),dz=((b.x-a.x)*(c.y-a.y)-(c.x-a.x)*(b.y-a.y))/((b.x-a.x)*(c.z-a.z)-(c.x-a.x)*(b.z-a.z));return{y:u*a.y+w*b.y+q*c.y,slope:Math.hypot(dx,dz),triangle};}return null;};
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
export function buildHEarthLandscapeSector({terrainPrimitive,reverseGenerationOrder=false}={}){
 const ground=sampler(terrainPrimitive),issues=[],manifest=[],rejections=[];
 if(!ground)return{eligible:false,primitives:[],manifest,diagnostics:{},issues:['PROJECTED_NEAR_TRIANGLES_REQUIRED']};
 const candidates=[];
 for(const [cluster,cx,cz,n,rx,rz] of [['A',-145,-230,15,23,23],['B',-125,-285,17,27,23],['C',-65,-315,15,22,20]])for(let i=0;i<n;i++){const id=`P2_TREE_${cluster}_${String(i).padStart(2,'0')}`,angle=i*2.399963229728653+hash(id,'angle'),radius=Math.sqrt((i+.4)/n);candidates.push({id,x:cx+Math.cos(angle)*radius*rx,z:cz+Math.sin(angle)*radius*rz});}
 for(let i=0;i<23;i++){const id=`P2_TREE_REAR_${String(i).padStart(2,'0')}`;if(i===9||i===10||i===17)continue;candidates.push({id,x:-171+i*6.1+(hash(id,'x')-.5)*3,z:-357+(hash(id,'z')-.5)*22});}
 if(reverseGenerationOrder)candidates.reverse();
 candidates.sort((a,b)=>a.id.localeCompare(b.id));
 const accepted=[];for(const p of candidates){const radius=2.4+hash(p.id,'crown')*2,anchor=ground(p.x,p.z),material=sampleHEarthRun8CSuccessorSurfaceMaterial(p.x,p.z);const reason=!clearFootprint(p.x,p.z,radius)?'FOOTPRINT_EXCLUDED':!anchor?'GROUND_MISSING':anchor.slope>.72?'STEEP_SLOPE':!['LOWLAND_SOIL','COASTAL_SOIL'].includes(material?.surfaceClass)?'HABITAT_EXCLUDED':accepted.some(q=>Math.hypot(p.x-q.x,p.z-q.z)<(radius+q.radius)*.65)?'TRUNK_SPACING_CONFLICT':null;if(reason){rejections.push({id:p.id,reason});continue;}accepted.push({...p,radius,anchor,material});}
 accepted.sort((a,b)=>a.id.localeCompare(b.id));const bark=mesh(),foliage=mesh(),stone=mesh();
 for(const p of accepted){const {id,x,z,radius,anchor}=p,y=anchor.y,height=8+hash(id,'height')*8,leanX=(hash(id,'leanX')-.5)*1.1,leanZ=(hash(id,'leanZ')-.5)*1.1;
 const barkVertexStart=bark.vertices.length,canopyVertexStart=foliage.vertices.length;
 branch(bark,[x,y,z],[x+leanX,y+height*.72,z+leanZ],.32+height*.018,.10,[93,75,52,255]);
 for(let j=0;j<5;j++){const angle=j*2.399+hash(id,'rotation')*6.28,offset=j===4?.15:radius*.33,dx=Math.cos(angle)*offset,dz=Math.sin(angle)*offset,cy=y+height*(j===4?.81:.62+hash(id,`tier${j}`)*.1);branch(bark,[x+leanX*.35,y+height*.35,z+leanZ*.35],[x+dx,cy,z+dz],.15,.055,[94,76,53,255]);const r=radius*(j===4?.59:.58);lobe(foliage,`${id}:${j}`,[x+dx,cy,z+dz],[r,(y+height-cy)*(j===4?1:.76),r*.92],[72+hash(id,'tint')*22,99+hash(id,'tint')*22,42+hash(id,'tint')*12,255]);}
 const support=burySupport(bark,barkVertexStart,barkVertexStart,6,ground,false);if(!support){issues.push(`ROOT_SUPPORT_MISSING:${id}`);continue;}
 manifest.push({support,barkVertexStart,barkVertexCount:bark.vertices.length-barkVertexStart,canopyVertexStart,canopyVertexCount:foliage.vertices.length-canopyVertexStart,id,kind:'TREE',x,y,z,height,crownRadius:radius,groundTriangle:anchor.triangle,groundSlope:anchor.slope,surfaceClass:p.material.surfaceClass,footprintClear:true});
 }
 for(let i=0;i<14;i++){const id=`P2_ROCK_${String(i).padStart(2,'0')}`,x=-79+i*2.65+(hash(id,'x')-.5)*5,z=-239+i*1.9+(hash(id,'z')-.5)*8,r=2+hash(id,'size')*2.7,a=ground(x,z);if(!a||!clearFootprint(x,z,r*1.35))continue;const h=1.5+hash(id,'height')*2.5,stoneVertexStart=stone.vertices.length;lobe(stone,id,[x,a.y+h*.12,z],[r,h,r*.72],[118+hash(id,'color')*18,111+hash(id,'color')*14,89+hash(id,'color')*12,255],.35);const support=burySupport(stone,stoneVertexStart,stoneVertexStart+1,8,ground,true);if(!support){issues.push(`ROCK_SUPPORT_MISSING:${id}`);continue;}manifest.push({support,stoneVertexStart,stoneVertexCount:stone.vertices.length-stoneVertexStart,id,kind:'ROCK',x,y:a.y,z,height:h*1.12-support.downwardShift,crownRadius:r*1.35,groundTriangle:a.triangle,footprintClear:true});}
 const primitives=[];for(const [name,m,kind,rgba] of [['BARK',bark,'TREE',[81,64,44,255]],['CANOPY',foliage,'TREE',[66,92,38,255]],['ROCK',stone,'ROCK',[121,113,91,255]]]){if(!m.indices.length)continue;const id=`H_EARTH_LANDSCAPE_P2_${name}`,r=constructHEarthTriangleMesh({primitiveId:id,geometryId:`${id}:GEOMETRY`,vertices:m.vertices,indices:m.indices,normalMode:E.normalMode.FACE_AND_VERTEX,expectedClosure:E.expectedClosure.OPEN_ALLOWED,semanticRole:`LANDSCAPE_SECTOR_${kind}`,metadata:{landscapeSectorKind:kind,landscapeSectorId:'WESTERN_P2',seed:SEED},source:{sourceType:'DETERMINISTIC_BOUNDED_LANDSCAPE_SOUTH'}});if(r.valid!==true){issues.push(`SOUTH_CONSTRUCTION_FAILED:${name}:${JSON.stringify(r.issues)}`);continue;}primitives.push({...r.primitiveRecord,renderMaterial:{rgba,vertexRgba:m.colors,transparencyClass:'OPAQUE'}});}
 const triangles=primitives.reduce((s,p)=>s+p.geometry.indices.length/3,0);if(accepted.length>128||triangles>48000)issues.push('SECTOR_BUDGET_EXCEEDED');if(!accepted.length)issues.push('NO_ACCEPTED_TREES');
 manifest.sort((a,b)=>a.id.localeCompare(b.id));rejections.sort((a,b)=>a.id.localeCompare(b.id));
 return{eligible:issues.length===0,primitives,manifest,diagnostics:{seed:SEED,bounds,treeCount:accepted.length,rockCount:manifest.filter(p=>p.kind==='ROCK').length,triangleCount:triangles,primitiveCount:primitives.length,rejections,groundSource:'PROJECTED_FLOAT32_NEAR_TRIANGLES',existingGrassModified:false,reservationPolicySha256:policy.reservationSha256},issues};
}
