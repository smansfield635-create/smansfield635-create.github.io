/**
 * /showroom/globe/h-earth/diagnostic/ui.js
 * Presentation-only interface for the FD_05 browser capture instrument.
 */

const IDS = Object.freeze({
  root: 'h-earth-fd05-diagnostic',
  status: 'h-earth-fd05-status',
  start: 'h-earth-fd05-start',
  copySummary: 'h-earth-fd05-copy-summary',
  copyPackage: 'h-earth-fd05-copy-package',
  savePackage: 'h-earth-fd05-save-package',
  rows: 'h-earth-fd05-rows',
  summary: 'h-earth-fd05-summary',
  receipt: 'h-earth-fd05-receipt',
  unresolved: 'h-earth-fd05-unresolved'
});

function element(documentObject, tag, options = {}) {
  const node = documentObject.createElement(tag);

  if (options.className) {
    node.className = options.className;
  }

  if (options.text !== undefined) {
    node.textContent = String(options.text);
  }

  for (const [name, value] of Object.entries(options.attributes || {})) {
    node.setAttribute(name, String(value));
  }

  return node;
}

function display(value) {
  if (value === null) return '—';
  if (value === undefined) return '—';
  if (value === '') return '—';
  if (typeof value === 'boolean') return value ? 'yes' : 'no';
  return String(value);
}

function resultClass(value) {
  const text = String(value || '').toUpperCase();

  if (
    text.includes('PASS') ||
    text.includes('FULFILLED') ||
    text.includes('MATCH') ||
    text === 'COMPLETE'
  ) {
    return 'result result--pass';
  }

  if (
    text.includes('UNRESOLVED') ||
    text.includes('UNEVALUABLE') ||
    text.includes('NOT_REACHED')
  ) {
    return 'result result--unresolved';
  }

  if (
    text.includes('FINDING') ||
    text.includes('REJECTED') ||
    text.includes('MISMATCH') ||
    text.includes('FAILED')
  ) {
    return 'result result--finding';
  }

  return 'result';
}

function renderScheduledRow(documentObject, row) {
  const tableRow = element(documentObject, 'tr', {
    attributes: {
      'data-capture-order': row.captureOrder,
      'data-state': row.currentState
    }
  });

  const identity = element(documentObject, 'td');
  identity.append(
    element(documentObject, 'strong', {
      text: String(row.captureOrder).padStart(2, '0')
    }),
    element(documentObject, 'code', {
      text: row.repositoryPath
    })
  );

  const state = element(documentObject, 'td');
  state.append(
    element(documentObject, 'span', {
      className: resultClass(row.currentState),
      text: row.currentState
    })
  );

  const transport = element(documentObject, 'td');
  transport.append(
    element(documentObject, 'div', {
      text: `result: ${display(row.transportResult)}`
    }),
    element(documentObject, 'div', {
      text: `status: ${display(row.httpStatus)}`
    }),
    element(documentObject, 'div', {
      text: `type: ${display(row.responseType)}`
    }),
    element(documentObject, 'div', {
      text: `bytes: ${display(row.responseByteLength)}`
    })
  );

  const correspondence = element(documentObject, 'td');
  correspondence.append(
    element(documentObject, 'div', {
      text: `contract: ${display(row.contractCorrespondenceDisposition)}`
    }),
    element(documentObject, 'div', {
      text: `drive: ${display(row.driveDigestComparison?.result)}`
    }),
    element(documentObject, 'div', {
      text: `repository: ${display(row.repositoryDigestComparison?.result)}`
    })
  );

  const nativeImport = element(documentObject, 'td');
  nativeImport.append(
    element(documentObject, 'div', {
      text: `policy: ${display(row.nativeImportPolicy)}`
    }),
    element(documentObject, 'div', {
      text: `execution: ${display(row.nativeImportExecutionDisposition)}`
    }),
    element(documentObject, 'div', {
      text: `result: ${display(row.nativeDynamicImportResult)}`
    })
  );

  tableRow.append(identity, state, transport, correspondence, nativeImport);
  return tableRow;
}

