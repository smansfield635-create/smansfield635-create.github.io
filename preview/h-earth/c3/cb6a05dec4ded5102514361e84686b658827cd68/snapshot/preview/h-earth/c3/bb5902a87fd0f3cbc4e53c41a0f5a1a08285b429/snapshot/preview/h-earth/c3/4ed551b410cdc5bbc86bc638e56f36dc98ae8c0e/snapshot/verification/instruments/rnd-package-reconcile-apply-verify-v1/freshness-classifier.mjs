export const FRESHNESS = Object.freeze({
  UNCHANGED_FROM_PACKAGE_PARENT: "UNCHANGED_FROM_PACKAGE_PARENT",
  CHANGED_SINCE_PACKAGE_PARENT: "CHANGED_SINCE_PACKAGE_PARENT",
  CURRENTLY_EQUALS_CANDIDATE: "CURRENTLY_EQUALS_CANDIDATE",
  CONFLICT_REQUIRING_BOUNDED_RECONCILIATION: "CONFLICT_REQUIRING_BOUNDED_RECONCILIATION"
});

export function classifyPath({ parentBlob, currentBlob, candidateBlob }) {
  if (!parentBlob || !currentBlob || !candidateBlob) {
    return FRESHNESS.CONFLICT_REQUIRING_BOUNDED_RECONCILIATION;
  }
  if (currentBlob === candidateBlob) return FRESHNESS.CURRENTLY_EQUALS_CANDIDATE;
  if (currentBlob === parentBlob) return FRESHNESS.UNCHANGED_FROM_PACKAGE_PARENT;
  if (candidateBlob === parentBlob) return FRESHNESS.CHANGED_SINCE_PACKAGE_PARENT;
  return FRESHNESS.CONFLICT_REQUIRING_BOUNDED_RECONCILIATION;
}

export function classifyPaths({ paths, parentBlobs, currentBlobs, candidateBlobs }) {
  return Object.freeze(paths.map((path) => Object.freeze({
    path,
    parentBlob: parentBlobs[path] || null,
    currentBlob: currentBlobs[path] || null,
    candidateBlob: candidateBlobs[path] || null,
    classification: classifyPath({
      parentBlob: parentBlobs[path],
      currentBlob: currentBlobs[path],
      candidateBlob: candidateBlobs[path]
    })
  })));
}
