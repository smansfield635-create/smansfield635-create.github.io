import { createHash } from 'node:crypto';

export const ENGINE_ID = 'DETERMINISTIC_COORDINATE_EMBEDDING_ENGINE_v1';
export const STATE_SPACE_ID = 'CANONICAL_DELIVERY_INFORMATION_STATE_SPACE_v1';
export const ATLAS_ID = 'SYSTEM_COORDINATE_ATLAS_v1';
export const SEPARATION_LAW = 'COORDINATE_TRANSITION_NE_PROJECTION_NE_PRESENTATION';

export const FROZEN_SCIENTIFIC_INPUTS = Object.freeze({
  head: 'd39d9f110ed7fe16109ddcb5b8043b3752c1a36e',
  scientificStateDigest: 'dde02e9b56c157caf7e6bf511067089c6bb65c068731883efd610f6722fcb0a5',
  relationGraphDigest: '4dabc8872082535d01d9bfae3cd9661be68dcf7e1cd6aed5280a9028d4b8137b',
  projectionGraphDigest: '9ebef4a6b8102ffd251c8e7809d379bff560d09fe9c75baa3f707768927b6ce8'
});

const REQUIRED_DELIVERY_FIELDS = Object.freeze([
  'deliveryStateId',
  'sourceObjectIdentityRef',
  'contextFrameId',
  'destinationRef',
  'familyDescriptorRef',
  'typedRelationRefs',
  'recursiveDepth',
  'ancestorLineage',
  'evidenceStandingRef',
  'claimCeilingRef',
  'scientificStateRef',
  'sourceAuthorityRef',
  'sourceRecordDigests',
  'temporalDescriptorRef',
  'disclosureStateRef',
  'continuityStateRef',
  'canonicalPresenceState'
]);

const FORBIDDEN_CANONICAL_FIELDS = Object.freeze([
  'systemCoordinateVector',
  'x',
  'y',
  'z',
  'cameraPosition',
  'renderStyle',
  'visualProminence',
  'euclideanScientificDistance',
  'systemSpecificStateSigma'
]);

const REQUIRED_CHART_FIELDS = Object.freeze([
  'chartId',
  'chartVersion',
  'systemId',
  'canonicalDomainDeclaration',
  'codomainDimension',
  'representedDimensions',
  'coordinateSemantics',
  'recoverabilityClass',
  'metricPolicy',
  'topologyPolicy',
  'overlapDeclarations',
  'authorityBasis',
  'chartDigest'
]);

const REQUIRED_DIMENSION_FIELDS = Object.freeze([
  'dimensionId',
  'dimensionIndex',
  'label',
  'semanticClass',
  'sourceDeliveryFieldRefs',
  'valueDomain',
  'normalizationRule',
  'distanceParticipation',
  'authorityBasis'
]);

const PERMITTED_SEMANTIC_CLASSES = new Set([
  'SCALAR',
  'ORDINAL_NUMERIC',
  'TEMPORAL_NUMERIC',
  'TOPOLOGICAL_COORDINATE',
  'INDEX_COORDINATE',
  'EMBEDDING_ONLY'
]);

const PERMITTED_NORMALIZATION_RULES = new Set([
  'IDENTITY_NUMERIC',
  'AFFINE_NUMERIC',
  'DECLARED_LOOKUP',
  'ORDINAL_RANK',
  'BOOLEAN_BINARY',
  'ISO_UTC_EPOCH_SECONDS'
]);

const SCIENTIFIC_REWRITE_KEYS = new Set([
  'scientificClaimRewrite',
  'typedRelationRewrite',
  'evidenceStandingRewrite',
  'claimCeilingRewrite',
  'sourceAuthorityRewrite',
  'canonicalIdentityRewrite',
  'scientificStateRewrite'
]);

const DOWNSTREAM_OPERATION_KEYS = new Set([
  'projectionPolicy',
  'projectionRuntime',
  'projectionState',
  'presentationStyle',
  'presentationRuntime',
  'presentationState',
  'coordinateTransition',
  'coordinateTransitionRuntime',
  'renderer',
  'cameraState'
]);

export class CoordinateEmbeddingError extends Error {
  constructor(code, detail = '') {
    super(detail ? `${code}: ${detail}` : code);
    this.name = 'CoordinateEmbeddingError';
    this.code = code;
  }
}

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value));
}

