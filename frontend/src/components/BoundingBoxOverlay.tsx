import React, { useState } from 'react';
import { BoundingBox } from '../types';
import { AlertTriangle, Eye, ShieldAlert, Sparkles, Crosshair } from 'lucide-react';

interface BoundingBoxOverlayProps {
  boxes: BoundingBox[];
  confidenceFilter: number; // 0 to 1
  selectedBoxId: string | null;
  onSelectBox: (box: BoundingBox | null) => void;
  showLabels?: boolean;
  showMasks?: boolean;
  showDomainShiftBadge?: boolean;
}

export const BoundingBoxOverlay: React.FC<BoundingBoxOverlayProps> = ({
  boxes,
  confidenceFilter,
  selectedBoxId,
  onSelectBox,
  showLabels = true,
  showMasks = true,
  showDomainShiftBadge = true,
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const filteredBoxes = boxes.filter((b) => b.confidence >= confidenceFilter);

  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden rounded-2xl">
      <svg className="w-full h-full absolute inset-0">
        <defs>
          <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="glow-emerald" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {filteredBoxes.map((box) => {
          const isSelected = selectedBoxId === box.id;
          const isHovered = hoveredId === box.id;
          const strokeWidth = isSelected ? 3 : isHovered ? 2.5 : 2;

          // Render segmentation polygon mask if available and requested
          let polygonPath = '';
          if (showMasks && box.polygonPoints && box.polygonPoints.length > 0) {
            polygonPath = box.polygonPoints
              .map(([px, py], i) => `${i === 0 ? 'M' : 'L'} ${px}% ${py}%`)
              .join(' ') + ' Z';
          }

          return (
            <g key={box.id}>
              {/* Polygon Segmentation Mask */}
              {showMasks && polygonPath && (
                <path
                  d={polygonPath}
                  fill={box.color}
                  fillOpacity={isSelected ? 0.35 : isHovered ? 0.25 : 0.15}
                  stroke={box.color}
                  strokeWidth={1}
                  strokeDasharray="4 2"
                  className="transition-all duration-300"
                />
              )}

              {/* Bounding Box Rect */}
              <rect
                x={`${box.x}%`}
                y={`${box.y}%`}
                width={`${box.width}%`}
                height={`${box.height}%`}
                fill="none"
                stroke={box.color}
                strokeWidth={strokeWidth}
                strokeDasharray={isSelected ? '0' : isHovered ? '2 2' : 'none'}
                filter="url(#glow-cyan)"
                className="transition-all duration-200"
              />

              {/* Corner Targets */}
              <g stroke={box.color} strokeWidth={2.5} fill="none">
                <path d={`M ${box.x}% ${box.y + 2}% L ${box.x}% ${box.y}% L ${box.x + 2}% ${box.y}%`} />
                <path d={`M ${box.x + box.width - 2}% ${box.y}% L ${box.x + box.width}% ${box.y}% L ${box.x + box.width}% ${box.y + 2}%`} />
                <path d={`M ${box.x}% ${box.y + box.height - 2}% L ${box.x}% ${box.y + box.height}% L ${box.x + 2}% ${box.y + box.height}%`} />
                <path d={`M ${box.x + box.width - 2}% ${box.y + box.height}% L ${box.x + box.width}% ${box.y + box.height}% L ${box.x + box.width}% ${box.y + box.height - 2}%`} />
              </g>
            </g>
          );
        })}
      </svg>

      {/* Interactive HTML Bounding Box Label Overlay */}
      {filteredBoxes.map((box) => {
        const isSelected = selectedBoxId === box.id;
        const isHovered = hoveredId === box.id;

        return (
          <div
            key={box.id}
            style={{
              left: `${box.x}%`,
              top: `${box.y}%`,
              width: `${box.width}%`,
              height: `${box.height}%`,
            }}
            onClick={() => onSelectBox(box)}
            onMouseEnter={() => setHoveredId(box.id)}
            onMouseLeave={() => setHoveredId(null)}
            className={`absolute pointer-events-auto cursor-pointer group transition-all duration-200 ${
              isSelected ? 'ring-2 ring-cyan-400/80 rounded-lg shadow-lg shadow-cyan-500/20' : ''
            }`}
          >
            {showLabels && (
              <div
                style={{ backgroundColor: `${box.color}dd` }}
                className={`absolute -top-7 left-0 px-2.5 py-0.5 rounded-md text-xs font-semibold text-white whitespace-nowrap shadow-md backdrop-blur-md flex items-center gap-1.5 transition-transform duration-200 ${
                  isSelected || isHovered ? 'scale-105 z-20 -top-8' : 'scale-100 z-10'
                }`}
              >
                <Crosshair className="w-3 h-3 text-white/90 animate-pulse" />
                <span>{box.label}</span>
                <span className="bg-black/40 px-1.5 py-0.2 rounded text-[10px] font-mono">
                  {(box.confidence * 100).toFixed(0)}%
                </span>
                {showDomainShiftBadge && (
                  <span className="text-[9px] bg-cyan-950/80 text-cyan-200 px-1 rounded font-mono border border-cyan-400/30">
                    DA:{(box.domainShiftIndex * 100).toFixed(0)}
                  </span>
                )}
              </div>
            )}

            {/* Selected box hover callout card */}
            {(isSelected || isHovered) && (
              <div className="absolute top-2 left-2 right-2 bg-slate-950/90 backdrop-blur-xl border border-cyan-500/40 p-2 rounded-lg text-white text-[11px] font-mono shadow-xl z-30 pointer-events-none">
                <div className="flex justify-between items-center text-cyan-300 font-bold mb-1">
                  <span>{box.label}</span>
                  <span className="text-emerald-400">{box.riskLevel} Risk</span>
                </div>
                <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-300">
                  <div>Est Area: <span className="text-white font-semibold">{box.estAreaCm2} cm²</span></div>
                  <div>Est Weight: <span className="text-white font-semibold">{box.estimatedWeightGrams} g</span></div>
                  <div>Depth: <span className="text-cyan-300">{box.depthMeters}m</span></div>
                  <div>Domain Robust: <span className="text-emerald-300">{(box.domainShiftIndex * 100).toFixed(1)}%</span></div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
