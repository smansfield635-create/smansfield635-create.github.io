// /api/jeeves.js
// HEARTH_JEEVES_SERVER_BRAIN_MEMORY_MODERATION_MODEL_BRIDGE_API_TNT_v1
// Full-file creation.
// Server-side only.
// Owns secure model bridge, approved memory retrieval, moderation gates, canon enforcement, controlled generative responses, and approved options/handoffs.
// Does not own front-end DOM, CSS, HTML, browser API keys, route rendering, visual pacing, or final route authority.

"use strict";

const CONTRACT = "HEARTH_JEEVES_SERVER_BRAIN_MEMORY_MODERATION_MODEL_BRIDGE_API_TNT_v1";

const DEFAULT_MODEL = process.env.JEEVES_MODEL || "gpt-5.5";
const MODERATION_MODEL = process.env.JEEVES_MODERATION_MODEL || "omni-moderation-latest";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
const ALLOWED_ORIGIN = process.env.JEEVES_ALLOWED_ORIGIN || "";
const MAX_INPUT_CHARS = 1800;
const MAX_CONTEXT_ITEMS = 8;
const MAX_BUBBLES = 4;
const MAX_OPTIONS = 5;
const MAX_HANDOFFS = 4;

const FORBIDDEN_PUBLIC_LANGUAGE = [
  { pattern: /\bconstruct\b/gi, replacement: "work" },
  { pattern: /\bscope lane\b/gi, replacement: "path" },
  { pattern: /\bregistry\b/gi, replacement: "guide" },
  { pattern: /\borgan\b/gi, replacement: "part" },
  { pattern: /\bengine\b/gi, replacement: "system" },
  { pattern: /\broute lane\b/gi, replacement: "path" },
  { pattern: /\barchitecture layer\b/gi, replacement: "structure" },
  { pattern: /\bexpression payload\b/gi, replacement: "answer" },
  { pattern: /\bprogression state\b/gi, replacement: "step" },
  { pattern: /\bbackend bridge\b/gi, replacement: "deeper answer path" },
  { pattern: /\bAPI\b/g, replacement: "answer path" },
  { pattern: /\bpublic human-voice side\b/gi, replacement: "place where the voice becomes human" }
];

const APPROVED_ROUTE_IDS = new Set([
  "compass",
  "home",
  "siteGuide",
  "coherenceDiagnostic",
  "meetSean",
  "products",
  "laws",
  "gauges",
  "showroom",
  "hearth",
  "globeWindow",
  "interactiveNarrative",
  "mirrorland",
  "audralia",
  "frontier",
  "characters",
  "controlRoom",
  "book",
  "nineSummits",
  "aboutUnderdog"
]);

const APPROVED_TARGETS = new Set([
  "intro",
  "askFirst",
  "websitePath",
  "skepticPlain",
  "proofPath",
  "diagnosticPath",
  "worldPath",
  "worldGatePath",
  "charactersPath",
  "compassPath",
  "whereToStart",
  "siteGuidePath",
  "lawsPath",
  "gaugesPath",
  "seanPath",
  "underdogPath",
  "productsPath",
  "bookPath",
  "nineSummitsPath",
  "hearthPath",
  "audraliaPath",
  "frontierPath",
  "futureProfilePath",
  "mirrorMePath",
  "characterIdentityPath",
  "characterRelationshipsPath",
  "characterTensionsPath",
  "characterMotivesPath",
  "characterFactionsPath",
  "characterStoryPressurePath",
  "characterFirstPath",
  "recenterNode",
  "loopRecovery",
  "cleanDoor",
  "returnFork",
  "restartFork"
]);

const DEFAULT_CONVERSATION_LABELS = {
  websitePath: "Guide me through the public website.",
  skepticPlain: "Explain it plainly.",
  proofPath: "Tell me what proves it.",
  diagnosticPath: "Tell me about the Diagnostic.",
  worldPath: "Tell me about the world side.",
  worldGatePath: "Tell me about the Interactive Narrative.",
  charactersPath: "Who are the characters?",
  compassPath: "I need the Compass.",
  siteGuidePath: "Tell me how the site is organized.",
  lawsPath: "Explain the Laws.",
  gaugesPath: "Explain Gauges.",
  seanPath: "Tell me about Sean.",
  underdogPath: "Tell me about This Underdog.",
  productsPath: "Tell me about Products.",
  bookPath: "Tell me about the book path.",
  nineSummitsPath: "Tell me about Nine Summits.",
  hearthPath: "I want to understand Hearth.",
  audraliaPath: "Tell me about Audralia.",
  frontierPath: "What is Frontier?",
  futureProfilePath: "What is Future Profile?",
  mirrorMePath: "What is Mirror Me?",
  characterIdentityPath: "Who are the characters?",
  characterRelationshipsPath: "How do the characters relate?",
  characterTensionsPath: "What conflict do they carry?",
  characterMotivesPath: "What motivates them?",
  characterFactionsPath: "Are there sides or factions?",
  characterStoryPressurePath: "Why should I care about the characters?",
  characterFirstPath: "Who should I meet first?",
  recenterNode: "Re-center me.",
  loopRecovery: "I keep circling this route.",
  cleanDoor: "Give me the cleanest next route.",
  returnFork: "Bring me back to the doorway."
};

