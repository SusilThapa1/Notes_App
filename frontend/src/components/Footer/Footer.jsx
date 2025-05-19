import { FaGithub, FaFacebook, FaWhatsapp } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#5CAE59] text-white  py-3 overflow-x-hidden w-full border-t-2 border-slate-100 shadow-xl">
      <div className="flex flex-col justify-center items-center gap-5 max-w-7xl mx-auto text-center">
        <div className=" animate-marquee text-nowrap pb-2">
          This website is currently under development ! Stay focused and keep
          learning 😊
        </div>
        <div className="flex  gap-5 md:gap-10 items-center">
          <a
            href="/study/privacy-policy"
            className="hover:underline hover:text-blue-600"
          >
            Privacy Policy
          </a>
          <a
            href="/study/terms-and-conditions"
            className="hover:underline hover:text-blue-600"
          >
            Terms & Conditions
          </a>
          <a
            href="/study/contact-us"
            className="hover:underline hover:text-blue-600"
          >
            Contact
          </a>
        </div>
        <div className="flex justify-center items-center gap-10 text-2xl">
          <a
            href="https://github.com/SusilThapa1"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub
              size={30}
              className="hover:text-gray-700 transition-colors duration-500"
              title="github"
            />
          </a>
          <a
            href="https://facebook.com/susil.thapa.3363334"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebook
              size={30}
              className="hover:text-blue-700 transition-colors duration-500"
              title="facebook"
            />
          </a>
          <a
            href="https://wa.me/9825821503"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaWhatsapp
              size={30}
              className="hover:text-green-500 transition-colors duration-500"
              title="whatsapp"
            />
          </a>
        </div>
        <p className="font-semibold">
          &copy; {new Date().getFullYear()} Study. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
