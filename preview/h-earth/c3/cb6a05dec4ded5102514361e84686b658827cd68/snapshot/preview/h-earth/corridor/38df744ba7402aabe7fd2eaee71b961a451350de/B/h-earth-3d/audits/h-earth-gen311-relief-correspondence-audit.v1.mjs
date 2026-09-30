import {sampleHEarthWorldManifold} from '../terrain/h-earth.world-manifold-domain.js';
import {deriveHEarthGen311RegionalArticulation} from '../terrain/h-earth.successor-terrain-field.run8b.js';
const clamp=v=>Math.min(1,Math.max(0,v)),smooth=(a,b,x)=>{const t=clamp((x-a)/(b-a));return t*t*(3-2*t)};
const mask=(x,z)=>clamp(smooth(-92,-176,z)*(1-smooth(-470,-620,z))*(1-smooth(225,365,Math.abs(x))));
function terms(x,z,y){const a=deriveHEarthGen311RegionalArticulation(x,z),m=mask(x,z);const t={ridge:a.ridgeSignal*24,watershed:a.watershedSignal*9,foothill:a.foothillSignal*13,valley:-a.valleySignal*14,pass:-a.passSignal*7,positiveElevation:Math.max(0,y)*.22};return {a,m,t,delta:m*Object.values(t).reduce((s,v)=>s+v,0)}}
const points=[];for(let z=-176;z>=-320;z-=8)for(let x=-224;x<=224;x+=8){const g=sampleHEarthWorldManifold(x,z);if(!g.valid)continue;const q=terms(x,z,g.elevation);points.push({x,z,g:g.elevation,delta:q.delta,final:g.elevation+q.delta,landform:q.a.landformClass,...q.t});}
const top=[...points].sort((a,b)=>Math.abs(b.delta)-Math.abs(a.delta)).slice(0,24);
const positives=points.filter(p=>p.delta>0), high=points.filter(p=>p.g>20), highAmplified=high.filter(p=>p.delta>8);
const mean=a=>a.length?a.reduce((s,v)=>s+v,0)/a.length:0;
const corr=(xs,ys)=>{const mx=mean(xs),my=mean(ys);let n=0,dx=0,dy=0;for(let i=0;i<xs.length;i++){const a=xs[i]-mx,b=ys[i]-my;n+=a*b;dx+=a*a;dy+=b*b}return n/Math.sqrt(dx*dy||1)};
console.log(JSON.stringify({schema:'H_EARTH_GEN311_RELIEF_CORRESPONDENCE_AUDIT_v1',sampleCount:points.length,positiveDeltaCount:positives.length,highCanonicalElevationCount:high.length,highCanonicalElevationAlsoAmplifiedCount:highAmplified.length,maximumPositiveDelta:Math.max(...points.map(p=>p.delta)),minimumDelta:Math.min(...points.map(p=>p.delta)),correlationCanonicalElevationToGen311Delta:corr(points.map(p=>p.g),points.map(p=>p.delta)),meanDeltaOnCanonicalElevationAbove20:mean(high.map(p=>p.delta)),topAbsoluteDeltaWitnesses:top,interpretationBoundary:{gen311InputsDerivedFromGWorld:true,gen311ElevationMutationOccursInLandscapePreview:true,independentGeographyAuthorityDeclaredFalse:true}},null,2));
