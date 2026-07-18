from pathlib import Path
import re

ROOT = Path('.')

PACKET = ROOT / 'h-earth-3d/integration/h-earth.post-west-admitted-geometry-transfer.js'
FRAME = ROOT / 'showroom/globe/h-earth/admitted-geometry-frame.js'
HTML = ROOT / 'showroom/globe/h-earth/index.html'

OLD_PREVIEW_CONTRACT = (
    'H_EARTH_3D_GEOMETRY_PREVIEW_FILE_RENEWAL_STEP_034O_6_'
    'PREVIEW_PACKET_001_WET_SAND_PROVIDER_TRANSLATION_v1'
)
NEW_PREVIEW_CONTRACT = (
    'H_EARTH_3D_SHORELINE_PREVIEW_FILE_BIRTH_'
    'FD05_MINIMUM_NATIVE_SHORELINE_CONTEXT_v1'
)
NEW_MODE = 'H_EARTH_3D_MINIMUM_NATIVE_SHORELINE_PROOF_MODE'


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f'{label}: expected one occurrence, observed {count}')
    return text.replace(old, new, 1)


def replace_function_by_next_marker(
    text: str,
    start_marker: str,
    next_marker: str,
    replacement: str,
    label: str,
) -> str:
    start = text.find(start_marker)
    if start < 0:
        raise SystemExit(f'{label}: start marker missing')
    end = text.find(next_marker, start)
    if end < 0:
        raise SystemExit(f'{label}: end marker missing')
    return text[:start] + replacement.rstrip() + '\n\n' + text[end:]


# ---------------------------------------------------------------------------
# Packet 002: accept the new aggregate preview contract and validate each
# primitive as a non-empty member subset of aggregate preview provenance.
# ---------------------------------------------------------------------------
packet = PACKET.read_text(encoding='utf-8')

packet = replace_once(
    packet,
    f"const EXPECTED_PREVIEW_CONTRACT_ID =\n  '{OLD_PREVIEW_CONTRACT}';",
    f"const EXPECTED_PREVIEW_CONTRACT_ID =\n  '{OLD_PREVIEW_CONTRACT}';\n\n"
    f"const EXPECTED_SHORELINE_PREVIEW_CONTRACT_ID =\n  '{NEW_PREVIEW_CONTRACT}';\n\n"
    "const ACCEPTED_PREVIEW_CONTRACT_IDS =\n  Object.freeze([\n"
    "    EXPECTED_PREVIEW_CONTRACT_ID,\n"
    "    EXPECTED_SHORELINE_PREVIEW_CONTRACT_ID\n"
    "  ]);",
    'packet preview contract declaration',
)

packet = replace_once(
    packet,
    "function arraysEqual(left, right) {\n"
    "  return (\n"
    "    Array.isArray(left) &&\n"
    "    Array.isArray(right) &&\n"
    "    left.length === right.length &&\n"
    "    left.every((value, index) => value === right[index])\n"
    "  );\n"
    "}\n",
    "function arraysEqual(left, right) {\n"
    "  return (\n"
    "    Array.isArray(left) &&\n"
    "    Array.isArray(right) &&\n"
    "    left.length === right.length &&\n"
    "    left.every((value, index) => value === right[index])\n"
    "  );\n"
    "}\n\n"
    "function isNonEmptyCanonicalSubset(candidate, aggregate) {\n"
    "  return (\n"
    "    Array.isArray(candidate) &&\n"
    "    candidate.length > 0 &&\n"
    "    arraysEqual(\n"
    "      candidate,\n"
    "      canonicalUniqueStrings(candidate)\n"
    "    ) &&\n"
    "    Array.isArray(aggregate) &&\n"
    "    candidate.every(\n"
    "      (value) => aggregate.includes(value)\n"
    "    )\n"
    "  );\n"
    "}\n",
    'packet subset helper',
)

