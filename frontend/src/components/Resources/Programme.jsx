import React, { useContext, useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import { Link, useLocation } from "react-router-dom";
import { ProgrammesContext } from "../Context/ProgrammeContext";
import Loader from "../Loader";
import { AuthContext } from "../Context/AuthContext";

const Programme = () => {
  const location = useLocation();
  const resources = decodeURIComponent(location.pathname.split("/")[2] || "");

  const [selectedImage, setSelectedImage] = useState(null);
  const { programmeLists, loading } = useContext(ProgrammesContext);
  const { userDetails, token } = useContext(AuthContext);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="relative mt-20 py-3 px-5 flex flex-col justify-center items-center gap-5 md:px-10 lg:px-20  ">
      <h1 className="text-lg    text-[#5CAE59] md:text-[2vw] text-center font-bold">
        Purbanchal University (BIT, BCA, BE Civil and others ){" "}
        <span className="capitalize">{resources}</span>
      </h1>
      {!userDetails?.isAccountVerified && !token && (
        <div className="flex justify-center items-start text-lg text-red-600 text-center bg-transparent backdrop-blur-sm">
          Please verify your account first to access study resources.You will
          see the link below the images to access resources only if the account
          is verified.
        </div>
      )}
      <div className="grid md:grid-cols-2  lg:grid-cols-3 xl:grid-cols-4 gap-5 justify-center py-5">
        {programmeLists.map((program, key) => (
          <div
            key={key}
            className="flex flex-col justify-start items-center gap-3 pb-3 transition-transform"
          >
            <img
              src={program.imagepath}
              alt={program.programmefullname}
              className="object-cover cursor-pointer border  border-slate-100 rounded-lg  shadow-lg hover-supported:hover:scale-95 duration-500 aspect-[30/25]"
              onClick={() => setSelectedImage(program.imagepath)}
              title="view full image"
              loading="lazy"
              width="300"
              height="200"
            />
            {userDetails?.isAccountVerified && token && (
              <Link
                to={`/study/${resources}/${program.programmeshortname}`}
                className="will-change-transform bg-transparent border border-slate-100 text-center  px-3 py-2 rounded-3xl font-medium   shadow-lg hover:scale-105 transition-all duration-500 w-full"
              >
                {program.programmefullname} <br />({program.programmeshortname})
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* Modal for Image Preview */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0   bg-opacity-90 flex justify-center items-center  backdrop-blur-md"
        >
          <div className="relative bg-transparent p-4  mt-20">
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
              className="  rounded-md   shadow-lg"
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
