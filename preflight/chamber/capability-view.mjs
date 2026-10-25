import {CAPABILITY_BASELINE} from './capability-evidence.mjs';
import {presentCapability} from './presentation-guard.mjs';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const names={implementation:'Implementation',qualification:'Qualification',publicationAdoption:'Publication / adoption',operationalObservation:'Operational observation'};
const labels={MERGED_IMPLEMENTATION:'Merged',PRESENT_IMPLEMENTATION:'Implemented',SPECIFIED_ONLY:'Specification preserved',RECORDED_PASS:'Recorded qualification',REPORTED_PASS:'Source-reported tests',PUBLISHED_ADOPTION:'Published adoption',ADOPTED_IMPLEMENTATION:'Adopted code',OBSERVED_READ_ONLY:'Read-only observation',NOT_ESTABLISHED:'Not established',NOT_APPLICABLE:'Not applicable'};
export function renderCapabilityEvidence(id){
 const card=CAPABILITY_BASELINE.capabilities.find(c=>c.id===id);if(!card)return '';
 const view=presentCapability(card);
 return `<details class="capability-proof"><summary>Implementation, qualification &amp; adoption evidence</summary><p class="note">Explanatory catalog only. Source evidence belongs to your locally imported records; current live health is not established.</p><div class="capability-layers">${Object.entries(view.layers).map(([phase,l])=>`<article data-capability-layer="${phase}"><h4>${names[phase]}</h4><span class="badge neutral">${esc(labels[l.status])}</span><p>${esc(l.text)}</p>${l.sourceVersion?`<p class="note">Evidence version <code>${esc(l.sourceVersion)}</code></p>`:''}${l.observedAt?`<p class="note">Observed ${esc(l.observedAt)}</p>`:''}<div class="evidence-links">${l.evidence.map(s=>`<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.label)}</a>`).join(' ')}</div></article>`).join('')}</div></details>`;
}
