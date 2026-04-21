import { useEffect } from 'react';
import useAppStore from '../../store/appStore';

const TYPE_STYLES = {
  success: 'bg-eco-green-light text-eco-green border border-green-200',
  error:   'bg-red-50 text-red-700 border border-red-200',
  warning: 'bg-yellow-50 text-yellow-800 border border-yellow-200',
  info:    'bg-eco-blue-light text-eco-blue border border-blue-200'
};

const TYPE_ICONS = {
  success: '✅',
  error:   '❌',
  warning: '⚠️',
  info:    'ℹ️'
};

export default function Notification() {
  const { notification, clearNotification } = useAppStore();

  useEffect(() => {
    if (!notification) return;
    const t = setTimeout(clearNotification, 5000);
    return () => clearTimeout(t);
  }, [notification]);

  if (!notification) return null;

  return (
    <div className={`map-notification ${TYPE_STYLES[notification.type] || TYPE_STYLES.info}`}>
      <span className="mr-2">{TYPE_ICONS[notification.type] || 'ℹ️'}</span>
      {notification.message}
    </div>
  );
}
