DESTINATION: /assets/universe_ui.js
// /assets/universe_ui.js
// MODE: UNIVERSE UI CONTRACT
// STATUS: OVERLAY AUTHORITY v1 | NON-DRIFT | CANVAS-SUBORDINATE
// OWNER: SEAN

function deepFreeze(value){
  if(value===null||typeof value!=="object"||Object.isFrozen(value)) return value;
  Object.getOwnPropertyNames(value).forEach((key)=>deepFreeze(value[key]));
  return Object.freeze(value);
}
function normalizeObject(value){return value&&typeof value==="object"&&!Array.isArray(value)?value:{}}
function normalizeString(value,fallback=""){return typeof value==="string"&&value.trim().length>0?value.trim():fallback}
function normalizeArray(value){return Array.isArray(value)?value:[]}
function normalizeNumber(value,fallback=null){return Number.isFinite(value)?value:fallback}

function markerStyle(){
  return `
    .universe-ui-marker{
      position:absolute;
      left:0;
      top:0;
      transform:translate(-50%,-50%);
      pointer-events:none;
      display:grid;
      place-items:center;
      min-width:28px;
      min-height:28px;
    }
    .universe-ui-marker__halo{
      position:absolute;
      width:64px;
      height:64px;
      border-radius:50%;
      background:radial-gradient(circle, rgba(255,255,255,.12) 0%, rgba(126,184,255,.06) 26%, rgba(126,184,255,0) 72%);
      filter:blur(6px);
    }
    .universe-ui-marker__dot{
      position:absolute;
      width:10px;
      height:10px;
      border-radius:50%;
      background:rgba(255,245,214,.95);
      box-shadow:0 0 12px rgba(255,220,140,.34),0 0 20px rgba(126,184,255,.16);
    }
    .universe-ui-marker__code{
      position:absolute;
      top:-16px;
      left:50%;
      transform:translateX(-50%);
      color:rgba(238,243,255,.86);
      font-size:11px;
      font-weight:800;
      letter-spacing:.08em;
      text-transform:uppercase;
      white-space:nowrap;
      text-shadow:0 2px 10px rgba(0,0,0,.45);
    }
  `;
}

const UNIVERSE_META=Object.freeze({
  name:"universe_ui",
  version:"U1",
  contract:"UNIVERSE_UI_OVERLAY_CONTRACT_U1",
  role:"universe_overlay_only",
  deterministic:true,
  sourceOfTruth:false,
  mutatesState:false,
  platformOwned:true
});

function ensureStyle(){
  const id="universe-ui-inline-style-u1";
  if(document.getElementById(id)) return;
  const style=document.createElement("style");
  style.id=id;
  style.textContent=markerStyle();
  document.head.appendChild(style);
}

function defaultAnchors(width,height){
  const cx=width*0.5;
  const cy=height*0.53;
  const r=Math.min(width,height)*(width<700?0.37:0.32);
  const d=r*0.72;
  return [
    {key:"N",x:cx,y:cy-r},
    {key:"NE",x:cx+d,y:cy-d},
    {key:"E",x:cx+r,y:cy},
    {key:"SE",x:cx+d,y:cy+d},
    {key:"S",x:cx,y:cy+r},
    {key:"SW",x:cx-d,y:cy+d},
    {key:"W",x:cx-r,y:cy},
    {key:"NW",x:cx-d,y:cy-d},
    {key:"C",x:cx,y:cy}
  ];
}

function createMarker(key){
  const node=document.createElement("div");
  node.className="universe-ui-marker";
  node.dataset.key=key;
  node.innerHTML=`
    <div class="universe-ui-marker__halo"></div>
    <div class="universe-ui-marker__dot"></div>
    <div class="universe-ui-marker__code">${key}</div>
  `;
  return node;
}

export function createUniverseUI(root,options={}){
  ensureStyle();
  const container=root instanceof HTMLElement?root:document.getElementById("universe-overlay-root");
  if(!container) throw new Error("UNIVERSE_UI_REQUIRES_OVERLAY_ROOT");

  const opts=normalizeObject(options);
  container.innerHTML="";
  container.setAttribute("aria-hidden","true");

  const keys=["N","NE","E","SE","S","SW","W","NW","C"];
  const markers={};
  keys.forEach((key)=>{
    const node=createMarker(key);
    container.appendChild(node);
    markers[key]=node;
  });

  function setVisible(visible){
    container.style.opacity=visible===false?"0":"1";
  }

  function updateLayout(layout={}){
    const width=normalizeNumber(layout.width,window.innerWidth);
    const height=normalizeNumber(layout.height,window.innerHeight);
    const anchors=normalizeArray(layout.anchors);
    const usable=anchors.length===9?anchors:defaultAnchors(width,height);

    usable.forEach((anchor,idx)=>{
      const key=normalizeString(anchor.key,keys[idx]||"");
      const node=markers[key];
      if(!node) return;
      node.style.left=`${normalizeNumber(anchor.x,0)}px`;
      node.style.top=`${normalizeNumber(anchor.y,0)}px`;
    });

    return usable;
  }

  function setLabels(labelMap={}){
    const map=normalizeObject(labelMap);
    Object.keys(markers).forEach((key)=>{
      const node=markers[key];
      const labelNode=node.querySelector(".universe-ui-marker__code");
      if(labelNode) labelNode.textContent=normalizeString(map[key],key);
    });
  }

  function read(){
    return deepFreeze({
      meta:UNIVERSE_META,
      visible:container.style.opacity!=="0",
      markerCount:Object.keys(markers).length
    });
  }

  updateLayout(opts);
  setLabels(opts.labels||{});
  setVisible(opts.visible!==false);

  return deepFreeze({
    meta:UNIVERSE_META,
    root:container,
    markers:deepFreeze(markers),
    setVisible,
    updateLayout,
    setLabels,
    read
  });
}

export default Object.freeze({
  meta:UNIVERSE_META,
  createUniverseUI
});
