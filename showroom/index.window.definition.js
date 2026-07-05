/* TARGET FILE: /showroom/index.window.definition.js */
/* COMPLETE REPLACEMENT */
/* SHOWROOM_WINDOW_OBJECT_DEFINITION_v1_FOREGROUND_LENS_SPLENDOR_AUTHORITY */

/*
  Mirrorland Window Definition Authority

  Renewal purpose:
  - Keep the working HTML load path and compatible v1_3 Window host contract.
  - Expand the prior visible splendor definition into aged luminous stained glass.
  - Give the renewed Window host direct values for outer halo, patina, scratches,
    aged glass, lead wear, frame wear, and atmospheric rim glow.
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
      "SHOWROOM_WINDOW_OBJECT_DEFINITION_AGED_HALATION_PATINA_RENEWAL_PASS_03",

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
      "foreground-lens-aged-luminous-jeweled-stained-glass-halo-patina-authority",

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
          rgb(8, 10, 16),

        body:
          rgb(34, 38, 48),

        bevel:
          rgb(116, 112, 100),

        gold:
          rgb(206, 142, 54),

        goldBright:
          rgb(255, 203, 94),

        goldWhite:
          rgb(255, 238, 174),

        patina:
          rgb(42, 112, 104),

        verdigris:
          rgb(52, 136, 126),

        oldCopper:
          rgb(132, 78, 40),

        coldEdge:
          rgb(136, 210, 222),

        haloWarm:
          rgb(255, 202, 112),

        haloCold:
          rgb(116, 226, 244)
      }),

    lead:
      Object.freeze({
        shadow:
          rgb(4, 5, 11),

        dark:
          rgb(15, 17, 24),

        body:
          rgb(42, 46, 54),

        bevel:
          rgb(112, 110, 104),

        highlight:
          rgb(208, 190, 132),

        goldHairline:
          rgb(255, 211, 104),

        coldHairline:
          rgb(120, 206, 222),

        patina:
          rgb(46, 92, 86)
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
          rgb(196, 248, 246),

        aquamarine:
          rgb(64, 238, 226),

        cyan:
          rgb(48, 210, 236),

        cyanDeep:
          rgb(16, 150, 184),

        blue:
          rgb(62, 132, 230),

        blueDeep:
          rgb(26, 66, 164),

        sapphire:
          rgb(42, 92, 216),

        violet:
          rgb(150, 88, 226),

        violetDeep:
          rgb(82, 42, 164),

        paleViolet:
          rgb(198, 150, 240),

        rose:
          rgb(226, 80, 142),

        roseDeep:
          rgb(148, 34, 88),

        ruby:
          rgb(212, 34, 94),

        amber:
          rgb(242, 162, 42),

        amberDeep:
          rgb(172, 94, 22),

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
      0.07,

    objectShadowBlur:
      10,

    frameShadowBlur:
      9,

    outerGlowAlpha:
      0.42,

    outerGlowBlur:
      30,

    outerGlowSpread:
      1.14,

    outerGlowWarmth:
      0.62,

    outerGlowCold:
      0.48,

    outerGlowRimAlpha:
      0.24,

    glassAlpha:
      0.50,

    glassTransmission:
      0.80,

    centerGlassTransmission:
      0.95,

    apertureGlowAlpha:
      0.58,

    apertureSpecularAlpha:
      0.88,

    apertureInnerGlowAlpha:
      0.46,

    textureLineCount:
      5,

    textureSpeckCount:
      22,

    scratchLineCount:
      9,

    scratchAlpha:
      0.24,

    scratchLength:
      0.68,

    patinaIntensity:
      0.30,

    patinaSpeckCount:
      24,

    paneDefaultAlpha:
      0.46,

    paneDefaultAge:
      0.24,

    paneDefaultRefraction:
      0.54,

    paneDefaultInternalContrast:
      0.32,

    paneDefaultColdLight:
      0.42,

    paneDefaultWarmLight:
      0.24,

    paneDefaultSaturation:
      1.24,

    paneDefaultGlow:
      0.38,

    paneDefaultEdgeLight:
      0.42,

    paneDefaultJewelDepth:
      0.42,

    leadContrast:
      0.82,

    leadHighlight:
      0.34,

    leadPatina:
      0.28,

    frameGoldAccent:
      0.44,

    frameColdAccent:
      0.34,

    framePatina:
      0.34,

    apertureGoldDominance:
      0.72,

    apertureColdCounterlight:
      0.38,

    diamondVisibilityPriority:
      1
  });

  const PANE_VISUALS = Object.freeze({
    "crown-left":
      pane({
        role:
          "aged-moonstone-crown-glass-with-soft-scratches",

        material:
          "moonstone",

        alpha:
          0.42,

        transmission:
          0.82,

        age:
          0.22,

        refraction:
          0.68,

        internalContrast:
          0.24,

        coldLight:
          0.70,

        warmLight:
          0.18,

        phase:
          0.12,

        saturation:
          1.06,

        glow:
          0.52,

        edgeLight:
          0.54,

        jewelDepth:
          0.22,

        scratch:
          0.24,

        patina:
          0.10
      }),

    "crown-right":
      pane({
        role:
          "aged-opal-violet-crown-glass-with-soft-scratches",

        material:
          "paleViolet",

        alpha:
          0.44,

        transmission:
          0.78,

        age:
          0.24,

        refraction:
          0.64,

        internalContrast:
          0.28,

        coldLight:
          0.44,

        warmLight:
          0.30,

        phase:
          0.44,

        saturation:
          1.12,

        glow:
          0.48,

        edgeLight:
          0.50,

        jewelDepth:
          0.26,

        scratch:
          0.24,

        patina:
          0.12
      }),

    "upper-left-edge":
      pane({
        role:
          "aged-sapphire-outer-shoulder-glass-with-deeper-edge-wear",

        material:
          "sapphire",

        alpha:
          0.52,

        transmission:
          0.72,

        age:
          0.34,

        refraction:
          0.54,

        internalContrast:
          0.42,

        coldLight:
          0.50,

        warmLight:
          0.08,

        phase:
          0.82,

        saturation:
          1.34,

        glow:
          0.34,

        edgeLight:
          0.42,

        jewelDepth:
          0.52,

        scratch:
          0.34,

        patina:
          0.22
      }),

    "upper-right-edge":
      pane({
        role:
          "aged-violet-outer-shoulder-glass-with-deeper-edge-wear",

        material:
          "violet",

        alpha:
          0.50,

        transmission:
          0.72,

        age:
          0.32,

        refraction:
          0.54,

        internalContrast:
          0.40,

        coldLight:
          0.34,

        warmLight:
          0.30,

        phase:
          1.16,

        saturation:
          1.30,

        glow:
          0.36,

        edgeLight:
          0.42,

        jewelDepth:
          0.50,

        scratch:
          0.32,

        patina:
          0.20
      }),

    "upper-center-left":
      pane({
        role:
          "luminous-aquamarine-lens-approach-glass-with-light-wear",

        material:
          "aquamarine",

        alpha:
          0.46,

        transmission:
          0.80,

        age:
          0.20,

        refraction:
          0.64,

        internalContrast:
          0.30,

        coldLight:
          0.74,

        warmLight:
          0.12,

        phase:
          1.52,

        saturation:
          1.26,

        glow:
          0.54,

        edgeLight:
          0.50,

        jewelDepth:
          0.30,

        scratch:
          0.22,

        patina:
          0.08
      }),

    "upper-center-right":
      pane({
        role:
          "luminous-rose-lens-approach-glass-with-warm-age",

        material:
          "rose",

        alpha:
          0.46,

        transmission:
          0.78,

        age:
          0.22,

        refraction:
          0.60,

        internalContrast:
          0.32,

        coldLight:
          0.22,

        warmLight:
          0.56,

        phase:
          1.88,

        saturation:
          1.30,

        glow:
          0.48,

        edgeLight:
          0.46,

        jewelDepth:
          0.34,

        scratch:
          0.24,

        patina:
          0.10
      }),

    "mid-left-high":
      pane({
        role:
          "aged-deep-blue-left-outer-glass-with-visible-scratches",

        material:
          "blueDeep",

        alpha:
          0.54,

        transmission:
          0.68,

        age:
          0.38,

        refraction:
          0.52,

        internalContrast:
          0.48,

        coldLight:
          0.44,

        warmLight:
          0.06,

        phase:
          2.22,

        saturation:
          1.38,

        glow:
          0.30,

        edgeLight:
          0.40,

        jewelDepth:
          0.58,

        scratch:
          0.40,

        patina:
          0.26
      }),

    "mid-left-inner":
      pane({
        role:
          "aged-deep-violet-left-inner-glass-with-wear",

        material:
          "violetDeep",

        alpha:
          0.52,

        transmission:
          0.70,

        age:
          0.34,

        refraction:
          0.54,

        internalContrast:
          0.44,

        coldLight:
          0.30,

        warmLight:
          0.24,

        phase:
          2.58,

        saturation:
          1.34,

        glow:
          0.34,

        edgeLight:
          0.40,

        jewelDepth:
          0.54,

        scratch:
          0.36,

        patina:
          0.22
      }),

    "mid-center":
      pane({
        role:
          "clear-central-diamond-transmissive-lens-glass-with-minimal-age",

        material:
          "frost",

        alpha:
          0.24,

        transmission:
          0.96,

        age:
          0.08,

        refraction:
          0.76,

        internalContrast:
          0.16,

        coldLight:
          0.66,

        warmLight:
          0.42,

        phase:
          2.93,

        saturation:
          0.90,

        glow:
          0.42,

        edgeLight:
          0.66,

        jewelDepth:
          0.10,

        scratch:
          0.08,

        patina:
          0.02
      }),

    "mid-right-inner":
      pane({
        role:
          "aged-deep-cyan-right-inner-glass-with-wear",

        material:
          "cyanDeep",

        alpha:
          0.52,

        transmission:
          0.70,

        age:
          0.32,

        refraction:
          0.54,

        internalContrast:
          0.44,

        coldLight:
          0.60,

        warmLight:
          0.10,

        phase:
          3.18,

        saturation:
          1.34,

        glow:
          0.36,

        edgeLight:
          0.42,

        jewelDepth:
          0.52,

        scratch:
          0.34,

        patina:
          0.20
      }),

    "mid-right-high":
      pane({
        role:
          "aged-bright-blue-right-outer-glass-with-visible-scratches",

        material:
          "blue",

        alpha:
          0.54,

        transmission:
          0.68,

        age:
          0.36,

        refraction:
          0.52,

        internalContrast:
          0.46,

        coldLight:
          0.54,

        warmLight:
          0.08,

        phase:
          3.54,

        saturation:
          1.36,

        glow:
          0.34,

        edgeLight:
          0.42,

        jewelDepth:
          0.56,

        scratch:
          0.38,

        patina:
          0.24
      }),

    "lower-left-edge":
      pane({
        role:
          "aged-ruby-rose-lower-left-edge-glass-with-warm-wear",

        material:
          "ruby",

        alpha:
          0.54,

        transmission:
          0.68,

        age:
          0.38,

        refraction:
          0.50,

        internalContrast:
          0.48,

        coldLight:
          0.10,

        warmLight:
          0.64,

        phase:
          3.90,

        saturation:
          1.42,

        glow:
          0.34,

        edgeLight:
          0.42,

        jewelDepth:
          0.60,

        scratch:
          0.40,

        patina:
          0.26
      }),

    "lower-left-center":
      pane({
        role:
          "luminous-aged-cyan-lower-left-center-glass",

        material:
          "cyan",

        alpha:
          0.46,

        transmission:
          0.78,

        age:
          0.24,

        refraction:
          0.60,

        internalContrast:
          0.34,

        coldLight:
          0.68,

        warmLight:
          0.12,

        phase:
          4.23,

        saturation:
          1.28,

        glow:
          0.48,

        edgeLight:
          0.48,

        jewelDepth:
          0.34,

        scratch:
          0.26,

        patina:
          0.12
      }),

    "lower-right-center":
      pane({
        role:
          "luminous-aged-violet-lower-right-center-glass",

        material:
          "violet",

        alpha:
          0.46,

        transmission:
          0.76,

        age:
          0.24,

        refraction:
          0.58,

        internalContrast:
          0.34,

        coldLight:
          0.36,

        warmLight:
          0.34,

        phase:
          4.55,

        saturation:
          1.26,

        glow:
          0.46,

        edgeLight:
          0.46,

        jewelDepth:
          0.36,

        scratch:
          0.26,

        patina:
          0.12
      }),

    "lower-right-edge":
      pane({
        role:
          "aged-golden-amber-lower-right-edge-glass-with-warm-scratches",

        material:
          "goldGlass",

        alpha:
          0.52,

        transmission:
          0.70,

        age:
          0.34,

        refraction:
          0.50,

        internalContrast:
          0.44,

        coldLight:
          0.08,

        warmLight:
          0.72,

        phase:
          4.92,

        saturation:
          1.36,

        glow:
          0.42,

        edgeLight:
          0.42,

        jewelDepth:
          0.54,

        scratch:
          0.36,

        patina:
          0.22
      }),

    "lower-left-deep":
      pane({
        role:
          "aged-blue-lower-left-depth-glass-with-outer-wear",

        material:
          "blue",

        alpha:
          0.50,

        transmission:
          0.72,

        age:
          0.34,

        refraction:
          0.52,

        internalContrast:
          0.42,

        coldLight:
          0.52,

        warmLight:
          0.08,

        phase:
          5.24,

        saturation:
          1.32,

        glow:
          0.34,

        edgeLight:
          0.40,

        jewelDepth:
          0.50,

        scratch:
          0.36,

        patina:
          0.22
      }),

    "lower-center-left":
      pane({
        role:
          "aged-opal-violet-lower-center-left-glass",

        material:
          "paleViolet",

        alpha:
          0.44,

        transmission:
          0.78,

        age:
          0.26,

        refraction:
          0.56,

        internalContrast:
          0.32,

        coldLight:
          0.38,

        warmLight:
          0.34,

        phase:
          5.56,

        saturation:
          1.20,

        glow:
          0.44,

        edgeLight:
          0.44,

        jewelDepth:
          0.34,

        scratch:
          0.28,

        patina:
          0.14
      }),

    "lower-center-right":
      pane({
        role:
          "aged-bright-rose-lower-center-right-glass",

        material:
          "rose",

        alpha:
          0.44,

        transmission:
          0.78,

        age:
          0.26,

        refraction:
          0.56,

        internalContrast:
          0.32,

        coldLight:
          0.18,

        warmLight:
          0.56,

        phase:
          5.92,

        saturation:
          1.24,

        glow:
          0.44,

        edgeLight:
          0.44,

        jewelDepth:
          0.36,

        scratch:
          0.28,

        patina:
          0.14
      }),

    "lower-right-deep":
      pane({
        role:
          "aged-deep-cyan-lower-right-depth-glass-with-outer-wear",

        material:
          "cyanDeep",

        alpha:
          0.50,

        transmission:
          0.72,

        age:
          0.34,

        refraction:
          0.52,

        internalContrast:
          0.42,

        coldLight:
          0.62,

        warmLight:
          0.08,

        phase:
          6.23,

        saturation:
          1.32,

        glow:
          0.36,

        edgeLight:
          0.40,

        jewelDepth:
          0.50,

        scratch:
          0.36,

        patina:
          0.22
      }),

    "base-left":
      pane({
        role:
          "aged-molten-amber-foundation-left-glass-with-heavy-base-wear",

        material:
          "amberDeep",

        alpha:
          0.50,

        transmission:
          0.72,

        age:
          0.38,

        refraction:
          0.50,

        internalContrast:
          0.42,

        coldLight:
          0.08,

        warmLight:
          0.68,

        phase:
          6.54,

        saturation:
          1.30,

        glow:
          0.38,

        edgeLight:
          0.40,

        jewelDepth:
          0.50,

        scratch:
          0.42,

        patina:
          0.28
      }),

    "base-right":
      pane({
        role:
          "aged-deep-sapphire-foundation-right-glass-with-heavy-base-wear",

        material:
          "blueDeep",

        alpha:
          0.50,

        transmission:
          0.72,

        age:
          0.38,

        refraction:
          0.50,

        internalContrast:
          0.42,

        coldLight:
          0.56,

        warmLight:
          0.08,

        phase:
          6.88,

        saturation:
          1.30,

        glow:
          0.36,

        edgeLight:
          0.40,

        jewelDepth:
          0.50,

        scratch:
          0.42,

        patina:
          0.28
      })
  });

  const STATE_PROFILES = Object.freeze({
    closed:
      Object.freeze({
        opacityMultiplier:
          1,

        densityMultiplier:
          0.94,

        apertureMultiplier:
          1.16,

        paneGlowMultiplier:
          1.04,

        frameContrastMultiplier:
          0.88,

        outerGlowMultiplier:
          1.12,

        ageMultiplier:
          1
      }),

    opening:
      Object.freeze({
        opacityMultiplier:
          1,

        densityMultiplier:
          0.76,

        apertureMultiplier:
          1.22,

        paneGlowMultiplier:
          1.12,

        frameContrastMultiplier:
          0.80,

        outerGlowMultiplier:
          1.24,

        ageMultiplier:
          0.88
      }),

    closing:
      Object.freeze({
        opacityMultiplier:
          1,

        densityMultiplier:
          0.86,

        apertureMultiplier:
          1.16,

        paneGlowMultiplier:
          1,

        frameContrastMultiplier:
          0.86,

        outerGlowMultiplier:
          1.08,

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
          "make the Window read as aged luminous stained glass with visible atmosphere around the outer arch",

        densityGoal:
          "retain jewel color while avoiding opaque painted-stone darkness",

        glassGoal:
          "aged translucent pane identities with controlled scratches, refraction, and warm/cold light",

        haloGoal:
          "emit a warm-cool rim glow around the full object so the outer edge separates from the dark atmosphere",

        patinaGoal:
          "add old metal patina and glass wear without dirtying the center Diamond lens",

        apertureGoal:
          "chrome-gold focal threshold with strong rim light while keeping Diamond visibility",

        frameGoal:
          "aged dark metal frame with gold, cold-edge, copper, and verdigris accents",

        cameGoal:
          "lead/came lines remain structural but less dominant than the glass",

        textureGoal:
          "visible antique glass scratches and specks without noisy surface collapse",

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
          "window-definition-published-aged-halation-patina-renewal",

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
          "definition-published-after-host-detected-aged-halation-patina-renewal"
        );
      } catch (_) {}
    }

    return true;
  }

  publish();
})();
