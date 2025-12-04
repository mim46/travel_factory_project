export default function StatCard({ title, value, icon }) {
    return (
      <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-gray-600 text-lg">{title}</h3>
            <p className="text-3xl font-bold text-blue-700 mt-2">{value}</p>
          </div>
          <div className="text-blue-600 text-4xl">{icon}</div>
        </div>
      </div>
    );
  }
  