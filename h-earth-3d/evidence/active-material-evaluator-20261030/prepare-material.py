"""Extract additional ordered-stage helper with immutable source binding."""
from pathlib import Path
import subprocess,hashlib,json,sys
here=Path(__file__).resolve().parent
manifest=json.loads((here/'ordered-source-manifest.json').read_text())
repo,dest=map(Path,sys.argv[1:])
for path,expected in manifest['moduleHashes'].items():
    b=subprocess.check_output(['git','-C',str(repo),'show',manifest['sourceHead']+':'+path])
    if hashlib.sha256(b).hexdigest()!=expected:raise ValueError('ORDERED_SOURCE_HASH:'+path)
    p=dest/path;p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(b)
