# Diamond Gate State-Bound Admissibility Engine v1

A standalone reference implementation extracted from Diamond Gate's existing repository-governance laws.

## Product claim under test

**An already-authorized software operation must not execute when the state, authority, identity, scope, policy, procedure, or qualifying evidence it was admitted against has changed.**

The engine creates a cryptographically signed state-bound admission capability and requires the exact bound relationships to still match at the enforcement boundary. The enforcement boundary accepts only capabilities signed by a configured trusted Ed25519 key. A successful enforcement consumes the capability; replay is denied.

## Run it

Requires Node.js 22+ and no third-party packages.

```bash
npm test
npm run demo
```

The demo proves this bounded sequence:

1. Admit an operation against state A and confirm it is executable.
2. Advance the system to state B.
3. Attempt to reuse the state-A capability: `DENY_STALE_STATE`.
4. Create a fresh successor capability for state B: `EXECUTE`.
5. Replay the consumed state-B capability: `DENY_REPLAY`.
6. Verify the signed DSSE receipt.

## External enforcement CLI

`src/enforce.mjs` is intended to sit immediately before a consequential mutation. It consumes an input JSON containing `capability` and `currentContext`, and uses an atomic filesystem replay marker so one capability cannot be successfully consumed twice by cooperating processes sharing the replay directory.

```bash
node src/enforce.mjs \
  --input request.json \
  --trusted-key diamond-gate-public.pem \
  --replay-store .diamond-gate-replay \
  --output decision.json
```

Exit code `0` means `EXECUTE`. A denial exits nonzero.

## What was extracted

The v1 laws are derived from the already-running Diamond Gate control plane: exact-state operation admission, successor/supersession, fresh successor authority, evidence applicability, and fail-closed continuation. Laws and H-Earth remain consumers/testbeds; this package does not mutate or absorb either project.

## Standards boundary

The package has narrow adapters for externally verified SPIFFE or OIDC identity assertions, an externally evaluated Cedar `Allow` decision, in-toto Statement v1 evidence, and DSSE signing/verification. These adapters bind external facts into Diamond Gate; they do **not** replace the external identity or policy engines.

## Market claim boundary

### Demonstrated by this candidate

- signed, trusted-key-verified admission capabilities binding principal, operation, resource, state, authority, policy, procedure, and evidence;
- fail-closed rejection on drift of any bound relationship;
- fresh successor capability with explicit non-inheritance of authority;
- one-time capability consumption and replay rejection;
- in-toto Statement v1 shaped receipts signed and verified with DSSE using Ed25519;
- standalone CLI enforcement and adversarial tests.

### Not yet claimed

- industry uniqueness or patentability;
- independent security audit or production hardening;
- native SPIFFE SVID cryptographic verification;
- native OIDC token verification;
- Cedar policy evaluation;
- Sigstore integration;
- distributed durable replay storage or high-availability operation;
- any production deployment or standards certification.

Those are deliberate boundaries, not missing evidence silently upgraded into claims.
