from epistemic_control_plane_validation_v1 import (
    ClaimEntitlement,
    EvidenceMode,
    EvidenceState,
    GeneralizationBreadth,
    ReplicationDepth,
    authorize,
    entitlement,
)
import hashlib
import json


ARCHITECTURE_FREEZE_SHA = "84fa8e19f8e6159f545302255e37c614b5682b06"


def E(
    mode,
    scope,
    *,
    design=True,
    execution=True,
    complete=True,
    provenance=True,
    threshold=True,
    contradiction=True,
    qualified=True,
    replication=ReplicationDepth.NONE,
    generalization=GeneralizationBreadth.NONE,
    causal_design=False,
):
    return EvidenceState(
        design,
        execution,
        complete,
        provenance,
        threshold,
        contradiction,
        qualified,
        evidence_mode=mode,
        replication_depth=replication,
        generalization_breadth=generalization,
        scope=scope,
        causal_design=causal_design,
    )


def R(mode, scope, replication=ReplicationDepth.NONE, generalization=GeneralizationBreadth.NONE):
    return ClaimEntitlement(mode, replication, generalization, scope)


def P(mode, scope, expected, replication=ReplicationDepth.NONE, generalization=GeneralizationBreadth.NONE):
    return {
        "claim": R(mode, scope, replication, generalization),
        "expected_authorized": expected,
    }


