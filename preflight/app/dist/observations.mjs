import {clean} from './core.mjs';

const TYPES=new Set(['INSPECTED','DRAFTED','REVISED','TESTED','CAUSE_ESTABLISHED','DECISION_RECORDED','DEPENDENCY_RESOLVED','RELEASE_REPORTED']);
const known=value=>clean(value)&&!/^(none|unknown|not supplied|not known|n\/a)[.!]?$/i.test(clean(value));
const administrative=text=>/\b(summary only|documentation only|only (?:the )?(?:summary|documentation)|no (?:implementation|source|artifact|project|actual)?\s*(?:change|work)(?: occurred)?|nothing (?:changed|implemented)|summary (?:rewritten|regenerated))\b/i.test(text);
const negative=text=>/\b(?:not (?:yet )?(?:performed|executed|inspected|opened|checked|tested|verified|confirmed|resolved|received|available)|did not|never (?:performed|executed|inspected|checked)|no (?:new )?(?:tool )?(?:checks?|tests?|verification|work)(?:\s+\w+){0,3}\s+(?:performed|executed|done)|still (?:missing|unavailable|unknown)|not established|unverified|unknown)\b/i.test(text);
const workVerb=/\b(inspected|opened|checked|implemented|modified|corrected|drafted|revised|tested|executed|confirmed|recovered|enabled|published|deployed|reviewed|tests? (?:were )?(?:run|executed|failed)|reports? pass|checks? (?:passed|pass)|tests? (?:passed|pass)|(?:passed|passing) (?:checks?|tests?))\b/i;
// A source may report a checked run as an identifier plus terminal result,
// rather than a sentence containing a past-tense work verb. Keep the original
// line for history comparison; these remain reported results, not independent proof.
const receiptCheck=text=>/\b(?:build|tests?|run|job|deploy(?:ment)?|release|receipt|checks?|workflow|artifact)\b/i.test(text)&&/\b(?:\d{6,}|[a-f0-9]{12,64})\b/i.test(text)&&/\b(?:PASS|PASSED|SUCCESS|SUCCEEDED)\s*[.!]?$/i.test(text)&&!/\b(?:not|no|failed|failure|pending|queued|running|cancelled|canceled|unverified|unknown)\b/i.test(text);
// Conservative legacy check intake. Negative section labels apply to their list;
// mixed clauses are considered separately. Original text is never rewritten.
export function verificationChecks(text){
 let excluded=false;const checks=[];
 for(const raw of String(text||'').split('\n')){
  const line=raw.replace(/^\s*[-*•]\s*/,'').trim();if(!line)continue;
  if(/^(?:not performed|not checked|not verified|not executed)\s*:/i.test(line)){excluded=/^[^:]+:\s*$/.test(line);continue;}
  if(/^(?:performed|checks performed|actual checks|verified)\s*:/i.test(line))excluded=false;
  if(excluded)continue;
  for(const clause of line.split(/;\s*|(?<=[.!?])\s+(?=[A-Z])/))if(known(clause)&&!negative(clause)&&!administrative(clause)&&(workVerb.test(clause)||receiptCheck(clause)))checks.push(clause.trim());
 }
 return checks;
}
// These are source-reported observations, never independent proof or authority.
export function workObservations(text){
 return String(text||'').split('\n').slice(0,100).flatMap(line=>{
  const parts=line.replace(/^\s*[-*•]\s*/,'').split('|').map(s=>s.trim());
  if(parts.length!==4||!TYPES.has(parts[0])||parts.slice(1).some(x=>!known(x)))return [];
  if(administrative(parts[2])||negative(parts[2])||negative(parts[3]))return [];
  return [{type:parts[0],subject:parts[1],result:parts[2],reference:parts[3],standing:'REPORTED'}];
 });
}
const evidenceLines=text=>String(text||'').split('\n').map(x=>clean(x.replace(/^\s*[-*•]\s*/,''))).filter(Boolean);
export function resolutionEvidence(fields){
 return workObservations(fields.observations).length>0||verificationChecks(fields.verification).length>0;
}
export function hasWorkEvidence(incoming,previous={},history=[]){
 const accepted=[...history,previous];
 const prior=new Set(accepted.flatMap(fields=>workObservations(fields.observations)).map(x=>JSON.stringify(x)));
 if(workObservations(incoming.observations).some(x=>!prior.has(JSON.stringify(x))))return true;
 const checks=new Set(accepted.flatMap(fields=>verificationChecks(fields.verification)).map(clean));
 const freshChecks=verificationChecks(incoming.verification).filter(line=>!checks.has(clean(line)));
 if(administrative([incoming.state,incoming.completed,incoming.verification].join(' '))&&!freshChecks.some(x=>/\b(inspected|opened|confirmed|recovered)\b/i.test(x)))return false;
 if(freshChecks.length)return true;
 // Reference-only intake is still reported data, not proof a check was performed.
 if(administrative([incoming.state,incoming.completed,incoming.verification].join(' ')))return false;
 const references=new Set(accepted.flatMap(fields=>evidenceLines(fields.artifacts)));
 return !!known(incoming.artifacts)&&evidenceLines(incoming.artifacts).some(line=>!references.has(line));
}
