import useAppStore from '../../store/appStore';
import SectionCard from '../ui/SectionCard';
import StatusBadge from '../ui/StatusBadge';
import { isOptical } from '../../constants/datasets';

export default function CloudSlider() {
  const { cloudCover, setCloudCover, selectedDataset, startDate, endDate } = useAppStore();

  const optical = isOptical(selectedDataset);
  const hasValidDates = startDate && endDate && new Date(endDate) > new Date(startDate);
  const enabled = optical && hasValidDates;

  const statusMsg = () => {
    if (!selectedDataset) return { status: 'pending', msg: '⏳ Cloud cover not enabled' };
    if (!optical) return { status: 'info', msg: 'ℹ️ Cloud cover not applicable for radar (Sentinel-1)' };
    if (!hasValidDates) return { status: 'pending', msg: '⏳ Set valid dates to enable cloud filter' };
    return { status: 'success', msg: `Cloud cover threshold: ${cloudCover}%` };
  };

  const { status, msg } = statusMsg();

  return (
    <SectionCard title="4. Cloud Cover Threshold">
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={0} max={100} step={1}
          value={cloudCover}
          disabled={!enabled}
          onChange={(e) => setCloudCover(Number(e.target.value))}
          className="flex-1 disabled:opacity-40"
        />
        <span className={`text-sm font-mono font-semibold w-10 text-right ${enabled ? 'text-primary-700' : 'text-gray-400'}`}>
          {cloudCover}%
        </span>
      </div>
      <StatusBadge status={status}>{msg}</StatusBadge>
      <p className="hint">Lower values produce clearer images (optical datasets only).</p>
    </SectionCard>
  );
}
