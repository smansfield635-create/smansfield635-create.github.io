// /showroom/globe/earth/index.js
const EARTH_ROUTE_STATE = Object.freeze({
  route: "/showroom/globe/earth/",
  body: "Earth",
  authorityPath: "/assets/earth/earth_canvas.js",
  mountId: "earthRenderMount",
  publicReceiptRendering: false,
  mutatesRenderAsset: false,
  visualPassClaimed: false
});

function writeMountMessage(mount, message) {
  mount.innerHTML = "";

  const fallback = document.createElement("div");
  fallback.className = "mount-fallback";
  fallback.textContent = message;
  mount.appendChild(fallback);
}

function getRendererCandidates(renderer) {
  return [
    renderer.renderSurface,
    renderer.renderEarth,
    renderer.mountEarth,
    renderer.renderPlanet,
    renderer.render,
    renderer.default
  ].filter(candidate => typeof candidate === "function");
}

async function tryRenderWithCandidate(renderFn, mount, context) {
  const attempts = [
    () => renderFn(mount, context),
    () => renderFn(context),
    () => renderFn(mount)
  ];

  for (const attempt of attempts) {
    try {
      const result = await attempt();
      if (result !== false) return true;
    } catch (error) {
      console.warn("Earth render attempt held.", error);
    }
  }

  return false;
}

async function bootEarthRoute() {
  document.documentElement.dataset.globeRoute = "earth";
  document.documentElement.dataset.publicReceipts = "hidden";
  document.documentElement.dataset.earthRouteScript = "executed";

  const mount = document.getElementById(EARTH_ROUTE_STATE.mountId);

  if (!mount) {
    console.error("Earth mount not found.", EARTH_ROUTE_STATE.mountId);
    return;
  }

  writeMountMessage(mount, "Earth route script active. Importing Earth authority.");

  try {
    const renderer = await import(
      `${EARTH_ROUTE_STATE.authorityPath}?earth_route_loader=${Date.now()}`
    );

    const candidates = getRendererCandidates(renderer);

    if (!candidates.length) {
      writeMountMessage(
        mount,
        "Earth authority loaded, but no compatible Earth render function was exposed."
      );

      window.ShowroomEarthRoute = {
        ...EARTH_ROUTE_STATE,
        imported: true,
        rendered: false,
        held: true,
        reason: "NO_COMPATIBLE_RENDER_FUNCTION"
      };

      return;
    }

    const context = {
      body: "Earth",
      route: EARTH_ROUTE_STATE.route,
      mount,
      mountId: EARTH_ROUTE_STATE.mountId,
      publicReceiptRendering: false,
      visualPassClaimed: false
    };

    for (const candidate of candidates) {
      const rendered = await tryRenderWithCandidate(candidate, mount, context);

      if (rendered) {
        window.ShowroomEarthRoute = {
          ...EARTH_ROUTE_STATE,
          imported: true,
          rendered: true,
          held: false
        };

        return;
      }
    }

    writeMountMessage(
      mount,
      "Earth authority loaded, but all Earth render attempts were held."
    );

    window.ShowroomEarthRoute = {
      ...EARTH_ROUTE_STATE,
      imported: true,
      rendered: false,
      held: true,
      reason: "ALL_RENDER_ATTEMPTS_HELD"
    };
  } catch (error) {
    console.error("Earth authority import failed.", error);

    writeMountMessage(
      mount,
      "Earth authority import failed. Check /assets/earth/earth_canvas.js."
    );

    window.ShowroomEarthRoute = {
      ...EARTH_ROUTE_STATE,
      imported: false,
      rendered: false,
      held: true,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

bootEarthRoute();