packet = replace_once(
    packet,
    "  if (\n"
    "    previewResult.contractId !==\n"
    "    EXPECTED_PREVIEW_CONTRACT_ID\n"
    "  ) {",
    "  if (\n"
    "    !ACCEPTED_PREVIEW_CONTRACT_IDS.includes(\n"
    "      previewResult.contractId\n"
    "    )\n"
    "  ) {",
    'packet accepted preview contract check',
)
packet = packet.replace(
    "expected:\n        EXPECTED_PREVIEW_CONTRACT_ID,",
    "expected:\n        ACCEPTED_PREVIEW_CONTRACT_IDS,",
    1,
)

packet = re.sub(
    r"""  if \(sourceObjectIds\.length === 0\) \{.*?  \}\n\n  if \(sourceZoneIds\.length === 0\) \{.*?  \}\n\n  return Object\.freeze\(\{""",
    """  if (sourceObjectIds.length === 0) {
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

  return Object.freeze({""",
    packet,
    count=1,
    flags=re.S,
)
if 'non-empty canonical subset of aggregate preview provenance' not in packet:
    raise SystemExit('packet primitive provenance replacement failed')

PACKET.write_text(packet, encoding='utf-8')


# ---------------------------------------------------------------------------
# Admitted frame: add an explicit minimum-shoreline mode, preserve the old
# one-object proof, use member-subset primitive provenance, and assign exact
# material identities per source object while retaining one visibility role.
# ---------------------------------------------------------------------------
frame = FRAME.read_text(encoding='utf-8')

frame = replace_once(
    frame,
    "export const H_EARTH_3D_FIRST_ADMITTED_WET_SAND_PROOF_MODE =\n"
    "  'FIRST_ADMITTED_WET_SAND_PROOF';",
    "export const H_EARTH_3D_FIRST_ADMITTED_WET_SAND_PROOF_MODE =\n"
    "  'FIRST_ADMITTED_WET_SAND_PROOF';\n\n"
    "export const H_EARTH_3D_MINIMUM_NATIVE_SHORELINE_PROOF_MODE =\n"
    "  'MINIMUM_NATIVE_SHORELINE_PROOF';",
    'frame shoreline mode',
)

frame = replace_once(
    frame,
    "const EXPECTED_LATTICE_REGION_IDS =\n"
    "  Object.freeze([\n"
    "    EXPECTED_PRIMARY_LATTICE_REGION_ID\n"
    "  ]);",
    "const EXPECTED_LATTICE_REGION_IDS =\n"
    "  Object.freeze([\n"
    "    EXPECTED_PRIMARY_LATTICE_REGION_ID\n"
    "  ]);\n\n"
    "const EXPECTED_SHORELINE_SOURCE_OBJECT_IDS =\n"
    "  Object.freeze([\n"
    "    'OBJ_002_FOREGROUND_WET_SAND',\n"
    "    'OBJ_005_SHORELINE_FOAM_LINE',\n"
    "    'OBJ_007_WATER_SURFACE_PLANE'\n"
    "  ]);\n\n"
    "const EXPECTED_SHORELINE_SOURCE_ZONE_IDS =\n"
    "  Object.freeze([\n"
    "    'ZONE_001_FOREGROUND_INSPECTION_ZONE',\n"
    "    'ZONE_002_SHORELINE_CONTACT_ZONE',\n"
    "    'ZONE_003_WATER_SURFACE_ZONE'\n"
    "  ]);\n\n"
    "const EXPECTED_SHORELINE_LATTICE_REGION_IDS =\n"
    "  Object.freeze([\n"
    "    'FOREGROUND_INSPECTION_GROUND',\n"
    "    'SHORELINE_CONTACT',\n"
    "    'WATER_SURFACE_PLANE'\n"
    "  ]);",
    'frame shoreline expected provenance',
)

frame = replace_once(
    frame,
    "const ALLOWED_PRESENTATION_MODES =\n"
    "  Object.freeze([\n"
    "    H_EARTH_3D_FIRST_ADMITTED_WET_SAND_PROOF_MODE\n"
    "  ]);",
    "const ALLOWED_PRESENTATION_MODES =\n"
    "  Object.freeze([\n"
    "    H_EARTH_3D_FIRST_ADMITTED_WET_SAND_PROOF_MODE,\n"
    "    H_EARTH_3D_MINIMUM_NATIVE_SHORELINE_PROOF_MODE\n"
    "  ]);",
    'frame allowed modes',
)

