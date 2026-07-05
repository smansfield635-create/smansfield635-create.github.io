/* TARGET FILE: /showroom/index.window.definition.js */
/* COMPLETE REPLACEMENT */
/* SHOWROOM_WINDOW_OBJECT_DEFINITION_v1_FOREGROUND_LENS_SPLENDOR_AUTHORITY */

/*
  Mirrorland Window Definition Authority

  Renewal purpose:
  - Keep the working HTML load path and compatible v1_3 Window host contract.
  - Increase visible stained-glass color, separation, glow, refraction, and pane identity.
  - Preserve Diamond visibility through the center lens.
  - Preserve button/controller/open/restore behavior by publishing definition data only.
  - Own no lifecycle, route, gesture, Compass, Diamond, CSS layout, or broad page state.

  Consumer:
  - /showroom/index.window.js
  - Public host contract remains:
    SHOWROOM_WINDOW_OBJECT_v1_3_FOREGROUND_LENS_APERTURE_FOCUS_OPTIMIZED_BASE

  Public surfaces:
  - globalThis.SHOWROOM_MIRRORLAND_WINDOW_DEFINITION
  - globalThis.SHOWROOM_MIRRORLAND_WINDOW_DEFINITION_RECEIPT

  Ready event:
  - SHOWROOM_MIRRORLAND_WINDOW_DEFINITION_READY
*/

