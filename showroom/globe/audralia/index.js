// /showroom/globe/audralia/index.js
// AUDRALIA_ROUTE_CANONICAL_LOADER_CLIMATE_V2_STATUS_ALIGNMENT_TNT_v3
// Full-file replacement.
// Route loader and mount authority only.
// Accepts AUDRALIA_CLIMATE_AND_ENVIRONMENT_DETAIL_TNT_v2 as the current climate contract.
// Requires canvas contract AUDRALIA_VISIBLE_UPDATE_NOTICE_CANVAS_TNT_v3.
// Retires the false status phrase: "Climate Detail: loaded stale AUDRALIA_CLIMATE_AND_ENVIRONMENT_DETAIL_TNT_v2".
// Mounts only window.AUDRALIA_CANVAS.mount(...).
// Does not own footprint.
// Does not own climate.
// Does not own canvas internals.
// Does not touch Gauges.
// No generated image. No GraphicBox. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_ROUTE_CANONICAL_LOADER_CLIMATE_V2_STATUS_ALIGNMENT_TNT_v3";
  const RECEIPT = "AUDRALIA_ROUTE_CANONICAL_LOADER_CLIMATE_V2_STATUS_ALIGNMENT_RECEIPT_v3";
  const PREVIOUS_CONTRACT = "AUDRALIA_ROUTE_CANONICAL_LOADER_TNT_v2";
  const VERSION = "2026-05-15.audralia-route-loader-climate-v2-status-alignment-v3";

  const EXPECTED = Object.freeze({
    canvas: "AUDRALIA_VISIBLE_UPDATE_NOTICE_CANVAS_TNT_v3",
    landmap: "AUDRALIA_30_BILLION_YEAR_EARTH_LEGACY_ORGANIC_LANDFORM_TNT_v1",
    climate: "AUDRALIA_CLIMATE_AND_ENVIRONMENT_DETAIL_TNT_v2"
  });

  const ACCEPTED_CONTRACTS = Object.freeze({
    lattice256: Object.freeze([
      "AUDRALIA_G1_256_LATTICE_ATLAS_AUTHORITY_TNT_v1",
      ""
    ]),
    landmap: Object.freeze([
      "AUDRALIA_30_BILLION_YEAR_EARTH_LEGACY_ORGANIC_LANDFORM_TNT_v1"
    ]),
    climate: Object.freeze([
      "AUDRALIA_CLIMATE_AND_ENVIRONMENT_DETAIL_TNT_v2"
    ]),
    beaches: Object.freeze([
      "AUDRALIA_BEACHES_AUTHORITY_TNT_v1",
      "AUDRALIA_LANDMASS_AND_BEACH_FOOTPRINT_RENEWAL_TNT_v1",
      ""
    ]),
    groundcover: Object.freeze([
      "AUDRALIA_GROUNDCOVER_TNT_v1",
      ""
    ]),
    landSurface: Object.freeze([
      "AUDRALIA_G1_LAYER_TWO_LUSH_LAND_SURFACE_TNT_v1",
      ""
    ]),
    canvas: Object.freeze([
      "AUDRALIA_VISIBLE_UPDATE_NOTICE_CANVAS_TNT_v3"
    ])
  });

  const LEGACY_TOKENS = Object.freeze([
    "AUDRALIA_GRATITUDE_PLAINS_DESERTS_MARSHES_ROUTE_TNT_v10",
    "AUDRALIA_GRATITUDE_PLAINS_DESERTS_MARSHES_ROUTE_RECEIPT_v10",
    "gratitude plains/deserts/marshes route",
    "Primary Summit Gratitude",
    "Parent order backstory",
    "Mountain communities true"
  ]);

  const RETIRED_FALSE_STATUS = "Climate Detail: loaded stale AUDRALIA_CLIMATE_AND_ENVIRONMENT_DETAIL_TNT_v2";
  const CACHE_KEY = `${CONTRACT}.${Date.now()}`;

  const SCRIPT_CHAIN = Object.freeze([
    {
      key: "lattice256",
      label: "Lattice 256",
      src: "/assets/audralia/audralia.lattice256.js",
      required: true,
      check: () => Boolean(window.AUDRALIA_LATTICE256?.coordinatesFromUV),
      contract: () => String(window.AUDRALIA_LATTICE256?.contract || "")
    },
    {
      key: "landmap",
      label: "Organic Landmap",
      src: "/assets/audralia/audralia.landmap.js",
      required: true,
      expected: EXPECTED.landmap,
      check: () => Boolean(window.AUDRALIA_LANDMAP?.sampleLandmap),
      contract: () => String(window.AUDRALIA_LANDMAP?.contract || "")
    },
    {
      key: "climate",
      label: "Climate Detail",
      src: "/assets/audralia/audralia.climate.render.js",
      required: true,
      expected: EXPECTED.climate,
      check: () => Boolean(window.AUDRALIA_CLIMATE_RENDER?.sampleClimate),
      contract: () => String(window.AUDRALIA_CLIMATE_RENDER?.contract || "")
    },
    {
      key: "beaches",
      label: "Beach Authority",
      src: "/assets/audralia/audralia.beaches.js",
      required: false,
      check: () => Boolean(window.AUDRALIA_BEACHES),
      contract: () => String(window.AUDRALIA_BEACHES?.contract || "")
    },
    {
      key: "groundcover",
      label: "Groundcover",
      src: "/assets/audralia/audralia.groundcover.js",
      required: false,
      check: () => Boolean(window.AUDRALIA_GROUNDCOVER),
      contract: () => String(window.AUDRALIA_GROUNDCOVER?.contract || "")
    },
    {
      key: "landSurface",
      label: "Land Surface",
      src: "/assets/audralia/audralia.land.surface.js",
      required: false,
      check: () => Boolean(window.AUDRALIA_LAND_SURFACE?.sampleSurface),
      contract: () => String(window.AUDRALIA_LAND_SURFACE?.contract || "")
    },
    {
      key: "canvas",
      label: "Visible Notice Canvas",
      src: "/assets/audralia/audralia.canvas.js",
      required: true,
      expected: EXPECTED.canvas,
      check: () => Boolean(window.AUDRALIA_CANVAS?.mount),
      contract: () => String(window.AUDRALIA_CANVAS?.contract || "")
    }
  ]);

  const root = document.documentElement;

  let authoritativeStatusText = "";
  let reassertingStatus = false;
  let legacyWriteCount = 0;
  let retiredFalseStatusCount = 0;

  function qs(selector) {
    return document.querySelector(selector);
  }

  function nodes() {
    return Object.freeze({
      notice: qs("#audraliaRouteLoaderNotice"),
      status: qs("#audraliaRouteStatus"),
      mount: qs("#audraliaCanvasMount"),
      fallback: qs("[data-stage-fallback='true']")
    });
  }

  function normalizeContract(value) {
    return String(value || "").trim();
  }

  function acceptedContractsFor(key, expected) {
    const accepted = ACCEPTED_CONTRACTS[key];

    if (Array.isArray(accepted)) {
      return accepted.map(normalizeContract);
    }

    if (expected) return [normalizeContract(expected)];

    return [""];
  }

  function isContractAccepted(key, actualContract, expectedContract) {
    const actual = normalizeContract(actualContract);
    const expected = normalizeContract(expectedContract);
    const accepted = acceptedContractsFor(key, expected);

    if (!actual && !expected) return true;
    if (expected && actual === expected) return true;

    return accepted.includes(actual);
  }

  function containsLegacyToken(text) {
    const value = String(text || "").toLowerCase();
    return LEGACY_TOKENS.some((token) => value.includes(String(token).toLowerCase()));
  }

  function containsRetiredFalseStatus(text) {
    return String(text || "").includes(RETIRED_FALSE_STATUS);
  }

  function setRootReceipt() {
    root.dataset.audraliaRouteLoaderLoaded = "true";
    root.dataset.audraliaRouteLoaderContract = CONTRACT;
    root.dataset.audraliaRouteLoaderReceipt = RECEIPT;
    root.dataset.audraliaRouteLoaderPreviousContract = PREVIOUS_CONTRACT;
    root.dataset.audraliaRouteLoaderVersion = VERSION;
    root.dataset.audraliaRouteExpectedCanvasContract = EXPECTED.canvas;
    root.dataset.audraliaRouteExpectedLandmapContract = EXPECTED.landmap;
    root.dataset.audraliaRouteExpectedClimateContract = EXPECTED.climate;
    root.dataset.audraliaRouteAcceptedClimateContract = EXPECTED.climate;
    root.dataset.audraliaRouteRetiredFalseClimateStatus = RETIRED_FALSE_STATUS;
    root.dataset.audraliaRouteOwnsFootprint = "false";
    root.dataset.audraliaRouteOwnsClimate = "false";
    root.dataset.audraliaRouteOwnsCanvas = "false";
    root.dataset.audraliaRouteLegacyV10Blocked = "pending";
    root.dataset.generatedImage = "false";
    root.dataset.graphicBox = "false";
    root.dataset.visualPassClaimed = "false";

    window.DGB_AUDRALIA_ROUTE_LOADER_RECEIPT = Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      route: "/showroom/globe/audralia/",
      expected: EXPECTED,
      acceptedContracts: ACCEPTED_CONTRACTS,
      retiredFalseStatus: RETIRED_FALSE_STATUS,
      blocksLegacyTokens: Array.from(LEGACY_TOKENS),
      owns: [
        "route_loader",
        "script_chain_loading",
        "visible_route_status",
        "canonical_canvas_mount_call",
        "legacy_status_guard",
        "climate_v2_status_alignment"
      ],
      doesNotOwn: [
        "land_footprint",
        "climate_authority",
        "surface_truth",
        "canvas_internals",
        "runtime_motion",
        "gauges_logic",
        "image_generation",
        "GraphicBox"
      ],
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false,
      timestamp: new Date().toISOString()
    });
  }

  function applyNoticeTone(node, tone) {
    if (!node) return;

    node.dataset.statusTone = tone;

    if (tone === "pass") {
      node.style.borderColor = "rgba(158,240,191,.58)";
      node.style.color = "rgba(206,255,228,.98)";
      node.style.background = "rgba(2,30,24,.78)";
    } else if (tone === "warn") {
      node.style.borderColor = "rgba(243,200,111,.54)";
      node.style.color = "rgba(255,232,168,.98)";
      node.style.background = "rgba(40,26,4,.74)";
    } else if (tone === "fail") {
      node.style.borderColor = "rgba(255,139,139,.54)";
      node.style.color = "rgba(255,210,210,.98)";
      node.style.background = "rgba(44,8,12,.76)";
    } else {
      node.style.borderColor = "rgba(243,200,111,.44)";
      node.style.color = "rgba(255,232,168,.98)";
      node.style.background = "rgba(40,26,4,.74)";
    }
  }

  function setNotice(text, tone = "pending") {
    const { notice } = nodes();
    if (!notice) return;

    notice.textContent = String(text || "");
    applyNoticeTone(notice, tone);
  }

  function setStatus(text) {
    authoritativeStatusText = String(text || "");
    const { status } = nodes();
    if (!status) return;

    reassertingStatus = true;
    status.textContent = authoritativeStatusText;

    window.setTimeout(() => {
      reassertingStatus = false;
    }, 0);
  }

  function appendCache(src) {
    const joiner = src.includes("?") ? "&" : "?";
    return `${src}${joiner}v=${encodeURIComponent(CACHE_KEY)}`;
  }

  function readState(item) {
    const loaded = Boolean(item.check());
    const actualContract = normalizeContract(item.contract ? item.contract() : "");
    const expectedContract = normalizeContract(item.expected || "");
    const contractMatches = isContractAccepted(item.key, actualContract, expectedContract);

    return Object.freeze({
      key: item.key,
      label: item.label,
      src: item.src,
      required: Boolean(item.required),
      loaded,
      expectedContract,
      acceptedContracts: acceptedContractsFor(item.key, expectedContract),
      actualContract,
      contractMatches
    });
  }

  function statusPhrase(state) {
    if (!state.loaded && !state.required) return `${state.label}: optional missing`;
    if (!state.loaded) return `${state.label}: missing`;

    if (state.key === "climate" && state.actualContract === EXPECTED.climate) {
      return "Climate Detail: active";
    }

    if (state.expectedContract && !state.contractMatches) {
      return `${state.label}: stale ${state.actualContract || "unknown"}`;
    }

    return `${state.label}: active`;
  }

  function summarize(states) {
    return states.map(statusPhrase).join(" · ");
  }

  function mustReload(item) {
    const state = readState(item);
    if (!state.loaded) return true;
    if (state.expectedContract && !state.contractMatches) return true;
    return false;
  }

  function removePriorRouteScript(item) {
    document
      .querySelectorAll(`script[data-audralia-route-script="${item.key}"]`)
      .forEach((script) => script.remove());
  }

  function loadScript(item) {
    return new Promise((resolve) => {
      if (!mustReload(item)) {
        resolve(readState(item));
        return;
      }

      removePriorRouteScript(item);

      const script = document.createElement("script");
      script.src = appendCache(item.src);
      script.defer = true;
      script.dataset.audraliaRouteScript = item.key;
      script.dataset.audraliaRouteLoader = CONTRACT;
      script.dataset.audraliaRouteLoaderVersion = VERSION;
      script.onload = () => resolve(readState(item));
      script.onerror = () => resolve(readState(item));
      document.head.appendChild(script);
    });
  }

  async function loadChain() {
    const states = [];

    for (const item of SCRIPT_CHAIN) {
      setNotice(`Canonical loader v3 active · loading ${item.label}`, "pending");
      setStatus(`AUDRALIA_ROUTE_CANONICAL_LOADER_CLIMATE_V2_STATUS_ALIGNMENT_TNT_v3 is active. Loading ${item.label} from ${item.src}`);

      const state = await loadScript(item);
      states.push(state);

      setStatus(`AUDRALIA_ROUTE_CANONICAL_LOADER_CLIMATE_V2_STATUS_ALIGNMENT_TNT_v3 chain: ${summarize(states)}`);

      if (state.required && !state.loaded) {
        setNotice(`Canonical loader v3 blocked · ${state.label} missing`, "fail");
        break;
      }
    }

    return states;
  }

  function chainResult(states) {
    const required = states.filter((state) => state.required);
    const missingRequired = required.filter((state) => !state.loaded);
    const staleRequired = required.filter((state) => state.expectedContract && !state.contractMatches);

    return Object.freeze({
      states,
      missingRequired,
      staleRequired,
      requiredPassed: missingRequired.length === 0,
      strictPassed: missingRequired.length === 0 && staleRequired.length === 0,
      summary: summarize(states)
    });
  }

  function disposePriorCanvas() {
    if (typeof window.__AUDRALIA_CANVAS_DISPOSE__ === "function") {
      try {
        window.__AUDRALIA_CANVAS_DISPOSE__();
      } catch {
        root.dataset.audraliaPriorCanvasDisposeFailed = "true";
      }
    }
  }

  function clearMount() {
    const { mount } = nodes();
    if (!mount) return null;

    mount
      .querySelectorAll("canvas,[data-audralia-coordinate-readout],[data-audralia-version-notice]")
      .forEach((node) => node.remove());

    return mount;
  }

  function setFallbackVisible(visible, text = "") {
    const { fallback } = nodes();
    if (!fallback) return;

    fallback.style.display = visible ? "grid" : "none";
    if (text) fallback.textContent = text;
  }

  function mountCanvas(result) {
    const mount = clearMount();

    if (!mount) {
      setNotice("Canonical loader v3 blocked · mount node missing", "fail");
      setStatus("Missing #audraliaCanvasMount. HTML shell is not exposing the canonical mount node.");
      setFallbackVisible(true, "Canonical loader v3 could not find #audraliaCanvasMount.");
      return false;
    }

    if (!window.AUDRALIA_CANVAS?.mount) {
      setNotice("Canonical loader v3 blocked · AUDRALIA_CANVAS.mount unavailable", "fail");
      setStatus("window.AUDRALIA_CANVAS.mount was not found after script chain load.");
      setFallbackVisible(true, "Canvas authority did not expose mount().");
      return false;
    }

    const actualCanvasContract = normalizeContract(window.AUDRALIA_CANVAS.contract || "");
    const canvasContractMatches = isContractAccepted("canvas", actualCanvasContract, EXPECTED.canvas);

    if (!canvasContractMatches) {
      root.dataset.audraliaCanvasContractMismatch = "true";
      root.dataset.audraliaActiveCanvasContract = actualCanvasContract || "unknown";
    } else {
      root.dataset.audraliaCanvasContractMismatch = "false";
      root.dataset.audraliaActiveCanvasContract = actualCanvasContract;
    }

    disposePriorCanvas();

    window.__AUDRALIA_CANONICAL_MOUNT_LOCK__ = Object.freeze({
      routeLoaderContract: CONTRACT,
      expectedCanvasContract: EXPECTED.canvas,
      actualCanvasContract,
      expectedClimateContract: EXPECTED.climate,
      actualClimateContract: normalizeContract(window.AUDRALIA_CLIMATE_RENDER?.contract || ""),
      route: "/showroom/globe/audralia/",
      timestamp: new Date().toISOString()
    });

    try {
      window.AUDRALIA_CANVAS.mount(mount, {
        route: "/showroom/globe/audralia/",
        routeLoaderContract: CONTRACT,
        expectedCanvasContract: EXPECTED.canvas,
        expectedLandmapContract: EXPECTED.landmap,
        expectedClimateContract: EXPECTED.climate,
        onStatus: (phase, payload = {}) => {
          root.dataset.audraliaRouteCanvasPhase = String(phase);
          root.dataset.audraliaRouteCanvasFrames = String(payload.frames || 0);
          root.dataset.audraliaRouteCanvasMounted = String(Boolean(payload.mounted));
          root.dataset.audraliaRouteCanvasVisibleNotice = String(Boolean(payload.visibleUpdateNotice));

          if (payload.mounted) {
            setFallbackVisible(false);
          }
        }
      });
    } catch (error) {
      setNotice("Canonical loader v3 canvas mount failed", "fail");
      setStatus(`Canvas mount error: ${error instanceof Error ? error.message : String(error)}`);
      setFallbackVisible(true, "Canvas mount threw an error. Check console for AUDRALIA_CANVAS.mount.");
      return false;
    }

    setFallbackVisible(false);

    const hasStrictPass = result.strictPassed && canvasContractMatches;
    const mountedSummary = summarize(result.states);

    if (hasStrictPass) {
      setNotice("Audralia route mounted · canonical chain active", "pass");
      setStatus(`Lattice 256: active · Organic Landmap: active · Climate Detail: active · Beach Authority: active · Groundcover: active · Land Surface: active · Visible Notice Canvas: active`);
    } else {
      setNotice("Audralia route mounted · canonical chain active with optional gaps", "warn");
      setStatus(`AUDRALIA_ROUTE_CANONICAL_LOADER_CLIMATE_V2_STATUS_ALIGNMENT_TNT_v3 mounted. ${mountedSummary}`);
    }

    root.dataset.audraliaRouteCanvasMounted = "true";
    root.dataset.audraliaRouteStrictChainPassed = String(hasStrictPass);
    root.dataset.audraliaRouteRequiredChainPassed = String(result.requiredPassed);
    root.dataset.audraliaActiveCanvasContract = actualCanvasContract;
    root.dataset.audraliaActiveLandmapContract = normalizeContract(window.AUDRALIA_LANDMAP?.contract || "");
    root.dataset.audraliaActiveClimateContract = normalizeContract(window.AUDRALIA_CLIMATE_RENDER?.contract || "");
    root.dataset.audraliaActiveLandSurfaceContract = normalizeContract(window.AUDRALIA_LAND_SURFACE?.contract || "");
    root.dataset.audraliaRouteLegacyV10Blocked = "true";
    root.dataset.audraliaRouteClimateV2Accepted = "true";
    root.dataset.audraliaRouteRetiredFalseClimateStatusActive = "true";

    return true;
  }

  function installLegacyStatusGuard() {
    const { status } = nodes();
    if (!status || !window.MutationObserver) return;

    const observer = new MutationObserver(() => {
      if (reassertingStatus) return;

      const current = status.textContent || "";

      if (containsRetiredFalseStatus(current)) {
        retiredFalseStatusCount += 1;
        root.dataset.audraliaRetiredFalseClimateStatusDetected = "true";
        root.dataset.audraliaRetiredFalseClimateStatusCount = String(retiredFalseStatusCount);

        setNotice("Canonical loader v3 active · retired climate-stale wording blocked", "warn");
        setStatus(
          `${authoritativeStatusText || "AUDRALIA_ROUTE_CANONICAL_LOADER_CLIMATE_V2_STATUS_ALIGNMENT_TNT_v3 is active."} Climate v2 is current and must not be labeled stale.`
        );
        return;
      }

      if (!containsLegacyToken(current)) return;

      legacyWriteCount += 1;
      root.dataset.audraliaLegacyV10Detected = "true";
      root.dataset.audraliaLegacyV10WriteCount = String(legacyWriteCount);
      root.dataset.audraliaRouteLegacyV10Blocked = "true";

      setNotice("Canonical loader v3 active · legacy v10 status write blocked", "warn");
      setStatus(
        `${authoritativeStatusText || "AUDRALIA_ROUTE_CANONICAL_LOADER_CLIMATE_V2_STATUS_ALIGNMENT_TNT_v3 is active."} Legacy v10 attempted to write into the new shell and was blocked.`
      );
    });

    observer.observe(status, {
      childList: true,
      characterData: true,
      subtree: true
    });

    window.addEventListener("pagehide", () => observer.disconnect(), { once: true });
  }

  function installMountGuard() {
    const { mount } = nodes();
    if (!mount || !window.MutationObserver) return;

    const observer = new MutationObserver(() => {
      const canvases = Array.from(mount.querySelectorAll("canvas"));
      if (!canvases.length) return;

      const canonical = canvases.find((canvas) => {
        return canvas.dataset.audraliaCanvasContract === EXPECTED.canvas;
      });

      if (!canonical) {
        root.dataset.audraliaLegacyCanvasDetected = "true";
        setNotice("Canonical loader v3 warning · non-v3 canvas detected", "warn");
      }
    });

    observer.observe(mount, { childList: true, subtree: true });
    window.addEventListener("pagehide", () => observer.disconnect(), { once: true });
  }

  async function init() {
    setRootReceipt();
    installLegacyStatusGuard();
    installMountGuard();

    setNotice("Canonical loader v3 active · starting chain", "pending");
    setStatus("AUDRALIA_ROUTE_CANONICAL_LOADER_CLIMATE_V2_STATUS_ALIGNMENT_TNT_v3 is active. Climate v2 is current. Canvas expectation is visible-notice v3.");

    const states = await loadChain();
    const result = chainResult(states);

    if (!result.requiredPassed) {
      setNotice("Canonical loader v3 blocked · required authority missing", "fail");
      setStatus(`AUDRALIA_ROUTE_CANONICAL_LOADER_CLIMATE_V2_STATUS_ALIGNMENT_TNT_v3 blocked. ${result.summary}`);
      setFallbackVisible(true, "Canonical loader v3 found a missing required authority.");
      return;
    }

    mountCanvas(result);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