frame = replace_once(
    frame,
    "function arraysEqual(left, right) {\n"
    "  return (\n"
    "    Array.isArray(left) &&\n"
    "    Array.isArray(right) &&\n"
    "    left.length === right.length &&\n"
    "    left.every(\n"
    "      (value, index) =>\n"
    "        value === right[index]\n"
    "    )\n"
    "  );\n"
    "}\n",
    "function arraysEqual(left, right) {\n"
    "  return (\n"
    "    Array.isArray(left) &&\n"
    "    Array.isArray(right) &&\n"
    "    left.length === right.length &&\n"
    "    left.every(\n"
    "      (value, index) =>\n"
    "        value === right[index]\n"
    "    )\n"
    "  );\n"
    "}\n\n"
    "function isNonEmptyCanonicalSubset(candidate, aggregate) {\n"
    "  return (\n"
    "    isCanonicalStringArray(candidate) &&\n"
    "    candidate.length > 0 &&\n"
    "    Array.isArray(aggregate) &&\n"
    "    candidate.every(\n"
    "      (value) => aggregate.includes(value)\n"
    "    )\n"
    "  );\n"
    "}\n",
    'frame subset helper',
)

proof_function = r'''function validateProofProvenance({
  presentationMode,
  sourceObjectIds,
  sourceZoneIds,
  latticeRegionIds
}) {
  const issues = [];

  const shorelineMode =
    presentationMode ===
      H_EARTH_3D_MINIMUM_NATIVE_SHORELINE_PROOF_MODE;

  const expectedSourceObjectIds =
    shorelineMode
      ? EXPECTED_SHORELINE_SOURCE_OBJECT_IDS
      : EXPECTED_SOURCE_OBJECT_IDS;

  const expectedSourceZoneIds =
    shorelineMode
      ? EXPECTED_SHORELINE_SOURCE_ZONE_IDS
      : EXPECTED_SOURCE_ZONE_IDS;

  const expectedLatticeRegionIds =
    shorelineMode
      ? EXPECTED_SHORELINE_LATTICE_REGION_IDS
      : EXPECTED_LATTICE_REGION_IDS;

  if (
    !isCanonicalExactStringArray(
      sourceObjectIds,
      expectedSourceObjectIds
    )
  ) {
    issues.push(
      createBridgeIssue(
        'PROOF_SOURCE_OBJECT_MEMBERSHIP_INVALID',
        'The selected proof mode requires exact canonical source-object membership.',
        {
          field:
            'sourceObjectIds',
          expected:
            expectedSourceObjectIds,
          actual:
            Array.isArray(sourceObjectIds)
              ? sourceObjectIds
              : null
        }
      )
    );
  }

  if (
    !isCanonicalExactStringArray(
      sourceZoneIds,
      expectedSourceZoneIds
    )
  ) {
    issues.push(
      createBridgeIssue(
        'PROOF_SOURCE_ZONE_MEMBERSHIP_INVALID',
        'The selected proof mode requires exact canonical source-zone membership.',
        {
          field:
            'sourceZoneIds',
          expected:
            expectedSourceZoneIds,
          actual:
            Array.isArray(sourceZoneIds)
              ? sourceZoneIds
              : null
        }
      )
    );
  }

  if (
    !isCanonicalExactStringArray(
      latticeRegionIds,
      expectedLatticeRegionIds
    )
  ) {
    issues.push(
      createBridgeIssue(
        'PROOF_LATTICE_REGION_MEMBERSHIP_INVALID',
        'The selected proof mode requires exact canonical lattice-region membership.',
        {
          field:
            'latticeRegionIds',
          expected:
            expectedLatticeRegionIds,
          actual:
            Array.isArray(latticeRegionIds)
              ? latticeRegionIds
              : null
        }
      )
    );
  }

  return Object.freeze({
    ok:
      issues.length === 0,
    issues:
      freezeIssues(issues)
  });
}'''

