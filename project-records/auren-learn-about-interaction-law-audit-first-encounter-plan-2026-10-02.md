# Auren Learn About Auren Audit — Mirrorland Interaction Law

Status: **SUCCESSOR DESIGN AUTHORITY / NO RUNTIME MUTATION**
Date: 2026-10-02
Authority: `project-records/mirrorland-character-interaction-law-immersive-relational-conversation-2026-10-02.md`
Audited runtime: `products/auren/auren.voice.js` and `products/auren/auren.chamber.js` at `a5565f0fa6bd93aee22bce64f6a98a5b0480f09d`

## Finding

The current Learn About Auren corpus contains useful canonical material and proven cadence/state machinery, but its interaction topology remains primarily an interview/FAQ graph.

The successor must preserve useful character substance and proven C3-C5 mechanics while replacing the interrogation/menu topology with an in-world encounter whose later turns are conditioned by what has already happened.

No additional diagnostic system is required for this successor.

## Existing machinery to preserve

- short progressive turns;
- typing dots and reading pause;
- maximum-three option ceiling;
- relationship state as an internal cognition input;
- archetype evidence as an internal cognition input;
- state-dependent response selection;
- custody and privacy authority;
- Manor scene offer and bounded return-context authority;
- current product mode as a deliberately informational mode;
- current Book -> Elara authority boundary.

The chamber already records a bounded session `history[]`. The architectural defect is that history is not yet authoritative for next-turn selection or anti-replay behavior.

## Node audit

| Node / surface | Classification | Reason |
| --- | --- | --- |
| `root` Products / Learn About Auren split | **KEEP / RECONTEXTUALIZE** | The two-mode distinction remains valid, but choosing Learn must enter a situation rather than open a biography menu. |
| `about` | **REWRITE** | Canonical substance is usable; current options ("What does that mean?", "What's Mirrorland?", "Tell me about your room") make the visitor interrogate a dossier. |
| `who` | **RECONTEXTUALIZE** | Protection-versus-control material is strong and canonical. It should arise from what Auren is doing/noticing, not from "What do you actually do?" exposition chaining. |
| `work` | **RECONTEXTUALIZE** | Strong custody/privacy/closed-door material. Convert from explanation node into behavior/situation consequence. |
| `mirrorland` | **RECONTEXTUALIZE** | Authority-boundary language is useful, but the node is presently world exposition requested by the visitor. Use when a route, responsibility, or other character becomes relevant. |
| `people` | **RECONTEXTUALIZE** | The privacy refusal is excellent character behavior. Trigger it from natural curiosity/pressure in context, not as an FAQ branch designed to elicit a boundary. |
| `room` | **RECONTEXTUALIZE** | Builder material is useful. Reveal it through the room and Auren's attention to it rather than "Tell me about your room." |
| `manorOffer` | **KEEP / RECONTEXTUALIZE** | The handoff and authority boundary are sound. The offer should emerge from accumulated encounter context, not node membership plus relationship threshold alone. |
| `manorReturnAck` | **KEEP / DEEPEN** | Correctly recognizes an authorized return. It should also resume the unresolved thread that caused the handoff where one exists. |
| `admissionPressure` | **REWRITE AS ENCOUNTER EVENT** | This is the closest current material to the successor model, but "What would you do?" still presents a diagnostic hypothetical. Make the admission problem occur in-world and let Auren own the decision pressure. |
| `admissionAdmit`, `admissionDelay`, `admissionRefuse` | **RECONTEXTUALIZE** | Consequence language is useful; visitor options currently put complete policy positions in the visitor's mouth. Replace with bounded action/intent choices or natural replies. |
| `privacyBoundary` | **RECONTEXTUALIZE** | The boundary itself is canonical and experiential. It should follow naturally from the encounter and prior visitor behavior. |
| `privacyRespect`, `privacyLimited`, `privacyPress` | **REWRITE OPTIONS / KEEP CONSEQUENCES** | The three-way evidence bucket is too visibly diagnostic. Preserve differentiated consequences but collect evidence from natural conversational/action intent. |
| visible `PUBLIC / ENGAGED / GUARDED` presentation | **REMOVE FROM EXPERIENCE IN SUCCESSOR** | Relationship state remains useful internally; the visible label exposes diagnostic machinery where Auren's behavior can communicate it. |
| generic `Back to Auren` / `Back` topology in Learn mode | **REMOVE AS CONVERSATION MODEL** | Navigation may remain where technically necessary, but Learn must pivot/resume rather than repeatedly return to a menu. |

