/* TARGET FILE: /showroom/index.window.definition.js */
/* COMPLETE NEW FILE */
/* SHOWROOM_WINDOW_OBJECT_DEFINITION_v1_FOREGROUND_LENS_IMAGE_AUTHORITY */

/*
  Mirrorland Window Object Definition Authority

  Purpose:
  - Define the Window object's visual/material doctrine.
  - Build on /showroom/index.window.js as the geometry/render host.
  - Provide pane material roles, glass transmission, frame doctrine, came doctrine,
    aperture chrome-gold doctrine, texture/age doctrine, and visual state profiles.
  - Publish a stable definition object for the Window host to consume.
  - Remain strictly object-level.
  - Own no stage, Diamond placement, controls, routes, gestures, CSS layout,
    broad page state, Compass, stars, or renderer lifecycle.

  Required consumer:
  - /showroom/index.window.js
  - SHOWROOM_WINDOW_OBJECT_v1_4_DEFINITION_CONSUMER_GEOMETRY_HOST

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
      "SHOWROOM_WINDOW_OBJECT_DEFINITION_v1_FOREGROUND_LENS_IMAGE_AUTHORITY",

    file:
      "/showroom/index.window.definition.js",

    publicSurface:
      "SHOWROOM_MIRRORLAND_WINDOW_DEFINITION",

    receiptSurface:
      "SHOWROOM_MIRRORLAND_WINDOW_DEFINITION_RECEIPT",

    requiredWindowHostContract:
      "SHOWROOM_WINDOW_OBJECT_v1_4_DEFINITION_CONSUMER_GEOMETRY_HOST",

    requiredWindowHostFile:
      "/showroom/index.window.js",

    role:
      "window-object-image-material-definition-authority",

    definitionClass:
      "foreground-lens-stained-glass-aperture-material-authority",

    scope:
      "object-definition-only",

    ownsGeometry:
      false,

    ownsCanvas:
      false,

    ownsRendererLifecycle:
      false,

    ownsWindowLifecycle:
      false,

    ownsStage:
      false,

    ownsDiamondPlacement:
      false,

    ownsDiamond:
      false,

    ownsButton:
      false,

    ownsControls:
      false,

    ownsRoutes:
      false,

    ownsGestures:
      false,

    ownsCssLayout:
      false,

    ownsPageState:
      false,

    ownsCompass:
      false,

    ownsStars:
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
      "SHOWROOM_MIRRORLAND_WINDOW_DEFINITION_READY",

    FAILURE:
      "SHOWROOM_MIRRORLAND_WINDOW_DEFINITION_FAILURE"
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
          Object.freeze([2, 3, 7]),

        black:
          Object.freeze([9, 11, 17]),

        body:
          Object.freeze([29, 34, 43]),

        bevel:
          Object.freeze([74, 75, 78]),

        gold:
          Object.freeze([174, 122, 60]),

        goldBright:
          Object.freeze([236, 184, 101]),

        patina:
          Object.freeze([36, 78, 78]),

        coldEdge:
          Object.freeze([104, 141, 146])
      }),

    lead:
      Object.freeze({
        shadow:
          Object.freeze([5, 6, 11]),

        dark:
          Object.freeze([14, 16, 22]),

        body:
          Object.freeze([34, 36, 42]),

        bevel:
          Object.freeze([82, 82, 84]),

        highlight:
          Object.freeze([166, 153, 118]),

        goldHairline:
          Object.freeze([244, 196, 112])
      }),

    aperture:
      Object.freeze({
        wall:
          Object.freeze([4, 5, 9]),

        deepBronze:
          Object.freeze([104, 64, 26]),

        bronze:
          Object.freeze([151, 94, 36]),

        gold:
          Object.freeze([232, 164, 63]),

        chromeGold:
          Object.freeze([255, 204, 86]),

        bright:
          Object.freeze([255, 229, 150]),

        whiteGold:
          Object.freeze([255, 247, 209]),

        cold:
          Object.freeze([135, 205, 220]),

        coldEdge:
          Object.freeze([92, 178, 204]),

        innerLight:
          Object.freeze([255, 218, 114])
      }),

    glass:
      Object.freeze({
        frost:
          Object.freeze([151, 213, 218]),

        cyan:
          Object.freeze([68, 184, 196]),

        cyanDeep:
          Object.freeze([27, 126, 142]),

        blue:
          Object.freeze([50, 95, 166]),

        blueDeep:
          Object.freeze([22, 50, 111]),

        violet:
          Object.freeze([112, 74, 164]),

        violetDeep:
          Object.freeze([66, 45, 112]),

        rose:
          Object.freeze([166, 76, 110]),

        roseDeep:
          Object.freeze([108, 42, 76]),

        amber:
          Object.freeze([193, 130, 54]),

        amberDeep:
          Object.freeze([130, 82, 32]),

        paleViolet:
          Object.freeze([160, 130, 194])
      })
  });

  const OPTICAL = Object.freeze({
    objectShadowAlpha:
      0.165,

    objectShadowBlur:
      16,

    frameShadowBlur:
      13,

    glassAlpha:
      0.34,

    glassTransmission:
      0.68,

    centerGlassTransmission:
      0.86,

    apertureGlowAlpha:
      0.38,

    apertureSpecularAlpha:
      0.70,

    apertureInnerGlowAlpha:
      0.26,

    textureLineCount:
      3,

    textureSpeckCount:
      14,

    paneDefaultAlpha:
      0.34,

    paneDefaultAge:
      0.28,

    paneDefaultRefraction:
      0.34,

    paneDefaultInternalContrast:
      0.20,

    paneDefaultColdLight:
      0.18,

    paneDefaultWarmLight:
      0.08
  });

  const PANE_VISUALS = Object.freeze({
    "crown-left":
      Object.freeze({
        material:
          "frost",

        role:
          "upper-cool-entry-glass",

        alpha:
          0.32,

        transmission:
          0.72,

        refraction:
          0.40,

        coldLight:
          0.30,

        warmLight:
          0.06,

        age:
          0.24,

        internalContrast:
          0.18,

        phase:
          0.12
      }),

    "crown-right":
      Object.freeze({
        material:
          "paleViolet",

        role:
          "upper-soft-counterglass",

        alpha:
          0.32,

        transmission:
          0.72,

        refraction:
          0.38,

        coldLight:
          0.22,

        warmLight:
          0.08,

        age:
          0.24,

        internalContrast:
          0.18,

        phase:
          0.44
      }),

    "upper-left-edge":
      Object.freeze({
        material:
          "blue",

        role:
          "left-upper-depth-anchor",

        alpha:
          0.37,

        transmission:
          0.64,

        refraction:
          0.32,

        coldLight:
          0.20,

        warmLight:
          0.06,

        age:
          0.34,

        internalContrast:
          0.24,

        phase:
          0.82
      }),

    "upper-right-edge":
      Object.freeze({
        material:
          "violet",

        role:
          "right-upper-depth-anchor",

        alpha:
          0.36,

        transmission:
          0.64,

        refraction:
          0.32,

        coldLight:
          0.18,

        warmLight:
          0.08,

        age:
          0.33,

        internalContrast:
          0.23,

        phase:
          1.16
      }),

    "upper-center-left":
      Object.freeze({
        material:
          "cyan",

        role:
          "aperture-approach-cool-glass",

        alpha:
          0.30,

        transmission:
          0.77,

        refraction:
          0.42,

        coldLight:
          0.32,

        warmLight:
          0.06,

        age:
          0.22,

        internalContrast:
          0.16,

        phase:
          1.52
      }),

    "upper-center-right":
      Object.freeze({
        material:
          "rose",

        role:
          "aperture-approach-warm-glass",

        alpha:
          0.31,

        transmission:
          0.75,

        refraction:
          0.38,

        coldLight:
          0.14,

        warmLight:
          0.18,

        age:
          0.23,

        internalContrast:
          0.16,

        phase:
          1.88
      }),

    "mid-left-high":
      Object.freeze({
        material:
          "blueDeep",

        role:
          "left-mid-depth-reservoir",

        alpha:
          0.38,

        transmission:
          0.61,

        refraction:
          0.30,

        coldLight:
          0.18,

        warmLight:
          0.05,

        age:
          0.38,

        internalContrast:
          0.25,

        phase:
          2.22
      }),

    "mid-left-inner":
      Object.freeze({
        material:
          "violetDeep",

        role:
          "left-aperture-shadow-balance",

        alpha:
          0.34,

        transmission:
          0.68,

        refraction:
          0.32,

        coldLight:
          0.14,

        warmLight:
          0.08,

        age:
          0.32,

        internalContrast:
          0.20,

        phase:
          2.58
      }),

    "mid-center":
      Object.freeze({
        material:
          "frost",

        role:
          "central-transmissive-lens",

        alpha:
          0.22,

        transmission:
          0.90,

        refraction:
          0.56,

        coldLight:
          0.38,

        warmLight:
          0.14,

        age:
          0.16,

        internalContrast:
          0.12,

        phase:
          2.93
      }),

    "mid-right-inner":
      Object.freeze({
        material:
          "cyanDeep",

        role:
          "right-aperture-cool-balance",

        alpha:
          0.33,

        transmission:
          0.69,

        refraction:
          0.34,

        coldLight:
          0.24,

        warmLight:
          0.06,

        age:
          0.30,

        internalContrast:
          0.19,

        phase:
          3.18
      }),

    "mid-right-high":
      Object.freeze({
        material:
          "blue",

        role:
          "right-mid-depth-reservoir",

        alpha:
          0.36,

        transmission:
          0.64,

        refraction:
          0.31,

        coldLight:
          0.20,

        warmLight:
          0.06,

        age:
          0.34,

        internalContrast:
          0.24,

        phase:
          3.54
      }),

    "lower-left-edge":
      Object.freeze({
        material:
          "roseDeep",

        role:
          "lower-left-warm-shadow",

        alpha:
          0.37,

        transmission:
          0.62,

        refraction:
          0.29,

        coldLight:
          0.08,

        warmLight:
          0.20,

        age:
          0.38,

        internalContrast:
          0.24,

        phase:
          3.90
      }),

    "lower-left-center":
      Object.freeze({
        material:
          "cyan",

        role:
          "lower-left-return-light",

        alpha:
          0.31,

        transmission:
          0.76,

        refraction:
          0.39,

        coldLight:
          0.30,

        warmLight:
          0.06,

        age:
          0.24,

        internalContrast:
          0.16,

        phase:
          4.23
      }),

    "lower-right-center":
      Object.freeze({
        material:
          "violet",

        role:
          "lower-right-return-light",

        alpha:
          0.32,

        transmission:
          0.74,

        refraction:
          0.36,

        coldLight:
          0.18,

        warmLight:
          0.10,

        age:
          0.24,

        internalContrast:
          0.17,

        phase:
          4.55
      }),

    "lower-right-edge":
      Object.freeze({
        material:
          "amber",

        role:
          "lower-right-warm-counterweight",

        alpha:
          0.36,

        transmission:
          0.65,

        refraction:
          0.30,

        coldLight:
          0.06,

        warmLight:
          0.26,

        age:
          0.34,

        internalContrast:
          0.22,

        phase:
          4.92
      }),

    "lower-left-deep":
      Object.freeze({
        material:
          "blue",

        role:
          "left-lower-depth-return",

        alpha:
          0.36,

        transmission:
          0.64,

        refraction:
          0.30,

        coldLight:
          0.20,

        warmLight:
          0.05,

        age:
          0.36,

        internalContrast:
          0.23,

        phase:
          5.24
      }),

    "lower-center-left":
      Object.freeze({
        material:
          "paleViolet",

        role:
          "lower-center-left-soft-lens",

        alpha:
          0.32,

        transmission:
          0.72,

        refraction:
          0.36,

        coldLight:
          0.20,

        warmLight:
          0.08,

        age:
          0.26,

        internalContrast:
          0.16,

        phase:
          5.56
      }),

    "lower-center-right":
      Object.freeze({
        material:
          "rose",

        role:
          "lower-center-right-soft-lens",

        alpha:
          0.32,

        transmission:
          0.72,

        refraction:
          0.35,

        coldLight:
          0.12,

        warmLight:
          0.17,

        age:
          0.26,

        internalContrast:
          0.16,

        phase:
          5.92
      }),

    "lower-right-deep":
      Object.freeze({
        material:
          "cyanDeep",

        role:
          "right-lower-depth-return",

        alpha:
          0.35,

        transmission:
          0.67,

        refraction:
          0.32,

        coldLight:
          0.24,

        warmLight:
          0.06,

        age:
          0.34,

        internalContrast:
          0.21,

        phase:
          6.23
      }),

    "base-left":
      Object.freeze({
        material:
          "amberDeep",

        role:
          "left-base-warm-ground",

        alpha:
          0.35,

        transmission:
          0.66,

        refraction:
          0.29,

        coldLight:
          0.05,

        warmLight:
          0.24,

        age:
          0.38,

        internalContrast:
          0.22,

        phase:
          6.54
      }),

    "base-right":
      Object.freeze({
        material:
          "blueDeep",

        role:
          "right-base-cool-ground",

        alpha:
          0.35,

        transmission:
          0.66,

        refraction:
          0.29,

        coldLight:
          0.20,

        warmLight:
          0.05,

        age:
          0.36,

        internalContrast:
          0.22,

        phase:
          6.88
      })
  });

  const STATE_PROFILES = Object.freeze({
    closed:
      Object.freeze({
        label:
          "closed-readable-foreground-lens",

        opacityMultiplier:
          1,

        densityMultiplier:
          0.92,

        apertureMultiplier:
          1.08,

        intent:
          "Window remains present, readable, transmissive, and not blackout-dense."
      }),

    opening:
      Object.freeze({
        label:
          "opening-glass-releases-before-threshold",

        opacityMultiplier:
          1,

        densityMultiplier:
          0.78,

        apertureMultiplier:
          1.12,

        intent:
          "Glass and came density release while the aperture remains visually coherent until dormancy."
      }),

    closing:
      Object.freeze({
        label:
          "closing-threshold-reconstitutes-first",

        opacityMultiplier:
          1,

        densityMultiplier:
          0.84,

        apertureMultiplier:
          1.10,

        intent:
          "Aperture and frame reconstitute before full pane density returns."
      }),

    open:
      Object.freeze({
        label:
          "open-dormant-no-residual-surface",

        opacityMultiplier:
          0,

        densityMultiplier:
          0,

        apertureMultiplier:
          0,

        intent:
          "Window object must be dormant with no residual pane, shadow, or black surface."
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
      CONTRACT.file,

    role:
      CONTRACT.role,

    definitionClass:
      CONTRACT.definitionClass,

    consumer:
      Object.freeze({
        requiredWindowHostContract:
          CONTRACT.requiredWindowHostContract,

        requiredWindowHostFile:
          CONTRACT.requiredWindowHostFile,

        surface:
          "globalThis.SHOWROOM_MIRRORLAND_WINDOW_OBJECT",

        consumeMethod:
          "definition-consumer-scan-and-ready-event"
      }),

    doctrine:
      Object.freeze({
        visualGoal:
          "foreground-stained-glass-lens-with-readable-central-aperture",

        densityCorrection:
          "reduce-blackout-density-without-making-the-object-flat",

        focalHierarchy:
          "aperture-first-frame-second-glass-third-surface-age-last",

        glassModel:
          "transmissive-colored-lens-plates",

        frameModel:
          "dimensional-dark-metal-with-restrained-gold-bevel",

        cameModel:
          "lead-came-structure-present-but-not-crushing",

        apertureModel:
          "chrome-gold-diamond-threshold",

        surfaceAgeModel:
          "light-weathering-only-no-muddy-black-noise",

        openStateModel:
          "true-visual-dormancy"
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
        ownsGeometry:
          false,

        ownsCanvas:
          false,

        ownsRendererLifecycle:
          false,

        ownsWindowLifecycle:
          false,

        ownsStage:
          false,

        ownsDiamondPlacement:
          false,

        ownsDiamond:
          false,

        ownsButton:
          false,

        ownsControls:
          false,

        ownsRoutes:
          false,

        ownsGestures:
          false,

        ownsCssLayout:
          false,

        ownsPageState:
          false,

        ownsCompass:
          false,

        ownsStars:
          false
      }),

    validation:
      Object.freeze({
        expectedPaneCount:
          21,

        expectedPaneIds:
          EXPECTED_PANE_IDS,

        materialGroups:
          Object.freeze([
            "frame",
            "lead",
            "aperture",
            "glass"
          ]),

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

    ownsGeometry:
      false,

    ownsCanvas:
      false,

    ownsRendererLifecycle:
      false,

    ownsWindowLifecycle:
      false,

    ownsStage:
      false,

    ownsDiamondPlacement:
      false,

    ownsDiamond:
      false,

    ownsButton:
      false,

    ownsControls:
      false,

    ownsRoutes:
      false,

    ownsGestures:
      false,

    ownsCssLayout:
      false,

    ownsPageState:
      false,

    ownsCompass:
      false,

    ownsStars:
      false,

    lastAction:
      "",

    lastFailure:
      null
  };

  function dispatch(
    type,
    detail = {}
  ) {
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

  function getOwnKeys(value) {
    if (
      !value ||
      typeof value !== "object"
    ) {
      return [];
    }

    return Object.keys(value);
  }

  function validateDefinition() {
    const paneVisualKeys =
      getOwnKeys(PANE_VISUALS);

    const paneIdsComplete =
      EXPECTED_PANE_IDS.every(
        id => Object.prototype.hasOwnProperty.call(
          PANE_VISUALS,
          id
        )
      );

    const materialGroupsComplete =
      ["frame", "lead", "aperture", "glass"].every(
        key => Object.prototype.hasOwnProperty.call(
          MATERIALS,
          key
        )
      );

    const stateProfilesComplete =
      ["closed", "opening", "open", "closing"].every(
        key => Object.prototype.hasOwnProperty.call(
          STATE_PROFILES,
          key
        )
      );

    const result =
      Object.freeze({
        valid:
          paneVisualKeys.length === EXPECTED_PANE_IDS.length &&
          paneIdsComplete &&
          materialGroupsComplete &&
          stateProfilesComplete,

        paneDefinitionCount:
          paneVisualKeys.length,

        expectedPaneCount:
          EXPECTED_PANE_IDS.length,

        paneIdsComplete,
        materialGroupsComplete,
        stateProfilesComplete
      });

    return result;
  }

  function updateReceipt(extra = {}) {
    Object.assign(
      receipt,
      extra
    );

    globalThis.SHOWROOM_MIRRORLAND_WINDOW_DEFINITION_RECEIPT =
      Object.freeze({
        ...receipt
      });

    const mount =
      document.querySelector("[data-showroom-window-mount]");

    if (mount) {
      mount.dataset.showroomWindowDefinitionContract =
        CONTRACT.id;

      mount.dataset.showroomWindowDefinitionStatus =
        receipt.status;

      mount.dataset.showroomWindowDefinitionReady =
        receipt.ready
          ? "true"
          : "false";
    }
  }

  function publish() {
    const validation =
      validateDefinition();

    if (!validation.valid) {
      updateReceipt({
        status:
          "failed",

        ready:
          false,

        failed:
          true,

        paneDefinitionCount:
          validation.paneDefinitionCount,

        expectedPaneCount:
          validation.expectedPaneCount,

        paneIdsComplete:
          validation.paneIdsComplete,

        materialGroupsComplete:
          validation.materialGroupsComplete,

        stateProfilesComplete:
          validation.stateProfilesComplete,

        lastAction:
          "window-definition-validation-failed",

        lastFailure:
          "WINDOW_DEFINITION_VALIDATION_FAILED"
      });

      dispatch(
        EVENTS.FAILURE,
        {
          receipt:
            globalThis.SHOWROOM_MIRRORLAND_WINDOW_DEFINITION_RECEIPT
        }
      );

      return false;
    }

    globalThis.SHOWROOM_MIRRORLAND_WINDOW_DEFINITION =
      DEFINITION;

    updateReceipt({
      status:
        "available",

      ready:
        true,

      failed:
        false,

      paneDefinitionCount:
        validation.paneDefinitionCount,

      expectedPaneCount:
        validation.expectedPaneCount,

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
          globalThis.SHOWROOM_MIRRORLAND_WINDOW_DEFINITION_RECEIPT
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
