# Geodiametrics — SECURITY

## Scope
This document defines security boundaries for the Geodiametrics site and artifacts.

Geodiametrics is a **static, read-only public instrument** by default.

---

## Attack Surface

### Web Application
- Static HTML, CSS, and JavaScript
- Served via GitHub Pages
- No backend services
- No databases
- No authentication

### Implications
- No server-side exploits possible
- No credential theft vectors
- No privilege escalation paths
- No session hijacking risk

---

## Execution Surfaces

### Control
- Read-only
- No execution
- No input mutation

### Artifacts
- Interactive demos only
- Device-local state
- No persistence beyond browser storage

### Execution
- Disabled by design
- Placeholder only
- No executable code paths

---

## Data Handling
- No personal data collected
- No network transmission of analytics
- All metrics published manually as static files

---

## Dependency Policy
- No external runtime dependencies
- No third-party scripts
- No remote code execution
- No package managers

---

## Vulnerability Reporting
If a security issue is identified:
1. Document the issue clearly
2. Report via repository issues
3. No private data exposure expected

---

## Change Control
Any change that introduces:
- execution
- external services
- persistent storage
- authentication

must be accompanied by:
- updated security documentation
- version bump
- explicit public notice

---

## Status
Layer 6 security policy established.
