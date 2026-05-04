// /showroom/globe/audralia/index.js
const AUDRALIA_ROUTE_STATE = Object.freeze({
  protocol: "TIC_TAC_TOE_DYNAMIC_PROTOCOL_v2",
  route: "/showroom/globe/audralia/",
  body: "Audralia",
  authorityPath: "/assets/audralia/audralia.planet.render.js",
  mountId: "audraliaRenderMount",
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

function removePublicReceipts(mount) {
  mount
    .querySelectorAll(".audralia-parent-consumption-receipt")
    .forEach(node => node.remove());
}

function getAudraliaApi() {
  return (
    window.DGBAudraliaPlanetRender ||
    window.AudraliaPlanetRender ||
    window.audraliaPlanetRender ||
    window.DGBAudreliaPlanetRender ||
    window.AudreliaPlanetRender ||
    window.audreliaPlanetRender ||
    null
  );
}

async function bootAudraliaRoute() {
  document.documentElement.dataset.ticTacToeDynamicProtocol = "v2";
  document.documentElement.dataset.globeRoute = "audralia";
  document.documentElement.dataset.publicReceipts = "hidden";
  document.documentElement.dataset.audraliaRouteScript = "executed";
  document.documentElement.dataset.audraliaPairProof = "html-js-paired";

  const mount = document.getElementById(AUDRALIA_ROUTE_STATE.mountId);

  if (!mount) {
    console.error("Audralia mount not found.", AUDRALIA_ROUTE_STATE.mountId);
    return;
  }

  writeMountMessage(mount, "Audralia route script active. Importing Audralia parent authority.");

  try {
    await import(`${AUDRALIA_ROUTE_STATE.authorityPath}?audralia_surface_adapter=${Date.now()}`);

    const api = getAudraliaApi();

    if (!api || typeof api.renderSurface !== "function") {
      writeMountMessage(
        mount,
        "Audralia authority loaded, but renderSurface was not available."
      );

      window.ShowroomAudraliaRoute = {
        ...AUDRALIA_ROUTE_STATE,
        imported: true,
        rendered: false,
        held: true,
        reason: "AUDRALIA_RENDER_SURFACE_API_MISSING"
      };

      return;
    }

    mount.innerHTML = "";
    mount.dataset.body = "Audralia";
    mount.dataset.route = AUDRALIA_ROUTE_STATE.route;
    mount.dataset.protocol = "TIC_TAC_TOE_DYNAMIC_PROTOCOL_v2";
    mount.dataset.publicReceiptRendering = "false";
    mount.dataset.visualPassClaimed = "false";
    mount.dataset.pairProof = "js-asset-mounted";

    const renderedNode = api.renderSurface(mount, {
      width: 1024,
      height: 512,
      maxWidth: "720px",
      receipt: false,
      publicReceiptRendering: false,
      visualPassClaimed: false
    });

    removePublicReceipts(mount);

    const rendered = Boolean(renderedNode || mount.querySelector("canvas"));

    if (!rendered) {
      writeMountMessage(
        mount,
        "Audralia authority loaded, but the parent render did not produce a canvas."
      );

      window.ShowroomAudraliaRoute = {
        ...AUDRALIA_ROUTE_STATE,
        imported: true,
        rendered: false,
        held: true,
        reason: "AUDRALIA_CANVAS_NOT_CREATED"
      };

      return;
    }

    window.ShowroomAudraliaRoute = {
      ...AUDRALIA_ROUTE_STATE,
      imported: true,
      rendered: true,
      held: false,
      api: "window.DGBAudraliaPlanetRender.renderSurface"
    };
  } catch (error) {
    console.error("Audralia authority import failed.", error);

    writeMountMessage(
      mount,
      "Audralia authority import failed. Check /assets/audralia/audralia.planet.render.js."
    );

    window.ShowroomAudraliaRoute = {
      ...AUDRALIA_ROUTE_STATE,
      imported: false,
      rendered: false,
      held: true,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

bootAudraliaRoute();
