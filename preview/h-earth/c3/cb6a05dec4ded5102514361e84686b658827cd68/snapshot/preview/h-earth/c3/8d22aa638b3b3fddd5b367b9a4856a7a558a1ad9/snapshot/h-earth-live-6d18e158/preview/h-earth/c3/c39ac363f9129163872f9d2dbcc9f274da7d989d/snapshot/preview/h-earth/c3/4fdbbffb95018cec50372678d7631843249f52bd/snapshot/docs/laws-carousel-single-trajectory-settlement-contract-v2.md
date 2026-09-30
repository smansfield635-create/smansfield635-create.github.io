# Laws Carousel Single-Trajectory Settlement Contract v2

## Authority status

**FROZEN CONSTRUCTION CONTRACT — v2**

This contract supersedes the narrower continuous-pointer qualification as the controlling authority for the unresolved Laws destination carousel interaction defect.

The prior V6 work proved that intermediate geometry can move under a pointer. That is necessary but insufficient. Real-device evidence on tablet and phone shows the remaining failure class: one physical gesture can still produce spatial/semantic disagreement, noncanonical landing, or a later corrective render.

The next construction cycle has one authorized target:

> **ONE FINGER GESTURE = ONE CONTINUOUS TRAJECTORY = ONE CANONICAL LANDING = ZERO POST-LANDING CORRECTIONS**

No unrelated carousel/page improvement is authorized until this contract passes.

## Deterministic defect definition

A single physical swipe must produce exactly one continuous spatial traversal from the current canonical card to one destination canonical card, with:

- no independent intermediate spatial authority;
- no index-first rendering;
- no delayed re-centering;
- no second-stage correction;
- no semantic/visual disagreement;
- no post-settlement geometry mutation.

The implementation fails whenever a gesture can produce any sequence equivalent to:

```text
canonical A
→ intermediate/noncanonical geometry
→ release
→ semantic state B while geometry is not canonical B
→ later render/timer/event/correction
→ canonical B
```

The only lawful sequence is:

```text
C_i → DIRECT_MANIPULATION P(t) → SETTLEMENT P(t) → C_j
```

where `C_i` and `C_j` are exact canonical detent frames.

## Single spatial authority

At every instant there is exactly one authoritative unwrapped orbit coordinate:

```text
p(t) ∈ R
```

The entire visible carousel geometry is a pure deterministic function of that coordinate:

```text
G(t) = F(p(t))
```

No card transform may be independently commanded by:

- semantic index;
- CSS transition state;
- timeout state;
- focus state;
- initialization state;
- restoration state;
- resize state;
- a second renderer;
- any other independently mutable carousel position.

All cards in one frame must be derived from the same `p(t)`.

## Authority direction

Spatial authority flows only in this direction:

```text
p(t) → F(p(t)) → visible geometry
```

At a settled detent only, semantic identity is derived from the spatial detent:

```text
i = mod(p, N)
```

The semantic index must never command spatial geometry.

## Transaction law

Every physical pointer gesture creates one transaction identity `τ`.

From accepted horizontal pointer custody until canonical settlement completes:

```text
τ_active = true
```

While `τ_active` is true, no competing carousel transaction may acquire spatial authority.

The following may not reposition the orbit during an active transaction:

- focus/focusin;
- click/neighbor selection;
- initialization callbacks;
- restoration callbacks;
- resize handlers;
- delayed timers;
- keyboard commands;
- duplicate pointer handlers;
- semantic-state synchronization.

A directly necessary browser cancellation may terminate the transaction only through the cancellation law defined below.

## Spatial state machine

The only spatially meaningful states are:

```text
RESTING → DIRECT_MANIPULATION → SETTLING → RESTING
```

A pending axis-classification state may exist before horizontal custody, but it has no authority to alter `p`.

### RESTING

At rest:

```text
p = k, where k ∈ Z
G = F(k) = C_k
τ_active = false
```

The active card has exact relative distance `0`; immediate neighbors have exact circular relative distances `-1` and `+1`.

No settled frame may retain fractional orbit geometry.

### DIRECT_MANIPULATION

On horizontal custody, capture the starting detent/orbit coordinate `p0`, pointer X `x0`, and step width `S`.

For every accepted pointer sample:

