(function attachShowroomGlobeInstrument(global) {
  "use strict";

  const VERSION = "SHOWROOM_GLOBE_INSTRUMENT_GENERATION_2_CODE_GLOBE_RESTORATION_TNT_v1";
  const GENERATION = "GENERATION_2";
  const AUTHORITY = "/assets/showroom.globe.instrument.js";

  const DEFAULTS = Object.freeze({
    degreesPerSecond: 5.2,
    cloudDegreesPerSecond: 2.1,
    moonDegreesPerSecond: 0.85,
    homeLabel: "Home Anchor · Fort Worth",
    homeLatitude: 32.7555,
    homeLongitude: -97.3308
  });

  function createElement(tagName, className, text) {
    const node = document.createElement(tagName);
    if (className) node.className = className;
    if (typeof text === "string") node.textContent = text;
    return node;
  }

  function setDataset(node, values) {
    Object.keys(values).forEach(function setKey(key) {
      node.dataset[key] = String(values[key]);
    });
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function safeClone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function makeReceipt(name, value) {
    const item = createElement("li", "showroom-globe-receipt");
    item.innerHTML = "<strong>" + name + "</strong><span>" + String(value) + "</span>";
    return item;
  }

  function makeTag(text) {
    return createElement("span", "showroom-contract-tag", text);
  }

  function normalizeContract(contract) {
    return Object.assign(
      {
        mode: "parent",
        realm: "showroom-parent-proof-realm",
        route: "/showroom/",
        routeRole: "showroom-proof-surface",
        chamber: "ROOM_05_OF_16_H5_SHOWROOM",
        homeLabel: DEFAULTS.homeLabel,
        speedMultiplier: 1
      },
      contract || {}
    );
  }

  function buildLandmass(className) {
    return createElement("span", "showroom-code-landmass " + className);
  }

  function buildCloud(className) {
    return createElement("span", "showroom-code-cloud " + className);
  }

  function buildGlobeDom(contract) {
    const root = createElement("section", "showroom-globe-instrument showroom-gen2-code-globe");
    root.setAttribute("aria-label", "Generation 2 code-generated globe instrument");

    setDataset(root, {
      generation: GENERATION,
      authority: AUTHORITY,
      instrumentType: "code-generated-globe",
      graphicDependency: "false",
      externalImageDependency: "false",
      generatedImageDependency: "false",
      shell: "absent",
      rim: "absent",
      cap: "absent",
      bowl: "absent"
    });

    const stage = createElement("div", "showroom-code-globe-stage");
    stage.setAttribute("aria-label", "Code-generated globe stage");

    const lightField = createElement("div", "showroom-code-light-field");
    const sun = createElement("div", "showroom-code-sun", "☀");
    const moonTrack = createElement("div", "showroom-code-moon-track");
    const moon = createElement("div", "showroom-code-moon", "◐");
    moonTrack.append(moon);
    lightField.append(sun, moonTrack);

    const axisFrame = createElement("div", "showroom-code-axis-frame");
    const axis = createElement("div", "showroom-code-axis");

    const globe = createElement("div", "showroom-code-globe");
    globe.setAttribute("role", "img");
    globe.setAttribute("aria-label", "Visible code-generated globe");

    const surfaceTrack = createElement("div", "showroom-code-surface-track");
    const surfaceA = createElement("div", "showroom-code-surface showroom-code-surface-a");
    const surfaceB = createElement("div", "showroom-code-surface showroom-code-surface-b");

    [
      "land-a",
      "land-b",
      "land-c",
      "land-d",
      "land-e",
      "land-f"
    ].forEach(function addLand(name) {
      surfaceA.append(buildLandmass(name));
      surfaceB.append(buildLandmass(name));
    });

    surfaceTrack.append(surfaceA, surfaceB);

    const cloudLayerA = createElement("div", "showroom-code-cloud-layer showroom-code-cloud-layer-a");
    const cloudLayerB = createElement("div", "showroom-code-cloud-layer showroom-code-cloud-layer-b");

    [
      "cloud-a",
      "cloud-b",
      "cloud-c",
      "cloud-d"
    ].forEach(function addCloud(name) {
      cloudLayerA.append(buildCloud(name));
      cloudLayerB.append(buildCloud(name));
    });

    const highlight = createElement("div", "showroom-code-highlight");
    const terminator = createElement("div", "showroom-code-terminator");
    const atmosphere = createElement("div", "showroom-code-atmosphere");
    const homePin = createElement("div", "showroom-code-home-pin");
    homePin.title = contract.homeLabel || DEFAULTS.homeLabel;

    globe.append(surfaceTrack, cloudLayerA, cloudLayerB, highlight, terminator, atmosphere, homePin);
    axisFrame.append(axis, globe);
    stage.append(lightField, axisFrame);

    const caption = createElement(
      "h2",
      "showroom-globe-caption",
      "GENERATION 2 · CODE-GENERATED GLOBE RESTORED"
    );

    const tags = createElement("div", "showroom-contract-tags");
    [
      "GEN 2",
      "globe=visible",
      "source=code",
      "images=none",
      "shell=absent",
      "rim=absent",
      "cap=absent",
      "stage=stable",
      "parent+inspect=shared",
      "next=gen3-phase-bind"
    ].forEach(function addTag(text) {
      tags.append(makeTag(text));
    });

    const status = createElement("aside", "showroom-globe-status");
    status.append(
      createElement("h3", "", "Generation 2 restoration receipts"),
      createElement(
        "p",
        "",
        "This layer restores the visible globe using code-generated structure only. It does not claim Generation 3 phase binding or Generation 4 closeout."
      )
    );

    const receipts = createElement("ul", "showroom-globe-receipts");
    [
      ["GENERATION", GENERATION],
      ["AUTHORITY", AUTHORITY],
      ["INSTRUMENT_TYPE", "code-generated-globe"],
      ["ROUTE_REALM", contract.realm],
      ["ROUTE_ROLE", contract.routeRole],
      ["GRAPHIC_DEPENDENCY", "false"],
      ["EXTERNAL_IMAGE_DEPENDENCY", "false"],
      ["GENERATED_IMAGE_DEPENDENCY", "false"],
      ["VISIBLE_GLOBE", "true"],
      ["SHELL", "absent"],
      ["RIM", "absent"],
      ["CAP", "absent"],
      ["NEXT_ALLOWED_GENERATION", "GENERATION_3_PHASE_BIND"]
    ].forEach(function addReceipt(pair) {
      receipts.append(makeReceipt(pair[0], pair[1]));
    });

    status.append(receipts);
    root.append(stage, caption, tags, status);

    return {
      root,
      stage,
      globe,
      surfaceTrack,
      cloudLayerA,
      cloudLayerB,
      moonTrack,
      homePin,
      receipts
    };
  }

  function createGlobe(options) {
    const opts = options || {};
    const mount = opts.mount;

    if (!mount || !(mount instanceof Element)) {
      throw new Error("ShowroomGlobeInstrument requires a valid mount element.");
    }

    const contract = normalizeContract(opts.contract);
    const runtime = opts.runtime || null;
    const speedMultiplier = clamp(Number(contract.speedMultiplier || 1), 0.2, 2.5);
    const globeSpeed = DEFAULTS.degreesPerSecond * speedMultiplier;
    const cloudSpeed = DEFAULTS.cloudDegreesPerSecond * speedMultiplier;
    const moonSpeed = DEFAULTS.moonDegreesPerSecond * speedMultiplier;

    mount.innerHTML = "";
    mount.classList.add("showroom-globe-mount", "showroom-code-globe-mount");

    setDataset(mount, {
      generation: GENERATION,
      instrumentLoaded: "true",
      instrumentAuthority: AUTHORITY,
      instrumentType: "code-generated-globe",
      visibleGlobe: "true",
      graphicDependency: "false",
      externalImageDependency: "false"
    });

    const dom = buildGlobeDom(contract);
    mount.append(dom.root);

    let active = true;
    let frame = 0;
    let previous = performance.now();
    let surfaceShift = 0;
    let cloudA = 0;
    let cloudB = 0;
    let moon = contract.mode === "standalone" ? 124 : 34;

    function writeRuntimeReceipt(type, payload) {
      if (runtime && typeof runtime.writeReceipt === "function") {
        runtime.writeReceipt(type, payload || {});
      }
    }

    function tick(now) {
      if (!active) return;

      const delta = Math.max(0, (now - previous) / 1000);
      previous = now;

      surfaceShift = (surfaceShift + globeSpeed * delta) % 100;
      cloudA = (cloudA + cloudSpeed * delta) % 360;
      cloudB = (cloudB - cloudSpeed * 0.72 * delta) % 360;
      moon = (moon + moonSpeed * delta) % 360;

      dom.surfaceTrack.style.transform = "translate3d(-" + surfaceShift.toFixed(3) + "%, 0, 0)";
      dom.cloudLayerA.style.transform = "rotate(" + cloudA.toFixed(3) + "deg)";
      dom.cloudLayerB.style.transform = "rotate(" + cloudB.toFixed(3) + "deg)";
      dom.moonTrack.style.transform = "rotate(" + moon.toFixed(3) + "deg)";

      frame = global.requestAnimationFrame(tick);
    }

    function start() {
      if (active && frame) return;

      active = true;
      previous = performance.now();

      writeRuntimeReceipt("generation_2_code_globe_started", {
        generation: GENERATION,
        authority: AUTHORITY,
        route: contract.route,
        realm: contract.realm,
        visibleGlobe: true,
        externalImageDependency: false
      });

      frame = global.requestAnimationFrame(tick);
    }

    function stop() {
      active = false;
      if (frame) global.cancelAnimationFrame(frame);
      frame = 0;

      writeRuntimeReceipt("generation_2_code_globe_stopped", {
        generation: GENERATION,
        authority: AUTHORITY
      });
    }

    start();

    return {
      version: VERSION,
      generation: GENERATION,
      authority: AUTHORITY,
      contract: safeClone(contract),
      start,
      stop,
      destroy: function destroy() {
        stop();
        mount.innerHTML = "";
        mount.dataset.instrumentLoaded = "false";
      },
      getStatus: function getStatus() {
        return {
          version: VERSION,
          generation: GENERATION,
          authority: AUTHORITY,
          active,
          visibleGlobe: true,
          instrumentType: "code-generated-globe",
          externalImageDependency: false,
          generatedImageDependency: false,
          shell: false,
          rim: false,
          cap: false,
          nextAllowedGeneration: "GENERATION_3_PHASE_BIND"
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
