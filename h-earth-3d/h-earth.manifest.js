/**
 * h-earth.manifest.js
 *
 * DGB H-Earth Scratch Rebuild
 * Room 2 — Manifest / State / Receipts Lane
 *
 * Purpose:
 * Defines the canonical H-Earth scratch rebuild manifest.
 *
 * Boundary:
 * This is a GitHub-ready raw source body only.
 * It is not installed by this packet.
 * It is not wired to a public route.
 * It is not executed by this packet.
 * It does not activate runtime, renderer, canvas, WebGL, visual pass,
 * validation, open-world traversal, survival simulation, production,
 * manor interior, distant traversal, or matrix collapse.
 */

export const H_EARTH_MANIFEST = Object.freeze({
  project: 'DGB_H_EARTH_SCRATCH_REBUILD',
  matrix: 'H-Earth',
  matrixRole: 'Ground-View Matrix',

  canonicalManifestSymbol: 'H_EARTH_MANIFEST',
  compatibilityAliasSymbol: 'HEARTH_MANIFEST',
  compatibilityAliasOnly: true,

  activeCell: 'H_EARTH_GROUND_CELL_001',
  sceneIdentity: 'earth-water-air-survival-shoreline-manor',

  firstAction: 'Inspect Ground',
  firstReadout: 'Ground Condition Read',
  firstActionReceipt: 'H_EARTH_GROUND_INSPECTION_RECEIPT',
  harnessReceipt: 'H_EARTH_NON_RENDERING_TEST_HARNESS_RECEIPT',

  matrixSeparation: Object.freeze({
    hEarth: 'Ground-View Matrix',
    hearth: 'support/control context only',
    audralia: 'planetary-world context only',
    matrixCollapse: false
  }),

  deferredClaims: Object.freeze({
    githubInstallationAuthorized: false,
    publicRouteIntegrationAuthorized: false,
    runtimeActivationAuthorized: false,
    rendererActivationAuthorized: false,
    canvasActivationAuthorized: false,
    webglActivationAuthorized: false,
    visualPassClaim: false,
    validationClaimUpgrade: false,
    productionDeploymentClaim: false,
    openWorldExpansionAuthorized: false,
    survivalSimulationAuthorized: false,
    manorInteriorAuthorized: false,
    distantTraversalAuthorized: false
  })
});

/**
 * Compatibility-only alias.
 *
 * HEARTH_MANIFEST must not be treated as the canonical H-Earth symbol.
 * Canonical usage must reference H_EARTH_MANIFEST.
 */
export const HEARTH_MANIFEST = H_EARTH_MANIFEST;
