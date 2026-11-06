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
    active={kind,frame:result.evidence,points:[],pointerId:null,overflow:false,keyboardPoints:[],keyboardCursor:null};
    if(toolbar)toolbar.dataset.selectionActive='true';
    attachOverlay();inform(`Selection active: ${kind}. Use pointer or arrow keys; Enter places points/corners; Space finishes contour; Escape cancels.`);
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
  function onDown(e){if(!active||active.pointerId!==null)return;stopEvent(e);active.pointerId=e.pointerId;active.points=[clientPoint(e)];active.keyboardPoints=[];active.overflow=false;overlay?.setPointerCapture?.(e.pointerId);}
  function onMove(e){if(!active||e.pointerId!==active.pointerId||active.kind!=='contour')return;stopEvent(e);if(active.points.length<MAX_POINTS-1)active.points.push(clientPoint(e));else active.overflow=true;}
  function onUp(e){if(!active||e.pointerId!==active.pointerId)return;stopEvent(e);if(active.overflow){inform('Selection not recorded: SELECTION_POINTS_LIMIT');clearActive();return;}let points=active.points;const end=clientPoint(e);
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
    el.tabIndex=0;
    el.setAttribute('role','group');
    el.setAttribute('aria-label','H-Earth selection. Arrow keys move the cursor; Enter selects a point or corner; Space finishes a contour; Escape cancels.');
    const marker=doc.createElement('div');marker.setAttribute('data-h-earth-keyboard-cursor','');
    marker.style.cssText='position:absolute;width:12px;height:12px;border:2px solid #fff;border-radius:50%;box-shadow:0 0 0 2px #000;transform:translate(-50%,-50%);pointer-events:none;';
    marker.style.left=`${r.width/2}px`;marker.style.top=`${r.height/2}px`;
    el.appendChild(marker);
    doc.body.appendChild(el);overlay=el;
    active.keyboardCursor={clientX:r.left+r.width/2,clientY:r.top+r.height/2,rect:r,marker};
    el.focus?.();
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
  function onKeyDown(e){
    if(!active)return;
    if(e.key==='Escape'){stopEvent(e);cancel();return;}
    if(active.pointerId!==null||!active.keyboardCursor)return;
    const cursor=active.keyboardCursor;
    const moves={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]};
    const delta=moves[e.key];
    if(delta){
      stopEvent(e);
      const step=e.shiftKey?1:12;
      cursor.clientX=Math.max(cursor.rect.left,Math.min(cursor.rect.left+cursor.rect.width-1,cursor.clientX+delta[0]*step));
      cursor.clientY=Math.max(cursor.rect.top,Math.min(cursor.rect.top+cursor.rect.height-1,cursor.clientY+delta[1]*step));
      cursor.marker.style.left=`${cursor.clientX-cursor.rect.left}px`;
      cursor.marker.style.top=`${cursor.clientY-cursor.rect.top}px`;
      inform('Keyboard cursor moved; press Enter to select.');
      return;
    }
    if(e.key==='Enter'){
      stopEvent(e);
      const point={clientX:cursor.clientX,clientY:cursor.clientY};
      if(active.kind==='point'){void complete([point]);return;}
      if(active.kind==='rectangle'){
        if(active.keyboardPoints.length===0){active.keyboardPoints.push(point);inform('First rectangle corner set. Move with arrows, then press Enter.');}
        else void complete([active.keyboardPoints[0],point]);
        return;
      }
      if(active.keyboardPoints.length>=MAX_POINTS){inform('Selection not recorded: SELECTION_POINTS_LIMIT');clearActive();return;}
      active.keyboardPoints.push(point);
      inform(`Contour vertex ${active.keyboardPoints.length} recorded. Space finishes the contour.`);
      return;
    }
    if((e.key===' '||e.key==='Spacebar')&&active.kind==='contour'){
      stopEvent(e);
      if(active.keyboardPoints.length<2){inform('Place at least two contour points with Enter.');return;}
      void complete(active.keyboardPoints.slice());
    }
  }
  doc.addEventListener('keydown',onKeyDown);
  function dispose(){cancel();doc.removeEventListener('keydown',onKeyDown);toolbar?.remove();toolbar=null;statusNode=null;}
  return Object.freeze({mount,begin,complete,cancel,isActive,getLastReceipt,dispose});
}
