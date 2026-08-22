/* Diamond Gate Bridge commercial cosmos wrapper · TRL7 inspectable-readiness augmentation */
(()=>{"use strict";
const load=(src,done)=>{const s=document.createElement("script");s.src=src;s.async=false;s.onload=()=>done?.();s.onerror=()=>done?.();document.head.append(s)};
load("/assets/build/fibonacci-cosmos-core-v7.js?v=7",()=>load("/assets/credibility/trl7-presentation.v1.js?v=1",()=>load("/assets/credibility/trl7-inspectable-link.v1.js?v=1",()=>load("/assets/credibility/public-visual-standard.v1.js?v=1"))));

const installAwardsCinematicPlayback=()=>{
  if(!document.body?.classList.contains("h-earth-awards-page"))return;
  const video=document.getElementById("compass-reel");
  const frame=video?.closest(".lens-media-frame");
  const play=document.querySelector('[data-media-play="compass-reel"]');
  if(!video||!frame||!play||frame.dataset.dgbCinematicInstalled==="true")return;
  frame.dataset.dgbCinematicInstalled="true";

  const style=document.createElement("style");
  style.textContent=`
    body.h-earth-awards-page #compass-media{width:min(1180px,100%);}
    body.h-earth-awards-page .lens-media-frame.dgb-cinematic-open{position:fixed!important;inset:2vh 2vw!important;width:96vw!important;height:96vh!important;aspect-ratio:auto!important;z-index:2147483001!important;border-radius:18px!important;background:#000!important;box-shadow:0 0 0 100vmax rgba(0,0,0,.94),0 28px 90px rgba(0,0,0,.8)!important;}
    body.h-earth-awards-page .lens-media-frame.dgb-cinematic-open video{width:100%!important;height:100%!important;object-fit:contain!important;}
    body.h-earth-awards-page.dgb-cinematic-lock{overflow:hidden!important;}
    .dgb-cinematic-close{position:absolute;top:14px;right:14px;z-index:2147483003;display:none;width:46px;height:46px;padding:0;border:1px solid rgba(255,255,255,.5);border-radius:50%;background:rgba(4,7,11,.82);color:#fff;font:700 28px/1 system-ui;cursor:pointer;backdrop-filter:blur(8px);}
    .dgb-cinematic-open .dgb-cinematic-close{display:grid;place-items:center;}
    @media(max-width:760px){body.h-earth-awards-page .lens-media-frame.dgb-cinematic-open{inset:0!important;width:100vw!important;height:100dvh!important;border-radius:0!important;}}
  `;
  document.head.append(style);

  const close=document.createElement("button");
  close.type="button";
  close.className="dgb-cinematic-close";
  close.setAttribute("aria-label","Exit cinematic video view");
  close.textContent="×";
  frame.append(close);

  const openFallback=()=>{
    frame.classList.add("dgb-cinematic-open");
    document.body.classList.add("dgb-cinematic-lock");
    close.focus({preventScroll:true});
  };
  const closeFallback=()=>{
    frame.classList.remove("dgb-cinematic-open");
    document.body.classList.remove("dgb-cinematic-lock");
  };
  close.addEventListener("click",e=>{e.preventDefault();e.stopPropagation();closeFallback();});
  document.addEventListener("keydown",e=>{if(e.key==="Escape"&&frame.classList.contains("dgb-cinematic-open"))closeFallback();});

  play.addEventListener("click",()=>{
    const enter=async()=>{
      try{
        if(frame.requestFullscreen){await frame.requestFullscreen();return;}
        if(video.webkitEnterFullscreen){video.webkitEnterFullscreen();return;}
      }catch(_){/* fall through to in-page cinematic mode */}
      openFallback();
    };
    void enter();
  },{capture:true});
};

if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",installAwardsCinematicPlayback,{once:true});
else installAwardsCinematicPlayback();
})();