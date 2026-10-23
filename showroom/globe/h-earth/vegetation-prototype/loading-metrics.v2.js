/** Bounded diagnostics. No polling, GL queries, geometry copies, or synthetic frames. */
const finite=n=>Number.isFinite(n)&&n>=0;
const percentile=(values,p)=>values.length?[...values].sort((a,b)=>a-b)[Math.ceil(values.length*p)-1]:null;
const summarize=values=>({samples:values.length,p50Milliseconds:percentile(values,.5),p95Milliseconds:percentile(values,.95),maxMilliseconds:values.length?Math.max(...values):null});
function plants(resource){
 const original=resource?.jacaranda;
 return [...(original?[{...original,id:original.focusId,x:original.placement?.anchor?.x??original.targetAnchor?.x,z:original.placement?.anchor?.z??original.targetAnchor?.z}]:[]),...(resource?.treeCollection?.entries??[])];
}
function status(entries,expected=entries.length){return {expected,missingEntries:expected===null?null:Math.max(0,expected-entries.length),ready:entries.filter(e=>e.ready===true).length,pendingIds:entries.filter(e=>!e.ready&&!e.failure).map(e=>e.id),failed:entries.filter(e=>e.failure).map(e=>({id:e.id,message:e.failure})),complete:expected!==null&&expected>0&&entries.length===expected&&entries.every(e=>e.ready===true)};}
export function createLoadingMetrics({now=()=>performance.now(),sampleLimit=256}={}){
 if(!Number.isInteger(sampleLimit)||sampleLimit<1||sampleLimit>1024)throw Error('INVALID_SAMPLE_LIMIT');
 let controls=null,initialIds=null,initialReady=null,allReady=null,pending=null,inputCount=0,coalesced=0,totalSamples=0,hiddenDiscarded=0;
 const latencies=[],cpu=[];
 function observeResources(resource,camera){
  const entries=plants(resource);if(controls===null)return;
  const initial=initialIds?.map(id=>entries.find(e=>e.id===id)).filter(Boolean)??[];
  if(initialReady===null&&initial.length===initialIds?.length&&status(initial).complete)initialReady=now();
  if(allReady===null&&resource?.jacaranda&&resource?.treeCollection?.entries?.length===resource.treeCollection.replacementCount+resource.treeCollection.additionalShrubCount&&status(entries).complete)allReady=now();
 }
 return {
  controlsReady(resource,camera){if(controls!==null)return;controls=now();const radius=resource?.treeCollection?.prefetchDistance??180;initialIds=plants(resource).filter(e=>finite(Math.hypot(e.x-camera?.x,e.z-camera?.z))&&Math.hypot(e.x-camera.x,e.z-camera.z)<radius).map(e=>e.id);observeResources(resource,camera);},
  observeResources,
  input(proposal,state,visible=true){if(proposal?.accepted!==true||!Number.isFinite(state?.sequence)||!visible)return;if(pending)coalesced++;inputCount++;pending={sequence:state.sequence,at:now()};},
  visibilityChanged(){if(pending){hiddenDiscarded++;pending=null;}},
  presented(state,frame,visible=true){if(!visible){this.visibilityChanged();return;}if(!pending||pending.sequence!==state?.sequence||frame?.navigationSequence!==state.sequence)return;const elapsed=now()-pending.at;pending=null;if(!finite(elapsed))return;totalSamples++;latencies.push(elapsed);cpu.push(finite(frame.cpuSubmitMilliseconds)?frame.cpuSubmitMilliseconds:null);if(latencies.length>sampleLimit){latencies.shift();cpu.shift();}},
  snapshot(resource,camera){
   const entries=plants(resource),radius=resource?.treeCollection?.prefetchDistance??180;
   const nearby=entries.filter(e=>Number.isFinite(camera?.x)&&Number.isFinite(camera?.z)&&Math.hypot(e.x-camera.x,e.z-camera.z)<radius);
   const owners=new Map();let shared=0,unknown=0;
   for(const e of entries){if(e.sharedGpuResources){shared++;continue;}if(!finite(e.gpuResourceBytes)){unknown++;continue;}owners.set(e.resourceOwner??e.id,e.gpuResourceBytes);}
   return {schema:'GRATITUDE_LOADING_METRICS_v2',clock:'ROUTE_ELAPSED_MILLISECONDS',controlsReadyMilliseconds:controls,initialNearbyAssetIds:initialIds,initialNearbyResidentMilliseconds:initialReady,allImportedPlantsResidentMilliseconds:allReady,
    readinessScope:'First observed imported plant residency at controls or an asset-triggered presentation boundary, not exact upload finish and not proof of visible pixels or GPU completion. Essential landscape and grass readiness is represented by controlsReady. Initial target set fixed at controls enable; current set follows camera. No whole-world completion claim.',
    currentNearby:{radiusMeters:radius,camera:camera?{x:camera.x,z:camera.z}:null,...status(nearby)},allImportedPlants:status(entries,Number.isInteger(resource?.treeCollection?.replacementCount)&&Number.isInteger(resource?.treeCollection?.additionalShrubCount)?1+resource.treeCollection.replacementCount+resource.treeCollection.additionalShrubCount:null),
    traversal:{scope:'Accepted navigation callback to matching render/present CPU return; excludes earlier browser input delay, GPU execution and display scanout. Recent bounded samples, not FPS.',inputCount,coalescedInputCount:coalesced,totalSamples,retainedSampleLimit:sampleLimit,pending:pending!==null,hiddenDiscarded,...summarize(latencies),cpuSubmission:summarize(cpu.filter(finite))},
    importedPlantGpu:{estimatedUniqueResourceBytes:[...owners.values()].reduce((a,b)=>a+b,0),resourceOwners:owners.size,sharedInstances:shared,unknownEntries:unknown,scope:'Renderer-reported allocation estimate for imported plants only; shared owners counted once. Not driver memory measurement or total scene memory.'}};
  }
 };
}
export function summarizeTransfers(entries,{bufferFullEvents=0}={}){
 const groups={};let invalid=0;
 for(const e of entries){const path=new URL(e.name,'https://local.invalid').pathname;const group=/\.glb$/i.test(path)?'importedModels':/precomputed-grass|oasis-soil/.test(path)?'grassAndSoil':/\.(?:png|jpg|webp|ktx2)$/i.test(path)?'textures':'other';const g=groups[group]??={requests:0,transferBytes:0,encodedBytes:0,decodedBytes:0,zeroTransferEntries:0,knownLocalCacheEntries:0};g.requests++;for(const [k,v] of [['transferBytes',e.transferSize],['encodedBytes',e.encodedBodySize],['decodedBytes',e.decodedBodySize]])if(finite(v))g[k]+=v;if(e.transferSize===0)g.zeroTransferEntries++;if(e.deliveryType==='cache')g.knownLocalCacheEntries++;if(!finite(e.duration))invalid++;}
 return {groups,observedEntries:entries.length,invalidTimingEntries:invalid,bufferFullEvents,knownBufferOverflow:bufferFullEvents>0,completeness:'NOT_PROVEN',scope:'Matching retained Resource Timing entries; repeated requests count as transfers. Zero transfer alone is not proof of cache. Cached and network runs are not interchangeable; browser buffer can omit entries.'};
}
