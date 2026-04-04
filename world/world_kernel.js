export function createWorldKernel(config = {}) {
  const seed = Number.isFinite(config.seed) ? config.seed : 25645161;
  const regionRadius = Number.isFinite(config.regionRadius) ? config.regionRadius : 100;
  const waterRadius = Number.isFinite(config.waterRadius) ? config.waterRadius : 136;

  const rng = createRng(seed);

  const regionPolygon = createDiamondPolygon(regionRadius, 40, 0.16, rng);
  const innerPolygon = createDiamondPolygon(regionRadius * 0.72, 28, 0.12, rng);
  const waterPolygon = createDiamondPolygon(waterRadius, 56, 0.05, rng);

  const gridLines = createGridLines(regionRadius, 8);
  const paths = createPaths(regionRadius);
  const markers = createMarkers(regionRadius);
  const stars = createStars(64, 210, rng);

  const world = {
    seed,
    bounds: {
      minX: -waterRadius,
      maxX: waterRadius,
      minY: -waterRadius,
      maxY: waterRadius
    },
    regions: [
      {
        id: "outer-ground",
        type: "ground",
        polygon: regionPolygon
      },
      {
        id: "inner-rise",
        type: "ground-inner",
        polygon: innerPolygon
      }
    ],
    waters: [
      {
        id: "water-shell",
        type: "water",
        polygon: waterPolygon
      }
    ],
    gridLines,
    paths,
    markers,
    stars
  };

  function getWorld() {
    return world;
  }

  return { getWorld };
}

function createDiamondPolygon(radius, pointsPerSide, jitter, rng) {
  const corners = [
    [0, -radius],
    [radius, 0],
    [0, radius],
    [-radius, 0]
  ];

  const polygon = [];

  for (let c = 0; c < corners.length; c += 1) {
    const a = corners[c];
    const b = corners[(c + 1) % corners.length];

    for (let i = 0; i < pointsPerSide; i += 1) {
      const t = i / pointsPerSide;
      const x = lerp(a[0], b[0], t);
      const y = lerp(a[1], b[1], t);
      const nx = (rng() - 0.5) * radius * jitter;
      const ny = (rng() - 0.5) * radius * jitter;
      polygon.push({ x: x + nx, y: y + ny });
    }
  }

  return polygon;
}

function createGridLines(radius, divisions) {
  const lines = [];
  const step = (radius * 2) / divisions;

  for (let i = 1; i < divisions; i += 1) {
    const offset = -radius + step * i;
    const span = radius - Math.abs(offset);

    lines.push({
      a: { x: -span, y: offset },
      b: { x: span, y: offset }
    });

    lines.push({
      a: { x: offset, y: -span },
      b: { x: offset, y: span }
    });
  }

  return lines;
}

function createPaths(radius) {
  const north = { x: 0, y: -radius * 0.74 };
  const east = { x: radius * 0.74, y: 0 };
  const south = { x: 0, y: radius * 0.74 };
  const west = { x: -radius * 0.74, y: 0 };
  const center = { x: 0, y: 0 };

  return [
    { id: "north-south", points: [north, center, south] },
    { id: "west-east", points: [west, center, east] },
    {
      id: "ring",
      points: [
        { x: 0, y: -radius * 0.46 },
        { x: radius * 0.46, y: 0 },
        { x: 0, y: radius * 0.46 },
        { x: -radius * 0.46, y: 0 },
        { x: 0, y: -radius * 0.46 }
      ]
    }
  ];
}

function createMarkers(radius) {
  return [
    { id: "north", label: "North", x: 0, y: -radius * 0.88, size: 5 },
    { id: "east", label: "East", x: radius * 0.88, y: 0, size: 5 },
    { id: "south", label: "South", x: 0, y: radius * 0.88, size: 5 },
    { id: "west", label: "West", x: -radius * 0.88, y: 0, size: 5 },
    { id: "core", label: "Core", x: 0, y: 0, size: 6 }
  ];
}

function createStars(count, spread, rng) {
  const stars = [];
  for (let i = 0; i < count; i += 1) {
    stars.push({
      x: (rng() - 0.5) * spread * 2.4,
      y: -Math.abs(rng() * spread * 1.1) - 40,
      size: 0.5 + rng() * 1.8,
      alpha: 0.25 + rng() * 0.75
    });
  }
  return stars;
}

function createRng(seed) {
  let value = seed >>> 0;
  return function next() {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}
