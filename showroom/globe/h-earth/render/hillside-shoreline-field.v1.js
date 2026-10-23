/** Shared terrain-side presentation/admission law, in uploaded world metres.
 * Census bounds only bound offline work; they never clip planting or shading.
 */
import {coastalDivide} from './grass-coastal-field.v1.js';
export const HILLSIDE_SHORELINE=Object.freeze({bounds:Object.freeze([-512,-360,512,160]),seed:2875,spacing:.14});
const smooth=(a,b,x)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t);};
export function hillsideWeight(x,z){return smooth(-48,-24,z-coastalDivide(x));}
// shaderSlope is 1-normal.y, NOT rise/run.
export function hillsideSandCoverage({x,z,shaderSlope,rawSandCoverage}){
 if(![x,z,shaderSlope,rawSandCoverage].every(Number.isFinite))throw Error('HILLSIDE_SHORE_ATTRIBUTES_INVALID');
 return rawSandCoverage*(1-hillsideWeight(x,z)*smooth(.012,.065,shaderSlope));
}
export function hillsideDry(x,y,z){return hillsideWeight(x,z)*smooth(18,42,y);}
export function hillsideDensity({x,y,z,shaderSlope,contactDistance,sandCoverage}){
 if(sandCoverage>.12||contactDistance<=0)return 0;
 const bank=smooth(.012,.065,shaderSlope),shore=smooth(2,6+10*(1-bank),contactDistance);
 const elevation=24-16*smooth(20,38,y)-6.5*smooth(38,50,y);
 return hillsideWeight(x,z)*shore*(1-smooth(0,.12,sandCoverage))*elevation*(1-.7*smooth(.18,.46,shaderSlope));
}
export const HILLSIDE_SHORELINE_GLSL=`
float hillsideDivide(float x){
 if(x<=-52.)return -208.;
 if(x<=18.)return mix(-208.,-226.,(x+52.)/70.);
 if(x<=86.)return mix(-226.,-235.,(x-18.)/68.);
 if(x<=148.)return mix(-235.,-224.,(x-86.)/62.);
 return -224.;
}
float hillsideWeight(vec2 p){return smoothstep(-48.,-24.,p.y-hillsideDivide(p.x));}
float hillsideSandCoverage(vec2 p,float slope,float original){return original*(1.-hillsideWeight(p)*smoothstep(.012,.065,slope));}
float hillsideDry(vec3 p){return hillsideWeight(p.xz)*smoothstep(18.,42.,p.y);}
`;
