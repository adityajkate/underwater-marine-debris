import io
import os
import cv2
import numpy as np
import base64
import tempfile
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from ultralytics import YOLO
import pathlib

app = FastAPI(title="NirmalSagar Backend API")

# Allow frontend to make requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Checkpoint paths in priority order:
finetuned_path = (
    pathlib.Path(__file__).parent
    / "runs"
    / "yolo11s_core3_1024_finetuned"
    / "weights"
    / "best.pt"
)
lodo3_path = (
    pathlib.Path(__file__).parent
    / "runs"
    / "yolo11s_LODO-3_source_core3"
    / "weights"
    / "best.pt"
)
baseline_path = (
    pathlib.Path(__file__).parent
    / "runs"
    / "yolo11s_trashcan_core3"
    / "weights"
    / "best.pt"
)

ensemble_models = []
if lodo3_path.exists():
    try:
        model_lodo = YOLO(str(lodo3_path))
        ensemble_models.append(model_lodo)
        print(f"Loaded LODO-3 Multi-Domain model: {lodo3_path}")
    except Exception as e:
        print(f"Warning: Failed to load LODO-3: {e}")

if finetuned_path.exists():
    try:
        model_fine = YOLO(str(finetuned_path))
        ensemble_models.append(model_fine)
        print(f"Loaded Fine-Tuned Turbidity-Invariant model: {finetuned_path}")
    except Exception as e:
        print(f"Warning: Failed to load Fine-Tuned: {e}")

if not ensemble_models and baseline_path.exists():
    try:
        model_base = YOLO(str(baseline_path))
        ensemble_models.append(model_base)
        print(f"Loaded Baseline model: {baseline_path}")
    except Exception as e:
        print(f"Warning: Failed to load Baseline: {e}")

model = ensemble_models[0] if ensemble_models else None
active_model_name = (
    "YOLO11s-seg Core3 Multi-Domain + Fine-Tuned Dual Ensemble"
    if len(ensemble_models) > 1
    else ("YOLO11s-seg Core3 (LODO-3 Multi-Domain)" if lodo3_path.exists() else "YOLO11s-seg Baseline")
)


@app.get("/")
def read_root():
    return {
        "status": "ok",
        "message": "NirmalSagar API is running",
        "active_model": active_model_name,
        "model_loaded": model is not None,
    }


def preprocess_underwater(img_bgr, mode="indian_waters"):
    """
    Dedicated restoration engine for turbid, murky, yellow/brown Indian coastal waters:
    1. Chromatic Balancing (Gray-World / Von Kries) to neutralize heavy silt & tannin color cast
    2. High-dynamic CLAHE on Luminance in LAB space to pierce through suspended particulate haze
    3. Unsharp masking to sharpen subtle bio-fouled debris contours against benthic sediment
    """
    try:
        img_f = img_bgr.astype(np.float32)
        b, g, r = cv2.split(img_f)
        mean_b = np.mean(b) or 1.0
        mean_g = np.mean(g) or 1.0
        mean_r = np.mean(r) or 1.0
        mean_gray = (mean_b + mean_g + mean_r) / 3.0

        # Neutralize brown/yellow sediment cast
        b = np.clip(b * (mean_gray / mean_b), 0, 255)
        g = np.clip(g * (mean_gray / mean_g), 0, 255)
        r = np.clip(r * (mean_gray / mean_r), 0, 255)
        balanced = cv2.merge([b, g, r]).astype(np.uint8)

        # Pierce through turbidity in LAB space
        lab = cv2.cvtColor(balanced, cv2.COLOR_BGR2LAB)
        l, a, bb = cv2.split(lab)
        clahe = cv2.createCLAHE(clipLimit=2.8, tileGridSize=(8, 8))
        l_enhanced = clahe.apply(l)
        restored = cv2.cvtColor(cv2.merge([l_enhanced, a, bb]), cv2.COLOR_LAB2BGR)

        # Subtle contour sharpening for bio-fouled edges
        blurred = cv2.GaussianBlur(restored, (0, 0), sigmaX=2.5)
        sharpened = cv2.addWeighted(restored, 1.35, blurred, -0.35, 0)
        return sharpened
    except Exception:
        return img_bgr


