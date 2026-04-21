import useAppStore from '../../store/appStore';
import SectionCard from '../ui/SectionCard';
import StatusBadge from '../ui/StatusBadge';
import { SENSOR_GROUPS, DATASET_OPTIONS, DATASET_INFO } from '../../constants/datasets';

export default function SensorSelector() {
  const {
    selectedGroup, setSelectedGroup,
    selectedDataset, setSelectedDataset,
    resetWorkflow
  } = useAppStore();

  const handleGroupChange = (e) => {
    setSelectedGroup(e.target.value);
    resetWorkflow();
  };

  const handleDatasetChange = (e) => {
    setSelectedDataset(e.target.value);
    resetWorkflow();
  };

  const info = selectedDataset ? DATASET_INFO[selectedDataset] : null;

  return (
    <SectionCard title="🛰 Satellite Sensor & Mission">
      {/* Group */}
      <label className="label-sm">Sensor Type</label>
      <select className="form-input mb-3" value={selectedGroup || ''} onChange={handleGroupChange}>
        <option value="">Select Satellite Sensor</option>
        {SENSOR_GROUPS.map((g) => (
          <option key={g} value={g}>{g}</option>
        ))}
      </select>

      {/* Dataset */}
      <label className="label-sm">Mission</label>
      <select
        className="form-input"
        value={selectedDataset || ''}
        onChange={handleDatasetChange}
        disabled={!selectedGroup}
      >
        <option value="">Select Dataset</option>
        {(DATASET_OPTIONS[selectedGroup] || []).map((d) => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>

      {/* Dataset info */}
      {info && (
        <div className="mt-3 bg-gray-50 rounded-md px-3 py-2 text-xs text-gray-600 space-y-0.5">
          {info.lines.map((l, i) => (
            <p key={i} className={i === 0 ? 'font-semibold text-gray-800' : ''}>{l}</p>
          ))}
        </div>
      )}

      {/* Status */}
      {!selectedDataset ? (
        <StatusBadge status="pending">⏳ Please select a satellite and dataset to proceed</StatusBadge>
      ) : (
        <StatusBadge status="success">✅ Dataset selected: {selectedDataset}</StatusBadge>
      )}
    </SectionCard>
  );
}
