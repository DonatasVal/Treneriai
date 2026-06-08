import { useMemo, useReducer, useState } from "react";
import { Link } from "react-router-dom";
import {
  BUSINESS,
  statuses,
  statusStyles,
  timeSlots,
  initialClientPlans,
} from "../../data/siteData.js";
import { adminReducer, initialAdminState } from "./adminReducer.js";
import BlockTimeModal from "./BlockTimeModal.jsx";
import Toast from "./Toast.jsx";

const weekDays = ["Pirmadienis", "Antradienis", "Trečiadienis", "Ketvirtadienis", "Penktadienis", "Šeštadienis", "Sekmadienis"];

function buildShareText(plan) {
  if (!plan) return "";

  const sessions = plan.sessions
    .map((session, index) => `${index + 1}. ${session.day} ${session.time} – ${session.focus} (${session.place})`)
    .join("\\n");

  return `Sveiki, ${plan.client},

Paruošiau Jūsų treniruočių grafiką.

Paslauga: ${plan.packageName}
Tikslas: ${plan.goal}
Pradžia: ${plan.startDate}

Grafikas:
${sessions}

Pastaba:
${plan.note || "Jeigu reikės pakeisti laiką, susisiekite su treneriu."}

Pagarbiai,
${BUSINESS.trainerName}`;
}