function canonicalJson(value) {
  if (value === null) return 'null';
  if (typeof value === 'string' || typeof value === 'boolean') return JSON.stringify(value);
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) throw new CoordinateEmbeddingError('NON_NUMERIC_COORDINATE_VALUE', 'non-finite number in canonical JSON');
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(',')}]`;
  if (isPlainObject(value)) {
    const keys = Object.keys(value).sort();
    return `{${keys.map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`).join(',')}}`;
  }
  throw new CoordinateEmbeddingError('UNDECLARED_COORDINATE_SEMANTIC', `unsupported JSON value type ${typeof value}`);
}

export function sha256Canonical(value) {
  return createHash('sha256').update(canonicalJson(value)).digest('hex');
}

function deepEqualJson(a, b) {
  return canonicalJson(a) === canonicalJson(b);
}

function requireObject(value, code, detail) {
  if (!isPlainObject(value)) throw new CoordinateEmbeddingError(code, detail);
}

function requireField(object, field, code) {
  if (!Object.prototype.hasOwnProperty.call(object, field)) {
    throw new CoordinateEmbeddingError(code, field);
  }
}

function getPath(object, fieldRef) {
  if (typeof fieldRef !== 'string' || fieldRef.length === 0) {
    throw new CoordinateEmbeddingError('UNDECLARED_COORDINATE_SEMANTIC', 'invalid sourceDeliveryFieldRef');
  }
  let current = object;
  for (const segment of fieldRef.split('.')) {
    if (current === null || typeof current !== 'object' || !Object.prototype.hasOwnProperty.call(current, segment)) {
      throw new CoordinateEmbeddingError('REQUIRED_DELIVERY_FIELD_MISSING', fieldRef);
    }
    current = current[segment];
  }
  return current;
}

function scanForbiddenChartKeys(value, path = '$') {
  if (Array.isArray(value)) {
    value.forEach((item, index) => scanForbiddenChartKeys(item, `${path}[${index}]`));
    return;
  }
  if (!isPlainObject(value)) return;
  for (const [key, child] of Object.entries(value)) {
    if (SCIENTIFIC_REWRITE_KEYS.has(key)) {
      throw new CoordinateEmbeddingError('SCIENTIFIC_REWRITE_FIELD_PROHIBITED', `${path}.${key}`);
    }
    if (DOWNSTREAM_OPERATION_KEYS.has(key)) {
      throw new CoordinateEmbeddingError('DOWNSTREAM_OPERATION_FIELD_PROHIBITED_IN_CHART', `${path}.${key}`);
    }
    scanForbiddenChartKeys(child, `${path}.${key}`);
  }
}

export function assertCanonicalDeliveryState(state) {
  requireObject(state, 'MISSING_CANONICAL_DELIVERY_FIELD', 'delivery state must be an object');
  for (const field of REQUIRED_DELIVERY_FIELDS) requireField(state, field, 'MISSING_CANONICAL_DELIVERY_FIELD');
  for (const field of FORBIDDEN_CANONICAL_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(state, field)) {
      throw new CoordinateEmbeddingError('SYSTEM_COORDINATE_IN_CANONICAL_STATE', field);
    }
  }
  if (state.canonicalPresenceState !== 'PRESENT_IN_CANONICAL_STATE') {
    if (state.canonicalPresenceState === 'ABSENT_FROM_CANONICAL_STATE') {
      throw new CoordinateEmbeddingError('CANONICAL_STATE_ABSENT');
    }
    throw new CoordinateEmbeddingError('MISSING_CANONICAL_DELIVERY_FIELD', 'canonicalPresenceState');
  }
  return true;
}

export function canonicalInvariantDigest(state) {
  assertCanonicalDeliveryState(state);
  return sha256Canonical({
    IDENTITY: state.sourceObjectIdentityRef,
    SOURCE_AUTHORITY: state.sourceAuthorityRef,
    LINEAGE: state.ancestorLineage,
    TYPED_RELATIONS: state.typedRelationRefs,
    EVIDENCE_STANDING: state.evidenceStandingRef,
    CLAIM_CEILING: state.claimCeilingRef,
    SCIENTIFIC_STATE: state.scientificStateRef
  });
}

export function deriveChartDigest(chart) {
  requireObject(chart, 'MISSING_CHART_FIELD', 'chart must be an object');
  const digestable = cloneJson(chart);
  delete digestable.chartDigest;
  return sha256Canonical(digestable);
}

