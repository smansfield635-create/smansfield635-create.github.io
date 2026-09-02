import { MASSES, ROOFS, TOWER_CROWNS, CAMERA, SITE } from './manor.estate.neutral-blockout.mjs';

const freeze=(v)=>Object.freeze(v);
const V=(x,y,z)=>freeze([x,y,z]);
export const CONTRACT='MIRROR_MANOR_GOTHIC_ARCHITECTURAL_DETAIL_PHASE1_v1';
export const PARENT_REVISION='P3_EXPLICIT_TOWER_CROWN_GEOMETRY';
export const RULES=freeze({
  dormers:false,tracery:false,sculpture:false,gargoyles:false,weathering:false,freeLinework:false,
  roofStampedWindows:false,decorativeCamouflage:false,carouselDistance:94,principalSpan:27
});
export const MATERIAL_ZONES=freeze({
  OLD_CORE_STONE:freeze({id:'OLD_CORE_STONE',rgb:freeze([0.34,0.35,0.36])}),
  GRAND_STONE:freeze({id:'GRAND_STONE',rgb:freeze([0.47,0.48,0.49])}),
  LATER_STONE:freeze({id:'LATER_STONE',rgb:freeze([0.42,0.43,0.44])}),
  RECESS_SHADOW:freeze({id:'RECESS_SHADOW',rgb:freeze([0.09,0.10,0.11])}),
  ROOF_SLATE:freeze({id:'ROOF_SLATE',rgb:freeze([0.16,0.17,0.19])}),
  PORTAL_STONE:freeze({id:'PORTAL_STONE',rgb:freeze([0.38,0.39,0.40])})
});

const bay=(id,host,face,cx,cy,width,height,recess,material='RECESS_SHADOW')=>freeze({id,type:'wallRecess',host,face,centerX:cx,centerY:cy,width,height,recess,material});
const buttress=(id,host,face,cx,width,depth,height,material='GRAND_STONE')=>freeze({id,type:'buttress',host,face,centerX:cx,width,depth,height,material});
const portal=(id,host,face,cx,width,height,recess,material='PORTAL_STONE')=>freeze({id,type:'pointedPortal',host,face,centerX:cx,width,height,recess,material});

export const WALL_BAYS=freeze([
  // Great House ceremonial south/+Z face: five legal bays, center reserved for portal.
  bay('GH-S-B1','GH','+Z',-4.8,7.0,1.55,3.3,0.28),
  bay('GH-S-B2','GH','+Z',-2.4,7.0,1.55,3.3,0.28),
  bay('GH-S-B4','GH','+Z', 2.4,7.0,1.55,3.3,0.28),
  bay('GH-S-B5','GH','+Z', 4.8,7.0,1.55,3.3,0.28),
  bay('GH-S-U1','GH','+Z',-4.8,10.1,1.35,2.3,0.24),
  bay('GH-S-U2','GH','+Z',-2.4,10.1,1.35,2.3,0.24),
  bay('GH-S-U3','GH','+Z', 0.0,10.1,1.35,2.3,0.24),
  bay('GH-S-U4','GH','+Z', 2.4,10.1,1.35,2.3,0.24),
  bay('GH-S-U5','GH','+Z', 4.8,10.1,1.35,2.3,0.24),
  // Rear/mountainward face.
  bay('GH-N-B1','GH','-Z',-4.8,7.0,1.55,3.3,0.28),
  bay('GH-N-B2','GH','-Z',-2.4,7.0,1.55,3.3,0.28),
  bay('GH-N-B3','GH','-Z', 0.0,7.0,1.55,3.3,0.28),
  bay('GH-N-B4','GH','-Z', 2.4,7.0,1.55,3.3,0.28),
  bay('GH-N-B5','GH','-Z', 4.8,7.0,1.55,3.3,0.28),
  // West wing: older, narrower rhythm.
  bay('WW-S-1','WW','+Z',-2.1,5.3,1.25,2.7,0.24),
  bay('WW-S-2','WW','+Z', 0.0,5.3,1.25,2.7,0.24),
  bay('WW-S-3','WW','+Z', 2.1,5.3,1.25,2.7,0.24),
  // East wing: later paired rhythm.
  bay('EW-S-1','EW','+Z',-2.7,5.1,1.35,2.8,0.24),
  bay('EW-S-2','EW','+Z',-0.9,5.1,1.35,2.8,0.24),
  bay('EW-S-3','EW','+Z', 0.9,5.1,1.35,2.8,0.24),
  bay('EW-S-4','EW','+Z', 2.7,5.1,1.35,2.8,0.24),
  // Gatehouse occupied upper level.
  bay('GATE-U1','GHSE','+Z',-2.1,4.7,1.05,1.8,0.20),
  bay('GATE-U2','GHSE','+Z', 2.1,4.7,1.05,1.8,0.20)
]);

