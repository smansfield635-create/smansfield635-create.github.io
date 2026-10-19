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
/**
 * Derived, NON-AUTHORITATIVE southern delta shoreline for this isolated GCR2
 * inspection. Rev5 sources fix the three distinct delta branch endpoints,
 * but do not themselves fix a complete kilometer-scale delta coast polygon.
 * Interior coastal controls are candidate geometry, not protected rev5 facts.
 * The single connected landmass stays asymmetric with three river mouths.
 */
export const GRATITUDE_DELTA_SHORE_CONTROLS=Object.freeze([[890,-1460],[782,-1534],[764,-1625],[756,-1705],[748,-1780],[725,-1850],[690,-1910],[635,-1900],[580,-1900],[537,-1942],[470,-1980],[405,-1930],[342,-1915],[275,-1890],[220,-1910],[172,-1845],[112,-1785],[10,-1772]].map(
  ([x,z])=>Object.freeze([x,z])
));

/**
 * Derived eastern downstream reach, never part of the 15 named rev5 rivers.
 * The rev5 Eastern River stops at (480,-1420) without a declared outlet.
 * This modeled confluence joins an existing main-through-river vertex at
 * (365,-1625) through a bounded plausible lowland channel. It is an explicitly
 * unaccepted source-constrained hypothesis, NOT settled water or basin canon.
 */
export const GRATITUDE_EASTERN_CONFLUENCE_CANDIDATE=Object.freeze({
  id:'GCR2_EASTERN_OUTLET_TO_MAIN_RIVER_PROPOSAL',
  sourceEasternRiverId:'EASTERN_RIVER',
  receivingRiverId:'GRATITUDE_MAJOR_THROUGH_RIVER',
  provenance:'DERIVED_INSPECTION_PROPOSAL_NOT_PROTECTED_REV5_GEOGRAPHY',
  authoritativeSourceSegmentCountUnchanged:true,
  physicallyValidatedDischarge:false,
  sourceProvesPerennialWater:false,
  widthVisualUnits:5.2,
  points:Object.freeze([[480,-1420],[468,-1470],[431,-1517],[398,-1572],[365,-1625]].map(([x,z])=>Object.freeze([x,z])))
});

/** The lower southern boundary is a monotonic-x shoreline across the delta. */
export function candidateDeltaSouthShoreZ(xKm){
  if(!Number.isFinite(xKm))throw new RangeError('DELTA_X_NONFINITE');
  const coast=GRATITUDE_DELTA_SHORE_CONTROLS;
  if(xKm>coast[0][0]||xKm<coast[coast.length-1][0])return Number.NaN;
  for(let i=0;i<coast.length-1;i++){
    const a=coast[i],b=coast[i+1];
    if(xKm<=a[0]&&xKm>=b[0]){
      const t=(a[0]-xKm)/(a[0]-b[0]);
      return a[1]+(b[1]-a[1])*t;
    }
  }
  return Number.NaN;
}

export function verifyCandidateDeltaCoast(){
  const coast=GRATITUDE_DELTA_SHORE_CONTROLS;
  if(coast.some((point,i)=>!point.every(Number.isFinite)||
    (i&&point[0]>=coast[i-1][0])))return false;
  // Three rev5 mouths end at the candidate shoreline; all intermediate
  // distributary samples remain strictly on the land side of that boundary.
  const mouths=['DELTA_BRANCH_WEST','DELTA_BRANCH_CENTRAL','DELTA_BRANCH_EAST'];
  for(const id of mouths){
    const branch=GRATITUDE_RIVERS.find(r=>r.id===id);
    if(!branch||branch.points.length!==3)return false;
    for(let i=0;i<branch.points.length-1;i++){
      const a=branch.points[i],b=branch.points[i+1];
      for(let j=0;j<=60;j++){
        const t=j/60,x=a[0]+t*(b[0]-a[0]),z=a[1]+t*(b[1]-a[1]);
        const shore=candidateDeltaSouthShoreZ(x);
        if(!Number.isFinite(shore)||z<shore-1e-8)return false;
      }
    }
    const mouth=branch.points.at(-1);
    if(Math.abs(candidateDeltaSouthShoreZ(mouth[0])-mouth[1])>1e-9)return false;
  }
  return true;
}
export function verifyCandidateEasternConfluence(){
  const proposal=GRATITUDE_EASTERN_CONFLUENCE_CANDIDATE;
  const eastern=GRATITUDE_RIVERS.find(r=>r.id===proposal.sourceEasternRiverId);
  const receiving=GRATITUDE_RIVERS.find(r=>r.id===proposal.receivingRiverId);
  if(!eastern||!receiving||proposal.physicallyValidatedDischarge!==false||
    proposal.sourceProvesPerennialWater!==false||proposal.points.length<3)return false;
  const same=(a,b)=>a[0]===b[0]&&a[1]===b[1];
  if(!same(proposal.points[0],eastern.points.at(-1))||
    !receiving.points.some(p=>same(p,proposal.points.at(-1))))return false;
  // No new named river, lake, canonical source point, or river bifurcation.
  if(GRATITUDE_RIVERS.length!==15||GRATITUDE_LAKES.length!==3)return false;
  return proposal.points.every(p=>p.every(Number.isFinite));
}

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
  // Candidate eastern confluence is separate from the exact rev5 named graph.
  const eastCandidateDistance=distanceToPolylineKm(
    xKm,zKm,GRATITUDE_EASTERN_CONFLUENCE_CANDIDATE.points);
  const eastCandidateIntensity=1-smooth(4.0,12.0,eastCandidateDistance);
  riverIntensity=Math.max(riverIntensity,eastCandidateIntensity);
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
    continentalCompletedNetwork:false,
    rev5NamedRiverCount:GRATITUDE_RIVERS.length,
    easternConfluenceCandidateIntensity:eastCandidateIntensity,
    easternConfluenceIsSourceAuthority:false,
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
