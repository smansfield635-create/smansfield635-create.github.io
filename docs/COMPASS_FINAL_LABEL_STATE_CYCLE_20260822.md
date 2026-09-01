# Compass final label-state cycle — 2026-08-22

## Scope

This cycle is intentionally limited to the remaining constellation-label defect observed after Gen1591 became visibly active in production. Mirrorland, capability presentation, readiness carousels, the 19/19 transition set, and broader Compass presentation are not reopened.

## Established precedent

The Laws chamber remains the comparison standard: all cardinal authorities remain physically present while exactly one settled authority carries the readable outer label. Gesture preview is distinct from canonical settlement.

## Deterministic defect

The Compass controller publishes the canonical constellation state on the root as `data-orbit-focus`, with `data-orbit-preview-focus`, `data-orbit-phase`, and `data-orbit-gesture-active` separately describing preview/transition state.

The active Compass presentation owner was instead reading `data-rendered-foreground-cardinal` / `data-readable-cardinal`. When neither alias was supplied by the active controller path, presentation fell back to the first wing. This explains why source policy claimed one settled label while the visible label did not follow cardinal settlement.

## Repair

`assets/compass/compass.capability-carousel.js` now installs a narrow controller-to-presentation state binding after the Gen1591 presentation owner receipt is proven. It maps only the canonical settled `data-orbit-focus` cardinal into the label aliases consumed by the existing presentation owner. It does not change star visibility, geometry, Mirrorland, navigation, routes, carousel state, or controller authority.

Contract:

`DGB_COMPASS_CONTROLLER:data-orbit-focus -> readable cardinal alias -> existing presentation owner`

The binding records `DGB_COMPASS_LAWS_LABEL_BINDING` with policy `ALL_FOUR_STARS_PRESENT_ONE_SETTLED_READABLE_LABEL` and settlement `COMMITTED_ORBIT_FOCUS_ONLY`.

## Acceptance

The cycle is not complete at merge. Required sequence:

`CHANGE -> VERIFY -> MERGE -> AUTO-PUBLISH -> VERIFY EXACT LIVE SHA -> CHECK LIVE BEHAVIOR`

Source sanity requires:

- no controller or Laws mutation;
- no Mirrorland mutation;
- no new navigation authority;
- canonical settled source is `data-orbit-focus`;
- preview source is not promoted to readable-label authority;
- all four stars remain governed by the existing presentation owner;
- changed product path remains bounded to the existing capability/bootstrap runtime.

Live acceptance requires:

1. all four cardinal stars remain present;
2. exactly one label is readable at a time;
3. rotation/swipe causes the readable label to hand off only when the controller settles the new `orbitFocus`;
4. cancelled/preview movement does not create a second readable label;
5. Mirrorland and the already-working lower page remain unchanged.

The automatic release installed by PR #1621 owns publication after merge. No manual deployment carrier is part of this cycle.
