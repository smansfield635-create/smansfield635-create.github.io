from pathlib import Path

path = Path('showroom/globe/h-earth/admitted-geometry-frame.js')
text = path.read_text(encoding='utf-8')

old_condition = """    presentationMode !==
    H_EARTH_3D_FIRST_ADMITTED_WET_SAND_PROOF_MODE"""
new_condition = """    !ALLOWED_PRESENTATION_MODES.includes(
      presentationMode
    )"""
if old_condition in text:
    text = text.replace(old_condition, new_condition, 1)
elif new_condition not in text:
    raise SystemExit(
        'admitted-frame public input presentation-mode condition is neither old nor repaired'
    )

old_message = (
    "'The initial bridge admits only "
    "FIRST_ADMITTED_WET_SAND_PROOF.'"
)
new_message = (
    "'The presentation mode is not one of the explicit admitted "
    "proof modes.'"
)
if old_message in text:
    text = text.replace(old_message, new_message, 1)
elif new_message not in text:
    raise SystemExit(
        'admitted-frame public input presentation-mode message is neither old nor repaired'
    )

old_expected = """          expected:
            H_EARTH_3D_FIRST_ADMITTED_WET_SAND_PROOF_MODE,"""
new_expected = """          expected:
            ALLOWED_PRESENTATION_MODES,"""
if old_expected in text:
    text = text.replace(old_expected, new_expected, 1)
elif new_expected not in text:
    raise SystemExit(
        'admitted-frame public input presentation-mode expected field is neither old nor repaired'
    )

old_presentation_evaluation = """    packet002Validation.ok &&
    presentationMode ===
      H_EARTH_3D_FIRST_ADMITTED_WET_SAND_PROOF_MODE"""
new_presentation_evaluation = """    packet002Validation.ok &&
    ALLOWED_PRESENTATION_MODES.includes(
      presentationMode
    )"""
if old_presentation_evaluation in text:
    text = text.replace(
        old_presentation_evaluation,
        new_presentation_evaluation,
        1,
    )
elif new_presentation_evaluation not in text:
    raise SystemExit(
        'admitted-frame presentation assignment evaluation is neither old nor repaired'
    )

old_canonical_check = """      !isCanonicalStringArray(
        aggregateFrame.primitiveIds
      ) ||
      !arraysEqual(
        aggregateFrame.primitiveIds,
        standaloneMembership.primitiveIds
      )"""
new_canonical_check = """      canonicalUniqueStrings(
        aggregateFrame.primitiveIds
      ).length !==
        aggregateFrame.primitiveIds.length ||
      !arraysEqual(
        canonicalUniqueStrings(
          aggregateFrame.primitiveIds
        ),
        standaloneMembership.primitiveIds
      )"""
if old_canonical_check in text:
    text = text.replace(old_canonical_check, new_canonical_check, 1)
elif new_canonical_check not in text:
    raise SystemExit(
        'admitted-frame Packet 002 primitiveId comparison is neither old nor repaired'
    )

old_membership_message = (
    "'Aggregate-frame primitiveIds must be canonical, duplicate-free, "
    "and match admitted primitive membership exactly.'"
)
new_membership_message = (
    "'Aggregate-frame primitiveIds must be duplicate-free and match "
    "canonical admitted primitive membership regardless of lawful West "
    "insertion order.'"
)
if old_membership_message in text:
    text = text.replace(old_membership_message, new_membership_message, 1)

# Complete-frame presentation validation must correlate each member to the
# exact material mapping constructed for its source object.
presentation_marker = 'function validatePresentationAssignmentsForFrame({'
constructed_marker = 'function validateConstructedFrame('
presentation_start = text.find(presentation_marker)
constructed_start = text.find(constructed_marker, presentation_start)
if presentation_start < 0 or constructed_start < 0:
    raise SystemExit('presentation or constructed-frame validator marker missing')
presentation_segment = text[presentation_start:constructed_start]

map_declaration = """  const expectedPresentationBySourceObjectId =
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

"""
for_each_marker = '  value.presentationAssignments.forEach('
if 'expectedPresentationBySourceObjectId' not in presentation_segment:
    if for_each_marker not in presentation_segment:
        raise SystemExit('presentation assignment loop marker missing')
    presentation_segment = presentation_segment.replace(
        for_each_marker,
        map_declaration + for_each_marker,
        1,
    )

old_assignment_condition = """      if (
        assignment.presentationRole !==
          'PRIMARY_ADMITTED_WET_SAND_SURFACE' ||
        assignment.renderLayer !==
          'GROUND' ||
        assignment.materialReference !==
          'H_EARTH_MATERIAL_WET_SAND' ||
        assignment.materialIntent !==
          'WET_SAND' ||
        assignment.materialReferenceAuthority !==
          PRESENTATION_MATERIAL_REFERENCE_AUTHORITY ||"""
