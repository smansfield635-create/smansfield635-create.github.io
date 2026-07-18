from pathlib import Path
import re

path = Path('showroom/globe/h-earth/admitted-geometry-frame.js')
text = path.read_text(encoding='utf-8')

mode_pattern = re.compile(
    r"  if \(\n"
    r"    presentationMode !==\n"
    r"      H_EARTH_3D_FIRST_ADMITTED_WET_SAND_PROOF_MODE\n"
    r"  \) \{\n"
    r"    issues\.push\(\n"
    r"      createBridgeIssue\(\n"
    r"        'PRESENTATION_MODE_NOT_ADMITTED',.*?"
    r"\n  \}\n",
    re.S,
)

mode_replacement = """  if (
    !ALLOWED_PRESENTATION_MODES.includes(
      presentationMode
    )
  ) {
    issues.push(
      createBridgeIssue(
        'PRESENTATION_MODE_NOT_ADMITTED',
        'The presentation mode is not one of the explicit admitted proof modes.',
        {
          field:
            'presentationMode',

          expected:
            ALLOWED_PRESENTATION_MODES,

          actual:
            presentationMode ??
            null
        }
      )
    );
  }
"""

text, mode_count = mode_pattern.subn(
    mode_replacement,
    text,
    count=1,
)
if mode_count != 1:
    raise SystemExit(
        f'admitted-frame presentation-mode check count: {mode_count}'
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

if text.count(old_canonical_check) != 1:
    raise SystemExit(
        'admitted-frame aggregate primitiveId comparison surface mismatch'
    )
text = text.replace(
    old_canonical_check,
    new_canonical_check,
    1,
)

old_message = (
    "'Aggregate-frame primitiveIds must be canonical, duplicate-free, "
    "and match admitted primitive membership exactly.'"
)
new_message = (
    "'Aggregate-frame primitiveIds must be duplicate-free and match "
    "canonical admitted primitive membership regardless of lawful West "
    "insertion order.'"
)
if old_message in text:
    text = text.replace(
        old_message,
        new_message,
        1,
    )

path.write_text(text, encoding='utf-8')
print('Admitted-frame shoreline mode and membership checks repaired')
