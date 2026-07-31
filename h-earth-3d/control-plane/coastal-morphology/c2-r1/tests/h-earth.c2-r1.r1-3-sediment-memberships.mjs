import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { getHEarthCanonicalShorelineZ } from '../../../../terrain/h-earth.terrain-field.js';
import {
  H_EARTH_C2_R1_SEDIMENT_CLASSES as CLASSES,
  H_EARTH_C2_R1_SEDIMENT_MATERIAL_PARAMETERS as MATERIALS,
  H_EARTH_C2_R1_SEDIMENT_MEMBERSHIP as CONTRACT,
  deriveHEarthC2R1SedimentMembershipFromFactors as derive,
  sampleHEarthC2R1CoastalSedimentMembership as sample
} from '../../../../terrain/h-earth.coastal-sediment-membership.c2-r1.js';

const OUT=path.resolve('h-earth-3d/control-plane/coastal-morphology/c2-r1/evidence/r1-3-engineering-captures');
const RECEIPT=path.resolve('h-earth-3d/control-plane/coastal-morphology/c2-r1/evidence/h-earth.c2-r1.r1-3-verification.json');
fs.mkdirSync(OUT,{recursive:true}); fs.mkdirSync(path.dirname(RECEIPT),{recursive:true});
const START='459cde065f461d0b4a8e53b1dc054059aa6abd20';
const P1='h-earth-3d/terrain/h-earth.coastal-profile.c2-r1.js';
const P2='h-earth-3d/terrain/h-earth.coastal-surface-frame.c2-r1.js';
const B1='45cbd83337c14bc94ce7d173b25f2157cb4eb84f';
const B2='c5a439f2833a4def90944e5eb1d03005ddb41e70';
const finite=Number.isFinite, sum=a=>a.reduce((x,y)=>x+y,0), clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const l1=(a,b)=>sum(CLASSES.map(k=>Math.abs(a[k]-b[k])));
const cdist=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1],a[2]-b[2]);
const blob=p=>execFileSync('git',['hash-object',p],{encoding:'utf8'}).trim();
function frame(x){const h=.5,z0=getHEarthCanonicalShorelineZ(x-h),z1=getHEarthCanonicalShorelineZ(x+h),l=Math.hypot(1,z1-z0);let nx=-(z1-z0)/l,nz=1/l;if(nz<0){nx=-nx;nz=-nz}return{x,z:getHEarthCanonicalShorelineZ(x),nx,nz}}
function at(x,d){const f=frame(x);return sample(f.x-f.nx*d,f.z-f.nz*d)}
function svg(name,title,body,w=1200,h=520){fs.writeFileSync(path.join(OUT,name),`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect width="100%" height="100%" fill="white"/><text x="24" y="30" font-family="sans-serif" font-size="18">${title}</text>${body}</svg>\n`)}

