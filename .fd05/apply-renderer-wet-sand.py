from pathlib import Path

path = Path('showroom/globe/h-earth/renderer.js')
text = path.read_text(encoding='utf-8')


def replace_once(label, old, new):
    global text
    count = text.count(old)
    if count != 1:
        raise SystemExit(f'{label}: expected exactly one match, observed {count}')
    text = text.replace(old, new, 1)


def replace_all_exact(label, old, new, expected):
    global text
    count = text.count(old)
    if count != expected:
        raise SystemExit(f'{label}: expected {expected} matches, observed {count}')
    text = text.replace(old, new)


replace_once(
    'canonical material-presentation chain',
    """ * → DOM/CSS MATERIALIZATION
 * → MOUNT / APPLY / REPROJECT / DESTROY
""",
    """ * → DOM/CSS MATERIALIZATION
 * → STAGE-ALIGNED WET-SAND MATERIAL PRESENTATION
 * → MOUNT / APPLY / REPROJECT / DESTROY
"""
)

replace_once(
    'renderer ownership declaration',
    """ * - DOM/CSS materialization;
 * - mount, replacement, reprojection, destroy, and release lifecycle;
""",
    """ * - DOM/CSS materialization;
 * - exact wet-sand material-presentation mapping;
 * - mount, replacement, reprojection, destroy, and release lifecycle;
"""
)

replace_once(
    'renderer status',
    """  'FROZEN_CANON_DUPLICATE_CLIPPING_AND_LIFECYCLE_CORRECTION_CANDIDATE';""",
    """  'FROZEN_CANON_DUPLICATE_CLIPPING_LIFECYCLE_AND_WET_SAND_PRESENTATION_CORRECTION_CANDIDATE';"""
)

replace_once(
    'rename base material resolver',
    """function getMaterialPresentation(
""",
    """function getBaseMaterialPresentation(
"""
)

presentation_block = """const H_EARTH_3D_WET_SAND_BALANCED_PRESENTATION =
  deepFreeze({
    background:
      'linear-gradient(180deg, rgba(205, 226, 223, 0.34) 0%, rgba(156, 181, 180, 0.12) 22%, rgba(121, 112, 91, 0.08) 45%, rgba(55, 67, 64, 0.30) 100%), linear-gradient(180deg, #917c5d 0%, #6f644e 48%, #444b45 100%)',

    boxShadow:
      'rgba(225, 242, 238, 0.16) 0 1px 0 inset, rgba(15, 23, 22, 0.08) 0 1px 2px',

    filter:
      'saturate(1.10) brightness(1.08) contrast(0.94)',

    mixBlendMode:
      'normal',

    opacity:
      '0.99'
  });

function isWetSandPresentationAssignment(
  assignment
) {
  return (
    assignment?.materialReference ===
      'H_EARTH_MATERIAL_WET_SAND' &&
    assignment?.materialIntent ===
      'WET_SAND'
  );
}

function getMaterialPresentation(
  assignment
) {
  const basePresentation =
    getBaseMaterialPresentation(
      assignment
    );

  if (
    !isWetSandPresentationAssignment(
      assignment
    )
  ) {
    return basePresentation;
  }

  return deepFreeze({
    ...basePresentation,
    ...H_EARTH_3D_WET_SAND_BALANCED_PRESENTATION
  });
}

function applyStageAlignedWetSandPresentation(
  element,
  assignment,
  materializationExtent
) {
  if (
    !isWetSandPresentationAssignment(
      assignment
    ) ||
    !isPlainRecord(
      materializationExtent
    ) ||
    !isPositiveFiniteNumber(
      materializationExtent.widthPx
    ) ||
    !isPositiveFiniteNumber(
      materializationExtent.heightPx
    )
  ) {
    return element;
  }

  const parsedLeftPx =
    Number.parseFloat(
      element.style.left
    );

  const parsedTopPx =
    Number.parseFloat(
      element.style.top
    );

  const leftPx =
    Number.isFinite(parsedLeftPx)
      ? parsedLeftPx
      : 0;

  const topPx =
    Number.isFinite(parsedTopPx)
      ? parsedTopPx
      : 0;

  setStyles(
    element,
    {
      backgroundSize:
        `${materializationExtent.widthPx}px ${materializationExtent.heightPx}px`,

      backgroundPosition:
        `${-leftPx}px ${-topPx}px`,

      backgroundRepeat:
        'no-repeat'
    }
  );

  element.dataset.wetSandPresentationModel =
    'BALANCED_STAGE_ALIGNED_v1';

  return element;
}

"""

replace_once(
    'insert selected material mapping',
    """function applyPresentation(
""",
    presentation_block + """function applyPresentation(
"""
)

replace_once(
    'apply presentation signature',
    """function applyPresentation(
  element,
  assignment
) {
""",
    """function applyPresentation(
  element,
  assignment,
  materializationExtent = null
) {
"""
)

replace_once(
    'stage-aligned presentation application',
    """  setStyles(
    element,
    presentation
  );

  element.dataset.materialReference =
""",
    """  setStyles(
    element,
    presentation
  );

  applyStageAlignedWetSandPresentation(
    element,
    assignment,
    materializationExtent
  );

  element.dataset.materialReference =
"""
)

for function_name in (
    'createPointElement',
    'createLineElement',
    'createTriangleElement'
):
    replace_once(
        f'{function_name} signature',
        f"""function {function_name}(
  descriptor,
  descriptorIndex
) {{
""",
        f"""function {function_name}(
  descriptor,
  descriptorIndex,
  materializationExtent
) {{
"""
    )

replace_all_exact(
    'descriptor presentation extent propagation',
    """  return applyPresentation(
    element,
    descriptor.assignment
  );
""",
    """  return applyPresentation(
    element,
    descriptor.assignment,
    materializationExtent
  );
""",
    3
)

replace_once(
    'descriptor factory signature',
    """function createDescriptorElement(
  descriptor,
  descriptorIndex
) {
""",
    """function createDescriptorElement(
  descriptor,
  descriptorIndex,
  materializationExtent
) {
"""
)

for function_name in (
    'createPointElement',
    'createLineElement',
    'createTriangleElement'
):
    replace_once(
        f'{function_name} factory call',
        f"""      return {function_name}(
        descriptor,
        descriptorIndex
      );
""",
        f"""      return {function_name}(
        descriptor,
        descriptorIndex,
        materializationExtent
      );
"""
    )

replace_once(
    'projection extent factory propagation',
    """          createDescriptorElement(
            descriptor,
            descriptorIndex
          );
""",
    """          createDescriptorElement(
            descriptor,
            descriptorIndex,
            projectionPlan
              .projectionContext
              .materializationExtent
          );
"""
)

required_markers = (
    'H_EARTH_3D_WET_SAND_BALANCED_PRESENTATION',
    'BALANCED_STAGE_ALIGNED_v1',
    'backgroundSize',
    'backgroundPosition',
    'H_EARTH_MATERIAL_WET_SAND',
    "assignment?.materialIntent ===\n      'WET_SAND'"
)
for marker in required_markers:
    if marker not in text:
        raise SystemExit(f'required marker missing after transformation: {marker}')

if text.count('function getBaseMaterialPresentation(') != 1:
    raise SystemExit('base material resolver count invalid')
if text.count('function getMaterialPresentation(') != 1:
    raise SystemExit('selected material resolver count invalid')
if text.count('BALANCED_STAGE_ALIGNED_v1') != 1:
    raise SystemExit('selected presentation model count invalid')

path.write_text(text, encoding='utf-8')
