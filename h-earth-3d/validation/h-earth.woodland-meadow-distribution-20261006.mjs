#!/usr/bin/env node
import fs from 'node:fs';
const source=fs.readFileSync(new URL('../../showroom/globe/h-earth/render/geometry-landscape-sector.p2.js',import.meta.url),'utf8');
const checks=[
 ['angle-channel',source.includes("trialHash(id,'center-jitter-angle')*Math.PI*2")],
 ['radius-channel',source.includes("Math.sqrt(trialHash(id,'center-jitter-radius'))*.90")],
 ['legacy-quarter-meter-removed',!source.includes("trialHash(id,'jitter-radius'))*.25")],
 ['density-field-preserved',source.includes("const densityField=(x,z)=>")],
 ['fan-four-leaf-preserved',source.includes("const bladeCount=4")],
 ['no-trimming-preserved',source.includes("ECOTONE_TRIAL_TUFT_BUDGET_EXCEEDED")],
 ['distribution-baseline-recorded',source.includes("distributionBaseline:'7804b359aa032caa00f8dd526f8e4186df97fac9'")]
];
const failed=checks.filter(x=>!x[1]);
const out={schema:'H_EARTH_WOODLAND_MEADOW_DISTRIBUTION_STATIC_VALIDATION_v1',result:failed.length?'FAIL_CLOSED':'PASS',checks:checks.map(([name,pass])=>({name,pass})),note:'Static delta validator only; anti-lattice, geometry, fixed-camera and physical-device gates remain separately required.'};
process.stdout.write(JSON.stringify(out,null,2)+'\n'); if(failed.length)process.exitCode=1;
