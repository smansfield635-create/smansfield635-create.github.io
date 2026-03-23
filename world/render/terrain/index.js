// /world/render/terrain/index.js
// MODE: TERRAIN FAMILY ENTRYPOINT
// STATUS: BASELINE TERRAIN BINDER

import { resolveTerrainPacket as resolveTerrainBase } from "./terrain_render_engine.js";

export function resolveTerrainPacket(input) {
  return resolveTerrainBase(input);
}

export default Object.freeze({
  resolveTerrainPacket
});
