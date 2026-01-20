import aboutUsImage from '../assets/images/aboutus.jpg';

export default function AboutUs() {
    return (
      <section id="about" className="py-0 px-2 bg-white -mt-24">
  
        {/* Heading */}
        <h2
          className="
            text-3xl md:text-4xl font-extrabold text-center
            bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600
            bg-clip-text text-transparent mb-10
          "
        >
          About Us
        </h2>
  
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
  
          {/* LEFT — Travel Illustration */}
          <div className="flex justify-center">
            <img
              src={aboutUsImage}
              alt="Travel illustration"
              className="w-full md:w-[500px] drop-shadow-2xl rounded-lg"
            />
          </div>
  
          {/* RIGHT — Professional Content */}
          <div className="text-gray-700 text-xl leading-relaxed">
            <p className="mb-7">
              Welcome to{" "}
              <span className="text-blue-600 font-semibold">Travel Factory</span>,
              a trusted name committed to delivering seamless and well-crafted travel
              experiences. We curate a wide range of Domestic, International,
              and Budget-friendly travel packages suitable for every type of traveler.
            </p>
  
            <p className="mb-7">
              Our services cover everything from premium hotel arrangements 
              and comfortable transportation to guided tours, sightseeing, 
              and complete travel support — ensuring a smooth and enjoyable journey 
              from start to finish.
            </p>
          </div>
  
        </div>
      </section>
    );
  }
  