import { chromium } from 'playwright';
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const out = '.fd05/wet-sand-prework-output';
await mkdir(out, { recursive: true });
const route = 'https://diamondgatebridge.com/showroom/globe/h-earth/';
const renderer = await readFile('showroom/globe/h-earth/renderer.js');
const candidates = [
  { id: 'CURRENT', mode: 'none' },
  { id: 'A_CONSERVATIVE', mode: 'local', background: 'linear-gradient(180deg,#8b7a60 0%,#6c624e 48%,#444842 100%)', shadow: 'rgba(225,232,223,.12) 0 1px 0 inset,rgba(18,25,23,.12) 0 1px 3px', filter: 'saturate(1.08) brightness(1.06) contrast(.96)', blend: 'normal', opacity: '.99' },
  { id: 'B_BALANCED', mode: 'continuous', background: 'linear-gradient(180deg,rgba(205,226,223,.34) 0%,rgba(156,181,180,.12) 22%,rgba(121,112,91,.08) 45%,rgba(55,67,64,.30) 100%),linear-gradient(180deg,#917c5d 0%,#6f644e 48%,#444b45 100%)', shadow: 'rgba(225,242,238,.16) 0 1px 0 inset,rgba(15,23,22,.08) 0 1px 2px', filter: 'saturate(1.10) brightness(1.08) contrast(.94)', blend: 'normal', opacity: '.99' },
  { id: 'C_HIGH_SHEEN', mode: 'continuous', background: 'linear-gradient(180deg,rgba(222,244,242,.58) 0%,rgba(166,210,211,.30) 20%,rgba(112,127,113,.08) 46%,rgba(41,62,61,.42) 100%),linear-gradient(180deg,#977e58 0%,#6d634b 48%,#3b4844 100%)', shadow: 'rgba(235,251,248,.30) 0 1px 0 inset,rgba(10,20,20,.06) 0 1px 1px', filter: 'saturate(1.16) brightness(1.12) contrast(.90)', blend: 'screen', opacity: '.96' }
];
const configs = [
  { id: 'mobile', viewport: { width: 393, height: 852 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  { id: 'desktop', viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1, isMobile: false, hasTouch: false }
];

const browser = await chromium.launch({ headless: true });
const results = [];
for (const cfg of configs) {
  for (const candidate of candidates) {
    const context = await browser.newContext(cfg);
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push({ name: e.name, message: e.message }));
    await page.goto(`${route}?fd05WetSand=${Date.now()}-${cfg.id}-${candidate.id}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForFunction(() => document.getElementById('h-earth-3d-status')?.textContent?.trim() === 'PUBLIC_STAGE_RENDERER_MOUNTED', { timeout: 120000 });
    await page.waitForTimeout(1000);
    const before = await page.evaluate(() => {
      const mount = document.getElementById('h-earth-3d-renderer-mount');
      const triangles = [...mount.querySelectorAll('[data-material-intent="WET_SAND"][data-projected-type="TRIANGLE"]')];
      return {
        routeStatus: document.getElementById('h-earth-3d-status')?.textContent?.trim(),
        rendererOwned: mount.querySelectorAll('[data-h-earth-renderer-owned="true"]').length,
        previewOwned: mount.querySelectorAll('[data-h-earth-source-preview-owned="true"]').length,
        layers: mount.querySelectorAll('.h-earth-3d-render-semantic-layer').length,
        interactions: mount.querySelectorAll('.h-earth-3d-render-interaction-boundary').length,
        primitives: mount.querySelectorAll('.h-earth-3d-render-primitive').length,
        triangles: triangles.length,
        signatures: triangles.map(n => [n.dataset.primitiveId,n.dataset.sourceVertexIndices,n.dataset.depthClipped,n.dataset.viewportClipped,n.dataset.materialReference,n.dataset.materialIntent,n.dataset.presentationRole,n.dataset.renderLayer].join('|'))
      };
    });
    if (candidate.mode !== 'none') {
      await page.evaluate(c => {
        const stage = document.querySelector('.h-earth-3d-render-stage');
        const sr = stage.getBoundingClientRect();
        for (const node of document.querySelectorAll('[data-material-intent="WET_SAND"][data-projected-type="TRIANGLE"]')) {
          const r = node.getBoundingClientRect();
          node.style.backgroundImage = c.background;
          if (c.mode === 'continuous') {
            node.style.backgroundSize = `${sr.width}px ${sr.height}px`;
            node.style.backgroundPosition = `${-(r.left-sr.left)}px ${-(r.top-sr.top)}px`;
            node.style.backgroundRepeat = 'no-repeat';
          }
          node.style.boxShadow = c.shadow;
          node.style.filter = c.filter;
          node.style.mixBlendMode = c.blend;
          node.style.opacity = c.opacity;
          node.dataset.fd05Candidate = c.id;
        }
      }, candidate);
      await page.waitForTimeout(250);
    }
    const after = await page.evaluate(() => {
      const mount = document.getElementById('h-earth-3d-renderer-mount');
      const triangles = [...mount.querySelectorAll('[data-material-intent="WET_SAND"][data-projected-type="TRIANGLE"]')];
      return {
        routeStatus: document.getElementById('h-earth-3d-status')?.textContent?.trim(),
        rendererOwned: mount.querySelectorAll('[data-h-earth-renderer-owned="true"]').length,
        previewOwned: mount.querySelectorAll('[data-h-earth-source-preview-owned="true"]').length,
        layers: mount.querySelectorAll('.h-earth-3d-render-semantic-layer').length,
        interactions: mount.querySelectorAll('.h-earth-3d-render-interaction-boundary').length,
        primitives: mount.querySelectorAll('.h-earth-3d-render-primitive').length,
        triangles: triangles.length,
        signatures: triangles.map(n => [n.dataset.primitiveId,n.dataset.sourceVertexIndices,n.dataset.depthClipped,n.dataset.viewportClipped,n.dataset.materialReference,n.dataset.materialIntent,n.dataset.presentationRole,n.dataset.renderLayer].join('|')),
        sampleStyle: triangles[0] ? { background: getComputedStyle(triangles[0]).background, boxShadow: getComputedStyle(triangles[0]).boxShadow, filter: getComputedStyle(triangles[0]).filter, mixBlendMode: getComputedStyle(triangles[0]).mixBlendMode, opacity: getComputedStyle(triangles[0]).opacity } : null
      };
    });
    const file = path.join(out, `${cfg.id}-${candidate.id.toLowerCase()}.png`);
    await page.locator('#h-earth-3d-world-stage').screenshot({ path: file });
    const bytes = await readFile(file);
    results.push({ configuration: cfg.id, candidate, before, after, signaturesStable: JSON.stringify(before.signatures) === JSON.stringify(after.signatures), structureStable: ['rendererOwned','previewOwned','layers','interactions','primitives','triangles'].every(k => before[k] === after[k]), screenshot: { file, byteLength: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex') }, errors });
    await context.close();
  }
}
await browser.close();
const report = {
  reportId: 'H_EARTH_FD05_WET_SAND_MATERIAL_PRESENTATION_PREWORK_CAPTURE_001',
  generatedAt: new Date().toISOString(),
  status: 'RUNTIME_ONLY_CANDIDATE_CAPTURE_COMPLETE',
  repositoryCommit: '637733701f845cdff6bd802b1b94ab7bee5eb299',
  repositoryModified: false,
  rendererIdentity: { path: '/showroom/globe/h-earth/renderer.js', byteLength: renderer.length, sha256: createHash('sha256').update(renderer).digest('hex'), gitBlobSha: '283bea824a97ad7c2d243f8413d59d0bf1a77ae2' },
  materialChain: { sourceObjectId: 'OBJ_002_FOREGROUND_WET_SAND', materialReference: 'H_EARTH_MATERIAL_WET_SAND', materialIntent: 'WET_SAND', presentationRole: 'PRIMARY_ADMITTED_WET_SAND_SURFACE', renderLayer: 'GROUND', rendererFunctions: ['getMaterialPresentation','applyPresentation'] },
  results,
  aggregateGates: { allMounted: results.every(r => r.after.routeStatus === 'PUBLIC_STAGE_RENDERER_MOUNTED'), all154Triangles: results.every(r => r.after.triangles === 154), allSignaturesStable: results.every(r => r.signaturesStable), allStructuresStable: results.every(r => r.structureStable), totalErrors: results.reduce((n,r) => n+r.errors.length,0) }
};
await writeFile(path.join(out,'report.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({ reportId: report.reportId, aggregateGates: report.aggregateGates, captures: results.map(r => ({ configuration:r.configuration,candidate:r.candidate.id,file:r.screenshot.file })) },null,2));
