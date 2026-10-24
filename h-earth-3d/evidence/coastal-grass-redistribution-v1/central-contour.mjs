import {smooth} from '../../../showroom/globe/h-earth/render/grass-coastal-field.v1.js';
// Local authoring coordinates. This is a bounded planting contour, not terrain
// modification or a world-wide distance-to-water rule. The estate hold remains.
export const estateClearanceRadius=24;
export function coastalLimit(x){return -182+16*Math.exp(-(((x+55)/45)**2))+12*Math.exp(-(((x-120)/65)**2));}
export function centralRetention(x,y,z){
 const lateral=smooth(-130,-110,x)*(1-smooth(160,180,x));
 const lowland=1-smooth(6,8,y);
 const coastRemoval=lateral*lowland*smooth(coastalLimit(x)-6,coastalLimit(x),z)*(1-smooth(-95,-90,z));
 const estateRetention=smooth(estateClearanceRadius,estateClearanceRadius+4,Math.hypot(x-80,z+172));
 return (1-coastRemoval)*estateRetention;
}
