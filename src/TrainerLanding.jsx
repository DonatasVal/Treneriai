import { useState } from "react";

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

// Užimtų laikų simuliacija (Apsauga nuo persidengimų)
const existingSessions = [
  { time: "10:00", durationMin: 60 },
  { time: "17:00", durationMin: 60 }
];

const css = `
  .reg-container { max-width: 1100px; margin: 40px auto; background: #fbfbf9; border-radius: 32px; padding: 40px; font-family: Inter, Arial, sans-serif; color: #111827; box-shadow: 0 20px 50px rgba(0,0,0,0.04); }
  .reg-title { font-size: 36px; font-weight: 850; margin: 0 0 6px 0; letter-spacing: -0.04em; }
  .reg-sub { color: #667085; font-size: 15px; margin-bottom: 32px; }
  .reg-grid { display: grid; grid-template-columns: 1fr 1.1fr; gap: 40px; }
  .section-title { font-size: 20px; font-weight: 800; margin: 0 0 18px 0; letter-spacing: -0.02em; }

  /* Wizard */
  .wizard-bar { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; margin-bottom: 26px; }
  .wizard-step { border: 1px solid rgba(17,24,39,0.08); background: white; color: #667085; border-radius: 16px; padding: 12px; text-align: left; font-size: 12px; font-weight: 900; cursor: pointer; }
  .wizard-step.active { background: #111827; color: white; border-color: #111827; }
  .wizard-step.done { background: #e8f7cc; color: #3b6110; border-color: #b7f34a; }
  .wizard-layout { display: grid; grid-template-columns: 1fr 340px; gap: 24px; align-items: start; }
  .wizard-panel { background: white; border: 1px solid rgba(17,24,39,0.08); border-radius: 24px; padding: 24px; }
  .wizard-summary { background: #111827; color: white; border-radius: 24px; padding: 22px; position: sticky; top: 18px; }
  .wizard-summary h3 { margin: 0; font-size: 24px; letter-spacing: -0.04em; }
  .wizard-summary p { color: rgba(255,255,255,.68); font-size: 14px; line-height: 1.6; }
  .summary-line { display: flex; justify-content: space-between; gap: 12px; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,.12); font-size: 13px; }
  .summary-line span { color: rgba(255,255,255,.56); }
  .wizard-actions { display: flex; justify-content: space-between; gap: 12px; margin-top: 22px; }
  .secondary-btn { background: white; color: #111827; border: 1px solid rgba(17,24,39,0.10); border-radius: 999px; padding: 14px 20px; font-weight: 800; cursor: pointer; }
  .quick-goals { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 14px; }
  .quick-goal { border: 1px solid rgba(17,24,39,0.08); background: white; border-radius: 999px; padding: 10px 13px; font-size: 12px; font-weight: 900; cursor: pointer; }
  .quick-goal:hover { background: #e8f7cc; border-color: #b7f34a; }
  .field-hint { margin-top: 6px; color: #667085; font-size: 12px; font-weight: 700; line-height: 1.45; }

  /* Paslaugos */
  .service-list { display: flex; flex-direction: column; gap: 12px; }
  .service-card { background: white; border: 1px solid rgba(17,24,39,0.08); border-radius: 20px; padding: 20px; text-align: left; cursor: pointer; transition: 0.2s; }
  .service-card:hover { transform: translateY(-2px); border-color: rgba(17,24,39,0.15); }
  .service-card.active { background: #f4fbe9; border: 2px solid #b7f34a; }
  .service-name { font-size: 17px; font-weight: 800; margin: 0 0 6px 0; }
  .service-meta { color: #667085; font-size: 14px; }

  /* Laikai ir Forma */
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
  .submit-btn { background: #111827; color: white; border: 0; border-radius: 999px; padding: 14px 20px; font-weight: 800; font-size: 16px; cursor: pointer; transition: 0.2s; }
  .submit-btn:hover { background: #233027; transform: translateY(-2px); }
  .submit-btn:disabled { opacity: .52; cursor: not-allowed; transform: none; }
  .success-box { background: #e8f7cc; color: #2f4b18; padding: 24px; border-radius: 24px; text-align: center; font-weight: 800; }

  @media (max-width: 900px) {
    .reg-container { margin: 0; min-height: 100vh; border-radius: 0; padding: 22px; }
    .wizard-bar { grid-template-columns: 1fr 1fr; }
    .wizard-layout { grid-template-columns: 1fr; }
    .wizard-summary { position: static; }
    .form-row { grid-template-columns: 1fr; }
    .time-grid { grid-template-columns: repeat(2, 1fr); }
    .wizard-actions { position: sticky; bottom: -22px; margin: 22px -22px -22px; padding: 14px 22px 20px; background: linear-gradient(180deg, rgba(251,251,249,.76), #fbfbf9 40%); border-top: 1px solid rgba(17,24,39,.08); }
    .secondary-btn, .submit-btn { flex: 1; }
  }
`;

