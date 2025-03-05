import React, { useState } from "react";
import { Link } from "react-router-dom";
import { LuEyeClosed } from "react-icons/lu";
import { LuEye } from "react-icons/lu";

const Login = () => {
  const [showPass, setShowPass] = useState(false);
  const passShow = () => {
    setShowPass(!showPass);
  };
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      alert("Please fill all the fields");
      return;
    }
    window.location.replace("/");
  };
  return (
    <div className="mx-auto my-20 flex h-max w-[90%] flex-col justify-center gap-5 rounded-lg bg-gray-100 px-5 py-8 shadow-md md:w-[40%]">
      <h1 className="text-2xl font-semibold">Login</h1>
      <form
        method="POST"
        onSubmit={handleSubmit}
        className="flex flex-col gap-7"
      >
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
        <button className="rounded-lg bg-green-500 px-5 py-2 text-white hover:bg-[#13b858]">
          Login
        </button>
      </form>
      <p className="w-full text-center">
        Don't have an account?{" "}
        <Link to="/signup" className="cursor-pointer text-red-500">
          Click here
        </Link>
      </p>
    </div>
  );
};

export default Login;
