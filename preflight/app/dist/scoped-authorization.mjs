// Local intent records are portable user data, never authenticated tool authority.
import {clean} from './core.mjs';
const vocab={EDIT:/\b(?:edit(?:ing)?|implement(?:ation|ing)?|modif(?:y|ying|ication)|updat(?:e|ing)|writ(?:e|ing)|draft(?:ing)?|build(?:ing)?|creat(?:e|ing)|revis(?:e|ing)|correct(?:ion|ing)?|fix(?:ing)?|changes?)\b/i,RELEASE:/\b(?:publish(?:ing)?|publication|deploy(?:ment|ing)?|release|releasing)\b/i,SEND:/\b(?:send(?:ing)?|distribut(?:e|ion|ing)|email(?:ing)?)\b/i,DELETE:/\b(?:delet(?:e|ion|ing)|remov(?:e|al|ing))\b/i,PURCHASE:/\b(?:purchas(?:e|ing)|buy(?:ing)?|book(?:ing)?)\b/i};
export function primaryAction(action){return clean(action).split(/ Acceptance criterion:| Historical attempt limitations|\. Preserve accepted work\.|\n/)[0];}
export function actionScope(action){
 const s=primaryAction(action);
 if(/^(?:verify|test|check|inspect|review|present|identify|investigate|map|establish)\b/i.test(s))return null;
 const scopes=Object.entries(vocab).filter(([,re])=>re.test(s)).map(([k])=>k);
 return scopes.length===1?scopes[0]:null;
}
export function scopedPermission(text,action,fallback){
 const scope=actionScope(action);if(!scope)return 'UNKNOWN';
 const clauses=String(text||'').split(/;|\n| · |(?<=[.!?])\s+|\bbut\b/i).map(clean).filter(Boolean);
 const relevant=clauses.filter(c=>{const scopes=Object.entries(vocab).filter(([,re])=>re.test(c)).map(([k])=>k);return !scopes.length||scopes.includes(scope);});
 const states=relevant.map(c=>{
  const scopes=Object.entries(vocab).filter(([,re])=>re.test(c));
  // A mixed positive/negative clause is ambiguous; it cannot confer permission.
  if(scopes.length>1&&/\b(?:not|no|denied|withheld|except)\b/i.test(c))return 'DENIED';
  return fallback(c);
 });
 if(states.includes('DENIED'))return 'DENIED';
 if(states.includes('UNKNOWN')&&relevant.some(c=>/\b(?:revoked|unless|if approved|pending|requires? approval)\b/i.test(c)))return 'UNKNOWN';
 return states.includes('REPORTED_PERMISSION')?'REPORTED_PERMISSION':'UNKNOWN';
}
export function authorizationBinding(p,action){
 const c=p.checkpoints.at(-1);
 return JSON.stringify({project:p.id,baseline:c.id,action:primaryAction(action),authorization:c.fields.authorization||'',boundaries:p.flow.boundaries||[],target:c.fields.resultIdentity||'',artifacts:c.fields.artifacts||'',progress:p.progress||null});
}
export function validateAuthorization(p){
 const d=p.flow?.authorizationDecision;if(d===undefined)return;
 if(!d||Object.keys(d).some(k=>!['schema','value','binding','action','at'].includes(k))||d.schema!=='DGB_LOCAL_SCOPED_DECISION_v1'||!['ALLOWED','DEFERRED','DENIED'].includes(d.value)||typeof d.binding!=='string'||d.binding.length>4000000||typeof d.action!=='string'||!d.action||d.action.length>240000||typeof d.at!=='string'||!Number.isFinite(Date.parse(d.at)))throw Error('Invalid local scoped authorization decision.');
 try{const b=JSON.parse(d.binding);if(!b||typeof b.project!=='string'||typeof b.baseline!=='string'||b.action!==d.action)throw Error();}catch{throw Error('Invalid scoped authorization binding.');}
}
export function localAuthorization(p,action){validateAuthorization(p);const d=p.flow.authorizationDecision;if(p.flow.promptRequest||p.request?.trim())return null;return d?.binding===authorizationBinding(p,action)?d:null;}
export function localAuthorizationContext(p,decision){
 const r=decision.authorizationRequest;if(!r||!r.standing.startsWith('LOCAL_'))return '';
 return '\n\nLOCAL USER AUTHORIZATION DECISION\n'+r.standing+' for only: '+r.action+'\nProject: '+p.id+'; baseline: '+p.checkpoints.at(-1).id+'. This browser-local decision is user intent, not authenticated external authority. The receiving tool must revalidate the exact target, current permissions and native gates. No broader editing, sending or publication permission is implied.';
}
