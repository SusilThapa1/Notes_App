import React, { useContext, useState, useEffect, useMemo } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ProgrammesContext } from "../Context/ProgrammeContext";
import Loader from "../Loader/Loader";
import { AuthContext } from "../Context/AuthContext";

const University = () => {
  const { resource } = useParams();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);

  const { uploads, universityLists, loading } = useContext(ProgrammesContext);
  const { userDetails } = useContext(AuthContext);

  // Get valid resources from uploads data
  const validResources = useMemo(() => {
    if (!uploads || uploads.length === 0) return [];
    return [
      ...new Set(
        uploads.map((upload) => upload.resources?.toLowerCase()).filter(Boolean)
      ),
    ];
  }, [uploads]);

  // Validate resource exists in uploads
  useEffect(() => {
    if (!loading && resource && validResources.length > 0) {
      if (!validResources.includes(resource.toLowerCase())) {
        navigate("/not-found", { replace: true });
      }
    }
  }, [resource, validResources, loading, navigate]);

  if (loading) return <Loader />;

  // Filter universities based on uploads for this resource
  const filteredUniversities = universityLists.filter((uni) =>
    uploads.some(
      (upload) =>
        upload.universityID.universityshortname.toLowerCase() ===
          uni.universityshortname.toLowerCase() &&
        upload.resources.toLowerCase() === resource.toLowerCase()
    )
  );

  return (
    <div className="relative mt-20 py-5 px-5 md:px-10 lg:px-20 flex flex-col justify-center items-center gap-5 transition-colors duration-300">
      <h1 className="text-2xl md:text-[1.8vw] text-lightGreen font-bold text-center">
        Explore Universities offering{" "}
        <span className="capitalize">{resource}</span>
      </h1>

      {!userDetails?.isAccountVerified && (
        <div className="text-red-600 dark:text-red-400 text-center text-base md:text-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg px-4 py-3 max-w-3xl backdrop-blur-sm">
          Please verify your account first to access study resources. Once
          verified, you’ll be able to open links below each university.
        </div>
      )}

      {filteredUniversities.length > 0 ? (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 justify-center py-6 w-full">
          {filteredUniversities.map((university) => (
            <div
              key={university._id}
              className="group relative bg-light/80 dark:bg-gray-900 backdrop-blur-md border border-slate-200 dark:border-gray-700 rounded-2xl shadow-md overflow-hidden hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
            >
              <div
                className="cursor-pointer w-full h-max flex justify-center items-center py-5"
                onClick={() => setSelectedImage(university.imagepath)}
              >
                <img
                  loading="lazy"
                  src={`${
                    import.meta.env.VITE_API_FILE_URL + university.imagepath
                  }`}
                  alt={university.universityfullname}
                  className="object-cover aspect-square w-24 h-24 group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              <div className="p-4 flex flex-col items-center text-center gap-2">
                <h2 className="text-lg font-semibold text-textLight dark:text-textDark">
                  {university.universityfullname}
                </h2>
                <p className="text-sm text-subTextLight dark:text-subTextDark">
                  ({university.universityshortname})
                </p>

                {userDetails?.isAccountVerified ? (
                  <Link
                    to={`/${resource}/${university.universityshortname.toLowerCase()}`}
                    className="mt-3 w-full bg-lightGreen text-white py-2 rounded-lg text-sm font-medium hover:bg-darkGreen transition-all"
                  >
                    View {resource}
                  </Link>
                ) : (
                  <button
                    disabled
                    className="mt-3 w-full bg-gray-300 dark:bg-gray-700 text-subTextLight dark:text-subTextDark py-2 rounded-lg text-sm font-medium cursor-not-allowed"
                  >
                    Verify Account to Access
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="text-center max-w-md">
            <svg
              className="mx-auto h-24 w-24 text-subTextLight dark:text-subTextDark mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <h3 className="text-xl font-semibold text-textLight dark:text-textDark mb-2">
              No Universities Found
            </h3>
            <p className="text-subTextLight dark:text-subTextDark mb-4">
              There are currently no universities offering{" "}
              <span className="capitalize font-semibold">{resource}</span>{" "}
              resources.
            </p>
            <p className="text-sm text-subTextLight dark:text-subTextDark">
              Check back later or explore other resource categories.
            </p>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 bg-black/70 backdrop-blur-md flex justify-center items-center z-50"
        >
          <div className="relative bg-transparent p-4">
            <button
              className="absolute top-1 right-1 p-1 rounded-full text-red-500 hover:text-red-600"
              onClick={() => setSelectedImage(null)}
            >
              <IoMdCloseCircle className="text-4xl" title="Close" />
            </button>
            <img
              loading="lazy"
              src={`${import.meta.env.VITE_API_FILE_URL + selectedImage}`}
              alt="University Preview"
              className="rounded-lg shadow-lg max-h-[80vh] max-w-[90vw] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default University;
