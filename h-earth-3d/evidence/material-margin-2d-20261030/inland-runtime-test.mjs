import fs from 'node:fs';import assert from 'node:assert/strict';import crypto from 'node:crypto';
const dir=new URL('./',import.meta.url);const code=fs.readFileSync(new URL('material-margin-field.v1.js',dir),'utf8');
const {buildMaterialMarginField,MATERIAL_MARGIN_GLSL}=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
const baseline=fs.readFileSync('/workspace/scratch/a96b8ab32ba2/repo/showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js','utf8');
const expected=Function('return '+baseline.match(/const expected=(\{.*?\});/)[1])();const manifest=JSON.parse(baseline.match(/const CORRECTED_MANIFEST=(\{.*?\});/)[1]);
const r=buildMaterialMarginField(expected,manifest);assert.equal(r.width,97);assert.equal(r.height,97);assert.equal(r.receipt.status,'SOURCE_MATCHED_COMPARISON_CANDIDATE');assert.equal(r.pixels.byteLength,75272);
assert.equal(crypto.createHash('sha256').update(new Uint8Array(r.pixels.buffer)).digest('hex'),r.receipt.correctionSha256);
for(const k of Object.keys(expected)){const bad=buildMaterialMarginField({...expected,[k]:'mismatch'},manifest);assert.equal(bad.receipt.status,'INACTIVE_SOURCE_MISMATCH');assert.ok(bad.pixels.every(x=>x===0));}
for(let i=0;i<2;i++){const bad=structuredClone(manifest);bad.atlases[i].sha256='bad';assert.equal(buildMaterialMarginField(expected,bad).receipt.status,'INACTIVE_SOURCE_MISMATCH');}
assert.equal(buildMaterialMarginField({},{}).width,1);
const renderer=fs.readFileSync(new URL('persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js',dir),'utf8');assert.equal((renderer.match(/palette\+=marginDelta\.x\*materialMarginSubstrate\+marginDelta\.yzw;/g)||[]).length,1);assert.ok(renderer.includes('gl.RGBA16F'));assert.ok(renderer.includes('gl.HALF_FLOAT'));assert.ok(MATERIAL_MARGIN_GLSL.includes('(q*96.0+.5)/97.0'));
fs.writeFileSync(new URL('runtime-test.json',dir),JSON.stringify({sourceMatch:true,mismatchDisables:true,correctionHashVerified:true,allOriginalAttributesBound:true,atlasHashesBound:true,bytes:r.pixels.byteLength,syntaxPass:true,webglExecuted:false,visualAccepted:false,receipt:r.receipt},null,2));console.log('Runtime data/source guards PASS; GPU pending');
