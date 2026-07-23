from pathlib import Path

path = Path('showroom/globe/h-earth/compositor.js')
s = path.read_text(encoding='utf-8')


def one(old, new):
    global s
    count = s.count(old)
    if count != 1:
        raise RuntimeError(f'Expected one match, found {count}: {old[:80]!r}')
    s = s.replace(old, new, 1)


one(
    "  H_EARTH_3D_FIRST_ADMITTED_WET_SAND_PROOF_MODE,\n"
    "  H_EARTH_3D_MINIMUM_NATIVE_SHORELINE_PROOF_MODE,\n",
    "  H_EARTH_3D_FIRST_ADMITTED_WET_SAND_PROOF_MODE,\n"
    "  H_EARTH_3D_MINIMUM_NATIVE_SHORELINE_PROOF_MODE,\n"
    "  H_EARTH_3D_GROUND_VIEW_GATE_B_PROOF_MODE,\n"
)

one(
    "    H_EARTH_3D_FIRST_ADMITTED_WET_SAND_PROOF_MODE,\n"
    "    H_EARTH_3D_MINIMUM_NATIVE_SHORELINE_PROOF_MODE\n",
    "    H_EARTH_3D_FIRST_ADMITTED_WET_SAND_PROOF_MODE,\n"
    "    H_EARTH_3D_MINIMUM_NATIVE_SHORELINE_PROOF_MODE,\n"
    "    H_EARTH_3D_GROUND_VIEW_GATE_B_PROOF_MODE\n"
)

path.write_text(s, encoding='utf-8')
