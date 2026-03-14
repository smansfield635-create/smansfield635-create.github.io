function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function createPlanetSurfaceProjector({ viewState, viewport }) {
  const state = {
    viewState: { ...viewState },
    viewport: { ...viewport },
  };

  function computeCurvatureLift(nx) {
    const centered = nx - 0.5;
    const curvature = centered * centered;
    return curvature * (state.viewport.pixelHeight * 0.06);
  }

  return {
    update(nextViewState, nextViewport) {
      state.viewState = { ...state.viewState, ...nextViewState };
      state.viewport = { ...state.viewport, ...nextViewport };
    },

    projectPoint(point) {
      const width = Math.max(1, state.viewport.pixelWidth || 1);
      const height = Math.max(1, state.viewport.pixelHeight || 1);

      const zoom = clamp(state.viewState.zoom ?? 1, 0.25, 4);
      const cameraX = clamp(state.viewState.cameraX ?? 0.5, 0, 1);
      const cameraY = clamp(state.viewState.cameraY ?? 0.5, 0, 1);
      const horizonOffset = Number.isFinite(state.viewState.horizonOffset)
        ? state.viewState.horizonOffset
        : 0;

      const x = clamp(point.x, 0, 1);
      const y = clamp(point.y, 0, 1);

      const nx = (x - cameraX) * zoom + 0.5;
      const ny = (y - cameraY) * zoom + 0.5;

      const px = nx * width;
      const py = ny * height + computeCurvatureLift(nx) + horizonOffset;

      if (!Number.isFinite(px) || !Number.isFinite(py)) {
        throw new Error("PROJECTION_FAILURE: Non-finite projected coordinate.");
      }

      return { x: px, y: py };
    },

    projectPoints(points) {
      return (points || []).map((point) => this.projectPoint(point));
    },
  };
}
