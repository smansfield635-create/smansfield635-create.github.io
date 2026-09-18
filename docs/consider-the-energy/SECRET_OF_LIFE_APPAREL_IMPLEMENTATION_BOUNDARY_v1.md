# SECRET OF LIFE APPAREL — Implementation Boundary v1

Status: FROZEN PRE-CONSTRUCTION IMPLEMENTATION BOUNDARY  
Project: `CONSIDER_THE_ENERGY`  
Repository: `smansfield635-create/smansfield635-create.github.io`  
Frozen product baseline: `b0ed15ab4951018f2be1eaa027c422b6b060ec60`  
Pre-construction branch: `cte-secret-of-life-apparel-preconstruction-v1`  
Prior content-hierarchy freeze commit: `3929a8c14875f90dbc13314f2bc51b1e58330af3`

This packet freezes how the already-approved two-surface apparel/editorial construction may be implemented. It does not normalize assets, mutate product HTML, create runtime behavior, merge, deploy, or publish.

## 1. Governing implementation class

The intended construction remains a bounded page release using existing repository presentation primitives.

Target implementation class:

`BOUNDED_PAGE_RELEASE / EXISTING_PAGE_PRIMITIVES / NO_NEW_RUNTIME_AUTHORITY`

The implementation must remain within this class unless a concrete blocker proves otherwise.

If a required change would introduce new runtime ownership, shared controller behavior, commerce state, or an additional public surface, construction must stop before that mutation and the operation must be reclassified.

## 2. Exact product surfaces authorized for mutation

Only these two public HTML files are product construction surfaces:

1. `campaigns/consider-the-energy/index.html`
2. `campaigns/consider-the-energy/secret-of-life-edition/index.html`

No third HTML surface is authorized by this operation.

Supporting normalized assets may be added only at exact destinations frozen by the source-asset manifest and normalized-output-identity checkpoint.

## 3. Surface A implementation boundary

Surface A:

`campaigns/consider-the-energy/index.html`

Implementation class:

`SURGICAL_EXISTING_MARKUP_SUBSTITUTION`

Allowed implementation:
- preserve the current Community Object DOM architecture;
- preserve the existing Brand / Underdog / Community / Connected Work four-face system;
- preserve existing tab/swipe behavior;
- preserve the current shirt-presentation layout;
- replace the third shirt asset reference with the normalized Learn to Live to Love asset;
- update only the associated third-shirt title/caption/alt text as required to accurately identify that shirt;
- retain the existing first two shirt asset references and presentation.

Not allowed on Surface A:
- no tab-label changes;
- no tab-count changes;
- no new sections;
- no new carousel implementation;
- no new gestures;
- no new JavaScript;
- no layout redesign;
- no editorial-graphic insertion;
- no broader catalog insertion;
- no commerce affordances;
- no philosophy rewrite;
- no changes to Underdog, Community, or Connected Work content;
- no unrelated Brand-face rewrite.

Surface A law:

`EXISTING COMMUNITY OBJECT + ONE ACCURATE SHIRT-SLOT SUBSTITUTION`

## 4. Surface B implementation boundary

Surface B:

`campaigns/consider-the-energy/secret-of-life-edition/index.html`

Implementation class:

`BOUNDED_EXISTING_SHELL_RECOMPOSITION`

The current campaign shell is the implementation source, not merely visual inspiration.

Construction may:
- retain the existing campaign header, main shell, footer, and accessibility conventions;
- retain the existing tablist / tabpanel system;
- relabel existing tabs to match the frozen content hierarchy;
- reorder or replace content inside the existing tab panels;
- add ordinary semantic HTML sections inside Surface B;
- use existing repository card/action/media/detail patterns where they fit;
- use native anchors, figures, headings, paragraphs, lists, and `<details>` elements;
- add page-local CSS inside Surface B when needed to realize the frozen hierarchy without changing shared styling behavior;
- use responsive CSS local to Surface B;
- use normalized approved assets at their frozen destinations;
- establish non-interactive future-commerce attachment points only as semantic structure, without live commerce controls or implied availability.

Construction may not:
- create a new tab/carousel controller;
- add new application state;
- add a framework or external UI library;
- add remote JavaScript;
- add a new runtime owner;
- add custom gesture logic;
- add cart, checkout, payment, inventory, account, ordering, pricing, size, or color-selection state;
- create a parallel apparel route;
- create a product-detail routing system;
- create a new API dependency;
- create a database dependency;
- create a third public surface.

## 5. Shared presentation dependencies — frozen unchanged

These existing shared dependencies are implementation sources and are presumed byte-preserved:

### Shared campaign stylesheet

`campaigns/index.css`

Frozen baseline Git blob:

`14b3f4bf4dd6f7cfc2e9dfee2713897de901c92b`

Disposition:

`NO_MUTATION_INTENDED`

### Shared campaign tab controller

`campaigns/index.tabs.js`

Frozen baseline Git blob:

`c29c2ed2d6f1791ae2c74c3091a6629e541fa47e`

Disposition:

`NO_MUTATION_ALLOWED_WITHOUT_SCOPE_REVIEW`

No convenience-driven change to these shared files is permitted.

If the frozen content hierarchy cannot be implemented without changing either shared dependency, construction must stop on the exact blocker before mutation.

## 6. Surface-B local styling law

Page-specific visual work should be contained within:

`campaigns/consider-the-energy/secret-of-life-edition/index.html`

when ordinary local CSS is sufficient.

Local CSS may control:
- collection layout;
- editorial-interlude composition;
- responsive apparel grids;
- figure sizing;
- whitespace and pacing;
- hierarchy-specific typography treatment;
- local visual distinction between merchandise and editorial graphics.