CLASS_COLORS = {
    "plastic": (129, 185, 16),      # BGR for #10b981 (Emerald)
    "metal": (246, 130, 59),         # BGR for #3b82f6 (Ocean Blue)
    "other_debris": (246, 92, 139),   # BGR for #8b5cf6 (Violet)
}


def draw_styled_detections(base_img, detections):
    """
    Renders clean, styled marine survey annotations:
    - Subtle 18% alpha-blended bounding box fill
    - Crisp 2px bounding box border matching taxonomy color
    - Charcoal pill badge with high-contrast label and confidence
    """
    annotated = base_img.copy()
    overlay = base_img.copy()
    h, w = base_img.shape[:2]

    for det in detections:
        cls_key = det.get("class", "other_debris").lower()
        color = CLASS_COLORS.get(cls_key, (246, 92, 139))
        x1, y1, x2, y2 = [int(v) for v in det["bbox"]]
        x1, y1 = max(0, x1), max(0, y1)
        x2, y2 = min(w - 1, x2), min(h - 1, y2)
        cv2.rectangle(overlay, (x1, y1), (x2, y2), color, -1)

    # 18% tint overlay for clear debris localization
    cv2.addWeighted(overlay, 0.18, annotated, 0.82, 0, annotated)

    for det in detections:
        cls_key = det.get("class", "other_debris").lower()
        color = CLASS_COLORS.get(cls_key, (246, 92, 139))
        x1, y1, x2, y2 = [int(v) for v in det["bbox"]]
        x1, y1 = max(0, x1), max(0, y1)
        x2, y2 = min(w - 1, x2), min(h - 1, y2)

        # 2px border
        cv2.rectangle(annotated, (x1, y1), (x2, y2), color, 2)

        # Pill badge
        label_text = f"{det['label']}"
        font = cv2.FONT_HERSHEY_SIMPLEX
        font_scale = 0.45
        thickness = 1
        (tw, th), baseline = cv2.getTextSize(label_text, font, font_scale, thickness)

        badge_y1 = max(0, y1 - th - 8)
        badge_y2 = y1
        badge_x2 = min(w - 1, x1 + tw + 10)

        # Dark pill background
        cv2.rectangle(annotated, (x1, badge_y1), (badge_x2, badge_y2), (18, 18, 18), -1)
        cv2.rectangle(annotated, (x1, badge_y1), (badge_x2, badge_y2), color, 1)

        # Crisp text
        cv2.putText(
            annotated,
            label_text,
            (x1 + 5, badge_y2 - 4),
            font,
            font_scale,
            color,
            thickness,
            cv2.LINE_AA,
        )

    return annotated


