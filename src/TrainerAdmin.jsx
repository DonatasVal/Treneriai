import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "vardenis_admin_demo_v2";

const timeSlots = [
  "06:30",
  "08:00",
  "09:30",
  "11:00",
  "12:30",
  "16:30",
  "18:00",
  "19:30",
];

const statuses = ["Naujas", "Priimtas", "Aktyvus", "Atmestas", "Užklausa", "Atšaukta"];

const statusStyles = {
  Naujas: "bg-blue-100 text-blue-700",
  Priimtas: "bg-lime-100 text-green-800",
  Aktyvus: "bg-emerald-100 text-emerald-800",
  Atmestas: "bg-rose-100 text-rose-700",
  Užklausa: "bg-amber-100 text-amber-800",
  Atšaukta: "bg-stone-100 text-stone-600",
};

const services = [
  "Individuali treniruotė",
  "Treniruočių abonementas",
  "Treniruočių planas",
  "Nuotolinė priežiūra",
  "Mitybos konsultacija",
];

const initialClients = [
  {
    id: "c1",
    name: "Mantas Kazlauskas",
    phone: "+370 600 11223",
    email: "mantas@email.lt",
    status: "Aktyvus",
    packageName: "Individualios treniruotės",
    goal: "Jėga, laikysena, geresnė pratimų technika",
    frequency: "3 kartus per savaitę",
    health: "Nugaros įtampa po ilgo sėdėjimo. Pradžioje vengti staigaus krūvio.",
    notes: "Stebėti pritūpimo ir traukos techniką. Pirmas 2 savaites vidutinis intensyvumas.",
    plan: "Pirmadienis – viršutinė kūno dalis. Trečiadienis – kojos ir core. Penktadienis – viso kūno treniruotė.",
  },
  {
    id: "c2",
    name: "Aistė Petrauskaitė",
    phone: "+370 611 22334",
    email: "aiste@email.lt",
    status: "Priimtas",
    packageName: "Treniruočių abonementas",
    goal: "Svorio mažinimas ir aiškus planas namuose",
    frequency: "2 kartus per savaitę",
    health: "Traumų nenurodyta.",
    notes: "Svarbu palaikymas ir aiškus savaitės ritmas.",
    plan: "Antradienis – jėga. Ketvirtadienis – kondicija ir mobilumas.",
  },
  {
    id: "c3",
    name: "Rokas Valaitis",
    phone: "+370 622 77889",
    email: "rokas@email.lt",
    status: "Naujas",
    packageName: "Nuotolinė priežiūra",
    goal: "Raumenų masė, sporto salė 4 kartus per savaitę",
    frequency: "4+ kartus per savaitę",
    health: "Kelio diskomfortas po bėgimo.",
    notes: "Reikia patikslinti sporto salės įrangą ir patirtį.",
    plan: "Laukiama pirmo pokalbio.",
  },
  {
    id: "c4",
    name: "Greta Jankauskė",
    phone: "+370 633 90123",
    email: "greta@email.lt",
    status: "Užklausa",
    packageName: "Treniruočių planas",
    goal: "Grįžimas į sportą po pertraukos",
    frequency: "3 kartus per savaitę",
    health: "Pečių įtampa, reikia daugiau mobilumo.",
    notes: "Paruošti planą namams ir sporto salei.",
    plan: "Ruošiamas 4 savaičių planas.",
  },
  {
    id: "c5",
    name: "Tomas Žilinskas",
    phone: "+370 644 55112",
    email: "tomas@email.lt",
    status: "Atmestas",
    packageName: "Mitybos konsultacija",
    goal: "Susidėlioti paprastą mitybos ritmą",
    frequency: "Dar nežinau",
    health: "Nenurodyta.",
    notes: "Klientui netiko laikas. Galima susisiekti vėliau.",
    plan: "Užklausa atmesta / nukelta.",
  },
  {
    id: "c6",
    name: "Lukas Matonis",
    phone: "+370 655 10987",
    email: "lukas@email.lt",
    status: "Priimtas",
    packageName: "Individuali treniruotė",
    goal: "Pradėti sportuoti saugiai, išmokti bazinių judesių",
    frequency: "1–2 kartus per savaitę",
    health: "Nėra rimtų apribojimų.",
    notes: "Pirmoje treniruotėje atlikti judesių įvertinimą.",
    plan: "Startinė treniruotė + rekomendacijos.",
  },
  {
    id: "c7",
    name: "Eglė Butkutė",
    phone: "+370 666 30021",
    email: "egle@email.lt",
    status: "Aktyvus",
    packageName: "Treniruočių abonementas",
    goal: "Laikysena, stipresnis core, daugiau energijos",
    frequency: "2 kartus per savaitę",
    health: "Darbas sėdimas, dažna pečių įtampa.",
    notes: "Įtraukti mobilumą kiekvienos treniruotės pradžioje.",
    plan: "Pirmadienis – jėga. Ketvirtadienis – mobilumas + full body.",
  },
  {
    id: "c8",
    name: "Darius Rimkus",
    phone: "+370 677 88776",
    email: "darius@email.lt",
    status: "Naujas",
    packageName: "Treniruočių planas",
    goal: "Sportuoti savarankiškai pagal aiškų 4 savaičių planą",
    frequency: "3 kartus per savaitę",
    health: "Senesnė čiurnos trauma.",
    notes: "Reikia paklausti, kokią įrangą turi sporto salėje.",
    plan: "Laukiama papildomos informacijos.",
  },
];

