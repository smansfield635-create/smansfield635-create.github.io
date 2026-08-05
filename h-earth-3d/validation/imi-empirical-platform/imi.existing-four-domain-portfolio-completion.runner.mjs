import { createRequire } from 'node:module';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { canonicalDigest, deepFreeze } from '../../tools/instrument-platform/platform-core.mjs';

const require = createRequire(import.meta.url);
const hospital = require('../../tools/imi-empirical-platform/studies/runs/IMI_CONFIRMATORY_HOSPITAL_REFRESH_2026_v1/cms-hospital-refresh-summary.v1.json');
const dssi = require('../../tools/imi-empirical-platform/studies/runs/IMI_DSSI_SOVEREIGN_DEBT_SERVICE_EXPANSION_2026_v1/dssi-phase-consolidation-receipt.v1.json');
const beeConsolidation = require('../../tools/imi-empirical-platform/studies/runs/IMI_USDA_HONEY_BEE_COLONY_RESILIENCE_REFRESH_2026_v1/usda-honey-bee-phase-consolidation-receipt.v1.json');

function argValue(name, fallback = null) {
  const index = process.argv.indexOf(name);
  return index >= 0 && process.argv[index + 1] ? process.argv[index + 1] : fallback;
}

const beeDir = argValue('--bee-dir', '/tmp/imi-usda-honey-bee-refresh-2026');
const speechDir = argValue('--speech-dir', '/tmp/imi-spontaneous-speech-rerun-2026');
const outputDir = argValue('--output-dir', '/tmp/imi-existing-four-domain-portfolio-completion');
const createdAt = argValue('--clock', '2026-08-05T16:38:00.000Z');

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, 'utf8'));
}

const bee = await readJson(path.join(beeDir, 'usda-honey-bee-refresh-summary.v1.json'));
const speech = await readJson(path.join(speechDir, 'spontaneous-speech-rerun-summary.v1.json'));

const requiredResults = {
  hospital: 'PASS_CLOSED_CMS_HOSPITAL_REFRESH_2026_REPOSITORY_INTAKE_RUN',
  speech: 'PASS_CLOSED_SPONTANEOUS_SPEECH_CURRENT_REPOSITORY_RERUN_2026',
  bees: 'PASS_CLOSED_USDA_HONEY_BEE_REFRESH_2026_REPOSITORY_INTAKE_RUN',
  beeConsolidation: 'PASS_CLOSED_USDA_HONEY_BEE_CURRENT_REFRESH_PHASE_CONSOLIDATED',
  dssi: 'PASS_CLOSED_DSSI_PARTIAL_ALL_COUNTRY_EXPANSION_PHASE_CONSOLIDATED'
};
const observedResults = {
  hospital: hospital.result,
  speech: speech.result,
  bees: bee.result,
  beeConsolidation: beeConsolidation.result,
  dssi: dssi.result
};
for (const [domain, expected] of Object.entries(requiredResults)) {
  if (observedResults[domain] !== expected) throw new Error(`FOUR_DOMAIN_RESULT_MISMATCH:${domain}:${observedResults[domain]}`);
}
if (!beeConsolidation.decision?.currentRefreshClosedForPortfolioPurposes) throw new Error('BEE_PHASE_NOT_CLOSED_FOR_PORTFOLIO');
if (!speech.determinations?.rawPublishedFeatureFileRerun || !speech.determinations?.currentRepositoryEngineUsed) throw new Error('SPEECH_REPOSITORY_RERUN_NOT_ESTABLISHED');
if (speech.validCases !== 291 || speech.unevaluableCases !== 0) throw new Error('SPEECH_CASE_COMPLETION_MISMATCH');

