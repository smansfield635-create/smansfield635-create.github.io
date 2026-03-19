export function createMarkerEngine(config = {}) {
  const MARKER_PADDING =
    Number.isFinite(config.markerPadding) ? config.markerPadding : 18;
  const MARKER_PASSES =
    Number.isFinite(config.markerPasses) ? config.markerPasses : 3;
  const MARKER_OUTWARD_NUDGE =
    Number.isFinite(config.markerOutwardNudge) ? config.markerOutwardNudge : 8;
  const DEFAULT_RADIUS =
    Number.isFinite(config.defaultRadius) ? config.defaultRadius : 42;
  const VIEWPORT_MARGIN =
    Number.isFinite(config.viewportMargin) ? config.viewportMargin : 4;

  function isFiniteNumber(value) {
    return typeof value === "number" && Number.isFinite(value);
  }

  function normalizeAngle(value) {
    const twoPi = Math.PI * 2;
    let angle = value;

    while (angle <= -Math.PI) angle += twoPi;
    while (angle > Math.PI) angle -= twoPi;

    return angle;
  }

  function getViewportCenter(viewport) {
    const width = isFiniteNumber(viewport?.width) ? viewport.width : 0;
    const height = isFiniteNumber(viewport?.height) ? viewport.height : 0;

    return Object.freeze({
      x: width * 0.5,
      y: height * 0.5
    });
  }

  function cloneHit(hit, center) {
    const radius = isFiniteNumber(hit?.radius) ? hit.radius : DEFAULT_RADIUS;
    const x = isFiniteNumber(hit?.x) ? hit.x : center.x;
    const y = isFiniteNumber(hit?.y) ? hit.y : center.y;
    const dx = x - center.x;
    const dy = y - center.y;

    return {
      id: typeof hit?.id === "string" ? hit.id : "",
      label: typeof hit?.label === "string" ? hit.label : "",
      route: typeof hit?.route === "string" ? hit.route : "",
      x,
      y,
      radius,
      angle: Math.atan2(dy, dx),
      radialDistance: Math.sqrt((dx * dx) + (dy * dy))
    };
  }

  function computeMarkerVector(hit, center) {
    const dx = hit.x - center.x;
    const dy = hit.y - center.y;
    const length = Math.sqrt((dx * dx) + (dy * dy));

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

  function applyOutwardSeparation(a, b, center) {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const distance = Math.sqrt((dx * dx) + (dy * dy));
    const minDistance = a.radius + b.radius + MARKER_PADDING;

    if (distance >= minDistance) {
      return false;
    }

    const overlap = minDistance - Math.max(distance, 0.0001);
    const va = computeMarkerVector(a, center);
    const vb = computeMarkerVector(b, center);

    a.x -= va.ux * (overlap * 0.5);
    a.y -= va.uy * (overlap * 0.5);
    b.x += vb.ux * (overlap * 0.5);
    b.y += vb.uy * (overlap * 0.5);

    return true;
  }

  function minimalViewportClamp(hit, viewport) {
    const width = isFiniteNumber(viewport?.width) ? viewport.width : 0;
    const height = isFiniteNumber(viewport?.height) ? viewport.height : 0;
    const margin = hit.radius + VIEWPORT_MARGIN;

    hit.x = Math.max(margin, Math.min(width - margin, hit.x));
    hit.y = Math.max(margin, Math.min(height - margin, hit.y));
  }

  function countCollisions(hits) {
    let count = 0;

    for (let i = 0; i < hits.length; i += 1) {
      for (let j = i + 1; j < hits.length; j += 1) {
        const a = hits[i];
        const b = hits[j];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const minDistance = a.radius + b.radius + MARKER_PADDING;

        if ((dx * dx) + (dy * dy) < minDistance * minDistance) {
          count += 1;
        }
      }
    }

    return count;
  }

  function validateMarkersInViewport(hits, viewport) {
    const width = isFiniteNumber(viewport?.width) ? viewport.width : 0;
    const height = isFiniteNumber(viewport?.height) ? viewport.height : 0;

    for (const hit of hits) {
      if (hit.x - hit.radius < 0) return false;
      if (hit.x + hit.radius > width) return false;
      if (hit.y - hit.radius < 0) return false;
      if (hit.y + hit.radius > height) return false;
    }

    return true;
  }

  function solvePlacement(rawHits = [], options = {}) {
    const required = options.required === true;
    const viewport = Object.freeze({
      width: isFiniteNumber(options?.viewport?.width) ? options.viewport.width : 0,
      height: isFiniteNumber(options?.viewport?.height) ? options.viewport.height : 0
    });

    if (!required) {
      return Object.freeze({
        resolvedHits: Object.freeze([]),
        markerRequired: false,
        markerPlacementAdmissible: true,
        markerCollisionCount: 0,
        markerRepositionedCount: 0
      });
    }

    const center = getViewportCenter(viewport);

    const frontHits = Array.isArray(rawHits)
      ? rawHits
          .filter((hit) => isFiniteNumber(hit?.x) && isFiniteNumber(hit?.y))
          .map((hit) => cloneHit(hit, center))
          .sort((a, b) => a.angle - b.angle)
      : [];

    if (!frontHits.length) {
      return Object.freeze({
        resolvedHits: Object.freeze([]),
        markerRequired: true,
        markerPlacementAdmissible: false,
        markerCollisionCount: 0,
        markerRepositionedCount: 0
      });
    }

    let repositionedCount = 0;

    for (let pass = 0; pass < MARKER_PASSES; pass += 1) {
      let moved = false;

      for (let i = 0; i < frontHits.length; i += 1) {
        const a = frontHits[i];
        const b = frontHits[(i + 1) % frontHits.length];

        if (frontHits.length > 2) {
          const delta = normalizeAngle(b.angle - a.angle);
          if (delta <= 0) continue;
        }

        const changed = applyOutwardSeparation(a, b, center);

        if (changed) {
          moved = true;
          repositionedCount += 2;
        }
      }

      if (!moved) break;
    }

    for (const hit of frontHits) {
      minimalViewportClamp(hit, viewport);
    }

    const stillColliding = countCollisions(frontHits);

    if (stillColliding > 0) {
      for (const hit of frontHits) {
        const vector = computeMarkerVector(hit, center);
        hit.x += vector.ux * MARKER_OUTWARD_NUDGE;
        hit.y += vector.uy * MARKER_OUTWARD_NUDGE;
        minimalViewportClamp(hit, viewport);
      }
    }

    const finalCollisionCount = countCollisions(frontHits);
    const inViewport = validateMarkersInViewport(frontHits, viewport);

    return Object.freeze({
      resolvedHits: Object.freeze(
        frontHits.map((hit) =>
          Object.freeze({
            id: hit.id,
            label: hit.label,
            route: hit.route,
            x: hit.x,
            y: hit.y,
            radius: hit.radius
          })
        )
      ),
      markerRequired: true,
      markerPlacementAdmissible: finalCollisionCount === 0 && inViewport,
      markerCollisionCount: finalCollisionCount,
      markerRepositionedCount: repositionedCount
    });
  }

  return Object.freeze({
    solvePlacement
  });
}

const DEFAULT_MARKER_ENGINE = createMarkerEngine();

export function solveMarkerPlacement(rawHits = [], options = {}) {
  return DEFAULT_MARKER_ENGINE.solvePlacement(rawHits, options);
}
