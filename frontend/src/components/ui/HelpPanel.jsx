export default function HelpPanel({ onClose }) {
  return (
    <div className="absolute top-4 right-4 z-[9999] w-80 bg-white border border-gray-200 rounded-xl shadow-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-800 text-sm">How to Use This Portal</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg leading-none">×</button>
      </div>
      <ol className="space-y-2 text-xs text-gray-600">
        {[
          'Select sensor type and satellite mission',
          'Choose start & end dates for analysis',
          'Set cloud cover threshold (optical only)',
          'Click Display to generate image composite',
          'Select an environmental indicator (NDVI, NDWI…)',
          'Choose visualization style and color ramp',
          'Use Blue–Green System for ecological mapping',
          'Download imagery or index as GeoTIFF'
        ].map((step, i) => (
          <li key={i} className="flex gap-2">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary-700 text-white text-xs flex items-center justify-center font-bold">
              {i + 1}
            </span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
      <p className="mt-3 text-xs text-primary-700 bg-primary-50 rounded-md p-2">
        💡 Visualization automatically adapts to actual data values.
      </p>
    </div>
  );
}
