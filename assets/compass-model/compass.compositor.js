import {
  DEPTH_CONVENTION,
  DEPTH_LAYER,
  assertContract,
  createCompositeNodeRecord,
  deepFreeze,
  validateAdapterProjectionOutput,
  validateCameraRecord,
  validateVisualNodeRecord,
  validateWorldSnapshot
} from "./compass.contracts.js";

const PROJECTION_SNAPSHOT_SCHEMA =
  "UNIVERSAL_COMPASS_PROJECTION_SNAPSHOT_v2";

function createDefaultVisualRecord(id) {
  return validateVisualNodeRecord({
    id,
    visible: true,
    scale: 1,
    opacity: 1,
    prominence: 0,
    materialKey: "",
    labelMode: "DEFAULT"
  });
}

export function createCompositor({ profile, adapters }) {
  assertContract(
    profile && profile.compositor,
    "COMPASS_COMPOSITOR_PROFILE_REQUIRED"
  );
  assertContract(
    adapters && typeof adapters.projectWorldPoint === "function",
    "COMPASS_PROJECTOR_REQUIRED"
  );
  assertContract(
    typeof adapters.renderFrame === "function",
    "COMPASS_RENDER_ADAPTER_REQUIRED"
  );
  assertContract(
    profile.compositor.depthConvention ===
      DEPTH_CONVENTION.POSITIVE_CAMERA_FORWARD_DISTANCE,
    "COMPASS_COMPOSITOR_DEPTH_CONVENTION_INVALID",
    profile.compositor.depthConvention
  );

  let camera = validateCameraRecord(profile.compositor.camera);
  let projectionRevision = 0;
  let lastSnapshot = null;
  let disposed = false;

  function requireActive() {
    assertContract(!disposed, "COMPASS_COMPOSITOR_DISPOSED");
  }

  function admitVisualRecords(visualRecords, worldRecords) {
    assertContract(
      Array.isArray(visualRecords),
      "COMPASS_VISUAL_RECORDS_ARRAY_REQUIRED"
    );

    const worldIds = new Set(worldRecords.map(record => record.id));
    const visualById = new Map();

    visualRecords.forEach(record => {
      const admitted = validateVisualNodeRecord(record);
      assertContract(
        worldIds.has(admitted.id),
        "COMPASS_VISUAL_NODE_ID_UNKNOWN",
        admitted.id
      );
      assertContract(
        !visualById.has(admitted.id),
        "COMPASS_VISUAL_NODE_ID_DUPLICATE",
        admitted.id
      );
      visualById.set(admitted.id, admitted);
    });

    return visualById;
  }

  function classifyDepth(viewDepth) {
    const centerDepth = profile.compositor.centerDepth;
    const hysteresis = profile.compositor.depthHysteresis;

    if (viewDepth < centerDepth - hysteresis) {
      return DEPTH_LAYER.FRONT;
    }
    if (viewDepth > centerDepth + hysteresis) {
      return DEPTH_LAYER.REAR;
    }
    return DEPTH_LAYER.CENTER;
  }

  function project(worldSnapshot, visualRecords = []) {
    requireActive();

    const admittedWorldSnapshot = validateWorldSnapshot(worldSnapshot);
    const visualById = admitVisualRecords(
      visualRecords,
      admittedWorldSnapshot.records
    );

    const records = admittedWorldSnapshot.records.map(worldRecord => {
      const projectionInput = deepFreeze({
        nodeId: worldRecord.id,
        worldRevision: admittedWorldSnapshot.worldRevision,
        worldPosition: structuredClone(worldRecord.worldPosition),
        camera: structuredClone(camera)
      });

      const adapterOutput = validateAdapterProjectionOutput(
        adapters.projectWorldPoint(projectionInput),
        projectionInput
      );

      assertContract(
        adapterOutput.radiusPx >= 0,
        "COMPASS_PROJECTION_RADIUS_NEGATIVE",
        adapterOutput.radiusPx
      );
      assertContract(
        adapterOutput.normalizedDepth >= 0 &&
          adapterOutput.normalizedDepth <= 1,
        "COMPASS_PROJECTION_NORMALIZED_DEPTH_OUT_OF_RANGE",
        adapterOutput.normalizedDepth
      );
      assertContract(
        !adapterOutput.visible || adapterOutput.viewDepth > 0,
        "COMPASS_VISIBLE_PROJECTION_NOT_FORWARD",
        adapterOutput.viewDepth
      );

      const visual =
        visualById.get(worldRecord.id) ||
        createDefaultVisualRecord(worldRecord.id);
      const depthLayer = classifyDepth(adapterOutput.viewDepth);
      const projection = deepFreeze({
        id: worldRecord.id,
        worldRevision: admittedWorldSnapshot.worldRevision,
        screenX: adapterOutput.screenX,
        screenY: adapterOutput.screenY,
        radiusPx: adapterOutput.radiusPx,
        viewDepth: adapterOutput.viewDepth,
        normalizedDepth: adapterOutput.normalizedDepth,
        visible: adapterOutput.visible,
        depthLayer,
        hitEligible:
          adapterOutput.visible &&
          visual.visible &&
          adapterOutput.viewDepth >= camera.near &&
          adapterOutput.viewDepth <= camera.far
      });

      return createCompositeNodeRecord({
        world: worldRecord,
        visual,
        projection
      });
    });

    projectionRevision += 1;
    lastSnapshot = deepFreeze({
      schema: PROJECTION_SNAPSHOT_SCHEMA,
      projectionRevision,
      worldRevision: admittedWorldSnapshot.worldRevision,
      depthConvention:
        DEPTH_CONVENTION.POSITIVE_CAMERA_FORWARD_DISTANCE,
      records
    });

    return lastSnapshot;
  }

  function render(snapshot) {
    requireActive();
    assertContract(
      snapshot === lastSnapshot,
      "COMPASS_PROJECTION_NOT_CURRENT"
    );
    return adapters.renderFrame(snapshot);
  }

  function setCamera(nextCamera) {
    requireActive();
    camera = validateCameraRecord(nextCamera);
    return camera;
  }

  return Object.freeze({
    setCamera,
    getCamera: () => camera,
    project,
    render,
    getLastProjection: () => lastSnapshot,
    getProjectionRevision: () => projectionRevision,
    dispose: () => {
      disposed = true;
      lastSnapshot = null;
    }
  });
}
