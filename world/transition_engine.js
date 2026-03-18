// TNT — /world/transition_engine.js
// PURPOSE: transition admissibility, route gating, handoff receipts
// AUTHORITY:
// - decides whether a requested transition is admissible
// - does not generate world truth
// - does not render
// - does not own motion
// - does not mutate kernel contracts

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function normalizeString(value, fallback = "") {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function normalizeBoolean(value, fallback = false) {
  return typeof value === "boolean" ? value : fallback;
}

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function isFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function getProgress(runtime) {
  return normalizeObject(runtime?.progress);
}

function getUnlocks(runtime) {
  return normalizeObject(runtime?.unlocks);
}

function getCompletion(runtime) {
  return normalizeObject(runtime?.completion);
}

function getAuthorityReceipt(runtime) {
  return normalizeObject(runtime?.authorityReceipt);
}

function getPlanetField(runtime) {
  return normalizeObject(runtime?.planetField);
}

function getSummary(runtime) {
  return normalizeObject(getPlanetField(runtime).summary);
}

function routeFamily(route) {
  const value = normalizeString(route, "/");

  if (
    value === "/" ||
    value === "/index.html" ||
    value === "/home/" ||
    value === "/home/index.html"
  ) {
    return "HOME";
  }
  if (value.startsWith("/products/")) return "PRODUCTS";
  if (value.startsWith("/explore/")) return "EXPLORE";
  if (value.startsWith("/laws/")) return "LAWS";
  if (value.startsWith("/gauges/")) return "GAUGES";
  if (value.startsWith("/door/")) return "DOOR";
  if (value.startsWith("/prelude/")) return "PRELUDE";

  return "UNKNOWN";
}

function modeFamily(mode) {
  const value = normalizeString(mode, "round");
  if (value === "round") return "ROUND";
  if (value === "flat") return "FLAT";
  if (value === "observe") return "OBSERVE";
  return "UNKNOWN";
}

function buildBaseTransitionRequest(input = {}) {
  const source = normalizeObject(input);

  return Object.freeze({
    proposed: normalizeString(source.proposed, "UNKNOWN"),
    family: normalizeString(source.family, "UNKNOWN"),
    fromRoute: normalizeString(source.fromRoute, "/"),
    toRoute: normalizeString(source.toRoute, "/"),
    fromMode: normalizeString(source.fromMode, "round"),
    toMode: normalizeString(source.toMode, "round"),
    explicitUserAction: normalizeBoolean(source.explicitUserAction, true),
    reason: normalizeString(source.reason, "")
  });
}

function isModeTransition(request) {
  return request.fromMode !== request.toMode;
}

function isRouteTransition(request) {
  return request.toRoute !== request.fromRoute;
}

function evaluateSystemReadiness(runtime) {
  const completion = getCompletion(runtime);
  const progress = getProgress(runtime);
  const authorityReceipt = getAuthorityReceipt(runtime);

  const completionPass = normalizeBoolean(completion.pass, false);
  const authorityPass = normalizeBoolean(authorityReceipt.pass, false);
  const summitCompletion = isFiniteNumber(progress.summitCompletion) ? progress.summitCompletion : 0;

  return Object.freeze({
    completionPass,
    authorityPass,
    summitCompletion,
    pass: completionPass && authorityPass
  });
}

function evaluateModeTransition(runtime, request) {
  const readiness = evaluateSystemReadiness(runtime);
  const toModeFamily = modeFamily(request.toMode);

  if (!request.explicitUserAction) {
    return Object.freeze({
      admissible: false,
      accepted: false,
      blockedReason: "user_action_required",
      family: "HOME_MODE"
    });
  }

  if (toModeFamily === "UNKNOWN") {
    return Object.freeze({
      admissible: false,
      accepted: false,
      blockedReason: "invalid_target_mode",
      family: "HOME_MODE"
    });
  }

  if (request.fromMode === request.toMode) {
    return Object.freeze({
      admissible: true,
      accepted: true,
      blockedReason: "",
      family: "HOME_MODE"
    });
  }

  if (!readiness.authorityPass) {
    return Object.freeze({
      admissible: false,
      accepted: false,
      blockedReason: "authority_receipt_failed",
      family: "HOME_MODE"
    });
  }

  if (request.toMode === "observe" && !readiness.completionPass) {
    return Object.freeze({
      admissible: false,
      accepted: false,
      blockedReason: "observe_requires_completion",
      family: "HOME_MODE"
    });
  }

  return Object.freeze({
    admissible: true,
    accepted: true,
    blockedReason: "",
    family: "HOME_MODE"
  });
}

function evaluateProductsTransition(runtime, request) {
  const readiness = evaluateSystemReadiness(runtime);
  const unlocks = getUnlocks(runtime);

  if (!request.explicitUserAction) {
    return Object.freeze({
      admissible: false,
      accepted: false,
      blockedReason: "user_action_required",
      family: "ROUTE_PRODUCTS"
    });
  }

  if (!readiness.authorityPass) {
    return Object.freeze({
      admissible: false,
      accepted: false,
      blockedReason: "authority_receipt_failed",
      family: "ROUTE_PRODUCTS"
    });
  }

  return Object.freeze({
    admissible: true,
    accepted: true,
    blockedReason: "",
    family: "ROUTE_PRODUCTS",
    unlocksObserved: normalizeBoolean(unlocks.renderReady, false)
  });
}

function evaluateExploreTransition(runtime, request) {
  const readiness = evaluateSystemReadiness(runtime);
  const unlocks = getUnlocks(runtime);

  if (!request.explicitUserAction) {
    return Object.freeze({
      admissible: false,
      accepted: false,
      blockedReason: "user_action_required",
      family: "ROUTE_EXPLORE"
    });
  }

  if (!readiness.authorityPass) {
    return Object.freeze({
      admissible: false,
      accepted: false,
      blockedReason: "authority_receipt_failed",
      family: "ROUTE_EXPLORE"
    });
  }

  if (!normalizeBoolean(unlocks.continents, false)) {
    return Object.freeze({
      admissible: false,
      accepted: false,
      blockedReason: "continent_unlock_incomplete",
      family: "ROUTE_EXPLORE"
    });
  }

  return Object.freeze({
    admissible: true,
    accepted: true,
    blockedReason: "",
    family: "ROUTE_EXPLORE"
  });
}

function evaluateLawsTransition(runtime, request) {
  const readiness = evaluateSystemReadiness(runtime);

  if (!request.explicitUserAction) {
    return Object.freeze({
      admissible: false,
      accepted: false,
      blockedReason: "user_action_required",
      family: "ROUTE_LAWS"
    });
  }

  if (!readiness.authorityPass) {
    return Object.freeze({
      admissible: false,
      accepted: false,
      blockedReason: "authority_receipt_failed",
      family: "ROUTE_LAWS"
    });
  }

  return Object.freeze({
    admissible: true,
    accepted: true,
    blockedReason: "",
    family: "ROUTE_LAWS"
  });
}

function evaluateGaugesTransition(runtime, request) {
  const readiness = evaluateSystemReadiness(runtime);

  if (!request.explicitUserAction) {
    return Object.freeze({
      admissible: false,
      accepted: false,
      blockedReason: "user_action_required",
      family: "ROUTE_GAUGES"
    });
  }

  if (!readiness.completionPass) {
    return Object.freeze({
      admissible: false,
      accepted: false,
      blockedReason: "completion_receipt_failed",
      family: "ROUTE_GAUGES"
    });
  }

  return Object.freeze({
    admissible: true,
    accepted: true,
    blockedReason: "",
    family: "ROUTE_GAUGES"
  });
}

function evaluateDoorTransition(runtime, request) {
  const readiness = evaluateSystemReadiness(runtime);
  const unlocks = getUnlocks(runtime);

  if (!request.explicitUserAction) {
    return Object.freeze({
      admissible: false,
      accepted: false,
      blockedReason: "user_action_required",
      family: "ROUTE_DOOR"
    });
  }

  if (!readiness.authorityPass) {
    return Object.freeze({
      admissible: false,
      accepted: false,
      blockedReason: "authority_receipt_failed",
      family: "ROUTE_DOOR"
    });
  }

  if (!normalizeBoolean(unlocks.underground, false)) {
    return Object.freeze({
      admissible: false,
      accepted: false,
      blockedReason: "door_unlock_incomplete",
      family: "ROUTE_DOOR"
    });
  }

  return Object.freeze({
    admissible: true,
    accepted: true,
    blockedReason: "",
    family: "ROUTE_DOOR"
  });
}

function evaluatePreludeTransition(runtime, request) {
  const readiness = evaluateSystemReadiness(runtime);

  if (!request.explicitUserAction) {
    return Object.freeze({
      admissible: false,
      accepted: false,
      blockedReason: "user_action_required",
      family: "ROUTE_PRELUDE"
    });
  }

  if (!readiness.authorityPass) {
    return Object.freeze({
      admissible: false,
      accepted: false,
      blockedReason: "authority_receipt_failed",
      family: "ROUTE_PRELUDE"
    });
  }

  return Object.freeze({
    admissible: true,
    accepted: true,
    blockedReason: "",
    family: "ROUTE_PRELUDE"
  });
}

function evaluateUnknownTransition() {
  return Object.freeze({
    admissible: false,
    accepted: false,
    blockedReason: "unknown_route_family",
    family: "UNKNOWN"
  });
}

function evaluateRouteTransition(runtime, request) {
  const family = routeFamily(request.toRoute);

  if (family === "PRODUCTS") return evaluateProductsTransition(runtime, request);
  if (family === "EXPLORE") return evaluateExploreTransition(runtime, request);
  if (family === "LAWS") return evaluateLawsTransition(runtime, request);
  if (family === "GAUGES") return evaluateGaugesTransition(runtime, request);
  if (family === "DOOR") return evaluateDoorTransition(runtime, request);
  if (family === "PRELUDE") return evaluatePreludeTransition(runtime, request);
  if (family === "HOME") {
    return Object.freeze({
      admissible: true,
      accepted: true,
      blockedReason: "",
      family: "ROUTE_HOME"
    });
  }

  return evaluateUnknownTransition(runtime, request);
}

function buildTransitionReceipt(runtime, input = {}) {
  const request = buildBaseTransitionRequest(input);
  const summary = getSummary(runtime);
  const completion = getCompletion(runtime);
  const authorityReceipt = getAuthorityReceipt(runtime);
  const unlocks = getUnlocks(runtime);
  const progress = getProgress(runtime);

  let decision = Object.freeze({
    admissible: false,
    accepted: false,
    blockedReason: "no_transition_class",
    family: "UNKNOWN"
  });

  if (isModeTransition(request)) {
    decision = evaluateModeTransition(runtime, request);
  } else if (isRouteTransition(request)) {
    decision = evaluateRouteTransition(runtime, request);
  }

  return Object.freeze({
    proposed: request.proposed,
    family: decision.family,
    admissible: decision.admissible,
    accepted: decision.accepted,
    blockedReason: decision.blockedReason,
    request,
    context: Object.freeze({
      fromRoute: request.fromRoute,
      toRoute: request.toRoute,
      fromMode: request.fromMode,
      toMode: request.toMode,
      toRouteFamily: routeFamily(request.toRoute),
      toModeFamily: modeFamily(request.toMode),
      continentCount: isFiniteNumber(summary.continentCount) ? summary.continentCount : 0,
      completionPass: normalizeBoolean(completion.pass, false),
      authorityPass: normalizeBoolean(authorityReceipt.pass, false),
      summitCompletion: isFiniteNumber(progress.summitCompletion) ? progress.summitCompletion : 0,
      unlockKeys: normalizeArray(Object.keys(unlocks))
    })
  });
}

export function createTransitionEngine() {
  function evaluate(runtime, input = {}) {
    return buildTransitionReceipt(runtime, input);
  }

  function update(runtime, input = {}) {
    const target = normalizeObject(runtime);
    const receipt = buildTransitionReceipt(target, input);
    target.transition = receipt;
    return target;
  }

  return Object.freeze({
    evaluate,
    update
  });
}