new_assignment_condition = """      const expectedPresentation =
        expectedPresentationBySourceObjectId[
          assignment.sourceObjectId
        ] ?? null;

      if (
        expectedPresentation === null ||
        assignment.presentationRole !==
          'PRIMARY_ADMITTED_WET_SAND_SURFACE' ||
        assignment.renderLayer !==
          expectedPresentation.renderLayer ||
        assignment.materialReference !==
          expectedPresentation.materialReference ||
        assignment.materialIntent !==
          expectedPresentation.materialIntent ||
        assignment.materialReferenceAuthority !==
          PRESENTATION_MATERIAL_REFERENCE_AUTHORITY ||"""
if old_assignment_condition in presentation_segment:
    presentation_segment = presentation_segment.replace(
        old_assignment_condition,
        new_assignment_condition,
        1,
    )
elif new_assignment_condition not in presentation_segment:
    raise SystemExit(
        'presentation assignment material condition is neither old nor repaired'
    )

text = (
    text[:presentation_start]
    + presentation_segment
    + text[constructed_start:]
)

# Postconstruction validator: admit the same explicit modes, correlate the
# proof mode to the frame field, and compare aggregate primitive IDs by
# canonical membership rather than West insertion order.
constructed_start = text.find(constructed_marker)
constructed = text[constructed_start:]

old_constructed_condition = """    value.presentationMode !==
    H_EARTH_3D_FIRST_ADMITTED_WET_SAND_PROOF_MODE"""
new_constructed_condition = """    !ALLOWED_PRESENTATION_MODES.includes(
      value.presentationMode
    )"""
if old_constructed_condition in constructed:
    constructed = constructed.replace(
        old_constructed_condition,
        new_constructed_condition,
        1,
    )
elif new_constructed_condition not in constructed:
    raise SystemExit(
        'constructed-frame presentation-mode condition is neither old nor repaired'
    )

old_constructed_message = (
    "'The initial frame contract admits only "
    "FIRST_ADMITTED_WET_SAND_PROOF.'"
)
new_constructed_message = (
    "'The constructed frame presentation mode is not one of the explicit "
    "admitted proof modes.'"
)
if old_constructed_message in constructed:
    constructed = constructed.replace(
        old_constructed_message,
        new_constructed_message,
        1,
    )

old_constructed_call = """    validateProofProvenance({
      presentationMode,
      sourceObjectIds:"""
new_constructed_call = """    validateProofProvenance({
      presentationMode:
        value.presentationMode,
      sourceObjectIds:"""
if old_constructed_call in constructed:
    constructed = constructed.replace(
        old_constructed_call,
        new_constructed_call,
        1,
    )
elif new_constructed_call not in constructed:
    raise SystemExit(
        'constructed-frame proof provenance call is neither old nor repaired'
    )

old_qualified_positive = """    value.ALLOWED_PRESENTATION_MODES.includes(
      presentationMode
    ) &&"""
new_qualified_positive = """    ALLOWED_PRESENTATION_MODES.includes(
      value.presentationMode
    ) &&"""
if old_qualified_positive in constructed:
    constructed = constructed.replace(
        old_qualified_positive,
        new_qualified_positive,
        1,
    )
elif new_qualified_positive not in constructed:
    raise SystemExit(
        'constructed-frame positive presentation-mode predicate is neither old nor repaired'
    )

old_constructed_ids = """      !isCanonicalStringArray(
        aggregateFrame.primitiveIds
      ) ||
      !arraysEqual(
        aggregateFrame.primitiveIds,
        value.admittedPrimitiveIds
      )"""
new_constructed_ids = """      canonicalUniqueStrings(
        aggregateFrame.primitiveIds
      ).length !==
        aggregateFrame.primitiveIds.length ||
      !arraysEqual(
        canonicalUniqueStrings(
          aggregateFrame.primitiveIds
        ),
        value.admittedPrimitiveIds
      )"""
if old_constructed_ids in constructed:
    constructed = constructed.replace(
        old_constructed_ids,
        new_constructed_ids,
        1,
    )
elif new_constructed_ids not in constructed:
    raise SystemExit(
        'constructed-frame aggregate primitiveId comparison is neither old nor repaired'
    )

old_constructed_ids_message = (
    "'Aggregate-frame primitiveIds must be canonical, duplicate-free, "
    "and match admittedPrimitiveIds exactly.'"
)
new_constructed_ids_message = (
    "'Aggregate-frame primitiveIds must be duplicate-free and match "
    "canonical admittedPrimitiveIds regardless of lawful West insertion order.'"
)
if old_constructed_ids_message in constructed:
    constructed = constructed.replace(
        old_constructed_ids_message,
        new_constructed_ids_message,
        1,
    )

text = text[:constructed_start] + constructed
path.write_text(text, encoding='utf-8')
print('Admitted-frame shoreline input, assignment, and postcondition checks repaired')
