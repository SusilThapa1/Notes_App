import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../Context/AuthContext";
import { passwordRegex } from "../../../Validator/validator";
import { changePassword } from "../../../Services/authService";
const ChangePass = () => {
  const { clearSession } = useContext(AuthContext);

  const [showPass, setShowPass] = useState(false);
  const [passwords, setPasswords] = useState({
    oldpassword: "",
    newpassword: "",
    confirmnewpassword: "",
  });
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.dismiss();
    if (
      !passwords.oldpassword ||
      !passwords.newpassword ||
      !passwords.confirmnewpassword
    ) {
      return toast.error("Please fill all the fields!");
    }

    if (passwords.newpassword !== passwords.confirmnewpassword) {
      return toast.error("Confirm password must match the new password.");
    }

    if (!passwordRegex.test(passwords.newpassword))
      if (passwords.oldpassword === passwords.newpassword) {
        return toast.error(
          "New password cannot be the same as the old password."
        );
      }

    try {
      const res = await changePassword(passwords);
      if (res.success) {
        toast.success(res?.message);
        clearSession();
        navigate("/signin");
      } else {
        toast.error("Failed to change password. Try again !");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message);
    }
  };

  return (
    <div className="flex flex-col  justify-center items-center pb-5 w-full h-max md:h-screen ">
      <div className="flex flex-col justify-center items-center gap-5 mt-20  w-full md:w-[65%] ">
        <h1 className="font-semibold text-lg text-center text-textLight dark:text-textDark">
          Please enter your old password and new passwords below
        </h1>
        <div className="bg-transparent dark:bg-gray-900 border border-yellow-50 dark:border-gray-800 rounded-lg w-[90%] md:w-[70%] lg:w-[65%] p-5 ">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col justify-center items-start w-full gap-3 "
          >
            <label
              htmlFor="oldpass"
              className="text-textLight dark:text-textDark"
            >
              Old Password
            </label>
            <input
              type={showPass ? "text" : "password"}
              onChange={handleChange}
              value={passwords.oldpassword}
              name="oldpassword"
              id="oldpass"
              className="w-full px-4 py-3 rounded-full shadow-lg focus: outline-slate-200 focus:ring-2 focus:ring-gray-200 bg-transparent  border  border-slate-100 dark:border-gray-600 text-textLight dark:text-textDark placeholder:font-medium placeholder:text-subTextLight dark:placeholder:text-subTextDark"
            />
            <label
              htmlFor="newpass"
              className="text-textLight dark:text-textDark"
            >
              New Password
            </label>
            <input
              type={showPass ? "text" : "password"}
              value={passwords.newpassword}
              onChange={handleChange}
              name="newpassword"
              id="newpass"
              className="w-full px-4 py-3 rounded-full shadow-lg focus: outline-slate-200 focus:ring-2 focus:ring-gray-200 bg-transparent  border  border-slate-100 dark:border-gray-600 text-textLight dark:text-textDark placeholder:font-medium placeholder:text-subTextLight dark:placeholder:text-subTextDark"
            />
            <label
              htmlFor="confirmpass"
              className="text-textLight dark:text-textDark"
            >
              Confirm New Password
            </label>
            <input
              type={showPass ? "text" : "password"}
              onChange={handleChange}
              value={passwords.confirmnewpassword}
              name="confirmnewpassword"
              id="confirmpass"
              className="w-full px-4 py-3 rounded-full shadow-lg focus: outline-slate-200 focus:ring-2 focus:ring-gray-200 bg-transparent  border  border-slate-100 dark:border-gray-600 text-textLight dark:text-textDark placeholder:font-medium placeholder:text-subTextLight dark:placeholder:text-subTextDark"
            />
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="show"
                checked={showPass}
                onChange={(e) => setShowPass(e.target.checked)}
                className="w-5 h-5 accent-lightGreen     "
              />
              <label
                htmlFor="show"
                className={`text-textLight dark:text-textDark ${
                  showPass ? "text-lightGreen" : ""
                }`}
              >
                Show password
              </label>
            </div>
            <div className=" flex w-full justify-between items-center">
              <Link
                to="/forgot-password"
                className="text-editNormal dark:text-editOutlineText hover-supported:hover:underline "
              >
                Forgot password?
              </Link>
              <button
                type="submit"
                className=" bg-transparent border hover:border-transparent  border-slate-100 dark:border-gray-600 text-textLight dark:text-textDark px-10 py-2 rounded-3xl font-medium hover-supported: hover:bg-lightGreen dark:hover-supported:hover:bg-darkGreen hover-supported:hover:text-white active: bg-lightGreen shadow-lg transition-all duration-500"
              >
                Next
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePass;
