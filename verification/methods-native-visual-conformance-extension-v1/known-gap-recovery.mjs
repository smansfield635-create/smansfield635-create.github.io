import fs from 'node:fs';
const file = process.argv[2] || 'methods-native-visual-conformance-extension-v1-evidence/visual-conformance-extension-result.json';
const result = JSON.parse(fs.readFileSync(file, 'utf8'));
const codes = new Set(result.findingCodes || []);
const required = [
  'PROHIBITED_REGION_COLLISION',
  'STATE_TRANSITION_SCROLL_DISPLACEMENT',
  'VERTICAL_BUDGET_UNCOMMUNICATED',
  'CAMERA_ROLE_DIFFERENTIATION_INSUFFICIENT',
  'MOBILE_ROUTE_CONTINUITY_MISSING'
];
const missing = required.filter(code => !codes.has(code));
if (result.candidateHead !== '9b7e241c56b9b5d189df7a93705186406c607867') throw new Error(`UNEXPECTED_CANDIDATE_HEAD:${result.candidateHead}`);
if (result.publicMethodsMutation !== false || result.legacyInstrumentPreserved !== true) throw new Error('AUTHORITY_BOUNDARY_NOT_PRESERVED');
if (result.automatedDisposition !== 'FAIL_AUTOMATED_VISUAL_CONFORMANCE') throw new Error(`KNOWN_MISS_NOT_REJECTED:${result.automatedDisposition}`);
if (result.humanFactors?.status !== 'UNEVALUABLE_PENDING_HUMAN_FACTORS') throw new Error(`HUMAN_GATE_NOT_ENFORCED:${result.humanFactors?.status}`);
if (missing.length) throw new Error(`KNOWN_GAP_RECOVERY_INCOMPLETE:${missing.join(',')}`);
console.log(JSON.stringify({ contract: result.contract, result: 'PASS_KNOWN_GAP_RECOVERY', recoveredCodes: required }, null, 2));
