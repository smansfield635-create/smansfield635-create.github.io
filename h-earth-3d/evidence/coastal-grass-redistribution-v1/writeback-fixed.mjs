import fs from 'node:fs';
import assert from 'node:assert/strict';
import {execFileSync,spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const root=new URL('../../../',import.meta.url);
const expected={
  "showroom/globe/h-earth/render/assets/precomputed-grass.v1.bin.gz": "e52de7ab9268430f1e0a9c9d871e2e5a173b479618b2f92a11b9665254ec5fcd",
  "showroom/globe/h-earth/render/assets/precomputed-grass.v1.json": "a272fdd0813302e417817cc21104e3400badccaaffd3cc605098b38dd2dd8794",
  "showroom/globe/h-earth/render/precomputed-grass.v1.js": "78e847875ede6b97aeec5da894cffbf18c784e7c350623a33946f5906a37b7eb",
  "showroom/globe/h-earth/render/vegetation-visible-surface.v1.js": "f7191a217cd408db8b4bce9491b6613019939cdfc233e6d3f717964ca6bc687f",
  "h-earth-3d/evidence/coastal-grass-redistribution-v1/field.mjs": "3292d60396d88a1ea11a3b7130d0234c1b4c6909a0da20db4f43a92481de8b46",
  "h-earth-3d/evidence/coastal-grass-redistribution-v1/compile.mjs": "cecd55c337b3f9202e3c5655d47d9c46c5d204e0dcbf29e420e64ecac9703c70",
  "h-earth-3d/evidence/coastal-grass-redistribution-v1/changes.json.gz": "9d8ae3b674b745de418757c01f1ede30121b053870e0c9526445c320cbd44b95",
  "h-earth-3d/evidence/coastal-grass-redistribution-v1/receipt.json": "a0176b67019a49bd7ff157a7da40d68a574e7c896d0d56d577b4b1bb88413bd7"
};
const generated=new Set(['showroom/globe/h-earth/render/assets/precomputed-grass.v1.bin.gz','h-earth-3d/evidence/coastal-grass-redistribution-v1/changes.json.gz']);
const verify=p=>assert.equal(createHash('sha256').update(fs.readFileSync(new URL(p,root))).digest('hex'),expected[p],p);
for(const p of Object.keys(expected))if(!generated.has(p))verify(p);
if(spawnSync('git',['cat-file','-e','8a61c9ac11369ea67a551eb6d19cdd1f9c053046^{commit}'],{cwd:root}).status!==0)execFileSync('git',['fetch','--no-tags','--depth=1','--filter=blob:none','origin','8a61c9ac11369ea67a551eb6d19cdd1f9c053046'],{cwd:root,stdio:'inherit'});
await import('./compile.mjs');
for(const p of Object.keys(expected))verify(p);
console.log('EXACT_REDISTRIBUTED_CANDIDATE_VERIFIED');
