import { useMemo, useState } from "react";

const services = [
  {
    id: "one",
    title: "Individuali treniruotė",
    price: "35 €",
    meta: "60 min. · Asmeninis darbas 1:1",
    description: "Technika, laikysena, jėga ir saugus progresas pagal jūsų fizinę būklę.",
    durationMin: 60,
  },
  {
    id: "sub",
    title: "Treniruočių abonementas",
    price: "nuo 120 €",
    meta: "mėn. · Reguliarus sportavimas",
    description: "Aiškus savaitės ritmas, treniruotės ir progreso stebėjimas.",
    durationMin: 60,
  },
  {
    id: "plan",
    title: "Treniruočių planas",
    price: "89 €",
    meta: "4 savaitės · Sporto salei arba namams",
    description: "Individualus planas su pratimais, serijomis, pakartojimais ir logika.",
    durationMin: 0,
  },
  {
    id: "online",
    title: "Nuotolinė priežiūra",
    price: "129 €",
    meta: "mėn. · Plano korekcijos ir palaikymas",
    description: "Planavimas, korekcijos, atsakymai į klausimus ir aiškus progresas nuotoliu.",
    durationMin: 0,
  },
  {
    id: "food",
    title: "Mitybos konsultacija",
    price: "45 €",
    meta: "45 min. · Praktiškai ir be kraštutinumų",
    description: "Paprastas mitybos ritmas, įpročiai ir sprendimai, kuriuos galima išlaikyti.",
    durationMin: 45,
  },
];

const slots = ["07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"];

const existingSessions = [
  { time: "10:00", durationMin: 60 },
  { time: "17:00", durationMin: 60 },
];

