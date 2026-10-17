/** Opt-in, read-only browser qualification of the actual public runtime graph. */
export async function qualifyCavernVegetation({canvas,intake,binding,root}){
  const started=performance.now(),assert=(value,message)=>{if(!value)throw Error('CAVERN_VEGETATION_BROWSER:'+message);};
  const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
  const initial=intake.getNavigationState();
  const {getGeologicalRuntimeBridge}=await import('../../showroom/globe/h-earth/functional-landscape/geological-runtime-bridge.v1.js?rev=gen2779-front-water-exit-v1');
  const dry=state=>{const w=getGeologicalRuntimeBridge().sampleWaterAt(state.position.x,state.position.z);assert(!w||w.y<=state.position.y-2.25+.05,'CAMERA_WALKED_UNDER_VISIBLE_WATER');};
  dry(initial);
  assert(root.dataset.run8eReady==='true','NEARBY_READY_NOT_PUBLISHED');
  assert(root.dataset.nearbyFineGrassReady==='true','NEARBY_SURVEY_NOT_COMPLETE');
  assert(Math.hypot(initial.position.x-40,initial.position.z+264)<.1,'WRONG_REAR_APPROACH');
  await delay(100);
  const arrivalResources=binding.getReceipt().resources;
  assert(arrivalResources.woodlandFineGrass?.visibleContacts>0,'NEARBY_CONTACTS_NOT_DRAWN');
  assert(arrivalResources.woodlandFineGrass?.drawCallCount>0,'NEARBY_DRAW_NOT_SUBMITTED');
  const steps=[];
  // Exercise the installed wheel intake and its real proposal-to-GPU path.
  // Synthetic browser events are diagnostic equivalents, not physical touch proof.
  for(let i=0;i<6;i++){
    canvas.dispatchEvent(new WheelEvent('wheel',{deltaY:-280,bubbles:true,cancelable:true}));
    await delay(70);
    const state=intake.getNavigationState();dry(state);
    steps.push({x:state.position.x,y:state.position.y,z:state.position.z,support:state.geologicalPhysicalSupport,floorClass:state.geologicalFloorClass});
  }
  const interior=intake.getNavigationState();
  assert(interior.geologicalPhysicalSupport&&interior.geologicalFloorClass==='INTERIOR','CAMERA_DID_NOT_ENTER_CAVERN');
  assert(Math.abs(interior.position.z+240)<.1,'WALK_DID_NOT_REACH_EXPECTED_INTERIOR');
  assert(Math.abs(interior.clearance-2.25)<.01,'INTERIOR_EYE_CLEARANCE');
  assert(interior.position.y<interior.geologicalCeilingY-.3,'CAMERA_ABOVE_ROOF');
  const navigationMilliseconds=performance.now()-started;
  // Publish early traversal evidence, then require final actual GPU residency.
  const receipt={schema:'H_EARTH_CAVERN_VEGETATION_BROWSER_v1',result:'TRAVERSAL_PASS_RESIDENCY_PENDING',input:'SYNTHETIC_WHEEL_THROUGH_REAL_INTAKE',initial:initial.position,interior:interior.position,arrivalFineGrass:arrivalResources.woodlandFineGrass,steps,navigationMilliseconds,physicalDeviceAcceptance:false,publicationAuthorized:false};
  window.H_EARTH_RENDERER_REPAIR_QUALIFICATION=receipt;
  while(performance.now()-started<540000){
    const r=binding.getReceipt().resources,v=r.vegetationResidency;
    assert(!v.nearbyFineGrassError,'NEARBY_CACHE_FAILED:'+v.nearbyFineGrassError);
    if(v.complete&&v.preparationComplete&&v.globalCoverComplete){
      assert(v.residentBatchCount===108&&v.residentInstanceCount===27585,'CANONICAL_RESIDENCY_INCOMPLETE');
      assert(r.legacyGrassDrawCensus?.checkedBatches===108&&r.legacyGrassDrawCensus.forbiddenFanMeshDraws===0,'LATE_FAN_DRAW_CENSUS');
      assert(r.vegetationVisibleSurface.geologicalExteriorTriangles>0&&r.vegetationVisibleSurface.renderedWaterTriangles>0,'FINAL_SURFACE_NOT_BOUND');
      assert(r.globalGroundCover.meadowReplacementInstanceCount===0,'ISOLATED_DENSE_MEADOW_STILL_DRAWN');
      Object.assign(receipt,{result:'PASS_BROWSER_TRAVERSAL_AND_RESIDENCY',elapsedMilliseconds:performance.now()-started,residency:v,legacyGrassDrawCensus:r.legacyGrassDrawCensus,nearby:r.woodlandFineGrass?.nearby,sharedSurface:r.vegetationVisibleSurface});
      return receipt;
    }
    await delay(250);
  }
  throw Error('CAVERN_VEGETATION_BROWSER:FINAL_RESIDENCY_TIMEOUT');
}


