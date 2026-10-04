const STAGES=Object.freeze([
  ['CANVAS_ACQUIRED',8,'Preparing world surface'],
  ['WEBGL2_CONTEXT_REQUESTED',14,'Starting graphics engine'],
  ['WEBGL2_CONTEXT_ACQUIRED',22,'Graphics engine online'],
  ['WEBGL_IDENTITY_CAPTURED',28,'Reading device capabilities'],
  ['RENDERER_CONSTRUCTOR_ENTERED',34,'Constructing world renderer'],
  ['RENDERER_CONSTRUCTOR_RETURNED',40,'Renderer constructed'],
  ['INITIALIZATION_ENTERED',46,'Initializing environment'],
  ['VERTEX_SHADER_COMPILED',54,'Preparing world geometry'],
  ['FRAGMENT_SHADER_COMPILED',60,'Preparing light and atmosphere'],
  ['PROGRAM_LINKED',66,'Linking GPU presentation'],
  ['GPU_RESOURCES_CREATED',74,'Loading world resources'],
  ['FRAMEBUFFER_VALIDATED',82,'Validating display surface'],
  ['INITIAL_DRAW_ENTERED',88,'Drawing first world frame'],
  ['INITIAL_DRAW_RETURNED',92,'First draw complete'],
  ['FIRST_FRAME_PRESENTED',97,'Presenting H-Earth'],
  ['READY_PUBLISHED',100,'H-Earth ready']
]);
const PROGRESS=Object.freeze(Object.fromEntries(STAGES.map(([stage,value])=>[stage,value])));
const LABEL=Object.freeze(Object.fromEntries(STAGES.map(([stage,,label])=>[stage,label])));
const NEXT_LIMIT=Object.freeze(Object.fromEntries(STAGES.map(([stage,value],index)=>[stage,(STAGES[index+1]?.[1]??100)-1])));
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
const style=document.createElement('style');
style.textContent=`
.h-earth-experience-loader{position:fixed;inset:0;box-sizing:border-box;z-index:2147483600;display:grid;place-items:center;padding:24px;background:radial-gradient(circle at 50% 70%,rgba(18,67,79,.34),transparent 40%),linear-gradient(180deg,#07151d 0%,#082431 52%,#07161b 100%);color:#eef8f6;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;transition:opacity .5s ease,visibility .5s ease}
.h-earth-experience-loader[data-ready="true"]{inset:auto 12px max(96px,calc(env(safe-area-inset-bottom) + 84px)) 12px;place-items:stretch;padding:0;background:transparent;pointer-events:none;transition:opacity .25s ease,visibility .25s ease}
.h-earth-experience-loader[data-ready="true"] .h-earth-experience-loader__card{width:min(420px,calc(100vw - 24px));max-height:28vh;overflow:hidden;padding:12px 14px;border-radius:16px;background:rgba(2,13,18,.9);box-shadow:0 12px 36px rgba(0,0,0,.38);backdrop-filter:blur(12px)}
.h-earth-experience-loader[data-ready="true"] .h-earth-experience-loader__eyebrow{margin:0 0 5px;font-size:.56rem;letter-spacing:.12em}
.h-earth-experience-loader[data-ready="true"] .h-earth-experience-loader__headline{font-size:1.08rem;line-height:1.1;letter-spacing:-.02em}
.h-earth-experience-loader[data-ready="true"] .h-earth-experience-loader__status{margin:5px 0 0;font-size:.76rem;line-height:1.35}
.h-earth-experience-loader[data-ready="true"] .h-earth-experience-loader__rail,.h-earth-experience-loader[data-ready="true"] .h-earth-experience-loader__meta,.h-earth-experience-loader[data-ready="true"] .h-earth-experience-loader__steps,.h-earth-experience-loader[data-ready="true"] .h-earth-experience-loader__note{display:none}
.h-earth-experience-loader[data-ready="true"] .h-earth-experience-loader__actions{display:none!important}
.h-earth-experience-loader[data-complete="true"]{opacity:0;visibility:hidden;pointer-events:none}
.h-earth-experience-loader[data-ready="true"] .h-earth-experience-loader__vegetation{display:block;margin-top:10px}
.h-earth-experience-loader__vegetation[hidden]{display:none!important}
.h-earth-experience-loader__vegetation-meta{display:flex;justify-content:space-between;gap:10px;margin-bottom:5px;color:rgba(238,248,246,.7);font-size:.66rem}
.h-earth-experience-loader__vegetation-meta strong{color:#e8fbf3;font-variant-numeric:tabular-nums}
.h-earth-experience-loader__vegetation-rail{position:relative;height:6px;overflow:hidden;border-radius:999px;background:rgba(255,255,255,.1)}
.h-earth-experience-loader__vegetation-fill{position:relative;width:0;height:100%;border-radius:inherit;background:linear-gradient(90deg,#4da8b6,#8ed6c1,#d9f5e8);box-shadow:0 0 14px rgba(122,220,198,.38);transition:width .3s ease}
.h-earth-experience-loader__vegetation-rail[data-indeterminate="true"] .h-earth-experience-loader__vegetation-fill{width:34%;animation:hEarthStageActivity 1.25s linear infinite}
.h-earth-experience-loader__vegetation-rail[role="progressbar"]{outline:none}
@media(max-width:520px){.h-earth-experience-loader[data-ready="true"]{inset:auto 10px max(96px,calc(env(safe-area-inset-bottom) + 84px)) 10px}.h-earth-experience-loader[data-ready="true"] .h-earth-experience-loader__card{width:100%;padding:11px 12px}}
.h-earth-experience-loader__card{box-sizing:border-box;width:min(760px,92vw);max-width:100%;max-height:calc(100vh - 48px);max-height:calc(100dvh - 48px);overflow:auto;padding:clamp(24px,5vw,48px);border:1px solid rgba(220,242,238,.22);border-radius:28px;background:rgba(2,13,18,.72);box-shadow:0 30px 100px rgba(0,0,0,.44);backdrop-filter:blur(16px)}
.h-earth-experience-loader__eyebrow{margin:0 0 12px;color:#bde7db;font-size:.72rem;font-weight:900;letter-spacing:.17em;text-transform:uppercase}
.h-earth-experience-loader__headline{margin:0;font-size:clamp(2rem,7vw,4.8rem);line-height:.92;letter-spacing:-.055em}
.h-earth-experience-loader__status{margin:18px 0 0;color:rgba(238,248,246,.8);font-size:clamp(.96rem,2vw,1.12rem)}
.h-earth-experience-loader__rail{position:relative;height:13px;margin-top:26px;overflow:hidden;border:1px solid rgba(220,242,238,.22);border-radius:999px;background:rgba(255,255,255,.06)}
.h-earth-experience-loader__fill{position:relative;height:100%;width:0;border-radius:inherit;background:linear-gradient(90deg,#4da8b6,#8ed6c1,#d9f5e8);box-shadow:0 0 28px rgba(122,220,198,.44);transition:width .3s cubic-bezier(.2,.8,.2,1)}
.h-earth-experience-loader__fill::after{content:"";position:absolute;inset:-2px;width:42%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.72),transparent);transform:translateX(-140%);animation:hEarthStageActivity 1.25s linear infinite}
@keyframes hEarthStageActivity{to{transform:translateX(340%)}}
.h-earth-experience-loader__meta{display:flex;justify-content:space-between;gap:18px;align-items:baseline;margin-top:12px}
.h-earth-experience-loader__percent{font-variant-numeric:tabular-nums;font-size:clamp(2rem,6vw,4.6rem);font-weight:900;letter-spacing:-.06em}
.h-earth-experience-loader__note{max-width:31rem;color:rgba(238,248,246,.6);font-size:.76rem;line-height:1.45;text-align:right}
.h-earth-experience-loader__steps{display:grid;grid-template-columns:repeat(5,1fr);gap:5px;margin-top:18px}
.h-earth-experience-loader__step{height:4px;border-radius:999px;background:rgba(255,255,255,.09)}
.h-earth-experience-loader__step[data-state="done"]{background:rgba(146,224,201,.78)}
.h-earth-experience-loader__step[data-state="active"]{background:rgba(218,247,237,.92);box-shadow:0 0 14px rgba(150,226,204,.5);animation:hEarthStepPulse 1s ease-in-out infinite alternate}
.h-earth-experience-loader[data-failed="true"] .h-earth-experience-loader__headline{color:#ffd5df}
.h-earth-experience-loader__diagnostic{display:none;margin-top:18px;padding:14px;border:1px solid rgba(255,170,190,.34);border-radius:12px;background:rgba(70,5,24,.28);font:600 .72rem/1.5 ui-monospace,SFMono-Regular,Menlo,monospace;white-space:pre-wrap;overflow-wrap:anywhere}
.h-earth-experience-loader[data-failed="true"] .h-earth-experience-loader__diagnostic{display:block}
.h-earth-experience-loader__actions{display:none;gap:8px;margin-top:12px}.h-earth-experience-loader[data-failed="true"] .h-earth-experience-loader__actions,.h-earth-experience-loader[data-delayed="true"] .h-earth-experience-loader__actions{display:flex}
.h-earth-experience-loader__actions button{padding:8px 11px;border:1px solid rgba(255,255,255,.22);border-radius:9px;background:rgba(255,255,255,.08);color:inherit;font:700 .72rem ui-monospace,monospace}
@keyframes hEarthStepPulse{from{opacity:.48}to{opacity:1}}
@media(max-width:520px){.h-earth-experience-loader__meta{align-items:flex-start;flex-direction:column}.h-earth-experience-loader__note{text-align:left}}
${reducedMotion?'.h-earth-experience-loader,.h-earth-experience-loader__fill{transition:none!important}.h-earth-experience-loader__fill::after,.h-earth-experience-loader__step{animation:none!important}':''}
`;
document.head.appendChild(style);
const loader=document.createElement('div');
loader.className='h-earth-experience-loader';
loader.setAttribute('role','status');
loader.setAttribute('aria-live','polite');
loader.innerHTML=`<div class="h-earth-experience-loader__card"><p class="h-earth-experience-loader__eyebrow">H-Earth · live world initialization</p><h1 class="h-earth-experience-loader__headline">Entering the coast.</h1><p class="h-earth-experience-loader__status">Preparing browser-native world runtime</p><div class="h-earth-experience-loader__rail" aria-hidden="true"><div class="h-earth-experience-loader__fill"></div></div><div class="h-earth-experience-loader__meta"><strong class="h-earth-experience-loader__percent">0%</strong><span class="h-earth-experience-loader__note">The world opens first. Vegetation continues loading after you can explore.</span></div><div class="h-earth-experience-loader__steps" aria-hidden="true">${'<i class="h-earth-experience-loader__step"></i>'.repeat(5)}</div><section class="h-earth-experience-loader__vegetation" hidden aria-label="Vegetation loading progress"><div class="h-earth-experience-loader__vegetation-meta"><span>Vegetation loading</span><strong class="h-earth-experience-loader__vegetation-percent">Preparing</strong></div><div class="h-earth-experience-loader__vegetation-rail" role="progressbar" aria-label="Vegetation batches loaded" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" data-indeterminate="true"><div class="h-earth-experience-loader__vegetation-fill"></div></div></section><pre class="h-earth-experience-loader__diagnostic"></pre><div class="h-earth-experience-loader__actions"><button type="button" data-action="copy">Copy diagnostic</button><button type="button" data-action="retry">Retry</button></div></div>`;
document.body.appendChild(loader);
const fill=loader.querySelector('.h-earth-experience-loader__fill');
const percentNode=loader.querySelector('.h-earth-experience-loader__percent');
const statusNode=loader.querySelector('.h-earth-experience-loader__status');
const stepNodes=[...loader.querySelectorAll('.h-earth-experience-loader__step')];
const vegetationSection=loader.querySelector('.h-earth-experience-loader__vegetation');
const vegetationRail=loader.querySelector('.h-earth-experience-loader__vegetation-rail');
const vegetationFill=loader.querySelector('.h-earth-experience-loader__vegetation-fill');
const vegetationPercentNode=loader.querySelector('.h-earth-experience-loader__vegetation-percent');
const diagnosticNode=loader.querySelector('.h-earth-experience-loader__diagnostic');
const copyButton=loader.querySelector('[data-action="copy"]');
const retryButton=loader.querySelector('[data-action="retry"]');
let verifiedProgress=0,displayedProgress=0,activeStage='',activeCeiling=0,readyHideTimer=0,activityTimer=0,latestVegetationProgress=null;
function updateLoaderVisual(){fill.style.width=`${displayedProgress}%`;percentNode.textContent=`${Math.floor(displayedProgress)}%`;const group=Math.min(4,Math.floor(displayedProgress/20));stepNodes.forEach((node,index)=>node.dataset.state=index<group?'done':index===group?'active':'pending');}
function startBoundedActivity(stage){clearInterval(activityTimer);activeStage=stage;activeCeiling=verifiedProgress;displayedProgress=verifiedProgress;updateLoaderVisual();}
function enterWorldReadyState(){
  if(loader.dataset.ready==='true')return;
  loader.dataset.ready='true';
  loader.querySelector('.h-earth-experience-loader__headline').textContent='Environment ready.';
  statusNode.textContent='You can explore while vegetation finishes loading.';
  vegetationSection.hidden=false;
  document.getElementById('h-earth-vegetation-progress')?.setAttribute('hidden','');
  const residency=window.H_EARTH_RUN8E_PUBLIC_ROUTE?.getVegetationResidency?.();
  if(residency)updateVegetationProgress({phase:residency.complete?'COMPLETE':'RESIDENCY',residentBatchCount:residency.residentBatchCount,totalBatchCount:residency.totalBatchCount,residentPrimitiveCount:residency.residentPrimitiveCount});
  if(latestVegetationProgress)updateVegetationProgress(latestVegetationProgress);
}
function updateVegetationProgress(detail){
  if(!detail||typeof detail.phase!=='string')return;
  latestVegetationProgress=detail;
  if(loader.dataset.ready!=='true')return;
  vegetationSection.hidden=false;
  if(detail.phase==='RESIDENCY'&&Number.isFinite(detail.residentBatchCount)&&Number.isFinite(detail.totalBatchCount)&&detail.totalBatchCount>0){
    const total=Math.floor(detail.totalBatchCount),resident=Math.max(0,Math.min(total,Math.floor(detail.residentBatchCount))),percent=Math.floor(100*resident/total);
    vegetationRail.removeAttribute('data-indeterminate');vegetationRail.setAttribute('aria-valuemax','100');vegetationRail.setAttribute('aria-valuenow',String(percent));vegetationFill.style.width=`${percent}%`;vegetationPercentNode.textContent=`${resident} / ${total} batches · ${percent}%`;
    statusNode.textContent=`World ready · vegetation loading. ${resident} of ${total} batches loaded; you can explore.`;
    return;
  }
  if(detail.phase==='COMPLETE'){
    vegetationRail.removeAttribute('data-indeterminate');vegetationRail.setAttribute('aria-valuenow','100');vegetationFill.style.width='100%';vegetationPercentNode.textContent='Complete · 100%';statusNode.textContent='World and vegetation ready.';
    clearTimeout(readyHideTimer);readyHideTimer=setTimeout(()=>{loader.dataset.complete='true';setTimeout(()=>loader.remove(),350);},reducedMotion?900:2200);
    return;
  }
  if(detail.phase==='FAILED'){
    loader.dataset.vegetationFailed='true';statusNode.textContent='World ready · vegetation could not finish loading.';vegetationPercentNode.textContent='Needs attention';return;
  }
  vegetationRail.setAttribute('data-indeterminate','true');vegetationPercentNode.textContent='Preparing';
  const grass=detail.grassTuftCount??0,cattails=detail.cattailCount??0;
  statusNode.textContent=grass||cattails?`World ready · preparing plants (${grass} grass tufts, ${cattails} cattails). You can explore.`:'World ready · preparing vegetation. You can explore while it loads.';
}
function renderReceipt(receipt){if(!receipt?.stages)return;if(receipt.startupDelays?.length)loader.dataset.delayed='true';const readyPublished=receipt.stages.READY_PUBLISHED==='PASS';let progress=0,stage='',label='Preparing browser-native world runtime',failedStage=null;for(const [name,status] of Object.entries(receipt.stages)){if(status==='PASS'){progress=Math.max(progress,PROGRESS[name]??0);stage=name;label=LABEL[name]??label;}else if(status==='FAIL'&&!readyPublished){failedStage=name;break;}}if(!readyPublished&&receipt.firstFailureStage)failedStage=receipt.firstFailureStage;verifiedProgress=Math.max(verifiedProgress,readyPublished?100:progress);displayedProgress=Math.max(displayedProgress,verifiedProgress);updateLoaderVisual();if(readyPublished){clearInterval(activityTimer);displayedProgress=100;updateLoaderVisual();enterWorldReadyState();if(latestVegetationProgress)updateVegetationProgress(latestVegetationProgress);return;}if(failedStage){clearInterval(activityTimer);loader.dataset.failed='true';loader.querySelector('.h-earth-experience-loader__headline').textContent='Initialization failed.';statusNode.textContent=`FAILED AT: ${failedStage} · ${receipt.failureClass??'UNCLASSIFIED'}`;const diagnostic={firstFailureStage:receipt.firstFailureStage??failedStage,failureClass:receipt.failureClass??null,exceptionName:receipt.exceptionName??null,exceptionMessage:receipt.exceptionMessage??null,shaderLog:receipt.shaderLog??null,programLinkLog:receipt.programLinkLog??null,webglError:receipt.webglError??null,framebufferStatus:receipt.framebufferStatus??null,contextLost:receipt.contextLost??false};diagnosticNode.textContent=JSON.stringify(diagnostic,null,2);return;}statusNode.textContent=loader.dataset.delayed==='true'?(activeStage==='RENDERER_CONSTRUCTOR_ENTERED'?'Still building the first world frame on this device. Vegetation begins after the world opens.':`Still preparing the world · ${label}`):label;if(stage&&stage!==activeStage)startBoundedActivity(stage);}
const oceanPresentationActive=new URLSearchParams(location.search).get('ocean-presentation')==='v1';
const liveRouteYieldTimer=oceanPresentationActive?setInterval(()=>{
  const routeReady=document.getElementById('h-earth-functional-landscape-route')?.dataset.run8eReady==='true';
  if(!routeReady||!loader.isConnected)return;
  clearInterval(liveRouteYieldTimer);
  clearInterval(activityTimer);
  enterWorldReadyState();
},100):0;
window.addEventListener('h-earth-renderer-startup-receipt',event=>renderReceipt(event.detail));
window.addEventListener('h-earth-vegetation-progress',event=>updateVegetationProgress(event.detail));
renderReceipt(window.H_EARTH_RENDERER_STARTUP_DIAGNOSTICS?.getReceipt?.());
copyButton.addEventListener('click',async()=>{diagnosticNode.textContent=JSON.stringify(window.H_EARTH_RENDERER_STARTUP_DIAGNOSTICS?.getReceipt?.()??{},null,2);try{if(!navigator.clipboard?.writeText)throw new Error('CLIPBOARD_UNAVAILABLE');await navigator.clipboard.writeText(diagnosticNode.textContent||'');copyButton.textContent='Diagnostic copied';}catch{diagnosticNode.style.display='block';copyButton.textContent='Diagnostic shown below';}});retryButton.addEventListener('click',()=>location.reload());
function showStartupDelay(){
  if(!loader.isConnected||loader.dataset.ready==='true'||loader.dataset.failed==='true')return;
  loader.dataset.delayed='true';
  statusNode.textContent=activeStage==='RENDERER_CONSTRUCTOR_ENTERED'?'Still building the first world frame on this device. Vegetation begins after the world opens. You can wait or retry.':'Still preparing the world. Confirmed startup stages will update as they finish. You can wait or retry.';
  diagnosticNode.textContent=JSON.stringify(window.H_EARTH_RENDERER_STARTUP_DIAGNOSTICS?.getReceipt?.()??{},null,2);
}
window.addEventListener('h-earth-startup-delay',showStartupDelay);
setTimeout(()=>{
  if(!loader.isConnected||loader.dataset.ready==='true'||loader.dataset.failed==='true')return;
  const receipt=window.H_EARTH_RENDERER_STARTUP_DIAGNOSTICS?.getReceipt?.()??{};
  if(receipt.stages?.READY_PUBLISHED==='PASS'){renderReceipt(receipt);return;}
  window.H_EARTH_RENDERER_STARTUP_DIAGNOSTICS?.noteStartupDelay?.('READY_WAIT',20000);
  showStartupDelay();
},20000);
window.addEventListener('beforeunload',()=>{clearInterval(activityTimer);if(liveRouteYieldTimer)clearInterval(liveRouteYieldTimer);},{once:true});
window.H_EARTH_ARRIVAL_LOADER=Object.freeze({version:'H_EARTH_ARRIVAL_LOADER_23949_V2',verifiedMilestoneProgress:true,boundedStageActivity:true,get progress(){return displayedProgress;}});
