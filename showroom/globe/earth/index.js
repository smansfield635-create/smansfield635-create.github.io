// /showroom/globe/earth/index.js
const EARTH_ROUTE_STATE = Object.freeze({
  protocol: "TIC_TAC_TOE_DYNAMIC_PROTOCOL_v2",
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

function createEarthCanvas() {
  const canvas = document.createElement("canvas");

  canvas.className = "earth-reference-canvas earth-route-owned-canvas";
  canvas.width = 1024;
  canvas.height = 1024;

  canvas.setAttribute("role", "img");
  canvas.setAttribute("aria-label", "Earth reference globe render");

  canvas.dataset.body = "Earth";
  canvas.dataset.route = EARTH_ROUTE_STATE.route;
  canvas.dataset.protocol = "TIC_TAC_TOE_DYNAMIC_PROTOCOL_v2";
  canvas.dataset.publicReceiptRendering = "false";
  canvas.dataset.visualPassClaimed = "false";

  canvas.style.display = "block";
  canvas.style.width = "min(100%, 720px)";
  canvas.style.maxWidth = "720px";
  canvas.style.aspectRatio = "1 / 1";
  canvas.style.borderRadius = "999px";

  return canvas;
}

function getEarthRenderFunction(moduleNamespace) {
  const candidates = [
    moduleNamespace.renderSurface,
    moduleNamespace.render,
    moduleNamespace.renderPlanet,
    moduleNamespace.default && moduleNamespace.default.renderSurface,
    moduleNamespace.default && moduleNamespace.default.render,
    moduleNamespace.default && moduleNamespace.default.renderPlanet
  ];

  return candidates.find(candidate => typeof candidate === "function") || null;
}

async function bootEarthRoute() {
  document.documentElement.dataset.ticTacToeDynamicProtocol = "v2";
  document.documentElement.dataset.globeRoute = "earth";
  document.documentElement.dataset.publicReceipts = "hidden";
  document.documentElement.dataset.earthRouteScript = "executed";
  document.documentElement.dataset.earthPairProof = "html-js-paired";

  const mount = document.getElementById(EARTH_ROUTE_STATE.mountId);

  if (!mount) {
    console.error("Earth mount not found.", EARTH_ROUTE_STATE.mountId);
    return;
  }

  writeMountMessage(mount, "Earth route script active. Importing Earth authority.");

  try {
    const moduleNamespace = await import(
      `${EARTH_ROUTE_STATE.authorityPath}?earth_surface_adapter=${Date.now()}`
    );

    const renderSurface = getEarthRenderFunction(moduleNamespace);

    if (!renderSurface) {
      writeMountMessage(
        mount,
        "Earth authority loaded, but no compatible Earth surface renderer was exposed."
      );

      window.ShowroomEarthRoute = {
        ...EARTH_ROUTE_STATE,
        imported: true,
        rendered: false,
        held: true,
        reason: "EARTH_RENDER_SURFACE_EXPORT_MISSING"
      };

      return;
    }

    mount.innerHTML = "";
    mount.dataset.body = "Earth";
    mount.dataset.route = EARTH_ROUTE_STATE.route;
    mount.dataset.protocol = "TIC_TAC_TOE_DYNAMIC_PROTOCOL_v2";
    mount.dataset.publicReceiptRendering = "false";
    mount.dataset.visualPassClaimed = "false";
    mount.dataset.pairProof = "js-asset-mounted";

    const canvas = createEarthCanvas();
    mount.appendChild(canvas);

    const result = renderSurface(canvas, {
      route: EARTH_ROUTE_STATE.route,
      body: "Earth",
      mount,
      mountId: EARTH_ROUTE_STATE.mountId,
      publicReceiptRendering: false,
      visualPassClaimed: false
    });

    const rendered = Boolean(result && result.rendered !== false);

    if (!rendered) {
      writeMountMessage(
        mount,
        "Earth authority loaded, but Earth surface render returned held."
      );

      window.ShowroomEarthRoute = {
        ...EARTH_ROUTE_STATE,
        imported: true,
        rendered: false,
        held: true,
        reason: "EARTH_RENDER_RETURNED_HELD"
      };

      return;
    }

    window.ShowroomEarthRoute = {
      ...EARTH_ROUTE_STATE,
      imported: true,
      rendered: true,
      held: false,
      api: "module.renderSurface(canvas, options)",
      result
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
