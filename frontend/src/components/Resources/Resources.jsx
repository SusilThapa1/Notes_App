import { useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ProgrammesContext } from "../Context/ProgrammeContext";
import Loader from "../Loader";
import SemesterYear from "./SemesterYear";

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
    return <Loader />;
  }

  return (
    <div className="mt-24 flex flex-col gap-5 px-5 my-10 md:px-10 lg:px-20 md:mb-1">
      <h1 className="md:text-3xl text-2xl text-center underline    text-[#5CAE59] font-bold">
        <span className="uppercase">{programme} </span>
        <span className="capitalize">{resource}</span>
      </h1>

      {resource === "syllabus" && (
        <SemesterYear programme={programme} resource={resource} />
      )}
      {resource === "notes" && (
        <SemesterYear programme={programme} resource={resource} />
      )}
      {resource === "questions" && (
        <SemesterYear programme={programme} resource={resource} />
      )}
    </div>
  );
};

export default Resources;
