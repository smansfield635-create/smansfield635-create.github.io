# H-Earth OW01 Weather Gate-H Benchmark v1

Status: `NONPUBLIC_NONPRODUCT_DEVICE_BENCHMARK`

Parent architecture head: `fa1495eef1252b05cc75da22e548b459f4bc3bc5`

Architecture PR: #748

Architecture issue: #746

Product construction authority: `FALSE`

This package measures the cost and basic deterministic/numerical behavior of a representative Audralia weather dynamic-core kernel on the actual phone/tablet targets. It does not render clouds, does not mutate the Showroom, and does not claim Gate H closure by itself.

## Purpose

The benchmark answers the first Gate-H question:

`WHAT GLOBAL CUBED-SPHERE WEATHER STATE CAN THE TARGET DEVICE UPDATE WITHOUT COMPROMISING INTERACTION BUDGET?`

It benchmarks the frozen candidate matrix:

- C16L3
- C24L3
- C16L5
- C24L5
- C32L3
- C32L5

C48 is intentionally excluded from the first device pass because it is a ceiling candidate and should only be tested if lower-cost configurations leave substantial measured headroom.

## Kernel represented

The benchmark uses:

- six-face gnomonic cubed-sphere topology;
- cross-face neighbor mapping in canonical 3D planetary coordinates;
- tangent-plane horizontal flow;
- mass/pressure-gradient response;
- Coriolis-like latitude-dependent rotation term;
- thermal and moisture transport work;
- saturation/condensation, liquid/ice partition and bounded precipitation work in the moist pass;
- deterministic typed-array state and double buffering.

This is a cost/architecture prototype, not the final atmospheric solver and not an operational numerical weather model.

## Built-in validation

The first device pass reports:

- cubed-sphere seam-neighbor integrity;
- rest-state invariance;
- deterministic replay checksum;
- finite/positive state checks;
- dry-dynamics p50/p95/p99 time per tick;
- moist/full-kernel p50/p95/p99 time per tick;
- estimated canonical-state/grid memory;
- event-loop yield delay during benchmarking;
- device/browser metadata where exposed.

The full Gate-H scientific suite in `benchmark-matrix.v1.json` remains required after a compute profile is selected. Passing this benchmark does not authorize a cloud product candidate.

## Running

Open `index.html` through the immutable branch/commit URL on the target device and press **Run Gate-H compute benchmark**. The benchmark runs cheapest-first and yields between batches so the browser remains responsive.

Copy the JSON receipt after completion and preserve separate receipts for phone and tablet.

## Stop rule

If the benchmark crashes, causes browser/context instability, or becomes visibly unresponsive, record the failure rather than forcing the higher-cost configurations.

`VISUAL_WORKAROUND_FOR_DEVICE_FAILURE = PROHIBITED`
