/**
 * NirmalSagar — Underwater Marine Litter & Plastic Detection
 * Central Application Configuration & Mode Controller
 *
 * Switch DEMO_MODE to false when the real trained YOLO model & FastAPI backend are ready.
 */

export const APP_CONFIG = {
  // Primary Inference Source Flag
  // Set to false: all inference requests are dispatched directly to the real FastAPI backend
  DEMO_MODE: false,

  // Project Metadata
  PROJECT_NAME: 'NirmalSagar',
  PROJECT_TITLE: 'Underwater Marine Litter & Plastic Detection',
  PROJECT_VERSION: '1.0.0',

  // Model Metadata
  MODEL_INFO: {
    NAME: 'YOLO11s Marine Debris (LODO-3 Multi-Domain)',
    ARCHITECTURE: 'YOLO11s-seg (Cross-Domain Trained)',
    STATUS: 'Active',
    STATUS_DETAIL: 'Trained across TrashCan + SeaClear domains for deep-sea & coastal seabed segmentation.',
  },

  // Real Backend Endpoints
  API: {
    BASE_URL: 'http://localhost:8000',
    PREDICT_IMAGE_ENDPOINT: 'http://localhost:8000/predict',
    PREDICT_VIDEO_ENDPOINT: 'http://localhost:8000/predict-video',
    HEALTH_ENDPOINT: 'http://localhost:8000',
    TIMEOUT_MS: 60000,
    VIDEO_TIMEOUT_MS: 180000,
  },

  // Marine Debris Core-3 Taxonomy Definition
  TAXONOMY: {
    plastic: {
      id: 'plastic',
      label: 'Plastic / Polymer',
      shortLabel: 'Plastic',
      color: '#10b981', // Emerald
      bgTint: 'rgba(16, 185, 129, 0.12)',
      threatLevel: 'High',
      threatDescription: 'Fragmentation into toxic microplastics, chemical leaching, and ingestion hazard for marine organisms.',
    },
    metal: {
      id: 'metal',
      label: 'Metal Debris / Cans',
      shortLabel: 'Metal',
      color: '#3b82f6', // Blue
      bgTint: 'rgba(59, 130, 246, 0.12)',
      threatLevel: 'Medium',
      threatDescription: 'Saline electrochemical oxidation, heavy metal corrosion, and benthic sediment contamination.',
    },
    other_debris: {
      id: 'other_debris',
      label: 'Other Debris',
      shortLabel: 'Other Debris',
      color: '#8b5cf6', // Violet
      bgTint: 'rgba(139, 92, 246, 0.12)',
      threatLevel: 'Medium',
      threatDescription: 'Submerged anthropogenic waste including rubber, glass, ceramics, fabrics, and composite debris.',
    },
    // Aliases for compatibility
    other: {
      id: 'other_debris',
      label: 'Other Debris',
      shortLabel: 'Other Debris',
      color: '#8b5cf6',
      bgTint: 'rgba(139, 92, 246, 0.12)',
      threatLevel: 'Medium',
      threatDescription: 'Submerged anthropogenic waste including rubber, glass, ceramics, fabrics, and composite debris.',
    },
    gear: {
      id: 'other_debris',
      label: 'Other Debris',
      shortLabel: 'Other Debris',
      color: '#8b5cf6',
      bgTint: 'rgba(139, 92, 246, 0.12)',
      threatLevel: 'Medium',
      threatDescription: 'Submerged anthropogenic waste including rubber, glass, ceramics, fabrics, and composite debris.',
    },
    rubber: {
      id: 'other_debris',
      label: 'Other Debris',
      shortLabel: 'Other Debris',
      color: '#8b5cf6',
      bgTint: 'rgba(139, 92, 246, 0.12)',
      threatLevel: 'Medium',
      threatDescription: 'Submerged anthropogenic waste including rubber, glass, ceramics, fabrics, and composite debris.',
    },
    glass: {
      id: 'other_debris',
      label: 'Other Debris',
      shortLabel: 'Other Debris',
      color: '#8b5cf6',
      bgTint: 'rgba(139, 92, 246, 0.12)',
      threatLevel: 'Medium',
      threatDescription: 'Submerged anthropogenic waste including rubber, glass, ceramics, fabrics, and composite debris.',
    },
  },

  // Internal result notices (never rendered in the UI)
  NOTICES: {
    DETECTION: 'Detection pass completed by the local inference pipeline.',
    VIDEO: 'Temporal detection pass completed across sampled frames.',
    ENHANCEMENT:
      'Client-side wavelength attenuation & color restoration applied to the source image.',
    POLLUTION:
      'Qualitative benthic litter classification derived from the detected debris taxonomy.',
    ANALYTICS: 'Session telemetry recorded from completed analysis runs.',
  },
};

export default APP_CONFIG;
