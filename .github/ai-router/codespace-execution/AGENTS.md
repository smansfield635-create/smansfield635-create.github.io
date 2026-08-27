# Three-tier Codespace execution substrate

Scope: `.github/ai-router/codespace-execution/**`.

This directory is shared nonproduct execution instrumentation. It standardizes exact-head command execution and provenance for IMI, Methods Information Benchmark, and H-Earth. It does not create a ChatGPT terminal API, does not grant project authority, and does not authorize repository mutation outside a separately admitted operation.

Rules:

1. Resolve repository intake and project authority before executing a project command.
2. Use an immutable 40-character target commit; moving branches are not execution identities.
3. Builder and fresh verifier must use distinct mutable environments.
4. Verify the worktree is clean before command execution.
5. Execute only the project-declared fixed command. No extra shell arguments, environment overrides, or repair are implied.
6. Write command outputs outside the repository or to an explicitly ignored disposable path.
7. Emit environment, command, equality, and destruction/non-authority receipts.
8. Treat Codespaces as disposable execution surfaces, never as canonical custody.
9. Use GitHub Actions only under a separately active workflow/transport authority; the template in `templates/` is nonactive.
10. Fail closed on target drift, dirty worktree, command mismatch, receipt absence, builder/verifier state reuse, or prohibited side effect.

Prohibited by this substrate: product mutation, direct `main` write, operation-lock mutation, merge, deployment, release, outcome unblinding, scientific claim promotion, and authority inflation.
