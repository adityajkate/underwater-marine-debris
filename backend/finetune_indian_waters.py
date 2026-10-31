#!/usr/bin/env python3
"""
NirmalSagar — Underwater Marine Litter & Plastic Detection
State-of-the-Art Fine-Tuning Pipeline for Turbid & Domain-Shifted Waters

This script fine-tunes YOLO11s-seg from existing multi-domain weights (best.pt)
using high-resolution feature preservation (imgsz=1024), specialized underwater
chromatic augmentations, and AdamW optimization for robust debris segmentation.
"""

import os
import sys
from pathlib import Path
from ultralytics import YOLO

# ── 1. Path Configuration ───────────────────────────────────────────────────
# If running on Google Colab:
IN_COLAB = "google.colab" in sys.modules

if IN_COLAB:
    from google.colab import drive
    drive.mount("/content/drive", force_remount=False)
    DRIVE = Path("/content/drive/MyDrive/nirmalsagar")
    ROOT = Path("/content/nirmalsagar")
    # Base weights: Prioritize LODO-3 multi-domain, fallback to trashcan baseline
    LODO3_WEIGHTS = DRIVE / "runs/yolo11s_LODO-3_source_core3/weights/best.pt"
    BASELINE_WEIGHTS = DRIVE / "runs/yolo11s_trashcan_core3/weights/best.pt"
    BASE_CHECKPOINT = str(LODO3_WEIGHTS if LODO3_WEIGHTS.exists() else BASELINE_WEIGHTS)
    
    # Dataset config: joint_core3 (TrashCan + SeaClear + JAMSTEC) or LODO-3 source
    DATA_YAML = str(ROOT / "configs/joint.yaml" if (ROOT / "configs/joint.yaml").exists() else ROOT / "configs/LODO-3_source.yaml")
    PROJECT_DIR = str(DRIVE / "runs_finetuned")
else:
    # Local paths
    BASE_DIR = Path(__file__).resolve().parent
    BASE_CHECKPOINT = str(BASE_DIR / "runs/yolo11s_LODO-3_source_core3/weights/best.pt")
    DATA_YAML = str(BASE_DIR / "configs/LODO-3_source.yaml")
    PROJECT_DIR = str(BASE_DIR / "runs_finetuned")

# ── 2. Hyperparameter Configuration ──────────────────────────────────────────
# Optimized for 20-25 epoch fine-tuning on a single GPU (Tesla T4 or better)
FINETUNE_CONFIG = {
    "epochs": 25,              # 25 epochs is the sweet spot for fine-tuning without catastrophic forgetting
    "imgsz": 1024,             # High resolution: preserves fine bottle necks, labels, and small debris
    "batch": 8,                # Batch size 8 fits comfortably within 15GB Tesla T4 VRAM at 1024px
    "workers": 2,
    
    # Optimizer & Learning Rate (Warm-start: 10x lower lr than scratch training)
    "optimizer": "AdamW",      # AdamW converges faster with better gradient handling on segmentation masks
    "lr0": 0.001,              # Initial learning rate
    "lrf": 0.01,               # Final learning rate = lr0 * lrf (cosine decayed)
    "momentum": 0.937,
    "weight_decay": 0.001,     # L2 regularization to prevent overfitting to clear water artifacts
    "warmup_epochs": 2.0,
    "cos_lr": True,            # Cosine learning rate schedule
    
    # Underwater Domain-Shift & Turbidity Invariance Augmentations
    "hsv_h": 0.08,             # Heavy hue jitter: breaks "blue water = background" bias (simulates green/yellow silt)
    "hsv_s": 0.85,             # Saturation jitter: simulates severe silt-induced contrast loss
    "hsv_v": 0.65,             # Value jitter: simulates light absorption and illumination drop at depth
    "degrees": 15.0,           # Random rotation: handles arbitrary orientations of fallen seabed litter
    "translate": 0.1,          # Translation jitter
    "scale": 0.5,              # Multi-scale object scaling [0.5, 1.5]
    "shear": 2.0,
    "perspective": 0.0005,     # Perspective distortion simulating oblique camera/ROV viewing angles
    "fliplr": 0.5,             # Horizontal flips
    "flipud": 0.1,             # Subtle vertical flips for tumbling floating fragments
    "mosaic": 1.0,             # 4-image mosaic for context richness
    "close_mosaic": 5,         # Disable mosaic for last 5 epochs for clean segmentation boundary convergence
    "mixup": 0.20,             # Blends overlapping objects (critical for dense litter carpets)
    "copy_paste": 0.35,        # Copies segmented debris instances onto varied benthic floors
    
    # Loss Reweighting for Class Discrimination
    "box": 7.5,                # Bounding box regression loss weight
    "cls": 1.2,                # Boosted classification loss: fixes plastic sheet vs metal can confusion
    "dfl": 1.5,                # Distribution Focal Loss for bounding box uncertainty
    
    # Validation & Checkpointing
    "pretrained": True,        # Guarantees warm-start from the loaded weights
    "val": True,
    "save_period": 5,
    "patience": 15,            # Early stopping patience
    "amp": True,               # Mixed-precision FP16 training
    "retina_masks": True,      # High-resolution ground truth mask rasterization
    "seed": 42,
    "deterministic": True,
}


