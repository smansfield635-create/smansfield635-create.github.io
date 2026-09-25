# H-Earth Variant B / B2 Durable Recovery Handoff v1

Status: ACTIVE RECOVERY AUTHORITY
Mode: READ-ONLY RECOVERY / NON-DRIFT
Production mutation authority: NONE
Deployment authority: NONE

## Purpose

Preserve the exact H-Earth development state required to resume B2 visual inspection without reconstructing the environment, inventing a renderer, or routing candidate inspection through production GitHub Pages.

## Recovered authority

PR #4614 — H-Earth: durable Variant B 38df744b inspection snapshot

Branch:
h-earth/durable-variant-b-38df744b-v1

Head at recovery:
b8b1caab0de51ae05ac83b29d44c505b26833dc7

PR contract:
The repository already materializes the browser-verified Variant-B owner-inspection workspace under the durable preview tree. It preserves the live-target-Y compositor and the exact H-Earth dependency tree. It creates no production H-Earth mutation.

Variant B / B0 is the fixed observer baseline.

## B2 construction state

The intended B2 candidate is the Variant-B environment with exactly one logical substitution:

h-earth.terrain-field.js -> B2 terrain-field candidate

No camera, observer, renderer, compositor, water, atmosphere, vegetation, material, control-plane, or production mutation belongs in this comparison.

A prior handoff identified the B2 candidate by prefix:

d9b3c159...

Do not guess or reconstruct the full SHA if it is not directly recoverable. Resolve it from repository chronology/tree evidence before any mutation or deployment.

## Immutable comparison law

B0 / Variant B:
same world
same observer
same renderer
same camera
same compositor
same dependency tree

B2:
B0 plus B2 h-earth.terrain-field.js only.

Any additional logical substitution invalidates the B0/B2 comparison.

## Development roadmap lock

B0 — fixed observer baseline.
B1 — macro morphology.
B2 — meso morphology: secondary ridges/spurs, gullies, saddles/passes, drainage cuts, talus/cliff/soil transitions, foothill breakup.
B3 — microgeometry/material coupling.
B4 — terrain LOD/continuity and residual refinement.
B5 — fixed-camera terrain acceptance.

After terrain lock:
water -> atmosphere/lighting -> ecology/vegetation -> weather/clouds -> integrated climate/environment.

Phase-2B material work and Phase-3 residual/LOD work must not be pulled into the B2 cycle.

## Current repository boundary

The repository already owns:
1. durable Variant-B preview tree;
2. candidate code/tree state;
3. historical direct-inspection machinery capable of serving H-Earth inside an Actions runner.

The repository does NOT currently own a durable non-production remote browser host.

Historical serving paths were:
- 127.0.0.1 inside Actions runners; or
- GitHub Pages, which is production and is prohibited for candidate inspection.

Therefore another YAML-only serving harness is not a durable remote-preview solution.

## Missing external authority

Required once, separately from production:

A dedicated non-production preview deployment target/provider connected to this repository.

The target must support:

candidate SHA
-> immutable preview tree
-> preview deployment
-> stable non-production URL
-> deployment receipt

Credentials/connection must be available to GitHub Actions or another authorized repository execution surface.

The preview target MUST NOT publish to diamondgatebridge.com or the production GitHub Pages surface.

## Resume protocol

When a new room/session resumes this work:

1. Read PR #4614 and this handoff first.
2. Do not create another renderer, capture harness, local-only preview architecture, or Pages workaround.
3. Resolve the exact B2 candidate/full SHA from repository evidence if necessary.
4. Verify B2 differs from Variant B only by h-earth.terrain-field.js.
5. If a non-production preview host is connected, bind the existing immutable preview tree to it and emit a receipt containing candidate SHA, deployed tree identity, provider deployment identity, stable preview URL, and productionMutation=false.
6. Materialize B0 and B2 under identical observer/camera conditions.
7. Evaluate B2 only for meso-morphology improvement.
8. Keep production untouched until candidate acceptance.

## B2 visual acceptance

B2 advances only if the fixed Variant-B observer shows materially improved:
- secondary ridge/spur structure;
- valley and drainage readability;
- saddles/passes;
- cliff-to-slope transitions;
- foothill breakup;
- depth and terrain scale;
- reduction of smooth/cartoon-like masses;

while preserving B1 macro geography.

## Explicit holds

HOLD:
- production publication;
- GitHub Pages candidate publication;
- camera/observer changes;
- renderer/compositor changes;
- Phase-2B material retuning;
- Phase-3 residual/LOD integration;
- water/atmosphere/vegetation changes;
- invented preview infrastructure without an actual non-production host.

## Deterministic next action

Connect or identify a dedicated non-production preview deployment target already available to the repository. Then bind PR #4614's durable preview tree to that target and use B2 as the first immutable candidate deployment.

If no such target is available, stop at this boundary. The repository state is durable; the missing component is external non-production hosting authority.