function ClientScheduleBuilder({ toast }) {
  const [plans, setPlans] = useState(initialClientPlans);
  const [selectedPlanId, setSelectedPlanId] = useState(initialClientPlans[0]?.id || null);
  const [draft, setDraft] = useState({
    client: "",
    phone: "",
    packageName: "Treniruočių abonementas",
    startDate: "2026-06-08",
    goal: "",
    note: "",
  });
  const [newSession, setNewSession] = useState({
    day: "Pirmadienis",
    time: "18:00",
    focus: "Jėgos treniruotė",
    place: "Sporto salė",
  });

  const selectedPlan = plans.find((plan) => plan.id === Number(selectedPlanId)) || plans[0];
  const shareText = buildShareText(selectedPlan);

  function createPlan(event) {
    event.preventDefault();

    if (!draft.client.trim() || !draft.phone.trim()) {
      toast("Įveskite kliento vardą ir telefono numerį.");
      return;
    }

    const plan = {
      id: Date.now(),
      ...draft,
      sessions: [],
    };

    setPlans((current) => [plan, ...current]);
    setSelectedPlanId(plan.id);
    setDraft({
      client: "",
      phone: "",
      packageName: "Treniruočių abonementas",
      startDate: "2026-06-08",
      goal: "",
      note: "",
    });
    toast("Kliento grafikas sukurtas.");
  }

  function updatePlan(field, value) {
    if (!selectedPlan) return;

    setPlans((current) =>
      current.map((plan) =>
        plan.id === selectedPlan.id ? { ...plan, [field]: value } : plan
      )
    );
  }

  function addSession(event) {
    event.preventDefault();

    if (!selectedPlan) {
      toast("Pirma sukurkite arba pasirinkite klientą.");
      return;
    }

    setPlans((current) =>
      current.map((plan) =>
        plan.id === selectedPlan.id
          ? {
              ...plan,
              sessions: [
                ...plan.sessions,
                {
                  id: Date.now(),
                  ...newSession,
                },
              ],
            }
          : plan
      )
    );

    setNewSession({
      day: "Pirmadienis",
      time: "18:00",
      focus: "Jėgos treniruotė",
      place: "Sporto salė",
    });
    toast("Treniruotė įtraukta į grafiką.");
  }

  function removeSession(sessionId) {
    if (!selectedPlan) return;

    setPlans((current) =>
      current.map((plan) =>
        plan.id === selectedPlan.id
          ? { ...plan, sessions: plan.sessions.filter((session) => session.id !== sessionId) }
          : plan
      )
    );
  }

  async function copySchedule() {
    if (!selectedPlan) return;

    try {
      await navigator.clipboard.writeText(shareText);
      toast("Grafikas nukopijuotas. Galite siųsti klientui SMS, Messenger ar el. paštu.");
    } catch {
      toast("Nepavyko nukopijuoti automatiškai. Pažymėkite tekstą ir nukopijuokite rankiniu būdu.");
    }
  }

  return (
    <section id="klientu-planai" className="mt-6 overflow-hidden rounded-[2rem] border border-ink/10 bg-white/90 shadow-soft">
      <div className="border-b border-ink/10 bg-paper px-5 py-4">
        <h2 className="font-display text-2xl font-extrabold tracking-[-.06em]">
          Kliento treniruočių grafikas
        </h2>
        <p className="text-sm text-ink/55">
          Treneris gali sudaryti treniruočių grafiką ir pasidalinti juo su klientu.
        </p>
      </div>

      <div className="grid gap-5 p-5 xl:grid-cols-[.9fr_1.1fr]">
        <div className="grid gap-5">
          <form onSubmit={createPlan} className="rounded-[1.5rem] border border-ink/10 bg-paper p-5">
            <h3 className="font-display text-xl font-extrabold tracking-[-.05em]">Sukurti klientui grafiką</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <input
                value={draft.client}
                onChange={(event) => setDraft((current) => ({ ...current, client: event.target.value }))}
                placeholder="Kliento vardas ir pavardė *"
                className="rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none focus:ring-4 focus:ring-lime/20"
              />
              <input
                value={draft.phone}
                onChange={(event) => setDraft((current) => ({ ...current, phone: event.target.value }))}
                placeholder="Telefonas *"
                className="rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none focus:ring-4 focus:ring-lime/20"
              />
              <select
                value={draft.packageName}
                onChange={(event) => setDraft((current) => ({ ...current, packageName: event.target.value }))}
                className="rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none focus:ring-4 focus:ring-lime/20"
              >
                <option>Treniruočių abonementas</option>
                <option>Individualių treniruočių paketas</option>
                <option>Treniruočių planas</option>
                <option>Nuotolinė priežiūra</option>
              </select>
              <input
                type="date"
                value={draft.startDate}
                onChange={(event) => setDraft((current) => ({ ...current, startDate: event.target.value }))}
                className="rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none focus:ring-4 focus:ring-lime/20"
              />
              <input
                value={draft.goal}
                onChange={(event) => setDraft((current) => ({ ...current, goal: event.target.value }))}
                placeholder="Tikslas, pvz. jėga / svorio mažinimas"
                className="rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none focus:ring-4 focus:ring-lime/20 sm:col-span-2"
              />
              <textarea
                value={draft.note}
                onChange={(event) => setDraft((current) => ({ ...current, note: event.target.value }))}
                placeholder="Pastaba klientui"
                className="min-h-24 rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none focus:ring-4 focus:ring-lime/20 sm:col-span-2"
              />
            </div>
            <button type="submit" className="mt-4 rounded-full bg-forest px-5 py-3 text-sm font-black text-white">
              Sukurti grafiką
            </button>
          </form>

          <div className="rounded-[1.5rem] border border-ink/10 bg-paper p-5">
            <h3 className="font-display text-xl font-extrabold tracking-[-.05em]">Pasirinktas klientas</h3>
            <select
              value={selectedPlan?.id || ""}
              onChange={(event) => setSelectedPlanId(event.target.value)}
              className="mt-4 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none focus:ring-4 focus:ring-lime/20"
            >
              {plans.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.client} · {plan.packageName}
                </option>
              ))}
            </select>

            {selectedPlan && (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <input
                  value={selectedPlan.goal}
                  onChange={(event) => updatePlan("goal", event.target.value)}
                  placeholder="Tikslas"
                  className="rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none focus:ring-4 focus:ring-lime/20"
                />
                <input
                  type="date"
                  value={selectedPlan.startDate}
                  onChange={(event) => updatePlan("startDate", event.target.value)}
                  className="rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none focus:ring-4 focus:ring-lime/20"
                />
                <textarea
                  value={selectedPlan.note}
                  onChange={(event) => updatePlan("note", event.target.value)}
                  placeholder="Pastaba"
                  className="min-h-24 rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none focus:ring-4 focus:ring-lime/20 sm:col-span-2"
                />
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-5">
          <form onSubmit={addSession} className="rounded-[1.5rem] border border-ink/10 bg-paper p-5">
            <h3 className="font-display text-xl font-extrabold tracking-[-.05em]">Pridėti treniruotę į grafiką</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <select
                value={newSession.day}
                onChange={(event) => setNewSession((current) => ({ ...current, day: event.target.value }))}
                className="rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none focus:ring-4 focus:ring-lime/20"
              >
                {weekDays.map((day) => <option key={day}>{day}</option>)}
              </select>
              <input
                type="time"
                value={newSession.time}
                onChange={(event) => setNewSession((current) => ({ ...current, time: event.target.value }))}
                className="rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none focus:ring-4 focus:ring-lime/20"
              />
              <input
                value={newSession.focus}
                onChange={(event) => setNewSession((current) => ({ ...current, focus: event.target.value }))}
                placeholder="Treniruotės akcentas"
                className="rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none focus:ring-4 focus:ring-lime/20"
              />
              <input
                value={newSession.place}
                onChange={(event) => setNewSession((current) => ({ ...current, place: event.target.value }))}
                placeholder="Vieta"
                className="rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none focus:ring-4 focus:ring-lime/20"
              />
            </div>
            <button type="submit" className="mt-4 rounded-full bg-lime px-5 py-3 text-sm font-black text-forest">
              Pridėti į grafiką
            </button>
          </form>

          <div className="rounded-[1.5rem] border border-ink/10 bg-paper p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-display text-xl font-extrabold tracking-[-.05em]">
                  Grafikas klientui
                </h3>
                <p className="mt-1 text-sm text-ink/55">
                  Šį tekstą galima kopijuoti ir siųsti SMS, Messenger ar el. paštu.
                </p>
              </div>
              <button
                type="button"
                onClick={copySchedule}
                className="rounded-full bg-forest px-4 py-2 text-xs font-black text-white"
              >
                Kopijuoti
              </button>
            </div>

            {selectedPlan ? (
              <>
                <div className="mt-4 grid gap-2">
                  {selectedPlan.sessions.length ? selectedPlan.sessions.map((session) => (
                    <div key={session.id} className="rounded-2xl border border-ink/10 bg-white p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <strong>{session.day} · {session.time}</strong>
                          <div className="mt-1 text-sm text-ink/55">{session.focus} · {session.place}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeSession(session.id)}
                          className="rounded-full bg-rose-100 px-3 py-1 text-xs font-black text-rose-700"
                        >
                          Pašalinti
                        </button>
                      </div>
                    </div>
                  )) : (
                    <div className="rounded-2xl border border-ink/10 bg-white p-4 text-sm font-bold text-ink/45">
                      Grafike dar nėra treniruočių.
                    </div>
                  )}
                </div>

                <textarea
                  readOnly
                  value={shareText}
                  className="mt-4 min-h-64 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm leading-6 text-ink/70 outline-none"
                />
              </>
            ) : (
              <div className="mt-4 rounded-2xl border border-ink/10 bg-white p-4 text-sm font-bold text-ink/45">
                Sukurkite arba pasirinkite klientą.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function TrainerAdmin() {
  const [state, dispatch] = useReducer(adminReducer, initialAdminState);

  const visible = useMemo(() => {
    const q = state.search.trim().toLowerCase();
    return state.sessions
      .filter((session) => session.date === state.selectedDate)
      .filter((session) => state.statusFilter === "Visos būsenos" || session.status === state.statusFilter)
      .filter((session) => !q || session.client.toLowerCase().includes(q) || session.phone.includes(q) || session.service.toLowerCase().includes(q))
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [state.sessions, state.selectedDate, state.statusFilter, state.search]);

  function getSlot(time) {
    return {
      session: state.sessions.find((item) => item.date === state.selectedDate && item.time === time && item.status !== "Atšaukta"),
      block: state.blocked.find((item) => item.date === state.selectedDate && item.time === time),
    };
  }

  const stats = [
    [visible.length, "Treniruotės pagal filtrą"],
    [visible.filter((item) => item.status === "Nauja").length, "Naujos registracijos"],
    [visible.filter((item) => item.status === "Patvirtinta").length, "Patvirtintos"],
    [state.blocked.filter((item) => item.date === state.selectedDate).length, "Blokuoti laikai"],
  ];

  function showToast(message) {
    dispatch({ type: "TOAST", payload: message });
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_10%_0%,rgba(199,244,90,.18),transparent_34%),linear-gradient(180deg,#FBFAF6,#F4F1EA)] text-ink">
      <header className="sticky top-0 z-30 border-b border-ink/10 bg-paper/75 px-5 py-6 backdrop-blur-xl">
        <div className="mx-auto flex w-[min(1320px,calc(100%-40px))] flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-display text-[clamp(2rem,4vw,3.2rem)] font-extrabold leading-none tracking-[-.07em]">Trenerio administravimas</h1>
            <p className="mt-2 text-ink/55">{BUSINESS.brand} · registracijos, grafikas ir klientų treniruočių planai.</p>
          </div>
          <Link to="/" className="rounded-full bg-forest px-5 py-3 text-sm font-black text-white shadow-soft">Grįžti į svetainę</Link>
        </div>
      </header>

      <section className="mx-auto w-[min(1320px,calc(100%-40px))] py-8">
        <div className="mb-6 flex flex-wrap gap-2">
          <a href="#registracijos" className="rounded-full bg-forest px-4 py-2 text-xs font-black text-white">Registracijos</a>
          <a href="#grafikas" className="rounded-full bg-white px-4 py-2 text-xs font-black text-ink shadow-soft">Dienos grafikas</a>
          <a href="#klientu-planai" className="rounded-full bg-white px-4 py-2 text-xs font-black text-ink shadow-soft">Klientų grafikai</a>
          <a href="#uzimtumas" className="rounded-full bg-white px-4 py-2 text-xs font-black text-ink shadow-soft">Užimtumas</a>
        </div>
        <div id="registracijos" className="grid gap-3 lg:grid-cols-[190px_230px_1fr_auto]">
          <input type="date" value={state.selectedDate} onChange={(e) => dispatch({ type: "SET_DATE", payload: e.target.value })} className="rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none focus:ring-4 focus:ring-lime/20" />
          <select value={state.statusFilter} onChange={(e) => dispatch({ type: "SET_STATUS", payload: e.target.value })} className="rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none focus:ring-4 focus:ring-lime/20">
            {statuses.map((status) => <option key={status}>{status}</option>)}
          </select>
          <input value={state.search} onChange={(e) => dispatch({ type: "SET_SEARCH", payload: e.target.value })} placeholder="Ieškoti pagal klientą, telefoną, paslaugą..." className="rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none focus:ring-4 focus:ring-lime/20" />
          <button
            type="button"
            onClick={() => dispatch({ type: "TOAST", payload: "Dienos blokavimą geriau daryti per konkrečius laikus arba integravus kalendoriaus taisykles." })}
            className="rounded-full bg-lime px-5 py-3 text-sm font-black text-forest"
          >
            Pažymėti dieną
          </button>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-4">
          {stats.map(([value, label]) => (
            <div key={label} className="rounded-[1.5rem] border border-ink/10 bg-white/85 p-5 shadow-soft">
              <div className="font-display text-4xl font-extrabold tracking-[-.07em]">{value}</div>
              <div className="mt-2 text-sm font-bold text-ink/55">{label}</div>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-5 xl:grid-cols-[1.05fr_.95fr]">
          <section id="grafikas" className="overflow-hidden rounded-[2rem] border border-ink/10 bg-white/90 shadow-soft">
            <div className="border-b border-ink/10 bg-paper px-5 py-4">
              <h2 className="font-display text-2xl font-extrabold tracking-[-.06em]">Dienos grafikas</h2>
              <p className="text-sm text-ink/55">{state.selectedDate}</p>
            </div>
            <div className="grid min-w-[560px] grid-cols-[90px_1fr] overflow-x-auto">
              <div className="border-b border-r border-ink/10 bg-bone p-3 text-xs font-black uppercase tracking-[.14em] text-ink/55">Laikas</div>
              <div className="border-b border-ink/10 bg-bone p-3 text-xs font-black uppercase tracking-[.14em] text-ink/55">Užimtumas</div>
              {timeSlots.map((time) => {
                const { session, block } = getSlot(time);

                return (
                  <div key={time} className="contents">
                    <div className="min-h-24 border-b border-r border-ink/10 bg-paper p-3 text-sm font-black text-ink/50">{time}</div>
                    <div className="min-h-24 border-b border-ink/10 bg-white p-3">
                      {session ? (
                        <div className="rounded-2xl border border-lime/50 bg-lime/20 p-4">
                          <strong>{session.client}</strong>
                          <div className="text-sm text-ink/55">{session.service}</div>
                          <span className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-black ${statusStyles[session.status] || "bg-ink/5 text-ink/60"}`}>{session.status}</span>
                        </div>
                      ) : block ? (
                        <div className="rounded-2xl border border-clay/30 bg-clay/15 p-4 font-bold text-ink/70">
                          {block.reason}
                          <button
                            type="button"
                            onClick={() => dispatch({ type: "REMOVE_BLOCK", payload: block.id })}
                            className="ml-3 rounded-full bg-rose-100 px-3 py-1 text-xs font-black text-rose-700"
                          >
                            Atlaisvinti
                          </button>
                        </div>
                      ) : (
                        <div className="flex h-full items-center justify-between text-sm text-ink/35">
                          Laisva
                          <button
                            type="button"
                            onClick={() => dispatch({ type: "OPEN_BLOCK_MODAL", payload: { date: state.selectedDate, time } })}
                            className="rounded-full bg-ink/5 px-3 py-2 text-xs font-black text-ink"
                          >
                            Blokuoti
                          </button>
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
                    <span className={`rounded-full px-3 py-1 text-xs font-black ${statusStyles[session.status] || "bg-ink/5 text-ink/60"}`}>{session.status}</span>
                  </div>
                  <div className="mt-4 font-bold">{session.service}</div>
                  <p className="mt-2 text-sm leading-6 text-ink/55">{session.goal}</p>
                  <div className="mt-4 grid gap-2 sm:grid-cols-3">
                    <select value={session.status} onChange={(e) => dispatch({ type: "UPDATE_SESSION_STATUS", payload: { id: session.id, status: e.target.value } })} className="rounded-xl border border-ink/10 px-3 py-2 text-sm">
                      {statuses.filter((status) => status !== "Visos būsenos").map((status) => <option key={status}>{status}</option>)}
                    </select>
                    <input type="date" value={session.date} onChange={(e) => dispatch({ type: "MOVE_SESSION", payload: { id: session.id, date: e.target.value, time: session.time } })} className="rounded-xl border border-ink/10 px-3 py-2 text-sm" />
                    <select value={session.time} onChange={(e) => dispatch({ type: "MOVE_SESSION", payload: { id: session.id, date: session.date, time: e.target.value } })} className="rounded-xl border border-ink/10 px-3 py-2 text-sm">
                      {timeSlots.map((time) => <option key={time}>{time}</option>)}
                    </select>
                  </div>
                </article>
              )) : (
                <div className="p-8 text-center text-ink/45">Pagal pasirinktus filtrus registracijų nėra.</div>
              )}
            </div>
          </aside>
        </div>

        <ClientScheduleBuilder toast={showToast} />
      </section>

      <BlockTimeModal
        data={state.blockModal}
        onClose={() => dispatch({ type: "CLOSE_BLOCK_MODAL" })}
        onSubmit={(payload) => dispatch({ type: "ADD_BLOCK", payload })}
      />
      <Toast message={state.toast} onClose={() => dispatch({ type: "CLEAR_TOAST" })} />
    </main>
  );
}
