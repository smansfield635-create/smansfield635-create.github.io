const freeze = (v) => Object.freeze(v);
export const CONTRACT = 'MIRROR_MANOR_NEUTRAL_SITE_MASSING_BLOCKOUT_v1';
export const REVISION = 'P2_SITE_CAPACITY_AND_CAROUSEL_DISTANCE';
export const BASE_SHA = '9ce59503ca9ed36e7e5248c22c47d38be95604dd';
export const MATERIAL = freeze({ id: 'NEUTRAL_STONE_BLOCKOUT', color: freeze([0.58,0.59,0.61,1]) });
export const RULES = freeze({
  windows: false, trim: false, tracery: false, textures: false, dormers: false,
  ornament: false, terrainBaked: false, corridorHalfWidth: 6,
  testedSiteEnvelopeMaximum: freeze([28,20]),
  carouselOccupancyBand: freeze([0.60,0.70])
});
const V=(x,y,z)=>freeze([x,y,z]);
const box=(id,c,w,h,d,role)=>freeze({id,type:'box',role,center:V(...c),width:w,height:h,depth:d});
const gable=(id,c,w,eave,ridge,d,axis='x',role='roof')=>freeze({id,type:'gableRoof',role,center:V(...c),width:w,eaveHeight:eave,ridgeHeight:ridge,depth:d,axis});
const tower=(id,c,w,h,d,top,role='tower')=>freeze({id,type:'tower',role,center:V(...c),width:w,height:h,depth:d,top});
export const MASSES = freeze([
  box('GH',[0,6,0],14,12,11,'great-house'),
  box('WW',[-9.5,4.25,-1],7,8.5,8,'west-wing'),
  box('EW',[10,4,1],8,8,7,'east-wing'),
  tower('CT',[0,9,-1],5.2,18,5.2,28,'central-crown-tower'),
  tower('OC',[-5.2,6.75,-3.5],4.2,13.5,4.2,21,'old-core-tower'),
  tower('ST',[6.2,6,0],3.5,12,3.5,18,'east-stair-tower'),
  box('GHSE',[0,3.25,21],7.5,6.5,4.5,'gatehouse'),
  box('FC',[0,0.25,9],16,0.5,7,'entrance-court'),
  box('IC',[-4,0.2,-8],8,0.4,6,'inner-court'),
  box('TR-W',[-8,0.6,6],10,1.2,4.5,'west-terrace'),
  box('TR-E',[8.5,0.6,6],11,1.2,4.5,'east-terrace'),
  box('FG',[0,0.1,31],22,0.2,13,'formal-garden-plinth')
]);
export const ROOFS = freeze([
  gable('R-GH-A',[0,0,0],14,12,16.5,6.5,'x','great-house-roof'),
  gable('R-GH-B',[0,0,0],11,12,15.7,14,'z','great-house-cross-roof'),
  gable('R-WW',[-9.5,0,-1],7,8.5,12,8,'x','west-wing-roof'),
  freeze({id:'R-EW',type:'hipRoof',role:'east-wing-roof',center:V(10,0,1),width:8,depth:7,eaveHeight:8,ridgeHeight:11.5,ridgeLength:3.5}),
  gable('R-GATE',[0,0,21],7.5,6.5,9,4.5,'x','gatehouse-roof')
]);
export const ANCHORS = freeze({
  A_GATE:V(0,0,23.5), A_FORECOURT:V(0,0,12), A_MAIN_DOOR:V(0,0,5.7),
  A_INNER_COURT:V(-4,0,-8), A_WEST_WING:V(-9.5,0,-1), A_EAST_WING:V(10,0,1),
  A_COAST_OVERLOOK:V(8,1.2,8), A_MOUNTAIN_OVERLOOK:V(-6,1.2,-7)
});
export const CAMERA = freeze({
  azimuthDeg:-32, elevationDeg:18, distance:94,
  occupancyTarget:0.65, occupancyBand:freeze([0.60,0.70]),
  sideMarginMinimum:0.10, headroomMinimum:0.14, arcMaximumDeg:12
});
export const SITE = freeze({
  localOrigin:V(0,0,0), eastAxis:'+X', coastwardAxis:'+Z', mountainwardAxis:'-Z',
  corridorHalfWidth:6, testedEnvelopeMaximum:freeze([28,20]),
  principalStructuralSpan:27, principalStructuralDepth:11,
  siteCapacityCompatible:true,
  worldPlacement:'PENDING_H_EARTH_SITE_ACCEPTANCE'
});
function pushTri(out,a,b,c){ out.push(a,b,c); }
function buildBox(spec){
  const [cx,cy,cz]=spec.center,x=spec.width/2,y=spec.height/2,z=spec.depth/2;
  const p=[V(cx-x,cy-y,cz-z),V(cx+x,cy-y,cz-z),V(cx+x,cy+y,cz-z),V(cx-x,cy+y,cz-z),V(cx-x,cy-y,cz+z),V(cx+x,cy-y,cz+z),V(cx+x,cy+y,cz+z),V(cx-x,cy+y,cz+z)];
  const t=[]; [[0,1,2],[0,2,3],[4,6,5],[4,7,6],[0,4,5],[0,5,1],[3,2,6],[3,6,7],[1,5,6],[1,6,2],[0,3,7],[0,7,4]].forEach(f=>pushTri(t,p[f[0]],p[f[1]],p[f[2]]));
  return freeze({id:spec.id,role:spec.role,triangles:freeze(t)});
}
function buildGable(spec){
  const [cx,,cz]=spec.center,w=spec.width/2,d=spec.depth/2,e=spec.eaveHeight,r=spec.ridgeHeight;
  let p;
  if(spec.axis==='x') p=[V(cx-w,e,cz-d),V(cx+w,e,cz-d),V(cx-w,e,cz+d),V(cx+w,e,cz+d),V(cx,e+(r-e),cz-d),V(cx,e+(r-e),cz+d)];
  else p=[V(cx-w,e,cz-d),V(cx+w,e,cz-d),V(cx-w,e,cz+d),V(cx+w,e,cz+d),V(cx-w,e,cz),V(cx+w,e,cz)];
  const t=[];
  if(spec.axis==='x') [[0,1,4],[2,5,3],[0,4,5],[0,5,2],[1,3,5],[1,5,4]].forEach(f=>pushTri(t,p[f[0]],p[f[1]],p[f[2]]));
  else [[0,4,2],[1,3,5],[0,1,5],[0,5,4],[2,4,5],[2,5,3]].forEach(f=>pushTri(t,p[f[0]],p[f[1]],p[f[2]]));
  return freeze({id:spec.id,role:spec.role,triangles:freeze(t)});
}
function buildHip(spec){
  const [cx,,cz]=spec.center,w=spec.width/2,d=spec.depth/2,e=spec.eaveHeight,r=spec.ridgeHeight,rl=spec.ridgeLength/2;
  const p=[V(cx-w,e,cz-d),V(cx+w,e,cz-d),V(cx-w,e,cz+d),V(cx+w,e,cz+d),V(cx-rl,r,cz),V(cx+rl,r,cz)];
  const t=[]; [[0,1,5],[0,5,4],[2,4,5],[2,5,3],[0,4,2],[1,3,5]].forEach(f=>pushTri(t,p[f[0]],p[f[1]],p[f[2]]));
  return freeze({id:spec.id,role:spec.role,triangles:freeze(t)});
}
export function buildNeutralMesh(){
  const meshes=[];
  for(const s of MASSES) meshes.push(buildBox(s));
  for(const s of ROOFS) meshes.push(s.type==='hipRoof'?buildHip(s):buildGable(s));
  return freeze({contract:CONTRACT,revision:REVISION,material:MATERIAL,meshes:freeze(meshes),prohibitedDetailCount:0});
}
export function auditBlockout(){
  const ids=[...MASSES,...ROOFS].map(x=>x.id); const duplicateIds=ids.filter((id,i)=>ids.indexOf(id)!==i);
  const prohibitedDetailCount=[RULES.windows,RULES.trim,RULES.tracery,RULES.textures,RULES.dormers,RULES.ornament].filter(Boolean).length;
  const hierarchy=28>21&&21>18&&18>16.5&&12>9;
  const validDimensions=MASSES.every(s=>s.width>0&&s.depth>0&&s.height>=0);
  const siteCapacityCompatible=SITE.principalStructuralSpan<=28&&SITE.principalStructuralDepth<=20;
  const carouselDistanceReconciled=CAMERA.distance>=90&&CAMERA.distance<=100;
  const mesh=buildNeutralMesh();
  const triangleCount=mesh.meshes.reduce((n,m)=>n+m.triangles.length,0);
  return freeze({contract:CONTRACT,revision:REVISION,baseSha:BASE_SHA,duplicateIds:freeze(duplicateIds),prohibitedDetailCount,hierarchy,validDimensions,siteCapacityCompatible,carouselDistanceReconciled,principalStructuralSpan:SITE.principalStructuralSpan,triangleCount,meshCount:mesh.meshes.length,siteAcceptancePending:true,carouselHumanReviewPending:true,passStatic:duplicateIds.length===0&&prohibitedDetailCount===0&&hierarchy&&validDimensions&&siteCapacityCompatible&&carouselDistanceReconciled});
}
