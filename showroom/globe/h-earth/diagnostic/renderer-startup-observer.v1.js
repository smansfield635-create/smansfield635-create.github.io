/** H_EARTH_RENDERER_STARTUP_DIAGNOSTIC_RECEIPT_v1 */
const STAGES = Object.freeze([
  'CANVAS_ACQUIRED','WEBGL2_CONTEXT_REQUESTED','WEBGL2_CONTEXT_ACQUIRED','WEBGL_IDENTITY_CAPTURED',
  'RENDERER_CONSTRUCTOR_ENTERED','RENDERER_CONSTRUCTOR_RETURNED','INITIALIZATION_ENTERED',
  'VERTEX_SHADER_COMPILED','FRAGMENT_SHADER_COMPILED','PROGRAM_LINKED','GPU_RESOURCES_CREATED',
  'FRAMEBUFFER_VALIDATED','INITIAL_DRAW_ENTERED','INITIAL_DRAW_RETURNED','FIRST_FRAME_PRESENTED','READY_PUBLISHED'
]);
const performanceEnabled=new URLSearchParams(globalThis.location?.search??'').get('performance')==='1';
const observerStartedAtMs=performance.now();
const state = {
  version:'H_EARTH_RENDERER_STARTUP_DIAGNOSTIC_RECEIPT_v1',
  vegetationProgress:null,vegetationPhaseHistory:[],startupDelays:[],
  performanceCosts:performanceEnabled?{scope:'CPU_API_AND_WALL_DURATIONS_NOT_GPU_EXECUTION_TIME',aggregates:{}}:null,
  timing:{clock:'performance.now',timeOrigin:performance.timeOrigin,observerStartedAtMs,stages:{},spans:{}},
  stages:Object.fromEntries(STAGES.map(stage=>[stage,'NOT_REACHED'])), firstFailureStage:null,
  failureClass:null, plainLanguageSummary:'Renderer startup is still in progress.', exceptionName:null,
  exceptionMessage:null, stack:null, webglError:null, shaderLog:null, programLinkLog:null,
  framebufferStatus:null, contextLost:false, canvasWidth:null, canvasHeight:null,
  pixelRatio:window.devicePixelRatio||1, webglVendor:null, webglRenderer:null,
  timestamp:new Date().toISOString(), device:navigator.userAgent
};
let gl=null, firstFailureLocked=false, presented=false, originalGetContext=null;
const clone=()=>JSON.parse(JSON.stringify(state));
const COST_NAMES=new Set(['BUFFER_DATA_SUBMISSION','DRAW_API','ERROR_CHECK','RECEIPT_PUBLISH','OASIS_STEP','OASIS_YIELD_WAIT','NAVIGATION_FRAME','RESIDENCY_FRAME','OTHER_FRAME','SCHEDULER_WAIT','WORKER_PLAN','WORKER_RECEIVE_FREEZE','WORKER_OASIS_STEP']);
const performancePhase=()=>state.timing.stages.VEGETATION_COMPLETE?.firstPassAtMs!=null?'complete':state.timing.stages.VEGETATION_PREPARATION_COMPLETE?.firstPassAtMs!=null?'loading':state.stages.READY_PUBLISHED==='PASS'?'preparing':'startup';
const recordCost=(name,durationMs,{bytes=0,phase=performancePhase()}={})=>{
  if(!performanceEnabled||!COST_NAMES.has(name)||!['startup','preparing','loading','complete'].includes(phase)||!Number.isFinite(durationMs)||durationMs<0)return;
  const key=`${phase}:${name}`,entry=state.performanceCosts.aggregates[key]||(state.performanceCosts.aggregates[key]={phase,name,count:0,totalDurationMs:0,maxDurationMs:0,totalBytes:0});
  entry.count++;entry.totalDurationMs+=durationMs;entry.maxDurationMs=Math.max(entry.maxDurationMs,durationMs);if(Number.isFinite(bytes)&&bytes>=0)entry.totalBytes+=bytes;
};
// Frame gaps are separate from CPU work costs and bounded to four phase aggregates.
const frameIntervals={};
if(performanceEnabled){let previous=null,previousPhase=null;document.addEventListener('visibilitychange',()=>{previous=null;previousPhase=null;});const sample=()=>{const now=performance.now(),phase=performancePhase();if(document.visibilityState==='visible'&&previous!==null&&phase===previousPhase){const duration=now-previous,entry=frameIntervals[phase]||(frameIntervals[phase]={count:0,totalDurationMs:0,maxDurationMs:0,over50Ms:0});entry.count++;entry.totalDurationMs+=duration;entry.maxDurationMs=Math.max(entry.maxDurationMs,duration);if(duration>50)entry.over50Ms++;}previous=document.visibilityState==='visible'?now:null;previousPhase=phase;requestAnimationFrame(sample);};requestAnimationFrame(sample);}
const bufferDataBytes=args=>{const data=args[1];if(typeof data==='number')return data;if(!data||!Number.isFinite(data.byteLength))return 0;const elementBytes=data.BYTES_PER_ELEMENT??1,offset=args[3]??0;return args[4]>0?args[4]*elementBytes:Math.max(0,data.byteLength-offset*elementBytes);};

