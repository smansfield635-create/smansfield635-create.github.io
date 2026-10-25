# Landscape coherence: first candidate

Operation H_EARTH_LANDSCAPE_COHERENCE_20261025_001, admitted generation 2892, baseline a955845640df5f1ed9dda6dcb74226e35e8ce3e5. This candidate follows the owner's six screenshots and performance-conscious web audit.

The existing production single-owner vegetation path bypasses the older woodland/global selectors. This pass therefore changes active shading only: shared world-space grass/occupied-ground palette, consistent sunward soil lighting, removal of screen-derivative curvature amplification, a feathered woodland habitat atlas boundary, and continuous dry-colour blending between overlapping foothills. Legacy selection, root records, plant counts, geometry, camera and collision are unchanged. No additional textures or draw calls are introduced by the source change. This does not imply identical GPU execution cost.

Independent West source review and 25,520 foothill samples preserve density and every non-colour metadata field exactly. Source/field/alias tests and bounded scene/resource comparisons are included. Measured source identities are in source-manifest.json. Existing camera and cavern repair evidence carries forward because their bytes remain unchanged; this pass still needs scene verification.

Browser evidence is a controlled headless software-GPU comparison at 540x1000, DPR1, using six supported diagnostic viewpoints. Diagnostic presentation exposes the existing present function; final navigation sequence is checked against the actual renderer receipt. These are fixed-view comparisons, not proof that normal movement traversed the connecting routes. Warmup and small turn samples are diagnostic only and insufficient for p95/p99 or sustained performance acceptance.

An initial baseline run encountered missing lazy-loaded tree assets and severe software-GPU stalls. It is excluded from qualification. Complete-tree-cache baseline and candidate runs replace those observations. Loading measurements use a local asset server and cannot establish real network startup speed.

Release remains pending repeated motion/performance testing, visual review and actual Android candidate acceptance using an existing lawful exact-head preview. A software-GPU run cannot satisfy the phone requirement; production deployment must not be used as a preview workaround. This candidate is not a claim that the entire landscape is finished or that geometry silhouettes and all habitat boundaries are repaired.

## Reproduction

Run from repository root:

    node --test h-earth-3d/evidence/landscape-coherence-v1/*.test.mjs

The browser replay requires puppeteer-core, headless Chrome, the exact baseline source overlay and the published asset cache. Its server must resolve all requested assets successfully. See the committed replay scripts and manifests; do not use the excluded preliminary run as performance evidence.

## Primary research informing this pass

- Mozilla WebGL best practices: https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices
- Arm transparency profiling: https://developer.arm.com/documentation/102471/latest/Profile-and-compare-transparency-implementations/Alpha-test
- Terrain continuity research: https://hhoppe.com/proj/geomclipmap/
- Fog rendering semantics: https://threejs.org/manual/pages/fog.html

These sources motivate measurement and bounded rendering choices. They do not establish this candidate's performance or justify an engine replacement.

View labels are diagnostic identifiers, not claims of visible habitat coverage: hill-river faces uphill without showing the river, woodland-edge lacks a canopy, and cavern-upper does not show the interior. True river/canopy views and connecting movement remain outstanding. The first candidate improves palette/lighting agreement; unchanged grass density edges remain visible.

All 130 observed baseline resource files were verified against their exact Git blobs with zero mismatches. Six complete baseline/candidate views have zero runtime/HTTP errors and equal vegetation resource receipts. One bare-mountain diagnostic has an upper-median frame duration of49.5ms versus16.9ms; four samples cannot distinguish noise from regression, so performance remains unaccepted and needs repeated investigation. Canonical package and persistent object counts also match.