const receiptBody = {
  schemaVersion: 'IMI_EXISTING_FOUR_DOMAIN_EMPIRICAL_PORTFOLIO_COMPLETION_RECEIPT_v1',
  operation: 'IMI_EXISTING_FOUR_DOMAIN_EMPIRICAL_PORTFOLIO_COMPLETION_v1',
  result: 'PASS_CLOSED_EXISTING_FOUR_DOMAIN_EMPIRICAL_EXECUTION_SURFACE_COMPLETE',
  createdAt,
  repository: 'smansfield635-create/smansfield635-create.github.io',
  pullRequest: 589,
  branch: 'instrument/imi-empirical-platform-v1',
  completedDomains: [
    {
      domain: 'healthcare_quality',
      study: 'IMI_CONFIRMATORY_HOSPITAL_REFRESH_2026_v1',
      currentRepositoryRun: true,
      phaseConsolidated: true,
      result: hospital.result,
      validCases: hospital.validCases,
      unevaluableCases: hospital.unevaluableCases,
      hardCollapseCases: hospital.hardCollapseCases
    },
    {
      domain: 'spontaneous_speech_language_structure',
      study: speech.runId,
      currentRepositoryRun: true,
      phaseConsolidated: true,
      result: speech.result,
      validCases: speech.validCases,
      unevaluableCases: speech.unevaluableCases,
      hardCollapseCases: speech.hardCollapseCases,
      weakestFactorDiversity: speech.determinations.weakestFactorDiversity
    },
    {
      domain: 'agricultural_colony_resilience',
      study: 'IMI_USDA_HONEY_BEE_COLONY_RESILIENCE_REFRESH_2026_v1',
      currentRepositoryRun: true,
      phaseConsolidated: true,
      result: beeConsolidation.result,
      validCases: bee.validCases,
      unevaluableCases: bee.unevaluableCases,
      hardCollapseCases: bee.hardCollapseCases,
      temporalSignalRetained: beeConsolidation.decision.temporalSignalRetained,
      weakestFactorDiversityEstablished: beeConsolidation.decision.weakestFactorDiversityEstablished
    },
    {
      domain: 'sovereign_debt_service_schedule_dispersion',
      study: 'IMI_DSSI_SOVEREIGN_DEBT_SERVICE_EXPANSION_2026_v1',
      currentRepositoryRun: true,
      phaseConsolidated: true,
      result: dssi.result,
      validCases: dssi.consolidatedDssiState.validCountryRows,
      unevaluableCases: dssi.consolidatedDssiState.unevaluableCases,
      hardCollapseCases: dssi.consolidatedDssiState.hardCollapseCases,
      allCountryCompletionClosed: dssi.decision.allCountryCompletionClosed
    }
  ],
  collectiveDetermination: {
    existingFourDomainPortfolioExecutionSurfaceComplete: true,
    allFourDomainsRepositoryRepresented: true,
    allFourDomainsCurrentRepositoryExecuted: true,
    beeNegativeFindingsPreserved: true,
    speechLegacyBackfillReplacedByCurrentSourceRerunForExecutionPurposes: true,
    fullCrossDomainResearchSynthesisPerformed: false,
    finalInstrumentValidationEstablished: false
  },
  nextViableProgression: {
    operation: 'IMI_MULTI_DOMAIN_EMPIRICAL_PORTFOLIO_SYNTHESIS_v1',
    parallelOpenTracks: [
      'BEE_ROUTE_DISCRIMINATION_AND_LONGER_PANEL_STUDY',
      'DSSI_REMAINING_COUNTRY_CONTINUATION',
      'SPEECH_HELD_OUT_PROSPECTIVE_REPRODUCTION'
    ]
  },
  boundaries: {
    portfolioCompletionMeansExecutionAndCustodyCompletionOnly: true,
    fullResearchSynthesisNotYetPerformed: true,
    multiplicativeSuperiorityNotGenerallyClaimed: true,
    clinicalDiagnosticUseNotAuthorized: true,
    causalClaimsNotAuthorized: true,
    finalValidationClaimed: false,
    mainMerged: false,
    liveWebsiteOperational: false
  }
};
const receipt = deepFreeze({ ...receiptBody, receiptDigest: canonicalDigest(receiptBody) });
await mkdir(outputDir, { recursive: true });
await writeFile(path.join(outputDir, 'imi-existing-four-domain-portfolio-completion-receipt.v1.json'), JSON.stringify(receipt, null, 2));
console.log(JSON.stringify(receipt, null, 2));
