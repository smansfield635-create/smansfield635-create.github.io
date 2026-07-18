from pathlib import Path

path = Path(
    'h-earth-3d/integration/'
    'h-earth.post-west-admitted-geometry-transfer.js'
)
text = path.read_text(encoding='utf-8')


def replace_between(
    source: str,
    start_marker: str,
    end_marker: str,
    replacement: str,
    label: str,
) -> str:
    start = source.find(start_marker)
    if start < 0:
        raise SystemExit(f'{label}: start marker missing')
    end = source.find(end_marker, start)
    if end < 0:
        raise SystemExit(f'{label}: end marker missing')
    return source[:start] + replacement.rstrip() + '\n\n' + source[end:]


preview_function = r'''function validatePreviewResult(previewResult) {
  const issues = [];

  if (!isPlainRecord(previewResult)) {
    issues.push({
      code: 'PREVIEW_RESULT_MISSING',
      message:
        'previewResult must be a plain-record object.',
      field: 'previewResult'
    });

    return Object.freeze({
      ok: false,
      issues: freezeIssues(issues),
      requestId: null,
      providerRequestId: null,
      resolutionReceiptId: null,
      sourceObjectIds: EMPTY_FROZEN_ARRAY,
      sourceZoneIds: EMPTY_FROZEN_ARRAY,
      latticeRegionIds: EMPTY_FROZEN_ARRAY
    });
  }

  const sourceObjectIds =
    derivePreviewSourceObjectIds(previewResult);

  const sourceZoneIds =
    derivePreviewSourceZoneIds(previewResult);

  const latticeRegionIds =
    derivePreviewLatticeRegionIds(previewResult);

  if (previewResult.ok !== true) {
    issues.push({
      code: 'PREVIEW_RESULT_NOT_LAWFUL',
      message:
        'previewResult must be lawful before Packet 002 transfer.',
      actual:
        previewResult.status ?? null
    });
  }

  if (
    !ACCEPTED_PREVIEW_CONTRACT_IDS.includes(
      previewResult.contractId
    )
  ) {
    issues.push({
      code: 'PREVIEW_RESULT_CONTRACT_ID_MISMATCH',
      message:
        'previewResult contractId does not match an admitted preview occurrence.',
      expected:
        ACCEPTED_PREVIEW_CONTRACT_IDS,
      actual:
        previewResult.contractId ?? null
    });
  }

  if (!isNonEmptyString(previewResult.requestId)) {
    issues.push({
      code: 'REQUEST_ID_MISSING',
      message:
        'previewResult.requestId is required.',
      field: 'requestId'
    });
  }

  if (!isNonEmptyString(previewResult.providerRequestId)) {
    issues.push({
      code: 'PROVIDER_REQUEST_ID_MISSING',
      message:
        'previewResult.providerRequestId is required.',
      field: 'providerRequestId'
    });
  }

  if (!isNonEmptyString(previewResult.resolutionReceiptId)) {
    issues.push({
      code: 'RESOLUTION_RECEIPT_ID_MISSING',
      message:
        'previewResult.resolutionReceiptId is required.',
      field: 'resolutionReceiptId'
    });
  }

  if (sourceObjectIds.length === 0) {
    issues.push({
      code: 'SOURCE_OBJECT_PROVENANCE_MISSING',
      message:
        'previewResult must preserve one or more sourceObjectIds.'
    });
  }

  if (sourceZoneIds.length === 0) {
    issues.push({
      code: 'SOURCE_ZONE_PROVENANCE_MISSING',
      message:
        'previewResult must preserve one or more sourceZoneIds.'
    });
  }

  if (latticeRegionIds.length === 0) {
    issues.push({
      code: 'LATTICE_REGION_PROVENANCE_MISSING',
      message:
        'previewResult must preserve one or more latticeRegionIds.'
    });
  }

  if (previewResult.admitted === true) {
    issues.push({
      code: 'PREVIEW_RESULT_ALREADY_ADMITTED',
      message:
        'previewResult must remain unadmitted at the preview boundary.'
    });
  }

  if (
    previewResult.geometryIndexEntryId !== undefined &&
    previewResult.geometryIndexEntryId !== null
  ) {
    issues.push({
      code: 'PREMATURE_GEOMETRY_INDEX_IDENTITY',
      message:
        'previewResult must not carry a geometryIndexEntryId.'
    });
  }

  if (
    previewResult.compositorNodeId !== undefined &&
    previewResult.compositorNodeId !== null
  ) {
    issues.push({
      code: 'PREMATURE_COMPOSITOR_IDENTITY',
      message:
        'previewResult must not carry a compositorNodeId.'
    });
  }

  if (
    previewResult.renderInstanceId !== undefined &&
    previewResult.renderInstanceId !== null
  ) {
    issues.push({
      code: 'PREMATURE_RENDER_INSTANCE_IDENTITY',
      message:
        'previewResult must not carry a renderInstanceId.'
    });
  }

  return Object.freeze({
    ok: issues.length === 0,
    issues: freezeIssues(issues),
    requestId:
      isNonEmptyString(previewResult.requestId)
        ? previewResult.requestId.trim()
        : null,
    providerRequestId:
      isNonEmptyString(previewResult.providerRequestId)
        ? previewResult.providerRequestId.trim()
        : null,
    resolutionReceiptId:
      isNonEmptyString(previewResult.resolutionReceiptId)
        ? previewResult.resolutionReceiptId.trim()
        : null,
    sourceObjectIds,
    sourceZoneIds,
    latticeRegionIds
  });
}'''

