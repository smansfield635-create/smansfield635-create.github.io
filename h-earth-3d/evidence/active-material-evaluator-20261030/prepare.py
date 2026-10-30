"""Extract frozen module dependency closure; verify manifest before execution."""
from pathlib import Path
import subprocess,re,json,hashlib,sys
HEAD='3ea149e5b56e8cc0d5aac192bce0cdd47da7e626'
ROOTS=['showroom/globe/h-earth/functional-landscape/geological-runtime-bridge.v1.js','showroom/globe/h-earth/render/planetary-world-frame.js']
def sha(b):return hashlib.sha256(b).hexdigest()
def extract(repo,dest,manifest):
    import posixpath
    pending=ROOTS[:];seen={}
    while pending:
        p=pending.pop()
        if p in seen:continue
        b=subprocess.check_output(['git','-C',str(repo),'show',HEAD+':'+p]);seen[p]=sha(b)
        for imp in re.findall(r'(?:from\s*|import\s*)[\'"]([^\'"]+)[\'"]',b.decode()):
            if imp.startswith('.'):pending.append(posixpath.normpath(posixpath.join(posixpath.dirname(p),imp.split('?')[0])))
        target=dest/p;target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes(b)
    expected=json.loads(manifest.read_text())
    rp='showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js'
    rb=subprocess.check_output(['git','-C',str(repo),'show',HEAD+':'+rp])
    if sha(rb)!=expected['rendererSha256']:raise ValueError('RENDERER_HASH_MISMATCH')
    (dest/rp).write_bytes(rb)
    if seen!=expected['moduleHashes']:raise ValueError('FROZEN_MODULE_CLOSURE_MISMATCH')
    (dest/'package.json').write_text('{"type":"module"}\n')
    return seen
if __name__=='__main__':extract(Path(sys.argv[1]),Path(sys.argv[2]),Path(__file__).with_name('source-manifest.json'))