CASES = [
    {
        "id": "HIGGS_2012_CMS_3SIGMA_EXCESS",
        "domain": "particle_physics",
        "history": "CMS combined 7 TeV searches reported a largest local excess of 3.1 sigma near 124 GeV and explicitly stated that more data were required to ascertain its origin.",
        "source": "CERN CMS combined 7 TeV Higgs searches, Phys. Lett. B 710 (2012)",
        "evidence": E(EvidenceMode.DESCRIPTIVE, "CMS_7TEV_HIGGS_SEARCH"),
        "reference": R(EvidenceMode.DESCRIPTIVE, "CMS_7TEV_HIGGS_SEARCH"),
        "probes": [
            P(EvidenceMode.DESCRIPTIVE, "CMS_7TEV_HIGGS_SEARCH", True),
            P(EvidenceMode.PREDICTIVE, "CMS_7TEV_HIGGS_SEARCH", False),
            P(EvidenceMode.CAUSAL, "CMS_7TEV_HIGGS_SEARCH", False),
        ],
    },
    {
        "id": "HIGGS_2012_CMS_5SIGMA_NEW_BOSON",
        "domain": "particle_physics",
        "history": "CMS observed an excess near 125 GeV at five standard deviations, supporting production of a new particle while stating that more data were needed to establish its precise nature.",
        "source": "CERN CMS HIG-12-028",
        "evidence": E(EvidenceMode.DESCRIPTIVE, "CMS_7_8TEV_NEW_BOSON"),
        "reference": R(EvidenceMode.DESCRIPTIVE, "CMS_7_8TEV_NEW_BOSON"),
        "probes": [
            P(EvidenceMode.DESCRIPTIVE, "CMS_7_8TEV_NEW_BOSON", True),
            P(EvidenceMode.MECHANISTIC, "CMS_7_8TEV_NEW_BOSON", False),
        ],
    },
    {
        "id": "HIGGS_2012_ATLAS_CMS_INDEPENDENT_OBSERVATION",
        "domain": "particle_physics",
        "history": "ATLAS and CMS independently observed a new boson near 125-126 GeV with discovery-level significance using separate detectors and analyses.",
        "source": "CERN ATLAS and CMS 2012 discovery records",
        "evidence": E(
            EvidenceMode.DESCRIPTIVE,
            "LHC_125GEV_NEW_BOSON",
            replication=ReplicationDepth.INDEPENDENT_REPLICATION,
        ),
        "reference": R(
            EvidenceMode.DESCRIPTIVE,
            "LHC_125GEV_NEW_BOSON",
            ReplicationDepth.INDEPENDENT_REPLICATION,
        ),
        "probes": [
            P(
                EvidenceMode.DESCRIPTIVE,
                "LHC_125GEV_NEW_BOSON",
                True,
                ReplicationDepth.INDEPENDENT_REPLICATION,
            ),
            P(EvidenceMode.CAUSAL, "LHC_125GEV_NEW_BOSON", False),
        ],
    },
    {
        "id": "HIGGS_2012_PROPERTIES_CONSISTENT_NOT_FULLY_IDENTIFIED",
        "domain": "particle_physics",
        "history": "The new boson's measured properties were consistent with Standard Model Higgs expectations within uncertainties, but the record explicitly withheld a stronger identity claim pending more data.",
        "source": "CERN CMS Science 338 (2012)",
        "evidence": E(EvidenceMode.DESCRIPTIVE, "NEW_BOSON_PROPERTIES_2012"),
        "reference": R(EvidenceMode.DESCRIPTIVE, "NEW_BOSON_PROPERTIES_2012"),
        "probes": [
            P(EvidenceMode.DESCRIPTIVE, "NEW_BOSON_PROPERTIES_2012", True),
            P(EvidenceMode.CAUSAL, "NEW_BOSON_PROPERTIES_2012", False),
        ],
    },
    {
        "id": "LIGO_GW150914_FIRST_DIRECT_DETECTION",
        "domain": "gravitational_wave_astronomy",
        "history": "Twin Advanced LIGO detectors observed GW150914, the first direct detection of gravitational waves and a binary black-hole merger.",
        "source": "LIGO GW150914 official detection record",
        "evidence": E(EvidenceMode.DESCRIPTIVE, "GW150914_EVENT"),
        "reference": R(EvidenceMode.DESCRIPTIVE, "GW150914_EVENT"),
        "probes": [
            P(EvidenceMode.DESCRIPTIVE, "GW150914_EVENT", True),
            P(EvidenceMode.PREDICTIVE, "GW150914_EVENT", False),
        ],
    },
    {
        "id": "LIGO_GW151226_SECOND_CONFIRMED_BBH_SIGNAL",
        "domain": "gravitational_wave_astronomy",
        "history": "LIGO reported GW151226 as the second confirmed observation of gravitational waves from colliding black holes.",
        "source": "LIGO GW151226 official detection record",
        "evidence": E(
            EvidenceMode.DESCRIPTIVE,
            "BINARY_BLACK_HOLE_GW_DETECTION",
            replication=ReplicationDepth.INDEPENDENT_REPLICATION,
        ),
        "reference": R(
            EvidenceMode.DESCRIPTIVE,
            "BINARY_BLACK_HOLE_GW_DETECTION",
            ReplicationDepth.INDEPENDENT_REPLICATION,
        ),
        "probes": [
            P(
                EvidenceMode.DESCRIPTIVE,
                "BINARY_BLACK_HOLE_GW_DETECTION",
                True,
                ReplicationDepth.INDEPENDENT_REPLICATION,
            ),
        ],
    },
    {
        "id": "LIGO_GW170817_NEW_SOURCE_CLASS_TRANSFER",
        "domain": "gravitational_wave_astronomy",
        "history": "LIGO/Virgo observed gravitational waves from an inspiraling neutron-star pair, extending gravitational-wave observation from black-hole mergers to a new compact-binary source class with electromagnetic counterpart.",
        "source": "LIGO GW170817 official detection record",
        "evidence": E(
            EvidenceMode.DESCRIPTIVE,
            "COMPACT_BINARY_GW_ASTRONOMY",
            replication=ReplicationDepth.INDEPENDENT_REPLICATION,
            generalization=GeneralizationBreadth.SAME_DOMAIN_TRANSFER,
        ),
        "reference": R(
            EvidenceMode.DESCRIPTIVE,
            "COMPACT_BINARY_GW_ASTRONOMY",
            ReplicationDepth.INDEPENDENT_REPLICATION,
            GeneralizationBreadth.SAME_DOMAIN_TRANSFER,
        ),
        "probes": [
            P(
                EvidenceMode.DESCRIPTIVE,
                "COMPACT_BINARY_GW_ASTRONOMY",
                True,
                ReplicationDepth.INDEPENDENT_REPLICATION,
                GeneralizationBreadth.SAME_DOMAIN_TRANSFER,
            ),
            P(
                EvidenceMode.DESCRIPTIVE,
                "ALL_ASTROPHYSICAL_TRANSIENTS",
                False,
                ReplicationDepth.INDEPENDENT_REPLICATION,
                GeneralizationBreadth.CROSS_DOMAIN,
            ),
        ],
    },
    {
        "id": "WHO_HCQ_HOSPITAL_MORTALITY_RANDOMIZED",
        "domain": "infectious_disease_therapeutics",
        "history": "Randomized Solidarity and RECOVERY evidence showed hydroxychloroquine did not reduce mortality in hospitalized COVID-19 patients compared with standard care.",
        "source": "WHO Solidarity hydroxychloroquine record, 2020",
        "evidence": E(EvidenceMode.CAUSAL, "HOSPITALIZED_COVID19_MORTALITY", causal_design=True),
        "reference": R(EvidenceMode.CAUSAL, "HOSPITALIZED_COVID19_MORTALITY"),
        "probes": [
            P(EvidenceMode.CAUSAL, "HOSPITALIZED_COVID19_MORTALITY", True),
            P(EvidenceMode.CAUSAL, "COVID19_PROPHYLAXIS", False),
        ],
    },
    {
        "id": "WHO_HCQ_SCOPE_DOES_NOT_INCLUDE_PROPHYLAXIS",
        "domain": "infectious_disease_therapeutics",
        "history": "WHO explicitly stated that the hospitalized-patient Solidarity result did not determine hydroxychloroquine's effects in non-hospitalized patients or pre/post-exposure prophylaxis.",
        "source": "WHO hydroxychloroquine Q&A, 19 June 2020",
        "evidence": E(EvidenceMode.CAUSAL, "HOSPITALIZED_COVID19", causal_design=True),
        "reference": R(EvidenceMode.CAUSAL, "HOSPITALIZED_COVID19"),
        "probes": [
            P(EvidenceMode.CAUSAL, "HOSPITALIZED_COVID19", True),
            P(EvidenceMode.CAUSAL, "NONHOSPITALIZED_OR_PROPHYLAXIS", False),
        ],
    },
    {
        "id": "WHO_SOLIDARITY_REMDESIVIR_HOSPITAL_OUTCOMES",
        "domain": "infectious_disease_therapeutics",
        "history": "The large international randomized Solidarity trial reported little or no effect of remdesivir on 28-day mortality or in-hospital course among hospitalized COVID-19 patients.",
        "source": "WHO Solidarity interim results, October-December 2020",
        "evidence": E(EvidenceMode.CAUSAL, "HOSPITALIZED_COVID19_SOLIDARITY_OUTCOMES", causal_design=True),
        "reference": R(EvidenceMode.CAUSAL, "HOSPITALIZED_COVID19_SOLIDARITY_OUTCOMES"),
        "probes": [
            P(EvidenceMode.CAUSAL, "HOSPITALIZED_COVID19_SOLIDARITY_OUTCOMES", True),
            P(EvidenceMode.CAUSAL, "EARLY_OUTPATIENT_COVID19", False),
        ],
    },
    {
        "id": "ADUCANUMAB_CAUSES_AMYLOID_REDUCTION",
        "domain": "neurodegenerative_therapeutics",
        "history": "Randomized aducanumab trials provided convincing evidence of treatment-related reduction in brain amyloid plaque measured by PET.",
        "source": "FDA Aducanumab BLA 761178 decisional memorandum, 7 June 2021",
        "evidence": E(EvidenceMode.CAUSAL, "BRAIN_AMYLOID_PLAQUE_REDUCTION", causal_design=True),
        "reference": R(EvidenceMode.CAUSAL, "BRAIN_AMYLOID_PLAQUE_REDUCTION"),
        "probes": [
            P(EvidenceMode.CAUSAL, "BRAIN_AMYLOID_PLAQUE_REDUCTION", True),
            P(EvidenceMode.CAUSAL, "CLINICAL_ALZHEIMER_BENEFIT", False),
        ],
    },
    {
        "id": "ADUCANUMAB_SURROGATE_PREDICTS_CLINICAL_BENEFIT",
        "domain": "neurodegenerative_therapeutics",
        "history": "FDA concluded that amyloid reduction was reasonably likely to predict clinical benefit while explicitly recognizing residual uncertainty about whether clinical benefit had been established.",
        "source": "FDA Aducanumab accelerated-approval memoranda, 7 June 2021",
        "evidence": E(EvidenceMode.PREDICTIVE, "CLINICAL_ALZHEIMER_BENEFIT_FROM_SURROGATE"),
        "reference": R(EvidenceMode.PREDICTIVE, "CLINICAL_ALZHEIMER_BENEFIT_FROM_SURROGATE"),
        "probes": [
            P(EvidenceMode.PREDICTIVE, "CLINICAL_ALZHEIMER_BENEFIT_FROM_SURROGATE", True),
            P(EvidenceMode.CAUSAL, "CLINICAL_ALZHEIMER_BENEFIT_FROM_SURROGATE", False),
        ],
    },
    {
        "id": "ADUCANUMAB_MIXED_CLINICAL_ENDPOINTS_WITH_RESIDUAL_UNCERTAINTY",
        "domain": "neurodegenerative_therapeutics",
        "history": "FDA recorded substantial uncertainty in the direct clinical endpoints, including a negative high-dose result in Study 301, while still treating the amyloid surrogate as reasonably likely to predict benefit under accelerated approval.",
        "source": "FDA Aducanumab decisional memoranda, 2021",
        "evidence": E(
            EvidenceMode.PREDICTIVE,
            "CLINICAL_ALZHEIMER_BENEFIT_FROM_SURROGATE",
            contradiction=False,
        ),
        "reference": R(EvidenceMode.PREDICTIVE, "CLINICAL_ALZHEIMER_BENEFIT_FROM_SURROGATE"),
        "probes": [
            P(EvidenceMode.PREDICTIVE, "CLINICAL_ALZHEIMER_BENEFIT_FROM_SURROGATE", True),
            P(EvidenceMode.CAUSAL, "CLINICAL_ALZHEIMER_BENEFIT_FROM_SURROGATE", False),
        ],
    },
    {
        "id": "PREDIMED_ORIGINAL_RANDOMIZATION_IRREGULARITIES",
        "domain": "cardiovascular_nutrition",
        "history": "Review of PREDIMED identified protocol deviations, including participants enrolled or assigned without proper randomization, leading to withdrawal of the original report.",
        "source": "NEJM Retraction and Republication, June 2018",
        "evidence": E(
            EvidenceMode.CAUSAL,
            "PREDIMED_ORIGINAL_CAUSAL_EFFECT",
            provenance=False,
            qualified=False,
            causal_design=True,
        ),
        "reference": R(EvidenceMode.DESCRIPTIVE, "PREDIMED_ORIGINAL_CAUSAL_EFFECT"),
        "probes": [
            P(EvidenceMode.CAUSAL, "PREDIMED_ORIGINAL_CAUSAL_EFFECT", False),
            P(EvidenceMode.DESCRIPTIVE, "PREDIMED_ORIGINAL_CAUSAL_EFFECT", True),
        ],
    },
    {
        "id": "PREDIMED_REANALYSIS_AFTER_PROTOCOL_DEVIATIONS",
        "domain": "cardiovascular_nutrition",
        "history": "The republished PREDIMED analysis disclosed randomization irregularities and reported revised adjusted estimates that did not rely exclusively on the assumption that every participant had been randomized.",
        "source": "NEJM PREDIMED republication, 2018",
        "evidence": E(EvidenceMode.ASSOCIATIONAL, "PREDIMED_REANALYZED_EFFECT"),
        "reference": R(EvidenceMode.ASSOCIATIONAL, "PREDIMED_REANALYZED_EFFECT"),
        "probes": [
            P(EvidenceMode.ASSOCIATIONAL, "PREDIMED_REANALYZED_EFFECT", True),
            P(EvidenceMode.CAUSAL, "PREDIMED_REANALYZED_EFFECT", False),
        ],
    },
    {
        "id": "VIOXX_APPROVE_RANDOMIZED_CARDIOVASCULAR_RISK",
        "domain": "drug_safety",
        "history": "Rofecoxib was withdrawn after the randomized APPROVe trial showed increased cardiovascular risk, supporting a bounded causal drug-safety claim for rofecoxib under the studied exposure.",
        "source": "FDA VIOXX decisional record, 2004-2005",
        "evidence": E(EvidenceMode.CAUSAL, "ROFECOXIB_APPROVE_CARDIOVASCULAR_RISK", causal_design=True),
        "reference": R(EvidenceMode.CAUSAL, "ROFECOXIB_APPROVE_CARDIOVASCULAR_RISK"),
        "probes": [
            P(EvidenceMode.CAUSAL, "ROFECOXIB_APPROVE_CARDIOVASCULAR_RISK", True),
            P(EvidenceMode.CAUSAL, "ALL_NSAIDS_CARDIOVASCULAR_RISK", False),
        ],
    },
    {
        "id": "VIOXX_DOES_NOT_GENERALIZE_AUTOMATICALLY_TO_ALL_NSAIDS",
        "domain": "drug_safety",
        "history": "The rofecoxib evidence directly concerned VIOXX; extension of the same magnitude or causal profile to every NSAID requires separate evidence rather than automatic class-wide generalization.",
        "source": "FDA COX-2/NSAID decisional summary",
        "evidence": E(EvidenceMode.CAUSAL, "ROFECOXIB_CARDIOVASCULAR_RISK", causal_design=True),
        "reference": R(EvidenceMode.CAUSAL, "ROFECOXIB_CARDIOVASCULAR_RISK"),
        "probes": [
            P(EvidenceMode.CAUSAL, "ROFECOXIB_CARDIOVASCULAR_RISK", True),
            P(
                EvidenceMode.CAUSAL,
                "ALL_NSAIDS_CARDIOVASCULAR_RISK",
                False,
                generalization=GeneralizationBreadth.SAME_DOMAIN_TRANSFER,
            ),
        ],
    },
    {
        "id": "MMR_AUTISM_RETRACTED_ORIGINAL_REPORT",
        "domain": "vaccine_epidemiology",
        "history": "The original MMR-autism article was retracted following improprieties in recruitment and financial conflicts, so its stronger etiologic claim cannot retain entitlement.",
        "source": "CDC review of MMR vaccine and autism evidence",
        "evidence": E(
            EvidenceMode.CAUSAL,
            "MMR_CAUSES_AUTISM",
            provenance=False,
            contradiction=False,
            qualified=False,
            causal_design=False,
        ),
        "reference": R(EvidenceMode.DESCRIPTIVE, "MMR_CAUSES_AUTISM"),
        "probes": [
            P(EvidenceMode.CAUSAL, "MMR_CAUSES_AUTISM", False),
            P(EvidenceMode.DESCRIPTIVE, "MMR_CAUSES_AUTISM", True),
        ],
    },
    {
        "id": "MMR_AUTISM_SUBSEQUENT_EPIDEMIOLOGIC_NONASSOCIATION",
        "domain": "vaccine_epidemiology",
        "history": "Subsequent epidemiologic studies did not find links between MMR vaccination and autism-related syndromes, providing replicated associational evidence against the proposed association.",
        "source": "CDC review of MMR vaccine and autism evidence",
        "evidence": E(
            EvidenceMode.ASSOCIATIONAL,
            "MMR_AUTISM_ASSOCIATION",
            replication=ReplicationDepth.INDEPENDENT_REPLICATION,
        ),
        "reference": R(
            EvidenceMode.ASSOCIATIONAL,
            "MMR_AUTISM_ASSOCIATION",
            ReplicationDepth.INDEPENDENT_REPLICATION,
        ),
        "probes": [
            P(
                EvidenceMode.ASSOCIATIONAL,
                "MMR_AUTISM_ASSOCIATION",
                True,
                ReplicationDepth.INDEPENDENT_REPLICATION,
            ),
            P(EvidenceMode.CAUSAL, "MMR_AUTISM_ASSOCIATION", False),
        ],
    },
    {
        "id": "GFAJ1_INITIAL_ARSENIC_BIOMOLECULE_MECHANISM",
        "domain": "astrobiology_microbiology",
        "history": "Initial GFAJ-1 work reported growth under arsenate conditions and arsenic associated with cellular fractions and genomic-DNA preparations, supporting a proposed biochemical incorporation mechanism within that organism.",
        "source": "NASA Astrobiology Institute GFAJ-1 project records",
        "evidence": E(EvidenceMode.MECHANISTIC, "GFAJ1_ARSENIC_INCORPORATION_MECHANISM"),
        "reference": R(EvidenceMode.MECHANISTIC, "GFAJ1_ARSENIC_INCORPORATION_MECHANISM"),
        "probes": [
            P(EvidenceMode.MECHANISTIC, "GFAJ1_ARSENIC_INCORPORATION_MECHANISM", True),
            P(EvidenceMode.CAUSAL, "ALL_LIFE_CAN_SUBSTITUTE_ARSENIC", False),
        ],
    },
    {
        "id": "GFAJ1_SINGLE_ORGANISM_DOES_NOT_GENERALIZE_TO_LIFE",
        "domain": "astrobiology_microbiology",
        "history": "A single-organism biochemical result does not by itself establish a generalized claim that arsenic substitution is a broad property of life or a cross-domain biological principle.",
        "source": "NASA GFAJ-1 project records and contemporaneous scope",
        "evidence": E(EvidenceMode.MECHANISTIC, "GFAJ1_SINGLE_ORGANISM"),
        "reference": R(EvidenceMode.MECHANISTIC, "GFAJ1_SINGLE_ORGANISM"),
        "probes": [
            P(EvidenceMode.MECHANISTIC, "GFAJ1_SINGLE_ORGANISM", True),
            P(
                EvidenceMode.MECHANISTIC,
                "GENERAL_PROPERTY_OF_LIFE",
                False,
                generalization=GeneralizationBreadth.CROSS_DOMAIN,
            ),
        ],
    },
]


