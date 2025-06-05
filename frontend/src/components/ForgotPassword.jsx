import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  emailRegex,
  otpRegex,
  passwordRegex,
} from "../../Validator/validator.js";
import { LuEye, LuEyeClosed } from "react-icons/lu";
import {
  passResetOtp,
  passResetOtpVerify,
  passResetSuccess,
  resetOtpResend,
} from "../../Services/userService.js";
import { useContext } from "react";
import { AuthContext } from "./Context/AuthContext.jsx";
import { useEffect } from "react";

const ForgotPassword = () => {
  const { logOut } = useContext(AuthContext);

  const [emailVerify, setEmailVerify] = useState(false);
  const [otpVerify, setOtpVerify] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const [formData, setFormData] = useState({
    newpassword: "",
    confirmpassword: "",
  });

  const navigate = useNavigate();

  const showPass = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setEmailVerify(false);
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    toast.dismiss();
    if (!email) {
      return toast.error("Please enter your email first");
    }

    if (!emailRegex.test(email)) {
      return toast.error("Invalid email format!");
    }

    try {
      const res = await passResetOtp(email);
      if (res.success) {
        console.log(res.data);
        toast.success(res.message);
        setEmailVerify(true);
      } else {
        toast.error(res?.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message);
      console.log(err);
    }
  };

  const handleOtpChange = (e) => {
    const onlyNums = e.target.value.replace(/\D/g, "");
    setOtp(onlyNums);
    setOtpVerify(false);
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    toast.dismiss();

    if (!otp) {
      return toast.error("Please enter your OTP first");
    }

    if (!otpRegex.test(otp)) {
      return toast.error("OTP must be 6 digits.");
    }
    try {
      const res = await passResetOtpVerify(otp, email);
      if (res.success) {
        toast.success(res?.message);
        setOtpVerify(true);
      } else {
        toast.error(res?.message);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message);
      console.log(err);
    }
  };

  const handlePassChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handlePassSubmit = async (e) => {
    e.preventDefault();
    toast.dismiss();

    if (!formData.newpassword || !formData.confirmpassword) {
      return toast.error("Please fill all the fields.");
    }
    if (!formData.newpassword) {
      return toast.error("Password is required.");
    }
    if (!passwordRegex.test(formData.newpassword)) {
      return toast.error(
        "Password must be 8+ chars with upper, lower, digit, and symbol."
      );
    }
    if (!formData.confirmpassword) {
      return toast.error("Confirm password is required.");
    }
    if (formData.newpassword !== formData.confirmpassword) {
      return toast.error("New password and confirm password must match.");
    }

    try {
      const res = await passResetSuccess(formData.newpassword, email);
      if (res.success) {
        toast.success("Password has been reset successfully");
        logOut();
        navigate("/");
      } else {
        toast.error(res?.message);
      }
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message);
    }
  };

  const handleResendOtp = async () => {
    try {
      const res = await resetOtpResend(email);
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res?.message);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message);
      console.log(err);
      const seconds = err.response?.data?.secondsLeft;
      if (seconds) {
        setCountdown(seconds);
        setDisabled(true);
      }
    }
  };

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    } else {
      setDisabled(false); // Enable button when time is up
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  return (
    <div className="flex flex-col  justify-center items-center w-full px-5 ">
      <div className="flex flex-col justify-center items-center gap-5 mt-14 pb-24 pt-12  w-full md:w-[70%] lg:w-[60%] min-h-[65vh] scroll-container  overflow-scroll  ">
        <h1 className="font-semibold text-lg text-center    text-[#5CAE59]">
          Follow the steps below to reset your password
        </h1>

        <div className="px-4 py-2 rounded-xl shadow-lg    bg-transparent border  border-slate-100  placeholder:font-medium w-full ">
          <div className="flex flex-col justify-center items-start gap-10">
            <h1 className="   text-[#5CAE59] font-semibold">
              Step 1: {""}Enter your email
            </h1>
            <form
              onSubmit={handleEmailSubmit}
              className="w-full flex flex-col md:flex-row items-center gap-5"
            >
              <input
                type="email"
                name="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Your email..."
                className="  w-full border-2 p-3 rounded-full shadow-lg    bg-transparent  border-slate-100  placeholder:font-medium  outline-none"
              />

              <button
                hidden={emailVerify ? true : false}
                className={`  hover-supported: hover:bg-[#5CAE59] hover-supported:hover:border-transparent transition-colors duration-500 border-2  border-slate-100 hover-supported:hover:text-white   px-3 py-2 rounded-3xl shadow-lg    bg-transparent     placeholder:font-medium min-w-max`}
              >
                Send OTP
              </button>
            </form>
          </div>
          {emailVerify && (
            <div className="flex flex-col justify-center items-start gap-5 w-full">
              <hr className="w-full mt-10  border-gray-300 border-[1px]" />
              <div className="flex flex-col justify-center items-start gap-10 w-full">
                <h1 className="   text-[#5CAE59] font-semibold">
                  Step 2: {""}Enter OTP sent to your email
                </h1>
                <form
                  onSubmit={handleOtpSubmit}
                  className="flex flex-col justify-center items-center gap-5 w-full"
                >
                  <input
                    type={otpVerify ? "password" : "text"}
                    name="otp"
                    onChange={handleOtpChange}
                    maxLength={6}
                    inputMode="numeric"
                    value={otp}
                    readOnly={otpVerify ? true : false}
                    placeholder="Enter otp here"
                    className=" w-full p-3  shadow-lg border-2  border-slate-100 rounded-full  appearance-none   outline-none bg-transparent  "
                  />

                  <div
                    className={`${
                      otpVerify ? "hidden" : ""
                    } flex justify-between items-center w-full`}
                  >
                    <button
                      onClick={handleResendOtp}
                      disabled={disabled}
                      type="button"
                      className="hover:bg-[#5CAE59] hover-supported:hover:border-transparent hover-supported:hover:text-white border-2  border-slate-100 px-3 py-2  shadow-lg rounded-2xl transition-all duration-500"
                    >
                      {disabled ? `Try again in ${countdown}s` : "Resend OTP"}
                    </button>
                    <button className="bg-transparent hover-supported: hover:bg-[#5CAE59] hover-supported:hover:border-transparent transition-colors duration-500 border-2  border-slate-100 hover-supported:hover:text-white px-5 py-2  shadow-lg rounded-2xl">
                      Next
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {emailVerify && otpVerify && (
            <div className="flex flex-col justify-center items-start gap-5 w-full">
              <hr className="w-full mt-10  border-gray-300 border-[1px]" />
              <div className="flex flex-col justify-center items-start gap-10 w-full">
                <h1 className="   text-[#5CAE59] font-semibold">
                  Step 3 : {""} Enter new password
                </h1>
                <form
                  onSubmit={handlePassSubmit}
                  className="flex flex-col justify-center items-start gap-5 w-full"
                >
                  <div className=" flex items-center justify-between w-full p-3 shadow-lg border-2  border-slate-100 rounded-3xl  appearance-none   outline-none bg-transparent ">
                    <input
                      type={isPasswordVisible ? "text" : "password"}
                      name="newpassword"
                      onChange={handlePassChange}
                      value={formData.newpassword}
                      placeholder="New password here"
                      className="bg-transparent w-full  outline-none"
                    />

                    <button type="button" onClick={showPass}>
                      {isPasswordVisible ? (
                        <LuEye title="Hide" />
                      ) : (
                        <LuEyeClosed title="Show" />
                      )}
                    </button>
                  </div>

                  <input
                    type={isPasswordVisible ? "text" : "password"}
                    name="confirmpassword"
                    disabled={!formData.newpassword ? true : false}
                    onChange={handlePassChange}
                    value={formData.confirmpassword}
                    placeholder="New password first to confirm here..."
                    className="w-full p-3  shadow-lg border-2  border-slate-100 rounded-2xl  appearance-none bg-transparent   outline-none"
                  />
                  <button className="bg-transparent hover-supported: hover:bg-[#5CAE59] hover-supported:hover:border-transparent transition-colors duration-500 border-2  border-slate-100 hover-supported:hover:text-white px-6 py-2   shadow-lg rounded-2xl self-end">
                    Done
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
