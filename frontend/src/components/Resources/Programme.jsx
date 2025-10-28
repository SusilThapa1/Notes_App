import React, { useContext, useState, useEffect, useMemo } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ProgrammesContext } from "../Context/ProgrammeContext";
import Loader from "../Loader/Loader";
import { AuthContext } from "../Context/AuthContext";

const Programme = () => {
  const { resource, university } = useParams();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const { programmeLists, uploads, loading, universityLists } =
    useContext(ProgrammesContext);
  const { userDetails } = useContext(AuthContext);

  // Get valid resources and universities from uploads
  const { validResources, validUniversities } = useMemo(() => {
    if (!uploads || uploads.length === 0)
      return { validResources: [], validUniversities: [] };

    const resources = [
      ...new Set(
        uploads.map((u) => u.resources?.toLowerCase()).filter(Boolean)
      ),
    ];
    const universities = [
      ...new Set(
        uploads
          .map((u) => u.universityID?.universityshortname?.toLowerCase())
          .filter(Boolean)
      ),
    ];

    return { validResources: resources, validUniversities: universities };
  }, [uploads]);

  // Validate resource and university
  useEffect(() => {
    if (!loading && validResources.length > 0 && validUniversities.length > 0) {
      if (resource && !validResources.includes(resource.toLowerCase())) {
        navigate("/not-found", { replace: true });
        return;
      }
      if (university && !validUniversities.includes(university.toLowerCase())) {
        navigate("/not-found", { replace: true });
        return;
      }
    }
  }, [
    resource,
    university,
    validResources,
    validUniversities,
    loading,
    navigate,
  ]);

  if (loading) return <Loader />;

  // ✅ Filter programmes that have uploads matching the selected resource & university
  const filteredProgrammes = programmeLists.filter((program) =>
    uploads.some(
      (upload) =>
        upload.resources.toLowerCase() === resource.toLowerCase() &&
        upload.universityID.universityshortname.toLowerCase() ===
          university.toLowerCase() &&
        upload.programmeID.programmeshortname.toLowerCase() ===
          program.programmeshortname.toLowerCase()
    )
  );

  return (
    <div className="mt-24 px-5 md:px-10 lg:px-20 flex flex-col items-center gap-8 text-textLight dark:text-textDark transition-colors duration-300">
      {/* Title resource */}

      <div className="text-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-extrabold text-lightGreen  ">
          Explore Programmes
        </h1>
        <p className="text-subTextLight dark:text-subTextDark md:text-lg">
          Browse programmes under{" "}
          <span className="uppercase font-semibold text-darkGreen ">
            {university.replaceAll("-", " ")}
          </span>{" "}
          for{" "}
          <span className="capitalize font-semibold text-darkGreen ">
            {resource}
          </span>
        </p>
      </div>

      {/* Account verification notice */}
      {!userDetails?.isAccountVerified && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-700 rounded-xl p-4 text-center max-w-3xl shadow-sm">
          ⚠️ Please verify your account to access study materials. Once
          verified, you’ll see programme links below each image.
        </div>
      )}

      {/* Programme Grid */}
      {filteredProgrammes.length > 0 ? (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 w-full justify-items-center pb-10">
          {filteredProgrammes.map((program, index) => (
            <div
              key={index}
              className="bg-light/70 dark:bg-gray-900 backdrop-blur-md rounded-2xl shadow-md border border-slate-100 dark:border-gray-700 overflow-hidden w-full hover:shadow-xl transition-all duration-300"
            >
              {/* Programme Image */}
              <div
                className="relative cursor-pointer group overflow-hidden"
                onClick={() => setSelectedImage(program.imagepath)}
              >
                <img
                  loading="lazy"
                  src={`${
                    import.meta.env.VITE_API_FILE_URL + program.imagepath
                  }`}
                  alt={program.programmefullname}
                  className="w-full h-52 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
              </div>

              {/* Programme Info */}
              <div className="p-4 text-center flex flex-col items-center justify-between h-[120px]">
                <h3 className="font-bold text-textLight dark:text-textDark">
                  {program.programmefullname}
                </h3>
                <p className="text-sm text-subTextLight dark:text-subTextDark mb-2">
                  ({program.programmeshortname})
                </p>

                {userDetails?.isAccountVerified ? (
                  <Link
                    to={`/${resource}/${university}/${program.programmeshortname
                      .toLowerCase()
                      .replaceAll(" ", "-")}`}
                    className="bg-lightGreen text-white text-sm px-4 py-2 rounded-full font-medium hover-supported:hover:bg-darkGreen transition-colors duration-300 shadow-md w-full"
                  >
                    View {program.programmeshortname} {resource}
                  </Link>
                ) : (
                  <button
                    disabled
                    className="bg-gray-300 dark:bg-gray-700 text-subTextLight dark:text-subTextDark text-sm px-4 py-2 rounded-full font-medium cursor-not-allowed w-full"
                  >
                    Verify Account to Access
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-subTextLight dark:text-subTextDark text-lg py-10 text-center">
          No programmes found for this university.
        </div>
      )}

      {/* Image Preview Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 flex justify-center items-center bg-black/70 backdrop-blur-sm z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative p-2 bg-transparent">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-8 right-0 text-red-500 hover:text-red-600 transition"
            >
              <IoMdCloseCircle size={40} />
            </button>
            <img
              loading="lazy"
              src={`${import.meta.env.VITE_API_FILE_URL + selectedImage}`}
              alt="Preview"
              className="rounded-lg shadow-2xl max-h-[80vh] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Programme;
