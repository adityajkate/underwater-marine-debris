/**
 * NirmalSagar — Underwater Marine Litter & Plastic Detection
 * Central Inference Service & Model Abstraction Layer
 *
 * This service abstracts the inference pipeline behind a single provider interface:
 * - When DEMO_MODE is true: a local fallback inference provider returns structured
 *   detections and a canvas-rendered annotated image (fully offline, no network).
 * - When DEMO_MODE is false: requests are sent to the FastAPI backend
 *   (http://localhost:8000/predict) and the response is normalized into an
 *   identical data structure.
 *
 * Swapping the fallback provider for the real YOLO provider requires no changes
 * in the consuming components — the returned shape is always the same.
 */

import APP_CONFIG from '../config/appConfig';

/**
 * Normalizes detection result into standard NirmalSagar format
 */
export function normalizeDetectionResult(rawResult, isDemo = false, fallbackFilename = 'Survey_Image.jpg') {
  const detections = (rawResult.detections || []).map((det, index) => {
    // Standardize class name
    let className = (det.class || det.class_name || 'plastic').toLowerCase();
    if (className === 'net' || className === 'fishing_gear') className = 'gear';
    if (className === 'bottle' || className === 'polymer') className = 'plastic';

    const taxonomyMeta = APP_CONFIG.TAXONOMY[className] || APP_CONFIG.TAXONOMY.other;

    // Standardize confidence to 0-100 percentage
    let confidence = det.confidence ?? 85.0;
    if (confidence <= 1.0) {
      confidence = Math.round(confidence * 1000) / 10;
    } else {
      confidence = Math.round(confidence * 10) / 10;
    }

    // Standardize bounding box [x, y, width, height]
    let bbox = det.bbox || det.box || [50 + index * 40, 50 + index * 30, 120, 100];

    return {
      id: det.id || index + 1,
      class: className,
      classLabel: taxonomyMeta.label,
      shortLabel: taxonomyMeta.shortLabel,
      color: taxonomyMeta.color,
      confidence,
      bbox,
      area: det.area || 0.15,
      threatLevel: taxonomyMeta.threatLevel,
    };
  });

  // Calculate aggregated class breakdown
  const classBreakdown = detections.reduce((acc, d) => {
    acc[d.class] = (acc[d.class] || 0) + 1;
    return acc;
  }, {});

  // Format annotated image URL
  let annotatedImageUrl = rawResult.annotatedImage || rawResult.annotated_image;
  if (annotatedImageUrl && !annotatedImageUrl.startsWith('data:') && !annotatedImageUrl.startsWith('http') && !annotatedImageUrl.startsWith('/')) {
    annotatedImageUrl = `data:image/jpeg;base64,${annotatedImageUrl}`;
  }

  const numDetections = rawResult.num_detections ?? rawResult.numDetections ?? detections.length;

  return {
    success: true,
    mode: isDemo ? 'demo' : 'real',
    isDemo,
    numDetections,
    detections,
    annotatedImage: annotatedImageUrl || rawResult.originalImage || rawResult.previewUrl || null,
    originalImage: rawResult.originalImage || rawResult.previewUrl || null,
    durationMs: rawResult.durationMs || rawResult.processing_time_ms || 1200,
    classBreakdown,
    filename: rawResult.filename || fallbackFilename,
    timestamp: rawResult.timestamp || new Date().toLocaleString(),
    notice: isDemo ? APP_CONFIG.NOTICES.DETECTION : null,
    rawJson: rawResult,
  };
}

/**
 * Draw bounding boxes onto an HTML5 canvas for realistic visual demo output
 */
