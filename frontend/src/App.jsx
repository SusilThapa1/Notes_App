import { Routes, Route } from "react-router-dom";
import Login from "./components/Auth/Login";
import Navbar from "./components/Navbar";
import Programme from "./components/Resources/Programme";
import Homepage from "./pages/Homepage";
import SignUp from "./components/Auth/SignUp";
import Resources from "./components/Resources/Resources";
import AdminPage from "./pages/AdminPage";
import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PageNotFound from "./components/PageNotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import ChangePass from "./components/Auth/ChangePass";
import DeleteMyAccount from "./components/Auth/DeleteMyAccount.jsx";
import OTPVerify from "./components/Auth/OTPVerify.jsx";
import ForgotPassword from "./components/ForgotPassword.jsx";
import Profile from "./components/Profile.jsx";
import PrivacyPolicy from "./components/Footer/PrivacyPolicy.jsx";
import TermsConditions from "./components/Footer/TermsConditions.jsx";
import Footer from "./components/Footer/Footer.jsx";
import ContactUs from "./components/ContactUs.jsx";
import CodeOfConduct from "./components/Footer/CodeOfConduct.jsx";
 
import ScrollToTop from "./components/ScrollToTop.jsx";
import NotAuthorized from "./components/NotAuthorized.jsx";
import PublicRoute from "./components/PublicRoute.jsx";
import ViewLogins from "./components/Auth/ViewLogins.jsx";

function App() {
  return (
    <div className="">
      <ScrollToTop />
      <Navbar />
      <main className="flex-grow flex flex-col min-h-screen">
        <Routes>
          <Route path="/" element={<Homepage />} />
          {/* <Route path="/study/programme" element={<Programme />} /> */}
          <Route element={<PublicRoute />}>
            <Route path="/study/signin" element={<Login />} />
            <Route path="/study/signup" element={<SignUp />} />
          </Route>

          {/* Grouped resource routes */}
          <Route path="/study/syllabus" element={<Programme />} />
          <Route path="/study/notes" element={<Programme />} />
          <Route path="/study/questions" element={<Programme />} />

          {/* Protected Route */}
          <Route element={<ProtectedRoute roleRequired="admin" />}>
            <Route path="/study/admin/*" element={<AdminPage />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route
              path="/study/user/change-password"
              element={<ChangePass />}
            />
            <Route
              path="/study/user/view-logins"
              element={<ViewLogins />}
            />
            <Route
              path="/study/user/deletemyaccount"
              element={<DeleteMyAccount />}
            />
            <Route
              path="/study/user/email-verify-OTP"
              element={<OTPVerify />}
            />
            <Route
              path="/study/user/email-change-verify-OTP"
              element={<OTPVerify />}
            />
          </Route>
          <Route path="/study/forgot-password" element={<ForgotPassword />} />

          <Route path="/study/userprofile" element={<Profile />} />

          {/* Dynamic resource routes */}
          <Route
            path="/study/syllabus/:programme"
            element={<Resources resource="syllabus" />}
          />
          <Route
            path="/study/notes/:programme"
            element={<Resources resource="notes" />}
          />
          <Route
            path="/study/questions/:programme"
            element={<Resources resource="questions" />}
          />

          {/* Privacy policy & terms and conditions routes */}
          <Route path="/study/privacy-policy" element={<PrivacyPolicy />} />
          <Route
            path="/study/terms-and-conditions"
            element={<TermsConditions />}
          />
          <Route path="/study/code-of-conduct" element={<CodeOfConduct />} />
          <Route path="/study/contact-us" element={<ContactUs />} />
          <Route path="/study/feedback" element={<ContactUs />} />

          {/* 404/403 Not Found / Aot Authorized Routes */}
          <Route path="/study/not-found" element={<PageNotFound />} />
          <Route path="/study/not-authorize" element={<NotAuthorized />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </main>
      <Footer />

      <ToastContainer
        stacked
        transition={Slide}
        position="top-center"
        autoClose={2000}
        toastClassName="toast-auto-width"
        hideProgressBar
      />
    </div>
  );
}

export default App;
