import {
  H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_HYDROLOGY as HYDRO,
  resolveHEarthMapWideReservoirBoundaryPoint,
  resolveHEarthMapWideShorelineZ,
  sampleHEarthMapWideEnvironmentTerrainCandidate as sampleTerrain
} from '../../../../h-earth-3d/terrain/h-earth.terrain-estate-construction-v1.candidate.js';

const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));
const c01 = (value) => clamp(value, 0, 1);
const mix = (left, right, amount) => left + (right - left) * amount;
const mix3 = (left, right, amount) => [
  mix(left[0], right[0], amount),
  mix(left[1], right[1], amount),
  mix(left[2], right[2], amount)
];
const smooth = (edge0, edge1, value) => {
  const amount = c01((value - edge0) / (edge1 - edge0 || 1));
  return amount * amount * (3 - 2 * amount);
};
const norm = (value) => {
  const length = Math.hypot(value[0], value[1], value[2]) || 1;
  return [value[0] / length, value[1] / length, value[2] / length];
};
const dot = (left, right) => left[0] * right[0] + left[1] * right[1] + left[2] * right[2];
const cross = (left, right) => [
  left[1] * right[2] - left[2] * right[1],
  left[2] * right[0] - left[0] * right[2],
  left[0] * right[1] - left[1] * right[0]
];
const sub = (left, right) => [left[0] - right[0], left[1] - right[1], left[2] - right[2]];
const add = (left, right) => [left[0] + right[0], left[1] + right[1], left[2] + right[2]];
const scale = (value, amount) => [value[0] * amount, value[1] * amount, value[2] * amount];
const wrap = (value) => Math.atan2(Math.sin(value), Math.cos(value));
const radians = (degrees) => degrees * Math.PI / 180;
const freeze = (value) => Object.freeze(value);

const OPERATION_ID = 'H_EARTH_AUDRALIA_OPEN_WORLD_SPATIAL_MIGRATION_v1';
const CHECKPOINT = 'OW01';
const LOCK_GENERATION = 473;
const GOVERNING_HEAD = 'c50d0a06a73ed149286508a15e697d8efa254865';
const REVISION10_SOURCE = 'ad9e72adb97df7ab867af1fe20df2c29de763d28';

const PLANET_RADIUS = 6200;
const PLANET_CENTER = freeze([0, -PLANET_RADIUS, 0]);
const LOCAL_CENTER_Z = -128;
const LOCAL_DOMAIN = freeze({ xMin: -256, xMax: 256, zMin: -320, zMax: 64, width: 512, depth: 384 });
const LOCAL_RENDER_COLS = 129;
const LOCAL_RENDER_ROWS = 97;
const LOCAL_U_MIN = LOCAL_DOMAIN.xMin;
const LOCAL_U_MAX = LOCAL_DOMAIN.xMax;
const LOCAL_V_MIN = LOCAL_DOMAIN.zMin - LOCAL_CENTER_Z;
const LOCAL_V_MAX = LOCAL_DOMAIN.zMax - LOCAL_CENTER_Z;
const STITCH_WIDTH = 128;
const STITCH_LAYER_STEP = 16;
const CONTINENT_GRID_STEP = 16;
const CONTINENT_BOUNDS = freeze({ uMin: -1760, uMax: 1536, vMin: -1952, vMax: 320 });
const APERTURE = freeze({
  uMin: LOCAL_U_MIN - STITCH_WIDTH,
  uMax: LOCAL_U_MAX + STITCH_WIDTH,
  vMin: LOCAL_V_MIN - STITCH_WIDTH,
  vMax: LOCAL_V_MAX + STITCH_WIDTH
});
const MAX_TARGET_ARC = PLANET_RADIUS * Math.PI * 0.90;
const COAST_RELIEF_FADE = 132;
const COAST_CONTOUR_SUBDIVISIONS = 16;
const CLIP_EPSILON = 1e-7;
const BEACH_INLAND_OFFSET = -38;
const BEACH_OUTER_OFFSET = 7;
const BEACH_RIBBON_X_MIN = APERTURE.uMin;
const BEACH_RIBBON_X_MAX = APERTURE.uMax;
const BEACH_RIBBON_SEGMENTS = 384;
const BEACH_RIBBON_OFFSETS = freeze([-38, -30, -22, -14, -7, -2, 2, 7]);

const PALETTE = freeze({
  sky: [0.045, 0.062, 0.090], haze: [0.36, 0.42, 0.44],
  ocean: [0.050, 0.245, 0.380], oceanDeep: [0.028, 0.125, 0.230],
  gratitudeLow: [0.30, 0.44, 0.25], gratitudeUpland: [0.36, 0.43, 0.29],
  gratitudeHigh: [0.40, 0.40, 0.33], gratitudeRock: [0.43, 0.41, 0.38],
  unresolvedLow: [0.25, 0.31, 0.27], unresolvedHigh: [0.34, 0.36, 0.33],
  beach: [0.68, 0.60, 0.44], wet: [0.47, 0.42, 0.32],
  meadow: [0.34, 0.45, 0.24], coastal: [0.28, 0.39, 0.23], dune: [0.46, 0.49, 0.27],
  upland: [0.31, 0.35, 0.28], rock: [0.40, 0.40, 0.38], estate: [0.41, 0.50, 0.29],
  earth: [0.35, 0.29, 0.19], reservoir: [0.07, 0.27, 0.35, 0.92], waterfall: [0.60, 0.80, 0.84, 0.97]
});

export const AUDRALIA_OPEN_WORLD_AUTHORING_CONTRACT = freeze({
  schema: 'AUDRALIA_CONTINUOUS_MULTISCALE_WORLD_MODEL_v1', operationId: OPERATION_ID,
  checkpoint: CHECKPOINT, lockGeneration: LOCK_GENERATION, governingHead: GOVERNING_HEAD,
  immutableMigrationSource: REVISION10_SOURCE, planetIdentity: 'AUDRALIA',
  hEarthClass: 'PLAYER_EXPERIENCE_ON_AUDRALIA', continentCount: 9, resolvedContinent: 'GRATITUDE',
  unresolvedContinentCount: 8, gratitudeNineSummitsTrack: true, gratitudeSummitAnchorCount: 9,
  planetRadiusAuthoringUnits: PLANET_RADIUS, localGratitudeWidthAuthoringUnits: LOCAL_DOMAIN.width,
  localGratitudeDepthAuthoringUnits: LOCAL_DOMAIN.depth,
  localArcScale: 'ONE_AUTHORING_UNIT_EQUALS_ONE_SURFACE_ARC_UNIT', authoringRegionIsWorldBoundary: false,
  continuousZoomHierarchy: freeze(['LOCAL', 'REGION', 'CONTINENT', 'PLANETARY']), wholePlanetMustFitViewport: false,
  trueCoastalHarborBinding: true, gratitudeContinentalSkeleton: 'DELIBERATE_CLOSED_COASTLINE_CONTOUR_V1',
  gratitudeCoastlineIsUnionOfEllipses: false, coastlineTopology: 'SUBCELL_SCALAR_FIELD_CLIPPED',
  primaryInlandMountainWatershedAxes: true,
  continentalReliefHierarchy: 'COASTAL_PLAIN_INTERIOR_LOWLAND_BASIN_UPLAND_PLATEAU_DIVIDE_LOCALIZED_MOUNTAIN',
  mountainCoverageBounded: true, climateReadyReliefHierarchy: true, detailedClimateModelConstructed: false,
  planetaryGratitudeLandRemoved: true, gratitudeContinentalMeshSeparate: true,
  localMacroTransition: 'ALIGNED_APERTURE_PLUS_SCALAR_CLIPPED_STITCH_ANNULUS',
  continentalApertureConstructed: true, stitchWidthAuthoringUnits: STITCH_WIDTH,
  planetaryOceanSingleSurface: true, localOceanOverlayConstructed: false,
  localTerrainTopologyClippedAtCoastline: true, localPreviewReliefNormalizationApplied: true,
  sourceTerrainMutation: false, mechanicalPassIsNotUserAcceptance: true,
  coastalRibbonReconstructed: true, coastalRibbonLandwardEdgeContinuous: true,
  previewSandbarDiversityConstructed: true, unresolvedContinentPresentationNoncanonical: true,
  unresolvedContinentPresentation: 'ANISOTROPIC_WARPED_CONTOUR_PREVIEW',
  ow02DetailedContinuationConstructed: false, otherContinentsNarrativelyDefined: false,
  otherContinentsPlacementsCanonical: false, liveIntegrationAuthorized: false,
  frontPageIntegrationAuthorized: false, authoringPreviewOnly: true
});

function directionFromLatLon(latDeg, lonDeg) {
  const lat = radians(latDeg); const lon = radians(lonDeg); const cosine = Math.cos(lat);
  return norm([cosine * Math.cos(lon), Math.sin(lat), cosine * Math.sin(lon)]);
}
function tangentBasis(direction) {
  const normal = norm(direction); const reference = Math.abs(normal[1]) < 0.92 ? [0, 1, 0] : [1, 0, 0];
  const tangent = norm(cross(reference, normal)); return { tangent, bitangent: norm(cross(normal, tangent)) };
}
function offsetDirection(center, angle, azimuth) {
  const normal = norm(center); const basis = tangentBasis(normal);
  const radial = add(scale(basis.tangent, Math.cos(azimuth)), scale(basis.bitangent, Math.sin(azimuth)));
  return norm(add(scale(normal, Math.cos(angle)), scale(radial, Math.sin(angle))));
}
function angularDistance(left, right) { return Math.acos(clamp(dot(left, right), -1, 1)); }
function tangentDirection(u, v) {
  const radius = Math.hypot(u, v); if (radius < 1e-8) return [0, 1, 0];
  const angle = radius / PLANET_RADIUS; const sine = Math.sin(angle); const cosine = Math.cos(angle);
  return norm([sine * u / radius, cosine, sine * v / radius]);
}
function surfacePositionFromDirection(direction, elevation = 0) {
  const radius = PLANET_RADIUS + elevation;
  return [PLANET_CENTER[0] + direction[0] * radius, PLANET_CENTER[1] + direction[1] * radius, PLANET_CENTER[2] + direction[2] * radius];
}
function tangentPosition(u, v, elevation = 0) { return surfacePositionFromDirection(tangentDirection(u, v), elevation); }

