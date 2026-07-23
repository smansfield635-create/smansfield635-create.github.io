import { DEPTH_LAYER, assertContract } from "./compass.contracts.js";
import { dot3, normalize3, subtract3 } from "./compass.math.js";

export function createCompositor({ profile, adapters, nodes }) {
  let camera = Object.freeze({ ...profile.compositor.camera });
  let projectionRevision = 0;
  let lastSnapshot = null;

  function project(worldSnapshot, visualRecords = []) {
    const projector = adapters.projectWorldPoint;
    assertContract(typeof projector === "function", "COMPASS_PROJECTOR_REQUIRED");
    const centerDepth = profile.compositor.centerDepth;
    const records = worldSnapshot.records.map(worldRecord => {
      const projection = projector(worldRecord.worldPosition, camera);
      const depthLayer =
        projection.viewDepth < centerDepth - profile.compositor.depthHysteresis
          ? DEPTH_LAYER.FRONT
          : projection.viewDepth > centerDepth + profile.compositor.depthHysteresis
            ? DEPTH_LAYER.REAR
            : DEPTH_LAYER.CENTER;
      const visual = visualRecords.find(record => record.id === worldRecord.id) || {};
      return Object.freeze({
        ...worldRecord,
        ...visual,
        ...projection,
        depthLayer,
        hitEligible: projection.visible !== false
      });
    });
    projectionRevision += 1;
    lastSnapshot = Object.freeze({
      schema: "UNIVERSAL_COMPASS_PROJECTION_SNAPSHOT_v1",
      projectionRevision,
      worldRevision: worldSnapshot.worldRevision,
      records: Object.freeze(records)
    });
    return lastSnapshot;
  }

  function render(snapshot) {
    assertContract(snapshot === lastSnapshot, "COMPASS_PROJECTION_NOT_CURRENT");
    return adapters.renderFrame(snapshot);
  }

  function inferPrimary(quaternion, presentation) {
    const candidates = nodes.forPresentation(presentation);
    const forward = normalize3(subtract3(camera.target, camera.eye));
    return candidates
      .slice()
      .sort((a, b) =>
        dot3(b.baseVector, forward) - dot3(a.baseVector, forward) ||
        a.index - b.index
      )[0]?.id || "";
  }

  return Object.freeze({
    setCamera(next) {
      camera = Object.freeze({ ...camera, ...next });
    },
    getCamera: () => camera,
    project,
    render,
    inferPrimary,
    getLastProjection: () => lastSnapshot,
    dispose: () => {
      lastSnapshot = null;
    }
  });
}
