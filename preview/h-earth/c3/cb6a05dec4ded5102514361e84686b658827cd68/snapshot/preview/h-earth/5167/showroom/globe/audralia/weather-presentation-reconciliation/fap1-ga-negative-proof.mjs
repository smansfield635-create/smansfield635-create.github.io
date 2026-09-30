const PLANET_RADIUS=6200;
const NORTH=[0,.5,-.8660254037844386];
const MERIDIAN=[0,.8660254037844386,.5];
const EAST=[1,0,0];
const DEG=Math.PI/180;
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const freeze=value=>Object.freeze(value);

function radialFromLatLon(latitudeDeg,longitudeDeg){
  const lat=latitudeDeg*DEG,lon=longitudeDeg*DEG,cl=Math.cos(lat),sl=Math.sin(lat),co=Math.cos(lon),si=Math.sin(lon);
  return [
    NORTH[0]*sl+(MERIDIAN[0]*co+EAST[0]*si)*cl,
    NORTH[1]*sl+(MERIDIAN[1]*co+EAST[1]*si)*cl,
    NORTH[2]*sl+(MERIDIAN[2]*co+EAST[2]*si)*cl
  ];
}
function tangentTarget(latitudeDeg,longitudeDeg){
  const radial=radialFromLatLon(latitudeDeg,longitudeDeg),angle=Math.acos(clamp(radial[1],-1,1)),sine=Math.sin(angle);
  if(Math.abs(sine)<1e-7)return{targetU:0,targetV:0};
  const distance=angle*PLANET_RADIUS;
  return{targetU:distance*radial[0]/sine,targetV:distance*radial[2]/sine};
}
function wrapLon(value){return((value+180)%360+360)%360-180;}

async function waitForAuthority(){
  for(let i=0;i<320;i++){
    const authority=globalThis.__AUDRALIA_FAP1_GA_AUTHORITY__;
    const receipt=globalThis.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION__;
    if(authority?.meteorologicalAuthority==='FAP1_ONLY'&&receipt?.setCameraStateForTest)return{authority,receipt};
    if(globalThis.__AUDRALIA_FAP1_GA_AUTHORITY_ERROR__)throw new Error(`GA_AUTHORITY_ERROR:${globalThis.__AUDRALIA_FAP1_GA_AUTHORITY_ERROR__.message}`);
    await sleep(25);
  }
  throw new Error('GA_NEGATIVE_PROOF_AUTHORITY_TIMEOUT');
}

function proofControl(control){
  globalThis.__AUDRALIA_FAP1_GA_PROOF_CONTROL__=freeze({canonicalTimeHoursOverride:0,...control});
}
async function waitForCase(authority,caseId,timeoutMs=2500){
  const started=performance.now();
  while(performance.now()-started<timeoutMs){
    const packet=authority.descriptorPacket?.();
    if(packet?.qualificationProof?.caseId===caseId)return packet;
    await sleep(30);
  }
  throw new Error(`GA_NEGATIVE_PROOF_PACKET_TIMEOUT:${caseId}`);
}
async function setWitness(receipt,latitudeDeg,longitudeDeg,{distance=2200,pitch=1.25,yaw=0}={}){
  const target=tangentTarget(latitudeDeg,longitudeDeg);
  receipt.setCameraStateForTest({...target,distance,pitch,yaw});
  await sleep(45);
  return target;
}
async function settle(authority,caseId){
  await waitForCase(authority,caseId);
  await sleep(90);
}
function weatherCanvas(){return document.querySelector('canvas[data-fap1-ga="true"]');}
function captureVisualMetric(){
  const source=weatherCanvas();
  if(!(source instanceof HTMLCanvasElement)||source.width<1||source.height<1)throw new Error('GA_NEGATIVE_PROOF_CANVAS_MISSING');
  const width=Math.min(source.width,256),height=Math.min(source.height,256),probe=document.createElement('canvas');probe.width=width;probe.height=height;
  const ctx=probe.getContext('2d',{willReadFrequently:true});if(!ctx)throw new Error('GA_NEGATIVE_PROOF_2D_CONTEXT_MISSING');
  ctx.clearRect(0,0,width,height);ctx.drawImage(source,0,0,width,height);
  const data=ctx.getImageData(0,0,width,height).data;
  let alphaSum=0,alphaMax=0,nonzero=0,lumaAlpha=0;
  for(let i=0;i<data.length;i+=4){
    const alpha=data[i+3]/255;alphaSum+=alpha;alphaMax=Math.max(alphaMax,alpha);if(alpha>1/255)nonzero++;
    const luma=(.2126*data[i]+.7152*data[i+1]+.0722*data[i+2])/255;lumaAlpha+=luma*alpha;
  }
  const pixels=width*height;
  return freeze({width,height,meanAlpha:alphaSum/pixels,maxAlpha:alphaMax,coverage:nonzero/pixels,meanPremultipliedLuma:lumaAlpha/pixels});
}
function ratio(a,b){return b>1e-8?a/b:(a<=1e-8?0:Infinity);}

