import React, { useEffect, useState } from "react";
import EnvironmentChart from "./EnvironmentChart";
import SensorCard from "./SensorCard";
import type { SensorData } from "../types/SensorData";
import type { HistoryData } from "../types/HistoryData";
import { getHistory, getCurrent, API_URL } from "../services/api";

export default function DashBoard() {
  const [current, setCurrent] = useState<SensorData | null>(null);
  const [history, setHistory] = useState<HistoryData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  useEffect(() => {
    // initial load
    loadHistory();
    loadCurrent();

    const poll = setInterval(() => {
      loadCurrent();
      loadHistory();
    }, 3000);

    return () => {
      clearInterval(poll);
      // nothing to clean up for WebSocket (removed)
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadHistory = async () => {
    try {
      const resp = await getHistory();
      // server may return array directly or an object like { data: [...] }
      const payload = resp.data;
      const list = Array.isArray(payload)
        ? payload
        : Array.isArray((payload as any).data)
        ? (payload as any).data
        : []; 
      setHistory(list);
    } catch (err) {
      console.error("Error loading history", err);
      setError(String(err));
    }
  };

  const loadCurrent = async () => {
    try {
      setLoading(true);
      setError(null);
      const resp = await getCurrent();
      setCurrent(resp.data);
      setLastUpdated(new Date().toLocaleString());
      // also append to history view for sparkline/chart if timestampless
      setHistory((h) => {
        const entry: HistoryData = {
          timestamp: new Date().getTime(),
          temperature: resp.data.temperature,
          humidity: resp.data.humidity,
          soilMoisture: resp.data.soilMoisture,
          co2: resp.data.co2,
        };
        const merged = [...h, entry].slice(-120); // keep last 120 points
        return merged;
      });
    } catch (err) {
      console.error("Error loading current", err);
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  // WebSocket logic removed; app uses simple polling.

  const tempHistory = Array.isArray(history)
    ? history.map((h) => h.temperature)
    : [];
  const humHistory = Array.isArray(history)
    ? history.map((h) => h.humidity)
    : [];
  const soilHistory = Array.isArray(history)
    ? history.map((h) => h.soilMoisture)
    : [];
  const co2History = Array.isArray(history)
    ? history.map((h) => h.co2 ?? 0)
    : [];
  return (
    <div className="dashboard">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1 style={{ margin: 0 }}>🌱 Greenhouse Dashboard</h1>
        <div>
          <button
            onClick={() => {
              loadCurrent();
              loadHistory();
            }}
            disabled={loading}
            style={{ marginRight: 8 }}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>
      <div
        style={{ marginTop: 8, marginBottom: 8, color: "#666", fontSize: 13 }}
      >
        <span>Last updated: {lastUpdated ?? "—"}</span>
        {error && (
          <span style={{ color: "#c53030", marginLeft: 12 }}>
            Error: {error}
          </span>
        )}
      </div>

      <div className="card-grid">
        <SensorCard
          title="Temperature"
          value={current?.temperature}
          unit="°C"
          history={tempHistory}
          decimals={1}
          thresholds={{ warn: [15, 30], danger: [5, 40] }}
        />
        <SensorCard
          title="Humidity"
          value={current?.humidity}
          unit="%"
          history={humHistory}
          decimals={0}
          thresholds={{ warn: [30, 70], danger: [10, 90] }}
        />
        <SensorCard
          title="Soil Moisture"
          value={current?.soilMoisture}
          unit="%"
          history={soilHistory}
          decimals={0}
          thresholds={{ warn: [20, 60], danger: [0, 10] }}
        />
        <SensorCard
          title="CO₂ Level"
          value={current?.co2}
          unit="ppm"
          history={co2History}
          decimals={0}
          thresholds={{ warn: [400, 1000], danger: [1000, 5000] }}
        />
      </div>

      <div className="chart-wrapper">
        <EnvironmentChart data={history} />
      </div>
    </div>
  );
}
