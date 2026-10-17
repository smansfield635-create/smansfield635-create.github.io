import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

// Exercise the hosted runner's actual implementation, not a copied validator.
const workflow = readFileSync(new URL('../../.github/workflows/h-earth-neutral-exact-head-runner.yml', import.meta.url), 'utf8');
const source = workflow.split('// BEGIN CONTINUITY_CAPTURE_HELPERS')[1]?.split('// END CONTINUITY_CAPTURE_HELPERS')[0];
assert.ok(source, 'runner continuity helpers must remain extractable');
const context = vm.createContext({URLSearchParams, Number, JSON, Array, Boolean, String, Error});
vm.runInContext(source+'\nthis.helpers={continuityCaptureRequested,validateContinuityCapture,captureContinuityReplay};', context);
const {continuityCaptureRequested,validateContinuityCapture,captureContinuityReplay}=context.helpers;
const query='qualification=vegetation-continuity-v1&vegetation-trace=v1';
function fixture(){
  const point=(label,frame,x)=>({label,elapsedMilliseconds:frame*100,position:{x,y:2.25,z:0},cacheCell:{x:Math.floor(x/4),z:0},renderFrameCallCount:frame,traceSummary:{schema:'H_EARTH_VEGETATION_CONTINUITY_TRACE_v1',maximumEvents:512,maximumRoots:128,eventCount:55,lastSequence:55,droppedCount:0,observerErrorCount:0,timingPerturbed:true,disposed:false},probe:{enabled:true}});
  const observations=[point('INITIAL',10,0),point('BEFORE_MOVE',11,0),point('FORWARD_1',12,4),point('FORWARD_2',13,8),point('RETURN_1',14,4),point('RETURN_2',15,0),point('FINAL',16,0)];
  const qualification={schema:'H_EARTH_VEGETATION_CONTINUITY_REPLAY_v1',result:'TRACE_CAPTURED_VISUAL_VERDICT_NOT_ESTABLISHED',elapsedMilliseconds:1600,movementObserved:true,cacheCellTransitions:4,requestedStepsPerDirection:2,returnDistanceMeters:0,initial:observations[0],final:observations.at(-1),observations,physicalDeviceAcceptance:false,visiblePixelsVerified:false,publicationAuthorized:false};
  return {requested:true,waitCompleted:true,replayMarker:'captured',qualification,final:{canvasPresent:true,routeReady:'true',canvasScreenshotSha256:'a'.repeat(64),renderFrameCallCount:17,liveGpuReceipt:{counters:{renderFrameCallCount:17},vegetationContinuityQualification:structuredClone(qualification)}},performance:{observedAtMilliseconds:2000,navigation:[],timingPerturbed:true,physicalDeviceAcceptance:false},errors:[]};
}
test('selector reads the exact qualification value among URL parameters',()=>{
  assert.equal(continuityCaptureRequested(query),true);
  for(const q of ['', 'qualification=other', 'x=vegetation-continuity-v1','qualification=vegetation-continuity-v10'])assert.equal(continuityCaptureRequested(q),false);
});
// Trace summary fields above follow the actual hosted run 39003037819 receipt.
// Enabled belongs to the point probe; trace summaries expose schema and disposed.
test('complete actual trace and post-replay canvas are admissible capture evidence',()=>assert.equal(validateContinuityCapture(fixture()),true));
const invalidCases={
  'wait never completed': c=>{c.waitCompleted=false;},
  'wait or final capture error retained': c=>{c.errors=['timeout'];},
  'missing terminal receipt': c=>{c.qualification=null;},
  'failed replay receipt': c=>{c.qualification.result='FAIL';},
  'wrong schema': c=>{c.qualification.schema='OTHER';},
  'marker not terminal': c=>{c.replayMarker='running';},
  'nonfinite elapsed': c=>{c.qualification.elapsedMilliseconds=Infinity;},
  'missing forward observation': c=>{c.qualification.observations.splice(2,1);},
  'missing return observation': c=>{c.qualification.observations.splice(4,1);},
  'duplicate requested step masquerading as a complete walk': c=>{c.qualification.observations[3].label='FORWARD_1';},
  'missing FINAL observation': c=>{c.qualification.observations.pop();},
  'probe flag missing in an actual observation': c=>{delete c.qualification.observations[3].probe.enabled;},
  'FINAL summary disagrees with the observation': c=>{c.qualification.final={...c.qualification.final,elapsedMilliseconds:9999};},
  'route observations are out of order': c=>{[c.qualification.observations[2],c.qualification.observations[4]]=[c.qualification.observations[4],c.qualification.observations[2]];},
  'probe disabled in actual observations': c=>{c.qualification.observations[3].probe.enabled=false;},
  'trace schema absent': c=>{delete c.qualification.observations[3].traceSummary.schema;},
  'trace schema wrong': c=>{c.qualification.observations[3].traceSummary.schema='OTHER';},
  'trace collector disposed': c=>{c.qualification.observations[3].traceSummary.disposed=true;},
  'no observed movement': c=>{c.qualification.movementObserved=false;},
  'no crossed cache cells': c=>{c.qualification.cacheCellTransitions=0;},
  'no render advancement': c=>{c.qualification.final.renderFrameCallCount=10;},
  'actual final sample has no canvas': c=>{c.final.canvasPresent=false;},
  'actual final renderer predates replay completion': c=>{c.final.liveGpuReceipt.counters.renderFrameCallCount=15;},
  'missing actual final canvas hash': c=>{c.final.canvasScreenshotSha256=null;},
  'missing actual final live qualification': c=>{c.final.liveGpuReceipt.vegetationContinuityQualification=null;},
  'final live qualification disagrees': c=>{c.final.liveGpuReceipt.vegetationContinuityQualification.result='FAIL';},
};
for(const [name,mutate] of Object.entries(invalidCases))test('rejects '+name,()=>{const capture=fixture();mutate(capture);assert.equal(validateContinuityCapture(capture),false);});
function pageFixture(capture,{timeout=false}={}){
  const calls=[];
  return {calls,async waitForFunction(fn,arg,options){calls.push(['wait',options]);if(timeout)throw Error('replay timed out');},async evaluate(fn){const s=String(fn);calls.push(['evaluate',s]);if(s.includes('qualification:'))return {qualification:capture.qualification,replayMarker:capture.replayMarker,performance:capture.performance};return undefined;}};
}
test('ordinary routes perform no continuity waits, evaluations or final samples',async()=>{
  const page=pageFixture(fixture());let samples=0;
  assert.equal(await captureContinuityReplay(page,async()=>{samples++;},''),null);
  assert.equal(page.calls.length,0);assert.equal(samples,0);
});
test('requested replay waits before final actual frame is sampled',async()=>{
  const capture=fixture(),page=pageFixture(capture),labels=[];
  const result=await captureContinuityReplay(page,async label=>{assert.ok(page.calls.some(c=>c[0]==='wait'));labels.push(label);return capture.final;},query);
  assert.equal(result.waitCompleted,true);assert.equal(result.passed,true);assert.deepEqual(labels,['continuity-final']);
  const wait=page.calls.find(c=>c[0]==='wait');assert.ok(wait[1].timeout>30000&&wait[1].timeout<=600000);
  assert.equal(result.qualification.physicalDeviceAcceptance,false);assert.equal(result.qualification.visiblePixelsVerified,false);
});
test('timeout remains a failing receipt even if a late replay object exists',async()=>{
  const capture=fixture(),page=pageFixture(capture,{timeout:true});
  const result=await captureContinuityReplay(page,async()=>capture.final,query);
  assert.equal(result.waitCompleted,false);assert.equal(result.passed,false);assert.ok(result.errors.some(e=>e.includes('CONTINUITY_WAIT_FAILED')));
});
test('missing explicit trace flag cannot yield passing capture',async()=>{
  const capture=fixture(),page=pageFixture(capture);
  const result=await captureContinuityReplay(page,async()=>capture.final,'qualification=vegetation-continuity-v1');
  assert.equal(result.passed,false);assert.equal(page.calls.some(c=>c[0]==='wait'),false);assert.ok(result.errors.some(e=>e.includes('TRACE_QUERY_REQUIRED')));
});
test('final sample failure is retained and fails the hosted receipt',async()=>{
  const page=pageFixture(fixture());
  const result=await captureContinuityReplay(page,async()=>{throw Error('canvas unavailable');},query);
  assert.equal(result.passed,false);assert.ok(result.errors.some(e=>e.includes('FINAL_CAPTURE_FAILED')));
});
test('manual residency mutation and continuity observation cannot share a run',async()=>{
  const capture=fixture(),page=pageFixture(capture);
  const result=await captureContinuityReplay(page,async()=>capture.final,query,true);
  assert.equal(result.passed,false);assert.equal(page.calls.some(c=>c[0]==='wait'),false);
});
