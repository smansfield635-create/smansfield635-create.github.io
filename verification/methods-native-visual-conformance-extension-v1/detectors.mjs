export const EXTENSION_CONTRACT = 'METHODS_NATIVE_VISUAL_CONFORMANCE_EXTENSION_v1';

export function overlap(a, b, tolerance = 1.5) {
  if (!a || !b) return null;
  const left = Math.max(a.left, b.left);
  const top = Math.max(a.top, b.top);
  const right = Math.min(a.right, b.right);
  const bottom = Math.min(a.bottom, b.bottom);
  const width = right - left;
  const height = bottom - top;
  if (width <= tolerance || height <= tolerance) return null;
  return { left, top, right, bottom, width, height, area: width * height };
}

export function clippedToViewport(rect, viewport, tolerance = 1.5) {
  if (!rect) return true;
  return rect.left < -tolerance || rect.right > viewport.width + tolerance ||
    rect.top < -tolerance || rect.bottom > viewport.height + tolerance;
}

export function visibleArea(rect, viewport) {
  if (!rect) return 0;
  const left = Math.max(0, rect.left);
  const top = Math.max(0, rect.top);
  const right = Math.min(viewport.width, rect.right);
  const bottom = Math.min(viewport.height, rect.bottom);
  return Math.max(0, right - left) * Math.max(0, bottom - top);
}

export function isViewportVisible(rect, viewport, minimumArea = 64) {
  return visibleArea(rect, viewport) >= minimumArea;
}

export function detectPairwiseCollisions(snapshot, pairs) {
  const findings = [];
  for (const [first, second] of pairs) {
    const intersection = overlap(snapshot.surfaces[first], snapshot.surfaces[second]);
    if (!intersection) continue;
    findings.push({
      code: 'PROHIBITED_REGION_COLLISION',
      detail: { first, second, intersection }
    });
  }
  return findings;
}

export function detectTransitionContext(before, after, options = {}) {
  const findings = [];
  const maxScrollDelta = options.maxScrollDelta ?? 32;
  const orientation = options.orientationSurfaces ?? ['title', 'cameraControls'];
  const delta = Math.abs((after.scrollY ?? 0) - (before.scrollY ?? 0));
  if (delta > maxScrollDelta) {
    findings.push({
      code: 'STATE_TRANSITION_SCROLL_DISPLACEMENT',
      detail: { before: before.scrollY, after: after.scrollY, delta, maxScrollDelta }
    });
  }
  for (const surface of orientation) {
    const wasVisible = Boolean(before.visibility?.[surface]);
    const remainsVisible = Boolean(after.visibility?.[surface]);
    if (wasVisible && !remainsVisible) {
      findings.push({
        code: 'STATE_TRANSITION_ORIENTATION_LOST',
        detail: { surface }
      });
    }
  }
  if (before.instrumentIdentity && after.instrumentIdentity && before.instrumentIdentity !== after.instrumentIdentity) {
    findings.push({
      code: 'STATE_TRANSITION_INSTRUMENT_IDENTITY_CHANGED',
      detail: { before: before.instrumentIdentity, after: after.instrumentIdentity }
    });
  }
  return findings;
}

export function detectVerticalBudget(snapshot, options = {}) {
  const findings = [];
  const essential = options.essentialSurfaces ?? ['title', 'cameraControls', 'family', 'card', 'lensTabs', 'lensPanel', 'coordinatePanel'];
  const hiddenBelow = essential.filter(name => {
    const rect = snapshot.surfaces[name];
    return rect && rect.top >= snapshot.viewport.height - 1;
  });
  const partiallyCut = essential.filter(name => {
    const rect = snapshot.surfaces[name];
    return rect && rect.top < snapshot.viewport.height && rect.bottom > snapshot.viewport.height + 1;
  });
  const hasCommunicatedContinuation = Boolean(snapshot.continuation?.visible) ||
    (snapshot.stageOverflowY === 'auto' || snapshot.stageOverflowY === 'scroll') && Boolean(snapshot.continuation?.semanticLabel);
  if ((hiddenBelow.length || partiallyCut.length) && !hasCommunicatedContinuation) {
    findings.push({
      code: 'VERTICAL_BUDGET_UNCOMMUNICATED',
      detail: {
        hiddenBelow,
        partiallyCut,
        viewportHeight: snapshot.viewport.height,
        stageBottom: snapshot.surfaces.stage?.bottom,
        stageOverflowY: snapshot.stageOverflowY
      }
    });
  }
  return findings;
}

