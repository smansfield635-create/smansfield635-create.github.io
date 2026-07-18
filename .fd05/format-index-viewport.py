from pathlib import Path

path = Path('showroom/globe/h-earth/index.js')
text = path.read_text(encoding='utf-8')

helper_start = text.index('function isPositiveFiniteNumber(value) {')
helper_end = text.index('function safeSerialize(', helper_start)
helper_block = '''function isPositiveFiniteNumber(value) {
  return (
    Number.isFinite(value) &&
    value > 0
  );
}

function resolveRendererMountViewport(
  mountElement
) {
  const rectangle =
    typeof mountElement
      ?.getBoundingClientRect ===
    'function'
      ? mountElement
          .getBoundingClientRect()
      : null;

  const rectangleWidth =
    rectangle?.width;

  const rectangleHeight =
    rectangle?.height;

  const clientWidth =
    mountElement?.clientWidth;

  const clientHeight =
    mountElement?.clientHeight;

  const widthPx =
    isPositiveFiniteNumber(
      rectangleWidth
    )
      ? rectangleWidth
      : isPositiveFiniteNumber(
          clientWidth
        )
        ? clientWidth
        : null;

  const heightPx =
    isPositiveFiniteNumber(
      rectangleHeight
    )
      ? rectangleHeight
      : isPositiveFiniteNumber(
          clientHeight
        )
        ? clientHeight
        : null;

  const observedPixelRatio =
    globalThis.devicePixelRatio;

  const pixelRatio =
    isPositiveFiniteNumber(
      observedPixelRatio
    )
      ? observedPixelRatio
      : 1;

  const issues = [];

  if (!isPositiveFiniteNumber(widthPx)) {
    issues.push(
      'Renderer mount width must resolve to a positive finite number.'
    );
  }

  if (!isPositiveFiniteNumber(heightPx)) {
    issues.push(
      'Renderer mount height must resolve to a positive finite number.'
    );
  }

  return deepFreeze({
    receiptType:
      'H_EARTH_3D_ROUTE_RENDERER_MOUNT_VIEWPORT_RESOLUTION',

    eligible:
      issues.length === 0,

    status:
      issues.length === 0
        ? 'RENDERER_MOUNT_VIEWPORT_RESOLVED'
        : 'RENDERER_MOUNT_VIEWPORT_UNRESOLVED',

    widthPx,
    heightPx,
    pixelRatio,

    measurement:
      deepFreeze({
        rectangleWidth:
          Number.isFinite(
            rectangleWidth
          )
            ? rectangleWidth
            : null,

        rectangleHeight:
          Number.isFinite(
            rectangleHeight
          )
            ? rectangleHeight
            : null,

        clientWidth:
          Number.isFinite(
            clientWidth
          )
            ? clientWidth
            : null,

        clientHeight:
          Number.isFinite(
            clientHeight
          )
            ? clientHeight
            : null,

        pixelRatioFallbackUsed:
          !isPositiveFiniteNumber(
            observedPixelRatio
          )
      }),

    issues:
      Object.freeze([
        ...issues
      ])
  });
}

'''
text = text[:helper_start] + helper_block + text[helper_end:]