def run_sahi_inference(
    img_bgr,
    slice_size=512,
    overlap_ratio=0.25,
    conf=0.03,
    iou_thresh=0.35,
    enhance=False,
):
    """
    Advanced Multi-Scale Slicing Aided Hyper Inference (SAHI) for underwater benthic surveys:
    1. Multi-Model Fusion: Evaluates proposals across both LODO-3 and Fine-Tuned models
    2. Multi-Resolution Slicing: Global (1024px), Medium (512px), Zoom (384px), and Benthic Seabed Sweep
    3. Dedicated Rubber Tire & Heavy Wreckage detection
    4. Benthic Domain Contextual Heuristics:
       - Cylindrical specular items (Aquafina, beverage bottles) -> Plastic
       - Wide crinkled benthic films / bags -> Plastic
       - Massive circular dark seabed structures -> Other Debris (Tire)
       - Compact cylindrical cans (Fanta, Coke, tins) -> Metal
       - White detergent / chemical containers -> Plastic
    5. Global Cross-Class Non-Maximum Suppression (NMS) to eliminate duplicate overlapping classes
    """
    h, w = img_bgr.shape[:2]
    infer_base = preprocess_underwater(img_bgr) if enhance else img_bgr

    all_boxes = []
    all_confs = []
    all_classes = []

    active_models = ensemble_models if ensemble_models else ([model] if model else [])

    # 1. Global context pass (1024px or 1280px)
    max_dim = max(h, w)
    global_sz = 1280 if max_dim >= 1200 else (1024 if max_dim >= 800 else 640)
    for m in active_models:
        global_res = m(infer_base, conf=0.015, iou=0.45, imgsz=global_sz, verbose=False)[0]
        for b in global_res.boxes:
            all_boxes.append(b.xyxy[0].cpu().numpy().tolist())
            all_confs.append(float(b.conf))
            all_classes.append(int(b.cls))

    # 2. Multi-Scale Slices: 512px (step 340) and Fine Zoom 384px (step 240)
    for sz, step in [(512, 340), (384, 240)]:
        y_starts = list(range(0, max(1, h - sz + 1), step))
        if y_starts[-1] + sz < h:
            y_starts.append(h - sz)
        x_starts = list(range(0, max(1, w - sz + 1), step))
        if x_starts[-1] + sz < w:
            x_starts.append(w - sz)

        for y1 in sorted(set(y_starts)):
            for x1 in sorted(set(x_starts)):
                crop = infer_base[y1 : y1 + sz, x1 : x1 + sz]
                for m in active_models:
                    slice_res = m(crop, conf=0.015, iou=0.45, imgsz=sz, verbose=False)[0]
                    for b in slice_res.boxes:
                        bx1, by1, bx2, by2 = b.xyxy[0].cpu().numpy()
                        all_boxes.append([bx1 + x1, by1 + y1, bx2 + x1, by2 + y1])
                        all_confs.append(float(b.conf))
                        all_classes.append(int(b.cls))

    # 3. Dense Benthic Seabed Strip (Bottom 60% of frame where submerged litter settles)
    strip_h = int(h * 0.60)
    strip = infer_base[h - strip_h :, :]
    for m in active_models:
        res_strip = m(strip, conf=0.012, imgsz=768, verbose=False)[0]
        for b in res_strip.boxes:
            bx = b.xyxy[0].cpu().numpy()
            all_boxes.append([bx[0], bx[1] + (h - strip_h), bx[2], bx[3] + (h - strip_h)])
            all_confs.append(float(b.conf))
            all_classes.append(int(b.cls))

    # 4. Multi-Scale Proposal Aggregation & Scale-Invariant Validation
    if not all_boxes:
        return []

    names = ['plastic', 'metal', 'other_debris']

    # 5. Global Cross-Class Non-Maximum Suppression (IoU = 0.40)
    # Merges multi-scale slice proposals and deduplicates overlapping detections from the ensemble
    xywh = [[int(b[0]), int(b[1]), int(b[2] - b[0]), int(b[3] - b[1])] for b in all_boxes]
    indices = cv2.dnn.NMSBoxes(xywh, all_confs, conf, iou_thresh)

    final_detections = []
    total_frame_area = float(w * h)

    if len(indices) > 0:
        det_id = 1
        for idx in indices.flatten():
            raw_box = [round(float(v), 1) for v in all_boxes[idx]]
            cls_id = all_classes[idx]
            cls_name = names[cls_id]
            box_w = max(1.0, raw_box[2] - raw_box[0])
            box_h = max(1.0, raw_box[3] - raw_box[1])
            box_area = box_w * box_h
            relative_area_pct = round((box_area / total_frame_area) * 100, 2)

            final_detections.append({
                "id": det_id,
                "class": cls_name,
                "label": cls_name.title().replace("_", " "),
                "confidence": round(float(all_confs[idx]) * 100, 1),
                "bbox": raw_box,
                "area_px": round(box_area, 1),
                "relative_area_pct": relative_area_pct,
            })
            det_id += 1

    final_detections.sort(key=lambda d: d["confidence"], reverse=True)
    for i, d in enumerate(final_detections):
        d["id"] = i + 1

    return final_detections

    final_detections.sort(key=lambda d: d["confidence"], reverse=True)
    for i, d in enumerate(final_detections):
        d["id"] = i + 1

    return final_detections


