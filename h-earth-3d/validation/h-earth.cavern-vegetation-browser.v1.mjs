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


/** Populated qualification consumes actual receipt fields, never elapsed-time readiness. */
export function populatedContinuityEntryState(receipt,probe){
  const r=receipt?.resources,v=r?.vegetationResidency,f=r?.woodlandFineGrass,c=v?.nearbyFineCache,p=c?.lastPresentation;
  const counts={residentBatchCount:v?.residentBatchCount??null,totalBatchCount:v?.totalBatchCount??null,residentInstanceCount:v?.residentInstanceCount??null,totalInstanceCount:v?.totalInstanceCount??null,
    installedRoots:probe?.installedFine?.rootCount??null,selectedRoots:probe?.selectedFine?.rootCount??null,visibleContacts:f?.visibleContacts??null,drawCallCount:f?.drawCallCount??null,
    cacheKey:c?.key??null,presentationKey:p?.key??null,requestRevision:c?.requestRevision??null,presentationRequestRevision:p?.requestRevision??null};
  const conditions={PREPARATION_COMPLETE:v?.preparationComplete===true,GLOBAL_COVER_COMPLETE:v?.globalCoverComplete===true,WOODLAND_COMPLETE:v?.woodlandFineGrassReady===true,
    CANONICAL_RESIDENCY_COMPLETE:v?.complete===true&&Number.isInteger(v?.totalBatchCount)&&v.totalBatchCount>0&&v.residentBatchCount===v.totalBatchCount&&Number.isInteger(v?.totalInstanceCount)&&v.totalInstanceCount>0&&v.residentInstanceCount===v.totalInstanceCount,
    CURRENT_NEARBY_INSTALL_COMPLETE:p?.complete===true&&typeof c?.key==='string'&&c.key.length>0&&p.key===c.key&&Number.isInteger(c.requestRevision)&&c.requestRevision>0&&p.requestRevision===c.requestRevision,
    NO_NEARBY_ERROR:!v?.nearbyFineGrassError&&!c?.stickyError&&!p?.stickyError,
    ACTUAL_FINE_DRAW:f?.ready===true&&f.visibleContacts>0&&f.drawCallCount>0,
    FIXED_CONTROL_POPULATED:probe?.enabled===true&&probe?.installedFine?.rootCount>0&&probe?.selectedFine?.rootCount>0};
  const unmet=Object.keys(conditions).filter(k=>!conditions[k]);
  return {passed:unmet.length===0,unmet,counts};
}
export async function waitForPopulatedContinuity({binding,intake,timeoutMilliseconds=540000,pollMilliseconds=500,now=()=>performance.now(),delay=ms=>new Promise(resolve=>setTimeout(resolve,ms))}={}){
  if(!Number.isFinite(timeoutMilliseconds)||timeoutMilliseconds<0||timeoutMilliseconds>540000||!Number.isFinite(pollMilliseconds)||pollMilliseconds<=0||pollMilliseconds>1000)throw Error('POPULATED_ENTRY_OPTIONS_INVALID');
  const initial=intake.getNavigationState(),control={x:initial.position.x,z:initial.position.z,radius:2},started=now();let state=null,lastProbe=null,admissionSummary=null,residency=null;
  for(;;){
    const receipt=binding.getReceipt();lastProbe=binding.getVegetationProbe(control);state=populatedContinuityEntryState(receipt,lastProbe);admissionSummary=receipt.resources?.uniformGroundAdmission??null;
    const v=receipt.resources?.vegetationResidency;residency={preparationComplete:v?.preparationComplete??null,globalCoverComplete:v?.globalCoverComplete??null,woodlandFineGrassReady:v?.woodlandFineGrassReady??null,complete:v?.complete??null,nearbyFineGrassError:v?.nearbyFineGrassError??null,nearbyFineCache:v?.nearbyFineCache??null};
    const nav=intake.getNavigationState();
    if(Math.hypot(nav.position.x-control.x,nav.position.z-control.z)>.01)state={...state,passed:false,unmet:[...state.unmet,'ENTRY_CAMERA_CHANGED']};
    if(state.passed||now()-started>=timeoutMilliseconds||state.unmet.includes('ENTRY_CAMERA_CHANGED'))break;
    await delay(Math.min(pollMilliseconds,timeoutMilliseconds-(now()-started)));
  }
  return {...state,schema:'H_EARTH_POPULATED_CONTINUITY_ENTRY_v1',control,elapsedMilliseconds:now()-started,lastProbe,admissionSummary,residency,
    failureBoundary:state.passed?null:state.unmet.includes('FIXED_CONTROL_POPULATED')?'FIXED_CONTROL_EMPTY_OR_UNSELECTED':'RESIDENCY_OR_DRAW_INCOMPLETE',
    admissionDetailsAvailable:false,worldPopulationChanged:false,physicalDeviceAcceptance:false};
}
export function reconcilePopulatedContinuity(observations){
  const comparable=observations.filter(p=>p.label==='BEFORE_MOVE'||/^(FORWARD|RETURN)_/.test(p.label)),pairs=[];
  const sampleKey=s=>JSON.stringify((s??[]).map(r=>JSON.stringify(r)).sort());
  const equal=(a,b)=>Boolean(a&&b&&a.rootCount===b.rootCount&&a.membershipDigest===b.membershipDigest&&sampleKey(a.sample)===sampleKey(b.sample));
  const sampleAmbiguous=(a,b)=>Boolean(a&&b&&a.rootCount===b.rootCount&&a.membershipDigest===b.membershipDigest&&!equal(a,b)&&(a.rootCount>(a.sample?.length??0)||b.rootCount>(b.sample?.length??0)));
  for(const back of comparable.filter(p=>p.label.startsWith('RETURN_'))){
    const before=comparable.find(p=>!p.label.startsWith('RETURN_')&&Math.hypot(p.position.x-back.position.x,p.position.z-back.position.z)<.01&&Math.abs(p.position.y-back.position.y)<.01&&Math.abs(p.yawDegrees-back.yawDegrees)<.01&&Math.abs(p.pitchDegrees-back.pitchDegrees)<.01);
    if(!before)continue;
    const a=before.fixedControl,b=back.fixedControl;
    const controlMatches=Boolean(a&&b&&a.x===b.x&&a.z===b.z&&a.radius===b.radius);
    const installedEqual=controlMatches&&equal(a.installedFine,b.installedFine),selectedEqual=controlMatches&&equal(a.selectedFine,b.selectedFine);
    pairs.push({approach:before.label,returned:back.label,position:back.position,controlMatches,installedEqual,selectedEqual,
      classification:!controlMatches?'CONTROL_BINDING_MISMATCH':sampleAmbiguous(a.installedFine,b.installedFine)?'INSTALLED_SUMMARY_OR_SAMPLE_CHANGED_UNRESOLVED':!installedEqual?'INSTALLED_MEMBERSHIP_CHANGED':sampleAmbiguous(a.selectedFine,b.selectedFine)?'SELECTION_SUMMARY_OR_SAMPLE_CHANGED_UNRESOLVED':!selectedEqual?'SELECTION_CHANGED_AT_MATCHING_POSE':!(back.fineDraw?.visibleContacts>0&&back.fineDraw?.drawCallCount>0)?'NO_FINE_DRAW_SUBMISSION':'INSTALLED_AND_SELECTED_MATCH_DRAW_SUBMITTED'});
  }
  const installed=observations.filter(p=>p.fixedControl).map(p=>p.fixedControl.installedFine);
  return {pairs,matchingPosePairCount:pairs.length,installedMembershipStable:installed.length>0&&installed.every(x=>equal(installed[0],x)),
    comparisonBasis:'NONCRYPTOGRAPHIC_MEMBERSHIP_DIGEST_AND_BOUNDED_ROOT_SAMPLES',selectedMembershipMayChangeDuringTravel:true,perRootShaderVisibilityVerified:false,visiblePixelsVerified:false,physicalDeviceAcceptance:false};
}
/** Explicitly selected replay; navigation still goes through the installed wheel intake. */
export async function qualifyVegetationContinuity({canvas,intake,binding,root,stationaryMilliseconds=15000,steps=8,stepDelayMilliseconds=700,requirePopulated=false,entryTimeoutMilliseconds=540000}={}){
  if(!Number.isInteger(stationaryMilliseconds)||stationaryMilliseconds<0||stationaryMilliseconds>15000||!Number.isInteger(steps)||steps<1||steps>8||!Number.isInteger(stepDelayMilliseconds)||stepDelayMilliseconds<100||stepDelayMilliseconds>2000)throw Error('VEGETATION_CONTINUITY_REPLAY_OPTIONS_INVALID');
  if(!binding?.getVegetationTrace||binding.getVegetationTrace().enabled===false)throw Error('VEGETATION_CONTINUITY_TRACE_NOT_ENABLED');
  let entryQualification=null;
  if(requirePopulated){
    entryQualification=await waitForPopulatedContinuity({binding,intake,timeoutMilliseconds:entryTimeoutMilliseconds});
    if(!entryQualification.passed){
      const failure={schema:'H_EARTH_VEGETATION_CONTINUITY_REPLAY_v1',result:'POPULATED_ENTRY_FAILED',entryQualification,movementAttempted:false,visiblePixelsVerified:false,physicalDeviceAcceptance:false,publicationAuthorized:false};
      window.H_EARTH_VEGETATION_CONTINUITY_QUALIFICATION=failure;
      if(root)root.dataset.vegetationContinuityReplay='entry-failed';
      return failure;
    }
  }
  const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms)),started=performance.now();
  const entryTrace=requirePopulated?binding.getVegetationTrace():null;
  const observations=[],events=[];let cursor=entryTrace?.lastSequence??0,eventsDroppedByCollector=0;
  function collect(label){
    const trace=binding.getVegetationTrace({sinceSequence:cursor});cursor=trace.lastSequence;
    for(const event of trace.events){events.push(event);if(events.length>2048){events.shift();eventsDroppedByCollector++;}}
    const state=intake.getNavigationState(),r=binding.getReceipt();
    const point={label,elapsedMilliseconds:performance.now()-started,position:{...state.position},yawDegrees:state.yawDegrees,pitchDegrees:state.pitchDegrees,navigationSequence:state.sequence,
      cacheCell:{x:Math.floor(state.position.x/4),z:Math.floor(state.position.z/4)},traceSummary:{...trace,events:undefined},
      renderFrameCallCount:r.counters?.renderFrameCallCount??null,probe:binding.getVegetationProbe({x:state.position.x,z:state.position.z,radius:2})};
    if(requirePopulated){point.fixedControl=binding.getVegetationProbe(entryQualification.control);point.fineDraw={visibleContacts:r.resources?.woodlandFineGrass?.visibleContacts??null,drawCallCount:r.resources?.woodlandFineGrass?.drawCallCount??null};}
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
  if(requirePopulated){result.entryQualification=entryQualification;result.fixedControlReconciliation=reconcilePopulatedContinuity(observations);result.movementTraceStartsAfterSequence=entryTrace.lastSequence;result.entryTraceSummary={...entryTrace,events:undefined};result.woodlandOwnerBoundaryTraversed=false;}
  window.H_EARTH_VEGETATION_CONTINUITY_QUALIFICATION=result;
  if(root)root.dataset.vegetationContinuityReplay='captured';
  return result;
}
