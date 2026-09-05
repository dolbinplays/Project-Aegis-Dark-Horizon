// AEGIS_MOBILE_INTERFACE_BEGIN
const MOBILE_LANDSCAPE_INTERFACE_PATCH=true;
const AEGIS_INTERFACE_LAYOUT_KEY="project-aegis-interface-layout-v1";
function normalizeAegisInterfaceLayout(value){return value==="mobile"?"mobile":"standard";}
function readAegisInterfaceLayout(){try{return normalizeAegisInterfaceLayout(localStorage.getItem(AEGIS_INTERFACE_LAYOUT_KEY));}catch{return"standard";}}
let AEGIS_INTERFACE_LAYOUT=readAegisInterfaceLayout();
function applyAegisInterfaceLayout(value){
  AEGIS_INTERFACE_LAYOUT=normalizeAegisInterfaceLayout(value);
  if(typeof document!=="undefined")document.documentElement.dataset.aegisLayout=AEGIS_INTERFACE_LAYOUT;
  try{if(window.parent!==window)window.parent.document.documentElement.dataset.aegisLayout=AEGIS_INTERFACE_LAYOUT;}catch{}
  return AEGIS_INTERFACE_LAYOUT;
}
function writeAegisInterfaceLayout(value){
  const layout=applyAegisInterfaceLayout(value);try{localStorage.setItem(AEGIS_INTERFACE_LAYOUT_KEY,layout);}catch{}
  window.dispatchEvent(new CustomEvent("aegis-interface-layout-change",{detail:layout}));return layout;
}
applyAegisInterfaceLayout(AEGIS_INTERFACE_LAYOUT);
function useAegisInterfaceLayout(){
  const[layout,setLayout]=React.useState(()=>AEGIS_INTERFACE_LAYOUT);
  React.useEffect(()=>{const update=()=>setLayout(AEGIS_INTERFACE_LAYOUT);window.addEventListener("aegis-interface-layout-change",update);return()=>window.removeEventListener("aegis-interface-layout-change",update);},[]);
  return layout;
}
function AegisInterfaceLayoutControl(){
  const layout=useAegisInterfaceLayout();
  return React.createElement("fieldset",{className:"aegis-layout-choice","data-aegis-layout-choice":"true"},
    React.createElement("legend",null,"Interface layout"),
    React.createElement("div",{className:"aegis-layout-options"},[["standard","Standard","Classic PC controls"],["mobile","Mobile · Landscape","Thumb controls at the sides"]].map(([value,label,hint])=>React.createElement("label",{key:value,className:layout===value?"selected":""},React.createElement("input",{type:"radio",name:"aegis-interface-layout",value,checked:layout===value,onChange:()=>writeAegisInterfaceLayout(value)}),React.createElement("span",null,React.createElement("b",null,label),React.createElement("small",null,hint))))),
    React.createElement("p",null,"Saved on this device. You can change this again in Menu / Save."));
}
function aegisMobileButton(label,onClick,options={}){return React.createElement("button",{key:options.key||label,type:"button",onClick,disabled:Boolean(options.disabled),"aria-label":options.ariaLabel||label,"aria-pressed":options.active===undefined?undefined:Boolean(options.active),className:options.primary?"primary":"",title:options.title},label);}
function AegisMobileRail({side,label,children}){return React.createElement("nav",{className:`aegis-mobile-rail aegis-mobile-${side}`,"aria-label":label},children);}
function AegisMobileCommandRails({tabs,tab,onTab,onMenu,onCommand,onIncidents,onUfos,running,onPause,disabled=false}){
  return React.createElement(React.Fragment,null,
    React.createElement(AegisMobileRail,{side:"left",label:"Command sections"},React.createElement("span",{className:"aegis-rail-label"},"AEGIS"),tabs.map(([id,icon,label])=>aegisMobileButton(label,()=>onTab(id),{active:id===tab}))),
    React.createElement(AegisMobileRail,{side:"right",label:"Command actions"},aegisMobileButton("Menu / Save",onMenu),aegisMobileButton("Command",onCommand),aegisMobileButton("Incidents",onIncidents),aegisMobileButton("UFOs",onUfos),aegisMobileButton(running?"Pause time":"Resume time",onPause,{disabled,primary:true})));
}
function aegisTacticalViewportDimensions(mount,fallback={},layout=AEGIS_INTERFACE_LAYOUT){
  const mobile=layout==="mobile";
  return{width:Math.max(mobile?1:640,Number(mount?.clientWidth)||fallback.width||960),height:Math.max(mobile?1:420,Number(mount?.clientHeight)||fallback.height||640)};
}
// AEGIS_MOBILE_INTERFACE_END
