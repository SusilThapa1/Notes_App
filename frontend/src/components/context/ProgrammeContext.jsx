import React, { useEffect, useState, useCallback, createContext } from "react";
import { fetchAllProgrammes } from "../../../Services/programmeService";
import { fetchAllUploads } from "../../../Services/uploadService";
import { fetchAllSemesters } from "../../../Services/semesterService";

const ProgrammesContext = createContext(null);

const ProgrammesProvider = ({ children }) => {
  const [programmeLists, setProgrammeLists] = useState([]);
  const [semesterLists, setSemesterLists] = useState([]);
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true); // Single loading state

  // Fetch All Data in Parallel
  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      const [programmesResponse, semestersResponse, uploadsResponse] =
        await Promise.all([
          fetchAllProgrammes(),
          fetchAllSemesters(),
          fetchAllUploads(),
        ]);

      if (programmesResponse.success) {
        setProgrammeLists(programmesResponse.data);
      } else {
        console.error("Error fetching programmes:", programmesResponse.message);
      }

      if (semestersResponse.success) {
        setSemesterLists(semestersResponse.data);
      } else {
        console.error("Error fetching semesters:", semestersResponse.message);
      }

      if (uploadsResponse.success) {
        setUploads(uploadsResponse.data);
      } else {
        console.error("Error fetching uploads:", uploadsResponse.message);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

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
