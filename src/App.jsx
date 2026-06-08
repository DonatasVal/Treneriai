import { lazy } from "react";
import { BookingProvider } from "./context/BookingContext.jsx";

const LandingPage = lazy(() => import("./pages/LandingPage.jsx"));
const AdminPage = lazy(() => import("./pages/AdminPage.jsx"));

function getCurrentRoute() {
  const hashRoute = window.location.hash.replace("#", "");
  const pathRoute = window.location.pathname;

  return hashRoute || pathRoute || "/";
}

export default function App() {
  const route = getCurrentRoute();

  return (
    <BookingProvider>
      {route === "/admin" ? <AdminPage /> : <LandingPage />}
    </BookingProvider>
  );
}