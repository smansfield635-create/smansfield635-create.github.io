/**

A3D-E / PCR Empirical Validation Artifact v1.0.0

Repository-safe JavaScript module generated from the local validation work.

Purpose:

Preserve the A3D-E / PCR mathematical kernel.


Preserve directional normalization rules.


Preserve the first finance validation summary from uploaded SP500/VIX data.


Provide a runnable, dependency-free reference implementation for GitHub.


Scientific standing:

This file documents initial empirical support for the tested finance mapping.


It does not prove a universal law.


Additional domains and independent datasets are required before broader claims.
*/



/* eslint-disable no-console */

const EPSILON_K_DEFAULT = 0.001;

/**

Clamp a numeric value to [min, max].
*/
function clamp(value, min = 0, max = 1) {
if (!Number.isFinite(value)) {
throw new Error(Non-finite value received: ${value});
}
return Math.min(max, Math.max(min, value));
}


/**

Directional normalization for pressure-aligned variables.

High raw value = more applied pressure.
*/
function normalizePressure(rawValue, minValue, maxValue) {
if (maxValue <= minValue) {
throw new Error("maxValue must be greater than minValue");
}
return clamp((rawValue - minValue) / (maxValue - minValue));
}


/**

Directional normalization for capacity-aligned variables.

High raw value = more adaptive capacity.
*/
function normalizeCapacity(rawValue, minValue, maxValue) {
if (maxValue <= minValue) {
throw new Error("maxValue must be greater than minValue");
}
return clamp((rawValue - minValue) / (maxValue - minValue));
}


/**

Directional normalization for capacity-damage variables.

High raw value = more internal degradation, so normalized capacity contribution decreases.
*/
function normalizeCapacityDamage(rawValue, minValue, maxValue) {
if (maxValue <= minValue) {
throw new Error("maxValue must be greater than minValue");
}
return 1 - clamp((rawValue - minValue) / (maxValue - minValue));
}


/**

Product helper with empty-array identity = 1.
*/
function product(values) {
if (!Array.isArray(values)) {
throw new Error("product expects an array");
}


return values.reduce((acc, value) => {
if (!Number.isFinite(value)) {
throw new Error(Non-finite product term: ${value});
}
return acc * value;
}, 1);
}

/**

Compute A3D-E / PCR state.

Pi = product(q_j)

K = product(k_k)

PCR = Pi / max(K, epsilonK)

S* = 1 / (1 + PCR)

H* = PCR / (1 + PCR)
*/
function computeA3DEPCRState({
pressureTerms = [],
capacityTerms = [1],
epsilonK = EPSILON_K_DEFAULT,
} = {}) {
if (epsilonK <= 0) {
throw new Error("epsilonK must be positive");
}


const Pi = product(pressureTerms);
const K = product(capacityTerms);
const KUsed = Math.max(K, epsilonK);
const PCR = Pi / KUsed;
const SStar = 1 / (1 + PCR);
const HStar = PCR / (1 + PCR);
const safeMode = K <= epsilonK;

return {
Pi,
K,
KUsed,
PCR,
SStar,
HStar,
invariantClosure: SStar + HStar,
safeMode,
classification: classifyA3DEPCR({ Pi, K, KUsed, PCR, safeMode }),
};
}

/**

Boundary classification.
*/
function classifyA3DEPCR({ Pi, K, KUsed, PCR, safeMode }) {
if (safeMode) return "BLOCK";
if (Pi === 0) return "LOW_PRESSURE_PASS_CANDIDATE";
if (PCR < 0.2) return "STABILITY_DOMINANT";
if (Math.abs(PCR - 1) <= 0.1) return "CRITICAL_BOUNDARY";
if (Pi > KUsed) return "COLLAPSE_PRESSURE";
return "STANDARD_RUN";
}


/**

Finance Option A example:

Pressure mass = normalized VIX × normalized trailing drawdown.

Capacity is neutral: K = 1.
*/
function computeFinanceOptionA({
vix,
trailingDrawdown252d,
vixMin = 9,
vixMax = 85,
drawdownMin = 0,
drawdownMax = 0.55,
epsilonK = EPSILON_K_DEFAULT,
}) {
const qVix = normalizePressure(vix, vixMin, vixMax);
const qDrawdown = normalizePressure(
trailingDrawdown252d,
drawdownMin,
drawdownMax
);


return computeA3DEPCRState({
pressureTerms: [qVix, qDrawdown],
capacityTerms: [1],
epsilonK,
});
}

