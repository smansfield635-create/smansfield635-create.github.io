/** Gen2795: readiness observes accepted input and successful CPU presentation calls.
 * A later animation frame is a compositor opportunity, never GPU/display proof. */
export function createHEarthLoadingScreen({document=globalThis.document,now=()=>performance.now(),requestFrame=callback=>requestAnimationFrame(callback),onEnter=()=>{},schedule=(callback,ms)=>setTimeout(callback,ms),cancelSchedule=id=>clearTimeout(id)}={}){
  const started=now(),shell=document.createElement('section');shell.id='h-earth-loading-screen';
  shell.setAttribute('aria-label','Gratitude preparation');shell.dataset.mode='preparing';
  shell.innerHTML=`<style>
  #h-earth-loading-screen{position:fixed;inset:0;z-index:10;display:grid;align-items:center;overflow:auto;background:#102b28;color:#f4efdc;padding:clamp(24px,6vw,80px);box-sizing:border-box;font:16px/1.5 system-ui,sans-serif;isolation:isolate}
  #h-earth-loading-screen *{box-sizing:border-box}
  #h-earth-loading-screen .he-landscape{position:absolute;inset:0;width:100%;height:100%;z-index:-1;pointer-events:none}
  #h-earth-loading-screen .he-loading-panel{width:min(620px,100%);padding:30px 0}
  #h-earth-loading-screen .he-wordmark{font:400 clamp(48px,10vw,100px)/1.05 Georgia,serif;letter-spacing:-.045em;margin:14px 0 18px}
  #h-earth-loading-screen .he-kicker{color:#d9c58e;text-transform:uppercase;letter-spacing:.24em;font-size:11px;font-weight:600}
  #h-earth-loading-screen .he-deck{max-width:370px;color:#d1ded0;font-size:17px;line-height:1.65}
  #h-earth-loading-screen .he-story{margin:32px 0 24px;padding-left:20px;border-left:1px solid #b6c59b77;max-width:410px;min-height:150px}
  #h-earth-loading-screen .he-story h2{font:400 26px/1.2 Georgia,serif;margin:9px 0}
  #h-earth-loading-screen .he-story p{color:#ced9cc;line-height:1.6;margin:10px 0}
  #h-earth-loading-screen .he-story-controls{display:flex;align-items:center;gap:16px;font-size:11px;color:#d9c58e;letter-spacing:.12em}
  #h-earth-loading-screen button{pointer-events:auto;font:inherit;cursor:pointer}
  #h-earth-loading-screen .he-story-controls button{border:0;background:transparent;color:#dce3d1;padding:9px 4px;text-decoration:underline;text-underline-offset:4px;min-height:44px}
  #h-earth-loading-screen .he-preparation{border-top:1px solid #b6c59b44;padding-top:18px;max-width:430px;font-size:13px}
  #h-earth-loading-screen [data-loading-activity]{margin:0 0 8px;color:#f1eddb}
  #h-earth-loading-screen [data-loading-instructions],#h-earth-loading-screen [data-loading-units]{color:#c5d2c3;font-size:12px;line-height:1.6;overflow-wrap:anywhere}
  #h-earth-loading-screen progress{width:100%;accent-color:#d9c58e;height:6px}
  #h-earth-loading-screen [data-enter]{border:1px solid #c8d2ae;border-radius:3px;background:#dce2c4;color:#162e25;padding:12px 22px;margin-top:6px;min-height:46px}
  #h-earth-loading-screen [data-enter]:disabled{background:transparent;color:#b6c4b4;border-color:#718b7966;cursor:default}
  #h-earth-loading-screen button:focus-visible{outline:2px solid #efcf7c;outline-offset:4px}
  #h-earth-loading-screen[data-mode="test"],#h-earth-loading-screen[data-mode="ready"]{background:none;display:flex;align-items:flex-end;justify-content:flex-end;pointer-events:none;padding:16px}
  #h-earth-loading-screen[data-mode="test"] .he-loading-panel,#h-earth-loading-screen[data-mode="ready"] .he-loading-panel{width:min(400px,100%);padding:18px;background:#102b28f2;border:1px solid #526b54;border-radius:8px}
  #h-earth-loading-screen[data-mode="test"] .he-wordmark,#h-earth-loading-screen[data-mode="ready"] .he-wordmark{font-size:30px;margin:0 0 12px}
  #h-earth-loading-screen[data-mode="test"] .he-intro,#h-earth-loading-screen[data-mode="ready"] .he-intro,#h-earth-loading-screen[data-mode="test"] .he-landscape,#h-earth-loading-screen[data-mode="ready"] .he-landscape{display:none}
  #h-earth-loading-screen[hidden]{display:none}
  @media(max-width:600px){#h-earth-loading-screen{align-items:start;background:#102b28}#h-earth-loading-screen .he-loading-panel{padding:24px 0}#h-earth-loading-screen .he-landscape{opacity:.48}#h-earth-loading-screen .he-story{margin:24px 0 16px;min-height:175px}#h-earth-loading-screen .he-wordmark{font-size:clamp(46px,13vw,76px)}}
  @media(max-height:560px) and (min-width:601px){#h-earth-loading-screen{padding:20px 36px}#h-earth-loading-screen .he-loading-panel{width:100%;max-width:900px;display:grid;grid-template-columns:1fr 1fr;column-gap:40px;padding:0}#h-earth-loading-screen .he-wordmark{font-size:56px}#h-earth-loading-screen .he-story{grid-column:2;grid-row:1 / 4;margin:12px 0}#h-earth-loading-screen .he-preparation{grid-column:1 / -1}#h-earth-loading-screen[data-mode="test"] .he-loading-panel,#h-earth-loading-screen[data-mode="ready"] .he-loading-panel{display:block}#h-earth-loading-screen[data-mode="test"] p,#h-earth-loading-screen[data-mode="ready"] p{margin:5px 0}}
  @media(prefers-reduced-motion:reduce){#h-earth-loading-screen{scroll-behavior:auto}}
  </style>
  <svg class="he-landscape" aria-hidden="true" viewBox="0 0 1200 900" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="gr-sky" x2="0" y2="1"><stop stop-color="#233f39"/><stop offset="1" stop-color="#698478"/></linearGradient><linearGradient id="gr-shade"><stop stop-color="#102b28"/><stop offset=".48" stop-color="#102b28" stop-opacity=".93"/><stop offset="1" stop-color="#102b28" stop-opacity=".08"/></linearGradient></defs><path fill="url(#gr-sky)" d="M0 0h1200v900H0z"/><circle cx="950" cy="200" r="72" fill="#e4d8a7" opacity=".55"/><path fill="#526e60" d="M0 630Q170 480 340 520T660 420Q800 130 940 410T1200 370V900H0Z"/><path fill="#38594d" d="M0 660Q220 430 410 650Q610 620 810 440T1200 570V900H0Z"/><path fill="#25483e" d="M0 730Q260 590 500 710T920 620T1200 680V900H0Z"/><path fill="none" stroke="#b1c1a0" stroke-opacity=".25" stroke-width="2" d="M790 900Q660 810 865 730T935 610M823 900Q685 812 885 736T955 615"/><path fill="#18392f" d="M0 810Q220 720 420 805T750 810Q1000 730 1200 830V900H0Z"/><path fill="url(#gr-shade)" d="M0 0h1200v900H0z"/></svg>
  <div class="he-loading-panel"><div class="he-kicker he-intro">A continent in development</div><h1 class="he-wordmark">Gratitude</h1><div class="he-deck he-intro">A landscape taking shape.<br>A place to explore at your own pace.</div>
  <div class="he-story he-intro"><div class="he-kicker" data-story-label>Begin in the woodland</div><h2 data-story-title>Every journey starts somewhere.</h2><p data-story-copy>Arrive among the trees. Beyond the grove, meadow, ravine and coast belong to one connected landscape.</p><div class="he-story-controls"><span data-story-count>01 / 03</span><button type="button" data-story-pause aria-pressed="false">Pause stories</button><button type="button" data-story-next aria-label="Next introduction passage">Next</button></div></div>
  <div class="he-preparation"><p data-loading-activity role="status" aria-live="polite">Preparing the landscape…</p><progress hidden data-loading-progress aria-label="Current preparation stage"></progress><p data-loading-units></p><p data-loading-instructions>Preparing terrain, vegetation and exploration controls.</p><button type="button" data-enter disabled>Enter Gratitude</button></div></div>`;
  document.body.appendChild(shell);
  const activity=shell.querySelector('[data-loading-activity]'),bar=shell.querySelector('[data-loading-progress]'),units=shell.querySelector('[data-loading-units]'),instructions=shell.querySelector('[data-loading-instructions]'),button=shell.querySelector('[data-enter]');
  let mode='preparing',stage='world',baseline=null,lastPose=null,firstInput=null,opportunityPending=false;
  const passages=[
    ['Begin in the woodland','Every journey starts somewhere.','Arrive among the trees. Beyond the grove, meadow, ravine and coast belong to one connected landscape.'],
    ['Follow the land','From open meadow to sheltered ravine.','Gratitude unfolds through changing ground: rounded foothills, grassy banks and water shaping the land.'],
    ['A continent taking shape','You are arriving during its becoming.','Gratitude is still in development. Its landscapes are being refined into a continuous place to explore.']
  ];
  const storyLabel=shell.querySelector('[data-story-label]'),storyTitle=shell.querySelector('[data-story-title]'),storyCopy=shell.querySelector('[data-story-copy]'),storyCount=shell.querySelector('[data-story-count]'),pause=shell.querySelector('[data-story-pause]'),next=shell.querySelector('[data-story-next]');
  let storyIndex=0,storyTimer=null,storiesPaused=false;
  function stopStories(){if(storyTimer!==null)cancelSchedule(storyTimer);storyTimer=null;}
  function showNextStory(){storyIndex=(storyIndex+1)%passages.length;const [label,title,copy]=passages[storyIndex];storyLabel.textContent=label;storyTitle.textContent=title;storyCopy.textContent=copy;storyCount.textContent=`0${storyIndex+1} / 03`;}
  function scheduleStory(){stopStories();if(mode==='preparing'&&!storiesPaused)storyTimer=schedule(()=>{storyTimer=null;if(mode!=='preparing'||storiesPaused)return;showNextStory();scheduleStory();},8000);}
  pause.addEventListener('click',()=>{storiesPaused=!storiesPaused;pause.textContent=storiesPaused?'Resume stories':'Pause stories';pause.setAttribute('aria-pressed',String(storiesPaused));scheduleStory();});
  next.addEventListener('click',()=>{if(mode!=='preparing')return;showNextStory();scheduleStory();});
  scheduleStory();
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
    if(mode!=='preparing')return;
    stopStories();baseline=pose(state);lastPose=baseline;mode='test';shell.dataset.mode=mode;
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
  function fail(error){
    if(mode==='failed')return;
    stopStories();mode='failed';shell.hidden=false;shell.dataset.mode=mode;button.disabled=true;pause.disabled=true;next.disabled=true;clearUnits();
    receipt.failure={message:error?.message??String(error),elapsedMilliseconds:elapsed()};
    const graphics=/OWNER_(SHADER|PROGRAM|LINK|CONTEXT)|GRAPHICS_CONTEXT_LOST/.test(receipt.failure.message);
    activity.textContent=graphics?'Graphics preparation stopped':'Gratitude could not finish preparing';
    instructions.textContent=(graphics?'The graphics system could not finish this scene. Reload to try again. ':'Preparation stopped. Reload to try again. ')+'Details: '+receipt.failure.message;
  }
  button.addEventListener('click',()=>{
    if(mode!=='ready'||button.disabled)return;
    stopStories();receipt.loaderDismissedMilliseconds=elapsed();mode='entered';shell.hidden=true;onEnter();
  });
  return Object.freeze({beginStage,update,enableControls,observeInput,observePresentation,fail,getReceipt:()=>structuredClone({...receipt,mode,stage,workUnits:[...work.values()]})});
}
