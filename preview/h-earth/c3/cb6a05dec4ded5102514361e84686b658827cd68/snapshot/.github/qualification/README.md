# Qualification Authority

This directory contains repository-wide machine-readable rules for deciding which checks are allowed to block an active operation.

`check-authority.v1.json` is the current authority. A red status is not a product failure unless the active operation declares that check and the check completes its intended evaluation with a machine-readable product-failure result.
