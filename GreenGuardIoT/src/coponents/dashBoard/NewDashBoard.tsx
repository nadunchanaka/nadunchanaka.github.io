import React, { useEffect, useState } from "react";

import "./Dashboard.css";
import co2 from "../../assets/CO2-icon.png";
import temprerature from "../../assets/Temperarure-icon.png";
import solimoisture from "../../assets/Soil.moisture-icon.png";
import humidity from "../../assets/Humidity-icon.png";
import { ref, onValue } from "firebase/database";
import { rtdb } from "../../services/firebase";
import { saveUIDataToBackend } from "../../services/api";
import { PieChart, Pie, Cell } from "recharts";

// NavBar provided by MainLayout sidebar

interface SensorData {
  epoch: number;
  temp: number;
  humidity: number;
  soilMoisture: number;
  co2?: number;
  time: string;
}
interface GaugeCardProps {
  icon: React.ReactNode;
  title: string;
  value: number;
  min: number;
  max: number;
  unit: string;
}

const GaugeCard: React.FC<GaugeCardProps> = ({
  icon,
  title,
  value,
  min,
  max,
  unit,
}) => {
  const percentage = Math.min(Math.max((value - min) / (max - min), 0), 1);
  const data = [
    { name: "value", value: percentage * 100 },
    { name: "remaining", value: (1 - percentage) * 100 },
  ];

  // Color gradient from green (min) to red (max)
  const getGaugeColor = (percentage: number) => {
    const hue = 120 - (percentage * 120); // 120 = green, 0 = red
    return `hsl(${hue}, 70%, 50%)`;
  };

  const colors = [getGaugeColor(percentage), "#e5e7eb"];

  return (
    <div className="gauge-card">
      <div className="gauge-header">
        <span className="gauge-icon">{icon}</span>
        <h4>{title}</h4>
      </div>
      <div className="gauge-chart">
        <PieChart width={200} height={120}>
          <Pie
            data={data}
            cx="50%"
            cy="80%"
            startAngle={180}
            endAngle={0}
            innerRadius={60}
            outerRadius={90}
            paddingAngle={0}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index]} />
            ))}
          </Pie>
        </PieChart>
        <div className="gauge-value">
          {value}{unit}
        </div>
      </div>
      <div className="gauge-scale">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const [data, setData] = useState<SensorData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const res = await getCurrent();
  //       setData(res.data);
  //     } catch (err) {
  //       setError("Failed to load sensor data");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();

  //   // optional: auto-refresh every 5 seconds
  //   const interval = setInterval(fetchData, 5000);
  //   return () => clearInterval(interval);
  // }, []);
  useEffect(() => {
    const envRef = ref(rtdb, "env");

    const unsubscribe = onValue(envRef, (snapshot) => {
      console.log("Firebase onValue fired for path 'env'. snapshot.exists:", snapshot.exists());
      console.log("Firebase snapshot raw value:", snapshot.val());
      if (snapshot.exists()) {
        const raw = snapshot.val() as any;
        const sensorData: SensorData = {
          epoch: raw.epoch ?? 0,
          temp: raw.temp ?? 0,
          humidity: raw.humidity ?? raw.rh ?? 0,
          soilMoisture: raw.soilMoisture ?? raw.soilmo ?? 0,
          co2: raw.co2 ?? 0,
          time: raw.time ?? raw.timw ?? new Date().toISOString(),
        };
        console.log("Parsed sensorData:", sensorData);
        setData(sensorData);
      } else {
        console.warn("No data found at 'env' path. Please insert manual sample data or update your ESP32 write path.");
        setData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!data) return;

    saveUIDataToBackend({
      temperature: data.temp,
      humidity: data.humidity,
      soilMoisture: data.soilMoisture,
      co2: data.co2 ?? 0,
      timestamp: data.time,
    });
  }, [data]);

  if (loading) {
    return <p className="status-text">Loading sensor data...</p>;
  }

  if (error) {
    return <p className="status-text error">{error}</p>;
  }

  if (!data) {
    return <p className="status-text">No data available</p>;
  }

  // const formattedTime =
  //   data.timestamp !== undefined
  //     ? new Date(data.timestamp).toLocaleString()
  //     : "";

  return (
    <>
      <div className="dashboard-page">
        <main className="dashboard-content">
          <div>
            <h3 className="dashboard-card-h3">Real-Time Sensor Values</h3>
            <p className="sub-text-time">
              Last updated: <span className="timestamp">{data.time}</span>
            </p>
            <p className="sub-text">Live monitoring from ESP32</p>
          </div>
          {/* Content */}
          <div className="dashboard-inner">
            <div className="dashboard-card">
              <div className="metrics-grid">
                <GaugeCard
                  icon={<img src={temprerature} alt="Temperature" />}
                  title="Temperature"
                  value={data.temp}
                  min={0}
                  max={50}
                  unit="°C"
                />

                <GaugeCard
                  icon={<img src={humidity} alt="Humidity" />}
                  title="Humidity"
                  value={data.humidity}
                  min={0}
                  max={100}
                  unit="%"
                />

                <GaugeCard
                  icon={<img src={solimoisture} alt="Soil-Moisture" />}
                  title="Soil Moisture"
                  value={data.soilMoisture}
                  min={0}
                  max={100}
                  unit="%"
                />

                <GaugeCard
                  icon={<img src={co2} alt="CO₂-Level" />}
                  title="CO₂ Level"
                  value={data.co2 ?? 0}
                  min={0}
                  max={2000}
                  unit=" ppm"
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Dashboard;
