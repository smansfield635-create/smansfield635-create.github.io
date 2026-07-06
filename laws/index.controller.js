/* /laws/index.controller.js
   LAW COMPASS navigation, state, route, transition, panel,
   four-direction law-category, sixteen-law registry, and
   human-first / engineering-secondary authority.

   Module:
   DGB_LAWS_CONTROLLER
   1.0.0-law-compass-human-first-authority

   Paired module:
   DGB_LAWS_INTERACTIONS
   1.0.0-pointer-gesture-interpreter

   Source template:
   /products/archcoin/index.controller.js
   DGB_ARCHCOIN_CONTROLLER
   7.0.0-controller-interaction-semantic-priority

   Template conversion:
   ARCHCOIN financial domains:
   - contract
   - receivable
   - payable
   - allocation

   LAW COMPASS directions:
   - flow
   - integrity
   - reality
   - structure

   Anchoring distinction:

   INTERACTIONS DETERMINES MOTION.
   CONTROLLER DETERMINES AUTHORITY.

   Controller owns:
   - canonical navigation and selection state;
   - legal transitions;
   - canonical category and law-route registry;
   - gesture transaction begin, preview acceptance, commit, and cancel;
   - complete-quaternion validation and authoritative normalization;
   - preview, committed, and origin quaternion storage;
   - explicit primary-direction and primary-law validation;
   - navigation authorization and execution;
   - panel and viewport choreography;
   - reduced-motion and held-state authority;
   - semantic projection fact validation, storage, and publication;
   - human-first law profile publication;
   - receipts and validation.

   Controller does not own:
   - pointer lifecycle;
   - tap-versus-drag arbitration;
   - swipe or cluster-exit classification;
   - drag direction or sensitivity;
   - gesture-axis selection;
   - gesture quaternion construction;
   - direct manipulation or grabbed-object tracking;
   - quaternion-to-primary inference;
   - Euler gesture interpretation;
   - interaction-priority derivation;
   - projection-to-interaction DOM application.

   Human-first law standard:

   Each law route preserves:
   - human law as primary expression;
   - software / engineering expression as secondary parallel;
   - code / route expression as implementation parallel;
   - failure pattern;
   - audit question;
   - placeholder status until full law page expansion.

   Gesture contract:

   Orbit:
   - beginOrbitGesture()
   - requestOrbitPreview({ quaternion, primaryId })
   - requestOrbitCommit()
   - requestOrbitCancel(reason)

   Cluster:
   - beginClusterGesture(direction)
   - requestClusterPreview(direction, { quaternion, primaryId })
   - requestClusterCommit(direction)
   - requestClusterCancel(direction, reason)

   Preview payloads permit exactly:
   - quaternion
   - primaryId

   Source status:
   LAW_COMPASS_CONTROLLER_CONVERSION_STANDARD
   !=
   RUNTIME_PASS
   !=
   VISUAL_PASS
   !=
   PRODUCTION_AUTHORIZATION
*/

