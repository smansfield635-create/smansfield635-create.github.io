# AF-IR-01 runner repair v3

Scope: execution-adapter repair only.

Frozen and unchanged: AF-IR-01 task contract, fixture, acceptance tests, qwen2.5-coder:7b model, Diamond Gate lane.

Observed v2 boundary: Diamond Gate PASS on first attempt; OpenHands returned a file_editor-style tool request as inert message content and left slug.mjs byte-identical to the frozen fixture.

Repair: force OpenHands native tool calling off so its prompt-based/CodeAct tool adapter parses model actions rather than relying on Ollama OpenAI-compatible native tool_call transport.

No comparative outcome is claimed by this repair artifact. The exact frozen task must be rerun after merge.