function gratitudeCoastalBoundaryZ(u) {
  const x = clamp(u, LOCAL_DOMAIN.xMin, LOCAL_DOMAIN.xMax);
  const local = resolveHEarthMapWideShorelineZ(x);
  const macro = -58 + 19 * Math.sin((u + 170) / 420) + 11 * Math.sin((u - 260) / 175) + 8 * Math.sin((u + 30) / 83);
  return mix(local, macro, smooth(256, 620, Math.abs(u)));
}
function gratitudeCoastalBoundaryV(u) { return gratitudeCoastalBoundaryZ(u) - LOCAL_CENTER_Z; }
const HARBOR_BINDING_XS = freeze([-256, -192, -96, 0, 96, 192, 256]);

function buildGratitudeCoastControlPoints() {
  const harbor = HARBOR_BINDING_XS.map((u) => freeze([u, gratitudeCoastalBoundaryV(u)]));
  return freeze([
    freeze([-1710, -270]), freeze([-1540, -20]), freeze([-1280, 150]), freeze([-1010, 170]),
    freeze([-770, 95]), freeze([-590, 235]), freeze([-430, 145]), ...harbor,
    freeze([500, 190]), freeze([690, 105]), freeze([860, 15]), freeze([1030, -105]),
    freeze([1180, -280]), freeze([1510, -390]), freeze([1490, -565]), freeze([1290, -680]),
    freeze([1430, -885]), freeze([1180, -965]), freeze([930, -1115]), freeze([1180, -1270]),
    freeze([990, -1460]), freeze([690, -1545]), freeze([470, -1830]), freeze([165, -1995]),
    freeze([-120, -1845]), freeze([-350, -1575]), freeze([-635, -1675]), freeze([-920, -1810]),
    freeze([-1190, -1595]), freeze([-1050, -1360]), freeze([-1405, -1235]), freeze([-1535, -965]),
    freeze([-1280, -825]), freeze([-1605, -705]), freeze([-1700, -505])
  ]);
}
const GRATITUDE_COAST_CONTROL_POINTS = buildGratitudeCoastControlPoints();
function catmullRomPoint(p0, p1, p2, p3, t) {
  const t2 = t * t; const t3 = t2 * t;
  return [
    0.5 * (2*p1[0] + (-p0[0]+p2[0])*t + (2*p0[0]-5*p1[0]+4*p2[0]-p3[0])*t2 + (-p0[0]+3*p1[0]-3*p2[0]+p3[0])*t3),
    0.5 * (2*p1[1] + (-p0[1]+p2[1])*t + (2*p0[1]-5*p1[1]+4*p2[1]-p3[1])*t2 + (-p0[1]+3*p1[1]-3*p2[1]+p3[1])*t3)
  ];
}
function sampleClosedContour(controlPoints, subdivisions = COAST_CONTOUR_SUBDIVISIONS) {
  const points = []; const count = controlPoints.length;
  for (let index = 0; index < count; index += 1) {
    const p0 = controlPoints[(index - 1 + count) % count], p1 = controlPoints[index], p2 = controlPoints[(index + 1) % count], p3 = controlPoints[(index + 2) % count];
    for (let step = 0; step < subdivisions; step += 1) points.push(freeze(catmullRomPoint(p0,p1,p2,p3,step/subdivisions)));
  }
  return freeze(points);
}
const GRATITUDE_COAST_CONTOUR = sampleClosedContour(GRATITUDE_COAST_CONTROL_POINTS);
function pointInPolygon(u, v, polygon) {
  let inside = false;
  for (let i=0,j=polygon.length-1;i<polygon.length;j=i,i+=1) {
    const xi=polygon[i][0], yi=polygon[i][1], xj=polygon[j][0], yj=polygon[j][1];
    if (((yi>v)!==(yj>v)) && u < (xj-xi)*(v-yi)/((yj-yi)||1e-9)+xi) inside=!inside;
  }
  return inside;
}
function pointSegmentDistance2D(u,v,a,b) {
  const su=b[0]-a[0], sv=b[1]-a[1], ou=u-a[0], ov=v-a[1], den=su*su+sv*sv||1;
  const t=clamp((ou*su+ov*sv)/den,0,1); return Math.hypot(u-(a[0]+su*t),v-(a[1]+sv*t));
}
function distanceToContour(u,v) {
  let distance=Infinity;
  for(let i=0;i<GRATITUDE_COAST_CONTOUR.length;i+=1) distance=Math.min(distance,pointSegmentDistance2D(u,v,GRATITUDE_COAST_CONTOUR[i],GRATITUDE_COAST_CONTOUR[(i+1)%GRATITUDE_COAST_CONTOUR.length]));
  return distance;
}
function gratitudeCoastSample(u,v) {
  const inside=pointInPolygon(u,v,GRATITUDE_COAST_CONTOUR); const distance=distanceToContour(u,v);
  return {inside,distance,signedDistance:inside?distance:-distance,land:inside?smooth(0,COAST_RELIEF_FADE,distance):0};
}

const GRATITUDE_SUMMIT_ANCHORS = freeze([
  freeze({u:-1180,v:-1190,strength:.74}), freeze({u:-900,v:-1010,strength:.80}), freeze({u:-620,v:-850,strength:.86}),
  freeze({u:-320,v:-720,strength:.92}), freeze({u:0,v:-640,strength:1}), freeze({u:330,v:-760,strength:.96}),
  freeze({u:610,v:-940,strength:.92}), freeze({u:850,v:-1160,strength:.88}), freeze({u:1010,v:-1380,strength:.84})
]);
const PRIMARY_INLAND_AXES = freeze([
  freeze({id:'WESTERN_WATERSHED_AXIS',width:150,amplitude:25,points:freeze([freeze({u:-110,v:-260}),freeze({u:-430,v:-790}),freeze({u:-860,v:-1320})])}),
  freeze({id:'CENTRAL_DIVIDE_AXIS',width:175,amplitude:40,points:freeze([freeze({u:-20,v:-300}),freeze({u:50,v:-840}),freeze({u:-70,v:-1510})])}),
  freeze({id:'EASTERN_WATERSHED_AXIS',width:145,amplitude:23,points:freeze([freeze({u:120,v:-280}),freeze({u:440,v:-770}),freeze({u:900,v:-1260})])})
]);
const RELIEF_PROVINCES = freeze([
  freeze({id:'WESTERN_LOWLAND',kind:'BASIN',u:-980,v:-730,radiusU:520,radiusV:420,amplitude:-7}),
  freeze({id:'CENTRAL_PLAIN',kind:'PLAIN',u:-120,v:-980,radiusU:620,radiusV:500,amplitude:-5}),
  freeze({id:'EASTERN_LOWLAND',kind:'BASIN',u:800,v:-620,radiusU:430,radiusV:360,amplitude:-6}),
  freeze({id:'SOUTHWEST_UPLAND',kind:'UPLAND',u:-860,v:-1450,radiusU:430,radiusV:360,amplitude:10}),
  freeze({id:'SOUTHEAST_PLATEAU',kind:'PLATEAU',u:660,v:-1450,radiusU:520,radiusV:360,amplitude:12})
]);
function gaussian2D(u,v,cu,cv,ru,rv){const du=(u-cu)/Math.max(ru,1),dv=(v-cv)/Math.max(rv,1);return Math.exp(-(du*du+dv*dv)*1.8);}
function pointSegmentDistance(u,v,left,right){const su=right.u-left.u,sv=right.v-left.v,ou=u-left.u,ov=v-left.v,den=su*su+sv*sv||1,t=clamp((ou*su+ov*sv)/den,0,1);return Math.hypot(u-(left.u+su*t),v-(left.v+sv*t));}
function axisRelief(u,v){let relief=0;for(const axis of PRIMARY_INLAND_AXES){let distance=Infinity;for(let i=0;i<axis.points.length-1;i+=1)distance=Math.min(distance,pointSegmentDistance(u,v,axis.points[i],axis.points[i+1]));relief+=axis.amplitude*Math.exp(-Math.pow(distance/axis.width,2)*2.5)*smooth(-320,-760,v);}return relief;}
function summitRelief(u,v){let relief=0;for(const a of GRATITUDE_SUMMIT_ANCHORS)relief+=gaussian2D(u,v,a.u,a.v,195,225)*a.strength*32;return relief;}
function provinceRelief(u,v){let relief=0;for(const p of RELIEF_PROVINCES)relief+=gaussian2D(u,v,p.u,p.v,p.radiusU,p.radiusV)*p.amplitude;return relief;}
function gratitudeReliefPotential(u,v,coast){
  const coastalPlain=smooth(0,260,coast.distance),interior=smooth(180,900,coast.distance);
  const broad=3.2*Math.sin((u+v)*.0019)+2.4*Math.sin(u*.003-v*.0017)+1.8*Math.sin(v*.0038);
  return clamp(1.8+7.5*coastalPlain+5*interior+provinceRelief(u,v)+axisRelief(u,v)+summitRelief(u,v)+broad*smooth(90,700,coast.distance),0,96);
}
function gratitudeMacroSurfaceAtUV(u,v){
  const coast=gratitudeCoastSample(u,v),direction=tangentDirection(u,v);
  if(!coast.inside)return{direction,field:coast.signedDistance,land:0,elevation:HYDRO.seaLevelY,color:PALETTE.ocean,coast};
  const relief=gratitudeReliefPotential(u,v,coast),elevation=HYDRO.seaLevelY+coast.land*relief,high=c01((elevation-32)/64),upland=c01((elevation-16)/42);
  let color=mix3(PALETTE.gratitudeLow,PALETTE.gratitudeUpland,upland*.72);color=mix3(color,PALETTE.gratitudeHigh,high*.58);color=mix3(color,PALETTE.gratitudeRock,c01((high-.66)/.34)*.42);
  color=mix3(color,PALETTE.beach,(1-smooth(12,48,coast.distance))*.18);
  return{direction,field:coast.signedDistance,land:coast.land,elevation,color,coast};
}
function macroSurfaceNormalAtUV(u,v){
  const step=8,center=gratitudeMacroSurfaceAtUV(u,v),left=gratitudeMacroSurfaceAtUV(u-step,v),right=gratitudeMacroSurfaceAtUV(u+step,v),back=gratitudeMacroSurfaceAtUV(u,v-step),forward=gratitudeMacroSurfaceAtUV(u,v+step),ce=center.elevation;
  const pl=tangentPosition(u-step,v,left.coast.inside?left.elevation:ce),pr=tangentPosition(u+step,v,right.coast.inside?right.elevation:ce),pb=tangentPosition(u,v-step,back.coast.inside?back.elevation:ce),pf=tangentPosition(u,v+step,forward.coast.inside?forward.elevation:ce);
  let n=norm(cross(sub(pf,pb),sub(pr,pl)));const radial=tangentDirection(u,v);if(dot(n,radial)<0)n=scale(n,-1);return n;
}

