import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_REGISTRY = JSON.parse(fs.readFileSync(path.join(HERE, 'standards-registry.v1.json'), 'utf8'));

export const REQUEST_SCHEMA = 'L2_EXTERNAL_STANDARD_APPLICABILITY_REQUEST_v1';
export const RECEIPT_SCHEMA = 'L2_EXTERNAL_STANDARD_APPLICABILITY_RECEIPT_v1';
export const ALLOWED_INSTRUMENT_TYPES = Object.freeze([
  'SOFTWARE_PRODUCT',
  'ICT_PRODUCT',
  'SOFTWARE_TEST_HARNESS',
  'SOFTWARE_TEST_PROCESS',
  'VV_SYSTEM',
  'SOFTWARE_LIFECYCLE_SYSTEM',
  'SECURE_SOFTWARE_DEVELOPMENT_SYSTEM',
  'QUANTITATIVE_MEASUREMENT_SYSTEM',
  'CONSTRUCTED_INDEX',
  'DETERMINISTIC_SCORE',
  'ORDINAL_CLASSIFICATION',
  'TEST_OR_CALIBRATION_LABORATORY_PROCESS',
  'BINARY_CONFORMANCE_CHECK'
]);
const ALLOWED_STANDARD_STATUSES = new Set([
  'CURRENT_PUBLISHED',
  'CURRENT_PUBLISHED_REVISION_WATCH',
  'CURRENT_ACTIVE',
  'CURRENT_FINAL',
  'CURRENT_CONFIRMED',
  'CURRENT_BASE_WITH_2026_AMENDMENT'
]);
const OUTPUT_CLASSIFICATIONS = new Set([
  'MEASUREMENT_RESULT',
  'CONSTRUCTED_INDEX',
  'DETERMINISTIC_SCORE',
  'ORDINAL_CLASSIFICATION',
  'BINARY_CONFORMANCE_RESULT',
  'NOT_APPLICABLE'
]);

const stable = value => Array.isArray(value)
  ? value.map(stable)
  : value && typeof value === 'object'
    ? Object.fromEntries(Object.keys(value).sort().map(key => [key, stable(value[key])]))
    : value;

function stop(errorCode, detail = null, request = null) {
  return stable({
    schema: RECEIPT_SCHEMA,
    result: 'STOP',
    applicability: 'UNDETERMINED',
    errorCode,
    detail,
    standardId: request?.standardId ?? null,
    instrumentType: request?.instrumentType ?? null,
    benchmarkOnly: true,
    complianceDeterminationAuthorized: false,
    certificationDeterminationAuthorized: false,
    accreditationDeterminationAuthorized: false,
    authorityCreated: false
  });
}

export function getStandardMetadata(standardId, registry = DEFAULT_REGISTRY) {
  return registry.standards?.find(item => item.id === standardId) ?? null;
}

