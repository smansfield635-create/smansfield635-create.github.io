/**
 * Diamond Gate Bridge / Generosity Harvest — experimental organic volume authoring.
 * First-party implementation, not an R63 editing operation or an accepted rabbit.
 * Operates on a disposable copy. No third-party geometry dependencies.
 * A source-mesh occupancy field is reconstructed by cross-sectional ray parity,
 * and the original surface is regenerated together with a rounded, variable-radius
 * thorax/shoulder/near-forelimb solid using one shared marching-tetrahedra field.
 */
const finite = Number.isFinite;
const clamp=(x,a,b)=>Math.min(b,Math.max(a,x));
const sq=x=>x*x;
const length3=(x,y,z)=>Math.hypot(x,y,z);
export const ORGANIC_OPERATION_ID='FIRST_PARTY_ORGANIC_FOREQUARTER_AUTHORING_V1_20261110_001';
export const ACCEPTED_R63_SHA256='afb4727e1027e88535e7f18dcd6caaf792b8779b113b7b5ffac663fe057d21fd';
export const DEFAULT_ORGANIC_STATIONS=Object.freeze([
  Object.freeze({label:'concealed-shoulder',xyz:[0.385,-0.063,0.299],radius:0.083}),
  Object.freeze({label:'concealed-upper-arm',xyz:[0.380,-0.087,0.253],radius:0.067}),
  Object.freeze({label:'flexed-elbow',xyz:[0.373,-0.129,0.190],radius:0.051}),
  Object.freeze({label:'returning-forearm',xyz:[0.420,-0.161,0.129],radius:0.042}),
  Object.freeze({label:'supported-wrist',xyz:[0.468,-0.178,0.073],radius:0.038}),
  Object.freeze({label:'compact-near-paw',xyz:[0.502,-0.171,0.055],radius:0.040})
]);

function sourceTriangleInput(mesh){
  if(!mesh||!Array.isArray(mesh.positions)||!Array.isArray(mesh.indices)||mesh.positions.length%3||mesh.indices.length%3||mesh.positions.length<12)throw Error('ORGANIC_SOURCE_MESH_INVALID');
  if(mesh.positions.some(x=>!finite(x))||mesh.indices.some(i=>!Number.isInteger(i)||i<0||i*3+2>=mesh.positions.length))throw Error('ORGANIC_SOURCE_NONFINITE_OR_INDEX_INVALID');
  return {positions:mesh.positions,indices:mesh.indices,count:mesh.indices.length/3};
}
function ellipsoidSdf(x,y,z,c,r){
  const px=x-c[0],py=y-c[1],pz=z-c[2];
  const k0=length3(px/r[0],py/r[1],pz/r[2]);
  const k1=length3(px/sq(r[0]),py/sq(r[1]),pz/sq(r[2]));
  return k1>1e-12?(k0*(k0-1))/k1:-Math.min(...r);
}
function capsuleTaperSdf(x,y,z,a,b){
  const dx=b.xyz[0]-a.xyz[0],dy=b.xyz[1]-a.xyz[1],dz=b.xyz[2]-a.xyz[2];
  const h=clamp(((x-a.xyz[0])*dx+(y-a.xyz[1])*dy+(z-a.xyz[2])*dz)/Math.max(1e-12,dx*dx+dy*dy+dz*dz),0,1);
  const rr=a.radius*(1-h)+b.radius*h;
  return length3(x-a.xyz[0]-h*dx,y-a.xyz[1]-h*dy,z-a.xyz[2]-h*dz)-rr;
}
function smoothMin(a,b,k){if(k<=0)return Math.min(a,b);const h=clamp(0.5+0.5*(b-a)/k,0,1);return (b*(1-h)+a*h)-k*h*(1-h)}
export function organicForequarterSdf(x,y,z,stations=DEFAULT_ORGANIC_STATIONS){
  let d=ellipsoidSdf(x,y,z,[0.370,-0.039,0.283],[0.167,0.133,0.128]);
  for(let i=1;i<stations.length;i++)d=smoothMin(d,capsuleTaperSdf(x,y,z,stations[i-1],stations[i]),0.022);
  // A compact, flattened near paw, continuous with the returning forearm.
  d=smoothMin(d,ellipsoidSdf(x,y,z,[0.501,-0.173,0.058],[0.067,0.050,0.029]),0.022);
  return d;
}

