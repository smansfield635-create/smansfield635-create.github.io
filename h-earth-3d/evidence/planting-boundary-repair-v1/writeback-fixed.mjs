import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import {execFileSync,spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const root=new URL('../../../',import.meta.url);
const expected={
  "h-earth-3d/evidence/landscape-coherence-v1/README.md": "c4d36a338be66fbf8cf7c0a572616f095679f300efb944dacd3f42feaa90e3f6",
  "h-earth-3d/evidence/landscape-coherence-v1/baseline-bare-mountain.png": "f84f85d6660cf5183b8398c747bdfe819fd8f18e9dc8343bf029ca7bb522014f",
  "h-earth-3d/evidence/landscape-coherence-v1/baseline-cavern-upper.png": "1552cde3b913e546a1dc134a84e78934c82877b5598f47a16d11df076cff932b",
  "h-earth-3d/evidence/landscape-coherence-v1/baseline-coast-oblique.png": "14a2325d54212483e8b397383c684f77f98f0ce97b43c355493872514dcfc075",
  "h-earth-3d/evidence/landscape-coherence-v1/baseline-foothill-west.png": "f7f615d98aa1f6ec5bb0a4ff702ed2cb8ceac0942b3380a667b6d4a048ac1e80",
  "h-earth-3d/evidence/landscape-coherence-v1/baseline-foothill.mjs": "2ac39e65c156f918ad464761d3fcacda9ce72d2d9dba912b0044d5a374da3e48",
  "h-earth-3d/evidence/landscape-coherence-v1/baseline-hill-river.png": "a6dfe6f61a00a5224cb216a50cb8d843f874ce58a2bdfe71c74ea46bf64e64c8",
  "h-earth-3d/evidence/landscape-coherence-v1/baseline-resource-identities.json": "2ed3a74e207fcbaf277707c27fa91e9147f135f023738f08c7ba202549e4eb01",
  "h-earth-3d/evidence/landscape-coherence-v1/baseline-woodland-edge.png": "a077bea25570bde83e79f916a7dc366e0e771021b428117022f06c673ec4ff2d",
  "h-earth-3d/evidence/landscape-coherence-v1/candidate-bare-mountain.png": "dbb91a99ca805ee66c9e4bec531b055db3b1757c8286ef712fb3e0872ee7479b",
  "h-earth-3d/evidence/landscape-coherence-v1/candidate-cavern-upper.png": "37346aeb34ea22cd9f8921a82c0bfc48e6e4ccee5aff32dc8d808d3ec39261bb",
  "h-earth-3d/evidence/landscape-coherence-v1/candidate-coast-oblique.png": "34769f8763aa1bfbc72aeffa0fdff358ab913a0b65ca3b0dad2404fad2bec87f",
  "h-earth-3d/evidence/landscape-coherence-v1/candidate-foothill-west.png": "a5f0d25ec2920051e3dc2f0f31b06e2c57e00e308ad22b68a58df87d834c24d1",
  "h-earth-3d/evidence/landscape-coherence-v1/candidate-hill-river.png": "8df1bdec31713eaead99f4a6df2e4ef85caf375c570424570caf58204ba03e02",
  "h-earth-3d/evidence/landscape-coherence-v1/candidate-woodland-edge.png": "c0cbaf59325b2a12f0ce2898fdb1d211a876e600f407903ffd5720d88ebc59b0",
  "h-earth-3d/evidence/landscape-coherence-v1/design.json": "6db98b664d23145741cddff9ee1477e879c6c1157e274daadc9c3f7ff771f4c4",
  "h-earth-3d/evidence/landscape-coherence-v1/material-invariance.json": "5c219b61e7c3d2ad45c4898a4542f9e2d7df5142efd049ea9f86bbd30c5d104a",
  "h-earth-3d/evidence/landscape-coherence-v1/material-invariance.mjs": "670864b1ac2f88f33a7809e93f9e2ec43f8ac0a9f59f90d1de78affaca1b8503",
  "h-earth-3d/evidence/landscape-coherence-v1/material-repair-review.json": "9005264236a5800aaf26256fd042c7c89f6e1f764349e2a72b6be446c0b8cb2a",
  "h-earth-3d/evidence/landscape-coherence-v1/qualification.json": "d98740399431c6787ae337801f51a409fb7b62d80e6ed357127dbb2143d9411f",
  "h-earth-3d/evidence/landscape-coherence-v1/rejected-candidate-source-manifest.json": "463ae85fc0cc51655ba94d8b6a60220e2b409374f42ab4d56c153005319a4aa6",
  "h-earth-3d/evidence/landscape-coherence-v1/replay.mjs": "546bff7a964938dd87bf2d09440b07e5d1c8ffe86777caa4ea1b78604631cf7f",
  "h-earth-3d/evidence/landscape-coherence-v1/scene.test.mjs": "60b165c4e4c8cff926a60eb180e7c6d7bc5139bd31b9bafc57084518ce25a51d",
  "h-earth-3d/evidence/landscape-coherence-v1/serve.py": "87ccdddb8da591d4b69ece06002d0aeb01fc0750c72598645ed6ad38aafc22bd",
  "h-earth-3d/evidence/landscape-coherence-v1/source-manifest.json": "8fb90bde75b36171388e4e31af28250ad93d66d39c8ff02d0c158ab62e12c4d0",
  "h-earth-3d/evidence/landscape-coherence-v1/source.test.mjs": "98d35964b9767a194da20d5f873b24b44b91440101b23b6a3e644b0d0889c7ed",
  "h-earth-3d/evidence/landscape-coherence-v1/west-review.json": "4603bcb1f4e5b3e4a209559a924c7b96f3f189dff9691d3633207c7a91c9e5b7",
  "h-earth-3d/evidence/planting-boundary-repair-v1/asset.test.mjs": "bf556bd987a9d38eb33232bdb72b6e7afca5da4d14671ca20963fd6aac36ec57",
  "h-earth-3d/evidence/planting-boundary-repair-v1/attribution.json": "770053cf14b7e1a8a3736a60ea38e5a2c8d7f2b46f0b4fe35ba7b8c75fca0ece",
  "h-earth-3d/evidence/planting-boundary-repair-v1/combined-census.json": "362ced0478fe780225da1598b4aa0487b1438a8964e2d30aa49d048b64edca9b",
  "h-earth-3d/evidence/planting-boundary-repair-v1/combined-census.mjs": "728be231137a75c361571e7c9907f24011d35b9a3bbb67a1ffbad14553833f79",
  "h-earth-3d/evidence/planting-boundary-repair-v1/compile.mjs": "ebb547a1bdc752cb34b0ea229e288a7df9e20fa318b7c58d87df21e5736b5c7a",
  "h-earth-3d/evidence/planting-boundary-repair-v1/compiler-report.json": "eb6cfe98db6f7e1bd13431f352c9d7930b9777c29dc2459b0f52282edf34f28c",
  "h-earth-3d/evidence/planting-boundary-repair-v1/density-plan.json": "0cdc3b4e607b4424c347b2c946352906b591d203a6b290937b0b98b4df934948",
  "h-earth-3d/evidence/planting-boundary-repair-v1/independent-verification.json": "626b098977bbbdb7816a33c47cf39f4cc2fd31c3f511f7b4399f943ea0681913",
  "h-earth-3d/evidence/planting-boundary-repair-v1/plan-redistribution.py": "4509e52b238480a10107b4c3b300f69258e52e638461df59074d8b8bf8f95ca7",
  "h-earth-3d/evidence/planting-boundary-repair-v1/plan.test.mjs": "7471214383422e33ab171fba7a9ac62fc1eadf396fc4eaa18089da0ff1c85316",
  "h-earth-3d/evidence/planting-boundary-repair-v1/release-review.json": "4d9b34c317ed9b4b01493a3c7c1f6baa236dd3dc98d3c362df648ad28a67ac49",
  "h-earth-3d/evidence/planting-boundary-repair-v1/runtime-current.json.gz": "f4f2f9e40908b4733dc131e1cbfa8775ec575cd7c16bd64c9aed40b3b79f8bd9",
  "h-earth-3d/evidence/planting-boundary-repair-v1/verify.py": "bbd2e673d623422a92a36e3a5eb1f4db9034833736563b6440cf25c2bc612fea",
  "h-earth-3d/experience-anchor/receipts/landscape-coherence-v1.json": "0f677ee18b4bf1f46ba232c6546b0f85b916bf8d1647fe02161e175cfdcaa7df",
  "h-earth-3d/experience-anchor/receipts/planting-boundary-repair-v1.json": "f09afb3c873ef6ac9c7574fdf1531a12649225213646230e011af6df22b7b37e",
  "showroom/globe/h-earth/index.html": "70403efc00e1154415e1c0e7a89bd7f2af4ccf1a9309839e17f791ba5289e334",
  "showroom/globe/h-earth/render/assets/precomputed-grass.v1.bin.gz": "4a2ff2a135984d67d68d3df7c3212236894c75b66826f256a60130c87b73e800",
  "showroom/globe/h-earth/render/assets/precomputed-grass.v1.json": "9d452a0906094e6e5ed828753e547ef24269afa173896453637b77832c6c3edf",
  "showroom/globe/h-earth/render/foothill-meadow-field.v1.js": "a2961c0507d679ea998a78708127a84d41d8b3a3387831c9fb13cf0dcaa115fb",
  "showroom/globe/h-earth/render/landscape-coherence-field.v1.js": "54aa2bf97e19fc63631cd3f7ece0a6d4c3a8d13222afa9a66fef2666d3e1a7b1",
  "showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js": "4450c9e9f66f3dfd8f3094e897311e09550269c2c0f7510a4ce2a4982387d2c1",
  "showroom/globe/h-earth/render/precomputed-grass.v1.js": "d3de07b531e9dcf6d5a3ed18976f97e5eb2e7288a312f35c9e66977da04392cb",
  "showroom/globe/h-earth/render/vegetation-single-owner.prototype.v1.js": "addf466b14cf21b5f901a62884083ed09ab39aa199a6fac3ada9a740cfce1b0a"
};
const asset="showroom/globe/h-earth/render/assets/precomputed-grass.v1.bin.gz";
const digest=p=>createHash('sha256').update(fs.readFileSync(new URL(p,root))).digest('hex');
for(const p of Object.keys(expected))if(p!==asset)assert.equal(digest(p),expected[p],p);
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'h-earth-gen2894-'));
try {
 const input=path.join(temp,'input'),output=path.join(temp,'output');fs.mkdirSync(input);
 // Staging retains the published binary until the exact replacement is verified.
 if(spawnSync('git',['cat-file','-e','cd130122220cfa987f04a698900c6e2be08f2bc2^{commit}'],{cwd:root}).status!==0)execFileSync('git',['fetch','--no-tags','--depth=1','--filter=blob:none','origin','cd130122220cfa987f04a698900c6e2be08f2bc2'],{cwd:root,stdio:'inherit'});
 // Manifest is the immutable published precursor; no geometry or optimizer is rerun.
 fs.writeFileSync(path.join(input,'precomputed-grass.v1.json'),execFileSync('git',['show','cd130122220cfa987f04a698900c6e2be08f2bc2:showroom/globe/h-earth/render/assets/precomputed-grass.v1.json'],{cwd:root,maxBuffer:8*1024*1024}));
 fs.copyFileSync(new URL(asset,root),path.join(input,'precomputed-grass.v1.bin.gz'));
 process.env.GRASS_BASE_ASSET_DIR=input;process.env.GRASS_REPAIR_OUTPUT_DIR=output;
 await import('./compile.mjs');
 for(const [generated,target] of [['precomputed-grass.v1.bin.gz',asset],['precomputed-grass.v1.json','showroom/globe/h-earth/render/assets/precomputed-grass.v1.json'],['compiler-report.json','h-earth-3d/evidence/planting-boundary-repair-v1/compiler-report.json']])assert.equal(createHash('sha256').update(fs.readFileSync(path.join(output,generated))).digest('hex'),expected[target],target);
 fs.copyFileSync(path.join(output,'precomputed-grass.v1.bin.gz'),new URL(asset,root));
 for(const p of Object.keys(expected))assert.equal(digest(p),expected[p],p);
 console.log('EXACT_GEN2894_SAVED_CANDIDATE_BYTES_VERIFIED');
} finally {fs.rmSync(temp,{recursive:true,force:true});}
