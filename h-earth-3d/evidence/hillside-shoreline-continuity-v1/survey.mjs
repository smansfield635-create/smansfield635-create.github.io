import fs from 'node:fs';
import {visibleSurface,groundAdmission,materials,cover,geology} from './support-fixture.mjs';
const rows=[];
for(let z=-260;z<=-90;z+=2)for(let x=-170;x<=260;x+=2){const s=visibleSurface.sample(x+.25,z+.25);if(!s)continue;const b=visibleSurface.beach.sample({x:x+.25,z:z+.25,support:s}),a=cover.inverseHEarthGroundCoverPoint(x+.25,s.y,z+.25),m=materials.sampleHEarthRun8CSuccessorSurfaceMaterial(a.x,a.z);rows.push({x:x+.25,z:z+.25,y:s.y,slope:s.slope,shaderSlope:b.shaderSlope,contact:b.interpolatedExposedContactDistance,coast:b.interpolatedCanonicalCoastDistance,sand:b.rawSandCoverage,admit:groundAdmission(x+.25,z+.25,s),material:m.surfaceClass,soil:m.soilDepth,water:visibleSurface.water.sample(x+.25,z+.25)?.y??null});}
fs.writeFileSync(new URL('./survey.json',import.meta.url),JSON.stringify(rows));
console.log('SURVEY',rows.length,groundAdmission.getReceipt());
