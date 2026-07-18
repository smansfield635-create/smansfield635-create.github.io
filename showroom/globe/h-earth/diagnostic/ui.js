/**
 * FD_05 presentation layer.
 * Browser capture and diagnosis-cycle controls remain explicitly separate.
 */
import {
  buildCompleteRowProjection,
  buildCompletionReceiptProjection,
  buildFindingsReportProjection,
  buildOperatorSummary,
  buildPackageDigestProjection,
  buildRowSummaryProjection
} from './browser-package.js?v=fd05-nine-cycle-20260718a';
import {
  buildHEarthFd05CycleSummary,
  buildHEarthFd05TerminalReceiptProjection
} from './cycle-conductor.js?v=fd05-nine-cycle-20260718a';

const IDS = Object.freeze({
  root: 'h-earth-fd05-diagnostic',
  captureStatus: 'h-earth-fd05-capture-status',
  startCapture: 'h-earth-fd05-start',
  copySummary: 'h-earth-fd05-copy-summary',
  copyFindings: 'h-earth-fd05-copy-findings',
  copyReceipt: 'h-earth-fd05-copy-receipt',
  copyDigest: 'h-earth-fd05-copy-digest',
  savePackage: 'h-earth-fd05-save-package',
  captureMetrics: 'h-earth-fd05-capture-metrics',
  rows: 'h-earth-fd05-rows',
  findings: 'h-earth-fd05-summary',
  unresolved: 'h-earth-fd05-unresolved',
  receipt: 'h-earth-fd05-receipt',
  cycleStatus: 'h-earth-fd05-cycle-status',
  cycleRun: 'h-earth-fd05-cycle-run',
  cycleCopySummary: 'h-earth-fd05-cycle-copy-summary',
  cycleSavePacket: 'h-earth-fd05-cycle-save-packet',
  cycleSaveTerminal: 'h-earth-fd05-cycle-save-terminal',
  cycleInputs: 'h-earth-fd05-cycle-inputs',
  cycleRail: 'h-earth-fd05-cycle-rail',
  cycleTerminal: 'h-earth-fd05-cycle-terminal',
  cycleReceipt: 'h-earth-fd05-cycle-receipt'
});

const INPUT_BINDINGS = Object.freeze([
  ['h-earth-fd05-load-browser-package', 'browserPackage'],
  ['h-earth-fd05-load-engineering-receipt', 'engineeringReceipt'],
  ['h-earth-fd05-load-repository-evidence', 'repositoryOccurrenceEvidence'],
  ['h-earth-fd05-load-drive-evidence', 'selectedDriveOccurrenceEvidence'],
  ['h-earth-fd05-load-correction-authority', 'correctionAuthorityReceipt'],
  ['h-earth-fd05-load-replacement-plan', 'replacementPlanEvidence'],
  ['h-earth-fd05-load-replacement-execution', 'replacementExecutionReceipt'],
  ['h-earth-fd05-load-post-correction-validation', 'postCorrectionValidationReceipt']
]);

const create = (documentObject, tag, className, text) => {
  const node = documentObject.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = String(text);
  return node;
};

const display = (value) =>
  value === null || value === undefined || value === '' ? '—' : String(value);

const basename = (path) => String(path || 'unknown').split('/').pop();
const safeName = (value) => String(value || 'artifact').replace(/[^A-Za-z0-9._-]+/g, '_');
const packetSuffix = (packetId) => safeName(String(packetId).replace(/^H_EARTH_FD05_[A-Z_]+_/, ''));

function tone(value) {
  const text = String(value || '').toUpperCase();
  if (text.includes('FAIL') || text.includes('REJECT') || text.includes('MISMATCH') || text.includes('CONFLICT') || text.includes('INVALID')) return 'status-chip status-chip--finding';
  if (text.includes('HELD') || text.includes('UNEVALUABLE') || text.includes('UNRESOLVED') || text.includes('MISSING') || text.includes('NOT_READY')) return 'status-chip status-chip--held';
  if (text.includes('PASS') || text === 'MATCH' || text.includes('FULFILLED') || text.includes('COMPLETE') || text.includes('READY')) return 'status-chip status-chip--pass';
  return 'status-chip';
}

function button(documentObject, label, handler) {
  const node = create(documentObject, 'button', 'action-button', label);
  node.type = 'button';
  node.addEventListener('click', handler);
  return node;
}

