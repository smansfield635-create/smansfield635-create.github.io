function createLeafContour() {
  return Object.freeze([
    { x: -1.00, y: -0.05 },
    { x: -0.84, y: -0.34 },
    { x: -0.58, y: -0.56 },
    { x: -0.24, y: -0.68 },
    { x: 0.10, y: -0.62 },
    { x: 0.42, y: -0.44 },
    { x: 0.70, y: -0.16 },
    { x: 0.86, y: 0.16 },
    { x: 0.82, y: 0.42 },
    { x: 0.60, y: 0.66 },
    { x: 0.26, y: 0.82 },
    { x: -0.14, y: 0.84 },
    { x: -0.46, y: 0.68 },
    { x: -0.72, y: 0.42 },
    { x: -0.90, y: 0.12 }
  ]);
}

function createHookContour() {
  return Object.freeze([
    { x: -0.96, y: -0.18 },
    { x: -0.74, y: -0.50 },
    { x: -0.38, y: -0.72 },
    { x: 0.02, y: -0.74 },
    { x: 0.34, y: -0.54 },
    { x: 0.56, y: -0.18 },
    { x: 0.60, y: 0.10 },
    { x: 0.46, y: 0.40 },
    { x: 0.14, y: 0.66 },
    { x: -0.20, y: 0.78 },
    { x: -0.42, y: 0.70 },
    { x: -0.18, y: 0.44 },
    { x: 0.04, y: 0.20 },
    { x: 0.02, y: -0.02 },
    { x: -0.20, y: 0.04 },
    { x: -0.48, y: 0.18 },
    { x: -0.76, y: 0.08 }
  ]);
}

function createShardContour() {
  return Object.freeze([
    { x: -0.90, y: -0.10 },
    { x: -0.66, y: -0.44 },
    { x: -0.28, y: -0.70 },
    { x: 0.10, y: -0.64 },
    { x: 0.36, y: -0.30 },
    { x: 0.42, y: 0.08 },
    { x: 0.24, y: 0.44 },
    { x: -0.08, y: 0.72 },
    { x: -0.42, y: 0.80 },
    { x: -0.68, y: 0.56 },
    { x: -0.84, y: 0.24 }
  ]);
}

function createPebbleContour() {
  return Object.freeze([
    { x: -0.82, y: -0.06 },
    { x: -0.62, y: -0.42 },
    { x: -0.24, y: -0.66 },
    { x: 0.18, y: -0.64 },
    { x: 0.54, y: -0.40 },
    { x: 0.76, y: -0.04 },
    { x: 0.72, y: 0.28 },
    { x: 0.46, y: 0.58 },
    { x: 0.08, y: 0.76 },
    { x: -0.30, y: 0.72 },
    { x: -0.62, y: 0.48 },
    { x: -0.80, y: 0.16 }
  ]);
}

const LANDMASS_REGISTRY = Object.freeze([
  Object.freeze({
    id: "northwest_crown",
    anchorLon: -0.88,
    anchorLat: 0.52,
    lonScale: 0.30,
    latScale: 0.19,
    fill: "#b9ef79",
    edge: "#f5ffd8",
    highlight: "rgba(255,255,255,0.10)",
    contour: createLeafContour()
  }),
  Object.freeze({
    id: "eastern_main",
    anchorLon: 1.05,
    anchorLat: 0.04,
    lonScale: 0.38,
    latScale: 0.22,
    fill: "#c7f178",
    edge: "#fbffda",
    highlight: "rgba(255,255,255,0.10)",
    contour: createHookContour()
  }),
  Object.freeze({
    id: "southwest_shard",
    anchorLon: -2.08,
    anchorLat: -0.18,
    lonScale: 0.18,
    latScale: 0.15,
    fill: "#88e27c",
    edge: "#ecffd7",
    highlight: "rgba(255,255,255,0.08)",
    contour: createShardContour()
  }),
  Object.freeze({
    id: "northeast_isle",
    anchorLon: 2.42,
    anchorLat: 0.62,
    lonScale: 0.15,
    latScale: 0.10,
    fill: "#d3f37f",
    edge: "#fbffe2",
    highlight: "rgba(255,255,255,0.09)",
    contour: createPebbleContour()
  }),
  Object.freeze({
    id: "southern_isle",
    anchorLon: 0.14,
    anchorLat: -0.58,
    lonScale: 0.10,
    latScale: 0.08,
    fill: "#aeea82",
    edge: "#f3ffdf",
    highlight: "rgba(255,255,255,0.08)",
    contour: createPebbleContour()
  })
]);

