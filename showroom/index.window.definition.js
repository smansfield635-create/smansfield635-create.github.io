/* TARGET FILE: /showroom/index.window.definition.js */
/* COMPLETE NEW FILE */
/* SHOWROOM_WINDOW_OBJECT_DEFINITION_v1_FOREGROUND_LENS_SPLENDOR_AUTHORITY */

/*
  Mirrorland Window Definition Authority

  Purpose:
  - Define the visual splendor layer for the compatible v1_3 Window object host.
  - Publish pane-by-pane stained-glass material roles, optical values, frame/came doctrine,
    aperture chrome-gold doctrine, surface texture, and state profiles.
  - Preserve the host/controller contract by changing no lifecycle behavior.
  - Never own button behavior, Window open/close behavior, Diamond behavior, route state,
    orbit gestures, Compass, stars, CSS layout, or broad page state.

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
      "foreground-lens-stained-glass-splendor-authority",

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

  const MATERIALS = Object.freeze({
    frame:
      Object.freeze({
        shadow:
          Object.freeze([1, 2, 6]),

        black:
          Object.freeze([8, 10, 16]),

        body:
          Object.freeze([27, 31, 40]),

        bevel:
          Object.freeze([86, 86, 88]),

        gold:
          Object.freeze([184, 130, 64]),

        goldBright:
          Object.freeze([245, 194, 108]),

        patina:
          Object.freeze([38, 84, 82]),

        coldEdge:
          Object.freeze([112, 154, 162])
      }),

    lead:
      Object.freeze({
        shadow:
          Object.freeze([4, 5, 10]),

        dark:
          Object.freeze([13, 15, 21]),

        body:
          Object.freeze([34, 36, 43]),

        bevel:
          Object.freeze([88, 88, 90]),

        highlight:
          Object.freeze([176, 164, 126]),

        goldHairline:
          Object.freeze([248, 202, 116])
      }),

    aperture:
      Object.freeze({
        wall:
          Object.freeze([4, 5, 9]),

        deepBronze:
          Object.freeze([112, 66, 27]),

        bronze:
          Object.freeze([166, 100, 38]),

        gold:
          Object.freeze([238, 166, 56]),

        chromeGold:
          Object.freeze([255, 207, 78]),

        bright:
          Object.freeze([255, 232, 142]),

        whiteGold:
          Object.freeze([255, 249, 214]),

        cold:
          Object.freeze([144, 218, 234]),

        coldEdge:
          Object.freeze([96, 186, 216]),

        innerLight:
          Object.freeze([255, 222, 120])
      }),

    glass:
      Object.freeze({
        frost:
          Object.freeze([166, 228, 230]),

        aquamarine:
          Object.freeze([76, 210, 210]),

        cyan:
          Object.freeze([58, 182, 196]),

        cyanDeep:
          Object.freeze([20, 122, 142]),

        blue:
          Object.freeze([48, 100, 178]),

        blueDeep:
          Object.freeze([18, 48, 118]),

        sapphire:
          Object.freeze([32, 76, 164]),

        violet:
          Object.freeze([118, 78, 176]),

        violetDeep:
          Object.freeze([64, 42, 118]),

        paleViolet:
          Object.freeze([164, 128, 206]),

        rose:
          Object.freeze([174, 74, 116]),

        roseDeep:
          Object.freeze([110, 38, 78]),

        amber:
          Object.freeze([214, 140, 48]),

        amberDeep:
          Object.freeze([128, 76, 24]),

        emerald:
          Object.freeze([52, 156, 126]),

        emeraldDeep:
          Object.freeze([20, 94, 80])
      })
  });

  const OPTICAL = Object.freeze({
    objectShadowAlpha:
      0.17,

    objectShadowBlur:
      16,

    frameShadowBlur:
      13,

    glassAlpha:
      0.42,

    glassTransmission:
      0.70,

    centerGlassTransmission:
      0.92,

    apertureGlowAlpha:
      0.48,

    apertureSpecularAlpha:
      0.78,

    apertureInnerGlowAlpha:
      0.34,

    textureLineCount:
      3,

    textureSpeckCount:
      14,

    paneDefaultAlpha:
      0.38,

    paneDefaultAge:
      0.26,

    paneDefaultRefraction:
      0.38,

    paneDefaultInternalContrast:
      0.22,

    paneDefaultColdLight:
      0.22,

    paneDefaultWarmLight:
      0.10
  });

  const PANE_VISUALS = Object.freeze({
    "crown-left":
      Object.freeze({
        role:
          "upper-frosted-crown-glass",

        material:
          "frost",

        alpha:
          0.38,

        transmission:
          0.76,

        age:
          0.18,

        refraction:
          0.48,

        internalContrast:
          0.18,

        coldLight:
          0.34,

        warmLight:
          0.08,

        phase:
          0.12
      }),

    "crown-right":
      Object.freeze({
        role:
          "upper-violet-crown-glass",

        material:
          "paleViolet",

        alpha:
          0.38,

        transmission:
          0.74,

        age:
          0.20,

        refraction:
          0.44,

        internalContrast:
          0.18,

        coldLight:
          0.24,

        warmLight:
          0.10,

        phase:
          0.44
      }),

    "upper-left-edge":
      Object.freeze({
        role:
          "outer-sapphire-shoulder-glass",

        material:
          "sapphire",

        alpha:
          0.42,

        transmission:
          0.66,

        age:
          0.30,

        refraction:
          0.36,

        internalContrast:
          0.28,

        coldLight:
          0.20,

        warmLight:
          0.05,

        phase:
          0.82
      }),

    "upper-right-edge":
      Object.freeze({
        role:
          "outer-violet-shoulder-glass",

        material:
          "violet",

        alpha:
          0.41,

        transmission:
          0.66,

        age:
          0.29,

        refraction:
          0.36,

        internalContrast:
          0.26,

        coldLight:
          0.18,

        warmLight:
          0.10,

        phase:
          1.16
      }),

    "upper-center-left":
      Object.freeze({
        role:
          "cool-lens-approach-glass",

        material:
          "aquamarine",

        alpha:
          0.36,

        transmission:
          0.78,

        age:
          0.18,

        refraction:
          0.44,

        internalContrast:
          0.18,

        coldLight:
          0.34,

        warmLight:
          0.06,

        phase:
          1.52
      }),

    "upper-center-right":
      Object.freeze({
        role:
          "warm-lens-approach-glass",

        material:
          "rose",

        alpha:
          0.37,

        transmission:
          0.76,

        age:
          0.20,

        refraction:
          0.40,

        internalContrast:
          0.20,

        coldLight:
          0.12,

        warmLight:
          0.20,

        phase:
          1.88
      }),

    "mid-left-high":
      Object.freeze({
        role:
          "deep-left-outer-glass",

        material:
          "blueDeep",

        alpha:
          0.44,

        transmission:
          0.62,

        age:
          0.34,

        refraction:
          0.34,

        internalContrast:
          0.32,

        coldLight:
          0.20,

        warmLight:
          0.04,

        phase:
          2.22
      }),

    "mid-left-inner":
      Object.freeze({
        role:
          "violet-left-inner-glass",

        material:
          "violetDeep",

        alpha:
          0.40,

        transmission:
          0.68,

        age:
          0.28,

        refraction:
          0.36,

        internalContrast:
          0.26,

        coldLight:
          0.16,

        warmLight:
          0.10,

        phase:
          2.58
      }),

    "mid-center":
      Object.freeze({
        role:
          "central-transmissive-lens-glass",

        material:
          "frost",

        alpha:
          0.24,

        transmission:
          0.94,

        age:
          0.12,

        refraction:
          0.60,

        internalContrast:
          0.14,

        coldLight:
          0.40,

        warmLight:
          0.22,

        phase:
          2.93
      }),

    "mid-right-inner":
      Object.freeze({
        role:
          "cyan-right-inner-glass",

        material:
          "cyanDeep",

        alpha:
          0.40,

        transmission:
          0.68,

        age:
          0.26,

        refraction:
          0.36,

        internalContrast:
          0.24,

        coldLight:
          0.24,

        warmLight:
          0.06,

        phase:
          3.18
      }),

    "mid-right-high":
      Object.freeze({
        role:
          "blue-right-outer-glass",

        material:
          "blue",

        alpha:
          0.42,

        transmission:
          0.64,

        age:
          0.30,

        refraction:
          0.35,

        internalContrast:
          0.28,

        coldLight:
          0.22,

        warmLight:
          0.04,

        phase:
          3.54
      }),

    "lower-left-edge":
      Object.freeze({
        role:
          "rose-lower-left-edge-glass",

        material:
          "roseDeep",

        alpha:
          0.43,

        transmission:
          0.62,

        age:
          0.34,

        refraction:
          0.34,

        internalContrast:
          0.28,

        coldLight:
          0.08,

        warmLight:
          0.22,

        phase:
          3.90
      }),

    "lower-left-center":
      Object.freeze({
        role:
          "cyan-lower-left-center-glass",

        material:
          "cyan",

        alpha:
          0.37,

        transmission:
          0.76,

        age:
          0.22,

        refraction:
          0.42,

        internalContrast:
          0.20,

        coldLight:
          0.30,

        warmLight:
          0.06,

        phase:
          4.23
      }),

    "lower-right-center":
      Object.freeze({
        role:
          "violet-lower-right-center-glass",

        material:
          "violet",

        alpha:
          0.37,

        transmission:
          0.74,

        age:
          0.22,

        refraction:
          0.40,

        internalContrast:
          0.20,

        coldLight:
          0.16,

        warmLight:
          0.12,

        phase:
          4.55
      }),

    "lower-right-edge":
      Object.freeze({
        role:
          "amber-lower-right-edge-glass",

        material:
          "amber",

        alpha:
          0.42,

        transmission:
          0.64,

        age:
          0.30,

        refraction:
          0.34,

        internalContrast:
          0.26,

        coldLight:
          0.06,

        warmLight:
          0.28,

        phase:
          4.92
      }),

    "lower-left-deep":
      Object.freeze({
        role:
          "blue-lower-left-depth-glass",

        material:
          "blue",

        alpha:
          0.42,

        transmission:
          0.64,

        age:
          0.32,

        refraction:
          0.34,

        internalContrast:
          0.28,

        coldLight:
          0.22,

        warmLight:
          0.04,

        phase:
          5.24
      }),

    "lower-center-left":
      Object.freeze({
        role:
          "pale-violet-lower-center-glass",

        material:
          "paleViolet",

        alpha:
          0.38,

        transmission:
          0.72,

        age:
          0.24,

        refraction:
          0.38,

        internalContrast:
          0.20,

        coldLight:
          0.18,

        warmLight:
          0.14,

        phase:
          5.56
      }),

    "lower-center-right":
      Object.freeze({
        role:
          "rose-lower-center-glass",

        material:
          "rose",

        alpha:
          0.38,

        transmission:
          0.72,

        age:
          0.24,

        refraction:
          0.38,

        internalContrast:
          0.20,

        coldLight:
          0.10,

        warmLight:
          0.20,

        phase:
          5.92
      }),

    "lower-right-deep":
      Object.freeze({
        role:
          "cyan-lower-right-depth-glass",

        material:
          "cyanDeep",

        alpha:
          0.41,

        transmission:
          0.66,

        age:
          0.30,

        refraction:
          0.34,

        internalContrast:
          0.26,

        coldLight:
          0.26,

        warmLight:
          0.04,

        phase:
          6.23
      }),

    "base-left":
      Object.freeze({
        role:
          "amber-foundation-left-glass",

        material:
          "amberDeep",

        alpha:
          0.40,

        transmission:
          0.66,

        age:
          0.32,

        refraction:
          0.34,

        internalContrast:
          0.26,

        coldLight:
          0.06,

        warmLight:
          0.26,

        phase:
          6.54
      }),

    "base-right":
      Object.freeze({
        role:
          "blue-foundation-right-glass",

        material:
          "blueDeep",

        alpha:
          0.40,

        transmission:
          0.66,

        age:
          0.30,

        refraction:
          0.34,

        internalContrast:
          0.26,

        coldLight:
          0.22,

        warmLight:
          0.04,

        phase:
          6.88
      })
  });

  const STATE_PROFILES = Object.freeze({
    closed:
      Object.freeze({
        opacityMultiplier:
          1,

        densityMultiplier:
          0.96,

        apertureMultiplier:
          1.14
      }),

    opening:
      Object.freeze({
        opacityMultiplier:
          1,

        densityMultiplier:
          0.78,

        apertureMultiplier:
          1.18
      }),

    closing:
      Object.freeze({
        opacityMultiplier:
          1,

        densityMultiplier:
          0.88,

        apertureMultiplier:
          1.16
      }),

    open:
      Object.freeze({
        opacityMultiplier:
          0,

        densityMultiplier:
          0,

        apertureMultiplier:
          0
      })
  });

  const DEFINITION = Object.freeze({
    contractId:
      CONTRACT.id,

    id:
      CONTRACT.id,

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
          "restore stained-glass splendor while preserving Window controller compatibility and Diamond visibility",

        densityGoal:
          "richer than the minimal host fallback without reintroducing blackout",

        glassGoal:
          "luminous pane separation with transmissive center lens",

        apertureGoal:
          "chrome-gold focal threshold with cool highlight balance",

        frameGoal:
          "dark readable metal with gold/cold-edge highlights",

        cameGoal:
          "structured lead lines with restrained bevel and enough contrast for pane definition",

        textureGoal:
          "surface age as detail, not noise",

        lifecycleGoal:
          "definition changes image only and never changes open/restore behavior"
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

    return {
      valid:
        paneIdsComplete &&
        materialGroupsComplete &&
        stateProfilesComplete,

      paneDefinitionCount:
        paneKeys.length,

      paneIdsComplete,
      materialGroupsComplete,
      stateProfilesComplete
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

        lastAction:
          "window-definition-published",

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
          "definition-published-after-host-detected"
        );
      } catch (_) {}
    }

    return true;
  }

  publish();
})();
