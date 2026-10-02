# Auren Successor First Behavioral Migration — Deterministic Repair Audit

Status: **STATIC MIGRATION PASS / BOUNDED TRANSITIONAL CANDIDATE**
Date: 2026-10-02

## Repair

The transitional `privacyPress` mapping was corrected so current-turn establishment cannot satisfy current-turn pressure.

If the protected-resident identity boundary was unknown before the choice:
- record `BOUNDARY_ESTABLISHED` only.

If it was already known before the choice:
- record `BOUNDARY_PRESSURED`;
- record `BOUNDARY_REASSERTED`.

This preserves the canonical law:

**pressure requires prior conversational notice.**

## First migration effects

- successor semantic events are active;
- response selection no longer consumes global relationship phase;
- response selection no longer consumes archetype-specific response banks;
- current neutral/baseline Auren corpus remains the transitional response source;
- legacy relationship engine remains temporarily loaded for old UI and scene-offer compatibility only;
- legacy archetype observation remains loaded, but cannot select dialogue;
- legacy privacy relationship mapping still runs for compatibility, but cannot control response selection.

## Remaining legacy dependencies intentionally not claimed closed

- visible PUBLIC/ENGAGED/GUARDED UI still exists;
- legacy relationship transitions still occur;
- Manor offer still uses legacy relationship gating;
- privacy relationship mapping still mutates legacy relationship phase;
- Learn About Auren still uses old corpus/topology;
- current semantic subject mapping is transitional and coarse;
- anti-replay storage is active but successor revisit selection is not yet implemented.

These are subsequent replacement operations, not hidden closure claims.

## Result

The first behavioral migration is statically coherent after deterministic repair.

No same-turn boundary establishment -> pressure shortcut remains in chamber integration.