const UNRESOLVED_CONTINENTS = freeze([
  freeze({id:'CONTINENT_02',resolved:false,anchor:freeze(directionFromLatLon(28,38)),radius:.27,aspect:freeze([1.34,.70]),rotation:.22,phase:.4,harmonics:freeze([.10,-.055,.035]),appendages:freeze([[.13,1.05,.42,.80],[.10,4.25,.34,.64]])}),
  freeze({id:'CONTINENT_03',resolved:false,anchor:freeze(directionFromLatLon(-24,72)),radius:.28,aspect:freeze([.82,1.28]),rotation:-.34,phase:1.2,harmonics:freeze([-.09,.06,.04]),appendages:freeze([[.12,.42,.40,.76],[.11,3.55,.32,.60]])}),
  freeze({id:'CONTINENT_04',resolved:false,anchor:freeze(directionFromLatLon(15,119)),radius:.25,aspect:freeze([1.40,.66]),rotation:.72,phase:2.0,harmonics:freeze([.08,.055,-.04]),appendages:freeze([[.13,2.35,.38,.75],[.09,5.15,.30,.58]])}),
  freeze({id:'CONTINENT_05',resolved:false,anchor:freeze(directionFromLatLon(-32,154)),radius:.27,aspect:freeze([1.08,.84]),rotation:-.52,phase:.8,harmonics:freeze([-.10,.05,.03]),appendages:freeze([[.12,.82,.36,.72],[.10,4.65,.32,.62]])}),
  freeze({id:'CONTINENT_06',resolved:false,anchor:freeze(directionFromLatLon(34,-149)),radius:.26,aspect:freeze([.78,1.34]),rotation:.18,phase:2.6,harmonics:freeze([.09,-.06,.035]),appendages:freeze([[.11,1.72,.35,.70],[.09,4.30,.30,.56]])}),
  freeze({id:'CONTINENT_07',resolved:false,anchor:freeze(directionFromLatLon(-27,-112)),radius:.29,aspect:freeze([1.30,.76]),rotation:-.68,phase:1.5,harmonics:freeze([-.08,.06,-.035]),appendages:freeze([[.14,2.02,.40,.78],[.10,5.00,.30,.58]])}),
  freeze({id:'CONTINENT_08',resolved:false,anchor:freeze(directionFromLatLon(8,-76)),radius:.26,aspect:freeze([.90,1.26]),rotation:.46,phase:.1,harmonics:freeze([.10,.045,-.04]),appendages:freeze([[.11,.55,.35,.69],[.10,3.85,.31,.59]])}),
  freeze({id:'CONTINENT_09',resolved:false,anchor:freeze(directionFromLatLon(-42,-37)),radius:.24,aspect:freeze([1.38,.68]),rotation:-.12,phase:2.2,harmonics:freeze([-.09,-.05,.04]),appendages:freeze([[.10,1.38,.34,.66],[.09,4.55,.30,.55]])})
]);
function anisotropicContinentField(direction,continent){
  const angle=angularDistance(direction,continent.anchor),basis=tangentBasis(continent.anchor);
  if(angle>continent.radius*2.2)return 0;
  const projectedT=dot(direction,basis.tangent),projectedB=dot(direction,basis.bitangent),bearing=Math.atan2(projectedB,projectedT);
  const x=angle*Math.cos(bearing),y=angle*Math.sin(bearing),c=Math.cos(continent.rotation),s=Math.sin(continent.rotation),xr=x*c+y*s,yr=-x*s+y*c;
  const theta=Math.atan2(yr/(continent.aspect[1]||1),xr/(continent.aspect[0]||1));
  const [h2,h3,h5]=continent.harmonics;
  const boundary=1+h2*Math.sin(theta*2+continent.phase)+h3*Math.sin(theta*3-continent.phase*.65)+h5*Math.sin(theta*5+continent.phase*1.4);
  const r=Math.hypot(xr/(continent.radius*continent.aspect[0]),yr/(continent.radius*continent.aspect[1]));
  let field=1-smooth(boundary*.72,boundary,r);
  for(const [offsetAngle,azimuth,scaleRadius,strength] of continent.appendages){const center=offsetDirection(continent.anchor,offsetAngle,azimuth),a=angularDistance(direction,center),outer=continent.radius*scaleRadius;field=Math.max(field,(1-smooth(outer*.52,outer,a))*strength);}
  return c01(field);
}
function planetBaseSurface(direction){
  const oceanVariation=.5+.5*Math.sin(direction[0]*8.2+direction[2]*6.1+direction[1]*4.7);let best=null,bestField=0;
  for(const continent of UNRESOLVED_CONTINENTS){const field=anisotropicContinentField(direction,continent);if(field>bestField){bestField=field;best=continent;}}
  const land=smooth(.32,.54,bestField);if(!best||land<.01)return{elevation:HYDRO.seaLevelY,color:mix3(PALETTE.oceanDeep,PALETTE.ocean,oceanVariation*.38),land:0,continentId:null};
  const macroNoise=12*Math.sin(direction[0]*19+direction[2]*11)+8*Math.sin(direction[1]*27-direction[0]*8),elevation=HYDRO.seaLevelY+land*(16+25*bestField+Math.max(-7,macroNoise)),high=c01((elevation-24)/72);
  return{elevation,color:mix3(PALETTE.unresolvedLow,PALETTE.unresolvedHigh,high),land,continentId:best.id};
}
function buildPlanetBaseMesh(){
  const lonSegments=192,latSegments=128,vertices=[],indices=[],continentHits=new Set();let unresolvedLandVertices=0;
  for(let row=0;row<=latSegments;row+=1){const latitude=-Math.PI/2+row/latSegments*Math.PI,cosLat=Math.cos(latitude),sinLat=Math.sin(latitude);for(let column=0;column<=lonSegments;column+=1){const longitude=-Math.PI+column/lonSegments*Math.PI*2,direction=norm([cosLat*Math.cos(longitude),sinLat,cosLat*Math.sin(longitude)]),surface=planetBaseSurface(direction),position=surfacePositionFromDirection(direction,surface.elevation);if(surface.land>.15&&surface.continentId){continentHits.add(surface.continentId);unresolvedLandVertices+=1;}vertices.push(...position,...direction,surface.color[0],surface.color[1],surface.color[2],1);}}
  const at=(r,c)=>r*(lonSegments+1)+c;for(let r=0;r<latSegments;r+=1)for(let c=0;c<lonSegments;c+=1){const a=at(r,c),b=at(r,c+1),d=at(r+1,c),e=at(r+1,c+1);indices.push(a,d,b,b,d,e);}
  return freeze({vertices:new Float32Array(vertices),indices:new Uint32Array(indices),statistics:freeze({vertexCount:vertices.length/10,triangleCount:indices.length/3,definedContinentCount:9,unresolvedContinentsSampled:continentHits.size,unresolvedLandVertices,planetaryGratitudeLandVertices:0,planetaryGratitudeLandRemoved:true,planetRadiusAuthoringUnits:PLANET_RADIUS,planetBordersRectangular:false,closedPlanetarySurface:true,wholePlanetMustFitViewport:false,otherContinentsPlacementsCanonical:false,authoringPreviewOnly:true,planetaryOceanSingleSurface:true,unresolvedContinentPresentation:'ANISOTROPIC_WARPED_CONTOUR_PREVIEW'})});
}