## Minimum bounded session-context model

The successor requires a small session-only context object, not a transcript and not a new scoring engine.

Minimum fields:

- `visitedTopics`: subjects materially discussed;
- `deliveredBeats`: authored beats already delivered, used to prohibit mechanical replay;
- `visitorActions`: significant choices/actions without assigning personality labels;
- `establishedBoundaries`: privacy/custody lines Auren has already stated;
- `unresolvedThreads`: active conversational or situational matters that can be resumed;
- `offersMade`: Manor/product/character offers already made;
- `handoffContext`: destination, reason, originating thread, and authorized return token/context;
- `lastBeat`: enough immediate context to select a coherent next turn.

Existing relationship/archetype/custody/privacy state may be consulted by character cognition, but these fields must not expose those diagnostics to the visitor.

## First successor encounter progression

The first Learn About Auren experience should begin **after the visitor has chosen Learn About Auren**, with Auren already occupied by a small sanctuary problem in his chamber.

### Beat 1 — Arrival while Auren is handling something

Auren is adjusting or checking an ordinary room detail that has a protection consequence: a door, route, sightline, access condition, or placement issue.

He acknowledges the visitor without giving a biography.

Purpose: establish Builder/Custody through behavior.

### Beat 2 — Auren notices how the visitor engages

The visitor gets one to three low-assumption intents appropriate to the moment, for example:
- ask what he is changing;
- offer to help;
- wait and observe.

These are not personality declarations.

Auren's response changes according to the action and existing internal state.

### Beat 3 — The sanctuary problem acquires a human consequence

A message/knock/room condition creates an admission or privacy tension. Auren, not the visitor, owns the responsibility and starts making the decision.

He may ask for a concrete assist or reaction, but not "What would you do?" as a disguised assessment.

Purpose: protection-versus-control becomes lived context.

### Beat 4 — Boundary becomes real

Curiosity or the situation makes another protected person relevant without exposing their identity.

Auren states or enforces a privacy boundary naturally. If the visitor already respected a related line, he should not repeat the same speech; he acknowledges that history and moves deeper.

### Beat 5 — Consequence and relational adaptation

The result changes Auren's behavior: candor, challenge, humor, invitation, caution, or willingness to involve the visitor.

No relationship phase is named.

### Beat 6 — Natural continuation or handoff

Depending on accumulated context, Auren may:
- continue the unresolved sanctuary issue;
- volunteer something about himself;
- connect the event to Mirrorland;
- offer the Manor because seeing it now has a reason;
- pivot to a product if the visitor brought the work into the conversation.

A Manor handoff records the originating thread so an authorized return can resume it.

## Anti-replay rule

Before delivering an authored beat, the successor checks `deliveredBeats` and relevant `visitedTopics`.

If a beat has already been delivered in the active session, selection must choose a revisit form: deepen, clarify, connect, challenge, resume, redirect, or intentionally repeat for an authored reason.

Exact complete-response replay from ordinary graph re-entry is prohibited.

## Implementation boundary

The first implementation should be narrow:

1. add the bounded session-context authority to the Auren chamber;
2. make it available to character/experience selection without exposing it;
3. reconstruct only the Learn About Auren entry and first encounter progression;
4. preserve Products and proven cadence mechanics;
5. suppress the visible relationship label in the successor experience while retaining relationship state internally;
6. add verifier coverage for history-conditioned revisits, unresolved-thread resumption, non-diagnostic options, and authorized handoff return.

Do not rewrite all product dialogue.
Do not add more archetype questions.
Do not create a terminal evaluation.
Do not grant Auren knowledge across authority boundaries.

## Deterministic next operation

Freeze a bounded implementation contract for the first encounter progression and session-context schema, naming the exact files allowed to change and the verifier obligations. Only after that contract is merged should runtime dialogue/topology be mutated.
