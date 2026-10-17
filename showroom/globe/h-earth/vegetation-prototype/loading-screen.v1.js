/** Gen2795: readiness observes accepted input and successful CPU presentation calls.
 * A later animation frame is a compositor opportunity, never GPU/display proof. */
export function createHEarthLoadingScreen({document=globalThis.document,now=()=>performance.now(),requestFrame=callback=>requestAnimationFrame(callback),onEnter=()=>{}}={}){
  const started=now(),shell=document.createElement('section');shell.id='h-earth-loading-screen';
  shell.setAttribute('aria-label','H-Earth preparation');
  shell.innerHTML=`<style>
  #h-earth-loading-screen{position:fixed;inset:0;z-index:10;display:grid;place-items:center;background:radial-gradient(ellipse at 65% 20%,#30463b,#10251f 65%);color:#eef4ed;padding:24px;box-sizing:border-box}
  #h-earth-loading-screen .he-loading-panel{max-width:520px;width:100%;box-sizing:border-box}
  #h-earth-loading-screen .he-wordmark{font-size:clamp(36px,8vw,64px);font-weight:400;letter-spacing:.14em;margin:0 0 8px}
  #h-earth-loading-screen .he-kicker{color:#c5d6b7;text-transform:uppercase;letter-spacing:.14em;font-size:11px}
  #h-earth-loading-screen p{line-height:1.6;margin:12px 0}
  #h-earth-loading-screen progress{width:100%;accent-color:#bdcf9d;height:8px}
  #h-earth-loading-screen button{border:1px solid #b9cb9a;border-radius:4px;background:#d6e0c1;color:#12271e;padding:12px 24px;font:inherit;cursor:pointer}
  #h-earth-loading-screen button:disabled{opacity:.5;cursor:default}
  #h-earth-loading-screen[data-mode="test"],#h-earth-loading-screen[data-mode="ready"]{background:none;display:flex;align-items:flex-end;justify-content:flex-end;pointer-events:none;padding:16px}
  #h-earth-loading-screen[data-mode="test"] .he-loading-panel,#h-earth-loading-screen[data-mode="ready"] .he-loading-panel{width:min(400px,100%);padding:16px;background:#10251fe8;border:1px solid #526b54;border-radius:8px}
  #h-earth-loading-screen[data-mode="test"] .he-wordmark,#h-earth-loading-screen[data-mode="ready"] .he-wordmark{font-size:24px}
  #h-earth-loading-screen[data-mode="test"] .he-intro,#h-earth-loading-screen[data-mode="ready"] .he-intro{display:none}
  #h-earth-loading-screen button{pointer-events:auto}
  #h-earth-loading-screen[hidden]{display:none}
  @media(max-height:480px){#h-earth-loading-screen[data-mode="test"] p,#h-earth-loading-screen[data-mode="ready"] p{margin:5px 0;font-size:12px}}
  </style><div class="he-loading-panel"><div class="he-kicker">A world in development</div><h1 class="he-wordmark">H-EARTH</h1><p class="he-intro">Begin in the woodland, where meadow, ravine and coast belong to one landscape. This world is still taking shape. Explore at your own pace.</p><p data-loading-activity role="status" aria-live="polite">Preparing the preserved landscape…</p><progress hidden data-loading-progress></progress><p data-loading-units></p><p data-loading-instructions>Preparing terrain, vegetation and exploration controls.</p><button type="button" disabled>Enter H-Earth</button></div>`;
  document.body.appendChild(shell);
  const activity=shell.querySelector('[data-loading-activity]'),bar=shell.querySelector('[data-loading-progress]'),units=shell.querySelector('[data-loading-units]'),instructions=shell.querySelector('[data-loading-instructions]'),button=shell.querySelector('button');
  let mode='preparing',stage='world',baseline=null,lastPose=null,firstInput=null,opportunityPending=false;
  const work=new Map(),receipt={schema:'H_EARTH_INPUT_PRESENTATION_READINESS_v1',controlsEnabledMilliseconds:null,firstInputCameraChangeMilliseconds:null,firstInputPoseRenderedMilliseconds:null,nextAnimationFrameOpportunityMilliseconds:null,loaderDismissedMilliseconds:null,firstConsistentlyResponsiveTraversalMilliseconds:null,firstInputPose:null,renderedInputPose:null,firstInputPresentedFrame:null,failure:null,gpuExecutionVerified:false,displayedPixelsVerified:false,physicalDeviceAcceptance:false};
  const elapsed=()=>now()-started;
  const pose=state=>JSON.stringify([state.position.x,state.position.y,state.position.z,state.yawDegrees,state.pitchDegrees,state.verticalFovDegrees]);
  const clearUnits=()=>{bar.hidden=true;units.textContent='';};
  function beginStage(name,label){if(mode==='failed'||mode==='entered')return;stage=name;activity.textContent=label;clearUnits();}
  function update(detail={}){
    if(mode==='failed'||mode==='entered')return;
    const phase=detail.phase??stage,key=`${stage}:${phase}`;
    activity.textContent=detail.status??phase.toLowerCase().replaceAll('_',' ');
    // Only explicit work counts qualify; legacy arbitrary `progress` is ignored.
    const pairs=[['completed','total',detail.unit??'work units'],['completedRows','totalRows','rows'],['completedTiles','totalTiles','tiles'],['processedCandidates','totalCandidates','candidates']];
    const pair=pairs.find(([a,b])=>Number.isFinite(detail[a])&&Number.isFinite(detail[b])&&detail[b]>0&&detail[a]>=0&&detail[a]<=detail[b]);
    if(!pair){clearUnits();return;}
    const [a,b,unit]=pair,previous=work.get(key),total=detail[b];
    const completed=previous?.total===total?Math.max(previous.completed,detail[a]):detail[a];
    const record={stage,phase,completed,total,unit};work.set(key,record);
    bar.hidden=false;bar.max=total;bar.value=completed;
    units.textContent=`${Math.floor(completed/total*100)}% · ${completed.toLocaleString()} / ${total.toLocaleString()} ${unit} · ${phase.toLowerCase().replaceAll('_',' ')}`;
  }
  function enableControls(state){
    if(mode==='failed')return;
    baseline=pose(state);lastPose=baseline;mode='test';shell.dataset.mode=mode;
    receipt.controlsEnabledMilliseconds=elapsed();beginStage('controls','Try the controls before entering');
    instructions.textContent='Drag on the landscape to look. Slide two fingers or use the mouse wheel to move; pinch to zoom. Enter unlocks after your changed view renders.';
  }
  function observeInput(proposal,state){
    if(!['test','ready'].includes(mode)||proposal?.accepted!==true)return;
    const key=pose(state),changed=key!==lastPose;lastPose=key;
    if(!changed||key===baseline)return;
    if(receipt.firstInputCameraChangeMilliseconds===null){receipt.firstInputCameraChangeMilliseconds=elapsed();receipt.firstInputPose={navigationSequence:state.sequence,pose:key};}
    firstInput={sequence:state.sequence,pose:key};
  }
  function observePresentation(state,frame){
    if(mode!=='test'||!firstInput||firstInput.sequence!==state.sequence||firstInput.pose!==pose(state)||frame?.navigationSequence!==state.sequence||opportunityPending)return;
    receipt.firstInputPoseRenderedMilliseconds=elapsed();receipt.renderedInputPose={navigationSequence:state.sequence,pose:pose(state)};receipt.firstInputPresentedFrame={...frame};opportunityPending=true;
    activity.textContent='Changed view submitted · finishing the controls check…';
    requestFrame(()=>{
      if(mode!=='test')return;
      receipt.nextAnimationFrameOpportunityMilliseconds=elapsed();mode='ready';shell.dataset.mode=mode;button.disabled=false;
      activity.textContent='Controls check complete';instructions.textContent='Your input changed the camera and the changed view rendered. Continue exploring with the same controls.';
    });
  }
  function fail(error){mode='failed';shell.hidden=false;shell.dataset.mode=mode;button.disabled=true;clearUnits();receipt.failure={message:error?.message??String(error),elapsedMilliseconds:elapsed()};activity.textContent='H-Earth could not finish preparing';instructions.textContent=receipt.failure.message+' · Reload to try again.';}
  button.addEventListener('click',()=>{
    if(mode!=='ready'||button.disabled)return;
    receipt.loaderDismissedMilliseconds=elapsed();mode='entered';shell.hidden=true;onEnter();
  });
  return Object.freeze({beginStage,update,enableControls,observeInput,observePresentation,fail,getReceipt:()=>structuredClone({...receipt,mode,stage,workUnits:[...work.values()]})});
}
