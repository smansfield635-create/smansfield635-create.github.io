export const SIX_OBJECT_MODEL_ADAPTER = Object.freeze({
  id: "R&D_SIX_OBJECT_COMPASS_MODEL_ADAPTER_v1",
  fixedTopLevelObjectCount: 6,
  fixedIdentities: Object.freeze(["flow", "integrity", "reality", "structure", "test", "research"]),
  lawAuthorityCount: 4,
  celestialAuthorityCount: 2,
  lawMemberCount: 16,
  nonLawMemberCount: 8,
  totalChildRouteCount: 24,
  centerObjectCounted: false,

  validateProfileBinding(profile) {
    const errors = [];
    if (profile.MODEL_ADAPTER !== this.id) errors.push("SIX_OBJECT_ADAPTER_ID_MISMATCH");
    if ("OBJECT_COUNT" in profile || "FIXED_TOP_LEVEL_OBJECT_COUNT" in profile) errors.push("PROFILE_SUPPLIED_OBJECT_COUNT_PROHIBITED");
    return errors;
  },

  validateSnapshot(snapshot) {
    const errors = [];
    const outer = snapshot?.outerAuthorities || [];
    const ids = outer.map((item) => item.id);
    if (outer.length !== 6) errors.push("SIX_OBJECT_COUNT_MISMATCH");
    if (new Set(ids).size !== 6 || this.fixedIdentities.some((id) => !ids.includes(id))) errors.push("SIX_OBJECT_IDENTITIES_MISMATCH");
    if (outer.filter((item) => item.primary === true).length !== 1) errors.push("PRIMARY_AUTHORITY_COUNT_MISMATCH");
    if (snapshot?.center?.fixed !== true) errors.push("CENTER_GLOBE_NOT_FIXED");
    if (snapshot?.lawAuthorityCount !== 4) errors.push("LAW_AUTHORITY_COUNT_MISMATCH");
    if (snapshot?.celestialAuthorityCount !== 2) errors.push("CELESTIAL_AUTHORITY_COUNT_MISMATCH");
    if (snapshot?.lawMemberCount !== 16 || snapshot?.nonLawMemberCount !== 8 || snapshot?.totalChildRouteCount !== 24) errors.push("CHILD_ROUTE_COUNTS_MISMATCH");
    if (snapshot?.test?.isLaw !== false || snapshot?.research?.isLaw !== false) errors.push("CELESTIAL_LAW_CLASSIFICATION_INVALID");
    if (snapshot?.test?.memberCount !== 4 || snapshot?.research?.memberCount !== 4) errors.push("CELESTIAL_MEMBER_COUNT_MISMATCH");
    if (snapshot?.test?.depthPole !== "FRONT" || snapshot?.research?.depthPole !== "REAR" || snapshot?.testResearchOpposed !== true) errors.push("DEPTH_POLE_CONTRACT_MISMATCH");
    if (snapshot?.sharedRigidFieldTransform !== true) errors.push("RIGID_FIELD_TRANSFORM_MISSING");
    if (snapshot?.selectedClusterMemberCount !== 4) errors.push("SELECTED_CLUSTER_CARDINALITY_MISMATCH");
    return Object.freeze({ pass: errors.length === 0, errors: Object.freeze(errors) });
  }
});

export default SIX_OBJECT_MODEL_ADAPTER;