frame = replace_function_by_next_marker(
    frame,
    'function validateExactFirstProofProvenance({',
    'function validatePrimitiveSourceProvenance({',
    proof_function,
    'frame proof provenance function',
)

primitive_function = r'''function validatePrimitiveSourceProvenance({
  primitives,
  sourceObjectIds,
  sourceZoneIds,
  latticeRegionIds,
  fieldPrefix
}) {
  const issues = [];

  if (!Array.isArray(primitives)) {
    return Object.freeze({
      ok: false,
      issues: freezeIssues([
        createBridgeIssue(
          'PRIMITIVE_PROVENANCE_INPUT_INVALID',
          'Primitive provenance validation requires an array.',
          {
            field:
              fieldPrefix
          }
        )
      ])
    });
  }

  primitives.forEach(
    (
      primitive,
      index
    ) => {
      const metadata =
        extractPrimitiveMetadata(
          primitive
        );

      const primitiveSourceObjectIds =
        canonicalUniqueStrings(
          metadata?.sourceObjectIds ?? [
            metadata?.sourceObjectId
          ]
        );

      const primitiveSourceZoneIds =
        canonicalUniqueStrings(
          metadata?.sourceZoneIds ?? [
            metadata?.zoneId
          ]
        );

      const primitiveLatticeRegionIds =
        canonicalUniqueStrings(
          metadata?.latticeRegionIds
        );

      if (
        !isNonEmptyCanonicalSubset(
          primitiveSourceObjectIds,
          sourceObjectIds
        )
      ) {
        issues.push(
          createBridgeIssue(
            'PRIMITIVE_SOURCE_OBJECT_PROVENANCE_MISMATCH',
            'Primitive source-object provenance must be a non-empty canonical subset of frame provenance.',
            {
              field:
                `${fieldPrefix}[${index}].metadata.sourceObjectIds`,
              expected:
                sourceObjectIds,
              actual:
                primitiveSourceObjectIds
            }
          )
        );
      }

      if (
        !isNonEmptyCanonicalSubset(
          primitiveSourceZoneIds,
          sourceZoneIds
        )
      ) {
        issues.push(
          createBridgeIssue(
            'PRIMITIVE_SOURCE_ZONE_PROVENANCE_MISMATCH',
            'Primitive source-zone provenance must be a non-empty canonical subset of frame provenance.',
            {
              field:
                `${fieldPrefix}[${index}].metadata.sourceZoneIds`,
              expected:
                sourceZoneIds,
              actual:
                primitiveSourceZoneIds
            }
          )
        );
      }

      if (
        primitiveLatticeRegionIds.length > 0 &&
        !isNonEmptyCanonicalSubset(
          primitiveLatticeRegionIds,
          latticeRegionIds
        )
      ) {
        issues.push(
          createBridgeIssue(
            'PRIMITIVE_LATTICE_REGION_PROVENANCE_MISMATCH',
            'Primitive lattice-region provenance, when present, must be a canonical subset of frame provenance.',
            {
              field:
                `${fieldPrefix}[${index}].metadata.latticeRegionIds`,
              expected:
                latticeRegionIds,
              actual:
                primitiveLatticeRegionIds
            }
          )
        );
      }
    }
  );

  return Object.freeze({
    ok:
      issues.length === 0,
    issues:
      freezeIssues(issues)
  });
}'''

frame = replace_function_by_next_marker(
    frame,
    'function validatePrimitiveSourceProvenance({',
    '/* ==========================================================================\n * 05 · BOUNDARY DECLARATION',
    primitive_function,
    'frame primitive provenance function',
)

