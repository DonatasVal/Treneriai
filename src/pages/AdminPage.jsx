import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "vardenis_admin_stage_3_cards_pdf_preview";

const timeSlots = [
  "06:30", "08:00", "09:30", "11:00", "12:30", "16:30", "18:00", "19:30",
];

const statuses = ["Naujas", "Priimtas", "Patvirtinta", "Aktyvus", "Atmestas", "Užklausa", "Atšaukta"];

const statusStyles = {
  Naujas: "bg-blue-100 text-blue-700",
  Priimtas: "bg-lime-100 text-green-800",
  Patvirtinta: "bg-cyan-100 text-cyan-800",
  Aktyvus: "bg-emerald-100 text-emerald-800",
  Atmestas: "bg-rose-100 text-rose-700",
  Užklausa: "bg-amber-100 text-amber-800",
  Atšaukta: "bg-stone-100 text-stone-600",
};

const services = [
  "Individuali treniruotė",
  "Treniruočių abonementas",
  "Individualus planas",
  "Nuotolinė priežiūra",
  "Mitybos strategija",
];

const initialClients = [
  {
    id: "c1", name: "Mantas Kazlauskas", phone: "+370 600 11223", email: "mantas@email.lt", status: "Aktyvus", packageName: "Individuali treniruotė",
    goal: "Jėga, laikysena, geresnė pratimų technika", frequency: "3 kartus per savaitę", health: "Nugaros įtampa po ilgo sėdėjimo. Pradžioje vengti staigaus krūvio.",
    notes: "Stebėti pritūpimo ir traukos techniką. Pirmas 2 savaites vidutinis intensyvumas.",
    plan: "Pirmadienis – viršutinė kūno dalis. Trečiadienis – kojos ir core. Penktadienis – viso kūno treniruotė.",
  },
  {
    id: "c2", name: "Aistė Petrauskaitė", phone: "+370 611 22334", email: "aiste@email.lt", status: "Patvirtinta", packageName: "Treniruočių abonementas",
    goal: "Svorio mažinimas ir aiškus planas namuose", frequency: "2 kartus per savaitę", health: "Traumų nenurodyta.",
    notes: "Svarbu palaikymas ir aiškus savaitės ritmas.", plan: "Antradienis – jėga. Ketvirtadienis – kondicija ir mobilumas.",
  },
];

const initialRegistrations = [
  { id: "r1", clientId: "c1", date: "2026-06-08", time: "08:00", service: "Individuali treniruotė", status: "Aktyvus", goal: "Viršutinė kūno dalis ir core" },
  { id: "r2", clientId: "c2", date: "2026-06-08", time: "09:30", service: "Treniruočių abonementas", status: "Patvirtinta", goal: "Pradinis pokalbis ir grafiko suderinimas" },
];

const initialBlocked = [
  { id: "b1", date: "2026-06-08", time: "06:30", reason: "Treneris užimtas / pasiruošimas" },
  { id: "b2", date: "2026-06-08", time: "12:30", reason: "Pertrauka / administracinis laikas" },
];

function getStatusClass(status) {
  return statusStyles[status] || "bg-stone-100 text-stone-700";
}

const programTemplates = [
  { id: "balanced-hypertrophy", label: "Hipertrofija · Upper / Lower", description: "4 dienos per savaitę, baziniai judesiai, aiški progresija." },
  { id: "beginner-recomposition", label: "Pradedantysis · Full body", description: "3 dienos per savaitę, technika, saugus krūvis, kompozicija." },
  { id: "strength-base", label: "Jėgos bazė · 3 dienos", description: "Pagrindiniai kėlimai, ilgesnis poilsis, kontroliuojamas RPE." },
];

const defaultExercise = {
  id: "A1", movement: "Stūmimas", muscleGroup: "Krūtinė / pečiai", name: "Naujas pratimas", meta: "Technikos pastabos ir saugumo akcentai.",
  sets: "3", reps: "8–10", setsReps: "3 x 8–10", load: "", rpe: "RPE 8 / 2 RIR", rest: "2 min.", tempo: "3-0-1-0",
  progression: "Kai visose serijose pasiekiamas viršutinis pakartojimų intervalas, didinti svorį 2,5–5 %.",
  alternatives: "Alternatyvus pratimas, jei įranga užimta arba jaučiamas diskomfortas.", contraindications: "", videoUrl: "", result: "",
};

function createExercise(overrides = {}) {
  const merged = { ...defaultExercise, ...overrides };
  return { ...merged, setsReps: merged.setsReps || `${merged.sets} x ${merged.reps}` };
}

function createWorkoutDay(overrides = {}) {
  return {
    title: "NAUJA TRENIRUOTĖ", focus: "Bendras pasirengimas", priority: "Technika ir kontroliuojamas krūvis",
    warmup: "5–8 min. lengvo kardio + mobilumas pagal treniruotės kryptį.", cooldown: "3–5 min. lengvas atsipalaidavimas, kvėpavimas, tempimo pratimai.",
    notes: "Stebėti techniką, skausmo skalę ir nuovargį.", exercises: [createExercise()], ...overrides,
  };
}

function createDefaultWorkoutPlan(client = {}, templateId = "balanced-hypertrophy") {
  const common = {
    title: "SPORTO PROGRAMA", subtitle: "Profesionali, progresuojanti treniruočių sistema", coach: "Vardenis Pavardenis",
    clientName: client.name || "Klientas", weight: "", height: "", duration: "4–6 savaitės", goal: client.goal || "Saugus progresas",
    level: "Vidutinis", location: "Sporto salė", equipment: "Pilna įranga", sessionsPerWeek: "4", system: "Upper / Lower",
    phase: "1 etapas · technika + bazinis progresas", progressionModel: "Dviguba progresija: pirma didinami pakartojimai, tada svoris.",
    deload: "Jei krenta rezultatai — sumažinti apimtį 30 % vienai savaitei.", assessment: "Įvertinti bazinius judesius ir mobilumą.",
    warmup: "5–8 min. kardio, dinaminis mobilumas, įvadinės serijos.", cooldown: "3–5 min. atsistatymas.",
    nutrition: "Baltymai kiekviename valgyme, vanduo, miegas.", reviewDate: "Po 2 savaičių", coachNotes: "Programa koreguojama pagal rezultatus.",
    clientInstructions: "Svorį žymėti rezultatų laukelyje.", alerts: client.health || "Nėra apribojimų.",
  };

  return {
    ...common,
    days: [
      createWorkoutDay({ title: "DIENA A: VIRŠUTINĖ DALIS", focus: "Horizontalus stūmimas/traukimas", exercises: [createExercise()] })
    ]
  };
}

