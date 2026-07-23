from pathlib import Path

path = Path('showroom/globe/h-earth/admitted-geometry-frame.js')
s = path.read_text(encoding='utf-8')


def one(old, new):
    global s
    count = s.count(old)
    if count != 1:
        raise RuntimeError(f'Expected one match, found {count}: {old[:80]!r}')
    s = s.replace(old, new, 1)


def exact(old, new, expected_count):
    global s
    count = s.count(old)
    if count != expected_count:
        raise RuntimeError(
            f'Expected {expected_count} matches, found {count}: {old[:80]!r}'
        )
    s = s.replace(old, new)


one(
    "export const H_EARTH_3D_MINIMUM_NATIVE_SHORELINE_PROOF_MODE =\n"
    "  'MINIMUM_NATIVE_SHORELINE_PROOF';\n",
    "export const H_EARTH_3D_MINIMUM_NATIVE_SHORELINE_PROOF_MODE =\n"
    "  'MINIMUM_NATIVE_SHORELINE_PROOF';\n\n"
    "export const H_EARTH_3D_GROUND_VIEW_GATE_B_PROOF_MODE =\n"
    "  'GROUND_VIEW_GATE_B_PROOF';\n"
)

one(
    "const EXPECTED_SHORELINE_LATTICE_REGION_IDS =\n"
    "  Object.freeze([\n"
    "    'FOREGROUND_INSPECTION_GROUND',\n"
    "    'SHORELINE_CONTACT',\n"
    "    'WATER_SURFACE_PLANE'\n"
    "  ]);\n",
    "const EXPECTED_SHORELINE_LATTICE_REGION_IDS =\n"
    "  Object.freeze([\n"
    "    'FOREGROUND_INSPECTION_GROUND',\n"
    "    'SHORELINE_CONTACT',\n"
    "    'WATER_SURFACE_PLANE'\n"
    "  ]);\n\n"
    "const EXPECTED_GATE_B_SOURCE_OBJECT_IDS =\n"
    "  Object.freeze([\n"
    "    'H_EARTH_GROUND_VIEW_CONTINUOUS_NEARSHORE_AND_OPEN_WATER_TOPOLOGY',\n"
    "    'H_EARTH_GROUND_VIEW_CONTINUOUS_TERRAIN_TOPOLOGY',\n"
    "    'H_EARTH_GROUND_VIEW_DIAGNOSTIC_SHORELINE_RIBBON'\n"
    "  ]);\n\n"
    "const EXPECTED_GATE_B_SOURCE_ZONE_IDS =\n"
    "  Object.freeze([\n"
    "    'H_EARTH_GROUND_VIEW_GATE_B'\n"
    "  ]);\n\n"
    "const EXPECTED_GATE_B_LATTICE_REGION_IDS =\n"
    "  Object.freeze([\n"
    "    'H_EARTH_GROUND_VIEW_GATE_B_BOUNDED_DOMAIN'\n"
    "  ]);\n"
)

one(
    "    H_EARTH_3D_FIRST_ADMITTED_WET_SAND_PROOF_MODE,\n"
    "    H_EARTH_3D_MINIMUM_NATIVE_SHORELINE_PROOF_MODE\n",
    "    H_EARTH_3D_FIRST_ADMITTED_WET_SAND_PROOF_MODE,\n"
    "    H_EARTH_3D_MINIMUM_NATIVE_SHORELINE_PROOF_MODE,\n"
    "    H_EARTH_3D_GROUND_VIEW_GATE_B_PROOF_MODE\n"
)

one(
    "  const shorelineMode =\n"
    "    presentationMode ===\n"
    "      H_EARTH_3D_MINIMUM_NATIVE_SHORELINE_PROOF_MODE;\n\n"
    "  const expectedSourceObjectIds =\n"
    "    shorelineMode\n"
    "      ? EXPECTED_SHORELINE_SOURCE_OBJECT_IDS\n"
    "      : EXPECTED_SOURCE_OBJECT_IDS;\n\n"
    "  const expectedSourceZoneIds =\n"
    "    shorelineMode\n"
    "      ? EXPECTED_SHORELINE_SOURCE_ZONE_IDS\n"
    "      : EXPECTED_SOURCE_ZONE_IDS;\n\n"
    "  const expectedLatticeRegionIds =\n"
    "    shorelineMode\n"
    "      ? EXPECTED_SHORELINE_LATTICE_REGION_IDS\n"
    "      : EXPECTED_LATTICE_REGION_IDS;\n",
    "  const shorelineMode =\n"
    "    presentationMode ===\n"
    "      H_EARTH_3D_MINIMUM_NATIVE_SHORELINE_PROOF_MODE;\n\n"
    "  const gateBMode =\n"
    "    presentationMode ===\n"
    "      H_EARTH_3D_GROUND_VIEW_GATE_B_PROOF_MODE;\n\n"
    "  const expectedSourceObjectIds =\n"
    "    gateBMode\n"
    "      ? EXPECTED_GATE_B_SOURCE_OBJECT_IDS\n"
    "      : shorelineMode\n"
    "        ? EXPECTED_SHORELINE_SOURCE_OBJECT_IDS\n"
    "        : EXPECTED_SOURCE_OBJECT_IDS;\n\n"
    "  const expectedSourceZoneIds =\n"
    "    gateBMode\n"
    "      ? EXPECTED_GATE_B_SOURCE_ZONE_IDS\n"
    "      : shorelineMode\n"
    "        ? EXPECTED_SHORELINE_SOURCE_ZONE_IDS\n"
    "        : EXPECTED_SOURCE_ZONE_IDS;\n\n"
    "  const expectedLatticeRegionIds =\n"
    "    gateBMode\n"
    "      ? EXPECTED_GATE_B_LATTICE_REGION_IDS\n"
    "      : shorelineMode\n"
    "        ? EXPECTED_SHORELINE_LATTICE_REGION_IDS\n"
    "        : EXPECTED_LATTICE_REGION_IDS;\n"
)

