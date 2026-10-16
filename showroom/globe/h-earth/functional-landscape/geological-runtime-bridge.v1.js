/** H_EARTH_GEN2735_RUNTIME_GEOLOGICAL_BRIDGE_v1
 * Candidate-only: derived from the immutable Run8E package; one shared formation
 * supplies surface geometry and the active physical navigation support. No new world.
 */
import {GEOLOGICAL_FORMATION_SITES,makeCanonicalAuthoringTerrainSampler,unprojectPlanetVertex,createGeologicalFormation,
        deriveBaseTriangleRetirement} from '../../../../h-earth-3d/terrain/h-earth.geological-formation-successor.v1.mjs';
import {constructGeologicalPortalAssembly,sampleFormationWalkable,projectGeologicalMeshForRenderer}
  from '../../../../h-earth-3d/terrain/h-earth.geological-portal-interface.v1.mjs';
import {constructHEarthSweptPassageMesh} from '../render/geometry-kernel.sweep.v1.js';
// Owner-directed temporary land development mode. Source water meshes remain intact.
export const H_EARTH_WATER_PRESENTATION_ENABLED=false;
export const isHEarthWaterPresentationPart=id=>/(?:^|:)(?:FOAM_CONTACT|SHALLOW_WATER|NEARSHORE_WATER|OPEN_WATER|FAR_OCEAN_CONTINUATION|FRESHWATER_RIVER|OASIS_WATER)$/.test(String(id));
export function shouldPresentHEarthDrawRange(range){
  if(H_EARTH_WATER_PRESENTATION_ENABLED)return true;
  const ids=range.primitiveIds??[];
  if(!ids.some(isHEarthWaterPresentationPart))return true;
  if(!ids.every(isHEarthWaterPresentationPart))throw Error('H_EARTH_MIXED_WATER_LAND_DRAW_RANGE');
  return false;
}
export const GEOLOGICAL_RUNTIME_BRIDGE_ID='H_EARTH_GEN2735_RUNTIME_GEOLOGICAL_BRIDGE_v1';
const SITE=GEOLOGICAL_FORMATION_SITES.B_REAR_RAVINE;
const BOUNDS=Object.freeze({xMin:-120,xMax:96,zMin:-376,zMax:-224});
const DIRS=Object.freeze([[-1,-1],[0,-1],[1,-1],[-1,0],[1,0],[-1,1],[0,1],[1,1]]);
let active=null;
function fail(s){throw Error('GEOLOGICAL_RUNTIME_BRIDGE_INVALID:'+s)}
/** Reconstruct strict downhill flow from actual indexed canonical authoring heights. */
export function traceGeologicalRuntimeDrainage(sampler,site=SITE){
  let x=site.x,z=site.drainageHeadZ;let original=sampler(x,z);
  if(!Number.isFinite(original))fail('SOURCE_START');
  const path=[],visited=new Set();let result='MAX_ROUTE_STEPS';
  for(let n=0;n<300;n++){
    path.push({x,z,height:original});visited.add(x+','+z);
    let best=null,grade=0;
    for(const [dx,dz] of DIRS){const nx=x+2*dx,nz=z+2*dz;
      if(nx < -160||nx>160||nz< -384||nz> -120)continue;
      const next=sampler(nx,nz);if(!Number.isFinite(next))continue;
      const fall=(original-next)/(2*Math.hypot(dx,dz));
      if(fall>grade+1e-12){best={x:nx,z:nz,height:next};grade=fall;}
    }
    if(!best){result=(x<=-160||x>=160||z<=-384||z>=-120)?'STUDY_EDGE_UNRESOLVED':'NO_STRICT_LOWER_NEIGHBOR_IN_STUDY';break;}
    if(visited.has(best.x+','+best.z))fail('DRAINAGE_CYCLE');
    ({x,z}=best);original=best.height;
  }
  if(path.length<10)fail('INSUFFICIENT_ROUTE');
  return Object.freeze({path,result,surveyMethod:'ACTUAL_G_WORLD_CANONICAL_INDEXED_TRIANGLES_INVERSE_SPHERE_D8',waterPresent:false});
}
function buildWaterRibbon(route,kind,formation,basinMesh){
  const points=route.points;if(points.length<2)fail('WATER_ROUTE_TOO_SHORT');
  // Let the visible channel wander inside its broad excavated valley. The
  // surveyed bed elevations remain authoritative; this small lateral bend
  // keeps the approach from reading as a straight blue strip at arrival scale.
  const centers=points.map((p,i)=>{
    const a=points[Math.max(0,i-1)],b=points[Math.min(points.length-1,i+1)],dx=b.x-a.x,dz=b.z-a.z,length=Math.hypot(dx,dz)||1;
    const t=i/(points.length-1),wave=Math.sin(t*Math.PI*3+0.35*Math.sin(t*Math.PI*4));
    const offset=(kind==='MAIN'?5.5:1.4)*Math.sin(Math.PI*t)*wave;
    return {...p,x:p.x-dz/length*offset,z:p.z+dx/length*offset};
  });
  const positions=[],indices=[];
  for(let i=0;i<centers.length;i++){
    const p=centers[i],a=centers[Math.max(0,i-1)],b=centers[Math.min(centers.length-1,i+1)];
    const dx=b.x-a.x,dz=b.z-a.z,length=Math.hypot(dx,dz)||1,nx=-dz/length,nz=dx/length;
    const t=i/(points.length-1),basin=formation?.oasis;
    const basinDistance=basin?Math.hypot(p.x-basin.centerX,p.z-basin.centerZ):Infinity;
    const confluence=Number.isFinite(basinDistance)?Math.exp(-basinDistance/18):0;
    const half=(kind==='MAIN'?1.15+2.25*t:0.85+0.75*t)*(0.9+0.1*Math.sin(i*.17+0.4))+2.15*confluence;
    const y=p.bedY+0.24;
    positions.push(p.x+nx*half,y,p.z+nz*half,p.x-nx*half,y,p.z-nz*half);
    if(i){const q=2*i,r=q-2;indices.push(r,q,r+1,r+1,q,q+1)}
  }
  // Preserve the source bank rows for drainage witnesses, but emit only the
  // river outside the actual triangulated basin. The basin owns every overlap.
  const footprint=waterTriangles(basinMesh),emitted=[];
  for(let i=0;i<indices.length;i+=3){
    let pieces=[indices.slice(i,i+3).map(id=>({x:positions[id*3],y:positions[id*3+1],z:positions[id*3+2]}))];
    for(const triangle of footprint){
      const next=[];
      for(const polygon of pieces){
        const box=polygonBounds(polygon);
        if(box[2]<triangle.box[0]||box[0]>triangle.box[2]||box[3]<triangle.box[1]||box[1]>triangle.box[3])next.push(polygon);
        else next.push(...subtractWaterTriangle(polygon,triangle.points));
      }
      pieces=next;if(!pieces.length)break;
    }
    for(const polygon of pieces){
      const base=positions.length/3;
      for(const p of polygon){
        // Boundary vertices share exactly the basin water elevation. Points
        // introduced by infinite edge extensions outside the basin retain the
        // original interpolated river grade.
        const atBasin=sampleWaterTriangles(footprint,p.x,p.z);
        positions.push(p.x,atBasin?formation.oasis.waterLevel:p.y,p.z);
      }
      for(let k=1;k<polygon.length-1;k++)emitted.push(base,base+k,base+k+1);
    }
  }
  return Object.freeze({positions:new Float32Array(positions),indices:new Uint32Array(emitted),vertexCount:positions.length/3,triangleCount:emitted.length/3,routeId:route.id,basinOwnsOverlap:true});
}
/** One wet-margin definition constructs the basin's actual clipped polygons. */
function oasisWetMargin(formation,x,z){
  const basin=formation.oasis,dx=(x-basin.centerX)/basin.radiusX,dz=(z-basin.centerZ)/basin.radiusZ,angle=Math.atan2(dz,dx);
  const edge=1+basin.edgeHarmonics[0]*Math.sin(3*angle)+basin.edgeHarmonics[1]*Math.sin(5*angle+0.7)+
    basin.edgeHarmonics[2]*Math.cos(2*angle-0.4)+basin.edgeHarmonics[3]*Math.sin(7*angle+1.1)+
    basin.edgeHarmonics[4]*Math.cos(9*angle-.6)+.025*Math.sin(x*.31+z*.23)*Math.cos(z*.27-x*.19);
  return Math.min(0.98-Math.hypot(dx,dz)/(edge*(basin.waterEdgeScale??0.72)),
    (basin.waterLevel-formation.excavatedOutdoorTerrain(x,z))*.5);
}
const polygonBounds=points=>[Math.min(...points.map(p=>p.x)),Math.min(...points.map(p=>p.z)),Math.max(...points.map(p=>p.x)),Math.max(...points.map(p=>p.z))];
function waterTriangles(mesh,{projected=false,role=null}={}){
  const result=[];
  for(let i=0;i<mesh.indices.length;i+=3){
    const points=Array.from(mesh.indices.slice(i,i+3),id=>{
      const xyz=mesh.positions.slice(id*3,id*3+3);
      return projected?unprojectPlanetVertex(...xyz):{x:xyz[0],y:xyz[1],z:xyz[2]};
    });
    const [a,b,c]=points,det=(b.z-c.z)*(a.x-c.x)+(c.x-b.x)*(a.z-c.z);
    if(Math.abs(det)>1e-10)result.push({points,det,box:polygonBounds(points),role});
  }
  return result;
}
function sampleWaterTriangles(triangles,x,z){
  let top=null;
  for(const t of triangles){
    if(x<t.box[0]-1e-6||x>t.box[2]+1e-6||z<t.box[1]-1e-6||z>t.box[3]+1e-6)continue;
    const [a,b,c]=t.points,u=((b.z-c.z)*(x-c.x)+(c.x-b.x)*(z-c.z))/t.det,
      v=((c.z-a.z)*(x-c.x)+(a.x-c.x)*(z-c.z))/t.det,w=1-u-v;
    if(Math.min(u,v,w)<-1e-7)continue;
    const y=u*a.y+v*b.y+w*c.y;
    if(!top||y>top.y)top={y,role:t.role};
  }
  return top;
}
/** Convex subtraction retains the outside fragments and discards the overlap.
 * It clips against emitted basin triangles, not an approximate ellipse. */
