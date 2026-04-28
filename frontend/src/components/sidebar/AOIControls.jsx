import { useRef } from 'react';
import useAppStore from '../../store/appStore';
import SectionCard from '../ui/SectionCard';

export default function AOIControls({ onDrawAOI, onResetAOI }) {
  const { aoi, defaultAOI, setAOI } = useAppStore();
  const fileInputRef = useRef(null);

  // Handle GeoJSON Upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const geojson = JSON.parse(event.target.result);

        // Basic validation
        if (!geojson || !geojson.type) {
          alert("Invalid GeoJSON file");
          return;
        }

        // Update AOI in global store
        setAOI(geojson);
      } catch (err) {
        alert("Error reading GeoJSON file");
        console.error(err);
      }
    };

    reader.readAsText(file);
  };

  return (
    <SectionCard title="1. Define Study Area">
      <div className="flex gap-2">
        
        {/* Draw AOI */}
        <button
          onClick={onDrawAOI}
          className="flex-1 bg-white text-gray-700 font-medium py-2 px-3 rounded-md border
                     border-gray-300 hover:bg-gray-50 transition-colors text-sm
                     disabled:opacity-40"
        >
          🖊 Draw Custom Area
        </button>

        {/* Default AOI */}
        <button
          onClick={onResetAOI}
          disabled={!defaultAOI}
          className="flex-1 font-semibold py-2 px-3 rounded-md text-sm transition-colors duration-150"
          style={{ background: '#fbbc04', color: '#202124' }}
        >
          ↺ Default Boundary
        </button>

        {/* Upload GeoJSON */}
        <button
          onClick={() => fileInputRef.current.click()}
          className="flex-1 bg-white text-gray-700 font-medium py-2 px-3 rounded-md border
                     border-gray-300 hover:bg-gray-50 transition-colors text-sm"
        >
          📁 Upload GeoJSON
        </button>
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        accept=".geojson,application/json"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileUpload}
      />

      {/* Helper text */}
      <p className="hint mt-2">
        Click <strong>Draw Custom Area</strong> then use the ✏️ polygon tool
        that appears in the top-right corner of the map.
      </p>

      {/* Status */}
      {aoi ? (
        <div className="mt-2 text-xs font-medium px-2 py-1.5 rounded-md bg-green-50 text-green-700">
          ✅ Study area is active — proceed to select a dataset
        </div>
      ) : (
        <div className="mt-2 text-xs font-medium px-2 py-1.5 rounded-md bg-yellow-50 text-yellow-700">
          ⚠️ No study area defined — draw one to begin
        </div>
      )}
    </SectionCard>
  );
}