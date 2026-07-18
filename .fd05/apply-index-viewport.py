from pathlib import Path

path = Path('showroom/globe/h-earth/index.js')
text = path.read_text(encoding='utf-8')

def replace_once(label, old, new):
    global text
    count = text.count(old)
    if count != 1:
        raise SystemExit(f'{label}: expected exactly one match, observed {count}')
    text = text.replace(old, new, 1)

def replace_all_min(label, old, new, minimum):
    global text
    count = text.count(old)
    if count < minimum:
        raise SystemExit(f'{label}: expected at least {minimum} matches, observed {count}')
    text = text.replace(old, new)
    print(f'{label}: replaced {count} occurrences')

replace_once(
    'canonical corridor comment',
    """ * → EXACT COMPOSITOR CONTRACT VERIFICATION
 * → EXACT RENDERER CONTRACT VERIFICATION
 * → COMPOSITOR RENDERER HANDOFF REQUEST
""",
    """ * → EXACT COMPOSITOR CONTRACT VERIFICATION
 * → EXACT RENDERER CONTRACT VERIFICATION
 * → COMPOSITOR VIEWPORT RESOLUTION AND INITIALIZATION
 * → COMPOSITOR RENDERER HANDOFF REQUEST
"""
)

replace_once(
    'viewport bootstrap statuses',
    """    API_REJECTED:
      'EXACT_COMPOSITOR_OR_RENDERER_API_REJECTED',

    HANDOFF_PENDING:
      'COMPOSITOR_HANDOFF_PENDING',
""",
    """    API_REJECTED:
      'EXACT_COMPOSITOR_OR_RENDERER_API_REJECTED',

    VIEWPORT_PENDING:
      'COMPOSITOR_VIEWPORT_INITIALIZATION_PENDING',

    VIEWPORT_REJECTED:
      'COMPOSITOR_VIEWPORT_INITIALIZATION_REJECTED',

    HANDOFF_PENDING:
      'COMPOSITOR_HANDOFF_PENDING',
"""
)

replace_once(
    'mount viewport helper',
    """function getById(rootDocument, id) {
  if (
    !rootDocument ||
    typeof rootDocument.getElementById !==
      'function'
  ) {
    return null;
  }

  return rootDocument.getElementById(id);
}

function safeSerialize(
""",
    """function getById(rootDocument, id) {
  if (
    !rootDocument ||
    typeof rootDocument.getElementById !==
      'function'
  ) {
    return null;
  }

  return rootDocument.getElementById(id);
}

function isPositiveFiniteNumber(value) {
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
Number.isFinite(clientWidth)
  ? clientWidth
  : null,

        clientHeight:
Number.isFinite(clientHeight)
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

function safeSerialize(
"""
)

replace_once(
    'execution ceiling viewport consumption',
    """    compositorHandoffRequestedMayBecomeTrue:
      true,

    rendererConstructionAttemptedMayBecomeTrue:
""",
    """    compositorHandoffRequestedMayBecomeTrue:
      true,

    compositorViewportInitializationAttemptedMayBecomeTrue:
      true,

    rendererConstructionAttemptedMayBecomeTrue:
"""
)

replace_once(
    'boundary viewport initialization authorization',
    """    compositorHandoffConsumptionAuthorized:
      true,

    rendererConstructionAuthorized:
""",
    """    compositorHandoffConsumptionAuthorized:
      true,

    compositorViewportInitializationAuthorized:
      true,

    rendererConstructionAuthorized:
"""
)

replace_once(
    'module state viewport evidence',
    """  compositorHandoffReceipt:
    null,

  rendererModule:
""",
    """  compositorHandoffReceipt:
    null,

  compositorViewportResolution:
    null,

  compositorViewportReceipt:
    null,

  rendererModule:
"""
)

replace_once(
    'occurrence reset viewport evidence',
    """  MODULE_STATE.compositorHandoffReceipt =
    null;

  MODULE_STATE.rendererModule =
""",
    """  MODULE_STATE.compositorHandoffReceipt =
    null;

  MODULE_STATE.compositorViewportResolution =
    null;

  MODULE_STATE.compositorViewportReceipt =
    null;

  MODULE_STATE.rendererModule =
"""
)

