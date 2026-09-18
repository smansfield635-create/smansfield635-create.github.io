# SECRET OF LIFE APPAREL — Asset Treatment Law v1

Status: FROZEN PRE-CONSTRUCTION TREATMENT LAW  
Project: CONSIDER_THE_ENERGY  
Repository: `smansfield635-create/smansfield635-create.github.io`  
Frozen product baseline: `b0ed15ab4951018f2be1eaa027c422b6b060ec60`  
Pre-construction branch: `cte-secret-of-life-apparel-preconstruction-v1`  
Prior source manifest commit: `2dfd886bb171113617f86276f43cbeeab4705cc2`

This law governs normalization of the exact source assets frozen in:

`docs/consider-the-energy/SECRET_OF_LIFE_APPAREL_SOURCE_ASSET_MANIFEST_v1.json`

It authorizes treatment only. It does not authorize HTML construction, product publication, redesign of approved artwork, or use of unlisted source images.

## 1. Governing principle

Normalization exists to remove capture artifacts and isolate the approved visual subject.

The governing equation is:

`SOURCE CAPTURE - UI / BACKGROUND / EDGE RESIDUE = APPROVED SUBJECT`

Normalization must not become:

`SOURCE CAPTURE -> REDESIGNED PRODUCT OR REINTERPRETED ARTWORK`

The approved design remains the authority.

## 2. Shirt treatment class

Applies to:
- Learn to Live to Love
- Fear / Love
- Manipulation
- any future shirt added by explicit manifest amendment

### Allowed operations

1. Crop away browser, ChatGPT, Messenger, Instagram, device, or screenshot chrome.
2. Remove source backgrounds that are not part of the garment or printed design.
3. Isolate the complete garment silhouette.
4. Convert the exterior background to transparency when appropriate for site presentation.
5. Remove white, gray, or colored matte residue outside the garment perimeter.
6. Remove obvious haloing created by source-background extraction.
7. Repair only perimeter contamination that is clearly outside the garment.
8. Preserve natural soft fabric edges where they belong to the shirt.
9. Preserve the garment's actual proportions and silhouette.
10. Preserve all approved printed artwork, text, logo placement, color relationships, gradients, texture, and visible fabric treatment.
11. Normalize canvas bounds and empty padding for consistent catalog presentation.
12. Resample only when necessary for web delivery, without altering visual meaning.

### Prohibited operations

1. No redesign of shirt artwork.
2. No rewriting, re-typesetting, correcting, or substituting printed text.
3. No generative reconstruction of missing print details.
4. No style transfer.
5. No recoloring of the garment or artwork for aesthetic consistency.
6. No artificial reshaping of sleeves, collar, hem, torso width, or drape.
7. No smoothing that erases legitimate fabric texture.
8. No invented shadows, mannequin forms, bodies, environments, hangers, or product staging.
9. No removal of intentional glow, paint, fade, distressing, or printed edge effects that belong to the design.
10. No replacement of the shirt with a newly generated mockup.
11. No treatment that makes a screenshot-derived garment appear to be a different physical product than the approved source.
12. No semantic edits under the label of cleanup.

## 3. Shirt edge law

The edge decision is:

- material belonging to the garment: KEEP;
- printed artwork extending naturally to the garment edge: KEEP;
- fabric softness / anti-aliasing that follows the garment contour: KEEP;
- external white/gray background fringe not belonging to the garment: REMOVE;
- detached source-background islands: REMOVE;
- ambiguous pixels: PRESERVE unless exclusion is visually provable.

The objective is not a mathematically hard cutout. The objective is a natural garment edge with no visible source matte.

No perimeter treatment may materially narrow, enlarge, straighten, or otherwise redraw the shirt silhouette.

## 4. Shirt transparency law

For isolated merchandise presentation:

- everything outside the garment becomes transparent;
- garment fabric remains opaque or naturally semi-opaque according to the source;
- intentional printed glow/fade remains part of the garment image;
- transparency may not punch holes through cream, white, light-gray, or faded fabric merely because those pixels resemble the source background.

For light-colored shirts, garment preservation outranks aggressive background removal.

## 5. Editorial graphic treatment class

Applies to:
- Five D's of Deceit
- Gratitude vs. Entitlement
- Expectations Without Limitations
- 7 D's of Decision Making
- any later editorial graphic added by explicit manifest amendment

### Allowed operations

1. Crop away application, social-media, browser, notification, and device chrome.
2. Remove surrounding blank capture space that is not part of the artwork.
3. Preserve the complete authored graphic composition.
4. Normalize framing and canvas bounds for coherent page presentation.
5. Resample for web delivery if necessary.
6. Remove only accidental screenshot contamination that clearly overlays or surrounds the authored graphic.

### Prohibited operations

