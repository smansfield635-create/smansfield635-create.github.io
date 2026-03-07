(function () {
  "use strict";

  const LOCAL_FACE_FALLBACK = Object.freeze({
    N: { label: "NORTH", short: "N", route: null },
    E: { label: "EAST", short: "E", route: "/products/" },
    S: { label: "SOUTH", short: "S", route: "/laws/" },
    W: { label: "WEST", short: "W", route: "/gauges/" },
    C: { label: "CORE", short: "CORE", route: null },
    M: { label: "MORPH", short: "MORPH", route: "SCENE_ACTION_ONLY" },
  });

  function normalizeCurrentPath(path) {
    try {
      const p = String(path || "/");
      return p.endsWith("/") ? p : p + "/";
    } catch (_e) {
      return "/";
    }
  }

  function currentRegionContext(args) {
    const router = args && args.router;
    const currentPath = normalizeCurrentPath(args && args.currentPath);
    if (router && typeof router.getRegionContext === "function") {
      return router.getRegionContext(currentPath);
    }
    return null;
  }

  function currentCompassMap(args) {
    const router = args && args.router;
    const regionId = args && args.regionId;
    if (router && typeof router.compassTargetMap === "function") {
      const map = router.compassTargetMap(regionId);
      if (map) return map;
    }
    return null;
  }

  function getFaceMeta(face, args) {
    const fallback = LOCAL_FACE_FALLBACK[face];
    const map = currentCompassMap(args);
    const regions = args && args.regions;
    const regionId = args && args.regionId;
    const currentPath = normalizeCurrentPath(args && args.currentPath);

    if (!map) return fallback || null;

    if (face === "M") {
      return { label: "MORPH", short: "MORPH", route: "SCENE_ACTION_ONLY" };
    }

    const target = map[face] || null;
    if (target && regions && typeof regions.byId === "function") {
      const region = regions.byId(target);
      if (region) {
        const sameRegion = region.id === regionId;
        const sameRoute = normalizeCurrentPath(region.route) === currentPath;
        const route = sameRegion || sameRoute ? null : region.route;

        if (face === "N") return { label: "NORTH", short: "N", route, targetId: region.id };
        if (face === "E") return { label: "EAST", short: "E", route, targetId: region.id };
        if (face === "S") return { label: "SOUTH", short: "S", route, targetId: region.id };
        if (face === "W") return { label: "WEST", short: "W", route, targetId: region.id };
        if (face === "C") return { label: "CORE", short: "CORE", route, targetId: region.id };
      }
    }

    return fallback || null;
  }

  function activateFace(face, args) {
    const meta = getFaceMeta(face, args);
    if (!meta) {
      return { ok: false, status: "unknown-face", face: null };
    }

    if (face === "M") {
      return { ok: true, status: "morph", face: face, route: null, meta: meta };
    }

    if (meta.route === null) {
      return { ok: true, status: "locked", face: face, route: null, meta: meta };
    }

    return { ok: true, status: "route", face: face, route: meta.route, meta: meta };
  }

  window.OPENWORLD_COMPASS_NAVIGATION_AUTHORITY = Object.freeze({
    version: "OPENWORLD_COMPASS_NAVIGATION_AUTHORITY_v1",
    LOCAL_FACE_FALLBACK,
    normalizeCurrentPath,
    currentRegionContext,
    currentCompassMap,
    getFaceMeta,
    activateFace,
  });
})();
