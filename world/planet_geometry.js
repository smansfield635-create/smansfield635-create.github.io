const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;

function assertFiniteNumber(value, label) {
  if (!Number.isFinite(value)) {
    throw new Error(`Invalid ${label}`);
  }
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function length3(v) {
  return Math.hypot(v[0], v[1], v[2]);
}

function normalize3(v, label = "vector") {
  const len = length3(v);
  if (len <= 1e-9) {
    throw new Error(`Invalid ${label}`);
  }
  return [v[0] / len, v[1] / len, v[2] / len];
}

function dot3(a, b) {
  return (a[0] * b[0]) + (a[1] * b[1]) + (a[2] * b[2]);
}

function cross3(a, b) {
  return [
    (a[1] * b[2]) - (a[2] * b[1]),
    (a[2] * b[0]) - (a[0] * b[2]),
    (a[0] * b[1]) - (a[1] * b[0])
  ];
}

function add3(a, b) {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

function sub3(a, b) {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function scale3(v, s) {
  return [v[0] * s, v[1] * s, v[2] * s];
}

function orthonormalizePrimeMeridian(northAxis, primeMeridianAxis) {
  const north = normalize3(northAxis, "planetNorthAxis");
  const primeRaw = normalize3(primeMeridianAxis, "primeMeridianAxis");
  const dot = dot3(north, primeRaw);

  if (Math.abs(dot) >= 0.999) {
    throw new Error("primeMeridianAxis cannot be parallel to planetNorthAxis");
  }

  const projected = sub3(primeRaw, scale3(north, dot));
  const prime = normalize3(projected, "orthonormalizedPrimeMeridianAxis");
  const east = normalize3(cross3(north, prime), "planetEastAxis");

  return { north, prime, east };
}

function validateConfig(config) {
  assertFiniteNumber(config.planetRadius, "planetRadius");
  assertFiniteNumber(config.atmosphereThickness, "atmosphereThickness");
  assertFiniteNumber(config.waterOffset, "waterOffset");
  assertFiniteNumber(config.worldBounds.width, "worldBounds.width");
  assertFiniteNumber(config.worldBounds.height, "worldBounds.height");
  assertFiniteNumber(config.longitudeSpanDeg, "longitudeSpanDeg");
  assertFiniteNumber(config.latitudeSpanDeg, "latitudeSpanDeg");
  assertFiniteNumber(config.defaultCameraAltitude, "defaultCameraAltitude");
  assertFiniteNumber(config.defaultCameraHeadingDeg, "defaultCameraHeadingDeg");

  if (config.planetRadius <= 0) {
    throw new Error("planetRadius must be > 0");
  }

  if (config.atmosphereThickness <= 0) {
    throw new Error("atmosphereThickness must be > 0");
  }

  if (config.worldBounds.width <= 0 || config.worldBounds.height <= 0) {
    throw new Error("worldBounds must be > 0");
  }

  if (config.longitudeSpanDeg <= 0 || config.longitudeSpanDeg > 360) {
    throw new Error("longitudeSpanDeg must be in (0, 360]");
  }

  if (config.latitudeSpanDeg <= 0 || config.latitudeSpanDeg >= 180) {
    throw new Error("latitudeSpanDeg must be in (0, 180)");
  }
}

function worldPointToLatLon(worldPoint, config) {
  const x = worldPoint?.x ?? 0;
  const y = worldPoint?.y ?? 0;

  assertFiniteNumber(x, "worldPoint.x");
  assertFiniteNumber(y, "worldPoint.y");

  const nx = clamp(x / config.worldBounds.width, 0, 1);
  const ny = clamp(y / config.worldBounds.height, 0, 1);

  const lonDeg = ((nx - 0.5) * config.longitudeSpanDeg) + config.longitudeCenterDeg;
  const latDeg = ((0.5 - ny) * config.latitudeSpanDeg) + config.latitudeCenterDeg;

  return {
    latitudeDeg: latDeg,
    longitudeDeg: lonDeg,
    latitudeRad: latDeg * DEG_TO_RAD,
    longitudeRad: lonDeg * DEG_TO_RAD
  };
}

function latLonToXYZ(latRad, lonRad, radius, basis, planetCenter) {
  const cosLat = Math.cos(latRad);
  const sinLat = Math.sin(latRad);
  const cosLon = Math.cos(lonRad);
  const sinLon = Math.sin(lonRad);

  const onSphere = add3(
    add3(
      scale3(basis.north, sinLat * radius),
      scale3(basis.prime, cosLat * cosLon * radius)
    ),
    scale3(basis.east, cosLat * sinLon * radius)
  );

  return add3(planetCenter, onSphere);
}

function xyzToLatLon(pointXYZ, basis, planetCenter) {
  const radial = normalize3(sub3(pointXYZ, planetCenter), "pointXYZ radial");

  const northComponent = dot3(radial, basis.north);
  const primeComponent = dot3(radial, basis.prime);
  const eastComponent = dot3(radial, basis.east);

  const latitudeRad = Math.asin(clamp(northComponent, -1, 1));
  const longitudeRad = Math.atan2(eastComponent, primeComponent);

  return {
    latitudeRad,
    longitudeRad,
    latitudeDeg: latitudeRad * RAD_TO_DEG,
    longitudeDeg: longitudeRad * RAD_TO_DEG
  };
}

function tangentFrameAt(pointXYZ, basis, planetCenter) {
  const up = normalize3(sub3(pointXYZ, planetCenter), "localUp");
  let east = cross3(basis.north, up);

  if (length3(east) <= 1e-9) {
    east = cross3(basis.prime, up);
  }

  east = normalize3(east, "localEast");
  const north = normalize3(cross3(up, east), "localNorth");

  return {
    up,
    down: scale3(up, -1),
    north,
    east
  };
}

function greatCircleDistanceXYZ(aXYZ, bXYZ, planetCenter, radius) {
  const a = normalize3(sub3(aXYZ, planetCenter), "A radial");
  const b = normalize3(sub3(bXYZ, planetCenter), "B radial");
  const angle = Math.acos(clamp(dot3(a, b), -1, 1));
  return radius * angle;
}

function headingToTangentVector(headingDeg, tangentFrame) {
  const headingRad = headingDeg * DEG_TO_RAD;
  const northPart = scale3(tangentFrame.north, Math.cos(headingRad));
  const eastPart = scale3(tangentFrame.east, Math.sin(headingRad));
  return normalize3(add3(northPart, eastPart), "heading tangent");
}

function createCameraDescriptor(cameraInput, engine) {
  let position;

  if (Array.isArray(cameraInput?.cameraPositionXYZ)) {
    position = cameraInput.cameraPositionXYZ.slice(0, 3);
  } else if (cameraInput?.surfacePoint) {
    position = engine.worldPointToXYZ(cameraInput.surfacePoint, cameraInput.altitude ?? engine.config.defaultCameraAltitude);
  } else if (cameraInput?.worldPoint) {
    position = engine.worldPointToXYZ(cameraInput.worldPoint, cameraInput.altitude ?? engine.config.defaultCameraAltitude);
  } else {
    position = engine.worldPointToXYZ(
      {
        x: engine.config.worldBounds.width * 0.5,
        y: engine.config.worldBounds.height * 0.62
      },
      engine.config.defaultCameraAltitude
    );
  }

  position.forEach((v, i) => assertFiniteNumber(v, `cameraPositionXYZ[${i}]`));

  const distanceFromCenter = length3(sub3(position, engine.config.planetCenter));
  const cameraLocalUp = normalize3(sub3(position, engine.config.planetCenter), "cameraLocalUp");
  const tangentFrame = tangentFrameAt(position, engine.basis, engine.config.planetCenter);

  const headingDeg = Number.isFinite(cameraInput?.headingDeg)
    ? cameraInput.headingDeg
    : engine.config.defaultCameraHeadingDeg;

  const cameraTangentDirection = headingToTangentVector(headingDeg, tangentFrame);

  const suppliedForward = Array.isArray(cameraInput?.cameraForward)
    ? normalize3(cameraInput.cameraForward, "cameraForward")
    : cameraTangentDirection;

  const forwardProjected = normalize3(
    sub3(suppliedForward, scale3(cameraLocalUp, dot3(suppliedForward, cameraLocalUp))),
    "projectedCameraForward"
  );

  const right = normalize3(cross3(forwardProjected, cameraLocalUp), "cameraRight");
  const trueForward = normalize3(cross3(cameraLocalUp, right), "cameraForward");

  return {
    cameraPosition: position,
    cameraDistanceFromCenter: distanceFromCenter,
    cameraLocalUp,
    cameraTangentDirection,
    cameraForward: trueForward,
    cameraRight: right,
    tangentFrame
  };
}

export function createPlanetGeometryEngine(userConfig = {}) {
  const config = Object.freeze({
    planetCenter: Array.isArray(userConfig.planetCenter) ? userConfig.planetCenter.slice(0, 3) : [0, 0, 0],
    planetRadius: Number.isFinite(userConfig.planetRadius) ? userConfig.planetRadius : 1600,
    atmosphereThickness: Number.isFinite(userConfig.atmosphereThickness) ? userConfig.atmosphereThickness : 140,
    waterOffset: Number.isFinite(userConfig.waterOffset) ? userConfig.waterOffset : -18,
    planetNorthAxis: Array.isArray(userConfig.planetNorthAxis) ? userConfig.planetNorthAxis.slice(0, 3) : [0, 1, 0],
    primeMeridianAxis: Array.isArray(userConfig.primeMeridianAxis) ? userConfig.primeMeridianAxis.slice(0, 3) : [1, 0, 0],
    worldBounds: {
      width: Number.isFinite(userConfig.worldBounds?.width) ? userConfig.worldBounds.width : 1180,
      height: Number.isFinite(userConfig.worldBounds?.height) ? userConfig.worldBounds.height : 1240
    },
    longitudeSpanDeg: Number.isFinite(userConfig.longitudeSpanDeg) ? userConfig.longitudeSpanDeg : 84,
    latitudeSpanDeg: Number.isFinite(userConfig.latitudeSpanDeg) ? userConfig.latitudeSpanDeg : 62,
    longitudeCenterDeg: Number.isFinite(userConfig.longitudeCenterDeg) ? userConfig.longitudeCenterDeg : 0,
    latitudeCenterDeg: Number.isFinite(userConfig.latitudeCenterDeg) ? userConfig.latitudeCenterDeg : 0,
    defaultCameraAltitude: Number.isFinite(userConfig.defaultCameraAltitude) ? userConfig.defaultCameraAltitude : 260,
    defaultCameraHeadingDeg: Number.isFinite(userConfig.defaultCameraHeadingDeg) ? userConfig.defaultCameraHeadingDeg : -28
  });

  validateConfig(config);

  const basis = Object.freeze(
    orthonormalizePrimeMeridian(config.planetNorthAxis, config.primeMeridianAxis)
  );

  const atmosphereRadius = config.planetRadius + config.atmosphereThickness;
  const waterRadius = config.planetRadius + config.waterOffset;

  const engine = {
    config,
    basis,

    planetCenter: config.planetCenter,
    planetRadius: config.planetRadius,
    planetDiameter: config.planetRadius * 2,
    atmosphereThickness: config.atmosphereThickness,
    atmosphereRadius,
    waterRadius,
    planetNorthAxis: basis.north,

    latitude(worldPoint) {
      return worldPointToLatLon(worldPoint, config).latitudeDeg;
    },

    longitude(worldPoint) {
      return worldPointToLatLon(worldPoint, config).longitudeDeg;
    },

    worldPointToLatLon(worldPoint) {
      return worldPointToLatLon(worldPoint, config);
    },

    latLonToXYZ(latitudeDeg, longitudeDeg, altitude = 0) {
      assertFiniteNumber(latitudeDeg, "latitudeDeg");
      assertFiniteNumber(longitudeDeg, "longitudeDeg");
      assertFiniteNumber(altitude, "altitude");

      return latLonToXYZ(
        latitudeDeg * DEG_TO_RAD,
        longitudeDeg * DEG_TO_RAD,
        config.planetRadius + altitude,
        basis,
        config.planetCenter
      );
    },

    worldPointToXYZ(worldPoint, altitude = 0) {
      const latLon = worldPointToLatLon(worldPoint, config);
      return latLonToXYZ(
        latLon.latitudeRad,
        latLon.longitudeRad,
        config.planetRadius + altitude,
        basis,
        config.planetCenter
      );
    },

    xyzToLatLon(pointXYZ) {
      return xyzToLatLon(pointXYZ, basis, config.planetCenter);
    },

    localUp(worldPoint) {
      return tangentFrameAt(this.worldPointToXYZ(worldPoint), basis, config.planetCenter).up;
    },

    localDown(worldPoint) {
      return tangentFrameAt(this.worldPointToXYZ(worldPoint), basis, config.planetCenter).down;
    },

    tangentPlane(worldPoint) {
      const pointXYZ = this.worldPointToXYZ(worldPoint);
      const frame = tangentFrameAt(pointXYZ, basis, config.planetCenter);

      return Object.freeze({
        originXYZ: pointXYZ,
        normal: frame.up,
        north: frame.north,
        east: frame.east
      });
    },

    azimuth(headingDeg, worldPoint) {
      assertFiniteNumber(headingDeg, "headingDeg");
      const tangent = this.tangentPlane(worldPoint);
      const heading = headingToTangentVector(headingDeg, tangent);
      const northDot = dot3(heading, tangent.north);
      const eastDot = dot3(heading, tangent.east);
      const azimuthRad = Math.atan2(eastDot, northDot);
      return azimuthRad * RAD_TO_DEG;
    },

    surfaceAltitude(worldPoint) {
      const altitude = Number.isFinite(worldPoint?.altitude) ? worldPoint.altitude : 0;
      const pointXYZ = this.worldPointToXYZ(worldPoint, altitude);
      return length3(sub3(pointXYZ, config.planetCenter)) - config.planetRadius;
    },

    waterRelativeAltitude(worldPoint) {
      const altitude = Number.isFinite(worldPoint?.altitude) ? worldPoint.altitude : 0;
      const pointXYZ = this.worldPointToXYZ(worldPoint, altitude);
      return length3(sub3(pointXYZ, config.planetCenter)) - waterRadius;
    },

    greatCircleDistance(aWorldPoint, bWorldPoint) {
      const aXYZ = this.worldPointToXYZ(aWorldPoint);
      const bXYZ = this.worldPointToXYZ(bWorldPoint);
      return greatCircleDistanceXYZ(aXYZ, bXYZ, config.planetCenter, config.planetRadius);
    },

    createCamera(cameraInput = {}) {
      return createCameraDescriptor(cameraInput, this);
    },

    horizonAngle(cameraInput = {}) {
      const camera = createCameraDescriptor(cameraInput, this);
      return Math.acos(clamp(config.planetRadius / camera.cameraDistanceFromCenter, -1, 1));
    },

    cameraTangentDirection(cameraInput = {}) {
      return createCameraDescriptor(cameraInput, this).cameraTangentDirection;
    },

    visibleLimbDirection(cameraInput = {}) {
      const camera = createCameraDescriptor(cameraInput, this);
      const limb = normalize3(cross3(camera.cameraRight, camera.cameraLocalUp), "visibleLimbDirection");
      return limb;
    },

    getPlanetaryGeometry(cameraInput = {}) {
      const camera = createCameraDescriptor(cameraInput, this);
      return Object.freeze({
        planetCenter: config.planetCenter,
        planetRadius: config.planetRadius,
        planetDiameter: config.planetRadius * 2,
        atmosphereThickness: config.atmosphereThickness,
        atmosphereRadius,
        waterRadius,
        planetNorthAxis: basis.north,
        cameraPosition: camera.cameraPosition,
        cameraDistanceFromCenter: camera.cameraDistanceFromCenter,
        cameraLocalUp: camera.cameraLocalUp,
        cameraTangentDirection: camera.cameraTangentDirection,
        horizonAngle: Math.acos(clamp(config.planetRadius / camera.cameraDistanceFromCenter, -1, 1)),
        visibleLimbDirection: normalize3(cross3(camera.cameraRight, camera.cameraLocalUp), "visibleLimbDirection")
      });
    }
  };

  return Object.freeze(engine);
}