function boundsOf(positions,padding){
  const lo=[Infinity,Infinity,Infinity],hi=[-Infinity,-Infinity,-Infinity];
  for(let p=0;p<positions.length;p+=3)for(let c=0;c<3;c++){const x=positions[p+c];lo[c]=Math.min(lo[c],x);hi[c]=Math.max(hi[c],x)}
  for(let c=0;c<3;c++){lo[c]-=padding;hi[c]+=padding}return{lo,hi};
}
function rayColumns(mesh,lo,step,dims){
  const [nx,ny,nz]=dims, columns=Array.from({length:ny*nz},()=>[]);
  const p=mesh.positions,ids=mesh.indices;
  let nearDegenerate=0;
  for(let t=0;t<ids.length;t+=3){
    const ai=3*ids[t],bi=3*ids[t+1],ci=3*ids[t+2];
    const ay=p[ai+1],az=p[ai+2],by=p[bi+1],bz=p[bi+2],cy=p[ci+1],cz=p[ci+2];
    const e1y=by-ay,e1z=bz-az,e2y=cy-ay,e2z=cz-az;
    const det=e1y*e2z-e1z*e2y;
    if(Math.abs(det)<1e-13){nearDegenerate++;continue}
    const inv=1/det;
    const miny=Math.max(0,Math.ceil((Math.min(ay,by,cy)-lo[1])/step-1e-5));
    const maxy=Math.min(ny-1,Math.floor((Math.max(ay,by,cy)-lo[1])/step+1e-5));
    const minz=Math.max(0,Math.ceil((Math.min(az,bz,cz)-lo[2])/step-1e-5));
    const maxz=Math.min(nz-1,Math.floor((Math.max(az,bz,cz)-lo[2])/step+1e-5));
    for(let iz=minz;iz<=maxz;iz++){
      const z=lo[2]+iz*step+1.17e-7;
      for(let iy=miny;iy<=maxy;iy++){
        const y=lo[1]+iy*step+7.31e-8,dy=y-ay,dz=z-az;
        const u=(dy*e2z-dz*e2y)*inv,v=(e1y*dz-e1z*dy)*inv;
        if(u<-1e-8||v<-1e-8||u+v>1+1e-8)continue;
        const xp=p[ai]+u*(p[bi]-p[ai])+v*(p[ci]-p[ai]);
        columns[iz*ny+iy].push(xp);
      }
    }
  }
  let oddColumns=0;
  for(const xs of columns){xs.sort((a,b)=>a-b);const uniq=[];for(const x of xs){if(uniq.length===0||Math.abs(x-uniq[uniq.length-1])>step*0.0005)uniq.push(x)}xs.length=0;xs.push(...uniq);if(xs.length%2)oddColumns++}
  return{columns,oddColumns,nearDegenerate};
}
function isProximalOldNearLeg(x,y,z){
  // Isolated experimental-copy surgery ONLY. Preserve far-side geometry at y ~ -0.07.
  // Remove the malformed near-limb occupancy that would otherwise form a second sheet.
  const u=clamp((z-0.045)/0.248,0,1);
  const cutoff=-0.114+0.015*u;
  return x>0.300&&x<0.560&&y<cutoff&&y>-.264&&z>0.042&&z<0.285;
}
function sculptIsOccupied(x,y,z,sourceSolid,stations){
  return organicForequarterSdf(x,y,z,stations)<0 || (sourceSolid&&!isProximalOldNearLeg(x,y,z));
}
function smoothGridSigned(inside,nx,ny,nz,step){
  const idx=(x,y,z)=>x+nx*(y+ny*z),out=new Float32Array(inside.length);
  for(let z=0;z<nz;z++)for(let y=0;y<ny;y++)for(let x=0;x<nx;x++){
    let sum=0,weight=0;
    for(let dz=-1;dz<=1;dz++)for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){
      const w=(dx?1:2)*(dy?1:2)*(dz?1:2),ix=x+dx,iy=y+dy,iz=z+dz;
      sum+=w*((ix<0||iy<0||iz<0||ix>=nx||iy>=ny||iz>=nz||!inside[idx(ix,iy,iz)])?1:-1);weight+=w;
    }
    out[idx(x,y,z)]=(sum===0?(inside[idx(x,y,z)]?-0.05:0.05):sum/weight)*step;
  }
  return out;
}
function polygonize(field,lo,step,dims,limit){
  const [nx,ny,nz]=dims,index=(x,y,z)=>x+nx*(y+ny*z),xyz=id=>{const z=Math.floor(id/(nx*ny)),q=id-z*nx*ny,y=Math.floor(q/nx),x=q-y*nx;return[lo[0]+x*step,lo[1]+y*step,lo[2]+z*step]};
  const corners=[0,1,3,7,2,4,5,6]; // numerical corner addressing below follows x+2*y+4*z
  const tetra=[[0,1,3,7],[0,1,5,7],[0,4,5,7],[0,4,6,7],[0,2,6,7],[0,2,3,7]];
  const vert=[],faces=[],edgeMap=new Map();
  function crossing(id0,id1){
    const a=Math.min(id0,id1),b=Math.max(id0,id1),key=`${a}:${b}`;let found=edgeMap.get(key);if(found!==undefined)return found;
    const f0=field[id0],f1=field[id1],t=clamp(f0/(f0-f1),0,1),p=xyz(id0),q=xyz(id1),v=vert.length/3;
    vert.push(p[0]+t*(q[0]-p[0]),p[1]+t*(q[1]-p[1]),p[2]+t*(q[2]-p[2]));edgeMap.set(key,v);return v;
  }
  function emit(a,b,c,insideIds,outsideIds){
    if(a===b||a===c||b===c)return;
    const A=vert.slice(a*3,a*3+3),B=vert.slice(b*3,b*3+3),C=vert.slice(c*3,c*3+3);
    const ux=B[0]-A[0],uy=B[1]-A[1],uz=B[2]-A[2],vx=C[0]-A[0],vy=C[1]-A[1],vz=C[2]-A[2];
    let dx=0,dy=0,dz=0;
    for(let id of outsideIds){const p=xyz(id);dx+=p[0];dy+=p[1];dz+=p[2]}
    for(let id of insideIds){const p=xyz(id);dx-=p[0]*outsideIds.length/insideIds.length;dy-=p[1]*outsideIds.length/insideIds.length;dz-=p[2]*outsideIds.length/insideIds.length}
    const dot=(uy*vz-uz*vy)*dx+(uz*vx-ux*vz)*dy+(ux*vy-uy*vx)*dz;
    faces.push(a,dot>=0?b:c,dot>=0?c:b);
    if(faces.length/3>limit)throw Error('ORGANIC_FACE_BUDGET_EXCEEDED');
  }
  for(let z=0;z<nz-1;z++)for(let y=0;y<ny-1;y++)for(let x=0;x<nx-1;x++){
    const c=[index(x,y,z),index(x+1,y,z),index(x,y+1,z),index(x+1,y+1,z),index(x,y,z+1),index(x+1,y,z+1),index(x,y+1,z+1),index(x+1,y+1,z+1)];
    let all=0;for(let k=0;k<8;k++)if(field[c[k]]<0)all++;
    if(all===0||all===8)continue;
    for(const tet of tetra){const inside=[],outside=[];for(const t of tet)(field[c[t]]<0?inside:outside).push(c[t]);
      if(!inside.length||inside.length===4)continue;
      if(inside.length===1){emit(crossing(inside[0],outside[0]),crossing(inside[0],outside[1]),crossing(inside[0],outside[2]),inside,outside)}
      else if(inside.length===3){emit(crossing(outside[0],inside[0]),crossing(outside[0],inside[1]),crossing(outside[0],inside[2]),inside,outside)}
      else{
        const a=crossing(inside[0],outside[0]),b=crossing(inside[0],outside[1]),c=crossing(inside[1],outside[0]),d=crossing(inside[1],outside[1]);
        emit(a,b,c,inside,outside);emit(b,d,c,inside,outside);
      }
    }
  }
  const finalized={positions:vert,indices:faces};
  orientGeneratedTriangles(finalized);
  return finalized;
}
function orientGeneratedTriangles(mesh){
  const tris=mesh.indices,faceCount=tris.length/3,edges=new Map();
  for(let f=0;f<faceCount;f++)for(let k=0;k<3;k++){
    const a=tris[3*f+k],b=tris[3*f+(k+1)%3],key=`${Math.min(a,b)}:${Math.max(a,b)}`;
    let list=edges.get(key);if(!list){list=[];edges.set(key,list)}list.push([f,a<b?1:-1]);
  }
  const visited=new Int8Array(faceCount),queue=[];
  for(let seed=0;seed<faceCount;seed++){
    if(visited[seed])continue;
    visited[seed]=1;queue.length=0;queue.push(seed);
    for(let qi=0;qi<queue.length;qi++){
      const f=queue[qi];for(let k=0;k<3;k++){
        const a=tris[3*f+k],b=tris[3*f+(k+1)%3],key=`${Math.min(a,b)}:${Math.max(a,b)}`;
        const others=edges.get(key);if(others.length!==2)continue;
        const entry=others[0][0]===f?others[0]:others[1],other=others[0][0]===f?others[1]:others[0];
        const wanted=visited[f]*(entry[1]===other[1]?-1:1);
        if(!visited[other[0]]){visited[other[0]]=wanted;queue.push(other[0])}
        else if(visited[other[0]]!==wanted)throw Error('ORGANIC_NONORIENTABLE_SURFACE');
      }
    }
  }
  for(let f=0;f<faceCount;f++)if(visited[f]===-1){const b=tris[3*f+1];tris[3*f+1]=tris[3*f+2];tris[3*f+2]=b}
  let signed=0;
  for(let f=0;f<faceCount;f++){
    const a=tris[3*f]*3,b=tris[3*f+1]*3,c=tris[3*f+2]*3,p=mesh.positions;
    const bx=p[b],by=p[b+1],bz=p[b+2],cx=p[c],cy=p[c+1],cz=p[c+2];
    signed+=p[a]*(by*cz-bz*cy)+p[a+1]*(bz*cx-bx*cz)+p[a+2]*(bx*cy-by*cx);
  }
  if(signed<0)for(let f=0;f<faceCount;f++){const b=tris[3*f+1];tris[3*f+1]=tris[3*f+2];tris[3*f+2]=b}
}
export function auditGeneratedSurface(mesh){
  const edge=new Map(),parent=new Int32Array(mesh.positions.length/3).fill(-1);
  for(let i=0;i<mesh.indices.length;i+=3){const t=mesh.indices.slice(i,i+3);for(let k=0;k<3;k++){
    const a=t[k],b=t[(k+1)%3],key=`${Math.min(a,b)}:${Math.max(a,b)}`,e=edge.get(key)||{count:0,dir:0};
    e.count++;e.dir+=a<b?1:-1;edge.set(key,e);
  }}
  const boundary=[...edge.values()].filter(e=>e.count!==2).length,orientation=[...edge.values()].filter(e=>e.dir!==0).length;
  let componentCount=0;
  const parentArray=Array.from({length:mesh.positions.length/3},(_,i)=>i);
  function find(x){while(parentArray[x]!==x){parentArray[x]=parentArray[parentArray[x]];x=parentArray[x]}return x}
  function union(a,b){const i=find(a),j=find(b);if(i!==j)parentArray[j]=i}
  const referenced=new Set();for(let i=0;i<mesh.indices.length;i+=3){const [a,b,c]=mesh.indices.slice(i,i+3);referenced.add(a);referenced.add(b);referenced.add(c);union(a,b);union(a,c)}
  componentCount=new Set([...referenced].map(find)).size;
  let zeroAreaTriangles=0;
  const P=mesh.positions,I=mesh.indices;
  for(let j=0;j<I.length;j+=3){
    const a=I[j]*3,b=I[j+1]*3,c=I[j+2]*3;
    const x=P[b]-P[a],y=P[b+1]-P[a+1],z=P[b+2]-P[a+2];
    const u=P[c]-P[a],v=P[c+1]-P[a+1],w=P[c+2]-P[a+2];
    const nx=y*w-z*v,ny=z*u-x*w,nz=x*v-y*u;
    if(nx*nx+ny*ny+nz*nz<1e-20)zeroAreaTriangles++;
  }
  return{zeroAreaTriangles,vertices:mesh.positions.length/3,triangles:mesh.indices.length/3,openOrNonmanifoldEdges:boundary,inconsistentDirectedEdges:orientation,connectedComponents:componentCount,connectedWatertight:boundary===0&&orientation===0&&componentCount===1};
}
export function buildOrganicExperimentalSurface(mesh,{cellSize=0.015,maxGridNodes=800000,maxTriangles=200000,stations=DEFAULT_ORGANIC_STATIONS}={}){
  const source=sourceTriangleInput(mesh);
  if(!finite(cellSize)||cellSize<0.007||cellSize>0.035)throw Error('ORGANIC_CELL_SIZE_OUT_OF_BOUNDS');
  if(!Array.isArray(stations)||stations.length!==6||stations.some(s=>!Array.isArray(s.xyz)||s.xyz.length!==3||s.xyz.some(x=>!finite(x))||!finite(s.radius)||s.radius<=0||s.radius>0.16))throw Error('ORGANIC_STATIONS_INVALID');
  const bounds=boundsOf(mesh.positions,Math.max(0.05,cellSize*3)),dims=bounds.lo.map((x,i)=>Math.ceil((bounds.hi[i]-x)/cellSize)+1);
  const [nx,ny,nz]=dims,total=nx*ny*nz;
  if(total>maxGridNodes||total<=0)throw Error('ORGANIC_GRID_BUDGET_EXCEEDED');
  const {columns,oddColumns,nearDegenerate}=rayColumns(source,bounds.lo,cellSize,dims);
  if(oddColumns>Math.max(12,ny*nz*0.065))throw Error('ORGANIC_SOURCE_OCCUPANCY_NOT_CLOSED');
  const occupied=new Uint8Array(total),idx=(x,y,z)=>x+nx*(y+ny*z);
  let sourceInside=0,sourceRemoved=0;
  for(let z=0;z<nz;z++)for(let y=0;y<ny;y++){
    const xs=columns[z*ny+y],yy=bounds.lo[1]+cellSize*y,zz=bounds.lo[2]+cellSize*z;
    let k=0;
    for(let x=0;x<nx;x++){
      const xx=bounds.lo[0]+cellSize*x;
      while(k<xs.length&&xs[k]<xx)k++;
      const original=(k%2)===1;
      if(original)sourceInside++;
      const removed=original&&isProximalOldNearLeg(xx,yy,zz);
      if(removed)sourceRemoved++;
      occupied[idx(x,y,z)]=(original&&!removed)||organicForequarterSdf(xx,yy,zz,stations)<0?1:0;
    }
  }
  const field=smoothGridSigned(occupied,nx,ny,nz,cellSize);
  const generated=polygonize(field,bounds.lo,cellSize,dims,maxTriangles);
  const audit=auditGeneratedSurface(generated);
  if(!audit.connectedWatertight||audit.zeroAreaTriangles!==0)throw Error('ORGANIC_OUTPUT_SURFACE_INVALID');
  return{mesh:generated,audit,provenance:{operationId:ORGANIC_OPERATION_ID,scope:'DISPOSABLE_COPY_ONLY_NOT_R63',sourceFaces:source.count,sourceVertices:source.positions.length/3,sourceOccupiedCells:sourceInside,originalNearLimbRemovedCells:sourceRemoved,oddRayColumns:oddColumns,nearDegenerateRayTriangles:nearDegenerate,cellSize,grid:dims,experimentalReconstruction:true,originalSourceMutation:false,sourceTopologyReused:false,oneSpecimen:true}};
}