const DEFAULT_HANDOFF_LABELS = {
  compass: "Start at the Compass",
  home: "Open the Public Entry",
  siteGuide: "Open the Site Guide",
  coherenceDiagnostic: "Take the Coherence Diagnostic",
  meetSean: "Meet Sean Mansfield",
  products: "Open Products",
  laws: "Read the Laws",
  gauges: "Open Gauges",
  showroom: "Open the Showroom",
  hearth: "Return to Hearth",
  globeWindow: "Open the World Gate",
  interactiveNarrative: "Enter the Interactive Narrative",
  mirrorland: "Open Mirrorland",
  audralia: "Visit Audralia",
  frontier: "Explore Frontier",
  characters: "Meet the Characters",
  controlRoom: "Open the Control Room",
  book: "Open The Nine Summits of Love",
  nineSummits: "Open Nine Summits",
  aboutUnderdog: "About This Underdog"
};

const APPROVED_MEMORY = [
  {
    id: "diamondGateBridge",
    scope: "objective",
    keywords: ["diamond gate bridge", "website", "site", "what is this", "public", "structure", "start"],
    routes: ["compass", "siteGuide", "laws", "coherenceDiagnostic", "products"],
    targets: ["websitePath", "proofPath", "diagnosticPath", "productsPath", "worldPath"],
    summary:
      "Diamond Gate Bridge is the public work: website, proof path, human voice, diagnostic tools, products, and world doorway. The visitor does not need the whole map first; they need the right door."
  },
  {
    id: "compass",
    scope: "objective",
    keywords: ["compass", "orientation", "where to start", "start", "lost", "begin"],
    routes: ["compass", "siteGuide"],
    targets: ["compassPath", "siteGuidePath", "proofPath", "diagnosticPath", "worldPath"],
    summary:
      "The Compass is the cleanest public orientation point. It helps visitors choose between proof, self-reflection, practical use, human voice, and the world door."
  },
  {
    id: "siteGuide",
    scope: "objective",
    keywords: ["site guide", "map", "organized", "pages", "rooms", "guide"],
    routes: ["siteGuide", "showroom"],
    targets: ["siteGuidePath", "websitePath", "worldPath"],
    summary:
      "The Site Guide is the public map. It separates ordinary website pages from deeper doors and helps visitors distinguish public structure from world threshold."
  },
  {
    id: "laws",
    scope: "objective",
    keywords: ["laws", "proof", "testable", "claims", "real", "evidence", "skeptic"],
    routes: ["laws", "gauges", "coherenceDiagnostic", "meetSean"],
    targets: ["lawsPath", "gaugesPath", "diagnosticPath", "seanPath"],
    summary:
      "The Laws page is where Diamond Gate Bridge makes claims testable. It is for visitors who want proof before giving the world side trust."
  },
  {
    id: "gauges",
    scope: "objective",
    keywords: ["gauges", "status", "technical", "working", "tested", "checks"],
    routes: ["gauges", "laws"],
    targets: ["gaugesPath", "lawsPath", "diagnosticPath"],
    summary:
      "Gauges are the status route. They show whether site paths, worlds, and systems are holding instead of only describing what they should become."
  },
  {
    id: "diagnostic",
    scope: "objective",
    keywords: ["diagnostic", "coherence", "self", "mirror", "reflection", "pressure", "claim", "choice"],
    routes: ["coherenceDiagnostic", "laws"],
    targets: ["diagnosticPath", "futureProfilePath", "mirrorMePath", "lawsPath"],
    summary:
      "The Diagnostic is the public mirror path. It helps a visitor notice the difference between what they claim, what they choose, and what pressure reveals."
  },
  {
    id: "meetSean",
    scope: "objective",
    keywords: ["sean", "person", "founder", "human", "behind", "voice", "who made"],
    routes: ["meetSean", "aboutUnderdog", "book", "nineSummits"],
    targets: ["seanPath", "underdogPath", "bookPath", "productsPath"],
    summary:
      "Meet Sean is where the voice becomes a person. It connects the work to pressure, accountability, comedy, story, speaking, and real human effort behind Diamond Gate Bridge."
  },
  {
    id: "thisUnderdog",
    scope: "objective",
    keywords: ["this underdog", "underdog", "inner voice", "voice", "pressure", "comedy", "becoming", "language"],
    routes: ["aboutUnderdog", "meetSean", "coherenceDiagnostic", "book"],
    targets: ["underdogPath", "seanPath", "diagnosticPath", "bookPath"],
    summary:
      "This Underdog is the inner voice that has carried pressure before it found language. It is the part of a person that knows something is there but has not yet learned how to stand up, speak clearly, or become useful. It lives near comedy, pressure, story, voice, and becoming."
  },
  {
    id: "products",
    scope: "objective",
    keywords: ["products", "use", "practical", "buy", "wear", "read", "gift"],
    routes: ["products", "book", "coherenceDiagnostic"],
    targets: ["productsPath", "bookPath", "diagnosticPath", "seanPath"],
    summary:
      "Products are for visitors who do not want only ideas. They are for people who want something they can use, wear, read, give, or return to."
  },
  {
    id: "book",
    scope: "objective",
    keywords: ["book", "nine summits of love", "love", "written", "read"],
    routes: ["book", "nineSummits", "meetSean"],
    targets: ["bookPath", "nineSummitsPath", "underdogPath", "seanPath"],
    summary:
      "The Nine Summits of Love is the book path. It turns pressure, voice, coherence, and becoming into a human-development journey."
  },
  {
    id: "nineSummits",
    scope: "objective",
    keywords: ["nine summits", "summits", "human development", "potential", "seminar", "love"],
    routes: ["book", "nineSummits", "meetSean"],
    targets: ["nineSummitsPath", "bookPath", "diagnosticPath", "seanPath"],
    summary:
      "Nine Summits is where the work becomes a broader path for human potential. It concerns what a person is becoming through pressure, love, voice, and coherence."
  },
  {
    id: "showroomThreshold",
    scope: "threshold",
    keywords: ["showroom", "threshold", "door", "crossing", "world side", "mirrorland"],
    routes: ["showroom", "interactiveNarrative", "siteGuide"],
    targets: ["worldPath", "worldGatePath", "siteGuidePath", "hearthPath"],
    summary:
      "The Showroom is the threshold. The public map is still visible there, but the world side begins to press against it."
  },
  {
    id: "interactiveNarrative",
    scope: "narrative",
    keywords: ["interactive narrative", "enter", "story", "world gate", "world", "gate"],
    routes: ["interactiveNarrative", "showroom", "hearth", "characters", "audralia"],
    targets: ["worldGatePath", "hearthPath", "charactersPath", "audraliaPath", "worldPath"],
    summary:
      "The Interactive Narrative is the first active doorway into the world side. It is where the visitor stops only reading and begins moving through the structure."
  },
  {
    id: "mirrorland",
    scope: "narrative",
    keywords: ["mirrorland", "world side", "rooms", "choices", "reflection"],
    routes: ["interactiveNarrative", "characters", "hearth"],
    targets: ["worldPath", "hearthPath", "charactersPath", "mirrorMePath"],
    summary:
      "Mirrorland is the world side of Diamond Gate Bridge. It is where pressure, reflection, characters, rooms, and choices begin to behave like a place instead of only a page."
  },
  {
    id: "hearth",
    scope: "narrative",
    keywords: ["hearth", "room", "closest", "house", "inside"],
    routes: ["hearth", "interactiveNarrative", "audralia"],
    targets: ["hearthPath", "worldGatePath", "audraliaPath", "charactersPath"],
    summary:
      "Hearth is the closest room to where Jeeves speaks from. If the world feels too wide, begin there."
  },
  {
    id: "audralia",
    scope: "narrative",
    keywords: ["audralia", "not australia", "beyond", "world", "outward"],
    routes: ["audralia", "frontier", "hearth"],
    targets: ["audraliaPath", "frontierPath", "hearthPath", "worldGatePath"],
    summary:
      "Audralia is farther out. It is where the world begins to widen beyond the first threshold."
  },
  {
    id: "frontier",
    scope: "narrative",
    keywords: ["frontier", "edge", "discovery", "beyond", "outward"],
    routes: ["frontier", "audralia", "interactiveNarrative"],
    targets: ["frontierPath", "audraliaPath", "worldGatePath"],
    summary:
      "Frontier is the outward edge. It is where the world starts pointing beyond its first rooms and toward discovery."
  },
  {
    id: "characters",
    scope: "character",
    keywords: ["characters", "people", "who lives", "inhabited", "dossiers"],
    routes: ["characters", "interactiveNarrative", "mirrorland"],
    targets: ["charactersPath", "characterIdentityPath", "characterRelationshipsPath", "characterTensionsPath", "mirrorMePath"],
    summary:
      "The characters are where the world stops feeling empty. They are not menu labels; they are the people who make pressure, consequence, choice, and story personal."
  },
  {
    id: "characterRelationships",
    scope: "character",
    keywords: ["relationships", "relate", "connection", "between", "ties", "social"],
    routes: ["characters", "interactiveNarrative"],
    targets: ["characterRelationshipsPath", "characterMotivesPath", "characterTensionsPath", "characterFactionsPath", "characterFirstPath"],
    summary:
      "Character relationships are pressure lines. One character can reveal what another refuses to face, carry memory another tries to bury, or become the consequence of a choice made too late."
  },
  {
    id: "characterTensions",
    scope: "character",
    keywords: ["tension", "conflict", "fight", "pressure", "consequence", "denial"],
    routes: ["characters", "interactiveNarrative"],
    targets: ["characterTensionsPath", "characterMotivesPath", "characterFactionsPath", "characterStoryPressurePath"],
    summary:
      "Character conflict is not only good against evil. It is memory against denial, survival against consequence, voice against silence, and choice against pressure."
  },
  {
    id: "characterMotives",
    scope: "character",
    keywords: ["motives", "motivation", "want", "desire", "why"],
    routes: ["characters", "interactiveNarrative"],
    targets: ["characterMotivesPath", "characterRelationshipsPath", "characterFactionsPath", "characterStoryPressurePath"],
    summary:
      "Character motives are read through pressure. A character may want safety, recognition, escape, control, repair, truth, or a second chance."
  },
  {
    id: "characterFactions",
    scope: "character",
    keywords: ["factions", "sides", "alliance", "group", "team"],
    routes: ["characters", "interactiveNarrative"],
    targets: ["characterFactionsPath", "characterStoryPressurePath", "characterRelationshipsPath", "characterFirstPath"],
    summary:
      "A faction in this world should be more than a team; it should be a pressure pattern. Some forces preserve memory, some protect denial, some chase survival, and some want control over the crossing itself."
  },
  {
    id: "mirrorMe",
    scope: "narrative",
    keywords: ["mirror me", "reflection", "look back", "future", "profile"],
    routes: ["coherenceDiagnostic", "interactiveNarrative", "characters"],
    targets: ["mirrorMePath", "diagnosticPath", "futureProfilePath", "charactersPath"],
    summary:
      "Mirror Me is the narrative reflection path. It should not replace the public Diagnostic. It begins where the mirror becomes part of the world."
  }
];

