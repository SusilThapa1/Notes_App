import React from "react";

const Footer = () => {
  return (
    <footer className="bg-green-600 fixed bottom-0 text-white  py-3 font-semibold w-full">
      <div className="max-w-7xl mx-auto text-center">
        <p>
          &copy; {new Date().getFullYear()} PU Course Hub. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
