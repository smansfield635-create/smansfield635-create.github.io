# H-EARTH LIVE ENVIRONMENT FREEZE — 2026-09-22

STATUS: FROZEN PRODUCTION BASELINE
AUTHORITY: OWNER DIRECTIVE
SOURCE COMMIT: `7c692cef3888d065f856b2a8a8c001cfa1679f2a`

## Frozen public route

`/showroom/globe/h-earth/`

The H-Earth live environment represented by the source commit above is the protected production baseline for subsequent Gen-2 terrain-renderer research.

## Public-corridor identities at freeze

| Surface | Git blob identity |
| --- | --- |
| `showroom/globe/h-earth/index.html` | `12c2cb4507dd61271274bbe3382570e4d34188e1` |
| `showroom/globe/h-earth/index.js` | `b26aa16abfebf24bf0d77b62d36f7a11ade1ac5c` |
| `showroom/globe/h-earth/compositor.js` | `ae69d5a26604a7bd12a685c283211afe61b46dbd` |
| `showroom/globe/h-earth/renderer.js` | `799d37cec5244e6aa19b7d94dffe37e182b85884` |

## Freeze law

The current live environment is preservation authority, not the Gen-2 experimental surface.

Gen-2 terrain-renderer research MUST proceed in parallel and MUST NOT mutate, replace, merge over, or deploy over this frozen public baseline without a later explicit owner promotion decision.

The following remain frozen for Gen-2 research:

- live public route presentation;
- current production camera/compositor/control behavior;
- current production renderer;
- current production coastline and admitted world identity;
- production deployment state.

Experimental Gen-2 work must use isolated candidate surfaces and may consume canonical H-Earth terrain/world truth read-only until a later promotion contract explicitly authorizes otherwise.

## Promotion boundary

No Gen-2 result becomes production because it builds, renders, scores better, or wins an autonomous experiment.

Promotion requires:
1. qualified isolated execution;
2. live interactive owner inspection;
3. explicit owner authorization;
4. a separate bounded production promotion contract.

This document is the durable freeze receipt.