const RESPONSE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["bubbles", "options", "handoffs", "confidence", "needsRecenter"],
  properties: {
    bubbles: {
      type: "array",
      minItems: 1,
      maxItems: 4,
      items: { type: "string", maxLength: 320 }
    },
    options: {
      type: "array",
      maxItems: 5,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["label", "target", "type", "scopeLane"],
        properties: {
          label: { type: "string", maxLength: 90 },
          target: { type: "string", maxLength: 80 },
          type: { type: "string", enum: ["conversation", "topic", "calibration", "back", "control"] },
          scopeLane: { type: "string", enum: ["objective", "narrative"] }
        }
      }
    },
    handoffs: {
      type: "array",
      maxItems: 4,
      items: { type: "string", maxLength: 80 }
    },
    confidence: { type: "string", enum: ["high", "medium", "low"] },
    needsRecenter: { type: "boolean" }
  }
};

const rateBucket = new Map();

async function handler(req, res) {
  setCorsHeaders(req, res);

  if (req.method === "OPTIONS") {
    sendJson(res, 204, {});
    return;
  }

  if (req.method !== "POST") {
    sendJson(res, 405, {
      ok: false,
      contract: CONTRACT,
      error: "METHOD_NOT_ALLOWED"
    });
    return;
  }

  try {
    if (!rateLimit(req)) {
      sendJson(res, 429, {
        ok: false,
        contract: CONTRACT,
        error: "RATE_LIMITED",
        bubbles: ["I need to slow this doorway down for a moment."],
        options: defaultRecenterOptions(),
        handoffs: ["compass"]
      });
      return;
    }

    const payload = await readJsonBody(req);
    const normalized = normalizePayload(payload);
    const localSafety = localModerationCheck(normalized.visitorText);

    if (!localSafety.allowed) {
      sendJson(res, 200, safeResponse({
        ok: true,
        source: "local_moderation",
        safety: {
          input: {
            checked: true,
            allowed: false,
            flagged: true,
            reason: localSafety.reason
          },
          output: {
            checked: false,
            allowed: true,
            flagged: false
          }
        },
        bubbles: [
          "I cannot take that path.",
          "I can re-center you to the public map, the proof path, or the Diagnostic."
        ],
        options: defaultRecenterOptions(),
        handoffs: ["compass", "laws", "coherenceDiagnostic"]
      }, normalized));
      return;
    }

    const memory = retrieveApprovedMemory(normalized);
    const allowed = buildAllowedSets(normalized, memory);

    if (!OPENAI_API_KEY) {
      sendJson(res, 200, safeResponse({
        ok: true,
        source: "deterministic_fallback",
        safety: {
          input: {
            checked: false,
            allowed: true,
            flagged: false,
            reason: "OPENAI_API_KEY_NOT_CONFIGURED"
          },
          output: {
            checked: false,
            allowed: true,
            flagged: false
          }
        },
        bubbles: deterministicFallbackBubbles(normalized, memory),
        options: deterministicFallbackOptions(normalized, memory, allowed),
        handoffs: deterministicFallbackHandoffs(memory, allowed),
        usedMemory: memory.map((item) => item.id)
      }, normalized));
      return;
    }

    const inputModeration = await moderateText(normalized.visitorText);

    if (inputModeration.flagged) {
      sendJson(res, 200, safeResponse({
        ok: true,
        source: "input_moderation",
        safety: {
          input: {
            checked: true,
            allowed: false,
            flagged: true,
            reason: inputModeration.reason || "MODERATION_FLAGGED"
          },
          output: {
            checked: false,
            allowed: true,
            flagged: false
          }
        },
        bubbles: [
          "I cannot take that path.",
          "I can bring you back to a safe public route."
        ],
        options: defaultRecenterOptions(),
        handoffs: ["compass", "siteGuide", "laws"]
      }, normalized));
      return;
    }

    const modelResult = await callModel(normalized, memory, allowed);
    const modelResponse = normalizeModelResponse(modelResult, normalized, memory, allowed);
    const outputText = modelResponse.bubbles.join("\n");
    const outputModeration = await moderateText(outputText);

    if (outputModeration.flagged) {
      sendJson(res, 200, safeResponse({
        ok: true,
        source: "output_moderation_fallback",
        safety: {
          input: {
            checked: true,
            allowed: true,
            flagged: false
          },
          output: {
            checked: true,
            allowed: false,
            flagged: true,
            reason: outputModeration.reason || "OUTPUT_MODERATION_FLAGGED"
          }
        },
        bubbles: deterministicFallbackBubbles(normalized, memory),
        options: deterministicFallbackOptions(normalized, memory, allowed),
        handoffs: deterministicFallbackHandoffs(memory, allowed),
        usedMemory: memory.map((item) => item.id)
      }, normalized));
      return;
    }

    sendJson(res, 200, safeResponse({
      ok: true,
      source: "model_bridge",
      safety: {
        input: {
          checked: true,
          allowed: true,
          flagged: false
        },
        output: {
          checked: true,
          allowed: true,
          flagged: false
        }
      },
      bubbles: modelResponse.bubbles,
      options: modelResponse.options,
      handoffs: modelResponse.handoffs,
      confidence: modelResponse.confidence,
      needsRecenter: modelResponse.needsRecenter,
      usedMemory: memory.map((item) => item.id)
    }, normalized));
  } catch (error) {
    sendJson(res, 500, {
      ok: false,
      contract: CONTRACT,
      error: "JEEVES_SERVER_BRAIN_ERROR",
      message: safeErrorMessage(error),
      bubbles: [
        "The deeper answer path did not respond cleanly.",
        "I can still bring you back to the public doorway."
      ],
      options: defaultRecenterOptions(),
      handoffs: ["compass", "siteGuide"]
    });
  }
}

