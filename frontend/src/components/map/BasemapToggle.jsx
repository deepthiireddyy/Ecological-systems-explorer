import { useState } from 'react';
import { useMap, TileLayer } from 'react-leaflet';

const BASEMAPS = {
  streets: {
    label: '🗺 Streets',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  },
  satellite: {
    label: '🛰 Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Esri World Imagery'
  },
  hybrid: {
    label: '🌍 Hybrid',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Esri World Imagery',
    overlay: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
  }
};

export default function BasemapToggle() {
  const [active, setActive] = useState('streets');

  return (
    <>
      {/* Active tile layer */}
      <TileLayer
        key={active}
        url={BASEMAPS[active].url}
        attribution={BASEMAPS[active].attribution}
        maxZoom={20}
        opacity={active === 'streets' ? 1 : 1}
      />
      {/* Overlay labels for hybrid */}
      {active === 'hybrid' && (
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          opacity={0.4}
          maxZoom={20}
        />
      )}

      {/* Toggle buttons - absolutely positioned on map */}
      <div
        style={{ position: 'absolute', bottom: 32, right: 12, zIndex: 1000 }}
        className="flex flex-col gap-1"
      >
        {Object.entries(BASEMAPS).map(([key, bm]) => (
          <button
            key={key}
            onClick={() => setActive(key)}
            className={`text-xs font-medium px-3 py-1.5 rounded-md shadow-md border transition-all
              ${active === key
                ? 'bg-primary-700 text-white border-primary-800'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
          >
            {bm.label}
          </button>
        ))}
      </div>
    </>
  );
}