presentation_function = r'''function buildWetSandPresentationAssignments({
  admittedPrimitives,
  sourceObjectIds
}) {
  const issues = [];

  const presentationBySourceObjectId =
    Object.freeze({
      OBJ_002_FOREGROUND_WET_SAND:
        Object.freeze({
          renderLayer:
            'GROUND',
          materialReference:
            'H_EARTH_MATERIAL_WET_SAND',
          materialIntent:
            'WET_SAND'
        }),

      OBJ_005_SHORELINE_FOAM_LINE:
        Object.freeze({
          renderLayer:
            'GROUND',
          materialReference:
            'H_EARTH_MATERIAL_FOAM',
          materialIntent:
            'FOAM_CONTACT'
        }),

      OBJ_007_WATER_SURFACE_PLANE:
        Object.freeze({
          renderLayer:
            'GROUND',
          materialReference:
            'H_EARTH_MATERIAL_OPEN_WATER',
          materialIntent:
            'OPEN_WATER'
        })
    });

  const assignments =
    admittedPrimitives.map(
      (primitive) => {
        const primitiveId =
          extractPrimitiveId(
            primitive
          );

        const metadata =
          extractPrimitiveMetadata(
            primitive
          );

        const primitiveSourceObjectIds =
          canonicalUniqueStrings(
            metadata?.sourceObjectIds ?? [
              metadata?.sourceObjectId
            ]
          );

        const sourceObjectId =
          primitiveSourceObjectIds.length === 1
            ? primitiveSourceObjectIds[0]
            : null;

        const presentation =
          sourceObjectId
            ? presentationBySourceObjectId[
                sourceObjectId
              ] ?? null
            : null;

        if (!presentation) {
          issues.push(
            createBridgeIssue(
              'PRESENTATION_SOURCE_OBJECT_UNSUPPORTED',
              'No admitted-frame presentation mapping exists for this exact source object.',
              {
                field:
                  primitiveId,
                actual:
                  sourceObjectId
              }
            )
          );
        }

        return deepFreeze({
          primitiveId,
          sourceObjectId,

          presentationRole:
            'PRIMARY_ADMITTED_WET_SAND_SURFACE',

          renderLayer:
            presentation?.renderLayer ??
            'GROUND',

          materialReference:
            presentation?.materialReference ??
            'H_EARTH_MATERIAL_WET_SAND',

          materialIntent:
            presentation?.materialIntent ??
            'WET_SAND',

          materialReferenceAuthority:
            PRESENTATION_MATERIAL_REFERENCE_AUTHORITY,

          materialCreated:
            false,

          materialSourceAuthorityAltered:
            false,

          visibleEligible:
            true,

          interactionTargetId:
            sourceObjectId,

          geometryIdentityPreserved:
            true,

          sourceGeometryReconstructed:
            false,

          admissionRecordAltered:
            false,

          rendererResourceCreated:
            false
        });
      }
    );

  const admittedPrimitiveMembership =
    evaluatePrimitiveMembership(
      admittedPrimitives
    );

  const assignmentMembership =
    evaluatePrimitiveMembership(
      assignments
    );

  if (
    assignments.length !==
    admittedPrimitives.length
  ) {
    issues.push(
      createBridgeIssue(
        'PRESENTATION_ASSIGNMENT_COUNT_MISMATCH',
        'There must be exactly one presentation assignment per admitted primitive.',
        {
          expected:
            admittedPrimitives.length,
          actual:
            assignments.length
        }
      )
    );
  }

  if (!assignmentMembership.ok) {
    issues.push(
      createBridgeIssue(
        'PRESENTATION_ASSIGNMENT_IDENTITY_INVALID',
        'Presentation assignment primitive IDs must be present and unique.',
        {
          details:
            assignmentMembership
        }
      )
    );
  } else if (
    admittedPrimitiveMembership.ok &&
    !arraysEqual(
      assignmentMembership.primitiveIds,
      admittedPrimitiveMembership.primitiveIds
    )
  ) {
    issues.push(
      createBridgeIssue(
        'PRESENTATION_ASSIGNMENT_MEMBERSHIP_MISMATCH',
        'Presentation assignments must preserve admitted primitive membership exactly.',
        {
          expected:
            admittedPrimitiveMembership.primitiveIds,
          actual:
            assignmentMembership.primitiveIds
        }
      )
    );
  }

  const assignmentSourceObjectIds =
    canonicalUniqueStrings(
      assignments.map(
        (assignment) =>
          assignment.sourceObjectId
      )
    );

  if (
    !arraysEqual(
      assignmentSourceObjectIds,
      sourceObjectIds
    )
  ) {
    issues.push(
      createBridgeIssue(
        'PRESENTATION_ASSIGNMENT_SOURCE_PROVENANCE_MISMATCH',
        'Presentation assignments must preserve exact source-object provenance.',
        {
          expected:
            sourceObjectIds,
          actual:
            assignmentSourceObjectIds
        }
      )
    );
  }

  assignments.forEach(
    (
      assignment,
      index
    ) => {
      const keyEvaluation =
        evaluateExactKeySurface(
          assignment,
          REQUIRED_PRESENTATION_ASSIGNMENT_KEYS
        );

      if (!keyEvaluation.ok) {
        issues.push(
          createBridgeIssue(
            'PRESENTATION_ASSIGNMENT_KEY_SURFACE_INVALID',
            'A presentation assignment must contain exactly the declared contract fields.',
            {
              field:
                `presentationAssignments[${index}]`,
              details:
                Object.freeze({
                  unknownKeys:
                    keyEvaluation.unknownKeys,
                  missingKeys:
                    keyEvaluation.missingKeys
                })
            }
          )
        );
      }
    }
  );

  return Object.freeze({
    ok:
      issues.length === 0,
    issues:
      freezeIssues(issues),
    assignments:
      deepFreeze(assignments)
  });
}'''

