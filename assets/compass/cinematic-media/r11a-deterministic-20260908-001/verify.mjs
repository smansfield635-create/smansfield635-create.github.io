#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const argv=process.argv.slice(2);const arg=n=>argv[argv.indexOf(n)+1];
const manifestPath=path.resolve(arg('--manifest'));const masterPath=path.resolve(arg('--master'));const dir=path.dirname(masterPath);
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const manifest=JSON.parse(fs.readFileSync(manifestPath));const construction=JSON.parse(fs.readFileSync(path.join(dir,'construction-receipt.v1.json')));const recorded=JSON.parse(fs.readFileSync(path.join(dir,'verification-receipt.v1.json')));
const manifestSha=sha(manifestPath),masterSha=sha(masterPath);const proofs=manifest.scenes.filter(s=>s.treatment==='APPROVED_MOTION_PROOF').map(s=>s.id);
const coverage=manifest.scenes[0].frameRange[0]===0&&manifest.scenes.at(-1).frameRange[1]===1275&&manifest.scenes.every((s,i)=>s.frameRange[1]-s.frameRange[0]===s.frameCount&&(i===0||manifest.scenes[i-1].frameRange[1]===s.frameRange[0]));
const pass=manifestSha===construction.frozenManifestSha256&&manifestSha===construction.builderInputManifestSha256&&manifestSha===recorded.verifierInputManifestSha256&&masterSha===construction.outputSha256&&masterSha===recorded.masterSha256&&coverage&&JSON.stringify(proofs)===JSON.stringify(['S00','S04'])&&manifest.contextLaw.contextEndFrame===990&&manifest.scenes.filter(s=>s.frameRange[0]>=990).every(s=>s.context.length===0)&&recorded.result==='PASS_CLOSED'&&recorded.checks.every(c=>c.pass===true);
const receipt={schema:'R11A_REPOSITORY_READBACK_VERIFICATION_v1',result:pass?'PASS_CLOSED':'FAIL_CLOSED',manifestSha256:manifestSha,masterSha256:masterSha,recordedTechnicalReceiptResult:recorded.result};console.log(JSON.stringify(receipt,null,2));process.exit(pass?0:1);
