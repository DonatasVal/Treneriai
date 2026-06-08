import { useMemo, useState } from "react";

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

const statuses = [
  "Visos būsenos",
  "Nauja",
  "Laukia patvirtinimo",
  "Patvirtinta",
  "Aktyvus klientas",
  "Užklausa",
  "Atšaukta",
];

const statusStyles = {
  Nauja: "bg-blue-100 text-blue-700",
  "Laukia patvirtinimo": "bg-amber-100 text-amber-700",
  Patvirtinta: "bg-lime-100 text-green-800",
  "Aktyvus klientas": "bg-emerald-100 text-emerald-800",
  Užklausa: "bg-stone-100 text-stone-700",
  Atšaukta: "bg-rose-100 text-rose-700",
};

const initialClients = [
  {
    id: "c1",
    name: "Mantas Kazlauskas",
    phone: "+370 600 11223",
    email: "mantas@email.lt",
    packageName: "Individualios treniruotės",
    status: "Aktyvus klientas",
    goal: "Jėga, laikysena, geresnė technika",
    frequency: "3 kartus per savaitę",
    health: "Nugaros įtampa po ilgo sėdėjimo. Vengti staigių apkrovų pradžioje.",
    notes:
      "Pradėti nuo bazinės technikos. Pirmas 2 savaites stebėti pritūpimo ir traukos judesį.",
    plan:
      "Pirmadienis – viršutinė kūno dalis. Trečiadienis – kojos ir core. Penktadienis – viso kūno treniruotė.",
  },
  {
    id: "c2",
    name: "Aistė Petrauskaitė",
    phone: "+370 611 44556",
    email: "aiste@email.lt",
    packageName: "Treniruočių abonementas",
    status: "Aktyvus klientas",
    goal: "Svorio mažinimas ir energija",
    frequency: "2 kartus per savaitę",
    health: "Traumų nenurodyta.",
    notes: "Labai svarbus aiškus grafikas ir palaikymas tarp treniruočių.",
    plan: "Antradienis – jėga. Ketvirtadienis – kondicija ir mobilumas.",
  },
  {
    id: "c3",
    name: "Rokas Valaitis",
    phone: "+370 622 77889",
    email: "rokas@email.lt",
    packageName: "Nuotolinė priežiūra",
    status: "Užklausa",
    goal: "Raumenų masė, sporto salė 4 kartus per savaitę",
    frequency: "4+ kartus per savaitę",
    health: "Kelio diskomfortas po bėgimo.",
    notes: "Reikia patikslinti salės įrangą ir treniruočių patirtį.",
    plan: "Laukiama pirmo pokalbio.",
  },
  {
    id: "c4",
    name: "Greta Jankauskė",
    phone: "+370 633 90123",
    email: "greta@email.lt",
    packageName: "Treniruočių planas",
    status: "Laukia patvirtinimo",
    goal: "Grįžimas į sportą po pertraukos",
    frequency: "3 kartus per savaitę",
    health: "Pečių įtampa, reikia daugiau mobilumo.",
    notes: "Pirmiausia paruošti 4 savaičių planą namams ir salei.",
    plan: "Ruošiamas planas.",
  },
  {
    id: "c5",
    name: "Tomas Žilinskas",
    phone: "+370 644 55112",
    email: "tomas@email.lt",
    packageName: "Mitybos konsultacija",
    status: "Užklausa",
    goal: "Susidėlioti paprastą mitybos ritmą",
    frequency: "Dar nežinau",
    health: "Nenurodyta.",
    notes: "Susisiekti telefonu po 18:00.",
    plan: "Laukiama konsultacijos laiko suderinimo.",
  },
];

