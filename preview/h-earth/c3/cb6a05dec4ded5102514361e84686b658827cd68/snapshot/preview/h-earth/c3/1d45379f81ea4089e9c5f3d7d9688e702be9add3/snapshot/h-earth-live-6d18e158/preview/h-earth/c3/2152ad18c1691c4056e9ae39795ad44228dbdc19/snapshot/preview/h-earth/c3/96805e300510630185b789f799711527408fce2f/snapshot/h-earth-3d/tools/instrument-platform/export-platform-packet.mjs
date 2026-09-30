import { canonicalDigest, clone, deepFreeze, stableStringify } from './platform-core.mjs';

export function buildInstrumentPlatformPacket({ projectContext, toolRegistry, sceneRegistry, sessionLedger, authorityState, candidateAssembly = null, terminalReceipts = [] }) {
  const body = {
    schemaVersion: 'H_EARTH_INSTRUMENT_PLATFORM_PACKET_v1',
    platformId: 'H_EARTH_INSTRUMENT_PLATFORM_v1',
    projectContext: clone(projectContext),
    toolRegistry: clone(toolRegistry),
    sceneRegistry: clone(sceneRegistry),
    sessionLedger: clone(sessionLedger),
    authorityState,
    candidateAssembly: clone(candidateAssembly),
    terminalReceipts: clone(terminalReceipts),
    boundaries: {
      liveHEarthMutationPerformed: false,
      acceptedCP2MutationPerformed: false,
      rejectedCandidatePromotionPerformed: false,
      userDifferentialMayNotBeAutomated: true,
      defaultPromotionRemainsSeparate: true
    }
  };
  return deepFreeze({ ...body, canonicalPacketDigest: canonicalDigest(body) });
}

export function serializeInstrumentPlatformPacket(packet, indentation = 2) {
  const { canonicalPacketDigest, ...body } = clone(packet);
  if (canonicalDigest(body) !== canonicalPacketDigest) throw new Error('INSTRUMENT_PLATFORM_PACKET_DIGEST_MISMATCH');
  return `${stableStringify(packet, indentation)}\n`;
}

export function downloadInstrumentPlatformPacket(packet) {
  const blob = new Blob([serializeInstrumentPlatformPacket(packet)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `H_EARTH_INSTRUMENT_PLATFORM_PACKET_${packet.canonicalPacketDigest.replace(':', '_')}.json`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 0);
}
