import fs from 'node:fs';

const CONTRACT_PATH = new URL('../../control-plane/h-earth/ow01-planetary-reference-frame-v1/reference-frame.v1.json', import.meta.url);
const contract = JSON.parse(fs.readFileSync(CONTRACT_PATH, 'utf8'));
const tol = contract.verification.tolerance;

const add = (a,b)=>a.map((v,i)=>v+b[i]);
const sub = (a,b)=>a.map((v,i)=>v-b[i]);
const scale = (a,s)=>a.map(v=>v*s);
const dot = (a,b)=>a.reduce((sum,v,i)=>sum+v*b[i],0);
const cross = (a,b)=>[
  a[1]*b[2]-a[2]*b[1],
  a[2]*b[0]-a[0]*b[2],
  a[0]*b[1]-a[1]*b[0]
];
const norm = a=>Math.hypot(...a);
const unit = a=>scale(a,1/(norm(a)||1));
const maxAbs = a=>Math.max(...a.map(v=>Math.abs(v)));
const near = (a,b,t=tol)=>Math.abs(a-b)<=t;
const vecNear = (a,b,t=tol)=>maxAbs(sub(a,b))<=t;
const rad = deg=>deg*Math.PI/180;
const deg = radians=>radians*180/Math.PI;
const wrapLon = value=>{
  let x=((value+180)%360+360)%360-180;
  if (Math.abs(x+180)<1e-12 && value>0) x=180;
  return x;
};

const N = contract.referenceFrame.northAxisUnit;
const M = contract.referenceFrame.zeroLongitudeEquatorialUnit;
const E = contract.referenceFrame.eastEquatorialUnit;
const C = contract.acceptedGeometry.planetCenter;
const R = contract.acceptedGeometry.planetRadiusAuthoringUnits;
const G = contract.acceptedGeometry.gratitudeRadialUnit;

function latLonFromRadial(r){
  const u=unit(r);
  return {
    lat: deg(Math.asin(Math.max(-1,Math.min(1,dot(u,N))))),
    lon: wrapLon(deg(Math.atan2(dot(u,E),dot(u,M))))
  };
}

function radialFromLatLon(lat,lon){
  const phi=rad(lat),lambda=rad(lon);
  return unit(add(add(scale(M,Math.cos(phi)*Math.cos(lambda)),scale(E,Math.cos(phi)*Math.sin(lambda))),scale(N,Math.sin(phi))));
}

const checks=[];
const check=(id,pass,details={})=>checks.push({id,pass:Boolean(pass),details});

check('N_UNIT',near(norm(N),1),{norm:norm(N)});
check('M_UNIT',near(norm(M),1),{norm:norm(M)});
check('E_UNIT',near(norm(E),1),{norm:norm(E)});
check('N_M_ORTHOGONAL',near(dot(N,M),0),{dot:dot(N,M)});
check('N_E_ORTHOGONAL',near(dot(N,E),0),{dot:dot(N,E)});
check('M_E_ORTHOGONAL',near(dot(M,E),0),{dot:dot(M,E)});
check('N_CROSS_M_EQUALS_E',vecNear(cross(N,M),E),{cross:cross(N,M),expected:E});

const gratitude=latLonFromRadial(G);
check('GRATITUDE_LATITUDE_30N',near(gratitude.lat,30,1e-9),gratitude);
check('GRATITUDE_LONGITUDE_0E',near(gratitude.lon,0,1e-9),gratitude);

const localEast=unit(cross(N,G));
const localNorth=unit(sub(N,scale(G,dot(N,G))));
check('LOCAL_EAST_POSITIVE_X',vecNear(localEast,[1,0,0],1e-10),{localEast});
check('LOCAL_NORTH_NEGATIVE_Z',vecNear(localNorth,[0,0,-1],1e-10),{localNorth});

const northPole=add(C,scale(N,R));
const southPole=add(C,scale(N,-R));
const equatorZero=add(C,scale(M,R));
const equatorEast=add(C,scale(E,R));
check('NORTH_POLE_WORLD',vecNear(northPole,contract.derivedLandmarks.northPoleWorld,1e-9),{northPole});
check('SOUTH_POLE_WORLD',vecNear(southPole,contract.derivedLandmarks.southPoleWorld,1e-9),{southPole});
check('EQUATOR_ZERO_WORLD',vecNear(equatorZero,contract.derivedLandmarks.equatorZeroLongitudeWorld,1e-9),{equatorZero});
check('EQUATOR_90E_WORLD',vecNear(equatorEast,contract.derivedLandmarks.equatorNinetyEastWorld,1e-9),{equatorEast});
check('NORTH_POLE_LATITUDE',near(latLonFromRadial(N).lat,90,1e-9),latLonFromRadial(N));
check('SOUTH_POLE_LATITUDE',near(latLonFromRadial(scale(N,-1)).lat,-90,1e-9),latLonFromRadial(scale(N,-1)));
check('EQUATOR_ZERO_LAT_LON',near(latLonFromRadial(M).lat,0,1e-9)&&near(latLonFromRadial(M).lon,0,1e-9),latLonFromRadial(M));
check('EQUATOR_90E_LAT_LON',near(latLonFromRadial(E).lat,0,1e-9)&&near(latLonFromRadial(E).lon,90,1e-9),latLonFromRadial(E));

let roundTripMaxDeg=0;
let roundTripFailures=0;
const latitudes=[-80,-60,-30,0,30,60,80];
const longitudes=[-180,-135,-90,-45,0,45,90,135,180];
for(const lat of latitudes){
  for(const lon of longitudes){
    const r=radialFromLatLon(lat,lon);
    const recovered=latLonFromRadial(r);
    const lonTarget=wrapLon(lon);
    const lonError=Math.min(Math.abs(recovered.lon-lonTarget),360-Math.abs(recovered.lon-lonTarget));
    const latError=Math.abs(recovered.lat-lat);
    roundTripMaxDeg=Math.max(roundTripMaxDeg,latError,lonError);
    if(latError>1e-9||lonError>1e-9)roundTripFailures++;
  }
}
check('LAT_LON_ROUND_TRIP_LATTICE',roundTripFailures===0,{roundTripFailures,roundTripMaxDeg});

const eastwardVelocity=unit(cross(N,G));
check('POSITIVE_ROTATION_EASTWARD_AT_GRATITUDE',vecNear(eastwardVelocity,[1,0,0],1e-10),{eastwardVelocity});

const pass=checks.every(c=>c.pass);
const receipt={
  schema:'H_EARTH_AUDRALIA_PLANETARY_REFERENCE_FRAME_VERIFICATION_RECEIPT_v1',
  contractSchema:contract.schema,
  authorityIssue:contract.authorityIssue,
  pass,
  checks,
  derived:{gratitude,localEast,localNorth,northPole,southPole,equatorZero,equatorEast,roundTripMaxDeg},
  productMutation:false
};

console.log(JSON.stringify(receipt,null,2));
if(!pass)process.exitCode=1;
