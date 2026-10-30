import json,zlib,base64,hashlib,importlib.util,pathlib,contextlib,io
D=pathlib.Path(__file__).resolve().parent
f=json.loads((D/'inland-source-fixture.json').read_text());b=zlib.decompress(base64.b64decode(f['data']));assert hashlib.sha256(b).hexdigest()==f['sha256'];(D/f['name']).write_bytes(b)
spec=importlib.util.spec_from_file_location('source_builder',D/'inland-build.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m);m.SOURCE=D/f['name'];m.OUT=D
with contextlib.redirect_stdout(io.StringIO()):m.main()
print('source',hashlib.sha256(b).hexdigest());print('correction',hashlib.sha256((D/'far-spatial-margin.rgba16f').read_bytes()).hexdigest())