function setCorsHeaders(req, res) {
  const requestOrigin = req.headers && req.headers.origin ? String(req.headers.origin) : "";
  const allowOrigin = ALLOWED_ORIGIN || requestOrigin || "*";

  res.setHeader("Access-Control-Allow-Origin", allowOrigin);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Content-Type", "application/json; charset=utf-8");
}

function sendJson(res, status, data) {
  res.statusCode = status;
  if (typeof res.status === "function") {
    res.status(status);
  }

  const body = JSON.stringify(data);

  if (typeof res.json === "function") {
    res.json(data);
    return;
  }

  res.end(body);
}

async function readJsonBody(req) {
  if (req.body && typeof req.body === "object") {
    return req.body;
  }

  if (typeof req.body === "string") {
    return JSON.parse(req.body || "{}");
  }

  const chunks = [];

  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  if (!chunks.length) return {};
  return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
}

function normalizePayload(payload) {
  const raw = payload && typeof payload === "object" ? payload : {};
  const visitorText = capString(
    raw.visitorText || raw.message || raw.query || raw.text || "",
    MAX_INPUT_CHARS
  );

  return {
    visitorText,
    currentNode: capString(raw.currentNode || "", 120),
    currentEntry: capString(raw.currentEntry || raw.entry || "", 120),
    currentPath: capString(raw.currentPath || raw.path || "", 80),
    currentScopeLane: normalizeScope(raw.currentScopeLane || raw.scopeLane),
    currentVoiceMode: capString(raw.currentVoiceMode || raw.voiceMode || "", 80),
    visitorPosture: capString(raw.visitorPosture || "", 120),
    movement: capString(raw.movement || "", 80),
    pathDepth: safeNumber(raw.pathDepth, 0),
    routeReadiness: safeNumber(raw.routeReadiness, 0),
    allowedTargets: normalizeList(raw.allowedTargets).filter((target) => APPROVED_TARGETS.has(target)),
    allowedRoutes: normalizeList(raw.allowedRoutes).filter((route) => APPROVED_ROUTE_IDS.has(route)),
    sessionTrail: normalizeList(raw.sessionTrail).slice(-12),
    requestedMode: capString(raw.requestedMode || "", 80),
    registryContext: sanitizeExternalRegistryContext(raw.registryContext)
  };
}

