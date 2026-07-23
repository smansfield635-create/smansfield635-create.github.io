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
  status: "MAIN_COMPASS_FIRST_EXTRACTION_RECORDED",
  chamber: "ARCHCOIN",
  referenceModelAuthority: "NOT_YET_ESTABLISHED",
  entries: Object.freeze([
    Object.freeze({
      capabilityId: "COMPASS_PHYSICS_AND_NAVIGATION_CORE",
      sourceFamily: "MAIN_COMPASS_SOURCE_FAMILY",
      candidateValue: "Preserve the strongest verified motion, navigation, cluster-capacity, and passage-custody mechanisms.",
      state: "SOURCE_VERIFIED",
      evidenceCommit: "eceac4d5297b2f087c1cf718e29d79c119c29db1",
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
          evidence: "Controller preserves one constellation quaternion and one independent quaternion per active cardinal cluster.",
          boundary: "Orientation commitment remains controller-owned; rendering remains crystal-owned."
        }),
        Object.freeze({
          id: "PREVIEW_COMMIT_CANCEL_ORIENTATION_PHASES",
          evidence: "IDLE, PREVIEW, SETTLING, COMMITTED, and CANCELLED phases distinguish manipulation from canonical commitment.",
          boundary: "A drag release does not itself authorize navigation or room selection."
        }),
        Object.freeze({
          id: "SHARED_SPHERICAL_TRANSFORM",
          evidence: "Cardinal and room nodes are projected from right-handed Euclidean XYZ vectors through unit-quaternion orientation.",
          boundary: "Relative node membership is transformed as one constellation or one cluster rather than independent screen drift."
        }),
        Object.freeze({
          id: "PRIMARY_ANCHOR_SETTLEMENT",
          evidence: "Controlled drag release settles the nearest cardinal or room to a defined primary anchor.",
          boundary: "Settlement selects visual focus; route commitment remains a separate controller decision."
        }),
        Object.freeze({
          id: "DRAG_FLICK_CLASSIFICATION",
          evidence: "Cluster return is separated from ordinary drag using duration, distance, average velocity, release velocity, directional ratio, path efficiency, and pause-before-release.",
          boundary: "Ordinary systematic pulls cannot be interpreted as constellation-return flicks."
        }),
        Object.freeze({
          id: "DEPTH_AWARE_SEMANTIC_SELECTION",
          evidence: "Rendered position, depth, scale, prominence, label opacity, semantic stacking, and hit priority derive from rotated three-dimensional vectors.",
          boundary: "Controller does not calculate rendered hit targets."
        }),
        Object.freeze({
          id: "POINTER_AND_RENDERER_INTERRUPTION_RECOVERY",
          evidence: "Crystal runtime accounts for pointer cancellation, lost capture, blur, visibility interruption, page hiding, partial initialization rollback, reduced motion, and WebGL context loss.",
          boundary: "Recovery preserves controller state and avoids accidental semantic clicks after motion."
        }),
        Object.freeze({
          id: "NAVIGATION_SEPARATION",
          evidence: "Crystal renderer owns gesture interpretation and projection while the controller owns state commitment, panel descent, return-to-orbit, Mirrorland restoration, and route navigation.",
          boundary: "Crystal renderer explicitly does not own navigation."
        })
      ]),
      parameterEvidence: Object.freeze({
        constellationRadii: Object.freeze({
          horizontal: 1.50,
          vertical: 1.34,
          depth: 1.16
        }),
        clusterRadii: Object.freeze({
          horizontal: 1.36,
          vertical: 1.18,
          depth: 1.04
        }),
        gesture: Object.freeze({
          dragDeadZonePx: 6,
          maximumTapDistancePx: 12,
          minimumDragDistancePx: 8,
          sampleWindowMs: 140,
          flickMaximumDurationMs: 260,
          flickMinimumDistancePx: 52,
          flickMinimumAverageVelocityPxPerMs: 0.55,
          flickMinimumReleaseVelocityPxPerMs: 0.72,
          flickMinimumDirectionalRatio: 1.28,
          flickMaximumPauseBeforeReleaseMs: 90,
          flickMaximumPathEfficiencyLoss: 0.22
        })
      }),
      conflicts: Object.freeze([]),
      admissionBlockedBy: Object.freeze([
        "DEPENDENCY_MAP",
        "ARCHCOIN_BASELINE_COMPATIBILITY_TEST",
        "FIXED_AXIS_CALIBRATION_ANALYSIS",
        "LIVE_BEHAVIOR_ACCEPTANCE"
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