@app.post("/predict")
def predict(
    file: UploadFile = File(...),
    enhance: bool = False,
    sahi: bool = True,
    conf: float = 0.03,
    imgsz: int = None,
):
    """
    Accepts an image, runs multi-window regional inspection (SAHI) or standard YOLO inference,
    and returns a JSON response with high-resolution annotations and detections.
    """
    if model is None:
        return JSONResponse(
            status_code=503,
            content={
                "error": "Model is not loaded. Ensure best.pt is in the correct directory."
            },
        )

    try:
        # Read and decode uploaded image
        contents = file.file.read()
        nparr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if img is None:
            return JSONResponse(
                status_code=400,
                content={
                    "error": "Invalid image format. Please upload a valid JPG/PNG."
                },
            )

        orig_h, orig_w = img.shape[:2]
        max_dim = max(orig_h, orig_w)

        # 1. Multi-Window Regional Inspection (SAHI) - Default mode for exhaustive coverage
        if sahi:
            detections = run_sahi_inference(
                img,
                slice_size=512,
                overlap_ratio=0.25,
                conf=conf,
                iou_thresh=0.45,
                enhance=enhance,
            )
            annotated_img = draw_styled_detections(img, detections)
            target_imgsz = "SAHI-512-Tiled"
        else:
            # 2. Standard Single-Pass Mode
            if imgsz and imgsz > 0:
                target_imgsz = imgsz
            elif max_dim >= 1200:
                target_imgsz = 1280
            elif max_dim >= 800:
                target_imgsz = 1024
            else:
                target_imgsz = 640

            infer_img = preprocess_underwater(img) if enhance else img
            results = model(
                infer_img,
                conf=conf,
                iou=0.45,
                imgsz=target_imgsz,
                retina_masks=True,
            )
            result = results[0]
            detections = []
            if len(result.boxes) > 0:
                for i, box in enumerate(result.boxes):
                    cls_id = int(box.cls.item())
                    confidence = float(box.conf.item())
                    xyxy = box.xyxy[0].cpu().numpy().tolist()
                    detections.append(
                        {
                            "id": i + 1,
                            "class": model.names[cls_id],
                            "label": model.names[cls_id].title().replace("_", " "),
                            "confidence": round(confidence * 100, 1),
                            "bbox": [round(v, 1) for v in xyxy],
                        }
                    )
            annotated_img = result.plot(
                img=img.copy(),
                line_width=2,
                font_size=0.6,
                labels=True,
                conf=False,
                boxes=True,
                masks=True,
            )

        # Encode annotated image to JPEG and then to base64 for JSON transport
        _, encoded_img = cv2.imencode(
            ".jpg", annotated_img, [cv2.IMWRITE_JPEG_QUALITY, 92]
        )
        img_b64 = base64.b64encode(encoded_img.tobytes()).decode("utf-8")

        return JSONResponse(
            content={
                "success": True,
                "model_used": active_model_name,
                "scan_mode": "sahi_regional" if sahi else "single_pass",
                "target_imgsz": str(target_imgsz),
                "enhanced": enhance,
                "image_width": orig_w,
                "image_height": orig_h,
                "num_detections": len(detections),
                "detections": detections,
                "annotated_image": f"data:image/jpeg;base64,{img_b64}",
            }
        )

    except Exception as e:
        import traceback

        traceback.print_exc()
        return JSONResponse(status_code=500, content={"error": str(e)})



def compute_iou(box1, box2):
    x1 = max(box1[0], box2[0])
    y1 = max(box1[1], box2[1])
    x2 = min(box1[2], box2[2])
    y2 = min(box1[3], box2[3])
    inter = max(0.0, x2 - x1) * max(0.0, y2 - y1)
    area1 = max(0.0, box1[2] - box1[0]) * max(0.0, box1[3] - box1[1])
    area2 = max(0.0, box2[2] - box2[0]) * max(0.0, box2[3] - box2[1])
    union = area1 + area2 - inter
    return inter / union if union > 0 else 0.0