function validateMetricPolicy(metricPolicy) {
  requireObject(metricPolicy, 'UNDECLARED_DISTANCE_MEANING', 'metricPolicy');
  requireField(metricPolicy, 'distanceMeaning', 'UNDECLARED_DISTANCE_MEANING');
  if (metricPolicy.distanceMeaning !== 'NONE') {
    for (const field of ['metricId', 'semanticScope', 'domainScope']) {
      if (!metricPolicy[field]) throw new CoordinateEmbeddingError('UNDECLARED_DISTANCE_MEANING', field);
    }
  }
}

function validateTopologyPolicy(topologyPolicy) {
  requireObject(topologyPolicy, 'UNDECLARED_NEIGHBORHOOD_MEANING', 'topologyPolicy');
  requireField(topologyPolicy, 'neighborhoodMeaning', 'UNDECLARED_NEIGHBORHOOD_MEANING');
  if (topologyPolicy.neighborhoodMeaning !== 'NONE') {
    for (const field of ['topologyId', 'semanticScope', 'domainScope']) {
      if (!topologyPolicy[field]) throw new CoordinateEmbeddingError('UNDECLARED_NEIGHBORHOOD_MEANING', field);
    }
  }
}

function validateNormalizationRule(dimension) {
  requireObject(dimension.normalizationRule, 'UNDECLARED_COORDINATE_SEMANTIC', `${dimension.dimensionId}.normalizationRule`);
  const type = dimension.normalizationRule.type;
  if (!PERMITTED_NORMALIZATION_RULES.has(type)) {
    throw new CoordinateEmbeddingError('UNSUPPORTED_NORMALIZATION_RULE', String(type));
  }
  if (!Array.isArray(dimension.sourceDeliveryFieldRefs) || dimension.sourceDeliveryFieldRefs.length !== 1) {
    throw new CoordinateEmbeddingError('UNDECLARED_COORDINATE_SEMANTIC', `${dimension.dimensionId} requires exactly one sourceDeliveryFieldRef in v1`);
  }
}

export function compileChart(chartInput) {
  const before = canonicalJson(chartInput);
  requireObject(chartInput, 'MISSING_CHART_FIELD', 'chart');
  for (const field of REQUIRED_CHART_FIELDS) requireField(chartInput, field, 'MISSING_CHART_FIELD');
  scanForbiddenChartKeys(chartInput);

  if (!Number.isInteger(chartInput.codomainDimension) || chartInput.codomainDimension <= 0) {
    throw new CoordinateEmbeddingError('UNDECLARED_CHART_DIMENSION', 'codomainDimension');
  }
  if (!Array.isArray(chartInput.representedDimensions) || chartInput.representedDimensions.length !== chartInput.codomainDimension) {
    throw new CoordinateEmbeddingError('UNDECLARED_CHART_DIMENSION', 'representedDimensions');
  }
  if (new Set(chartInput.representedDimensions).size !== chartInput.representedDimensions.length) {
    throw new CoordinateEmbeddingError('UNDECLARED_CHART_DIMENSION', 'duplicate represented dimension');
  }
  if (!Array.isArray(chartInput.coordinateSemantics) || chartInput.coordinateSemantics.length !== chartInput.codomainDimension) {
    throw new CoordinateEmbeddingError('UNDECLARED_COORDINATE_SEMANTIC', 'coordinateSemantics');
  }
  if (chartInput.recoverabilityClass !== 'EXACT_COORDINATE_CHART') {
    throw new CoordinateEmbeddingError('NONINVERTIBLE_REPRESENTATION_NOT_ADMISSIBLE_AS_COORDINATE_CHART');
  }
  if (!Array.isArray(chartInput.overlapDeclarations)) {
    throw new CoordinateEmbeddingError('MISSING_CHART_FIELD', 'overlapDeclarations');
  }
  if (!chartInput.authorityBasis) throw new CoordinateEmbeddingError('MISSING_CHART_FIELD', 'authorityBasis');

  validateMetricPolicy(chartInput.metricPolicy);
  validateTopologyPolicy(chartInput.topologyPolicy);

  const dimensions = chartInput.coordinateSemantics.map((dimension) => {
    requireObject(dimension, 'UNDECLARED_COORDINATE_SEMANTIC', 'dimension');
    for (const field of REQUIRED_DIMENSION_FIELDS) requireField(dimension, field, 'UNDECLARED_COORDINATE_SEMANTIC');
    if (!PERMITTED_SEMANTIC_CLASSES.has(dimension.semanticClass)) {
      throw new CoordinateEmbeddingError('UNDECLARED_COORDINATE_SEMANTIC', `${dimension.dimensionId}.semanticClass`);
    }
    if (!Number.isInteger(dimension.dimensionIndex)) {
      throw new CoordinateEmbeddingError('UNDECLARED_CHART_DIMENSION', `${dimension.dimensionId}.dimensionIndex`);
    }
    validateNormalizationRule(dimension);
    return cloneJson(dimension);
  });

  const indices = dimensions.map((d) => d.dimensionIndex);
  if (new Set(indices).size !== indices.length) {
    throw new CoordinateEmbeddingError('DUPLICATE_CHART_DIMENSION_INDEX');
  }
  const sorted = [...dimensions].sort((a, b) => a.dimensionIndex - b.dimensionIndex);
  for (let index = 0; index < sorted.length; index += 1) {
    if (sorted[index].dimensionIndex !== index) {
      throw new CoordinateEmbeddingError('NONCONTIGUOUS_CHART_DIMENSION_INDEX');
    }
  }
  const sortedIds = sorted.map((d) => d.dimensionId);
  if (!deepEqualJson(sortedIds, chartInput.representedDimensions)) {
    throw new CoordinateEmbeddingError('REPRESENTED_DIMENSION_ORDER_MISMATCH');
  }

  const compiled = cloneJson(chartInput);
  compiled.coordinateSemantics = sorted;
  const derivedDigest = deriveChartDigest(compiled);
  if (compiled.chartDigest !== 'AUTO_DERIVE' && compiled.chartDigest !== derivedDigest) {
    throw new CoordinateEmbeddingError('CHART_DIGEST_MISMATCH');
  }
  compiled.chartDigest = derivedDigest;

  if (canonicalJson(chartInput) !== before) throw new CoordinateEmbeddingError('CHART_INPUT_MUTATION');
  return compiled;
}

