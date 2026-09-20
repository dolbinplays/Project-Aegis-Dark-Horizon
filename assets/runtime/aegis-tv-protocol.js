(function(root){
'use strict';
const ALPHABET='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
function cleanCode(value){return String(value||'').toUpperCase().replace(/[\s-]/g,'');}
function validCode(value){const code=cleanCode(value);return code.length===12&&[...code].every(c=>ALPHABET.includes(c));}
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
root.AEGIS_TV_PROTOCOL={cleanCode,validCode,makeCode,normalize,peerOptions,peerId:code=>'aegis-tv-v1-'+cleanCode(code).slice(0,6)};
if(typeof module==='object')module.exports=root.AEGIS_TV_PROTOCOL;
})(typeof window==='undefined'?globalThis:window);
