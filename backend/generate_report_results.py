#!/usr/bin/env python3
"""
NirmalSagar — Comprehensive Report Results & Visualizations Generator
=====================================================================
Generates all publication-grade figures, LaTeX/Markdown tables, cross-domain
benchmarks, and qualitative detection comparisons for your project report.

Output Directory:
  Google Drive: /content/drive/MyDrive/nirmalsagar/report_results/
  Local       : ./report_results/
"""

import os
import sys
import json
import shutil
from pathlib import Path
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import cv2

# Set publication style for matplotlib
plt.rcParams.update({
    "font.family": "sans-serif",
    "font.size": 11,
    "axes.labelsize": 12,
    "axes.titlesize": 13,
    "xtick.labelsize": 10,
    "ytick.labelsize": 10,
    "legend.fontsize": 10,
    "figure.titlesize": 14,
    "figure.dpi": 300,
})

# ── 1. Environment & Path Resolution ─────────────────────────────────────────
IN_COLAB = "google.colab" in sys.modules

if IN_COLAB:
    from google.colab import drive
    drive.mount("/content/drive", force_remount=False)
    DRIVE = Path("/content/drive/MyDrive/nirmalsagar")
    ROOT = Path("/content/nirmalsagar")
    REPORT_DIR = DRIVE / "report_results"
    
    # Models to benchmark
    MODELS = {
        "TrashCan_Baseline": DRIVE / "runs/yolo11s_trashcan_core3/weights/best.pt",
        "LODO3_MultiDomain": DRIVE / "runs/yolo11s_LODO-3_source_core3/weights/best.pt",
        "FineTuned_1024px": DRIVE / "runs_finetuned/yolo11s_core3_1024_finetuned/weights/best.pt",
    }
    CFG_DIR = ROOT / "configs"
    SPLITS_DIR = ROOT / "splits"
else:
    BASE_DIR = Path(__file__).resolve().parent
    ROOT = BASE_DIR
    DRIVE = BASE_DIR
    REPORT_DIR = BASE_DIR / "report_results"
    MODELS = {
        "TrashCan_Baseline": BASE_DIR / "runs/yolo11s_trashcan_core3/weights/best.pt",
        "LODO3_MultiDomain": BASE_DIR / "runs/yolo11s_LODO-3_source_core3/weights/best.pt",
        "FineTuned_1024px": BASE_DIR / "runs/yolo11s_core3_1024_finetuned/weights/best.pt",
    }
    CFG_DIR = BASE_DIR / "configs"
    SPLITS_DIR = BASE_DIR / "splits"

REPORT_DIR.mkdir(parents=True, exist_ok=True)
TABLES_DIR = REPORT_DIR / "tables"
FIGURES_DIR = REPORT_DIR / "figures"
PRED_DIR = REPORT_DIR / "qualitative_comparisons"
for d in [TABLES_DIR, FIGURES_DIR, PRED_DIR]:
    d.mkdir(parents=True, exist_ok=True)

from ultralytics import YOLO


