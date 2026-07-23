import {
  assertCanonicalPresentation,
  assertContract,
  assertExactKeys,
  assertFiniteVector,
  assertNonZeroVector3,
  deepFreeze,
  validateWorldNodeRecord,
  validateWorldSnapshot
} from "./compass.contracts.js";
import {
  dot3,
  normalize3,
  normalizeQuaternion,
  rotateVectorByQuaternion
} from "./compass.math.js";

const WORLD_BASIS_REVISION = 1;

export function createWorldAuthority({ profile, nodes }) {
  assertContract(profile && profile.world, "COMPASS_WORLD_PROFILE_REQUIRED");
  assertContract(
    nodes && typeof nodes.forPresentation === "function",
    "COMPASS_WORLD_NODES_REQUIRED"
  );

  let worldRevision = 0;
  let disposed = false;

  function requireActive() {
    assertContract(!disposed, "COMPASS_WORLD_DISPOSED");
  }

  function configurationFor(presentation) {
    const admittedPresentation = assertCanonicalPresentation(presentation);
    const radii = assertFiniteVector(
      profile.world.radiiByPresentation?.[admittedPresentation],
      3,
      "COMPASS_WORLD_RADII_INVALID"
    );

    assertContract(
      radii.every(radius => radius > 0),
      "COMPASS_WORLD_RADIUS_NONPOSITIVE",
      radii
    );

    const anchor = normalize3(
      assertNonZeroVector3(
        profile.world.primaryAnchorByPresentation?.[admittedPresentation],
        "COMPASS_WORLD_PRIMARY_ANCHOR_INVALID"
      )
    );

    return Object.freeze({
      presentation: admittedPresentation,
      radii,
      anchor
    });
  }

  function buildEvaluation({ presentation, quaternion }) {
    const configuration = configurationFor(presentation);
    const orientation = normalizeQuaternion(quaternion);
    const sourceNodes = nodes.forPresentation(configuration.presentation);

    assertContract(
      Array.isArray(sourceNodes),
      "COMPASS_WORLD_PRESENTATION_NODES_INVALID"
    );

    const records = sourceNodes.map(node => {
      assertContract(
        node.presentation === configuration.presentation,
        "COMPASS_WORLD_NODE_PRESENTATION_MISMATCH",
        Object.freeze({
          nodeId: node.id,
          expected: configuration.presentation,
          actual: node.presentation
        })
      );

      const rotatedUnitVector = normalize3(
        rotateVectorByQuaternion(node.baseVector, orientation)
      );
      const worldPosition = [
        rotatedUnitVector[0] * configuration.radii[0],
        rotatedUnitVector[1] * configuration.radii[1],
        rotatedUnitVector[2] * configuration.radii[2]
      ];

      return validateWorldNodeRecord({
        id: node.id,
        index: node.index,
        kind: node.kind,
        presentation: node.presentation,
        domain: node.domain,
        routeKey: node.routeKey,
        semantic: node.semantic,
        baseVector: node.baseVector,
        rotatedUnitVector,
        worldPosition,
        alignmentScore:
          (dot3(rotatedUnitVector, configuration.anchor) + 1) * 0.5,
        depthScore: (rotatedUnitVector[2] + 1) * 0.5
      });
    });

    const primary =
      records
        .slice()
        .sort(
          (a, b) =>
            b.alignmentScore - a.alignmentScore ||
            a.index - b.index
        )[0] || null;

    return Object.freeze({
      presentation: configuration.presentation,
      quaternion: deepFreeze(orientation),
      primaryId: primary ? primary.id : "",
      primaryScore: primary ? primary.alignmentScore : 0,
      records: deepFreeze(records)
    });
  }

  function evaluateOrientationProposal(proposal) {
    requireActive();
    assertExactKeys(
      proposal,
      ["presentation", "quaternion"],
      "COMPASS_ORIENTATION_PROPOSAL_INPUT_KEYS_INVALID"
    );

    const evaluation = buildEvaluation(proposal);

    return deepFreeze({
      schema: "UNIVERSAL_COMPASS_ORIENTATION_PROPOSAL_EVALUATION_v1",
      presentation: evaluation.presentation,
      quaternion: evaluation.quaternion,
      primaryId: evaluation.primaryId,
      primaryScore: evaluation.primaryScore,
      records: evaluation.records,
      worldBasisRevision: WORLD_BASIS_REVISION
    });
  }

  function evaluate(frame) {
    requireActive();
    assertExactKeys(
      frame,
      ["presentation", "orientation"],
      "COMPASS_WORLD_FRAME_KEYS_INVALID"
    );

    const evaluation = buildEvaluation({
      presentation: frame.presentation,
      quaternion: frame.orientation
    });

    worldRevision += 1;

    return validateWorldSnapshot({
      schema: "UNIVERSAL_COMPASS_WORLD_SNAPSHOT_v1",
      worldRevision,
      presentation: evaluation.presentation,
      orientation: evaluation.quaternion,
      primaryId: evaluation.primaryId,
      records: evaluation.records
    });
  }

  return Object.freeze({
    evaluate,
    evaluateOrientationProposal,
    getRevision: () => worldRevision,
    getWorldBasisRevision: () => WORLD_BASIS_REVISION,
    dispose: () => {
      disposed = true;
    }
  });
}
