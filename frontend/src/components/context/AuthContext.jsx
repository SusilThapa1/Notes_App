import { createContext, useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { fetchSingleUser } from "../../../Services/userService";
import {
  heartbeat,
  logoutUser,
  sendEmailChangeVerifyOtp,
  sendVerifyOtp,
} from "../../../Services/authService";

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState(null);
  const heartbeatIntervalRef = useRef(null);
  const navigate = useNavigate();

  // Random greeting
  const greetings = [
    "Hey",
    "Howdy",
    "Hi",
    "Wassup",
    "Hello",
    "Namaste",
    "Good to see you",
  ];

  useEffect(() => {
    if (!userDetails?._id) return;

    // Check if a greeting is already stored in localStorage
    const storedGreeting = localStorage.getItem("greeting");
    if (storedGreeting) {
      setGreeting(storedGreeting);
    } else {
      const randomGreeting =
        greetings[Math.floor(Math.random() * greetings.length)];
      setGreeting(randomGreeting);
      localStorage.setItem("greeting", randomGreeting); // save for future reloads
    }
  }, [userDetails?._id]);

  const setUserSession = (newUser) => {
    setUserDetails(newUser);
  };

  // Fetch user details
  const fetchUserDetails = async () => {
    try {
      const res = await fetchSingleUser();
      if (res.success) setUserSession(res.data);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        clearSession();
        navigate("/");
      } else console.error("Failed to fetch user details:", err);
    }
  };

  // Clear session
  const clearSession = () => {
    setUserSession(null);
    setGreeting(null);
    if (heartbeatIntervalRef.current)
      clearInterval(heartbeatIntervalRef.current);
  };

  // Logout
  const logOut = async (isAutoLogout = false, message) => {
    // Optimistically clear session and navigate to sign-in to avoid race conditions
    clearSession();
    navigate("/signin", { replace: true });

    try {
      await logoutUser(); // ask backend to clear cookie/session
    } catch (err) {
      // Handle already invalidated session (remote removal, expired, etc.)
      if (err.response?.status === 401) {
        console.warn("Session removed or invalid");
      } else {
        console.error(err);
        // keep user on sign-in even if server call fails
        toast.error(
          "Logout failed on server, but your local session was cleared"
        );
      }
    }

    if (isAutoLogout) {
      toast.info("Session expired.");
    } else if (message) {
      toast.success(message);
    }
  };

  useEffect(() => {
    if (!userDetails?._id) return;

    heartbeatIntervalRef.current = setInterval(async () => {
      try {
        const res = await heartbeat();
        if (res?.user) setUserSession(res.user);
      } catch (err) {
        if (err.message === "SESSION_EXPIRED") {
          logOut(true);
        } else {
          console.error("Heartbeat error:", err);
        }
      }
    }, 15000); // every 15 sec

    return () => {
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
        heartbeatIntervalRef.current = null;
      }
    };
  }, [userDetails?._id]);

  // Initialize session on mount
  useEffect(() => {
    const init = async () => {
      await fetchUserDetails();
      setLoading(false);
    };
    init();
  }, []);

  // OTP functions
  const sendEmailVerifyOtp = async (email) => {
    if (!email) {
      navigate("/signup");
      toast.error("Email not found");
      return;
    }
    try {
      const res = await sendVerifyOtp(email);
      if (res.success) {
        toast.success(res.message);
        navigate("/user/email-verify-OTP", {
          state: { userId: res.userId },
        });
      } else toast.error(res.message);
    } catch (err) {
      toast.error(err?.response?.data?.message);
    }
  };

  const emailChangeVerifyOtp = async (email) => {
    if (!email) return toast.error("Email not found");
    try {
      const res = await sendEmailChangeVerifyOtp(email);
      if (res.success) {
        navigate("/user/email-change-verify-OTP");
        toast.success(res.message);
      } else toast.error(res.message);
    } catch (err) {
      toast.error(err?.response?.data?.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        userDetails,
        clearSession,
        setUserDetails,
        setUserSession,
        logOut,
        greeting,
        loading,
        sendEmailVerifyOtp,
        emailChangeVerifyOtp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