const initialRegistrations = [
  {
    id: "r1",
    clientId: "c1",
    date: "2026-06-08",
    time: "08:00",
    service: "Individuali treniruotė",
    status: "Aktyvus",
    goal: "Viršutinė kūno dalis ir core",
  },
  {
    id: "r2",
    clientId: "c2",
    date: "2026-06-08",
    time: "09:30",
    service: "Treniruočių abonementas",
    status: "Priimtas",
    goal: "Pradinis pokalbis ir grafiko suderinimas",
  },
  {
    id: "r3",
    clientId: "c6",
    date: "2026-06-08",
    time: "11:00",
    service: "Individuali treniruotė",
    status: "Priimtas",
    goal: "Pirma treniruotė, judesių įvertinimas",
  },
  {
    id: "r4",
    clientId: "c3",
    date: "2026-06-08",
    time: "16:30",
    service: "Nuotolinė priežiūra",
    status: "Naujas",
    goal: "Aptarti tikslą ir sporto salės įrangą",
  },
  {
    id: "r5",
    clientId: "c7",
    date: "2026-06-08",
    time: "18:00",
    service: "Treniruočių abonementas",
    status: "Aktyvus",
    goal: "Laikysena, core, mobilumas",
  },
  {
    id: "r6",
    clientId: "c4",
    date: "2026-06-08",
    time: "19:30",
    service: "Treniruočių planas",
    status: "Užklausa",
    goal: "Aptarti plano struktūrą",
  },
  {
    id: "r7",
    clientId: "c8",
    date: "2026-06-09",
    time: "08:00",
    service: "Treniruočių planas",
    status: "Naujas",
    goal: "Surinkti informaciją planui",
  },
  {
    id: "r8",
    clientId: "c1",
    date: "2026-06-09",
    time: "18:00",
    service: "Individuali treniruotė",
    status: "Aktyvus",
    goal: "Kojos ir technika",
  },
];

const initialBlocked = [
  {
    id: "b1",
    date: "2026-06-08",
    time: "06:30",
    reason: "Treneris užimtas / pasiruošimas",
  },
  {
    id: "b2",
    date: "2026-06-08",
    time: "12:30",
    reason: "Pertrauka / administracinis laikas",
  },
];

function getStatusClass(status) {
  return statusStyles[status] || "bg-stone-100 text-stone-700";
}

