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
  GRATITUDE_DELTA_SHORE_CONTROLS,GRATITUDE_CANDIDATE_CONTINENT_REMAINDER,
  GRATITUDE_EASTERN_CONFLUENCE_CANDIDATE,clipCandidateRiverBankToLand,reconcileGratitudeNorthCoastZ,
  candidateDeltaSouthShoreZ,verifyCandidateDeltaCoast,verifyCandidateEasternConfluence,
  sampleGratitudeHydrology,verifyNamedHydrology
} from '../../showroom/globe/audralia/gcr2-completed-gratitude/hydrology-graph.v1.mjs';
import {
  ECOLOGY_SOURCE,GRATITUDE_PROVINCES,sampleContinentalEcology,
  sampleContinentalReliefKm,provinceSignals
} from '../../showroom/globe/audralia/gcr2-completed-gratitude/ecology-field.v1.mjs';

import { H_EARTH_TERRAIN_FIELD,getHEarthCanonicalShorelineZ } from '../terrain/h-earth.terrain-field.js';
import { resolveAudraliaGratitudeShorelineZ } from '../../inspection/audralia-24057-exact/snapshot/h-earth-3d/integration/audralia.gratitude-geographic-transfer.v1.js';

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
  assert.equal((html.match(/<canvas\b/g)||[]).length,1);
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

// Geographic mutation review for the existing source-anchored GCR2 operation.
test('rev5 delta branches each meet one reconciled southern coast, without displaced endpoints',()=>{
  assert.equal(verifyCandidateDeltaCoast(),true);
  assert.equal(GRATITUDE_DELTA_SHORE_CONTROLS[0][0],890);
  assert.equal(GRATITUDE_DELTA_SHORE_CONTROLS.at(-1)[0],10);
  assert.ok(GRATITUDE_DELTA_SHORE_CONTROLS.every((p,i,a)=>i===0||p[0]<a[i-1][0]));
  for(const id of ['DELTA_BRANCH_WEST','DELTA_BRANCH_CENTRAL','DELTA_BRANCH_EAST']){
    const branch=GRATITUDE_RIVERS.find(r=>r.id===id);
    const [x,z]=branch.points.at(-1);
    near(candidateDeltaSouthShoreZ(x),z,1e-9);
    assert.ok(z>=-2050);
  }
  assert.equal(GRATITUDE_RIVERS.length,15);
  assert.equal(GRATITUDE_LAKES.length,3);
});

test('proposed eastern outflow connects source endpoints but remains nonauthoritative',()=>{
  assert.equal(verifyCandidateEasternConfluence(),true);
  const candidate=GRATITUDE_EASTERN_CONFLUENCE_CANDIDATE;
  assert.match(candidate.provenance,/NOT_PROTECTED_REV5_GEOGRAPHY/);
  assert.equal(candidate.physicallyValidatedDischarge,false);
  assert.equal(candidate.sourceProvesPerennialWater,false);
  const e=GRATITUDE_RIVERS.find(r=>r.id==='EASTERN_RIVER');
  const main=GRATITUDE_RIVERS.find(r=>r.id==='GRATITUDE_MAJOR_THROUGH_RIVER');
  assert.deepEqual(candidate.points[0],e.points.at(-1));
  assert.ok(main.points.some(point=>point[0]===candidate.points.at(-1)[0]&&
    point[1]===candidate.points.at(-1)[1]));
  const modeled=sampleGratitudeHydrology(431,-1517);
  assert.ok(modeled.easternConfluenceCandidateIntensity>.99);
  assert.equal(modeled.easternConfluenceIsSourceAuthority,false);
  assert.equal(modeled.continentalCompletedNetwork,false);
});