function normalizeScope(value) {
  if (value === "narrative") return "narrative";
  return "objective";
}

function normalizeList(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => capString(item, 120))
    .filter(Boolean);
}

function sanitizeExternalRegistryContext(value) {
  if (!value || typeof value !== "object") return null;

  return {
    id: capString(value.id || value.entry || "", 120),
    summary: capString(value.summary || value.answer || value.description || "", 900),
    routes: normalizeList(value.routes).filter((route) => APPROVED_ROUTE_IDS.has(route)).slice(0, MAX_HANDOFFS),
    targets: normalizeList(value.targets).filter((target) => APPROVED_TARGETS.has(target)).slice(0, MAX_OPTIONS)
  };
}

function safeNumber(value, fallback) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function capString(value, max) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

function rateLimit(req) {
  const ip = getClientIp(req);
  const now = Date.now();
  const windowMs = 60 * 1000;
  const limit = Number(process.env.JEEVES_RATE_LIMIT_PER_MINUTE || 60);
  const bucket = rateBucket.get(ip) || { started: now, count: 0 };

  if (now - bucket.started > windowMs) {
    bucket.started = now;
    bucket.count = 0;
  }

  bucket.count += 1;
  rateBucket.set(ip, bucket);

  return bucket.count <= limit;
}

function getClientIp(req) {
  const forwarded = req.headers && req.headers["x-forwarded-for"];
  if (forwarded) return String(forwarded).split(",")[0].trim();
  return (req.socket && req.socket.remoteAddress) || "unknown";
}

