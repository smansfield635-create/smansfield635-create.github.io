from http.server import ThreadingHTTPServer,BaseHTTPRequestHandler
import os,pathlib,urllib.parse,mimetypes
BASE=pathlib.Path(os.environ['H_EARTH_BASELINE_ROOT']); CANDIDATE=pathlib.Path(os.environ['H_EARTH_CANDIDATE_ROOT']); CACHE=pathlib.Path(os.environ['H_EARTH_ASSET_CACHE'])
MODE=os.environ.get('COHERENCE_MODE','baseline')
class H(BaseHTTPRequestHandler):
 def do_GET(self):
  p=urllib.parse.urlparse(self.path).path
  if p.endswith('/'):p+='index.html'
  if '..' in p:self.send_error(400);return
  rel=p.lstrip('/');f=BASE/rel
  if MODE=='candidate' and (CANDIDATE/rel).is_file():f=CANDIDATE/rel
  if not f.exists():f=CACHE/rel
  if not f.exists():self.send_error(404);print('MISSING',rel,flush=True);return
  data=f.read_bytes();self.send_response(200);self.send_header('Content-Type',mimetypes.guess_type(p)[0] or 'application/octet-stream');self.send_header('Content-Length',str(len(data)));self.end_headers();self.wfile.write(data)
 def log_message(self,*args):pass
ThreadingHTTPServer(('127.0.0.1',8767),H).serve_forever()
