import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Programme from "./components/Programme";
import Homepage from "./pages/Homepage";
import SignUp from "./components/SignUp";
import Resources from "./components/Resources";
import Footer from "./components/Footer";
import AdminPage from "./pages/AdminPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PageNotFound from "./components/PageNotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProfile from "./components/Admin/AdminProfile";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/programme" element={<Programme />} />
          <Route path="/study/admin/login" element={<Login />} />
          <Route path="/study/admin/signup" element={<SignUp />} />

          {/* Grouped resource routes */}
          <Route path="/syllabus" element={<Programme />} />
          <Route path="/notes" element={<Programme />} />
          <Route path="/questions" element={<Programme />} />

          {/* Protected Route */}
          <Route element={<ProtectedRoute />}>
            <Route path="/study/admin/dashboard/*" element={<AdminPage />} />
          </Route>

          <Route path="/study/userprofile" element={<AdminProfile />} />

          {/* Dynamic resource routes */}
          <Route
            path="/syllabus/:programme"
            element={<Resources resource="syllabus" />}
          />
          <Route
            path="/notes/:programme"
            element={<Resources resource="notes" />}
          />
          <Route
            path="/questions/:programme"
            element={<Resources resource="questions" />}
          />

          {/* 404 Not Found Routes */}
          <Route path="/not-found" element={<PageNotFound />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
      <ToastContainer
        stacked
        hideProgressBar
        position="top-center"
        autoClose={700}
      />
    </div>
  );
}

export default App;
