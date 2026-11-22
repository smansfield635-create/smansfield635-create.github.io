# Diamond Gate — isolated spatial rain engineering laboratory

**State:** Admitted source candidate. **Not visually accepted, merged, deployed, or integrated** with the Field Study.

**Owner request:** Realistic rainy environment behind the existing dark-crimson Field Study; no more CSS stripes or low-resolution smeared textures.

## Authority and custody

- Canonical repository AI entry: `AI_ENTRYPOINT.json` and `AGENTS.md`.
- Canonical operation: `DGB_GRAPHICS_FIELD_STUDY_SPATIAL_RAIN_ISOLATED_LAB_20261122_001`.
- Admission: issue [#7622](https://github.com/smansfield635-create/smansfield635-create.github.io/issues/7622#issuecomment-7084778001), `ADMITTED_AND_LOCKED`, generation **3489**.
- Frozen governing `main`: `12d257e3b0b712ed39a71e22bbb0b81eedbc9b30`.
- Off-product, seven-path scope; separate consumer-adoption and exact-head release authority are mandatory. Do **not** merge or publish this candidate as-is.
- The existing Field Study continues to run the accepted dark-background version. Its three outer chapters, nested dropdowns, 100 numbered entries, and all notes are protected.

## Actual source architecture

1. `spatial-rain.v1.mjs` is a deterministic bounded three-dimensional rain field. It models **635 drops** in far (310), mid (220), and near (105) bands, with depth, position, velocity, wind, width, exposure, and optical opacity. `sampleDrop` explicitly demonstrates camera-parallax and gravity behavior; `buildRainMesh` prepares six triangles' vertices per drop (two triangles per drop).
2. `render.v1.mjs` creates an actual WebGL1/WebGL2 device by importing **unmodified** native E1 and E2 modules. E1 owns programs and mesh buffers; E2 submits four ordered passes. The background shader integrates a bounded cloud-density field along each pixel's view ray. The three rain meshes use perspective depth, variation in velocity/width/length and alpha blending.
3. `index.html` is a **standalone laboratory witness**, not the consumer page: normal scrolling, three openable red panels, native canvas behind content, no pointer interception, dark fallback if WebGL is unavailable, reduced-motion still-frame support and pause when hidden.
4. `spatial-rain.v1.test.mjs` covers deterministic world state, near/far parallax, gravity/wind advancement, finite mesh arrays, and error rejection.
5. `browser-qualification.v1.py` is a fail-closed *proposed* exact-source native browser qualifier. It must execute on the candidate with full original E1/E2 modules and actual framebuffers, and capture desktop/tablet/phone, reduced-motion and absent-WebGL cases.
6. `qualification.v1.json` separates achieved CPU/local smoke-test evidence from **pending** exact-source GPU and physical/perceptual acceptance.

Source precedents: `showroom/globe/audralia/canonical-weather-spatial-lod-proof/weather-model.mjs` and `weather-renderer.mjs` establish volume, LOD, atmospheric density and depth. They are read-only precedents and are not copied, patched or imported at runtime.

## Qualification so far

Run CPU tests from repo root:

```bash
node --test graphics-engine/rain-lab/spatial-rain.v1.test.mjs
```

They passed **5/5** in the isolated local environment.

Real WebGL framebuffer smoke captures also passed on WebGL1 and WebGL2 at phone (390×844), tablet (1024×768), and desktop (1440×900), including 4 draw passes and GL error 0. **Important limitation:** Those captures used **local, explicitly noncanonical E1/E2 API test shims**, though the WebGL contexts and GPU pixels were real. This is not proof that the repo's full accepted E1/E2 source compiles, uploads, restores, or renders this exact candidate.

The canonical browser qualifier may be run in an authorized environment with working HTTP and Chromium, e.g.:

```bash
python3 graphics-engine/rain-lab/browser-qualification.v1.py --root . --out /tmp/dgb-spatial-rain-qualification
```

Prerequisites: Python Playwright and Chromium. The current local container blocks browser navigation to local HTTP/file URLs; therefore **this exact-candidate qualification is pending** rather than marked passed. Do not run an arbitrary Actions workflow as a substitute; use an already admitted fixed qualification path or a local authorized builder.

## Visual acceptance and next boundary

Existing preliminary screenshots show rain geometry and perceptible near/mid/far depth over crimson cards, but visible droplets still appear as linear streaks in static captures. Realism, lighting, and trajectory need **direct visual judgment and likely iteration**. Do not mistake a valid GPU draw for credible weather.

Acceptance requires actual **original E1/E2** framebuffer evidence, accurate perspective and coherent motion, realistic cloud/rain coupling, smooth phone/tablet/desktop scrolling, interaction and reduced-motion tests, owner visual acceptance, and an explicitly separate authorized adoption into the Field Study. Failure leaves the dark background unchanged.

**No production changes, merge or release in this operation.**