function normalizeExercise(exercise = {}, exerciseIndex = 0) {
  const setsReps = exercise.setsReps || `${exercise.sets || "3"} x ${exercise.reps || "10"}`;
  const [setsPart, repsPart] = setsReps.includes(" x ") ? setsReps.split(" x ") : [exercise.sets || "3", exercise.reps || "10"];
  return { ...defaultExercise, ...exercise, id: exercise.id || `A${exerciseIndex + 1}`, sets: setsPart || "3", reps: repsPart || "10", setsReps };
}

function normalizeWorkoutPlan(client) {
  const plan = client?.workoutPlan || createDefaultWorkoutPlan(client);
  return {
    ...createDefaultWorkoutPlan(client), ...plan, title: plan.title || "SPORTO PROGRAMA",
    clientName: plan.clientName || client.name || "Klientas", goal: plan.goal || client.goal || "", alerts: plan.alerts || client.health || "Nėra apribojimų.",
    days: Array.isArray(plan.days) && plan.days.length ? plan.days.map((day, index) => ({
          ...createWorkoutDay(), ...day, title: day.title || `DIENA ${index + 1}`,
          exercises: Array.isArray(day.exercises) && day.exercises.length ? day.exercises.map((ex, i) => normalizeExercise(ex, i)) : [createExercise()],
        })) : createDefaultWorkoutPlan(client).days,
  };
}

function getTemplatePlan(templateId, client) { return createDefaultWorkoutPlan(client, templateId); }

function formatSetsReps(exercise) {
  if (exercise.sets && exercise.reps) return `${exercise.sets} x ${exercise.reps}`;
  return exercise.setsReps || "3 x 10";
}

function calculateWorkoutVolume(plan) {
  const exerciseCount = plan.days.reduce((sum, day) => sum + day.exercises.length, 0);
  return { days: plan.days.length, exercises: exerciseCount, sessionsPerWeek: plan.sessionsPerWeek || plan.days.length };
}

function normalizeState(data) {
  return {
    clients: (data?.clients || initialClients).map((client) => ({ ...client, workoutPlan: normalizeWorkoutPlan(client) })),
    registrations: data?.registrations || initialRegistrations,
    blocked: data?.blocked || initialBlocked,
  };
}

