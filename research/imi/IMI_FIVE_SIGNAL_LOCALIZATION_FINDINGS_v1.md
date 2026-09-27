# IMI Five-Signal Localization Findings v1

## Disposition

**LOCALIZED**

Execution: GitHub Actions run `32618909792`; artifact `9487941609`; artifact digest `sha256:e36bb936c68cfe2f0edf591a53cb701518f267ff884a77357dd06a7583743195`.

The study used 8,817 wastewater snapshots, a 2,460-observation later temporal holdout with 1,128 events, and a 716-observation unseen-Texas transfer cohort with 426 events. The conventional challenger contained 147 features.

## Primary localization

Two channels met the frozen COHERENT rule after Holm correction and survived leave-one-channel-out necessity testing:

- **A — accumulation/depletion balance**: temporal Brier improved 0.588%; AUROC +0.002235; AP increased; conditional p=0.001200; Holm-adjusted p=0.005999. Texas transfer also improved Brier 1.200%, AUROC +0.008370, and AP.
- **S — support/compensation divergence proxy**: temporal Brier changed -0.031% (within the frozen non-material-worsening bound); AUROC +0.001189; conditional p=0.006599; Holm-adjusted p=0.026395. Texas transfer improved Brier 0.243% and AUROC +0.006047.

P (persistence), H (hysteresis), and G (topology interaction) did not meet the full COHERENT rule individually. H nevertheless showed the largest unseen-Texas AUROC increase (+0.033868), but its temporal direction did not satisfy the frozen rule. G was the weakest transfer channel and degraded both Brier and AUROC in Texas.

## Combined five-channel representation

The all-five model improved the temporal holdout from Brier 0.1948423 to 0.1928570 (1.019% relative improvement), AUROC 0.7835475 to 0.7890640 (+0.0055165), and AP 0.7674593 to 0.7719364.

Leave-one-out removal worsened both Brier and AUROC for every channel. Removal of A produced the largest Brier loss and AUROC loss; removal of S produced the second-largest AUROC loss. This establishes that the residual information is not purely diffuse, although the overall predictive magnitude remains modest.

## Scientific interpretation

The prior Markov kill-test FAIL remains intact. This localization result does not establish a universal IMI law and does not rescue the failed 5% material-gain criterion. It does show that the statistically detectable history residue is concentrated most coherently in **net accumulation/depletion** and **current-output-versus-prior-burden divergence**, with additional complementary structure distributed across persistence, hysteresis, and topology interactions.

The next confirmatory boundary must freeze A and S exactly as defined here and test them on a fresh domain/cohort without further feature tuning. H may be carried only as a preregistered complementary replication signal because of its strong Texas transfer but failed temporal coherence.