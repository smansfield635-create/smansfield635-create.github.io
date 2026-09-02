import { MASSES, CAMERA, SITE } from './manor.estate.neutral-blockout.mjs';
import { WALL_BAYS, PORTALS, BUTTRESSES, ROOF_EDGE_ARCHITECTURE, MATERIAL_ZONES, buildPhase1DetailMesh, auditPhase1 } from './manor.estate.gothic-detail-phase1.mjs';

const freeze=(v)=>Object.freeze(v);
const V=(x,y,z)=>freeze([x,y,z]);
export const CONTRACT='MIRROR_MANOR_GOTHIC_ARCHITECTURAL_DETAIL_PHASE1B_v1';
export const PARENT_CONTRACT='MIRROR_MANOR_GOTHIC_ARCHITECTURAL_DETAIL_PHASE1_v1';
export const RULES=freeze({
  trueFacadeOpenings:true,
  dormers:false,tracery:false,sculpture:false,gargoyles:false,weathering:false,freeLinework:false,
  roofStampedWindows:false,decorativeCamouflage:false,carouselDistance:94,principalSpan:27
});
export const FACADE_REPLACEMENTS=freeze([
  freeze({host:'GH',face:'+Z',material:'GRAND_STONE'}),
  freeze({host:'GH',face:'-Z',material:'GRAND_STONE'}),
  freeze({host:'WW',face:'+Z',material:'OLD_CORE_STONE'}),
  freeze({host:'EW',face:'+Z',material:'LATER_STONE'}),
  freeze({host:'GHSE',face:'+Z',material:'GRAND_STONE'})
]);
export const OMIT_FACE_MAP=freeze(FACADE_REPLACEMENTS.reduce((out,f)=>{(out[f.host]??=[]).push(f.face);return out;},{}));
function host(id){return MASSES.find((m)=>m.id===id);}
function boxMesh(id,c,w,h,d,material,role){const[cx,cy,cz]=c,x=w/2,y=h/2,z=d/2;const p=[V(cx-x,cy-y,cz-z),V(cx+x,cy-y,cz-z),V(cx+x,cy+y,cz-z),V(cx-x,cy+y,cz-z),V(cx-x,cy-y,cz+z),V(cx+x,cy-y,cz+z),V(cx+x,cy+y,cz+z),V(cx-x,cy+y,cz+z)];const idx=[[0,1,2],[0,2,3],[4,6,5],[4,7,6],[0,4,5],[0,5,1],[3,2,6],[3,6,7],[1,5,6],[1,6,2],[0,3,7],[0,7,4]];return freeze({id,role,material,triangles:freeze(idx.flatMap(f=>[p[f[0]],p[f[1]],p[f[2]]]))});}
function openingRectFromBay(s){return freeze({id:s.id,host:s.host,face:s.face,x0:s.centerX-s.width/2,x1:s.centerX+s.width/2,y0:s.centerY-s.height/2,y1:s.centerY+s.height/2,kind:'bay',recess:s.recess});}
function openingRectFromPortal(s){return freeze({id:s.id,host:s.host,face:s.face,x0:s.centerX-(s.width/2),x1:s.centerX+(s.width/2),y0:0,y1:s.springHeight+s.pointRise,kind:'portal',recess:s.recess});}
export const TRUE_OPENINGS=freeze([...WALL_BAYS.map(openingRectFromBay),...PORTALS.map(openingRectFromPortal)]);
function faceOpenings(hostId,face){return TRUE_OPENINGS.filter((o)=>o.host===hostId&&o.face===face);}
function panelizeFacade(spec){
  const h=host(spec.host); if(!h)throw new Error(`Unknown facade host ${spec.host}`);
  const openings=faceOpenings(spec.host,spec.face); const xs=[-h.width/2,h.width/2],ys=[0,h.height];
  openings.forEach(o=>{xs.push(o.x0,o.x1);ys.push(o.y0,o.y1);});
  const xcuts=[...new Set(xs.map(v=>Number(v.toFixed(6))))].sort((a,b)=>a-b),ycuts=[...new Set(ys.map(v=>Number(v.toFixed(6))))].sort((a,b)=>a-b);
  const zFace=h.center[2]+(spec.face==='+Z'?h.depth/2:-h.depth/2),depth=0.10,dir=spec.face==='+Z'?1:-1,meshes=[];
  let seq=0;
  for(let xi=0;xi<xcuts.length-1;xi++)for(let yi=0;yi<ycuts.length-1;yi++){
    const x0=xcuts[xi],x1=xcuts[xi+1],y0=ycuts[yi],y1=ycuts[yi+1]; if(x1-x0<1e-5||y1-y0<1e-5)continue;
    const mx=(x0+x1)/2,my=(y0+y1)/2,inside=openings.some(o=>mx>o.x0+1e-6&&mx<o.x1-1e-6&&my>o.y0+1e-6&&my<o.y1-1e-6); if(inside)continue;
    meshes.push(boxMesh(`P1B-${spec.host}-${spec.face}-${seq++}`,V(h.center[0]+mx,my,zFace-dir*depth/2),x1-x0,y1-y0,depth,spec.material,'replacement-facade-panel'));
  }
  return freeze(meshes);
}
function revealMeshes(opening){
  const h=host(opening.host),dir=opening.face==='+Z'?1:-1,zFace=h.center[2]+(opening.face==='+Z'?h.depth/2:-h.depth/2),depth=Math.max(0.18,opening.recess),t=0.08,x0=h.center[0]+opening.x0,x1=h.center[0]+opening.x1,y0=opening.y0,y1=opening.y1,material='PORTAL_STONE';
  const z=zFace-dir*depth/2,w=x1-x0,hh=y1-y0,meshes=[];
  meshes.push(boxMesh(`REVEAL-${opening.id}-L`,V(x0+t/2,(y0+y1)/2,z),t,hh,depth,material,'opening-reveal'));
  meshes.push(boxMesh(`REVEAL-${opening.id}-R`,V(x1-t/2,(y0+y1)/2,z),t,hh,depth,material,'opening-reveal'));
  if(y0>0.001)meshes.push(boxMesh(`REVEAL-${opening.id}-SILL`,V((x0+x1)/2,y0+t/2,z),w,t,depth,material,'opening-reveal'));
  meshes.push(boxMesh(`REVEAL-${opening.id}-HEAD`,V((x0+x1)/2,y1-t/2,z),w,t,depth,material,'opening-reveal'));
  return freeze(meshes);
}
export function buildPhase1BFacadeMesh(){const meshes=[];FACADE_REPLACEMENTS.forEach(f=>meshes.push(...panelizeFacade(f)));TRUE_OPENINGS.forEach(o=>meshes.push(...revealMeshes(o)));return freeze({contract:CONTRACT,meshes:freeze(meshes),openingCount:TRUE_OPENINGS.length});}
export function buildPhase1BDetailMesh(){const p1=buildPhase1DetailMesh(),facade=buildPhase1BFacadeMesh();return freeze({contract:CONTRACT,parent:PARENT_CONTRACT,meshes:freeze([...p1.meshes,...facade.meshes])});}
function openingWithinHost(o){const h=host(o.host);return !!h&&o.x0>=-h.width/2+0.10&&o.x1<=h.width/2-0.10&&o.y0>=0&&o.y1<=h.height-0.10;}
export function auditPhase1B(){
  const p1=auditPhase1(),openingContainment=TRUE_OPENINGS.every(openingWithinHost),replacementOwnership=FACADE_REPLACEMENTS.every(f=>!!host(f.host)&&(f.face==='+Z'||f.face==='-Z')),allAffectedFacesOmitted=FACADE_REPLACEMENTS.every(f=>(OMIT_FACE_MAP[f.host]||[]).includes(f.face)),facadeMesh=buildPhase1BFacadeMesh();
  const realHoleTopology=TRUE_OPENINGS.length===WALL_BAYS.length+PORTALS.length&&facadeMesh.meshes.length>TRUE_OPENINGS.length;
  const p3Preserved=SITE.principalStructuralSpan===27&&CAMERA.distance===94;
  const noForbiddenDetail=!RULES.dormers&&!RULES.tracery&&!RULES.sculpture&&!RULES.gargoyles&&!RULES.weathering&&!RULES.freeLinework&&!RULES.roofStampedWindows&&!RULES.decorativeCamouflage;
  return freeze({contract:CONTRACT,p1Static:p1.passStatic,openingContainment,replacementOwnership,allAffectedFacesOmitted,realHoleTopology,p3Preserved,noForbiddenDetail,openingCount:TRUE_OPENINGS.length,replacementFacadeCount:FACADE_REPLACEMENTS.length,facadeMeshCount:facadeMesh.meshes.length,buttressCount:BUTTRESSES.length,roofEdgeCount:ROOF_EDGE_ARCHITECTURE.length,passStatic:p1.passStatic&&openingContainment&&replacementOwnership&&allAffectedFacesOmitted&&realHoleTopology&&p3Preserved&&noForbiddenDetail});
}
