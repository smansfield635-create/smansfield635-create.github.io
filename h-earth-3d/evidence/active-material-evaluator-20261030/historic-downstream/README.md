# H-Earth Gen3000 — exact historic witness downstream stage closure

**Research-only, not a product repair or GPU-equivalent replay.** This is the next bounded step after the exact atlas/margin texel checkpoint at Gen3000 head `259b000ebca308866d831ff68420d433f338d9c8`. Frozen product candidate `3ea149e5b56e8cc0d5aac192bce0cdd47da7e626`. Historical prior material pre-overlay source pair remains unchanged.

## Result

The exact original source **contact-field routine** (identical bytes in the frozen original and candidate 3ea149) was executed against the verified original mesh without a geological patch. It produced 434 source water-contact segments with saturation 64 m. Original triangle offsets `144` and `73902` (six original mesh vertices, two source memberships for first witness) each have contact 64. Existing geological patch construction is regionally disjoint, not a new 64 m contact source near these witnesses. The source mask `(1 - smoothstep(10,38,contact))` is therefore **exactly zero**, excluding sand / steep-bank effects at the two original world points. The original coasts are approximately 620 m inland and original historical captures were independently verified previously.

All downstream **material color** stage gates are inactive there: four manor stages (outside center/rings), Site B (negative mountain edge), steep-bank (hillside envelope 0), sand (contact 64), shoreline-root soil (outside rectangle), woodland litter (outside forest domain), habitat (outside all three source-confirmed atlas panels), and bank gravel (outside window). This is a source-domain result *independent of camera eye and source normal*, assuming finite valid shader inputs. No texture fetch for those overlays is required.

Consequently the previously computed exact original conditional pre-later material transition is unchanged through the **remaining material color layers**, for *each* original source assignment:

| original candidate assignment | Native ΔR | Current post-material conditional ΔR | Two-point ΔR magnitude reduction |
| --- | ---: | ---: | ---: |
| `144 → 144` | -0.0327371209859848 | -0.0126066172878474 | 61.4914% |
| `73902 → 144` | -0.03254130482673645 | -0.012412192259288801 | 61.8571% |

This is **not** a present-day GPU pixel, a full landscape result, a current depth-owner determination, or a final lit RGB/fog claim. Saved candidate cameras exclude both witness points. The original source model P, mip and normal arithmetic remain conditional. It does not qualify correcting the other owner-observed straight and curved material seams.

## Immutable inputs and provenance

- Original paired execution archive: `H-Earth-paired-material-executed-20261029.zip`, SHA-256 `08b0c3ae8e1cc3c318b7fa1ada6d01e75370f5423745f2250db6354805b3fdef`, retained in H-Earth Library. Contains original `input/world-renderer.js`, `input/mesh-cpu/upload-positions.bin`, `input/mesh-cpu/upload-indices.bin`.
- Original exact package with primitive spans: `H-Earth-corrected-material-application-20261029.zip`, SHA-256 `5bfce62703c70fd5b68e894fca8634e5206c1ca681d7a127c192312a8e06aa3c`, file `evidence-inputs/original-mesh/mesh/package.json`, retained in H-Earth Library.
- Prior exact current pre-later texel packet: `H-Earth-Gen3000-exact-witness-material-20261030.zip`, SHA-256 `6e472b56dd2cf45f437b54359cecb3b60a39a402b8cc295052a79d7744c78b31`, retained in H-Earth Library.
- Frozen original uploaded mesh: 141,373 vertices, 366,666 indices, exact position SHA-256 `342a2a788009410bf48a6b5889a55cad4afd97552ff02b72f98b1308f7f84b83`, index SHA-256 `483f7693f29225e52fa90700837015741e78edb291de9adb785a8db3a74d616c`, original renderer SHA-256 `fa6acc426c75c3b2292b3ed76a756157698d8e7a5562511ad7ced5af58e25dec`.
- Current Gen3000 ordered material source blob `3d90fbe75209bb49222b78c155149a738cb0365e`, ordered-material report blob `ebb5f2cad7e7a433eef799548d946adac6e9eb5e`. The source historic contact function is identical across frozen original and current candidate; verification against GitHub performed separately.

## Reproduce

From source archives:

```bash
unzip -p H-Earth-paired-material-executed-20261029.zip input/world-renderer.js > renderer.js
unzip -p H-Earth-paired-material-executed-20261029.zip input/mesh-cpu/upload-positions.bin > positions.bin
unzip -p H-Earth-paired-material-executed-20261029.zip input/mesh-cpu/upload-indices.bin > indices.bin
unzip -p H-Earth-corrected-material-application-20261029.zip evidence-inputs/original-mesh/mesh/package.json > package.json
node contact-field.cjs
HEARTH_PRIOR_PACKET=/path/to/H-Earth-Gen3000-exact-witness-material-20261030.zip python3 prove_later.py
python3 independent_review.py
HEARTH_PRIOR_PACKET=/path/to/H-Earth-Gen3000-exact-witness-material-20261030.zip python3 -m unittest -v test_post_margin.py
```

The original source contact replay emits full stats, vertex IDs, and values; the post-material proof refuses missing/mismatched original identities. Original source and current product are never edited. `test_post_margin.py` includes an adversarial counterexample showing sand could activate if contact were only 20 m; thus zero is **not assumed globally**.

## Remaining acceptance boundary

The historical local material source contrast is reduced in the stated conditional model, but the current visible fragment owner and current camera output are unmeasured. A separately authorized, properly framed fixed-source baseline/candidate GPU comparison is the next visual gate **if** the source evidence warrants it, alongside healthy meadow controls; do not claim or dispatch a GPU job from this evidence alone. Broad owner-reported hard lines and world coverage still require their own evidence. No production edit, merge, publication or new GPU run performed here.