/** 
 * h-earth.state.js
 *
 * DGB H-Earth Scratch Rebuild
 * Room 2 — Manifest / State / Receipts Lane
 *
 * Purpose:
 * Defines bounded H-Earth scratch rebuild state constants and the first
 * state-transition plan.
 *
 * Boundary:
 * This is a GitHub-ready raw source body only.
 * It is not installed, executed, route-wired, renderer-wired, or validated
 * by this packet.
 */

export const H_EARTH_STATE = Object.freeze({
  H_EARTH_GROUND_VIEW_ACTIVE: 'H_EARTH_GROUND_VIEW_ACTIVE',
  H_EARTH_SURFACE_INSPECTION_ACTIVE: 'H_EARTH_SURFACE_INSPECTION_ACTIVE'
});

export const H_EARTH_STATE_TRANSITIONS = Object.freeze({
  inspectGround: Object.freeze({
    transitionId: 'H_EARTH_INSPECT_GROUND_STATE_TRANSITION',
    fromState: H_EARTH_STATE.H_EARTH_GROUND_VIEW_ACTIVE,
    toState: H_EARTH_STATE.H_EARTH_SURFACE_INSPECTION_ACTIVE,

    triggeringAction: 'Inspect Ground',
    outputReadout: 'Ground Condition Read',
    outputReceipt: 'H_EARTH_GROUND_INSPECTION_RECEIPT',

    activeCell: 'H_EARTH_GROUND_CELL_001',
    sceneIdentity: 'earth-water-air-survival-shoreline-manor',

    boundary: Object.freeze({
      runtimeStateExecutionClaim: false,
      rendererStateActivationClaim: false,
      validationStateActivationClaim: false,
      openWorldStateActivationClaim: false,
      survivalStateActivationClaim: false,
      routeIntegrationClaim: false,
      githubInstallationClaim: false,
      matrixCollapse: false
    })
  })
});
