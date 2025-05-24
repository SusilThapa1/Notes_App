import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LuEyeClosed, LuEye } from "react-icons/lu";
import { userLogin } from "../../../Services/userService";
import { toast } from "react-toastify";
import { AuthContext } from "../Context/AuthContext";
import { TbLockPassword } from "react-icons/tb";
import { MdEmail } from "react-icons/md";

const Login = () => {
  const [showPass, setShowPass] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const { setUserSession, userDetails, sendEmailVerifyOtp } =
    useContext(AuthContext);
  const passShow = () => setShowPass(!showPass);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.dismiss();
    if (!formData.email || !formData.password) {
      toast.error("Please fill all the fields");
      return;
    }
    try {
      const res = await userLogin(formData);
      if (res?.success) {
        console.log("Login Response:", res);

        setUserSession(res?.token, res?.user);
        if (res?.user?.isAccountVerified) {
          toast.success(res?.message);

          if (res?.user?.role === "admin") {
            navigate("/study/admin/dashboard");
          } else {
            navigate("/");
          }
        } else {
          sendEmailVerifyOtp(formData.email);
        }
      } else {
        toast.error(res.message || "Login failed");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="mx-auto h-screen my-auto w-full flex justify-center items-center ">
      <div className="flex flex-col justify-center items-center gap-5 px-5 py-8 w-[85%]  md:w-[600px] rounded-xl bg-transparent  shadow-lg border-2  border-slate-100">
        <h1 className="  text-[#5CAE59] text-center font-bold">
          Welcome Back !
        </h1>
        <h1 className="  text-[#5CAE59] text-center font-bold">
          Sign in to Continue - EasyStudyZone
        </h1>
        <form
          method="POST"
          onSubmit={handleSubmit}
          className="flex flex-col gap-7 w-full  "
        >
          <div
            className={`flex items-center bg-transparent border  border-slate-100 outline-none  px-4 py-3 rounded-full    shadow-lg transition-all duration-500 `}
          >
            <MdEmail className="text-gray-700 mr-2" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              className="w-full  outline-none bg-transparent"
              aria-label="Email"
            />
          </div>

          {/* Password */}
          <div
            className={`flex items-center bg-transparent border  border-slate-100 outline-none  px-4 py-3 rounded-full    shadow-lg transition-all duration-500  `}
          >
            <TbLockPassword className="text-red-500 mr-2" />
            <input
              type={`${showPass ? "text" : "password"}`}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="border-none  outline-none w-full bg-transparent"
              aria-label="Password"
            />
            <button
              type="button"
              onClick={passShow}
              className="ml-2 focus:outline-none text-gray-600"
            >
              {showPass ? <LuEye title="hide" /> : <LuEyeClosed title="show" />}
            </button>
          </div>
          <button
            className="px-4 py-3 rounded-xl font-medium shadow-lg text-white bg-[#6ac067]    hover-supported:hover:bg-[#13b858] w-full transition-colors duration-500"
            aria-label="Sign in"
          >
            Sign in
          </button>
        </form>
        <div className="flex flex-col justify-center items-center gap-2  ">
          <Link
            to="/study/forgot-password"
            className="text-blue-500 hover-supported:hover:underline "
          >
            Forget password ?
          </Link>
          <p className="w-full text-center">
            Don't have an account?{" "}
            <Link
              to="/study/signup"
              className="cursor-pointer text-red-500 hover-supported:hover:underline"
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
