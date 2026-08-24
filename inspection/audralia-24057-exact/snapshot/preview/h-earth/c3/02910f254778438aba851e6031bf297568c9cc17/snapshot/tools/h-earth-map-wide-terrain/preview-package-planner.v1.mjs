#!/usr/bin/env node
import { fail, hashObject } from './lib.v1.mjs';

const REQUIRED_CAMERAS = ['MAP_OVERHEAD','REGIONAL_MATCHED','ESTATE_ENVELOPE','TRAVERSAL_CORRIDOR','COASTAL_VIEW','PERFORMANCE_DIAGNOSTIC'];
const REQUIRED_COMPARISONS = ['ACCEPTED_BASELINE','MAP_WIDE_SUCCESSOR','ESTATE_MASK_OVERLAY'];

export function planPreviewPackage({ requirements, acceptedReference, estateValidation }) {
  for (const camera of REQUIRED_CAMERAS) if (!requirements.requiredCameraClasses.includes(camera)) fail('PREVIEW_CAMERA_CLASS_MISSING', camera);
  for (const comparison of REQUIRED_COMPARISONS) if (!requirements.requiredComparisonClasses.includes(comparison)) fail('PREVIEW_COMPARISON_CLASS_MISSING', comparison);
  if (!requirements.rollbackIdentity) fail('ROLLBACK_IDENTITY_MISSING');
  if (!requirements.performanceEvidence) fail('PERFORMANCE_EVIDENCE_MISSING');
  const payload = {
    cameraClasses: requirements.requiredCameraClasses,
    comparisonClasses: requirements.requiredComparisonClasses,
    rollbackIdentity: requirements.rollbackIdentity,
    performanceEvidence: true,
    acceptedReference,
    estateReservationId: estateValidation.reservationId,
    userDifferentialRequired: true,
    promotionAllowed: false
  };
  return { schema: 'MAP_WIDE_PREVIEW_REVIEW_PACKAGE_PLAN_v1', ...payload, planDigest: hashObject(payload) };
}