export const PORTALS=freeze([
  portal('GH-MAIN-PORTAL','GH','+Z',0,2.15,4.3,0.42),
  portal('GATE-MAIN-PORTAL','GHSE','+Z',0,3.6,4.8,0.36)
]);

export const BUTTRESSES=freeze([
  buttress('GH-BUTT-SW','GH','+Z',-6.65,0.72,0.82,9.8),
  buttress('GH-BUTT-S1','GH','+Z',-3.6,0.55,0.65,8.8),
  buttress('GH-BUTT-S2','GH','+Z', 3.6,0.55,0.65,8.8),
  buttress('GH-BUTT-SE','GH','+Z', 6.65,0.72,0.82,9.8),
  buttress('WW-BUTT-1','WW','+Z',-3.25,0.50,0.58,7.0,'OLD_CORE_STONE'),
  buttress('WW-BUTT-2','WW','+Z', 3.25,0.50,0.58,7.0,'OLD_CORE_STONE'),
  buttress('EW-BUTT-1','EW','+Z',-3.70,0.46,0.54,6.8,'LATER_STONE'),
  buttress('EW-BUTT-2','EW','+Z', 3.70,0.46,0.54,6.8,'LATER_STONE')
]);

export const ROOF_EDGE_ARCHITECTURE=freeze([
  freeze({id:'GH-EAVE-S',type:'eaveBand',host:'R-GH-A',face:'+Z',height:12,width:14,depth:0.22,material:'ROOF_SLATE'}),
  freeze({id:'GH-EAVE-N',type:'eaveBand',host:'R-GH-A',face:'-Z',height:12,width:14,depth:0.22,material:'ROOF_SLATE'}),
  freeze({id:'WW-EAVE-S',type:'eaveBand',host:'R-WW',face:'+Z',height:8.5,width:7,depth:0.20,material:'ROOF_SLATE'}),
  freeze({id:'EW-EAVE-S',type:'eaveBand',host:'R-EW',face:'+Z',height:8,width:8,depth:0.20,material:'ROOF_SLATE'}),
  freeze({id:'GATE-EAVE-S',type:'eaveBand',host:'R-GATE',face:'+Z',height:6.5,width:7.5,depth:0.18,material:'ROOF_SLATE'})
]);

function host(id){return MASSES.find((m)=>m.id===id);}
function boxMesh(id,c,w,h,d,material,role){
  const [cx,cy,cz]=c,x=w/2,y=h/2,z=d/2;
  const p=[V(cx-x,cy-y,cz-z),V(cx+x,cy-y,cz-z),V(cx+x,cy+y,cz-z),V(cx-x,cy+y,cz-z),V(cx-x,cy-y,cz+z),V(cx+x,cy-y,cz+z),V(cx+x,cy+y,cz+z),V(cx-x,cy+y,cz+z)];
  const idx=[[0,1,2],[0,2,3],[4,6,5],[4,7,6],[0,4,5],[0,5,1],[3,2,6],[3,6,7],[1,5,6],[1,6,2],[0,3,7],[0,7,4]];
  return freeze({id,role,material,triangles:freeze(idx.flatMap(f=>[p[f[0]],p[f[1]],p[f[2]]]))});
}
function recessMesh(s){
  const h=host(s.host); if(!h) throw new Error(`Unknown host ${s.host}`);
  const zFace=s.face==='+Z'?h.center[2]+h.depth/2:h.center[2]-h.depth/2;
  const z=zFace+(s.face==='+Z'?-s.recess:s.recess);
  const worldX=h.center[0]+s.centerX;
  return boxMesh(s.id,V(worldX,s.centerY,z),s.width,s.height,0.08,s.material,'wall-recess-cavity');
}
function buttressMesh(s){
  const h=host(s.host); if(!h) throw new Error(`Unknown host ${s.host}`);
  const zFace=s.face==='+Z'?h.center[2]+h.depth/2:h.center[2]-h.depth/2;
  const z=zFace+(s.face==='+Z'?s.depth/2:-s.depth/2);
  return boxMesh(s.id,V(h.center[0]+s.centerX,s.height/2,z),s.width,s.height,s.depth,s.material,'structural-buttress');
}
function portalMeshes(s){
  const h=host(s.host); if(!h) throw new Error(`Unknown host ${s.host}`);
  const zFace=s.face==='+Z'?h.center[2]+h.depth/2:h.center[2]-h.depth/2;
  const dir=s.face==='+Z'?1:-1; const wx=h.center[0]+s.centerX;
  const cavity=boxMesh(`${s.id}-CAVITY`,V(wx,s.height/2,zFace-dir*s.recess),s.width,s.height,0.10,'RECESS_SHADOW','portal-recess');
  const jambW=0.30,headH=0.34;
  const left=boxMesh(`${s.id}-JAMB-L`,V(wx-s.width/2-jambW/2,s.height/2,zFace+dir*0.10),jambW,s.height,0.20,s.material,'portal-jamb');
  const right=boxMesh(`${s.id}-JAMB-R`,V(wx+s.width/2+jambW/2,s.height/2,zFace+dir*0.10),jambW,s.height,0.20,s.material,'portal-jamb');
  const head=boxMesh(`${s.id}-HEAD`,V(wx,s.height+headH/2,zFace+dir*0.10),s.width+jambW*2,headH,0.20,s.material,'portal-head');
  return freeze([cavity,left,right,head]);
}
function eaveMesh(s){
  const r=ROOFS.find((x)=>x.id===s.host); if(!r) throw new Error(`Unknown roof ${s.host}`);
  const zFace=r.center[2]+(s.face==='+Z'?r.depth/2:-r.depth/2); const dir=s.face==='+Z'?1:-1;
  return boxMesh(s.id,V(r.center[0],s.height+0.06,zFace+dir*s.depth/2),s.width,0.12,s.depth,s.material,'roof-edge-architecture');
}

