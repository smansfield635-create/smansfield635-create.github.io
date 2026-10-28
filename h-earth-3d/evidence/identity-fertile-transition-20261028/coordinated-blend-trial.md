# Coordinated blend trial — rejected offline

Date:2026-10-28. This is an evidence-only candidate equation, not a runtime change.

## Concrete proposal

At both the identity and groundcover mix, use:

```glsl
float incomingY=dot(incoming,vec3(0.2126,0.7152,0.0722));
float targetY=dot(target,vec3(0.2126,0.7152,0.0722));
vec3 proposed=mix(incoming,target*(incomingY/max(targetY,0.000001)),weight);
```

Use approved baseline fields and original masks, weights and palette chromaticities. Do not include the rejected widened-fertility endpoints. This coordinates both measured replacement stages rather than repeating the failed groundcover-only residual transfer.

## Execution

Ran test-coordinated-blend.py against all450 comparisons in the frozen near/far windows. Input image digests verified. Groundcover weights are nominal least-squares estimates from approved baseline P/T/Q, not new measured GPU weights. The CPU calculation uses quantized archived factors. Results are screening evidence only; healthy controls, full-scene behavior and GPU output are not established.

| Broad window | Candidate/baseline summed absolute RGB change | Candidate/baseline mean luminance |
|---|---:|---:|
| Near132|0.237228|0.586554|
| Near264|0.197878|0.576159|
| Near396|0.210386|0.588214|
| Far132|0.214936|0.604642|
| Far264|0.282340|0.566589|
| Far396|0.214196|0.556506|

At far-center rows481->497 the nominal RGB-boundary L1 ratio is0.190225. This is not a perceptual score or a visual acceptance claim.

## Failed requirement and decision

REJECT_OFFLINE_NO_GPU. Mean luminance falls by39.5–44.3% across these sampled windows. That is a material redesign of accepted brightness, inconsistent with preserving the existing appearance. A lower boundary metric alone does not justify it.

There is also a source-level semantic failure: normalizing T by its own luminance cancels scalar brightness factors in identityBase and groundcoverTone. Incoming-soil luminance detail survives, but target-specific brightness detail does not. Weight-driven chromatic boundaries remain possible. Preserved luminance is built into the formula and is not independent evidence of success.

No compensating constant, region tint, screenshot-fitted gain or parameter sweep was applied. No product source, GPU run, merge or deployment occurred.

## Next design constraint

A viable candidate must preserve material mean appearance and intended detail while reducing the coupled spatial replacement contrast. Explicitly separate those quantities in its source equations before testing. Do not use pre-identity luminance as a neutral reference: these archived samples prove it is materially darker than the accepted composite. Do not repeat this normalization proposal or call it a pending GPU candidate.

The remaining task is a source-supported mean/detail-preserving composition design, followed by the same offline screening and independent review. A GPU comparison is justified only after that screen succeeds and applicable successor scope/budget is prepared. The present evidence does not establish such a candidate yet.

## Reproduce

Use the same ledger-capture/, diagnostic/ and recovered/ archive directories documented in groundcover-attribution.md, with analyze-capture.py alongside this script. Run `python test-coordinated-blend.py`. Full inputs, all450 rows, aggregate metrics, limitations and rejection disposition are in coordinated-blend-offline.json.
