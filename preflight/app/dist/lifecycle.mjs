// Trash retains the original record, identity, drafts and complete history.
export const activeProjects=db=>db.projects.filter(p=>!p.deletedAt);
export const trashedProjects=db=>db.projects.filter(p=>!!p.deletedAt);
export function moveToTrash(db,id,at=new Date().toISOString()){
 const p=db.projects.find(p=>p.id===id);
 if(!p||p.deletedAt)throw Error('This project is not active.');
 p.deletedAt=at;
 if(db.selected===id)db.selected='';
 return p;
}
export function restoreProject(db,id){
 const p=db.projects.find(p=>p.id===id);
 if(!p?.deletedAt)throw Error('This project is not in Trash.');
 delete p.deletedAt;db.selected=p.id;return p;
}

// Call only after explicit confirmation. Validate the full selection before any
// mutation, then remove records and drafts from the existing workspace itself.
export function purgeTrashedProjects(db,ids){
 if(!Array.isArray(ids)||!ids.length||new Set(ids).size!==ids.length||ids.some(id=>typeof id!=='string'))throw Error('Choose projects in Trash to delete permanently.');
 const selected=new Set(ids);
 for(const id of ids){const matches=db.projects.filter(p=>p.id===id);if(matches.length!==1||!matches[0].deletedAt)throw Error('Only projects currently in Trash can be deleted permanently. Nothing was deleted.');}
 db.projects=db.projects.filter(p=>!selected.has(p.id));
 for(const id of ids)delete db.updates[id];
 if(selected.has(db.selected))db.selected='';
 return ids.length;
}