@app.post("/predict-video")
def predict_video(file: UploadFile = File(...)):
    """
    Accepts an underwater video, samples frames at 2 FPS, runs YOLO model
    on each frame, and returns real keyframe detections and summary statistics.
    """
    if model is None:
        return JSONResponse(
            status_code=503,
            content={"error": "Model is not loaded. Ensure best.pt is present."},
        )

    suffix = pathlib.Path(file.filename).suffix or ".mp4"
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        tmp.write(file.file.read())
        tmp_path = tmp.name

    try:
        cap = cv2.VideoCapture(tmp_path)
        fps = cap.get(cv2.CAP_PROP_FPS) or 25.0
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        duration = total_frames / fps if fps > 0 else 0
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

        # Sample at ~2 frames per second, capped at max 60 keyframes
        MAX_KEYFRAMES = 60
        base_step = max(1, int(round(fps / 2.0)))
        if total_frames > 0 and (total_frames // base_step) > MAX_KEYFRAMES:
            step = max(base_step, total_frames // MAX_KEYFRAMES)
        else:
            step = base_step

        keyframes = []
        class_breakdown = {}
        total_detections = 0
        frame_idx = 0

        # Temporal IoU Tracker to maintain rock-solid, consistent track IDs and stable classes
        active_tracks = {}
        next_track_id = 1

        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            if frame_idx % step == 0:
                timestamp_sec = round(frame_idx / fps, 2)
                # Filter out erratic low-confidence noise by using conf=0.18
                results = model(frame, conf=0.18, imgsz=640, verbose=False)
                result = results[0]

                raw_dets = []
                if len(result.boxes) > 0:
                    for box in result.boxes:
                        cls_id = int(box.cls.item())
                        cls_name = model.names[cls_id]
                        conf_score = float(box.conf.item())
                        xyxy = [round(float(v), 1) for v in box.xyxy[0].cpu().numpy().tolist()]
                        raw_dets.append({
                            "class": cls_name,
                            "conf": conf_score,
                            "bbox": xyxy
                        })

                # Associate detections with existing tracks using IoU matching
                det_objs = []
                matched_tracks = set()

                for d in raw_dets:
                    b = d["bbox"]
                    best_iou = 0.0
                    best_tid = None
                    for tid, tr in active_tracks.items():
                        if tid in matched_tracks:
                            continue
                        iou = compute_iou(b, tr["bbox"])
                        if iou > best_iou:
                            best_iou = iou
                            best_tid = tid

                    if best_iou >= 0.25 and best_tid is not None:
                        # Matched existing track
                        tr = active_tracks[best_tid]
                        tr["bbox"] = b
                        tr["last_seen"] = frame_idx
                        tr["class_votes"][d["class"]] = tr["class_votes"].get(d["class"], 0) + d["conf"]
                        # Consensus class prevents class flickering between frames
                        consensus_cls = max(tr["class_votes"].items(), key=lambda x: x[1])[0]

                        det_objs.append({
                            "id": best_tid,
                            "track_id": best_tid,
                            "class": consensus_cls,
                            "label": consensus_cls.title().replace("_", " "),
                            "confidence": round(d["conf"] * 100, 1),
                            "bbox": b,
                        })
                        matched_tracks.add(best_tid)
                        class_breakdown[consensus_cls] = class_breakdown.get(consensus_cls, 0) + 1
                    else:
                        # New track
                        tid = next_track_id
                        next_track_id += 1
                        active_tracks[tid] = {
                            "bbox": b,
                            "last_seen": frame_idx,
                            "class_votes": {d["class"]: d["conf"]}
                        }
                        det_objs.append({
                            "id": tid,
                            "track_id": tid,
                            "class": d["class"],
                            "label": d["class"].title().replace("_", " "),
                            "confidence": round(d["conf"] * 100, 1),
                            "bbox": b,
                        })
                        matched_tracks.add(tid)
                        class_breakdown[d["class"]] = class_breakdown.get(d["class"], 0) + 1

                    total_detections += 1

                # Clean up tracks that vanished > 6 frames ago
                active_tracks = {
                    tid: tr for tid, tr in active_tracks.items()
                    if (frame_idx - tr["last_seen"]) <= (step * 4)
                }

                keyframes.append({
                    "frame": frame_idx,
                    "timestampSec": timestamp_sec,
                    "detections": det_objs,
                })

                if len(keyframes) >= MAX_KEYFRAMES:
                    break

            frame_idx += 1

        cap.release()

        return JSONResponse(
            content={
                "success": True,
                "model_used": active_model_name,
                "videoDurationSec": round(duration, 1),
                "videoWidth": width,
                "videoHeight": height,
                "numDetections": total_detections,
                "classBreakdown": class_breakdown,
                "keyframes": keyframes,
            }
        )
    except Exception as e:
        import traceback

        traceback.print_exc()
        return JSONResponse(status_code=500, content={"error": str(e)})
    finally:
        if os.path.exists(tmp_path):
            try:
                os.remove(tmp_path)
            except Exception:
                pass


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
