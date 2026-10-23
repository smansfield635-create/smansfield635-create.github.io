/** Gen2795: readiness observes accepted input and successful CPU presentation calls.
 * A later animation frame is a compositor opportunity, never GPU/display proof. */
export function createHEarthLoadingScreen({document=globalThis.document,now=()=>performance.now(),requestFrame=callback=>requestAnimationFrame(callback),onEnter=()=>{},schedule=(callback,ms)=>setTimeout(callback,ms),cancelSchedule=id=>clearTimeout(id),startedAt=null}={}){
  const started=startedAt??now(),existing=document.getElementById?.('h-earth-loading-screen'),shell=existing??document.createElement('section');shell.id='h-earth-loading-screen';
  shell.setAttribute('aria-label','Gratitude preparation');shell.dataset.mode='preparing';
  if(!existing)shell.innerHTML=`<style>
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
  @media(max-width:600px){#h-earth-loading-screen{align-items:start;background:#102b28}#h-earth-loading-screen .he-loading-panel{padding:24px 0}#h-earth-loading-screen .he-landscape{opacity:1}#h-earth-loading-screen .he-story{margin:24px 0 16px;min-height:175px}#h-earth-loading-screen .he-wordmark{font-size:clamp(46px,13vw,76px)}}
  @media(max-height:560px) and (min-width:601px){#h-earth-loading-screen{padding:20px 36px}#h-earth-loading-screen .he-loading-panel{width:100%;max-width:900px;display:grid;grid-template-columns:1fr 1fr;column-gap:40px;padding:0}#h-earth-loading-screen .he-wordmark{font-size:56px}#h-earth-loading-screen .he-story{grid-column:2;grid-row:1 / 4;margin:12px 0}#h-earth-loading-screen .he-preparation{grid-column:1 / -1}#h-earth-loading-screen[data-mode="test"] .he-loading-panel,#h-earth-loading-screen[data-mode="ready"] .he-loading-panel{display:block}#h-earth-loading-screen[data-mode="test"] p,#h-earth-loading-screen[data-mode="ready"] p{margin:5px 0}}
  @media(prefers-reduced-motion:reduce){#h-earth-loading-screen{scroll-behavior:auto}}
  #h-earth-loading-screen .he-cloud{animation:he-drift 22s ease-in-out infinite alternate}
  #h-earth-loading-screen .he-fireflies{animation:he-glimmer 4s ease-in-out infinite alternate}
  #h-earth-loading-screen .he-sun{animation:he-dawn 14s ease-in-out infinite alternate}
  #h-earth-loading-screen .he-stage-track{display:flex;gap:14px;flex-wrap:wrap;color:#9cae9c;font-size:10px;letter-spacing:.12em;text-transform:uppercase;margin:0 0 14px}
  #h-earth-loading-screen .he-stage-track span[data-active="true"]{color:#ffe2a2;border-bottom:2px solid #e1c485;padding-bottom:5px}
  #h-earth-loading-screen [data-loading-clock]{font-variant-numeric:tabular-nums;color:#e7d8ad;margin:10px 0}
  #h-earth-loading-screen .he-pulse{display:inline-block;width:6px;height:6px;border-radius:50%;background:#e7cc8a;margin-right:9px;animation:he-glimmer 1.5s ease-in-out infinite alternate}
  #h-earth-loading-screen[data-paused="true"] .he-landscape *,#h-earth-loading-screen[data-paused="true"] .he-pulse,#h-earth-loading-screen[data-mode="failed"] *{animation-play-state:paused}
  @keyframes he-drift{to{transform:translateX(35px)}}
  @keyframes he-glimmer{from{opacity:.25}to{opacity:1}}
  @keyframes he-dawn{to{transform:translateY(-12px);opacity:.65}}
  @media(prefers-reduced-motion:reduce){#h-earth-loading-screen *{animation:none!important}}
  </style>
  <svg class="he-landscape" aria-hidden="true" viewBox="0 0 1200 900" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="gr-sky" x2="0" y2="1"><stop stop-color="#152f49"/><stop offset="1" stop-color="#d2ad77"/></linearGradient><linearGradient id="gr-shade"><stop stop-color="#102b28"/><stop offset=".48" stop-color="#102b28" stop-opacity=".68"/><stop offset="1" stop-color="#102b28" stop-opacity="0"/></linearGradient></defs><path fill="url(#gr-sky)" d="M0 0h1200v900H0z"/><circle class="he-sun" cx="950" cy="260" r="96" fill="#f5d895" opacity=".86"/><g class="he-cloud" fill="none" stroke="#f4e6cd" stroke-width="2" opacity=".22"><path d="M500 170q180-45 430 0M690 200q180-28 410 0M520 320q260-40 600 0"/></g><path class="he-far" fill="#687971" d="M0 630Q170 480 340 520T660 420Q800 130 940 410T1200 370V900H0Z"/><path class="he-near" fill="#426f60" d="M0 660Q220 430 410 650Q610 620 810 440T1200 570V900H0Z"/><path fill="#245443" d="M0 730Q260 590 500 710T920 620T1200 680V900H0Z"/><path fill="none" stroke="#b1c1a0" stroke-opacity=".65" stroke-width="4" d="M790 900Q660 810 865 730T935 610M823 900Q685 812 885 736T955 615"/><path fill="#18392f" d="M0 810Q220 720 420 805T750 810Q1000 730 1200 830V900H0Z"/><g fill="#0b302a"><path d="M1060 870V570l-45 95h27l-48 85h48l-57 95h75zm0-300 45 95h-27l48 85h-48l57 95h-75M1150 900V640l-35 75h20l-40 75h40l-44 80h59zm0-260 35 75h-20l40 75h-40l44 80h-59"/></g><g class="he-fireflies" fill="#fbe5a3"><circle cx="840" cy="660" r="2"/><circle cx="930" cy="790" r="3"/><circle cx="1100" cy="530" r="2"/><circle cx="730" cy="720" r="2"/><circle cx="990" cy="690" r="2"/></g><path fill="url(#gr-shade)" d="M0 0h1200v900H0z"/></svg>
  <div class="he-loading-panel"><div class="he-kicker he-intro">A continent in development</div><h1 class="he-wordmark">Gratitude</h1><div class="he-deck he-intro">A landscape taking shape.<br>A place to explore at your own pace.</div>
  <div class="he-story he-intro"><div class="he-kicker" data-story-label>Begin in the woodland</div><h2 data-story-title>Every journey starts somewhere.</h2><p data-story-copy>Arrive among the trees. Beyond the grove, meadow, ravine and coast belong to one connected landscape.</p><div class="he-story-controls"><span data-story-count>01 / 03</span><button type="button" data-story-pause aria-pressed="false">Pause stories</button><button type="button" data-story-next aria-label="Next introduction passage">Next</button></div></div>
  <div class="he-preparation"><div class="he-stage-track" aria-label="Preparation stages"><span data-step="world" data-active="true">01 Landscape</span><span data-step="vegetation">02 Vegetation</span><span data-step="controls">03 Explore</span></div><div><span class="he-pulse" aria-hidden="true"></span><span data-loading-clock>Opening Gratitude…</span></div><p data-loading-activity role="status" aria-live="polite">Preparing the landscape…</p><progress hidden data-loading-progress aria-label="Current preparation stage"></progress><p data-loading-units></p><p data-loading-instructions>Your journey is being prepared. Each stage reports its own progress.</p><button type="button" data-enter disabled>Enter Gratitude</button></div></div>`;
  if(!existing)document.body.appendChild(shell);
  const activity=shell.querySelector('[data-loading-activity]'),bar=shell.querySelector('[data-loading-progress]'),units=shell.querySelector('[data-loading-units]'),instructions=shell.querySelector('[data-loading-instructions]'),button=shell.querySelector('[data-enter]');
  const reportPanel=document.createElement('div');
  reportPanel.style.cssText='pointer-events:auto;margin-top:12px;max-width:100%';
  const copyButton=document.createElement('button');copyButton.type='button';copyButton.setAttribute('data-copy-loading-report','');copyButton.textContent='Copy loading report';
  copyButton.style.cssText='padding:10px 14px;min-height:44px;background:#183c34;color:#f4efdc;border:1px solid #718b79;border-radius:3px';
  const reportStatus=document.createElement('p');reportStatus.setAttribute('data-loading-report-status','');reportStatus.setAttribute('role','status');reportStatus.style.cssText='font-size:12px;margin:6px 0';
  const reportText=document.createElement('textarea');reportText.setAttribute('data-loading-report-text','');reportText.setAttribute('aria-label','Loading report — select and copy');reportText.readOnly=true;reportText.hidden=true;
  reportText.style.cssText='width:100%;height:150px;font:12px/1.4 monospace;user-select:text;pointer-events:auto';
  reportPanel.appendChild(copyButton);reportPanel.appendChild(reportStatus);reportPanel.appendChild(reportText);
  (shell.querySelector('.he-preparation')??shell).appendChild(reportPanel);
  let reportProvider=()=>({});
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
  pause.addEventListener('click',()=>{storiesPaused=!storiesPaused;pause.textContent=storiesPaused?'Resume stories':'Pause stories';shell.dataset.paused=String(storiesPaused);pause.setAttribute('aria-pressed',String(storiesPaused));scheduleStory();});
  next.addEventListener('click',()=>{if(mode!=='preparing')return;showNextStory();scheduleStory();});
  scheduleStory();
  const work=new Map(),receipt={schema:'H_EARTH_INPUT_PRESENTATION_READINESS_v1',controlsEnabledMilliseconds:null,firstInputCameraChangeMilliseconds:null,firstInputPoseRenderedMilliseconds:null,nextAnimationFrameOpportunityMilliseconds:null,loaderDismissedMilliseconds:null,firstConsistentlyResponsiveTraversalMilliseconds:null,firstInputPose:null,renderedInputPose:null,firstInputPresentedFrame:null,failure:null,gpuExecutionVerified:false,displayedPixelsVerified:false,physicalDeviceAcceptance:false};
  const elapsed=()=>now()-started;
  const clock=shell.querySelector('[data-loading-clock]');
  const refreshClock=()=>{clock.textContent=`${Math.floor(elapsed()/1000)}s elapsed`;};
  refreshClock();
  const clockTimer=document.defaultView?.setInterval(refreshClock,1000);
  const stopClock=()=>{if(clockTimer!==undefined)document.defaultView.clearInterval(clockTimer);refreshClock();};
  const stages=[];
  const labels={SINGLE_POPULATION_DOWNLOADING:'Downloading the vegetation',SINGLE_POPULATION_VERIFYING:'Checking the vegetation data',SINGLE_POPULATION_DECOMPRESSING:'Unpacking the vegetation',SINGLE_POPULATION_DECODING:'Preparing the grass',SINGLE_POPULATION_PREPARING:'Preparing the vegetation',SOIL_MASK_LOADING:'Preparing the ground',SINGLE_POPULATION_RESIDENT:'Vegetation ready',RAW_PACKAGE_PREPARING:'Preparing the landscape',CANONICAL_PACKAGE_READY:'Landscape ready'};
  const pose=state=>JSON.stringify([state.position.x,state.position.y,state.position.z,state.yawDegrees,state.pitchDegrees,state.verticalFovDegrees]);
  const clearUnits=()=>{bar.hidden=true;units.textContent='';};
  function beginStage(name,label){if(mode==='failed'||mode==='entered')return;stage=name;stages.push({stage:name,elapsedMilliseconds:elapsed()});for(const key of ['world','vegetation','controls'])shell.querySelector(`[data-step="${key}"]`)?.setAttribute('data-active',String((name==='renderer'?'world':name)===key));activity.textContent=label;clearUnits();}
  function update(detail={}){
    if(mode==='failed'||mode==='entered')return;
    const phase=detail.phase??stage,key=`${stage}:${phase}`;
    receipt.phaseTimings??={};const observed=elapsed();
    receipt.phaseTimings[key]??={firstObservedMilliseconds:observed};
    receipt.phaseTimings[key].lastObservedMilliseconds=observed;
    activity.textContent=detail.status??labels[phase]??phase.toLowerCase().replaceAll('_',' ');
    // Only explicit work counts qualify; legacy arbitrary `progress` is ignored.
    const pairs=[['completed','total',detail.unit??'work units'],['loadedContacts','totalContacts','plants'],['loadedBytes','totalBytes','bytes'],['completedRows','totalRows','rows'],['completedTiles','totalTiles','tiles'],['processedCandidates','totalCandidates','candidates']];
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
    stopStories();stopClock();baseline=pose(state);lastPose=baseline;mode='test';shell.dataset.mode=mode;
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
    stopStories();stopClock();mode='failed';shell.hidden=false;shell.dataset.mode=mode;button.disabled=true;pause.disabled=true;next.disabled=true;clearUnits();
    receipt.failure={message:error?.message??String(error),elapsedMilliseconds:elapsed()};
    const graphics=/OWNER_(SHADER|PROGRAM|LINK|CONTEXT)|GRAPHICS_CONTEXT_LOST/.test(receipt.failure.message);
    activity.textContent=graphics?'Graphics preparation stopped':'Gratitude could not finish preparing';
    instructions.textContent=(graphics?'The graphics system could not finish this scene. Reload to try again. ':'Preparation stopped. Reload to try again. ')+'Details: '+receipt.failure.message;
  }
  button.addEventListener('click',()=>{
    if(mode!=='ready'||button.disabled)return;
    stopStories();stopClock();receipt.loaderDismissedMilliseconds=elapsed();mode='entered';shell.hidden=true;onEnter();
  });
  function getLoadingReport(){
    let details;try{details=reportProvider();}catch(error){details={diagnosticError:error?.message??String(error)};}
    return {schema:'GRATITUDE_LOADING_REPORT_v1',reportVersion:'gen2867-copy-report-v1',
      capturedAt:new Date().toISOString(),elapsedMilliseconds:Math.round(elapsed()),
      preparationMilliseconds:receipt.controlsEnabledMilliseconds??receipt.failure?.elapsedMilliseconds??Math.round(elapsed()),
      mode,stage,failure:structuredClone(receipt.failure),controlsEnabledMilliseconds:receipt.controlsEnabledMilliseconds,
      stages:structuredClone(stages),phaseObservations:structuredClone(receipt.phaseTimings??{}),
      phaseTimingNote:'Phase observations can overlap and are not additive durations. Preparation time stops when controls enable.',
      workUnits:structuredClone([...work.values()]),details};
  }
  async function copyLoadingReport(){
    const text=JSON.stringify(getLoadingReport(),null,2);reportText.value=text;
    try{
      const clipboard=document.defaultView?.navigator?.clipboard??globalThis.navigator?.clipboard;
      if(typeof clipboard?.writeText!=='function')throw Error('CLIPBOARD_UNAVAILABLE');
      await clipboard.writeText(text);reportText.hidden=true;reportStatus.textContent='Report copied. Paste it into your chat.';
      return true;
    }catch{
      reportText.hidden=false;reportText.focus();reportText.select();
      reportStatus.textContent='Automatic copy unavailable. Select and copy the report below.';return false;
    }
  }
  copyButton.addEventListener('click',()=>{void copyLoadingReport();});
  return Object.freeze({getLoadingReport,copyLoadingReport,setReportProvider:provider=>{if(typeof provider==='function')reportProvider=provider;},beginStage,update,enableControls,observeInput,observePresentation,fail,getReceipt:()=>structuredClone({...receipt,mode,stage,stages,workUnits:[...work.values()]})});
}
