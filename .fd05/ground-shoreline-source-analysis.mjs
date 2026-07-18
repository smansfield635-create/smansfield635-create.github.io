import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';

const outDir = '.fd05/ground-shoreline-prework-output';
await mkdir(outDir, { recursive: true });
const load = (p) => import(pathToFileURL(resolve(p)).href);

const paths = {
  preview: 'showroom/globe/h-earth/render/geometry-preview.js',
  ground: 'showroom/globe/h-earth/render/geometry-ground.js',
  environment: 'showroom/globe/h-earth/environment.js',
  objects: 'h-earth-3d/objects/ground-cell-001.objects.js',
  zones: 'h-earth-3d/zones/ground-cell-001.zones.js',
  lattice: 'h-earth-3d/zones/ground-cell-001.landscape-lattice.js',
  kernel: 'showroom/globe/h-earth/render/geometry-kernel.js',
  packet002: 'h-earth-3d/integration/h-earth.post-west-admitted-geometry-transfer.js',
  admittedFrame: 'showroom/globe/h-earth/admitted-geometry-frame.js',
  compositor: 'showroom/globe/h-earth/compositor.js',
  renderer: 'showroom/globe/h-earth/renderer.js'
};

const modules = Object.fromEntries(
  await Promise.all(Object.entries(paths).map(async ([id, p]) => [id, await load(p)]))
);

const preview = modules.preview.previewHEarthWetSandGeometry({
  sourceObjectId: 'OBJ_002_FOREGROUND_WET_SAND',
  requestedPurpose: 'WET_SAND_GEOMETRY_PREVIEW',
  requestId: 'FD05_GROUND_SHORELINE_PREWORK_SOURCE_ANALYSIS_001'
});

function walk(value, visitor, path = '$', depth = 0, seen = new WeakSet()) {
  if (depth > 12 || value === null || typeof value !== 'object') return;
  if (seen.has(value)) return;
  seen.add(value);
  visitor(value, path);
  if (Array.isArray(value)) {
    value.forEach((v, i) => walk(v, visitor, `${path}[${i}]`, depth + 1, seen));
  } else {
    Object.entries(value).forEach(([k, v]) => walk(v, visitor, `${path}.${k}`, depth + 1, seen));
  }
}

const geometryArrays = [];
walk(preview.primitives, (value, path) => {
  if (!Array.isArray(value) || value.length < 3) return;
  const vectors = value.every((v) => v && typeof v === 'object' && Number.isFinite(v.x) && Number.isFinite(v.y) && Number.isFinite(v.z));
  const flat = value.every(Number.isFinite) && value.length % 3 === 0 && /(position|vertex|vertices)/i.test(path);
  const indices = value.every(Number.isSafeInteger) && value.length % 3 === 0 && /(index|indices)/i.test(path);
  if (vectors) geometryArrays.push({ path, kind: 'VECTOR3_ARRAY', count: value.length, points: value.map(({x,y,z}) => ({x,y,z})) });
  if (flat) geometryArrays.push({ path, kind: 'FLAT_XYZ_ARRAY', count: value.length / 3, points: Array.from({length:value.length/3}, (_,i)=>({x:value[i*3],y:value[i*3+1],z:value[i*3+2]})) });
  if (indices) geometryArrays.push({ path, kind: 'INDEX_ARRAY', count: value.length, indices: [...value] });
});

const positionCandidates = geometryArrays.filter((a) => a.points).sort((a,b)=>b.count-a.count);
const indexCandidates = geometryArrays.filter((a) => a.indices).sort((a,b)=>b.count-a.count);
const positions = positionCandidates[0]?.points ?? [];
const indices = indexCandidates[0]?.indices ?? [];

