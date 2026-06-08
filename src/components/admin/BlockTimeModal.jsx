import { useState } from "react";

export default function BlockTimeModal({ data, onClose, onSubmit }) {
  const [reason, setReason] = useState("Treneris užimtas");

  if (!data) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/55 p-5 backdrop-blur-sm">
      <section className="w-[min(420px,100%)] rounded-[1.8rem] border border-white/60 bg-paper p-6 shadow-glass">
        <h2 className="font-display text-2xl font-extrabold tracking-[-.06em]">Pažymėti užimtumą</h2>
        <p className="mt-2 text-sm text-ink/55">
          {data.date} · {data.time}
        </p>

        <label className="mt-5 block text-sm font-black text-ink/60">Priežastis</label>
        <input
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none focus:ring-4 focus:ring-lime/20"
        />

        <div className="mt-6 flex gap-2">
          <button
            type="button"
            onClick={() => onSubmit({ ...data, reason })}
            className="rounded-full bg-forest px-5 py-3 text-sm font-black text-white"
          >
            Išsaugoti
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-ink/5 px-5 py-3 text-sm font-black text-ink"
          >
            Atšaukti
          </button>
        </div>
      </section>
    </div>
  );
}
