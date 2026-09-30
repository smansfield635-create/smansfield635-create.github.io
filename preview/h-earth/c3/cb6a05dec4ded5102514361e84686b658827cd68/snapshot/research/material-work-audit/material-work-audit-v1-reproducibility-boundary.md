# Material-work audit v1 research closure

Generation 1710 closes the fixed 906-PR material-work study for page-build purposes.

## Frozen experiment

The blinded v1 base remains immutable at commit `bebb401aa0d2486f7c0d67504c1413efb356f131`, blob `c969523bed42e90799ddc3dcb7acda6ea09d852c`, with 906 observations through `2026-08-25T18:25:55Z`.

The frozen classifier produced 18 PARAMOUNT, 766 STANDARD, and 122 SUPPORT observations. Those numbers are retained as the classifier experiment, not silently rewritten.

## Conformance closure

The companion JSONL is a sparse correction overlay. Rows absent from it inherit the frozen v1 classification unchanged. The overlay contains only downward corrections required by the admitted rubric's hard SUPPORT gate: registration/binding-only work, verification/receipt-only work, cache or identity-only work, workflow/carrier/transport support, rollback/restoration, retirement/cleanup, documentation-only work, state reconciliation, and continuity closure. No row is promoted.

Applying the 85-row overlay yields 17 PARAMOUNT, 682 STANDARD, and 207 SUPPORT observations: 699 material units in the fixed 906-PR population.

This closure deliberately does not rematerialize the entire 1.2 MB corpus or replay all repository evidence. The immutable base plus sparse overlay is the corrected dataset.

## Reproducibility boundary

The original v0 audit survives only as aggregate totals: 143 PARAMOUNT, 253 STANDARD, 510 SUPPORT, 396 material units. No 906-row v0 PR-to-class mapping was preserved.

Therefore row-level v0/v1 agreement, Cohen's kappa, and a disagreement ledger are unavailable. They are not reconstructed after exposure to v1 and are not fabricated. Aggregate v0-versus-v1 distribution comparison may be reported, but it must not be labeled reproducibility.

Corrected pre-transition / installation / mature window rates remain query-time derivable from the frozen ledger plus overlay. They are not required to authorize page construction and should not be published until that aggregation is explicitly computed.

## Post-freeze running counter

A separate rolling window begins at `2026-08-25T18:25:56Z`. Through the Gen1710 governing head it contains 7 post-freeze merged PRs: 0 PARAMOUNT, 2 STANDARD, 5 SUPPORT, for 2 material units. This counter is intentionally separate from the immutable 906-row experiment and may continue to grow.

## Disposition

`CLOSED_FOR_PAGE_BUILD`

No additional GitHub Actions carrier, per-PR excavation, or proof-system construction is required before the research pages are built. The proof burden is bounded to the evidence already captured by the work.
