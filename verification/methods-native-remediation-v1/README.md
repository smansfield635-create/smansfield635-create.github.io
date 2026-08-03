# Methods Native Visual Remediation Candidate v1

Nonproduct harness only. Public Methods files are unchanged.

The candidate preserves the exact corrected state-reach adapter contract and implements the bounded native visual remediation specification in an isolated verification surface.

Run:

```bash
python3 -m http.server 4173 --bind 127.0.0.1
CHROME_PATH=/usr/bin/chromium EXECUTION_COMMIT=<exact-head> HARNESS_COMMIT=<exact-head> EXPECTED_SOURCE_HEAD=<exact-head> node verification/methods-native-remediation-v1/runner.mjs
```

Authority: no product mutation, PR, merge, release, or acceptance.
