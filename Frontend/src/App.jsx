import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Company from "./pages/Company";
import CompanyProfile from "./pages/CompanyProfile";
import CreateInternship from "./pages/CreateInternship";
import CompanyApplications from "./pages/CompanyApplications";
import CompanyApplicantView from "./pages/CompanyApplicantView";
import MyApplications from "./pages/MyApplications";
import EditInternship from "./pages/EditInternship";
import InternshipDetails from "./pages/InternshipDetails";
import CareerBot from "./pages/CareerBot";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/company" element={<Company />} />
        <Route path="/company/profile" element={<CompanyProfile />} />
        <Route path="/company/create" element={<CreateInternship />} />
        <Route path="/company/applications" element={<CompanyApplications />} />
        <Route
          path="/company/applications/:intershipID"
          element={<CompanyApplicantView />}
        />
        <Route path="/my-applications" element={<MyApplications />} />
        <Route path="/company/edit/:intershipID" element={<EditInternship />} />
        <Route path="/student/internship/:id" element={<InternshipDetails />} />
        <Route path="/career-bot" element={<CareerBot />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

      </Routes>

      {/* TOASTS */}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        className="text-sm sm:text-base"
        toastClassName="rounded-lg shadow-md"
        bodyClassName="text-sm"
        style={{ maxWidth: "75vw" }}
      />
    </BrowserRouter>
  );
}

export default App;
