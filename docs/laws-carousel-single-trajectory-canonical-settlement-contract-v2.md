# Laws Carousel Single-Trajectory Canonical Settlement Contract v2

Status: **FROZEN CONSTRUCTION AUTHORITY**

This contract supersedes the narrower continuous-pointer qualification as the controlling authority for the unresolved real-device Laws destination-carousel defect. Continuous pointer geometry is necessary but is not sufficient for acceptance.

## Sole construction target

A single physical swipe must produce exactly one continuous spatial traversal from the current canonical card to the selected canonical card, with no independently owned intermediate state, no delayed recentering, no second-stage correction, and no semantic/visual disagreement.

`ONE FINGER GESTURE = ONE CONTINUOUS TRAJECTORY = ONE CANONICAL LANDING = ZERO POST-LANDING CORRECTIONS`

No unrelated repair or visual improvement is authorized until this contract passes.

## Deterministic defect definition

The implementation FAILS whenever one physical gesture can produce any sequence equivalent to:

`canonical A -> intermediate/noncanonical geometry -> release -> semantic state B while geometry is not canonical B -> later render/timer/event/correction -> canonical B`

The implementation also fails if another swipe, render, timer, focus event, resize event, restoration event, or delayed correction is required to obtain the correct centered frame after the original gesture resolves.

The only lawful transaction is:

`C_i --pointer drag--> P(t) --pointer release/settlement--> C_j`

where `C_i` is the exact canonical starting frame, `P(t)` is one continuous finger-coupled trajectory, and `C_j` is the exact canonical destination frame.

## Single spatial authority

At every time `t` there is exactly one authoritative unwrapped orbit coordinate:

`p(t) in R`

The entire visible carousel geometry is derived solely from that coordinate:

`G(t) = F(p(t))`

No other state may independently command visible carousel geometry. In particular, the following may not become independent spatial authorities:

- committed semantic index;
- drag-preview state;
- CSS transform interpolation;
- delayed settle state;
- focus-driven selection;
- initialization state;
- restoration state;
- resize state;
- timeout completion state.

The index never commands geometry. The orbit coordinate commands geometry; semantic state reflects the resulting detent.

## Required spatial state machine

Only these spatial phases are lawful:

`RESTING -> DIRECT_MANIPULATION -> SETTLING -> RESTING`

A pending axis-classification phase may exist before `DIRECT_MANIPULATION`, but it has no authority to mutate geometry.

### RESTING

`p = k`, where `k` is an integer detent.

The rendered frame must be exactly `F(k)` and therefore canonical.

### DIRECT_MANIPULATION

For a horizontally admitted pointer transaction:

`p(t) = p0 - (x(t) - x0) / S`

with the previously frozen step law `S = 0.72W` unless separately superseded by explicit design authority.

Every admitted pointer sample immediately evaluates `G(t) = F(p(t))`.

CSS transition interpolation is prohibited during direct manipulation.

### SETTLING

At pointer release, choose exactly one target detent:

`q = nearestDetent(p_release)`

Settlement starts from the exact release coordinate and animates the same authoritative coordinate:

`p_release -> q`

using one deterministic easing function `E(t)`, for example:

`p(t) = p_release + (q - p_release) E(t)`

Every settlement animation frame recomputes the entire carousel from `F(p(t))`.

**Settlement may animate `p`; it may never independently animate card transforms.**

Timer-based spatial completion is prohibited. A timeout may not be used as evidence that CSS has probably reached the intended geometry. Settlement completion is owned by the coordinate/renderer itself.

At completion:

`p = q`

and immediately:

`G = F(q) = C_q`

No subsequent recentering or correction is permitted.

## Canonical-frame postcondition

For settled detent `q`:

- `p` is exactly an integer detent;
- active-card relative distance is exactly `0`;
- immediate neighbors are rendered from exact relative distances `-1` and `+1` (subject to circular nearest-copy law);
- every visible transform, depth, rotation, scale, opacity, blur, and stacking value is the canonical output of `F(q)`;
- no fractional settled geometry remains.

Hard postcondition:

`p in Z AND d_active = 0 AND G = F(p)`

A settled frame containing residual fractional orbit geometry is a failure.

## Semantic authority

During direct manipulation and settlement, semantic state may not independently reposition the orbit.

The committed semantic index is derived from the selected detent:

`i = mod(q, N)`

Semantic index, `aria-current`, visible `n / N`, destination identity, and selection-change publication may update when the destination detent is committed, but none may create a second spatial command.

## Transaction custody

Every admitted physical swipe receives one transaction identity `tau`.

From horizontal custody acquisition until exact canonical settlement completes:

`tau_active => no competing carousel transaction may acquire spatial authority`

During an active transaction, competing requests from focus, click, restoration, initialization, resize, observer callbacks, or another pointer must be rejected, deferred without geometry mutation, or reconciled into the same authoritative coordinate. They may not issue an independent reposition.

The transaction ends only after the canonical-frame postcondition is true.

Only then may another carousel transaction acquire authority.

## Circular seam

The orbit coordinate remains unwrapped throughout direct manipulation and settlement. Circular modulo is applied only to semantic identity, not to the live spatial coordinate.

Example for four cards:

`3.0 -> 3.2 -> 3.5 -> 3.8 -> 4.0`

