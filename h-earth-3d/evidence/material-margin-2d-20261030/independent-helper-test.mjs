import fs from 'node:fs';
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
const dir=new URL('.',import.meta.url);const {buildMaterialMarginField,MATERIAL_MARGIN_GLSL}=await import(new URL('material-margin-field.v1.js',dir));
const input=new URL('../boundary-reconciliation/habitat-core-input/',dir);
const native=new Uint8Array(fs.readFileSync(new URL('native-atlas.bin',input)));const baseline=new Uint8Array(fs.readFileSync(new URL('sigma2-atlas.bin',input)));
const habitat={size:192,width:576,height:192,pixels:native,coastal:{bounds:[-448,-283,448,-93]}};const presentation={pixels:baseline};
let a=buildMaterialMarginField(habitat,presentation);assert.equal(a.width,89);assert.equal(a.height,65);assert.equal(a.pixels.length,11570);
const fail=()=>{const r=buildMaterialMarginField(habitat,presentation);assert.equal(r.width,1);assert.equal(r.height,1);assert.deepEqual([...r.pixels],[0,0]);};
for(const [array,index] of [[native,384],[native,191*576+575],[baseline,384],[baseline,191*576+575]]){array[index]^=1;fail();array[index]^=1;}
habitat.coastal.bounds[0]++;fail();habitat.coastal.bounds[0]--;
const keep=buildMaterialMarginField(habitat,presentation);a.pixels.fill(255);assert.deepEqual(buildMaterialMarginField(habitat,presentation).pixels,keep.pixels);
fs.writeFileSync(new URL('independent-decoded-correction.bin',dir),keep.pixels);
console.log(JSON.stringify({helperSourceMatch:true,sourceMismatchZero:true,returnedPixelsIsolated:true,correctionBytes:keep.pixels.length}));
