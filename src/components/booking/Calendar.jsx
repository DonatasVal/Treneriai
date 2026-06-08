import { memo, useState } from "react";
import { bookingSlots } from "../../data/siteData.js";

const months = ["Sausis", "Vasaris", "Kovas", "Balandis", "Gegužė", "Birželis", "Liepa", "Rugpjūtis", "Rugsėjis", "Spalis", "Lapkritis", "Gruodis"];
const days = ["Pr", "An", "Tr", "Kt", "Pn", "Št", "Sk"];

function Calendar({ selectedDate, onSelectDate }) {
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(5);
  const available = new Set(Object.keys(bookingSlots));

  const firstDow = new Date(year, month, 1).getDay();
  const offset = firstDow === 0 ? 6 : firstDow - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [...Array(offset).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  function dateKey(day) {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  function prev() {
    if (month === 0) {
      setMonth(11);
      setYear((value) => value - 1);
    } else {
      setMonth((value) => value - 1);
    }
  }

  function next() {
    if (month === 11) {
      setMonth(0);
      setYear((value) => value + 1);
    } else {
      setMonth((value) => value + 1);
    }
  }

  return (
    <div className="rounded-[1.65rem] border border-ink/10 bg-white p-5 shadow-soft">
      <div className="mb-4 flex items-center justify-between">
        <button type="button" onClick={prev} className="grid h-9 w-9 place-items-center rounded-full border border-ink/10 font-black">‹</button>
        <strong className="font-display text-lg tracking-[-.04em]">{months[month]} {year}</strong>
        <button type="button" onClick={next} className="grid h-9 w-9 place-items-center rounded-full border border-ink/10 font-black">›</button>
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
              onClick={() => onSelectDate(date)}
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

export default memo(Calendar);