replace_once(
    'compositor exact API evaluation',
    """function evaluateCompositorModule(
  compositorModule
) {
  const handoffFunction =
    compositorModule
      ?.getHEarth3DCompositorRendererHandoff;

  const contractId =
    compositorModule
      ?.H_EARTH_3D_COMPOSITOR_CONTRACT_ID ??
    null;

  const contractMatchesExpected =
    contractId ===
    H_EARTH_3D_EXPECTED_COMPOSITOR_CONTRACT_ID;

  return deepFreeze({
    eligible:
      contractMatchesExpected &&
      typeof handoffFunction ===
        'function',

    expectedContractId:
      H_EARTH_3D_EXPECTED_COMPOSITOR_CONTRACT_ID,

    actualContractId:
      contractId,

    contractMatchesExpected,

    exactHandoffExportPresent:
      typeof handoffFunction ===
      'function',

    handoffFunction:
      typeof handoffFunction ===
      'function'
        ? handoffFunction
        : null
  });
}
""",
    """function evaluateCompositorModule(
  compositorModule
) {
  const viewportFunction =
    compositorModule
      ?.setHEarth3DCompositorViewport;

  const handoffFunction =
    compositorModule
      ?.getHEarth3DCompositorRendererHandoff;

  const contractId =
    compositorModule
      ?.H_EARTH_3D_COMPOSITOR_CONTRACT_ID ??
    null;

  const contractMatchesExpected =
    contractId ===
    H_EARTH_3D_EXPECTED_COMPOSITOR_CONTRACT_ID;

  return deepFreeze({
    eligible:
      contractMatchesExpected &&
      typeof viewportFunction ===
        'function' &&
      typeof handoffFunction ===
        'function',

    expectedContractId:
      H_EARTH_3D_EXPECTED_COMPOSITOR_CONTRACT_ID,

    actualContractId:
      contractId,

    contractMatchesExpected,

    exactViewportExportPresent:
      typeof viewportFunction ===
      'function',

    exactHandoffExportPresent:
      typeof handoffFunction ===
      'function',

    viewportFunction:
      typeof viewportFunction ===
      'function'
        ? viewportFunction
        : null,

    handoffFunction:
      typeof handoffFunction ===
      'function'
        ? handoffFunction
        : null
  });
}
"""
)

replace_once(
    'viewport initialization before handoff',
    """  MODULE_STATE.rendererBootstrapStatus =
    H_EARTH_3D_RENDERER_BOOTSTRAP_STATUS
      .HANDOFF_PENDING;

  let compositorHandoff;
""",
    """  MODULE_STATE.rendererBootstrapStatus =
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

  MODULE_STATE.rendererBootstrapStatus =
    H_EARTH_3D_RENDERER_BOOTSTRAP_STATUS
      .HANDOFF_PENDING;

  let compositorHandoff;
"""
)

replace_all_min(
    'state viewport evidence in route receipts',
    """    compositorHandoffReceipt:
      MODULE_STATE
        .compositorHandoffReceipt,
""",
    """    compositorViewportResolution:
      MODULE_STATE
        .compositorViewportResolution,

    compositorViewportReceipt:
      safeSerialize(
        MODULE_STATE
.compositorViewportReceipt
      ),

    compositorHandoffReceipt:
      MODULE_STATE
        .compositorHandoffReceipt,
""",
    3
)

replace_once(
    'success receipt viewport evidence',
    """    compositorHandoffReceipt:
      localCompositorHandoffReceipt,

    rendererConstructReceipt:
""",
    """    compositorViewportResolution:
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

    compositorHandoffReceipt:
      localCompositorHandoffReceipt,

    rendererConstructReceipt:
"""
)

replace_once(
    'static exact compositor viewport export',
    """    exactCompositorHandoffExport:
      'getHEarth3DCompositorRendererHandoff',

    exactRendererConstructExport:
""",
    """    exactCompositorViewportExport:
      'setHEarth3DCompositorViewport',

    exactCompositorHandoffExport:
      'getHEarth3DCompositorRendererHandoff',

    compositorViewportInitializedBeforeHandoff:
      true,

    exactRendererConstructExport:
"""
)

if "setHEarth3DCompositorViewport" not in text:
    raise SystemExit('viewport setter identifier missing after transformation')
if text.count("COMPOSITOR_VIEWPORT_INITIALIZATION_PENDING") != 1:
    raise SystemExit('viewport pending status count invalid')
if text.count("COMPOSITOR_VIEWPORT_INITIALIZATION_REJECTED") < 1:
    raise SystemExit('viewport rejection status missing')

path.write_text(text, encoding='utf-8')
