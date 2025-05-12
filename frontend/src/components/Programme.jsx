import React, { useContext, useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import { Link, useLocation } from "react-router-dom";
import { ProgrammesContext } from "./Context/ProgrammeContext";

const Programme = () => {
  const location = useLocation();
  const resources = decodeURIComponent(location.pathname.split("/")[1] || "");

  const [selectedImage, setSelectedImage] = useState(null);
  const { programmeLists, loading } = useContext(ProgrammesContext);
  // console.log(programmeLists);
  if (loading) {
    return (
      <div className="text-center text-2xl font-bold mt-20">Loading...</div>
    );
  }

  return (
    <div className="mt-20 py-3 px-5 flex flex-col justify-center items-center gap-5 md:px-10 lg:px-20">
      <h1 className="text-xl md:text-[2vw] text-center font-bold">
        Purbanchal University (BIT, BCA, BE Civil and others ){" "}
        <span className="capitalize">{resources}</span>
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 justify-center py-5">
        {programmeLists.map((program, key) => (
          <div
            key={key}
            className="flex flex-col justify-start items-center gap-3 pb-3 transition-transform"
          >
            <img
              src={program.imagepath}
              alt={program.programmefullname}
              className="object-cover cursor-pointer border border-gray-500 rounded-lg hover:scale-95 duration-500 "
              onClick={() => setSelectedImage(program.imagepath)}
              loading="lazy"
              width="300"
              height="200"
            />
            <Link
              to={`/${resources}/${program.programmeshortname}`}
              className="font-medium text-center lg:text-[1.1vw] p-2 shadow-lg hover:scale-95 duration-500  rounded-lg w-full bg-gray-300"
            >
              {program.programmefullname} <br />({program.programmeshortname})
            </Link>
          </div>
        ))}
      </div>

      {/* Modal for Image Preview */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center  backdrop-blur-md"
        >
          <div className="relative bg-transparent p-4 rounded-lg shadow-lg mt-20">
            <button
              className="absolute top-1 right-0 px-2 py-1 rounded"
              onClick={() => setSelectedImage(null)}
            >
              <IoMdCloseCircle
                title="close"
                className="text-4xl font-bold text-red-500"
              />
            </button>
            <img
              src={selectedImage}
              alt="Preview"
              className="  rounded-md"
              loading="lazy"
              width="500"
              height="300"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Programme;
