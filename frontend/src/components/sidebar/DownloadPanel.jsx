import { useState } from 'react';
import useAppStore from '../../store/appStore';
import SectionCard from '../ui/SectionCard';
import Spinner from '../ui/Spinner';
import { INDEX_OPTIONS } from '../../constants/datasets';
import { downloadAPI } from '../../services/api';

export default function DownloadPanel() {
  const {
    selectedDataset, aoi, startDate, endDate, cloudCover,
    imageryLoaded,
    selectedDownloadIndices, toggleDownloadIndex,
    loadingDownload, setLoading,
    showNotification
  } = useAppStore();

  const [downloadUrl, setDownloadUrl] = useState(null);
  const indices = INDEX_OPTIONS[selectedDataset] || [];
  const canDownload = imageryLoaded && selectedDownloadIndices.length > 0;

  const handleGenerate = async () => {
    if (!canDownload) {
      showNotification('Select at least one index to download', 'warning');
      return;
    }
    setLoading('loadingDownload', true);
    setDownloadUrl(null);
    try {
      const result = await downloadAPI.generateUrl({
        dataset: selectedDataset,
        aoi,
        startDate,
        endDate,
        cloudCover,
        indices: selectedDownloadIndices
      });
      setDownloadUrl(result.url);
      showNotification('Download link generated', 'success');
    } catch (err) {
      showNotification(err.message, 'error');
    } finally {
      setLoading('loadingDownload', false);
    }
  };

  return (
    <SectionCard title="⬇ Download Index">
      <label className="label-sm">Select indices to include</label>
      <div className="space-y-2 mb-3">
        {indices.length === 0 && (
          <p className="text-xs text-gray-400">Load imagery first to see available indices</p>
        )}
        {indices.map((idx) => (
          <label key={idx} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
            <input
              type="checkbox"
              className="accent-primary-700 w-4 h-4"
              checked={selectedDownloadIndices.includes(idx)}
              onChange={() => toggleDownloadIndex(idx)}
              disabled={!imageryLoaded}
            />
            {idx}
          </label>
        ))}
      </div>

      <button
        onClick={handleGenerate}
        disabled={!canDownload || loadingDownload}
        className="btn-primary"
      >
        {loadingDownload
          ? <Spinner label="Generating link…" />
          : '⬇ Generate Download Link'}
      </button>

      {downloadUrl && (
        <a
          href={downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex items-center gap-2 text-xs text-primary-700 underline
                     bg-primary-50 px-3 py-2 rounded-md hover:bg-primary-100 transition-colors"
        >
          ⬇ Download {selectedDataset} – {selectedDownloadIndices.join(', ')} (GeoTIFF ZIP)
        </a>
      )}

      <div className="hint mt-3 space-y-1">
        <p>• One link generates a ZIP containing separate GeoTIFFs per index.</p>
        <p>• Files are clipped to the study area boundary.</p>
        <p>• Compatible with QGIS, ArcGIS, and Python (rasterio).</p>
      </div>
    </SectionCard>
  );
}
