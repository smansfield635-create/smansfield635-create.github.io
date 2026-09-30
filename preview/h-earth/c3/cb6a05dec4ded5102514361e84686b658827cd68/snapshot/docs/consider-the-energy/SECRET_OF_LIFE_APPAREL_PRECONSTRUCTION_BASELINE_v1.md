# SECRET OF LIFE APPAREL — Pre-Construction Baseline v1

Status: FROZEN PRE-CONSTRUCTION BASELINE  
Project: CONSIDER_THE_ENERGY  
Repository: `smansfield635-create/smansfield635-create.github.io`  
Mutation class of this packet: STATIC_EDITORIAL_MICRO / DOCUMENTATION ONLY  
Product/runtime mutation performed by this packet: NONE  
Publication performed by this packet: NONE

## 1. Frozen repository baseline

Canonical baseline branch at freeze time: `main`

Frozen exact repository head:

`b0ed15ab4951018f2be1eaa027c422b6b060ec60`

All construction for the Secret of Life apparel/catalog operation must treat this commit as the product-state comparison baseline unless a later explicit baseline replacement is approved.

## 2. Frozen product page identities

### Consider the Energy community page

Path:

`campaigns/consider-the-energy/index.html`

Frozen Git blob SHA:

`87726cc623fda7e877bb1d2899156c57e8d2a834`

Baseline role:
- existing four-face Community Object;
- existing Brand face contains the current three-shirt presentation;
- no Community Object runtime, carousel/tab behavior, philosophy, layout, or non-apparel copy is authorized to change merely by this baseline freeze.

### Secret of Life Edition page

Path:

`campaigns/consider-the-energy/secret-of-life-edition/index.html`

Frozen Git blob SHA:

`4045a2fc920dc2ffe24b354368279db8a5721c93`

Baseline role:
- existing placeholder/editorial page shell;
- existing campaign-tab architecture is the accepted implementation source;
- this page is the primary substantive construction surface for the future apparel/editorial catalog.

## 3. Frozen currently served Community shirt assets

These are the exact repository asset identities present at the frozen baseline:

| Asset | Path | Git blob SHA |
| --- | --- | --- |
| Learn to Love to Listen | `campaigns/consider-the-energy/assets/learn-to-love-to-listen.png` | `89f7eb9cccb82f1b7c48848526ba31e6b4d5278d` |
| Learn to Live to Laugh | `campaigns/consider-the-energy/assets/learn-to-live-to-laugh.png` | `f078efa38bef8b3503964d28a19c3a08b9d3d32c` |
| Higher the Risk / Higher the Ceiling | `campaigns/consider-the-energy/assets/higher-the-risk-higher-the-ceiling.png` | `e860518072a0697db85f0aa83b2d0d73bd66ffd1` |

These identities define the exact current visual source state before any approved shirt reassignment.

## 4. Frozen current Secret of Life placeholder visual dependencies

| Asset | Path | Git blob SHA |
| --- | --- | --- |
| Consider Energy baseline SVG | `campaigns/assets/consider-energy-baseline.svg` | `9cac6baf30be8d04842b5201390d3edd23fa51f3` |
| Consider Energy symbolic SVG | `campaigns/assets/consider-energy-symbolic.svg` | `9435e95e679361aad47d2b2d71272dfd7bf5d7ec` |

These are baseline dependencies only. Their presence does not grant future authority to mutate shared campaign assets.

## 5. Frozen shared presentation dependencies

The current pages depend on the established campaign presentation system:

| Dependency | Path | Git blob SHA |
| --- | --- | --- |
| Campaign stylesheet | `campaigns/index.css` | `14b3f4bf4dd6f7cfc2e9dfee2713897de901c92b` |
| Campaign tabs behavior | `campaigns/index.tabs.js` | `c29c2ed2d6f1791ae2c74c3091a6629e541fa47e` |

Pre-construction intent is to reuse these dependencies unchanged. Any later need to alter either path must be separately justified and reclassified before mutation.

## 6. Frozen construction boundary

This baseline records the owner-approved direction but does not execute it.

Planned Community-page delta:
- replace only the third shirt in the Brand-face three-shirt presentation;
- Higher the Risk / Higher the Ceiling leaves that trilogy position;
- Learn to Live to Love takes that position;
- no other Community Object behavior or content changes are implied by this baseline.

Planned Secret of Life Edition delta:
- hero title becomes `The Secret of Life Edition`;
- featured trilogy becomes:
  1. Learn to Live to Love
  2. Learn to Love to Listen
  3. Learn to Live to Laugh
- broader apparel catalog may include:
  - Higher the Risk / Higher the Ceiling
  - Fear / Love
  - Manipulation
  - later approved shirts
- approved CTE graphics may be used as editorial interludes and environmental storytelling, not falsely represented as merchandise;
- no cart, checkout, inventory, payment, or ordering runtime is part of this construction cut.

## 7. Baseline invariants

Before the first product construction write:

1. current product state must still resolve to the frozen page/blob identities above, or any divergence must be inspected before proceeding;
2. shared presentation dependencies are presumed unchanged and must not be silently modified;
3. new shirt/editorial source assets must receive exact source identities before installation;
4. the Community page remains a bounded surgical delta;
5. the Secret of Life Edition page remains the main construction surface;
6. no new runtime authority is created by this packet;
7. merge, deployment, and publication remain separate later stages.

## 8. Freeze carrier

Pre-construction branch:

`cte-secret-of-life-apparel-preconstruction-v1`

The branch was created directly from the frozen baseline head:

`b0ed15ab4951018f2be1eaa027c422b6b060ec60`

This packet is the first documentation-only commit on that branch. The packet commit is not a replacement product baseline; the frozen product baseline remains the exact commit above.

## 9. Next deterministic pre-construction action

`SOURCE ASSET MANIFEST + NORMALIZATION SPEC`

No HTML construction should begin until the approved Google Drive shirt and editorial sources are individually bound to exact source identities and assigned intended repository destinations/treatments.
