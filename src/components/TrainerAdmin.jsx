import { useMemo, useState } from "react";
import { BUSINESS } from "../data/siteData.js";

const statuses = ["Visos būsenos", "Nauja", "Laukia patvirtinimo", "Patvirtinta", "Įvykdyta", "Atšaukta", "Neatvyko"];
const timeSlots = ["06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00"];

export default function TrainerAdmin() {
  const [sessions, setSessions] = useState([
    { id: 1, client: "Mantas Kazlauskas", phone: "+370 600 11223", service: "Individuali treniruotė", date: "2026-06-08", time: "07:00", goal: "Noriu sustiprėti ir pagerinti laikyseną.", status: "Nauja" },
    { id: 2, client: "Aistė Petrauskaitė", phone: "+370 611 22334", service: "4 savaičių planas", date: "2026-06-08", time: "17:30", goal: "Tikslas – svorio mažinimas ir aiškus planas namuose.", status: "Patvirtinta" },
    { id: 3, client: "Rokas", phone: "+370 622 33445", service: "Nuotolinė priežiūra", date: "2026-06-09", time: "18:00", goal: "Noriu sportuoti 3 kartus per savaitę.", status: "Laukia patvirtinimo" },
  ]);
  const [blocked, setBlocked] = useState([{ id: 1, date: "2026-06-08", time: "12:00", reason: "Asmeninis užimtumas" }]);
  const [selectedDate, setSelectedDate] = useState("2026-06-08");
  const [statusFilter, setStatusFilter] = useState("Visos būsenos");
  const [search, setSearch] = useState("");

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return sessions
      .filter((s) => s.date === selectedDate)
      .filter((s) => statusFilter === "Visos būsenos" || s.status === statusFilter)
      .filter((s) => !q || s.client.toLowerCase().includes(q) || s.phone.includes(q) || s.service.toLowerCase().includes(q))
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [sessions, selectedDate, statusFilter, search]);

  function badge(status) {
    if (status === "Nauja") return "bg-blue-100 text-blue-700";
    if (status === "Laukia patvirtinimo") return "bg-amber-100 text-amber-700";
    if (status === "Patvirtinta") return "bg-green-100 text-green-700";
    if (status === "Atšaukta") return "bg-rose-100 text-rose-700";
    return "bg-ink/5 text-ink/60";
  }

  function slot(time) {
    return {
      session: sessions.find((s) => s.date === selectedDate && s.time === time && s.status !== "Atšaukta"),
      block: blocked.find((b) => b.date === selectedDate && b.time === time),
    };
  }

  function updateStatus(id, status) {
    setSessions((current) => current.map((s) => s.id === id ? { ...s, status } : s));
  }

  function move(id, date, time) {
    const conflict = sessions.some((s) => s.id !== id && s.date === date && s.time === time && s.status !== "Atšaukta");
    const isBlocked = blocked.some((b) => b.date === date && b.time === time);
    if (conflict || isBlocked) {
      alert("Šis laikas užimtas.");
      return;
    }
    setSessions((current) => current.map((s) => s.id === id ? { ...s, date, time } : s));
  }

  function blockTime(time) {
    const reason = window.prompt("Užimtumo priežastis:", "Treneris užimtas");
    if (!reason) return;
    if (blocked.some((b) => b.date === selectedDate && b.time === time)) return;
    setBlocked((current) => [...current, { id: Date.now(), date: selectedDate, time, reason }]);
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_10%_0%,rgba(199,244,90,.18),transparent_34%),linear-gradient(180deg,#FBFAF6,#F4F1EA)] text-ink">
      <header className="sticky top-0 z-30 border-b border-ink/10 bg-paper/75 px-5 py-6 backdrop-blur-xl">
        <div className="mx-auto flex w-[min(1320px,calc(100%-40px))] flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-display text-[clamp(2rem,4vw,3.2rem)] font-extrabold leading-none tracking-[-.07em]">Trenerio administravimas</h1>
            <p className="mt-2 text-ink/55">{BUSINESS.brand} · registracijos, grafikas ir užimtumo blokavimas.</p>
          </div>
          <a href="/" className="rounded-full bg-forest px-5 py-3 text-sm font-black text-white shadow-soft">Grįžti į svetainę</a>
        </div>
      </header>

      <section className="mx-auto w-[min(1320px,calc(100%-40px))] py-8">
        <div className="grid gap-3 lg:grid-cols-[190px_230px_1fr_auto]">
          <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none focus:ring-4 focus:ring-lime/20" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none focus:ring-4 focus:ring-lime/20">
            {statuses.map((s) => <option key={s}>{s}</option>)}
          </select>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Ieškoti pagal klientą, telefoną, paslaugą..." className="rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none focus:ring-4 focus:ring-lime/20" />
          <button onClick={() => timeSlots.forEach((t) => blockTime(t))} className="rounded-full bg-lime px-5 py-3 text-sm font-black text-forest">Blokuoti dieną</button>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-4">
          {[
            [visible.length, "Treniruotės pagal filtrą"],
            [visible.filter((s) => s.status === "Nauja").length, "Naujos registracijos"],
            [visible.filter((s) => s.status === "Patvirtinta").length, "Patvirtintos"],
            [blocked.filter((b) => b.date === selectedDate).length, "Blokuoti laikai"],
          ].map(([value, label]) => (
            <div key={label} className="rounded-[1.5rem] border border-ink/10 bg-white/85 p-5 shadow-soft">
              <div className="font-display text-4xl font-extrabold tracking-[-.07em]">{value}</div>
              <div className="mt-2 text-sm font-bold text-ink/55">{label}</div>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-5 xl:grid-cols-[1.05fr_.95fr]">
          <section className="overflow-hidden rounded-[2rem] border border-ink/10 bg-white/90 shadow-soft">
            <div className="border-b border-ink/10 bg-paper px-5 py-4">
              <h2 className="font-display text-2xl font-extrabold tracking-[-.06em]">Dienos grafikas</h2>
              <p className="text-sm text-ink/55">{selectedDate}</p>
            </div>
            <div className="grid min-w-[560px] grid-cols-[90px_1fr] overflow-x-auto">
              <div className="border-b border-r border-ink/10 bg-bone p-3 text-xs font-black uppercase tracking-[.14em] text-ink/55">Laikas</div>
              <div className="border-b border-ink/10 bg-bone p-3 text-xs font-black uppercase tracking-[.14em] text-ink/55">Užimtumas</div>
              {timeSlots.map((time) => {
                const { session, block } = slot(time);
                return (
                  <div key={time} className="contents">
                    <div className="min-h-24 border-b border-r border-ink/10 bg-paper p-3 text-sm font-black text-ink/50">{time}</div>
                    <div className="min-h-24 border-b border-ink/10 bg-white p-3">
                      {session ? (
                        <div className="rounded-2xl border border-lime/50 bg-lime/20 p-4">
                          <strong>{session.client}</strong>
                          <div className="text-sm text-ink/55">{session.service}</div>
                          <div className="mt-2 inline-flex rounded-full px-3 py-1 text-xs font-black {badge(session.status)}">{session.status}</div>
                        </div>
                      ) : block ? (
                        <div className="rounded-2xl border border-clay/30 bg-clay/15 p-4 font-bold text-ink/70">
                          {block.reason}
                          <button onClick={() => setBlocked((c) => c.filter((b) => b.id !== block.id))} className="ml-3 rounded-full bg-rose-100 px-3 py-1 text-xs font-black text-rose-700">Atlaisvinti</button>
                        </div>
                      ) : (
                        <div className="flex h-full items-center justify-between text-sm text-ink/35">
                          Laisva
                          <button onClick={() => blockTime(time)} className="rounded-full bg-ink/5 px-3 py-2 text-xs font-black text-ink">Blokuoti</button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <aside className="overflow-hidden rounded-[2rem] border border-ink/10 bg-white/90 shadow-soft">
            <div className="border-b border-ink/10 bg-paper px-5 py-4">
              <h2 className="font-display text-2xl font-extrabold tracking-[-.06em]">Registracijų sąrašas</h2>
              <p className="text-sm text-ink/55">Klientai pagal pasirinktą dieną.</p>
            </div>
            <div className="grid gap-3 p-4">
              {visible.length ? visible.map((session) => (
                <article key={session.id} className="rounded-[1.4rem] border border-ink/10 bg-white p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <strong>{session.client}</strong>
                      <div className="text-sm text-ink/55">{session.date} · {session.time} · {session.phone}</div>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-black ${badge(session.status)}`}>{session.status}</span>
                  </div>
                  <div className="mt-4 font-bold">{session.service}</div>
                  <p className="mt-2 text-sm leading-6 text-ink/55">{session.goal}</p>
                  <div className="mt-4 grid gap-2 sm:grid-cols-3">
                    <select value={session.status} onChange={(e) => updateStatus(session.id, e.target.value)} className="rounded-xl border border-ink/10 px-3 py-2 text-sm">
                      {statuses.filter((s) => s !== "Visos būsenos").map((s) => <option key={s}>{s}</option>)}
                    </select>
                    <input type="date" value={session.date} onChange={(e) => move(session.id, e.target.value, session.time)} className="rounded-xl border border-ink/10 px-3 py-2 text-sm" />
                    <select value={session.time} onChange={(e) => move(session.id, session.date, e.target.value)} className="rounded-xl border border-ink/10 px-3 py-2 text-sm">
                      {timeSlots.map((t) => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                </article>
              )) : (
                <div className="p-8 text-center text-ink/45">Pagal pasirinktus filtrus registracijų nėra.</div>
              )}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