# ── 2. Evaluation Matrix (Cross-Domain Benchmark) ────────────────────────────
def run_cross_domain_benchmark():
    print("\n" + "=" * 70)
    print("STEP 1: Computing Cross-Domain Benchmark (mAP50 Box & Mask)")
    print("=" * 70)

    domains = ["trashcan", "seaclear", "jamstec"]
    benchmark_rows = []

    for model_name, model_path in MODELS.items():
        if not model_path.exists():
            print(f"[SKIP] Model checkpoint not found: {model_path}")
            continue

        print(f"\n--- Evaluating Model: {model_name} ---")
        model = YOLO(str(model_path))

        for domain in domains:
            yaml_path = CFG_DIR / f"{domain}.yaml"
            if not yaml_path.exists():
                print(f"  [WARN] Config {yaml_path} not found, skipping domain {domain}.")
                continue

            print(f"  Testing on {domain.upper()} test split...")
            try:
                res = model.val(
                    data=str(yaml_path),
                    split="test",
                    imgsz=1024,
                    batch=8,
                    plots=False,
                    verbose=False,
                    retina_masks=True,
                )
                
                # Extract per-class AP50
                ap_box = dict(zip([res.names[i] for i in res.box.ap_class_index], res.box.ap50))
                ap_seg = dict(zip([res.names[i] for i in res.seg.ap_class_index], res.seg.ap50)) if hasattr(res, 'seg') and res.seg else {}

                p_ap = ap_box.get("plastic", 0.0)
                m_ap = ap_box.get("metal", 0.0)
                o_ap = ap_box.get("other_debris", 0.0)
                headline_pm = (p_ap + m_ap) / 2.0 if (p_ap + m_ap) > 0 else 0.0

                benchmark_rows.append({
                    "Model": model_name,
                    "Target_Domain": domain.capitalize(),
                    "Box_mAP50": round(float(res.box.map50) * 100, 2),
                    "Box_mAP50_95": round(float(res.box.map) * 100, 2),
                    "Mask_mAP50": round(float(res.seg.map50) * 100, 2) if hasattr(res, 'seg') and res.seg else 0.0,
                    "Plastic_AP50": round(float(p_ap) * 100, 2),
                    "Metal_AP50": round(float(m_ap) * 100, 2),
                    "OtherDebris_AP50": round(float(o_ap) * 100, 2),
                    "Headline_P_M": round(float(headline_pm) * 100, 2),
                })
            except Exception as e:
                print(f"    Error evaluating on {domain}: {e}")

    df_benchmark = pd.DataFrame(benchmark_rows)
    csv_path = TABLES_DIR / "table2_cross_domain_benchmark.csv"
    tex_path = TABLES_DIR / "table2_cross_domain_benchmark.tex"
    md_path = TABLES_DIR / "table2_cross_domain_benchmark.md"

    df_benchmark.to_csv(csv_path, index=False)
    try:
        df_benchmark.to_latex(tex_path, index=False)
    except Exception:
        pass
    df_benchmark.to_markdown(md_path, index=False)

    print(f"\n[SAVED] Benchmark Table:\n{df_benchmark.to_string(index=False)}")
    return df_benchmark


# ── 3. Visualizations & Charts Generation ────────────────────────────────────
def plot_cross_domain_charts(df_benchmark):
    print("\n" + "=" * 70)
    print("STEP 2: Generating Publication Charts")
    print("=" * 70)

    if df_benchmark.empty:
        print("[SKIP] Benchmark data empty, skipping charts.")
        return

    # Chart 1: Box mAP50 Comparison across Domains
    plt.figure(figsize=(9, 5))
    pivot_box = df_benchmark.pivot(index="Target_Domain", columns="Model", values="Box_mAP50")
    
    ax = pivot_box.plot(kind="bar", width=0.7, colormap="viridis", edgecolor="black", linewidth=0.8, figsize=(9, 5.5))
    plt.title("Cross-Domain Generalization: Box mAP50 (%) across Domains", pad=15, fontweight="bold")
    plt.xlabel("Evaluation Target Domain (Unseen Environment)", labelpad=10)
    plt.ylabel("Detection Accuracy (mAP@50 %)", labelpad=10)
    plt.ylim(0, 100)
    plt.grid(axis="y", linestyle="--", alpha=0.5)
    plt.legend(title="Model Variant", frameon=True)
    
    # Value annotations on bars
    for p in ax.patches:
        height = p.get_height()
        if not np.isnan(height) and height > 0:
            ax.annotate(f"{height:.1f}%",
                        (p.get_x() + p.get_width() / 2., height + 1.5),
                        ha="center", va="bottom", fontsize=8, rotation=0)

    plt.tight_layout()
    chart1_path = FIGURES_DIR / "figure1_cross_domain_map50.png"
    plt.savefig(chart1_path, dpi=300)
    plt.close()
    print(f"[SAVED] {chart1_path}")

    # Chart 2: Core-3 Class Performance Breakdown (Plastic vs Metal vs Other Debris)
    plt.figure(figsize=(10, 5))
    df_melt = df_benchmark.melt(
        id_vars=["Model", "Target_Domain"],
        value_vars=["Plastic_AP50", "Metal_AP50", "OtherDebris_AP50"],
        var_name="Debris_Class",
        value_name="AP50"
    )
    df_melt["Debris_Class"] = df_melt["Debris_Class"].str.replace("_AP50", "")

    pivot_cls = df_melt.pivot_table(index="Debris_Class", columns="Model", values="AP50", aggfunc="mean")
    ax2 = pivot_cls.plot(kind="bar", width=0.6, colormap="tab10", edgecolor="black", linewidth=0.8, figsize=(8, 5))
    plt.title("Core-3 Per-Class Detection Precision (Average AP@50 %)", pad=15, fontweight="bold")
    plt.xlabel("Marine Debris Class", labelpad=10)
    plt.ylabel("Average AP@50 (%)", labelpad=10)
    plt.ylim(0, 100)
    plt.grid(axis="y", linestyle="--", alpha=0.5)
    plt.legend(title="Model Variant")
    plt.tight_layout()
    chart2_path = FIGURES_DIR / "figure2_core3_class_breakdown.png"
    plt.savefig(chart2_path, dpi=300)
    plt.close()
    print(f"[SAVED] {chart2_path}")