export function buildPhase1DetailMesh(){
  const meshes=[];
  WALL_BAYS.forEach((s)=>meshes.push(recessMesh(s)));
  BUTTRESSES.forEach((s)=>meshes.push(buttressMesh(s)));
  PORTALS.forEach((s)=>meshes.push(...portalMeshes(s)));
  ROOF_EDGE_ARCHITECTURE.forEach((s)=>meshes.push(eaveMesh(s)));
  return freeze({contract:CONTRACT,parentRevision:PARENT_REVISION,meshes:freeze(meshes)});
}

function openingContained(s){
  const h=host(s.host); if(!h) return false;
  const localHalf=h.width/2;
  return Math.abs(s.centerX)+s.width/2<=localHalf-0.30 && s.centerY-s.height/2>=0.25 && s.centerY+s.height/2<=h.center[1]+h.height/2-0.35;
}
function buttressOwned(s){
  const h=host(s.host); if(!h) return false;
  return Math.abs(s.centerX)+s.width/2<=h.width/2+0.01 && s.height<=h.height+0.01;
}
export function auditPhase1(){
  const ids=[...WALL_BAYS,...PORTALS,...BUTTRESSES,...ROOF_EDGE_ARCHITECTURE].map(x=>x.id);
  const duplicateIds=ids.filter((id,i)=>ids.indexOf(id)!==i);
  const openingContainment=WALL_BAYS.every(openingContained);
  const portalContainment=PORTALS.every((s)=>{const h=host(s.host);return !!h&&Math.abs(s.centerX)+s.width/2<=h.width/2-0.30&&s.height<=h.height-0.45;});
  const buttressOwnership=BUTTRESSES.every(buttressOwned);
  const roofOwnership=ROOF_EDGE_ARCHITECTURE.every((s)=>ROOFS.some((r)=>r.id===s.host));
  const noForbiddenDetail=!RULES.dormers&&!RULES.tracery&&!RULES.sculpture&&!RULES.gargoyles&&!RULES.weathering&&!RULES.freeLinework&&!RULES.roofStampedWindows&&!RULES.decorativeCamouflage;
  const p3Preserved=SITE.principalStructuralSpan===27&&CAMERA.distance===94&&TOWER_CROWNS.length===3;
  const mesh=buildPhase1DetailMesh();
  return freeze({contract:CONTRACT,duplicateIds:freeze(duplicateIds),openingContainment,portalContainment,buttressOwnership,roofOwnership,noForbiddenDetail,p3Preserved,wallBayCount:WALL_BAYS.length,portalCount:PORTALS.length,buttressCount:BUTTRESSES.length,roofEdgeCount:ROOF_EDGE_ARCHITECTURE.length,detailMeshCount:mesh.meshes.length,passStatic:duplicateIds.length===0&&openingContainment&&portalContainment&&buttressOwnership&&roofOwnership&&noForbiddenDetail&&p3Preserved});
}
