import { canonicalDigest, clone, deepFreeze, requireNonEmptyString } from './platform-core.mjs';

function refused(controller, reasons) {
  return deepFreeze({ schemaVersion: `${controller}_RESULT_v1`, authorized: false, classification: `${controller}_REFUSED`, refusalReasons: reasons, liveStateChanged: false, productAcceptanceChanged: false, publicDefaultChanged: false });
}

export function evaluateBoundedLiveAdmission(input) {
  const reasons = [];
  if (input?.currentAuthorityState !== 'ENGINEERING_PASS') reasons.push('ENGINEERING_PASS_REQUIRED');
  if (input?.engineeringReceipt?.verificationMatrixPassed !== true) reasons.push('VERIFICATION_MATRIX_PASS_REQUIRED');
  if (input?.admissionManifest?.bounded !== true) reasons.push('BOUNDED_ADMISSION_MANIFEST_REQUIRED');
  if (!input?.admissionManifest?.candidateRoute || !input?.admissionManifest?.candidateBinding) reasons.push('CANDIDATE_ROUTE_AND_BINDING_REQUIRED');
  if (!input?.rollbackRelation?.rollbackTarget) reasons.push('ROLLBACK_RELATION_REQUIRED');
  if (input?.presumesAcceptance === true) reasons.push('ADMISSION_CANNOT_PRESUME_ACCEPTANCE');
  if (reasons.length) return refused('H_EARTH_BOUNDED_LIVE_ADMISSION_CONTROLLER', reasons);
  const body = { schemaVersion: 'H_EARTH_BOUNDED_LIVE_ADMISSION_RECEIPT_v1', candidateId: requireNonEmptyString(input.candidateId, 'CANDIDATE_ID'), engineeringReceipt: clone(input.engineeringReceipt), admissionManifest: clone(input.admissionManifest), rollbackRelation: clone(input.rollbackRelation), authorityEstablished: 'LIVE_AVAILABLE', productAccepted: false, defaultPromoted: false, stopBoundary: 'STOP_AFTER_BOUNDED_LIVE_CANDIDATE_ADMISSION_BEFORE_PUBLIC_CANDIDATE_VERIFICATION' };
  return deepFreeze({ authorized: true, classification: 'BOUNDED_LIVE_ADMISSION_AUTHORIZED', ...body, receiptDigest: canonicalDigest(body) });
}

export function evaluatePublicCandidateVerification(input) {
  const reasons = [];
  if (input?.currentAuthorityState !== 'LIVE_AVAILABLE') reasons.push('LIVE_AVAILABLE_REQUIRED');
  if (input?.routeVerified !== true) reasons.push('PUBLIC_ROUTE_VERIFICATION_REQUIRED');
  if (input?.bindingVerified !== true) reasons.push('PUBLIC_BINDING_VERIFICATION_REQUIRED');
  if (input?.runtimeVerified !== true) reasons.push('PUBLIC_RUNTIME_VERIFICATION_REQUIRED');
  if (reasons.length) return refused('H_EARTH_PUBLIC_CANDIDATE_VERIFICATION_CONTROLLER', reasons);
  const body = { schemaVersion: 'H_EARTH_PUBLIC_CANDIDATE_VERIFICATION_RECEIPT_v1', candidateId: requireNonEmptyString(input.candidateId, 'CANDIDATE_ID'), publicRoute: requireNonEmptyString(input.publicRoute, 'PUBLIC_ROUTE'), publicBinding: requireNonEmptyString(input.publicBinding, 'PUBLIC_BINDING'), routeVerified: true, bindingVerified: true, runtimeVerified: true, authorityEstablished: 'PUBLIC_CANDIDATE_VERIFIED', stopBoundary: 'STOP_AFTER_PUBLIC_CANDIDATE_VERIFICATION_BEFORE_USER_DIFFERENTIAL' };
  return deepFreeze({ authorized: true, classification: 'PUBLIC_CANDIDATE_VERIFIED', ...body, receiptDigest: canonicalDigest(body) });
}

