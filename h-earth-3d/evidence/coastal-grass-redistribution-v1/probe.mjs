import fs from 'node:fs';
import {visibleSurface,groundAdmission} from '../hillside-shoreline-continuity-v1/support-fixture.mjs';
const rows=[];
for(let z=-320;z<=0;z+=4)for(let x=-480;x<=480;x+=4){const s=visibleSurface.sample(x,z);if(!s)continue;const b=visibleSurface.beach.sample({x,z,support:s});rows.push({x,z,y:s.y,slope:s.slope,primitive:s.terrainPrimitiveId,sand:b.rawSandCoverage,contact:b.interpolatedExposedContactDistance,admit:!!groundAdmission(x,z,s)});}
fs.writeFileSync('/tmp/grass-support-probe.json',JSON.stringify(rows));
console.log('PROBE',rows.length,rows.filter(r=>r.admit).length);