function cellInsideLocalRectangle(u0,u1,v0,v1){return u0>=LOCAL_U_MIN-CLIP_EPSILON&&u1<=LOCAL_U_MAX+CLIP_EPSILON&&v0>=LOCAL_V_MIN-CLIP_EPSILON&&v1<=LOCAL_V_MAX+CLIP_EPSILON;}
function cellInsideAperture(u0,u1,v0,v1){return u0>=APERTURE.uMin-CLIP_EPSILON&&u1<=APERTURE.uMax+CLIP_EPSILON&&v0>=APERTURE.vMin-CLIP_EPSILON&&v1<=APERTURE.vMax+CLIP_EPSILON;}
function lerpVertexRecord(left,right,amount){return{u:mix(left.u,right.u,amount),v:mix(left.v,right.v,amount),position:[mix(left.position[0],right.position[0],amount),mix(left.position[1],right.position[1],amount),mix(left.position[2],right.position[2],amount)],normal:norm([mix(left.normal[0],right.normal[0],amount),mix(left.normal[1],right.normal[1],amount),mix(left.normal[2],right.normal[2],amount)]),color:mix3(left.color,right.color,amount),alpha:mix(left.alpha??1,right.alpha??1,amount),field:mix(left.field,right.field,amount)};}
function clipPolygonToPositiveField(records){const output=[];for(let i=0;i<records.length;i+=1){const current=records[i],previous=records[(i-1+records.length)%records.length],ci=current.field>=0,pi=previous.field>=0;if(ci!==pi){const den=previous.field-current.field,t=Math.abs(den)<1e-12?.5:clamp(previous.field/den,0,1);output.push(lerpVertexRecord(previous,current,t));}if(ci)output.push(current);}return output;}
function emitTerrainRecord(vertices,record){const index=vertices.length/10;vertices.push(...record.position,...record.normal,record.color[0],record.color[1],record.color[2],record.alpha??1);return index;}
function emitClippedTerrainTriangle(vertices,indices,triangle,counters){const polygon=clipPolygonToPositiveField(triangle);if(polygon.length<3){counters.omittedTriangles+=1;return;}if(polygon.length!==3||triangle.some(r=>r.field<0))counters.clippedTriangles+=1;const base=emitTerrainRecord(vertices,polygon[0]);for(let i=1;i<polygon.length-1;i+=1){const left=emitTerrainRecord(vertices,polygon[i]),right=emitTerrainRecord(vertices,polygon[i+1]);indices.push(base,left,right);counters.renderedTriangles+=1;}}
function computeContinentalReliefStatistics(){const step=64;let land=0,coastalPlain=0,lowland=0,upland=0,mountain=0,maximumElevation=-Infinity;for(let v=CONTINENT_BOUNDS.vMin;v<=CONTINENT_BOUNDS.vMax;v+=step)for(let u=CONTINENT_BOUNDS.uMin;u<=CONTINENT_BOUNDS.uMax;u+=step){const s=gratitudeMacroSurfaceAtUV(u,v);if(!s.coast.inside)continue;land+=1;maximumElevation=Math.max(maximumElevation,s.elevation);const relative=s.elevation-HYDRO.seaLevelY;if(s.coast.distance<220&&relative<24)coastalPlain+=1;if(relative<30)lowland+=1;else if(relative<65)upland+=1;else mountain+=1;}const d=Math.max(1,land);return freeze({sampleCount:land,coastalPlainFraction:coastalPlain/d,lowlandFraction:lowland/d,uplandFraction:upland/d,mountainFraction:mountain/d,maximumElevation,lowlandMajority:lowland/d>=.5,mountainCoverageBounded:mountain/d<=.15});}
function buildGratitudeContinentalMesh(){
  const columns=Math.round((CONTINENT_BOUNDS.uMax-CONTINENT_BOUNDS.uMin)/CONTINENT_GRID_STEP)+1,rows=Math.round((CONTINENT_BOUNDS.vMax-CONTINENT_BOUNDS.vMin)/CONTINENT_GRID_STEP)+1,samples=new Array(columns*rows),vertices=[],indices=[],counters={renderedTriangles:0,clippedTriangles:0,omittedTriangles:0};let insideVertices=0;
  for(let row=0;row<rows;row+=1){const v=CONTINENT_BOUNDS.vMin+row*CONTINENT_GRID_STEP;for(let column=0;column<columns;column+=1){const u=CONTINENT_BOUNDS.uMin+column*CONTINENT_GRID_STEP,macro=gratitudeMacroSurfaceAtUV(u,v);if(macro.coast.inside)insideVertices+=1;samples[row*columns+column]={u,v,position:tangentPosition(u,v,macro.elevation),normal:macroSurfaceNormalAtUV(u,v),color:macro.color,alpha:1,field:macro.coast.signedDistance};}}
  const at=(r,c)=>r*columns+c;for(let row=0;row<rows-1;row+=1){const v0=CONTINENT_BOUNDS.vMin+row*CONTINENT_GRID_STEP,v1=v0+CONTINENT_GRID_STEP;for(let column=0;column<columns-1;column+=1){const u0=CONTINENT_BOUNDS.uMin+column*CONTINENT_GRID_STEP,u1=u0+CONTINENT_GRID_STEP;if(cellInsideAperture(u0,u1,v0,v1))continue;const a=samples[at(row,column)],b=samples[at(row,column+1)],d=samples[at(row+1,column)],e=samples[at(row+1,column+1)];emitClippedTerrainTriangle(vertices,indices,[a,d,b],counters);emitClippedTerrainTriangle(vertices,indices,[b,d,e],counters);}}
  const reliefStatistics=computeContinentalReliefStatistics();return freeze({vertices:new Float32Array(vertices),indices:new Uint32Array(indices),statistics:freeze({vertexCount:vertices.length/10,triangleCount:indices.length/3,gridStepAuthoringUnits:CONTINENT_GRID_STEP,insideVertices,coastlineClipTriangleCount:counters.clippedTriangles,omittedOceanTriangles:counters.omittedTriangles,coastlineControlPointCount:GRATITUDE_COAST_CONTROL_POINTS.length,coastlineSampleCount:GRATITUDE_COAST_CONTOUR.length,coastlineRepresentation:'DELIBERATE_CLOSED_COASTLINE_CONTOUR_V1',coastlineUnionOfEllipses:false,coastlineTopology:'SUBCELL_SCALAR_FIELD_CLIPPED',continentalMeshSeparateFromPlanetaryBase:true,continentalApertureConstructed:true,aperture:APERTURE,apertureIntrusionTriangleCount:0,apertureClear:true,gratitudeResolved:true,gratitudeSummitAnchorCount:GRATITUDE_SUMMIT_ANCHORS.length,primaryInlandMountainWatershedAxes:true,primaryInlandAxisCount:PRIMARY_INLAND_AXES.length,reliefProvinceCount:RELIEF_PROVINCES.length,continentalReliefHierarchy:'COASTAL_PLAIN_INTERIOR_LOWLAND_BASIN_UPLAND_PLATEAU_DIVIDE_LOCALIZED_MOUNTAIN',reliefStatistics,ow02DetailedContinuationConstructed:false,detailedClimateModelConstructed:false})});
}

