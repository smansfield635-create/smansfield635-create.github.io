/** Gen2795 measured preparation and input-confirmed public entry; isolated diagnostic replay. */
import {prepareHEarthRun8ER2CanonicalLiveRenderPackage} from '../render/live-render-package.run8e-r2.canonical.js?cb=meadow-distribution-20261006';
import {createHEarthRun8ER3AFrameUniformPacket} from '../render/live-renderer-contract.run8e-r3a.js?cb=meadow-distribution-20261006&rev=gen2780-stable-planting-v1';
import {createHEarthRun8ER3CPersistentRenderer} from '../render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js?rev=gen2984-inland-composed-blend';
import {installHEarthRun8ER3D2PointerTouchIntake,resolveHEarthNavigationBoundaryFeedback} from '../diagnostic/run8e-r3d/pointer-touch-intake.js?cb=gen2780-stable-planting-v1';

import {createFramePresenter} from '../render/performance-scheduling.v1.js?rev=gen2795-performance-v1';
import {createHEarthLoadingScreen} from './loading-screen.v1.js?rev=gen2815-fast-start-v1';

import {createLoadingMetrics,summarizeTransfers} from './loading-metrics.v2.js';

const sourceBaseline='f64ce197d6bd54cd3627458fc138295e9913f761';
const root=document.getElementById('h-earth-functional-landscape-route');
const canvas=document.getElementById('h-earth-functional-landscape-canvas');
const status=document.getElementById('prototype-status');
const query=new URLSearchParams(location.search),started=performance.now();
const diagnosticReplay=location.pathname.endsWith('/vegetation-prototype.html');
const qualificationView=diagnosticReplay&&['bank-view-v1','habitat-edge-view-v1','ravine-view-v1'].includes(query.get('qualification'))?query.get('qualification'):null;
const loader=diagnosticReplay?null:(globalThis.H_EARTH_STARTUP_LOADER??createHEarthLoadingScreen({onEnter:markReady}));
if(!diagnosticReplay){
 const enterWhenConfirmed=()=>{if(loader.getReceipt().mode!=='entered')return;document.removeEventListener('gratitude-enter',enterWhenConfirmed);markReady();};
 document.addEventListener('gratitude-enter',enterWhenConfirmed);
}
const copy=value=>JSON.parse(JSON.stringify(value));
const assert=(condition,reason)=>{if(!condition)throw Error('SINGLE_OWNER_PROTOTYPE:'+reason);};
const delay=milliseconds=>new Promise(resolve=>setTimeout(resolve,milliseconds));
const control=Object.freeze({x:-139.40267987050615,z:-194.5,radius:2});
let renderer=null,intake=null,presenter=null,sequence=0,replay=null,preparation=null,interactiveReady=false;
let diagnosticTourMoving=false,terminalFailure=null;
const loadingMetrics=createLoadingMetrics({now:()=>performance.now()-started});
let assetMetricsDirty=false,resourceBufferFullEvents=0;
performance.addEventListener?.('resourcetimingbufferfull',()=>resourceBufferFullEvents++);
document.addEventListener('visibilitychange',()=>{if(document.hidden)loadingMetrics.visibilityChanged();});
function assertRouteActive(){if(terminalFailure)throw terminalFailure;}
const boundaryStatus=document.createElement('output');
boundaryStatus.id='h-earth-navigation-boundary';boundaryStatus.setAttribute('role','status');boundaryStatus.setAttribute('aria-live','polite');boundaryStatus.hidden=true;
boundaryStatus.style.cssText='position:fixed;bottom:max(100px,env(safe-area-inset-bottom));left:50%;transform:translateX(-50%);z-index:5;max-width:calc(100vw - 32px);padding:10px 12px;border-radius:8px;background:rgba(7,20,18,.88);color:#f1f7f3;font:13px/1.4 system-ui,sans-serif;text-align:center;pointer-events:none';
document.body.appendChild(boundaryStatus);
function updateBoundaryFeedback(proposal){boundaryStatus.textContent=resolveHEarthNavigationBoundaryFeedback(boundaryStatus.textContent,proposal);boundaryStatus.hidden=!boundaryStatus.textContent;}

