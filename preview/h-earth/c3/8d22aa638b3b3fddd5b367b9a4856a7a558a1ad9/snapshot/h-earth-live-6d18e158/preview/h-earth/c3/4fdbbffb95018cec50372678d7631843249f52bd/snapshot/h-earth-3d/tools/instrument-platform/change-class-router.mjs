import { deepFreeze } from './platform-core.mjs';

export const CHANGE_CLASSES = deepFreeze([
  'SOURCE_ONLY_CONTROL_CHANGE',
  'DIAGNOSTIC_TOOL_CHANGE',
  'TERRAIN_OR_GEOMETRY_CHANGE',
  'RENDERER_CHANGE',
  'MATERIAL_OR_LIGHTING_CHANGE',
  'NAVIGATION_OR_INPUT_CHANGE',
  'LIVE_BINDING_CHANGE',
  'PUBLIC_ROUTE_CHANGE',
  'EVIDENCE_ONLY_OPERATION',
  'USER_PERCEPTUAL_COMPARISON',
  'DEFAULT_PROMOTION'
]);

const routes = {
  SOURCE_ONLY_CONTROL_CHANGE: { requiredTools: ['H_EARTH_GAUGES', 'FD_05_DIAGNOSTIC_AUTHORITY'], requiredAuthorities: ['SOURCE_AUTHORITY', 'RUNTIME_AUTHORITY'], candidateAssemblerRequired: true, liveAdmissionRequired: false, userDifferentialRequired: false },
  DIAGNOSTIC_TOOL_CHANGE: { requiredTools: ['H_EARTH_GAUGES', 'FD_05_DIAGNOSTIC_AUTHORITY'], requiredAuthorities: ['SOURCE_AUTHORITY', 'RUNTIME_AUTHORITY'], candidateAssemblerRequired: true, liveAdmissionRequired: false, userDifferentialRequired: false },
  TERRAIN_OR_GEOMETRY_CHANGE: { requiredTools: ['TERRAIN_INTELLIGENCE_AND_PERCEPTUAL_WORKBENCH', 'FD_05_DIAGNOSTIC_AUTHORITY', 'RUN_8E_R1_PROFILER', 'H_EARTH_GAUGES'], requiredAuthorities: ['SOURCE_AUTHORITY', 'RUNTIME_AUTHORITY', 'DEVICE_BEHAVIOR_AUTHORITY'], candidateAssemblerRequired: true, liveAdmissionRequired: true, userDifferentialRequired: true },
  RENDERER_CHANGE: { requiredTools: ['H_EARTH_GAUGES', 'FD_05_DIAGNOSTIC_AUTHORITY', 'RUN_8E_R1_PROFILER', 'TERRAIN_INTELLIGENCE_AND_PERCEPTUAL_WORKBENCH'], requiredAuthorities: ['SOURCE_AUTHORITY', 'RUNTIME_AUTHORITY', 'DEVICE_BEHAVIOR_AUTHORITY'], candidateAssemblerRequired: true, liveAdmissionRequired: true, userDifferentialRequired: true },
  MATERIAL_OR_LIGHTING_CHANGE: { requiredTools: ['TERRAIN_INTELLIGENCE_AND_PERCEPTUAL_WORKBENCH', 'FD_05_DIAGNOSTIC_AUTHORITY', 'RUN_8E_R1_PROFILER', 'H_EARTH_GAUGES'], requiredAuthorities: ['SOURCE_AUTHORITY', 'RUNTIME_AUTHORITY', 'PRODUCT_ACCEPTANCE_AUTHORITY'], candidateAssemblerRequired: true, liveAdmissionRequired: true, userDifferentialRequired: true },
  NAVIGATION_OR_INPUT_CHANGE: { requiredTools: ['RUN_8E_R1_PROFILER', 'FD_05_DIAGNOSTIC_AUTHORITY', 'H_EARTH_GAUGES'], requiredAuthorities: ['SOURCE_AUTHORITY', 'RUNTIME_AUTHORITY', 'DEVICE_BEHAVIOR_AUTHORITY'], candidateAssemblerRequired: true, liveAdmissionRequired: true, userDifferentialRequired: true },
  LIVE_BINDING_CHANGE: { requiredTools: ['H_EARTH_GAUGES', 'FD_05_DIAGNOSTIC_AUTHORITY'], requiredAuthorities: ['SOURCE_AUTHORITY', 'RUNTIME_AUTHORITY', 'PUBLIC_STATE_AUTHORITY'], candidateAssemblerRequired: true, liveAdmissionRequired: true, userDifferentialRequired: true },
  PUBLIC_ROUTE_CHANGE: { requiredTools: ['H_EARTH_GAUGES', 'FD_05_DIAGNOSTIC_AUTHORITY'], requiredAuthorities: ['SOURCE_AUTHORITY', 'RUNTIME_AUTHORITY', 'PUBLIC_STATE_AUTHORITY'], candidateAssemblerRequired: true, liveAdmissionRequired: true, userDifferentialRequired: true },
  EVIDENCE_ONLY_OPERATION: { requiredTools: [], requiredAuthorities: ['DIAGNOSTIC_ONLY'], candidateAssemblerRequired: false, liveAdmissionRequired: false, userDifferentialRequired: false },
  USER_PERCEPTUAL_COMPARISON: { requiredTools: ['TERRAIN_INTELLIGENCE_AND_PERCEPTUAL_WORKBENCH', 'FD_05_DIAGNOSTIC_AUTHORITY'], requiredAuthorities: ['DIAGNOSTIC_ONLY', 'PRODUCT_ACCEPTANCE_AUTHORITY'], candidateAssemblerRequired: false, liveAdmissionRequired: false, userDifferentialRequired: true, automaticCandidateConstruction: false },
  DEFAULT_PROMOTION: { requiredTools: ['H_EARTH_GAUGES', 'FD_05_DIAGNOSTIC_AUTHORITY'], requiredAuthorities: ['PRODUCT_ACCEPTANCE_AUTHORITY', 'PUBLIC_DEFAULT_AUTHORITY'], candidateAssemblerRequired: false, liveAdmissionRequired: false, userDifferentialRequired: true, acceptedCandidateRequired: true }
};

export function routeChangeClass(changeClass) {
  if (!CHANGE_CLASSES.includes(changeClass)) throw new Error(`CHANGE_CLASS_UNKNOWN:${changeClass}`);
  return deepFreeze({ changeClass, ...routes[changeClass] });
}

export const H_EARTH_CHANGE_CLASS_ROUTER = deepFreeze({ schemaVersion: 'H_EARTH_CHANGE_CLASS_ROUTER_v1', changeClasses: CHANGE_CLASSES, routes });
export default H_EARTH_CHANGE_CLASS_ROUTER;
