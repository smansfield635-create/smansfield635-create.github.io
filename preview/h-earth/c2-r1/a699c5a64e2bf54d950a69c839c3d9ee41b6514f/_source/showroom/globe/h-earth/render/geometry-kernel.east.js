/**

/showroom/globe/h-earth/render/geometry-kernel.east.js

COMPLETE CORRECTED FILE

CONTRACT:

H_EARTH_3D_GEOMETRY_KERNEL_EAST_FILE_BIRTH_STEP_034O_4E_MATHEMATICAL_DESCRIPTION_ANALYSIS_AND_TOPOLOGY_v1

DEPENDS ON:

H_EARTH_3D_GEOMETRY_KERNEL_NORTH_FILE_BIRTH_STEP_034O_4N_FOUNDATIONAL_MATHEMATICS_v1

GOVERNING MATHEMATICS:

STEP_034O_4A_GEOMETRY_MATHEMATICS_CONSTITUTION_AND_FREEZE_PACKET_v1

OWNERSHIP CONTRACT:

STEP_034O_4C_NEWS_GEOMETRY_OWNERSHIP_AND_HANDOFF_CONTRACT_v1

OWNERSHIP LOCK:

STEP_034O_4C_NEWS_GEOMETRY_OWNERSHIP_AND_HANDOFF_LOCK_BIND_FREEZE_RECEIPT_v1

FINAL REFREEZE:

STEP_034O_4C_1_TRANSLATION_EXECUTION_CAPACITY_ENVIRONMENT_COMPOSITOR_HANDOFF_FINAL_REFREEZE_RECEIPT_v1

STATUS:

EAST MATHEMATICAL DESCRIPTION, EVALUATION, SAMPLING,

DIFFERENTIAL ANALYSIS, POLYGON ANALYSIS, AND INDEXED-TOPOLOGY

CORRECTED IMPLEMENTATION CANDIDATE.

AUTHORIZED JURISDICTION:

MATHEMATICAL_DESCRIPTION_EVALUATION_SAMPLING_AND_ANALYSIS_ONLY.

IMPORT LAW:

EAST MAY IMPORT NORTH ONLY.

THIS FILE DOES NOT:

construct final primitive records


construct scene-specific geometry


perform primitive admission


perform provider admission


consume capacity.js


aggregate providers


author compositor policy


project or materialize geometry


IMPLEMENTATION CONFORMANCE:

NOT_YET_EVALUATED.

EAST LOCAL ADMISSION:

FALSE.
*/


/* ==========================================================================

01 · NORTH IMPORT SURFACE

========================================================================== */


import {
H_EARTH_3D_GEOMETRY_KERNEL_NORTH_CONTRACT_ID,
H_EARTH_3D_GEOMETRY_KERNEL_NORTH_SCHEMA_VERSION,
H_EARTH_3D_GEOMETRY_COORDINATE_FRAME,
H_EARTH_3D_GEOMETRY_TOLERANCE_PROFILE,

createHEarthGeometryIssue,
sortHEarthGeometryIssues,
hasHEarthBlockingIssues,

isHEarthFiniteNumber,
isHEarthPositiveFiniteNumber,
isHEarthNonNegativeFiniteNumber,
isHEarthNonNegativeSafeInteger,
isHEarthPositiveSafeInteger,
isHEarthNonEmptyString,

clampHEarthNumber,
lerpHEarthNumber,

createHEarthVector2,
isHEarthVector2,

createHEarthVector3,
isHEarthVector3,
addHEarthVector3,
subtractHEarthVector3,
scaleHEarthVector3,
dotHEarthVector3,
crossHEarthVector3,
getHEarthVector3Length,
getHEarthVector3Distance,
normalizeHEarthVector3,

createHEarthGeometryBounds,
isHEarthAABB3D,
deriveHEarthGeometryToleranceContext,
isHEarthGeometryToleranceContext
} from './geometry-kernel.north.js';

/* ==========================================================================

02 · CONTRACT IDENTITY

========================================================================== */


export const H_EARTH_3D_GEOMETRY_KERNEL_EAST_CONTRACT_ID =
'H_EARTH_3D_GEOMETRY_KERNEL_EAST_FILE_BIRTH_STEP_034O_4E_MATHEMATICAL_DESCRIPTION_ANALYSIS_AND_TOPOLOGY_v1';

export const H_EARTH_3D_GEOMETRY_KERNEL_EAST_SCHEMA_VERSION = 2;

export const H_EARTH_3D_GEOMETRY_KERNEL_EAST_SOURCE_FILE =
'/preview/h-earth/c2-r1/a699c5a64e2bf54d950a69c839c3d9ee41b6514f/_source/showroom/globe/h-earth/render/geometry-kernel.east.js';

export const H_EARTH_3D_GEOMETRY_MATHEMATICS_PACKET_ID =
'STEP_034O_4A_GEOMETRY_MATHEMATICS_CONSTITUTION_AND_FREEZE_PACKET_v1';

export const H_EARTH_3D_GEOMETRY_MATHEMATICS_ACCEPTANCE_RECEIPT_ID =
'STEP_034O_4A_FORMAL_ACCEPTANCE_RECEIPT';

export const H_EARTH_3D_GEOMETRY_OWNERSHIP_CONTRACT_ID =
'STEP_034O_4C_NEWS_GEOMETRY_OWNERSHIP_AND_HANDOFF_CONTRACT_v1';

export const H_EARTH_3D_GEOMETRY_OWNERSHIP_LOCK_RECEIPT_ID =
'STEP_034O_4C_NEWS_GEOMETRY_OWNERSHIP_AND_HANDOFF_LOCK_BIND_FREEZE_RECEIPT_v1';

export const H_EARTH_3D_GEOMETRY_FINAL_REFREEZE_RECEIPT_ID =
'STEP_034O_4C_1_TRANSLATION_EXECUTION_CAPACITY_ENVIRONMENT_COMPOSITOR_HANDOFF_FINAL_REFREEZE_RECEIPT_v1';

export const H_EARTH_3D_GEOMETRY_EAST_CORRECTION_SCOPE_ID =
'STEP_034O_4E_TARGETED_SAMPLING_DERIVATIVE_TOPOLOGY_AND_ANALYSIS_BOUNDARY_CORRECTION_SCOPE_v1';

/* ==========================================================================

03 · INTERNAL STRUCTURE AND IMMUTABILITY

========================================================================== */


function deepFreeze(value) {
if (
value === null ||
typeof value !== 'object' ||
Object.isFrozen(value)
) {
return value;
}

for (const nestedValue of Object.values(value)) {
deepFreeze(nestedValue);
}

return Object.freeze(value);
}

function isPlainObject(value) {
if (
value === null ||
typeof value !== 'object' ||
Array.isArray(value)
) {
return false;
}

const prototype =
Object.getPrototypeOf(value);

return (
prototype === Object.prototype ||
prototype === null
);
}

function clonePlainValue(value) {
if (Array.isArray(value)) {
return value.map(clonePlainValue);
}

if (isPlainObject(value)) {
return Object.fromEntries(
Object.entries(value).map(
([key, nestedValue]) => [
key,
clonePlainValue(nestedValue)
]
)
);
}

return value;
}

function freezeClone(value) {
return deepFreeze(
clonePlainValue(value)
);
}

function ensureArray(value) {
return Array.isArray(value)
? value
: [];
}

function enumIncludes(enumObject, value) {
return Object.values(enumObject)
.includes(value);
}

function createEastIssue(
code,
severity,
message,
details = null,
blocking = null,
context = {}
) {
return createHEarthGeometryIssue(
code,
severity,
message,
details,
blocking,
{
...context,
sourceModule:
'geometry-kernel.east.js'
}
);
}

function getDefaultToleranceContext() {
return deriveHEarthGeometryToleranceContext();
}

function resolveToleranceContext(
explicitContext
) {
if (explicitContext === undefined) {
return getDefaultToleranceContext();
}

return isHEarthGeometryToleranceContext(
explicitContext
)
? explicitContext
: null;
}

/* ==========================================================================

04 · EAST ENUMERATIONS

========================================================================== */


export const H_EARTH_3D_GEOMETRY_EAST_ENUMS = deepFreeze({
descriptorType: deepFreeze({
PARAMETRIC_CURVE:
'PARAMETRIC_CURVE',

PARAMETRIC_SURFACE:  
  'PARAMETRIC_SURFACE',  

HEIGHT_FIELD:  
  'HEIGHT_FIELD',  

SCALAR_FIELD:  
  'SCALAR_FIELD',  

SIGNED_DISTANCE_FIELD:  
  'SIGNED_DISTANCE_FIELD',  

RADIAL_SURFACE:  
  'RADIAL_SURFACE'

}),

descriptorClassification: deepFreeze({
DESCRIPTOR_INVALID:
'DESCRIPTOR_INVALID',

DESCRIPTOR_UNSAMPLEABLE:  
  'DESCRIPTOR_UNSAMPLEABLE',  

DESCRIPTOR_SAMPLEABLE:  
  'DESCRIPTOR_SAMPLEABLE',  

DESCRIPTOR_HELD:  
  'DESCRIPTOR_HELD'

}),

evaluatorStatus: deepFreeze({
EVALUATED:
'EVALUATED',

OUTSIDE_DOMAIN:  
  'OUTSIDE_DOMAIN',  

INVALID_DESCRIPTOR:  
  'INVALID_DESCRIPTOR',  

INVALID_PARAMETER:  
  'INVALID_PARAMETER',  

NONFINITE_RESULT:  
  'NONFINITE_RESULT',  

UNSAMPLEABLE:  
  'UNSAMPLEABLE',  

HELD:  
  'HELD'

}),

domainTopology: deepFreeze({
OPEN:
'OPEN',

PERIODIC:  
  'PERIODIC'

}),

sampleStatus: deepFreeze({
ACCEPTED:
'ACCEPTED',

REJECTED:  
  'REJECTED'

}),

polygonProjectionPlane: deepFreeze({
XY:
'XY',

XZ:  
  'XZ',  

YZ:  
  'YZ'

}),

topologyClassification: deepFreeze({
INVALID:
'INVALID',

OPEN_MANIFOLD:  
  'OPEN_MANIFOLD',  

OPEN_NONMANIFOLD:  
  'OPEN_NONMANIFOLD',  

CLOSED_ORIENTED_MANIFOLD:  
  'CLOSED_ORIENTED_MANIFOLD',  

CLOSED_INWARD_ORIENTED_MANIFOLD:  
  'CLOSED_INWARD_ORIENTED_MANIFOLD',  

CLOSED_MIXED_ORIENTATION:  
  'CLOSED_MIXED_ORIENTATION',  

CLOSED_WINDING_INCONSISTENT:  
  'CLOSED_WINDING_INCONSISTENT',  

CLOSED_DEGENERATE:  
  'CLOSED_DEGENERATE',  

DISCONNECTED_MIXED:  
  'DISCONNECTED_MIXED'

}),

shellOrientation: deepFreeze({
OUTWARD:
'OUTWARD',

INWARD:  
  'INWARD',  

DEGENERATE:  
  'DEGENERATE',  

OPEN:  
  'OPEN',  

NONMANIFOLD:  
  'NONMANIFOLD',  

WINDING_INCONSISTENT:  
  'WINDING_INCONSISTENT'

}),

duplicateClassification: deepFreeze({
UNIQUE:
'UNIQUE',

DUPLICATE:  
  'DUPLICATE'

}),

triangulationOutputClassification: deepFreeze({
ANALYSIS_LEVEL_TRIANGLE_INDEX_PLAN:
'ANALYSIS_LEVEL_TRIANGLE_INDEX_PLAN'
})
});

/* ==========================================================================

05 · DOMAIN CONSTRUCTION AND VALIDATION

========================================================================== */


export function createHEarthParameterDomain({
minimum,
maximum,
topology =
H_EARTH_3D_GEOMETRY_EAST_ENUMS
.domainTopology.OPEN
} = {}) {
if (
!isHEarthFiniteNumber(minimum) ||
!isHEarthFiniteNumber(maximum) ||
minimum > maximum ||
!enumIncludes(
H_EARTH_3D_GEOMETRY_EAST_ENUMS
.domainTopology,
topology
)
) {
return null;
}

if (
topology ===
H_EARTH_3D_GEOMETRY_EAST_ENUMS
.domainTopology.PERIODIC &&
minimum === maximum
) {
return null;
}

return deepFreeze({
minimum,
maximum,
topology
});
}

export function isHEarthParameterDomain(
domain
) {
if (
!isPlainObject(domain) ||
!isHEarthFiniteNumber(domain.minimum) ||
!isHEarthFiniteNumber(domain.maximum) ||
domain.minimum > domain.maximum ||
!enumIncludes(
H_EARTH_3D_GEOMETRY_EAST_ENUMS
.domainTopology,
domain.topology
)
) {
return false;
}

if (
domain.topology ===
H_EARTH_3D_GEOMETRY_EAST_ENUMS
.domainTopology.PERIODIC &&
domain.minimum === domain.maximum
) {
return false;
}

return true;
}

export function isHEarthParameterInsideDomain(
value,
domain,
tolerance =
H_EARTH_3D_GEOMETRY_TOLERANCE_PROFILE
.parameterEpsilon
) {
if (
!isHEarthFiniteNumber(value) ||
!isHEarthParameterDomain(domain) ||
!isHEarthNonNegativeFiniteNumber(
tolerance
)
) {
return false;
}

return (
value >=
domain.minimum -
tolerance &&
value <=
domain.maximum +
tolerance
);
}

export function wrapHEarthPeriodicParameter(
value,
domain
) {
if (
!isHEarthFiniteNumber(value) ||
!isHEarthParameterDomain(domain) ||
domain.topology !==
H_EARTH_3D_GEOMETRY_EAST_ENUMS
.domainTopology.PERIODIC
) {
return Number.NaN;
}

const span =
domain.maximum -
domain.minimum;

if (
!isHEarthPositiveFiniteNumber(span)
) {
return Number.NaN;
}

const wrapped =
domain.minimum +
(
(
value -
domain.minimum
) %
span +
span
) %
span;

return isHEarthFiniteNumber(wrapped)
? wrapped
: Number.NaN;
}

/* ==========================================================================

06 · DESCRIPTOR CONSTRUCTION

========================================================================== */


function createBaseDescriptor({
descriptorId,
descriptorType,
evaluator,
metadata = null
}) {
if (
!isHEarthNonEmptyString(descriptorId) ||
!enumIncludes(
H_EARTH_3D_GEOMETRY_EAST_ENUMS
.descriptorType,
descriptorType
) ||
typeof evaluator !== 'function'
) {
return null;
}

return {
descriptorId,
descriptorType,
evaluator,
metadata:
freezeClone(metadata)
};
}

export function createHEarthParametricCurveDescriptor({
descriptorId,
domain,
evaluator,
metadata = null
} = {}) {
const base =
createBaseDescriptor({
descriptorId,
descriptorType:
H_EARTH_3D_GEOMETRY_EAST_ENUMS
.descriptorType
.PARAMETRIC_CURVE,
evaluator,
metadata
});

if (
!base ||
!isHEarthParameterDomain(domain)
) {
return null;
}

return deepFreeze({
...base,
domain:
freezeClone(domain)
});
}

export function createHEarthParametricSurfaceDescriptor({
descriptorId,
uDomain,
vDomain,
evaluator,
metadata = null
} = {}) {
const base =
createBaseDescriptor({
descriptorId,
descriptorType:
H_EARTH_3D_GEOMETRY_EAST_ENUMS
.descriptorType
.PARAMETRIC_SURFACE,
evaluator,
metadata
});

if (
!base ||
!isHEarthParameterDomain(uDomain) ||
!isHEarthParameterDomain(vDomain)
) {
return null;
}

return deepFreeze({
...base,
uDomain:
freezeClone(uDomain),
vDomain:
freezeClone(vDomain)
});
}

export function createHEarthHeightFieldDescriptor({
descriptorId,
xDomain,
zDomain,
evaluator,
metadata = null
} = {}) {
const base =
createBaseDescriptor({
descriptorId,
descriptorType:
H_EARTH_3D_GEOMETRY_EAST_ENUMS
.descriptorType
.HEIGHT_FIELD,
evaluator,
metadata
});

if (
!base ||
!isHEarthParameterDomain(xDomain) ||
!isHEarthParameterDomain(zDomain)
) {
return null;
}

return deepFreeze({
...base,
xDomain:
freezeClone(xDomain),
zDomain:
freezeClone(zDomain)
});
}

export function createHEarthScalarFieldDescriptor({
descriptorId,
xDomain,
yDomain,
zDomain,
evaluator,
metadata = null
} = {}) {
const base =
createBaseDescriptor({
descriptorId,
descriptorType:
H_EARTH_3D_GEOMETRY_EAST_ENUMS
.descriptorType
.SCALAR_FIELD,
evaluator,
metadata
});

if (
!base ||
!isHEarthParameterDomain(xDomain) ||
!isHEarthParameterDomain(yDomain) ||
!isHEarthParameterDomain(zDomain)
) {
return null;
}

return deepFreeze({
...base,
xDomain:
freezeClone(xDomain),
yDomain:
freezeClone(yDomain),
zDomain:
freezeClone(zDomain)
});
}

export function createHEarthSignedDistanceFieldDescriptor({
descriptorId,
xDomain,
yDomain,
zDomain,
evaluator,
metadata = null
} = {}) {
const base =
createBaseDescriptor({
descriptorId,
descriptorType:
H_EARTH_3D_GEOMETRY_EAST_ENUMS
.descriptorType
.SIGNED_DISTANCE_FIELD,
evaluator,
metadata
});

if (
!base ||
!isHEarthParameterDomain(xDomain) ||
!isHEarthParameterDomain(yDomain) ||
!isHEarthParameterDomain(zDomain)
) {
return null;
}

return deepFreeze({
...base,
xDomain:
freezeClone(xDomain),
yDomain:
freezeClone(yDomain),
zDomain:
freezeClone(zDomain)
});
}

export function createHEarthRadialSurfaceDescriptor({
descriptorId,
uDomain,
vDomain,
evaluator,
metadata = null
} = {}) {
const base =
createBaseDescriptor({
descriptorId,
descriptorType:
H_EARTH_3D_GEOMETRY_EAST_ENUMS
.descriptorType
.RADIAL_SURFACE,
evaluator,
metadata
});

if (
!base ||
!isHEarthParameterDomain(uDomain) ||
!isHEarthParameterDomain(vDomain)
) {
return null;
}

return deepFreeze({
...base,
uDomain:
freezeClone(uDomain),
vDomain:
freezeClone(vDomain)
});
}

/* ==========================================================================

07 · DESCRIPTOR STRUCTURAL VALIDATION

========================================================================== */


