(() => {
  'use strict';

  const SOURCE_HEAD = '548672ae99cd406805f0c8ca576cc650baf7ed18';
  const PUBLIC_HTML_BLOB = '0daedf61f7e19af095f4db5fc47563a9cd786837';
  const PUBLIC_ORCHESTRATOR_BLOB = '2b0a916b3a6d11da84316925f8abd8a3a1447445';
  const PACKAGE = window.H_EARTH_R3F2_OFFLINE_PACKAGE_METADATA ?? null;
  const ROUTE_SRCDOC = window.H_EARTH_R3F2_ROUTE_SRCDOC ?? null;
  const MINIMUM_DURATION_MS = 600000;
  const RESPONSE_LIMIT_MS = 2000;
  const $ = (id) => document.getElementById(id);
  const frame = $('routeFrame');
  const state = {
    startEpoch: null, startMono: null, endEpoch: null, endMono: null,
    initial: null, final: null, initialImage: null, finalImage: null,
    events: [], proposals: [], orientations: [], visibility: [],
    orientationSet: new Set(), hiddenSeen: false, returned: false,
    lastProposal: 0, maxResponseMs: 0, complete: false, evidence: null
  };

  const orientation = () => matchMedia('(orientation: portrait)').matches ? 'PORTRAIT' : 'LANDSCAPE';
  const api = () => frame.contentWindow?.H_EARTH_RUN8E_PUBLIC_ROUTE ?? null;
  const receipt = () => api()?.getSnapshot?.() ?? null;
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const digest = async (bytes) => `sha256:${Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))).map((v) => v.toString(16).padStart(2, '0')).join('')}`;
  const fileDigest = async (file) => file ? digest(await file.arrayBuffer()) : null;
  const canvasImage = () => {
    try {
      const canvas = frame.contentDocument?.getElementById('h-earth-functional-landscape-canvas');
      return canvas instanceof HTMLCanvasElement ? canvas.toDataURL('image/png') : null;
    } catch { return null; }
  };
  const dataUrlDigest = async (url) => {
    if (!url) return null;
    const bytes = Uint8Array.from(atob(url.split(',')[1] ?? ''), (character) => character.charCodeAt(0));
    return digest(bytes.buffer);
  };

  function recordOrientation(reason) {
    const value = orientation();
    state.orientationSet.add(value);
    state.orientations.push({ reason, orientation: value, epochMs: Date.now(), monotonicMs: performance.now(), width: innerWidth, height: innerHeight });
  }
  function recordVisibility() {
    state.visibility.push({ state: document.visibilityState, epochMs: Date.now(), monotonicMs: performance.now() });
    if (document.visibilityState === 'hidden') state.hiddenSeen = true;
    if (document.visibilityState === 'visible' && state.hiddenSeen) state.returned = true;
  }
  function collect(eventType, event) {
    const current = receipt();
    if (!current) return;
    const now = performance.now();
    const delta = Number.isFinite(event?.timeStamp) ? now - event.timeStamp : 0;
    const responseMs = delta >= 0 && delta < 60000 ? delta : 0;
    for (const proposal of (current.intake?.proposals ?? []).filter((item) => item.sequence > state.lastProposal)) {
      state.maxResponseMs = Math.max(state.maxResponseMs, responseMs);
      state.proposals.push({ eventType, responseMs, capturedAtEpochMs: Date.now(), proposal, visibleFrameCount: current.liveGpu?.counters?.gpuFramebufferPresentationCount ?? 0 });
      state.lastProposal = Math.max(state.lastProposal, proposal.sequence);
    }
  }
  function instrument() {
    const canvas = frame.contentDocument?.getElementById('h-earth-functional-landscape-canvas');
    if (!(canvas instanceof HTMLCanvasElement)) throw new Error('R3F2_CANVAS_NOT_FOUND');
    for (const type of ['pointerdown', 'pointermove', 'pointerup', 'pointercancel']) {
      canvas.addEventListener(type, (event) => {
        state.events.push({ type, pointerType: event.pointerType, pointerId: event.pointerId, epochMs: Date.now(), monotonicMs: performance.now(), x: event.clientX, y: event.clientY });
        queueMicrotask(() => collect(type, event));
      }, { passive: true });
    }
    state.initial = receipt();
    state.lastProposal = state.initial?.intake?.counters?.navigationProposalCount ?? 0;
    state.initialImage = canvasImage();
  }
  function updateClock() {
    if (!state.startMono || state.complete) return;
    const remaining = Math.max(0, MINIMUM_DURATION_MS - (performance.now() - state.startMono));
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    $('phaseNotice').textContent = remaining > 0
      ? `Physical session active · ${minutes}:${String(seconds).padStart(2, '0')} minimum remaining · ${orientation()}`
      : `Ten-minute minimum complete · ${orientation()} · finish control available`;
    if (remaining === 0) $('finishBar').style.display = 'block';
    requestAnimationFrame(updateClock);
  }

  addEventListener('resize', () => recordOrientation('RESIZE'));
  addEventListener('orientationchange', () => recordOrientation('ORIENTATION_CHANGE'));
  document.addEventListener('visibilitychange', recordVisibility);

  $('startButton').addEventListener('click', () => {
    if (!$('deviceModel').value.trim() || !$('attestation').value.trim()) {
      $('setupStatus').textContent = 'Device class and operator attestation are required before starting.';
      return;
    }
    if (!PACKAGE || typeof ROUTE_SRCDOC !== 'string') {
      $('setupStatus').textContent = 'Signed offline H-Earth package is incomplete.';
      return;
    }
    $('setup').classList.add('hidden');
    $('session').classList.remove('hidden');
    state.startEpoch = Date.now();
    state.startMono = performance.now();
    recordOrientation('SESSION_START');
    frame.srcdoc = ROUTE_SRCDOC;
  });

  frame.addEventListener('load', async () => {
    const deadline = performance.now() + 30000;
    while (!api()?.ready && performance.now() < deadline) await sleep(100);
    if (!api()?.ready) {
      $('phaseNotice').textContent = 'Embedded H-Earth route did not become ready.';
      return;
    }
    try {
      instrument();
      $('phaseNotice').textContent = 'H-Earth ready. Begin physical interaction.';
      requestAnimationFrame(updateClock);
    } catch (error) {
      $('phaseNotice').textContent = `Instrumentation failed: ${error.message}`;
    }
  });

  $('finishButton').addEventListener('click', () => {
    state.endEpoch = Date.now();
    state.endMono = performance.now();
    state.final = receipt();
    state.finalImage = canvasImage();
    state.complete = true;
    recordOrientation('SESSION_END');
    $('session').classList.add('hidden');
    $('results').classList.remove('hidden');
    const duration = state.endMono - state.startMono;
    $('metrics').innerHTML = [
      ['Duration', `${Math.round(duration / 1000)} seconds`],
      ['Transport', 'SIGNED_OFFLINE_PACKAGE'],
      ['Orientations', [...state.orientationSet].join(', ') || 'none'],
      ['Background return', String(state.returned)],
      ['Accepted proposals', String(state.final?.intake?.counters?.acceptedNavigationProposalCount ?? 0)],
      ['Visible GPU frames', String(state.final?.liveGpu?.counters?.gpuFramebufferPresentationCount ?? 0)],
      ['Maximum response', `${state.maxResponseMs.toFixed(2)} ms`]
    ].map(([key, value]) => `<div class="metric"><span>${key}</span><strong>${value}</strong></div>`).join('');
    $('resultStatus').textContent = 'Select the native recording and screenshot, then build the evidence JSON.';
  });

  $('buildButton').addEventListener('click', async () => {
    const recording = $('recordingFile').files[0] ?? null;
    const pageScreenshot = $('pageScreenshotFile').files[0] ?? null;
    if (!recording || !pageScreenshot) {
      $('resultStatus').textContent = 'Both the native screen recording and native page screenshot are required.';
      return;
    }
    const runtime = state.final?.runtimeExclusivity ?? {};
    const live = state.final?.liveGpu ?? {};
    const duration = state.endMono - state.startMono;
    const actions = new Set(state.proposals.map((row) => row.proposal?.intent?.action));
    const interactionResults = {
      oneFingerLook: state.proposals.some((row) => row.proposal?.inputClass === 'ONE_FINGER_LOOK'),
      twoFingerForwardTravel: actions.has('MOVE_FORWARD'),
      twoFingerBackwardTravel: actions.has('MOVE_BACKWARD'),
      pinchZoomIn: actions.has('ZOOM_IN'),
      pinchZoomOut: actions.has('ZOOM_OUT'),
      immediatePerspectiveFeedback: state.maxResponseMs < RESPONSE_LIMIT_MS,
      continuousDirectInspection: duration >= MINIMUM_DURATION_MS,
      realTimeGpuPresentation: (live.counters?.gpuFramebufferPresentationCount ?? 0) > (state.initial?.liveGpu?.counters?.gpuFramebufferPresentationCount ?? 0),
      portrait: state.orientationSet.has('PORTRAIT'),
      landscape: state.orientationSet.has('LANDSCAPE'),
      orientationTransition: state.orientationSet.size >= 2,
      backgroundReturn: state.returned,
      noVisibleController: frame.contentDocument?.querySelectorAll('[data-navigation-controller],.joystick,.virtual-stick,.mobile-controller').length === 0,
      noFlatBitmapDragging: runtime.cssBitmapPreview === false,
      noWorldRebuildDuringGesture: runtime.cpuWorldRebuildPerCameraChange === false,
      noMultiSecondInputBacklog: state.maxResponseMs < RESPONSE_LIMIT_MS
    };
    const descriptor = `${PACKAGE.signatureClass}|${PACKAGE.packageHead}|${SOURCE_HEAD}|${PUBLIC_HTML_BLOB}|${PUBLIC_ORCHESTRATOR_BLOB}`;
    state.evidence = {
      evidenceId: `H_EARTH_R3F2_REFERENCE_ANDROID_${new Date(state.startEpoch).toISOString().replace(/[:.]/g, '-')}`,
      capturedAt: new Date(state.endEpoch).toISOString(),
      deviceLaneId: 'R3F_REFERENCE_ANDROID_PHYSICAL',
      physicalityClass: 'PHYSICAL_LOCAL',
      deviceModelOrRedactedClass: $('deviceModel').value.trim(),
      operatingSystemFamily: /Android/i.test(navigator.userAgent) ? 'ANDROID' : 'UNKNOWN',
      operatingSystemVersion: navigator.userAgent.match(/Android\s([^;]+)/i)?.[1] ?? null,
      browserClass: 'ANDROID_CHROMIUM',
      browserVersion: navigator.userAgent.match(/Chrome\/(\d+(?:\.\d+)*)/i)?.[1] ?? null,
      viewportCssPixels: { width: innerWidth, height: innerHeight },
      devicePixelRatio,
      orientation: [...state.orientationSet],
      previewTransportClass: 'SIGNED_OFFLINE_PACKAGE',
      packageSignatureClass: PACKAGE.signatureClass,
      previewPackageSha256: await digest(new TextEncoder().encode(descriptor)),
      previewPackageHead: PACKAGE.packageHead,
      previewLauncherUrl: location.href,
      immutableRouteUrl: 'srcdoc://h-earth-run8e-r3f2',
      sourceHead: SOURCE_HEAD,
      publicHtmlGitBlob: PUBLIC_HTML_BLOB,
      publicOrchestratorGitBlob: PUBLIC_ORCHESTRATOR_BLOB,
      interactionResults,
      timingResults: {
        maximumObservedInputToVisibleResponseMs: state.maxResponseMs,
        maximumObservedFrozenPresentationMs: state.maxResponseMs,
        obsoleteInputBacklogObserved: state.maxResponseMs >= RESPONSE_LIMIT_MS,
        continuousInteractionDurationMs: duration,
        timingMethod: 'INSTRUMENTED_TRACE_WITH_MONOTONIC_TIMESTAMPS'
      },
      runtimeExclusivityResults: {
        activeWebGL2ContextCount: runtime.activeWebGL2ContextCount ?? null,
        activePersistentRendererCount: runtime.activePersistentRendererCount ?? null,
        activeNavigationStreamCount: runtime.activeNavigationStateStreamCount ?? null,
        activePointerTouchIntakeCount: runtime.activePointerTouchIntakeCount ?? null,
        activeFramePresentationAuthorityCount: runtime.activeFramePresentationAuthorityCount ?? null,
        canvas2DContextCount: live.resources?.counters?.canvas2DContextCount ?? 0,
        legacyModuleRequestCount: runtime.legacyModuleScriptCount ?? 0,
        duplicateInputListenerCount: runtime.duplicatePointerListeners ? 1 : 0,
        worldRebuildDuringGestureCount: live.counters?.worldRebuildCount ?? 0
      },
      captureArtifacts: {
        screenRecording: { name: recording.name, size: recording.size, sha256: await fileDigest(recording) },
        initialScreenshot: { mediaType: 'image/png', sha256: await dataUrlDigest(state.initialImage), dataUrl: state.initialImage },
        postInteractionScreenshot: { mediaType: 'image/png', sha256: await dataUrlDigest(state.finalImage), dataUrl: state.finalImage },
        pageOrEnvironmentScreenshot: { name: pageScreenshot.name, size: pageScreenshot.size, sha256: await fileDigest(pageScreenshot) },
        rawInstrumentedTrace: { eventTrace: state.events, proposalTrace: state.proposals, orientationEvents: state.orientations, visibilityEvents: state.visibility }
      },
      publicRouteInitialReceipt: state.initial,
      publicRouteFinalReceipt: state.final,
      operatorAttestation: $('attestation').value.trim(),
      acceptanceCandidate: Object.values(interactionResults).every(Boolean),
      boundaries: {
        productionDeployment: false,
        publicSourceMutation: false,
        samsungOnlyImplementationClaim: false,
        broaderMobileAcceptanceClaim: false,
        r3F2PassClosedClaim: false,
        run8EPassClosedClaim: false
      }
    };
    $('downloadButton').disabled = false;
    $('resultStatus').textContent = `Evidence JSON built. Candidate acceptance: ${state.evidence.acceptanceCandidate}.`;
  });

  $('downloadButton').addEventListener('click', () => {
    if (!state.evidence) return;
    const blob = new Blob([`${JSON.stringify(state.evidence, null, 2)}\n`], { type: 'application/json' });
    const anchor = document.createElement('a');
    anchor.href = URL.createObjectURL(blob);
    anchor.download = `${state.evidence.evidenceId}.json`;
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(anchor.href), 1000);
  });
})();
