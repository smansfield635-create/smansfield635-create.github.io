/**
 * Named Gratitude hydrology transcribed from protected rev5 geographic authority.
 * Macro-authoring coordinates are interpreted here as continental km only for
 * a candidate inspection. Widths are SOURCE AUTHORING UNITS, not measured river km.
 * No local H-Earth waterPresent or permanent-flow claim is created.
 */
export const HYDROLOGY_SOURCE=Object.freeze({
  contract:'AUDRALIA_GRATITUDE_GEOGRAPHIC_TRANSFER_AUTHORITY_v1',
  revision:5,
  path:'inspection/audralia-24057-exact/snapshot/h-earth-3d/integration/audralia.gratitude-geographic-transfer.v1.js',
  blob:'50991dd777ccd015fd8a6d8eae7b4d02b4a8450c',
  localRavineHasConfirmedPerennialWater:false,
  sourceWidthsArePhysicalKilometers:false
});
const sourceRivers=[
 ['GRATITUDE_MAJOR_THROUGH_RIVER',5,19,[[-420,-760],[-330,-880],[-250,-1010],[-150,-1140],[-20,-1270],[120,-1395],[250,-1510],[365,-1625],[430,-1770]]],
 ['WEST_FORK',4,12,[[-1050,-720],[-930,-790],[-810,-850],[-690,-880],[-560,-850],[-420,-760]]],
 ['WEST_TRIBUTARY_A',2,6,[[-1320,-910],[-1190,-870],[-1050,-720]]],
 ['WEST_TRIBUTARY_B',2,5,[[-1110,-520],[-1050,-610],[-1050,-720]]],
 ['WEST_TRIBUTARY_C',1,3.5,[[-880,-540],[-900,-680],[-930,-790]]],
 ['CENTRAL_HEADWATERS',4,11,[[-80,-500],[-120,-610],[-210,-700],[-320,-760],[-420,-760]]],
 ['CENTRAL_TRIBUTARY_A',2,5,[[190,-560],[120,-640],[-20,-680],[-210,-700]]],
 ['CENTRAL_TRIBUTARY_B',1,3.5,[[-340,-520],[-300,-610],[-210,-700]]],
 ['LAKE_OVERFLOW',4,10,[[360,-980],[250,-1050],[120,-1130],[-20,-1270]]],
 ['EASTERN_RIVER',4,12,[[1080,-720],[970,-820],[850,-930],[730,-1040],[600,-1140],[500,-1270],[480,-1420]]],
 ['EAST_TRIBUTARY_A',2,5,[[1270,-940],[1150,-930],[1030,-900],[850,-930]]],
 ['EAST_TRIBUTARY_B',2,5,[[880,-600],[900,-750],[970,-820]]],
 ['DELTA_BRANCH_WEST',3,9,[[430,-1770],[330,-1840],[220,-1910]]],
 ['DELTA_BRANCH_CENTRAL',3,10,[[430,-1770],[440,-1870],[470,-1980]]],
 ['DELTA_BRANCH_EAST',2,7,[[430,-1770],[560,-1840],[690,-1910]]]
];
export const GRATITUDE_RIVERS=Object.freeze(sourceRivers.map(([id,order,widthAuthoringUnits,points])=>
  Object.freeze({id,order,widthAuthoringUnits,points:Object.freeze(points.map(p=>Object.freeze([...p])))})));
