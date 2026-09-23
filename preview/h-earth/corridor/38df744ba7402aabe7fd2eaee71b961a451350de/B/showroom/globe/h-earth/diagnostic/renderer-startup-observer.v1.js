/** H_EARTH_RENDERER_STARTUP_DIAGNOSTIC_RECEIPT_v1 */
const STAGES = Object.freeze([
  'CANVAS_ACQUIRED','WEBGL2_CONTEXT_REQUESTED','WEBGL2_CONTEXT_ACQUIRED','WEBGL_IDENTITY_CAPTURED',
  'RENDERER_CONSTRUCTOR_ENTERED','RENDERER_CONSTRUCTOR_RETURNED','INITIALIZATION_ENTERED',
  'VERTEX_SHADER_COMPILED','FRAGMENT_SHADER_COMPILED','PROGRAM_LINKED','GPU_RESOURCES_CREATED',
  'FRAMEBUFFER_VALIDATED','INITIAL_DRAW_ENTERED','INITIAL_DRAW_RETURNED','FIRST_FRAME_PRESENTED','READY_PUBLISHED'
]);
const state = {
  version:'H_EARTH_RENDERER_STARTUP_DIAGNOSTIC_RECEIPT_v1',
  stages:Object.fromEntries(STAGES.map(stage=>[stage,'NOT_REACHED'])), firstFailureStage:null,
  failureClass:null, plainLanguageSummary:'Renderer startup is still in progress.', exceptionName:null,
  exceptionMessage:null, stack:null, webglError:null, shaderLog:null, programLinkLog:null,
  framebufferStatus:null, contextLost:false, canvasWidth:null, canvasHeight:null,
  pixelRatio:window.devicePixelRatio||1, webglVendor:null, webglRenderer:null,
  timestamp:new Date().toISOString(), device:navigator.userAgent
};
let gl=null, firstFailureLocked=false, presented=false, originalGetContext=null;
const clone=()=>JSON.parse(JSON.stringify(state));
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
const publish=()=>window.dispatchEvent(new CustomEvent('h-earth-renderer-startup-receipt',{detail:clone()}));
const mark=(stage,status,detail=null)=>{if(!STAGES.includes(stage))return;if(firstFailureLocked&&status==='FAIL')return;state.stages[stage]=status;state.timestamp=new Date().toISOString();if(status==='FAIL'){firstFailureLocked=true;state.firstFailureStage=stage;const [failureClass,summary]=classify(stage,typeof detail==='string'?detail:detail?.message);state.failureClass=failureClass;state.plainLanguageSummary=summary;if(detail&&typeof detail==='object'){state.exceptionName=detail.name??state.exceptionName;state.exceptionMessage=detail.message??state.exceptionMessage;state.stack=detail.stack??state.stack;}}publish();};
const fail=(stage,error,extra={})=>{const detail={name:error?.name??'Error',message:error?.message??String(error),stack:error?.stack??null,...extra};mark(stage,'FAIL',detail);};
const wrap=(obj,name,before,after,onError)=>{const original=obj?.[name];if(typeof original!=='function')return;obj[name]=function(...args){try{before?.call(this,args);const result=original.apply(this,args);after?.call(this,result,args);return result;}catch(error){onError?.call(this,error,args);throw error;}};};
function instrumentContext(context,canvas){gl=context;state.canvasWidth=canvas.width;state.canvasHeight=canvas.height;state.contextLost=context.isContextLost();mark('WEBGL2_CONTEXT_ACQUIRED','PASS');try{const ext=context.getExtension('WEBGL_debug_renderer_info');state.webglVendor=ext?context.getParameter(ext.UNMASKED_VENDOR_WEBGL):context.getParameter(context.VENDOR);state.webglRenderer=ext?context.getParameter(ext.UNMASKED_RENDERER_WEBGL):context.getParameter(context.RENDERER);mark('WEBGL_IDENTITY_CAPTURED','PASS');}catch(error){fail('WEBGL_IDENTITY_CAPTURED',error);}
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
  window.addEventListener('h-earth-runtime-diagnostic-stage',event=>{const {stage,status,detail}=event.detail||{};if(stage==='RENDERER_CONSTRUCTED'){status==='FAIL'?fail('RENDERER_CONSTRUCTOR_RETURNED',new Error(detail?.message||String(detail))):mark('RENDERER_CONSTRUCTOR_RETURNED','PASS');if(status!=='FAIL')mark('INITIALIZATION_ENTERED','PASS');}if(stage==='FIRST_FRAME_DRAWN'&&status==='PASS'){presented=true;mark('FIRST_FRAME_PRESENTED','PASS');}if(stage==='READY_EVENT_EMITTED'&&status==='PASS')mark('READY_PUBLISHED','PASS');});
  window.addEventListener('error',event=>{if(!firstFailureLocked)fail(state.stages.RENDERER_CONSTRUCTOR_RETURNED==='NOT_REACHED'?'RENDERER_CONSTRUCTOR_RETURNED':'INITIAL_DRAW_RETURNED',event.error||new Error(event.message));});
  window.addEventListener('unhandledrejection',event=>{if(!firstFailureLocked)fail(state.stages.RENDERER_CONSTRUCTOR_RETURNED==='NOT_REACHED'?'RENDERER_CONSTRUCTOR_RETURNED':'INITIAL_DRAW_RETURNED',event.reason);});
  window.setTimeout(()=>{if(!presented&&!firstFailureLocked)mark('FIRST_FRAME_PRESENTED','FAIL','No first-frame event within 12 seconds.');},12000);
  window.H_EARTH_RENDERER_STARTUP_DIAGNOSTICS=Object.freeze({version:state.version,getReceipt:clone,mark,fail,constructorReturned:()=>mark('RENDERER_CONSTRUCTOR_RETURNED','PASS'),initializationEntered:()=>mark('INITIALIZATION_ENTERED','PASS')});
  publish();return window.H_EARTH_RENDERER_STARTUP_DIAGNOSTICS;
}
installRendererStartupObserver();
