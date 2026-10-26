import test from 'node:test';
import assert from 'node:assert/strict';
import {mountWebsiteConnection, WEBSITE_ORIGIN, FEEDS} from './website-connection.mjs';

const nonce = 'a'.repeat(64);
function harness(fetchImpl = async route => Response.json({schema: Object.values(FEEDS).find(v => v[0] === route)[1]})) {
  const listeners = new Map(), sent = [], calls = [], statuses = [];
  const opener = {closed: false, postMessage: (message, origin) => sent.push({message, origin})};
  const view = {
    location: {hash: '#' + nonce}, opener,
    addEventListener: (name, fn) => listeners.set(name, fn),
    removeEventListener: (name, fn) => {if (listeners.get(name) === fn) listeners.delete(name);},
    setInterval: fn => {view.tick = fn; return 1;}, clearInterval: () => {},
    setTimeout, clearTimeout,
  };
  const stop = mountWebsiteConnection(view, {fetchImpl: async (...args) => {calls.push(args); return fetchImpl(...args);}, onStatus: s => statuses.push(s)});
  const event = (data, override = {}) => listeners.get('message')?.({origin: WEBSITE_ORIGIN, source: opener, data: {nonce, ...data}, ...override});
  return {view, sent, calls, statuses, stop, event, hello: () => event({type: 'CHAMBER_HELLO'}), read: feed => event({type: 'CHAMBER_READ', id: 'request1', feed})};
}

test('four allowlisted reads use authenticated same-origin GET and preserve source timestamps', async () => {
  const h = harness(async route => Response.json({schema: Object.values(FEEDS).find(v => v[0] === route)[1], observedAt: '2026-10-17T07:05:23.245Z'}));
  await h.hello();
  assert.equal(h.sent[0].message.type, 'CHAMBER_READY');
  for (const feed of Object.keys(FEEDS)) {
    await h.read(feed);
    const result = h.sent.at(-1);
    assert.equal(result.origin, WEBSITE_ORIGIN);
    assert.equal(result.message.nonce, nonce);
    assert.equal(result.message.feed, feed);
    assert.equal(result.message.data.observedAt, '2026-10-17T07:05:23.245Z');
    assert.equal(result.message.ok, true);
  }
  assert.deepEqual(h.calls.map(c => c[0]), Object.values(FEEDS).map(v => v[0]));
  for (const [, options] of h.calls) {
    assert.equal(options.method, 'GET'); assert.equal(options.credentials, 'same-origin');
    assert.equal(options.redirect, 'error'); assert.equal(options.cache, 'no-store');
    assert.equal(options.headers, undefined);
  }
  h.stop();
});

test('hostile origin, unrelated window, wrong nonce and missing handshake cause no reads or replies', async () => {
  const h = harness();
  await h.read('briefings');
  await h.event({type: 'CHAMBER_HELLO'}, {origin: 'https://evil.example'});
  await h.event({type: 'CHAMBER_HELLO'}, {source: {}});
  await h.event({type: 'CHAMBER_HELLO', nonce: 'b'.repeat(64)});
  assert.equal(h.sent.length, 0); assert.equal(h.calls.length, 0);
  h.stop();
});

test('arbitrary routes, prototype keys, methods and headers cannot broaden four feeds', async () => {
  const h = harness(); await h.hello();
  for (const feed of ['https://evil.example', '/api/capture', '__proto__', 'constructor', undefined]) await h.read(feed);
  assert.equal(h.calls.length, 0);
  await h.event({type: 'CHAMBER_READ', id: 'safe', feed: 'briefings', method: 'POST', headers: {Authorization: 'fake'}, url: 'https://evil.example'});
  assert.equal(h.calls[0][0], '/api/briefings'); assert.equal(h.calls[0][1].method, 'GET');
  assert.equal(h.calls[0][1].headers, undefined); h.stop();
});

test('HTML sign-in response and denied session never yield private payload', async () => {
  for (const response of [new Response('<html>Sign in</html>', {headers: {'content-type': 'text/html'}}), new Response('denied', {status: 401}), new Response('denied', {status: 403})]) {
    const h = harness(async () => response); await h.hello(); await h.read('briefings');
    const result = h.sent.at(-1).message;
    assert.equal(result.ok, false); assert.equal(result.error, 'AUTH_REQUIRED'); assert.equal(result.data, undefined); h.stop();
  }
});

test('invalid source schema and malformed JSON are rejected', async () => {
  for (const response of [Response.json({schema: 'WRONG'}), new Response('{', {headers: {'content-type': 'application/json'}})]) {
    const h = harness(async () => response); await h.hello(); await h.read('briefings');
    assert.equal(h.sent.at(-1).message.error, 'INVALID_SOURCE'); h.stop();
  }
});

test('disconnect and closed opener stop subsequent requests', async () => {
  for (const close of [h => h.stop(), h => {h.view.opener.closed = true; h.view.tick();}]) {
    const h = harness(); await h.hello(); close(h); await h.read('briefings');
    assert.equal(h.calls.length, 0); assert.match(h.statuses.at(-1), /Disconnected/);
  }
});

test('missing opener or invalid fragment never registers a listener', () => {
  for (const [opener, hash] of [[null, '#' + nonce], [{}, '#short'], [{}, '#nonce=' + nonce]]) {
    let attached = false;
    const view = {opener, location: {hash}, addEventListener: () => {attached = true;}};
    mountWebsiteConnection(view, {fetchImpl: async () => {throw Error('must not fetch');}});
    assert.equal(attached, false);
  }
});

test('bounds pending requests and aborts without emitting data after disconnect', async () => {
  const waits = [];
  const h = harness((route, options) => new Promise((resolve, reject) => {
    waits.push(resolve);
    options.signal.addEventListener('abort', () => reject(Error('aborted')), {once: true});
  }));
  await h.hello();
  const pending = ['a', 'b', 'c', 'd'].map(id => h.event({type: 'CHAMBER_READ', id, feed: 'briefings'}));
  await h.event({type: 'CHAMBER_READ', id: 'e', feed: 'briefings'});
  assert.equal(h.calls.length, 4); assert.equal(h.sent.at(-1).message.error, 'BUSY');
  h.stop();
  const sentAtDisconnect = h.sent.length;
  await Promise.all(pending);
  assert.equal(h.sent.length, sentAtDisconnect);
  assert.equal(h.sent.at(-1).message.type, 'CHAMBER_DISCONNECTED');
});