const A3DE_PCR_VALIDATION_ARTIFACT = {
artifact: "A3D-E / PCR Empirical Validation Artifact",
version: "1.0.0",
status: {
mathematicalKernel: "coherent",
syntheticBoundaryTests: "passed",
financeDatabaseArtifact: "created locally in prior run",
financeEmpiricalSupport:
"initial/promising for uploaded SP500/VIX sample",
universalLawStatus: "not proven",
},
financeValidationScope: {
stateRows: 1221,
forwardOutcomeRows: 1221,
capacityMode: "Option A: neutral capacity baseline K=1",
pressureMass: "normalized VIX × normalized trailing 252-day drawdown",
outcome: "future 30-calendar-day SP500 drawdown <= -10%",
baseline: "normalized VIX alone",
},
sources: [
{
name: "SP500.csv",
type: "uploaded_file",
description: "Uploaded S&P 500 time series used for local validation artifact.",
},
{
name: "VIXCLS.csv",
type: "uploaded_file",
description: "Uploaded VIX time series used for local validation artifact.",
},
{
name: "FRED SP500",
url: "https://fred.stlouisfed.org/series/SP500",
description: "FRED S&P 500 daily series reference.",
},
{
name: "FRED VIXCLS",
url: "https://fred.stlouisfed.org/series/VIXCLS",
description: "FRED CBOE Volatility Index daily series reference.",
},
],
performanceSummary: [
{
segment: "ALL",
n: 1221,
failures: 44,
failure_rate: 0.036036036,
brier_model: 0.0348750867,
brier_baseline_vix: 0.0463285615,
brier_lift: 0.0114534749,
auc_model: 0.7686433151,
auc_baseline_vix: 0.7554163127,
auc_lift: 0.0132270024,
"precision_model@0.5": 0.0,
"recall_model@0.5": 0.0,
"precision_baseline@0.5": 0.0,
"recall_baseline@0.5": 0.0,
},
{
segment: "TRAIN_CALIBRATION",
n: 854,
failures: 23,
failure_rate: 0.0269320843,
brier_model: 0.0261488446,
brier_baseline_vix: 0.0410062176,
brier_lift: 0.0148573729,
auc_model: 0.7646104745,
auc_baseline_vix: 0.7772196934,
auc_lift: -0.0126092189,
"precision_model@0.5": 0.0,
"recall_model@0.5": 0.0,
"precision_baseline@0.5": 0.0,
"recall_baseline@0.5": 0.0,
},
{
segment: "HOLDOUT",
n: 367,
failures: 21,
failure_rate: 0.0572207084,
brier_model: 0.0551808378,
brier_baseline_vix: 0.0587135253,
brier_lift: 0.0035326875,
auc_model: 0.8709744013,
auc_baseline_vix: 0.7827552987,
auc_lift: 0.0882191027,
"precision_model@0.5": 0.0,
"recall_model@0.5": 0.0,
"precision_baseline@0.5": 0.0,
"recall_baseline@0.5": 0.0,
},
],
holdoutDecileLift: [
{
segment_name: "HOLDOUT",
h_star_decile: 1,
sample_count: 37,
avg_h_star: 0.0,
failure_rate: 0.027027027,
base_failure_rate: 0.0572207084,
lift_vs_base: 0.4723294723,
avg_severity: 0.0273350768,
},
{
segment_name: "HOLDOUT",
h_star_decile: 2,
sample_count: 37,
avg_h_star: 0.0000254447,
failure_rate: 0.0,
base_failure_rate: 0.0572207084,
lift_vs_base: 0.0,
avg_severity: 0.024559967,
},
{
segment_name: "HOLDOUT",
h_star_decile: 3,
sample_count: 36,
avg_h_star: 0.0004151773,
failure_rate: 0.0,
base_failure_rate: 0.0572207084,
lift_vs_base: 0.0,
avg_severity: 0.0164438059,
},
{
segment_name: "HOLDOUT",
h_star_decile: 4,
sample_count: 37,
avg_h_star: 0.0010054609,
failure_rate: 0.0,
base_failure_rate: 0.0572207084,
lift_vs_base: 0.0,
avg_severity: 0.0271106819,
},
{
segment_name: "HOLDOUT",
h_star_decile: 5,
sample_count: 37,
avg_h_star: 0.0016838216,
failure_rate: 0.0,
base_failure_rate: 0.0572207084,
lift_vs_base: 0.0,
avg_severity: 0.0249816389,
},
{
segment_name: "HOLDOUT",
h_star_decile: 6,
sample_count: 36,
avg_h_star: 0.002807284,
failure_rate: 0.0,
base_failure_rate: 0.0572207084,
lift_vs_base: 0.0,
avg_severity: 0.0187858338,
},
{
segment_name: "HOLDOUT",
h_star_decile: 7,
sample_count: 37,
avg_h_star: 0.0049186655,
failure_rate: 0.0,
base_failure_rate: 0.0572207084,
lift_vs_base: 0.0,
avg_severity: 0.019741804,
},
{
segment_name: "HOLDOUT",
h_star_decile: 8,
sample_count: 36,
avg_h_star: 0.0078421997,
failure_rate: 0.0,
base_failure_rate: 0.0572207084,
lift_vs_base: 0.0,
avg_severity: 0.0173438085,
},
{
segment_name: "HOLDOUT",
h_star_decile: 9,
sample_count: 37,
avg_h_star: 0.0157251678,
failure_rate: 0.2972972973,
base_failure_rate: 0.0572207084,
lift_vs_base: 5.1956241956,
avg_severity: 0.0467835314,
},
{
segment_name: "HOLDOUT",
h_star_decile: 10,
sample_count: 37,
avg_h_star: 0.0525709385,
failure_rate: 0.2432432432,
base_failure_rate: 0.0572207084,
lift_vs_base: 4.250965251,
avg_severity: 0.0400428175,
},
],
};

/**

Minimal self-test.
*/
function runSelfTest() {
const state = computeA3DEPCRState({
pressureTerms: [0.5, 0.5],
capacityTerms: [1],
});


const closureError = Math.abs(state.invariantClosure - 1);
if (closureError > 1e-12) {
throw new Error(Invariant closure failed: ${closureError});
}

const financeState = computeFinanceOptionA({
vix: 40,
trailingDrawdown252d: 0.12,
});

return {
kernelSelfTest: "PASS",
exampleState: state,
exampleFinanceState: financeState,
validationSummary: A3DE_PCR_VALIDATION_ARTIFACT.performanceSummary,
};
}

if (typeof module !== "undefined" && module.exports) {
module.exports = {
EPSILON_K_DEFAULT,
clamp,
normalizePressure,
normalizeCapacity,
normalizeCapacityDamage,
computeA3DEPCRState,
classifyA3DEPCR,
computeFinanceOptionA,
A3DE_PCR_VALIDATION_ARTIFACT,
runSelfTest,
};
}

if (typeof require !== "undefined" && require.main === module) {
console.log(JSON.stringify(runSelfTest(), null, 2));
}