def vector(ent):
    return {
        "evidence_mode": ent.evidence_mode.name,
        "replication_depth": ent.replication_depth.name,
        "generalization_breadth": ent.generalization_breadth.name,
        "scope": ent.scope,
    }


def corpus_fingerprint():
    frozen = [
        {
            "id": c["id"],
            "domain": c["domain"],
            "history": c["history"],
            "source": c["source"],
            "reference": vector(c["reference"]),
            "probes": [
                {
                    "claim": vector(p["claim"]),
                    "expected_authorized": p["expected_authorized"],
                }
                for p in c["probes"]
            ],
        }
        for c in CASES
    ]
    payload = json.dumps(frozen, sort_keys=True, separators=(",", ":")).encode()
    return hashlib.sha256(payload).hexdigest()


def main():
    results = []
    vector_matches = 0
    dimension_matches = {
        "evidence_mode": 0,
        "replication_depth": 0,
        "generalization_breadth": 0,
        "scope": 0,
    }
    severe_overgrants = 0
    probe_matches = 0
    probe_total = 0

    for case in CASES:
        actual = entitlement(case["evidence"])
        reference = case["reference"]
        av = vector(actual)
        rv = vector(reference)
        exact = av == rv
        vector_matches += int(exact)

        for dim in dimension_matches:
            dimension_matches[dim] += int(av[dim] == rv[dim])

        if actual.evidence_mode > reference.evidence_mode:
            severe_overgrants += 1
        if actual.replication_depth > reference.replication_depth:
            severe_overgrants += 1
        if actual.generalization_breadth > reference.generalization_breadth:
            severe_overgrants += 1
        if actual.scope != reference.scope:
            severe_overgrants += 1

        probes = []
        for probe in case["probes"]:
            observed = authorize(case["evidence"], probe["claim"])
            ok = observed == probe["expected_authorized"]
            probe_matches += int(ok)
            probe_total += 1
            probes.append(
                {
                    "claim": vector(probe["claim"]),
                    "expected_authorized": probe["expected_authorized"],
                    "actual_authorized": observed,
                    "pass": ok,
                }
            )

        results.append(
            {
                "id": case["id"],
                "domain": case["domain"],
                "reference": rv,
                "actual": av,
                "vector_pass": exact,
                "probes": probes,
            }
        )

    n = len(CASES)
    output = {
        "instrument": "EPISTEMIC_CONTROL_PLANE_v1_PROSPECTIVE_TRANSFER",
        "architecture_freeze_sha": ARCHITECTURE_FREEZE_SHA,
        "corpus_fingerprint_sha256": corpus_fingerprint(),
        "cases": n,
        "vector_exact_matches": vector_matches,
        "vector_exact_agreement": vector_matches / n,
        "dimension_accuracy": {k: v / n for k, v in dimension_matches.items()},
        "probe_matches": probe_matches,
        "probe_total": probe_total,
        "probe_accuracy": probe_matches / probe_total,
        "severe_overgrants": severe_overgrants,
        "results": results,
        "human_blinded_expert_reference": False,
        "reference_type": "literature_grounded_predeclared_reference",
        "repair_before_scoring_complete": False,
    }
    output["verdict"] = (
        "PROSPECTIVE_STRUCTURED_TRANSFER_CONFIRMED_FOR_CORPUS"
        if vector_matches == n and probe_matches == probe_total and severe_overgrants == 0
        else "PROSPECTIVE_STRUCTURED_TRANSFER_NOT_CONFIRMED_PRESERVE_FAILURE"
    )

    print(json.dumps(output, indent=2))
    with open("epistemic_control_plane_prospective_transfer_v1.json", "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2)

    if output["verdict"] != "PROSPECTIVE_STRUCTURED_TRANSFER_CONFIRMED_FOR_CORPUS":
        raise SystemExit(1)


if __name__ == "__main__":
    main()
