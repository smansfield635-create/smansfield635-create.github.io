# Compass Gen347 runtime rejection diagnosis — 2026-08-22

The first browser-matrix run did not reach the functional assertions. It timed out waiting for `document.documentElement.dataset.compassAwardsQualification === 'QUALIFICATION_READY'`.

That readiness value is produced only after the route-local `qualify()` aggregate passes every bootstrap check. Therefore the prior run cannot lawfully be described as a completed functional rejection of cardinal, room, carousel, Mirrorland, keyboard, or overflow behavior.

The next evidence run must capture the terminal qualification state and full bootstrap receipt before asserting readiness, so the exact failed check is preserved even when readiness is negative. Only after bootstrap passes may the full functional matrix run.

Governing disposition: DIAGNOSTIC_INCOMPLETE -> CAPTURE_BOOTSTRAP_RECEIPT -> REPAIR_EXACT_FAILED_CHECK -> RERUN_FULL_MATRIX.
