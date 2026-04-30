(function attachShowroomGlobeInstrument(global) {
  "use strict";

  const VERSION = "SHOWROOM_GLOBE_INSTRUMENT_GEN4_NATURAL_SPHERE_CTG_TNT_v1";
  const GENERATION = "GENERATION_4";
  const AUTHORITY = "/assets/showroom.globe.instrument.js";

  const DEFAULTS = Object.freeze({
    degreesPerSecond: 4.8,
    cloudDriftDegreesPerSecond: 2.1,
    moonOrbitDegreesPerSecond: 1.08,
    axisTilt: 23.5,
    homeLatitude: 32.7555,
    homeLongitude: -97.3308,
    homeLabel: "Home Anchor · Fort Worth"
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

  function writeDataset(el, values) {
    Object.keys(values).forEach((key) => {
      el.dataset[key] = String(values[key]);
    });
  }

  function makeTag(text) {
    const tag = createElement("span", "showroom-contract-tag", text);
    return tag;
  }

  function makeReceipt(name, value) {
    const item = createElement("li", "showroom-globe-receipt");
    item.textContent = `${name}=${value}`;
    return item;
  }

  function resolveTexture(options, contract) {
    return (
      options.earthTexture ||
      contract.earthTexture ||
      global.SHOWROOM_EARTH_TEXTURE ||
      document.documentElement.dataset.showroomEarthTexture ||
      ""
    );
  }

  function buildInstrumentDom(contract, textureUrl) {
    const root = createElement("section", "showroom-globe-instrument");
    root.setAttribute("aria-label", "Generation 4 natural Earth sphere instrument");

    writeDataset(root, {
      showroomInstrument: "active",
      generation: GENERATION,
      authority: AUTHORITY,
      boundary: "organic",
      sphere: "natural",
      shell: "absent",
      rim: "absent",
      cap: "absent",
      glow: "absent",
      motion: "internal",
      homeAnchor: "active"
    });

    const stage = createElement("div", "showroom-orbital-stage");
    stage.setAttribute("aria-label", "Natural Earth boundary field");

    const lightField = createElement("div", "showroom-light-field");
    const sun = createElement("div", "showroom-sun", "☀");
    const moonTrack = createElement("div", "showroom-moon-track");
    const moon = createElement("div", "showroom-moon", "◐");
    moonTrack.append(moon);
    lightField.append(sun, moonTrack);

    const sphereFrame = createElement("div", "showroom-natural-sphere-frame");
    const axis = createElement("div", "showroom-earth-axis");

    const sphere = createElement("div", "showroom-earth-sphere");
    sphere.setAttribute("role", "img");
    sphere.setAttribute("aria-label", "Natural spherical Earth with organic boundary");

    writeDataset(sphere, {
      naturalBoundary: "true",
      shellRemoved: "true",
      rimRemoved: "true",
      capRemoved: "true",
      facetedBodyRemoved: "true"
    });

    const mapA = createElement("div", "showroom-earth-map showroom-earth-map-a");
    const mapB = createElement("div", "showroom-earth-map showroom-earth-map-b");
    const cloudA = createElement("div", "showroom-cloud-layer showroom-cloud-layer-a");
    const cloudB = createElement("div", "showroom-cloud-layer showroom-cloud-layer-b");
    const terminator = createElement("div", "showroom-earth-terminator");
    const atmosphere = createElement("div", "showroom-earth-atmosphere");
    const homePin = createElement("div", "showroom-home-pin");
    homePin.title = contract.homeLabel || DEFAULTS.homeLabel;

    if (textureUrl) {
      mapA.style.backgroundImage = `url("${textureUrl}")`;
      mapB.style.backgroundImage = `url("${textureUrl}")`;
      mapA.dataset.texture = "provided";
      mapB.dataset.texture = "provided";
    } else {
      mapA.dataset.texture = "procedural";
      mapB.dataset.texture = "procedural";
    }

    sphere.append(mapA, mapB, cloudA, cloudB, terminator, atmosphere, homePin);
    sphereFrame.append(axis, sphere);
    stage.append(lightField, sphereFrame);

    const caption = createElement(
      "h2",
      "showroom-globe-caption",
      "GENERATION 4 · SHOWROOM PROOF REALM · NATURAL SPHERE"
    );

    const tags = createElement("div", "showroom-contract-tags");
    [
      "GEN 4",
      "boundary=organic",
      "sphere=natural",
      "shell=absent",
      "rim=absent",
      "cap=absent",
      "glow=absent",
      "home=anchored",
      "idle=locked",
      "motion=internal",
      "spin=release",
      "axis=23.5°",
      `context=${contract.mode || "parent"}`
    ].forEach((text) => tags.append(makeTag(text)));

    const actions = createElement("div", "showroom-globe-actions");
    if (contract.mode !== "standalone") {
      const demoLink = createElement("a", "showroom-button", "Open Demo Universe Earth");
      demoLink.href = "/showroom/globe/";
      actions.append(demoLink);
    } else {
      const parentLink = createElement("a", "showroom-button", "Return to Showroom");
      parentLink.href = "/showroom/";
      actions.append(parentLink);
    }

    const status = createElement("aside", "showroom-globe-status");
    const statusTitle = createElement("h3", "", "Natural-boundary receipts");
    const statusBody = createElement(
      "p",
      "",
      "The Earth object is emitted as one circular sphere. No lower shell, faceted body, rim, cap, or bowl geometry is emitted by this instrument."
    );

    const receipts = createElement("ul", "showroom-globe-receipts");
    [
      ["GENERATION", GENERATION],
      ["AUTHORITY", AUTHORITY],
      ["REALM", contract.realm],
      ["ROUTE_ROLE", contract.routeRole],
      ["NATURAL_SPHERE", "true"],
      ["LOWER_SHELL", "absent"],
      ["FACETED_BODY", "absent"],
      ["RIM", "absent"],
      ["CAP", "absent"],
      ["INTERNAL_GLOBE_BOUNDARY", "organic-circle"],
      ["OUTER_SECTION_BOUNDARY", "consumer-shell-only"]
    ].forEach(([name, value]) => receipts.append(makeReceipt(name, value)));

    status.append(statusTitle, statusBody, receipts);
    root.append(stage, caption, tags, actions, status);

    return {
      root,
      sphere,
      mapA,
      mapB,
      cloudA,
      cloudB,
      moonTrack,
      homePin
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

    const textureUrl = resolveTexture(opts, contract);
    const runtime = opts.runtime || null;
    const speedMultiplier = clamp(Number(contract.speedMultiplier || 1), 0.15, 3);
    const degreesPerSecond = DEFAULTS.degreesPerSecond * speedMultiplier;
    const cloudSpeed = DEFAULTS.cloudDriftDegreesPerSecond * speedMultiplier;
    const moonSpeed = DEFAULTS.moonOrbitDegreesPerSecond * speedMultiplier;

    mount.innerHTML = "";
    mount.classList.add("showroom-globe-mount");

    writeDataset(mount, {
      generation: GENERATION,
      instrumentLoaded: "true",
      instrumentAuthority: AUTHORITY,
      naturalBoundary: "true",
      shellRemoved: "true",
      rimRemoved: "true",
      capRemoved: "true",
      globeBoundary: "organic-sphere"
    });

    const dom = buildInstrumentDom(contract, textureUrl);
    mount.append(dom.root);

    let raf = 0;
    let active = true;
    let previous = performance.now();
    let mapShift = 0;
    let cloudRotationA = 0;
    let cloudRotationB = 0;
    let moonRotation = contract.mode === "standalone" ? 144 : 38;

    function writeTick(now) {
      if (!active) return;

      const deltaSeconds = Math.max(0, (now - previous) / 1000);
      previous = now;

      mapShift = (mapShift + degreesPerSecond * deltaSeconds) % 100;
      cloudRotationA = (cloudRotationA + cloudSpeed * deltaSeconds) % 360;
      cloudRotationB = (cloudRotationB - cloudSpeed * 0.72 * deltaSeconds) % 360;
      moonRotation = (moonRotation + moonSpeed * deltaSeconds) % 360;

      dom.mapA.style.transform = `translate3d(${-mapShift}%, 0, 0)`;
      dom.mapB.style.transform = `translate3d(${100 - mapShift}%, 0, 0)`;
      dom.cloudA.style.transform = `rotate(${cloudRotationA.toFixed(3)}deg)`;
      dom.cloudB.style.transform = `rotate(${cloudRotationB.toFixed(3)}deg)`;
      dom.moonTrack.style.transform = `rotate(${moonRotation.toFixed(3)}deg)`;

      if (runtime && typeof runtime.writeReceipt === "function") {
        runtime.writeReceipt("natural_sphere_motion_tick", {
          generation: GENERATION,
          authority: AUTHORITY,
          mapShift: Number(mapShift.toFixed(3)),
          moonRotation: Number(moonRotation.toFixed(3)),
          naturalBoundary: true,
          shellRemoved: true,
          rimRemoved: true,
          capRemoved: true,
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
        runtime.writeReceipt("natural_sphere_instrument_started", {
          generation: GENERATION,
          authority: AUTHORITY,
          realm: contract.realm,
          routeRole: contract.routeRole,
          naturalBoundary: true,
          emittedShellGeometry: false,
          emittedRimGeometry: false,
          emittedCapGeometry: false
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
          mapShift,
          moonRotation,
          naturalBoundary: true,
          lowerShell: false,
          rim: false,
          cap: false,
          facetedBody: false,
          speedAuthority: "instrument"
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
