/*__H_EARTH_PACKET_002_ASSEMBLY_PART_1__*/
    Array.isArray(previewResult?.sourceObjectIds) &&
    previewResult.sourceObjectIds.every(isNonEmptyString)
  ) {
    return canonicalUniqueStrings(
      previewResult.sourceObjectIds
    );
  }

  if (isNonEmptyString(previewResult?.sourceObjectId)) {
    return Object.freeze([
      previewResult.sourceObjectId.trim()
    ]);
/*__H_EARTH_PACKET_002_ASSEMBLY_PART_2__*/
  const frameRequestId =
    isNonEmptyString(frameMetadata?.requestId)
      ? frameMetadata.requestId.trim()
      : null;

  const frameProviderRequestId =
    isNonEmptyString(frameMetadata?.providerRequestId)
      ? frameMetadata.providerRequestId.trim()
      : null;

  const frameResolutionReceiptId =
    isNonEmptyString(frameMetadata?.resolutionReceiptId)
/*__H_EARTH_PACKET_002_ASSEMBLY_PART_3__*/
      gateBAdapterValidation,

      issues: freezeIssues(issues)
    });
  }

  const previewValidation =
    validatePreviewResult(
      input.previewResult
    );

  issues.push(...previewValidation.issues);
/*__H_EARTH_PACKET_002_ASSEMBLY_PART_4__*/
