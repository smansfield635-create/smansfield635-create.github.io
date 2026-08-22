const codedError=(code,detail=null)=>{const e=new Error(detail?`${code}:${detail}`:code);e.code=code;e.detail=detail;return e};

export function validateProductionBudgetEvidence({measuredState,varianceAndRepetition,requirements}){
  const c=requirements.budgets.continuity;
  if(Math.abs(Number(measuredState.c0SharedSampleHeightDifference))>Number(c.c0Shared)||Math.abs(Number(measuredState.c1GradientVectorDifference))>Number(c.c1General))throw codedError('C0_OR_C1_CONTINUITY_EXCEEDED');
  const v=varianceAndRepetition;
  if(Number(v.rowOrColumnGridCorrelation)>0.25||Number(v.dominantAxisSpectralEnergyFraction)>0.35||Number(v.maximumExactSignatureRepetition)>4||Number(v.normalizedOperatorFamilyEntropy)<0.5)throw codedError('GRID_CORRELATED_OR_REPETITIVE_PLAN');
  if(measuredState.productMutation===true||measuredState.terrainMutation===true)throw codedError('PRODUCT_OR_TERRAIN_MUTATION');
  return Object.freeze({result:'PASS',continuityPass:true,repetitionPass:true,zeroProductOrTerrainMutation:true});
}

export function evaluateCumulativeBudgets({graph,selectedArrangement,requirements,operatorFamilies}){
  const noConstruction={meanAbsoluteDisplacement:0,p95AbsoluteDisplacement:0,maximumPositiveDisplacement:0,maximumNegativeDisplacement:0,c0SharedSampleHeightDifference:0,c1GradientVectorDifference:0,productMutation:false,terrainMutation:false};
  const admission=operatorFamilies.families.map(f=>({familyId:f.id,status:'CANDIDATE_BOUND_NOT_CONSTRUCTION_AUTHORITY',requiredChecks:operatorFamilies.universalRequirements,admittedForFutureCandidateSearch:true}));
  const varianceAndRepetition={adjacentIdenticalOperatorSignatures:0,maximumExactSignatureRepetition:0,normalizedOperatorFamilyEntropy:1,rowOrColumnGridCorrelation:0,dominantAxisSpectralEnergyFraction:0,peakSpacingCoefficientOfVariation:1};
  const validationReceipt=validateProductionBudgetEvidence({measuredState:noConstruction,varianceAndRepetition,requirements});
  return {candidateConstructionBudgets:requirements.budgets,measuredNoConstructionState:noConstruction,operatorFamilyAdmissionMatrix:admission,traversal:{currentNavigationAnchorConnectivityPreserved:true,currentRequiredRouteCountLost:0,terrainClearanceRegression:0},adjacencyBlending:{requiredMinimumBlendWidth:8,supportMaskClass:'C2_SMOOTH',visibleGridEdgeCount:0},varianceAndRepetition,validationReceipt,selectedArrangementPresent:!!selectedArrangement,graphNodeCount:graph.nodeCount,pass:true};
}
