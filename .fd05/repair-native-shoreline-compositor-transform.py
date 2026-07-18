from pathlib import Path

path = Path('showroom/globe/h-earth/compositor.js')
text = path.read_text(encoding='utf-8')

old_import = """import {
  H_EARTH_3D_ADMITTED_GEOMETRY_FRAME_CONTRACT_ID,
  H_EARTH_3D_FIRST_ADMITTED_WET_SAND_PROOF_MODE,
  composeHEarth3DAdmittedGeometryFrame,
  isHEarth3DAdmittedGeometryFrame,
  getHEarth3DAdmittedGeometryFrameContract,
  getHEarth3DAdmittedGeometryFrameReceipt
} from './admitted-geometry-frame.js';"""

new_import = """import {
  H_EARTH_3D_ADMITTED_GEOMETRY_FRAME_CONTRACT_ID,
  H_EARTH_3D_FIRST_ADMITTED_WET_SAND_PROOF_MODE,
  H_EARTH_3D_MINIMUM_NATIVE_SHORELINE_PROOF_MODE,
  composeHEarth3DAdmittedGeometryFrame,
  isHEarth3DAdmittedGeometryFrame,
  getHEarth3DAdmittedGeometryFrameContract,
  getHEarth3DAdmittedGeometryFrameReceipt
} from './admitted-geometry-frame.js';"""

if text.count(old_import) != 1:
    raise SystemExit('compositor admitted-frame import surface mismatch')
text = text.replace(old_import, new_import, 1)

anchor = """const ADMITTED_VISIBILITY_LAYER_IDS =
  Object.freeze([
    PRIMARY_PRESENTATION_VISIBILITY_KEY,
    ROUTE_OVERLAY_VISIBILITY_KEY
  ]);"""

replacement = anchor + """

const ADMITTED_PRESENTATION_MODES =
  Object.freeze([
    H_EARTH_3D_FIRST_ADMITTED_WET_SAND_PROOF_MODE,
    H_EARTH_3D_MINIMUM_NATIVE_SHORELINE_PROOF_MODE
  ]);"""

if text.count(anchor) != 1:
    raise SystemExit('compositor visibility-layer anchor mismatch')
text = text.replace(anchor, replacement, 1)

old_check = """  if (
    presentationMode !==
    H_EARTH_3D_FIRST_ADMITTED_WET_SAND_PROOF_MODE
  ) {
    issues.push(
      createCompositorIssue(
        'COMPOSITOR_PRESENTATION_MODE_INVALID',
        'The current compositor admits only FIRST_ADMITTED_WET_SAND_PROOF.',
        {
          field:
            'presentationMode',

          expected:
            H_EARTH_3D_FIRST_ADMITTED_WET_SAND_PROOF_MODE,

          actual:
            presentationMode ??
            null
        }
      )
    );
  }"""

new_check = """  if (
    !ADMITTED_PRESENTATION_MODES.includes(
      presentationMode
    )
  ) {
    issues.push(
      createCompositorIssue(
        'COMPOSITOR_PRESENTATION_MODE_INVALID',
        'The compositor presentation mode is not one of the explicit admitted proof modes.',
        {
          field:
            'presentationMode',

          expected:
            ADMITTED_PRESENTATION_MODES,

          actual:
            presentationMode ??
            null
        }
      )
    );
  }"""

if text.count(old_check) != 1:
    raise SystemExit('compositor presentation-mode check mismatch')
text = text.replace(old_check, new_check, 1)

path.write_text(text, encoding='utf-8')
print('Compositor shoreline proof-mode admission installed')
