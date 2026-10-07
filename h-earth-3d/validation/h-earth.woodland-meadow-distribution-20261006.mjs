#!/usr/bin/env node
import fs from 'node:fs';
const source=fs.readFileSync(new URL('../../showroom/globe/h-earth/render/geometry-landscape-sector.p2.js',import.meta.url),'utf8');
const seed='ECOTONE_A_MEADOW_COVER_20261006';
const hash=(id,channel)=>{let h=2166136261;for(const c of `${seed}:${id}:${channel}`)h=Math.imul(h^c.charCodeAt(0),16777619);return(h>>>0)/4294967296;};
const centers=(legacy)=>{const out=[];for(let iz=0;iz<=25;iz++)for(let ix=0;ix<=22;ix++){const id=`MEADOW_COVER_${ix}_${iz}`,a=hash(id,legacy?'jitter-angle':'center-jitter-angle')*Math.PI*2,r=Math.sqrt(hash(id,legacy?'jitter-radius':'center-jitter-radius'))*(legacy?.25:.90);out.push({x:-174+ix*3+(iz%2)*1.5+Math.cos(a)*r,z:-258+iz*3*Math.sqrt(3)/2+Math.sin(a)*r});}return out;};
const sixfold=(pts)=>{let re=0,im=0;for(let i=0;i<pts.length;i++){let best=Infinity,q=null;for(let j=0;j<pts.length;j++){if(i===j)continue;const dx=pts[j].x-pts[i].x,dz=pts[j].z-pts[i].z,d=dx*dx+dz*dz;if(d<best){best=d;q={dx,dz};}}const t=Math.atan2(q.dz,q.dx)*6;re+=Math.cos(t);im+=Math.sin(t);}return Math.hypot(re/pts.length,im/pts.length);};
const baselineConcentration=sixfold(centers(true)),candidateConcentration=sixfold(centers(false)),reduction=(baselineConcentration-candidateConcentration)/baselineConcentration;
const checks=[
 ['angle-channel',source.includes("trialHash(id,'center-jitter-angle')*Math.PI*2")],
 ['radius-channel',source.includes("Math.sqrt(trialHash(id,'center-jitter-radius'))*.90")],
 ['legacy-quarter-meter-removed',!source.includes("trialHash(id,'jitter-radius'))*.25")],
 ['density-field-preserved',source.includes("const densityField=(x,z)=>")],
 ['fan-four-leaf-preserved',source.includes("const bladeCount=4")],
 ['no-trimming-preserved',source.includes("ECOTONE_TRIAL_TUFT_BUDGET_EXCEEDED")],
 ['distribution-baseline-recorded',source.includes("distributionBaseline:'7804b359aa032caa00f8dd526f8e4186df97fac9'")],
 ['pre-eligibility-anti-lattice',candidateConcentration<baselineConcentration*.60]
];
const failed=checks.filter(x=>!x[1]);
const out={schema:'H_EARTH_WOODLAND_MEADOW_DISTRIBUTION_STATIC_VALIDATION_v1',result:failed.length?'FAIL_CLOSED':'PASS',checks:checks.map(([name,pass])=>({name,pass})),antiLatticePreflight:{metric:'SIXFOLD_NEAREST_NEIGHBOR_DIRECTIONAL_CONCENTRATION_ALL_INDEXED_SITES',baselineConcentration,candidateConcentration,reduction,pass:candidateConcentration<baselineConcentration*.60},note:'Static/pre-eligibility validator only; accepted-site, geometry, fixed-camera and physical-device gates remain separately required.'};
process.stdout.write(JSON.stringify(out,null,2)+'\n');if(failed.length)process.exitCode=1;
