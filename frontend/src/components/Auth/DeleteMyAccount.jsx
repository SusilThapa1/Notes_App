import { useContext, useState } from "react";
import { LuEye, LuEyeClosed } from "react-icons/lu";
import { toast } from "react-toastify";
import { deleteUserAccount } from "../../../Services/userService";
import { AuthContext } from "../Context/AuthContext";
import {
  showConfirm,
  showError,
  showSuccess,
} from "../../../Utils/alertHelper";

const DeleteMyAccount = () => {
  const { logOut } = useContext(AuthContext);

  const [password, setPassword] = useState("");
  const [passShow, setPassShow] = useState(false);

  const handleChange = (e) => {
    const value = e.target.value;
    setPassword(value);
  };

  const passwordShow = () => {
    setPassShow(!passShow);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password) {
      return toast.error("Password is required !");
    }

    const response = await showConfirm({
      title: "Are you sure ?",
      text: "Your account will be deleted permanently !",
    });
    if (!response.isConfirmed) return;

    try {
      const res = await deleteUserAccount(password);
      if (res?.success) {
        showSuccess({ text: "Account deleted successfully!" });
      } else {
        showError({ text: res?.message });
      }
    } catch (error) {
      showError({ text: error?.response?.data?.message });
      console.error(error);
    }
  };

  return (
    <div className="flex  justify-center items-center h-[calc(100vh-72px)] px-5 py-2 md:px-10 lg:px-20 w-full text-center">
      <div className="flex flex-col justify-center items-center w-full md:w-[80%] gap-10">
        <div className="flex flex-col justify-center items-center  gap-2 ">
          <h1 className="text-lg font-bold    text-lightGreen">
            Confirm Account Deletion
          </h1>
          <p className="text-subTextLight dark:text-subTextDark">
            Please enter your password to confirm delete
          </p>
        </div>

        <div className="flex justify-between items-center bg-transparent dark:bg-gray-900 border border-yellow-50 dark:border-gray-800 px-4 py-3 rounded-full font-medium shadow-lg transition-all duration-500 w-full md:w-[50%]">
          <input
            onChange={handleChange}
            value={password}
            name="password"
            type={`${passShow ? "text" : "password"}`}
            placeholder="Enter your password"
            className="bg-transparent w-full text-textLight dark:text-textDark outline-none"
          />

          <span
            onClick={passwordShow}
            className="cursor-pointer text-textLight dark:text-textDark"
          >
            {passShow ? <LuEye title="hide" /> : <LuEyeClosed title="show" />}
          </span>
        </div>
        <button
          onClick={handleSubmit}
          className="bg-deleteNormal hover:bg-deleteHover border border-deleteNormal text-white px-4 py-2 rounded-full font-medium shadow-lg transition-all duration-500 text-center"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default DeleteMyAccount;