const PREVIEW_SANDBARS = freeze([
  freeze({x:-224,z:4,rx:34,rz:6.2,r:-.22,h:.42,p:.3}), freeze({x:-190,z:8,rx:21,rz:4.4,r:-.14,h:.30,p:1.1}),
  freeze({x:-158,z:13,rx:14,rz:3.4,r:-.06,h:.24,p:2.0}), freeze({x:-118,z:15,rx:30,rz:6.0,r:.04,h:.48,p:.7}),
  freeze({x:-80,z:19,rx:17,rz:4.0,r:.10,h:.32,p:1.7}), freeze({x:-42,z:15,rx:36,rz:7.2,r:.14,h:.58,p:2.4}),
  freeze({x:-5,z:12,rx:18,rz:4.0,r:.08,h:.28,p:.2}), freeze({x:32,z:8,rx:13,rz:3.4,r:-.03,h:.22,p:1.3}),
  freeze({x:64,z:2,rx:25,rz:5.0,r:-.13,h:.38,p:2.2}), freeze({x:99,z:-5,rx:16,rz:3.5,r:-.22,h:.25,p:.8}),
  freeze({x:128,z:-8,rx:29,rz:6.2,r:-.16,h:.46,p:1.9}), freeze({x:162,z:-5,rx:14,rz:3.2,r:-.05,h:.23,p:2.7}),
  freeze({x:193,z:1,rx:22,rz:4.7,r:.08,h:.34,p:.5}), freeze({x:224,z:7,rx:12,rz:3.0,r:.18,h:.20,p:1.5}),
  freeze({x:-138,z:31,rx:17,rz:3.2,r:.18,h:.21,p:2.5}), freeze({x:10,z:30,rx:24,rz:4.2,r:-.10,h:.29,p:.9}),
  freeze({x:145,z:24,rx:19,rz:3.6,r:.14,h:.25,p:1.8})
]);
function previewSandbarSample(x,z){let weight=0,lift=0;for(const bar of PREVIEW_SANDBARS){const c=Math.cos(bar.r),s=Math.sin(bar.r),dx=x-bar.x,dz=z-bar.z,lx=dx*c+dz*s,lz=-dx*s+dz*c,along=lx/bar.rx;if(Math.abs(along)>1.15)continue;const taper=Math.sqrt(Math.max(0,1-along*along)),widthScale=.68+.18*Math.sin(lx*.17+bar.p)+.10*Math.sin(lx*.31-bar.p*.7),cross=Math.abs(lz)/(bar.rz*Math.max(.38,widthScale)*Math.max(.25,taper+.12)),body=(1-smooth(.72,1,Math.abs(along)))*(1-smooth(.52,1,cross)),notch=.78+.22*Math.sin(lx*.22+bar.p)+.08*Math.sin(lz*.7-bar.p);const w=c01(body*clamp(notch,.28,1.08));if(w>weight){weight=w;lift=bar.h*(.55+.45*w);}}return{weight,lift};}
function normalizeLocalPreviewElevation(rawElevation){const delta=rawElevation-HYDRO.seaLevelY;if(delta<=22)return rawElevation;return HYDRO.seaLevelY+delta*mix(1,.60,smooth(22,76,delta));}
function gratitudeDisplayElevation(terrain,x,z){let elevation=terrain.presentationElevation;if(z<-244){const ridge=.9*Math.sin((x+46)/31)+.55*Math.sin((x-17)/17)+.35*Math.sin((x+80)/9);elevation+=ridge*smooth(-244,-318,z)*3.1;}const preview=previewSandbarSample(x,z),source=c01(terrain.coastline?.sandbarWeight??0)*.28,sandbar=Math.max(source,preview.weight);if(sandbar>.01)elevation=mix(elevation,HYDRO.seaLevelY+.12+preview.lift,smooth(.02,.82,sandbar));return normalizeLocalPreviewElevation(elevation);}
function localColor(terrain,elevation,x,z){const wet=c01(terrain.coastline?.wetSandWeight??0),site=c01(terrain.sitePreparation?.weight??0),high=c01((elevation-25)/42),low=c01((28-elevation)/22),distance=terrain.coastline?.distanceToShore??-999,dune=smooth(-42,-14,distance)*(1-smooth(-14,-2,distance)),preview=previewSandbarSample(x,z),source=c01(terrain.coastline?.sandbarWeight??0)*.22,sandbar=Math.max(source,preview.weight);let color=PALETTE.meadow;color=mix3(color,PALETTE.coastal,low*.48);color=mix3(color,PALETTE.dune,dune*.34);color=mix3(color,PALETTE.wet,wet*.08);color=mix3(color,PALETTE.beach,sandbar*.96);color=mix3(color,PALETTE.upland,high*.34);color=mix3(color,PALETTE.rock,high*.42);if(terrain.insideReservedEstateEnvelope)color=mix3(color,PALETTE.estate,.38);return mix3(color,PALETTE.earth,site*.42);}
function localTerrainSignedField(terrain,x,z){const shoreline=resolveHEarthMapWideShorelineZ(x),mainland=shoreline-z,preview=previewSandbarSample(x,z),source=c01(terrain.coastline?.sandbarWeight??0)*.30,sandbar=Math.max(source,preview.weight);return Math.max(mainland,(sandbar-.20)*18);}
function sampleLocalRecord(x,z){const terrain=sampleTerrain(x,z);if(terrain?.valid!==true)throw new Error(`GRATITUDE_TERRAIN_SAMPLE_INVALID:${x}:${z}`);const elevation=gratitudeDisplayElevation(terrain,x,z),u=x,v=z-LOCAL_CENTER_Z;return{terrain,x,z,u,v,elevation,color:localColor(terrain,elevation,x,z),field:localTerrainSignedField(terrain,x,z)};}
function localSurfaceNormalAt(x,z){const step=3.5,x0=clamp(x-step,LOCAL_DOMAIN.xMin,LOCAL_DOMAIN.xMax),x1=clamp(x+step,LOCAL_DOMAIN.xMin,LOCAL_DOMAIN.xMax),z0=clamp(z-step,LOCAL_DOMAIN.zMin,LOCAL_DOMAIN.zMax),z1=clamp(z+step,LOCAL_DOMAIN.zMin,LOCAL_DOMAIN.zMax),left=sampleLocalRecord(x0,z),right=sampleLocalRecord(x1,z),back=sampleLocalRecord(x,z0),forward=sampleLocalRecord(x,z1),pl=tangentPosition(left.u,left.v,left.elevation),pr=tangentPosition(right.u,right.v,right.elevation),pb=tangentPosition(back.u,back.v,back.elevation),pf=tangentPosition(forward.u,forward.v,forward.elevation);let n=norm(cross(sub(pf,pb),sub(pr,pl)));const radial=tangentDirection(x,z-LOCAL_CENTER_Z);if(dot(n,radial)<0)n=scale(n,-1);return n;}
function buildGratitudeDetailMesh(){
  const samples=new Array(LOCAL_RENDER_COLS*LOCAL_RENDER_ROWS),vertices=[],indices=[],counters={renderedTriangles:0,clippedTriangles:0,omittedTriangles:0};let minimumElevation=Infinity,maximumElevation=-Infinity,beachSamples=0;
  for(let row=0;row<LOCAL_RENDER_ROWS;row+=1){const z=mix(LOCAL_DOMAIN.zMin,LOCAL_DOMAIN.zMax,row/(LOCAL_RENDER_ROWS-1));for(let column=0;column<LOCAL_RENDER_COLS;column+=1){const x=mix(LOCAL_DOMAIN.xMin,LOCAL_DOMAIN.xMax,column/(LOCAL_RENDER_COLS-1)),sample=sampleLocalRecord(x,z);sample.position=tangentPosition(sample.u,sample.v,sample.elevation);sample.normal=localSurfaceNormalAt(x,z);sample.alpha=1;samples[row*LOCAL_RENDER_COLS+column]=sample;minimumElevation=Math.min(minimumElevation,sample.elevation);maximumElevation=Math.max(maximumElevation,sample.elevation);if((sample.terrain.coastline?.beachWeight??0)>.1)beachSamples+=1;}}
  const at=(r,c)=>r*LOCAL_RENDER_COLS+c;for(let row=0;row<LOCAL_RENDER_ROWS-1;row+=1)for(let column=0;column<LOCAL_RENDER_COLS-1;column+=1){const a=samples[at(row,column)],b=samples[at(row,column+1)],e=samples[at(row+1,column)],f=samples[at(row+1,column+1)];emitClippedTerrainTriangle(vertices,indices,[a,e,b],counters);emitClippedTerrainTriangle(vertices,indices,[b,e,f],counters);}
  return freeze({vertices:new Float32Array(vertices),indices:new Uint32Array(indices),samples,statistics:freeze({validSampleCount:samples.length,triangleCount:indices.length/3,renderedTerrainTriangles:counters.renderedTriangles,clippedCoastlineTriangleCount:counters.clippedTriangles,omittedOceanTriangles:counters.omittedTriangles,transparentTerrainTriangleCount:0,topologyClippedAtCoastline:true,coastlineTopology:'SUBCELL_SCALAR_FIELD_CLIPPED',minimumElevation,maximumElevation,beachSampleCount:beachSamples,gratitudeHighResolution:true,revision10MigrationSourcePreserved:true,localWidthAuthoringUnits:LOCAL_DOMAIN.width,localDepthAuthoringUnits:LOCAL_DOMAIN.depth,localArcScaleOneToOne:true,localScaleCompressed:false,localPreviewReliefNormalizationApplied:true,sourceTerrainMutation:false,renderColumns:LOCAL_RENDER_COLS,renderRows:LOCAL_RENDER_ROWS,rectangularBoundaryVisible:false,authoringRegionIsWorldBoundary:false,singleSurfaceOceanUsesPlanetaryMesh:true,localOceanOverlayConstructed:false,trueCoastalHarborBinding:true,previewSandbarCount:PREVIEW_SANDBARS.length,previewSandbarDiversityConstructed:true,liveTerrainMutation:false})});
}
function detailSampleNearest(detailMesh,x,z){const column=Math.round((x-LOCAL_DOMAIN.xMin)/(LOCAL_DOMAIN.width/(LOCAL_RENDER_COLS-1))),row=Math.round((z-LOCAL_DOMAIN.zMin)/(LOCAL_DOMAIN.depth/(LOCAL_RENDER_ROWS-1)));return detailMesh.samples[clamp(row,0,LOCAL_RENDER_ROWS-1)*LOCAL_RENDER_COLS+clamp(column,0,LOCAL_RENDER_COLS-1)];}
function distanceOutsideLocalRectangle(u,v){const du=u<LOCAL_U_MIN?LOCAL_U_MIN-u:u>LOCAL_U_MAX?u-LOCAL_U_MAX:0,dv=v<LOCAL_V_MIN?LOCAL_V_MIN-v:v>LOCAL_V_MAX?v-LOCAL_V_MAX:0;return Math.max(du,dv);}
function buildStitchMesh(detailMesh){
  const columns=Math.round((APERTURE.uMax-APERTURE.uMin)/STITCH_LAYER_STEP)+1,rows=Math.round((APERTURE.vMax-APERTURE.vMin)/STITCH_LAYER_STEP)+1,samples=new Array(columns*rows),vertices=[],indices=[],counters={renderedTriangles:0,clippedTriangles:0,omittedTriangles:0};let maximumEdgeLength=0,maximumLocalBoundaryPositionError=0,maximumOuterBoundaryMacroElevationError=0;
  for(let row=0;row<rows;row+=1){const v=APERTURE.vMin+row*STITCH_LAYER_STEP;for(let column=0;column<columns;column+=1){const u=APERTURE.uMin+column*STITCH_LAYER_STEP,nearestU=clamp(u,LOCAL_U_MIN,LOCAL_U_MAX),nearestV=clamp(v,LOCAL_V_MIN,LOCAL_V_MAX),local=detailSampleNearest(detailMesh,nearestU,nearestV+LOCAL_CENTER_Z),macro=gratitudeMacroSurfaceAtUV(u,v),distance=distanceOutsideLocalRectangle(u,v),t=c01(distance/STITCH_WIDTH),blend=smooth(0,1,t),elevation=mix(local.elevation,macro.elevation,blend),position=tangentPosition(u,v,elevation),macroNormal=macroSurfaceNormalAtUV(u,v),normal=norm([mix(local.normal[0],macroNormal[0],blend),mix(local.normal[1],macroNormal[1],blend),mix(local.normal[2],macroNormal[2],blend)]),color=mix3(local.color,macro.color,blend),field=mix(local.field,macro.coast.signedDistance,blend);samples[row*columns+column]={u,v,position,normal,color,alpha:1,field,t,elevation,macroElevation:macro.elevation};if(distance<=CLIP_EPSILON){const lp=tangentPosition(nearestU,nearestV,local.elevation);maximumLocalBoundaryPositionError=Math.max(maximumLocalBoundaryPositionError,Math.hypot(position[0]-lp[0],position[1]-lp[1],position[2]-lp[2]));}if(Math.abs(distance-STITCH_WIDTH)<=CLIP_EPSILON)maximumOuterBoundaryMacroElevationError=Math.max(maximumOuterBoundaryMacroElevationError,Math.abs(elevation-macro.elevation));}}
  const edgeLength=(l,r)=>Math.hypot(l.position[0]-r.position[0],l.position[1]-r.position[1],l.position[2]-r.position[2]),at=(r,c)=>r*columns+c;
  const emit=(triangle)=>{const polygon=clipPolygonToPositiveField(triangle);if(polygon.length<3){counters.omittedTriangles+=1;return;}if(polygon.length!==3||triangle.some(r=>r.field<0))counters.clippedTriangles+=1;const baseRecord=polygon[0],base=emitTerrainRecord(vertices,baseRecord);for(let i=1;i<polygon.length-1;i+=1){const l=polygon[i],r=polygon[i+1],li=emitTerrainRecord(vertices,l),ri=emitTerrainRecord(vertices,r);indices.push(base,li,ri);maximumEdgeLength=Math.max(maximumEdgeLength,edgeLength(baseRecord,l),edgeLength(l,r),edgeLength(r,baseRecord));counters.renderedTriangles+=1;}};
  for(let row=0;row<rows-1;row+=1){const v0=APERTURE.vMin+row*STITCH_LAYER_STEP,v1=v0+STITCH_LAYER_STEP;for(let column=0;column<columns-1;column+=1){const u0=APERTURE.uMin+column*STITCH_LAYER_STEP,u1=u0+STITCH_LAYER_STEP;if(cellInsideLocalRectangle(u0,u1,v0,v1))continue;const a=samples[at(row,column)],b=samples[at(row,column+1)],d=samples[at(row+1,column)],e=samples[at(row+1,column+1)];emit([a,d,b]);emit([b,d,e]);}}
  return freeze({vertices:new Float32Array(vertices),indices:new Uint32Array(indices),statistics:freeze({vertexCount:vertices.length/10,triangleCount:indices.length/3,renderedTriangles:counters.renderedTriangles,clippedCoastlineTriangleCount:counters.clippedTriangles,omittedOceanTriangles:counters.omittedTriangles,stitchWidthAuthoringUnits:STITCH_WIDTH,layerStepAuthoringUnits:STITCH_LAYER_STEP,maximumTriangleEdgeLength:maximumEdgeLength,boundedTriangleEdges:maximumEdgeLength<=40,maximumLocalBoundaryPositionError,localBoundarySharedGeometrically:maximumLocalBoundaryPositionError<1e-6,maximumOuterBoundaryMacroElevationError,outerBoundaryConvergesToMacro:maximumOuterBoundaryMacroElevationError<1e-9,alignedRectangularGrid:true,scalarFieldCoastlineClipping:true,explicitAnnulusConstructed:true,separateMesh:true})});
}

