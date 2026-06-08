import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { BookingProvider } from "./context/BookingContext.jsx";

const TrainerLanding = lazy(() => import("./TrainerLanding.jsx"));
const TrainerAdmin = lazy(() => import("./TrainerAdmin.jsx"));

export default function App() {
  return (
    <BookingProvider>
      <Routes>
        <Route path="/" element={<TrainerLanding />} />
        <Route path="/admin" element={<TrainerAdmin />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BookingProvider>
  );
}