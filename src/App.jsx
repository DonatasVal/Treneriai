import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { BookingProvider } from "./context/BookingContext.jsx";

const LandingPage = lazy(() => import("./pages/LandingPage.jsx"));
const AdminPage = lazy(() => import("./pages/AdminPage.jsx"));

export default function App() {
  return (
    <BookingProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BookingProvider>
  );
}
