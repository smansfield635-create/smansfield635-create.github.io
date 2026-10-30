from pathlib import Path
import json,subprocess,hashlib,sys

def prepare(repo,dest):
    here=Path(__file__).parent;m=json.loads((here/'texture-manifest.json').read_text());old=json.loads((here/'source-manifest.json').read_text())
    files={**m['moduleHashes'],**m['assetHashes'],'showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js':old['rendererSha256']}
    for p,want in files.items():
        b=subprocess.check_output(['git','-C',str(repo),'show',m['sourceHead']+':'+p])
        if hashlib.sha256(b).hexdigest()!=want:raise ValueError('TEXTURE_SOURCE_HASH:'+p)
        target=dest/p;target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes(b)
    (dest/'package.json').write_text('{"type":"module"}\n')
if __name__=='__main__':prepare(Path(sys.argv[1]),Path(sys.argv[2]))