if(!diagnosticReplay)canvas.style.pointerEvents='none';
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
  presenter?.flush();
  const state=intake.getNavigationState(),r=resources();
  const observation={label,elapsedMilliseconds:performance.now()-started,position:{...state.position},yawDegrees:state.yawDegrees,pitchDegrees:state.pitchDegrees,
    navigationSequence:state.sequence,cacheCell:{x:Math.floor(state.position.x/4),z:Math.floor(state.position.z/4)},fixedControl:control,
    vegetation:copy(r.singleOwnerVegetation),rendererCounters:copy(r.counters??{}),lastFrame:copy(frames.at(-1))};
  observations.push(observation);return observation;
}
function packetFor(state){return createHEarthRun8ER3AFrameUniformPacket({deferVegetation:true,navigationState:state,viewport,frameSequence:++sequence});}
function present(state){
  try{return presentObserved(state);}catch(error){failRoute(error);throw error;}
}
function presentObserved(state){
  assertRouteActive();
  const packet=packetFor(state),start=performance.now();
  renderer.renderFrame(packet);renderFrameCallCount++;
  renderer.presentColorFrame();gpuFramebufferPresentationCount++;
  const frame={frameSequence:sequence,navigationSequence:state.sequence,cameraPosition:{...packet.camera.position},cpuSubmitMilliseconds:performance.now()-start};
  frames.push(frame);if(frames.length>64)frames.shift();
  if(timing.firstFrameMilliseconds===null)timing.firstFrameMilliseconds=performance.now()-started;
  if(assetMetricsDirty){assetMetricsDirty=false;loadingMetrics.observeResources(resources(),state.position);}
  return frame;
}
function assertStableObservation(observation,expectedIds){
  assert(JSON.stringify(ids(observation.vegetation))===JSON.stringify(expectedIds),'INSTALLED_CONTROL_IDENTITY_CHANGED');
  assert(observation.vegetation.coarseRootCount>0&&observation.vegetation.coarseTiles>0&&observation.vegetation.drawCallCount>0,'COARSE_COVERAGE_OR_DRAW_LOST');
  assert(observation.vegetation.perFrameUploadBytes===0,'UNEXPECTED_FRAME_UPLOAD');
  assert(observation.rendererCounters.woodlandHabitatTextureUploadCount===1&&observation.rendererCounters.woodlandHabitatUploadedBytes===110592,'HABITAT_TEXTURE_UPLOAD_COUNT_CHANGED');
}
// Diagnostic-only tours use the unchanged pointer/wheel intake. No public query
// can select automatic travel; every final view records its actual supported pose.
async function diagnosticAim(targetYaw){
  const difference=()=>((targetYaw-intake.getNavigationState().yawDegrees+540)%360)-180;
  // One observed intake frame per pulse: held wall-clock gestures can overshoot
  // when software-GPU presentations stall the animation-frame queue.
  for(let pulse=0;pulse<512&&Math.abs(difference())>6;pulse++){
    const sign=Math.sign(difference()),x=canvas.clientWidth*.5,y=canvas.clientHeight*.5;
    const displacement=Math.abs(difference())>20?.15:.065;
    canvas.dispatchEvent(new PointerEvent('pointerdown',{pointerId:93,pointerType:'mouse',clientX:x,clientY:y,bubbles:true,cancelable:true}));
    try{
      canvas.dispatchEvent(new PointerEvent('pointermove',{pointerId:93,pointerType:'mouse',clientX:x+sign*canvas.clientWidth*displacement,clientY:y,bubbles:true,cancelable:true}));
      await new Promise(resolve=>requestAnimationFrame(resolve));
    }finally{
      canvas.dispatchEvent(new PointerEvent('pointerup',{pointerId:93,pointerType:'mouse',clientX:x,clientY:y,bubbles:true,cancelable:true}));
    }
  }
  assert(Math.abs(difference())<=6,'DIAGNOSTIC_VIEW_AIM_NOT_REACHED');
}
async function diagnosticPitch(targetPitch){
  for(let pulse=0;pulse<256&&Math.abs(intake.getNavigationState().pitchDegrees-targetPitch)>2.2;pulse++){
    const sign=Math.sign(targetPitch-intake.getNavigationState().pitchDegrees),x=canvas.clientWidth*.5,y=canvas.clientHeight*.5;
    canvas.dispatchEvent(new PointerEvent('pointerdown',{pointerId:94,pointerType:'mouse',clientX:x,clientY:y,bubbles:true,cancelable:true}));
    try{
      canvas.dispatchEvent(new PointerEvent('pointermove',{pointerId:94,pointerType:'mouse',clientX:x,clientY:y-sign*canvas.clientHeight*.065,bubbles:true,cancelable:true}));
      await new Promise(resolve=>requestAnimationFrame(resolve));
    }finally{
      canvas.dispatchEvent(new PointerEvent('pointerup',{pointerId:94,pointerType:'mouse',clientX:x,clientY:y,bubbles:true,cancelable:true}));
    }
  }
  assert(Math.abs(intake.getNavigationState().pitchDegrees-targetPitch)<=2.2,'DIAGNOSTIC_VIEW_PITCH_NOT_REACHED');
}
async function diagnosticTravel(x,z,expectedIds){
  for(let step=0;step<32;step++){
    const p=intake.getNavigationState().position,distance=Math.hypot(x-p.x,z-p.z);
    if(distance<2)return;
    await diagnosticAim((Math.atan2(x-p.x,p.z-z)*180/Math.PI+360)%360);
    canvas.dispatchEvent(new WheelEvent('wheel',{deltaY:-70*Math.min(10,Math.max(1,distance-1)),bubbles:true,cancelable:true}));
    await delay(60);
    assertStableObservation(snapshot('VIEW_TRAVEL_'+observations.length),expectedIds);
    const after=intake.getNavigationState().position;
    assert(Math.hypot(after.x-p.x,after.z-p.z)>.1,'DIAGNOSTIC_VIEW_TRAVEL_BLOCKED');
  }
  assert(false,'DIAGNOSTIC_VIEW_DESTINATION_NOT_REACHED');
}
function liveReceipt(){return {schema:'H_EARTH_SINGLE_OWNER_VEGETATION_LIVE_GPU_v1',sourceBaseline,resources:resources(),
  counters:{renderFrameCallCount,gpuFramebufferPresentationCount,rendererInitializationCount:renderer?1:0,worldRebuildCount:0},
  frameRecords:copy(frames),singleOwnerVegetationQualification:replay,timing:{...timing},preparation,
  inputPresentationReadiness:loader?.getReceipt()??null,frameScheduling:presenter?.getReceipt()??null,
  canonicalPackageMutated:false,physicalDeviceAcceptance:false,publicationAuthorized:false};}