test('candidate mesh extends beyond all three delta mouth endpoints',()=>{
  const app=readFileSync(resolve(root,candidate+'app.mjs'),'utf8');
  assert.match(app,/buildAxis\(-2050,260,-420,120,22,8\)/);
  assert.match(app,/GRATITUDE_CANDIDATE_CONTINENT_REMAINDER/);
  assert.match(app,/GRATITUDE_EASTERN_CONFLUENCE_CANDIDATE/);
  assert.match(app,/verifyCandidateDeltaCoast\(\)/);
  assert.match(app,/verifyCandidateEasternConfluence\(\)/);
});


test('Stage 1: entire protected core coastline maps exactly through unchanged metric bridge',()=>{
  const core=H_EARTH_TERRAIN_FIELD.coreDomain;
  assert.equal(core.xMinimum,-256);assert.equal(core.xMaximum,256);
  let samples=0;
  for(let x=core.xMinimum;x<=core.xMaximum;x+=0.5){
    const expected=regionalMetersToContinentalKm(x,getHEarthCanonicalShorelineZ(x)).zKm;
    near(reconcileGratitudeNorthCoastZ(x/1000,-81.84),expected,1e-11);
    ++samples;
  }
  assert.equal(samples,1025);
  near(reconcileGratitudeNorthCoastZ(.208,-81.84258114837758),-127.94907776723889,1e-11);
  assert.throws(()=>reconcileGratitudeNorthCoastZ(NaN,0),/NONFINITE/);
  assert.throws(()=>reconcileGratitudeNorthCoastZ(0,Infinity),/NONFINITE/);
});
test('Stage 1: local coastline edges preserve position and tangent; far macro coast is unchanged',()=>{
  const core=H_EARTH_TERRAIN_FIELD.coreDomain;
  const h=1e-6;
  for(const meters of [core.xMinimum,core.xMaximum]){
    const x=meters/1000,expected=regionalMetersToContinentalKm(meters,getHEarthCanonicalShorelineZ(meters)).zKm;
    const f=y=>reconcileGratitudeNorthCoastZ(y,-81.84);
    near(f(x),expected,1e-11);
    assert.ok(Math.abs(f(x-h)-f(x))<.0001 && Math.abs(f(x+h)-f(x))<.0001);
    const left=(f(x)-f(x-h))/h,right=(f(x+h)-f(x))/h;
    assert.ok(Math.abs(left-right)<.01,`shoreline tangent discontinuity at ${x}: ${left} / ${right}`);
    const side=meters<0?-1:1;
    near(f(x+side*160),-81.84,1e-12);
    near(f(x+side*160.1),-81.84,1e-12);
  }
});

/* Independent polygon calculations use rev5's shoreline resolver and the
 * candidate shoreline controls; they do not import renderer-only predicates. */
