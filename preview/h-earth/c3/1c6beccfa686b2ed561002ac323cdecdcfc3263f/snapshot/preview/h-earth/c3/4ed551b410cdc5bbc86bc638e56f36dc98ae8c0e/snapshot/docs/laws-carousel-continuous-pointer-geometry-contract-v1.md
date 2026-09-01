# Laws Carousel Continuous Pointer Geometry Contract v1

Status: FROZEN
Authority issue: #1157
Scope: Laws destination carousel pointer interaction only

## Governing target

The next construction cycle has one authorized product objective:

**MAKE THE ORBIT PHYSICALLY FOLLOW THE POINTER.**

This contract supersedes prior direction-only/atomic pointer interpretations.

## Revoked target behavior

The following current runtime declarations encode the unresolved defect and are revoked as target behavior:

- `directionOnlyGesture: true`
- `liveGestureGeometry: false`
- `atomicRotation: true`

A candidate fails whenever logical selection can advance without visible intermediate Euclidean card motion under the pointer.

## Replacement law

`POINTER POSITION -> FRACTIONAL ORBIT POSITION -> LIVE EUCLIDEAN GEOMETRY -> RELEASE -> INTEGER DETENT`

The implementation must maintain two distinct state variables:

- `p ∈ R`: continuous, unwrapped orbit position.
- `i ∈ {0,1,...,N-1}`: committed semantic active-card index.

Idle invariant:

`p = i`

During horizontal drag:

`p = i0 - (x - x0) / S`

where:

- `x0` is pointer-down X;
- `x` is current pointer X;
- `i0` is unwrapped orbit position at pointer-down;
- `S = 0.72W`;
- `W` is carousel viewport width captured at pointer-down.

No live-motion threshold exists after horizontal custody is acquired.

## Continuous Euclidean geometry

Every `pointermove` in DRAGGING state must update `p` and rerender every card from a fractional circular distance.

For card `j`:

`dj = nearestCircularRelativePosition(j, p, N)`

Translation, Z-depth, rotation, scale, opacity, blur, and stacking order must be evaluated from fractional `dj`.

Mandatory progression example:

- `p=2.00`: card 2 at canonical center.
- `p=2.25`: card 2 moves 25% out; card 3 moves 25% in.
- `p=2.50`: both occupy true intermediate exchange geometry.
- `p=2.75`: card 3 is nearly centered.
- `p=3.00`: card 3 owns canonical center.

Intermediate geometry must exist before pointer release.

## Circular seam

The live orbit position remains unwrapped during traversal.

For a four-card orbit moving from logical card 4 to logical card 1:

`3.0 -> 3.2 -> 3.5 -> 3.8 -> 4.0`

Card 1 is rendered through its virtual copy at position 4. Only committed public index is wrapped:

`i = pTarget mod N`

No positional discontinuity is permitted at the seam.

## Gesture custody state machine

`IDLE -> PENDING -> DRAGGING -> SETTLING -> IDLE`

### Pointer down

Capture:

- pointerId
- startX
- startY
- dragOriginPosition
- viewport width W
- stepPixels = 0.72W

Do not alter geometry yet.

### Pending classification

Remain PENDING until either axis exceeds 8 px.

Acquire horizontal custody permanently for that gesture when:

`|dx| > |dy| * 1.12`

Reject the gesture permanently as vertical when:

`|dy| > |dx| * 1.12`

Once classified, custody must not oscillate.

The carousel viewport must preserve ordinary vertical page traversal (`touch-action: pan-y` or equivalent behavior).

### Dragging

Every pointer movement must execute the equivalent of:

```text
deltaX = currentX - startX
position = dragOriginPosition - deltaX / stepPixels
render(position)
```

`render(index)` is not sufficient.

While dragging, transform-transition interpolation that would lag behind the finger must be disabled. Settle transitions resume only after release or cancellation.

## Release and detent commitment

On release:

`pTarget = nearestIntegerDetent(p)`

