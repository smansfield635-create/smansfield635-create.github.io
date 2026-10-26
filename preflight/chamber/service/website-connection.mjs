export const WEBSITE_ORIGIN = 'https://diamondgatebridge.com';
export const FEEDS = Object.freeze({
  controlPlane: ['/data.json', 'DGB_OPERATIONS_CHAMBER_DASHBOARD_DATA_v1'],
  study: ['/api/study', 'DGB_HOSTED_STUDY_CAPTURE_v1'],
  briefings: ['/api/briefings', 'DGB_PROJECT_BRIEFINGS_v1'],
  agents: ['/api/agent-checkpoints', 'DGB_CHAMBER_AGENT_DELIVERIES_v1'],
});
const NONCE = /^[a-fA-F0-9]{32,128}$/;
const REQUEST_ID = /^[a-zA-Z0-9_-]{1,80}$/;
const MAX_BYTES = 16_000_000;

export function mountWebsiteConnection(view, {fetchImpl = view.fetch.bind(view), onStatus = () => {}} = {}) {
  const nonce = view.location.hash.slice(1);
  const opener = view.opener;
  let active = !!opener && NONCE.test(nonce), connected = false;
  const pending = new Map();
  let timer;
  const send = payload => {
    if (active && !opener.closed) opener.postMessage({...payload, nonce}, WEBSITE_ORIGIN);
  };
  const disconnect = () => {
    if (!active) return;
    send({type: 'CHAMBER_DISCONNECTED'});
    active = false;
    connected = false;
    for (const controller of pending.values()) controller.abort();
    pending.clear();
    view.removeEventListener('message', receive);
    view.removeEventListener('pagehide', disconnect);
    if (timer !== undefined) view.clearInterval(timer);
    onStatus('Disconnected. Reconnect from the Chamber website.');
  };
  const sourceError = status => status === 401 || status === 403 ? 'AUTH_REQUIRED' : 'SOURCE_UNAVAILABLE';
  async function receive(event) {
    if (!active || event.origin !== WEBSITE_ORIGIN || event.source !== opener || opener.closed) return;
    const message = event.data;
    if (!message || typeof message !== 'object' || Array.isArray(message) || message.nonce !== nonce) return;
    if (message.type === 'CHAMBER_HELLO') {
      connected = true;
      onStatus('Connected. Return to the Chamber website and keep this tab open.');
      send({type: 'CHAMBER_READY'});
      return;
    }
    if (!connected || message.type !== 'CHAMBER_READ' || typeof message.id !== 'string' || !REQUEST_ID.test(message.id)) return;
    const {id, feed} = message;
    if (typeof feed !== 'string' || !Object.hasOwn(FEEDS, feed)) return;
    const reply = payload => send({type: 'CHAMBER_DATA', id, feed, ...payload});
    if (pending.has(id) || pending.size >= 4) {
      reply({ok: false, status: 429, error: 'BUSY'});
      return;
    }
    const controller = new AbortController();
    pending.set(id, controller);
    const timeout = view.setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetchImpl(FEEDS[feed][0], {
        method: 'GET', credentials: 'same-origin', cache: 'no-store',
        redirect: 'error', signal: controller.signal,
      });
      if (!response.ok) {
        reply({ok: false, status: response.status, error: sourceError(response.status)});
        if (response.status === 401 || response.status === 403) onStatus('Sign-in expired. Reconnect from the Chamber website.');
        return;
      }
      if (!/^application\/json(?:\s*;|$)/i.test(response.headers.get('content-type') ?? '')) {
        reply({ok: false, status: 401, error: 'AUTH_REQUIRED'});
        onStatus('Sign-in is required. Reconnect from the Chamber website.');
        return;
      }
      const length = Number(response.headers.get('content-length'));
      if (length > MAX_BYTES) throw Error('INVALID_SOURCE');
      const text = await response.text();
      if (new TextEncoder().encode(text).length > MAX_BYTES) throw Error('INVALID_SOURCE');
      const data = JSON.parse(text);
      if (!data || typeof data !== 'object' || Array.isArray(data) || data.schema !== FEEDS[feed][1]) throw Error('INVALID_SOURCE');
      reply({ok: true, status: response.status, data});
    } catch (error) {
      reply({ok: false, status: 0, error: controller.signal.aborted ? 'REQUEST_TIMEOUT' : error?.message === 'INVALID_SOURCE' || error instanceof SyntaxError ? 'INVALID_SOURCE' : 'CONNECTION_UNAVAILABLE'});
    } finally {
      view.clearTimeout(timeout);
      pending.delete(id);
    }
  }
  if (!active) {
    onStatus('Open this connection from the Chamber on diamondgatebridge.com.');
    return disconnect;
  }
  view.addEventListener('message', receive);
  view.addEventListener('pagehide', disconnect);
  timer = view.setInterval(() => { if (opener.closed) disconnect(); }, 1000);
  onStatus('Waiting for the Chamber website…');
  return disconnect;
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  const stop = mountWebsiteConnection(window, {onStatus: message => {
    const status = document.getElementById('connection-status');
    if (status) status.textContent = message;
  }});
  document.getElementById('disconnect')?.addEventListener('click', stop);
}
