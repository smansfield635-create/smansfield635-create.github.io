# Methods Spatial Template Operator Guide

## Scope and safety boundary

This directory is the nonproduct executable vertical slice for:

```text
METHODS_MODELS_CATEGORICAL_SPATIAL_TEMPLATE_VERTICAL_SLICE_v1
```

It does not mutate the public Methods implementation. It consumes the canonical Methods catalog and native state, projects that state into a renderer-owned three-dimensional field, and records pre-acceptance evidence.

Current branch:

```text
experiment/methods-models-categorical-spatial-template-v1-001
```

Draft pull request:

```text
PR #537
```

Merge and promotion remain prohibited until direct perceptual review authorizes the next step.

## Where the tools are

All implementation tools are under:

```text
verification/methods-models-categorical-spatial-template-v1/
```

| File | Purpose |
|---|---|
| `index.html` | Executable neutral spatial-template page |
| `catalog-source.mjs` | Extracts the canonical Methods catalog; no card scraping or duplicated taxonomy |
| `descriptor-registry.mjs` | Builds four family planes, 25 model positions, three lens relations, neighbors, and camera anchors |
| `descriptor-schema.mjs` | Enforces registry identity, count, coordinate, and reference contracts |
| `resolver.mjs` | Resolves native state plus viewport into camera, lifecycle, detail, visibility, and return-snapshot state |
| `native-bridge.mjs` | Consumes and drives the existing native Methods state machine |
| `renderer.mjs` | Owns the 3D scene root, field construction, camera transforms, lifecycle presentation, and transition receipts |
| `app.mjs` | Integrates catalog, registry, bridge, resolver, renderer, inspection, exact return, and the browser API |
| `styles.css` | Neutral structural 3D presentation and responsive detail budgets |
| `validate.mjs` | Runs bounded registry, resolver, source, and admission validation |
| `observer.mjs` | Runs desktop/mobile state transitions, screenshots, utility checks, full exact-return checks, and failure capture |
| `tool-admission-matrix.json` | Records direct reuse, pattern reimplementation, verification-only use, and prohibited dependencies |
| `README.md` | Entry summary and minimum startup commands |

Workflow:

```text
.github/workflows/methods-models-categorical-spatial-template-v1.yml
```

Canonical source consumed by the extractor:

```text
laws/research/methods-and-models/showroom.js
```

## Run the template locally

From the repository root, validate first:

```bash
node verification/methods-models-categorical-spatial-template-v1/validate.mjs
```

Start a static server:

```bash
python3 -m http.server 4173 --bind 127.0.0.1
```

Open:

```text
http://127.0.0.1:4173/verification/methods-models-categorical-spatial-template-v1/
```

Do not open `index.html` directly with a `file://` URL. The canonical catalog and embedded native Methods candidate are loaded through repository-relative HTTP paths.

## Use the visible controls

Camera:

```text
Overview = reveal field context and corpus extent
Browse   = move toward and center the active model
```

Navigation:

```text
Model − / Model +   = previous or next model
Lens − / Lens +     = previous or next lens
Family − / Family + = previous or next family plane
Inspect              = open foreground model inspection
Close inspection     = restore the immutable return snapshot
```

Keyboard:

```text
Left / Right Arrow = model movement
Up / Down Arrow    = lens movement
[ / ]              = family movement
```

## Use the browser automation API

After the page reports:

```text
document.documentElement.dataset.methodsSpatialReady === "true"
```

the API is available at:

```js
globalThis.__METHODS_SPATIAL_APP
```

Primary operations:

```js
await __METHODS_SPATIAL_APP.setCameraMode("overview");
await __METHODS_SPATIAL_APP.setCameraMode("browse");

__METHODS_SPATIAL_APP.moveModel(1);
__METHODS_SPATIAL_APP.moveModel(-1);

__METHODS_SPATIAL_APP.moveLens(1);
__METHODS_SPATIAL_APP.moveLens(-1);

__METHODS_SPATIAL_APP.moveFamily(1);
__METHODS_SPATIAL_APP.moveFamily(-1);

__METHODS_SPATIAL_APP.inspect();
__METHODS_SPATIAL_APP.closeInspection();

await __METHODS_SPATIAL_APP.whenStable();
```

