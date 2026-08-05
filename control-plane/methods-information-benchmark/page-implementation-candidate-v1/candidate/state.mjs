const REQUIRED_FIELDS = Object.freeze([
  "contentVersionFingerprint", "entryRoute", "activeFamily", "activeLens",
  "searchAndFilterState", "orderedSelectionHistory", "focusedRecordOrSet",
  "dependencyNeighborhood", "expandedContextPanels", "scrollAnchor",
  "viewportOrCameraStateIfSpatial", "deviceInteractionMode", "returnToken"
]);

export { REQUIRED_FIELDS };

export function canonicalize(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${canonicalize(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

export async function sha256(value) {
  const bytes = new TextEncoder().encode(typeof value === "string" ? value : canonicalize(value));
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, "0")).join("");
}

export function snapshotPayload(snapshot) {
  const copy = structuredClone(snapshot);
  delete copy.returnToken;
  return copy;
}

export async function sealSnapshot(snapshot) {
  const payload = snapshotPayload(snapshot);
  const returnToken = await sha256(payload);
  return Object.freeze({ ...payload, returnToken });
}

export async function verifySnapshot(snapshot, expectedContentVersion) {
  const missing = REQUIRED_FIELDS.filter(field => !(field in snapshot));
  if (missing.length) return { ok: false, reason: "MISSING_REQUIRED_FIELDS", missing };
  if (snapshot.contentVersionFingerprint !== expectedContentVersion) {
    return { ok: false, reason: "CONTENT_VERSION_MISMATCH" };
  }
  const expectedToken = await sha256(snapshotPayload(snapshot));
  if (expectedToken !== snapshot.returnToken) return { ok: false, reason: "INVALID_RETURN_TOKEN" };
  return { ok: true, reason: "EXACT_SNAPSHOT_VERIFIED" };
}
