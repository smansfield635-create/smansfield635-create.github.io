// /world/control.js
// MODE: CONTROL CONTRACT RENEWAL
// STATUS: MOTION-AUTHORITY | SINGLE-SOURCE-OF-TRUTH | NON-DRIFT
// OWNER: SEAN

function clamp(v, a, b) {
  return Math.max(a, Math.min(b, v));
}

function wrapAngle(v) {
  return Math.atan2(Math.sin(v), Math.cos(v));
}

function degToRad(d) {
  return (d * Math.PI) / 180;
}

/* =========================
   CONTRACT PRINCIPLE
========================= */
// Control owns ALL visible motion:
// - rotation (yaw)
// - tilt (pitch)
// - zoom
// - inertia
// - auto spin
// - projection

/* =========================
   CREATE CONTROL SYSTEM
========================= */

export function createControlSystem() {
  /* ===== STATE ===== */

  let yaw = 0;
  let pitch = 0;

  let yawVelocity = 0;
  let pitchVelocity = 0;

  let zoom = 1;

  let autoSpinEnabled = true;
  let autoSpinSpeed = 0.00008; // STRONGER than before

  let radius = 1;
  let centerX = 0;
  let centerY = 0;

  let width = 0;
  let height = 0;

  /* ===== CONFIG ===== */

  const MIN_PITCH = -Math.PI / 2.2;
  const MAX_PITCH = Math.PI / 2.2;

  const INERTIA_DECAY = 0.985; // less damping → visible motion
  const VELOCITY_EPSILON = 0.0000001;

  /* =========================
     CORE
  ========================= */

  function resize(w, h) {
    width = w;
    height = h;

    centerX = w * 0.5;
    centerY = h * 0.5;

    radius = Math.min(w, h) * 0.36;
  }

  function stepInertia(dtMs = 16.6) {
    const scale = clamp(dtMs / 16.6, 0.5, 2);

    // auto spin ALWAYS contributes
    if (autoSpinEnabled) {
      yawVelocity += autoSpinSpeed * scale;
    }

    yaw = wrapAngle(yaw + yawVelocity * scale);
    pitch += pitchVelocity * scale;

    pitch = clamp(pitch, MIN_PITCH, MAX_PITCH);

    yawVelocity *= Math.pow(INERTIA_DECAY, scale);
    pitchVelocity *= Math.pow(INERTIA_DECAY, scale);

    if (Math.abs(yawVelocity) < VELOCITY_EPSILON) yawVelocity = 0;
    if (Math.abs(pitchVelocity) < VELOCITY_EPSILON) pitchVelocity = 0;
  }

  /* =========================
     PROJECTION (AUTHORITATIVE)
  ========================= */

  function projectSphere(latDeg, lonDeg) {
    const lat = degToRad(latDeg);
    const lon = degToRad(lonDeg);

    const cosLat = Math.cos(lat);
    const sinLat = Math.sin(lat);

    const cosLon = Math.cos(lon + yaw);
    const sinLon = Math.sin(lon + yaw);

    const cosPitch = Math.cos(pitch);
    const sinPitch = Math.sin(pitch);

    const x = cosLat * sinLon;
    const y0 = sinLat;
    const z0 = cosLat * cosLon;

    const y = y0 * cosPitch - z0 * sinPitch;
    const z = y0 * sinPitch + z0 * cosPitch;

    const r = Math.max(1, radius * zoom);

    return {
      x: centerX + x * r,
      y: centerY - y * r,
      z,
      visible: z >= 0
    };
  }

  /* =========================
     STATE ACCESS
  ========================= */

  function getCameraGeometry() {
    return {
      width,
      height,
      centerX,
      centerY,
      resolvedRadius: radius * zoom
    };
  }

  function getCameraState() {
    return {
      yaw,
      pitch,
      yawVelocity,
      pitchVelocity,
      zoomCurrent: zoom,
      autoSpinEnabled,
      autoSpinSpeed
    };
  }

  /* =========================
     CONTROL SETTERS
  ========================= */

  function setAutoSpinEnabled(v) {
    autoSpinEnabled = v === true;
  }

  function setAutoSpinSpeed(v) {
    if (typeof v === "number" && Number.isFinite(v)) {
      autoSpinSpeed = v;
    }
  }

  function setZoom(v) {
    if (typeof v === "number" && Number.isFinite(v)) {
      zoom = clamp(v, 0.5, 4);
    }
  }

  function nudgeRotation(dYaw, dPitch) {
    yawVelocity += dYaw;
    pitchVelocity += dPitch;
  }

  /* =========================
     RETURN CONTRACT
  ========================= */

  return Object.freeze({
    resize,
    stepInertia,
    projectSphere,
    getCameraGeometry,
    getCameraState,
    setAutoSpinEnabled,
    setAutoSpinSpeed,
    setZoom,
    nudgeRotation
  });
}

/* =========================
   DEFAULT EXPORT
========================= */

const DEFAULT_CONTROL = createControlSystem();

export function projectSphere(latDeg, lonDeg) {
  return DEFAULT_CONTROL.projectSphere(latDeg, lonDeg);
}
