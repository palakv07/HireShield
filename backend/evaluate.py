import json
import os
import sys
from datetime import datetime, timezone

# Add current backend folder to sys.path so modules resolve
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from detection.engine import analyze_recruitment_post


def run_evaluation():
    data_path = os.path.join(os.path.dirname(__file__), "tests", "data", "evaluation_dataset.json")
    if not os.path.exists(data_path):
        print(f"Error: Dataset not found at {data_path}")
        return None

    with open(data_path, "r", encoding="utf-8") as f:
        dataset = json.load(f)

    total_samples = len(dataset)
    scam_samples = [d for d in dataset if d["is_scam"]]
    legit_samples = [d for d in dataset if not d["is_scam"]]

    detected_scams = 0
    scam_results = []
    for s in scam_samples:
        result = analyze_recruitment_post(text=s.get("text"), url=s.get("url"))
        detected = result["risk_level"] in ("HIGH", "MEDIUM")
        if detected:
            detected_scams += 1
        scam_results.append({
            "id": s["id"],
            "expected_min": s.get("expected_min_risk"),
            "got_risk": result["risk_level"],
            "score": result["score"],
            "detected": detected,
            "flags_count": len(result["flags"]),
        })

    false_positives = 0
    legit_results = []
    for l in legit_samples:
        result = analyze_recruitment_post(text=l.get("text"), url=l.get("url"))
        is_fp = result["risk_level"] in ("HIGH", "MEDIUM")
        if is_fp:
            false_positives += 1
        legit_results.append({
            "id": l["id"],
            "got_risk": result["risk_level"],
            "score": result["score"],
            "is_fp": is_fp,
        })

    detection_rate = round((detected_scams / len(scam_samples)) * 100, 1) if scam_samples else 0.0
    fp_rate = round((false_positives / len(legit_samples)) * 100, 1) if legit_samples else 0.0

    metrics = {
        "detection_rate": detection_rate,
        "false_positive_rate": fp_rate,
        "samples_count": total_samples,
        "scam_samples": len(scam_samples),
        "legitimate_samples": len(legit_samples),
        "detected_scams": detected_scams,
        "false_positives": false_positives,
        "evaluated_at": datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC"),
    }

    out_path = os.path.join(os.path.dirname(__file__), "evaluation_results.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(metrics, f, indent=2)

    print("=" * 60)
    print("HIRESHIELD BENCHMARK EVALUATION RESULTS")
    print("=" * 60)
    print(f"Total Evaluated Samples : {total_samples}")
    print(f"Scam / Planted Samples  : {len(scam_samples)}")
    print(f"Legitimate Samples      : {len(legit_samples)}")
    print(f"Planted-Flag Detection  : {detected_scams}/{len(scam_samples)} ({detection_rate}%)")
    print(f"False-Positive Rate     : {false_positives}/{len(legit_samples)} ({fp_rate}%)")
    print(f"Timestamp               : {metrics['evaluated_at']}")
    print(f"Results written to      : {out_path}")
    print("=" * 60)

    return metrics


if __name__ == "__main__":
    run_evaluation()
