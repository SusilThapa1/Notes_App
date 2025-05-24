import { createContext, useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import {
  fetchSingleUser,
  logoutUser,
  sendEmailChangeVerifyOtp,
  sendVerifyOtp,
} from "../../../Services/userService";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState(localStorage.getItem("greet"));
  const [token, setToken] = useState(localStorage.getItem("token"));

  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Invalid user data in localStorage:", error);
      return null;
    }
  });

  const greetings = [
    "Hey",
    "Howdy",
    "Hi",
    "Wassup",
    "Hello",
    "Namaste",
    "Good to see you",
  ];
  const randomGreeting =
    greetings[Math.floor(Math.random() * greetings.length)];

  const setUserSession = (newToken, newUser) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    localStorage.setItem("greet", randomGreeting);
    setToken(newToken);
    setUser(newUser);
    setGreeting(randomGreeting);
  };

  const navigate = useNavigate();

  const logoutTimerRef = useRef(null);

  const logOut = async (isAutoLogout = false, text) => {
    try {
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
      }

      const res = await logoutUser();
      if (res.success) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("greet");
        setToken(null);
        setUser(null);
        setGreeting(null);
        navigate("/study/signin");

        // Show different toast messages based on logout type
        if (isAutoLogout) {
          toast.info(
            "Session expired. You have been logged out automatically."
          );
        } else {
          toast.success(text);
        }
      }
    } catch (err) {
      console.error(err?.response?.data?.message);
      toast.error("Error during logout");
    }
  };

  const userDetail = async () => {
    if (!token) return;
    try {
      const res = await fetchSingleUser();
      if (res.success) {
        setUserDetails(res.data);
      } else {
        toast.error("Failed to fetch user details.");
      }
    } catch (e) {
      console.error(e);
      toast.error("Error fetching user details.");
    } finally {
      setLoading(false);
    }
  };

  const sendEmailVerifyOtp = async (email) => {
    console.log(email);
    if (!email) {
      return toast.error("Email not found");
    }
    try {
      const resp = await sendVerifyOtp(email);
      if (resp.success) {
        toast.success(resp.message);

        navigate("/study/user/email-verify-OTP");
      } else {
        toast.error(resp.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const emailChangeVerifyOtp = async (email) => {
    console.log(email);
    if (!email) {
      return toast.error("Email not found");
    }
    try {
      const resp = await sendEmailChangeVerifyOtp(email);
      if (resp.success) {
        toast.success(resp.message);

        navigate("/study/user/email-change-verify-OTP");
      } else {
        toast.error(resp.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    let decoded;
    try {
      decoded = jwtDecode(token);
    } catch (err) {
      console.error("Invalid token");
      logOut(true);
      return;
    }

    const expiresAt = decoded.exp * 1000;
    const now = Date.now();
    const timeout = expiresAt - now;

    if (timeout <= 0) {
      // Token already expired
      logOut(true);
    } else {
      // Set timer to auto logout, pass true to show auto logout toast
      logoutTimerRef.current = setTimeout(() => {
        logOut(true);
      }, timeout);
    }

    userDetail();

    return () => {
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
      }
    };
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        setUserSession,
        userDetails,
        setUserDetails,
        logOut,
        token,
        user,
        setUser,
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
