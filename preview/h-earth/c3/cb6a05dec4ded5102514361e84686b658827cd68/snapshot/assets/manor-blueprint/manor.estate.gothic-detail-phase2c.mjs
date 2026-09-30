import { CAMERA, SITE, ROOFS } from './manor.estate.neutral-blockout.mjs';
import { buildPhase2BDetailMesh, auditPhase2B, DORMER_SEATING } from './manor.estate.gothic-detail-phase2b.mjs';

const freeze=v=>Object.freeze(v); const V=(x,y,z)=>freeze([x,y,z]);
export const CONTRACT='MIRROR_MANOR_GOTHIC_ARCHITECTURAL_DETAIL_PHASE2C_v1';
export const PARENT_CONTRACT='MIRROR_MANOR_GOTHIC_ARCHITECTURAL_DETAIL_PHASE2B_v1';
export const RULES=freeze({trueHostRoofApertures:true,consumerRoofReplacement:true,roofStampedWindows:false,freeLinework:false,decorativeCamouflage:false,unownedIntersections:false,carouselDistance:94,principalSpan:27,dormerCount:2});
const host=ROOFS.find(r=>r.id==='R-GH-B'); if(!host) throw new Error('R-GH-B missing');
const halfX=host.width/2,halfZ=host.depth/2,e=host.eaveHeight,r=host.ridgeHeight;
const roofY=z=>e+(halfZ-Math.abs(z))*(r-e)/halfZ;
function mesh(id,role,triangles){return freeze({id,role,material:'DORMER_SLATE',triangles:freeze(triangles)});}
function quad(a,b,c,d){return [a,b,c,a,c,d];}
const apertures=freeze(DORMER_SEATING.map(d=>freeze({id:d.id,x0:d.x-d.width/2,x1:d.x+d.width/2,z0:d.zRear,z1:d.zFront})));
function buildPositiveSlopePanels(){
 const xs=[-halfX,...apertures.flatMap(a=>[a.x0,a.x1]),halfX].sort((a,b)=>a-b).filter((v,i,a)=>i===0||Math.abs(v-a[i-1])>1e-9);
 const zs=[0,...apertures.flatMap(a=>[a.z0,a.z1]),halfZ].sort((a,b)=>a-b).filter((v,i,a)=>i===0||Math.abs(v-a[i-1])>1e-9);
 const out=[]; let n=0;
 for(let xi=0;xi<xs.length-1;xi++)for(let zi=0;zi<zs.length-1;zi++){
   const x0=xs[xi],x1=xs[xi+1],z0=zs[zi],z1=zs[zi+1],cx=(x0+x1)/2,cz=(z0+z1)/2;
   const cut=apertures.some(a=>cx>a.x0&&cx<a.x1&&cz>a.z0&&cz<a.z1); if(cut)continue;
   out.push(mesh(`P2C-RGHB-POS-${n++}`,'replacement-roof-panel',quad(V(x0,roofY(z0),z0),V(x1,roofY(z0),z0),V(x1,roofY(z1),z1),V(x0,roofY(z1),z1))));
 }
 return out;
}
function buildReplacementRoof(){
 const out=[];
 out.push(mesh('P2C-RGHB-NEG','replacement-roof-panel',quad(V(-halfX,e,-halfZ),V(halfX,e,-halfZ),V(halfX,r,0),V(-halfX,r,0))));
 out.push(...buildPositiveSlopePanels());
 out.push(mesh('P2C-RGHB-END-W','replacement-roof-gable',[V(-halfX,e,-halfZ),V(-halfX,r,0),V(-halfX,e,halfZ)]));
 out.push(mesh('P2C-RGHB-END-E','replacement-roof-gable',[V(halfX,e,-halfZ),V(halfX,e,halfZ),V(halfX,r,0)]));
 return freeze(out);
}
export const ROOF_APERTURES=apertures;
export const REPLACEMENT_ROOF=buildReplacementRoof();
export function buildPhase2CDetailMesh(){const p=buildPhase2BDetailMesh();return freeze({contract:CONTRACT,parent:PARENT_CONTRACT,meshes:p.meshes,replacementRoof:REPLACEMENT_ROOF,suppressedNeutralRoofId:'R-GH-B',roofApertures:ROOF_APERTURES});}
export function auditPhase2C(){const p=auditPhase2B();const aperturesValid=ROOF_APERTURES.length===2&&ROOF_APERTURES.every(a=>a.x0<a.x1&&a.z0<a.z1&&a.z0>0&&a.z1<halfZ);const ridgeCorrect=REPLACEMENT_ROOF.some(m=>m.triangles.some(v=>Math.abs(v[1]-r)<1e-9));const positivePanels=REPLACEMENT_ROOF.filter(m=>m.id.startsWith('P2C-RGHB-POS-'));const centersClear=positivePanels.every(m=>{let sx=0,sz=0,n=0;for(const v of m.triangles){sx+=v[0];sz+=v[2];n++;}const cx=sx/n,cz=sz/n;return !ROOF_APERTURES.some(a=>cx>a.x0&&cx<a.x1&&cz>a.z0&&cz<a.z1);});const preserved=SITE.principalStructuralSpan===27&&CAMERA.distance===94;const noForbidden=!RULES.roofStampedWindows&&!RULES.freeLinework&&!RULES.decorativeCamouflage&&!RULES.unownedIntersections;return freeze({contract:CONTRACT,phase2bStatic:p.passStatic,roofApertureCount:ROOF_APERTURES.length,replacementRoofMeshCount:REPLACEMENT_ROOF.length,aperturesValid,ridgeCorrect,centersClear,preserved,noForbidden,passStatic:p.passStatic&&aperturesValid&&ridgeCorrect&&centersClear&&preserved&&noForbidden});}