function localModerationCheck(text) {
  const value = String(text || "").toLowerCase();

  const blockedPatterns = [
    { pattern: /\b(api[_-\s]?key|secret[_-\s]?key|token)\b/i, reason: "SECRET_EXTRACTION_REQUEST" },
    { pattern: /\b(ignore previous|ignore all instructions|jailbreak|system prompt)\b/i, reason: "PROMPT_INJECTION" },
    { pattern: /\b(self[-\s]?harm|kill myself|suicide)\b/i, reason: "SELF_HARM_SIGNAL" },
    { pattern: /\b(exploit|malware|phishing|steal password|credential theft)\b/i, reason: "CYBER_ABUSE_SIGNAL" }
  ];

  for (const item of blockedPatterns) {
    if (item.pattern.test(value)) {
      return { allowed: false, reason: item.reason };
    }
  }

  return { allowed: true, reason: "" };
}

async function moderateText(text) {
  if (!OPENAI_API_KEY || !text) {
    return { checked: false, flagged: false, reason: "" };
  }

  try {
    const response = await fetch("https://api.openai.com/v1/moderations", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + OPENAI_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: MODERATION_MODEL,
        input: text
      })
    });

    if (!response.ok) {
      return { checked: false, flagged: false, reason: "MODERATION_UNAVAILABLE" };
    }

    const data = await response.json();
    const result = data && data.results && data.results[0] ? data.results[0] : {};
    const categories = result.categories || {};
    const flaggedCategories = Object.keys(categories).filter((key) => categories[key]);

    return {
      checked: true,
      flagged: Boolean(result.flagged),
      reason: flaggedCategories.join(",")
    };
  } catch (_error) {
    return { checked: false, flagged: false, reason: "MODERATION_ERROR" };
  }
}

function retrieveApprovedMemory(ctx) {
  const text = [
    ctx.visitorText,
    ctx.currentNode,
    ctx.currentEntry,
    ctx.currentPath,
    ctx.visitorPosture,
    ctx.movement,
    ctx.sessionTrail.join(" "),
    ctx.registryContext ? ctx.registryContext.summary : ""
  ].join(" ").toLowerCase();

  const scored = APPROVED_MEMORY.map((item) => {
    let score = 0;

    if (ctx.currentEntry && ctx.currentEntry.toLowerCase() === item.id.toLowerCase()) score += 8;
    if (ctx.currentPath && item.keywords.includes(ctx.currentPath.toLowerCase())) score += 3;
    if (ctx.currentScopeLane === "narrative" && (item.scope === "narrative" || item.scope === "character")) score += 1;
    if (ctx.currentScopeLane === "objective" && item.scope === "objective") score += 1;

    item.keywords.forEach((keyword) => {
      if (text.includes(keyword.toLowerCase())) score += 2;
    });

    if (text.includes(item.id.toLowerCase())) score += 4;

    return { item, score };
  })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_CONTEXT_ITEMS)
    .map((entry) => entry.item);

  if (ctx.registryContext && ctx.registryContext.summary) {
    scored.unshift({
      id: ctx.registryContext.id || "frontEndRegistryContext",
      scope: ctx.currentScopeLane,
      keywords: [],
      routes: ctx.registryContext.routes || [],
      targets: ctx.registryContext.targets || [],
      summary: ctx.registryContext.summary
    });
  }

  if (!scored.length) {
    return [
      APPROVED_MEMORY.find((item) => item.id === "diamondGateBridge"),
      APPROVED_MEMORY.find((item) => item.id === "compass")
    ].filter(Boolean);
  }

  return dedupeMemory(scored).slice(0, MAX_CONTEXT_ITEMS);
}

function dedupeMemory(items) {
  const seen = new Set();
  const result = [];

  items.forEach((item) => {
    if (!item || !item.id || seen.has(item.id)) return;
    seen.add(item.id);
    result.push(item);
  });

  return result;
}

function buildAllowedSets(ctx, memory) {
  const routeSet = new Set(ctx.allowedRoutes || []);
  const targetSet = new Set(ctx.allowedTargets || []);

  memory.forEach((item) => {
    (item.routes || []).forEach((route) => {
      if (APPROVED_ROUTE_IDS.has(route)) routeSet.add(route);
    });

    (item.targets || []).forEach((target) => {
      if (APPROVED_TARGETS.has(target)) targetSet.add(target);
    });
  });

  if (!targetSet.size) {
    ["websitePath", "proofPath", "diagnosticPath", "worldPath", "returnFork"].forEach((target) => targetSet.add(target));
  }

  if (!routeSet.size) {
    ["compass", "siteGuide"].forEach((route) => routeSet.add(route));
  }

  return { routeSet, targetSet };
}

async function callModel(ctx, memory, allowed) {
  const systemPrompt = buildSystemPrompt();
  const userPrompt = buildUserPrompt(ctx, memory, allowed);

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + OPENAI_API_KEY,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: DEFAULT_MODEL,
      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text: systemPrompt
            }
          ]
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: userPrompt
            }
          ]
        }
      ],
      text: {
        format: {
          type: "json_schema",
          name: "jeeves_brain_response",
          strict: true,
          schema: RESPONSE_SCHEMA
        },
        verbosity: "low"
      },
      max_output_tokens: 900
    })
  });

  if (!response.ok) {
    const errorText = await safeReadText(response);
    throw new Error("OPENAI_RESPONSE_ERROR: " + errorText.slice(0, 500));
  }

  const data = await response.json();
  const text = extractResponseText(data);
  return parseModelJson(text);
}

