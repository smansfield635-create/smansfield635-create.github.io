import {sampleHEarthWorldManifold} from '../terrain/h-earth.world-manifold-domain.js';
import {deriveHEarthGen311RegionalArticulation} from '../terrain/h-earth.successor-terrain-field.run8b.js';
import {regionToHEarthPlanetPoint,getHEarthPlanetRelativeUp} from '../../showroom/globe/h-earth/render/planetary-world-frame.js';
const clamp=v=>Math.min(1,Math.max(0,v));const smooth=(a,b,x)=>{const t=clamp((x-a)/(b-a));return t*t*(3-2*t)};
const mask=(x,z)=>clamp(smooth(-92,-176,z)*(1-smooth(-470,-620,z))*(1-smooth(225,365,Math.abs(x))));
function relief(x,y,z){const a=deriveHEarthGen311RegionalArticulation(x,z);if(!a.valid)return 0;return mask(x,z)*(a.ridgeSignal*24+a.watershedSignal*9+a.foothillSignal*13-a.valleySignal*14-a.passSignal*7+Math.max(0,y)*.22)}
const witnesses=[['COAST',0,-82],['LOWLAND',0,-150],['RIDGE_EAST',148,-224],['RIDGE_CENTRAL',86,-235],['PASS_EAST',119,-226],['VALLEY',2,-198],['REAR',0,-420]];
const out=witnesses.map(([id,x,z])=>{const g=sampleHEarthWorldManifold(x,z);const d=relief(x,g.elevation,z),pre={x,y:g.elevation+d,z},p=regionToHEarthPlanetPoint(pre),up=getHEarthPlanetRelativeUp(pre);return{id,gWorld:{x,y:g.elevation,z,slope:g.slope,curvature:g.curvature},gen311ReliefDelta:d,preSphere:pre,planet:{x:p.x,y:p.y,z:p.z,radialDistance:p.radialDistance,angularDistance:p.angularDistance},projectionDelta:{x:p.x-x,y:p.y-pre.y,z:p.z-z,magnitude:Math.hypot(p.x-x,p.y-pre.y,p.z-z)},planetUp:up};});
console.log(JSON.stringify({schema:'H_EARTH_NUMERICAL_TRANSFORM_CHAIN_AUDIT_v1',sphereRadius:420000,witnesses:out},null,2));
