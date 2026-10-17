import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {verifyFineGrassSelectorContract as verify} from './h-earth.four-tree-fine-grass.v1.mjs';

// These are negative tests of the qualification adapter. Injected runner results
// exercise fail-closed transport handling; only the final test runs real qualification.
const grass=await readFile(new URL('../../showroom/globe/h-earth/render/woodland-fine-grass.v1.js',import.meta.url),'utf8');
const renderer=await readFile(new URL('../../showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js',import.meta.url),'utf8');
const success=(pass=13)=>({status:0,stdout:`TAP version 13\n1..13\n# tests 13\n# pass ${pass}\n# fail 0\n# skipped ${13-pass}\n`});
const fixture=(overrides={})=>({grass,renderer,runContinuitySuite:()=>success(),...overrides});
function replaceRequired(source,needle,replacement){assert.ok(source.includes(needle),'mutation must affect actual candidate source');return source.replace(needle,replacement);}

test('continuous adapter requires behavioral execution and reports precise scope',()=>{
 let executions=0;const report=verify(fixture({runContinuitySuite:()=>{executions++;return success();}}));assert.equal(executions,1);assert.deepEqual(report,{generation:2785,continuitySourceTests:'PASS_CPU_SOURCE_SOFTWARE_GLES_WHEN_AVAILABLE'});
 assert.equal(verify(fixture({runContinuitySuite:()=>success(12)})).generation,2785,'optional unavailable software GLES may skip exactly its optional probe');
});
test('historical implementation retains its original fixed-underlay contract without successor execution',()=>{
 const historical={grass:'c.persistentIndices; const fixedCount=10;',renderer:'historical renderer',runContinuitySuite:()=>{throw Error('HISTORICAL_MUST_NOT_RUN_SUCCESSOR');}};assert.deepEqual(verify(historical),{generation:null});
 for(const missing of ['c.persistentIndices','fixedCount'])assert.throws(()=>verify({...historical,grass:historical.grass.replace(missing,'REMOVED')}),/GEN2710_WORLD_FIXED_GRASS_UNDERLAY_MISSING/);
});
test('missing selector marker cannot downgrade a successor renderer to historical acceptance',()=>{
 const mutated=replaceRequired(grass,'export const FINE_GRASS_CONTINUITY=','const REMOVED_CONTINUITY=');assert.throws(()=>verify(fixture({grass:mutated})),/CONTINUITY_SELECTOR_MARKER_MISSING/);
});
test('missing CPU visibility or importance export fails before behavioral execution',()=>{
 for(const name of ['fineGrassVisibility','fineGrassImportance']){let called=false;const mutated=replaceRequired(grass,`export function ${name}(`,`function renamed_${name}(`);assert.throws(()=>verify(fixture({grass:mutated,runContinuitySuite:()=>{called=true;return success();}})),/CONTINUITY_VISIBILITY_CONTRACT_MISSING/);assert.equal(called,false);}
});
test('missing actual-camera and cutoff uploads each fail closed',()=>{
 for(const needle of ['uniform3f(state.uniforms.uWoodlandCameraPosition','uniform1f(state.uniforms.uWoodlandSelectionCutoff,selection.cutoff)']){let called=false;const mutated=replaceRequired(renderer,needle,'BROKEN_UPLOAD');assert.throws(()=>verify(fixture({renderer:mutated,runContinuitySuite:()=>{called=true;return success();}})),/CONTINUITY_UNIFORM_WIRING_MISSING/);assert.equal(called,false);}
});
test('using legacy fragment shader instead of dedicated coverage shader fails closed',()=>{
 const mutated=replaceRequired(renderer,'createShader(gl.FRAGMENT_SHADER,WOODLAND_FINE_GRASS_FS)','createShader(gl.FRAGMENT_SHADER,FS)');assert.throws(()=>verify(fixture({renderer:mutated})),/CONTINUITY_COVERAGE_SHADER_MISSING/);
});
test('failed, signaled, missing, and throwing behavioral runners cannot qualify',()=>{
 const failures=[{status:1,stdout:success().stdout},{status:null,signal:'SIGTERM',stdout:success().stdout},{status:null,error:{code:'ENOENT'},stdout:''},undefined];
 for(const result of failures)assert.throws(()=>verify(fixture({runContinuitySuite:()=>result})),/CONTINUITY_BEHAVIORAL_TESTS_FAILED/);
 assert.throws(()=>verify(fixture({runContinuitySuite:()=>{throw Error('MISSING_TEST_SUITE');}})),/MISSING_TEST_SUITE/);
});
test('zero exit with empty, truncated, failed or incomplete suite evidence cannot qualify',()=>{
 const outputs=['','PASS', '# tests 0\n# pass 0\n# fail 0\n', '# tests 13\n# pass 11\n# fail 0\n','# tests 12\n# pass 12\n# fail 0\n','# tests 13\n# pass 12\n# fail 1\n','# tests 13\n# fail 0\n',success().stdout.replace('# tests 13','# tests 130')];
 for(const stdout of outputs)assert.throws(()=>verify(fixture({runContinuitySuite:()=>({status:0,stdout})})),/CONTINUITY_BEHAVIORAL_EVIDENCE_MISSING/);
});
test('actual successor qualification executes all existing continuity tests',()=>{
 const report=verify({grass,renderer});assert.equal(report.generation,2785);assert.equal(report.continuitySourceTests,'PASS_CPU_SOURCE_SOFTWARE_GLES_WHEN_AVAILABLE');
});
