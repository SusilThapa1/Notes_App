import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";
import { GiConfirmed } from "react-icons/gi";
import { LuEyeClosed, LuEye } from "react-icons/lu";
import { registerUser } from "../../../Services/userService";
import { toast } from "react-toastify";
import { AuthContext } from "../Context/AuthContext";
import { emailRegex, passwordRegex } from "../../../Validator/validator";

const SignUp = () => {
  const { sendEmailVerifyOtp } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    agree: "",
  });
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
  });

  const passShow = () => setShowPass(!showPass);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    let formErrors = { ...errors };

    if (name === "username") {
      formErrors.username = value ? "" : "Username is required";
    }

    if (name === "email") {
      formErrors.email =
        value && emailRegex.test(value)
          ? ""
          : "Please enter a valid email address";
    }

    if (name === "password") {
      formErrors.password =
        value && passwordRegex.test(value)
          ? ""
          : "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.";
    }

    if (name === "confirmPassword") {
      formErrors.confirmPassword =
        value === formData.password ? "" : "Passwords do not match";
    }

    if (name === "gender") {
      formErrors.gender = value ? "" : "Please select a gender";
    }

    setErrors(formErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.dismiss();

    if (
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.gender
    ) {
      toast.error("Please fill all the required fields");
      return;
    }

    try {
      setLoading(true);
      const res = await registerUser(formData);
      if (res.success) {
        await sendEmailVerifyOtp(formData.email);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto mb-10 h-auto w-full flex justify-center items-center transition-colors duration-300">
      <div className="flex flex-col justify-center items-center gap-5 p-5 mt-24 w-[85%] md:w-[600px] border border-slate-100 dark:border-gray-700 rounded-xl dark:bg-gray-900 backdrop-blur-md shadow-lg transition-all duration-300">
        <img
          loading="lazy"
          onClick={() => window.scroll(0, 0)}
          className="w-12 rounded-lg shadow-xl bg-transparent border-2 border-gray-200 dark:border-gray-700"
          src="/images/study3D21Copy.png"
          alt="logo"
        />
        <h1 className="text-lightGreen text-center font-bold">
          Create a new account
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-7 w-full">
          {/* Username */}
          <div
            className={`flex items-center bg-transparent border border-slate-100 dark:border-gray-700 px-4 py-3 rounded-full shadow-lg transition-all duration-500 ${
              errors.username ? "border-red-500" : ""
            }`}
          >
            <FaUser size={15} className="text-gray-600 dark:text-gray-300 mr-2" />
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter name"
              className="w-full bg-transparent placeholder-gray-400   focus:outline-none"
              aria-label="Username"
            />
          </div>
          {errors.username && (
            <p className="text-red-500 text-sm text-center">
              {errors.username}
            </p>
          )}

          {/* Email */}
          <div
            className={`flex items-center bg-transparent border border-slate-100 dark:border-gray-700 px-4 py-3 rounded-full shadow-lg transition-all duration-500 ${
              errors.email ? "border-red-500" : ""
            }`}
          >
            <MdEmail size={15} className="text-orange-500 mr-2" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              className="w-full bg-transparent placeholder-gray-400 text-textLight dark:text-textDark focus:outline-none"
              aria-label="Email"
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm text-center">{errors.email}</p>
          )}

          {/* Password */}
          <div
            className={`flex items-center bg-transparent border border-slate-100 dark:border-gray-700 px-4 py-3 rounded-full shadow-lg transition-all duration-500 ${
              errors.password ? "border-red-500" : ""
            }`}
          >
            <TbLockPassword size={15} className="text-red-500 mr-2" />
            <input
              type={showPass ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full bg-transparent placeholder-gray-400 text-textLight dark:text-textDark focus:outline-none"
              aria-label="Password"
            />
            <button
              type="button"
              onClick={passShow}
              className="ml-2 text-gray-600 dark:text-gray-300"
            >
              {showPass ? <LuEye title="hide" /> : <LuEyeClosed title="show" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm text-center">
              {errors.password}
            </p>
          )}

          {/* Confirm Password */}
          <div
            className={`flex items-center bg-transparent border border-slate-100 dark:border-gray-700 px-4 py-3 rounded-full shadow-lg transition-all duration-500 ${
              errors.confirmPassword ? "border-red-500" : ""
            }`}
          >
            <GiConfirmed size={15} className="text-green-500 mr-2" />
            <input
              type={showPass ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              className="w-full bg-transparent placeholder-gray-400 text-textLight dark:text-textDark focus:outline-none"
              aria-label="Confirm Password"
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm text-center">
              {errors.confirmPassword}
            </p>
          )}

          {/* Gender */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-8 bg-transparent text-textLight dark:text-textDark border border-slate-100 dark:border-gray-700 px-2 sm:px-3 md:px-4 py-3 rounded-full shadow-lg transition-all duration-500">
            <p>Gender:</p>
            {["male", "female", "others"].map((g) => (
              <label key={g} className="flex items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value={g}
                  checked={formData.gender === g}
                  onChange={handleChange}
                  className="cursor-pointer accent-green-600 text-textLight dark:text-textDark"
                />
                <span className="capitalize text-textLight dark:text-textDark">{g}</span>
              </label>
            ))}
          </div>
          {errors.gender && (
            <p className="text-red-500 text-sm text-center">{errors.gender}</p>
          )}

          {/* Agreement */}
          <div className="text-sm md:w-max text-textLight dark:text-textDark">
            <label className="flex space-x-2 pl-2">
              <input
                name="agree"
                type="checkbox"
                value="agree"
                checked={formData.agree}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, agree: e.target.checked }))
                }
                className="w-4 h-5 accent-green-600 "
                required
              />
              <span>
                I agree to the{" "}
                <a
                  href="/study/code-of-conduct"
                  className="text-blue-500 underline"
                >
                  code of conduct
                </a>{" "}
                and{" "}
                <a
                  href="/study/privacy-policy"
                  className="text-blue-500 underline"
                >
                  privacy policy
                </a>
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            disabled={loading}
            className={`px-4 py-3 rounded-xl font-medium shadow-lg text-white w-full transition-colors duration-500 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-lightGreen hover-supported:hover:bg-darkGreen"
            }`}
          >
            {loading ? "Signing up..." : "Sign up"}
          </button>
        </form>

        <p className="w-full text-center text-textLight dark:text-textDark">
          Already have an account?{" "}
          <Link to="/study/signin" className="cursor-pointer text-red-500">
            Click here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
