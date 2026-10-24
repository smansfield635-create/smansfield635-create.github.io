import fs from 'node:fs';
import assert from 'node:assert/strict';
import {execFileSync,spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const root=new URL('../../../',import.meta.url);
const expected={
  "showroom/globe/h-earth/render/assets/precomputed-grass.v1.bin.gz": "1cab1a9ea37aef844c8bfc28587a29b5716bf0b0443db0fda7a6a6ada3844a82",
  "showroom/globe/h-earth/render/assets/precomputed-grass.v1.json": "57e071833e8dd32d2f951cbe121506a4d7c73e46a8be499de43eb46dda4275b0",
  "showroom/globe/h-earth/render/precomputed-grass.v1.js": "a42b288febf35b7843bef4bb8179cee209aa45000e2a732073305b520fd7fa9e",
  "showroom/globe/h-earth/render/vegetation-visible-surface.v1.js": "f7191a217cd408db8b4bce9491b6613019939cdfc233e6d3f717964ca6bc687f",
  "h-earth-3d/evidence/coastal-grass-redistribution-v1/field.mjs": "f0622ef2f6f3ecaea2edf9887391e0b79fb536f2f50b9f7ce7de0ac66b6825c7",
  "h-earth-3d/evidence/coastal-grass-redistribution-v1/compile.mjs": "30f03542c9a3118fde9c6f55f114dd72eb22a8c3b475bc5e4973d5e737e8e577",
  "h-earth-3d/evidence/coastal-grass-redistribution-v1/changes.json.gz": "a089cf64ee947b92089cb5d09b022eaf3bd72378e0c2085cf6e1f97f2fd167c9",
  "h-earth-3d/evidence/coastal-grass-redistribution-v1/receipt.json": "ea9e305e5c0e59aa4d117731fa21350e141ce33cede98ceac587968ef0537acc",
  "showroom/globe/h-earth/render/landscape-planting-pilot.v1.js": "83d6c16608dbac9945791403414be7b427bdba9ac0b9d2004be6acf5696bde92",
  "h-earth-3d/evidence/coastal-grass-redistribution-v1/central-admission.mjs": "845c1df72f2f3863c2321700c4c3cdc5e3e44a7053cab1ea85c4652bd8fa0c70",
  "h-earth-3d/evidence/coastal-grass-redistribution-v1/central-admission.test.mjs": "81539ef7a2ea9dad8f06a7d5b8e0853c6bc9eaea91030c0a6ac7824e4bd85959"
};
const generated=new Set(['showroom/globe/h-earth/render/assets/precomputed-grass.v1.bin.gz','h-earth-3d/evidence/coastal-grass-redistribution-v1/changes.json.gz']);
const verify=p=>assert.equal(createHash('sha256').update(fs.readFileSync(new URL(p,root))).digest('hex'),expected[p],p);
for(const p of Object.keys(expected))if(!generated.has(p))verify(p);
if(spawnSync('git',['cat-file','-e','e7d8317b167c5f206cd5ba747d394236da61a2b2^{commit}'],{cwd:root}).status!==0)execFileSync('git',['fetch','--no-tags','--depth=1','--filter=blob:none','origin','e7d8317b167c5f206cd5ba747d394236da61a2b2'],{cwd:root,stdio:'inherit'});
await import('./compile.mjs');
for(const p of Object.keys(expected))verify(p);
console.log('EXACT_REDISTRIBUTED_CANDIDATE_VERIFIED');
