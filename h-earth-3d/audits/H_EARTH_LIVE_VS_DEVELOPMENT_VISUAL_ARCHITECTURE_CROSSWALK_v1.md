# H-Earth Live vs Development Visual Architecture Crosswalk v1

Status: FROZEN
Decision rule: LIVE ENVIRONMENT IS THE VISUAL FLOOR.

## Proven live lineage worth preserving

The August live lineage already contains deliberate visual-naturalism work that development must not casually replace:

- `19af631de99f` — **restore player-scale material depth**
  - adds deterministic 2D meso/local material variation in Run8C;
  - explicitly identifies a player-scale depth model;
  - uses world-coordinate noise to vary causal surface response without moving geography.

- `f3b8bc4324c4` — **restore natural multi-band coast and ocean presentation**
  - rejects a synthetic fused-ocean presentation and restores canonical multi-band water/coast representation.

- `662488e949dc` — **preserve shoreline color data through spherical projection**
  - protects shoreline material/color continuity across the planetary transform.

- `b5fbcd131421` — **preserve continuous far-ocean vertex colors through Run8E decoration**
  - prevents Run8E decoration from flattening far-ocean color depth.

- R3A naturalized daylight already supplies sky/horizon/haze treatment.
- R3C supplies normals, Lambert light and atmospheric distance response.

## Development regressions demonstrated in September

1. GEN311 physical elevation was reapplied to geography derived from G_world.
   - quantitatively confirmed double-amplification;
   - keep semantic-only correction.

2. Camera clearance referenced amplified presentation terrain after physical terrain correction.
   - quantitatively confirmed authority mismatch;
   - keep canonical physical-clearance reconciliation.

3. Post-package subdivision.
   - rejected: added no elevation truth and damaged correspondence.

4. 4-unit source sampling alone.
   - rejected as a visible-success strategy: did not solve the failure family.

5. Canonical morphology C1.
   - experimental only; added some formation articulation but did not clear live visual floor.

6. Depth Pass D1.
   - rejected and PR closed; shader complexity on coarse geometry produced a muddier cartoon result.

## Primary crosswalk finding

The live environment's advantage is not one magic shader. It is the **combined expression of already-qualified material variation + coast/ocean banding + preserved vertex colors + atmosphere**, operating on the protected live geography.

Recent development repeatedly changed one upstream/downstream subsystem while judging it in isolation. This destroyed visual composition faster than individual metrics improved.

## Integrated successor construction contract

The next successor MUST start from the current live visual package as the control, not from the failed C1/D1 branches.

Retain only demonstrated architectural corrections:
- GEN311 physical elevation double-count removal;
- camera/physical terrain authority reconciliation.

Then preserve/reuse the strongest live visual lineage:
- Run8C player-scale material depth;
- natural multi-band coast/ocean;
- shoreline color preservation;
- far-ocean vertex color preservation;
- R3A atmosphere/daylight.

The first integrated successor cycle must improve visible expression in these ordered gates:

### Gate A — silhouette / terrain representation
No worse than live at coast, lowland, hill, ridge and lake witnesses.

### Gate B — material depth
Player-scale meso/local variation must remain visible; no broad single-color terrain sheets.

### Gate C — coast/water continuity
Multi-band coast/ocean and far-ocean color depth must remain intact. No synthetic fused strip or loss of shoreline color.

### Gate D — atmospheric depth
Near/mid/far separation must be at least as legible as live.

### Gate E — physical authority
No GEN311 elevation double-count; navigation and rendered physical terrain share one authority.

### Gate F — whole-frame verdict
A candidate cannot advance because a subsystem metric improved. It advances only when the complete frame is visibly no worse than live and at least one target dimension is materially better.

## Prohibited next moves

- no more isolated shader experiments;
- no more morphology-only promotion;
- no production merge based on numerical improvement alone;
- no replacing live coast/water/material lineage without side-by-side proof;
- no hiding geometry defects with fog;
- no Pages deployment for candidate inspection.

## Next build target

**Integrated Successor I1**

Base: current live main visual lineage.
Bounded architectural corrections:
1. GEN311 physical elevation -> semantic-only.
2. visible-terrain clearance -> same canonical physical elevation authority.

Everything else remains live unless a change is explicitly proven against the visual floor.

Only after I1 demonstrates that the architectural corrections can coexist with the live visual expression do we introduce one representation-fidelity improvement at a time.
