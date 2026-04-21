import useAppStore from '../../store/appStore';
import SectionCard from '../ui/SectionCard';
import Spinner from '../ui/Spinner';
import { isOptical } from '../../constants/datasets';
import { imageryAPI } from '../../services/api';

export default function ImageryPanel({ onImageryLoaded }) {
  const {
    selectedDataset, aoi, startDate, endDate, cloudCover,
    vizType, setVizType,
    loadingImagery, setLoading,
    imageryLoaded, setImageryLoaded, setImageryTileUrl, setImageCount,
    imageCount,
    showNotification, setActiveLayer, resetWorkflow
  } = useAppStore();

  const optical = isOptical(selectedDataset);
  const canLoad = selectedDataset && aoi && startDate && endDate &&
                  new Date(endDate) > new Date(startDate);

  const handleLoad = async () => {
    if (!canLoad) {
      showNotification('Please complete dataset, AOI, and date selection', 'warning');
      return;
    }

    setLoading('loadingImagery', true);

    try {
      const result = await imageryAPI.getComposite({
        dataset: selectedDataset,
        aoi,
        startDate,
        endDate,
        cloudCover,
        vizType
      });

      console.log("Tile URL:", result.tileUrl); // 🔥 debug

      if (!result.tileUrl) {
        throw new Error("No tile URL received from backend");
      }

      setImageryTileUrl(result.tileUrl);
      setImageCount(result.imageCount);
      setImageryLoaded(true);
      setActiveLayer('imagery');

      // 🔥 SAFE CALL
      if (onImageryLoaded) {
        onImageryLoaded(result.tileUrl);
      }

      showNotification(
        `Composite generated — ${result.imageCount} image(s) found`,
        'success'
      );

    } catch (err) {
      showNotification(err.message, 'error');
    } finally {
      setLoading('loadingImagery', false);
    }
  };

  return (
    <SectionCard title="🖼 Generate Image Composite">
      {optical && (
        <div className="flex gap-3 mb-3">
          <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
            <input
              type="radio" name="vizType" value="true"
              checked={vizType === 'true'}
              onChange={() => setVizType('true')}
              className="accent-primary-700"
            />
            True Color (RGB)
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
            <input
              type="radio" name="vizType" value="false"
              checked={vizType === 'false'}
              onChange={() => setVizType('false')}
              className="accent-primary-700"
            />
            False Color (NIR)
          </label>
        </div>
      )}

      <button
        onClick={handleLoad}
        disabled={!canLoad || loadingImagery}
        className="btn-primary"
      >
        {loadingImagery
          ? <Spinner label="Generating composite…" />
          : '▶ Display Composite'}
      </button>

      {imageryLoaded && (
        <div className="mt-2 text-xs text-eco-green font-medium bg-eco-green-light px-2 py-1 rounded-md">
          ✅ Composite loaded — {imageCount} scene(s) merged
        </div>
      )}

      <p className="hint">Creates a median composite for the selected date range and area.</p>
    </SectionCard>
  );
}
