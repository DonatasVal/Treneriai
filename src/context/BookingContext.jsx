import { createContext, useContext, useMemo, useState } from "react";
import { services } from "../data/siteData.js";

const BookingContext = createContext(null);

export function BookingProvider({ children }) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(services[0]);

  function openBooking(service = selectedService || services[0]) {
    setSelectedService(service);
    setIsBookingOpen(true);
  }

  function closeBooking() {
    setIsBookingOpen(false);
  }

  const value = useMemo(
    () => ({
      isBookingOpen,
      selectedService: selectedService || services[0],
      setSelectedService,
      openBooking,
      closeBooking,
    }),
    [isBookingOpen, selectedService]
  );

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking() {
  const context = useContext(BookingContext);

  if (!context) {
    throw new Error("useBooking must be used inside BookingProvider");
  }

  return context;
}