`i = pTarget mod N`

The visible orbit must settle from the exact fractional release geometry to `pTarget`.

Examples:

- `p=2.18` settles to 2.
- `p=2.61` settles to 3.

There is no independent swipe-qualification threshold once horizontal dragging has begun. Fractional physical position determines the detent.

For exact midpoint `p=k+0.5`, resolve toward the last non-zero horizontal pointer velocity. If velocity is exactly zero, use accumulated drag direction. Native rounding behavior is not authoritative.

## Semantic selection law

During drag:

- geometry changes continuously;
- committed `i` does not change;
- `aria-current` does not transfer;
- visible `n / N` semantic index does not change;
- destination ID does not commit;
- committed-selection events do not publish a new card.

Semantic selection changes only when the release detent has been chosen.

Thus:

**geometry follows the finger continuously**

while

**selection changes only at detent commitment**.

## Cancellation

`pointercancel` must settle from the current fractional position back to the original committed detent without changing semantic index.

## Keyboard and click

Keyboard remains discrete:

- ArrowRight -> i+1
- ArrowLeft -> i-1

Neighbor click may animate directly to an integer detent.

Neither interaction is the pointer-drag implementation model.

## Required repaired telemetry

The repaired runtime must expose behavior equivalent to:

```text
continuousPointerGeometry: true
fractionalOrbitPosition: true
selectionDuringDrag: false
settleToNearestDetent: true
verticalGesturePassthrough: true
directionOnlyGesture: false
liveGestureGeometry: true
atomicRotation: false
```

## Mandatory exact-head qualification

A candidate may not merge unless all of the following pass against the exact candidate head.

### Q1 — Intermediate geometry proof

Capture geometry at pointer-down and at 25%, 50%, and 75% of one-card travel before `pointerup`.

For the active card:

`T0 != T25 != T50 != T75`

The incoming neighbor must simultaneously move monotonically toward center.

Committed semantic index must remain unchanged at all intermediate samples.

### Q2 — Sub-detent return

Drag 30% of one-card distance. Prove visible intermediate motion occurred. Release. The orbit must settle back to the original card.

### Q3 — Neighbor commitment

Drag 70% of one-card distance. Prove visible intermediate motion occurred. Release. The orbit must settle to the neighboring card.

### Q4 — Circular seam

Traverse `4 / 4 -> 1 / 4`. Prove continuous intermediate geometry with no seam discontinuity.

### Q5 — Vertical passthrough

Perform a predominantly vertical gesture over the carousel. Prove:

`delta index = 0`

and ordinary page scrolling remains available.

### Q6 — Cancellation

Begin a horizontal drag, capture visible fractional displacement, trigger pointer cancellation, and prove return to the original detent with unchanged semantic index.

### Q7 — Evidence requirement

Retain actual intermediate screenshots/frames. Final-state-only screenshots are insufficient evidence for this defect.

## Binary acceptance boundary

Every answer must be YES:

1. Does the card field move before pointer release?
2. Does displacement correspond continuously to finger displacement?
3. Do neighboring cards simultaneously traverse Euclidean depth/scale/opacity geometry?
4. Does release settle from exact intermediate geometry to an integer detent?
5. Does semantic selection remain discrete until detent commitment?
6. Is the circular seam continuous?
7. Does vertical page traversal remain available?

Any NO means `REPAIR_REQUIRED`; merge is prohibited.

## Scope prohibition

The next construction cycle may not spend authority on unrelated improvements, including:

- page-entry custody;
- footer behavior;
- terminology;
- exhibit return;
- unrelated Compass behavior;
- unrelated visual polish;
- unrelated legacy verifiers;
- general carousel redesign.

A directly introduced regression may be repaired only as necessary to restore the pre-cycle behavior required for this contract to function.

## Terminal condition

This contract remains frozen until an exact candidate passes every mandatory qualification above and the controlling authority issue #1157 is explicitly closed by that successful construction cycle.
