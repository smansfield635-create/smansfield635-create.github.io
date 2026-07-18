from pathlib import Path

path = Path('showroom/globe/h-earth/render/shoreline-preview.js')
text = path.read_text(encoding='utf-8')

old_import = """import {
  H_EARTH_3D_GEOMETRY_PREVIEW_CONTRACT_ID,
  previewHEarthWetSandGeometry
} from './geometry-preview.js';"""
new_import = """import {
  H_EARTH_3D_GEOMETRY_PREVIEW_CONTRACT_ID as
    H_EARTH_3D_WET_SAND_GEOMETRY_PREVIEW_CONTRACT_ID,
  previewHEarthWetSandGeometry
} from './geometry-preview.js';"""
if old_import in text:
    text = text.replace(old_import, new_import, 1)
elif new_import not in text:
    raise SystemExit('shoreline preview wet-sand import is neither old nor repaired')

contract_declaration = """export const H_EARTH_3D_SHORELINE_PREVIEW_CONTRACT_ID =
  'H_EARTH_3D_SHORELINE_PREVIEW_FILE_BIRTH_FD05_MINIMUM_NATIVE_SHORELINE_CONTEXT_v1';
"""
compatibility_declaration = contract_declaration + """
export const H_EARTH_3D_GEOMETRY_PREVIEW_CONTRACT_ID =
  H_EARTH_3D_SHORELINE_PREVIEW_CONTRACT_ID;
"""
if compatibility_declaration not in text:
    if contract_declaration not in text:
        raise SystemExit('shoreline preview contract declaration missing')
    text = text.replace(
        contract_declaration,
        compatibility_declaration,
        1,
    )

old_receipt_reference = """        wetSandPreviewContractId:
          H_EARTH_3D_GEOMETRY_PREVIEW_CONTRACT_ID,"""
new_receipt_reference = """        wetSandPreviewContractId:
          H_EARTH_3D_WET_SAND_GEOMETRY_PREVIEW_CONTRACT_ID,"""
if old_receipt_reference in text:
    text = text.replace(old_receipt_reference, new_receipt_reference, 1)
elif new_receipt_reference not in text:
    raise SystemExit('shoreline preview wet-sand receipt reference is neither old nor repaired')

old_default = """export default Object.freeze({
  H_EARTH_3D_SHORELINE_PREVIEW_CONTRACT_ID,"""
new_default = """export default Object.freeze({
  H_EARTH_3D_SHORELINE_PREVIEW_CONTRACT_ID,
  H_EARTH_3D_GEOMETRY_PREVIEW_CONTRACT_ID,"""
if old_default in text:
    text = text.replace(old_default, new_default, 1)
elif new_default not in text:
    raise SystemExit('shoreline preview default export is neither old nor repaired')

path.write_text(text, encoding='utf-8')
print('Shoreline preview route contract alias repaired')
