(function attachShowroomGlobeInstrument(global) {
  "use strict";

  const VERSION = "SHOWROOM_GLOBE_INSTRUMENT_GEN4_HOME_ANCHOR_SPEED_AUTHORITY_TNT_v1";
  const GENERATION = "GENERATION_4";
  const AUTHORITY = "/assets/showroom.globe.instrument.js";

  const DEFAULTS = Object.freeze({
    degreesPerSecond: 4.8,
    homeLatitude: 32.7555,
    homeLongitude: -97.3308,
    homeLabel: "Home Anchor · Fort Worth",
    axisTilt: 23.4,
    moonOrbitDegreesPerSecond: 1.15,
    cloudDriftDegreesPerSecond: 2.4
  });

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function createElement(tagName, className, text) {
    const el = document.createElement(tagName);
    if (className) el.className = className;
    if (typeof text === "string") el.textContent = text;
    return el;
  }

  function setDataset(el, values) {
    Object.keys(values).forEach((key) => {
      el.dataset[key] = String(values[key]);
    });
  }

  function makeReceipt(name, value) {
    const item = createElement("li", "showroom-globe-receipt");
    item.textContent = `${name}=${value}`;
    return item;
  }

  function buildInstrumentDom(contract) {
    const root = createElement("section", "showroom-globe-instrument");
    root.setAttribute("aria-label", "Generation 4 showroom globe instrument");
    setDataset(root, {
      showroomInstrument: "active",
      generation: GENERATION,
      authority: AUTHORITY,
      speedAuthority: "true",
      cssAnimationAuthority: "false",
      runtimeSpeedAuthority: "false",
      homeAnchor: "active",
      motionControl: "instrument",
      internalBoundary: "none"
    });

    const stage = createElement("div", "showroom-orbital-stage");
    stage.setAttribute("aria-hidden", "false");

    const lightField = createElement("div", "showroom-light-field");
    const sun = createElement("div", "showroom-sun", "☀");
    const moonTrack = createElement("div", "showroom-moon-track");
    const moon = createElement("div", "showroom-moon", "◐");

    const earthWrap = createElement("div", "showroom-earth-wrap");
    const earth = createElement("div", "showroom-earth");
    const axis = createElement("div", "showroom-earth-axis");
    const ocean = createElement("div", "showroom-earth-ocean");
    const landA = createElement("div", "showroom-landmass showroom-landmass-a");
    const landB = createElement("div", "showroom-landmass showroom-landmass-b");
    const landC = createElement("div", "showroom-landmass showroom-landmass-c");
    const cloudA = createElement("div", "showroom-cloud showroom-cloud-a");
    const cloudB = createElement("div", "showroom-cloud showroom-cloud-b");
    const terminator = createElement("div", "showroom-terminator");
    const atmosphere = createElement("div", "showroom-atmosphere");
    const homePin = createElement("div", "showroom-home-pin");
    homePin.title = contract.homeLabel;

    earth.append(ocean, landA, landB, landC, cloudA, cloudB, terminator, atmosphere, homePin);
    earthWrap.append(axis, earth);
    moonTrack.append(moon);
    lightField.append(sun, moonTrack);
    stage.append(lightField, earthWrap);

    const status = createElement("aside", "showroom-globe-status");
    const title = createElement("h3", "", "Generation 4 Globe Instrument");
    const body = createElement(
      "p",
      "",
      "Speed, home anchor, internal motion, sun/moon light, shadow, atmosphere, and natural-boundary emission are owned by the instrument."
    );

    const receipts = createElement("ul", "showroom-globe-receipts");
    [
      ["GENERATION", GENERATION],
      ["AUTHORITY", AUTHORITY],
      ["REALM", contract.realm],
      ["ROUTE_ROLE", contract.routeRole],
      ["HOME_ANCHOR", "active"],
      ["INSTRUMENT_SPEED_AUTHORITY", "true"],
      ["CSS_ANIMATION_AUTHORITY", "false"],
      ["RUNTIME_SPEED_AUTHORITY", "false"],
      ["INTERNAL_GLOBE_BOUNDARY", "none"],
      ["OUTER_SECTION_BOUNDARY", "consumer-shell-only"]
    ].forEach(([name, value]) => receipts.append(makeReceipt(name, value)));

    status.append(title, body, receipts);
    root.append(stage, status);

    return {
      root,
      earth,
      earthWrap,
      moonTrack,
      cloudA,
      cloudB,
      homePin,
      status
    };
  }

  function createGlobe(options) {
    const opts = options || {};
    const mount = opts.mount;

    if (!mount || !(mount instanceof Element)) {
      throw new Error("ShowroomGlobeInstrument requires a valid mount element.");
    }

    const contract = Object.assign(
      {
        realm: "showroom-parent-proof-realm",
        routeRole: "showroom-proof-surface",
        homeLabel: DEFAULTS.homeLabel,
        homeLatitude: DEFAULTS.homeLatitude,
        homeLongitude: DEFAULTS.homeLongitude,
        speedMultiplier: 1,
        mode: "parent"
      },
      opts.contract || {}
    );

    const runtime = opts.runtime || null;
    const speedMultiplier = clamp(Number(contract.speedMultiplier || 1), 0.15, 3);
    const degreesPerSecond = DEFAULTS.degreesPerSecond * speedMultiplier;
    const cloudDrift = DEFAULTS.cloudDriftDegreesPerSecond * speedMultiplier;
    const moonSpeed = DEFAULTS.moonOrbitDegreesPerSecond * speedMultiplier;

    mount.innerHTML = "";
    mount.classList.add("showroom-globe-mount");
    setDataset(mount, {
      generation: GENERATION,
      instrumentLoaded: "true",
      instrumentAuthority: AUTHORITY,
      globeBoundary: "instrument-internal-none"
    });

    const dom = buildInstrumentDom(contract);
    mount.append(dom.root);

    let raf = 0;
    let active = true;
    let previous = performance.now();
    let earthRotation = 0;
    let cloudRotation = 0;
    let moonRotation = contract.mode === "standalone" ? 144 : 38;

    function writeTick(now) {
      if (!active) return;

      const deltaSeconds = Math.max(0, (now - previous) / 1000);
      previous = now;

      earthRotation = (earthRotation + degreesPerSecond * deltaSeconds) % 360;
      cloudRotation = (cloudRotation + cloudDrift * deltaSeconds) % 360;
      moonRotation = (moonRotation + moonSpeed * deltaSeconds) % 360;

      dom.earth.style.setProperty("--showroom-earth-rotation", `${earthRotation.toFixed(3)}deg`);
      dom.cloudA.style.setProperty("--showroom-cloud-rotation", `${cloudRotation.toFixed(3)}deg`);
      dom.cloudB.style.setProperty("--showroom-cloud-rotation", `${(cloudRotation * -0.72).toFixed(3)}deg`);
      dom.moonTrack.style.setProperty("--showroom-moon-rotation", `${moonRotation.toFixed(3)}deg`);

      if (runtime && typeof runtime.writeReceipt === "function") {
        runtime.writeReceipt("motion_tick", {
          generation: GENERATION,
          authority: AUTHORITY,
          earthRotation: Number(earthRotation.toFixed(3)),
          moonRotation: Number(moonRotation.toFixed(3)),
          speedAuthority: "instrument",
          timestamp: new Date().toISOString()
        });
      }

      raf = global.requestAnimationFrame(writeTick);
    }

    function start() {
      if (!active) active = true;
      previous = performance.now();
      raf = global.requestAnimationFrame(writeTick);

      if (runtime && typeof runtime.writeReceipt === "function") {
        runtime.writeReceipt("instrument_started", {
          generation: GENERATION,
          authority: AUTHORITY,
          realm: contract.realm,
          routeRole: contract.routeRole,
          homeAnchor: "active"
        });
      }
    }

    function stop() {
      active = false;
      if (raf) global.cancelAnimationFrame(raf);
      raf = 0;
    }

    start();

    return {
      version: VERSION,
      generation: GENERATION,
      authority: AUTHORITY,
      contract,
      start,
      stop,
      destroy() {
        stop();
        mount.innerHTML = "";
        mount.dataset.instrumentLoaded = "false";
      },
      getStatus() {
        return {
          version: VERSION,
          generation: GENERATION,
          authority: AUTHORITY,
          active,
          earthRotation,
          moonRotation,
          homeAnchor: "active",
          speedAuthority: "instrument",
          cssAnimationAuthority: false,
          runtimeSpeedAuthority: false
        };
      }
    };
  }

  global.ShowroomGlobeInstrument = Object.freeze({
    VERSION,
    GENERATION,
    AUTHORITY,
    DEFAULTS,
    createGlobe
  });
})(window);
