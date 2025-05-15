import React, { useContext } from "react";
import { ProgrammesContext } from "../Context/ProgrammeContext";
import { FaExclamationTriangle } from "react-icons/fa";
import { Link } from "react-router-dom";

const Notes = ({ programme }) => {
  const { uploads, programmeLists } = useContext(ProgrammesContext);
  const isSemesterBased = programmeLists.some(
    (program) =>
      program.academicstructure?.toLowerCase() === "semester" &&
      program.programmeshortname?.toLowerCase() === programme?.toLowerCase()
  );
  // console.log(isSemesterBased);
  const relatedUploads = uploads.filter(
    (upload) =>
      upload.programmename?.toLowerCase() === programme?.toLowerCase() &&
      upload.resources.toLowerCase() === "notes" &&
      upload.link
  );
  // console.log(relatedUploads);
  const sortedUploads = relatedUploads.sort((a, b) =>
    (a.semestername || a.year || "").localeCompare(
      b.semestername || b.year || ""
    )
  );
  // console.log(sortedUploads);
  return (
    <div className="w-full flex flex-col gap-5">
      <div className="flex justify-start items-center">
        <h1 className="md:text-xl underline font-semibold uppercase">
          {programme} {isSemesterBased ? "Semesters" : "Years"}
        </h1>
      </div>

      <div>
        {sortedUploads.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 md:justify-center items-center">
            {sortedUploads.map((upload, i) => (
              <Link
                to={upload.link}
                key={i}
                className="border font-semibold border-white text-center w-full mx-auto shadow-lg rounded-lg p-4 hover:border-none hover:bg-gradient-to-br from-cyan-200 via-gray-500 to-sky-300 hover:animate-pulse uppercase"
              >
                {upload.semestername || upload.year}
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center">
            <FaExclamationTriangle className="text-red-500 text-6xl mb-4 animate-pulse" />
            <h1 className="text-2xl font-semibold">
              No {isSemesterBased ? "Semesters" : "Years"} Uploaded Yet
            </h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notes;
