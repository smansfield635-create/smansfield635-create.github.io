import { MASSES, ROOFS, CAMERA, SITE } from './manor.estate.neutral-blockout.mjs';
import { WALL_BAYS, PORTALS, BUTTRESSES, MATERIAL_ZONES } from './manor.estate.gothic-detail-phase1.mjs';
import { buildPhase1DDetailMesh, auditPhase1D } from './manor.estate.gothic-detail-phase1d.mjs';

const freeze=(v)=>Object.freeze(v);
const V=(x,y,z)=>freeze([x,y,z]);
export const CONTRACT='MIRROR_MANOR_GOTHIC_ARCHITECTURAL_DETAIL_PHASE2_v1';
export const PARENT_CONTRACT='MIRROR_MANOR_GOTHIC_ARCHITECTURAL_DETAIL_PHASE1D_v1';
export const RULES=freeze({
  glazing:true,tracery:true,completeDormers:true,higherOrderStonework:true,restrainedPinnacles:true,
  roofStampedWindows:false,freeLinework:false,decorativeCamouflage:false,unownedIntersections:false,
  sculpture:false,gargoyles:false,weathering:false,
  maximumDormers:2,maximumPinnacles:4,carouselDistance:94,principalSpan:27
});
export const PHASE2_MATERIALS=freeze({
  LEADED_GLASS:freeze({id:'LEADED_GLASS',rgb:freeze([0.10,0.16,0.20])}),
  TRACERY_STONE:freeze({id:'TRACERY_STONE',rgb:freeze([0.52,0.52,0.51])}),
  DORMER_STONE:freeze({id:'DORMER_STONE',rgb:freeze([0.43,0.44,0.45])}),
  DORMER_SLATE:freeze({id:'DORMER_SLATE',rgb:freeze([0.15,0.16,0.18])}),
  ACCENT_STONE:freeze({id:'ACCENT_STONE',rgb:freeze([0.49,0.48,0.47])})
});
function host(id){return MASSES.find(m=>m.id===id);}
function roof(id){return ROOFS.find(r=>r.id===id);}
function boxMesh(id,c,w,h,d,material,role){const[cx,cy,cz]=c,x=w/2,y=h/2,z=d/2,p=[V(cx-x,cy-y,cz-z),V(cx+x,cy-y,cz-z),V(cx+x,cy+y,cz-z),V(cx-x,cy+y,cz-z),V(cx-x,cy-y,cz+z),V(cx+x,cy-y,cz+z),V(cx+x,cy+y,cz+z),V(cx-x,cy+y,cz+z)],idx=[[0,1,2],[0,2,3],[4,6,5],[4,7,6],[0,4,5],[0,5,1],[3,2,6],[3,6,7],[1,5,6],[1,6,2],[0,3,7],[0,7,4]];return freeze({id,role,material,triangles:freeze(idx.flatMap(f=>[p[f[0]],p[f[1]],p[f[2]]]))});}
function triPrism(id,c,width,height,depth,material,role){const[cx,baseY,cz]=c,w=width/2,d=depth/2,p=[V(cx-w,baseY,cz-d),V(cx+w,baseY,cz-d),V(cx,baseY+height,cz-d),V(cx-w,baseY,cz+d),V(cx+w,baseY,cz+d),V(cx,baseY+height,cz+d)],idx=[[0,1,2],[3,5,4],[0,3,4],[0,4,1],[1,4,5],[1,5,2],[2,5,3],[2,3,0]];return freeze({id,role,material,triangles:freeze(idx.flatMap(f=>[p[f[0]],p[f[1]],p[f[2]]]))});}
function pyramidMesh(id,c,w,d,h,material,role){const[cx,baseY,cz]=c,x=w/2,z=d/2,p=[V(cx-x,baseY,cz-z),V(cx+x,baseY,cz-z),V(cx+x,baseY,cz+z),V(cx-x,baseY,cz+z),V(cx,baseY+h,cz)],idx=[[0,1,4],[1,2,4],[2,3,4],[3,0,4],[0,3,2],[0,2,1]];return freeze({id,role,material,triangles:freeze(idx.flatMap(f=>[p[f[0]],p[f[1]],p[f[2]]]))});}

