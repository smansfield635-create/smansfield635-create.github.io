import { MASSES, CAMERA, SITE } from './manor.estate.neutral-blockout.mjs';
import { PORTALS } from './manor.estate.gothic-detail-phase1.mjs';
import { buildPhase3DetailMesh, auditPhase3, SURROUND_BAYS, PHASE3_MATERIALS } from './manor.estate.gothic-detail-phase3.mjs';

const freeze=v=>Object.freeze(v);
const V=(x,y,z)=>freeze([x,y,z]);

export const CONTRACT='MIRROR_MANOR_GOTHIC_ARCHITECTURAL_DETAIL_PHASE4_LIVED_IN_v1';
export const PARENT_CONTRACT='MIRROR_MANOR_GOTHIC_ARCHITECTURAL_DETAIL_PHASE3_v1';
export const RULES=freeze({
  principalSpan:27,
  canonicalCameraDistance:94,
  preserveSilhouette:true,
  preserveRoofMasses:true,
  preserveDormerCount:true,
  preserveTowerCrowns:true,
  selectedInteriorLightsOnly:true,
  noExteriorGlowWash:true,
  noNewBuildings:true,
  noSculpture:true,
  noGargoyles:true
});

export const PHASE4_MATERIALS=freeze({
  ...PHASE3_MATERIALS,
  WINDOW_REVEAL:freeze({id:'WINDOW_REVEAL',rgb:freeze([0.075,0.085,0.095])}),
  INTERIOR_AMBER:freeze({id:'INTERIOR_AMBER',rgb:freeze([0.78,0.42,0.13])}),
  PORTAL_REVEAL:freeze({id:'PORTAL_REVEAL',rgb:freeze([0.055,0.06,0.07])})
});

const LIT_BAY_IDS=freeze([
  'GH-S-B1','GH-S-B4','GH-S-U1','GH-S-U3','GH-S-U5','WW-S-2','EW-S-3'
]);

function host(id){return MASSES.find(m=>m.id===id);}
function boxMesh(id,c,w,h,d,material,role){
  const[cx,cy,cz]=c,x=w/2,y=h/2,z=d/2;
  const p=[V(cx-x,cy-y,cz-z),V(cx+x,cy-y,cz-z),V(cx+x,cy+y,cz-z),V(cx-x,cy+y,cz-z),V(cx-x,cy-y,cz+z),V(cx+x,cy-y,cz+z),V(cx+x,cy+y,cz+z),V(cx-x,cy+y,cz+z)];
  const idx=[[0,1,2],[0,2,3],[4,6,5],[4,7,6],[0,4,5],[0,5,1],[3,2,6],[3,6,7],[1,5,6],[1,6,2],[0,3,7],[0,7,4]];
  return freeze({id,role,material,triangles:freeze(idx.flatMap(f=>[p[f[0]],p[f[1]],p[f[2]]]))});
}

function windowDepthMeshes(){
  const out=[];
  for(const b of SURROUND_BAYS){
    const h=host(b.host),dir=b.face==='+Z'?1:-1;
    const facadeZ=h.center[2]+dir*h.depth/2;
    const x=h.center[0]+b.centerX;
    const revealZ=facadeZ-dir*.16;
    const plateZ=facadeZ-dir*.22;
    const rw=Math.max(.34,b.width-.18),rh=Math.max(.58,b.height-.18);
    out.push(boxMesh(`P4-${b.id}-REVEAL`,V(x,b.centerY,revealZ),rw,rh,.08,'WINDOW_REVEAL','recessed-window-reveal'));
    if(LIT_BAY_IDS.includes(b.id)){
      out.push(boxMesh(`P4-${b.id}-LIGHT`,V(x,b.centerY,plateZ),Math.max(.26,rw-.16),Math.max(.46,rh-.16),.035,'INTERIOR_AMBER','interior-window-light'));
    }
  }
  return freeze(out);
}

function portalDepthMeshes(){
  const out=[];
  for(const p of PORTALS){
    const h=host(p.host),dir=p.face==='+Z'?1:-1;
    const facadeZ=h.center[2]+dir*h.depth/2;
    const x=h.center[0]+p.centerX;
    const z=facadeZ-dir*.19;
    out.push(boxMesh(`P4-${p.id}-REVEAL`,V(x,p.springHeight*.48,z),Math.max(.6,p.width-.18),Math.max(1.1,p.springHeight*.92),.10,'PORTAL_REVEAL','recessed-portal-reveal'));
  }
  return freeze(out);
}

export function buildPhase4DetailMesh(){
  const p=buildPhase3DetailMesh();
  const livedIn=freeze([...windowDepthMeshes(),...portalDepthMeshes()]);
  return freeze({
    contract:CONTRACT,
    parent:PARENT_CONTRACT,
    meshes:freeze([...p.meshes,...livedIn]),
    replacementRoof:p.replacementRoof,
    enrichment:p.enrichment,
    livedIn,
    suppressedNeutralRoofId:p.suppressedNeutralRoofId
  });
}

export function auditPhase4(){
  const p=auditPhase3(),m=buildPhase4DetailMesh();
  const reveals=m.livedIn.filter(x=>x.role==='recessed-window-reveal');
  const lights=m.livedIn.filter(x=>x.role==='interior-window-light');
  const portals=m.livedIn.filter(x=>x.role==='recessed-portal-reveal');
  const bounded=reveals.length===SURROUND_BAYS.length&&lights.length===LIT_BAY_IDS.length&&portals.length===PORTALS.length;
  const selective=lights.length>0&&lights.length<SURROUND_BAYS.length;
  const preserved=SITE.principalStructuralSpan===27&&CAMERA.distance===94;
  return freeze({
    contract:CONTRACT,
    phase3Static:p.passStatic,
    windowRevealCount:reveals.length,
    interiorLightCount:lights.length,
    portalRevealCount:portals.length,
    bounded,
    selective,
    preserved,
    passStatic:p.passStatic&&bounded&&selective&&preserved
  });
}
