# SECRET OF LIFE APPAREL — Two-Surface Scope Freeze v1

Status: FROZEN PRE-CONSTRUCTION SCOPE  
Project: CONSIDER_THE_ENERGY  
Repository: `smansfield635-create/smansfield635-create.github.io`  
Frozen product baseline: `b0ed15ab4951018f2be1eaa027c422b6b060ec60`  
Pre-construction branch: `cte-secret-of-life-apparel-preconstruction-v1`  
Prior baseline packet commit: `76448bbf294b0329addba974607a12814ce8342a`

This packet freezes the public-surface boundary for the Secret of Life apparel/catalog construction. It does not perform product construction.

## 1. Exact public surfaces in scope

Exactly two public HTML surfaces are authorized as construction subjects for this operation.

### Surface A — Consider the Energy Community Object

Exact path:

`campaigns/consider-the-energy/index.html`

Baseline Git blob SHA:

`87726cc623fda7e877bb1d2899156c57e8d2a834`

Authorized purpose of change:
- preserve the existing four-face Community Object;
- on the Brand face only, replace the current third shirt position;
- remove Higher the Risk / Higher the Ceiling from the three-shirt Secret of Life presentation;
- install Learn to Live to Love in that third position;
- preserve Learn to Love to Listen;
- preserve Learn to Live to Laugh.

Explicitly out of scope on Surface A:
- no change to tab/carousel behavior;
- no new runtime;
- no change to Underdog, Community, or Connected Work content;
- no change to philosophy structure;
- no change to orbit behavior;
- no general layout redesign;
- no commerce controls;
- no catalog expansion on this surface.

Surface A acceptance law:

`CURRENT COMMUNITY OBJECT + ONE SHIRT SUBSTITUTION = ACCEPTED SCOPE`

### Surface B — Secret of Life Edition / Apparel Editorial Catalog

Exact path:

`campaigns/consider-the-energy/secret-of-life-edition/index.html`

Baseline Git blob SHA:

`4045a2fc920dc2ffe24b354368279db8a5721c93`

Authorized purpose of change:
- convert the current placeholder page into the primary Consider the Energy apparel/editorial catalog environment;
- update the hero title to `The Secret of Life Edition`;
- establish the three-shirt Secret of Life collection as the featured collection;
- preserve the existing campaign shell/tab implementation source unless a later exact need is proven;
- add broader apparel presentation for approved non-trilogy shirts;
- use approved CTE graphics as editorial/environmental interludes rather than as merchandise;
- preserve room for later commerce without adding commerce runtime in this cut.

Featured collection frozen for Surface B:
1. Learn to Live to Love
2. Learn to Love to Listen
3. Learn to Live to Laugh

Broader catalog candidates already approved in concept:
- Higher the Risk / Higher the Ceiling
- Fear / Love
- Manipulation

Editorial/environment candidates already approved in concept:
- Five D's of Deceit
- Gratitude vs. Entitlement
- expectations / limitations material
- 7 D's of Decision Making
- other later-approved CTE graphics that directly strengthen a nearby apparel idea

Surface B acceptance law:

`EDITORIAL ENVIRONMENT + FEATURED COLLECTION + BROADER APPAREL = CATALOG`

and not:

`GENERIC STORE GRID = CATALOG`

## 2. Surface count is frozen

Public construction surface count:

`2`

No third public page, route, environment, modal application, storefront, checkout page, or parallel apparel route may be introduced under this scope without an explicit scope amendment.

Supporting assets do not count as additional surfaces.

## 3. Supporting asset boundary

New or normalized shirt/editorial assets may be added later as subordinate dependencies of the two frozen surfaces.

Preferred owned namespace:

`campaigns/consider-the-energy/assets/`

The exact supporting asset path list is intentionally **not** frozen by this packet. It will be frozen by the next checkpoint:

`SOURCE ASSET MANIFEST + NORMALIZATION SPEC`

That later manifest may authorize only the exact image assets required to realize the two frozen surfaces. It may not expand the public-surface count.

## 4. Shared dependencies presumed unchanged

The following shared presentation dependencies remain outside intended mutation scope:

- `campaigns/index.css`
- `campaigns/index.tabs.js`

Their frozen baseline identities remain those recorded in:

`docs/consider-the-energy/SECRET_OF_LIFE_APPAREL_PRECONSTRUCTION_BASELINE_v1.md`

If construction proves that either shared path must change, work must stop before that mutation and the scope/classification must be revisited. Shared-path modification may not be inferred from visual convenience.

## 5. Explicitly excluded operation classes

This two-surface construction does not include:

- cart runtime;
- checkout runtime;
- payment processing;
- inventory state;
- order submission;
- customer accounts;
- pricing engine;
- size/color state machine;
- new global navigation behavior;
- new carousel/tab controller;
- replacement of the existing Community Object interaction system;
- mutation of unrelated campaigns;
- mutation of Products, Nine Summits, Book, R.O.B., W.A.V.E., or other estate surfaces.

Future commerce is a separate later operation.

## 6. Scope invariants

Construction must preserve all of the following:

1. exactly two public HTML surfaces remain in scope;
2. Surface A remains surgical;
3. Surface B carries the substantive design/editorial build;
4. supporting assets remain subordinate to these surfaces;
5. asset installation does not create new surface authority;
6. existing shared campaign behavior remains reused unless a proven blocker requires explicit scope revision;
7. no live publication is implied by construction;
8. no product mutation is performed by this packet.

## 7. Deterministic changed-byte expectation for the future construction candidate

At candidate freeze, the expected mutation set must consist only of:

- `campaigns/consider-the-energy/index.html`;
- `campaigns/consider-the-energy/secret-of-life-edition/index.html`;
- exact new/normalized asset files frozen later by the source asset manifest.

Any additional changed repository path is a scope exception and must be explained before candidate acceptance.

## 8. Next checkpoint

The next deterministic pre-construction checkpoint is:

`SOURCE ASSET MANIFEST + NORMALIZATION SPEC`

That checkpoint must bind:
- exact Google Drive source identity;
- source file byte identity where available;
- intended semantic role;
- intended repository destination;
- crop/extraction treatment;
- background/edge treatment;
- whether the asset is merchandise or editorial environment;
- whether the asset appears on Surface A, Surface B, or both.

No HTML construction begins before that manifest is frozen.
