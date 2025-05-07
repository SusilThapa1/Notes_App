import React, { useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ProgrammesContext } from "./context/ProgrammeContext";
import Syllabus from "./Syllabus";
import Notes from "./Notes";
import Questions from "./Questions";

const Resources = ({ resource }) => {
  const { programme } = useParams();
  const navigate = useNavigate();
  const { programmeLists, loading } = useContext(ProgrammesContext);

  // Extract valid programme names
  const validProgrammes =
    programmeLists?.map((p) => p.programmeshortname) || [];

  useEffect(() => {
    if (!loading && !validProgrammes.includes(programme)) {
      navigate("/not-found");
    }
  }, [programme, validProgrammes, navigate, loading]); //navigate not found page

  if (loading) {
    return (
      <div className="text-center text-2xl font-bold mt-20">Loading...</div>
    );
  }

  return (
    <div className="mt-24 flex flex-col gap-5 px-5 my-10 md:px-10 lg:px-20">
      <h1 className="md:text-3xl text-center underline font-bold">
        <span className="uppercase">{programme} </span>
        <span className="capitalize">{resource}</span>
      </h1>

      {resource === "syllabus" && <Syllabus programme={programme} />}
      {resource === "notes" && <Notes programme={programme} />}
      {resource === "questions" && <Questions programme={programme} />}
    </div>
  );
};

export default Resources;
