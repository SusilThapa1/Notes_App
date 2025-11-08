import { useEffect, useContext, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ProgrammesContext } from "../Context/ProgrammeContext";
import Loader from "../Loader/Loader";
import Courses from "./Courses";

const Resources = () => {
  const { resource, university, programme, structure } = useParams();
  const navigate = useNavigate();
  const { programmeLists, universityLists, uploads, loading } =
    useContext(ProgrammesContext);

  // Get valid data from uploads
  const {
    validResources,
    validUniversities,
    validProgrammes,
    validStructures,
  } = useMemo(() => {
    if (!uploads || uploads.length === 0)
      return {
        validResources: [],
        validUniversities: [],
        validProgrammes: [],
        validStructures: [],
      };

    const resources = [
      ...new Set(
        uploads.map((u) => u.resources?.toLowerCase()).filter(Boolean)
      ),
    ];
    const universities = [
      ...new Set(
        uploads
          .map((u) => u.universityID?.universityshortname?.toLowerCase())
          .filter(Boolean)
      ),
    ];
    const programmes = [
      ...new Set(
        uploads
          .map((u) => u.programmeID?.programmeshortname?.toLowerCase())
          .filter(Boolean)
      ),
    ];
    const structures = [
      ...new Set(uploads.map((u) => u.semyear?.toLowerCase()).filter(Boolean)),
    ];

    return {
      validResources: resources,
      validUniversities: universities,
      validProgrammes: programmes,
      validStructures: structures,
    };
  }, [uploads]);

  useEffect(() => {
    if (!loading && validResources.length > 0) {
      // Validate resource
      if (resource && !validResources.includes(resource.toLowerCase())) {
        navigate("/not-found", { replace: true });
        return;
      }

      // Validate university exists
      if (university && !validUniversities.includes(university.toLowerCase())) {
        navigate("/not-found", { replace: true });
        return;
      }

      // Validate programme exists
      if (
        programme &&
        !validProgrammes.includes(programme.toLowerCase().replaceAll("-", " "))
      ) {
        navigate("/not-found", { replace: true });
        return;
      }

      // Validate structure (semester/year)
      if (structure) {
        const structureNormalized = structure
          .toLowerCase()
          .replaceAll("-", " ");
        if (!validStructures.includes(structureNormalized)) {
          navigate("/not-found", { replace: true });
          return;
        }
      }
    }
  }, [
    resource,
    university,
    programme,
    structure,
    validResources,
    validUniversities,
    validProgrammes,
    validStructures,
    loading,
    navigate,
  ]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="mt-24 flex flex-col gap-5 px-5 my-10 md:px-10 lg:px-20 md:mb-1">
      <h1 className="md:text-3xl text-2xl text-center underline    text-lightGreen font-bold">
        <span className="uppercase">{university} </span>
        <span className="uppercase">{programme} </span>
        <span className=" ">{structure} </span>
        <span className="capitalize">{resource}</span>
      </h1>
      <p className="text-center text-gray-500">
        Share your own resources! Make sure they’re genuine and helpful for
        others.
      </p>

      <Courses
        programme={programme}
        resource={resource}
        university={university}
        structure={structure}
      />

      {/* {resource === "notes" && (
        <SemesterYear programme={programme} resource={resource} />
      )}
      {resource === "questions" && (
        <SemesterYear programme={programme} resource={resource} />
      )} */}
    </div>
  );
};

export default Resources;
