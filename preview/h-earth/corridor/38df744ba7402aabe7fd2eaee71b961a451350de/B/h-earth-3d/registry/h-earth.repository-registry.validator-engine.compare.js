/** Target 4B-9 · Declared-versus-derived scope comparison. */
import { deepFreeze, stableStrings } from './h-earth.repository-registry.validator-engine.identity.js';

const difference = (left, right) => [...left].filter((value) => !right.has(value)).sort();

export function compareHEarthRepositoryRegistryDeclaredAndDerivedScope(input, compositeExpansion) {
  const failureCodes = [];
  const declaredNodes = new Set(input.declaredAffectedNodeIds);
  const declaredRelations = new Set(input.declaredAffectedRelationIds);
  const declaredComposites = new Set(input.declaredCompositeUnitIds);
  const derivedNodes = new Set(compositeExpansion.affectedNodeIds);
  const derivedRelations = new Set(compositeExpansion.affectedRelationIds);
  const derivedComposites = new Set(compositeExpansion.compositeUnits.map((node) => node.nodeId));

  const missingDeclaredNodeIds = difference(derivedNodes, declaredNodes);
  const extraDeclaredNodeIds = difference(declaredNodes, derivedNodes);
  const missingDeclaredRelationIds = difference(derivedRelations, declaredRelations);
  const extraDeclaredRelationIds = difference(declaredRelations, derivedRelations);
  const missingDeclaredCompositeUnitIds = difference(derivedComposites, declaredComposites);
  const extraDeclaredCompositeUnitIds = difference(declaredComposites, derivedComposites);

  if (missingDeclaredNodeIds.length > 0 || missingDeclaredRelationIds.length > 0) {
    failureCodes.push('DECLARED_AFFECTED_NODE_SET_INCOMPLETE');
  }
  if (missingDeclaredCompositeUnitIds.length > 0) failureCodes.push('REQUIRED_COMPOSITE_MEMBER_MISSING');
  if (extraDeclaredNodeIds.length > 0 || extraDeclaredRelationIds.length > 0 || extraDeclaredCompositeUnitIds.length > 0) {
    failureCodes.push('OPERATION_SCOPE_UNRESOLVED');
  }

  return deepFreeze({
    comparisonId: 'H_EARTH_REPOSITORY_REGISTRY_DECLARED_DERIVED_SCOPE_COMPARISON_v1',
    declared: {
      nodeIds: stableStrings(input.declaredAffectedNodeIds),
      relationIds: stableStrings(input.declaredAffectedRelationIds),
      compositeUnitIds: stableStrings(input.declaredCompositeUnitIds)
    },
    derived: {
      nodeIds: stableStrings(compositeExpansion.affectedNodeIds),
      relationIds: stableStrings(compositeExpansion.affectedRelationIds),
      compositeUnitIds: stableStrings(compositeExpansion.compositeUnits.map((node) => node.nodeId))
    },
    differences: {
      missingDeclaredNodeIds: Object.freeze(missingDeclaredNodeIds),
      extraDeclaredNodeIds: Object.freeze(extraDeclaredNodeIds),
      missingDeclaredRelationIds: Object.freeze(missingDeclaredRelationIds),
      extraDeclaredRelationIds: Object.freeze(extraDeclaredRelationIds),
      missingDeclaredCompositeUnitIds: Object.freeze(missingDeclaredCompositeUnitIds),
      extraDeclaredCompositeUnitIds: Object.freeze(extraDeclaredCompositeUnitIds)
    },
    exactMatch:
      missingDeclaredNodeIds.length === 0 &&
      extraDeclaredNodeIds.length === 0 &&
      missingDeclaredRelationIds.length === 0 &&
      extraDeclaredRelationIds.length === 0 &&
      missingDeclaredCompositeUnitIds.length === 0 &&
      extraDeclaredCompositeUnitIds.length === 0,
    failureCodes: stableStrings(failureCodes),
    stoppingCondition: {
      declaredDerivedScopeComparisonComplete: true,
      advanceBeyondTarget4B9: false,
      nextAuthorizedSubtarget: '4B-10'
    }
  });
}

export default compareHEarthRepositoryRegistryDeclaredAndDerivedScope;