// Collect only when the owner requests a report, never on the frame path.
loader?.setReportProvider?.(()=>{
  const resource=resources(),vegetation=resource?.singleOwnerVegetation;
  const transfers=performance.getEntriesByType('resource').filter(e=>/h-earth|precomputed-grass|oasis-soil|\.glb(?:\?|$)/.test(e.name));
  return {buildIdentifier:'gen2873-prepared-binding-repair-v1',sourceBaseline,
    repairBaseline:'c376aadb93fd1a98c4146733edca4ea12609bc00',
    reportFormatNote:'Top-level reportVersion identifies the copy-report format. details.buildIdentifier identifies this runtime repair.',
    clockNote:'Resource start times are navigation-relative; route times are elapsed since route start; loader elapsed uses its own start. Phase values are durations. Do not subtract timestamps from different origins.',
    loadingMetrics:loadingMetrics.snapshot(resource,intake?.getNavigationState()?.position),
    downloads:summarizeTransfers(transfers,{bufferFullEvents:resourceBufferFullEvents}),
    comparisonContext:{deviceClassHint:/Mobile/.test(navigator.userAgent)?'phone-like':'tablet-or-desktop',classificationIsHeuristic:true,renderViewport:viewport,hardwareConcurrency:navigator.hardwareConcurrency??null,deviceMemoryGiB:navigator.deviceMemory??null,visibilityState:document.visibilityState,baselineAutomaticallyComparable:false},
    importedPlants:{originalJacaranda:resource?.jacaranda??null,collection:resource?.treeCollection??null},
    preparedProceduralVegetation:resource?.rendererStartupTiming?.geological?.preparedVegetation??null,
    routeTiming:{...timing},rendererStartupTiming:resource?.rendererStartupTiming??null,vegetationTiming:vegetation?.timing??null,
    startupDiagnostics:{rendererTimingAvailable:!!resource?.rendererStartupTiming,vegetationResidency:resource?.vegetationResidency?.timing??null},
    transferSummary:{matchedCount:transfers.length,displayedCount:Math.min(80,transfers.length),transferBytes:transfers.reduce((n,e)=>n+e.transferSize,0),encodedBytes:transfers.reduce((n,e)=>n+e.encodedBodySize,0),invalidTimingCount:transfers.filter(e=>e.duration<0).length,scope:'Matched resource entries only; duration includes network and scheduling, not CPU decode; zero transfer may indicate cache.'},
    userAgent:navigator.userAgent,viewport:{width:canvas.clientWidth,height:canvas.clientHeight,pixelRatio:devicePixelRatio},
    resourceTransfers:transfers.map(e=>({
      path:new URL(e.name,location.href).pathname,startMilliseconds:e.startTime,durationMilliseconds:e.duration>=0?e.duration:null,timingValid:e.duration>=0,
      transferBytes:e.transferSize,encodedBytes:e.encodedBodySize,decodedBytes:e.decodedBodySize})).slice(-80)};
});
function publicReceipt(){return {receiptType:diagnosticReplay?'H_EARTH_SINGLE_OWNER_VEGETATION_PROTOTYPE_v1':'H_EARTH_SINGLE_OWNER_VEGETATION_PUBLIC_v1',eligible:diagnosticReplay?['CAPTURED_POPULATED_CONTINUITY','CAPTURED_STABLE_VIEW'].includes(replay?.result):root.dataset.run8eReady==='true',sourceBaseline,
  mode:diagnosticReplay?'diagnostic-replay':'manual-public',automaticNavigation:diagnosticReplay,
  intake:intake?.getReceipt()??null,liveGpu:liveReceipt(),singleOwnerVegetationQualification:replay,physicalDeviceAcceptance:false,publicationAuthorized:false};}
