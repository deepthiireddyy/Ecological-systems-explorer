# 🌿💧 Ecological Systems Explorer

A full-stack web application replicating the Google Earth Engine Ecological Systems portal using **React + Vite + Tailwind CSS** (frontend) and **Node.js + Express + GEE SDK** (backend).

---

## 📁 Project Structure

```
ecological-explorer/
├── backend/
│   ├── credentials/
│   │   └── gee-service-account.json   ← PUT YOUR FILE HERE
│   ├── src/
│   │   ├── app.js
│   │   ├── routes/
│   │   │   ├── imagery.js
│   │   │   ├── index.js
│   │   │   ├── bluegreen.js
│   │   │   └── download.js
│   │   └── services/
│   │       ├── gee.service.js
│   │       ├── imagery.service.js
│   │       ├── index.service.js
│   │       ├── bluegreen.service.js
│   │       └── download.service.js
│   ├── .env
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── layout/     Sidebar.jsx
    │   │   ├── map/        MapView.jsx, Legend.jsx
    │   │   ├── sidebar/    AOIControls, SensorSelector, DateRangePicker,
    │   │   │               CloudSlider, ImageryPanel, IndexPanel,
    │   │   │               BlueGreenPanel, DownloadPanel
    │   │   └── ui/         Notification, StatusBadge, HelpPanel, Spinner, SectionCard
    │   ├── constants/      datasets.js
    │   ├── services/       api.js
    │   ├── store/          appStore.js  (Zustand)
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    └── package.json
```

---

## ✅ Prerequisites

- **Node.js** v18 or higher → https://nodejs.org
- **GEE Service Account JSON** with Earth Engine API enabled
- Your GEE service account must have access to the datasets

---

## 🔑 Step 1 — Place your GEE credentials

Copy your `gee-service-account.json` into:

```
backend/credentials/gee-service-account.json
```

> ⚠️ This file is gitignored. Never commit it to version control.

---

## 🔧 Step 2 — Enable Earth Engine API for your service account

1. Go to https://console.cloud.google.com
2. Enable the **Earth Engine API** on your project
3. Go to https://code.earthengine.google.com → Settings → Service Accounts
4. Register your service account email if not already done

---

## 🚀 Step 3 — Install & Run Backend

```bash
cd backend
npm install
npm run dev
```

You should see:
```
🔄 Initializing GEE...
✅ GEE initialized successfully
🚀 Server running on http://localhost:5000
```

---

## 🖥 Step 4 — Install & Run Frontend

Open a **new terminal**:

```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```

You should see:
```
  VITE ready in Xms
  ➜  Local:   http://localhost:5173/
```

Open **http://localhost:5173** in your browser.

---

## 🗺 How to Use

| Step | Action |
|------|--------|
| 1 | Draw a custom area on the map OR use the default boundary |
| 2 | Select Sensor Type (Radar / Optical) and Mission (Sentinel-1 / Sentinel-2) |
| 3 | Set Start and End dates |
| 4 | Adjust Cloud Cover threshold (optical only) |
| 5 | Click **▶ Display Composite** to load imagery |
| 6 | Select an Index (NDVI, NDWI, RVI…), style, and color ramp → **▶ Load Index** |
| 7 | Use **Blue–Green System** section for ecological mapping with area stats |
| 8 | Select indices in Download section → Generate GeoTIFF download link |

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/imagery/composite` | Get GEE tile URL for composite |
| POST | `/api/index/compute` | Compute index + get tile URL + min/max |
| POST | `/api/bluegreen/green` | Green cover (NDVI) tile + area stats |
| POST | `/api/bluegreen/blue` | Blue cover (NDWI) tile + area stats |
| POST | `/api/bluegreen/system` | Combined Blue–Green system |
| POST | `/api/download/generate-url` | GeoTIFF download URL |
| GET  | `/health` | Health check |

---

## 🔧 Environment Variables (`backend/.env`)

```env
PORT=5000
GEE_SERVICE_ACCOUNT_PATH=./credentials/gee-service-account.json
FRONTEND_URL=http://localhost:5173
```

---

## 🏗 Build for Production

**Frontend:**
```bash
cd frontend
npm run build
# Output in frontend/dist/
```

**Backend** (deploy to Railway, Render, or any Node host):
```bash
cd backend
npm start
```

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend UI | React 18 + Vite |
| Styling | Tailwind CSS |
| Map | React-Leaflet + Leaflet-Draw |
| State | Zustand |
| HTTP client | Axios |
| Backend | Node.js + Express |
| GEE SDK | @google/earthengine |
| Fonts | IBM Plex Sans / Mono |

---

## ❗ Troubleshooting

**"GEE auth failed"**
→ Check your service account JSON path and that the Earth Engine API is enabled.

**"No images found"**
→ Try a wider date range or higher cloud cover percentage.

**Map tiles not showing**
→ GEE tile tokens expire. Re-click Display to refresh.

**Build error: prop-types**
→ Run `npm install --legacy-peer-deps` in the frontend folder.
