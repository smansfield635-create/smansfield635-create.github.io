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
        'admitted-frame aggregate primitiveId comparison is neither old nor repaired'
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

# Postconstruction validator: admit the same explicit modes and correlate
# provenance validation to the frame-owned presentationMode field.
constructed_marker = 'function validateConstructedFrame('
constructed_start = text.find(constructed_marker)
if constructed_start < 0:
    raise SystemExit('validateConstructedFrame marker missing')
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

text = text[:constructed_start] + constructed
path.write_text(text, encoding='utf-8')
print('Admitted-frame shoreline input and postcondition checks repaired')
