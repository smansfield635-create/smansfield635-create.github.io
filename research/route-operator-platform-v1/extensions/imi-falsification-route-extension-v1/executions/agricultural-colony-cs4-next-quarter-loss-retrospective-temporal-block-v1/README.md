# Agricultural colony CS4 retrospective temporal-block execution v1

This directory binds the completed real-data execution of `AGRICULTURAL_COLONY_CS4_NEXT_QUARTER_LOSS_RETROSPECTIVE_TEMPORAL_BLOCK_v1` to the operational `IMI_FALSIFICATION_ROUTE_EXTENSION_v1`.

## Result

`PRIMARY_RESULT_CATEGORY = MULTIDIMENSIONAL_INCREMENT_SUPPORTED_BUT_OPERATOR_NOT_DISTINGUISHED`

Held-out RMSE on the final 20 transitions:

- current loss only: `0.046688948539`
- current loss + Varroa: `0.047170597636`
- current loss + Mean4: `0.045319173431`
- current loss + CS4: `0.045644355954`

CS4 beat current loss and Varroa in the frozen primary analysis. It did not beat the additive Mean4 model. Paired uncertainty intervals included zero, and the state-fixed-effects sensitivity removed the advantage over current loss.

## Outcome audit

The archived `Next loss` field uses next-quarter lost colonies divided by next-quarter maximum colonies. The source-quarter denominator originally described in the proposed contract did not match the workbook and is sensitivity-only.

## Boundary

This is a retrospective locked stress test. It is not confirmatory validation, independent replication, multiplication-specific validation, or adjudication of identity-conditioned reachability and the universal parent theory.

Run:

```bash
python verify_execution_pointer_v1.py
```
