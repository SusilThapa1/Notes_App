// App.js
import AboutUs from "../components/AboutUs";
import ContactUs from "../components/ContactUs";

const Homepage = () => {
  return (
    <div className="flex flex-col">
      <div className="  mt-20 px-5 md:px-10 lg:px-20 w-full overflow-x-hidden">
        <div className="  animate-marqueeLong whitespace-nowrap text-sm md:text-base font-medium text-center text-black py-2 w-full ">
          You can send your notes or new questions to :{" "}
          <span className="text-blue-600">eyeh193@gmail.com</span> Or You can
          send a mail for access to upload notes or any other study resources.
        </div>

        <section
          id="home"
          className=" parent relative  text-white flex flex-col gap-3 justify-center items-center h-[500px] mb-10 md:h-[750px] bg-[url(/images/mobile.png)] md:bg-[url(/images/desktop.png)]  bg-cover bg-center bg-no-repeat rounded-xl shadow-lg border-2 border-slate-100"
        >
          <h2 className="absolute top-3 child md:top-10 text-[3vw] text-center md:text-3xl text-[#2b352b] mx-0 font-semibold md:font-extrabold px-2 md:rotate-1">
            Purbanchal University Course Hub
          </h2>
          <div className="flex flex-col justify-center items-center gap-5 absolute bottom-2 text-center text-white  font-medium text-[2.5vw] md:text-lg ">
            <p>
              Get syllabus, notes, and questions for BIT, BCA, BE Civil, BBA and
              other courses.
            </p>

            <a
              href="#contact"
              className="bg-transparent border-2 text-sm border-slate-100   px-2 py-1 md:px-4 md:py-2 rounded-full font-semibold  active:bg-[white] hover-supported:hover:bg-[white] hover-supported:hover:text-[#2b352b] transition-all duration-500  shadow-lg"
            >
              Contact Us
            </a>
          </div>
        </section>

        <hr className="w-full   border-gray-300 border-[1px]" />

        <section id="about" className="py-10  ">
          <AboutUs />
        </section>
        <hr className="w-full   border-gray-300 border-[1px]" />
        <section id="contact" className=" px-5 md:px-10 lg:px-20 w-full">
          <ContactUs />
        </section>
      </div>
    </div>
  );
};

export default Homepage;
