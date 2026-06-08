import { AnimatePresence, motion } from "framer-motion";
import { services, slots } from "../data/siteData.js";
import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";

const months = ["Sausis", "Vasaris", "Kovas", "Balandis", "Gegužė", "Birželis", "Liepa", "Rugpjūtis", "Rugsėjis", "Spalis", "Lapkritis", "Gruodis"];
const days = ["Pr", "An", "Tr", "Kt", "Pn", "Št", "Sk"];

function CalendarLite({ selectedDate, setSelectedDate, setSelectedTime }) {
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(5);
  const available = new Set(Object.keys(slots));

  const firstDow = new Date(year, month, 1).getDay();
  const offset = firstDow === 0 ? 6 : firstDow - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [...Array(offset).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  function dateKey(day) {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  function choose(date) {
    setSelectedDate(date);
    setSelectedTime((slots[date] || [])[0] || "");
  }

  return (
    <div className="rounded-[1.65rem] border border-ink/10 bg-white p-5 shadow-soft">
      <div className="mb-4 flex items-center justify-between">
        <button type="button" onClick={() => month === 0 ? (setMonth(11), setYear(year - 1)) : setMonth(month - 1)} className="grid h-9 w-9 place-items-center rounded-full border border-ink/10 font-black">‹</button>
        <strong className="font-display text-lg tracking-[-.04em]">{months[month]} {year}</strong>
        <button type="button" onClick={() => month === 11 ? (setMonth(0), setYear(year + 1)) : setMonth(month + 1)} className="grid h-9 w-9 place-items-center rounded-full border border-ink/10 font-black">›</button>
      </div>

      <div className="grid grid-cols-7">
        {days.map((day) => <span key={day} className="pb-2 text-center text-[11px] font-black text-ink/40">{day}</span>)}
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {cells.map((day, index) => {
          if (!day) return <span key={`empty-${index}`} />;

          const date = dateKey(day);
          const active = selectedDate === date;
          const canPick = available.has(date);

          return (
            <button
              key={date}
              type="button"
              disabled={!canPick}
              onClick={() => choose(date)}
              className={`relative aspect-square rounded-2xl text-sm font-black transition ${
                active
                  ? "bg-forest text-white"
                  : canPick
                    ? "bg-lime/25 text-ink hover:scale-105 hover:bg-lime/40"
                    : "text-ink/25"
              }`}
            >
              {day}
              {canPick && <span className="absolute bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-lime" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function BookingModal({ open, onClose, selectedService, setSelectedService }) {
  const [selectedDate, setSelectedDate] = useState("2026-06-08");
  const [selectedTime, setSelectedTime] = useState("07:00");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [goal, setGoal] = useState("");
  const [contact, setContact] = useState("Telefonu");
  const [accepted, setAccepted] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const times = useMemo(() => slots[selectedDate] || [], [selectedDate]);

  useEffect(() => {
    if (!open) return;

    function onKey(event) {
      if (event.key === "Escape") onClose();
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  function submit(event) {
    event.preventDefault();
    if (!name || !phone || !accepted || !selectedDate || !selectedTime) return;
    setSubmitted(true);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[120] grid place-items-center bg-ink/58 p-5 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            className="max-h-[92vh] w-[min(1050px,100%)] overflow-auto rounded-[2.2rem] border border-white/60 bg-paper shadow-glass"
            initial={{ opacity: 0, y: 24, scale: .98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: .98 }}
            transition={{ duration: .26 }}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between gap-5 border-b border-ink/10 bg-paper/80 p-6 backdrop-blur-xl">
              <div>
                <h2 className="font-display text-3xl font-extrabold tracking-[-.06em] text-ink">Registracija treniruotei</h2>
                <p className="mt-1 text-sm text-ink/55">Pasirink paslaugą, pageidaujamą laiką ir parašyk tikslą.</p>
              </div>
              <button type="button" onClick={onClose} className="grid h-11 w-11 place-items-center rounded-full bg-ink/5 text-ink">
                <X size={20} />
              </button>
            </div>

            <div className="grid gap-5 p-6 lg:grid-cols-[.9fr_1.1fr]">
              <div className="rounded-[1.8rem] border border-ink/10 bg-white/72 p-5">
                <h3 className="mb-4 font-display text-xl font-extrabold tracking-[-.05em]">1. Paslauga</h3>
                <div className="grid gap-2">
                  {services.map((service) => (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => setSelectedService(service)}
                      className={`rounded-[1.25rem] border p-4 text-left transition ${
                        selectedService.id === service.id
                          ? "border-lime bg-lime/25"
                          : "border-ink/10 bg-white hover:border-ink/20"
                      }`}
                    >
                      <strong className="block text-ink">{service.title}</strong>
                      <span className="mt-1 block text-sm text-ink/55">{service.price} · {service.duration} · {service.note}</span>
                    </button>
                  ))}
                </div>

                <h3 className="mb-4 mt-6 font-display text-xl font-extrabold tracking-[-.05em]">2. Data</h3>
                <CalendarLite selectedDate={selectedDate} setSelectedDate={setSelectedDate} setSelectedTime={setSelectedTime} />
              </div>

              <div className="rounded-[1.8rem] border border-ink/10 bg-white/72 p-5">
                <h3 className="font-display text-xl font-extrabold tracking-[-.05em]">3. Pageidaujamas laikas</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {times.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setSelectedTime(time)}
                      className={`rounded-full border px-4 py-2 text-sm font-black transition ${
                        selectedTime === time ? "border-forest bg-forest text-white" : "border-ink/10 bg-white text-ink hover:border-ink/25"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>

                <form onSubmit={submit} className="mt-5 grid gap-3 sm:grid-cols-2">
                  <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Vardas ir pavardė *" className="rounded-[1.1rem] border border-ink/10 bg-white px-4 py-3 outline-none transition focus:border-lime focus:ring-4 focus:ring-lime/20" />
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Telefono numeris *" className="rounded-[1.1rem] border border-ink/10 bg-white px-4 py-3 outline-none transition focus:border-lime focus:ring-4 focus:ring-lime/20" />
                  <select value={contact} onChange={(e) => setContact(e.target.value)} className="rounded-[1.1rem] border border-ink/10 bg-white px-4 py-3 outline-none transition focus:border-lime focus:ring-4 focus:ring-lime/20">
                    <option>Telefonu</option>
                    <option>SMS žinute</option>
                    <option>El. paštu</option>
                    <option>Instagram / Messenger</option>
                  </select>
                  <input placeholder="El. paštas / Instagram" className="rounded-[1.1rem] border border-ink/10 bg-white px-4 py-3 outline-none transition focus:border-lime focus:ring-4 focus:ring-lime/20" />
                  <textarea
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    placeholder="Tikslas: jėga, svorio mažinimas, laikysena, energija, pasiruošimas varžyboms ar kita."
                    className="min-h-32 rounded-[1.1rem] border border-ink/10 bg-white px-4 py-3 outline-none transition focus:border-lime focus:ring-4 focus:ring-lime/20 sm:col-span-2"
                  />

                  <label className="flex gap-3 rounded-[1.25rem] border border-ink/10 bg-lime/10 p-4 text-sm leading-6 text-ink/62 sm:col-span-2">
                    <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} className="mt-1 h-4 w-4 accent-lime" />
                    <span>Sutinku, kad mano pateikti duomenys būtų naudojami registracijos administravimui. *</span>
                  </label>

                  <button
                    type="submit"
                    disabled={!accepted || !name || !phone}
                    className="rounded-full bg-forest px-6 py-4 text-sm font-black text-white shadow-soft transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 sm:col-span-2"
                  >
                    Patvirtinti registraciją
                  </button>
                </form>

                {submitted && (
                  <div className="mt-4 rounded-[1.25rem] border border-lime/50 bg-lime/20 p-4 font-bold leading-7 text-forest">
                    Registracija gauta: {selectedService.title}, {selectedDate} {selectedTime}. Treneris susisieks su tavimi pasirinktu būdu: {contact}.
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
