/** H_EARTH_RUN_8E_R2_CANONICAL_LIVE_RENDER_PACKAGE_v1 */
import {
  getHEarthRun8ER2ImmutableLiveRenderPackage as getRawPackage,
  getHEarthOW01LiveRenderPackageOccurrence as getOW01RawPackage,
  evaluateHEarthRun8ER2ImmutableLiveRenderPackage,
  evaluateHEarthRun8ER2ImmutableLiveRenderPackageAsync,
  adoptHEarthRun8ER2DeferredLiveRenderPackage,
  getHEarthRun8ER2VegetationWorldTruthPlan,
  isHEarthRun8ER2VegetationWorldTruthPrepared,
  createHEarthRun8ER2VegetationPresentationBatch
} from './live-render-package.run8e-r2.js?cb=3b265737a4a96e79';

const GRID_SCALE = 16777216;
const FLOAT_BUFFER_NAMES = Object.freeze([
  'positions',
  'normals',
  'baseColorsLinear',
  'materialParameters'
]);
const HASH_BUFFER_ORDER = Object.freeze([
  'positions',
  'normals',
  'baseColorsLinear',
  'materialParameters',
  'materialModelCodes',
  'surfaceClassCodes',
  'primitiveIndices',
  'roleCodes',
  'indices'
]);

const freezeArray = values => Object.freeze(Array.from(values));
const freezeRecord = value => Object.freeze(value);

function canonicalNumber(value) {
  if (!Number.isFinite(value)) throw new TypeError('R2_CANONICAL_NONFINITE_NUMBER');
  const rounded = Math.round(value * GRID_SCALE) / GRID_SCALE;
  return Object.is(rounded, -0) ? 0 : rounded;
}

function canonicalizeBuffers(buffers) {
  const output = {};
  for (const name of HASH_BUFFER_ORDER) {
    const values = buffers[name];
    output[name] = FLOAT_BUFFER_NAMES.includes(name)
      ? freezeArray(values.map(canonicalNumber))
      : freezeArray(values);
  }
  return freezeRecord(output);
}

function createHashWriter() {
  let hash = 0x811c9dc5;
  const numberBuffer = new ArrayBuffer(8);
  const numberView = new DataView(numberBuffer);
  const encoder = new TextEncoder();
  const byte = value => {
    hash ^= value & 0xff;
    hash = Math.imul(hash, 0x01000193) >>> 0;
  };
  return {
    string(value) {
      for (const item of encoder.encode(String(value))) byte(item);
      byte(0xff);
    },
    number(value) {
      numberView.setFloat64(0, value, true);
      for (let index = 0; index < 8; index += 1) byte(numberView.getUint8(index));
    },
    numbers(values) {
      for (const value of values) this.number(value);
      byte(0xfe);
    },
    digest() {
      return hash.toString(16).padStart(8, '0');
    }
  };
}

function buildCanonicalPackage(raw = getRawPackage()) {
  if (raw?.eligible !== true) return raw;

  const buffers = canonicalizeBuffers(raw.buffers);
  const hash = createHashWriter();
  hash.string(raw.sourceAuthorities.run8ER2ContractId);
  hash.string(raw.sourceAuthorities.packet002TransferContractId);
  hash.string(raw.sourceAuthorities.run8CMaterialContractId);
  hash.string(raw.sourceAuthorities.atmosphereContractId);
  for (const primitiveId of raw.primitiveIds) hash.string(primitiveId);
  for (const name of HASH_BUFFER_ORDER) hash.numbers(buffers[name]);

  const digest = hash.digest();
  const packageRecord = freezeRecord({
    ...raw,
    packageIdentity: `H_EARTH_RUN_8E_R2_LIVE_RENDER_PACKAGE_${digest.toUpperCase()}`,
    contentDigest: `fnv1a32:${digest}`,
    revision: 2,
    buffers,
    sourceAuthorities: freezeRecord({
      ...raw.sourceAuthorities,
      numericIdentityBoundary: 'SHARED_COMPLETE_PACKAGE_BUFFER_BOUNDARY',
      numericCanonicalizationLaw: 'ROUND_TO_BINARY_GRID_2^-24_AND_NORMALIZE_NEGATIVE_ZERO',
      canonicalizedFloatBuffers: FLOAT_BUFFER_NAMES
    })
  });

  const evaluation = evaluateHEarthRun8ER2ImmutableLiveRenderPackage(packageRecord);
  if (evaluation.eligible !== true) {
    return freezeRecord({
      eligible: false,
      status: 'RUN_8E_R2_CANONICAL_LIVE_RENDER_PACKAGE_REJECTED',
      contractId: raw.contractId,
      issues: evaluation.issues
    });
  }
  return packageRecord;
}