function evaluateDomainDeclaration(declaration, state) {
  requireObject(declaration, 'CHART_DOMAIN_DECLARATION_INVALID', 'canonicalDomainDeclaration');
  switch (declaration.type) {
    case 'ALL_ADMITTED_DELIVERY_STATES':
      return true;
    case 'FIELD_EQUALS':
      if (typeof declaration.fieldRef !== 'string' || !Object.prototype.hasOwnProperty.call(declaration, 'value')) {
        throw new CoordinateEmbeddingError('CHART_DOMAIN_DECLARATION_INVALID', 'FIELD_EQUALS');
      }
      return deepEqualJson(getPath(state, declaration.fieldRef), declaration.value);
    case 'FIELD_IN':
      if (typeof declaration.fieldRef !== 'string' || !Array.isArray(declaration.values)) {
        throw new CoordinateEmbeddingError('CHART_DOMAIN_DECLARATION_INVALID', 'FIELD_IN');
      }
      return declaration.values.some((value) => deepEqualJson(getPath(state, declaration.fieldRef), value));
    case 'AND':
      if (!Array.isArray(declaration.clauses) || declaration.clauses.length === 0) {
        throw new CoordinateEmbeddingError('CHART_DOMAIN_DECLARATION_INVALID', 'AND');
      }
      return declaration.clauses.every((clause) => evaluateDomainDeclaration(clause, state));
    case 'OR':
      if (!Array.isArray(declaration.clauses) || declaration.clauses.length === 0) {
        throw new CoordinateEmbeddingError('CHART_DOMAIN_DECLARATION_INVALID', 'OR');
      }
      return declaration.clauses.some((clause) => evaluateDomainDeclaration(clause, state));
    default:
      throw new CoordinateEmbeddingError('CHART_DOMAIN_DECLARATION_INVALID', String(declaration.type));
  }
}

function requireFiniteNumber(value, detail) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new CoordinateEmbeddingError('NON_NUMERIC_COORDINATE_VALUE', detail);
  }
  return value;
}

function requireUniqueJsonValues(values, code, detail) {
  const keys = values.map((value) => canonicalJson(value));
  if (new Set(keys).size !== keys.length) throw new CoordinateEmbeddingError(code, detail);
}

