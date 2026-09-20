import { JEEVES_CHAMBER_BINDING, composeJeevesChamberInstruction } from "./jeeves-chamber-binding.v1.js";

const DEFAULT_VOICE_URL = "/assets/hearth/jeeves/jeeves.voice.js";
const EXPECTED_VOICE_BLOB = "ebfb51804946d0afbb3f2145029480f803bdd655";
const EXPECTED_CONTRACT = "DIAMOND_GATE_BRIDGE_JEEVES_ELEVATOR_PITCH_ROUTING_VOICE_TNT_v2";

function bindVoiceIdentity(voiceUrl, expectedVoiceBlob) {
  const separator = voiceUrl.includes("?") ? "&" : "?";
  return voiceUrl + separator + "v=" + expectedVoiceBlob;
}

function normalizeContextText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function classifyCanonicalContext(userTurn, conversationState = []) {
  const recent = conversationState.slice(-6).map(item => item?.content || "").join(" ");
  const text = normalizeContextText(userTurn + " " + recent).toLowerCase();
  const ids = [];
  const add = id => { if (!ids.includes(id)) ids.push(id); };
  if (/\bjeeves\b/.test(text)) add("jeeves");
  if (/\belara\b/.test(text)) add("elara");
  if (/\bauren\b/.test(text)) add("auren");
  if (/\bsoren\b/.test(text)) add("soren");
  if (/\b(character|characters|team|people|who (?:is|are)|relationship|relationships)\b/.test(text)) {
    ["jeeves", "elara", "auren", "soren"].forEach(add);
  }
  if (/\bmirrorland\b/.test(text)) add("elara");
  return ids;
}

export function createPersonaAnchor({
  voiceUrl = DEFAULT_VOICE_URL,
  expectedVoiceBlob = EXPECTED_VOICE_BLOB
} = {}) {
  let voice = null;
  let loading = null;
  const versionBoundVoiceUrl = bindVoiceIdentity(voiceUrl, expectedVoiceBlob);

  async function ensureReady() {
    if (voice) return voice;
    if (!loading) {
      loading = import(versionBoundVoiceUrl).then(() => {
        const candidate = window.JEEVES_VOICE;
        if (!candidate || typeof candidate !== "object") throw new Error("JEEVES_VOICE_NOT_LOADED");
        if (candidate.contract !== EXPECTED_CONTRACT) throw new Error("JEEVES_VOICE_CONTRACT_MISMATCH");
        if (candidate.identity?.name !== "Jeeves") throw new Error("JEEVES_IDENTITY_MISMATCH");
        if (candidate.identity?.role !== "Welcome and Routing Guide") throw new Error("JEEVES_ROLE_MISMATCH");
        voice = candidate;
        return voice;
      });
    }
    return await loading;
  }

  return Object.freeze({
    id: "JEEVES",
    chamberBindingId: JEEVES_CHAMBER_BINDING.id,
    interfaceId: "DG_PERSONA_ANCHOR_v1",
    voiceUrl,
    versionBoundVoiceUrl,
    expectedVoiceBlob,
    speakerLabel() {
      return "Jeeves · On Your Side";
    },
    async ensureReady() {
      return await ensureReady();
    },
    composeCanonicalContext(userTurn, conversationState = []) {
      if (!voice) throw new Error("JEEVES_PERSONA_NOT_READY");
      const selectedIds = classifyCanonicalContext(userTurn, conversationState);
      const selected = selectedIds
        .map(id => voice.getTeamMember?.(id))
        .filter(Boolean)
        .map(member => ({
          id: member.id,
          name: member.name,
          role: member.role,
          ownership: member.ownership,
          route: member.route || null
        }));
      const mirrorlandRelevant = /\bmirrorland\b/i.test(normalizeContextText(userTurn + " " + conversationState.slice(-6).map(item => item?.content || "").join(" ")));
      const pathways = mirrorlandRelevant
        ? ["elara", "showroom"].map(id => voice.getPathway?.(id)).filter(Boolean).map(pathway => ({
            id: pathway.id,
            context: pathway.context,
            title: pathway.title,
            description: pathway.description,
            voiceLine: pathway.voiceLine
          }))
        : [];
      const context = {
        authority: voice.contract,
        selectionLaw: "Existing canon only. Do not invent missing characters, relationships, biography, roles, routes, or Mirrorland facts.",
        team: selected,
        pathways
      };
      return Object.freeze({
        sourceIds: Object.freeze([
          ...(selected.length ? ["JEEVES_VOICE.team"] : []),
          ...(pathways.length ? ["JEEVES_VOICE.pathways"] : [])
        ]),
        selectedIds: Object.freeze(selectedIds.slice()),
        text: "Canonical context: " + JSON.stringify(context)
      });
    },
    composeSystemMessage(baseSystemMessage) {
      if (!voice) throw new Error("JEEVES_PERSONA_NOT_READY");
      const identity = voice.identity;
      return [
        baseSystemMessage,
        "You are speaking through " + identity.name + ", Diamond Gate Bridge's " + identity.role + ".",
        "Public role: " + identity.publicSurface + ".",
        "Expression law: " + identity.expressionLaw,
        "Boundary law: " + identity.boundaryLaw,
        "Hospitality law: " + identity.hospitalityLaw,
        "The persona may shape expression and handoff, but it may not change source facts, evidentiary standing, tool permissions, or claim ceilings.",
        composeJeevesChamberInstruction()
      ].join(" ");
    },
    holdMessage() {
      return "I cannot verify that against current sources right now, so I will not guess. Live evidence is unavailable for this request.";
    }
  });
}