let cachedPackage = null;
let cachedDeferredPackage = null;
let cachedOW01Package = null;

export function getHEarthRun8ER2CanonicalLiveRenderPackage({deferVegetation=false}={}) {
  if(deferVegetation)return cachedDeferredPackage??=buildCanonicalPackage(getRawPackage({deferVegetation:true}));
  if (!cachedPackage) cachedPackage = buildCanonicalPackage();
  return cachedPackage;
}

export function getHEarthOW01CanonicalLiveRenderPackageOccurrence() {
  if (!cachedOW01Package) cachedOW01Package = buildCanonicalPackage(getOW01RawPackage());
  return cachedOW01Package;
}

export function getHEarthRun8ER2CanonicalVegetationPresentationPlan({deferVegetation=false}={}){if(deferVegetation&&!isHEarthRun8ER2VegetationWorldTruthPrepared())return freezeRecord({eligible:false,status:'PENDING_POST_READY_VALIDATION',instanceCount:null,batches:[],populationLimit:null,droppedPlacementCount:null});const truth=getHEarthRun8ER2VegetationWorldTruthPlan();return freezeRecord({...truth,batches:Object.freeze(truth.batches.map(batch=>freezeRecord({...batch}))),numericIdentityBoundary:'CANONICAL_PLACEMENT_TRUTH_WITH_BOUNDED_PRESENTATION_BATCHES'});}
export function createHEarthRun8ER2CanonicalVegetationPresentationBatch(batchId){const batch=createHEarthRun8ER2VegetationPresentationBatch(batchId);return freezeRecord({...batch,placementIds:Object.freeze(Array.from(batch.placementIds??[])),primitives:Object.freeze(Array.from(batch.primitives??[]))});}
export default getHEarthRun8ER2CanonicalLiveRenderPackage;

// Preparation timing is opt-in diagnostic metadata, outside world identity.
const startupWorkerMode=new URL(import.meta.url).searchParams.get('hearthCanonicalPreparation')==='1';
const preparationPerformanceEnabled=startupWorkerMode
  ?new URL(import.meta.url).searchParams.get('hearthCanonicalTiming')==='1'
  :new URLSearchParams(globalThis.location?.search??'').get('performance')==='1';