function buildSystemPrompt() {
  return [
    "You are Jeeves, the governed house intelligence for Diamond Gate Bridge.",
    "You are not an uncontrolled chatbot.",
    "You answer only from approved memory supplied in the request.",
    "You may explain, clarify, personalize, and deepen, but you may not invent canon, pages, routes, characters, or facts.",
    "You must satisfy the visitor's actual itch before routing.",
    "You must use visitor-facing language, not internal architecture language.",
    "Forbidden public words and phrases include: construct, registry, scope lane, organ, engine, route lane, architecture layer, expression payload, progression state, backend bridge, API, public human-voice side.",
    "Conversation options must sound like things a visitor says to Jeeves. Use labels such as 'Tell me about Audralia' or 'How do the characters relate?'",
    "Action labels like 'Visit Audralia' or 'Open Products' belong only to handoffs, not conversation options.",
    "You must return JSON only, following the required schema.",
    "Keep bubbles concise. Use 2 to 4 bubbles when the visitor asks a deeper meaning question.",
    "If unsure, re-center the visitor rather than inventing."
  ].join("\n");
}

function buildUserPrompt(ctx, memory, allowed) {
  return JSON.stringify({
    task: "Generate a safe Jeeves response.",
    visitor: {
      text: ctx.visitorText,
      currentNode: ctx.currentNode,
      currentEntry: ctx.currentEntry,
      currentPath: ctx.currentPath,
      currentScopeLane: ctx.currentScopeLane,
      currentVoiceMode: ctx.currentVoiceMode,
      visitorPosture: ctx.visitorPosture,
      movement: ctx.movement,
      pathDepth: ctx.pathDepth,
      routeReadiness: ctx.routeReadiness,
      sessionTrail: ctx.sessionTrail
    },
    approvedMemory: memory.map((item) => ({
      id: item.id,
      scope: item.scope,
      summary: item.summary,
      allowedRoutes: item.routes,
      allowedTargets: item.targets
    })),
    allowedConversationTargets: Array.from(allowed.targetSet),
    allowedRouteHandoffs: Array.from(allowed.routeSet),
    outputRules: {
      bubbles: "1 to 4 Jeeves-style response bubbles",
      options: "0 to 5 conversational options using allowedConversationTargets only",
      handoffs: "0 to 4 route IDs using allowedRouteHandoffs only",
      noMarkdown: true,
      noUnapprovedRoutes: true,
      noUnapprovedCanon: true
    }
  });
}

function extractResponseText(data) {
  if (!data) return "";

  if (typeof data.output_text === "string") {
    return data.output_text;
  }

  const parts = [];

  if (Array.isArray(data.output)) {
    data.output.forEach((item) => {
      if (!item || !Array.isArray(item.content)) return;
      item.content.forEach((content) => {
        if (!content) return;
        if (typeof content.text === "string") parts.push(content.text);
        if (typeof content.output_text === "string") parts.push(content.output_text);
      });
    });
  }

  return parts.join("\n").trim();
}

function parseModelJson(text) {
  const raw = String(text || "").trim();

  if (!raw) {
    throw new Error("EMPTY_MODEL_RESPONSE");
  }

  try {
    return JSON.parse(raw);
  } catch (_error) {
    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");

    if (start !== -1 && end !== -1 && end > start) {
      return JSON.parse(raw.slice(start, end + 1));
    }

    throw new Error("MODEL_RESPONSE_NOT_JSON");
  }
}

function normalizeModelResponse(modelResponse, ctx, memory, allowed) {
  const base = modelResponse && typeof modelResponse === "object" ? modelResponse : {};
  const bubbles = normalizeBubbles(base.bubbles, ctx, memory);
  const options = normalizeOptions(base.options, allowed);
  const handoffs = normalizeHandoffs(base.handoffs, allowed);

  return {
    bubbles,
    options: options.length ? options : deterministicFallbackOptions(ctx, memory, allowed),
    handoffs: handoffs.length ? handoffs : deterministicFallbackHandoffs(memory, allowed),
    confidence: ["high", "medium", "low"].includes(base.confidence) ? base.confidence : "medium",
    needsRecenter: Boolean(base.needsRecenter)
  };
}

function normalizeBubbles(value, ctx, memory) {
  let bubbles = Array.isArray(value) ? value : [];

  bubbles = bubbles
    .map((text) => sanitizePublicText(capString(text, 320)))
    .filter(Boolean)
    .slice(0, MAX_BUBBLES);

  if (!bubbles.length) {
    return deterministicFallbackBubbles(ctx, memory);
  }

  return bubbles;
}

function normalizeOptions(value, allowed) {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;

      const target = capString(item.target, 80);
      if (!APPROVED_TARGETS.has(target)) return null;
      if (!allowed.targetSet.has(target)) return null;

      let label = sanitizeOptionLabel(capString(item.label, 90), target);
      if (!label) label = DEFAULT_CONVERSATION_LABELS[target] || "Tell me more.";

      return {
        label,
        target,
        type: normalizeOptionType(item.type),
        scopeLane: normalizeScope(item.scopeLane)
      };
    })
    .filter(Boolean)
    .slice(0, MAX_OPTIONS);
}

function sanitizeOptionLabel(label, target) {
  const value = capString(label, 90);

  if (!value) return "";

  const actionLike = /^(visit|open|enter|explore|return to|take me to|go to|launch)\b/i.test(value);
  if (actionLike) {
    return DEFAULT_CONVERSATION_LABELS[target] || "";
  }

  return value;
}