// Bounded aggregate timings only: no schedules, geometry, or GPU calls are changed.
const timingMark=(stage,status='PASS')=>{const now=performance.now(),entry=state.timing.stages[stage]||(state.timing.stages[stage]={firstAtMs:now,lastAtMs:now,elapsedFromObserverMs:now-observerStartedAtMs,count:0,firstPassAtMs:null,firstFailAtMs:null});entry.lastAtMs=now;entry.count++;if(status==='PASS'&&entry.firstPassAtMs===null)entry.firstPassAtMs=now;if(status==='FAIL'&&entry.firstFailAtMs===null)entry.firstFailAtMs=now;};
const measure=(name,operation)=>{const start=performance.now();let succeeded=false;try{const result=operation();succeeded=true;return result;}finally{const end=performance.now(),entry=state.timing.spans[name]||(state.timing.spans[name]={firstStartAtMs:start,lastEndAtMs:null,count:0,failedCount:0,totalDurationMs:0,maxDurationMs:0});entry.lastEndAtMs=end;entry.count++;if(!succeeded)entry.failedCount++;entry.totalDurationMs+=end-start;entry.maxDurationMs=Math.max(entry.maxDurationMs,end-start);}};

// Async spans are elapsed wall time, including worker execution and delivery.
const measureAsync=async(name,operation)=>{const start=performance.now();let succeeded=false;try{const result=await operation();succeeded=true;return result;}finally{const end=performance.now(),entry=state.timing.spans[name]||(state.timing.spans[name]={firstStartAtMs:start,lastEndAtMs:null,count:0,failedCount:0,totalDurationMs:0,maxDurationMs:0});entry.lastEndAtMs=end;entry.count++;if(!succeeded)entry.failedCount++;entry.totalDurationMs+=end-start;entry.maxDurationMs=Math.max(entry.maxDurationMs,end-start);}};

