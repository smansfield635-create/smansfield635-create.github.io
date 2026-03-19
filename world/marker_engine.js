export function createMarkerEngine() {
  const MARKER_PADDING = 18;
  const MARKER_PASSES = 3;
  const MARKER_OUTWARD_NUDGE = 8;

  function isFiniteNumber(value) {
    return typeof value === "number" && Number.isFinite(value);
  }

  function normalizeArray(value) {
    return Array.isArray(value) ? value : [];
  }

  function getViewportCenter() {
    return Object.freeze({
      x: window.innerWidth * 0.5,
      y: window.innerHeight * 0.5
    });
  }

  function cloneHit(hit, center) {
    const radius = isFiniteNumber(hit?.radius) ? hit.radius : 42;
    const dx = hit.x - center.x;
    const dy = hit.y - center.y;

    return {
      id: hit.id,
      label: hit.label,
      route: hit.route,
      x: hit.x,
      y: hit.y,
      radius,
      angle: Math.atan2(dy, dx)
    };
  }

  function normalizeAngle(value) {
    const twoPi = Math.PI * 2;
    let angle = value;
    while (angle <= -Math.PI) angle += twoPi;
    while (angle > Math.PI) angle -= twoPi;
    return angle;
  }

  function computeVector(hit, center) {
    const dx = hit.x - center.x;
    const dy = hit.y - center.y;
    const length = Math.sqrt(dx * dx + dy * dy);

    if (length > 0.0001) {
      return Object.freeze({
        ux: dx / length,
        uy: dy / length
      });
    }

    return Object.freeze({
      ux: Math.cos(hit.angle),
      uy: Math.sin(hit.angle)
    });
  }

  function applySeparation(a, b, center) {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const minDistance = a.radius + b.radius + MARKER_PADDING;

    if (distance >= minDistance) return false;

    const overlap = minDistance - Math.max(distance, 0.0001);
    const va = computeVector(a, center);
    const vb = computeVector(b, center);

    a.x -= va.ux * (overlap * 0.5);
    a.y -= va.uy * (overlap * 0.5);
    b.x += vb.ux * (overlap * 0.5);
    b.y += vb.uy * (overlap * 0.5);

    return true;
  }

  function clampToViewport(hit) {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const margin = hit.radius + 4;

    hit.x = Math.max(margin, Math.min(width - margin, hit.x));
    hit.y = Math.max(margin, Math.min(height - margin, hit.y));
  }

  function countCollisions(hits) {
    let count = 0;

    for (let i = 0; i < hits.length; i++) {
      for (let j = i + 1; j < hits.length; j++) {
        const dx = hits[j].x - hits[i].x;
        const dy = hits[j].y - hits[i].y;
        const minDistance = hits[i].radius + hits[j].radius + MARKER_PADDING;

        if ((dx * dx) + (dy * dy) < minDistance * minDistance) {
          count++;
        }
      }
    }

    return count;
  }

  function validateViewport(hits) {
    const width = window.innerWidth;
    const height = window.innerHeight;

    for (const hit of hits) {
      if (hit.x - hit.radius < 0) return false;
      if (hit.x + hit.radius > width) return false;
      if (hit.y - hit.radius < 0) return false;
      if (hit.y + hit.radius > height) return false;
    }

    return true;
  }

  function stage(rawHits, gateAllowed) {
    const received = normalizeArray(rawHits);

    const staged = gateAllowed
      ? received
          .filter(h => h && isFiniteNumber(h.x) && isFiniteNumber(h.y))
          .filter(h => h.frontFacing === true)
          .map(h => Object.freeze({
            id: h.id,
            label: h.label,
            route: h.route,
            x: h.x,
            y: h.y,
            radius: isFiniteNumber(h.radius) ? h.radius : 42
          }))
      : [];

    return Object.freeze({
      intakeReceived: received.length,
      intakeStaged: staged.length,
      intakeDiscarded: Math.max(0, received.length - staged.length),
      intakePass: received.length > 0 ? staged.length > 0 : !gateAllowed,
      stagedHits: Object.freeze(staged)
    });
  }

  function solve(stagedHits) {
    const center = getViewportCenter();

    const hits = stagedHits
      .map(h => cloneHit(h, center))
      .sort((a, b) => a.angle - b.angle);

    if (!hits.length) {
      return Object.freeze({
        placementPass: false,
        resolvedHits: Object.freeze([])
      });
    }

    let repositioned = 0;

    for (let pass = 0; pass < MARKER_PASSES; pass++) {
      let moved = false;

      for (let i = 0; i < hits.length; i++) {
        const a = hits[i];
        const b = hits[(i + 1) % hits.length];

        if (hits.length > 2) {
          const delta = normalizeAngle(b.angle - a.angle);
          if (delta <= 0) continue;
        }

        if (applySeparation(a, b, center)) {
          moved = true;
          repositioned += 2;
        }
      }

      if (!moved) break;
    }

    for (const hit of hits) {
      clampToViewport(hit);
    }

    if (countCollisions(hits) > 0) {
      for (const hit of hits) {
        const v = computeVector(hit, center);
        hit.x += v.ux * MARKER_OUTWARD_NUDGE;
        hit.y += v.uy * MARKER_OUTWARD_NUDGE;
        clampToViewport(hit);
      }
    }

    const collisionCount = countCollisions(hits);
    const viewportPass = validateViewport(hits);

    const resolved = hits.map(h => Object.freeze({
      id: h.id,
      label: h.label,
      route: h.route,
      x: h.x,
      y: h.y,
      radius: h.radius
    }));

    return Object.freeze({
      placementPass: collisionCount === 0 && viewportPass,
      markerCollisionCount: collisionCount,
      markerRepositionedCount: repositioned,
      resolvedHits: Object.freeze(resolved)
    });
  }

  function process({ rawHits, gateAllowed }) {
    const intake = stage(rawHits, gateAllowed);
    const placement = solve(intake.stagedHits);

    return Object.freeze({
      intake,
      placement
    });
  }

  return Object.freeze({
    process
  });
}
