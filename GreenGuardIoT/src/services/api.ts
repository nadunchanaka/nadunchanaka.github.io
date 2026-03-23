import axios from "axios";

export const API_URL = "http://localhost:8082/api";

interface UISensorData {
  temperature: number;
  humidity: number;
  soilMoisture: number;
  co2: number;
  timestamp: string;
}

export const saveUIDataToBackend = async (data: UISensorData) => {
  try {
    const response = await axios.post(`${API_URL}/save-ui`, data);
    console.log(response.data); // "UI data saved to Firebase"
  } catch (err) {
    console.error("Failed to save UI data to backend", err);
  }
};