function subtractWaterTriangle(polygon,triangle){
  const [a,b,c]=triangle,orientation=Math.sign((b.x-a.x)*(c.z-a.z)-(b.z-a.z)*(c.x-a.x));
  let inside=polygon;const outside=[];
  for(let edge=0;edge<3&&inside.length;edge++){
    const a=triangle[edge],b=triangle[(edge+1)%3],distance=p=>orientation*((b.x-a.x)*(p.z-a.z)-(b.z-a.z)*(p.x-a.x));
    const keep=[],discard=[];
    for(let i=0;i<inside.length;i++){
      const p=inside[i],q=inside[(i+1)%inside.length],dp=distance(p),dq=distance(q);
      (dp>=0?keep:discard).push(p);
      if((dp>=0)!==(dq>=0)){
        const t=dp/(dp-dq),intersection={x:p.x+(q.x-p.x)*t,y:p.y+(q.y-p.y)*t,z:p.z+(q.z-p.z)*t};
        keep.push(intersection);discard.push(intersection);
      }
    }
    const area=discard.reduce((sum,p,i)=>{const q=discard[(i+1)%discard.length];return sum+p.x*q.z-q.x*p.z;},0);
    if(discard.length>=3&&Math.abs(area)>1e-9)outside.push(discard);
    inside=keep;
  }
  return outside;
}
function buildOasisWater(formation,terrainAt){
  const basin=formation.oasis,step=1.5,positions=[],indices=[];
  const x0=basin.centerX-basin.radiusX,x1=basin.centerX+basin.radiusX,z0=basin.centerZ-basin.radiusZ,z1=basin.centerZ+basin.radiusZ;
  const cols=Math.ceil((x1-x0)/step),rows=Math.ceil((z1-z0)/step),shoreMargin=(x,z)=>oasisWetMargin(formation,x,z);
  for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){
    const x=x0+i*step,z=z0+j*step,xn=Math.min(x1,x+step),zn=Math.min(z1,z+step);
    let polygon=[{x,z,margin:shoreMargin(x,z)},{x:xn,z,margin:shoreMargin(xn,z)},
      {x:xn,z:zn,margin:shoreMargin(xn,zn)},{x,z:zn,margin:shoreMargin(x,zn)}];
    const clipped=[];
    for(let k=0;k<polygon.length;k++){
      const a=polygon[k],b=polygon[(k+1)%polygon.length],insideA=a.margin>=0,insideB=b.margin>=0;
      if(insideA)clipped.push(a);
      if(insideA!==insideB){const t=a.margin/(a.margin-b.margin);clipped.push({x:a.x+(b.x-a.x)*t,z:a.z+(b.z-a.z)*t,margin:0});}
    }
    if(clipped.length<3)continue;
    const base=positions.length/3;
    for(const p of clipped)positions.push(p.x,basin.waterLevel,p.z);
    for(let k=1;k<clipped.length-1;k++)indices.push(base,base+k,base+k+1);
  }
  if(!indices.length)fail('OASIS_WATER_SURFACE_EMPTY');
  return Object.freeze({positions:new Float32Array(positions),indices:new Uint32Array(indices),vertexCount:positions.length/3,triangleCount:indices.length/3,waterLevel:basin.waterLevel});
}
function nearestRouteSegment(points,x,z){
  let best=null;
  for(let i=0;i<points.length-1;i++){
    const a=points[i],b=points[i+1],dx=b.x-a.x,dz=b.z-a.z,den=dx*dx+dz*dz;
    if(den<1e-8)continue;
    const t=Math.max(0,Math.min(1,((x-a.x)*dx+(z-a.z)*dz)/den)),qx=a.x+dx*t,qz=a.z+dz*t,distance=Math.hypot(x-qx,z-qz);
    if(!best||distance<best.distance)best={distance,x:qx,z:qz,bedY:a.bedY+(b.bedY-a.bedY)*t,segment:i,t};
  }
  return best;
}
/** Static light visibility against the actual cave and exposed rock triangles.
 * Rendering-only point rays; this is not a navigation clearance certificate.
 */
