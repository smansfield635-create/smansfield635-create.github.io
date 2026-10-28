import test from 'node:test';
import assert from 'node:assert/strict';
import {WORLD_ENCODING,encodeWorld,decodeWorld,calibrationExpected,validateCalibration,makeCalibrationInstaller,installWorldInvalidation} from './h-earth-world-position-overlay.mjs';
test('all 4,194,308 representable values roundtrip and contain their quantization cell',()=>{for(let m=0;m<4;m++){const s=WORLD_ENCODING.specs[m];for(let i=0;i<=1048576;i++){const x=s.min+i*s.step,d=decodeWorld(encodeWorld(x,m),m);assert.equal(d.value,x);}for(const i of [0,1,255,65535,524288,1048575]){const x=s.min+(i+.4)*s.step,d=decodeWorld(encodeWorld(x,m),m);assert.ok(x>=d.interval[0]&&x<=d.interval[1]);}}});
test('invalid, out-of-range, wrong alpha, excess code fail distinctly',()=>{assert.equal(decodeWorld(encodeWorld(0,0,{eligible:false}),0).reason,'NON_TERRAIN');for(const value of [NaN,Infinity,-Infinity,32769,-32769])assert.equal(decodeWorld(encodeWorld(value,0),0).reason,'OUT_OF_RANGE');assert.throws(()=>decodeWorld([0,0,1,254],0));assert.throws(()=>decodeWorld([32,0,0,255],0));assert.throws(()=>encodeWorld(0,4));});
test('calibration validates every byte and rejects corruption',()=>{for(let m=0;m<4;m++){const pixels=calibrationExpected(m).flat();assert.equal(validateCalibration(pixels,m),true);pixels[29]^=1;assert.throws(()=>validateCalibration(pixels,m));}assert.ok(makeCalibrationInstaller().includes('encodePreciseWorld'));});
test('fragment invalidation preserves source discard and fails closed ambiguous output',()=>{let submitted;const gl={FRAGMENT_SHADER:2,SHADER_TYPE:3,getShaderParameter:()=>2,shaderSource:(shader,source)=>submitted=source,useProgram:()=>{},getUniformLocation:()=>null,uniform1i:()=>{}};const h=installWorldInvalidation(gl,'present');gl.shaderSource({},'#version 300 es\nout vec4 rgba;void main(){if(true)discard;rgba=vec4(1.0);}');assert.ok(submitted.includes('if(true)discard;'));assert.ok(submitted.includes('preciseOriginalMain();if(uPreciseWorldInvalidate==1)rgba='));gl.shaderSource({},'present');assert.equal(submitted,'present');gl.shaderSource({},'void main(){discard;}');assert.ok(submitted.includes('discard;'));assert.throws(()=>gl.shaderSource({},'out vec4 a;out vec4 b;void main(){}'));assert.equal(h.observations.length,3);h.restore();});

test('mode assignment updates every bound diagnostic program and preserves original path',()=>{
 const calls=[];const gl={FRAGMENT_SHADER:2,SHADER_TYPE:3,getShaderParameter:()=>2,shaderSource:()=>{},useProgram:p=>calls.push(['use',p]),getUniformLocation:(_,name)=>name,uniform1i:(name,value)=>calls.push([name,value])};
 const h=installWorldInvalidation(gl,'present');const p={};
 try{globalThis.__groundcoverFactorMode=3;gl.useProgram(p);assert.equal(globalThis.__groundcoverFactorModeApplied,3);assert.ok(calls.some(([n,v])=>n==='uPreciseWorldMode'&&v===3));globalThis.__groundcoverFactorMode=4;assert.throws(()=>gl.useProgram(p),/WORLD_MODE_INVALID/);}finally{h.restore();delete globalThis.__groundcoverFactorMode;delete globalThis.__groundcoverFactorModeApplied;}
});

test('renderer transformation rejects unbound source before instrumentation',async()=>{
 const {instrumentWorldRenderer}=await import('./h-earth-world-position-overlay.mjs');
 assert.throws(()=>instrumentWorldRenderer('const FS = `void main(){}`;'),/WORLD_SOURCE_HASH_MISMATCH/);
});
