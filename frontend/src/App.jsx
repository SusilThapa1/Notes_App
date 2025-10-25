import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./components/Auth/Login";
import Navbar from "./components/Common/Navbar";
import Programme from "./components/Resources/Programme";
import Homepage from "./pages/Homepage";
import SignUp from "./components/Auth/SignUp";
import Resources from "./components/Resources/Resources";
import AdminPage from "./pages/AdminPage";
import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PageNotFound from "./components/Error/PageNotFound";
import ProtectedRoute from "./components/Common/ProtectedRoute";
import ChangePass from "./components/Auth/ChangePass";
import DeleteMyAccount from "./components/Auth/DeleteMyAccount.jsx";
import OTPVerify from "./components/Auth/OTPVerify.jsx";
import ForgotPassword from "./components/Auth/ForgotPassword.jsx";
import Profile from "./components/User/Profile.jsx";
import PrivacyPolicy from "./components/Footer/PrivacyPolicy.jsx";
import TermsConditions from "./components/Footer/TermsConditions.jsx";
import Footer from "./components/Footer/Footer.jsx";
import ContactUs from "./components/Pages/ContactUs.jsx";
import CodeOfConduct from "./components/Footer/CodeOfConduct.jsx";

import ScrollToTop from "./components/Common/ScrollToTop.jsx";
import NotAuthorized from "./components/Error/NotAuthorized.jsx";
import PublicRoute from "./components/Common/PublicRoute.jsx";
import ViewLogins from "./components/Auth/ViewLogins.jsx";
import MyUploads from "./components/User/myuploads.jsx";
import FileViewer from "./components/Common/FileViewer.jsx";
import University from "./components/Resources/University.jsx";
import SemYear from "./components/Resources/SemYear.jsx";
import { useContext, useEffect } from "react";
import { AuthContext } from "./components/Context/AuthContext.jsx";

function App() {
  const { userDetails } = useContext(AuthContext);
  const role = userDetails?.role;
  const name = userDetails?.username;
  const id = userDetails?._id;
  const navigate = useNavigate();

  useEffect(() => {
    // if user is logged in and not already at their homepage, redirect
    if (id && window.location.pathname === "/") {
      navigate(`/${id}`);
    }
  }, [name, navigate]);
  return (
    <div>
      <ScrollToTop />
      <Navbar />

      <main className="flex-grow flex flex-col min-h-screen bg-light dark:bg-dark">
        <Routes>
          {/* ================= Home ================= */}
          <Route path="/" element={<Homepage />} />
          {id && <Route path={`/${id}`} element={<Homepage />} />}

          {/* ================= Public Auth Routes ================= */}
          <Route element={<PublicRoute />}>
            <Route path="/signin" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/email-verify-OTP" element={<OTPVerify />} />
            {/* ================= Footer Pages ================= */}
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-and-conditions" element={<TermsConditions />} />
            <Route path="/code-of-conduct" element={<CodeOfConduct />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/feedback" element={<ContactUs />} />

            {/* ================= Error Pages ================= */}
            <Route path="/not-found" element={<PageNotFound />} />
            <Route path="/not-authorize" element={<NotAuthorized />} />
          </Route>

          {/* ================= Protected Routes ================= */}
          <Route element={<ProtectedRoute roleRequired="admin" />}>
            <Route path="/admin/*" element={<AdminPage />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/user/profile" element={<Profile />} />
            <Route path="/user/myuploads" element={<MyUploads />} />
            <Route path="/user/change-password" element={<ChangePass />} />
            <Route path="/user/view-logins" element={<ViewLogins />} />
            <Route path="/user/deletemyaccount" element={<DeleteMyAccount />} />
            <Route
              path="/user/email-change-verify-OTP"
              element={<OTPVerify />}
            />
          </Route>

          {/* ================= Other Public Routes ================= */}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/admin/manageresources/:id" element={<FileViewer />} />
          <Route path="/user/myuploads/:id" element={<FileViewer />} />

          {/* ================= Study Resources (Main Flow) =================
              Flow: resource → university → programme → course
              IMPORTANT: These dynamic routes must come AFTER all specific routes
              to prevent them from catching URLs meant for other pages
          */}
          <Route path="/:resource" element={<University />} />
          <Route path="/:resource/:university" element={<Programme />} />
          <Route
            path="/:resource/:university/:programme"
            element={<SemYear />}
          />
          <Route
            path="/:resource/:university/:programme/:structure"
            element={<Resources />}
          />
          <Route
            path="/:resource/:university/:programme/:structure/:id"
            element={<FileViewer />}
          />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </main>

      <Footer />

      {/* ================= Toast Notification ================= */}
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
