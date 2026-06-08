import { useEffect, useMemo, useState } from "react";
import { bookingSlots } from "../data/siteData.js";

export function useBookingForm(selectedService) {
  const requiresTime = selectedService?.bookingMode === "slot";

  const [selectedDate, setSelectedDate] = useState("2026-06-08");
  const [selectedTime, setSelectedTime] = useState("07:00");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [goal, setGoal] = useState("");
  const [contact, setContact] = useState("Telefonu");
  const [startPreference, setStartPreference] = useState("Kuo greičiau");
  const [frequency, setFrequency] = useState("3 kartus per savaitę");
  const [accepted, setAccepted] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const times = useMemo(() => bookingSlots[selectedDate] || [], [selectedDate]);

  useEffect(() => {
    setSubmitted(false);

    if (requiresTime && !selectedTime) {
      setSelectedTime((bookingSlots[selectedDate] || [])[0] || "");
    }
  }, [requiresTime, selectedService?.id, selectedDate, selectedTime]);

  function chooseDate(date) {
    setSelectedDate(date);
    setSelectedTime((bookingSlots[date] || [])[0] || "");
    setSubmitted(false);
  }

  function submit(event) {
    event.preventDefault();

    const baseValid = Boolean(name && phone && accepted && selectedService?.id);
    const timeValid = !requiresTime || Boolean(selectedDate && selectedTime);

    if (!baseValid || !timeValid) {
      return;
    }

    setSubmitted(true);
  }

  return {
    requiresTime,
    selectedDate,
    selectedTime,
    name,
    phone,
    goal,
    contact,
    startPreference,
    frequency,
    accepted,
    submitted,
    times,
    setSelectedTime,
    setName,
    setPhone,
    setGoal,
    setContact,
    setStartPreference,
    setFrequency,
    setAccepted,
    chooseDate,
    submit,
  };
}
