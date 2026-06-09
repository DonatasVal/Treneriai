import { useMemo, useState } from "react";

// 1. Švarus paslaugų sąrašas pagal tavo dizainą
const services = [
  { id: "one", title: "Individuali treniruotė", meta: "35 € · 60 min. · Asmeninis darbas 1:1", durationMin: 60 },
  { id: "sub", title: "Treniruočių abonementas", meta: "nuo 120 € · mėn. · Reguliarus sportavimas", durationMin: 60 },
  { id: "plan", title: "Treniruočių planas", meta: "89 € · 4 savaitės · Sporto salei arba namams", durationMin: 0 },
  { id: "online", title: "Nuotolinė priežiūra", meta: "129 € · mėn. · Plano korekcijos ir palaikymas", durationMin: 0 },
  { id: "food", title: "Mitybos konsultacija", meta: "45 € · 45 min. · Praktiškai ir be kraštutinumų", durationMin: 45 }
];

// GRIEŽTAS 60 MINUČIŲ INTERVALAS (Kaip sutarėme – jokių pusvalandinių nuokrypių)
const ALL_POSSIBLE_SLOTS = [
  "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", 
  "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"
];

// Užimtų laikų simuliacija.
// Modelis artimesnis realiai DB struktūrai: data, start, trukmė, statusas, treneris ir lokacija.
const existingSessions = [
  {
    id: "s1",
    date: "2026-06-08",
    start: "10:00",
    durationMin: 60,
    status: "confirmed",
    trainerId: "trainer-main",
    locationId: "main-gym",
    timeZone: "Europe/Vilnius",
  },
  {
    id: "s2",
    date: "2026-06-08",
    start: "17:00",
    durationMin: 60,
    status: "confirmed",
    trainerId: "trainer-main",
    locationId: "main-gym",
    timeZone: "Europe/Vilnius",
  }
];

const NON_BLOCKING_SESSION_STATUSES = ["cancelled", "rejected", "Atšaukta", "Atmestas"];

