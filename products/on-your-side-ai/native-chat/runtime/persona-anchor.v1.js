const DEFAULT_VOICE_URL = "/assets/hearth/jeeves/jeeves.voice.js";
const EXPECTED_VOICE_BLOB = "ebfb51804946d0afbb3f2145029480f803bdd655";
const EXPECTED_CONTRACT = "DIAMOND_GATE_BRIDGE_JEEVES_ELEVATOR_PITCH_ROUTING_VOICE_TNT_v2";

export function createPersonaAnchor({
  voiceUrl = DEFAULT_VOICE_URL,
  expectedVoiceBlob = EXPECTED_VOICE_BLOB
} = {}) {
  let voice = null;
  let loading = null;

  async function ensureReady() {
    if (voice) return voice;
    if (!loading) {
      loading = import(voiceUrl).then(() => {
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
    interfaceId: "DG_PERSONA_ANCHOR_v1",
    voiceUrl,
    expectedVoiceBlob,
    speakerLabel() {
      return "Jeeves · On Your Side";
    },
    async ensureReady() {
      return await ensureReady();
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
        "The persona may shape expression and handoff, but it may not change source facts, evidentiary standing, tool permissions, or claim ceilings."
      ].join(" ");
    },
    holdMessage() {
      return "I cannot verify that against current sources right now, so I will not guess. Live evidence is unavailable for this request.";
    }
  });
}
