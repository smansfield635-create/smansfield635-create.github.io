# AI Entry Automatic Release

Production publication is automatic on every accepted push to `main` through `.github/workflows/ai-entry-auto-release.yml`.

The release checks out the exact pushed head, stages the bounded Pages payload, stamps `.well-known/dgb-release.json` with that exact commit, deploys the Pages artifact, and requires the public marker to match before the release is considered verified.

This restores end-to-end page delivery without requiring the owner to operate a manual deployment control. Merge alone is not called verified release; the automatic release must reach `LIVE_EXACT_HEAD_VERIFIED`.
