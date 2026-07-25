import { createHash } from 'node:crypto';

export const freeze = value => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const child of Object.values(value)) freeze(child);
  return value;
};

const canonicalize = value => {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map(key => [key, canonicalize(value[key])]));
  }
  return value;
};

export const digest = value => createHash('sha256')
  .update(JSON.stringify(canonicalize(value)))
  .digest('hex');

export const fail = (code, details = null) => {
  const error = new Error(code);
  error.code = code;
  error.details = details;
  throw error;
};

const finite = (value, code) => {
  if (!Number.isFinite(value)) fail(code, { value });
  return value;
};

const vector = (value, code) => {
  if (!value || typeof value !== 'object' || !['x', 'y', 'z'].every(key => Number.isFinite(value[key]))) {
    fail(code, { value });
  }
  return { x: value.x, y: value.y, z: value.z };
};

const subtract = (left, right) => ({ x: left.x-right.x, y: left.y-right.y, z: left.z-right.z });
const dot = (left, right) => left.x*right.x + left.y*right.y + left.z*right.z;
const cross = (left, right) => ({
  x: left.y*right.z-left.z*right.y,
  y: left.z*right.x-left.x*right.z,
  z: left.x*right.y-left.y*right.x
});
const length = value => Math.hypot(value.x, value.y, value.z);
const normalize = (value, code) => {
  const magnitude = length(value);
  if (!Number.isFinite(magnitude) || magnitude <= Number.EPSILON) fail(code, { value, magnitude });
  return { x:value.x/magnitude, y:value.y/magnitude, z:value.z/magnitude };
};

export function normalizeSweepBounds(bounds) {
  const minimum = bounds?.minimum ?? bounds?.min ?? bounds?.lower ?? (
    bounds?.x && bounds?.y && bounds?.z
      ? { x: bounds.x.minimum, y: bounds.y.minimum, z: bounds.z.minimum }
      : null
  );
  const maximum = bounds?.maximum ?? bounds?.max ?? bounds?.upper ?? (
    bounds?.x && bounds?.y && bounds?.z
      ? { x: bounds.x.maximum, y: bounds.y.maximum, z: bounds.z.maximum }
      : null
  );
  const normalized = { minimum: vector(minimum, 'H3_BOUNDS_MINIMUM_INVALID'), maximum: vector(maximum, 'H3_BOUNDS_MAXIMUM_INVALID') };
  for (const axis of ['x','y','z']) {
    if (normalized.minimum[axis] > normalized.maximum[axis]) fail('H3_BOUNDS_ORDER_INVALID', { axis, normalized });
  }
  return freeze(normalized);
}

export function validateViewportProfile(profile) {
  if (!profile || typeof profile !== 'object' || typeof profile.profileId !== 'string' || profile.profileId.length === 0) {
    fail('H3_VIEWPORT_PROFILE_ID_INVALID');
  }
  for (const key of ['widthPx','heightPx','devicePixelRatio']) {
    if (!Number.isFinite(profile[key]) || profile[key] <= 0) fail('H3_VIEWPORT_PROFILE_VALUE_INVALID', { key, value: profile[key] });
  }
  return freeze({
    profileId: profile.profileId,
    widthPx: profile.widthPx,
    heightPx: profile.heightPx,
    devicePixelRatio: profile.devicePixelRatio,
    aspectRatio: profile.widthPx / profile.heightPx
  });
}

export function createCameraBasis(camera) {
  const position = vector(camera?.position, 'H3_CAMERA_POSITION_INVALID');
  const target = vector(camera?.target, 'H3_CAMERA_TARGET_INVALID');
  const publishedUp = normalize(vector(camera?.up, 'H3_CAMERA_UP_INVALID'), 'H3_CAMERA_UP_DEGENERATE');
  const verticalFovDegrees = finite(camera?.verticalFovDegrees, 'H3_CAMERA_FOV_INVALID');
  const nearPlane = finite(camera?.nearPlane, 'H3_CAMERA_NEAR_INVALID');
  const farPlane = finite(camera?.farPlane, 'H3_CAMERA_FAR_INVALID');
  if (verticalFovDegrees <= 0 || verticalFovDegrees >= 180) fail('H3_CAMERA_FOV_OUT_OF_RANGE');
  if (nearPlane <= 0 || farPlane <= nearPlane) fail('H3_CAMERA_DEPTH_RANGE_INVALID');
  const forward = normalize(subtract(target, position), 'H3_CAMERA_FORWARD_DEGENERATE');
  const right = normalize(cross(publishedUp, forward), 'H3_CAMERA_RIGHT_DEGENERATE');
  const up = normalize(cross(forward, right), 'H3_CAMERA_CORRECTED_UP_DEGENERATE');
  const focalLength = 1 / Math.tan(verticalFovDegrees * Math.PI / 360);
  if (!Number.isFinite(focalLength) || focalLength <= 0) fail('H3_CAMERA_FOCAL_LENGTH_INVALID');
  return freeze({ position, target, publishedUp, forward, right, up, verticalFovDegrees, nearPlane, farPlane, focalLength });
}

