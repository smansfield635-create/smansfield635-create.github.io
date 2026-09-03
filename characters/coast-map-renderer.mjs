import {
  GRATITUDE_DEVELOPMENT_FRAME,
  mapToWorld,
  resolveCoastlinePolyline,
  resolveGratitudeShoreline,
  sampleGratitudeWorld
} from './gratitude-geography.adapter.mjs';
import {buildForestPopulation} from './forest-system.mjs';

export const COAST_MAP_RENDERER_ID='MIRRORLAND_COAST_MAP_TRUE_TO_WORLD_RENDERER_v1';
const NS='http://www.w3.org/2000/svg';
const W=1000,H=700;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const el=(name,attrs={})=>{const n=document.createElementNS(NS,name);for(const [k,v] of Object.entries(attrs))n.setAttribute(k,String(v));return n;};
const p=({u,v})=>[u*W,v*H];

function terrainModel({columns=44,rows=30}={}){
  const cells=[];
  let min=Infinity,max=-Infinity;
  for(let y=0;y<rows;y++)for(let x=0;x<columns;x++){
    const u=(x+.5)/columns,v=(y+.5)/rows,world=mapToWorld({u,v});
    const terrain=sampleGratitudeWorld(world.x,world.z).source;
    const shore=resolveGratitudeShoreline(world.x).world.z;
    const land=world.z<=shore;
    if(land){min=Math.min(min,terrain.elevation);max=Math.max(max,terrain.elevation);}
    cells.push({x,y,u,v,world,elevation:terrain.elevation,land});
  }
  return {columns,rows,cells,min:Number.isFinite(min)?min:0,max:Number.isFinite(max)?max:1};
}

function terrainTone(e,min,max){
  const t=clamp((e-min)/Math.max(1e-9,max-min),0,1);
  const low=[40,77,57],mid=[75,105,67],high=[121,126,83];
  const a=t<.56?low:mid,b=t<.56?mid:high,q=t<.56?t/.56:(t-.56)/.44;
  return `rgb(${Math.round(a[0]+(b[0]-a[0])*q)},${Math.round(a[1]+(b[1]-a[1])*q)},${Math.round(a[2]+(b[2]-a[2])*q)})`;
}

export function buildCoastMapSurfaceModel({compact=false}={}){
  const coastline=resolveCoastlinePolyline({sampleCount:129});
  const terrain=terrainModel({columns:compact?34:48,rows:compact?24:34});
  const forest=buildForestPopulation({compact});
  return Object.freeze({
    schema:'MIRRORLAND_COAST_MAP_SURFACE_MODEL_v1',
    rendererId:COAST_MAP_RENDERER_ID,
    frame:GRATITUDE_DEVELOPMENT_FRAME.mapFrame,
    coastline,
    terrain,
    forestRegions:forest.regions,
    sourceForestPopulationSchema:forest.schema,
    geographyStateChanged:false,
    markerAuthorityChanged:false
  });
}

function coastlinePath(points){return points.map((point,i)=>{const [x,y]=p(point.map);return `${i?'L':'M'}${x.toFixed(2)} ${y.toFixed(2)}`;}).join(' ');}

function renderTerrain(svg,model){
  const {columns,rows,cells,min,max}=model.terrain,cw=W/columns,ch=H/rows;
  const group=el('g',{'data-map-layer':'WORLD_DERIVED_TERRAIN'});
  for(const c of cells){
    if(!c.land)continue;
    group.appendChild(el('rect',{x:c.x*cw-.5,y:c.y*ch-.5,width:cw+1,height:ch+1,fill:terrainTone(c.elevation,min,max)}));
  }
  svg.appendChild(group);
}

function renderRelief(svg,model){
  const group=el('g',{'data-map-layer':'WORLD_DERIVED_RELIEF','fill':'none','stroke':'rgba(225,232,196,.18)','stroke-width':'1'});
  const {columns,rows,cells,min,max}=model.terrain;
  const thresholds=[.22,.42,.62,.78].map(t=>min+(max-min)*t);
  for(const threshold of thresholds){
    const points=[];
    for(let y=0;y<rows;y++)for(let x=0;x<columns;x++){
      const c=cells[y*columns+x];if(!c.land||Math.abs(c.elevation-threshold)>(max-min)/Math.max(rows,columns)*1.5)continue;
      points.push(`${(c.u*W).toFixed(1)},${(c.v*H).toFixed(1)}`);
    }
    if(points.length>3)group.appendChild(el('polyline',{points:points.join(' '),'stroke-dasharray':'2 7'}));
  }
  svg.appendChild(group);
}

function renderForests(svg,model){
  const group=el('g',{'data-map-layer':'QUALIFIED_FOREST_REGIONS'});
  for(const [index,r] of model.forestRegions.entries()){
    group.appendChild(el('ellipse',{cx:r.u*W,cy:r.v*H,rx:r.rx*W,ry:r.rz*H,fill:'rgba(20,59,42,.42)',stroke:'rgba(139,180,126,.32)','stroke-width':'1.4','data-forest-region':index}));
  }
  svg.appendChild(group);
}

function renderCoast(svg,model){
  const d=coastlinePath(model.coastline.points);
  const water=el('path',{d:`${d} L ${W} ${H} L 0 ${H} Z`,fill:'rgba(31,82,95,.88)','data-map-layer':'WORLD_DERIVED_WATER'});
  const coast=el('path',{d,fill:'none',stroke:'rgba(236,219,174,.92)','stroke-width':'4','stroke-linecap':'round','stroke-linejoin':'round','data-map-layer':'CANONICAL_COASTLINE'});
  svg.append(water,coast);
}

export function mountCoastMapRenderer(root=document.querySelector('#map-grid')){
  if(!root||root.querySelector('[data-coast-map-surface]'))return null;
  const compact=matchMedia('(max-width: 720px)').matches;
  const model=buildCoastMapSurfaceModel({compact});
  const svg=el('svg',{viewBox:`0 0 ${W} ${H}`,preserveAspectRatio:'none','aria-hidden':'true','data-coast-map-surface':COAST_MAP_RENDERER_ID});
  svg.classList.add('coast-map-surface');
  renderTerrain(svg,model);renderRelief(svg,model);renderForests(svg,model);renderCoast(svg,model);
  root.prepend(svg);
  root.dataset.geographySource='WORLD_DERIVED';
  root.dataset.coastMapRenderer=COAST_MAP_RENDERER_ID;
  return Object.freeze({model,svg});
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>mountCoastMapRenderer(),{once:true});
else mountCoastMapRenderer();
