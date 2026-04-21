import useAppStore from '../../store/appStore';
import SectionCard from '../ui/SectionCard';
import Spinner from '../ui/Spinner';
import { INDEX_OPTIONS, INDEX_DESCRIPTIONS, PALETTE_OPTIONS, PALETTE_COLORS } from '../../constants/datasets';
import { indexAPI } from '../../services/api';

export default function IndexPanel({ onIndexLoaded }) {
  const {
    selectedDataset, aoi, startDate, endDate, cloudCover,
    imageryLoaded,
    selectedIndex, setSelectedIndex,
    renderType, setRenderType,
    palette, setPalette,
    loadingIndex, setLoading,
    indexMin, indexMax, setIndexMinMax,
    setIndexTileUrl,
    showNotification, setActiveLayer
  } = useAppStore();

  const indices = INDEX_OPTIONS[selectedDataset] || [];
  const canLoad = imageryLoaded && selectedIndex && renderType;
  const showPalette = renderType === 'Color Gradient';

  const handleLoad = async () => {
    if (!canLoad) {
      showNotification('Load imagery and select an index first', 'warning');
      return;
    }
    setLoading('loadingIndex', true);
    try {
      const result = await indexAPI.compute({
        dataset: selectedDataset,
        aoi,
        startDate,
        endDate,
        cloudCover,
        indexName: selectedIndex,
        renderType,
        palette: showPalette ? palette : 'Grayscale'
      });
      setIndexTileUrl(result.tileUrl);
      setIndexMinMax(result.min, result.max);
      setActiveLayer('index');
      onIndexLoaded(result);
      showNotification(
        `${selectedIndex} loaded (Min: ${result.min.toFixed(3)}, Max: ${result.max.toFixed(3)})`,
        'success'
      );
    } catch (err) {
      showNotification(err.message, 'error');
    } finally {
      setLoading('loadingIndex', false);
    }
  };

  return (
    <SectionCard title="📊 Environmental Indicator">
      {/* Index select */}
      <label className="label-sm">① Select Index</label>
      <select
        className="form-input mb-1"
        value={selectedIndex || ''}
        onChange={(e) => setSelectedIndex(e.target.value)}
        disabled={!imageryLoaded}
      >
        <option value="">— Select Index —</option>
        {indices.map((i) => <option key={i} value={i}>{i}</option>)}
      </select>
      {selectedIndex && (
        <p className="text-xs text-gray-500 mb-3">{INDEX_DESCRIPTIONS[selectedIndex]}</p>
      )}

      {/* Render type */}
      <label className="label-sm">② Visualization Style</label>
      <div className="flex gap-3 mb-3">
        {['Grayscale', 'Color Gradient'].map((rt) => (
          <label key={rt} className="flex items-center gap-1.5 cursor-pointer text-sm text-gray-700">
            <input
              type="radio" name="renderType" value={rt}
              checked={renderType === rt}
              onChange={() => setRenderType(rt)}
              disabled={!imageryLoaded}
              className="accent-primary-700"
            />
            {rt}
          </label>
        ))}
      </div>

      {/* Palette */}
      {showPalette && (
        <>
          <label className="label-sm">③ Color Ramp</label>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {PALETTE_OPTIONS.map((p) => (
              <button
                key={p}
                onClick={() => setPalette(p)}
                className={`rounded-md border-2 p-1.5 text-xs font-medium transition-all
                  ${palette === p ? 'border-primary-700' : 'border-gray-200 hover:border-gray-400'}`}
              >
                <div className="flex rounded overflow-hidden h-4 mb-1">
                  {PALETTE_COLORS[p].map((c, i) => (
                    <div key={i} style={{ background: c, flex: 1 }} />
                  ))}
                </div>
                {p}
              </button>
            ))}
          </div>
        </>
      )}

      <button
        onClick={handleLoad}
        disabled={!canLoad || loadingIndex}
        className="btn-primary"
      >
        {loadingIndex
          ? <Spinner label="Computing index…" />
          : '▶ Load Index'}
      </button>

      {indexMin !== null && indexMax !== null && (
        <div className="mt-2 text-xs text-eco-green font-medium bg-eco-green-light px-2 py-1 rounded-md font-mono">
          Range: {indexMin.toFixed(3)} → {indexMax.toFixed(3)}
        </div>
      )}

      <p className="hint">Visualization is automatically scaled to actual data values.</p>
    </SectionCard>
  );
}
