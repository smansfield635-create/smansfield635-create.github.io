#!/usr/bin/env node
import fs from 'node:fs';
const house=fs.readFileSync('assets/compass/compass.house-scene.js','utf8');
const core=fs.readFileSync('assets/compass/compass.capability-carousel.core.js','utf8');
const loader=fs.readFileSync('assets/compass/compass.capability-carousel.js','utf8');
const composite=fs.readFileSync('compass-composite/composite.css','utf8');
const checks={
  principalEstateOnly: house.includes("carousel-gatehouse-omitted")&&house.includes("carousel-formal-garden-plinth-omitted")&&house.includes("principal-estate-only-close-framing"),
  closeFraming: house.includes('const CAROUSEL_DISTANCE=56;'),
  brighterPresentation: house.includes("brightness(1.18)")&&house.includes('vLight=.42+.58*'),
  freshHouseIdentity: core.includes('mirror-manor-gothic-phase3-carousel-v4-principal-estate-close')&&core.includes('cb=936f01ab8b289796'),
  loaderReleaseAligned: loader.includes("MIRROR_MANOR_CAROUSEL_RELEASE='mirror-manor-gothic-phase3-carousel-v4-principal-estate-close'"),
  firstPaintSingleOwner: composite.includes('FIRST_PAINT_MOTIVATION_SINGLE_OWNER_v1')&&composite.includes('.compass-motivation:not([data-motivation-ready="true"]) .compass-motivation__statement:nth-of-type(n+2){display:none!important}')
};
const failures=Object.entries(checks).filter(([,ok])=>!ok).map(([id])=>id);
console.log(JSON.stringify({receipt:'COMPASS_MANOR_SCALE_FIRST_PAINT_20260902',checks,failures,result:failures.length?'FAIL':'PASS_CLOSED'},null,2));
if(failures.length)process.exit(1);