export function evaluateApplicability(request, options = {}) {
  const registry = options.registry ?? DEFAULT_REGISTRY;
  if (!request || typeof request !== 'object' || Array.isArray(request) || request.schema !== REQUEST_SCHEMA) {
    return stop('APPLICABILITY_AMBIGUOUS', 'REQUEST_SCHEMA_INVALID', request);
  }
  const standard = getStandardMetadata(request.standardId, registry);
  if (!standard) return stop('STANDARD_IDENTITY_UNKNOWN', request.standardId, request);
  if (!ALLOWED_STANDARD_STATUSES.has(standard.status)) {
    return stop('STANDARD_STATUS_NOT_CURRENT_OR_EXPLICITLY_WATCHED', standard.status, request);
  }
  if (!ALLOWED_INSTRUMENT_TYPES.includes(request.instrumentType)) {
    return stop('INSTRUMENT_TYPE_UNKNOWN', request.instrumentType, request);
  }
  const attributes = request.attributes && typeof request.attributes === 'object' && !Array.isArray(request.attributes)
    ? request.attributes
    : {};
  const outputClassification = attributes.outputClassification ?? null;
  if (outputClassification !== null && !OUTPUT_CLASSIFICATIONS.has(outputClassification)) {
    return stop('APPLICABILITY_AMBIGUOUS', 'OUTPUT_CLASSIFICATION_UNKNOWN', request);
  }

  let applicability = 'NOT_APPLICABLE';
  let rationaleCode = 'INSTRUMENT_OUTSIDE_STANDARD_SCOPE';
  let measurementBoundary = null;
  let laboratoryBoundary = null;

  switch (standard.domain) {
    case 'SOFTWARE_PRODUCT_QUALITY':
      applicability = ['SOFTWARE_PRODUCT', 'ICT_PRODUCT'].includes(request.instrumentType) ? 'APPLICABLE' : 'NOT_APPLICABLE';
      rationaleCode = applicability === 'APPLICABLE' ? 'SOFTWARE_PRODUCT_QUALITY_SCOPE_MATCH' : rationaleCode;
      break;
    case 'SOFTWARE_PRODUCT_QUALITY_MEASUREMENT':
      applicability = ['SOFTWARE_PRODUCT', 'ICT_PRODUCT'].includes(request.instrumentType) && attributes.quantitativeQualityEvaluation === true
        ? 'APPLICABLE'
        : 'NOT_APPLICABLE';
      rationaleCode = applicability === 'APPLICABLE' ? 'QUANTITATIVE_SOFTWARE_QUALITY_SCOPE_MATCH' : rationaleCode;
      break;
    case 'SOFTWARE_TESTING_GENERAL_CONCEPTS':
    case 'SOFTWARE_TEST_PROCESSES':
    case 'SOFTWARE_TEST_DOCUMENTATION':
    case 'SOFTWARE_TEST_TECHNIQUES':
      applicability = ['SOFTWARE_TEST_HARNESS', 'SOFTWARE_TEST_PROCESS'].includes(request.instrumentType)
        ? 'APPLICABLE'
        : 'NOT_APPLICABLE';
      rationaleCode = applicability === 'APPLICABLE' ? 'SOFTWARE_TESTING_SCOPE_MATCH' : rationaleCode;
      break;
    case 'SYSTEM_SOFTWARE_HARDWARE_VERIFICATION_VALIDATION':
      applicability = (request.instrumentType === 'VV_SYSTEM' || request.instrumentType === 'SOFTWARE_TEST_HARNESS') && attributes.verificationOrValidationActivity === true
        ? 'APPLICABLE'
        : 'NOT_APPLICABLE';
      rationaleCode = applicability === 'APPLICABLE' ? 'VV_SCOPE_MATCH' : rationaleCode;
      break;
    case 'SOFTWARE_LIFECYCLE_PROCESSES':
      applicability = ['SOFTWARE_LIFECYCLE_SYSTEM', 'SOFTWARE_PRODUCT'].includes(request.instrumentType)
        ? 'APPLICABLE'
        : 'NOT_APPLICABLE';
      rationaleCode = applicability === 'APPLICABLE' ? 'SOFTWARE_LIFECYCLE_SCOPE_MATCH' : rationaleCode;
      break;
    case 'SECURE_SOFTWARE_DEVELOPMENT':
      applicability = ['SECURE_SOFTWARE_DEVELOPMENT_SYSTEM', 'SOFTWARE_LIFECYCLE_SYSTEM', 'SOFTWARE_PRODUCT'].includes(request.instrumentType)
        ? 'APPLICABLE'
        : 'NOT_APPLICABLE';
      rationaleCode = applicability === 'APPLICABLE' ? 'SECURE_SOFTWARE_DEVELOPMENT_SCOPE_MATCH' : rationaleCode;
      break;
    case 'MEASUREMENT_MANAGEMENT_SYSTEMS':
      applicability = request.instrumentType === 'QUANTITATIVE_MEASUREMENT_SYSTEM' && attributes.measurementManagementSystem === true
        ? 'APPLICABLE'
        : 'NOT_APPLICABLE';
      measurementBoundary = applicability === 'APPLICABLE'
        ? 'MEASUREMENT_MANAGEMENT_SCOPE_ESTABLISHED'
        : 'GENERIC_SOFTWARE_OR_NONMEASUREMENT_SCORE_IS_NOT_A_MEASUREMENT_MANAGEMENT_SYSTEM';
      rationaleCode = applicability === 'APPLICABLE' ? 'MEASUREMENT_MANAGEMENT_SCOPE_MATCH' : rationaleCode;
      break;
    case 'TESTING_CALIBRATION_LABORATORY_COMPETENCE':
      if (request.instrumentType === 'TEST_OR_CALIBRATION_LABORATORY_PROCESS' && attributes.laboratoryContext === true) {
        applicability = 'APPLICABLE';
        rationaleCode = 'LABORATORY_SCOPE_MATCH';
        laboratoryBoundary = 'LABORATORY_CONTEXT_ASSERTED_BENCHMARK_ONLY';
      } else if (['SOFTWARE_TEST_HARNESS', 'SOFTWARE_TEST_PROCESS', 'VV_SYSTEM'].includes(request.instrumentType)) {
        applicability = 'PRINCIPLE_LEVEL_ONLY';
        rationaleCode = 'LABORATORY_COMPLIANCE_SCOPE_NOT_ESTABLISHED';
        laboratoryBoundary = 'NO_LABORATORY_COMPLIANCE_OR_ACCREDITATION_INFERENCE';
      } else {
        laboratoryBoundary = 'NOT_A_TESTING_OR_CALIBRATION_LABORATORY_PROCESS';
      }
      break;
    case 'MEASUREMENT_UNCERTAINTY': {
      if (['CONSTRUCTED_INDEX', 'DETERMINISTIC_SCORE', 'ORDINAL_CLASSIFICATION', 'BINARY_CONFORMANCE_CHECK'].includes(request.instrumentType)) {
        applicability = 'NOT_APPLICABLE';
        rationaleCode = 'NO_GUM_APPLICATION_TO_UNCLASSIFIED_OR_NONMEASUREMENT_SCORE';
        measurementBoundary = 'OUTPUT_IS_NOT_A_MEASUREMENT_RESULT';
        break;
      }
      if (request.instrumentType !== 'QUANTITATIVE_MEASUREMENT_SYSTEM') break;
      if (!outputClassification || attributes.hasDefinedMeasurand === undefined) {
        return stop('APPLICABILITY_AMBIGUOUS', 'MEASURAND_CLASSIFICATION_REQUIRED', request);
      }
      if (outputClassification !== 'MEASUREMENT_RESULT' || attributes.hasDefinedMeasurand !== true) {
        applicability = 'NOT_APPLICABLE';
        rationaleCode = 'MEASURAND_NOT_ESTABLISHED';
        measurementBoundary = 'GUM_WITHHELD_PENDING_GENUINE_MEASURAND';
      } else {
        applicability = 'APPLICABLE';
        rationaleCode = 'MEASUREMENT_UNCERTAINTY_SCOPE_MATCH';
        measurementBoundary = 'DEFINED_MEASURAND_AND_MEASUREMENT_RESULT_ASSERTED';
      }
      break;
    }
    default:
      return stop('APPLICABILITY_AMBIGUOUS', `UNHANDLED_STANDARD_DOMAIN:${standard.domain}`, request);
  }

  return stable({
    schema: RECEIPT_SCHEMA,
    result: 'PASS',
    applicability,
    rationaleCode,
    standardId: standard.id,
    standardDesignation: standard.designation,
    standardStatus: standard.status,
    revisionWatch: standard.status === 'CURRENT_PUBLISHED_REVISION_WATCH',
    instrumentType: request.instrumentType,
    outputClassification,
    measurementBoundary,
    laboratoryBoundary,
    benchmarkOnly: true,
    complianceDeterminationAuthorized: false,
    certificationDeterminationAuthorized: false,
    accreditationDeterminationAuthorized: false,
    authorityCreated: false
  });
}