async function drawDemoAnnotationsOnImage(imageSource, detections) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || 800;
      canvas.height = img.naturalHeight || 600;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(typeof imageSource === 'string' ? imageSource : null);
        return;
      }

      // 1. Draw base image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const w = canvas.width;
      const h = canvas.height;

      // 2. Draw each detection bounding box and tag
      detections.forEach((det) => {
        const taxonomy = APP_CONFIG.TAXONOMY[det.class] || APP_CONFIG.TAXONOMY.plastic;
        const color = taxonomy.color || '#10b981';

        // Scale bounding box if relative, or clamp to canvas
        let [bx, by, bw, bh] = det.bbox;
        if (bx <= 1 && by <= 1 && bw <= 1 && bh <= 1) {
          bx = bx * w;
          by = by * h;
          bw = bw * w;
          bh = bh * h;
        }

        // Bounding box outline
        ctx.lineWidth = Math.max(3, Math.round(w / 300));
        ctx.strokeStyle = color;
        ctx.strokeRect(bx, by, bw, bh);

        // Semi-transparent mask fill inside bbox
        ctx.fillStyle = color.startsWith('#')
          ? `${color}22`
          : 'rgba(16, 185, 129, 0.15)';
        ctx.fillRect(bx, by, bw, bh);

        // Label pill header
        const labelText = `${taxonomy.shortLabel} ${det.confidence}%`;
        ctx.font = `bold ${Math.max(13, Math.round(w / 60))}px "Inter", sans-serif`;
        const textMetrics = ctx.measureText(labelText);
        const textHeight = Math.max(18, Math.round(w / 45));
        const pillWidth = textMetrics.width + 12;
        const pillHeight = textHeight + 6;

        ctx.fillStyle = color;
        ctx.fillRect(bx, Math.max(0, by - pillHeight), pillWidth, pillHeight);

        // Label text
        ctx.fillStyle = '#ffffff';
        ctx.textBaseline = 'middle';
        ctx.fillText(labelText, bx + 6, Math.max(0, by - pillHeight) + pillHeight / 2);
      });

      resolve(canvas.toDataURL('image/jpeg', 0.92));
    };

    img.onerror = () => {
      resolve(typeof imageSource === 'string' ? imageSource : null);
    };

    if (typeof imageSource === 'string') {
      img.src = imageSource;
    } else if (imageSource instanceof Blob || imageSource instanceof File) {
      img.src = URL.createObjectURL(imageSource);
    } else {
      resolve(null);
    }
  });
}

/**
 * Generate sensible simulated detections based on image dimensions and marine debris taxonomy
 */
function generateSimulatedDetections(imageMeta = {}) {
  const width = imageMeta.width || 800;
  const height = imageMeta.height || 600;

  // Realistic sample scenarios for benthic underwater imagery
  const samplePresets = [
    [
      {
        id: 1,
        class: 'plastic',
        confidence: 93.4,
        bbox: [Math.round(width * 0.18), Math.round(height * 0.22), Math.round(width * 0.26), Math.round(height * 0.32)],
        area: 0.18,
      },
      {
        id: 2,
        class: 'gear',
        confidence: 88.2,
        bbox: [Math.round(width * 0.52), Math.round(height * 0.35), Math.round(width * 0.36), Math.round(height * 0.45)],
        area: 0.54,
      },
      {
        id: 3,
        class: 'metal',
        confidence: 91.0,
        bbox: [Math.round(width * 0.12), Math.round(height * 0.65), Math.round(width * 0.18), Math.round(height * 0.22)],
        area: 0.12,
      },
      {
        id: 4,
        class: 'plastic',
        confidence: 76.8,
        bbox: [Math.round(width * 0.44), Math.round(height * 0.15), Math.round(width * 0.16), Math.round(height * 0.18)],
        area: 0.09,
      },
    ],
    [
      {
        id: 1,
        class: 'gear',
        confidence: 95.8,
        bbox: [Math.round(width * 0.15), Math.round(height * 0.18), Math.round(width * 0.65), Math.round(height * 0.6)],
        area: 1.2,
      },
      {
        id: 2,
        class: 'plastic',
        confidence: 84.1,
        bbox: [Math.round(width * 0.68), Math.round(height * 0.65), Math.round(width * 0.22), Math.round(height * 0.24)],
        area: 0.22,
      },
      {
        id: 3,
        class: 'metal',
        confidence: 72.4,
        bbox: [Math.round(width * 0.08), Math.round(height * 0.45), Math.round(width * 0.2), Math.round(height * 0.28)],
        area: 0.35,
      },
    ],
    [
      {
        id: 1,
        class: 'plastic',
        confidence: 96.2,
        bbox: [Math.round(width * 0.28), Math.round(height * 0.3), Math.round(width * 0.32), Math.round(height * 0.4)],
        area: 0.42,
      },
      {
        id: 2,
        class: 'plastic',
        confidence: 89.0,
        bbox: [Math.round(width * 0.62), Math.round(height * 0.18), Math.round(width * 0.22), Math.round(height * 0.28)],
        area: 0.19,
      },
      {
        id: 3,
        class: 'rubber',
        confidence: 81.5,
        bbox: [Math.round(width * 0.1), Math.round(height * 0.55), Math.round(width * 0.35), Math.round(height * 0.35)],
        area: 0.75,
      },
      {
        id: 4,
        class: 'gear',
        confidence: 79.3,
        bbox: [Math.round(width * 0.48), Math.round(height * 0.62), Math.round(width * 0.38), Math.round(height * 0.3)],
        area: 0.48,
      },
      {
        id: 5,
        class: 'other',
        confidence: 68.7,
        bbox: [Math.round(width * 0.75), Math.round(height * 0.5), Math.round(width * 0.18), Math.round(height * 0.22)],
        area: 0.14,
      },
    ],
  ];

  // Pick one preset based on random or deterministic seed
  const randomIndex = Math.floor(Math.random() * samplePresets.length);
  return samplePresets[randomIndex];
}

