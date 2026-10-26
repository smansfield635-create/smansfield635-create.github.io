# Operations Chamber private-feed reconnection

Candidate recovery for admitted operation OPERATIONS_CHAMBER_PRIVATE_FEED_RECONNECTION_20261026_001, generation 2899.

The website keeps the existing Chamber interface. Connect Chamber opens the existing owner-private service in a sign-in tab. Four fixed read-only feeds pass to the exact diamondgatebridge.com opener with a per-connection nonce. Refresh reads the service; no snapshot import is required and source dates remain unchanged. The live path does not persist private feeds in browser storage. DiamondGate integration is deferred.

The service source is retained in `service/`: deploy the route to `app/website-connection/route.ts` and module to `public/website-connection.mjs` in the existing Operations Chamber Site, preserving its owner-only audience, R2 data and MCP update tools. Routine source updates continue through the existing connected Operations Chamber tools outside Work Mode. A website refresh reads those saved records; it does not execute a new collector.

## Incomplete verification

38 Chamber tests and 180 unchanged DiamondGate regression tests pass; the generated application check passes. An independent source review corrected per-refresh status and disconnect propagation. Real browser cross-origin sign-in must still be qualified before publication. Test signed-out sign-in, popup/opener preservation, all four real feeds, repeated Refresh, reconnect, blocked popup, closed tab, expired sign-in, hostile messages and preserved source dates. Do not substitute a synthetic feed test for real authenticated connection proof.

The managed preview failed with ERR_CONNECTION_REFUSED and, after restart, a stale vinext server lock for PID 14 at /site. Production is unchanged. No connection deployment or live success is claimed.

Owner explicitly approved saving the recovery candidate to the draft branch. Publication remains pending real authenticated browser verification and the registered release checks.
