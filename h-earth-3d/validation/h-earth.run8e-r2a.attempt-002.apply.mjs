import fs from 'node:fs';

const sourcePath = 'showroom/globe/h-earth/render/live-render-package.run8e-r2.js';
const validationPath = 'h-earth-3d/validation/h-earth.run8e-r2.immutable-live-render-package.validation.mjs';

let source = fs.readFileSync(sourcePath, 'utf8');
let validation = fs.readFileSync(validationPath, 'utf8');
let changed = false;

function replaceOnce(text, search, replacement, code) {
  if (!text.includes(search)) throw new Error(code);
  return text.replace(search, replacement);
}

const importAnchor =
  "import { H_EARTH_SURFACE_CLASSES } from '../../../../h-earth-3d/environment/h-earth.surface-state-field.js';\n";
const importAddition = importAnchor +
  "import { H_EARTH_FUNCTIONAL_LANDSCAPE_RENDERER_CONTRACT_ID } from './renderer.functional-landscape.js';\n";
if (!source.includes('H_EARTH_FUNCTIONAL_LANDSCAPE_RENDERER_CONTRACT_ID')) {
  source = replaceOnce(source, importAnchor, importAddition, 'R2A_IMPORT_ANCHOR_NOT_FOUND');
  changed = true;
}

const oldMaterialBlock = String.raw`function vegetationRgba(primitive) {
  const intent = String(primitive?.materialHint?.materialIntent ?? '');
  if (intent.includes('TRUNK') || intent.includes('WOODY')) return [89, 63, 39, 255];
  if (intent.includes('CONIFER')) return [38, 73, 48, 255];
  if (intent.includes('SHRUB')) return [52, 94, 52, 255];
  return [78, 126, 65, 255];
}

function resolvePrimitiveRgba(primitive, role, issues) {
  if (role === 'VEGETATION') return vegetationRgba(primitive);
  const rgba = primitive?.renderMaterial?.rgba;
  if (!Array.isArray(rgba) || rgba.length !== 4 || rgba.some((channel) => !finite(channel))) {
    issues.push(\`R2_PRIMITIVE_RGBA_MISSING:${primitive.primitiveId}\`);
    return [0, 0, 0, 255];
  }
  return rgba;
}

function resolveTransparencyClass(primitive) {
  const value = primitive?.renderMaterial?.transparencyClass;
  return typeof value === 'string' && value.length > 0 ? value : 'OPAQUE';
}
`;

