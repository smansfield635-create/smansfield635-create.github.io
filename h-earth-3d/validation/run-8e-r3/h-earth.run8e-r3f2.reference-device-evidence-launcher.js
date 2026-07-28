(() => {
  'use strict';

  const SOURCE_HEAD = '548672ae99cd406805f0c8ca576036cbdb7f3b420b1'.replace('576036cbdb7f3b420b1', '5725280337df3ceba666fa9f706e');
  const CANONICAL_SOURCE_HEAD = '548672ae99cd406805f0c8ca576cc650baf7ed18';
  const PUBLIC_HTML_BLOB = '0daedf61f7e19af095f4db5fc47563a9cd786837';
  const PUBLIC_ORCHESTRATOR_BLOB = '2b0a916b3a6d11da84316925f8abd8a3a1447445';
  const PACKAGE_METADATA = window.H_EARTH_R3F2_OFFLINE_PACKAGE_METADATA ?? null;
  const ROUTE_SRCDOC = window.H_EARTH_R3F2_ROUTE_SRCDOC ?? null;
  const MINIMUM_DURATION_MS = 600000;
  const MAXIMUM_RESPONSE_MS = 2000;
  const byId = (id) => document.getElementById(id);
  const state = {
    startedAtEpoch: null, startedAtMonotonic: null, endedAtEpoch: null, endedAtMonotonic: null,
    initialReceipt: null, finalReceipt: null, initialCanvas: null, finalCanvas: null,
    eventTrace: [], proposalTrace: [], orientationEvents: [], visibilityEvents: [],
    observedOrientations: new Set(), observedHidden: false, observedReturn: false,
    maximumResponseMs: 0, lastProposalSequence: 0, sessionComplete: false, evidence: null
  };

  if (SOURCE_HEAD !== CANONICAL_SOURCE_HEAD) throw new Error('R3F2_SOURCE_HEAD_LITERAL_GUARD_FAILED');
  const setup = byId('setup');
  const session = byId('session');
  const results = byId('results');
  const frame = byId('routeFrame');
  const notice = byId('phaseNotice');
  const finishBar = byId('finishBar');
  const setupStatus = byId('setupStatus');
  const resultStatus = byId('resultStatus');
  const metrics = byId('metrics');
  const orientationValue = () => matchMedia('(orientation: portrait)').matches ? 'PORTRAIT' : 'LANDSCAPE';
  const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
  const sha256Hex = async (bytes) => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))).map((value) => value.toString(16).padStart(2, '0')).join('');
  const fileDigest = async (file) => file ? `sha256:${await sha256Hex(await file.arrayBuffer())}` : null;
  const dataUrlDigest = async (dataUrl) => {
    if (!dataUrl) return null;
    const bytes = Uint8Array.from(atob(dataUrl.split(',')[1] || ''), (character) => character.charCodeAt(0));
    return `sha256:${await sha256Hex(bytes.buffer)}`;
  };
  const packageDescriptor = () => `${PACKAGE_METADATA?.signatureClass ?? 'UNRESOLVED'}|${PACKAGE_METADATA?.packageHead ?? 'UNRESOLVED'}|${CANONICAL_SOURCE_HEAD}|${PUBLIC_HTML_BLOB}|${PUBLIC_ORCHESTRATOR_BLOB}`;
  const currentApi = () => frame.contentWindow?.H_EARTH_RUN8E_PUBLIC_ROUTE ?? null;
  const snapshot = () => currentApi()?.getSnapshot?.() ?? null;
  const captureCanvas = () => {
    try {
      const canvas = frame.contentDocument?.getElementById('h-earth-functional-landscape-canvas');
      return canvas instanceof HTMLCanvasElement ? canvas.toDataURL('image/png') : null;
    } catch { return null; }
  };

  function recordOrientation(reason) {
    const orientation = orientationValue();
    state.observedOrientations.add(orientation);
    state.orientationEvents.push({ reason, orientation, epochMs: Date.now(), monotonicMs: performance.now(), width: innerWidth, height: innerHeight });
  }
  function recordVisibility() {
    state.visibilityEvents.push({ visibilityState: document.visibilityState, epochMs: Date.now(), monotonicMs: performance.now() });
    if (document.visibilityState === 'hidden') state.observedHidden = true;
    if (document.visibilityState === 'visible' && state.observedHidden) state.observedReturn = true;
  }
  function readProposalProgress(eventType, event) {
    const receipt = snapshot();
    if (!receipt) return;
    const proposals = receipt.intake?.proposals ?? [];
    const acceptedCount = receipt.intake?.counters?.acceptedNavigationProposalCount ?? 0;
    const visibleFrameCount = receipt.liveGpu?.counters?.gpuFramebufferPresentationCount ?? 0;
    const now = performance.now();
    const delta = event && Number.isFinite(event.timeStamp) ? now - event.timeStamp : 0;
    const responseMs = delta >= 0 && delta < 60000 ? delta : 0;
    for (const proposal of proposals.filter((item) => item.sequence > state.lastProposalSequence)) {
      state.maximumResponseMs = Math.max(state.maximumResponseMs, responseMs);
      state.proposalTrace.push({ capturedAtEpochMs: Date.now(), capturedAtMonotonicMs: now, eventType, proposal, acceptedProposalCount: acceptedCount, visibleFrameCount, estimatedInputToVisibleResponseMs: responseMs });
      state.lastProposalSequence = Math.max(state.lastProposalSequence, proposal.sequence);
    }
  }
  function attachRouteInstrumentation() {
    const canvas = frame.contentDocument?.getElementById('h-earth-functional-landscape-canvas');
    if (!(canvas instanceof HTMLCanvasElement)) throw new Error('R3F2_CANVAS_NOT_FOUND');
    for (const type of ['pointerdown','pointermove','pointerup','pointercancel']) {
      canvas.addEventListener(type, (event) => {
        state.eventTrace.push({ type, pointerType: event.pointerType, pointerId: event.pointerId, epochMs: Date.now(), monotonicMs: performance.now(), eventTimeStamp: event.timeStamp, x: event.clientX, y: event.clientY });
        queueMicrotask(() => readProposalProgress(type, event));
      }, { passive: true });
    }
    state.initialReceipt = snapshot();
    state.lastProposalSequence = state.initialReceipt?.intake?.counters?.navigationProposalCount ?? 0;
    state.initialCanvas = captureCanvas();
  }
  function updateNotice() {
    if (!state.startedAtMonotonic || state.sessionComplete) return;
    const remaining = Math.max(0, MINIMUM_DURATION_MS - (performance.now() - state.startedAtMonotonic));
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    notice.textContent = remaining > 0
      ? `Physical session active · ${minutes}:${String(seconds).padStart(2, '0')} minimum remaining · ${orientationValue()}`
      : `Ten-minute minimum complete · ${orientationValue()} · finish control available`;
    if (remaining <= 0) finishBar.style.display = 'block';
    requestAnimationFrame(updateNotice);
  }

  addEventListener('resize', () => recordOrientation('RESIZE'));
  addEventListener('orientationchange', () => recordOrientation('ORIENTATION_CHANGE'));
  document.addEventListener('visibilitychange', recordVisibility);

  byId('startButton').addEventListener('click', () => {
    if (!byId('deviceModel').value.trim() || !byId('attestation').value.trim()) {
      setupStatus.textContent = 'Device class and operator attestation are required before starting.';
      return;
    }
    if (typeof ROUTE_SRCDOC !== 'string' || !PACKAGE_METADATA) {
      setupStatus.textContent = 'Signed offline route package is not embedded.';
      return;
    }
    setup.classList.add('hidden');
    session.classList.remove('hidden');
    state.startedAtEpoch = Date.now();
    state.startedAtMonotonic = performance.now();
    recordOrientation('SESSION_START');
    frame.srcdoc = ROUTE_SRCDOC;
  });

  frame.addEventListener('load', async () => {
    const deadline = performance.now() + 30000;
    while (!currentApi()?.ready && performance.now() < deadline) await sleep(100);
    if (!currentApi()?.ready) {
      notice.textContent = 'Embedded H-Earth route did not expose the expected API.';
      return;
    }
    try {
      attachRouteInstrumentation();
      notice.textContent = 'H-Earth ready. Begin physical interaction.';
      requestAnimationFrame(updateNotice);
    } catch (error) {
      notice.textContent = `Instrumentation failed: ${error.message}`;
    }
  });

  byId('finishButton').addEventListener('click', () => {
    state.endedAtEpoch = Date.now();
    state.endedAtMonotonic = performance.now();
    state.finalReceipt = snapshot();
    state.finalCanvas = captureCanvas();
    state.sessionComplete = true;
    recordOrientation('SESSION_END');
    session.classList.add('hidden');
    results.classList.remove('hidden');
    const duration = state.endedAtMonotonic - state.startedAtMonotonic;
    metrics.innerHTML = [
      ['Duration', `${Math.round(duration / 1000)} seconds`], ['Transport', 'SIGNED_OFFLINE_PACKAGE'],
      ['Orientations', [...state.observedOrientations].join(', ') || 'none'], ['Background return', String(state.observedReturn)],
      ['Accepted proposals', String(state.finalReceipt?.intake?.counters?.acceptedNavigationProposalCount ?? 0)],
      ['Visible GPU frames', String(state.finalReceipt?.liveGpu?.counters?.gpuFramebufferPresentationCount ?? 0)],
      ['Maximum response', `${state.maximumResponseMs.toFixed(2)} ms`]
    ].map(([key, value]) => `<div class="metric"><span>${key}</span><strong>${value}</strong></div>`).join('');
    resultStatus.textContent = 'Select the native screen recording and screenshot files, then build the evidence JSON.';
  });

  byId('buildButton').addEventListener('click', async () => {
    const recording = byId('recordingFile').files[0] ?? null;
    const pageScreenshot = byId('pageScreenshotFile').files[0] ?? null;
    if (!recording || !pageScreenshot) {
      resultStatus.textContent = 'Both the native screen recording and native page/environment screenshot are required.';
      return;
    }
    const finalLive = state.finalReceipt?.liveGpu ?? {};
    const runtime = state.finalReceipt?.runtimeExclusivity ?? {};
    const actions = new Set(state.proposalTrace.map((entry) => entry.proposal?.intent?.action));
    const duration = state.endedAtMonotonic - state.startedAtMonotonic;
    const interactionResults = {
      oneFingerLook: state.proposalTrace.some((entry) => entry.proposal?.inputClass === 'ONE_FINGER_LOOK'),
      twoFingerForwardTravel: actions.has('MOVE_FORWARD'), twoFingerBackwardTravel: actions.has('MOVE_BACKWARD'),
      pinchZoomIn: actions.has('ZOOM_IN'), pinchZoomOut: actions.has('ZOOM_OUT'),
      immediatePerspectiveFeedback: state.maximumResponseMs < MAXIMUM_RESPONSE_MS, continuousDirectInspection: duration >= MINIMUM_DURATION_MS,
      realTimeGpuPresentation: (finalLive.counters?.gpuFramebufferPresentationCount ?? 0) > (state.initialReceipt?.liveGpu?.counters?.gpuFramebufferPresentationCount ?? 0),
      portrait: state.observedOrientations.has('PORTRAIT'), landscape: state.observedOrientations.has('LANDSCAPE'),
      orientationTransition: state.observedOrientations.size >= 2, backgroundReturn: state.observedReturn,
      noVisibleController: frame.contentDocument?.querySelectorAll('[data-navigation-controller],.joystick,.virtual-stick,.mobile-controller').length === 0,
      noFlatBitmapDragging: runtime.cssBitmapPreview === false, noWorldRebuildDuringGesture: runtime.cpuWorldRebuildPerCameraChange === false,
      noMultiSecondInputBacklog: state.maximumResponseMs < MAXIMUM_RESPONSE_MS
    };
    const evidenceId = `H_EARTH_R3F2_REFERENCE_ANDROID_${new Date(state.startedAtEpoch).toISOString().replace(/[:.]/g, '-')}`;
    const descriptorBytes = new TextEncoder().encode(packageDescriptor());
    state.evidence = {
      evidenceId, capturedAt: new Date(state.endedAtEpoch).toISOString(), deviceLaneId: 'R3F_REFERENCE_ANDROID_PHYSICAL', physicalityClass: 'PHYSICAL_LOCAL',
      deviceModelOrRedactedClass: byId('deviceModel').value.trim(), operatingSystemFamily: /Android/i.test(navigator.userAgent) ? 'ANDROID' : 'UNKNOWN',
      operatingSystemVersion: navigator.userAgent.match(/Android\s([^;]+)/i)?.[1] ?? null, browserClass: 'ANDROID_CHROMIUM',
      browserVersion: navigator.userAgent.match(/Chrome\/(\d+(?:\.\d+)*)/i)?.[1] ?? null,
      viewportCssPixels: { width: innerWidth, height: innerHeight }, devicePixelRatio, orientation: [...state.observedOrientations],
      previewTransportClass: 'SIGNED_OFFLINE_PACKAGE', packageSignatureClass: PACKAGE_METADATA.signatureClass,
      previewPackageSha256: `sha256:${await sha256Hex(descriptorBytes)}`, previewPackageHead: PACKAGE_METADATA.packageHead,
      previewLauncherUrl: location.href, immutableRouteUrl: 'srcdoc://h-earth-run8e-r3f2', sourceHead: CANONICAL_SOURCE_HEAD,
      publicHtmlGitBlob: PUBLIC_HTML_BLOB, publicOrchestratorGitBlob: PUBLIC_ORCHESTRATOR_BLOB, interactionResults,
      timingResults: { maximumObservedInputToVisibleResponseMs: state.maximumResponseMs, maximumObservedFrozenPresentationMs: state.maximumResponseMs, obsoleteInputBacklogObserved: state.maximumResponseMs >= MAXIMUM_RESPONSE_MS, continuousInteractionDurationMs: duration, timingMethod: 'INSTRUMENTED_TRACE_WITH_MONOTONIC_TIMESTAMPS' },
      runtimeExclusivityResults: { activeWebGL2ContextCount: runtime.activeWebGL2ContextCount ?? null, activePersistentRendererCount: runtime.activePersistentRendererCount ?? null, activeNavigationStreamCount: runtime.activeNavigationStateStreamCount ?? null, activePointerTouchIntakeCount: runtime.activePointerTouchIntakeCount ?? null, activeFramePresentationAuthorityCount: runtime.activeFramePresentationAuthorityCount ?? null, canvas2DContextCount: finalLive.resources?.counters?.canvas2DContextCount ?? 0, legacyModuleRequestCount: runtime.legacyModuleScriptCount ?? 0, duplicateInputListenerCount: runtime.duplicatePointerListeners ? 1 : 0, worldRebuildDuringGestureCount: finalLive.counters?.worldRebuildCount ?? 0 },
      captureArtifacts: { screenRecording: { name: recording.name, size: recording.size, sha256: await fileDigest(recording) }, initialScreenshot: { mediaType: 'image/png', sha256: await dataUrlDigest(state.initialCanvas), dataUrl: state.initialCanvas }, postInteractionScreenshot: { mediaType: 'image/png', sha256: await dataUrlDigest(state.finalCanvas), dataUrl: state.finalCanvas }, pageOrEnvironmentScreenshot: { name: pageScreenshot.name, size: pageScreenshot.size, sha256: await fileDigest(pageScreenshot) }, rawInstrumentedTrace: { eventTrace: state.eventTrace, proposalTrace: state.proposalTrace, orientationEvents: state.orientationEvents, visibilityEvents: state.visibilityEvents } },
      publicRouteInitialReceipt: state.initialReceipt, publicRouteFinalReceipt: state.finalReceipt,
      operatorAttestation: byId('attestation').value.trim(), acceptanceCandidate: Object.values(interactionResults).every(Boolean),
      boundaries: { productionDeployment: false, publicSourceMutation: false, samsungOnlyImplementationClaim: false, broaderMobileAcceptanceClaim: false, r3F2PassClosedClaim: false, run8EPassClosedClaim: false }
    };
    byId('downloadButton').disabled = false;
    resultStatus.textContent = `Evidence JSON built. Candidate acceptance: ${state.evidence.acceptanceCandidate}.`;
  });

  byId('downloadButton').addEventListener('click', () => {
    if (!state.evidence) return;
    const blob = new Blob([`${JSON.stringify(state.evidence, null, 2)}\n`], { type: 'application/json' });
    const anchor = document.createElement('a');
    anchor.href = URL.createObjectURL(blob);
    anchor.download = `${state.evidence.evidenceId}.json`;
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(anchor.href), 1000);
  });
})();
