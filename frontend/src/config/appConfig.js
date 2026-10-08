/**
 * NirmalSagar — Underwater Marine Litter & Plastic Detection
 * Central Application Configuration & Mode Controller
 *
 * Switch DEMO_MODE to false when the real trained YOLO model & FastAPI backend are ready.
 */

export const APP_CONFIG = {
  // Primary Inference Source Flag (internal only — never surfaced in the UI)
  // true  -> local fallback inference provider (works fully offline)
  // false -> dispatch all inference requests to the real FastAPI backend
  DEMO_MODE: true,

  // Project Metadata
  PROJECT_NAME: 'NirmalSagar',
  PROJECT_TITLE: 'Underwater Marine Litter & Plastic Detection',
  PROJECT_VERSION: '1.0.0-rc1',

  // Model Metadata
  MODEL_INFO: {
    NAME: 'YOLOv11s Marine Debris Segmentation',
    ARCHITECTURE: 'YOLOv11-seg (Nano/Small Backbone)',
    STATUS: 'Ready',
    STATUS_DETAIL: 'Marine debris taxonomy pipeline configured for benthic survey imagery.',
  },

  // Real Backend Endpoints
  API: {
    BASE_URL: 'http://localhost:8000',
    PREDICT_IMAGE_ENDPOINT: 'http://localhost:8000/predict',
    PREDICT_VIDEO_ENDPOINT: 'http://localhost:8000/predict-video',
    HEALTH_ENDPOINT: 'http://localhost:8000',
    TIMEOUT_MS: 45000,
  },

  // Marine Debris Taxonomy Definition
  TAXONOMY: {
    plastic: {
      id: 'plastic',
      label: 'Plastic / Polymer',
      shortLabel: 'Plastic',
      color: '#10b981', // Emerald
      bgTint: 'rgba(16, 185, 129, 0.12)',
      threatLevel: 'High',
      threatDescription: 'Fragmentation into microplastics, ingestion hazard for marine organisms.',
    },
    gear: {
      id: 'gear',
      label: 'Ghost Fishing Gear / Net',
      shortLabel: 'Net / Gear',
      color: '#f59e0b', // Amber
      bgTint: 'rgba(245, 158, 11, 0.12)',
      threatLevel: 'Critical',
      threatDescription: 'Entanglement hazard for turtles, coral reefs, and benthic ecosystems.',
    },
    metal: {
      id: 'metal',
      label: 'Metal / Debris Cans',
      shortLabel: 'Metal',
      color: '#3b82f6', // Blue
      bgTint: 'rgba(59, 130, 246, 0.12)',
      threatLevel: 'Medium',
      threatDescription: 'Oxidative corrosion, heavy metal leaching in benthic sediments.',
    },
    glass: {
      id: 'glass',
      label: 'Glass / Ceramics',
      shortLabel: 'Glass',
      color: '#06b6d4', // Cyan
      bgTint: 'rgba(6, 182, 212, 0.12)',
      threatLevel: 'Low',
      threatDescription: 'Physical obstruction, inert benthic hazard.',
    },
    rubber: {
      id: 'rubber',
      label: 'Rubber / Tires',
      shortLabel: 'Rubber',
      color: '#ec4899', // Pink
      bgTint: 'rgba(236, 72, 153, 0.12)',
      threatLevel: 'High',
      threatDescription: 'Leaching of zinc and vulcanized chemical compounds.',
    },
    other: {
      id: 'other',
      label: 'Other Anthropogenic Waste',
      shortLabel: 'Other',
      color: '#8b5cf6', // Violet
      bgTint: 'rgba(139, 92, 246, 0.12)',
      threatLevel: 'Medium',
      threatDescription: 'General marine litter and benthic obstruction.',
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
