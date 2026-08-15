# Agricultural factorial-temporal retrospective successor reanalysis v1

This directory binds the completed successor execution of `AGRICULTURAL_FACTORIAL_TEMPORAL_RETROSPECTIVE_SUCCESSOR_REANALYSIS_v1` to the admitted `IMI_FACTORIAL_TEMPORAL_DIAGNOSTIC_EXTENSION_v1`.

## Result

`PRIMARY_RESULT_CATEGORY = FACTORIAL_TEMPORAL_INCREMENT_NOT_ESTABLISHED_IN_AGRICULTURAL_PANEL`

Primary held-out RMSE on the final 20 state transitions:

- current loss only: `0.047838550018`
- current-loss temporal history: `0.047962702959`
- multiplicative condition only: `0.050318147710`
- multiplicative plus direction: `0.051949076866`
- multiplicative plus persistence: `0.051998707024`
- full multiplicative factorial-temporal: `0.050237294807`
- full additive factorial-temporal: `0.047886789213`

Direction and persistence did not add predictive value in the primary agricultural analysis. Bottleneck movement improved the multiplicative persistence model by 3.39% on the point estimate, but its paired uncertainty interval included zero. The full multiplicative model remained 4.91% worse than the additive full model and 5.01% worse than current loss alone.

The full model did outperform Varroa-only and weakest-factor temporal competitors by approximately 9%, but all eligible observations retained Varroa as the bottleneck, so bottleneck-identity differentiation was not testable.

## Boundary

This is a retrospective exploratory successor reanalysis. It preserves the frozen core and predecessor execution. It is not prospective confirmation, independent replication, causal restoration evidence, support-dependence evidence, identity-continuity evidence, or universal-theory adjudication.

Run:

```bash
python verify_execution_pointer_v1.py
```
