/* TARGET FILE: /showroom/index.window.definition.js */
/* COMPLETE REPLACEMENT */
/* SHOWROOM_WINDOW_OBJECT_DEFINITION_v1_FOREGROUND_LENS_SPLENDOR_AUTHORITY */

/*
  Mirrorland Window Definition Authority

  Renewal purpose:
  - Keep the working HTML load path and compatible v1_3 Window host contract.
  - Correct the prior aged/halo pass by restoring crisp stained-glass definition.
  - Preserve luminous pane color while reducing haze, broad blur, and soft fog.
  - Make the outer glow a tight rim light, not a broad atmospheric blur.
  - Make patina read as aged metal accents, not surface fog.
  - Make scratches fine and subtle, not fuzzy.
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
      "SHOWROOM_WINDOW_OBJECT_DEFINITION_CRISP_AGED_RIMLIGHT_RENEWAL_PASS_04",

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
      "foreground-lens-crisp-aged-jeweled-stained-glass-rimlight-authority",

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
        config.jewelDepth,

      scratch:
        config.scratch,

      patina:
        config.patina
    });
  }

  const MATERIALS = Object.freeze({
    frame:
      Object.freeze({
        shadow:
          rgb(1, 2, 7),

        black:
          rgb(7, 9, 15),

        body:
          rgb(31, 35, 44),

        bevel:
          rgb(116, 112, 100),

        gold:
          rgb(208, 144, 54),

        goldBright:
          rgb(255, 206, 96),

        goldWhite:
          rgb(255, 238, 174),

        patina:
          rgb(39, 106, 100),

        verdigris:
          rgb(48, 128, 120),

        oldCopper:
          rgb(130, 76, 38),

        coldEdge:
          rgb(132, 204, 218),

        haloWarm:
          rgb(255, 202, 112),

        haloCold:
          rgb(112, 216, 236)
      }),

    lead:
      Object.freeze({
        shadow:
          rgb(4, 5, 10),

        dark:
          rgb(13, 15, 22),

        body:
          rgb(39, 43, 51),

        bevel:
          rgb(104, 104, 100),

        highlight:
          rgb(202, 188, 136),

        goldHairline:
          rgb(255, 212, 106),

        coldHairline:
          rgb(116, 200, 218),

        patina:
          rgb(42, 86, 80)
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
          rgb(248, 170, 42),

        chromeGold:
          rgb(255, 214, 74),

        bright:
          rgb(255, 236, 136),

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
          rgb(196, 248, 246),

        aquamarine:
          rgb(62, 236, 224),

        cyan:
          rgb(46, 208, 236),

        cyanDeep:
          rgb(14, 148, 184),

        blue:
          rgb(60, 128, 232),

        blueDeep:
          rgb(24, 62, 166),

        sapphire:
          rgb(42, 90, 218),

        violet:
          rgb(150, 86, 228),

        violetDeep:
          rgb(80, 40, 164),

        paleViolet:
          rgb(198, 148, 240),

        rose:
          rgb(226, 78, 142),

        roseDeep:
          rgb(148, 34, 88),

        ruby:
          rgb(212, 34, 94),

        amber:
          rgb(242, 162, 42),

        amberDeep:
          rgb(172, 92, 22),

        goldGlass:
          rgb(255, 190, 58),

        emerald:
          rgb(48, 198, 142),

        emeraldDeep:
          rgb(20, 126, 94),

        teal:
          rgb(26, 188, 170),

        moonstone:
          rgb(216, 240, 255),

        ageWhite:
          rgb(246, 244, 226),

        scratchWhite:
          rgb(255, 255, 246)
      })
  });

  const OPTICAL = Object.freeze({
    objectShadowAlpha:
      0.06,

    objectShadowBlur:
      8,

    frameShadowBlur:
      7,

    outerGlowAlpha:
      0.18,

    outerGlowBlur:
      12,

    outerGlowSpread:
      1.045,

    outerGlowWarmth:
      0.56,

    outerGlowCold:
      0.42,

    outerGlowRimAlpha:
      0.12,

    glassAlpha:
      0.61,

    glassTransmission:
      0.66,

    centerGlassTransmission:
      0.94,

    apertureGlowAlpha:
      0.52,

    apertureSpecularAlpha:
      0.86,

    apertureInnerGlowAlpha:
      0.40,

    textureLineCount:
      4,

    textureSpeckCount:
      14,

    scratchLineCount:
      5,

    scratchAlpha:
      0.15,

    scratchLength:
      0.42,

    patinaIntensity:
      0.20,

    patinaSpeckCount:
      10,

    paneDefaultAlpha:
      0.58,

    paneDefaultAge:
      0.20,

    paneDefaultRefraction:
      0.52,

    paneDefaultInternalContrast:
      0.46,

    paneDefaultColdLight:
      0.40,

    paneDefaultWarmLight:
      0.22,

    paneDefaultSaturation:
      1.24,

    paneDefaultGlow:
      0.30,

    paneDefaultEdgeLight:
      0.46,

    paneDefaultJewelDepth:
      0.58,

    leadContrast:
      1.08,

    leadHighlight:
      0.38,

    leadPatina:
      0.16,

    frameGoldAccent:
      0.48,

    frameColdAccent:
      0.28,

    framePatina:
      0.22,

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
          "crisp-aged-moonstone-crown-glass",

        material:
          "moonstone",

        alpha:
          0.56,

        transmission:
          0.70,

        age:
          0.18,

        refraction:
          0.64,

        internalContrast:
          0.36,

        coldLight:
          0.66,

        warmLight:
          0.18,

        phase:
          0.12,

        saturation:
          1.10,

        glow:
          0.34,

        edgeLight:
          0.58,

        jewelDepth:
          0.42,

        scratch:
          0.16,

        patina:
          0.06
      }),

    "crown-right":
      pane({
        role:
          "crisp-aged-opal-violet-crown-glass",

        material:
          "paleViolet",

        alpha:
          0.58,

        transmission:
          0.66,

        age:
          0.20,

        refraction:
          0.60,

        internalContrast:
          0.40,

        coldLight:
          0.42,

        warmLight:
          0.30,

        phase:
          0.44,

        saturation:
          1.18,

        glow:
          0.32,

        edgeLight:
          0.54,

        jewelDepth:
          0.46,

        scratch:
          0.16,

        patina:
          0.08
      }),

    "upper-left-edge":
      pane({
        role:
          "crisp-sapphire-outer-shoulder-glass-with-aged-edge",

        material:
          "sapphire",

        alpha:
          0.64,

        transmission:
          0.58,

        age:
          0.28,

        refraction:
          0.52,

        internalContrast:
          0.58,

        coldLight:
          0.46,

        warmLight:
          0.08,

        phase:
          0.82,

        saturation:
          1.40,

        glow:
          0.24,

        edgeLight:
          0.50,

        jewelDepth:
          0.72,

        scratch:
          0.24,

        patina:
          0.16
      }),

    "upper-right-edge":
      pane({
        role:
          "crisp-violet-outer-shoulder-glass-with-aged-edge",

        material:
          "violet",

        alpha:
          0.62,

        transmission:
          0.58,

        age:
          0.28,

        refraction:
          0.52,

        internalContrast:
          0.56,

        coldLight:
          0.32,

        warmLight:
          0.30,

        phase:
          1.16,

        saturation:
          1.36,

        glow:
          0.26,

        edgeLight:
          0.50,

        jewelDepth:
          0.68,

        scratch:
          0.24,

        patina:
          0.16
      }),

    "upper-center-left":
      pane({
        role:
          "crisp-aquamarine-lens-approach-glass",

        material:
          "aquamarine",

        alpha:
          0.58,

        transmission:
          0.68,

        age:
          0.16,

        refraction:
          0.62,

        internalContrast:
          0.44,

        coldLight:
          0.72,

        warmLight:
          0.12,

        phase:
          1.52,

        saturation:
          1.30,

        glow:
          0.36,

        edgeLight:
          0.54,

        jewelDepth:
          0.50,

        scratch:
          0.14,

        patina:
          0.06
      }),

    "upper-center-right":
      pane({
        role:
          "crisp-rose-lens-approach-glass",

        material:
          "rose",

        alpha:
          0.58,

        transmission:
          0.66,

        age:
          0.18,

        refraction:
          0.58,

        internalContrast:
          0.46,

        coldLight:
          0.20,

        warmLight:
          0.54,

        phase:
          1.88,

        saturation:
          1.34,

        glow:
          0.32,

        edgeLight:
          0.50,

        jewelDepth:
          0.54,

        scratch:
          0.16,

        patina:
          0.08
      }),

    "mid-left-high":
      pane({
        role:
          "crisp-deep-blue-left-outer-glass-with-visible-age",

        material:
          "blueDeep",

        alpha:
          0.66,

        transmission:
          0.54,

        age:
          0.32,

        refraction:
          0.50,

        internalContrast:
          0.64,

        coldLight:
          0.42,

        warmLight:
          0.06,

        phase:
          2.22,

        saturation:
          1.44,

        glow:
          0.22,

        edgeLight:
          0.48,

        jewelDepth:
          0.82,

        scratch:
          0.28,

        patina:
          0.20
      }),

    "mid-left-inner":
      pane({
        role:
          "crisp-deep-violet-left-inner-glass-with-aged-seams",

        material:
          "violetDeep",

        alpha:
          0.64,

        transmission:
          0.56,

        age:
          0.30,

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
          1.40,

        glow:
          0.24,

        edgeLight:
          0.48,

        jewelDepth:
          0.76,

        scratch:
          0.26,

        patina:
          0.18
      }),

    "mid-center":
      pane({
        role:
          "clean-crisp-central-diamond-transmissive-lens-glass",

        material:
          "frost",

        alpha:
          0.28,

        transmission:
          0.96,

        age:
          0.05,

        refraction:
          0.74,

        internalContrast:
          0.22,

        coldLight:
          0.64,

        warmLight:
          0.40,

        phase:
          2.93,

        saturation:
          0.92,

        glow:
          0.32,

        edgeLight:
          0.68,

        jewelDepth:
          0.14,

        scratch:
          0.04,

        patina:
          0.01
      }),

    "mid-right-inner":
      pane({
        role:
          "crisp-deep-cyan-right-inner-glass-with-aged-seams",

        material:
          "cyanDeep",

        alpha:
          0.64,

        transmission:
          0.56,

        age:
          0.30,

        refraction:
          0.52,

        internalContrast:
          0.60,

        coldLight:
          0.58,

        warmLight:
          0.10,

        phase:
          3.18,

        saturation:
          1.40,

        glow:
          0.26,

        edgeLight:
          0.50,

        jewelDepth:
          0.74,

        scratch:
          0.26,

        patina:
          0.18
      }),

    "mid-right-high":
      pane({
        role:
          "crisp-blue-right-outer-glass-with-visible-age",

        material:
          "blue",

        alpha:
          0.66,

        transmission:
          0.54,

        age:
          0.32,

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
          1.42,

        glow:
          0.24,

        edgeLight:
          0.50,

        jewelDepth:
          0.78,

        scratch:
          0.28,

        patina:
          0.20
      }),

    "lower-left-edge":
      pane({
        role:
          "crisp-ruby-rose-lower-left-edge-glass-with-warm-age",

        material:
          "ruby",

        alpha:
          0.66,

        transmission:
          0.54,

        age:
          0.34,

        refraction:
          0.48,

        internalContrast:
          0.64,

        coldLight:
          0.10,

        warmLight:
          0.62,

        phase:
          3.90,

        saturation:
          1.48,

        glow:
          0.24,

        edgeLight:
          0.50,

        jewelDepth:
          0.82,

        scratch:
          0.30,

        patina:
          0.22
      }),

    "lower-left-center":
      pane({
        role:
          "crisp-cyan-lower-left-center-glass",

        material:
          "cyan",

        alpha:
          0.58,

        transmission:
          0.66,

        age:
          0.22,

        refraction:
          0.58,

        internalContrast:
          0.48,

        coldLight:
          0.66,

        warmLight:
          0.12,

        phase:
          4.23,

        saturation:
          1.32,

        glow:
          0.34,

        edgeLight:
          0.52,

        jewelDepth:
          0.56,

        scratch:
          0.18,

        patina:
          0.10
      }),

    "lower-right-center":
      pane({
        role:
          "crisp-violet-lower-right-center-glass",

        material:
          "violet",

        alpha:
          0.58,

        transmission:
          0.64,

        age:
          0.22,

        refraction:
          0.56,

        internalContrast:
          0.48,

        coldLight:
          0.34,

        warmLight:
          0.34,

        phase:
          4.55,

        saturation:
          1.30,

        glow:
          0.32,

        edgeLight:
          0.50,

        jewelDepth:
          0.58,

        scratch:
          0.18,

        patina:
          0.10
      }),

    "lower-right-edge":
      pane({
        role:
          "crisp-golden-amber-lower-right-edge-glass-with-warm-definition",

        material:
          "goldGlass",

        alpha:
          0.64,

        transmission:
          0.56,

        age:
          0.30,

        refraction:
          0.50,

        internalContrast:
          0.58,

        coldLight:
          0.08,

        warmLight:
          0.70,

        phase:
          4.92,

        saturation:
          1.40,

        glow:
          0.32,

        edgeLight:
          0.48,

        jewelDepth:
          0.72,

        scratch:
          0.26,

        patina:
          0.18
      }),

    "lower-left-deep":
      pane({
        role:
          "crisp-blue-lower-left-depth-glass-with-outer-age",

        material:
          "blue",

        alpha:
          0.62,

        transmission:
          0.58,

        age:
          0.30,

        refraction:
          0.50,

        internalContrast:
          0.56,

        coldLight:
          0.50,

        warmLight:
          0.08,

        phase:
          5.24,

        saturation:
          1.36,

        glow:
          0.26,

        edgeLight:
          0.46,

        jewelDepth:
          0.68,

        scratch:
          0.26,

        patina:
          0.18
      }),

    "lower-center-left":
      pane({
        role:
          "crisp-opal-violet-lower-center-left-glass",

        material:
          "paleViolet",

        alpha:
          0.56,

        transmission:
          0.66,

        age:
          0.24,

        refraction:
          0.54,

        internalContrast:
          0.44,

        coldLight:
          0.36,

        warmLight:
          0.34,

        phase:
          5.56,

        saturation:
          1.22,

        glow:
          0.30,

        edgeLight:
          0.48,

        jewelDepth:
          0.52,

        scratch:
          0.20,

        patina:
          0.12
      }),

    "lower-center-right":
      pane({
        role:
          "crisp-bright-rose-lower-center-right-glass",

        material:
          "rose",

        alpha:
          0.56,

        transmission:
          0.66,

        age:
          0.24,

        refraction:
          0.54,

        internalContrast:
          0.44,

        coldLight:
          0.18,

        warmLight:
          0.54,

        phase:
          5.92,

        saturation:
          1.28,

        glow:
          0.30,

        edgeLight:
          0.48,

        jewelDepth:
          0.54,

        scratch:
          0.20,

        patina:
          0.12
      }),

    "lower-right-deep":
      pane({
        role:
          "crisp-deep-cyan-lower-right-depth-glass-with-outer-age",

        material:
          "cyanDeep",

        alpha:
          0.62,

        transmission:
          0.58,

        age:
          0.30,

        refraction:
          0.50,

        internalContrast:
          0.56,

        coldLight:
          0.60,

        warmLight:
          0.08,

        phase:
          6.23,

        saturation:
          1.36,

        glow:
          0.28,

        edgeLight:
          0.46,

        jewelDepth:
          0.68,

        scratch:
          0.26,

        patina:
          0.18
      }),

    "base-left":
      pane({
        role:
          "crisp-molten-amber-foundation-left-glass-with-base-wear",

        material:
          "amberDeep",

        alpha:
          0.62,

        transmission:
          0.58,

        age:
          0.34,

        refraction:
          0.48,

        internalContrast:
          0.56,

        coldLight:
          0.08,

        warmLight:
          0.66,

        phase:
          6.54,

        saturation:
          1.36,

        glow:
          0.28,

        edgeLight:
          0.46,

        jewelDepth:
          0.68,

        scratch:
          0.30,

        patina:
          0.22
      }),

    "base-right":
      pane({
        role:
          "crisp-deep-sapphire-foundation-right-glass-with-base-wear",

        material:
          "blueDeep",

        alpha:
          0.62,

        transmission:
          0.58,

        age:
          0.34,

        refraction:
          0.48,

        internalContrast:
          0.56,

        coldLight:
          0.54,

        warmLight:
          0.08,

        phase:
          6.88,

        saturation:
          1.36,

        glow:
          0.26,

        edgeLight:
          0.46,

        jewelDepth:
          0.68,

        scratch:
          0.30,

        patina:
          0.22
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
          1.14,

        paneGlowMultiplier:
          0.94,

        frameContrastMultiplier:
          1.06,

        outerGlowMultiplier:
          0.72,

        ageMultiplier:
          1
      }),

    opening:
      Object.freeze({
        opacityMultiplier:
          1,

        densityMultiplier:
          0.88,

        apertureMultiplier:
          1.18,

        paneGlowMultiplier:
          1.02,

        frameContrastMultiplier:
          1.02,

        outerGlowMultiplier:
          0.86,

        ageMultiplier:
          0.90
      }),

    closing:
      Object.freeze({
        opacityMultiplier:
          1,

        densityMultiplier:
          0.96,

        apertureMultiplier:
          1.14,

        paneGlowMultiplier:
          0.94,

        frameContrastMultiplier:
          1.06,

        outerGlowMultiplier:
          0.72,

        ageMultiplier:
          0.96
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
          0,

        outerGlowMultiplier:
          0,

        ageMultiplier:
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
          "restore crisp stained-glass definition while retaining luminous color and controlled age",

        densityGoal:
          "keep pane color readable and firm without returning to opaque painted-stone darkness",

        glassGoal:
          "clear pane boundaries, defined jewel depth, controlled transmission, and fine glass wear",

        haloGoal:
          "thin rim light only; no broad fog around or across the object body",

        patinaGoal:
          "aged metal accents on frame and lead, not atmospheric haze",

        scratchGoal:
          "fine restrained glass scratches visible only as antique detail",

        apertureGoal:
          "chrome-gold focal threshold with sharp rim light and preserved Diamond visibility",

        frameGoal:
          "defined aged dark metal frame with gold, cold-edge, copper, and verdigris accents",

        cameGoal:
          "lead/came lines remain crisp structural separators with enough authority to restore definition",

        textureGoal:
          "antique glass texture should support definition, not blur it",

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

    paneValuesComplete:
      false,

    hostHaloValuesPresent:
      true,

    hostAgeValuesPresent:
      true,

    crispnessCorrection:
      true,

    broadHazeReduced:
      true,

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
      ) &&
      ["verdigris", "oldCopper", "haloWarm", "haloCold"].every(
        key => Object.prototype.hasOwnProperty.call(MATERIALS.frame, key)
      ) &&
      Object.prototype.hasOwnProperty.call(MATERIALS.lead, "patina") &&
      ["ageWhite", "scratchWhite"].every(
        key => Object.prototype.hasOwnProperty.call(MATERIALS.glass, key)
      );

    const stateProfilesComplete =
      ["closed", "opening", "closing", "open"].every(
        profile => Object.prototype.hasOwnProperty.call(STATE_PROFILES, profile)
      );

    const stateProfileValuesComplete =
      ["closed", "opening", "closing", "open"].every(
        profileName => {
          const profile =
            STATE_PROFILES[profileName];

          return Boolean(
            profile &&
            typeof profile.opacityMultiplier === "number" &&
            typeof profile.densityMultiplier === "number" &&
            typeof profile.apertureMultiplier === "number" &&
            typeof profile.paneGlowMultiplier === "number" &&
            typeof profile.frameContrastMultiplier === "number" &&
            typeof profile.outerGlowMultiplier === "number" &&
            typeof profile.ageMultiplier === "number"
          );
        }
      );

    const haloValuesComplete =
      [
        "outerGlowAlpha",
        "outerGlowBlur",
        "outerGlowSpread",
        "outerGlowWarmth",
        "outerGlowCold",
        "outerGlowRimAlpha"
      ].every(
        key => typeof OPTICAL[key] === "number"
      );

    const ageValuesComplete =
      [
        "scratchLineCount",
        "scratchAlpha",
        "scratchLength",
        "patinaIntensity",
        "patinaSpeckCount",
        "leadPatina",
        "framePatina"
      ].every(
        key => typeof OPTICAL[key] === "number"
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
            typeof visual.phase === "number" &&
            typeof visual.saturation === "number" &&
            typeof visual.glow === "number" &&
            typeof visual.edgeLight === "number" &&
            typeof visual.jewelDepth === "number" &&
            typeof visual.scratch === "number" &&
            typeof visual.patina === "number"
          );
        }
      );

    return {
      valid:
        paneIdsComplete &&
        materialGroupsComplete &&
        stateProfilesComplete &&
        stateProfileValuesComplete &&
        haloValuesComplete &&
        ageValuesComplete &&
        paneValuesComplete,

      paneDefinitionCount:
        paneKeys.length,

      paneIdsComplete,
      materialGroupsComplete,
      stateProfilesComplete,
      stateProfileValuesComplete,
      haloValuesComplete,
      ageValuesComplete,
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

        stateProfileValuesComplete:
          validation.stateProfileValuesComplete,

        haloValuesComplete:
          validation.haloValuesComplete,

        ageValuesComplete:
          validation.ageValuesComplete,

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

        stateProfileValuesComplete:
          validation.stateProfileValuesComplete,

        haloValuesComplete:
          validation.haloValuesComplete,

        ageValuesComplete:
          validation.ageValuesComplete,

        paneValuesComplete:
          validation.paneValuesComplete,

        lastAction:
          "window-definition-published-crisp-aged-rimlight-renewal",

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
          "definition-published-after-host-detected-crisp-aged-rimlight-renewal"
        );
      } catch (_) {}
    }

    return true;
  }

  publish();
})();
