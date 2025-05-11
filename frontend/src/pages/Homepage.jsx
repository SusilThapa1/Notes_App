// App.js
import React from "react";
import AboutUs from "../components/AboutUs";

const Homepage = () => {
  return (
    <div className="  mt-24 px-5 md:px-10 lg:px-20 mb-20 ">
      <div className="flex flex-col gap-3 justify-center items-center overflow-hidden">
        <h2 className="text-[5.5vw] text-center md:text-4xl  font-bold ">
          Purbanchal University Course Hub
        </h2>
        <div className="animate-marquee whitespace-nowrap text-sm md:text-base font-medium text-center text-black py-2">
          Send your notes or new questions to : eyeh193@gmail.com
        </div>
      </div>
      <section
        id="home"
        className=" rounded-lg text-white py-16 flex flex-col gap-20 justify-center items-center mb-5 md:h-screen-minus-64 bg-[url(/background.webp)]  bg-cover bg-center"
      >
        <p className="mb-40 text-center  font-medium text-[4vw] md:text-lg">
          Get syllabus, notes, and questions for BIT, BCA, BE Civil, BBA and
          other courses.
        </p>

        <a
          href="#contact"
          className="bg-gray-200 text-green-600 px-6 py-3 rounded-full font-semibold hover:bg-blue-100 transition-all"
        >
          Contact Us
        </a>
      </section>
      <hr className="w-full   border-gray-500 border-[2px]" />

      <section id="about" className="py-10  ">
        <AboutUs />
      </section>
      <hr className="w-full   border-gray-500 border-[2px]" />

      <section id="contact" className="py-14">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-[6vw] md:text-3xl font-bold mb-6">Contact Us</h2>
          <p className=" text-[16px] text-center md:text-lg mb-6 ">
            Have any questions? Reach out to us, and we'll be happy to assist
            you.
          </p>
          <form className="max-w-5xl mx-auto ">
            <div className="mb-4">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full px-4 py-3 border border-gray-400 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-green-600 bg-transparent"
              />
            </div>
            <div className="mb-4">
              <input
                type="email"
                placeholder="Your Email"
                className="w-full px-4 py-3 border border-gray-400 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-green-600 bg-transparent"
              />
            </div>
            <div className="mb-4">
              <textarea
                placeholder="Your Message"
                rows="4"
                className="w-full px-4 py-3 border border-gray-400 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-green-600 bg-transparent"
              />
            </div>
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-700 transition-all"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Homepage;
