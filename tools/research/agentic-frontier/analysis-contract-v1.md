# Agentic Frontier Analysis Contract v1

Status: FROZEN BEFORE AF-IR-02..AF-FR-06 OUTCOMES ARE OPENED.

Population: exactly the 24 frozen task IDs in `research/agentic-frontier-comparison/task-manifest-v1.jsonl`. AF-IR-01 is retained from the previously completed paired receipt; the remaining 23 tasks are executed once each. No additions, substitutions, removals, threshold changes, or outcome-dependent exclusions.

Primary endpoint: paired verified material completion (`PASS` under the frozen acceptance command and scope rules).

Secondary measures: terminal state; acceptance result; autonomous completion; intervention severity; elapsed execution; retries/restarts; collaborative handoff conformance where applicable; recovery success where applicable; final tree identity; infrastructure-exclusion reason.

A lane that initializes successfully but then produces neither agent output nor a material workspace change for the preregistered inactivity interval is `FAIL_TIMEOUT`. `INFRA_EXCLUDED` is reserved for inability to establish equivalent task/model/runtime conditions before substantive execution.

Comparator: stock OpenHands v1.14.0 via documented headless CLI only. No internal OpenHands patching. Both lanes use the same `qwen2.5-coder:7b` Ollama runtime and deterministic temperature setting where exposed. Configuration differences are recorded per receipt.

Aggregation occurs only after all 24 task receipts exist. Report raw paired outcomes and per-stratum counts first, then completion-rate difference and paired discordance counts. Mixed and reverse outcomes remain first-class evidence. No composite marketing score is authorized.

Until population completion, no aggregate performance conclusion is authorized. Final language is limited to the observed frozen population and tested configurations; no universal rank or architecture-only causal attribution.
