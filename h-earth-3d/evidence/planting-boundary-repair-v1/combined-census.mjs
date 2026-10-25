import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {gunzipSync,gzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {visibleSurface,groundAdmission,geology,cover,materials} from '../hillside-shoreline-continuity-v1/support-fixture.mjs';
import {runtimePlantingBaselineTiles} from '../../../showroom/globe/h-earth/render/vegetation-single-owner.prototype.v1.js';
import {oasisBankTiles} from '../../../showroom/globe/h-earth/render/oasis-bank-field.v1.js';
import {buildCavernEntranceGrass} from '../../../showroom/globe/h-earth/render/cavern-entrance-grass.v1.js';
import {buildCavernPalmPlacement} from '../../../showroom/globe/h-earth/render/cavern-palm-placement.v1.js';
import {centralGroundAdmission as coastalAdmit} from '../coastal-grass-redistribution-v1/central-admission.mjs';
import {contourWeight} from '../coastal-grass-redistribution-v1/field.mjs';
import {centralRetention} from '../coastal-grass-redistribution-v1/central-contour.mjs';
import {hillsideDensity} from '../../../showroom/globe/h-earth/render/hillside-shoreline-field.v1.js';
const sha=x=>createHash('sha256').update(x).digest('hex');
const input=process.env.GRASS_BASE_ASSET_DIR;assert(input);const m=JSON.parse(fs.readFileSync(path.join(input,'precomputed-grass.v1.json'))),raw=gunzipSync(fs.readFileSync(path.join(input,'precomputed-grass.v1.bin.gz')));assert.equal(sha(raw),m.rawSha256);
let offset=0;const counts=new Map(),tiles=[];const key=(x,z)=>Math.floor(x/4)*4+':'+Math.floor(z/4)*4;
const add=(x,z,kind)=>{const k=key(x,z);if(!counts.has(k))counts.set(k,{saved:0,oasis:0,runtime:0});counts.get(k)[kind]++;};
for(const t of m.tiles){const packed=new Float32Array(t.count*4);for(let j=0;j<t.count;j++){for(let k=0;k<4;k++)packed[j*4+k]=raw.readDoubleLE(offset+k*8);add(packed[j*4],packed[j*4+2],'saved');offset+=52;}tiles.push({...t,packed});}
const banks=oasisBankTiles(m.rootCount);for(const t of banks)for(let i=0;i<t.count;i++)add(t.packed[i*4],t.packed[i*4+2],'oasis');
const addition=await buildCavernEntranceGrass({existingTiles:runtimePlantingBaselineTiles([...tiles,...banks]),visibleSurface:{...visibleSurface,admitGround:groundAdmission},geology,palms:buildCavernPalmPlacement(geology).receipt.placements});
for(const t of addition.tiles)for(const r of t.roots)add(r.x,r.z,'runtime');
const total=c=>c?c.saved+c.oasis+c.runtime:0,edges=[];
for(const [k,c]of counts){const [x,z]=k.split(':').map(Number),n=total(c);for(const [dx,dz]of [[4,0],[-4,0],[0,4],[0,-4]]){const other=counts.get((x+dx)+':'+(z+dz));if(n>=160&&total(other)<=n*.25)edges.push({x,z,direction:[dx,dz],roots:n,neighborRoots:total(other),components:c,neighborComponents:other??{saved:0,oasis:0,runtime:0}});}}
edges.sort((a,b)=>b.roots-a.roots||a.x-b.x||a.z-b.z);
const cellWitness=new Map();
function witnessCell(x,z){const k=x+':'+z;if(cellWitness.has(k))return cellWitness.get(k);let eligible=0,density=0,minimumContour=1;const reasons={};for(let i=0;i<4;i++)for(let j=0;j<4;j++){const a=x+i+.5,b=z+j+.5,s=visibleSurface.sample(a,b);minimumContour=Math.min(minimumContour,contourWeight(a,b));let reason='NO_SUPPORT';if(s){reason=!coastalAdmit(a,b,s)?'EXCLUSION':s.slope>1.6?'STEEP':null;if(!reason){const local=cover.inverseHEarthGroundCoverPoint(a,s.y,b),m=materials.sampleHEarthRun8CSuccessorSurfaceMaterial(local.x,local.z);if(centralRetention(local.x,s.y,local.z)<.999)reason='APPROVED_CONTOUR';else if(!(m?.valid===true&&(m.surfaceClass==='STONE_AND_SPARSE_SOIL'?m.soilDepth>=.035:['LOWLAND_SOIL','COASTAL_SOIL','DRY_SAND'].includes(m.surfaceClass)&&m.soilDepth>=.20)))reason='MATERIAL';else{const shore=visibleSurface.beach.sample({x:a,z:b,support:s});eligible++;density+=hillsideDensity({x:a,y:s.y,z:b,shaderSlope:shore.shaderSlope,contactDistance:shore.interpolatedExposedContactDistance,sandCoverage:shore.rawSandCoverage});}}}reasons[reason||'ELIGIBLE']=(reasons[reason||'ELIGIBLE']||0)+1;}const value={eligible,minimumContour,expectedDensity:density/16,reasons};cellWitness.set(k,value);return value;}
for(const e of edges){e.first=witnessCell(e.x,e.z);e.second=witnessCell(e.x+e.direction[0],e.z+e.direction[1]);}
const domainCenters=[[388,-200],[-392,-200],[-392,-192],[388,-196],[-392,-196],[404,-232],[388,-192],[388,-188]];
const domainWitnesses=m.tiles.filter(t=>domainCenters.some(([x,z])=>Math.max(Math.abs(t.minX-x),Math.abs(t.minZ-z))<=16)).map(t=>({x:t.minX,z:t.minZ,...witnessCell(t.minX,t.minZ)}));
const rejectedTrial=[];for(let x=52;x<76;x+=4)rejectedTrial.push({x,z:-272,...counts.get(x+':-272')});
const snapshot=JSON.stringify(addition,(k,v)=>/Ms$|Milliseconds$/.test(k)?undefined:v);
fs.writeFileSync(new URL('./runtime-current.json.gz',import.meta.url),gzipSync(snapshot));
const report={schema:'H_EARTH_COMBINED_PLANTING_CENSUS_v1',inputRawSha256:m.rawSha256,savedRoots:m.rootCount,oasisRoots:banks.reduce((n,t)=>n+t.count,0),runtimeRoots:addition.receipt.contactCount,combinedRoots:[...counts.values()].reduce((n,c)=>n+total(c),0),runtimeSha256:sha(snapshot),candidateEdges:edges.length,edges,domainWitnesses,rejectedTrial,trialDisposition:'REJECTED: saved-only gaps contain runtime grass; no trial asset installed',scope:'Directional 4m population census. Counts do not establish visible defects or habitat permission.'};
fs.writeFileSync(new URL('./combined-census.json',import.meta.url),JSON.stringify(report,null,2));console.log('COMBINED_CENSUS',JSON.stringify({...report,edges:undefined}));