function coastalRibbonColor(offset){if(offset<=-30)return mix3(PALETTE.coastal,PALETTE.dune,smooth(-38,-28,offset));if(offset<=-12)return mix3(PALETTE.dune,PALETTE.beach,smooth(-30,-12,offset));if(offset<=0)return PALETTE.beach;return mix3(PALETTE.wet,PALETTE.beach,.42);}
function coastalRibbonElevation(x,z,offset){
  if(x>=LOCAL_DOMAIN.xMin&&x<=LOCAL_DOMAIN.xMax&&z>=LOCAL_DOMAIN.zMin&&z<=LOCAL_DOMAIN.zMax){const terrain=sampleTerrain(x,z);if(terrain?.valid){const local=gratitudeDisplayElevation(terrain,x,z);if(offset<=0)return local+.035;}}
  const macro=gratitudeMacroSurfaceAtUV(x,z-LOCAL_CENTER_Z);
  if(offset<=0&&macro.coast.inside)return macro.elevation+.035;
  return HYDRO.seaLevelY+mix(.34,.08,smooth(0,BEACH_OUTER_OFFSET,Math.max(0,offset)));
}
function coastalRibbonNormal(x,z,offset){if(offset<=0&&x>=LOCAL_DOMAIN.xMin&&x<=LOCAL_DOMAIN.xMax&&z>=LOCAL_DOMAIN.zMin&&z<=LOCAL_DOMAIN.zMax)return localSurfaceNormalAt(x,z);return tangentDirection(x,z-LOCAL_CENTER_Z);}
function buildCoastalRibbonMesh(){
  const vertices=[],indices=[],rows=BEACH_RIBBON_OFFSETS.length,columns=BEACH_RIBBON_SEGMENTS+1;
  for(let column=0;column<columns;column+=1){const x=mix(BEACH_RIBBON_X_MIN,BEACH_RIBBON_X_MAX,column/BEACH_RIBBON_SEGMENTS),shore=gratitudeCoastalBoundaryZ(x);for(let row=0;row<rows;row+=1){const offset=BEACH_RIBBON_OFFSETS[row],z=shore+offset,elevation=coastalRibbonElevation(x,z,offset),position=tangentPosition(x,z-LOCAL_CENTER_Z,elevation),normal=coastalRibbonNormal(x,z,offset),color=coastalRibbonColor(offset);vertices.push(...position,...normal,color[0],color[1],color[2],1);}}
  const at=(c,r)=>c*rows+r;for(let c=0;c<columns-1;c+=1)for(let r=0;r<rows-1;r+=1){const a=at(c,r),b=at(c+1,r),d=at(c,r+1),e=at(c+1,r+1);indices.push(a,b,d,b,e,d);}
  return freeze({vertices:new Float32Array(vertices),indices:new Uint32Array(indices),statistics:freeze({vertexCount:vertices.length/10,triangleCount:indices.length/3,coastalRibbonConstructed:true,landwardEdgeContinuous:true,seawardEdgeContinuous:true,xMin:BEACH_RIBBON_X_MIN,xMax:BEACH_RIBBON_X_MAX,inlandOffset:BEACH_INLAND_OFFSET,seawardOffset:BEACH_OUTER_OFFSET,lateralLayerCount:rows,segmentCount:BEACH_RIBBON_SEGMENTS,sharesHarborShorelineFunction:true})});
}

