#!/usr/bin/env node
import fs from 'node:fs';
const manifest=JSON.parse(fs.readFileSync(new URL('./manifest.v1.json',import.meta.url),'utf8'));
const plan={
  schema:'R11A_S00_BROWSER_RENDER_PLAN_v1',
  shot:'S00',
  stage:'stage.html',
  viewport:{width:1280,height:720},
  sourceCapture:'CANONICAL_BROWSER_RENDERED_ENTRY_SURFACE',
  injectionApi:'S00Stage.setRaster(dataUrl, metrics)',
  proofProgress:manifest.proofStates.map(x=>x.progress),
  outputRoot:'/tmp/r11a-source-truth-shot-proofs-20260908-002/',
  masterRender:false,
  liveMutation:false
};
process.stdout.write(JSON.stringify(plan,null,2)+'\n');
