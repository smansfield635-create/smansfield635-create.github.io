/** Static ledge-rooted ivy and moss on the actual retained cavern rock triangles. */
import {constructHEarthTriangleMesh,admitHEarthPrimitiveRecord} from './geometry-kernel.js';
import {projectGeologicalMeshForRenderer} from '../../../../h-earth-3d/terrain/h-earth.geological-portal-interface.v1.mjs';
const hash=(a,b=0)=>{let h=Math.imul(a+137,374761393)^Math.imul(b+719,668265263);h=Math.imul(h^(h>>>13),1274126177);return((h^(h>>>16))>>>0)/4294967296;};
const make=()=>({vertices:[],indices:[],colors:[]});
const add=(m,p,c)=>{m.vertices.push({x:p[0],y:p[1],z:p[2]});m.colors.push(c);return m.vertices.length-1;};
function ribbon(m,a,b,width,color){
 const dx=b[0]-a[0],dy=b[1]-a[1],n=Math.hypot(dx,dy);if(n<1e-7)return;
 const side=[-dy/n*width,dx/n*width,0],v=[a.map((q,k)=>q+side[k]),a.map((q,k)=>q-side[k]),b.map((q,k)=>q+side[k]),b.map((q,k)=>q-side[k])].map(p=>add(m,p,color));
 m.indices.push(v[0],v[2],v[1],v[1],v[2],v[3]);
}
function finish(id,m,leaflets){
 const built=constructHEarthTriangleMesh({primitiveId:id,vertices:m.vertices,indices:m.indices,expectedClosure:'OPEN_ALLOWED',semanticRole:'CAVERN_IVY',attributes:{colors:m.colors},metadata:{authoringSpace:'LOCAL_METERS',surfaceAttached:true}});
 if(!built.valid)throw Error('IVY_KERNEL_CONSTRUCTION:'+JSON.stringify(built.issues));
 const admitted=admitHEarthPrimitiveRecord(built.primitiveRecord);
 if(!admitted.valid)throw Error('IVY_KERNEL_ADMISSION:'+JSON.stringify(admitted.issues));
 const g=admitted.geometry,positions=new Float32Array(g.vertices.length*3);
 g.vertices.forEach((p,i)=>positions.set([p.x,p.y,p.z],i*3));
 return Object.freeze({role:'CAVERN_IVY',part:id,leaflets,mesh:projectGeologicalMeshForRenderer({positions,indices:new Uint32Array(g.indices)}),colors:g.attributes.colors});
}
export function buildCavernEntranceIvy(model){
 if(model?.site?.id!=='B_REAR_RAVINE'||typeof model.formation?.rockFaceFrontAt!=='function'||typeof model.originalTerrainElevationAt!=='function')throw Error('IVY_ACTUAL_CLIFF_REQUIRED');
 const stems=make(),leaves=make(),moss=make(),trails=[],attachments=[],mossContacts=[];
 const {xMin,xMax}=model.portal.aperture,z0=model.site.portalZ;
 const front=(x,y)=>model.formation.lowerEntranceSeamAt(x,y)?null:model.formation.rockFaceFrontAt(x,y);
 const at=(x,y,offset)=>{const z=front(x,y);return Number.isFinite(z)?[x,y,z-offset]:null;};
 const leaf=(root,trailId,segmentIndex,t,seed,side)=>{
  const size=.22+.14*hash(seed,8),angle=side*(.48+.70*hash(seed,9))+(hash(seed,10)-.5)*.20,d=[Math.sin(angle),-Math.cos(angle)],s=[-d[1],d[0]];
  const breadth=.9+.2*hash(seed,11),twist=(hash(seed,13)-.5)*.024;
  const base=at(root[0]+d[0]*.065,root[1]+d[1]*.065,.065);if(!base)return;
  // Five distinct tips separated by shallow sinuses, with a raised midrib.
  // The slight twist and broadening vary deterministically without detaching the petiole.
  const outline=[[0,0],[-.32,.07],[-.60,.25],[-.30,.30],[-.52,.61],[-.20,.55],[0,1],[.20,.55],[.52,.61],[.30,.30],[.60,.25],[.32,.07]];
  const points=outline.map(([u,v])=>at(base[0]+size*(d[0]*v+s[0]*u*breadth),base[1]+size*(d[1]*v+s[1]*u*breadth),.065+.012*v+twist*u));
  const center=at(base[0]+size*d[0]*.30,base[1]+size*d[1]*.30,.09+.012*hash(seed,14));
  if(!center||points.some(p=>!p))return;
  ribbon(stems,root,base,.007,[.27,.31,.115]);
  const palette=[[.12,.25,.095],[.19,.33,.12],[.26,.37,.14]],c=palette[Math.floor(hash(seed,12)*3)],v=add(leaves,center,c.map(q=>q*1.08));
  const ring=points.map((p,k)=>add(leaves,p,c.map(q=>q*(.96+.06*outline[k][0]))));
  for(let k=0;k<ring.length;k++)leaves.indices.push(v,ring[(k+1)%ring.length],ring[k]);
  attachments.push({trailId,segmentIndex,t,root,base,leafBase:points[0]});
 };
 function trail(id,start,length,phase,amplitude,parent=null){
  const points=[start],step=.075,count=Math.ceil(length/step);
  for(let k=1;k<=count;k++){
   const dist=length*k/count,x=start[0]+amplitude*(Math.sin(phase+dist*2.1)-Math.sin(phase)),y=start[1]-dist;
   const p=at(x,y,.035);if(!p)break;
   // Refuse a segment across a missing rock interval.
   const a=points.at(-1);if(!at((a[0]+p[0])/2,(a[1]+p[1])/2,.035))break;
   points.push(p);ribbon(stems,a,p,.011,[.22,.27,.10]);
  }
  if(points.length<2)return;
  trails.push({id,parent,points});
  for(let k=1;k<points.length-1;k+=k<10?1:3){
   const t=.35,a=points[k],b=points[k+1],root=a.map((q,j)=>q+(b[j]-q)*t);
   leaf(root,id,k,t,id*100+k,k%2===1?-1:1);
  }
  return points;
 }
 // Uneven ledge clusters: deterministic offsets, distinct lengths, asymmetric branches.
 for(let i=0;i<22;i++){
  const x=xMin+1.3+(xMax-xMin-2.6)*(i+.16+.62*hash(i,1))/22;
  const y=model.originalTerrainElevationAt(x,z0)-.025,start=at(x,y,.035);if(!start)continue;
  const p=trail(i,start,1.05+2.75*hash(i,2),hash(i,3)*6.28,.09+.17*hash(i,4));
  if(p&&p.length>12&&i%2===0){const k=4+Math.floor(hash(i,5)*4);trail(100+i,p[k],.45+1.1*hash(i,6),hash(i,7)*6.28,.30,{trailId:i,pointIndex:k});}
 }
 // Moss follows every vertex of the actual relief; irregular low patches leave rock gaps.
 for(let i=0;i<100;i++){
  const x=xMin+.65+hash(i,20)*(xMax-xMin-1.3),top=model.originalTerrainElevationAt(x,z0),y=top-(.12+hash(i,21)*2.8);
  const center=at(x,y,.014);if(!center)continue;
  const radius=.07+.13*hash(i,22),points=[];
  for(let k=0;k<7;k++){const a=k*Math.PI*2/7,r=radius*(.65+.5*hash(i,k+30));points.push(at(x+Math.cos(a)*r,y+Math.sin(a)*r,.014));}
  if(points.some(p=>!p))continue;
  // Subdivide each patch fan; every vertex and edge midpoint has real rock support.
  const color=[.16+.06*hash(i,23),.235+.07*hash(i,24),.065+.035*hash(i,25)];
  for(let k=0;k<7;k++){
   const a=points[k],b=points[(k+1)%7],mid=at((a[0]+b[0])/2,(a[1]+b[1])/2,.014);
   if(!mid)continue;
   for(const tri of [[center,a,mid],[center,mid,b]]){
    const probes=[...tri.map((a,k)=>a.map((v,j)=>(v+tri[(k+1)%3][j])/2)),[0,1,2].map(j=>tri.reduce((n,p)=>n+p[j],0)/3)];
    // Reject flat triangles that bridge a crease or sink into the relief.
    if(probes.some(p=>{const q=at(p[0],p[1],.014);return !q||Math.abs(q[2]-p[2])>.009;}))continue;
    const v=tri.map(p=>{mossContacts.push(p);return add(moss,p,color);});moss.indices.push(v[0],v[2],v[1]);
   }
  }
 }
 if(!trails.length||!attachments.length||!moss.indices.length)throw Error('IVY_EMPTY_SUPPORTED_GEOMETRY');
 const meshes=[finish('CAVERN_IVY_STEMS',stems,true),finish('CAVERN_IVY_LEAVES',leaves,true),finish('CAVERN_IVY_MOSS',moss,true)];
 const gpuByteLength=meshes.reduce((n,p)=>n+p.mesh.vertexCount*69+p.mesh.indices.byteLength,0);
 if(gpuByteLength>1024*1024)throw Error('IVY_GPU_BUDGET_EXCEEDED');
 return Object.freeze({meshes,diagnostics:{trails,attachments,mossContacts},receipt:{schema:'H_EARTH_CAVERN_ENTRANCE_IVY_v1',siteId:model.site.id,trailCount:trails.length,leafCount:attachments.length,mossTriangleCount:moss.indices.length/3,triangleCount:meshes.reduce((n,p)=>n+p.mesh.triangleCount,0),gpuByteLength,drawBatchCount:3,surfaceSource:'ACTUAL_RETAINED_CLIFF_TRIANGLES',perFrameGeneration:false,sourceTerrainMutated:false,kernelAdmission:'PASS',physicalReview:'PENDING'}});
}
