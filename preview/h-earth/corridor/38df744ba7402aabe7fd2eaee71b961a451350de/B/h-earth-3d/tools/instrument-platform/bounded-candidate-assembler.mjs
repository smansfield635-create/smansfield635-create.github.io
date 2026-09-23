import { canonicalDigest, clone, deepFreeze, requireNonEmptyString, uniqueStrings } from './platform-core.mjs';
import { routeChangeClass } from './change-class-router.mjs';

function statusEstablished(value) { return value?.status === 'ESTABLISHED' && typeof value?.statement === 'string' && value.statement.trim() !== ''; }
function normalizeBranchToken(value) { return String(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 56) || 'bounded-candidate'; }

export function assembleBoundedCandidate(input) {
  const refusalReasons = [];
  const context = input?.exactProjectContext;
  if (!context?.projectContextId || !context?.sourceHead) refusalReasons.push('EXACT_PROJECT_CONTEXT_UNRESOLVED');
  if (!statusEstablished(input?.establishedDiagnosis)) refusalReasons.push('DIAGNOSIS_NOT_ESTABLISHED');
  if (!statusEstablished(input?.perceptualTarget)) refusalReasons.push('PERCEPTUAL_TARGET_UNRESOLVED');
  if (!statusEstablished(input?.causalTarget)) refusalReasons.push('CAUSAL_TARGET_UNRESOLVED');

  let exactChangedPaths = [];
  try { exactChangedPaths = uniqueStrings(input?.authorizedMutationManifest?.exactChangedPaths, 'EXACT_CHANGED_PATHS'); }
  catch { refusalReasons.push('MUTATION_SCOPE_UNBOUNDED'); }

  let route = null;
  try { route = routeChangeClass(input?.authorizedMutationManifest?.changeClass); }
  catch { refusalReasons.push('CHANGE_CLASS_UNRESOLVED'); }

  const protectedAuthorities = Array.isArray(input?.protectedAuthoritySet) ? input.protectedAuthoritySet : [];
  const protectedPaths = new Set(protectedAuthorities.flatMap((entry) => entry?.paths ?? []).filter(Boolean));
  const protectedConflicts = exactChangedPaths.filter((path) => protectedPaths.has(path));
  if (protectedConflicts.length) refusalReasons.push('PROTECTED_AUTHORITY_CONFLICT');

  const verificationMatrix = input?.requiredVerificationMatrix;
  if (!Array.isArray(verificationMatrix) || verificationMatrix.length === 0 || verificationMatrix.some((entry) => !entry?.checkId || !entry?.authorityClass)) refusalReasons.push('VERIFICATION_MATRIX_INCOMPLETE');

  const rollback = input?.rollbackRelation;
  if (!rollback?.baseHead || !rollback?.rollbackTarget || rollback.baseHead !== context?.sourceHead) refusalReasons.push('ROLLBACK_RELATION_MISSING_OR_INEXACT');
  if (!input?.stopBoundary) refusalReasons.push('STOP_BOUNDARY_MISSING');
  if (input?.presumesUserAcceptance === true) refusalReasons.push('USER_ACCEPTANCE_BEING_PRESUMED');

  if (refusalReasons.length) return deepFreeze({ schemaVersion: 'H_EARTH_BOUNDED_CANDIDATE_ASSEMBLER_RESULT_v1', authorized: false, classification: 'CANDIDATE_ASSEMBLY_REFUSED', refusalReasons: [...new Set(refusalReasons)], protectedConflicts, productMutationPerformed: false, liveStateChanged: false });

  const operationId = requireNonEmptyString(input.operationId, 'OPERATION_ID');
  const planBasis = { operationId, projectContextId: context.projectContextId, sourceHead: context.sourceHead, diagnosis: input.establishedDiagnosis, perceptualTarget: input.perceptualTarget, causalTarget: input.causalTarget, exactChangedPaths, changeClass: route.changeClass, rollback };
  const planDigest = canonicalDigest(planBasis);
  const branchName = `agent/${normalizeBranchToken(operationId)}-${planDigest.slice(-8)}`;
  const expectedBlobIdentities = Object.fromEntries(exactChangedPaths.map((path) => [path, { status: 'EXPECTED_AFTER_EXACT_WRITE_AND_FETCH_BACK', required: true, expectedBlob: input.authorizedMutationManifest.expectedBlobIdentities?.[path] ?? null }]));

  return deepFreeze({
    schemaVersion: 'H_EARTH_BOUNDED_CANDIDATE_ASSEMBLER_RESULT_v1', authorized: true, classification: 'CANDIDATE_ASSEMBLY_PLAN_AUTHORIZED', operationId,
    isolatedBranch: branchName, exactBaseHead: context.sourceHead, exactChangedPaths, expectedBlobIdentities, frozenAuthorities: clone(protectedAuthorities), rollbackRelation: clone(rollback),
    verificationPlan: clone(verificationMatrix), routedToolchain: route,
    liveAdmissionEligibilityRule: route.liveAdmissionRequired ? 'ENGINEERING_PASS_AND_SEPARATE_BOUNDED_LIVE_ADMISSION_REQUIRED' : 'NO_LIVE_ADMISSION_IN_THIS_CHANGE_CLASS',
    userDifferentialRequirement: route.userDifferentialRequired, stopBoundary: input.stopBoundary, planDigest,
    sourceImplementationPerformed: false, productMutationPerformed: false, liveStateChanged: false
  });
}

export default assembleBoundedCandidate;
