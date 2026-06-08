import React, { useMemo, useState } from "react";

const css = `
*{box-sizing:border-box}body{margin:0;background:#f7f8f5;font-family:Inter,Arial,sans-serif;color:#111827}.wrap{width:min(1320px,calc(100% - 40px));margin:auto}.head{background:rgba(251,252,248,.86);backdrop-filter:blur(18px);border-bottom:1px solid rgba(17,24,39,.1);padding:26px 20px;position:sticky;top:0;z-index:10}.row{display:flex;justify-content:space-between;gap:20px;align-items:center}h1,h2,h3,p{margin:0}h1{font-size:34px;letter-spacing:-.055em}.muted{color:#667085}.content{padding:30px 0}.filters{display:grid;grid-template-columns:190px 210px 1fr;gap:12px;margin-bottom:18px}.input,.select,.textarea{width:100%;border:1px solid rgba(17,24,39,.1);border-radius:16px;padding:13px 14px;background:white;outline:none}.textarea{min-height:118px;resize:vertical}.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:20px}.stat{background:white;border:1px solid rgba(17,24,39,.1);border-radius:24px;padding:18px;box-shadow:0 20px 60px rgba(16,24,40,.05)}.stat b{font-size:34px;letter-spacing:-.055em}.stat span{display:block;margin-top:5px;color:#667085;font-size:13px;font-weight:800}.layout{display:grid;grid-template-columns:1.08fr .92fr;gap:20px}.panel{background:white;border:1px solid rgba(17,24,39,.1);border-radius:28px;overflow:hidden;box-shadow:0 24px 80px rgba(16,24,40,.06)}.panel-title{padding:18px 20px;border-bottom:1px solid rgba(17,24,39,.1);background:#fbfcf8}.grid{display:grid;grid-template-columns:92px 1fr}.time{background:#f3f5ef;font-weight:900;padding:16px 13px;border-bottom:1px solid rgba(17,24,39,.1);text-align:center;font-size:14px;color:#667085}.slot{min-height:88px;padding:10px;border-bottom:1px solid rgba(17,24,39,.1);background:white;display:flex;align-items:center}.session{width:100%;border-radius:16px;padding:13px 14px;background:#ecffd1;border:1px solid #b7f34a;display:flex;align-items:center;justify-content:space-between;gap:12px}.blocked{width:100%;border-radius:16px;padding:13px 14px;background:#fff7ed;border:1px solid #fed7aa;color:#9a3412;font-weight:800}.empty-slot{display:flex;width:100%;align-items:center;justify-content:space-between;gap:10px;color:#98a2b3;font-size:13px}.btn{border:0;border-radius:999px;background:#102015;color:white;padding:10px 14px;font-size:12px;font-weight:900;cursor:pointer}.btn.light{background:#f3f5ef;color:#111827}.btn.lime{background:#c8ff55;color:#102015}.btn.red{background:#fee2e2;color:#991b1b}.link-btn{border:0;background:transparent;padding:0;cursor:pointer;text-align:left;color:#111827;font-weight:900}.link-btn:hover{text-decoration:underline}.badge{border-radius:999px;padding:5px 10px;font-size:12px;font-weight:900;display:inline-flex;align-items:center;gap:5px}.badge.new{background:#dbeafe;color:#1d4ed8}.badge.wait{background:#fef3c7;color:#92400e}.badge.ok{background:#dcfce7;color:#166534}.badge.cancel{background:#fee2e2;color:#991b1b}.badge.inquiry{background:#eef2ff;color:#4338ca}.side{display:grid;gap:18px}.visit{border:1px solid rgba(17,24,39,.1);border-radius:20px;padding:15px;background:white;margin-bottom:12px}.health-alert{background:#fef2f2;border:1px solid #fee2e2;padding:10px;border-radius:12px;color:#991b1b;font-size:13px;margin-top:8px;font-weight:bold}.client-list{display:grid;gap:10px;padding:15px}.client-card{width:100%;border:1px solid rgba(17,24,39,.1);background:white;border-radius:18px;padding:14px;text-align:left;cursor:pointer}.client-card.active{border-color:#b7f34a;background:#f4ffd8}.client-card:hover{border-color:#b7f34a}.manager{padding:18px}.manager-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:14px}.timeline{display:grid;gap:8px;margin-top:14px}.mini-session{border:1px solid rgba(17,24,39,.1);border-radius:16px;padding:12px;background:#fbfcf8}.actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px}@media(max-width:980px){.layout{grid-template-columns:1fr}.stats{grid-template-columns:repeat(2,1fr)}.filters{grid-template-columns:1fr}.manager-grid{grid-template-columns:1fr}}
`;