function loadInitialState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) throw new Error("No saved state");
    return JSON.parse(saved);
  } catch {
    return {
      clients: initialClients,
      registrations: initialRegistrations,
      blocked: initialBlocked,
    };
  }
}

function makeShareText(client) {
  return `Sveiki, ${client.name},

Jūsų informacija:
Statusas: ${client.status}
Paslauga: ${client.packageName}
Tikslas: ${client.goal}
Dažnumas: ${client.frequency}

Trenerio pastabos:
${client.notes}

Planas / grafikas:
${client.plan}

Pagarbiai,
Vardenis Pavardenis`;
}

export default function TrainerAdmin() {
  const [state, setState] = useState(loadInitialState);
  const [selectedDate, setSelectedDate] = useState("2026-06-08");
  const [statusFilter, setStatusFilter] = useState("Visos būsenos");
  const [search, setSearch] = useState("");
  const [selectedClientId, setSelectedClientId] = useState(state.clients[0]?.id || "");
  const [selectedRegistrationId, setSelectedRegistrationId] = useState(state.registrations[0]?.id || "");
  const [toast, setToast] = useState("");

  const selectedClient = state.clients.find((client) => client.id === selectedClientId);
  const selectedRegistration = state.registrations.find((item) => item.id === selectedRegistrationId);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const registrationsForDate = useMemo(() => {
    const query = search.trim().toLowerCase();

    return state.registrations
      .filter((item) => item.date === selectedDate)
      .filter((item) => statusFilter === "Visos būsenos" || item.status === statusFilter)
      .filter((item) => {
        const client = state.clients.find((c) => c.id === item.clientId);
        const combined = `${client?.name || ""} ${client?.phone || ""} ${item.service} ${item.goal}`.toLowerCase();
        return !query || combined.includes(query);
      })
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [state.registrations, state.clients, selectedDate, statusFilter, search]);

  const activeClients = useMemo(
    () => state.clients.filter((client) => client.status === "Aktyvus" || client.status === "Priimtas"),
    [state.clients]
  );

  const requestClients = useMemo(
    () => state.clients.filter((client) => client.status === "Naujas" || client.status === "Užklausa" || client.status === "Atmestas"),
    [state.clients]
  );

  const stats = [
    ["Registracijos", registrationsForDate.length],
    ["Naujos", state.registrations.filter((item) => item.status === "Naujas").length],
    ["Priimti / aktyvūs", activeClients.length],
    ["Atmestos / užklausos", requestClients.length],
  ];

  function showToast(message) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  }

  function getClient(clientId) {
    return state.clients.find((client) => client.id === clientId);
  }

  function updateClient(clientId, patch) {
    setState((current) => ({
      ...current,
      clients: current.clients.map((client) =>
        client.id === clientId ? { ...client, ...patch } : client
      ),
    }));
  }

  function updateRegistration(registrationId, patch) {
    setState((current) => ({
      ...current,
      registrations: current.registrations.map((item) =>
        item.id === registrationId ? { ...item, ...patch } : item
      ),
    }));
  }

  function syncClientAndRegistrationStatus(clientId, registrationId, status) {
    updateClient(clientId, { status });
    updateRegistration(registrationId, { status });
  }

  function openClient(clientId, registrationId = "") {
    setSelectedClientId(clientId);
    if (registrationId) setSelectedRegistrationId(registrationId);

    setTimeout(() => {
      document.getElementById("client-panel")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 30);
  }

  function getSlot(time) {
    return {
      registration: state.registrations.find((item) => item.date === selectedDate && item.time === time && item.status !== "Atšaukta"),
      block: state.blocked.find((item) => item.date === selectedDate && item.time === time),
    };
  }

  function blockTime(time) {
    const exists = state.blocked.some((item) => item.date === selectedDate && item.time === time);
    if (exists) return;

    setState((current) => ({
      ...current,
      blocked: [
        ...current.blocked,
        {
          id: `b${Date.now()}`,
          date: selectedDate,
          time,
          reason: "Treneris užimtas / pertrauka",
        },
      ],
    }));

    showToast(`Laikas ${time} užblokuotas.`);
  }

  function unblockTime(blockId) {
    setState((current) => ({
      ...current,
      blocked: current.blocked.filter((item) => item.id !== blockId),
    }));

    showToast("Laikas atlaisvintas.");
  }

  function acceptRegistration(registration) {
    syncClientAndRegistrationStatus(registration.clientId, registration.id, "Priimtas");
    showToast("Klientas pažymėtas kaip priimtas.");
  }

  function rejectRegistration(registration) {
    syncClientAndRegistrationStatus(registration.clientId, registration.id, "Atmestas");
    showToast("Užklausa pažymėta kaip atmesta.");
  }

  async function copyClientPlan() {
    if (!selectedClient) return;

    try {
      await navigator.clipboard.writeText(makeShareText(selectedClient));
      showToast("Kliento informacija nukopijuota.");
    } catch {
      showToast("Nepavyko nukopijuoti automatiškai.");
    }
  }

  function resetDemoData() {
    setState({
      clients: initialClients,
      registrations: initialRegistrations,
      blocked: initialBlocked,
    });
    setSelectedClientId(initialClients[0].id);
    setSelectedRegistrationId(initialRegistrations[0].id);
    showToast("Demo duomenys atstatyti.");
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_10%_0%,rgba(199,244,90,.18),transparent_34%),linear-gradient(180deg,#FBFAF6,#F4F1EA)] px-5 py-8 text-ink">
      <div className="mx-auto w-[min(1500px,100%)]">
        <header className="mb-6 flex flex-col gap-4 rounded-[2rem] border border-ink/10 bg-white/90 p-6 shadow-soft lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[.18em] text-ink/42">Admin panelė</p>
            <h1 className="mt-2 font-display text-[clamp(2.2rem,5vw,5rem)] font-extrabold leading-none tracking-[-.075em]">
              Trenerio valdymas
            </h1>
            <p className="mt-3 max-w-3xl text-ink/58">
              Daugiau demo klientų, aktyvūs vardai, registracijų priėmimas / atmetimas ir kliento plano valdymas.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={resetDemoData}
              className="rounded-full bg-white px-5 py-3 text-sm font-black text-ink shadow-soft transition hover:-translate-y-0.5"
            >
              Atstatyti demo
            </button>
            <a
              href="/"
              className="rounded-full bg-forest px-5 py-3 text-sm font-black text-white shadow-soft transition hover:-translate-y-0.5"
            >
              Grįžti į svetainę
            </a>
          </div>
        </header>

        <section className="mb-6 grid gap-4 md:grid-cols-4">
          {stats.map(([label, value]) => (
            <article key={label} className="rounded-[1.6rem] border border-ink/10 bg-white/90 p-5 shadow-soft">
              <div className="font-display text-5xl font-extrabold tracking-[-.07em]">{value}</div>
              <div className="mt-2 text-sm font-bold text-ink/55">{label}</div>
            </article>
          ))}
        </section>

        <section className="mb-6 grid gap-3 rounded-[1.8rem] border border-ink/10 bg-white/90 p-4 shadow-soft lg:grid-cols-[190px_230px_1fr]">
          <input
            type="date"
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
            className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm font-bold outline-none focus:ring-4 focus:ring-lime/20"
          />

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm font-bold outline-none focus:ring-4 focus:ring-lime/20"
          >
            <option>Visos būsenos</option>
            {statuses.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Ieškoti pagal klientą, telefoną, paslaugą arba tikslą..."
            className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm font-bold outline-none focus:ring-4 focus:ring-lime/20"
          />
        </section>

        <section className="grid gap-6 2xl:grid-cols-[1.12fr_.88fr]">
          <div className="overflow-hidden rounded-[2rem] border border-ink/10 bg-white/92 shadow-soft">
            <div className="border-b border-ink/10 bg-paper px-5 py-4">
              <h2 className="font-display text-2xl font-extrabold tracking-[-.06em]">Dienos grafikas</h2>
              <p className="text-sm text-ink/55">{selectedDate}</p>
            </div>

            <div className="grid min-w-[680px] grid-cols-[95px_1fr] overflow-x-auto">
              <div className="border-b border-r border-ink/10 bg-bone p-3 text-xs font-black uppercase tracking-[.14em] text-ink/55">
                Laikas
              </div>
              <div className="border-b border-ink/10 bg-bone p-3 text-xs font-black uppercase tracking-[.14em] text-ink/55">
                Užimtumas
              </div>

              {timeSlots.map((time) => {
                const { registration, block } = getSlot(time);
                const client = registration ? getClient(registration.clientId) : null;

                return (
                  <div key={time} className="contents">
                    <div className="min-h-32 border-b border-r border-ink/10 bg-paper p-3 text-sm font-black text-ink/50">
                      {time}
                    </div>

                    <div className="min-h-32 border-b border-ink/10 bg-white p-3">
                      {registration && client ? (
                        <div className="rounded-2xl border border-lime/50 bg-lime/20 p-4">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <button
                                type="button"
                                onClick={() => openClient(client.id, registration.id)}
                                className="cursor-pointer text-left text-lg font-black text-ink underline decoration-lime decoration-4 underline-offset-4 transition hover:text-forest"
                              >
                                {client.name}
                              </button>
                              <div className="mt-1 text-sm font-bold text-ink/55">
                                {registration.service} · {client.phone}
                              </div>
                            </div>

                            <span className={`rounded-full px-3 py-1 text-xs font-black ${getStatusClass(registration.status)}`}>
                              {registration.status}
                            </span>
                          </div>

                          <p className="mt-3 text-sm leading-6 text-ink/62">{registration.goal}</p>

                          <div className="mt-4 flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => acceptRegistration(registration)}
                              className="rounded-full bg-forest px-4 py-2 text-xs font-black text-white"
                            >
                              Priimti
                            </button>
                            <button
                              type="button"
                              onClick={() => rejectRegistration(registration)}
                              className="rounded-full bg-rose-100 px-4 py-2 text-xs font-black text-rose-700"
                            >
                              Atmesti
                            </button>
                            <button
                              type="button"
                              onClick={() => openClient(client.id, registration.id)}
                              className="rounded-full bg-white px-4 py-2 text-xs font-black text-ink"
                            >
                              Valdyti klientą
                            </button>
                          </div>
                        </div>
                      ) : block ? (
                        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-stone-200 bg-stone-100 p-4">
                          <div>
                            <strong>Užblokuota</strong>
                            <div className="mt-1 text-sm text-ink/55">{block.reason}</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => unblockTime(block.id)}
                            className="rounded-full bg-white px-4 py-2 text-xs font-black text-ink"
                          >
                            Atlaisvinti
                          </button>
                        </div>
                      ) : (
                        <div className="flex h-full items-center justify-between gap-3">
                          <span className="text-sm font-bold text-ink/35">Laisva</span>
                          <button
                            type="button"
                            onClick={() => blockTime(time)}
                            className="rounded-full bg-ink/5 px-4 py-2 text-xs font-black text-ink transition hover:bg-ink hover:text-white"
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
          </div>

          <aside className="grid gap-6">
            <section className="rounded-[2rem] border border-ink/10 bg-white/92 p-5 shadow-soft">
              <h2 className="font-display text-2xl font-extrabold tracking-[-.06em]">Registracijos ir užklausos</h2>
              <p className="mt-1 text-sm text-ink/55">Klientų vardai aktyvūs. Paspaudus atidaromas valdymas.</p>

              <div className="mt-5 grid gap-3">
                {registrationsForDate.length ? (
                  registrationsForDate.map((registration) => {
                    const client = getClient(registration.clientId);
                    if (!client) return null;

                    return (
                      <article key={registration.id} className="rounded-[1.5rem] border border-ink/10 bg-white p-4">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div>
                            <button
                              type="button"
                              onClick={() => openClient(client.id, registration.id)}
                              className="cursor-pointer text-left text-lg font-black underline decoration-lime decoration-4 underline-offset-4 transition hover:text-forest"
                            >
                              {client.name}
                            </button>
                            <div className="mt-1 text-sm text-ink/55">
                              {registration.date} · {registration.time} · {client.phone}
                            </div>
                          </div>

                          <span className={`rounded-full px-3 py-1 text-xs font-black ${getStatusClass(registration.status)}`}>
                            {registration.status}
                          </span>
                        </div>

                        <div className="mt-4 font-bold">{registration.service}</div>
                        <p className="mt-2 text-sm leading-6 text-ink/55">{registration.goal}</p>

                        <div className="mt-4 grid gap-2 sm:grid-cols-3">
                          <select
                            value={registration.status}
                            onChange={(event) =>
                              syncClientAndRegistrationStatus(client.id, registration.id, event.target.value)
                            }
                            className="rounded-xl border border-ink/10 px-3 py-2 text-sm font-bold"
                          >
                            {statuses.map((status) => (
                              <option key={status}>{status}</option>
                            ))}
                          </select>

                          <input
                            type="date"
                            value={registration.date}
                            onChange={(event) => updateRegistration(registration.id, { date: event.target.value })}
                            className="rounded-xl border border-ink/10 px-3 py-2 text-sm font-bold"
                          />

                          <select
                            value={registration.time}
                            onChange={(event) => updateRegistration(registration.id, { time: event.target.value })}
                            className="rounded-xl border border-ink/10 px-3 py-2 text-sm font-bold"
                          >
                            {timeSlots.map((slot) => (
                              <option key={slot}>{slot}</option>
                            ))}
                          </select>
                        </div>
                      </article>
                    );
                  })
                ) : (
                  <div className="rounded-2xl border border-ink/10 bg-white p-8 text-center text-sm font-bold text-ink/45">
                    Pagal pasirinktus filtrus registracijų nėra.
                  </div>
                )}
              </div>
            </section>

            <section className="rounded-[2rem] border border-ink/10 bg-white/92 p-5 shadow-soft">
              <h2 className="font-display text-2xl font-extrabold tracking-[-.06em]">Klientai</h2>
              <p className="mt-1 text-sm text-ink/55">Aktyvūs, priimti, nauji ir atmesti klientai.</p>

              <div className="mt-5 grid gap-2">
                {state.clients.map((client) => (
                  <button
                    key={client.id}
                    type="button"
                    onClick={() => openClient(client.id)}
                    className={`rounded-[1.25rem] border p-4 text-left transition ${
                      selectedClientId === client.id
                        ? "border-lime bg-lime/20"
                        : "border-ink/10 bg-white hover:border-lime"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <strong className="text-base">{client.name}</strong>
                        <div className="mt-1 text-xs font-bold text-ink/50">{client.packageName}</div>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-black ${getStatusClass(client.status)}`}>
                        {client.status}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          </aside>
        </section>

        <section id="client-panel" className="mt-6 rounded-[2rem] border border-ink/10 bg-white/92 p-5 shadow-soft">
          <div className="flex flex-col gap-4 border-b border-ink/10 pb-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[.18em] text-ink/42">Kliento valdymas</p>
              <h2 className="mt-2 font-display text-3xl font-extrabold tracking-[-.06em]">
                {selectedClient?.name || "Klientas nepasirinktas"}
              </h2>
              <p className="mt-1 text-sm text-ink/55">
                Čia valdai klientą: priimi, atmeti, koreguoji statusą, tikslą, pastabas ir planą.
              </p>
            </div>

            {selectedClient && (
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => updateClient(selectedClient.id, { status: "Priimtas" })}
                  className="rounded-full bg-forest px-4 py-2 text-xs font-black text-white"
                >
                  Pažymėti priimtu
                </button>
                <button
                  type="button"
                  onClick={() => updateClient(selectedClient.id, { status: "Atmestas" })}
                  className="rounded-full bg-rose-100 px-4 py-2 text-xs font-black text-rose-700"
                >
                  Atmesti klientą
                </button>
                <button
                  type="button"
                  onClick={copyClientPlan}
                  className="rounded-full bg-white px-4 py-2 text-xs font-black text-ink shadow-soft"
                >
                  Kopijuoti planą
                </button>
              </div>
            )}
          </div>

          {selectedClient ? (
            <div className="mt-5 grid gap-4 lg:grid-cols-[.9fr_1.1fr]">
              <div className="grid gap-3">
                <label className="grid gap-1 text-sm font-black text-ink/62">
                  Vardas ir pavardė
                  <input
                    value={selectedClient.name}
                    onChange={(event) => updateClient(selectedClient.id, { name: event.target.value })}
                    className="rounded-2xl border border-ink/10 bg-white px-4 py-3 font-bold text-ink outline-none focus:ring-4 focus:ring-lime/20"
                  />
                </label>

                <label className="grid gap-1 text-sm font-black text-ink/62">
                  Telefonas
                  <input
                    value={selectedClient.phone}
                    onChange={(event) => updateClient(selectedClient.id, { phone: event.target.value })}
                    className="rounded-2xl border border-ink/10 bg-white px-4 py-3 font-bold text-ink outline-none focus:ring-4 focus:ring-lime/20"
                  />
                </label>

                <label className="grid gap-1 text-sm font-black text-ink/62">
                  El. paštas
                  <input
                    value={selectedClient.email}
                    onChange={(event) => updateClient(selectedClient.id, { email: event.target.value })}
                    className="rounded-2xl border border-ink/10 bg-white px-4 py-3 font-bold text-ink outline-none focus:ring-4 focus:ring-lime/20"
                  />
                </label>

                <label className="grid gap-1 text-sm font-black text-ink/62">
                  Statusas
                  <select
                    value={selectedClient.status}
                    onChange={(event) => updateClient(selectedClient.id, { status: event.target.value })}
                    className="rounded-2xl border border-ink/10 bg-white px-4 py-3 font-bold text-ink outline-none focus:ring-4 focus:ring-lime/20"
                  >
                    {statuses.map((status) => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>
                </label>

                <label className="grid gap-1 text-sm font-black text-ink/62">
                  Paslauga / paketas
                  <select
                    value={selectedClient.packageName}
                    onChange={(event) => updateClient(selectedClient.id, { packageName: event.target.value })}
                    className="rounded-2xl border border-ink/10 bg-white px-4 py-3 font-bold text-ink outline-none focus:ring-4 focus:ring-lime/20"
                  >
                    {services.map((service) => (
                      <option key={service}>{service}</option>
                    ))}
                  </select>
                </label>

                <label className="grid gap-1 text-sm font-black text-ink/62">
                  Dažnumas
                  <input
                    value={selectedClient.frequency}
                    onChange={(event) => updateClient(selectedClient.id, { frequency: event.target.value })}
                    className="rounded-2xl border border-ink/10 bg-white px-4 py-3 font-bold text-ink outline-none focus:ring-4 focus:ring-lime/20"
                  />
                </label>
              </div>

              <div className="grid gap-3">
                <label className="grid gap-1 text-sm font-black text-ink/62">
                  Tikslas
                  <textarea
                    value={selectedClient.goal}
                    onChange={(event) => updateClient(selectedClient.id, { goal: event.target.value })}
                    className="min-h-24 rounded-2xl border border-ink/10 bg-white px-4 py-3 font-bold text-ink outline-none focus:ring-4 focus:ring-lime/20"
                  />
                </label>

                <label className="grid gap-1 text-sm font-black text-ink/62">
                  Saugumo informacija / traumos
                  <textarea
                    value={selectedClient.health}
                    onChange={(event) => updateClient(selectedClient.id, { health: event.target.value })}
                    className="min-h-24 rounded-2xl border border-ink/10 bg-white px-4 py-3 font-bold text-ink outline-none focus:ring-4 focus:ring-lime/20"
                  />
                </label>

                <label className="grid gap-1 text-sm font-black text-ink/62">
                  Trenerio pastabos
                  <textarea
                    value={selectedClient.notes}
                    onChange={(event) => updateClient(selectedClient.id, { notes: event.target.value })}
                    className="min-h-28 rounded-2xl border border-ink/10 bg-white px-4 py-3 font-bold text-ink outline-none focus:ring-4 focus:ring-lime/20"
                  />
                </label>

                <label className="grid gap-1 text-sm font-black text-ink/62">
                  Planas / grafikas klientui
                  <textarea
                    value={selectedClient.plan}
                    onChange={(event) => updateClient(selectedClient.id, { plan: event.target.value })}
                    className="min-h-32 rounded-2xl border border-ink/10 bg-white px-4 py-3 font-bold text-ink outline-none focus:ring-4 focus:ring-lime/20"
                  />
                </label>
              </div>
            </div>
          ) : (
            <div className="mt-5 rounded-2xl border border-ink/10 bg-white p-5 text-sm font-bold text-ink/55">
              Pasirinkite klientą.
            </div>
          )}

          {selectedRegistration && (
            <div className="mt-6 rounded-[1.6rem] border border-ink/10 bg-bone/70 p-5">
              <h3 className="font-display text-2xl font-extrabold tracking-[-.06em]">Pasirinktos registracijos valdymas</h3>
              <p className="mt-1 text-sm text-ink/55">Galima keisti konkretaus vizito datą, laiką, būseną ir paslaugą.</p>

              <div className="mt-4 grid gap-3 md:grid-cols-4">
                <select
                  value={selectedRegistration.status}
                  onChange={(event) =>
                    syncClientAndRegistrationStatus(selectedRegistration.clientId, selectedRegistration.id, event.target.value)
                  }
                  className="rounded-2xl border border-ink/10 bg-white px-4 py-3 font-bold outline-none focus:ring-4 focus:ring-lime/20"
                >
                  {statuses.map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </select>

                <input
                  type="date"
                  value={selectedRegistration.date}
                  onChange={(event) => updateRegistration(selectedRegistration.id, { date: event.target.value })}
                  className="rounded-2xl border border-ink/10 bg-white px-4 py-3 font-bold outline-none focus:ring-4 focus:ring-lime/20"
                />

                <select
                  value={selectedRegistration.time}
                  onChange={(event) => updateRegistration(selectedRegistration.id, { time: event.target.value })}
                  className="rounded-2xl border border-ink/10 bg-white px-4 py-3 font-bold outline-none focus:ring-4 focus:ring-lime/20"
                >
                  {timeSlots.map((slot) => (
                    <option key={slot}>{slot}</option>
                  ))}
                </select>

                <select
                  value={selectedRegistration.service}
                  onChange={(event) => updateRegistration(selectedRegistration.id, { service: event.target.value })}
                  className="rounded-2xl border border-ink/10 bg-white px-4 py-3 font-bold outline-none focus:ring-4 focus:ring-lime/20"
                >
                  {services.map((service) => (
                    <option key={service}>{service}</option>
                  ))}
                </select>
              </div>

              <textarea
                value={selectedRegistration.goal}
                onChange={(event) => updateRegistration(selectedRegistration.id, { goal: event.target.value })}
                className="mt-3 min-h-24 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 font-bold outline-none focus:ring-4 focus:ring-lime/20"
              />
            </div>
          )}
        </section>
      </div>

      {toast && (
        <div className="fixed bottom-5 right-5 z-50 rounded-2xl bg-forest px-5 py-4 text-sm font-black text-white shadow-lift">
          {toast}
        </div>
      )}
    </main>
  );
}