export function createReferenceLattice(boundsInput, sampleModel) {
  const bounds = normalizeSweepBounds(boundsInput);
  const columns = sampleModel?.columns;
  const rows = sampleModel?.rows;
  if (!Number.isSafeInteger(columns) || columns < 2 || !Number.isSafeInteger(rows) || rows < 2) {
    fail('H3_SAMPLE_GRID_INVALID', { columns, rows });
  }
  if (columns * rows !== sampleModel.totalSamples) fail('H3_SAMPLE_TOTAL_MISMATCH');
  const y = (bounds.minimum.y + bounds.maximum.y) / 2;
  const samples=[];
  for (let row=0; row<rows; row+=1) {
    const z = bounds.minimum.z + (bounds.maximum.z-bounds.minimum.z) * row/(rows-1);
    for (let column=0; column<columns; column+=1) {
      const x = bounds.minimum.x + (bounds.maximum.x-bounds.minimum.x) * column/(columns-1);
      samples.push(freeze({ sampleIndex:samples.length, row, column, world:{x,y,z} }));
    }
  }
  return freeze({ modelId: sampleModel.modelId, bounds, columns, rows, totalSamples:samples.length, samples });
}

export function classifyWorldPoint(worldInput, cameraBasis, viewportProfile) {
  const world = vector(worldInput, 'H3_SAMPLE_WORLD_POINT_INVALID');
  const relative = subtract(world, cameraBasis.position);
  const camera = { x:dot(relative,cameraBasis.right), y:dot(relative,cameraBasis.up), z:dot(relative,cameraBasis.forward) };
  if (!Object.values(camera).every(Number.isFinite)) {
    return freeze({ flags:['NONPROJECTABLE'], visible:false, camera, ndc:null, depthMargin:null, frustumMargin:null });
  }
  const clippedNear = camera.z <= cameraBasis.nearPlane;
  const clippedFar = camera.z >= cameraBasis.farPlane;
  const depthEligible = !clippedNear && !clippedFar;
  let ndc=null, clippedHorizontal=false, clippedVertical=false;
  if (depthEligible) {
    ndc={
      x:(camera.x*cameraBasis.focalLength)/(camera.z*viewportProfile.aspectRatio),
      y:(camera.y*cameraBasis.focalLength)/camera.z
    };
    if (!Number.isFinite(ndc.x) || !Number.isFinite(ndc.y)) {
      return freeze({ flags:['NONPROJECTABLE'], visible:false, camera, ndc:null, depthMargin:null, frustumMargin:null });
    }
    clippedHorizontal = ndc.x < -1-1e-10 || ndc.x > 1+1e-10;
    clippedVertical = ndc.y < -1-1e-10 || ndc.y > 1+1e-10;
  }
  const insideFrustum = depthEligible && !clippedHorizontal && !clippedVertical;
  const flags=[];
  if (depthEligible) flags.push('DEPTH_ELIGIBLE');
  if (insideFrustum) flags.push('INSIDE_FRUSTUM');
  if (clippedNear) flags.push('CLIPPED_NEAR');
  if (clippedFar) flags.push('CLIPPED_FAR');
  if (clippedHorizontal) flags.push('CLIPPED_HORIZONTAL');
  if (clippedVertical) flags.push('CLIPPED_VERTICAL');
  const depthMargin=Math.min(camera.z-cameraBasis.nearPlane,cameraBasis.farPlane-camera.z);
  const frustumMargin=ndc ? 1-Math.max(Math.abs(ndc.x),Math.abs(ndc.y)) : null;
  return freeze({ flags, visible:insideFrustum, camera, ndc, depthMargin, frustumMargin });
}

