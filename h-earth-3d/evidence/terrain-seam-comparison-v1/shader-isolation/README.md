# Bounded shader isolation — Gen2915

Admission: operation H_EARTH_TERRAIN_SHADER_ISOLATION_20261026_001, receipt6427787837, run40404722671. Product9127904e725a3f4ca13c1221451023102ad09435 remains immutable and unpublished. Existing fixed comparator/capability only; no product-file edits or new execution transport.

Twelve captures: foothill-west (real foreground-occlusion control), inland-seam-near (color-band target), coastal-seam-east (coastal control). Each uses reference, unlit-albedo, gray-lit and coverage-weights. All suppress the existing grass draw consistently; these are diagnostic views, not evidence of vegetation removal.

Unlit retains final base color before lighting/fog/contact, with the original final exposure/gamma. Gray-lit retains normals, material lighting parameters, shadows, fog and contact; it is not a pure normals diagnostic. Coverage RGB is actual sandCoverage, habitatCoverage*.68 and bankContact*.26, bypassing final exposure/gamma; values do not describe every material layer. Non-ground surfaces retain their original shader paths.

Exact renderer SHA256:7ac013645110fc91ac9d454916e30f3cc526b716b0c0ffad4c702e1e44b8bec2. Source transform rejects hash drift and missing/duplicate anchors. Uniform mode is validated and recorded with each image plus original/transformed response hashes. Original camera/frame/asset/hash/failure guards remain. Nineteen tests pass; full transformed JavaScript parses. Actual browser shader compilation and diagnostic evidence remain pending.

Prior Gen2914 produced48valid captures but no meaningful visible improvement; preserve that negative result. No visual acceptance, physical Android performance proof or publication authority follows from this diagnostic.
