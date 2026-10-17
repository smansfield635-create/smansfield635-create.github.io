# H-Earth bounded performance repair — Gen2795

Candidate construction for `H_EARTH_BOUNDED_PERFORMANCE_REPAIR_20261017_001`; no merge, deployment or publication authority. Governing head `f64ce197d6bd54cd3627458fc138295e9913f761`; published visual baseline `2dd9f360547ed9ee38b1bbe488fd79fb65851ba3`. Their terrain/environment/render source is identical. Admission remains lock commit `9d68a29b5b34282db253042a3206aeadbb1d2536`, ledger blob `5d6693713c940a4f0b527fe6abf319307c932a03`.

[Authenticated request and procedure](https://github.com/smansfield635-create/smansfield635-create.github.io/issues/6426#issuecomment-6241558095) · [Recovered continuation](https://github.com/smansfield635-create/smansfield635-create.github.io/issues/6426#issuecomment-6241605272).

## Result and boundaries

The candidate preserves terrain formulas, navigation/collision substeps, root membership/contact/normal records, tree/water/cavern geometry, ecology and palette. Vegetation still installs one immutable owner and has zero per-frame uploads. Queued ravine fullness, terrain rectangle, close grass repetition and shoreline artifacts are separate work.

Presentation requests now retain only the latest accepted navigation state until the next animation opportunity. The intake still processes every substep. Uploads keep original tile offsets and packed bytes, batching with a strict 262,144-byte cap and a 4 ms cooperative CPU submission budget. A single GL call cannot be preempted: the receipt reports the largest atomic call and largest slice; it does not promise hard 4 ms GPU completion.

Public startup retains H-Earth branding and world-in-development context. Progress percentages appear only with explicit completed/total work counts, scoped to named stages. After population preparation the instruction panel allows gestures on the actual scene. Enter stays disabled until accepted input changes the camera, the matching navigation pose completes renderFrame/presentColorFrame, and a subsequent RAF opportunity occurs. Enter then dismisses the panel and publishes public readiness. Failure revokes entry. Earliest input, rendered coalesced pose and dismissal are separately recorded. These CPU submission/RAF observations do not prove displayed pixels, GPU execution, sustained smooth traversal, or physical-device acceptance.

## Verification

Declared command:

```sh
node --test h-earth-3d/validation/h-earth.performance-scheduling.v1.test.mjs h-earth-3d/validation/h-earth.terrain-memoization.v1.test.mjs
```

Coverage includes baseline output equality, nested mutation rejection, finite and signed-zero coordinates, bounded cache collision/recomputation, real unchanged intake substeps/final poses, byte/time upload slices, unchanged packed bytes, failure handling, real route orchestration with renderer/browser fixtures, public input-to-render-to-entry gating, and preserved 16-step diagnostic roundtrip. Renderer/browser fixtures are explicitly not browser or device execution.

The existing single-owner suite was also inspected/executed: 31/38 pass. Seven old route/HTML checks use import-stripping mocks missing the new dependencies or require the fixed Gen2794 URL/old immediate-ready semantics. Its resource, root, shader and actual software GLES compile/link checks pass. The admitted new tests execute the new route body with real presenter/loader dependencies and qualify the changed contract. The old suite remains unmodified, and is not represented as wholly passing.

Full CPU fixture population: **449,944 roots, 1,621 tiles, 7,199,104 packed bytes**. Maximum tile 13,056 bytes. Root-record SHA-256, including every JSON root record in tile order, is unchanged:

`852f8a7a8afa923d45d9d7b81c7ca374f7e57dbd7253dad235fd3c3c0ac1d9bc`

No browser waits or WebGL work occur in this CPU fixture. It uses the canonical base-world archive and existing beach/contact fixture without camera refinement. This is separate from the historical browser run (world ~8.8s; populated ~75.9s; owner setup/uploads ~27.7s) and earlier ~33.3s generation diagnostic. Those numbers must never be summed or relabeled as one run.

Actual 1,621-tile layout with the new scheduler and a no-op Node upload: 28 slices, 27 yields, maximum slice 261,872 bytes, 7,199,104 total bytes. Measured host CPU maximum slice ~0.326 ms. This establishes layout batching only; it is not a GL upload-speed measurement.

## Performance experiment and rejected variant

Nested Map field/elevation caches preserved identity but regressed the full CPU fixture: 54.777s (and an earlier contended run 58.057s), versus fresh baseline 42.024s. The repeated-coordinate microbenchmark alone had improved, so that result was insufficient. The regressing implementation was rejected before candidate preservation.

A fixed-slot exact-coordinate cache with both field and elevation reuse took 38.643s and preserved the full root hash. Instrumentation counted 2,946,492 field requests with 491,082 hits, but 12,277,050 scalar elevation requests with **zero hits**. Scalar caching was therefore removed from the final design. Cache hash collisions only cause recomputation; exact stored coordinates are checked before reuse, without coordinate quantization.

## Review and continuation

Native functional assignments: `/root/north_n` (navigation/routing), `/root/loader_e` (signal/readiness), `/root/terrain_s` (terrain construction), and independent `/root/west_w` (boundary review). Parent implemented scheduler/upload integration. Assignment and returned review events belong to this room; no model independence is inferred from a self-authored JSON flag.

Next: preserve this immutable candidate, use the existing registered neutral exact-head runner for WebGL2 comparison where its transport is available, and obtain target-device loading/turning/walking evidence. The public controls-test path requires a real gesture before Enter, so a runner that only waits for public READY without sending input is insufficient; diagnostic replay remains separate. Do not alter policy/workflows or deploy production to obtain a preview. Do not close the active scope as accepted while required candidate-finalization evidence is pending.

## Final CPU evidence

Final uninstrumented source fixture (Node v24.19.0/Linux):

```json
{
  "schema": "H_EARTH_CPU_GENERATION_DIAGNOSTIC_v1",
  "head": "GEN2795_UNCOMMITTED_CPU_CANDIDATE",
  "rootRecordSha256": "852f8a7a8afa923d45d9d7b81c7ca374f7e57dbd7253dad235fd3c3c0ac1d9bc",
  "runtime": "v24.19.0",
  "platform": "linux",
  "stages": {
    "start": 0.015893999999995856,
    "fixtureStart": 1054.874361,
    "fixtureComplete": 1641.667467,
    "admissionComplete": 1648.762275,
    "habitatStart": 1648.905887,
    "habitatComplete": 5175.475592,
    "rootsComplete": 34818.368831,
    "packingComplete": 35792.287201
  },
  "counts": {
    "roots": 449944,
    "tiles": 1621,
    "bytes": 7199104,
    "minimumTileBytes": 16,
    "maximumTileBytes": 13056
  },
  "limitations": [
    "Node CPU execution, not browser or tablet timing",
    "Canonical archive beach/contact fixture; no camera refinement",
    "Cooperative browser frame waits omitted",
    "No WebGL/GPU upload or display measurement"
  ]
}
```

Final declared suite: **18/18 PASS**, independently rerun by W. A repeated25,600-request sample reduced raw formula calls128,000 to3,260, including fixed-slot collisions; it is not the full-world timing benchmark.

Final cache has16,384 slots, two bounded coordinate arrays and a fixed value array; no scalar cache. Exact field results and nested ownership are frozen once. Hash collisions evict and recompute; they never approximate coordinates.

## Reproduce the CPU population fixture

Run the following as a temporary `.mjs` from the repository root with the candidate checked out. It reuses the canonical archive and existing test fixture. It writes only `/tmp` evidence, omits browser yields and does not render. The prior baseline is identical in relevant dependencies; run it separately at the governing baseline with this same harness for comparison. Do not run CPU benchmarks concurrently.

```js
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {performance} from 'node:perf_hooks';
const root=new URL('file://'+process.cwd()+'/');
const {buildWoodlandHabitatField,habitatSmooth,habitatSlopeWeight,WOODLAND_HABITAT}=await import(new URL('showroom/globe/h-earth/render/woodland-habitat-field.v1.js',root));
const {createUniformGroundAdmission}=await import(new URL('showroom/globe/h-earth/render/landscape-planting-pilot.v1.js',root));
const stages={},started=performance.now();
function stage(name){stages[name]=performance.now()-started;console.log(name,stages[name].toFixed(1)+'ms');}
stage('start');
 const {gunzipSync}=await import('node:zlib');const {readFile}=await import('node:fs/promises');
 const {createHash}=await import('node:crypto');
 const rendererUrl=new URL('showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js',root);
 const renderer=readFileSync(rendererUrl,'utf8'),bytes=readFileSync(new URL('showroom/globe/h-earth/render/assets/h-earth-canonical-base-world.v1.json.gz',root));
 assert.equal(createHash('sha256').update(bytes).digest('hex'),'48f754ca1b11b8fe7eeb0e8d4573f6b6cb544cf438322a115eb52c44d3b29d5a');
 const payload=JSON.parse(gunzipSync(bytes)),before=createHash('sha256').update(JSON.stringify(payload.raw.buffers)).digest('hex');
 const renderBase=new URL('showroom/globe/h-earth/render/',root),bridgeSpecifier=renderer.match(/from ['"]([^'"]*geological-runtime-bridge\.v1\.js[^'"]*)['"]/)[1];
 const bridge=await import(new URL(bridgeSpecifier,rendererUrl));
 const geology=bridge.constructGeologicalRuntimeBridge(payload.canonical);
 const terrain=await import(new URL('h-earth-3d/terrain/h-earth.geological-formation-successor.v1.mjs',root));
 const placement=await import(new URL('h-earth-3d/environment/h-earth.gen2514-qualified-placement-authority.js',root));
 const materials=await import(new URL('h-earth-3d/environment/h-earth.gen2514-qualified-surface-material.run8c.js',root));
 const grass=await import(new URL('grass-lowland-trial.js',renderBase)),woodland=await import(new URL('woodland-fine-grass.v1.js',renderBase)),owner=await import(new URL('vegetation-single-owner.prototype.v1.js',renderBase));
 // Reuse the existing exact Float32 beach fixture, including canonical contact distances.
 const fixtureSource=readFileSync(new URL('h-earth-3d/validation/h-earth.planting-pilot.v1.test.mjs',root),'utf8');
 const fixtureStart=fixtureSource.indexOf('async function buildCanonicalBeachFixture('),fixtureEnd=fixtureSource.indexOf("\n\n\ntest(",fixtureStart);
 const fixture=Function('assert','readFile',fixtureSource.slice(fixtureStart,fixtureEnd)+';return buildCanonicalBeachFixture;')(assert,readFile);
 const {H_EARTH_WOODLAND_CLEARING_BOUNDS:b}=await import(new URL('woodland-clearing-trial.js',renderBase));
 const protectedReferenceAt=()=>false;
 stage('fixtureStart'); const {visibleSurface}=await fixture({baseDirectory:root.pathname,pkg:payload.raw,geology,uploadSource:readFileSync(new URL('gpu-upload-views.run8e-r2d.js',renderBase),'utf8'),protectedReferenceAt});
 stage('fixtureComplete'); const pilotPackage=payload.raw,admitGround=await createUniformGroundAdmission({visibleSurface,geology,toLocal:terrain.unprojectPlanetVertex,estate:placement.H_EARTH_GEN311_ESTATE_PLACEMENT_POLICY,obstacles:pilotPackage.landscapeCoverFootprints??[],trees:pilotPackage.landscapeFloorFootprints??[],oasis:grass.H_EARTH_OASIS_FOLIAGE_SAMPLE,sampleStructure:placement.sampleHEarthGen311PlacementStructureDisposition,maximumSandCoverage:.12});
 stage('admissionComplete'); const replacement=renderer.slice(renderer.indexOf('  function prepareReplacementVegetation'));
 const fieldCode=replacement.slice(replacement.indexOf('      const habitat=await buildWoodlandHabitatField'),replacement.indexOf('      const presentation=await buildWoodlandFineGrass'));
 stage('habitatStart'); const field=await Function('buildWoodlandHabitatField','habitatSmooth','yieldToBrowserPaint','visibleSurface','admitGround','unprojectPlanetVertex','pilotMaterialAt','woodlandGrassClear','pilotPackage','WOODLAND_HABITAT','resources','habitatSlopeWeight',`return(async()=>{${fieldCode};return habitat;})()`)(buildWoodlandHabitatField,habitatSmooth,async()=>{},visibleSurface,admitGround,terrain.unprojectPlanetVertex,materials.sampleHEarthRun8CSuccessorSurfaceMaterial,woodland.woodlandGrassClear,pilotPackage,WOODLAND_HABITAT,{geologicalRuntime:geology},habitatSlopeWeight);
 stage('habitatComplete'); const presentation=await woodland.buildWoodlandFineGrass(pilotPackage,{visibleSurface,admitGround,habitat:field});

stage('rootsComplete');
const tiles=owner.planImmutableTiles(presentation);stage('packingComplete'); const rootRecordHash=createHash('sha256'); for(const tile of presentation.tiles){rootRecordHash.update(tile.id);for(const root of tile.roots)rootRecordHash.update(JSON.stringify(root));}const rootRecordSha256=rootRecordHash.digest('hex');
const counts={roots:tiles.reduce((n,t)=>n+t.count,0),tiles:tiles.length,bytes:tiles.reduce((n,t)=>n+t.packed.byteLength,0),minimumTileBytes:Math.min(...tiles.map(t=>t.packed.byteLength)),maximumTileBytes:Math.max(...tiles.map(t=>t.packed.byteLength))};
const output={schema:'H_EARTH_CPU_GENERATION_DIAGNOSTIC_v1',sourceScope:'EXECUTED_WORKTREE_SOURCE_HASHES_BOUND_BY_RECEIPT',rootRecordSha256,runtime:process.version,platform:process.platform,stages,counts,limitations:['Node CPU execution, not browser or tablet timing','Canonical archive beach/contact fixture; no camera refinement','Cooperative browser frame waits omitted','No WebGL/GPU upload or display measurement']};
writeFileSync('/tmp/h-earth-performance-identity.json',JSON.stringify(output,null,2));
writeFileSync('/tmp/h-earth-performance-upload-layout.json',JSON.stringify(tiles.map(t=>({id:t.id,count:t.count,bytes:t.packed.byteLength}))));
console.log(JSON.stringify(output,null,2));

```
