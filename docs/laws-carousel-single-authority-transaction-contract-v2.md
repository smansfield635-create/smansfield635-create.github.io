# Laws Carousel Single-Authority Transaction Contract v2

Status: **FROZEN CONSTRUCTION AUTHORITY**

This contract supersedes the sufficiency of the v1 continuous-pointer contract for the remaining real-device defect. V1 proved that intermediate pointer geometry can exist. V2 governs the complete physical transaction from canonical start through canonical landing.

## Sole construction target

**ONE FINGER GESTURE = ONE CONTINUOUS TRAJECTORY = ONE CANONICAL LANDING = ZERO POST-LANDING CORRECTIONS.**

No construction cycle governed by this document may substitute unrelated carousel, page, visual, navigation, entry-scroll, exhibit, footer, Compass, or verifier work for this target.

## Deterministic defect definition

The implementation fails whenever one physical swipe can produce any sequence equivalent to:

`canonical A -> intermediate/noncanonical geometry -> release -> semantic state B while geometry is not canonical B -> later render/timer/event/correction -> canonical B`

The implementation also fails whenever another swipe, render, timeout, focus event, initialization event, resize event, restoration event, or secondary correction is required to obtain the correct centered frame after the original physical swipe has resolved.

## Governing trajectory law

A single physical gesture is one transaction tau:

`C_i --pointer drag--> P(t) --pointer release--> C_j`

- `C_i`: exact canonical starting frame.
- `P(t)`: one continuous finger-coupled spatial trajectory.
- `C_j`: exact canonical destination frame.
- No independently authoritative persistent spatial state may exist between them.

At every instant there is exactly one authoritative unwrapped orbit coordinate:

`p(t) in R`

The complete visible geometry is derived solely from that coordinate:

`G(t) = F(p(t))`

where `G(t)` is the entire visible card field and `F` is one deterministic Euclidean renderer.

No card transform may be generated from an independently authoritative index, CSS transition state, delayed settle state, focus state, initialization state, restoration state, or other renderer-owned spatial state.

## Authority hierarchy

Spatial authority is strictly:

`transaction tau -> orbit coordinate p -> renderer F(p) -> visible geometry G`

The semantic index never commands geometry. At a settled detent it is derived from spatial state:

`i = mod(p, N)`

The semantic index may remain unchanged during direct manipulation, but it cannot create a second spatial authority.

## Spatial state machine

Only these spatially meaningful phases are admitted:

`RESTING -> DIRECT_MANIPULATION -> SETTLING -> RESTING`

Gesture-axis classification may occur before DIRECT_MANIPULATION, but it has no authority to mutate geometry.

### RESTING

`p = k`, where `k` is an integer detent.

The complete frame must equal the canonical renderer result:

`G = F(k) = C_k`

No settled state may retain fractional orbit geometry.

### DIRECT_MANIPULATION

After horizontal custody is acquired:

`p(t) = p0 - (x(t) - x0) / S`

with `S = 0.72W` unless a later separately admitted contract changes that physical scale.

Every pointer sample immediately evaluates:

`G(t) = F(p(t))`

CSS transition interpolation is prohibited during direct manipulation. The pointer and orbit coordinate are the only spatial clock.

### RELEASE

Exactly one destination detent is chosen from the exact release coordinate:

`q = nearestDetent(p_release)`

The deterministic half-detent tie rule from v1 remains binding: use last non-zero horizontal pointer velocity; if exactly zero, use accumulated drag direction.

No other destination may be chosen during the same transaction.

### SETTLING

Settlement begins at the exact release coordinate and animates the same authoritative orbit coordinate:

`p_release -> q`

A deterministic easing function may be used:

`p(t) = p_release + (q - p_release) E(t)`

but settlement may animate only `p`. Card transforms themselves may not own independent CSS transitions or other animation state.

Every settlement frame must satisfy:

`G(t) = F(p(t))`

Settlement completion is geometry-owned, not timeout-owned. A fixed timer such as `SETTLE_MS` must not declare spatial completion merely because CSS is expected to have finished.

At completion:

`p = q`

and immediately:

`G = F(q) = C_q`

The transaction cannot close before those equalities hold.

## Canonical-frame postcondition

For settled detent `q`:

- `p` is exactly the integer detent `q` within the implementation's explicit floating-point epsilon.
- active-card relative distance is exactly canonical zero within that epsilon;
- immediate neighbors have the exact renderer geometry for relative distances `-1` and `+1`;
- the entire visible field equals `F(q)`;
- no fractional residual transform is permitted after settlement;
- semantic index is `mod(q, N)`;
- visible `n / N`, `aria-current`, destination identity, and focus custody agree with that same canonical detent.

## Transaction exclusivity

From accepted pointer-down through canonical settlement completion, transaction `tau` owns the orbit.

While `tau` is active, competing spatial commands are rejected or deferred. This includes spatial mutation requests caused by:

- focus/focusin;
- neighboring-card click;
- keyboard navigation;
- initialization/remount;
- orbit restoration;
- resize/reflow reconciliation;
- exhibit return;
- secondary pointer/touch transaction;
- delayed callback or timeout.

Such events may perform non-spatial bookkeeping only if they cannot alter `p` or `G`.

A new carousel transaction may acquire authority only after the current transaction reaches exact canonical RESTING state.

## Cancellation

Pointer cancellation is part of the same transaction. It does not create a second transaction.

Cancellation chooses the originating canonical detent as `q` and settles the same authoritative `p` back to that detent using the same settlement engine. Semantic selection remains the original committed selection.

## Forbidden architecture

