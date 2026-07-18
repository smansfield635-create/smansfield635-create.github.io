import { readFile, writeFile, mkdir } from 'node:fs/promises';

const outDir = '.fd05/shoreline-api-inspection-output';
await mkdir(outDir, { recursive: true });

const files = {
  south: 'showroom/globe/h-earth/render/geometry-kernel.south.js',
  facade: 'showroom/globe/h-earth/render/geometry-kernel.js',
  ground: 'showroom/globe/h-earth/render/geometry-ground.js',
  preview: 'showroom/globe/h-earth/render/geometry-preview.js',
  packet002: 'h-earth-3d/integration/h-earth.post-west-admitted-geometry-transfer.js',
  frame: 'showroom/globe/h-earth/admitted-geometry-frame.js',
  html: 'showroom/globe/h-earth/index.html'
};

function extractFunction(source, name) {
  const patterns = [
    `export function ${name}`,
    `function ${name}`,
    `export const ${name}`,
    `const ${name}`
  ];
  let start = -1;
  for (const pattern of patterns) {
    start = source.indexOf(pattern);
    if (start >= 0) break;
  }
  if (start < 0) return null;

  const braceStart = source.indexOf('{', start);
  if (braceStart < 0) {
    const semicolon = source.indexOf(';', start);
    return source.slice(start, semicolon >= 0 ? semicolon + 1 : start + 800);
  }
  let depth = 0;
  let inSingle = false;
  let inDouble = false;
  let inTemplate = false;
  let escaped = false;
  let lineComment = false;
  let blockComment = false;
  for (let index = braceStart; index < source.length; index += 1) {
    const char = source[index];
    const next = source[index + 1];
    if (lineComment) {
      if (char === '\n') lineComment = false;
      continue;
    }
    if (blockComment) {
      if (char === '*' && next === '/') {
        blockComment = false;
        index += 1;
      }
      continue;
    }
    if (!inSingle && !inDouble && !inTemplate) {
      if (char === '/' && next === '/') {
        lineComment = true;
        index += 1;
        continue;
      }
      if (char === '/' && next === '*') {
        blockComment = true;
        index += 1;
        continue;
      }
    }
    if (escaped) {
      escaped = false;
      continue;
    }
    if ((inSingle || inDouble || inTemplate) && char === '\\') {
      escaped = true;
      continue;
    }
    if (!inDouble && !inTemplate && char === "'") inSingle = !inSingle;
    else if (!inSingle && !inTemplate && char === '"') inDouble = !inDouble;
    else if (!inSingle && !inDouble && char === '`') inTemplate = !inTemplate;
    if (inSingle || inDouble || inTemplate) continue;
    if (char === '{') depth += 1;
    if (char === '}') {
      depth -= 1;
      if (depth === 0) {
        let end = index + 1;
        while (end < source.length && /[\s;]/.test(source[end])) end += 1;
        return source.slice(start, end);
      }
    }
  }
  return source.slice(start, Math.min(source.length, start + 12000));
}

function extractWindow(source, token, before = 1200, after = 5000) {
  const index = source.indexOf(token);
  if (index < 0) return null;
  return source.slice(Math.max(0, index - before), Math.min(source.length, index + after));
}

const sources = Object.fromEntries(
  await Promise.all(
    Object.entries(files).map(async ([id, file]) => [id, await readFile(file, 'utf8')])
  )
);

const requests = {
  south: [
    'constructHEarthTriangleMesh',
    'constructHEarthHeightFieldMesh',
    'createHEarthNeutralGeometryRecord',
    'createHEarthNeutralPrimitiveRecord'
  ],
  ground: [
    'constructHEarthGroundProvider',
    'constructGroundPrimitive',
    'buildGroundProviderReceipt'
  ],
  preview: [
    'previewHEarthWetSandGeometry',
    'translateHEarthWetSandPreviewProviderInput'
  ],
  packet002: [
    'validatePreviewResult',
    'validateWestPrimitiveAdmission',
    'validateWestBatchAdmissionResult',
    'buildHEarthPostWestAdmittedGeometryTransfer'
  ],
  frame: [
    'validatePrimitiveSourceProvenance',
    'buildWetSandPresentationAssignments',
    'validatePacket002Transfer',
    'composeHEarth3DAdmittedGeometryFrame'
  ]
};

const excerpts = {};
for (const [fileId, names] of Object.entries(requests)) {
  excerpts[fileId] = Object.fromEntries(
    names.map((name) => [name, extractFunction(sources[fileId], name)])
  );
}
excerpts.html = {
  previewImportAndConstruction: extractWindow(
    sources.html,
    'previewHEarthWetSandGeometry',
    2500,
    9000
  ),
  packet002Construction: extractWindow(
    sources.html,
    'buildHEarthPostWestAdmittedGeometryTransfer',
    3000,
    7000
  )
};

const report = {
  reportId: 'H_EARTH_FD05_SHORELINE_API_INSPECTION_001',
  generatedAt: new Date().toISOString(),
  status: 'COMPLETE',
  repositoryModified: false,
  files,
  excerpts
};

await writeFile(
  `${outDir}/api-inspection.json`,
  `${JSON.stringify(report, null, 2)}\n`,
  'utf8'
);
console.log(JSON.stringify({
  reportId: report.reportId,
  excerptAvailability: Object.fromEntries(
    Object.entries(excerpts).map(([id, values]) => [
      id,
      Object.fromEntries(
        Object.entries(values).map(([name, value]) => [name, Boolean(value)])
      )
    ])
  )
}, null, 2));