const newMaterialBlock = String.raw`function vegetationRgba(primitive) {
  const intent = String(primitive?.materialHint?.materialIntent ?? '');
  if (intent.includes('TRUNK') || intent.includes('WOODY')) return [89, 63, 39, 255];
  if (intent.includes('CONIFER')) return [38, 73, 48, 255];
  if (intent.includes('SHRUB')) return [52, 94, 52, 255];
  return [78, 126, 65, 255];
}

function functionalLandscapeMaterialDefaults(primitive) {
  const intent = primitive?.materialHint?.materialIntent ??
    primitive?.materialHint?.materialReference ?? 'DEFAULT';
  if (String(intent).includes('WATER')) {
    return { rgba: [46, 118, 144, 210], transparencyClass: 'TRANSLUCENT' };
  }
  if (String(intent).includes('FOAM')) {
    return { rgba: [232, 242, 235, 190], transparencyClass: 'TRANSLUCENT' };
  }
  if (String(intent).includes('HIGHLAND') || String(intent).includes('DISTANT')) {
    return { rgba: [68, 83, 79, 255], transparencyClass: 'OPAQUE' };
  }
  return { rgba: [116, 103, 73, 255], transparencyClass: 'OPAQUE' };
}

function resolvePrimitiveMaterialProjection(primitive, role, issues) {
  const materialReference = primitive?.materialHint?.materialReference ?? null;
  const materialIntent = primitive?.materialHint?.materialIntent ?? null;
  if (role === 'VEGETATION') {
    return {
      rgba: vegetationRgba(primitive),
      transparencyClass: 'OPAQUE',
      materialReference,
      materialIntent,
      sourceAuthorityContractId: 'H_EARTH_RUN_8E_SUCCESSOR_ENVIRONMENT_FRAME_AND_RENDER_INTEGRATION_v1',
      projectionModel: 'EXISTING_RUN_8E_VEGETATION_COLOR_PROJECTION'
    };
  }
  const directRgba = primitive?.renderMaterial?.rgba;
  if (Array.isArray(directRgba) && directRgba.length === 4 && directRgba.every(finite)) {
    const directTransparency = primitive?.renderMaterial?.transparencyClass;
    return {
      rgba: [...directRgba],
      transparencyClass: typeof directTransparency === 'string' && directTransparency.length > 0
        ? directTransparency : 'OPAQUE',
      materialReference,
      materialIntent,
      sourceAuthorityContractId: 'DIRECT_PRIMITIVE_RENDER_MATERIAL',
      projectionModel: 'DIRECT_PRIMITIVE_RENDER_MATERIAL'
    };
  }
  if (role === 'SHORELINE' && (materialReference || materialIntent)) {
    return {
      ...functionalLandscapeMaterialDefaults(primitive),
      materialReference,
      materialIntent,
      sourceAuthorityContractId: H_EARTH_FUNCTIONAL_LANDSCAPE_RENDERER_CONTRACT_ID,
      projectionModel: 'EXACT_RUN_6D_MATERIAL_DEFAULTS'
    };
  }
  issues.push(\`R2_PRIMITIVE_MATERIAL_PROJECTION_MISSING:${primitive.primitiveId}\`);
  return {
    rgba: [0, 0, 0, 255],
    transparencyClass: 'OPAQUE',
    materialReference,
    materialIntent,
    sourceAuthorityContractId: null,
    projectionModel: 'REJECTED'
  };
}
`;

if (source.includes('function resolvePrimitiveRgba')) {
  source = replaceOnce(source, oldMaterialBlock, newMaterialBlock, 'R2A_MATERIAL_BLOCK_ANCHOR_NOT_FOUND');
  changed = true;
}

const oldLoop =
  "    const rgba = role === 'TERRAIN' ? null : resolvePrimitiveRgba(primitive, role, issues);\n" +
  "    const transparencyClass = resolveTransparencyClass(primitive);\n";
const newLoop =
  "    const primitiveMaterial = role === 'TERRAIN' ? null : resolvePrimitiveMaterialProjection(primitive, role, issues);\n" +
  "    const rgba = primitiveMaterial?.rgba ?? null;\n" +
  "    const transparencyClass = primitiveMaterial?.transparencyClass ?? 'OPAQUE';\n";
if (source.includes(oldLoop)) {
  source = source.replace(oldLoop, newLoop);
  changed = true;
} else if (!source.includes('resolvePrimitiveMaterialProjection(primitive, role, issues)')) {
  throw new Error('R2A_LOOP_ANCHOR_NOT_FOUND');
}

const spanAnchor =
  "      normalSource: resolvedNormals.source,\n" +
  "      vertexStart: vertexOffset,\n";
const spanReplacement =
  "      normalSource: resolvedNormals.source,\n" +
  "      materialReference: primitiveMaterial?.materialReference ?? null,\n" +
  "      materialIntent: primitiveMaterial?.materialIntent ?? null,\n" +
  "      materialProjectionAuthorityContractId: primitiveMaterial?.sourceAuthorityContractId ?? null,\n" +
  "      materialProjectionModel: primitiveMaterial?.projectionModel ?? null,\n" +
  "      vertexStart: vertexOffset,\n";
if (!source.includes('materialProjectionAuthorityContractId')) {
  source = replaceOnce(source, spanAnchor, spanReplacement, 'R2A_SPAN_ANCHOR_NOT_FOUND');
  changed = true;
}