const preparationNow=()=>globalThis.performance?.now?.()??null;
const preparationTimeOrigin=()=>Number.isFinite(globalThis.performance?.timeOrigin)?globalThis.performance.timeOrigin:null;
const durationBetween=(start,end)=>Number.isFinite(start)&&Number.isFinite(end)?end-start:null;
if(startupWorkerMode&&typeof document==='undefined'&&typeof globalThis.postMessage==='function'){
  const timing=preparationPerformanceEnabled?{schema:'H_EARTH_CANONICAL_PREPARATION_TIMING_v1',version:1,sourceModuleUrl:import.meta.url,clock:'performance.now',timeOrigin:preparationTimeOrigin(),status:'MODULE_READY',rawBuildDurationMs:null,canonicalBuildDurationMs:null,resultPostStartAtMs:null}:null;
  globalThis.onmessage=()=>{
    try{
      const rawStart=timing?preparationNow():null;let raw;
      try{raw=getRawPackage({deferVegetation:true});}finally{if(timing)timing.rawBuildDurationMs=durationBetween(rawStart,preparationNow());}
      globalThis.postMessage({phase:'RAW_PACKAGE_COMPLETE'});
      const canonicalStart=timing?preparationNow():null;let canonical;
      try{canonical=getHEarthRun8ER2CanonicalLiveRenderPackage({deferVegetation:true});}finally{if(timing)timing.canonicalBuildDurationMs=durationBetween(canonicalStart,preparationNow());}
      if(timing){timing.status='RESULT_POSTING';timing.resultPostStartAtMs=preparationNow();}
      globalThis.postMessage({phase:'CANONICAL_PACKAGE_COMPLETE',raw,canonical,...(timing?{timing}: {})});
    }catch(error){if(timing){timing.status='FAILED';timing.resultPostStartAtMs=preparationNow();}globalThis.postMessage({error:{message:error?.message??String(error)},...(timing?{timing}: {})});}
  };
  globalThis.postMessage({phase:'CANONICAL_WORKER_MODULE_READY',...(timing?{timing}: {})});
}
let pendingDeferredPreparation=null;
const canonicalPreparationTiming=preparationPerformanceEnabled&&!startupWorkerMode?{schema:'H_EARTH_CANONICAL_PREPARATION_TIMING_v1',version:1,sourceModuleUrl:import.meta.url,status:'NOT_STARTED',branch:null,main:{clock:'performance.now',timeOrigin:preparationTimeOrigin(),receiveAtMs:null,stages:{}},worker:null,normalizedHandoffDurationMs:null,handoffScope:'SERIALIZATION_DESERIALIZATION_DELIVERY_AND_MAIN_THREAD_SCHEDULING_NOT_PURE_CLONE',failure:null}:null;
export function getHEarthRun8ER2CanonicalPreparationTiming(){
  if(!canonicalPreparationTiming)return null;
  const snapshot=JSON.parse(JSON.stringify(canonicalPreparationTiming));
  const freeze=node=>{if(!node||typeof node!=='object')return;for(const child of Object.values(node))freeze(child);Object.freeze(node);};freeze(snapshot);return snapshot;
}
async function measurePreparationStage(name,operation){
  if(!canonicalPreparationTiming)return await operation();
  const stage=canonicalPreparationTiming.main.stages[name]={status:'RUNNING',startAtMs:preparationNow(),endAtMs:null,durationMs:null};
  try{const diagnostics=globalThis.H_EARTH_RENDERER_STARTUP_DIAGNOSTICS;const result=await(diagnostics?.measureAsync?diagnostics.measureAsync(name,operation):operation());stage.status='PASS';return result;}
  catch(error){stage.status='FAIL';throw error;}
  finally{stage.endAtMs=preparationNow();stage.durationMs=durationBetween(stage.startAtMs,stage.endAtMs);}
}
async function freezeStartupRecords(value){
  const bufferArrays=new WeakSet([...Object.values(value.raw.buffers),...Object.values(value.canonical.buffers)]);
  const seen=new WeakSet(),stack=[value];let count=0,budgetStart=globalThis.performance?.now?.()??Date.now();
  while(stack.length){const node=stack.pop();if(!node||typeof node!=='object'||seen.has(node))continue;seen.add(node);
    if(bufferArrays.has(node))Object.freeze(node);
    else{for(const child of Object.values(node))if(child&&typeof child==='object')stack.push(child);Object.freeze(node);}
    if(++count%64===0&&((globalThis.performance?.now?.()??Date.now())-budgetStart>=8)){
      await new Promise(resolve=>setTimeout(resolve,0));budgetStart=globalThis.performance?.now?.()??Date.now();
    }
  }
}
export function prepareHEarthRun8ER2CanonicalLiveRenderPackage({deferVegetation=false,onProgress=()=>{}}={}){
  if(!deferVegetation)return Promise.resolve(getHEarthRun8ER2CanonicalLiveRenderPackage());
  if(cachedDeferredPackage)return Promise.resolve(cachedDeferredPackage);
  if(pendingDeferredPreparation)return pendingDeferredPreparation;
  if(typeof Worker!=='function'){
    if(canonicalPreparationTiming){canonicalPreparationTiming.branch='SYNCHRONOUS_BASELINE_FALLBACK';canonicalPreparationTiming.status='FALLBACK';}
    try{onProgress({phase:'SYNCHRONOUS_BASELINE_FALLBACK',completed:0,total:1,unit:'packages'});
      return pendingDeferredPreparation=Promise.resolve(getHEarthRun8ER2CanonicalLiveRenderPackage({deferVegetation:true}));
    }catch(error){if(canonicalPreparationTiming){canonicalPreparationTiming.status='FAILED';canonicalPreparationTiming.failure={name:error?.name??'Error',message:error?.message??String(error)};}return pendingDeferredPreparation=Promise.reject(error);}
  }
  if(canonicalPreparationTiming){canonicalPreparationTiming.branch='MODULE_WORKER';canonicalPreparationTiming.status='PREPARING';}
  pendingDeferredPreparation=new Promise((resolve,reject)=>{
    let worker=null,receiving=false,settled=false,stage='MODULE';
    let moduleResolve,moduleReject,resultResolve,resultReject,resultWait=null;
    const modulePromise=new Promise((resolve,reject)=>{moduleResolve=resolve;moduleReject=reject;});
    const resultPromise=new Promise((resolve,reject)=>{resultResolve=resolve;resultReject=reject;});
    // Both lifecycle gates may fail before their awaited stage starts.
    resultPromise.catch(()=>{});
    const moduleWait=measurePreparationStage('CANONICAL_WORKER_MODULE_READY_WAIT',()=>modulePromise);moduleWait.catch(()=>{});
    const receiveTiming=data=>{
      if(!canonicalPreparationTiming)return;
      const receiveAtMs=preparationNow();canonicalPreparationTiming.main.receiveAtMs=receiveAtMs;
      if(data?.timing)canonicalPreparationTiming.worker=data.timing;
      const remote=canonicalPreparationTiming.worker;
      const elapsed=Number.isFinite(remote?.timeOrigin)&&Number.isFinite(remote?.resultPostStartAtMs)&&Number.isFinite(receiveAtMs)&&Number.isFinite(canonicalPreparationTiming.main.timeOrigin)
        ?canonicalPreparationTiming.main.timeOrigin+receiveAtMs-(remote.timeOrigin+remote.resultPostStartAtMs):null;
      canonicalPreparationTiming.normalizedHandoffDurationMs=Number.isFinite(elapsed)&&elapsed>=0?elapsed:null;
    };
    const fail=error=>{if(settled)return;settled=true;if(canonicalPreparationTiming){canonicalPreparationTiming.status='FAILED';canonicalPreparationTiming.failure={name:error?.name??'Error',message:error?.message??String(error)};}moduleReject(error);resultReject(error);worker?.terminate();reject(error);};
    try{
      const url=new URL(import.meta.url);url.searchParams.set('hearthCanonicalPreparation','1');if(preparationPerformanceEnabled)url.searchParams.set('hearthCanonicalTiming','1');worker=new Worker(url,{type:'module'});
      worker.onerror=event=>fail(new Error(event.message||'R2_CANONICAL_WORKER_FAILED'));
      worker.onmessageerror=()=>fail(new Error('R2_CANONICAL_WORKER_MESSAGE_INVALID'));
      worker.onmessage=async event=>{
        if(settled)return;
        const data=event.data;
        try{
          if(data?.error){receiveTiming(data);throw new Error(data.error.message||'R2_CANONICAL_WORKER_FAILED');}
          if(data?.phase==='CANONICAL_WORKER_MODULE_READY'&&stage==='MODULE'){
            if(canonicalPreparationTiming&&data.timing)canonicalPreparationTiming.worker=data.timing;
            stage='RAW';moduleResolve(data);resultWait=measurePreparationStage('CANONICAL_WORKER_RESULT_WAIT',()=>resultPromise);resultWait.catch(()=>{});return;
          }
          if(data?.phase==='RAW_PACKAGE_COMPLETE'&&!receiving&&stage==='RAW'){stage='CANONICAL';onProgress({phase:data.phase,completed:1,total:1,unit:'packages'});return;}
          if(receiving||stage!=='CANONICAL'||data?.phase!=='CANONICAL_PACKAGE_COMPLETE'||!data.raw||!data.canonical)throw new Error('R2_CANONICAL_WORKER_RESULT_INVALID');
          receiving=true;receiveTiming(data);resultResolve(data);await moduleWait;await resultWait;
          onProgress({phase:data.phase,completed:1,total:1,unit:'packages'});
          await measurePreparationStage('CANONICAL_MAIN_FREEZE',()=>freezeStartupRecords(data));if(settled)return;
          await measurePreparationStage('CANONICAL_RAW_ADOPTION_VALIDATE',()=>adoptHEarthRun8ER2DeferredLiveRenderPackage(data.raw,{onProgress}));if(settled)return;
          await measurePreparationStage('CANONICAL_MAIN_VALIDATE',async()=>{
            const evaluation=await evaluateHEarthRun8ER2ImmutableLiveRenderPackageAsync(data.canonical,{onProgress});
          if(!evaluation.eligible)throw new Error(`R2_CANONICAL_WORKER_PACKAGE_INVALID:${evaluation.issues.join(',')}`);
          if(data.canonical.packageOccurrenceId!==data.raw.packageOccurrenceId||['vertexCount','indexCount','primitiveCount','triangleCount'].some(key=>data.canonical[key]!==data.raw[key])||data.canonical.primitiveIds.length!==data.raw.primitiveIds.length||data.canonical.primitiveIds.some((id,index)=>id!==data.raw.primitiveIds[index])||!/^fnv1a32:[a-f0-9]{8}$/.test(data.canonical.contentDigest)||data.canonical.packageIdentity!==`H_EARTH_RUN_8E_R2_LIVE_RENDER_PACKAGE_${data.canonical.contentDigest.slice(8).toUpperCase()}`||data.canonical.revision!==2||data.canonical.sourceAuthorities?.numericCanonicalizationLaw!=='ROUND_TO_BINARY_GRID_2^-24_AND_NORMALIZE_NEGATIVE_ZERO')throw new Error('R2_CANONICAL_WORKER_IDENTITY_INVALID');
            return evaluation;
          });
          if(settled)return;
          onProgress({phase:'CANONICAL_PACKAGE_READY',completed:1,total:1,unit:'packages'});cachedDeferredPackage=data.canonical;if(canonicalPreparationTiming)canonicalPreparationTiming.status='READY';settled=true;worker.terminate();resolve(cachedDeferredPackage);
        }catch(error){fail(error);}
      };
      onProgress({phase:'RAW_PACKAGE_PREPARING',completed:0,total:1,unit:'packages'});worker.postMessage({prepare:true,performanceEnabled:preparationPerformanceEnabled});
    }catch(error){fail(error);}
  });
  return pendingDeferredPreparation;
}
