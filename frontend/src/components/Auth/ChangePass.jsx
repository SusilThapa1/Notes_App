import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../Context/AuthContext";
import { passwordRegex } from "../../../Validator/validator";
import { changePass } from "../../../Services/userService";
const ChangePass = () => {
  const [showPass, setShowPass] = useState(false);
  const [passwords, setPasswords] = useState({
    oldpassword: "",
    newpassword: "",
    confirmnewpassword: "",
  });
  const { logOut } = useContext(AuthContext);

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
      const res = await changePass(passwords);
      if (res.success) {
        toast.success(res?.message);
        logOut();
      } else {
        toast.error("Failed to change password. Try again !");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message);
      console.log(err?.response?.data?.message);
    }
  };

  return (
    <div className="flex flex-col  justify-center items-center pb-5 w-full h-max md:h-screen ">
      <div className="flex flex-col justify-center items-center gap-5 mt-20  w-full md:w-[65%] ">
        <h1 className="font-semibold text-lg text-center    text-[#5CAE59]">
          Please enter your old password and new passwords below
        </h1>
        <div className="bg-transparent border-2 border-gray-200 shadow-[0_5px_10px_rgb(0,0,0,0.2)] rounded-lg w-[90%] md:w-[70%] lg:w-[65%] p-5 ">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col justify-center items-start w-full gap-3 "
          >
            <label htmlFor="oldpass">Old Password</label>
            <input
              type={showPass ? "text" : "password"}
              onChange={handleChange}
              value={passwords.oldpassword}
              name="oldpassword"
              id="oldpass"
              className="w-full px-4 py-3 rounded-full shadow-lg focus: outline-slate-200 focus:ring-2 focus:ring-gray-200 bg-transparent border  border-slate-100  placeholder:font-medium"
            />
            <label htmlFor="newpass">New Password</label>
            <input
              type={showPass ? "text" : "password"}
              value={passwords.newpassword}
              onChange={handleChange}
              name="newpassword"
              id="newpass"
              className="w-full px-4 py-3 rounded-full shadow-lg focus: outline-slate-200 focus:ring-2 focus:ring-gray-200 bg-transparent border  border-slate-100  placeholder:font-medium"
            />
            <label htmlFor="confirmpass">Confirm New Password</label>
            <input
              type={showPass ? "text" : "password"}
              onChange={handleChange}
              value={passwords.confirmnewpassword}
              name="confirmnewpassword"
              id="confirmpass"
              className="w-full px-4 py-3 rounded-full shadow-lg focus: outline-slate-200 focus:ring-2 focus:ring-gray-200 bg-transparent border  border-slate-100  placeholder:font-medium"
            />
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="show"
                checked={showPass}
                onChange={(e) => setShowPass(e.target.checked)}
                className="w-5 h-5 accent-green-600     "
              />
              <label
                htmlFor="show"
                className={`${showPass ? "   text-[#5CAE59]" : ""}`}
              >
                Show password
              </label>
            </div>
            <div className=" flex w-full justify-between items-center">
              <Link
                to="/study/forgot-password"
                className="text-blue-500 hover-supported:hover:underline "
              >
                Forgot password?
              </Link>
              <button
                type="submit"
                className=" bg-transparent border hover:border-transparent  border-slate-100   px-10 py-2 rounded-3xl font-medium hover-supported: hover:bg-[#5CAE59] hover-supported:hover:text-gray-200 active:bg-green-600 shadow-lg transition-all duration-500"
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