def run_finetuning():
    print("=" * 80)
    print("NirmalSagar YOLO11s-seg Non-Destructive Fine-Tuning Pipeline")
    print("=" * 80)
    print(f"[INPUT MODEL] Base Weights (Read-Only) : {BASE_CHECKPOINT}")
    print(f"[DATA CONFIG] Dataset YAML              : {DATA_YAML}")
    print(f"[DESTINATION] New Output Directory      : {PROJECT_DIR}")
    print(f"[RESOLUTION ] Training Resolution       : {FINETUNE_CONFIG['imgsz']}x{FINETUNE_CONFIG['imgsz']}")
    print(f"[SCHEDULE   ] Epochs                    : {FINETUNE_CONFIG['epochs']}")
    print(f"[OPTIMIZER  ] Optimizer                 : {FINETUNE_CONFIG['optimizer']} (lr0={FINETUNE_CONFIG['lr0']})")
    print("=" * 80)

    # 1. Verification of Base Weights
    base_path = Path(BASE_CHECKPOINT)
    if not base_path.exists():
        raise FileNotFoundError(
            f"ERROR: Base weights not found at '{BASE_CHECKPOINT}'. "
            "Please ensure your previous best.pt exists before running fine-tuning."
        )

    base_size_mb = base_path.stat().st_size / (1024 * 1024)
    print(f"Verified base weights file ({base_size_mb:.1f} MB) exists.")
    print("SAFETY GUARANTEE: Original baseline weights will NOT be modified or deleted.")
    print(f"All new training artifacts will be saved separately to: {PROJECT_DIR}\n")

    # 2. Warm-Start: Load the exact weights of the existing trained model
    print(f"Loading weights from {BASE_CHECKPOINT}...")
    model = YOLO(BASE_CHECKPOINT)
    print(f"SUCCESS: Loaded base model architecture (task: {model.task}, classes: {model.names})")
    print("Starting fine-tuning upon the existing learned features...\n")

    # 3. Execute targeted fine-tuning to a distinct destination folder
    results = model.train(
        data=DATA_YAML,
        project=PROJECT_DIR,
        name="yolo11s_core3_1024_finetuned",
        exist_ok=True,
        **FINETUNE_CONFIG,
    )

    best_weights = Path(PROJECT_DIR) / "yolo11s_core3_1024_finetuned/weights/best.pt"
    print("\n" + "=" * 80)
    print("FINE-TUNING COMPLETE!")
    print(f"New Fine-Tuned Weights Saved To: {best_weights}")
    print(f"Original Base Weights Unchanged At: {BASE_CHECKPOINT}")
    print("=" * 80)

    # 3. Post-training validation benchmark
    print("\nRunning post-finetune validation benchmark at native 1024 resolution...")
    val_results = model.val(
        data=DATA_YAML,
        imgsz=1024,
        batch=8,
        retina_masks=True,
        split="val",
    )
    print("Validation mAP50:", val_results.box.map50)
    print("Validation mAP50-95:", val_results.box.map)
    return results


if __name__ == "__main__":
    run_finetuning()
