import {
  GRATITUDE_GEOGRAPHY_ADAPTER_ID,
  mapToWorld,
  resolveCoastlinePolyline,
  sampleGratitudeWorld
} from './gratitude-geography.adapter.mjs';

const NS='http://www.w3.org/2000/svg';
const WIDTH=192;
const HEIGHT=144;
const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
const mix=(a,b,t)=>a+(b-a)*t;
const mixRgb=(a,b,t)=>a.map((value,index)=>Math.round(mix(value,b[index],t)));
const element=(name,attributes={})=>{
  const node=document.createElementNS(NS,name);
  for(const [key,value] of Object.entries(attributes))node.setAttribute(key,String(value));
  return node;
};

function terrainColor(source){
  const normal=source.normal||{x:0,y:1,z:0};
  const light=clamp(normal.x*-.38+normal.y*.82+normal.z*-.42,.18,1);
  const shorelineDistance=Number(source.shorelineDistance)||0;
  const water=source.materialProfile==='OPEN_WATER'||shorelineDistance<0;
  if(water){
    const depth=clamp(Math.abs(shorelineDistance)/360,0,1);
    const base=mixRgb([31,91,108],[7,28,48],depth);
    const bathymetry=Math.abs((Math.abs(shorelineDistance)+18)%82-41)<1.6?.9:1;
    return base.map(value=>Math.round(value*bathymetry));
  }

  const elevation=Number(source.presentationElevation)||0;
  const elevationMix=clamp((elevation+4)/115,0,1);
  let base=mixRgb([107,106,77],[133,139,119],elevationMix);
  const beach=clamp(Number(source.coastline?.beachWeight)||0,0,1);
  const wetSand=clamp(Number(source.coastline?.wetSandWeight)||0,0,1);
  if(beach>0)base=mixRgb(base,[202,181,123],beach);
  if(wetSand>0)base=mixRgb(base,[105,99,76],wetSand*.72);
  const contour=Math.abs(((elevation+240)%16)-8)<.5?.84:1;
  const shade=(.54+light*.48)*contour;
  return base.map(value=>clamp(Math.round(value*shade),0,255));
}

function renderRelief(canvas){
  canvas.width=WIDTH;
  canvas.height=HEIGHT;
  const context=canvas.getContext('2d',{alpha:false});
  if(!context)return false;
  const image=context.createImageData(WIDTH,HEIGHT);
  for(let y=0;y<HEIGHT;y++){
    for(let x=0;x<WIDTH;x++){
      const map={u:(x+.5)/WIDTH,v:(y+.5)/HEIGHT};
      const world=mapToWorld(map);
      const source=sampleGratitudeWorld(world.x,world.z).source;
      const color=terrainColor(source);
      const offset=(y*WIDTH+x)*4;
      image.data[offset]=color[0];
      image.data[offset+1]=color[1];
      image.data[offset+2]=color[2];
      image.data[offset+3]=255;
    }
  }
  context.putImageData(image,0,0);
  return true;
}

function mountMapStyle(){
  if(document.querySelector('[data-coast-map-style="terrain-v1"]'))return;
  const style=document.createElement('style');
  style.dataset.coastMapStyle='terrain-v1';
  style.textContent=`
    .map-grid{isolation:isolate;background:#0a1d29}
    .map-grid::before{z-index:2;background:linear-gradient(118deg,rgba(255,244,206,.11),transparent 27%),radial-gradient(circle at 76% 18%,rgba(237,226,181,.12),transparent 25%),linear-gradient(180deg,rgba(2,10,18,.08),rgba(1,7,13,.24));opacity:1;pointer-events:none}
    .map-grid::after{content:"N";position:absolute;z-index:3;right:18px;top:15px;width:28px;padding-top:20px;text-align:center;color:rgba(246,235,201,.82);font-size:.62rem;font-weight:900;letter-spacing:.12em;background:linear-gradient(160deg,transparent 0 47%,rgba(246,235,201,.7) 48% 52%,transparent 53%) top center/13px 18px no-repeat;pointer-events:none}
    .coast-map-terrain{position:absolute;inset:0;z-index:0;width:100%;height:100%;object-fit:fill;filter:saturate(.9) contrast(1.08)}
    .coast-map-geography{position:absolute;inset:0;z-index:1;width:100%;height:100%}
    .map-node{z-index:4;border-color:rgba(248,237,201,.34);background:rgba(4,16,23,.86);box-shadow:0 2px 10px rgba(0,0,0,.32)}
    .map-node::before{box-shadow:0 0 0 3px rgba(243,223,170,.1),0 0 12px rgba(243,223,170,.44)}
    .map-node span{background:rgba(3,12,18,.88);box-shadow:0 3px 12px rgba(0,0,0,.38)}
  `;
  document.head.appendChild(style);
}

export function mountCoastMapStandLayer(){
  const host=document.getElementById('map-grid');
  if(!host||host.querySelector('[data-coast-map-terrain-layer="v1"]'))return null;
  mountMapStyle();

  const canvas=document.createElement('canvas');
  canvas.className='coast-map-terrain';
  canvas.setAttribute('aria-hidden','true');
  canvas.dataset.coastMapTerrainLayer='v1';
  canvas.dataset.geographyAuthority=GRATITUDE_GEOGRAPHY_ADAPTER_ID;
  canvas.dataset.renderedTreeCount='0';
  renderRelief(canvas);

  const coastline=resolveCoastlinePolyline();
  const svg=element('svg',{
    viewBox:'0 0 1000 1000',
    preserveAspectRatio:'none',
    'aria-hidden':'true',
    focusable:'false',
    'data-coast-map-geography-layer':'v1',
    'data-geography-authority':GRATITUDE_GEOGRAPHY_ADAPTER_ID,
    'data-rendered-tree-count':'0'
  });
  svg.classList.add('coast-map-geography');
  svg.style.pointerEvents='none';

  const shorelinePoints=coastline.points.map(point=>`${point.map.u*1000},${point.map.v*1000}`).join(' ');
  const shorelineGlow=element('polyline',{
    points:shorelinePoints,
    fill:'none',
    stroke:'rgba(242,224,166,.24)',
    'stroke-width':'8',
    'stroke-linecap':'round',
    'stroke-linejoin':'round',
    'vector-effect':'non-scaling-stroke'
  });
  const shoreline=element('polyline',{
    points:shorelinePoints,
    fill:'none',
    stroke:'rgba(246,231,183,.92)',
    'stroke-width':'2.2',
    'stroke-linecap':'round',
    'stroke-linejoin':'round',
    'vector-effect':'non-scaling-stroke',
    'data-layer':'canonical-shoreline'
  });
  svg.append(shorelineGlow,shoreline);
  host.prepend(canvas,svg);
  return svg;
}

mountCoastMapStandLayer();