const authorityAnchor =
  "      run8CMaterialContractId: H_EARTH_RUN_8C_SUCCESSOR_SURFACE_MATERIAL_CONTRACT_ID,\n" +
  "      atmosphereContractId: H_EARTH_ATMOSPHERE_STATE_CONTRACT_ID,\n";
const authorityReplacement =
  "      run8CMaterialContractId: H_EARTH_RUN_8C_SUCCESSOR_SURFACE_MATERIAL_CONTRACT_ID,\n" +
  "      functionalLandscapeRendererContractId: H_EARTH_FUNCTIONAL_LANDSCAPE_RENDERER_CONTRACT_ID,\n" +
  "      atmosphereContractId: H_EARTH_ATMOSPHERE_STATE_CONTRACT_ID,\n";
if (!source.includes('functionalLandscapeRendererContractId:')) {
  source = replaceOnce(source, authorityAnchor, authorityReplacement, 'R2A_AUTHORITY_ANCHOR_NOT_FOUND');
  changed = true;
}

const validationImport =
  "import { H_EARTH_FUNCTIONAL_LANDSCAPE_RENDERER_CONTRACT_ID } from '../../showroom/globe/h-earth/render/renderer.functional-landscape.js';\n";
const validationAnchor =
  "} from '../../showroom/globe/h-earth/render/live-render-package.run8e-r2.js';\n";
if (!validation.includes('renderer.functional-landscape.js')) {
  validation = replaceOnce(
    validation,
    validationAnchor,
    validationAnchor + validationImport,
    'R2A_VALIDATION_IMPORT_ANCHOR_NOT_FOUND'
  );
  changed = true;
}

const validationAssertionAnchor = "assert.equal(cachedA.roleCounts.VEGETATION, 27);\n";
const validationAssertions = String.raw`assert.equal(cachedA.roleCounts.VEGETATION, 27);
const shorelineSpans = cachedA.primitiveSpans.filter((span) => span.role === 'SHORELINE');
assert.equal(shorelineSpans.length, 7, 'R2A_SHORELINE_SPAN_COUNT_INVALID');
assert.equal(shorelineSpans.every((span) =>
  span.materialProjectionAuthorityContractId === H_EARTH_FUNCTIONAL_LANDSCAPE_RENDERER_CONTRACT_ID &&
  span.materialProjectionModel === 'EXACT_RUN_6D_MATERIAL_DEFAULTS' &&
  typeof span.materialReference === 'string' && span.materialReference.length > 0 &&
  typeof span.materialIntent === 'string' && span.materialIntent.length > 0), true,
'R2A_SHORELINE_MATERIAL_AUTHORITY_NOT_PRESERVED');
assert.equal(shorelineSpans.filter((span) => span.transparencyClass === 'TRANSLUCENT').length, 4,
  'R2A_SHORELINE_TRANSLUCENT_RANGE_COUNT_INVALID');
assert.equal(shorelineSpans.filter((span) => span.transparencyClass === 'OPAQUE').length, 3,
  'R2A_SHORELINE_OPAQUE_RANGE_COUNT_INVALID');
`;
if (!validation.includes('R2A_SHORELINE_MATERIAL_AUTHORITY_NOT_PRESERVED')) {
  validation = replaceOnce(
    validation,
    validationAssertionAnchor,
    validationAssertions,
    'R2A_VALIDATION_ASSERT_ANCHOR_NOT_FOUND'
  );
  changed = true;
}

if (changed) {
  fs.writeFileSync(sourcePath, source);
  fs.writeFileSync(validationPath, validation);
}

console.log(JSON.stringify({
  status: changed ? 'R2A_ATTEMPT_002_CORRECTION_APPLIED' : 'R2A_ATTEMPT_002_CORRECTION_ALREADY_PRESENT',
  changed
}));
