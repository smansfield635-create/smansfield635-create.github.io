import { MASSES } from './manor.estate.neutral-blockout.mjs';
import { buildPhase3DetailMesh, auditPhase3, SURROUND_BAYS } from './manor.estate.gothic-detail-phase3.mjs';

const freeze=v=>Object.freeze(v);
const V=(x,y,z)=>freeze([x,y,z]);

export const CONTRACT='MIRROR_MANOR_PHASE3_STAINED_GLASS_WINDOW_REFINEMENT_v1';
export const PARENT_CONTRACT='MIRROR_MANOR_GOTHIC_ARCHITECTURAL_DETAIL_PHASE3_v1';
export const RULES=freeze({
  preservePhase3Geometry:true,
  preserveSilhouette:true,
  preserveRoofMasses:true,
  preserveFacadeMaterials:true,
  windowSubsystemOnly:true,
  everyOwnedWindowReceivesGlass:true,
  selectiveInteriorLight:true,
  noPortalMutation:true,
  noExteriorGlowWash:true
});

export const WINDOW_MATERIALS=freeze({
  STAINED_GLASS_DIM:freeze({id:'STAINED_GLASS_DIM',rgb:freeze([0.12,0.16,0.20])}),
  STAINED_GLASS_LIT:freeze({id:'STAINED_GLASS_LIT',rgb:freeze([0.48,0.28,0.12])})
});

// Three restrained feature lights: central upper hall plus one window in each wing.
const LIT_BAY_IDS=freeze(['GH-S-U3','WW-S-2','EW-S-3']);

function host(id){return MASSES.find(m=>m.id===id);}
function boxMesh(id,c,w,h,d,material,role){
  const[cx,cy,cz]=c,x=w/2,y=h/2,z=d/2;
  const p=[V(cx-x,cy-y,cz-z),V(cx+x,cy-y,cz-z),V(cx+x,cy+y,cz-z),V(cx-x,cy+y,cz-z),V(cx-x,cy-y,cz+z),V(cx+x,cy-y,cz+z),V(cx+x,cy+y,cz+z),V(cx-x,cy+y,cz+z)];
  const idx=[[0,1,2],[0,2,3],[4,6,5],[4,7,6],[0,4,5],[0,5,1],[3,2,6],[3,6,7],[1,5,6],[1,6,2],[0,3,7],[0,7,4]];
  return freeze({id,role,material,triangles:freeze(idx.flatMap(f=>[p[f[0]],p[f[1]],p[f[2]]]))});
}

function windowGlassMeshes(){
  const out=[];
  for(const b of SURROUND_BAYS){
    const h=host(b.host),dir=b.face==='+Z'?1:-1;
    const facadeZ=h.center[2]+dir*h.depth/2;
    const x=h.center[0]+b.centerX;
    const glassZ=facadeZ-dir*.12;
    const w=Math.max(.28,b.width-.22),hh=Math.max(.48,b.height-.22);
    const lit=LIT_BAY_IDS.includes(b.id);
    out.push(boxMesh(`SG-${b.id}`,V(x,b.centerY,glassZ),w,hh,.025,lit?'STAINED_GLASS_LIT':'STAINED_GLASS_DIM',lit?'stained-glass-lit':'stained-glass-dim'));
  }
  return freeze(out);
}

export function buildStainedGlassWindowMesh(){
  const p=buildPhase3DetailMesh();
  const windows=windowGlassMeshes();
  return freeze({
    contract:CONTRACT,
    parent:PARENT_CONTRACT,
    meshes:freeze([...p.meshes,...windows]),
    replacementRoof:p.replacementRoof,
    enrichment:p.enrichment,
    windows,
    suppressedNeutralRoofId:p.suppressedNeutralRoofId
  });
}

export function auditStainedGlassWindowRefinement(){
  const p=auditPhase3(),m=buildStainedGlassWindowMesh();
  const allOwned=m.windows.length===SURROUND_BAYS.length;
  const lit=m.windows.filter(x=>x.role==='stained-glass-lit').length;
  const selective=lit===LIT_BAY_IDS.length&&lit>0&&lit<SURROUND_BAYS.length;
  const onlyWindowRoles=m.windows.every(x=>x.role==='stained-glass-lit'||x.role==='stained-glass-dim');
  return freeze({contract:CONTRACT,phase3Static:p.passStatic,windowCount:m.windows.length,litWindowCount:lit,allOwned,selective,onlyWindowRoles,passStatic:p.passStatic&&allOwned&&selective&&onlyWindowRoles});
}
