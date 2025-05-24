import React, { useEffect, useState, createContext } from "react";
import { fetchAllProgrammes } from "../../../Services/programmeService";
import { fetchAllUploads } from "../../../Services/uploadService";
import { fetchAllSemesters } from "../../../Services/semesterService";

const ProgrammesContext = createContext(null);

const ProgrammesProvider = ({ children }) => {
  const [programmeLists, setProgrammeLists] = useState([]);
  const [semesterLists, setSemesterLists] = useState([]);
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

    // 2. Fetch Semesters
    try {
      const res = await fetchAllSemesters();
      if (res.success) {
        setSemesterLists(res.data);
      } else {
        console.error("Error fetching semesters:", res.message);
      }
    } catch (err) {
      console.error("Semester fetch error:", err.message);
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
        semesterLists,
        setSemesterLists,
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
