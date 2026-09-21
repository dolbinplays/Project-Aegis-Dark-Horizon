(()=>{'use strict';
const $=id=>document.getElementById(id),P=window.AEGIS_TV_PROTOCOL;
let peer=null,connection=null,code='',started=false,last=0,stale=false,attempts=0,attemptWindow=0,rate=0,rateWindow=0;
const leases=P.createInputLease(()=>performance.now());
const status=text=>{$('status').textContent=text;$('connection').textContent=text;};
const notify=value=>{if(connection?.open)connection.send(value);};
const input=window.AEGIS_CREATE_TV_INPUT($('game'),$('cursor'),notify);
const controllerUrl=new URL('./AEGIS_Phone_Controller.html',location.href);$('phoneLink').href=controllerUrl.href;$('phoneLink').textContent=controllerUrl.href;
function clearQr(){const qr=$('pairQr');qr.replaceChildren();qr.hidden=true;$('qrHint').textContent='Choose Pair phone to show a QR code.';$('phoneLink').href=controllerUrl.href;}
function showQr(){try{const url=P.pairingUrl(controllerUrl.href,code),qr=window.qrcode(0,'M');qr.addData(url,'Byte');qr.make();$('pairQr').innerHTML=qr.createSvgTag({cellSize:4,margin:16,scalable:true,alt:'Scan with your phone camera to connect to this TV.'});$('pairQr').hidden=false;$('qrHint').textContent='Scan with your phone camera. Open the link to connect.';$('phoneLink').href=url;}catch{$('qrHint').textContent='QR unavailable. Open the controller address and enter the code instead.';}}
function lost(){input.release();leases.clear();connection=null;$('start').disabled=!started;status('Phone disconnected. Reconnect with the code or pair again.');}
function syncPresentation(){window.AEGIS_TV_SUSPENDED=!started||!$('setup').hidden||!!document.hidden;window.AEGIS_TV_ACTIVE_RUNTIME?.setSuspended?.(window.AEGIS_TV_SUSPENDED);}
function pair(){
 if(!window.RTCPeerConnection||!window.Peer){status('This browser does not support WebRTC data channels. Update Silk or try a compatible TV browser.');return;}
 input.release();leases.clear();clearQr();if(connection)connection.close();connection=null;if(peer)peer.destroy();code=P.makeCode();$('code').textContent='Connecting…';$('pair').disabled=true;$('start').disabled=!started;
 peer=new Peer(P.peerId(code),P.peerOptions());const owner=peer;
 const connectTimeout=setTimeout(()=>{if(peer===owner&&!owner.open){$('pair').disabled=false;status('Pairing timed out. Check internet access and choose Pair phone again.');}},20000);
 peer.on('open',()=>{clearTimeout(connectTimeout);if(peer!==owner)return;$('code').textContent=code.slice(0,6)+'-'+code.slice(6);showQr();$('pair').textContent='New pairing code';$('pair').disabled=false;status('Waiting for your phone.');});
 peer.on('error',error=>{if(peer!==owner)return;$('pair').disabled=false;if(connection?.open){status('Phone connected. Pairing service unavailable; the current session can continue.');return;}status(error.type==='unavailable-id'?'Code unavailable. Choose New pairing code.':'Pairing unavailable. Check internet access and try again.');});
 peer.on('connection',candidate=>{
  if(connection?.open){candidate.on('open',()=>candidate.close());return;}
  let authenticated=false;const deadline=setTimeout(()=>{if(!authenticated)candidate.close();},10000);
  candidate.on('data',message=>{
   if(peer!==owner)return;
   if(!authenticated){const now=Date.now();if(now-attemptWindow>10000){attemptWindow=now;attempts=0;}if(++attempts>5||connection?.open||message?.type!=='hello'||message.secret!==code.slice(6)){candidate.close();return;}if(message.version!==P.VERSION){candidate.send({type:'upgrade',message:'Reload both the TV and phone pages to use the latest controller.'});setTimeout(()=>candidate.close(),500);return;}authenticated=true;clearTimeout(deadline);connection=candidate;leases.clear();last=Date.now();stale=false;$('start').disabled=false;status(started?'Phone connected':'Phone connected. Start game on TV.');candidate.send({type:'ready',version:P.VERSION,lease:leases.issue()});return;}
   if(candidate!==connection)return;last=Date.now();if(stale){stale=false;status('Phone connected');}
   if(message?.type==='ping'){candidate.send({type:'pong',at:Number.isFinite(message.at)?message.at:null,lease:leases.issue()});return;}
   if(message?.type==='input'){
    // Releases always pass, even when the TV is busy or its pairing overlay is open.
    if(message.action?.kind==='release'||message.action?.kind==='up'){input.input(message.action);return;}
    if(!started||!$('setup').hidden||document.hidden||!leases.accept(message.lease))return;
    const now=Date.now();if(now-rateWindow>1000){rateWindow=now;rate=0;}if(++rate<=120)input.input(message.action);
   }
  });
  candidate.on('close',()=>{clearTimeout(deadline);if(connection===candidate)lost();});candidate.on('error',()=>{if(connection===candidate)lost();});
 });
}
$('pair').onclick=pair;
$('start').onclick=()=>{if(!started){window.AEGIS_TV_PROFILE=$('performance').checked?'lite':'standard';$('performance').disabled=true;$('game').src='./index.html';started=true;}$('game').hidden=false;$('setup').hidden=true;$('hud').hidden=false;$('cursor').hidden=false;syncPresentation();status(connection?.open?'Phone connected':'Waiting for phone');notify({type:'notice',message:'Game ready. Slide to move the pointer; tap to select.'});$('start').textContent='Return to game';document.documentElement.requestFullscreen?.().catch(()=>{});};
$('showPair').onclick=()=>{input.release();leases.clear();$('setup').hidden=false;$('cursor').hidden=true;syncPresentation();};
$('diagnosticsToggle').onclick=()=>{$('diagnostics').hidden=!$('diagnostics').hidden;};
setInterval(()=>{if($('diagnostics').hidden)return;const report=window.AEGIS_TV_ACTIVE_RUNTIME?.snapshot();$('diagnostics').textContent=report?[
 'TV Lite · '+report.screen,
 '3D FPS (busiest view): '+report.fps+' · active renderers: '+report.renderers+' (0 FPS is normal when idle or in 2D)',
 'Event-loop delay: '+report.loopDelayMs+' ms',
 report.longTasksSupported?'Long tasks: '+report.longTasks+' · longest: '+report.longestTaskMs+' ms':'Long-task reporting unavailable in this browser',
 'Action near longest stall: '+report.lastStallAction,
 'Phone: '+(connection?.open?(stale?'waiting':'connected'):'disconnected')
].join('\n'):'TV Lite diagnostics become available after starting in TV Lite mode.';},1000);
$('fullscreen').onclick=()=>document.documentElement.requestFullscreen?.().catch(()=>status('Use the TV browser full-screen control.'));
setInterval(()=>{if(connection?.open&&Date.now()-last>3500&&!stale){stale=true;input.release();status('Phone paused or connection interrupted. Return to its controller page.');}},1000);
document.addEventListener('visibilitychange',()=>{if(document.hidden){input.release();leases.clear();}syncPresentation();});
window.addEventListener('pagehide',()=>{input.release();peer?.destroy();});
})();