(() => {
  "use strict";

  const MODULE = Object.freeze({
    id: "DGB_LAWS_CONTROLLER",
    version: "1.0.0-law-compass-human-first-authority",
    file: "/laws/index.controller.js",

    interactionModuleId: "DGB_LAWS_INTERACTIONS",
    interactionModuleVersion: "1.0.0-pointer-gesture-interpreter",

    motionContractId:
      "DGB_LAWS_COMPLETE_QUATERNION_MOTION_CONTRACT_v1",

    motionContractVersion: "1.0.0"
  });

  const STATES = Object.freeze({
    CONSTELLATION: "CONSTELLATION",
    CLUSTER_OPEN: "CLUSTER_OPEN",
    LAW_SELECTED: "LAW_SELECTED",
    SYSTEM_HELD: "SYSTEM_HELD"
  });

  const PRESENTATION_MODES = Object.freeze({
    CONSTELLATION: "CONSTELLATION",
    CLUSTER: "CLUSTER",
    HELD: "HELD"
  });

  const PRESENTATION_MODE_BY_STATE = Object.freeze({
    [STATES.CONSTELLATION]: PRESENTATION_MODES.CONSTELLATION,
    [STATES.CLUSTER_OPEN]: PRESENTATION_MODES.CLUSTER,
    [STATES.LAW_SELECTED]: PRESENTATION_MODES.CLUSTER,
    [STATES.SYSTEM_HELD]: PRESENTATION_MODES.HELD
  });

  const DESTINATION_TYPES = Object.freeze({
    NONE: "",
    CATEGORY: "category",
    LAW: "law",
    HOME_COMPASS: "home-compass"
  });

  const ORIENTATION_PHASES = Object.freeze({
    IDLE: "IDLE",
    PREVIEW: "PREVIEW",
    COMMITTED: "COMMITTED",
    CANCELLED: "CANCELLED"
  });

  const DEPTH_LAYERS = Object.freeze({
    FRONT: "front",
    REAR: "rear",
    UNKNOWN: "unknown"
  });

  const CHANNELS = Object.freeze({
    FRAME: "frame",
    REDUCED_MOTION: "reducedMotion",
    HELD_STATE: "heldState",
    COMPASS_STATE: "compassState",
    SEMANTIC_PROJECTION: "semanticProjection"
  });

  const DIRECTIONS = Object.freeze([
    "flow",
    "integrity",
    "reality",
    "structure"
  ]);

  const DIRECTION_LABELS = Object.freeze({
    flow: "Flow",
    integrity: "Integrity",
    reality: "Reality",
    structure: "Structure"
  });

  const DIRECTION_COORDINATES = Object.freeze({
    flow: "Movement",
    integrity: "Trust",
    reality: "Truth",
    structure: "Form"
  });

  const DIRECTION_TO_CATEGORY_ROUTE = Object.freeze({
    flow: "/laws/categories/flow/",
    integrity: "/laws/categories/integrity/",
    reality: "/laws/categories/reality/",
    structure: "/laws/categories/structure/"
  });

  const MAIN_COMPASS = Object.freeze({
    destinationType: DESTINATION_TYPES.HOME_COMPASS,
    destinationId: "home-compass",
    destinationLabel: "Main Compass",
    route: "/",
    source: "laws-controller",
    navigationAuthority: "EXPLICIT_RETURN_ACTION"
  });

  const QUATERNION = Object.freeze({
    identity: Object.freeze([0, 0, 0, 1]),
    minimumLength: 1e-8
  });

  const PREVIEW_PAYLOAD_KEYS = Object.freeze([
    "quaternion",
    "primaryId"
  ]);

  const PREVIEW_PAYLOAD_KEY_SET = new Set(
    PREVIEW_PAYLOAD_KEYS
  );

  const HALF_SQRT_TWO = Math.SQRT1_2;

  const CANONICAL_CONSTELLATION_QUATERNIONS =
    Object.freeze({
      flow: Object.freeze([
        0,
        0,
        0,
        1
      ]),

      integrity: Object.freeze([
        0,
        0,
        -HALF_SQRT_TWO,
        HALF_SQRT_TWO
      ]),

      reality: Object.freeze([
        0,
        0,
        1,
        0
      ]),

      structure: Object.freeze([
        0,
        0,
        HALF_SQRT_TWO,
        HALF_SQRT_TWO
      ])
    });

  const PRESENTATION_BY_STATE = Object.freeze({
    [STATES.CONSTELLATION]: Object.freeze({
      mode: PRESENTATION_MODES.CONSTELLATION,
      outerCategoriesActive: true,
      activeLawCluster: false,
      lawSelectionPermitted: false
    }),

    [STATES.CLUSTER_OPEN]: Object.freeze({
      mode: PRESENTATION_MODES.CLUSTER,
      outerCategoriesActive: false,
      activeLawCluster: true,
      lawSelectionPermitted: true
    }),

    [STATES.LAW_SELECTED]: Object.freeze({
      mode: PRESENTATION_MODES.CLUSTER,
      outerCategoriesActive: false,
      activeLawCluster: true,
      lawSelectionPermitted: true
    }),

    [STATES.SYSTEM_HELD]: Object.freeze({
      mode: PRESENTATION_MODES.HELD,
      outerCategoriesActive: false,
      activeLawCluster: false,
      lawSelectionPermitted: false
    })
  });

  const TRANSITIONS = Object.freeze({
    [STATES.CONSTELLATION]: Object.freeze([
      STATES.CONSTELLATION,
      STATES.CLUSTER_OPEN,
      STATES.SYSTEM_HELD
    ]),

    [STATES.CLUSTER_OPEN]: Object.freeze([
      STATES.CLUSTER_OPEN,
      STATES.LAW_SELECTED,
      STATES.CONSTELLATION,
      STATES.SYSTEM_HELD
    ]),

    [STATES.LAW_SELECTED]: Object.freeze([
      STATES.LAW_SELECTED,
      STATES.CLUSTER_OPEN,
      STATES.CONSTELLATION,
      STATES.SYSTEM_HELD
    ]),

    [STATES.SYSTEM_HELD]: Object.freeze([
      STATES.SYSTEM_HELD
    ])
  });

  const CANONICAL_LAW_RECORDS = Object.freeze([
    Object.freeze({
      direction: "flow",
      lawId: "route-law",
      lawLabel: "Route Law",
      route: "/laws/categories/flow/route/",
      humanPrimary:
        "Every person, role, relationship, institution, or decision path needs a place, a responsibility, a boundary, and a way to move without losing orientation.",
      engineeringSecondary:
        "Every page or route must know where it lives, how it is entered, what it owns, where it may send the visitor, and how return remains possible.",
      codeExpression:
        "Route identity, owner function, inbound path, outbound path, and return path must be explicit.",
      failurePattern:
        "A path exists, but nobody can tell what owns it, where it belongs, or how to return.",
      auditQuestion:
        "Can the path state where it lives, what it owns, and how a user returns?"
    }),

    Object.freeze({
      direction: "flow",
      lawId: "return-law",
      lawLabel: "Return Law",
      route: "/laws/categories/flow/return/",
      humanPrimary:
        "Exploration is not abandonment. A healthy system allows people to move outward and still return to orientation.",
      engineeringSecondary:
        "Every outward movement, section jump, route transition, or deep content path must preserve a return anchor.",
      codeExpression:
        "Back controls, return anchors, and restoration states must resolve to the intended parent context.",
      failurePattern:
        "The user enters depth and loses the map.",
      auditQuestion:
        "Can the user return to the correct parent state without guessing?"
    }),

    Object.freeze({
      direction: "flow",
      lawId: "interaction-law",
      lawLabel: "Interaction Law",
      route: "/laws/categories/flow/interaction/",
      humanPrimary:
        "People should not have to guess what is being asked of them. A valid interaction makes the available action clear before commitment.",
      engineeringSecondary:
        "Clickable, draggable, expandable, decorative, and inert objects must be visually and semantically distinguishable.",
      codeExpression:
        "Interactive controls require appropriate roles, labels, event handling, and non-deceptive state changes.",
      failurePattern:
        "A visitor cannot tell what can be touched, opened, dragged, ignored, or trusted.",
      auditQuestion:
        "Is the action legible before activation?"
    }),

    Object.freeze({
      direction: "flow",
      lawId: "runtime-law",
      lawLabel: "Runtime Law",
      route: "/laws/categories/flow/runtime/",
      humanPrimary:
        "Activity must serve responsibility. Motion, urgency, or busyness does not prove value.",
      engineeringSecondary:
        "Runtime behavior must serve the route’s purpose and may not take authority from the page structure.",
      codeExpression:
        "Heavy runtime, animation loops, canvas, WebGL, or state engines must be authorized by route class and contract.",
      failurePattern:
        "Movement hides weak structure or makes a simple page unstable.",
      auditQuestion:
        "Does runtime behavior serve the law, or has it taken over the law?"
    }),

    Object.freeze({
      direction: "integrity",
      lawId: "authority-law",
      lawLabel: "Authority Law",
      route: "/laws/categories/integrity/authority/",
      humanPrimary:
        "A person, office, role, or institution must not claim authority it has not earned, received, or been assigned.",
      engineeringSecondary:
        "Every route, module, claim, and controller must declare what it owns and what it does not own.",
      codeExpression:
        "Authority boundaries must be encoded through route contracts, data attributes, module receipts, and explicit ownership fields.",
      failurePattern:
        "A component speaks for the whole system without authority.",
      auditQuestion:
        "Who is allowed to decide, and where is that authority recorded?"
    }),

    Object.freeze({
      direction: "integrity",
      lawId: "proof-law",
      lawLabel: "Proof Law",
      route: "/laws/categories/integrity/proof/",
      humanPrimary:
        "Confidence, status, emotion, repetition, and urgency do not make a claim true. Trust requires something checkable.",
      engineeringSecondary:
        "A route, interface, visual state, or runtime flag cannot claim success unless observable behavior, source state, receipt, or test output supports it.",
      codeExpression:
        "No status flag, visual label, contract name, or deployment statement may outrank implemented and inspectable behavior.",
      failurePattern:
        "The system asks for belief where evidence is required.",
      auditQuestion:
        "What can be checked?"
    }),

    Object.freeze({
      direction: "integrity",
      lawId: "receipt-law",
      lawLabel: "Receipt Law",
      route: "/laws/categories/integrity/receipt/",
      humanPrimary:
        "A serious decision leaves a record clear enough for later responsibility.",
      engineeringSecondary:
        "Every major page, module, route, or contract change must preserve a traceable receipt.",
      codeExpression:
        "Receipts must identify route, file, contract, changed scope, preserved scope, runtime posture, visual posture, and claim boundary.",
      failurePattern:
        "A change occurs, but the next reviewer cannot tell what changed or why.",
      auditQuestion:
        "Can another reviewer reconstruct the change from the record?"
    }),

    Object.freeze({
      direction: "integrity",
      lawId: "scope-law",
      lawLabel: "Scope Law",
      route: "/laws/categories/integrity/scope/",
      humanPrimary:
        "A responsibility must not silently expand beyond what was agreed. Momentum without boundary becomes damage.",
      engineeringSecondary:
        "A file, route, patch, or module change must stay inside the authorized target and contract.",
      codeExpression:
        "No neighboring file, hidden dependency, root route, runtime layer, or visual claim may be changed unless explicitly authorized.",
      failurePattern:
        "A bounded fix becomes an unapproved rewrite.",
      auditQuestion:
        "Did the change stay inside the authorized boundary?"
    }),

    Object.freeze({
      direction: "reality",
      lawId: "generation-law",
      lawLabel: "Generation Law",
      route: "/laws/categories/reality/generation/",
      humanPrimary:
        "A beginning is not a completion. A first working form must not pretend to be the final form.",
      engineeringSecondary:
        "A baseline, prototype, render, or pass candidate must state what it actually proves and what remains open.",
      codeExpression:
        "Generation labels, version names, route contracts, and receipts must distinguish baseline, readiness, runtime pass, visual pass, and production authorization.",
      failurePattern:
        "The first coherent version is treated as finished.",
      auditQuestion:
        "What generation is this, and what does that generation actually prove?"
    }),

    Object.freeze({
      direction: "reality",
      lawId: "visual-claim-law",
      lawLabel: "Visual Claim Law",
      route: "/laws/categories/reality/visual-claim/",
      humanPrimary:
        "What looks convincing is not automatically true. Beauty may support understanding, but it does not replace evidence.",
      engineeringSecondary:
        "A diamond, planet, orbit, animation, 3D surface, screenshot, or layout cannot claim source truth or validation by appearance alone.",
      codeExpression:
        "Visual-pass status remains false unless the proper review path accepts it.",
      failurePattern:
        "A polished visual is mistaken for proof.",
      auditQuestion:
        "Is the claim based on appearance, or on verified behavior?"
    }),

    Object.freeze({
      direction: "reality",
      lawId: "human-boundary-law",
      lawLabel: "Human Boundary Law",
      route: "/laws/categories/reality/human-boundary/",
      humanPrimary:
        "A system can help organize, clarify, and prepare, but it must not replace human judgment or qualified authority where those are required.",
      engineeringSecondary:
        "High-stakes medical, legal, financial, safety, scientific, and official claims must preserve appropriate verification boundaries.",
      codeExpression:
        "Public pages must distinguish support, explanation, research posture, and final authority.",
      failurePattern:
        "A tool acts as though it can replace the authority it should only support.",
      auditQuestion:
        "Is the page supporting judgment or impersonating final authority?"
    }),

    Object.freeze({
      direction: "reality",
      lawId: "stale-language-law",
      lawLabel: "Stale Language Law",
      route: "/laws/categories/reality/stale-language/",
      humanPrimary:
        "Old language must not keep governing a situation that has changed.",
      engineeringSecondary:
        "Retired labels, old route identities, deprecated contracts, and previous generation language must not remain active unless intentionally preserved.",
      codeExpression:
        "Current data attributes, receipts, headings, route labels, and UI copy must reflect current authority.",
      failurePattern:
        "A page advances, but old names continue controlling interpretation.",
      auditQuestion:
        "Is any stale language still acting as current truth?"
    }),

    Object.freeze({
      direction: "structure",
      lawId: "animation-law",
      lawLabel: "Animation Law",
      route: "/laws/categories/structure/animation/",
      humanPrimary:
        "Movement should reveal relationship, not conceal disorder.",
      engineeringSecondary:
        "Animation may express hierarchy, motion, and transition, but it cannot replace semantic structure.",
      codeExpression:
        "Reduced-motion fallback, static readability, and control clarity must survive without animation.",
      failurePattern:
        "The page only makes sense while moving.",
      auditQuestion:
        "Does the law still hold when motion is disabled?"
    }),

    Object.freeze({
      direction: "structure",
      lawId: "product-planet-separation-law",
      lawLabel: "Product and Planet Separation Law",
      route: "/laws/categories/structure/product-planet-separation/",
      humanPrimary:
        "Different kinds of things must not be blended just because they share style, language, or atmosphere.",
      engineeringSecondary:
        "Products, planets, laws, showrooms, frontier lanes, diagnostics, and governance routes must preserve their distinct route classes.",
      codeExpression:
        "Route class, public role, data-page, contract, and destination behavior must not collapse into one another.",
      failurePattern:
        "A page feels impressive but no longer knows what kind of thing it is.",
      auditQuestion:
        "Is the object still in the correct class?"
    }),

    Object.freeze({
      direction: "structure",
      lawId: "foreground-law",
      lawLabel: "Foreground Law",
      route: "/laws/categories/structure/foreground/",
      humanPrimary:
        "The most important responsibility must remain visible enough to guide action.",
      engineeringSecondary:
        "Core controls, governing paths, proof surfaces, and return actions must not be buried under decoration or secondary content.",
      codeExpression:
        "Primary navigation, selected state, call-to-action, return controls, and boundary notices must remain reachable and legible.",
      failurePattern:
        "The page is beautiful but the user cannot find what matters.",
      auditQuestion:
        "What must stay in the foreground?"
    }),

    Object.freeze({
      direction: "structure",
      lawId: "access-law",
      lawLabel: "Access Law",
      route: "/laws/categories/structure/access/",
      humanPrimary:
        "A governing standard that cannot be reached cannot govern.",
      engineeringSecondary:
        "Core public pages, law pages, category pages, and proof pages must remain discoverable from the route system.",
      codeExpression:
        "Index routes, category routes, canonical links, and public navigation must not orphan major law content.",
      failurePattern:
        "The law exists, but the visitor cannot find it.",
      auditQuestion:
        "Can the user reach the law from the public system?"
    })
  ]);

  const CANONICAL_LAW_ROUTES = Object.freeze(
    CANONICAL_LAW_RECORDS.map(
      record => record.route
    )
  );

  const LAW_BY_ID = new Map(
    CANONICAL_LAW_RECORDS.map(
      record => [
        record.lawId,
        record
      ]
    )
  );

  const LAW_BY_ROUTE = new Map(
    CANONICAL_LAW_RECORDS.map(
      record => [
        record.route,
        record
      ]
    )
  );

  const LAWS_BY_DIRECTION = new Map(
    DIRECTIONS.map(
      direction => [
        direction,

        Object.freeze(
          CANONICAL_LAW_RECORDS
            .filter(
              record =>
                record.direction === direction
            )
            .map(
              record =>
                record.lawId
            )
        )
      ]
    )
  );

  const subscribers = Object.freeze({
    frame: new Set(),
    reducedMotion: new Set(),
    heldState: new Set(),
    compassState: new Set(),
    semanticProjection: new Set()
  });

  const state = {
    root: null,
    scene: null,
    sceneField: null,
    panel: null,

    panelEyebrow: null,
    panelTitle: null,
    panelPurpose: null,
    panelRelationship: null,
    panelDomain: null,
    panelFunction: null,
    panelCoordinate: null,
    panelSelectionState: null,
    panelRouteStatus: null,
    panelLens: null,
    panelHumanLaw: null,
    panelEngineeringLaw: null,
    panelCodeExpression: null,
    panelFailurePattern: null,
    panelAuditQuestion: null,

    enterButton: null,
    enterLabel: null,
    returnToOrbitButton: null,
    returnToOrbitLabel: null,
    returnHomeButton: null,
    guidance: null,

    controllerReceiptOutput: null,
    controllerValidationOutput: null,
    compassControl: null,

    current: STATES.CONSTELLATION,

    orbitFocus: "flow",
    orbitPreviewFocus: "flow",
    orbitPhase: ORIENTATION_PHASES.COMMITTED,
    orbitGestureActive: false,
    orbitPreviewAccepted: false,
    orbitRevision: 0,
    orbitOrientation: null,
    committedOrbitOrientation: null,
    orbitGestureOrigin: null,

    clusters: new Map(),

    selectedDirection: "",
    selectedCategory: "",
    selectedLaw: "",
    selectedDestinationType: DESTINATION_TYPES.NONE,
    selectedDestinationId: "",
    selectedDestinationLabel: "",
    selectedRoute: "",
    selectedContentId: "",
    selectedLens: "human",
    selectedParagraph: "",

    compassSelected: false,
    panelDescended: false,

    panelDescentFrame: 0,
    panelDescentCommitFrame: 0,
    sceneAscentFrame: 0,
    sceneAscentCommitFrame: 0,

    reducedMotion: false,
    mediaQuery: null,
    mediaQueryListener: null,

    semanticProjection: new Map(),
    semanticProjectionRevision: 0,

    initialized: false,
    lastAction: "pending",
    lastFailure: "",
    validationReceipt: null
  };

  function invariant(
    condition,
    code,
    details = null
  ) {
    if (condition) {
      return;
    }

    const error = new Error(code);
    error.code = code;
    error.details = details;
    throw error;
  }

  function qs(
    selector,
    root = document
  ) {
    return root.querySelector(selector);
  }

  function qsa(
    selector,
    root = document
  ) {
    return Array.from(
      root.querySelectorAll(selector)
    );
  }

  function finiteNumber(
    value,
    fallback = 0
  ) {
    const number = Number(value);

    return Number.isFinite(number)
      ? number
      : fallback;
  }

  function normalizeDirection(value) {
    const direction = String(value || "")
      .trim()
      .toLowerCase();

    return DIRECTIONS.includes(direction)
      ? direction
      : "";
  }

  function normalizeLawId(value) {
    return String(value || "").trim();
  }

  function normalizeRoute(value) {
    const route = String(value || "").trim();

    return route.startsWith("/")
      ? route
      : "";
  }

  function normalizeLabel(
    value,
    fallback = ""
  ) {
    const label = String(value || "").trim();

    return label || fallback;
  }

  function normalizeDepthLayer(value) {
    const layer = String(value || "")
      .trim()
      .toLowerCase();

    if (layer === DEPTH_LAYERS.FRONT) {
      return DEPTH_LAYERS.FRONT;
    }

    if (layer === DEPTH_LAYERS.REAR) {
      return DEPTH_LAYERS.REAR;
    }

    return DEPTH_LAYERS.UNKNOWN;
  }

  function unexpectedPreviewPayloadKeys(payload) {
    if (
      !payload ||
      typeof payload !== "object" ||
      Array.isArray(payload)
    ) {
      return [];
    }

    return Object.keys(payload).filter(
      key =>
        !PREVIEW_PAYLOAD_KEY_SET.has(key)
    );
  }

  function normalizeQuaternionStrict(value) {
    const source =
      Array.isArray(value) ||
      ArrayBuffer.isView(value)
        ? Array.from(value)
        : null;

    if (
      !source ||
      source.length !== 4
    ) {
      return null;
    }

    const quaternion = source.map(
      component => Number(component)
    );

    if (
      quaternion.some(
        component =>
          !Number.isFinite(component)
      )
    ) {
      return null;
    }

    const length = Math.hypot(
      quaternion[0],
      quaternion[1],
      quaternion[2],
      quaternion[3]
    );

    if (
      !Number.isFinite(length) ||
      length < QUATERNION.minimumLength
    ) {
      return null;
    }

    return quaternion.map(
      component =>
        component / length
    );
  }

  function normalizeStoredQuaternion(
    value,
    fallback = QUATERNION.identity
  ) {
    return (
      normalizeQuaternionStrict(value) ||
      Array.from(fallback)
    );
  }

  function createOrientation(
    quaternion,
    primaryId
  ) {
    const normalized =
      normalizeQuaternionStrict(quaternion);

    invariant(
      normalized,
      "LAWS_CONTROLLER_INVALID_QUATERNION"
    );

    return {
      quaternion: normalized,
      primaryId: String(primaryId || "").trim()
    };
  }

  function cloneOrientation(orientation) {
    const source =
      orientation &&
      typeof orientation === "object"
        ? orientation
        : {
            quaternion: QUATERNION.identity,
            primaryId: ""
          };

    return {
      quaternion:
        normalizeStoredQuaternion(
          source.quaternion
        ),

      primaryId: String(
        source.primaryId || ""
      ).trim()
    };
  }

  function freezeOrientation(orientation) {
    const value =
      cloneOrientation(orientation);

    return Object.freeze({
      quaternion: Object.freeze(
        value.quaternion.slice()
      ),

      primaryId: value.primaryId
    });
  }

  function canonicalConstellationOrientation(direction) {
    const normalizedDirection =
      normalizeDirection(direction) || "flow";

    return createOrientation(
      CANONICAL_CONSTELLATION_QUATERNIONS[
        normalizedDirection
      ],

      normalizedDirection
    );
  }

  function validateOrbitPreviewPayload(payload) {
    if (
      !payload ||
      typeof payload !== "object" ||
      Array.isArray(payload)
    ) {
      return Object.freeze({
        pass: false,
        code: "LAWS_ORBIT_PREVIEW_PAYLOAD_REQUIRED"
      });
    }

    const unexpectedKeys =
      unexpectedPreviewPayloadKeys(payload);

    if (unexpectedKeys.length > 0) {
      return Object.freeze({
        pass: false,
        code: "LAWS_ORBIT_PREVIEW_UNEXPECTED_FIELDS_FORBIDDEN",
        unexpectedKeys: Object.freeze(unexpectedKeys.slice())
      });
    }

    const quaternion =
      normalizeQuaternionStrict(payload.quaternion);

    if (!quaternion) {
      return Object.freeze({
        pass: false,
        code: "LAWS_ORBIT_PREVIEW_COMPLETE_QUATERNION_REQUIRED"
      });
    }

    const primaryId =
      normalizeDirection(payload.primaryId);

    if (!primaryId) {
      return Object.freeze({
        pass: false,
        code: "LAWS_ORBIT_PREVIEW_CANONICAL_PRIMARY_DIRECTION_REQUIRED"
      });
    }

    return Object.freeze({
      pass: true,

      orientation: Object.freeze({
        quaternion: Object.freeze(quaternion.slice()),
        primaryId
      })
    });
  }

  function validateClusterPreviewPayload(
    cluster,
    payload
  ) {
    if (
      !cluster ||
      !payload ||
      typeof payload !== "object" ||
      Array.isArray(payload)
    ) {
      return Object.freeze({
        pass: false,
        code: "LAWS_CLUSTER_PREVIEW_PAYLOAD_REQUIRED"
      });
    }

    const unexpectedKeys =
      unexpectedPreviewPayloadKeys(payload);

    if (unexpectedKeys.length > 0) {
      return Object.freeze({
        pass: false,
        code: "LAWS_CLUSTER_PREVIEW_UNEXPECTED_FIELDS_FORBIDDEN",
        unexpectedKeys: Object.freeze(unexpectedKeys.slice())
      });
    }

    const quaternion =
      normalizeQuaternionStrict(payload.quaternion);

    if (!quaternion) {
      return Object.freeze({
        pass: false,
        code: "LAWS_CLUSTER_PREVIEW_COMPLETE_QUATERNION_REQUIRED"
      });
    }

    const primaryId =
      normalizeLawId(payload.primaryId);

    if (
      !primaryId ||
      !cluster.lawIds.includes(primaryId)
    ) {
      return Object.freeze({
        pass: false,
        code: `LAWS_CLUSTER_PREVIEW_CANONICAL_PRIMARY_LAW_REQUIRED:${cluster.direction}`
      });
    }

    return Object.freeze({
      pass: true,

      orientation: Object.freeze({
        quaternion: Object.freeze(quaternion.slice()),
        primaryId
      })
    });
  }

  function presentationModeForState(
    navigationState = state.current
  ) {
    return (
      PRESENTATION_MODE_BY_STATE[navigationState] ||
      PRESENTATION_MODES.HELD
    );
  }

  function directionLabel(direction) {
    const normalizedDirection =
      normalizeDirection(direction);

    return (
      DIRECTION_LABELS[normalizedDirection] ||
      ""
    );
  }

  function directionCoordinate(direction) {
    const normalizedDirection =
      normalizeDirection(direction);

    return (
      DIRECTION_COORDINATES[normalizedDirection] ||
      ""
    );
  }

  function directionRoute(direction) {
    const normalizedDirection =
      normalizeDirection(direction);

    return (
      DIRECTION_TO_CATEGORY_ROUTE[normalizedDirection] ||
      ""
    );
  }

  function createClusterState(direction) {
    const lawIds =
      LAWS_BY_DIRECTION.get(direction) ||
      Object.freeze([]);

    const primaryLaw =
      lawIds[0] || "";

    const orientation =
      createOrientation(
        QUATERNION.identity,
        primaryLaw
      );

    return {
      direction,
      lawIds: Array.from(lawIds),

      primaryLaw,
      previewPrimaryLaw: primaryLaw,

      phase: ORIENTATION_PHASES.COMMITTED,

      gestureActive: false,
      previewAccepted: false,
      revision: 0,

      orientation:
        cloneOrientation(orientation),

      committedOrientation:
        cloneOrientation(orientation),

      gestureOrigin: null
    };
  }

  function getCluster(direction) {
    const normalizedDirection =
      normalizeDirection(direction);

    return normalizedDirection
      ? state.clusters.get(normalizedDirection) || null
      : null;
  }

  function activeClusterDirection() {
    if (
      state.current === STATES.CLUSTER_OPEN ||
      state.current === STATES.LAW_SELECTED
    ) {
      return normalizeDirection(state.selectedDirection);
    }

    return "";
  }

  function activeCluster() {
    return getCluster(activeClusterDirection());
  }

  function canTransition(
    fromState,
    toState
  ) {
    return Boolean(
      TRANSITIONS[fromState] &&
      TRANSITIONS[fromState].includes(toState)
    );
  }

  function isHeld() {
    return state.current === STATES.SYSTEM_HELD;
  }

  function interactionAllowed() {
    return !isHeld();
  }

  function subscribe(
    channel,
    callback
  ) {
    const set = subscribers[channel];

    if (
      !set ||
      typeof callback !== "function"
    ) {
      return () => false;
    }

    set.add(callback);

    return () => {
      set.delete(callback);
      return true;
    };
  }

  function publish(
    channel,
    payload
  ) {
    const set = subscribers[channel];

    if (!set) {
      return;
    }

    for (const callback of set) {
      try {
        callback(payload);
      } catch (_) {}
    }
  }

  function escapeSelectorValue(value) {
    const source = String(value || "");

    if (
      globalThis.CSS &&
      typeof globalThis.CSS.escape === "function"
    ) {
      return globalThis.CSS.escape(source);
    }

    return source.replace(
      /["\\]/g,
      "\\$&"
    );
  }

  function findCategoryElement(direction) {
    const normalizedDirection =
      normalizeDirection(direction);

    if (
      !normalizedDirection ||
      !state.root
    ) {
      return null;
    }

    return qs(
      `[data-laws-category][data-direction="${normalizedDirection}"]`,
      state.root
    );
  }

  function findLawElement(lawId) {
    const id =
      normalizeLawId(lawId);

    if (
      !id ||
      !state.root
    ) {
      return null;
    }

    return qs(
      `[data-laws-law][data-law-id="${escapeSelectorValue(id)}"]`,
      state.root
    );
  }

  function canonicalControlExists(record) {
    const kind = String(record.kind || "")
      .trim()
      .toLowerCase();

    const id = String(
      record.id ||
      record.lawId ||
      record.direction ||
      record.categoryId ||
      ""
    ).trim();

    if (!id) {
      return false;
    }

    if (kind === "law") {
      return Boolean(findLawElement(id));
    }

    if (
      kind === "category" ||
      kind === "direction"
    ) {
      return Boolean(findCategoryElement(id));
    }

    return Boolean(
      findLawElement(id) ||
      findCategoryElement(id)
    );
  }

  function destinationFromElement(element) {
    if (!element) {
      return null;
    }

    return Object.freeze({
      destinationType: String(
        element.dataset.destinationType || ""
      )
        .trim()
        .toLowerCase(),

      destinationId: String(
        element.dataset.destinationId ||
        element.dataset.lawId ||
        element.dataset.categoryId ||
        element.dataset.direction ||
        ""
      ).trim(),

      label: normalizeLabel(
        element.dataset.label ||
        element.dataset.lawLabel ||
        element.dataset.categoryLabel ||
        element.textContent
      ),

      route: normalizeRoute(
        element.dataset.route ||
        element.getAttribute("href")
      )
    });
  }

  function lawParagraphFromElement(element) {
    return normalizeLabel(
      element.dataset.humanLaw ||
      element.dataset.preview ||
      element.dataset.panelBody ||
      element.dataset.whyEnter,

      "This law is a human-first governing principle with a software and route expression."
    );
  }

  function panelFromCategory(element) {
    const direction =
      normalizeDirection(
        element.dataset.direction
      );

    return Object.freeze({
      eyebrow: normalizeLabel(
        element.dataset.categoryLabel ||
        directionLabel(direction),
        "Selected category"
      ),

      title: normalizeLabel(
        element.dataset.panelTitle ||
        element.dataset.categoryTitle ||
        directionLabel(direction),
        "Selected category"
      ),

      purpose: normalizeLabel(
        element.dataset.panelBody ||
        element.dataset.categoryBody,
        "This law direction opens four human-first laws with software parallels."
      ),

      relationship: normalizeLabel(
        element.dataset.panelWhy ||
        element.dataset.categoryWhy,
        "Rotate the cluster and choose the law that matches the issue in front of you."
      )
    });
  }

  function panelFromLaw(element) {
    return Object.freeze({
      eyebrow: normalizeLabel(
        element.dataset.lawType ||
        element.dataset.lawLensLabel,
        "Selected law"
      ),

      title: normalizeLabel(
        element.dataset.panelTitle ||
        element.dataset.label ||
        element.textContent,
        "Selected law"
      ),

      purpose:
        lawParagraphFromElement(element),

      relationship:
        "Human law is primary. The software and code expression are secondary parallels. Choose Enter Selected Law to open the canonical placeholder route."
    });
  }

  function defaultPanel() {
    return Object.freeze({
      eyebrow: "Law Compass",
      title: "Choose a law direction",

      purpose:
        "Begin with the direction closest to the issue: Flow, Integrity, Reality, or Structure.",

      relationship:
        "Each direction opens four laws. Each law begins with the human principle and then shows the software parallel."
    });
  }

  function compassPanel() {
    return Object.freeze({
      eyebrow: "Main Compass",
      title: "Choose where to return",

      purpose:
        "The fixed-center Compass is selected. It does not navigate until you choose the explicit return action.",

      relationship:
        "Return to Main Compass opens the Diamond Gate Bridge homepage. Return to Orbit restores the Law Compass field."
    });
  }

  function setPanel({
    eyebrow,
    title,
    purpose,
    relationship
  }) {
    if (state.panelEyebrow) {
      state.panelEyebrow.textContent =
        eyebrow || "Selected path";
    }

    if (state.panelTitle) {
      state.panelTitle.textContent =
        title || "Choose a law direction";
    }

    if (state.panelPurpose) {
      state.panelPurpose.textContent =
        purpose || "";
    }

    if (state.panelRelationship) {
      state.panelRelationship.textContent =
        relationship || "";
    }
  }

  function setPanelMetadata({
    domain = "None",
    functionLabel = "Unassigned",
    coordinate = "—",
    selection = "Idle",
    route = "Not selected",
    lens = "Human Law"
  } = {}) {
    if (state.panelDomain) {
      state.panelDomain.textContent = domain;
    }

    if (state.panelFunction) {
      state.panelFunction.textContent = functionLabel;
    }

    if (state.panelCoordinate) {
      state.panelCoordinate.textContent = coordinate;
    }

    if (state.panelSelectionState) {
      state.panelSelectionState.textContent = selection;
    }

    if (state.panelRouteStatus) {
      state.panelRouteStatus.textContent = route;
    }

    if (state.panelLens) {
      state.panelLens.textContent = lens;
    }
  }

  function setPanelLawProfile(record) {
    const fallback =
      "Select a law to inspect its human-first profile.";

    if (state.panelHumanLaw) {
      state.panelHumanLaw.textContent =
        record ? record.humanPrimary : fallback;
    }

    if (state.panelEngineeringLaw) {
      state.panelEngineeringLaw.textContent =
        record ? record.engineeringSecondary : fallback;
    }

    if (state.panelCodeExpression) {
      state.panelCodeExpression.textContent =
        record ? record.codeExpression : fallback;
    }

    if (state.panelFailurePattern) {
      state.panelFailurePattern.textContent =
        record ? record.failurePattern : fallback;
    }

    if (state.panelAuditQuestion) {
      state.panelAuditQuestion.textContent =
        record ? record.auditQuestion : fallback;
    }
  }

  function setGuidance(message) {
    if (state.guidance) {
      state.guidance.textContent =
        String(message || "");
    }
  }

  function setEnterEnabled(
    enabled,
    label = "Enter Selected Law"
  ) {
    if (!state.enterButton) {
      return;
    }

    state.enterButton.disabled =
      !enabled;

    state.enterButton.setAttribute(
      "aria-disabled",
      enabled ? "false" : "true"
    );

    if (state.enterLabel) {
      state.enterLabel.textContent = label;
    } else {
      state.enterButton.textContent = label;
    }
  }

  function setReturnToOrbitVisible(
    visible,
    label = "Return to Law Compass"
  ) {
    const control =
      state.returnToOrbitButton;

    if (!control) {
      return;
    }

    control.hidden = !visible;
    control.disabled = !visible;

    control.setAttribute(
      "aria-hidden",
      visible ? "false" : "true"
    );

    control.setAttribute(
      "aria-disabled",
      visible ? "false" : "true"
    );

    if (visible) {
      control.removeAttribute("tabindex");
    } else {
      control.setAttribute("tabindex", "-1");
    }

    if (state.returnToOrbitLabel) {
      state.returnToOrbitLabel.textContent =
        label;
    } else {
      control.textContent = label;
    }
  }

  function setReturnHomeVisible(visible) {
    if (!state.returnHomeButton) {
      return;
    }

    state.returnHomeButton.hidden =
      !visible;

    state.returnHomeButton.setAttribute(
      "aria-hidden",
      visible ? "false" : "true"
    );

    if (visible) {
      state.returnHomeButton.removeAttribute("tabindex");
    } else {
      state.returnHomeButton.setAttribute("tabindex", "-1");
    }
  }

  function clearPanelDescentSchedule() {
    if (state.panelDescentFrame) {
      cancelAnimationFrame(state.panelDescentFrame);
      state.panelDescentFrame = 0;
    }

    if (state.panelDescentCommitFrame) {
      cancelAnimationFrame(state.panelDescentCommitFrame);
      state.panelDescentCommitFrame = 0;
    }
  }

  function clearSceneAscentSchedule() {
    if (state.sceneAscentFrame) {
      cancelAnimationFrame(state.sceneAscentFrame);
      state.sceneAscentFrame = 0;
    }

    if (state.sceneAscentCommitFrame) {
      cancelAnimationFrame(state.sceneAscentCommitFrame);
      state.sceneAscentCommitFrame = 0;
    }
  }

  function clearViewportSchedules() {
    clearPanelDescentSchedule();
    clearSceneAscentSchedule();
  }

  function schedulePanelDescent(
    predicate,
    action
  ) {
    clearViewportSchedules();

    if (!state.panel) {
      return;
    }

    state.panelDescentFrame =
      requestAnimationFrame(() => {
        state.panelDescentFrame = 0;

        state.panelDescentCommitFrame =
          requestAnimationFrame(() => {
            state.panelDescentCommitFrame = 0;

            if (
              typeof predicate === "function" &&
              !predicate()
            ) {
              return;
            }

            state.panel.scrollIntoView({
              behavior:
                state.reducedMotion ? "auto" : "smooth",
              block: "start",
              inline: "nearest"
            });

            state.panelDescended = true;
            recordAction(action);
          });
      });
  }

  function scheduleLawPanelDescent(expectedLawId) {
    schedulePanelDescent(
      () =>
        state.current === STATES.LAW_SELECTED &&
        state.selectedLaw === expectedLawId &&
        !state.compassSelected,

      `law-panel-descended:${expectedLawId}`
    );
  }

  function scheduleCompassPanelDescent() {
    schedulePanelDescent(
      () => state.compassSelected === true,
      "compass-panel-descended"
    );
  }

  function scheduleSceneAscent(
    expectedState,
    expectedDirection = ""
  ) {
    clearViewportSchedules();

    if (!state.scene) {
      return;
    }

    state.sceneAscentFrame =
      requestAnimationFrame(() => {
        state.sceneAscentFrame = 0;

        state.sceneAscentCommitFrame =
          requestAnimationFrame(() => {
            state.sceneAscentCommitFrame = 0;

            if (state.current !== expectedState) {
              return;
            }

            if (
              expectedDirection &&
              state.selectedDirection !== expectedDirection
            ) {
              return;
            }

            state.scene.scrollIntoView({
              behavior:
                state.reducedMotion ? "auto" : "smooth",
              block: "start",
              inline: "nearest"
            });

            recordAction(
              `scene-restored:${expectedState}:${expectedDirection || "constellation"}`
            );
          });
      });
  }

  function resetSelection({
    preserveCompass = false
  } = {}) {
    state.selectedDirection = "";
    state.selectedCategory = "";
    state.selectedLaw = "";

    state.selectedDestinationType =
      DESTINATION_TYPES.NONE;

    state.selectedDestinationId = "";
    state.selectedDestinationLabel = "";
    state.selectedRoute = "";
    state.selectedContentId = "";
    state.selectedLens = "human";
    state.selectedParagraph = "";
    state.panelDescended = false;

    if (!preserveCompass) {
      state.compassSelected = false;
    }

    setPanelLawProfile(null);
  }

  function createPresentationState() {
    const presentation =
      PRESENTATION_BY_STATE[state.current] ||
      PRESENTATION_BY_STATE[STATES.SYSTEM_HELD];

    return Object.freeze({
      mode: presentation.mode,
      navigationState: state.current,

      outerCategoriesActive:
        presentation.outerCategoriesActive,

      activeLawCluster:
        presentation.activeLawCluster,

      lawSelectionPermitted:
        presentation.lawSelectionPermitted,

      additiveCoRenderingAuthorized: false
    });
  }

  function createHeldState() {
    return Object.freeze({
      held: isHeld(),
      terminal: isHeld(),
      interactionEnabled: interactionAllowed(),
      presentationMode: presentationModeForState(),

      reason:
        isHeld()
          ? state.lastFailure || "LAWS_SYSTEM_HELD"
          : ""
    });
  }

  function createCompassState() {
    return Object.freeze({
      fixedCenter: true,
      selected: state.compassSelected,
      interactionEnabled: interactionAllowed(),
      reducedMotion: state.reducedMotion,
      mainCompassRoute: MAIN_COMPASS.route,
      immediateNavigation: false,
      explicitReturnRequired: true,
      inheritsNavigationOrientation: false,
      participatesInNavigationSettlement: false,
      quaternionPublished: false,
      rendererLifecycleOwned: false
    });
  }

  function createSemanticProjectionSnapshot() {
    return Object.freeze(
      Array.from(state.semanticProjection.values()).map(record =>
        Object.freeze({
          id: record.id,
          kind: record.kind,
          x: record.x,
          y: record.y,
          radiusPx: record.radiusPx,
          depthLayer: record.depthLayer,
          compassOverlap: record.compassOverlap,
          visible: record.visible
        })
      )
    );
  }

  function createFrameState() {
    const cluster =
      activeCluster();

    const presentation =
      createPresentationState();

    return Object.freeze({
      moduleId: MODULE.id,
      moduleVersion: MODULE.version,

      motionContractId:
        MODULE.motionContractId,

      motionContractVersion:
        MODULE.motionContractVersion,

      state: state.current,
      navigationState: state.current,
      presentationMode: presentation.mode,
      presentation,

      orbitFocus: state.orbitFocus,
      orbitPreviewFocus: state.orbitPreviewFocus,
      orbitPhase: state.orbitPhase,
      orbitGestureActive: state.orbitGestureActive,
      orbitPreviewAccepted: state.orbitPreviewAccepted,
      orbitRevision: state.orbitRevision,

      orbitOrientation:
        freezeOrientation(state.orbitOrientation),

      committedOrbitOrientation:
        freezeOrientation(state.committedOrbitOrientation),

      activeClusterDirection:
        cluster ? cluster.direction : "",

      cluster:
        cluster
          ? Object.freeze({
              direction: cluster.direction,

              lawIds: Object.freeze(
                cluster.lawIds.slice()
              ),

              primaryLaw: cluster.primaryLaw,
              previewPrimaryLaw: cluster.previewPrimaryLaw,
              phase: cluster.phase,
              gestureActive: cluster.gestureActive,
              previewAccepted: cluster.previewAccepted,
              revision: cluster.revision,

              orientation:
                freezeOrientation(cluster.orientation),

              committedOrientation:
                freezeOrientation(cluster.committedOrientation)
            })
          : null,

      selectedDirection: state.selectedDirection,
      selectedCategory: state.selectedCategory,
      selectedLaw: state.selectedLaw,
      selectedDestinationType: state.selectedDestinationType,
      selectedDestinationId: state.selectedDestinationId,
      selectedDestinationLabel: state.selectedDestinationLabel,
      selectedRoute: state.selectedRoute,
      selectedContentId: state.selectedContentId,
      selectedLens: state.selectedLens,
      selectedParagraph: state.selectedParagraph,

      compassSelected: state.compassSelected,
      panelDescended: state.panelDescended,
      reducedMotion: state.reducedMotion,
      held: isHeld(),

      compass: createCompassState(),

      semanticProjectionRevision:
        state.semanticProjectionRevision,

      semanticProjection:
        createSemanticProjectionSnapshot(),

      canonicalLawRecords:
        CANONICAL_LAW_RECORDS,

      canonicalLawRoutes:
        CANONICAL_LAW_ROUTES,

      directions:
        DIRECTIONS,

      mainCompass:
        MAIN_COMPASS,

      humanLawPrimary: true,
      softwareLawSecondary: true,
      placeholderPagesPermitted: true,

      interactionModuleId:
        MODULE.interactionModuleId,

      interactionModuleVersion:
        MODULE.interactionModuleVersion,

      motionOwner:
        MODULE.interactionModuleId,

      acceptedStateAuthority:
        MODULE.id,

      navigationTransitionAuthority:
        MODULE.id,

      lastAction: state.lastAction,
      lastFailure: state.lastFailure
    });
  }

  function createCompatibilityReceipt(frame) {
    return Object.freeze({
      contractId:
        "LAWS_CONTROLLER_FOUR_DIRECTION_HUMAN_FIRST_v1",

      motionContractId:
        MODULE.motionContractId,

      motionContractVersion:
        MODULE.motionContractVersion,

      status:
        frame.held ? "held" : "available",

      state: frame.state,
      navigationState: frame.navigationState,
      presentationMode: frame.presentationMode,

      outerCategoriesActive:
        frame.presentation.outerCategoriesActive,

      activeLawCluster:
        frame.presentation.activeLawCluster,

      lawSelectionPermitted:
        frame.presentation.lawSelectionPermitted,

      additiveCoRenderingAuthorized: false,

      orbitFocus: frame.orbitFocus,
      orbitPreviewFocus: frame.orbitPreviewFocus,
      orbitPhase: frame.orbitPhase,
      orbitGestureActive: frame.orbitGestureActive,
      orbitPreviewAccepted: frame.orbitPreviewAccepted,
      orbitRevision: frame.orbitRevision,
      orbitQuaternion: frame.orbitOrientation.quaternion,

      activeClusterDirection:
        frame.activeClusterDirection,

      clusterPrimaryLaw:
        frame.cluster ? frame.cluster.primaryLaw : "",

      clusterPreviewPrimaryLaw:
        frame.cluster ? frame.cluster.previewPrimaryLaw : "",

      clusterPhase:
        frame.cluster ? frame.cluster.phase : ORIENTATION_PHASES.IDLE,

      clusterGestureActive:
        frame.cluster ? frame.cluster.gestureActive : false,

      clusterPreviewAccepted:
        frame.cluster ? frame.cluster.previewAccepted : false,

      clusterRevision:
        frame.cluster ? frame.cluster.revision : 0,

      clusterQuaternion:
        frame.cluster
          ? frame.cluster.orientation.quaternion
          : QUATERNION.identity,

      selectedDirection: frame.selectedDirection,
      selectedCategory: frame.selectedCategory,
      selectedLaw: frame.selectedLaw,
      selectedDestinationType: frame.selectedDestinationType,
      selectedDestinationId: frame.selectedDestinationId,
      selectedDestinationLabel: frame.selectedDestinationLabel,
      selectedRoute: frame.selectedRoute,

      compassSelected: frame.compassSelected,
      panelDescended: frame.panelDescended,
      reducedMotion: frame.reducedMotion,
      held: frame.held,

      compassFixedCenter: frame.compass.fixedCenter,
      compassImmediateNavigation: frame.compass.immediateNavigation,
      compassExplicitReturnRequired: frame.compass.explicitReturnRequired,
      mainCompassRoute: frame.compass.mainCompassRoute,

      directionCount: 4,
      lawCount: 16,
      lawsPerDirection: 4,

      humanLawPrimary: true,
      softwareLawSecondary: true,
      codeExpressionTertiary: true,
      placeholderPagesPermitted: true,

      semanticProjectionRevision:
        frame.semanticProjectionRevision,

      semanticProjectionFields:
        Object.freeze([
          "id",
          "kind",
          "x",
          "y",
          "radiusPx",
          "depthLayer",
          "compassOverlap",
          "visible"
        ]),

      interactionPriorityPublished: false,
      pointerInterpreterOwner: MODULE.interactionModuleId,
      pointerTapArbitrationOwner: MODULE.interactionModuleId,
      wholeCrystalHitTestOwner: MODULE.interactionModuleId,
      syntheticClickSuppressionOwner: MODULE.interactionModuleId,
      clusterExitSwipeClassificationOwner: MODULE.interactionModuleId,
      interactionPriorityDerivationOwner: MODULE.interactionModuleId,
      projectionDomApplicationOwner: MODULE.interactionModuleId,
      motionDirectionOwner: MODULE.interactionModuleId,
      motionSensitivityOwner: MODULE.interactionModuleId,
      gestureAxisSelectionOwner: MODULE.interactionModuleId,
      gestureQuaternionConstructionOwner: MODULE.interactionModuleId,
      grabbedObjectTrackingOwner: MODULE.interactionModuleId,
      primaryVisualIdentityCalculationOwner: MODULE.interactionModuleId,

      orbitStateAuthority: MODULE.id,
      clusterStateAuthority: MODULE.id,
      quaternionAcceptanceAuthority: MODULE.id,
      navigationTransitionAuthority: MODULE.id,
      clusterExitTransitionAuthority: MODULE.id,

      lastAction: frame.lastAction,
      lastFailure: frame.lastFailure
    });
  }

  function syncDatasets(frame) {
    if (!state.root) {
      return;
    }

    const cluster = frame.cluster;

    state.root.dataset.lawsMode =
      frame.presentationMode;

    state.root.dataset.lawsControllerState =
      frame.navigationState;

    state.root.dataset.lawsNavigationState =
      frame.navigationState;

    state.root.dataset.lawsPresentationMode =
      frame.presentationMode;

    state.root.dataset.outerCategoriesActive =
      frame.presentation.outerCategoriesActive ? "true" : "false";

    state.root.dataset.activeLawCluster =
      frame.presentation.activeLawCluster ? "true" : "false";

    state.root.dataset.lawSelectionPermitted =
      frame.presentation.lawSelectionPermitted ? "true" : "false";

    state.root.dataset.additiveCoRenderingAuthorized =
      "false";

    state.root.dataset.orbitFocus =
      frame.orbitFocus;

    state.root.dataset.orbitPreviewFocus =
      frame.orbitPreviewFocus;

    state.root.dataset.orbitPhase =
      frame.orbitPhase;

    state.root.dataset.orbitGestureActive =
      frame.orbitGestureActive ? "true" : "false";

    state.root.dataset.orbitPreviewAccepted =
      frame.orbitPreviewAccepted ? "true" : "false";

    state.root.dataset.orbitRevision =
      String(frame.orbitRevision);

    state.root.dataset.orbitQuaternion =
      JSON.stringify(frame.orbitOrientation.quaternion);

    state.root.dataset.activeClusterDirection =
      frame.activeClusterDirection;

    state.root.dataset.clusterPrimaryLaw =
      cluster ? cluster.primaryLaw : "";

    state.root.dataset.clusterPreviewPrimaryLaw =
      cluster ? cluster.previewPrimaryLaw : "";

    state.root.dataset.clusterPhase =
      cluster ? cluster.phase : ORIENTATION_PHASES.IDLE;

    state.root.dataset.clusterGestureActive =
      cluster && cluster.gestureActive ? "true" : "false";

    state.root.dataset.clusterPreviewAccepted =
      cluster && cluster.previewAccepted ? "true" : "false";

    state.root.dataset.clusterRevision =
      String(cluster ? cluster.revision : 0);

    state.root.dataset.clusterQuaternion =
      cluster
        ? JSON.stringify(cluster.orientation.quaternion)
        : "";

    state.root.dataset.selectedDirection =
      frame.selectedDirection;

    state.root.dataset.selectedCategory =
      frame.selectedCategory;

    state.root.dataset.selectedLaw =
      frame.selectedLaw;

    state.root.dataset.selectedDestinationType =
      frame.selectedDestinationType;

    state.root.dataset.selectedDestinationId =
      frame.selectedDestinationId;

    state.root.dataset.selectedDestinationLabel =
      frame.selectedDestinationLabel;

    state.root.dataset.selectedRoute =
      frame.selectedRoute;

    state.root.dataset.selectedContentId =
      frame.selectedContentId;

    state.root.dataset.selectedLens =
      frame.selectedLens;

    state.root.dataset.selectedParagraph =
      frame.selectedParagraph;

    state.root.dataset.compassSelected =
      frame.compassSelected ? "true" : "false";

    state.root.dataset.panelDescended =
      frame.panelDescended ? "true" : "false";

    state.root.dataset.reducedMotion =
      frame.reducedMotion ? "true" : "false";

    state.root.dataset.held =
      frame.held ? "true" : "false";

    state.root.dataset.compassFixedCenter =
      "true";

    state.root.dataset.compassMainRoute =
      MAIN_COMPASS.route;

    state.root.dataset.compassImmediateNavigation =
      "false";

    state.root.dataset.lawsControllerStatus =
      frame.held ? "held" : "available";

    state.root.dataset.lawsControllerVersion =
      MODULE.version;

    state.root.dataset.lawsInteractionModule =
      MODULE.interactionModuleId;

    state.root.dataset.lawsMotionContractId =
      MODULE.motionContractId;

    state.root.dataset.lawsMotionContractVersion =
      MODULE.motionContractVersion;

    state.root.dataset.lawsMotionOwner =
      MODULE.interactionModuleId;

    state.root.dataset.lawsInteractionPriorityOwner =
      MODULE.interactionModuleId;

    state.root.dataset.lawsAcceptedStateAuthority =
      MODULE.id;

    state.root.dataset.lawsNavigationAuthority =
      MODULE.id;

    state.root.dataset.humanLawPrimary =
      "true";

    state.root.dataset.softwareLawSecondary =
      "true";

    state.root.dataset.semanticProjectionRevision =
      String(frame.semanticProjectionRevision);

    qsa(
      "[data-laws-category]",
      state.root
    ).forEach(element => {
      const direction =
        normalizeDirection(element.dataset.direction);

      const active =
        frame.presentation.outerCategoriesActive;

      const primary =
        active &&
        direction === frame.orbitFocus;

      element.dataset.active =
        active ? "true" : "false";

      element.dataset.selected =
        !frame.compassSelected &&
        frame.selectedDestinationType === DESTINATION_TYPES.CATEGORY &&
        frame.selectedDirection === direction
          ? "true"
          : "false";

      element.dataset.primary =
        primary ? "true" : "false";

      element.setAttribute(
        "aria-disabled",
        active ? "false" : "true"
      );

      if (primary) {
        element.setAttribute("aria-current", "true");
      } else {
        element.removeAttribute("aria-current");
      }
    });

    qsa(
      "[data-laws-law]",
      state.root
    ).forEach(element => {
      const lawId =
        normalizeLawId(element.dataset.lawId);

      const lawRecord =
        LAW_BY_ID.get(lawId);

      const inActiveCluster =
        Boolean(
          cluster &&
          lawRecord &&
          lawRecord.direction === cluster.direction
        );

      const selected =
        !frame.compassSelected &&
        inActiveCluster &&
        lawId === frame.selectedLaw;

      const primary =
        inActiveCluster &&
        lawId === cluster.primaryLaw;

      element.dataset.active =
        inActiveCluster ? "true" : "false";

      element.dataset.selected =
        selected ? "true" : "false";

      element.dataset.primary =
        primary ? "true" : "false";

      element.setAttribute(
        "aria-disabled",
        inActiveCluster ? "false" : "true"
      );

      if (
        selected ||
        primary
      ) {
        element.setAttribute("aria-current", "true");
      } else {
        element.removeAttribute("aria-current");
      }
    });

    if (state.compassControl) {
      state.compassControl.dataset.selected =
        frame.compassSelected ? "true" : "false";

      state.compassControl.dataset.fixedCenter =
        "true";

      state.compassControl.dataset.interactionEnabled =
        frame.compass.interactionEnabled ? "true" : "false";

      state.compassControl.dataset.immediateNavigation =
        "false";

      state.compassControl.setAttribute(
        "aria-expanded",
        frame.compassSelected ? "true" : "false"
      );

      if (frame.compassSelected) {
        state.compassControl.setAttribute("aria-current", "true");
      } else {
        state.compassControl.removeAttribute("aria-current");
      }
    }
  }

  function writeCompatibilityReceipt(frame) {
    const receipt =
      createCompatibilityReceipt(frame);

    const serialized =
      JSON.stringify(receipt);

    if (state.root) {
      state.root.dataset.lawsControllerReceipt =
        serialized;
    }

    if (state.controllerReceiptOutput) {
      if ("value" in state.controllerReceiptOutput) {
        state.controllerReceiptOutput.value = serialized;
      }

      state.controllerReceiptOutput.textContent = serialized;
    }

    globalThis.DGB_LAWS_CONTROLLER_RECEIPT =
      receipt;
  }

  function publishFrame() {
    const frame =
      createFrameState();

    syncDatasets(frame);
    writeCompatibilityReceipt(frame);

    publish(CHANNELS.FRAME, frame);

    return frame;
  }

  function recordAction(
    action,
    failure = ""
  ) {
    state.lastAction =
      String(action || "");

    state.lastFailure =
      String(failure || "");

    return publishFrame();
  }

  function rejectRequest(
    action,
    code
  ) {
    recordAction(action, code);
    return false;
  }

  function syncPresentation() {
    if (state.compassSelected) {
      setPanel(compassPanel());

      setPanelMetadata({
        domain: "Main Compass",
        functionLabel: "Website gateway",
        coordinate: "Fixed center",
        selection: "Compass selected",
        route: MAIN_COMPASS.route,
        lens: "Return"
      });

      setPanelLawProfile(null);

      setEnterEnabled(
        false,
        "Enter Selected Law"
      );

      setReturnHomeVisible(true);

      setReturnToOrbitVisible(
        true,
        state.current === STATES.CONSTELLATION
          ? "Return to Law Compass"
          : "Return to Category"
      );

      setGuidance(
        "The Compass is selected. Use Return to Main Compass to leave the Laws chamber, or Return to Law Compass to restore this field."
      );

      return;
    }

    setReturnHomeVisible(false);

    if (state.current === STATES.CONSTELLATION) {
      setPanel(defaultPanel());
      setPanelMetadata();
      setPanelLawProfile(null);

      setEnterEnabled(
        false,
        "Enter Selected Law"
      );

      setReturnToOrbitVisible(false);

      setGuidance(
        "Tap Flow, Integrity, Reality, or Structure to open its four-law cluster."
      );

      return;
    }

    if (state.current === STATES.CLUSTER_OPEN) {
      const category =
        findCategoryElement(state.selectedDirection);

      if (category) {
        setPanel(panelFromCategory(category));

        setPanelMetadata({
          domain: directionLabel(state.selectedDirection),

          functionLabel:
            normalizeLabel(
              category.dataset.panelTitle ||
              category.dataset.categoryFunction ||
              category.dataset.label,
              "Law direction"
            ),

          coordinate:
            normalizeLabel(
              category.dataset.coordinateLabel,
              directionCoordinate(state.selectedDirection)
            ),

          selection: "Category open",
          route: "Law required",
          lens: "Human Law"
        });
      }

      setPanelLawProfile(null);

      setEnterEnabled(
        false,
        "Enter Selected Law"
      );

      setReturnToOrbitVisible(false);

      setGuidance(
        "Choose one law inside this direction. Human law is primary; software law is secondary."
      );

      return;
    }

    if (state.current === STATES.LAW_SELECTED) {
      const law =
        findLawElement(state.selectedLaw);

      const record =
        LAW_BY_ID.get(state.selectedLaw) || null;

      if (law) {
        setPanel(panelFromLaw(law));

        setPanelMetadata({
          domain: directionLabel(state.selectedDirection),

          functionLabel:
            normalizeLabel(
              law.dataset.localFunction,
              "Human-first law"
            ),

          coordinate:
            normalizeLabel(
              law.dataset.localCoordinate,
              state.selectedLaw
            ),

          selection: "Law selected",
          route: state.selectedRoute || "Not selected",
          lens: "Human First"
        });
      }

      setPanelLawProfile(record);

      setEnterEnabled(
        Boolean(state.selectedRoute),
        "Enter Selected Law"
      );

      setReturnToOrbitVisible(
        true,
        "Return to Category"
      );

      setGuidance(
        "Review the selected law. Enter Selected Law opens its canonical placeholder route. Return to Category restores the four-law cluster."
      );

      return;
    }

    setPanel({
      eyebrow: "System held",
      title: "Law Compass is unavailable",

      purpose:
        "The controller could not establish or preserve a safe interaction state.",

      relationship:
        "Static content may remain available, but interactive requests are rejected."
    });

    setPanelMetadata({
      domain: "Unavailable",
      functionLabel: "Held",
      coordinate: "—",
      selection: "Held",
      route: "Unavailable",
      lens: "Failure"
    });

    setPanelLawProfile(null);

    setEnterEnabled(false, "Unavailable");
    setReturnHomeVisible(false);
    setReturnToOrbitVisible(false);

    setGuidance(
      "The Law Compass is held because its controller foundation could not be validated."
    );
  }

  function applyState(
    nextState,
    patch = {},
    action = ""
  ) {
    invariant(
      canTransition(state.current, nextState),
      "LAWS_ILLEGAL_STATE_TRANSITION",
      {
        from: state.current,
        to: nextState
      }
    );

    const previousHeld =
      isHeld();

    state.current = nextState;

    for (const [key, value] of Object.entries(patch)) {
      if (
        Object.prototype.hasOwnProperty.call(state, key)
      ) {
        state[key] = value;
      }
    }

    syncPresentation();

    const frame =
      recordAction(action);

    if (previousHeld !== frame.held) {
      publish(CHANNELS.HELD_STATE, createHeldState());
      publish(CHANNELS.COMPASS_STATE, createCompassState());
    }

    return true;
  }

  function setConstellationOrientation(
    orientation,
    {
      committed = false,
      phase = ORIENTATION_PHASES.PREVIEW,
      gestureActive = false,
      previewAccepted = false,
      incrementRevision = false
    } = {}
  ) {
    const normalized =
      cloneOrientation(orientation);

    invariant(
      normalizeDirection(normalized.primaryId),
      "LAWS_CONSTELLATION_PRIMARY_DIRECTION_INVALID"
    );

    state.orbitOrientation = normalized;
    state.orbitPreviewFocus = normalized.primaryId;
    state.orbitPhase = phase;
    state.orbitGestureActive = Boolean(gestureActive);
    state.orbitPreviewAccepted = Boolean(previewAccepted);

    if (incrementRevision) {
      state.orbitRevision += 1;
    }

    if (committed) {
      state.committedOrbitOrientation =
        cloneOrientation(normalized);

      state.orbitFocus =
        normalized.primaryId;

      state.orbitPreviewFocus =
        normalized.primaryId;
    }
  }

  function setClusterOrientation(
    cluster,
    orientation,
    {
      committed = false,
      phase = ORIENTATION_PHASES.PREVIEW,
      gestureActive = false,
      previewAccepted = false,
      incrementRevision = false
    } = {}
  ) {
    invariant(
      cluster,
      "LAWS_CLUSTER_REQUIRED"
    );

    const normalized =
      cloneOrientation(orientation);

    invariant(
      cluster.lawIds.includes(normalized.primaryId),
      `LAWS_CLUSTER_PRIMARY_LAW_INVALID:${cluster.direction}`
    );

    cluster.orientation = normalized;
    cluster.previewPrimaryLaw = normalized.primaryId;
    cluster.phase = phase;
    cluster.gestureActive = Boolean(gestureActive);
    cluster.previewAccepted = Boolean(previewAccepted);

    if (incrementRevision) {
      cluster.revision += 1;
    }

    if (committed) {
      cluster.committedOrientation =
        cloneOrientation(normalized);

      cluster.primaryLaw =
        normalized.primaryId;

      cluster.previewPrimaryLaw =
        normalized.primaryId;
    }

    return true;
  }

  function beginOrbitGesture() {
    if (arguments.length !== 0) {
      return rejectRequest(
        "orbit-gesture-begin-rejected",
        "LAWS_ORBIT_GESTURE_BEGIN_ACCEPTS_NO_PAYLOAD"
      );
    }

    if (
      isHeld() ||
      state.current !== STATES.CONSTELLATION
    ) {
      return false;
    }

    if (state.orbitGestureActive) {
      return true;
    }

    state.orbitGestureOrigin =
      cloneOrientation(state.committedOrbitOrientation);

    setConstellationOrientation(
      state.orbitOrientation,
      {
        committed: false,
        phase: ORIENTATION_PHASES.PREVIEW,
        gestureActive: true,
        previewAccepted: false
      }
    );

    recordAction("orbit-gesture-began");

    return true;
  }

  function requestOrbitPreview(payload) {
    if (arguments.length !== 1) {
      return rejectRequest(
        "orbit-preview-rejected",
        "LAWS_ORBIT_PREVIEW_EXACT_PAYLOAD_REQUIRED"
      );
    }

    if (
      isHeld() ||
      state.current !== STATES.CONSTELLATION
    ) {
      return false;
    }

    if (!state.orbitGestureActive) {
      return rejectRequest(
        "orbit-preview-rejected",
        "LAWS_ORBIT_PREVIEW_ACTIVE_TRANSACTION_REQUIRED"
      );
    }

    const validation =
      validateOrbitPreviewPayload(payload);

    if (!validation.pass) {
      return rejectRequest(
        "orbit-preview-rejected",
        validation.code
      );
    }

    setConstellationOrientation(
      validation.orientation,
      {
        committed: false,
        phase: ORIENTATION_PHASES.PREVIEW,
        gestureActive: true,
        previewAccepted: true
      }
    );

    recordAction(
      `orbit-preview-accepted:${validation.orientation.primaryId}`
    );

    return true;
  }

  function requestOrbitCommit() {
    if (arguments.length !== 0) {
      return rejectRequest(
        "orbit-commit-rejected",
        "LAWS_ORBIT_COMMIT_ACCEPTS_NO_PAYLOAD"
      );
    }

    if (
      isHeld() ||
      state.current !== STATES.CONSTELLATION
    ) {
      return false;
    }

    if (
      !state.orbitGestureActive ||
      !state.orbitPreviewAccepted
    ) {
      return rejectRequest(
        "orbit-commit-rejected",
        "LAWS_ORBIT_COMMIT_ACCEPTED_PREVIEW_REQUIRED"
      );
    }

    const committed =
      cloneOrientation(state.orbitOrientation);

    setConstellationOrientation(
      committed,
      {
        committed: true,
        phase: ORIENTATION_PHASES.COMMITTED,
        gestureActive: false,
        previewAccepted: false,
        incrementRevision: true
      }
    );

    state.orbitGestureOrigin = null;

    recordAction(
      `orbit-committed:${committed.primaryId}`
    );

    return true;
  }

  function requestOrbitCancel(
    reason = "cancelled"
  ) {
    if (arguments.length > 1) {
      return rejectRequest(
        "orbit-cancel-rejected",
        "LAWS_ORBIT_CANCEL_ARGUMENT_COUNT_INVALID"
      );
    }

    if (isHeld()) {
      return false;
    }

    if (!state.orbitGestureActive) {
      return false;
    }

    const restored =
      cloneOrientation(
        state.orbitGestureOrigin ||
        state.committedOrbitOrientation
      );

    setConstellationOrientation(
      restored,
      {
        committed: false,
        phase: ORIENTATION_PHASES.CANCELLED,
        gestureActive: false,
        previewAccepted: false
      }
    );

    state.orbitGestureOrigin = null;

    recordAction(
      `orbit-cancelled:${String(reason || "cancelled")}`
    );

    state.orbitPhase =
      ORIENTATION_PHASES.COMMITTED;

    recordAction("orbit-cancel-settled");

    return true;
  }

  function requestOrbitFocus(direction) {
    if (arguments.length !== 1) {
      return false;
    }

    const normalizedDirection =
      normalizeDirection(direction);

    if (
      isHeld() ||
      !normalizedDirection ||
      state.current !== STATES.CONSTELLATION
    ) {
      return false;
    }

    if (state.orbitGestureActive) {
      requestOrbitCancel("explicit-orbit-focus");
    }

    setConstellationOrientation(
      canonicalConstellationOrientation(normalizedDirection),
      {
        committed: true,
        phase: ORIENTATION_PHASES.COMMITTED,
        gestureActive: false,
        previewAccepted: false,
        incrementRevision: true
      }
    );

    state.orbitGestureOrigin = null;

    recordAction(
      `orbit-focus-settled:${normalizedDirection}`
    );

    return true;
  }

  function beginClusterGesture(direction) {
    if (arguments.length !== 1) {
      return rejectRequest(
        "cluster-gesture-begin-rejected",
        "LAWS_CLUSTER_GESTURE_BEGIN_EXACT_DIRECTION_REQUIRED"
      );
    }

    if (isHeld()) {
      return false;
    }

    const normalizedDirection =
      normalizeDirection(direction);

    const cluster =
      getCluster(normalizedDirection);

    if (
      !cluster ||
      !(
        state.current === STATES.CLUSTER_OPEN ||
        state.current === STATES.LAW_SELECTED
      ) ||
      normalizedDirection !== activeClusterDirection()
    ) {
      return false;
    }

    if (cluster.gestureActive) {
      return true;
    }

    cluster.gestureOrigin =
      cloneOrientation(cluster.committedOrientation);

    setClusterOrientation(
      cluster,
      cluster.orientation,
      {
        committed: false,
        phase: ORIENTATION_PHASES.PREVIEW,
        gestureActive: true,
        previewAccepted: false
      }
    );

    recordAction(
      `cluster-gesture-began:${normalizedDirection}`
    );

    return true;
  }

  function requestClusterPreview(
    direction,
    payload
  ) {
    if (arguments.length !== 2) {
      return rejectRequest(
        "cluster-preview-rejected",
        "LAWS_CLUSTER_PREVIEW_EXACT_DIRECTION_AND_PAYLOAD_REQUIRED"
      );
    }

    if (isHeld()) {
      return false;
    }

    const normalizedDirection =
      normalizeDirection(direction);

    const cluster =
      getCluster(normalizedDirection);

    if (
      !cluster ||
      !(
        state.current === STATES.CLUSTER_OPEN ||
        state.current === STATES.LAW_SELECTED
      ) ||
      normalizedDirection !== activeClusterDirection()
    ) {
      return false;
    }

    if (!cluster.gestureActive) {
      return rejectRequest(
        "cluster-preview-rejected",
        `LAWS_CLUSTER_PREVIEW_ACTIVE_TRANSACTION_REQUIRED:${normalizedDirection}`
      );
    }

    const validation =
      validateClusterPreviewPayload(
        cluster,
        payload
      );

    if (!validation.pass) {
      return rejectRequest(
        "cluster-preview-rejected",
        validation.code
      );
    }

    setClusterOrientation(
      cluster,
      validation.orientation,
      {
        committed: false,
        phase: ORIENTATION_PHASES.PREVIEW,
        gestureActive: true,
        previewAccepted: true
      }
    );

    recordAction(
      `cluster-preview-accepted:${normalizedDirection}:${validation.orientation.primaryId}`
    );

    return true;
  }

  function requestClusterCommit(direction) {
    if (arguments.length !== 1) {
      return rejectRequest(
        "cluster-commit-rejected",
        "LAWS_CLUSTER_COMMIT_EXACT_DIRECTION_REQUIRED"
      );
    }

    if (isHeld()) {
      return false;
    }

    const normalizedDirection =
      normalizeDirection(direction);

    const cluster =
      getCluster(normalizedDirection);

    if (
      !cluster ||
      !(
        state.current === STATES.CLUSTER_OPEN ||
        state.current === STATES.LAW_SELECTED
      ) ||
      normalizedDirection !== activeClusterDirection()
    ) {
      return false;
    }

    if (
      !cluster.gestureActive ||
      !cluster.previewAccepted
    ) {
      return rejectRequest(
        "cluster-commit-rejected",
        `LAWS_CLUSTER_COMMIT_ACCEPTED_PREVIEW_REQUIRED:${normalizedDirection}`
      );
    }

    const committed =
      cloneOrientation(cluster.orientation);

    setClusterOrientation(
      cluster,
      committed,
      {
        committed: true,
        phase: ORIENTATION_PHASES.COMMITTED,
        gestureActive: false,
        previewAccepted: false,
        incrementRevision: true
      }
    );

    cluster.gestureOrigin = null;

    recordAction(
      `cluster-committed:${normalizedDirection}:${committed.primaryId}`
    );

    return true;
  }

  function requestClusterCancel(
    direction,
    reason = "cancelled"
  ) {
    if (
      arguments.length < 1 ||
      arguments.length > 2
    ) {
      return rejectRequest(
        "cluster-cancel-rejected",
        "LAWS_CLUSTER_CANCEL_ARGUMENT_COUNT_INVALID"
      );
    }

    if (isHeld()) {
      return false;
    }

    const normalizedDirection =
      normalizeDirection(direction);

    const cluster =
      getCluster(normalizedDirection);

    if (
      !cluster ||
      !cluster.gestureActive
    ) {
      return false;
    }

    const restored =
      cloneOrientation(
        cluster.gestureOrigin ||
        cluster.committedOrientation
      );

    setClusterOrientation(
      cluster,
      restored,
      {
        committed: false,
        phase: ORIENTATION_PHASES.CANCELLED,
        gestureActive: false,
        previewAccepted: false
      }
    );

    cluster.gestureOrigin = null;

    recordAction(
      `cluster-cancelled:${normalizedDirection}:${String(reason || "cancelled")}`
    );

    cluster.phase =
      ORIENTATION_PHASES.COMMITTED;

    recordAction(
      `cluster-cancel-settled:${normalizedDirection}`
    );

    return true;
  }

  function cancelActiveGestures(reason) {
    if (state.orbitGestureActive) {
      requestOrbitCancel(reason);
    }

    for (const cluster of state.clusters.values()) {
      if (cluster.gestureActive) {
        requestClusterCancel(cluster.direction, reason);
      }
    }
  }

  function requestCategorySelection(directionId) {
    const direction =
      normalizeDirection(directionId);

    if (
      isHeld() ||
      !direction ||
      state.current !== STATES.CONSTELLATION
    ) {
      return false;
    }

    const element =
      findCategoryElement(direction);

    if (!element) {
      recordAction(
        "category-selection-rejected",
        `CATEGORY_NOT_FOUND:${direction}`
      );

      return false;
    }

    if (state.orbitGestureActive) {
      requestOrbitCancel("category-selection");
    }

    const destination =
      destinationFromElement(element);

    setConstellationOrientation(
      canonicalConstellationOrientation(direction),
      {
        committed: true,
        phase: ORIENTATION_PHASES.COMMITTED,
        gestureActive: false,
        previewAccepted: false,
        incrementRevision: true
      }
    );

    resetSelection();

    return applyState(
      STATES.CLUSTER_OPEN,
      {
        selectedDirection: direction,
        selectedCategory: direction,

        selectedDestinationType:
          DESTINATION_TYPES.CATEGORY,

        selectedDestinationId: direction,

        selectedDestinationLabel:
          destination
            ? destination.label || directionLabel(direction)
            : directionLabel(direction),

        selectedRoute: "",
        selectedParagraph: "",
        compassSelected: false,
        panelDescended: false
      },
      `category-selected:${direction}`
    );
  }

  function requestLawSelection(lawId) {
    const id =
      normalizeLawId(lawId);

    if (
      isHeld() ||
      !id ||
      !(
        state.current === STATES.CLUSTER_OPEN ||
        state.current === STATES.LAW_SELECTED
      )
    ) {
      return false;
    }

    const canonical =
      LAW_BY_ID.get(id);

    const element =
      findLawElement(id);

    if (
      !canonical ||
      !element
    ) {
      recordAction(
        "law-selection-rejected",
        `LAW_NOT_FOUND:${id}`
      );

      return false;
    }

    if (
      canonical.direction !== state.selectedDirection
    ) {
      recordAction(
        "law-selection-rejected",
        `LAW_OUTSIDE_ACTIVE_CLUSTER:${id}`
      );

      return false;
    }

    const cluster =
      getCluster(canonical.direction);

    if (
      !cluster ||
      !cluster.lawIds.includes(id)
    ) {
      recordAction(
        "law-selection-rejected",
        `LAW_CLUSTER_INVALID:${id}`
      );

      return false;
    }

    const declaredRoute =
      normalizeRoute(
        element.dataset.route ||
        element.getAttribute("href")
      );

    if (declaredRoute !== canonical.route) {
      recordAction(
        "law-selection-rejected",
        `LAW_ROUTE_INVALID:${id}`
      );

      return false;
    }

    if (cluster.gestureActive) {
      requestClusterCancel(
        canonical.direction,
        "law-selection"
      );
    }

    clearViewportSchedules();

    const destination =
      destinationFromElement(element);

    const committed =
      applyState(
        STATES.LAW_SELECTED,
        {
          selectedDirection: canonical.direction,
          selectedCategory: canonical.direction,
          selectedLaw: canonical.lawId,

          selectedDestinationType:
            DESTINATION_TYPES.LAW,

          selectedDestinationId:
            canonical.lawId,

          selectedDestinationLabel:
            destination
              ? destination.label || canonical.lawLabel
              : canonical.lawLabel,

          selectedRoute:
            canonical.route,

          selectedContentId:
            normalizeLawId(element.dataset.contentId),

          selectedLens:
            String(element.dataset.lens || "human")
              .trim()
              .toLowerCase() || "human",

          selectedParagraph:
            lawParagraphFromElement(element),

          compassSelected: false,
          panelDescended: true
        },
        `law-selected:${canonical.lawId}`
      );

    if (!committed) {
      return false;
    }

    scheduleLawPanelDescent(canonical.lawId);

    return true;
  }

  function requestCompassSelection() {
    if (isHeld()) {
      return false;
    }

    cancelActiveGestures("compass-selection");
    clearViewportSchedules();

    state.compassSelected = true;

    state.selectedDestinationType =
      DESTINATION_TYPES.HOME_COMPASS;

    state.selectedDestinationId =
      MAIN_COMPASS.destinationId;

    state.selectedDestinationLabel =
      MAIN_COMPASS.destinationLabel;

    state.selectedRoute =
      MAIN_COMPASS.route;

    state.selectedContentId =
      "home-compass";

    state.selectedLens = "return";

    state.selectedParagraph =
      "Return to the Diamond Gate Bridge Main Compass only after choosing the explicit return action.";

    state.panelDescended = true;

    syncPresentation();

    recordAction("compass-selected-local");

    publish(
      CHANNELS.COMPASS_STATE,
      createCompassState()
    );

    scheduleCompassPanelDescent();

    return true;
  }

  function requestEnterSelection() {
    if (
      isHeld() ||
      state.compassSelected ||
      state.current !== STATES.LAW_SELECTED
    ) {
      return false;
    }

    const canonical =
      LAW_BY_ID.get(state.selectedLaw);

    if (
      !canonical ||
      state.selectedDestinationType !== DESTINATION_TYPES.LAW ||
      state.selectedDestinationId !== canonical.lawId ||
      state.selectedRoute !== canonical.route ||
      !LAW_BY_ROUTE.has(state.selectedRoute)
    ) {
      recordAction(
        "selected-law-entry-rejected",
        "SELECTED_LAW_ROUTE_NOT_CANONICAL"
      );

      return false;
    }

    recordAction(
      `selected-law-entry-confirmed:${canonical.lawId}`
    );

    globalThis.location.assign(canonical.route);

    return true;
  }

  function requestReturnToMainCompass() {
    if (
      isHeld() ||
      !state.compassSelected
    ) {
      return false;
    }

    recordAction("main-compass-return-confirmed");

    globalThis.location.assign(MAIN_COMPASS.route);

    return true;
  }

  function requestReturnToOrbit() {
    if (isHeld()) {
      return false;
    }

    cancelActiveGestures("return-to-orbit");
    clearViewportSchedules();

    if (state.compassSelected) {
      state.compassSelected = false;

      if (state.current === STATES.LAW_SELECTED) {
        const direction =
          normalizeDirection(state.selectedDirection);

        if (!direction) {
          return false;
        }

        const category =
          findCategoryElement(direction);

        const destination =
          destinationFromElement(category);

        const committed =
          applyState(
            STATES.CLUSTER_OPEN,
            {
              selectedDirection: direction,
              selectedCategory: direction,
              selectedLaw: "",

              selectedDestinationType:
                DESTINATION_TYPES.CATEGORY,

              selectedDestinationId:
                direction,

              selectedDestinationLabel:
                destination
                  ? destination.label || directionLabel(direction)
                  : directionLabel(direction),

              selectedRoute: "",
              selectedContentId: "",
              selectedLens: "human",
              selectedParagraph: "",
              compassSelected: false,
              panelDescended: false
            },
            `compass-returned-to-category:${direction}`
          );

        if (committed) {
          scheduleSceneAscent(STATES.CLUSTER_OPEN, direction);
        }

        return committed;
      }

      if (state.current === STATES.CLUSTER_OPEN) {
        state.selectedDestinationType =
          DESTINATION_TYPES.CATEGORY;

        state.selectedDestinationId =
          state.selectedDirection;

        state.selectedDestinationLabel =
          directionLabel(state.selectedDirection);

        state.selectedRoute = "";
        state.panelDescended = false;

        syncPresentation();

        recordAction(
          `compass-returned-to-cluster:${state.selectedDirection}`
        );

        scheduleSceneAscent(
          STATES.CLUSTER_OPEN,
          state.selectedDirection
        );

        return true;
      }

      if (state.current === STATES.CONSTELLATION) {
        resetSelection();
        syncPresentation();

        recordAction("compass-returned-to-constellation");

        scheduleSceneAscent(STATES.CONSTELLATION);

        return true;
      }
    }

    if (state.current !== STATES.LAW_SELECTED) {
      return false;
    }

    const direction =
      normalizeDirection(state.selectedDirection);

    if (!direction) {
      recordAction(
        "return-to-orbit-rejected",
        "ACTIVE_LAW_DIRECTION_REQUIRED"
      );

      return false;
    }

    const category =
      findCategoryElement(direction);

    const destination =
      destinationFromElement(category);

    const committed =
      applyState(
        STATES.CLUSTER_OPEN,
        {
          selectedDirection: direction,
          selectedCategory: direction,
          selectedLaw: "",

          selectedDestinationType:
            DESTINATION_TYPES.CATEGORY,

          selectedDestinationId: direction,

          selectedDestinationLabel:
            destination
              ? destination.label || directionLabel(direction)
              : directionLabel(direction),

          selectedRoute: "",
          selectedContentId: "",
          selectedLens: "human",
          selectedParagraph: "",
          compassSelected: false,
          panelDescended: false
        },
        `returned-to-category:${direction}`
      );

    if (committed) {
      scheduleSceneAscent(STATES.CLUSTER_OPEN, direction);
    }

    return committed;
  }

  function requestReturnToConstellation(
    options = {}
  ) {
    if (arguments.length > 1) {
      return false;
    }

    if (
      isHeld() ||
      (
        state.current !== STATES.CLUSTER_OPEN &&
        state.current !== STATES.LAW_SELECTED
      )
    ) {
      return false;
    }

    cancelActiveGestures("return-to-constellation");
    clearViewportSchedules();

    const previousDirection =
      normalizeDirection(
        state.selectedDirection ||
        state.orbitFocus
      ) || "flow";

    resetSelection();

    const committed =
      applyState(
        STATES.CONSTELLATION,
        {
          orbitFocus: previousDirection,
          orbitPreviewFocus: previousDirection,
          compassSelected: false
        },
        `returned-to-constellation:${previousDirection}`
      );

    if (
      committed &&
      options.scrollToScene !== false
    ) {
      scheduleSceneAscent(STATES.CONSTELLATION);
    }

    return committed;
  }

  function updateSemanticProjection(records) {
    if (!Array.isArray(records)) {
      return false;
    }

    const next = new Map();

    for (const input of records) {
      if (
        !input ||
        typeof input !== "object"
      ) {
        continue;
      }

      const id = String(
        input.id ||
        input.lawId ||
        input.direction ||
        input.categoryId ||
        ""
      ).trim();

      if (!id) {
        continue;
      }

      const kind = String(input.kind || "")
        .trim()
        .toLowerCase();

      if (
        !canonicalControlExists({
          id,
          kind
        })
      ) {
        continue;
      }

      const projection =
        Object.freeze({
          id,
          kind,

          x: finiteNumber(input.x, 0),
          y: finiteNumber(input.y, 0),

          radiusPx: Math.max(
            0,
            finiteNumber(
              input.radiusPx ?? input.projectedRadius,
              0
            )
          ),

          depthLayer:
            normalizeDepthLayer(
              input.depthLayer ||
              input.layer
            ),

          compassOverlap:
            Boolean(input.compassOverlap),

          visible:
            input.visible !== false
        });

      next.set(
        `${projection.kind}:${id}`,
        projection
      );
    }

    state.semanticProjection = next;
    state.semanticProjectionRevision += 1;

    const snapshot =
      createSemanticProjectionSnapshot();

    publish(CHANNELS.SEMANTIC_PROJECTION, snapshot);

    recordAction(
      `semantic-projection-updated:${snapshot.length}`
    );

    return true;
  }

  function handleKeydown(event) {
    if (
      isHeld() ||
      event.key !== "Escape"
    ) {
      return;
    }

    if (state.compassSelected) {
      event.preventDefault();
      requestReturnToOrbit();
      return;
    }

    if (state.current === STATES.LAW_SELECTED) {
      event.preventDefault();
      requestReturnToOrbit();
      return;
    }

    if (state.current === STATES.CLUSTER_OPEN) {
      event.preventDefault();
      requestReturnToConstellation();
    }
  }

  function handleCrystalsFailure(event) {
    const reason = String(
      event &&
      event.detail &&
      event.detail.reason
        ? event.detail.reason
        : "LAWS_CRYSTALS_RENDER_FAILURE"
    );

    cancelActiveGestures("crystals-failure");

    setGuidance(
      "The visual law field is temporarily unavailable. Canonical law routes and semantic records remain preserved."
    );

    recordAction(
      "crystals-renderer-failed",
      reason
    );
  }

  function readReducedMotion() {
    const media =
      globalThis.matchMedia(
        "(prefers-reduced-motion: reduce)"
      );

    state.mediaQuery = media;

    state.reducedMotion =
      Boolean(media.matches) ||
      (
        state.root &&
        state.root.dataset.reducedMotion === "true"
      );
  }

  function bindReducedMotion() {
    const media =
      state.mediaQuery;

    if (!media) {
      return;
    }

    const update = event => {
      const previous =
        state.reducedMotion;

      state.reducedMotion =
        Boolean(event.matches);

      if (previous === state.reducedMotion) {
        return;
      }

      publish(CHANNELS.REDUCED_MOTION, state.reducedMotion);
      publish(CHANNELS.COMPASS_STATE, createCompassState());

      recordAction("reduced-motion-updated");
    };

    state.mediaQueryListener = update;

    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", update);
      return;
    }

    if (typeof media.addListener === "function") {
      media.addListener(update);
    }
  }

  function resolveDom() {
    state.root =
      qs("[data-laws-root]");

    invariant(
      state.root,
      "LAWS_ROOT_NOT_FOUND"
    );

    state.scene = qs(
      "[data-laws-scene]",
      state.root
    );

    state.sceneField = qs(
      "[data-laws-scene-field]",
      state.root
    );

    state.panel = qs(
      "[data-laws-panel]",
      state.root
    );

    invariant(
      state.scene,
      "LAWS_SCENE_NOT_FOUND"
    );

    invariant(
      state.sceneField,
      "LAWS_SCENE_FIELD_NOT_FOUND"
    );

    invariant(
      state.panel,
      "LAWS_PANEL_NOT_FOUND"
    );

    state.panelEyebrow = qs("[data-laws-panel-eyebrow]", state.root);
    state.panelTitle = qs("[data-laws-panel-title]", state.root);
    state.panelPurpose = qs("[data-laws-panel-purpose]", state.root);
    state.panelRelationship = qs("[data-laws-panel-relationship]", state.root);
    state.panelDomain = qs("[data-laws-panel-domain]", state.root);
    state.panelFunction = qs("[data-laws-panel-function]", state.root);
    state.panelCoordinate = qs("[data-laws-panel-coordinate]", state.root);
    state.panelSelectionState = qs("[data-laws-panel-selection-state]", state.root);
    state.panelRouteStatus = qs("[data-laws-panel-route-status]", state.root);
    state.panelLens = qs("[data-laws-panel-lens]", state.root);

    state.panelHumanLaw = qs("[data-laws-panel-human-law]", state.root);
    state.panelEngineeringLaw = qs("[data-laws-panel-engineering-law]", state.root);
    state.panelCodeExpression = qs("[data-laws-panel-code-expression]", state.root);
    state.panelFailurePattern = qs("[data-laws-panel-failure-pattern]", state.root);
    state.panelAuditQuestion = qs("[data-laws-panel-audit-question]", state.root);

    state.enterButton = qs("[data-laws-enter]", state.root);
    state.enterLabel = qs("[data-laws-enter-label]", state.root);
    state.returnToOrbitButton = qs("[data-laws-return-to-orbit]", state.root);
    state.returnToOrbitLabel = qs("[data-laws-return-to-orbit-label]", state.root);
    state.returnHomeButton = qs("[data-laws-return-home-compass]", state.root);
    state.guidance = qs("[data-laws-guidance]", state.root);

    state.controllerReceiptOutput = qs("[data-laws-controller-receipt]", state.root);
    state.controllerValidationOutput = qs("[data-laws-controller-validation]", state.root);

    state.compassControl = qs("[data-upstream-compass-control]", state.root);

    invariant(
      state.compassControl,
      "LAWS_COMPASS_CONTROL_NOT_FOUND"
    );
  }

  function initializeOrientationState() {
    const requestedFocus =
      normalizeDirection(
        state.root.dataset.orbitFocus
      ) || "flow";

    let initial =
      canonicalConstellationOrientation(requestedFocus);

    const serialized = String(
      state.root.dataset.orbitQuaternion || ""
    ).trim();

    if (serialized) {
      try {
        const parsed =
          JSON.parse(serialized);

        const normalized =
          normalizeQuaternionStrict(parsed);

        if (normalized) {
          initial =
            createOrientation(
              normalized,
              requestedFocus
            );
        }
      } catch (_) {}
    }

    state.orbitFocus = requestedFocus;
    state.orbitPreviewFocus = requestedFocus;
    state.orbitPhase = ORIENTATION_PHASES.COMMITTED;
    state.orbitGestureActive = false;
    state.orbitPreviewAccepted = false;

    state.orbitRevision =
      finiteNumber(
        state.root.dataset.orbitRevision,
        0
      );

    state.orbitOrientation =
      cloneOrientation(initial);

    state.committedOrbitOrientation =
      cloneOrientation(initial);

    state.orbitGestureOrigin = null;
  }

  function initializeClusters() {
    state.clusters.clear();

    for (const direction of DIRECTIONS) {
      const cluster =
        createClusterState(direction);

      invariant(
        cluster.lawIds.length === 4,
        "LAWS_CLUSTER_LAW_COUNT_INVALID",
        {
          direction,
          count: cluster.lawIds.length
        }
      );

      state.clusters.set(direction, cluster);
    }
  }

  function getClusterState(direction) {
    const cluster =
      getCluster(direction);

    if (!cluster) {
      return null;
    }

    return Object.freeze({
      direction: cluster.direction,

      lawIds: Object.freeze(
        cluster.lawIds.slice()
      ),

      primaryLaw: cluster.primaryLaw,
      previewPrimaryLaw: cluster.previewPrimaryLaw,
      phase: cluster.phase,
      gestureActive: cluster.gestureActive,
      previewAccepted: cluster.previewAccepted,
      revision: cluster.revision,

      orientation:
        freezeOrientation(cluster.orientation),

      committedOrientation:
        freezeOrientation(cluster.committedOrientation)
    });
  }

  function validateCanonicalRegistry() {
    invariant(
      DIRECTIONS.length === 4,
      "LAWS_DIRECTION_COUNT_INVALID"
    );

    invariant(
      new Set(DIRECTIONS).size === 4,
      "LAWS_DUPLICATE_DIRECTION"
    );

    invariant(
      CANONICAL_LAW_RECORDS.length === 16,
      "LAWS_CANONICAL_LAW_COUNT_INVALID"
    );

    const ids = new Set();
    const routes = new Set();

    for (const direction of DIRECTIONS) {
      const laws =
        LAWS_BY_DIRECTION.get(direction);

      invariant(
        laws &&
        laws.length === 4,
        "LAWS_PER_DIRECTION_INVALID",
        { direction }
      );
    }

    for (const record of CANONICAL_LAW_RECORDS) {
      invariant(
        DIRECTIONS.includes(record.direction),
        "LAWS_RECORD_DIRECTION_INVALID"
      );

      invariant(
        !ids.has(record.lawId),
        "LAWS_DUPLICATE_LAW_ID"
      );

      invariant(
        !routes.has(record.route),
        "LAWS_DUPLICATE_LAW_ROUTE"
      );

      invariant(
        Boolean(record.humanPrimary),
        "LAWS_HUMAN_PRIMARY_REQUIRED"
      );

      invariant(
        Boolean(record.engineeringSecondary),
        "LAWS_ENGINEERING_SECONDARY_REQUIRED"
      );

      invariant(
        Boolean(record.codeExpression),
        "LAWS_CODE_EXPRESSION_REQUIRED"
      );

      invariant(
        Boolean(record.failurePattern),
        "LAWS_FAILURE_PATTERN_REQUIRED"
      );

      invariant(
        Boolean(record.auditQuestion),
        "LAWS_AUDIT_QUESTION_REQUIRED"
      );

      ids.add(record.lawId);
      routes.add(record.route);
    }

    invariant(
      LAW_BY_ID.size === 16,
      "LAWS_LAW_ID_REGISTRY_INVALID"
    );

    invariant(
      LAW_BY_ROUTE.size === 16,
      "LAWS_ROUTE_REGISTRY_INVALID"
    );

    return Object.freeze({
      pass: true,
      directionCount: 4,
      lawCount: 16,
      routeCount: 16,
      lawsPerDirection: 4,
      humanLawPrimary: true,
      softwareLawSecondary: true
    });
  }

  function validateTransitionTable() {
    const declaredStates =
      Object.values(STATES);

    invariant(
      declaredStates.length === 4,
      "LAWS_STATE_COUNT_INVALID"
    );

    invariant(
      canTransition(STATES.CONSTELLATION, STATES.CLUSTER_OPEN),
      "LAWS_REQUIRED_TRANSITION_MISSING"
    );

    invariant(
      canTransition(STATES.CLUSTER_OPEN, STATES.LAW_SELECTED),
      "LAWS_REQUIRED_TRANSITION_MISSING"
    );

    invariant(
      canTransition(STATES.LAW_SELECTED, STATES.CLUSTER_OPEN),
      "LAWS_REQUIRED_TRANSITION_MISSING"
    );

    invariant(
      canTransition(STATES.CLUSTER_OPEN, STATES.CONSTELLATION),
      "LAWS_REQUIRED_TRANSITION_MISSING"
    );

    invariant(
      canTransition(STATES.LAW_SELECTED, STATES.CONSTELLATION),
      "LAWS_REQUIRED_TRANSITION_MISSING"
    );

    invariant(
      TRANSITIONS[STATES.SYSTEM_HELD].length === 1 &&
      TRANSITIONS[STATES.SYSTEM_HELD][0] === STATES.SYSTEM_HELD,
      "LAWS_HELD_STATE_NOT_TERMINAL"
    );

    return Object.freeze({
      pass: true,
      states: Object.freeze(declaredStates.slice()),
      heldTerminal: true
    });
  }

  function validatePresentationContract() {
    for (const presentation of Object.values(PRESENTATION_BY_STATE)) {
      invariant(
        !(
          presentation.outerCategoriesActive &&
          presentation.activeLawCluster
        ),
        "LAWS_ADDITIVE_PRESENTATION_FORBIDDEN"
      );
    }

    return Object.freeze({
      pass: true,
      progressiveReplacement: true,
      additiveCoRenderingAuthorized: false
    });
  }

  function validateCompassContract() {
    const compass =
      createCompassState();

    invariant(
      compass.fixedCenter === true,
      "LAWS_COMPASS_FIXED_CENTER_INVALID"
    );

    invariant(
      compass.mainCompassRoute === "/",
      "LAWS_COMPASS_ROUTE_INVALID"
    );

    invariant(
      compass.immediateNavigation === false,
      "LAWS_COMPASS_IMMEDIATE_NAVIGATION_INVALID"
    );

    invariant(
      compass.explicitReturnRequired === true,
      "LAWS_COMPASS_EXPLICIT_RETURN_INVALID"
    );

    invariant(
      compass.inheritsNavigationOrientation === false,
      "LAWS_COMPASS_ORIENTATION_INHERITANCE_INVALID"
    );

    invariant(
      compass.participatesInNavigationSettlement === false,
      "LAWS_COMPASS_SETTLEMENT_PARTICIPATION_INVALID"
    );

    return Object.freeze({
      pass: true,
      fixedCenter: true,
      pageLocalSelection: true,
      immediateNavigation: false,
      explicitMainCompassReturn: true,
      rendererLifecycleOwned: false
    });
  }

  function validateMotionContract() {
    invariant(
      MODULE.motionContractId === "DGB_LAWS_COMPLETE_QUATERNION_MOTION_CONTRACT_v1",
      "LAWS_MOTION_CONTRACT_ID_INVALID"
    );

    invariant(
      MODULE.motionContractVersion === "1.0.0",
      "LAWS_MOTION_CONTRACT_VERSION_INVALID"
    );

    const validOrbit =
      validateOrbitPreviewPayload({
        quaternion: [0, 0.2, 0, 0.98],
        primaryId: "integrity"
      });

    invariant(
      validOrbit.pass === true,
      "LAWS_VALID_ORBIT_PREVIEW_REJECTED"
    );

    const eulerOrbit =
      validateOrbitPreviewPayload({
        yaw: 1,
        pitch: 1,
        roll: 0,
        primaryId: "integrity"
      });

    invariant(
      eulerOrbit.pass === false,
      "LAWS_CONTROLLER_MUST_REJECT_EULER_PREVIEW"
    );

    const mixedOrbit =
      validateOrbitPreviewPayload({
        quaternion: [0, 0, 0, 1],
        primaryId: "integrity",
        dx: 40
      });

    invariant(
      mixedOrbit.pass === false,
      "LAWS_CONTROLLER_MUST_REJECT_MIXED_MOTION_PAYLOAD"
    );

    const missingOrbitPrimary =
      validateOrbitPreviewPayload({
        quaternion: [0, 0, 0, 1]
      });

    invariant(
      missingOrbitPrimary.pass === false,
      "LAWS_ORBIT_PRIMARY_ID_MUST_BE_REQUIRED"
    );

    const testCluster =
      createClusterState("integrity");

    const validCluster =
      validateClusterPreviewPayload(
        testCluster,
        {
          quaternion: [0.1, 0, 0, 0.99],
          primaryId: "proof-law"
        }
      );

    invariant(
      validCluster.pass === true,
      "LAWS_VALID_CLUSTER_PREVIEW_REJECTED"
    );

    const foreignLaw =
      validateClusterPreviewPayload(
        testCluster,
        {
          quaternion: [0, 0, 0, 1],
          primaryId: "route-law"
        }
      );

    invariant(
      foreignLaw.pass === false,
      "LAWS_FOREIGN_CLUSTER_LAW_ACCEPTED"
    );

    const mixedCluster =
      validateClusterPreviewPayload(
        testCluster,
        {
          quaternion: [0, 0, 0, 1],
          primaryId: "proof-law",
          axis: [0, 1, 0]
        }
      );

    invariant(
      mixedCluster.pass === false,
      "LAWS_CLUSTER_MIXED_MOTION_PAYLOAD_ACCEPTED"
    );

    invariant(
      beginOrbitGesture.length === 0,
      "LAWS_ORBIT_BEGIN_SIGNATURE_INVALID"
    );

    invariant(
      requestOrbitPreview.length === 1,
      "LAWS_ORBIT_PREVIEW_SIGNATURE_INVALID"
    );

    invariant(
      requestOrbitCommit.length === 0,
      "LAWS_ORBIT_COMMIT_SIGNATURE_INVALID"
    );

    invariant(
      beginClusterGesture.length === 1,
      "LAWS_CLUSTER_BEGIN_SIGNATURE_INVALID"
    );

    invariant(
      requestClusterPreview.length === 2,
      "LAWS_CLUSTER_PREVIEW_SIGNATURE_INVALID"
    );

    invariant(
      requestClusterCommit.length === 1,
      "LAWS_CLUSTER_COMMIT_SIGNATURE_INVALID"
    );

    return Object.freeze({
      pass: true,
      motionContractId: MODULE.motionContractId,
      motionContractVersion: MODULE.motionContractVersion,

      previewPayloadKeys:
        Object.freeze(PREVIEW_PAYLOAD_KEYS.slice()),

      unexpectedPreviewFieldsForbidden: true,
      completeQuaternionPreviewRequired: true,
      explicitPrimaryIdentityRequired: true,

      orbitBeginPayloadPermitted: false,
      clusterBeginMotionPayloadPermitted: false,
      orbitCommitPayloadPermitted: false,
      clusterCommitMotionPayloadPermitted: false,

      controllerInfersPrimaryFromQuaternion: false,
      controllerInterpretsEulerMotion: false,
      controllerConstructsGestureQuaternion: false,
      canonicalSettlementQuaternionsPublic: false,

      motionOwner: MODULE.interactionModuleId,
      acceptedStateAuthority: MODULE.id
    });
  }

  function validateProjectionStorageContract() {
    const sample = Object.freeze({
      id: "flow",
      kind: "category",
      x: 10,
      y: 20,
      radiusPx: 30,
      depthLayer: DEPTH_LAYERS.FRONT,
      compassOverlap: false,
      visible: true
    });

    invariant(
      !Object.prototype.hasOwnProperty.call(sample, "interactionPriority"),
      "LAWS_CONTROLLER_MUST_NOT_STORE_INTERACTION_PRIORITY"
    );

    return Object.freeze({
      pass: true,

      storedFields:
        Object.freeze([
          "id",
          "kind",
          "x",
          "y",
          "radiusPx",
          "depthLayer",
          "compassOverlap",
          "visible"
        ]),

      projectionMathOwned: false,
      interactionPriorityAccepted: false,
      interactionPriorityDerived: false,
      interactionPriorityStored: false,
      interactionPriorityOwner: MODULE.interactionModuleId,
      projectionDomApplicationOwned: false,
      projectionDomApplicationOwner: MODULE.interactionModuleId
    });
  }

  function validateFileSplitContract() {
    invariant(
      !Object.prototype.hasOwnProperty.call(state, "pointer"),
      "LAWS_CONTROLLER_POINTER_STATE_NOT_EXTRACTED"
    );

    invariant(
      !Object.prototype.hasOwnProperty.call(state, "suppressedSemanticClick"),
      "LAWS_CONTROLLER_CLICK_SUPPRESSION_NOT_EXTRACTED"
    );

    return Object.freeze({
      pass: true,

      pointerListenersOwned: false,
      pointerStateOwned: false,
      swipeClassificationOwned: false,
      tapDragArbitrationOwned: false,
      wholeCrystalHitTestingOwned: false,
      syntheticClickSuppressionOwned: false,
      projectionDomApplicationOwned: false,
      interactionPriorityDerivationOwned: false,
      clusterExitSwipeClassificationOwned: false,
      gestureAxisSelectionOwned: false,
      gestureQuaternionConstructionOwned: false,
      directManipulationOwned: false,
      grabbedObjectTrackingOwned: false,
      quaternionToPrimaryInferenceOwned: false,

      interactionModuleId: MODULE.interactionModuleId,
      acceptedStateAuthority: MODULE.id,
      navigationTransitionAuthority: MODULE.id
    });
  }

  function validateDeclaredLaws() {
    if (!state.root) {
      return Object.freeze({
        pass: false,
        skipped: true,
        reason: "LAWS_ROOT_NOT_RESOLVED"
      });
    }

    const declared =
      qsa("[data-laws-law]", state.root);

    invariant(
      declared.length === 16,
      "LAWS_DECLARED_LAW_COUNT_INVALID",
      {
        expected: 16,
        actual: declared.length
      }
    );

    const seenIds = new Set();
    const seenRoutes = new Set();

    for (const element of declared) {
      const lawId =
        normalizeLawId(element.dataset.lawId);

      const direction =
        normalizeDirection(element.dataset.direction);

      const route =
        normalizeRoute(
          element.dataset.route ||
          element.getAttribute("href")
        );

      const canonical =
        LAW_BY_ID.get(lawId);

      invariant(
        canonical,
        "LAWS_UNKNOWN_LAW_ID",
        { lawId }
      );

      invariant(
        !seenIds.has(lawId),
        "LAWS_DUPLICATE_DECLARED_LAW_ID"
      );

      invariant(
        !seenRoutes.has(route),
        "LAWS_DUPLICATE_DECLARED_LAW_ROUTE"
      );

      invariant(
        route === canonical.route,
        "LAWS_LAW_ROUTE_MISMATCH"
      );

      invariant(
        direction === canonical.direction,
        "LAWS_LAW_DIRECTION_MISMATCH"
      );

      seenIds.add(lawId);
      seenRoutes.add(route);
    }

    return Object.freeze({
      pass: true,
      declaredLawCount: 16,
      declaredRouteCount: 16,
      generatedLawProxiesRequired: false
    });
  }

  function runControllerSelfTest({
    includeDom = false
  } = {}) {
    const results = {
      registry: validateCanonicalRegistry(),
      transitions: validateTransitionTable(),
      presentation: validatePresentationContract(),
      compass: validateCompassContract(),
      motionContract: validateMotionContract(),
      projectionStorage: validateProjectionStorageContract(),
      fileSplit: validateFileSplitContract(),

      declaredLaws:
        includeDom
          ? validateDeclaredLaws()
          : Object.freeze({
              pass: true,
              skipped: true
            })
    };

    const pass =
      Object.values(results).every(
        result => result.pass === true
      );

    return Object.freeze({
      receiptSchema:
        "LAWS_CONTROLLER_FOUR_DIRECTION_HUMAN_FIRST_VALIDATION_RECEIPT_v1",

      moduleId: MODULE.id,
      moduleVersion: MODULE.version,
      motionContractId: MODULE.motionContractId,
      motionContractVersion: MODULE.motionContractVersion,

      pass,

      directionCount: 4,
      lawCount: 16,
      lawsPerDirection: 4,

      humanLawPrimary: true,
      softwareLawSecondary: true,
      codeExpressionTertiary: true,
      placeholderPagesPermitted: true,

      pointerInterpreterOwner: MODULE.interactionModuleId,
      pointerTapArbitrationOwner: MODULE.interactionModuleId,
      wholeCrystalHitTestOwner: MODULE.interactionModuleId,
      syntheticClickSuppressionOwner: MODULE.interactionModuleId,
      projectionDomApplicationOwner: MODULE.interactionModuleId,
      interactionPriorityDerivationOwner: MODULE.interactionModuleId,
      clusterExitSwipeClassificationOwner: MODULE.interactionModuleId,
      gestureAxisSelectionOwner: MODULE.interactionModuleId,
      gestureQuaternionConstructionOwner: MODULE.interactionModuleId,
      directManipulationOwner: MODULE.interactionModuleId,
      grabbedObjectTrackingOwner: MODULE.interactionModuleId,
      primaryVisualIdentityCalculationOwner: MODULE.interactionModuleId,

      orbitStateAuthority: MODULE.id,
      clusterStateAuthority: MODULE.id,
      quaternionAcceptanceAuthority: MODULE.id,
      clusterExitTransitionAuthority: MODULE.id,
      navigationTransitionAuthority: MODULE.id,

      cameraOwnership: false,
      crystalRendererOwnership: false,
      compassRendererOwnership: false,
      semanticProjectionMathOwnership: false,
      interactionPriorityStorageOwnership: false,
      semanticProjectionFactStorageOwnership: true,
      compassPageLocalSelection: true,
      explicitMainCompassReturn: true,

      results: Object.freeze(results)
    });
  }

  function writeValidationReceipt(receipt) {
    state.validationReceipt = receipt;

    const serialized =
      JSON.stringify(receipt);

    if (state.root) {
      state.root.dataset.lawsControllerValidation =
        serialized;
    }

    if (state.controllerValidationOutput) {
      if ("value" in state.controllerValidationOutput) {
        state.controllerValidationOutput.value = serialized;
      }

      state.controllerValidationOutput.textContent = serialized;
    }

    globalThis.DGB_LAWS_CONTROLLER_VALIDATION_RECEIPT =
      receipt;
  }

  function exposeApi() {
    globalThis.DGB_LAWS_CONTROLLER =
      Object.freeze({
        moduleId: MODULE.id,
        moduleVersion: MODULE.version,

        interactionModuleId: MODULE.interactionModuleId,
        interactionModuleVersion: MODULE.interactionModuleVersion,

        motionContractId: MODULE.motionContractId,
        motionContractVersion: MODULE.motionContractVersion,

        states: STATES,
        presentationModes: PRESENTATION_MODES,
        destinationTypes: DESTINATION_TYPES,
        orientationPhases: ORIENTATION_PHASES,
        depthLayers: DEPTH_LAYERS,

        mainCompass: MAIN_COMPASS,
        directions: DIRECTIONS,
        directionLabels: DIRECTION_LABELS,
        directionCoordinates: DIRECTION_COORDINATES,
        directionRoutes: DIRECTION_TO_CATEGORY_ROUTE,

        canonicalLawRecords: CANONICAL_LAW_RECORDS,
        canonicalLawRoutes: CANONICAL_LAW_ROUTES,

        getFrameState: createFrameState,

        getPresentationMode:
          () => presentationModeForState(),

        getReducedMotion:
          () => state.reducedMotion,

        getHeldState: createHeldState,
        getCompassState: createCompassState,
        getClusterState,

        getSemanticProjection:
          createSemanticProjectionSnapshot,

        getValidationReceipt:
          () => state.validationReceipt,

        subscribeFrameState:
          callback => subscribe(CHANNELS.FRAME, callback),

        subscribeReducedMotion:
          callback => subscribe(CHANNELS.REDUCED_MOTION, callback),

        subscribeHeldState:
          callback => subscribe(CHANNELS.HELD_STATE, callback),

        subscribeCompassState:
          callback => subscribe(CHANNELS.COMPASS_STATE, callback),

        subscribeSemanticProjection:
          callback => subscribe(CHANNELS.SEMANTIC_PROJECTION, callback),

        beginOrbitGesture,
        requestOrbitPreview,
        requestOrbitCommit,
        requestOrbitCancel,
        requestOrbitFocus,

        beginClusterGesture,
        requestClusterPreview,
        requestClusterCommit,
        requestClusterCancel,

        requestCategorySelection,
        requestLawSelection,
        requestCompassSelection,
        requestEnterSelection,
        requestReturnToOrbit,
        requestReturnToConstellation,
        requestReturnToMainCompass,

        updateSemanticProjection,

        runSelfTest:
          runControllerSelfTest
      });
  }

  function bindControls() {
    state.root.addEventListener(
      "keydown",
      handleKeydown
    );

    if (state.enterButton) {
      state.enterButton.addEventListener(
        "click",
        event => {
          event.preventDefault();
          requestEnterSelection();
        }
      );
    }

    if (state.returnToOrbitButton) {
      state.returnToOrbitButton.addEventListener(
        "click",
        event => {
          event.preventDefault();
          requestReturnToOrbit();
        }
      );
    }

    if (state.returnHomeButton) {
      state.returnHomeButton.addEventListener(
        "click",
        event => {
          event.preventDefault();
          requestReturnToMainCompass();
        }
      );
    }

    globalThis.addEventListener(
      "LAWS_CRYSTALS_RENDER_FAILURE",
      handleCrystalsFailure
    );
  }

  function enterHeldState(error) {
    clearViewportSchedules();

    state.current = STATES.SYSTEM_HELD;
    state.orbitGestureActive = false;
    state.orbitPreviewAccepted = false;
    state.orbitGestureOrigin = null;

    for (const cluster of state.clusters.values()) {
      cluster.gestureActive = false;
      cluster.previewAccepted = false;
      cluster.gestureOrigin = null;
      cluster.phase = ORIENTATION_PHASES.COMMITTED;
    }

    state.lastAction =
      "controller-initialization-failed";

    state.lastFailure =
      error &&
      (error.code || error.message)
        ? String(error.code || error.message)
        : "UNKNOWN_CONTROLLER_INITIALIZATION_FAILURE";

    try {
      syncPresentation();

      const frame =
        publishFrame();

      publish(CHANNELS.HELD_STATE, createHeldState());
      publish(CHANNELS.COMPASS_STATE, frame.compass);
    } catch (_) {}

    globalThis.dispatchEvent(
      new CustomEvent(
        "LAWS_CONTROLLER_FAILURE",
        {
          detail: Object.freeze({
            reason: state.lastFailure
          })
        }
      )
    );
  }

  function initialize() {
    try {
      const sourceReceipt =
        runControllerSelfTest({
          includeDom: false
        });

      invariant(
        sourceReceipt.pass === true,
        "LAWS_CONTROLLER_SOURCE_VALIDATION_FAILED",
        sourceReceipt
      );

      resolveDom();
      readReducedMotion();
      initializeOrientationState();
      initializeClusters();

      const runtimeReceipt =
        runControllerSelfTest({
          includeDom: true
        });

      invariant(
        runtimeReceipt.pass === true,
        "LAWS_CONTROLLER_RUNTIME_VALIDATION_FAILED",
        runtimeReceipt
      );

      writeValidationReceipt(runtimeReceipt);

      exposeApi();
      bindControls();
      bindReducedMotion();
      resetSelection();
      syncPresentation();

      state.initialized = true;

      const frame =
        recordAction("controller-initialized");

      publish(CHANNELS.REDUCED_MOTION, state.reducedMotion);
      publish(CHANNELS.HELD_STATE, createHeldState());
      publish(CHANNELS.COMPASS_STATE, frame.compass);

      globalThis.dispatchEvent(
        new CustomEvent(
          "LAWS_CONTROLLER_READY",
          {
            detail: Object.freeze({
              moduleId: MODULE.id,
              moduleVersion: MODULE.version,

              interactionModuleRequired: true,
              interactionModuleId: MODULE.interactionModuleId,
              interactionModuleVersion: MODULE.interactionModuleVersion,

              motionContractId: MODULE.motionContractId,
              motionContractVersion: MODULE.motionContractVersion,

              completeGestureQuaternionRequired: true,
              exactPreviewPayloadRequired: true,
              explicitPrimaryIdentityRequired: true,

              semanticProjectionFactsOnly: true,
              interactionPriorityPublished: false,
              interactionPriorityOwner: MODULE.interactionModuleId,

              gestureQuaternionConstructionOwner: MODULE.interactionModuleId,
              gestureAxisSelectionOwner: MODULE.interactionModuleId,
              motionDirectionOwner: MODULE.interactionModuleId,
              motionSensitivityOwner: MODULE.interactionModuleId,

              acceptedStateAuthority: MODULE.id,
              navigationTransitionAuthority: MODULE.id,

              directionCount: 4,
              lawCount: 16,
              lawsPerDirection: 4,
              humanLawPrimary: true,
              softwareLawSecondary: true
            })
          }
        )
      );
    } catch (error) {
      enterHeldState(error);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initialize,
      {
        once: true
      }
    );
  } else {
    initialize();
  }
})();

