const deepFreeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  for (const member of Object.values(value)) deepFreeze(member, seen);
  return Object.freeze(value);
};

export const H_EARTH_CP7G_CANDIDATE_CONSTRUCTION_CLOSURE_v1 = deepFreeze({
  schemaVersion: 'H_EARTH_CP7G_CANDIDATE_CONSTRUCTION_CLOSURE_v1',
  programCheckpoint: 7,
  boundedSubcheckpoint: '7G',
  status: 'ISOLATED_CANDIDATE_CONSTRUCTION_CLOSURE',
  authorityQuestion:
    'IS_THERE_ONE_COMPLETE_ISOLATED_CONTROL_FIELD_CANDIDATE_WITH_DURABLE_SOURCE_IDENTITY_SCOPE_EVIDENCE_AND_ROLLBACK_READY_FOR_CHECKPOINT_8_ENGINEERING_EXECUTION?',
  mergeChain: {
    checkpoint7A: '257e36def7c18794ea8382c231ba9f3bde3f29a2',
    checkpoint7B: '3548f442d4b44a788f4eb38e3034e0a462736857',
    checkpoint7C: 'dce2691c7444c99b7f0571b29472fc902dce53ab',
    checkpoint7D: 'b28a4fbedf4b88a593431d210269e0c195c09d35',
    checkpoint7E: '477a5bf825a7e9fd5200be7dbf54f0271276ed33',
    checkpoint7F: '628729f84abdb117bc3f01dfe14399be994919d9'
  },
  productIdentities: {
    acceptedRenderer: {
      path: 'showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-round1-1f520809.js',
      blob: 'de55609b0b0bd66601445a369c727ff7a6d7065d'
    },
    controlFieldGenerator: {
      path: 'showroom/globe/h-earth/render/terrain-control-field.cp2-round2.v1.js',
      blob: '95f33f67d83921425dc44b273cac74764855a626',
      canonicalControlFieldSha256: '177ec368222fccc9d5ccdd11702f9ac96602dcfd76728c63a43694d298e8a456'
    },
    isolatedCandidateRenderer: {
      path: 'showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-round2-control-field-candidate.js',
      blob: '021efe3d1d6d8b825b0474940166f47e499188e9',
      sourceSha256: '902e0f017ccfc8f5b5b01393f6b54eef36916b23d4764ea36a83afc9131f1965'
    },
    liveHost: {
      path: 'showroom/globe/h-earth/index.html',
      blob: 'd6f3441040062e91bf1070c76932d2f6b6349f4a'
    },
    liveBinding: {
      path: 'showroom/globe/h-earth/diagnostic/run8e-r3d/live-gpu-binding.js',
      blob: '5eb1b6f2e72ac0525f608850234182b2c646f66f'
    },
    frozenTerrain: {
      path: 'h-earth-3d/terrain/h-earth.successor-terrain-field.run8b.js',
      blob: '0bd36eec01a75311bf6441d575bae5a057195bbc'
    }
  },
  authorizedProductPathsAcrossCheckpoint7: [
    'showroom/globe/h-earth/render/terrain-control-field.cp2-round2.v1.js',
    'showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-round2-control-field-candidate.js'
  ],
  evidenceLedger: {
    checkpoint7A: { workflowRun: 30516094119, receiptSha256: '3543a726f4ecb3e14630643b0f534d7e7f52b81495cf0a25adeccef26b16a1d8', artifactId: 8748923490, artifactSha256: '49ba14ed6c1421dbb3d11ff67fa8c68e4d0ebee2263f480b0744df63ede5e8d5' },
    checkpoint7B: { workflowRun: 30516423439, receiptSha256: 'dc7c6cb5b2b83ed9abb280024111af5314c41cd779f2022dfbd84be16ed8d431', artifactId: 8749047631, artifactSha256: '4c02fa27618eb8010aa2dddbf0507093207aeee4c77eb503b8cf685f2996d793' },
    checkpoint7C: { workflowRun: 30516641998, receiptSha256: 'c3137de0b72673bcd624ab10f9b7ba7ab992352d3490ee70e7a115fa38a2b9d8', artifactId: 8749127094, artifactSha256: 'c852177da850d084b35c0613f67cea5beb0f2df1cc374605fb94989ed15316e0' },
    checkpoint7D: { workflowRun: 30516898763, receiptSha256: '32898c4d62c75f2b91346543cd7edf7245e788c68fe29660c976dd2d1fa06088', artifactId: 8749234307, artifactSha256: '1fcbe57e089b1bfe90b0b17bf5f7b954bfaee1831063e46ca0ba49ea9a1cca69' },
    checkpoint7E: { workflowRun: 30517439428, receiptSha256: 'a7ef586e7b28ab6616c264f89a3e73ff7f4e791714423b1662ea8d92a6408088', artifactId: 8749431209, artifactSha256: 'a8fcd3511fe7ece0dfe5d9c6496e4d658d564d8a3797665f6b6a233f70f6330f' },
    checkpoint7F: { workflowRun: 30517633736, receiptSha256: 'be51380a64654ab4ed2e7c1420286a1b632ead84b68ae3cc06643475918b69fd', artifactId: 8749489314, artifactSha256: 'f560fe5ea4e5988ea5d2712f87091d90f88b2a1e0cdc0d73ad3106c67ad6aba1' }
  },
  rollback: {
    liveRollbackRequired: false,
    reason: 'CANDIDATE_IS_NOT_BOUND_TO_THE_LIVE_ROUTE',
    acceptedLiveRendererRemainsCP2: true,
    constructionRollbackAnchor: 'b28a4fbedf4b88a593431d210269e0c195c09d35'
  },
  exactSubcheckpoint7GPathScope: [
    '.github/workflows/h-earth-cp7g-candidate-construction-closure.yml',
    'h-earth-3d/control-plane/post-cp2-round2/cp7/h-earth.cp7g-candidate-construction-closure.v1.mjs',
    'h-earth-3d/validation/cp7/h-earth.cp7g-candidate-construction-closure.mjs'
  ],
  closure: {
    checkpoint7Result: 'PASS_CLOSED',
    checkpoint8Authorized: true,
    engineeringPassDetermined: false,
    liveCandidateAvailable: false,
    liveRouteChanged: false,
    userDifferentialRequiredNow: false,
    stop: 'STOP_BEFORE_CHECKPOINT_8_FULL_ENGINEERING_EXECUTION'
  },
  result: 'CP7G_CANDIDATE_CONSTRUCTION_CLOSURE_PASS_CLOSED'
});

export default H_EARTH_CP7G_CANDIDATE_CONSTRUCTION_CLOSURE_v1;
