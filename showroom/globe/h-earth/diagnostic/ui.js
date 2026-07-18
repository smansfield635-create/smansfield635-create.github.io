/**
 * /showroom/globe/h-earth/diagnostic/ui.js
 * Presentation and bounded access controls for the FD_05 browser package.
 */

import {
  buildCompleteRowProjection,
  buildCompletionReceiptProjection,
  buildFindingsReportProjection,
  buildOperatorSummary,
  buildPackageDigestProjection,
  buildRowSummaryProjection
} from './browser-package.js?v=fd05-access-20260717c';

const IDS = Object.freeze({
  root: 'h-earth-fd05-diagnostic',
  status: 'h-earth-fd05-status',
  start: 'h-earth-fd05-start',
  copySummary: 'h-earth-fd05-copy-summary',
  copyFindings: 'h-earth-fd05-copy-findings',
  copyReceipt: 'h-earth-fd05-copy-receipt',
  copyDigest: 'h-earth-fd05-copy-digest',
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
  if (value === null || value === undefined || value === '') {
    return '—';
  }

  if (typeof value === 'boolean') {
    return value ? 'yes' : 'no';
  }

  return String(value);
}

function resultClass(value) {
  const text = String(value || '').toUpperCase();

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

  if (
    text.includes('PASS') ||
    text.includes('FULFILLED') ||
    text === 'MATCH' ||
    text === 'COMPLETE'
  ) {
    return 'result result--pass';
  }

  return 'result';
}

function safeFilename(value) {
  return String(value)
    .replace(/[^A-Za-z0-9._-]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 180);
}

function rowSlug(repositoryPath) {
  const basename = String(repositoryPath).split('/').pop() || 'ROW';
  return safeFilename(basename.replace(/\.[^.]+$/g, '').toUpperCase());
}

function packageSuffix(packageObject) {
  return safeFilename(
    packageObject.packetId.replace(
      /^H_EARTH_FD05_BROWSER_EVIDENCE_PACKAGE_/,
      ''
    )
  );
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

function saveJson(value, filename, globalObject, documentObject) {
  const blob = new Blob([JSON.stringify(value, null, 2)], {
    type: 'application/json;charset=utf-8'
  });
  const url = globalObject.URL.createObjectURL(blob);
  const anchor = element(documentObject, 'a', {
    attributes: {
      href: url,
      download: filename
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

function renderCount(documentObject, label, value) {
  const item = element(documentObject, 'div', {
    className: 'count-item'
  });
  item.append(
    element(documentObject, 'dt', { text: label }),
    element(documentObject, 'dd', { text: value })
  );
  return item;
}

function renderRowDetail(
  documentObject,
  row,
  packageObject,
  copyProjection,
  saveProjection
) {
  const detailRow = element(documentObject, 'tr', {
    className: 'row-detail-row',
    attributes: {
      'data-detail-for': row.captureOrder
    }
  });
  const cell = element(documentObject, 'td', {
    attributes: { colspan: 5 }
  });
  const details = element(documentObject, 'details', {
    className: 'row-detail'
  });
  const summary = element(documentObject, 'summary', {
    text: `View row ${String(row.captureOrder).padStart(2, '0')} evidence access`
  });
  const grid = element(documentObject, 'dl', {
    className: 'row-detail-grid'
  });
  const values = [
    ['Requested URL', row.requestedDeployedUrl],
    ['Final URL', row.finalResponseUrl],
    ['SHA-256', row.deployedSha256],
    ['Body encoding', row.capturedBodyEncoding],
    ['Base64 characters', row.capturedBodyBase64?.length ?? 0],
    ['State transitions', row.stateHistory?.length ?? 0],
    ['Native import error', row.nativeImportError?.message ?? null]
  ];

  for (const [label, value] of values) {
    grid.append(
      element(documentObject, 'dt', { text: label }),
      element(documentObject, 'dd', { text: display(value) })
    );
  }

  const actions = element(documentObject, 'div', {
    className: 'row-detail-actions'
  });
  const copySummary = element(documentObject, 'button', {
    text: 'Copy row summary',
    attributes: { type: 'button' }
  });
  const saveComplete = element(documentObject, 'button', {
    text: 'Save complete row evidence',
    attributes: { type: 'button' }
  });

  copySummary.disabled = packageObject === null;
  saveComplete.disabled = packageObject === null;

  copySummary.addEventListener('click', () => {
    if (packageObject) {
      void copyProjection(
        buildRowSummaryProjection(packageObject, row.captureOrder),
        `Row ${row.captureOrder} summary copied.`
      );
    }
  });

  saveComplete.addEventListener('click', () => {
    if (packageObject) {
      const projection = buildCompleteRowProjection(
        packageObject,
        row.captureOrder
      );
      const filename = [
        'H_EARTH_FD05_ROW',
        String(row.captureOrder).padStart(2, '0'),
        rowSlug(row.repositoryPath),
        'EVIDENCE',
        packageSuffix(packageObject)
      ].join('_') + '.json';
      saveProjection(projection, filename, `Row ${row.captureOrder} saved.`);
    }
  });

  actions.append(copySummary, saveComplete);
  details.append(summary, grid, actions);
  cell.append(details);
  detailRow.append(cell);
  return detailRow;
}

function renderScheduledRows(
  documentObject,
  rows,
  packageObject,
  copyProjection,
  saveProjection
) {
  const nodes = [];

  for (const row of rows) {
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
    nodes.push(
      tableRow,
      renderRowDetail(
        documentObject,
        row,
        packageObject,
        copyProjection,
        saveProjection
      )
    );
  }

  return nodes;
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
  const copyFindings = documentObject.getElementById(IDS.copyFindings);
  const copyReceipt = documentObject.getElementById(IDS.copyReceipt);
  const copyDigest = documentObject.getElementById(IDS.copyDigest);
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
    !copyFindings ||
    !copyReceipt ||
    !copyDigest ||
    !savePackage ||
    !rowsBody ||
    !summary ||
    !receipt ||
    !unresolved
  ) {
    throw new Error('FD05_DIAGNOSTIC_HTML_CONTRACT_INCOMPLETE');
  }

  const announce = (message, failed = false) => {
    status.textContent = message;
    root.dataset.accessState = failed ? 'FAILED' : 'COMPLETE';
  };

  const copyProjection = async (projection, successMessage) => {
    try {
      await copyText(
        typeof projection === 'string'
          ? projection
          : JSON.stringify(projection, null, 2),
        globalObject,
        documentObject
      );
      announce(successMessage);
    } catch (error) {
      announce(`Copy failed: ${error.message || String(error)}`, true);
    }
  };

  const saveProjection = (projection, filename, successMessage) => {
    try {
      saveJson(projection, filename, globalObject, documentObject);
      announce(successMessage);
    } catch (error) {
      announce(`Save failed: ${error.message || String(error)}`, true);
    }
  };

  const listen = (target, eventName, handler) => {
    target.addEventListener(eventName, handler);
    cleanup.push(() => target.removeEventListener(eventName, handler));
  };

  listen(start, 'click', () => {
    if (typeof onStart === 'function') {
      Promise.resolve(onStart()).catch((error) => {
        announce(`Run aborted: ${error.message || String(error)}`, true);
      });
    }
  });

  listen(copySummary, 'click', () => {
    if (currentPackage) {
      const projection = buildOperatorSummary(currentPackage);
      const text = [
        `packet: ${projection.packetId}`,
        `package digest: ${projection.packageDigest.value}`,
        `manifest: ${projection.manifestId}`,
        `manifest digest: ${projection.manifestDigest}`,
        projection.summaryText
      ].join('\n');
      void copyProjection(text, 'Operator summary copied.');
    }
  });

  listen(copyFindings, 'click', () => {
    if (currentPackage) {
      void copyProjection(
        buildFindingsReportProjection(currentPackage),
        'Findings report copied.'
      );
    }
  });

  listen(copyReceipt, 'click', () => {
    if (currentPackage) {
      void copyProjection(
        buildCompletionReceiptProjection(currentPackage),
        'Completion receipt copied.'
      );
    }
  });

  listen(copyDigest, 'click', () => {
    if (currentPackage) {
      void copyProjection(
        buildPackageDigestProjection(currentPackage),
        'Package digest copied.'
      );
    }
  });

  listen(savePackage, 'click', () => {
    if (currentPackage) {
      saveProjection(
        currentPackage,
        `H_EARTH_FD05_BROWSER_EVIDENCE_PACKAGE_${packageSuffix(currentPackage)}.json`,
        'Full canonical package saved.'
      );
    }
  });

  const setAccessDisabled = (disabled) => {
    copySummary.disabled = disabled;
    copyFindings.disabled = disabled;
    copyReceipt.disabled = disabled;
    copyDigest.disabled = disabled;
    savePackage.disabled = disabled;
  };

  const initialize = (rows, manifestValidation) => {
    root.dataset.runState = manifestValidation.valid
      ? 'READY'
      : 'MANIFEST_INVALID';
    status.textContent = manifestValidation.valid
      ? 'Ready. Nineteen governed rows are scheduled. Capture has not started.'
      : `Manifest validation failed: ${manifestValidation.issues.join(', ')}`;
    start.disabled = !manifestValidation.valid;
    setAccessDisabled(true);
    rowsBody.replaceChildren(
      ...renderScheduledRows(
        documentObject,
        rows,
        null,
        copyProjection,
        saveProjection
      )
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
          'Capture complete. The evidence package and bounded projections are available.'
      };
      status.textContent = phaseText[phase] || phase;
    }

    start.disabled = phase !== 'READY';

    if (packageObject) {
      currentPackage = packageObject;
      setAccessDisabled(false);
    }

    rowsBody.replaceChildren(
      ...renderScheduledRows(
        documentObject,
        rows,
        currentPackage,
        copyProjection,
        saveProjection
      )
    );

    if (!packageObject) {
      return;
    }

    const findingsProjection = buildFindingsReportProjection(packageObject);
    const receiptProjection = buildCompletionReceiptProjection(packageObject);
    const counts = findingsProjection.evaluatedCounts;
    const countGrid = element(documentObject, 'dl', {
      className: 'count-grid'
    });

    countGrid.append(
      renderCount(
        documentObject,
        'Repository evaluated',
        counts.repositoryComparisonsEvaluated
      ),
      renderCount(
        documentObject,
        'Repository matching',
        counts.repositoryComparisonsMatching
      ),
      renderCount(
        documentObject,
        'Repository mismatching',
        counts.repositoryComparisonsMismatching
      ),
      renderCount(
        documentObject,
        'Repository unevaluable',
        counts.repositoryComparisonsUnevaluable
      )
    );

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
      ),
      countGrid
    );

    receipt.textContent = JSON.stringify(receiptProjection, null, 2);
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
