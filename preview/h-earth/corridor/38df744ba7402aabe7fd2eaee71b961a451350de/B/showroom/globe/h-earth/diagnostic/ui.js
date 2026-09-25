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
  workspaceState: 'h-earth-fd05-workspace-state',
  browserTab: 'h-earth-fd05-tab-browser',
  cycleTab: 'h-earth-fd05-tab-cycle',
  browserPanel: 'browser-layer',
  cyclePanel: 'cycle-layer',
  diagnosticOrbit: 'diagnostic-orbit',
  utilities: 'h-earth-fd05-utilities',
  cycleInputVault: 'h-earth-fd05-cycle-input-vault',
  captureStatus: 'h-earth-fd05-capture-status',
  startCapture: 'h-earth-fd05-start',
  copySummary: 'h-earth-fd05-copy-summary',
  copyFindings: 'h-earth-fd05-copy-findings',
  copyReceipt: 'h-earth-fd05-copy-receipt',
  copyDigest: 'h-earth-fd05-copy-digest',
  savePackage: 'h-earth-fd05-save-package',
  captureMetrics: 'h-earth-fd05-capture-metrics',
  rowNav: 'h-earth-fd05-row-nav',
  rowSelect: 'h-earth-fd05-row-select',
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
  cycleStationDetail: 'h-earth-fd05-cycle-station-detail',
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

const WORKSPACES = Object.freeze(['browser', 'cycle']);

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
const json = (value) => JSON.stringify(value ?? null, null, 2);

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

function appendPairs(documentObject, target, pairs) {
  for (const [label, value] of pairs) {
    target.append(create(documentObject, 'dt', '', label), create(documentObject, 'dd', '', display(value)));
  }
}