function timeToMinutes(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function rangesOverlap(startA, endA, startB, endB) {
  return Math.max(startA, startB) < Math.min(endA, endB);
}

function isSlotAvailable({ date, time, durationMin, sessions, trainerId = "trainer-main", locationId = "main-gym" }) {
  if (!durationMin || durationMin <= 0) return true;

  const start = timeToMinutes(time);
  const end = start + durationMin;

  return !sessions.some((session) => {
    if (session.date !== date) return false;
    if (session.trainerId && session.trainerId !== trainerId) return false;
    if (session.locationId && session.locationId !== locationId) return false;
    if (NON_BLOCKING_SESSION_STATUSES.includes(session.status)) return false;

    const sessionStart = timeToMinutes(session.start || session.time);
    const sessionEnd = sessionStart + session.durationMin;

    return rangesOverlap(start, end, sessionStart, sessionEnd);
  });
}

const css = `
  .reg-container { max-width: 1100px; margin: 40px auto; background: #fbfbf9; border-radius: 32px; padding: 40px; font-family: Inter, Arial, sans-serif; color: #111827; box-shadow: 0 20px 50px rgba(0,0,0,0.04); }
  .reg-title { font-size: 36px; font-weight: 850; margin: 0 0 6px 0; letter-spacing: -0.04em; }
  .reg-sub { color: #667085; font-size: 15px; margin-bottom: 32px; }
  .reg-grid { display: grid; grid-template-columns: 1fr 1.1fr; gap: 40px; }
  .section-title { font-size: 20px; font-weight: 800; margin: 0 0 18px 0; letter-spacing: -0.02em; }
  
  /* Kairė pusė: Paslaugos */
  .service-list { display: flex; flex-direction: column; gap: 12px; }
  .service-card { background: white; border: 1px solid rgba(17,24,39,0.08); border-radius: 20px; padding: 20px; text-align: left; cursor: pointer; transition: 0.2s; }
  .service-card:hover { transform: translateY(-2px); border-color: rgba(17,24,39,0.15); }
  .service-card.active { background: #f4fbe9; border: 2px solid #b7f34a; }
  .service-name { font-size: 17px; font-weight: 800; margin: 0 0 6px 0; }
  .service-meta { color: #667085; font-size: 14px; }
  
  /* Dešinė pusė: Laikai ir Forma */
  .slots-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
  .slots-badge { background: #e8f7cc; color: #3b6110; font-size: 12px; font-weight: 900; padding: 6px 12px; border-radius: 999px; }
  .time-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; margin-bottom: 24px; }
  .time-btn { background: white; border: 1px solid rgba(17,24,39,0.08); border-radius: 14px; padding: 14px 0; font-weight: 800; font-size: 15px; text-align: center; cursor: pointer; transition: 0.2s; }
  .time-btn:hover:not(:disabled) { border-color: #111827; }
  .time-btn.active { background: #111827; color: white; border-color: #111827; }
  .time-btn:disabled { background: #f3f4f1; color: #98a2b3; cursor: not-allowed; text-decoration: line-through; border-color: transparent; }
  
  /* Anketa */
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }
  .input-field { width: 100%; border: 1px solid rgba(17,24,39,0.08); background: white; border-radius: 16px; padding: 14px 16px; font-size: 15px; color: #111827; }
  .input-field::placeholder { color: #98a2b3; }
  .input-field:focus { outline: none; border-color: #111827; }
  .danger-border { border: 1px solid #fca5a5 !important; background: #fffbfa; }
  .submit-btn { width: 100%; background: #111827; color: white; border: 0; border-radius: 999px; padding: 16px; font-weight: 800; font-size: 16px; margin-top: 16px; cursor: pointer; transition: 0.2s; }
  .submit-btn:hover { background: #233027; transform: translateY(-2px); }
  .success-box { background: #e8f7cc; color: #2f4b18; padding: 24px; border-radius: 24px; text-align: center; font-weight: 800; }
`;

export default function TrainerRegistration() {
  const [selectedService, setSelectedService] = useState(services[0]);
  const [selectedDate, setSelectedDate] = useState("2026-06-08");
  const [selectedTime, setSelectedTime] = useState("");
  
  // Atnaujinta, gili kliento anketa saugumui užtikrinti
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [contactMethod, setContactMethod] = useState("Telefonu");
  const [email, setEmail] = useState("");
  const [activityLevel, setActivityLevel] = useState("");
  const [healthIssues, setHealthIssues] = useState("");
  const [goal, setGoal] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Filtruojame užimtus / persidengiančius laikus pagal datą, trukmę, statusą, trenerį ir lokaciją.
  const availableSlots = useMemo(() => {
    return ALL_POSSIBLE_SLOTS.map((slot) => ({
      time: slot,
      available: isSlotAvailable({
        date: selectedDate,
        time: slot,
        durationMin: selectedService.durationMin,
        sessions: existingSessions,
        trainerId: "trainer-main",
        locationId: "main-gym",
      }),
    }));
  }, [selectedDate, selectedService]);

  const activeSlotsCount = availableSlots.filter((slot) => slot.available).length;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && phone && healthIssues && activityLevel && selectedTime) {
      setIsSubmitted(true);
    }
  };

  return (
    <div className="reg-container">
      <style>{css}</style>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="reg-title">Registracija treniruotei</h1>
          <p className="reg-sub">Pasirink paslaugą, pageidaujamą laiką ir užpildyk saugumo anketą.</p>
        </div>
        <button style={{ background: '#f3f4f1', border: 0, width: 40, height: 40, borderRadius: '50%', fontSize: 20, cursor: 'pointer' }}>×</button>
      </div>

      {!isSubmitted ? (
        <form onSubmit={handleSubmit} className="reg-grid">
          
          {/* KAISRĖ PUSĖ: 1. Paslauga */}
          <div>
            <h2 className="section-title">1. Paslauga</h2>
            <div className="service-list">
              {services.map(s => (
                <div 
                  key={s.id} 
                  className={`service-card ${selectedService.id === s.id ? 'active' : ''}`}
                  onClick={() => { setSelectedService(s); setSelectedTime(""); }}
                >
                  <h3 className="service-name">{s.title}</h3>
                  <div className="service-meta">{s.meta}</div>
                </div>
              ))}
            </div>
          </div>

          {/* DEŠINĖ PUSĖ: 3. Pageidaujamas laikas ir anketa */}
          <div>
            <div className="slots-header">
              <h2 className="section-title" style={{ margin: 0 }}>3. Pageidaujamas laikas</h2>
              <span className="slots-badge">{activeSlotsCount} laikai laisvi</span>
            </div>
            
            <div style={{ marginBottom: 12 }}>
              <input
                className="input-field"
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setSelectedTime("");
                }}
              />
            </div>

            {/* VALANDINIS TINKLELIS (tikrinama pagal datą, statusą ir trukmę) */}
            <div className="time-grid">
              {availableSlots.map(slot => (
                <button
                  key={slot.time}
                  type="button"
                  disabled={!slot.available}
                  className={`time-btn ${selectedTime === slot.time ? 'active' : ''}`}
                  onClick={() => setSelectedTime(slot.time)}
                >
                  {slot.time}
                </button>
              ))}
            </div>

            {/* DUOMENYS IR SVEIKATOS ANKETA */}
            <h2 className="section-title">4. Kliento anketa</h2>
            
            <div className="form-row">
              <input className="input-field" placeholder="Vardas ir pavardė *" required value={name} onChange={e => setName(e.target.value)} />
              <input className="input-field" placeholder="Telefono numeris *" required value={phone} onChange={e => setPhone(e.target.value)} />
            </div>

            <div className="form-row">
              <select className="input-field" value={contactMethod} onChange={e => setContactMethod(e.target.value)}>
                <option value="Telefonu">Telefonu</option>
                <option value="Instagram">Instagram</option>
                <option value="El. paštu">El. paštu</option>
              </select>
              <input className="input-field" placeholder="El. paštas / Instagram" value={email} onChange={e => setEmail(e.target.value)} />
            </div>

            <div style={{ marginBottom: 12 }}>
              <select className="input-field" required value={activityLevel} onChange={e => setActivityLevel(e.target.value)}>
                <option value="">Koks jūsų fizinio aktyvumo lygis šiuo metu? *</option>
                <option value="Zemas">Žemas (Sėdimas darbas, nesportuoju)</option>
                <option value="Vidutinis">Vidutinis (Aktyviau pajudu 1–2 k. per savaitę)</option>
                <option value="Aukstas">Aukštas (Reguliariai lankau jėgos treniruotes)</option>
              </select>
            </div>

            {/* Kritinis saugumo laukelis */}
            <div style={{ marginBottom: 12 }}>
              <textarea 
                className="input-field danger-border" 
                rows="2"
                placeholder="SVARBU: Ar turite sveikatos sutrikimų, traumų ar gydytojo apribojimų? (Jei traumų nėra, įrašykite 'Nėra') *" 
                required 
                value={healthIssues} 
                onChange={e => setHealthIssues(e.target.value)} 
              />
            </div>

            <div>
              <textarea 
                className="input-field" 
                rows="2"
                placeholder="Tikslas: jėga, svorio mažinimas, laikysena, energija ar kita..." 
                value={goal} 
                onChange={e => setGoal(e.target.value)} 
              />
            </div>

            <button 
              type="submit" 
              className="submit-btn"
              disabled={!selectedTime || !name || !phone || !healthIssues || !activityLevel}
            >
              {!selectedTime ? "Pasirinkite laiką viršuje" : "Patvirtinti registraciją 📅"}
            </button>
          </div>

        </form>
      ) : (
        <div className="success-box">
          <h2>🎉 Registracija sėkmingai gauta!</h2>
          <p>Paslauga: {selectedService.title}<br />Data: {selectedDate}<br />Laikas: {selectedTime} val.<br />Sveikatos duomenys sėkmingai perduoti treneriui.</p>
        </div>
      )}
    </div>
  );
}