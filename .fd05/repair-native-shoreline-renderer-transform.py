from pathlib import Path

path = Path('showroom/globe/h-earth/renderer.js')
text = path.read_text(encoding='utf-8')

old_block = """  if (
    frame.admittedPrimitiveIds.length !==
      primitivePlans.length ||
    !arraysEqual(
      frame.admittedPrimitiveIds,
      primitivePlans.map(
        (plan) =>
          plan.primitiveId
      )
    )
  ) {
    issues.push(
      createRendererIssue(
        'RENDERER_PRIMITIVE_MEMBERSHIP_CORRESPONDENCE_FAILED',
        'The renderer projection plan must preserve admitted primitive membership and order exactly.'
      )
    );
  }
"""

new_block = """  const projectedPrimitiveIds =
    primitivePlans.map(
      (plan) =>
        plan.primitiveId
    );

  const canonicalFramePrimitiveIds =
    Object.freeze([
      ...frame.admittedPrimitiveIds
    ].sort());

  const canonicalProjectedPrimitiveIds =
    Object.freeze([
      ...projectedPrimitiveIds
    ].sort());

  if (
    frame.admittedPrimitiveIds.length !==
      primitivePlans.length ||
    !arraysEqual(
      canonicalFramePrimitiveIds,
      canonicalProjectedPrimitiveIds
    )
  ) {
    issues.push(
      createRendererIssue(
        'RENDERER_PRIMITIVE_MEMBERSHIP_CORRESPONDENCE_FAILED',
        'The renderer projection plan must preserve admitted primitive membership exactly regardless of lawful West insertion order.'
      )
    );
  }
"""

if old_block in text:
    text = text.replace(old_block, new_block, 1)
elif new_block not in text:
    raise SystemExit(
        'renderer primitive-membership correspondence block is neither old nor repaired'
    )

path.write_text(text, encoding='utf-8')
print('Renderer shoreline primitive-membership correspondence repaired')
