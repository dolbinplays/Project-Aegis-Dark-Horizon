const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const {test} = require('node:test');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const source = read('src/browser-runtime.html');
const host = read('index.html');
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
function between(text, start, end) {
  const a = text.indexOf(start), b = text.indexOf(end, a + start.length);
  assert.ok(a >= 0 && b > a, `Missing executable seam: ${start}`);
  return text.slice(a, b);
}

function packageInMemory(overrides = {}, writes = new Map()) {
  const virtualFs = {...fs,
    readFileSync(file, encoding) {
      const name = path.relative(root, file).replaceAll('\\', '/');
      return Object.hasOwn(overrides, name) ? overrides[name] : fs.readFileSync(file, encoding);
    },
    writeFileSync(file, content) { writes.set(path.relative(root, file).replaceAll('\\', '/'), content); },
  };
  vm.runInNewContext(read('tools/package-runtime-shell.cjs'), {
    require: name => name === 'fs' ? virtualFs : require(name),
    __dirname: path.join(root, 'tools'), Buffer, console: {log() {}},
  });
  return writes;
}

test('Normal packaging retains the complete PWA shell and produces current release metadata', () => {
  const writes = packageInMemory(), generated = writes.get('index.html');
  assert.equal(generated, host, 'The shipped host must be reproducible from its canonical template');
  assert.match(generated, /<link rel="manifest" href="\.\/manifest.webmanifest"/);
  assert.match(generated, /pwaInstall:'manifest-service-worker-install-prompt',getPwaState,requestInstall/);
  assert.match(generated, /navigator.serviceWorker.register\("\.\/service-worker.js"/);
  const metadata = JSON.parse(writes.get('release-metadata.json'));
  assert.equal(metadata.build, JSON.parse(read('src/manifest.json')).currentBuild);
  assert.equal(metadata.runtime_bytes, Buffer.byteLength(source));
  assert.equal(metadata.runtime_sha256, hash(source));
  assert.equal(metadata.host_sha256, hash(generated));
  assert.equal(writes.get('release-metadata.json'), read('release-metadata.json'));
  assert.equal(writes.get('service-worker.js'), read('service-worker.js'));
  const payload = generated.match(/<script id="aegis-runtime-payload"[^>]*>([^]*?)<\/script>/)[1];
  assert.equal(Buffer.from(payload.trim(), 'base64').toString('utf8'), source);
});

test('Packaging refreshes both worker cache versions and rejects stale source identity before writing', () => {
  const staleWorker = read('service-worker.js').replaceAll(JSON.parse(read('src/manifest.json')).currentBuild, 'stale-build');
  assert.equal(packageInMemory({'service-worker.js': staleWorker}).get('service-worker.js'), read('service-worker.js'));
  const manifest = JSON.parse(read('src/manifest.json'));
  manifest.currentBuild = 'stale-build';
  const writes = new Map();
  assert.throws(() => packageInMemory({'src/manifest.json': JSON.stringify(manifest)}, writes), /Synchronize src\/manifest.json/);
  assert.equal(writes.size, 0);
});

test('Generated install prompt works and file launches do not register a service worker', async () => {
  const events = {}, registrations = [];
  const location = {protocol: 'https:', hostname: 'example.test'};
  const navigator = {userAgent: 'test', serviceWorker: {register: (...args) => {
    registrations.push(args); return Promise.resolve({update: () => Promise.resolve()});
  }}};
  const context = vm.createContext({location, navigator, runtimeFrame: null, console,
    window: {location, isSecureContext: true, addEventListener: (key, callback) => { events[key] = callback; }},
  });
  vm.runInContext(between(host, 'const pwaState=', "const RESUME_TOKEN_KEY="), context);
  let prompts = 0;
  events.beforeinstallprompt({preventDefault() {}, prompt: async () => { prompts++; }, userChoice: Promise.resolve({outcome: 'accepted'})});
  assert.equal(context.getPwaState().canPrompt, true);
  assert.equal((await context.requestInstall()).outcome, 'accepted');
  assert.equal(prompts, 1);
  context.registerAegisServiceWorker();
  assert.equal(registrations.length, 1);
  location.protocol = 'file:'; context.window.isSecureContext = false;
  context.registerAegisServiceWorker();
  assert.equal(registrations.length, 1);
});

function workerFixture(scope = 'https://example.test/game/') {
  const handlers = {}, stores = new Map();
  const currentBuild = JSON.parse(read('src/manifest.json')).currentBuild;
  let online = true, body = 'GAME';
  const normalize = request => new URL(typeof request === 'string' ? request : request.url, scope).href;
  const caches = {
    async open(name) {
      if (!stores.has(name)) stores.set(name, new Map());
      const store = stores.get(name);
      return {put: async (key, response) => { store.set(normalize(key), response.clone()); }, match: async key => store.get(normalize(key))?.clone()};
    },
    async keys() { return [...stores.keys()]; },
    async delete(name) { return stores.delete(name); },
    async match(key) {
      for (const name of stores.keys()) {
        const response = await (await this.open(name)).match(key);
        if (response) return response;
      }
      return undefined;
    },
  };
  vm.runInNewContext(read('service-worker.js'), {URL, Request, Response, Headers, AbortController, setTimeout, clearTimeout, Date, caches,
    self: {location: new URL(scope), registration: {scope}, clients: {claim: async () => {}}, skipWaiting: async () => {}, addEventListener: (key, callback) => { handlers[key] = callback; }},
    fetch: async request => {
      if (!online) throw Error('Offline');
      const url = new URL(typeof request === 'string' ? request : request.url, scope);
      if (url.pathname.endsWith('/release-metadata.json')) return new Response(JSON.stringify({build: currentBuild}), {headers: {'content-type': 'application/json'}});
      return new Response(body);
    },
  });
  return {
    setNetwork(value, nextBody = body) { online = value; body = nextBody; },
    navigate(page) {
      let response;
      handlers.fetch({request: {url: new URL(page, scope).href, mode: 'navigate', method: 'GET', headers: new Headers()},
        respondWith: value => { response = value; }, waitUntil() {},
      });
      return response;
    },
  };
}

test('Visiting editors or QA pages cannot overwrite the offline game at a project subpath', async () => {
  const worker = workerFixture();
  assert.equal(await (await worker.navigate('index.html')).text(), 'GAME');
  worker.setNetwork(true, 'POSE EDITOR');
  for (const page of ['AEGIS_Articulated_Pose_Editor_CURRENT.html', 'tools/mobile-interface-qa.html?health', 'src/browser-runtime.html']) {
    assert.equal(worker.navigate(page), undefined, 'Non-game navigation stays with the browser');
  }
  worker.setNetwork(false);
  assert.equal(await (await worker.navigate('index.html')).text(), 'GAME');
});

test('Root and index query variants share the offline game, including a root deployment', async () => {
  for (const scope of ['https://example.test/game/', 'https://example.test/']) {
    const worker = workerFixture(scope);
    await worker.navigate('./?installed=1');
    worker.setNetwork(false);
    for (const page of ['./', 'index.html', 'index.html?installed=1']) {
      assert.equal(await (await worker.navigate(page)).text(), 'GAME');
    }
  }
});

function audioFixture(initialMute = false) {
  let now = 0, nextTimer = 0;
  const timers = new Map(), muted = {current: initialMute};
  class Media {
    constructor(src = 'mission.mp3') { this.src = src; this.paused = false; this.volume = 0.65; this.__aegisCrossfadeGain = 1; }
    play() { this.paused = false; return Promise.resolve(); }
    pause() { this.paused = true; }
  }
  const gain = () => ({gain: {value: 0.65, cancelScheduledValues() {}, setTargetAtTime(value) { this.value = value; }}});
  const audio = {media: new Media(), mediaSegmentKey: 'search', dialogueMediaPlayers: new Set([new Media()]),
    victoryMedia: new Media(), ctx: {currentTime: 0}, gain: gain(), sfxGain: gain(), voiceGain: gain()};
  const context = vm.createContext({audioRef: {current: audio}, masterMutedRef: muted,
    Audio: Media, performance: {now: () => now}, CONTACT_IN_THE_DARK_CROSSFADE_MS: 1000,
    clamp: (x, a, b) => Math.min(b, Math.max(a, x)), dialogueMusicDuckFactor: () => 1,
    volumeToGain: x => x / 100, sfxVolumeToGain: x => x / 100, voiceVolumeToGain: x => x / 100,
    directFileDialogueVolume: x => x / 100, DIALOGUE_MUSIC_DUCK_FACTOR: 0.3,
    isContactInTheDarkMissionMedia: () => true, cleanupContactInTheDarkLoop() {},
    armContactInTheDarkLoop: (media, key) => { media.__aegisSegmentKey = key; },
    setInterval: callback => { timers.set(++nextTimer, callback); return nextTimer; }, clearInterval: id => timers.delete(id),
    setTimeout: callback => { timers.set(++nextTimer, callback); return nextTimer; }, clearTimeout: id => timers.delete(id),
  });
  // Recreate React render snapshots while refs, audio players, and old timers survive.
  vm.runInContext(`function render(masterMuted) {
    const musicPlaying=true,musicVolume=65,sfxVolume=70,voiceVolume=80,voiceEnabled=true;
    ${between(source, 'function musicMediaTargetVolume(', 'function playMusicAudio(')}
    ${between(source, 'function applyMasterAudioMuteState(', 'function toggleMasterAudioMute(')}
    ${between(source, 'function setDialogueMusicDuck(', '\nfunction ')}
    return {start:setContactInTheDarkSegment,mute:applyMasterAudioMuteState,duckEnd:endDialogueMusicDuck};
  }`, context);
  return {audio, render: context.render, tick(time) { now = time; for (const callback of [...timers.values()]) callback(); }};
}

test('A crossfade begun before Mute stays silent through every remaining timer tick', () => {
  const fixture = audioFixture(), oldRender = fixture.render(false);
  oldRender.start(true);
  fixture.tick(300);
  assert.ok(fixture.audio.media.volume > 0);
  fixture.render(true).mute(true);
  const outgoing = fixture.audio.mediaFadingOut;
  for (const time of [350, 700, 1000]) {
    fixture.tick(time);
    assert.equal(fixture.audio.media.volume, 0);
    assert.equal(outgoing.volume, 0);
  }
  fixture.render(false).mute(false);
  assert.equal(fixture.audio.media.volume, 0.65);
});

test('A crossfade begun while muted resumes at the preserved gain when unmuted', () => {
  const fixture = audioFixture(true), oldRender = fixture.render(true);
  oldRender.mute(true); oldRender.start(true); fixture.tick(250);
  assert.equal(fixture.audio.media.volume, 0);
  fixture.render(false).mute(false); fixture.tick(500);
  assert.equal(fixture.audio.media.volume, 0.325);
  assert.equal(fixture.audio.mediaFadingOut.volume, 0.325);
});

test('Delayed dialogue duck release cannot unmute music, voice, SFX, or victory media', () => {
  const fixture = audioFixture(), oldRender = fixture.render(false);
  oldRender.duckEnd(); fixture.render(true).mute(true); fixture.tick(180);
  for (const media of [fixture.audio.media, fixture.audio.victoryMedia, ...fixture.audio.dialogueMediaPlayers]) assert.equal(media.volume, 0);
  for (const node of [fixture.audio.gain, fixture.audio.sfxGain, fixture.audio.voiceGain]) assert.equal(node.gain.value, 0);
});

test('Audio continuity preserves mute and the host bridge cannot fade up while muted', () => {
  const bridge = {volume: 0, src: '', paused: true, play() { this.paused = false; }, pause() { this.paused = true; }, load() {}, getAttribute() { return this.src; }};
  let tick;
  const context = vm.createContext({bridge, bridgeFadeFrame: 0, lastAudioState: {},
    metrics: {bridgePlayFailures: 0}, performance: {now: () => 0},
    requestAnimationFrame: callback => { tick = callback; return 1; }, cancelAnimationFrame() {},
    clamp: (x, a, b) => Math.min(b, Math.max(a, x)),
  });
  vm.runInContext(between(source, 'function writeAegisAudioContinuity(', '\nfunction '), context);
  const state = context.writeAegisAudioContinuity({masterMuted: true, musicPlaying: true, musicVolume: 65});
  assert.equal(state.masterMuted, true); assert.equal(state.musicVolume, 65);
  vm.runInContext(between(host, 'function bridgeSource(', 'function showTransition('), context);
  context.syncAudio({...state, masterMuted: false}, {prime: true});
  context.fadeBridge(context.targetBridgeVolume(), 1000); tick(300); assert.ok(bridge.volume > 0);
  context.syncAudio(state); tick(500);
  assert.equal(bridge.volume, 0); assert.equal(bridge.paused, true);
  assert.equal(context.ensureBridgePrimed(), false); assert.equal(context.targetBridgeVolume(), 0);
  context.syncAudio({...state, masterMuted: false}, {prime: true});
  context.fadeBridge(context.targetBridgeVolume(), 1000); tick(1000);
  assert.equal(bridge.volume, 0.65);
});
