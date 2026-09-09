import {buildCoastMapStandBinding} from './coast-map-stand-binding.mjs';

const NS='http://www.w3.org/2000/svg';
const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
const element=(name,attributes={})=>{
  const node=document.createElementNS(NS,name);
  for(const [key,value] of Object.entries(attributes))node.setAttribute(key,String(value));
  return node;
};

function standFill(environment){
  const weight=clamp(Number(environment?.meanForestWeight)||0,0,1);
  const elevation=clamp(Number(environment?.meanElevationNormalized)||0,0,1);
  const slope=clamp(Number(environment?.meanSlopeNormalized)||0,0,1);
  const hue=Math.round(108+elevation*13-slope*7);
  const saturation=Math.round(24+weight*24);
  const lightness=Math.round(18+elevation*10+weight*5);
  return `hsl(${hue} ${saturation}% ${lightness}%)`;
}

export function mountCoastMapStandLayer(){
  const host=document.getElementById('map-grid');
  if(!host||host.querySelector('[data-coast-map-stand-layer="v1"]'))return null;
  const binding=buildCoastMapStandBinding();
  const svg=element('svg',{
    viewBox:'0 0 1000 1000',
    preserveAspectRatio:'none',
    'aria-hidden':'true',
    focusable:'false',
    'data-coast-map-stand-layer':'v1',
    'data-topology-digest':binding.topologyDigest,
    'data-stand-count':binding.standCount,
    'data-canonical-population-count':binding.canonicalPopulationCount
  });
  svg.style.position='absolute';
  svg.style.inset='0';
  svg.style.width='100%';
  svg.style.height='100%';
  svg.style.pointerEvents='none';
  svg.style.zIndex='0';

  const forest=element('g',{'data-layer':'canonical-forest-stands'});
  for(const stand of binding.stands){
    const width=Math.max(8,stand.bounds.width);
    const height=Math.max(8,stand.bounds.height);
    const weight=clamp(Number(stand.environment?.meanForestWeight)||0,0,1);
    const slope=clamp(Number(stand.environment?.meanSlopeNormalized)||0,0,1);
    const shoreline=clamp(Number(stand.environment?.meanShorelineNormalized)||0,0,1);
    const ellipse=element('ellipse',{
      cx:stand.centroid.presentation.x,
      cy:stand.centroid.presentation.y,
      rx:width/2,
      ry:height/2,
      fill:standFill(stand.environment),
      'fill-opacity':(0.23+weight*0.36).toFixed(3),
      stroke:'rgba(218,231,198,.34)',
      'stroke-opacity':(0.16+(1-slope)*0.22).toFixed(3),
      'stroke-width':(0.7+shoreline*0.8).toFixed(2),
      'data-stand-id':stand.id,
      'data-tree-count':stand.treeCount
    });
    forest.appendChild(ellipse);
  }
  svg.appendChild(forest);

  const shoreline=element('polyline',{
    points:binding.shoreline.points.map(point=>`${point.presentation.x},${point.presentation.y}`).join(' '),
    fill:'none',
    stroke:'rgba(229,220,178,.88)',
    'stroke-width':'4',
    'stroke-linecap':'round',
    'stroke-linejoin':'round',
    'vector-effect':'non-scaling-stroke',
    'data-layer':'canonical-shoreline'
  });
  svg.appendChild(shoreline);
  host.prepend(svg);
  return svg;
}

mountCoastMapStandLayer();