export function executeProfileSweep({ lattice, camera, profile }) {
  if (!lattice || !Array.isArray(lattice.samples) || lattice.samples.length !== lattice.totalSamples) fail('H3_LATTICE_INVALID');
  const cameraBasis=createCameraBasis(camera);
  const viewportProfile=validateViewportProfile(profile);
  const counts={totalSamples:lattice.totalSamples,depthEligibleSamples:0,frustumEligibleSamples:0,visibleSamples:0,nearClippedSamples:0,farClippedSamples:0,horizontalClippedSamples:0,verticalClippedSamples:0,outsideFrustumSamples:0,nonprojectableSamples:0};
  let minimumDepthMargin=Number.POSITIVE_INFINITY, minimumFrustumMargin=Number.POSITIVE_INFINITY;
  for (const sample of lattice.samples) {
    const result=classifyWorldPoint(sample.world,cameraBasis,viewportProfile);
    const has=flag=>result.flags.includes(flag);
    if (has('NONPROJECTABLE')) counts.nonprojectableSamples+=1;
    if (has('DEPTH_ELIGIBLE')) counts.depthEligibleSamples+=1;
    if (has('INSIDE_FRUSTUM')) {counts.frustumEligibleSamples+=1;counts.visibleSamples+=1;}
    if (has('CLIPPED_NEAR')) counts.nearClippedSamples+=1;
    if (has('CLIPPED_FAR')) counts.farClippedSamples+=1;
    if (has('CLIPPED_HORIZONTAL')) counts.horizontalClippedSamples+=1;
    if (has('CLIPPED_VERTICAL')) counts.verticalClippedSamples+=1;
    if (has('DEPTH_ELIGIBLE') && !has('INSIDE_FRUSTUM')) counts.outsideFrustumSamples+=1;
    if (Number.isFinite(result.depthMargin)) minimumDepthMargin=Math.min(minimumDepthMargin,result.depthMargin);
    if (Number.isFinite(result.frustumMargin)) minimumFrustumMargin=Math.min(minimumFrustumMargin,result.frustumMargin);
  }
  const exclusiveTotal=counts.nearClippedSamples+counts.farClippedSamples+counts.outsideFrustumSamples+counts.visibleSamples+counts.nonprojectableSamples;
  if (exclusiveTotal!==counts.totalSamples) fail('H3_CLASSIFICATION_ACCOUNTING_MISMATCH',{counts,exclusiveTotal});
  const body={profile:viewportProfile,cameraBasis,sampleModel:{modelId:lattice.modelId,columns:lattice.columns,rows:lattice.rows,totalSamples:lattice.totalSamples,bounds:lattice.bounds},counts,visibleSampleRatio:counts.visibleSamples/counts.totalSamples,minimumDepthMargin:Number.isFinite(minimumDepthMargin)?minimumDepthMargin:null,minimumFrustumMargin:Number.isFinite(minimumFrustumMargin)?minimumFrustumMargin:null,terminalClassification:'CAMERA_FRUSTUM_PROFILE_SWEEP_EXECUTED'};
  return freeze({...body,semanticDigestSha256:digest(body)});
}

export function executeSweepSet({ bounds, sampleModel, camera, profiles }) {
  const lattice=createReferenceLattice(bounds,sampleModel);
  if (!Array.isArray(profiles) || profiles.length===0) fail('H3_VIEWPORT_PROFILES_REQUIRED');
  const profileResults=profiles.map(profile=>executeProfileSweep({lattice,camera,profile}));
  const body={contractId:'H_EARTH_CAPACITY_CAMERA_RENDERER_CORRESPONDENCE_H3_SWEEP_RECEIPT_v1',lattice:{modelId:lattice.modelId,bounds:lattice.bounds,columns:lattice.columns,rows:lattice.rows,totalSamples:lattice.totalSamples},profileResults,terminalClassification:'DETERMINISTIC_CAMERA_AND_FRUSTUM_SWEEP_COMPLETE',claims:{rendererEquivalentMathematicsExecuted:true,rendererExecutionPerformed:false,downstreamCapacityEvaluationPerformed:false,productionFilesChanged:0}};
  return freeze({...body,deterministicReceiptSha256:digest(body)});
}
