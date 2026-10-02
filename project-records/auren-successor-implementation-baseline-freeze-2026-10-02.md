# Auren Successor Implementation Baseline Freeze

Status: **IMPLEMENTATION BASE FROZEN**
Date: 2026-10-02

Controlling contract:
`project-records/auren-successor-replacement-contract-immersive-relational-conversation-2026-10-02.md`

Exact implementation base:
`738d22bc1a12987651720624f37192d7c674315b`

At freeze time, repository `main` equals the controlling-contract merge head. No intervening Auren runtime mutation exists.

## Authorized mutable product-runtime blobs at base

| Path | Frozen base blob |
| --- | --- |
| `products/auren/auren.voice.js` | `d8a9c8e0fd9a9eebd6ae2b802562d58cb2afbd78` |
| `products/auren/auren.chamber.js` | `84e205fbd8b54da34403abea8458fd22ced5d993` |
| `products/auren/index.html` | `b7c6f765a953866dddadce3547046f0fc1a21a2f` |
| `products/auren/index.css` | `9890b6bc8e463618ee4589ef60d809e0cfdeada4` |
| `products/auren/auren.archetype.js` | `845ae9651dc602ccc5eaae09923d5ba652ea18ef` |
| `products/auren/auren.state-dependent.js` | `064376b831a6277a280197bfd65ca6778906a8cd` |
| `products/auren/auren.relationship.js` | `d8103d651e30e159d465d8ea69d9ca5a176c75d9` |
| `products/auren/auren.scene-offer.js` | `c67a2a282b872c22499007414d53ebe847686203` |
| `products/auren/auren.privacy.js` | `5d592fbcdd47693129f5afd88bb6c095d45cc971` |
| `products/auren/auren.privacy-relationship.js` | `de84ba89fbffc4ae30850df0b611cbdfe60c5bdc` |
| `products/auren/auren.return-context.js` | `d7f3c843e51769fee8f19eefd29ca5f3feebadf8` |

New authorized file:
`products/auren/auren.session-context.js`

## Frozen reusable authorities

These are not authorized to change under the replacement contract without a new explicit reopening record.

| Path | Frozen base blob |
| --- | --- |
| `products/auren/auren.custody.js` | `d960a1469e087bf1869cbd958b21e02854d3e19d` |
| `products/auren/auren.room.geometry.js` | `de2a39cb8dc0b13e0670f78cb3d43d2b941d6a56` |
| `products/auren/auren.room.presentation.js` | `97501c4df68b45ef307394896aa8c691c4df4ede` |
| `products/auren/auren.room.environment.js` | `5d3d7e842067682928ced9472f33f711f2a77b0a` |
| `control-plane/whole-estate/character-registry-v1/profiles/auren-vale.v1.json` | `6fa4cd1ec82deed8fc2ec96bb73e5a2d9bc5d6c6` |

Controlling replacement-contract blob:
`999a68a748ddd0e4d8d0b3cb3547021847ccd25b`

## Qualification additions

The implementation candidate may additionally add only the dedicated successor verifier/workflow and minimum dispatch/control-plane registration authorized by the controlling contract.

Those additions do not expand product-runtime authority.

## Baseline drift law

Before qualification, the candidate must prove:

1. its merge base is this exact base or an explicitly reconciled descendant;
2. every frozen reusable authority above remains byte-exact;
3. every changed Auren product-runtime file belongs to the authorized mutable set;
4. any newly created Auren product-runtime file is exactly the authorized `auren.session-context.js`;
5. qualification/control-plane additions are limited to the successor qualification mechanism;
6. no other character, product authority, Manor runtime or global canon file changed.

If `main` advances before candidate integration, compare the intervening changes against this baseline. Do not silently rebase through an Auren/canon/Manor conflict.

## Next deterministic operation

Construct `products/auren/auren.session-context.js` as the successor semantic event/continuity authority against this exact frozen base.

Do not rewrite conversation behavior before that authority exists and is statically auditable.

## Terminal baseline law

**BASE = 738d22bc1a12987651720624f37192d7c674315b**

**FROZEN BLOBS ARE THE DRIFT AUTHORITY.**

**SESSION/EVENT AUTHORITY IS THE FIRST RUNTIME WRITE.**
