/*
 * ARCHCOIN Compass Calibration Workspace
 * Capability extraction ledger.
 * Entries remain candidates until source evidence and admission gates pass.
 */

export const ARCHCOIN_COMPASS_EXTRACTION_STATES = Object.freeze({
  IDENTIFIED: "IDENTIFIED",
  SOURCE_VERIFIED: "SOURCE_VERIFIED",
  EXTRACTED: "EXTRACTED",
  COMPATIBILITY_TESTED: "COMPATIBILITY_TESTED",
  ADMITTED: "ADMITTED",
  REJECTED: "REJECTED"
});

export const ARCHCOIN_COMPASS_EXTRACTION_LEDGER = Object.freeze({
  schema: "ARCHCOIN_COMPASS_EXTRACTION_LEDGER_v1",
  status: "MAIN_COMPASS_FILE_LEVEL_EXTRACTION_COMPLETE",
  chamber: "ARCHCOIN",
  referenceModelAuthority: "NOT_YET_ESTABLISHED",
  entries: Object.freeze([
    Object.freeze({
      capabilityId: "COMPASS_PHYSICS_AND_NAVIGATION_CORE",
      sourceFamily: "MAIN_COMPASS_SOURCE_FAMILY",
      candidateValue: "Preserve the strongest verified motion, navigation, cluster-capacity, interruption-recovery, and passage-custody mechanisms.",
      state: "EXTRACTED",
      evidenceCommit: "eceac4d5297b2f087c1cf718e29d79c119c29db1",
      extractionArtifact: "/research/archcoin-compass-calibration/main-compass-extraction.js",
      evidencePaths: Object.freeze([
        "/assets/compass/compass.controller.js",
        "/assets/compass/compass.crystals.js",
        "/index.html"
      ]),
      sourceBlobIdentities: Object.freeze({
        controller: "259e0d16b55c3986fec57db37fc057861483344a",
        crystals: "3d6427cbdb961576468d4aab05c0e4987549cea3"
      }),
      extractedCapabilities: Object.freeze([
        Object.freeze({
          id: "SEPARATE_CONSTELLATION_AND_CLUSTER_ORIENTATION_CUSTODY",
          evidence: "Controller preserves one constellation quaternion and one independent quaternion, committed quaternion, gesture origin, phase, and revision per cardinal cluster.",
          boundary: "Orientation preview and commitment remain controller-owned; world and render evaluation remain outside the controller."
        }),
        Object.freeze({
          id: "PREVIEW_COMMIT_CANCEL_ORIENTATION_PHASES",
          evidence: "IDLE, PREVIEW, SETTLING, COMMITTED, and CANCELLED distinguish manipulation from canonical commitment.",
          boundary: "A drag release does not itself authorize cluster opening, room selection, panel descent, or route navigation."
        }),
        Object.freeze({
          id: "SHARED_SPHERICAL_TRANSFORM",
          evidence: "Cardinal and room nodes are evaluated from right-handed Euclidean XYZ vectors through unit-quaternion orientation as one constellation or active cluster.",
          boundary: "The mechanism is extracted independently of Main-specific cardinal labels, routes, materials, and page identity."
        }),
        Object.freeze({
          id: "PRIMARY_ANCHOR_SETTLEMENT",
          evidence: "Controlled drag release settles a cardinal or room target toward a defined world-space primary anchor.",
          boundary: "Settlement commits visual focus only; semantic selection and route commitment remain separate controller passages."
        }),
        Object.freeze({
          id: "DRAG_FLICK_CLASSIFICATION",
          evidence: "Cluster return is separated from ordinary drag using duration, distance, average velocity, release velocity, directional ratio, path efficiency, and pause-before-release.",
          boundary: "Ordinary systematic pulls cannot be interpreted as constellation-return flicks merely because the pointer was released."
        }),
        Object.freeze({
          id: "DEPTH_AWARE_SEMANTIC_SELECTION",
          evidence: "Rendered position, depth, scale, prominence, halo, label opacity, semantic stacking, and hit priority derive from rotated three-dimensional vectors.",
          boundary: "The reusable rule is shared visual and semantic projection, not automatic inheritance of Main's combined renderer architecture."
        }),
        Object.freeze({
          id: "POINTER_AND_RENDERER_INTERRUPTION_RECOVERY",
          evidence: "Runtime accounts for pointer cancellation, lost capture, blur, visibility interruption, page hiding, partial initialization rollback, reduced motion, and WebGL context loss.",
          boundary: "Recovery must restore or cancel the active transaction deterministically and suppress accidental semantic activation."
        }),
        Object.freeze({
          id: "NAVIGATION_SEPARATION",
          evidence: "The controller separately governs visual-focus commitment, cardinal selection, room selection, panel descent, return-to-orbit, constellation restoration, Mirrorland restoration, and route navigation.",
          boundary: "Renderer settlement and hit detection do not independently authorize navigation."
        })
      ]),
      parameterEvidence: Object.freeze({
        constellationRadii: Object.freeze({
          horizontal: 1.50,
          vertical: 1.34,
          depth: 1.16
        }),
        constellationPrimaryAnchor: Object.freeze([0, 0.78, 0.625]),
        clusterRadii: Object.freeze({
          horizontal: 1.36,
          vertical: 1.18,
          depth: 1.04
        }),
        clusterPrimaryAnchor: Object.freeze([0, 0.70, 0.714]),
        clusterLatitudeAmplitude: 0.48,
        clusterLatitudeFrequency: 1.73,
        gesture: Object.freeze({
          dragDeadZonePx: 6,
          maximumTapDistancePx: 12,
          minimumDragDistancePx: 8,
          radiansPerViewport: "Math.PI * 1.12",
          settleSpeed: 7.4,
          sampleWindowMs: 140,
          maximumSamples: 18,
          flickMaximumDurationMs: 260,
          flickMinimumDistancePx: 52,
          flickMinimumAverageVelocityPxPerMs: 0.55,
          flickMinimumReleaseVelocityPxPerMs: 0.72,
          flickMinimumDirectionalRatio: 1.28,
          flickMaximumPauseBeforeReleaseMs: 90,
          flickMaximumPathEfficiencyLoss: 0.22
        })
      }),
      conflicts: Object.freeze([
        "Main Compass combines world geometry, camera projection, hit testing, gesture interpretation, and WebGL rendering in one crystal source; the extracted capabilities do not automatically admit that ownership arrangement.",
        "Main-specific semantic identities, routes, panel copy, and Mirrorland page behavior are excluded from the reusable core.",
        "Source constants remain calibration evidence rather than admitted universal values."
      ]),
      admissionBlockedBy: Object.freeze([
        "LAW_COMPASS_FILE_LEVEL_EXTRACTION",
        "MIRRORLAND_FILE_LEVEL_EXTRACTION",
        "CROSS_COMPASS_DEPENDENCY_MAP",
        "ARCHCOIN_BASELINE_COMPATIBILITY_TEST",
        "FIXED_AXIS_CALIBRATION_ANALYSIS",
        "BEHAVIORAL_TEST_CORRIDOR",
        "LIVE_VISUAL_AND_ACCESSIBILITY_ACCEPTANCE"
      ])
    }),
    Object.freeze({
      capabilityId: "COMPASS_FLUID_AMBIENT_MOTION",
      sourceFamily: "LAW_COMPASS_SOURCE_FAMILY",
      candidateValue: "Recover fast, fluid, ambient constellation movement without importing Law-specific semantic identity.",
      state: "IDENTIFIED",
      evidencePaths: Object.freeze([]),
      conflicts: Object.freeze([]),
      admissionBlockedBy: Object.freeze([
        "MOTION_PARAMETER_EXTRACTION",
        "RESPONSIBILITY_BOUNDARY_REVIEW",
        "REDUCED_MOTION_TEST"
      ])
    }),
    Object.freeze({
      capabilityId: "COMPASS_NARRATIVE_SCALE_AND_READABILITY",
      sourceFamily: "MIRRORLAND_COMPASS_SOURCE_FAMILY",
      candidateValue: "Recover the strongest verified scale, readability, and visual-presence methods as configurable presentation tools.",
      state: "IDENTIFIED",
      evidencePaths: Object.freeze([]),
      conflicts: Object.freeze([]),
      admissionBlockedBy: Object.freeze([
        "GEOMETRY_AND_CSS_EXTRACTION",
        "MOBILE_READABILITY_TEST",
        "ACCESSIBILITY_REVIEW"
      ])
    }),
    Object.freeze({
      capabilityId: "COMPASS_LITERAL_CARDINAL_SEMANTICS",
      sourceFamily: "ARCHCOIN_SOURCE_FAMILY",
      candidateValue: "Preserve literal North, East, South, and West as a reusable semantic mode rather than a mandatory page identity.",
      state: "IDENTIFIED",
      evidencePaths: Object.freeze([
        "/products/archcoin/index.controller.js",
        "/products/archcoin/index.html"
      ]),
      conflicts: Object.freeze([]),
      admissionBlockedBy: Object.freeze([
        "SEMANTIC_MODE_ABSTRACTION",
        "ROUTE_ADAPTER_BOUNDARY"
      ])
    }),
    Object.freeze({
      capabilityId: "COMPASS_WORLD_VISUAL_PROJECTION_SEPARATION",
      sourceFamily: "ARCHCOIN_SOURCE_FAMILY",
      candidateValue: "Use separate world, visual interpretation, projection, controller, and interaction authorities when the compass contains a persistent world participant.",
      state: "IDENTIFIED",
      evidencePaths: Object.freeze([
        "/products/archcoin/index.planet.js",
        "/products/archcoin/index.crystals.js",
        "/products/archcoin/index.compositor.js",
        "/products/archcoin/index.controller.js",
        "/products/archcoin/index.interactions.js"
      ]),
      conflicts: Object.freeze([]),
      admissionBlockedBy: Object.freeze([
        "SEVEN_FILE_INTEGRATED_TEST",
        "GENERIC_INTERFACE_EXTRACTION",
        "NON_PLANET_COMPASS_COMPATIBILITY"
      ])
    })
  ])
});
