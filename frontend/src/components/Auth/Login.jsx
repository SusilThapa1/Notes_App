import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LuEyeClosed, LuEye } from "react-icons/lu";
import { userLogin } from "../../../Services/userService";
import { toast } from "react-toastify";
import { AuthContext } from "../Context/AuthContext";

const Login = () => {
  const [showPass, setShowPass] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const { setUserSession } = useContext(AuthContext);
  const passShow = () => setShowPass(!showPass);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("Please fill all the fields");
      return;
    }
    try {
      const res = await userLogin(formData);
      if (res?.success) {
        setUserSession(res.token, res.user);
        toast.success("Logged in Successfully.");
        navigate("/study/admin/dashboard");
      } else {
        toast.error(res.message || "Login failed");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="mx-auto h-screen my-auto w-full flex justify-center items-center ">
      <div className="flex flex-col justify-center items-center gap-5 px-5 py-8 w-[85%]  md:w-[600px] rounded-xl bg-gray-300 shadow-[0px_4px_16px_rgba(0,0,0,0.1),_0px_8px_24px_rgba(0,0,0,0.1),_0px_16px_56px_rgba(0,0,0,0.1)] ">
        <h1 className="text-[6vw] md:text-2xl text-green-600 text-center font-bold">
          Sign in
        </h1>
        <form
          method="POST"
          onSubmit={handleSubmit}
          className="flex flex-col gap-7 w-full"
        >
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email address"
            className="rounded-lg border outline-none p-2 shadow-md bg-transparent"
            aria-label="Email address"
          />
          <div className="rounded-lg border p-2 flex shadow-md justify-between items-center">
            <input
              type={showPass ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="border-none outline-none w-full bg-transparent"
              aria-label="Password"
            />
            <span onClick={passShow}>
              {showPass ? (
                <LuEye title="hide password" />
              ) : (
                <LuEyeClosed title="show password" />
              )}
            </span>
          </div>
          <button
            className="rounded-lg bg-green-500 px-5 py-2 text-white hover:bg-[#13b858]"
            aria-label="Login"
          >
            Sign in
          </button>
        </form>

        <p className="w-full text-center">
          Don't have an account?{" "}
          <Link
            to="/study/admin/signup"
            className="cursor-pointer text-red-500"
          >
            Click here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