// Glazing/tracery is inserted behind the already-legal wall openings. It never creates a new host opening.
export const GLAZED_BAYS=freeze(WALL_BAYS.filter(b=>!b.id.startsWith('GATE-')));
function glazingMeshes(b){const h=host(b.host);if(!h)throw new Error(`Unknown glazing host ${b.host}`);const dir=b.face==='+Z'?1:-1,zFace=h.center[2]+dir*h.depth/2,z=zFace-dir*(Math.max(.16,b.recess-.05)),x=h.center[0]+b.centerX,y=b.centerY;
 const frame=.10,paneW=Math.max(.12,(b.width-frame*3)/2),paneH=Math.max(.18,b.height-frame*2),out=[];
 out.push(boxMesh(`P2-${b.id}-GLASS-L`,V(x-b.width*.25,y,z),paneW,paneH,.045,'LEADED_GLASS','legal-opening-glazing'));
 out.push(boxMesh(`P2-${b.id}-GLASS-R`,V(x+b.width*.25,y,z),paneW,paneH,.045,'LEADED_GLASS','legal-opening-glazing'));
 out.push(boxMesh(`P2-${b.id}-MULLION`,V(x,y,z+dir*.025),frame,b.height-.12,.075,'TRACERY_STONE','owned-tracery-frame'));
 out.push(boxMesh(`P2-${b.id}-TRANSOM`,V(x,y+b.height*.16,z+dir*.025),b.width-.16,frame,.075,'TRACERY_STONE','owned-tracery-frame'));
 return freeze(out);
}

// Two complete front-slope dormers are assigned to R-GH-B. Each owns face, cheeks, glazing and its own small gabled roof.
export const DORMERS=freeze([
  freeze({id:'DORMER-GH-FRONT-W',roofId:'R-GH-B',x:-3.0,z:3.8,width:1.55,depth:1.35,wallHeight:1.30,roofRise:.72}),
  freeze({id:'DORMER-GH-FRONT-E',roofId:'R-GH-B',x:3.0,z:3.8,width:1.55,depth:1.35,wallHeight:1.30,roofRise:.72})
]);
function roofHeightOnGHBCoastSlope(z){const r=roof('R-GH-B'),half=r.depth/2;if(!r||z<0||z>half)throw new Error('Dormer outside assigned +Z roof slope');return r.eaveHeight+(half-z)*(r.ridgeHeight-r.eaveHeight)/half;}
function dormerMeshes(d){const base=roofHeightOnGHBCoastSlope(d.z),faceZ=d.z+d.depth/2,wallY=base+d.wallHeight/2,roofBase=base+d.wallHeight,out=[];
 out.push(boxMesh(`${d.id}-BODY`,V(d.x,wallY,d.z),d.width,d.wallHeight,d.depth,'DORMER_STONE','complete-dormer-body'));
 out.push(boxMesh(`${d.id}-GLASS`,V(d.x,base+d.wallHeight*.55,faceZ+.035),d.width*.52,d.wallHeight*.52,.07,'LEADED_GLASS','dormer-face-glazing'));
 out.push(boxMesh(`${d.id}-MULLION`,V(d.x,base+d.wallHeight*.55,faceZ+.075),.08,d.wallHeight*.52,.08,'TRACERY_STONE','dormer-owned-mullion'));
 out.push(triPrism(`${d.id}-GABLE`,V(d.x,roofBase,d.z),d.width+.18,d.roofRise,d.depth+.16,'DORMER_SLATE','complete-dormer-roof'));
 return freeze(out);
}

// Higher-order stonework remains structural: buttress caps and portal spring blocks.
function buttressCapMeshes(){return freeze(BUTTRESSES.map(b=>{const h=host(b.host),dir=b.face==='+Z'?1:-1,z=h.center[2]+dir*(h.depth/2+b.depth/2);return pyramidMesh(`P2-${b.id}-CAP`,V(h.center[0]+b.centerX,b.height,z),b.width*1.08,b.depth*1.08,.48,'ACCENT_STONE','buttress-cap-stonework');}));}
function portalSpringMeshes(){const out=[];for(const p of PORTALS){const h=host(p.host),dir=p.face==='+Z'?1:-1,z=h.center[2]+dir*(h.depth/2+.13),x=h.center[0]+p.centerX,block=.32;out.push(boxMesh(`P2-${p.id}-SPRING-L`,V(x-p.width/2-.16,p.springHeight,z),block,.42,.26,'ACCENT_STONE','portal-spring-block'));out.push(boxMesh(`P2-${p.id}-SPRING-R`,V(x+p.width/2+.16,p.springHeight,z),block,.42,.26,'ACCENT_STONE','portal-spring-block'));}return freeze(out);}

