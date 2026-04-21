import useAppStore from '../../store/appStore';
import SectionCard from '../ui/SectionCard';

export default function AOIControls({ onDrawAOI, onResetAOI }) {
  const { aoi, defaultAOI, setAOI } = useAppStore();

  return (
    <SectionCard title="📍 Define Study Area">
      <div className="flex gap-2">
        <button
          onClick={onDrawAOI}
          className="flex-1 font-semibold py-2 px-3 rounded-md text-sm transition-colors duration-150"
          style={{ background: '#fbbc04', color: '#202124' }}
        >
          🖊 Draw Custom Area
        </button>
        <button
          onClick={onResetAOI}
          disabled={!defaultAOI}
          className="flex-1 bg-white text-gray-700 font-medium py-2 px-3 rounded-md border
                     border-gray-300 hover:bg-gray-50 transition-colors text-sm
                     disabled:opacity-40 disabled:cursor-not-allowed"
        >
          ↺ Default Boundary
        </button>
      </div>

      <p className="hint mt-2">
        Click <strong>Draw Custom Area</strong> then use the ✏️ polygon/rectangle tool
        that appears in the top-right corner of the map.
      </p>

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
