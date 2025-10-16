import { useContext, useRef, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  otpResend,
  verifyEmail,
  verifyEmailChange,
} from "../../../Services/userService";
import { AuthContext } from "../Context/AuthContext";

const OTPVerify = () => {
  const location = useLocation();
  const lastSeg = decodeURIComponent(location.pathname.split("/")[3] || "");
  const { userId } = location.state || {};
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [disabled, setDisabled] = useState(false);

  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const { setUserSession, userDetails } = useContext(AuthContext);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) inputRefs.current[index + 1].focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    toast.dismiss();
    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 6) {
      setError("Please enter a 6-digit OTP.");
      return toast.error("OTP must be 6 digits.");
    }

    const userid = userId;
    try {
      const res = await verifyEmail(enteredOtp, userid);
      if (res?.success) {
        setUserSession(res?.user); // frontend UI only
        toast.success(res?.message);
        // navigate("/study/signin");
      } else toast.error(res?.message);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
      console.error(err.message);
    }
    setError("");
  };

  const handleChangeVerify = async (e) => {
    e.preventDefault();
    toast.dismiss();
    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 6) {
      setError("Please enter a 6-digit OTP.");
      return toast.error("OTP must be 6 digits.");
    }

    try {
      const res = await verifyEmailChange(enteredOtp);
      if (res.success) {
        setUserSession(res.user); // frontend UI only
        toast.success(res.message);
        navigate("/");
      } else toast.error(res.message);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
      console.error(err.message);
    }
    setError("");
  };

  const handleResendOtp = async () => {
    const userId = user?.id;
    try {
      const res = await otpResend(userId);
      if (res.success) toast.success(res.message);
      else toast.error(res?.message);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Could not resend OTP");
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
      setDisabled(false);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  return (
    <div className="mt-24 flex h-[calc(100vh-100px)] justify-start items-center flex-col w-full px-5">
      <div className="flex flex-col justify-center items-center gap-10">
        <h1 className="text-lg font-bold text-lightGreen">
          {lastSeg === "email-verify-OTP"
            ? "Email Verification OTP"
            : "Email Change Verification OTP"}
        </h1>
        <div className="flex flex-col justify-center items-center gap-5">
          <h1 className="text-center font-semibold">
            {lastSeg === "email-verify-OTP"
              ? "Please enter the 6-digit OTP sent to your email"
              : "Please enter the 6-digit OTP sent to your new email"}
          </h1>

          <form
            onSubmit={
              lastSeg === "email-verify-OTP" ? handleVerify : handleChangeVerify
            }
            className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center"
          >
            <div className="flex justify-center gap-2">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(e, idx)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  ref={(el) => (inputRefs.current[idx] = el)}
                  className="w-10 h-10 sm:w-12 sm:h-12 text-center text-xl border-2 border-gray-300 rounded-lg outline-slate-200 focus:ring-2 focus:ring-green-500 transition-all duration-300"
                />
              ))}
            </div>
            <button
              type="submit"
              className={`${
                error || otp.some((d) => d === "")
                  ? "bg-red-600"
                  : " bg-lightGreen"
              } text-white px-4 sm:px-6 py-1 sm:py-2 shadow-lg font-medium rounded-lg`}
            >
              Verify
            </button>
          </form>

          <button
            onClick={handleResendOtp}
            disabled={disabled}
            type="button"
            className="hover:bg-lightGreen hover-supported:hover:border-transparent hover-supported:hover:text-white border-2 border-slate-100 px-4 sm:px-6 py-1 sm:py-2 shadow-lg rounded-2xl transition-all duration-500"
          >
            {disabled ? `Try again in ${countdown}s` : "Resend OTP"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OTPVerify;
