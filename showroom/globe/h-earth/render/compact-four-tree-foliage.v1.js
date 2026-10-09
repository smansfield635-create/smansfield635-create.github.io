/**
 * H_EARTH_FOUR_TREE_COMPACT_FOLIAGE_V1
 * Generation 2633: bounded compact leaf-buffer custody and resource accounting.
 * This module does not assert that a standalone reconstruction proof qualifies
 * the integrated renderer. Color/shadow integration and device review remain gates.
 */
export const FOUR_TREE_COMPACT_TARGETS = Object.freeze([
  'P2_TREE_A_03', 'P2_TREE_A_06', 'P2_TREE_A_08', 'P2_TREE_A_11'
]);
export const FOUR_TREE_COMPACT_CONTRACT = Object.freeze({
  schema: 'H_EARTH_FOUR_TREE_COMPACT_FOLIAGE_v1',
  approvedSource: '9cff8bbd6ccca95ccd51da72570f92af4778425a',
  leafCount: 7168,
  compactRecordBytes: 24,
  sidecarRecordBytes: 32,
  compactBufferBytes: 172032,
  sidecarBufferBytes: 229376,
  maxAddedGpuBytes: 6291456,
  maxAddedMainDraws: 4,
  maxAddedShadowDraws: 4,
  maxAddedPrograms: 2,
  maxAddedBuffers: 3,
  maxAddedVertexArrays: 1,
  maxAddedTextures: 0,
  maxAddedFramebuffers: 0,
  targets: FOUR_TREE_COMPACT_TARGETS
});
function exactBytes(view, bytes, label) {
  if (!ArrayBuffer.isView(view) || view.byteLength !== bytes) {
    throw new RangeError(`FOUR_TREE_COMPACT_${label}_BYTE_LENGTH`);
  }
  return new Uint8Array(view.buffer, view.byteOffset, view.byteLength);
}
export function validateFourTreeCompactPayload({ compactRecords, contactSidecar, leafCount = 7168 }) {
  if (leafCount !== FOUR_TREE_COMPACT_CONTRACT.leafCount) {
    throw new RangeError('FOUR_TREE_COMPACT_LEAF_COUNT');
  }
  const compact = exactBytes(compactRecords, leafCount * 24, 'RECORD');
  const sidecar = exactBytes(contactSidecar, leafCount * 32, 'SIDECAR');
  return Object.freeze({ leafCount, compactBytes: compact.byteLength,
    sidecarBytes: sidecar.byteLength, totalBytes: compact.byteLength + sidecar.byteLength });
}
/**
 * Uploads the exact already-qualified packed bytes. Does not re-encode them:
 * reconstructing a different quantizer would invalidate the preserved GPU proof.
 * Caller retains ownership and must invoke dispose exactly once.
 */
export function createFourTreeCompactGpuBuffers(gl, payload) {
  if (!gl || typeof gl.createBuffer !== 'function') throw new TypeError('WEBGL2_REQUIRED');
  const accounting = validateFourTreeCompactPayload(payload);
  const created = [];
  try {
    for (const source of [payload.compactRecords, payload.contactSidecar]) {
      const buffer = gl.createBuffer();
      if (!buffer) throw new Error('FOUR_TREE_COMPACT_BUFFER_ALLOCATION_FAILED');
      created.push(buffer);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, source, gl.STATIC_DRAW);
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    let disposed = false;
    return Object.freeze({
      compactBuffer: created[0], contactSidecarBuffer: created[1],
      accounting: Object.freeze({ ...accounting, bufferCount: 2,
        actualUploadedBytes: accounting.totalBytes }),
      dispose() {
        if (disposed) return;
        disposed = true;
        for (const buffer of created) gl.deleteBuffer(buffer);
      }
    });
  } catch (error) {
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    for (const buffer of created) gl.deleteBuffer(buffer);
    throw error;
  }
}
