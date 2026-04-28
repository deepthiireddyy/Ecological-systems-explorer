import { useState, useEffect } from 'react';
import useAppStore from '../../store/appStore';
import SectionCard from '../ui/SectionCard';
import StatusBadge from '../ui/StatusBadge';

export default function DateRangePicker() {
  const { startDate, setStartDate, endDate, setEndDate, selectedDataset } = useAppStore();
  const [error, setError] = useState('');

  const disabled = !selectedDataset;

  useEffect(() => {
    if (!startDate || !endDate) { setError(''); return; }
    const s = new Date(startDate);
    const e = new Date(endDate);
    if (isNaN(s) || isNaN(e)) { setError('Invalid date format. Use YYYY-MM-DD'); return; }
    if (e <= s) { setError('End date must be after start date'); return; }
    setError('');
  }, [startDate, endDate]);

  const status = () => {
    if (error) return 'error';
    if (startDate && endDate && !error) return 'success';
    return 'pending';
  };

  const message = () => {
    if (error) return `❌ ${error}`;
    if (startDate && endDate && !error) return `Date range: ${startDate} → ${endDate}`;
    return '⏳ Select start and end dates';
  };

  return (
    <SectionCard title="3. Time Period">
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="label-sm">Start Date</label>
          <input
            type="date"
            className="form-input"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            disabled={disabled}
          />
        </div>
        <div className="flex-1">
          <label className="label-sm">End Date</label>
          <input
            type="date"
            className="form-input"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            disabled={disabled}
          />
        </div>
      </div>
      <StatusBadge status={status()}>{message()}</StatusBadge>
      <p className="hint">End date must be after start date.</p>
    </SectionCard>
  );
}
