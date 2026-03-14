import { createWorldKernel } from "../world_kernel.js";

function clamp01(value) {
  return Math.max(0, Math.min(1, value));
}

function pointInPolygon(x, y, polygon) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0];
    const yi = polygon[i][1];
    const xj = polygon[j][0];
    const yj = polygon[j][1];

    const intersects =
      ((yi > y) !== (yj > y)) &&
      (x < ((xj - xi) * (y - yi)) / ((yj - yi) || 1e-9) + xi);

    if (intersects) inside = !inside;
  }
  return inside;
}

function distanceSquared(ax, ay, bx, by) {
  const dx = ax - bx;
  const dy = ay - by;
  return (dx * dx) + (dy * dy);
}

export async function createWorldRuntime() {
  const kernel = await createWorldKernel();

  let tick = 0;
  let coherence = 0.7;
  let selectedId = "harbor_region";

  function computeSelection() {
    const region = kernel.regions.find((row) => row.id === "harbor_region");
    const village = kernel.markers.find((row) => row.id === "harbor_village_anchor");

    if (selectedId === "harbor_village_anchor" && village) {
      return {
        selectedName: village.name,
        selectedType: village.type,
        selectionHint: "Harbor entry point active"
      };
    }

    return {
      selectedName: region?.name ?? "Harbor Region",
      selectedType: "region",
      selectionHint: "Harbor entry point active"
    };
  }

  function getSnapshot() {
    const selection = computeSelection();

    return {
      tick,
      coherence,
      kernel,
      selection: {
        selectedId
      },
      readout: {
        region: "Harbor Region",
        selectedName: selection.selectedName,
        selectedType: selection.selectedType,
        selectionHint: selection.selectionHint
      }
    };
  }

  return {
    step() {
      tick += 1;
      const drift = kernel.pressure.stormIntensity * 0.00045;
      const repair = kernel.environment.harborStability * 0.00015;
      coherence = clamp01(coherence - drift + repair);
    },
    selectAt(x, y) {
      const village = kernel.markers.find((row) => row.id === "harbor_village_anchor");
      if (village) {
        const d2 = distanceSquared(x, y, village.point[0], village.point[1]);
        if (d2 <= village.hitRadius * village.hitRadius) {
          selectedId = "harbor_village_anchor";
          return;
        }
      }

      const harborRegion = kernel.regions.find((row) => row.id === "harbor_region");
      if (harborRegion && pointInPolygon(x, y, harborRegion.polygon)) {
        selectedId = "harbor_region";
        return;
      }

      const exploration = kernel.regions.find((row) => row.id === "exploration_basin");
      if (exploration && pointInPolygon(x, y, exploration.polygon)) {
        selectedId = "exploration_basin";
        return;
      }

      selectedId = "harbor_region";
    },
    getSnapshot
  };
}
