import assert from 'node:assert/strict';
import {registerHooks} from 'node:module';
import {readFileSync,writeFileSync,mkdtempSync,mkdirSync,rmSync} from 'node:fs';
import {resolve,dirname,posix} from 'node:path';
import {pathToFileURL,fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {tmpdir} from 'node:os';
import {createHash} from 'node:crypto';
import vm from 'node:vm';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'../../../../..');
const baselineHead='935e756e725f8c205921437fbace9faef45c28eb';
const prefix='showroom/globe/h-earth/';
const previewPath=prefix+'render/landscape-preview.js';
const envPath=prefix+'render/run8e-successor-environment.js';
const clearancePath=prefix+'functional-landscape/visible-terrain-clearance.js';
const source=readFileSync(resolve(root,previewPath),'utf8');
const envSource=readFileSync(resolve(root,envPath),'utf8');
const previewSpecifier=envSource.match(/from '([^']*landscape-preview\.js[^']*)'/)[1];
const previewURL=new URL(previewSpecifier,pathToFileURL(resolve(root,envPath))).href;
const constructMarker='function constructHEarthFunctionalLandscapePreview({cameraWorld={x:0,y:8,z:-40}}={}){';
assert.ok(source.includes(constructMarker));
function qualifySourceAndQueries(){
 const original=execFileSync('git',['show',baselineHead+':'+previewPath],{cwd:root,encoding:'utf8'});
 assert.equal(source.slice(0,source.indexOf('export const H_EARTH_FUNCTIONAL_LANDSCAPE_DEFAULT_CAMERA')).replace('function constructHEarthFunctionalLandscapePreview','export function previewHEarthFunctionalLandscape'),original.slice(0,original.indexOf('export const H_EARTH_FUNCTIONAL_LANDSCAPE_NEUTRAL_PREVIEW')),'Private constructor body must remain byte-identical');
 const edges=[['render/landscape-preview.js','render/run8e-successor-environment.js'],['render/landscape-preview.js','render/functional-landscape-frame.js'],['render/landscape-preview.js','functional-landscape/visible-terrain-clearance.js'],['functional-landscape/visible-terrain-clearance.js','functional-landscape/navigation.js'],['functional-landscape/navigation.js','diagnostic/run8e-r3d/pointer-touch-intake.js'],['functional-landscape/navigation.js','render/live-renderer-contract.run8e-r3a.js'],['diagnostic/run8e-r3d/pointer-touch-intake.js','functional-landscape/public-live-gpu-integration.run8e-r3e.js']];
 for(const [target,consumer] of edges){const hash=createHash('sha256').update(readFileSync(resolve(root,prefix+target))).digest('hex').slice(0,16);assert.ok(readFileSync(resolve(root,prefix+consumer),'utf8').includes(target.split('/').at(-1)+'?cb='+hash),'Current query edge '+consumer+' -> '+target);}
 const queue=[pathToFileURL(resolve(root,prefix+'functional-landscape/public-live-gpu-integration.run8e-r3e.js')),pathToFileURL(resolve(root,prefix+'render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js'))],seen=new Set(),previewURLs=new Set();
 while(queue.length){const url=queue.pop();if(seen.has(url.href))continue;seen.add(url.href);const text=readFileSync(fileURLToPath(url),'utf8');for(const match of text.matchAll(/(?:\bfrom\s*|\bimport\s*\(\s*|\bimport\s*)['"]([^'"]+)['"]/g)){if(!match[1].startsWith('.'))continue;const child=new URL(match[1],url);if(fileURLToPath(child)===resolve(root,previewPath))previewURLs.add(child.href);queue.push(child);}}
 assert.deepEqual([...previewURLs],[previewURL]);return {result:'PASS',privateConstructorBody:'BYTE_IDENTICAL',sourceHashEdges:edges.length,selectedClosureModuleURLs:seen.size,selectedPreviewModuleURLs:[...previewURLs]};
}
const sourceQualification=qualifySourceAndQueries();
if(process.argv.includes('--source-and-binding-graph-only')){
 const index=readFileSync(resolve(root,prefix+'index.html'),'utf8'),elements=[...index.matchAll(/<[a-z][^>]*\bid="(?:h-earth-3d-route-root|h-earth-functional-landscape-route)"[^>]*>/g)].map(match=>Object.fromEntries([...match[0].matchAll(/([\w-]+)="([^"]*)"/g)].map(attribute=>[attribute[1],attribute[2]])));
 const program=`import assert from 'node:assert/strict';let workers=0,requests=0;const elements=${JSON.stringify(elements)};globalThis.location={search:'?visual=terrain-relief-v2'};globalThis.document={getElementById:id=>{const attributes=elements.find(element=>element.id===id);return attributes?{getAttribute:name=>attributes[name]??null}:null;}};globalThis.Worker=class{constructor(){workers++;}postMessage(){requests++;}terminate(){}};await import(${JSON.stringify(pathToFileURL(resolve(root,prefix+'diagnostic/run8e-r3d/live-gpu-binding.js')).href)});assert.equal(workers,1);assert.equal(requests,1);console.log('ACTUAL_BINDING_GRAPH_PASS');`;
 assert.ok(execFileSync(process.execPath,['--input-type=module','-e',program],{encoding:'utf8'}).includes('ACTUAL_BINDING_GRAPH_PASS'));console.log(JSON.stringify({...sourceQualification,actualFinalBindingGraph:'PASS_SINGLE_WORKER_REQUEST'}));process.exit(0);
}
registerHooks({load(url,context,nextLoad){const loaded=nextLoad(url,context);if(url!==previewURL)return loaded;const text=typeof loaded.source==='string'?loaded.source:Buffer.from(loaded.source).toString('utf8');return {...loaded,source:text.replace(constructMarker,constructMarker+'globalThis.__previewReuseQualificationConstructionCount=(globalThis.__previewReuseQualificationConstructionCount??0)+1;')};}});
const baselineRoot=mkdtempSync(resolve(tmpdir(),'h-earth-preview-baseline-'));
process.on('exit',()=>rmSync(baselineRoot,{recursive:true,force:true}));
const pending=[previewPath,clearancePath],closure=new Set();
while(pending.length){const path=pending.pop();if(closure.has(path))continue;closure.add(path);const text=execFileSync('git',['show',baselineHead+':'+path],{cwd:root,encoding:'utf8'});mkdirSync(dirname(resolve(baselineRoot,path)),{recursive:true});writeFileSync(resolve(baselineRoot,path),text);for(const match of text.matchAll(/(?:\bfrom\s*|\bimport\s*\(\s*|\bimport\s*)['"]([^'"]+)['"]/g)){const spec=match[1].split('?')[0];if(spec.startsWith('.'))pending.push(posix.normalize(posix.join(posix.dirname(path),spec)));}}
writeFileSync(resolve(baselineRoot,'package.json'),'{"type":"module"}\n');
const accepted=await import(pathToFileURL(resolve(baselineRoot,previewPath)).href);
const current=await import(previewURL);
const defaultPreview=current.H_EARTH_FUNCTIONAL_LANDSCAPE_NEUTRAL_PREVIEW;
assert.equal(defaultPreview.ok,true);assert.equal(globalThis.__previewReuseQualificationConstructionCount,1);
assert.deepEqual(defaultPreview,accepted.H_EARTH_FUNCTIONAL_LANDSCAPE_NEUTRAL_PREVIEW);
assert.equal(current.previewHEarthFunctionalLandscape(),defaultPreview);
assert.equal(current.previewHEarthFunctionalLandscape(undefined),defaultPreview);
assert.equal(current.previewHEarthFunctionalLandscape({}),defaultPreview);
assert.equal(current.previewHEarthFunctionalLandscape({cameraWorld:undefined}),defaultPreview);
assert.equal(current.previewHEarthFunctionalLandscape({cameraWorld:current.H_EARTH_FUNCTIONAL_LANDSCAPE_DEFAULT_CAMERA}),defaultPreview);
const environment=await import(pathToFileURL(resolve(root,envPath)).href);
assert.equal(environment.buildHEarthRun8ENeutralPackage({deferVegetation:true}).ok,true);
assert.equal(globalThis.__previewReuseQualificationConstructionCount,1,'Eager preview plus environment default must build once');
const seen=new WeakSet();function frozenTree(value){if(!value||typeof value!=='object'||seen.has(value))return;seen.add(value);assert.ok(Object.isFrozen(value));for(const child of Object.values(value))frozenTree(child);}frozenTree(defaultPreview);
const inputs=[{x:0,y:8,z:-40},{x:8,y:12,z:-80},{x:0,y:8,z:-40,extra:'preserved'},Object.assign(Object.create({inherited:true}),{x:0,y:8,z:-40}),{x:-0,y:8,z:-40}];
for(const cameraWorld of inputs){const before=globalThis.__previewReuseQualificationConstructionCount;const result=current.previewHEarthFunctionalLandscape({cameraWorld});assert.equal(globalThis.__previewReuseQualificationConstructionCount,before+1);assert.notEqual(result,defaultPreview);assert.deepEqual(result,accepted.previewHEarthFunctionalLandscape({cameraWorld}));}
function cameraWithReads(log){return {get x(){log.push('x');return 0;},get y(){log.push('y');return 8;},get z(){log.push('z');return -40;}};}
const newReads=[],oldReads=[];assert.deepEqual(current.previewHEarthFunctionalLandscape({cameraWorld:cameraWithReads(newReads)}),accepted.previewHEarthFunctionalLandscape({cameraWorld:cameraWithReads(oldReads)}));assert.deepEqual(newReads,oldReads);
const newProxyReads=[],oldProxyReads=[];const proxy=log=>new Proxy({x:0,y:8,z:-40},{get(target,key,receiver){log.push(['get',String(key)]);return Reflect.get(target,key,receiver);},ownKeys(target){log.push(['ownKeys']);return Reflect.ownKeys(target);},getOwnPropertyDescriptor(target,key){log.push(['descriptor',String(key)]);return Reflect.getOwnPropertyDescriptor(target,key);}});
assert.deepEqual(current.previewHEarthFunctionalLandscape({cameraWorld:proxy(newProxyReads)}),accepted.previewHEarthFunctionalLandscape({cameraWorld:proxy(oldProxyReads)}));assert.deepEqual(newProxyReads,oldProxyReads);
for(const module of [current,accepted]){assert.throws(()=>module.previewHEarthFunctionalLandscape(null),TypeError);const sentinel=new Error('options-getter');assert.throws(()=>module.previewHEarthFunctionalLandscape({get cameraWorld(){throw sentinel;}}),error=>error===sentinel);}
let optionReads=0;current.previewHEarthFunctionalLandscape({get cameraWorld(){optionReads++;return current.H_EARTH_FUNCTIONAL_LANDSCAPE_DEFAULT_CAMERA;}});assert.equal(optionReads,1);
const wrapper=source.slice(source.indexOf('export const H_EARTH_FUNCTIONAL_LANDSCAPE_DEFAULT_CAMERA'),source.indexOf('export const H_EARTH_FUNCTIONAL_LANDSCAPE_NEUTRAL_PREVIEW')).replace(/export /g,'');
for(const firstResult of ['rejected','throw']){let calls=0;const good=Object.freeze({ok:true,nested:Object.freeze({value:1})});const context={constructHEarthFunctionalLandscapePreview:()=>{calls++;if(calls===1){if(firstResult==='throw')throw new Error('construction-failed');return Object.freeze({ok:false});}return good;}};vm.createContext(context);vm.runInContext(wrapper+'\nthis.preview=previewHEarthFunctionalLandscape;',context);if(firstResult==='throw')assert.throws(()=>context.preview(),/construction-failed/);else assert.equal(context.preview().ok,false);assert.equal(context.preview(),good);assert.equal(context.preview(),good);assert.equal(calls,2);}
const currentClearance=await import(pathToFileURL(resolve(root,clearancePath)).href),acceptedClearance=await import(pathToFileURL(resolve(baselineRoot,clearancePath)).href);
for(const [x,z] of [[0,-40],[20,-100],[-100,-160],[500,500]]){assert.deepEqual(currentClearance.sampleHEarthVisibleTerrainClearanceSurface(x,z),acceptedClearance.sampleHEarthVisibleTerrainClearanceSurface(x,z));for(const yawDegrees of [0,90,225])assert.deepEqual(currentClearance.sampleHEarthVisibleTerrainClearanceEnvelope(x,z,{yawDegrees}),acceptedClearance.sampleHEarthVisibleTerrainClearanceEnvelope(x,z,{yawDegrees}));}
const result={schema:'H_EARTH_IDENTICAL_DEFAULT_PREVIEW_REUSE_CPU_QUALIFICATION_v1',result:'PASS',baselineHead,sourceQualification,baselineClosureFiles:closure.size,defaultConstructionCount:1,defaultIdentityReuse:'PASS',explicitCameraIsolation:'PASS_EQUAL_NONDEFAULT_EXTRA_ACCESSOR_CUSTOM_PROTOTYPE_NEGATIVE_ZERO',optionsAndProxyObservables:'PASS',unsuccessfulAndThrowNotCached:'PASS',deepImmutability:'PASS',clearanceSurfaceAndEnvelopeEquality:'PASS',previewSourceSHA256:createHash('sha256').update(source).digest('hex'),claimCeiling:'CPU immutable reuse and equality only; no physical device READY gain or anchor acceptance'};
if(process.env.H_EARTH_PREVIEW_REUSE_CPU_RECEIPT)writeFileSync(process.env.H_EARTH_PREVIEW_REUSE_CPU_RECEIPT,JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));