function makeCavernLightVisibility(meshes){
  const triangles=[];
  for(const mesh of meshes)for(let i=0;i<mesh.indices.length;i+=3){
    const [a,b,c]=[0,1,2].map(k=>Array.from(mesh.positions.slice(mesh.indices[i+k]*3,mesh.indices[i+k]*3+3)));
    triangles.push({a,e1:b.map((v,j)=>v-a[j]),e2:c.map((v,j)=>v-a[j])});
  }
  const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
  const dot=(a,b)=>a.reduce((n,v,j)=>n+v*b[j],0);
  return (origin,direction)=>{
    for(const {a,e1,e2} of triangles){
      const h=cross(direction,e2),det=dot(e1,h);if(Math.abs(det)<1e-10)continue;
      const s=origin.map((v,j)=>v-a[j]),u=dot(s,h)/det;if(u< -1e-7||u>1+1e-7)continue;
      const q=cross(s,e1),v=dot(direction,q)/det;if(v< -1e-7||u+v>1+1e-7)continue;
      const distance=dot(e2,q)/det;if(distance>1e-4)return 0;
    }
    return 1;
  };
}
/** Consumer-owned cave semantics. The frozen kernel constructs the boundary;
 * vertical ray/triangle intersections, rather than a second arch formula,
 * supply visible lip, supported floor, ceiling and solid occupancy together.
 * This is NOT the straight-prism consumer's sphere-clearance certificate.
 */
