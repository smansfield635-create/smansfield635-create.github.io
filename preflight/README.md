# DiamondGate applications

- **Main entry:** [Open DiamondGate](https://diamondgatebridge.com/preflight/) opens the existing [project workspace](https://diamondgatebridge.com/preflight/app/).
- New visitors start with **Start new work**: copy the prompt into an AI conversation, answer what they want to accomplish there, then paste the returned project response into DiamondGate.
- Saved projects and an explicitly chosen existing-work mode retain their current behavior. The entry redirect preserves project query parameters and URL fragments, replaces browser history, and never reads or writes stored projects.
- The earlier first-request questionnaire is no longer the main entry. Its assets remain for historical compatibility; they are not loaded by the entry page.
- `/preflight/saas-lab/` remains a separate experimental progression lab, not the project workspace.

The working app provides returned-response import, requirement checks, history, continuation prompts and portable backups. See [application maintenance](app/README.md). Run `node preflight/entry-route-test.mjs` for entry reconciliation checks, and the existing application test suite for prompt and response regressions.
