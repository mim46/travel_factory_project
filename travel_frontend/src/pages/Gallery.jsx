export default function Gallery() {
    const images = [
      "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
      "https://images.unsplash.com/photo-1521295121783-8a321d551ad2",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
      "https://images.unsplash.com/photo-1503264116251-35a269479413",
      "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1",
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429",
      "https://images.unsplash.com/photo-1500534623283-312aade485b7",
    ];
  
    return (
      <div className="min-h-screen bg-blue-50 px-6 py-12">
        <h1 className="text-4xl font-bold text-blue-900 text-center mb-10">
          Travel Gallery
        </h1>
  
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {images.map((img, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-xl shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer"
            >
              <img
                src={img}
                alt="travel gallery"
                className="w-full h-56 object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    );
  }
  