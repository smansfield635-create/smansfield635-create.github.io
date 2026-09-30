# Brain V11 Anatomical Landmark Construction Specification

Status: PRE-CONSTRUCTION GOVERNING SPECIFICATION
Identity: COMPASS_BRAIN_V11_LANDMARK_SPEC_v1
Purpose: replace primitive-led brain construction with explicit landmark-led anatomical construction.

## 1. Coordinate frame

All geometry is defined in a normalized anatomical frame before any mesh is generated.

- X: left (-) to right (+)
- Y: inferior (-) to superior (+)
- Z: posterior (-) to anterior (+)
- Origin: midpoint of the pontomesencephalic junction projected to the midsagittal plane.
- Unit scale: total anterior-posterior cerebrum length = 1.000.

No primitive may determine the landmark positions. Primitives, patches, splines, cages, subdivision surfaces, or implicit fields may be used only after the landmark scaffold passes the pre-construction metric.

## 2. Cerebral hemisphere landmarks

The left and right hemispheres are independently constructed from mirrored target classes, not duplicated ellipsoids.

Each hemisphere must explicitly resolve the following landmarks:

### Polar landmarks
- FP: frontal pole — most anterior cerebral point.
- OP: occipital pole — most posterior cerebral point.
- TP: temporal pole — most anterior point of the temporal lobe below the lateral sulcus plane.
- SP: superior crown — highest point of the hemisphere.
- IP: inferior temporal point — lowest cerebral point excluding brainstem/cerebellum.

### Medial/fissural landmarks
- AF: anterior longitudinal fissure entry.
- PF: posterior longitudinal fissure entry.
- MF: midsuperior fissure apex.
- IF: inferior fissure termination above the callosal/brainstem interface zone.

### Lateral structural landmarks
- SCU: superior central-sulcus anchor.
- SCL: inferior central-sulcus anchor.
- LSU: posterior-superior lateral-sulcus anchor.
- LSA: anterior lateral-sulcus root.
- PTO: parietal-temporal-occipital junction anchor.

### Inferior contour landmarks
- OFR: orbitofrontal inferior break.
- TIR: temporal inferior ridge.
- OCI: occipital inferior return.

## 3. Cerebral regional control zones

Each hemisphere must contain five distinct control zones whose local shape may be edited without globally rescaling the hemisphere:

1. Frontal control zone — FP, AF, SCU, OFR.
2. Parietal control zone — SP, SCU, PTO, MF.
3. Temporal control zone — TP, SCL, LSU, TIR.
4. Occipital control zone — OP, PF, PTO, OCI.
5. Medial/fissural control zone — AF, MF, PF, IF.

No single radius triplet or global ellipsoid deformation is admissible as the governing surface definition.

## 4. Cerebellar landmarks

The cerebellum is a separate anatomical layer and must be positioned by its own landmarks:

- CV: superior vermis apex.
- CI: inferior vermis nadir.
- CL: left lateral cerebellar pole.
- CR: right lateral cerebellar pole.
- CP: posterior cerebellar pole.
- CA: anterior cerebellar notch, facing the brainstem.
- CSL: left superior peduncular interface.
- CSR: right superior peduncular interface.
- CIL: left inferior peduncular interface.
- CIR: right inferior peduncular interface.

The cerebellum must occupy the posterior-inferior envelope beneath the occipital cerebrum. It may not be represented as one sphere, one ellipsoid, two bulbs, or two mirrored discs.

## 5. Brainstem landmarks

Brainstem is one anatomical layer with internally distinct segments.

- MBT: midbrain superior junction.
- MBA: midbrain anterior surface anchor.
- MBL/MBR: left/right midbrain lateral anchors.
- PA: pons anterior maximum projection.
- PL/PR: left/right pons lateral maxima.
- PI: pons inferior transition.
- MA: medulla anterior surface anchor.
- ML/MR: left/right medullary taper anchors.
- MI: medulla inferior transition into cord.

The pons must be a forward-projecting bulge within the brainstem layer, not a second attached bulb.

## 6. Descending cord landmarks

The descending cord is a separate continuation layer attached to MI.

- CS: cord superior interface at MI.
- CM: cord midline checkpoint.
- CI2: cord inferior endpoint for the visible inspection object.

The cord must narrow gradually from CS to CI2 and may not be generated as a constant-radius peg.

## 7. Interface landmarks

Interfaces are not decorative overlap volumes. They are explicit anatomical registration zones.

- BS-CER-L / BS-CER-R: brainstem-to-cerebrum left/right interface.
- BS-CBL-L / BS-CBL-R: brainstem-to-cerebellum left/right interface.
- BS-CORD: medulla-to-cord interface.
- HEM-ANT: anterior interhemispheric convergence zone.
- HEM-POST: posterior interhemispheric convergence zone.

Each interface must be defined by position, orientation, contact footprint, and allowed overlap depth before mesh generation.

## 8. Sectional profile stations

Before mesh construction, each hemisphere must define cross-sectional profiles at seven normalized Z stations measured from OP=0 to FP=1:

- Z0 = 0.00 posterior pole
- Z1 = 0.15 occipital
- Z2 = 0.32 parieto-occipital
- Z3 = 0.50 central
- Z4 = 0.68 frontal
- Z5 = 0.84 anterior frontal
- Z6 = 1.00 frontal pole

Each station records half-width, superior height, inferior depth, medial inset, and lateral convexity. These values are independent per station; interpolation may not reduce the hemisphere to a single ellipsoid.

## 9. Construction prohibitions

The following are explicitly prohibited as governing geometry:

- one global cerebrum primitive;
- two mirrored ellipsoids as final hemisphere geometry;
- sphere/ellipsoid cerebellum;
- separate pons bulb attached to a stem cylinder;
- constant-radius descending cord;
- tube-based cortex;
- global sinusoidal cortical displacement;
- mesh generation before landmark qualification.

## 10. Advancement law

No Brain V11 G0.2 mesh may be generated until the complete landmark scaffold passes COMPASS_BRAIN_V11_PRECONSTRUCTION_METRIC_v1 with no hard-fail condition.