window.H_EARTH_RUN8E_PUBLIC_ROUTE=Object.freeze({getReceipt:publicReceipt,getSnapshot:publicReceipt,getLiveGpuReceipt:liveReceipt,getIntakeReceipt:()=>intake?.getReceipt()??null});
window.H_EARTH_RUN8E_R3E2_PUBLIC_INTEGRATION=window.H_EARTH_RUN8E_PUBLIC_ROUTE;
const cssWidth=Math.max(320,Math.round(canvas.clientWidth||918)),cssHeight=Math.max(180,Math.round(canvas.clientHeight||565));
const scale=Math.min(1,Math.sqrt(960*540/(cssWidth*cssHeight)));
const viewport=Object.freeze({width:Math.max(320,Math.round(cssWidth*scale)),height:Math.max(180,Math.round(cssHeight*scale)),pixelRatio:1});

function progress(stage,label){assertRouteActive();loader?.beginStage(stage,label);status.textContent=label;return update=>{assertRouteActive();loader?.update(update);status.textContent=update.status??update.phase?.toLowerCase().replaceAll('_',' ')??label;};}
function markReady(){
  if(terminalFailure)return;
  root.dataset.run8eReady='true';root.dataset.worldFirstFrameReady='true';root.dataset.singleOwnerPrototype=diagnosticReplay?'captured':'manual-ready';
  status.textContent=diagnosticReplay?'Isolated comparison captured · physical-device review remains separate.':'Ready · Drag to look · Two-finger slide or mouse wheel to move · Pinch to zoom';
  window.dispatchEvent(new CustomEvent('h-earth-run8e-ready',{detail:{type:'H_EARTH_RUN8E_READY',prototype:'single-owner-v1',mode:diagnosticReplay?'diagnostic-replay':'manual-public',timestamp:new Date().toISOString()}}));
}
function failRoute(error){if(terminalFailure)return;terminalFailure=error;interactiveReady=false;presenter?.cancel();renderer?.disposeCorrectedMaterial();canvas.style.pointerEvents='none';loader?.fail(error);root.dataset.run8eReady='false';root.dataset.worldFirstFrameReady='false';root.dataset.run8eError='true';root.dataset.singleOwnerPrototype='failed';status.textContent=error.message;}