const testSmooth=(a,b,x)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t);};
function candidateLoop(){
  const coast=resolveAudraliaGratitudeShorelineZ,left=coast(-260),right=coast(260);
  const macro=x=>{
    const t=Math.max(0,Math.min(1,(x+260)/520));
    const s=x<=-260||x>=260?coast(x):left+(right-left)*testSmooth(0,1,t)+9*Math.sin(t*Math.PI)*Math.sin(x*.015);
    const edgeT=Math.max(0,Math.min(1,(x+1130)/2250));
    const provisional=s+(-245-coast(-1130))*(1-testSmooth(0,.12,edgeT))+(-176-coast(1120))*testSmooth(.88,1,edgeT);
    return reconcileGratitudeNorthCoastZ(x,provisional);
  };
  const north=[];for(let x=-1130;x<1120;x+=12)north.push([x,macro(x)]);
  north.push([1120,macro(1120)]);
  return [...north,...GRATITUDE_CANDIDATE_CONTINENT_REMAINDER];
}
function inCandidate(point,loop){
  const [x,z]=point;let inside=false;
  for(let i=0,j=loop.length-1;i<loop.length;j=i++){
    const a=loop[i],b=loop[j];
    if(((a[1]>z)!==(b[1]>z))&&(x<(b[0]-a[0])*(z-a[1])/(b[1]-a[1])+a[0]))inside=!inside;
  }
  return inside;
}
function coastDistanceForTest(point,loop){
  let best=Infinity;
  for(let i=0;i<loop.length;i++){
    const a=loop[i],b=loop[(i+1)%loop.length],dx=b[0]-a[0],dz=b[1]-a[1],den=dx*dx+dz*dz||1;
    const t=Math.max(0,Math.min(1,((point[0]-a[0])*dx+(point[1]-a[1])*dz)/den));
    best=Math.min(best,Math.hypot(point[0]-a[0]-dx*t,point[1]-a[1]-dz*t));
  }
  return best;
}
test('peripheral source headwaters, all river centerlines and delta mouths match revised one-piece coast',()=>{
  const loop=candidateLoop();
  assert.equal(loop.length,229);
  assert.ok(loop.every(([x,z])=>x>=-1600&&x<=1550&&z>=-2050&&z<=260));
  const cross=(a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
  for(let i=0;i<loop.length;i++)for(let j=i+2;j<loop.length;j++){
    if(i===0&&j===loop.length-1)continue;
    const a=loop[i],b=loop[(i+1)%loop.length],c=loop[j],d=loop[(j+1)%loop.length];
    assert.ok(!(cross(a,b,c)*cross(a,b,d)<0&&cross(c,d,a)*cross(c,d,b)<0),`coast ${i}/${j}`);
  }
  for(const [id,original,minCoast] of [
    ['WEST_TRIBUTARY_A',[-1320,-910],100],
    ['EAST_TRIBUTARY_A',[1270,-940],40]
  ]){
    const first=GRATITUDE_RIVERS.find(r=>r.id===id).points[0];
    assert.deepEqual(first,original);
    assert.equal(inCandidate(first,loop),true,id);
    assert.ok(coastDistanceForTest(first,loop)>minCoast,id);
  }
  for(const river of [...GRATITUDE_RIVERS,GRATITUDE_EASTERN_CONFLUENCE_CANDIDATE]){
    for(let i=0;i<river.points.length-1;i++){
      const a=river.points[i],b=river.points[i+1],len=Math.hypot(a[0]-b[0],a[1]-b[1]);
      const samples=Math.ceil(len/2);
      for(let j=0;j<samples;j++){
        const t=(j+.5)/samples,p=[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];
        assert.ok(inCandidate(p,loop),`${river.id} point ${p}`);
      }
    }
    const end=river.points.at(-1);
    if(river.id.startsWith('DELTA_BRANCH_'))near(coastDistanceForTest(end,loop),0,1e-8);
    else assert.equal(inCandidate(end,loop),true,`${river.id} last point`);
  }
  assert.equal(GRATITUDE_RIVERS.length,15);assert.equal(GRATITUDE_LAKES.length,3);
});
test('coast-constrained river banks and expanded grid remain bounded inspection geometry',()=>{
  const loop=candidateLoop(),land=(x,z)=>inCandidate([x,z],loop);
  assert.equal(land(-1320,-910),true);assert.equal(land(-1540,-910),false);
  const clipped=clipCandidateRiverBankToLand(-1320,-910,-1540,-910,land);
  assert.equal(land(...clipped),true);
  assert.ok(clipped[0]>-1540&&clipped[0]<-1320);
  assert.deepEqual(clipCandidateRiverBankToLand(0,-1000,2,-1000,land),[2,-1000]);
  assert.throws(()=>clipCandidateRiverBankToLand(Infinity,0,0,0,land));
  const app=readFileSync(resolve(root,candidate+'app.mjs'),'utf8');
  assert.match(app,/buildAxis\(-1600,1550,-320,320,22,8\)/);
  assert.match(app,/verifySourceDrainageOnCandidateLand\(\)/);
  assert.match(app,/CANDIDATE_RIVERS_OUTSIDE_LAND/);
  assert.match(app,/clipCandidateRiverBankToLand\(/);
  assert.match(app,/Math\.ceil\(len\/6\)/);
});