function buildKernelCavern(site,{floorAt,roofAt,caveRadius,caveCenterX}){
  const corners=[[-.74,0],[.38,-.012],[.85,.07],[1,.36],[.70,.78],
    [.18,1],[-.32,.93],[-.86,.62],[-1,.26]].map(([x,y])=>({x,y:y-.5}));
  // Clip the sharp construction corners while retaining the unequal shoulders
  // and offset crown. The result stays strictly convex for the frozen sweep.
  const profile=corners.flatMap((a,i)=>{
    const b=corners[(i+1)%corners.length];
    return [{x:a.x*.8+b.x*.2,y:a.y*.8+b.y*.2},
      {x:a.x*.2+b.x*.8,y:a.y*.2+b.y*.8}];
  });
  const stationCount=17,centerline=[],scales=[];
  const firstFloor=floorAt(site.x,site.portalZ);
  const firstHeight=roofAt(site.x,site.portalZ)-firstFloor;
  for(let i=0;i<stationCount;i++){
    const z=site.portalZ+site.galleryLength*i/(stationCount-1);
    // Two level entrance stations keep the first ring exactly on the existing
    // portal plane; transported inner rings may bend with the saved route.
    const x=i<2?site.x:caveCenterX(z),floor=i<2?firstFloor:floorAt(x,z);
    const height=i<2?firstHeight:roofAt(x,z)-floor;
    centerline.push({x,y:i<2?firstFloor+firstHeight*.5:floor+height*.5,z});
    scales.push({x:i<2?caveRadius(site.portalZ):caveRadius(z),y:height});
  }
  const constructed=constructHEarthSweptPassageMesh({primitiveId:'SITE_B_KERNEL_CAVERN',
    centerline,profile,scales,initialUp:{x:0,y:1,z:0},capStart:false,capEnd:true});
  if(!constructed.valid)fail('KERNEL_SWEEP:'+JSON.stringify(constructed.issues));
  const geometry=constructed.geometry,positions=new Float32Array(geometry.vertices.flatMap(p=>[p.x,p.y,p.z]));
  // Interior-facing disposable rendering copy; neutral kernel bytes stay frozen.
  const indices=new Uint32Array(geometry.indices.length);
  for(let i=0;i<indices.length;i+=3)indices.set([geometry.indices[i],geometry.indices[i+2],geometry.indices[i+1]],i);
  const mesh=Object.freeze({positions,indices,vertexCount:positions.length/3,triangleCount:indices.length/3,
    entranceClosed:false,farEndClosed:true,boundaryEdgeCount:profile.length,nonmanifoldEdgeCount:0,
    containsPhysicalFloor:true,ceilingNotSurfaceSkin:true,navSurface:'ACTUAL_KERNEL_TRIANGLES',
    kernelContract:constructed.sweep.contractId,profileVertexCount:profile.length,stationCount,
    sphereClearanceCertified:false});
  const triangles=[],buckets=new Map(),binSize=2;
  for(let i=0;i<indices.length;i+=3){
    const [a,b,c]=[0,1,2].map(k=>{const n=indices[i+k]*3;return {x:positions[n],y:positions[n+1],z:positions[n+2]}});
    const den=(b.z-c.z)*(a.x-c.x)+(c.x-b.x)*(a.z-c.z);
    if(Math.abs(den)<1e-10)continue; // A vertical wall has no vertical-ray area.
    const minX=Math.min(a.x,b.x,c.x),maxX=Math.max(a.x,b.x,c.x),minZ=Math.min(a.z,b.z,c.z),maxZ=Math.max(a.z,b.z,c.z);
    const id=triangles.length;triangles.push({a,b,c,den,minX,maxX,minZ,maxZ});
    for(let x=Math.floor(minX/binSize);x<=Math.floor(maxX/binSize);x++)for(let z=Math.floor(minZ/binSize);z<=Math.floor(maxZ/binSize);z++){
      const key=x+':'+z,list=buckets.get(key)??[];list.push(id);buckets.set(key,list);
    }
  }
  const caveSectionAt=(x,z)=>{
    if(z<site.portalZ||z>site.portalZ+site.galleryLength)return null;
    const hits=[];
    for(const id of buckets.get(Math.floor(x/binSize)+':'+Math.floor(z/binSize))??[]){
      const {a,b,c,den,minX,maxX,minZ,maxZ}=triangles[id];
      if(x<minX-1e-7||x>maxX+1e-7||z<minZ-1e-7||z>maxZ+1e-7)continue;
      const u=((b.z-c.z)*(x-c.x)+(c.x-b.x)*(z-c.z))/den;
      const v=((c.z-a.z)*(x-c.x)+(a.x-c.x)*(z-c.z))/den,w=1-u-v;
      if(Math.min(u,v,w)<-1e-7)continue;
      const y=u*a.y+v*b.y+w*c.y;
      if(!hits.some(h=>Math.abs(h-y)<1e-4))hits.push(y);
    }
    // Multiple disjoint intervals cannot silently become one traversable void.
    if(hits.length!==2)return null;
    const floorY=Math.min(...hits),ceilingY=Math.max(...hits);
    return ceilingY-floorY>1e-5?Object.freeze({floorY,ceilingY}):null;
  };
  return Object.freeze({mesh,caveSectionAt,constructed});
}
function buildReliefCliffFace(formation,terrainAt,aperture){
  const {site}=formation,left=aperture.xMin,right=aperture.xMax,start=aperture.zMin,step=.5;
  const regularCount=Math.ceil((right-left)/step);
  const lip=formation.kernelCaveBoundary;
  const lipXs=lip?Array.from({length:lip.profileVertexCount},(_,i)=>lip.positions[i*3]):[];
  const xs=[...new Set([...Array.from({length:regularCount+1},(_,i)=>left+(right-left)*i/regularCount),...lipXs])].sort((a,b)=>a-b);
  const count=xs.length-1,columns=xs.length,rows=48,fade=v=>{v=Math.max(0,Math.min(1,v));return v*v*(3-2*v)};
  const tops=[],bottoms=[];let reliefMin=Infinity,reliefMax=-Infinity,minimumRockFaceClearance=Infinity;
  for(let i=0;i<=count;i++){
    const x=xs[i],top=terrainAt(x,start),outside=formation.excavatedOutdoorTerrain(x,start);
    const centerX=formation.caveCenterX?.(start)??site.x,radius=formation.caveRadius(start),ratio=Math.abs(x-centerX)/radius;
    const section=formation.caveSectionAt?.(x,start);
    const floor=formation.floorAt(x,start),roof=formation.roofAt(x,start),arch=section?.ceilingY??(floor+(roof-floor)*Math.pow(Math.max(0,1-ratio*ratio),.375));
    const bottom=(formation.caveSectionAt?!!section:Math.abs(x-centerX)<radius)?Math.max(outside,arch):outside;
    tops.push(top);bottoms.push(bottom);minimumRockFaceClearance=Math.min(minimumRockFaceClearance,top-bottom);
  }
  const positions=[],indices=[];
  for(let j=0;j<=rows;j++)for(let i=0;i<=count;i++){
    const x=xs[i],t=j/rows,y=tops[i]+(bottoms[i]-tops[i])*t;
    // Shared upper and aperture edges stay on their original planes.
    const verticalBreak=j===0||j===rows?0:Math.sin(Math.PI*t);
    const edgeFade=fade(Math.min((x-left)/3.5,(right-x)/3.5))*verticalBreak*
      fade((tops[i]-bottoms[i])/2);
    // Recessed, fractured strata leave an uneven rock overhang below the
    // unchanged mountain contact. No smooth alternating cloth-like bulges.
    const triangleWave=v=>1-Math.abs(2*(v-Math.floor(v))-1);
    const bedding=triangleWave(y*.23+x*.055+.10*Math.sin(x*.17));
    const joint=triangleWave(x*.18-y*.035+.12*Math.sin(y*.11));
    const shelf=Math.max(0,1-Math.abs(y-(19.2+.14*(x-site.x)+.5*Math.sin(x*.33)))/.9);
    const relief=edgeFade*(.9+.85*bedding+.7*joint+1.15*shelf);
    reliefMin=Math.min(reliefMin,relief);reliefMax=Math.max(reliefMax,relief);
    positions.push(Math.fround(x),Math.fround(y),Math.fround(start+relief));
  }
  for(let j=0;j<rows;j++)for(let i=0;i<count;i++){
    const a=j*columns+i,b=a+1,c=a+columns,d=c+1;
    // Exterior rock faces the approach at lower Z, rather than the interior.
    for(const tri of [[a,b,c],[b,d,c]]){
      const x=(positions[tri[0]*3]+positions[tri[1]*3]+positions[tri[2]*3])/3;
      const points=tri.map(id=>positions.slice(id*3,id*3+3)),[p,q,r]=points;
      const cross=[(q[1]-p[1])*(r[2]-p[2])-(q[2]-p[2])*(r[1]-p[1]),
        (q[2]-p[2])*(r[0]-p[0])-(q[0]-p[0])*(r[2]-p[2]),
        (q[0]-p[0])*(r[1]-p[1])-(q[1]-p[1])*(r[0]-p[0])];
      // A collapsed column must not leave a horizontal floating sliver.
      // Test the actual Float32 submission, including its XY graph orientation.
      if(Math.hypot(...cross)<1e-8||cross[2]>=-1e-9)continue;
      const probes=[...points,...points.map((p,k)=>p.map((v,j)=>(v+points[(k+1)%3][j])/2)),
        [0,1,2].map(j=>(p[j]+q[j]+r[j])/3)];
      if(!probes.some(([x,y,z])=>formation.insideVoid(x,y,z)))indices.push(...tri);
    }
  }
  const mesh=Object.freeze({positions:new Float32Array(positions),indices:new Uint32Array(indices),vertexCount:positions.length/3,triangleCount:indices.length/3});
  // Exact front-depth lookup from the retained physical face, not a second
  // procedural field. It changes point occupancy only inside the recession slab.
  const bins=new Map(),frontTriangles=[],binSize=2;
  for(let i=0;i<mesh.indices.length;i+=3){
    const [a,b,c]=[0,1,2].map(k=>Array.from(mesh.positions.slice(mesh.indices[i+k]*3,mesh.indices[i+k]*3+3)));
    const den=(b[1]-c[1])*(a[0]-c[0])+(c[0]-b[0])*(a[1]-c[1]);
    if(Math.abs(den)<1e-10)continue;
    const id=frontTriangles.length;frontTriangles.push({a,b,c,den});
    for(let x=Math.floor(Math.min(a[0],b[0],c[0])/binSize);x<=Math.floor(Math.max(a[0],b[0],c[0])/binSize);x++)
      for(let y=Math.floor(Math.min(a[1],b[1],c[1])/binSize);y<=Math.floor(Math.max(a[1],b[1],c[1])/binSize);y++){
        const key=x+':'+y,list=bins.get(key)??[];list.push(id);bins.set(key,list);
      }
  }
  const rockFaceFrontAt=(x,y)=>{
    const hits=[];
    for(const id of bins.get(Math.floor(x/binSize)+':'+Math.floor(y/binSize))??[]){
      const {a,b,c,den}=frontTriangles[id];
      const u=((b[1]-c[1])*(x-c[0])+(c[0]-b[0])*(y-c[1]))/den;
      const v=((c[1]-a[1])*(x-c[0])+(a[0]-c[0])*(y-c[1]))/den,w=1-u-v;
      if(Math.min(u,v,w)<-1e-7)continue;
      const z=u*a[2]+v*b[2]+w*c[2];if(!hits.some(h=>Math.abs(h-z)<1e-4))hits.push(z);
    }
    return hits.length===1?hits[0]:null;
  };
  return Object.freeze({mesh,rockFaceFrontAt,maximumRecession:reliefMax,
    diagnostics:Object.freeze({exposedFaceReliefMeters:reliefMax-reliefMin,minimumRockFaceClearance})});
}
/** Build only once when the canonical package is resident, never on a frame update. */
export function constructGeologicalRuntimeBridge(canonical){
  if(!canonical?.buffers?.positions||!canonical?.primitiveSpans)fail('NO_CANONICAL_PACKAGE');
  const field=makeCanonicalAuthoringTerrainSampler(canonical);
  // Pull the original canonical terrain's actual linear-color boundary values.
  // The replacement terrain must not create a giant hard-edged material rectangle.
  const originalTerrainColorAt=(x,z)=>{
    const sample=field.sample(x,z);if(!sample)return null;
    const offset=sample.triangleOffset,idx=canonical.buffers.indices,pos=canonical.buffers.positions,colors=canonical.buffers.baseColorsLinear;
    const ids=[idx[offset],idx[offset+1],idx[offset+2]];
    const p=ids.map(id=>unprojectPlanetVertex(Math.fround(pos[id*3]),Math.fround(pos[id*3+1]),Math.fround(pos[id*3+2])));
    const [a,b,c]=p,den=(b.z-c.z)*(a.x-c.x)+(c.x-b.x)*(a.z-c.z);
    if(Math.abs(den)<1e-10)fail('COLOR_TRIANGLE_DEGENERATE');
    const u=((b.z-c.z)*(x-c.x)+(c.x-b.x)*(z-c.z))/den;
    const v=((c.z-a.z)*(x-c.x)+(a.x-c.x)*(z-c.z))/den;
    const w=1-u-v;
    return [0,1,2].map(k=>Math.max(0,Math.min(1,u*colors[ids[0]*4+k]+v*colors[ids[1]*4+k]+w*colors[ids[2]*4+k])));
  };
  const terrainAt=(x,z)=>field.elevation(x,z);
  const trace=traceGeologicalRuntimeDrainage(terrainAt);
  // Two independently sampled highland branches converge with the main D8
  // corridor at the irregular basin. The water geometry inherits their real
  // terrain descent; the seep is an authored scenic feature, not a surveyed
  // hydrology claim.
  const baseFormation=createGeologicalFormation({terrainAt,site:SITE,surveyRoute:trace});
  // Erosion is deliberately irregular at the mouth and quieter deeper inside.
  // These same surfaces feed the cave mesh, walk support, and solid occupancy.
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const smooth=(v)=>{v=clamp(v,0,1);return v*v*(3-2*v)};
  const oasis=Object.freeze({id:'SECOND_OASIS',centerX:SITE.x,centerZ:SITE.portalZ-24,
    radiusX:38,radiusZ:34,waterEdgeScale:.56,
    edgeHarmonics:Object.freeze([.22,-.13,.085,.045,-.032])});
  const oasisEdgeAt=(angle,x,z)=>1+oasis.edgeHarmonics[0]*Math.sin(3*angle)+
    oasis.edgeHarmonics[1]*Math.sin(5*angle+.7)+oasis.edgeHarmonics[2]*Math.cos(2*angle-.4)+
    oasis.edgeHarmonics[3]*Math.sin(7*angle+1.1)+oasis.edgeHarmonics[4]*Math.cos(9*angle-.6)+
    .025*Math.sin(x*.31+z*.23)*Math.cos(z*.27-x*.19);
  const oasisInfluenceAt=(x,z)=>{
    const dx=(x-oasis.centerX)/oasis.radiusX,dz=(z-oasis.centerZ)/oasis.radiusZ;
    const angle=Math.atan2(dz,dx),edge=oasisEdgeAt(angle,x,z);
    return smooth(1-Math.hypot(dx,dz)/edge);
  };
  const oasisCarveInfluenceAt=(x,z)=>{
    const portalSide=Math.abs(x-SITE.x)<=SITE.width+6;
    const awayFromPortal=smooth((SITE.portalZ-8-z)/12);
    return oasisInfluenceAt(x,z)*(portalSide?awayFromPortal:1);
  };
  const drainagePoints=Object.freeze(baseFormation.drainage.points.map(p=>Object.freeze({...p,bedY:p.bedY-1.65})));
  const channelInfluenceAt=(x,z)=>{
    const nearest=nearestRouteSegment(drainagePoints,x,z);if(!nearest)return 0;
    const approachFade=1-smooth((z-SITE.drainageHeadZ)/(SITE.portalZ-SITE.drainageHeadZ));
    const edge=Math.min(x-BOUNDS.xMin,BOUNDS.xMax-x,z-BOUNDS.zMin,BOUNDS.zMax-z);
    return smooth(1-nearest.distance/12)*approachFade*smooth(edge/12);
  };
  const excavatedOutdoorTerrain=(x,z)=>baseFormation.excavatedOutdoorTerrain(x,z)-
    1.65*channelInfluenceAt(x,z)-3.05*oasisCarveInfluenceAt(x,z);
  const oasisNearest=drainagePoints.reduce((best,p)=>
    !best||Math.hypot(p.x-oasis.centerX,p.z-oasis.centerZ)<best.distance?
      {distance:Math.hypot(p.x-oasis.centerX,p.z-oasis.centerZ),point:p}:best,null);
  const oasisWaterLevel=Math.min(terrainAt(oasis.centerX,oasis.centerZ)-1.2,oasisNearest.point.bedY+2.2);
  const drainage=Object.freeze({...baseFormation.drainage,waterPresent:true,waterSourceProven:false,
    permanentFlowProven:false,sourceType:'OWNER_AUTHORIZED_DESIGNED_SEEP_SCENIC_NOT_HYDROLOGICAL',
    points:drainagePoints,waterRoutes:Object.freeze([Object.freeze({id:'MAIN_RIVER',kind:'MAIN',points:drainagePoints})])});
  const entranceFade=(z)=>1-smooth((z-SITE.portalZ)/11);
  const caveCenterX=(z)=>{
    const d=Math.max(0,z-SITE.portalZ);
    return SITE.x+1.8*Math.sin(d*.16)*smooth((d-1.5)/5);
  };
  const roofAt=(x,z)=>{
    const s=(x-caveCenterX(z))/SITE.width,t=(z-SITE.portalZ)/SITE.galleryLength,e=entranceFade(z);
    const weathering=e*(.30*Math.sin(1.13*x+.83*z)+.20*Math.sin(.67*x-1.17*z+1.7)+.10*Math.sin(2.31*x+.47*z));
    const shoulder=e*(s<0?.62:-.28)*Math.exp(-Math.pow((Math.abs(s)-.64)/.4,2));
    const inner=.22*Math.sin(.62*x+.37*z)*Math.sin(Math.PI*clamp(t,0,1));
    return baseFormation.roofAt(x,z)+weathering+shoulder+inner;
  };
  const floorAt=(x,z)=>{
    const s=(x-caveCenterX(z))/SITE.width,t=(z-SITE.portalZ)/SITE.galleryLength;
    const mouth=entranceFade(z);
    return baseFormation.floorAt(x,z)+mouth*(.035*Math.sin(1.1*x-.8*z)+.025*Math.sin(.57*x+1.3*z))+
      .035*Math.sin(.8*x+.5*z)*Math.sin(Math.PI*clamp(t,0,1))*(1-Math.abs(s)*.35);
  };
  const caveRadius=(z)=>baseFormation.caveRadius(z)*(1+.14*Math.sin((z-SITE.portalZ)*.24+.45)+.07*Math.sin((z-SITE.portalZ)*.67+.9));
  const insideVoid=(x,y,z)=>{
    if(z<SITE.portalZ||z>SITE.portalZ+SITE.galleryLength)return false;
    const radius=caveRadius(z),ratio=Math.abs(x-caveCenterX(z))/radius;
    if(ratio>=1)return false;
    const floor=floorAt(x,z),roof=roofAt(x,z);
    return y>=floor&&y<floor+(roof-floor)*Math.pow(Math.max(0,1-ratio*ratio),.375);
  };
  const coverSamples=[];
  for(let z=SITE.portalZ;z<=SITE.portalZ+SITE.galleryLength;z+=2){
    const terrainY=terrainAt(SITE.x,z),ceilingY=roofAt(SITE.x,z),rockCover=terrainY-ceilingY;
    if(!(rockCover>0))fail('WEATHERED_ROOF_BREACH');
    coverSamples.push(Object.freeze({z,terrainY,ceilingY,rockCover}));
  }
  const kernel=buildKernelCavern(SITE,{floorAt,roofAt,caveRadius,caveCenterX});
  const caveSectionAt=kernel.caveSectionAt;
  const physicalFloorAt=(x,z)=>caveSectionAt(x,z)?.floorY??floorAt(x,z);
  const physicalRoofAt=(x,z)=>caveSectionAt(x,z)?.ceilingY??roofAt(x,z);
  const physicalInsideVoid=(x,y,z)=>{const q=caveSectionAt(x,z);return !!q&&y>=q.floorY&&y<q.ceilingY};
  // Check the whole generated shell against the uncut mountain, including
  // asymmetric shoulders; centerline-only samples cannot detect a side breach.
  let minimumKernelRoofCover=Infinity;
  for(let i=0;i<kernel.mesh.positions.length;i+=3){
    const [x,y,z]=kernel.mesh.positions.slice(i,i+3),cover=terrainAt(x,z)-y;
    if(!(cover>0))fail('KERNEL_SHELL_BREACHES_MOUNTAIN');
    minimumKernelRoofCover=Math.min(minimumKernelRoofCover,cover);
  }
  const formation=Object.freeze({...baseFormation,oasis:Object.freeze({...oasis,waterLevel:oasisWaterLevel}),
    oasisInfluenceAt,drainage,waterPresent:true,roofAt,floorAt,caveRadius,caveCenterX,insideVoid,excavatedOutdoorTerrain,
    caveSectionAt,kernelCaveBoundary:kernel.mesh,kernelConstruction:kernel.constructed,
    floorAt:physicalFloorAt,roofAt:physicalRoofAt,insideVoid:physicalInsideVoid,
    coverSamples:Object.freeze(coverSamples),minimumRoofCover:minimumKernelRoofCover,
    excavatedOutdoorTerrain,rockSolidAt:(x,y,z)=>y<=excavatedOutdoorTerrain(x,z)&&!physicalInsideVoid(x,y,z)});
  const rawPortal=constructGeologicalPortalAssembly(formation,terrainAt,{bounds:BOUNDS});
  const cliff=buildReliefCliffFace(formation,terrainAt,rawPortal.aperture);
  const physicalFormation=Object.freeze({...formation,rockFaceFrontAt:cliff.rockFaceFrontAt,
    rockSolidAt:(x,y,z)=>{
      if(physicalInsideVoid(x,y,z))return false;
      if(z>=SITE.portalZ&&z<=SITE.portalZ+cliff.maximumRecession){
        const front=cliff.rockFaceFrontAt(x,y);
        if(front!==null)return z>=front&&y<=terrainAt(x,z);
      }
      return formation.rockSolidAt(x,y,z);
    }});
  const portal=Object.freeze({...rawPortal,exposedCliffFace:cliff.mesh,diagnostics:Object.freeze({
    ...rawPortal.diagnostics,...cliff.diagnostics,openCaveApertureCells:true})});
  const retirement=deriveBaseTriangleRetirement(canonical,BOUNDS);
  const basinWater=buildOasisWater(formation,terrainAt);
  const parts=[
    ['ERODED_TERRAIN',portal.terrainWithoutAperture],
    ['MOUNTAIN_OVERBURDEN',portal.upperMantle],
    ['NATURAL_CLIFF_FACE',portal.exposedCliffFace],
    ['CAVERN_PHYSICAL_SHELL',portal.cave],
    ...formation.drainage.waterRoutes.map(route=>['FRESHWATER_RIVER',buildWaterRibbon(route,route.kind,formation,basinWater)]),
    ['OASIS_WATER',basinWater]
  ];
  const meshes=parts.map(([role,mesh])=>Object.freeze({role,mesh:projectGeologicalMeshForRenderer(mesh)}));
  const emittedWater=meshes.filter(p=>['FRESHWATER_RIVER','OASIS_WATER'].includes(p.role)).flatMap(p=>waterTriangles(p.mesh,{projected:true,role:p.role}));
  const sampleWaterAt=(x,z)=>{if(!Number.isFinite(x)||!Number.isFinite(z))fail('WATER_SAMPLE_NONFINITE');return sampleWaterTriangles(emittedWater,x,z);};
  const emittedOutdoor=meshes.filter(p=>p.role==='ERODED_TERRAIN').flatMap(p=>waterTriangles(p.mesh,{projected:true,role:'OUTDOOR_TERRAIN'}));
  const sampleOutdoorAt=(x,z)=>{if(!Number.isFinite(x)||!Number.isFinite(z))fail('OUTDOOR_SAMPLE_NONFINITE');return sampleWaterTriangles(emittedOutdoor,x,z);};
  const output=Object.freeze({sampleWaterAt,sampleOutdoorAt,contractId:GEOLOGICAL_RUNTIME_BRIDGE_ID,site:SITE,localBounds:BOUNDS,
    formation:physicalFormation,portal,retirement,meshes,route:trace,originalTerrainColorAt,
    cavernLightVisibility:makeCavernLightVisibility([kernel.mesh,cliff.mesh]),
    originalTerrainElevationAt:terrainAt,
    sourceWorldUnchanged:true,originalBaseTrianglesToRetire:retirement.triangleCount,
    hydrology:Object.freeze({waterPresent:true,waterSourceProven:false,sourceType:formation.drainage.sourceType,
      mainRouteResult:trace.result,mainRouteSteps:trace.path.length,tributaryCount:0,
      downhillTerrainSurvey:'ACTUAL_G_WORLD_CANONICAL_INDEXED_TRIANGLES_INVERSE_SPHERE_D8',
      oasisWaterLevel:formation.oasis.waterLevel,connectedOutletProven:false}),
    refinedGeometryClipRequired:true,sourcePass:'CANONICAL_PACKAGE_RUNTIME_DERIVATION'});
  return output;
}
/** Explicit installation only after renderer buffers and geological meshes succeed. */
export function installGeologicalRuntimeBridge(value){
  if(value?.contractId!==GEOLOGICAL_RUNTIME_BRIDGE_ID||!value.formation||!value.portal)fail('INSTALL_NOT_QUALIFIED');
  active=value;return Object.freeze({installed:true,siteId:value.site.id,originalBaseTrianglesToRetire:value.retirement.triangleCount});
}
export function getGeologicalRuntimeBridge(){return active}
/** null => preserve existing Gen324 behavior without touching canonical navigation. */
export function resolveGeologicalRuntimeFootSupport(x,z,{eyeHeight=2.25}={}){
  if(!active)return null;
  const {site,formation,localBounds:bounds}=active;
  if(z<site.portalZ){
    if(x<bounds.xMin||x>bounds.xMax||z<bounds.zMin||z>bounds.zMax)return null;
    const ground=active.sampleOutdoorAt(x,z);
    if(!ground)return Object.freeze({class:'EXTERIOR_DRY_CHANNEL',eligible:false,x,z,issues:['GEOLOGICAL_VISIBLE_OUTDOOR_SUPPORT_MISSING']});
    const support={class:'EXTERIOR_DRY_CHANNEL',eligible:true,x,z,footY:ground.y,eyeY:ground.y+eyeHeight,
      ceilingY:null,headroom:null,issues:[],worldManifoldUnchanged:true,boundarySource:'ACTUAL_EMITTED_TERRAIN_TRIANGLES'};
    const water=H_EARTH_WATER_PRESENTATION_ENABLED?active.sampleWaterAt(x,z):null;
    if(water&&water.y>support.footY+.05)return Object.freeze({...support,eligible:false,waterY:water.y,waterDepth:water.y-support.footY,issues:['GEOLOGICAL_SUBMERGED_OUTDOOR_SUPPORT']});
    return Object.freeze(support);
  }
  // The cave keeps its existing narrow physical domain and kernel collision.
  if(x<site.x-site.width-7||x>site.x+site.width+7||z>site.portalZ+site.galleryLength)return null;
  return sampleFormationWalkable(formation,{x,z,eyeHeight});
}
/** Strict counterpart to the Run8E source index degeneracy technique. */
export function retireGeologicalBaseIndices(source,retirement){
  if(!(source instanceof Uint32Array)||!(retirement?.triangleOffsets instanceof Uint32Array))fail('INDEX_TYPE');
  const result=new Uint32Array(source);
  for(const offset of retirement.triangleOffsets){if(offset<0||offset+2>=source.length||offset%3!==0)fail('RETIREMENT_OFFSET');
    result[offset+1]=result[offset];result[offset+2]=result[offset];}
  return result;
}

