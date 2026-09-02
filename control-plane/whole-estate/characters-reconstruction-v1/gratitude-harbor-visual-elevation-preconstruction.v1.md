# Gratitude Harbor Visual-World Elevation — Preconstruction v1

Status: PRECONSTRUCTION_COMPLETE
Date: 2026-09-02
Baseline adoption commit: `13d6b1a77b746d50874271a20084211d66ebd79a`
Current governing main at package creation: `9ce59503ca9ed36e7e5248c22c47d38be95604dd`
Protected freeze receipt: issue #2378 comment `5515553187`

## Objective

Elevate the Characters-scale Gratitude Harbor environment into the visual benchmark for the estate while preserving the Step 9 / Step 10 regional bridge architecture. The environment itself must become compelling before any inspection card is opened. Improvement may exceed the current visual quality of Audralia and H-Earth.

This is not a scene-construction operation and not a gameplay operation.

## Existing strengths to preserve

- Nighttime identity and moonlit coast.
- Moving water and lunar response.
- WebGL2 regional survey environment.
- Orbit -> locality travel -> inspect -> return-to-orbit grammar.
- Coast map and discovery state.
- Cinematic primer Play / Skip / Replay semantics.
- Reduced-motion equivalence.
- Canonical Gratitude geography binding through `AUDRALIA_GRATITUDE_GEOGRAPHIC_TRANSFER_AUTHORITY_v1`.
- Regional discovery beyond current playable H-Earth extent without traversal authority.

## Visual audit of the live baseline

The current implementation is structurally functional but visually reads as a qualified prototype rather than a finished world.

### Terrain

Current terrain is dominated by broad low-frequency gray/green surfaces. Material identity is weak, slope changes are difficult to read, and many local approaches resemble untextured geometric sheets. Large contiguous areas lack meso-scale features capable of establishing distance, ecology, or geology.

### Shoreline and water

The water motion is a strong foundation, but the coastline lacks enough physical variation. There is insufficient differentiation among beach, wet sand, shelf, rock, tidal edge, cove, inlet, and marsh-like transitions. Water-to-land contact often reads as a clean polygonal intersection instead of a living shore.

### Atmosphere and lighting

The moon establishes the night identity, but the world needs stronger atmospheric depth. Near, middle, and far terrain do not separate enough. Moonlight needs more localized response across wet surfaces, ridge edges, water, mist, and elevated landmarks. The sky is intentionally sparse but currently leaves too much perceptual emptiness in several local compositions.

### Regional readability

The orbit view is the strongest composition but still does not communicate a sufficiently rich harbor. Terrain regions blend together, leaving localities visually dependent on star markers and dotted relationship lines rather than the geography itself.

### Destination differentiation

Several destinations currently differ mainly by marker/proof expression and camera position. The surrounding landforms do not yet provide enough distinct identity. A user should be able to recognize a locality from terrain silhouette, water relationship, elevation, vegetation/rock language, and lighting before reading its name.

### Landmark expression

Current proof expressions are intentionally lightweight but frequently read as placeholders:
- Mirror Manor is a simple black silhouette with two lit windows.
- The Clock is primarily a circular ring.
- Character/locality markers are stars or small abstract glyphs.
- Other destinations use thin arcs, dashed paths, lantern-like forms, or small light clusters.

These can remain symbolic at regional scale, but they need environmental integration so they feel like distant landmarks rather than debugging overlays.

### Camera composition

Some locality approaches place large flat terrain planes across most of the viewport, with the moon and landmark separated by dead sky. Camera framing needs stronger foreground/midground/background choreography, more deliberate horizon height, and destination-specific approach angles.

### UI relationship to the world

Inspection cards are visually competent but too dominant relative to the environment, particularly on mobile. The bottom control rail remains heavy. This package does not redesign the UI yet; it records the problem so the subsequent dedicated UI pass can act after the environment is strong.

## Pass 2 construction scope — environment only

Allowed mutation surfaces:

1. `characters/night-renderer.mjs`
   - terrain material response
   - lunar lighting response
   - water depth/lift/fresnel/shimmer behavior
   - haze and atmospheric integration
   - color/material stratification

2. `characters/app.mjs`
   - terrain mesh detail and normal derivation
   - water mesh presentation
   - camera presentation values and destination-specific composition
   - non-authoritative environmental dressing derived from canonical geography
   - atmosphere layers and distant silhouettes
   - landmark presentation integration

3. New Characters-owned visual modules under `characters/`
   - deterministic terrain-material classification
   - vegetation/rock/wetland/coastal dressing
   - atmospheric/fog layers
   - regional landmark visual grammar
   - presentation-only camera composition helpers

4. `characters/index.html`
   - only environmental canvas/layer support required by this pass
   - no card or control redesign except changes necessary to prevent visual obstruction during evaluation

5. Verification/evidence files under `control-plane/whole-estate/characters-reconstruction-v1/`

## Explicitly protected / forbidden mutation

- No edits that create independent coastline, terrain, or destination coordinates.
- No edits to the canonical Gratitude geography authority.
- No new gameplay mechanics.
- No character scenes or interiors.
- No final Mirror Manor construction.
- No false implication that regional destinations are currently traversable in H-Earth.
- No replacement of the cinematic primer interaction contract.
- No removal of reduced-motion equivalence.
- No destructive change to orbit/travel/inspect/return grammar.
- No card-content rewrite in this pass.
- No broad estate navigation changes.

