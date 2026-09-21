(function(root){
'use strict';
const ALPHABET='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const VERSION=2,INPUT_LEASE_MS=2500;
// The TV timestamps leases using its own clock. Phone/TV wall clocks need not agree.
function createInputLease(now=()=>performance.now()){
 let serial=0;const leases=new Map();
 return{issue(){const token=++serial;leases.set(token,now()+INPUT_LEASE_MS);while(leases.size>4)leases.delete(leases.keys().next().value);return token;},accept(token){return Number.isSafeInteger(token)&&leases.has(token)&&now()<leases.get(token);},clear(){leases.clear();}};
}
function cleanCode(value){return String(value||'').toUpperCase().replace(/[\s-]/g,'');}
function validCode(value){const code=cleanCode(value);return code.length===12&&[...code].every(c=>ALPHABET.includes(c));}
function pairingUrl(controllerUrl,code){const url=new URL(controllerUrl);if(!['https:','http:'].includes(url.protocol)||!validCode(code))throw new Error('A hosted controller URL and valid pairing code are required.');url.hash='pair='+cleanCode(code);return url.href;}
function pairingCode(url){try{const parsed=new URL(url);if(!['https:','http:'].includes(parsed.protocol))return'';const code=new URLSearchParams(parsed.hash.slice(1)).get('pair');return code&&validCode(code)?cleanCode(code):'';}catch{return'';}}
function makeCode(){const bytes=new Uint8Array(12);root.crypto.getRandomValues(bytes);return [...bytes].map(b=>ALPHABET[b&31]).join('');}
function normalize(value){
 if(!value||typeof value!=='object')return null;
 const n=(x,max)=>Number.isFinite(x)?Math.max(-max,Math.min(max,x)):0;
 switch(value.kind){
 case 'move':return{kind:'move',dx:n(value.dx,150),dy:n(value.dy,150)};
 case 'scroll':return{kind:'scroll',dy:n(value.dy,400)};
 case 'click':case 'down':case 'up':case 'release':case 'center':return{kind:value.kind};
 case 'key':return ['Escape','Enter','Tab','ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(value.key)?{kind:'key',key:value.key}:null;
 case 'text':return typeof value.text==='string'&&value.text.length<=200?{kind:'text',text:value.text}:null;
 case 'select':return Number.isInteger(value.index)&&value.index>=0&&value.index<500?{kind:'select',index:value.index}:null;
 default:return null;
 }
}
function peerOptions(){return{debug:0,config:{iceServers:[{urls:'stun:stun.l.google.com:19302'}]}};}
root.AEGIS_TV_PROTOCOL={VERSION,INPUT_LEASE_MS,createInputLease,pairingUrl,pairingCode,cleanCode,validCode,makeCode,normalize,peerOptions,peerId:code=>'aegis-tv-v1-'+cleanCode(code).slice(0,6)};
if(typeof module==='object')module.exports=root.AEGIS_TV_PROTOCOL;
})(typeof window==='undefined'?globalThis:window);
