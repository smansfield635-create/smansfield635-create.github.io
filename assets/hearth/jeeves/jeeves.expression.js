// /assets/hearth/jeeves/jeeves.expression.js
// HEARTH_JEEVES_EXPRESSION_TRAINING_WHEELS_FORK_MANAGER_TNT_v3
// Full-file replacement.
// Browser-side expression layer only.
// Purpose:
// - Behave as Jeeves' training-wheel fork manager.
// - Orient the user at first entry, fresh start, recentering, unclear fork,
//   premature-depth correction, and return-to-origin.
// - Clean public language before it reaches the visible chamber.
// - Keep conversation options conversational and prepared doors route-facing.
// - Yield immediately once the Brain/API has an active selected target.
// Does not own:
// - Brain depth
// - secure model bridge
// - deep canon storage
// - moderation
// - Character depth logic
// - room/lane-specific intelligence
// - route rendering
// - timing
// - DOM mounting
// - final route authority

(function () {
  "use strict";

  var CONTRACT = "HEARTH_JEEVES_EXPRESSION_TRAINING_WHEELS_FORK_MANAGER_TNT_v3";
  var PREVIOUS_CONTRACT = "HEARTH_JEEVES_EXPRESSION_NARRATIVE_BLUEPRINT_ORIENTATION_TNT_v2";

  var MAX_GATE_BEATS = 4;
  var MAX_GATE_OPTIONS = 5;

  var ENTRY_GATE_TARGETS = {
    intro: true,
    askFirst: true,
    whereToStart: true,
    recenterNode: true,
    loopRecovery: true,
    cleanDoor: true,
    switchTopics: true,
    sharpQuestion: true,
    returnFork: true,
    restartFork: true,
    priorTopicReturnPath: true,
    originReturnPath: true
  };

  var TARGET_ALIASES = {
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

  var ROUTE_LABEL_REPLACEMENTS = {
    "Open the Characters Page": "Open the Characters Hall",
    "Open Character Page": "Open the Characters Hall",
    "Open Characters Page": "Open the Characters Hall"
  };

  var CONVERSATION_LABELS = {
    hearthPath: "Frame Hearth Mission Control.",
    mirrorlandPath: "Frame Mirrorland.",
    charactersPath: "Begin the Character path.",
    characterIdentityPath: "Reveal the Character role map.",
    characterStoryPressurePath: "Show why the Characters matter.",
    characterFirstPath: "Begin the first Character path.",
    characterArchetypeMirrorPath: "Prepare the Character Archetype Mirror.",
    lawsPath: "Frame the proof path.",
    scientificLawPath: "Show how claims become testable.",
    gaugesPath: "Frame the status room.",
    frontierPath: "Frame Frontier.",
    frontierSystemsPath: "Reveal the future systems.",
    seanPath: "Frame the creator path.",
    underdogPath: "Frame This Underdog.",
    nineSummitsPath: "Frame the value road.",
    diagnosticPath: "Frame the self-reflection room.",
    compassPath: "Orient the first path.",
    siteGuidePath: "Frame how the rooms relate.",
    recenterNode: "Re-center me.",
    returnFork: "Return to the First Fork.",
    restartFork: "Start over.",
    cleanDoor: "Give me the cleanest next door.",
    sharpQuestion: "Ask me a sharper question.",
    switchTopics: "Change the room path.",
    priorTopicReturnPath: "Return to the prior topic.",
    originReturnPath: "Return to the origin conversation."
  };

  var META_LANGUAGE_REPLACEMENTS = [
    {
      pattern: /I know the estate by its blueprint\.\s*I do not pretend to be stationed inside every page at once\.\s*For now, this is my live room\./gi,
      value: "From Hearth Mission Control, I can help you define the next question, complete the part of the picture in front of you, or prepare the right door."
    },
    {
      pattern: /I do not pretend to be stationed inside every page at once\.?/gi,
      value: ""
    },
    {
      pattern: /I am aware enough to know that I'?m not in all (?:of )?the rooms at once\.?/gi,
      value: ""
    },
    {
      pattern: /I only know this by blueprint\.?/gi,
      value: ""
    },
    {
      pattern: /For now, this is my live room\.?/gi,
      value: ""
    },
    {
      pattern: /mounted inside every page/gi,
      value: "stationed beyond this chamber"
    },
    {
      pattern: /inside every page/gi,
      value: "beyond this chamber"
    },
    {
      pattern: /live room/gi,
      value: "present chamber"
    },
    {
      pattern: /without claiming to be mounted inside every page at once/gi,
      value: "while keeping the next door properly sequenced"
    },
    {
      pattern: /without pretending the visitor has already crossed into that deeper place/gi,
      value: "without forcing you across the threshold too early"
    }
  ];

  var PUBLIC_LANGUAGE_REPLACEMENTS = [
    { pattern: /\bscope lane\b/gi, value: "path" },
    { pattern: /\broute lane\b/gi, value: "path" },
    { pattern: /\barchitecture layer\b/gi, value: "structure" },
    { pattern: /\bexpression payload\b/gi, value: "entry answer" },
    { pattern: /\bprogression state\b/gi, value: "step" },
    { pattern: /\bbackend bridge\b/gi, value: "deeper answer path" },
    { pattern: /\bpublic human-voice side\b/gi, value: "place where the voice becomes human" },
    { pattern: /\bfront-end\b/gi, value: "visible side" },
    { pattern: /\bback-end\b/gi, value: "deeper side" },
    { pattern: /\bserver-side\b/gi, value: "deeper house layer" },
    { pattern: /\bfrontbrain\b/gi, value: "visible side" },
    { pattern: /\bbackbrain\b/gi, value: "deeper side" },
    { pattern: /\bbackend\b/gi, value: "deeper side" },
    { pattern: /\bfrontend\b/gi, value: "visible side" },
    { pattern: /\bserver\b/gi, value: "deeper side" },
    { pattern: /\bbrowser\b/gi, value: "visible side" },
    { pattern: /\bDOM\b/g, value: "visible interface" },
    { pattern: /\bAPI\b/g, value: "deeper answer path" },
    { pattern: /\bpayload\b/gi, value: "answer" },
    { pattern: /\bcontract\b/gi, value: "governing mark" },
    { pattern: /\bTNT\b/g, value: "" },
    { pattern: /\bregistry\b/gi, value: "guide" },
    { pattern: /\borgan\b/gi, value: "part" },
    { pattern: /\bGuided House Handoffs\b/gi, value: "Prepared Doors" },
    { pattern: /\bHandoffs\b/g, value: "Prepared Doors" },
    { pattern: /\bhandoffs\b/g, value: "prepared doors" },
    { pattern: /\bHandoff\b/g, value: "Prepared Door" },
    { pattern: /\bhandoff\b/g, value: "prepared door" },
    { pattern: /\bsystem lanes\b/gi, value: "system paths" },
    { pattern: /\brouting lane\b/gi, value: "path" },
    { pattern: /\blanes\b/gi, value: "paths" },
    { pattern: /\blane\b/gi, value: "path" },
    { pattern: /\bscope\b/gi, value: "frame" },
    { pattern: /\broute movement\b/gi, value: "guided movement" },
    { pattern: /\bmenu\b/gi, value: "flat list" },
    { pattern: /\bvisitor\b/gi, value: "you" },
    { pattern: /\bpage\b/gi, value: "chamber" },
    { pattern: /\blocal\b/gi, value: "close at hand" },
    { pattern: /\bCharacter Page\b/g, value: "Characters Hall" },
    { pattern: /\bCharacters Page\b/g, value: "Characters Hall" },
    { pattern: /\bhuman source\b/gi, value: "creator behind all of this" },
    { pattern: /\bwhich character am I most like\b/gi, value: "which Character Archetype do I follow under pressure" },
    { pattern: /\bwhich character fits my pressure\b/gi, value: "which Character Archetype do I follow under pressure" },
    { pattern: /\bpressure pattern\b/gi, value: "behavior under pressure" }
  ];

  var DIRECT_ROUTE_PREFIX = /^(open|visit|enter|explore|launch|go to)\b/i;
  var CONVERSATION_PREFIX = /^(tell me about|explain|show me why|help me understand|show me how|which character archetype|begin|continue|frame|reveal|clarify|complete|prepare|start|trace|orient|introduce|ask|re-center|return|give me|change)\b/i;
  var QUESTION_PREFIX = /^(who|what|why|which|how|where|when)\b/i;

  function shapeConversationFrame(frame, context) {
    var cleanFrame = normalizeFrame(frame);

    if (!shouldUseTrainingWheels(cleanFrame, context)) {
      return cleanFrame;
    }

    cleanFrame.beats = shapeGateBeats(cleanFrame, context);
    cleanFrame.options = shapeGateOptions(cleanFrame.options, cleanFrame, context);
    cleanFrame.handoffs = shapeGateHandoffs(cleanFrame.handoffs, cleanFrame, context);
    cleanFrame.currentScopeStage = cleanFrame.currentScopeStage || "orientation";
    cleanFrame.expressionMode = "training_wheels_only";
    cleanFrame.expressionContract = CONTRACT;

    return cleanFrame;
  }

  function shapeOptions(options, context) {
    if (!shouldUseTrainingWheels(null, context)) {
      return normalizeOptions(options);
    }

    return shapeGateOptions(options, null, context);
  }

  function shapeRouteLabel(label, context) {
    var clean = sanitizePublicText(label || "");

    if (ROUTE_LABEL_REPLACEMENTS[clean]) {
      return ROUTE_LABEL_REPLACEMENTS[clean];
    }

    if (!clean) {
      return "Open the prepared door";
    }

    if (!DIRECT_ROUTE_PREFIX.test(clean)) {
      clean = "Open " + titleFromKey((context && context.routeId) || clean);
    }

    return sanitizePublicText(clean);
  }

  function sanitizePublicText(text, context) {
    var value = String(text || "")
      .replace(/\s+/g, " ")
      .replace(/```/g, "")
      .trim();

    META_LANGUAGE_REPLACEMENTS.forEach(function (entry) {
      value = value.replace(entry.pattern, entry.value);
    });

    PUBLIC_LANGUAGE_REPLACEMENTS.forEach(function (entry) {
      value = value.replace(entry.pattern, entry.value);
    });

    value = value
      .replace(/\bthe Mirrorland\b/gi, "Mirrorland")
      .replace(/\s+([,.!?;:])/g, "$1")
      .replace(/\s{2,}/g, " ")
      .trim();

    if (context && context.expressionMode === "training_wheels_only") {
      value = value.replace(/\btraining wheels\b/gi, "first guide rails");
    }

    return value;
  }

  function shouldUseTrainingWheels(frame, context) {
    var ctx = context || {};
    var source = String(ctx.source || (frame && frame.source) || "");
    var requestMode = String(ctx.requestMode || (frame && frame.requestMode) || "");
    var selectedTarget = normalizeTarget(ctx.selectedTarget || (frame && frame.selectedTarget) || "");
    var currentNode = normalizeTarget(ctx.currentNode || (frame && frame.currentNode) || "");
    var currentTopic = String(ctx.currentTopic || (frame && frame.currentTopic) || "");
    var currentScopeStage = String(ctx.currentScopeStage || (frame && frame.currentScopeStage) || "");

    if (requestMode === "node_enrichment" && selectedTarget && !isEntryGateTarget(selectedTarget)) {
      return false;
    }

    if (isEntryGateTarget(selectedTarget) || isEntryGateTarget(currentNode)) {
      return true;
    }

    if (source === "local" && currentScopeStage === "orientation") {
      return true;
    }

    if (requestMode === "freeform" && !selectedTarget) {
      return currentTopic === "orientation" ||
        currentScopeStage === "orientation" ||
        currentNode === "intro";
    }

    return false;
  }

  function normalizeFrame(frame) {
    var clean = frame && typeof frame === "object" ? frame : {};

    return {
      contract: clean.contract || "",
      previousContract: clean.previousContract || "",
      source: clean.source || "local",
      beats: normalizeBeats(clean.beats),
      options: normalizeOptions(clean.options),
      handoffs: normalizeHandoffs(clean.handoffs),
      routeHints: clean.routeHints || {},
      handoffLabels: clean.handoffLabels || {},
      currentNode: normalizeTarget(clean.currentNode || ""),
      currentTopic: clean.currentTopic || "",
      currentScopeStage: clean.currentScopeStage || "",
      selectedTarget: normalizeTarget(clean.selectedTarget || ""),
      selectedLabel: sanitizePublicText(clean.selectedLabel || ""),
      requestMode: clean.requestMode || "",
      visitorTrail: Array.isArray(clean.visitorTrail) ? clean.visitorTrail.slice() : [],
      visitedNodes: Array.isArray(clean.visitedNodes) ? clean.visitedNodes.slice() : [],
      selectedTargets: Array.isArray(clean.selectedTargets) ? clean.selectedTargets.slice() : [],
      returnStack: Array.isArray(clean.returnStack) ? clean.returnStack.slice() : [],
      branchStack: Array.isArray(clean.branchStack) ? clean.branchStack.slice() : [],
      currentRoomContext: clean.currentRoomContext || "",
      currentRoomRole: clean.currentRoomRole || "",
      currentRoomPremise: clean.currentRoomPremise || "",
      estateKnowledgeMode: clean.estateKnowledgeMode || "",
      portalLogic: clean.portalLogic || "",
      routeAuthority: clean.routeAuthority || "",
      depthMode: clean.depthMode || "",
      fibonacciDepth: Number(clean.fibonacciDepth || 0),
      fibonacciStage: String(clean.fibonacciStage || ""),
      narrativeFrame: clean.narrativeFrame || null,
      characterState: clean.characterState || {
        overviewDone: false,
        rolesRevealed: false,
        profileViewCount: 0,
        relationshipViews: 0,
        profileViews: {}
      },
      authorities: clean.authorities || {},
      response: clean.response || null,
      sourceOption: clean.sourceOption || null
    };
  }

  function normalizeBeats(beats) {
    if (!Array.isArray(beats)) return [];
    return beats.map(sanitizePublicText).filter(Boolean).slice(0, MAX_GATE_BEATS);
  }

  function normalizeOptions(options) {
    if (!Array.isArray(options)) return [];

    var seen = {};
    var result = [];

    options.forEach(function (item) {
      if (!item || typeof item !== "object") return;

      var target = normalizeTarget(item.target || "");
      if (!target) return;

      var label = sanitizeConversationLabel(item.label || CONVERSATION_LABELS[target] || "Tell me more.", target);
      var type = item.type === "control" ? "control" : "conversation";

      var clean = {
        label: label,
        target: target,
        type: type,
        scopeLane: item.scopeLane || "objective",
        scopeStage: item.scopeStage || inferScopeStage(target)
      };

      var key = clean.target + "::" + clean.label;
      if (seen[key]) return;
      seen[key] = true;
      result.push(clean);
    });

    return result;
  }

  function normalizeHandoffs(handoffs) {
    if (!Array.isArray(handoffs)) return [];
    return handoffs.map(function (item) {
      if (typeof item === "string") return item;
      if (item && typeof item === "object") return item;
      return null;
    }).filter(Boolean);
  }

  function shapeGateBeats(frame, context) {
    var target = normalizeTarget(frame.selectedTarget || frame.currentNode || "");
    var beats = normalizeBeats(frame.beats);

    if (beats.length) {
      return beats.slice(0, MAX_GATE_BEATS);
    }

    if (target === "returnFork") {
      return [
        "We are back at the First Fork.",
        "Choose the next frame: proof, story, systems, self-reflection, or source."
      ];
    }

    if (target === "recenterNode" || target === "loopRecovery" || target === "cleanDoor" || target === "switchTopics") {
      return [
        "We can re-center.",
        "From Hearth Mission Control, the clean directions are proof, Mirrorland, Characters, Frontier, and the creator path."
      ];
    }

    if (target === "sharpQuestion") {
      return [
        "Ask the sharper version of what you want to understand.",
        "I will keep the answer inside the right room before the deeper answer path takes over."
      ];
    }

    return [
      "Welcome. I’m Jeeves.",
      "You are in Hearth Mission Control — the window within the window.",
      "This is the entry fork. Choose the first clean direction, and I will prepare the deeper answer path."
    ];
  }

  function shapeGateOptions(options, frame, context) {
    var ctx = context || {};
    var target = normalizeTarget(
      (frame && (frame.selectedTarget || frame.currentNode)) ||
      ctx.selectedTarget ||
      ctx.currentNode ||
      ""
    );

    var cleanOptions = normalizeOptions(options);

    if (!cleanOptions.length) {
      cleanOptions = defaultGateOptions(target);
    }

    cleanOptions = cleanOptions.map(function (option) {
      return {
        label: sanitizeConversationLabel(option.label, option.target),
        target: normalizeTarget(option.target),
        type: option.type === "control" ? "control" : "conversation",
        scopeLane: option.scopeLane || "objective",
        scopeStage: option.scopeStage || inferScopeStage(option.target)
      };
    }).filter(function (option) {
      return !!option.target;
    });

    return cleanOptions.slice(0, MAX_GATE_OPTIONS);
  }

  function shapeGateHandoffs(handoffs) {
    return normalizeHandoffs(handoffs);
  }

  function defaultGateOptions(target) {
    var clean = normalizeTarget(target);

    if (clean === "returnFork" || clean === "recenterNode" || clean === "loopRecovery" || clean === "cleanDoor" || clean === "switchTopics") {
      return [
        option("Frame the proof path.", "lawsPath"),
        option("Frame Mirrorland.", "mirrorlandPath"),
        option("Begin the Character path.", "charactersPath"),
        option("Frame Frontier.", "frontierPath"),
        option("Frame the creator path.", "seanPath")
      ];
    }

    if (clean === "sharpQuestion") {
      return [
        option("Frame Hearth Mission Control.", "hearthPath"),
        option("Frame Mirrorland.", "mirrorlandPath"),
        option("Frame the proof path.", "lawsPath"),
        option("Begin the Character path.", "charactersPath")
      ];
    }

    return [
      option("Frame Hearth Mission Control.", "hearthPath"),
      option("Frame Mirrorland.", "mirrorlandPath"),
      option("Begin the Character path.", "charactersPath"),
      option("Frame the proof path.", "lawsPath"),
      option("Frame the creator path.", "seanPath")
    ];
  }

  function option(label, target, type) {
    var cleanTarget = normalizeTarget(target);

    return {
      label: sanitizeConversationLabel(label || CONVERSATION_LABELS[cleanTarget] || "Tell me more.", cleanTarget),
      target: cleanTarget,
      type: type || "conversation",
      scopeLane: isNarrativeTarget(cleanTarget) ? "narrative" : "objective",
      scopeStage: inferScopeStage(cleanTarget)
    };
  }

  function sanitizeConversationLabel(label, target) {
    var cleanTarget = normalizeTarget(target || "");
    var clean = sanitizePublicText(label || "");
    var fallback = CONVERSATION_LABELS[cleanTarget] || makeTellMeLabel(cleanTarget);

    if (!clean) clean = fallback;

    if (DIRECT_ROUTE_PREFIX.test(clean)) {
      clean = fallback;
    }

    if (!CONVERSATION_PREFIX.test(clean) && !QUESTION_PREFIX.test(clean)) {
      clean = fallback;
    }

    return sanitizePublicText(clean);
  }

  function normalizeTarget(target) {
    var clean = String(target || "").trim();
    return TARGET_ALIASES[clean] || clean;
  }

  function isEntryGateTarget(target) {
    return !!ENTRY_GATE_TARGETS[normalizeTarget(target)];
  }

  function isNarrativeTarget(target) {
    var clean = normalizeTarget(target);

    return [
      "mirrorlandPath",
      "atriumPath",
      "atlasPath",
      "charactersPath",
      "characterIdentityPath",
      "hearthPath",
      "hearthFacilityPath",
      "hearthConstructPath",
      "hearthFrontierPath",
      "audraliaPath",
      "audraliaWorldroomPath",
      "hEarthPath",
      "ziontsPath",
      "frontierPath",
      "frontierSystemsPath",
      "frontierEnergyPath",
      "frontierWaterPath",
      "frontierWastePath",
      "frontierClosedLoopPath",
      "frontierInfrastructurePath",
      "frontierLatticePath",
      "frontierUrbanPath",
      "frontierManualPath",
      "frontierShimmerPath",
      "frontierTrajectoryPath",
      "frontierVisionPath",
      "mirrorMePath",
      "characterRelationshipsPath",
      "characterTensionsPath",
      "characterMotivesPath",
      "characterStoryPressurePath",
      "characterFirstPath",
      "characterAurenValePath",
      "characterDextrionPath",
      "characterAlaricPath",
      "characterTarianPath",
      "characterElaraPath",
      "characterSorenPath",
      "characterJeevesPath",
      "characterRemoteTeamPath"
    ].indexOf(clean) !== -1;
  }

  function inferScopeStage(target) {
    var clean = normalizeTarget(target);

    if (clean === "intro" || clean === "whereToStart" || clean === "returnFork" || clean === "recenterNode") return "orientation";
    if (clean === "characterIdentityPath" || clean === "frontierSystemsPath" || clean === "atlasPath") return "structure";
    if (clean === "characterFirstPath" || clean === "cleanDoor") return "entry";
    if (/EnergyPath$|WaterPath$|WastePath$|TheoryPath$|EvidencePath$|MeasurePath$|LimitsPath$/.test(clean)) return "profile";
    if (/RelationshipsPath$|TensionsPath$|MotivesPath$|StoryPressurePath$/.test(clean)) return "relationship";
    if (/Archetype|Diagnostic|selfLearning/.test(clean)) return "reflection";
    return "orientation";
  }

  function makeTellMeLabel(target) {
    var clean = normalizeTarget(target);
    if (CONVERSATION_LABELS[clean]) return CONVERSATION_LABELS[clean];
    return "Tell me about " + titleFromKey(clean) + ".";
  }

  function titleFromKey(key) {
    return String(key || "")
      .replace(/Path$/g, "")
      .replace(/([A-Z])/g, " $1")
      .replace(/[-_]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/^./, function (char) {
        return char.toUpperCase();
      });
  }

  function expose() {
    window.HEARTH = window.HEARTH || {};
    window.HEARTH.JEEVES = window.HEARTH.JEEVES || {};

    var api = {
      contract: CONTRACT,
      CONTRACT: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      role: "training_wheels_fork_manager",
      authority: "entry_fork_reset_only",
      shapeConversationFrame: shapeConversationFrame,
      shapeOptions: shapeOptions,
      shapeRouteLabel: shapeRouteLabel,
      sanitizePublicText: sanitizePublicText,
      shouldUseTrainingWheels: shouldUseTrainingWheels
    };

    window.HEARTH.JEEVES.expression = api;
    window.HEARTH.JEEVES_EXPRESSION = api;
    window.JEEVES_EXPRESSION = api;
    window.__HEARTH_JEEVES_EXPRESSION_LOADED__ = true;
    window.__HEARTH_JEEVES_EXPRESSION_CONTRACT__ = CONTRACT;
  }

  expose();
})();
