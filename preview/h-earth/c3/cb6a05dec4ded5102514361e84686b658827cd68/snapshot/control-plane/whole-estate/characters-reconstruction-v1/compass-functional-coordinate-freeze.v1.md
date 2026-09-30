# Compass Functional Coordinate Constitution v1

Status: `OWNER_DIRECTED_FREEZE_PENDING_CANONICAL_REPOSITORY_ADMISSION`

## 1. Constitutional identities and primitive functions

| Bearing | Identity | Primitive function | Vector basis |
|---|---|---|---|
| N | Alaric | Navigation | `(1,0,0,0)` |
| E | Elara | Signal | `(0,1,0,0)` |
| S | Tarian | Continuity | `(0,0,1,0)` |
| W | Soren | Boundary | `(0,0,0,1)` |

The four cardinal identities are persistent constitutional identities. No intermediate bearing creates, renames, subdivides, or replaces a cardinal identity.

## 2. Fixed sixteen-station coordinate system

Angles are measured clockwise from North in increments of 22.5 degrees. Weights are exact unit-vector coefficients in the adjacent-cardinal basis. `c = cos(22.5°) = sqrt(2+sqrt(2))/2`; `s = sin(22.5°) = sqrt(2-sqrt(2))/2`; `h = sqrt(2)/2`.

| Station | Angle | Navigation N | Signal E | Continuity S | Boundary W | Functional relation |
|---|---:|---:|---:|---:|---:|---|
| N | 0° | 1 | 0 | 0 | 0 | Navigation |
| NNE | 22.5° | 0.923879533 | 0.382683432 | 0 | 0 | Navigation-dominant Navigation+Signal |
| NE | 45° | 0.707106781 | 0.707106781 | 0 | 0 | Balanced Navigation+Signal |
| ENE | 67.5° | 0.382683432 | 0.923879533 | 0 | 0 | Signal-dominant Navigation+Signal |
| E | 90° | 0 | 1 | 0 | 0 | Signal |
| ESE | 112.5° | 0 | 0.923879533 | 0.382683432 | 0 | Signal-dominant Signal+Continuity |
| SE | 135° | 0 | 0.707106781 | 0.707106781 | 0 | Balanced Signal+Continuity |
| SSE | 157.5° | 0 | 0.382683432 | 0.923879533 | 0 | Continuity-dominant Signal+Continuity |
| S | 180° | 0 | 0 | 1 | 0 | Continuity |
| SSW | 202.5° | 0 | 0 | 0.923879533 | 0.382683432 | Continuity-dominant Continuity+Boundary |
| SW | 225° | 0 | 0 | 0.707106781 | 0.707106781 | Balanced Continuity+Boundary |
| WSW | 247.5° | 0 | 0 | 0.382683432 | 0.923879533 | Boundary-dominant Continuity+Boundary |
| W | 270° | 0 | 0 | 0 | 1 | Boundary |
| WNW | 292.5° | 0.382683432 | 0 | 0 | 0.923879533 | Boundary-dominant Boundary+Navigation |
| NW | 315° | 0.707106781 | 0 | 0 | 0.707106781 | Balanced Boundary+Navigation |
| NNW | 337.5° | 0.923879533 | 0 | 0 | 0.382683432 | Navigation-dominant Boundary+Navigation |

For every station vector `b`, all coefficients are nonnegative, at most two coefficients are nonzero, nonzero primitives are adjacent, and `||b||_2 = 1`.

Weights express functional contribution to routing. They do not measure identity, ownership, seniority, permission, authority, accountability, confidence, effort, or chronology.

## 3. Adjacent Composition Law — ACL-1

Let the cyclic primitive order be `N -> E -> S -> W -> N`. A single station may compose exactly two primitives if and only if those primitives are adjacent in that cyclic order.

For adjacent primitives `P_i` and `P_(i+1)`, a station at interior offset `delta` is:

`B(delta) = cos(delta) P_i + sin(delta) P_(i+1)`, where `0° <= delta <= 90°` and the sixteen-station system admits only `delta in {0°,22.5°,45°,67.5°,90°}`.

Consequences:

1. Composition creates a functional operating station, not a new identity.
2. Both contributing primitives remain legible; neither may be silently discarded.
3. The larger coefficient establishes dominance; equal coefficients establish a balanced station.
4. A station cannot contain a third primitive.
5. Domain capability and granted authority are attached separately and cannot change the bearing.
6. A composed station cannot inherit the combined authority of its contributing identities.

## 4. Opposing Separation Law — OSL-1

The opposing primitive pairs are `Navigation <-> Continuity` and `Signal <-> Boundary`.

Opposing primitives may collaborate within one operation but may not collapse into one station, one undifferentiated assignment, or one unchecked decision authority for the same decision object and lifecycle checkpoint.

Consequences:

1. Work requiring an opposing pair must be decomposed into separately assigned stages, roles, or review surfaces.
2. The direction-setting function may not independently certify its own continuity or completion.
3. The signal-producing or evidence-presenting function may not independently determine the boundary governing that same signal or evidence.
4. Handoffs between opposing primitives must preserve the decision object, lifecycle position, granted authority, evidence, and unresolved conditions.
5. Independent review must remain genuinely independent; renaming one assignment or changing domain capability does not satisfy separation.
6. Work materially requiring three or four primitives must be decomposed; it cannot be forced into a single bearing.

## 5. Authority and ontology constraints

The operational coordinate remains `O = (B,R,L,D,A)`:

- `B`: fixed functional bearing.
- `R`: typed target and relationship.
- `L`: lifecycle position.
- `D`: domain capability.
- `A`: explicitly granted authority.

`B` never implies `A`. `D` never changes identity. `L` is not encoded as personality. `R` is not promoted to a second sixteen-position axis without independent evidence that it exhibits the same four primitives.

## 6. Frozen exclusions

- No twelve additional personalities are created by this constitution.
- No task-specific bearing may be invented.
- No established cardinal meaning may move to improve benchmark fit.
- No opposing pair may be represented as an adjacent composition.
- No authority may be inferred from identity, station, weight, domain, or lifecycle.
- No three- or four-primitive task may be routed as one station.

