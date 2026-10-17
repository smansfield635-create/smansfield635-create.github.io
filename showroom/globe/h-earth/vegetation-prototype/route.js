/** Isolated Gen2790 route. No original public integration or legacy residency scheduler. */
import {prepareHEarthRun8ER2CanonicalLiveRenderPackage} from '../render/live-render-package.run8e-r2.canonical.js?cb=meadow-distribution-20261006';
import {createHEarthRun8ER3AFrameUniformPacket} from '../render/live-renderer-contract.run8e-r3a.js?cb=meadow-distribution-20261006&rev=gen2780-stable-planting-v1';
import {createHEarthRun8ER3CPersistentRenderer} from '../render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js?cb=meadow-distribution-20261006&rev=gen2780-stable-planting-v1';
import {installHEarthRun8ER3D2PointerTouchIntake} from '../diagnostic/run8e-r3d/pointer-touch-intake.js?cb=gen2780-stable-planting-v1';

const sourceBaseline='3ca258e1e67fe16ed5eb73b4cd883c66af6b4909';
const root=document.getElementById('h-earth-functional-landscape-route');
const canvas=document.getElementById('h-earth-functional-landscape-canvas');
const status=document.getElementById('prototype-status');
const query=new URLSearchParams(location.search),started=performance.now();
const copy=value=>JSON.parse(JSON.stringify(value));
const assert=(condition,reason)=>{if(!condition)throw Error('SINGLE_OWNER_PROTOTYPE:'+reason);};
const delay=milliseconds=>new Promise(resolve=>setTimeout(resolve,milliseconds));
const control=Object.freeze({x:-139.40267987050615,z:-194.5,radius:2});
let renderer=null,intake=null,sequence=0,replay=null,preparation=null;
const frames=[],observations=[],timing={firstFrameMilliseconds:null,populatedMilliseconds:null,replayCompleteMilliseconds:null};
let renderFrameCallCount=0,gpuFramebufferPresentationCount=0;
function resources(){return renderer?.getResourceReceipt()??null;}
function owner(){return resources()?.singleOwnerVegetation??null;}
function ids(record){
  assert(Array.isArray(record?.controlRoots)&&record.controlRoots.every(id=>typeof id==='string'),'CONTROL_IDS_MISSING');
  const result=[...record.controlRoots].sort();
  assert(new Set(result).size===result.length,'DUPLICATE_CONTROL_IDS');
  return result;
}
function snapshot(label){
  const state=intake.getNavigationState(),r=resources();
  const observation={label,elapsedMilliseconds:performance.now()-started,position:{...state.position},yawDegrees:state.yawDegrees,pitchDegrees:state.pitchDegrees,
    navigationSequence:state.sequence,cacheCell:{x:Math.floor(state.position.x/4),z:Math.floor(state.position.z/4)},fixedControl:control,
    vegetation:copy(r.singleOwnerVegetation),rendererCounters:copy(r.counters??{}),lastFrame:copy(frames.at(-1))};
  observations.push(observation);return observation;
}
function packetFor(state){return createHEarthRun8ER3AFrameUniformPacket({deferVegetation:true,navigationState:state,viewport,frameSequence:++sequence});}
function present(state){
  const packet=packetFor(state),start=performance.now();
  renderer.renderFrame(packet);renderFrameCallCount++;
  renderer.presentColorFrame();gpuFramebufferPresentationCount++;
  const frame={frameSequence:sequence,navigationSequence:state.sequence,cameraPosition:{...packet.camera.position},cpuSubmitMilliseconds:performance.now()-start};
  frames.push(frame);if(frames.length>64)frames.shift();
  if(timing.firstFrameMilliseconds===null)timing.firstFrameMilliseconds=performance.now()-started;
  return frame;
}
function liveReceipt(){return {schema:'H_EARTH_SINGLE_OWNER_VEGETATION_LIVE_GPU_v1',sourceBaseline,resources:resources(),
  counters:{renderFrameCallCount,gpuFramebufferPresentationCount,rendererInitializationCount:renderer?1:0,worldRebuildCount:0},
  frameRecords:copy(frames),singleOwnerVegetationQualification:replay,timing:{...timing},preparation,
  canonicalPackageMutated:false,physicalDeviceAcceptance:false,publicationAuthorized:false};}
function publicReceipt(){return {receiptType:'H_EARTH_SINGLE_OWNER_VEGETATION_PROTOTYPE_v1',eligible:replay?.result==='CAPTURED_POPULATED_CONTINUITY',sourceBaseline,
  intake:intake?.getReceipt()??null,liveGpu:liveReceipt(),singleOwnerVegetationQualification:replay,physicalDeviceAcceptance:false,publicationAuthorized:false};}
window.H_EARTH_RUN8E_PUBLIC_ROUTE=Object.freeze({getReceipt:publicReceipt,getSnapshot:publicReceipt,getLiveGpuReceipt:liveReceipt,getIntakeReceipt:()=>intake?.getReceipt()??null});
window.H_EARTH_RUN8E_R3E2_PUBLIC_INTEGRATION=window.H_EARTH_RUN8E_PUBLIC_ROUTE;
const cssWidth=Math.max(320,Math.round(canvas.clientWidth||918)),cssHeight=Math.max(180,Math.round(canvas.clientHeight||565));
const scale=Math.min(1,Math.sqrt(960*540/(cssWidth*cssHeight)));
const viewport=Object.freeze({width:Math.max(320,Math.round(cssWidth*scale)),height:Math.max(180,Math.round(cssHeight*scale)),pixelRatio:1});

