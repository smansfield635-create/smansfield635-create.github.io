#!/usr/bin/env python3
import hashlib, json, os, pathlib, subprocess, sys, tempfile, urllib.request

MODEL = os.environ.get('OLLAMA_MODEL', 'qwen2.5-coder:7b')
OLLAMA = os.environ.get('OLLAMA_HOST_URL', 'http://127.0.0.1:11434')


def run(cmd, cwd=None, timeout=30):
    return subprocess.run(cmd, cwd=cwd, text=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, timeout=timeout)


def post_json(url, payload, timeout=30):
    req = urllib.request.Request(url, data=json.dumps(payload).encode(), headers={'Content-Type': 'application/json'}, method='POST')
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return json.loads(r.read().decode())


def main():
    checks = {}
    for name, cmd in {
        'python': [sys.executable, '--version'],
        'node': ['node', '--version'],
        'git': ['git', '--version'],
        'openhands': ['openhands', '--version'],
    }.items():
        try:
            p = run(cmd)
            checks[name] = {'pass': p.returncode == 0, 'output': p.stdout.strip()}
        except Exception as e:
            checks[name] = {'pass': False, 'output': repr(e)}

    model_probe = {'pass': False}
    try:
        payload = {'model': MODEL, 'messages': [{'role': 'user', 'content': 'Reply with exactly READY.'}], 'stream': False}
        data = post_json(OLLAMA.rstrip('/') + '/v1/chat/completions', payload, timeout=45)
        text = (((data.get('choices') or [{}])[0].get('message') or {}).get('content') or '').strip()
        model_probe = {'pass': bool(text), 'response': text[:200], 'model': data.get('model')}
    except Exception as e:
        model_probe = {'pass': False, 'error': repr(e)}
    checks['model_generation'] = model_probe

    with tempfile.TemporaryDirectory(prefix='openhands-native-preflight-') as td:
        root = pathlib.Path(td)
        p = root / 'permission-probe.txt'
        try:
            p.write_text('probe\n')
            before = hashlib.sha256(p.read_bytes()).hexdigest()
            p.write_text('probe2\n')
            after = hashlib.sha256(p.read_bytes()).hexdigest()
            checks['filesystem_rw'] = {'pass': before != after, 'path': str(root)}
        except Exception as e:
            checks['filesystem_rw'] = {'pass': False, 'error': repr(e)}

    result = 'PASS' if all(v.get('pass') for v in checks.values()) else 'FAIL'
    receipt = {'schema': 'OPENHANDS_NATIVE_PREFLIGHT_v1', 'result': result, 'model': MODEL, 'ollama': OLLAMA, 'checks': checks}
    out = pathlib.Path(os.environ.get('OPENHANDS_PREFLIGHT_RECEIPT', 'openhands-native-preflight-v1.json'))
    out.write_text(json.dumps(receipt, indent=2))
    print(json.dumps(receipt, indent=2))
    raise SystemExit(0 if result == 'PASS' else 4)


if __name__ == '__main__':
    main()
