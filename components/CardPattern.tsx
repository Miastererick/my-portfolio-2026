"use client";

import { useId, useMemo } from "react";

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
const BLACK_BARCODE_ROWS = 15;
const BLACK_BARCODE_COLS = 34;

function BeigeGridPattern() {
  const cells = useMemo(
    () =>
      Array.from({ length: BEIGE_CELL_COUNT }, (_, index) => ({
        color: Math.random() > 0.5 ? "#B0A89A" : "#D9D3C7",
        delay: Math.random() * 2.2,
        duration: 2.4 + Math.random() * 1.4,
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
  const diagonalLines = useMemo(() => Array.from({ length: 80 }, (_, i) => i), []);

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
      >
        {diagonalLines.map((i) => (
          <line
            key={`d-${i}`}
            x1={-20 + i * 3}
            y1={100}
            x2={30 + i * 3}
            y2={0}
            stroke="rgba(252,240,179,1)"
            strokeWidth="0.7"
            style={{
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
  const kBase = (2 * Math.PI) / 100;
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
        const k = kBase;
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
          delay: Math.random() * 1.8,
        };
      }),
    []
  );

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="h-full w-full"
      aria-hidden
    >
      {gridLines.map((line) =>
        line.isVertical ? (
          <line
            key={`gv-${line.key}`}
            x1={line.pos}
            y1={0}
            x2={line.pos}
            y2={100}
            className="cp-grid-flow"
            style={{
              stroke: "rgba(0, 77, 26,0.3)",
              strokeWidth: 0.22,
              strokeDasharray: "8 3",
              animationDelay: `${line.delay}s`,
            }}
          />
        ) : (
          <line
            key={`gh-${line.key}`}
            x1={0}
            y1={line.pos}
            x2={100}
            y2={line.pos}
            className="cp-grid-flow"
            style={{
              stroke: "rgba(0, 77, 26,0.3)",
              strokeWidth: 0.22,
              strokeDasharray: "8 3",
              animationDelay: `${line.delay}s`,
            }}
          />
        )
      )}

      <g className="cp-draw-wireframe-solid" style={{ animationDelay: "0s" }}>
        <rect x={4} y={8} width={92} height={84} rx={5.5} fill="none" />
      </g>
      <g className="cp-draw-wireframe-solid" style={{ animationDelay: "0.6s" }}>
        <rect x={8} y={12} width={22} height={76} rx={3.2} fill="none" />
      </g>
      <g className="cp-draw-wireframe-solid" style={{ animationDelay: "0.9s" }}>
        <rect x={70} y={12} width={22} height={76} rx={3.2} fill="none" />
      </g>
      <g className="cp-draw-wireframe-solid" style={{ animationDelay: "1.2s" }}>
        <ellipse cx={50} cy={44} rx={26} ry={20} fill="none" />
      </g>
      <g className="cp-draw-wireframe-solid" style={{ animationDelay: "1.5s" }}>
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
      <g className="cp-draw-wireframe" style={{ strokeDasharray: 1500, animationDelay: "0s" }}>
        <rect x={3.5} y={6} width={93} height={88} rx={6.5} fill="none" />
      </g>
      <g className="cp-draw-wireframe" style={{ strokeDasharray: 1500, animationDelay: "0.5s" }}>
        <rect x={8} y={10} width={84} height={12} rx={2} fill="none" />
      </g>
      <g className="cp-draw-wireframe" style={{ strokeDasharray: 1500, animationDelay: "1s" }}>
        <rect x={8} y={26} width={21} height={64} rx={2.8} fill="none" />
      </g>
      <g className="cp-draw-wireframe" style={{ strokeDasharray: 1500, animationDelay: "1.5s" }}>
        <rect x={33} y={26} width={59} height={28} rx={2.8} fill="none" />
      </g>
      <g className="cp-draw-wireframe" style={{ strokeDasharray: 1500, animationDelay: "2s" }}>
        <rect x={33} y={58} width={59} height={32} rx={2.8} fill="none" />
      </g>
    </svg>
  );
}

function BlackBarcodePattern() {
  const cells = useMemo(
    () =>
      Array.from(
        { length: BLACK_BARCODE_ROWS * BLACK_BARCODE_COLS },
        (_, index) => {
          const row = Math.floor(index / BLACK_BARCODE_COLS);
          const col = index % BLACK_BARCODE_COLS;
          const isLight = (row + col) % 2 === 0;
          return {
            key: index,
            row,
            col,
            color: isLight ? "rgba(255,255,255,0.86)" : "rgba(185,185,185,0.76)",
            delay: Math.random() * 1.9,
            duration: 5 + Math.random() * 1.3,
          };
        }
      ),
    []
  );

  return (
    <div
      style={{
        display: "grid",
        gridTemplateRows: `repeat(${BLACK_BARCODE_ROWS}, minmax(0, 1fr))`,
        rowGap: "0px",
        width: "100%",
        height: "100%",
        padding: "0",
      }}
    >
      {Array.from({ length: BLACK_BARCODE_ROWS }, (_, row) => (
        <div
          key={row}
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${BLACK_BARCODE_COLS}, minmax(0, 1fr))`,
            columnGap: "0px",
            alignItems: "center",
            justifyItems: "center",
            width: "100%",
            height: "100%",
          }}
        >
          {cells
            .filter((cell) => cell.row === row)
            .map((cell) => (
              <div
                key={cell.key}
                className="cp-slow-blink"
                style={{
                  width: "2px",
                  height: "8px",
                  borderRadius: "1px",
                  backgroundColor: cell.color,
                  animationDelay: `${cell.delay}s`,
                  animationDuration: `${cell.duration}s`,
                }}
              />
            ))}
        </div>
      ))}
    </div>
  );
}

export function CardPattern({ variant }: CardPatternProps) {
  let content = <OrangeWavesPattern />;
  if (variant === "beige-grid") content = <BeigeGridPattern />;
  if (variant === "blue-lines") content = <BlueLinesPattern />;
  if (variant === "green-wireframe") content = <GreenWireframePattern />;
  if (variant === "black-barcode") content = <BlackBarcodePattern />;
  if (variant === "black-wireframe") content = <BlackWireframePattern />;

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <style>{`
        @keyframes slowBlink {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.8; }
        }
        @keyframes waveVertical {
          0%, 100% { transform: scaleY(0.96); }
          50% { transform: scaleY(1.04); }
        }
        @keyframes ribbonFlow {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        @keyframes horizontalBreath {
          0%, 100% { transform: translateX(-1.2%) scaleX(0.985); }
          50% { transform: translateX(1.2%) scaleX(1.015); }
        }
        @keyframes drawWireframe {
          0% { stroke-dashoffset: 1500; opacity: 0.15; }
          65% { stroke-dashoffset: 0; opacity: 0.35; }
          100% { stroke-dashoffset: 0; opacity: 0.2; }
        }
        @keyframes drawWireframeSolid {
          0% { stroke-dashoffset: 1500; }
          65% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes gridFlow {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -20; }
        }
        .cp-slow-blink {
          animation: slowBlink 2.8s ease-in-out infinite;
        }
        .cp-wave-vertical {
          animation: waveVertical 6.2s ease-in-out infinite;
        }
        .cp-blue-ribbon-flow {
          will-change: transform;
          transform-box: fill-box;
        }
        .cp-horizontal-breathe {
          animation: horizontalBreath 6.8s ease-in-out infinite;
          transform-origin: center;
        }
        .cp-draw-wireframe {
          stroke: rgba(255, 255, 255, 0.2);
          stroke-width: 0.55;
          animation: drawWireframe 12s linear infinite;
        }
        .cp-draw-wireframe-solid {
          stroke: rgba(0, 77, 26,0.5);
          stroke-width: 0.8;
          animation: drawWireframeSolid 10s linear infinite;
        }
        .cp-grid-flow {
          animation: gridFlow 5.2s linear infinite;
        }
      `}</style>
      {content}
    </div>
  );
}
