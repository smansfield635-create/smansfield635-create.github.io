#!/usr/bin/env node
import fs from 'node:fs';
const house=fs.readFileSync('assets/compass/compass.house-scene.js','utf8');
const failures=[];const check=(id,pass)=>{if(!pass)failures.push(id)};
check('CANONICAL_PHASE3_CONSUMER',house.includes("MIRROR_MANOR_GOTHIC_ARCHITECTURAL_DETAIL_PHASE3_v1")&&house.includes("import('/assets/manor-blueprint/manor.estate.gothic-detail-phase3.mjs')"));
check('CAROUSEL_DISTANCE_94',house.includes("houseCarouselDistance:'94'")&&house.includes('carouselDistance:94'));
check('PRINCIPAL_SPAN_27',house.includes("housePrincipalSpan:'27'")&&house.includes('principalSpan:27'));
check('DEPTH_TEST_RETAINED',house.includes('gl.enable(gl.DEPTH_TEST)'));
check('BACKFACE_CULLING_DISABLED',house.includes('gl.disable(gl.CULL_FACE)')&&!house.includes('gl.enable(gl.CULL_FACE)'));
check('TWO_SIDED_POLICY_DECLARED',house.includes("houseCullPolicy:'two-sided-mixed-winding'"));
const receipt={schema:'MIRROR_MANOR_CAROUSEL_CULLING_FIX_RECEIPT_v1',failures,result:failures.length?'FAIL_CLOSED':'PASS_CLOSED'};
console.log(JSON.stringify(receipt,null,2));if(failures.length)process.exit(1);