export default function TrainerRegistration() {
  const [selectedService, setSelectedService] = useState(services[0]);
  const [selectedTime, setSelectedTime] = useState("");
  const [step, setStep] = useState(0);

  // Atnaujinta, gili kliento anketa saugumui užtikrinti
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [contactMethod, setContactMethod] = useState("Telefonu");
  const [email, setEmail] = useState("");
  const [activityLevel, setActivityLevel] = useState("");
  const [healthIssues, setHealthIssues] = useState("");
  const [goal, setGoal] = useState("");
  const [preferredDays, setPreferredDays] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const requiresSchedule = selectedService.durationMin > 0;
  const steps = ["Tikslas", "Patirtis / saugumas", "Formatas", requiresSchedule ? "Laikas" : "Ritmas", "Kontaktai"];

  // Filtruojame užimtus/persidengiančius laikus pagal pasirinktą paslaugą
  const availableSlots = ALL_POSSIBLE_SLOTS.map(slot => {
    const startMins = parseInt(slot.split(":")[0]) * 60;
    const endMins = startMins + selectedService.durationMin;

    const isOverlap = existingSessions.some(s => {
      const sStart = parseInt(s.time.split(":")[0]) * 60;
      const sEnd = sStart + s.durationMin;
      return Math.max(startMins, sStart) < Math.min(endMins, sEnd);
    });

    return { time: slot, available: !isOverlap };
  });

  const activeSlotsCount = availableSlots.filter(s => s.available).length;

  const canContinue = () => {
    if (step === 0) return goal.trim();
    if (step === 1) return activityLevel && healthIssues.trim();
    if (step === 2) return selectedService;
    if (step === 3) return requiresSchedule ? selectedTime : preferredDays.trim() && preferredTime.trim();
    return name.trim() && phone.trim();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && phone && healthIssues && activityLevel && goal && (requiresSchedule ? selectedTime : preferredDays && preferredTime)) {
      setIsSubmitted(true);
    }
  };

  return (
    <div className="reg-container">
      <style>{css}</style>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="reg-title">Registracija treniruotei</h1>
          <p className="reg-sub">Pirma įvertiname tikslą, patirtį ir saugumą. Tada parenkame tinkamiausią formatą.</p>
        </div>
        <button style={{ background: '#f3f4f1', border: 0, width: 40, height: 40, borderRadius: '50%', fontSize: 20, cursor: 'pointer' }}>×</button>
      </div>

      {!isSubmitted ? (
        <form onSubmit={handleSubmit}>
          <div className="wizard-bar">
            {steps.map((label, index) => (
              <button
                key={label}
                type="button"
                className={`wizard-step ${step === index ? "active" : ""} ${step > index ? "done" : ""}`}
                onClick={() => setStep(index)}
              >
                {index + 1}. {label}
              </button>
            ))}
          </div>

          <div className="wizard-layout">
            <div className="wizard-panel">
              {step === 0 && (
                <>
                  <h2 className="section-title">1. Tikslas</h2>
                  <textarea
                    className="input-field"
                    rows="4"
                    placeholder="Tikslas: jėga, svorio mažinimas, laikysena, energija ar kita..."
                    value={goal}
                    onChange={e => setGoal(e.target.value)}
                    required
                  />

                  <div className="quick-goals">
                    {["Svorio mažinimas", "Jėga", "Laikysena", "Grįžimas po pertraukos"].map(item => (
                      <button key={item} type="button" className="quick-goal" onClick={() => setGoal(item)}>
                        {item}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {step === 1 && (
                <>
                  <h2 className="section-title">2. Patirtis / saugumas</h2>

                  <div style={{ marginBottom: 12 }}>
                    <select className="input-field" required value={activityLevel} onChange={e => setActivityLevel(e.target.value)}>
                      <option value="">Koks jūsų fizinio aktyvumo lygis šiuo metu? *</option>
                      <option value="Zemas">Žemas (Sėdimas darbas, nesportuoju)</option>
                      <option value="Vidutinis">Vidutinis (Aktyviau pajudu 1–2 k. per savaitę)</option>
                      <option value="Aukstas">Aukštas (Reguliariai lankau jėgos treniruotes)</option>
                    </select>
                  </div>

                  <div style={{ marginBottom: 12 }}>
                    <textarea 
                      className="input-field danger-border" 
                      rows="3"
                      placeholder="SVARBU: Ar turite sveikatos sutrikimų, traumų ar gydytojo apribojimų? (Jei traumų nėra, įrašykite 'Nėra') *" 
                      required 
                      value={healthIssues} 
                      onChange={e => setHealthIssues(e.target.value)} 
                    />
                    <div className="field-hint">Ši informacija padeda treneriui saugiau parinkti krūvį ir pratimų alternatyvas.</div>
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <h2 className="section-title">3. Rekomenduojamas formatas / paslauga</h2>
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
                </>
              )}

              {step === 3 && (
                <>
                  {requiresSchedule ? (
                    <>
                      <div className="slots-header">
                        <h2 className="section-title" style={{ margin: 0 }}>4. Pageidaujamas laikas</h2>
                        <span className="slots-badge">{activeSlotsCount} laikai laisvi</span>
                      </div>

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
                    </>
                  ) : (
                    <>
                      <h2 className="section-title">4. Pageidaujamas ritmas</h2>
                      <p className="reg-sub" style={{ marginBottom: 16 }}>
                        Šiai paslaugai konkretaus laiko rinktis nereikia. Po registracijos susisieksime aptarti plano ir laikų.
                      </p>
                      <div className="form-row">
                        <input className="input-field" placeholder="Kokiomis dienomis patogiausia? *" value={preferredDays} onChange={e => setPreferredDays(e.target.value)} />
                        <input className="input-field" placeholder="Rytais, dieną ar vakarais? *" value={preferredTime} onChange={e => setPreferredTime(e.target.value)} />
                      </div>
                    </>
                  )}
                </>
              )}

              {step === 4 && (
                <>
                  <h2 className="section-title">5. Kontaktai</h2>

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
                </>
              )}

              <div className="wizard-actions">
                <button type="button" className="secondary-btn" onClick={() => setStep(Math.max(step - 1, 0))}>
                  {step === 0 ? "Atgal" : "Atgal"}
                </button>

                {step < steps.length - 1 ? (
                  <button type="button" className="submit-btn" disabled={!canContinue()} onClick={() => setStep(Math.min(step + 1, steps.length - 1))}>
                    Toliau
                  </button>
                ) : (
                  <button type="submit" className="submit-btn" disabled={!canContinue()}>
                    Patvirtinti registraciją 📅
                  </button>
                )}
              </div>
            </div>

            <aside className="wizard-summary">
              <h3>{selectedService.title}</h3>
              <p>{selectedService.meta}</p>
              <div className="summary-line"><span>Tikslas</span><strong>{goal || "Dar neįvesta"}</strong></div>
              <div className="summary-line"><span>Aktyvumas</span><strong>{activityLevel || "Dar nepasirinkta"}</strong></div>
              <div className="summary-line"><span>Formatas</span><strong>{selectedService.title}</strong></div>
              <div className="summary-line"><span>{requiresSchedule ? "Laikas" : "Ritmas"}</span><strong>{requiresSchedule ? (selectedTime || "Dar nepasirinkta") : (preferredTime || "Derinsime")}</strong></div>
              <p style={{ fontSize: 12 }}>Pirmiausia įvertinama situacija, tik tada tvirtinamas tinkamiausias formatas.</p>
            </aside>
          </div>
        </form>
      ) : (
        <div className="success-box">
          <h2>🎉 Registracija sėkmingai gauta!</h2>
          <p>
            Paslauga: {selectedService.title}<br />
            {requiresSchedule ? `Laikas: ${selectedTime} val.` : `Ritmas: ${preferredDays}, ${preferredTime}`}<br />
            Sveikatos duomenys sėkmingai perduoti treneriui.
          </p>
        </div>
      )}
    </div>
  );
}
