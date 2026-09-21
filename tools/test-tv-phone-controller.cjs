const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),assert=require('node:assert/strict'),{test}=require('node:test');
const base=path.resolve(__dirname,'..'),P=require('../assets/runtime/aegis-tv-protocol.js');
function phone(options={}){
 let now=1000,autoSubmits=0,replacedUrl=null;const intervals=[],peers=[],events={},nodes=new Map();
 class Emitter{constructor(){this.handlers={};this.open=true;this.sent=[];}on(n,f){this.handlers[n]=f;}emit(n,x){this.handlers[n]?.(x);}send(m){this.sent.push(m);}destroy(){this.destroyed=true;}}
 class Peer extends Emitter{constructor(){super();peers.push(this);}connect(){return this.channel=new Emitter();}}
 const get=id=>{if(!nodes.has(id))nodes.set(id,{value:'AAAAAABBBBBB',hidden:false,classList:{add(){},remove(){}},setAttribute(){},setPointerCapture(){},requestSubmit(){autoSubmits++;this.onsubmit({preventDefault(){}});}});return nodes.get(id);};
 const document={hidden:false,getElementById:get,querySelectorAll:()=>[],addEventListener:(n,f)=>events[n]=f};
 const window={location:new URL(options.url||"https://example.test/AEGIS_Phone_Controller.html"),history:{replaceState(_state,_title,url){replacedUrl=url;}},AEGIS_TV_PROTOCOL:P,Peer,RTCPeerConnection:function(){},addEventListener:(n,f)=>events[n]=f};
 vm.runInNewContext(fs.readFileSync(path.join(base,'assets/runtime/aegis-tv-phone.js'),'utf8'),{window,document,Peer,Date:{now:()=>now},performance:{now:()=>now},setTimeout:()=>1,clearTimeout(){},setInterval:f=>intervals.push(f),requestAnimationFrame:()=>1,cancelAnimationFrame(){}});
 if(!peers.length)get('pairForm').onsubmit({preventDefault(){}});const peer=peers[0];peer.emit('open');const channel=peer.channel;channel.emit('open');channel.emit('data',{type:'ready',version:P.VERSION,lease:1});
 return{get,peer,channel,document,events,autoSubmits,replacedUrl,now:()=>now,pong:()=>channel.emit('data',{type:'pong',at:now,lease:2}),tick:ms=>{now+=ms;intervals.forEach(f=>f());}};
}
test('long TV menu stalls preserve pairing, release dragging, suppress input and recover',()=>{
 const h=phone();h.get('drag').onclick();assert.equal(h.channel.sent.at(-1).action.kind,'down');h.tick(7000);
 assert.ok(!h.peer.destroyed);assert.equal(h.get('controls').hidden,false);assert.match(h.get('status').textContent,/busy/);
 assert.ok(h.channel.sent.some(m=>m.action?.kind==='release'));const before=h.channel.sent.length;
 h.get('tap').onclick();h.get('drag').onclick();assert.equal(h.channel.sent.length,before);
 h.tick(60000);assert.ok(!h.peer.destroyed);h.pong();h.get('tap').onclick();assert.equal(h.channel.sent.at(-1).action.kind,'click');
 h.channel.emit('close');assert.ok(h.peer.destroyed);assert.equal(h.get('controls').hidden,true);
});
test('background phone waits for a TV reply before accepting input on return',()=>{
 const h=phone();h.document.hidden=true;h.events.visibilitychange();const before=h.channel.sent.length;h.tick(60000);h.get('tap').onclick();assert.equal(h.channel.sent.length,before);
 h.document.hidden=false;h.events.visibilitychange();const waiting=h.channel.sent.length;h.get('tap').onclick();assert.equal(h.channel.sent.length,waiting);
 h.pong();h.get('tap').onclick();assert.equal(h.channel.sent.at(-1).action.kind,'click');
});
test('pairing codes are random, normalized and validated; IDs omit the secret',()=>{const codes=new Set();for(let i=0;i<100;i++){const c=P.makeCode();codes.add(c);assert.ok(P.validCode(c));assert.equal(P.cleanCode(c.slice(0,6)+'-'+c.slice(6)),c);assert.ok(!P.peerId(c).includes(c.slice(6)));}assert.equal(codes.size,100);assert.equal(P.validCode('AAAAAA-AAAAA!'),false);assert.equal(P.validCode('AAAA'),false);});
test('only bounded controller commands pass validation',()=>{assert.deepEqual(P.normalize({kind:'move',dx:Infinity,dy:1e6}),{kind:'move',dx:0,dy:150});assert.equal(P.normalize({kind:'text',text:'x'.repeat(201)}),null);assert.equal(P.normalize({kind:'select',index:-1}),null);assert.equal(P.normalize({kind:'key',key:'F5'}),null);assert.equal(P.normalize({kind:'navigate',url:'https://example.com'}),null);assert.equal(P.normalize({kind:'eval',code:'alert(1)'}),null);assert.deepEqual(P.normalize({kind:'text',text:'Fort Aegis'}),{kind:'text',text:'Fort Aegis'});});
function host(){
 let now=0;const intervals=[],peers=[],events={},nodes=new Map(),inputs=[];let releases=0;
 class Emitter{constructor(){this.handlers={};this.open=true;this.sent=[];}on(n,f){this.handlers[n]=f;return this;}emit(n,x){this.handlers[n]?.(x);}send(m){this.sent.push(m);}close(){this.open=false;this.emit('close');}destroy(){this.destroyed=true;}}
 class Peer extends Emitter{constructor(id,options){super();this.id=id;this.options=options;peers.push(this);}}
 const get=id=>{if(!nodes.has(id))nodes.set(id,{hidden:false,disabled:false,checked:true,textContent:'',style:{},innerHTML:'',replaceChildren(){this.innerHTML='';}});return nodes.get(id);};
 const document={getElementById:get,addEventListener:(n,f)=>events[n]=f,documentElement:{requestFullscreen:()=>Promise.resolve()}};
 const window={qrcode:require("../assets/vendor/qrcode-generator-2.0.4.js"),RTCPeerConnection:function(){},Peer,AEGIS_TV_PROTOCOL:P,AEGIS_CREATE_TV_INPUT:()=>({input:a=>inputs.push(a),release:()=>releases++}),addEventListener:(n,f)=>events[n]=f};
 vm.runInNewContext(fs.readFileSync(path.join(base,'assets/runtime/aegis-tv-host.js'),'utf8'),{window,document,Peer,URL,location:{href:'https://example.test/AEGIS_TV.html'},Date:{now:()=>now},performance:{now:()=>now},setTimeout:()=>1,clearTimeout(){},setInterval:f=>intervals.push(f),localStorage:{setItem(){}}});
 get('pair').onclick();const peer=peers[0];peer.emit('open');const code=P.cleanCode(get('code').textContent);
 return{get,peer,peers,code,inputs,Emitter,window,document,events,releases:()=>releases,tick:ms=>{now+=ms;intervals.forEach(f=>f());}};
}
test('TV Lite is established before loading the game, with an explicit standard opt-out',()=>{
 const lite=host();lite.get('start').onclick();assert.equal(lite.window.AEGIS_TV_PROFILE,'lite');assert.equal(lite.get('game').src,'./index.html');assert.equal(lite.get('performance').disabled,true);
 const standard=host();standard.get('performance').checked=false;standard.get('start').onclick();assert.equal(standard.window.AEGIS_TV_PROFILE,'standard');
});
test('heartbeat echoes the phone timestamp and reports round-trip processing delay',()=>{
 const tv=host(),channel=new tv.Emitter();tv.peer.emit('connection',channel);channel.emit('data',{type:'hello',version:P.VERSION,secret:tv.code.slice(6)});channel.emit('data',{type:'ping',at:2000});assert.equal(channel.sent.at(-1).at,2000);
 const h=phone();h.tick(1000);const ping=h.channel.sent.at(-1);assert.equal(ping.type,'ping');h.tick(300);h.channel.emit('data',{type:'pong',at:ping.at,lease:2});assert.equal(h.get('latency').textContent,'TV response: 300 ms');
});
test('TV rejects incorrect secrets before forwarding any input',()=>{const h=host(),c=new h.Emitter();h.peer.emit('connection',c);c.emit('data',{type:'hello',version:P.VERSION,secret:'WRONG!'});assert.equal(c.open,false);assert.equal(h.inputs.length,0);assert.equal(h.get('start').disabled,true);});
test('authenticated phone controls the started game; second phones cannot replace it',()=>{const h=host(),c=new h.Emitter();h.peer.emit('connection',c);c.emit('data',{type:'hello',version:P.VERSION,secret:h.code.slice(6)});assert.equal(c.sent[0].type,'ready');c.emit('data',{type:'input',lease:c.sent[0]?.lease,action:{kind:'click'}});assert.equal(h.inputs.length,0);h.get('start').onclick();c.emit('data',{type:'input',lease:c.sent[0]?.lease,action:{kind:'click'}});assert.equal(h.inputs.length,1);const other=new h.Emitter();h.peer.emit('connection',other);other.emit('open');assert.equal(other.open,false);});
test('missing heartbeats and disconnect release held controls; input is rate bounded',()=>{const h=host(),c=new h.Emitter();h.peer.emit('connection',c);c.emit('data',{type:'hello',version:P.VERSION,secret:h.code.slice(6)});h.get('start').onclick();for(let i=0;i<200;i++)c.emit('data',{type:'input',lease:c.sent[0]?.lease,action:{kind:'move',dx:1,dy:0}});assert.equal(h.inputs.length,120);const before=h.releases();h.tick(4000);assert.ok(h.releases()>before);assert.match(h.get('status').textContent,/interrupted/);c.close();assert.match(h.get('status').textContent,/disconnected/);});
test('TV and phone pages are packaged as tools, including their local dependency',()=>{const sw=fs.readFileSync(path.join(base,'service-worker.js'),'utf8');for(const name of ['AEGIS_TV.html','AEGIS_Phone_Controller.html','assets/vendor/peerjs-1.5.5.min.js','assets/runtime/aegis-tv-input.js'])assert.ok(sw.includes(name));});
test('release commands remain effective when motion rate limiting is active',()=>{const h=host(),c=new h.Emitter();h.peer.emit('connection',c);c.emit('data',{type:'hello',version:P.VERSION,secret:h.code.slice(6)});h.get('start').onclick();for(let i=0;i<200;i++)c.emit('data',{type:'input',lease:c.sent[0]?.lease,action:{kind:'move',dx:1,dy:0}});c.emit('data',{type:'input',lease:c.sent[0]?.lease,action:{kind:'up'}});assert.equal(h.inputs.at(-1).kind,'up');});
test('held input is safely released if the disposable game iframe was destroyed',()=>{
 const emitted=[];class Mouse{constructor(type,options){this.type=type;Object.assign(this,options);}}
 const root={innerWidth:1000,innerHeight:600,AEGIS_TV_PROTOCOL:P,PointerEvent:Mouse,MouseEvent:Mouse};
 const doc={defaultView:root},canvas={ownerDocument:doc,isConnected:true,dispatchEvent:e=>emitted.push(e)};doc.elementFromPoint=()=>canvas;
 const frame={contentDocument:doc,getBoundingClientRect:()=>({left:0,top:0})},cursor={style:{}};
 vm.runInNewContext(fs.readFileSync(path.join(base,'assets/runtime/aegis-tv-input.js'),'utf8'),{window:root});
 const adapter=root.AEGIS_CREATE_TV_INPUT(frame,cursor);adapter.input({kind:'down'});assert.ok(emitted.some(e=>e.type==='pointerdown'));doc.defaultView=null;canvas.isConnected=false;assert.doesNotThrow(()=>adapter.release());
});
test('TV-issued leases expire without depending on the phone clock and stay bounded',()=>{
 let time=10;const gate=P.createInputLease(()=>time),first=gate.issue();assert.equal(gate.accept(first),true);
 time+=P.INPUT_LEASE_MS;assert.equal(gate.accept(first),false);const next=gate.issue();assert.equal(gate.accept(next),true);
 for(let i=0;i<4;i++)gate.issue();assert.equal(gate.accept(next),false);const current=gate.issue();gate.clear();assert.equal(gate.accept(current),false);
});
test('queued clicks from before a TV stall are dropped; fresh input and releases still work',()=>{
 const h=host(),c=new h.Emitter();h.peer.emit('connection',c);c.emit('data',{type:'hello',version:P.VERSION,secret:h.code.slice(6)});h.get('start').onclick();const oldLease=c.sent[0].lease;
 h.tick(P.INPUT_LEASE_MS+1);c.emit('data',{type:'input',lease:oldLease,action:{kind:'click'}});assert.equal(h.inputs.length,0);
 c.emit('data',{type:'ping',at:-900000});const fresh=c.sent.at(-1).lease;c.emit('data',{type:'input',lease:oldLease,action:{kind:'click'}});assert.equal(h.inputs.length,0);
 c.emit('data',{type:'input',lease:fresh,action:{kind:'click'}});assert.equal(h.inputs.length,1);
 h.get('showPair').onclick();assert.equal(h.window.AEGIS_TV_SUSPENDED,true);h.get('start').onclick();assert.equal(h.window.AEGIS_TV_SUSPENDED,false);
 c.emit('data',{type:'input',lease:fresh,action:{kind:'click'}});assert.equal(h.inputs.length,1);
 h.get('showPair').onclick();c.emit('data',{type:'input',lease:oldLease,action:{kind:'up'}});assert.equal(h.inputs.at(-1).kind,'up');
});
test('late heartbeat replies and network backpressure cannot reactivate input',()=>{
 const h=phone(),beforeStall=h.now();h.tick(7000);h.channel.emit('data',{type:'pong',at:beforeStall,lease:2});const before=h.channel.sent.length;h.get('tap').onclick();assert.equal(h.channel.sent.length,before);
 h.pong();h.channel.dataChannel={bufferedAmount:70000};h.get('tap').onclick();assert.equal(h.channel.sent.length,before+1); // recovery sent only release
 h.tick(1000);assert.match(h.get('status').textContent,/busy/);h.channel.dataChannel.bufferedAmount=0;h.pong();h.get('tap').onclick();assert.equal(h.channel.sent.at(-1).action.kind,'click');
});
test('waking the phone requires a reply to a probe sent after waking',()=>{
 const h=phone(),old=h.now();h.document.hidden=true;h.events.visibilitychange();h.tick(1000);h.document.hidden=false;h.events.visibilitychange();h.channel.emit('data',{type:'pong',at:old,lease:2});const before=h.channel.sent.length;h.get('tap').onclick();assert.equal(h.channel.sent.length,before);h.pong();h.get('tap').onclick();assert.equal(h.channel.sent.at(-1).action.kind,'click');
});
test('cached incompatible controller versions get an explicit reload message',()=>{
 const h=host(),c=new h.Emitter();h.peer.emit('connection',c);c.emit('data',{type:'hello',version:1,secret:h.code.slice(6)});assert.equal(c.sent.at(-1).type,'upgrade');assert.equal(h.get('start').disabled,true);
 const phoneState=phone();phoneState.channel.emit('data',{type:'upgrade'});assert.match(phoneState.get('status').textContent,/Reload both/);assert.ok(phoneState.peer.destroyed);
});
test('tap flushes pending pointer movement before clicking',()=>{
 const h=phone(),pad=h.get('pad'),event={pointerId:1,clientX:10,clientY:10,preventDefault(){}};
 pad.onpointerdown(event);pad.onpointermove({...event,clientX:12});h.get('tap').onclick();assert.equal(h.channel.sent.at(-2).action.kind,'move');assert.equal(h.channel.sent.at(-1).action.kind,'click');
});
test('Enter honors handled key events and disabled controls do not activate',()=>{
 class Event{constructor(type,options){Object.assign(this,options);this.type=type;this.defaultPrevented=false;}preventDefault(){this.defaultPrevented=true;}}
 const root={innerWidth:100,innerHeight:100,AEGIS_TV_PROTOCOL:P,KeyboardEvent:Event,PointerEvent:Event,MouseEvent:Event};
 let handled=true,activated=0,clicks=0;const doc={defaultView:root},button={ownerDocument:doc,isConnected:true,tagName:'BUTTON',disabled:false,closest(){return this;},matches:q=>q==='button,a[href]',click(){clicks++;},dispatchEvent(e){if(e.type==='keydown'&&handled){activated++;e.preventDefault();}},focus(){}};doc.elementFromPoint=()=>button;doc.activeElement=button;
 vm.runInNewContext(fs.readFileSync(path.join(base,'assets/runtime/aegis-tv-input.js'),'utf8'),{window:root});const adapter=root.AEGIS_CREATE_TV_INPUT({contentDocument:doc,getBoundingClientRect:()=>({left:0,top:0})},{style:{}});
 adapter.input({kind:'key',key:'Enter'});assert.equal(activated,1);assert.equal(clicks,0);handled=false;adapter.input({kind:'key',key:'Enter'});assert.equal(clicks,1);
 button.disabled=true;adapter.input({kind:'key',key:'Enter'});adapter.input({kind:'click'});assert.equal(clicks,1);assert.equal(activated,1);
});
test('QR pairing URLs keep the secret in the fragment and preserve hosted subdirectories',()=>{
 const link=P.pairingUrl('https://example.test/my%20game/AEGIS_Phone_Controller.html','abcdef-234567');const url=new URL(link);
 assert.equal(url.pathname,'/my%20game/AEGIS_Phone_Controller.html');assert.equal(url.search,'');assert.equal(url.hash,'#pair=ABCDEF234567');assert.equal(P.pairingCode(link),'ABCDEF234567');
 assert.equal(P.pairingCode('https://example.test/?pair=ABCDEF234567'),'');assert.equal(P.pairingCode('https://example.test/#pair=INVALID'),'');assert.equal(P.pairingCode('javascript:alert(1)#pair=ABCDEF234567'),'');assert.throws(()=>P.pairingUrl('file:///game.html','ABCDEF234567'));
});
test('scanning prefills the phone, removes the secret from history and automatically pairs',()=>{
 const h=phone({url:'https://example.test/game/AEGIS_Phone_Controller.html#pair=ABCDEF234567'});
 assert.equal(h.autoSubmits,1);assert.equal(h.get('code').value,'ABCDEF234567');assert.equal(h.replacedUrl,'/game/AEGIS_Phone_Controller.html');assert.equal(h.channel.sent[0].secret,'234567');assert.equal(h.get('controls').hidden,false);
 const bad=phone({url:'https://example.test/game/AEGIS_Phone_Controller.html#pair=INVALID'});assert.equal(bad.autoSubmits,0);
});
test('TV generates a local SVG QR and replaces it only after the new pairing ID is ready',()=>{
 const h=host(),old=h.get('pairQr').innerHTML;assert.match(old,/<svg/);assert.match(old,/fill="white"/);assert.match(old,/fill="black"/);assert.equal(P.pairingCode(h.get('phoneLink').href),h.code);
 h.get('pair').onclick();assert.equal(h.get('pairQr').hidden,true);assert.equal(h.get('pairQr').innerHTML,'');assert.equal(new URL(h.get('phoneLink').href).hash,'');h.peers[1].emit('open');assert.notEqual(h.get('pairQr').innerHTML,old);assert.equal(P.pairingCode(h.get('phoneLink').href),P.cleanCode(h.get('code').textContent));
 h.window.qrcode=null;h.get('pair').onclick();h.peers[2].emit('open');assert.match(h.get('qrHint').textContent,/QR unavailable/);assert.ok(P.validCode(h.get('code').textContent));
 const sw=fs.readFileSync(path.join(base,'service-worker.js'),'utf8');assert.ok(sw.includes('./assets/vendor/qrcode-generator-2.0.4.js'));
});
test('signaling-server errors do not destroy an established direct controller channel',()=>{
 const h=phone();h.peer.emit('error',{type:'network'});assert.ok(!h.peer.destroyed);h.get('tap').onclick();assert.equal(h.channel.sent.at(-1).action.kind,'click');h.channel.emit('close');assert.ok(h.peer.destroyed);
});
