import {
  H_EARTH_GROUND_VIEW_GATE_B_PACKET_002_ADAPTER_CONTRACT_ID,
  buildHEarthGroundViewGateBPacket002Transfer
} from './render/ground-view-gate-b-packet-002-adapter.js';

export const H_EARTH_GATE_B_ROUTE_INPUT_CONTRACT_ID =
  'H_EARTH_GATE_B_ROUTE_INPUT_BRIDGE_CANDIDATE_v1';

function deepFreeze(value, seen = new WeakSet()) {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value)) return value;
  if (seen.has(value)) return value;
  seen.add(value);
  for (const nested of Object.values(value)) deepFreeze(nested, seen);
  return Object.freeze(value);
}

export function buildHEarthGateBRouteInput(options = {}) {
  const token = options.occurrenceToken ?? `${Date.now()}`;
  const adapterResult = buildHEarthGroundViewGateBPacket002Transfer({
    occurrenceToken: token,
    requestId: options.requestId ?? `H_EARTH_GATE_B_ROUTE_REQUEST:${token}`,
    frameId: options.frameId ?? `H_EARTH_GATE_B_ROUTE_FRAME:${token}`
  });

  if (adapterResult.valid !== true || adapterResult.packet002Transfer?.ok !== true) {
    const error = new Error('Gate B route-input bridge could not produce a lawful Packet 002 transfer.');
    error.name = 'HEarthGateBRouteInputRejectedError';
    error.details = adapterResult.packet002Transfer?.issues ?? [];
    throw error;
  }

  return deepFreeze({
    valid: true,
    contractId: H_EARTH_GATE_B_ROUTE_INPUT_CONTRACT_ID,
    adapterContractId: H_EARTH_GROUND_VIEW_GATE_B_PACKET_002_ADAPTER_CONTRACT_ID,
    packet002Transfer: adapterResult.packet002Transfer,
    packet002TransferOccurrenceId:
      options.packet002TransferOccurrenceId ?? `H_EARTH_GATE_B_PACKET_002_OCCURRENCE:${token}`,
    compositorFrameOccurrenceId:
      options.compositorFrameOccurrenceId ?? `H_EARTH_GATE_B_COMPOSITOR_FRAME_OCCURRENCE:${token}`,
    providerConstructionReceipt: adapterResult.construction.receipt,
    provenance: adapterResult.provenance,
    admittedFrameCompatibility: 'REQUIRES_GATE_B_PROVENANCE_AND_PRESENTATION_RENEWAL',
    routeIntegrated: false,
    rendererMaterialized: false,
    validationClaim: false,
    productionClaim: false
  });
}
