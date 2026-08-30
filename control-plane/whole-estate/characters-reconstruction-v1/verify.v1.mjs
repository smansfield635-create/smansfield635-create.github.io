#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const contractPath = path.join(root,'control-plane/whole-estate/characters-reconstruction-v1/task15-qualification-contract.v1.json');
const manifestPath = path.join(root,'control-plane/whole-estate/characters-reconstruction-v1/dossier-preservation-manifest.v1.json');
const lineagePath = path.join(root,'control-plane/whole-estate/characters-reconstruction-v1/task01-14-decision-lineage.v1.json');
const entrypointPath = path.join(root,'.github/ai-router/projects/characters/entrypoint.v1.json');
const pagePath = path.join(root,'characters/index.html');

const contract = JSON.parse(fs.readFileSync(contractPath,'utf8'));
const manifest = JSON.parse(fs.readFileSync(manifestPath,'utf8'));
const lineage = JSON.parse(fs.readFileSync(lineagePath,'utf8'));
const entrypoint = JSON.parse(fs.readFileSync(entrypointPath,'utf8'));
const page = fs.readFileSync(pagePath,'utf8');
const base = contract.admission.governingBase;
const legacy = execFileSync('git',['show',`${base}:characters/index.html`],{encoding:'utf8'});
const failures = [];
const checks = [];
const pass = (id,ok,detail='') => { checks.push({id,ok,detail}); if(!ok) failures.push({id,detail}); };

pass('PROJECT_REGISTRATION_PRESENT',entrypoint.projectId === 'CHARACTERS');
pass('PRESERVATION_ARTIFACTS_PRESENT',manifest.schema === 'CHARACTERS_DOSSIER_PRESERVATION_MANIFEST_v1');
pass('TASK01_14_LINEAGE_PRESENT',Array.isArray(lineage.tasks) && lineage.tasks.length === 14);
pass('CHARACTERS_PAGE_CHANGED_FROM_LEGACY_BLOB',page !== legacy);

const carouselMarkers = [...page.matchAll(/data-character-carousel(?:=|\b)/g)].length;
pass('ONE_CAROUSEL_PRESENT',carouselMarkers === 1,`count=${carouselMarkers}`);

for (const character of contract.surfaceContract.characterOrder) {
  pass(`CHARACTER_CARD_${character.toUpperCase().replaceAll('-','_')}`,page.includes(`data-character-card=\"${character}\"`) || page.includes(`data-character-card='${character}'`));
  pass(`CHARACTER_ID_${character.toUpperCase().replaceAll('-','_')}`,page.includes(`id=\"${character}\"`) || page.includes(`id='${character}'`));
}
const cardCount = [...page.matchAll(/data-character-card=/g)].length;
pass('EIGHT_CHARACTER_CARDS_PRESENT',cardCount === 8,`count=${cardCount}`);

const arrowPatterns = [
  /data-carousel-(?:prev|next)/i,
  /aria-label=["'][^"']*(?:previous|next)[^"']*(?:character|card|carousel)/i,
  /class=["'][^"']*carousel[^"']*(?:prev|next|arrow)/i
];
pass('NO_CAROUSEL_ARROW_CONTROLS',!arrowPatterns.some(r=>r.test(page)));

const dossierIds = manifest.characters.map(c=>c.id);
const extractDossier = (html,id) => {
  const start = html.indexOf(`<details class=\"character\" id=\"${id}\"`);
  if(start < 0) return null;
  const nextCandidates = dossierIds.map(other=>html.indexOf(`<details class=\"character\" id=\"${other}\"`,start+1)).filter(n=>n>start);
  const end = nextCandidates.length ? Math.min(...nextCandidates) : html.indexOf('</section>',start);
  return html.slice(start,end > start ? end : html.length);
};
for (const id of dossierIds) {
  const legacyBlock = extractDossier(legacy,id);
  const candidateBlock = extractDossier(page,id);
  pass(`DOSSIER_${id.toUpperCase().replaceAll('-','_')}_RECOVERABLE`,!!legacyBlock && !!candidateBlock && candidateBlock.includes(legacyBlock),candidateBlock ? '' : 'candidate block missing');
}

for (const destination of manifest.requiredNonFragmentDestinations) {
  pass(`DESTINATION_${destination.replaceAll('/','_').toUpperCase() || 'ROOT'}`,page.includes(`href=\"${destination}\"`) || page.includes(`href='${destination}'`),destination);
}

pass('RELATIONSHIP_CHRONOLOGY_P12_ACCESS_PRESENT',/relationship/i.test(page) && /chronolog/i.test(page) && /P12/i.test(page));
pass('STATIC_PAGE_USABLE_WITHOUT_JS',!/<script[^>]*>[^<]*(?:document\.write|location\.replace)/is.test(page));

const diffNames = execFileSync('git',['diff','--name-only',base,'HEAD'],{encoding:'utf8'}).trim().split(/\r?\n/).filter(Boolean);
const allowed = new Set([
  '.github/ai-router/router.v1.json',
  '.github/ai-router/projects/characters/entrypoint.v1.json',
  'characters/index.html',
  'control-plane/whole-estate/characters-reconstruction-v1/legacy-source-identity.v1.json',
  'control-plane/whole-estate/characters-reconstruction-v1/dossier-preservation-manifest.v1.json',
  'control-plane/whole-estate/characters-reconstruction-v1/task01-14-decision-lineage.v1.json',
  'control-plane/whole-estate/characters-reconstruction-v1/task15-qualification-contract.v1.json',
  'control-plane/whole-estate/characters-reconstruction-v1/verify.v1.mjs'
]);
pass('NO_UNRELATED_DIFF',diffNames.every(name=>allowed.has(name)),diffNames.filter(name=>!allowed.has(name)).join(','));

const result = failures.length ? contract.candidateFailResult : contract.candidatePassResult;
console.log(JSON.stringify({schema:'CHARACTERS_TASK15_EXACT_CANDIDATE_VERIFICATION_RECEIPT_v1',result,base,checks,failures},null,2));
process.exit(failures.length ? 1 : 0);
