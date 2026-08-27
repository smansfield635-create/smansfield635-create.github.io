process.argv.push(`--base-url=${process.env.LAWS_CP6_FINAL_BASE_URL || "http://127.0.0.1:4173"}`);
await import("../laws/room-carousel/verify-contextual-delivery.v2.mjs");
