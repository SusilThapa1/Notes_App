import React from "react";
import questions from "./assets/questions";
const Questions = () => {
  return (
    <div className="mb-16 px-5">
      <h1 className="text-3xl font-bold text-center">
        Previous Year Questions
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-5">
        {questions.map((question, index) => (
          <div
            key={index}
            className="border border-gray-500 shadow-md rounded-lg p-4 text-center"
          >
            <p className="text-lg font-semibold">{question.year}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Questions;
