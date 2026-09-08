#!/usr/bin/env node
import fs from 'node:fs';
const manifest=JSON.parse(fs.readFileSync(new URL('./manifest.v1.json',import.meta.url),'utf8'));
const plan={
  schema:'R11A_S00_S01_BROWSER_RENDER_PLAN_v1',
  shots:['S00','S01'],
  stage:'stage.html',
  viewport:{width:1280,height:720},
  predecessor:{
    sourceCapture:'CANONICAL_BROWSER_RENDERED_ENTRY_SURFACE',
    injectionApi:'S00Stage.setRaster(dataUrl, metrics)',
    proofProgress:manifest.proofStates.map(x=>x.progress),
    acceptedHead:manifest.acceptedPredecessor.head,
    ownerAcceptance:manifest.acceptedPredecessor.ownerAcceptance
  },
  successor:{
    sourceHandoff:'S00_SUCCESSOR_CINEMATIC_MATTER',
    stageApi:'S01Stage',
    renderCall:'S01Stage.render(progress)',
    manipulationCall:'S01Stage.manipulate(deltaYaw, deltaPitch)',
    proofProgress:manifest.successorShot.proof.requiredProgress,
    objectIds:manifest.successorShot.persistentObjects.map(x=>x.objectId),
    terminalForeground:manifest.successorShot.terminalForeground,
    ownerAcceptance:manifest.successorShot.proof.ownerAcceptance
  },
  outputRoot:'/tmp/r11a-source-truth-shot-proofs-20260908-003/',
  masterRender:false,
  liveMutation:false
};
process.stdout.write(JSON.stringify(plan,null,2)+'\n');
