/* /products/archcoin/index.interactions.js
   ARCHCOIN accepted interaction and center-world assembly.
   Performance round 2: semantic-first setup with viewport-gated idle realization.
   Compass-derived starfield is requested independently after primary scene readiness.
*/
(() => {
  "use strict";

  const MOTION_SOURCE_URL = "./index.motion.source.js?v=ARCHCOIN_RETURN_SWIPE_RESISTANCE_v1";
  const PLANET_URL = "./index.planet.js";
  const STARFIELD_URL = "./index.starfield.js";
  const MOTION_READY_EVENT = "ARCHCOIN_ACCEPTED_MOTION_READY";
  const MOTION_SCRIPT_ATTRIBUTE = "data-archcoin-accepted-motion-source";
  const PLANET_SCRIPT_ATTRIBUTE = "data-archcoin-planet-wrapper";
  const STARFIELD_SCRIPT_ATTRIBUTE = "data-archcoin-starfield-wrapper";
  const runtime = globalThis.DGB_ARCHCOIN_RUNTIME ||
    (globalThis.DGB_ARCHCOIN_RUNTIME = {});

  function installAccessibleNames() {
    const labels = Object.freeze({
      contract: "Open Contract financial domain",
      receivable: "Open Receivable financial domain",
      payable: "Open Payable financial domain",
      allocation: "Open Allocation financial domain"
    });

    for (const control of document.querySelectorAll("button[data-archcoin-coin]")) {
      const coinId = String(control.dataset.coinId || "").trim();
      const label = labels[coinId];
      if (!label) continue;
      control.setAttribute("aria-label", label);
      if (!control.hasAttribute("aria-expanded")) {
        control.setAttribute("aria-expanded", "false");
      }
    }

    const centerControl = document.querySelector("[data-upstream-compass-control]");
    centerControl?.setAttribute("aria-label", "Open Main Compass return options");

    const root = document.querySelector("[data-archcoin-root]");
    if (root) root.dataset.archcoinAccessibleNamesInstalled = "true";
  }

  function runIdle(task, timeout = 900) {
    return new Promise((resolve, reject) => {
      const run = () => Promise.resolve().then(task).then(resolve, reject);
      if (typeof requestIdleCallback === "function") {
        requestIdleCallback(run, { timeout });
      } else {
        setTimeout(run, 0);
      }
    });
  }

  function loadScript(url, marker) {
    return new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[${marker}]`);
      if (existing) {
        if (existing.dataset.ready === "true") resolve(existing);
        else {
          existing.addEventListener("load", () => resolve(existing), { once: true });
          existing.addEventListener("error", reject, { once: true });
        }
        return;
      }

      const script = document.createElement("script");
      script.src = url;
      script.async = false;
      script.fetchPriority = "low";
      script.setAttribute(marker, "true");
      script.addEventListener("load", () => {
        script.dataset.ready = "true";
        resolve(script);
      }, { once: true });
      script.addEventListener("error", () => {
        reject(new Error(`ARCHCOIN_SCRIPT_LOAD_FAILED:${url}`));
      }, { once: true });
      document.head.append(script);
    });
  }

  async function fetchSource(url) {
    const response = await fetch(url, {
      credentials: "same-origin",
      cache: "force-cache",
      priority: "low"
    });
    if (!response.ok) {
      throw new Error(`ARCHCOIN_MOTION_SOURCE_LOAD_FAILED:${response.status}`);
    }
    return response.text();
  }

  function executeSource(source) {
    return new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[${MOTION_SCRIPT_ATTRIBUTE}]`);
      if (existing) {
        if (existing.dataset.ready === "true") resolve(existing);
        else {
          existing.addEventListener("load", () => resolve(existing), { once: true });
          existing.addEventListener("error", reject, { once: true });
        }
        return;
      }

      const blob = new Blob([
        source,
        "\n//# sourceURL=/products/archcoin/index.motion.accepted.js"
      ], { type: "text/javascript" });
      const blobUrl = URL.createObjectURL(blob);
      const script = document.createElement("script");
      script.src = blobUrl;
      script.async = false;
      script.setAttribute(MOTION_SCRIPT_ATTRIBUTE, "true");
      script.addEventListener("load", () => {
        script.dataset.ready = "true";
        URL.revokeObjectURL(blobUrl);
        resolve(script);
      }, { once: true });
      script.addEventListener("error", event => {
        URL.revokeObjectURL(blobUrl);
        reject(event);
      }, { once: true });
      document.head.append(script);
    });
  }

  function replaceRequired(source, before, after, identity) {
    const count = source.split(before).length - 1;
    if (count !== 1) {
      throw new Error(
        `ARCHCOIN_REQUIRED_MOTION_PATTERN_INVALID:${identity}:${count}`
      );
    }
    return source.replace(before, after);
  }

  function publish(detail = {}) {
    const receipt = Object.freeze({
      module: "DGB_ARCHCOIN_ACCEPTED_PRODUCTION",
      acceptedMirrorInstalled: true,
      productionIdentity: true,
      loadingMode: "semantic-first-viewport-gated",
      synchronousXhrUsed: false,
      evalUsed: false,
      activationReason: runtime.sceneActivationReason || "unknown",
      ...detail
    });
    globalThis.DGB_ARCHCOIN_ACCEPTED_PRODUCTION = receipt;
    globalThis.dispatchEvent(new CustomEvent(
      "ARCHCOIN_ACCEPTED_PRODUCTION_READY",
      { detail: receipt }
    ));
    return receipt;
  }

  function requestStarfield() {
    if (runtime.starfieldReady) return runtime.starfieldReady;

    runtime.starfieldReady = runIdle(
      () => loadScript(STARFIELD_URL, STARFIELD_SCRIPT_ATTRIBUTE),
      1200
    ).catch(error => {
      const message = error instanceof Error ? error.message : String(error);
      const root = document.querySelector("[data-archcoin-root]");
      if (root) {
        root.dataset.archcoinStarfieldStatus = "held";
        root.dataset.archcoinStarfieldFailure = message;
      }
      globalThis.dispatchEvent(new CustomEvent("ARCHCOIN_STARFIELD_WRAPPER_FAILURE", {
        detail: Object.freeze({ message })
      }));
      return null;
    });

    return runtime.starfieldReady;
  }

  async function mountCenterWorld() {
    const control = document.querySelector("[data-upstream-compass-control]");
    if (!control) throw new Error("ARCHCOIN_CENTER_CONTROL_NOT_FOUND");

    control.setAttribute("aria-label", "Open Main Compass return options");
    const fallback = control.querySelector("[data-upstream-compass-fallback]");
    if (fallback) fallback.hidden = true;

    let mount = control.querySelector("[data-archcoin-center-world]");
    if (!mount) {
      mount = document.createElement("span");
      mount.className = "archcoin-round4-globe";
      mount.dataset.archcoinCenterWorld = "true";
      mount.setAttribute("aria-hidden", "true");
      control.append(mount);
    }

    const host = globalThis.DGB_ARCHCOIN_CENTER_WORLD;
    if (!host || typeof host.mount !== "function") {
      throw new Error("ARCHCOIN_CENTER_WORLD_HOST_UNAVAILABLE");
    }

    await host.mount(mount);
    publish({
      installed: true,
      centerWorldMounted: true,
      accessibleNamesInstalled: true,
      environmentalSuspension: true,
      starfieldRequested: true
    });
  }

  async function evaluateAcceptedMotion() {
    let source = await fetchSource(MOTION_SOURCE_URL);

    source = replaceRequired(
      source,
      "    flickMinimumDistancePx: 52,",
      "    flickMinimumHorizontalDistancePx: 88,\n" +
        "    flickMaximumVerticalDistancePx: 64,",
      "cluster-return-horizontal-distance"
    );
    source = replaceRequired(
      source,
      "    flickMinimumAverageVelocityPxPerMs: 0.55,",
      "    flickMinimumHorizontalAverageVelocityPxPerMs: 0.55,",
      "cluster-return-horizontal-average-velocity"
    );
    source = replaceRequired(
      source,
      "    flickMinimumReleaseVelocityPxPerMs: 0.72,",
      "    flickMinimumHorizontalReleaseVelocityPxPerMs: 0.72,",
      "cluster-return-horizontal-release-velocity"
    );
    source = replaceRequired(
      source,
      "    flickMinimumDirectionalRatio: 1.28,",
      "    flickMinimumHorizontalDominanceRatio: 1.75,",
      "cluster-return-horizontal-dominance"
    );
    source = replaceRequired(
      source,
      "      const directionalRatio =\n" +
        "        Math.max(absoluteX, absoluteY) / Math.max(1, Math.min(absoluteX, absoluteY));",
      "      const horizontalDominanceRatio = absoluteX / Math.max(1, absoluteY);\n" +
        "      const horizontalAverageVelocity = absoluteX / durationMs;\n" +
        "      const horizontalReleaseVelocity =\n" +
        "        Math.abs(endX - releaseStart.x) / releaseDuration;",
      "cluster-return-horizontal-metrics"
    );
    source = replaceRequired(
      source,
      "        directionalRatio,\n        pauseBeforeRelease",
      "        horizontalDistance: absoluteX,\n" +
        "        verticalDistance: absoluteY,\n" +
        "        horizontalAverageVelocity,\n" +
        "        horizontalReleaseVelocity,\n" +
        "        horizontalDominanceRatio,\n" +
        "        pauseBeforeRelease",
      "cluster-return-horizontal-metric-output"
    );
    source = replaceRequired(
      source,
      "        metrics.distance >= GESTURE.flickMinimumDistancePx &&\n" +
        "        metrics.averageVelocity >= GESTURE.flickMinimumAverageVelocityPxPerMs &&\n" +
        "        metrics.releaseVelocity >= GESTURE.flickMinimumReleaseVelocityPxPerMs &&\n" +
        "        metrics.directionalRatio >= GESTURE.flickMinimumDirectionalRatio &&",
      "        metrics.horizontalDistance >= GESTURE.flickMinimumHorizontalDistancePx &&\n" +
        "        metrics.verticalDistance <= GESTURE.flickMaximumVerticalDistancePx &&\n" +
        "        metrics.horizontalAverageVelocity >=\n" +
        "          GESTURE.flickMinimumHorizontalAverageVelocityPxPerMs &&\n" +
        "        metrics.horizontalReleaseVelocity >=\n" +
        "          GESTURE.flickMinimumHorizontalReleaseVelocityPxPerMs &&\n" +
        "        metrics.horizontalDominanceRatio >=\n" +
        "          GESTURE.flickMinimumHorizontalDominanceRatio &&",
      "cluster-return-horizontal-classifier"
    );

    source = source
      .replaceAll("/* /prototypes/universal-compass/archcoin.interactions.round3.js", "/* /products/archcoin/index.motion.source.js")
      .replaceAll("ARCHCOIN calibration lab · Round 3.", "ARCHCOIN accepted production motion.")
      .replaceAll("Production ARCHCOIN files are not modified.", "Accepted ARCHCOIN production motion.")
      .replaceAll("ARCHCOIN_CALIBRATION_ROUND3_v1", "ARCHCOIN_PRODUCTION_ACCEPTED_MOTION_v1")
      .replaceAll("ARCHCOIN_CALIBRATION_ROUND3_READY", MOTION_READY_EVENT)
      .replaceAll("ARCHCOIN_CALIBRATION_ROUND3_", "ARCHCOIN_PRODUCTION_ACCEPTED_MOTION_")
      .replaceAll("DGB_ARCHCOIN_CALIBRATION_INTERACTIONS", "DGB_ARCHCOIN_ACCEPTED_INTERACTIONS")
      .replaceAll("./archcoin.index.interactions.source.js", "./index.interactions.source.js")
      .replaceAll("installCalibrationInteractions", "installAcceptedInteractions")
      .replaceAll("calibrationApi", "acceptedApi")
      .replaceAll("5.0.0-calibration-round3-main-cluster-motion", "5.1.0-accepted-deliberate-horizontal-return")
      .replaceAll("round3-disposed", "accepted-motion-disposed")
      .replaceAll("archcoinCalibration", "archcoinProduction")
      .replaceAll("is-calibration-", "is-archcoin-");

    await executeSource(source);
  }

  async function install() {
    installAccessibleNames();

    if (runtime.crystalsReady) {
      await runtime.crystalsReady;
    }

    let mounted = false;
    const mountOnce = () => {
      if (mounted) return;
      mounted = true;
      runIdle(() => loadScript(PLANET_URL, PLANET_SCRIPT_ATTRIBUTE), 1200)
        .then(() => runtime.planetReady || globalThis.DGB_ARCHCOIN_CENTER_WORLD)
        .then(() => runIdle(mountCenterWorld, 900))
        .catch(error => publish({
          installed: false,
          accessibleNamesInstalled: true,
          starfieldRequested: true,
          error: error instanceof Error ? error.message : String(error)
        }));
    };

    globalThis.addEventListener(MOTION_READY_EVENT, mountOnce, { once: true });
    await runIdle(evaluateAcceptedMotion, 900);

    if (globalThis.DGB_ARCHCOIN_ACCEPTED_INTERACTIONS) {
      mountOnce();
    }

    requestStarfield();
    return globalThis.DGB_ARCHCOIN_ACCEPTED_INTERACTIONS;
  }

  installAccessibleNames();

  if (!runtime.interactionsReady) {
    runtime.interactionsReady = install().catch(error => {
      publish({
        installed: false,
        accessibleNamesInstalled: true,
        starfieldRequested: false,
        error: error instanceof Error ? error.message : String(error)
      });
      throw error;
    });
  }
})();
