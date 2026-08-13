/* Diamond Gate Bridge commercial cosmos wrapper · TRL7 public-readiness augmentation */
(()=>{"use strict";
const CORE="/assets/build/fibonacci-cosmos-core-v7.js?v=7";
const path=location.pathname;
function makeCard(){
  const section=document.createElement("section");
  section.dataset.dgbTrl7="";
  section.setAttribute("aria-label","Technology readiness");
  section.style.cssText="margin:44px 0 0;padding:clamp(24px,5vw,42px);border:1px solid rgba(241,209,132,.28);border-radius:26px;background:linear-gradient(145deg,rgba(36,28,13,.32),rgba(5,9,15,.9));box-shadow:0 22px 64px rgba(0,0,0,.2)";
  section.innerHTML='<p style="margin:0 0 10px;color:#f1d184;font-size:.74rem;font-weight:950;letter-spacing:.16em;text-transform:uppercase">Technology Readiness</p><h2 style="margin:.08em 0 .3em;font-family:Georgia,\"Times New Roman\",serif;font-size:clamp(2rem,5vw,3.6rem);line-height:1.02">Operationally demonstrated. Self-assessed at Software TRL 7.</h2><p style="max-width:880px;color:rgba(232,227,210,.76);line-height:1.7">Diamond Gate\'s governed software-construction platform has been assessed against published NASA software Technology Readiness Level criteria and satisfies the TRL 7 threshold for demonstrated operational feasibility within the assessed platform boundary.</p><p style="max-width:880px;color:rgba(232,227,210,.58);line-height:1.6;font-size:.9rem"><strong style="color:rgba(244,240,226,.9)">Boundary:</strong> This is a Diamond Gate self-assessment using published criteria. It is not a NASA certification, evaluation, affiliation or endorsement.</p><a href="/evidence/#integrated/operational-readiness-trl7/proof" style="display:inline-flex;margin-top:12px;padding:10px 14px;border:1px solid rgba(241,209,132,.3);border-radius:999px;color:#f1d184;text-decoration:none;font-weight:900">Inspect the readiness evidence →</a>';
  return section;
}
function inject(){
  if(document.querySelector("[data-dgb-trl7]"))return;
  const card=makeCard();
  if(path==="/evidence/"||path==="/evidence/index.html"){
    const host=document.querySelector(".orientation"); if(host)host.insertAdjacentElement("afterend",card); else document.querySelector("main")?.append(card);
  }else if(path==="/governance/"||path==="/governance/index.html"){
    const closing=document.querySelector(".closing"); if(closing)closing.insertAdjacentElement("beforebegin",card); else document.querySelector("main")?.append(card);
    const h=card.querySelector("h2"),p=card.querySelector("p:nth-of-type(2)"); if(h)h.textContent="This is no longer just an architecture on paper."; if(p)p.textContent="The governed construction platform behind this journey has demonstrated operational feasibility at a maturity level consistent with published Software TRL 7 criteria.";
  }else if(path==="/build/"||path==="/build/index.html"){
    const finalCall=document.querySelector(".final-call"); if(finalCall)finalCall.insertAdjacentElement("beforebegin",card); else document.querySelector("main")?.append(card);
    const h=card.querySelector("h2"),p=card.querySelector("p:nth-of-type(2)"); if(h)h.textContent="Built on machinery tested in the real environment where it operates."; if(p)p.textContent="The governed construction platform behind Diamond Gate currently self-assesses at Software TRL 7, a recognized threshold for demonstrated operational feasibility.";
  }else if(path==="/showroom/globe/h-earth/awards/"||path==="/showroom/globe/h-earth/awards/index.html"){
    const campaign=document.querySelector(".campaign"); if(campaign)campaign.insertAdjacentElement("beforebegin",card); else document.querySelector("main")?.append(card);
    const h=card.querySelector("h2"),p=card.querySelector("p:nth-of-type(2)"); if(h)h.textContent="From ambitious experiment to operational technology."; if(p)p.textContent="The governed software-construction platform now satisfies a bounded self-assessment against Software TRL 7 criteria—an objective maturity signal behind the work represented here.";
  }
}
const s=document.createElement("script");s.src=CORE;s.async=false;s.onload=inject;s.onerror=inject;document.head.append(s);
if(document.readyState!=="loading")setTimeout(inject,0);else document.addEventListener("DOMContentLoaded",()=>setTimeout(inject,0),{once:true});
})();
