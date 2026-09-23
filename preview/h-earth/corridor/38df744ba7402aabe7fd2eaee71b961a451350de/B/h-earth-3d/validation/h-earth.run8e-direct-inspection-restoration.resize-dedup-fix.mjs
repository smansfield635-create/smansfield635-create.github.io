import fs from 'node:fs';

const path = 'showroom/globe/h-earth/functional-landscape/environment-integration.js';
let source = fs.readFileSync(path, 'utf8');

if (source.includes('let lastRenderedViewportKey = null;') &&
    source.includes('viewportKey === lastRenderedViewportKey')) {
  console.log('Unchanged viewport successor render suppression already installed.');
  process.exit(0);
}

function replaceOnce(from, to, label) {
  if (!source.includes(from)) {
    if (source.includes(to)) return;
    throw new Error(`RESIZE_DEDUP_SOURCE_NOT_FOUND:${label}`);
  }
  source = source.replace(from, to);
}

replaceOnce(
  `let requestedRenderReason = 'INITIAL';\nconst scheduledRenderWaiters = [];`,
  `let requestedRenderReason = 'INITIAL';\nlet lastRenderedViewportKey = null;\nconst scheduledRenderWaiters = [];`,
  'VIEWPORT_KEY_STATE'
);
replaceOnce(
  `    const viewport = internalExtent();\n\n    await yieldToBrowser();`,
  `    const viewport = internalExtent();\n    const viewportKey = \`${'${viewport.width}'}x${'${viewport.height}'}\`;\n\n    await yieldToBrowser();`,
  'VIEWPORT_KEY_CAPTURE'
);
replaceOnce(
  `    lastFrame = frame;\n    lastRaster = raster;\n    completedRenderCount += 1;`,
  `    lastFrame = frame;\n    lastRaster = raster;\n    lastRenderedViewportKey = viewportKey;\n    completedRenderCount += 1;`,
  'VIEWPORT_KEY_COMMIT'
);
replaceOnce(
  `const resizeObserver = new ResizeObserver(() => {\n  clearTimeout(resizeTimer);\n  resizeTimer = setTimeout(() => {\n    requestRun8ERender({\n      delay: 0,\n      reason: 'VIEWPORT_RESIZE_SETTLED'\n    }).catch((error) => console.error(error));\n  }, 180);\n});`,
  `const resizeObserver = new ResizeObserver(() => {\n  clearTimeout(resizeTimer);\n  resizeTimer = setTimeout(() => {\n    const viewport = internalExtent();\n    const viewportKey = \`${'${viewport.width}'}x${'${viewport.height}'}\`;\n    if (viewportKey === lastRenderedViewportKey) return;\n    requestRun8ERender({\n      delay: 0,\n      reason: 'VIEWPORT_RESIZE_SETTLED'\n    }).catch((error) => console.error(error));\n  }, 180);\n});`,
  'RESIZE_DEDUP_CALLBACK'
);

if (!source.includes('viewportKey === lastRenderedViewportKey')) {
  throw new Error('RESIZE_DEDUP_NOT_INSTALLED');
}
fs.writeFileSync(path, source);
console.log('Unchanged viewport successor render suppressed.');
