#include <Arduino.h>

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <time.h>

// ===================== WIFI CONFIG =====================
const char* ssid = "CyberNet";        // 🔹 Your WiFi name
const char* password = "Alnilam@NC"; // 🔹 Your WiFi password

// ===================== NTP TIME CONFIG =====================
const char* ntpServer = "pool.ntp.org";
const long gmtOffset_sec = 19800;          // Colombo, Sri Lanka (UTC+5:30)
const int daylightOffset_sec = 0;          // No daylight saving

// ===================== FIREBASE REALTIME DATABASE CONFIG =====================
const char* firebaseHost = "https://green-house-iot-ab0c9-default-rtdb.asia-southeast1.firebasedatabase.app";
const char* firebaseAuth = "ddOeWg49woYIQl3mXMWgxDePTW19JrpoM30iFB53";

// ===================== TIMING =====================
unsigned long lastSend = 0;
const int interval = 5000; // 5 seconds

// ===================== FUNCTION: Sync Time with NTP =====================
void syncTimeWithNTP() {
  Serial.println("\n⏰ Syncing time with NTP server...");
  
  // Configure time with NTP server
  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);
  
  Serial.print("⏳ Waiting for NTP time sync: ");
  time_t now = time(nullptr);
  int timeout = 20;
  
  while (now < 24 * 3600 && timeout > 0) {
    delay(500);
    Serial.print(".");
    timeout--;
    now = time(nullptr);
  }
  
  Serial.println();
  struct tm* timeinfo = localtime(&now);
  Serial.print("✅ Current time: ");
  Serial.println(asctime(timeinfo));
}

// ===================== FUNCTION: Generate Custom Document ID =====================
String generateCustomDocumentId() {
  time_t now = time(nullptr);
  struct tm* timeinfo = localtime(&now);
  
  // Format: YYYYMMDD_HHmmss_milliseconds
  char docId[30];
  strftime(docId, sizeof(docId), "%Y%m%d_%H%M%S", timeinfo);
  
  // Get milliseconds (using millis() since boot)
  uint32_t ms = millis() % 1000;
  strcat(docId, "_");
  strcat(docId, String(ms).c_str());
  
  return String(docId);
}

// ===================== FUNCTION: Create Document JSON =====================
String createSensorDocument(int co2, int humidity, int soilMoisture, float temp) {
  StaticJsonDocument<256> doc;
  
  // Add sensor data
  doc["co2"] = co2;
  doc["humidity"] = humidity;
  doc["soilMoisture"] = soilMoisture;
  doc["temperature"] = temp;
  
  // Add timestamp (ISO 8601 format)
  time_t now = time(nullptr);
  struct tm* timeinfo = localtime(&now);
  char timestamp[30];
  strftime(timestamp, sizeof(timestamp), "%Y-%m-%dT%H:%M:%SZ", timeinfo);
  doc["timestamp"] = timestamp;
  
  // Add device info
  doc["device"] = "ESP32-GreenHouse";
  
  // Serialize to string
  String jsonString;
  serializeJson(doc, jsonString);
  
  return jsonString;
}

// ===================== FUNCTION: Send to Firebase Realtime Database =====================
void sendToFirebase(int co2, int humidity, int soilMoisture, float temp) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("❌ WiFi Disconnected!");
    return;
  }

  HTTPClient http;
  
  // Generate custom document ID: YYYYMMDD_HHmmss_milliseconds
  String docId = generateCustomDocumentId();
  
  // Build Firebase URL with path structure and auth
  // Path: /sensor_readings/{documentId}.json?auth={firebaseAuth}
  String url = String(firebaseHost) + "/sensor_readings/" + docId + ".json?auth=" + String(firebaseAuth);
  
  // Create JSON payload
  String payload = createSensorDocument(co2, humidity, soilMoisture, temp);
  
  Serial.println("\n📡 Sending to Firebase Realtime Database...");
  Serial.println("Document ID: " + docId);
  Serial.println("URL: " + url);
  Serial.println("Payload: " + payload);
  
  http.begin(url);
  http.addHeader("Content-Type", "application/json");
  
  // Use PUT to create/update document with custom ID
  int httpResponseCode = http.PUT(payload);
  
  Serial.println("Response Code: " + String(httpResponseCode));
  
  if (httpResponseCode == 200) {
    Serial.println("✅ Data sent successfully to Firebase!");
    Serial.println("📍 Document ID: " + docId);
  } else {
    Serial.println("⚠️ Response Code: " + String(httpResponseCode));
    String response = http.getString();
    if (response.length() > 0) {
      Serial.println("Response: " + response.substring(0, 100));
    }
  }
  
  http.end();
}

// ===================== SETUP =====================
void setup() {
  Serial.begin(115200);
  delay(1000);

  Serial.println("\n🔌 Connecting to WiFi...");
  WiFi.begin(ssid, password);

  int wifiTimeout = 20;
  while (WiFi.status() != WL_CONNECTED && wifiTimeout > 0) {
    delay(500);
    Serial.print(".");
    wifiTimeout--;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n✅ WiFi Connected!");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());
    
    // Sync time after WiFi is connected
    syncTimeWithNTP();
  } else {
    Serial.println("\n❌ WiFi Connection Failed!");
  }
}

// ===================== LOOP =====================
void loop() {
  if (millis() - lastSend > interval) {
    lastSend = millis();

    // 🔹 Simulate sensor readings
    int co2 = random(400, 2000);
    int humidity = random(30, 80);
    int soilMoisture = random(20, 80);
    float temp = random(200, 350) / 10.0;

    Serial.println("\n📊 Sensor Data:");
    Serial.println("  CO2: " + String(co2) + " ppm");
    Serial.println("  Humidity: " + String(humidity) + "%");
    Serial.println("  Soil Moisture: " + String(soilMoisture) + "%");
    Serial.println("  Temperature: " + String(temp) + "°C");

    // Send to Firebase Realtime Database
    sendToFirebase(co2, humidity, soilMoisture, temp);
  }
}