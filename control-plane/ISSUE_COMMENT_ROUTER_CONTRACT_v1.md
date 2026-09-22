# Central Issue Comment Router Contract v1

Status: PROPOSED_FAIL_CLOSED

## Purpose

Collapse repository-wide issue-comment workflow instantiation to one authenticated intake without expanding execution authority.

## Admission

The router is the only workflow subscribed to `issue_comment: created`. It reads the comment body and author association from the immutable GitHub event, requires an exact registered marker prefix, and selects at most one route from `.github/ai-router/issue-comment-router-registry.v1.json`.

Unknown markers perform no dispatch. Ambiguous markers fail closed.

## Dispatch

The router may dispatch only the workflow filename registered for the matched marker. The only transported value is the closed request payload plus immutable source metadata needed for handler revalidation. No shell, workflow path, repository, ref, or command is caller-selectable.

Each specialized handler retains its existing least-privilege permissions and MUST revalidate schema, marker, association constraints, and any repository/issue/head invariants before performing an action.

## Atomic migration gate

Direct `issue_comment` triggers may not be removed from any retained handler until all five handlers accept registered `workflow_dispatch` input and the router self-test proves every marker maps exactly once. In the same merge that enables the router listener, all five direct listeners must be removed.

Post-migration invariant: exactly one top-level `issue_comment:` subscription exists under `.github/workflows`.

## Rollback

If router qualification fails, do not partially migrate. Existing five-listener topology remains authoritative until the atomic migration passes.