export function validateHEarthEquationDescriptor(
descriptor
) {
const issues = [];

if (!isPlainObject(descriptor)) {
issues.push(
createEastIssue(
'DESCRIPTOR_STRUCTURE_INVALID',
'ERROR',
'Descriptor must be an object.'
)
);

return deepFreeze({  
  valid:  
    false,  

  classification:  
    H_EARTH_3D_GEOMETRY_EAST_ENUMS  
      .descriptorClassification  
      .DESCRIPTOR_INVALID,  

  descriptorType:  
    null,  

  issues:  
    sortHEarthGeometryIssues(  
      issues  
    )  
});

}

if (
!isHEarthNonEmptyString(
descriptor.descriptorId
)
) {
issues.push(
createEastIssue(
'DESCRIPTOR_ID_INVALID',
'ERROR',
'Descriptor requires a nonempty descriptorId.',
null,
true,
{
descriptorId:
descriptor.descriptorId
}
)
);
}

if (
!enumIncludes(
H_EARTH_3D_GEOMETRY_EAST_ENUMS
.descriptorType,
descriptor.descriptorType
)
) {
issues.push(
createEastIssue(
'DESCRIPTOR_TYPE_INVALID',
'ERROR',
'Descriptor type is unsupported.',
{
descriptorType:
descriptor.descriptorType
},
true,
{
descriptorId:
descriptor.descriptorId
}
)
);
}

if (
typeof descriptor.evaluator !==
'function'
) {
issues.push(
createEastIssue(
'DESCRIPTOR_EVALUATOR_INVALID',
'ERROR',
'Descriptor evaluator must be a function.',
null,
true,
{
descriptorId:
descriptor.descriptorId
}
)
);
}

switch (descriptor.descriptorType) {
case H_EARTH_3D_GEOMETRY_EAST_ENUMS
.descriptorType.PARAMETRIC_CURVE:
if (
!isHEarthParameterDomain(
descriptor.domain
)
) {
issues.push(
createEastIssue(
'CURVE_DOMAIN_INVALID',
'ERROR',
'Parametric curve requires a valid domain.',
null,
true,
{
descriptorId:
descriptor.descriptorId
}
)
);
}
break;

case H_EARTH_3D_GEOMETRY_EAST_ENUMS  
  .descriptorType.PARAMETRIC_SURFACE:  

case H_EARTH_3D_GEOMETRY_EAST_ENUMS  
  .descriptorType.RADIAL_SURFACE:  
  if (  
    !isHEarthParameterDomain(  
      descriptor.uDomain  
    ) ||  
    !isHEarthParameterDomain(  
      descriptor.vDomain  
    )  
  ) {  
    issues.push(  
      createEastIssue(  
        'SURFACE_DOMAIN_INVALID',  
        'ERROR',  
        'Surface descriptors require valid u and v domains.',  
        null,  
        true,  
        {  
          descriptorId:  
            descriptor.descriptorId  
        }  
      )  
    );  
  }  
  break;  

case H_EARTH_3D_GEOMETRY_EAST_ENUMS  
  .descriptorType.HEIGHT_FIELD:  
  if (  
    !isHEarthParameterDomain(  
      descriptor.xDomain  
    ) ||  
    !isHEarthParameterDomain(  
      descriptor.zDomain  
    )  
  ) {  
    issues.push(  
      createEastIssue(  
        'HEIGHT_FIELD_DOMAIN_INVALID',  
        'ERROR',  
        'Height field requires valid x and z domains.',  
        null,  
        true,  
        {  
          descriptorId:  
            descriptor.descriptorId  
        }  
      )  
    );  
  }  
  break;  

case H_EARTH_3D_GEOMETRY_EAST_ENUMS  
  .descriptorType.SCALAR_FIELD:  

case H_EARTH_3D_GEOMETRY_EAST_ENUMS  
  .descriptorType.SIGNED_DISTANCE_FIELD:  
  if (  
    !isHEarthParameterDomain(  
      descriptor.xDomain  
    ) ||  
    !isHEarthParameterDomain(  
      descriptor.yDomain  
    ) ||  
    !isHEarthParameterDomain(  
      descriptor.zDomain  
    )  
  ) {  
    issues.push(  
      createEastIssue(  
        'VOLUMETRIC_FIELD_DOMAIN_INVALID',  
        'ERROR',  
        'Volumetric field requires valid x, y, and z domains.',  
        null,  
        true,  
        {  
          descriptorId:  
            descriptor.descriptorId  
        }  
      )  
    );  
  }  
  break;  

default:  
  break;

}

return deepFreeze({
valid:
!hasHEarthBlockingIssues(
issues
),

classification:  
  hasHEarthBlockingIssues(issues)  
    ? H_EARTH_3D_GEOMETRY_EAST_ENUMS  
        .descriptorClassification  
        .DESCRIPTOR_INVALID  
    : H_EARTH_3D_GEOMETRY_EAST_ENUMS  
        .descriptorClassification  
        .DESCRIPTOR_SAMPLEABLE,  

descriptorType:  
  descriptor.descriptorType ??  
  null,  

issues:  
  sortHEarthGeometryIssues(  
    issues  
  )

});
}

/* ==========================================================================

08 · DOMAIN-AWARE DESCRIPTOR EVALUATION

========================================================================== */


function resolveDescriptorParameters(
descriptor,
parameters,
toleranceContext
) {
const tolerance =
toleranceContext.parameterTolerance;

switch (descriptor.descriptorType) {
case H_EARTH_3D_GEOMETRY_EAST_ENUMS
.descriptorType.PARAMETRIC_CURVE: {
const t =
parameters?.t;

if (  
    !isHEarthFiniteNumber(t)  
  ) {  
    return {  
      valid:  
        false,  
      outsideDomain:  
        false,  
      parameters:  
        null  
    };  
  }  

  if (  
    !isHEarthParameterInsideDomain(  
      t,  
      descriptor.domain,  
      tolerance  
    )  
  ) {  
    if (  
      descriptor.domain.topology ===  
        H_EARTH_3D_GEOMETRY_EAST_ENUMS  
          .domainTopology.PERIODIC  
    ) {  
      const wrapped =  
        wrapHEarthPeriodicParameter(  
          t,  
          descriptor.domain  
        );  

      return isHEarthFiniteNumber(  
        wrapped  
      )  
        ? {  
            valid:  
              true,  
            outsideDomain:  
              false,  
            parameters:  
              deepFreeze({  
                t:  
                  wrapped  
              })  
          }  
        : {  
            valid:  
              false,  
            outsideDomain:  
              true,  
            parameters:  
              null  
          };  
    }  

    return {  
      valid:  
        false,  
      outsideDomain:  
        true,  
      parameters:  
        null  
    };  
  }  

  return {  
    valid:  
      true,  
    outsideDomain:  
      false,  
    parameters:  
      deepFreeze({  
        t  
      })  
  };  
}  

case H_EARTH_3D_GEOMETRY_EAST_ENUMS  
  .descriptorType.PARAMETRIC_SURFACE:  

case H_EARTH_3D_GEOMETRY_EAST_ENUMS  
  .descriptorType.RADIAL_SURFACE: {  
  const u =  
    parameters?.u;  

  const v =  
    parameters?.v;  

  if (  
    !isHEarthFiniteNumber(u) ||  
    !isHEarthFiniteNumber(v)  
  ) {  
    return {  
      valid:  
        false,  
      outsideDomain:  
        false,  
      parameters:  
        null  
    };  
  }  

  const resolvedU =  
    isHEarthParameterInsideDomain(  
      u,  
      descriptor.uDomain,  
      tolerance  
    )  
      ? u  
      : (  
          descriptor.uDomain.topology ===  
            H_EARTH_3D_GEOMETRY_EAST_ENUMS  
              .domainTopology.PERIODIC  
            ? wrapHEarthPeriodicParameter(  
                u,  
                descriptor.uDomain  
              )  
            : Number.NaN  
        );  

  const resolvedV =  
    isHEarthParameterInsideDomain(  
      v,  
      descriptor.vDomain,  
      tolerance  
    )  
      ? v  
      : (  
          descriptor.vDomain.topology ===  
            H_EARTH_3D_GEOMETRY_EAST_ENUMS  
              .domainTopology.PERIODIC  
            ? wrapHEarthPeriodicParameter(  
                v,  
                descriptor.vDomain  
              )  
            : Number.NaN  
        );  

  if (  
    !isHEarthFiniteNumber(  
      resolvedU  
    ) ||  
    !isHEarthFiniteNumber(  
      resolvedV  
    )  
  ) {  
    return {  
      valid:  
        false,  
      outsideDomain:  
        true,  
      parameters:  
        null  
    };  
  }  

  return {  
    valid:  
      true,  
    outsideDomain:  
      false,  
    parameters:  
      deepFreeze({  
        u:  
          resolvedU,  
        v:  
          resolvedV  
      })  
  };  
}  

case H_EARTH_3D_GEOMETRY_EAST_ENUMS  
  .descriptorType.HEIGHT_FIELD: {  
  const x =  
    parameters?.x;  

  const z =  
    parameters?.z;  

  if (  
    !isHEarthFiniteNumber(x) ||  
    !isHEarthFiniteNumber(z)  
  ) {  
    return {  
      valid:  
        false,  
      outsideDomain:  
        false,  
      parameters:  
        null  
    };  
  }  

  if (  
    !isHEarthParameterInsideDomain(  
      x,  
      descriptor.xDomain,  
      tolerance  
    ) ||  
    !isHEarthParameterInsideDomain(  
      z,  
      descriptor.zDomain,  
      tolerance  
    )  
  ) {  
    return {  
      valid:  
        false,  
      outsideDomain:  
        true,  
      parameters:  
        null  
    };  
  }  

  return {  
    valid:  
      true,  
    outsideDomain:  
      false,  
    parameters:  
      deepFreeze({  
        x,  
        z  
      })  
  };  
}  

case H_EARTH_3D_GEOMETRY_EAST_ENUMS  
  .descriptorType.SCALAR_FIELD:  

case H_EARTH_3D_GEOMETRY_EAST_ENUMS  
  .descriptorType.SIGNED_DISTANCE_FIELD: {  
  const x =  
    parameters?.x;  

  const y =  
    parameters?.y;  

  const z =  
    parameters?.z;  

  if (  
    !isHEarthFiniteNumber(x) ||  
    !isHEarthFiniteNumber(y) ||  
    !isHEarthFiniteNumber(z)  
  ) {  
    return {  
      valid:  
        false,  
      outsideDomain:  
        false,  
      parameters:  
        null  
    };  
  }  

  if (  
    !isHEarthParameterInsideDomain(  
      x,  
      descriptor.xDomain,  
      tolerance  
    ) ||  
    !isHEarthParameterInsideDomain(  
      y,  
      descriptor.yDomain,  
      tolerance  
    ) ||  
    !isHEarthParameterInsideDomain(  
      z,  
      descriptor.zDomain,  
      tolerance  
    )  
  ) {  
    return {  
      valid:  
        false,  
      outsideDomain:  
        true,  
      parameters:  
        null  
    };  
  }  

  return {  
    valid:  
      true,  
    outsideDomain:  
      false,  
    parameters:  
      deepFreeze({  
        x,  
        y,  
        z  
      })  
  };  
}  

default:  
  return {  
    valid:  
      false,  
    outsideDomain:  
      false,  
    parameters:  
      null  
  };

}
}

function isDescriptorResultValid(
descriptorType,
value
) {
switch (descriptorType) {
case H_EARTH_3D_GEOMETRY_EAST_ENUMS
.descriptorType.PARAMETRIC_CURVE:

case H_EARTH_3D_GEOMETRY_EAST_ENUMS  
  .descriptorType.PARAMETRIC_SURFACE:  

case H_EARTH_3D_GEOMETRY_EAST_ENUMS  
  .descriptorType.RADIAL_SURFACE:  
  return isHEarthVector3(value);  

case H_EARTH_3D_GEOMETRY_EAST_ENUMS  
  .descriptorType.HEIGHT_FIELD:  

case H_EARTH_3D_GEOMETRY_EAST_ENUMS  
  .descriptorType.SCALAR_FIELD:  

case H_EARTH_3D_GEOMETRY_EAST_ENUMS  
  .descriptorType.SIGNED_DISTANCE_FIELD:  
  return isHEarthFiniteNumber(value);  

default:  
  return false;

}
}

export function evaluateHEarthEquationDescriptor(
descriptor,
parameters,
toleranceContext
) {
const resolvedToleranceContext =
resolveToleranceContext(
toleranceContext
);

if (
!isHEarthGeometryToleranceContext(
resolvedToleranceContext
)
) {
return deepFreeze({
classification:
H_EARTH_3D_GEOMETRY_EAST_ENUMS
.descriptorClassification
.DESCRIPTOR_UNSAMPLEABLE,

evaluatorStatus:  
    H_EARTH_3D_GEOMETRY_EAST_ENUMS  
      .evaluatorStatus  
      .UNSAMPLEABLE,  

  value:  
    null,  

  parameters:  
    null,  

  issues:  
    deepFreeze([  
      createEastIssue(  
        'EVALUATOR_TOLERANCE_CONTEXT_INVALID',  
        'ERROR',  
        'Descriptor evaluation requires a valid tolerance context.'  
      )  
    ])  
});

}

const validation =
validateHEarthEquationDescriptor(
descriptor
);

if (!validation.valid) {
return deepFreeze({
classification:
H_EARTH_3D_GEOMETRY_EAST_ENUMS
.descriptorClassification
.DESCRIPTOR_INVALID,

evaluatorStatus:  
    H_EARTH_3D_GEOMETRY_EAST_ENUMS  
      .evaluatorStatus  
      .INVALID_DESCRIPTOR,  

  value:  
    null,  

  parameters:  
    null,  

  issues:  
    validation.issues  
});

}

const parameterResolution =
resolveDescriptorParameters(
descriptor,
parameters,
resolvedToleranceContext
);

if (!parameterResolution.valid) {
const outsideDomain =
parameterResolution
.outsideDomain === true;

return deepFreeze({  
  classification:  
    H_EARTH_3D_GEOMETRY_EAST_ENUMS  
      .descriptorClassification  
      .DESCRIPTOR_UNSAMPLEABLE,  

  evaluatorStatus:  
    outsideDomain  
      ? H_EARTH_3D_GEOMETRY_EAST_ENUMS  
          .evaluatorStatus  
          .OUTSIDE_DOMAIN  
      : H_EARTH_3D_GEOMETRY_EAST_ENUMS  
          .evaluatorStatus  
          .INVALID_PARAMETER,  

  value:  
    null,  

  parameters:  
    null,  

  issues:  
    deepFreeze([  
      createEastIssue(  
        outsideDomain  
          ? 'DESCRIPTOR_PARAMETER_OUTSIDE_DOMAIN'  
          : 'DESCRIPTOR_PARAMETER_INVALID',  
        'ERROR',  
        outsideDomain  
          ? 'Descriptor parameters are outside the admitted domain.'  
          : 'Descriptor parameters are malformed or nonfinite.',  
        {  
          parameters  
        },  
        true,  
        {  
          descriptorId:  
            descriptor.descriptorId  
        }  
      )  
    ])  
});

}

let value;

try {
value =
descriptor.evaluator(
parameterResolution.parameters
);
} catch (error) {
return deepFreeze({
classification:
H_EARTH_3D_GEOMETRY_EAST_ENUMS
.descriptorClassification
.DESCRIPTOR_UNSAMPLEABLE,

evaluatorStatus:  
    H_EARTH_3D_GEOMETRY_EAST_ENUMS  
      .evaluatorStatus  
      .UNSAMPLEABLE,  

  value:  
    null,  

  parameters:  
    parameterResolution.parameters,  

  issues:  
    deepFreeze([  
      createEastIssue(  
        'DESCRIPTOR_EVALUATOR_THREW',  
        'ERROR',  
        'Descriptor evaluator threw an exception.',  
        {  
          errorName:  
            error?.name ??  
            null,  

          errorMessage:  
            error?.message ??  
            null  
        },  
        true,  
        {  
          descriptorId:  
            descriptor.descriptorId  
        }  
      )  
    ])  
});

}

if (
!isDescriptorResultValid(
descriptor.descriptorType,
value
)
) {
return deepFreeze({
classification:
H_EARTH_3D_GEOMETRY_EAST_ENUMS
.descriptorClassification
.DESCRIPTOR_UNSAMPLEABLE,

evaluatorStatus:  
    H_EARTH_3D_GEOMETRY_EAST_ENUMS  
      .evaluatorStatus  
      .NONFINITE_RESULT,  

  value:  
    null,  

  parameters:  
    parameterResolution.parameters,  

  issues:  
    deepFreeze([  
      createEastIssue(  
        'DESCRIPTOR_EVALUATOR_RESULT_INVALID',  
        'ERROR',  
        'Descriptor evaluator returned an invalid or nonfinite result.',  
        {  
          descriptorType:  
            descriptor.descriptorType  
        },  
        true,  
        {  
          descriptorId:  
            descriptor.descriptorId  
        }  
      )  
    ])  
});

}

return deepFreeze({
classification:
H_EARTH_3D_GEOMETRY_EAST_ENUMS
.descriptorClassification
.DESCRIPTOR_SAMPLEABLE,

evaluatorStatus:  
  H_EARTH_3D_GEOMETRY_EAST_ENUMS  
    .evaluatorStatus  
    .EVALUATED,  

value:  
  freezeClone(value),  

parameters:  
  parameterResolution.parameters,  

issues:  
  deepFreeze([])

});
}

/* ==========================================================================

09 · DETERMINISTIC DOMAIN SAMPLING

========================================================================== */


export function sampleHEarthParameterDomain(
domain,
sampleCount
) {
if (
!isHEarthParameterDomain(domain) ||
!isHEarthPositiveSafeInteger(
sampleCount
)
) {
return null;
}

const periodic =
domain.topology ===
H_EARTH_3D_GEOMETRY_EAST_ENUMS
.domainTopology.PERIODIC;

if (
periodic &&
sampleCount < 3
) {
return null;
}

if (
!periodic &&
sampleCount === 1
) {
return deepFreeze([
domain.minimum
]);
}

const denominator =
periodic
? sampleCount
: sampleCount - 1;

if (
!isHEarthPositiveFiniteNumber(
denominator
)
) {
return null;
}

const values = [];

for (
let index = 0;
index < sampleCount;
index += 1
) {
const amount =
index / denominator;

const value =  
  lerpHEarthNumber(  
    domain.minimum,  
    domain.maximum,  
    amount  
  );  

if (  
  !isHEarthFiniteNumber(value)  
) {  
  return null;  
}  

values.push(value);

}

return deepFreeze(values);
}

function createSampleRecord({
sampleIndex,
address,
parameters,
evaluation
}) {
return deepFreeze({
sampleIndex,

address:  
  freezeClone(address),  

parameters:  
  freezeClone(parameters),  

status:  
  evaluation.evaluatorStatus ===  
    H_EARTH_3D_GEOMETRY_EAST_ENUMS  
      .evaluatorStatus.EVALUATED  
    ? H_EARTH_3D_GEOMETRY_EAST_ENUMS  
        .sampleStatus.ACCEPTED  
    : H_EARTH_3D_GEOMETRY_EAST_ENUMS  
        .sampleStatus.REJECTED,  

value:  
  freezeClone(evaluation.value),  

evaluatorStatus:  
  evaluation.evaluatorStatus,  

issues:  
  evaluation.issues

});
}

