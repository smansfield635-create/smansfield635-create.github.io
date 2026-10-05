import assert from 'node:assert/strict';
import {Worker as ThreadWorker} from 'node:worker_threads';
import {readFileSync,writeFileSync,mkdtempSync,mkdirSync,rmSync} from 'node:fs';
import {resolve,dirname,posix} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {execFileSync} from 'node:child_process';
import {tmpdir} from 'node:os';
import vm from 'node:vm';
import {createHash} from 'node:crypto';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'../../../../..');
if(process.argv.includes('--observer-timing-only')){
 const observer=readFileSync(resolve(root,'showroom/globe/h-earth/diagnostic/renderer-startup-observer.v1.js'),'utf8');
 const measure=observer.slice(observer.indexOf('const measureAsync=async'),observer.indexOf('const getMilestoneTiming='));
 const context={performance,state:{timing:{spans:{}}}};vm.createContext(context);vm.runInContext(measure+'\nthis.measure=measureAsync;',context);
 for(const reason of ['eligibility','identity']){
  const name='CANONICAL_MAIN_VALIDATE_'+reason;await assert.rejects(context.measure(name,async()=>{throw new Error(reason);}));assert.equal(context.state.timing.spans[name].count,1);assert.equal(context.state.timing.spans[name].failedCount,1);
 }
 console.log(JSON.stringify({result:'PASS',scope:'UNCHANGED_OBSERVER_ASYNC_FAILURE_COUNTER',phaseFailures:['eligibility','identity'],failedCount:1}));process.exit(0);
}
const baselineHead='935e756e725f8c205921437fbace9faef45c28eb';
const baselineRoot=process.env.H_EARTH_STARTUP_BASELINE_ROOT??mkdtempSync(resolve(tmpdir(),'h-earth-startup-baseline-'));
const ownedTemporaryBaseline=!process.env.H_EARTH_STARTUP_BASELINE_ROOT;
if(ownedTemporaryBaseline)process.on('exit',()=>rmSync(baselineRoot,{recursive:true,force:true}));
const queue=['showroom/globe/h-earth/render/live-render-package.run8e-r2.canonical.js'],seenSources=new Set();
while(queue.length){const path=queue.pop();if(seenSources.has(path))continue;seenSources.add(path);
 const accepted=execFileSync('git',['show',baselineHead+':'+path],{cwd:root,encoding:'utf8'}),destination=resolve(baselineRoot,path);
 if(ownedTemporaryBaseline){mkdirSync(dirname(destination),{recursive:true});writeFileSync(destination,accepted);}
 else assert.equal(readFileSync(destination,'utf8'),accepted,'Frozen baseline source: '+path);
 for(const match of accepted.matchAll(/(?:\bfrom\s*|\bimport\s*\(\s*|\bimport\s*)['"]([^'"]+)['"]/g)){
  const specifier=match[1].split('?')[0].split('#')[0];assert.ok(specifier.startsWith('.'),'Only relative baseline CPU modules expected');queue.push(posix.normalize(posix.join(posix.dirname(path),specifier)));
 }
}
if(ownedTemporaryBaseline)writeFileSync(resolve(baselineRoot,'package.json'),'{"type":"module"}\n');
const rel='showroom/globe/h-earth/render/';
const canonicalName='live-render-package.run8e-r2.canonical.js',rawName='live-render-package.run8e-r2.js';
const candidateUrl=pathToFileURL(resolve(root,rel,canonicalName));
const rawURLFrom=base=>{const code=readFileSync(fileURLToPath(base),'utf8'),specifier=code.match(/from '([^']*live-render-package\.run8e-r2\.js\?[^']+)'/)[1];return new URL(specifier,base);};
const baselineUrl=pathToFileURL(resolve(baselineRoot,rel,canonicalName));
const baselineModule=await import(baselineUrl.href),baselineRawModule=await import(rawURLFrom(baselineUrl).href);
const baseline=baselineModule.getHEarthRun8ER2CanonicalLiveRenderPackage({deferVegetation:true});
const baselineRaw=baselineRawModule.getHEarthRun8ER2ImmutableLiveRenderPackage({deferVegetation:true});
assert.equal(baseline.eligible,true);

const runtimePaths=['render/live-render-package.run8e-r2.js','render/live-render-package.run8e-r2.canonical.js','render/gpu-upload-views.run8e-r2d.js','render/live-renderer-contract.run8e-r3a.js','render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js','diagnostic/run8e-r3d/live-gpu-binding.js','functional-landscape/public-live-gpu-integration.run8e-r3e.js','functional-landscape/public-live-gpu-integration.run8e-r3e.receipt.js','index.html'];
const sourceDigests=Object.fromEntries(runtimePaths.map(path=>{const relative='showroom/globe/h-earth/'+path;return [relative,createHash('sha256').update(readFileSync(resolve(root,relative))).digest('hex')];}));
for(const [source,digest] of Object.entries(sourceDigests)){
 const name=source.split('/').at(-1);
 for(const consumer of Object.keys(sourceDigests)){
  const text=readFileSync(resolve(root,consumer),'utf8');
  const escaped=name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  for(const match of text.matchAll(new RegExp(escaped+'\\?[^\\s\'\"]*?\\bcb=([a-f0-9]{16})','g')))assert.equal(match[1],digest.slice(0,16),'Cache link '+consumer+' -> '+source);
 }
}

// Run the actual binding selection/hook with its selected import held unresolved.
const bindingSource=readFileSync(resolve(root,'showroom/globe/h-earth/diagnostic/run8e-r3d/live-gpu-binding.js'),'utf8');
const bindingPrefix=bindingSource.slice(0,bindingSource.indexOf('const { createHEarthRun8ER3CPersistentRenderer }')).replace(/^import .*;\n/gm,'').replace('()=>import(selectedRendererPath)','()=>holdRendererImport(selectedRendererPath)');
for(const [search,route,hasWorker,expected] of [['?visual=terrain-relief-v2&performance=1',true,true,1],['?visual=terrain-relief-v2',true,true,1],['?visual=terrain-relief-v2&renderer-custody=v1',true,true,0],['?visual=terrain-relief-v2&water-attribution=v1',true,true,0],['?visual=terrain-relief-v2',false,true,0],['?visual=terrain-relief-v2',true,false,0],['',true,true,0]]){
 let started=0,importStarted=false,importSpanCount=0,releaseImport;const held=new Promise(resolve=>releaseImport=resolve);
 const context={H_EARTH_RENDERER_STARTUP_DIAGNOSTICS:{measureAsync:(name,operation)=>{assert.equal(name,'SELECTED_RENDERER_MODULE_IMPORT');importSpanCount++;return operation();}},URLSearchParams,location:{search},document:{getElementById:()=>route?{getAttribute:()=> 'functional-landscape'}:null},Worker:hasWorker?function(){}:undefined,prepareHEarthRun8ER2CanonicalLiveRenderPackage:options=>{assert.equal(options.deferVegetation,true);assert.equal(importStarted,false);started++;return Promise.resolve();},holdRendererImport:()=>{importStarted=true;return held;}};
 vm.createContext(context);const evaluation=vm.runInContext('(async()=>{'+bindingPrefix+'})()',context);assert.equal(started,expected);assert.equal(importStarted,true);assert.equal(importSpanCount,search.includes('performance=1')?1:0);releaseImport({});await evaluation;
}

let workerCount=0,requestCount=0,terminated=0,receivedRaw=null,receivedCanonical=null,interval=null;
class BrowserWorkerOnNode{
 constructor(url){workerCount++;
  const bootstrap=`import {parentPort} from 'node:worker_threads';let ready=false,pending=[];globalThis.postMessage=data=>parentPort.postMessage(data);parentPort.on('message',data=>ready?globalThis.onmessage?.({data}):pending.push(data));await import(${JSON.stringify(url.href)});ready=true;for(const data of pending)globalThis.onmessage?.({data});`;
  this.thread=new ThreadWorker(new URL('data:text/javascript,'+encodeURIComponent(bootstrap)),{type:'module'});
  this.thread.on('message',data=>{if(data.phase==='CANONICAL_PACKAGE_COMPLETE'){receivedRaw=data.raw;receivedCanonical=data.canonical;}this.onmessage?.({data});});this.thread.on('error',error=>this.onerror?.({message:error.message}));
 }
 postMessage(data){requestCount++;this.thread.postMessage(data);}
 terminate(){terminated++;this.thread.terminate();}
}
const nativeWorker=globalThis.Worker,originalLocation=globalThis.location,originalDiagnostics=globalThis.H_EARTH_RENDERER_STARTUP_DIAGNOSTICS;
globalThis.location={search:'?performance=1'};
const observedSpans=[];globalThis.H_EARTH_RENDERER_STARTUP_DIAGNOSTICS={measureAsync:async(name,operation)=>{const entry={name,status:'RUNNING'};observedSpans.push(entry);try{const result=await operation();entry.status='PASS';return result;}catch(error){entry.status='FAIL';throw error;}}};
try{
 // Failure paths must retain their rejected pending promise and cannot retry on main.
 for(const kind of ['constructor','error','messageerror','malformed']){
  let attempts=0;
  globalThis.Worker=class{constructor(){attempts++;if(kind==='constructor')throw new Error('test-constructor');}terminate(){}postMessage(){queueMicrotask(()=>{this.onmessage({data:{phase:'CANONICAL_WORKER_MODULE_READY'}});kind==='error'?this.onerror({message:'test-error'}):kind==='messageerror'?this.onmessageerror():this.onmessage({data:{phase:'unexpected'}});});}};
  const module=await import(candidateUrl.href+'?failure='+kind);const promise=module.prepareHEarthRun8ER2CanonicalLiveRenderPackage({deferVegetation:true});
  assert.equal(module.prepareHEarthRun8ER2CanonicalLiveRenderPackage({deferVegetation:true}),promise);await assert.rejects(promise);assert.equal(module.prepareHEarthRun8ER2CanonicalLiveRenderPackage({deferVegetation:true,onProgress:()=>{}}),promise);await assert.rejects(promise);assert.equal(attempts,1);const failureTiming=module.getHEarthRun8ER2CanonicalPreparationTiming();assert.equal(failureTiming.status,'FAILED');assert.equal(failureTiming.branch,'MODULE_WORKER');assert.ok(failureTiming.failure.message);assert.equal(failureTiming.normalizedHandoffDurationMs,null);
 }
 // Replay exceptions reject only the joining caller; live publication exceptions
 // reject the authoritative owner and retain its sticky failure.
 let progressWorker,progressAttempts=0;
 globalThis.Worker=class{constructor(){progressWorker=this;progressAttempts++;}terminate(){}postMessage(){}};
 const progressModule=await import(candidateUrl.href+'?progressExceptions=1');
 const progressOwner=progressModule.prepareHEarthRun8ER2CanonicalLiveRenderPackage({deferVegetation:true});progressOwner.catch(()=>{});
 await assert.rejects(progressModule.prepareHEarthRun8ER2CanonicalLiveRenderPackage({deferVegetation:true,onProgress:()=>{throw new Error('replay');}}),/replay/);
 assert.equal(progressModule.prepareHEarthRun8ER2CanonicalLiveRenderPackage({deferVegetation:true}),progressOwner);
 let publications=0;assert.equal(progressModule.prepareHEarthRun8ER2CanonicalLiveRenderPackage({deferVegetation:true,onProgress:()=>{if(++publications>1)throw new Error('publication');}}),progressOwner);
 await progressWorker.onmessage({data:{phase:'CANONICAL_WORKER_MODULE_READY'}});await progressWorker.onmessage({data:{phase:'RAW_PACKAGE_COMPLETE'}});
 await assert.rejects(progressOwner,/publication/);assert.equal(progressModule.prepareHEarthRun8ER2CanonicalLiveRenderPackage({deferVegetation:true,onProgress:()=>{}}),progressOwner);assert.equal(progressAttempts,1);
 globalThis.Worker=BrowserWorkerOnNode;
 const candidateModule=await import(candidateUrl.href),candidateRawModule=await import(rawURLFrom(candidateUrl).href);
 const phases=[],start=performance.now();let timerTicks=0;interval=setInterval(()=>timerTicks++,10);
 const promise=candidateModule.prepareHEarthRun8ER2CanonicalLiveRenderPackage({deferVegetation:true});
 promise.catch(()=>{}); // Observe eager failure without replacing the owner promise.
 await new Promise(resolve=>setTimeout(resolve,0));
 const lateProgress=[];
 assert.equal(candidateModule.prepareHEarthRun8ER2CanonicalLiveRenderPackage({deferVegetation:true,onProgress:detail=>{assert.ok(Object.isFrozen(detail));phases.push(detail.phase);}}),promise);
 assert.equal(candidateModule.prepareHEarthRun8ER2CanonicalLiveRenderPackage({deferVegetation:true,onProgress:detail=>lateProgress.push(detail.phase)}),promise);
 assert.equal(phases[0],'RAW_PACKAGE_PREPARING');assert.equal(lateProgress[0],'RAW_PACKAGE_PREPARING');
 assert.equal(candidateModule.prepareHEarthRun8ER2CanonicalLiveRenderPackage({deferVegetation:true}),promise);
 const candidate=await promise;const workerElapsedMs=performance.now()-start;clearInterval(interval);interval=null;
 const raw=candidateRawModule.getHEarthRun8ER2ImmutableLiveRenderPackage({deferVegetation:true});
 assert.equal(raw,receivedRaw);assert.equal(candidate,receivedCanonical);assert.notEqual(raw,candidate);assert.notEqual(raw.buffers.positions,candidate.buffers.positions);
 assert.equal(candidateModule.getHEarthRun8ER2CanonicalLiveRenderPackage({deferVegetation:true}),candidate);
 assert.equal(await candidateModule.prepareHEarthRun8ER2CanonicalLiveRenderPackage({deferVegetation:true}),candidate);
 assert.equal(candidateRawModule.getHEarthRun8ER2ImmutableLiveRenderPackage({deferVegetation:true}),raw);
 assert.equal(workerCount,1);assert.equal(requestCount,1);assert.equal(terminated,1);
 const cachedProgress=[];assert.equal(await candidateModule.prepareHEarthRun8ER2CanonicalLiveRenderPackage({deferVegetation:true,onProgress:detail=>cachedProgress.push(detail.phase)}),candidate);assert.deepEqual(cachedProgress,['CANONICAL_PACKAGE_READY']);assert.ok(lateProgress.includes('CANONICAL_PACKAGE_READY'));await assert.rejects(candidateModule.prepareHEarthRun8ER2CanonicalLiveRenderPackage({deferVegetation:true,onProgress:()=>{throw new Error('cached-listener');}}));assert.equal(await candidateModule.prepareHEarthRun8ER2CanonicalLiveRenderPackage({deferVegetation:true}),candidate);assert.ok(timerTicks>0);
 const hashes={};
 for(const [label,current,accepted] of [['canonical',candidate,baseline],['raw',raw,baselineRaw]]){
  for(const name of Object.keys(accepted.buffers)){assert.deepEqual(current.buffers[name],accepted.buffers[name],label+':'+name);assert.ok(Object.isFrozen(current.buffers[name]));}
  const {constructionMilliseconds:currentTime,...currentIdentity}=current;const {constructionMilliseconds:baselineTime,...baselineIdentity}=accepted;
  assert.deepEqual(currentIdentity,baselineIdentity,label+' complete identity excluding elapsed constructionMilliseconds');
  hashes[label]=createHash('sha256').update(JSON.stringify(currentIdentity)).digest('hex');
 }
 const bufferArrays=new WeakSet([...Object.values(raw.buffers),...Object.values(candidate.buffers)]);
 function frozenTree(value,seen=new WeakSet()){if(!value||typeof value!=='object'||seen.has(value))return;seen.add(value);assert.ok(Object.isFrozen(value));if(bufferArrays.has(value))return;for(const child of Object.values(value))frozenTree(child,seen);}
 frozenTree(candidate);frozenTree(raw);
 // Identical issue ordering and sparse .some behavior, including multiple failures.
 for(const invalid of [null,{...raw,eligible:false},{...raw,buffers:Object.freeze({...raw.buffers,positions:Object.freeze([NaN,Infinity]),indices:Object.freeze([-1,0.5])})},{...raw,buffers:Object.freeze({...raw.buffers,normals:Object.freeze(new Array(raw.buffers.normals.length))})}]){
  assert.deepEqual(await candidateRawModule.evaluateHEarthRun8ER2ImmutableLiveRenderPackageAsync(invalid),baselineRawModule.evaluateHEarthRun8ER2ImmutableLiveRenderPackage(invalid));
 }
 // Malformed final record pairs reject even when individual evaluator shape is valid.
 for(const change of [{packageOccurrenceId:'INVALID_OCCURRENCE'},{revision:1},{contentDigest:'fnv1a32:00000000'},{eligible:false}]){
  globalThis.Worker=class{terminate(){}postMessage(){queueMicrotask(()=>{this.onmessage({data:{phase:'CANONICAL_WORKER_MODULE_READY'}});this.onmessage({data:{phase:'RAW_PACKAGE_COMPLETE'}});this.onmessage({data:{phase:'CANONICAL_PACKAGE_COMPLETE',raw,canonical:{...candidate,...change}}});});}};
  const badModule=await import(candidateUrl.href+'?malformed='+Object.keys(change)[0]);await assert.rejects(badModule.prepareHEarthRun8ER2CanonicalLiveRenderPackage({deferVegetation:true}));assert.equal(badModule.getHEarthRun8ER2CanonicalPreparationTiming().main.stages.CANONICAL_MAIN_VALIDATE.status,'FAIL');assert.equal(observedSpans.at(-1).name,'CANONICAL_MAIN_VALIDATE');assert.equal(observedSpans.at(-1).status,'FAIL');
 }

 const timing=candidateModule.getHEarthRun8ER2CanonicalPreparationTiming();
 assert.equal(timing.schema,'H_EARTH_CANONICAL_PREPARATION_TIMING_v1');assert.equal(timing.version,1);assert.equal(timing.status,'READY');assert.equal(timing.branch,'MODULE_WORKER');
 const expectedSpans=['CANONICAL_WORKER_MODULE_READY_WAIT','CANONICAL_WORKER_RESULT_WAIT','CANONICAL_MAIN_FREEZE','CANONICAL_RAW_ADOPTION_VALIDATE','CANONICAL_MAIN_VALIDATE'];
 for(const name of expectedSpans){assert.equal(timing.main.stages[name].status,'PASS');assert.ok(Number.isFinite(timing.main.stages[name].durationMs));assert.ok(observedSpans.some(entry=>entry.name===name&&entry.status==='PASS'));}
 assert.equal(timing.worker.schema,timing.schema);assert.equal(timing.worker.version,1);assert.ok(timing.worker.sourceModuleUrl.includes('hearthCanonicalTiming=1'));
 for(const name of ['rawBuildDurationMs','canonicalBuildDurationMs','resultPostStartAtMs','timeOrigin'])assert.ok(Number.isFinite(timing.worker[name]),name);
 assert.ok(Number.isFinite(timing.main.receiveAtMs));assert.ok(Number.isFinite(timing.main.timeOrigin));assert.ok(Number.isFinite(timing.normalizedHandoffDurationMs));
 assert.ok(timing.handoffScope.includes('NOT_PURE_CLONE'));assert.ok(Object.isFrozen(timing));assert.ok(Object.isFrozen(timing.main.stages));
 const observer=readFileSync(resolve(root,'showroom/globe/h-earth/diagnostic/renderer-startup-observer.v1.js'),'utf8');
 const reportGetter=observer.slice(observer.indexOf('const getPerformanceReport=()=>'),observer.indexOf('function installPerformanceReportButton'));
 const context={observerModuleUrl:pathToFileURL(resolve(root,'showroom/globe/h-earth/diagnostic/renderer-startup-observer.v1.js')).href,document:{getElementById:()=>null,visibilityState:'visible'},navigator:{userAgent:'CPU qualification',hardwareConcurrency:1},window:{devicePixelRatio:1,innerWidth:1,innerHeight:1,H_EARTH_RUN8E_PUBLIC_ROUTE:{getVegetationResidency:()=>({canonicalPreparationTiming:timing})}},location:{href:'cpu:test'},performance:{getEntriesByType:()=>[]},performanceEnabled:true,frameIntervals:{},state:{contextLost:false,performanceCosts:null},clone:()=>({})};
 vm.createContext(context);vm.runInContext(reportGetter.replace('import.meta.url','observerModuleUrl')+'\nthis.serializedReport=JSON.stringify(getPerformanceReport());',context);
 const report=JSON.parse(context.serializedReport);assert.deepEqual(report.vegetationResidency.canonicalPreparationTiming,JSON.parse(JSON.stringify(timing)));
 const rendererSource=readFileSync(resolve(root,rel,'persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js'),'utf8');assert.ok(rendererSource.includes('vegetationResidency:{canonicalPreparationTiming:getHEarthRun8ER2CanonicalPreparationTiming()'));

 // Unknown clock origins and non-monotonic normalization remain unknown, never zero.
 for(const [caseName,workerClock] of [['unknown',{timeOrigin:null,resultPostStartAtMs:null}],['nonmonotonic',{timeOrigin:performance.timeOrigin+1e8,resultPostStartAtMs:0}]]){
  globalThis.Worker=class{terminate(){}postMessage(){queueMicrotask(()=>{this.onmessage({data:{phase:'CANONICAL_WORKER_MODULE_READY'}});this.onmessage({data:{phase:'RAW_PACKAGE_COMPLETE'}});this.onmessage({data:{phase:'CANONICAL_PACKAGE_COMPLETE',raw,canonical:candidate,timing:{schema:'H_EARTH_CANONICAL_PREPARATION_TIMING_v1',version:1,...workerClock}}});});}};
  const uncertain=await import(candidateUrl.href+'?clockCase='+caseName);await uncertain.prepareHEarthRun8ER2CanonicalLiveRenderPackage({deferVegetation:true});assert.equal(uncertain.getHEarthRun8ER2CanonicalPreparationTiming().normalizedHandoffDurationMs,null);
 }

 // Diagnostics disabled: no additional clocks/records/spans are published.
 globalThis.location={search:''};let disabledUrl=null,disabledRequest=null;const beforeDisabledSpans=observedSpans.length;
 globalThis.Worker=class{constructor(url){disabledUrl=url;}terminate(){}postMessage(request){disabledRequest=request;queueMicrotask(()=>{this.onmessage({data:{phase:'CANONICAL_WORKER_MODULE_READY'}});this.onmessage({data:{phase:'RAW_PACKAGE_COMPLETE'}});this.onmessage({data:{phase:'CANONICAL_PACKAGE_COMPLETE',raw,canonical:candidate}});});}};
 const disabled=await import(candidateUrl.href+'?disabled=1');assert.equal(await disabled.prepareHEarthRun8ER2CanonicalLiveRenderPackage({deferVegetation:true}),candidate);assert.equal(disabled.getHEarthRun8ER2CanonicalPreparationTiming(),null);assert.equal(disabledUrl.searchParams.has('hearthCanonicalTiming'),false);assert.equal(disabledRequest.performanceEnabled,false);assert.equal(observedSpans.length,beforeDisabledSpans);globalThis.location={search:'?performance=1'};

 // Absence is the sole synchronous fallback; it returns original identical data.
 globalThis.Worker=undefined;const fallbackModule=await import(candidateUrl.href+'?fallback=1');const fallbackPhases=[];
 const fallback=await fallbackModule.prepareHEarthRun8ER2CanonicalLiveRenderPackage({deferVegetation:true,onProgress:d=>fallbackPhases.push(d.phase)});
 const {constructionMilliseconds:ignored,...fallbackIdentity}=fallback;const {constructionMilliseconds:ignored2,...baselineIdentity}=baseline;
 assert.deepEqual(fallbackIdentity,baselineIdentity);assert.deepEqual(fallbackPhases,['SYNCHRONOUS_BASELINE_FALLBACK']);const fallbackTiming=fallbackModule.getHEarthRun8ER2CanonicalPreparationTiming();assert.equal(fallbackTiming.branch,'SYNCHRONOUS_BASELINE_FALLBACK');assert.equal(fallbackTiming.status,'FALLBACK');assert.equal(fallbackTiming.worker,null);assert.equal(fallbackTiming.normalizedHandoffDurationMs,null);assert.deepEqual(fallbackTiming.main.stages,{});const failedFallback=await import(candidateUrl.href+'?fallbackFailure=1');await assert.rejects(failedFallback.prepareHEarthRun8ER2CanonicalLiveRenderPackage({deferVegetation:true,onProgress:()=>{throw new Error('test-fallback-error');}}));assert.equal(failedFallback.getHEarthRun8ER2CanonicalPreparationTiming().status,'FAILED');assert.equal(failedFallback.getHEarthRun8ER2CanonicalPreparationTiming().failure.message,'test-fallback-error');
 for(const phase of ['RAW_PACKAGE_PREPARING','RAW_PACKAGE_COMPLETE','CANONICAL_PACKAGE_COMPLETE','CANONICAL_PACKAGE_READY'])assert.ok(phases.includes(phase));
 const result={schema:'H_EARTH_CANONICAL_STARTUP_PREPARATION_CPU_QUALIFICATION_v1',result:'PASS',baselineHead:'935e756e725f8c205921437fbace9faef45c28eb',fullBufferAndMetadataHashes:hashes,sourceDigests,baselineSourceCount:seenSources.size,workerCount,terminated,timerTicks,workerElapsedMs,phases:[...new Set(phases)],metadataExclusion:['constructionMilliseconds'],canonicalPreparationTiming:timing,earlyBindingRouteAndImportOrdering:'PASS',lateProgressReplay:'PASS',singlePreparationRequest:requestCount,timingReportSerialization:'PASS',timingDisabledGating:'PASS',timingFallbackAndFailure:'PASS',timingUnknownClockCases:'PASS',claimCeiling:'CPU actual module worker, package equivalence, cache and error tests; no browser GPU, physical device or performance score evidence'};
 if(process.env.H_EARTH_STARTUP_CPU_RECEIPT)writeFileSync(process.env.H_EARTH_STARTUP_CPU_RECEIPT,JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));
}finally{if(interval)clearInterval(interval);globalThis.Worker=nativeWorker;globalThis.location=originalLocation;globalThis.H_EARTH_RENDERER_STARTUP_DIAGNOSTICS=originalDiagnostics;}
