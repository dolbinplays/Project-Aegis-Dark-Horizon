(()=>{'use strict';
const $=id=>document.getElementById(id),P=window.AEGIS_TV_PROTOCOL;
let peer=null,connection=null,ready=false,stalled=false,drag=false,lastPong=0,lease=null,wakeAt=0,dx=0,dy=0,raf=0,joinTimer=0;
const now=()=>performance.now();
const congested=()=>Number(connection?.bufferSize)>0||Number(connection?.dataChannel?.bufferedAmount)>65536;
function ping(){if(connection?.open&&!congested())connection.send({type:'ping',at:now()});}
const status=text=>$('status').textContent=text;
function send(action){const releaseAction=action.kind==='release'||action.kind==='up';if(!ready||!connection?.open)return false;if(!releaseAction&&(stalled||document.hidden||congested()||now()-lastPong>=P.INPUT_LEASE_MS))return false;connection.send({type:'input',action:P.normalize(action),lease});return true;}
function pauseInput(){stalled=true;release();pointers.clear();$('pad').classList.remove('active');}
function release(){send({kind:'release'});drag=false;$('drag').setAttribute('aria-pressed','false');$('drag').textContent='Drag: off';dx=dy=0;if(raf)cancelAnimationFrame(raf);raf=0;}
function stop(message){pauseInput();ready=false;const old=peer;peer=null;connection=null;old?.destroy();clearTimeout(joinTimer);$('pairForm').hidden=false;$('controls').hidden=true;$('join').disabled=false;status(message);}
$('pairForm').onsubmit=event=>{event.preventDefault();const code=P.cleanCode($('code').value);if(!P.validCode(code)){status('Enter all 12 letters and numbers shown on the TV.');return;}if(!window.Peer||!window.RTCPeerConnection){status('This browser does not support the controller. Try current Safari or Chrome.');return;}stop('Connecting to TV…');$('join').disabled=true;peer=new Peer(P.peerOptions());const owner=peer;
 peer.on('open',()=>{if(peer!==owner)return;connection=peer.connect(P.peerId(code),{reliable:true,serialization:'json'});const channel=connection;
  channel.on('open',()=>{if(connection===channel)channel.send({type:'hello',version:P.VERSION,secret:code.slice(6)});});
  channel.on('data',message=>{if(connection!==channel)return;if(message?.type==='ready'){if(message.version!==P.VERSION||!Number.isSafeInteger(message.lease)){stop('Reload both the TV and phone pages to use the latest controller.');return;}clearTimeout(joinTimer);ready=true;stalled=false;lease=message.lease;lastPong=wakeAt=now();$('pairForm').hidden=true;$('controls').hidden=false;$('join').disabled=false;status('Connected. Press Start game on your TV.');}
   else if(message?.type==='upgrade')stop('Reload both the TV and phone pages to use the latest controller.');
   else if(message?.type==='pong'){const receivedAt=now(),rtt=receivedAt-message.at;if(Number.isFinite(message.at)&&$('latency'))$('latency').textContent='TV response: '+Math.round(Math.max(0,rtt))+' ms';if(!ready||document.hidden||!Number.isFinite(message.at)||message.at<wakeAt||rtt<0||rtt>=P.INPUT_LEASE_MS||!Number.isSafeInteger(message.lease)||congested())return;lastPong=receivedAt;lease=message.lease;if(stalled){stalled=false;release();status('Controller active.');}}
   else if(message?.type==='notice')status(String(message.message).slice(0,250));
   else if(message?.type==='select-options'&&Array.isArray(message.options)&&message.options.length<=500){$('choices').replaceChildren();for(const item of message.options){const o=document.createElement('option');o.value=String(item.index);o.textContent=String(item.label).slice(0,100);o.disabled=!!item.disabled;$('choices').append(o);}$('choices').value=String(message.selected);$('selectPanel').hidden=false;}
  });
  channel.on('close',()=>{if(connection===channel)stop('Disconnected. Reconnect with the TV code.');});channel.on('error',()=>{if(connection===channel)stop('Connection failed. Check both devices are on the same Wi-Fi.');});
 });
 peer.on('error',error=>{if(peer!==owner)return;if(ready&&connection?.open&&['network','server-error','socket-error','socket-closed','disconnected'].includes(error?.type)){status('Phone connected. Pairing service unavailable; the current session can continue.');return;}stop('Could not connect. Check the code and internet access; keep both devices on the same Wi-Fi.');});
 joinTimer=setTimeout(()=>{if(!ready&&peer===owner)stop('Pairing timed out. Check the code; guest Wi-Fi or VPNs may block a direct connection.');},20000);
};
// A blocked TV event loop is not a closed WebRTC channel. Keep pairing alive,
// suppress new actions while it is unresponsive, and recover on its next reply.
setInterval(()=>{if(ready&&connection?.open&&!document.hidden){if((now()-lastPong>=P.INPUT_LEASE_MS||congested())&&!stalled){pauseInput();status('TV is busy or connection is delayed. Controls resume when it responds.');}ping();}},1000);
function flush(){if(raf)cancelAnimationFrame(raf);raf=0;if(dx||dy){send({kind:'move',dx,dy});dx=dy=0;}}
const pointers=new Map();let traveled=0,multi=false;
$('pad').onpointerdown=e=>{e.preventDefault();if(stalled||document.hidden)return;if(!pointers.size){traveled=0;multi=false;}else multi=true;pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});$('pad').setPointerCapture(e.pointerId);$('pad').classList.add('active');};
$('pad').onpointermove=e=>{const old=pointers.get(e.pointerId);if(!old)return;e.preventDefault();const mx=e.clientX-old.x,my=e.clientY-old.y;pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});traveled+=Math.hypot(mx,my);if(pointers.size>1){send({kind:'scroll',dy:-my*2});return;}if(multi)return;const speed=Number($('sensitivity').value)||1.5;dx+=mx*speed;dy+=my*speed;if(!raf)raf=requestAnimationFrame(flush);};
function end(e){const was=pointers.delete(e.pointerId);if(!pointers.size){$('pad').classList.remove('active');flush();if(was&&e.type==='pointerup'&&!multi&&traveled<8&&!drag)send({kind:'click'});}}
$('pad').onpointerup=end;$('pad').onpointercancel=e=>{end(e);release();};
$('tap').onclick=()=>{flush();send({kind:'click'});};$('center').onclick=()=>{dx=dy=0;send({kind:'center'});};
$('drag').onclick=()=>{flush();if(!send({kind:drag?'up':'down'}))return;drag=!drag;$('drag').setAttribute('aria-pressed',String(drag));$('drag').textContent=drag?'Drag: ON':'Drag: off';};
document.querySelectorAll('[data-scroll]').forEach(b=>b.onclick=()=>send({kind:'scroll',dy:Number(b.dataset.scroll)}));document.querySelectorAll('[data-key]').forEach(b=>b.onclick=()=>send({kind:'key',key:b.dataset.key}));
$('sendText').onclick=()=>send({kind:'text',text:$('text').value});$('choose').onclick=()=>{send({kind:'select',index:Number($('choices').value)});$('selectPanel').hidden=true;};$('disconnect').onclick=()=>stop('Disconnected. Enter a TV code to reconnect.');
document.addEventListener('visibilitychange',()=>{pauseInput();wakeAt=now();if(!document.hidden&&ready&&connection?.open){status('Waiting for TV response…');ping();}});window.addEventListener('pagehide',()=>stop('Disconnected.'));
// A scanned code stays in the fragment, never in the controller HTTP request.
const scannedCode=P.pairingCode(window.location?.href||'');
if(scannedCode){$('code').value=scannedCode;try{window.history.replaceState(null,'',window.location.pathname+window.location.search);}catch{}$('pairForm').requestSubmit();}
})();
