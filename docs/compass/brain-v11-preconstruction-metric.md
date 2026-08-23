# Brain V11 Pre-Construction Metric

Identity: COMPASS_BRAIN_V11_PRECONSTRUCTION_METRIC_v1
Name: Anatomical Landmark Conformance Metric (ALCM)
Stage: PRE-MESH ONLY

## 1. Principle

ALCM qualifies the anatomical scaffold before any renderable brain mesh exists. It does not score resemblance after rendering. It scores whether the proposed construction coordinates already encode the major anatomical relationships required for a plausible brain.

This makes the metric materially different from every prior Brain V9/V10/V11 inspection pass, which judged generated geometry after construction.

## 2. Normalization

Let total anterior-posterior cerebral length FP-to-OP equal 1.000. All distances are normalized to that length.

For bilateral quantities, left and right are measured independently before symmetry comparison.

## 3. Hard-fail gates

A scaffold fails immediately if any of the following is true:

H1. Left and right cerebrum are generated from one shared global primitive parameterization.
H2. Fissure clearance is not explicitly positive from anterior to posterior crown.
H3. Temporal pole is not inferior to the central cerebral reference plane.
H4. Cerebellar center is not posterior and inferior to the cerebral center.
H5. Pons anterior maximum does not project anterior to the medullary centerline.
H6. Medulla-to-cord interface is discontinuous or cord radius does not taper inferiorly.
H7. Any required landmark is undefined.
H8. Any sectional profile station is omitted.
H9. Interface registration is represented only by arbitrary object overlap rather than an explicit interface footprint.
H10. Mesh generation begins before this metric is evaluated.

## 4. Landmark completeness score L

Required landmarks: 50 total across cerebrum, cerebellum, brainstem, cord, and interfaces.

L = defined_required_landmarks / required_landmarks

Qualification requirement: L = 1.000 exactly.

## 5. Cerebral proportion score C

The following target ranges are evaluated independently for each hemisphere.

- Length / maximum height: 1.55–1.90
- Length / maximum width: 1.75–2.25 per hemisphere half-width basis
- Temporal-pole inferior offset from central plane: 0.08–0.22
- Frontal-pole fullness ratio at Z5 relative to central width: 0.74–0.94
- Occipital taper ratio at Z1 relative to central width: 0.55–0.80
- Superior crown position along OP→FP axis: 0.42–0.68
- Maximum inferior temporal depth position along OP→FP axis: 0.48–0.78

For each ratio r with admissible interval [a,b], component score is 1 inside the interval and decreases linearly to 0 at a tolerance band equal to 25% of interval width beyond either boundary.

C = mean of all cerebral proportion component scores across both hemispheres.

Qualification requirement: C >= 0.90 and no single component < 0.70.

## 6. Bilateral differentiation and symmetry score B

The hemispheres must be bilateral peers, not duplicate eggs and not unrelated objects.

Measure corresponding landmark pair distances after reflection across X=0.

- Mean normalized landmark reflection error target: <= 0.035
- Maximum single-landmark reflection error target: <= 0.080
- Hemisphere volume-proxy difference target: <= 7%
- Section-profile area difference at matching stations target: <= 10%

B combines these four normalized errors as 1 - weighted_error.

Qualification requirement: B >= 0.90.

A perfect B score is not required; exact duplication is not the goal. Anatomical bilateral coherence is.

## 7. Fissure architecture score F

The interhemispheric fissure is measured as an actual gap between independent hemisphere surfaces.

At five superior stations from anterior to posterior, record gap width g_i.

Requirements:
- all g_i > 0;
- mean gap 0.018–0.055;
- no station > 2.4 × another station except the inferior termination zone;
- fissure depth must extend at least 0.22 of local hemisphere height at the central station.

F = weighted conformity of width continuity, positive clearance, and depth.

Qualification requirement: F >= 0.92.

## 8. Inferior anatomy relationship score I

This score governs cerebellum, brainstem, and cord placement before surfaces are generated.

Required normalized relationships:

- Cerebellar center posterior to brainstem center by 0.12–0.32.
- Cerebellar center inferior to cerebral center by 0.28–0.48.
- Cerebellar superior envelope overlaps beneath occipital envelope by 0.04–0.16 in Y while remaining posteriorly displaced.
- Pons anterior projection relative to medulla centerline: 0.035–0.110.
- Pons maximum width / medulla width: 1.35–2.10.
- Medulla width at MI / pons maximum width: 0.42–0.70.
- Cord width at visible inferior endpoint / cord width at CS: 0.62–0.88.
- Cord axis angular deviation from inferior anatomical axis: <= 12 degrees.

I = mean conformity across these relationships.

Qualification requirement: I >= 0.92 and every relationship must remain within the outer tolerance band of ±20% beyond the stated interval.

## 9. Interface registration score R

For every required interface, record:

- attachment centroid;
- surface normal/orientation;
- contact footprint dimensions;
- intended overlap or tangent depth;
- parent and child layer identities.

Each interface receives four binary/continuous checks: position, orientation, footprint, continuity.

R = passed_interface_checks / total_interface_checks.

Qualification requirement: R >= 0.95 with zero missing interfaces.

## 10. Sectional profile score S

At Z0–Z6, each hemisphere defines:

- half-width W(z)
- superior height U(z)
- inferior depth D(z)
- medial inset M(z)
- lateral convexity K(z)

The profile is rejected if all five fields can be fit by a single ellipsoid within 3% normalized RMS error. This is an explicit anti-egg test.

Additional requirements:

- W(z) must have at least one non-monotonic regional transition between Z1 and Z5.
- D(z) must show temporal descent between Z3 and Z5.
- posterior taper W(Z0/Z1) must be lower than central W(Z3).
- frontal width at Z5 must recover relative to Z4 rather than monotonically collapse to the pole.

S combines anti-ellipsoid rejection and profile-shape conformity.

Qualification requirement: S >= 0.93.

## 11. Layer independence score Y

Each anatomical layer must own its own control data and mesh-generation domain.

Required layer identities:
- LEFT_CEREBRUM
- RIGHT_CEREBRUM
- CEREBELLUM
- BRAINSTEM
- CORD
- INTERFACES

Y checks that no layer inherits its final dimensions solely from another layer's primitive transform and that each can be changed locally without globally rescaling the assembly.

Qualification requirement: Y = 1.000.

## 12. Composite ALCM score

Only after all hard-fail gates pass:

ALCM = 0.10L + 0.22C + 0.12B + 0.12F + 0.18I + 0.10R + 0.12S + 0.04Y

Advance to mesh construction only if:

- no hard fail;
- L = 1.000;
- Y = 1.000;
- C >= 0.90;
- B >= 0.90;
- F >= 0.92;
- I >= 0.92;
- R >= 0.95;
- S >= 0.93;
- ALCM >= 0.93.

## 13. Required pre-construction receipt

Before any new Brain V11 mesh is committed, the build must emit a machine-readable receipt containing:

- specification identity;
- metric identity;
- coordinate-frame identity;
- all landmark coordinates;
- all sectional profiles;
- all interface records;
- component scores L,C,B,F,I,R,S,Y;
- composite ALCM;
- hard-fail results;
- final decision PASS/HOLD.

A rendered screenshot cannot substitute for this receipt.
