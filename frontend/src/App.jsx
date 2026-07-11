import { Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { OfficerDashboard } from "./pages/OfficerDashboard";
import { LoginOfficer } from "./pages/LoginOfficer";
import { LoginDriver } from "./pages/LoginDriver";
import { DriverDashboard } from "./pages/DriverDashboard";
import { Payment } from "./pages/Payment";

import { Contact } from "./pages/Contact";
import { Footer } from "flowbite-react";
import { FooterPage } from "./components/FooterPage";

import { Header } from "./components/Header";
import Success from "./pages/Success";
import { About } from "./pages/About";

export default function App() {
  return (
    <BrowserRouter>
      {/* <Header className="" bg-teal-400 /> */}
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login-officer" element={<LoginOfficer />} />
        <Route path="/login-driver" element={<LoginDriver />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/payment/success" element={<Success />} />
        <Route path="/officerDashboard" element={<OfficerDashboard />} />
        <Route path="/driverDashboard" element={<DriverDashboard />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/search" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <FooterPage />
    </BrowserRouter>
  );
}
