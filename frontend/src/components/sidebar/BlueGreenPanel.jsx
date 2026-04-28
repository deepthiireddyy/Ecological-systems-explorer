import useAppStore from '../../store/appStore';
import SectionCard from '../ui/SectionCard';
import Spinner from '../ui/Spinner';
import { isOptical } from '../../constants/datasets';
import { bluegreenAPI } from '../../services/api';

export default function BlueGreenPanel({ onBGLoaded }) {
  const {
    selectedDataset, aoi, startDate, endDate, cloudCover,
    imageryLoaded,
    loadingBG, setLoading,
    showNotification, setActiveLayer, setBGResult
  } = useAppStore();

  const enabled = isOptical(selectedDataset) && imageryLoaded;

  const statusMsg = isOptical(selectedDataset)
    ? imageryLoaded
      ? 'Blue–Green system enabled (Sentinel-2, 10 m resolution)'
      : 'Load imagery first to enable Blue–Green system'
    : 'Blue–Green system available only for Sentinel-2';

  const statusStyle = isOptical(selectedDataset) && imageryLoaded
    ? 'text-eco-green bg-eco-green-light'
    : isOptical(selectedDataset)
      ? 'text-yellow-700 bg-yellow-50'
      : 'text-primary-600 bg-primary-50';

  const payload = { aoi, startDate, endDate, cloudCover };

  const run = async (type, apiFn) => {
    setLoading('loadingBG', true);
    try {
      const result = await apiFn(payload);
      setBGResult(result);
      setActiveLayer('bg');
      onBGLoaded(result);
      showNotification(`${type} generated`, 'success');
    } catch (err) {
      showNotification(err.message, 'error');
    } finally {
      setLoading('loadingBG', false);
    }
  };

  return (
    <SectionCard title="7. Blue–Green System">
      <p className="text-xs text-gray-500 mb-3 leading-relaxed">
        Combines vegetation (NDVI) and water (NDWI) into a single ecological map with area statistics.
      </p>

      <div className={`text-xs font-medium px-3 py-2 rounded-md mb-3 ${statusStyle}`}>
        {statusMsg}
      </div>

      <div className="flex gap-2 mb-2">
        <button
          onClick={() => run('Green Cover', bluegreenAPI.green)}
          disabled={!enabled || loadingBG}
          className="btn-green"
        >
          {loadingBG ? <Spinner /> : 'Green Cover (NDVI)'}
        </button>
        <button
          onClick={() => run('Blue Cover', bluegreenAPI.blue)}
          disabled={!enabled || loadingBG}
          className="btn-blue"
        >
          {loadingBG ? <Spinner /> : 'Blue Cover (NDWI)'}
        </button>
      </div>

      <button
        onClick={() => run('Blue–Green System', bluegreenAPI.system)}
        disabled={!enabled || loadingBG}
        className="btn-purple"
      >
        {loadingBG
          ? <Spinner label="Generating system…" />
          : 'Generate Blue–Green System Map'}
      </button>

      <p className="hint">Requires Sentinel-2 and loaded imagery.</p>
    </SectionCard>
  );
}
