// App.js
import React from "react";
import ProgrammeDetails from "../components/ProgrammeDetails";

const Homepage = () => {
  return (
    <div className="bg-gray-100 my-24 px-5 md:px-10 lg:px-20 ">
      <section
        id="home"
        className=" rounded-lg text-white py-16 flex flex-col gap-5 justify-center items-center mb-5 md:h-[100vh] bg-[url(/PU_BG.jpeg)] bg-no-repeat bg-cover bg-center"
      >
        <h2 className="text-[4vw] md:text-4xl  font-bold">
          Purbanchal University Course Hub
        </h2>
        <p className="mt-4 text-center text-[3vw] md:text-lg">
          Get syllabus, notes, and questions for BIT, BCA, BE Civil, and BBA
          courses.
        </p>
        <div className="flex gap-5 text-[3vw] md:text-xl">
          <a
            href="#courses"
            className="bg-white text-green-600 px-6 py-3 rounded-full font-semibold hover:bg-blue-100 transition-all"
          >
            Explore Our Courses
          </a>
          <a
            href="#contact"
            className="bg-white text-green-600 px-6 py-3 rounded-full font-semibold hover:bg-blue-100 transition-all"
          >
            Contact Us
          </a>
        </div>
      </section>
      <hr className="w-full   border-gray-500 border-[2px]" />

      <section id="about" className="py-10  ">
        <div className="max-w-7xl mx-auto text-center flex flex-col gap-10">
          <h2 className="text-[6vw] md:text-3xl font-bold  ">
            About Purbanchal University
          </h2>
          <p className="text-[4vw] text-justify md:text-lg   mx-auto">
            Purbanchal University (PU), established in 1995, offers a range of
            bachelor programs. Purbanchal University is one of the leading
            educational institutions in Nepal, offering a range of undergraduate
            and postgraduate programs in fields such as Engineering, Information
            Technology, Business, and more. We aim to provide quality education
            and contribute to national development. Our platform provides
            students with access to updated syllabus, notes, and past exam
            questions to excel in their studies.
          </p>
        </div>
      </section>
      <hr className="w-full   border-gray-500 border-[2px]" />

      <hr className="w-full   border-gray-500 border-[2px]" />
      <section id="courses" className="py-10  ">
        <ProgrammeDetails />
      </section>
      <section id="contact" className="py-10">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-[6vw] md:text-3xl font-bold mb-6">Contact Us</h2>
          <p className=" text-[3vw] text-center md:text-lg mb-6 ">
            Have any questions? Reach out to us, and we'll be happy to assist
            you.
          </p>
          <form className="max-w-5xl mx-auto ">
            <div className="mb-4">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>
            <div className="mb-4">
              <input
                type="email"
                placeholder="Your Email"
                className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>
            <div className="mb-4">
              <textarea
                placeholder="Your Message"
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600"
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