is the lawful spatial traversal from logical `4 / 4` to logical `1 / 4`.

There may be no seam discontinuity or hidden modulo jump.

## Cancellation

Pointer cancellation is part of the same transaction. It settles the same authoritative coordinate back to the originating canonical detent. It may not create a second renderer or correction path.

## Explicit prohibitions

The next implementation MUST contain no behavior equivalent to:

- index-first rendering;
- direction-only pointer handling;
- CSS-owned independent card-transform interpolation;
- timeout-defined spatial settlement;
- focus-driven reposition during an active gesture transaction;
- restore/init/resize-driven reposition during an active transaction;
- a second correction after release;
- residual fractional geometry after settlement;
- a new gesture transaction before canonical landing;
- semantic state and visible geometry representing different cards after settlement.

## Mandatory continuous transaction trace

Qualification may not rely on final screenshots or a handful of intermediate snapshots alone.

For every relevant pointer/animation frame, retain a trace containing at least:

`(timestamp, transactionId, phase, pointerX, p, targetDetent, semanticIndex, activeCardRelativeDistance, renderedGeometryDigest)`

During direct manipulation, prove for every sampled frame:

`G_n = F(p_n)`

and prove that orbit displacement corresponds causally to pointer displacement.

During settlement, prove that the same `p` approaches exactly one selected target `q` monotonically:

`abs(q - p_(n+1)) <= abs(q - p_n)`

with strict progress on animation frames until the terminal coordinate is reached, allowing only duplicate samples caused by display sampling.

There may be no reversal, second target, post-release jump to another coordinate authority, or geometry mutation inconsistent with `F(p)`.

## Mandatory post-settlement guard

After canonical settlement is declared, continue observing for at least 1000 ms.

For every sample in the guard interval:

`p(t) = q`

and

`G(t) = C_q`

No transform, orbit coordinate, semantic destination, or active-card identity may change during this guard unless a new deliberate user transaction begins.

This guard is mandatory because a system that appears to land and then corrects itself later is the unresolved failure class.

## Mandatory real-device qualification

Synthetic Chromium evidence is necessary but not sufficient to close this defect.

Before merge/live closure, the candidate must be exercised on at least:

1. a phone-class touch viewport/device; and
2. a tablet-class touch viewport/device.

For each, retain evidence of repeated forward and reverse single-finger traversals, including circular seam traversal. Each physical swipe must independently reach one canonical landing without requiring a second swipe or delayed correction.

If direct physical-device automation is unavailable, the cycle remains `DEVICE_VALIDATION_REQUIRED`; it may not be pronounced fully closed merely because desktop/synthetic automation passes. User-supplied physical-device recordings are admissible evidence but must be evaluated against this exact contract.

## Mandatory qualification matrix

A candidate must pass all of the following on the exact candidate bytes:

1. **Direct-manipulation causality:** visible geometry changes continuously before release and corresponds to pointer displacement.
2. **Single renderer:** every recorded geometry sample equals `F(p)` for the same authoritative coordinate.
3. **Semantic non-interference:** semantic state never generates an independent spatial movement.
4. **Single target:** release selects exactly one target detent.
5. **Monotonic settlement:** the authoritative coordinate approaches only that target until exact landing.
6. **Canonical landing:** terminal state satisfies `p in Z`, `d_active = 0`, and `G = F(p)`.
7. **No post-landing correction:** 1000 ms guard remains byte/geometry stable.
8. **Circular seam continuity:** unwrapped traversal remains continuous through logical wrap.
9. **Vertical passthrough:** predominantly vertical gesture does not rotate the carousel and page traversal remains available.
10. **Cancellation:** cancellation returns through the same coordinate authority to the original canonical detent.
11. **Transaction exclusion:** competing focus/click/restore/resize/init events cannot reposition the orbit during an active transaction.
12. **Repeated gestures:** multiple consecutive swipes each begin from the prior exact canonical landing and each independently complete in one transaction.
13. **Phone evidence:** real phone-class interaction satisfies items 1-12 insofar as observable/device-instrumentable.
14. **Tablet evidence:** real tablet-class interaction satisfies items 1-12 insofar as observable/device-instrumentable.

Any failure is `REPAIR_REQUIRED`.

## Binary acceptance boundary

The construction passes only if all answers are YES:

- Does one finger gesture create one and only one spatial transaction?
- Is there exactly one authoritative orbit coordinate for the entire transaction?
- Is every visible card derived solely from that coordinate?
- Does the pointer directly control that coordinate during manipulation?
- Does release choose exactly one destination?
- Does settlement animate the same coordinate rather than card transforms independently?
- Does the transaction terminate at exact canonical geometry?
- Does the frame remain unchanged for the full post-settlement guard?
- Can the next swipe begin from that exact canonical frame without first correcting anything?
- Does the same law hold on phone and tablet interaction?

If any answer is NO, merge/closure is prohibited.

## Frozen construction law

`ONE FINGER GESTURE = ONE CONTINUOUS TRAJECTORY = ONE CANONICAL LANDING = ZERO POST-LANDING CORRECTIONS`

The next construction cycle is authorized to modify only what is necessary to make that statement mechanically true and prove it. Continuous movement alone is not acceptance. A correct final index alone is not acceptance. A visually correct frame reached after a second correction is not acceptance.
