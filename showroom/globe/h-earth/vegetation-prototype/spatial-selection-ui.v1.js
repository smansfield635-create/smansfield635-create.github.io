/** Bounded H-Earth Copy-report diagnostic region selection.
 * Captures only CPU-submitted frame state, never pixel colors or GPU readback.
 * An overlay consumes navigation input exclusively while a selection is active.
 */
import {selectBoundedPixels,scanSubmittedFrame} from './spatial-evidence.v1.js';
const MAX_POINTS=64;
const clone=value=>JSON.parse(JSON.stringify(value));
const sameViewport=(a,b)=>!!a&&!!b&&['bufferWidth','bufferHeight','cssWidth','cssHeight','offsetLeft','offsetTop','devicePixelRatio'].every(k=>a[k]===b[k]);
const unavailable=reason=>Object.freeze({status:'UNAVAILABLE',reason});
export function createHEarthSpatialSelectionUI({canvas,frameBridge,document:doc=canvas?.ownerDocument,rendererReceipt=()=>null,onStatus=()=>{},enabled=()=>true}={}){
  if(!canvas||!frameBridge||!doc)throw Error('SELECTION_DEPENDENCIES_MISSING');
  let active=null,lastReceipt=null,toolbar=null,overlay=null,statusNode=null;
  function inform(message){if(statusNode)statusNode.textContent=message;onStatus(message);}
  function stopEvent(e){e.preventDefault?.();e.stopPropagation?.();}
  function clearActive(){active=null;if(overlay){overlay.remove();overlay=null;}if(toolbar)toolbar.dataset.selectionActive='false';}
  function getLastReceipt(){return lastReceipt?clone(lastReceipt):null;}
  function isActive(){return active!==null;}
  function begin(kind){
    if(!['point','contour','rectangle'].includes(kind))return unavailable('SELECTION_SHAPE_INVALID');
    if(!enabled())return unavailable('WORLD_NOT_READY');
    clearActive();
    const result=frameBridge.getCopyReportFrameEvidence({canvas,rendererReceipt:rendererReceipt()});
    if(result.status!=='CAPTURED_CPU_SUBMITTED_FRAME')return unavailable(result.reason||'FRAME_NOT_AVAILABLE');
    active={kind,frame:result.evidence,points:[],pointerId:null};
    if(toolbar)toolbar.dataset.selectionActive='true';
    attachOverlay();inform(`Selection active: ${kind}. Choose a region; Escape cancels.`);
    return {status:'SELECTING_CPU_SUBMITTED_FRAME',kind,frameId:active.frame.frameId};
  }
  function currentIsFrozenFrame(){
    const now=frameBridge.getCopyReportFrameEvidence({canvas,rendererReceipt:rendererReceipt()});
    return now.status==='CAPTURED_CPU_SUBMITTED_FRAME'&&now.evidence.frameId===active.frame.frameId&&sameViewport(now.evidence.viewport,active.frame.viewport);
  }
  async function complete(points){
    if(!active)return unavailable('NO_ACTIVE_SELECTION');
    const {frame,kind}=active;
    try{
      if(!currentIsFrozenFrame())throw Error('FRAME_CHANGED_OR_VIEWPORT_CHANGED');
      const selection=selectBoundedPixels(frame,{kind,points,gridSize:3});
      // Explicit owner selection only: zero GPU passes, zero automatic samples.
      const receipt=await scanSubmittedFrame({frame,selection,latestFrameId:frame.frameId,inspector:null,budget:{maxGpuPasses:0,maxSamples:MAX_POINTS}});
      lastReceipt=receipt;
      inform(`Captured ${selection.sampleCount} ${kind} sample(s); material attribution UNKNOWN.`);
      return {status:'MANUAL_SELECTION_CAPTURED',selection:clone(selection),receipt:clone(receipt)};
    }catch(error){
      const reason=String(error?.message||error);inform(`Selection not recorded: ${reason}`);
      return unavailable(reason);
    }finally{clearActive();}
  }
  function cancel(){const was=!!active;clearActive();if(was)inform('Selection cancelled; normal navigation restored.');return {status:was?'CANCELLED':'IDLE'};}
  function clientPoint(e){return {clientX:e.clientX,clientY:e.clientY};}
  function onDown(e){if(!active||active.pointerId!==null)return;stopEvent(e);active.pointerId=e.pointerId;active.points=[clientPoint(e)];overlay?.setPointerCapture?.(e.pointerId);}
  function onMove(e){if(!active||e.pointerId!==active.pointerId||active.kind!=='contour')return;stopEvent(e);if(active.points.length<MAX_POINTS-1)active.points.push(clientPoint(e));}
  function onUp(e){if(!active||e.pointerId!==active.pointerId)return;stopEvent(e);let points=active.points;const end=clientPoint(e);
    if(active.kind==='point')points=[end];
    else if(active.kind==='rectangle')points=[points[0],end];
    else if(points.length<MAX_POINTS)points=[...points,end];
    void complete(points);
  }
  function onCancel(e){if(active&&e.pointerId===active.pointerId){stopEvent(e);cancel();}}
  function attachOverlay(){
    const r=canvas.getBoundingClientRect();
    const el=doc.createElement('div');el.setAttribute('data-h-earth-manual-selection-overlay','');
    el.style.cssText=`position:fixed;left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px;z-index:29;cursor:crosshair;touch-action:none;pointer-events:auto;background:transparent;`;
    el.addEventListener('pointerdown',onDown);el.addEventListener('pointermove',onMove);el.addEventListener('pointerup',onUp);
    el.addEventListener('pointercancel',onCancel);el.addEventListener('wheel',stopEvent,{passive:false});
    doc.body.appendChild(el);overlay=el;
  }
  function mount(host){
    if(toolbar)return toolbar;
    const el=doc.createElement('div');el.setAttribute('data-h-earth-spatial-selection','');
    el.style.cssText='display:flex;flex-wrap:wrap;gap:4px;align-items:center;margin-top:6px;font:12px/1.35 system-ui,sans-serif';
    for(const kind of ['point','contour','rectangle']){
      const b=doc.createElement('button');b.type='button';b.textContent=kind==='point'?'Select point':kind==='contour'?'Trace edge':'Select rectangle';
      b.setAttribute('data-selection-kind',kind);b.addEventListener('click',()=>{const r=begin(kind);if(r.status==='UNAVAILABLE')inform(`Selection unavailable: ${r.reason}`);});el.appendChild(b);
    }
    const cancelButton=doc.createElement('button');cancelButton.type='button';cancelButton.textContent='Cancel selection';cancelButton.addEventListener('click',cancel);el.appendChild(cancelButton);
    statusNode=doc.createElement('output');statusNode.setAttribute('role','status');statusNode.textContent='Optional: manually select a submitted frame region.';el.appendChild(statusNode);
    (host??doc.body).appendChild(el);toolbar=el;return el;
  }
  function onKeyDown(e){if(active&&e.key==='Escape'){stopEvent(e);cancel();}}
  doc.addEventListener('keydown',onKeyDown);
  function dispose(){cancel();doc.removeEventListener('keydown',onKeyDown);toolbar?.remove();toolbar=null;statusNode=null;}
  return Object.freeze({mount,begin,complete,cancel,isActive,getLastReceipt,dispose});
}