export function sampleHEarthParametricCurve(
descriptor,
sampleCount,
toleranceContext
) {
const validation =
validateHEarthEquationDescriptor(
descriptor
);

if (
!validation.valid ||
descriptor.descriptorType !==
H_EARTH_3D_GEOMETRY_EAST_ENUMS
.descriptorType
.PARAMETRIC_CURVE
) {
return deepFreeze({
valid:
false,

samples:  
    deepFreeze([]),  

  acceptedSampleCount:  
    0,  

  rejectedSampleCount:  
    0,  

  issues:  
    validation.issues  
});

}

const parameters =
sampleHEarthParameterDomain(
descriptor.domain,
sampleCount
);

if (!parameters) {
return deepFreeze({
valid:
false,

samples:  
    deepFreeze([]),  

  acceptedSampleCount:  
    0,  

  rejectedSampleCount:  
    0,  

  issues:  
    deepFreeze([  
      createEastIssue(  
        'CURVE_SAMPLE_CONFIGURATION_INVALID',  
        'ERROR',  
        'Curve sampling configuration is invalid.',  
        {  
          sampleCount,  
          domainTopology:  
            descriptor.domain.topology,  
          periodicMinimumSampleCount:  
            3  
        },  
        true,  
        {  
          descriptorId:  
            descriptor.descriptorId  
        }  
      )  
    ])  
});

}

const samples =
parameters.map(
(
t,
sampleIndex
) =>
createSampleRecord({
sampleIndex,

address: {  
        columnIndex:  
          sampleIndex  
      },  

      parameters: {  
        t  
      },  

      evaluation:  
        evaluateHEarthEquationDescriptor(  
          descriptor,  
          {  
            t  
          },  
          toleranceContext  
        )  
    })  
);

const acceptedSampleCount =
samples.filter(
(sample) =>
sample.status ===
H_EARTH_3D_GEOMETRY_EAST_ENUMS
.sampleStatus.ACCEPTED
).length;

const rejectedSampleCount =
samples.length -
acceptedSampleCount;

return deepFreeze({
valid:
rejectedSampleCount === 0,

sampleTopology:  
  descriptor.domain.topology,  

terminalSampleDuplicated:  
  false,  

samples:  
  deepFreeze(samples),  

acceptedSampleCount,  

rejectedSampleCount,  

issues:  
  sortHEarthGeometryIssues(  
    samples.flatMap(  
      (sample) =>  
        sample.issues  
    )  
  )

});
}

function sampleHEarthGridDescriptor({
descriptor,
firstDomain,
secondDomain,
firstSampleCount,
secondSampleCount,
firstParameterName,
secondParameterName,
toleranceContext
}) {
const firstValues =
sampleHEarthParameterDomain(
firstDomain,
firstSampleCount
);

const secondValues =
sampleHEarthParameterDomain(
secondDomain,
secondSampleCount
);

if (
!firstValues ||
!secondValues
) {
return deepFreeze({
valid:
false,

rowCount:  
    0,  

  columnCount:  
    0,  

  samples:  
    deepFreeze([]),  

  acceptedSampleCount:  
    0,  

  rejectedSampleCount:  
    0,  

  issues:  
    deepFreeze([  
      createEastIssue(  
        'GRID_SAMPLE_CONFIGURATION_INVALID',  
        'ERROR',  
        'Grid sampling configuration is invalid.',  
        {  
          firstSampleCount,  
          secondSampleCount,  
          firstDomainTopology:  
            firstDomain?.topology ??  
            null,  
          secondDomainTopology:  
            secondDomain?.topology ??  
            null,  
          periodicMinimumSampleCount:  
            3  
        },  
        true,  
        {  
          descriptorId:  
            descriptor?.descriptorId  
        }  
      )  
    ])  
});

}

const samples = [];

let sampleIndex = 0;

for (
let rowIndex = 0;
rowIndex < secondValues.length;
rowIndex += 1
) {
for (
let columnIndex = 0;
columnIndex < firstValues.length;
columnIndex += 1
) {
const parameters = {
[firstParameterName]:
firstValues[columnIndex],

[secondParameterName]:  
      secondValues[rowIndex]  
  };  

  const evaluation =  
    evaluateHEarthEquationDescriptor(  
      descriptor,  
      parameters,  
      toleranceContext  
    );  

  samples.push(  
    createSampleRecord({  
      sampleIndex,  

      address: {  
        rowIndex,  
        columnIndex  
      },  

      parameters,  

      evaluation  
    })  
  );  

  sampleIndex += 1;  
}

}

const acceptedSampleCount =
samples.filter(
(sample) =>
sample.status ===
H_EARTH_3D_GEOMETRY_EAST_ENUMS
.sampleStatus.ACCEPTED
).length;

const rejectedSampleCount =
samples.length -
acceptedSampleCount;

return deepFreeze({
valid:
rejectedSampleCount === 0,

rowCount:  
  secondValues.length,  

columnCount:  
  firstValues.length,  

firstTopology:  
  firstDomain.topology,  

secondTopology:  
  secondDomain.topology,  

firstTerminalSampleDuplicated:  
  false,  

secondTerminalSampleDuplicated:  
  false,  

samples:  
  deepFreeze(samples),  

acceptedSampleCount,  

rejectedSampleCount,  

issues:  
  sortHEarthGeometryIssues(  
    samples.flatMap(  
      (sample) =>  
        sample.issues  
    )  
  )

});
}

export function sampleHEarthParametricSurface(
descriptor,
uSampleCount,
vSampleCount,
toleranceContext
) {
const validation =
validateHEarthEquationDescriptor(
descriptor
);

if (
!validation.valid ||
(
descriptor.descriptorType !==
H_EARTH_3D_GEOMETRY_EAST_ENUMS
.descriptorType
.PARAMETRIC_SURFACE &&
descriptor.descriptorType !==
H_EARTH_3D_GEOMETRY_EAST_ENUMS
.descriptorType
.RADIAL_SURFACE
)
) {
return deepFreeze({
valid:
false,

rowCount:  
    0,  

  columnCount:  
    0,  

  samples:  
    deepFreeze([]),  

  acceptedSampleCount:  
    0,  

  rejectedSampleCount:  
    0,  

  issues:  
    validation.issues  
});

}

return sampleHEarthGridDescriptor({
descriptor,

firstDomain:  
  descriptor.uDomain,  

secondDomain:  
  descriptor.vDomain,  

firstSampleCount:  
  uSampleCount,  

secondSampleCount:  
  vSampleCount,  

firstParameterName:  
  'u',  

secondParameterName:  
  'v',  

toleranceContext

});
}

export function sampleHEarthHeightField(
descriptor,
xSampleCount,
zSampleCount,
toleranceContext
) {
const validation =
validateHEarthEquationDescriptor(
descriptor
);

if (
!validation.valid ||
descriptor.descriptorType !==
H_EARTH_3D_GEOMETRY_EAST_ENUMS
.descriptorType
.HEIGHT_FIELD
) {
return deepFreeze({
valid:
false,

rowCount:  
    0,  

  columnCount:  
    0,  

  samples:  
    deepFreeze([]),  

  acceptedSampleCount:  
    0,  

  rejectedSampleCount:  
    0,  

  issues:  
    validation.issues  
});

}

const sampled =
sampleHEarthGridDescriptor({
descriptor,

firstDomain:  
    descriptor.xDomain,  

  secondDomain:  
    descriptor.zDomain,  

  firstSampleCount:  
    xSampleCount,  

  secondSampleCount:  
    zSampleCount,  

  firstParameterName:  
    'x',  

  secondParameterName:  
    'z',  

  toleranceContext  
});

const convertedSamples =
sampled.samples.map(
(sample) => {
if (
sample.status !==
H_EARTH_3D_GEOMETRY_EAST_ENUMS
.sampleStatus.ACCEPTED
) {
return sample;
}

const x =  
      sample.parameters.x;  

    const z =  
      sample.parameters.z;  

    const y =  
      sample.value;  

    const point =  
      createHEarthVector3(  
        x,  
        y,  
        z  
      );  

    if (!point) {  
      return deepFreeze({  
        ...sample,  

        status:  
          H_EARTH_3D_GEOMETRY_EAST_ENUMS  
            .sampleStatus.REJECTED,  

        value:  
          null,  

        evaluatorStatus:  
          H_EARTH_3D_GEOMETRY_EAST_ENUMS  
            .evaluatorStatus  
            .NONFINITE_RESULT,  

        issues:  
          deepFreeze([  
            createEastIssue(  
              'HEIGHT_FIELD_POINT_NONFINITE',  
              'ERROR',  
              'Height-field sample could not be converted to a finite Vector3.',  
              {  
                x,  
                y,  
                z  
              },  
              true,  
              {  
                descriptorId:  
                  descriptor.descriptorId  
              }  
            )  
          ])  
      });  
    }  

    return deepFreeze({  
      ...sample,  
      value:  
        point  
    });  
  }  
);

const acceptedSampleCount =
convertedSamples.filter(
(sample) =>
sample.status ===
H_EARTH_3D_GEOMETRY_EAST_ENUMS
.sampleStatus.ACCEPTED
).length;

const rejectedSampleCount =
convertedSamples.length -
acceptedSampleCount;

return deepFreeze({
...sampled,

valid:  
  rejectedSampleCount === 0,  

samples:  
  deepFreeze(  
    convertedSamples  
  ),  

acceptedSampleCount,  

rejectedSampleCount,  

topologyConstructionHeld:  
  rejectedSampleCount > 0,  

issues:  
  sortHEarthGeometryIssues(  
    convertedSamples.flatMap(  
      (sample) =>  
        sample.issues  
    )  
  )

});
}

/* ==========================================================================

10 · GRID ADDRESS INTEGRITY

========================================================================== */


export function evaluateHEarthGridSampleIntegrity(
sampleSet
) {
const issues = [];

if (
!isPlainObject(sampleSet) ||
!isHEarthPositiveSafeInteger(
sampleSet.rowCount
) ||
!isHEarthPositiveSafeInteger(
sampleSet.columnCount
) ||
!Array.isArray(sampleSet.samples)
) {
issues.push(
createEastIssue(
'GRID_SAMPLE_SET_INVALID',
'ERROR',
'Grid sample integrity requires a rectangular sample-set record.'
)
);

return deepFreeze({  
  valid:  
    false,  

  complete:  
    false,  

  expectedSampleCount:  
    null,  

  actualSampleCount:  
    null,  

  rejectedSampleCount:  
    null,  

  topologyConstructionHeld:  
    true,  

  issues:  
    sortHEarthGeometryIssues(  
      issues  
    )  
});

}

const expectedSampleCount =
sampleSet.rowCount *
sampleSet.columnCount;

if (
!Number.isSafeInteger(
expectedSampleCount
)
) {
issues.push(
createEastIssue(
'GRID_SAMPLE_COUNT_OVERFLOW',
'ERROR',
'Grid sample count exceeded safe-integer limits.'
)
);
}

if (
sampleSet.samples.length !==
expectedSampleCount
) {
issues.push(
createEastIssue(
'GRID_SAMPLE_ADDRESS_COUNT_MISMATCH',
'ERROR',
'Grid sample array does not preserve complete rectangular addressing.',
{
expectedSampleCount,

actualSampleCount:  
        sampleSet.samples.length  
    }  
  )  
);

}

const seenAddresses =
new Set();

for (
const sample of
sampleSet.samples
) {
const rowIndex =
sample?.address?.rowIndex;

const columnIndex =  
  sample?.address?.columnIndex;  

if (  
  !isHEarthNonNegativeSafeInteger(  
    rowIndex  
  ) ||  
  !isHEarthNonNegativeSafeInteger(  
    columnIndex  
  ) ||  
  rowIndex >=  
    sampleSet.rowCount ||  
  columnIndex >=  
    sampleSet.columnCount  
) {  
  issues.push(  
    createEastIssue(  
      'GRID_SAMPLE_ADDRESS_INVALID',  
      'ERROR',  
      'Grid sample address is outside the rectangular address space.',  
      {  
        rowIndex,  
        columnIndex  
      }  
    )  
  );  

  continue;  
}  

const key =  
  `${rowIndex}:${columnIndex}`;  

if (seenAddresses.has(key)) {  
  issues.push(  
    createEastIssue(  
      'GRID_SAMPLE_ADDRESS_DUPLICATE',  
      'ERROR',  
      'Grid sample address occurs more than once.',  
      {  
        rowIndex,  
        columnIndex  
      }  
    )  
  );  
}  

seenAddresses.add(key);

}

const rejectedSampleCount =
sampleSet.samples.filter(
(sample) =>
sample?.status ===
H_EARTH_3D_GEOMETRY_EAST_ENUMS
.sampleStatus.REJECTED
).length;

if (rejectedSampleCount > 0) {
issues.push(
createEastIssue(
'GRID_SAMPLE_SET_PARTIALLY_REJECTED',
'ERROR',
'Grid topology construction must be held when any grid sample is rejected.',
{
rejectedSampleCount
}
)
);
}

return deepFreeze({
valid:
!hasHEarthBlockingIssues(
issues
),

complete:  
  sampleSet.samples.length ===  
    expectedSampleCount &&  
  seenAddresses.size ===  
    expectedSampleCount,  

expectedSampleCount,  

actualSampleCount:  
  sampleSet.samples.length,  

rejectedSampleCount,  

topologyConstructionHeld:  
  rejectedSampleCount > 0 ||  
  hasHEarthBlockingIssues(  
    issues  
  ),  

issues:  
  sortHEarthGeometryIssues(  
    issues  
  )

});
}

/* ==========================================================================

11 · DUPLICATE-SAMPLE ANALYSIS

========================================================================== */


function quantizeCoordinate(
value,
cellSize
) {
return Math.floor(
value / cellSize
);
}

function getSpatialCellKey(
point,
cellSize
) {
return [
quantizeCoordinate(
point.x,
cellSize
),

quantizeCoordinate(  
  point.y,  
  cellSize  
),  

quantizeCoordinate(  
  point.z,  
  cellSize  
)

].join(':');
}

export function analyzeHEarthDuplicatePoints(
points,
toleranceContext
) {
const resolvedToleranceContext =
resolveToleranceContext(
toleranceContext
);

if (
!Array.isArray(points) ||
!points.every(
isHEarthVector3
) ||
!isHEarthGeometryToleranceContext(
resolvedToleranceContext
)
) {
return deepFreeze({
valid:
false,

canonicalIndexBySubmittedIndex:  
    deepFreeze([]),  

  duplicateGroups:  
    deepFreeze([]),  

  uniquePointCount:  
    0,  

  duplicatePointCount:  
    0,  

  searchStrategy:  
    'SPATIAL_HASH_NEIGHBORHOOD',  

  issues:  
    deepFreeze([  
      createEastIssue(  
        'DUPLICATE_ANALYSIS_INPUT_INVALID',  
        'ERROR',  
        'Duplicate analysis requires finite Vector3 points and a valid tolerance context.'  
      )  
    ])  
});

}

const cellSize =
Math.max(
resolvedToleranceContext
.positionTolerance,
Number.EPSILON
);

const buckets =
new Map();

const canonicalIndexBySubmittedIndex =
new Array(points.length);

const groups =
new Map();

const neighborOffsets =
[-1, 0, 1];

for (
let submittedIndex = 0;
submittedIndex < points.length;
submittedIndex += 1
) {
const point =
points[submittedIndex];

const baseX =  
  quantizeCoordinate(  
    point.x,  
    cellSize  
  );  

const baseY =  
  quantizeCoordinate(  
    point.y,  
    cellSize  
  );  

const baseZ =  
  quantizeCoordinate(  
    point.z,  
    cellSize  
  );  

let canonicalIndex =  
  submittedIndex;  

for (  
  const offsetX of  
  neighborOffsets  
) {  
  for (  
    const offsetY of  
    neighborOffsets  
  ) {  
    for (  
      const offsetZ of  
      neighborOffsets  
    ) {  
      const key =  
        `${baseX + offsetX}:` +  
        `${baseY + offsetY}:` +  
        `${baseZ + offsetZ}`;  

      const bucket =  
        buckets.get(key) ??  
        [];  

      for (  
        const candidateIndex of  
        bucket  
      ) {  
        const distance =  
          getHEarthVector3Distance(  
            point,  
            points[candidateIndex]  
          );  

        if (  
          isHEarthFiniteNumber(  
            distance  
          ) &&  
          distance <=  
            resolvedToleranceContext  
              .positionTolerance  
        ) {  
          canonicalIndex =  
            Math.min(  
              canonicalIndex,  
              canonicalIndexBySubmittedIndex[  
                candidateIndex  
              ] ??  
              candidateIndex  
            );  
        }  
      }  
    }  
  }  
}  

canonicalIndexBySubmittedIndex[  
  submittedIndex  
] = canonicalIndex;  

if (!groups.has(canonicalIndex)) {  
  groups.set(  
    canonicalIndex,  
    []  
  );  
}  

groups.get(canonicalIndex)  
  .push(submittedIndex);  

const ownKey =  
  getSpatialCellKey(  
    point,  
    cellSize  
  );  

if (!buckets.has(ownKey)) {  
  buckets.set(  
    ownKey,  
    []  
  );  
}  

buckets.get(ownKey)  
  .push(submittedIndex);

}

const duplicateGroups =
[...groups.entries()]
.filter(
([, indices]) =>
indices.length > 1
)
.map(
(
[
canonicalIndex,
indices
]
) =>
deepFreeze({
canonicalIndex,

submittedIndices:  
          deepFreeze(  
            indices.slice()  
          )  
      })  
  )  
  .sort(  
    (left, right) =>  
      left.canonicalIndex -  
      right.canonicalIndex  
  );

const uniquePointCount =
groups.size;

return deepFreeze({
valid:
true,

canonicalIndexBySubmittedIndex:  
  deepFreeze(  
    canonicalIndexBySubmittedIndex  
  ),  

duplicateGroups:  
  deepFreeze(  
    duplicateGroups  
  ),  

uniquePointCount,  

duplicatePointCount:  
  points.length -  
  uniquePointCount,  

searchStrategy:  
  'SPATIAL_HASH_NEIGHBORHOOD',  

globalPairwiseSearch:  
  false,  

issues:  
  deepFreeze([])

});
}

/* ==========================================================================

12 · DIFFERENTIAL ANALYSIS

========================================================================== */


function resolveDerivativeStep(
parameterValue,
domain,
toleranceContext
) {
const scale =
Math.max(
Math.abs(parameterValue),
Math.abs(domain.minimum),
Math.abs(domain.maximum),
1
);

const candidate =
toleranceContext
.derivativeRelativeStep *
scale;

const step =
Math.max(
candidate,
toleranceContext
.parameterTolerance
);

return isHEarthPositiveFiniteNumber(
step
)
? step
: Number.NaN;
}

function resolveDerivativeBracket({
parameterValue,
domain,
step
}) {
if (
!isHEarthFiniteNumber(
parameterValue
) ||
!isHEarthParameterDomain(
domain
) ||
!isHEarthPositiveFiniteNumber(
step
)
) {
return null;
}

const periodic =
domain.topology ===
H_EARTH_3D_GEOMETRY_EAST_ENUMS
.domainTopology.PERIODIC;

if (periodic) {
const lowerUnwrapped =
parameterValue -
step;

const upperUnwrapped =  
  parameterValue +  
  step;  

const lowerWrapped =  
  wrapHEarthPeriodicParameter(  
    lowerUnwrapped,  
    domain  
  );  

const upperWrapped =  
  wrapHEarthPeriodicParameter(  
    upperUnwrapped,  
    domain  
  );  

const denominator =  
  upperUnwrapped -  
  lowerUnwrapped;  

if (  
  !isHEarthFiniteNumber(  
    lowerWrapped  
  ) ||  
  !isHEarthFiniteNumber(  
    upperWrapped  
  ) ||  
  !isHEarthPositiveFiniteNumber(  
    denominator  
  )  
) {  
  return null;  
}  

return deepFreeze({  
  periodic:  
    true,  

  method:  
    'CENTRAL_PERIODIC_UNWRAPPED_DELTA',  

  lowerEvaluationParameter:  
    lowerWrapped,  

  upperEvaluationParameter:  
    upperWrapped,  

  lowerUnwrappedParameter:  
    lowerUnwrapped,  

  upperUnwrappedParameter:  
    upperUnwrapped,  

  denominator  
});

}

if (
parameterValue -
step >=
domain.minimum &&
parameterValue +
step <=
domain.maximum
) {
return deepFreeze({
periodic:
false,

method:  
    'CENTRAL',  

  lowerEvaluationParameter:  
    parameterValue -  
    step,  

  upperEvaluationParameter:  
    parameterValue +  
    step,  

  lowerUnwrappedParameter:  
    parameterValue -  
    step,  

  upperUnwrappedParameter:  
    parameterValue +  
    step,  

  denominator:  
    2 * step  
});

}

if (
parameterValue +
step <=
domain.maximum
) {
return deepFreeze({
periodic:
false,

method:  
    'FORWARD',  

  lowerEvaluationParameter:  
    parameterValue,  

  upperEvaluationParameter:  
    parameterValue +  
    step,  

  lowerUnwrappedParameter:  
    parameterValue,  

  upperUnwrappedParameter:  
    parameterValue +  
    step,  

  denominator:  
    step  
});

}

if (
parameterValue -
step >=
domain.minimum
) {
return deepFreeze({
periodic:
false,

method:  
    'BACKWARD',  

  lowerEvaluationParameter:  
    parameterValue -  
    step,  

  upperEvaluationParameter:  
    parameterValue,  

  lowerUnwrappedParameter:  
    parameterValue -  
    step,  

  upperUnwrappedParameter:  
    parameterValue,  

  denominator:  
    step  
});

}

return null;
}

