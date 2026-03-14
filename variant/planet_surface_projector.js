function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function createPlanetSurfaceProjector({ canvas, getViewport }) {
  let viewport = getViewport();

  function update(nextViewport) {
    viewport = nextViewport;
  }

  function point(x, y) {
    const px = x * canvas.width;
    const baseY = y * canvas.height;

    const curvatureStrength = canvas.height * 0.04;
    const centeredX = (x - 0.5) / 0.5;
    const curvatureOffset = centeredX * centeredX * curvatureStrength;

    return {
      x: px,
      y: baseY + curvatureOffset
    };
  }

  function radius(value) {
    const shortEdge = Math.min(viewport.pixelWidth, viewport.pixelHeight);
    return (value / 1000) * shortEdge;
  }

  function unproject(px, py) {
    const x = clamp(px / canvas.width, 0, 1);
    const baseY = py / canvas.height;
    const curvatureStrength = canvas.height * 0.04;
    const centeredX = (x - 0.5) / 0.5;
    const curvatureOffset = centeredX * centeredX * (curvatureStrength / canvas.height);
    const y = clamp(baseY - curvatureOffset, 0, 1);

    return { x, y };
  }

  return {
    update,
    point,
    radius,
    unproject
  };
}