const getMilestoneTiming=()=>({firstVegetationFrameAtMs:state.timing.stages.FIRST_VEGETATION_FRAME_PRESENTED?.firstPassAtMs??null,planValidatedAtMs:state.timing.stages.VEGETATION_PLAN_VALIDATED?.firstPassAtMs??null,oasisPreparationStartAtMs:state.timing.stages.OASIS_PREPARATION_START?.firstPassAtMs??null,oasisPreparationCompleteAtMs:state.timing.stages.OASIS_PREPARATION_COMPLETE?.firstPassAtMs??null,preparationStartAtMs:state.timing.stages.VEGETATION_PREPARATION_START?.firstPassAtMs??null,preparationCompleteAtMs:state.timing.stages.VEGETATION_PREPARATION_COMPLETE?.firstPassAtMs??null,firstFrameAtMs:state.timing.stages.FIRST_FRAME_PRESENTED?.firstPassAtMs??null,readyAtMs:state.timing.stages.READY_PUBLISHED?.firstPassAtMs??null,vegetationStartAtMs:state.timing.stages.VEGETATION_START?.firstPassAtMs??null,vegetationCompleteAtMs:state.timing.stages.VEGETATION_COMPLETE?.firstPassAtMs??null});
const getPerformanceReport=()=>{const canvas=document.getElementById('h-earth-functional-landscape-canvas'),rect=canvas?.getBoundingClientRect?.();return({
  schema:'H_EARTH_DEVICE_PERFORMANCE_REPORT_v1',capturedAt:new Date().toISOString(),performanceEnabled,
  observerModuleUrl:import.meta.url,pageUrl:location.href,
  device:{userAgent:navigator.userAgent,hardwareConcurrency:navigator.hardwareConcurrency??null,deviceMemoryGiB:navigator.deviceMemory??null,pixelRatio:window.devicePixelRatio||1},
  viewport:{width:window.innerWidth,height:window.innerHeight,visualWidth:window.visualViewport?.width??null,visualHeight:window.visualViewport?.height??null,visibility:document.visibilityState,canvasWidth:canvas?.width??null,canvasHeight:canvas?.height??null,canvasRect:rect?{x:rect.x,y:rect.y,width:rect.width,height:rect.height}:null,contextLost:state.contextLost},
  loadedModuleUrls:performance.getEntriesByType('resource').filter(entry=>/\.(?:m?js)(?:\?|$)/.test(entry.name)&&entry.name.includes('/h-earth')).slice(-128).map(entry=>entry.name),
  workerPlanDurationMs:state.performanceCosts?.aggregates['preparing:WORKER_PLAN']?.totalDurationMs??null,
  frameIntervals:performanceEnabled?JSON.parse(JSON.stringify(frameIntervals)):null,
  startup:clone(),vegetationResidency:window.H_EARTH_RUN8E_PUBLIC_ROUTE?.getVegetationResidency?.()??null,
  measurementLimits:'CPU-side API call and elapsed wall durations; overlapping scopes are not additive; no GPU execution timing. WORKER_PLAN and WORKER_OASIS_STEP are worker-reported durations. WORKER_RECEIVE_FREEZE and async geometry spans include yields/waits; frameIntervals measure animation-frame gaps, not GPU execution. Missing metrics are unknown, not zero. Instrumentation adds overhead.'
});};
function installPerformanceReportButton(){
  if(!performanceEnabled||document.getElementById('h-earth-performance-report-button'))return;
  const button=document.createElement('button');button.id='h-earth-performance-report-button';button.type='button';button.textContent='Copy performance report';
  button.style.cssText='position:fixed;right:max(12px,env(safe-area-inset-right));bottom:max(140px,env(safe-area-inset-bottom));z-index:5;max-width:calc(100vw - 24px);padding:7px 10px;border:1px solid #71938b;border-radius:8px;background:#102922;color:#f1f7f3;font:12px/1.4 system-ui,sans-serif;';
  let fallback=null,downloadUrl=null;
  const closeFallback=()=>{fallback?.remove();fallback=null;if(downloadUrl){URL.revokeObjectURL(downloadUrl);downloadUrl=null;}};
  button.addEventListener('click',async()=>{
    const json=JSON.stringify(getPerformanceReport(),null,2);closeFallback();
    try{if(!navigator.clipboard?.writeText)throw new Error('CLIPBOARD_UNAVAILABLE');await navigator.clipboard.writeText(json);button.textContent='Report copied';}
    catch{
      button.textContent='Copy performance report';fallback=document.createElement('section');fallback.id='h-earth-performance-report-fallback';fallback.setAttribute('aria-label','Performance report');
      fallback.style.cssText='position:fixed;inset:12px;z-index:20;max-width:680px;max-height:80vh;margin:auto;padding:16px;box-sizing:border-box;overflow:auto;border:1px solid #71938b;border-radius:12px;background:#102922;color:#f1f7f3;font:14px/1.4 system-ui,sans-serif;';
      const title=document.createElement('p');title.textContent='Copy was unavailable. Select the report below or download it.';
      const text=document.createElement('textarea');text.readOnly=true;text.setAttribute('aria-label','Performance report JSON');text.value=json;text.style.cssText='display:block;box-sizing:border-box;width:100%;height:48vh;margin:12px 0;font:12px/1.4 monospace;';
      const download=document.createElement('a');downloadUrl=URL.createObjectURL(new Blob([json],{type:'application/json'}));download.href=downloadUrl;download.download='h-earth-performance-report.json';download.textContent='Download report';download.style.color='#bbecdc';
      const close=document.createElement('button');close.type='button';close.textContent='Close';close.style.marginLeft='16px';close.addEventListener('click',closeFallback);
      fallback.append(title,text,download,close);document.body.appendChild(fallback);text.focus();text.select();
    }
  });
  document.body.appendChild(button);
}
const classify=(stage,message='')=>{
  if(stage==='WEBGL2_CONTEXT_ACQUIRED')return['NO_WEBGL2_CONTEXT','The browser could not create the WebGL2 context required by the renderer.'];
  if(state.contextLost)return['CONTEXT_LOST_DURING_STARTUP','The WebGL2 context was lost while the renderer was starting.'];
  if(stage==='RENDERER_CONSTRUCTOR_RETURNED')return['RENDERER_CONSTRUCTION_EXCEPTION','The renderer threw an exception before construction completed.'];
  if(stage==='VERTEX_SHADER_COMPILED')return['VERTEX_SHADER_FAILURE','The browser created WebGL2, but this device rejected the renderer’s vertex shader before the first frame could be drawn.'];
  if(stage==='FRAGMENT_SHADER_COMPILED')return['FRAGMENT_SHADER_FAILURE','The browser created WebGL2, but this device rejected the renderer’s fragment shader before the first frame could be drawn.'];
  if(stage==='PROGRAM_LINKED')return['PROGRAM_LINK_FAILURE','The shaders compiled, but this device could not link them into an executable GPU program.'];
  if(stage==='GPU_RESOURCES_CREATED')return['GPU_BUFFER_OR_TEXTURE_FAILURE','WebGL2 started, but a required GPU buffer, texture, vertex array, or framebuffer object could not be created.'];
  if(stage==='FRAMEBUFFER_VALIDATED')return['FRAMEBUFFER_FAILURE','The renderer created its GPU resources, but the framebuffer was incomplete on this device.'];
  if(stage==='INITIAL_DRAW_RETURNED')return['INITIAL_DRAW_EXCEPTION','The renderer failed while issuing its first draw.'];
  if(stage==='FIRST_FRAME_PRESENTED')return['DRAW_COMPLETED_NO_PRESENTATION','The first draw returned, but no visible frame was presented to the canvas.'];
  if(stage==='READY_PUBLISHED')return['READY_PUBLICATION_FAILURE','A first frame was presented, but the route did not publish its ready state.'];
  return['UNKNOWN_STARTUP_FAILURE',message||'The renderer failed during startup at an unclassified stage.'];
};
const publish=()=>{const start=performanceEnabled?performance.now():0,phase=performancePhase();try{return window.dispatchEvent(new CustomEvent('h-earth-renderer-startup-receipt',{detail:clone()}));}finally{if(performanceEnabled)recordCost('RECEIPT_PUBLISH',performance.now()-start,{phase});}};
const noteStartupDelay=(name,thresholdMs)=>{if(firstFailureLocked||state.stages.READY_PUBLISHED==='PASS'||state.startupDelays.some(x=>x.name===name))return;const delay={name,thresholdMs,observedAtMs:performance.now(),terminal:false};state.startupDelays.push(delay);publish();window.dispatchEvent(new CustomEvent('h-earth-startup-delay',{detail:delay}));};
const mark=(stage,status,detail=null)=>{if(!STAGES.includes(stage))return;if(firstFailureLocked&&status==='FAIL')return;timingMark(stage,status);state.stages[stage]=status;if(!firstFailureLocked&&stage==='READY_PUBLISHED'&&status==='PASS')state.plainLanguageSummary='Environment ready; vegetation preparation may continue.';state.timestamp=new Date().toISOString();if(status==='FAIL'){firstFailureLocked=true;state.firstFailureStage=stage;const [failureClass,summary]=classify(stage,typeof detail==='string'?detail:detail?.message);state.failureClass=failureClass;state.plainLanguageSummary=summary;if(detail&&typeof detail==='object'){state.exceptionName=detail.name??state.exceptionName;state.exceptionMessage=detail.message??state.exceptionMessage;state.stack=detail.stack??state.stack;}}publish();};
const fail=(stage,error,extra={})=>{const detail={name:error?.name??'Error',message:error?.message??String(error),stack:error?.stack??null,...extra};mark(stage,'FAIL',detail);};
const wrap=(obj,name,before,after,onError)=>{const original=obj?.[name];if(typeof original!=='function')return;obj[name]=function(...args){try{before?.call(this,args);const costName=performanceEnabled?({bufferData:'BUFFER_DATA_SUBMISSION',drawElements:'DRAW_API',drawArrays:'DRAW_API',getError:'ERROR_CHECK'})[name]:null;const start=costName?performance.now():0,phase=costName?performancePhase():null;let result;try{result=original.apply(this,args);}finally{if(costName)recordCost(costName,performance.now()-start,{phase,bytes:name==='bufferData'?bufferDataBytes(args):0});}after?.call(this,result,args);return result;}catch(error){onError?.call(this,error,args);throw error;}};};
function instrumentContext(context,canvas){gl=context;state.canvasWidth=canvas.width;state.canvasHeight=canvas.height;state.contextLost=context.isContextLost();mark('WEBGL2_CONTEXT_ACQUIRED','PASS');try{const ext=context.getExtension('WEBGL_debug_renderer_info');state.webglVendor=ext?context.getParameter(ext.UNMASKED_VENDOR_WEBGL):context.getParameter(context.VENDOR);state.webglRenderer=ext?context.getParameter(ext.UNMASKED_RENDERER_WEBGL):context.getParameter(context.RENDERER);mark('WEBGL_IDENTITY_CAPTURED','PASS');}catch(error){fail('WEBGL_IDENTITY_CAPTURED',error);}
  if(performanceEnabled){wrap(context,'bufferData');wrap(context,'getError');}
  wrap(context,'compileShader',null,(result,args)=>{const shader=args[0],ok=context.getShaderParameter(shader,context.COMPILE_STATUS),type=context.getShaderParameter(shader,context.SHADER_TYPE),stage=type===context.VERTEX_SHADER?'VERTEX_SHADER_COMPILED':'FRAGMENT_SHADER_COMPILED';if(ok)mark(stage,'PASS');else{state.shaderLog=context.getShaderInfoLog(shader);fail(stage,new Error(state.shaderLog||'Shader compilation failed.'));}});
  wrap(context,'linkProgram',null,(result,args)=>{const program=args[0],ok=context.getProgramParameter(program,context.LINK_STATUS);if(ok)mark('PROGRAM_LINKED','PASS');else{state.programLinkLog=context.getProgramInfoLog(program);fail('PROGRAM_LINKED',new Error(state.programLinkLog||'Program link failed.'));}});
  for(const name of ['createBuffer','createTexture','createVertexArray','createFramebuffer'])wrap(context,name,null,(result)=>{if(result)mark('GPU_RESOURCES_CREATED','PASS');else fail('GPU_RESOURCES_CREATED',new Error(`${name} returned null.`));});
  wrap(context,'checkFramebufferStatus',null,(status)=>{state.framebufferStatus=status;if(status===context.FRAMEBUFFER_COMPLETE)mark('FRAMEBUFFER_VALIDATED','PASS');else fail('FRAMEBUFFER_VALIDATED',new Error(`Framebuffer incomplete: ${status}`));});
  for(const name of ['drawElements','drawArrays'])wrap(context,name,()=>{if(state.stages.INITIAL_DRAW_ENTERED==='NOT_REACHED')mark('INITIAL_DRAW_ENTERED','PASS');},()=>{state.webglError=context.getError();if(state.webglError===context.NO_ERROR)mark('INITIAL_DRAW_RETURNED','PASS');else fail('INITIAL_DRAW_RETURNED',new Error(`WebGL draw error: ${state.webglError}`));},(error)=>fail('INITIAL_DRAW_RETURNED',error));
  canvas.addEventListener('webglcontextlost',event=>{state.contextLost=true;fail(state.firstFailureStage||'WEBGL2_CONTEXT_ACQUIRED',new Error('WebGL context lost during startup.'));event.preventDefault();},{once:true});
}
export function installRendererStartupObserver(){
  const canvas=document.getElementById('h-earth-functional-landscape-canvas');
  if(canvas instanceof HTMLCanvasElement){state.canvasWidth=canvas.width;state.canvasHeight=canvas.height;mark('CANVAS_ACQUIRED','PASS');}else mark('CANVAS_ACQUIRED','FAIL','Canvas missing.');
  originalGetContext=HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext=function(type,...args){if(this===canvas&&type==='webgl2'){mark('WEBGL2_CONTEXT_REQUESTED','PASS');const context=originalGetContext.call(this,type,...args);if(!context){mark('WEBGL2_CONTEXT_ACQUIRED','FAIL','WebGL2 context unavailable.');return context;}instrumentContext(context,this);return context;}return originalGetContext.call(this,type,...args);};
  mark('RENDERER_CONSTRUCTOR_ENTERED','PASS');
  window.addEventListener('h-earth-runtime-diagnostic-stage',event=>{const {stage,status,detail}=event.detail||{};if(stage==='RENDERER_CONSTRUCTED'){status==='FAIL'?fail('RENDERER_CONSTRUCTOR_RETURNED',new Error(detail?.message||String(detail))):mark('RENDERER_CONSTRUCTOR_RETURNED','PASS');if(status!=='FAIL')mark('INITIALIZATION_ENTERED','PASS');}if(stage==='FIRST_FRAME_DRAWN'&&status==='PASS'){presented=true;mark('FIRST_FRAME_PRESENTED','PASS');}if(stage==='READY_EVENT_EMITTED'&&status==='PASS'){mark('READY_PUBLISHED','PASS');installPerformanceReportButton();}});
  window.addEventListener('h-earth-vegetation-progress',event=>{const detail=event.detail;if(!detail||typeof detail.phase!=='string')return;if(!firstFailureLocked){if(detail.phase==='COMPLETE')state.plainLanguageSummary='Environment and vegetation loading complete.';else if(detail.phase==='FAILED')state.plainLanguageSummary='Environment ready; vegetation could not finish loading.';}const phaseGroup=detail.phase.startsWith('OASIS_GRASS')?'OASIS_GRASS':detail.phase.startsWith('OASIS_CATTAIL')?'OASIS_CATTAIL':detail.phase;state.vegetationProgress={...detail,atMs:performance.now()};if(state.vegetationPhaseHistory.at(-1)?.phaseGroup!==phaseGroup){state.vegetationPhaseHistory.push({...state.vegetationProgress,phaseGroup});if(state.vegetationPhaseHistory.length>32)state.vegetationPhaseHistory.shift();}});
  window.addEventListener('error',event=>{if(!firstFailureLocked)fail(state.stages.RENDERER_CONSTRUCTOR_RETURNED==='NOT_REACHED'?'RENDERER_CONSTRUCTOR_RETURNED':'INITIAL_DRAW_RETURNED',event.error||new Error(event.message));});
  window.addEventListener('unhandledrejection',event=>{if(!firstFailureLocked)fail(state.stages.RENDERER_CONSTRUCTOR_RETURNED==='NOT_REACHED'?'RENDERER_CONSTRUCTOR_RETURNED':'INITIAL_DRAW_RETURNED',event.reason);});
  window.setTimeout(()=>{if(!presented&&!firstFailureLocked)noteStartupDelay('FIRST_FRAME_WAIT',12000);},12000);
  window.H_EARTH_RENDERER_STARTUP_DIAGNOSTICS=Object.freeze({version:state.version,getReceipt:clone,mark,fail,timingMark,measure,measureAsync,getMilestoneTiming,performanceEnabled,recordCost,noteStartupDelay,getPerformanceReport,constructorReturned:()=>mark('RENDERER_CONSTRUCTOR_RETURNED','PASS'),initializationEntered:()=>mark('INITIALIZATION_ENTERED','PASS')});
  publish();return window.H_EARTH_RENDERER_STARTUP_DIAGNOSTICS;
}
installRendererStartupObserver();
