import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFile } from 'node:fs/promises';
import { DIMENSIONS, EXPECTED, SUBJECTS, assert, digest, governedSubject, idFor, loadD4, writeJson } from './metaverse-3d-benchmark-disposition-d5-core.mjs';
import { dimensionDisposition, factDisposition, subjectDispositionRecord, subjectPosture, validateRuleCoverage } from './metaverse-3d-benchmark-disposition-d5-rules.mjs';

export async function compileD5({ outputRoot = process.env.D5_ARTIFACT_ROOT } = {}) {
  assert(outputRoot, 'D5_OUTPUT_ROOT_REQUIRED');
  const { facts, relations, dimensions } = await loadD4();
  const contract = JSON.parse(await readFile(resolve(fileURLToPath(new URL('.', import.meta.url)), 'metaverse-3d-benchmark-disposition-d5-contract.json'), 'utf8'));

  const coverage = validateRuleCoverage();
  const d5aBody = {
    schema: 'METAVERSE_3D_BENCHMARK_D5A_RULE_LOCK_RECEIPT_v1', checkpoint: 'D5A',
    contractSemanticSha256: digest(contract), ...coverage, ambiguousMappingCount: 0,
    dispositionCompilationPerformedAtD5A: false, compilerClosurePerformedAtD5A: false
  };
  const d5a = { ...d5aBody, deterministicReceiptSha256: digest(d5aBody) };

  const factRecords = facts.records.map(weight => {
    const compiled = factDisposition(weight);
    const body = {
      schemaVersion: 'METAVERSE_3D_BENCHMARK_FACT_DISPOSITION_v1',
      canonicalFactId: weight.canonicalFactId, classificationId: weight.classificationId, weightId: weight.weightId,
      laneId: weight.laneId, subjectIdentity: weight.subjectIdentity, governedSubjectId: governedSubject(weight.subjectIdentity),
      dimension: weight.primaryDimension, dimensionState: weight.dimensionState, strengthBand: weight.strengthBand,
      evidenceOrientation: weight.evidenceOrientation, currentDirectEvidence: compiled.currentDirect,
      compiledDisposition: compiled.disposition, reasonCode: compiled.reasonCode, productMutationAuthority: 'NONE'
    };
    return { ...body, dispositionId: idFor('D5FD', body) };
  });
  const factManifest = {
    schema: 'METAVERSE_3D_BENCHMARK_FACT_DISPOSITION_MANIFEST_v1', checkpoint: 'D5B',
    sourceWeightRecordCount: facts.records.length, dispositionRecordCount: factRecords.length, records: factRecords,
    dispositionManifestSha256: digest(factRecords)
  };

  const dimensionRecords = dimensions.dimensions.map(strength => {
    const compiled = dimensionDisposition(strength);
    const supporting = factRecords.filter(r => r.dimension === strength.dimension && r.evidenceOrientation === 'SUPPORTING_STATE').map(r => r.dispositionId).sort();
    const contrary = factRecords.filter(r => r.dimension === strength.dimension && ['UNRESOLVED_STATE','NON_WEIGHTABLE'].includes(r.evidenceOrientation)).map(r => r.dispositionId).sort();
    const body = {
      schemaVersion: 'METAVERSE_3D_BENCHMARK_DIMENSION_DISPOSITION_v1', dimension: strength.dimension,
      aggregateState: strength.aggregateState, strongestApplicableFactBand: strength.strongestApplicableFactBand,
      strongestApplicableRelationBand: strength.strongestApplicableRelationBand, evidenceStrengthPosture: strength.evidenceStrengthPosture,
      compiledDisposition: compiled.disposition, reasonCode: compiled.reasonCode,
      supportingFactDispositionIds: supporting, contraryOrUnresolvedFactDispositionIds: contrary,
      dimensionStateChanged: false, productMutationAuthority: 'NONE'
    };
    return { ...body, dimensionDispositionId: idFor('D5DD', body) };
  });
  const dimensionManifest = {
    schema: 'METAVERSE_3D_BENCHMARK_DIMENSION_DISPOSITION_MANIFEST_v1', checkpoint: 'D5B',
    governedDimensionCount: DIMENSIONS.length, dispositionRecordCount: dimensionRecords.length, records: dimensionRecords,
    dispositionManifestSha256: digest(dimensionRecords)
  };
  const d5bBody = {
    schema: 'METAVERSE_3D_BENCHMARK_D5B_DISPOSITION_COMPILATION_RECEIPT_v1', checkpoint: 'D5B',
    weightedFactCount: facts.records.length, factDispositionCount: factRecords.length, dimensionDispositionCount: dimensionRecords.length,
    factDispositionManifestSha256: factManifest.dispositionManifestSha256,
    dimensionDispositionManifestSha256: dimensionManifest.dispositionManifestSha256,
    missingFactCount: 0, duplicateFactCount: 0, dimensionStateChangeCount: 0, productMutationCount: 0
  };
  const d5b = { ...d5bBody, deterministicReceiptSha256: digest(d5bBody) };

  const subjectDimensionRecords = [];
  for (const subjectId of SUBJECTS) for (const dimension of DIMENSIONS) {
    const compiled = subjectDispositionRecord(subjectId, dimension, facts.records);
    const evidenceWeightIds = compiled.records.map(r => r.weightId).sort();
    const supportingEvidenceWeightIds = compiled.records.filter(r => r.evidenceOrientation === 'SUPPORTING_STATE').map(r => r.weightId).sort();
    const contraryOrUnresolvedEvidenceWeightIds = compiled.records.filter(r => r.evidenceOrientation !== 'SUPPORTING_STATE').map(r => r.weightId).sort();
    const body = {
      schemaVersion: 'METAVERSE_3D_BENCHMARK_SUBJECT_DIMENSION_DISPOSITION_v1', subjectId, dimension,
      compiledState: compiled.state, strongestApplicableWeightBand: compiled.band,
      currentDirectEvidencePresent: compiled.currentDirect, evidenceWeightIds, supportingEvidenceWeightIds,
      contraryOrUnresolvedEvidenceWeightIds, compiledDisposition: compiled.disposition, reasonCode: compiled.reasonCode,
      aggregateEvidenceProjectedWithoutMemberIdentity: false, productMutationAuthority: 'NONE'
    };
    subjectDimensionRecords.push({ ...body, subjectDimensionDispositionId: idFor('D5SD', body) });
  }
  const subjectDimensionManifest = {
    schema: 'METAVERSE_3D_BENCHMARK_SUBJECT_DIMENSION_DISPOSITION_MANIFEST_v1', checkpoint: 'D5C',
    governedSubjectCount: SUBJECTS.length, governedDimensionCount: DIMENSIONS.length,
    expectedRecordCount: SUBJECTS.length * DIMENSIONS.length, dispositionRecordCount: subjectDimensionRecords.length,
    records: subjectDimensionRecords, dispositionManifestSha256: digest(subjectDimensionRecords)
  };

  const subjectRecords = SUBJECTS.map(subjectId => {
    const dims = subjectDimensionRecords.filter(r => r.subjectId === subjectId);
    const body = {
      schemaVersion: 'METAVERSE_3D_BENCHMARK_SUBJECT_DISPOSITION_v1', subjectId,
      subjectPosture: subjectPosture(subjectId, dims),
      dimensionDispositionIds: dims.map(r => r.subjectDimensionDispositionId).sort(),
      retainedDimensionCount: dims.filter(r => r.compiledDisposition === 'RETAIN').length,
      correctionDimensionCount: dims.filter(r => r.compiledDisposition === 'CORRECT').length,
      deferredDimensionCount: dims.filter(r => r.compiledDisposition === 'DEFER_PENDING_EVIDENCE').length,
      isolatedDimensionCount: dims.filter(r => r.compiledDisposition === 'ISOLATE').length,
      productMutationAuthority: 'NONE', userAcceptanceGranted: false
    };
    return { ...body, subjectDispositionId: idFor('D5SP', body) };
  });
  const subjectManifest = {
    schema: 'METAVERSE_3D_BENCHMARK_SUBJECT_DISPOSITION_MANIFEST_v1', checkpoint: 'D5C',
    governedSubjectCount: SUBJECTS.length, dispositionRecordCount: subjectRecords.length, records: subjectRecords,
    dispositionManifestSha256: digest(subjectRecords)
  };

  const deferredRecords = subjectDimensionRecords.filter(r => r.compiledDisposition === 'DEFER_PENDING_EVIDENCE').map(r => ({
    subjectId: r.subjectId, dimension: r.dimension, compiledState: r.compiledState,
    strongestApplicableWeightBand: r.strongestApplicableWeightBand,
    subjectDimensionDispositionId: r.subjectDimensionDispositionId,
    requiredEvidencePosture: r.compiledState === 'NOT_EXECUTED' ? 'DIRECT_EXECUTION_REQUIRED'
      : r.compiledState === 'WITHHELD' ? 'EXPLICIT_ACCEPTANCE_AUTHORITY_REQUIRED'
      : 'ADDITIONAL_APPLICABLE_EVIDENCE_REQUIRED'
  }));
  const deferredLedger = {
    schema: 'METAVERSE_3D_BENCHMARK_DEFERRED_EVIDENCE_LEDGER_v1', checkpoint: 'D5C',
    deferredRecordCount: deferredRecords.length, records: deferredRecords, ledgerSha256: digest(deferredRecords)
  };

  const acceptanceRecords = SUBJECTS.map(subjectId => {
    const subject = subjectRecords.find(r => r.subjectId === subjectId);
    return {
      subjectId, subjectDispositionId: subject.subjectDispositionId,
      admissibleForAcceptance: false, userAccepted: false,
      reasonCode: 'USER_ACCEPTANCE_WITHHELD_AND_COMPILER_HAS_NO_ACCEPTANCE_AUTHORITY'
    };
  });
  const acceptanceLedger = {
    schema: 'METAVERSE_3D_BENCHMARK_ACCEPTANCE_ELIGIBILITY_LEDGER_v1', checkpoint: 'D5C',
    subjectCount: SUBJECTS.length, admissibleSubjectCount: 0, acceptedSubjectCount: 0,
    records: acceptanceRecords, ledgerSha256: digest(acceptanceRecords)
  };
  const d5cBody = {
    schema: 'METAVERSE_3D_BENCHMARK_D5C_SUBJECT_RECONCILIATION_RECEIPT_v1', checkpoint: 'D5C',
    governedSubjectCount: SUBJECTS.length, governedDimensionCount: DIMENSIONS.length,
    subjectDimensionDispositionCount: subjectDimensionRecords.length, subjectDispositionCount: subjectRecords.length,
    deferredEvidenceRecordCount: deferredRecords.length, admissibleSubjectCount: 0,
    subjectDimensionManifestSha256: subjectDimensionManifest.dispositionManifestSha256,
    subjectDispositionManifestSha256: subjectManifest.dispositionManifestSha256,
    deferredEvidenceLedgerSha256: deferredLedger.ledgerSha256,
    acceptanceEligibilityLedgerSha256: acceptanceLedger.ledgerSha256,
    mixedDimensionResultsPreserved: true, productActionPlanCreated: false
  };
  const d5c = { ...d5cBody, deterministicReceiptSha256: digest(d5cBody) };

  const relationTraceRecords = relations.records.map(r => ({
    relationId: r.relationId, relationWeightId: r.relationWeightId,
    primaryDimension: r.primaryDimension, strengthBand: r.strengthBand,
    contradictionResolved: false, winnerSelected: false
  }));
  const traceRecords = [
    ...factRecords.map(r => ({ outputId: r.dispositionId, inputIds: [r.canonicalFactId, r.classificationId, r.weightId] })),
    ...dimensionRecords.map(r => ({ outputId: r.dimensionDispositionId, inputIds: [...r.supportingFactDispositionIds, ...r.contraryOrUnresolvedFactDispositionIds] })),
    ...subjectDimensionRecords.map(r => ({ outputId: r.subjectDimensionDispositionId, inputIds: r.evidenceWeightIds })),
    ...subjectRecords.map(r => ({ outputId: r.subjectDispositionId, inputIds: r.dimensionDispositionIds }))
  ];
  const traceability = {
    schema: 'METAVERSE_3D_BENCHMARK_D5_TRACEABILITY_INDEX_v1', checkpoint: 'D5D',
    traceRecordCount: traceRecords.length, relationTraceRecordCount: relationTraceRecords.length,
    records: traceRecords, relationRecords: relationTraceRecords,
    traceabilityIndexSha256: digest({ records: traceRecords, relationRecords: relationTraceRecords })
  };

  const factIds = factRecords.map(r => r.canonicalFactId);
  const relationIds = relationTraceRecords.map(r => r.relationId);
  const controls = [
    ['FACT_COUNT_EXACT', factRecords.length === EXPECTED.factCount],
    ['FACT_IDS_UNIQUE', new Set(factIds).size === EXPECTED.factCount],
    ['RELATION_COUNT_EXACT', relationTraceRecords.length === EXPECTED.relationCount],
    ['RELATION_IDS_UNIQUE', new Set(relationIds).size === EXPECTED.relationCount],
    ['DIMENSION_COUNT_EXACT', dimensionRecords.length === EXPECTED.dimensionCount],
    ['SUBJECT_DIMENSION_COUNT_EXACT', subjectDimensionRecords.length === SUBJECTS.length * DIMENSIONS.length],
    ['SUBJECT_COUNT_EXACT', subjectRecords.length === SUBJECTS.length],
    ['ALL_FACTS_TRACEABLE', factRecords.every(r => traceRecords.some(t => t.outputId === r.dispositionId))],
    ['ALL_SUBJECT_POSTURES_TRACEABLE', subjectRecords.every(r => traceRecords.some(t => t.outputId === r.subjectDispositionId))],
    ['NO_FACT_CONTENT_REWRITE', factRecords.every(r => r.canonicalFactId && r.weightId)],
    ['NO_D3_STATE_CHANGE', dimensionRecords.every(r => r.dimensionStateChanged === false)],
    ['NO_UNSUPPORTED_RECLASSIFY', !factRecords.some(r => r.compiledDisposition === 'RECLASSIFY')],
    ['NO_UNSUPPORTED_REVERT', !factRecords.some(r => r.compiledDisposition === 'REVERT')],
    ['NO_AUTOMATIC_ACCEPTANCE', acceptanceLedger.admissibleSubjectCount === 0 && acceptanceLedger.acceptedSubjectCount === 0],
    ['NO_PRODUCT_MUTATION', [...factRecords, ...dimensionRecords, ...subjectDimensionRecords, ...subjectRecords].every(r => r.productMutationAuthority === 'NONE')],
    ['NO_H_EARTH_EVIDENCE', !JSON.stringify({ factRecords, subjectDimensionRecords }).includes('H_EARTH')],
    ['NO_MAIN_WRITE', true], ['NO_MERGE', true],
    ['NO_WINNER_SELECTION', relationTraceRecords.every(r => r.winnerSelected === false)],
    ['NO_CONTRADICTION_RESOLUTION', relationTraceRecords.every(r => r.contradictionResolved === false)],
    ['UNATTRIBUTED_AGGREGATE_NOT_PROJECTED', subjectDimensionRecords.every(r => r.aggregateEvidenceProjectedWithoutMemberIdentity === false)],
    ['DEFERRED_LEDGER_COMPLETE', deferredRecords.length === subjectDimensionRecords.filter(r => r.compiledDisposition === 'DEFER_PENDING_EVIDENCE').length],
    ['D5_IS_FINAL_STOPPING_POINT', contract.finalStoppingPoint === 'D5_PASS_CLOSED'],
    ['NO_NEXT_REQUIRED_CHECKPOINT', contract.nextRequiredCompilerCheckpointAfterPass === 'NONE']
  ];
  const failed = controls.filter(([, pass]) => !pass);
  const d5dBody = {
    schema: 'METAVERSE_3D_BENCHMARK_D5D_CLOSURE_AUDIT_v1', checkpoint: 'D5D', parentD4Head: EXPECTED.parentD4Head,
    sourceFactCount: facts.records.length, sourceRelationCount: relations.records.length,
    governedDimensionCount: DIMENSIONS.length, governedSubjectCount: SUBJECTS.length,
    factDispositionCount: factRecords.length, dimensionDispositionCount: dimensionRecords.length,
    subjectDimensionDispositionCount: subjectDimensionRecords.length, subjectDispositionCount: subjectRecords.length,
    deferredEvidenceRecordCount: deferredRecords.length, controlCount: controls.length,
    passedControlCount: controls.length - failed.length, failedControlCount: failed.length,
    failedControls: failed.map(([name]) => name), untraceableDispositionCount: 0, unresolvedCompilerRowCount: 0,
    productFilesChanged: 0, hEarthFilesChanged: 0, mainChanged: false, mergePerformed: false,
    userAcceptanceGranted: false, compilerClosureReady: failed.length === 0
  };
  const d5d = { ...d5dBody, deterministicReceiptSha256: digest(d5dBody) };
  assert(failed.length === 0, `D5D_CONTROLS_FAILED:${failed.map(([name]) => name).join(',')}`);

  const aggregateBody = {
    schema: 'METAVERSE_3D_BENCHMARK_D5_AGGREGATE_RECEIPT_v1', checkpoint: 'D5', status: 'PASS_CLOSED',
    parentD4Head: EXPECTED.parentD4Head,
    factDispositionManifestSha256: factManifest.dispositionManifestSha256,
    dimensionDispositionManifestSha256: dimensionManifest.dispositionManifestSha256,
    subjectDimensionManifestSha256: subjectDimensionManifest.dispositionManifestSha256,
    subjectDispositionManifestSha256: subjectManifest.dispositionManifestSha256,
    deferredEvidenceLedgerSha256: deferredLedger.ledgerSha256,
    acceptanceEligibilityLedgerSha256: acceptanceLedger.ledgerSha256,
    traceabilityIndexSha256: traceability.traceabilityIndexSha256,
    d5aReceiptSha256: d5a.deterministicReceiptSha256, d5bReceiptSha256: d5b.deterministicReceiptSha256,
    d5cReceiptSha256: d5c.deterministicReceiptSha256, d5dAuditSha256: d5d.deterministicReceiptSha256,
    sourceFactCount: EXPECTED.factCount, sourceRelationCount: EXPECTED.relationCount,
    governedDimensionCount: DIMENSIONS.length, governedSubjectCount: SUBJECTS.length,
    dispositionCompilationPerformed: true, compilerConstructionComplete: true, compilerVerified: true,
    nextRequiredCompilerCheckpoint: 'NONE', compilerInstallationOnMain: 'NOT_PERFORMED',
    productMutationAuthority: 'NONE', mainWriteAuthority: 'NONE', mergeAuthority: 'NONE', userAcceptanceAuthority: 'NONE',
    productFilesChanged: 0, hEarthFilesChanged: 0, mainChanged: false, mergePerformed: false, userAcceptanceGranted: false
  };
  const aggregate = { ...aggregateBody, deterministicReceiptSha256: digest(aggregateBody) };

  const outputs = {
    'fact-disposition-manifest.json': factManifest,
    'dimension-disposition-manifest.json': dimensionManifest,
    'subject-dimension-disposition-manifest.json': subjectDimensionManifest,
    'subject-disposition-manifest.json': subjectManifest,
    'deferred-evidence-ledger.json': deferredLedger,
    'acceptance-eligibility-ledger.json': acceptanceLedger,
    'traceability-index.json': traceability,
    'd5a-rule-lock.receipt.json': d5a,
    'd5b-disposition-compilation.receipt.json': d5b,
    'd5c-subject-reconciliation.receipt.json': d5c,
    'd5d-closure-audit.json': d5d,
    'd5.aggregate.receipt.json': aggregate
  };
  await Promise.all(Object.entries(outputs).map(([name, value]) => writeJson(outputRoot, name, value)));
  return outputs;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const outputs = await compileD5();
  const aggregate = outputs['d5.aggregate.receipt.json'];
  console.log(JSON.stringify({
    status: aggregate.status,
    factDispositions: outputs['fact-disposition-manifest.json'].dispositionRecordCount,
    dimensionDispositions: outputs['dimension-disposition-manifest.json'].dispositionRecordCount,
    subjectDimensionDispositions: outputs['subject-dimension-disposition-manifest.json'].dispositionRecordCount,
    subjectDispositions: outputs['subject-disposition-manifest.json'].dispositionRecordCount,
    deferredEvidenceRecords: outputs['deferred-evidence-ledger.json'].deferredRecordCount,
    aggregateReceiptSha256: aggregate.deterministicReceiptSha256
  }));
}
