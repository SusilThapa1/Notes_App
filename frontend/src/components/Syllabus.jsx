import React from "react";
import syllabus from "./assets/syllabus";
const Syllabus = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 mb-16 lg:grid-cols-3 gap-10 justify-start items-center ">
      {syllabus.map((data, index) => (
        <div
          key={index}
          className="border-2 border-gray-500 shadow-gray-400 rounded-lg flex flex-col justify-center items-center gap-5 py-5"
        >
          <img src={data.image} alt="" />
          <a
            href={data.pdfUrl}
            className="text-md font-semibold bg-black text-white px-4 py-2 rounded-2xl transition-all duration-400 hover:text-gray-700 hover:bg-gray-400"
          >
            {data.sem}
          </a>
        </div>
      ))}
    </div>
  );
};

export default Syllabus;