function normalizeDimension(dimension, state) {
  const sourceRef = dimension.sourceDeliveryFieldRefs[0];
  const source = getPath(state, sourceRef);
  const rule = dimension.normalizationRule;
  let coordinate;

  switch (rule.type) {
    case 'IDENTITY_NUMERIC':
      coordinate = requireFiniteNumber(source, dimension.dimensionId);
      break;
    case 'AFFINE_NUMERIC': {
      const numeric = requireFiniteNumber(source, dimension.dimensionId);
      const scale = requireFiniteNumber(rule.scale, `${dimension.dimensionId}.scale`);
      const offset = requireFiniteNumber(rule.offset, `${dimension.dimensionId}.offset`);
      if (scale === 0) throw new CoordinateEmbeddingError('COORDINATE_VALUE_OUTSIDE_DECLARED_DOMAIN', `${dimension.dimensionId}.scale`);
      coordinate = numeric * scale + offset;
      break;
    }
    case 'DECLARED_LOOKUP': {
      if (!Array.isArray(rule.entries) || rule.entries.length === 0) {
        throw new CoordinateEmbeddingError('UNDECLARED_COORDINATE_SEMANTIC', `${dimension.dimensionId}.entries`);
      }
      requireUniqueJsonValues(rule.entries.map((entry) => entry.value), 'UNDECLARED_COORDINATE_SEMANTIC', `${dimension.dimensionId}.duplicate source lookup value`);
      const coordinates = rule.entries.map((entry) => requireFiniteNumber(entry.coordinate, `${dimension.dimensionId}.lookup coordinate`));
      if (new Set(coordinates).size !== coordinates.length) {
        throw new CoordinateEmbeddingError('COORDINATE_VALUE_OUTSIDE_DECLARED_DOMAIN', `${dimension.dimensionId}.noninjective lookup`);
      }
      const match = rule.entries.find((entry) => deepEqualJson(entry.value, source));
      if (!match) throw new CoordinateEmbeddingError('COORDINATE_VALUE_OUTSIDE_DECLARED_DOMAIN', dimension.dimensionId);
      coordinate = match.coordinate;
      break;
    }
    case 'ORDINAL_RANK': {
      if (!Array.isArray(rule.order) || rule.order.length === 0) {
        throw new CoordinateEmbeddingError('UNDECLARED_COORDINATE_SEMANTIC', `${dimension.dimensionId}.order`);
      }
      requireUniqueJsonValues(rule.order, 'UNDECLARED_COORDINATE_SEMANTIC', `${dimension.dimensionId}.duplicate ordinal value`);
      const index = rule.order.findIndex((value) => deepEqualJson(value, source));
      if (index < 0) throw new CoordinateEmbeddingError('COORDINATE_VALUE_OUTSIDE_DECLARED_DOMAIN', dimension.dimensionId);
      const start = rule.start === undefined ? 0 : requireFiniteNumber(rule.start, `${dimension.dimensionId}.start`);
      const step = rule.step === undefined ? 1 : requireFiniteNumber(rule.step, `${dimension.dimensionId}.step`);
      if (step === 0) throw new CoordinateEmbeddingError('COORDINATE_VALUE_OUTSIDE_DECLARED_DOMAIN', `${dimension.dimensionId}.step`);
      coordinate = start + index * step;
      break;
    }
    case 'BOOLEAN_BINARY': {
      if (typeof source !== 'boolean') throw new CoordinateEmbeddingError('COORDINATE_VALUE_OUTSIDE_DECLARED_DOMAIN', dimension.dimensionId);
      const falseValue = rule.falseValue === undefined ? 0 : requireFiniteNumber(rule.falseValue, `${dimension.dimensionId}.falseValue`);
      const trueValue = rule.trueValue === undefined ? 1 : requireFiniteNumber(rule.trueValue, `${dimension.dimensionId}.trueValue`);
      if (falseValue === trueValue) throw new CoordinateEmbeddingError('COORDINATE_VALUE_OUTSIDE_DECLARED_DOMAIN', `${dimension.dimensionId}.noninjective boolean mapping`);
      coordinate = source ? trueValue : falseValue;
      break;
    }
    case 'ISO_UTC_EPOCH_SECONDS': {
      if (typeof source !== 'string') throw new CoordinateEmbeddingError('COORDINATE_VALUE_OUTSIDE_DECLARED_DOMAIN', dimension.dimensionId);
      const milliseconds = Date.parse(source);
      if (!Number.isFinite(milliseconds) || new Date(milliseconds).toISOString() !== source) {
        throw new CoordinateEmbeddingError('COORDINATE_VALUE_OUTSIDE_DECLARED_DOMAIN', dimension.dimensionId);
      }
      coordinate = milliseconds / 1000;
      break;
    }
    default:
      throw new CoordinateEmbeddingError('UNSUPPORTED_NORMALIZATION_RULE', String(rule.type));
  }

  requireFiniteNumber(coordinate, dimension.dimensionId);
  return coordinate;
}

