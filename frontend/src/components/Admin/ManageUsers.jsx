import { useContext, useEffect, useState } from "react";
import {
  changeRole,
  deleteUser,
  fetchAllUsers,
} from "../../../Services/userService";
import { FaTrash } from "react-icons/fa6";
import { FaExchangeAlt } from "react-icons/fa";
import { FcSearch } from "react-icons/fc";
import { toast } from "react-toastify";
import { AuthContext } from "../Context/AuthContext";
import Loader from "../Loader/Loader";
import { showConfirm, showSuccess } from "../../../Utils/alertHelper";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { loading } = useContext(AuthContext);

  const allUsers = async () => {
    try {
      const res = await fetchAllUsers();
      if (res.success) {
        setUsers(res.data);
      } else {
        toast.error(res?.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    allUsers();
  }, []);

  const handleRoleChange = async (id, role) => {
    const response = await showConfirm({
      title: `Are you sure, you want to change role?`,
      text: `Current role will be changed to ${role}`,
    });

    if (!response.isConfirmed) return;

    try {
      const res = await changeRole(id, role);
      if (res.success) {
        showSuccess({ title: `Role successfully changed to ${role}` });
        allUsers();
      } else {
        toast.error("Failed to change role");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      console.error("Error changing role:", error);
    }
  };

  const handleDelete = async (id, username, role) => {
    const response = await showConfirm({
      title: `Are you sure, you want to delete (${username})?`,
      text: "You won't be able to revert this!",
      confirmText: "Yes, delete it!",
    });

    if (!response.isConfirmed) return;

    try {
      const deleteResponse = await deleteUser(id);
      if (deleteResponse?.success) {
        toast.success(deleteResponse.message);
        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete user");
      console.error("Error deleting user:", error);
    }
  };

  const handleChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm)
  );

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col items-center w-full gap-5 bg-light dark:bg-dark text-textLight dark:text-textDark mx-auto px-2 py-10 h-screen">
      <h1 className="text-lightGreen dark:text-darkGreen text-center font-bold text-lg w-full">
        Total Users : {users.length}
      </h1>

      {/* Search Input */}
      <div className="flex justify-between items-center w-full px-3 py-2 bg-light dark:bg-gray-900 border-2 border-slate-100 dark:border-gray-700 shadow-md rounded-xl">
        <FcSearch size={25} />
        <input
          type="text"
          className="w-full bg-transparent   text-textLight dark:text-textDark focus:outline-none"
          placeholder="Search users by name or email..."
          onChange={handleChange}
          value={searchTerm}
        />
      </div>

      <div className="w-full overflow-x-auto scroll-smooth border-2 rounded-t-xl">
        <table className="w-full bg-light dark:bg-dark shadow-lg text-center rounded-t-2xl overflow-x-auto scrollbar-custom border-collapse">
          <thead className="bg-lightGreen dark:bg-darkGreen text-white">
            <tr>
              <th className="p-2 w-[5%] border border-gray-400">S.N.</th>
              <th className="p-2 border border-gray-400">User ID</th>
              <th className="p-2 border border-gray-400">Profile</th>
              <th className="p-2 border border-gray-400">Name</th>
              <th className="p-2 border border-gray-400">Email</th>
              <th className="p-2 border border-gray-400">Gender</th>
              <th className="p-2 border border-gray-400">Account Status</th>
              <th className="p-2 border border-gray-400">Role</th>
              <th className="p-2 text-center w-[20%] border border-gray-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers
                .sort((a, b) => a.username.localeCompare(b.username))
                .map((user, index) => (
                  <tr
                    key={user._id}
                    className="hover-supported:hover:bg-gray-300 dark:bg-gray-900 dark:hover:bg-gray-700 transition-all duration-500"
                  >
                    <td className="p-2 border border-gray-400">{index + 1}.</td>
                    <td className="p-2 border border-gray-400">{user?._id}</td>
                    <td className="p-2 border border-gray-400">
                      <img
                        loading="lazy"
                        src={
                          user && user?.profilepath
                            ? `${
                                import.meta.env.VITE_API_FILE_URL +
                                user?.profilepath
                              }`
                            : "/profile.png"
                        }
                        alt="profile"
                        className="w-12 h-12 md:w-16 md:h-16 rounded-full mx-auto object-cover"
                      />
                    </td>
                    <td className="p-2 border border-gray-400">
                      {user?.username}
                    </td>
                    <td className="p-2 border border-gray-400">
                      {user?.email}
                    </td>
                    <td className="p-2 border border-gray-400 capitalize">
                      {user?.gender}
                    </td>
                    <td className="p-2 border border-gray-400">
                      {user?.isAccountVerified ? "Verified" : "Not verified"}
                    </td>
                    <td className="p-2 border border-gray-400 capitalize">
                      {user?.role}
                    </td>
                    <td className="p-2 border border-gray-400">
                      <div className="flex justify-center items-center gap-4">
                        <button
                          onClick={() =>
                            handleRoleChange(
                              user._id,
                              user.role === "admin" ? "user" : "admin"
                            )
                          }
                          className="text-cyan-500 hover-supported:hover:text-cyan-600"
                          title="change access role"
                        >
                          <FaExchangeAlt size={18} />
                        </button>
                        <button
                          onClick={() =>
                            handleDelete(user._id, user?.username, user?.role)
                          }
                          className="text-red-500 hover-supported:hover:text-red-700"
                          title="delete"
                        >
                          <FaTrash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
            ) : (
              <tr className="md:h-[65vh]">
                <td
                  colSpan="9"
                  className="py-5 text-red-600 font-semibold text-xl w-full h-full border border-gray-400"
                >
                  🙅‍♂️ No users found...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
