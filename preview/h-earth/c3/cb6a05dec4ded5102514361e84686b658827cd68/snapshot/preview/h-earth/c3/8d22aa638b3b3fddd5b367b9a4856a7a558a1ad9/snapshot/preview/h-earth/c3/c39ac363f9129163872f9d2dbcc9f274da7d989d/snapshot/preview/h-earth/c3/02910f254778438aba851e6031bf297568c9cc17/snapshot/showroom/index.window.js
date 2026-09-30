/* TARGET FILE: /showroom/index.window.js */
/* COMPLETE REPLACEMENT */
/* SHOWROOM_WINDOW_OBJECT_v1_3_FOREGROUND_LENS_APERTURE_FOCUS_OPTIMIZED_BASE */

/*
  Mirrorland Window Object Host

  Purpose:
  - Preserve the existing v1_3 public Window object contract for /showroom/index.window.controller.js.
  - Own the Window object's mount, canvas, geometry, projection, rendering execution,
    lifecycle, open/close transition behavior, dormant-open behavior, and public API.
  - Consume an optional external Window definition when present.
  - Keep only a minimal emergency fallback definition so the object remains functional
    if /showroom/index.window.definition.js is absent.
  - Render the Window as luminous backlit glass, not opaque painted stone.
  - Add definition-driven whole-object atmospheric halo support.
  - Add stronger definition-driven age, patina, scratch, and glass-wear hooks.
  - Leave final material doctrine, pane optics, glass density, aperture color doctrine,
    frame/came doctrine, halo doctrine, and surface age doctrine to the definition file.
  - Remain pointer-transparent.
  - Never own button behavior, Diamond behavior, route state, orbit gestures,
    Compass, stars, CSS layout, or broad page state.

  Renewal standard:
  - Public contract remains v1_3.
  - Controller-facing API remains compatible.
  - Receipt surface remains compatible.
  - Definition consumption is internal and optional.
  - Missing definition must not make the Window unavailable.
  - Host renderer honors luminous glass fields such as saturation, glow,
    edgeLight, jewelDepth, paneGlowMultiplier, leadContrast, and frame accent values.
  - Host renderer now honors whole-object halo fields such as outerGlowAlpha,
    outerGlowBlur, outerGlowSpread, outerGlowWarmth, outerGlowCold, and
    outerGlowMultiplier when supplied by the external definition.
*/

