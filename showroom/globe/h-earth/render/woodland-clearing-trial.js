/** Generation 2629: bounded presentation replacement; terrain/ecology authority unchanged. */
export const H_EARTH_WOODLAND_CLEARING_BOUNDS=Object.freeze({minX:-155.40267987050615,maxX:-123.40267987050615,minZ:-226.74616902099837,maxZ:-194.74616902099837});
export const H_EARTH_WOODLAND_CLEARING_TREE_IDS=Object.freeze(['P2_TREE_A_03','P2_TREE_A_06','P2_TREE_A_08','P2_TREE_A_11']);
export const H_EARTH_WOODLAND_CLEARING_ASSETS=Object.freeze(['leaf','bark','soil'].map(kind=>Object.freeze({id:kind,kind,url:new URL(`./assets/woodland-clearing-${kind}.png`,import.meta.url).href,width:256,height:256,alphaCutoff:kind==='leaf'?.45:0})));
export const H_EARTH_WOODLAND_CLEARING_TRIANGLE_LIMIT=105000;
// One texture, two padded 126x256 leaf recipes; no added sampler or storage.
export const clearingLeafAtlasUV=(u,style='LIGHTER_COMPACT_SPRAY')=>((style==='FULLER_SINGLE_LEAF'?129:1)+126*u)/256;
const seed='H_EARTH_CLEARING_2629_20261008';
const hash=(id,c)=>{let h=2166136261;for(const a of `${seed}:${id}:${c}`)h=Math.imul(h^a.charCodeAt(0),16777619);return(h>>>0)/4294967296;};
const B=H_EARTH_WOODLAND_CLEARING_BOUNDS;
export const insideWoodlandClearing=(x,z,margin=0)=>x>=B.minX+margin&&x<=B.maxX-margin&&z>=B.minZ+margin&&z<=B.maxZ-margin;
// Gen2651 bounded vegetation transition: reuse the existing 8m woodland
// ecotone principle, without changing the approved tree or ground meshes.
const nativeBlendEdgeMeters=8;
const clearingEdgeDistance=(x,z)=>Math.min(x-B.minX,B.maxX-x,z-B.minZ,B.maxZ-z);
const clearingGrassInteriorWeight=(x,z,id)=>{
  const d=clearingEdgeDistance(x,z)+(hash(id,'clearing-edge-jitter')-.5)*1.2;
  const t=Math.max(0,Math.min(1,d/nativeBlendEdgeMeters));
  return t*t*(3-2*t);
};