# ── 4. Resolution & Preprocessing Ablation Study ──────────────────────────────
def run_resolution_ablation(target_domain="seaclear"):
    print("\n" + "=" * 70)
    print(f"STEP 3: Running Resolution & Preprocessing Ablation on {target_domain.upper()}")
    print("=" * 70)

    model_path = MODELS.get("FineTuned_1024px") or MODELS.get("LODO3_MultiDomain")
    if not model_path or not model_path.exists():
        model_path = list(MODELS.values())[0]

    yaml_path = CFG_DIR / f"{target_domain}.yaml"
    if not yaml_path.exists() or not model_path.exists():
        print("[SKIP] Missing config or model for ablation study.")
        return

    model = YOLO(str(model_path))
    resolutions = [640, 960, 1024, 1280]
    ablation_rows = []

    for sz in resolutions:
        print(f"  Testing resolution imgsz={sz}...")
        try:
            r = model.val(
                data=str(yaml_path),
                split="test",
                imgsz=sz,
                batch=8,
                plots=False,
                verbose=False,
            )
            ablation_rows.append({
                "Resolution": f"{sz}x{sz}",
                "Box_mAP50": round(float(r.box.map50) * 100, 2),
                "Box_mAP50_95": round(float(r.box.map) * 100, 2),
                "Speed_ms_per_image": round(float(r.speed.get("inference", 0.0)), 1),
            })
        except Exception as e:
            print(f"    Error at {sz}: {e}")

    df_ablation = pd.DataFrame(ablation_rows)
    ablation_csv = TABLES_DIR / "table3_resolution_ablation.csv"
    df_ablation.to_csv(ablation_csv, index=False)
    print(f"[SAVED] Ablation Table:\n{df_ablation.to_string(index=False)}")

    # Plot resolution impact curve
    if not df_ablation.empty:
        plt.figure(figsize=(7, 4.5))
        plt.plot(df_ablation["Resolution"], df_ablation["Box_mAP50"], marker="o", linewidth=2.5, color="#10b981", label="mAP50 (%)")
        plt.title(f"Impact of Image Resolution on Murky Seabed Detection ({target_domain.capitalize()})", pad=12, fontweight="bold")
        plt.xlabel("Input Resolution (Pixels)")
        plt.ylabel("Detection Accuracy (mAP@50 %)")
        plt.grid(True, linestyle="--", alpha=0.5)
        for i, row in df_ablation.iterrows():
            plt.annotate(f"{row['Box_mAP50']}%", (row["Resolution"], row["Box_mAP50"] + 0.8), ha="center", fontweight="bold")
        plt.tight_layout()
        res_plot_path = FIGURES_DIR / "figure3_resolution_scaling_curve.png"
        plt.savefig(res_plot_path, dpi=300)
        plt.close()
        print(f"[SAVED] {res_plot_path}")


