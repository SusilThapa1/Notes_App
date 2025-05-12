const Footer = () => {
  return (
    <footer className="bg-green-600   text-white  py-3 overflow-x-hidden w-full">
      <div className="max-w-7xl mx-auto text-center">
        <div className=" animate-marquee  pb-2">
          This website is currently under improvement!{" "}
          <span className="hidden md:inline">Keep Study 😊</span>
        </div>
        <p className="font-semibold">
          &copy; {new Date().getFullYear()} Study. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
