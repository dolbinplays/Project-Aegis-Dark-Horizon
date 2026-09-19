(function(root){
'use strict';
const BUILD='v0.26.09.18.2115_IN_GAME_TOOLS_EDITOR_RENDERED_RUNTIME_HOTFIX';
const EDITOR_PATH='./AEGIS_Prop_Editor_CURRENT.html';
const GALLERY_PATH='./AEGIS_Prop_Runtime_Test_Gallery_CURRENT.html';
const BUTTON_ATTR='data-aegis-tools-editors-launcher';
const MODAL_ID='aegis-tools-editors-modal';
if(!root||typeof document==='undefined')return;
if(root.__AEGIS_TOOLS_EDITOR_LAUNCHER_2115)return;
root.__AEGIS_TOOLS_EDITOR_LAUNCHER_2115=true;
if(/AEGIS_Prop_(?:Editor|Runtime_Test_Gallery)/i.test(String(location.pathname||'')))return;
const observedDocuments=new WeakSet();
const observedFrames=new WeakSet();
function hostWindow(){try{return root.top&&root.top.document?root.top:root}catch{return root}}
function normalizeText(value=''){return String(value||'').replace(/\s+/g,' ').trim().toLowerCase();}
function exactText(node,value){return normalizeText(node?.textContent)===normalizeText(value);}
function modalIn(doc){return doc?.getElementById?.(MODAL_ID)||null;}
function toolUrl(path,doc=document){const base=String(doc?.baseURI||root.location?.href||'');const url=new URL(path,base);url.searchParams.set('aegisReturn','1');url.searchParams.set('aegisFrom','game');url.searchParams.set('aegisLauncherBuild',BUILD);return url.href;}
function openTool(path,windowName,statusEl,doc=document){let child=null;const host=hostWindow();try{child=host.open(toolUrl(path,doc),windowName);}catch{}if(child){try{child.focus();}catch{}if(statusEl)statusEl.textContent='Opened in a separate window/tab. Your campaign remains open here.';return true;}if(statusEl)statusEl.textContent='The browser blocked the new window. Allow pop-ups for Project Aegis, then try again. The current campaign was not replaced.';return false;}
function closeModal(doc=document){modalIn(doc)?.remove();}
function openModal(doc=document){if(!doc?.body)return null;let overlay=modalIn(doc);if(overlay){overlay.querySelector('button')?.focus?.();return overlay;}overlay=doc.createElement('div');overlay.id=MODAL_ID;overlay.setAttribute('data-aegis-tools-editors-modal','true');overlay.style.cssText='position:fixed;inset:0;z-index:20050;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(2,6,23,.72);backdrop-filter:blur(5px);font-family:system-ui,Segoe UI,sans-serif;color:#e2e8f0';const panel=doc.createElement('div');panel.style.cssText='width:min(92vw,520px);border:1px solid rgba(196,181,253,.72);border-radius:24px;background:#0f172a;padding:20px;box-shadow:0 24px 70px rgba(0,0,0,.55)';panel.innerHTML='<div style="font-size:11px;font-weight:900;letter-spacing:.18em;text-transform:uppercase;color:#c4b5fd">Project Aegis Tools</div><h2 style="margin:5px 0 6px;font-size:25px;line-height:1.1">Tools / Editors</h2><p style="margin:0 0 14px;color:#cbd5e1;font-size:13px;line-height:1.45">Open an authoring tool in a separate window. The running campaign remains in this window and campaign time/state are not modified by the launcher.</p>';
const actions=doc.createElement('div');actions.style.cssText='display:grid;gap:8px';const status=doc.createElement('div');status.setAttribute('data-aegis-tools-editors-status','true');status.style.cssText='margin-top:12px;min-height:18px;color:#a5f3fc;font-size:11px;line-height:1.4';
const editor=doc.createElement('button');editor.type='button';editor.textContent='Open Prop Editor';editor.style.cssText='border:1px solid #22d3ee;border-radius:14px;background:#083344;color:#cffafe;padding:10px 12px;font-weight:900;cursor:pointer';editor.onclick=()=>openTool(EDITOR_PATH,'aegis-prop-editor',status,doc);
const gallery=doc.createElement('button');gallery.type='button';gallery.textContent='Open Runtime Test Gallery';gallery.style.cssText='border:1px solid #a78bfa;border-radius:14px;background:#2e1065;color:#ede9fe;padding:10px 12px;font-weight:900;cursor:pointer';gallery.onclick=()=>openTool(GALLERY_PATH,'aegis-prop-runtime-gallery',status,doc);
const close=doc.createElement('button');close.type='button';close.textContent='Close';close.style.cssText='border:1px solid #475569;border-radius:14px;background:#020617;color:#e2e8f0;padding:9px 12px;font-weight:800;cursor:pointer';close.onclick=()=>closeModal(doc);actions.append(editor,gallery,close);panel.append(actions,status);overlay.appendChild(panel);overlay.addEventListener('click',event=>{if(event.target===overlay)closeModal(doc);});overlay.addEventListener('keydown',event=>{if(event.key==='Escape')closeModal(doc);});doc.body.appendChild(overlay);editor.focus();return overlay;}
function makeButton(doc,label='Tools / Editors',compact=false){const b=doc.createElement('button');b.type='button';b.textContent=label;b.setAttribute(BUTTON_ATTR,'true');b.setAttribute('data-aegis-tools-editors-build',BUILD);b.className=compact?'rounded-2xl border border-violet-300/70 bg-violet-950/55 px-3 py-2 text-sm font-black text-violet-100 shadow-sm':'rounded-2xl border border-violet-300/70 bg-violet-950/55 px-4 py-2 text-sm font-black text-violet-100 shadow-sm hover:bg-violet-900/70';b.style.borderColor='rgba(196,181,253,.7)';b.style.background='rgba(46,16,101,.55)';b.style.color='#ede9fe';b.title='Open Project Aegis development tools in a separate window without leaving the current campaign.';b.addEventListener('click',event=>{event.preventDefault();event.stopPropagation();openModal(doc);});return b;}
function buttonAlready(container){return Boolean(container?.querySelector?.('['+BUTTON_ATTR+']'));}
function appendTo(container,doc,compact=false){if(!container||buttonAlready(container))return false;container.appendChild(makeButton(doc,'Tools / Editors',compact));return true;}
function findButtonByText(container,text){return [...(container?.querySelectorAll?.('button')||[])].find(b=>exactText(b,text))||null;}
function installSaveMenu(doc){for(const h of doc.querySelectorAll('h1')){if(!exactText(h,'Save / Load Game'))continue;const shell=h.closest('.rounded-3xl')||h.parentElement?.parentElement?.parentElement;const rows=[...(shell?.querySelectorAll?.('.flex.flex-wrap.gap-2')||[])];const row=rows.find(r=>findButtonByText(r,'Return to Game')||findButtonByText(r,'Return to Start Screen'))||rows[0];if(row)appendTo(row,doc);}}
function installPauseMenu(doc){for(const h of doc.querySelectorAll('h2')){if(!exactText(h,'Command Settings'))continue;const shell=h.closest('[class*="rounded-"]')||h.parentElement?.parentElement?.parentElement;const rows=[...(shell?.querySelectorAll?.('.flex.flex-wrap.gap-2')||[])];const row=rows.find(r=>findButtonByText(r,'Resume'))||rows[0];if(row)appendTo(row,doc);}}
function installExpandedSystem(doc){const expanded=doc.querySelector('[data-aegis-standard-header="expanded"]');if(!expanded)return;for(const label of expanded.querySelectorAll('div')){if(!exactText(label,'System'))continue;const card=label.parentElement;const grid=card?.querySelector('.grid');if(grid){appendTo(grid,doc);break;}}}
function installMinimizedHeader(doc){const minimized=doc.querySelector('[data-aegis-standard-header="minimized"]');if(!minimized)return;const health=findButtonByText(minimized,'Build Health');if(health?.parentElement)appendTo(health.parentElement,doc);}
function installTacticalMini(doc){const mini=doc.querySelector('[data-aegis-tactical-mini-header="true"]');if(!mini)return;appendTo(mini,doc,true);}
function installAllInDocument(doc){if(!doc?.querySelectorAll)return;installSaveMenu(doc);installPauseMenu(doc);installExpandedSystem(doc);installMinimizedHeader(doc);installTacticalMini(doc);scanFrames(doc);}
function observeDocument(doc){if(!doc?.documentElement||observedDocuments.has(doc))return;observedDocuments.add(doc);const observer=new MutationObserver(()=>installAllInDocument(doc));observer.observe(doc.documentElement,{childList:true,subtree:true});installAllInDocument(doc);}
function attachFrame(frame){if(!frame||observedFrames.has(frame))return;observedFrames.add(frame);const attach=()=>{try{const childDoc=frame.contentDocument;if(childDoc)observeDocument(childDoc);}catch{}};frame.addEventListener('load',attach);attach();}
function scanFrames(doc){for(const frame of doc.querySelectorAll('iframe'))attachFrame(frame);}
function closeEveryModal(doc){try{closeModal(doc);for(const frame of doc.querySelectorAll('iframe')){try{if(frame.contentDocument)closeEveryModal(frame.contentDocument);}catch{}}}catch{}}
hostWindow().addEventListener('message',event=>{if(event?.data?.type==='aegis-tool-return'){try{closeEveryModal(hostWindow().document);}catch{}try{hostWindow().focus();}catch{}}});
observeDocument(document);
try{if(hostWindow()!==root)observeDocument(hostWindow().document);}catch{}
root.AEGIS_TOOLS_EDITOR_LAUNCHER_API={build:BUILD,editorPath:EDITOR_PATH,galleryPath:GALLERY_PATH,installAll:()=>installAllInDocument(document),installAllInDocument,openModal,closeModal,openTool,toolUrl,scanFrames};
root.AEGIS_TOOLS_EDITOR_LAUNCHER_BUILD=BUILD;
})(typeof window!=='undefined'?window:globalThis);
