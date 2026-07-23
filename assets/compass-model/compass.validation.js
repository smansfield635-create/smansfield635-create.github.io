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

  const record = (id, status, details = "") => {
    findings.push(Object.freeze({
      id,
      status,
      pass: status === "PASS",
      details
    }));
  };

  const check = (id, condition, details = "") => {
    record(id, condition ? "PASS" : "FAIL", details);
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
      typeof controller.commit === "function" &&
      typeof controller.setPresentation === "function"
  );
  check(
    "POINTER_AND_DEVICE_BEHAVIOR",
    typeof interactions.begin === "function" &&
      typeof interactions.interrupt === "function"
  );

  const covered = new Set(findings.map(finding => finding.id));
  REQUIRED_INVARIANTS.forEach(id => {
    if (!covered.has(id)) {
      record(
        id,
        "PENDING",
        "REQUIRES_INTEGRATED_MULTIFACETED_AUDIT"
      );
    }
  });

  const failedCount = findings.filter(
    finding => finding.status === "FAIL"
  ).length;
  const pendingCount = findings.filter(
    finding => finding.status === "PENDING"
  ).length;

  return Object.freeze({
    schema: "UNIVERSAL_COMPASS_VALIDATION_RECEIPT_v2",
    status:
      failedCount > 0
        ? "FAIL"
        : pendingCount > 0
          ? "PENDING_INTEGRATED_AUDIT"
          : "PASS_CANDIDATE_ONLY",
    summary: Object.freeze({
      passCount: findings.filter(finding => finding.status === "PASS").length,
      failCount: failedCount,
      pendingCount
    }),
    findings: Object.freeze(findings),
    productionAuthority: false,
    referenceModelAuthority: false
  });
}