Local CSS may not:
- override shared campaign behavior globally;
- target unrelated pages;
- reproduce or fork the shared tab controller;
- create hidden interactive state;
- depend on unregistered external stylesheets.

## 7. Asset implementation boundary

New product/media files may exist only when they are:
- present in the frozen source asset manifest;
- normalized under the frozen asset treatment law;
- assigned an exact repository destination;
- frozen by exact output identity before HTML construction references them.

Preferred namespace:

`campaigns/consider-the-energy/assets/`

No arbitrary Drive file may be copied into the repository.

No source screenshot may be installed directly when its manifest requires normalization first.

Existing approved repository shirt assets remain reused by exact identity unless a separate explicit normalization decision changes them.

## 8. Runtime boundary

This construction is presentation and content composition, not application development.

Allowed runtime dependency:
- existing `campaigns/index.tabs.js` behavior, unchanged.

No additional runtime is required or authorized.

The following automatically exceed the frozen implementation boundary:
- new event-controller code;
- new state machine;
- new swipe engine;
- new carousel engine;
- asynchronous data loading;
- remote product data;
- ordering workflow;
- persistent client state;
- commerce/session state;
- analytics logic added specifically for this build;
- authentication;
- personalization.

Encountering one of these needs creates a STOP condition, not implied authority.

## 9. Route boundary

Existing routes may be linked to, including already-authorized sibling routes such as:
- `/campaigns/consider-the-energy/`
- `/nine-summits-of-love/`
- `/book/`
- already-existing campaign routes where contextually appropriate.

This operation does not authorize creation of:
- a new `/shop/` route;
- a new `/store/` route;
- shirt-specific routes;
- collection-specific child routes beyond the existing Secret of Life route;
- checkout/order routes.

## 10. Commerce boundary

Future commerce is architecturally anticipated but functionally absent.

Construction may reserve semantic room for future metadata.

Construction may not display or imply live:
- prices;
- inventory;
- sizes;
- colors;
- stock status;
- Add to Cart;
- Buy Now;
- checkout;
- shipping;
- payment;
- order confirmation.

No dead controls or fake commerce UI may be shown as though operational.

## 11. Accessibility and interaction preservation

Implementation must preserve:
- semantic headings;
- keyboard-operable existing tabs;
- current skip-link behavior;
- alt text appropriate to merchandise/editorial distinction;
- mobile readability;
- reduced-motion compatibility inherited from shared behavior where applicable;
- no essential information available only through hover.

No accessibility regression is authorized in exchange for visual styling.

## 12. Product-byte allowlist

Once normalized asset identities are frozen, the intended **product-byte mutation set** is limited to:

- `campaigns/consider-the-energy/index.html`
- `campaigns/consider-the-energy/secret-of-life-edition/index.html`
- exact normalized/new asset paths frozen by `SECRET_OF_LIFE_APPAREL_NORMALIZED_ASSET_IDENTITIES_v1`

No other product/runtime path is expected to change.

### Administrative evidence exception

The pre-construction branch already contains documentation-only freeze packets under:

`docs/consider-the-energy/`

Those packets are administrative/evidence carriers, not product construction surfaces.

Therefore candidate review must distinguish:

`REPOSITORY DELTA = PRECONSTRUCTION EVIDENCE FILES + PRODUCT-BYTE MUTATION SET`

from:

`PRODUCT-BYTE MUTATION SET`

The evidence packets do not expand product mutation authority.

## 13. Reuse-before-invention law

Before adding any new markup pattern, construction should first test whether one of the existing page primitives already expresses the requirement:

- campaign shell;
- campaign hero;
- campaign tabs;
- campaign tab panels;
- campaign action cards;
- campaign media cards;
- campaign statement blocks;
- disclosure/details blocks;
- route panels;
- figures and captions.

New page-local markup is permitted only when these existing primitives do not express the frozen hierarchy cleanly.

No new shared component system is authorized.

## 14. Stop conditions

Construction stops before mutation if any of the following becomes necessary:

1. mutation of `campaigns/index.tabs.js`;
2. mutation of `campaigns/index.css` solely to support this page;
3. creation of a third public HTML surface;
4. new runtime/event-controller logic;
5. commerce state or transaction flow;
6. use of an unmanifested asset;
7. generative recreation of approved source artwork;
8. a page-local solution that would materially affect unrelated routes;
9. a requirement to change project/control-plane authority;
10. ambiguity about whether a requested change remains bounded presentation.

A stop condition requires explicit scope review. It does not invalidate the completed pre-construction freezes.

## 15. Candidate implementation acceptance conditions

A future construction candidate conforms to this boundary only if:

1. Surface A remains a surgical shirt-slot substitution.
2. Surface B carries the substantive apparel/editorial construction.
3. Existing shared tab behavior is reused unchanged.
4. Shared campaign CSS is unchanged unless an explicit scope amendment exists.
5. No new runtime owner exists.
6. No new public route exists.
7. Only frozen normalized/new asset paths are added.
8. Page-local styling does not affect unrelated pages.
9. No commerce behavior is present.
10. Product-byte diff remains inside the frozen allowlist.

## 16. Construction gate

This packet freezes implementation mechanics only.

Current pre-construction state:

- exact baseline: FROZEN
- two-surface scope: FROZEN
- source asset manifest: FROZEN
- asset treatment law: FROZEN
- content hierarchy: FROZEN
- implementation boundary: FROZEN
- normalized output identities: NOT YET FROZEN
- HTML construction: BLOCKED PENDING NORMALIZED OUTPUT IDENTITIES

The next deterministic checkpoint remains:

`SECRET_OF_LIFE_APPAREL_NORMALIZED_ASSET_IDENTITIES_v1`

No product HTML construction begins before that checkpoint.
