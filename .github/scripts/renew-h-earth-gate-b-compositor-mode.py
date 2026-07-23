from pathlib import Path

path = Path('showroom/globe/h-earth/compositor.js')
lines = path.read_text(encoding='utf-8').splitlines()

import_symbol = '  H_EARTH_3D_GROUND_VIEW_GATE_B_PROOF_MODE,'
mode_symbol = '    H_EARTH_3D_GROUND_VIEW_GATE_B_PROOF_MODE'

if import_symbol not in lines:
    anchor = '  H_EARTH_3D_MINIMUM_NATIVE_SHORELINE_PROOF_MODE,'
    matches = [i for i, line in enumerate(lines) if line == anchor]
    if len(matches) != 1:
        raise RuntimeError(f'Import anchor count must be 1, found {len(matches)}')
    lines.insert(matches[0] + 1, import_symbol)

if mode_symbol not in lines:
    anchor = '    H_EARTH_3D_MINIMUM_NATIVE_SHORELINE_PROOF_MODE'
    matches = [i for i, line in enumerate(lines) if line == anchor]
    if len(matches) != 1:
        raise RuntimeError(f'Mode anchor count must be 1, found {len(matches)}')
    lines[matches[0]] = anchor + ','
    lines.insert(matches[0] + 1, mode_symbol)

path.write_text('\n'.join(lines) + '\n', encoding='utf-8')