async function copyText(text, globalObject, documentObject) {
  if (globalObject.navigator?.clipboard?.writeText) {
    await globalObject.navigator.clipboard.writeText(text);
    return;
  }
  const field = create(documentObject, 'textarea', 'clipboard-fallback');
  field.value = text;
  documentObject.body.append(field);
  field.select();
  const copied = documentObject.execCommand?.('copy') === true;
  field.remove();
  if (!copied) throw new Error('CLIPBOARD_COPY_FAILED');
}

function saveJson(value, filename, globalObject, documentObject) {
  const blob = new Blob([JSON.stringify(value, null, 2)], { type: 'application/json;charset=utf-8' });
  const url = globalObject.URL.createObjectURL(blob);
  const anchor = create(documentObject, 'a');
  anchor.href = url;
  anchor.download = filename;
  anchor.hidden = true;
  documentObject.body.append(anchor);
  anchor.click();
  anchor.remove();
  globalObject.setTimeout(() => globalObject.URL.revokeObjectURL(url), 0);
}

function metric(documentObject, label, value, valueTone = '') {
  const item = create(documentObject, 'div', 'metric');
  item.append(
    create(documentObject, 'span', 'metric__label', label),
    create(documentObject, 'strong', valueTone, display(value))
  );
  return item;
}

function renderCaptureMetrics(documentObject, rows, packageObject) {
  if (packageObject) {
    const c = packageObject.aggregateCounts;
    return [
      metric(documentObject, 'Transport', `${c.transportFulfilledCount}/19`),
      metric(documentObject, 'Contracts', `${c.contractMatchCount}/19`),
      metric(documentObject, 'Repository', `${c.repositoryDigestMatchCount} match · ${c.repositoryDigestUnevaluableCount} open`),
      metric(documentObject, 'Drive', `${c.driveDigestMismatchCount} mismatch`),
      metric(documentObject, 'Imports', `${c.nativeImportFulfilledCount} pass · ${c.nativeImportRejectedCount} reject`),
      metric(documentObject, 'Package', 'FINAL', 'status-chip status-chip--pass')
    ];
  }
  const fulfilled = rows.filter((row) => row.transportResult === 'FULFILLED').length;
  const imported = rows.filter((row) => row.nativeImportExecutionDisposition === 'ATTEMPTED').length;
  return [
    metric(documentObject, 'Rows scheduled', rows.length),
    metric(documentObject, 'Transport complete', fulfilled),
    metric(documentObject, 'Imports attempted', imported),
    metric(documentObject, 'Package', 'NOT FINAL')
  ];
}

function renderRowCard(documentObject, row, packageObject, copyProjection, saveProjection) {
  const card = create(documentObject, 'article', 'row-card');
  card.dataset.captureOrder = row.captureOrder;
  card.dataset.state = row.currentState || row.terminalState || 'SCHEDULED';

  const heading = create(documentObject, 'div', 'row-card__heading');
  const identity = create(documentObject, 'div', 'row-card__identity');
  identity.append(
    create(documentObject, 'span', 'row-card__order', String(row.captureOrder).padStart(2, '0')),
    create(documentObject, 'div', '', '')
  );
  identity.lastChild.append(
    create(documentObject, 'strong', 'row-card__name', basename(row.repositoryPath)),
    create(documentObject, 'code', 'row-card__path', row.repositoryPath)
  );
  heading.append(identity, create(documentObject, 'span', tone(row.terminalState || row.currentState), row.terminalState || row.currentState || 'SCHEDULED'));

  const facts = create(documentObject, 'div', 'row-card__facts');
  facts.append(
    metric(documentObject, 'HTTP', row.httpStatus),
    metric(documentObject, 'Bytes', row.responseByteLength),
    metric(documentObject, 'Contract', row.contractCorrespondenceDisposition, tone(row.contractCorrespondenceDisposition)),
    metric(documentObject, 'Repository', row.repositoryDigestComparison?.result, tone(row.repositoryDigestComparison?.result)),
    metric(documentObject, 'Drive', row.driveDigestComparison?.result, tone(row.driveDigestComparison?.result)),
    metric(documentObject, 'Native import', row.nativeDynamicImportResult, tone(row.nativeDynamicImportResult))
  );

  const details = create(documentObject, 'details', 'row-card__details');
  const summary = create(documentObject, 'summary', '', 'Evidence details and row access');
  const grid = create(documentObject, 'dl', 'data-grid');
  const pairs = [
    ['Requested URL', row.requestedDeployedUrl],
    ['Final URL', row.finalResponseUrl],
    ['Deployed SHA-256', row.deployedSha256],
    ['Content type', row.contentType],
    ['Response type', row.responseType],
    ['State transitions', row.stateHistory?.length],
    ['Import error', row.nativeImportError?.message]
  ];
  for (const [label, value] of pairs) grid.append(create(documentObject, 'dt', '', label), create(documentObject, 'dd', '', display(value)));
  const actions = create(documentObject, 'div', 'inline-actions');
  const copyRow = button(documentObject, 'Copy row summary', () => {
    if (packageObject) void copyProjection(buildRowSummaryProjection(packageObject, row.captureOrder), `Row ${row.captureOrder} summary copied.`);
  });
  const saveRow = button(documentObject, 'Save complete row', () => {
    if (packageObject) saveProjection(buildCompleteRowProjection(packageObject, row.captureOrder), `H_EARTH_FD05_ROW_${String(row.captureOrder).padStart(2, '0')}_${safeName(basename(row.repositoryPath))}_${packetSuffix(packageObject.packetId)}.json`, `Row ${row.captureOrder} saved.`);
  });
  copyRow.disabled = !packageObject;
  saveRow.disabled = !packageObject;
  actions.append(copyRow, saveRow);
  details.append(summary, grid, actions);
  card.append(heading, facts, details);
  return card;
}

