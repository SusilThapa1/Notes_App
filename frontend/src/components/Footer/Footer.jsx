import { Link } from "react-router-dom";
import { FaGithub, FaFacebook, FaWhatsapp } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="flex flex-col justify-center items-center gap-5 w-full mx-auto text-center bg-lightGreen text-white py-3 overflow-x-hidden border-t-2 border-slate-100 shadow-xl">
      <div className="animate-marquee text-nowrap pb-2">
        This website is currently under development! Stay focused and keep learning 😊
      </div>

      <div className="flex items-start justify-center gap-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-1 md:gap-5 place-items-start md:place-items-center">
          <Link to="/study/privacy-policy" className="hover:underline hover:text-blue-600 transition-all duration-300">
            Privacy Policy
          </Link>
          <Link to="/study/terms-and-conditions" className="hover:underline hover:text-blue-600 transition-all duration-300">
            Terms & Conditions
          </Link>
          <Link to="/study/code-of-conduct" className="hover:underline hover:text-blue-600 transition-all duration-300">
            Code of Conduct
          </Link>
          <Link to="/study/contact-us" className="hover:underline hover:text-blue-600 transition-all duration-300">
            Contact Us
          </Link>
          <Link to="/study/feedback" className="hover:underline hover:text-blue-600 transition-all duration-300">
            Submit Feedback
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-1 md:gap-5 place-items-start">
          <Link to="/" className="hover:underline hover:text-blue-600 transition-all duration-300">
            Home
          </Link>
          <Link to="/study/syllabus" className="hover:underline hover:text-blue-600 transition-all duration-300">
            Syllabus
          </Link>
          <Link to="/study/notes" className="hover:underline hover:text-blue-600 transition-all duration-300">
            Notes
          </Link>
          <Link to="/study/questions" className="hover:underline hover:text-blue-600 transition-all duration-300">
            Questions
          </Link>
          <button
            onClick={() => window.scrollTo(0, 0)}
            className="hover:underline hover:text-blue-600 cursor-pointer transition-all duration-300"
          >
            Back to Top
          </button>
        </div>
      </div>

      <div className="flex justify-center items-center gap-10 text-2xl">
        <a href="https://github.com/SusilThapa1" target="_blank" rel="noopener noreferrer">
          <FaGithub size={30} className="hover:text-gray-700 transition-all duration-300" title="github" />
        </a>
        <a href="https://facebook.com/susil.thapa.3363334" target="_blank" rel="noopener noreferrer">
          <FaFacebook size={30} className="hover:text-blue-700 transition-all duration-300" title="facebook" />
        </a>
        <a href="https://wa.me/9825821503" target="_blank" rel="noopener noreferrer">
          <FaWhatsapp size={30} className="hover:text-green-600 transition-all duration-300" title="whatsapp" />
        </a>
      </div>

      <p className="font-semibold">&copy; {new Date().getFullYear()} EasyStudyZone. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
