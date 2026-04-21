import { useState } from 'react';
import AOIControls from '../sidebar/AOIControls';
import SensorSelector from '../sidebar/SensorSelector';
import DateRangePicker from '../sidebar/DateRangePicker';
import CloudSlider from '../sidebar/CloudSlider';
import ImageryPanel from '../sidebar/ImageryPanel';
import IndexPanel from '../sidebar/IndexPanel';
import BlueGreenPanel from '../sidebar/BlueGreenPanel';
import DownloadPanel from '../sidebar/DownloadPanel';
import HelpPanel from '../ui/HelpPanel';

export default function Sidebar({
  onDrawAOI, onResetAOI,
  onImageryLoaded, onIndexLoaded, onBGLoaded
}) {
  const [helpOpen, setHelpOpen] = useState(false);

  return (
    <>
      <aside className="sidebar">
        {/* ── Header ── */}
        <div className="bg-white border-b border-gray-200">
          {/* Blue accent bar */}
          <div className="h-1.5 bg-primary-700" />
          <div className="flex items-center justify-between px-4 py-3">
            <div>
              <h1 className="text-lg font-bold text-primary-700 leading-tight">
                Ecological Systems Explorer
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Blue–Green Infrastructure & Environmental Indicators
              </p>
            </div>
            <button
              onClick={() => setHelpOpen((v) => !v)}
              className="text-xs font-semibold text-primary-700 bg-primary-50
                         border border-primary-200 rounded-full px-3 py-1.5
                         hover:bg-primary-100 transition-colors"
            >
              ❓ Help
            </button>
          </div>
        </div>

        {/* ── Scrollable content ── */}
        <div className="px-3 pb-6 space-y-1">
          <AOIControls onDrawAOI={onDrawAOI} onResetAOI={onResetAOI} />
          <SensorSelector />
          <DateRangePicker />
          <CloudSlider />
          <ImageryPanel onImageryLoaded={onImageryLoaded} />
          <IndexPanel onIndexLoaded={onIndexLoaded} />
          <BlueGreenPanel onBGLoaded={onBGLoaded} />
          <DownloadPanel />
        </div>
      </aside>

      {/* Help overlay on map */}
      {helpOpen && <HelpPanel onClose={() => setHelpOpen(false)} />}
    </>
  );
}