function renderFinding(documentObject, label, value) {
  const card = element(documentObject, 'article', {
    className: 'finding-card'
  });

  card.append(
    element(documentObject, 'h3', { text: label }),
    element(documentObject, 'p', {
      className: resultClass(value?.status),
      text: `${display(value?.status)} · ${display(value?.code)}`
    }),
    element(documentObject, 'p', {
      text:
        value?.captureOrder === null || value?.captureOrder === undefined
          ? `${value?.affectedCaptureOrders?.length || 0} affected row(s)`
          : `row ${value.captureOrder} · ${value.repositoryPath}`
    })
  );

  return card;
}

function summaryText(packageObject) {
  return [
    'H-EARTH FD_05 BROWSER EVIDENCE PACKAGE',
    `Packet: ${packageObject.packetId}`,
    `Manifest: ${packageObject.manifestId}`,
    `Manifest digest: ${packageObject.manifestDigest}`,
    `Package digest: ${packageObject.packageDigest.value}`,
    `Rows: ${packageObject.moduleCount}`,
    `Authority continuity: ${packageObject.authorityContinuityFinding.status} / ${packageObject.authorityContinuityFinding.code}`,
    `Publication correspondence: ${packageObject.publicationCorrespondenceFinding.status} / ${packageObject.publicationCorrespondenceFinding.code}`,
    `Browser execution: ${packageObject.browserExecutionFinding.status} / ${packageObject.browserExecutionFinding.code}`,
    `First material finding: ${packageObject.firstMaterialFinding.status} / ${packageObject.firstMaterialFinding.code}`,
    `Unresolved fields: ${packageObject.unresolvedFields.length}`,
    `Engineering handoff: ${packageObject.finalCompletionReceipt.engineeringHandoffStatus}`,
    'Source modification authority: WITHHELD',
    'Production claim authority: NONE'
  ].join('\n');
}

async function copyText(text, globalObject, documentObject) {
  if (globalObject.navigator?.clipboard?.writeText) {
    await globalObject.navigator.clipboard.writeText(text);
    return;
  }

  const textarea = element(documentObject, 'textarea');
  textarea.value = text;
  textarea.className = 'clipboard-fallback';
  documentObject.body.append(textarea);
  textarea.select();

  const success = documentObject.execCommand?.('copy') === true;
  textarea.remove();

  if (!success) {
    throw new Error('CLIPBOARD_COPY_FAILED');
  }
}

function saveJson(packageObject, globalObject, documentObject) {
  const blob = new Blob(
    [JSON.stringify(packageObject, null, 2)],
    { type: 'application/json;charset=utf-8' }
  );
  const url = globalObject.URL.createObjectURL(blob);
  const anchor = element(documentObject, 'a', {
    attributes: {
      href: url,
      download: 'H_EARTH_FD05_BROWSER_EVIDENCE_PACKAGE.json'
    }
  });

  anchor.hidden = true;
  documentObject.body.append(anchor);
  anchor.click();
  anchor.remove();

  globalObject.setTimeout(() => {
    globalObject.URL.revokeObjectURL(url);
  }, 0);
}

