const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const crypto = require('node:crypto');
const path = require('node:path');
process.chdir(path.resolve(__dirname, '..'));
const events = {};
const cached = new Map();
let fetches = 0;
const ctx = vm.createContext({
  URL, Request, Response, Headers, TextEncoder, TextDecoder, Uint8Array, atob, btoa,
  crypto: crypto.webcrypto, setTimeout, clearTimeout, AbortController,
  self: { registration: { scope: 'https://example.test/aegis/' }, location: { origin: 'https://example.test' }, addEventListener: (type, fn) => events[type] = fn },
  caches: { match: async key => cached.get(key)?.clone(), open: async () => ({ put: async (key, value) => cached.set(key, value) }) },
  fetch: async () => { fetches++; throw Error('offline'); }
});
vm.runInContext(fs.readFileSync('service-worker.js', 'utf8'), ctx);
(async () => {
  const urls = vm.runInContext('[...AEGIS_TOOL_NAV_URLS]', ctx);
  for (const url of urls) {
    cached.set(url, new Response('tool page'));
    let response;
    events.fetch({ request: { method: 'GET', mode: 'navigate', url: url+'?aegisReturn=1&aegisFrom=game', headers: new Headers() }, respondWith: value => response = value });
    assert.ok(response, 'query-bearing tool navigation must be intercepted');
    assert.equal(await (await response).text(), 'tool page');
  }
  assert.equal(fetches, 0, 'offline tool navigation should use the pre-cache');
  const html = fs.readFileSync('index.html', 'utf8');
  const payload = html.match(/<script id="aegis-runtime-payload"([^>]*)>([\s\S]*?)<\/script>/);
  const bytes = Buffer.from(payload[2], 'base64');
  assert.equal(bytes.toString(), fs.readFileSync('src/browser-runtime.html', 'utf8'));
  assert.ok(payload[1].includes(crypto.createHash('sha256').update(bytes).digest('hex')));
  const button = vm.runInContext('AEGIS_NATIVE_TOOLS_BUTTON', ctx).replace(/,$/, '');
  assert.ok(bytes.toString().includes(button), 'packaged button must match the service-worker fallback');
  for (const mode of ['blocked', 'throws', 'opens']) {
    let alerts = 0;
    const location = { href: 'campaign' };
    const props = vm.runInNewContext(button, { URL, document: { baseURI: 'https://example.test/aegis/index.html' }, React: { createElement: (_, props) => props }, window: { location, top: { location }, open: () => { if (mode === 'throws') throw Error('blocked'); return mode === 'opens' ? {} : null; }, alert: () => alerts++ } });
    props.onClick();
    assert.equal(location.href, 'campaign');
    assert.equal(alerts, mode === 'opens' ? 0 : 1);
  }
  let callback, scans = 0;
  const timers = [];
  const doc = { documentElement: {}, querySelectorAll: () => { scans++; return []; }, querySelector: () => null };
  const root = { document: doc, location: { pathname: '/index.html' }, addEventListener() {}, setTimeout: fn => timers.push(fn) };
  root.top = root;
  const launcher = fs.readFileSync('assets/runtime/aegis-tools-editor-launcher-runtime.js', 'utf8');
  vm.runInNewContext(launcher, { window: root, document: doc, location: root.location, MutationObserver: class { constructor(fn) { callback = fn; } observe() {} }, URL });
  const initialScans = scans;
  for (let i = 0; i < 100; i++) callback();
  assert.equal(timers.length, 1, 'mutation bursts should schedule only one scan');
  assert.equal(scans, initialScans);
  timers.shift()();
  assert.equal(scans, initialScans * 2);
  const buttonAlready = launcher.match(/function buttonAlready\(container\)\{[^\n]+/)[0];
  const recognizesNative = vm.runInNewContext('('+buttonAlready+')', { BUTTON_ATTR: 'data-aegis-tools-editors-launcher' });
  assert.equal(recognizesNative({ querySelector: selector => selector.includes('[data-aegis-open-tools-editors]') ? {} : null }), true);
  console.log('PASS: offline tool routes, source/payload integrity, popup safety, mutation batching, native-button deduplication');
})().catch(error => { console.error(error); process.exitCode = 1; });
