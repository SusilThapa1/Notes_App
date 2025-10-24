import React, { useContext, useEffect, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ProgrammesContext } from "../Context/ProgrammeContext";
import Loader from "../Loader/Loader";

const SemYear = () => {
  const { programmeLists, loading, uploads, universityLists } =
    useContext(ProgrammesContext);
  const { resource, university, programme } = useParams();
  const navigate = useNavigate();

  // Get valid resources, universities, and programmes from uploads
  const { validResources, validUniversities, validProgrammes } = useMemo(() => {
    if (!uploads || uploads.length === 0)
      return { validResources: [], validUniversities: [], validProgrammes: [] };

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
    const programmes = [
      ...new Set(
        uploads
          .map((u) => u.programmeID?.programmeshortname?.toLowerCase())
          .filter(Boolean)
      ),
    ];

    return {
      validResources: resources,
      validUniversities: universities,
      validProgrammes: programmes,
    };
  }, [uploads]);

  // Validate resource, university, and programme
  useEffect(() => {
    if (!loading && validResources.length > 0) {
      if (resource && !validResources.includes(resource.toLowerCase())) {
        navigate("/not-found", { replace: true });
        return;
      }
      if (university && !validUniversities.includes(university.toLowerCase())) {
        navigate("/not-found", { replace: true });
        return;
      }
      if (
        programme &&
        !validProgrammes.includes(programme.toLowerCase().replaceAll("-", " "))
      ) {
        navigate("/not-found", { replace: true });
        return;
      }
    }
  }, [
    resource,
    university,
    programme,
    validResources,
    validUniversities,
    validProgrammes,
    loading,
    navigate,
  ]);

  if (loading) return <Loader />;

  const selectedProgramme = programmeLists.find(
    (p) =>
      p.programmeshortname.toLowerCase() ===
      programme.toLowerCase().replaceAll("-", " ")
  );
  console.log(programme, selectedProgramme);

  if (!selectedProgramme) {
    return (
      <div className="mt-24 text-center text-red-600 font-semibold text-lg">
        Programme not found!
      </div>
    );
  }

  const isSemester =
    selectedProgramme.academicstructure?.toLowerCase() === "semester";
  const total = isSemester ? 8 : 4;
  const title = isSemester ? "Semester" : "Year";

  const ordinals = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"];
  const list = ordinals.slice(0, total).map((ord) => `${ord} ${title}`);

  const filteredSemYears = list.filter((item) =>
    uploads.some(
      (upload) =>
        upload.resources?.toLowerCase() === resource.toLowerCase() &&
        upload.universityID?.universityshortname?.toLowerCase() ===
          university.toLowerCase().replaceAll("-", " ") &&
        upload.programmeID?.programmeshortname?.toLowerCase() ===
          programme.toLowerCase().replaceAll("-", " ") &&
        upload.semyear?.toLowerCase() === item.toLowerCase()
    )
  );

  if (filteredSemYears.length === 0) {
    return (
      <div className="h-screen-minus-64 flex justify-center items-center mt-24 text-center text-subTextLight dark:text-subTextDark font-medium text-lg">
        No {title.toLowerCase()} data found for{" "}
        {programme.toUpperCase().replaceAll("-", " ")} programme.
      </div>
    );
  }

  return (
    <div className="mt-24 px-5 md:px-10 lg:px-20 flex flex-col items-center gap-8  text-textLight dark:text-textDark min-h-screen-minus-64">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-extrabold text-lightGreen dark:text-darkGreen">
          {selectedProgramme.programmefullname}
        </h1>
        <p className="text-subTextLight dark:text-subTextDark md:text-lg">
          {isSemester
            ? `Select a semester to view ${resource}`
            : `Select a year to view ${resource}`}
        </p>
      </div>

      {/* List of Semesters/Years */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full justify-items-center">
        {filteredSemYears.map((item, index) => (
          <Link
            key={index}
            to={`/${resource}/${university}/${programme}/${item
              .toLowerCase()
              .replace(" ", "-")}`}
            className="group w-full max-w-[220px] bg-light dark:bg-gray-900 backdrop-blur-lg border border-slate-100 dark:border-gray-700 rounded-2xl shadow-md hover:shadow-xl hover-supported:hover:scale-110 transition-all duration-300 p-6 flex flex-col justify-center items-center text-center"
          >
            <div className="uppercase text-3xl font-bold text-lightGreen dark:text-darkGreen group-hover:text-darkGreen dark:group-hover:text-lightGreen transition-colors duration-300">
              {university} {programme}
            </div>
            <p className="text-subTextLight dark:text-subTextDark mt-2 font-medium">
              {item}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SemYear;
