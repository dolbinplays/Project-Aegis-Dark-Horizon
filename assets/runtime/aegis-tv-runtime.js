/* TV-only presentation budgets. Campaign rules and simulation clocks are unchanged. */
(()=>{'use strict';
 let host=null;
 try{let frame=window;for(let depth=0;depth<5;depth++){if(frame.AEGIS_TV_PROFILE==='lite'){host=frame;break;}if(frame.parent===frame)break;frame=frame.parent;}}catch{}
 const enabled=!!host,views=new Set();let suspended=host?.AEGIS_TV_SUSPENDED===true;
 const paused=()=>enabled&&(suspended||document.hidden||host?.document?.hidden);
 const metrics={screen:'Starting',lastAction:'Startup',longTasks:0,longestTaskMs:0,lastStallAction:'None',loopDelayMs:0};
 const api=window.AEGIS_TV_RUNTIME={enabled,metrics};
 api.frameDue=(state,now)=>{if(!enabled)return true;if(paused())return false;const interval=1000/30;if(state.tvLastFrame!==undefined&&now-state.tvLastFrame<interval-.5)return false;const elapsed=now-(state.tvLastFrame??now);state.tvLastFrame=elapsed>=interval&&elapsed<interval*2?now-(elapsed%interval):now;return true;};
 api.setSuspended=value=>{suspended=!!value;for(const view of views)paused()?view.pause():view.resume();};
 api.createRenderer=(THREE,options)=>{
  const renderer=new THREE.WebGLRenderer(enabled?{...options,antialias:false}:options);
  if(!enabled)return renderer;
  const size=renderer.setSize.bind(renderer),ratio=renderer.setPixelRatio.bind(renderer),render=renderer.render.bind(renderer),dispose=renderer.dispose.bind(renderer);
  let lastWidth=0,lastHeight=0,lastDraw=-Infinity,pending=null,timer=0,disposed=false;
  const view={frames:0,sampledAt:performance.now(),fps:0};views.add(view);
  ratio(1);renderer.setPixelRatio=()=>{};
  renderer.setSize=(width,height,updateStyle=true)=>{
   const scale=Math.min(1,1280/Math.max(1,width),720/Math.max(1,height));
   const w=Math.max(1,Math.floor(width*scale)),h=Math.max(1,Math.floor(height*scale));
   if(w!==lastWidth||h!==lastHeight){size(w,h,false);lastWidth=w;lastHeight=h;}
   if(updateStyle){renderer.domElement.style.width=width+'px';renderer.domElement.style.height=height+'px';}
  };
  const draw=()=>{timer=0;if(disposed||!pending||paused())return;const args=pending;pending=null;lastDraw=performance.now();render(...args);view.frames++;};
  view.pause=()=>{clearTimeout(timer);timer=0;};
  view.resume=()=>{if(disposed||!pending||paused())return;const wait=1000/30-(performance.now()-lastDraw);if(wait<=0){clearTimeout(timer);draw();}else if(!timer)timer=setTimeout(draw,wait);};
  renderer.render=(...args)=>{
   if(disposed)return;
   if(renderer.getRenderTarget?.())return render(...args);
   pending=args;view.resume();
  };
  renderer.dispose=()=>{if(disposed)return;disposed=true;clearTimeout(timer);pending=null;views.delete(view);dispose();};
  return renderer;
 };
 api.snapshot=()=>{const now=performance.now();let fps=0;for(const view of views){const elapsed=now-view.sampledAt;if(elapsed>=500){view.fps=view.frames*1000/elapsed;view.frames=0;view.sampledAt=now;}fps=Math.max(fps,view.fps);}return{...metrics,fps:Math.round(fps),renderers:views.size,longTasksSupported:typeof PerformanceObserver!=='undefined'&&PerformanceObserver.supportedEntryTypes?.includes('longtask')===true};};
 if(!enabled)return;
 // The host reads the current disposable runtime; a mission reboot replaces this reference.
 host.AEGIS_TV_ACTIVE_RUNTIME=api;
 document.addEventListener('visibilitychange',()=>{for(const view of views)paused()?view.pause():view.resume();});
 const style=document.createElement('style');style.textContent='[class*="backdrop-blur"]{backdrop-filter:none!important}';document.head.append(style);
 document.addEventListener('click',event=>{const target=event.target?.closest?.('button,a,select');if(target)metrics.lastAction=String(target.getAttribute('aria-label')||target.textContent||target.tagName).trim().slice(0,90);},true);
 let observer;
 if(typeof PerformanceObserver!=='undefined'&&PerformanceObserver.supportedEntryTypes?.includes('longtask')){observer=new PerformanceObserver(list=>{for(const entry of list.getEntries()){metrics.longTasks++;if(entry.duration>metrics.longestTaskMs){metrics.longestTaskMs=Math.round(entry.duration);metrics.lastStallAction=metrics.lastAction;}}});observer.observe({type:'longtask',buffered:true});}
 let expected=performance.now()+1000;const heartbeat=setInterval(()=>{const now=performance.now();if(!document.hidden)metrics.loopDelayMs=Math.round(Math.max(0,now-expected));expected=now+1000;},1000);
 window.addEventListener('pagehide',()=>{api.setSuspended(true);clearInterval(heartbeat);observer?.disconnect();if(host.AEGIS_TV_ACTIVE_RUNTIME===api)host.AEGIS_TV_ACTIVE_RUNTIME=null;});
})();
