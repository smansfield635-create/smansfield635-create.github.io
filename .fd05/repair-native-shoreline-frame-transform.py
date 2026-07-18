from pathlib import Path

path = Path('showroom/globe/h-earth/admitted-geometry-frame.js')
text = path.read_text(encoding='utf-8')

# The main shoreline transformation already broadens the positive
# presentation-mode acceptance surface. These replacements are retained as
# optional compatibility repairs because older admitted-frame occurrences used
# different indentation and wording.
old_condition = """    presentationMode !==
       H_EARTH_3D_FIRST_ADMITTED_WET_SAND_PROOF_MODE"""
new_condition = """    !ALLOWED_PRESENTATION_MODES.includes(
      presentationMode
    )"""
if old_condition in text:
    text = text.replace(old_condition, new_condition, 1)

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

old_expected = """          expected:
             H_EARTH_3D_FIRST_ADMITTED_WET_SAND_PROOF_MODE,"""
new_expected = """          expected:
             ALLOWED_PRESENTATION_MODES,"""
if old_expected in text:
    text = text.replace(old_expected, new_expected, 1)

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

path.write_text(text, encoding='utf-8')
print('Admitted-frame shoreline membership checks repaired')
