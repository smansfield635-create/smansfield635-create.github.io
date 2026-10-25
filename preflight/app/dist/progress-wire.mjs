// Transport normalization only: never infer requirements, evidence links or approval.
export class ProgressFormatError extends Error {
 constructor(section,detail){super(section+': '+detail+' The response draft is preserved; no progress or approval was inferred.');this.name='ProgressFormatError';this.section=section;}
}
export function readProgressRows(raw,label,max=100){
 const original=String(raw||'').trim();let value;
 try{value=JSON.parse(original);}catch{}
 if(value===undefined){
  const fences=[...original.matchAll(/```(?:json)?\s*\n([\s\S]*?)\n```/g)];
  if(fences.length===1){try{value=JSON.parse(fences[0][1]);}catch{}}
  // A section-closing fence may have been removed by an older packet reader.
  if(value===undefined&&/^```(?:json)?\s*\n/.test(original)){try{value=JSON.parse(original.replace(/^```(?:json)?\s*\n/,'').replace(/\n```\s*$/,''));}catch{}}
 }
 if(value===undefined){
  // Explicit labelled records are a human-readable alternative to JSON.
  // Values remain literal; arbitrary prose is never guessed into evidence.
  const aliases={id:'id','requirement id':label==='REQUIREMENTS'?'id':'requirement',requirement:'requirement',text:'text',description:'text',criterion:'criterion','acceptance criterion':'criterion',review:'review','human review':'review',dependson:'dependsOn','depends on':'dependsOn',standing:'standing',kind:'kind','event id':'id',details:'details',reference:'reference','evidence reference':'reference',artifact:'artifact',result:'result',outcome:'outcome',route:'route'};
  let rows=[],row=null,field=null,invalid=false;
  for(let line of original.split('\n')){
   line=line.trim().replace(/^#{1,6}\s*/,'').replace(/^[-*•]\s+/,'').replace(/\*\*/g,'');
   if(!line||/^---+$/.test(line))continue;
   const m=line.match(/^([A-Za-z ]+):\s*(.*)$/),key=m&&aliases[m[1].toLowerCase()];
   if(key==='id'){row={id:m[2].trim()};rows.push(row);field='id';}
   else if(key&&row){if(key in row){invalid=true;break;}row[key]=m[2].trim();field=key;}
   else if(row&&['text','criterion','details'].includes(field)){row[field]+='\n'+line;}
   else{invalid=true;break;}
  }
  if(rows.length&&!invalid){for(const r of rows)if('dependsOn'in r){try{r.dependsOn=JSON.parse(r.dependsOn);}catch{r.dependsOn=/^(none|\[\])$/i.test(r.dependsOn)?[]:r.dependsOn.split(',').map(x=>x.trim());}}value=rows;}
 }
 if(value&&typeof value==='object'&&!Array.isArray(value))value=value[label==='REQUIREMENTS'?'requirements':'progressEvents'];
 if(!Array.isArray(value))throw new ProgressFormatError(label,'Could not read the supplied records. Use a JSON array (fenced JSON is supported) or labelled ID/Text/Criterion records');
 if(value.length>max)throw new ProgressFormatError(label,'Too many records');
 return value;
}
