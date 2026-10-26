export const dynamic = 'force-dynamic';

// Sites' existing owner-only access policy protects this page and its four reads.
// This page does not accept credentials or enable cross-origin HTTP access.
const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow,noarchive"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'self'; style-src 'unsafe-inline'; connect-src 'self'; base-uri 'none'; form-action 'none'"><title>Operations Chamber connection</title>
<style>:root{color-scheme:dark;font:16px/1.6 system-ui,sans-serif;background:#0b1119;color:#eef4f5}body{margin:0;padding:clamp(24px,6vw,60px)}main{max-width:560px;margin:auto;padding:28px;border:1px solid #344f55;border-radius:16px;background:#13252d}h1{font-size:26px;line-height:1.2}p{color:#b3c9d0}#connection-status{color:#b2e7cf}button{font:inherit;background:#19383c;color:#e2f6ed;border:1px solid #567b75;border-radius:9px;padding:10px 16px;min-height:44px;cursor:pointer}button:focus-visible{outline:3px solid #a4e2d0;outline-offset:3px}</style></head>
<body><main><h1>Operations Chamber connection</h1><p id="connection-status" role="status" aria-live="polite">Checking the website connection…</p><p>Keep this tab open while using the Chamber on diamondgatebridge.com. Return to the website to inspect your projects. This connection reads your saved Chamber information; it cannot change records.</p><button id="disconnect" type="button">Disconnect</button></main><script type="module" src="/website-connection.mjs"></script></body></html>`;

export function GET() {
  return new Response(html, {headers: {
    'content-type': 'text/html; charset=utf-8',
    'cache-control': 'private, no-store',
    'x-content-type-options': 'nosniff',
    'referrer-policy': 'no-referrer',
  }});
}
