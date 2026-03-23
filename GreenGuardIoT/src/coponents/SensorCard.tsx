import React from "react";

interface SensorCardProps {
  title: string;
  value?: number;
  unit: string;
  history?: number[]; // recent values for sparkline
  decimals?: number;
  thresholds?: {
    warn?: [number, number];
    danger?: [number, number];
  };
}

const SensorCard: React.FC<SensorCardProps> = ({
  title,
  value,
  unit,
  history = [],
  decimals = 1,
  thresholds,
}) => {
  const display =
    value === undefined || value === null ? "--" : value.toFixed(decimals);

  const getStatusColor = () => {
    if (value === undefined || value === null) return "#444";
    if (
      thresholds?.danger &&
      (value < thresholds.danger[0] || value > thresholds.danger[1])
    )
      return "#c53030";
    if (
      thresholds?.warn &&
      (value < thresholds.warn[0] || value > thresholds.warn[1])
    )
      return "#dd6b20";
    return "#2b6cb0";
  };

  const sparkline = (vals: number[]) => {
    const w = 120;
    const h = 36;
    if (!vals || vals.length === 0) return <svg width={w} height={h} />;
    // sanitize values: keep only finite numbers
    const nums = vals.filter((v) => Number.isFinite(v));
    if (nums.length === 0) return <svg width={w} height={h} />;
    if (nums.length === 1) {
      const x = w / 2;
      const y = h / 2;
      return (
        <svg width={w} height={h} style={{ display: "block", marginTop: 8 }}>
          <circle cx={x} cy={y} r={2} fill="#60a5fa" />
        </svg>
      );
    }
    const max = Math.max(...nums);
    const min = Math.min(...nums);
    const range = max - min || 1;
    const denom = nums.length - 1 || 1;
    const points = nums.map((v, i) => {
      const x = (i / denom) * w;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    });
    const last = vals[vals.length - 1];
    const prev = vals[vals.length - 2];
    const trendUp = prev === undefined ? null : last > prev;

    return (
      <svg width={w} height={h} style={{ display: "block", marginTop: 8 }}>
        <polyline
          fill="none"
          stroke="#60a5fa"
          strokeWidth={2}
          points={points.join(" ")}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {trendUp !== null && (
          <text
            x={w - 4}
            y={12}
            fontSize={10}
            textAnchor="end"
            fill={trendUp ? "#16a34a" : "#ef4444"}
          >
            {trendUp ? "▲" : "▼"}
          </text>
        )}
      </svg>
    );
  };

  return (
    <div
      className="sensor-card"
      style={{ borderLeft: `6px solid ${getStatusColor()}` }}
    >
      <div className="sensor-card-header">
        <h4>{title}</h4>
        <div className="sensor-card-value">
          <div className="sensor-value">{display}</div>
          <div className="sensor-unit">{unit}</div>
        </div>
      </div>
      {
        // keep svg sizing but use class for spacing
        <div className="sparkline">{sparkline(history)}</div>
      }
    </div>
  );
};

export default SensorCard;
