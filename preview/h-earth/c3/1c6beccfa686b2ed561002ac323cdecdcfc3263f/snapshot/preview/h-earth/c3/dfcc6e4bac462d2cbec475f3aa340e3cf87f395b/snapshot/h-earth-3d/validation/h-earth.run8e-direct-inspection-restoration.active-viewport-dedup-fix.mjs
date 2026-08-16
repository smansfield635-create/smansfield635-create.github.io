import fs from 'node:fs';

const path = 'showroom/globe/h-earth/functional-landscape/environment-integration.js';
let source = fs.readFileSync(path, 'utf8');

function replaceOnce(from, to, label) {
  if (!source.includes(from)) {
    if (source.includes(to)) return;
    throw new Error(`ACTIVE_VIEWPORT_DEDUP_SOURCE_NOT_FOUND:${label}`);
  }
  source = source.replace(from, to);
}

replaceOnce(
  `let lastRenderedViewportKey = null;\nconst scheduledRenderWaiters = [];`,
  `let lastRenderedViewportKey = null;\nlet activeRenderViewportKey = null;\nconst scheduledRenderWaiters = [];`,
  'ACTIVE_VIEWPORT_STATE'
);
replaceOnce(
  `    const viewportKey = \`${'${viewport.width}'}x${'${viewport.height}'}\`;\n\n    await yieldToBrowser();`,
  `    const viewportKey = \`${'${viewport.width}'}x${'${viewport.height}'}\`;\n    activeRenderViewportKey = viewportKey;\n\n    await yieldToBrowser();`,
  'ACTIVE_VIEWPORT_CAPTURE'
);
replaceOnce(
  `  } finally {\n    rendering = false;\n    root.dataset.run8eLoading = 'false';\n  }`,
  `  } finally {\n    activeRenderViewportKey = null;\n    rendering = false;\n    root.dataset.run8eLoading = 'false';\n  }`,
  'ACTIVE_VIEWPORT_RELEASE'
);
replaceOnce(
  `    if (viewportKey === lastRenderedViewportKey) return;`,
  `    if (viewportKey === lastRenderedViewportKey ||\n        viewportKey === activeRenderViewportKey) return;`,
  'ACTIVE_VIEWPORT_RESIZE_GUARD'
);

if (!source.includes('viewportKey === activeRenderViewportKey')) {
  throw new Error('ACTIVE_VIEWPORT_DEDUP_NOT_INSTALLED');
}
fs.writeFileSync(path, source);
console.log('Resize duplication of active successor frame suppressed.');
