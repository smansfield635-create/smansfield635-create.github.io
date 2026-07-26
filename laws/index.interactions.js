/* /laws/index.interactions.js
   Laws shared Compass-family interaction loader wrapper.

   Preserves the existing complete loader in
   /laws/index.interactions.loader.source.js and applies the settled spherical
   XYZ direct-manipulation contract plus exclusive center-Compass hit ownership.
*/
(() => {
  "use strict";

  const CONTRACT = Object.freeze({
    id: "DGB_LAWS_INTERACTIONS_CENTER_COMPASS_CLEARANCE_WRAPPER_v2",
    sourceUrl:
      "./index.interactions.loader.source.js?v=LAWS_INTERACTIONS_LOADER_SOURCE_v2",
    build:
      "LAWS_COMPASS_CENTER_EXCLUSIVE_SPHERICAL_XYZ_DIRECT_MANIPULATION_v6",
    horizontalDragYawSign:
      "POSITIVE",
    clusterGeometryModel:
      "BOUNDED_SPHERICAL_XYZ_CLUSTER",
    clusterFullXyzRotation:
      true,
    centerCompassExclusiveHitZone:
      true,
    overlappingCategoryMayOverrideCenter:
      false,
    ownsController:
      false,
    ownsCrystals:
      false,
    ownsNavigation:
      false
  });

  const SCRIPT_ATTRIBUTE =
    "data-laws-center-exclusive-spherical-xyz-interactions-source";

  function fail(code, details = null) {
    const error = new Error(code);
    error.code = code;
    error.details = details;

    const root = document.querySelector("[data-laws-root]");
    if (root) {
      root.dataset.lawsInteractionsWrapperStatus = "held";
      root.dataset.lawsInteractionsWrapperFailure = code;
    }

    globalThis.DGB_LAWS_INTERACTIONS_WRAPPER_FAILURE =
      Object.freeze({
        contractId: CONTRACT.id,
        code,
        details
      });

    globalThis.dispatchEvent(
      new CustomEvent(
        "DGB_LAWS_INTERACTIONS_WRAPPER_FAILURE",
        {
          detail:
            globalThis.DGB_LAWS_INTERACTIONS_WRAPPER_FAILURE
        }
      )
    );

    throw error;
  }

  function loadSourceSynchronously(url) {
    const request = new XMLHttpRequest();
    request.open("GET", url, false);
    request.send(null);

    if (request.status < 200 || request.status >= 300) {
      fail(
        `LAWS_INTERACTIONS_SOURCE_LOAD_FAILED:${request.status}`,
        { url }
      );
    }

    return request.responseText;
  }

  function replaceRequired(source, before, after, identity) {
    const count = source.split(before).length - 1;

    if (count !== 1) {
      fail(
        `LAWS_INTERACTIONS_REQUIRED_SOURCE_PATTERN_INVALID:${identity}`,
        {
          expected: 1,
          actual: count
        }
      );
    }

    return source.replace(before, after);
  }

  function transformSource(input) {
    let source = input;

    source = replaceRequired(
      source,
      '"LAWS_COMPASS_EUCLIDEAN_ORBIT_DIRECT_MANIPULATION_v4"',
      '"LAWS_COMPASS_CENTER_EXCLUSIVE_SPHERICAL_XYZ_DIRECT_MANIPULATION_v6"',
      "BUILD_IDENTITY"
    );

    source = replaceRequired(
      source,
      'horizontalDragYawSign: "NEGATIVE",',
      'horizontalDragYawSign: "POSITIVE",',
      "POSITIVE_HORIZONTAL_DRAG_RECEIPT"
    );

    source = replaceRequired(
      source,
      "clusterMaximumTiltRadians: 0.30,",
      "clusterFullXyzRotation: true,",
      "FULL_XYZ_ROTATION_RECEIPT"
    );

    source = replaceRequired(
      source,
      "euclideanClusterOrbitRequired: true,",
      "boundedSphericalXyzClusterRequired: true,",
      "SPHERICAL_CLUSTER_RECEIPT"
    );

    source = replaceRequired(
      source,
`    const candidates =
      [
        direct,
        crystal,
        fallbackCategory,
        compass
      ].filter(Boolean);`,
`    if (compass) {
      return compass;
    }

    const candidates =
      [
        direct,
        crystal,
        fallbackCategory
      ].filter(Boolean);`,
      "CENTER_COMPASS_EXCLUSIVE_HIT_PRECEDENCE"
    );

    const retiredTokens = [
      '"LAWS_COMPASS_EUCLIDEAN_ORBIT_DIRECT_MANIPULATION_v4"',
      'horizontalDragYawSign: "NEGATIVE"',
      "clusterMaximumTiltRadians: 0.30",
      "euclideanClusterOrbitRequired: true",
`        fallbackCategory,
        compass
      ].filter(Boolean);`
    ];

    for (const token of retiredTokens) {
      if (source.includes(token)) {
        fail(
          "LAWS_INTERACTIONS_RETIRED_TOKEN_REMAINS",
          { token }
        );
      }
    }

    const requiredTokens = [
      '"LAWS_COMPASS_CENTER_EXCLUSIVE_SPHERICAL_XYZ_DIRECT_MANIPULATION_v6"',
      'horizontalDragYawSign: "POSITIVE"',
      "clusterFullXyzRotation: true",
      "boundedSphericalXyzClusterRequired: true",
      "if (compass) {\n      return compass;\n    }"
    ];

    for (const token of requiredTokens) {
      if (!source.includes(token)) {
        fail(
          "LAWS_INTERACTIONS_REQUIRED_TOKEN_MISSING",
          { token }
        );
      }
    }

    return source;
  }

  function install() {
    if (
      document.querySelector(
        `script[${SCRIPT_ATTRIBUTE}]`
      )
    ) {
      return;
    }

    const source =
      transformSource(
        loadSourceSynchronously(
          CONTRACT.sourceUrl
        )
      );

    const script = document.createElement("script");
    script.setAttribute(
      SCRIPT_ATTRIBUTE,
      "true"
    );
    script.dataset.ready = "false";
    script.textContent =
      source +
      "\n//# sourceURL=/laws/index.interactions.center-exclusive-spherical-xyz.js";
    document.head.append(script);
    script.dataset.ready = "true";

    const root = document.querySelector("[data-laws-root]");
    if (root) {
      root.dataset.lawsInteractionsWrapperStatus =
        "available";
      root.dataset.lawsInteractionsWrapperContract =
        CONTRACT.id;
      root.dataset.lawsHorizontalDragYawSign =
        CONTRACT.horizontalDragYawSign;
      root.dataset.lawsClusterGeometryModel =
        CONTRACT.clusterGeometryModel;
      root.dataset.lawsClusterFullXyzRotation =
        "true";
      root.dataset.lawsCenterCompassExclusiveHitZone =
        "true";
      root.dataset.lawsOverlappingCategoryMayOverrideCenter =
        "false";
    }

    globalThis.DGB_LAWS_INTERACTIONS_WRAPPER_RECEIPT =
      Object.freeze({
        contractId:
          CONTRACT.id,
        sourceUrl:
          CONTRACT.sourceUrl,
        build:
          CONTRACT.build,
        horizontalDragYawSign:
          CONTRACT.horizontalDragYawSign,
        clusterGeometryModel:
          CONTRACT.clusterGeometryModel,
        clusterFullXyzRotation:
          CONTRACT.clusterFullXyzRotation,
        centerCompassExclusiveHitZone:
          CONTRACT.centerCompassExclusiveHitZone,
        overlappingCategoryMayOverrideCenter:
          CONTRACT.overlappingCategoryMayOverrideCenter,
        sourceTransformed:
          true,
        sourceExecuted:
          Boolean(
            globalThis.DGB_LAWS_INTERACTION_STANDARD_RECEIPT
          ),
        visualPassClaimed:
          false
      });

    globalThis.dispatchEvent(
      new CustomEvent(
        "DGB_LAWS_INTERACTIONS_WRAPPER_READY",
        {
          detail:
            globalThis
              .DGB_LAWS_INTERACTIONS_WRAPPER_RECEIPT
        }
      )
    );
  }

  install();
})();