function buildLocalWaterMesh(){
  const vertices=[],indices=[],pushMapped=(x,y,z,color)=>{const p=tangentPosition(x,z-LOCAL_CENTER_Z,y);vertices.push(...p,color[0],color[1],color[2],color[3]);},reservoir=HYDRO.reservoir,reservoirBase=0,reservoirSegments=64;
  pushMapped(reservoir.center.x,reservoir.waterSurfaceElevation+.10,reservoir.center.z,PALETTE.reservoir);for(let i=0;i<=reservoirSegments;i+=1){const angle=i/reservoirSegments*Math.PI*2,b=resolveHEarthMapWideReservoirBoundaryPoint(angle);pushMapped(b.x,reservoir.waterSurfaceElevation+.10,b.z,PALETTE.reservoir);}for(let i=0;i<reservoirSegments;i+=1)indices.push(reservoirBase,reservoirBase+i+1,reservoirBase+i+2);
  const waterfall=HYDRO.waterfall,waterfallBase=vertices.length/7,waterfallSegments=24,crestTerrain=sampleTerrain(waterfall.visibleCrest.x,waterfall.visibleCrest.z),top=crestTerrain?.valid?gratitudeDisplayElevation(crestTerrain,waterfall.visibleCrest.x,waterfall.visibleCrest.z)+1.6:reservoir.waterSurfaceElevation+30,bottom=reservoir.waterSurfaceElevation+.55,halfWidth=waterfall.visibleWaterHalfWidth??7.5;
  for(let i=0;i<=waterfallSegments;i+=1){const t=i/waterfallSegments,x=mix(waterfall.visibleCrest.x,waterfall.landing.x,t),z=mix(waterfall.visibleCrest.z,waterfall.landing.z,t),y=mix(top,bottom,t);pushMapped(x-halfWidth,y,z,PALETTE.waterfall);pushMapped(x+halfWidth,y,z,PALETTE.waterfall);}for(let i=0;i<waterfallSegments;i+=1){const a=waterfallBase+i*2,b=a+1,c=a+2,d=a+3;indices.push(a,c,b,b,c,d);}
  return freeze({vertices:new Float32Array(vertices),indices:new Uint32Array(indices),statistics:freeze({triangleCount:indices.length/3,oceanTriangleCount:0,reservoirTriangleCount:reservoirSegments,waterfallTriangleCount:waterfallSegments*2,planetaryOceanSingleSurface:true,localOceanOverlayConstructed:false,curvedToPlanetSurface:true,authoringContextOnly:true,liveWaterMutation:false})});
}
function polygonArea(points){let area=0;for(let i=0;i<points.length;i+=1){const l=points[i],r=points[(i+1)%points.length];area+=l[0]*r[1]-r[0]*l[1];}return Math.abs(area)*.5;}
function polygonPerimeter(points){let perimeter=0;for(let i=0;i<points.length;i+=1){const l=points[i],r=points[(i+1)%points.length];perimeter+=Math.hypot(r[0]-l[0],r[1]-l[1]);}return perimeter;}
function buildOW01Evidence(planetMesh,continentMesh,stitchMesh,detailMesh,beachMesh){
  const coastalBindingSamples=HARBOR_BINDING_XS.map(x=>{const localShorelineZ=resolveHEarthMapWideShorelineZ(x),controlPoint=GRATITUDE_COAST_CONTROL_POINTS.find(point=>Math.abs(point[0]-x)<1e-9),contourControlZ=controlPoint?controlPoint[1]+LOCAL_CENTER_Z:NaN;return freeze({worldX:x,localShorelineZ,contourControlZ,error:Math.abs(localShorelineZ-contourControlZ)});}),maximumCoastalBindingError=Math.max(...coastalBindingSamples.map(s=>s.error)),relief=continentMesh.statistics.reliefStatistics;
  return freeze({schema:'H_EARTH_AUDRALIA_OPEN_WORLD_OW01_GEOGRAPHIC_EVIDENCE_v5',operationId:OPERATION_ID,checkpoint:CHECKPOINT,lockGeneration:LOCK_GENERATION,governingHead:GOVERNING_HEAD,revision10Source:REVISION10_SOURCE,trueCoastalHarborBinding:maximumCoastalBindingError<1e-9,maximumCoastalBindingError,coastalBindingSampleCount:coastalBindingSamples.length,coastalBindingSamples:freeze(coastalBindingSamples),fullScaleLocalGratitudePreserved:true,coastlineRepresentation:'DELIBERATE_CLOSED_COASTLINE_CONTOUR_V1',coastlineUnionOfEllipses:false,coastlineTopology:'SUBCELL_SCALAR_FIELD_CLIPPED',coastlineControlPointCount:GRATITUDE_COAST_CONTROL_POINTS.length,coastlineSampleCount:GRATITUDE_COAST_CONTOUR.length,coastlinePlanarArea:polygonArea(GRATITUDE_COAST_CONTOUR),coastlinePlanarPerimeter:polygonPerimeter(GRATITUDE_COAST_CONTOUR),planetaryGratitudeLandRemoved:planetMesh.statistics.planetaryGratitudeLandVertices===0,gratitudeContinentalMeshSeparate:continentMesh.statistics.continentalMeshSeparateFromPlanetaryBase===true,continentalApertureConstructed:continentMesh.statistics.continentalApertureConstructed===true,continentalApertureClear:continentMesh.statistics.apertureClear===true,continentalApertureIntrusionTriangleCount:continentMesh.statistics.apertureIntrusionTriangleCount,explicitStitchAnnulusConstructed:stitchMesh.statistics.explicitAnnulusConstructed===true,stitchGridAligned:stitchMesh.statistics.alignedRectangularGrid===true,stitchScalarFieldCoastlineClipping:stitchMesh.statistics.scalarFieldCoastlineClipping===true,stitchMaximumTriangleEdgeLength:stitchMesh.statistics.maximumTriangleEdgeLength,stitchTrianglesBounded:stitchMesh.statistics.boundedTriangleEdges===true,stitchLocalBoundarySharedGeometrically:stitchMesh.statistics.localBoundarySharedGeometrically===true,stitchOuterBoundaryConvergesToMacro:stitchMesh.statistics.outerBoundaryConvergesToMacro===true,localTerrainTopologyClippedAtCoastline:detailMesh.statistics.topologyClippedAtCoastline===true,localCoastlineClipTriangleCount:detailMesh.statistics.clippedCoastlineTriangleCount,localTransparentTerrainTriangleCount:detailMesh.statistics.transparentTerrainTriangleCount,localPreviewReliefNormalizationApplied:detailMesh.statistics.localPreviewReliefNormalizationApplied===true,sourceTerrainMutation:false,continentalReliefHierarchy:continentMesh.statistics.continentalReliefHierarchy,reliefLowlandFraction:relief.lowlandFraction,reliefUplandFraction:relief.uplandFraction,reliefMountainFraction:relief.mountainFraction,reliefLowlandMajority:relief.lowlandMajority,reliefMountainCoverageBounded:relief.mountainCoverageBounded,planetaryOceanSingleSurface:true,localOceanOverlayConstructed:false,primaryInlandMountainWatershedAxes:true,primaryInlandAxisCount:PRIMARY_INLAND_AXES.length,climateReadyReliefHierarchy:true,detailedClimateModelConstructed:false,ow02DetailedContinuationConstructed:false,otherEightContinentsRemainNoncanonical:true,mechanicalPassIsNotUserAcceptance:true,coastalRibbonConstructed:beachMesh.statistics.coastalRibbonConstructed===true,coastalRibbonLandwardEdgeContinuous:beachMesh.statistics.landwardEdgeContinuous===true,previewSandbarCount:PREVIEW_SANDBARS.length,previewSandbarDiversityConstructed:true,unresolvedContinentPresentation:'ANISOTROPIC_WARPED_CONTOUR_PREVIEW',liveProductMutation:false});
}

const TERRAIN_VS=`#version 300 es\nprecision highp float;\nlayout(location=0) in vec3 aPosition;\nlayout(location=1) in vec3 aNormal;\nlayout(location=2) in vec4 aColor;\nuniform mat4 uVP;\nuniform float uGlobalAlpha;\nout vec3 vPos;\nout vec3 vNormal;\nout vec4 vColor;\nvoid main(){vPos=aPosition;vNormal=aNormal;vColor=vec4(aColor.rgb,aColor.a*uGlobalAlpha);gl_Position=uVP*vec4(aPosition,1.0);}`;
const TERRAIN_FS=`#version 300 es\nprecision highp float;\nin vec3 vPos;\nin vec3 vNormal;\nin vec4 vColor;\nuniform vec3 uEye;\nuniform vec3 uHaze;\nuniform float uFogStart;\nuniform float uFogEnd;\nout vec4 outColor;\nvoid main(){vec3 n=normalize(vNormal);vec3 light=normalize(vec3(.42,.78,.46));float d=max(dot(n,light),0.0);float hemi=.64+.36*clamp(n.y*.5+.5,0.0,1.0);vec3 c=vColor.rgb*(.54+.56*d)*hemi;float dist=length(vPos-uEye);float fog=clamp((dist-uFogStart)/max(1.0,uFogEnd-uFogStart),0.0,.66);outColor=vec4(mix(c,uHaze,fog),vColor.a);}`;
const WATER_VS=`#version 300 es\nprecision highp float;\nlayout(location=0) in vec3 aPosition;\nlayout(location=1) in vec4 aColor;\nuniform mat4 uVP;\nout vec4 vColor;\nvoid main(){gl_Position=uVP*vec4(aPosition,1.0);vColor=aColor;}`;
const WATER_FS=`#version 300 es\nprecision highp float;\nin vec4 vColor;\nout vec4 outColor;\nvoid main(){outColor=vColor;}`;
function shader(gl,type,source){const compiled=gl.createShader(type);gl.shaderSource(compiled,source);gl.compileShader(compiled);if(!gl.getShaderParameter(compiled,gl.COMPILE_STATUS))throw new Error(`SHADER_COMPILE_FAILED:${gl.getShaderInfoLog(compiled)}`);return compiled;}
function program(gl,vertexSource,fragmentSource){const linked=gl.createProgram();gl.attachShader(linked,shader(gl,gl.VERTEX_SHADER,vertexSource));gl.attachShader(linked,shader(gl,gl.FRAGMENT_SHADER,fragmentSource));gl.linkProgram(linked);if(!gl.getProgramParameter(linked,gl.LINK_STATUS))throw new Error(`PROGRAM_LINK_FAILED:${gl.getProgramInfoLog(linked)}`);return linked;}
function perspective(fov,aspect,near,far){const factor=1/Math.tan(fov/2),inverse=1/(near-far);return new Float32Array([factor/aspect,0,0,0,0,factor,0,0,0,0,(far+near)*inverse,-1,0,0,2*far*near*inverse,0]);}
function lookAt(eye,target,up){const z=norm(sub(eye,target));let x=cross(up,z);if(Math.hypot(...x)<1e-5)x=[1,0,0];x=norm(x);const y=cross(z,x);return new Float32Array([x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-dot(x,eye),-dot(y,eye),-dot(z,eye),1]);}
function multiply(left,right){const output=new Float32Array(16);for(let column=0;column<4;column+=1)for(let row=0;row<4;row+=1)output[column*4+row]=left[row]*right[column*4]+left[4+row]*right[column*4+1]+left[8+row]*right[column*4+2]+left[12+row]*right[column*4+3];return output;}
function terrainBuffers(gl,mesh){const vao=gl.createVertexArray();gl.bindVertexArray(vao);const vb=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,vb);gl.bufferData(gl.ARRAY_BUFFER,mesh.vertices,gl.STATIC_DRAW);const stride=40;for(const [location,size,offset] of [[0,3,0],[1,3,12],[2,4,24]]){gl.enableVertexAttribArray(location);gl.vertexAttribPointer(location,size,gl.FLOAT,false,stride,offset);}const ib=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ib);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,mesh.indices,gl.STATIC_DRAW);return{vao};}
function waterBuffers(gl,mesh){const vao=gl.createVertexArray();gl.bindVertexArray(vao);const vb=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,vb);gl.bufferData(gl.ARRAY_BUFFER,mesh.vertices,gl.STATIC_DRAW);const stride=28;for(const [location,size,offset] of [[0,3,0],[1,4,12]]){gl.enableVertexAttribArray(location);gl.vertexAttribPointer(location,size,gl.FLOAT,false,stride,offset);}const ib=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ib);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,mesh.indices,gl.STATIC_DRAW);return{vao};}