export function estimateHEarthCurveDerivative(
descriptor,
t,
toleranceContext
) {
const resolvedToleranceContext =
resolveToleranceContext(
toleranceContext
);

if (
descriptor?.descriptorType !==
H_EARTH_3D_GEOMETRY_EAST_ENUMS
.descriptorType
.PARAMETRIC_CURVE ||
!isHEarthFiniteNumber(t) ||
!isHEarthGeometryToleranceContext(
resolvedToleranceContext
)
) {
return deepFreeze({
valid:
false,

derivative:  
    null,  

  method:  
    null,  

  denominator:  
    null,  

  issues:  
    deepFreeze([  
      createEastIssue(  
        'CURVE_DERIVATIVE_INPUT_INVALID',  
        'ERROR',  
        'Curve derivative estimation requires a curve descriptor, finite parameter, and valid tolerance context.'  
      )  
    ])  
});

}

const validation =
validateHEarthEquationDescriptor(
descriptor
);

if (!validation.valid) {
return deepFreeze({
valid:
false,

derivative:  
    null,  

  method:  
    null,  

  denominator:  
    null,  

  issues:  
    validation.issues  
});

}

const step =
resolveDerivativeStep(
t,
descriptor.domain,
resolvedToleranceContext
);

const bracket =
resolveDerivativeBracket({
parameterValue:
t,

domain:  
    descriptor.domain,  

  step  
});

if (!bracket) {
return deepFreeze({
valid:
false,

derivative:  
    null,  

  method:  
    null,  

  denominator:  
    null,  

  issues:  
    deepFreeze([  
      createEastIssue(  
        'CURVE_DERIVATIVE_DOMAIN_TOO_SMALL',  
        'ERROR',  
        'Curve domain cannot support derivative estimation.',  
        {  
          t,  
          step,  

          minimum:  
            descriptor.domain.minimum,  

          maximum:  
            descriptor.domain.maximum  
        },  
        true,  
        {  
          descriptorId:  
            descriptor.descriptorId  
        }  
      )  
    ])  
});

}

const lowerEvaluation =
evaluateHEarthEquationDescriptor(
descriptor,
{
t:
bracket
.lowerEvaluationParameter
},
resolvedToleranceContext
);

const upperEvaluation =
evaluateHEarthEquationDescriptor(
descriptor,
{
t:
bracket
.upperEvaluationParameter
},
resolvedToleranceContext
);

if (
lowerEvaluation.evaluatorStatus !==
H_EARTH_3D_GEOMETRY_EAST_ENUMS
.evaluatorStatus.EVALUATED ||
upperEvaluation.evaluatorStatus !==
H_EARTH_3D_GEOMETRY_EAST_ENUMS
.evaluatorStatus.EVALUATED
) {
return deepFreeze({
valid:
false,

derivative:  
    null,  

  method:  
    bracket.method,  

  denominator:  
    bracket.denominator,  

  issues:  
    sortHEarthGeometryIssues([  
      ...lowerEvaluation.issues,  
      ...upperEvaluation.issues  
    ])  
});

}

if (
!isHEarthPositiveFiniteNumber(
bracket.denominator
) ||
bracket.denominator <=
resolvedToleranceContext
.parameterTolerance
) {
return deepFreeze({
valid:
false,

derivative:  
    null,  

  method:  
    bracket.method,  

  denominator:  
    bracket.denominator,  

  issues:  
    deepFreeze([  
      createEastIssue(  
        'CURVE_DERIVATIVE_DENOMINATOR_INVALID',  
        'ERROR',  
        'Curve derivative denominator is invalid.',  
        {  
          denominator:  
            bracket.denominator,  

          method:  
            bracket.method  
        }  
      )  
    ])  
});

}

const difference =
subtractHEarthVector3(
upperEvaluation.value,
lowerEvaluation.value
);

const derivative =
difference
? scaleHEarthVector3(
difference,
1 /
bracket.denominator
)
: null;

if (
!isHEarthVector3(
derivative
)
) {
return deepFreeze({
valid:
false,

derivative:  
    null,  

  method:  
    bracket.method,  

  denominator:  
    bracket.denominator,  

  issues:  
    deepFreeze([  
      createEastIssue(  
        'CURVE_DERIVATIVE_NONFINITE',  
        'ERROR',  
        'Curve derivative estimation produced a nonfinite vector.'  
      )  
    ])  
});

}

return deepFreeze({
valid:
true,

derivative,  

method:  
  bracket.method,  

step,  

denominator:  
  bracket.denominator,  

lowerEvaluationParameter:  
  bracket  
    .lowerEvaluationParameter,  

upperEvaluationParameter:  
  bracket  
    .upperEvaluationParameter,  

lowerUnwrappedParameter:  
  bracket  
    .lowerUnwrappedParameter,  

upperUnwrappedParameter:  
  bracket  
    .upperUnwrappedParameter,  

issues:  
  deepFreeze([])

});
}

export function evaluateHEarthCurveTangent(
descriptor,
t,
toleranceContext
) {
const resolvedToleranceContext =
resolveToleranceContext(
toleranceContext
);

if (
!isHEarthGeometryToleranceContext(
resolvedToleranceContext
)
) {
return deepFreeze({
valid:
false,

tangent:  
    null,  

  derivative:  
    null,  

  issues:  
    deepFreeze([  
      createEastIssue(  
        'CURVE_TANGENT_TOLERANCE_CONTEXT_INVALID',  
        'ERROR',  
        'Curve tangent evaluation requires a valid tolerance context.'  
      )  
    ])  
});

}

const derivativeResult =
estimateHEarthCurveDerivative(
descriptor,
t,
resolvedToleranceContext
);

if (!derivativeResult.valid) {
return deepFreeze({
valid:
false,

tangent:  
    null,  

  derivative:  
    null,  

  issues:  
    derivativeResult.issues  
});

}

const normalized =
normalizeHEarthVector3(
derivativeResult.derivative,
resolvedToleranceContext
.lengthTolerance
);

return deepFreeze({
valid:
normalized.valid,

tangent:  
  normalized.valid  
    ? normalized.vector  
    : null,  

derivative:  
  derivativeResult.derivative,  

derivativeMethod:  
  derivativeResult.method,  

issues:  
  normalized.issues

});
}

export function evaluateHEarthXZCurveNormal(
tangent,
toleranceContext
) {
const resolvedToleranceContext =
resolveToleranceContext(
toleranceContext
);

if (
!isHEarthVector3(tangent) ||
!isHEarthGeometryToleranceContext(
resolvedToleranceContext
)
) {
return deepFreeze({
valid:
false,

normal:  
    null,  

  issues:  
    deepFreeze([  
      createEastIssue(  
        'XZ_CURVE_NORMAL_INPUT_INVALID',  
        'ERROR',  
        'XZ curve-normal analysis requires a finite tangent and valid tolerance context.'  
      )  
    ])  
});

}

const projected =
createHEarthVector3(
tangent.x,
0,
tangent.z
);

const normalizedTangent =
normalizeHEarthVector3(
projected,
resolvedToleranceContext
.lengthTolerance
);

if (!normalizedTangent.valid) {
return deepFreeze({
valid:
false,

normal:  
    null,  

  issues:  
    normalizedTangent.issues  
});

}

const normal =
createHEarthVector3(
-normalizedTangent.vector.z,
0,
normalizedTangent.vector.x
);

return deepFreeze({
valid:
isHEarthVector3(normal),

tangent:  
  normalizedTangent.vector,  

normal,  

orientationLaw:  
  'LEFT_NORMAL_EQUALS_NEGATIVE_TZ_ZERO_TX',  

issues:  
  deepFreeze([])

});
}

/* ==========================================================================

13 · PARAMETRIC-SURFACE DIFFERENTIAL ANALYSIS

========================================================================== */


function estimateSurfacePartialDerivative(
descriptor,
u,
v,
axis,
toleranceContext
) {
const domain =
axis === 'u'
? descriptor.uDomain
: descriptor.vDomain;

const parameterValue =
axis === 'u'
? u
: v;

const step =
resolveDerivativeStep(
parameterValue,
domain,
toleranceContext
);

const bracket =
resolveDerivativeBracket({
parameterValue,
domain,
step
});

if (!bracket) {
return {
valid:
false,

derivative:  
    null,  

  method:  
    null,  

  denominator:  
    null,  

  issues: [  
    createEastIssue(  
      'SURFACE_DERIVATIVE_DOMAIN_TOO_SMALL',  
      'ERROR',  
      'Surface domain cannot support derivative estimation.',  
      {  
        axis,  
        parameterValue,  
        step  
      },  
      true,  
      {  
        descriptorId:  
          descriptor.descriptorId  
      }  
    )  
  ]  
};

}

const lowerParameters = {
u:
axis === 'u'
? bracket
.lowerEvaluationParameter
: u,

v:  
  axis === 'v'  
    ? bracket  
        .lowerEvaluationParameter  
    : v

};

const upperParameters = {
u:
axis === 'u'
? bracket
.upperEvaluationParameter
: u,

v:  
  axis === 'v'  
    ? bracket  
        .upperEvaluationParameter  
    : v

};

const lowerEvaluation =
evaluateHEarthEquationDescriptor(
descriptor,
lowerParameters,
toleranceContext
);

const upperEvaluation =
evaluateHEarthEquationDescriptor(
descriptor,
upperParameters,
toleranceContext
);

if (
lowerEvaluation.evaluatorStatus !==
H_EARTH_3D_GEOMETRY_EAST_ENUMS
.evaluatorStatus.EVALUATED ||
upperEvaluation.evaluatorStatus !==
H_EARTH_3D_GEOMETRY_EAST_ENUMS
.evaluatorStatus.EVALUATED
) {
return {
valid:
false,

derivative:  
    null,  

  method:  
    bracket.method,  

  denominator:  
    bracket.denominator,  

  issues: [  
    ...lowerEvaluation.issues,  
    ...upperEvaluation.issues  
  ]  
};

}

if (
!isHEarthPositiveFiniteNumber(
bracket.denominator
) ||
bracket.denominator <=
toleranceContext
.parameterTolerance
) {
return {
valid:
false,

derivative:  
    null,  

  method:  
    bracket.method,  

  denominator:  
    bracket.denominator,  

  issues: [  
    createEastIssue(  
      'SURFACE_DERIVATIVE_DENOMINATOR_INVALID',  
      'ERROR',  
      'Surface derivative denominator is invalid.',  
      {  
        axis,  
        denominator:  
          bracket.denominator,  
        method:  
          bracket.method  
      },  
      true,  
      {  
        descriptorId:  
          descriptor.descriptorId  
      }  
    )  
  ]  
};

}

const difference =
subtractHEarthVector3(
upperEvaluation.value,
lowerEvaluation.value
);

const derivative =
difference
? scaleHEarthVector3(
difference,
1 /
bracket.denominator
)
: null;

return {
valid:
isHEarthVector3(derivative),

derivative,  

method:  
  bracket.method,  

step,  

denominator:  
  bracket.denominator,  

lowerEvaluationParameter:  
  bracket  
    .lowerEvaluationParameter,  

upperEvaluationParameter:  
  bracket  
    .upperEvaluationParameter,  

lowerUnwrappedParameter:  
  bracket  
    .lowerUnwrappedParameter,  

upperUnwrappedParameter:  
  bracket  
    .upperUnwrappedParameter,  

issues:  
  isHEarthVector3(derivative)  
    ? []  
    : [  
        createEastIssue(  
          'SURFACE_DERIVATIVE_NONFINITE',  
          'ERROR',  
          'Surface derivative estimation produced a nonfinite vector.',  
          {  
            axis  
          },  
          true,  
          {  
            descriptorId:  
              descriptor.descriptorId  
          }  
        )  
      ]

};
}

export function evaluateHEarthParametricSurfaceDifferential(
descriptor,
u,
v,
toleranceContext
) {
const resolvedToleranceContext =
resolveToleranceContext(
toleranceContext
);

if (
(
descriptor?.descriptorType !==
H_EARTH_3D_GEOMETRY_EAST_ENUMS
.descriptorType
.PARAMETRIC_SURFACE &&
descriptor?.descriptorType !==
H_EARTH_3D_GEOMETRY_EAST_ENUMS
.descriptorType
.RADIAL_SURFACE
) ||
!isHEarthFiniteNumber(u) ||
!isHEarthFiniteNumber(v) ||
!isHEarthGeometryToleranceContext(
resolvedToleranceContext
)
) {
return deepFreeze({
valid:
false,

derivativeU:  
    null,  

  derivativeV:  
    null,  

  rawNormal:  
    null,  

  normal:  
    null,  

  issues:  
    deepFreeze([  
      createEastIssue(  
        'SURFACE_DIFFERENTIAL_INPUT_INVALID',  
        'ERROR',  
        'Surface differential analysis requires a surface descriptor, finite parameters, and valid tolerance context.'  
      )  
    ])  
});

}

const validation =
validateHEarthEquationDescriptor(
descriptor
);

if (!validation.valid) {
return deepFreeze({
valid:
false,

derivativeU:  
    null,  

  derivativeV:  
    null,  

  rawNormal:  
    null,  

  normal:  
    null,  

  issues:  
    validation.issues  
});

}

const derivativeU =
estimateSurfacePartialDerivative(
descriptor,
u,
v,
'u',
resolvedToleranceContext
);

const derivativeV =
estimateSurfacePartialDerivative(
descriptor,
u,
v,
'v',
resolvedToleranceContext
);

if (
!derivativeU.valid ||
!derivativeV.valid
) {
return deepFreeze({
valid:
false,

derivativeU:  
    derivativeU.derivative,  

  derivativeV:  
    derivativeV.derivative,  

  rawNormal:  
    null,  

  normal:  
    null,  

  issues:  
    sortHEarthGeometryIssues([  
      ...derivativeU.issues,  
      ...derivativeV.issues  
    ])  
});

}

const rawNormal =
crossHEarthVector3(
derivativeV.derivative,
derivativeU.derivative
);

const normalized =
normalizeHEarthVector3(
rawNormal,
resolvedToleranceContext
.normalLengthTolerance
);

return deepFreeze({
valid:
normalized.valid,

derivativeU:  
  derivativeU.derivative,  

derivativeV:  
  derivativeV.derivative,  

derivativeUMethod:  
  derivativeU.method,  

derivativeVMethod:  
  derivativeV.method,  

derivativeUDenominator:  
  derivativeU.denominator,  

derivativeVDenominator:  
  derivativeV.denominator,  

rawNormal,  

normal:  
  normalized.valid  
    ? normalized.vector  
    : null,  

orientationLaw:  
  'S_V_CROSS_S_U',  

issues:  
  normalized.issues

});
}

/* ==========================================================================

14 · TRIANGLE AND NORMAL ANALYSIS

========================================================================== */


export function evaluateHEarthTriangleNormal(
a,
b,
c,
toleranceContext
) {
const resolvedToleranceContext =
resolveToleranceContext(
toleranceContext
);

if (
!isHEarthVector3(a) ||
!isHEarthVector3(b) ||
!isHEarthVector3(c) ||
!isHEarthGeometryToleranceContext(
resolvedToleranceContext
)
) {
return deepFreeze({
valid:
false,

rawCross:  
    null,  

  doubleArea:  
    null,  

  triangleArea:  
    null,  

  normal:  
    null,  

  issues:  
    deepFreeze([  
      createEastIssue(  
        'TRIANGLE_NORMAL_INPUT_INVALID',  
        'ERROR',  
        'Triangle-normal analysis requires three finite points and a valid tolerance context.'  
      )  
    ])  
});

}

const edge1 =
subtractHEarthVector3(
b,
a
);

const edge2 =
subtractHEarthVector3(
c,
a
);

const rawCross =
crossHEarthVector3(
edge1,
edge2
);

const doubleArea =
rawCross
? getHEarthVector3Length(
rawCross
)
: Number.NaN;

const triangleArea =
isHEarthFiniteNumber(
doubleArea
)
? 0.5 *
doubleArea
: Number.NaN;

const rawCrossValid =
isHEarthFiniteNumber(
doubleArea
) &&
doubleArea >
2 *
resolvedToleranceContext
.areaTolerance;

const triangleValid =
isHEarthFiniteNumber(
triangleArea
) &&
triangleArea >
resolvedToleranceContext
.areaTolerance;

const normalized =
rawCrossValid
? normalizeHEarthVector3(
rawCross,
resolvedToleranceContext
.normalLengthTolerance
)
: {
valid:
false,

vector:  
        null,  

      issues:  
        []  
    };

const issues = [];

if (!triangleValid) {
issues.push(
createEastIssue(
'TRIANGLE_DEGENERATE',
'ERROR',
'Triangle area is at or below the admitted area tolerance.',
{
doubleArea,
triangleArea,

areaTolerance:  
        resolvedToleranceContext  
          .areaTolerance  
    }  
  )  
);

}

if (
triangleValid &&
!normalized.valid
) {
issues.push(
createEastIssue(
'TRIANGLE_NORMAL_INVALID',
'ERROR',
'Triangle normal could not be normalized.'
)
);
}

return deepFreeze({
valid:
triangleValid &&
normalized.valid,

edge1,  

edge2,  

rawCross,  

doubleArea,  

triangleArea,  

rawCrossValid,  

triangleValid,  

normalValid:  
  normalized.valid,  

normal:  
  normalized.valid  
    ? normalized.vector  
    : null,  

issues:  
  sortHEarthGeometryIssues(  
    issues  
  )

});
}