function renderFinding(documentObject, label, finding) {
  const card = create(documentObject, 'article', 'finding-card');
  card.append(
    create(documentObject, 'span', 'finding-card__label', label),
    create(documentObject, 'strong', tone(finding?.status), `${display(finding?.status)} · ${display(finding?.code)}`),
    create(documentObject, 'p', '', finding?.repositoryPath ? `Row ${finding.captureOrder} · ${basename(finding.repositoryPath)}` : `${finding?.affectedCaptureOrders?.length || 0} affected row(s)`)
  );
  return card;
}

function renderInputCustody(documentObject, snapshot) {
  return Object.entries(snapshot || {}).map(([key, value]) => {
    const item = create(documentObject, 'div', 'custody-item');
    item.append(
      create(documentObject, 'span', 'custody-item__name', key),
      create(documentObject, 'span', tone(value.presence), value.presence),
      create(documentObject, 'small', '', value.artifactId || 'No artifact admitted')
    );
    return item;
  });
}

function renderCycleRail(documentObject, stationRegistry, cyclePacket) {
  const byPosition = new Map((cyclePacket?.receipts || []).map((receipt) => [receipt.position, receipt]));
  return stationRegistry.map((station) => {
    const receipt = byPosition.get(station.position);
    const card = create(documentObject, 'article', 'station-card');
    card.dataset.status = receipt?.status || 'NOT_RUN';
    card.append(
      create(documentObject, 'span', 'station-card__fibonacci', station.fibonacci),
      create(documentObject, 'strong', 'station-card__name', station.stationId.replaceAll('_', ' ')),
      create(documentObject, 'span', tone(receipt?.status || 'NOT RUN'), receipt?.status || 'NOT RUN'),
      create(documentObject, 'small', '', receipt?.result || 'Awaiting explicit cycle run')
    );
    return card;
  });
}