function stats(points, triangleIndices) {
  if (!points.length) return null;
  const xs = points.map(p=>p.x), ys = points.map(p=>p.y), zs = points.map(p=>p.z);
  const min = (a)=>Math.min(...a), max=(a)=>Math.max(...a), mean=(a)=>a.reduce((s,v)=>s+v,0)/a.length;
  const bounds = {min:{x:min(xs),y:min(ys),z:min(zs)},max:{x:max(xs),y:max(ys),z:max(zs)}};
  const width=bounds.max.x-bounds.min.x, height=bounds.max.y-bounds.min.y, depth=bounds.max.z-bounds.min.z;
  const slopes=[]; const neighbors=Array.from({length:points.length},()=>new Set());
  for(let i=0;i+2<triangleIndices.length;i+=3){
    const tri=[triangleIndices[i],triangleIndices[i+1],triangleIndices[i+2]];
    for(let a=0;a<3;a++)for(let b=a+1;b<3;b++){
      const ia=tri[a], ib=tri[b]; if(!points[ia]||!points[ib]) continue;
      neighbors[ia].add(ib); neighbors[ib].add(ia);
      const pa=points[ia], pb=points[ib]; const horizontal=Math.hypot(pb.x-pa.x,pb.z-pa.z);
      if(horizontal>0) slopes.push(Math.abs(pb.y-pa.y)/horizontal);
    }
  }
  let depressions=0,ridges=0;
  neighbors.forEach((set,i)=>{ if(!set.size)return; const y=points[i].y; const ns=[...set].map(j=>points[j].y); if(ns.every(v=>y<v))depressions++; if(ns.every(v=>y>v))ridges++; });
  return {
    pointCount:points.length,indexCount:triangleIndices.length,triangleCount:Math.floor(triangleIndices.length/3),bounds,
    dimensions:{width,height,depth},meanElevation:mean(ys),heightRange:height,
    reliefToFootprintRatio: height/Math.max(width,depth,1e-12),
    meanAbsoluteSlope: slopes.length?mean(slopes):null,
    maximumAbsoluteSlope: slopes.length?max(slopes):null,
    localDepressionCount:depressions,localRidgeCount:ridges
  };
}

function compact(value, depth=0) {
  if (depth>4) return '[DEPTH_LIMIT]';
  if (value===null || typeof value!=='object') return typeof value==='string' && value.length>180 ? value.slice(0,180)+'…' : value;
  if (Array.isArray(value)) return value.slice(0,14).map(v=>compact(v,depth+1));
  return Object.fromEntries(Object.entries(value).slice(0,24).map(([k,v])=>[k,compact(v,depth+1)]));
}

const tokens = ['OBJ_002_FOREGROUND_WET_SAND','OBJ_003_DRY_SAND_TRANSITION','OBJ_004_TIDE_POOLS_AND_REFLECTIVE_PUDDLES','shore','foam','water','nearshore','wet sand','dry sand','tide'];
const adjacency=[];
for(const id of ['objects','zones','lattice','environment','ground']){
  walk(modules[id], (value,path)=>{
    let text=''; try{text=JSON.stringify(value);}catch{}
    const matches=tokens.filter(t=>text.toLowerCase().includes(t.toLowerCase()));
    if(matches.length && adjacency.length<120) adjacency.push({module:id,path,matches,record:compact(value)});
  });
}

const report = {
  reportId:'H_EARTH_FD05_GROUND_FORM_SOURCE_ANALYSIS_001',generatedAt:new Date().toISOString(),status:'PASS',repositoryModified:false,
  moduleExports:Object.fromEntries(Object.entries(modules).map(([id,m])=>[id,Object.keys(m).sort()])),
  previewSummary:{ok:preview.ok,sourceObjectId:preview.sourceObjectId,sourceZoneIds:preview.sourceZoneIds,latticeRegionIds:preview.latticeRegionIds,primitiveCount:preview.primitives?.length??null,keys:Object.keys(preview)},
  geometryCandidateArrays:geometryArrays.map(({points,indices,...rest})=>rest),
  selectedPositionPath:positionCandidates[0]?.path??null,selectedIndexPath:indexCandidates[0]?.path??null,
  geometryStatistics:stats(positions,indices),
  adjacencyMatches:adjacency
};
await writeFile(`${outDir}/source-analysis.json`,JSON.stringify(report,null,2)+'\n','utf8');
console.log(JSON.stringify({reportId:report.reportId,previewSummary:report.previewSummary,geometryStatistics:report.geometryStatistics,adjacencyMatchCount:adjacency.length,moduleExports:report.moduleExports},null,2));