window.addEventListener('pagehide',event=>{if(!event.persisted){presenter?.cancel();renderer?.disposeCorrectedMaterial();}});

canvas.addEventListener('webglcontextlost',()=>failRoute(Error('GRAPHICS_CONTEXT_LOST:Reload to create a new graphics session.')));

try{
  if(diagnosticReplay){
    assert(query.get('prototype')==='single-owner-v1','EXPLICIT_PROTOTYPE_SELECTION_REQUIRED');
    assert(query.get('arrival')==='approved-four-trees','APPROVED_ARRIVAL_REQUIRED');
  }
  if(!diagnosticReplay){
    // Select the intake's existing supported woodland arrival without a reload.
    // This public edition always enters at its populated woodland control.
    query.set('arrival','approved-four-trees');
    history.replaceState(history.state,'',`${location.pathname}?${query.toString()}${location.hash}`);
  }
  await prepareHEarthRun8ER2CanonicalLiveRenderPackage({deferVegetation:true,onProgress:progress('world','Preparing the preserved landscape…')});
  assertRouteActive();
  presenter=createFramePresenter({present,onPresented:(state,frame)=>{loader?.observePresentation(state,frame);loadingMetrics.presented(state,frame,!document.hidden);}});
  intake=installHEarthRun8ER3D2PointerTouchIntake({surface:canvas,onProposal:(proposal,state)=>{updateBoundaryFeedback(proposal);if(renderer&&(diagnosticReplay||interactiveReady)&&!diagnosticTourMoving){loader?.observeInput(proposal,state);loadingMetrics.input(proposal,state,!document.hidden);presenter.request(state);}}});
  const initial=intake.getNavigationState();
  assert(Math.hypot(initial.position.x-control.x,initial.position.z-control.z)<.01,'INITIAL_CAMERA_MISMATCH');
  assert(Math.abs(initial.yawDegrees)<.01,'INITIAL_YAW_MISMATCH');
  renderer=await createHEarthRun8ER3CPersistentRenderer({canvas,width:viewport.width,height:viewport.height,deferVegetation:true,vegetationStrategy:'SINGLE_OWNER_WOODLAND_V1',
    onAssetSettled:()=>{assetMetricsDirty=true;if(!terminalFailure&&(diagnosticReplay||interactiveReady)&&intake)presenter?.request(intake.getNavigationState());},
    onStartupProgress:progress('renderer','Preparing terrain and renderer…')});
  assertRouteActive();
  await renderer.initialize(packetFor(initial));
  assertRouteActive();
  present(intake.getNavigationState());
  assert(typeof renderer.prepareReplacementVegetation==='function','REPLACEMENT_OWNER_MISSING');
  preparation=await renderer.prepareReplacementVegetation({onProgress:progress('vegetation','Preparing the shared vegetation records…')});
  present(intake.getNavigationState());
  const entry=snapshot('BEFORE_MOVE'),entryOwner=entry.vegetation,controlIds=ids(entryOwner);
  assert(entryOwner.installedRootCount>0&&controlIds.length>0,'EMPTY_INSTALLED_CONTROL');
  assert(entryOwner.selectedFineRoots>0&&entryOwner.drawCallCount>0,'EMPTY_FINE_SUBMISSION');
  assert(entryOwner.coarseRootCount>0&&entryOwner.coarseTiles>0,'COARSE_COVERAGE_MISSING');
  assert(entryOwner.perFrameUploadBytes===0,'UNEXPECTED_FRAME_UPLOAD');
  assertStableObservation(entry,controlIds);
  timing.populatedMilliseconds=performance.now()-started;
  if(diagnosticReplay){
  status.textContent='Comparing the same ground through the forward and return walk…';
  if(!qualificationView)for(const direction of ['FORWARD','RETURN'])for(let step=1;step<=8;step++){
    canvas.dispatchEvent(new WheelEvent('wheel',{deltaY:direction==='FORWARD'?-280:280,bubbles:true,cancelable:true}));
    await delay(700);
    const observation=snapshot(`${direction}_${step}`),expectedZ=control.z-4*(direction==='FORWARD'?step:8-step);
    assert(Math.abs(observation.position.x-control.x)<.01&&Math.abs(observation.position.z-expectedZ)<.01,'EXACT_WALK_POSITION_MISMATCH');
    assertStableObservation(observation,controlIds);
    assert(observation.vegetation.coarseRootCount>0&&observation.vegetation.coarseTiles>0&&observation.vegetation.drawCallCount>0,'COARSE_COVERAGE_OR_DRAW_LOST');
    assert(observation.vegetation.perFrameUploadBytes===0,'UNEXPECTED_FRAME_UPLOAD');
  }
  if(qualificationView){
    status.textContent='Capturing the bounded landscape comparison…';
    // These are final-view proofs, not frame-by-frame walking proofs. Navigate
    // through the real unchanged intake, then present the reached pose once.
    diagnosticTourMoving=true;
    try{
      if(qualificationView==='bank-view-v1'){
        await diagnosticTravel(-70,-170,controlIds);await diagnosticTravel(-27,-164,controlIds);await diagnosticAim(95);
      }else if(qualificationView==='ravine-view-v1'){
        await diagnosticTravel(-145,-280,controlIds);await diagnosticTravel(-60,-310,controlIds);await diagnosticTravel(40,-300,controlIds);await diagnosticAim(180);await diagnosticPitch(4);
      }else{
        await diagnosticTravel(-193,-218,controlIds);await diagnosticAim(86);
      }
    }finally{diagnosticTourMoving=false;}
    present(intake.getNavigationState());await delay(100);
    const view=snapshot(qualificationView);
    assertStableObservation(view,controlIds);
    assert(view.vegetation.perFrameUploadBytes===0,'VIEW_MOVEMENT_UPLOAD');
  }
  const final=snapshot('FINAL'),returnDistanceMeters=Math.hypot(final.position.x-entry.position.x,final.position.z-entry.position.z);
  if(!qualificationView)assert(returnDistanceMeters<.01,'EXACT_RETURN_MISSING');
  timing.replayCompleteMilliseconds=performance.now()-started;
  replay={schema:'H_EARTH_SINGLE_OWNER_VEGETATION_REPLAY_v1',result:qualificationView?'CAPTURED_STABLE_VIEW':'CAPTURED_POPULATED_CONTINUITY',qualificationView,sourceBaseline,input:qualificationView?'SYNTHETIC_POINTER_AND_WHEEL_THROUGH_REAL_INTAKE':'SYNTHETIC_WHEEL_THROUGH_REAL_INTAKE',
    control,controlRoots:controlIds,observations:copy(observations),requestedStepsPerDirection:qualificationView?0:8,requestedMagnitudePerStep:4,returnDistanceMeters,
    installedControlIdentityStable:true,coarseCoverageSubmittedThroughout:qualificationView?null:true,presentationScope:qualificationView?'FINAL_SUPPORTED_VIEW_ONLY':'EVERY_RECORDED_WALK_STEP',visiblePixelsVerified:false,physicalDeviceAcceptance:false,publicationAuthorized:false,
    cpuSubmissionScope:'CPU_RENDER_AND_PRESENT_CALL_DURATION_NOT_GPU_EXECUTION_TIME',timing:{...timing}};
  }
  assertRouteActive();
  if(diagnosticReplay){markReady();}else{interactiveReady=true;canvas.style.pointerEvents='auto';root.dataset.worldFirstFrameReady='true';root.dataset.singleOwnerPrototype='controls-test';loader.enableControls(intake.getNavigationState());loadingMetrics.controlsReady(resources(),intake.getNavigationState().position);status.textContent='Test controls on the landscape to unlock Enter Gratitude';}
}catch(error){
  replay={schema:'H_EARTH_SINGLE_OWNER_VEGETATION_REPLAY_v1',result:'FAILED',message:error.message,sourceBaseline,observations:copy(observations),timing:{...timing},physicalDeviceAcceptance:false,publicationAuthorized:false};
  failRoute(error);
  console.error(error);
}


