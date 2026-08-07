# F5 — Navigation and Continuity

`METHODS_MODELS_INTEGRATED_ENVIRONMENT_CONSTRUCTION_v1`

F5 binds deterministic movement, deep-linking, reload restoration, browser-history semantics, exact return, and entry-point addressing to the already frozen F2/F3/F4 state and content architecture.

F5 does not create scientific meaning. It does not infer scientific state from a URL, route, visual location, route popularity, or browser history.

## Governing distinction

`NAVIGATION_MAY_CHANGE_LOCATION_BUT_MAY_NOT_CHANGE_SCIENTIFIC_MEANING`

Two different operations are therefore kept separate:

1. **Navigation mutation** — movement within an already loaded state may mutate `ROUTE_HISTORY` only and must pass the frozen F3 `NAVIGATION` transition validator.
2. **Exact state restoration / deterministic entry** — a deep link, reload, back, forward, or exact return restores a previously canonicalized state snapshot. Restoration is not permission to derive a new scientific state from the current one.

Cross-object traversal is not bundled merely because multiple F4 objects exist. It requires an upstream declared semantic relation. F5 ships with no bundled cross-object semantic relations and fails closed when one is absent.

## Canonical link form

The frozen Methods route remains:

`/laws/research/methods-and-models/`

F5 uses a fragment-only navigation capsule so the existing server route is not changed:

`/laws/research/methods-and-models/#mmnav1.<base64url-canonical-capsule>.<sha256-capsule>`

The capsule contains the exact F3 canonical state bytes and their digest. Reload, back/forward, and direct entry restore those bytes and re-run F3 exact restoration.

## Return context

The CP6 minimum return fields remain mandatory. F5 additionally carries the exact origin-state bytes and digest so return can restore the declared origin rather than approximate it.

`ORIGIN_DEPTH` is preserved as an opaque token only. F5 does not define depth semantics; that remains reserved for F6.

## Stop boundary

No public page mutation, visual construction, spatial topology, geometry, F6 depth system, or scientific claim upgrade is authorized by F5.
