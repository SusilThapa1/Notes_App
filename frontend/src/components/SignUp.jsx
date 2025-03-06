import React, { useState } from "react";
import { Link } from "react-router-dom";

import { LuEyeClosed } from "react-icons/lu";
import { LuEye } from "react-icons/lu";
const SignUp = () => {
  const [showPass, setShowPass] = useState(false);
  const passShow = () => {
    setShowPass(!showPass);
  };
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    phone: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // let res = await fetch("http://localhost:3000/signup", {
    //   method: "POST",
    //   headers: {
    //     Accept: "application/form-data",
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(formData),
    // });
    // const data = await res.json();
    // console.log(data);
    // if (data.status) {
    //   localStorage.setItem("auth-token", data.token);
    //   window.location.replace("/");
    // }
    if (
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.gender ||
      !formData.phone
    ) {
      alert("Please fill all the fields.");
      return;
    }
    if (!(formData.confirmPassword === formData.password)) {
      alert("Confirm password not matched. Please recheck");
      return;
    }
    window.location.replace("/");
  };

  return (
    <div className="mx-auto my-16 flex h-max w-[90%] flex-col justify-center gap-3 rounded-lg bg-gray-100 px-3 md:px-5 py-3 shadow-md md:w-[40%]">
      <h1 className="text-[5vw] md:text-2xl font-semibold">Sign Up</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Your name"
          className="rounded-lg border p-2 bg-transparent"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email address"
          className="rounded-lg border p-2 bg-transparent"
        />
        <div className="rounded-lg border p-2 flex justify-between items-center">
          <input
            type={`${showPass ? "text" : "password"}`}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="border-none outline-none w-full bg-transparent"
          />
          <span onClick={passShow}>
            {showPass ? <LuEye /> : <LuEyeClosed />}
          </span>
        </div>
        <input
          type={`${showPass ? "text" : "password"}`}
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm password"
          className="rounded-lg border p-2 bg-transparent"
        />
        <div className="flex gap-5 md:gap-10">
          <div>
            <input
              type="radio"
              name="gender"
              value="male"
              id="male"
              checked={formData.gender === "male"}
              onChange={handleChange}
              className="cursor-pointer"
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
            />
            <label htmlFor="others" className="cursor-pointer">
              Others
            </label>
          </div>
        </div>
        <input
          type="number"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Your phone number"
          className="appearance-none rounded-lg border-2 border-gray-200 p-2 bg-transparent"
        />
        <button className="rounded-lg  bg-green-500 px-5 py-2 text-white hover:bg-[#13b858]">
          Sign Up
        </button>
      </form>
      <p className="w-full text-center">
        Already have an account?{" "}
        <Link to="/login" className="cursor-pointer text-red-500">
          Login here
        </Link>
      </p>
    </div>
  );
};

export default SignUp;
