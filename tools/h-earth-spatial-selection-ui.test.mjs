import test from 'node:test';
import assert from 'node:assert/strict';
import {recordSubmittedFrame,createHEarthCopyReportFrameBridge} from '../showroom/globe/h-earth/vegetation-prototype/spatial-evidence.v1.js';
import {createHEarthSpatialSelectionUI} from '../showroom/globe/h-earth/vegetation-prototype/spatial-selection-ui.v1.js';
function fixture(){
 const events=new Map();
 function node(){return {style:{},dataset:{},children:[],listeners:{},attributes:{},appendChild(e){this.children.push(e);e.parentNode=this;},remove(){this.removed=true;},setAttribute(k,v){this.attributes[k]=v;},addEventListener(k,fn){this.listeners[k]=fn;},setPointerCapture(){}};}
 const doc={body:node(),addEventListener(k,f){events.set(k,f);},removeEventListener(k){events.delete(k)},createElement:node};
 const canvas={width:800,height:400,clientWidth:400,clientHeight:200,ownerDocument:doc,getBoundingClientRect:()=>({left:25,top:40,width:400,height:200})};doc.defaultView={devicePixelRatio:2};
 const frameBridge=createHEarthCopyReportFrameBridge({sourceIdentity:{build:'test'}});
 const packet=(seq)=>({frameSequence:seq,viewport:{width:800,height:400},camera:{position:{x:129.82571460976874,y:7,z:-389.03054421247367},viewProjectionMatrix:Array.from({length:16},(_,i)=>i)}});
 const state=(seq)=>({sequence:seq,position:{x:129.82571460976874,y:7,z:-389.03054421247367},yawDegrees:30,pitchDegrees:-12,verticalFovDegrees:62});
 frameBridge.rememberSubmittedFrame({packet:packet(10),navigationState:state(20)});
 const ui=createHEarthSpatialSelectionUI({canvas,frameBridge,document:doc});
 return {ui,doc,canvas,frameBridge,packet,state,events};
}
test('point selection captures CPU-submitted Station B pose and bounded pixel coordinates',async()=>{
 const f=fixture();f.ui.mount();assert.equal(f.ui.begin('point').status,'SELECTING_CPU_SUBMITTED_FRAME');
 const r=await f.ui.complete([{clientX:225,clientY:140}]);assert.equal(r.status,'MANUAL_SELECTION_CAPTURED');
 assert.equal(r.receipt.frame.camera.position.x,129.82571460976874);assert.equal(r.receipt.frame.camera.position.z,-389.03054421247367);
 assert.equal(r.selection.sampleCount,1);assert.deepEqual([r.selection.samples[0].topLeftX,r.selection.samples[0].topLeftY],[400,200]);
 assert.equal(r.receipt.samples[0].materials.status,'UNKNOWN');assert.equal(r.receipt.budget.actualGpuPasses,0);assert.equal(f.ui.isActive(),false);
});
test('manual rectangle is bounded to 9 samples and returns navigation',async()=>{
 const f=fixture();f.ui.mount();f.ui.begin('rectangle');const r=await f.ui.complete([{clientX:55,clientY:60},{clientX:305,clientY:180}]);
 assert.equal(r.status,'MANUAL_SELECTION_CAPTURED');assert.equal(r.selection.sampleCount,9);assert.equal(f.ui.isActive(),false);
});
test('new frame submission invalidates the selected frame instead of silently switching frame',async()=>{
 const f=fixture();f.ui.begin('point');f.frameBridge.rememberSubmittedFrame({packet:f.packet(11),navigationState:f.state(21)});
 const r=await f.ui.complete([{clientX:50,clientY:50}]);assert.equal(r.status,'UNAVAILABLE');assert.match(r.reason,/FRAME_CHANGED/);assert.equal(f.ui.getLastReceipt(),null);
});
test('resized canvas invalidates frozen frame and restores selection overlay',async()=>{
 const f=fixture();f.ui.begin('point');f.canvas.width=640;
 const r=await f.ui.complete([{clientX:100,clientY:100}]);assert.equal(r.status,'UNAVAILABLE');assert.equal(f.ui.isActive(),false);
});
test('invalid offscreen selection fails closed',async()=>{
 const f=fixture();f.ui.begin('point');const r=await f.ui.complete([{clientX:9,clientY:10}]);
 assert.equal(r.status,'UNAVAILABLE');assert.match(r.reason,/SELECTION_OUTSIDE_VIEWPORT/);
});
test('contour bounded to <=64 samples; wrong modes rejected',async()=>{
 const f=fixture();assert.equal(f.ui.begin('ninth').status,'UNAVAILABLE');assert.equal(f.ui.begin('contour').status,'SELECTING_CPU_SUBMITTED_FRAME');
 const pts=Array.from({length:65},(_,i)=>({clientX:27+i,clientY:50}));const r=await f.ui.complete(pts);assert.equal(r.status,'UNAVAILABLE');assert.match(r.reason,/SELECTION_POINTS_LIMIT/);
});
test('cancel removes overlay and preserves previous receipt without scans',async()=>{
 const f=fixture();f.ui.mount();f.ui.begin('contour');assert.equal(f.doc.body.children.filter(n=>n.attributes?.['data-h-earth-manual-selection-overlay']!==undefined).length,1);
 assert.equal(f.ui.cancel().status,'CANCELLED');assert.equal(f.ui.isActive(),false);assert.equal(f.ui.getLastReceipt(),null);
});
test('report receipt is immutable to external consumers',async()=>{
 const f=fixture();f.ui.begin('point');await f.ui.complete([{clientX:30,clientY:45}]);
 const copy=f.ui.getLastReceipt();copy.frame.camera.position.x=0;assert.equal(f.ui.getLastReceipt().frame.camera.position.x,129.82571460976874);
});