(() => {
  "use strict";

  const CONTRACT = Object.freeze({
    id:
      "SHOWROOM_WINDOW_OBJECT_v1_3_FOREGROUND_LENS_APERTURE_FOCUS_OPTIMIZED_BASE",

    previousId:
      "SHOWROOM_WINDOW_OBJECT_v1_2_CRISP_3D_COMPOUND_CURTAIN_HOST",

    internalArchitecture:
      "compatible-v1_3-luminous-definition-consuming-window-host-with-halo",

    internalArchitectureVersion:
      "1.6-luminous-aged-glass-host-with-definition-driven-outer-halo",

    file:
      "/showroom/index.window.js",

    publicSurface:
      "SHOWROOM_MIRRORLAND_WINDOW_OBJECT",

    receiptSurface:
      "SHOWROOM_MIRRORLAND_WINDOW_OBJECT_RECEIPT",

    definitionSurface:
      "SHOWROOM_MIRRORLAND_WINDOW_DEFINITION",

    definitionReceiptSurface:
      "SHOWROOM_MIRRORLAND_WINDOW_DEFINITION_RECEIPT",

    role:
      "visual-object-host-only",

    rendererModel:
      "canvas-2d-luminous-aged-backlit-glass-foreground-lens-aperture-focus-definition-consuming-compatible-host",

    motionModel:
      "motionless-object-transition-only",

    foregroundLensModel:
      true,

    apertureFocusModel:
      true,

    luminousGlassModel:
      true,

    backlitPaneModel:
      true,

    atmosphericHaloModel:
      true,

    agedGlassModel:
      true,

    definitionReady:
      true,

    definitionExternalized:
      true,

    definitionConsumerReady:
      true,

    fallbackDefinitionPresent:
      true,

    defaultCurtainAmount:
      1,

    canvasPointerEvents:
      "none",

    dormantWhenOpen:
      true,

    openStateRenderSuppressed:
      true,

    buttonOwnership:
      false,

    pageStateOwnership:
      false,

    diamondOwnership:
      false,

    diamondWakeOwnership:
      false,

    gestureOwnership:
      false,

    routeOwnership:
      false,

    compassOwnership:
      false,

    starOwnership:
      false,

    cssLayoutOwnership:
      false,

    visualPassClaimed:
      false,

    productionAuthorized:
      false,

    deploymentAuthorized:
      false
  });

  const SELECTORS = Object.freeze({
    mount:
      "[data-showroom-window-mount]",

    existingCanvas:
      "canvas[data-showroom-window-canvas]"
  });

  const EVENTS = Object.freeze({
    READY:
      "SHOWROOM_MIRRORLAND_WINDOW_OBJECT_READY",

    RENDERED:
      "SHOWROOM_MIRRORLAND_WINDOW_OBJECT_RENDERED",

    TRANSITION_START:
      "SHOWROOM_MIRRORLAND_WINDOW_OBJECT_TRANSITION_START",

    TRANSITION_COMPLETE:
      "SHOWROOM_MIRRORLAND_WINDOW_OBJECT_TRANSITION_COMPLETE",

    DEFINITION_APPLIED:
      "SHOWROOM_MIRRORLAND_WINDOW_OBJECT_DEFINITION_APPLIED",

    DISPOSED:
      "SHOWROOM_MIRRORLAND_WINDOW_OBJECT_DISPOSED",

    FAILURE:
      "SHOWROOM_MIRRORLAND_WINDOW_OBJECT_FAILURE"
  });

  const DEFINITION_EVENTS = Object.freeze({
    READY:
      "SHOWROOM_MIRRORLAND_WINDOW_DEFINITION_READY"
  });

  const DESIGN = Object.freeze({
    width:
      480,

    height:
      720,

    centerX:
      240,

    centerY:
      360,

    objectHalfWidth:
      240,

    objectHalfHeight:
      360
  });

  const DEPTH = Object.freeze({
    rearGlassShadow:
      -0.120,

    glassBack:
      -0.085,

    glassCore:
      -0.018,

    glassFace:
      0.018,

    glassBevel:
      0.050,

    cameSide:
      0.075,

    cameFace:
      0.132,

    mullionFace:
      0.220,

    frameBack:
      0.010,

    frameBody:
      0.125,

    frameFace:
      0.245,

    frameLip:
      0.318,

    apertureWall:
      0.155,

    apertureFace:
      0.298,

    apertureLip:
      0.370,

    apertureGlow:
      0.382,

    surfaceAge:
      0.392
  });

  const BASE_RENDER = Object.freeze({
    maxDevicePixelRatio:
      2,

    objectScale:
      0.925,

    focalLength:
      3.35,

    perspectiveStrength:
      0.88,

    frozenTiltX:
      -0.038,

    frozenTiltY:
      0.058,

    frozenTiltZ:
      0,

    cameWidth:
      6.7,

    cameSideWidth:
      9.8,

    cameBevelWidth:
      3.7,

    cameHighlightWidth:
      1.05,

    outerFrameWidth:
      29,

    outerFrameFaceWidth:
      21,

    outerFrameLipWidth:
      5.8,

    innerFrameWidth:
      13,

    innerFrameLipWidth:
      3.3,

    apertureWallWidth:
      20,

    apertureFaceWidth:
      13.5,

    apertureChromeWidth:
      8.4,

    apertureLipWidth:
      2.9
  });

  const TIMING = Object.freeze({
    showMs:
      760,

    hideMs:
      980,

    reducedMs:
      80
  });

  const VISIBILITY = Object.freeze({
    hiddenCutoff:
      0.002,

    transitionHiddenCutoff:
      0.004
  });

  const FALLBACK_DEFINITION = freezeDeep({
    contractId:
      "SHOWROOM_WINDOW_OBJECT_MINIMAL_FALLBACK_DEFINITION_v1",

    source:
      "internal-minimal-fallback",

    role:
      "emergency-renderability-only",

    visualPassClaimed:
      false,

    materials:
      {
        frame:
          {
            shadow:
              [2, 3, 7],

            black:
              [9, 11, 17],

            body:
              [30, 34, 42],

            bevel:
              [74, 75, 78],

            gold:
              [170, 124, 66],

            goldBright:
              [230, 184, 104],

            goldWhite:
              [255, 232, 174],

            patina:
              [38, 76, 76],

            verdigris:
              [52, 126, 118],

            oldCopper:
              [124, 76, 42],

            coldEdge:
              [100, 136, 142],

            haloWarm:
              [255, 205, 118],

            haloCold:
              [114, 218, 238]
          },

        lead:
          {
            shadow:
              [5, 6, 11],

            dark:
              [15, 17, 23],

            body:
              [36, 38, 44],

            bevel:
              [82, 82, 84],

            highlight:
              [164, 152, 120],

            goldHairline:
              [240, 194, 112],

            coldHairline:
              [112, 194, 208],

            patina:
              [42, 82, 78]
          },

        aperture:
          {
            wall:
              [4, 5, 9],

            deepBronze:
              [104, 64, 28],

            bronze:
              [148, 94, 38],

            gold:
              [228, 164, 66],

            chromeGold:
              [255, 204, 88],

            bright:
              [255, 229, 152],

            whiteGold:
              [255, 247, 212],

            cold:
              [132, 202, 218],

            coldEdge:
              [92, 176, 202],

            innerLight:
              [255, 218, 116],

            diamondFlash:
              [255, 255, 238]
          },

        glass:
          {
            neutral:
              [180, 236, 238],

            cool:
              [92, 216, 228],

            deep:
              [72, 120, 214],

            warm:
              [226, 152, 76],

            soft:
              [184, 148, 220],

            moonstone:
              [212, 238, 255],

            ageWhite:
              [246, 244, 226],

            scratchWhite:
              [255, 255, 246]
          }
      },

    optical:
      {
        objectShadowAlpha:
          0.08,

        objectShadowBlur:
          11,

        frameShadowBlur:
          9,

        outerGlowAlpha:
          0.30,

        outerGlowBlur:
          24,

        outerGlowSpread:
          1.08,

        outerGlowWarmth:
          0.58,

        outerGlowCold:
          0.42,

        outerGlowRimAlpha:
          0.16,

        glassAlpha:
          0.38,

        glassTransmission:
          0.84,

        centerGlassTransmission:
          0.94,

        apertureGlowAlpha:
          0.42,

        apertureSpecularAlpha:
          0.72,

        apertureInnerGlowAlpha:
          0.30,

        textureLineCount:
          3,

        textureSpeckCount:
          16,

        scratchLineCount:
          7,

        scratchAlpha:
          0.18,

        scratchLength:
          0.62,

        patinaIntensity:
          0.22,

        patinaSpeckCount:
          18,

        paneDefaultAlpha:
          0.34,

        paneDefaultAge:
          0.18,

        paneDefaultRefraction:
          0.42,

        paneDefaultInternalContrast:
          0.18,

        paneDefaultColdLight:
          0.26,

        paneDefaultWarmLight:
          0.10,

        paneDefaultSaturation:
          1.12,

        paneDefaultGlow:
          0.26,

        paneDefaultEdgeLight:
          0.28,

        paneDefaultJewelDepth:
          0.28,

        leadContrast:
          0.74,

        leadHighlight:
          0.28,

        leadPatina:
          0.18,

        frameGoldAccent:
          0.32,

        frameColdAccent:
          0.20,

        framePatina:
          0.22,

        apertureGoldDominance:
          0.64,

        apertureColdCounterlight:
          0.28,

        diamondVisibilityPriority:
          1
      },

    paneVisuals:
      {},

    stateProfiles:
      {
        closed:
          {
            opacityMultiplier:
              1,

            densityMultiplier:
              0.82,

            apertureMultiplier:
              1,

            paneGlowMultiplier:
              1,

            frameContrastMultiplier:
              0.86,

            outerGlowMultiplier:
              1,

            ageMultiplier:
              1
          },

        opening:
          {
            opacityMultiplier:
              1,

            densityMultiplier:
              0.72,

            apertureMultiplier:
              1.04,

            paneGlowMultiplier:
              1.06,

            frameContrastMultiplier:
              0.78,

            outerGlowMultiplier:
              1.10,

            ageMultiplier:
              0.92
          },

        closing:
          {
            opacityMultiplier:
              1,

            densityMultiplier:
              0.78,

            apertureMultiplier:
              1.02,

            paneGlowMultiplier:
              0.96,

            frameContrastMultiplier:
              0.84,

            outerGlowMultiplier:
              0.96,

            ageMultiplier:
              1
          },

        open:
          {
            opacityMultiplier:
              0,

            densityMultiplier:
              0,

            apertureMultiplier:
              0,

            paneGlowMultiplier:
              0,

            frameContrastMultiplier:
              0,

            outerGlowMultiplier:
              0,

            ageMultiplier:
              0
          }
      }
  });

  const state = {
    mount:
      null,

    canvas:
      null,

    context:
      null,

    createdCanvas:
      false,

    width:
      1,

    height:
      1,

    pixelRatio:
      1,

    geometry:
      null,

    definition:
      FALLBACK_DEFINITION,

    externalDefinitionApplied:
      false,

    curtainAmount:
      1,

    transition:
      null,

    raf:
      0,

    running:
      false,

    resizeObserver:
      null,

    resizeFallbackBound:
      false,

    reducedMotion:
      false,

    reducedMotionQuery:
      null,

    reducedMotionBound:
      false,

    definitionListenerBound:
      false,

    initialized:
      false,

    disposed:
      false,

    failed:
      false,

    lastRenderTime:
      0,

    dormant:
      false
  };

  const receipt = {
    contractId:
      CONTRACT.id,

    previousContractId:
      CONTRACT.previousId,

    internalArchitecture:
      CONTRACT.internalArchitecture,

    internalArchitectureVersion:
      CONTRACT.internalArchitectureVersion,

    file:
      CONTRACT.file,

    publicSurface:
      CONTRACT.publicSurface,

    definitionSurface:
      CONTRACT.definitionSurface,

    definitionReceiptSurface:
      CONTRACT.definitionReceiptSurface,

    status:
      "pending",

    initialized:
      false,

    disposed:
      false,

    failed:
      false,

    canvasPresent:
      false,

    geometryPresent:
      false,

    curtainAmount:
      1,

    canvasDormant:
      false,

    dormantWhenOpen:
      true,

    openStateRenderSuppressed:
      true,

    foregroundLensModel:
      true,

    apertureFocusModel:
      true,

    luminousGlassModel:
      true,

    backlitPaneModel:
      true,

    atmosphericHaloModel:
      true,

    agedGlassModel:
      true,

    definitionReady:
      true,

    definitionExternalized:
      true,

    definitionConsumerReady:
      true,

    fallbackDefinitionPresent:
      true,

    definitionPresent:
      true,

    externalDefinitionApplied:
      false,

    activeDefinitionContractId:
      FALLBACK_DEFINITION.contractId,

    paneCount:
      0,

    uniqueCameSegmentCount:
      0,

    frameBandCount:
      0,

    aperturePointCount:
      0,

    rendererModel:
      CONTRACT.rendererModel,

    motionModel:
      CONTRACT.motionModel,

    canvasPointerEvents:
      CONTRACT.canvasPointerEvents,

    perFrameReceiptWrites:
      false,

    ownsButton:
      false,

    ownsPageState:
      false,

    ownsDiamond:
      false,

    ownsDiamondWake:
      false,

    ownsGestures:
      false,

    ownsRoute:
      false,

    ownsCompass:
      false,

    ownsStars:
      false,

    ownsCssLayout:
      false,

    visualPassClaimed:
      false,

    productionAuthorized:
      false,

    deploymentAuthorized:
      false,

    lastAction:
      "",

    lastFailure:
      null
  };

  function freezeDeep(value) {
    if (
      !value ||
      typeof value !== "object" ||
      Object.isFrozen(value)
    ) {
      return value;
    }

    Object.freeze(value);

    Object.getOwnPropertyNames(value).forEach(
      key => freezeDeep(value[key])
    );

    return value;
  }

  function clonePlain(value) {
    if (
      !value ||
      typeof value !== "object"
    ) {
      return value;
    }

    if (Array.isArray(value)) {
      return value.map(clonePlain);
    }

    const output =
      {};

    Object.keys(value).forEach(
      key => {
        output[key] =
          clonePlain(value[key]);
      }
    );

    return output;
  }

  function mergePlain(base, override) {
    const output =
      clonePlain(base);

    if (
      !override ||
      typeof override !== "object"
    ) {
      return output;
    }

    Object.keys(override).forEach(
      key => {
        const next =
          override[key];

        if (
          next &&
          typeof next === "object" &&
          !Array.isArray(next) &&
          output[key] &&
          typeof output[key] === "object" &&
          !Array.isArray(output[key])
        ) {
          output[key] =
            mergePlain(output[key], next);
        } else {
          output[key] =
            clonePlain(next);
        }
      }
    );

    return output;
  }

  function clamp(value, minimum, maximum) {
    const number =
      Number(value);

    if (!Number.isFinite(number)) {
      return minimum;
    }

    return Math.max(
      minimum,
      Math.min(maximum, number)
    );
  }

  function numeric(value, fallback) {
    const number =
      Number(value);

    return Number.isFinite(number)
      ? number
      : fallback;
  }

  function lerp(a, b, amount) {
    return a + (b - a) * amount;
  }

  function easeOutCubic(value) {
    const inverse =
      1 - value;

    return 1 - inverse * inverse * inverse;
  }

  function easeInOutCubic(value) {
    return value < 0.5
      ? 4 * value * value * value
      : 1 - Math.pow(-2 * value + 2, 3) / 2;
  }

  function rgba(color, alpha) {
    const safe =
      Array.isArray(color)
        ? color
        : [255, 255, 255];

    return `rgba(${safe[0] || 0}, ${safe[1] || 0}, ${safe[2] || 0}, ${clamp(alpha, 0, 1)})`;
  }

  function brightenColor(color, amount = 0) {
    const safe =
      Array.isArray(color)
        ? color
        : [255, 255, 255];

    const lift =
      clamp(amount, 0, 1);

    return [
      Math.round(lerp(safe[0] || 0, 255, lift)),
      Math.round(lerp(safe[1] || 0, 255, lift)),
      Math.round(lerp(safe[2] || 0, 255, lift))
    ];
  }

  function darkenColor(color, amount = 0) {
    const safe =
      Array.isArray(color)
        ? color
        : [0, 0, 0];

    const shade =
      clamp(amount, 0, 1);

    return [
      Math.round(lerp(safe[0] || 0, 0, shade)),
      Math.round(lerp(safe[1] || 0, 0, shade)),
      Math.round(lerp(safe[2] || 0, 0, shade))
    ];
  }

  function saturateColor(color, amount = 1) {
    const safe =
      Array.isArray(color)
        ? color
        : [255, 255, 255];

    const factor =
      Math.max(0, numeric(amount, 1));

    const red =
      safe[0] || 0;

    const green =
      safe[1] || 0;

    const blue =
      safe[2] || 0;

    const gray =
      red * 0.299 +
      green * 0.587 +
      blue * 0.114;

    return [
      Math.round(clamp(gray + (red - gray) * factor, 0, 255)),
      Math.round(clamp(gray + (green - gray) * factor, 0, 255)),
      Math.round(clamp(gray + (blue - gray) * factor, 0, 255))
    ];
  }

  function mixColor(a, b, amount = 0.5) {
    const safeA =
      Array.isArray(a)
        ? a
        : [255, 255, 255];

    const safeB =
      Array.isArray(b)
        ? b
        : [255, 255, 255];

    const mix =
      clamp(amount, 0, 1);

    return [
      Math.round(lerp(safeA[0] || 0, safeB[0] || 0, mix)),
      Math.round(lerp(safeA[1] || 0, safeB[1] || 0, mix)),
      Math.round(lerp(safeA[2] || 0, safeB[2] || 0, mix))
    ];
  }

  function glassColor(color, saturation = 1, lift = 0) {
    return brightenColor(
      saturateColor(color, saturation),
      lift
    );
  }

  function nowId(prefix) {
    return `${prefix}-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}`;
  }

  function dispatch(type, detail = {}) {
    try {
      globalThis.dispatchEvent(
        new CustomEvent(
          type,
          {
            detail:
              Object.freeze({
                contractId:
                  CONTRACT.id,

                file:
                  CONTRACT.file,

                ...detail
              })
          }
        )
      );
    } catch (_) {}
  }

  function isCurtainHidden(value = state.curtainAmount) {
    return clamp(value, 0, 1) <= VISIBILITY.hiddenCutoff;
  }

  function currentVisualState() {
    if (isCurtainHidden()) {
      return "open";
    }

    if (!state.transition) {
      return state.curtainAmount >= 0.999
        ? "closed"
        : "opening";
    }

    return state.transition.to > state.transition.from
      ? "closing"
      : "opening";
  }

  function normalizeDefinition(candidate) {
    if (
      !candidate ||
      typeof candidate !== "object"
    ) {
      return FALLBACK_DEFINITION;
    }

    const merged =
      mergePlain(FALLBACK_DEFINITION, candidate);

    merged.source =
      candidate.source ||
      candidate.file ||
      "external-definition";

    merged.contractId =
      candidate.contractId ||
      candidate.contract ||
      candidate.id ||
      "UNKNOWN_WINDOW_EXTERNAL_DEFINITION";

    return freezeDeep(merged);
  }

  function applyExternalDefinition(reason = "definition-scan") {
    const candidate =
      globalThis.SHOWROOM_MIRRORLAND_WINDOW_DEFINITION;

    if (
      !candidate ||
      typeof candidate !== "object"
    ) {
      state.definition =
        FALLBACK_DEFINITION;

      state.externalDefinitionApplied =
        false;

      updateReceipt({
        definitionPresent:
          true,

        externalDefinitionApplied:
          false,

        activeDefinitionContractId:
          FALLBACK_DEFINITION.contractId,

        lastAction:
          "window-object-minimal-fallback-definition-active"
      });

      return false;
    }

    const normalized =
      normalizeDefinition(candidate);

    state.definition =
      normalized;

    state.externalDefinitionApplied =
      normalized.contractId !== FALLBACK_DEFINITION.contractId;

    updateReceipt({
      definitionPresent:
        true,

      externalDefinitionApplied:
        state.externalDefinitionApplied,

      activeDefinitionContractId:
        normalized.contractId,

      lastAction:
        "window-object-external-definition-applied",

      definitionReason:
        reason
    });

    if (
      state.initialized &&
      !state.failed &&
      !state.disposed
    ) {
      if (isCurtainHidden()) {
        hideCanvasForCurtain();
      } else {
        drawCurtainObject();
      }
    }

    dispatch(
      EVENTS.DEFINITION_APPLIED,
      {
        reason,
        externalDefinitionApplied:
          state.externalDefinitionApplied,

        definitionContractId:
          normalized.contractId,

        receipt:
          getReceipt()
      }
    );

    return state.externalDefinitionApplied;
  }

  function bindDefinitionListener() {
    if (state.definitionListenerBound) {
      return;
    }

    state.definitionListenerBound =
      true;

    globalThis.addEventListener(
      DEFINITION_EVENTS.READY,
      () => {
        applyExternalDefinition("definition-ready-event");
      }
    );
  }

  function getDefinitionProfile() {
    const profiles =
      state.definition &&
      state.definition.stateProfiles
        ? state.definition.stateProfiles
        : FALLBACK_DEFINITION.stateProfiles;

    return profiles[currentVisualState()] ||
      FALLBACK_DEFINITION.stateProfiles.closed;
  }

  function optical(key) {
    const definitionOptical =
      state.definition &&
      state.definition.optical
        ? state.definition.optical
        : FALLBACK_DEFINITION.optical;

    return definitionOptical[key] ??
      FALLBACK_DEFINITION.optical[key];
  }

  function profileValue(key, fallback) {
    const profile =
      getDefinitionProfile();

    return numeric(
      profile && profile[key],
      fallback
    );
  }

  function material(group, key) {
    const definitionMaterials =
      state.definition &&
      state.definition.materials
        ? state.definition.materials
        : FALLBACK_DEFINITION.materials;

    const groupValue =
      definitionMaterials[group] ||
      FALLBACK_DEFINITION.materials[group] ||
      {};

    const fallbackGroup =
      FALLBACK_DEFINITION.materials[group] ||
      {};

    return groupValue[key] ||
      fallbackGroup[key] ||
      [255, 255, 255];
  }

  function fallbackPaneVisual(pane) {
    const glass =
      FALLBACK_DEFINITION.materials.glass;

    if (pane.id === "mid-center") {
      return {
        material:
          "neutral",

        materialColor:
          glass.neutral,

        alpha:
          0.22,

        transmission:
          0.92,

        age:
          0.12,

        refraction:
          0.56,

        internalContrast:
          0.08,

        coldLight:
          0.34,

        warmLight:
          0.16,

        phase:
          pane.phase,

        saturation:
          0.95,

        glow:
          0.34,

        edgeLight:
          0.44,

        jewelDepth:
          0.12,

        scratch:
          0.22,

        patina:
          0.08
      };
    }

    if (
      pane.id.includes("edge") ||
      pane.id.includes("deep") ||
      pane.id.includes("base")
    ) {
      return {
        material:
          "deep",

        materialColor:
          glass.deep,

        alpha:
          0.32,

        transmission:
          0.80,

        age:
          0.22,

        refraction:
          0.42,

        internalContrast:
          0.18,

        coldLight:
          0.24,

        warmLight:
          0.08,

        phase:
          pane.phase,

        saturation:
          1.12,

        glow:
          0.24,

        edgeLight:
          0.28,

        jewelDepth:
          0.34,

        scratch:
          0.26,

        patina:
          0.18
      };
    }

    return {
      material:
        "cool",

      materialColor:
        glass.cool,

      alpha:
        0.30,

      transmission:
        0.84,

      age:
        0.16,

      refraction:
        0.44,

      internalContrast:
        0.14,

      coldLight:
        0.28,

      warmLight:
        0.08,

      phase:
        pane.phase,

      saturation:
        1.08,

      glow:
        0.26,

      edgeLight:
        0.30,

      jewelDepth:
        0.24,

      scratch:
        0.22,

      patina:
        0.12
    };
  }

  function paneVisual(pane) {
    const visuals =
      state.definition &&
      state.definition.paneVisuals
        ? state.definition.paneVisuals
        : {};

    const supplied =
      visuals[pane.id];

    const fallback =
      fallbackPaneVisual(pane);

    if (
      !supplied ||
      typeof supplied !== "object"
    ) {
      return fallback;
    }

    const materialName =
      supplied.material ||
      fallback.material;

    const color =
      supplied.materialColor ||
      material("glass", materialName) ||
      fallback.materialColor;

    return {
      ...fallback,
      ...supplied,

      material:
        materialName,

      materialColor:
        color
    };
  }

  function updateReceipt(extra = {}) {
    Object.assign(
      receipt,
      {
        status:
          state.disposed
            ? "disposed"
            : state.failed
              ? "failed"
              : state.initialized
                ? "available"
                : "pending",

        initialized:
          state.initialized,

        disposed:
          state.disposed,

        failed:
          state.failed,

        canvasPresent:
          Boolean(state.canvas),

        geometryPresent:
          Boolean(state.geometry),

        curtainAmount:
          state.curtainAmount,

        canvasDormant:
          Boolean(state.dormant || isCurtainHidden()),

        dormantWhenOpen:
          true,

        openStateRenderSuppressed:
          true,

        foregroundLensModel:
          true,

        apertureFocusModel:
          true,

        luminousGlassModel:
          true,

        backlitPaneModel:
          true,

        atmosphericHaloModel:
          true,

        agedGlassModel:
          true,

        definitionReady:
          true,

        definitionExternalized:
          true,

        definitionConsumerReady:
          true,

        fallbackDefinitionPresent:
          true,

        definitionPresent:
          Boolean(state.definition),

        externalDefinitionApplied:
          Boolean(state.externalDefinitionApplied),

        activeDefinitionContractId:
          state.definition && state.definition.contractId
            ? state.definition.contractId
            : FALLBACK_DEFINITION.contractId,

        paneCount:
          state.geometry
            ? state.geometry.panes.length
            : 0,

        uniqueCameSegmentCount:
          state.geometry
            ? state.geometry.cameSegments.length
            : 0,

        frameBandCount:
          state.geometry
            ? state.geometry.frameBands.length
            : 0,

        aperturePointCount:
          state.geometry
            ? state.geometry.aperture.outer.length
            : 0,

        perFrameReceiptWrites:
          false,

        ownsButton:
          false,

        ownsPageState:
          false,

        ownsDiamond:
          false,

        ownsDiamondWake:
          false,

        ownsGestures:
          false,

        ownsRoute:
          false,

        ownsCompass:
          false,

        ownsStars:
          false,

        ownsCssLayout:
          false,

        visualPassClaimed:
          false,

        productionAuthorized:
          false,

        deploymentAuthorized:
          false,

        ...extra
      }
    );

    globalThis.SHOWROOM_MIRRORLAND_WINDOW_OBJECT_RECEIPT =
      Object.freeze({
        ...receipt
      });

    if (state.canvas) {
      state.canvas.dataset.showroomWindowObjectContract =
        CONTRACT.id;

      state.canvas.dataset.showroomWindowObjectStatus =
        receipt.status;

      state.canvas.dataset.showroomWindowCanvasDormant =
        receipt.canvasDormant
          ? "true"
          : "false";

      state.canvas.dataset.showroomWindowDefinitionContract =
        receipt.activeDefinitionContractId;

      state.canvas.dataset.showroomWindowExternalDefinitionApplied =
        receipt.externalDefinitionApplied
          ? "true"
          : "false";

      state.canvas.dataset.showroomWindowLuminousGlass =
        "true";

      state.canvas.dataset.showroomWindowAtmosphericHalo =
        "true";

      state.canvas.dataset.showroomWindowAgedGlass =
        "true";

      state.canvas.dataset.visualPassClaimed =
        "false";
    }

    if (state.mount) {
      state.mount.dataset.showroomWindowObjectStatus =
        receipt.status;

      state.mount.dataset.showroomWindowObjectContract =
        CONTRACT.id;

      state.mount.dataset.showroomWindowCanvasDormant =
        receipt.canvasDormant
          ? "true"
          : "false";

      state.mount.dataset.showroomWindowForegroundLens =
        "true";

      state.mount.dataset.showroomWindowApertureFocus =
        "true";

      state.mount.dataset.showroomWindowLuminousGlass =
        "true";

      state.mount.dataset.showroomWindowAtmosphericHalo =
        "true";

      state.mount.dataset.showroomWindowAgedGlass =
        "true";

      state.mount.dataset.showroomWindowDefinitionContract =
        receipt.activeDefinitionContractId;

      state.mount.dataset.showroomWindowExternalDefinitionApplied =
        receipt.externalDefinitionApplied
          ? "true"
          : "false";

      state.mount.dataset.visualPassClaimed =
        "false";
    }
  }

  function stopRenderLoop() {
    state.running =
      false;

    if (state.raf) {
      cancelAnimationFrame(state.raf);

      state.raf =
        0;
    }
  }

  function fail(reason) {
    state.failed =
      true;

    stopRenderLoop();

    updateReceipt({
      status:
        "failed",

      lastAction:
        "window-object-failed",

      lastFailure:
        String(reason || "UNKNOWN_WINDOW_OBJECT_FAILURE")
    });

    dispatch(
      EVENTS.FAILURE,
      {
        reason:
          String(reason || "UNKNOWN_WINDOW_OBJECT_FAILURE"),

        receipt:
          getReceipt()
      }
    );
  }

  function normalizePoint(point, z = 0) {
    return Object.freeze({
      x:
        (point[0] - DESIGN.centerX) / DESIGN.objectHalfWidth,

      y:
        (DESIGN.centerY - point[1]) / DESIGN.objectHalfHeight,

      z
    });
  }

  function normalizePolygon(points, z = 0) {
    return Object.freeze(
      points.map(point =>
        normalizePoint(point, z)
      )
    );
  }

  function sourcePointKey(point) {
    return `${Math.round(point[0])},${Math.round(point[1])}`;
  }

  function segmentKey(a, b) {
    const keyA =
      sourcePointKey(a);

    const keyB =
      sourcePointKey(b);

    return keyA < keyB
      ? `${keyA}|${keyB}`
      : `${keyB}|${keyA}`;
  }

  function createPane(id, sourcePoints, phase = 0) {
    return freezeDeep({
      id,

      sourcePoints:
        sourcePoints.map(point =>
          Object.freeze([point[0], point[1]])
        ),

      points:
        normalizePolygon(sourcePoints, DEPTH.glassCore),

      rearZ:
        DEPTH.glassBack,

      coreZ:
        DEPTH.glassCore,

      faceZ:
        DEPTH.glassFace,

      bevelZ:
        DEPTH.glassBevel,

      phase
    });
  }

  function buildPanes() {
    return Object.freeze([
      createPane("crown-left", [[240, 48], [164, 108], [204, 168], [240, 134]], 0.12),
      createPane("crown-right", [[240, 48], [240, 134], [278, 168], [318, 108]], 0.44),
      createPane("upper-left-edge", [[164, 108], [98, 210], [154, 246], [204, 168]], 0.82),
      createPane("upper-right-edge", [[318, 108], [278, 168], [326, 246], [382, 210]], 1.16),
      createPane("upper-center-left", [[204, 168], [154, 246], [216, 268], [240, 208], [240, 134]], 1.52),
      createPane("upper-center-right", [[240, 134], [240, 208], [264, 268], [326, 246], [278, 168]], 1.88),
      createPane("mid-left-high", [[98, 210], [66, 332], [148, 338], [154, 246]], 2.22),
      createPane("mid-left-inner", [[154, 246], [148, 338], [212, 334], [216, 268]], 2.58),
      createPane("mid-center", [[216, 268], [212, 334], [240, 382], [268, 334], [264, 268], [240, 208]], 2.93),
      createPane("mid-right-inner", [[264, 268], [268, 334], [332, 338], [326, 246]], 3.18),
      createPane("mid-right-high", [[326, 246], [332, 338], [414, 332], [382, 210]], 3.54),
      createPane("lower-left-edge", [[66, 332], [82, 470], [156, 446], [148, 338]], 3.90),
      createPane("lower-left-center", [[148, 338], [156, 446], [216, 430], [240, 382], [212, 334]], 4.23),
      createPane("lower-right-center", [[268, 334], [240, 382], [264, 430], [324, 446], [332, 338]], 4.55),
      createPane("lower-right-edge", [[332, 338], [324, 446], [398, 470], [414, 332]], 4.92),
      createPane("lower-left-deep", [[82, 470], [116, 594], [192, 530], [156, 446]], 5.24),
      createPane("lower-center-left", [[156, 446], [192, 530], [240, 624], [240, 500], [216, 430]], 5.56),
      createPane("lower-center-right", [[264, 430], [240, 500], [240, 624], [288, 530], [324, 446]], 5.92),
      createPane("lower-right-deep", [[324, 446], [288, 530], [364, 594], [398, 470]], 6.23),
      createPane("base-left", [[116, 594], [168, 660], [240, 676], [240, 624], [192, 530]], 6.54),
      createPane("base-right", [[288, 530], [240, 624], [240, 676], [312, 660], [364, 594]], 6.88)
    ]);
  }

  function collectCameSegments(panes) {
    const map =
      new Map();

    panes.forEach(pane => {
      pane.sourcePoints.forEach(
        (point, index) => {
          const next =
            pane.sourcePoints[
              (index + 1) % pane.sourcePoints.length
            ];

          const key =
            segmentKey(point, next);

          if (!map.has(key)) {
            map.set(
              key,
              freezeDeep({
                id:
                  `came-${map.size + 1}`,

                source:
                  Object.freeze([
                    Object.freeze([point[0], point[1]]),
                    Object.freeze([next[0], next[1]])
                  ]),

                points:
                  Object.freeze([
                    normalizePoint(point, DEPTH.cameFace),
                    normalizePoint(next, DEPTH.cameFace)
                  ])
              })
            );
          }
        }
      );
    });

    return Object.freeze(
      Array.from(map.values())
    );
  }

  function buildFrameBands() {
    const outerLeft =
      [[240, 22], [174, 50], [111, 112], [70, 210], [50, 338], [62, 478], [106, 592], [165, 662], [240, 706]];

    const outerRight =
      [[240, 22], [306, 50], [369, 112], [410, 210], [430, 338], [418, 478], [374, 592], [315, 662], [240, 706]];

    const faceLeft =
      [[240, 31], [178, 61], [120, 122], [82, 216], [64, 340], [75, 470], [116, 580], [172, 649], [240, 692]];

    const faceRight =
      [[240, 31], [302, 61], [360, 122], [398, 216], [416, 340], [405, 470], [364, 580], [308, 649], [240, 692]];

    const innerLeft =
      [[240, 55], [184, 85], [132, 150], [98, 238], [84, 342], [94, 458], [132, 560], [181, 628], [240, 672]];

    const innerRight =
      [[240, 55], [296, 85], [348, 150], [382, 238], [396, 342], [386, 458], [348, 560], [299, 628], [240, 672]];

    const mullionTop =
      [[236, 62], [244, 62], [244, 207], [241, 222], [239, 222], [236, 207]];

    const mullionBottom =
      [[236, 449], [239, 434], [241, 434], [244, 449], [244, 674], [236, 674]];

    const mullionTopGoldHairline =
      [[239, 68], [241, 68], [241, 201], [240, 214], [239, 201]];

    const mullionBottomGoldHairline =
      [[239, 455], [240, 442], [241, 455], [241, 668], [239, 668]];

    const topCap =
      [[224, 30], [256, 30], [276, 45], [260, 62], [220, 62], [204, 45]];

    const bottomCap =
      [[218, 676], [262, 676], [278, 694], [240, 710], [202, 694]];

    function band(id, source, z, width, tier) {
      return freezeDeep({
        id,

        source:
          source.map(point =>
            Object.freeze([point[0], point[1]])
          ),

        points:
          normalizePolygon(source, z),

        z,
        width,
        tier
      });
    }

    return Object.freeze([
      band("outer-left-back-band", outerLeft, DEPTH.frameBack, BASE_RENDER.outerFrameWidth, "outer-back"),
      band("outer-right-back-band", outerRight, DEPTH.frameBack, BASE_RENDER.outerFrameWidth, "outer-back"),
      band("outer-left-face-band", faceLeft, DEPTH.frameFace, BASE_RENDER.outerFrameFaceWidth, "outer-face"),
      band("outer-right-face-band", faceRight, DEPTH.frameFace, BASE_RENDER.outerFrameFaceWidth, "outer-face"),
      band("inner-left-lip-band", innerLeft, DEPTH.frameLip, BASE_RENDER.innerFrameWidth, "inner-lip"),
      band("inner-right-lip-band", innerRight, DEPTH.frameLip, BASE_RENDER.innerFrameWidth, "inner-lip"),
      band("center-mullion-top-compound-refined", mullionTop, DEPTH.mullionFace, 0, "mullion"),
      band("center-mullion-bottom-compound-refined", mullionBottom, DEPTH.mullionFace, 0, "mullion"),
      band("center-mullion-top-gold-hairline", mullionTopGoldHairline, DEPTH.apertureLip, 0, "mullion-hairline"),
      band("center-mullion-bottom-gold-hairline", mullionBottomGoldHairline, DEPTH.apertureLip, 0, "mullion-hairline"),
      band("top-metal-cap", topCap, DEPTH.frameLip, 0, "cap"),
      band("bottom-metal-cap", bottomCap, DEPTH.frameLip, 0, "cap")
    ]);
  }

  function buildAperture() {
    const outer =
      [[240, 214], [306, 328], [240, 442], [174, 328]];

    const middle =
      [[240, 234], [290, 328], [240, 422], [190, 328]];

    const inner =
      [[240, 252], [274, 328], [240, 404], [206, 328]];

    const clear =
      [[240, 260], [266, 328], [240, 396], [214, 328]];

    const glow =
      [[240, 226], [298, 328], [240, 430], [182, 328]];

    const specularTopLeft =
      [[224, 286], [235, 270], [241, 274], [231, 292]];

    const specularBottomRight =
      [[256, 370], [266, 352], [272, 356], [262, 374]];

    return freezeDeep({
      id:
        "central-diamond-aperture-foreground-lens-compound",

      transparent:
        true,

      outer:
        normalizePolygon(outer, DEPTH.apertureFace),

      middle:
        normalizePolygon(middle, DEPTH.apertureLip),

      inner:
        normalizePolygon(inner, DEPTH.apertureWall),

      clear:
        normalizePolygon(clear, DEPTH.apertureLip),

      glow:
        normalizePolygon(glow, DEPTH.apertureGlow),

      specular:
        Object.freeze([
          normalizePolygon(specularTopLeft, DEPTH.surfaceAge),
          normalizePolygon(specularBottomRight, DEPTH.surfaceAge)
        ]),

      source:
        Object.freeze({
          outer:
            outer.map(point => Object.freeze([point[0], point[1]])),

          middle:
            middle.map(point => Object.freeze([point[0], point[1]])),

          inner:
            inner.map(point => Object.freeze([point[0], point[1]])),

          clear:
            clear.map(point => Object.freeze([point[0], point[1]])),

          glow:
            glow.map(point => Object.freeze([point[0], point[1]])),

          specular:
            Object.freeze([
              specularTopLeft.map(point => Object.freeze([point[0], point[1]])),
              specularBottomRight.map(point => Object.freeze([point[0], point[1]]))
            ])
        }),

      subtractivePhase1:
        "canvas-destination-out",

      focalRole:
        "foreground-lens-focus-to-diamond-behind",

      diamondOwnership:
        false
    });
  }

  function makeGeometry() {
    const panes =
      buildPanes();

    const cameSegments =
      collectCameSegments(panes);

    const frameBands =
      buildFrameBands();

    const aperture =
      buildAperture();

    return freezeDeep({
      contractId:
        CONTRACT.id,

      coordinateSystem:
        Object.freeze({
          name:
            "W",

          x:
            "left-right-normalized-from-original-480-design-width",

          y:
            "vertical-normalized-from-original-720-design-height",

          z:
            "depth-positive-toward-viewer",

          origin:
            "center-of-original-window-design",

          motion:
            "object-frozen-in-time"
        }),

      design:
        DESIGN,

      depth:
        DEPTH,

      baseRender:
        BASE_RENDER,

      panes,
      cameSegments,
      frameBands,
      aperture
    });
  }

  function rotatePoint(point, tiltX, tiltY, tiltZ) {
    let x =
      point.x;

    let y =
      point.y;

    let z =
      point.z;

    const cosX =
      Math.cos(tiltX);

    const sinX =
      Math.sin(tiltX);

    const y1 =
      y * cosX - z * sinX;

    const z1 =
      y * sinX + z * cosX;

    y =
      y1;

    z =
      z1;

    const cosY =
      Math.cos(tiltY);

    const sinY =
      Math.sin(tiltY);

    const x2 =
      x * cosY + z * sinY;

    const z2 =
      -x * sinY + z * cosY;

    x =
      x2;

    z =
      z2;

    const cosZ =
      Math.cos(tiltZ);

    const sinZ =
      Math.sin(tiltZ);

    const x3 =
      x * cosZ - y * sinZ;

    const y3 =
      x * sinZ + y * cosZ;

    x =
      x3;

    y =
      y3;

    return {
      x,
      y,
      z
    };
  }

  function projectPoint(point, layout, extraZ = 0) {
    const rotated =
      rotatePoint(
        {
          x:
            point.x,

          y:
            point.y,

          z:
            point.z + extraZ
        },
        BASE_RENDER.frozenTiltX,
        BASE_RENDER.frozenTiltY,
        BASE_RENDER.frozenTiltZ
      );

    const perspective =
      BASE_RENDER.focalLength /
      (
        BASE_RENDER.focalLength -
        rotated.z * BASE_RENDER.perspectiveStrength
      );

    return {
      x:
        layout.centerX +
        rotated.x *
          layout.scaleX *
          perspective,

      y:
        layout.centerY -
        rotated.y *
          layout.scaleY *
          perspective,

      z:
        rotated.z,

      perspective
    };
  }

  function projectPolygon(points, layout, extraZ = 0) {
    return points.map(point =>
      projectPoint(point, layout, extraZ)
    );
  }

  function tracePolygon(context, points) {
    if (!points.length) {
      return;
    }

    context.beginPath();

    context.moveTo(points[0].x, points[0].y);

    for (
      let index = 1;
      index < points.length;
      index += 1
    ) {
      context.lineTo(points[index].x, points[index].y);
    }

    context.closePath();
  }

  function traceCurve(context, points) {
    if (!points.length) {
      return;
    }

    context.beginPath();

    context.moveTo(points[0].x, points[0].y);

    for (
      let index = 1;
      index < points.length;
      index += 1
    ) {
      const previous =
        points[index - 1];

      const current =
        points[index];

      const midX =
        (previous.x + current.x) / 2;

      const midY =
        (previous.y + current.y) / 2;

      context.quadraticCurveTo(
        previous.x,
        previous.y,
        midX,
        midY
      );
    }

    const last =
      points[points.length - 1];

    context.lineTo(last.x, last.y);
  }

  function boundsOf(points) {
    return points.reduce(
      (bounds, point) => ({
        minX:
          Math.min(bounds.minX, point.x),

        maxX:
          Math.max(bounds.maxX, point.x),

        minY:
          Math.min(bounds.minY, point.y),

        maxY:
          Math.max(bounds.maxY, point.y)
      }),
      {
        minX:
          Infinity,

        maxX:
          -Infinity,

        minY:
          Infinity,

        maxY:
          -Infinity
      }
    );
  }

  function lineWidth(value) {
    const scale =
      Math.max(
        0.75,
        Math.min(
          2.4,
          Math.min(state.width, state.height) / 760
        )
      );

    return value * scale;
  }

  function makeLayout() {
    const cssWidth =
      state.width / state.pixelRatio;

    const cssHeight =
      state.height / state.pixelRatio;

    const fit =
      Math.min(
        cssWidth / DESIGN.width,
        cssHeight / DESIGN.height
      );

    const objectScale =
      fit * BASE_RENDER.objectScale;

    return {
      cssWidth,
      cssHeight,

      centerX:
        cssWidth / 2,

      centerY:
        cssHeight / 2,

      scaleX:
        DESIGN.objectHalfWidth * objectScale,

      scaleY:
        DESIGN.objectHalfHeight * objectScale,

      objectScale
    };
  }

  function createCanvas() {
    const existing =
      state.mount.querySelector(SELECTORS.existingCanvas);

    const canvas =
      existing ||
      document.createElement("canvas");

    state.createdCanvas =
      !existing;

    canvas.dataset.showroomWindowCanvas =
      "true";

    canvas.dataset.showroomWindowObject =
      "true";

    canvas.dataset.showroomWindowObjectContract =
      CONTRACT.id;

    canvas.dataset.showroomWindowCanvasDormant =
      "false";

    canvas.dataset.showroomWindowForegroundLens =
      "true";

    canvas.dataset.showroomWindowApertureFocus =
      "true";

    canvas.dataset.showroomWindowLuminousGlass =
      "true";

    canvas.dataset.showroomWindowAtmosphericHalo =
      "true";

    canvas.dataset.showroomWindowAgedGlass =
      "true";

    canvas.setAttribute("aria-hidden", "true");
    canvas.setAttribute("role", "presentation");

    Object.assign(
      canvas.style,
      {
        position:
          "absolute",

        inset:
          "0",

        width:
          "100%",

        height:
          "100%",

        display:
          "block",

        opacity:
          "1",

        visibility:
          "visible",

        background:
          "transparent",

        pointerEvents:
          "none",

        touchAction:
          "none",

        zIndex:
          "1"
      }
    );

    if (!existing) {
      state.mount.appendChild(canvas);
    }

    return canvas;
  }

  function resize() {
    if (
      !state.canvas ||
      !state.mount
    ) {
      return false;
    }

    const rect =
      state.mount.getBoundingClientRect();

    const pixelRatio =
      Math.min(
        globalThis.devicePixelRatio || 1,
        BASE_RENDER.maxDevicePixelRatio
      );

    const width =
      Math.max(1, Math.floor(rect.width * pixelRatio));

    const height =
      Math.max(1, Math.floor(rect.height * pixelRatio));

    const changed =
      state.canvas.width !== width ||
      state.canvas.height !== height;

    if (changed) {
      state.canvas.width =
        width;

      state.canvas.height =
        height;
    }

    state.canvas.style.width =
      `${Math.max(1, rect.width)}px`;

    state.canvas.style.height =
      `${Math.max(1, rect.height)}px`;

    state.width =
      width;

    state.height =
      height;

    state.pixelRatio =
      pixelRatio;

    return changed;
  }

  function clearCanvas() {
    if (!state.context) {
      return;
    }

    state.context.clearRect(
      0,
      0,
      state.width,
      state.height
    );
  }

  function showCanvasForCurtain() {
    state.dormant =
      false;

    if (state.canvas) {
      state.canvas.style.opacity =
        "1";

      state.canvas.style.visibility =
        "visible";

      state.canvas.style.display =
        "block";

      state.canvas.style.pointerEvents =
        "none";

      state.canvas.style.touchAction =
        "none";

      state.canvas.style.background =
        "transparent";

      state.canvas.dataset.showroomWindowCanvasDormant =
        "false";
    }

    if (state.mount) {
      state.mount.style.pointerEvents =
        "none";

      state.mount.style.background =
        "transparent";

      state.mount.dataset.showroomWindowCanvasDormant =
        "false";
    }
  }

  function hideCanvasForCurtain() {
    state.dormant =
      true;

    clearCanvas();

    if (state.canvas) {
      state.canvas.style.opacity =
        "0";

      state.canvas.style.visibility =
        "hidden";

      state.canvas.style.display =
        "block";

      state.canvas.style.pointerEvents =
        "none";

      state.canvas.style.touchAction =
        "none";

      state.canvas.style.background =
        "transparent";

      state.canvas.dataset.showroomWindowCanvasDormant =
        "true";
    }

    if (state.mount) {
      state.mount.style.pointerEvents =
        "none";

      state.mount.style.background =
        "transparent";

      state.mount.dataset.showroomWindowCanvasDormant =
        "true";
    }
  }

  function applyCanvasVisibility() {
    if (isCurtainHidden()) {
      hideCanvasForCurtain();
    } else {
      showCanvasForCurtain();
    }
  }

  function handleHiddenResizeOrRender() {
    state.curtainAmount =
      0;

    resize();
    hideCanvasForCurtain();

    return false;
  }

  function drawObjectOuterGlow(context, layout, amount) {
    const profile =
      getDefinitionProfile();

    const adjusted =
      amount *
      numeric(profile.opacityMultiplier, 1) *
      numeric(profile.outerGlowMultiplier, 1);

    const outerGlowAlpha =
      numeric(optical("outerGlowAlpha"), 0.30);

    if (
      adjusted <= 0.002 ||
      outerGlowAlpha <= 0.002
    ) {
      return;
    }

    const blur =
      lineWidth(numeric(optical("outerGlowBlur"), 24));

    const spread =
      numeric(optical("outerGlowSpread"), 1.08);

    const warmth =
      clamp(numeric(optical("outerGlowWarmth"), 0.58), 0, 1);

    const coldness =
      clamp(numeric(optical("outerGlowCold"), 0.42), 0, 1);

    const rimAlpha =
      numeric(optical("outerGlowRimAlpha"), 0.16);

    const warmColor =
      material("frame", "haloWarm");

    const coldColor =
      material("frame", "haloCold");

    const centerX =
      layout.centerX;

    const centerY =
      layout.centerY + layout.scaleY * 0.02;

    const radiusX =
      layout.scaleX * 0.88 * spread;

    const radiusY =
      layout.scaleY * 0.95 * spread;

    context.save();

    context.globalCompositeOperation =
      "screen";

    context.filter =
      `blur(${blur}px)`;

    const radial =
      context.createRadialGradient(
        centerX,
        centerY,
        radiusX * 0.22,
        centerX,
        centerY,
        radiusX
      );

    radial.addColorStop(
      0,
      rgba(
        mixColor(warmColor, coldColor, 0.35),
        outerGlowAlpha * 0.055 * adjusted
      )
    );

    radial.addColorStop(
      0.58,
      rgba(
        warmColor,
        outerGlowAlpha * 0.20 * warmth * adjusted
      )
    );

    radial.addColorStop(
      0.76,
      rgba(
        coldColor,
        outerGlowAlpha * 0.18 * coldness * adjusted
      )
    );

    radial.addColorStop(
      1,
      "rgba(255, 255, 255, 0)"
    );

    context.beginPath();

    context.ellipse(
      centerX,
      centerY,
      radiusX,
      radiusY,
      0,
      0,
      Math.PI * 2
    );

    context.fillStyle =
      radial;

    context.fill();

    context.filter =
      "none";

    context.lineCap =
      "round";

    context.lineJoin =
      "round";

    state.geometry.frameBands
      .filter(band => band.tier === "outer-face")
      .forEach(
        band => {
          const projected =
            projectPolygon(band.points, layout);

          traceCurve(context, projected);

          context.strokeStyle =
            rgba(
              warmColor,
              rimAlpha * warmth * adjusted
            );

          context.lineWidth =
            lineWidth(8.4);

          context.shadowBlur =
            lineWidth(16) * adjusted;

          context.shadowColor =
            rgba(
              warmColor,
              0.22 * warmth * adjusted
            );

          context.stroke();

          traceCurve(context, projected);

          context.strokeStyle =
            rgba(
              coldColor,
              rimAlpha * coldness * adjusted
            );

          context.lineWidth =
            lineWidth(4.8);

          context.shadowBlur =
            lineWidth(10) * adjusted;

          context.shadowColor =
            rgba(
              coldColor,
              0.18 * coldness * adjusted
            );

          context.stroke();
        }
      );

    context.shadowBlur =
      0;

    context.restore();
  }

  function drawObjectLocalShadow(context, layout, amount) {
    const profile =
      getDefinitionProfile();

    const adjusted =
      amount *
      numeric(profile.densityMultiplier, 1);

    if (adjusted <= 0.035) {
      return;
    }

    context.save();

    context.globalAlpha =
      adjusted;

    const centerX =
      layout.centerX;

    const centerY =
      layout.centerY + layout.scaleY * 0.065;

    const radiusX =
      layout.scaleX * 0.82;

    const radiusY =
      layout.scaleY * 0.88;

    const gradient =
      context.createRadialGradient(
        centerX,
        centerY,
        radiusX * 0.20,
        centerX,
        centerY,
        radiusX
      );

    const shadowAlpha =
      numeric(optical("objectShadowAlpha"), 0.08);

    gradient.addColorStop(
      0,
      `rgba(0, 0, 0, ${0.006 * adjusted})`
    );

    gradient.addColorStop(
      0.58,
      `rgba(0, 0, 0, ${0.024 * adjusted})`
    );

    gradient.addColorStop(
      1,
      `rgba(0, 0, 0, ${shadowAlpha * adjusted})`
    );

    context.beginPath();

    context.ellipse(
      centerX,
      centerY,
      radiusX,
      radiusY,
      0,
      0,
      Math.PI * 2
    );

    context.fillStyle =
      gradient;

    context.filter =
      `blur(${lineWidth(numeric(optical("objectShadowBlur"), 11))}px)`;

    context.fill();

    context.filter =
      "none";

    context.restore();
  }

  function drawFrameBand(context, band, layout, amount) {
    if (amount <= 0.002) {
      return;
    }

    const profile =
      getDefinitionProfile();

    const adjusted =
      amount *
      numeric(profile.densityMultiplier, 1) *
      numeric(profile.frameContrastMultiplier, 0.88);

    const frameGoldAccent =
      numeric(optical("frameGoldAccent"), 0.32);

    const frameColdAccent =
      numeric(optical("frameColdAccent"), 0.20);

    const framePatina =
      numeric(optical("framePatina"), numeric(optical("patinaIntensity"), 0.22));

    const projected =
      projectPolygon(band.points, layout);

    context.save();

    context.globalAlpha =
      adjusted;

    if (band.tier === "mullion-hairline") {
      tracePolygon(context, projected);

      context.fillStyle =
        rgba(material("lead", "goldHairline"), 0.36 * adjusted);

      context.shadowBlur =
        lineWidth(3) * adjusted;

      context.shadowColor =
        rgba(material("aperture", "chromeGold"), 0.18 * adjusted);

      context.fill();

      context.shadowBlur =
        0;

      context.restore();

      return;
    }

    if (
      band.tier === "mullion" ||
      band.tier === "cap"
    ) {
      tracePolygon(context, projected);

      const box =
        boundsOf(projected);

      const gradient =
        context.createLinearGradient(
          box.minX,
          box.minY,
          box.maxX,
          box.maxY
        );

      gradient.addColorStop(0, rgba(material("frame", "shadow"), 0.48));
      gradient.addColorStop(0.26, rgba(material("frame", "body"), 0.62));
      gradient.addColorStop(0.48, rgba(material("frame", "patina"), 0.12 * framePatina));
      gradient.addColorStop(0.62, rgba(material("frame", "bevel"), 0.32));
      gradient.addColorStop(0.82, rgba(material("frame", "gold"), 0.18 * frameGoldAccent));
      gradient.addColorStop(1, rgba(material("frame", "shadow"), 0.52));

      context.fillStyle =
        gradient;

      context.shadowBlur =
        lineWidth(3) * adjusted;

      context.shadowColor =
        `rgba(0, 0, 0, ${0.14 * adjusted})`;

      context.fill();

      context.shadowBlur =
        0;

      tracePolygon(context, projected);

      context.strokeStyle =
        rgba(material("frame", "goldBright"), 0.14 * frameGoldAccent * adjusted);

      context.lineWidth =
        lineWidth(0.78);

      context.stroke();

      context.restore();

      return;
    }

    context.lineCap =
      "round";

    context.lineJoin =
      "round";

    if (band.tier === "outer-back") {
      traceCurve(context, projected);

      context.shadowBlur =
        lineWidth(numeric(optical("frameShadowBlur"), 9)) * adjusted;

      context.shadowColor =
        `rgba(0, 0, 0, ${0.16 * adjusted})`;

      context.strokeStyle =
        rgba(material("frame", "shadow"), 0.42 * adjusted);

      context.lineWidth =
        lineWidth(band.width + 4);

      context.stroke();

      context.shadowBlur =
        0;
    }

    if (band.tier === "outer-face") {
      traceCurve(context, projected);

      context.strokeStyle =
        rgba(material("frame", "black"), 0.50 * adjusted);

      context.lineWidth =
        lineWidth(band.width + 2);

      context.stroke();

      traceCurve(context, projected);

      context.strokeStyle =
        rgba(
          mixColor(
            material("frame", "body"),
            material("frame", "patina"),
            framePatina * 0.28
          ),
          0.62 * adjusted
        );

      context.lineWidth =
        lineWidth(band.width * 0.90);

      context.stroke();

      traceCurve(context, projected);

      context.strokeStyle =
        rgba(material("frame", "patina"), 0.16 * framePatina * adjusted);

      context.lineWidth =
        lineWidth(band.width * 0.42);

      context.stroke();

      traceCurve(context, projected);

      context.strokeStyle =
        rgba(material("frame", "verdigris"), 0.06 * framePatina * adjusted);

      context.lineWidth =
        lineWidth(band.width * 0.24);

      context.stroke();

      traceCurve(context, projected);

      context.strokeStyle =
        rgba(material("frame", "gold"), 0.22 * frameGoldAccent * adjusted);

      context.lineWidth =
        lineWidth(BASE_RENDER.outerFrameLipWidth);

      context.stroke();

      traceCurve(context, projected);

      context.strokeStyle =
        rgba(material("frame", "goldBright"), 0.18 * frameGoldAccent * adjusted);

      context.lineWidth =
        lineWidth(0.86);

      context.stroke();

      traceCurve(context, projected);

      context.strokeStyle =
        rgba(material("frame", "coldEdge"), 0.16 * frameColdAccent * adjusted);

      context.lineWidth =
        lineWidth(0.78);

      context.stroke();
    }

    if (band.tier === "inner-lip") {
      traceCurve(context, projected);

      context.strokeStyle =
        rgba(material("frame", "shadow"), 0.38 * adjusted);

      context.lineWidth =
        lineWidth(band.width + 3);

      context.stroke();

      traceCurve(context, projected);

      context.strokeStyle =
        rgba(
          mixColor(
            material("frame", "body"),
            material("frame", "oldCopper"),
            framePatina * 0.18
          ),
          0.56 * adjusted
        );

      context.lineWidth =
        lineWidth(band.width * 0.84);

      context.stroke();

      traceCurve(context, projected);

      context.strokeStyle =
        rgba(material("frame", "gold"), 0.28 * frameGoldAccent * adjusted);

      context.lineWidth =
        lineWidth(BASE_RENDER.innerFrameLipWidth);

      context.stroke();

      traceCurve(context, projected);

      context.strokeStyle =
        rgba(material("frame", "goldBright"), 0.18 * frameGoldAccent * adjusted);

      context.lineWidth =
        lineWidth(0.78);

      context.stroke();

      traceCurve(context, projected);

      context.strokeStyle =
        rgba(material("frame", "coldEdge"), 0.20 * frameColdAccent * adjusted);

      context.lineWidth =
        lineWidth(0.72);

      context.stroke();
    }

    context.restore();
  }

  function drawFrameBands(context, layout, amount) {
    state.geometry.frameBands
      .filter(band => band.tier === "outer-back")
      .forEach(band => drawFrameBand(context, band, layout, amount));

    state.geometry.frameBands
      .filter(band => band.tier === "outer-face")
      .forEach(band => drawFrameBand(context, band, layout, amount));

    state.geometry.frameBands
      .filter(band => band.tier === "inner-lip")
      .forEach(band => drawFrameBand(context, band, layout, amount));
  }

  function glassGradient(context, pane, projected, amount) {
    const visual =
      paneVisual(pane);

    const box =
      boundsOf(projected);

    const saturation =
      numeric(visual.saturation, numeric(optical("paneDefaultSaturation"), 1.12));

    const transmission =
      pane.id === "mid-center"
        ? numeric(optical("centerGlassTransmission"), 0.94)
        : numeric(visual.transmission, numeric(optical("glassTransmission"), 0.84));

    const paneAlpha =
      numeric(visual.alpha, numeric(optical("paneDefaultAlpha"), 0.34));

    const globalGlassAlpha =
      numeric(optical("glassAlpha"), 0.38);

    const age =
      numeric(visual.age, numeric(optical("paneDefaultAge"), 0.18)) *
      profileValue("ageMultiplier", 1);

    const patina =
      numeric(visual.patina, 0) +
      numeric(optical("patinaIntensity"), 0.22) * 0.16;

    const baseAlpha =
      paneAlpha *
      globalGlassAlpha *
      lerp(0.44, 0.18, clamp(transmission, 0, 1)) *
      amount;

    const color =
      glassColor(
        mixColor(
          visual.materialColor,
          material("glass", "ageWhite"),
          clamp(age * 0.08 + patina * 0.06, 0, 0.18)
        ),
        saturation,
        lerp(0.30, 0.52, clamp(transmission, 0, 1))
      );

    const bright =
      brightenColor(color, 0.42);

    const cold =
      brightenColor(material("aperture", "cold"), 0.24);

    const warm =
      brightenColor(material("aperture", "innerLight"), 0.18);

    const gradient =
      context.createLinearGradient(
        box.minX,
        box.minY,
        box.maxX,
        box.maxY
      );

    gradient.addColorStop(0, rgba(bright, baseAlpha * 0.34));
    gradient.addColorStop(0.18, rgba(color, baseAlpha * 0.76));
    gradient.addColorStop(0.42, rgba(brightenColor(color, 0.48), baseAlpha * 0.50));
    gradient.addColorStop(0.62, rgba(color, baseAlpha * 0.70));
    gradient.addColorStop(0.82, rgba(bright, baseAlpha * 0.42));
    gradient.addColorStop(1, rgba(cold, baseAlpha * 0.20 + numeric(visual.coldLight, 0) * 0.018 * amount));

    if (numeric(visual.warmLight, 0) > numeric(visual.coldLight, 0)) {
      gradient.addColorStop(
        0.52,
        rgba(warm, baseAlpha * 0.24 + numeric(visual.warmLight, 0) * 0.020 * amount)
      );
    }

    return gradient;
  }

  function drawGlassBacklight(context, pane, projected, amount) {
    const visual =
      paneVisual(pane);

    const box =
      boundsOf(projected);

    const width =
      Math.max(1, box.maxX - box.minX);

    const height =
      Math.max(1, box.maxY - box.minY);

    const transmission =
      pane.id === "mid-center"
        ? numeric(optical("centerGlassTransmission"), 0.94)
        : numeric(visual.transmission, numeric(optical("glassTransmission"), 0.84));

    const glow =
      numeric(visual.glow, numeric(optical("paneDefaultGlow"), 0.26)) *
      profileValue("paneGlowMultiplier", 1);

    const coldLight =
      numeric(visual.coldLight, numeric(optical("paneDefaultColdLight"), 0.26));

    const warmLight =
      numeric(visual.warmLight, numeric(optical("paneDefaultWarmLight"), 0.10));

    const saturation =
      numeric(visual.saturation, numeric(optical("paneDefaultSaturation"), 1.12));

    const color =
      glassColor(
        visual.materialColor,
        saturation,
        0.52
      );

    context.save();

    tracePolygon(context, projected);
    context.clip();

    context.globalCompositeOperation =
      "screen";

    const backlight =
      context.createRadialGradient(
        box.minX + width * 0.48,
        box.minY + height * 0.40,
        1,
        box.minX + width * 0.50,
        box.minY + height * 0.52,
        Math.max(width, height) * 0.86
      );

    backlight.addColorStop(
      0,
      rgba(
        brightenColor(color, 0.56),
        (0.18 + transmission * 0.28 + glow * 0.20) * amount
      )
    );

    backlight.addColorStop(
      0.46,
      rgba(
        color,
        (0.08 + transmission * 0.15 + glow * 0.12) * amount
      )
    );

    backlight.addColorStop(
      0.76,
      rgba(
        coldLight >= warmLight
          ? brightenColor(material("aperture", "cold"), 0.14)
          : brightenColor(material("aperture", "innerLight"), 0.10),
        (0.035 + Math.max(coldLight, warmLight) * 0.10) * amount
      )
    );

    backlight.addColorStop(
      1,
      "rgba(255, 255, 255, 0)"
    );

    context.fillStyle =
      backlight;

    context.fillRect(
      box.minX,
      box.minY,
      width,
      height
    );

    const linear =
      context.createLinearGradient(
        box.minX,
        box.maxY,
        box.maxX,
        box.minY
      );

    linear.addColorStop(
      0,
      rgba(
        warmLight >= coldLight
          ? brightenColor(material("aperture", "innerLight"), 0.20)
          : brightenColor(material("aperture", "cold"), 0.18),
        0.060 * transmission * amount
      )
    );

    linear.addColorStop(
      0.55,
      rgba(
        brightenColor(color, 0.40),
        0.038 * amount
      )
    );

    linear.addColorStop(
      1,
      "rgba(255, 255, 255, 0)"
    );

    context.fillStyle =
      linear;

    context.fillRect(
      box.minX,
      box.minY,
      width,
      height
    );

    context.restore();
  }

  function drawGlassSidewalls(context, pane, layout, amount) {
    const visual =
      paneVisual(pane);

    const rear =
      projectPolygon(
        pane.points,
        layout,
        pane.rearZ - pane.coreZ
      );

    const face =
      projectPolygon(
        pane.points,
        layout,
        pane.faceZ - pane.coreZ
      );

    const sideColor =
      glassColor(
        visual.materialColor,
        numeric(visual.saturation, 1.10),
        0.24
      );

    context.save();

    context.globalAlpha =
      amount;

    context.globalCompositeOperation =
      "screen";

    for (
      let index = 0;
      index < face.length;
      index += 1
    ) {
      const next =
        (index + 1) % face.length;

      context.beginPath();

      context.moveTo(rear[index].x, rear[index].y);
      context.lineTo(rear[next].x, rear[next].y);
      context.lineTo(face[next].x, face[next].y);
      context.lineTo(face[index].x, face[index].y);

      context.closePath();

      context.fillStyle =
        rgba(sideColor, 0.026 * amount);

      context.fill();
    }

    context.restore();
  }

  function drawGlassTexture(context, pane, projected, amount) {
    const visual =
      paneVisual(pane);

    const box =
      boundsOf(projected);

    const width =
      Math.max(1, box.maxX - box.minX);

    const height =
      Math.max(1, box.maxY - box.minY);

    const age =
      numeric(visual.age, numeric(optical("paneDefaultAge"), 0.18)) *
      profileValue("ageMultiplier", 1);

    const refraction =
      numeric(visual.refraction, numeric(optical("paneDefaultRefraction"), 0.42));

    const edgeLight =
      numeric(visual.edgeLight, numeric(optical("paneDefaultEdgeLight"), 0.28));

    const jewelDepth =
      numeric(visual.jewelDepth, numeric(optical("paneDefaultJewelDepth"), 0.28));

    context.save();

    tracePolygon(context, projected);
    context.clip();

    context.globalCompositeOperation =
      "screen";

    const haze =
      context.createRadialGradient(
        box.minX + width * 0.32,
        box.minY + height * 0.20,
        1,
        box.minX + width * 0.48,
        box.minY + height * 0.42,
        Math.max(width, height) * 0.88
      );

    haze.addColorStop(
      0,
      `rgba(255, 255, 255, ${0.16 * refraction * amount})`
    );

    haze.addColorStop(
      0.34,
      `rgba(255, 255, 255, ${0.050 * amount})`
    );

    haze.addColorStop(
      1,
      "rgba(255, 255, 255, 0)"
    );

    context.fillStyle =
      haze;

    context.fillRect(box.minX, box.minY, width, height);

    const lowerGlow =
      context.createLinearGradient(
        box.minX,
        box.maxY,
        box.maxX,
        box.minY
      );

    lowerGlow.addColorStop(
      0,
      rgba(material("aperture", "innerLight"), 0.035 * amount)
    );

    lowerGlow.addColorStop(
      0.55,
      rgba(material("aperture", "cold"), 0.030 * amount)
    );

    lowerGlow.addColorStop(
      1,
      "rgba(255, 255, 255, 0)"
    );

    context.fillStyle =
      lowerGlow;

    context.fillRect(box.minX, box.minY, width, height);

    context.globalCompositeOperation =
      "source-over";

    context.lineWidth =
      lineWidth(0.48);

    const textureLineCount =
      Math.max(0, Math.floor(numeric(optical("textureLineCount"), 3)));

    for (
      let index = 0;
      index < textureLineCount;
      index += 1
    ) {
      const seed =
        numeric(visual.phase, pane.phase || 0) * 19.31 +
        index * 7.17;

      const x =
        box.minX +
        width *
          (
            0.10 +
            0.78 *
              (Math.sin(seed) * 0.5 + 0.5)
          );

      const y =
        box.minY +
        height *
          (
            0.08 +
            0.76 *
              (Math.sin(seed * 1.37) * 0.5 + 0.5)
          );

      context.beginPath();

      context.moveTo(x, y);

      context.bezierCurveTo(
        x + Math.sin(seed * 0.83) * width * 0.10,
        y + height * 0.18,
        x + Math.cos(seed * 0.59) * width * 0.14,
        y + height * 0.44,
        x + Math.sin(seed * 1.03) * width * 0.07,
        y + height * 0.76
      );

      context.strokeStyle =
        `rgba(255, 255, 255, ${0.030 * Math.max(0.12, age) * amount})`;

      context.stroke();
    }

    drawGlassScratches(context, pane, box, amount, age);

    tracePolygon(context, projected);

    context.strokeStyle =
      `rgba(255, 255, 255, ${0.072 * edgeLight * amount})`;

    context.lineWidth =
      lineWidth(0.78);

    context.stroke();

    tracePolygon(context, projected);

    context.strokeStyle =
      `rgba(0, 0, 0, ${0.018 * jewelDepth * amount})`;

    context.lineWidth =
      lineWidth(0.38);

    context.stroke();

    context.restore();
  }

  function drawGlassScratches(context, pane, box, amount, age) {
    const visual =
      paneVisual(pane);

    const scratchLineCount =
      Math.max(0, Math.floor(numeric(optical("scratchLineCount"), 7)));

    if (
      scratchLineCount <= 0 ||
      amount <= 0.002
    ) {
      return;
    }

    const width =
      Math.max(1, box.maxX - box.minX);

    const height =
      Math.max(1, box.maxY - box.minY);

    const scratchAlpha =
      numeric(optical("scratchAlpha"), 0.18) *
      numeric(visual.scratch, 0.22) *
      Math.max(0.18, age);

    const scratchLength =
      numeric(optical("scratchLength"), 0.62);

    context.save();

    context.globalCompositeOperation =
      "screen";

    context.lineCap =
      "round";

    for (
      let index = 0;
      index < scratchLineCount;
      index += 1
    ) {
      const seed =
        numeric(visual.phase, pane.phase || 0) * 31.91 +
        index * 11.47;

      const x =
        box.minX +
        width *
          (
            0.08 +
            0.84 *
            (Math.sin(seed) * 0.5 + 0.5)
          );

      const y =
        box.minY +
        height *
          (
            0.10 +
            0.80 *
            (Math.cos(seed * 0.73) * 0.5 + 0.5)
          );

      const length =
        width *
        (
          0.05 +
          scratchLength * 0.10 *
          (Math.sin(seed * 1.13) * 0.5 + 0.5)
        );

      const tilt =
        -0.70 +
        (Math.sin(seed * 0.41) * 0.5 + 0.5) * 1.40;

      context.beginPath();

      context.moveTo(
        x - Math.cos(tilt) * length * 0.5,
        y - Math.sin(tilt) * length * 0.5
      );

      context.lineTo(
        x + Math.cos(tilt) * length * 0.5,
        y + Math.sin(tilt) * length * 0.5
      );

      context.strokeStyle =
        rgba(
          material("glass", "scratchWhite"),
          scratchAlpha * amount *
          (
            0.35 +
            0.65 *
            (Math.sin(seed * 2.07) * 0.5 + 0.5)
          )
        );

      context.lineWidth =
        lineWidth(
          0.22 +
          0.22 *
          (Math.sin(seed * 3.11) * 0.5 + 0.5)
        );

      context.stroke();
    }

    context.restore();
  }

  function drawGlassPane(context, pane, layout, amount) {
    if (amount <= 0.002) {
      return;
    }

    const profile =
      getDefinitionProfile();

    const adjusted =
      amount *
      numeric(profile.densityMultiplier, 1);

    const face =
      projectPolygon(
        pane.points,
        layout,
        pane.faceZ - pane.coreZ
      );

    const visual =
      paneVisual(pane);

    drawGlassBacklight(context, pane, face, adjusted);
    drawGlassSidewalls(context, pane, layout, adjusted);

    context.save();

    tracePolygon(context, face);

    context.globalCompositeOperation =
      "screen";

    context.shadowBlur =
      lineWidth(7.5) * adjusted;

    context.shadowColor =
      rgba(
        glassColor(
          visual.materialColor,
          numeric(visual.saturation, 1.14),
          0.40
        ),
        0.16 * adjusted
      );

    context.fillStyle =
      glassGradient(context, pane, face, adjusted);

    context.fill();

    context.shadowBlur =
      0;

    context.globalCompositeOperation =
      "source-over";

    tracePolygon(context, face);

    context.strokeStyle =
      `rgba(255, 255, 255, ${0.10 * adjusted})`;

    context.lineWidth =
      lineWidth(0.72);

    context.stroke();

    tracePolygon(context, face);

    context.strokeStyle =
      rgba(material("aperture", "cold"), 0.046 * adjusted);

    context.lineWidth =
      lineWidth(0.42);

    context.stroke();

    drawGlassTexture(context, pane, face, adjusted);

    context.restore();
  }

  function drawGlassPanes(context, layout, amount) {
    state.geometry.panes.forEach(
      pane => drawGlassPane(context, pane, layout, amount)
    );
  }

  function drawCameSegment(context, segment, layout, amount) {
    if (amount <= 0.002) {
      return;
    }

    const profile =
      getDefinitionProfile();

    const adjusted =
      amount *
      numeric(profile.densityMultiplier, 1) *
      numeric(optical("leadContrast"), 0.74);

    const leadHighlight =
      numeric(optical("leadHighlight"), 0.28);

    const leadPatina =
      numeric(optical("leadPatina"), numeric(optical("patinaIntensity"), 0.18));

    const side =
      projectPolygon(
        segment.points,
        layout,
        DEPTH.cameSide - DEPTH.cameFace
      );

    const face =
      projectPolygon(segment.points, layout, 0);

    context.save();

    context.lineCap =
      "round";

    context.lineJoin =
      "round";

    context.globalAlpha =
      adjusted;

    context.beginPath();
    context.moveTo(side[0].x, side[0].y);
    context.lineTo(side[1].x, side[1].y);

    context.strokeStyle =
      rgba(material("lead", "shadow"), 0.42 * adjusted);

    context.lineWidth =
      lineWidth(BASE_RENDER.cameSideWidth * 0.82);

    context.stroke();

    context.beginPath();
    context.moveTo(face[0].x, face[0].y);
    context.lineTo(face[1].x, face[1].y);

    context.strokeStyle =
      rgba(material("lead", "dark"), 0.54 * adjusted);

    context.lineWidth =
      lineWidth(BASE_RENDER.cameWidth * 0.88);

    context.stroke();

    context.beginPath();
    context.moveTo(face[0].x, face[0].y);
    context.lineTo(face[1].x, face[1].y);

    context.strokeStyle =
      rgba(
        mixColor(
          material("lead", "body"),
          material("lead", "patina"),
          leadPatina * 0.24
        ),
        0.56 * adjusted
      );

    context.lineWidth =
      lineWidth(BASE_RENDER.cameWidth * 0.64);

    context.stroke();

    context.beginPath();
    context.moveTo(face[0].x, face[0].y);
    context.lineTo(face[1].x, face[1].y);

    context.strokeStyle =
      rgba(material("lead", "highlight"), leadHighlight * adjusted);

    context.lineWidth =
      lineWidth(BASE_RENDER.cameHighlightWidth * 1.10);

    context.stroke();

    context.beginPath();
    context.moveTo(face[0].x, face[0].y);
    context.lineTo(face[1].x, face[1].y);

    context.strokeStyle =
      rgba(material("lead", "goldHairline"), 0.060 * adjusted);

    context.lineWidth =
      lineWidth(0.42);

    context.stroke();

    context.restore();
  }

  function drawLeadCame(context, layout, amount) {
    state.geometry.cameSegments.forEach(
      segment => drawCameSegment(context, segment, layout, amount)
    );
  }

  function drawMullionsAndCaps(context, layout, amount) {
    state.geometry.frameBands
      .filter(
        band =>
          band.tier === "mullion" ||
          band.tier === "mullion-hairline" ||
          band.tier === "cap"
      )
      .forEach(
        band => drawFrameBand(context, band, layout, amount)
      );
  }

  function drawApertureGlow(context, layout, amount) {
    if (amount <= 0.002) {
      return;
    }

    const profile =
      getDefinitionProfile();

    const adjusted =
      amount *
      numeric(profile.apertureMultiplier, 1);

    const glow =
      projectPolygon(state.geometry.aperture.glow, layout);

    const box =
      boundsOf(glow);

    const centerX =
      (box.minX + box.maxX) / 2;

    const centerY =
      (box.minY + box.maxY) / 2;

    const radius =
      Math.max(
        box.maxX - box.minX,
        box.maxY - box.minY
      ) * 0.62;

    context.save();

    context.globalCompositeOperation =
      "screen";

    const gradient =
      context.createRadialGradient(
        centerX,
        centerY,
        radius * 0.10,
        centerX,
        centerY,
        radius
      );

    const glowAlpha =
      numeric(optical("apertureGlowAlpha"), 0.42);

    const goldDominance =
      numeric(optical("apertureGoldDominance"), 0.64);

    const coldCounterlight =
      numeric(optical("apertureColdCounterlight"), 0.28);

    gradient.addColorStop(
      0,
      rgba(material("aperture", "whiteGold"), glowAlpha * 0.42 * adjusted)
    );

    gradient.addColorStop(
      0.32,
      rgba(material("aperture", "chromeGold"), glowAlpha * 0.28 * goldDominance * adjusted)
    );

    gradient.addColorStop(
      0.58,
      rgba(material("aperture", "coldEdge"), glowAlpha * 0.18 * coldCounterlight * adjusted)
    );

    gradient.addColorStop(
      1,
      "rgba(255, 255, 255, 0)"
    );

    context.fillStyle =
      gradient;

    tracePolygon(context, glow);
    context.fill();

    context.restore();
  }

  function drawApertureClear(context, layout, amount) {
    if (amount <= 0.002) {
      return;
    }

    const clear =
      projectPolygon(state.geometry.aperture.clear, layout);

    context.save();

    context.globalCompositeOperation =
      "destination-out";

    tracePolygon(context, clear);

    context.fillStyle =
      "rgba(0, 0, 0, 1)";

    context.fill();

    context.restore();
  }

  function drawApertureInnerLight(context, layout, amount) {
    if (amount <= 0.002) {
      return;
    }

    const profile =
      getDefinitionProfile();

    const adjusted =
      amount *
      numeric(profile.apertureMultiplier, 1);

    const clear =
      projectPolygon(state.geometry.aperture.clear, layout);

    const box =
      boundsOf(clear);

    const centerX =
      (box.minX + box.maxX) / 2;

    const centerY =
      (box.minY + box.maxY) / 2;

    const radius =
      Math.max(
        box.maxX - box.minX,
        box.maxY - box.minY
      ) * 0.76;

    context.save();

    context.globalCompositeOperation =
      "screen";

    tracePolygon(context, clear);
    context.clip();

    const gradient =
      context.createRadialGradient(
        centerX,
        centerY,
        radius * 0.05,
        centerX,
        centerY,
        radius
      );

    const innerAlpha =
      numeric(optical("apertureInnerGlowAlpha"), 0.30);

    gradient.addColorStop(
      0,
      rgba(material("aperture", "whiteGold"), innerAlpha * adjusted)
    );

    gradient.addColorStop(
      0.44,
      rgba(material("aperture", "innerLight"), innerAlpha * 0.42 * adjusted)
    );

    gradient.addColorStop(
      0.72,
      rgba(material("aperture", "cold"), innerAlpha * 0.24 * adjusted)
    );

    gradient.addColorStop(
      1,
      "rgba(255, 255, 255, 0)"
    );

    context.fillStyle =
      gradient;

    context.fillRect(
      box.minX,
      box.minY,
      box.maxX - box.minX,
      box.maxY - box.minY
    );

    context.restore();
  }

  function drawApertureBevel(context, layout, amount) {
    if (amount <= 0.002) {
      return;
    }

    const profile =
      getDefinitionProfile();

    const adjusted =
      amount *
      numeric(profile.apertureMultiplier, 1);

    const outer =
      projectPolygon(state.geometry.aperture.outer, layout);

    const middle =
      projectPolygon(state.geometry.aperture.middle, layout);

    const inner =
      projectPolygon(state.geometry.aperture.inner, layout);

    context.save();

    context.lineJoin =
      "round";

    context.lineCap =
      "round";

    tracePolygon(context, outer);

    context.strokeStyle =
      rgba(material("aperture", "wall"), 0.68 * adjusted);

    context.lineWidth =
      lineWidth(BASE_RENDER.apertureWallWidth);

    context.shadowBlur =
      lineWidth(5) * adjusted;

    context.shadowColor =
      `rgba(0, 0, 0, ${0.20 * adjusted})`;

    context.stroke();

    context.shadowBlur =
      0;

    tracePolygon(context, outer);

    context.strokeStyle =
      rgba(material("aperture", "deepBronze"), 0.70 * adjusted);

    context.lineWidth =
      lineWidth(BASE_RENDER.apertureFaceWidth + 2.0);

    context.stroke();

    tracePolygon(context, outer);

    context.strokeStyle =
      rgba(material("aperture", "bronze"), 0.52 * adjusted);

    context.lineWidth =
      lineWidth(BASE_RENDER.apertureFaceWidth);

    context.stroke();

    tracePolygon(context, middle);

    context.strokeStyle =
      rgba(material("aperture", "gold"), 0.66 * adjusted);

    context.lineWidth =
      lineWidth(BASE_RENDER.apertureChromeWidth);

    context.stroke();

    tracePolygon(context, middle);

    context.strokeStyle =
      rgba(material("aperture", "chromeGold"), 0.48 * adjusted);

    context.lineWidth =
      lineWidth(BASE_RENDER.apertureChromeWidth * 0.56);

    context.stroke();

    tracePolygon(context, inner);

    context.strokeStyle =
      rgba(material("aperture", "bright"), 0.46 * adjusted);

    context.lineWidth =
      lineWidth(BASE_RENDER.apertureLipWidth);

    context.stroke();

    tracePolygon(context, inner);

    context.strokeStyle =
      rgba(material("aperture", "whiteGold"), 0.24 * adjusted);

    context.lineWidth =
      lineWidth(0.85);

    context.stroke();

    tracePolygon(context, inner);

    context.strokeStyle =
      rgba(material("aperture", "cold"), 0.18 * adjusted);

    context.lineWidth =
      lineWidth(0.66);

    context.stroke();

    context.restore();

    drawApertureSpeculars(context, layout, adjusted);
  }

  function drawApertureSpeculars(context, layout, amount) {
    if (
      amount <= 0.002 ||
      !state.geometry.aperture.specular
    ) {
      return;
    }

    context.save();

    context.globalCompositeOperation =
      "screen";

    const specularAlpha =
      numeric(optical("apertureSpecularAlpha"), 0.72);

    state.geometry.aperture.specular.forEach(
      (shape, index) => {
        const projected =
          projectPolygon(shape, layout);

        tracePolygon(context, projected);

        const box =
          boundsOf(projected);

        const gradient =
          context.createLinearGradient(
            box.minX,
            box.maxY,
            box.maxX,
            box.minY
          );

        gradient.addColorStop(
          0,
          rgba(material("aperture", "chromeGold"), 0.05 * amount)
        );

        gradient.addColorStop(
          0.45,
          rgba(material("aperture", "whiteGold"), specularAlpha * amount)
        );

        gradient.addColorStop(
          1,
          rgba(material("aperture", "cold"), 0.12 * amount)
        );

        context.fillStyle =
          gradient;

        context.shadowBlur =
          lineWidth(index === 0 ? 4 : 2.5) * amount;

        context.shadowColor =
          rgba(material("aperture", "chromeGold"), 0.22 * amount);

        context.fill();

        context.shadowBlur =
          0;
      }
    );

    context.restore();
  }

  function drawSurfaceAge(context, layout, amount) {
    if (amount <= 0.05) {
      return;
    }

    const profile =
      getDefinitionProfile();

    const adjusted =
      amount *
      numeric(profile.densityMultiplier, 1) *
      numeric(profile.ageMultiplier, 1);

    const speckCount =
      Math.max(0, Math.floor(numeric(optical("textureSpeckCount"), 16)));

    const patinaSpeckCount =
      Math.max(0, Math.floor(numeric(optical("patinaSpeckCount"), 18)));

    const patinaIntensity =
      numeric(optical("patinaIntensity"), 0.22);

    context.save();

    context.globalCompositeOperation =
      "screen";

    for (
      let index = 0;
      index < speckCount;
      index += 1
    ) {
      const seed =
        index * 15.873;

      const x =
        layout.centerX +
        Math.sin(seed) * layout.scaleX * 0.74 +
        Math.sin(seed * 0.31) * layout.scaleX * 0.08;

      const y =
        layout.centerY +
        Math.cos(seed * 0.79) * layout.scaleY * 0.83;

      const radius =
        lineWidth(
          0.18 +
          (Math.sin(seed * 2.31) * 0.5 + 0.5) * 0.32
        );

      context.beginPath();

      context.arc(
        x,
        y,
        radius,
        0,
        Math.PI * 2
      );

      context.fillStyle =
        `rgba(245, 238, 208, ${0.008 * adjusted})`;

      context.fill();
    }

    context.globalCompositeOperation =
      "source-over";

    for (
      let index = 0;
      index < patinaSpeckCount;
      index += 1
    ) {
      const seed =
        index * 21.119;

      const x =
        layout.centerX +
        Math.sin(seed) * layout.scaleX * 0.84;

      const y =
        layout.centerY +
        Math.cos(seed * 0.67) * layout.scaleY * 0.92;

      const radius =
        lineWidth(
          0.24 +
          (Math.sin(seed * 1.91) * 0.5 + 0.5) * 0.42
        );

      context.beginPath();

      context.arc(
        x,
        y,
        radius,
        0,
        Math.PI * 2
      );

      context.fillStyle =
        rgba(
          material("frame", "verdigris"),
          0.010 * patinaIntensity * adjusted
        );

      context.fill();
    }

    context.restore();
  }

  function drawCurtainObject() {
    if (
      !state.context ||
      !state.geometry
    ) {
      return false;
    }

    resize();

    state.curtainAmount =
      clamp(state.curtainAmount, 0, 1);

    if (isCurtainHidden()) {
      state.curtainAmount =
        0;

      hideCanvasForCurtain();

      return false;
    }

    showCanvasForCurtain();
    clearCanvas();

    const profile =
      getDefinitionProfile();

    const amount =
      state.curtainAmount *
      numeric(profile.opacityMultiplier, 1);

    const context =
      state.context;

    const layout =
      makeLayout();

    context.save();

    context.scale(
      state.pixelRatio,
      state.pixelRatio
    );

    drawObjectOuterGlow(context, layout, amount);
    drawObjectLocalShadow(context, layout, amount * 0.56);
    drawFrameBands(context, layout, amount * 0.86);
    drawGlassPanes(context, layout, amount);
    drawLeadCame(context, layout, amount * 0.74);
    drawMullionsAndCaps(context, layout, amount * 0.84);
    drawApertureGlow(context, layout, amount);
    drawApertureClear(context, layout, amount);
    drawApertureInnerLight(context, layout, amount);
    drawApertureBevel(context, layout, amount);
    drawSurfaceAge(context, layout, amount);

    context.restore();

    state.lastRenderTime =
      performance.now();

    return true;
  }

  function render() {
    if (
      state.disposed ||
      state.failed ||
      !state.initialized
    ) {
      return false;
    }

    if (isCurtainHidden()) {
      handleHiddenResizeOrRender();

      updateReceipt({
        lastAction:
          "window-object-render-hidden-suppressed",

        curtainAmount:
          0,

        canvasDormant:
          true,

        lastFailure:
          null
      });

      return true;
    }

    drawCurtainObject();

    updateReceipt({
      lastAction:
        "window-object-rendered-luminous-aged-glass-with-halo",

      lastFailure:
        null
    });

    dispatch(
      EVENTS.RENDERED,
      {
        curtainAmount:
          state.curtainAmount,

        receipt:
          getReceipt()
      }
    );

    return true;
  }

  function transitionStep(now) {
    state.raf =
      0;

    if (
      !state.transition ||
      state.disposed ||
      state.failed
    ) {
      state.running =
        false;

      return;
    }

    const transition =
      state.transition;

    const elapsed =
      now - transition.startTime;

    const raw =
      clamp(
        elapsed / transition.duration,
        0,
        1
      );

    const eased =
      transition.to > transition.from
        ? easeInOutCubic(raw)
        : easeOutCubic(raw);

    state.curtainAmount =
      lerp(
        transition.from,
        transition.to,
        eased
      );

    if (
      transition.to <= 0 &&
      state.curtainAmount <= VISIBILITY.transitionHiddenCutoff
    ) {
      state.curtainAmount =
        0;

      const completed =
        state.transition;

      state.transition =
        null;

      state.running =
        false;

      hideCanvasForCurtain();

      updateReceipt({
        lastAction:
          "window-object-curtain-hidden-dormant",

        transitionId:
          completed.id,

        transitionTarget:
          completed.to,

        curtainAmount:
          0,

        canvasDormant:
          true,

        lastFailure:
          null
      });

      dispatch(
        EVENTS.TRANSITION_COMPLETE,
        {
          transitionId:
            completed.id,

          curtainAmount:
            state.curtainAmount,

          receipt:
            getReceipt()
        }
      );

      return;
    }

    drawCurtainObject();

    if (raw < 1) {
      state.raf =
        requestAnimationFrame(transitionStep);

      return;
    }

    state.curtainAmount =
      transition.to;

    const completed =
      state.transition;

    state.transition =
      null;

    state.running =
      false;

    if (completed.to <= 0.002) {
      state.curtainAmount =
        0;

      hideCanvasForCurtain();
    } else {
      showCanvasForCurtain();
      drawCurtainObject();
    }

    updateReceipt({
      lastAction:
        completed.to >= 1
          ? "window-object-curtain-shown"
          : "window-object-curtain-hidden-dormant",

      transitionId:
        completed.id,

      transitionTarget:
        completed.to,

      curtainAmount:
        state.curtainAmount,

      canvasDormant:
        isCurtainHidden(),

      lastFailure:
        null
    });

    dispatch(
      EVENTS.TRANSITION_COMPLETE,
      {
        transitionId:
          completed.id,

        curtainAmount:
          state.curtainAmount,

        receipt:
          getReceipt()
      }
    );
  }

  function startTransition(target, duration, reason) {
    if (
      state.disposed ||
      state.failed ||
      !state.initialized
    ) {
      return false;
    }

    const to =
      clamp(target, 0, 1);

    const from =
      clamp(state.curtainAmount, 0, 1);

    stopRenderLoop();

    if (to > 0) {
      showCanvasForCurtain();
    }

    const id =
      nowId("window-object-transition");

    state.transition =
      {
        id,
        from,
        to,

        startTime:
          performance.now(),

        duration:
          state.reducedMotion
            ? TIMING.reducedMs
            : Math.max(1, duration),

        reason:
          String(reason || "unspecified")
      };

    state.running =
      true;

    updateReceipt({
      lastAction:
        "window-object-transition-started",

      transitionId:
        id,

      transitionFrom:
        from,

      transitionTarget:
        to,

      transitionReason:
        state.transition.reason,

      lastFailure:
        null
    });

    dispatch(
      EVENTS.TRANSITION_START,
      {
        transitionId:
          id,

        from,
        to,

        reason:
          state.transition.reason,

        receipt:
          getReceipt()
      }
    );

    state.raf =
      requestAnimationFrame(transitionStep);

    return true;
  }

  function setCurtainAmount(value) {
    if (
      state.disposed ||
      state.failed ||
      !state.initialized
    ) {
      return false;
    }

    stopRenderLoop();

    state.transition =
      null;

    state.curtainAmount =
      clamp(value, 0, 1);

    if (isCurtainHidden()) {
      state.curtainAmount =
        0;

      hideCanvasForCurtain();

      updateReceipt({
        lastAction:
          "window-object-curtain-hidden-dormant-set",

        curtainAmount:
          0,

        canvasDormant:
          true,

        lastFailure:
          null
      });

      return true;
    }

    showCanvasForCurtain();
    drawCurtainObject();

    updateReceipt({
      lastAction:
        "window-object-curtain-amount-set",

      curtainAmount:
        state.curtainAmount,

      canvasDormant:
        false,

      lastFailure:
        null
    });

    return true;
  }

  function showCurtain(options = {}) {
    showCanvasForCurtain();

    return startTransition(
      1,
      Number.isFinite(options.duration)
        ? options.duration
        : TIMING.showMs,
      options.reason || "showCurtain"
    );
  }

  function hideCurtain(options = {}) {
    return startTransition(
      0,
      Number.isFinite(options.duration)
        ? options.duration
        : TIMING.hideMs,
      options.reason || "hideCurtain"
    );
  }

  function handleResizeFallback() {
    resize();

    if (isCurtainHidden()) {
      state.curtainAmount =
        0;

      hideCanvasForCurtain();
    } else {
      drawCurtainObject();
    }

    updateReceipt({
      lastAction:
        "window-object-resized",

      canvasDormant:
        isCurtainHidden()
    });
  }

  function bindResize() {
    if (
      state.resizeObserver ||
      state.resizeFallbackBound
    ) {
      return;
    }

    if (typeof ResizeObserver === "function") {
      state.resizeObserver =
        new ResizeObserver(
          () => {
            resize();

            if (isCurtainHidden()) {
              state.curtainAmount =
                0;

              hideCanvasForCurtain();
            } else {
              drawCurtainObject();
            }

            updateReceipt({
              lastAction:
                "window-object-resized",

              canvasDormant:
                isCurtainHidden()
            });
          }
        );

      state.resizeObserver.observe(state.mount);

      return;
    }

    state.resizeFallbackBound =
      true;

    globalThis.addEventListener(
      "resize",
      handleResizeFallback,
      {
        passive:
          true
      }
    );
  }

  function unbindResize() {
    if (state.resizeObserver) {
      state.resizeObserver.disconnect();

      state.resizeObserver =
        null;
    }

    if (state.resizeFallbackBound) {
      state.resizeFallbackBound =
        false;

      globalThis.removeEventListener(
        "resize",
        handleResizeFallback
      );
    }
  }

  function handleReducedMotionChange() {
    state.reducedMotion =
      Boolean(
        state.reducedMotionQuery &&
        state.reducedMotionQuery.matches
      );

    updateReceipt({
      lastAction:
        "window-object-reduced-motion-updated"
    });
  }

  function bindReducedMotion() {
    if (state.reducedMotionBound) {
      return;
    }

    state.reducedMotionBound =
      true;

    if (typeof globalThis.matchMedia === "function") {
      state.reducedMotionQuery =
        globalThis.matchMedia(
          "(prefers-reduced-motion: reduce)"
        );

      state.reducedMotion =
        Boolean(state.reducedMotionQuery.matches);

      if (
        typeof state.reducedMotionQuery.addEventListener === "function"
      ) {
        state.reducedMotionQuery.addEventListener(
          "change",
          handleReducedMotionChange
        );
      } else if (
        typeof state.reducedMotionQuery.addListener === "function"
      ) {
        state.reducedMotionQuery.addListener(
          handleReducedMotionChange
        );
      }
    }
  }

  function unbindReducedMotion() {
    if (!state.reducedMotionBound) {
      return;
    }

    state.reducedMotionBound =
      false;

    if (state.reducedMotionQuery) {
      if (
        typeof state.reducedMotionQuery.removeEventListener === "function"
      ) {
        state.reducedMotionQuery.removeEventListener(
          "change",
          handleReducedMotionChange
        );
      } else if (
        typeof state.reducedMotionQuery.removeListener === "function"
      ) {
        state.reducedMotionQuery.removeListener(
          handleReducedMotionChange
        );
      }
    }

    state.reducedMotionQuery =
      null;
  }

  function dispose() {
    if (state.disposed) {
      return true;
    }

    stopRenderLoop();
    unbindResize();
    unbindReducedMotion();

    if (
      state.createdCanvas &&
      state.canvas
    ) {
      state.canvas.remove();
    } else if (state.canvas) {
      const context =
        state.canvas.getContext("2d");

      if (context) {
        context.clearRect(
          0,
          0,
          state.canvas.width,
          state.canvas.height
        );
      }

      state.canvas.style.opacity =
        "0";

      state.canvas.style.visibility =
        "hidden";

      state.canvas.style.pointerEvents =
        "none";
    }

    state.disposed =
      true;

    state.initialized =
      false;

    state.transition =
      null;

    state.canvas =
      null;

    state.context =
      null;

    state.dormant =
      true;

    updateReceipt({
      status:
        "disposed",

      initialized:
        false,

      disposed:
        true,

      canvasPresent:
        false,

      canvasDormant:
        true,

      lastAction:
        "window-object-disposed",

      lastFailure:
        null
    });

    dispatch(
      EVENTS.DISPOSED,
      {
        receipt:
          getReceipt()
      }
    );

    return true;
  }

  function getReceipt() {
    return Object.freeze({
      ...receipt
    });
  }

  function getGeometryReceipt() {
    if (!state.geometry) {
      return Object.freeze({
        present:
          false
      });
    }

    return Object.freeze({
      present:
        true,

      contractId:
        CONTRACT.id,

      internalArchitecture:
        CONTRACT.internalArchitecture,

      internalArchitectureVersion:
        CONTRACT.internalArchitectureVersion,

      coordinateSystem:
        state.geometry.coordinateSystem,

      design:
        state.geometry.design,

      paneCount:
        state.geometry.panes.length,

      paneIds:
        Object.freeze(
          state.geometry.panes.map(pane => pane.id)
        ),

      uniqueCameSegmentCount:
        state.geometry.cameSegments.length,

      frameBandCount:
        state.geometry.frameBands.length,

      frameBandIds:
        Object.freeze(
          state.geometry.frameBands.map(band => band.id)
        ),

      aperturePointCount:
        state.geometry.aperture.outer.length,

      apertureTransparent:
        state.geometry.aperture.transparent,

      apertureFocalRole:
        state.geometry.aperture.focalRole,

      diamondOwnership:
        false,

      depth:
        state.geometry.depth,

      baseRender:
        state.geometry.baseRender,

      materialGroups:
        state.definition &&
        state.definition.materials
          ? Object.keys(state.definition.materials)
          : Object.keys(FALLBACK_DEFINITION.materials),

      renderModel:
        state.geometry.baseRender,

      rendererModel:
        CONTRACT.rendererModel,

      definitionExternalized:
        true,

      definitionConsumerReady:
        true,

      externalDefinitionApplied:
        Boolean(state.externalDefinitionApplied),

      activeDefinitionContractId:
        state.definition && state.definition.contractId
          ? state.definition.contractId
          : FALLBACK_DEFINITION.contractId,

      geometryQualityIntent:
        "luminous-aged-backlit-foreground-lens-aperture-focus-compatible-definition-consuming-host-with-atmospheric-halo"
    });
  }

  function getDefinitionReceipt() {
    return Object.freeze({
      present:
        Boolean(state.definition),

      externalDefinitionApplied:
        Boolean(state.externalDefinitionApplied),

      activeDefinitionContractId:
        state.definition && state.definition.contractId
          ? state.definition.contractId
          : FALLBACK_DEFINITION.contractId,

      fallbackDefinitionContractId:
        FALLBACK_DEFINITION.contractId,

      definitionSurface:
        CONTRACT.definitionSurface,

      luminousGlassModel:
        true,

      backlitPaneModel:
        true,

      atmosphericHaloModel:
        true,

      agedGlassModel:
        true,

      visualPassClaimed:
        false
    });
  }

  function exposeObjectApi() {
    globalThis.SHOWROOM_MIRRORLAND_WINDOW_OBJECT =
      Object.freeze({
        contract:
          CONTRACT,

        events:
          EVENTS,

        definitionEvents:
          DEFINITION_EVENTS,

        showCurtain,

        hideCurtain,

        setCurtainAmount,

        applyExternalDefinition,

        resize:
          () => {
            if (
              state.disposed ||
              state.failed ||
              !state.initialized
            ) {
              return false;
            }

            const changed =
              resize();

            if (isCurtainHidden()) {
              state.curtainAmount =
                0;

              hideCanvasForCurtain();
            } else {
              drawCurtainObject();
            }

            updateReceipt({
              lastAction:
                "window-object-resize-requested",

              resized:
                changed,

              canvasDormant:
                isCurtainHidden()
            });

            return changed;
          },

        render,

        dispose,

        getReceipt,

        getGeometryReceipt,

        getDefinitionReceipt,

        getCurtainAmount:
          () => state.curtainAmount,

        isDormant:
          () => Boolean(
            state.dormant ||
            isCurtainHidden()
          ),

        isReady:
          () => Boolean(
            state.initialized &&
            !state.failed &&
            !state.disposed
          )
      });
  }

  function init() {
    try {
      const previous =
        globalThis.SHOWROOM_MIRRORLAND_WINDOW_OBJECT;

      if (
        previous &&
        typeof previous.dispose === "function"
      ) {
        try {
          previous.dispose();
        } catch (_) {}
      }

      state.mount =
        document.querySelector(SELECTORS.mount);

      if (!state.mount) {
        throw new Error("SHOWROOM_WINDOW_MOUNT_NOT_FOUND");
      }

      state.mount.style.pointerEvents =
        "none";

      state.mount.style.background =
        "transparent";

      state.mount.dataset.showroomWindowForegroundLens =
        "true";

      state.mount.dataset.showroomWindowApertureFocus =
        "true";

      state.mount.dataset.showroomWindowLuminousGlass =
        "true";

      state.mount.dataset.showroomWindowAtmosphericHalo =
        "true";

      state.mount.dataset.showroomWindowAgedGlass =
        "true";

      state.geometry =
        makeGeometry();

      if (state.geometry.panes.length !== 21) {
        throw new Error(
          `SHOWROOM_WINDOW_GEOMETRY_PANE_COUNT_INVALID:${state.geometry.panes.length}`
        );
      }

      bindDefinitionListener();
      applyExternalDefinition("window-object-init");

      state.canvas =
        createCanvas();

      state.context =
        state.canvas.getContext(
          "2d",
          {
            alpha:
              true,

            desynchronized:
              true
          }
        );

      if (!state.context) {
        state.context =
          state.canvas.getContext(
            "2d",
            {
              alpha:
                true
            }
          );
      }

      if (!state.context) {
        throw new Error("SHOWROOM_WINDOW_CANVAS_2D_CONTEXT_UNAVAILABLE");
      }

      state.curtainAmount =
        CONTRACT.defaultCurtainAmount;

      bindReducedMotion();
      bindResize();

      resize();

      state.initialized =
        true;

      exposeObjectApi();

      applyCanvasVisibility();
      drawCurtainObject();

      updateReceipt({
        status:
          "available",

        initialized:
          true,

        canvasPresent:
          true,

        geometryPresent:
          true,

        definitionPresent:
          true,

        externalDefinitionApplied:
          state.externalDefinitionApplied,

        activeDefinitionContractId:
          state.definition && state.definition.contractId
            ? state.definition.contractId
            : FALLBACK_DEFINITION.contractId,

        curtainAmount:
          state.curtainAmount,

        canvasDormant:
          isCurtainHidden(),

        lastAction:
          "window-object-initialized-compatible-luminous-aged-definition-consuming-host-with-halo",

        lastFailure:
          null
      });

      dispatch(
        EVENTS.READY,
        {
          receipt:
            getReceipt(),

          geometry:
            getGeometryReceipt(),

          definition:
            getDefinitionReceipt()
        }
      );
    } catch (error) {
      exposeObjectApi();

      fail(
        error && error.message
          ? error.message
          : String(error)
      );
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      init,
      {
        once:
          true
      }
    );
  } else {
    init();
  }
})();