frame = replace_function_by_next_marker(
    frame,
    'function buildWetSandPresentationAssignments({',
    '/* ==========================================================================\n * 10 · PUBLIC INPUT EVALUATION',
    presentation_function,
    'frame presentation function',
)

frame = frame.replace(
    'validateExactFirstProofProvenance({',
    'validateProofProvenance({\n      presentationMode,',
)
if 'validateExactFirstProofProvenance' in frame:
    raise SystemExit('frame old proof validator remains')

frame = frame.replace(
    "presentationMode ===\n      H_EARTH_3D_FIRST_ADMITTED_WET_SAND_PROOF_MODE &&",
    "ALLOWED_PRESENTATION_MODES.includes(\n      presentationMode\n    ) &&",
)

FRAME.write_text(frame, encoding='utf-8')


# ---------------------------------------------------------------------------
# HTML: keep five top-level branches, replace PREVIEW with the aggregate
# shoreline preview and pass the explicit minimum-shoreline presentation mode.
# ---------------------------------------------------------------------------
html = HTML.read_text(encoding='utf-8')
html = html.replace(
    './render/geometry-preview.js?v=034o6',
    './render/shoreline-preview.js?v=fd05-shoreline-001',
)
html = html.replace(
    '/showroom/globe/h-earth/render/geometry-preview.js',
    '/showroom/globe/h-earth/render/shoreline-preview.js',
)
html = html.replace(
    'previewHEarthWetSandGeometry',
    'previewHEarthMinimumShorelineGeometry',
)
html = html.replace(
    OLD_PREVIEW_CONTRACT,
    NEW_PREVIEW_CONTRACT,
)
html = html.replace(
    'WET_SAND_GEOMETRY_PREVIEW',
    'MINIMUM_NATIVE_SHORELINE_GEOMETRY_PREVIEW',
)
html = html.replace(
    'H_EARTH_3D_FIRST_ADMITTED_WET_SAND_PROOF_MODE',
    NEW_MODE,
)
html = html.replace(
    'H_EARTH_WET_SAND_ROUTE_REQUEST:',
    'H_EARTH_MINIMUM_NATIVE_SHORELINE_ROUTE_REQUEST:',
)
html = html.replace(
    'The wet-sand preview result is not eligible for West batch admission.',
    'The minimum native shoreline preview result is not eligible for West batch admission.',
)

required_html_tokens = [
    './render/shoreline-preview.js?v=fd05-shoreline-001',
    'previewHEarthMinimumShorelineGeometry',
    NEW_PREVIEW_CONTRACT,
    NEW_MODE,
]
for token in required_html_tokens:
    if token not in html:
        raise SystemExit(f'html required token missing after transformation: {token}')

HTML.write_text(html, encoding='utf-8')

print('native shoreline source transformation complete')
