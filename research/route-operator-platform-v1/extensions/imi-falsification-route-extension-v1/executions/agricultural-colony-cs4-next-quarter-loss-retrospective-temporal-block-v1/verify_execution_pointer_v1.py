from pathlib import Path
import hashlib
import json
import re
import sys

ROOT = Path(__file__).resolve().parent
SHA = re.compile(r"^[0-9a-f]{64}$")
EXPECTED = {
    "contract_id": "AGRICULTURAL_COLONY_CS4_NEXT_QUARTER_LOSS_RETROSPECTIVE_TEMPORAL_BLOCK_v1",
    "package_sha256": "c133c48198abda4c6ca6c394c201634ec580e68b9224a82d62119e3517c97c56",
    "package_size": 124638,
    "drive_file_id": "1OoYrTqfBVjmCuC5RA52xBMEgAEy0WIr4",
    "source_workbook_sha256": "1b4c198a03bb8c0bac473a7118a4dcde03ecdce4e270f89f68780f43687bc8e2",
    "analysis_plan_sha256": "810f2c3c419cbec891a607ed9433764fc6382ce1a54c6122cd8f3507e518a156",
    "analysis_code_sha256": "73c65bcb37b7690234a866ab6c7c027d525a17cccb9283de5a665d4bb29818a5",
    "primary_category": "MULTIDIMENSIONAL_INCREMENT_SUPPORTED_BUT_OPERATOR_NOT_DISTINGUISHED",
}

def load(name):
    return json.loads((ROOT / name).read_text(encoding="utf-8"))

def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def main():
    errors=[]
    checks=0
    required=["EXECUTION_PACKAGE_POINTER.json","RESULT_POINTER.json","RATIFICATION_POINTER.json","POINTER_MANIFEST_SHA256.json","README.md"]
    for name in required:
        checks += 1
        if not (ROOT/name).is_file():
            errors.append(f"MISSING:{name}")
    if errors:
        print(json.dumps({"verification_status":"FAIL","checks_executed":checks,"errors":errors},indent=2))
        return 1
    package=load("EXECUTION_PACKAGE_POINTER.json")
    result=load("RESULT_POINTER.json")
    rat=load("RATIFICATION_POINTER.json")
    manifest=load("POINTER_MANIFEST_SHA256.json")
    expected_package={
        "package_id":EXPECTED["contract_id"],
        "zip_sha256":EXPECTED["package_sha256"],
        "zip_size_bytes":EXPECTED["package_size"],
        "drive_file_id":EXPECTED["drive_file_id"],
        "source_workbook_sha256":EXPECTED["source_workbook_sha256"],
        "analysis_plan_sha256":EXPECTED["analysis_plan_sha256"],
        "analysis_code_sha256":EXPECTED["analysis_code_sha256"],
        "custody_readback_status":"PASS_EXACT_SHA256_AND_SIZE",
        "core_mutation_performed":False,
    }
    for key,value in expected_package.items():
        checks += 1
        if package.get(key) != value:
            errors.append(f"PACKAGE_POINTER_MISMATCH:{key}")
    checks += 1
    if not SHA.fullmatch(str(package.get("zip_sha256",""))):
        errors.append("INVALID_PACKAGE_SHA256")
    expected_result={
        "contract_id":EXPECTED["contract_id"],
        "execution_status":"PASS_CLOSED",
        "verification_status":"PASS",
        "verification_checks_executed":133,
        "primary_result_category":EXPECTED["primary_category"],
        "robustness_status":"NOT_ROBUST_TO_ALL_PREDECLARED_SENSITIVITIES",
        "confirmatory_status":"NO",
        "parent_theory_adjudication":"NOT_PERFORMED",
        "core_mutation_performed":False,
    }
    for key,value in expected_result.items():
        checks += 1
        if result.get(key) != value:
            errors.append(f"RESULT_POINTER_MISMATCH:{key}")
    checks += 4
    rmse=result.get("rmse",{})
    if not (
        rmse.get("CURRENT_LOSS_PLUS_CS4") < rmse.get("CURRENT_LOSS_ONLY")
        and rmse.get("CURRENT_LOSS_PLUS_CS4") < rmse.get("CURRENT_LOSS_PLUS_VARROA")
        and rmse.get("CURRENT_LOSS_PLUS_CS4") > rmse.get("CURRENT_LOSS_PLUS_MEAN4")
        and result.get("claim_dispositions",{}).get("MULTIPLICATIVE_CS4_ADDS_MATERIAL_VALUE_OVER_ADDITIVE_MEAN4") == "THEORY_REDUNDANT_FOR_TEST"
    ):
        errors.append("SCIENTIFIC_RESULT_ORDER_MISMATCH")
    expected_rat={
        "ratification_status":"PASS_CLOSED",
        "execution_status":"PASS_CLOSED",
        "verification_status":"PASS",
        "scientific_strength":"LIMITED_PRELIMINARY_RETROSPECTIVE_PREDICTIVE_UTILITY",
        "multiplicative_specificity":"NOT_SUPPORTED",
        "parent_theory_adjudication":"NOT_PERFORMED",
        "core_mutation_performed":False,
        "post_outcome_rescue_performed":False,
        "package_sha256":EXPECTED["package_sha256"],
    }
    for key,value in expected_rat.items():
        checks += 1
        if rat.get(key) != value:
            errors.append(f"RATIFICATION_POINTER_MISMATCH:{key}")
    declared=manifest.get("artifacts",[])
    checks += 1
    if len(declared) != 4:
        errors.append("MANIFEST_ARTIFACT_COUNT")
    else:
        for item in declared:
            path=ROOT/item["path"]
            checks += 3
            if not path.is_file():
                errors.append(f"MANIFEST_FILE_MISSING:{item['path']}")
                continue
            if digest(path) != item["sha256"]:
                errors.append(f"MANIFEST_HASH_MISMATCH:{item['path']}")
            if path.stat().st_size != item["bytes"]:
                errors.append(f"MANIFEST_SIZE_MISMATCH:{item['path']}")
    output={
        "contract_id":EXPECTED["contract_id"],
        "verification_status":"FAIL" if errors else "PASS",
        "checks_executed":checks,
        "errors":errors,
        "primary_result_category":EXPECTED["primary_category"],
        "core_mutation_performed":False,
    }
    print(json.dumps(output,indent=2,sort_keys=True))
    return 1 if errors else 0

if __name__ == "__main__":
    raise SystemExit(main())
