/* Diamond Gate Bridge public visual standard convergence · Governance-led */
(()=>{"use strict";
const path=location.pathname;
const isGovernance=path==="/governance/"||path==="/governance/index.html";
const isAwards=path==="/showroom/globe/h-earth/awards/"||path==="/showroom/globe/h-earth/awards/index.html";
const isBuild=path==="/build/"||path==="/build/index.html";
const isEvidence=path==="/evidence/"||path==="/evidence/index.html";
if(!isGovernance&&!isAwards&&!isBuild&&!isEvidence)return;
const style=document.createElement("style");
style.dataset.dgbPublicVisualStandard="v1";
style.textContent=`
/* Public navigation: discrete destinations with stronger separation. */
.topbar .nav,.topbar .toplinks,.top .nav{gap:8px!important}
.topbar .nav a,.topbar .toplinks a,.top .nav a{border:1px solid rgba(225,218,198,.2)!important;background:rgba(3,8,14,.78)!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.025);transition:border-color .2s ease,background .2s ease,color .2s ease,transform .2s ease}
.topbar .nav a:hover,.topbar .toplinks a:hover,.top .nav a:hover{border-color:rgba(241,209,132,.42)!important;background:rgba(241,209,132,.07)!important;color:#f4f0e2!important;transform:translateY(-1px)}
/* Awards: remove tablet-scale dead air while preserving the cinematic hero. */
.h-earth-awards-page .hero{min-height:min(54vh,590px)!important;align-content:center!important;padding-top:clamp(40px,6vw,68px)!important;padding-bottom:clamp(40px,6vw,68px)!important}
/* Awards demonstrated-work proof: avoid five narrow legacy columns on tablet. */
@media(max-width:1100px){.h-earth-awards-page .proof{grid-template-columns:repeat(2,minmax(0,1fr))!important}.h-earth-awards-page .proof>div:last-child{grid-column:1/-1}.h-earth-awards-page .hero{min-height:auto!important}}
@media(max-width:620px){.h-earth-awards-page .proof{grid-template-columns:1fr!important}.h-earth-awards-page .proof>div:last-child{grid-column:auto}.h-earth-awards-page .hero{padding:34px 24px 38px!important}}
/* Governance milestone: give historic provenance visual weight without turning it into technical evidence. */
.dgb-milestone-card{margin-top:18px;padding:clamp(22px,4vw,34px);border:1px solid rgba(241,209,132,.3);border-radius:24px;background:radial-gradient(circle at 88% 18%,rgba(241,209,132,.08),transparent 18rem),linear-gradient(145deg,rgba(35,27,12,.28),rgba(4,8,14,.86));box-shadow:0 20px 54px rgba(0,0,0,.16)}
.dgb-milestone-kicker{margin:0 0 8px;color:#f1d184;font-size:.72rem;font-weight:950;letter-spacing:.16em;text-transform:uppercase}
.dgb-milestone-head{display:grid;grid-template-columns:auto 1fr;gap:18px;align-items:center}
.dgb-milestone-number{font-family:Georgia,"Times New Roman",serif;font-size:clamp(2.8rem,7vw,5.6rem);line-height:.86;letter-spacing:-.055em;color:#f4f0e2;white-space:nowrap}
.dgb-milestone-title{font-family:Georgia,"Times New Roman",serif;font-size:clamp(1.55rem,3.6vw,2.55rem);line-height:1.05;color:#f4f0e2;max-width:700px}
.dgb-milestone-sequence{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin-top:20px}
.dgb-milestone-step{padding:12px 13px;border:1px solid rgba(225,218,198,.14);border-radius:16px;background:rgba(0,0,0,.18);color:rgba(232,227,210,.7);font-size:.82rem;font-weight:850;line-height:1.35}
.dgb-milestone-step:nth-child(1){color:#f1d184;border-color:rgba(241,209,132,.28)}
.dgb-milestone-step:nth-child(2){color:#89e3ff;border-color:rgba(137,227,255,.24)}
.dgb-milestone-step:nth-child(3){color:#96e0bc;border-color:rgba(150,224,188,.22)}
.dgb-milestone-step:nth-child(4){color:#bba9f0;border-color:rgba(187,169,240,.24)}
.dgb-milestone-copy{margin:18px 0 0;color:rgba(232,227,210,.68);line-height:1.68;max-width:900px}
.dgb-milestone-copy strong{color:#f4f0e2}
@media(max-width:820px){.dgb-milestone-head{grid-template-columns:1fr;gap:8px}.dgb-milestone-sequence{grid-template-columns:1fr 1fr}}
@media(max-width:520px){.dgb-milestone-sequence{grid-template-columns:1fr}}
@media(prefers-reduced-motion:reduce){.topbar .nav a,.topbar .toplinks a,.top .nav a{transition:none}}
`;
document.head.append(style);
if(isGovernance){
 const note=[...document.querySelectorAll('.architecture-note')].find(el=>el.textContent.includes('PR #1000')&&el.textContent.includes('PR #1003'));
 if(note&&!document.querySelector('[data-dgb-pr1000-milestone]')){
  const card=document.createElement('section');
  card.className='dgb-milestone-card';
  card.dataset.dgbPr1000Milestone='';
  card.setAttribute('aria-label','PR 1000 consolidation milestone');
  card.innerHTML='<p class="dgb-milestone-kicker">Governance milestone · historical provenance</p><div class="dgb-milestone-head"><div class="dgb-milestone-number">PR #1000</div><div class="dgb-milestone-title">The thousandth pull request became the control-plane consolidation milestone.</div></div><div class="dgb-milestone-sequence" aria-label="Consolidation chronology"><div class="dgb-milestone-step">PR #1000<br>Control-plane consolidation</div><div class="dgb-milestone-step">PR #1003<br>Lean cleanup</div><div class="dgb-milestone-step">Operational<br>reconfirmation</div><div class="dgb-milestone-step">Generation 3<br>blinded evaluation</div></div><p class="dgb-milestone-copy"><strong>The number is the milestone; the evidence is what followed.</strong> The consolidation materially simplified the control plane without widening authority or relaxing fail-closed safeguards. Subsequent cleanup removed additional obsolete machinery, after which the surviving system was operationally reconfirmed and evaluated under previously unseen governance conditions. Detailed protocol and claim limits remain in Evidence.</p>';
  note.replaceWith(card);
 }
}
})();