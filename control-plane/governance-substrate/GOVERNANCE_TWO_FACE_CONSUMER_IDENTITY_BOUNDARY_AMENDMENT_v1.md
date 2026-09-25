# Governance Two-Face Construction — Consumer Identity Boundary Amendment v1

Status: FROZEN BOUNDED AMENDMENT
Parent: GOVERNANCE_TWO_FACE_PRESENTATION_COLOR_CONSTRUCTION_CONTRACT_v1
Candidate PR: #4877
Trigger: STATIC_ASSET_IDENTITY_GATE_v1 -> STALE_ASSET_IDENTITY_BLOCKED

## Proven dependency

The changed Governance browser assets require fresh request identities at both actual consumers:
- /index.html
- /governance-bridge/governance/index.html

The diagnostic lookup /assets/compass/index.html does not exist and is not a consumer.

## Amended bounded mutation surface

Existing authorized presentation assets:
- assets/compass/compass.governance-platform.js
- assets/compass/compass.governance-platform.css

Newly authorized consumer files:
- index.html
- governance-bridge/governance/index.html

Within the two HTML consumers, ONLY the query identity on references to compass.governance-platform.js and compass.governance-platform.css may change.

Fresh common identity:
governance-panel-v10

No other HTML, navigation, topology, presentation semantics, runtime logic, catalog, control-plane, or authority mutation is authorized.

## Required requalification

After the identity repair:
1. Static Asset Identity Gate must pass.
2. Catalog identity/topology must remain unchanged.
3. Browser interaction/render qualification must execute against the fresh candidate.
4. Merge remains held until required qualification passes.

NEXT AUTHORIZED STEP = APPLY_FRESH_GOVERNANCE_ASSET_IDENTITY_AND_REQUALIFY
