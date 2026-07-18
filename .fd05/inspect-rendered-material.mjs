import { chromium } from 'playwright';
import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const outputDir = path.join(process.cwd(), '.fd05', 'visual-baseline-output');
await mkdir(outputDir, { recursive: true });

const url = new URL('https://diamondgatebridge.com/showroom/globe/h-earth/');
url.searchParams.set('fd05MaterialInspection', `${Date.now()}`);

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  deviceScaleFactor: 1,
  colorScheme: 'dark'
});
const page = await context.newPage();
const pageErrors = [];
const requestFailures = [];
page.on('pageerror', (error) => pageErrors.push({
  name: error?.name ?? 'Error',
  message: error?.message ?? String(error),
  stack: error?.stack ?? null
}));
page.on('requestfailed', (request) => requestFailures.push({
  url: request.url(),
  resourceType: request.resourceType(),
  failure: request.failure()
}));

await page.goto(url.href, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForFunction(
  () => document.getElementById('h-earth-3d-status')?.textContent?.trim() ===
    'PUBLIC_STAGE_RENDERER_MOUNTED',
  null,
  { timeout: 120000, polling: 250 }
);
await page.waitForTimeout(2500);

const inspection = await page.evaluate(() => {
  const mount = document.getElementById('h-earth-3d-renderer-mount');
  const renderStage = mount?.querySelector('.h-earth-3d-render-stage') ?? null;
  const all = renderStage ? [...renderStage.querySelectorAll('*')] : [];

  const elements = all.map((element, index) => {
    const computed = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return {
      index,
      tagName: element.tagName,
      id: element.id || null,
      className: typeof element.className === 'string' ? element.className : null,
      dataset: { ...element.dataset },
      inlineStyle: element.getAttribute('style'),
      computed: {
        display: computed.display,
        visibility: computed.visibility,
        opacity: computed.opacity,
        position: computed.position,
        left: computed.left,
        top: computed.top,
        width: computed.width,
        height: computed.height,
        zIndex: computed.zIndex,
        transform: computed.transform,
        transformOrigin: computed.transformOrigin,
        clipPath: computed.clipPath,
        background: computed.background,
        backgroundColor: computed.backgroundColor,
        backgroundImage: computed.backgroundImage,
        border: computed.border,
        borderColor: computed.borderColor,
        borderWidth: computed.borderWidth,
        boxShadow: computed.boxShadow,
        filter: computed.filter,
        mixBlendMode: computed.mixBlendMode
      },
      rect: {
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height
      },
      childElementCount: element.childElementCount
    };
  });

  const classCounts = {};
  for (const element of elements) {
    const key = element.className || `[${element.tagName}]`;
    classCounts[key] = (classCounts[key] ?? 0) + 1;
  }

  const styleGroups = new Map();
  for (const element of elements) {
    const signature = JSON.stringify({
      className: element.className,
      datasetKeys: Object.keys(element.dataset).sort(),
      background: element.computed.background,
      border: element.computed.border,
      boxShadow: element.computed.boxShadow,
      filter: element.computed.filter,
      mixBlendMode: element.computed.mixBlendMode,
      clipPathPresent: element.computed.clipPath !== 'none'
    });
    if (!styleGroups.has(signature)) {
      styleGroups.set(signature, {
        signature: JSON.parse(signature),
        count: 0,
        samples: []
      });
    }
    const group = styleGroups.get(signature);
    group.count += 1;
    if (group.samples.length < 6) group.samples.push(element);
  }

  const cssRules = [];
  for (const sheet of [...document.styleSheets]) {
    let rules;
    try {
      rules = [...(sheet.cssRules ?? [])];
    } catch (_error) {
      continue;
    }
    for (const rule of rules) {
      const text = rule.cssText ?? '';
      if (
        text.includes('h-earth-3d-render') ||
        text.includes('h-earth-3d-projected') ||
        text.includes('renderer-mount')
      ) {
        cssRules.push({
          href: sheet.href ?? null,
          cssText: text
        });
      }
    }
  }

  const globalSummaries = {};
  for (const key of Object.keys(globalThis).sort()) {
    if (
      key.startsWith('H_EARTH') &&
      (key.includes('RENDERER') ||
       key.includes('COMPOSITOR') ||
       key.includes('ROUTE_BOOTSTRAP'))
    ) {
      const value = globalThis[key];
      globalSummaries[key] = {
        type: typeof value,
        isArray: Array.isArray(value),
        keys:
          value && typeof value === 'object'
            ? Object.keys(value).slice(0, 120)
            : [],
        stringValue:
          typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean'
            ? String(value)
            : null
      };
    }
  }

  return {
    href: location.href,
    status:
      document.getElementById('h-earth-3d-status')?.textContent?.trim() ?? null,
    mount: mount
      ? {
          childElementCount: mount.childElementCount,
          clientWidth: mount.clientWidth,
          clientHeight: mount.clientHeight,
          dataset: { ...mount.dataset }
        }
      : null,
    renderStage: renderStage
      ? {
          className: renderStage.className,
          dataset: { ...renderStage.dataset },
          childElementCount: renderStage.childElementCount,
          descendantCount: all.length
        }
      : null,
    classCounts,
    styleGroups: [...styleGroups.values()].sort((a, b) => b.count - a.count),
    elements,
    cssRules,
    globalSummaries
  };
});

const report = {
  reportId: 'H_EARTH_FD05_RENDERED_WET_SAND_MATERIAL_INSPECTION_001',
  generatedAt: new Date().toISOString(),
  repositoryCommit: '637733701f845cdff6bd802b1b94ab7bee5eb299',
  repositoryModified: false,
  status: 'READ_ONLY_INSPECTION_COMPLETE',
  inspection,
  pageErrors,
  requestFailures
};

await writeFile(
  path.join(outputDir, 'rendered-material-inspection.json'),
  `${JSON.stringify(report, null, 2)}\n`,
  'utf8'
);

console.log(JSON.stringify({
  reportId: report.reportId,
  status: inspection.status,
  renderStage: inspection.renderStage,
  classCounts: inspection.classCounts,
  styleGroups: inspection.styleGroups.slice(0, 20),
  cssRuleCount: inspection.cssRules.length,
  pageErrorCount: pageErrors.length,
  requestFailureCount: requestFailures.length
}, null, 2));

await context.close();
await browser.close();
