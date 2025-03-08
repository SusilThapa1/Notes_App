import React, { useState } from "react";
import courses from "./assets/courses";
import { GoSearch } from "react-icons/go";

const Notes = (props) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  return (
    <div className="w-full flex flex-col mb-16 gap-5">
      <div className="flex justify-between items-center">
        <h1 className="text-xl underline font-semibold uppercase">
          {props.programme} Courses
        </h1>
        <div className="flex justify-between items-center border-2 border-gray-300 p-2 rounded-lg w-[30%]">
          <input
            type="text"
            name="search"
            placeholder="Search here..."
            className="outline-none border-none w-[25%]"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <GoSearch className="text-black text-lg font-bold" />
        </div>
      </div>

      {courses
        .filter((course) => course.programme === props.programme)
        .map((course, index) => (
          <div key={index} className="flex flex-col gap-5">
            {course.course
              .sort((a, b) => a.localeCompare(b))
              .filter((sub) => sub.toLowerCase().includes(searchQuery)) // Filter based on search query
              .map((sub, i) => (
                <p
                  key={i}
                  className="border border-gray-500 shadow-md rounded-lg p-4"
                >
                  {sub}
                </p>
              ))}
          </div>
        ))}
    </div>
  );
};

export default Notes;
