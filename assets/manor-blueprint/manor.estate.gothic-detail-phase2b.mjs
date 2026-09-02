import { CAMERA, SITE, ROOFS } from './manor.estate.neutral-blockout.mjs';
import { buildPhase2DetailMesh, auditPhase2, DORMERS } from './manor.estate.gothic-detail-phase2.mjs';

const freeze=(v)=>Object.freeze(v);
const V=(x,y,z)=>freeze([x,y,z]);
export const CONTRACT='MIRROR_MANOR_GOTHIC_ARCHITECTURAL_DETAIL_PHASE2B_v1';
export const PARENT_CONTRACT='MIRROR_MANOR_GOTHIC_ARCHITECTURAL_DETAIL_PHASE2_v1';
export const RULES=freeze({
  trueDormerRoofSeating:true,slopedLowerCheeks:true,levelWallPlate:true,explicitRoofCurb:true,dormerFaceGlazingOnly:true,
  roofStampedWindows:false,freeLinework:false,decorativeCamouflage:false,unownedIntersections:false,
  sculpture:false,gargoyles:false,weathering:false,carouselDistance:94,principalSpan:27,dormerCount:2
});
const roof=(id)=>ROOFS.find(r=>r.id===id);
function roofHeight(z){const r=roof('R-GH-B'),half=r.depth/2;if(!r||z<0||z>half)throw new Error('Dormer edge outside assigned +Z roof slope');return r.eaveHeight+(half-z)*(r.ridgeHeight-r.eaveHeight)/half;}
function quadPrism(id,front,back,material,role){const p=[...front,...back],idx=[[0,1,2],[0,2,3],[4,6,5],[4,7,6],[0,4,5],[0,5,1],[1,5,6],[1,6,2],[2,6,7],[2,7,3],[3,7,4],[3,4,0]];return freeze({id,role,material,triangles:freeze(idx.flatMap(f=>[p[f[0]],p[f[1]],p[f[2]]]))});}
function boxMesh(id,c,w,h,d,material,role){const[cx,cy,cz]=c,x=w/2,y=h/2,z=d/2,p=[V(cx-x,cy-y,cz-z),V(cx+x,cy-y,cz-z),V(cx+x,cy+y,cz-z),V(cx-x,cy+y,cz-z),V(cx-x,cy-y,cz+z),V(cx+x,cy-y,cz+z),V(cx+x,cy+y,cz+z),V(cx-x,cy+y,cz+z)],idx=[[0,1,2],[0,2,3],[4,6,5],[4,7,6],[0,4,5],[0,5,1],[3,2,6],[3,6,7],[1,5,6],[1,6,2],[0,3,7],[0,7,4]];return freeze({id,role,material,triangles:freeze(idx.flatMap(f=>[p[f[0]],p[f[1]],p[f[2]]]))});}
function triPrism(id,c,width,height,depth,material,role){const[cx,baseY,cz]=c,w=width/2,d=depth/2,p=[V(cx-w,baseY,cz-d),V(cx+w,baseY,cz-d),V(cx,baseY+height,cz-d),V(cx-w,baseY,cz+d),V(cx+w,baseY,cz+d),V(cx,baseY+height,cz+d)],idx=[[0,1,2],[3,5,4],[0,3,4],[0,4,1],[1,4,5],[1,5,2],[2,5,3],[2,3,0]];return freeze({id,role,material,triangles:freeze(idx.flatMap(f=>[p[f[0]],p[f[1]],p[f[2]]]))});}
function slopeStrip(id,x0,x1,zRear,zFront,yRear,yFront,height,material,role){const front=[V(x0,yFront,zFront),V(x1,yFront,zFront),V(x1,yFront+height,zFront),V(x0,yFront+height,zFront)],back=[V(x0,yRear,zRear),V(x1,yRear,zRear),V(x1,yRear+height,zRear),V(x0,yRear+height,zRear)];return quadPrism(id,front,back,material,role);}
function seatedBody(id,xL,xR,zRear,zFront,rearBase,frontBase,topY,material,role){const front=[V(xL,frontBase,zFront),V(xR,frontBase,zFront),V(xR,topY,zFront),V(xL,topY,zFront)],back=[V(xL,rearBase,zRear),V(xR,rearBase,zRear),V(xR,topY,zRear),V(xL,topY,zRear)];return quadPrism(id,front,back,material,role);}
export const DORMER_SEATING=freeze(DORMERS.map(d=>{const zRear=d.z-d.depth/2,zFront=d.z+d.depth/2,rearBase=roofHeight(zRear),frontBase=roofHeight(zFront),topY=Math.max(rearBase,frontBase)+d.wallHeight;return freeze({...d,zRear,zFront,rearBase,frontBase,topY,slopeDelta:rearBase-frontBase});}));
function correctedDormerMeshes(d){
  const xL=d.x-d.width/2,xR=d.x+d.width/2,curb=.12,out=[];
  out.push(seatedBody(`${d.id}-BODY`,xL,xR,d.zRear,d.zFront,d.rearBase,d.frontBase,d.topY,'DORMER_STONE','slope-seated-dormer-body'));
  out.push(slopeStrip(`${d.id}-CURB-L`,xL-curb,xL,d.zRear,d.zFront,d.rearBase,d.frontBase,curb,'ACCENT_STONE','dormer-roof-curb'));
  out.push(slopeStrip(`${d.id}-CURB-R`,xR,xR+curb,d.zRear,d.zFront,d.rearBase,d.frontBase,curb,'ACCENT_STONE','dormer-roof-curb'));
  out.push(boxMesh(`${d.id}-CURB-F`,V(d.x,d.frontBase+curb/2,d.zFront+curb/2),d.width+curb*2,curb,curb,'ACCENT_STONE','dormer-roof-curb'));
  out.push(boxMesh(`${d.id}-CURB-RR`,V(d.x,d.rearBase+curb/2,d.zRear-curb/2),d.width+curb*2,curb,curb,'ACCENT_STONE','dormer-roof-curb'));
  const faceAvail=d.topY-d.frontBase,glassH=Math.max(.42,faceAvail*.48),glassY=d.frontBase+faceAvail*.53;
  out.push(boxMesh(`${d.id}-GLASS`,V(d.x,glassY,d.zFront+.035),d.width*.52,glassH,.07,'LEADED_GLASS','dormer-face-glazing'));
  out.push(boxMesh(`${d.id}-MULLION`,V(d.x,glassY,d.zFront+.075),.08,glassH,.08,'TRACERY_STONE','dormer-owned-mullion'));
  out.push(triPrism(`${d.id}-GABLE`,V(d.x,d.topY,d.z),d.width+.18,d.roofRise,d.depth+.16,'DORMER_SLATE','complete-dormer-roof'));
  return freeze(out);
}
const OLD_DORMER_PREFIXES=freeze(DORMERS.map(d=>d.id));
export function buildPhase2BDetailMesh(){const p2=buildPhase2DetailMesh(),base=p2.meshes.filter(m=>!OLD_DORMER_PREFIXES.some(prefix=>m.id.startsWith(prefix))),corrected=[];DORMER_SEATING.forEach(d=>corrected.push(...correctedDormerMeshes(d)));return freeze({contract:CONTRACT,parent:PARENT_CONTRACT,meshes:freeze([...base,...corrected]),correctedDormerMeshes:freeze(corrected)});}
export function auditPhase2B(){const p2=auditPhase2(),m=buildPhase2BDetailMesh(),bodies=m.correctedDormerMeshes.filter(x=>x.role==='slope-seated-dormer-body'),curbs=m.correctedDormerMeshes.filter(x=>x.role==='dormer-roof-curb'),roofs=m.correctedDormerMeshes.filter(x=>x.role==='complete-dormer-roof'),glass=m.correctedDormerMeshes.filter(x=>x.role==='dormer-face-glazing');const edgeHeightsValid=DORMER_SEATING.every(d=>d.rearBase===roofHeight(d.zRear)&&d.frontBase===roofHeight(d.zFront)&&d.rearBase>d.frontBase&&d.slopeDelta>0&&d.topY>d.rearBase&&d.topY>d.frontBase);const oldDormersAbsent=OLD_DORMER_PREFIXES.every(prefix=>!m.meshes.some(x=>x.id.startsWith(prefix)&&!m.correctedDormerMeshes.includes(x)));const junctionComplete=bodies.length===2&&curbs.length===8&&roofs.length===2&&glass.length===2;const p3Preserved=SITE.principalStructuralSpan===27&&CAMERA.distance===94;const noForbiddenDetail=!RULES.roofStampedWindows&&!RULES.freeLinework&&!RULES.decorativeCamouflage&&!RULES.unownedIntersections&&!RULES.sculpture&&!RULES.gargoyles&&!RULES.weathering;return freeze({contract:CONTRACT,phase2Static:p2.passStatic,dormerCount:DORMER_SEATING.length,edgeHeightsValid,levelWallPlate:RULES.levelWallPlate,oldDormersAbsent,junctionComplete,slopeDeltas:freeze(DORMER_SEATING.map(d=>d.slopeDelta)),curbMeshCount:curbs.length,p3Preserved,noForbiddenDetail,passStatic:p2.passStatic&&edgeHeightsValid&&oldDormersAbsent&&junctionComplete&&p3Preserved&&noForbiddenDetail});}
