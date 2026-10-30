"""Prepare exact source closure for the attribute checkpoint; no network or edits to product."""
from pathlib import Path
import sys,json,subprocess,re,posixpath
from prepare import extract,sha,HEAD
ROOTS=['showroom/globe/h-earth/render/gpu-upload-views.run8e-r2d.js','showroom/globe/h-earth/render/terrain-seam-normal.v1.js']
def prepare(repo,dest):
    here=Path(__file__).parent;extract(repo,dest,here/'source-manifest.json')
    expected=json.loads((here/'attribute-manifest.json').read_text());pending=ROOTS[:];seen={}
    while pending:
        p=pending.pop()
        if p in seen:continue
        b=subprocess.check_output(['git','-C',str(repo),'show',HEAD+':'+p]);seen[p]=sha(b)
        if expected['moduleHashes'].get(p)!=seen[p]:raise ValueError('ATTRIBUTE_MODULE_HASH:'+p)
        target=dest/p;target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes(b)
        for imp in re.findall(r'(?:from\s*|import\s*)[\'"]([^\'"]+)[\'"]',b.decode()):
            if imp.startswith('.'):pending.append(posixpath.normpath(posixpath.join(posixpath.dirname(p),imp.split('?')[0])))
    if seen!=expected['moduleHashes']:raise ValueError('ATTRIBUTE_CLOSURE_MISMATCH')
if __name__=='__main__':prepare(Path(sys.argv[1]),Path(sys.argv[2]))
