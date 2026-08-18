#!/usr/bin/env node
import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
const OP='COMPASS_GEN1538_REFERENCE_ARCHITECTURE_RECOVERY_AND_CAROUSEL_CONTINUITY_20260818_005';
const LOCK=1537;
const OUT=process.env.COMPASS_PERFORMANCE_OUTPUT||'/tmp/compass-gen1538-performance.json';
const head=spawnSync('git',['rev-parse','HEAD^{commit}'],{encoding:'utf8'}).stdout.trim();
const size=p=>fs.statSync(p).size;
const cap=fs.readFileSync('assets/compass/compass.capability-carousel.js','utf8');
const house=fs.readFileSync('assets/compass/compass.house-scene.js','utf8');
const checks=[];const check=(id,pass,evidence)=>checks.push({id,pass:Boolean(pass),evidence});
check('CAPABILITY_RUNTIME_BOUNDED',size('assets/compass/compass.capability-carousel.js')<=22000,size('assets/compass/compass.capability-carousel.js'));
check('HOUSE_RUNTIME_BOUNDED',size('assets/compass/compass.house-scene.js')<=12000,size('assets/compass/compass.house-scene.js'));
check('HOUSE_VISIBILITY_SUSPENSION',house.includes('IntersectionObserver')&&house.includes('cancelAnimationFrame'),true);
check('HOUSE_FOREGROUND_SUSPENSION',house.includes('foreground()')&&house.includes('setForeground'),true);
check('REDUCED_MOTION_BOUND',house.includes("prefers-reduced-motion: reduce")&&cap.includes("prefers-reduced-motion: reduce"),true);
check('LOWER_CAROUSEL_SETTLE_PRESERVED',cap.includes('setTimeout(settle,320)'),true);
const failures=checks.filter(x=>!x.pass);const receipt={schema:'COMPASS_GEN1538_PERFORMANCE_VERIFICATION_RECEIPT_v1',operation:OP,lockGeneration:LOCK,candidate:head,result:failures.length?'FAIL_CLOSED':'PASS_CLOSED',checks,failures:failures.map(x=>x.id)};fs.writeFileSync(OUT,JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify(receipt,null,2));if(failures.length)process.exit(1);