function projectLandmassPoint(projector, landmass, point) {
  const lon = landmass.anchorLon + point.x * landmass.lonScale;
  const lat = landmass.anchorLat + point.y * landmass.latScale;
  const projected = projector.projectSphere(lon, lat);

  return Object.freeze({
    x: projected.x,
    y: projected.y,
    visible: projected.visible
  });
}

function buildProjectedLandmass(projector, landmass) {
  const projectedPoints = landmass.contour.map((point) => projectLandmassPoint(projector, landmass, point));
  const visiblePoints = projectedPoints.filter((point) => point.visible);

  return Object.freeze({
    landmass,
    visiblePoints,
    visibleRatio: projectedPoints.length ? visiblePoints.length / projectedPoints.length : 0
  });
}

function drawProjectedLandmass(ctx, projectedLandmass) {
  const { landmass, visiblePoints, visibleRatio } = projectedLandmass;
  if (visiblePoints.length < 4) return;
  if (visibleRatio < 0.45) return;

  ctx.beginPath();
  ctx.moveTo(visiblePoints[0].x, visiblePoints[0].y);
  for (let i = 1; i < visiblePoints.length; i += 1) {
    ctx.lineTo(visiblePoints[i].x, visiblePoints[i].y);
  }
  ctx.closePath();
  ctx.fillStyle = landmass.fill;
  ctx.fill();

  ctx.save();
  ctx.globalAlpha = 0.16;
  ctx.strokeStyle = landmass.edge;
  ctx.lineWidth = 1.05;
  ctx.stroke();
  ctx.restore();
}

export function createSurfaceEngine() {
  const classes = Object.freeze({
    shoreline: Object.freeze({ enabled: true, coverage: "256x256" }),
    infrastructure: Object.freeze({ enabled: true, coverage: "256x256" }),
    terrain: Object.freeze({ enabled: true, coverage: "256x256" }),
    foliage: Object.freeze({ enabled: true, coverage: "256x256" })
  });

  function renderBase(ctx, projector) {
    ctx.strokeStyle = "rgba(255,255,255,0.045)";
    ctx.lineWidth = 1;

    for (let latDeg = -60; latDeg <= 60; latDeg += 20) {
      let first = true;
      ctx.beginPath();

      for (let lonDeg = 0; lonDeg <= 360; lonDeg += 8) {
        const point = projector.projectSphere((lonDeg * Math.PI) / 180, (latDeg * Math.PI) / 180);
        if (!point.visible) {
          first = true;
          continue;
        }
        if (first) {
          ctx.moveTo(point.x, point.y);
          first = false;
        } else {
          ctx.lineTo(point.x, point.y);
        }
      }

      ctx.stroke();
    }

    ctx.strokeStyle = "rgba(190,220,255,0.03)";
    ctx.lineWidth = 1;

    for (let lonDeg = 0; lonDeg < 360; lonDeg += 20) {
      let first = true;
      ctx.beginPath();

      for (let latDeg = -90; latDeg <= 90; latDeg += 5) {
        const point = projector.projectSphere((lonDeg * Math.PI) / 180, (latDeg * Math.PI) / 180);
        if (!point.visible) {
          first = true;
          continue;
        }
        if (first) {
          ctx.moveTo(point.x, point.y);
          first = false;
        } else {
          ctx.lineTo(point.x, point.y);
        }
      }

      ctx.stroke();
    }

    LANDMASS_REGISTRY.forEach((landmass) => {
      drawProjectedLandmass(ctx, buildProjectedLandmass(projector, landmass));
    });
  }

  function renderOverlay(ctx, projector, runtime, state) {
    if (!state.gridBound) return;

    const { centerX, centerY, radius } = projector.state;
    const row = state.localSelection.row;
    const col = state.localSelection.col;
    const cellWidth = (radius * 1.08) / 4;
    const cellHeight = (radius * 1.08) / 4;
    const x = centerX - radius * 0.54 + col * cellWidth;
    const y = centerY - radius * 0.54 + row * cellHeight;

    ctx.save();
    ctx.fillStyle = "rgba(121,169,255,0.05)";
    ctx.strokeStyle = "rgba(121,169,255,0.18)";
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.rect(x, y, cellWidth, cellHeight);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  return Object.freeze({
    classes,
    renderBase,
    renderOverlay
  });
}