export function calculateHEarthFaceNormals(
vertices,
triangleIndices,
toleranceContext
) {
const resolvedToleranceContext =
resolveToleranceContext(
toleranceContext
);

if (
!Array.isArray(vertices) ||
!vertices.every(
isHEarthVector3
) ||
!Array.isArray(
triangleIndices
) ||
triangleIndices.length %
3 !==
0 ||
!isHEarthGeometryToleranceContext(
resolvedToleranceContext
)
) {
return deepFreeze({
valid:
false,

faceNormals:  
    deepFreeze([]),  

  triangleEvaluations:  
    deepFreeze([]),  

  issues:  
    deepFreeze([  
      createEastIssue(  
        'FACE_NORMAL_INPUT_INVALID',  
        'ERROR',  
        'Face-normal calculation requires finite vertices, triangle indices, and valid tolerance context.'  
      )  
    ])  
});

}

const faceNormals = [];

const triangleEvaluations = [];

const issues = [];

for (
let offset = 0;
offset <
triangleIndices.length;
offset += 3
) {
const triangleIndex =
offset / 3;

const aIndex =  
  triangleIndices[offset];  

const bIndex =  
  triangleIndices[  
    offset + 1  
  ];  

const cIndex =  
  triangleIndices[  
    offset + 2  
  ];  

if (  
  !isHEarthNonNegativeSafeInteger(  
    aIndex  
  ) ||  
  !isHEarthNonNegativeSafeInteger(  
    bIndex  
  ) ||  
  !isHEarthNonNegativeSafeInteger(  
    cIndex  
  ) ||  
  aIndex >=  
    vertices.length ||  
  bIndex >=  
    vertices.length ||  
  cIndex >=  
    vertices.length  
) {  
  issues.push(  
    createEastIssue(  
      'TRIANGLE_INDEX_INVALID',  
      'ERROR',  
      'Triangle references an invalid vertex index.',  
      {  
        triangleIndex,  
        aIndex,  
        bIndex,  
        cIndex  
      }  
    )  
  );  

  faceNormals.push(null);  

  triangleEvaluations.push(  
    deepFreeze({  
      triangleIndex,  
      valid:  
        false  
    })  
  );  

  continue;  
}  

const evaluation =  
  evaluateHEarthTriangleNormal(  
    vertices[aIndex],  
    vertices[bIndex],  
    vertices[cIndex],  
    resolvedToleranceContext  
  );  

faceNormals.push(  
  evaluation.valid  
    ? evaluation.normal  
    : null  
);  

triangleEvaluations.push(  
  deepFreeze({  
    triangleIndex,  
    aIndex,  
    bIndex,  
    cIndex,  
    ...evaluation  
  })  
);  

issues.push(  
  ...evaluation.issues  
);

}

return deepFreeze({
valid:
!hasHEarthBlockingIssues(
issues
),

faceNormals:  
  deepFreeze(  
    faceNormals  
  ),  

triangleEvaluations:  
  deepFreeze(  
    triangleEvaluations  
  ),  

issues:  
  sortHEarthGeometryIssues(  
    issues  
  )

});
}

export function calculateHEarthVertexNormals(
vertices,
triangleIndices,
toleranceContext
) {
const resolvedToleranceContext =
resolveToleranceContext(
toleranceContext
);

if (
!Array.isArray(vertices) ||
!vertices.every(
isHEarthVector3
) ||
!Array.isArray(
triangleIndices
) ||
!isHEarthGeometryToleranceContext(
resolvedToleranceContext
)
) {
return deepFreeze({
valid:
false,

vertexNormals:  
    deepFreeze([]),  

  issues:  
    deepFreeze([  
      createEastIssue(  
        'VERTEX_NORMAL_INPUT_INVALID',  
        'ERROR',  
        'Vertex-normal calculation requires finite vertices, triangle indices, and valid tolerance context.'  
      )  
    ])  
});

}

const faceResult =
calculateHEarthFaceNormals(
vertices,
triangleIndices,
resolvedToleranceContext
);

const accumulators =
vertices.map(
() =>
createHEarthVector3(
0,
0,
0
)
);

const referenced =
vertices.map(
() =>
false
);

const issues = [
...faceResult.issues
];

for (
const evaluation of
faceResult.triangleEvaluations
) {
if (
evaluation.valid !==
true ||
!isHEarthVector3(
evaluation.rawCross
)
) {
continue;
}

for (  
  const vertexIndex of  
  [  
    evaluation.aIndex,  
    evaluation.bIndex,  
    evaluation.cIndex  
  ]  
) {  
  accumulators[vertexIndex] =  
    addHEarthVector3(  
      accumulators[vertexIndex],  
      evaluation.rawCross  
    );  

  referenced[vertexIndex] =  
    true;  
}

}

const vertexNormals =
accumulators.map(
(
accumulator,
vertexIndex
) => {
if (
!referenced[
vertexIndex
]
) {
issues.push(
createEastIssue(
'VERTEX_NORMAL_ISOLATED_VERTEX',
'ERROR',
'An isolated vertex cannot receive an area-weighted normal.',
{
vertexIndex
}
)
);

return null;  
    }  

    const normalized =  
      normalizeHEarthVector3(  
        accumulator,  
        resolvedToleranceContext  
          .normalLengthTolerance  
      );  

    if (!normalized.valid) {  
      issues.push(  
        createEastIssue(  
          'VERTEX_NORMAL_INVALID',  
          'ERROR',  
          'Accumulated vertex normal could not be normalized.',  
          {  
            vertexIndex  
          }  
        )  
      );  

      return null;  
    }  

    return normalized.vector;  
  }  
);

return deepFreeze({
valid:
!hasHEarthBlockingIssues(
issues
),

vertexNormals:  
  deepFreeze(  
    vertexNormals  
  ),  

accumulationLaw:  
  'RAW_TRIANGLE_CROSS_ACCUMULATED_ONCE_PER_INCIDENT_TRIANGLE',  

issues:  
  sortHEarthGeometryIssues(  
    issues  
  )

});
}

/* ==========================================================================

15 · XZ NEAREST-POINT AND SIGNED-DISTANCE ANALYSIS

========================================================================== */


function createXZVector2(
vector3
) {
return createHEarthVector2(
vector3.x,
vector3.z
);
}

function subtractVector2(
left,
right
) {
return createHEarthVector2(
left.x -
right.x,

left.y -  
  right.y

);
}

function addVector2(
left,
right
) {
return createHEarthVector2(
left.x +
right.x,

left.y +  
  right.y

);
}

function scaleVector2(
vector,
scalar
) {
return createHEarthVector2(
vector.x *
scalar,

vector.y *  
  scalar

);
}

function dotVector2(
left,
right
) {
return (
left.x *
right.x +
left.y *
right.y
);
}

function distanceVector2(
left,
right
) {
return Math.hypot(
left.x -
right.x,

left.y -  
  right.y

);
}

export function evaluateHEarthXZNearestPointOnPolyline(
point,
polyline,
toleranceContext
) {
const resolvedToleranceContext =
resolveToleranceContext(
toleranceContext
);

if (
!isHEarthVector3(point) ||
!Array.isArray(polyline) ||
polyline.length < 2 ||
!polyline.every(
isHEarthVector3
) ||
!isHEarthGeometryToleranceContext(
resolvedToleranceContext
)
) {
return deepFreeze({
valid:
false,

nearestPoint:  
    null,  

  distance:  
    null,  

  segmentIndex:  
    null,  

  segmentParameter:  
    null,  

  issues:  
    deepFreeze([  
      createEastIssue(  
        'XZ_NEAREST_POINT_INPUT_INVALID',  
        'ERROR',  
        'XZ nearest-point analysis requires a point, a two-point polyline, and a valid tolerance context.'  
      )  
    ])  
});

}

const query =
createXZVector2(
point
);

let best = null;

const issues = [];

for (
let segmentIndex = 0;
segmentIndex <
polyline.length -
1;
segmentIndex += 1
) {
const start =
createXZVector2(
polyline[
segmentIndex
]
);

const end =  
  createXZVector2(  
    polyline[  
      segmentIndex +  
      1  
    ]  
  );  

const direction =  
  subtractVector2(  
    end,  
    start  
  );  

const lengthSquared =  
  dotVector2(  
    direction,  
    direction  
  );  

const minimumLengthSquared =  
  resolvedToleranceContext  
    .lengthTolerance **  
  2;  

if (  
  !isHEarthFiniteNumber(  
    lengthSquared  
  ) ||  
  !isHEarthFiniteNumber(  
    minimumLengthSquared  
  ) ||  
  lengthSquared <=  
    minimumLengthSquared  
) {  
  issues.push(  
    createEastIssue(  
      'XZ_POLYLINE_SEGMENT_DEGENERATE',  
      'WARNING',  
      'XZ polyline segment is at or below the admitted length tolerance.',  
      {  
        segmentIndex  
      },  
      false  
    )  
  );  

  continue;  
}  

const queryOffset =  
  subtractVector2(  
    query,  
    start  
  );  

const parameter =  
  clampHEarthNumber(  
    dotVector2(  
      queryOffset,  
      direction  
    ) /  
      lengthSquared,  
    0,  
    1  
  );  

const nearest2 =  
  addVector2(  
    start,  
    scaleVector2(  
      direction,  
      parameter  
    )  
  );  

const distance =  
  distanceVector2(  
    query,  
    nearest2  
  );  

if (  
  !isHEarthFiniteNumber(  
    distance  
  )  
) {  
  continue;  
}  

if (  
  !best ||  
  distance <  
    best.distance  
) {  
  best = {  
    segmentIndex,  

    segmentParameter:  
      parameter,  

    nearestPoint:  
      createHEarthVector3(  
        nearest2.x,  
        point.y,  
        nearest2.y  
      ),  

    distance  
  };  
}

}

if (!best) {
return deepFreeze({
valid:
false,

nearestPoint:  
    null,  

  distance:  
    null,  

  segmentIndex:  
    null,  

  segmentParameter:  
    null,  

  issues:  
    sortHEarthGeometryIssues([  
      ...issues,  

      createEastIssue(  
        'XZ_NEAREST_POINT_NO_VALID_SEGMENT',  
        'ERROR',  
        'No valid XZ polyline segment was available.'  
      )  
    ])  
});

}

return deepFreeze({
valid:
true,

...best,  

projectionRule:  
  'DISCARD_INPUT_Y_FOR_DISTANCE_EVALUATION',  

issues:  
  sortHEarthGeometryIssues(  
    issues  
  )

});
}

export function evaluateHEarthXZSignedDistanceToPolyline(
point,
polyline,
toleranceContext
) {
const nearest =
evaluateHEarthXZNearestPointOnPolyline(
point,
polyline,
toleranceContext
);

if (!nearest.valid) {
return deepFreeze({
valid:
false,

signedDistance:  
    null,  

  nearestPoint:  
    null,  

  segmentIndex:  
    null,  

  issues:  
    nearest.issues  
});

}

const start =
polyline[
nearest.segmentIndex
];

const end =
polyline[
nearest.segmentIndex +
1
];

const tangent =
createHEarthVector3(
end.x -
start.x,
0,
end.z -
start.z
);

const normalResult =
evaluateHEarthXZCurveNormal(
tangent,
toleranceContext
);

if (!normalResult.valid) {
return deepFreeze({
valid:
false,

signedDistance:  
    null,  

  nearestPoint:  
    nearest.nearestPoint,  

  segmentIndex:  
    nearest.segmentIndex,  

  issues:  
    sortHEarthGeometryIssues([  
      ...nearest.issues,  
      ...normalResult.issues  
    ])  
});

}

const displacement =
createHEarthVector3(
point.x -
nearest.nearestPoint.x,
0,
point.z -
nearest.nearestPoint.z
);

const signProjection =
dotHEarthVector3(
displacement,
normalResult.normal
);

const sign =
signProjection < 0
? -1
: 1;

return deepFreeze({
valid:
true,

signedDistance:  
  nearest.distance *  
  sign,  

unsignedDistance:  
  nearest.distance,  

nearestPoint:  
  nearest.nearestPoint,  

segmentIndex:  
  nearest.segmentIndex,  

segmentParameter:  
  nearest.segmentParameter,  

leftNormal:  
  normalResult.normal,  

projectionPlane:  
  'XZ',  

yContribution:  
  0,  

issues:  
  nearest.issues

});
}

/* ==========================================================================

16 · POLYGON PROJECTION AND BASIC ANALYSIS

========================================================================== */


export function projectHEarthPolygonToPlane(
points,
projectionPlane
) {
if (
!Array.isArray(points) ||
points.length < 3 ||
!points.every(
isHEarthVector3
) ||
!enumIncludes(
H_EARTH_3D_GEOMETRY_EAST_ENUMS
.polygonProjectionPlane,
projectionPlane
)
) {
return null;
}

const projected =
points.map(
(point) => {
switch (
projectionPlane
) {
case H_EARTH_3D_GEOMETRY_EAST_ENUMS
.polygonProjectionPlane.XY:
return createHEarthVector2(
point.x,
point.y
);

case H_EARTH_3D_GEOMETRY_EAST_ENUMS  
        .polygonProjectionPlane.XZ:  
        return createHEarthVector2(  
          point.x,  
          point.z  
        );  

      case H_EARTH_3D_GEOMETRY_EAST_ENUMS  
        .polygonProjectionPlane.YZ:  
        return createHEarthVector2(  
          point.y,  
          point.z  
        );  

      default:  
        return null;  
    }  
  }  
);

return projected.every(
isHEarthVector2
)
? deepFreeze(
projected
)
: null;
}

export function calculateHEarthSignedPolygonArea2D(
points2
) {
if (
!Array.isArray(points2) ||
points2.length < 3 ||
!points2.every(
isHEarthVector2
)
) {
return Number.NaN;
}

let doubleArea = 0;

for (
let index = 0;
index <
points2.length;
index += 1
) {
const current =
points2[index];

const next =  
  points2[  
    (  
      index + 1  
    ) %  
    points2.length  
  ];  

doubleArea +=  
  current.x *  
    next.y -  
  next.x *  
    current.y;

}

const signedArea =
0.5 *
doubleArea;

return isHEarthFiniteNumber(
signedArea
)
? signedArea
: Number.NaN;
}

export function calculateHEarthSignedPolygonAreaXZ(
points
) {
const projected =
projectHEarthPolygonToPlane(
points,
H_EARTH_3D_GEOMETRY_EAST_ENUMS
.polygonProjectionPlane.XZ
);

return projected
? calculateHEarthSignedPolygonArea2D(
projected
)
: Number.NaN;
}

export function calculateHEarthYOrientedPolygonArea(
points
) {
if (
!Array.isArray(points) ||
points.length < 3 ||
!points.every(
isHEarthVector3
)
) {
return Number.NaN;
}

let doubleArea = 0;

for (
let index = 0;
index <
points.length;
index += 1
) {
const current =
points[index];

const next =  
  points[  
    (  
      index + 1  
    ) %  
    points.length  
  ];  

doubleArea +=  
  current.z *  
    next.x -  
  next.z *  
    current.x;

}

const area =
0.5 *
doubleArea;

return isHEarthFiniteNumber(
area
)
? area
: Number.NaN;
}

export function evaluateHEarthPolygonPlanarity(
points,
toleranceContext
) {
const resolvedToleranceContext =
resolveToleranceContext(
toleranceContext
);

if (
!Array.isArray(points) ||
points.length < 3 ||
!points.every(
isHEarthVector3
) ||
!isHEarthGeometryToleranceContext(
resolvedToleranceContext
)
) {
return deepFreeze({
valid:
false,

planar:  
    false,  

  planeNormal:  
    null,  

  maximumDeviation:  
    null,  

  issues:  
    deepFreeze([  
      createEastIssue(  
        'POLYGON_PLANARITY_INPUT_INVALID',  
        'ERROR',  
        'Polygon planarity requires at least three finite points and a valid tolerance context.'  
      )  
    ])  
});

}

let planeNormal = null;

let anchor = null;

for (
let firstIndex = 0;
firstIndex <
points.length -
2 &&
!planeNormal;
firstIndex += 1
) {
for (
let secondIndex =
firstIndex + 1;
secondIndex <
points.length -
1 &&
!planeNormal;
secondIndex += 1
) {
for (
let thirdIndex =
secondIndex + 1;
thirdIndex <
points.length &&
!planeNormal;
thirdIndex += 1
) {
const triangle =
evaluateHEarthTriangleNormal(
points[
firstIndex
],
points[
secondIndex
],
points[
thirdIndex
],
resolvedToleranceContext
);

if (triangle.valid) {  
      planeNormal =  
        triangle.normal;  

      anchor =  
        points[  
          firstIndex  
        ];  
    }  
  }  
}

}

if (!planeNormal) {
return deepFreeze({
valid:
false,

planar:  
    false,  

  planeNormal:  
    null,  

  maximumDeviation:  
    null,  

  issues:  
    deepFreeze([  
      createEastIssue(  
        'POLYGON_PLANARITY_NO_VALID_PLANE',  
        'ERROR',  
        'Polygon points do not establish a nondegenerate plane.'  
      )  
    ])  
});

}

let maximumDeviation = 0;

for (
const point of
points
) {
const displacement =
subtractHEarthVector3(
point,
anchor
);

const deviation =  
  Math.abs(  
    dotHEarthVector3(  
      displacement,  
      planeNormal  
    )  
  );  

maximumDeviation =  
  Math.max(  
    maximumDeviation,  
    deviation  
  );

}

const planar =
maximumDeviation <=
resolvedToleranceContext
.positionTolerance;

return deepFreeze({
valid:
planar,

planar,  

planeAnchor:  
  anchor,  

planeNormal,  

maximumDeviation,  

issues:  
  planar  
    ? deepFreeze([])  
    : deepFreeze([  
        createEastIssue(  
          'POLYGON_NONPLANAR',  
          'ERROR',  
          'Polygon deviation exceeds the admitted position tolerance.',  
          {  
            maximumDeviation,  

            positionTolerance:  
              resolvedToleranceContext  
                .positionTolerance  
          }  
        )  
      ])

});
}

/* ==========================================================================

17 · POLYGON SELF-INTERSECTION AND CONVEXITY

========================================================================== */


function orientation2D(
a,
b,
c
) {
return (
(
b.x -
a.x
) *
(
c.y -
a.y
) -
(
b.y -
a.y
) *
(
c.x -
a.x
)
);
}

function pointOnSegment2D(
point,
start,
end,
positionTolerance,
areaTolerance
) {
const orientation =
orientation2D(
start,
end,
point
);

if (
Math.abs(
orientation
) >
areaTolerance
) {
return false;
}

return (
point.x >=
Math.min(
start.x,
end.x
) -
positionTolerance &&
point.x <=
Math.max(
start.x,
end.x
) +
positionTolerance &&
point.y >=
Math.min(
start.y,
end.y
) -
positionTolerance &&
point.y <=
Math.max(
start.y,
end.y
) +
positionTolerance
);
}

function segmentsIntersect2D(
a,
b,
c,
d,
positionTolerance,
areaTolerance
) {
const o1 =
orientation2D(
a,
b,
c
);

const o2 =
orientation2D(
a,
b,
d
);

const o3 =
orientation2D(
c,
d,
a
);

const o4 =
orientation2D(
c,
d,
b
);

const firstStraddles =
(
o1 >
areaTolerance &&
o2 <
-areaTolerance
) ||
(
o1 <
-areaTolerance &&
o2 >
areaTolerance
);

const secondStraddles =
(
o3 >
areaTolerance &&
o4 <
-areaTolerance
) ||
(
o3 <
-areaTolerance &&
o4 >
areaTolerance
);

if (
firstStraddles &&
secondStraddles
) {
return true;
}

return (
Math.abs(o1) <=
areaTolerance &&
pointOnSegment2D(
c,
a,
b,
positionTolerance,
areaTolerance
)
) || (
Math.abs(o2) <=
areaTolerance &&
pointOnSegment2D(
d,
a,
b,
positionTolerance,
areaTolerance
)
) || (
Math.abs(o3) <=
areaTolerance &&
pointOnSegment2D(
a,
c,
d,
positionTolerance,
areaTolerance
)
) || (
Math.abs(o4) <=
areaTolerance &&
pointOnSegment2D(
b,
c,
d,
positionTolerance,
areaTolerance
)
);
}

