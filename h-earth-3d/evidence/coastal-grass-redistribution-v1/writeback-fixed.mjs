import fs from 'node:fs';
import assert from 'node:assert/strict';
import {execFileSync,spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const root=new URL('../../../',import.meta.url);
const expected={
  "showroom/globe/h-earth/render/assets/precomputed-grass.v1.bin.gz": "d0dc36315fa4d9fe2d094c7945c7162ef446b5107591ae7caf3827f4d268f4df",
  "showroom/globe/h-earth/render/assets/precomputed-grass.v1.json": "e186d57007b252015cdad1d720c300637f3c8ace75a469db2970d335c7ea153a",
  "showroom/globe/h-earth/render/precomputed-grass.v1.js": "374afaab263d3d4ee4618e2488692afc54b9121742674caa94f5b3622c5570af",
  "showroom/globe/h-earth/render/vegetation-visible-surface.v1.js": "f7191a217cd408db8b4bce9491b6613019939cdfc233e6d3f717964ca6bc687f",
  "h-earth-3d/evidence/coastal-grass-redistribution-v1/field.mjs": "f0622ef2f6f3ecaea2edf9887391e0b79fb536f2f50b9f7ce7de0ac66b6825c7",
  "h-earth-3d/evidence/coastal-grass-redistribution-v1/compile.mjs": "f071e898c7ffcbe4b6e6c891023819730443465f679e93936ea4fc30d45b406d",
  "h-earth-3d/evidence/coastal-grass-redistribution-v1/changes.json.gz": "fd734336e84564af06889c6bd4820ce3c1193becaadf32105007b5c1d7f813bd",
  "h-earth-3d/evidence/coastal-grass-redistribution-v1/receipt.json": "299435d849630bd048ae6c772a987a876fdc2fc257ab77140db01f001f42f3cf",
  "showroom/globe/h-earth/render/landscape-planting-pilot.v1.js": "83d6c16608dbac9945791403414be7b427bdba9ac0b9d2004be6acf5696bde92",
  "h-earth-3d/evidence/coastal-grass-redistribution-v1/central-admission.mjs": "845c1df72f2f3863c2321700c4c3cdc5e3e44a7053cab1ea85c4652bd8fa0c70",
  "h-earth-3d/evidence/coastal-grass-redistribution-v1/central-admission.test.mjs": "81539ef7a2ea9dad8f06a7d5b8e0853c6bc9eaea91030c0a6ac7824e4bd85959",
  "h-earth-3d/evidence/coastal-grass-redistribution-v1/central-contour.mjs": "6db2046736131a3adfcc48e3dd2f83bc109a294d485deb1c0aab2e9c912395ea",
  "h-earth-3d/evidence/coastal-grass-redistribution-v1/central-contour.test.mjs": "e0213300f2d93e5041be8d1cdb834ea06b42ee245370f2ca4ee5cbeef37de9ae",
  "h-earth-3d/evidence/coastal-grass-redistribution-v1/redistribution.test.mjs": "250bbf1ad52fa2a562f4232e6451d5e57e0f89074400aee260cfb8e255818e12"
};
const generated=new Set(['showroom/globe/h-earth/render/assets/precomputed-grass.v1.bin.gz','h-earth-3d/evidence/coastal-grass-redistribution-v1/changes.json.gz']);
const verify=p=>assert.equal(createHash('sha256').update(fs.readFileSync(new URL(p,root))).digest('hex'),expected[p],p);
for(const p of Object.keys(expected))if(!generated.has(p))verify(p);
if(spawnSync('git',['cat-file','-e','0a1124d4337fdabed155273dbf80b4750188141b^{commit}'],{cwd:root}).status!==0)execFileSync('git',['fetch','--no-tags','--depth=1','--filter=blob:none','origin','0a1124d4337fdabed155273dbf80b4750188141b'],{cwd:root,stdio:'inherit'});
await import('./compile.mjs');
for(const p of Object.keys(expected))verify(p);
console.log('EXACT_REDISTRIBUTED_CANDIDATE_VERIFIED');