one(
    "  if (\n"
    "    presentationMode ===\n"
    "    H_EARTH_3D_FIRST_ADMITTED_WET_SAND_PROOF_MODE\n"
    "  ) {",
    "  if (\n"
    "    ALLOWED_PRESENTATION_MODES.includes(\n"
    "      presentationMode\n"
    "    )\n"
    "  ) {"
)

water_mapping = (
    "      OBJ_007_WATER_SURFACE_PLANE:\n"
    "        Object.freeze({\n"
    "          renderLayer:\n"
    "            'GROUND',\n"
    "          materialReference:\n"
    "            'H_EARTH_MATERIAL_OPEN_WATER',\n"
    "          materialIntent:\n"
    "            'OPEN_WATER'\n"
    "        })\n"
)

expanded_mapping = (
    "      OBJ_007_WATER_SURFACE_PLANE:\n"
    "        Object.freeze({\n"
    "          presentationRole:\n"
    "            'PRIMARY_ADMITTED_WET_SAND_SURFACE',\n"
    "          renderLayer:\n"
    "            'GROUND',\n"
    "          materialReference:\n"
    "            'H_EARTH_MATERIAL_OPEN_WATER',\n"
    "          materialIntent:\n"
    "            'OPEN_WATER'\n"
    "        }),\n\n"
    "      H_EARTH_GROUND_VIEW_CONTINUOUS_TERRAIN_TOPOLOGY:\n"
    "        Object.freeze({\n"
    "          presentationRole:\n"
    "            'PRIMARY_GATE_B_TERRAIN_SURFACE',\n"
    "          renderLayer:\n"
    "            'GROUND',\n"
    "          materialReference:\n"
    "            'H_EARTH_MATERIAL_GATE_B_TERRAIN',\n"
    "          materialIntent:\n"
    "            'GATE_B_TERRAIN'\n"
    "        }),\n\n"
    "      H_EARTH_GROUND_VIEW_CONTINUOUS_NEARSHORE_AND_OPEN_WATER_TOPOLOGY:\n"
    "        Object.freeze({\n"
    "          presentationRole:\n"
    "            'PRIMARY_GATE_B_WATER_SURFACE',\n"
    "          renderLayer:\n"
    "            'GROUND',\n"
    "          materialReference:\n"
    "            'H_EARTH_MATERIAL_OPEN_WATER',\n"
    "          materialIntent:\n"
    "            'OPEN_WATER'\n"
    "        }),\n\n"
    "      H_EARTH_GROUND_VIEW_DIAGNOSTIC_SHORELINE_RIBBON:\n"
    "        Object.freeze({\n"
    "          presentationRole:\n"
    "            'GATE_B_DIAGNOSTIC_SHORELINE_RIBBON',\n"
    "          renderLayer:\n"
    "            'GROUND',\n"
    "          materialReference:\n"
    "            'H_EARTH_MATERIAL_GATE_B_DIAGNOSTIC_RIBBON',\n"
    "          materialIntent:\n"
    "            'DIAGNOSTIC_SHORELINE_RIBBON'\n"
    "        })\n"
)

exact(water_mapping, expanded_mapping, 2)

exact(
    "      OBJ_002_FOREGROUND_WET_SAND:\n"
    "        Object.freeze({\n"
    "          renderLayer:",
    "      OBJ_002_FOREGROUND_WET_SAND:\n"
    "        Object.freeze({\n"
    "          presentationRole:\n"
    "            'PRIMARY_ADMITTED_WET_SAND_SURFACE',\n"
    "          renderLayer:",
    2
)

exact(
    "      OBJ_005_SHORELINE_FOAM_LINE:\n"
    "        Object.freeze({\n"
    "          renderLayer:",
    "      OBJ_005_SHORELINE_FOAM_LINE:\n"
    "        Object.freeze({\n"
    "          presentationRole:\n"
    "            'PRIMARY_ADMITTED_WET_SAND_SURFACE',\n"
    "          renderLayer:",
    2
)

one(
    "        return deepFreeze({\n"
    "          primitiveId,\n"
    "          sourceObjectId,\n\n"
    "          presentationRole:\n"
    "            'PRIMARY_ADMITTED_WET_SAND_SURFACE',\n",
    "        return deepFreeze({\n"
    "          primitiveId,\n"
    "          sourceObjectId,\n\n"
    "          presentationRole:\n"
    "            presentation?.presentationRole ??\n"
    "            'PRIMARY_ADMITTED_WET_SAND_SURFACE',\n"
)

one(
    "        assignment.presentationRole !==\n"
    "          'PRIMARY_ADMITTED_WET_SAND_SURFACE' ||",
    "        assignment.presentationRole !==\n"
    "          expectedPresentation.presentationRole ||"
)

s = s.replace(
    "    firstProofProvenanceLaw:\n"
    "      'EXACTLY_ONE_WET_SAND_SOURCE_OBJECT_ONE_INSPECTION_ZONE_AND_ONE_LATTICE_REGION',",
    "    firstProofProvenanceLaw:\n"
    "      'PRESENTATION_MODE_SELECTS_ONE_EXACT_CANONICAL_PROVENANCE_SET_INCLUDING_GATE_B',"
)

path.write_text(s, encoding='utf-8')