const initialSessions = [
  {
    id: 1,
    clientId: "c1",
    client: "Mantas Kazlauskas",
    phone: "+370 600 11223",
    date: "2026-06-08",
    time: "07:00",
    service: "Individuali treniruotė",
    status: "Nauja",
    goal: "Technika, jėga, laikysena",
  },
  {
    id: 2,
    clientId: "c2",
    client: "Aistė Petrauskaitė",
    phone: "+370 611 44556",
    date: "2026-06-08",
    time: "16:30",
    service: "Treniruočių abonementas",
    status: "Laukia patvirtinimo",
    goal: "Svorio mažinimas ir reguliarus sportas",
  },
  {
    id: 3,
    clientId: "c3",
    client: "Rokas Valaitis",
    phone: "+370 622 77889",
    date: "2026-06-09",
    time: "18:00",
    service: "Nuotolinė priežiūra",
    status: "Užklausa",
    goal: "Raumenų masė, 4 treniruotės per savaitę",
  },
  {
    id: 4,
    clientId: "c4",
    client: "Greta Jankauskė",
    phone: "+370 633 90123",
    date: "2026-06-10",
    time: "08:00",
    service: "Treniruočių planas",
    status: "Laukia patvirtinimo",
    goal: "Grįžimas į sportą po pertraukos",
  },
  {
    id: 5,
    clientId: "c5",
    client: "Tomas Žilinskas",
    phone: "+370 644 55112",
    date: "2026-06-10",
    time: "19:30",
    service: "Mitybos konsultacija",
    status: "Užklausa",
    goal: "Paprasta mitybos struktūra be kraštutinumų",
  },
  {
    id: 6,
    clientId: "c1",
    client: "Mantas Kazlauskas",
    phone: "+370 600 11223",
    date: "2026-06-12",
    time: "07:00",
    service: "Individuali treniruotė",
    status: "Patvirtinta",
    goal: "Viršutinė kūno dalis ir core",
  },
];

const initialBlocked = [
  {
    id: 101,
    date: "2026-06-08",
    time: "12:30",
    reason: "Treneris užimtas / pertrauka",
  },
];

function todayFallback() {
  return "2026-06-08";
}

function getStatusClass(status) {
  return statusStyles[status] || "bg-stone-100 text-stone-700";
}

