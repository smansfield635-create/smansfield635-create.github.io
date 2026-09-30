const AUDIT_SCHEMA='AUDRALIA_FINAL_FRAME_ORBITAL_CLOUD_COVERAGE_AUDIT_v2';
const PLANET_RADIUS=6200;
const HALF_PI=Math.PI*.5;
const ARC=PLANET_RADIUS*HALF_PI;
const SQRT2=Math.SQRT2;
const SAMPLE_STATES=Object.freeze([
  Object.freeze({id:'CENTER',targetU:0,targetV:0}),
  Object.freeze({id:'EAST_90',targetU:ARC,targetV:0}),
  Object.freeze({id:'WEST_90',targetU:-ARC,targetV:0}),
  Object.freeze({id:'NORTH_90',targetU:0,targetV:ARC}),
  Object.freeze({id:'SOUTH_90',targetU:0,targetV:-ARC}),
  Object.freeze({id:'NE_90',targetU:ARC/SQRT2,targetV:ARC/SQRT2}),
  Object.freeze({id:'NW_90',targetU:-ARC/SQRT2,targetV:ARC/SQRT2}),
  Object.freeze({id:'SE_90',targetU:ARC/SQRT2,targetV:-ARC/SQRT2}),
  Object.freeze({id:'SW_90',targetU:-ARC/SQRT2,targetV:-ARC/SQRT2})
]);
const FINAL_NONZERO_FLOOR=.70;
const FINAL_VISIBLE_FLOOR=.42;
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));

async function waitForRuntime(timeoutMs=12000){
  const start=performance.now();
  while(performance.now()-start<timeoutMs){
    const receipt=globalThis.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION__;
    if(receipt?.setCameraStateForTest&&receipt?.fap1CandidateA?.getEvidence&&receipt?.exterior?.overlay&&globalThis.__AUDRALIA_FINAL_FRAME_CLOUD_READBACK_PROBE__)return receipt;
    await wait(50);
  }
  throw new Error('ORBITAL_COVERAGE_AUDIT_RUNTIME_TIMEOUT');
}

function readCapturedCoverage(overlay){
  const coverage=overlay.__AUDRALIA_LAST_DRAW_COVERAGE__;
  if(!coverage)throw new Error('ORBITAL_COVERAGE_AUDIT_NO_POST_DRAW_CAPTURE');
  const cssOpacity=Number.parseFloat(getComputedStyle(overlay).opacity||'1');
  return Object.freeze({
    ...coverage,
    cssOpacity,
    effectiveVisibleFraction:coverage.visibleFraction*cssOpacity
  });
}

function publish(result){
  document.documentElement.dataset.cloudCoverageAudit=result.pass?'PASS':'FAIL';
  document.documentElement.dataset.cloudCoverageAuditMinimumNonzero=result.minimumNonzero.toFixed(4);
  document.documentElement.dataset.cloudCoverageAuditMinimumVisible=result.minimumVisible.toFixed(4);
  document.documentElement.dataset.cloudCoverageAuditMinimumEffectiveVisible=result.minimumEffectiveVisible.toFixed(4);
  globalThis.__AUDRALIA_FINAL_FRAME_ORBITAL_CLOUD_COVERAGE_AUDIT__=result;
}

async function runAudit(){
  const receipt=await waitForRuntime();
  const original=receipt.renderer.getSnapshot();
  const samples=[];
  globalThis.__AUDRALIA_COVERAGE_AUDIT_ACTIVE__=true;
  try{
    for(const state of SAMPLE_STATES){
      receipt.exterior.overlay.__AUDRALIA_LAST_DRAW_COVERAGE__=null;
      receipt.setCameraStateForTest({
        targetU:state.targetU,
        targetV:state.targetV,
        distance:5000,
        pitch:1.02,
        yaw:-.62
      });
      const coverage=readCapturedCoverage(receipt.exterior.overlay);
      const fap1Evidence=receipt.fap1CandidateA.getEvidence();
      samples.push(Object.freeze({
        id:state.id,
        ...coverage,
        effectiveExteriorOpacity:fap1Evidence.effectiveExteriorOpacity,
        orbitalBlend:fap1Evidence.orbitalBlend
      }));
      await new Promise(resolve=>requestAnimationFrame(resolve));
    }
  }finally{
    receipt.setCameraStateForTest({
      targetU:original.targetU,targetV:original.targetV,distance:original.distance,
      pitch:original.pitch,yaw:original.yaw
    });
    globalThis.__AUDRALIA_COVERAGE_AUDIT_ACTIVE__=false;
  }
  const minimumNonzero=Math.min(...samples.map(x=>x.nonzeroFraction));
  const minimumVisible=Math.min(...samples.map(x=>x.visibleFraction));
  const minimumEffectiveVisible=Math.min(...samples.map(x=>x.effectiveVisibleFraction));
  const opacityAuthorityPass=samples.every(x=>x.effectiveExteriorOpacity>=.995&&x.orbitalBlend>=.995);
  const pass=minimumNonzero>=FINAL_NONZERO_FLOOR&&minimumVisible>=FINAL_VISIBLE_FLOOR&&opacityAuthorityPass;
  const result=Object.freeze({
    schema:AUDIT_SCHEMA,
    pass,
    target:Object.freeze({nonzeroFraction:FINAL_NONZERO_FLOOR,visibleFraction:FINAL_VISIBLE_FLOOR}),
    minimumNonzero,minimumVisible,minimumEffectiveVisible,opacityAuthorityPass,
    samples:Object.freeze(samples)
  });
  publish(result);
  if(!pass)console.error('AUDRALIA_ORBITAL_CLOUD_COVERAGE_AUDIT_FAIL',result);
  else console.info('AUDRALIA_ORBITAL_CLOUD_COVERAGE_AUDIT_PASS',result);
}

runAudit().catch(error=>{
  globalThis.__AUDRALIA_COVERAGE_AUDIT_ACTIVE__=false;
  const result=Object.freeze({schema:AUDIT_SCHEMA,pass:false,error:error instanceof Error?error.message:String(error),minimumNonzero:0,minimumVisible:0,minimumEffectiveVisible:0,opacityAuthorityPass:false,samples:Object.freeze([])});
  publish(result);
  console.error('AUDRALIA_ORBITAL_CLOUD_COVERAGE_AUDIT_ERROR',error);
});
