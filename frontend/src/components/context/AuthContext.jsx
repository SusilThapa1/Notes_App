import React, { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { fetchSinglelUser, updateUser } from "../../../Services/userService";

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [userDetails, setUserDetails] = useState(null);

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
    "Yo",
    "Sup",
    "Hola",
    "Howdy",
    "Ayo",
    "Wassup",
    "Heyo",
    "Namaste",
    "Good to see ya",
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

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("greet");
    setToken(null);
    setUser(null);
    setGreeting(null);
  };

  const userDetail = async () => {
    if (!token) return; // Avoid fetching if no token
    try {
      const res = await fetchSinglelUser();
      if (res.success) {
        setUserDetails(res.data);
      } else {
        toast.error("Failed to fetch user details.");
      }
    } catch (e) {
      console.error(e);
      toast.error("Error fetching user details.");
    }
  };

  // Fetch user details when token is available
  useEffect(() => {
    if (token) {
      userDetail();
    }
  }, []); // Runs only when the token changes

  return (
    <AuthContext.Provider
      value={{
        setUserSession,
        userDetails,
        setUserDetails,
        logout,
        token,
        user,
        setUser,
        greeting,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