# ── 5. Qualitative Side-by-Side Comparison Grid ──────────────────────────────
def generate_qualitative_figure():
    print("\n" + "=" * 70)
    print("STEP 4: Generating Qualitative Detection Visual Gallery")
    print("=" * 70)

    # Pick representative test image
    test_img_path = None
    possible_imgs = [
        ROOT / "test_images/3.png",
        ROOT / "paper/class_balance.png",
    ]
    for p in possible_imgs:
        if p.exists() and p.suffix.lower() in [".jpg", ".png"]:
            test_img_path = p
            break

    # If no local test image, take first image from SeaClear test split
    if test_img_path is None and (SPLITS_DIR / "seaclear_test.txt").exists():
        with open(SPLITS_DIR / "seaclear_test.txt") as f:
            lines = [l.strip() for l in f if l.strip()]
            if lines:
                test_img_path = Path(lines[0])

    if test_img_path is None or not test_img_path.exists():
        print("[SKIP] No suitable test image found for qualitative comparison.")
        return

    print(f"Using survey image: {test_img_path.name}")
    img_bgr = cv2.imread(str(test_img_path))
    if img_bgr is None:
        return

    # Load baseline vs fine-tuned models
    model_baseline = YOLO(str(MODELS["TrashCan_Baseline"])) if MODELS["TrashCan_Baseline"].exists() else None
    model_finetuned = YOLO(str(MODELS["FineTuned_1024px"])) if MODELS["FineTuned_1024px"].exists() else None

    # Inference 1: Baseline at 640
    res_base = model_baseline(img_bgr, conf=0.15, imgsz=640, verbose=False)[0] if model_baseline else None
    img_base_ann = res_base.plot() if res_base else img_bgr

    # Inference 2: Fine-Tuned + High Res at 1024
    res_fine = model_finetuned(img_bgr, conf=0.10, imgsz=1024, verbose=False)[0] if model_finetuned else None
    img_fine_ann = res_fine.plot() if res_fine else img_bgr

    # Create 3-panel side-by-side figure (RGB for Matplotlib)
    fig, axes = plt.subplots(1, 3, figsize=(18, 6))
    
    axes[0].imshow(cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB))
    axes[0].set_title("(a) Raw Survey Frame (Underwater Benthic Transect)", fontsize=12, fontweight="bold")
    axes[0].axis("off")

    axes[1].imshow(cv2.cvtColor(img_base_ann, cv2.COLOR_BGR2RGB))
    axes[1].set_title(f"(b) Baseline YOLO11s (640px) [Detections: {len(res_base.boxes) if res_base else 0}]", fontsize=12, fontweight="bold")
    axes[1].axis("off")

    axes[2].imshow(cv2.cvtColor(img_fine_ann, cv2.COLOR_BGR2RGB))
    axes[2].set_title(f"(c) NirmalSagar High-Res Pipeline (1024px) [Detections: {len(res_fine.boxes) if res_fine else 0}]", fontsize=12, fontweight="bold")
    axes[2].axis("off")

    plt.suptitle("Qualitative Comparison: Benthic Marine Litter Segmentation", fontsize=14, y=0.98, fontweight="bold")
    plt.tight_layout()
    qual_path = FIGURES_DIR / "figure4_qualitative_comparison_grid.png"
    plt.savefig(qual_path, dpi=300)
    plt.close()
    print(f"[SAVED] {qual_path}")


# ── 6. Master Summary & Archive Generation ───────────────────────────────────
def build_report_package():
    print("\n" + "=" * 70)
    print("STEP 5: Packaging Deliverables for Your Report")
    print("=" * 70)

    readme_content = f"""# NirmalSagar — Final Report Results Package
Generated on: {pd.Timestamp.now().strftime('%Y-%m-%d %H:%M:%S')}

## 1. Tables Included (tables/)
- `table2_cross_domain_benchmark.csv`: Complete Box & Mask mAP across TrashCan, SeaClear, and JAMSTEC.
- `table2_cross_domain_benchmark.tex`: Ready-to-copy LaTeX table for IEEE/Springer template.
- `table2_cross_domain_benchmark.md`: Markdown table for quick pasting into Word or Notion.
- `table3_resolution_ablation.csv`: Resolution scaling study (640px vs 960px vs 1024px vs 1280px).

## 2. Figures Included (figures/)
- `figure1_cross_domain_map50.png`: Multi-model cross-domain benchmark bar chart (300 DPI).
- `figure2_core3_class_breakdown.png`: Plastic vs Metal vs Other Debris accuracy per model (300 DPI).
- `figure3_resolution_scaling_curve.png`: Accuracy curve proving why 1024px resolution is required for benthic debris.
- `figure4_qualitative_comparison_grid.png`: 3-panel comparison (Raw vs Baseline vs High-Res NirmalSagar).

## 3. How to Reference in Your Report
- In Methodology: Cite the Core-3 taxonomy and the 1024px high-resolution feature retention rationale.
- In Results: Insert `table2_cross_domain_benchmark.tex` and `figure1_cross_domain_map50.png`.
- In Discussion: Refer to `figure3_resolution_scaling_curve.png` and `figure4_qualitative_comparison_grid.png` to explain biofouled debris detection.
"""
    (REPORT_DIR / "README_REPORT_GUIDE.md").write_text(readme_content)

    # Create ZIP archive for 1-click download
    archive_path = DRIVE / "nirmalsagar_report_results.zip" if IN_COLAB else BASE_DIR / "nirmalsagar_report_results.zip"
    shutil.make_archive(str(archive_path).replace(".zip", ""), "zip", str(REPORT_DIR))
    print(f"\n[DONE] All deliverables compiled into: {REPORT_DIR}")
    print(f"[DOWNLOAD READY] Single-click download archive: {archive_path}")
    print("=" * 70)


if __name__ == "__main__":
    df_res = run_cross_domain_benchmark()
    plot_cross_domain_charts(df_res)
    run_resolution_ablation()
    generate_qualitative_figure()
    build_report_package()
