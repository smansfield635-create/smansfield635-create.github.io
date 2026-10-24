import fs from 'node:fs';
import assert from 'node:assert/strict';
import {execFileSync,spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const root=new URL('../../../',import.meta.url);
const expected={
  "showroom/globe/h-earth/render/assets/precomputed-grass.v1.bin.gz": "effa1a0ee03a692932f7f9c4575869e1ceadfa140e3378553b012b30a6eeacd0",
  "showroom/globe/h-earth/render/assets/precomputed-grass.v1.json": "2960a5a97674ae1219c819642c186f4a691976e377a35a8f8abf1a479d101c4e",
  "showroom/globe/h-earth/render/precomputed-grass.v1.js": "7f9283893b198de41b3561e52770e4bcd63f127b83469cde096a8548cbba1368",
  "showroom/globe/h-earth/render/vegetation-visible-surface.v1.js": "f7191a217cd408db8b4bce9491b6613019939cdfc233e6d3f717964ca6bc687f",
  "h-earth-3d/evidence/coastal-grass-redistribution-v1/field.mjs": "f0622ef2f6f3ecaea2edf9887391e0b79fb536f2f50b9f7ce7de0ac66b6825c7",
  "h-earth-3d/evidence/coastal-grass-redistribution-v1/compile.mjs": "670b625c407dd46ed6dbf2053ea97953d1aa1192f00936c4c6f94a74b6ef887c",
  "h-earth-3d/evidence/coastal-grass-redistribution-v1/changes.json.gz": "d660ab00239409fa4018343732d99a00548fe81863c9adfa6fa69cadb3372508",
  "h-earth-3d/evidence/coastal-grass-redistribution-v1/receipt.json": "5f2fd40fbd82b80980fca537d3c3da5e13f7b50230552ce0d958cc346c83556c"
};
const generated=new Set(['showroom/globe/h-earth/render/assets/precomputed-grass.v1.bin.gz','h-earth-3d/evidence/coastal-grass-redistribution-v1/changes.json.gz']);
const verify=p=>assert.equal(createHash('sha256').update(fs.readFileSync(new URL(p,root))).digest('hex'),expected[p],p);
for(const p of Object.keys(expected))if(!generated.has(p))verify(p);
if(spawnSync('git',['cat-file','-e','bce232104d36fc26d7fd3802b544e8910c89a5d6^{commit}'],{cwd:root}).status!==0)execFileSync('git',['fetch','--no-tags','--depth=1','--filter=blob:none','origin','bce232104d36fc26d7fd3802b544e8910c89a5d6'],{cwd:root,stdio:'inherit'});
await import('./compile.mjs');
for(const p of Object.keys(expected))verify(p);
console.log('EXACT_REDISTRIBUTED_CANDIDATE_VERIFIED');