const css = `
  :root {
    --ink: #0f172a;
    --muted: #64748b;
    --paper: #fbfaf6;
    --bone: #f3f5ef;
    --line: rgba(15, 23, 42, .1);
    --lime: #b7f34a;
    --lime-soft: #eefdd7;
    --forest: #17351f;
    --rose: #fff1f2;
  }

  * { box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  body { margin: 0; background: var(--paper); color: var(--ink); font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
  button, input, select, textarea { font: inherit; }

  .landing {
    min-height: 100vh;
    background:
      radial-gradient(circle at 8% 12%, rgba(183, 243, 74, .22), transparent 32%),
      radial-gradient(circle at 84% 8%, rgba(255, 255, 255, .9), transparent 28%),
      linear-gradient(180deg, #fbfaf6 0%, #f4f1ea 100%);
  }

  .container { width: min(1180px, calc(100% - 40px)); margin: 0 auto; }
  .header {
    position: sticky;
    top: 0;
    z-index: 30;
    backdrop-filter: blur(18px);
    background: rgba(251, 250, 246, .78);
    border-bottom: 1px solid var(--line);
  }

  .nav {
    min-height: 78px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
  }

  .brand { display: flex; align-items: center; gap: 12px; text-decoration: none; color: var(--ink); }
  .brand-mark {
    width: 44px;
    height: 44px;
    border-radius: 16px;
    display: grid;
    place-items: center;
    background: var(--forest);
    color: white;
    font-weight: 950;
    box-shadow: 0 12px 35px rgba(23, 53, 31, .22);
  }
  .brand strong { display: block; font-size: 16px; letter-spacing: -.04em; }
  .brand span { display: block; margin-top: 2px; color: var(--muted); font-size: 12px; font-weight: 700; }

  .nav-links { display: flex; align-items: center; gap: 20px; }
  .nav-links a { color: rgba(15, 23, 42, .62); text-decoration: none; font-size: 14px; font-weight: 800; }
  .nav-links a:hover { color: var(--ink); }

  .btn {
    border: 0;
    border-radius: 999px;
    padding: 14px 22px;
    font-weight: 950;
    cursor: pointer;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: transform .18s ease, box-shadow .18s ease, background .18s ease;
  }

  .btn:hover { transform: translateY(-2px); }
  .btn-dark { background: var(--forest); color: white; box-shadow: 0 18px 45px rgba(23, 53, 31, .2); }
  .btn-light { background: white; color: var(--ink); border: 1px solid var(--line); }
  .btn-lime { background: var(--lime); color: var(--forest); }

  .hero {
    padding: 72px 0 54px;
    display: grid;
    grid-template-columns: 1.03fr .97fr;
    gap: 46px;
    align-items: center;
  }

  .eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    border: 1px solid var(--line);
    background: rgba(255, 255, 255, .72);
    border-radius: 999px;
    padding: 8px 12px;
    color: rgba(15, 23, 42, .58);
    font-size: 12px;
    font-weight: 950;
    text-transform: uppercase;
    letter-spacing: .12em;
  }

  .eyebrow::before {
    content: "";
    width: 9px;
    height: 9px;
    border-radius: 999px;
    background: var(--lime);
    box-shadow: 0 0 0 6px rgba(183, 243, 74, .22);
  }

  .hero h1 {
    margin: 22px 0 0;
    font-size: clamp(3rem, 8vw, 7.2rem);
    line-height: .86;
    letter-spacing: -.085em;
    font-weight: 950;
  }

  .hero p {
    margin: 26px 0 0;
    color: rgba(15, 23, 42, .62);
    font-size: 18px;
    line-height: 1.75;
    max-width: 620px;
  }

  .hero-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 30px; }

  .hero-points {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin-top: 34px;
  }

  .point {
    background: rgba(255, 255, 255, .75);
    border: 1px solid var(--line);
    border-radius: 24px;
    padding: 18px;
  }

  .point strong { display: block; font-size: 24px; letter-spacing: -.05em; }
  .point span { display: block; margin-top: 4px; color: var(--muted); font-size: 13px; font-weight: 800; }

  .hero-card {
    position: relative;
    min-height: 620px;
    border-radius: 42px;
    overflow: hidden;
    border: 1px solid rgba(15, 23, 42, .08);
    background:
      linear-gradient(145deg, rgba(15, 23, 42, .05), transparent 45%),
      linear-gradient(180deg, #e6eadf, #ffffff);
    box-shadow: 0 30px 90px rgba(15, 23, 42, .12);
  }

  .hero-card::before {
    content: "";
    position: absolute;
    inset: 28px 28px 120px;
    border-radius: 34px;
    background:
      linear-gradient(180deg, rgba(23, 53, 31, .1), rgba(23, 53, 31, .32)),
      url("/assets/klinika-hero.png"),
      url("/klinika-hero.png");
    background-size: cover;
    background-position: center;
    filter: saturate(.98);
  }

  .floating-card {
    position: absolute;
    left: 28px;
    right: 28px;
    bottom: 28px;
    border-radius: 30px;
    background: rgba(255, 255, 255, .88);
    border: 1px solid rgba(255, 255, 255, .6);
    backdrop-filter: blur(18px);
    padding: 22px;
  }

  .floating-card h3 { margin: 0; font-size: 24px; letter-spacing: -.055em; }
  .floating-card p { margin: 10px 0 0; font-size: 14px; line-height: 1.55; color: var(--muted); }
  .mini-row { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 16px; }
  .mini-pill { border-radius: 999px; background: var(--lime-soft); color: var(--forest); padding: 8px 12px; font-size: 12px; font-weight: 950; }

  .section { padding: 64px 0; }
  .section-head {
    display: flex;
    align-items: end;
    justify-content: space-between;
    gap: 26px;
    margin-bottom: 28px;
  }

  .section h2 {
    margin: 0;
    max-width: 760px;
    font-size: clamp(2.1rem, 5vw, 4.8rem);
    line-height: .92;
    letter-spacing: -.08em;
    font-weight: 950;
  }

  .section-lead {
    max-width: 410px;
    color: rgba(15, 23, 42, .58);
    font-size: 15px;
    line-height: 1.7;
    font-weight: 650;
  }

  .cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
  .card {
    background: rgba(255, 255, 255, .86);
    border: 1px solid var(--line);
    border-radius: 30px;
    padding: 26px;
    box-shadow: 0 18px 45px rgba(15, 23, 42, .05);
  }

  .card h3 { margin: 0; font-size: 22px; letter-spacing: -.055em; }
  .card p { margin: 12px 0 0; color: var(--muted); line-height: 1.65; font-size: 14px; }
  .price { margin-top: 20px; display: inline-flex; border-radius: 999px; background: var(--lime-soft); color: var(--forest); padding: 8px 12px; font-size: 13px; font-weight: 950; }

  .about-grid { display: grid; grid-template-columns: .92fr 1.08fr; gap: 18px; align-items: stretch; }
  .about-photo {
    min-height: 480px;
    border-radius: 36px;
    background:
      linear-gradient(180deg, rgba(15, 23, 42, .06), rgba(15, 23, 42, .34)),
      url("/assets/klinika-hero.png"),
      url("/klinika-hero.png");
    background-size: cover;
    background-position: center;
    border: 1px solid var(--line);
    overflow: hidden;
  }

  .about-text {
    border-radius: 36px;
    background: var(--forest);
    color: white;
    padding: 34px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 480px;
  }

  .about-text p { color: rgba(255, 255, 255, .72); font-size: 17px; line-height: 1.75; margin: 0; }
  .about-list { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 26px; }
  .about-item { border: 1px solid rgba(255, 255, 255, .14); border-radius: 22px; padding: 16px; background: rgba(255, 255, 255, .06); }
  .about-item strong { display: block; }
  .about-item span { display: block; margin-top: 5px; color: rgba(255, 255, 255, .58); font-size: 13px; line-height: 1.4; }

  .steps { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
  .step { position: relative; min-height: 245px; background: white; border: 1px solid var(--line); border-radius: 30px; padding: 24px; overflow: hidden; }
  .step::before { content: attr(data-no); position: absolute; right: 18px; bottom: 8px; font-size: 86px; font-weight: 950; letter-spacing: -.08em; color: rgba(15, 23, 42, .045); }
  .step h3 { margin: 32px 0 0; font-size: 21px; letter-spacing: -.055em; }
  .step p { margin: 12px 0 0; color: var(--muted); line-height: 1.6; font-size: 14px; }

  .results {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 14px;
  }

  .result {
    background: rgba(255, 255, 255, .82);
    border: 1px solid var(--line);
    border-radius: 28px;
    padding: 24px;
  }

  .result strong { display: block; font-size: 42px; line-height: 1; letter-spacing: -.07em; }
  .result span { display: block; margin-top: 10px; color: var(--muted); font-size: 13px; font-weight: 800; line-height: 1.45; }

  .reviews { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
  .review { background: white; border: 1px solid var(--line); border-radius: 30px; padding: 26px; }
  .review p { margin: 0; color: rgba(15, 23, 42, .68); line-height: 1.7; }
  .review strong { display: block; margin-top: 20px; }

  .contact-card {
    display: grid;
    grid-template-columns: 1.1fr .9fr;
    gap: 20px;
    align-items: center;
    border-radius: 40px;
    background: var(--forest);
    color: white;
    padding: 40px;
    overflow: hidden;
  }

  .contact-card h2 { color: white; }
  .contact-card p { color: rgba(255, 255, 255, .72); font-size: 16px; line-height: 1.7; max-width: 620px; }
  .contact-box { background: rgba(255, 255, 255, .08); border: 1px solid rgba(255, 255, 255, .14); border-radius: 28px; padding: 24px; }
  .contact-line { display: flex; justify-content: space-between; gap: 16px; padding: 13px 0; border-bottom: 1px solid rgba(255, 255, 255, .12); }
  .contact-line:last-child { border-bottom: 0; }
  .contact-line span { color: rgba(255, 255, 255, .58); font-weight: 800; }
  .contact-line strong { text-align: right; }

  .footer { padding: 28px 0 42px; color: rgba(15, 23, 42, .52); font-size: 13px; font-weight: 750; }

  .modal-backdrop {
    position: fixed;
    inset: 0;
    z-index: 100;
    background: rgba(15, 23, 42, .42);
    backdrop-filter: blur(14px);
    display: grid;
    place-items: center;
    padding: 22px;
  }

  .modal {
    width: min(1100px, 100%);
    max-height: min(92vh, 980px);
    overflow: auto;
    background: #fbfbf9;
    border-radius: 32px;
    padding: 40px;
    box-shadow: 0 30px 110px rgba(0,0,0,.24);
  }

  .reg-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 18px; }
  .reg-title { font-size: 36px; font-weight: 950; margin: 0 0 6px 0; letter-spacing: -0.055em; }
  .reg-sub { color: var(--muted); font-size: 15px; margin-bottom: 32px; }
  .close-btn { background: #f3f4f1; border: 0; width: 44px; height: 44px; border-radius: 50%; font-size: 22px; cursor: pointer; flex: 0 0 auto; }
  .reg-grid { display: grid; grid-template-columns: 1fr 1.1fr; gap: 40px; }
  .section-title { font-size: 20px; font-weight: 950; margin: 0 0 18px 0; letter-spacing: -0.03em; }
  .service-list { display: flex; flex-direction: column; gap: 12px; }
  .service-card { background: white; border: 1px solid rgba(17,24,39,0.08); border-radius: 20px; padding: 20px; text-align: left; cursor: pointer; transition: 0.2s; }
  .service-card:hover { transform: translateY(-2px); border-color: rgba(17,24,39,0.15); }
  .service-card.active { background: #f4fbe9; border: 2px solid #b7f34a; }
  .service-name { font-size: 17px; font-weight: 950; margin: 0 0 6px 0; }
  .service-meta { color: var(--muted); font-size: 14px; }
  .slots-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; gap: 12px; }
  .slots-badge { background: #e8f7cc; color: #3b6110; font-size: 12px; font-weight: 950; padding: 6px 12px; border-radius: 999px; white-space: nowrap; }
  .time-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; margin-bottom: 24px; }
  .time-btn { background: white; border: 1px solid rgba(17,24,39,0.08); border-radius: 14px; padding: 14px 0; font-weight: 950; font-size: 15px; text-align: center; cursor: pointer; transition: 0.2s; }
  .time-btn:hover:not(:disabled) { border-color: #111827; }
  .time-btn.active { background: #111827; color: white; border-color: #111827; }
  .time-btn:disabled { background: #f3f4f1; color: #98a2b3; cursor: not-allowed; text-decoration: line-through; border-color: transparent; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }
  .input-field { width: 100%; border: 1px solid rgba(17,24,39,0.08); background: white; border-radius: 16px; padding: 14px 16px; font-size: 15px; color: #111827; }
  .input-field::placeholder { color: #98a2b3; }
  .input-field:focus { outline: none; border-color: #111827; }
  .danger-border { border: 1px solid #fca5a5 !important; background: #fffbfa; }
  .submit-btn { width: 100%; background: #111827; color: white; border: 0; border-radius: 999px; padding: 16px; font-weight: 950; font-size: 16px; margin-top: 16px; cursor: pointer; transition: 0.2s; }
  .submit-btn:hover { background: #233027; transform: translateY(-2px); }
  .submit-btn:disabled { opacity: .55; cursor: not-allowed; transform: none; }
  .success-box { background: #e8f7cc; color: #2f4b18; padding: 24px; border-radius: 24px; text-align: center; font-weight: 800; }

  @media (max-width: 980px) {
    .container { width: min(100% - 28px, 1180px); }
    .nav { min-height: 68px; }
    .nav-links { display: none; }
    .hero { grid-template-columns: 1fr; padding: 46px 0 40px; gap: 28px; }
    .hero-card { min-height: 520px; }
    .hero-points { grid-template-columns: repeat(3, 1fr); }
    .section-head { align-items: start; flex-direction: column; }
    .cards, .reviews { grid-template-columns: 1fr 1fr; }
    .steps { grid-template-columns: 1fr 1fr; }
    .results { grid-template-columns: 1fr 1fr; }
    .about-grid { grid-template-columns: 1fr; }
    .contact-card { grid-template-columns: 1fr; padding: 30px; border-radius: 32px; }
    .modal { padding: 28px; }
    .reg-grid { grid-template-columns: 1fr; gap: 28px; }
    .time-grid { grid-template-columns: repeat(4, 1fr); }
  }

  @media (max-width: 640px) {
    .container { width: calc(100% - 24px); }
    .brand span { display: none; }
    .brand-mark { width: 40px; height: 40px; border-radius: 14px; }
    .btn { width: 100%; padding: 15px 18px; }
    .nav .btn { width: auto; padding: 12px 16px; font-size: 13px; }
    .hero { padding-top: 34px; }
    .hero h1 { font-size: clamp(3rem, 18vw, 4.5rem); }
    .hero p { font-size: 16px; line-height: 1.65; }
    .hero-actions { flex-direction: column; }
    .hero-points { grid-template-columns: 1fr; }
    .hero-card { min-height: 420px; border-radius: 28px; }
    .hero-card::before { inset: 16px 16px 116px; border-radius: 22px; }
    .floating-card { left: 16px; right: 16px; bottom: 16px; border-radius: 22px; padding: 18px; }
    .section { padding: 44px 0; }
    .cards, .reviews, .steps, .results { grid-template-columns: 1fr; }
    .card, .review, .step, .result { border-radius: 24px; padding: 22px; }
    .about-photo { min-height: 360px; border-radius: 28px; }
    .about-text { min-height: auto; border-radius: 28px; padding: 24px; }
    .about-list { grid-template-columns: 1fr; }
    .contact-card { padding: 24px; border-radius: 28px; }
    .contact-line { flex-direction: column; gap: 5px; }
    .contact-line strong { text-align: left; }
    .modal-backdrop { padding: 0; align-items: stretch; }
    .modal { width: 100%; max-height: 100vh; border-radius: 0; padding: 20px; }
    .reg-title { font-size: 28px; line-height: 1.04; }
    .reg-sub { font-size: 14px; line-height: 1.55; margin-bottom: 24px; }
    .section-title { font-size: 18px; }
    .service-card { border-radius: 18px; padding: 16px; }
    .service-name { font-size: 16px; }
    .service-meta { font-size: 13px; line-height: 1.45; }
    .slots-header { align-items: flex-start; flex-direction: column; }
    .time-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
    .time-btn { padding: 15px 0; border-radius: 16px; }
    .form-row { grid-template-columns: 1fr; gap: 10px; }
    .input-field { font-size: 16px; padding: 15px 16px; }
    .submit-btn { padding: 17px; font-size: 15px; }
  }
`;