/** Explicitly selected replay; navigation still goes through the installed wheel intake. */
export async function qualifyVegetationContinuity({canvas,intake,binding,root,stationaryMilliseconds=15000,steps=8,stepDelayMilliseconds=700}={}){
  if(!Number.isInteger(stationaryMilliseconds)||stationaryMilliseconds<0||stationaryMilliseconds>15000||!Number.isInteger(steps)||steps<1||steps>8||!Number.isInteger(stepDelayMilliseconds)||stepDelayMilliseconds<100||stepDelayMilliseconds>2000)throw Error('VEGETATION_CONTINUITY_REPLAY_OPTIONS_INVALID');
  if(!binding?.getVegetationTrace||binding.getVegetationTrace().enabled===false)throw Error('VEGETATION_CONTINUITY_TRACE_NOT_ENABLED');
  const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms)),started=performance.now();
  const observations=[],events=[];let cursor=0,eventsDroppedByCollector=0;
  function collect(label){
    const trace=binding.getVegetationTrace({sinceSequence:cursor});cursor=trace.lastSequence;
    for(const event of trace.events){events.push(event);if(events.length>2048){events.shift();eventsDroppedByCollector++;}}
    const state=intake.getNavigationState(),r=binding.getReceipt();
    const point={label,elapsedMilliseconds:performance.now()-started,position:{...state.position},yawDegrees:state.yawDegrees,pitchDegrees:state.pitchDegrees,navigationSequence:state.sequence,
      cacheCell:{x:Math.floor(state.position.x/4),z:Math.floor(state.position.z/4)},traceSummary:{...trace,events:undefined},
      renderFrameCallCount:r.counters?.renderFrameCallCount??null,probe:binding.getVegetationProbe({x:state.position.x,z:state.position.z,radius:2})};
    observations.push(point);return point;
  }
  const initial=collect('INITIAL');
  // Drain the bounded ring during waiting; no screenshots or synchronous GPU reads.
  let remaining=stationaryMilliseconds;
  while(remaining>0){const interval=Math.min(500,remaining);await delay(interval);remaining-=interval;collect('STATIONARY');}
  const beforeMove=collect('BEFORE_MOVE');
  for(const direction of ['FORWARD','RETURN'])for(let step=0;step<steps;step++){
    canvas.dispatchEvent(new WheelEvent('wheel',{deltaY:direction==='FORWARD'?-280:280,bubbles:true,cancelable:true}));
    await delay(stepDelayMilliseconds);collect(`${direction}_${step+1}`);
  }
  // A requested return is not an asserted arrival: terrain may reject travel.
  await delay(1000);const final=collect('FINAL');
  const transitions=observations.filter((p,i)=>i&& (p.cacheCell.x!==observations[i-1].cacheCell.x||p.cacheCell.z!==observations[i-1].cacheCell.z)).length;
  const result={schema:'H_EARTH_VEGETATION_CONTINUITY_REPLAY_v1',result:'TRACE_CAPTURED_VISUAL_VERDICT_NOT_ESTABLISHED',sourceBaseline:'fac9d64c29cfc8c55637a15905d89ca0977293e0',candidateIdentityBinding:'EXTERNAL_EXACT_HEAD_REQUIRED',input:'SYNTHETIC_WHEEL_THROUGH_REAL_INTAKE',
    requestedStepsPerDirection:steps,requestedMagnitudePerStep:4,initial,preparedObservation:beforeMove,final,cacheCellTransitions:transitions,returnDistanceMeters:Math.hypot(final.position.x-initial.position.x,final.position.z-initial.position.z),
    movementObserved:observations.some(p=>Math.hypot(p.position.x-initial.position.x,p.position.z-initial.position.z)>.05),observations,events,eventsDroppedByCollector,
    traceMayLoseEvents:true,timingPerturbed:true,physicalDeviceAcceptance:false,visiblePixelsVerified:false,exactOwnerVideoRouteReproduced:false,
    pilotBoundaryTraversalVerified:false,shorelineAgreementVerified:false,publicationAuthorized:false,elapsedMilliseconds:performance.now()-started};
  window.H_EARTH_VEGETATION_CONTINUITY_QUALIFICATION=result;
  if(root)root.dataset.vegetationContinuityReplay='captured';
  return result;
}
