import { assertContract, freezeRecord } from "./compass.contracts.js";
import { normalizeQuaternion, normalize3, rotateVectorByQuaternion, dot3 } from "./compass.math.js";

export function createWorldAuthority({ profile, nodes }) {
  assertContract(profile && profile.world, "COMPASS_WORLD_PROFILE_REQUIRED");
  let revision = 0;
  let disposed = false;

  function evaluate(frame) {
    assertContract(!disposed, "COMPASS_WORLD_DISPOSED");
    const presentation = frame.presentation;
    const activeQuaternion = normalizeQuaternion(frame.orientation);
    const anchor = normalize3(profile.world.primaryAnchorByPresentation[presentation] || [0, 0, 1]);
    const records = nodes.forPresentation(presentation).map(node => {
      const rotatedUnitVector = normalize3(rotateVectorByQuaternion(node.baseVector, activeQuaternion));
      const radii = profile.world.radiiByPresentation[presentation];
      const worldPosition = [
        rotatedUnitVector[0] * radii[0],
        rotatedUnitVector[1] * radii[1],
        rotatedUnitVector[2] * radii[2]
      ];
      return freezeRecord({
        ...node,
        rotatedUnitVector,
        worldPosition,
        depthScore: (rotatedUnitVector[2] + 1) * 0.5,
        alignmentScore: (dot3(rotatedUnitVector, anchor) + 1) * 0.5
      });
    });
    const primary = records.slice().sort((a, b) => b.alignmentScore - a.alignmentScore || a.index - b.index)[0] || null;
    revision += 1;
    return Object.freeze({
      schema: "UNIVERSAL_COMPASS_WORLD_SNAPSHOT_v1",
      worldRevision: revision,
      presentation,
      orientation: Object.freeze(activeQuaternion),
      primaryId: primary ? primary.id : "",
      records: Object.freeze(records)
    });
  }

  return Object.freeze({
    evaluate,
    getRevision: () => revision,
    dispose: () => { disposed = true; }
  });
}
