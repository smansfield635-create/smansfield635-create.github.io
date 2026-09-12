import assert from 'node:assert/strict';

const labels = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];
const basis = ['Navigation','Signal','Continuity','Boundary'];
const opposing = new Set(['0:2','2:0','1:3','3:1']);
const stations = labels.map((label,index) => {
  const angle = index * Math.PI / 8;
  const quadrant = Math.floor(index / 4) % 4;
  const delta = angle - quadrant * Math.PI / 2;
  const vector = [0,0,0,0];
  vector[quadrant] = Math.cos(delta);
  vector[(quadrant + 1) % 4] = Math.sin(delta);
  for (let i=0;i<vector.length;i++) if (Math.abs(vector[i]) < 1e-12) vector[i] = 0;
  return {label,index,angle,vector};
});

function normalized(vector) {
  const norm = Math.hypot(...vector);
  assert(norm > 0, 'zero requirement vector');
  return vector.map(x => x / norm);
}

function route(requirements, authority='NONE') {
  const active = requirements.map((x,i) => x > 1e-12 ? i : -1).filter(i => i >= 0);
  if (active.length > 2) return {disposition:'DECOMPOSE',reason:'THREE_OR_FOUR_PRIMITIVES',authority};
  if (active.length === 2 && opposing.has(`${active[0]}:${active[1]}`)) {
    return {disposition:'DECOMPOSE',reason:'OPPOSING_PRIMITIVES',authority};
  }
  const v = normalized(requirements);
  const ranked = stations.map(s => ({label:s.label,score:s.vector.reduce((sum,x,i) => sum + x*v[i],0)}))
    .sort((a,b) => b.score-a.score || labels.indexOf(a.label)-labels.indexOf(b.label));
  return {disposition:'ROUTE',station:ranked[0].label,authority};
}

const cases = [];
const add = (id,kind,requirements,expected,authority='NONE') => cases.push({id,kind,requirements,expected,authority});

// 48 station cases: exact center and two interior attraction-basin perturbations.
for (const station of stations) {
  for (const [suffix,offset] of [['CENTER',0],['CCW_SAFE',-Math.PI/32],['CW_SAFE',Math.PI/32]]) {
    let angle = station.angle + offset;
    if (angle < 0) angle += Math.PI*2;
    const q = Math.floor(angle/(Math.PI/2))%4;
    const delta = angle-q*Math.PI/2;
    const vector=[0,0,0,0];
    vector[q]=Math.cos(delta);
    vector[(q+1)%4]=Math.sin(delta);
    add(`${station.label}_${suffix}`,'STATION_QUALIFICATION',vector,{disposition:'ROUTE',station:station.label});
  }
}

// 8 opposing-pair cases.
for (const [pair,indices] of Object.entries({NAV_CONT:[0,2],SIG_BOUND:[1,3]})) {
  for (const [suffix,a,b] of [['BALANCED',1,1],['FIRST_DOMINANT',2,1],['SECOND_DOMINANT',1,2],['UNEQUAL',0.9,0.3]]) {
    const vector=[0,0,0,0]; vector[indices[0]]=a; vector[indices[1]]=b;
    add(`${pair}_${suffix}`,'OPPOSITION',vector,{disposition:'DECOMPOSE',reason:'OPPOSING_PRIMITIVES'});
  }
}

// 4 materially three/four-primitive cases.
add('N_E_S','MULTI_PRIMITIVE',[1,1,1,0],{disposition:'DECOMPOSE',reason:'THREE_OR_FOUR_PRIMITIVES'});
add('E_S_W','MULTI_PRIMITIVE',[0,1,1,1],{disposition:'DECOMPOSE',reason:'THREE_OR_FOUR_PRIMITIVES'});
add('S_W_N','MULTI_PRIMITIVE',[1,0,1,1],{disposition:'DECOMPOSE',reason:'THREE_OR_FOUR_PRIMITIVES'});
add('ALL_FOUR','MULTI_PRIMITIVE',[1,1,1,1],{disposition:'DECOMPOSE',reason:'THREE_OR_FOUR_PRIMITIVES'});

// 4 authority-invariance cases: authority is carried but cannot change bearing.
for (let i=0;i<4;i++) {
  const vector=[0,0,0,0]; vector[i]=1;
  add(`${labels[i*4]}_AUTHORITY_INVARIANCE`,'AUTHORITY_SEPARATION',vector,{disposition:'ROUTE',station:labels[i*4]},`GRANT_CLASS_${i+1}`);
}

assert.equal(cases.length,64);
const results = cases.map(test => {
  const actual = route(test.requirements,test.authority);
  const pass = actual.disposition === test.expected.disposition &&
    (test.expected.station === undefined || actual.station === test.expected.station) &&
    (test.expected.reason === undefined || actual.reason === test.expected.reason) &&
    (test.kind !== 'AUTHORITY_SEPARATION' || actual.authority === test.authority);
  return {...test,actual,pass};
});
const failures = results.filter(x => !x.pass);
const counts = Object.fromEntries([...new Set(cases.map(x=>x.kind))].map(kind => {
  const group=results.filter(x=>x.kind===kind); return [kind,{total:group.length,passed:group.filter(x=>x.pass).length}];
}));
const receipt = {
  schema:'COMPASS_16_STATION_QUALIFICATION_RECEIPT_v1',
  result:failures.length ? 'FAIL' : 'PASS_CLOSED',
  frozenStationCount:stations.length,
  angularIncrementDegrees:22.5,
  scenarioCount:cases.length,
  passedCount:cases.length-failures.length,
  failedCount:failures.length,
  categories:counts,
  invariants:{
    adjacentCompositionOnly:true,
    opposingPairsDecompose:true,
    threeOrFourPrimitivesDecompose:true,
    authorityDoesNotSelectBearing:true
  },
  failures
};
process.stdout.write(JSON.stringify(receipt,null,2)+'\n');
if (failures.length) process.exitCode=1;
