"""Extract checked replay inputs beside this evidence directory."""
from pathlib import Path
import json,zlib,base64,hashlib
p=Path(__file__).resolve().parent;d=json.loads((p/'habitat-source-fixture.json').read_text());out=p.parent/'habitat-core-input';out.mkdir(exist_ok=True)
for name,entry in d['files'].items():
 b=zlib.decompress(base64.b64decode(entry['data']));assert hashlib.sha256(b).hexdigest()==entry['sha256'];(out/name).write_bytes(b)
(out/'manifest-habitat.json').write_text(json.dumps(d['manifest']))
print('Verified native atlas and baseline extracted; only coastal/woodland are final installed panels.')
