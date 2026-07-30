export const PACKET_SCHEMA = 'H_EARTH_CP2_MEASURED_SIGNATURE_PERCEPTUAL_CORRESPONDENCE_PACKET_v1';

const FNV_OFFSET = 0x811c9dc5;
const FNV_PRIME = 0x01000193;

export function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonicalize(value[key])]));
  }
  return value;
}

export function canonicalJSONString(value) {
  return JSON.stringify(canonicalize(value));
}

export function fnv1a32Text(value) {
  let hash = FNV_OFFSET;
  for (const byte of new TextEncoder().encode(String(value))) {
    hash ^= byte;
    hash = Math.imul(hash, FNV_PRIME) >>> 0;
  }
  return `fnv1a32:${hash.toString(16).padStart(8, '0')}`;
}

function compactMetric(metric) {
  if (!metric) return null;
  return {
    sceneScore: metric.sceneScore,
    dominantBand: metric.dominantBand,
    dominantOrientationDegrees: metric.dominantOrientationDegrees,
    dominantLagPixels: metric.dominantLagPixels,
    peakStrength: metric.peakStrength,
    eligiblePixelCount: metric.eligiblePixelCount,
    eligibleFraction: metric.eligibleFraction,
    bands: Object.fromEntries(['micro', 'meso', 'macro'].map((key) => [key, {
      peakStrength: metric.bands?.[key]?.peakStrength,
      signedCorrelation: metric.bands?.[key]?.signedCorrelation,
      dominantOrientationDegrees: metric.bands?.[key]?.dominantOrientationDegrees,
      dominantLagPixels: metric.bands?.[key]?.dominantLagPixels,
      pairCount: metric.bands?.[key]?.pairCount
    }]))
  };
}

export function buildPerceptualCorrespondencePacket({ records, sceneRecords, atlasDigests, sourceHead }) {
  const sceneRecordMap = sceneRecords instanceof Map ? sceneRecords : new Map(Object.entries(sceneRecords ?? {}));
  const scenes = records.map((record) => {
    const rendered = sceneRecordMap.get(record.sceneId);
    if (!rendered) throw new Error(`TERRAIN_WORKBENCH_RENDER_RECORD_REQUIRED:${record.sceneId}`);
    return {
      sceneId: record.sceneId,
      scene: rendered.scene,
      userClassification: record.classification,
      markedRegionNormalized: record.markedRegion,
      distractionScore: record.distractionScore,
      visibleReference: record.visibleReference,
      selectedDiagnosticPass: record.selectedDiagnosticPass,
      selectedMaterialFamilyAblation: record.selectedMaterialFamily,
      metricSignature: compactMetric(rendered.passes?.G?.metric),
      references: {
        acceptedCp2: {
          pass: 'H',
          frameHash: rendered.passes?.H?.frameHash,
          depthMaskHash: rendered.passes?.H?.depthMaskHash,
          officialFrameEquivalent: rendered.passes?.H?.officialFrameEquivalent,
          officialDepthEquivalent: rendered.passes?.H?.officialDepthEquivalent
        },
        flatLighting: {
          pass: 'G',
          frameHash: rendered.passes?.G?.frameHash,
          depthMaskHash: rendered.passes?.G?.depthMaskHash
        },
        selectedAblation: {
          pass: record.selectedMaterialFamily,
          frameHash: rendered.passes?.[record.selectedMaterialFamily]?.frameHash,
          depthMaskHash: rendered.passes?.[record.selectedMaterialFamily]?.depthMaskHash,
          metric: compactMetric(rendered.passes?.[record.selectedMaterialFamily]?.metric)
        }
      }
    };
  });

  const packetBody = {
    schemaVersion: PACKET_SCHEMA,
    operation: 'H_EARTH_TERRAIN_INTELLIGENCE_AND_PERCEPTUAL_WORKBENCH_v1',
    class: 'INTERNAL_AUTHORING_DIAGNOSTIC_AND_USER_COMPARISON_TOOL',
    sourceHead: sourceHead || null,
    authority: {
      acceptedLiveProduct: 'CP2',
      productCandidateAuthorized: false,
      liveCandidateAuthorized: false,
      liveHEarthMutation: false,
      acceptedCP2Mutation: false,
      rejectedCandidatePromotion: false
    },
    fixedGates: {
      b1BaselineDigest: atlasDigests.b1,
      b2ProtectionDigest: atlasDigests.b2,
      cp2HFrameEquivalence: '8_OF_8',
      cp2DepthEquivalence: '8_OF_8',
      diagnosticPasses: 'A_THROUGH_H',
      materialFamilyAblations: '7_OF_7',
      deterministicExport: true,
      liveHostChanged: false,
      liveBindingChanged: false,
      acceptedRendererChanged: false,
      publicHEarthRouteChanged: false
    },
    sceneCount: scenes.length,
    scenes
  };
  const canonicalBody = canonicalJSONString(packetBody);
  return canonicalize({ ...packetBody, canonicalPacketDigest: fnv1a32Text(canonicalBody) });
}

export function serializePerceptualCorrespondencePacket(packet) {
  return `${JSON.stringify(canonicalize(packet), null, 2)}\n`;
}

export function downloadPerceptualCorrespondencePacket(packet, fileName = 'H_EARTH_CP2_MEASURED_SIGNATURE_PERCEPTUAL_CORRESPONDENCE_PACKET_v1.json') {
  const blob = new Blob([serializePerceptualCorrespondencePacket(packet)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