export function detectCameraRoleDifferentiation(overview, browse, options = {}) {
  const findings = [];
  const minimumCardAreaDelta = options.minimumCardAreaDelta ?? 0.04;
  const minimumContextDelta = options.minimumContextDelta ?? 1;
  const cardDelta = (browse.cardAreaRatio ?? 0) - (overview.cardAreaRatio ?? 0);
  const contextDelta = (overview.contextVisibilityCount ?? 0) - (browse.contextVisibilityCount ?? 0);
  const contextAreaDelta = (overview.contextAreaRatio ?? 0) - (browse.contextAreaRatio ?? 0);
  const minimumContextAreaDelta = options.minimumContextAreaDelta ?? 0.035;
  if (cardDelta < minimumCardAreaDelta) {
    findings.push({
      code: 'CAMERA_BROWSE_FOCUS_INSUFFICIENT',
      detail: { cardDelta, minimumCardAreaDelta, overview: overview.cardAreaRatio, browse: browse.cardAreaRatio }
    });
  }
  if (contextDelta < minimumContextDelta && contextAreaDelta < minimumContextAreaDelta) {
    findings.push({
      code: 'CAMERA_OVERVIEW_CONTEXT_INSUFFICIENT',
      detail: {
        contextDelta,
        minimumContextDelta,
        contextAreaDelta,
        minimumContextAreaDelta,
        overviewCount: overview.contextVisibilityCount,
        browseCount: browse.contextVisibilityCount
      }
    });
  }
  if (findings.length) {
    findings.push({
      code: 'CAMERA_ROLE_DIFFERENTIATION_INSUFFICIENT',
      detail: { cardDelta, contextDelta, contextAreaDelta }
    });
  }
  return findings;
}

export function detectMobileRouteContinuity(snapshot) {
  if (snapshot.viewport.width > 760) return [];
  if (snapshot.routes?.currentMethodsVisible) return [];
  if (snapshot.routes?.singleActionNavigationVisible) return [];
  return [{
    code: 'MOBILE_ROUTE_CONTINUITY_MISSING',
    detail: {
      currentMethodsPresent: snapshot.routes?.currentMethodsPresent,
      currentMethodsVisible: snapshot.routes?.currentMethodsVisible,
      staticCatalogVisible: snapshot.routes?.staticCatalogVisible,
      singleActionNavigationVisible: snapshot.routes?.singleActionNavigationVisible
    }
  }];
}

export function validateHumanFactorsReceipt(receipt) {
  const requiredJudgments = [
    'visualWeightHierarchy',
    'methodsIdentity',
    'visualRhythm',
    'perceptualEffort',
    'cameraRoleClarity',
    'mobileContextContinuity'
  ];
  if (!receipt) return { status: 'UNEVALUABLE_PENDING_HUMAN_FACTORS', errors: ['HUMAN_RECEIPT_ABSENT'] };
  const errors = [];
  if (!receipt.reviewer?.id || receipt.reviewer.type !== 'HUMAN') errors.push('IDENTIFIED_HUMAN_REVIEWER_REQUIRED');
  if (!receipt.candidateHead) errors.push('CANDIDATE_HEAD_REQUIRED');
  for (const judgment of requiredJudgments) {
    if (!['PASS', 'FAIL'].includes(receipt.judgments?.[judgment])) errors.push(`JUDGMENT_REQUIRED:${judgment}`);
  }
  if (errors.length) return { status: 'UNEVALUABLE_INVALID_HUMAN_FACTORS_RECEIPT', errors };
  const failed = requiredJudgments.filter(key => receipt.judgments[key] === 'FAIL');
  return failed.length
    ? { status: 'FAIL_HUMAN_FACTORS', errors: [], failed }
    : { status: 'PASS_HUMAN_FACTORS', errors: [], failed: [] };
}
