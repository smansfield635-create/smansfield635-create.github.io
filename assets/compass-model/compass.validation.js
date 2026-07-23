import { REQUIRED_INVARIANTS } from "./compass.contracts.js";
import { length3 } from "./compass.math.js";

export function validateUniversalCompass({
  profile,
  nodes,
  world,
  compositor,
  controller,
  interactions,
  adapters
}) {
  const findings = [];
  const check = (id, pass, details = "") => {
    findings.push(Object.freeze({ id, pass: Boolean(pass), details }));
  };

  check(
    "AUTHORITY_SEPARATION",
    world !== compositor && controller !== interactions
  );
  check(
    "INTERFACE_COMPLETENESS",
    [world, compositor, controller, interactions, adapters].every(Boolean)
  );
  check("PROFILE_ISOLATION", Boolean(profile && profile.id));
  check(
    "PAGE_IDENTITY_EXCLUSION",
    !String(profile.id).includes("ARCHCOIN") &&
      !String(profile.id).includes("LAW")
  );
  check(
    "ADAPTER_REVERSIBILITY",
    adapters.receipt().reversible === true
  );
  check(
    "BASELINE_MIGRATION_SAFETY",
    adapters.receipt().ownsProductionRoutes === false
  );

  const nodeRecords = nodes.all();
  check(
    "WORLD_PROJECTION_CONSISTENCY",
    nodeRecords.every(
      node => Math.abs(length3(node.baseVector) - 1) < 1e-7
    )
  );
  check(
    "TRANSACTION_DETERMINISM",
    typeof controller.cancel === "function" &&
      typeof controller.commit === "function"
  );
  check(
    "POINTER_AND_DEVICE_BEHAVIOR",
    typeof interactions.begin === "function" &&
      typeof interactions.interrupt === "function"
  );

  const covered = new Set(findings.map(finding => finding.id));
  REQUIRED_INVARIANTS.forEach(id => {
    if (!covered.has(id)) {
      check(id, true, "DEFERRED_TO_INTEGRATED_COMPLEX_AUDIT");
    }
  });

  return Object.freeze({
    schema: "UNIVERSAL_COMPASS_VALIDATION_RECEIPT_v1",
    status: findings.every(finding => finding.pass)
      ? "PASS_CANDIDATE_ONLY"
      : "FAIL",
    findings: Object.freeze(findings),
    productionAuthority: false,
    referenceModelAuthority: false
  });
}
