import { CAMERA, SITE } from './manor.estate.neutral-blockout.mjs';
import { PORTALS, MATERIAL_ZONES, BUTTRESSES, ROOF_EDGE_ARCHITECTURE } from './manor.estate.gothic-detail-phase1.mjs';
import { buildPhase1CDetailMesh, auditPhase1C, POINTED_PORTAL_PROFILES } from './manor.estate.gothic-detail-phase1c.mjs';

const freeze=(v)=>Object.freeze(v);
const V=(x,y,z)=>freeze([x,y,z]);
export const CONTRACT='MIRROR_MANOR_GOTHIC_ARCHITECTURAL_DETAIL_PHASE1D_v1';
export const PARENT_CONTRACT='MIRROR_MANOR_GOTHIC_ARCHITECTURAL_DETAIL_PHASE1C_v1';
export const RULES=freeze({openPointedArchHead:true,dormers:false,tracery:false,sculpture:false,gargoyles:false,weathering:false,freeLinework:false,roofStampedWindows:false,decorativeCamouflage:false,carouselDistance:94,principalSpan:27});
const blockedHeadIds=freeze(PORTALS.map(p=>`${p.id}-POINT`));
function quadPrism(id,front,back,material,role){const p=[...front,...back],idx=[[0,1,2],[0,2,3],[4,6,5],[4,7,6],[0,4,5],[0,5,1],[1,5,6],[1,6,2],[2,6,7],[2,7,3],[3,7,4],[3,4,0]];return freeze({id,role,material,triangles:freeze(idx.flatMap(f=>[p[f[0]],p[f[1]],p[f[2]]]))});}
function frameMeshes(p){const {id,wx,half,spring,apex,zFace,dir,recess}=p,depth=Math.max(.22,recess),zf=zFace+dir*.10,zb=zf-dir*depth,t=.18;
 const leftF=[V(wx-half-t,spring,zf),V(wx-half,spring,zf),V(wx,apex,zf),V(wx-t,apex,zf)],leftB=leftF.map(q=>V(q[0],q[1],zb));
 const rightF=[V(wx+half,spring,zf),V(wx+half+t,spring,zf),V(wx+t,apex,zf),V(wx,apex,zf)],rightB=rightF.map(q=>V(q[0],q[1],zb));
 return freeze([quadPrism(`P1D-${id}-ARCH-L`,leftF,leftB,'PORTAL_STONE','pointed-arch-frame'),quadPrism(`P1D-${id}-ARCH-R`,rightF,rightB,'PORTAL_STONE','pointed-arch-frame')]);}
export function buildPhase1DDetailMesh(){const c=buildPhase1CDetailMesh(),base=c.meshes.filter(m=>!blockedHeadIds.includes(m.id)),frames=[];POINTED_PORTAL_PROFILES.forEach(p=>frames.push(...frameMeshes(p)));return freeze({contract:CONTRACT,parent:PARENT_CONTRACT,meshes:freeze([...base,...frames]),frames:freeze(frames),suppressedHeadIds:blockedHeadIds});}
export function auditPhase1D(){const c=auditPhase1C(),m=buildPhase1DDetailMesh(),solidHeadsAbsent=blockedHeadIds.every(id=>!m.meshes.some(x=>x.id===id)),frameComplete=m.frames.length===4&&m.frames.every(x=>x.role==='pointed-arch-frame'),apertureOpen=solidHeadsAbsent&&frameComplete,p3Preserved=SITE.principalStructuralSpan===27&&CAMERA.distance===94,noForbiddenDetail=!RULES.dormers&&!RULES.tracery&&!RULES.sculpture&&!RULES.gargoyles&&!RULES.weathering&&!RULES.freeLinework&&!RULES.roofStampedWindows&&!RULES.decorativeCamouflage;return freeze({contract:CONTRACT,phase1cStatic:c.passStatic,solidHeadsAbsent,frameComplete,apertureOpen,portalCount:POINTED_PORTAL_PROFILES.length,archFrameMeshCount:m.frames.length,buttressCount:BUTTRESSES.length,roofEdgeCount:ROOF_EDGE_ARCHITECTURE.length,p3Preserved,noForbiddenDetail,passStatic:c.passStatic&&apertureOpen&&p3Preserved&&noForbiddenDetail});}