export function evaluateHEarthPolygonSelfIntersection(
points2,
toleranceContext
) {
const resolvedToleranceContext =
resolveToleranceContext(
toleranceContext
);

if (
!Array.isArray(points2) ||
points2.length < 3 ||
!points2.every(
isHEarthVector2
) ||
!isHEarthGeometryToleranceContext(
resolvedToleranceContext
)
) {
return deepFreeze({
valid:
false,

selfIntersecting:  
    null,  

  intersections:  
    deepFreeze([]),  

  issues:  
    deepFreeze([  
      createEastIssue(  
        'POLYGON_SELF_INTERSECTION_INPUT_INVALID',  
        'ERROR',  
        'Polygon self-intersection analysis requires projected points and a valid tolerance context.'  
      )  
    ])  
});

}

const intersections = [];

const edgeCount =
points2.length;

for (
let firstEdge = 0;
firstEdge <
edgeCount;
firstEdge += 1
) {
const firstStart =
points2[firstEdge];

const firstEnd =  
  points2[  
    (  
      firstEdge + 1  
    ) %  
    edgeCount  
  ];  

for (  
  let secondEdge =  
    firstEdge + 1;  
  secondEdge <  
    edgeCount;  
  secondEdge += 1  
) {  
  const adjacent =  
    secondEdge ===  
      firstEdge ||  
    secondEdge ===  
      (  
        firstEdge + 1  
      ) %  
      edgeCount ||  
    firstEdge ===  
      (  
        secondEdge + 1  
      ) %  
      edgeCount;  

  if (adjacent) {  
    continue;  
  }  

  const secondStart =  
    points2[  
      secondEdge  
    ];  

  const secondEnd =  
    points2[  
      (  
        secondEdge + 1  
      ) %  
      edgeCount  
    ];  

  if (  
    segmentsIntersect2D(  
      firstStart,  
      firstEnd,  
      secondStart,  
      secondEnd,  
      resolvedToleranceContext  
        .positionTolerance,  
      resolvedToleranceContext  
        .areaTolerance  
    )  
  ) {  
    intersections.push(  
      deepFreeze({  
        firstEdge,  
        secondEdge  
      })  
    );  
  }  
}

}

const selfIntersecting =
intersections.length >
0;

return deepFreeze({
valid:
true,

selfIntersecting,  

intersections:  
  deepFreeze(  
    intersections  
  ),  

comparisonDimensions:  
  deepFreeze({  
    coordinate:  
      'POSITION_TOLERANCE',  
    determinant:  
      'AREA_TOLERANCE'  
  }),  

issues:  
  selfIntersecting  
    ? deepFreeze([  
        createEastIssue(  
          'POLYGON_SELF_INTERSECTION_DETECTED',  
          'ERROR',  
          'Polygon contains one or more nonadjacent edge intersections.',  
          {  
            intersectionCount:  
              intersections.length  
          }  
        )  
      ])  
    : deepFreeze([])

});
}

export function evaluateHEarthPolygonConvexity(
points2,
toleranceContext
) {
const resolvedToleranceContext =
resolveToleranceContext(
toleranceContext
);

if (
!Array.isArray(points2) ||
points2.length < 3 ||
!points2.every(
isHEarthVector2
) ||
!isHEarthGeometryToleranceContext(
resolvedToleranceContext
)
) {
return deepFreeze({
valid:
false,

convex:  
    false,  

  orientationSign:  
    null,  

  issues:  
    deepFreeze([  
      createEastIssue(  
        'POLYGON_CONVEXITY_INPUT_INVALID',  
        'ERROR',  
        'Polygon convexity analysis requires projected points and a valid tolerance context.'  
      )  
    ])  
});

}

let orientationSign = 0;

for (
let index = 0;
index <
points2.length;
index += 1
) {
const a =
points2[index];

const b =  
  points2[  
    (  
      index + 1  
    ) %  
    points2.length  
  ];  

const c =  
  points2[  
    (  
      index + 2  
    ) %  
    points2.length  
  ];  

const orientation =  
  orientation2D(  
    a,  
    b,  
    c  
  );  

if (  
  Math.abs(  
    orientation  
  ) <=  
    resolvedToleranceContext  
      .areaTolerance  
) {  
  continue;  
}  

const currentSign =  
  Math.sign(  
    orientation  
  );  

if (  
  orientationSign ===  
  0  
) {  
  orientationSign =  
    currentSign;  
} else if (  
  currentSign !==  
  orientationSign  
) {  
  return deepFreeze({  
    valid:  
      true,  

    convex:  
      false,  

    orientationSign,  

    issues:  
      deepFreeze([  
        createEastIssue(  
          'POLYGON_CONCAVE',  
          'ERROR',  
          'Polygon changes signed turn direction and is not convex.'  
        )  
      ])  
  });  
}

}

const convex =
orientationSign !==
0;

return deepFreeze({
valid:
convex,

convex,  

orientationSign:  
  orientationSign ||  
  null,  

issues:  
  convex  
    ? deepFreeze([])  
    : deepFreeze([  
        createEastIssue(  
          'POLYGON_DEGENERATE_OR_COLLINEAR',  
          'ERROR',  
          'Polygon has no nondegenerate signed turn.'  
        )  
      ])

});
}

/* ==========================================================================

18 · CONVEX POLYGON TRIANGULATION ANALYSIS

========================================================================== */


export function triangulateHEarthConvexPolygon(
points,
projectionPlane =
H_EARTH_3D_GEOMETRY_EAST_ENUMS
.polygonProjectionPlane.XZ,
toleranceContext
) {
const resolvedToleranceContext =
resolveToleranceContext(
toleranceContext
);

const projected =
projectHEarthPolygonToPlane(
points,
projectionPlane
);

if (
!projected ||
!isHEarthGeometryToleranceContext(
resolvedToleranceContext
)
) {
return deepFreeze({
valid:
false,

outputClassification:  
    H_EARTH_3D_GEOMETRY_EAST_ENUMS  
      .triangulationOutputClassification  
      .ANALYSIS_LEVEL_TRIANGLE_INDEX_PLAN,  

  primitiveConstruction:  
    false,  

  admittedGeometry:  
    false,  

  triangleIndices:  
    deepFreeze([]),  

  issues:  
    deepFreeze([  
      createEastIssue(  
        'CONVEX_TRIANGULATION_INPUT_INVALID',  
        'ERROR',  
        'Convex triangulation analysis requires a valid polygon, projection plane, and tolerance context.'  
      )  
    ])  
});

}

const selfIntersection =
evaluateHEarthPolygonSelfIntersection(
projected,
resolvedToleranceContext
);

const convexity =
evaluateHEarthPolygonConvexity(
projected,
resolvedToleranceContext
);

const signedArea =
calculateHEarthSignedPolygonArea2D(
projected
);

const issues = [
...selfIntersection.issues,
...convexity.issues
];

if (
selfIntersection
.selfIntersecting ||
!convexity.convex ||
!isHEarthFiniteNumber(
signedArea
) ||
Math.abs(
signedArea
) <=
resolvedToleranceContext
.areaTolerance
) {
if (
!isHEarthFiniteNumber(
signedArea
) ||
Math.abs(
signedArea
) <=
resolvedToleranceContext
.areaTolerance
) {
issues.push(
createEastIssue(
'CONVEX_TRIANGULATION_AREA_INVALID',
'ERROR',
'Polygon area is nonfinite or degenerate.'
)
);
}

return deepFreeze({  
  valid:  
    false,  

  outputClassification:  
    H_EARTH_3D_GEOMETRY_EAST_ENUMS  
      .triangulationOutputClassification  
      .ANALYSIS_LEVEL_TRIANGLE_INDEX_PLAN,  

  primitiveConstruction:  
    false,  

  admittedGeometry:  
    false,  

  triangleIndices:  
    deepFreeze([]),  

  signedArea,  

  issues:  
    sortHEarthGeometryIssues(  
      issues  
    )  
});

}

const reverse =
signedArea < 0;

const triangleIndices = [];

for (
let index = 1;
index <
points.length -
1;
index += 1
) {
if (reverse) {
triangleIndices.push(
0,
index + 1,
index
);
} else {
triangleIndices.push(
0,
index,
index + 1
);
}
}

return deepFreeze({
valid:
true,

outputClassification:  
  H_EARTH_3D_GEOMETRY_EAST_ENUMS  
    .triangulationOutputClassification  
    .ANALYSIS_LEVEL_TRIANGLE_INDEX_PLAN,  

primitiveConstruction:  
  false,  

primitiveRecordCreated:  
  false,  

providerOutputCreated:  
  false,  

admittedGeometry:  
  false,  

triangleIndices:  
  deepFreeze(  
    triangleIndices  
  ),  

signedArea,  

sourceVertexCount:  
  points.length,  

triangleCount:  
  points.length -  
  2,  

issues:  
  sortHEarthGeometryIssues(  
    issues  
  )

});
}

/* ==========================================================================

19 · INDEXED-TOPOLOGY EXTRACTION

========================================================================== */


function createUndirectedEdgeKey(
first,
second
) {
return first < second
? `${first}:${second}`
: `${second}:${first}`;
}

function createDirectedEdgeKey(
first,
second
) {
return `${first}:${second}`;
}

function parseUndirectedEdgeKey(
key
) {
const [
first,
second
] =
key
.split(':')
.map(Number);

return {
first,
second
};
}

export function extractHEarthIndexedTopology(
vertices,
triangleIndices
) {
const issues = [];

if (
!Array.isArray(vertices) ||
!vertices.every(
isHEarthVector3
) ||
!Array.isArray(
triangleIndices
) ||
triangleIndices.length %
3 !==
0
) {
return deepFreeze({
valid:
false,

triangleCount:  
    0,  

  edges:  
    deepFreeze([]),  

  boundaryEdges:  
    deepFreeze([]),  

  nonmanifoldEdges:  
    deepFreeze([]),  

  directedConflicts:  
    deepFreeze([]),  

  isolatedVertices:  
    deepFreeze([]),  

  triangleAdjacency:  
    deepFreeze([]),  

  triangleConnectedComponents:  
    deepFreeze([]),  

  issues:  
    deepFreeze([  
      createEastIssue(  
        'INDEXED_TOPOLOGY_INPUT_INVALID',  
        'ERROR',  
        'Indexed topology requires finite vertices and a triangle-index array divisible by three.'  
      )  
    ])  
});

}

const triangleCount =
triangleIndices.length /
3;

const undirectedEdges =
new Map();

const directedEdges =
new Map();

const incidentTrianglesByVertex =
vertices.map(
() =>
[]
);

const triangleVertexRecords = [];

for (
let triangleIndex = 0;
triangleIndex <
triangleCount;
triangleIndex += 1
) {
const offset =
triangleIndex *
3;

const indices = [  
  triangleIndices[  
    offset  
  ],  

  triangleIndices[  
    offset + 1  
  ],  

  triangleIndices[  
    offset + 2  
  ]  
];  

if (  
  !indices.every(  
    (index) =>  
      isHEarthNonNegativeSafeInteger(  
        index  
      ) &&  
      index <  
        vertices.length  
  )  
) {  
  issues.push(  
    createEastIssue(  
      'TOPOLOGY_TRIANGLE_INDEX_INVALID',  
      'ERROR',  
      'Topology triangle references an invalid vertex.',  
      {  
        triangleIndex,  
        indices  
      },  
      true,  
      {  
        submissionIndex:  
          triangleIndex  
      }  
    )  
  );  

  triangleVertexRecords.push(  
    null  
  );  

  continue;  
}  

if (  
  new Set(indices).size !==  
  3  
) {  
  issues.push(  
    createEastIssue(  
      'TOPOLOGY_TRIANGLE_REPEATED_VERTEX',  
      'ERROR',  
      'Topology triangle repeats one or more vertex indices.',  
      {  
        triangleIndex,  
        indices  
      },  
      true,  
      {  
        submissionIndex:  
          triangleIndex  
      }  
    )  
  );  
}  

triangleVertexRecords.push(  
  deepFreeze({  
    triangleIndex,  

    indices:  
      deepFreeze(  
        indices  
      )  
  })  
);  

for (  
  const index of  
  indices  
) {  
  incidentTrianglesByVertex[  
    index  
  ].push(  
    triangleIndex  
  );  
}  

const directedPairs = [  
  [  
    indices[0],  
    indices[1]  
  ],  

  [  
    indices[1],  
    indices[2]  
  ],  

  [  
    indices[2],  
    indices[0]  
  ]  
];  

for (  
  const [  
    first,  
    second  
  ] of  
  directedPairs  
) {  
  const undirectedKey =  
    createUndirectedEdgeKey(  
      first,  
      second  
    );  

  if (  
    !undirectedEdges.has(  
      undirectedKey  
    )  
  ) {  
    undirectedEdges.set(  
      undirectedKey,  
      []  
    );  
  }  

  undirectedEdges.get(  
    undirectedKey  
  ).push(  
    deepFreeze({  
      triangleIndex,  
      first,  
      second  
    })  
  );  

  const directedKey =  
    createDirectedEdgeKey(  
      first,  
      second  
    );  

  if (  
    !directedEdges.has(  
      directedKey  
    )  
  ) {  
    directedEdges.set(  
      directedKey,  
      []  
    );  
  }  

  directedEdges.get(  
    directedKey  
  ).push(  
    triangleIndex  
  );  
}

}

const edges =
[...undirectedEdges.entries()]
.map(
(
[
key,
uses
]
) => {
const parsed =
parseUndirectedEdgeKey(
key
);

return deepFreeze({  
        key,  

        first:  
          parsed.first,  

        second:  
          parsed.second,  

        multiplicity:  
          uses.length,  

        uses:  
          deepFreeze(  
            uses.slice()  
          )  
      });  
    }  
  )  
  .sort(  
    (left, right) =>  
      left.first -  
        right.first ||  
      left.second -  
        right.second  
  );

const boundaryEdges =
edges.filter(
(edge) =>
edge.multiplicity ===
1
);

const nonmanifoldEdges =
edges.filter(
(edge) =>
edge.multiplicity >
2
);

for (
const edge of
nonmanifoldEdges
) {
issues.push(
createEastIssue(
'TOPOLOGY_NONMANIFOLD_EDGE',
'ERROR',
'An undirected edge is used by more than two triangles.',
{
first:
edge.first,

second:  
        edge.second,  

      multiplicity:  
        edge.multiplicity,  

      triangleIndices:  
        edge.uses.map(  
          (use) =>  
            use.triangleIndex  
        )  
    },  
    true,  
    {  
      submissionIndex:  
        Math.min(  
          ...edge.uses.map(  
            (use) =>  
              use.triangleIndex  
          )  
        )  
    }  
  )  
);

}

const directedConflicts = [];

for (
const edge of
edges
) {
if (
edge.multiplicity !==
2
) {
continue;
}

const forwardCount =  
  directedEdges.get(  
    createDirectedEdgeKey(  
      edge.first,  
      edge.second  
    )  
  )?.length ??  
  0;  

const reverseCount =  
  directedEdges.get(  
    createDirectedEdgeKey(  
      edge.second,  
      edge.first  
    )  
  )?.length ??  
  0;  

if (  
  forwardCount !==  
    1 ||  
  reverseCount !==  
    1  
) {  
  const conflict =  
    deepFreeze({  
      first:  
        edge.first,  

      second:  
        edge.second,  

      forwardCount,  

      reverseCount,  

      triangleIndices:  
        deepFreeze(  
          edge.uses.map(  
            (use) =>  
              use.triangleIndex  
          )  
        )  
    });  

  directedConflicts.push(  
    conflict  
  );  

  issues.push(  
    createEastIssue(  
      'TOPOLOGY_DIRECTED_EDGE_CONFLICT',  
      'ERROR',  
      'A two-use edge does not contain one forward and one reverse directed use.',  
      conflict,  
      true,  
      {  
        submissionIndex:  
          Math.min(  
            ...conflict  
              .triangleIndices  
          )  
      }  
    )  
  );  
}

}

const isolatedVertices =
incidentTrianglesByVertex
.map(
(
incidentTriangles,
vertexIndex
) =>
incidentTriangles.length ===
0
? vertexIndex
: null
)
.filter(
(vertexIndex) =>
vertexIndex !==
null
);

for (
const vertexIndex of
isolatedVertices
) {
issues.push(
createEastIssue(
'TOPOLOGY_ISOLATED_VERTEX',
'ERROR',
'A submitted vertex is not referenced by any valid triangle.',
{
vertexIndex
},
true,
{
submissionIndex:
vertexIndex
}
)
);
}

const triangleAdjacency =
Array.from(
{
length:
triangleCount
},
() =>
new Set()
);

for (
const edge of
edges
) {
const triangles =
edge.uses.map(
(use) =>
use.triangleIndex
);

for (  
  let firstIndex = 0;  
  firstIndex <  
    triangles.length;  
  firstIndex += 1  
) {  
  for (  
    let secondIndex =  
      firstIndex + 1;  
    secondIndex <  
      triangles.length;  
    secondIndex += 1  
  ) {  
    triangleAdjacency[  
      triangles[firstIndex]  
    ].add(  
      triangles[  
        secondIndex  
      ]  
    );  

    triangleAdjacency[  
      triangles[secondIndex]  
    ].add(  
      triangles[  
        firstIndex  
      ]  
    );  
  }  
}

}

const visited =
new Set();

const triangleConnectedComponents =
[];

for (
let triangleIndex = 0;
triangleIndex <
triangleCount;
triangleIndex += 1
) {
if (
visited.has(
triangleIndex
) ||
triangleVertexRecords[
triangleIndex
] ===
null
) {
continue;
}

const stack = [  
  triangleIndex  
];  

const component = [];  

visited.add(  
  triangleIndex  
);  

while (  
  stack.length >  
  0  
) {  
  const current =  
    stack.pop();  

  component.push(  
    current  
  );  

  for (  
    const neighbor of  
    triangleAdjacency[  
      current  
    ]  
  ) {  
    if (  
      !visited.has(  
        neighbor  
      )  
    ) {  
      visited.add(  
        neighbor  
      );  

      stack.push(  
        neighbor  
      );  
    }  
  }  
}  

component.sort(  
  (left, right) =>  
    left -  
    right  
);  

triangleConnectedComponents.push(  
  deepFreeze(  
    component  
  )  
);

}

return deepFreeze({
valid:
!hasHEarthBlockingIssues(
issues
),

vertexCount:  
  vertices.length,  

triangleCount,  

triangleVertexRecords:  
  deepFreeze(  
    triangleVertexRecords  
  ),  

edges:  
  deepFreeze(  
    edges  
  ),  

boundaryEdges:  
  deepFreeze(  
    boundaryEdges  
  ),  

nonmanifoldEdges:  
  deepFreeze(  
    nonmanifoldEdges  
  ),  

directedConflicts:  
  deepFreeze(  
    directedConflicts  
  ),  

isolatedVertices:  
  deepFreeze(  
    isolatedVertices  
  ),  

triangleAdjacency:  
  deepFreeze(  
    triangleAdjacency.map(  
      (neighbors) =>  
        deepFreeze(  
          [...neighbors]  
            .sort(  
              (  
                left,  
                right  
              ) =>  
                left -  
                right  
            )  
        )  
    )  
  ),  

triangleConnectedComponents:  
  deepFreeze(  
    triangleConnectedComponents  
  ),  

triangleConnectedComponentCount:  
  triangleConnectedComponents.length,  

issues:  
  sortHEarthGeometryIssues(  
    issues  
  )

});
}

