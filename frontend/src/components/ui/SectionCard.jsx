export default function SectionCard({ title, children, className = '' }) {
  return (
    <div className={`section-card ${className}`}>
      {title && (
        <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-1.5">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}
