# H-Earth MA5 Cross-Pass Correspondence Summary

Status: `MATRIX_ONLY — CAUSAL_CLASSIFICATION_NOT_PERFORMED`

Reference pass: `H — ACCEPTED_CP2_FINAL_FRAME`

Source evidence:

- MA3 receipt: `e85c7cdcc9ea3b22686b63542ef43b25c3b546614ff0fe5c4f706755d1630ba6`
- MA3 artifact: `8768511411`, SHA-256 `5e9d8f04c2bccaaa3dc103dc696bcf0c4f610c9079a34e93a54663e769e1d094`
- MA4 receipt: `2ad7f10e86a3e8bdd1e9e06c415daa55da870b9f977155b247da8907fe4bc958`
- MA4 artifact: `8768674259`, SHA-256 `7cdf75ae0d85eddcdc4633a6d8a344e4ee7097bd3d78bf0a9dbd8e0bc59398ad`
- Matrix SHA-256: `9463cf860a13cdbd38f3f5f7f24b27b15b958ecf1d3a3324557906fe8f940811`

## Aggregate correspondence to H

| Rank | Pass | Composite | Exact band orientation/lag | Mean grid Pearson | Scene-score Pearson | Aggregate score ratio |
|---:|---|---:|---:|---:|---:|---:|
| 1 | G — accepted material, flat lighting | 0.951688 | 23/24 | 0.979521 | 0.992369 | 0.994535 |
| 2 | F — constant material, accepted lighting | 0.856769 | 17/24 | 0.806672 | 0.801229 | 0.903744 |
| 3 | C — surface-normal components | 0.818452 | 18/24 | 0.782356 | 0.954252 | 0.917117 |
| 4 | A — elevation | 0.746460 | 16/24 | 0.723533 | 0.086046 | 0.876109 |
| 5 | E — silhouette and major edges | 0.710858 | 18/24 | 0.690371 | 0.223227 | 0.891274 |
| 6 | B — slope magnitude | 0.683853 | 18/24 | 0.713430 | -0.043138 | 0.887954 |
| 7 | D — depth | 0.652307 | 16/24 | 0.689473 | -0.136190 | 0.878935 |

## Scene-level observations recorded by the matrix

- Pass G matched H's dominant orientation and lag exactly in 7 of 8 scenes and in 23 of 24 scene-band comparisons.
- Pass G's only dominant scene mismatch was `SCENE_03_DESCENDING_WITHOUT_HORIZON`; its mean band-grid Pearson there remained `0.934709`.
- Pass F matched H's dominant orientation and lag exactly in 7 of 8 scenes and within one orientation/lag step in all 8 scenes.
- Pass C had a high scene-score Pearson (`0.954252`) but lower full-grid and aggregate correspondence than G.
- A, B, D, and E frequently shared the same coarse dominant lag of 4 pixels, but their scene-score correspondence with H was weak or negative.

These are correspondence measurements only. MA5 does not assign a cause, authorize a product candidate, or recommend an implementation.
