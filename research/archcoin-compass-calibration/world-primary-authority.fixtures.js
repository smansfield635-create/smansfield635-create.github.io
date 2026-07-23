import { PRESENTATION } from "../../assets/compass-model/compass.contracts.js";
import { createWorldAuthority } from "../../assets/compass-model/compass.world.js";

const definitions = Object.freeze([
  Object.freeze({
    id: "front",
    index: 0,
    kind: "node",
    presentation: PRESENTATION.CONSTELLATION,
    domain: "",
    routeKey: "",
    semantic: Object.freeze({ label: "Front" }),
    baseVector: Object.freeze([0, 0, 1])
  }),
  Object.freeze({
    id: "back",
    index: 1,
    kind: "node",
    presentation: PRESENTATION.CONSTELLATION,
    domain: "",
    routeKey: "",
    semantic: Object.freeze({ label: "Back" }),
    baseVector: Object.freeze([0, 0, -1])
  }),
  Object.freeze({
    id: "tie-a",
    index: 2,
    kind: "node",
    presentation: PRESENTATION.CLUSTER,
    domain: "",
    routeKey: "",
    semantic: Object.freeze({ label: "A" }),
    baseVector: Object.freeze([1, 0, 0])
  }),
  Object.freeze({
    id: "tie-b",
    index: 3,
    kind: "node",
    presentation: PRESENTATION.CLUSTER,
    domain: "",
    routeKey: "",
    semantic: Object.freeze({ label: "B" }),
    baseVector: Object.freeze([-1, 0, 0])
  })
]);

const nodes = Object.freeze({
  forPresentation: presentation =>
    definitions.filter(node => node.presentation === presentation)
});

const profile = Object.freeze({
  world: Object.freeze({
    radiiByPresentation: Object.freeze({
      [PRESENTATION.CONSTELLATION]: Object.freeze([1, 1, 1]),
      [PRESENTATION.CLUSTER]: Object.freeze([0.8, 0.9, 1])
    }),
    primaryAnchorByPresentation: Object.freeze({
      [PRESENTATION.CONSTELLATION]: Object.freeze([0, 0, 1]),
      [PRESENTATION.CLUSTER]: Object.freeze([0, 0, 1])
    })
  })
});

const tests = [];

function test(name, run) {
  try {
    run();
    tests.push(Object.freeze({ name, status: "PASS" }));
  } catch (error) {
    tests.push(Object.freeze({
      name,
      status: "FAIL",
      code: error.code || error.message
    }));
  }
}

function expect(condition, code) {
  if (!condition) {
    throw new Error(code);
  }
}

function expectThrow(run, code) {
  let caught = null;

  try {
    run();
  } catch (error) {
    caught = error;
  }

  expect(caught && caught.code === code, `EXPECTED_${code}`);
}

const world = createWorldAuthority({ profile, nodes });

test("IDENTITY_PRIMARY_IS_WORLD_ANCHOR_ALIGNED", () => {
  const result = world.evaluateOrientationProposal({
    presentation: PRESENTATION.CONSTELLATION,
    quaternion: [0, 0, 0, 1]
  });

  expect(result.primaryId === "front", "PRIMARY_NOT_FRONT");
  expect(result.primaryScore === 1, "PRIMARY_SCORE_NOT_ONE");
});

test("ROTATED_PRIMARY_USES_PROPOSED_QUATERNION", () => {
  const result = world.evaluateOrientationProposal({
    presentation: PRESENTATION.CONSTELLATION,
    quaternion: [0, 1, 0, 0]
  });

  expect(result.primaryId === "back", "PRIMARY_NOT_BACK");
});

test("PRIMARY_TIE_BREAK_USES_LOWEST_STABLE_INDEX", () => {
  const result = world.evaluateOrientationProposal({
    presentation: PRESENTATION.CLUSTER,
    quaternion: [0, 0, 0, 1]
  });

  expect(result.primaryId === "tie-a", "TIE_BREAK_NOT_STABLE");
});

test("PROPOSAL_EVALUATION_DOES_NOT_INCREMENT_WORLD_REVISION", () => {
  const before = world.getRevision();

  world.evaluateOrientationProposal({
    presentation: PRESENTATION.CONSTELLATION,
    quaternion: [0, 0, 0, 1]
  });

  expect(
    world.getRevision() === before,
    "PROPOSAL_MUTATED_WORLD_REVISION"
  );
});

test("WORLD_SNAPSHOT_MATCHES_PROPOSAL_PRIMARY", () => {
  const proposal = world.evaluateOrientationProposal({
    presentation: PRESENTATION.CONSTELLATION,
    quaternion: [0, 1, 0, 0]
  });
  const snapshot = world.evaluate({
    presentation: PRESENTATION.CONSTELLATION,
    orientation: [0, 1, 0, 0]
  });

  expect(
    snapshot.primaryId === proposal.primaryId,
    "SNAPSHOT_PROPOSAL_PRIMARY_MISMATCH"
  );
  expect(snapshot.worldRevision === 1, "WORLD_REVISION_INVALID");
});

test("PROPOSAL_RECORDS_ARE_DEEPLY_IMMUTABLE", () => {
  const result = world.evaluateOrientationProposal({
    presentation: PRESENTATION.CONSTELLATION,
    quaternion: [0, 0, 0, 1]
  });

  expect(
    Object.isFrozen(result.records[0].worldPosition),
    "WORLD_POSITION_NOT_FROZEN"
  );
  expect(
    Object.isFrozen(result.records[0].semantic),
    "SEMANTIC_NOT_FROZEN"
  );
});

test("HELD_PRESENTATION_REJECTED", () => {
  expectThrow(
    () => world.evaluateOrientationProposal({
      presentation: PRESENTATION.HELD,
      quaternion: [0, 0, 0, 1]
    }),
    "COMPASS_CANONICAL_PRESENTATION_REQUIRED"
  );
});

test("UNKNOWN_PROPOSAL_FIELD_REJECTED", () => {
  expectThrow(
    () => world.evaluateOrientationProposal({
      presentation: PRESENTATION.CONSTELLATION,
      quaternion: [0, 0, 0, 1],
      camera: {}
    }),
    "COMPASS_ORIENTATION_PROPOSAL_INPUT_KEYS_INVALID"
  );
});

test("DISPOSED_WORLD_REJECTS_EVALUATION", () => {
  const disposable = createWorldAuthority({ profile, nodes });
  disposable.dispose();

  expectThrow(
    () => disposable.evaluateOrientationProposal({
      presentation: PRESENTATION.CONSTELLATION,
      quaternion: [0, 0, 0, 1]
    }),
    "COMPASS_WORLD_DISPOSED"
  );
});

const failed = tests.filter(result => result.status === "FAIL");
const receipt = Object.freeze({
  schema: "UNIVERSAL_WORLD_PRIMARY_AUTHORITY_FIXTURE_RECEIPT_v1",
  status: failed.length ? "FAIL" : "PASS",
  summary: Object.freeze({
    testCount: tests.length,
    passed: tests.length - failed.length,
    failed: failed.length
  }),
  results: Object.freeze(tests)
});

console.log(JSON.stringify(receipt, null, 2));

if (failed.length) {
  process.exitCode = 1;
}