function BookingModal({ onClose }) {
  const [selectedService, setSelectedService] = useState(services[0]);
  const [selectedTime, setSelectedTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [contactMethod, setContactMethod] = useState("Telefonu");
  const [email, setEmail] = useState("");
  const [activityLevel, setActivityLevel] = useState("");
  const [healthIssues, setHealthIssues] = useState("");
  const [goal, setGoal] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const availableSlots = useMemo(() => {
    return slots.map((slot) => {
      if (!selectedService.durationMin) return { time: slot, available: true };

      const startMins = Number(slot.split(":")[0]) * 60;
      const endMins = startMins + selectedService.durationMin;

      const isOverlap = existingSessions.some((session) => {
        const sessionStart = Number(session.time.split(":")[0]) * 60;
        const sessionEnd = sessionStart + session.durationMin;
        return Math.max(startMins, sessionStart) < Math.min(endMins, sessionEnd);
      });

      return { time: slot, available: !isOverlap };
    });
  }, [selectedService]);

  const activeSlotsCount = availableSlots.filter((slot) => slot.available).length;

  function handleSubmit(event) {
    event.preventDefault();
    if (name && phone && healthIssues && activityLevel && selectedTime) {
      setIsSubmitted(true);
    }
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal">
        <div className="reg-header">
          <div>
            <h1 className="reg-title">Registracija treniruotei</h1>
            <p className="reg-sub">Pasirink paslaugą, pageidaujamą laiką ir užpildyk saugumo anketą.</p>
          </div>
          <button className="close-btn" type="button" onClick={onClose} aria-label="Uždaryti">×</button>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="reg-grid">
            <div>
              <h2 className="section-title">1. Paslauga</h2>
              <div className="service-list">
                {services.map((service) => (
                  <button
                    type="button"
                    key={service.id}
                    className={`service-card ${selectedService.id === service.id ? "active" : ""}`}
                    onClick={() => {
                      setSelectedService(service);
                      setSelectedTime("");
                    }}
                  >
                    <h3 className="service-name">{service.title}</h3>
                    <div className="service-meta">{service.price} · {service.meta}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="slots-header">
                <h2 className="section-title" style={{ margin: 0 }}>2. Pageidaujamas laikas</h2>
                <span className="slots-badge">{activeSlotsCount} laikai laisvi</span>
              </div>

              <div className="time-grid">
                {availableSlots.map((slot) => (
                  <button
                    key={slot.time}
                    type="button"
                    disabled={!slot.available}
                    className={`time-btn ${selectedTime === slot.time ? "active" : ""}`}
                    onClick={() => setSelectedTime(slot.time)}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>

              <h2 className="section-title">3. Kliento anketa</h2>

              <div className="form-row">
                <input className="input-field" placeholder="Vardas ir pavardė *" required value={name} onChange={(event) => setName(event.target.value)} />
                <input className="input-field" placeholder="Telefono numeris *" required value={phone} onChange={(event) => setPhone(event.target.value)} />
              </div>

              <div className="form-row">
                <select className="input-field" value={contactMethod} onChange={(event) => setContactMethod(event.target.value)}>
                  <option value="Telefonu">Telefonu</option>
                  <option value="Instagram">Instagram</option>
                  <option value="El. paštu">El. paštu</option>
                </select>
                <input className="input-field" placeholder="El. paštas / Instagram" value={email} onChange={(event) => setEmail(event.target.value)} />
              </div>

              <div style={{ marginBottom: 12 }}>
                <select className="input-field" required value={activityLevel} onChange={(event) => setActivityLevel(event.target.value)}>
                  <option value="">Koks jūsų fizinio aktyvumo lygis šiuo metu? *</option>
                  <option value="Žemas">Žemas — sėdimas darbas, nesportuoju</option>
                  <option value="Vidutinis">Vidutinis — pajudu 1–2 k. per savaitę</option>
                  <option value="Aukštas">Aukštas — reguliariai sportuoju</option>
                </select>
              </div>

              <div style={{ marginBottom: 12 }}>
                <textarea
                  className="input-field danger-border"
                  rows="2"
                  placeholder="SVARBU: Ar turite traumų, sveikatos sutrikimų ar gydytojo apribojimų? Jei nėra, įrašykite „Nėra“ *"
                  required
                  value={healthIssues}
                  onChange={(event) => setHealthIssues(event.target.value)}
                />
              </div>

              <textarea
                className="input-field"
                rows="2"
                placeholder="Tikslas: jėga, svorio mažinimas, laikysena, energija ar kita..."
                value={goal}
                onChange={(event) => setGoal(event.target.value)}
              />

              <button type="submit" className="submit-btn" disabled={!selectedTime || !name || !phone || !healthIssues || !activityLevel}>
                {!selectedTime ? "Pasirinkite laiką viršuje" : "Patvirtinti registraciją"}
              </button>
            </div>
          </form>
        ) : (
          <div className="success-box">
            <h2>Registracija sėkmingai gauta</h2>
            <p>Paslauga: {selectedService.title}<br />Laikas: {selectedTime} val.<br />Treneris susisieks dėl patvirtinimo.</p>
            <button className="btn btn-dark" type="button" onClick={onClose}>Uždaryti</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TrainerLanding() {
  const [bookingOpen, setBookingOpen] = useState(false);

  return (
    <main className="landing">
      <style>{css}</style>

      <header className="header">
        <div className="container nav">
          <a className="brand" href="#top">
            <span className="brand-mark">VP</span>
            <span>
              <strong>Vardenis Pavardenis</strong>
              <span>Asmeninis treneris</span>
            </span>
          </a>

          <nav className="nav-links" aria-label="Pagrindinė navigacija">
            <a href="#apie">Apie</a>
            <a href="#paslaugos">Paslaugos</a>
            <a href="#procesas">Procesas</a>
            <a href="#atsiliepimai">Atsiliepimai</a>
            <a href="#kontaktai">Kontaktai</a>
          </nav>

          <button className="btn btn-dark" type="button" onClick={() => setBookingOpen(true)}>
            Registruotis
          </button>
        </div>
      </header>

      <section id="top" className="container hero">
        <div>
          <span className="eyebrow">Individualios treniruotės</span>
          <h1>Stipresnis kūnas. Aiškus planas. Saugus progresas.</h1>
          <p>
            Asmeninės treniruotės, treniruočių planai ir nuotolinė priežiūra žmonėms,
            kurie nori sportuoti protingai, be chaoso ir be kraštutinumų.
          </p>

          <div className="hero-actions">
            <button className="btn btn-dark" type="button" onClick={() => setBookingOpen(true)}>
              Rezervuoti laiką
            </button>
            <a className="btn btn-light" href="#paslaugos">
              Peržiūrėti paslaugas
            </a>
          </div>

          <div className="hero-points">
            <div className="point">
              <strong>1:1</strong>
              <span>individualus darbas</span>
            </div>
            <div className="point">
              <strong>4 sav.</strong>
              <span>aiškus planas</span>
            </div>
            <div className="point">
              <strong>60 min.</strong>
              <span>saugios treniruotės</span>
            </div>
          </div>
        </div>

        <div className="hero-card" aria-label="Trenerio nuotrauka ir informacija">
          <div className="floating-card">
            <h3>Treniruotės pagal jūsų tikslą</h3>
            <p>
              Prieš pradžią įvertiname fizinį aktyvumą, sveikatos apribojimus ir sudarome logišką treniruočių kryptį.
            </p>
            <div className="mini-row">
              <span className="mini-pill">Technika</span>
              <span className="mini-pill">Laikysena</span>
              <span className="mini-pill">Jėga</span>
              <span className="mini-pill">Progresas</span>
            </div>
          </div>
        </div>
      </section>

      <section id="apie" className="container section">
        <div className="section-head">
          <h2>Treneris, kuris padeda sportuoti aiškiai ir be spėlionių.</h2>
          <p className="section-lead">
            Tikslas — ne tik „pavargti treniruotėje“, o suprasti, ką darote, kodėl tai darote ir kaip saugiai judėti į priekį.
          </p>
        </div>

        <div className="about-grid">
          <div className="about-photo" />
          <div className="about-text">
            <div>
              <p>
                Dirbu su žmonėmis, kurie nori sustiprėti, pagerinti laikyseną, sumažinti kūno diskomfortą,
                grįžti į sportą po pertraukos arba tiesiog turėti aiškų, realų treniruočių planą.
              </p>
              <p style={{ marginTop: 18 }}>
                Kiekviena programa pradedama nuo tikslo, patirties ir saugumo informacijos. Tai padeda išvengti chaotiško krūvio ir nereikalingos rizikos.
              </p>
            </div>

            <div className="about-list">
              <div className="about-item">
                <strong>Individualus krūvis</strong>
                <span>Prisitaikoma prie patirties ir fizinės būklės.</span>
              </div>
              <div className="about-item">
                <strong>Saugumo anketa</strong>
                <span>Įvertinamos traumos, apribojimai ir rizikos.</span>
              </div>
              <div className="about-item">
                <strong>Aiški struktūra</strong>
                <span>Treniruotės turi logiką, ne atsitiktinius pratimus.</span>
              </div>
              <div className="about-item">
                <strong>Progreso stebėjimas</strong>
                <span>Keitimai daromi pagal rezultatą ir savijautą.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="paslaugos" className="container section">
        <div className="section-head">
          <h2>Paslaugos pagal skirtingus poreikius.</h2>
          <p className="section-lead">
            Galite rinktis gyvą treniruotę, abonementą, individualų planą, nuotolinę priežiūrą ar mitybos konsultaciją.
          </p>
        </div>

        <div className="cards">
          {services.map((service) => (
            <article className="card" key={service.id}>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <span className="price">{service.price} · {service.meta}</span>
            </article>
          ))}
        </div>
      </section>

      <section id="procesas" className="container section">
        <div className="section-head">
          <h2>Paprastas procesas nuo užklausos iki progreso.</h2>
          <p className="section-lead">
            Viskas aišku: pasirenkate paslaugą, užpildote anketą, suderiname laiką ir pradedame dirbti.
          </p>
        </div>

        <div className="steps">
          <article className="step" data-no="01">
            <span className="eyebrow">Startas</span>
            <h3>Registracija</h3>
            <p>Pasirenkate paslaugą, laiką ir trumpai aprašote tikslą bei sveikatos informaciją.</p>
          </article>
          <article className="step" data-no="02">
            <span className="eyebrow">Įvertinimas</span>
            <h3>Pokalbis</h3>
            <p>Aptariame patirtį, tikslus, apribojimus ir realų savaitės ritmą.</p>
          </article>
          <article className="step" data-no="03">
            <span className="eyebrow">Planavimas</span>
            <h3>Treniruotės</h3>
            <p>Sudaromas aiškus krūvis, pratimai ir progresavimo kryptis.</p>
          </article>
          <article className="step" data-no="04">
            <span className="eyebrow">Progresas</span>
            <h3>Korekcijos</h3>
            <p>Planą keičiame pagal savijautą, rezultatus ir gyvenimo ritmą.</p>
          </article>
        </div>
      </section>

      <section className="container section">
        <div className="results">
          <div className="result">
            <strong>200+</strong>
            <span>pravestų individualių treniruočių</span>
          </div>
          <div className="result">
            <strong>4–8</strong>
            <span>savaitės aiškiam startui ir įpročiui</span>
          </div>
          <div className="result">
            <strong>1:1</strong>
            <span>dėmesys technikai, saugumui ir tikslui</span>
          </div>
          <div className="result">
            <strong>100%</strong>
            <span>individualizuotas krūvis pagal žmogų</span>
          </div>
        </div>
      </section>

      <section id="atsiliepimai" className="container section">
        <div className="section-head">
          <h2>Ką sako klientai.</h2>
          <p className="section-lead">
            Šie tekstai yra demonstraciniai — realioje svetainėje būtų įkelti tikri kliento atsiliepimai.
          </p>
        </div>

        <div className="reviews">
          <article className="review">
            <p>„Pagaliau supratau, ką darau sporto salėje. Nebėra chaoso, o pratimai turi aiškią logiką.“</p>
            <strong>Mantas</strong>
          </article>
          <article className="review">
            <p>„Labai patiko saugus tempas. Įvertino mano nugaros įtampą ir pritaikė treniruotes.“</p>
            <strong>Aistė</strong>
          </article>
          <article className="review">
            <p>„Planą lengva sekti, o korekcijos padeda nenukrypti. Labai profesionalus požiūris.“</p>
            <strong>Rokas</strong>
          </article>
        </div>
      </section>

      <section id="kontaktai" className="container section">
        <div className="contact-card">
          <div>
            <span className="eyebrow">Kontaktai</span>
            <h2>Pradėkite nuo trumpos registracijos.</h2>
            <p>
              Užpildykite formą, pasirinkite pageidaujamą laiką ir treneris susisieks dėl patvirtinimo.
              Realioje versijoje registracijos gali keliauti į admin panelę, el. paštą arba duomenų bazę.
            </p>
            <button className="btn btn-lime" type="button" onClick={() => setBookingOpen(true)}>
              Atidaryti registraciją
            </button>
          </div>

          <div className="contact-box">
            <div className="contact-line">
              <span>Telefonas</span>
              <strong>+370 600 00000</strong>
            </div>
            <div className="contact-line">
              <span>El. paštas</span>
              <strong>treneris@email.lt</strong>
            </div>
            <div className="contact-line">
              <span>Miestas</span>
              <strong>Vilnius / Kaunas</strong>
            </div>
            <div className="contact-line">
              <span>Darbo laikas</span>
              <strong>I–V · 07:00–20:00</strong>
            </div>
          </div>
        </div>
      </section>

      <footer className="container footer">
        © 2026 Vardenis Pavardenis. Demonstracinė asmeninio trenerio svetainė.
      </footer>

      {bookingOpen && <BookingModal onClose={() => setBookingOpen(false)} />}
    </main>
  );
}