The following are prohibited in the next implementation:

1. index-first geometry rendering;
2. CSS-owned independent card-transform interpolation during drag or settlement;
3. timeout-defined spatial settlement;
4. competing focus-driven carousel repositioning during an active transaction;
5. post-release second-stage correction;
6. fractional geometry after declared settlement;
7. semantic/visual disagreement after settlement;
8. a new gesture acquiring spatial authority before canonical landing;
9. initialization/restoration/resize logic mutating the orbit during an active transaction;
10. any architecture in which more than one variable can independently command visible carousel position.

## Required implementation shape

The next construction must expose one spatial render path equivalent to:

`renderOrbit(p)`

All drag frames, settlement frames, keyboard/click integer transitions, cancellation, restoration, and canonical initialization must ultimately use that same renderer.

If an animation loop is required, it must animate `p` explicitly (for example with `requestAnimationFrame`) and call the same `renderOrbit(p)` on every frame.

There must not be a separate CSS transform-animation authority whose visual progress can diverge from JavaScript orbit state.

## Required transaction telemetry

The runtime must make qualification able to observe, at minimum:

- transaction ID;
- transaction phase;
- authoritative `p`;
- release coordinate;
- target detent `q`;
- committed semantic index;
- whether a competing spatial request was rejected/deferred;
- settlement completion frame/time;
- canonical postcondition result.

A transaction trace must be representable as samples:

`(time, transactionId, phase, p, i, geometrySignature)`

## Mandatory qualification v2

Passing v1 Q1-Q7 is necessary background evidence but is not sufficient for v2 closure.

### V2-Q1 — continuous transaction trace

Record the entire transaction from pointer-down through at least one second after canonical settlement.

For every spatial sample assert:

`G_n = F(p_n)`

No unexplained visible transform mutation may occur without a corresponding change in authoritative `p`.

### V2-Q2 — direct manipulation causality

During horizontal drag, successive pointer displacement and orbit displacement must be causally coupled according to the declared mapping. No index change, CSS animation, delayed callback, or other state may move the field independently.

### V2-Q3 — single-target release

At release capture `p_release` and exactly one `q`.

The target may not change for the remainder of the transaction.

### V2-Q4 — monotonic settlement

During settlement, distance to the chosen target must monotonically decrease, subject only to an explicitly documented numerical epsilon:

`abs(q - p[n+1]) <= abs(q - p[n])`

No reversal, second destination, plateau followed by a corrective jump, or secondary settle is permitted.

### V2-Q5 — exact canonical landing

At transaction completion assert simultaneously:

- `p = q` within explicit epsilon;
- `G = F(q)`;
- active relative distance is canonical zero;
- neighbor geometry is canonical `-1/+1`;
- semantic index, visible count, destination identity, and ARIA state agree with `mod(q,N)`.

### V2-Q6 — post-landing immutability guard

Continue observing for at least 1000 ms after settlement completion with no user input.

For every sample in the guard interval:

`p(t) = q` and `G(t) = C_q`

Any post-landing movement, correction, index mutation, focus-driven reposition, timer-driven mutation, or geometry change is a hard failure.

### V2-Q7 — transaction exclusivity stress

During a real pointer transaction inject/allow realistic secondary events including focus, resize/reflow, and delayed callbacks. Prove none can independently alter `p`, choose another target, or start another spatial transaction before canonical landing.

### V2-Q8 — repeated real-device-equivalent sequence

Execute repeated one-swipe transactions across every adjacent pair and across the circular seam in both directions. Every individual gesture must end in its intended canonical frame without requiring another gesture or correction.

### V2-Q9 — cancellation transaction

Cancel after visible direct manipulation. Prove the same transaction settles monotonically to its originating detent and remains immutable for the post-landing guard interval.

### V2-Q10 — retained visual evidence

Retain intermediate and post-landing frames for qualification. Final-state-only screenshots are insufficient. Evidence must make it possible to distinguish one continuous transaction from a state change followed by a later correction.

## Binary acceptance boundary

The candidate passes only if all answers are YES:

1. Is there exactly one authoritative orbit coordinate for the entire transaction?
2. Is all visible geometry derived only from that coordinate?
3. Does the finger continuously command that coordinate during direct manipulation?
4. Does release choose exactly one immutable destination detent?
5. Does settlement animate the same coordinate rather than independent card transforms?
6. Does settlement end at exact canonical geometry?
7. Is the semantic state identical to the canonical spatial state at completion?
8. Does the frame remain completely unchanged for the post-landing guard interval?
9. Are competing spatial requests unable to mutate the orbit during the transaction?
10. Can every single physical swipe complete without a second swipe/render/timer/event being required to correct the frame?

Any NO means `REPAIR_REQUIRED`. Merge and publication are prohibited.

## Device evidence rule

Automated browser qualification is necessary but is not sufficient to override contradictory physical-device evidence. A tablet or phone recording that demonstrates post-release correction, semantic/visual disagreement, stranded fractional geometry, or need for a second gesture reopens the defect regardless of synthetic PASS status.

The next successful cycle must therefore preserve both exact-head automated transaction evidence and real-device-equivalent evidence. If physical-device evidence contradicts the automated proof, the physical defect remains open and instrumentation must be strengthened rather than declaring success.

## Frozen terminal law

**ONE FINGER GESTURE = ONE CONTINUOUS TRAJECTORY = ONE CANONICAL LANDING = ZERO POST-LANDING CORRECTIONS.**

If a single swipe can ever require another swipe, another render, another timer, another event, or another correction to obtain the correct centered frame, the implementation fails this contract.