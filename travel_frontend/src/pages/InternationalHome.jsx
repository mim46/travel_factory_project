import { Link } from "react-router-dom";
import thailand1Img from "../assets/images/thailand1.jpg";
import maldive1Img from "../assets/images/maldive1.jpg";
import malaysiaImg from "../assets/images/malaysia.jpg";
import singaporeImg from "../assets/images/singapore.jpg";
import dubai1Img from "../assets/images/dubai1.jpg";
import turkey1Img from "../assets/images/turkey1.jpg";
import indonesiaImg from "../assets/images/indonesia.jpg";
import nepal1Img from "../assets/images/nepal1.jpg";
import greeceImg from "../assets/images/greece.png";



export default function InternationalHome() {
  const countries = [
    { name: "thailand", image: thailand1Img },
    { name: "maldives", image: maldive1Img},
    { name: "malaysia", image: malaysiaImg },
    { name: "singapore", image: singaporeImg },
    { name: "dubai", image: dubai1Img },
    { name: "turkey", image: turkey1Img },
    { name: "indonesia", image: indonesiaImg },
    { name: "nepal", image: nepal1Img },
    { name: "greece", image: greeceImg }
  ];

  return (
    <div className="min-h-screen bg-white py-10 px-6">
      <h1 className="text-4xl font-bold text-blue-900 mb-8 text-center">
        International Destinations
      </h1>

      <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
        {countries.map((c) => (
          <Link
            key={c.name}
            to={`/international/${c.name}`}
            className="bg-blue-50 rounded-xl shadow hover:shadow-xl overflow-hidden transition"
          >
<img src={c.image} alt="" className="w-full h-52 object-cover" />
            <div className="p-3 text-center font-semibold text-xl capitalize text-blue-900">
              {c.name}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