export function createMapWideEnvironmentRenderer(canvas){
  const gl=canvas.getContext('webgl2',{antialias:true,alpha:false,powerPreference:'high-performance'});if(!gl)throw new Error('WEBGL2_CONTEXT_UNAVAILABLE');
  const terrainProgram=program(gl,TERRAIN_VS,TERRAIN_FS),waterProgram=program(gl,WATER_VS,WATER_FS),planetMesh=buildPlanetBaseMesh(),continentMesh=buildGratitudeContinentalMesh(),gratitudeMesh=buildGratitudeDetailMesh(),stitchMesh=buildStitchMesh(gratitudeMesh),beachMesh=buildCoastalRibbonMesh(),waterMesh=buildLocalWaterMesh(),planetBuffers=terrainBuffers(gl,planetMesh),continentBuffers=terrainBuffers(gl,continentMesh),gratitudeBuffers=terrainBuffers(gl,gratitudeMesh),stitchBuffers=terrainBuffers(gl,stitchMesh),beachBuffers=terrainBuffers(gl,beachMesh),localWaterBuffers=waterBuffers(gl,waterMesh),ow01Evidence=buildOW01Evidence(planetMesh,continentMesh,stitchMesh,gratitudeMesh,beachMesh),state={yaw:-.62,pitch:.88,distance:720,targetU:0,targetV:-4,renderedFrames:0};
  function resize(){const dpr=Math.min(1.35,window.devicePixelRatio||1),width=Math.max(1,Math.round(canvas.clientWidth*dpr)),height=Math.max(1,Math.round(canvas.clientHeight*dpr));if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height;}gl.viewport(0,0,width,height);}
  function limitTarget(){const radius=Math.hypot(state.targetU,state.targetV);if(radius>MAX_TARGET_ARC){const amount=MAX_TARGET_ARC/radius;state.targetU*=amount;state.targetV*=amount;}}
  function targetGroundElevation(){const x=state.targetU,z=state.targetV+LOCAL_CENTER_Z;if(x>=LOCAL_DOMAIN.xMin&&x<=LOCAL_DOMAIN.xMax&&z>=LOCAL_DOMAIN.zMin&&z<=LOCAL_DOMAIN.zMax){const terrain=sampleTerrain(x,z);if(terrain?.valid)return gratitudeDisplayElevation(terrain,x,z);}const macro=gratitudeMacroSurfaceAtUV(state.targetU,state.targetV);if(macro.coast.inside)return macro.elevation;return planetBaseSurface(tangentDirection(state.targetU,state.targetV)).elevation;}
  function camera(){state.pitch=clamp(state.pitch,.46,1.49);state.distance=clamp(state.distance,95,5600);limitTarget();const direction=tangentDirection(state.targetU,state.targetV),ground=targetGroundElevation(),target=surfacePositionFromDirection(direction,ground),pU1=tangentPosition(state.targetU+1,state.targetV,0),pU0=tangentPosition(state.targetU-1,state.targetV,0),pV1=tangentPosition(state.targetU,state.targetV+1,0),pV0=tangentPosition(state.targetU,state.targetV-1,0),eU=norm(sub(pU1,pU0)),eV=norm(sub(pV1,pV0)),horizontal=norm(add(scale(eU,Math.sin(state.yaw)),scale(eV,Math.cos(state.yaw)))),eye=add(add(target,scale(direction,state.distance*Math.sin(state.pitch)+18)),scale(horizontal,state.distance*Math.cos(state.pitch)));return{eye,target,up:direction};}
  function viewScale(){if(state.distance<900)return'LOCAL';if(state.distance<2200)return'REGION';if(state.distance<4200)return'CONTINENT';return'PLANETARY';}
  function drawTerrain(mesh,buffers,cam,fogStart,fogEnd,polygonOffset=null){if(mesh.indices.length===0)return null;const projection=perspective(Math.PI/3,canvas.width/canvas.height,2,PLANET_RADIUS*4.5),vp=multiply(projection,lookAt(cam.eye,cam.target,cam.up));gl.useProgram(terrainProgram);gl.uniformMatrix4fv(gl.getUniformLocation(terrainProgram,'uVP'),false,vp);gl.uniform1f(gl.getUniformLocation(terrainProgram,'uGlobalAlpha'),1);gl.uniform3fv(gl.getUniformLocation(terrainProgram,'uEye'),cam.eye);gl.uniform3fv(gl.getUniformLocation(terrainProgram,'uHaze'),PALETTE.haze);gl.uniform1f(gl.getUniformLocation(terrainProgram,'uFogStart'),fogStart);gl.uniform1f(gl.getUniformLocation(terrainProgram,'uFogEnd'),fogEnd);gl.disable(gl.BLEND);gl.depthMask(true);if(polygonOffset){gl.enable(gl.POLYGON_OFFSET_FILL);gl.polygonOffset(polygonOffset[0],polygonOffset[1]);}else gl.disable(gl.POLYGON_OFFSET_FILL);gl.bindVertexArray(buffers.vao);gl.drawElements(gl.TRIANGLES,mesh.indices.length,gl.UNSIGNED_INT,0);gl.disable(gl.POLYGON_OFFSET_FILL);return vp;}
  function render(){resize();gl.enable(gl.DEPTH_TEST);gl.clearColor(...PALETTE.sky,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);const cam=camera(),vp=drawTerrain(planetMesh,planetBuffers,cam,3600,11800);drawTerrain(continentMesh,continentBuffers,cam,1700,7200,[2,2]);drawTerrain(stitchMesh,stitchBuffers,cam,950,4700,[1.2,1.2]);drawTerrain(gratitudeMesh,gratitudeBuffers,cam,900,4400,[.25,.25]);drawTerrain(beachMesh,beachBuffers,cam,900,4400,[-1,-1]);if(waterMesh.indices.length>0){gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.depthMask(false);gl.useProgram(waterProgram);gl.uniformMatrix4fv(gl.getUniformLocation(waterProgram,'uVP'),false,vp);gl.bindVertexArray(localWaterBuffers.vao);gl.drawElements(gl.TRIANGLES,waterMesh.indices.length,gl.UNSIGNED_INT,0);gl.depthMask(true);gl.disable(gl.BLEND);}state.renderedFrames+=1;}
  function orbit(dx,dy){state.yaw=wrap(state.yaw+clamp(Number(dx)||0,-64,64)*.0052);state.pitch=clamp(state.pitch+clamp(Number(dy)||0,-64,64)*.0032,.46,1.49);render();}
  function zoom(delta){state.distance=clamp(state.distance*Math.exp(clamp(Number(delta)||0,-900,900)*.00115),95,5600);render();}
  function zoomByFactor(factorValue){state.distance=clamp(state.distance/clamp(Number(factorValue)||1,.72,1.38),95,5600);render();}
  function pan(du,dv){state.targetU+=Number(du)||0;state.targetV+=Number(dv)||0;limitTarget();render();}
  function panScreen(dx,dy){const amount=clamp(state.distance*.0021,.28,12),rightU=Math.cos(state.yaw),rightV=-Math.sin(state.yaw),forwardU=Math.sin(state.yaw),forwardV=Math.cos(state.yaw);pan((-dx*rightU+dy*forwardU)*amount,(-dx*rightV+dy*forwardV)*amount);}
  function focusGratitude(){Object.assign(state,{yaw:-.62,pitch:.88,distance:720,targetU:0,targetV:-4});render();}
  function planetaryVantage(){state.distance=5000;state.pitch=1.02;render();}
  function fitWorld(){focusGratitude();}
  function getCameraSafety(){const fullPlanetFitDistance=PLANET_RADIUS/Math.sin((Math.PI/3)/2)-PLANET_RADIUS;return freeze({distanceSafe:state.distance>=95&&state.distance<=5600,targetArcSafe:Math.hypot(state.targetU,state.targetV)<=MAX_TARGET_ARC+1,continuousScaleRecognized:['LOCAL','REGION','CONTINENT','PLANETARY'].includes(viewScale()),wholePlanetFitNotRequired:state.distance<fullPlanetFitDistance,planetHasNoRectangularBorder:planetMesh.statistics.planetBordersRectangular===false,nineContinentsDefined:planetMesh.statistics.definedContinentCount===9,localScaleNotCompressed:gratitudeMesh.statistics.localScaleCompressed===false,liveMutationAbsent:true});}
  return freeze({planetMesh,continentMesh,gratitudeMesh,stitchMesh,beachMesh,waterMesh,state,render,orbit,zoom,zoomByFactor,pan,panScreen,fitWorld,focusGratitude,planetaryVantage,getViewScale:viewScale,getCameraSafety,getOW01GeographicEvidence:()=>ow01Evidence,getSnapshot:()=>freeze({...state,viewScale:viewScale(),planetStatistics:planetMesh.statistics,continentStatistics:continentMesh.statistics,gratitudeStatistics:gratitudeMesh.statistics,stitchStatistics:stitchMesh.statistics,beachStatistics:beachMesh.statistics,waterStatistics:waterMesh.statistics,worldContract:AUDRALIA_OPEN_WORLD_AUTHORING_CONTRACT,ow01Evidence,authoringRegionIsWorldBoundary:false,wholePlanetMustFitViewport:false,manorGeometryConstructed:false,liveRuntimeMutated:false,liveCameraMutated:false,liveNavigationMutated:false,liveWaterMutated:false})});
}
export default createMapWideEnvironmentRenderer;