function escapeHtml(value) {
  return String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

function buildWorkoutPlanHtml(client, plan) {
  const safePlan = normalizeWorkoutPlan({ ...client, workoutPlan: plan });
  const volume = calculateWorkoutVolume(safePlan);

  const phaseHtml = `
    <section class="method-grid">
      <div><strong>Tikslas</strong><span>${escapeHtml(safePlan.goal || client.goal || "—")}</span></div>
      <div><strong>Lygis</strong><span>${escapeHtml(safePlan.level || "—")}</span></div>
      <div><strong>Vieta / įranga</strong><span>${escapeHtml(safePlan.location || "—")} · ${escapeHtml(safePlan.equipment || "—")}</span></div>
      <div><strong>Dažnumas</strong><span>${escapeHtml(safePlan.sessionsPerWeek || volume.sessionsPerWeek)} k. / savaitę</span></div>
      <div><strong>Progresija</strong><span>${escapeHtml(safePlan.progressionModel || "—")}</span></div>
      <div><strong>Peržiūra</strong><span>${escapeHtml(safePlan.reviewDate || "—")}</span></div>
    </section>
  `;

  const daysHtml = safePlan.days.map((day) => `
    <section class="day">
      <div class="day-head">
        <h2>${escapeHtml(day.title)}</h2>
        <p><strong>Fokusas:</strong> ${escapeHtml(day.focus)} · <strong>Prioritetas:</strong> ${escapeHtml(day.priority)}</p>
      </div>
      <div class="day-notes">
        <div><strong>Apšilimas:</strong> ${escapeHtml(day.warmup)}</div>
        <div><strong>Pabaiga:</strong> ${escapeHtml(day.cooldown)}</div>
        ${day.notes ? `<div><strong>Pastabos:</strong> ${escapeHtml(day.notes)}</div>` : ""}
      </div>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Pratimas ir technika</th>
            <th>Jud.</th>
            <th>Raumenys</th>
            <th>Serijos x pak.</th>
            <th>Krūvis</th>
            <th>RPE/RIR</th>
            <th>Poilsis/tempas</th>
            <th>Progresija</th>
          </tr>
        </thead>
        <tbody>
          ${day.exercises.map((exercise) => `
            <tr>
              <td><strong>${escapeHtml(exercise.id)}</strong></td>
              <td>
                <strong>${escapeHtml(exercise.name)}</strong>
                <small>${escapeHtml(exercise.meta)}</small>
                ${exercise.alternatives ? `<small><b>Alternatyva:</b> ${escapeHtml(exercise.alternatives)}</small>` : ""}
                ${exercise.contraindications ? `<small class="danger"><b>Saugumas:</b> ${escapeHtml(exercise.contraindications)}</small>` : ""}
              </td>
              <td>${escapeHtml(exercise.movement)}</td>
              <td>${escapeHtml(exercise.muscleGroup)}</td>
              <td>${escapeHtml(formatSetsReps(exercise))}</td>
              <td>${escapeHtml(exercise.load || "Pagal RPE")}</td>
              <td>${escapeHtml(exercise.rpe)}</td>
              <td>${escapeHtml(exercise.rest)}<small>T: ${escapeHtml(exercise.tempo)}</small></td>
              <td>
                <small>${escapeHtml(exercise.progression || safePlan.progressionModel || "—")}</small>
                <div class="result-box"></div>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </section>
  `).join("");

  return `<!doctype html>
<html lang="lt">
<head>
<meta charset="utf-8" />
<title>${escapeHtml(safePlan.title)} - ${escapeHtml(safePlan.clientName)}</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800;900&display=swap" rel="stylesheet">
<style>
  @page { size: A4; margin: 10mm; }
  * { box-sizing: border-box; font-family: 'Inter', sans-serif; }
  body { margin: 0; color: #0f172a; background: white; -webkit-font-smoothing: antialiased;}
  .sheet { max-width: 1120px; margin: 0 auto; padding: 24px; }
  header { display: flex; justify-content: space-between; align-items: flex-end; gap: 24px; border-bottom: 2px solid #0f172a; padding-bottom: 20px; margin-bottom: 24px; }
  h1 { margin: 0; font-size: 28px; letter-spacing: -.03em; font-weight: 900;}
  .subtitle { color: #475467; margin-top: 4px; font-size: 14px; font-weight: 600;}
  .coach { text-align: right; font-size: 12px; line-height: 1.6; font-weight: 600;}
  .meta, .method-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; background: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 16px; margin-bottom: 16px; font-size: 12px; }
  .method-grid { grid-template-columns: repeat(3, 1fr); }
  .meta div, .method-grid div { background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px; box-shadow: 0 1px 2px rgba(0,0,0,0.02);}
  .meta strong, .method-grid strong { display: block; color: #64748b; font-size: 10px; text-transform: uppercase; letter-spacing: .08em; margin-bottom: 4px; font-weight: 800;}
  .alert { background: #fff1f2; border: 1px solid #fecdd3; color: #9f1239; padding: 14px 16px; border-radius: 14px; margin-bottom: 16px; font-size: 13px; font-weight: 600;}
  .instructions { background: #f0fdf4; border: 1px solid #bbf7d0; color: #14532d; padding: 14px 16px; border-radius: 14px; margin-bottom: 20px; font-size: 13px; line-height: 1.5; font-weight: 600;}
  .day { break-inside: avoid; margin-top: 24px; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden;}
  .day-head { background: #0f172a; color: white; padding: 14px 16px; }
  .day-head h2 { font-size: 16px; margin: 0; font-weight: 800; letter-spacing: -.01em;}
  .day-head p { margin: 6px 0 0; font-size: 12px; color: rgba(255,255,255,.8); font-weight: 500;}
  .day-notes { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: #e2e8f0; border-bottom: 1px solid #e2e8f0; font-size: 11.5px; color: #334155; font-weight: 500;}
  .day-notes div { background: #f8fafc; padding: 12px;}
  table { width: 100%; border-collapse: collapse; font-size: 11px; background: white;}
  th { text-align: left; background: #f1f5f9; color: #475467; padding: 12px; font-weight: 800; border-bottom: 1px solid #cbd5e1; }
  td { padding: 12px; border-bottom: 1px solid #f1f5f9; vertical-align: top; font-weight: 500;}
  td strong { font-weight: 800; color: #0f172a;}
  small { display: block; color: #64748b; margin-top: 6px; line-height: 1.4; font-size: 10px;}
  .danger { color: #be123c; font-weight: 600;}
  .result-box { margin-top: 8px; border: 1px dashed #cbd5e1; height: 28px; border-radius: 6px; background: #f8fafc;}
  .guide { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 20px; margin-top: 24px; font-size: 12px; color: #334155; line-height: 1.5;}
  @media print { .sheet { padding: 0; } body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
</style>
</head>
<body>
  <main class="sheet">
    <header>
      <div>
        <h1>${escapeHtml(safePlan.title)}</h1>
        <div class="subtitle">${escapeHtml(safePlan.subtitle)}</div>
      </div>
      <div class="coach"><strong>Parengė:</strong> ${escapeHtml(safePlan.coach)}<br /><strong>Data:</strong> ${new Date().toLocaleDateString("lt-LT")}<br /><strong>Klientas:</strong> ${escapeHtml(safePlan.clientName)}</div>
    </header>
    <section class="meta">
      <div><strong>Klientas</strong><span>${escapeHtml(safePlan.clientName)}</span></div>
      <div><strong>Sistemos tipas</strong><span>${escapeHtml(safePlan.system)}</span></div>
      <div><strong>Ūgis / svoris</strong><span>${escapeHtml(safePlan.height || "—")} cm / ${escapeHtml(safePlan.weight || "—")} kg</span></div>
      <div><strong>Trukmė</strong><span>${escapeHtml(safePlan.duration)}</span></div>
    </section>
    ${phaseHtml}
    <section class="alert"><strong>Sveikatos apribojimai:</strong> ${escapeHtml(safePlan.alerts)}</section>
    <section class="instructions"><strong>Trenerio pastabos:</strong> ${escapeHtml(safePlan.clientInstructions)}<br /><strong>Bendras apšilimas:</strong> ${escapeHtml(safePlan.warmup)}<br /><strong>Deload:</strong> ${escapeHtml(safePlan.deload)}</section>
    ${daysHtml}
    <section class="guide">
      <div><strong>RPE ir RIR:</strong><br />RIR reiškia, kiek pakartojimų lieka atsargoje iki techninio nebegalėjimo. 2 RIR = dar 2 kokybiški pakartojimai.</div>
      <div><strong>Tempo 3-0-1-0:</strong><br />3 sek. nuleidimas, 0 sek. pauzė apačioje, 1 sek. kėlimas, 0 sek. pauzė viršuje.</div>
      <div><strong>Progresija:</strong><br />Svorį didinti tik jei technika išlieka stabili, skausmas nedidėja, o RPE atitinka planą.</div>
    </section>
  </main>
</body>
</html>`;
}

function loadInitialState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) throw new Error("No saved state");
    return normalizeState(JSON.parse(saved));
  } catch {
    return normalizeState({ clients: initialClients, registrations: initialRegistrations, blocked: initialBlocked });
  }
}

function makeShareText(client) {
  return `Sveiki, ${client.name},\n\nJūsų informacija:\nStatusas: ${client.status}\nPaslauga: ${client.packageName}\nTikslas: ${client.goal}\nDažnumas: ${client.frequency}\n\nTrenerio pastabos:\n${client.notes}\n\nPlanas / grafikas:\n${client.plan}\n\nPagarbiai,\nVardenis Pavardenis`;
}

function toDateKey(date) { return date.toISOString().slice(0, 10); }

function getMonthDays(monthValue) {
  const [year, month] = monthValue.split("-").map(Number);
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  const days = [];
  for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
    days.push(toDateKey(new Date(d)));
  }
  return days;
}

function getWeekday(dateKey) {
  const day = new Date(`${dateKey}T12:00:00`).getDay();
  return ["S", "P", "A", "T", "K", "P", "Š"][day];
}

export default function TrainerAdmin() {
  const [state, setState] = useState(loadInitialState);
  const [selectedDate, setSelectedDate] = useState("2026-06-08");
  const [selectedMonth, setSelectedMonth] = useState("2026-06");
  const [statusFilter, setStatusFilter] = useState("Visos būsenos");
  const [search, setSearch] = useState("");
  const [selectedClientId, setSelectedClientId] = useState(state.clients[0]?.id || "");
  const [selectedRegistrationId, setSelectedRegistrationId] = useState(state.registrations[0]?.id || "");
  const [viewMode, setViewMode] = useState("Diena");
  const [toast, setToast] = useState("");
  const [programPreset, setProgramPreset] = useState("balanced-hypertrophy");
  const [programView, setProgramView] = useState("settings");

  const selectedClient = state.clients.find((c) => c.id === selectedClientId);
  const selectedWorkoutPlan = selectedClient?.workoutPlan || createDefaultWorkoutPlan(selectedClient);
  const selectedRegistration = state.registrations.find((r) => r.id === selectedRegistrationId);

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }, [state]);

  function getClient(clientId) { return state.clients.find((c) => c.id === clientId); }

  function matchSearch(registration) {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    const client = getClient(registration.clientId);
    return [client?.name, client?.phone, client?.email, client?.status, client?.packageName, client?.goal, registration.service, registration.goal, registration.status, registration.date, registration.time]
      .filter(Boolean).join(" ").toLowerCase().includes(query);
  }

  function matchStatus(registration) {
    if (statusFilter === "Visos būsenos") return true;
    const client = getClient(registration.clientId);
    return registration.status === statusFilter || client?.status === statusFilter;
  }

  const filteredAllRegistrations = useMemo(() => {
    return state.registrations.filter(matchStatus).filter(matchSearch).sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
  }, [state.registrations, state.clients, statusFilter, search]);

  const registrationsForDate = useMemo(() => filteredAllRegistrations.filter((r) => r.date === selectedDate), [filteredAllRegistrations, selectedDate]);
  
  const monthDays = useMemo(() => getMonthDays(selectedMonth), [selectedMonth]);

  const monthSummary = useMemo(() => {
    return monthDays.map((date) => {
      const dayRegistrations = filteredAllRegistrations.filter((r) => r.date === date);
      const dayBlocked = state.blocked.filter((b) => b.date === date);
      const occupied = dayRegistrations.length + dayBlocked.length;
      return { date, dayRegistrations, dayBlocked, occupied, free: Math.max(timeSlots.length - occupied, 0), total: timeSlots.length };
    });
  }, [monthDays, filteredAllRegistrations, state.blocked]);

  const stats = [
    ["Dienos įrašai", registrationsForDate.length],
    ["Mėnesio įrašai", monthSummary.reduce((sum, d) => sum + d.dayRegistrations.length, 0)],
    ["Patvirtintos", state.registrations.filter((r) => r.status === "Patvirtinta").length],
    ["Naujos užklausos", state.registrations.filter((r) => r.status === "Užklausa" || r.status === "Naujas").length],
  ];

  function showToast(message) { setToast(message); window.setTimeout(() => setToast(""), 3000); }

  function updateClient(clientId, patch) {
    setState((current) => ({ ...current, clients: current.clients.map((c) => c.id === clientId ? { ...c, ...patch } : c) }));
  }

  function updateSelectedWorkoutPlan(updater) {
    setState((current) => ({
      ...current,
      clients: current.clients.map((client) => {
        if (client.id !== selectedClientId) return client;
        const currentPlan = normalizeWorkoutPlan(client);
        const nextPlan = typeof updater === "function" ? updater(currentPlan) : { ...currentPlan, ...updater };
        return { ...client, workoutPlan: normalizeWorkoutPlan({ ...client, workoutPlan: nextPlan }) };
      }),
    }));
  }

  function applyProgramTemplate(templateId) {
    if (!selectedClient) return;
    setProgramPreset(templateId);
    updateSelectedWorkoutPlan(() => getTemplatePlan(templateId, selectedClient));
    showToast("Pritaikytas profesionalus programos šablonas.");
  }

  function updateWorkoutDay(dayIndex, patch) {
    updateSelectedWorkoutPlan((plan) => ({ ...plan, days: plan.days.map((day, i) => i === dayIndex ? { ...day, ...patch } : day) }));
  }

  function addWorkoutDay() {
    updateSelectedWorkoutPlan((plan) => ({
      ...plan, days: [...plan.days, createWorkoutDay({ title: `DIENA ${plan.days.length + 1}: NAUJA TRENIRUOTĖ`, exercises: [createExercise()] })],
    }));
  }

  function duplicateWorkoutDay(dayIndex) {
    updateSelectedWorkoutPlan((plan) => {
      const dayToCopy = plan.days[dayIndex];
      if (!dayToCopy) return plan;
      const days = [...plan.days];
      days.splice(dayIndex + 1, 0, { ...dayToCopy, title: `${dayToCopy.title} (Kopija)`, exercises: dayToCopy.exercises.map((e) => ({ ...e })) });
      return { ...plan, days };
    });
  }

  function moveWorkoutDay(dayIndex, direction) {
    updateSelectedWorkoutPlan((plan) => {
      const nextIndex = dayIndex + direction;
      if (nextIndex < 0 || nextIndex >= plan.days.length) return plan;
      const days = [...plan.days];
      const [day] = days.splice(dayIndex, 1);
      days.splice(nextIndex, 0, day);
      return { ...plan, days };
    });
  }

  function removeWorkoutDay(dayIndex) {
    updateSelectedWorkoutPlan((plan) => ({ ...plan, days: plan.days.length > 1 ? plan.days.filter((_, i) => i !== dayIndex) : plan.days }));
  }

  function updateWorkoutExercise(dayIndex, exerciseIndex, patch) {
    updateSelectedWorkoutPlan((plan) => ({
      ...plan, days: plan.days.map((day, i) => i !== dayIndex ? day : {
        ...day, exercises: day.exercises.map((ex, j) => j === exerciseIndex ? normalizeExercise({ ...ex, ...patch }, j) : ex)
      })
    }));
  }

  function addWorkoutExercise(dayIndex) {
    updateSelectedWorkoutPlan((plan) => ({
      ...plan, days: plan.days.map((day, i) => i !== dayIndex ? day : {
        ...day, exercises: [...day.exercises, createExercise({ id: `A${day.exercises.length + 1}` })]
      })
    }));
  }

  function duplicateWorkoutExercise(dayIndex, exerciseIndex) {
    updateSelectedWorkoutPlan((plan) => ({
      ...plan, days: plan.days.map((day, i) => {
        if (i !== dayIndex) return day;
        const ex = day.exercises[exerciseIndex];
        if (!ex) return day;
        const exercises = [...day.exercises];
        exercises.splice(exerciseIndex + 1, 0, { ...ex, id: `${ex.id}*` });
        return { ...day, exercises };
      })
    }));
  }

  function moveWorkoutExercise(dayIndex, exerciseIndex, direction) {
    updateSelectedWorkoutPlan((plan) => ({
      ...plan, days: plan.days.map((day, i) => {
        if (i !== dayIndex) return day;
        const nextIndex = exerciseIndex + direction;
        if (nextIndex < 0 || nextIndex >= day.exercises.length) return day;
        const exercises = [...day.exercises];
        const [ex] = exercises.splice(exerciseIndex, 1);
        exercises.splice(nextIndex, 0, ex);
        return { ...day, exercises };
      })
    }));
  }

  function removeWorkoutExercise(dayIndex, exerciseIndex) {
    updateSelectedWorkoutPlan((plan) => ({
      ...plan, days: plan.days.map((day, i) => i !== dayIndex ? day : {
        ...day, exercises: day.exercises.length > 1 ? day.exercises.filter((_, j) => j !== exerciseIndex) : day.exercises
      })
    }));
  }

  function resetWorkoutPlanForClient() {
    if (!selectedClient) return;
    updateSelectedWorkoutPlan(() => createDefaultWorkoutPlan(selectedClient, programPreset));
    showToast("Atstatyta pagal šabloną.");
  }

  function exportWorkoutPlanToPdf() {
    if (!selectedClient) return;
    const printWindow = window.open("", "_blank", "width=1100,height=900");
    if (!printWindow) { showToast("Naršyklė užblokavo langą."); return; }
    printWindow.document.open();
    printWindow.document.write(buildWorkoutPlanHtml(selectedClient, selectedWorkoutPlan));
    printWindow.document.close();
    printWindow.focus();
    window.setTimeout(() => printWindow.print(), 500);
    showToast("PDF eksportas atidarytas.");
  }

  function updateRegistration(registrationId, patch) {
    setState((current) => ({ ...current, registrations: current.registrations.map((r) => r.id === registrationId ? { ...r, ...patch } : r) }));
  }

  function syncClientAndRegistrationStatus(clientId, registrationId, status) {
    updateClient(clientId, { status });
    updateRegistration(registrationId, { status });
  }

  function openClient(clientId, registrationId = "") {
    setSelectedClientId(clientId);
    if (registrationId) setSelectedRegistrationId(registrationId);
    setTimeout(() => document.getElementById("client-panel")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  }

  function getSlot(time) {
    return {
      registration: state.registrations.find((r) => r.date === selectedDate && r.time === time && r.status !== "Atšaukta"),
      block: state.blocked.find((b) => b.date === selectedDate && b.time === time),
    };
  }

  function blockTime(time) {
    if (state.blocked.some((b) => b.date === selectedDate && b.time === time)) return;
    setState((c) => ({ ...c, blocked: [...c.blocked, { id: `b${Date.now()}`, date: selectedDate, time, reason: "Užblokuota" }] }));
    showToast("Laikas užblokuotas.");
  }

  function unblockTime(blockId) {
    setState((c) => ({ ...c, blocked: c.blocked.filter((b) => b.id !== blockId) }));
    showToast("Atlaisvinta.");
  }

  async function copyClientPlan() {
    if (!selectedClient) return;
    try { await navigator.clipboard.writeText(makeShareText(selectedClient)); showToast("Nukopijuota."); }
    catch { showToast("Nepavyko nukopijuoti."); }
  }

  function resetDemoData() {
    localStorage.removeItem(STORAGE_KEY);
    setState(normalizeState({ clients: initialClients, registrations: initialRegistrations, blocked: initialBlocked }));
    setSelectedClientId(initialClients[0].id);
    setSelectedRegistrationId(initialRegistrations[0].id);
    showToast("Atstatyta.");
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_10%_0%,rgba(199,244,90,.12),transparent_30%),linear-gradient(180deg,#FBFAF6,#F4F1EA)] px-3 py-4 text-ink sm:px-6 sm:py-8 font-sans antialiased">
      <div className="mx-auto w-[min(1520px,100%)]">
        
        {/* PARDAVIMINIS DEMO BANNERIS TRENERIAMS */}
        <div className="mb-4 rounded-2xl bg-forest px-5 py-3 text-sm font-bold text-white shadow-md sm:flex sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-lime text-forest">✨</span>
            <span><strong>SaaS Demo Režimas:</strong> Tai Jūsų būsima darbo sistema. Valdykite klientus, grafikus ir sporto programas vienoje vietoje.</span>
          </div>
          <button onClick={resetDemoData} className="mt-2 text-xs font-black text-lime underline hover:text-white sm:mt-0">Atstatyti pavyzdinius duomenis</button>
        </div>

        <header className="mb-6 flex flex-col gap-4 rounded-[24px] border border-ink/5 bg-white/95 p-6 shadow-sm backdrop-blur lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="font-display text-[clamp(2rem,4vw,3.5rem)] font-extrabold leading-none tracking-tight">
              Trenerio valdymo skydas
            </h1>
            <p className="mt-2 max-w-2xl text-[15px] text-ink/60 font-medium">
              Vienas įrankis visiems procesams: automatizuotos registracijos, klientų istorija ir profesionalus programų sudarymas.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a href="/" className="rounded-full bg-forest px-6 py-3 text-[14px] font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg">
              Peržiūrėti viešą svetainę
            </a>
          </div>
        </header>

        <nav className="sticky top-4 z-20 mb-6 flex gap-2 overflow-x-auto rounded-[20px] border border-ink/5 bg-white/90 p-2 shadow-sm backdrop-blur">
          {[["apzvalga", "Apžvalga"], ["grafikas", "Mano grafikas"], ["registracijos", "Užklausos"], ["klientai", "Klientų bazė"], ["programos", "Programų builderis"]].map(([id, label]) => (
            <a key={id} href={`#${id}`} className="shrink-0 rounded-[14px] px-5 py-2.5 text-[14px] font-bold text-ink/60 transition hover:bg-forest hover:text-white">
              {label}
            </a>
          ))}
        </nav>

        <section id="apzvalga" className="scroll-mt-28 mb-8 grid gap-4 md:grid-cols-4">
          {stats.map(([label, value]) => (
            <article key={label} className="rounded-[24px] border border-ink/5 bg-white p-6 shadow-sm transition hover:shadow-md">
              <div className="font-display text-4xl font-extrabold tracking-tight text-forest">{value}</div>
              <div className="mt-2 text-[14px] font-bold text-ink/60">{label}</div>
            </article>
          ))}
        </section>

        <section className="mb-8 rounded-[24px] border border-ink/5 bg-white p-5 shadow-sm">
          <div className="grid gap-4 lg:grid-cols-[180px_180px_220px_1fr]">
            <div className="flex rounded-[16px] border border-ink/10 bg-paper p-1">
              {["Diena", "Mėnuo"].map((mode) => (
                <button key={mode} type="button" onClick={() => setViewMode(mode)} className={`flex-1 rounded-[12px] px-3 py-2 text-[14px] font-bold transition ${viewMode === mode ? "bg-forest text-white shadow-sm" : "text-ink/60 hover:bg-white"}`}>
                  {mode}
                </button>
              ))}
            </div>

            {viewMode === "Diena" ? (
              <input type="date" value={selectedDate} onChange={(e) => { setSelectedDate(e.target.value); setSelectedMonth(e.target.value.slice(0, 7)); }} className="rounded-[16px] border border-ink/10 bg-paper px-4 py-2.5 text-[14px] font-bold outline-none focus:border-forest focus:ring-2 focus:ring-forest/10" />
            ) : (
              <input type="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="rounded-[16px] border border-ink/10 bg-paper px-4 py-2.5 text-[14px] font-bold outline-none focus:border-forest focus:ring-2 focus:ring-forest/10" />
            )}

            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-[16px] border border-ink/10 bg-paper px-4 py-2.5 text-[14px] font-bold outline-none focus:border-forest focus:ring-2 focus:ring-forest/10">
              <option>Visos būsenos</option>
              {statuses.map((status) => <option key={status}>{status}</option>)}
            </select>

            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Greita paieška (klientas, paslauga...)" className="rounded-[16px] border border-ink/10 bg-paper px-4 py-2.5 text-[14px] font-bold outline-none focus:border-forest focus:ring-2 focus:ring-forest/10" />
          </div>
        </section>

        <div id="grafikas" className="scroll-mt-28" />

        {viewMode === "Mėnuo" && (
          <section className="mb-8 overflow-x-auto rounded-[24px] border border-ink/5 bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="font-display text-[24px] font-extrabold tracking-tight">Mėnesio kalendorius</h2>
                <p className="text-[14px] text-ink/60 font-medium">{selectedMonth}</p>
              </div>
            </div>

            <div className="grid min-w-[800px] grid-cols-7 overflow-hidden rounded-[20px] border border-ink/10 bg-paper">
              {["Pirmadienis", "Antradienis", "Trečiadienis", "Ketvirtadienis", "Penktadienis", "Šeštadienis", "Sekmadienis"].map((day) => (
                <div key={day} className="border-b border-ink/5 p-3 text-center text-[11px] font-bold uppercase tracking-wider text-ink/50">{day}</div>
              ))}

              {monthSummary.map((day) => {
                const hasItems = day.occupied > 0;
                const percent = Math.round((day.occupied / day.total) * 100);

                return (
                  <button key={day.date} type="button" onClick={() => { setSelectedDate(day.date); setViewMode("Diena"); }} className={`min-h-[140px] border-t border-r border-ink/5 p-3 text-left transition ${hasItems ? "bg-white hover:bg-lime/5" : "bg-transparent hover:bg-white"}`}>
                    <div className="flex items-start justify-between gap-1">
                      <div className="font-display text-[22px] font-bold tracking-tight text-ink/80">{Number(day.date.slice(-2))}</div>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${hasItems ? "bg-lime-soft text-forest" : "text-ink/30"}`}>{day.occupied}/{day.total}</span>
                    </div>
                    {hasItems && <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-paper"><div className="h-full bg-lime" style={{ width: `${percent}%` }} /></div>}
                    <div className="mt-3 flex flex-col gap-1">
                      {day.dayRegistrations.slice(0, 3).map((item) => (
                        <div key={item.id} className="truncate rounded-md bg-paper px-2 py-1 text-[11px] font-semibold text-ink/80">{item.time} · {getClient(item.clientId)?.name}</div>
                      ))}
                      {day.dayBlocked.length > 0 && <div className="rounded-md bg-rose-50 px-2 py-1 text-[11px] font-semibold text-rose-700">Blokuota: {day.dayBlocked.length}</div>}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        <section className="grid gap-8 xl:grid-cols-[1fr_400px]">
          <div className="overflow-x-auto rounded-[24px] border border-ink/5 bg-white shadow-sm">
            <div className="border-b border-ink/5 px-6 py-5">
              <h2 className="font-display text-[20px] font-extrabold tracking-tight">Dienos tvarkaraštis</h2>
              <p className="text-[14px] text-ink/60 font-medium">{selectedDate}</p>
            </div>

            <div className="grid min-w-[600px] grid-cols-[100px_1fr]">
              <div className="border-b border-r border-ink/5 bg-paper p-4 text-[11px] font-bold uppercase tracking-wider text-ink/50">Laikas</div>
              <div className="border-b border-ink/5 bg-paper p-4 text-[11px] font-bold uppercase tracking-wider text-ink/50">Detalės</div>

              {timeSlots.map((time) => {
                const { registration, block } = getSlot(time);
                const client = registration ? getClient(registration.clientId) : null;
                const shouldShowRegistration = registration && client && matchStatus(registration) && matchSearch(registration);

                return (
                  <div key={time} className="contents group">
                    <div className="min-h-[120px] border-b border-r border-ink/5 p-4 text-[14px] font-bold text-ink/70 group-hover:bg-paper/50">{time}</div>
                    <div className="min-h-[120px] border-b border-ink/5 p-4 group-hover:bg-paper/50">
                      {registration && client && shouldShowRegistration ? (
                        <div className="rounded-[16px] border border-lime/30 bg-lime/10 p-5 transition hover:border-lime/60">
                          <div className="flex flex-wrap justify-between gap-3">
                            <div>
                              <button type="button" onClick={() => openClient(client.id, registration.id)} className="text-[16px] font-bold text-forest hover:underline">
                                {client.name}
                              </button>
                              <div className="mt-1 text-[13px] font-medium text-forest/70">{registration.service}</div>
                            </div>
                            <span className={`rounded-[8px] px-3 py-1 text-[12px] font-bold ${getStatusClass(registration.status)}`}>{registration.status}</span>
                          </div>
                          <p className="mt-3 text-[14px] text-forest/80 line-clamp-2">{registration.goal}</p>
                          <div className="mt-4 flex gap-2">
                            <button onClick={() => acceptRegistration(registration)} className="rounded-[10px] bg-forest px-4 py-2 text-[12px] font-bold text-white transition hover:bg-ink">Patvirtinti</button>
                            <button onClick={() => openClient(client.id, registration.id)} className="rounded-[10px] bg-white px-4 py-2 text-[12px] font-bold text-forest shadow-sm hover:bg-paper">Kortelė</button>
                          </div>
                        </div>
                      ) : block ? (
                        <div className="flex items-center justify-between rounded-[16px] border border-rose-100 bg-rose-50 p-4">
                          <div>
                            <strong className="text-[14px] text-rose-900">Užblokuota</strong>
                            <div className="text-[13px] text-rose-700/70">{block.reason}</div>
                          </div>
                          <button onClick={() => unblockTime(block.id)} className="rounded-[10px] bg-white px-4 py-2 text-[12px] font-bold text-rose-700 shadow-sm hover:bg-rose-100">Atlaisvinti</button>
                        </div>
                      ) : (
                        <div className="flex h-full items-center justify-between rounded-[16px] border border-dashed border-ink/10 p-4 opacity-50 transition hover:opacity-100">
                          <span className="text-[14px] font-medium text-ink/40">Laisvas laikas</span>
                          <button onClick={() => blockTime(time)} className="rounded-[10px] bg-paper px-4 py-2 text-[12px] font-bold text-ink/60 hover:bg-ink hover:text-white">Blokuoti</button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid gap-8">
            <section id="registracijos" className="scroll-mt-28 rounded-[24px] border border-ink/5 bg-white p-6 shadow-sm">
              <h2 className="font-display text-[20px] font-extrabold tracking-tight">Aktyvios užklausos</h2>
              <div className="mt-4 grid gap-3">
                {registrationsForDate.length ? registrationsForDate.map((reg) => {
                  const client = getClient(reg.clientId);
                  if (!client) return null;
                  return (
                    <article key={reg.id} className="rounded-[16px] border border-ink/5 bg-paper p-4 transition hover:border-ink/20">
                      <div className="flex justify-between items-start">
                        <button onClick={() => openClient(client.id, reg.id)} className="font-bold text-[15px] hover:text-forest">{client.name}</button>
                        <span className={`rounded-[8px] px-2 py-1 text-[11px] font-bold ${getStatusClass(reg.status)}`}>{reg.status}</span>
                      </div>
                      <div className="mt-1 text-[12px] text-ink/60 font-medium">{reg.date} · {reg.time}</div>
                      <div className="mt-3 text-[13px] font-medium">{reg.service}</div>
                    </article>
                  );
                }) : <div className="text-[13px] text-ink/50 font-medium">Šią dieną užklausų nėra.</div>}
              </div>
            </section>

            <section id="klientai" className="scroll-mt-28 rounded-[24px] border border-ink/5 bg-white p-6 shadow-sm">
              <h2 className="font-display text-[20px] font-extrabold tracking-tight">Klientų bazė</h2>
              <div className="mt-4 flex flex-col gap-2 max-h-[400px] overflow-y-auto pr-2">
                {state.clients.filter(matchStatus).map((client) => (
                  <button key={client.id} onClick={() => openClient(client.id)} className={`text-left rounded-[16px] border p-4 transition ${selectedClientId === client.id ? "border-lime bg-lime/10" : "border-ink/5 bg-paper hover:border-ink/20"}`}>
                    <div className="font-bold text-[14px]">{client.name}</div>
                    <div className="text-[12px] text-ink/60 mt-1">{client.packageName}</div>
                  </button>
                ))}
              </div>
            </section>
          </div>
        </section>

        <section id="client-panel" className="scroll-mt-28 mt-8 rounded-[24px] border border-ink/5 bg-white p-6 shadow-sm lg:p-8">
          <div className="mb-6 border-b border-ink/5 pb-6 lg:flex lg:justify-between lg:items-end">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-ink/40">Detalizuotas kliento profilis</p>
              <h2 className="mt-1 font-display text-[28px] font-extrabold tracking-tight">{selectedClient?.name || "Nepasirinkta"}</h2>
            </div>
            {selectedClient && (
              <div className="mt-4 flex gap-2 lg:mt-0">
                <button onClick={() => updateClient(selectedClient.id, { status: "Patvirtinta" })} className="rounded-[12px] bg-forest px-4 py-2.5 text-[13px] font-bold text-white shadow-sm hover:bg-ink">Patvirtinti bendradarbiavimą</button>
                <button onClick={exportWorkoutPlanToPdf} className="rounded-[12px] bg-lime px-4 py-2.5 text-[13px] font-bold text-forest shadow-sm hover:brightness-95">PDF programa</button>
              </div>
            )}
          </div>

          {selectedClient ? (
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="text-[12px] font-bold text-ink/60">Vardas <input value={selectedClient.name} onChange={(e) => updateClient(selectedClient.id, { name: e.target.value })} className="mt-1 block w-full rounded-[12px] border border-ink/10 bg-paper p-3 text-[14px] font-medium text-ink focus:border-forest focus:ring-1 focus:ring-forest outline-none"/></label>
                  <label className="text-[12px] font-bold text-ink/60">Telefonas <input value={selectedClient.phone} onChange={(e) => updateClient(selectedClient.id, { phone: e.target.value })} className="mt-1 block w-full rounded-[12px] border border-ink/10 bg-paper p-3 text-[14px] font-medium text-ink focus:border-forest focus:ring-1 focus:ring-forest outline-none"/></label>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="text-[12px] font-bold text-ink/60">Statusas 
                    <select value={selectedClient.status} onChange={(e) => updateClient(selectedClient.id, { status: e.target.value })} className="mt-1 block w-full rounded-[12px] border border-ink/10 bg-paper p-3 text-[14px] font-medium text-ink focus:border-forest focus:ring-1 focus:ring-forest outline-none">
                      {statuses.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </label>
                  <label className="text-[12px] font-bold text-ink/60">Paslauga 
                    <select value={selectedClient.packageName} onChange={(e) => updateClient(selectedClient.id, { packageName: e.target.value })} className="mt-1 block w-full rounded-[12px] border border-ink/10 bg-paper p-3 text-[14px] font-medium text-ink focus:border-forest focus:ring-1 focus:ring-forest outline-none">
                      {services.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </label>
                </div>
                <label className="block text-[12px] font-bold text-ink/60">Pirminis tikslas <textarea value={selectedClient.goal} onChange={(e) => updateClient(selectedClient.id, { goal: e.target.value })} rows="3" className="mt-1 block w-full rounded-[12px] border border-ink/10 bg-paper p-3 text-[14px] font-medium text-ink focus:border-forest focus:ring-1 focus:ring-forest outline-none"/></label>
              </div>

              <div className="space-y-4">
                <label className="block text-[12px] font-bold text-rose-700">Sveikatos apribojimai ir traumos <textarea value={selectedClient.health} onChange={(e) => updateClient(selectedClient.id, { health: e.target.value })} rows="3" className="mt-1 block w-full rounded-[12px] border border-rose-200 bg-rose-50 p-3 text-[14px] font-medium text-rose-900 focus:border-rose-400 focus:ring-1 focus:ring-rose-400 outline-none"/></label>
                <label className="block text-[12px] font-bold text-ink/60">Trenerio pastabos (Vidinė inf.) <textarea value={selectedClient.notes} onChange={(e) => updateClient(selectedClient.id, { notes: e.target.value })} rows="5" className="mt-1 block w-full rounded-[12px] border border-ink/10 bg-paper p-3 text-[14px] font-medium text-ink focus:border-forest focus:ring-1 focus:ring-forest outline-none"/></label>
              </div>
            </div>
          ) : <div className="text-[14px] text-ink/50 font-medium">Pasirinkite klientą, kad matytumėte jo detales.</div>}

          {selectedClient && (
            <div id="programos" className="scroll-mt-28 mt-8 rounded-[20px] border border-ink/5 bg-paper p-6">
              <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h3 className="font-display text-[22px] font-extrabold tracking-tight">Sporto programos sudarymas (Builder)</h3>
                  <p className="text-[13px] text-ink/60 font-medium mt-1">Sukurkite profesionalią programą ir išsaugokite ją kaip PDF failą.</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={addWorkoutDay} className="rounded-[10px] bg-white border border-ink/10 px-4 py-2 text-[12px] font-bold shadow-sm hover:bg-ink/5">+ Nauja diena</button>
                  <button onClick={exportWorkoutPlanToPdf} className="rounded-[10px] bg-lime px-4 py-2 text-[12px] font-bold text-forest shadow-sm">Generuoti PDF</button>
                </div>
              </div>

              <div className="mb-6 flex gap-2 border-b border-ink/10 pb-4">
                {[["settings", "Nustatymai ir parametrai"], ["days", "Treniruočių turinys"], ["preview", "Dokumento peržiūra"]].map(([id, label]) => (
                  <button key={id} onClick={() => setProgramView(id)} className={`rounded-[10px] px-4 py-2 text-[13px] font-bold transition ${programView === id ? "bg-forest text-white" : "bg-white border border-ink/10 text-ink/70"}`}>
                    {label}
                  </button>
                ))}
              </div>

              {programView === "settings" && (
                <div className="space-y-6">
                  <div className="grid gap-3 lg:grid-cols-3">
                    {programTemplates.map((t) => (
                      <button key={t.id} onClick={() => applyProgramTemplate(t.id)} className={`text-left rounded-[16px] p-4 transition border ${programPreset === t.id ? "bg-lime/10 border-lime" : "bg-white border-ink/10 hover:border-ink/30"}`}>
                        <strong className="block text-[14px]">{t.label}</strong>
                        <span className="block mt-1 text-[12px] text-ink/60">{t.description}</span>
                      </button>
                    ))}
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <label className="text-[11px] font-bold text-ink/50 uppercase tracking-wider">Programos pavadinimas <input value={selectedWorkoutPlan.title} onChange={(e) => updateSelectedWorkoutPlan({ title: e.target.value })} className="mt-1 block w-full rounded-[10px] border border-ink/10 p-2.5 text-[13px] font-bold text-ink outline-none"/></label>
                    <label className="text-[11px] font-bold text-ink/50 uppercase tracking-wider">Tikslas <input value={selectedWorkoutPlan.goal} onChange={(e) => updateSelectedWorkoutPlan({ goal: e.target.value })} className="mt-1 block w-full rounded-[10px] border border-ink/10 p-2.5 text-[13px] font-bold text-ink outline-none"/></label>
                    <label className="text-[11px] font-bold text-ink/50 uppercase tracking-wider">Sistemos tipas <input value={selectedWorkoutPlan.system} onChange={(e) => updateSelectedWorkoutPlan({ system: e.target.value })} className="mt-1 block w-full rounded-[10px] border border-ink/10 p-2.5 text-[13px] font-bold text-ink outline-none"/></label>
                  </div>
                </div>
              )}

              {programView === "days" && (
                <div className="space-y-6">
                  {selectedWorkoutPlan.days.map((day, dayIndex) => (
                    <div key={dayIndex} className="rounded-[16px] border border-ink/10 bg-white shadow-sm overflow-hidden">
                      <div className="bg-ink/[0.02] p-4 border-b border-ink/10 flex justify-between items-start gap-4">
                        <div className="flex-1 grid gap-3 sm:grid-cols-2">
                           <label className="text-[11px] font-bold text-ink/50">Dienos pavadinimas <input value={day.title} onChange={(e) => updateWorkoutDay(dayIndex, { title: e.target.value })} className="mt-1 block w-full rounded-[8px] border border-ink/10 p-2 text-[13px] font-bold outline-none"/></label>
                           <label className="text-[11px] font-bold text-ink/50">Fokusas <input value={day.focus} onChange={(e) => updateWorkoutDay(dayIndex, { focus: e.target.value })} className="mt-1 block w-full rounded-[8px] border border-ink/10 p-2 text-[13px] font-bold outline-none"/></label>
                        </div>
                        <div className="flex gap-1">
                          <button onClick={() => addWorkoutExercise(dayIndex)} className="rounded-[8px] bg-lime px-3 py-1.5 text-[11px] font-bold text-forest">Pratimas</button>
                          <button onClick={() => removeWorkoutDay(dayIndex)} className="rounded-[8px] bg-rose-50 px-3 py-1.5 text-[11px] font-bold text-rose-700 hover:bg-rose-100">X</button>
                        </div>
                      </div>
                      <div className="p-4 space-y-3">
                        {day.exercises.map((ex, exIndex) => (
                          <div key={exIndex} className="grid sm:grid-cols-[60px_1fr_120px_120px] gap-3 items-center bg-paper p-3 rounded-[12px] border border-ink/5">
                            <input value={ex.id} onChange={(e) => updateWorkoutExercise(dayIndex, exIndex, { id: e.target.value })} className="w-full rounded-[6px] border border-ink/10 p-2 text-[12px] font-bold font-mono text-center"/>
                            <input value={ex.name} onChange={(e) => updateWorkoutExercise(dayIndex, exIndex, { name: e.target.value })} className="w-full rounded-[6px] border border-ink/10 p-2 text-[13px] font-bold" placeholder="Pratimo pavadinimas"/>
                            <input value={ex.setsReps} onChange={(e) => updateWorkoutExercise(dayIndex, exIndex, { setsReps: e.target.value })} className="w-full rounded-[6px] border border-ink/10 p-2 text-[12px] font-medium" placeholder="Serijos x Pakart."/>
                            <button onClick={() => removeWorkoutExercise(dayIndex, exIndex)} className="text-[11px] font-bold text-rose-600 hover:underline text-right">Šalinti</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {programView === "preview" && (
                <div className="rounded-[16px] bg-ink/5 p-4 text-center">
                  <p className="text-[14px] text-ink/70 font-medium mb-4">Peržiūrėkite galutinį dokumentą taip, kaip jį matys klientas.</p>
                  <button onClick={exportWorkoutPlanToPdf} className="rounded-[12px] bg-forest px-6 py-3 text-[14px] font-bold text-white shadow-md">Atidaryti ir išsaugoti PDF</button>
                </div>
              )}
            </div>
          )}
        </section>
      </div>

      {toast && <div className="fixed bottom-6 right-6 z-50 rounded-[14px] bg-forest px-6 py-4 text-[14px] font-bold text-white shadow-xl animate-fade-in">{toast}</div>}
    </main>
  );
}