## Environment-elevation targets

### A. Terrain material hierarchy

Establish at minimum these readable regional material families without introducing a second geography source:
- wet shoreline / tidal edge
- beach or light coastal shelf
- low coastal grass/scrub
- dark rock / exposed ridge
- higher inland terrain
- damp basin / wetland or sheltered lowland where geographically plausible

Classification must be deterministic from canonical terrain height, slope/normal, shoreline distance, and presentation-scale procedural fields. It may not mutate canonical terrain coordinates.

### B. Meso-scale landform readability

Add visual-scale structure so large surfaces stop reading as flat sheets:
- ridge breakup
- shallow erosion or drainage cues
- rock clusters/outcrops
- grass/scrub patches
- dune/shelf transitions where appropriate
- shoreline irregularity expressed through materials/dressing rather than coordinate mutation

### C. Water and coast contact

Improve:
- wet-edge response
- shallow-to-deep color transition
- moon path fragmentation
- cove/inlet readability
- shoreline foam/glint or equivalent restrained night cue
- water haze and distance response

The existing water motion is preserved and extended, not replaced gratuitously.

### D. Atmosphere

Create clear depth separation using restrained night fog/haze:
- local foreground clarity
- middle-distance softness
- far-coast atmospheric compression
- moonlit mist pockets where plausible
- horizon integration

Atmosphere must not obscure navigation markers or cause accessibility loss.

### E. Moonlight

Strengthen the moon as an environmental light source:
- edge light on terrain ridges
- stronger response on wet and reflective surfaces
- localized shimmer path on water
- subtle landmark lighting logic
- no daytime readability or overexposure

### F. Regional identity

The orbit view must visibly contain multiple distinguishable geographic zones before any marker is selected. The user should perceive coves, ridges, lowlands, water channels, and distant settlement/landmark structure as one harbor system.

### G. Destination presentation

Each existing destination receives presentation-only environmental differentiation using its canonical locality and surroundings. The goal is recognition without building scenes.

At minimum:
- Mirror Manor locality: distant architectural silhouette integrated into terrain; still explicitly nonfinal and non-scene.
- Alaric locality: elevated/watchful terrain language and clear approach silhouette.
- Soren locality: harsher/restorative boundary or damaged/recovered ecological contrast, without inventing plot events.
- Tarian locality: practical/connected lowland or route-oriented presentation where geography supports it.
- Elara locality: signal/light/visibility-oriented presentation where geography supports it.
- Auren, Jeeves, Beyond the Manor, The Crossing, The Clock, Dextrion and other existing destinations: environmental context sufficient to distinguish them without hard-binding new canon.

These descriptions are presentation intent, not new character canon or final scene placement.

### H. Camera composition

For orbit and every destination, establish:
- intentional horizon placement
- foreground anchor
- readable destination silhouette
- useful middle-distance geography
- limited dead sky unless compositionally justified
- moon placement that supports rather than competes with the destination
- mobile framing designed independently rather than cropped from desktop

## Performance constraints

- WebGL2 remains mandatory baseline where currently supported.
- Mobile must remain interactive on the existing compact path.
- Environmental dressing must use bounded counts / deterministic LOD.
- Avoid texture-heavy dependencies unless repository-local and justified.
- No network-fetched runtime assets.
- Reduced-motion must suppress unnecessary environmental motion while preserving the same semantic world state.

## Acceptance matrix

The Pass 2 candidate is not acceptable until all of the following are demonstrated.

### Structural

- Step 9 geography verifier remains PASS.
- Step 10 cross-environment geography correspondence remains PASS.
- No independent coastline equation appears in Characters.
- No independent terrain authority appears in Characters.
- No duplicated destination coordinates are introduced.

### Browser

- Desktop WebGL2 PASS.
- Mobile WebGL2 PASS.
- Reduced-motion PASS.
- Orbit -> destination -> inspect -> return PASS.
- Coast map PASS.
- No page errors.
- No horizontal overflow.

### Visual

- Orbit view is compelling with cards closed.
- At least four major geographic zones are visually distinguishable at regional scale.
- Shoreline contact no longer reads as a simple polygon boundary.
- Terrain exhibits multiple readable material families.
- Water retains motion and gains stronger coast/moon response.
- Near/mid/far atmospheric separation is visible.
- Every cardinal locality has a distinct approach composition.
- Mirror Manor remains regional/nonfinal but no longer reads as a bare placeholder icon.
- Mobile views avoid dominant blank terrain planes and excessive dead sky.

### Preservation

- Primer Play / Skip / Replay survives.
- Discovery state survives.
- Reduced-motion semantics survive.
- No scenes or gameplay are constructed.
- H-Earth traversal authority is unchanged.

## Sequence after this package

1. Construct environment-only Pass 2 on an isolated successor branch.
2. Run structural and empirical browser gates.
3. Perform full visual inspection at orbit plus every destination on desktop/mobile/reduced motion.
4. Correct only environment-elevation defects within this scope.
5. Freeze the accepted environmental result.
6. Only then begin Pass 3 destination differentiation refinement if additional locality-specific work remains.
7. UI/card/control redesign remains Pass 4 and must not be used to disguise a weak environment.

## Construction readiness verdict

`READY_FOR_BOUNDED_ENVIRONMENT_ELEVATION_CONSTRUCTION`

The geography and interaction architecture are protected. The next construction operation may focus aggressively on visual world quality without reopening world authority, character scenes, or gameplay.