```text
p(t) = p0 - (x(t) - x0) / S
G(t) = F(p(t))
```

Pointer displacement therefore has immediate continuous geometric consequence.

During direct manipulation:

- CSS transform transitions are prohibited;
- semantic index does not change;
- `aria-current` does not change;
- destination identity does not change;
- no committed selection-change event may claim a new card.

### RELEASE AND TARGET SELECTION

At pointer release, capture the exact fractional release coordinate:

```text
p_r = p(t_release)
```

Choose exactly one integer destination detent:

```text
q = nearestDetent(p_r)
```

The `.5` tie law remains deterministic: use the last nonzero horizontal pointer velocity; if zero, use accumulated horizontal drag direction.

Once `q` is chosen it is immutable for transaction `τ`.

No focus, timer, index synchronization, or later event may choose a second target.

### SETTLING

Settlement starts from the exact release coordinate `p_r` and animates the same authoritative coordinate toward `q`.

For normalized settlement time `u ∈ [0,1]`:

```text
p(u) = p_r + (q - p_r) E(u)
G(u) = F(p(u))
```

`E(u)` is one deterministic monotonic easing function satisfying:

```text
E(0) = 0
E(1) = 1
```

The settlement engine must own `p` directly, preferably through `requestAnimationFrame` or an equivalent frame-authoritative mechanism.

**Independent CSS transform interpolation is prohibited.**

CSS may not be given a final card transform and then independently interpolate while JavaScript already claims the integer destination state.

**Timeout-defined settlement is prohibited.**

A timer such as `SETTLE_MS` may not be the authority that declares spatial completion. Completion occurs only when the settlement engine writes the exact destination coordinate and renders it:

```text
p = q
G = F(q)
```

At that instant, and not before, the transaction may enter RESTING.

## Canonical landing postcondition

Every successful gesture transaction must end with all of the following simultaneously true:

```text
p ∈ Z
p = q
G = F(q)
d_active = 0
i = mod(q, N)
τ_active = false
```

The semantic counter (`n / N`), destination ID, `aria-current`, focus custody, and committed carousel-change event must agree with that same `q`.

There is no lawful state in which semantic card B is committed while geometry still represents fractional or canonical card A geometry.

## Post-landing immutability guard

After canonical settlement completes, observe the carousel for at least 1000 ms.

Unless a new explicit user transaction begins, all of the following must remain invariant for the entire guard interval:

```text
p(t) = q
G(t) = F(q)
i(t) = mod(q, N)
```

Any post-landing transform mutation, re-centering, index correction, focus-induced reposition, delayed callback movement, or second settle is a hard failure.

## Circular seam

The authoritative coordinate remains unwrapped across the seam.

For four cards, a forward traversal from logical card 4 to card 1 is spatially:

```text
3.0 → 3.2 → 3.5 → 3.8 → 4.0
```

The final semantic index is:

```text
mod(4,4) = 0
```

The spatial coordinate must not jump from approximately `3.x` to `0.x` during the transaction.

## Cancellation

If the browser issues a true cancellation during DIRECT_MANIPULATION, the transaction has one cancellation target: its captured starting canonical detent `p0`.

Cancellation settlement follows the same single-authority settlement engine:

```text
p_current → p0
```

It must end at:

```text
p = p0
G = F(p0)
```

with the original semantic index unchanged.

Cancellation may not invoke a separate transform system.

## Vertical traversal

A predominantly vertical gesture must never enter DIRECT_MANIPULATION.

It must leave `p` unchanged and preserve ordinary page scrolling.

Once horizontal custody is accepted, that transaction retains horizontal custody until release/cancel; axis authority may not oscillate mid-gesture.

## Forbidden implementation patterns

The next construction must remove or neutralize every pattern capable of violating single spatial authority, including:

1. index-first geometry updates;
2. CSS-owned independent transform interpolation during settlement;
3. timer-defined spatial completion;
4. multiple mutable position variables that can independently render the orbit;
5. focus-driven spatial changes during an active transaction;
6. delayed initialization/restoration reposition during an active transaction;
7. post-release target recomputation;
8. semantic synchronization that commands geometry;
9. a second corrective render after canonical landing;
10. accepting a new gesture before canonical settlement closes the current transaction.

## Required runtime instrumentation