function disclosure(documentObject, label, value) {
  const details = create(documentObject, 'details', 'workbench-disclosure');
  details.append(
    create(documentObject, 'summary', '', label),
    create(documentObject, 'pre', 'compact-json', json(value))
  );
  return details;
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

function rowStatus(row) {
  return row.terminalState || row.currentState || 'SCHEDULED';
}

function renderRowWorkbench(documentObject, row, packageObject, copyProjection, saveProjection) {
  const workbench = create(documentObject, 'article', 'row-workbench');
  workbench.dataset.captureOrder = row.captureOrder;

  const heading = create(documentObject, 'div', 'workbench-heading');
  const identity = create(documentObject, 'div', 'workbench-identity');
  identity.append(
    create(documentObject, 'p', 'section-kicker', `Row ${String(row.captureOrder).padStart(2, '0')}`),
    create(documentObject, 'h3', '', basename(row.repositoryPath)),
    create(documentObject, 'code', 'workbench-path', row.repositoryPath)
  );
  heading.append(identity, create(documentObject, 'span', tone(rowStatus(row)), rowStatus(row)));

  const facts = create(documentObject, 'div', 'metric-grid');
  facts.append(
    metric(documentObject, 'HTTP', row.httpStatus),
    metric(documentObject, 'Bytes', row.responseByteLength),
    metric(documentObject, 'Contract', row.contractCorrespondenceDisposition, tone(row.contractCorrespondenceDisposition)),
    metric(documentObject, 'Repository', row.repositoryDigestComparison?.result, tone(row.repositoryDigestComparison?.result)),
    metric(documentObject, 'Drive', row.driveDigestComparison?.result, tone(row.driveDigestComparison?.result)),
    metric(documentObject, 'Native import', row.nativeDynamicImportResult, tone(row.nativeDynamicImportResult))
  );

  const identitySection = create(documentObject, 'section', 'workbench-section');
  identitySection.append(create(documentObject, 'h4', '', 'Identity and lifecycle'));
  const identityGrid = create(documentObject, 'dl', 'data-grid');
  appendPairs(documentObject, identityGrid, [
    ['Capture order', row.captureOrder],
    ['Repository path', row.repositoryPath],
    ['Expected response class', row.expectedResponseClass],
    ['Current state', row.currentState],
    ['Terminal state', row.terminalState],
    ['State transition count', row.stateHistory?.length]
  ]);
  identitySection.append(identityGrid, disclosure(documentObject, 'State history', row.stateHistory || []));

  const transportSection = create(documentObject, 'section', 'workbench-section');
  transportSection.append(create(documentObject, 'h4', '', 'Transport evidence'));
  const transportGrid = create(documentObject, 'dl', 'data-grid');
  appendPairs(documentObject, transportGrid, [
    ['Requested URL', row.requestedDeployedUrl],
    ['Final URL', row.finalResponseUrl],
    ['Redirected', row.redirected],
    ['HTTP status', row.httpStatus],
    ['Response OK', row.responseOk],
    ['Response type', row.responseType],
    ['Content type', row.contentType],
    ['Body custody', row.bodyCustodyDisposition],
    ['Response byte length', row.responseByteLength],
    ['Deployed SHA-256', row.deployedSha256]
  ]);
  transportSection.append(
    transportGrid,
    disclosure(documentObject, 'Browser-exposed response headers', row.browserExposedResponseHeaders),
    disclosure(documentObject, 'Transport error', row.transportError)
  );

  const correspondenceSection = create(documentObject, 'section', 'workbench-section');
  correspondenceSection.append(create(documentObject, 'h4', '', 'Contract correspondence'));
  const correspondenceGrid = create(documentObject, 'dl', 'data-grid');
  appendPairs(documentObject, correspondenceGrid, [
    ['Expected contract ID', row.expectedContractId],
    ['Exact expected contract observed', row.exactExpectedContractLiteralObserved],
    ['Correspondence disposition', row.contractCorrespondenceDisposition],
    ['Observed contract candidates', row.observedContractCandidates?.length]
  ]);
  correspondenceSection.append(correspondenceGrid, disclosure(documentObject, 'Observed contract candidates', row.observedContractCandidates || []));

  const comparisonsSection = create(documentObject, 'section', 'workbench-section');
  comparisonsSection.append(
    create(documentObject, 'h4', '', 'Drive and repository comparison'),
    disclosure(documentObject, 'Drive comparison', row.driveDigestComparison),
    disclosure(documentObject, 'Repository comparison', row.repositoryDigestComparison)
  );

  const importSection = create(documentObject, 'section', 'workbench-section');
  importSection.append(create(documentObject, 'h4', '', 'Native-import result'));
  const importGrid = create(documentObject, 'dl', 'data-grid');
  appendPairs(documentObject, importGrid, [
    ['Import policy', row.nativeImportPolicy],
    ['Import authorized', row.nativeImportAuthorized],
    ['Execution disposition', row.nativeImportExecutionDisposition],
    ['Dynamic import result', row.nativeDynamicImportResult],
    ['Skip reason', row.nativeImportSkipReason],
    ['Not reached reason', row.nativeImportNotReachedReason],
    ['Unobservable reason', row.nativeImportResultUnobservableReason],
    ['Exact failed leaf claim', row.nativeImportExactFailedLeafClaim]
  ]);
  importSection.append(
    importGrid,
    disclosure(documentObject, 'Import parents', row.importParents || []),
    disclosure(documentObject, 'Import risk flags', row.nativeImportRiskFlags || []),
    disclosure(documentObject, 'Import error', row.nativeImportError),
    disclosure(documentObject, 'Module export names', row.nativeModuleExportNames || [])
  );

  const accessSection = create(documentObject, 'section', 'workbench-section');
  accessSection.append(create(documentObject, 'h4', '', 'Row evidence access'));
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
  accessSection.append(
    actions,
    disclosure(documentObject, 'Row summary projection', packageObject ? buildRowSummaryProjection(packageObject, row.captureOrder) : { status: 'PACKAGE_NOT_FINAL' }),
    disclosure(documentObject, 'Complete row evidence projection', packageObject ? buildCompleteRowProjection(packageObject, row.captureOrder) : row)
  );

  workbench.append(heading, facts, identitySection, transportSection, correspondenceSection, comparisonsSection, importSection, accessSection);
  return workbench;
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

function renderStationWorkbench(documentObject, station, receipt) {
  const workbench = create(documentObject, 'article', 'station-detail');
  const status = receipt?.status || 'NOT RUN';
  const heading = create(documentObject, 'div', 'workbench-heading');
  const identity = create(documentObject, 'div', 'workbench-identity');
  identity.append(
    create(documentObject, 'p', 'section-kicker', station.fibonacci),
    create(documentObject, 'h3', '', station.stationId.replaceAll('_', ' '))
  );
  heading.append(identity, create(documentObject, 'span', tone(status), status));
  workbench.append(heading, create(documentObject, 'p', 'station-result', receipt?.result || 'Awaiting explicit cycle run'));

  const summaryGrid = create(documentObject, 'dl', 'data-grid workbench-section');
  appendPairs(documentObject, summaryGrid, [
    ['Position', station.position],
    ['Status', status],
    ['Result', receipt?.result],
    ['Direction', receipt?.direction],
    ['Recommended owner', receipt?.recommendedOwner],
    ['Receipt digest', receipt?.receiptDigest?.value]
  ]);
  workbench.append(
    summaryGrid,
    disclosure(documentObject, 'Evidence', receipt?.evidence || {}),
    disclosure(documentObject, 'Absence', receipt?.absence || []),
    disclosure(documentObject, 'Parent receipt references', receipt?.parentReceiptDigests || []),
    disclosure(documentObject, 'Input artifact references', receipt?.inputDigestReferences || []),
    disclosure(documentObject, 'Claim ceiling', receipt?.claimCeiling || {})
  );
  return workbench;
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

  const returnOrbitControls = [...documentObject.querySelectorAll('[data-return-diagnostic-orbit]')];
  if (!returnOrbitControls.length) throw new Error('FD05_DIAGNOSTIC_ORBIT_CONTROL_MISSING');

  const cleanup = [];
  let currentPackage = null;
  let currentCyclePacket = null;
  let currentInputSnapshot = null;
  let currentRows = [];
  let activeWorkspace = 'browser';
  let selectedRowOrder = 1;
  let selectedStationPosition = 1;

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

  const workspaceTabs = [nodes.browserTab, nodes.cycleTab];
  const workspacePanels = { browser: nodes.browserPanel, cycle: nodes.cyclePanel };

  const activateWorkspace = (workspace, { focus = false } = {}) => {
    if (!WORKSPACES.includes(workspace)) return;
    activeWorkspace = workspace;
    for (const tab of workspaceTabs) {
      const selected = tab.dataset.workspace === workspace;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      if (focus && selected) tab.focus();
    }
    for (const [name, panel] of Object.entries(workspacePanels)) panel.hidden = name !== workspace;
    nodes.workspaceState.textContent = workspace === 'browser' ? 'Browser Evidence' : 'Diagnosis Cycle';
  };

  const moveWorkspaceFocus = (currentIndex, direction) => {
    const next = direction === 'first'
      ? 0
      : direction === 'last'
        ? workspaceTabs.length - 1
        : (currentIndex + direction + workspaceTabs.length) % workspaceTabs.length;
    workspaceTabs[next].focus();
  };

  for (const tab of workspaceTabs) {
    listen(tab, 'click', () => activateWorkspace(tab.dataset.workspace));
    listen(tab, 'keydown', (event) => {
      const index = workspaceTabs.indexOf(tab);
      if (event.key === 'ArrowLeft') { event.preventDefault(); moveWorkspaceFocus(index, -1); }
      else if (event.key === 'ArrowRight') { event.preventDefault(); moveWorkspaceFocus(index, 1); }
      else if (event.key === 'Home') { event.preventDefault(); moveWorkspaceFocus(index, 'first'); }
      else if (event.key === 'End') { event.preventDefault(); moveWorkspaceFocus(index, 'last'); }
      else if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); activateWorkspace(tab.dataset.workspace, { focus: true }); }
    });
  }

  const returnToDiagnosticOrbit = () => {
    const activeTab = activeWorkspace === 'browser' ? nodes.browserTab : nodes.cycleTab;
    const reducedMotion = globalObject.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches === true;
    nodes.diagnosticOrbit.scrollIntoView({ block: 'start', behavior: reducedMotion ? 'auto' : 'smooth' });
    activeTab.focus({ preventScroll: true });
  };
  for (const control of returnOrbitControls) listen(control, 'click', returnToDiagnosticOrbit);

  listen(documentObject, 'keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (nodes.cycleInputVault.open) {
      event.preventDefault();
      nodes.cycleInputVault.open = false;
      nodes.cycleInputVault.querySelector('summary')?.focus();
      return;
    }
    if (nodes.utilities.open) {
      event.preventDefault();
      nodes.utilities.open = false;
      nodes.utilities.querySelector(':scope > summary')?.focus();
    }
  });

  const renderOccurrenceNavigation = (rows, packageObject) => {
    currentRows = rows;
    if (!rows.some((row) => row.captureOrder === selectedRowOrder)) selectedRowOrder = rows[0]?.captureOrder || 1;
    const focusedOrder = nodes.rowNav.contains(documentObject.activeElement)
      ? Number(documentObject.activeElement?.dataset?.captureOrder)
      : null;

    const navButtons = rows.map((row) => {
      const status = rowStatus(row);
      const control = create(documentObject, 'button', 'occurrence-rail__button');
      control.type = 'button';
      control.setAttribute('role', 'option');
      control.setAttribute('aria-selected', String(row.captureOrder === selectedRowOrder));
      control.tabIndex = row.captureOrder === selectedRowOrder ? 0 : -1;
      control.dataset.captureOrder = row.captureOrder;
      control.append(
        create(documentObject, 'span', 'occurrence-rail__order', String(row.captureOrder).padStart(2, '0')),
        create(documentObject, 'span', 'occurrence-rail__name', basename(row.repositoryPath)),
        create(documentObject, 'span', `occurrence-rail__status ${tone(status)}`, status)
      );
      return control;
    });

    nodes.rowNav.replaceChildren(...navButtons);
    nodes.rowSelect.replaceChildren(...rows.map((row) => {
      const option = create(documentObject, 'option', '', `${String(row.captureOrder).padStart(2, '0')} · ${basename(row.repositoryPath)} · ${rowStatus(row)}`);
      option.value = String(row.captureOrder);
      option.selected = row.captureOrder === selectedRowOrder;
      return option;
    }));

    const selectedRow = rows.find((row) => row.captureOrder === selectedRowOrder) || rows[0];
    nodes.rows.replaceChildren(selectedRow
      ? renderRowWorkbench(documentObject, selectedRow, packageObject, copyProjection, saveProjection)
      : create(documentObject, 'p', 'empty-state', 'No governed occurrences available.'));

    if (focusedOrder !== null) nodes.rowNav.querySelector(`[data-capture-order="${focusedOrder}"]`)?.focus();
  };

  const selectRow = (captureOrder, { focus = false } = {}) => {
    const row = currentRows.find((candidate) => candidate.captureOrder === captureOrder);
    if (!row) return;
    selectedRowOrder = captureOrder;
    renderOccurrenceNavigation(currentRows, currentPackage);
    if (focus) nodes.rowNav.querySelector(`[data-capture-order="${captureOrder}"]`)?.focus();
  };

  listen(nodes.rowNav, 'click', (event) => {
    const control = event.target.closest('[data-capture-order]');
    if (control) selectRow(Number(control.dataset.captureOrder));
  });
  listen(nodes.rowNav, 'keydown', (event) => {
    const control = event.target.closest('[data-capture-order]');
    if (!control) return;
    const index = currentRows.findIndex((row) => row.captureOrder === Number(control.dataset.captureOrder));
    let nextIndex = null;
    if (event.key === 'ArrowUp') nextIndex = Math.max(0, index - 1);
    else if (event.key === 'ArrowDown') nextIndex = Math.min(currentRows.length - 1, index + 1);
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = currentRows.length - 1;
    else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      selectRow(Number(control.dataset.captureOrder), { focus: true });
      return;
    }
    if (nextIndex !== null) {
      event.preventDefault();
      nodes.rowNav.querySelector(`[data-capture-order="${currentRows[nextIndex].captureOrder}"]`)?.focus();
    }
  });
  listen(nodes.rowSelect, 'change', () => selectRow(Number(nodes.rowSelect.value)));

  const renderStationNavigation = (cyclePacket) => {
    const byPosition = new Map((cyclePacket?.receipts || []).map((receipt) => [receipt.position, receipt]));
    if (!stationRegistry.some((station) => station.position === selectedStationPosition)) selectedStationPosition = stationRegistry[0]?.position || 1;
    const focusedPosition = nodes.cycleRail.contains(documentObject.activeElement)
      ? Number(documentObject.activeElement?.dataset?.stationPosition)
      : null;

    const stationTabs = stationRegistry.map((station) => {
      const receipt = byPosition.get(station.position);
      const control = create(documentObject, 'button', 'station-tab', station.fibonacci);
      control.type = 'button';
      control.id = `h-earth-fd05-station-tab-${station.position}`;
      control.dataset.stationPosition = station.position;
      control.setAttribute('role', 'tab');
      control.setAttribute('aria-controls', IDS.cycleStationDetail);
      control.setAttribute('aria-selected', String(station.position === selectedStationPosition));
      control.setAttribute('aria-label', `${station.fibonacci} ${station.stationId.replaceAll('_', ' ')} ${receipt?.status || 'NOT RUN'}`);
      control.tabIndex = station.position === selectedStationPosition ? 0 : -1;
      return control;
    });
    nodes.cycleRail.replaceChildren(...stationTabs);

    const selectedStation = stationRegistry.find((station) => station.position === selectedStationPosition) || stationRegistry[0];
    const selectedReceipt = selectedStation ? byPosition.get(selectedStation.position) : null;
    nodes.cycleStationDetail.setAttribute('aria-labelledby', selectedStation ? `h-earth-fd05-station-tab-${selectedStation.position}` : 'station-navigator-title');
    nodes.cycleStationDetail.replaceChildren(selectedStation
      ? renderStationWorkbench(documentObject, selectedStation, selectedReceipt)
      : create(documentObject, 'p', 'empty-state', 'No cycle stations available.'));

    if (focusedPosition !== null) nodes.cycleRail.querySelector(`[data-station-position="${focusedPosition}"]`)?.focus();
  };

  const selectStation = (position, { focus = false } = {}) => {
    if (!stationRegistry.some((station) => station.position === position)) return;
    selectedStationPosition = position;
    renderStationNavigation(currentCyclePacket);
    if (focus) nodes.cycleRail.querySelector(`[data-station-position="${position}"]`)?.focus();
  };

  listen(nodes.cycleRail, 'click', (event) => {
    const control = event.target.closest('[data-station-position]');
    if (control) selectStation(Number(control.dataset.stationPosition));
  });
  listen(nodes.cycleRail, 'keydown', (event) => {
    const control = event.target.closest('[data-station-position]');
    if (!control) return;
    const index = stationRegistry.findIndex((station) => station.position === Number(control.dataset.stationPosition));
    let nextIndex = null;
    if (event.key === 'ArrowLeft') nextIndex = (index - 1 + stationRegistry.length) % stationRegistry.length;
    else if (event.key === 'ArrowRight') nextIndex = (index + 1) % stationRegistry.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = stationRegistry.length - 1;
    else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      selectStation(Number(control.dataset.stationPosition), { focus: true });
      return;
    }
    if (nextIndex !== null) {
      event.preventDefault();
      nodes.cycleRail.querySelector(`[data-station-position="${stationRegistry[nextIndex].position}"]`)?.focus();
    }
  });

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
    renderOccurrenceNavigation(rows, null);
    activateWorkspace(activeWorkspace);
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
    renderOccurrenceNavigation(rows, currentPackage);
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
    renderStationNavigation(currentCyclePacket);
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
      currentRows = [];
    }
  });
}