try{
  assert(query.get('prototype')==='single-owner-v1','EXPLICIT_PROTOTYPE_SELECTION_REQUIRED');
  assert(query.get('arrival')==='approved-four-trees','APPROVED_ARRIVAL_REQUIRED');
  await prepareHEarthRun8ER2CanonicalLiveRenderPackage({deferVegetation:true,onProgress:update=>{status.textContent=update.status??'Loading the preserved environment…';}});
  intake=installHEarthRun8ER3D2PointerTouchIntake({surface:canvas,onProposal:(_proposal,state)=>{if(renderer)present(state);}});
  const initial=intake.getNavigationState();
  assert(Math.hypot(initial.position.x-control.x,initial.position.z-control.z)<.01,'INITIAL_CAMERA_MISMATCH');
  assert(Math.abs(initial.yawDegrees)<.01,'INITIAL_YAW_MISMATCH');
  renderer=await createHEarthRun8ER3CPersistentRenderer({canvas,width:viewport.width,height:viewport.height,deferVegetation:true,vegetationStrategy:'SINGLE_OWNER_WOODLAND_V1',
    onStartupProgress:update=>{status.textContent=update.status??'Loading the preserved environment…';}});
  await renderer.initialize(packetFor(initial));
  present(intake.getNavigationState());
  assert(typeof renderer.prepareReplacementVegetation==='function','REPLACEMENT_OWNER_MISSING');
  preparation=await renderer.prepareReplacementVegetation({onProgress:update=>{status.textContent=update.status??'Preparing the shared vegetation records…';}});
  present(intake.getNavigationState());
  const entry=snapshot('BEFORE_MOVE'),entryOwner=entry.vegetation,controlIds=ids(entryOwner);
  assert(entryOwner.installedRootCount>0&&controlIds.length>0,'EMPTY_INSTALLED_CONTROL');
  assert(entryOwner.selectedFineRoots>0&&entryOwner.drawCallCount>0,'EMPTY_FINE_SUBMISSION');
  assert(entryOwner.coarseRootCount>0&&entryOwner.coarseTiles>0,'COARSE_COVERAGE_MISSING');
  assert(entryOwner.perFrameUploadBytes===0,'UNEXPECTED_FRAME_UPLOAD');
  timing.populatedMilliseconds=performance.now()-started;
  status.textContent='Comparing the same ground through the forward and return walk…';
  for(const direction of ['FORWARD','RETURN'])for(let step=1;step<=8;step++){
    canvas.dispatchEvent(new WheelEvent('wheel',{deltaY:direction==='FORWARD'?-280:280,bubbles:true,cancelable:true}));
    await delay(700);
    const observation=snapshot(`${direction}_${step}`),expectedZ=control.z-4*(direction==='FORWARD'?step:8-step);
    assert(Math.abs(observation.position.x-control.x)<.01&&Math.abs(observation.position.z-expectedZ)<.01,'EXACT_WALK_POSITION_MISMATCH');
    assert(JSON.stringify(ids(observation.vegetation))===JSON.stringify(controlIds),'INSTALLED_CONTROL_IDENTITY_CHANGED');
    assert(observation.vegetation.coarseRootCount>0&&observation.vegetation.coarseTiles>0&&observation.vegetation.drawCallCount>0,'COARSE_COVERAGE_OR_DRAW_LOST');
    assert(observation.vegetation.perFrameUploadBytes===0,'UNEXPECTED_FRAME_UPLOAD');
  }
  const final=snapshot('FINAL'),returnDistanceMeters=Math.hypot(final.position.x-entry.position.x,final.position.z-entry.position.z);
  assert(returnDistanceMeters<.01,'EXACT_RETURN_MISSING');
  timing.replayCompleteMilliseconds=performance.now()-started;
  replay={schema:'H_EARTH_SINGLE_OWNER_VEGETATION_REPLAY_v1',result:'CAPTURED_POPULATED_CONTINUITY',sourceBaseline,input:'SYNTHETIC_WHEEL_THROUGH_REAL_INTAKE',
    control,controlRoots:controlIds,observations:copy(observations),requestedStepsPerDirection:8,requestedMagnitudePerStep:4,returnDistanceMeters,
    installedControlIdentityStable:true,coarseCoverageSubmittedThroughout:true,visiblePixelsVerified:false,physicalDeviceAcceptance:false,publicationAuthorized:false,
    cpuSubmissionScope:'CPU_RENDER_AND_PRESENT_CALL_DURATION_NOT_GPU_EXECUTION_TIME',timing:{...timing}};
  root.dataset.run8eReady='true';root.dataset.worldFirstFrameReady='true';root.dataset.singleOwnerPrototype='captured';
  status.textContent='Isolated comparison captured · physical-device review remains separate.';
  window.dispatchEvent(new CustomEvent('h-earth-run8e-ready',{detail:{type:'H_EARTH_RUN8E_READY',prototype:'single-owner-v1',timestamp:new Date().toISOString()}}));
}catch(error){
  replay={schema:'H_EARTH_SINGLE_OWNER_VEGETATION_REPLAY_v1',result:'FAILED',message:error.message,sourceBaseline,observations:copy(observations),timing:{...timing},physicalDeviceAcceptance:false,publicationAuthorized:false};
  root.dataset.run8eError='true';root.dataset.singleOwnerPrototype='failed';status.textContent=error.message;
  console.error(error);
}
