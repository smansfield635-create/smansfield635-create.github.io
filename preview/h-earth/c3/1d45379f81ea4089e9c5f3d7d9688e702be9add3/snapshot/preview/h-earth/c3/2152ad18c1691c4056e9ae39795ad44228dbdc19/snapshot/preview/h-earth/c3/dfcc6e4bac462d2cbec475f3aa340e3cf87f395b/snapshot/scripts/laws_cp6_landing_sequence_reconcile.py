#!/usr/bin/env python3
from pathlib import Path
import re

path = Path('laws/index.html')
text = path.read_text(encoding='utf-8')
pattern = re.compile(r'\n?<section class="cp6-context cp6-landing-context" id="cp6-work-behind-laws".*?</section>', re.S)
match = pattern.search(text)
if not match:
    raise SystemExit('cp6-work-behind-laws section not found')
block = match.group(0).lstrip('\n')
text = text[:match.start()] + text[match.end():]
marker = '<section aria-label="Laws supporting orientation" class="laws-discovery laws-visitor-paths"'
position = text.find(marker)
if position < 0:
    raise SystemExit('Laws supporting orientation marker not found')
text = text[:position] + block + '\n' + text[position:]
first_index = text.find('id="research-comes-first"')
context_index = text.find('id="cp6-work-behind-laws"')
paths_index = text.find('aria-label="Laws supporting orientation"')
if not (first_index >= 0 and context_index > first_index and paths_index > context_index):
    raise SystemExit('Landing sequence assertion failed')
if text.count('id="cp6-work-behind-laws"') != 1:
    raise SystemExit('Landing context must occur exactly once')
path.write_text(text, encoding='utf-8')
print('LAWS_CP6_LANDING_SEQUENCE_RECONCILIATION=PASS')
