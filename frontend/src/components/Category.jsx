import React from "react";
import { useParams } from "react-router-dom";

import Syllabus from "./Syllabus";
import Questions from "./Questions";
import Notes from "./Notes";

const Category = () => {
  const { programme, category } = useParams();

  return (
    <div className="mt-24 flex flex-col gap-5 px-5 my-10  md:px-10 lg:px-20">
      <h1 className="text-3xl text-center underline font-bold">
        <span className="uppercase">{programme} </span>

        <span className="capitalize">{category}</span>
      </h1>
      {category === "syllabus" && (
        <div className="  flex flex-col gap-5 justify-center items-center  ">
          {" "}
          <Syllabus />
        </div>
      )}
      {category === "notes" && <Notes programme={programme} />}
      {category === "questions" && <Questions />}
    </div>
  );
};

export default Category;