Readable state:

```js
__METHODS_SPATIAL_APP.nativeState
__METHODS_SPATIAL_APP.resolvedScene
__METHODS_SPATIAL_APP.cameraMode
__METHODS_SPATIAL_APP.inspectionOpen
__METHODS_SPATIAL_APP.registry
__METHODS_SPATIAL_APP.receipts
```

Published evidence surfaces:

```js
globalThis.__METHODS_SPATIAL_RECEIPTS
globalThis.__METHODS_SPATIAL_RETURN_SNAPSHOT
globalThis.__METHODS_SPATIAL_RETURN_RECEIPT
```

Published events:

```text
METHODS_MODELS_SPATIAL_TEMPLATE_READY
METHODS_MODELS_RENDERER_TRANSITION_RECEIPT
METHODS_MODELS_RENDERER_EXACT_RETURN_RECEIPT
```

## Run the desktop/mobile observer locally

Install the pinned browser driver without changing repository package files:

```bash
npm install --no-save --no-package-lock puppeteer-core@24.15.0
```

Start the static server in a separate terminal:

```bash
python3 -m http.server 4173 --bind 127.0.0.1
```

Set a Chrome or Chromium executable and run:

```bash
CHROME_PATH="$(command -v google-chrome || command -v chromium || command -v chromium-browser)" \
METHODS_ORIGIN="http://127.0.0.1:4173" \
OUT_DIR="methods-models-categorical-spatial-template-v1-evidence" \
node verification/methods-models-categorical-spatial-template-v1/observer.mjs
```

The observer captures 14 deterministic frames:

```text
desktop:
  overview
  browse
  model transition
  lens transition
  family transition
  inspection
  exact return

mobile:
  overview
  browse
  model transition
  lens transition
  family transition
  inspection
  exact return
```

It also records console errors, page errors, request failures, transition receipts, and a full exact-return receipt.

## Exact-return contract

When inspection opens, the renderer stores an immutable snapshot containing:

```text
native family
native model
native lens
display state
camera role
camera preset
camera target
centered render target
visible cluster
detail classes
scroll position
focus target
input mode
viewport class
viewport dimensions
```

A body-level or otherwise unresolvable pre-inspection focus is normalized to the active model. This is the accessible return policy: the user returns to the same active exhibit rather than to an anonymous document body.

The observer requires every declared exact-return field to pass.

## Run through GitHub Actions

The workflow runs automatically on pushes to the experiment branch and on PR changes within the authorized paths. It may also be started manually with `workflow_dispatch`.

In GitHub:

```text
Actions
→ Methods Models Categorical Spatial Template v1
→ choose the exact-head run
```

The run validates:

```text
authorized paths
public/candidate boundary preservation
JavaScript syntax
registry and resolver contracts
desktop and mobile observer execution
evidence checksums
observer exit result
```

## Find the evidence

In the workflow run, download:

```text
methods-models-categorical-spatial-template-v1-evidence
```

The artifact contains:

```text
screenshots/
observer-result.json
generated-spatial-registry.json
registry-validation.json
registry-validation.log
operational-observer.log
tool-admission-matrix.json
exact-changed-paths.txt
SHA256SUMS
nested evidence archive and checksum
```

The user-supplied custody record also places the accepted exact-head package in the dedicated Google Drive folder. GitHub Actions remains the easiest location for regenerating and downloading evidence for a new commit.

## What each tool is allowed to decide

Methods native state decides:

```text
family
model
lens
display
inspection semantic state
```

The spatial layer decides:

```text
field position
camera target
visible cluster
lifecycle
detail class
renderer transition
return snapshot
```

The observer decides only whether declared operational checks passed. It does not decide beauty, page identity, product acceptance, merge, or promotion.

The full Methods coherence and visual-conformance instruments remain post-perceptual-acceptance certification tools. They are not the design authority for this vertical slice.
