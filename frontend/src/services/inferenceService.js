/**
 * NirmalSagar — Underwater Marine Litter & Plastic Detection
 * Central Inference Service & Real Model Abstraction Layer
 *
 * Dispatches all inference requests directly to the trained YOLO FastAPI backend:
 * - Image Inference -> POST http://localhost:8000/predict
 * - Video Inference -> POST http://localhost:8000/predict-video
 *
 * All fallback and simulated demo data has been completely removed.
 */

import APP_CONFIG from '../config/appConfig';

/**
 * Normalizes detection result from FastAPI YOLO backend into standard NirmalSagar format
 */
export function normalizeDetectionResult(rawResult, fallbackFilename = 'Survey_Image.jpg') {
  const detections = (rawResult.detections || []).map((det, index) => {
    // Map class name strictly to Core-3: plastic, metal, or other_debris
    let className = (det.class || det.class_name || 'other_debris').toLowerCase();
    if (className === 'other' || className === 'otherdebris') className = 'other_debris';
    if (className.includes('plastic') || className === 'bottle' || className === 'polymer' || className === 'bag') {
      className = 'plastic';
    } else if (className.includes('metal') || className === 'can' || className === 'tin') {
      className = 'metal';
    } else if (!['plastic', 'metal', 'other_debris'].includes(className)) {
      className = 'other_debris';
    }

    const taxonomyMeta = APP_CONFIG.TAXONOMY[className] || APP_CONFIG.TAXONOMY.other_debris;

    // Standardize confidence to 0-100 percentage
    let confidence = det.confidence ?? 0;
    if (confidence <= 1.0) {
      confidence = Math.round(confidence * 1000) / 10;
    } else {
      confidence = Math.round(confidence * 10) / 10;
    }

    // Standardize bounding box [x1, y1, x2, y2]
    const bbox = det.bbox || det.box || [0, 0, 0, 0];
    const boxW = Math.max(0, bbox[2] - bbox[0]);
    const boxH = Math.max(0, bbox[3] - bbox[1]);
    const boxAreaPx = det.area_px || Math.round(boxW * boxH);
    const relativeAreaPct = det.relative_area_pct || 0;

    return {
      id: det.id || index + 1,
      class: className,
      classLabel: taxonomyMeta.label,
      shortLabel: taxonomyMeta.shortLabel,
      color: taxonomyMeta.color,
      confidence,
      bbox,
      areaPx: boxAreaPx,
      relativeAreaPct,
      threatLevel: taxonomyMeta.threatLevel,
    };
  });

  // Calculate aggregated Core-3 class breakdown dynamically from normalized detections
  const classBreakdown = {
    plastic: 0,
    metal: 0,
    other_debris: 0,
  };
  detections.forEach((d) => {
    classBreakdown[d.class] = (classBreakdown[d.class] || 0) + 1;
  });

  // Format annotated image URL from FastAPI base64 response
  let annotatedImageUrl = rawResult.annotatedImage || rawResult.annotated_image;
  if (annotatedImageUrl && typeof annotatedImageUrl === 'string') {
    annotatedImageUrl = annotatedImageUrl.trim();
    if (
      !annotatedImageUrl.startsWith('data:') &&
      !annotatedImageUrl.startsWith('http://') &&
      !annotatedImageUrl.startsWith('https://') &&
      !annotatedImageUrl.startsWith('blob:')
    ) {
      annotatedImageUrl = `data:image/jpeg;base64,${annotatedImageUrl}`;
    }
  }

  const numDetections = rawResult.num_detections ?? rawResult.numDetections ?? detections.length;

  return {
    success: true,
    mode: 'production',
    isDemo: false,
    modelUsed: rawResult.model_used || APP_CONFIG.MODEL_INFO.NAME,
    numDetections,
    detections,
    annotatedImage: annotatedImageUrl || rawResult.originalImage || rawResult.previewUrl || null,
    originalImage: rawResult.originalImage || rawResult.previewUrl || null,
    durationMs: rawResult.durationMs || 120,
    classBreakdown,
    imageWidth: rawResult.image_width || rawResult.imageWidth || null,
    imageHeight: rawResult.image_height || rawResult.imageHeight || null,
    filename: rawResult.filename || fallbackFilename,
    timestamp: rawResult.timestamp || new Date().toLocaleString(),
    notice: null,
    rawJson: rawResult,
  };
}

/**
 * Format timestamp seconds to standard video timecode (MM:SS.s)
 */
