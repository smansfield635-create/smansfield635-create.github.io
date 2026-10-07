const present=v=>Array.isArray(v)?v.length>0:String(v??'').trim().length>0;
export function applies(node,answers={}){
 const w=node.when;if(!w)return true;
 if(w.type&&answers.type!==w.type)return false;
 if(w.answerEquals){const [k,v]=w.answerEquals;if(answers[k]!==v)return false;}
 if(w.answerIncludes){const [k,v]=w.answerIncludes;if(!Array.isArray(answers[k])||!answers[k].includes(v))return false;}
 return true;
}
export function activeNodes(matrix,answers={}){return matrix.nodes.filter(n=>applies(n,answers));}
export function nextNode(matrix,answers={},done=[]){return activeNodes(matrix,answers).find(n=>!done.includes(n.id))||null;}
export function pruneAnswers(matrix,answers={}){
 const active=new Set(activeNodes(matrix,answers).map(n=>n.id));
 return Object.fromEntries(Object.entries(answers).filter(([k])=>active.has(k)));
}
export function pruneDone(matrix,answers={},done=[]){const active=new Set(activeNodes(matrix,answers).map(n=>n.id));return done.filter(k=>active.has(k));}
export function reviewRows(matrix,answers={}){
 const byId=Object.fromEntries(matrix.nodes.map(n=>[n.id,n]));
 return Object.entries(answers).filter(([,v])=>present(v)).map(([key,value])=>({key,label:byId[key]?.synthesis||key,value:Array.isArray(value)?value.join(', '):String(value)}));
}
export function synthesizeBrief(matrix,answers={}){
 const rows=reviewRows(matrix,answers),sections=new Map();
 for(const r of rows){if(!sections.has(r.label))sections.set(r.label,[]);sections.get(r.label).push(r.value);}
 const order=['Project','Audience','Website objective','Content / information architecture','Required capabilities','Starting point / assets','Experience direction','Constraints / timing','Open questions','Contact'];
 const open=activeNodes(matrix,answers).filter(n=>n.openQuestion&&!present(answers[n.id])).map(n=>n.prompt);
 if(open.length)sections.set('Open questions',open);
 return order.filter(k=>sections.has(k)).map(k=>k+'\n'+sections.get(k).join(' · ')).join('\n\n');
}
export function emailDraft(matrix,answers={}){return 'Hello Sean,\n\nI would like to discuss a project with Diamond Gate Bridge.\n\n'+synthesizeBrief(matrix,answers)+'\n\nPlease help me work out the next step. I understand scope and schedule will be agreed separately.';}
