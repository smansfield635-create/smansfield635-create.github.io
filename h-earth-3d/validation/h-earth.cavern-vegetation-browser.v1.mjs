/** Opt-in, read-only browser qualification of the actual public runtime graph. */
export async function qualifyCavernVegetation({canvas,intake,binding,root}){
  const started=performance.now(),assert=(value,message)=>{if(!value)throw Error('CAVERN_VEGETATION_BROWSER:'+message);};
  const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
  const initial=intake.getNavigationState();
  assert(root.dataset.run8eReady==='true','NEARBY_READY_NOT_PUBLISHED');
  assert(root.dataset.nearbyFineGrassReady==='true','NEARBY_SURVEY_NOT_COMPLETE');
  assert(Math.hypot(initial.position.x-40,initial.position.z+300)<.1,'WRONG_REAR_APPROACH');
  await delay(100);
  const arrivalResources=binding.getReceipt().resources;
  assert(arrivalResources.woodlandFineGrass?.visibleContacts>0,'NEARBY_CONTACTS_NOT_DRAWN');
  assert(arrivalResources.woodlandFineGrass?.drawCallCount>0,'NEARBY_DRAW_NOT_SUBMITTED');
  const steps=[];
  // Exercise the installed wheel intake and its real proposal-to-GPU path.
  // Synthetic browser events are diagnostic equivalents, not physical touch proof.
  for(let i=0;i<15;i++){
    canvas.dispatchEvent(new WheelEvent('wheel',{deltaY:-280,bubbles:true,cancelable:true}));
    await delay(70);
    const state=intake.getNavigationState();
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
