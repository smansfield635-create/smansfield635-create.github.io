'use strict';

const REQUIRED = Object.freeze([
  'vowelFormants','formantBandwidths','vocalTractLengthScale','nasalPolesAndZeros',
  'glottalOpenQuotient','glottalClosingQuotient','spectralTilt','aspirationByContext',
  'jitterStatistics','shimmerStatistics'
]);

const AUTH = 'AUTHORITATIVE';

function classifyMeasurement(name, value) {
  if (value == null) return Object.freeze({name,status:'NOT_IDENTIFIABLE'});
  if (typeof value !== 'object' || Array.isArray(value)) return Object.freeze({name,status:'INVALID'});
  const status = value.status || 'UNSPECIFIED';
  if (status === AUTH) return Object.freeze({name,status:AUTH,value});
  if (status === 'PROXY' || status === 'PROVISIONAL') return Object.freeze({name,status:'PROXY',value});
  if (status === 'NOT_IDENTIFIABLE') return Object.freeze({name,status:'NOT_IDENTIFIABLE',value});
  return Object.freeze({name,status:'UNQUALIFIED',value});
}

function evaluateMeasurementAuthority(measuredParameters) {
  const measured = measuredParameters && typeof measuredParameters === 'object' ? measuredParameters : {};
  const classifications = REQUIRED.map((name)=>classifyMeasurement(name, measured[name]));
  const authoritative = classifications.filter((x)=>x.status===AUTH).map((x)=>x.name);
  const proxy = classifications.filter((x)=>x.status==='PROXY').map((x)=>x.name);
  const missing = classifications.filter((x)=>!['AUTHORITATIVE','PROXY'].includes(x.status)).map((x)=>x.name);
  const unresolved = classifications.filter((x)=>x.status!==AUTH).map((x)=>x.name);
  return Object.freeze({
    result: unresolved.length ? 'FAIL_AUTHORITATIVE_MEASUREMENTS_REQUIRED' : 'PASS_AUTHORITATIVE_MEASUREMENTS',
    authoritative:Object.freeze(authoritative),
    proxy:Object.freeze(proxy),
    missing:Object.freeze(missing),
    unresolved:Object.freeze(unresolved),
    classifications:Object.freeze(classifications)
  });
}

function determineNextEvidence(authorityResult) {
  if (!authorityResult || authorityResult.result === 'PASS_AUTHORITATIVE_MEASUREMENTS') return 'NONE';
  const unresolved = new Set(authorityResult.unresolved || []);
  const diagnostic = [];
  if ([...unresolved].some((x)=>['vowelFormants','formantBandwidths','vocalTractLengthScale'].includes(x))) diagnostic.push('SUSTAINED_VOWEL_SET');
  if (unresolved.has('nasalPolesAndZeros')) diagnostic.push('SUSTAINED_NASAL_SET');
  if ([...unresolved].some((x)=>['glottalOpenQuotient','glottalClosingQuotient','spectralTilt','jitterStatistics','shimmerStatistics'].includes(x))) diagnostic.push('SUSTAINED_VOICED_VOWEL');
  if (unresolved.has('aspirationByContext')) diagnostic.push('ASPIRATION_CONTEXT_SET');
  return Object.freeze(diagnostic);
}

module.exports=Object.freeze({REQUIRED,AUTH,classifyMeasurement,evaluateMeasurementAuthority,determineNextEvidence});
