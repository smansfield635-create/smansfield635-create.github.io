#!/usr/bin/env node
// Actual browser WebGL2 shader compilation, draw, and resource disposal.
// This is not a mock WebGL test and does not claim visual acceptance.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';
const modulePath=path.resolve('showroom/globe/h-earth/render/compact-four-tree-foliage.v1.js');
const browser=process.env.H_EARTH_CHROME || ['google-chrome','chromium','chromium-browser'].find(name=>{
 const probe=spawnSync('which',[name],{encoding:'utf8'});return probe.status===0;
});
if(!browser)throw Error('WEBGL2_BROWSER_NOT_AVAILABLE');
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'h-earth-webgl2-'));
const html=path.join(tmp,'test.html');
const moduleUrl=pathToFileURL(modulePath).href;
fs.writeFileSync(html,`<!doctype html><html><body><pre id="result">PENDING</pre><script type="module">
import {createFourTreeCompactPrograms,bindFourTreeCompactReconstructionUniforms,bindFourTreeCompactMatrix,createFourTreeCompactResidency} from '${moduleUrl}';
const out=document.querySelector('#result');
try{
 const canvas=document.createElement('canvas');canvas.width=64;canvas.height=64;
 const gl=canvas.getContext('webgl2',{antialias:false,preserveDrawingBuffer:true});
 if(!gl)throw Error('WEBGL2_CONTEXT_UNAVAILABLE');
 const pair=createFourTreeCompactPrograms(gl);
 const origin={origin:[0,0,0],positionScale:[0.001,0.001,0.001],leafExtentScale:[0.001,0.001]};
 const identity=[1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1];
 for(const program of [pair.color,pair.shadow])bindFourTreeCompactReconstructionUniforms(gl,program,origin);
 bindFourTreeCompactMatrix(gl,pair.color,'uCompactViewProjection',identity);
 bindFourTreeCompactMatrix(gl,pair.shadow,'uCompactLightMatrix',identity);
 const records=new Uint8Array(172032),sidecar=new Uint8Array(229376);
 const words=new DataView(records.buffer);
 for(let i=0;i<7168;i++)words.setUint32(i*24+8,(200<<16)|200,true);
 const residency=createFourTreeCompactResidency(gl,{compactRecords:records,contactSidecar:sidecar,indexData:new Uint16Array([0,1,2,2,1,3]),program:pair.color,shadowProgram:pair.shadow});
 gl.viewport(0,0,64,64);gl.clearColor(0,0,0,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
 const before=gl.getError();
 if(before!==gl.NO_ERROR)throw Error('WEBGL2_PRE_DRAW_ERROR:'+before);
 gl.bindFramebuffer(gl.FRAMEBUFFER,null);
 gl.enable(gl.DEPTH_TEST);
 gl.depthFunc(gl.LEQUAL);
 gl.useProgram(pair.color);
 const programValid=gl.getProgramParameter(pair.color,gl.LINK_STATUS);
 if(!programValid)throw Error('WEBGL2_COLOR_PROGRAM_UNLINKED');
 const color=residency.draw(7168,'color');
 const afterColor=gl.getError();
 if(afterColor!==gl.NO_ERROR)throw Error('WEBGL2_COLOR_DRAW_ERROR:'+afterColor);
 const pixel=new Uint8Array(4);
 gl.readPixels(32,32,1,1,gl.RGBA,gl.UNSIGNED_BYTE,pixel);
 if(pixel[1]<40)throw Error('WEBGL2_VISIBLE_PIXEL_NOT_DRAWN:'+Array.from(pixel));
 gl.useProgram(pair.shadow);
 const shadow=residency.draw(7168,'shadow');
 const error=gl.getError();
 if(error!==gl.NO_ERROR)throw Error('WEBGL2_SHADOW_DRAW_ERROR:'+error);
 residency.dispose();pair.dispose();
 out.textContent=JSON.stringify({status:'PASS',renderer:gl.getParameter(gl.RENDERER),instances:color.instances,shadowInstances:shadow.instances,triangles:color.submittedTriangles});
}catch(e){out.textContent=JSON.stringify({status:'FAIL',error:String(e)});}
</script></body></html>`);
const args=['--headless','--no-sandbox','--disable-gpu-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-webgl','--enable-unsafe-swiftshader','--allow-file-access-from-files','--virtual-time-budget=15000','--dump-dom',pathToFileURL(html).href];
const run=spawnSync(browser,args,{encoding:'utf8',timeout:45000,maxBuffer:4*1024*1024});
const match=run.stdout?.match(/<pre id="result">([^<]+)<\/pre>/);
const raw=match?.[1]?.replaceAll('&quot;','"').replaceAll('&amp;','&');
if(!raw)throw Error('WEBGL2_BROWSER_RESULT_MISSING:'+String(run.stderr).slice(-500));
const receipt=JSON.parse(raw);
console.log(JSON.stringify({schema:'H_EARTH_FOUR_TREE_ACTUAL_WEBGL2_v1',...receipt},null,2));
if(receipt.status!=='PASS'||receipt.instances!==7168||receipt.shadowInstances!==7168)process.exitCode=1;
