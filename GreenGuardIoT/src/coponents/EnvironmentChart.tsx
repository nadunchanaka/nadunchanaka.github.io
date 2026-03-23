import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { HistoryData } from "../types/HistoryData";

interface Props {
  data: HistoryData[];
}

const EnvironmentChart: React.FC<Props> = ({ data }) => {
  return (
    <div className="chart-wrapper">
      <h2>📊 Greenhouse Environment Trends</h2>

      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="timestamp"
            tickFormatter={(t) => new Date(t).toLocaleTimeString()}
          />
          <YAxis />
          <Tooltip labelFormatter={(t) => new Date(t).toLocaleString()} />
          <Legend />

          <Line
            type="monotone"
            dataKey="temperature"
            name="Temperature (°C)"
            stroke="#ef4444"
          />
          <Line
            type="monotone"
            dataKey="humidity"
            name="Humidity (%)"
            stroke="#3b82f6"
          />
          <Line
            type="monotone"
            dataKey="soilMoisture"
            name="Soil Moisture (%)"
            stroke="#10b981"
          />
          <Line
            type="monotone"
            dataKey="co2"
            name="CO₂ (ppm)"
            stroke="#a78bfa"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EnvironmentChart;
