import { pathToFileURL } from 'node:url';
import path from 'node:path';
import { writeFile, mkdir } from 'node:fs/promises';

const root = process.cwd();
const load = (p) => import(pathToFileURL(path.join(root, p)).href);
const outDir = '.fd05/shoreline-api-inspection-output';
await mkdir(outDir, { recursive: true });

const lattice = await load('h-earth-3d/zones/ground-cell-001.landscape-lattice.js');
const zones = await load('h-earth-3d/zones/ground-cell-001.zones.js');
const objects = await load('h-earth-3d/objects/ground-cell-001.objects.js');
const environment = await load('showroom/globe/h-earth/environment.js');

const objectIds = [
  'OBJ_002_FOREGROUND_WET_SAND',
  'OBJ_005_SHORELINE_FOAM_LINE',
  'OBJ_007_WATER_SURFACE_PLANE'
];
const zoneIds = [
  'ZONE_001_FOREGROUND_INSPECTION_ZONE',
  'ZONE_002_SHORELINE_CONTACT_ZONE',
  'ZONE_003_WATER_SURFACE_ZONE'
];

function plain(value, depth = 0) {
  if (depth > 8) return '[DEPTH_LIMIT]';
  if (value === null || typeof value !== 'object') return value;
  if (Array.isArray(value)) return value.map((entry) => plain(entry, depth + 1));
  return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, plain(v, depth + 1)]));
}

const report = {
  reportId: 'H_EARTH_FD05_SHORELINE_AUTHORITY_VALUES_001',
  generatedAt: new Date().toISOString(),
  regionIds: plain(lattice.H_EARTH_256_LATTICE_REGION_IDS),
  regionProfiles: plain(lattice.H_EARTH_256_LATTICE_REGION_PROFILES),
  zoneDescriptors: Object.fromEntries(
    zoneIds.map((id) => [id, plain(zones.getHEarthGroundCell001ZoneDescriptor(id))])
  ),
  objectDescriptors: Object.fromEntries(
    objectIds.map((id) => [id, plain(objects.getHEarthGroundCell001ObjectDescriptor(id))])
  ),
  objectZoneBindings: Object.fromEntries(
    objectIds.map((id) => [id, plain(objects.getHEarthGroundCell001ObjectZoneBinding(id))])
  ),
  materialIdentities: plain(environment.H_EARTH_3D_ENVIRONMENT_MATERIAL_IDENTITIES),
  shorelineModel: plain(environment.H_EARTH_3D_SHORELINE_MODEL),
  waterSubstrate: plain(environment.H_EARTH_3D_WATER_SUBSTRATE),
  primitivePlan: plain(environment.H_EARTH_3D_ENVIRONMENT_PRIMITIVE_PLAN)
};

await writeFile(
  `${outDir}/authority-values.json`,
  `${JSON.stringify(report, null, 2)}\n`,
  'utf8'
);
console.log(JSON.stringify(report, null, 2));