const prepare=m=>{if(!m.clearingAttributes)m.clearingAttributes=[];while(m.clearingAttributes.length<m.vertices.length)m.clearingAttributes.push([0,0,0]);};
const vertex=(m,p,c,type=0,uv=[0,0])=>{prepare(m);const i=m.vertices.length;m.vertices.push({x:p[0],y:p[1],z:p[2]});m.colors.push(c);m.clearingAttributes.push([...uv,type]);return i;};
const face=(m,a,b,c)=>m.indices.push(a,b,c);
const unit=a=>{const l=Math.hypot(...a);return a.map(q=>q/l);};
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
function blade(m,root,direction,length,width,fold,color,type=3){
 const d=unit(direction),side=unit(cross(d,Math.abs(d[1])<.9?[0,1,0]:[1,0,0])),n=cross(side,d),ids=[];
 const points=[root,root.map((v,j)=>v+d[j]*length),root.map((v,j)=>v+d[j]*length*.47+side[j]*width+n[j]*fold),root.map((v,j)=>v+d[j]*length*.47-side[j]*width+n[j]*fold)];
 for(let k=0;k<4;k++)ids.push(vertex(m,points[k],color,type,[[0,.5],[1,.5],[.47,0],[.47,1]][k].map((q,j)=>type===2&&j===0?clearingLeafAtlasUV(q):q)));
 face(m,ids[0],ids[1],ids[2]);face(m,ids[0],ids[3],ids[1]);
 // Clearing grass uses the same uncullable folded broad faces as the tree
 // foliage. Understory and fallen leaves retain their shallow closed volume.
 if(type!==3){face(m,ids[0],ids[2],ids[3]);face(m,ids[1],ids[3],ids[2]);}
}
function removeContainedGrass(grass,manifest){
 const old={vertices:grass.vertices,indices:grass.indices,colors:grass.colors,attributes:grass.clearingAttributes??[]},removed=[],kept=[],next={vertices:[],indices:[],colors:[],clearingAttributes:[]};
 const ownerStart=new Int32Array(old.vertices.length);for(const entry of manifest)if(entry.kind==='GRASS')ownerStart.fill(entry.grassVertexStart,entry.grassVertexStart,entry.grassVertexStart+entry.grassVertexCount);
 const facesByStart=new Map();for(let i=0;i<old.indices.length;i+=3){const ids=old.indices.slice(i,i+3),k=ownerStart[ids[0]];if(!facesByStart.has(k))facesByStart.set(k,[]);facesByStart.get(k).push(ids);}
 for(const entry of manifest){
  if(entry.kind!=='GRASS'){kept.push(entry);continue;}
  const start=entry.grassVertexStart,end=start+entry.grassVertexCount,vertices=old.vertices.slice(start,end);
  if(vertices.every(v=>insideWoodlandClearing(v.x,v.z))&&insideWoodlandClearing(entry.x,entry.z,entry.crownRadius??0)&&hash(entry.id,'remove-native-at-edge')<clearingGrassInteriorWeight(entry.x,entry.z,entry.id)){removed.push(entry.id);continue;}
  const offset=next.vertices.length;next.vertices.push(...vertices);next.colors.push(...old.colors.slice(start,end));next.clearingAttributes.push(...vertices.map((_,j)=>old.attributes[start+j]??[0,0,0]));
  for(const ids of facesByStart.get(start)??[])next.indices.push(...ids.map(v=>v-start+offset));
  kept.push({...entry,grassVertexStart:offset,...(entry.rootPoints?{rootPoints:entry.rootPoints.map(p=>({...p,vertexIndex:p.vertexIndex-start+offset}))}:{})});
 }
 Object.assign(grass,next);manifest.splice(0,manifest.length,...kept);return removed;
}
export function appendHEarthWoodlandClearingGround({grass,stone,manifest,ground,clearFootprint,walkingDistance,groundReason}){
 const removedGrass=removeContainedGrass(grass,manifest),addedGrass=[],addedRocks=[],addedShrubs=[],addedLitter=[];
 const eligible=(x,z,r)=>insideWoodlandClearing(x,z,r)&&clearFootprint(x,z,r)&&walkingDistance(x,z)>1.5+r&&!groundReason(x,z);
 const trees=manifest.filter(p=>p.kind==='TREE');
 const root=(x,z)=>{const g=ground(x,z);return g?[x,g.y-.022,z]:null;};
 for(let iz=0;iz<34;iz++)for(let ix=0;ix<34;ix++){
  const id=`CLEARING_GRASS_${ix}_${iz}`,x=B.minX+1+ix*.90+(hash(id,'x')-.5)*.40,z=B.minZ+1+iz*.90+(hash(id,'z')-.5)*.40;
  const canopy=trees.reduce((n,t)=>Math.max(n,Math.max(0,1-Math.hypot(x-t.x,z-t.z)/t.crownRadius)),0);
  const pocket=hash(`FIELD_${Math.floor(x/4)}_${Math.floor(z/4)}`,'density');
  if(!eligible(x,z,.65)||pocket>.87+.10*canopy||hash(id,'clear-grass-edge-selection')>=clearingGrassInteriorWeight(x,z,id))continue;
  const start=grass.vertices.length,roots=[];
  for(let k=0;k<8;k++){
   const a=hash(id,`angle${k}`)*Math.PI*2,offset=.06+.12*hash(id,`offset${k}`),r=root(x+Math.cos(a)*offset,z+Math.sin(a)*offset);if(!r)throw Error('CLEARING_GRASS_ROOT_MISSING');
   const dry=hash(id,'dry')<.24;const tint=hash(id,`tint${k}`),c=dry?[125+Math.round(tint*24),113+Math.round(tint*21),57+Math.round(tint*15),255]:[61+Math.round(tint*36),84+Math.round(tint*30),35+Math.round(tint*20),255];
   roots.push({x:r[0],y:r[1],z:r[2],vertexIndex:grass.vertices.length});blade(grass,r,[Math.cos(a)*(.22+.30*hash(id,`lean${k}`)),1,Math.sin(a)*(.22+.30*hash(id,`lean${k}`))],.38+.45*hash(id,`height${k}`),.060+.040*hash(id,`width${k}`),.013,c);
  }
  manifest.push({id,kind:'GRASS',x,y:ground(x,z).y,z,grassVertexStart:start,grassVertexCount:grass.vertices.length-start,bladeCount:8,rootPoints:roots,crownRadius:.65,footprintClear:true,recipe:'CLEARING_BROAD_PATCHED_FOLDED_GRASS_2631_v1',habitatPatch:'WOODLAND_CLEARING_2629'});addedGrass.push(id);
 }
 // Small rock clusters and low broad-leaf plants leave the existing walking
 // capsule open. Their roots are sampled from the same accepted NEAR surface.
 for(let j=0;j<18;j++){
  const id=`CLEARING_ROCK_${j}`,x=B.minX+2+hash(id,'x')*28,z=B.minZ+2+hash(id,'z')*28,r=.18+.36*hash(id,'radius');if(!eligible(x,z,r+.08))continue;
  const g=ground(x,z),height=.17+.34*hash(id,'height'),start=stone.vertices.length,ring=[];
  const bottom=vertex(stone,[x,g.y-.10,z],[99,96,77,255],3),top=vertex(stone,[x+.10*r,g.y+height,z-.07*r],[142,137,114,255],3);
  for(let k=0;k<8;k++){const a=k*Math.PI/4,rr=r*(.83+.2*hash(id,`radius${k}`));ring.push(vertex(stone,[x+Math.cos(a)*rr,g.y+height*.25,z+Math.sin(a)*rr],[115+Math.round(hash(id,`tint${k}`)*20),112+Math.round(hash(id,`tint${k}`)*17),91+Math.round(hash(id,`tint${k}`)*15),255],3));}
  for(let k=0;k<8;k++){const n=(k+1)%8;face(stone,bottom,ring[k],ring[n]);face(stone,top,ring[n],ring[k]);}
  manifest.push({id,kind:'ROCK',x,y:g.y,z,stoneVertexStart:start,stoneVertexCount:stone.vertices.length-start,crownRadius:r,footprintClear:true,support:{minimumBurial:.10,downwardShift:0,minimumMeasuredBurial:.10,witnesses:[{x,z,surfaceY:g.y,meshY:g.y-.10,groundTriangle:g.triangle,burial:.10}]},recipe:'CLEARING_SMALL_IRREGULAR_ROCK'});addedRocks.push(id);
 }
 for(let j=0;j<20;j++){
  const id=`CLEARING_UNDERSTORY_${j}`,x=B.minX+2+hash(id,'x')*28,z=B.minZ+2+hash(id,'z')*28;if(!eligible(x,z,.65))continue;
  const start=grass.vertices.length,r=root(x,z),roots=[],leafOrigins=[],stem=[];
  for(let k=0;k<2;k++)for(let n=0;n<4;n++){const a=n*Math.PI/2;stem.push(vertex(grass,[r[0]+Math.cos(a)*.06,r[1]+k*.23,r[2]+Math.sin(a)*.06],[94,75,43,255],1,[n/4,k]));}
  for(let n=0;n<4;n++){const v=grass.vertices[stem[n]],g=ground(v.x,v.z);if(!g)throw Error('CLEARING_UNDERSTORY_ROOT_MISSING');v.y=g.y-.022;roots.push({x:v.x,y:v.y,z:v.z,vertexIndex:stem[n]});}
  for(let n=0;n<4;n++){const q=(n+1)%4;face(grass,stem[n],stem[n+4],stem[q]);face(grass,stem[q],stem[n+4],stem[q+4]);}face(grass,stem[0],stem[1],stem[2]);face(grass,stem[0],stem[2],stem[3]);face(grass,stem[4],stem[6],stem[5]);face(grass,stem[4],stem[7],stem[6]);
  for(let k=0;k<36;k++){
   const a=k*2.399+hash(id,'rotation')*6.28,t=hash(id,`layer${k}`),origin=[r[0]+Math.cos(a)*.05,r[1]+.035+t*.15,r[2]+Math.sin(a)*.05];
   leafOrigins.push({x:origin[0],y:origin[1],z:origin[2],vertexIndex:grass.vertices.length});blade(grass,origin,[Math.cos(a),.3+t*.55,Math.sin(a)],.24+.20*hash(id,`length${k}`),.065+.032*hash(id,`width${k}`),.018,[44+Math.round(t*22),70+Math.round(t*30),28+Math.round(t*17),255],2);
  }
  manifest.push({id,kind:'GRASS',x,y:r[1],z,grassVertexStart:start,grassVertexCount:grass.vertices.length-start,bladeCount:36,rootPoints:roots,leafOrigins,crownRadius:.65,footprintClear:true,recipe:'CLEARING_LOW_LEAFY_UNDERSTORY',habitatPatch:'WOODLAND_CLEARING_2629'});addedShrubs.push(id);
 }
 for(let j=0;j<72;j++){
  const id=`CLEARING_LITTER_${j}`,x=B.minX+1+hash(id,'x')*30,z=B.minZ+1+hash(id,'z')*30;if(!eligible(x,z,.32))continue;
  const g=ground(x,z),a=hash(id,'angle')*Math.PI*2,start=grass.vertices.length;
  blade(grass,[x,g.y+.012,z],[Math.cos(a),.04,Math.sin(a)],.13+.12*hash(id,'length'),.043,.009,[112,93,54,255],2);
  const contacts=[];
  for(let k=0;k<4;k++){
   const v=grass.vertices[start+k],support=ground(v.x,v.z);if(!support)throw Error('CLEARING_LITTER_GROUND_MISSING');
   // Two thin contact corners follow their own rendered terrain samples;
   // the raised side fold retains nonzero closed-leaf volume and normals.
   v.y=support.y+(k<2?-.002:.007);
   if(k<2)contacts.push({x:v.x,y:v.y,z:v.z,vertexIndex:start+k});
  }
  manifest.push({id,kind:'GRASS',x,y:g.y,z,grassVertexStart:start,grassVertexCount:4,bladeCount:1,rootPoints:contacts,crownRadius:.32,footprintClear:true,recipe:'CLEARING_FALLEN_LEAF',habitatPatch:'WOODLAND_CLEARING_2629'});addedLitter.push(id);
 }
 return {bounds:B,treeIds:H_EARTH_WOODLAND_CLEARING_TREE_IDS,removedGrass,addedGrass,addedRocks,addedShrubs,addedLitter,textureAssets:H_EARTH_WOODLAND_CLEARING_ASSETS.map(({id,width,height})=>({id,width,height})),canonicalTerrainModified:false,ecologicalPlanningModified:false};
}