/* ==========================================================================

20 · SIGNED VOLUME AND PER-SHELL ORIENTATION

========================================================================== */


export function calculateHEarthTriangleSignedVolume(
a,
b,
c
) {
if (
!isHEarthVector3(a) ||
!isHEarthVector3(b) ||
!isHEarthVector3(c)
) {
return Number.NaN;
}

const cross =
crossHEarthVector3(
b,
c
);

if (!cross) {
return Number.NaN;
}

const signedVolume =
dotHEarthVector3(
a,
cross
) /
6;

return isHEarthFiniteNumber(
signedVolume
)
? signedVolume
: Number.NaN;
}

export function calculateHEarthMeshSignedVolume(
vertices,
triangleIndices
) {
if (
!Array.isArray(vertices) ||
!vertices.every(
isHEarthVector3
) ||
!Array.isArray(
triangleIndices
) ||
triangleIndices.length %
3 !==
0
) {
return Number.NaN;
}

let volume = 0;

for (
let offset = 0;
offset <
triangleIndices.length;
offset += 3
) {
const aIndex =
triangleIndices[
offset
];

const bIndex =  
  triangleIndices[  
    offset + 1  
  ];  

const cIndex =  
  triangleIndices[  
    offset + 2  
  ];  

if (  
  !isHEarthNonNegativeSafeInteger(  
    aIndex  
  ) ||  
  !isHEarthNonNegativeSafeInteger(  
    bIndex  
  ) ||  
  !isHEarthNonNegativeSafeInteger(  
    cIndex  
  ) ||  
  aIndex >=  
    vertices.length ||  
  bIndex >=  
    vertices.length ||  
  cIndex >=  
    vertices.length  
) {  
  return Number.NaN;  
}  

const contribution =  
  calculateHEarthTriangleSignedVolume(  
    vertices[aIndex],  
    vertices[bIndex],  
    vertices[cIndex]  
  );  

if (  
  !isHEarthFiniteNumber(  
    contribution  
  )  
) {  
  return Number.NaN;  
}  

volume +=  
  contribution;  

if (  
  !isHEarthFiniteNumber(  
    volume  
  )  
) {  
  return Number.NaN;  
}

}

return volume;
}

function collectComponentEdges(
topology,
triangleSet
) {
return topology.edges.filter(
(edge) =>
edge.uses.some(
(use) =>
triangleSet.has(
use.triangleIndex
)
)
);
}

function collectComponentDirectedConflicts(
topology,
triangleSet
) {
return topology
.directedConflicts
.filter(
(conflict) =>
conflict
.triangleIndices
.some(
(triangleIndex) =>
triangleSet.has(
triangleIndex
)
)
);
}

export function analyzeHEarthMeshShells(
vertices,
triangleIndices,
topology,
toleranceContext
) {
const resolvedToleranceContext =
resolveToleranceContext(
toleranceContext
);

if (
!Array.isArray(vertices) ||
!vertices.every(
isHEarthVector3
) ||
!Array.isArray(
triangleIndices
) ||
!isPlainObject(topology) ||
!Array.isArray(
topology
.triangleConnectedComponents
) ||
!Array.isArray(
topology
.directedConflicts
) ||
!isHEarthGeometryToleranceContext(
resolvedToleranceContext
)
) {
return deepFreeze({
valid:
false,

shellOrientationRecords:  
    deepFreeze([]),  

  shellCount:  
    0,  

  outwardShellCount:  
    0,  

  inwardShellCount:  
    0,  

  degenerateShellCount:  
    0,  

  openShellCount:  
    0,  

  nonmanifoldShellCount:  
    0,  

  windingInconsistentShellCount:  
    0,  

  issues:  
    deepFreeze([  
      createEastIssue(  
        'SHELL_ANALYSIS_INPUT_INVALID',  
        'ERROR',  
        'Shell analysis requires valid indexed topology and tolerance context.'  
      )  
    ])  
});

}

const shellOrientationRecords = [];

const issues = [];

let outwardShellCount = 0;

let inwardShellCount = 0;

let degenerateShellCount = 0;

let openShellCount = 0;

let nonmanifoldShellCount = 0;

let windingInconsistentShellCount = 0;

for (
let componentIndex = 0;
componentIndex <
topology
.triangleConnectedComponents
.length;
componentIndex += 1
) {
const component =
topology
.triangleConnectedComponents[
componentIndex
];

const triangleSet =  
  new Set(  
    component  
  );  

const componentEdges =  
  collectComponentEdges(  
    topology,  
    triangleSet  
  );  

const componentDirectedConflicts =  
  collectComponentDirectedConflicts(  
    topology,  
    triangleSet  
  );  

const boundaryEdgeCount =  
  componentEdges.filter(  
    (edge) =>  
      edge.uses.filter(  
        (use) =>  
          triangleSet.has(  
            use.triangleIndex  
          )  
      ).length ===  
      1  
  ).length;  

const nonmanifoldEdgeCount =  
  componentEdges.filter(  
    (edge) =>  
      edge.uses.filter(  
        (use) =>  
          triangleSet.has(  
            use.triangleIndex  
          )  
      ).length >  
      2  
  ).length;  

const directedConflictCount =  
  componentDirectedConflicts.length;  

const componentIndices = [];  

for (  
  const triangleIndex of  
  component  
) {  
  const offset =  
    triangleIndex *  
    3;  

  componentIndices.push(  
    triangleIndices[  
      offset  
    ],  

    triangleIndices[  
      offset + 1  
    ],  

    triangleIndices[  
      offset + 2  
    ]  
  );  
}  

let orientation;  

let signedVolume = null;  

if (  
  nonmanifoldEdgeCount >  
  0  
) {  
  orientation =  
    H_EARTH_3D_GEOMETRY_EAST_ENUMS  
      .shellOrientation  
      .NONMANIFOLD;  

  nonmanifoldShellCount +=  
    1;  
} else if (  
  boundaryEdgeCount >  
  0  
) {  
  orientation =  
    H_EARTH_3D_GEOMETRY_EAST_ENUMS  
      .shellOrientation.OPEN;  

  openShellCount +=  
    1;  
} else if (  
  directedConflictCount >  
  0  
) {  
  orientation =  
    H_EARTH_3D_GEOMETRY_EAST_ENUMS  
      .shellOrientation  
      .WINDING_INCONSISTENT;  

  windingInconsistentShellCount +=  
    1;  
} else {  
  signedVolume =  
    calculateHEarthMeshSignedVolume(  
      vertices,  
      componentIndices  
    );  

  if (  
    !isHEarthFiniteNumber(  
      signedVolume  
    ) ||  
    Math.abs(  
      signedVolume  
    ) <=  
      resolvedToleranceContext  
        .volumeTolerance  
  ) {  
    orientation =  
      H_EARTH_3D_GEOMETRY_EAST_ENUMS  
        .shellOrientation  
        .DEGENERATE;  

    degenerateShellCount +=  
      1;  
  } else if (  
    signedVolume >  
    0  
  ) {  
    orientation =  
      H_EARTH_3D_GEOMETRY_EAST_ENUMS  
        .shellOrientation  
        .OUTWARD;  

    outwardShellCount +=  
      1;  
  } else {  
    orientation =  
      H_EARTH_3D_GEOMETRY_EAST_ENUMS  
        .shellOrientation  
        .INWARD;  

    inwardShellCount +=  
      1;  
  }  
}  

shellOrientationRecords.push(  
  deepFreeze({  
    shellIndex:  
      componentIndex,  

    triangleIndices:  
      deepFreeze(  
        component.slice()  
      ),  

    triangleCount:  
      component.length,  

    boundaryEdgeCount,  

    nonmanifoldEdgeCount,  

    directedConflictCount,  

    signedVolume,  

    orientation  
  })  
);

}

if (
inwardShellCount >
0
) {
issues.push(
createEastIssue(
'MESH_INWARD_ORIENTED_SHELL_PRESENT',
'ERROR',
'One or more closed shells are inward-oriented.',
{
inwardShellCount
}
)
);
}

if (
degenerateShellCount >
0
) {
issues.push(
createEastIssue(
'MESH_DEGENERATE_SHELL_PRESENT',
'ERROR',
'One or more closed shells have degenerate signed volume.',
{
degenerateShellCount
}
)
);
}

if (
nonmanifoldShellCount >
0
) {
issues.push(
createEastIssue(
'MESH_NONMANIFOLD_SHELL_PRESENT',
'ERROR',
'One or more components contain nonmanifold edges.',
{
nonmanifoldShellCount
}
)
);
}

if (
windingInconsistentShellCount >
0
) {
issues.push(
createEastIssue(
'MESH_WINDING_INCONSISTENT_SHELL_PRESENT',
'ERROR',
'One or more closed components contain directed-edge conflicts.',
{
windingInconsistentShellCount
}
)
);
}

return deepFreeze({
valid:
!hasHEarthBlockingIssues(
issues
),

shellOrientationRecords:  
  deepFreeze(  
    shellOrientationRecords  
  ),  

shellCount:  
  shellOrientationRecords.length,  

outwardShellCount,  

inwardShellCount,  

degenerateShellCount,  

openShellCount,  

nonmanifoldShellCount,  

windingInconsistentShellCount,  

issues:  
  sortHEarthGeometryIssues(  
    issues  
  )

});
}

/* ==========================================================================

21 · COMPLETE INDEXED-MESH ANALYSIS

========================================================================== */


export function evaluateHEarthIndexedMesh(
vertices,
triangleIndices,
toleranceContext
) {
const resolvedToleranceContext =
resolveToleranceContext(
toleranceContext
);

if (
!isHEarthGeometryToleranceContext(
resolvedToleranceContext
)
) {
return deepFreeze({
valid:
false,

classification:  
    H_EARTH_3D_GEOMETRY_EAST_ENUMS  
      .topologyClassification.INVALID,  

  bounds:  
    null,  

  topology:  
    null,  

  shellAnalysis:  
    null,  

  faceNormals:  
    null,  

  vertexNormals:  
    null,  

  issues:  
    deepFreeze([  
      createEastIssue(  
        'INDEXED_MESH_TOLERANCE_CONTEXT_INVALID',  
        'ERROR',  
        'Indexed-mesh evaluation requires a valid tolerance context.'  
      )  
    ])  
});

}

const topology =
extractHEarthIndexedTopology(
vertices,
triangleIndices
);

const faceNormals =
calculateHEarthFaceNormals(
vertices,
triangleIndices,
resolvedToleranceContext
);

const vertexNormals =
calculateHEarthVertexNormals(
vertices,
triangleIndices,
resolvedToleranceContext
);

const shellAnalysis =
analyzeHEarthMeshShells(
vertices,
triangleIndices,
topology,
resolvedToleranceContext
);

const bounds =
Array.isArray(vertices) &&
vertices.every(
isHEarthVector3
)
? createHEarthGeometryBounds(
vertices
)
: null;

const issues = [
...topology.issues,
...faceNormals.issues,
...vertexNormals.issues,
...shellAnalysis.issues
];

const noBoundaryEdges =
topology.boundaryEdges.length ===
0;

const noNonmanifoldEdges =
topology.nonmanifoldEdges.length ===
0;

const noDirectedConflicts =
topology.directedConflicts.length ===
0;

const noIsolatedVertices =
topology.isolatedVertices.length ===
0;

const structurallyClosed =
noBoundaryEdges &&
noNonmanifoldEdges;

const cleanlyClosed =
topology.valid &&
structurallyClosed &&
noDirectedConflicts &&
noIsolatedVertices;

let classification;

if (
!bounds ||
!isHEarthAABB3D(
bounds,
resolvedToleranceContext
)
) {
classification =
H_EARTH_3D_GEOMETRY_EAST_ENUMS
.topologyClassification
.INVALID;
} else if (
topology.nonmanifoldEdges.length >
0
) {
classification =
topology.boundaryEdges.length >
0
? H_EARTH_3D_GEOMETRY_EAST_ENUMS
.topologyClassification
.OPEN_NONMANIFOLD
: H_EARTH_3D_GEOMETRY_EAST_ENUMS
.topologyClassification
.DISCONNECTED_MIXED;
} else if (
topology.boundaryEdges.length >
0
) {
classification =
H_EARTH_3D_GEOMETRY_EAST_ENUMS
.topologyClassification
.OPEN_MANIFOLD;
} else if (
topology.directedConflicts.length >
0 ||
shellAnalysis
.windingInconsistentShellCount >
0
) {
classification =
H_EARTH_3D_GEOMETRY_EAST_ENUMS
.topologyClassification
.CLOSED_WINDING_INCONSISTENT;
} else if (
topology.isolatedVertices.length >
0
) {
classification =
H_EARTH_3D_GEOMETRY_EAST_ENUMS
.topologyClassification
.INVALID;
} else if (
shellAnalysis
.degenerateShellCount >
0
) {
classification =
H_EARTH_3D_GEOMETRY_EAST_ENUMS
.topologyClassification
.CLOSED_DEGENERATE;
} else if (
shellAnalysis
.inwardShellCount >
0 &&
shellAnalysis
.outwardShellCount >
0
) {
classification =
H_EARTH_3D_GEOMETRY_EAST_ENUMS
.topologyClassification
.CLOSED_MIXED_ORIENTATION;
} else if (
shellAnalysis
.inwardShellCount >
0
) {
classification =
H_EARTH_3D_GEOMETRY_EAST_ENUMS
.topologyClassification
.CLOSED_INWARD_ORIENTED_MANIFOLD;
} else if (
cleanlyClosed &&
shellAnalysis.shellCount >
0 &&
shellAnalysis.outwardShellCount ===
shellAnalysis.shellCount
) {
classification =
H_EARTH_3D_GEOMETRY_EAST_ENUMS
.topologyClassification
.CLOSED_ORIENTED_MANIFOLD;
} else {
classification =
H_EARTH_3D_GEOMETRY_EAST_ENUMS
.topologyClassification
.INVALID;
}

const outwardClosed =
cleanlyClosed &&
shellAnalysis.shellCount >
0 &&
shellAnalysis.outwardShellCount ===
shellAnalysis.shellCount;

return deepFreeze({
valid:
!hasHEarthBlockingIssues(
issues
),

classification,  

structurallyClosed,  

closed:  
  cleanlyClosed,  

outwardClosed,  

bounds,  

topology,  

shellAnalysis,  

faceNormals,  

vertexNormals,  

closureRequirements:  
  deepFreeze({  
    noInvalidTriangles:  
      !topology.issues.some(  
        (issue) =>  
          issue.code ===  
            'TOPOLOGY_TRIANGLE_INDEX_INVALID' ||  
          issue.code ===  
            'TOPOLOGY_TRIANGLE_REPEATED_VERTEX'  
      ),  

    noBoundaryEdges,  

    noNonmanifoldEdges,  

    noDirectedConflicts,  

    noIsolatedVertices,  

    allClosedShellsOutward:  
      outwardClosed  
  }),  

issues:  
  sortHEarthGeometryIssues(  
    issues  
  )

});
}

/* ==========================================================================

22 · EAST OWNERSHIP DECLARATION

========================================================================== */


export const H_EARTH_3D_GEOMETRY_KERNEL_EAST_OWNERSHIP =
deepFreeze({
jurisdiction:
'MATHEMATICAL_DESCRIPTION_EVALUATION_SAMPLING_AND_ANALYSIS_ONLY',

owns: deepFreeze([  
  'DESCRIPTOR_SCHEMAS',  
  'DESCRIPTOR_STRUCTURAL_VALIDATION',  
  'DETERMINISTIC_EVALUATOR_WRAPPING',  
  'PARAMETER_DOMAIN_VALIDATION',  
  'OPEN_SAMPLING',  
  'PERIODIC_SAMPLING',  
  'DUPLICATE_SAMPLE_ANALYSIS',  
  'DERIVATIVE_ESTIMATION',  
  'PARAMETRIC_SURFACE_ANALYSIS',  
  'HEIGHT_FIELD_ANALYSIS',  
  'CURVE_TANGENT_ANALYSIS',  
  'XZ_CURVE_NORMAL_ANALYSIS',  
  'XZ_NEAREST_POINT_ANALYSIS',  
  'XZ_SIGNED_DISTANCE_ANALYSIS',  
  'POLYGON_PROJECTION',  
  'POLYGON_PLANARITY_ANALYSIS',  
  'POLYGON_CONVEXITY_ANALYSIS',  
  'POLYGON_SELF_INTERSECTION_ANALYSIS',  
  'INDEXED_TOPOLOGY_EXTRACTION',  
  'EDGE_MULTIPLICITY_ANALYSIS',  
  'DIRECTED_EDGE_ANALYSIS',  
  'CONNECTED_COMPONENT_ANALYSIS',  
  'ISOLATED_VERTEX_ANALYSIS',  
  'SHELL_ANALYSIS',  
  'CLOSURE_ANALYSIS',  
  'MANIFOLD_ANALYSIS',  
  'SIGNED_VOLUME_ANALYSIS',  
  'CONVEX_TRIANGULATION_ANALYSIS'  
]),  

mustNotOwn: deepFreeze([  
  'FINAL_PRIMITIVE_RECORDS',  
  'SCENE_SPECIFIC_GEOMETRY',  
  'PRIMITIVE_CONSTRUCTION',  
  'PRIMITIVE_ADMISSION',  
  'PROVIDER_ADMISSION',  
  'PROVIDER_ACCOUNTING',  
  'CAPACITY_CONSUMPTION',  
  'AGGREGATE_FRAME_ADMISSION',  
  'COMPOSITOR_POLICY',  
  'RENDERER_PROJECTION',  
  'MATERIALIZATION'  
]),  

imports:  
  deepFreeze([  
    './geometry-kernel.north.js'  
  ]),  

prohibitedImports:  
  deepFreeze([  
    './geometry-kernel.south.js',  
    './geometry-kernel.west.js',  
    './geometry-kernel.js',  
    './geometry-index.js',  
    '../capacity.js',  
    '../environment.js',  
    '../compositor.js',  
    '../renderer.js',  
    '../controller.js',  
    '../index.js'  
  ])

});

/* ==========================================================================

23 · TARGETED CORRECTION DECLARATION

========================================================================== */


export const H_EARTH_3D_GEOMETRY_KERNEL_EAST_CORRECTIONS =
deepFreeze({
correctionScopeId:
H_EARTH_3D_GEOMETRY_EAST_CORRECTION_SCOPE_ID,

corrections:  
  deepFreeze([  
    deepFreeze({  
      id:  
        'EAST_CORRECTION_01',  

      status:  
        'IMPLEMENTED_CANDIDATE',  

      description:  
        'Periodic sampling requires at least three samples and excludes the duplicate terminal sample.'  
    }),  

    deepFreeze({  
      id:  
        'EAST_CORRECTION_02',  

      status:  
        'IMPLEMENTED_CANDIDATE',  

      description:  
        'Periodic curve and surface derivatives use an unwrapped parameter denominator while evaluating wrapped parameters.'  
    }),  

    deepFreeze({  
      id:  
        'EAST_CORRECTION_03',  

      status:  
        'IMPLEMENTED_CANDIDATE',  

      description:  
        'Topology extraction emits deterministic issues for nonmanifold edges, directed-edge conflicts, and isolated vertices.'  
    }),  

    deepFreeze({  
      id:  
        'EAST_CORRECTION_04',  

      status:  
        'IMPLEMENTED_CANDIDATE',  

      description:  
        'Directed-edge conflicts block clean closed-manifold classification and closure validity.'  
    }),  

    deepFreeze({  
      id:  
        'EAST_CORRECTION_05',  

      status:  
        'IMPLEMENTED_CANDIDATE',  

      description:  
        'Convex triangulation is explicitly classified as an analysis-level triangle-index plan and creates no primitive or admitted geometry.'  
    })  
  ]),  

implementationConformance:  
  'NOT_YET_EVALUATED'

});