function buildClientShareText(client) {
  if (!client) return "";

  return `Sveiki, ${client.name},

Jūsų treniruočių informacija:

Paslauga: ${client.packageName}
Statusas: ${client.status}
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
  const [selectedDate, setSelectedDate] = useState(todayFallback());
  const [statusFilter, setStatusFilter] = useState("Visos būsenos");
  const [search, setSearch] = useState("");
  const [sessions, setSessions] = useState(initialSessions);
  const [clients, setClients] = useState(initialClients);
  const [blocked, setBlocked] = useState(initialBlocked);
  const [selectedClientId, setSelectedClientId] = useState(initialClients[0]?.id || "");
  const [toast, setToast] = useState("");

  const selectedClient = clients.find((client) => client.id === selectedClientId);

  const filteredSessions = useMemo(() => {
    const q = search.trim().toLowerCase();

    return sessions
      .filter((session) => session.date === selectedDate)
      .filter((session) => statusFilter === "Visos būsenos" || session.status === statusFilter)
      .filter((session) => {
        if (!q) return true;

        return (
          session.client.toLowerCase().includes(q) ||
          session.phone.includes(q) ||
          session.service.toLowerCase().includes(q) ||
          session.goal.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [sessions, selectedDate, statusFilter, search]);

  const activeClients = useMemo(() => {
    return clients.filter((client) => client.status === "Aktyvus klientas");
  }, [clients]);

  const inquiryClients = useMemo(() => {
    return clients.filter((client) => client.status !== "Aktyvus klientas");
  }, [clients]);

  const stats = [
    {
      value: filteredSessions.length,
      label: "Treniruotės pagal filtrą",
    },
    {
      value: sessions.filter((session) => session.status === "Nauja").length,
      label: "Naujos registracijos",
    },
    {
      value: activeClients.length,
      label: "Aktyvūs klientai",
    },
    {
      value: inquiryClients.length,
      label: "Užklausos",
    },
  ];

  function showToast(message) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  }

  function getSlot(time) {
    return {
      session: sessions.find(
        (session) =>
          session.date === selectedDate &&
          session.time === time &&
          session.status !== "Atšaukta"
      ),
      block: blocked.find((item) => item.date === selectedDate && item.time === time),
    };
  }

  function updateSession(id, field, value) {
    setSessions((current) =>
      current.map((session) =>
        session.id === id ? { ...session, [field]: value } : session
      )
    );
  }

  function updateClient(field, value) {
    if (!selectedClient) return;

    setClients((current) =>
      current.map((client) =>
        client.id === selectedClient.id ? { ...client, [field]: value } : client
      )
    );

    if (field === "name" || field === "phone") {
      setSessions((current) =>
        current.map((session) =>
          session.clientId === selectedClient.id
            ? {
                ...session,
                client: field === "name" ? value : session.client,
                phone: field === "phone" ? value : session.phone,
              }
            : session
        )
      );
    }
  }

  function openClient(clientId) {
    setSelectedClientId(clientId);
    document.getElementById("client-management")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  function blockTime(time) {
    const reason = "Treneris užimtas / pertrauka";

    setBlocked((current) => [
      ...current,
      {
        id: Date.now(),
        date: selectedDate,
        time,
        reason,
      },
    ]);

    showToast(`Laikas ${time} užblokuotas.`);
  }

  function unblockTime(id) {
    setBlocked((current) => current.filter((item) => item.id !== id));
    showToast("Laikas atlaisvintas.");
  }

  async function copyClientPlan() {
    if (!selectedClient) return;

    const text = buildClientShareText(selectedClient);

    try {
      await navigator.clipboard.writeText(text);
      showToast("Kliento planas nukopijuotas.");
    } catch {
      showToast("Nepavyko nukopijuoti automatiškai.");
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_10%_0%,rgba(199,244,90,.18),transparent_34%),linear-gradient(180deg,#FBFAF6,#F4F1EA)] px-5 py-8 text-ink">
      <div className="mx-auto w-[min(1380px,100%)]">
        <header className="mb-8 flex flex-col gap-4 rounded-[2rem] border border-ink/10 bg-white/88 p-6 shadow-soft md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[.18em] text-ink/42">
              Admin panelė
            </p>
            <h1 className="mt-2 font-display text-[clamp(2.2rem,4.8vw,4.8rem)] font-extrabold leading-none tracking-[-.075em]">
              Trenerio valdymas
            </h1>
            <p className="mt-3 max-w-2xl text-ink/58">
              Registracijos, užklausos, aktyvūs klientai, dienos grafikas ir kliento plano valdymas vienoje vietoje.
            </p>
          </div>

          <a
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-forest px-5 py-3 text-sm font-black text-white shadow-soft transition hover:-translate-y-0.5"
          >
            Grįžti į svetainę
          </a>
        </header>

        <section className="mb-6 grid gap-4 md:grid-cols-4">
          {stats.map((item) => (
            <div
              key={item.label}
              className="rounded-[1.6rem] border border-ink/10 bg-white/88 p-5 shadow-soft"
            >
              <div className="font-display text-5xl font-extrabold tracking-[-.07em]">
                {item.value}
              </div>
              <div className="mt-2 text-sm font-bold text-ink/55">{item.label}</div>
            </div>
          ))}
        </section>

        <section className="mb-6 grid gap-3 rounded-[1.8rem] border border-ink/10 bg-white/88 p-4 shadow-soft lg:grid-cols-[190px_230px_1fr]">
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

        <section className="grid gap-6 xl:grid-cols-[1.1fr_.9fr]">
          <div className="overflow-hidden rounded-[2rem] border border-ink/10 bg-white/92 shadow-soft">
            <div className="border-b border-ink/10 bg-paper px-5 py-4">
              <h2 className="font-display text-2xl font-extrabold tracking-[-.06em]">
                Dienos grafikas
              </h2>
              <p className="text-sm text-ink/55">{selectedDate}</p>
            </div>

            <div className="grid min-w-[620px] grid-cols-[95px_1fr] overflow-x-auto">
              <div className="border-b border-r border-ink/10 bg-bone p-3 text-xs font-black uppercase tracking-[.14em] text-ink/55">
                Laikas
              </div>
              <div className="border-b border-ink/10 bg-bone p-3 text-xs font-black uppercase tracking-[.14em] text-ink/55">
                Užimtumas
              </div>

              {timeSlots.map((time) => {
                const { session, block } = getSlot(time);

                return (
                  <div key={time} className="contents">
                    <div className="min-h-28 border-b border-r border-ink/10 bg-paper p-3 text-sm font-black text-ink/50">
                      {time}
                    </div>

                    <div className="min-h-28 border-b border-ink/10 bg-white p-3">
                      {session ? (
                        <div className="rounded-2xl border border-lime/50 bg-lime/20 p-4">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <button
                                type="button"
                                onClick={() => openClient(session.clientId)}
                                className="text-left text-lg font-black text-ink underline decoration-lime decoration-4 underline-offset-4 transition hover:text-forest"
                              >
                                {session.client}
                              </button>
                              <div className="mt-1 text-sm font-bold text-ink/55">
                                {session.service}
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => openClient(session.clientId)}
                              className="rounded-full bg-forest px-4 py-2 text-xs font-black text-white"
                            >
                              Valdyti
                            </button>
                          </div>

                          <p className="mt-3 text-sm leading-6 text-ink/62">{session.goal}</p>

                          <span
                            className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-black ${getStatusClass(session.status)}`}
                          >
                            {session.status}
                          </span>
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
              <h2 className="font-display text-2xl font-extrabold tracking-[-.06em]">
                Aktyvūs klientai
              </h2>
              <p className="mt-1 text-sm text-ink/55">
                Paspauskite vardą, kad atidarytumėte kliento valdymą.
              </p>

              <div className="mt-5 grid gap-3">
                {activeClients.map((client) => (
                  <button
                    key={client.id}
                    type="button"
                    onClick={() => openClient(client.id)}
                    className={`rounded-[1.4rem] border p-4 text-left transition ${
                      selectedClientId === client.id
                        ? "border-lime bg-lime/20"
                        : "border-ink/10 bg-white hover:border-lime"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <strong className="text-lg">{client.name}</strong>
                        <div className="mt-1 text-sm text-ink/55">{client.packageName}</div>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-black ${getStatusClass(client.status)}`}>
                        {client.status}
                      </span>
                    </div>
                    <div className="mt-3 text-sm leading-6 text-ink/62">{client.goal}</div>
                  </button>
                ))}
              </div>
            </section>

            <section className="rounded-[2rem] border border-ink/10 bg-white/92 p-5 shadow-soft">
              <h2 className="font-display text-2xl font-extrabold tracking-[-.06em]">
                Užklausos
              </h2>
              <p className="mt-1 text-sm text-ink/55">
                Nauji klientai, kuriems dar reikia suderinti paslaugą arba grafiką.
              </p>

              <div className="mt-5 grid gap-3">
                {inquiryClients.map((client) => (
                  <button
                    key={client.id}
                    type="button"
                    onClick={() => openClient(client.id)}
                    className={`rounded-[1.4rem] border p-4 text-left transition ${
                      selectedClientId === client.id
                        ? "border-lime bg-lime/20"
                        : "border-ink/10 bg-white hover:border-lime"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <strong className="text-lg">{client.name}</strong>
                        <div className="mt-1 text-sm text-ink/55">{client.packageName}</div>
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

        <section
          id="client-management"
          className="mt-6 rounded-[2rem] border border-ink/10 bg-white/92 p-5 shadow-soft"
        >
          <div className="flex flex-col gap-4 border-b border-ink/10 pb-5 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[.18em] text-ink/42">
                Kliento valdymas
              </p>
              <h2 className="mt-2 font-display text-3xl font-extrabold tracking-[-.06em]">
                {selectedClient?.name || "Klientas nepasirinktas"}
              </h2>
              <p className="mt-1 text-sm text-ink/55">
                Kontaktai, statusas, tikslai, saugumo informacija ir trenerio planas.
              </p>
            </div>

            <button
              type="button"
              onClick={copyClientPlan}
              className="rounded-full bg-forest px-5 py-3 text-sm font-black text-white shadow-soft"
            >
              Kopijuoti planą klientui
            </button>
          </div>

          {selectedClient ? (
            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              <div className="grid gap-3">
                <label className="grid gap-1 text-sm font-black text-ink/62">
                  Vardas ir pavardė
                  <input
                    value={selectedClient.name}
                    onChange={(event) => updateClient("name", event.target.value)}
                    className="rounded-2xl border border-ink/10 bg-white px-4 py-3 font-bold text-ink outline-none focus:ring-4 focus:ring-lime/20"
                  />
                </label>

                <label className="grid gap-1 text-sm font-black text-ink/62">
                  Telefonas
                  <input
                    value={selectedClient.phone}
                    onChange={(event) => updateClient("phone", event.target.value)}
                    className="rounded-2xl border border-ink/10 bg-white px-4 py-3 font-bold text-ink outline-none focus:ring-4 focus:ring-lime/20"
                  />
                </label>

                <label className="grid gap-1 text-sm font-black text-ink/62">
                  El. paštas
                  <input
                    value={selectedClient.email}
                    onChange={(event) => updateClient("email", event.target.value)}
                    className="rounded-2xl border border-ink/10 bg-white px-4 py-3 font-bold text-ink outline-none focus:ring-4 focus:ring-lime/20"
                  />
                </label>

                <label className="grid gap-1 text-sm font-black text-ink/62">
                  Statusas
                  <select
                    value={selectedClient.status}
                    onChange={(event) => updateClient("status", event.target.value)}
                    className="rounded-2xl border border-ink/10 bg-white px-4 py-3 font-bold text-ink outline-none focus:ring-4 focus:ring-lime/20"
                  >
                    {statuses
                      .filter((status) => status !== "Visos būsenos")
                      .map((status) => (
                        <option key={status}>{status}</option>
                      ))}
                  </select>
                </label>

                <label className="grid gap-1 text-sm font-black text-ink/62">
                  Paslauga / paketas
                  <input
                    value={selectedClient.packageName}
                    onChange={(event) => updateClient("packageName", event.target.value)}
                    className="rounded-2xl border border-ink/10 bg-white px-4 py-3 font-bold text-ink outline-none focus:ring-4 focus:ring-lime/20"
                  />
                </label>

                <label className="grid gap-1 text-sm font-black text-ink/62">
                  Dažnumas
                  <input
                    value={selectedClient.frequency}
                    onChange={(event) => updateClient("frequency", event.target.value)}
                    className="rounded-2xl border border-ink/10 bg-white px-4 py-3 font-bold text-ink outline-none focus:ring-4 focus:ring-lime/20"
                  />
                </label>
              </div>

              <div className="grid gap-3">
                <label className="grid gap-1 text-sm font-black text-ink/62">
                  Tikslas
                  <textarea
                    value={selectedClient.goal}
                    onChange={(event) => updateClient("goal", event.target.value)}
                    className="min-h-24 rounded-2xl border border-ink/10 bg-white px-4 py-3 font-bold text-ink outline-none focus:ring-4 focus:ring-lime/20"
                  />
                </label>

                <label className="grid gap-1 text-sm font-black text-ink/62">
                  Saugumo informacija / traumos / apribojimai
                  <textarea
                    value={selectedClient.health}
                    onChange={(event) => updateClient("health", event.target.value)}
                    className="min-h-24 rounded-2xl border border-ink/10 bg-white px-4 py-3 font-bold text-ink outline-none focus:ring-4 focus:ring-lime/20"
                  />
                </label>

                <label className="grid gap-1 text-sm font-black text-ink/62">
                  Trenerio pastabos
                  <textarea
                    value={selectedClient.notes}
                    onChange={(event) => updateClient("notes", event.target.value)}
                    className="min-h-28 rounded-2xl border border-ink/10 bg-white px-4 py-3 font-bold text-ink outline-none focus:ring-4 focus:ring-lime/20"
                  />
                </label>

                <label className="grid gap-1 text-sm font-black text-ink/62">
                  Planas / grafikas klientui
                  <textarea
                    value={selectedClient.plan}
                    onChange={(event) => updateClient("plan", event.target.value)}
                    className="min-h-32 rounded-2xl border border-ink/10 bg-white px-4 py-3 font-bold text-ink outline-none focus:ring-4 focus:ring-lime/20"
                  />
                </label>
              </div>
            </div>
          ) : (
            <div className="mt-5 rounded-2xl border border-ink/10 bg-white p-5 text-sm font-bold text-ink/55">
              Pasirinkite klientą iš sąrašo.
            </div>
          )}
        </section>

        <section className="mt-6 rounded-[2rem] border border-ink/10 bg-white/92 p-5 shadow-soft">
          <h2 className="font-display text-2xl font-extrabold tracking-[-.06em]">
            Registracijų sąrašas
          </h2>
          <p className="mt-1 text-sm text-ink/55">
            Čia matomos pasirinktos dienos registracijos ir užklausos pagal filtrus.
          </p>

          <div className="mt-5 grid gap-3">
            {filteredSessions.length ? (
              filteredSessions.map((session) => (
                <article
                  key={session.id}
                  className="rounded-[1.5rem] border border-ink/10 bg-white p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <button
                        type="button"
                        onClick={() => openClient(session.clientId)}
                        className="text-left text-lg font-black underline decoration-lime decoration-4 underline-offset-4 transition hover:text-forest"
                      >
                        {session.client}
                      </button>

                      <div className="mt-1 text-sm text-ink/55">
                        {session.date} · {session.time} · {session.phone}
                      </div>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-black ${getStatusClass(session.status)}`}
                    >
                      {session.status}
                    </span>
                  </div>

                  <div className="mt-4 font-bold">{session.service}</div>
                  <p className="mt-2 text-sm leading-6 text-ink/55">{session.goal}</p>

                  <div className="mt-4 grid gap-2 sm:grid-cols-3">
                    <select
                      value={session.status}
                      onChange={(event) =>
                        updateSession(session.id, "status", event.target.value)
                      }
                      className="rounded-xl border border-ink/10 px-3 py-2 text-sm font-bold"
                    >
                      {statuses
                        .filter((status) => status !== "Visos būsenos")
                        .map((status) => (
                          <option key={status}>{status}</option>
                        ))}
                    </select>

                    <input
                      type="date"
                      value={session.date}
                      onChange={(event) =>
                        updateSession(session.id, "date", event.target.value)
                      }
                      className="rounded-xl border border-ink/10 px-3 py-2 text-sm font-bold"
                    />

                    <select
                      value={session.time}
                      onChange={(event) =>
                        updateSession(session.id, "time", event.target.value)
                      }
                      className="rounded-xl border border-ink/10 px-3 py-2 text-sm font-bold"
                    >
                      {timeSlots.map((time) => (
                        <option key={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-2xl border border-ink/10 bg-white p-8 text-center text-sm font-bold text-ink/45">
                Pagal pasirinktus filtrus registracijų nėra.
              </div>
            )}
          </div>
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