export function createHEarthFd05Ui({
  documentObject = globalThis.document,
  globalObject = globalThis,
  onStart
} = {}) {
  if (!documentObject) {
    return Object.freeze({
      initialize() {},
      render() {},
      destroy() {}
    });
  }

  const cleanup = [];
  let currentPackage = null;

  const root = documentObject.getElementById(IDS.root);
  const status = documentObject.getElementById(IDS.status);
  const start = documentObject.getElementById(IDS.start);
  const copySummary = documentObject.getElementById(IDS.copySummary);
  const copyPackage = documentObject.getElementById(IDS.copyPackage);
  const savePackage = documentObject.getElementById(IDS.savePackage);
  const rowsBody = documentObject.getElementById(IDS.rows);
  const summary = documentObject.getElementById(IDS.summary);
  const receipt = documentObject.getElementById(IDS.receipt);
  const unresolved = documentObject.getElementById(IDS.unresolved);

  if (
    !root ||
    !status ||
    !start ||
    !copySummary ||
    !copyPackage ||
    !savePackage ||
    !rowsBody ||
    !summary ||
    !receipt ||
    !unresolved
  ) {
    throw new Error('FD05_DIAGNOSTIC_HTML_CONTRACT_INCOMPLETE');
  }

  const listen = (target, eventName, handler) => {
    target.addEventListener(eventName, handler);
    cleanup.push(() => target.removeEventListener(eventName, handler));
  };

  listen(start, 'click', () => {
    if (typeof onStart === 'function') {
      void onStart();
    }
  });

  listen(copySummary, 'click', async () => {
    if (currentPackage) {
      await copyText(
        summaryText(currentPackage),
        globalObject,
        documentObject
      );
    }
  });

  listen(copyPackage, 'click', async () => {
    if (currentPackage) {
      await copyText(
        JSON.stringify(currentPackage, null, 2),
        globalObject,
        documentObject
      );
    }
  });

  listen(savePackage, 'click', () => {
    if (currentPackage) {
      saveJson(currentPackage, globalObject, documentObject);
    }
  });

  const initialize = (rows, manifestValidation) => {
    root.dataset.runState = manifestValidation.valid
      ? 'READY'
      : 'MANIFEST_INVALID';

    status.textContent = manifestValidation.valid
      ? 'Ready. Nineteen governed rows are scheduled. Capture has not started.'
      : `Manifest validation failed: ${manifestValidation.issues.join(', ')}`;

    start.disabled = !manifestValidation.valid;
    copySummary.disabled = true;
    copyPackage.disabled = true;
    savePackage.disabled = true;

    rowsBody.replaceChildren(
      ...rows.map((row) => renderScheduledRow(documentObject, row))
    );
  };

  const render = ({
    phase,
    rows,
    packageObject = null,
    error = null
  }) => {
    root.dataset.runState = error ? 'ABORTED' : phase;

    if (error) {
      status.textContent = `Run aborted: ${error.message || String(error)}`;
    } else {
      const phaseText = {
        READY: 'Ready. Capture has not started.',
        TRANSPORT: 'Transport capture is running across all nineteen rows.',
        NATIVE_IMPORT:
          'Transport barrier passed. Ordered native-import observation is running.',
        FINALIZING:
          'All rows are terminal. The immutable browser package is being finalized.',
        COMPLETE:
          'Capture complete. The evidence package and completion receipt are available.'
      };
      status.textContent = phaseText[phase] || phase;
    }

    start.disabled = phase !== 'READY';

    rowsBody.replaceChildren(
      ...rows.map((row) => renderScheduledRow(documentObject, row))
    );

    if (!packageObject) {
      return;
    }

    currentPackage = packageObject;
    copySummary.disabled = false;
    copyPackage.disabled = false;
    savePackage.disabled = false;

    summary.replaceChildren(
      renderFinding(
        documentObject,
        'Authority continuity',
        packageObject.authorityContinuityFinding
      ),
      renderFinding(
        documentObject,
        'Publication correspondence',
        packageObject.publicationCorrespondenceFinding
      ),
      renderFinding(
        documentObject,
        'Browser execution',
        packageObject.browserExecutionFinding
      ),
      renderFinding(
        documentObject,
        'First material finding',
        packageObject.firstMaterialFinding
      )
    );

    receipt.textContent = JSON.stringify(
      packageObject.finalCompletionReceipt,
      null,
      2
    );

    unresolved.replaceChildren();

    if (packageObject.unresolvedFields.length === 0) {
      unresolved.append(
        element(documentObject, 'p', {
          text: 'No unresolved required fields.'
        })
      );
    } else {
      const list = element(documentObject, 'ul');
      for (const item of packageObject.unresolvedFields) {
        list.append(
          element(documentObject, 'li', {
            text: `${item.field}: ${item.reason}`
          })
        );
      }
      unresolved.append(list);
    }
  };

  return Object.freeze({
    initialize,
    render,
    getCurrentPackage() {
      return currentPackage;
    },
    destroy() {
      while (cleanup.length > 0) {
        cleanup.pop()();
      }
      currentPackage = null;
    }
  });
}
