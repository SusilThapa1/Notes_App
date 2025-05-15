import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { ProgrammesContext } from "../Context/ProgrammeContext";

const Questions = () => {
  const location = useLocation();
  const programme = decodeURIComponent(
    location.pathname.split("/")[2]
  )?.toLowerCase();
  const { uploads } = useContext(ProgrammesContext);

  const filteredQuestions = uploads
    .filter(
      (question) =>
        question.link &&
        question.resources === "questions" &&
        question.programmename?.toLowerCase().trim() === programme.trim()
    )
    .sort(
      (a, b) =>
        a.year.localeCompare(b.year) ||
        a.semestername.localeCompare(b.semestername)
    );

  return (
    <div className="px-5">
      <h1 className="text-xl font-semibold text-center">
        Previous Questions - {programme.toUpperCase()}
      </h1>

      {filteredQuestions.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 md:justify-center items-center mt-5">
          {filteredQuestions.map((question, index) => (
            <Link
              to={question.link}
              key={index}
              target="_blank"
              className="border border-gray-200 shadow-lg rounded-lg   p-4 text-center transition-all hover:animate-pulse duration-500 hover:border-none hover:bg-gradient-to-tl from-green-500 via-cyan-500 to-red-500 uppercase"
            >
              {question.year || question.semestername}
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-lg w-full text-center text-gray-500 mt-5">
          No questions available for {programme.toUpperCase()}
        </p>
      )}
    </div>
  );
};

export default Questions;