viewport_start_marker = '''  MODULE_STATE.rendererBootstrapStatus =
    H_EARTH_3D_RENDERER_BOOTSTRAP_STATUS
      .VIEWPORT_PENDING;
'''
viewport_end_marker = '''  MODULE_STATE.rendererBootstrapStatus =
    H_EARTH_3D_RENDERER_BOOTSTRAP_STATUS
      .HANDOFF_PENDING;
'''
viewport_start = text.index(viewport_start_marker)
viewport_end = text.index(viewport_end_marker, viewport_start)
viewport_block = '''  MODULE_STATE.rendererBootstrapStatus =
    H_EARTH_3D_RENDERER_BOOTSTRAP_STATUS
      .VIEWPORT_PENDING;

  const compositorViewportResolution =
    resolveRendererMountViewport(
      mountPoints.rendererMount
    );

  let compositorViewportReceipt;

  if (compositorViewportResolution.eligible) {
    try {
      compositorViewportReceipt =
        compositorEvaluation
          .viewportFunction({
            widthPx:
              compositorViewportResolution
                .widthPx,

            heightPx:
              compositorViewportResolution
                .heightPx,

            pixelRatio:
              compositorViewportResolution
                .pixelRatio
          });
    } catch (error) {
      compositorViewportReceipt =
        deepFreeze({
          receiptType:
            'H_EARTH_3D_ROUTE_COMPOSITOR_VIEWPORT_INITIALIZATION_RECEIPT',

          accepted:
            false,

          status:
            'COMPOSITOR_VIEWPORT_INITIALIZATION_THREW',

          resolution:
            compositorViewportResolution,

          ...getErrorEvidence(error),

          issues:
            Object.freeze([
              'The exact compositor viewport setter threw during route initialization.'
            ])
        });
    }
  } else {
    compositorViewportReceipt =
      deepFreeze({
        receiptType:
          'H_EARTH_3D_ROUTE_COMPOSITOR_VIEWPORT_INITIALIZATION_RECEIPT',

        accepted:
          false,

        status:
          'COMPOSITOR_VIEWPORT_MEASUREMENT_REJECTED',

        resolution:
          compositorViewportResolution,

        issues:
          compositorViewportResolution
            .issues
      });
  }

  if (
    !isActiveInitializationToken(
      token
    )
  ) {
    return createStaleRendererBootstrapReceipt({
      phase:
        'VIEWPORT_INITIALIZATION_RESOLUTION'
    });
  }

  MODULE_STATE.compositorViewportResolution =
    compositorViewportResolution;

  MODULE_STATE.compositorViewportReceipt =
    compositorViewportReceipt;

  const compositorViewportAccepted =
    compositorViewportReceipt
      ?.accepted ===
    true;

  const compositorViewportStatusAccepted =
    compositorViewportReceipt
      ?.status ===
      'VIEWPORT_STATE_UPDATED' ||
    compositorViewportReceipt
      ?.status ===
      'VIEWPORT_STATE_UNCHANGED';

  const compositorViewportWithinCapacity =
    compositorViewportReceipt
      ?.viewport
      ?.capacityStatus ===
    'WITHIN_CAPACITY';

  if (
    !compositorViewportAccepted ||
    !compositorViewportStatusAccepted ||
    !compositorViewportWithinCapacity
  ) {
    const primaryStatus =
      H_EARTH_3D_RENDERER_BOOTSTRAP_STATUS
        .VIEWPORT_REJECTED;

    MODULE_STATE.rendererBootstrapStatus =
      primaryStatus;

    const rendererReleaseReceipt =
      releaseRendererSafely({
        cleanupReason:
          primaryStatus
      });

    return deepFreeze({
      receiptType:
        'H_EARTH_3D_ROUTE_RENDERER_BOOTSTRAP_RECEIPT',

      completed:
        true,

      mounted:
        false,

      status:
        primaryStatus,

      failureVariant:
        compositorViewportReceipt
          ?.status ??
        'COMPOSITOR_VIEWPORT_INITIALIZATION_REJECTED',

      compositorEvaluation,

      compositorViewportResolution,

      compositorViewportReceipt:
        safeSerialize(
          compositorViewportReceipt,
          {
            maxDepth:
              7,

            maxArrayLength:
              100
          }
        ),

      moduleImportDiagnosticReceipt:
        MODULE_STATE
          .moduleImportDiagnosticReceipt,

      sourcePreviewRetained:
        sourcePreviewExists(
          mountPoints.rendererMount
        ),

      rendererReleaseReceipt,

      rendererPassClaim:
        false,

      visualPassClaim:
        false,

      validationClaim:
        false,

      productionClaim:
        false
    });
  }

'''
text = text[:viewport_start] + viewport_block + text[viewport_end:]

bad_state = '''      safeSerialize(
        MODULE_STATE
.compositorViewportReceipt
      ),'''
good_state = '''      safeSerialize(
        MODULE_STATE
          .compositorViewportReceipt
      ),'''
count = text.count(bad_state)
if count != 3:
    raise SystemExit(f'Expected three state receipt indentation matches, observed {count}')
text = text.replace(bad_state, good_state)

bad_options = '''        {
maxDepth:
  7,

maxArrayLength:
  100
        }'''
good_options = '''        {
          maxDepth:
            7,

          maxArrayLength:
            100
        }'''
count = text.count(bad_options)
if count != 1:
    raise SystemExit(f'Expected one success receipt options match, observed {count}')
text = text.replace(bad_options, good_options)

for forbidden in (
    '\n.getBoundingClientRect()',
    '\nclientWidth\n',
    '\nclientHeight\n',
    '\n.viewportFunction(',
    '\nreceiptType:\n',
    '\naccepted:\n',
    '\nprimaryStatus\n',
    '\n.compositorViewportReceipt\n'
):
    if forbidden in text:
        raise SystemExit(f'Formatting defect remains: {forbidden!r}')

path.write_text(text, encoding='utf-8')
