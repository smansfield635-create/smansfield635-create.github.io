// /assets/hearth/jeeves/jeeves.expression.js
// HEARTH_JEEVES_EXPRESSION_NARRATIVE_FORK_BRIDGE_TRAVERSAL_TNT_v4
// Full-file replacement.
// Browser-side expression layer only.
// Narrative Fork Bridge / Threshold Steward.
// Owns entrance direction, intermittent fork language, transition phrasing,
// archetypal engagement option shaping, route-label refinement, and public-language softening.
// Does not own API/North depth, secure model bridge, route execution, DOM timing,
// final navigation, moderation, or permanent deep canon storage.
//
// Core law:
// Expression opens and bridges.
// JS carries and renders.
// API/North deepens and culminates.
// Expression returns when the next fork appears.

(function () {
  "use strict";

  var CONTRACT = "HEARTH_JEEVES_EXPRESSION_NARRATIVE_FORK_BRIDGE_TRAVERSAL_TNT_v4";
  var PREVIOUS_CONTRACT = "HEARTH_JEEVES_EXPRESSION_TRAINING_WHEELS_FORK_MANAGER_TNT_v3";

  var OPTION_KIND = {
    ARCHETYPE: "archetype_answer",
    CONVERSATION: "conversation",
    FORWARD: "forward",
    RETURN: "return",
    PARALLEL: "parallel",
    CONTROL: "control",
    ROUTE: "route"
  };

  var BRIDGE_MOMENT = {
    ENTRANCE: "entrance_fork",
    BEFORE_KNOWLEDGE: "before_knowledge",
    AFTER_KNOWLEDGE: "after_knowledge",
    RECENTER: "recenter_fork",
    RETURN: "return_fork",
    PARALLEL: "parallel_crossing",
    PREPARED_DOOR: "prepared_door"
  };

  var ROOM_NAMES = {
    hearthPath: "Hearth Mission Control",
    hearthFacilityPath: "Hearth Mission Control",
    hearthConstructPath: "the window within the window",
    hearthFrontierPath: "Hearth and Frontier Yard",
    hearthLawPath: "Hearth and the Law Library",
    mirrorlandPath: "Mirrorland",
    atriumPath: "the Atrium",
    atlasPath: "Atlas Study",
    charactersPath: "Characters Hall",
    characterIdentityPath: "the Character role map",
    characterRelationshipsPath: "the Character relationship layer",
    characterTensionsPath: "the Character conflict layer",
    characterMotivesPath: "the Character motive layer",
    characterStoryPressurePath: "the Character story pressure",
    characterFirstPath: "the first Character path",
    characterAurenValePath: "Auren Vale",
    characterDextrionPath: "Dextrion",
    characterAlaricPath: "Alaric",
    characterTarianPath: "Tarian",
    characterElaraPath: "Elara",
    characterSorenPath: "Soren",
    characterJeevesPath: "Jeeves",
    characterRemoteTeamPath: "the Remote Team",
    characterArchetypeMirrorPath: "the Character Archetype Mirror",
    lawsPath: "the Law Library",
    scientificLawPath: "Scientific Law",
    scientificLawTheoryPath: "Theory",
    scientificLawEvidencePath: "Evidence",
    scientificLawMeasurePath: "Measure",
    scientificLawLimitsPath: "Limits",
    gaugesPath: "Triple G",
    frontierPath: "Frontier Yard",
    frontierSystemsPath: "the Frontier systems yard",
    frontierEnergyPath: "Energy",
    frontierWaterPath: "Water",
    frontierWastePath: "Waste",
    frontierClosedLoopPath: "Closed Loop",
    frontierInfrastructurePath: "Infrastructure",
    frontierLatticePath: "Lattice",
    frontierUrbanPath: "Urban",
    frontierManualPath: "Manual",
    frontierShimmerPath: "Shimmer",
    frontierTrajectoryPath: "Trajectory",
    frontierVisionPath: "Vision",
    seanPath: "Sean Mansfield",
    underdogPath: "This Underdog",
    nineSummitsPath: "Nine Summits",
    nineSummitsBookPath: "The Nine Summits of Love",
    diagnosticPath: "the Diagnostic",
    selfLearningPath: "the pressure mirror",
    ziontsPath: "ZIONTS",
    hEarthPath: "H-Earth",
    audraliaPath: "Audralia",
    audraliaWorldroomPath: "Audralia’s worldroom",
    websitePath: "the estate structure",
    productsPath: "Products",
    compassPath: "the Compass",
    siteGuidePath: "the Guide Desk",
    intro: "Hearth Mission Control",
    whereToStart: "the First Fork",
    recenterNode: "Hearth Mission Control",
    returnFork: "the First Fork"
  };

  var ROOM_GEOGRAPHY = {
    hearth: {
      name: "Hearth Mission Control",
      phrase: "Hearth Mission Control is the window within the window. It steadies the view before the next room opens."
    },
    mirrorland: {
      name: "Mirrorland",
      phrase: "South, Mirrorland opens as the larger world-window. It is where future pressure becomes visible."
    },
    frontier: {
      name: "Frontier Yard",
      phrase: "East of Hearth, Frontier Yard is still being built. It is where future systems are tested before the house trusts them."
    },
    proof: {
      name: "Law Library",
      phrase: "West, the Law Library is lit. That is where claims stop performing and start answering."
    },
    scientificLaw: {
      name: "Scientific Law",
      phrase: "Scientific Law is the test chamber behind the claim. It asks what can be defined, checked, corrected, and limited."
    },
    gauges: {
      name: "Triple G",
      phrase: "Triple G reads what is ready, what is measurable, and what still has a gap."
    },
    characters: {
      name: "Characters Hall",
      phrase: "The Characters Hall is where world pressure becomes personal. Roles arrive before names."
    },
    sean: {
      name: "Sean Mansfield",
      phrase: "Sean’s road is the human beginning behind the estate."
    },
    underdog: {
      name: "This Underdog",
      phrase: "This Underdog is the voice that formed through pressure before pressure had language."
    },
    summits: {
      name: "Nine Summits",
      phrase: "Nine Summits is the climb road. It turns growth into sequence instead of slogan."
    },
    diagnostic: {
      name: "Diagnostic",
      phrase: "The Diagnostic asks how pressure actually behaves once it is no longer just claimed."
    }
  };

  var ADJACENT_DOORS = {
    seanPath: {
      target: "underdogPath",
      label: "Cross into This Underdog.",
      bridge: "Before Sean’s road continues, another door opens beside it. The person behind the estate is one part of the story. The voice that learned to stand back up is the other."
    },
    underdogPath: {
      target: "seanPath",
      label: "Cross back to Sean.",
      bridge: "This Underdog does not float outside the estate. It leads back to the person whose life was shaped by transitions, reversals, recoveries, and turns of every size."
    },
    nineSummitsPath: {
      target: "underdogPath",
      label: "Cross into This Underdog.",
      bridge: "The value road does not begin as a slogan. It begins where pressure learned to climb."
    },
    charactersPath: {
      target: "mirrorlandPath",
      label: "Cross into Mirrorland.",
      bridge: "The Characters do not stand alone. Their roles are the human edges of Mirrorland’s pressure."
    },
    characterIdentityPath: {
      target: "mirrorlandPath",
      label: "Cross into Mirrorland.",
      bridge: "The role map points back to the world that made those roles necessary."
    },
    characterStoryPressurePath: {
      target: "mirrorlandPath",
      label: "Cross into Mirrorland.",
      bridge: "If the Characters carry pressure, Mirrorland is where that pressure first becomes visible."
    },
    characterSorenPath: {
      target: "ziontsPath",
      label: "Cross toward ZIONTS.",
      bridge: "Soren’s boundary logic does not stay personal. It opens toward consequence, where false restoration becomes dangerous."
    },
    mirrorlandPath: {
      target: "charactersPath",
      label: "Cross into the Characters Hall.",
      bridge: "Mirrorland does not stay a world for long. It becomes people."
    },
    atlasPath: {
      target: "charactersPath",
      label: "Cross into the Characters Hall.",
      bridge: "A map can show the field, but the Characters show who carries it."
    },
    audraliaPath: {
      target: "frontierPath",
      label: "Cross into Frontier Yard.",
      bridge: "Audralia shows possibility. Frontier asks what that possibility would need if it had to work."
    },
    hEarthPath: {
      target: "frontierPath",
      label: "Cross into Frontier Yard.",
      bridge: "Survival becomes system work when the future has to hold."
    },
    ziontsPath: {
      target: "characterSorenPath",
      label: "Cross toward the Boundary Keeper.",
      bridge: "ZIONTS is consequence. Soren is the one who refuses to let consequence be hidden under comfort."
    },
    lawsPath: {
      target: "scientificLawPath",
      label: "Cross into Scientific Law.",
      bridge: "The Law Library sets the boundary. Scientific Law opens the test."
    },
    scientificLawPath: {
      target: "frontierPath",
      label: "Cross into Frontier Yard.",
      bridge: "A tested claim does not stay in the chamber. It eventually has to meet the yard."
    },
    gaugesPath: {
      target: "scientificLawPath",
      label: "Cross into Scientific Law.",
      bridge: "A gauge can read readiness only if a proof path stands behind it."
    },
    frontierPath: {
      target: "scientificLawPath",
      label: "Cross into Scientific Law.",
      bridge: "Frontier can build only what proof can keep honest."
    },
    frontierSystemsPath: {
      target: "scientificLawPath",
      label: "Cross into Scientific Law.",
      bridge: "The system yard is alive, but every future system still owes the house a test."
    },
    hearthPath: {
      target: "frontierPath",
      label: "Cross into Frontier Yard.",
      bridge: "Hearth steadies the view. Frontier tests what the view is trying to build."
    },
    hearthConstructPath: {
      target: "mirrorlandPath",
      label: "Cross into Mirrorland.",
      bridge: "The window within the window looks outward. Mirrorland is the larger field it opens toward."
    },
    diagnosticPath: {
      target: "characterArchetypeMirrorPath",
      label: "Cross into the Character Archetype Mirror.",
      bridge: "Self-reflection sharpens when pressure behavior can see itself in story form."
    },
    characterArchetypeMirrorPath: {
      target: "diagnosticPath",
      label: "Cross into the Diagnostic.",
      bridge: "The mirror can reveal direction. The Diagnostic can test the pattern more carefully."
    }
  };

  var FORWARD_DOORS = {
    intro: "hearthPath",
    whereToStart: "hearthPath",
    hearthPath: "hearthConstructPath",
    hearthFacilityPath: "hearthConstructPath",
    hearthConstructPath: "mirrorlandPath",
    mirrorlandPath: "atlasPath",
    atlasPath: "charactersPath",
    charactersPath: "characterIdentityPath",
    characterIdentityPath: "characterFirstPath",
    characterFirstPath: "characterAurenValePath",
    characterRelationshipsPath: "characterStoryPressurePath",
    characterStoryPressurePath: "characterArchetypeMirrorPath",
    lawsPath: "scientificLawPath",
    scientificLawPath: "scientificLawTheoryPath",
    gaugesPath: "scientificLawPath",
    frontierPath: "frontierSystemsPath",
    frontierSystemsPath: "frontierEnergyPath",
    seanPath: "underdogPath",
    underdogPath: "nineSummitsPath",
    nineSummitsPath: "nineSummitsBookPath",
    diagnosticPath: "characterArchetypeMirrorPath",
    audraliaPath: "audraliaWorldroomPath",
    ziontsPath: "characterSorenPath",
    hEarthPath: "frontierPath"
  };

  var ROUTE_LABEL_REPLACEMENTS = [
    { pattern: /^Open the Characters Chamber$/i, value: "Open the Characters Hall" },
    { pattern: /^Open Characters Chamber$/i, value: "Open the Characters Hall" },
    { pattern: /^Open the Law Chamber$/i, value: "Open the Law Library" },
    { pattern: /^Open Scientific Law Chamber$/i, value: "Open Scientific Law" },
    { pattern: /^Open the Public Entry Chamber$/i, value: "Open the Public Entry" },
    { pattern: /^Open the Guide Chamber$/i, value: "Open the Guide Desk" },
    { pattern: /^Open This Underdog Chamber$/i, value: "Open This Underdog" },
    { pattern: /^Open the Frontier Chamber$/i, value: "Open Frontier Yard" },
    { pattern: /^Open Frontier$/i, value: "Open Frontier Yard" }
  ];

  var PUBLIC_SOFTENERS = [
    { pattern: /\bcurrent frame\b/gi, value: "part of the path in front of you" },
    { pattern: /\bfirst frame\b/gi, value: "first door" },
    { pattern: /\bnext frame\b/gi, value: "next passage" },
    { pattern: /\bframe\b/gi, value: "view" },
    { pattern: /\brole functions\b/gi, value: "roles" },
    { pattern: /\bworld pressure\b/gi, value: "pressure the world carries" },
    { pattern: /\bsystem paths\b/gi, value: "system roads" },
    { pattern: /\bclean directions\b/gi, value: "open directions" },
    { pattern: /\borientation\b/gi, value: "bearing" },
    { pattern: /\bthreshold logic\b/gi, value: "threshold" },
    { pattern: /\broute logic\b/gi, value: "path logic" },
    { pattern: /\bconversation structure\b/gi, value: "conversation path" },
    { pattern: /\bsource pressure\b/gi, value: "source pressure" },
    { pattern: /\bpublic voice canon\b/gi, value: "public voice" }
  ];

  function shapeForkBridge(frame, context) {
    var ctx = normalizeContext(context, frame);
    var moment = ctx.bridgeMoment || inferBridgeMoment(ctx);
    var target = normalizeTarget(ctx.selectedTarget || ctx.currentNode || "");
    var result = {
      bridgeMoment: moment
    };

    if (moment === BRIDGE_MOMENT.ENTRANCE) {
      result.replaceBeats = true;
      result.beats = entranceBeats(ctx);
      result.archetypeOptions = archetypeOptionsFor(ctx);
      result.traversalControls = traversalControlsFor(ctx);
      return result;
    }

    if (moment === BRIDGE_MOMENT.RECENTER) {
      result.replaceBeats = true;
      result.beats = recenterBeats(ctx);
      result.archetypeOptions = archetypeOptionsFor(ctx);
      result.traversalControls = traversalControlsFor(ctx);
      return result;
    }

    if (moment === BRIDGE_MOMENT.RETURN) {
      result.replaceBeats = true;
      result.beats = returnBeats(ctx);
      result.archetypeOptions = archetypeOptionsFor(ctx);
      result.traversalControls = traversalControlsFor(ctx);
      return result;
    }

    if (moment === BRIDGE_MOMENT.PARALLEL) {
      var parallel = adjacentDoorFor(target, ctx);
      result.beatsBefore = parallel && parallel.bridge ? [parallel.bridge] : [];
      result.traversalControls = traversalControlsFor(ctx);
      return result;
    }

    if (moment === BRIDGE_MOMENT.AFTER_KNOWLEDGE) {
      result.beatsAfter = afterKnowledgeBeats(ctx);
      result.traversalControls = traversalControlsFor(ctx);
      return result;
    }

    if (shouldUseEntranceLikeBridge(ctx)) {
      result.beats = entranceBeats(ctx);
      result.archetypeOptions = archetypeOptionsFor(ctx);
      result.traversalControls = traversalControlsFor(ctx);
      return result;
    }

    result.traversalControls = traversalControlsFor(ctx);
    return result;
  }

  function shapeTransitionBridge(frame, context) {
    return shapeForkBridge(frame, context);
  }

  function shapePreKnowledgeBridge(selection, context) {
    var ctx = normalizeContext(context, selection);
    var target = normalizeTarget(ctx.selectedTarget || (selection && selection.selectedTarget) || "");
    var kind = normalizeOptionKind(ctx.optionKind || (selection && selection.optionKind) || "");
    var room = roomName(target);
    var beats = [];

    if (kind === OPTION_KIND.PARALLEL) {
      var adjacent = adjacentDoorFor(target, ctx);
      if (adjacent && adjacent.bridge) {
        beats.push(adjacent.bridge);
      } else {
        beats.push("A nearby door opens beside this one. We can cross it without losing the road we are already on.");
      }
    } else if (kind === OPTION_KIND.FORWARD) {
      beats.push("This road can continue. We will stay with " + room + " and let the deeper answer open from there.");
    } else if (kind === OPTION_KIND.ARCHETYPE) {
      beats.push("That answer chooses a posture before it chooses a destination. I will carry that pressure into the room before the deeper answer speaks.");
    } else if (target) {
      beats.push("You have chosen the direction toward " + room + ". I will carry you to the edge of that room, then the deeper answer can take over.");
    }

    return {
      bridgeMoment: BRIDGE_MOMENT.BEFORE_KNOWLEDGE,
      beats: beats.map(sanitizePublicText).filter(Boolean)
    };
  }

  function shapeOptions(options, context) {
    var ctx = normalizeContext(context, null);
    var clean = normalizeOptions(options);

    if (!clean.length) {
      return archetypeOptionsFor(ctx);
    }

    return clean.map(function (option) {
      var shaped = Object.assign({}, option);
      shaped.target = normalizeTarget(shaped.target);
      shaped.optionKind = normalizeOptionKind(shaped.optionKind || shaped.kind || "") || deriveKindFromLabel(shaped.label, shaped.target);
      shaped.label = shapeOptionLabel(shaped.label, shaped.target, shaped.optionKind, ctx);
      return shaped;
    });
  }

  function shapeRouteLabel(label, context) {
    var value = String(label || "").replace(/\s+/g, " ").trim();

    ROUTE_LABEL_REPLACEMENTS.forEach(function (entry) {
      value = value.replace(entry.pattern, entry.value);
    });

    var ctx = normalizeContext(context, null);
    var routeId = ctx.routeId || (context && context.routeId) || "";

    if (/^Open/i.test(value)) {
      if (routeId === "frontier") value = "Open Frontier Yard";
      if (routeId === "characters") value = "Open the Characters Hall";
      if (routeId === "laws") value = "Open the Law Library";
      if (routeId === "showroom") value = "Open the Atrium";
      if (routeId === "siteGuide") value = "Open the Guide Desk";
      if (routeId === "aboutUnderdog") value = "Open This Underdog";
    }

    return sanitizePublicText(value, ctx);
  }

  function sanitizePublicText(text, context) {
    var value = String(text || "")
      .replace(/\s+/g, " ")
      .replace(/```/g, "")
      .trim();

    if (!value) return "";

    value = value
      .replace(/^Frame\s+/i, "Enter ")
      .replace(/^Reveal\s+/i, "Show ")
      .replace(/^Clarify\s+/i, "Show ")
      .replace(/^Orient\s+/i, "Begin ")
      .replace(/^Prepare\s+/i, "Begin ")
      .replace(/^Trace\s+/i, "Follow ");

    PUBLIC_SOFTENERS.forEach(function (entry) {
      value = value.replace(entry.pattern, entry.value);
    });

    value = value
      .replace(/\bAPI\/North\b/g, "the deeper answer")
      .replace(/\bAPI\b/g, "the deeper answer")
      .replace(/\bNorth\b/g, "the deeper answer")
      .replace(/\bfrontbrain\b/gi, "visible side")
      .replace(/\bbackbrain\b/gi, "deeper side")
      .replace(/\bpayload\b/gi, "answer")
      .replace(/\bDOM\b/g, "visible interface")
      .replace(/\bscope\b/gi, "view")
      .replace(/\broute\b/gi, "path")
      .replace(/\bcontract\b/gi, "governing mark");

    value = preserveRoomNames(value);
    value = value.replace(/\s+/g, " ").trim();

    return value;
  }

  function shouldUseTrainingWheels(context) {
    var ctx = normalizeContext(context, null);
    return ctx.bridgeMoment === BRIDGE_MOMENT.ENTRANCE ||
      ctx.bridgeMoment === BRIDGE_MOMENT.RECENTER ||
      ctx.bridgeMoment === BRIDGE_MOMENT.RETURN ||
      ctx.currentScopeStage === "orientation";
  }

  function entranceBeats(ctx) {
    return [
      "Welcome. I’m Jeeves.",
      "You are standing inside Hearth Mission Control — the window within the window.",
      "The house is quiet, but the doors are awake.",
      "West, the Law Library is lit. South, Mirrorland opens. East, Frontier Yard is still being built. Nearer now, the Characters can be heard before they are named.",
      "And behind the estate, the creator’s road remains open."
    ];
  }

  function recenterBeats(ctx) {
    return [
      "We can re-center without starting the whole journey over.",
      "Hearth Mission Control is still here. The First Fork is still close.",
      "From here, you can move toward proof, story, systems, Characters, or the human road behind the estate."
    ];
  }

  function returnBeats(ctx) {
    return [
      "We are back at the First Fork.",
      "Nothing has been lost. The road behind you remains available, and the next door can still be chosen cleanly.",
      "Choose the pressure you want to follow now."
    ];
  }

  function afterKnowledgeBeats(ctx) {
    var target = normalizeTarget(ctx.selectedTarget || ctx.currentNode || "");
    var adjacent = adjacentDoorFor(target, ctx);
    var forward = forwardTargetFor(target, ctx);
    var beats = [];

    if (adjacent && adjacent.target) {
      beats.push("This road can continue, but another room now touches it.");
    } else if (forward) {
      beats.push("This path has enough shape to keep moving.");
    }

    return beats;
  }

  function archetypeOptionsFor(ctx) {
    var topic = ctx.currentTopic || inferTopic(ctx.selectedTarget || ctx.currentNode);
    var target = normalizeTarget(ctx.selectedTarget || ctx.currentNode || "");

    if (topic === "characters" || target.indexOf("character") === 0) {
      return [
        archetype("Show me what role is being carried.", "characterIdentityPath"),
        archetype("Show me what pressure the role answers.", "characterStoryPressurePath"),
        archetype("Let me meet the first Character.", "characterFirstPath"),
        archetype("Let the mirror ask me back.", "characterArchetypeMirrorPath")
      ];
    }

    if (topic === "proof" || target === "lawsPath" || target.indexOf("scientificLaw") === 0) {
      return [
        archetype("Show me what must be tested.", "scientificLawPath"),
        archetype("Show me what the gauges can read.", "gaugesPath"),
        archetype("Show me where proof meets Frontier.", "frontierLawPath"),
        archetype("Show me why Hearth answers to proof.", "hearthLawPath")
      ];
    }

    if (topic === "frontier" || target.indexOf("frontier") === 0) {
      return [
        archetype("Show me the future system.", "frontierSystemsPath"),
        archetype("Show me what proof must test.", "scientificLawPath"),
        archetype("Show me why Hearth is near it.", "hearthPath"),
        archetype("Show me who carries the pressure.", "charactersPath")
      ];
    }

    if (topic === "mirrorland" || target === "mirrorlandPath" || target === "atlasPath") {
      return [
        archetype("Show me the world map.", "atlasPath"),
        archetype("Show me who carries the world pressure.", "charactersPath"),
        archetype("Show me the possibility road.", "audraliaPath"),
        archetype("Show me the consequence road.", "ziontsPath")
      ];
    }

    if (topic === "sean" || topic === "underdog" || target === "seanPath" || target === "underdogPath") {
      return [
        archetype("Show me the human beginning.", "seanPath"),
        archetype("Show me the underdog voice.", "underdogPath"),
        archetype("Show me the value road.", "nineSummitsPath"),
        archetype("Show me how the estate was built.", "websitePath")
      ];
    }

    if (topic === "summits" || target.indexOf("nineSummits") === 0) {
      return [
        archetype("Show me the climb road.", "nineSummitsPath"),
        archetype("Show me the book path.", "nineSummitsBookPath"),
        archetype("Show me the underdog voice beneath it.", "underdogPath"),
        archetype("Show me the human source.", "seanPath")
      ];
    }

    if (topic === "diagnostic" || target === "diagnosticPath") {
      return [
        archetype("Show me the pressure pattern.", "diagnosticPath"),
        archetype("Show me the Character mirror.", "characterArchetypeMirrorPath"),
        archetype("Show me what must be tested.", "lawsPath"),
        archetype("Show me where this begins.", "hearthPath")
      ];
    }

    return [
      archetype("Enter through Hearth Mission Control.", "hearthPath"),
      archetype("Move toward the Law Library.", "lawsPath"),
      archetype("Cross into Mirrorland.", "mirrorlandPath"),
      archetype("Step into Frontier Yard.", "frontierPath")
    ];
  }

  function traversalControlsFor(ctx) {
    var target = normalizeTarget(ctx.selectedTarget || ctx.currentNode || "");
    var controls = [];
    var forward = forwardTargetFor(target, ctx);
    var adjacent = adjacentDoorFor(target, ctx);

    if (forward && forward !== target) {
      controls.push(traversal("Continue deeper on this path.", forward, OPTION_KIND.FORWARD));
    }

    if (ctx.returnStack && ctx.returnStack.length) {
      controls.push(traversal("Step back one threshold.", "priorTopicReturnPath", OPTION_KIND.RETURN, "control"));
    } else if (target !== "intro") {
      controls.push(traversal("Return to the First Fork.", "returnFork", OPTION_KIND.RETURN, "control"));
    }

    if (adjacent && adjacent.target && adjacent.target !== target) {
      controls.push(traversal(adjacent.label, adjacent.target, OPTION_KIND.PARALLEL, "conversation", adjacent.bridge));
    }

    return controls.slice(0, 3);
  }

  function forwardTargetFor(target, ctx) {
    var clean = normalizeTarget(target || "");
    if (FORWARD_DOORS[clean]) return FORWARD_DOORS[clean];

    var topic = ctx.currentTopic || inferTopic(clean);

    if (topic === "characters") return "characterIdentityPath";
    if (topic === "proof") return "scientificLawPath";
    if (topic === "frontier") return "frontierSystemsPath";
    if (topic === "mirrorland") return "atlasPath";
    if (topic === "sean") return "underdogPath";
    if (topic === "underdog") return "nineSummitsPath";
    if (topic === "summits") return "nineSummitsBookPath";
    if (topic === "diagnostic") return "characterArchetypeMirrorPath";

    return "";
  }

  function adjacentDoorFor(target, ctx) {
    var clean = normalizeTarget(target || "");
    if (ADJACENT_DOORS[clean]) return Object.assign({}, ADJACENT_DOORS[clean]);

    var topic = ctx.currentTopic || inferTopic(clean);

    if (topic === "characters") return Object.assign({}, ADJACENT_DOORS.charactersPath);
    if (topic === "frontier") return Object.assign({}, ADJACENT_DOORS.frontierPath);
    if (topic === "proof") return Object.assign({}, ADJACENT_DOORS.scientificLawPath);
    if (topic === "mirrorland") return Object.assign({}, ADJACENT_DOORS.mirrorlandPath);
    if (topic === "sean") return Object.assign({}, ADJACENT_DOORS.seanPath);
    if (topic === "underdog") return Object.assign({}, ADJACENT_DOORS.underdogPath);
    if (topic === "summits") return Object.assign({}, ADJACENT_DOORS.nineSummitsPath);
    if (topic === "diagnostic") return Object.assign({}, ADJACENT_DOORS.diagnosticPath);

    return null;
  }

  function shapeOptionLabel(label, target, optionKind, ctx) {
    var cleanTarget = normalizeTarget(target || "");
    var kind = normalizeOptionKind(optionKind || "") || OPTION_KIND.CONVERSATION;
    var room = roomName(cleanTarget);
    var value = String(label || "").replace(/\s+/g, " ").trim();

    if (!value) {
      if (kind === OPTION_KIND.FORWARD) value = "Continue deeper on this path.";
      else if (kind === OPTION_KIND.RETURN) value = "Step back one threshold.";
      else if (kind === OPTION_KIND.PARALLEL) value = "Cross into " + room + ".";
      else value = "Enter " + room + ".";
    }

    if (kind === OPTION_KIND.PARALLEL && !/^(Cross|Open beside|Move toward|Follow|Enter)/i.test(value)) {
      value = "Cross into " + room + ".";
    }

    if (kind === OPTION_KIND.FORWARD && !/^(Continue|Stay with|Go deeper|Follow|Move forward)/i.test(value)) {
      value = "Continue deeper on this path.";
    }

    if (kind === OPTION_KIND.RETURN && !/^(Return|Step back|Go back|Re-center|Start over)/i.test(value)) {
      value = "Step back one threshold.";
    }

    return sanitizePublicText(value, ctx);
  }

  function normalizeContext(context, frame) {
    var ctx = Object.assign({}, context || {});
    var source = frame || {};

    ctx.currentNode = normalizeTarget(ctx.currentNode || source.currentNode || source.selectedTarget || "");
    ctx.selectedTarget = normalizeTarget(ctx.selectedTarget || source.selectedTarget || ctx.currentNode || "");
    ctx.currentTopic = ctx.currentTopic || source.currentTopic || inferTopic(ctx.selectedTarget || ctx.currentNode);
    ctx.currentScopeStage = ctx.currentScopeStage || source.currentScopeStage || "";
    ctx.selectedLabel = ctx.selectedLabel || source.selectedLabel || "";
    ctx.requestMode = ctx.requestMode || source.requestMode || "";
    ctx.optionKind = normalizeOptionKind(ctx.optionKind || source.optionKind || "") || OPTION_KIND.CONVERSATION;
    ctx.bridgeMoment = ctx.bridgeMoment || source.bridgeMoment || inferBridgeMoment(ctx);
    ctx.returnStack = Array.isArray(ctx.returnStack) ? ctx.returnStack : [];
    ctx.visitedNodes = Array.isArray(ctx.visitedNodes) ? ctx.visitedNodes : [];
    ctx.selectedTargets = Array.isArray(ctx.selectedTargets) ? ctx.selectedTargets : [];
    ctx.transitionTrail = Array.isArray(ctx.transitionTrail) ? ctx.transitionTrail : [];
    ctx.routeId = ctx.routeId || source.routeId || "";

    return ctx;
  }

  function inferBridgeMoment(ctx) {
    var target = normalizeTarget(ctx.selectedTarget || ctx.currentNode || "");
    var kind = normalizeOptionKind(ctx.optionKind || "");

    if (target === "intro" || target === "whereToStart") return BRIDGE_MOMENT.ENTRANCE;
    if (target === "recenterNode" || target === "cleanDoor" || target === "loopRecovery" || target === "switchTopics" || target === "sharpQuestion") return BRIDGE_MOMENT.RECENTER;
    if (target === "returnFork" || target === "priorTopicReturnPath" || target === "originReturnPath" || target === "restartFork") return BRIDGE_MOMENT.RETURN;
    if (kind === OPTION_KIND.PARALLEL) return BRIDGE_MOMENT.PARALLEL;
    if (ctx.requestMode === "node_enrichment") return BRIDGE_MOMENT.AFTER_KNOWLEDGE;

    return BRIDGE_MOMENT.ENTRANCE;
  }

  function shouldUseEntranceLikeBridge(ctx) {
    return ctx.currentScopeStage === "orientation" ||
      ctx.currentNode === "intro" ||
      ctx.selectedTarget === "intro" ||
      ctx.selectedTarget === "whereToStart";
  }

  function inferTopic(target) {
    var clean = normalizeTarget(target || "");

    if (clean.indexOf("character") === 0 || clean === "charactersPath") return "characters";
    if (clean.indexOf("scientificLaw") === 0 || clean === "lawsPath" || clean === "gaugesPath") return "proof";
    if (clean.indexOf("frontier") === 0) return "frontier";
    if (clean.indexOf("hearth") === 0 || clean === "intro") return "hearth";
    if (clean === "mirrorlandPath" || clean === "atriumPath" || clean === "atlasPath" || clean === "audraliaPath" || clean === "ziontsPath" || clean === "hEarthPath") return "mirrorland";
    if (clean === "seanPath") return "sean";
    if (clean === "underdogPath") return "underdog";
    if (clean.indexOf("nineSummits") === 0) return "summits";
    if (clean === "diagnosticPath" || clean === "selfLearningPath") return "diagnostic";

    return "orientation";
  }

  function roomName(target) {
    var clean = normalizeTarget(target || "");
    if (ROOM_NAMES[clean]) return ROOM_NAMES[clean];

    return String(clean || "this room")
      .replace(/Path$/g, "")
      .replace(/([A-Z])/g, " $1")
      .replace(/[-_]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/^./, function (char) {
        return char.toUpperCase();
      });
  }

  function preserveRoomNames(text) {
    return String(text || "")
      .replace(/\bHearth Mission Control\b/gi, "Hearth Mission Control")
      .replace(/\bFirst Fork\b/gi, "First Fork")
      .replace(/\bFrontier Yard\b/gi, "Frontier Yard")
      .replace(/\bLaw Library\b/gi, "Law Library")
      .replace(/\bScientific Law\b/gi, "Scientific Law")
      .replace(/\bTriple G\b/gi, "Triple G")
      .replace(/\bAtrium\b/gi, "Atrium")
      .replace(/\bMirrorland\b/gi, "Mirrorland")
      .replace(/\bAtlas Study\b/gi, "Atlas Study")
      .replace(/\bCharacters Hall\b/gi, "Characters Hall")
      .replace(/\bCharacter Archetype Mirror\b/gi, "Character Archetype Mirror")
      .replace(/\bThis Underdog\b/gi, "This Underdog")
      .replace(/\bNine Summits\b/gi, "Nine Summits")
      .replace(/\bAudralia\b/gi, "Audralia")
      .replace(/\bZIONTS\b/gi, "ZIONTS")
      .replace(/\bH-Earth\b/gi, "H-Earth");
  }

  function normalizeOptions(options) {
    if (!Array.isArray(options)) return [];

    return options.map(function (item) {
      if (!item || typeof item !== "object") return null;

      return {
        label: item.label || "",
        target: normalizeTarget(item.target || ""),
        type: item.type || "conversation",
        scopeLane: item.scopeLane || "",
        scopeStage: item.scopeStage || "",
        optionKind: normalizeOptionKind(item.optionKind || item.kind || "") || deriveKindFromLabel(item.label || "", item.target || ""),
        bridgeReason: item.bridgeReason || item.reason || ""
      };
    }).filter(function (item) {
      return item && item.target;
    });
  }

  function normalizeTarget(target) {
    var clean = String(target || "").trim();

    var aliases = {
      worldPath: "mirrorlandPath",
      worldGatePath: "atriumPath",
      globeWindowPath: "mirrorlandPath",
      characterMirrorPath: "characterArchetypeMirrorPath",
      characterMirrorQuestionOne: "characterArchetypeQuestionOne",
      characterMirrorQuestionTwo: "characterArchetypeQuestionTwo",
      characterMirrorQuestionThree: "characterArchetypeQuestionThree",
      characterMirrorResult: "characterArchetypeResult",
      characterFactionsPath: "characterRelationshipsPath",
      characterRolePath: "characterIdentityPath",
      characterRoleMapPath: "characterIdentityPath",
      characterRolesPath: "characterIdentityPath",
      bookPath: "nineSummitsBookPath",
      missionControlPath: "hearthPath",
      hearthMissionControlPath: "hearthPath",
      windowWithinWindowPath: "hearthPath",
      hearthWindowPath: "hearthPath"
    };

    return aliases[clean] || clean;
  }

  function normalizeOptionKind(kind) {
    var clean = String(kind || "").trim();

    if (clean === "archetype" || clean === "archetypeAnswer") return OPTION_KIND.ARCHETYPE;
    if (clean === "back") return OPTION_KIND.RETURN;
    if (clean === "adjacent" || clean === "sideways" || clean === "crossing") return OPTION_KIND.PARALLEL;
    if (clean === "continue" || clean === "depth") return OPTION_KIND.FORWARD;

    if (clean === OPTION_KIND.ARCHETYPE ||
      clean === OPTION_KIND.CONVERSATION ||
      clean === OPTION_KIND.FORWARD ||
      clean === OPTION_KIND.RETURN ||
      clean === OPTION_KIND.PARALLEL ||
      clean === OPTION_KIND.CONTROL ||
      clean === OPTION_KIND.ROUTE) {
      return clean;
    }

    return "";
  }

  function deriveKindFromLabel(label, target) {
    var text = String(label || "").trim();

    if (/^(I |I’m |I am |My |Let me)/i.test(text)) return OPTION_KIND.ARCHETYPE;
    if (/^(Cross|Open beside|Move toward|Nearby|Adjacent|Follow this into)/i.test(text)) return OPTION_KIND.PARALLEL;
    if (/^(Continue|Stay with|Go deeper|Move forward|Follow this path)/i.test(text)) return OPTION_KIND.FORWARD;
    if (/^(Return|Step back|Go back|Re-center|Start over)/i.test(text)) return OPTION_KIND.RETURN;

    var clean = normalizeTarget(target || "");
    if (clean === "returnFork" || clean === "priorTopicReturnPath" || clean === "originReturnPath" || clean === "restartFork") return OPTION_KIND.RETURN;
    if (clean === "recenterNode" || clean === "cleanDoor" || clean === "switchTopics" || clean === "loopRecovery" || clean === "sharpQuestion") return OPTION_KIND.CONTROL;

    return OPTION_KIND.CONVERSATION;
  }

  function archetype(label, target) {
    return {
      label: sanitizePublicText(label),
      target: normalizeTarget(target),
      type: "conversation",
      optionKind: OPTION_KIND.ARCHETYPE
    };
  }

  function traversal(label, target, optionKind, type, reason) {
    return {
      label: sanitizePublicText(label),
      target: normalizeTarget(target),
      type: type || "conversation",
      optionKind: normalizeOptionKind(optionKind) || OPTION_KIND.FORWARD,
      bridgeReason: reason || ""
    };
  }

  var api = {
    contract: CONTRACT,
    CONTRACT: CONTRACT,
    previousContract: PREVIOUS_CONTRACT,
    role: "narrative_fork_bridge",
    authority: "threshold_and_transition_language_only",

    shapeForkBridge: shapeForkBridge,
    shapeTransitionBridge: shapeTransitionBridge,
    shapePreKnowledgeBridge: shapePreKnowledgeBridge,
    shapeConversationFrame: shapeForkBridge,
    shapeOptions: shapeOptions,
    shapeRouteLabel: shapeRouteLabel,
    sanitizePublicText: sanitizePublicText,
    shouldUseTrainingWheels: shouldUseTrainingWheels,

    rooms: ROOM_NAMES,
    roomGeography: ROOM_GEOGRAPHY,
    adjacentDoors: ADJACENT_DOORS,
    forwardDoors: FORWARD_DOORS,

    optionKind: OPTION_KIND,
    bridgeMoment: BRIDGE_MOMENT
  };

  window.HEARTH = window.HEARTH || {};
  window.HEARTH.JEEVES = window.HEARTH.JEEVES || {};
  window.HEARTH.JEEVES.expression = api;
  window.HEARTH.JEEVES_EXPRESSION = api;
  window.JEEVES_EXPRESSION = api;

  window.__HEARTH_JEEVES_EXPRESSION_LOADED__ = true;
  window.__HEARTH_JEEVES_EXPRESSION_CONTRACT__ = CONTRACT;
})();