const initialSessions = [
  {
    id: 1,
    client: "Mantas Kazlauskas",
    phone: "+370 600 11223",
    email: "mantas@example.lt",
    service: "Individuali treniruotė (60 min.)",
    date: "2026-06-08",
    time: "07:00",
    activity: "Žemas",
    health: "Išvarža juosmens srityje, vengti sunkių mirties traukų.",
    goal: "Sustiprinti nugarą ir pagerinti laikyseną.",
    status: "Nauja",
    plan: "2–3 treniruotės per savaitę. Pirmas etapas: technika, core stabilumas, tempimo rutina.",
  },
  {
    id: 2,
    client: "Aistė Petrauskė",
    phone: "+370 611 44556",
    email: "aiste@example.lt",
    service: "Treniruočių abonementas",
    date: "2026-06-08",
    time: "09:00",
    activity: "Vidutinis",
    health: "Kelio diskomfortas po ilgesnio bėgimo.",
    goal: "Svorio mažinimas ir reguliarus sportavimo ritmas.",
    status: "Laukia patvirtinimo",
    plan: "Siūlomas grafikas: I / III / V po darbo. Prioritetas – jėga, žingsniai, mitybos ritmas.",
  },
  {
    id: 3,
    client: "Rokas Jankauskas",
    phone: "+370 622 77889",
    email: "rokas@example.lt",
    service: "Treniruočių planas",
    date: "2026-06-08",
    time: "11:00",
    activity: "Aukštas",
    health: "Apribojimų nenurodė.",
    goal: "Jėgos programa sporto salei 4 kartus per savaitę.",
    status: "Užklausa",
    plan: "Parengti 4 savaičių jėgos ciklą. Pritaikyti pagal turimą salės įrangą.",
  },
  {
    id: 4,
    client: "Greta Milašiūtė",
    phone: "+370 633 99887",
    email: "greta@example.lt",
    service: "Nuotolinė priežiūra",
    date: "2026-06-08",
    time: "14:00",
    activity: "Žemas",
    health: "Po nėštumo, reikia švelnaus krūvio didinimo.",
    goal: "Grįžimas į sportą ir energijos gerinimas.",
    status: "Patvirtinta",
    plan: "Pradžia nuo 2 lengvų treniruočių per savaitę. Savaitinis check-in sekmadieniais.",
  },
  {
    id: 5,
    client: "Tomas Valaitis",
    phone: "+370 644 10101",
    email: "tomas@example.lt",
    service: "Mitybos konsultacija",
    date: "2026-06-08",
    time: "18:00",
    activity: "Vidutinis",
    health: "Alergijų nenurodė.",
    goal: "Susidėlioti paprastą mitybos ritmą be griežtos dietos.",
    status: "Nauja",
    plan: "Pirmas žingsnis – 7 dienų mitybos dienoraštis ir baltymų / vandens įpročių peržiūra.",
  },
  {
    id: 6,
    client: "Karolina Šimkutė",
    phone: "+370 655 20202",
    email: "karolina@example.lt",
    service: "Individuali treniruotė (60 min.)",
    date: "2026-06-09",
    time: "08:00",
    activity: "Vidutinis",
    health: "Peties įtampa spaudimo judesiuose.",
    goal: "Išmokti taisyklingos technikos ir saugiai sportuoti.",
    status: "Laukia patvirtinimo",
    plan: "Įvertinti peties judesį, pradėti nuo traukos / stabilizacijos pratimų.",
  },
  {
    id: 7,
    client: "Darius Petrauskas",
    phone: "+370 666 30303",
    email: "darius@example.lt",
    service: "Treniruočių abonementas",
    date: "2026-06-09",
    time: "17:00",
    activity: "Žemas",
    health: "Sėdimas darbas, nugaros įtampa vakare.",
    goal: "Sustiprėti ir sumažinti nugaros įtampą.",
    status: "Patvirtinta",
    plan: "2 treniruotės per savaitę. Prioritetas – mobilumas, kojos, core, lėtas krūvio didinimas.",
  },
];

const blockedDefaults = [
  { id: "b1", date: "2026-06-08", time: "12:00", reason: "Pietų pertrauka" },
  { id: "b2", date: "2026-06-08", time: "16:00", reason: "Treneris užimtas" },
];

