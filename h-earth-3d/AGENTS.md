# H-Earth agent entrypoint

For work anywhere below `h-earth-3d/`, load `registry/h-earth.repository-registry.bootstrap.json` first and follow `registry/h-earth.repository-registry.tool-instruction.json`, `registry/h-earth.repository-registry.github-instruction.md`, and `registry/H_EARTH_REPOSITORY_REGISTRY_GITHUB_TOOL_INSTRUCTION_v1.md`.

Before any H-Earth, Audralia, globe, regional, terrain, renderer, navigation, interaction, or user-experience upgrade, load `experience-anchor/H_EARTH_EXPERIENCE_ANCHOR_v1.json` and its repository visual proxy. That anchor is a HARD ACCEPTANCE CRITERION. The controlling source identity is video SHA-256 `7757fb4fe731456b3058ec595369133f5c2136c99b282eb6b4df108600bca573`.

An upgrade MUST preserve the experience as one canonical navigable world across planetary, regional, and local ground scales. The globe must remain a higher-altitude expression of the same world. Entering H-Earth or a region must not feel like entering a different product. A dashboard, map application, card interface, parallel world, or visually/interactionally unrelated replacement is prohibited as a substitute for the anchored world experience.

Any experience-surface change must satisfy `.github/workflows/h-earth-experience-anchor-gate.yml` and provide a `H_EARTH_EXPERIENCE_ANCHOR_ACCEPTANCE_RECEIPT_v1` under `h-earth-3d/experience-anchor/receipts/`, with visual, interaction, continuity, exact-file-digest, and all-invariant evidence. Missing or failed anchor evidence is a hard BLOCK. The anchor may not be waived, replaced, or weakened without explicit user authorization replacing the anchor itself.

Use the registry facade for read-only discovery and scope projection. Resolve all affected nodes, relations, exact occurrences, composite units, cardinal participation, authority, evidence, lifecycle, validations, mutation limits, stopping boundaries, and unresolved fields before acting.

This entrypoint grants no source, mutation, merge, canonicalization, workflow-enforcement, runtime, renderer, deployment, or production authority. Stop rather than infer missing authority or critical evidence.
