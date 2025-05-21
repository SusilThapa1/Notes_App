import { useContext, useState } from "react";
import { LuEye, LuEyeClosed } from "react-icons/lu";
import { toast } from "react-toastify";
import { deleteUserAccount } from "../../../Services/userService";
import Swal from "sweetalert2";
import { AuthContext } from "../Context/AuthContext";

const DeleteMyAccount = () => {
  const { logOut } = useContext(AuthContext);

  const [password, setPassword] = useState("");
  const [passShow, setPassShow] = useState(false);

  const handleChange = (e) => {
    const value = e.target.value;
    setUserData(value);
  };

  const passwordShow = () => {
    setPassShow(!passShow);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password) {
      return toast.error("Password is required !");
    }

    const response = await Swal.fire({
      title: "Are you sure, you want to delete your account?",
      text: "Your account will be deleted permanently !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#49bb0f",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      width: "600px",
      background: "#E2E8F0",
      customClass: {
        popup: "text-base sm:text-lg md:text-xl", // Tailwind font size classes
        title: "text-xl sm:text-2xl md:text-3xl font-semibold",
        confirmButton:
          "text-sm sm:text-base md:text-lg bg-blue-600 text-white px-4 py-2 rounded",
        cancelButton:
          "text-sm sm:text-base md:text-lg bg-gray-400 text-white px-4 py-2 rounded",
      },
    });

    if (!response.isConfirmed) return;

    try {
      const res = await deleteUserAccount(password);
      if (res.success) {
        toast.success("Account deleted successfully!");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("greet");
        logOut(false, "");
      } else {
        toast.error(res?.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.error(error);
    }
  };

  return (
    <div className="flex  justify-center items-center h-[calc(100vh-72px)] px-5 py-2 md:px-10 lg:px-20 w-full text-center">
      <div className="flex flex-col justify-center items-center w-full md:w-[80%] gap-10">
        <div className="flex flex-col justify-center items-center  gap-2 ">
          <h1 className="text-lg font-bold    text-[#5CAE59]">
            Confirm Account Deletion
          </h1>
          <p>Please enter your password to confirm delete</p>
        </div>

        <div className="flex justify-between items-center bg-transparent border border-slate-100   px-4 py-3 rounded-full font-medium   shadow-lg transition-all duration-500 w-full md:w-[50%]">
          <input
            onChange={handleChange}
            value={password}
            name="password"
            type={`${passShow ? "text" : "password"}`}
            placeholder="Enter your password"
            className="bg-transparent w-full  outline-none "
          />

          <span onClick={passwordShow}>
            {passShow ? <LuEye title="hide" /> : <LuEyeClosed title="show" />}
          </span>
        </div>
        <button
          onClick={handleSubmit}
          className="bg-red-600   border border-red-500 text-white  px-4 py-3 rounded-full font-medium  shadow-lg transition-all duration-500 text-center"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default DeleteMyAccount;
