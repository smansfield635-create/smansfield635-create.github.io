# Meet Sean speaking profile candidate

Operation: MEET_SEAN_SPEAKING_PROFILE_20261006_001
Governing baseline: 70b54afd852e1182856ecf279baed130c10a38cb
Canonical admission: /tmp/meet-sean-audit/admission-receipt.json; lock commit 50d42b6df8cfd720d3a9a83a6f3c296f8fd8dbba. Source: issue #5801 comment 6022142213.

## Changes

Replaces profile implementation labels with visitor-facing introduction, five speaking topics, personal story, selected work and a speaking inquiry. Reuses assets/dgb-estate-cosmos.js unchanged. Preserves the original about-this-underdog/sean-mansfield.jpg; adds a generated portrait derivative with subdued apartment surroundings.

Form fields: topic, preferred date, venue/city or Virtual, name, email, optional phone/message. Review before send, native date picker, accessible validation, duplicate-click guard and preserved values on failed/uncertain delivery. Recipient fixed to hello@diamondgatebridge.com. FormSubmit selected as a static-form email delivery service.

## Release gates

Candidate only. The form data-delivery-status is pending-verification and cannot send. Activate recipient at FormSubmit and verify an actual message arriving in hello@diamondgatebridge.com. Then change to verified, requalify the delta, remove preview notice through existing verified code path, obtain exact candidate physical review, and follow separate publication contract. No API secret belongs in this repository.

Provider acceptance is not proof of inbox arrival. Unknown, rejected, activation or malformed responses cannot show success; a timeout warns that delivery is uncertain. The page makes no automatic reservation and promises follow-up within 24–48 hours as requested by the owner.

## Verification

Run node --test meet-sean-mansfield/speaking.test.mjs. Eight cases cover required fields and invalid dates, honeypot/length guards, pending-verification hold, strict success handling, payload allowlist, fixed recipient, error responses and uncertain timeout. Mocked network tests do not prove provider or inbox delivery. Browser and independent review results are recorded in the PR.

Portrait prompt: preserve the exact man, full standing pose, suit, shirt, sunglasses and shoes; soften, darken and desaturate only the existing apartment; do not place him in a new setting. Image generated with built-in image editing; owner fidelity review remains required.

## Candidate review outcome

Independent review passed the eight tests and identified two bounded fixes, now applied: the project boundary describes all six exact page-local paths accurately, and the review button starts disabled until JavaScript initialization succeeds, preventing accidental native GET submission. `git diff --check` passes.

Local browser preview was blocked with ERR_BLOCKED_BY_CLIENT; no visual browser/device verification is claimed. A setup-only POST to the fixed FormSubmit endpoint returned success=false and an activation-required message saying an Activate Form email was sent. Actual receipt, recipient activation, and end-to-end inbox delivery remain unverified. The release hold remains in place.

## Owner publication direction

Owner explicitly prioritized publishing the page on 2026-10-06 over email activation. Proceed with live visual review; sending remains disabled with a direct email link and clear public wording. Delivery activation is no longer a page-publication prerequisite; it remains required before enabling automatic submission. Prior candidate-only wording above records the earlier checkpoint. Publication manifest separately admitted as MEET_SEAN_PUBLICATION_MANIFEST_20261006_001, generation 2570, acquisition d9b39c4bfb5897f49a555ddeb98ad4a467ed11b8.
