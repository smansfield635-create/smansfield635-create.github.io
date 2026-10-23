/** Connected coastal hills, in uploaded world metres. Shared presentation/admission law.
 * The envelope encloses the previously surveyed coastal component and its shoulder.
 * It is a scope feather, never evidence of plant support or permission to plant water.
 */
export const HILLSIDE_SHORELINE=Object.freeze({bounds:Object.freeze([-136,-253,249,-101]),feather:16,seed:2874,spacing:.18,maximumRoots:1575168});
const smooth=(a,b,x)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t);};
export function hillsideWeight(x,z){return smooth(0,16,Math.min(x+136,249-x,z+253,-101-z));}
// shaderSlope is 1-normal.y, NOT rise/run. These thresholds are about 9 and 21 degrees.
export function hillsideSandCoverage({x,z,shaderSlope,rawSandCoverage}){
 if(![x,z,shaderSlope,rawSandCoverage].every(Number.isFinite))throw Error('HILLSIDE_SHORE_ATTRIBUTES_INVALID');
 return rawSandCoverage*(1-hillsideWeight(x,z)*smooth(.012,.065,shaderSlope));
}
export function hillsideDry(x,y,z){return hillsideWeight(x,z)*smooth(18,42,y);}
export function hillsideDensity({x,y,z,shaderSlope,contactDistance,sandCoverage}){
 if(sandCoverage>.12||contactDistance<=0)return 0;
 const bank=smooth(.012,.065,shaderSlope),shore=smooth(2,6+10*(1-bank),contactDistance);
 return hillsideWeight(x,z)*shore*(1-smooth(0,.12,sandCoverage))*(10-6*smooth(20,46,y))*(1-.7*smooth(.18,.46,shaderSlope));
}
export const HILLSIDE_SHORELINE_GLSL=`
float hillsideWeight(vec2 p){return smoothstep(0.,16.,min(min(p.x+136.,249.-p.x),min(p.y+253.,-101.-p.y)));}
float hillsideSandCoverage(vec2 p,float slope,float original){return original*(1.-hillsideWeight(p)*smoothstep(.012,.065,slope));}
float hillsideDry(vec3 p){return hillsideWeight(p.xz)*smoothstep(18.,42.,p.y);}
`;
