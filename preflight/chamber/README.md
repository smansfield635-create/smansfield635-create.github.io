# Operations Chamber on the website

This is the original v20 Chamber interface, migrated from source e8a67c6db78577774d21133b72c2cf2ea21b6830 into the website's buildless `/preflight/chamber/` route. DiamondGate links here and both apps share `diamondgate.projects.v2` in the same browser origin.

## Use and recovery

Import the private Chamber snapshot using **Import workspace backup**. This merges the captured records into existing DiamondGate projects; it does not send the file to a server. Open a project and continue it in DiamondGate. Imported source context does not adopt requirements, grant authority, or accept results.

**Download combined backup** preserves projects, drafts, history, explicit links and all four imported observation feeds. Restore on another device using the same import control. Conflicting project versions cancel the whole import; retain both backups and reconcile in DiamondGate. Browser storage is device/profile-specific, can be cleared, and does not provide account authentication. The public app assets contain no owner snapshots. The route is unlisted and noindex; it is not an authenticated private URL.

Use **Update from a current Chamber source response** to add a source-checked capture from a connected Operations Chamber read. This uses the existing local validation and merge path and does not automatically query new data. The existing backup import remains available.

Operational captures, briefings, study and agent reports retain their source dates. Refresh rereads local storage, not the old Site or a live repository collector. Import a newer snapshot to refresh source observations. Local DiamondGate summaries appear separately.

## Maintain without ChatGPT Sites

All runtime source is in this repository. No Sites service, npm installation, framework build, cloud database or API key is needed to serve the Chamber. Edit these modules with any editor or repository coding environment; preview the repository with a static HTTP server. Preserve the repository AI entrypoint for authorized repository operations.

Run `node --test preflight/chamber/*test.mjs`, then `cd preflight/app && npm test && npm run check`. If DiamondGate HTML changes, run its `npm run build`. Update source-manifest runtime hashes after modifications. Publish through the repository's registered exact-head Pages workflow and verify `/preflight/chamber/`, `/preflight/app/`, and the release marker. The original Site is untouched and remains available as a separate historical copy.
