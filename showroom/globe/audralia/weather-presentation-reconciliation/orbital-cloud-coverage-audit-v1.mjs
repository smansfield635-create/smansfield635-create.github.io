const AUDIT_SCHEMA='AUDRALIA_FINAL_FRAME_ORBITAL_CLOUD_COVERAGE_AUDIT_v1';
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
const ALPHA_NONZERO=8;
const ALPHA_VISIBLE=32;
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));

async function waitForRuntime(timeoutMs=12000){
  const start=performance.now();
  while(performance.now()-start<timeoutMs){
    const receipt=globalThis.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION__;
    if(receipt?.setCameraStateForTest&&receipt?.fap1CandidateA?.getEvidence&&receipt?.exterior?.overlay)return receipt;
    await wait(50);
  }
  throw new Error('ORBITAL_COVERAGE_AUDIT_RUNTIME_TIMEOUT');
}

function readAlphaCoverage(overlay){
  const gl=overlay.getContext('webgl2');
  if(!gl)throw new Error('ORBITAL_COVERAGE_AUDIT_WEBGL2_UNAVAILABLE');
  const width=overlay.width,height=overlay.height;
  if(!(width>0&&height>0))throw new Error('ORBITAL_COVERAGE_AUDIT_EMPTY_BUFFER');
  const pixels=new Uint8Array(width*height*4);
  gl.finish();
  gl.readPixels(0,0,width,height,gl.RGBA,gl.UNSIGNED_BYTE,pixels);
  let nonzero=0,visible=0,alphaSum=0;
  const count=width*height;
  for(let i=3;i<pixels.length;i+=4){
    const a=pixels[i];
    alphaSum+=a;
    if(a>=ALPHA_NONZERO)nonzero++;
    if(a>=ALPHA_VISIBLE)visible++;
  }
  const cssOpacity=Number.parseFloat(getComputedStyle(overlay).opacity||'1');
  return Object.freeze({
    width,height,count,cssOpacity,
    nonzeroFraction:nonzero/count,
    visibleFraction:visible/count,
    meanAlpha:alphaSum/(count*255),
    effectiveVisibleFraction:(visible/count)*cssOpacity
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
  try{
    for(const state of SAMPLE_STATES){
      receipt.setCameraStateForTest({
        targetU:state.targetU,
        targetV:state.targetV,
        distance:5000,
        pitch:1.02,
        yaw:-.62
      });
      await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
      const coverage=readAlphaCoverage(receipt.exterior.overlay);
      const fap1Evidence=receipt.fap1CandidateA.getEvidence();
      samples.push(Object.freeze({
        id:state.id,
        ...coverage,
        effectiveExteriorOpacity:fap1Evidence.effectiveExteriorOpacity,
        orbitalBlend:fap1Evidence.orbitalBlend
      }));
    }
  }finally{
    receipt.setCameraStateForTest({
      targetU:original.targetU,targetV:original.targetV,distance:original.distance,
      pitch:original.pitch,yaw:original.yaw
    });
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
  const result=Object.freeze({schema:AUDIT_SCHEMA,pass:false,error:error instanceof Error?error.message:String(error),minimumNonzero:0,minimumVisible:0,minimumEffectiveVisible:0,opacityAuthorityPass:false,samples:Object.freeze([])});
  publish(result);
  console.error('AUDRALIA_ORBITAL_CLOUD_COVERAGE_AUDIT_ERROR',error);
});
