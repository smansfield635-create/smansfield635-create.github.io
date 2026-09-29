# Auren C3.5 — Persistence Omission Decision

Status: **C3.5 OMITTED FOR FIRST RELEASE / DURABLY CLOSED**
Date: 2026-09-29

Accepted C3.4 baseline: `1ff1000e5fda8c6e4332e89b29cea6c019a8743c`

## Decision

C3.5 persistence is intentionally omitted from the first C3 release.

No same-browser/device relationship or archetype persistence will be introduced before C3.6.

## Preserved runtime law

C3.2 relationship state remains in-memory/session-only.

C3.3 visitor-archetype evidence remains in-memory/session-only.

C3.4 state-dependent Auren consumes only those current in-memory states.

Page reload/new visit begins without persisted relationship or archetype state.

## Explicitly not introduced

- localStorage relationship state
- localStorage archetype state
- sessionStorage relationship/archetype persistence
- cookies for relationship/archetype state
- account/cloud relationship memory
- cross-character relationship memory
- hidden visitor profiling across visits

The existing narrow scene-transition continuity mechanism, where independently authorized, is not reclassified as relationship persistence.

## Rationale

C3.6 does not require cross-session persistence.

Omitting persistence keeps the first release bounded, prevents unnecessary stored visitor profiling, preserves the qualified no-persistence guarantees of C3.2–C3.4, and avoids expanding memory authority before a concrete product need exists.

## Reopening rule

Persistence may be reconsidered only under a new separately frozen contract after C3 closure or by explicit owner authorization.

Any future persistence contract must define:
- exact stored schema;
- storage surface;
- expiration;
- reset/delete behavior;
- migration/versioning;
- privacy boundary;
- hidden-knowledge leakage prevention;
- cross-character prohibition or explicit authority;
- qualification.

## C3.6 handoff

C3.6 begins from accepted C3.4 behavior with C3.5 omitted.

Relationship state may affect whether Auren is willing to offer a lawful scene opportunity.

World/scene authority remains solely responsible for whether entry is actually admissible.

## Terminal law

**C3.5 = OMITTED, NOT FAILED.**

**NO RELATIONSHIP/ARCHETYPE PERSISTENCE IS ADDED.**

**NEXT = C3.6 SCENE-OFFER BRIDGE.**
