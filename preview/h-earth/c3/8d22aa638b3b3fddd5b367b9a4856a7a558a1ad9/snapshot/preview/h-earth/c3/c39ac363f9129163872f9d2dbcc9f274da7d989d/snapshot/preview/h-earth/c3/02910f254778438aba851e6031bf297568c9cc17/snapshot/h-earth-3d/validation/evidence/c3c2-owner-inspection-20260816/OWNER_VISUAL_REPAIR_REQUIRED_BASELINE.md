# H-Earth C3C2 owner inspection — REPAIR_REQUIRED baseline

Frozen candidate under inspection: `4fdbbffb95018cec50372678d7631843249f52bd`

Disposition: `REPAIR_REQUIRED — C3C2 construction present, intended visual expression not materialized`.

Owner-navigated inspection evidence supplied 2026-08-16:

| file | SHA-256 | bytes | dimensions | observation |
|---|---|---:|---:|---|
| `23729.jpg` | `7dd413f0f09da2a3c2d1a8bcad705b4cb0fdb2b52e01c4b41eaefe69bbceb3a6` | 112228 | 709×1536 | large flat pale atmospheric field; horizon still perceptually low; constructed celestial/atmospheric closure not legible |
| `23723.jpg` | `d011b5197159b1c3e15cf91110dd7ee07e3c9f427b8461cccccfd488be6fda0c` | 117704 | 709×1536 | lateral/landward view retains abrupt low-detail visual termination character; no convincing aerial-depth closure |
| `23727.jpg` | `ed98d99993b2c3bcfcedf2111acf22240c0a411f0e3aa321b0fc0985150b3f3d` | 107511 | 709×1536 | ocean occupies more frame but still reads as flat local mesh against a canvas-like sky; no visible sun or atmospheric horizon integration |
| `23725.jpg` | `5854d7b968d4fe5f4ed2ba98afe73165e6549d1625cc702c9d916736783950f7` | 116505 | 709×1536 | northeast/open-ocean geography survives, but atmospheric enclosure and distant-world expression remain visually ineffective |

## Preserved successes

The repair MUST preserve the owner-accepted C3C1/C3C2 geography:

- northeast/east remains true open ocean with no opposing landmass;
- north-to-east coastal turn remains intact;
- accessible-region dimensions, navigation addresses, and collision extent remain unchanged;
- mountain/pass/valley/coastal relationships remain intact;
- no new playable-region enlargement.

## Repair-required defects

- `VR1`: sky pass executes but reads as an undifferentiated pale canvas rather than a physical atmospheric volume.
- `VR2`: sun/celestial reference is not visibly legible in owner navigation.
- `VR3`: ocean/sky boundary remains perceptually too low and flat; the intended curved/raised planetary horizon is not visually established.
- `VR4`: aerial depth and distant-continuation blending are too weak to hide world-edge character.
- `VR5`: prior qualification proved execution and framebuffer presentation, but not visual-materialization effectiveness.

## Mandatory acceptance standard for successor

The next candidate is not inspection-ready merely because WebGL boots. It must produce machine-captured evidence that the final presented framebuffer visibly contains a nontrivial sky gradient, a celestial light reference, a materially raised/curved horizon treatment, and atmospheric distance separation while preserving the frozen coastal geography. Direct owner navigation remains mandatory after machine qualification.
