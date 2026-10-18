/** Offline, deterministic add-only density allocation. Never imported by the renderer. */
import {sampleFoothillMeadowField} from './foothill-meadow-field.v1.js';
import {habitatNoise} from './woodland-habitat-field.v1.js';
import {isVerifiedPlantingPoint} from './verified-planting-cells.v1.js';
import {createGrassContinuityEnvelope,GRASS_CONTINUITY_BOUNDS} from './grass-continuity-supplement.v1.js';
export const SPATIAL_REPAIR=Object.freeze({baseline:'12357909b2cbaab16052b6c30459065547fe9440',originalRoots:1127903,maximumAdditions:289221,maximumRoots:1417124,maximumPackedBytes:22673984,maximumTileRoots:1600,spacing:.14,seed:301});
const clamp=x=>Math.max(0,Math.min(1,x));
export const smooth=(a,b,x)=>{const t=clamp((x-a)/(b-a));return t*t*(3-2*t);};
export function hillTarget(field,slope){const t=field.relativeHeight,w=field.weight,m=smooth(.45,.75,t);return w*(30*(1-m)+16*m)*(1-smooth(.75,.85,t))*(1-.35*smooth(.45,1.2,slope));}
export function createSmoothSlope(sample){
 const bounds=[-118,-273,60,-154], [x0,z0,x1,z1]=bounds,width=x1-x0+1,height=z1-z0+1,values=new Float64Array(width*height),horizontal=new Float64Array(values.length),out=new Float64Array(values.length),kernel=[1,4,6,4,1];
 for(let z=0;z<height;z++)for(let x=0;x<width;x++)values[z*width+x]=sample(x0+x,z0+z)?.slope??1.6;
 for(let z=0;z<height;z++)for(let x=0;x<width;x++)for(let k=-2;k<=2;k++)horizontal[z*width+x]+=values[z*width+Math.max(0,Math.min(width-1,x+k*2))]*kernel[k+2]/16;
 for(let z=0;z<height;z++)for(let x=0;x<width;x++)for(let k=-2;k<=2;k++)out[z*width+x]+=horizontal[Math.max(0,Math.min(height-1,z+k*2))*width+x]*kernel[k+2]/16;
 return(x,z)=>{const qx=Math.max(0,Math.min(width-1.000001,x-x0)),qz=Math.max(0,Math.min(height-1.000001,z-z0)),ix=Math.floor(qx),iz=Math.floor(qz),u=qx-ix,v=qz-iz;return(out[iz*width+ix]*(1-u)+out[iz*width+ix+1]*u)*(1-v)+(out[(iz+1)*width+ix]*(1-u)+out[(iz+1)*width+ix+1]*u)*v;};
}
export function createSpatialRepairField(sample){
 const smoothedSlope=createSmoothSlope(sample),prior=createGrassContinuityEnvelope(),[x0,z0,x1,z1]=GRASS_CONTINUITY_BOUNDS,width=x1-x0,height=z1-z0,d=new Float32Array(width*height),weights=new Float32Array(d.length);
 for(let z=0;z<height;z++)for(let x=0;x<width;x++)d[z*width+x]=isVerifiedPlantingPoint(x0+x+.5,z0+z+.5)?0:10000;
 for(let z=0;z<height;z++)for(let x=0;x<width;x++){const i=z*width+x;if(x)d[i]=Math.min(d[i],d[i-1]+1);if(z)d[i]=Math.min(d[i],d[i-width]+1);if(x&&z)d[i]=Math.min(d[i],d[i-width-1]+Math.SQRT2);if(x+1<width&&z)d[i]=Math.min(d[i],d[i-width+1]+Math.SQRT2);}
 for(let z=height-1;z>=0;z--)for(let x=width-1;x>=0;x--){const i=z*width+x;if(x+1<width)d[i]=Math.min(d[i],d[i+1]+1);if(z+1<height)d[i]=Math.min(d[i],d[i+width]+1);if(x+1<width&&z+1<height)d[i]=Math.min(d[i],d[i+width+1]+Math.SQRT2);if(x&&z+1<height)d[i]=Math.min(d[i],d[i+width-1]+Math.SQRT2);}
 for(let z=0;z<height;z++)for(let x=0;x<width;x++){const xx=x0+x+.5,zz=z0+z+.5,i=z*width+x,shoulder=10+6*habitatNoise(xx,zz,43,301),edge=smooth(0,3,Math.min(x,width-1-x,z,height-1-z));weights[i]=Math.max(prior.sample(xx,zz),(1-smooth(0,shoulder,d[i]))*edge);}
 const ravine=(x,z)=>{if(x<x0||x>=x1||z<z0||z>=z1)return 0;const a=x-x0-.5,b=z-z0-.5,ix=Math.floor(a),iz=Math.floor(b),u=a-ix,v=b-iz,n=(xx,zz)=>xx<0||zz<0||xx>=width||zz>=height?0:weights[zz*width+xx];return(n(ix,iz)*(1-u)+n(ix+1,iz)*u)*(1-v)+(n(ix,iz+1)*(1-u)+n(ix+1,iz+1)*u)*v;};
 return{smoothedSlope,ravine,sample(x,y,z){const hill=sampleFoothillMeadowField(x,y,z);if(hill.weight>0)return{density:hillTarget(hill,smoothedSlope(x,z)),hill:true,height:hill.relativeHeight,weight:hill.weight};return{density:24*ravine(x,z),hill:false,height:0,weight:0};}};
}