test('selection overlay stays beneath the existing Copy report control and consumes pointer input',async()=>{
 const f=fixture();const panel=f.doc.body;f.ui.mount(panel);f.ui.begin('point');
 const el=f.doc.body.children.find(n=>n.attributes?.['data-h-earth-manual-selection-overlay']!==undefined);
 assert.ok(el);assert.match(el.style.cssText,/z-index:29/);
 let stopped=false,prevented=false;const event={pointerId:7,clientX:225,clientY:140,stopPropagation(){stopped=true;},preventDefault(){prevented=true;}};
 el.listeners.pointerdown(event);assert.equal(stopped,true);assert.equal(prevented,true);
 el.listeners.pointerup(event);await new Promise(resolve=>setImmediate(resolve));
 assert.equal(f.ui.getLastReceipt().selection.sampleCount,1);assert.equal(f.ui.isActive(),false);
});

test('contour pointer overflow fails closed without silently dropping bends or overwriting report',async()=>{
 const f=fixture();f.ui.mount();f.ui.begin('point');await f.ui.complete([{clientX:225,clientY:140}]);const previous=f.ui.getLastReceipt();
 f.ui.begin('contour');const overlay=f.doc.body.children.find(n=>n.attributes?.['data-h-earth-manual-selection-overlay']!==undefined&&!n.removed);
 const ev=(clientX,clientY)=>({pointerId:14,clientX,clientY,stopPropagation(){},preventDefault(){}});
 overlay.listeners.pointerdown(ev(35,50));
 for(let i=0;i<80;i++)overlay.listeners.pointermove(ev(36+i,52+i%30));
 overlay.listeners.pointerup(ev(125,65));
 assert.equal(f.ui.isActive(),false);assert.deepEqual(f.ui.getLastReceipt(),previous);
 assert.equal(overlay.removed,true);
 const output=f.ui.mount().children.find(n=>n.attributes?.role==='status');
 assert.match(output.textContent,/SELECTION_POINTS_LIMIT/);
});
test('keyboard-only point selection moves focusable cursor and captures same frame',async()=>{
 const f=fixture();f.ui.mount();f.ui.begin('point');const overlay=f.doc.body.children.find(n=>n.attributes?.['data-h-earth-manual-selection-overlay']!==undefined);
 assert.equal(overlay.tabIndex,0);assert.match(overlay.attributes['aria-label'],/Arrow keys/);
 const key=k=>f.events.get('keydown')({key:k,preventDefault(){},stopPropagation(){}});
 key('ArrowRight');key('Enter');await new Promise(resolve=>setImmediate(resolve));
 assert.equal(f.ui.isActive(),false);assert.equal(f.ui.getLastReceipt()?.selection.sampleCount,1);
 assert.equal(f.ui.getLastReceipt()?.selection.samples[0].topLeftX,424);
});
test('keyboard-only rectangle and contour support bounded completion and cancellation',async()=>{
 const f=fixture();f.ui.mount();
 const key=k=>f.events.get('keydown')({key:k,preventDefault(){},stopPropagation(){}});
 f.ui.begin('rectangle');key('Enter');key('ArrowRight');key('ArrowDown');key('Enter');
 await new Promise(resolve=>setImmediate(resolve));
 assert.equal(f.ui.getLastReceipt()?.selection.kind,'rectangle');assert.equal(f.ui.isActive(),false);
 f.ui.begin('contour');key('Enter');key('ArrowRight');key('Enter');key('ArrowDown');key('Enter');key(' ');
 await new Promise(resolve=>setImmediate(resolve));
 assert.equal(f.ui.getLastReceipt()?.selection.kind,'contour');assert.equal(f.ui.isActive(),false);
 f.ui.begin('point');key('Escape');assert.equal(f.ui.isActive(),false);
});

test('document keyboard handler leaves native toolbar and report controls operable',async()=>{
 const f=fixture();const bar=f.ui.mount();f.ui.begin('point');
 const cancel=bar.children.find(n=>n.textContent==='Cancel selection');assert.ok(cancel);
 let prevented=false;
 f.events.get('keydown')({key:'Enter',target:cancel,preventDefault(){prevented=true;},stopPropagation(){}});
 assert.equal(prevented,false);assert.equal(f.ui.isActive(),true);assert.equal(f.ui.getLastReceipt(),null);
 cancel.listeners.click();assert.equal(f.ui.isActive(),false);
 f.ui.begin('point');const textInput=f.doc.createElement('textarea');
 let textPrevented=false;
 f.events.get('keydown')({key:'ArrowLeft',target:textInput,preventDefault(){textPrevented=true;},stopPropagation(){}});
 f.events.get('keydown')({key:'Enter',target:textInput,preventDefault(){textPrevented=true;},stopPropagation(){}});
 assert.equal(textPrevented,false);assert.equal(f.ui.isActive(),true);
 f.events.get('keydown')({key:'Escape',target:textInput,preventDefault(){},stopPropagation(){}});
 assert.equal(f.ui.isActive(),false);
});
