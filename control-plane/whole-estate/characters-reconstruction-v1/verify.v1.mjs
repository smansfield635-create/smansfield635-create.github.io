#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
const root=process.cwd();
const cp='control-plane/whole-estate/characters-reconstruction-v1/';
const contract=JSON.parse(fs.readFileSync(path.join(root,cp,'task15-qualification-contract.v1.json'),'utf8'));
const manifest=JSON.parse(fs.readFileSync(path.join(root,cp,'dossier-preservation-manifest.v1.json'),'utf8'));
const lineage=JSON.parse(fs.readFileSync(path.join(root,cp,'task01-14-decision-lineage.v1.json'),'utf8'));
const entrypoint=JSON.parse(fs.readFileSync(path.join(root,'.github/ai-router/projects/characters/entrypoint.v1.json'),'utf8'));
const page=fs.readFileSync(path.join(root,'characters/index.html'),'utf8');
const preserved=fs.readFileSync(path.join(root,'characters/legacy-dossiers.html'),'utf8');
const base=contract.admission.governingBase;
const legacy=execFileSync('git',['show',`${base}:characters/index.html`],{encoding:'utf8'});
const failures=[],checks=[]; const pass=(id,ok,detail='')=>{checks.push({id,ok,detail});if(!ok)failures.push({id,detail})};
pass('PROJECT_REGISTRATION_PRESENT',entrypoint.projectId==='CHARACTERS');
pass('PRESERVATION_ARTIFACTS_PRESENT',manifest.schema==='CHARACTERS_DOSSIER_PRESERVATION_MANIFEST_v1');
pass('TASK01_14_LINEAGE_PRESENT',Array.isArray(lineage.tasks)&&lineage.tasks.length===14);
pass('CHARACTERS_PAGE_CHANGED_FROM_LEGACY_BLOB',page!==legacy);
pass('EXACT_LEGACY_DOSSIER_CARRIER',preserved===legacy);
const carouselMarkers=[...page.matchAll(/data-character-carousel(?:=|\b)/g)].length; pass('ONE_CAROUSEL_PRESENT',carouselMarkers===1,`count=${carouselMarkers}`);
for(const character of contract.surfaceContract.characterOrder){
 pass(`CHARACTER_CARD_${character.toUpperCase().replaceAll('-','_')}`,page.includes(`data-character-card=\"${character}\"`)||page.includes(`data-character-card='${character}'`));
 pass(`CHARACTER_DESTINATION_${character.toUpperCase().replaceAll('-','_')}`,page.includes(`/characters/legacy-dossiers.html#${character}`));
 pass(`LEGACY_CHARACTER_ID_${character.toUpperCase().replaceAll('-','_')}`,preserved.includes(`id=\"${character}\"`)||preserved.includes(`id='${character}'`));
}
const cardCount=[...page.matchAll(/data-character-card=/g)].length; pass('EIGHT_CHARACTER_CARDS_PRESENT',cardCount===8,`count=${cardCount}`);
const arrowPatterns=[/data-carousel-(?:prev|next)/i,/aria-label=["'][^"']*(?:previous|next)[^"']*(?:character|card|carousel)/i,/class=["'][^"']*carousel[^"']*(?:prev|next|arrow)/i]; pass('NO_CAROUSEL_ARROW_CONTROLS',!arrowPatterns.some(r=>r.test(page)));
const dossierIds=manifest.characters.map(c=>c.id); const extract=(html,id)=>{const start=html.indexOf(`<details class=\"character\" id=\"${id}\"`);if(start<0)return null;const next=dossierIds.map(o=>html.indexOf(`<details class=\"character\" id=\"${o}\"`,start+1)).filter(n=>n>start);const end=next.length?Math.min(...next):html.indexOf('</section>',start);return html.slice(start,end>start?end:html.length)};
for(const id of dossierIds){const a=extract(legacy,id),b=extract(preserved,id);pass(`DOSSIER_${id.toUpperCase().replaceAll('-','_')}_BYTE_EXACT`,!!a&&!!b&&a===b)}
for(const destination of manifest.requiredNonFragmentDestinations){const inSurface=page.includes(`href=\"${destination}\"`)||page.includes(`href='${destination}'`);const inPreserved=preserved.includes(`href=\"${destination}\"`)||preserved.includes(`href='${destination}'`);pass(`DESTINATION_${destination.replaceAll('/','_').toUpperCase()||'ROOT'}`,inSurface||inPreserved,destination)}
pass('RELATIONSHIP_CHRONOLOGY_P12_ACCESS_PRESENT',/relationship/i.test(page)&&/chronolog/i.test(page)&&/P12/i.test(page));
pass('STATIC_PAGE_USABLE_WITHOUT_JS',!/<script[^>]*>[^<]*(?:document\.write|location\.replace)/is.test(page));
const diffNames=execFileSync('git',['diff','--name-only',base,'HEAD'],{encoding:'utf8'}).trim().split(/\r?\n/).filter(Boolean); const allowed=new Set(['.github/ai-router/router.v1.json','.github/ai-router/projects/characters/entrypoint.v1.json','characters/index.html','characters/legacy-dossiers.html',`${cp}legacy-source-identity.v1.json`,`${cp}dossier-preservation-manifest.v1.json`,`${cp}task01-14-decision-lineage.v1.json`,`${cp}task15-qualification-contract.v1.json`,`${cp}verify.v1.mjs`]); pass('NO_UNRELATED_DIFF',diffNames.every(n=>allowed.has(n)),diffNames.filter(n=>!allowed.has(n)).join(','));
const result=failures.length?contract.candidateFailResult:contract.candidatePassResult;console.log(JSON.stringify({schema:'CHARACTERS_TASK15_EXACT_CANDIDATE_VERIFICATION_RECEIPT_v1',result,base,checks,failures},null,2));process.exit(failures.length?1:0);
