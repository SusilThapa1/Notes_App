import React, { useEffect, useState, createContext } from "react";
import { fetchAllProgrammes } from "../../../Services/programmeService";
import { fetchAllUploads } from "../../../Services/uploadService";
import { fetchAllUniversities } from "../../../Services/universityService";

const ProgrammesContext = createContext(null);

const ProgrammesProvider = ({ children }) => {
  const [programmeLists, setProgrammeLists] = useState([]);
  const [universityLists, setUniversityLists] = useState([]);
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllData = async () => {
    setLoading(true);

    // 1. Fetch Programmes
    try {
      const res = await fetchAllProgrammes();
      if (res.success) {
        setProgrammeLists(res.data);
      } else {
        console.error("Error fetching programmes:", res.message);
      }
    } catch (err) {
      console.error("Programme fetch error:", err.message);
    }

    // 2. Fetch Universities (replaced semesters)
    try {
      const res = await fetchAllUniversities();
      if (res.success) {
        setUniversityLists(res.data);
      } else {
        console.error("Error fetching universities:", res.message);
      }
    } catch (err) {
      console.error("University fetch error:", err.message);
    }

    // 3. Fetch Uploads
    try {
      const res = await fetchAllUploads();
      if (res.success) {
        setUploads(res.data);
      } else {
        console.error("Error fetching uploads:", res.message);
      }
    } catch (err) {
      console.error("Upload fetch error:", err.message);
    }

    setLoading(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAllData();
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ProgrammesContext.Provider
      value={{
        programmeLists,
        setProgrammeLists,
        universityLists,
        setUniversityLists,
        uploads,
        setUploads,
        fetchAllData,
        loading,
      }}
    >
      {children}
    </ProgrammesContext.Provider>
  );
};

export { ProgrammesProvider, ProgrammesContext };