1. No rewriting or correcting the graphic's wording.
2. No rearrangement of text, icons, logos, diagrams, or composition.
3. No rebuilding the graphic into a new visual style.
4. No generative enhancement that changes authored content.
5. No conversion of the graphic into a shirt mockup.
6. No implication that the graphic is purchasable merchandise unless a separate approved merchandise source exists.
7. No cropping that removes meaningful authored content merely to fit a layout.
8. No insertion of new slogans, captions, citations, branding, or decorative elements inside the graphic itself.

## 6. Editorial-environment law

Editorial graphics are not filler.

Their allowed role on Surface B is:

- conceptual interlude;
- visual pacing;
- philosophical context;
- transition between apparel groups;
- explanation of the idea family from which nearby apparel emerges.

Their prohibited role is:

- random decoration;
- background clutter;
- repetitive wallpaper;
- fake product tile;
- substitute for missing merchandise;
- visual noise inserted only to fill space.

Every editorial graphic used in construction must have a nearby conceptual reason for appearing.

## 7. Original-content preservation law

For both shirts and editorial graphics:

`CLEANUP AUTHORITY != AUTHORSHIP AUTHORITY`

Normalization may expose the original content more clearly. It may not create new content.

Where source capture quality limits what can be recovered, the lawful choices are:
- preserve;
- crop less aggressively;
- hold the asset;
- request a better source.

Inventing replacement content is not an allowed recovery method.

## 8. Output-format law

Normalized shirt outputs:
- preferred format: PNG with transparency;
- destination namespace: `campaigns/consider-the-energy/assets/`;
- filenames are the exact destinations frozen in the source asset manifest;
- no lossy format substitution for isolated shirts unless separately approved.

Normalized editorial outputs:
- JPEG or PNG may be used according to source/artwork needs;
- destinations are the exact paths frozen in the source asset manifest;
- compression must not visibly damage text legibility or authored graphic detail.

## 9. Output-identity law

No normalized asset becomes construction-authoritative until its resulting bytes are frozen.

For every normalized output, the next checkpoint must record:
- repository destination path;
- file format;
- pixel dimensions;
- byte length;
- SHA-256 of exact output bytes;
- Git blob SHA after repository materialization, when installed;
- source assetId from the frozen manifest;
- treatment result: PASS / HOLD.

HTML construction may reference only normalized outputs whose identity is frozen, or existing repository assets whose identity was already frozen.

## 10. Review law

Normalization review asks only:

1. Is the intended subject intact?
2. Is capture UI removed?
3. Is external matte/background removed where required?
4. Are garment/artwork edges natural?
5. Is all authored print/art preserved?
6. Has any design content been changed?
7. Is the asset suitable to fall naturally into the page environment?

It does not reopen:
- shirt design;
- slogan wording;
- collection membership;
- page architecture;
- commerce strategy;
- editorial philosophy.

## 11. Failure / hold conditions

An asset must be HELD rather than forced through normalization if:

- shirt/background separation cannot be made without damaging light garment fabric;
- screenshot obstruction covers meaningful artwork;
- source resolution is insufficient for intended display size;
- garment silhouette is materially missing;
- authored text cannot be preserved reliably;
- the source identity does not match the frozen manifest;
- cleanup would require generative redesign rather than extraction.

A held asset does not block unrelated approved assets from being normalized.

## 12. Surface-specific application

### Surface A — Community Object

Only the normalized Learn to Live to Love shirt may be newly introduced under this treatment law.

Existing Learn to Love to Listen and Learn to Live to Laugh repository assets remain byte-preserved.

Higher the Risk / Higher the Ceiling is removed only from the trilogy position; its existing repository asset remains preserved for Surface B.

### Surface B — Secret of Life Edition / Apparel Editorial Catalog

May use:
- the complete frozen Secret of Life trilogy;
- approved general CTE apparel;
- approved editorial graphics;
- only normalized/frozen outputs or existing frozen repository assets.

No other Drive image becomes eligible merely because it resembles CTE content.

## 13. Construction gate

This law does not open HTML construction.

The construction gate remains:

`SOURCE MANIFEST FROZEN + TREATMENT LAW FROZEN + NORMALIZED OUTPUT IDENTITIES FROZEN -> HTML CONSTRUCTION MAY BEGIN`

Current state after this packet:

- exact baseline: FROZEN
- two-surface scope: FROZEN
- source asset manifest: FROZEN
- asset treatment law: FROZEN
- normalized output identities: NOT YET FROZEN
- HTML construction: BLOCKED PENDING NORMALIZED OUTPUT IDENTITIES

## 14. Next deterministic checkpoint

Normalize only the Drive sources listed in the frozen source manifest according to this law.

Then freeze:

`SECRET_OF_LIFE_APPAREL_NORMALIZED_ASSET_IDENTITIES_v1`

No product HTML mutation precedes that checkpoint.
