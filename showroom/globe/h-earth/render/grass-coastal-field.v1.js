/** Offline coastal allocation on exact admitted terrain. Not imported at runtime. */
import {habitatNoise} from './woodland-habitat-field.v1.js';
export const COASTAL_GRASS=Object.freeze({baseline:'6b6827e2765e0910fe15d21dd67d637c1ced8ba5',originalRoots:1250134,maximumAdditions:250000,maximumRoots:1500134,maximumPackedBytes:24002144,maximumTileRoots:1600,spacing:.14,seed:401,scanBounds:Object.freeze([-1024,-235,1024,100]),priorManifestSha256:'a080b661751e2fe50d0f4fa5b2b53bd1074f7099a25c7276871c018b4c42d1b1',priorRawSha256:'8d33a765b6d1009a1180b6a8a3709d1161aacc46bb75b91c905a8acf91523e99',priorCompressedSha256:'8edaa9574dd94372a7cf3047ec2b5e2395c9f15751de2c11a91f84ddad1a5cee'});
export const smooth=(a,b,x)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t);};
const spine=[[-52,-208],[18,-226],[86,-235],[148,-224]];
/** Named ridge-side separator with endpoint continuation; not a hydrological watershed. */
export function coastalDivide(x){if(x<=spine[0][0])return spine[0][1];if(x>=spine.at(-1)[0])return spine.at(-1)[1];for(let i=1;i<spine.length;i++)if(x<=spine[i][0]){const [a,b]=spine[i-1],[c,d]=spine[i];return b+(d-b)*(x-a)/(c-a);}}
export const coastalSideWeight=(x,z)=>smooth(0,8+6*habitatNoise(x,z,37,405),z-coastalDivide(x));
function bilinear(values,bounds,x,z,center=.5){const [x0,z0,x1,z1]=bounds,w=x1-x0,h=z1-z0,xx=x-x0-center,zz=z-z0-center,ix=Math.floor(xx),iz=Math.floor(zz),u=xx-ix,v=zz-iz,n=(a,b)=>a<0||b<0||a>=w||b>=h?0:values[b*w+a];return(n(ix,iz)*(1-u)+n(ix+1,iz)*u)*(1-v)+(n(ix,iz+1)*(1-u)+n(ix+1,iz+1)*u)*v;}
export function createCoastalField(rows,sample){
 const map=new Map(rows.filter(r=>r.landform!=='LOWLAND').map(r=>[Math.floor(r.x)+':'+Math.floor(r.z),r])),seen=new Set(),components=[];
 for(const [key,row]of map){if(seen.has(key))continue;const queue=[row];seen.add(key);let front=0;for(let i=0;i<queue.length;i++){const r=queue[i];if(r.x>=-52&&r.x<=148)front++;for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=1;dz++){const k=(Math.floor(r.x)+dx)+':'+(Math.floor(r.z)+dz);if(map.has(k)&&!seen.has(k)){seen.add(k);queue.push(map.get(k));}}}if(front)components.push({rows:queue,front,key});}
 components.sort((a,b)=>b.rows.length-a.rows.length||b.front-a.front||a.key.localeCompare(b.key));if(!components.length)throw Error('COASTAL_COMPONENT_MISSING');
 const core=components[0].rows,coreBounds=[Math.min(...core.map(r=>r.x)),Math.min(...core.map(r=>r.z)),Math.max(...core.map(r=>r.x)),Math.max(...core.map(r=>r.z))];
 // Complete noise shoulder plus interpolation support, not a planting rectangle.
 const bounds=[Math.floor(coreBounds[0])-18,Math.floor(coreBounds[1])-18,Math.ceil(coreBounds[2])+18,Math.ceil(coreBounds[3])+18], [x0,z0,x1,z1]=bounds,w=x1-x0,h=z1-z0,d=new Float64Array(w*h);d.fill(1e9);
 for(const r of core)d[(Math.floor(r.z)-z0)*w+Math.floor(r.x)-x0]=0;
 for(let z=0;z<h;z++)for(let x=0;x<w;x++){const i=z*w+x;if(x)d[i]=Math.min(d[i],d[i-1]+1);if(z)d[i]=Math.min(d[i],d[i-w]+1);if(x&&z)d[i]=Math.min(d[i],d[i-w-1]+Math.SQRT2);if(x+1<w&&z)d[i]=Math.min(d[i],d[i-w+1]+Math.SQRT2);}
 for(let z=h-1;z>=0;z--)for(let x=w-1;x>=0;x--){const i=z*w+x;if(x+1<w)d[i]=Math.min(d[i],d[i+1]+1);if(z+1<h)d[i]=Math.min(d[i],d[i+w]+1);if(x+1<w&&z+1<h)d[i]=Math.min(d[i],d[i+w+1]+Math.SQRT2);if(x&&z+1<h)d[i]=Math.min(d[i],d[i+w-1]+Math.SQRT2);}
 const weights=Float64Array.from(d,(distance,i)=>{const x=x0+i%w+.5,z=z0+Math.floor(i/w)+.5;return 1-smooth(0,10+6*habitatNoise(x,z,43,301),distance);});
 // Same separated [1,4,6,4,1]/16 at two-metre offsets as accepted spatial repair.
 const slopes=new Float64Array(w*h),horizontal=new Float64Array(w*h),out=new Float64Array(w*h),kernel=[1,4,6,4,1];
 for(let z=0;z<h;z++)for(let x=0;x<w;x++)slopes[z*w+x]=sample(x0+x+.5,z0+z+.5)?.slope??1.6;
 for(let z=0;z<h;z++)for(let x=0;x<w;x++)for(let k=-2;k<=2;k++)horizontal[z*w+x]+=slopes[z*w+Math.max(0,Math.min(w-1,x+k*2))]*kernel[k+2]/16;
 for(let z=0;z<h;z++)for(let x=0;x<w;x++)for(let k=-2;k<=2;k++)out[z*w+x]+=horizontal[Math.max(0,Math.min(h-1,z+k*2))*w+x]*kernel[k+2]/16;
 const weight=(x,z)=>x<x0||x>=x1||z<z0||z>=z1?0:bilinear(weights,bounds,x,z)*coastalSideWeight(x,z);
 const smoothedSlope=(x,z)=>bilinear(out,bounds,x,z);
 return{bounds,coreBounds,coreCells:core.length,frontCells:components[0].front,componentCount:components.length,weight,smoothedSlope,sample(x,y,z,material){const exposure=Math.max(material.orographicExposure||0,material.exposureDrying||0);return 24*weight(x,z)*(1-.35*smooth(.45,1.2,smoothedSlope(x,z)))*(1-smooth(24,38,y))*(1-.35*smooth(.45,.9,exposure))*smooth(34,44,material.shorelineDistance);}};
}
