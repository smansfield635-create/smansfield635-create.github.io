# DSSI 2025 segmented web-extracted source package

This directory replaces direct GitHub Actions scraping of the World Bank DSSI dynamic pages with a committed, auditable source-row package.

The World Bank DSSI monthly pages expose 2025 monthly `Debt Service Payments Due` tables by country. The GitHub Actions runtime did not retrieve those rendered tables reliably. Therefore the DSSI expansion route now uses segmented source-row packages extracted from the World Bank pages and then runs the repository IMI engine against those admitted rows.

Boundary:

- all candidate countries are listed in `dssi-source-package-manifest.v1.json`;
- countries may be completed in independent segment files under `segments/`;
- no missing country is imputed;
- a country without a complete 2025 Total row remains source-held / unevaluable;
- the route measures monthly interest/principal schedule dispersion only, not solvency, default risk, or ability to pay.

The runner is allowed to pass CI with `HELD_PENDING_DSSI_WEB_EXTRACTED_SOURCE_SEGMENTS` until the configured numeric threshold is met. Once enough valid source rows are present, the same runner automatically produces the normal IMI study outputs and portfolio entry.