export function createHEarthFd05Ui({
  documentObject = globalThis.document,
  globalObject = globalThis,
  onStartCapture,
  onCycleInput,
  onClearCycleInput,
  onRunCycle,
  stationRegistry = []
} = {}) {
  if (!documentObject) return Object.freeze({ initialize() {}, renderCapture() {}, renderCycle() {}, destroy() {} });

  const nodes = Object.fromEntries(Object.entries(IDS).map(([key, id]) => [key, documentObject.getElementById(id)]));
  if (Object.values(nodes).some((node) => !node)) throw new Error('FD05_DIAGNOSTIC_HTML_CONTRACT_INCOMPLETE');

  const cleanup = [];
  let currentPackage = null;
  let currentCyclePacket = null;
  let currentInputSnapshot = null;

  const listen = (target, event, handler) => {
    target.addEventListener(event, handler);
    cleanup.push(() => target.removeEventListener(event, handler));
  };
  const announceCapture = (message, failed = false) => {
    nodes.captureStatus.textContent = message;
    nodes.root.dataset.captureAccess = failed ? 'FAILED' : 'OK';
  };
  const announceCycle = (message, failed = false) => {
    nodes.cycleStatus.textContent = message;
    nodes.root.dataset.cycleAccess = failed ? 'FAILED' : 'OK';
  };
  const copyProjection = async (projection, message, cycle = false) => {
    try {
      await copyText(typeof projection === 'string' ? projection : JSON.stringify(projection, null, 2), globalObject, documentObject);
      (cycle ? announceCycle : announceCapture)(message);
    } catch (error) {
      (cycle ? announceCycle : announceCapture)(`Copy failed: ${error.message || String(error)}`, true);
    }
  };
  const saveProjection = (projection, filename, message, cycle = false) => {
    try {
      saveJson(projection, filename, globalObject, documentObject);
      (cycle ? announceCycle : announceCapture)(message);
    } catch (error) {
      (cycle ? announceCycle : announceCapture)(`Save failed: ${error.message || String(error)}`, true);
    }
  };

  listen(nodes.startCapture, 'click', () => Promise.resolve(onStartCapture?.()).catch((error) => announceCapture(`Capture aborted: ${error.message || String(error)}`, true)));
  listen(nodes.cycleRun, 'click', () => Promise.resolve(onRunCycle?.()).catch((error) => announceCycle(`Cycle aborted: ${error.message || String(error)}`, true)));

  listen(nodes.copySummary, 'click', () => currentPackage && void copyProjection(buildOperatorSummary(currentPackage).summaryText, 'Operator summary copied.'));
  listen(nodes.copyFindings, 'click', () => currentPackage && void copyProjection(buildFindingsReportProjection(currentPackage), 'Findings copied.'));
  listen(nodes.copyReceipt, 'click', () => currentPackage && void copyProjection(buildCompletionReceiptProjection(currentPackage), 'Receipt copied.'));
  listen(nodes.copyDigest, 'click', () => currentPackage && void copyProjection(buildPackageDigestProjection(currentPackage), 'Package digest copied.'));
  listen(nodes.savePackage, 'click', () => currentPackage && saveProjection(currentPackage, `H_EARTH_FD05_BROWSER_EVIDENCE_PACKAGE_${packetSuffix(currentPackage.packetId)}.json`, 'Full package saved.'));
  listen(nodes.cycleCopySummary, 'click', () => currentCyclePacket && void copyProjection(buildHEarthFd05CycleSummary(currentCyclePacket), 'Cycle summary copied.', true));
  listen(nodes.cycleSavePacket, 'click', () => currentCyclePacket && saveProjection(currentCyclePacket, `H_EARTH_FD05_DIAGNOSIS_CYCLE_${packetSuffix(currentCyclePacket.cycleId)}.json`, 'Cycle packet saved.', true));
  listen(nodes.cycleSaveTerminal, 'click', () => currentCyclePacket && saveProjection(buildHEarthFd05TerminalReceiptProjection(currentCyclePacket), `H_EARTH_FD05_TERMINAL_RECEIPT_${packetSuffix(currentCyclePacket.cycleId)}.json`, 'Terminal receipt saved.', true));

  for (const [id, key] of INPUT_BINDINGS) {
    const input = documentObject.getElementById(id);
    if (!input) throw new Error(`FD05_CYCLE_INPUT_MISSING:${id}`);
    listen(input, 'change', async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        const value = JSON.parse(await file.text());
        await onCycleInput?.(key, value, { fileName: file.name, size: file.size, lastModified: file.lastModified });
        announceCycle(`${key} admitted from ${file.name}.`);
      } catch (error) {
        announceCycle(`${key} rejected: ${error.message || String(error)}`, true);
        input.value = '';
      }
    });
  }

  const initialize = ({ rows, manifestValidation, cycleInputSnapshot }) => {
    nodes.root.dataset.runState = manifestValidation.valid ? 'READY' : 'MANIFEST_INVALID';
    nodes.startCapture.disabled = !manifestValidation.valid;
    announceCapture(manifestValidation.valid ? 'Ready. Nineteen governed rows are scheduled; capture has not started.' : `Manifest invalid: ${manifestValidation.issues.join(', ')}`, !manifestValidation.valid);
    nodes.captureMetrics.replaceChildren(...renderCaptureMetrics(documentObject, rows, null));
    nodes.rows.replaceChildren(...rows.map((row) => renderRowCard(documentObject, row, null, copyProjection, saveProjection)));
    renderCycle({ phase: 'READY', inputSnapshot: cycleInputSnapshot, cyclePacket: null });
  };

  const setPackageControls = (enabled) => {
    for (const node of [nodes.copySummary, nodes.copyFindings, nodes.copyReceipt, nodes.copyDigest, nodes.savePackage]) node.disabled = !enabled;
  };

  const renderCapture = ({ phase, rows, packageObject = null, error = null }) => {
    nodes.root.dataset.runState = error ? 'ABORTED' : phase;
    const messages = {
      READY: 'Ready. Capture has not started.',
      TRANSPORT: 'Transport capture is running across all nineteen rows.',
      NATIVE_IMPORT: 'Transport barrier passed. Ordered native-import observation is running.',
      FINALIZING: 'All rows are terminal. The immutable browser package is being finalized.',
      COMPLETE: 'Capture complete. The immutable package and bounded projections are available.'
    };
    announceCapture(error ? `Capture aborted: ${error.message || String(error)}` : messages[phase] || phase, Boolean(error));
    nodes.startCapture.disabled = phase !== 'READY';
    if (packageObject) currentPackage = packageObject;
    setPackageControls(Boolean(currentPackage));
    nodes.captureMetrics.replaceChildren(...renderCaptureMetrics(documentObject, rows, currentPackage));
    nodes.rows.replaceChildren(...rows.map((row) => renderRowCard(documentObject, row, currentPackage, copyProjection, saveProjection)));
    if (!currentPackage) return;
    nodes.findings.replaceChildren(
      renderFinding(documentObject, 'Authority continuity', currentPackage.authorityContinuityFinding),
      renderFinding(documentObject, 'Publication correspondence', currentPackage.publicationCorrespondenceFinding),
      renderFinding(documentObject, 'Browser execution', currentPackage.browserExecutionFinding),
      renderFinding(documentObject, 'First material finding', currentPackage.firstMaterialFinding)
    );
    nodes.unresolved.replaceChildren(
      currentPackage.unresolvedFields.length
        ? create(documentObject, 'pre', 'compact-json', JSON.stringify(currentPackage.unresolvedFields, null, 2))
        : create(documentObject, 'p', 'empty-state', 'No unresolved required browser fields.')
    );
    nodes.receipt.textContent = JSON.stringify(buildCompletionReceiptProjection(currentPackage), null, 2);
  };

  function renderCycle({ phase, inputSnapshot, cyclePacket = null, error = null }) {
    currentInputSnapshot = inputSnapshot || currentInputSnapshot || {};
    currentCyclePacket = cyclePacket;
    nodes.root.dataset.cycleState = error ? 'ABORTED' : phase;
    nodes.cycleInputs.replaceChildren(...renderInputCustody(documentObject, currentInputSnapshot));
    nodes.cycleRail.replaceChildren(...renderCycleRail(documentObject, stationRegistry, currentCyclePacket));
    const browserPresent = currentInputSnapshot?.browserPackage?.presence === 'PRESENT';
    nodes.cycleRun.disabled = phase === 'RUNNING' || !browserPresent;
    for (const node of [nodes.cycleCopySummary, nodes.cycleSavePacket, nodes.cycleSaveTerminal]) node.disabled = !currentCyclePacket;
    if (error) announceCycle(`Cycle aborted: ${error.message || String(error)}`, true);
    else if (phase === 'RUNNING') announceCycle('Nine-cycle adjudication is running from F1 through F89.');
    else if (currentCyclePacket) announceCycle(`Cycle complete: ${currentCyclePacket.terminalClassification}. Exact-nine validation: ${currentCyclePacket.exactNineReceiptSetValidated ? 'PASS' : 'FAIL'}.`);
    else announceCycle(browserPresent ? 'Browser package admitted. The diagnosis cycle may be run; missing later artifacts will produce controlled holds.' : 'Load a finalized browser package or complete a capture before running the diagnosis cycle.');

    if (!currentCyclePacket) {
      nodes.cycleTerminal.replaceChildren(create(documentObject, 'p', 'empty-state', 'No terminal synthesis yet.'));
      nodes.cycleReceipt.textContent = 'No finalized cycle packet.';
      return;
    }
    nodes.cycleTerminal.replaceChildren(
      metric(documentObject, 'Exact nine', currentCyclePacket.exactNineReceiptSetValidated ? 'VALID' : 'INVALID', tone(currentCyclePacket.exactNineReceiptSetValidated ? 'PASS' : 'FAIL')),
      metric(documentObject, 'Advancement', currentCyclePacket.advancementEligible ? 'ELIGIBLE' : 'HELD', tone(currentCyclePacket.advancementEligible ? 'PASS' : 'HELD')),
      metric(documentObject, 'Terminal classification', currentCyclePacket.terminalClassification, tone(currentCyclePacket.terminalClassification)),
      metric(documentObject, 'Source correction', currentCyclePacket.sourceCorrectionAuthority, tone(currentCyclePacket.sourceCorrectionAuthority))
    );
    nodes.cycleReceipt.textContent = JSON.stringify(buildHEarthFd05TerminalReceiptProjection(currentCyclePacket), null, 2);
  }

  return Object.freeze({
    initialize,
    renderCapture,
    renderCycle,
    destroy() {
      while (cleanup.length) cleanup.pop()();
      currentPackage = null;
      currentCyclePacket = null;
      currentInputSnapshot = null;
    }
  });
}