/* ==========================================================================

24 · REQUIRED EAST FIXTURE CORRIDOR

========================================================================== */


export const H_EARTH_3D_GEOMETRY_KERNEL_EAST_REQUIRED_FIXTURES =
deepFreeze([
'CURVE_PARAMETER_INSIDE_DOMAIN_ACCEPTED',
'CURVE_PARAMETER_OUTSIDE_OPEN_DOMAIN_REJECTED',
'CURVE_PARAMETER_OUTSIDE_PERIODIC_DOMAIN_WRAPPED',
'SURFACE_U_OUTSIDE_DOMAIN_REJECTED',
'SURFACE_V_OUTSIDE_DOMAIN_REJECTED',
'HEIGHT_FIELD_X_OUTSIDE_DOMAIN_REJECTED',
'HEIGHT_FIELD_Z_OUTSIDE_DOMAIN_REJECTED',
'SCALAR_FIELD_AXIS_OUTSIDE_DOMAIN_REJECTED',
'SIGNED_DISTANCE_FIELD_AXIS_OUTSIDE_DOMAIN_REJECTED',
'PERIODIC_SAMPLE_COUNT_ONE_REJECTED',
'PERIODIC_SAMPLE_COUNT_TWO_REJECTED',
'PERIODIC_SAMPLE_COUNT_THREE_ACCEPTED',
'PERIODIC_SAMPLING_EXCLUDES_DUPLICATE_TERMINAL_SAMPLE',
'OPEN_SAMPLING_INCLUDES_BOTH_TERMINALS',
'REJECTED_GRID_SAMPLE_HOLDS_RECTANGULAR_TOPOLOGY',
'GRID_ADDRESS_CARDINALITY_PRESERVED',
'DUPLICATE_CANONICAL_INDEX_IS_LOWEST_SUBMISSION_INDEX',
'DUPLICATE_ANALYSIS_AVOIDS_GLOBAL_PAIRWISE_SEARCH',
'PERIODIC_CURVE_SEAM_DERIVATIVE_USES_UNWRAPPED_DELTA',
'PERIODIC_SURFACE_SEAM_PARTIAL_U_USES_UNWRAPPED_DELTA',
'PERIODIC_SURFACE_SEAM_PARTIAL_V_USES_UNWRAPPED_DELTA',
'HEIGHT_FIELD_UPWARD_NORMAL_USES_SV_CROSS_SU',
'TRIANGLE_AREA_AND_DOUBLE_AREA_LAW',
'VERTEX_NORMAL_ACCUMULATES_RAW_CROSS_ONCE',
'XZ_SIGNED_DISTANCE_DISCARDS_Y',
'XZ_LEFT_NORMAL_EQUALS_NEGATIVE_TZ_ZERO_TX',
'POLYGON_SELF_INTERSECTION_USES_AREA_TOLERANCE',
'CONVEX_TRIANGULATION_REJECTS_CONCAVE_POLYGON',
'CONVEX_TRIANGULATION_OUTPUT_CLASSIFIED_ANALYSIS_ONLY',
'OPEN_MESH_NOT_CLASSIFIED_AS_CLOSED_WINDING_FAILURE',
'DISCONNECTED_SHELLS_ORIENTED_INDEPENDENTLY',
'OUTWARD_TETRA_SIGNED_VOLUME_POSITIVE',
'INWARD_TETRA_SIGNED_VOLUME_NEGATIVE',
'OUTWARD_AND_INWARD_SHELLS_DO_NOT_CANCEL',
'ISOLATED_VERTEX_REPORTED',
'ISOLATED_VERTEX_ISSUE_EMITTED',
'NONMANIFOLD_EDGE_REPORTED',
'NONMANIFOLD_EDGE_ISSUE_EMITTED',
'DIRECTED_EDGE_CONFLICT_REPORTED',
'DIRECTED_EDGE_CONFLICT_ISSUE_EMITTED',
'DIRECTED_CONFLICT_BLOCKS_CLOSED_MANIFOLD_CLASSIFICATION'
]);

/* ==========================================================================

25 · EAST STATIC SELF-REVIEW

========================================================================== */


export function getHEarthGeometryKernelEastStaticReview() {
const periodicDomain =
createHEarthParameterDomain({
minimum:
0,

maximum:  
    1,  

  topology:  
    H_EARTH_3D_GEOMETRY_EAST_ENUMS  
      .domainTopology  
      .PERIODIC  
});

const periodicThree =
sampleHEarthParameterDomain(
periodicDomain,
3
);

const periodicTwo =
sampleHEarthParameterDomain(
periodicDomain,
2
);

const checks =
deepFreeze([
deepFreeze({
id:
'EAST_IMPORTS_NORTH_ONLY',

passed:  
      H_EARTH_3D_GEOMETRY_KERNEL_EAST_OWNERSHIP  
        .imports.length ===  
        1 &&  
      H_EARTH_3D_GEOMETRY_KERNEL_EAST_OWNERSHIP  
        .imports[0] ===  
        './geometry-kernel.north.js'  
  }),  

  deepFreeze({  
    id:  
      'NORTH_CONTRACT_EXPECTED',  

    passed:  
      H_EARTH_3D_GEOMETRY_KERNEL_NORTH_CONTRACT_ID ===  
        'H_EARTH_3D_GEOMETRY_KERNEL_NORTH_FILE_BIRTH_STEP_034O_4N_FOUNDATIONAL_MATHEMATICS_v1'  
  }),  

  deepFreeze({  
    id:  
      'NORTH_SCHEMA_VERSION_AT_LEAST_3',  

    passed:  
      H_EARTH_3D_GEOMETRY_KERNEL_NORTH_SCHEMA_VERSION >=  
        3  
  }),  

  deepFreeze({  
    id:  
      'EAST_JURISDICTION_DECLARED',  

    passed:  
      H_EARTH_3D_GEOMETRY_KERNEL_EAST_OWNERSHIP  
        .jurisdiction ===  
        'MATHEMATICAL_DESCRIPTION_EVALUATION_SAMPLING_AND_ANALYSIS_ONLY'  
  }),  

  deepFreeze({  
    id:  
      'PERIODIC_SAMPLE_COUNT_TWO_REJECTED',  

    passed:  
      periodicTwo ===  
      null  
  }),  

  deepFreeze({  
    id:  
      'PERIODIC_SAMPLE_COUNT_THREE_ACCEPTED',  

    passed:  
      Array.isArray(  
        periodicThree  
      ) &&  
      periodicThree.length ===  
        3  
  }),  

  deepFreeze({  
    id:  
      'PERIODIC_TERMINAL_EXCLUSION_DECLARED',  

    passed:  
      Array.isArray(  
        periodicThree  
      ) &&  
      periodicThree[  
        periodicThree.length -  
        1  
      ] <  
        periodicDomain.maximum  
  }),  

  deepFreeze({  
    id:  
      'TRIANGULATION_ANALYSIS_ONLY_DECLARED',  

    passed:  
      H_EARTH_3D_GEOMETRY_KERNEL_EAST_OWNERSHIP  
        .owns.includes(  
          'CONVEX_TRIANGULATION_ANALYSIS'  
        ) &&  
      H_EARTH_3D_GEOMETRY_KERNEL_EAST_OWNERSHIP  
        .mustNotOwn.includes(  
          'PRIMITIVE_CONSTRUCTION'  
        )  
  }),  

  deepFreeze({  
    id:  
      'COORDINATE_FRAME_MATCHES_NORTH',  

    passed:  
      H_EARTH_3D_GEOMETRY_COORDINATE_FRAME ===  
        'H_EARTH_REGION_SPACE_XYZ_WORLD_UNITS'  
  })  
]);

const passed =
checks.every(
(check) =>
check.passed ===
true
);

return deepFreeze({
reviewId:
'H_EARTH_3D_GEOMETRY_KERNEL_EAST_CORRECTED_STATIC_SELF_REVIEW_v1',

contractId:  
  H_EARTH_3D_GEOMETRY_KERNEL_EAST_CONTRACT_ID,  

correctionScopeId:  
  H_EARTH_3D_GEOMETRY_EAST_CORRECTION_SCOPE_ID,  

passed,  

status:  
  passed  
    ? 'STATIC_SELF_REVIEW_PASS_CANDIDATE'  
    : 'STATIC_SELF_REVIEW_HOLD',  

checks,  

prohibitedImportScanPerformed:  
  false,  

northReadbackCorrespondenceVerified:  
  false,  

executableFixtureReviewPerformed:  
  false,  

positiveFixtureExecutionPerformed:  
  false,  

negativeFixtureExecutionPerformed:  
  false,  

localImplementationConformance:  
  'NOT_YET_EVALUATED'

});
}

/* ==========================================================================

26 · EAST RECEIPT

========================================================================== */


export const H_EARTH_3D_GEOMETRY_KERNEL_EAST_RECEIPT =
deepFreeze({
receiptId:
'H_EARTH_3D_GEOMETRY_KERNEL_EAST_CORRECTED_IMPLEMENTATION_CANDIDATE_RECEIPT_v1',

contractId:  
  H_EARTH_3D_GEOMETRY_KERNEL_EAST_CONTRACT_ID,  

sourceFile:  
  H_EARTH_3D_GEOMETRY_KERNEL_EAST_SOURCE_FILE,  

schemaVersion:  
  H_EARTH_3D_GEOMETRY_KERNEL_EAST_SCHEMA_VERSION,  

northDependencyContractId:  
  H_EARTH_3D_GEOMETRY_KERNEL_NORTH_CONTRACT_ID,  

northDependencySchemaVersion:  
  H_EARTH_3D_GEOMETRY_KERNEL_NORTH_SCHEMA_VERSION,  

mathematicsPacketId:  
  H_EARTH_3D_GEOMETRY_MATHEMATICS_PACKET_ID,  

mathematicsAcceptanceReceiptId:  
  H_EARTH_3D_GEOMETRY_MATHEMATICS_ACCEPTANCE_RECEIPT_ID,  

ownershipContractId:  
  H_EARTH_3D_GEOMETRY_OWNERSHIP_CONTRACT_ID,  

ownershipLockReceiptId:  
  H_EARTH_3D_GEOMETRY_OWNERSHIP_LOCK_RECEIPT_ID,  

finalRefreezeReceiptId:  
  H_EARTH_3D_GEOMETRY_FINAL_REFREEZE_RECEIPT_ID,  

correctionScopeId:  
  H_EARTH_3D_GEOMETRY_EAST_CORRECTION_SCOPE_ID,  

jurisdiction:  
  'MATHEMATICAL_DESCRIPTION_EVALUATION_SAMPLING_AND_ANALYSIS_ONLY',  

implementationBodyExists:  
  true,  

targetedCorrectionsImplemented:  
  true,  

northDependencyLocallyAdmitted:  
  true,  

prohibitedImportScanPerformed:  
  false,  

testExecutionPerformed:  
  false,  

positiveFixtureExecutionPerformed:  
  false,  

negativeFixtureExecutionPerformed:  
  false,  

localImplementationConformance:  
  'NOT_YET_EVALUATED',  

eastLocalAdmission:  
  false,  

eastPublicSymbolFreeze:  
  false,  

southImplementationAuthority:  
  false,  

fullKernelImplementationConformance:  
  'NOT_YET_EVALUATED',  

providerAuthority:  
  false,  

geometryIndexAuthority:  
  false,  

compositorIntegrationAuthority:  
  false,  

rendererIntegrationAuthority:  
  false,  

visualApproval:  
  false,  

productionAuthority:  
  false,  

publicReleaseAuthority:  
  false,  

backupAndRepositoryInstallApproval:  
  false,  

nextRequired:  
  'CORRECTED_EAST_STATIC_OWNERSHIP_REVIEW_PROHIBITED_IMPORT_SCAN_AND_EXECUTABLE_FIXTURE_CORRIDOR'

});

/* ==========================================================================

27 · EAST PUBLIC API CANDIDATE MANIFEST

========================================================================== */


export const H_EARTH_3D_GEOMETRY_KERNEL_EAST_PUBLIC_API_CANDIDATE =
deepFreeze({
manifestStatus:
'CANDIDATE_NOT_FROZEN',

owningModule:  
  'geometry-kernel.east.js',  

classification:  
  'EAST_PUBLIC_CANDIDATE',  

symbols:  
  deepFreeze([  
    'H_EARTH_3D_GEOMETRY_KERNEL_EAST_CONTRACT_ID',  
    'H_EARTH_3D_GEOMETRY_KERNEL_EAST_SCHEMA_VERSION',  
    'H_EARTH_3D_GEOMETRY_EAST_ENUMS',  
    'H_EARTH_3D_GEOMETRY_KERNEL_EAST_OWNERSHIP',  
    'H_EARTH_3D_GEOMETRY_KERNEL_EAST_CORRECTIONS',  
    'H_EARTH_3D_GEOMETRY_KERNEL_EAST_REQUIRED_FIXTURES',  
    'createHEarthParameterDomain',  
    'isHEarthParameterDomain',  
    'isHEarthParameterInsideDomain',  
    'wrapHEarthPeriodicParameter',  
    'createHEarthParametricCurveDescriptor',  
    'createHEarthParametricSurfaceDescriptor',  
    'createHEarthHeightFieldDescriptor',  
    'createHEarthScalarFieldDescriptor',  
    'createHEarthSignedDistanceFieldDescriptor',  
    'createHEarthRadialSurfaceDescriptor',  
    'validateHEarthEquationDescriptor',  
    'evaluateHEarthEquationDescriptor',  
    'sampleHEarthParameterDomain',  
    'sampleHEarthParametricCurve',  
    'sampleHEarthParametricSurface',  
    'sampleHEarthHeightField',  
    'evaluateHEarthGridSampleIntegrity',  
    'analyzeHEarthDuplicatePoints',  
    'estimateHEarthCurveDerivative',  
    'evaluateHEarthCurveTangent',  
    'evaluateHEarthXZCurveNormal',  
    'evaluateHEarthParametricSurfaceDifferential',  
    'evaluateHEarthTriangleNormal',  
    'calculateHEarthFaceNormals',  
    'calculateHEarthVertexNormals',  
    'evaluateHEarthXZNearestPointOnPolyline',  
    'evaluateHEarthXZSignedDistanceToPolyline',  
    'projectHEarthPolygonToPlane',  
    'calculateHEarthSignedPolygonArea2D',  
    'calculateHEarthSignedPolygonAreaXZ',  
    'calculateHEarthYOrientedPolygonArea',  
    'evaluateHEarthPolygonPlanarity',  
    'evaluateHEarthPolygonSelfIntersection',  
    'evaluateHEarthPolygonConvexity',  
    'triangulateHEarthConvexPolygon',  
    'extractHEarthIndexedTopology',  
    'calculateHEarthTriangleSignedVolume',  
    'calculateHEarthMeshSignedVolume',  
    'analyzeHEarthMeshShells',  
    'evaluateHEarthIndexedMesh',  
    'getHEarthGeometryKernelEastStaticReview',  
    'getHEarthGeometryKernelEastReceipt',  
    'getHEarthGeometryKernelEastContract'  
  ]),  

collisionStatus:  
  'NOT_YET_REVIEWED',  

implementationStatus:  
  'CORRECTED_IMPLEMENTATION_CANDIDATE',  

conformanceStatus:  
  'NOT_YET_EVALUATED'

});

/* ==========================================================================

28 · EAST CONTRACT

========================================================================== */


export const H_EARTH_3D_GEOMETRY_KERNEL_EAST_CONTRACT =
deepFreeze({
contractId:
H_EARTH_3D_GEOMETRY_KERNEL_EAST_CONTRACT_ID,

schemaVersion:  
  H_EARTH_3D_GEOMETRY_KERNEL_EAST_SCHEMA_VERSION,  

sourceFile:  
  H_EARTH_3D_GEOMETRY_KERNEL_EAST_SOURCE_FILE,  

northDependencyContractId:  
  H_EARTH_3D_GEOMETRY_KERNEL_NORTH_CONTRACT_ID,  

northDependencySchemaVersion:  
  H_EARTH_3D_GEOMETRY_KERNEL_NORTH_SCHEMA_VERSION,  

mathematicsPacketId:  
  H_EARTH_3D_GEOMETRY_MATHEMATICS_PACKET_ID,  

mathematicsAcceptanceReceiptId:  
  H_EARTH_3D_GEOMETRY_MATHEMATICS_ACCEPTANCE_RECEIPT_ID,  

ownershipContractId:  
  H_EARTH_3D_GEOMETRY_OWNERSHIP_CONTRACT_ID,  

ownershipLockReceiptId:  
  H_EARTH_3D_GEOMETRY_OWNERSHIP_LOCK_RECEIPT_ID,  

finalRefreezeReceiptId:  
  H_EARTH_3D_GEOMETRY_FINAL_REFREEZE_RECEIPT_ID,  

correctionScopeId:  
  H_EARTH_3D_GEOMETRY_EAST_CORRECTION_SCOPE_ID,  

mathematicsStandard:  
  'FROZEN',  

frozenScope:  
  'GEOMETRY_MATHEMATICS_ONLY',  

jurisdiction:  
  'MATHEMATICAL_DESCRIPTION_EVALUATION_SAMPLING_AND_ANALYSIS_ONLY',  

dependencyDirection:  
  'NORTH_TO_EAST',  

imports:  
  deepFreeze([  
    './geometry-kernel.north.js'  
  ]),  

ownership:  
  H_EARTH_3D_GEOMETRY_KERNEL_EAST_OWNERSHIP,  

corrections:  
  H_EARTH_3D_GEOMETRY_KERNEL_EAST_CORRECTIONS,  

requiredFixtures:  
  H_EARTH_3D_GEOMETRY_KERNEL_EAST_REQUIRED_FIXTURES,  

enums:  
  H_EARTH_3D_GEOMETRY_EAST_ENUMS,  

publicApiCandidate:  
  H_EARTH_3D_GEOMETRY_KERNEL_EAST_PUBLIC_API_CANDIDATE,  

receipt:  
  H_EARTH_3D_GEOMETRY_KERNEL_EAST_RECEIPT,  

implementationConformance:  
  'NOT_YET_EVALUATED',  

testExecutionPerformed:  
  false,  

eastLocalAdmission:  
  false,  

eastPublicSymbolFreeze:  
  false,  

southImplementationAuthority:  
  false,  

providerAuthority:  
  false,  

geometryIndexAuthority:  
  false,  

compositorIntegrationAuthority:  
  false,  

rendererIntegrationAuthority:  
  false,  

visualApproval:  
  false,  

productionAuthority:  
  false,  

publicReleaseAuthority:  
  false

});

/* ==========================================================================

29 · ACCESSORS

========================================================================== */


export function getHEarthGeometryKernelEastReceipt() {
return H_EARTH_3D_GEOMETRY_KERNEL_EAST_RECEIPT;
}

export function getHEarthGeometryKernelEastContract() {
return H_EARTH_3D_GEOMETRY_KERNEL_EAST_CONTRACT;
}

export default H_EARTH_3D_GEOMETRY_KERNEL_EAST_CONTRACT;
