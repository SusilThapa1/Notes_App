import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useContext } from "react";
import { ProgrammesContext } from "../Context/ProgrammeContext";
import { deleteUpload } from "../../../Services/uploadService";

const Table = ({ resource }) => {
  const navigate = useNavigate();

  const { setUploads } = useContext(ProgrammesContext);
  const handleDelete = async (id) => {
    const response = await Swal.fire({
      title: "Are you sure, you want to delete?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#49bb0f",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      width: "400px",
    });

    if (!response.isConfirmed) return;

    try {
      const deleteResponse = await deleteUpload(id);
      if (deleteResponse.success) {
        toast.success(deleteResponse.message);
        setUploads((prevUploads) =>
          prevUploads.filter((upload) => upload._id !== id)
        );
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to delete resource"
      );
      console.error(
        "Error deleting resource:",
        error?.response?.data?.message || error.message
      );
    }
  };

  const handleEdit = (upload) => {
    navigate("/study/admin/dashboard/uploadresources", { state: { upload } });
  };

  return (
    <table className="w-full bg-transparent shadow-lg text-center ">
      <thead className="bg-green-600 text-white">
        <tr className="text-center border-b border-gray-400 ">
          <th className="p-2  w-[5%] border-r border-gray-400 rounded-tl-lg">
            S.N.
          </th>
          <th className="p-2 border-r border-gray-400">Programme</th>
          <th className="p-2 border-r border-gray-400">Semester/Year</th>
          <th className="p-2 text-center w-[20%] rounded-tr-lg ">Actions</th>
        </tr>
      </thead>
      <tbody>
        {resource
          .sort((a, b) => a.semestername.localeCompare(b.semestername))
          .map((upload, index) => (
            <tr
              key={upload._id}
              className="border-b border-gray-400  rounded-b-lg hover-supported:hover:bg-gray-300 text-center transition-all duration-500"
            >
              <td className="p-2 w-[5%] border-r border-gray-400">
                {index + 1}.
              </td>
              <td className="p-2 border-r border-gray-400">
                {upload.programmename}
              </td>
              <td className="p-2 border-r border-gray-400 uppercase">
                {upload?.semestername || upload?.year}
              </td>
              <td className="p-2 flex justify-center gap-4">
                <button
                  onClick={() => handleEdit(upload)}
                  className="text-cyan-500 text-xl hover-supported:hover:text-cyan-600"
                  title="edit"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(upload._id)}
                  className="text-red-500 hover-supported:hover:text-red-700"
                  title="delete"
                >
                  <FaTrash size={18} />
                </button>
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
};

export default Table;
