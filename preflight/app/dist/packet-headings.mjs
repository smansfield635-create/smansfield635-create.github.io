// Representation only. Section recognition never changes source text or claims.
export function packetHeading(line,headings){
 const original=line.trim(),markdown=/^#{1,6}\s+/.test(original);
 const text=(markdown?original.replace(/^#{1,6}\s+/,'').replace(/\s+#+\s*$/,''):original).replace(/\*\*/g,'').replace(/^__([^:]+):__/,'$1:');
 const match=text.match(/^([A-Za-z &]+):\s*(.*)$/)||(markdown&&text.match(/^([A-Za-z &]+)$/));
 if(!match)return null;
 const label=match[1],key=headings[label.toUpperCase()];
 return key?{key,label,value:match[2]||'',explicit:markdown||label===label.toUpperCase()||/^\*\*|^__/.test(original)}:null;
}
export function packetLines(raw,headings){
 const fences=[];let seenHeading=false;
 return raw.replace(/\r\n?/g,'\n').split('\n').map(line=>{
  const mark=line.trim().match(/^(`{3,}|~{3,})(.*)$/),top=fences.at(-1);
  if(mark){
   if(top&&mark[1][0]===top.token[0]&&mark[1].length>=top.token.length&&!mark[2].trim())fences.pop();
   else if(!top||top.wrapper)fences.push({token:mark[1],wrapper:!top&&!seenHeading&&(!mark[2].trim()||mark[2].trim().toLowerCase()==='text')});
   return {line,heading:null};
  }
  const heading=!top||top.wrapper?packetHeading(line,headings):null;
  if(heading){seenHeading=true;const inline=heading.value.match(/^(`{3,}|~{3,})(.*)$/);if(inline)fences.push({token:inline[1],wrapper:false});}
  return {line,heading};
 });
}