/** Derived visual exposure, referenced to ORIGINAL indexed mountain elevation.
 * Comparing a displaced vertex to the already-excavated surface gives zero
 * incision and incorrectly leaves the riverbed painted as undisturbed terrain.
 * This bounded blend is zero at the patch boundary; all accepted base colors
 * remain authoritative outside the carved landform.
 */
export function sampleGeologicalMaterialExposure(model,role,x,z){
  if(model?.contractId!==GEOLOGICAL_RUNTIME_BRIDGE_ID||
      !Number.isFinite(x)||!Number.isFinite(z))fail('MATERIAL_SAMPLE_INVALID');
  const b=model.localBounds;
  const edge=Math.min(x-b.xMin,b.xMax-x,z-b.zMin,b.zMax-z);
  const f=Math.max(0,Math.min(1,edge/12)),fade=f*f*(3-2*f);
  const before=model.originalTerrainElevationAt(x,z);
  const after=model.formation.excavatedOutdoorTerrain(x,z);
  if(!Number.isFinite(before)||!Number.isFinite(after))fail('MATERIAL_TERRAIN_NONFINITE');
  const incisionDepth=Math.max(0,before-after);
  const oasisCore=role==='ERODED_TERRAIN'?(model.formation.oasisInfluenceAt?.(x,z)??0):0;
  const materialWeight=(role==='ERODED_TERRAIN'?Math.max(Math.min(.8,incisionDepth*.5),oasisCore*.72):
    role==='MOUNTAIN_OVERBURDEN'?.06:role==='NATURAL_CLIFF_FACE'?.72:1)*fade;
  const oasisInfluence=oasisCore*fade;
  return Object.freeze({sourceOriginalHeight:before,excavatedHeight:after,
    incisionDepth,edgeFade:fade,rockWeight:materialWeight,oasisInfluence,
    originalWorldMutated:false});
}