export function recordUserDifferential(input) {
  const reasons = [];
  if (input?.currentAuthorityState !== 'PUBLIC_CANDIDATE_VERIFIED') reasons.push('PUBLIC_CANDIDATE_VERIFIED_REQUIRED');
  if (!input?.baselineId || !input?.candidateId || input.baselineId === input.candidateId) reasons.push('DISTINCT_BASELINE_AND_CANDIDATE_REQUIRED');
  if (!['ACCEPT', 'REJECT', 'RECONCILE'].includes(input?.userDisposition)) reasons.push('USER_DISPOSITION_REQUIRED');
  if (!Array.isArray(input?.observations) || input.observations.length === 0) reasons.push('USER_OBSERVATIONS_REQUIRED');
  if (input?.automatedSubstitution === true) reasons.push('AUTOMATED_SUBSTITUTION_FOR_USER_DIFFERENTIAL_PROHIBITED');
  if (reasons.length) return refused('H_EARTH_USER_DIFFERENTIAL_RECORDER', reasons);
  const body = { schemaVersion: 'H_EARTH_USER_DIFFERENTIAL_RECEIPT_v1', baselineId: input.baselineId, candidateId: input.candidateId, userDisposition: input.userDisposition, observations: clone(input.observations), comparisonContext: clone(input.comparisonContext ?? {}), authorityEstablished: 'USER_DIFFERENTIAL_RECORDED', nextAuthorityState: { ACCEPT: 'ACCEPTED', REJECT: 'REJECTED', RECONCILE: 'RECONCILIATION_REQUIRED' }[input.userDisposition], stopBoundary: 'STOP_AFTER_USER_DIFFERENTIAL_DISPOSITION' };
  return deepFreeze({ authorized: true, classification: 'USER_DIFFERENTIAL_RECORDED', ...body, receiptDigest: canonicalDigest(body) });
}

export function evaluateDefaultPromotion(input) {
  const reasons = [];
  if (input?.currentAuthorityState !== 'ACCEPTED') reasons.push('ACCEPTED_CANDIDATE_REQUIRED');
  if (input?.userDifferentialReceipt?.userDisposition !== 'ACCEPT') reasons.push('USER_ACCEPT_DIFFERENTIAL_REQUIRED');
  if (input?.separatePromotionManifest?.separateOperation !== true) reasons.push('SEPARATE_PROMOTION_OPERATION_REQUIRED');
  if (!input?.separatePromotionManifest?.targetDefaultRoute || !input?.separatePromotionManifest?.targetBinding) reasons.push('DEFAULT_ROUTE_AND_BINDING_TARGET_REQUIRED');
  if (input?.publicDefaultReverified === true) reasons.push('PROMOTION_AND_REVERIFICATION_MUST_REMAIN_SEPARATE');
  if (reasons.length) return refused('H_EARTH_DEFAULT_PROMOTION_CONTROLLER', reasons);
  const body = { schemaVersion: 'H_EARTH_DEFAULT_PROMOTION_AUTHORIZATION_v1', candidateId: requireNonEmptyString(input.candidateId, 'CANDIDATE_ID'), promotionManifest: clone(input.separatePromotionManifest), authorityEstablished: 'DEFAULT_PROMOTED_AFTER_EXECUTION_ONLY', publicDefaultReverificationRequired: true, stopBoundary: 'STOP_AFTER_DEFAULT_PROMOTION_BEFORE_PUBLIC_DEFAULT_REVERIFICATION' };
  return deepFreeze({ authorized: true, classification: 'DEFAULT_PROMOTION_AUTHORIZED', ...body, authorizationDigest: canonicalDigest(body) });
}

export function evaluatePublicDefaultReverification(input) {
  const reasons = [];
  if (input?.currentAuthorityState !== 'DEFAULT_PROMOTED') reasons.push('DEFAULT_PROMOTED_REQUIRED');
  if (input?.defaultRouteVerified !== true) reasons.push('DEFAULT_ROUTE_VERIFICATION_REQUIRED');
  if (input?.defaultBindingVerified !== true) reasons.push('DEFAULT_BINDING_VERIFICATION_REQUIRED');
  if (input?.defaultRuntimeVerified !== true) reasons.push('DEFAULT_RUNTIME_VERIFICATION_REQUIRED');
  if (reasons.length) return refused('H_EARTH_PUBLIC_DEFAULT_REVERIFICATION_CONTROLLER', reasons);
  const body = { schemaVersion: 'H_EARTH_PUBLIC_DEFAULT_REVERIFICATION_RECEIPT_v1', candidateId: requireNonEmptyString(input.candidateId, 'CANDIDATE_ID'), defaultRouteVerified: true, defaultBindingVerified: true, defaultRuntimeVerified: true, authorityEstablished: 'PUBLIC_DEFAULT_REVERIFIED', stopBoundary: 'STOP_AFTER_PUBLIC_DEFAULT_REVERIFICATION' };
  return deepFreeze({ authorized: true, classification: 'PUBLIC_DEFAULT_REVERIFIED', ...body, receiptDigest: canonicalDigest(body) });
}