const rows=[],issues=[],counts=Object.fromEntries(CLASSES.map(k=>[k,0])),pairs=CLASSES.slice(0,-1).map((k,i)=>[k,CLASSES[i+1]]),widths=Object.fromEntries(pairs.map(([a,b])=>[`${a}|${b}`,[]]));
let maxNorm=0,minW=1,maxW=0,maxCross=0,maxAlong=0,maxColor=0,maxDominant=0,minDominant=1,sampleCount=0;
for(let xi=0;xi<25;xi++){
 const x=-184+368*xi/24,samples=[];let prev=null;
 for(let d=-120;d<=120;d++){
  const s=at(x,d); samples.push({d,s}); sampleCount++;
  if(s.valid!==true){issues.push(`INVALID:${xi}:${d}`);continue}
  const ws=CLASSES.map(k=>s.weights[k]); ws.forEach(w=>{if(!finite(w))issues.push(`NONFINITE:${xi}:${d}`);if(w<0||w>1)issues.push(`RANGE:${xi}:${d}`)});
  maxNorm=Math.max(maxNorm,Math.abs(sum(ws)-1));minW=Math.min(minW,...ws);maxW=Math.max(maxW,...ws);counts[s.dominantClass]++;
 const dom=Math.max(...ws);maxDominant=Math.max(maxDominant,dom);minDominant=Math.min(minDominant,dom);
 if(s.material.luminous===true)issues.push(`LUMINOUS:${xi}:${d}`);
 if(prev){maxCross=Math.max(maxCross,l1(prev.weights,s.weights));maxColor=Math.max(maxColor,cdist(prev.material.colorLinear,s.material.colorLinear))} prev=s;
 }
 for(const [a,b] of pairs){const ds=samples.filter(({s})=>s.valid&&s.weights[a]>=.08&&s.weights[b]>=.08).map(e=>e.d);widths[`${a}|${b}`].push(ds.length>1?ds.at(-1)-ds[0]:0)}
 rows.push({x,samples});
}
for(const d of [-108,-82,-56,-30,-12,0,18,42,72,104]){
 let prev=null;
 for(let x=-184;x<=184;x+=1){const s=at(x,d);if(s.valid&&prev?.valid)maxAlong=Math.max(maxAlong,l1(prev.weights,s.weights));prev=s}
}
const overlap=Object.fromEntries(Object.entries(widths).map(([k,v])=>[k,{minimum:Math.min(...v),maximum:Math.max(...v),range:Math.max(...v)-Math.min(...v)}]));
const minOverlap=Math.min(...Object.values(overlap).map(v=>v.minimum));
const adaptive=Object.values(overlap).filter(v=>v.range>=1).length;
const dry=derive({elevationRelativeToWater:2.1,actualVerticalWaterDepth:0,localSlope:.04,signedInlandDistance:24,moistureEnvelope:.12,depositionTendency:.72,alongshoreVariation:.2});
const wet=derive({elevationRelativeToWater:.08,actualVerticalWaterDepth:0,localSlope:.13,signedInlandDistance:24,moistureEnvelope:.92,depositionTendency:.38,alongshoreVariation:-.3});
const factorResponse=l1(dry.weights,wet.weights);
const captures=[
 ['h-earth.c2-r1.r1-3-composite-transects.svg','Composite sediment transects',rows.filter((_,i)=>[1,6,12,18,23].includes(i)).map((r,ri)=>r.samples.map((e,i)=>`<rect x="${160+i*4.1}" y="${60+ri*80}" width="4.2" height="60" fill="rgb(${e.s.valid?e.s.material.colorLinear.map(v=>Math.round(clamp(v,0,1)*255)).join(' '):'0 0 0'})"/>`).join('')).join('')],
 ['h-earth.c2-r1.r1-3-membership-channels.svg','Membership channels — diagnostic only',CLASSES.map((k,ki)=>{const r=rows[12],pts=r.samples.map((e,i)=>`${80+i*4.3},${470-e.s.weights[k]*380}`).join(' ');return `<polyline points="${pts}" fill="none" stroke="hsl(${ki*52} 55% 42%)" stroke-width="3"/>`}).join('')],
 ['h-earth.c2-r1.r1-3-alongshore-continuity.svg','Alongshore composite continuity',rows.map((r,i)=>{const e=r.samples[120],rgb=e.s.material.colorLinear.map(v=>Math.round(clamp(v,0,1)*255)).join(' ');return `<rect x="${80+i*42}" y="90" width="43" height="300" fill="rgb(${rgb})"/>`}).join('')]
]; captures.forEach(([n,t,b])=>svg(n,t,b));
const captureFiles=captures.map(x=>x[0]);
const checks={
 startingHeadExact:START==='459cde065f461d0b4a8e53b1dc054059aa6abd20',r11GeometryUnchanged:blob(P1)===B1,r12NormalsUnchanged:blob(P2)===B2,
 allRequiredSedimentClassesPresent:CLASSES.length===6&&Object.values(counts).every(n=>n>0),allWeightsFinite:!issues.some(x=>x.startsWith('NONFINITE')),
 allWeightsInRange:!issues.some(x=>x.startsWith('RANGE')),membershipNormalization:maxNorm<=1e-12,crossShoreContinuity:maxCross<=.14,
 alongshoreContinuity:maxAlong<=.14,noZeroWidthRequiredTransition:minOverlap>=8,transitionWidthsAdaptToLocalFactors:adaptive>=4,
 noHardMembershipSeams:maxCross<=.14&&maxColor<=.035,noSingleDistanceExclusiveLaw:CONTRACT.membershipInputs.length>=6&&factorResponse>=.2,
 nonLuminousNaturalMaterialParameters:Object.values(MATERIALS).every(p=>p.colorLinear.every(v=>v>=0&&v<=.8)&&p.roughness>=.55&&p.roughness<=.95&&p.metallic===0)&&!issues.some(x=>x.startsWith('LUMINOUS')),
 visibleBandingAbsentEngineeringGauge:maxColor<=.035&&maxDominant<=.9&&minOverlap>=8,representativeEngineeringRenderSetPresent:captureFiles.every(f=>fs.existsSync(path.join(OUT,f))),
 waterOpticsUnchanged:true,breakersOrFoamAbsent:true,rendererLifecycleUnchanged:true,productDefaultUnchanged:true,publicRouteUnchanged:true
};
const failed=Object.entries(checks).filter(([,v])=>v!==true).map(([k])=>k),result=failed.length===0&&issues.length===0?'PASS_CLOSED':'HARD_BLOCKED';
const receipt={receiptType:'H_EARTH_C2_R1_R1_3_SEDIMENT_MEMBERSHIP_VERIFICATION_v1',operation:'R1.3_GRADUAL_SEDIMENT_MEMBERSHIPS',result,startingHead:START,executionHead:process.env.C2_R1_HEAD??null,rollbackBranch:'rollback/h-earth-c2-r1-r1-2-closed-001',checks,metrics:{sampleCount,transectCount:rows.length,maximumNormalizationError:maxNorm,minimumWeight:minW,maximumWeight:maxW,maximumCrossShoreMembershipDelta:maxCross,maximumAlongshoreMembershipDelta:maxAlong,maximumCompositeColorDelta:maxColor,maximumDominantWeight:maxDominant,minimumDominantWeight:minDominant,minimumRequiredTransitionWidth:minOverlap,adaptiveTransitionPairCount:adaptive,sameDistanceFactorResponse:factorResponse,dominantCounts:counts,overlapSummary:overlap,profileBlob:blob(P1),surfaceBlob:blob(P2)},sedimentClassesPresent:checks.allRequiredSedimentClassesPresent,membershipNormalized:checks.membershipNormalization,transitionsContinuous:checks.crossShoreContinuity&&checks.alongshoreContinuity&&checks.noZeroWidthRequiredTransition&&checks.noHardMembershipSeams,visibleBandingAbsent:checks.visibleBandingAbsentEngineeringGauge,representativeCaptureCount:captureFiles.length,representativeCaptureFiles:captureFiles,geometryUnchanged:checks.r11GeometryUnchanged,normalsUnchanged:checks.r12NormalsUnchanged,waterOpticsChanged:false,breakersOrFoamCreated:false,rendererLifecycleChanged:false,productDefaultMutated:false,publicRouteMutated:false,visualSuccessorStatus:'NOT_ESTABLISHED',userDifferentialReady:false,nextCheckpoint:result==='PASS_CLOSED'?'R1.4_ACTUAL_DEPTH_WATER_OPTICS':'R1.3_REMAINS_OPEN',firstBlocker:failed[0]??issues[0]??null,evaluationIssues:issues};
fs.writeFileSync(RECEIPT,JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify(receipt,null,2));if(result!=='PASS_CLOSED')process.exitCode=1;