async function renderCase(authority,receipt,{caseId,control,latitudeDeg,longitudeDeg,camera}){
  proofControl({caseId,...control});
  await setWitness(receipt,latitudeDeg,longitudeDeg,camera);
  await settle(authority,caseId);
  return freeze({caseId,packet:authority.descriptorPacket(),metric:captureVisualMetric()});
}

async function run(){
  const {authority,receipt}=await waitForAuthority();
  proofControl({caseId:'BASELINE_DISCOVERY'});
  await settle(authority,'BASELINE_DISCOVERY');
  const baselinePacket=authority.descriptorPacket();
  const systems=[...(baselinePacket?.systems||[])];
  const clearRegions=[...(baselinePacket?.clearRegions||[])];
  if(systems.length<5)throw new Error(`GA_NEGATIVE_PROOF_SYSTEM_SET_TOO_SMALL:${systems.length}`);
  if(clearRegions.length<1)throw new Error('GA_NEGATIVE_PROOF_CLEAR_SET_MISSING');

  const a1=[];
  for(const system of systems){
    const baseline=await renderCase(authority,receipt,{caseId:`A1_BASE_${system.id}`,control:{},latitudeDeg:system.latitudeDeg,longitudeDeg:system.longitudeDeg});
    const knockout=await renderCase(authority,receipt,{caseId:`A1_KO_${system.id}`,control:{removeSystemIds:[system.id]},latitudeDeg:system.latitudeDeg,longitudeDeg:system.longitudeDeg});
    const alphaRatio=ratio(knockout.metric.meanAlpha,baseline.metric.meanAlpha),coverageRatio=ratio(knockout.metric.coverage,baseline.metric.coverage);
    a1.push(freeze({systemId:system.id,weatherClass:system.weatherClass,baseline:baseline.metric,knockout:knockout.metric,alphaRatio,coverageRatio,pass:baseline.metric.meanAlpha>.0005&&alphaRatio<=.90}));
  }

  const globalWitnesses=[];
  for(const system of systems){
    const witness=await renderCase(authority,receipt,{caseId:`A2_GLOBAL_KO_${system.id}`,control:{removeAllSystems:true},latitudeDeg:system.latitudeDeg,longitudeDeg:system.longitudeDeg});
    globalWitnesses.push(freeze({systemId:system.id,metric:witness.metric,pass:witness.metric.maxAlpha<=1/255&&witness.metric.coverage===0}));
  }
  const a2=freeze({witnesses:freeze(globalWitnesses),pass:globalWitnesses.every(item=>item.pass)});

  const clear=clearRegions[0];
  const clearTestSystem=systems.find(system=>system.weatherClass==='LOW_CUMULIFORM')||systems[0];
  const clearTransform={[clearTestSystem.id]:{latitudeDeg:clear.latitudeDeg,longitudeDeg:clear.longitudeDeg}};
  const clearDisabled=await renderCase(authority,receipt,{caseId:'A3_CLEAR_DISABLED',control:{removeSystemIds:systems.filter(s=>s.id!==clearTestSystem.id).map(s=>s.id),disableClearRegions:true,systemTransforms:clearTransform},latitudeDeg:clear.latitudeDeg,longitudeDeg:clear.longitudeDeg,distance:1800});
  const clearEnabled=await renderCase(authority,receipt,{caseId:'A3_CLEAR_ENABLED',control:{removeSystemIds:systems.filter(s=>s.id!==clearTestSystem.id).map(s=>s.id),systemTransforms:clearTransform},latitudeDeg:clear.latitudeDeg,longitudeDeg:clear.longitudeDeg,distance:1800});
  const a3Ratio=ratio(clearEnabled.metric.meanAlpha,clearDisabled.metric.meanAlpha);
  const a3=freeze({clearRegionId:clear.id,systemId:clearTestSystem.id,withoutClear:clearDisabled.metric,withClear:clearEnabled.metric,alphaRatio:a3Ratio,pass:clearDisabled.metric.meanAlpha>.0005&&a3Ratio<=.35});

  const motionSystem=systems.find(system=>system.weatherClass==='LOW_CUMULIFORM')||systems[0];
  const movedLon=wrapLon(motionSystem.longitudeDeg+85);
  const original=await renderCase(authority,receipt,{caseId:'A4_ORIGINAL_AT_ORIGIN',control:{removeSystemIds:systems.filter(s=>s.id!==motionSystem.id).map(s=>s.id)},latitudeDeg:motionSystem.latitudeDeg,longitudeDeg:motionSystem.longitudeDeg});
  const movedAtOrigin=await renderCase(authority,receipt,{caseId:'A4_MOVED_AT_ORIGIN',control:{removeSystemIds:systems.filter(s=>s.id!==motionSystem.id).map(s=>s.id),systemTransforms:{[motionSystem.id]:{longitudeDeg:movedLon}}},latitudeDeg:motionSystem.latitudeDeg,longitudeDeg:motionSystem.longitudeDeg});
  const movedAtDestination=await renderCase(authority,receipt,{caseId:'A4_MOVED_AT_DESTINATION',control:{removeSystemIds:systems.filter(s=>s.id!==motionSystem.id).map(s=>s.id),systemTransforms:{[motionSystem.id]:{longitudeDeg:movedLon}}},latitudeDeg:motionSystem.latitudeDeg,longitudeDeg:movedLon});
  const originDrop=ratio(movedAtOrigin.metric.meanAlpha,original.metric.meanAlpha),destinationGain=ratio(movedAtDestination.metric.meanAlpha,movedAtOrigin.metric.meanAlpha);
  const a4=freeze({systemId:motionSystem.id,originalLongitudeDeg:motionSystem.longitudeDeg,movedLongitudeDeg:movedLon,original:original.metric,movedAtOrigin:movedAtOrigin.metric,movedAtDestination:movedAtDestination.metric,originDrop,destinationGain,pass:original.metric.meanAlpha>.0005&&originDrop<=.35&&movedAtDestination.metric.meanAlpha>.0005&&destinationGain>=2});

  const proceduralWitnesses=[];
  for(const seedOffset of [0,.173,.511,.907]){
    const transforms=Object.fromEntries(systems.map(system=>[system.id,{seedOffset}]));
    const witness=await renderCase(authority,receipt,{caseId:`A5_EMPTY_NOISE_${String(seedOffset).replace('.','_')}`,control:{removeAllSystems:true,disableClearRegions:true,systemTransforms:transforms},latitudeDeg:motionSystem.latitudeDeg,longitudeDeg:motionSystem.longitudeDeg});
    proceduralWitnesses.push(freeze({seedOffset,metric:witness.metric,pass:witness.metric.maxAlpha<=1/255&&witness.metric.coverage===0}));
  }
  const a5=freeze({witnesses:freeze(proceduralWitnesses),pass:proceduralWitnesses.every(item=>item.pass)});

  proofControl({caseId:'PROOF_COMPLETE'});
  const result=freeze({
    schema:'AUDRALIA_FAP1_GA_RUNTIME_NEGATIVE_PROOF_v1',
    candidateHead:'c99b20bd81344ef22d23e0d7c3296864e157a38a',
    executedAt:new Date().toISOString(),
    thresholds:freeze({A1KnockoutAlphaRatioMax:.90,A2MaxAlphaMax:1/255,A3ClearAlphaRatioMax:.35,A4OriginAlphaRatioMax:.35,A4DestinationGainMin:2,A5MaxAlphaMax:1/255}),
    A1:freeze({cases:freeze(a1),pass:a1.every(item=>item.pass)}),
    A2:a2,A3:a3,A4:a4,A5:a5,
    pass:a1.every(item=>item.pass)&&a2.pass&&a3.pass&&a4.pass&&a5.pass,
    disposition:'G_A_RUNTIME_NEGATIVE_PROOF_ONLY_NO_G_B_AUTHORITY'
  });
  globalThis.__AUDRALIA_FAP1_GA_NEGATIVE_PROOF__=result;
  document.documentElement.dataset.fap1GANegativeProof=result.pass?'PASS':'FAIL';
  console.info('AUDRALIA_FAP1_GA_NEGATIVE_PROOF',result);
  return result;
}

run().catch(error=>{
  const failure=freeze({schema:'AUDRALIA_FAP1_GA_RUNTIME_NEGATIVE_PROOF_v1',pass:false,error:error instanceof Error?error.message:String(error),executedAt:new Date().toISOString()});
  globalThis.__AUDRALIA_FAP1_GA_NEGATIVE_PROOF__=failure;
  document.documentElement.dataset.fap1GANegativeProof='ERROR';
  console.error('AUDRALIA_FAP1_GA_NEGATIVE_PROOF_FAILED',error);
});
