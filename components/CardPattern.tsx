"use client";

import { memo, useId, useMemo, type CSSProperties } from "react";

type CardPatternVariant =
  | "beige-grid"
  | "orange-waves"
  | "blue-lines"
  | "green-wireframe"
  | "black-barcode"
  | "black-wireframe";

type CardPatternProps = {
  variant: CardPatternVariant;
};

const ORANGE_LINE_COUNT = 45;
const BEIGE_CELL_COUNT = 44;
const BLUE_RIBBON_COUNT = 13;
const BLUE_RIBBON_THICKNESS_SCALE = 0.35;
const GREEN_GRID_COLS = 30;
const GREEN_GRID_ROWS = 22;
const BLACK_BARCODE_ROWS = 12;
const BLACK_BARCODE_COLS = 34;
const GPU_ANIM_STYLE = { willChange: "transform, opacity", transform: "translateZ(0)" } as const;

// Stable variation keeps server and client markup identical.
function variation(index: number, salt = 0) {
  const value = Math.sin((index + 1) * 12.9898 + salt * 78.233) * 43758.5453;
  return value - Math.floor(value);
}

function BeigeGridPattern() {
  const cells = useMemo(
    () =>
      Array.from({ length: BEIGE_CELL_COUNT }, (_, index) => ({
        color: variation(index) > 0.5 ? "#B0A89A" : "#D9D3C7",
        delay: variation(index, 1) * 2.2,
        duration: 2.4 + variation(index, 2) * 1.4,
        key: index,
      })),
    []
  );

  return (
    <div
      className="cp-beige-grid"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(8, minmax(0, 1fr))",
        gridTemplateRows: "repeat(6, minmax(0, 1fr))",
        gap: "2px",
        width: "100%",
        height: "100%",
        padding: "2px",
      }}
    >
      {cells.map((cell) => (
        <div
          key={cell.key}
          className="cp-slow-blink"
          style={{
            backgroundColor: cell.color,
            animationDelay: `${cell.delay}s`,
            animationDuration: `${cell.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

function OrangeWavesPattern() {
  const clipId = useId().replace(/:/g, "");
  const verticalLines = useMemo(() => Array.from({ length: 30 }, (_, i) => i), []);
  const diagonalLines = useMemo(() => Array.from({ length: ORANGE_LINE_COUNT }, (_, i) => i), []);

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="h-full w-full"
      aria-hidden
    >
      <defs>
        <clipPath id={`letter-a-mask-${clipId}`}>
          <text
            x="50%"
            y="50%"
            fontSize="130"
            fontWeight="900"
            fontFamily="Times New Roman, serif"
            fontStyle="italic"
            textAnchor="middle"
            dominantBaseline="central"
            transform="translate(0, 2)"
          >
            A
          </text>
        </clipPath>
      </defs>

      {verticalLines.map((i) => (
        <line
          key={`v-${i}`}
          x1={(i / (verticalLines.length - 1)) * 100}
          y1="0"
          x2={(i / (verticalLines.length - 1)) * 100}
          y2="100"
          stroke="rgba(252,240,179,0.88)"
          strokeWidth="0.45"
        />
      ))}

      <g
        clipPath={`url(#letter-a-mask-${clipId})`}
        className="cp-horizontal-breathe"
        style={GPU_ANIM_STYLE}
      >
        {diagonalLines.map((i) => (
          <line
            key={`d-${i}`}
            x1={-20 + i * 3}
            y1={100}
            x2={30 + i * 3}
            y2={0}
            stroke="rgba(252,240,179,1)"
            strokeWidth="1"
            style={{
              ...GPU_ANIM_STYLE,
              animation: "waveVertical 4.8s ease-in-out infinite",
              animationDelay: `${i * 0.1}s`,
              transformOrigin: "center",
            }}
          />
        ))}
      </g>
    </svg>
  );
}

function fmtPath(n: number) {
  return n.toFixed(3);
}

/** Closed filled ribbon: top/bottom are C¹ sine waves with phase offset → variable thickness. x spans 3×period for seamless ribbonFlow. */
function buildRibbonPathD(
  xMin: number,
  xMax: number,
  segments: number,
  k: number,
  center: number,
  ampTop: number,
  ampBot: number,
  phaseTop: number,
  phaseBot: number,
  verticalBias: number
) {
  const top = (x: number) => center + ampTop * Math.sin(k * x + phaseTop);
  const bot = (x: number) => center + verticalBias + ampBot * Math.sin(k * x + phaseBot);
  const topP = (x: number) => ampTop * k * Math.cos(k * x + phaseTop);
  const botP = (x: number) => ampBot * k * Math.cos(k * x + phaseBot);

  const step = (xMax - xMin) / segments;
  let d = `M ${xMin} ${fmtPath(top(xMin))}`;
  for (let i = 0; i < segments; i++) {
    const x0 = xMin + i * step;
    const x1 = xMin + (i + 1) * step;
    const s = (x1 - x0) / 3;
    const y0 = top(x0);
    const y1 = top(x1);
    d += ` C ${fmtPath(x0 + s)} ${fmtPath(y0 + s * topP(x0))} ${fmtPath(x1 - s)} ${fmtPath(y1 - s * topP(x1))} ${x1} ${fmtPath(y1)}`;
  }
  d += ` L ${xMax} ${fmtPath(bot(xMax))}`;
  for (let i = segments; i > 0; i--) {
    const x1 = xMin + i * step;
    const x0 = xMin + (i - 1) * step;
    const s = (x1 - x0) / 3;
    d += ` C ${fmtPath(x1 - s)} ${fmtPath(bot(x1) - s * botP(x1))} ${fmtPath(x0 + s)} ${fmtPath(bot(x0) + s * botP(x0))} ${x0} ${fmtPath(bot(x0))}`;
  }
  d += " Z";
  return d;
}

function BlueLinesPattern() {
  const ribbons = useMemo(
    () =>
      Array.from({ length: BLUE_RIBBON_COUNT }, (_, i) => {
        const t = i / (BLUE_RIBBON_COUNT - 1 || 1);
        const center = (100 / (BLUE_RIBBON_COUNT + 1)) * (i + 1);
        const phaseTop = i * 0.55 + i * i * 0.04;
        const phaseBot = phaseTop + 0.85 + (i % 4) * 0.11;
        const ampTop = (2.1 + (i % 3) * 0.45) * BLUE_RIBBON_THICKNESS_SCALE;
        const ampBot = (2.1 + (i % 3) * 0.42) * BLUE_RIBBON_THICKNESS_SCALE;
        const verticalBias = (3.2 + (i % 2) * 0.55) * BLUE_RIBBON_THICKNESS_SCALE;
        const k = (2 * Math.PI) / 100;
        const opacity = 0.4 + t * 0.8;
        const duration = 12 + t * 0.5;
        return {
          key: i,
          d: buildRibbonPathD(0, 300, 20, k, center, ampTop, ampBot, phaseTop, phaseBot, verticalBias),
          opacity,
          duration,
        };
      }),
    []
  );

  return (
    <svg
      viewBox="0 0 300 100"
      preserveAspectRatio="none"
      className="block h-full min-h-0 w-[300%] shrink-0 -ml-[100%]"
      aria-hidden
    >
      {ribbons.map((ribbon) => (
        <g
          key={ribbon.key}
          className="cp-blue-ribbon-flow"
          style={{
            ...GPU_ANIM_STYLE,
            animation: `ribbonFlow ${ribbon.duration}s linear infinite alternate`,
          }}
        >
          <path d={ribbon.d} fill="#ABFCFE" fillOpacity={ribbon.opacity} />
        </g>
      ))}
    </svg>
  );
}

function GreenWireframePattern() {
  const gridLines = useMemo(
    () =>
      Array.from({ length: GREEN_GRID_COLS + GREEN_GRID_ROWS }, (_, index) => {
        const isVertical = index < GREEN_GRID_COLS;
        const pos = isVertical
          ? ((index + 1) / (GREEN_GRID_COLS + 1)) * 100
          : ((index - GREEN_GRID_COLS + 1) / (GREEN_GRID_ROWS + 1)) * 100;
        return {
          key: index,
          isVertical,
          pos,
        };
      }),
    []
  );

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="pointer-events-none h-full w-full"
      style={{ contain: "strict" }}
      aria-hidden
    >
      <style>{`
        @keyframes greenLeftLayout {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(10px, 0) scale(0.9, 0.93); }
          50% { transform: translate(15px, 8px) scale(0.8, 0.76); }
          75% { transform: translate(5px, -5px) scale(1, 0.9); }
        }
        @keyframes greenRightLayout {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(-10px, 0) scale(0.9, 0.93); }
          50% { transform: translate(-15px, -8px) scale(0.8, 0.76); }
          75% { transform: translate(-5px, 5px) scale(1, 0.9); }
        }
        @keyframes greenUpperRingLayout {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(-7px, 6px) scale(0.9, 0.83); }
          50% { transform: translate(0, 11px) scale(1.16, 0.67); }
          75% { transform: translate(7px, 0) scale(0.82, 1.04); }
        }
        @keyframes greenLowerRingLayout {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(7px, -6px) scale(0.9, 0.83); }
          50% { transform: translate(0, -11px) scale(1.16, 0.67); }
          75% { transform: translate(-7px, 0) scale(0.82, 1.04); }
        }
        .cp-green-line {
          stroke: rgba(0, 77, 26, 0.5);
          stroke-width: 0.8;
          fill: none;
        }
        .cp-green-layout {
          transform-box: fill-box;
          transform-origin: center;
          animation-duration: 4s;
          animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
          animation-iteration-count: infinite;
        }
        .cp-green-left { animation-name: greenLeftLayout; }
        .cp-green-right { animation-name: greenRightLayout; }
        .cp-green-upper-ring { animation-name: greenUpperRingLayout; }
        .cp-green-lower-ring { animation-name: greenLowerRingLayout; }
      `}</style>
      <g
        className="cp-grid-flow"
        style={{ stroke: "rgba(0, 77, 26,0.3)", strokeWidth: 0.22, strokeDasharray: "8 3" }}
      >
        {gridLines.filter((line) => line.isVertical).map((line) => (
          <line
            key={`gv-${line.key}`}
            x1={line.pos}
            y1={0}
            x2={line.pos}
            y2={100}
          />
        ))}
      </g>
      <g
        className="cp-grid-flow"
        style={{ stroke: "rgba(0, 77, 26,0.3)", strokeWidth: 0.22, strokeDasharray: "8 3", animationDelay: "-1.3s" }}
      >
        {gridLines.filter((line) => !line.isVertical).map((line) => (
          <line
            key={`gh-${line.key}`}
            x1={0}
            y1={line.pos}
            x2={100}
            y2={line.pos}
          />
        ))}
      </g>

      <g className="cp-green-line">
        <rect x={4} y={8} width={92} height={84} rx={5.5} fill="none" />
      </g>
      <g className="cp-green-line cp-green-layout cp-green-left" style={{ animationDelay: "0.15s" }}>
        <rect x={8} y={12} width={22} height={76} rx={3.2} fill="none" />
      </g>
      <g className="cp-green-line cp-green-layout cp-green-right" style={{ animationDelay: "0.3s" }}>
        <rect x={70} y={12} width={22} height={76} rx={3.2} fill="none" />
      </g>
      <g className="cp-green-line cp-green-layout cp-green-upper-ring" style={{ animationDelay: "0.45s" }}>
        <ellipse cx={50} cy={44} rx={26} ry={20} fill="none" />
      </g>
      <g className="cp-green-line cp-green-layout cp-green-lower-ring" style={{ animationDelay: "0.6s" }}>
        <ellipse cx={50} cy={56} rx={26} ry={20} fill="none" />
      </g>
    </svg>
  );
}

function BlackWireframePattern() {
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="h-full w-full"
      aria-hidden
    >
      <g
        className="cp-draw-wireframe"
        style={{ ...GPU_ANIM_STYLE, strokeDasharray: 1500, animationDelay: "0s" }}
      >
        <rect x={3.5} y={6} width={93} height={88} rx={6.5} fill="none" />
      </g>
      <g
        className="cp-draw-wireframe"
        style={{ ...GPU_ANIM_STYLE, strokeDasharray: 1500, animationDelay: "0.5s" }}
      >
        <rect x={8} y={10} width={84} height={12} rx={2} fill="none" />
      </g>
      <g
        className="cp-draw-wireframe"
        style={{ ...GPU_ANIM_STYLE, strokeDasharray: 1500, animationDelay: "1s" }}
      >
        <rect x={8} y={26} width={21} height={64} rx={2.8} fill="none" />
      </g>
      <g
        className="cp-draw-wireframe"
        style={{ ...GPU_ANIM_STYLE, strokeDasharray: 1500, animationDelay: "1.5s" }}
      >
        <rect x={33} y={26} width={59} height={28} rx={2.8} fill="none" />
      </g>
      <g
        className="cp-draw-wireframe"
        style={{ ...GPU_ANIM_STYLE, strokeDasharray: 1500, animationDelay: "2s" }}
      >
        <rect x={33} y={58} width={59} height={32} rx={2.8} fill="none" />
      </g>
    </svg>
  );
}

function BlackBarcodePattern() {
  const patternId = useId().replace(/:/g, "");
  const highlights = useMemo(
    () =>
      Array.from({ length:28 }, (_, index) => {
        const cell = Math.floor(index * (BLACK_BARCODE_ROWS * BLACK_BARCODE_COLS / 28) + variation(index, 6) * 10);
        const row = Math.floor(cell / BLACK_BARCODE_COLS);
        const col = cell % BLACK_BARCODE_COLS;
        const duration = 8 + variation(index, 2) * 0.6;
        const stepX = col === 0 ? 1 : col === BLACK_BARCODE_COLS - 1 ? -1 : variation(index, 7) < 0.5 ? -1 : 1;
        const stepY = row === 0 ? 1 : row === BLACK_BARCODE_ROWS - 1 ? -1 : variation(index, 8) < 0.5 ? -1 : 1;
        return {
          key: index,
          row,
          col,
          delay: -variation(index, 4) * duration,
          duration,
          stepX: `${stepX * 10}px`,
          stepY: `${stepY * 10}px`,
        };
      }),
    []
  );

  return (
    <svg
      viewBox={`0 0 ${BLACK_BARCODE_COLS * 10} ${BLACK_BARCODE_ROWS * 10}`}
      preserveAspectRatio="none"
      className="h-full w-full"
      aria-hidden
    >
      <style>{`
        @keyframes barcodeHighlightHop {
          0%, 100% { transform: translate(0, 0); opacity: 0.3; }
          25% { transform: translate(var(--highlight-step-x), 0); opacity: 1; }
          50% { transform: translate(var(--highlight-step-x), var(--highlight-step-y)); opacity: 0.65; }
          75% { transform: translate(0, var(--highlight-step-y)); opacity: 1; }
        }
        .cp-highlight-hop {
          animation: barcodeHighlightHop 4.8s steps(1, end) infinite;
          transform-box: fill-box;
        }
      `}</style>
      <defs>
        <pattern
          id={`${patternId}-base`}
          width="10"
          height="10"
          patternUnits="userSpaceOnUse"
        >
          <rect x="4" y="1" width="2" height="8" rx="1" fill="white" fillOpacity="0.34" />
        </pattern>
      </defs>
      <rect
        width={BLACK_BARCODE_COLS * 10}
        height={BLACK_BARCODE_ROWS * 10}
        fill={`url(#${patternId}-base)`}
      />
      {highlights.map((cell) => (
        <rect
          key={cell.key}
          className="cp-highlight-hop"
          x={cell.col * 10 + 4}
          y={cell.row * 10 + 1}
          width="2"
          height="8"
          rx="1"
          fill="white"
          style={{
            animationDelay: `${cell.delay}s`,
            animationDuration: `${cell.duration}s`,
            "--highlight-step-x": cell.stepX,
            "--highlight-step-y": cell.stepY,
          } as CSSProperties}
        />
      ))}
    </svg>
  );
}

export const CardPattern = memo(function CardPattern({ variant }: CardPatternProps) {
  let content = <OrangeWavesPattern />;
  if (variant === "beige-grid") content = <BeigeGridPattern />;
  if (variant === "blue-lines") content = <BlueLinesPattern />;
  if (variant === "green-wireframe") content = <GreenWireframePattern />;
  if (variant === "black-barcode") content = <BlackBarcodePattern />;
  if (variant === "black-wireframe") content = <BlackWireframePattern />;

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {content}
    </div>
  );
});
