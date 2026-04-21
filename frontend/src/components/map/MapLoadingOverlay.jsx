export default function MapLoadingOverlay({ loading, message = 'Processing with Google Earth Engine…' }) {
  if (!loading) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 2000,
        background: 'rgba(255,255,255,0.55)',
        backdropFilter: 'blur(2px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'all'
      }}
    >
      <div className="bg-white rounded-xl shadow-xl px-8 py-6 flex flex-col items-center gap-3 border border-gray-100">
        {/* Spinner */}
        <svg className="w-10 h-10 animate-spin text-primary-700" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
          <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
        <p className="text-sm font-semibold text-gray-700">{message}</p>
        <p className="text-xs text-gray-400">This may take 10–30 seconds</p>
      </div>
    </div>
  );
}
