export default function StatCard({ title, value, icon, gradient, borderColor }) {
  return (
    <div className={`${gradient || 'bg-blue-50'} p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer border-l-8 ${borderColor || 'border-blue-500'} border-r border-t border-b border-gray-200`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <p className="text-gray-600 text-sm font-semibold mb-2 uppercase tracking-wide">{title}</p>
          <p className="text-3xl font-bold text-gray-800">{value}</p>
        </div>
        <div className={`${borderColor?.replace('border-', 'text-') || 'text-blue-500'} text-4xl opacity-70`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