(() => {
  "use strict";

  const CONTRACT = Object.freeze({
    id:
      "SHOWROOM_WINDOW_OBJECT_DEFINITION_v1_FOREGROUND_LENS_SPLENDOR_AUTHORITY",

    renewal:
      "SHOWROOM_WINDOW_OBJECT_DEFINITION_VISIBLE_SPLENDOR_RENEWAL_PASS_02",

    file:
      "/showroom/index.window.definition.js",

    publicSurface:
      "SHOWROOM_MIRRORLAND_WINDOW_DEFINITION",

    receiptSurface:
      "SHOWROOM_MIRRORLAND_WINDOW_DEFINITION_RECEIPT",

    readyEvent:
      "SHOWROOM_MIRRORLAND_WINDOW_DEFINITION_READY",

    failureEvent:
      "SHOWROOM_MIRRORLAND_WINDOW_DEFINITION_FAILURE",

    requiredWindowHostContract:
      "SHOWROOM_WINDOW_OBJECT_v1_3_FOREGROUND_LENS_APERTURE_FOCUS_OPTIMIZED_BASE",

    requiredWindowHostSurface:
      "SHOWROOM_MIRRORLAND_WINDOW_OBJECT",

    role:
      "window-object-visual-definition-authority",

    definitionClass:
      "foreground-lens-visible-jeweled-stained-glass-splendor-authority",

    scope:
      "visual-definition-only",

    ownsWindowLifecycle:
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
      false
  });

  const EVENTS = Object.freeze({
    READY:
      CONTRACT.readyEvent,

    FAILURE:
      CONTRACT.failureEvent
  });

  const EXPECTED_PANE_IDS = Object.freeze([
    "crown-left",
    "crown-right",
    "upper-left-edge",
    "upper-right-edge",
    "upper-center-left",
    "upper-center-right",
    "mid-left-high",
    "mid-left-inner",
    "mid-center",
    "mid-right-inner",
    "mid-right-high",
    "lower-left-edge",
    "lower-left-center",
    "lower-right-center",
    "lower-right-edge",
    "lower-left-deep",
    "lower-center-left",
    "lower-center-right",
    "lower-right-deep",
    "base-left",
    "base-right"
  ]);

  function rgb(red, green, blue) {
    return Object.freeze([
      red,
      green,
      blue
    ]);
  }

  function freezeRecord(record) {
    return Object.freeze({
      ...record
    });
  }

  function pane(config) {
    return Object.freeze({
      role:
        config.role,

      material:
        config.material,

      alpha:
        config.alpha,

      transmission:
        config.transmission,

      age:
        config.age,

      refraction:
        config.refraction,

      internalContrast:
        config.internalContrast,

      coldLight:
        config.coldLight,

      warmLight:
        config.warmLight,

      phase:
        config.phase,

      saturation:
        config.saturation,

      glow:
        config.glow,

      edgeLight:
        config.edgeLight,

      jewelDepth:
        config.jewelDepth
    });
  }

  const MATERIALS = Object.freeze({
    frame:
      Object.freeze({
        shadow:
          rgb(1, 2, 7),

        black:
          rgb(10, 12, 18),

        body:
          rgb(31, 35, 46),

        bevel:
          rgb(116, 112, 100),

        gold:
          rgb(210, 146, 54),

        goldBright:
          rgb(255, 204, 92),

        goldWhite:
          rgb(255, 238, 174),

        patina:
          rgb(38, 104, 100),

        coldEdge:
          rgb(134, 202, 214)
      }),

    lead:
      Object.freeze({
        shadow:
          rgb(4, 5, 11),

        dark:
          rgb(16, 18, 26),

        body:
          rgb(43, 46, 55),

        bevel:
          rgb(112, 110, 104),

        highlight:
          rgb(205, 188, 132),

        goldHairline:
          rgb(255, 211, 104),

        coldHairline:
          rgb(118, 202, 218)
      }),

    aperture:
      Object.freeze({
        wall:
          rgb(5, 6, 12),

        deepBronze:
          rgb(126, 70, 24),

        bronze:
          rgb(188, 108, 32),

        gold:
          rgb(246, 169, 42),

        chromeGold:
          rgb(255, 213, 72),

        bright:
          rgb(255, 235, 134),

        whiteGold:
          rgb(255, 250, 214),

        cold:
          rgb(166, 235, 244),

        coldEdge:
          rgb(96, 202, 232),

        innerLight:
          rgb(255, 226, 118),

        diamondFlash:
          rgb(255, 255, 238)
      }),

    glass:
      Object.freeze({
        frost:
          rgb(190, 246, 244),

        aquamarine:
          rgb(55, 236, 224),

        cyan:
          rgb(38, 204, 232),

        cyanDeep:
          rgb(8, 148, 180),

        blue:
          rgb(54, 122, 226),

        blueDeep:
          rgb(20, 58, 162),

        sapphire:
          rgb(36, 84, 212),

        violet:
          rgb(142, 82, 224),

        violetDeep:
          rgb(78, 40, 164),

        paleViolet:
          rgb(192, 142, 238),

        rose:
          rgb(224, 72, 138),

        roseDeep:
          rgb(146, 30, 86),

        ruby:
          rgb(210, 28, 92),

        amber:
          rgb(240, 158, 38),

        amberDeep:
          rgb(170, 92, 20),

        goldGlass:
          rgb(255, 188, 54),

        emerald:
          rgb(42, 194, 138),

        emeraldDeep:
          rgb(16, 122, 92),

        teal:
          rgb(20, 184, 168),

        moonstone:
          rgb(212, 238, 255)
      })
  });

  const OPTICAL = Object.freeze({
    objectShadowAlpha:
      0.21,

    objectShadowBlur:
      18,

    frameShadowBlur:
      15,

    glassAlpha:
      0.72,

    glassTransmission:
      0.50,

    centerGlassTransmission:
      0.91,

    apertureGlowAlpha:
      0.60,

    apertureSpecularAlpha:
      0.92,

    apertureInnerGlowAlpha:
      0.48,

    textureLineCount:
      6,

    textureSpeckCount:
      28,

    paneDefaultAlpha:
      0.66,

    paneDefaultAge:
      0.18,

    paneDefaultRefraction:
      0.56,

    paneDefaultInternalContrast:
      0.46,

    paneDefaultColdLight:
      0.44,

    paneDefaultWarmLight:
      0.28,

    paneDefaultSaturation:
      1.28,

    paneDefaultGlow:
      0.36,

    paneDefaultEdgeLight:
      0.34,

    paneDefaultJewelDepth:
      0.52,

    leadContrast:
      1.18,

    leadHighlight:
      0.42,

    frameGoldAccent:
      0.50,

    frameColdAccent:
      0.28,

    apertureGoldDominance:
      0.72,

    apertureColdCounterlight:
      0.34,

    diamondVisibilityPriority:
      1
  });

  const PANE_VISUALS = Object.freeze({
    "crown-left":
      pane({
        role:
          "bright-frost-crown-glass",

        material:
          "moonstone",

        alpha:
          0.62,

        transmission:
          0.62,

        age:
          0.10,

        refraction:
          0.66,

        internalContrast:
          0.32,

        coldLight:
          0.68,

        warmLight:
          0.18,

        phase:
          0.12,

        saturation:
          1.12,

        glow:
          0.44,

        edgeLight:
          0.46,

        jewelDepth:
          0.34
      }),

    "crown-right":
      pane({
        role:
          "opal-violet-crown-glass",

        material:
          "paleViolet",

        alpha:
          0.64,

        transmission:
          0.58,

        age:
          0.12,

        refraction:
          0.62,

        internalContrast:
          0.36,

        coldLight:
          0.44,

        warmLight:
          0.30,

        phase:
          0.44,

        saturation:
          1.20,

        glow:
          0.40,

        edgeLight:
          0.42,

        jewelDepth:
          0.38
      }),

    "upper-left-edge":
      pane({
        role:
          "saturated-sapphire-outer-shoulder-glass",

        material:
          "sapphire",

        alpha:
          0.74,

        transmission:
          0.42,

        age:
          0.22,

        refraction:
          0.52,

        internalContrast:
          0.60,

        coldLight:
          0.48,

        warmLight:
          0.08,

        phase:
          0.82,

        saturation:
          1.46,

        glow:
          0.30,

        edgeLight:
          0.36,

        jewelDepth:
          0.72
      }),

    "upper-right-edge":
      pane({
        role:
          "saturated-violet-outer-shoulder-glass",

        material:
          "violet",

        alpha:
          0.72,

        transmission:
          0.44,

        age:
          0.20,

        refraction:
          0.52,

        internalContrast:
          0.56,

        coldLight:
          0.34,

        warmLight:
          0.30,

        phase:
          1.16,

        saturation:
          1.42,

        glow:
          0.32,

        edgeLight:
          0.36,

        jewelDepth:
          0.68
      }),

    "upper-center-left":
      pane({
        role:
          "bright-aquamarine-lens-approach-glass",

        material:
          "aquamarine",

        alpha:
          0.68,

        transmission:
          0.56,

        age:
          0.10,

        refraction:
          0.62,

        internalContrast:
          0.40,

        coldLight:
          0.72,

        warmLight:
          0.12,

        phase:
          1.52,

        saturation:
          1.36,

        glow:
          0.44,

        edgeLight:
          0.42,

        jewelDepth:
          0.46
      }),

    "upper-center-right":
      pane({
        role:
          "bright-rose-lens-approach-glass",

        material:
          "rose",

        alpha:
          0.68,

        transmission:
          0.54,

        age:
          0.12,

        refraction:
          0.58,

        internalContrast:
          0.42,

        coldLight:
          0.20,

        warmLight:
          0.54,

        phase:
          1.88,

        saturation:
          1.42,

        glow:
          0.38,

        edgeLight:
          0.38,

        jewelDepth:
          0.50
      }),

    "mid-left-high":
      pane({
        role:
          "deep-blue-left-outer-glass",

        material:
          "blueDeep",

        alpha:
          0.76,

        transmission:
          0.38,

        age:
          0.24,

        refraction:
          0.50,

        internalContrast:
          0.66,

        coldLight:
          0.42,

        warmLight:
          0.06,

        phase:
          2.22,

        saturation:
          1.52,

        glow:
          0.24,

        edgeLight:
          0.34,

        jewelDepth:
          0.82
      }),

    "mid-left-inner":
      pane({
        role:
          "deep-violet-left-inner-glass",

        material:
          "violetDeep",

        alpha:
          0.72,

        transmission:
          0.42,

        age:
          0.20,

        refraction:
          0.52,

        internalContrast:
          0.60,

        coldLight:
          0.30,

        warmLight:
          0.24,

        phase:
          2.58,

        saturation:
          1.48,

        glow:
          0.28,

        edgeLight:
          0.34,

        jewelDepth:
          0.76
      }),

    "mid-center":
      pane({
        role:
          "clear-central-diamond-transmissive-lens-glass",

        material:
          "frost",

        alpha:
          0.30,

        transmission:
          0.94,

        age:
          0.06,

        refraction:
          0.74,

        internalContrast:
          0.24,

        coldLight:
          0.62,

        warmLight:
          0.42,

        phase:
          2.93,

        saturation:
          0.94,

        glow:
          0.38,

        edgeLight:
          0.58,

        jewelDepth:
          0.18
      }),

    "mid-right-inner":
      pane({
        role:
          "deep-cyan-right-inner-glass",

        material:
          "cyanDeep",

        alpha:
          0.72,

        transmission:
          0.42,

        age:
          0.18,

        refraction:
          0.52,

        internalContrast:
          0.58,

        coldLight:
          0.58,

        warmLight:
          0.10,

        phase:
          3.18,

        saturation:
          1.48,

        glow:
          0.30,

        edgeLight:
          0.36,

        jewelDepth:
          0.72
      }),

    "mid-right-high":
      pane({
        role:
          "bright-blue-right-outer-glass",

        material:
          "blue",

        alpha:
          0.74,

        transmission:
          0.40,

        age:
          0.22,

        refraction:
          0.50,

        internalContrast:
          0.62,

        coldLight:
          0.52,

        warmLight:
          0.08,

        phase:
          3.54,

        saturation:
          1.50,

        glow:
          0.28,

        edgeLight:
          0.36,

        jewelDepth:
          0.76
      }),

    "lower-left-edge":
      pane({
        role:
          "ruby-rose-lower-left-edge-glass",

        material:
          "ruby",

        alpha:
          0.76,

        transmission:
          0.38,

        age:
          0.24,

        refraction:
          0.48,

        internalContrast:
          0.66,

        coldLight:
          0.10,

        warmLight:
          0.62,

        phase:
          3.90,

        saturation:
          1.56,

        glow:
          0.28,

        edgeLight:
          0.36,

        jewelDepth:
          0.82
      }),

    "lower-left-center":
      pane({
        role:
          "bright-cyan-lower-left-center-glass",

        material:
          "cyan",

        alpha:
          0.68,

        transmission:
          0.54,

        age:
          0.14,

        refraction:
          0.58,

        internalContrast:
          0.44,

        coldLight:
          0.66,

        warmLight:
          0.12,

        phase:
          4.23,

        saturation:
          1.38,

        glow:
          0.40,

        edgeLight:
          0.40,

        jewelDepth:
          0.50
      }),

    "lower-right-center":
      pane({
        role:
          "bright-violet-lower-right-center-glass",

        material:
          "violet",

        alpha:
          0.68,

        transmission:
          0.52,

        age:
          0.14,

        refraction:
          0.56,

        internalContrast:
          0.44,

        coldLight:
          0.34,

        warmLight:
          0.34,

        phase:
          4.55,

        saturation:
          1.36,

        glow:
          0.38,

        edgeLight:
          0.38,

        jewelDepth:
          0.52
      }),

    "lower-right-edge":
      pane({
        role:
          "golden-amber-lower-right-edge-glass",

        material:
          "goldGlass",

        alpha:
          0.74,

        transmission:
          0.40,

        age:
          0.20,

        refraction:
          0.48,

        internalContrast:
          0.60,

        coldLight:
          0.08,

        warmLight:
          0.70,

        phase:
          4.92,

        saturation:
          1.48,

        glow:
          0.34,

        edgeLight:
          0.36,

        jewelDepth:
          0.74
      }),

    "lower-left-deep":
      pane({
        role:
          "deep-blue-lower-left-depth-glass",

        material:
          "blue",

        alpha:
          0.72,

        transmission:
          0.42,

        age:
          0.22,

        refraction:
          0.50,

        internalContrast:
          0.58,

        coldLight:
          0.50,

        warmLight:
          0.08,

        phase:
          5.24,

        saturation:
          1.44,

        glow:
          0.28,

        edgeLight:
          0.34,

        jewelDepth:
          0.70
      }),

    "lower-center-left":
      pane({
        role:
          "opal-violet-lower-center-left-glass",

        material:
          "paleViolet",

        alpha:
          0.66,

        transmission:
          0.54,

        age:
          0.16,

        refraction:
          0.54,

        internalContrast:
          0.42,

        coldLight:
          0.36,

        warmLight:
          0.34,

        phase:
          5.56,

        saturation:
          1.30,

        glow:
          0.36,

        edgeLight:
          0.36,

        jewelDepth:
          0.48
      }),

    "lower-center-right":
      pane({
        role:
          "bright-rose-lower-center-right-glass",

        material:
          "rose",

        alpha:
          0.66,

        transmission:
          0.54,

        age:
          0.16,

        refraction:
          0.54,

        internalContrast:
          0.42,

        coldLight:
          0.18,

        warmLight:
          0.54,

        phase:
          5.92,

        saturation:
          1.34,

        glow:
          0.36,

        edgeLight:
          0.36,

        jewelDepth:
          0.50
      }),

    "lower-right-deep":
      pane({
        role:
          "deep-cyan-lower-right-depth-glass",

        material:
          "cyanDeep",

        alpha:
          0.72,

        transmission:
          0.42,

        age:
          0.20,

        refraction:
          0.50,

        internalContrast:
          0.58,

        coldLight:
          0.60,

        warmLight:
          0.08,

        phase:
          6.23,

        saturation:
          1.44,

        glow:
          0.30,

        edgeLight:
          0.34,

        jewelDepth:
          0.70
      }),

    "base-left":
      pane({
        role:
          "molten-amber-foundation-left-glass",

        material:
          "amberDeep",

        alpha:
          0.72,

        transmission:
          0.42,

        age:
          0.22,

        refraction:
          0.48,

        internalContrast:
          0.58,

        coldLight:
          0.08,

        warmLight:
          0.66,

        phase:
          6.54,

        saturation:
          1.42,

        glow:
          0.30,

        edgeLight:
          0.34,

        jewelDepth:
          0.68
      }),

    "base-right":
      pane({
        role:
          "deep-sapphire-foundation-right-glass",

        material:
          "blueDeep",

        alpha:
          0.72,

        transmission:
          0.42,

        age:
          0.22,

        refraction:
          0.48,

        internalContrast:
          0.58,

        coldLight:
          0.54,

        warmLight:
          0.08,

        phase:
          6.88,

        saturation:
          1.42,

        glow:
          0.28,

        edgeLight:
          0.34,

        jewelDepth:
          0.68
      })
  });

  const STATE_PROFILES = Object.freeze({
    closed:
      Object.freeze({
        opacityMultiplier:
          1,

        densityMultiplier:
          1.02,

        apertureMultiplier:
          1.18,

        paneGlowMultiplier:
          1,

        frameContrastMultiplier:
          1
      }),

    opening:
      Object.freeze({
        opacityMultiplier:
          1,

        densityMultiplier:
          0.82,

        apertureMultiplier:
          1.22,

        paneGlowMultiplier:
          1.08,

        frameContrastMultiplier:
          0.96
      }),

    closing:
      Object.freeze({
        opacityMultiplier:
          1,

        densityMultiplier:
          0.92,

        apertureMultiplier:
          1.18,

        paneGlowMultiplier:
          0.96,

        frameContrastMultiplier:
          1
      }),

    open:
      Object.freeze({
        opacityMultiplier:
          0,

        densityMultiplier:
          0,

        apertureMultiplier:
          0,

        paneGlowMultiplier:
          0,

        frameContrastMultiplier:
          0
      })
  });

  const DEFINITION = Object.freeze({
    contractId:
      CONTRACT.id,

    id:
      CONTRACT.id,

    renewal:
      CONTRACT.renewal,

    file:
      CONTRACT.file,

    source:
      "external-window-definition",

    role:
      CONTRACT.role,

    definitionClass:
      CONTRACT.definitionClass,

    consumer:
      Object.freeze({
        requiredWindowHostContract:
          CONTRACT.requiredWindowHostContract,

        requiredWindowHostSurface:
          CONTRACT.requiredWindowHostSurface,

        consumeMethod:
          "optional-global-definition-consumption"
      }),

    doctrine:
      Object.freeze({
        visualGoal:
          "make the Window visibly jeweled and readable after the HTML definition load path is active",

        densityGoal:
          "stronger stained-glass color and separation without returning to full blackout",

        glassGoal:
          "distinct pane identities with saturated jewel color, visible cool/warm light, and preserved center transmission",

        apertureGoal:
          "chrome-gold focal threshold with stronger rim light while keeping Diamond visibility",

        frameGoal:
          "dark metal frame with readable gold and cold-edge highlights",

        cameGoal:
          "lead/came lines remain structural, not dominant; color panes must read through them",

        textureGoal:
          "more visible antique glass variation without noisy surface collapse",

        lifecycleGoal:
          "definition changes visual material only and never changes open/restore behavior"
      }),

    materials:
      MATERIALS,

    optical:
      OPTICAL,

    paneVisuals:
      PANE_VISUALS,

    stateProfiles:
      STATE_PROFILES,

    ownership:
      Object.freeze({
        ownsWindowLifecycle:
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
          false
      }),

    validation:
      Object.freeze({
        expectedPaneCount:
          EXPECTED_PANE_IDS.length,

        expectedPaneIds:
          EXPECTED_PANE_IDS,

        materialGroups:
          Object.freeze(Object.keys(MATERIALS)),

        stateProfiles:
          Object.freeze(Object.keys(STATE_PROFILES)),

        visualPassClaimed:
          false,

        productionAuthorized:
          false,

        deploymentAuthorized:
          false
      })
  });

  const receipt = {
    contractId:
      CONTRACT.id,

    renewal:
      CONTRACT.renewal,

    file:
      CONTRACT.file,

    publicSurface:
      CONTRACT.publicSurface,

    receiptSurface:
      CONTRACT.receiptSurface,

    requiredWindowHostContract:
      CONTRACT.requiredWindowHostContract,

    requiredWindowHostSurface:
      CONTRACT.requiredWindowHostSurface,

    status:
      "pending",

    ready:
      false,

    failed:
      false,

    paneDefinitionCount:
      0,

    expectedPaneCount:
      EXPECTED_PANE_IDS.length,

    paneIdsComplete:
      false,

    materialGroupsComplete:
      false,

    stateProfilesComplete:
      false,

    visualPassClaimed:
      false,

    productionAuthorized:
      false,

    deploymentAuthorized:
      false,

    ownsWindowLifecycle:
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

    lastAction:
      "",

    lastFailure:
      null
  };

  function freezeReceipt(extra = {}) {
    Object.assign(
      receipt,
      extra
    );

    globalThis.SHOWROOM_MIRRORLAND_WINDOW_DEFINITION_RECEIPT =
      Object.freeze({
        ...receipt
      });

    return globalThis.SHOWROOM_MIRRORLAND_WINDOW_DEFINITION_RECEIPT;
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

                renewal:
                  CONTRACT.renewal,

                file:
                  CONTRACT.file,

                ...detail
              })
          }
        )
      );
    } catch (_) {}
  }

  function ownKeys(value) {
    return value && typeof value === "object"
      ? Object.keys(value)
      : [];
  }

  function validateDefinition() {
    const paneKeys =
      ownKeys(PANE_VISUALS);

    const paneIdsComplete =
      EXPECTED_PANE_IDS.every(
        paneId => Object.prototype.hasOwnProperty.call(PANE_VISUALS, paneId)
      ) &&
      paneKeys.length === EXPECTED_PANE_IDS.length;

    const materialGroupsComplete =
      ["frame", "lead", "aperture", "glass"].every(
        group => Object.prototype.hasOwnProperty.call(MATERIALS, group)
      );

    const stateProfilesComplete =
      ["closed", "opening", "closing", "open"].every(
        profile => Object.prototype.hasOwnProperty.call(STATE_PROFILES, profile)
      );

    const paneValuesComplete =
      EXPECTED_PANE_IDS.every(
        paneId => {
          const visual =
            PANE_VISUALS[paneId];

          return Boolean(
            visual &&
            typeof visual.role === "string" &&
            typeof visual.material === "string" &&
            typeof visual.alpha === "number" &&
            typeof visual.transmission === "number" &&
            typeof visual.age === "number" &&
            typeof visual.refraction === "number" &&
            typeof visual.internalContrast === "number" &&
            typeof visual.coldLight === "number" &&
            typeof visual.warmLight === "number" &&
            typeof visual.phase === "number"
          );
        }
      );

    return {
      valid:
        paneIdsComplete &&
        materialGroupsComplete &&
        stateProfilesComplete &&
        paneValuesComplete,

      paneDefinitionCount:
        paneKeys.length,

      paneIdsComplete,
      materialGroupsComplete,
      stateProfilesComplete,
      paneValuesComplete
    };
  }

  function publish() {
    const validation =
      validateDefinition();

    if (!validation.valid) {
      const reason =
        "SHOWROOM_WINDOW_DEFINITION_VALIDATION_FAILED";

      freezeReceipt({
        status:
          "failed",

        ready:
          false,

        failed:
          true,

        paneDefinitionCount:
          validation.paneDefinitionCount,

        paneIdsComplete:
          validation.paneIdsComplete,

        materialGroupsComplete:
          validation.materialGroupsComplete,

        stateProfilesComplete:
          validation.stateProfilesComplete,

        paneValuesComplete:
          validation.paneValuesComplete,

        lastAction:
          "window-definition-validation-failed",

        lastFailure:
          reason
      });

      dispatch(
        EVENTS.FAILURE,
        {
          reason,
          receipt:
            globalThis.SHOWROOM_MIRRORLAND_WINDOW_DEFINITION_RECEIPT
        }
      );

      return false;
    }

    globalThis.SHOWROOM_MIRRORLAND_WINDOW_DEFINITION =
      DEFINITION;

    const publishedReceipt =
      freezeReceipt({
        status:
          "available",

        ready:
          true,

        failed:
          false,

        paneDefinitionCount:
          validation.paneDefinitionCount,

        paneIdsComplete:
          validation.paneIdsComplete,

        materialGroupsComplete:
          validation.materialGroupsComplete,

        stateProfilesComplete:
          validation.stateProfilesComplete,

        paneValuesComplete:
          validation.paneValuesComplete,

        lastAction:
          "window-definition-published-visible-splendor-renewal",

        lastFailure:
          null
      });

    dispatch(
      EVENTS.READY,
      {
        definition:
          DEFINITION,

        receipt:
          publishedReceipt
      }
    );

    const host =
      globalThis.SHOWROOM_MIRRORLAND_WINDOW_OBJECT;

    if (
      host &&
      typeof host.applyExternalDefinition === "function"
    ) {
      try {
        host.applyExternalDefinition(
          "definition-published-after-host-detected-visible-splendor-renewal"
        );
      } catch (_) {}
    }

    return true;
  }

  freezeRecord(CONTRACT);
  publish();
})();
