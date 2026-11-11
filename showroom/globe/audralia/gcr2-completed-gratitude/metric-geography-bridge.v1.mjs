/**
 * Audralia GCR2 metric-geography bridge.
 * Planetary geometry is in km. H-Earth coordinates and elevations stay meters.
 * The established world anchor at local (0 m, -128 m) is 30°N, 0°E.
 * Nonproduction candidate only; does not alter Audralia or H-Earth.
 */
export const GCR2_METRIC_FRAME = Object.freeze({
  schema: 'AUDRALIA_GCR2_METRIC_GEOGRAPHY_BRIDGE_v1',
  planetRadiusKm: 6200,
  planetCenterKm: Object.freeze([0,-6200,0]),
  gratitudeCenterLat: 30,
  gratitudeCenterLon: 0,
  continentalAnchorZKm: -128,
  hEarthAnchorZMeters: -128,
  regionalCurvatureMetersPreserved: 420000,
  northAxis: Object.freeze([0,0.5,-0.8660254037844386]),
  meridian: Object.freeze([0,0.8660254037844386,0.5]),
  east: Object.freeze([1,0,0]),
  radialAtGratitude: Object.freeze([0,1,0]),
  localXIsEast: true,
  localNegativeZIsNorth: true,
  sourceReferenceBlob: 'e5608b6208331d8887de08ec898c5bca4af91e72',
  sourceReferenceAcceptedInMergedPR: 752,
  localRadiusLimitMeters: 5000
});
const PI=Math.PI;
const n=(x,label)=>{if(typeof x!=='number'||!Number.isFinite(x))throw new RangeError(label+'_NONFINITE');return x;};
const boundLocal=(x,z)=>{
  n(x,'X_METERS');n(z,'Z_METERS');
  if(Math.hypot(x,z-GCR2_METRIC_FRAME.hEarthAnchorZMeters)>GCR2_METRIC_FRAME.localRadiusLimitMeters)
    throw new RangeError('REGION_OUT_OF_RANGE');
};
const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
const normalize=v=>{const r=Math.hypot(...v);if(!(r>0))throw new RangeError('DIRECTION_ZERO');return v.map(q=>q/r);};
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));

export function regionalMetersToContinentalKm(xMeters,zMeters){
  boundLocal(xMeters,zMeters);
  return Object.freeze({
    xKm:xMeters/1000,
    zKm:GCR2_METRIC_FRAME.continentalAnchorZKm+(zMeters-GCR2_METRIC_FRAME.hEarthAnchorZMeters)/1000
  });
}
export function continentalKmToRegionalMeters(xKm,zKm){
  n(xKm,'X_KM');n(zKm,'Z_KM');
  const xMeters=xKm*1000;
  const zMeters=GCR2_METRIC_FRAME.hEarthAnchorZMeters+
    (zKm-GCR2_METRIC_FRAME.continentalAnchorZKm)*1000;
  boundLocal(xMeters,zMeters);
  return Object.freeze({xMeters,zMeters});
}
export function directionFromContinentalKm(xKm,zKm){
  n(xKm,'X_KM');n(zKm,'Z_KM');
  const u=xKm,v=zKm-GCR2_METRIC_FRAME.continentalAnchorZKm;
  const rho=Math.hypot(u,v),angle=rho/GCR2_METRIC_FRAME.planetRadiusKm;
  if(angle>PI*0.48)throw new RangeError('CONTINENT_TANGENT_OUT_OF_RANGE');
  if(rho<1e-14)return Object.freeze([0,1,0]);
  const s=Math.sin(angle)/rho;
  return Object.freeze([u*s,Math.cos(angle),v*s]);
}
export function continentalKmFromDirection(direction){
  if(!Array.isArray(direction)||direction.length!==3)throw new TypeError('DIRECTION_SHAPE');
  const d=normalize(direction.map((v,i)=>n(v,'DIRECTION_'+i)));
  const angle=Math.atan2(Math.hypot(d[0],d[2]),d[1]);
  if(angle>PI*0.48)throw new RangeError('DIRECTION_TANGENT_OUT_OF_RANGE');
  const rho=angle*GCR2_METRIC_FRAME.planetRadiusKm,den=Math.hypot(d[0],d[2]);
  return Object.freeze({
    xKm:den<1e-14?0:rho*d[0]/den,
    zKm:GCR2_METRIC_FRAME.continentalAnchorZKm+(den<1e-14?0:rho*d[2]/den)
  });
}
export function directionToGeodetic(direction){
  if(!Array.isArray(direction)||direction.length!==3)throw new TypeError('DIRECTION_SHAPE');
  const d=normalize(direction.map((v,i)=>n(v,'DIRECTION_'+i))),f=GCR2_METRIC_FRAME;
  return Object.freeze({
    latitudeDegrees:Math.asin(clamp(dot(d,f.northAxis),-1,1))*180/PI,
    longitudeDegrees:Math.atan2(dot(d,f.east),dot(d,f.meridian))*180/PI
  });
}
export function geodeticToDirection(latitudeDegrees,longitudeDegrees){
  n(latitudeDegrees,'LATITUDE');n(longitudeDegrees,'LONGITUDE');
  if(Math.abs(latitudeDegrees)>90||Math.abs(longitudeDegrees)>180)throw new RangeError('GEODETIC_OUT_OF_RANGE');
  const lat=latitudeDegrees*PI/180,lon=longitudeDegrees*PI/180,f=GCR2_METRIC_FRAME;
  const c=Math.cos(lat)*Math.cos(lon),e=Math.cos(lat)*Math.sin(lon),u=Math.sin(lat);
  return Object.freeze(f.meridian.map((v,i)=>c*v+e*f.east[i]+u*f.northAxis[i]));
}
export function continentalKmToGeodetic(xKm,zKm){
  return directionToGeodetic(directionFromContinentalKm(xKm,zKm));
}
export function regionalMetersToGeodetic(xMeters,zMeters){
  const p=regionalMetersToContinentalKm(xMeters,zMeters);
  return continentalKmToGeodetic(p.xKm,p.zKm);
}
export function geodeticToRegionalMeters(lat,lon){
  const p=continentalKmFromDirection(geodeticToDirection(lat,lon));
  return continentalKmToRegionalMeters(p.xKm,p.zKm);
}
export function globeWorldPoint(xKm,zKm,elevationMeters=0){
  n(elevationMeters,'ELEVATION_METERS');
  const d=directionFromContinentalKm(xKm,zKm),r=GCR2_METRIC_FRAME.planetRadiusKm+elevationMeters/1000;
  if(r<=0)throw new RangeError('ELEVATION_OUT_OF_RANGE');
  return Object.freeze([d[0]*r, d[1]*r-GCR2_METRIC_FRAME.planetRadiusKm, d[2]*r]);
}
export const GCR2_ANCHORS=Object.freeze([
  Object.freeze({id:'GRATITUDE_CENTER',xMeters:0,zMeters:-128}),
  Object.freeze({id:'FOUR_TREE_GROVE',xMeters:-139,zMeters:-216}),
  Object.freeze({id:'FOOTHILL_SHOULDER',xMeters:-52,zMeters:-208}),
  Object.freeze({id:'FOOTHILL_WEST',xMeters:18,zMeters:-226}),
  Object.freeze({id:'CAVERN_SITE_B',xMeters:40,zMeters:-260}),
  Object.freeze({id:'FAR_RAVINE',xMeters:-272,zMeters:-544})
]);
