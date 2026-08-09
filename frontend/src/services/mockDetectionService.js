/**
 * Mock detection service for NirmalSagar Underwater Debris Analysis.
 * Decouples presentation logic from detection backend (YOLO11-seg + FastAPI).
 */

export async function analyzeUnderwaterImage(imageSource) {
  // Simulate inference latency
  await new Promise((resolve) => setTimeout(resolve, 800));

  const detections = [
    {
      id: 1,
      label: "Plastic Bottle",
      confidence: 0.94,
      color: "#d9381e",
      bgColor: "rgba(217, 56, 30, 0.15)",
      // Percentage relative coordinates (x, y, width, height)
      bbox: { x: 22, y: 28, width: 24, height: 32 },
      polygon: "22,28 46,30 44,60 20,58",
    },
    {
      id: 2,
      label: "Plastic Bag",
      confidence: 0.88,
      color: "#d97706",
      bgColor: "rgba(217, 119, 6, 0.15)",
      bbox: { x: 55, y: 44, width: 26, height: 30 },
      polygon: "55,44 81,46 78,74 53,70",
    },
    {
      id: 3,
      label: "Fishing Net",
      confidence: 0.91,
      color: "#059669",
      bgColor: "rgba(5, 150, 105, 0.15)",
      bbox: { x: 14, y: 62, width: 34, height: 28 },
      polygon: "14,62 48,64 45,90 12,88",
    },
    {
      id: 4,
      label: "Rope",
      confidence: 0.85,
      color: "#2563eb",
      bgColor: "rgba(37, 99, 235, 0.15)",
      bbox: { x: 68, y: 16, width: 22, height: 24 },
      polygon: "68,16 90,18 87,40 66,38",
    },
  ];

  const uniqueTrashTypes = new Set(detections.map((d) => d.label)).size;

  return {
    success: true,
    summary: {
      totalObjects: detections.length,
      trashTypes: uniqueTrashTypes,
      debrisDensity: "0.42 objects / m²",
    },
    detections,
  };
}
