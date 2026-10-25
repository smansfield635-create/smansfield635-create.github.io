from http.server import ThreadingHTTPServer,BaseHTTPRequestHandler
import os,pathlib,urllib.request,urllib.parse,mimetypes,hashlib,json,threading
ROOT=pathlib.Path(os.environ['H_EARTH_ASSET_CACHE']);ROOT.mkdir(exist_ok=True)
REF='3cab245406d8b4b4b7edc905cacd2f3849741a7b'
CANDIDATE=pathlib.Path(os.environ['H_EARTH_CANDIDATE_ROOT'])
class H(BaseHTTPRequestHandler):
 def do_GET(self):
  p=urllib.parse.urlparse(self.path).path
  if p.endswith('/'): p+='index.html'
  if '..' in p: self.send_error(400);return
  f=ROOT/p.lstrip('/')
  if p in ['/showroom/globe/h-earth/index.html','/showroom/globe/h-earth/functional-landscape/geological-runtime-bridge.v1.js','/h-earth-3d/terrain/h-earth.geological-portal-interface.v1.mjs','/showroom/globe/h-earth/functional-landscape/navigation.js','/showroom/globe/h-earth/functional-landscape/visible-terrain-clearance.js']: f=CANDIDATE/p.lstrip('/')
  try:
   if not f.exists():
    u='https://raw.githubusercontent.com/smansfield635-create/smansfield635-create.github.io/'+REF+p
    data=urllib.request.urlopen(u,timeout=60).read();f.parent.mkdir(parents=True,exist_ok=True);f.write_bytes(data)
   data=f.read_bytes();self.send_response(200);self.send_header('Content-Type',mimetypes.guess_type(p)[0] or 'application/octet-stream');self.send_header('Content-Length',str(len(data)));self.end_headers();self.wfile.write(data)
  except Exception as e: print('FETCH_ERROR',p,str(e),flush=True);self.send_error(502)
 def log_message(self,*args): pass
ThreadingHTTPServer(('127.0.0.1',8766),H).serve_forever()
