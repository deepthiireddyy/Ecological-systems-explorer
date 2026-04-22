# 🌿💧 Ecological Systems Explorer

A full-stack geospatial web application for analyzing vegetation, water systems, and ecological balance using satellite data powered by **Google Earth Engine (GEE)**.

---

## ✨ Features

* 🗺 **AOI Selection**

  * Draw custom polygon
  * Upload GeoJSON
  * Use default boundary

* 🛰 **Satellite Imagery**

  * Sentinel-1 (Radar)
  * Sentinel-2 (Optical)
  * Cloud filtering

* 📊 **Spectral Indices**

  * NDVI (Vegetation Health)
  * NDWI (Water Detection)
  * RVI

* 🌿💧 **Blue–Green Infrastructure Mapping**

  * Vegetation classification
  * Water classification
  * Area statistics (km²)

* 🧭 **Interactive Map**

  * Layer toggle (AOI, imagery, NDVI, Blue-Green)
  * Basemap switch (Streets / Satellite)
  * Click tool (Lat/Lon)

* 📥 **Download**

  * Generate GeoTIFF links from GEE

---

## 🏗 Tech Stack

| Layer             | Technology          |
| ----------------- | ------------------- |
| Frontend          | React + Vite        |
| Styling           | Tailwind CSS        |
| Map               | React Leaflet       |
| State             | Zustand             |
| Backend           | Node.js + Express   |
| Geospatial Engine | Google Earth Engine |

---

## 📁 Project Structure

```
ecological-explorer/
├── backend/
├── frontend/
```

---

## 🚀 Run Locally

### Backend

```
cd backend
npm install
npm run dev
```

---

### Frontend

```
cd frontend
npm install --legacy-peer-deps
npm run dev
```

---

## 🔐 Setup Google Earth Engine

1. Create a service account in Google Cloud
2. Enable Earth Engine API
3. Download JSON key
4. Place it in:

```
backend/credentials/gee-service-account.json
```

> ⚠️ Do NOT upload this file to GitHub

---

## 🌐 API Endpoints

* `/api/imagery/composite`
* `/api/index/compute`
* `/api/bluegreen/system`
* `/api/download/generate-url`
* `/health`

---

## 🚀 Deployment

* Backend → Render
* Frontend → Vercel

---

## 👩‍💻 Author

Deepthi Reddy
Geospatial Developer | Remote Sensing | Climate Analytics

---
