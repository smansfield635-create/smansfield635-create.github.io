#!/usr/bin/env node
import fs from 'node:fs';

const CONTRACT='COMPASS_CAPABILITY_CONTINUITY_v1';
const OBJECT_CONTRACT='COMPASS_OBJECT_RENDERER_CONTINUITY_v1';
const read=p=>fs.readFileSync(p,'utf8');
const files={
  index:read('index.html'),
  capabilityJs:read('assets/compass/compass.capability-carousel.js'),
  capabilityCss:read('assets/compass/compass.capability-carousel.css'),
  brainJs:read('assets/compass/compass.brain-scene.js'),
  brainCss:read('assets/compass/compass.brain.css'),
  houseJs:read('assets/compass/compass.house-scene.js'),
  trophyJs:read('assets/compass/compass.trophy-scene.js'),
  recoveryJs:read('assets/compass/compass.gen1537.recovery.js'),
  recoveryCss:read('assets/compass/compass.gen1537.recovery.css'),
  controller:read('assets/compass/compass.controller.js')
};
const failures=[];const checks={};
const check=(name,pass,evidence=null)=>{checks[name]={pass:Boolean(pass),evidence};if(!pass)failures.push(name)};

check('CAPABILITY_SINGLE_CONTRACT',files.capabilityJs.includes(CONTRACT)&&files.capabilityCss.includes(CONTRACT));
check('NO_RUNTIME_GEOMETRY_STYLE',!files.capabilityJs.includes("createElement('style')")&&!files.capabilityJs.includes('installGen1561Style')&&!files.capabilityJs.includes('data-gen1561-reconciliation-style'));
check('NO_LEGACY_STAGE_CONTRACT',!files.capabilityJs.includes("reconciliationStage='gen1561'")&&!files.capabilityCss.includes('data-reconciliation-stage="gen1561"'));
check('NO_LEGACY_HEIGHT_CAPS',!files.capabilityCss.includes('height:min(25rem')&&!files.capabilityCss.includes('max-height:min(25rem')&&!files.capabilityCss.includes('height:min(22rem'));
check('CAPTION_ACTION_CLEARANCE',files.capabilityCss.includes('min-height:34rem')&&files.capabilityCss.includes('.compass-object-caption')&&files.capabilityCss.includes('overflow:visible')&&files.capabilityCss.includes('.compass-action-dock'));
check('LOCAL_ACTIONS_BOUND',files.capabilityJs.includes('Enter Coheriscope')&&files.capabilityJs.includes('Enter Awards')&&files.capabilityJs.includes("['Jeeves','/showroom/globe/hearth/jeeves/']")&&files.capabilityJs.includes("['Elara','/elara/']")&&files.capabilityJs.includes("['Auren','/products/auren/']"));
check('NO_AXIS_RUNTIME',![files.capabilityJs,files.brainJs,files.brainCss].some(x=>/compass-brain-axis|brainAxes|brainAxisLabels|X · Y · Z/.test(x)));
check('BRAIN_SELF_CONTAINED',files.brainJs.includes(OBJECT_CONTRACT)&&files.brainJs.includes('anatomical-webgl-v6-continuity')&&files.brainJs.includes('canvas2d-anatomical-fallback-v1')&&!/compass-capability-orbit|compass-orbit-plaque|compass-object-caption/.test(files.brainJs));
check('HOUSE_SELF_CONTAINED',files.houseJs.includes(OBJECT_CONTRACT)&&files.houseJs.includes('projected-architectural-geometry-v5-continuity')&&!/compass-orbit-plaque|compass-object-caption|createElement\('style'\)/.test(files.houseJs));
check('TROPHY_RENDERER_BOUNDED',files.trophyJs.includes('procedural-webgl-trophy-v2')&&!/compass-capability-orbit|compass-orbit-plaque|compass-object-caption/.test(files.trophyJs));
check('BRAIN_CSS_RETIRED',files.brainCss.includes('RETIRED / NON-AUTHORITATIVE')&&!files.brainCss.includes('.compass-capability-orbit')&&!files.brainCss.includes('.compass-object-caption'));
check('RECOVERY_CSS_INERT',files.recoveryCss.includes('RETIRED / NON-AUTHORITATIVE')&&!files.recoveryCss.includes('{',files.recoveryCss));
check('RECOVERY_RUNTIME_INERT',files.recoveryJs.includes('authoritative:false')&&!/MutationObserver|setInterval|appendChild|style\.cssText/.test(files.recoveryJs));
check('LOWER_PROOF_PRESERVED',files.capabilityJs.includes("rail('proof',['TRL 7','Bounded','Checked'])")&&files.capabilityJs.includes('setTimeout(settle,320)')&&files.capabilityJs.includes('CompassOrbitInput?.claimSwipe')&&files.index.includes('data-proof-card="trl7"')&&files.index.includes('data-proof-card="bounded"')&&files.index.includes('data-proof-card="checked"'));
check('MIRRORLAND_CONTINUITY',files.index.includes('find the door to Mirrorland')&&files.capabilityJs.includes('protectMirrorland()')&&files.controller.includes('MIRRORLAND_FOCUSED'));
check('CONSTELLATION_TRAVERSAL_PRESERVED',files.controller.includes('ROOM_SELECTED')&&files.controller.includes('requestReturnToConstellation')&&files.controller.includes('requestReturnToOrbit'));

const receipt={schema:'COMPASS_CAPABILITY_CONTINUITY_RECEIPT_v1',contract:CONTRACT,objectContract:OBJECT_CONTRACT,checks,failures,result:failures.length?'FAIL_CLOSED':'PASS_CLOSED'};
const output=process.env.COMPASS_EXPERIENCE_OUTPUT||'/tmp/compass-capability-continuity-receipt.json';
fs.writeFileSync(output,JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify(receipt,null,2));
if(failures.length)process.exit(1);