/**
 * Image Analysis Service Function
 */
export async function analyzeImage(imageFile, options = {}) {
  const isDemo = options.demoMode ?? APP_CONFIG.DEMO_MODE;
  const backendUrl = options.backendUrl || APP_CONFIG.API.PREDICT_IMAGE_ENDPOINT;
  const startTime = performance.now();
  const filename = options.filename || imageFile?.name || 'Survey_Image.jpg';

  // 1. DEMO / FALLBACK MODE
  if (isDemo) {
    // Simulate realistic inference delay (1200ms - 1800ms)
    await new Promise((resolve) => setTimeout(resolve, 1400));

    // Get preview URL
    let previewUrl = options.previewUrl;
    if (!previewUrl) {
      if (typeof imageFile === 'string') {
        previewUrl = imageFile;
      } else if (imageFile instanceof Blob || imageFile instanceof File) {
        previewUrl = URL.createObjectURL(imageFile);
      }
    }

    // Determine dimensions
    let dimensions = options.dimensions || { width: 800, height: 600 };
    if (!options.dimensions && previewUrl) {
      try {
        dimensions = await new Promise((res) => {
          const img = new Image();
          img.onload = () => res({ width: img.naturalWidth || 800, height: img.naturalHeight || 600 });
          img.onerror = () => res({ width: 800, height: 600 });
          img.src = previewUrl;
        });
      } catch {}
    }

    // Generate simulated detections
    const rawDetections = generateSimulatedDetections(dimensions);

    // Render bounding boxes on canvas
    const annotatedDataUrl = await drawDemoAnnotationsOnImage(previewUrl, rawDetections);

    const endTime = performance.now();
    const durationMs = Math.round(endTime - startTime);

    return normalizeDetectionResult(
      {
        success: true,
        mode: 'demo',
        detections: rawDetections,
        annotated_image: annotatedDataUrl,
        originalImage: previewUrl,
        previewUrl,
        durationMs,
        filename,
      },
      true,
      filename
    );
  }

  // 2. REAL BACKEND MODE (FastAPI POST /predict)
  const formData = new FormData();
  if (imageFile?.blob) {
    formData.append('file', imageFile.blob, imageFile.name || filename);
  } else if (imageFile instanceof File) {
    formData.append('file', imageFile);
  } else if (options.previewUrl && (options.previewUrl.startsWith('data:') || options.previewUrl.startsWith('blob:'))) {
    const res = await fetch(options.previewUrl);
    const blob = await res.blob();
    formData.append('file', blob, filename);
  } else {
    throw new Error('No valid image file provided for real backend inference.');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), APP_CONFIG.API.TIMEOUT_MS);

  try {
    const response = await fetch(backendUrl, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const endTime = performance.now();
    const durationMs = Math.round(endTime - startTime);

    if (!response.ok) {
      let errorMsg = `Server returned HTTP ${response.status}: ${response.statusText}`;
      try {
        const errData = await response.json();
        if (errData?.error) errorMsg = errData.error;
      } catch {}
      throw new Error(errorMsg);
    }

    const data = await response.json();
    if (!data.success && data.error) {
      throw new Error(data.error);
    }

    return normalizeDetectionResult(
      {
        ...data,
        originalImage: options.previewUrl || (imageFile instanceof File ? URL.createObjectURL(imageFile) : null),
        durationMs,
        filename,
      },
      false,
      filename
    );
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('Analysis timed out after 45 seconds. The inference server might be overloaded.');
    }
    if (err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError')) {
      throw new Error(
        `Unable to reach the inference server at ${backendUrl}. Ensure the FastAPI server is running or check the endpoint in Preferences.`
      );
    }
    throw err;
  }
}

