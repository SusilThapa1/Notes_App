import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LuEyeClosed, LuEye } from "react-icons/lu";
import { TbLockPassword } from "react-icons/tb";
import { MdEmail } from "react-icons/md";
import { toast } from "react-toastify";
import { userLogin } from "../../../Services/userService";
import { AuthContext } from "../Context/AuthContext";

const Login = () => {
  const [showPass, setShowPass] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { setUserSession, sendEmailVerifyOtp } = useContext(AuthContext);

  const passShow = () => setShowPass(!showPass);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.dismiss();

    if (!formData.email || !formData.password) {
      return toast.error("Please fill all fields");
    }

    try {
      setLoading(true);
      const res = await userLogin(formData);

      if (res.success) {
        if (res.user.isAccountVerified) {
          setUserSession(res.user);
          toast.success(res.message || "Login successful");
          navigate("/");
        } else {
          await sendEmailVerifyOtp(formData.email);
        }
      } else {
        toast.error(res.message || "Login failed");
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.response?.data ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto h-screen flex justify-center items-center w-full">
      <div className="flex flex-col justify-center items-center gap-5 px-5 py-8 w-[85%] md:w-[600px] rounded-xl bg-transparent shadow-lg border border-slate-100">
        <img
          onClick={() => window.scroll(0, 0)}
          className="w-12 rounded-lg shadow-xl bg-transparent border-2 border-gray-200 cursor-pointer"
          src="/images/study3D21Copy.png"
          alt="logo"
          loading="lazy"
        />
        <h1 className="text-[#5CAE59] text-center font-bold">Welcome Back!</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-7 w-full">
          {/* Email Field */}
          <div className="flex items-center bg-transparent border border-slate-100 px-4 py-3 rounded-full shadow-lg">
            <MdEmail className="text-gray-700 mr-2" />
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

          {/* Password Field */}
          <div className="flex items-center bg-transparent border border-slate-100 px-4 py-3 rounded-full shadow-lg">
            <TbLockPassword className="text-red-500 mr-2" />
            <input
              type={showPass ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full border-none outline-none bg-transparent"
              aria-label="Password"
            />
            <button
              type="button"
              onClick={passShow}
              className="ml-2 focus:outline-none text-gray-600"
            >
              {showPass ? <LuEye title="Hide" /> : <LuEyeClosed title="Show" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-3 rounded-xl font-medium shadow-lg text-white w-full transition-colors duration-500 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#6ac067] hover-supported:hover:bg-[#13b858]"
            }`}
            aria-label="Sign in"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="flex flex-col justify-center items-center gap-2">
          <Link
            to="/study/forgot-password"
            className="text-blue-500 hover-supported:hover:underline"
          >
            Forgot password?
          </Link>
          <p className="text-center w-full">
            Don't have an account?{" "}
            <Link
              to="/study/signup"
              className="text-red-500 hover-supported:hover:underline cursor-pointer"
            >
              Click here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
