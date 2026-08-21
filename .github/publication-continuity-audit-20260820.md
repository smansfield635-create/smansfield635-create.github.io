# Publication Continuity Audit — 2026-08-20

Scope: Developer, Evidence, Governance, and the current Compass publication incident.

## Historical continuity pattern

The recent Developer, Evidence, and Governance releases converged through the same pattern:

1. Construct and qualify the page/runtime change.
2. Refresh the shared presentation identity.
3. Refresh each page-specific runtime identity.
4. Merge the coherent Public Legitimacy candidate.
5. Allow the public surface to consume the new immutable identities.

The final page-specific identity commits were:

- Developer: `eaac47becda4b844be5afb1ccca4435e8a7d927f`
- Evidence: `77e91077b61cca6374e2d8f98dd4630573ab464e`
- Governance: `8f74e91d31071f7454a3d9e718faadd73b954af2`

They converged into Gen332 at `8a94bf4ce178f6ed03cf710e6d4caa0cd3680d0b`.

## Critical finding

At Gen332, `.github/workflows/pages-direct-deploy.yml` already used the shared `pages` concurrency group with `cancel-in-progress: false` and already issued an explicit legacy Pages build request. Therefore those two mechanisms alone are not a newly introduced regression.

The material change is operational scale and overlapping publication control. From Gen332 to the current incident lineage, hundreds of commits accumulated and additional Pages recovery/finalization workflows were introduced. With GitHub Pages still configured as legacy `main/`, every `main` advance remains publication-significant while recovery machinery can also request or manipulate builds.

## Continuity requirement

A sustainable publication system must preserve these properties:

- qualification is completed before public promotion;
- immutable asset identities are renewed only when their bytes change;
- unrelated repository/governance commits do not automatically create public release pressure;
- one qualified release produces one publication advance;
- publication does not depend on GitHub Actions being available;
- the live authority can be advanced through the authenticated GitHub transaction path;
- historical qualification remains evidence, not a perpetual deployment veto.

## Candidate architecture

Use a dedicated low-churn publication branch as the Pages source while retaining legacy branch-based Pages:

`construction/qualification -> main -> explicit qualified promotion -> publication branch -> GitHub Pages`

The publication branch is advanced only after a qualified live release is authorized. This decouples high-churn `main` from the Pages build limit without making GitHub Actions the publication authority.

No Compass, Developer, Evidence, Governance, H-Earth, or other product bytes are changed by this audit record.