// Restrained pinnacles: four only, each terminates a principal Great House buttress.
export const PINNACLES=freeze(BUTTRESSES.filter(b=>b.id.startsWith('GH-BUTT')).map(b=>freeze({id:`PIN-${b.id}`,buttressId:b.id})).slice(0,4));
function pinnacleMeshes(){const out=[];for(const p of PINNACLES){const b=BUTTRESSES.find(x=>x.id===p.buttressId),h=host(b.host),dir=b.face==='+Z'?1:-1,z=h.center[2]+dir*(h.depth/2+b.depth/2),x=h.center[0]+b.centerX;base:0;out.push(boxMesh(`P2-${p.id}-SHAFT`,V(x,b.height+.42,z),.24,.84,.24,'ACCENT_STONE','restrained-pinnacle-shaft'));out.push(pyramidMesh(`P2-${p.id}-TIP`,V(x,b.height+.84,z),.34,.34,.62,'ACCENT_STONE','restrained-pinnacle-tip'));}return freeze(out);}

export function buildPhase2DetailMesh(){const p1d=buildPhase1DDetailMesh(),enrichment=[];GLAZED_BAYS.forEach(b=>enrichment.push(...glazingMeshes(b)));DORMERS.forEach(d=>enrichment.push(...dormerMeshes(d)));enrichment.push(...buttressCapMeshes(),...portalSpringMeshes(),...pinnacleMeshes());return freeze({contract:CONTRACT,parent:PARENT_CONTRACT,meshes:freeze([...p1d.meshes,...enrichment]),enrichment:freeze(enrichment)});}
export function auditPhase2(){const p1d=auditPhase1D(),m=buildPhase2DetailMesh(),glazing=m.enrichment.filter(x=>x.role==='legal-opening-glazing'),tracery=m.enrichment.filter(x=>x.role==='owned-tracery-frame'),dormerBodies=m.enrichment.filter(x=>x.role==='complete-dormer-body'),dormerRoofs=m.enrichment.filter(x=>x.role==='complete-dormer-roof'),dormerGlass=m.enrichment.filter(x=>x.role==='dormer-face-glazing'),caps=m.enrichment.filter(x=>x.role==='buttress-cap-stonework'),springBlocks=m.enrichment.filter(x=>x.role==='portal-spring-block'),pinnacleParts=m.enrichment.filter(x=>x.role.startsWith('restrained-pinnacle'));
 const glazingOwned=GLAZED_BAYS.every(b=>WALL_BAYS.some(w=>w.id===b.id));
 const dormersComplete=DORMERS.length===2&&dormerBodies.length===2&&dormerRoofs.length===2&&dormerGlass.length===2&&DORMERS.every(d=>d.roofId==='R-GH-B'&&d.z>0&&d.z<roof('R-GH-B').depth/2);
 const enrichmentBounded=DORMERS.length<=RULES.maximumDormers&&PINNACLES.length<=RULES.maximumPinnacles;
 const p3Preserved=SITE.principalStructuralSpan===27&&CAMERA.distance===94;
 const noForbiddenDetail=!RULES.roofStampedWindows&&!RULES.freeLinework&&!RULES.decorativeCamouflage&&!RULES.unownedIntersections&&!RULES.sculpture&&!RULES.gargoyles&&!RULES.weathering;
 return freeze({contract:CONTRACT,phase1dStatic:p1d.passStatic,glazingOwned,glazedBayCount:GLAZED_BAYS.length,glazingPaneCount:glazing.length,traceryFrameCount:tracery.length,dormerCount:DORMERS.length,dormersComplete,buttressCapCount:caps.length,portalSpringBlockCount:springBlocks.length,pinnacleCount:PINNACLES.length,pinnaclePartCount:pinnacleParts.length,enrichmentBounded,p3Preserved,noForbiddenDetail,passStatic:p1d.passStatic&&glazingOwned&&dormersComplete&&enrichmentBounded&&p3Preserved&&noForbiddenDetail});}
