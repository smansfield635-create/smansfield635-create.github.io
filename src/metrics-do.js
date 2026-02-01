// src/metrics-do.js
// Durable Object compatibility shim.
// This repo uses KV for metrics. DO is intentionally unused.

export class MetricsDO {
  constructor(state, env) {
    this.state = state;
    this.env = env;
  }

  async fetch(request) {
    return new Response(
      JSON.stringify({ ok: false, error: "durable_object_unused", note: "This deployment uses KV (METRICS_KV) instead." }, null, 2),
      { status: 501, headers: { "content-type": "application/json; charset=utf-8" } }
    );
  }
}
