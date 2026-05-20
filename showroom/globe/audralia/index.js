/* TARGET FILE: /showroom/globe/audralia/index.js */
/*
  AUDRALIA_ROUTEFINDER_ORGANIC_CHAIN_HANDOFF_TNT_v1
  Full-file replacement.
  RouteFinder only.
  Purpose:
  - Finds the Audralia route, stage, and canvas mount.
  - Loads the organic asset authority chain in lawful order.
  - Verifies required authorities.
  - Hands off to AUDRALIA_CANVAS.mount(...).
  - Does not render, paint, define landforms, define hydrology, or build textures.
  - Preserves boxed containment, touch scope, Audralia spelling, and existing mount.
  No generated image. No GraphicBox. No visual-pass claim.
*/

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_ROUTEFINDER_ORGANIC_CHAIN_HANDOFF_TNT_v1";
  const RECEIPT = "AUDRALIA_ROUTEFINDER_ORGANIC_CHAIN_HANDOFF_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "AUDRALIA_ORGANIC_LANDFORM_HYDROLOGY_VISUAL_RENEWAL_TNT_v1";
  const ROUTE = "/showroom/globe/audralia/";
  const WORLD = "Audralia";
  const SPELLING = "A_U_D_R_A_L_I_A";

  const REQUIRED_AUTHORITIES = Object.freeze([
    "landmap",
    "topology",
    "elevation",
    "hydrology",
    "landSurface",
    "canvas"
  ]);

  const ASSET_CHAIN = Object.freeze([
    {
      name: "lattice256",
      path: "/assets/audralia/audralia.lattice256.js",
      required: false,
      ready: () => Boolean(window.AUDRALIA_LATTICE256?.coordinatesFromUV)
    },
    {
      name: "topology",
      path: "/assets/audralia/audralia.topology.js",
      required: true,
      ready: () => Boolean(window.AUDRALIA_TOPOLOGY?.sampleTopology || window.AUDRALIA_TOPOLOGY?.sample)
    },
    {
      name: "landmap",
      path: "/assets/audralia/audralia.landmap.js",
      required: true,
      ready: () => Boolean(window.AUDRALIA_LANDMAP?.sampleLandmap || window.AUDRALIA_LANDMAP?.sample)
    },
    {
      name: "elevation",
      path: "/assets/audralia/audralia.elevation.js",
      required: true,
      ready: () => Boolean(window.AUDRALIA_ELEVATION?.sampleElevation || window.AUDRALIA_ELEVATION?.sample)
    },
    {
      name: "hydrology",
      path: "/assets/audralia/audralia.hydrology.js",
      required: true,
      ready: () => Boolean(window.AUDRALIA_HYDROLOGY?.sampleHydrology || window.AUDRALIA_HYDROLOGY?.sample)
    },
    {
      name: "climate",
      path: "/assets/audralia/audralia.climate.render.js",
      required: false,
      ready: () => Boolean(window.AUDRALIA_CLIMATE_RENDER?.sampleClimate || window.AUDRALIA_CLIMATE_RENDER?.sample)
    },
    {
      name: "landSurface",
      path: "/assets/audralia/audralia.land.surface.js",
      required: true,
      ready: () => Boolean(window.AUDRALIA_LAND_SURFACE?.sampleSurface || window.AUDRALIA_LAND_SURFACE?.sample)
    },
    {
      name: "canvas",
      path: "/assets/audralia/audralia.canvas.js",
      required: true,
      ready: () => Boolean(window.AUDRALIA_CANVAS?.mount)
    }
  ]);

  function qs(selector, root = document) {
    return root.querySelector(selector);
  }

  function findMount() {
    return (
      document.getElementById("audraliaCanvasMount") ||
      qs("[data-audralia-canvas-mount='true']") ||
      qs("[data-audralia-globe-mount='true']") ||
      qs("[data-audralia-box-target='true']")
    );
  }

  function findStage(mount) {
    return (
      document.getElementById("audralia-stage") ||
      qs("[data-audralia-stage='true']") ||
      qs("[data-audralia-box-stage='true']") ||
      (mount ? mount.closest(".stage") : null)
    );
  }

  function findNotice() {
    return (
      document.getElementById("audraliaRouteLoaderNotice") ||
      qs("[data-audralia-route-loader-notice='true']")
    );
  }

  function findStatus() {
    return (
      document.getElementById("audraliaRouteStatus") ||
      qs("[data-audralia-route-status='true']")
    );
  }

  function setText(node, value) {
    if (node) node.textContent = value;
  }

  function publishDataset(name, value) {
    document.documentElement.dataset[name] = String(value);
  }

  function publishBaseStatus(phase) {
    publishDataset("audraliaRoutefinderLoaded", "true");
    publishDataset("audraliaRoutefinderContract", CONTRACT);
    publishDataset("audraliaRoutefinderReceipt", RECEIPT);
    publishDataset("audraliaRoutefinderPreviousContract", PREVIOUS_CONTRACT);
    publishDataset("audraliaRoutefinderPhase", phase);
    publishDataset("audraliaRoute", ROUTE);
    publishDataset("audraliaWorld", WORLD);
    publishDataset("audraliaCanonicalSpelling", SPELLING);
    publishDataset("audraliaRoutefinderOnly", "true");
    publishDataset("audraliaIndexOwnsRendering", "false");
    publishDataset("audraliaIndexOwnsLandform", "false");
    publishDataset("audraliaIndexOwnsHydrology", "false");
    publishDataset("audraliaIndexOwnsTexture", "false");
    publishDataset("audraliaTouchScope", "box-only");
    publishDataset("generatedImage", "false");
    publishDataset("graphicBox", "false");
    publishDataset("visualPassClaimed", "false");
  }

  function setStageState(stage, state, contract = CONTRACT) {
    if (!stage) return;

    stage.setAttribute("data-loader-state", state);
    stage.setAttribute("data-audralia-routefinder", contract);
    stage.setAttribute("data-audralia-touch-scope", "box-only");
    stage.setAttribute("data-generated-image", "false");
    stage.setAttribute("data-graphic-box", "false");
    stage.setAttribute("data-visual-pass-claimed", "false");
  }

  function stampMount(mount) {
    if (!mount) return;

    mount.setAttribute("data-audralia-routefinder", CONTRACT);
    mount.setAttribute("data-audralia-world", WORLD);
    mount.setAttribute("data-audralia-canonical-spelling", SPELLING);
    mount.setAttribute("data-audralia-touch-scope", "box-only");
    mount.setAttribute("data-audralia-index-owns-rendering", "false");
    mount.setAttribute("data-audralia-index-owns-landform", "false");
    mount.setAttribute("data-audralia-index-owns-hydrology", "false");
    mount.setAttribute("data-generated-image", "false");
    mount.setAttribute("data-graphic-box", "false");
    mount.setAttribute("data-visual-pass-claimed", "false");
  }

  function loadScriptOnce(asset) {
    if (asset.ready()) {
      return Promise.resolve({
        name: asset.name,
        path: asset.path,
        loaded: true,
        alreadyPresent: true,
        required: asset.required
      });
    }

    const existing = document.querySelector(`script[data-audralia-routefinder-asset="${asset.name}"]`);

    if (existing) {
      return new Promise((resolve) => {
        existing.addEventListener(
          "load",
          () => resolve({
            name: asset.name,
            path: asset.path,
            loaded: asset.ready(),
            alreadyPresent: false,
            required: asset.required
          }),
          { once: true }
        );

        existing.addEventListener(
          "error",
          () => resolve({
            name: asset.name,
            path: asset.path,
            loaded: false,
            alreadyPresent: false,
            required: asset.required
          }),
          { once: true }
        );
      });
    }

    return new Promise((resolve) => {
      const script = document.createElement("script");
      const separator = asset.path.includes("?") ? "&" : "?";

      script.src = `${asset.path}${separator}v=${encodeURIComponent(CONTRACT)}`;
      script.defer = true;
      script.dataset.audraliaRoutefinderAsset = asset.name;
      script.dataset.audraliaRoutefinderContract = CONTRACT;
      script.dataset.generatedImage = "false";
      script.dataset.graphicBox = "false";
      script.dataset.visualPassClaimed = "false";

      script.onload = () => resolve({
        name: asset.name,
        path: asset.path,
        loaded: asset.ready(),
        alreadyPresent: false,
        required: asset.required
      });

      script.onerror = () => resolve({
        name: asset.name,
        path: asset.path,
        loaded: false,
        alreadyPresent: false,
        required: asset.required
      });

      document.head.appendChild(script);
    });
  }

  async function loadChain(notice, status) {
    const results = [];

    for (const asset of ASSET_CHAIN) {
      setText(notice, `Loading ${asset.name}`);
      setText(status, "Audralia authority chain preparing");

      const result = await loadScriptOnce(asset);
      results.push(result);

      publishDataset(`audraliaRoutefinder${asset.name[0].toUpperCase()}${asset.name.slice(1)}Loaded`, result.loaded);
    }

    return results;
  }

  function getMissingRequired(results) {
    return results
      .filter((result) => result.required && !result.loaded)
      .map((result) => result.name);
  }

  function createReceipt(results, mountFound, stageFound, handoffComplete) {
    const prior = document.getElementById("audralia-routefinder-receipt");
    if (prior) prior.remove();

    const receipt = document.createElement("template");
    receipt.id = "audralia-routefinder-receipt";
    receipt.setAttribute("data-route-receipt", "");
    receipt.innerHTML = `
${CONTRACT}
receipt=${RECEIPT}
previous=${PREVIOUS_CONTRACT}
route=${ROUTE}
world=${WORLD}
canonical_spelling=${SPELLING}
target_file=/showroom/globe/audralia/index.js
role=routefinder_only
routefinder_loads_asset_chain=true
routefinder_renders=false
routefinder_paints=false
routefinder_owns_landform=false
routefinder_owns_hydrology=false
routefinder_owns_texture=false
mount_found=${mountFound}
stage_found=${stageFound}
handoff_complete=${handoffComplete}
required_authorities=${REQUIRED_AUTHORITIES.join(",")}
loaded_authorities=${results.filter((item) => item.loaded).map((item) => item.name).join(",")}
missing_required=${getMissingRequired(results).join(",") || "none"}
asset_chain=${ASSET_CHAIN.map((item) => item.name).join(",")}
handoff_target=window.AUDRALIA_CANVAS.mount
touch_scope=box_only
boxed_containment=true
generated_image=false
graphic_box=false
visual_pass_claimed=false
`;
    document.body.appendChild(receipt);
  }

  function buildStatus(results) {
    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      route: ROUTE,
      world: WORLD,
      canonicalSpelling: SPELLING,
      role: "routefinder-only",
      routefinderRenders: false,
      routefinderPaints: false,
      routefinderOwnsLandform: false,
      routefinderOwnsHydrology: false,
      routefinderOwnsTexture: false,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false,
      loaded: Object.freeze(Object.fromEntries(results.map((item) => [item.name, item.loaded]))),
      missingRequired: Object.freeze(getMissingRequired(results))
    });
  }

  async function main() {
    publishBaseStatus("start");

    const mount = findMount();
    const stage = findStage(mount);
    const notice = findNotice();
    const status = findStatus();

    window.DGB_AUDRALIA_ROUTEFINDER_CONTRACT = CONTRACT;
    window.DGB_AUDRALIA_CANONICAL_SPELLING = SPELLING;
    window.DGB_AUDRALIA_TOUCH_SCOPE = "box-only";
    window.DGB_AUDRALIA_GENERATED_IMAGE = false;
    window.DGB_AUDRALIA_GRAPHIC_BOX = false;
    window.DGB_AUDRALIA_VISUAL_PASS_CLAIMED = false;

    if (!mount) {
      publishBaseStatus("mount-missing");
      setStageState(stage, "fallback");
      setText(notice, "Audralia mount missing");
      setText(status, "RouteFinder held");
      createReceipt([], false, Boolean(stage), false);
      return;
    }

    stampMount(mount);
    setStageState(stage, "loading");
    setText(notice, "RouteFinder loading Audralia chain");
    setText(status, "Organic authority chain preparing");

    let results = [];

    try {
      results = await loadChain(notice, status);
    } catch (error) {
      publishBaseStatus("chain-error");
      publishDataset("audraliaRoutefinderError", error instanceof Error ? error.message : String(error));
      setStageState(stage, "fallback");
      setText(notice, "Audralia chain load error");
      setText(status, "RouteFinder held");
      createReceipt(results, true, Boolean(stage), false);
      return;
    }

    const missing = getMissingRequired(results);
    window.AUDRALIA_ROUTEFINDER_RECEIPT = buildStatus(results);

    if (missing.length > 0) {
      publishBaseStatus("required-authority-missing");
      publishDataset("audraliaRoutefinderMissingRequired", missing.join(","));
      setStageState(stage, "fallback");
      setText(notice, "Audralia authority missing");
      setText(status, `Held: ${missing.join(", ")}`);
      createReceipt(results, true, Boolean(stage), false);
      return;
    }

    if (typeof window.__AUDRALIA_CANVAS_DISPOSE__ === "function") {
      try {
        window.__AUDRALIA_CANVAS_DISPOSE__();
      } catch {
        publishDataset("audraliaPriorCanvasDisposeFailed", "true");
      }
    }

    if (!window.AUDRALIA_CANVAS?.mount) {
      publishBaseStatus("canvas-handoff-missing");
      setStageState(stage, "fallback");
      setText(notice, "Canvas handoff missing");
      setText(status, "RouteFinder held");
      createReceipt(results, true, Boolean(stage), false);
      return;
    }

    try {
      setText(notice, "Organic chain loaded");
      setText(status, "Canvas handoff starting");

      const handoff = window.AUDRALIA_CANVAS.mount(mount, {
        route: ROUTE,
        world: WORLD,
        routefinderContract: CONTRACT,
        touchScope: "box-only",
        onStatus(phase, detail) {
          publishDataset("audraliaCanvasPhase", phase);

          if (detail && typeof detail === "object") {
            publishDataset("audraliaCanvasMounted", Boolean(detail.mounted));
            publishDataset("audraliaVisiblePixelsPainted", Boolean(detail.visiblePixelsPainted));
            publishDataset("audraliaAdvancedTextureReady", Boolean(detail.advancedTextureReady));
            publishDataset("audraliaOrganicChainConsumer", Boolean(detail.organicChainConsumer));
          }

          if (phase === "rendering" || phase === "texture-ready") {
            setStageState(stage, "mounted");
            setText(notice, "Organic landform hydrology active");
            setText(status, "Audralia globe contained");
          }
        }
      });

      window.AUDRALIA_ROUTEFINDER_HANDOFF = handoff || null;

      publishBaseStatus("handoff-complete");
      publishDataset("audraliaRoutefinderHandoffComplete", "true");
      setStageState(stage, "mounted");
      setText(notice, "Organic landform hydrology active");
      setText(status, "Audralia globe contained");
      createReceipt(results, true, Boolean(stage), true);
    } catch (error) {
      publishBaseStatus("handoff-error");
      publishDataset("audraliaRoutefinderHandoffError", error instanceof Error ? error.message : String(error));
      setStageState(stage, "fallback");
      setText(notice, "Canvas handoff failed");
      setText(status, "RouteFinder held");
      createReceipt(results, true, Boolean(stage), false);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", main, { once: true });
  } else {
    main();
  }
})();