primitive_function = r'''function validateWestPrimitiveAdmission(
  primitiveAdmission,
  previewValidation
) {
  const issues = [];

  if (!isPlainRecord(primitiveAdmission)) {
    issues.push({
      code: 'PRIMITIVE_ADMISSION_RESULT_MISSING',
      message:
        'Every West primitive admission must be a plain-record object.'
    });

    return Object.freeze({
      ok: false,
      issues: freezeIssues(issues),
      admittedPrimitive: null,
      admittedGeometry: null,
      sourceObjectIds: EMPTY_FROZEN_ARRAY,
      sourceZoneIds: EMPTY_FROZEN_ARRAY,
      latticeRegionIds: EMPTY_FROZEN_ARRAY
    });
  }

  const admittedPrimitive =
    primitiveAdmission.primitive;

  const admittedGeometry =
    primitiveAdmission.geometry;

  const primitiveOccurrenceLawful =
    primitiveAdmission.valid === true &&
    isHEarthAdmittedPrimitiveRecord(admittedPrimitive) &&
    isHEarthAdmittedGeometryRecord(admittedGeometry) &&
    admittedPrimitive.geometry === admittedGeometry &&
    admittedPrimitive.admissionId ===
      primitiveAdmission.admissionId &&
    admittedPrimitive.primitiveId ===
      admittedGeometry.sourceNeutralPrimitiveId &&
    admittedPrimitive.admissionAuthority === 'WEST' &&
    admittedPrimitive.admitted === true &&
    admittedPrimitive.aggregateFrameMember === false &&
    admittedPrimitive.recordType ===
      'H_EARTH_WEST_ADMITTED_PRIMITIVE_RECORD' &&
    admittedGeometry.recordType ===
      'H_EARTH_WEST_ADMITTED_GEOMETRY_RECORD' &&
    admittedGeometry.admitted === true &&
    admittedGeometry.admissionAuthority === 'WEST' &&
    admittedGeometry.geometryIndexExported === false &&
    admittedGeometry.compositorIntegrated === false &&
    admittedGeometry.rendererMaterialized === false;

  if (!primitiveOccurrenceLawful) {
    issues.push({
      code: 'PRIMITIVE_ADMISSION_REJECTED',
      message:
        'A West primitive admission occurrence is not lawful under the public geometry-kernel facade.'
    });
  }

  const metadata =
    derivePrimitiveMetadata(admittedPrimitive);

  const sourceObjectIds =
    canonicalUniqueStrings(
      metadata?.sourceObjectIds ?? [
        metadata?.sourceObjectId
      ]
    );

  const sourceZoneIds =
    canonicalUniqueStrings(
      metadata?.sourceZoneIds ?? [
        metadata?.zoneId
      ]
    );

  const latticeRegionIds =
    canonicalUniqueStrings(
      metadata?.latticeRegionIds
    );

  if (sourceObjectIds.length === 0) {
    issues.push({
      code: 'WEST_SOURCE_OBJECT_PROVENANCE_MISSING',
      message:
        'West admitted primitive metadata must preserve one or more sourceObjectIds.'
    });
  } else if (
    !isNonEmptyCanonicalSubset(
      sourceObjectIds,
      previewValidation.sourceObjectIds
    )
  ) {
    issues.push({
      code: 'PRIMITIVE_PROVENANCE_MISMATCH',
      message:
        'West admitted primitive sourceObjectIds must be a non-empty canonical subset of aggregate preview provenance.',
      expected:
        previewValidation.sourceObjectIds,
      actual:
        sourceObjectIds
    });
  }

  if (sourceZoneIds.length === 0) {
    issues.push({
      code: 'WEST_SOURCE_ZONE_PROVENANCE_MISSING',
      message:
        'West admitted primitive metadata must preserve one or more sourceZoneIds.'
    });
  } else if (
    !isNonEmptyCanonicalSubset(
      sourceZoneIds,
      previewValidation.sourceZoneIds
    )
  ) {
    issues.push({
      code: 'PRIMITIVE_PROVENANCE_MISMATCH',
      message:
        'West admitted primitive sourceZoneIds must be a non-empty canonical subset of aggregate preview provenance.',
      expected:
        previewValidation.sourceZoneIds,
      actual:
        sourceZoneIds
    });
  }

  if (
    latticeRegionIds.length > 0 &&
    !isNonEmptyCanonicalSubset(
      latticeRegionIds,
      previewValidation.latticeRegionIds
    )
  ) {
    issues.push({
      code: 'PRIMITIVE_PROVENANCE_MISMATCH',
      message:
        'West admitted primitive latticeRegionIds must be a canonical subset of aggregate preview provenance.',
      expected:
        previewValidation.latticeRegionIds,
      actual:
        latticeRegionIds
    });
  }

  return Object.freeze({
    ok: issues.length === 0,
    issues: freezeIssues(issues),
    admittedPrimitive,
    admittedGeometry,
    sourceObjectIds,
    sourceZoneIds,
    latticeRegionIds
  });
}'''

text = replace_between(
    text,
    'function validatePreviewResult(previewResult) {',
    'function derivePrimitiveMetadata(admittedPrimitive) {',
    preview_function,
    'validatePreviewResult repair',
)

text = replace_between(
    text,
    'function validateWestPrimitiveAdmission(',
    'function validateWestBatchAdmissionResult({',
    primitive_function,
    'validateWestPrimitiveAdmission repair',
)

if 'previewValidation.sourceObjectIds' in text[
    text.find('function validatePreviewResult'):
    text.find('function derivePrimitiveMetadata')
]:
    raise SystemExit(
        'preview validator still references previewValidation'
    )

path.write_text(text, encoding='utf-8')
print('Packet 002 transformation placement repaired')