/** Native, deterministic compact leaflet atlas selected by the preserved
 * three-mask costing. The browser-rasterized bitmap retains the existing
 * 256x256 allocation, sampler and cutoff; this factory changes no mesh recipe. */
function createCompactLeafSVG(){
 const leaves=[];
 for(const [j,x] of [42,85,128,171,214].entries())for(const [row,y] of [110,128,146].entries()){
  const angle=(row-1)*(22+(j%2)*5);
  leaves.push(`<g transform="translate(${x} ${y}) rotate(${angle})"><path d="M -50.0 0 Q -8.0 -62 50.0 0 Q -8.0 62 -50.0 0" fill="#719b48"/><path d="M -50.0 0 L 50.0 0" stroke="#41672f" stroke-width="1"/></g>`);
 }
 return `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256"><defs><clipPath id="d"><path d="M 0 128 L 120.32 0 L 256 128 L 120.32 256 Z"/></clipPath></defs><g clip-path="url(#d)">${leaves.join('')}</g></svg>`;
}

/** Deterministic two-style atlas. Rasterizer duplicates the one-pixel borders. */
export function createHEarthClearingLeafClusterAtlasSVG(){
 const compact=createCompactLeafSVG().replace('<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256">','').replace('</svg>','').replaceAll('id="d"','id="compact"').replaceAll('url(#d)','url(#compact)');
 const single='<defs><clipPath id="single"><path d="M0 128L120.32 0L256 128L120.32 256Z"/></clipPath></defs><g clip-path="url(#single)"><path fill="#52733a" d="M4 128C30 104 55 40 120 12C185 45 227 102 252 128C220 157 180 220 120 244C55 215 25 148 4 128Z"/><path fill="#668643" d="M4 128C30 104 55 40 120 12C185 45 227 102 252 128Z"/><path fill="none" stroke="#97a85a" stroke-width="1.5" d="M8 128L246 128"/></g>';
 return `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256"><g transform="translate(1 0) scale(0.4921875 1)">${compact}</g><g transform="translate(129 0) scale(0.4921875 1)">${single}</g></svg>`;
}
