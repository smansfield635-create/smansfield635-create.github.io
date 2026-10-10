#!/usr/bin/env node
// Generation 2637: exercise the ACTUAL installed draw observer after-hook,
// preserving error detection before READY and in opt-in performance mode.
import fs from 'node:fs';
import assert from 'node:assert/strict';
const src=fs.readFileSync('showroom/globe/h-earth/diagnostic/renderer-startup-observer.v1.js','utf8');
const renderer=fs.readFileSync('showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js','utf8');
const line=src.split('\n').find(l=>l.includes("for(const name of ['drawElements','drawArrays'])wrap(context,name,"));
assert.ok(line,'DRAW_OBSERVER_HOOK_MISSING');
assert.ok(line.includes("if(state.stages.READY_PUBLISHED==='PASS'&&!performanceEnabled)return"),'POST_READY_NON_PROFILING_BAILOUT_MISSING');
assert.ok(line.includes("state.webglError=context.getError()"),'PRESERVED_INITIAL_GL_ERROR_CHECK_MISSING');
assert.ok(renderer.includes("const error = gl.getError(); if (error !== gl.NO_ERROR) throw new Error(`R3C_DRAW_ERROR:${error}`)"),'PERSISTENT_RENDERER_FRAME_END_ERROR_GUARD_CHANGED');

function bind({ready=false,profiling=false,glError=0}={}){
 const calls={getError:0,mark:[],fail:[]},state={stages:{READY_PUBLISHED:ready?'PASS':'NOT_REACHED',INITIAL_DRAW_ENTERED:'NOT_REACHED'},webglError:null};
 const context={NO_ERROR:0,getError(){calls.getError++;return glError;}},marks=(...args)=>calls.mark.push(args),failure=(...args)=>calls.fail.push(args);
 const hooks=[];
 const capture=(_,name,before,after,onError)=>hooks.push({name,before,after,onError});
 new Function('context','state','performanceEnabled','mark','fail','wrap',line)(context,state,profiling,marks,failure,capture);
 assert.deepEqual(hooks.map(x=>x.name),['drawElements','drawArrays']);
 return {hooks,state,calls};
}
let initial=bind({ready:false});
initial.hooks[0].before();
initial.hooks[0].after();
assert.equal(initial.calls.getError,1,'INITIAL_DRAW_CHECK_NOT_RETAINED');
assert.ok(initial.calls.mark.some(x=>x[0]==='INITIAL_DRAW_RETURNED'&&x[1]==='PASS'));
let failure=bind({ready:false,glError:1282});
failure.hooks[0].after();
assert.equal(failure.calls.getError,1);
assert.ok(failure.calls.fail.some(x=>x[0]==='INITIAL_DRAW_RETURNED'),'PRE_READY_DRAW_ERROR_NOT_SURFACED');
let steady=bind({ready:true});
for(let i=0;i<116;i++)steady.hooks[i%2].after();
assert.equal(steady.calls.getError,0,'POST_READY_GL_POLLING_NOT_STOPPED');
assert.equal(steady.calls.mark.length,0,'POST_READY_RECEIPT_DOM_UPDATES_NOT_STOPPED');
let instrumented=bind({ready:true,profiling:true});
for(let i=0;i<116;i++)instrumented.hooks[i%2].after();
assert.equal(instrumented.calls.getError,116,'OPT_IN_PROFILING_REMOVED');
assert.equal(instrumented.calls.mark.length,116,'OPT_IN_PROFILING_RECEIPTS_REMOVED');
const receipt={schema:'H_EARTH_POST_READY_STARTUP_OBSERVER_COST_VERIFIER_v1',result:'PASS',observedHookCount:2,ordinarySteadyState116DrawGlErrorCalls:steady.calls.getError,preReadyErrorPreserved:true,profiling116DrawGlErrorCalls:instrumented.calls.getError,rendererFrameEndErrorGuardPreserved:true,limitations:['NOT_PHONE_PERFORMANCE_QUALIFICATION','NOT_VISUAL_TREE_ARRIVAL_PROOF']};
console.log(JSON.stringify(receipt,null,2));