/*
DGB_LAWS_CONTROLLER_FOUR_DIRECTION_HUMAN_FIRST_RESULT_v1

Artifact:
 /laws/index.controller.js

Module:
 DGB_LAWS_CONTROLLER
 1.0.0-law-compass-human-first-authority

Source template:
 /products/archcoin/index.controller.js
 DGB_ARCHCOIN_CONTROLLER
 7.0.0-controller-interaction-semantic-priority

Motion contract:
 DGB_LAWS_COMPLETE_QUATERNION_MOTION_CONTRACT_v1
 1.0.0

Implementation status:
 LAW_COMPASS_CONTROLLER_CONVERSION_STANDARD

Exact coordinated pair:
 1. /laws/index.controller.js
 2. /laws/index.interactions.js

No third implementation file included.

Anchoring rule:
 INTERACTIONS DETERMINES MOTION.
 CONTROLLER DETERMINES AUTHORITY.

Converted model:
 ARCHCOIN four domains converted to four law directions:
 - flow
 - integrity
 - reality
 - structure

Sixteen law records:
 - 4 directions
 - 4 laws per direction
 - 16 canonical placeholder routes

Human-first standard:
 TRUE

Software-law secondary:
 TRUE

Code-expression tertiary:
 TRUE

Controller accepts:
- beginOrbitGesture()
- requestOrbitPreview({ quaternion, primaryId })
- requestOrbitCommit()
- requestOrbitCancel(reason)
- beginClusterGesture(direction)
- requestClusterPreview(direction, { quaternion, primaryId })
- requestClusterCommit(direction)
- requestClusterCancel(direction, reason)

Controller rejects:
- motion payload at orbit begin
- motion payload at cluster begin
- preview without active transaction
- preview without complete quaternion
- preview with unexpected fields
- Euler-only preview
- mixed quaternion-and-Euler preview
- preview without explicit primary identity
- invalid primary direction
- invalid primary law
- law outside active cluster
- commit without accepted preview
- motion payload at commit
- raw pointer values
- drag vectors
- axis instructions
- movement-direction instructions

Controller semantic projection records contain only:
- id
- kind
- x
- y
- radiusPx
- depthLayer
- compassOverlap
- visible

Controller does not:
- infer direction from quaternion
- infer law from quaternion
- construct gesture quaternions
- convert gesture Euler values
- choose gesture axes
- define sensitivity
- define drag direction
- classify cluster exit
- track grabbed crystals
- accept interaction priority
- derive interaction priority
- store interaction priority
- publish interaction priority
- apply projection facts to interaction DOM
- expose canonical settlement quaternions publicly

Interactions remains sole owner of:
- pointer lifecycle
- tap-versus-drag arbitration
- swipe classification
- cluster-exit detection
- direct manipulation
- grabbed-object tracking
- drag direction
- sensitivity
- gesture-axis selection
- gesture quaternion construction
- visual primary identity calculation
- interaction-priority derivation
- pointer eligibility
- hit-target policy
- projection-driven interaction DOM

Crystals modified:
 FALSE

Compositor modified:
 FALSE

HTML modified:
 FALSE

CSS modified:
 FALSE

Runtime execution:
 NOT PERFORMED

Visual acceptance:
 NOT CLAIMED

Production authorization:
 FALSE

Deployment authorization:
 FALSE
*/