/**
 * Fallback video keyframe presets.
 * Boxes are stored as fractions of the frame so they scale to any resolution
 * and aspect ratio (landscape, portrait or square) without drifting.
 */
const FALLBACK_VIDEO_KEYFRAMES = [
  {
    at: 0.12,
    objects: [
      { class: 'plastic', confidence: 94.2, bbox: [0.16, 0.18, 0.18, 0.3] },
      { class: 'plastic', confidence: 87.5, bbox: [0.46, 0.4, 0.24, 0.22] },
    ],
  },
  {
    at: 0.34,
    objects: [
      { class: 'gear', confidence: 91.8, bbox: [0.3, 0.14, 0.42, 0.52] },
      { class: 'plastic', confidence: 82.0, bbox: [0.06, 0.56, 0.18, 0.16] },
    ],
  },
  {
    at: 0.58,
    objects: [
      { class: 'metal', confidence: 89.4, bbox: [0.56, 0.4, 0.16, 0.2] },
      { class: 'metal', confidence: 78.1, bbox: [0.2, 0.28, 0.24, 0.26] },
    ],
  },
  {
    at: 0.82,
    objects: [
      { class: 'plastic', confidence: 92.6, bbox: [0.34, 0.22, 0.16, 0.22] },
      { class: 'gear', confidence: 86.4, bbox: [0.56, 0.16, 0.34, 0.48] },
      { class: 'rubber', confidence: 83.2, bbox: [0.1, 0.58, 0.24, 0.3] },
    ],
  },
];

