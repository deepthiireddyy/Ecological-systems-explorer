const STATUS = {
  pending: 'status-pending',
  success: 'status-success',
  error:   'status-error',
  info:    'status-info'
};

export default function StatusBadge({ status = 'pending', children }) {
  return (
    <div className={`text-xs font-medium px-3 py-2 rounded-md mt-2 ${STATUS[status]}`}>
      {children}
    </div>
  );
}
