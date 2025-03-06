// programsDetails.js
import React from "react";

const ProgrammeDetails = () => {
  const programmes = [
    {
      name: "Bachelor of Information Technology (BIT)",
      duration: "4 years (8 semesters)",
      creditHours: "140 credit hours",
      objective:
        "The BIT program aims to develop skilled IT professionals capable of handling the ever-evolving technology landscape. It covers subjects like software development, databases, network management, and system analysis.",
      eligibility:
        "Completion of 10+2 or equivalent with Mathematics and English as core subjects.",
    },
    {
      name: "Bachelor of Computer Applications (BCA)",
      duration: "4 years (8 semesters)",
      creditHours: "140 credit hours",
      objective:
        "The BCA program is designed to provide a solid foundation in computer applications, including programming, software development, and computer networks.",
      eligibility:
        "Completion of 10+2 or equivalent with a background in Science or Management.",
    },
    {
      name: "Bachelor of Engineering (BE) in Civil Engineering",
      duration: "4 years (8 semesters)",
      creditHours: "145 credit hours",
      objective:
        "The BE Civil program focuses on building infrastructure and construction projects. It covers designing, analyzing, and managing civil engineering projects like bridges, roads, and buildings.",
      eligibility:
        "Completion of 10+2 in Science with Physics, Chemistry, Mathematics, and English.",
    },
    {
      name: "Bachelor of Business Administration (BBA)",
      duration: "4 years (8 semesters)",
      creditHours: "120 credit hours",
      objective:
        "The BBA program provides a comprehensive understanding of business concepts and management principles. It prepares students for leadership roles, management positions, and entrepreneurship.",
      eligibility: "Completion of 10+2 or equivalent in any stream.",
    },
  ];

  return (
    <div className="py-12 bg-gray-100">
      <div className="max-w-7xl mx-auto  ">
        <h1 className="text-[6vw] md:text-3xl font-bold text-center mb-8">
          Our Programs
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {programmes.map((programme, index) => (
            <div
              key={index}
              className="  p-3 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <h2 className="text-[5vw] md:text-2xl text-center font-semibold mb-4">
                {programme.name}
              </h2>
              <p className="md:text-lg mb-2 text-[4vw] text-justify">
                <strong>Duration:</strong> {programme.duration}
              </p>
              <p className="md:text-lg mb-2 text-[4vw] text-justify">
                <strong>Credit Hours:</strong> {programme.creditHours}
              </p>
              <p className="md:text-lg mb-4 text-[4vw] text-justify">
                <strong>Objective:</strong> {programme.objective}
              </p>
              <p className="md:text-lg text-[4vw] text-justify">
                <strong>Eligibility:</strong> {programme.eligibility}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgrammeDetails;