The runtime must expose enough read-only state to prove the contract, including equivalents of:

```text
transactionId
transactionActive
phase                  // resting | direct-manipulation | settling
orbitPosition          // authoritative unwrapped p
settlementTarget       // immutable q while settling
committedIndex
canonical              // true only when exact canonical postcondition holds
lastSpatialMutationReason
```

Instrumentation observes the state machine; it must not create another authority path.

## Qualification: continuous transaction trace

The prior 25/50/75 screenshots remain useful evidence but are no longer sufficient.

For each qualifying gesture, record a frame/sample trace containing at minimum:

```text
(t, transactionId, phase, pointerX, p, q, i, card transforms)
```

### Q1 — direct manipulation causality

During horizontal drag, every material pointer displacement must produce corresponding movement in `p`, and every sampled card transform must equal the deterministic renderer output for that same `p`.

Required invariant:

```text
G_n = F(p_n)
```

No semantic index change is permitted during DIRECT_MANIPULATION.

### Q2 — one immutable target

Release chooses one `q`. The trace must show no subsequent target change for the transaction.

### Q3 — monotonic settlement

After release, settlement must monotonically approach `q`:

```text
|q - p_(n+1)| <= |q - p_n|
```

with strict progress on material animation frames until the final canonical write.

No reversal, pause followed by correction, second target, or second settlement is permitted.

### Q4 — exact canonical landing

At transaction completion prove simultaneously:

```text
p = q
p ∈ Z
G = F(q)
d_active = 0
i = mod(q,N)
canonical = true
transactionActive = false
```

### Q5 — one-second post-landing guard

Continue sampling for at least 1000 ms after Q4.

Without new user input, prove zero changes to:

- `p`;
- active card transform;
- neighbor transforms;
- committed index;
- settlement target/canonical identity.

Any mutation is `REPAIR_REQUIRED`.

### Q6 — repeated sequential gestures

Perform at least four separate one-card gestures in sequence on the same mounted carousel.

Every transaction must independently satisfy Q1–Q5. A later gesture may not be required to correct the landing of an earlier gesture.

### Q7 — seam transaction

Perform a complete transaction across the circular seam and prove unwrapped continuity, one target, canonical landing, and the post-landing guard.

### Q8 — cancellation transaction

Cancel an active direct-manipulation transaction and prove that the same settlement engine returns to the captured starting detent with no semantic change and no post-return correction.

### Q9 — vertical gesture

Perform a predominantly vertical physical/touch gesture over the carousel. Prove no carousel transaction begins, `p` remains unchanged, and page traversal remains available.

### Q10 — real-device acceptance

Automated browser qualification is necessary but is not sufficient to close this defect.

Before final closure, retain real-device evidence from at least:

- one phone-class touch viewport/device;
- one tablet-class touch viewport/device.

For each device, demonstrate multiple sequential gestures and confirm visually that each physical gesture produces one continuous traversal, one canonical landing, and no delayed correction.

A synthetic proof cannot override contradictory real-device evidence.

## Binary rejection rule

The candidate fails if a single physical swipe ever requires any later swipe, render, timeout, focus event, initialization callback, semantic correction, or other spatial mutation to obtain the correct centered canonical frame.

Equivalently:

> If one gesture does not completely own and finish its own spatial transaction, the implementation is not repaired.

## Scope lock

Until this contract passes, the construction cycle may not spend authority improving unrelated behavior such as:

- page-entry scrolling;
- footer behavior;
- exhibit return;
- terminology;
- Compass behavior;
- visual polish;
- unrelated accessibility work;
- unrelated legacy verifier failures;
- general carousel redesign.

Only changes directly required to establish the single-authority trajectory and prevent regressions introduced by that construction are admitted.

## Terminal acceptance law

The repair is complete only when all of the following are simultaneously established:

```text
ONE GESTURE
→ ONE TRANSACTION
→ ONE AUTHORITATIVE p(t)
→ ONE GEOMETRY F(p)
→ ONE IMMUTABLE TARGET q
→ ONE SETTLEMENT TRAJECTORY
→ ONE EXACT CANONICAL LANDING
→ ZERO POST-LANDING CORRECTIONS
```

This v2 contract is the deterministic authority for the next Laws Carousel construction cycle.