function formatTimecode(totalSec) {
  const safe = Math.max(0, Math.round(totalSec || 0));
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/**
 * Builds the structured temporal detection result used by the video workflow.
 * Detection boxes are expressed in source-video pixels so the annotation
 * overlay can be scaled purely as a percentage of the frame.
 */
function buildFallbackVideoResult({
  durationSec,
  width,
  height,
  fpsSampling,
  filename,
  durationMs,
}) {
  let previousTs = -1;
  const keyframes = FALLBACK_VIDEO_KEYFRAMES.map((preset, kfIndex) => {
    const clamped = Math.min(
      Math.max(Math.round(preset.at * durationSec), 0),
      Math.max(0, Math.floor(durationSec))
    );
    const timestampSec = clamped > previousTs ? clamped : previousTs + 1;
    previousTs = timestampSec;

    const detectedObjects = preset.objects.map((obj, objIndex) => ({
      id: kfIndex * 10 + objIndex + 1,
      class: obj.class,
      label: (APP_CONFIG.TAXONOMY[obj.class] || APP_CONFIG.TAXONOMY.other).label,
      confidence: obj.confidence,
      frame: Math.round(timestampSec * fpsSampling),
      bbox: [
        Math.round(obj.bbox[0] * width),
        Math.round(obj.bbox[1] * height),
        Math.round(obj.bbox[2] * width),
        Math.round(obj.bbox[3] * height),
      ],
    }));

    return {
      frame: Math.round(timestampSec * fpsSampling),
      timestampSec,
      timecode: formatTimecode(timestampSec),
      detectedObjects,
    };
  });

  // Aggregate counts from the generated timeline so every summary value matches
  // the detections actually rendered on the video.
  const classBreakdown = {};
  let totalDetections = 0;
  keyframes.forEach((kf) => {
    kf.detectedObjects.forEach((obj) => {
      classBreakdown[obj.class] = (classBreakdown[obj.class] || 0) + 1;
      totalDetections += 1;
    });
  });

  return {
    success: true,
    mode: 'demo',
    isDemo: true,
    type: 'video',
    filename,
    videoDurationSec: durationSec,
    videoWidth: width,
    videoHeight: height,
    fpsSampled: fpsSampling,
    framesSampled: Math.max(1, Math.round(durationSec * fpsSampling)),
    numDetections: totalDetections,
    classBreakdown,
    keyframes,
    durationMs,
    timestamp: new Date().toLocaleString(),
    notice: APP_CONFIG.NOTICES.VIDEO,
  };
}

/**
 * Video Analysis Service Function
 */
export async function analyzeVideo(videoFile, options = {}) {
  const isDemo = options.demoMode ?? APP_CONFIG.DEMO_MODE;
  const startTime = performance.now();
  const filename = options.filename || videoFile?.name || 'Transect_Survey.mp4';
  const durationSec = Math.max(1, options.duration || 32);
  const width = options.width || 1280;
  const height = options.height || 720;
  const fpsSampling = options.fpsSampling || 2;

  // 1. FALLBACK INFERENCE PROVIDER (offline / local pipeline)
  if (isDemo) {
    // Multi-stage processing delay so the progress states are observable
    await new Promise((resolve) => setTimeout(resolve, 1800));

    const endTime = performance.now();
    const durationMs = Math.round(endTime - startTime);

    return buildFallbackVideoResult({
      durationSec,
      width,
      height,
      fpsSampling,
      filename,
      durationMs,
    });
  }

  // 2. REAL VIDEO BACKEND (FastAPI batch endpoint)
  const formData = new FormData();
  if (videoFile instanceof File) {
    formData.append('file', videoFile);
  } else if (options.videoUrl) {
    const res = await fetch(options.videoUrl);
    const blob = await res.blob();
    formData.append('file', blob, filename);
  } else {
    throw new Error('No valid video file provided for inference.');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), APP_CONFIG.API.TIMEOUT_MS);

  try {
    const response = await fetch(APP_CONFIG.API.PREDICT_VIDEO_ENDPOINT, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const endTime = performance.now();
    const durationMs = Math.round(endTime - startTime);

    if (!response.ok) {
      throw new Error(`Video inference returned HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    if (!data.success && data.error) {
      throw new Error(data.error);
    }

    const keyframes = (data.keyframes || []).map((kf, kfIndex) => ({
      frame: kf.frame ?? Math.round((kf.timestampSec || 0) * fpsSampling),
      timestampSec: kf.timestampSec ?? 0,
      timecode: kf.timecode || formatTimecode(kf.timestampSec || 0),
      detectedObjects: (kf.detections || kf.detectedObjects || []).map((det, i) => {
        const cls = (det.class || det.class_name || 'plastic').toLowerCase();
        const taxonomy = APP_CONFIG.TAXONOMY[cls] || APP_CONFIG.TAXONOMY.other;
        const rawBox = det.bbox || det.box || [0, 0, 0, 0];
        return {
          id: kfIndex * 10 + i + 1,
          class: cls,
          label: taxonomy.label,
          confidence:
            (det.confidence ?? 0) <= 1
              ? Math.round((det.confidence ?? 0) * 1000) / 10
              : Math.round((det.confidence ?? 0) * 10) / 10,
          frame: kf.frame ?? 0,
          bbox: Array.isArray(rawBox)
            ? rawBox
            : [rawBox.x || 0, rawBox.y || 0, rawBox.width || 0, rawBox.height || 0],
        };
      }),
    }));

    const classBreakdown = {};
    let totalDetections = 0;
    keyframes.forEach((kf) => {
      kf.detectedObjects.forEach((obj) => {
        classBreakdown[obj.class] = (classBreakdown[obj.class] || 0) + 1;
        totalDetections += 1;
      });
    });

    return {
      success: true,
      mode: 'real',
      isDemo: false,
      type: 'video',
      filename,
      videoDurationSec: data.videoDurationSec || durationSec,
      videoWidth: data.videoWidth || width,
      videoHeight: data.videoHeight || height,
      fpsSampled: fpsSampling,
      framesSampled: Math.max(1, Math.round(durationSec * fpsSampling)),
      numDetections: data.numDetections ?? totalDetections,
      classBreakdown: data.classBreakdown || classBreakdown,
      keyframes,
      durationMs,
      timestamp: new Date().toLocaleString(),
      notice: null,
    };
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('Video analysis timed out. The inference server might be overloaded.');
    }
    if (err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError')) {
      throw new Error(
        `Unable to reach the video inference server at ${APP_CONFIG.API.PREDICT_VIDEO_ENDPOINT}.`
      );
    }
    throw err;
  }
}

/**
 * Pollution & Environmental Assessment Calculation Service
 * Transparent, clean, ecological threat categorization based on detected debris taxonomy
 */
export function calculatePollutionAssessment(analysisResult) {
  if (!analysisResult) return null;

  const detections = analysisResult.detections || [];
  const breakdown = analysisResult.classBreakdown || {};
  const numDetections = analysisResult.numDetections || detections.length;

  const plasticCount = (breakdown.plastic || 0) + (breakdown.bottle || 0) + (breakdown.polymer || 0);
  const gearCount = (breakdown.gear || 0) + (breakdown.net || 0) + (breakdown.fishing_gear || 0);
  const metalCount = (breakdown.metal || 0) + (breakdown.can || 0);
  const rubberCount = breakdown.rubber || 0;
  const glassCount = breakdown.glass || 0;
  const otherCount = breakdown.other || 0;

  // Determine Dominant Material
  let dominantClass = 'None';
  let maxCount = 0;
  Object.entries(breakdown).forEach(([cls, count]) => {
    if (count > maxCount) {
      maxCount = count;
      dominantClass = cls;
    }
  });

  // Calculate Qualitative Accumulation Density
  let densityCategory = 'Clean / Baseline';
  let densitySeverity = 'low';
  if (numDetections >= 10) {
    densityCategory = 'Critical Litter Hotspot';
    densitySeverity = 'critical';
  } else if (numDetections >= 6) {
    densityCategory = 'High Accumulation';
    densitySeverity = 'high';
  } else if (numDetections >= 3) {
    densityCategory = 'Moderate Anthropogenic Presence';
    densitySeverity = 'medium';
  } else if (numDetections >= 1) {
    densityCategory = 'Low / Sparse Debris';
    densitySeverity = 'low';
  }

  // Ecological Threat Evaluation
  const threatFactors = [];
  if (gearCount > 0) {
    threatFactors.push({
      threat: 'Ghost Fishing & Entanglement',
      level: 'Critical',
      description: `${gearCount} abandoned net/gear item(s) pose severe continuous trapping risk to sea turtles, marine mammals, and demersal fish.`,
    });
  }
  if (plasticCount > 0) {
    threatFactors.push({
      threat: 'Microplastic Fragmentation & Ingestion',
      level: 'High',
      description: `${plasticCount} macro-plastic target(s) subject to photo-oxidation, mechanical breakdown into toxic micro-polymers.`,
    });
  }
  if (metalCount > 0) {
    threatFactors.push({
      threat: 'Benthic Heavy Metal Oxidation',
      level: 'Medium',
      description: `${metalCount} metallic item(s) undergoing slow saline electrochemical corrosion.`,
    });
  }
  if (rubberCount > 0) {
    threatFactors.push({
      threat: 'Elastomer Leaching',
      level: 'High',
      description: `${rubberCount} rubber item(s) leaching vulcanized chemicals and zinc into benthic sediments.`,
    });
  }

  // Recommended Remediation Actions
  const recommendations = [];
  if (gearCount > 0) {
    recommendations.push({
      action: 'Specialized Diver / ROV Net Extraction',
      urgency: 'Priority 1',
      detail: 'Deploy trained technical divers or ROV cutting arms to disentangle ghost nets from coral substrate.',
    });
  }
  if (plasticCount >= 3 || numDetections >= 6) {
    recommendations.push({
      action: 'Targeted Seabed Sweep & Cleanup',
      urgency: 'Priority 2',
      detail: 'Schedule benthic clean-up survey before storm turbulence transports fragments across marine sanctuary.',
    });
  }
  if (numDetections > 0) {
    recommendations.push({
      action: 'Longitudinal Transect Monitoring',
      urgency: 'Standard',
      detail: 'Re-survey site within 60 days to monitor benthic litter accumulation velocity.',
    });
  }

  return {
    isDemo: Boolean(analysisResult.isDemo),
    surveyFilename: analysisResult.filename || 'Survey_Image.jpg',
    timestamp: analysisResult.timestamp || new Date().toLocaleString(),
    numDetections,
    dominantClass,
    dominantLabel: APP_CONFIG.TAXONOMY[dominantClass]?.label || dominantClass,
    densityCategory,
    densitySeverity,
    counts: {
      plastic: plasticCount,
      gear: gearCount,
      metal: metalCount,
      rubber: rubberCount,
      glass: glassCount,
      other: otherCount,
    },
    threatFactors,
    recommendations,
    notice: analysisResult.isDemo ? APP_CONFIG.NOTICES.POLLUTION : null,
  };
}

export default {
  analyzeImage,
  analyzeVideo,
  calculatePollutionAssessment,
  normalizeDetectionResult,
};
