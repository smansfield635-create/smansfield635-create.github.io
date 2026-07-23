/*
 * Universal Compass geometry source-crossing record.
 * Research evidence only. No source-Compass, prototype, deployment, or
 * production authority.
 */
export const UNIVERSAL_COMPASS_GEOMETRY_SOURCE_CROSSING = Object.freeze({
  schema: "UNIVERSAL_COMPASS_GEOMETRY_SOURCE_CROSSING_v1",
  status: "FOUR_FAMILY_GEOMETRY_SOURCE_CROSSING_COMPLETE",
  branch: "agent/archcoin-compass-calibration-workspace-001",
  target: "/assets/compass-model/compass.geometry.js",
  sourceFamilyPrecedence: null,
  templateCompass: null,
  implementationAuthority: "CANDIDATE_ONLY",
  productionAuthority: false,
  liveRebuildAuthority: false,

  baselines: Object.freeze({
    MAIN: Object.freeze({
      html: Object.freeze({ path: "/index.html", blob: "3e64bd9e36dbed25e57adc706c76e689c215910f" }),
      crystals: Object.freeze({ path: "/assets/compass/compass.crystals.js", blob: "3d6427cbdb961576468d4aab05c0e4987549cea3" }),
      centerParticipant: Object.freeze({ path: "/assets/compass/compass.mirrorland-window.js", blob: "b3ef695c21d391301394d587f3d0f51caacb0add" }),
      css: Object.freeze({ path: "/assets/compass/compass.css", blob: "5e00eb9f981c540b85f310294b0c919fbab17f2d" })
    }),
    LAW: Object.freeze({
      html: Object.freeze({ path: "/laws/index.html", blob: "28c1041d0ad75f03a39092dc04b8785769ef4a6f" }),
      crystals: Object.freeze({ path: "/laws/index.crystals.js", blob: "3483e4a08913eb02f48fb2f981b1f7bcce1a5d4d" }),
      centerParticipant: Object.freeze({ path: "/laws/index.planet.js", blob: "329d207fd5ad6d89e517f6c0fa992fb1a65b115a" }),
      compositor: Object.freeze({ path: "/laws/index.compositor.js", blob: "66ca5b4f1fd25c591e74b109ba9ab6368b2c64aa" }),
      css: Object.freeze({ path: "/laws/index.css", blob: "9b1435c5417b28d69d02ed0c9e963194b59fbb3d" })
    }),
    SHOWROOM: Object.freeze({
      html: Object.freeze({ path: "/showroom/index.html", blob: "63a17b61ddafdd2433023c8ba21b5c1a8d389eee" }),
      crystals: Object.freeze({ path: "/showroom/index.crystals.js", blob: "8695a62df8ecbf7088aa8377b4dda5e83131e3a3" }),
      centerParticipant: Object.freeze({ path: "/showroom/index.planet.js", blob: "a816b77b4f7d31ceff42fe298d358dbe90997698" }),
      compositor: Object.freeze({ path: "/showroom/index.compositor.js", blob: "c148364e1d15f6e90ced475654fd348fd68fcca5" }),
      css: Object.freeze({ path: "/showroom/index.css", blob: "976c78d2c2808d461d2fe2be1ce6c25332788e9d" })
    }),
    ARCHCOIN: Object.freeze({
      html: Object.freeze({ path: "/products/archcoin/index.html", blob: "fc1c0872fee5d0fc0caae5767cc9fb72e6850d8f" }),
      crystals: Object.freeze({ path: "/products/archcoin/index.crystals.js", blob: "570c8b64f803b46c3ff2eb22d650596d832467af" }),
      compositor: Object.freeze({ path: "/products/archcoin/index.compositor.js", blob: "594eefa10bb7ad0583f7c3284a1e0daf28f34960" }),
      css: Object.freeze({ path: "/products/archcoin/index.css", blob: "cade394b5b1e009430a561e6c86711502f8a72a8" }),
      pageLocalPlanet: null
    }),
    SHARED_CENTER_AUTHORITIES: Object.freeze({
      compassGeometry: Object.freeze({ path: "/assets/compass/upstream-compass.geometry.js", blob: "fe35d8d844859a6af810684ace53d2c65258522f" }),
      compassRenderer: Object.freeze({ path: "/assets/compass/upstream-compass.renderer.js", blob: "965376dd8a92686bc7008d1fea4846b5f8300872" }),
      audraliaPlanetGeometry: Object.freeze({ path: "/assets/audralia/audralia.planet.js", blob: "4aa2abc623acef47ad8f504e72c8c0907375a7e7" })
    })
  }),

  corrections: Object.freeze([
    Object.freeze({
      id: "MAIN_CENTER_PROFILE_CORRECTION",
      finding: "Main uses the self-contained Mirrorland stained-glass threshold as its center participant.",
      decision: "CENTER_KIND_CUSTOM_MIRRORLAND_THRESHOLD_SUPPORTED"
    }),
    Object.freeze({
      id: "VARIABLE_CLUSTER_CAPACITY_CORRECTION",
      finding: "Main capacities are north 5, east 5, south 4, west 5, total 19.",
      decision: "CARDINAL_SPECIFIC_CLUSTER_TEMPLATES_REQUIRED"
    }),
    Object.freeze({
      id: "ELLIPSOIDAL_RELATION_CORRECTION",
      finding: "Main, Law, and ARCHCOIN normalize directions then apply unequal axis radii.",
      decision: "ELLIPSOIDAL_IS_DISTINCT_FROM_SPHERICAL"
    }),
    Object.freeze({
      id: "EXPLICIT_SEAT_SOURCE_CORRECTION",
      finding: "Only Showroom currently supplies an explicit four-seat coordinate table.",
      decision: "STABLE_SEAT_IDENTITY_IS_A_UNIVERSAL_REQUIREMENT_NOT_A_SHARED_BASELINE_FACT"
    }),
    Object.freeze({
      id: "ARCHCOIN_SEAT_BINDING_CORRECTION",
      finding: "ARCHCOIN derives roomIndex from current DOM sequence and calculates vectors from index and count.",
      decision: "DOM_ORDER_CANNOT_BE_CANONICAL_SEAT_AUTHORITY"
    }),
    Object.freeze({
      id: "CENTER_VISUAL_SEMANTIC_SEPARATION",
      finding: "Law and Showroom display Audralia-derived planets while separate controls retain Main Compass return semantics.",
      decision: "CENTER_VISUAL_IDENTITY_MAY_DIFFER_FROM_SEMANTIC_IDENTITY"
    }),
    Object.freeze({
      id: "ARCHCOIN_PLANET_AUTHORITY_CORRECTION",
      finding: "ARCHCOIN has no page-local planet source at the read baseline.",
      decision: "SEVEN_FILE_PLANET_PLAN_IS_NOT_CURRENT_IMPLEMENTATION_EVIDENCE"
    })
  ]),

  sourceContributions: Object.freeze({
    MAIN: Object.freeze([
      "four-cardinal right-handed constellation",
      "ellipsoidal constellation radii 1.50 x 1.34 x 1.16",
      "ellipsoidal cluster radii 1.36 x 1.18 x 1.04",
      "variable cluster capacities 5, 5, 4, 5",
      "one shared constellation transform",
      "one shared transform per active cluster",
      "custom Mirrorland center participant"
    ]),
    LAW: Object.freeze([
      "ellipsoidal constellation and cluster embedding",
      "faceted crystal geometry and material-region separation",
      "independent nonregistry planet participant",
      "geometry-compositor responsibility boundary",
      "local geometry distinct from projected hit corridors"
    ]),
    SHOWROOM: Object.freeze([
      "explicit four-cardinal Cartesian coordinates",
      "explicit four-seat room coordinate table",
      "strict cardinal-parent and ordinal validation",
      "independent Audralia center-world participant",
      "nonadditive constellation and cluster populations"
    ]),
    ARCHCOIN: Object.freeze([
      "ellipsoidal constellation radii 1.46 x 1.28 x 1.14",
      "ellipsoidal cluster radii 1.04 x 0.90 x 0.84",
      "four members per wing at the restored baseline",
      "shared effective cluster quaternion path",
      "current fixed-center shared Home Compass participant",
      "need to replace DOM-order seat custody with explicit stable seat identities"
    ]),
    SHARED_GEOMETRY_AUTHORITIES: Object.freeze([
      "CPU-side topology ownership",
      "finite vertex and normalized-normal validation",
      "nondegenerate bounds",
      "material-region identity",
      "deterministic geometry hash and receipt",
      "renderer, camera, DOM, animation, and UI exclusion"
    ])
  }),

  implementedUniversalInvariants: Object.freeze([
    "RIGHT_HANDED_LOCAL_3D_COORDINATE_SPACE",
    "FINITE_CANONICAL_NUMERIC_RECORDS",
    "WORLD_SUPPLIED_CANONICAL_IDENTITIES",
    "EXACTLY_FOUR_CARDINAL_RECORDS",
    "DETERMINISTIC_CARDINAL_ORDER",
    "UNIQUE_NODE_IDENTITIES",
    "EXPLICIT_STABLE_CLUSTER_SEAT_IDENTITIES",
    "DETERMINISTIC_MEMBER_ORDER",
    "ONE_SHARED_CONSTELLATION_TRANSFORM",
    "ONE_SHARED_TRANSFORM_PER_CLUSTER",
    "NO_MEMBER_SPECIFIC_CANONICAL_DRIFT",
    "LOCAL_SHAPE_TOPOLOGY_SEPARATE_FROM_VISUAL_STATE",
    "FINITE_LOCAL_VERTICES",
    "FINITE_NORMALIZED_NORMALS",
    "VALID_NONDEGENERATE_BOUNDS",
    "IMMUTABLE_GEOMETRY_PUBLICATION",
    "DETERMINISTIC_GEOMETRY_SERIALIZATION",
    "REVISION_OR_HASH_IDENTITY",
    "GEOMETRY_VALIDATION_RECEIPT",
    "OPTIONAL_CENTER_SEPARATE_FROM_CARDINAL_REGISTRY"
  ]),

  implementationDecisions: Object.freeze([
    "geometry receives identities from world input",
    "geometry never infers canonical primary identity",
    "cluster templates are cardinal-specific and capacity-aware",
    "runtime geometry requires explicit seat records and explicit member-to-seat binding",
    "count-dependent source formulas are exposed only as fixed-capacity migration utilities",
    "ellipsoidal and spherical relations are separate enumerated modes",
    "center records preserve separate visualIdentity and semanticId fields",
    "shape definitions contain CPU topology, normals, facet roles, material-region identities, and bounds",
    "node records contain local transforms, bounds, anchors, and local hit primitives",
    "projected pixels, depth layers, overlap, camera matrices, GPU resources, mutable interpolation, routes, labels, and palette values are excluded",
    "renderer and compositor receive immutable geometry snapshots"
  ]),

  rejectedDefects: Object.freeze([
    "GEOMETRY_EMBEDDED_INSIDE_RENDERER_AUTHORITY",
    "CANONICAL_RECORDS_MIXED_WITH_MUTABLE_VISUAL_STATE",
    "COUNT_DEPENDENT_CLUSTER_VECTORS_AS_CANONICAL_RUNTIME_SEATS",
    "DOM_ORDER_AS_UNDECLARED_SEAT_AUTHORITY",
    "SPHERE_NAMING_FOR_ELLIPSOIDAL_EMBEDDING",
    "RENDERER_INFERENCE_OF_CANONICAL_PRIMARY",
    "PALETTE_VALUES_BAKED_INTO_CANONICAL_GEOMETRY",
    "PROJECTED_PIXEL_RADII_TREATED_AS_LOCAL_HIT_GEOMETRY",
    "ROUTES_OR_LABELS_USED_AS_GEOMETRY_IDENTITY",
    "PAGE_CENTER_VISUAL_AND_SEMANTIC_IDENTITY_CONFLATION",
    "ASSUMING_ALL_CLUSTERS_HAVE_FOUR_MEMBERS",
    "ASSUMING_ARCHCOIN_ALREADY_HAS_EXPLICIT_STABLE_SEATS",
    "ASSUMING_ARCHCOIN_HAS_A_PAGE_LOCAL_PLANET_FILE"
  ]),

  executionBoundary: Object.freeze({
    sourceFilesExecuted: false,
    universalCandidateImplemented: true,
    candidateFixturesRequired: true,
    browserExecutionRequiredLater: true,
    physicalDeviceExecutionRequiredLater: true,
    sourceCompassMutationPerformed: false,
    publicPrototypeMutationPerformed: false
  })
});
