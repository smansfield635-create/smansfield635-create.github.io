# H-Earth Renderer Corridor Gate

Contract: `H_EARTH_RENDERER_CORRIDOR_INTEGRATION_HARNESS_v1`

## Controlling rule

```text
IMPORT_PASS ≠ RENDERER_CONSTRUCTION_PASS ≠ RENDERER_MOUNT_PASS ≠ DEPLOYED_ROUTE_PASS
```

No H-Earth renderer change is complete until each state has independent executable evidence.

## Pull-request gate

GitHub Actions workflow:

```text
.github/workflows/h-earth-renderer-corridor-integration.yml
```

Stable check name:

```text
H-Earth Renderer Corridor Gate
```

The workflow starts an isolated local HTTP occurrence from the checked-out pull-request commit and loads the actual production route:

```text
/showroom/globe/h-earth/index.html
```

It does not substitute fixture modules for the production graph. It executes the current route entry, Packet 002 construction, West-admitted transfer, admitted-frame construction, compositor handoff, renderer clipping/projection, DOM/CSS materialization, and mount.

The exact production Packet 002 identity is required:

```text
OBJ_002_FOREGROUND_WET_SAND
OBJ_005_SHORELINE_FOAM_LINE
OBJ_007_WATER_SURFACE_PLANE
```

The route must produce exactly three admitted source primitives.

The same production corridor is executed at these representative browser surfaces:

| Profile | Viewport | DPR |
|---|---:|---:|
| Small mobile portrait | 360 × 800 | 2 |
| Large mobile portrait | 430 × 932 | 3 |
| Tablet portrait | 820 × 1180 | 2 |
| Desktop landscape | 1440 × 900 | 1 |
| Large desktop landscape | 1920 × 1080 | 2 |

Every profile must independently establish all of the following:

- the production module graph loaded without a required request failure or import rejection;
- the exact three-object Packet 002 occurrence was preserved;
- renderer construction succeeded;
- renderer mount succeeded;
- route status became `PUBLIC_STAGE_RENDERER_MOUNTED`;
- the descriptor fallback was not restored;
- admitted, projected, structural, and physical DOM counts were recorded separately;
- projection-receipt and materialized-fragment counts correspond;
- all stage-specific budgets passed;
- the exact Packet 002 transfer occurrence, compositor-frame occurrence, revisions, viewport, camera/projection context, clipping totals, construction result, and mount result were recorded.

The workflow fails when any profile fails. It uploads deterministic per-profile receipts and one aggregate receipt.

## Stage-specific capacity law

Gate-owned enforcement module:

```text
/tools/h-earth-renderer-corridor-capacity-law.mjs
```

This test-governance law does not claim production runtime authority. It measures the production corridor and defines three non-interchangeable gate budgets:

```text
ADMITTED_PRIMITIVE_BUDGET
PROJECTED_FRAGMENT_BUDGET
FINAL_DOM_NODE_BUDGET
```

`ADMITTED_PRIMITIVE_BUDGET` counts post-West source primitives before renderer clipping.

`PROJECTED_FRAGMENT_BUDGET` counts renderer projection descriptors after depth and viewport-frustum clipping. One admitted primitive may produce more than one projected fragment.

`FINAL_DOM_NODE_BUDGET` counts physical descendants owned by the mounted renderer, including renderer infrastructure, semantic containers, the interaction boundary, and projected-fragment nodes.

The physical accounting identity is:

```text
FINAL_RENDERER_DOM_NODES =
  RENDERER_INFRASTRUCTURE_NODES
  + SEMANTIC_CONTAINERS
  + INTERACTION_NODES
  + PROJECTED_FRAGMENT_NODES
```

The gate rejects count substitution between stages.

## Deterministic receipts

Local pull-request artifacts:

```text
artifacts/h-earth-renderer-corridor/<PROFILE>.receipt.json
artifacts/h-earth-renderer-corridor/aggregate.receipt.json
```

Receipts use sorted-key canonicalization and include `deterministicReceiptSha256`. Runtime occurrence identities remain exact observations and are not replaced with stable aliases.

## Post-merge deployed-route probe

GitHub Actions workflow:

```text
.github/workflows/h-earth-deployed-route-smoke-probe.yml
```

Stable check name:

```text
H-Earth Deployed Route Pass
```

The workflow runs after relevant pushes to `main` and may also be dispatched manually. It loads:

```text
https://diamondgatebridge.com/showroom/globe/h-earth/
```

Each attempt uses a fresh Chromium context, empty cookies, explicit no-cache headers, and a commit-bound cache-busting query. The probe retries boundedly to distinguish deployment lag from a durable deployed-route failure.

It catches branch/deployment differences including:

- deployment lag;
- stale CDN or browser cache occurrence;
- missing deployed files;
- wrong MIME or HTTP response;
- import rejection in the public occurrence;
- renderer construction failure;
- renderer mount failure;
- fallback restoration;
- capacity divergence between branch and deployed occurrences.

Deployed artifacts:

```text
artifacts/h-earth-deployed-route-smoke/attempt-<N>.receipt.json
artifacts/h-earth-deployed-route-smoke/aggregate.receipt.json
```

## Required-check configuration

The workflow runs automatically on every relevant pull request. To make merge blocking enforceable at the repository-policy layer, add the stable check name `H-Earth Renderer Corridor Gate` to the `main` branch ruleset or branch-protection required status checks. The deployed-route check is post-merge evidence and should not be used as a pre-merge substitute.