function buildNonrepresentableDisposition(state, chart) {
  const disposition = {
    representationState: 'NOT_REPRESENTABLE_IN_SELECTED_CHART',
    sourceDeliveryStateId: state.deliveryStateId,
    chartId: chart.chartId,
    chartVersion: chart.chartVersion,
    systemId: chart.systemId,
    canonicalInvariantDigest: canonicalInvariantDigest(state),
    chartDigest: chart.chartDigest,
    canonicalAbsence: false,
    projectionHidden: false
  };
  disposition.dispositionDigest = sha256Canonical(disposition);
  return disposition;
}

export function embedCoordinateState(stateInput, chartInput) {
  const stateBefore = canonicalJson(stateInput);
  const chartBefore = canonicalJson(chartInput);
  assertCanonicalDeliveryState(stateInput);
  const chart = compileChart(chartInput);

  if (!evaluateDomainDeclaration(chart.canonicalDomainDeclaration, stateInput)) {
    const disposition = buildNonrepresentableDisposition(stateInput, chart);
    if (canonicalJson(stateInput) !== stateBefore) throw new CoordinateEmbeddingError('SOURCE_STATE_MUTATION');
    if (canonicalJson(chartInput) !== chartBefore) throw new CoordinateEmbeddingError('CHART_INPUT_MUTATION');
    return disposition;
  }

  const coordinateVector = chart.coordinateSemantics.map((dimension) => normalizeDimension(dimension, stateInput));
  const base = {
    sourceDeliveryStateId: stateInput.deliveryStateId,
    chartId: chart.chartId,
    chartVersion: chart.chartVersion,
    systemId: chart.systemId,
    coordinateVector,
    representedDimensionIds: [...chart.representedDimensions],
    systemSpecificStateSigma: {},
    canonicalInvariantDigest: canonicalInvariantDigest(stateInput),
    chartDigest: chart.chartDigest
  };
  const stateSeed = sha256Canonical(base);
  const record = {
    coordinateStateId: `CSTATE_${stateSeed.slice(0, 24)}`,
    ...base
  };
  record.coordinateStateDigest = sha256Canonical(record);

  if (canonicalJson(stateInput) !== stateBefore) throw new CoordinateEmbeddingError('SOURCE_STATE_MUTATION');
  if (canonicalJson(chartInput) !== chartBefore) throw new CoordinateEmbeddingError('CHART_INPUT_MUTATION');
  return record;
}

export function verifyCoordinateState(record, sourceState, chart) {
  const expected = embedCoordinateState(sourceState, chart);
  if (!deepEqualJson(record, expected)) {
    throw new CoordinateEmbeddingError('NONDETERMINISTIC_COORDINATE_STATE');
  }
  if (record.representationState === 'NOT_REPRESENTABLE_IN_SELECTED_CHART') return true;
  if (record.canonicalInvariantDigest !== canonicalInvariantDigest(sourceState)) {
    throw new CoordinateEmbeddingError('CANONICAL_INVARIANT_DIGEST_DRIFT');
  }
  return true;
}

export const ENGINE_MANIFEST = Object.freeze({
  engineId: ENGINE_ID,
  stateSpaceId: STATE_SPACE_ID,
  atlasId: ATLAS_ID,
  separationLaw: SEPARATION_LAW,
  coordinateEmbeddingRuntimeConstructed: true,
  coordinateTransitionRuntimeConstructed: false,
  projectionRuntimeConstructed: false,
  presentationRuntimeConstructed: false,
  visiblePrototypeConstructed: false,
  r6AuthorizedTransformationCount: 0,
  r7SpatialTransformationDependentStateCount: 0
});
