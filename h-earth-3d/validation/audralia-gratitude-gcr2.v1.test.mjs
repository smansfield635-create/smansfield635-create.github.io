/**
 * GCR2 bounded source/model validation. Execute from repository root:
 * node --test h-earth-3d/validation/audralia-gratitude-gcr2.v1.test.mjs
 * Not a browser or owner visual acceptance substitute.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname,resolve} from 'node:path';
import {
  GCR2_METRIC_FRAME,GCR2_ANCHORS,regionalMetersToContinentalKm,
  continentalKmToRegionalMeters,regionalMetersToGeodetic,
  geodeticToRegionalMeters,directionFromContinentalKm,
  continentalKmFromDirection,continentalKmToGeodetic,
  directionToGeodetic,geodeticToDirection,globeWorldPoint
} from '../../showroom/globe/audralia/gcr2-completed-gratitude/metric-geography-bridge.v1.mjs';
import {
  HYDROLOGY_SOURCE,GRATITUDE_RIVERS,GRATITUDE_LAKES,
  sampleGratitudeHydrology,verifyNamedHydrology
} from '../../showroom/globe/audralia/gcr2-completed-gratitude/hydrology-graph.v1.mjs';
import {
  ECOLOGY_SOURCE,GRATITUDE_PROVINCES,sampleContinentalEcology,
  sampleContinentalReliefKm,provinceSignals
} from '../../showroom/globe/audralia/gcr2-completed-gratitude/ecology-field.v1.mjs';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'../..');
const candidate='showroom/globe/audralia/gcr2-completed-gratitude/';
const near=(actual,expected,epsilon=1e-9)=>assert.ok(Math.abs(actual-expected)<=epsilon,
  `actual=${actual}, expected=${expected}, epsilon=${epsilon}`);

test('accepted planetary 30°N/0°E anchor and compass remain world-anchored',()=>{
  const f=GCR2_METRIC_FRAME;
  assert.equal(f.planetRadiusKm,6200);
  assert.equal(f.regionalCurvatureMetersPreserved,420000);
  assert.deepEqual(directionFromContinentalKm(0,-128),[0,1,0]);
  near(directionToGeodetic([0,1,0]).latitudeDegrees,30);
  near(directionToGeodetic([0,1,0]).longitudeDegrees,0);
  near(continentalKmToGeodetic(1,-128).longitudeDegrees,.01067,.0001);
  assert.ok(continentalKmToGeodetic(0,-129).latitudeDegrees>30);
  assert.deepEqual(globeWorldPoint(0,-128,0),[0,0,0]);
  const e=geodeticToDirection(30,0);
  for(let i=0;i<3;i++)near(e[i],[0,1,0][i],1e-12);
});
test('all six named regional anchors reversibly map meters to continent km',()=>{
  assert.equal(GCR2_ANCHORS.length,6);
  for(const a of GCR2_ANCHORS){
    const p=regionalMetersToContinentalKm(a.xMeters,a.zMeters);
    const back=continentalKmToRegionalMeters(p.xKm,p.zKm);
    near(a.xMeters,back.xMeters,1e-9);near(a.zMeters,back.zMeters,1e-9);
    const geo=regionalMetersToGeodetic(a.xMeters,a.zMeters);
    const recovered=geodeticToRegionalMeters(geo.latitudeDegrees,geo.longitudeDegrees);
    near(recovered.xMeters,a.xMeters,1e-6);
    near(recovered.zMeters,a.zMeters,1e-6);
    const q=continentalKmFromDirection(directionFromContinentalKm(p.xKm,p.zKm));
    near(q.xKm,p.xKm,1e-9);near(q.zKm,p.zKm,1e-9);
  }
});
test('coastal/foothill/cavern fixture signs and physical dimensions',()=>{
  const grove=regionalMetersToGeodetic(-139,-216);
  const cavern=regionalMetersToGeodetic(40,-260);
  const ravine=regionalMetersToGeodetic(-272,-544);
  near(grove.latitudeDegrees,30.000813,.00001);
  near(grove.longitudeDegrees,-.001483,.00002);
  assert.ok(cavern.longitudeDegrees>0&&cavern.latitudeDegrees>grove.latitudeDegrees);
  assert.ok(ravine.latitudeDegrees>cavern.latitudeDegrees);
  assert.ok(globeWorldPoint(0,-128,1000)[1]>.99);
});
test('reject malformed local and planetary coordinates rather than relabeling',()=>{
  for(const invoke of [
    ()=>regionalMetersToContinentalKm(NaN,-128),
    ()=>regionalMetersToContinentalKm(6000,-128),
    ()=>regionalMetersToContinentalKm(0,9000),
    ()=>continentalKmToRegionalMeters(80,-128),
    ()=>directionFromContinentalKm(18000,-128),
    ()=>geodeticToDirection(91,0),
    ()=>geodeticToDirection(0,181),
    ()=>geodeticToDirection(NaN,0)
  ])assert.throws(invoke);
});
test('rev5 named 15 rivers/3 lakes and known confluences retained',()=>{
  assert.equal(HYDROLOGY_SOURCE.blob,'50991dd777ccd015fd8a6d8eae7b4d02b4a8450c');
  assert.equal(GRATITUDE_RIVERS.length,15);
  assert.equal(GRATITUDE_LAKES.length,3);
  assert.equal(new Set(GRATITUDE_RIVERS.map(x=>x.id)).size,15);
  assert.equal(new Set(GRATITUDE_LAKES.map(x=>x.id)).size,3);
  assert.equal(verifyNamedHydrology(),true);
});
test('continental water is distinct from H-Earth local flow',()=>{
  const central=sampleGratitudeHydrology(-420,-760);
  const lake=sampleGratitudeHydrology(260,-1010);
  assert.ok(central.riverRenderIntensity>.9);
  assert.ok(lake.lakeRenderIntensity>.9);
  assert.equal(lake.lakeId,'GREAT_INTERIOR_LAKE');
  assert.equal(HYDROLOGY_SOURCE.localRavineHasConfirmedPerennialWater,false);
  assert.equal(central.regionalWaterPresenceAsserted,false);
  assert.equal(central.visualWaterWidthIsPhysical,false);
  assert.throws(()=>sampleGratitudeHydrology(Infinity,-760));
});
test('relief follows geological provinces, not a duplicated local terrain mesh',()=>{
  assert.equal(GRATITUDE_PROVINCES.length,8);
  assert.equal(ECOLOGY_SOURCE.geologyStages,9);
  const upland=sampleContinentalReliefKm(120,-570,260);
  const delta=sampleContinentalReliefKm(240,-1780,20);
  assert.ok(upland>delta);
  assert.equal(provinceSignals(760,-1260).RAIN_SHADOW_STEPPE,1);
  for(const x of [-1300,-700,0,350,850,1200])for(const z of [-1600,-1000,-550]){
    const altitude=sampleContinentalReliefKm(x,z,100);
    assert.ok(Number.isFinite(altitude)&&altitude>=0&&altitude<=5.2);
  }
});
test('biomes vary with latitude, marine exposure, relief and rain shadow',()=>{
  const wet=sampleContinentalEcology(-120,-720,125);
  const dry=sampleContinentalEcology(760,-1260,460);
  const lake=sampleContinentalEcology(260,-1010,150);
  assert.ok(wet.moisture>dry.moisture,`wet=${wet.moisture} dry=${dry.moisture}`);
  assert.ok(lake.wetlandSuitability>0);
  assert.ok(wet.altitudeKm>=0&&dry.altitudeKm>=0);
  assert.notDeepEqual(wet.color,dry.color);
  assert.equal(wet.localGrassRootCountClaimed,0);
  assert.equal(wet.physicalRiverWidthClaimed,false);
  assert.deepEqual(wet,sampleContinentalEcology(-120,-720,125));
  assert.throws(()=>sampleContinentalEcology(NaN,0,10));
});
test('bounded continental sampling is deterministic and finite',()=>{
  let count=0;
  for(let x=-1300;x<=1300;x+=65)for(let z=-1800;z<=150;z+=65){
    const e=sampleContinentalEcology(x,z,Math.abs(20+z*.04));
    assert.ok(e.color.length===3&&e.color.every(n=>Number.isFinite(n)&&n>=0&&n<=1));
    assert.ok(Number.isFinite(e.altitudeKm)&&e.altitudeKm>=0);
    assert.ok(e.moisture>=0&&e.moisture<=1);
    count++;
  }
  assert.ok(count>=1000);
});
test('one nonproduction same-origin WebGL canvas and source-limited GCR2 code',()=>{
  const read=p=>readFileSync(resolve(root,p),'utf8');
  const html=read(candidate+'index.html'),app=read(candidate+'app.mjs');
  assert.equal((html.match(/<canvas\\b/g)||[]).length,1);
  assert.match(html,/noindex,nofollow,noarchive/);
  assert.match(html,/.\/app\.mjs/);
  assert.ok(!html.includes('<iframe'));
  assert.match(app,/getContext\('webgl2'/);
  assert.match(app,/buildHydrologyOverlay/);
  assert.match(app,/regionalMetersToContinentalKm/);
  assert.ok(!app.includes('new Worker('));
  assert.ok(!app.includes('cdn.jsdelivr'));
  assert.ok(!app.includes('waterPresent=true'));
});
