export function createWorldKernel(config = {}) {
  const seed = Number.isFinite(config.seed) ? config.seed : 25645161;
  const regionRadius = Number.isFinite(config.regionRadius) ? config.regionRadius : 100;
  const waterRadius = Number.isFinite(config.waterRadius) ? config.waterRadius : 136;
  const roomRadius = Number.isFinite(config.roomRadius) ? config.roomRadius : regionRadius * 0.28;
  const rng = createRng(seed);

  const regionPolygon = createDiamondPolygon(regionRadius, 40, 0.16, rng);
  const innerPolygon = createDiamondPolygon(regionRadius * 0.72, 28, 0.12, rng);
  const waterPolygon = createDiamondPolygon(waterRadius, 56, 0.05, rng);

  const gridLines = createGridLines(regionRadius, 8);
  const paths = createPaths(regionRadius);
  const markers = createMarkers(regionRadius);
  const stars = createStars(64, 210, rng);
  const rooms = createRooms(regionRadius, roomRadius);
  const house = createHouse(regionRadius, roomRadius);
  const layers = createLayers(regionRadius, waterRadius);

  const world = deepFreeze({
    meta: {
      name: "WORLD_KERNEL",
      version: "G1_EXTERNAL_BASELINE",
      seed,
      role: "external_host_truth",
      status: "ACTIVE",
      posture: "HOUSE_FIRST",
      signalLaw: "SUBORDINATE_TO_GEOMETRY",
      metaverse: "DOWNSTREAM_OPTIONAL"
    },

    seed,

    bounds: {
      minX: -waterRadius,
      maxX: waterRadius,
      minY: -waterRadius,
      maxY: waterRadius
    },

    host: {
      type: "house_first_external_host",
      publicEntry: "house",
      descendantOrder: ["render", "control", "index", "explore", "products"]
    },

    layers,

    house,

    rooms,

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
  });

  function getWorld() {
    return world;
  }

  function getMeta() {
    return world.meta;
  }

  function getHostRead() {
    return deepFreeze({
      publicEntry: world.host.publicEntry,
      house: world.house.id,
      roomCount: world.rooms.length,
      layers: world.layers.map(function mapLayer(layer) {
        return {
          id: layer.id,
          label: layer.label,
          public: layer.public
        };
      })
    });
  }

  return {
    getWorld,
    getMeta,
    getHostRead
  };
}

function createLayers(regionRadius, waterRadius) {
  return deepFreeze([
    {
      id: "flat",
      label: "World Is Flat",
      type: "schematic",
      public: true,
      description: "Under-the-hood schematic/platform/engineering layer.",
      radius: regionRadius
    },
    {
      id: "round",
      label: "World Is Round",
      type: "living-world",
      public: true,
      description: "Living environmental layer: tree, fruit, insects, duration.",
      radius: regionRadius * 0.9
    },
    {
      id: "globe",
      label: "World Is A Globe",
      type: "metaverse",
      public: true,
      description: "Outer metaverse layer. Optional for first-contact users.",
      radius: waterRadius
    }
  ]);
}

function createHouse(regionRadius, roomRadius) {
  return deepFreeze({
    id: "house-core",
    label: "House",
    x: 0,
    y: 0,
    radius: roomRadius * 0.92,
    entry: true,
    programmable: true,
    visibleRooms: true,
    shellRadius: regionRadius * 0.42
  });
}

function createRooms(regionRadius, roomRadius) {
  const offsets = [
    { id: "north-room", label: "North Room", x: 0, y: -regionRadius * 0.30, axis: "N" },
    { id: "east-room", label: "East Room", x: regionRadius * 0.30, y: 0, axis: "E" },
    { id: "south-room", label: "South Room", x: 0, y: regionRadius * 0.30, axis: "S" },
    { id: "west-room", label: "West Room", x: -regionRadius * 0.30, y: 0, axis: "W" }
  ];

  return deepFreeze(
    offsets.map(function mapRoom(room) {
      return {
        id: room.id,
        label: room.label,
        axis: room.axis,
        x: room.x,
        y: room.y,
        radius: roomRadius,
        programmable: true,
        visibleFromHouse: true
      };
    })
  );
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

      polygon.push({
        x: x + nx,
        y: y + ny
      });
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
    {
      id: "north-south",
      type: "axis",
      points: [north, center, south]
    },
    {
      id: "west-east",
      type: "axis",
      points: [west, center, east]
    },
    {
      id: "house-ring",
      type: "house-ring",
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
    { id: "house", label: "House", x: 0, y: 0, size: 7 }
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

function deepFreeze(value) {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;

  Object.getOwnPropertyNames(value).forEach(function eachKey(key) {
    deepFreeze(value[key]);
  });

  return Object.freeze(value);
}
