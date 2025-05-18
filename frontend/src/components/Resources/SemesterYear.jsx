import { useContext } from "react";
import { ProgrammesContext } from "../Context/ProgrammeContext";
import { FaExclamationTriangle } from "react-icons/fa";
import { Link } from "react-router-dom";

const SemesterYear = ({ programme, resource }) => {
  const { uploads } = useContext(ProgrammesContext);

  // Filter syllabus uploads for the current programme
  const filteredSyllabus = uploads
    .filter(
      (data) =>
        data.resources === resource &&
        data.programmename?.toLowerCase() === programme.toLowerCase() &&
        data.link
    )
    .sort((a, b) => {
      const valA = a.semestername || a.year;
      const valB = b.semestername || b.year;
      return valA.localeCompare(valB);
    });

  return (
    <div>
      {filteredSyllabus.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-16 place-items-center">
          {filteredSyllabus.map((data, index) => (
            <div key={index} className="w-full flex justify-center">
              <Link
                to={data.link}
                className="relative group border  border-slate-100 hover-supported:hover:border-transparent  text-center uppercase
                    shadow-lg rounded-xl p-4 w-full overflow-hidden
                   transition-colors duration-300"
              >
                {/* Background animated bar */}
                <span
                  className="absolute bottom-0 left-0 h-full bg-green-500 
                     w-0 group-hover:w-full 
                     transition-all duration-500 ease-in-out 
                     z-0"
                ></span>

                <span className="relative z-10">
                  {data?.semestername || data?.year}
                </span>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col w-full my-auto h-[50vh] items-center justify-center  text-center">
          <FaExclamationTriangle className="text-red-500 text-6xl mb-4 animate-pulse" />
          <h1 className="md:text-3xl font-bold capitalize">
            {resource} Not Found
          </h1>
        </div>
      )}
    </div>
  );
};

export default SemesterYear;