function normalizeOptionType(type) {
  if (["conversation", "topic", "calibration", "back", "control"].includes(type)) return type;
  return "conversation";
}

function normalizeHandoffs(value, allowed) {
  if (!Array.isArray(value)) return [];

  return value
    .map((route) => capString(route, 80))
    .filter((route) => APPROVED_ROUTE_IDS.has(route))
    .filter((route) => allowed.routeSet.has(route))
    .slice(0, MAX_HANDOFFS);
}

function sanitizePublicText(text) {
  let clean = capString(text, 600);

  FORBIDDEN_PUBLIC_LANGUAGE.forEach((rule) => {
    clean = clean.replace(rule.pattern, rule.replacement);
  });

  clean = clean.replace(/```/g, "");
  return clean.trim();
}

function deterministicFallbackBubbles(ctx, memory) {
  const primary = memory && memory[0] ? memory[0] : null;

  if (primary) {
    if (primary.id === "thisUnderdog") {
      return [
        "This Underdog is the voice inside a person before it has found language.",
        "It carries pressure first. Then it has to learn how to stand up, speak clearly, and become useful."
      ];
    }

    if (primary.scope === "character") {
      return [
        "The characters are where the world stops feeling empty.",
        primary.summary
      ].map((line) => sanitizePublicText(line));
    }

    return [
      primary.summary,
      "I can keep explaining this, or point you to the door that matches it."
    ].map((line) => sanitizePublicText(line));
  }

  return [
    "I can answer from the approved map, but I should not invent a path.",
    "The cleanest move is to re-center at the public doorway."
  ];
}

function deterministicFallbackOptions(ctx, memory, allowed) {
  const preferredTargets = [];

  (memory || []).forEach((item) => {
    (item.targets || []).forEach((target) => {
      if (allowed.targetSet.has(target)) preferredTargets.push(target);
    });
  });

  if (!preferredTargets.length) {
    preferredTargets.push("websitePath", "proofPath", "diagnosticPath", "worldPath", "returnFork");
  }

  return Array.from(new Set(preferredTargets))
    .filter((target) => APPROVED_TARGETS.has(target))
    .slice(0, MAX_OPTIONS)
    .map((target) => ({
      label: DEFAULT_CONVERSATION_LABELS[target] || "Tell me more.",
      target,
      type: "conversation",
      scopeLane: isNarrativeTarget(target) ? "narrative" : "objective"
    }));
}

function deterministicFallbackHandoffs(memory, allowed) {
  const routes = [];

  (memory || []).forEach((item) => {
    (item.routes || []).forEach((route) => {
      if (allowed.routeSet.has(route)) routes.push(route);
    });
  });

  if (!routes.length) {
    routes.push("compass", "siteGuide");
  }

  return Array.from(new Set(routes))
    .filter((route) => APPROVED_ROUTE_IDS.has(route))
    .slice(0, MAX_HANDOFFS);
}

function defaultRecenterOptions() {
  return [
    { label: "Re-center me.", target: "recenterNode", type: "control", scopeLane: "objective" },
    { label: "I want proof.", target: "proofPath", type: "conversation", scopeLane: "objective" },
    { label: "I want the Diagnostic.", target: "diagnosticPath", type: "conversation", scopeLane: "objective" },
    { label: "I want the world side.", target: "worldPath", type: "conversation", scopeLane: "narrative" }
  ];
}

function safeResponse(data, ctx) {
  const allowed = buildAllowedSets(ctx || normalizePayload({}), []);
  const bubbles = normalizeBubbles(data.bubbles || [], ctx || {}, []);
  const options = normalizeOptions(data.options || [], allowed);
  const rawHandoffs = Array.isArray(data.handoffs) ? data.handoffs : [];
  const handoffs = rawHandoffs
    .map((route) => capString(route, 80))
    .filter((route) => APPROVED_ROUTE_IDS.has(route))
    .slice(0, MAX_HANDOFFS);

  return {
    ok: Boolean(data.ok),
    contract: CONTRACT,
    source: data.source || "server",
    safety: data.safety || {
      input: { checked: false, allowed: true, flagged: false },
      output: { checked: false, allowed: true, flagged: false }
    },
    bubbles,
    options: options.length ? options : defaultRecenterOptions(),
    handoffs: handoffs.length ? handoffs : ["compass"],
    confidence: data.confidence || "medium",
    needsRecenter: Boolean(data.needsRecenter),
    usedMemory: Array.isArray(data.usedMemory) ? data.usedMemory : [],
    routeAuthority: "front_end_remains_final_authority"
  };
}

function isNarrativeTarget(target) {
  return [
    "worldPath",
    "worldGatePath",
    "charactersPath",
    "hearthPath",
    "audraliaPath",
    "frontierPath",
    "mirrorMePath",
    "characterIdentityPath",
    "characterRelationshipsPath",
    "characterTensionsPath",
    "characterMotivesPath",
    "characterFactionsPath",
    "characterStoryPressurePath",
    "characterFirstPath"
  ].includes(target);
}

async function safeReadText(response) {
  try {
    return await response.text();
  } catch (_error) {
    return "";
  }
}

function safeErrorMessage(error) {
  return capString(error && error.message ? error.message : "Unknown server brain error.", 500);
}

if (typeof module !== "undefined") {
  module.exports = handler;
  module.exports.default = handler;
}