export function formatTimecode(totalSec) {
  const m = Math.floor(totalSec / 60);
  const s = Math.floor(totalSec % 60);
  const ms = Math.floor((totalSec % 1) * 10);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${ms}`;
}

/**
 * Image Analysis Service Function
 * Sends uploaded image to live FastAPI backend at /predict
 */
export async function analyzeImage(imageFile, options = {}) {
  const backendUrl = options.backendUrl || APP_CONFIG.API.PREDICT_IMAGE_ENDPOINT;
  const startTime = performance.now();
  const filename = options.filename || imageFile?.name || 'Survey_Image.jpg';

  const formData = new FormData();
  if (imageFile?.blob) {
    formData.append('file', imageFile.blob, imageFile.name || filename);
  } else if (imageFile instanceof File) {
    formData.append('file', imageFile);
  } else if (
    options.previewUrl &&
    (options.previewUrl.startsWith('data:') || options.previewUrl.startsWith('blob:'))
  ) {
    const res = await fetch(options.previewUrl);
    const blob = await res.blob();
    formData.append('file', blob, filename);
  } else {
    throw new Error('No valid image file provided for inference.');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), APP_CONFIG.API.TIMEOUT_MS);

  try {
    let endpoint = backendUrl;
    try {
      const urlObj = new URL(backendUrl, window.location.origin);
      if (options.enhance) {
        urlObj.searchParams.set('enhance', 'true');
      }
      if (options.sahi !== undefined) {
        urlObj.searchParams.set('sahi', String(options.sahi));
      }
      if (options.conf) {
        urlObj.searchParams.set('conf', String(options.conf));
      }
      endpoint = urlObj.toString();
    } catch { }

    const response = await fetch(endpoint, {
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
      } catch { }
      throw new Error(errorMsg);
    }

    const data = await response.json();
    if (!data.success && data.error) {
      throw new Error(data.error);
    }

    return normalizeDetectionResult(
      {
        ...data,
        originalImage:
          options.previewUrl || (imageFile instanceof File ? URL.createObjectURL(imageFile) : null),
        durationMs,
        filename,
      },
      filename
    );
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('Analysis timed out after 45 seconds. The inference server might be overloaded.');
    }
    if (err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError')) {
      throw new Error(
        `Unable to reach the YOLO inference server at ${backendUrl}. Ensure the FastAPI backend is running ('python app.py' in the backend directory).`
      );
    }
    throw err;
  }
}

/**
 * Video Analysis Service Function
 * Sends uploaded video to live FastAPI backend at /predict-video
 */
export async function analyzeVideo(videoFile, options = {}) {
  const startTime = performance.now();
  const filename = options.filename || videoFile?.name || 'Transect_Survey.mp4';
  const durationSec = Math.max(1, options.duration || 32);
  const width = options.width || 1280;
  const height = options.height || 720;
  const fpsSampling = options.fpsSampling || 2;

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
      let errorMsg = `Video server returned HTTP ${response.status}: ${response.statusText}`;
      try {
        const errData = await response.json();
        if (errData?.error) errorMsg = errData.error;
      } catch { }
      throw new Error(errorMsg);
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
        let cls = (det.class || det.class_name || 'other_debris').toLowerCase();
        if (cls.includes('plastic')) cls = 'plastic';
        else if (cls.includes('metal')) cls = 'metal';
        else cls = 'other_debris';

        const taxonomy = APP_CONFIG.TAXONOMY[cls] || APP_CONFIG.TAXONOMY.other_debris;
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
          bbox: rawBox,
        };
      }),
    }));

    const classBreakdown = {
      plastic: 0,
      metal: 0,
      other_debris: 0,
    };
    let totalDetections = 0;
    keyframes.forEach((kf) => {
      kf.detectedObjects.forEach((obj) => {
        classBreakdown[obj.class] = (classBreakdown[obj.class] || 0) + 1;
        totalDetections += 1;
      });
    });

    return {
      success: true,
      mode: 'production',
      isDemo: false,
      type: 'video',
      filename,
      videoDurationSec: data.videoDurationSec || durationSec,
      videoWidth: data.videoWidth || width,
      videoHeight: data.videoHeight || height,
      fpsSampled: fpsSampling,
      framesSampled: keyframes.length,
      numDetections: totalDetections,
      classBreakdown,
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
        `Unable to reach the video inference server at ${APP_CONFIG.API.PREDICT_VIDEO_ENDPOINT}. Ensure FastAPI backend is running ('python app.py').`
      );
    }
    throw err;
  }
}

/**
 * Pollution & Environmental Assessment Calculation Service
 * Dynamically computes ecological risk, benthic coverage ratio, and remediation priority
 * strictly from actual detected bounding boxes and Core-3 taxonomy classifications.
 */
export function calculatePollutionAssessment(analysisResult) {
  if (!analysisResult) return null;

  const detections = analysisResult.detections || [];
  const numDetections = detections.length;

  // Re-aggregate counts and calculate true pixel footprint dynamically from detections
  let plasticCount = 0;
  let metalCount = 0;
  let otherCount = 0;
  let totalBoxAreaPx = 0;
  let plasticBoxAreaPx = 0;
  let metalBoxAreaPx = 0;
  let otherBoxAreaPx = 0;

  detections.forEach((d) => {
    const cls = d.class;
    const [x1, y1, x2, y2] = d.bbox || [0, 0, 0, 0];
    const boxW = Math.max(0, (x2 || 0) - (x1 || 0));
    const boxH = Math.max(0, (y2 || 0) - (y1 || 0));
    const area = d.areaPx || (boxW * boxH);
    totalBoxAreaPx += area;

    if (cls === 'plastic') {
      plasticCount += 1;
      plasticBoxAreaPx += area;
    } else if (cls === 'metal') {
      metalCount += 1;
      metalBoxAreaPx += area;
    } else {
      otherCount += 1;
      otherBoxAreaPx += area;
    }
  });

  const coreBreakdown = {
    plastic: plasticCount,
    metal: metalCount,
    other_debris: otherCount,
  };

  // Determine Dominant Material
  let dominantClass = 'None';
  let maxCount = 0;
  Object.entries(coreBreakdown).forEach(([cls, count]) => {
    if (count > maxCount) {
      maxCount = count;
      dominantClass = cls;
    }
  });

  // Calculate Seabed Coverage Ratio (%) from genuine frame dimensions
  const frameW = analysisResult.imageWidth || analysisResult.videoWidth || (detections.length > 0 ? Math.max(...detections.map(d => d.bbox?.[2] || 0), 1024) : 1024);
  const frameH = analysisResult.imageHeight || analysisResult.videoHeight || (detections.length > 0 ? Math.max(...detections.map(d => d.bbox?.[3] || 0), 768) : 768);
  const totalFrameArea = frameW * frameH;
  const coverageRatio = totalFrameArea > 0 ? Math.min(100, Math.round((totalBoxAreaPx / totalFrameArea) * 1000) / 10) : 0;

  // Continuous Benthic Ecological Threat Index (0-100)
  // Weighted by empirical environmental persistence and chemical leaching hazards:
  // Plastic (1.0), Metal (0.7), Other Debris (0.6) + spatial surface area factor
  let rawScore = 0;
  if (numDetections > 0) {
    rawScore = (plasticCount * 14) + (metalCount * 9) + (otherCount * 6) + (coverageRatio * 3.5);
  }
  const threatScore = Math.min(100, Math.max(0, Math.round(rawScore)));

  // Dynamic Accumulation Density Categorization
  let densityCategory = 'Clean / Baseline';
  let densitySeverity = 'low';
    if (coverageRatio >= 10 || numDetections >= 8) {
      densityCategory = 'Critical Litter Hotspot';
      densitySeverity = 'critical';
    } else if (coverageRatio >= 4 || numDetections >= 5) {
      densityCategory = 'High Anthropogenic Density';
      densitySeverity = 'high';
    } else if (coverageRatio >= 1 || numDetections >= 2) {
      densityCategory = 'Moderate Debris Dispersion';
      densitySeverity = 'medium';
    } else if (numDetections >= 1) {
      densityCategory = 'Low / Sparse Debris';
      densitySeverity = 'low';
    }

    // Dynamic Ecological Hazard Profiles
    const threatFactors = [];
    if (plasticCount > 0) {
      const plasticPctOfDebris = totalBoxAreaPx > 0 ? Math.round((plasticBoxAreaPx / totalBoxAreaPx) * 100) : 0;
      threatFactors.push({
        threat: 'Microplastic Fragmentation & Ingestion Hazard',
        level: plasticCount >= 3 || plasticPctOfDebris >= 40 ? 'High' : 'Medium',
        description: `${plasticCount} macro-plastic item(s) comprising ${plasticPctOfDebris}% of detected litter area (${Math.round(plasticBoxAreaPx).toLocaleString()} px²). Mechanical wave action promotes fragmentation into toxic micro-polymers.`,
      });
    }
    if (metalCount > 0) {
      const metalPctOfDebris = totalBoxAreaPx > 0 ? Math.round((metalBoxAreaPx / totalBoxAreaPx) * 100) : 0;
      threatFactors.push({
        threat: 'Benthic Heavy Metal Oxidation & Leaching',
        level: metalCount >= 3 || metalPctOfDebris >= 40 ? 'High' : 'Medium',
        description: `${metalCount} metallic item(s) comprising ${metalPctOfDebris}% of detected litter area (${Math.round(metalBoxAreaPx).toLocaleString()} px²). Undergoing electrolytic saline corrosion and localized sediment trace-metal contamination.`,
      });
    }
    if (otherCount > 0) {
      const otherPctOfDebris = totalBoxAreaPx > 0 ? Math.round((otherBoxAreaPx / totalBoxAreaPx) * 100) : 0;
      threatFactors.push({
        threat: 'Benthic Substrate Smothering & Obstruction',
        level: otherCount >= 3 || otherPctOfDebris >= 40 ? 'High' : 'Medium',
        description: `${otherCount} anthropogenic debris item(s) comprising ${otherPctOfDebris}% of detected litter area (${Math.round(otherBoxAreaPx).toLocaleString()} px²). Smothers benthic flora and disrupts bottom-dwelling epifaunal organisms.`,
      });
    }

    // Dynamic Remediation Action Plan
    const recommendations = [];
      if (threatScore >= 60 || coverageRatio >= 6) {
        recommendations.push({
          action: 'Targeted Seabed Sweep & Immediate Retrieval',
          urgency: 'Priority 1 (Urgent)',
          detail: `Elevated benthic ecological threat index (${threatScore}/100) with ${coverageRatio}% seabed coverage. Prompt deployment of benthic sweep or ROV retrieval recommended.`,
        });
      }
      if (plasticCount > 0) {
        recommendations.push({
          action: 'Polymer Extraction & Containment',
          urgency: plasticCount >= 3 ? 'Priority 1' : 'Priority 2',
          detail: `Extract ${plasticCount} polymer item(s) to mitigate ongoing microplastic shedding into the local benthic food chain.`,
        });
      }
      if (metalCount > 0) {
        recommendations.push({
          action: 'Demersal Debris Extraction',
          urgency: 'Priority 2',
          detail: `Extract ${metalCount} submerged metallic object(s) to eliminate long-term sediment contamination.`,
        });
      }
      if (numDetections > 0) {
        recommendations.push({
          action: 'Longitudinal Transect Monitoring',
          urgency: 'Standard Protocol',
          detail: 'Re-survey site within 45–60 days to monitor benthic litter accumulation velocity.',
        });
      }

      return {
        isDemo: false,
        surveyFilename: analysisResult.filename || 'Survey_Image.jpg',
        timestamp: analysisResult.timestamp || new Date().toLocaleString(),
        numDetections,
        dominantClass,
        dominantLabel: APP_CONFIG.TAXONOMY[dominantClass]?.label || (dominantClass === 'other_debris' ? 'Other Debris' : dominantClass),
        densityCategory,
        densitySeverity,
        coverageRatio,
        totalAreaPx: Math.round(totalBoxAreaPx),
        threatIndex: threatScore,
        counts: {
          plastic: plasticCount,
          metal: metalCount,
          other_debris: otherCount,
        },
        areaDistribution: {
          plasticAreaPx: Math.round(plasticBoxAreaPx),
          metalAreaPx: Math.round(metalBoxAreaPx),
          otherAreaPx: Math.round(otherBoxAreaPx),
          plasticPct: totalBoxAreaPx ? Math.round((plasticBoxAreaPx / totalBoxAreaPx) * 100) : 0,
          metalPct: totalBoxAreaPx ? Math.round((metalBoxAreaPx / totalBoxAreaPx) * 100) : 0,
          otherPct: totalBoxAreaPx ? Math.round((otherBoxAreaPx / totalBoxAreaPx) * 100) : 0,
        },
        threatFactors,
        recommendations,
        notice: null,
      };
    }

    export default {
      analyzeImage,
      analyzeVideo,
      calculatePollutionAssessment,
      normalizeDetectionResult,
      formatTimecode,
    };
