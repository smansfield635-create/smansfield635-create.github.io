/* /assets/earth/earth_physics_sensor.js
   EARTH_G6_PHYSICS_SENSOR_TELEMETRY_TNT_v1
   Virtual satellite sensor / telemetry authority only.
*/

(function () {
  "use strict";

  const VERSION = "EARTH_G6_PHYSICS_SENSOR_TELEMETRY_TNT_v1";
  const TWO_PI = Math.PI * 2;

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function wrap01(value) {
    return ((value % 1) + 1) % 1;
  }

  function normalize(v) {
    const length = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z) || 1;
    return {
      x: v.x / length,
      y: v.y / length,
      z: v.z / length
    };
  }

  function dot(a, b) {
    return a.x * b.x + a.y * b.y + a.z * b.z;
  }

  function create(options) {
    const input = options || {};
    const axialTiltDegrees = Number.isFinite(Number(input.axialTiltDegrees))
      ? Number(input.axialTiltDegrees)
      : 23.44;

    const base = {
      axialTiltDegrees,
      axialTiltRadians: axialTiltDegrees * Math.PI / 180,
      lightVector: normalize(input.lightVector || { x: -0.46, y: -0.28, z: 0.84 }),
      cameraVector: normalize({ x: 0, y: 0, z: 1 }),
      sensorAltitudeKm: 35786,
      earthRadiusKm: 6371,
      virtualOrbit: "geostationary_style_observer",
      sourceStandard: "PHYSICS_SYNTHETIC_SATELLITE_VIEW"
    };

    function getTelemetry(motion) {
      const m = motion || {};
      const now = performance.now();
      const seconds = now / 1000;

      return {
        version: VERSION,
        seconds,
        axialTiltDegrees: base.axialTiltDegrees,
        axialTiltRadians: base.axialTiltRadians,
        lightVector: base.lightVector,
        cameraVector: base.cameraVector,
        sensorAltitudeKm: base.sensorAltitudeKm,
        earthRadiusKm: base.earthRadiusKm,
        surfacePhase: wrap01(Number(m.surfacePhase || 0)),
        cloudPhase: wrap01(Number(m.cloudPhase || 0)),
        userPhase: wrap01(Number(m.userPhase || 0)),
        sourceStandard: base.sourceStandard
      };
    }

    function surfaceCoordinates(normal, telemetry, phaseKind) {
      const phase =
        phaseKind === "cloud"
          ? telemetry.cloudPhase
          : telemetry.surfacePhase + telemetry.userPhase;

      const phaseRadians = wrap01(phase) * TWO_PI;
      const tilt = telemetry.axialTiltRadians;
      const cosT = Math.cos(tilt);
      const sinT = Math.sin(tilt);

      const x = normal.x;
      const y = normal.y;
      const z = normal.z;

      const tiltedY = y * cosT - z * sinT;
      const tiltedZ = y * sinT + z * cosT;

      const lat = Math.asin(clamp(tiltedY, -1, 1));
      const lon = Math.atan2(x, tiltedZ) + phaseRadians;

      return { lat, lon };
    }

    function lightAmount(normal, telemetry) {
      return clamp(dot(normal, telemetry.lightVector) * 0.5 + 0.5, 0, 1);
    }

    return Object.freeze({
      version: VERSION,
      getTelemetry,
      surfaceCoordinates,
      lightAmount
    });
  }

  function getStatus() {
    return {
      version: VERSION,
      contract: VERSION,
      owns: [
        "virtual_satellite_camera",
        "orbital_viewpoint",
        "axial_tilt",
        "light_vector",
        "limb_rim_sensor_read",
        "surface_coordinate_projection"
      ],
      doesNotOwn: [
        "surface_classification",
        "canvas_drawing",
        "runtime_lifecycle",
        "material_css",
        "image_generation",
        "GraphicBox"
      ],
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    };
  }

  window.DGBEarthPhysicsSensor = Object.freeze({
    version: VERSION,
    create,
    getStatus
  });
})();
