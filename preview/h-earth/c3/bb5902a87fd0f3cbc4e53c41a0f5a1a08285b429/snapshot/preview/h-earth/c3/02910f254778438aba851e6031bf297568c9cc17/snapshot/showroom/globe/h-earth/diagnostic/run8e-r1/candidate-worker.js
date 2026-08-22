const transform = (matrix, x, y, z) => {
  const w = matrix[3] * x + matrix[7] * y + matrix[11] * z + matrix[15];
  if (!Number.isFinite(w) || Math.abs(w) < 1e-8) return null;
  return {
    x: (matrix[0] * x + matrix[4] * y + matrix[8] * z + matrix[12]) / w,
    y: (matrix[1] * x + matrix[5] * y + matrix[9] * z + matrix[13]) / w,
    z: (matrix[2] * x + matrix[6] * y + matrix[10] * z + matrix[14]) / w
  };
};

self.onmessage = (event) => {
  const { positions, indices, matrices, width = 160, height = 100 } = event.data;
  const positionData = new Float32Array(positions);
  const indexData = new Uint32Array(indices);
  const canvas = typeof OffscreenCanvas === 'function'
    ? new OffscreenCanvas(width, height)
    : null;
  const context = canvas?.getContext('2d', { alpha: false }) ?? null;
  const results = [];

  for (const camera of matrices) {
    const startedAt = performance.now();
    if (context) {
      context.fillStyle = '#547184';
      context.fillRect(0, 0, width, height);
      context.fillStyle = '#8c8061';
    }
    let submittedTriangleCount = 0;
    let visibleTriangleCount = 0;
    for (let offset = 0; offset + 2 < indexData.length; offset += 3) {
      const projected = [];
      for (let corner = 0; corner < 3; corner += 1) {
        const vertexIndex = indexData[offset + corner] * 3;
        projected.push(transform(
          camera.matrix,
          positionData[vertexIndex],
          positionData[vertexIndex + 1],
          positionData[vertexIndex + 2]
        ));
      }
      submittedTriangleCount += 1;
      if (projected.some((point) => !point || point.z < -1 || point.z > 1)) continue;
      visibleTriangleCount += 1;
      if (context) {
        context.beginPath();
        context.moveTo((projected[0].x + 1) * 0.5 * width, (1 - projected[0].y) * 0.5 * height);
        context.lineTo((projected[1].x + 1) * 0.5 * width, (1 - projected[1].y) * 0.5 * height);
        context.lineTo((projected[2].x + 1) * 0.5 * width, (1 - projected[2].y) * 0.5 * height);
        context.closePath();
        context.fill();
      }
    }
    results.push({
      cameraStateId: camera.cameraStateId,
      durationMilliseconds: performance.now() - startedAt,
      submittedTriangleCount,
      visibleTriangleCount,
      offscreenCanvas2D: Boolean(context)
    });
  }

  self.postMessage({
    candidateId: 'CANDIDATE_B_CACHED_WORLD_WORKER_CPU_PROBE',
    results
  });
};
