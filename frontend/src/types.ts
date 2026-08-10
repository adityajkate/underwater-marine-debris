export type PageId =
  | 'landing'
  | 'dashboard'
  | 'image-detection'
  | 'video-detection'
  | 'enhancement'
  | 'dataset'
  | 'training'
  | 'analytics'
  | 'pollution-analysis'
  | 'reports'
  | 'settings';

export type TrashCategory =
  | 'Plastic Bottle'
  | 'Plastic Bag / Film'
  | 'Ghost Fishing Net'
  | 'Metal Can / Drum'
  | 'Tire / Rubber'
  | 'Glass / Ceramics'
  | 'Microplastic Clump'
  | 'Other Marine Debris';

export interface BoundingBox {
  id: string;
  label: TrashCategory;
  confidence: number; // 0 to 1
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  width: number; // percentage 0-100
  height: number; // percentage 0-100
  polygonPoints?: [number, number][]; // percentages for segmentation mask
  color: string;
  depthMeters: number;
  estAreaCm2: number;
  estimatedWeightGrams: number;
  riskLevel: 'Critical' | 'High' | 'Moderate' | 'Low';
  domainShiftIndex: number; // 0-1 measure of turbidity adaptation
}

export interface ImageSample {
  id: string;
  title: string;
  location: string;
  waterBody: 'Arabian Sea' | 'Bay of Bengal' | 'Gulf of Mannar' | 'Lakshadweep Waters' | 'Mumbai Coast' | 'Kerala Backwaters';
  depthMeters: number;
  turbidityFTU: number; // Formazin Turbidity Unit (higher = murkier)
  imageUrl: string;
  restoredImageUrl?: string;
  timestamp: string;
  boxes: BoundingBox[];
  totalItems: number;
  densityPerM2: number;
  cleanupPriority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  pollutionScore: number; // 0 - 100
  isSampleData?: boolean;
}

export interface VideoKeyframe {
  timestampSec: number;
  timestampFormatted: string;
  debrisCount: number;
  dominantClass: TrashCategory;
  turbidity: number;
  boxes: BoundingBox[];
}

export interface CoastalStation {
  id: string;
  name: string;
  region: string;
  lat: number;
  lng: number;
  debrisDensityScore: number; // 0 - 100
  dominantPollutant: TrashCategory;
  lastScanned: string;
  status: 'Active Survey Zone' | 'High Turbidity Monitoring' | 'Scheduled Scan';
  turbidityAvg: number;
}

export interface DatasetItem {
  id: string;
  filename: string;
  source: string;
  waterConditions: 'Highly Turbid (Murky)' | 'Low-Light Deep Bed' | 'Coral Reef Light' | 'Estuarine Silt';
  turbidityFTU: number;
  annotationsCount: number;
  classesPresent: TrashCategory[];
  resolution: string;
  thumbnailUrl: string;
  verifiedBy: string;
  dateAdded: string;
}

export interface ModelCheckpoint {
  id: string;
  name: string;
  architecture: string;
  mAP50: number;
  mAP50_95: number;
  domainShiftAdaptationScore: number;
  turbidityRobustness: number;
  inferenceTimeMs: number;
  status: 'Active Deployment' | 'Candidate' | 'Archived';
  trainedOnEpochs: number;
}

export interface ReportDocument {
  id: string;
  title: string;
  category: 'Debris Detection Audit' | 'Enhancement Performance' | 'Domain Generalization' | 'Pollution Prioritization';
  date: string;
  region: string;
  debrisCount: number;
  author: string;
  fileSize: string;
  downloadUrl: string;
  summary: string;
}

export interface EnhancementMethod {
  id: 'color-correction' | 'dehazing' | 'contrast-stretching' | 'low-light-boost';
  name: string;
  description: string;
  psnrGainDb: number;
  uiqmScore: number; // Underwater Image Quality Measure
}