export const GRATITUDE_LAKES=Object.freeze([
  Object.freeze({id:'GREAT_INTERIOR_LAKE',xKm:260,zKm:-1010,rxAuthoring:150,rzAuthoring:90,spill:Object.freeze([360,-980])}),
  Object.freeze({id:'SHIELD_LAKE',xKm:-760,zKm:-930,rxAuthoring:78,rzAuthoring:52,spill:Object.freeze([-690,-880])}),
  Object.freeze({id:'EASTERN_CIRQUE_LAKE',xKm:850,zKm:-930,rxAuthoring:62,rzAuthoring:40,spill:Object.freeze([850,-930])})
]);
const clamp=(x,a,b)=>Math.min(b,Math.max(a,x));
const smooth=(a,b,x)=>{const t=clamp((x-a)/((b-a)||1),0,1);return t*t*(3-2*t);};
export function distanceToPolylineKm(x,z,points){
  if(!Number.isFinite(x)||!Number.isFinite(z))throw new RangeError('HYDRO_POINT_NONFINITE');
  let min=Infinity;
  for(let i=0;i<points.length-1;i++){
    const [ax,az]=points[i],[bx,bz]=points[i+1],dx=bx-ax,dz=bz-az;
    const t=clamp(((x-ax)*dx+(z-az)*dz)/(dx*dx+dz*dz||1),0,1);
    min=Math.min(min,Math.hypot(x-(ax+t*dx),z-(az+t*dz)));
  }
  return min;
}
export function sampleGratitudeHydrology(xKm,zKm){
  if(!Number.isFinite(xKm)||!Number.isFinite(zKm))throw new RangeError('HYDRO_POINT_NONFINITE');
  let nearest=Infinity,riverIntensity=0,riverId=null,lakeIntensity=0,lakeId=null,lakeEdgeKm=Infinity;
  for(const river of GRATITUDE_RIVERS){
    const distanceKm=distanceToPolylineKm(xKm,zKm,river.points);
    if(distanceKm<nearest){nearest=distanceKm;riverId=river.id;}
    const visualHalfWidthKm=Math.max(2.4,river.widthAuthoringUnits*0.64);
    riverIntensity=Math.max(riverIntensity,1-smooth(visualHalfWidthKm,visualHalfWidthKm*2.6,distanceKm));
  }
  for(const lake of GRATITUDE_LAKES){
    const q=Math.hypot((xKm-lake.xKm)/lake.rxAuthoring,(zKm-lake.zKm)/lake.rzAuthoring);
    if(q<1){lakeId=lake.id;lakeIntensity=Math.max(lakeIntensity,1-smooth(0.76,1.04,q));}
    lakeEdgeKm=Math.min(lakeEdgeKm,Math.abs(q-1)*Math.min(lake.rxAuthoring,lake.rzAuthoring));
  }
  const wetlandIntensity=clamp(
    Math.max(lakeIntensity*.78,riverIntensity*.67)*.72+
    .32*Math.exp(-((xKm-320)**2/(650**2)+(zKm+1790)**2/(350**2)))*riverIntensity,
    0,1
  );
  return Object.freeze({
    nearestNamedRiver:riverId,
    nearestRiverKm:nearest,
    lakeId,
    lakeEdgeKm,
    riverRenderIntensity:riverIntensity,
    lakeRenderIntensity:lakeIntensity,
    wetlandSuitability:wetlandIntensity,
    continentalCompletedNetwork:true,
    regionalWaterPresenceAsserted:false,
    visualWaterWidthIsPhysical:false
  });
}
export function verifyNamedHydrology(){
  const ids=new Set(GRATITUDE_RIVERS.map(r=>r.id));
  if(ids.size!==15||GRATITUDE_LAKES.length!==3)return false;
  const byId=id=>GRATITUDE_RIVERS.find(r=>r.id===id);
  const endpoint=r=>r.points[r.points.length-1];
  const same=(a,b)=>a[0]===b[0]&&a[1]===b[1];
  if(!same(endpoint(byId('CENTRAL_HEADWATERS')),byId('GRATITUDE_MAJOR_THROUGH_RIVER').points[0]))return false;
  if(!same(endpoint(byId('WEST_FORK')),byId('GRATITUDE_MAJOR_THROUGH_RIVER').points[0]))return false;
  if(!same(endpoint(byId('LAKE_OVERFLOW')),byId('GRATITUDE_MAJOR_THROUGH_RIVER').points[4]))return false;
  return HYDROLOGY_SOURCE.localRavineHasConfirmedPerennialWater===false;
}
