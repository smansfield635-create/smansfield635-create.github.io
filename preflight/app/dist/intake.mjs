// Shared intake contract. All classifications are conservative source reports.
export const INTAKE_CONTRACT = `Establish WORK ORIGIN: NEW WORK, EXISTING WORK, RECOVERY or UNKNOWN. A new DiamondGate record does not imply the work is new. For new work, do not require an existing artifact, repository, deployment or baseline. For existing work, reuse established evidence and identify only prerequisites to the next action. Read-only is a task permission, not a consequence of project age.
Assess one project versus separate projects, give a brief rationale, and list the work areas under PROJECT ORGANIZATION. Mark the organization PROPOSED unless the user explicitly approved it; keep proposals out of ACCEPTED DECISIONS. Preserve every requested work area. Ask only if the distinction materially prevents selecting a useful task.
Specify one bounded NEXT STEP and its own observable COMPLETION CONDITION; keep the broader program under UNFINISHED WORK. Separate confirmed prerequisites blocking that task from untested access, investigation questions and later verification. Conditional access warnings are not observed failures. Do not require new instrumentation during a read-only step; inspect existing diagnostics or propose the required permission separately.
AUTHORIZATION BOUNDARIES must identify the permitted action and scope, its user instruction, and any prohibited actions. Permission to prepare this handoff does not authorize implementation. The informational restriction applies to this reporting step; preserve separately established permissions for later work without inventing them. Report actual media inspection separately from preparing the handoff, and identify attachments that must transfer. Carry unresolved questions under UNKNOWNS.`;
export const missingIntent=f=>['project','goal'].filter(k=>!String(f[k]||'').trim()||/^(unknown|none|not supplied|imported project)[.!]?$/i.test(String(f[k]).trim()));
export const mutationAction=s=>/^(?:[-*•]\s*)?(?:implement|fix|correct|modify|build|add|update|execute|create|draft|write|design|produce|revise|compose|generate|publish|deploy|delete|send|purchase|book)\b/i.test(String(s||'').trim());
// Remove only explicitly hypothetical clauses, not affirmative failures nearby.
export function accessFailure(text){
 return String(text||'').split(/\n|;|(?<=[.!?])\s+/).some(line=>{
  const asserted=line.replace(/\b(?:if|in case)\b[^.!?;]*/gi,'').replace(/\b(?:may|might|could)\s+(?:be\s+)?(?:missing|unavailable|inaccessible)\b/gi,'');
  return /\b(?:missing|unavailable|inaccessible|denied|no access|cannot access|not accessible|not available)\b/i.test(asserted);
 });
}
export function investigationQuestion(line){
 if(/\b(?:but|however|failed|cannot access|no access|denied)\b/i.test(line))return false;
 if(/\b(?:not confirmed failures|access\/verification uncertainties|not been tested in the receiving room)\b/i.test(line))return true;
 if(/^(?:Actual .+ remains unverified until .+ is possible|A successful .+ has not been established|Existing evidence does not establish whether .+)[.!]?$/i.test(line))return true;
 if(/\b(?:denied|failed|cannot access|no access|awaiting approval|missing source|source unavailable|repository unavailable|required .+ missing)\b/i.test(line))return false;
 return /\b(?:source|implementation|access|revision)\b.*\b(?:not (?:been )?established|unknown|must be inspected)\b/i.test(line)||/\b(?:telemetry|coordinates|measurements?)\b.*\b(?:unavailable|required to (?:confirm|determine|establish)|unmeasured)\b/i.test(line)||/\bcoverage\b.*\b(?:not been measured|unmeasured)\b/i.test(line)||/\bcauses? cannot be established from .+ alone\b/i.test(line)||/\brequires? a reproducible .+ before .+ verified\b/i.test(line);
}
export function intakeGaps(f){
 const gaps=missingIntent(f).map(k=>'Establish the '+(k==='project'?'project identity':'intended outcome')+'.');
 // Legacy packets remain readable; new contract packets must fulfill their contract.
 if(String(f.intakeContract||'').trim()==='2'){
  if(!/^(NEW WORK|EXISTING WORK|RECOVERY)(?:\s|$)/.test(f.workOrigin||''))gaps.push('Establish whether this is new work, existing work or recovery.');
  if(!String(f.next||'').trim()||/^UNKNOWN$/i.test(f.next.trim()))gaps.push('Identify the first bounded task.');
  if(!String(f.success||'').trim()||/^UNKNOWN$/i.test(f.success.trim()))gaps.push('Define the observable completion condition for that task.');
  if(!String(f.organization||'').trim()||/^UNKNOWN$/i.test(f.organization.trim()))gaps.push('Recommend one project versus separate projects, with rationale and proposal/approval standing.');
 }
 return gaps;
}
