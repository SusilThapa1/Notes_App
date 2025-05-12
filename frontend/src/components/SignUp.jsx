import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { MdEmail, MdPhoneInTalk } from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";
import { GiConfirmed } from "react-icons/gi";
import { LuEyeClosed } from "react-icons/lu";
import { LuEye } from "react-icons/lu";
import { registerUser } from "../../Services/userService";
import { toast } from "react-toastify";
import { AuthContext } from "./Context/AuthContext";

const SignUp = () => {
  const { setUserSession } = useContext(AuthContext);
  const [showPass, setShowPass] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    phone: "",
  });
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    phone: "",
  });

  const navigate = useNavigate();

  const passShow = () => {
    setShowPass(!showPass);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });

    let formErrors = { ...errors };

    if (name === "username") {
      formErrors.username = value ? "" : "Username is required";
    }

    if (name === "email") {
      formErrors.email =
        value && /\S+@\S+\.\S+/.test(value)
          ? ""
          : "Please enter a valid email address";
    }

    if (name === "password") {
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]{8,}$/;
      formErrors.password =
        value && passwordRegex.test(value)
          ? ""
          : "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.";
    }

    if (name === "confirmPassword") {
      formErrors.confirmPassword =
        value === formData.password ? "" : "Passwords do not match";
    }

    if (name === "phone") {
      formErrors.phone =
        value && /^(96|97|98)\d{8}$/.test(value)
          ? ""
          : "Please enter a valid 10 digits mobile number";
    }

    if (name === "gender") {
      formErrors.gender = value ? "" : "Please select a gender";
    }

    setErrors(formErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isAllFieldsEmpty = Object.values(formData).every(
      (value) => value === ""
    );

    if (isAllFieldsEmpty) {
      toast.error("Please fill all the fields");
      return;
    }

    try {
      const res = await registerUser(formData);

      if (res.success) {
        // localStorage.setItem(`token:${res.token}`);
        // localStorage.setItem(`user: ${res.user}`);
        setUserSession(res.token, res.user);
        toast.success(res.message);
        navigate("/study/admin/dashboard");
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
  };

  return (
    <div className="mx-auto mb-20 mt-24 flex h-max w-[90%] flex-col justify-center gap-3 rounded-lg bg-gray-300 px-3 md:px-5 py-3 shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)] md:w-[40%]">
      <h1 className="text-[5vw] md:text-2xl font-semibold">Sign Up</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Username */}
        <div
          className={`flex items-center border shadow-md  rounded-lg p-2 ${
            errors.username ? "border-red-500" : ""
          }`}
        >
          <FaUser className="text-gray-600 mr-2" />
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter name"
            className="w-full outline-none bg-transparent"
            aria-label="Username"
          />
        </div>
        {errors.username && (
          <p className="text-red-500 text-sm">{errors.username}</p>
        )}

        {/* Email */}
        <div
          className={`flex items-center border rounded-lg p-2 shadow-md ${
            errors.email ? "border-red-500" : ""
          }`}
        >
          <MdEmail className="text-orange-500 mr-2" />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email"
            className="w-full outline-none bg-transparent"
            aria-label="Email"
          />
        </div>
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

        {/* Password */}
        <div
          className={`flex items-center border rounded-lg p-2 shadow-md ${
            errors.password ? "border-red-500" : ""
          }`}
        >
          <TbLockPassword className="text-red-500 mr-2" />
          <input
            type={`${showPass ? "text" : "password"}`}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="border-none outline-none w-full bg-transparent"
            aria-label="Password"
          />
          <span onClick={passShow}>
            {showPass ? <LuEye title="hide" /> : <LuEyeClosed title="show" />}
          </span>
        </div>
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password}</p>
        )}

        {/* Confirm Password */}
        <div
          className={`flex items-center border rounded-lg p-2 shadow-md ${
            errors.confirmPassword ? "border-red-500" : ""
          }`}
        >
          <GiConfirmed className="text-green-500 mr-2" />
          <input
            type={`${showPass ? "text" : "password"}`}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm password"
            className="rounded-lg border-none outline-none bg-transparent w-full"
            aria-label="Confirm Password"
          />
        </div>
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
        )}

        {/* Gender */}
        <div className="flex gap-[5px] p-2 md:gap-2 border shadow-md  items-center rounded-lg">
          <p>Gender :</p>
          <div>
            <input
              type="radio"
              name="gender"
              value="male"
              id="male"
              checked={formData.gender === "male"}
              onChange={handleChange}
              className="cursor-pointer"
              aria-label="Male"
            />
            <label htmlFor="male" className="cursor-pointer">
              Male
            </label>
          </div>

          <div>
            <input
              type="radio"
              name="gender"
              value="female"
              id="female"
              checked={formData.gender === "female"}
              onChange={handleChange}
              className="cursor-pointer"
              aria-label="Female"
            />
            <label htmlFor="female" className="cursor-pointer">
              Female
            </label>
          </div>

          <div>
            <input
              type="radio"
              name="gender"
              value="others"
              id="others"
              checked={formData.gender === "others"}
              onChange={handleChange}
              className="cursor-pointer"
              aria-label="Other"
            />
            <label htmlFor="others" className="cursor-pointer">
              Others
            </label>
          </div>
        </div>
        {errors.gender && (
          <p className="text-red-500 text-sm">{errors.gender}</p>
        )}

        {/* Phone */}
        <div
          className={`flex items-center border rounded-lg p-2 shadow-md ${
            errors.phone ? "border-red-500" : ""
          }`}
        >
          <div className="flex justify-center items-center pr-5">
            <img src="/Nepal-Flag-icon.png" alt="+977" className="w-6" />

            <span>+977 </span>
          </div>
          <input
            type="number"
            max={9999999999}
            name="phone"
            id="phone"
            placeholder="Mobile number"
            className="appearance-none bg-transparent outline-none w-full"
            aria-label="Phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
        {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}

        {/* Submit Button */}
        <button
          className="rounded-lg bg-green-500 px-5 py-2 text-white hover:bg-[#13b858]"
          aria-label="sign up"
        >
          Sign Up
        </button>
      </form>

      <p className="w-full text-center">
        Already have an account?{" "}
        <Link to="/study/admin/login" className="cursor-pointer text-red-500">
          Login here
        </Link>
      </p>
    </div>
  );
};

export default SignUp;