const times = ["06:30", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"];
const statuses = ["Nauja", "Laukia patvirtinimo", "Patvirtinta", "Užklausa", "Atšaukta"];

function badgeClass(status) {
  if (status === "Nauja") return "badge new";
  if (status === "Laukia patvirtinimo") return "badge wait";
  if (status === "Patvirtinta") return "badge ok";
  if (status === "Užklausa") return "badge inquiry";
  if (status === "Atšaukta") return "badge cancel";
  return "badge";
}

export default function TrainerAdmin() {
  const [sessions, setSessions] = useState(initialSessions);
  const [blocked, setBlocked] = useState(blockedDefaults);
  const [date, setDate] = useState("2026-06-08");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Visos būsenos");
  const [selectedClientId, setSelectedClientId] = useState(initialSessions[0].id);

  const filteredSessions = useMemo(() => {
    const q = search.trim().toLowerCase();

    return sessions
      .filter((session) => statusFilter === "Visos būsenos" || session.status === statusFilter)
      .filter((session) => {
        if (!q) return true;
        return [session.client, session.phone, session.email, session.service, session.goal]
          .join(" ")
          .toLowerCase()
          .includes(q);
      });
  }, [sessions, search, statusFilter]);

  const selectedClient = sessions.find((session) => session.id === selectedClientId) || sessions[0];
  const daySessions = filteredSessions.filter((session) => session.date === date);

  const stats = [
    [daySessions.length, "Treniruotės / užklausos pagal filtrą"],
    [sessions.filter((session) => session.status === "Nauja").length, "Naujos užklausos"],
    [sessions.filter((session) => session.status === "Laukia patvirtinimo").length, "Laukia patvirtinimo"],
    [sessions.filter((session) => session.status === "Patvirtinta").length, "Aktyvūs klientai"],
  ];

  function updateClient(id, field, value) {
    setSessions((current) =>
      current.map((session) => (session.id === id ? { ...session, [field]: value } : session))
    );
  }

  function moveClient(id, newDate, newTime) {
    setSessions((current) =>
      current.map((session) =>
        session.id === id ? { ...session, date: newDate ?? session.date, time: newTime ?? session.time } : session
      )
    );
  }

  function blockTime(time) {
    const exists = blocked.some((block) => block.date === date && block.time === time);
    if (exists) return;

    setBlocked((current) => [
      ...current,
      { id: `b-${Date.now()}`, date, time, reason: "Treneris užimtas" },
    ]);
  }

  function unblockTime(id) {
    setBlocked((current) => current.filter((block) => block.id !== id));
  }

  return (
    <main>
      <style>{css}</style>
      <header className="head">
        <div className="wrap row">
          <div>
            <h1>Trenerio valdymo skydas</h1>
            <p className="muted">Registracijos, užklausos, aktyvūs klientai ir dienos užimtumas.</p>
          </div>
          <button className="btn light" type="button" onClick={() => window.location.assign("/")}>Grįžti į svetainę</button>
        </div>
      </header>

      <section className="wrap content">
        <div className="filters">
          <input className="input" type="date" value={date} onChange={(event) => setDate(event.target.value)} />
          <select className="select" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option>Visos būsenos</option>
            {statuses.map((status) => <option key={status}>{status}</option>)}
          </select>
          <input className="input" placeholder="Ieškoti kliento, telefono, paslaugos arba tikslo..." value={search} onChange={(event) => setSearch(event.target.value)} />
        </div>

        <div className="stats">
          {stats.map(([value, label]) => (
            <div className="stat" key={label}>
              <b>{value}</b>
              <span>{label}</span>
            </div>
          ))}
        </div>

        <div className="layout">
          <div className="panel">
            <div className="panel-title">
              <h3>Dienos grafikas</h3>
              <p className="muted" style={{ marginTop: 4 }}>{date}</p>
            </div>

            <div className="grid">
              <div className="time" style={{ textTransform: "uppercase", letterSpacing: ".15em" }}>Laikas</div>
              <div className="time" style={{ textTransform: "uppercase", letterSpacing: ".15em", textAlign: "left" }}>Užimtumas</div>

              {times.map((time) => {
                const session = daySessions.find((item) => item.time === time && item.status !== "Atšaukta");
                const block = blocked.find((item) => item.date === date && item.time === time);

                return (
                  <React.Fragment key={time}>
                    <div className="time">{time}</div>
                    <div className="slot">
                      {session ? (
                        <div className="session">
                          <div>
                            <button className="link-btn" type="button" onClick={() => setSelectedClientId(session.id)}>
                              {session.client}
                            </button>
                            <div style={{ fontSize: 13, color: "#667085", marginTop: 3 }}>{session.service}</div>
                            <span className={badgeClass(session.status)} style={{ marginTop: 8 }}>{session.status}</span>
                          </div>
                          <button className="btn light" type="button" onClick={() => setSelectedClientId(session.id)}>Valdyti</button>
                        </div>
                      ) : block ? (
                        <div className="blocked">
                          {block.reason}
                          <button className="btn light" type="button" style={{ marginLeft: 10 }} onClick={() => unblockTime(block.id)}>Atlaisvinti</button>
                        </div>
                      ) : (
                        <div className="empty-slot">
                          <span>Laisva valanda</span>
                          <button className="btn light" type="button" onClick={() => blockTime(time)}>Blokuoti</button>
                        </div>
                      )}
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          <div className="side">
            <div className="panel">
              <div className="panel-title">
                <h3>Aktyvūs klientai</h3>
                <p className="muted" style={{ marginTop: 4 }}>Paspausk klientą, kad galėtum valdyti jo registraciją ir planą.</p>
              </div>

              <div className="client-list">
                {filteredSessions.map((session) => (
                  <button
                    key={session.id}
                    type="button"
                    className={`client-card ${selectedClient?.id === session.id ? "active" : ""}`}
                    onClick={() => setSelectedClientId(session.id)}
                  >
                    <div className="row" style={{ alignItems: "flex-start" }}>
                      <div>
                        <strong>{session.client}</strong>
                        <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>{session.service}</div>
                        <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>{session.date} · {session.time}</div>
                      </div>
                      <span className={badgeClass(session.status)}>{session.status}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {selectedClient && (
              <div className="panel">
                <div className="panel-title">
                  <h3>Kliento valdymas</h3>
                  <p className="muted" style={{ marginTop: 4 }}>{selectedClient.client}</p>
                </div>

                <div className="manager">
                  <div className="manager-grid">
                    <input className="input" value={selectedClient.client} onChange={(event) => updateClient(selectedClient.id, "client", event.target.value)} />
                    <input className="input" value={selectedClient.phone} onChange={(event) => updateClient(selectedClient.id, "phone", event.target.value)} />
                    <input className="input" value={selectedClient.email} onChange={(event) => updateClient(selectedClient.id, "email", event.target.value)} />
                    <select className="select" value={selectedClient.status} onChange={(event) => updateClient(selectedClient.id, "status", event.target.value)}>
                      {statuses.map((status) => <option key={status}>{status}</option>)}
                    </select>
                    <input className="input" type="date" value={selectedClient.date} onChange={(event) => moveClient(selectedClient.id, event.target.value, null)} />
                    <select className="select" value={selectedClient.time} onChange={(event) => moveClient(selectedClient.id, null, event.target.value)}>
                      {times.map((time) => <option key={time}>{time}</option>)}
                    </select>
                  </div>

                  <div style={{ marginTop: 14 }}>
                    <label style={{ fontSize: 12, fontWeight: 900, color: "#667085", textTransform: "uppercase", letterSpacing: ".12em" }}>Tikslas</label>
                    <textarea className="textarea" value={selectedClient.goal} onChange={(event) => updateClient(selectedClient.id, "goal", event.target.value)} />
                  </div>

                  <div className="health-alert">
                    ⚠️ Traumų / apribojimų informacija: {selectedClient.health}
                  </div>

                  <div style={{ marginTop: 14 }}>
                    <label style={{ fontSize: 12, fontWeight: 900, color: "#667085", textTransform: "uppercase", letterSpacing: ".12em" }}>Treniruočių planas / trenerio pastabos</label>
                    <textarea className="textarea" value={selectedClient.plan} onChange={(event) => updateClient(selectedClient.id, "plan", event.target.value)} />
                  </div>

                  <div className="actions">
                    <button className="btn lime" type="button" onClick={() => updateClient(selectedClient.id, "status", "Patvirtinta")}>Patvirtinti</button>
                    <button className="btn light" type="button" onClick={() => updateClient(selectedClient.id, "status", "Laukia patvirtinimo")}>Laukia patvirtinimo</button>
                    <button className="btn red" type="button" onClick={() => updateClient(selectedClient.id, "status", "Atšaukta")}>Atšaukti</button>
                  </div>
                </div>
              </div>
            )}

            <div className="panel">
              <div className="panel-title"><h3>Saugumo anketos</h3></div>
              <div style={{ padding: 15 }}>
                {filteredSessions.map((session) => (
                  <div className="visit" key={session.id}>
                    <div className="row" style={{ alignItems: "flex-start" }}>
                      <button className="link-btn" type="button" onClick={() => setSelectedClientId(session.id)}>{session.client}</button>
                      <span className={badgeClass(session.status)}>{session.status}</span>
                    </div>
                    <div style={{ fontSize: 13, color: "#667085", margin: "5px 0" }}>{session.service} · {session.date} {session.time}</div>
                    <div style={{ fontSize: 13, margin: "8px 0" }}>🏃‍♂️ <b>Aktyvumas:</b> {session.activity}</div>
                    <div className="health-alert">⚠️ TRAUMOS / APRIBOJIMAI: {session.health}</div>
                    <div style={{ fontSize: 13, marginTop: 8, color: "#344054" }}>🎯 <b>Tikslas:</b> {session.goal}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
