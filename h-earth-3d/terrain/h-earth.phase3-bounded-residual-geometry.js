/** H_EARTH_PHASE3_BOUNDED_RESIDUAL_GEOMETRY_v1 */
import {sampleHEarthRun8BSuccessorTerrainField,deriveHEarthGen311RegionalArticulation} from './h-earth.successor-terrain-field.run8b.js';
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const smoothstep=(a,b,x)=>{const t=clamp((x-a)/(b-a),0,1);return t*t*(3-2*t)};
export const H_EARTH_PHASE3_RESIDUAL_CEILINGS=Object.freeze({coast:.75,slope_hill:3.25,ridge:5.5,valley:3.5,foothill:1.75,mountain:5.5});
export const H_EARTH_PHASE3_RESIDUAL_WITNESSES=Object.freeze({coast:[0,-100],slope_hill:[72,-172],ridge:[86,-235],valley:[2,-198],foothill:[-52,-180],mountain:[148,-224]});
export const phase3Mask=(x,z)=>clamp(smoothstep(-92,-176,z)*(1-smoothstep(-470,-620,z))*(1-smoothstep(225,365,Math.abs(x))),0,1);
export function phase3VisibleElevation(x,z){const t=sampleHEarthRun8BSuccessorTerrainField(x,z),a=deriveHEarthGen311RegionalArticulation(x,z);if(t?.valid!==true||a?.valid!==true)return NaN;const d=phase3Mask(x,z)*(a.ridgeSignal*24+a.watershedSignal*9+a.foothillSignal*13-a.valleySignal*14-a.passSignal*7+Math.max(0,t.elevation)*.22);return t.elevation+d}
export function phase3ParentPrediction(x,z){const x0=Math.floor(x/8)*8,z0=Math.floor(z/8)*8,tx=(x-x0)/8,tz=(z-z0)/8,a=phase3VisibleElevation(x0,z0),b=phase3VisibleElevation(x0+8,z0),c=phase3VisibleElevation(x0,z0+8),d=phase3VisibleElevation(x0+8,z0+8);return (a*(1-tx)+b*tx)*(1-tz)+(c*(1-tx)+d*tx)*tz}
const terrainClass=(x,z)=>{let best='mountain',dist=Infinity;for(const [name,[wx,wz]] of Object.entries(H_EARTH_PHASE3_RESIDUAL_WITNESSES)){const d=Math.hypot(x-wx,z-wz);if(d<dist){dist=d;best=name}}return best};
export function sampleHEarthPhase3BoundedResidual(x,z,{perimeter=false}={}){if(x%8===0&&z%8===0)return 0;if(perimeter)return 0;const raw=phase3VisibleElevation(x,z)-phase3ParentPrediction(x,z);if(!Number.isFinite(raw))return 0;const ceiling=H_EARTH_PHASE3_RESIDUAL_CEILINGS[terrainClass(x,z)];return clamp(raw,-ceiling,ceiling)}
