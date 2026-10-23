import fs from 'node:fs';
import assert from 'node:assert/strict';
import {execFileSync,spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {gunzipSync} from 'node:zlib';
const root=new URL('../../../',import.meta.url);
const baseline='db743204f1fcc0b6d8fd1dae5bf3b590be5f6d9d';
const expected={
  "h-earth-3d/evidence/terrain-grass-continuity-v2/added.bin.gz": "5384a9eef0b127c097daf8f97152db24500a11eb",
  "h-earth-3d/evidence/terrain-grass-continuity-v2/census-rows.json": "51f2c598cb52782a484466e1c6a6e2e7ee99e85c",
  "h-earth-3d/evidence/terrain-grass-continuity-v2/census-summary.json": "ff372494f06cfd8704a7e8c28d328408af757719",
  "h-earth-3d/evidence/terrain-grass-continuity-v2/census.mjs": "f1e90a7121933bf59f9fc5e042da67728b4a1ec1",
  "h-earth-3d/evidence/terrain-grass-continuity-v2/checkpoint.json": "1f95e663cf6650e15ed6b2e4e897eba9d0ce551e",
  "h-earth-3d/evidence/terrain-grass-continuity-v2/compile.mjs": "69719f5e0ff31d73c782cbd7d12cd50ea0cf4d69",
  "h-earth-3d/evidence/terrain-grass-continuity-v2/coverage.json.gz": "eff380563642ea11bcb12bf261a11f0bb79ba0e4",
  "h-earth-3d/evidence/terrain-grass-continuity-v2/qualification-boundary.json": "61c6ebc22d903b516e38931851c20d445f15aaa1",
  "h-earth-3d/evidence/terrain-grass-continuity-v2/recovery-review.json": "4e31483485a428b16f36e29af75bb51b7ebf6238",
  "h-earth-3d/evidence/terrain-grass-continuity-v2/removed.bin.gz": "d4b9926df0b7defceb6caf0b474c4a190c5ca8f0",
  "h-earth-3d/evidence/terrain-grass-continuity-v2/runtime-baseline.json.gz": "280bf3ce2e360a8e0b8e4223fc171f6acb54265f",
  "h-earth-3d/evidence/terrain-grass-continuity-v2/runtime.mjs": "25aee88091a89433df85f66b249f73fc519e76f0",
  "h-earth-3d/evidence/terrain-grass-continuity-v2/shader-parity.mjs": "3cea043cb8ddfb064c79c9f05800c7c412d3f1dd",
  "h-earth-3d/validation/h-earth.grass-coastal.v1.test.mjs": "c76c9286aea0b275108c0048f58c1b4dccc574f2",
  "h-earth-3d/validation/h-earth.grass-visibility.v2.test.mjs": "c8232e64e5dd991abea2b65851f6935990189618",
  "h-earth-3d/validation/h-earth.hillside-shoreline-continuity.v1.test.mjs": "d6790aa0edb44332954edf833bcf99947f874ec0",
  "h-earth-3d/validation/h-earth.precomputed-grass.v1.test.mjs": "3ec4cd670bf60559994c0808f582db44a12e3dd1",
  "h-earth-3d/validation/h-earth.terrain-grass-continuity.v2.test.mjs": "12b823080c40e031bf8bd81d85c8cd27c7440321",
  "showroom/globe/h-earth/render/assets/precomputed-grass.v1.bin.gz": "245834aab16c1c3ec6d8189f6ea8e243fd29eea4",
  "showroom/globe/h-earth/render/assets/precomputed-grass.v1.json": "559a6773ad24c2afd992c5cdd81fd05385cfbbb1",
  "showroom/globe/h-earth/render/grass-continuity-supplement.v1.js": "686d8e9a9778509b082ad67fe8f3e043ca15acfa",
  "showroom/globe/h-earth/render/grass-visibility.v2.js": "5908e0b6186c0be8157868ac2fcdb3cc20682e06",
  "showroom/globe/h-earth/render/hillside-shoreline-field.v1.js": "d564eabcb55425c5b6a0a34192aa1a9982da54ce",
  "showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js": "7fda59dc9da9124a317073b76818b245dae23b20",
  "showroom/globe/h-earth/render/precomputed-grass.v1.js": "4bcacb4b6affed6cda41b018b7b82a86f389a550",
  "showroom/globe/h-earth/render/vegetation-single-owner.prototype.v1.js": "0d393cc5cdee2737dc8bfd1c1ef1332b5415620f"
};
function verify(paths){for(const p of paths){const bytes=fs.readFileSync(new URL(p,root));const hash=createHash('sha1').update('blob '+bytes.length+'\0').update(bytes).digest('hex');assert.equal(hash,expected[p],'CANDIDATE_BYTES_CHANGED: '+p);}}
const binary='showroom/globe/h-earth/render/assets/precomputed-grass.v1.bin.gz';
verify(Object.keys(expected).filter(p=>p!==binary));
if(spawnSync('git',['cat-file','-e',baseline+'^{commit}'],{cwd:root}).status!==0)execFileSync('git',['fetch','--no-tags','--depth=1','--filter=blob:none','origin',baseline],{cwd:root,stdio:'inherit'});
// Preserve the recovered evidence archive only after proving exact expanded bytes.
// Python and Node gzip level 9 encode this JSON differently.
const coveragePath=new URL('./coverage.json.gz',import.meta.url);
const recoveredCoverage=fs.readFileSync(coveragePath);
await import('./compile.mjs');
assert(gunzipSync(fs.readFileSync(coveragePath)).equals(gunzipSync(recoveredCoverage)),'COVERAGE_EXPANDED_BYTES_CHANGED');
fs.writeFileSync(coveragePath,recoveredCoverage);
verify(Object.keys(expected));
console.log('EXACT_RECOVERED_GRASS_CANDIDATE_26_FILES_VERIFIED');
