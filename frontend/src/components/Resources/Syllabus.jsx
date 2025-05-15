import React, { useContext } from "react";
import { ProgrammesContext } from "../Context/ProgrammeContext";
import { FaExclamationTriangle } from "react-icons/fa";
import { Link } from "react-router-dom";

const Syllabus = ({ programme }) => {
  const { uploads } = useContext(ProgrammesContext);

  // Filter syllabus uploads for the current programme
  const filteredSyllabus = uploads
    .filter(
      (data) =>
        data.resources === "syllabus" &&
        data.programmename?.toLowerCase() === programme.toLowerCase()
    )
    .sort((a, b) => {
      const valA = a.semestername || a.year;
      const valB = b.semestername || b.year;
      return valA.localeCompare(valB);
    });

  return (
    <div>
      {filteredSyllabus.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 place-items-center">
          {filteredSyllabus.map((data, index) => (
            <Link
              key={index}
              to={data.link}
              className="border border-gray-200 text-center w-full mx-auto shadow-lg rounded-lg p-4 hover:border-none hover:bg-gradient-to-tr from-cyan-300 via-gray-500 to-amber-400 hover:animate-pulse uppercase"
            >
              {data?.semestername || data?.year}
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col w-full my-auto h-[50vh] items-center justify-center  text-center">
          <FaExclamationTriangle className="text-red-500 text-6xl mb-4" />
          <h1 className="md:text-3xl font-bold">Syllabus Not Found</h1>
        </div>
      )}
    </div>
  );
};

export default Syllabus;
