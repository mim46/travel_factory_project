import landingImg from "../assets/images/landing.jpg";
import SearchBar from "./SearchBar";

export default function Hero() {
  return (
    <section className="relative h-[65vh] w-full">
      <img
        src={landingImg}
        className="w-full h-full object-cover"
        alt="Hero"
      />

<div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-start pt-[120px] items-center text-white px-4">

        {/* HEADING */}
        <div className="transform translate-x-[-60px]">
          <h1
            className="text-2xl md:text-5xl font-bold"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            From Hills to Horizons-
          </h1>
        </div>

        {/* SUBTITLE */}
        <div className="transform translate-x-[120px] mt-5">
          <p
            className="text-3xl md:text-5xl"
            style={{
              fontFamily: "'Dancing Script', cursive",
              fontWeight: 500,
            }}
          >
            We Take You There
          </p>
        </div>

      </div>

      {/* ⭐ FLOATING SEARCH BAR HERE ⭐ */}
      <div className="absolute bottom-[-40px] left-1/2 -translate-x-1/2 w-full max-w-6xl">
        <SearchBar />
      </div>

    </section>
  );
}
