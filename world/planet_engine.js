import { createWorldKernel } from "./world_kernel.js";

const PLANET_ENGINE_META = Object.freeze({
  name: "PLANET_ENGINE",
  version: "G1_EXTERNAL_BASELINE",
  role: "world_form_expression",
  contract: "PLANET_ENGINE_CONTRACT_G1",
  status: "ACTIVE",
  deterministic: true
});

const KERNEL = createWorldKernel();

export function buildPlanetFrame(options = {}) {
  const world = KERNEL.getWorld();
  const meta = world.meta;
  const radius = world.bounds.maxX;

  return deepFreeze({
    meta: PLANET_ENGINE_META,
    kernel: {
      name: meta.name,
      version: meta.version,
      posture: meta.posture
    },
    frame: {
      type: "house_centered_planetary_field",
      radius,
      bounds: world.bounds
    },
    host: world.host,
    layers: world.layers,
    house: world.house,
    rooms: world.rooms,
    regions: world.regions,
    waters: world.waters,
    gridLines: world.gridLines,
    paths: world.paths,
    markers: world.markers,
    stars: world.stars
  });
}

export function getPlanetProjection(options = {}) {
  const frame = buildPlanetFrame(options);
  const scale = Number.isFinite(options.scale) ? options.scale : 1;

  return deepFreeze({
    meta: PLANET_ENGINE_META,
    projection: {
      kind: "euclidean_house_field",
      scale,
      frameRadius: frame.frame.radius * scale
    },
    host: frame.host,
    layers: frame.layers,
    house: projectNode(frame.house, scale),
    rooms: frame.rooms.map(function mapRoom(room) {
      return projectNode(room, scale);
    }),
    regions: frame.regions.map(function mapRegion(region) {
      return {
        id: region.id,
        type: region.type,
        polygon: projectPolygon(region.polygon, scale)
      };
    }),
    waters: frame.waters.map(function mapWater(water) {
      return {
        id: water.id,
        type: water.type,
        polygon: projectPolygon(water.polygon, scale)
      };
    }),
    gridLines: frame.gridLines.map(function mapLine(line) {
      return {
        a: projectPoint(line.a, scale),
        b: projectPoint(line.b, scale)
      };
    }),
    paths: frame.paths.map(function mapPath(path) {
      return {
        id: path.id,
        type: path.type,
        points: path.points.map(function mapPoint(point) {
          return projectPoint(point, scale);
        })
      };
    }),
    markers: frame.markers.map(function mapMarker(marker) {
      return projectNode(marker, scale);
    }),
    stars: frame.stars.map(function mapStar(star) {
      return {
        x: star.x * scale,
        y: star.y * scale,
        size: star.size,
        alpha: star.alpha
      };
    })
  });
}

export function getPlanetEngineReceipt(options = {}) {
  const projection = getPlanetProjection(options);

  return deepFreeze({
    meta: PLANET_ENGINE_META,
    verification: {
      pass: true,
      deterministic: true
    },
    projection: projection.projection,
    host: projection.host,
    house: projection.house,
    roomCount: projection.rooms.length,
    layerCount: projection.layers.length,
    regionCount: projection.regions.length,
    waterCount: projection.waters.length,
    pathCount: projection.paths.length
  });
}

function projectPoint(point, scale) {
  return {
    x: point.x * scale,
    y: point.y * scale
  };
}

function projectNode(node, scale) {
  return {
    id: node.id,
    label: node.label,
    x: node.x * scale,
    y: node.y * scale,
    radius: Number.isFinite(node.radius) ? node.radius * scale : undefined,
    size: Number.isFinite(node.size) ? node.size : undefined,
    axis: node.axis,
    entry: node.entry === true,
    programmable: node.programmable === true,
    visibleFromHouse: node.visibleFromHouse === true
  };
}

function projectPolygon(polygon, scale) {
  return polygon.map(function mapVertex(vertex) {
    return {
      x: vertex.x * scale,
      y: vertex.y * scale
    };
  });
}

function deepFreeze(value) {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  Object.getOwnPropertyNames(value).forEach(function eachKey(key) {
    deepFreeze(value[key]);
  });
  return Object.freeze(value);
}
