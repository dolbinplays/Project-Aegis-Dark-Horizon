(function(root){'use strict';
root.AEGIS_CREATE_TV_INPUT=function(frame,cursor,notify=()=>{}){
 let x=root.innerWidth/2,y=root.innerHeight/2,held=null,selection=null;
 const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
 function draw(){cursor.style.left=x+'px';cursor.style.top=y+'px';}
 function hit(){let doc=frame.contentDocument,px=x,py=y,r=frame.getBoundingClientRect();px-=r.left;py-=r.top;let el=doc?.elementFromPoint(px,py);for(let i=0;i<5&&el?.tagName==='IFRAME';i++){r=el.getBoundingClientRect();px-=r.left;py-=r.top;try{doc=el.contentDocument;el=doc?.elementFromPoint(px,py);}catch{return null;}}return el?{el,doc,px,py}:null;}
 function coordinates(el){let px=x,py=y,win=el.ownerDocument.defaultView;try{while(win!==root&&win.frameElement){const r=win.frameElement.getBoundingClientRect();px-=r.left;py-=r.top;win=win.parent;}}catch{}return{el,doc:el.ownerDocument,px,py};}
 function event(target,type,extra={}){if(!target)return;const w=target.doc.defaultView;if(!w)return;const opts={bubbles:true,cancelable:true,composed:true,view:w,clientX:target.px,clientY:target.py,button:0,buttons:held?1:0,...extra};const C=type.startsWith('pointer')?w.PointerEvent:w.MouseEvent;if(typeof C!=='function')return;target.el.dispatchEvent(new C(type,{...opts,pointerId:71,pointerType:'mouse',isPrimary:true}));}
 function value(el,next){const w=el.ownerDocument.defaultView,prototype=el.tagName==='TEXTAREA'?w.HTMLTextAreaElement.prototype:w.HTMLInputElement.prototype;Object.getOwnPropertyDescriptor(prototype,'value').set.call(el,next);el.dispatchEvent(new w.Event('input',{bubbles:true}));el.dispatchEvent(new w.Event('change',{bubbles:true}));}
 function release(){if(held){const el=held;held=null;try{const t=coordinates(el);event(t,'pointerup',{buttons:0});event(t,'mouseup',{buttons:0});}catch{}}selection=null;}
 function click(){if(held)release();const t=hit();if(!t)return;const el=t.el.closest('button,input,select,textarea,a')||t.el;t.el=el;el.focus?.({preventScroll:true});
  if(el.tagName==='SELECT'){selection=el;notify({type:'select-options',options:[...el.options].slice(0,500).map((o,index)=>({index,label:o.textContent.slice(0,100),disabled:o.disabled})),selected:el.selectedIndex});return;}
  if(el.type==='file'){notify({type:'notice',message:'Use the TV remote for file selection.'});return;}
  if(el.type==='range'){const r=el.getBoundingClientRect(),min=Number(el.min)||0,max=el.max===''?100:Number(el.max),step=Number(el.step)||1;value(el,String(clamp(min+Math.round(((t.px-r.left)/r.width*(max-min))/step)*step,min,max)));return;}
  event(t,'pointerdown',{buttons:1});event(t,'mousedown',{buttons:1});event(t,'pointerup');event(t,'mouseup');event(t,'click');
 }
 function input(raw){const action=root.AEGIS_TV_PROTOCOL.normalize(raw);if(!action)return;try{
  if(action.kind==='release'){release();return;}
  if(action.kind==='center'){x=root.innerWidth/2;y=root.innerHeight/2;draw();return;}
  if(action.kind==='move'){x=clamp(x+action.dx,2,root.innerWidth-2);y=clamp(y+action.dy,2,root.innerHeight-2);draw();if(held&&!held.isConnected)release();const t=held?coordinates(held):hit();event(t,'pointermove',{movementX:action.dx,movementY:action.dy});event(t,'mousemove',{movementX:action.dx,movementY:action.dy});return;}
  if(action.kind==='down'){release();const t=hit();if(t){held=t.el;event(t,'pointerdown');event(t,'mousedown');}return;}
  if(action.kind==='up'){release();return;}
  if(action.kind==='click'){click();return;}
  if(action.kind==='select'){if(selection?.isConnected&&selection.options[action.index]&&!selection.options[action.index].disabled){selection.selectedIndex=action.index;selection.dispatchEvent(new selection.ownerDocument.defaultView.Event('change',{bubbles:true}));selection=null;}return;}
  const t=hit();if(!t)return;const w=t.doc.defaultView;
  if(action.kind==='scroll'){const e=new w.WheelEvent('wheel',{bubbles:true,cancelable:true,clientX:t.px,clientY:t.py,deltaY:action.dy,deltaMode:0});t.el.dispatchEvent(e);if(!e.defaultPrevented){let el=t.el;while(el&&!(el.scrollHeight>el.clientHeight&&/auto|scroll/.test(w.getComputedStyle(el).overflowY)))el=el.parentElement;(el||t.doc.scrollingElement)?.scrollBy(0,action.dy);}return;}
  if(action.kind==='text'){let el=t.el.closest('input,textarea');if(!el)el=t.doc.activeElement;if(el&&(el.tagName==='TEXTAREA'||el.tagName==='INPUT'&&['text','search','number','email','url'].includes(el.type))&&!el.disabled&&!el.readOnly){el.focus();value(el,action.text);}else notify({type:'notice',message:'Point at a text field on the TV first.'});return;}
  if(action.kind==='key'){
   if(action.key==='Tab'){const elements=[...t.doc.querySelectorAll('button,input,select,textarea,a[href],[tabindex]')].filter(e=>!e.disabled&&e.tabIndex>=0&&e.getClientRects().length);const next=elements[(elements.indexOf(t.doc.activeElement)+1)%elements.length];next?.focus();next?.scrollIntoView({block:'nearest'});return;}
   const target=t.doc.activeElement||t.el;target.dispatchEvent(new w.KeyboardEvent('keydown',{key:action.key,bubbles:true,cancelable:true}));target.dispatchEvent(new w.KeyboardEvent('keyup',{key:action.key,bubbles:true}));if(action.key==='Enter'&&target.matches('button,a[href]'))target.click();
  }
 }catch(e){release();notify({type:'notice',message:'The game view changed. Move the pointer and try again.'});}}
 draw();return{input,release};
};
})(window);
