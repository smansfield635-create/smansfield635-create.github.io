import { MASSES, CAMERA, SITE } from './manor.estate.neutral-blockout.mjs';
import { PORTALS, MATERIAL_ZONES, BUTTRESSES, ROOF_EDGE_ARCHITECTURE } from './manor.estate.gothic-detail-phase1.mjs';
import { buildPhase1BDetailMesh, auditPhase1B, TRUE_OPENINGS, FACADE_REPLACEMENTS, OMIT_FACE_MAP } from './manor.estate.gothic-detail-phase1b.mjs';

const freeze=(v)=>Object.freeze(v);
const V=(x,y,z)=>freeze([x,y,z]);
export const CONTRACT='MIRROR_MANOR_GOTHIC_ARCHITECTURAL_DETAIL_PHASE1C_v1';
export const PARENT_CONTRACT='MIRROR_MANOR_GOTHIC_ARCHITECTURAL_DETAIL_PHASE1B_v1';
export const RULES=freeze({
  pointedPortalTopology:true,
  rectangularJambOpeningBelowSpring:true,
  upperSpandrelMasonryPreserved:true,
  slopedPointedReveals:true,
  dormers:false,tracery:false,sculpture:false,gargoyles:false,weathering:false,freeLinework:false,
  roofStampedWindows:false,decorativeCamouflage:false,carouselDistance:94,principalSpan:27
});
function host(id){return MASSES.find((m)=>m.id===id);}
function prismFromTriangles(id,front,back,material,role){
  const p=[...front,...back];
  const idx=[[0,1,2],[3,5,4],[0,3,4],[0,4,1],[1,4,5],[1,5,2],[2,5,3],[2,3,0]];
  return freeze({id,role,material,triangles:freeze(idx.flatMap(f=>[p[f[0]],p[f[1]],p[f[2]]]))});
}
function quadPrism(id,front,back,material,role){
  const p=[...front,...back];
  const idx=[[0,1,2],[0,2,3],[4,6,5],[4,7,6],[0,4,5],[0,5,1],[1,5,6],[1,6,2],[2,6,7],[2,7,3],[3,7,4],[3,4,0]];
  return freeze({id,role,material,triangles:freeze(idx.flatMap(f=>[p[f[0]],p[f[1]],p[f[2]]]))});
}
export const POINTED_PORTAL_PROFILES=freeze(PORTALS.map((s)=>{
  const h=host(s.host); if(!h)throw new Error(`Unknown portal host ${s.host}`);
  const wx=h.center[0]+s.centerX, half=s.width/2, spring=s.springHeight, apex=s.springHeight+s.pointRise;
  const zFace=h.center[2]+(s.face==='+Z'?h.depth/2:-h.depth/2), dir=s.face==='+Z'?1:-1;
  return freeze({id:s.id,host:s.host,face:s.face,wx,half,spring,apex,zFace,dir,recess:s.recess,material:'PORTAL_STONE'});
}));
function pointedPortalCorrection(profile){
  const {id,wx,half,spring,apex,zFace,dir,recess,material}=profile;
  const zFront=zFace-dir*0.05, zBack=zFace-dir*Math.max(0.22,recess);
  const leftFront=[V(wx-half,spring,zFront),V(wx,spring,zFront),V(wx,apex,zFront)];
  const leftBack=[V(wx-half,spring,zBack),V(wx,spring,zBack),V(wx,apex,zBack)];
  const rightFront=[V(wx,spring,zFront),V(wx+half,spring,zFront),V(wx,apex,zFront)];
  const rightBack=[V(wx,spring,zBack),V(wx+half,spring,zBack),V(wx,apex,zBack)];
  // Spandrel wedges restore masonry outside the pointed aperture but inside the former rectangular cut.
  const leftSpandrelFront=[V(wx-half,spring,zFront),V(wx-half,apex,zFront),V(wx,apex,zFront)];
  const leftSpandrelBack=[V(wx-half,spring,zBack),V(wx-half,apex,zBack),V(wx,apex,zBack)];
  const rightSpandrelFront=[V(wx+half,spring,zFront),V(wx,apex,zFront),V(wx+half,apex,zFront)];
  const rightSpandrelBack=[V(wx+half,spring,zBack),V(wx,apex,zBack),V(wx+half,apex,zBack)];
  const t=0.10;
  const leftSlopeFront=[V(wx-half,spring,zFront),V(wx-half+t,spring,zFront),V(wx+t/2,apex,zFront),V(wx,apex,zFront)];
  const leftSlopeBack=[V(wx-half,spring,zBack),V(wx-half+t,spring,zBack),V(wx+t/2,apex,zBack),V(wx,apex,zBack)];
  const rightSlopeFront=[V(wx+half-t,spring,zFront),V(wx+half,spring,zFront),V(wx,apex,zFront),V(wx-t/2,apex,zFront)];
  const rightSlopeBack=[V(wx+half-t,spring,zBack),V(wx+half,spring,zBack),V(wx,apex,zBack),V(wx-t/2,apex,zBack)];
  return freeze([
    prismFromTriangles(`P1C-${id}-SPANDREL-L`,leftSpandrelFront,leftSpandrelBack,'GRAND_STONE','portal-spandrel-masonry'),
    prismFromTriangles(`P1C-${id}-SPANDREL-R`,rightSpandrelFront,rightSpandrelBack,'GRAND_STONE','portal-spandrel-masonry'),
    quadPrism(`P1C-${id}-SLOPE-L`,leftSlopeFront,leftSlopeBack,material,'pointed-portal-sloped-reveal'),
    quadPrism(`P1C-${id}-SLOPE-R`,rightSlopeFront,rightSlopeBack,material,'pointed-portal-sloped-reveal')
  ]);
}
export function buildPhase1CDetailMesh(){
  const p1b=buildPhase1BDetailMesh();
  const corrections=[]; POINTED_PORTAL_PROFILES.forEach(p=>corrections.push(...pointedPortalCorrection(p)));
  return freeze({contract:CONTRACT,parent:PARENT_CONTRACT,meshes:freeze([...p1b.meshes,...corrections]),correctionMeshes:freeze(corrections)});
}
export function auditPhase1C(){
  const p1b=auditPhase1B(), mesh=buildPhase1CDetailMesh(), corrections=mesh.correctionMeshes;
  const spandrels=corrections.filter(m=>m.role==='portal-spandrel-masonry');
  const slopes=corrections.filter(m=>m.role==='pointed-portal-sloped-reveal');
  const profileValid=POINTED_PORTAL_PROFILES.length===2&&POINTED_PORTAL_PROFILES.every(p=>p.apex>p.spring&&p.half>0&&p.recess>0);
  const topologyComplete=spandrels.length===4&&slopes.length===4;
  const p3Preserved=SITE.principalStructuralSpan===27&&CAMERA.distance===94;
  const noForbiddenDetail=!RULES.dormers&&!RULES.tracery&&!RULES.sculpture&&!RULES.gargoyles&&!RULES.weathering&&!RULES.freeLinework&&!RULES.roofStampedWindows&&!RULES.decorativeCamouflage;
  return freeze({contract:CONTRACT,p1bStatic:p1b.passStatic,profileValid,topologyComplete,spandrelMeshCount:spandrels.length,slopedRevealMeshCount:slopes.length,portalCount:POINTED_PORTAL_PROFILES.length,trueOpeningCount:TRUE_OPENINGS.length,facadeReplacementCount:FACADE_REPLACEMENTS.length,omitFaceHostCount:Object.keys(OMIT_FACE_MAP).length,buttressCount:BUTTRESSES.length,roofEdgeCount:ROOF_EDGE_ARCHITECTURE.length,p3Preserved,noForbiddenDetail,passStatic:p1b.passStatic&&profileValid&&topologyComplete&&p3Preserved&&noForbiddenDetail});
}
