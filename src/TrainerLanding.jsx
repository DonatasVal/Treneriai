import { useMemo, useState } from "react";

const services = [
  {
    id: "one",
    title: "Individuali treniruotė",
    price: "35 €",
    meta: "60 min. · Asmeninis darbas 1:1",
    description: "Technika, laikysena, jėga ir saugus progresas pagal jūsų fizinę būklę.",
    durationMin: 60,
    requiresSchedule: true,
    bookingType: "vizitas",
    nextStepNote: "Pasirinkite jums tinkamą datą ir laiką. Treneris patvirtins registraciją asmeniškai.",
  },
  {
    id: "sub",
    title: "Treniruočių abonementas",
    price: "nuo 120 €",
    meta: "mėn. · Reguliarus sportavimas",
    description: "Aiškus savaitės ritmas, treniruotės ir progreso stebėjimas.",
    durationMin: 0,
    requiresSchedule: false,
    bookingType: "abonementas",
    nextStepNote: "Datos rinktis nereikia. Užsiregistravus susisieksime apsitarti treniravimo plano, savaitinio ritmo ir tinkamiausių laikų.",
  },
  {
    id: "plan",
    title: "Treniruočių planas",
    price: "89 €",
    meta: "4 savaitės · Sporto salei arba namams",
    description: "Individualus planas su pratimais, serijomis, pakartojimais ir logika.",
    durationMin: 0,
    requiresSchedule: false,
    bookingType: "planas",
    nextStepNote: "Datos rinktis nereikia. Po registracijos susisieksime, surinksime papildomą informaciją ir paruošime individualų planą.",
  },
  {
    id: "online",
    title: "Nuotolinė priežiūra",
    price: "129 €",
    meta: "mėn. · Plano korekcijos ir palaikymas",
    description: "Planavimas, korekcijos, atsakymai į klausimus ir aiškus progresas nuotoliu.",
    durationMin: 0,
    requiresSchedule: false,
    bookingType: "nuotoliu",
    nextStepNote: "Datos rinktis nereikia. Užsiregistravus susisieksime aptarti tikslo, esamo režimo, treniruočių plano ir komunikacijos formato.",
  },
  {
    id: "food",
    title: "Mitybos konsultacija",
    price: "45 €",
    meta: "45 min. · Praktiškai ir be kraštutinumų",
    description: "Paprastas mitybos ritmas, įpročiai ir sprendimai, kuriuos galima išlaikyti.",
    durationMin: 45,
    requiresSchedule: true,
    bookingType: "konsultacija",
    nextStepNote: "Pasirinkite pageidaujamą konsultacijos datą ir laiką. Treneris susisieks dėl patvirtinimo.",
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

  .fit-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
  .fit-card {
    position: relative;
    overflow: hidden;
    min-height: 250px;
    border: 1px solid var(--line);
    border-radius: 30px;
    background: rgba(255, 255, 255, .88);
    padding: 26px;
    box-shadow: 0 18px 45px rgba(15, 23, 42, .045);
  }
  .fit-card::after {
    content: attr(data-no);
    position: absolute;
    right: 18px;
    bottom: -6px;
    color: rgba(15, 23, 42, .045);
    font-size: 76px;
    font-weight: 950;
    letter-spacing: -.08em;
  }
  .fit-card h3 { margin: 18px 0 0; font-size: 22px; letter-spacing: -.055em; }
  .fit-card p { margin: 10px 0 0; color: var(--muted); line-height: 1.65; font-size: 14px; }

  .method-panel {
    display: grid;
    grid-template-columns: .9fr 1.1fr;
    gap: 18px;
    align-items: stretch;
  }
  .method-intro {
    border-radius: 34px;
    background: var(--forest);
    color: white;
    padding: 32px;
  }
  .method-intro h3 { margin: 18px 0 0; font-size: 34px; line-height: 1; letter-spacing: -.07em; }
  .method-intro p { margin: 16px 0 0; color: rgba(255,255,255,.7); line-height: 1.7; }
  .method-list { display: grid; gap: 12px; }
  .method-item {
    display: grid;
    grid-template-columns: 54px 1fr;
    gap: 14px;
    align-items: start;
    border: 1px solid var(--line);
    border-radius: 24px;
    background: white;
    padding: 18px;
  }
  .method-no {
    width: 54px;
    height: 54px;
    border-radius: 18px;
    display: grid;
    place-items: center;
    background: var(--lime-soft);
    color: var(--forest);
    font-weight: 950;
  }
  .method-item h3 { margin: 0; font-size: 20px; letter-spacing: -.045em; }
  .method-item p { margin: 6px 0 0; color: var(--muted); line-height: 1.6; font-size: 14px; }

  .safety-card {
    border-radius: 38px;
    background:
      radial-gradient(circle at 10% 0%, rgba(183, 243, 74, .18), transparent 32%),
      var(--forest);
    color: white;
    padding: 38px;
  }
  .safety-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-top: 24px; }
  .safety-item {
    border: 1px solid rgba(255,255,255,.14);
    border-radius: 24px;
    background: rgba(255,255,255,.07);
    padding: 20px;
  }
  .safety-item h3 { margin: 0; font-size: 21px; letter-spacing: -.055em; }
  .safety-item p { margin: 10px 0 0; color: rgba(255,255,255,.66); line-height: 1.6; font-size: 14px; }

  .trust-board {
    display: grid;
    grid-template-columns: .95fr 1.05fr;
    gap: 18px;
    align-items: stretch;
  }
  .trust-dark {
    border-radius: 36px;
    background: var(--forest);
    color: white;
    padding: 34px;
  }
  .trust-dark h2 { color: white; margin-top: 18px; }
  .trust-dark p { color: rgba(255,255,255,.68); line-height: 1.7; }
  .trust-metrics { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-top: 24px; }
  .trust-metric { border: 1px solid rgba(255,255,255,.14); background: rgba(255,255,255,.07); border-radius: 22px; padding: 18px; }
  .trust-metric strong { display: block; font-size: 30px; letter-spacing: -.06em; }
  .trust-metric span { display: block; margin-top: 4px; color: rgba(255,255,255,.6); font-size: 12px; font-weight: 900; }
  .story-grid { display: grid; gap: 12px; }
  .story-card { border: 1px solid var(--line); border-radius: 28px; background: white; padding: 22px; }
  .story-card small { display: inline-flex; border-radius: 999px; background: var(--lime-soft); color: var(--forest); padding: 6px 10px; font-weight: 950; }
  .story-card h3 { margin: 14px 0 0; font-size: 22px; letter-spacing: -.055em; }
  .story-card p { margin: 10px 0 0; color: var(--muted); line-height: 1.65; font-size: 14px; }

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

  .small-note { margin: 8px 0 0; color: rgba(15, 23, 42, .52); font-size: 12px; line-height: 1.55; font-weight: 750; }
  .schedule-card { border: 1px solid rgba(15, 23, 42, .08); background: rgba(183, 243, 74, .13); border-radius: 18px; padding: 16px; margin-bottom: 20px; }
  .schedule-card strong { display: block; font-size: 15px; letter-spacing: -.025em; }
  .schedule-card p { margin: 6px 0 0; color: rgba(15, 23, 42, .58); font-size: 12px; line-height: 1.55; font-weight: 750; }
  .form-section-note { margin: -8px 0 14px; color: rgba(15, 23, 42, .52); font-size: 12px; line-height: 1.55; font-weight: 750; }
  .checkbox-row { display: flex; align-items: flex-start; gap: 10px; margin-top: 14px; color: rgba(15, 23, 42, .62); font-size: 12px; line-height: 1.5; font-weight: 750; }
  .checkbox-row input { width: 18px; height: 18px; margin-top: 1px; flex: 0 0 auto; }

  .wizard-tabs { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin: 22px 0; }
  .wizard-tab { border: 1px solid var(--line); background: white; color: var(--muted); border-radius: 16px; padding: 12px; text-align: left; font-size: 12px; font-weight: 950; cursor: pointer; }
  .wizard-tab.active { background: var(--forest); color: white; border-color: var(--forest); }
  .wizard-tab.done { background: var(--lime-soft); color: var(--forest); border-color: rgba(183,243,74,.7); }
  .wizard-layout { display: grid; grid-template-columns: 1fr .82fr; gap: 24px; align-items: start; }
  .wizard-panel { border: 1px solid var(--line); background: white; border-radius: 26px; padding: 22px; }
  .wizard-summary { position: sticky; top: 16px; background: var(--forest); color: white; border-radius: 26px; padding: 22px; }
  .wizard-summary h3 { margin: 16px 0 0; font-size: 26px; letter-spacing: -.055em; }
  .wizard-summary p { color: rgba(255,255,255,.66); line-height: 1.6; font-size: 13px; margin: 12px 0 0; }
  .summary-line { display: flex; justify-content: space-between; gap: 12px; border-bottom: 1px solid rgba(255,255,255,.12); padding: 10px 0; font-size: 13px; }
  .summary-line span { color: rgba(255,255,255,.58); }
  .wizard-actions { display: flex; justify-content: space-between; gap: 12px; margin-top: 22px; }
  .wizard-actions .btn:disabled { opacity: .45; cursor: not-allowed; transform: none; }
  .service-list.wizard-services { display: grid; grid-template-columns: 1fr 1fr; }
  .micro-note { margin-top: 12px; border-radius: 18px; background: var(--lime-soft); color: var(--forest); padding: 12px 14px; font-size: 12px; line-height: 1.55; font-weight: 850; }
  .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }

  @media (max-width: 980px) {
    .container { width: min(100% - 28px, 1180px); }
    .nav { min-height: 68px; }
    .nav-links { display: none; }
    .hero { grid-template-columns: 1fr; padding: 46px 0 40px; gap: 28px; }
    .hero-card { min-height: 520px; }
    .hero-points { grid-template-columns: repeat(3, 1fr); }
    .section-head { align-items: start; flex-direction: column; }
    .cards, .reviews, .fit-grid { grid-template-columns: 1fr 1fr; }
    .method-panel, .trust-board { grid-template-columns: 1fr; }
    .safety-grid { grid-template-columns: 1fr; }
    .steps { grid-template-columns: 1fr 1fr; }
    .results { grid-template-columns: 1fr 1fr; }
    .about-grid { grid-template-columns: 1fr; }
    .contact-card { grid-template-columns: 1fr; padding: 30px; border-radius: 32px; }
    .modal { padding: 28px; }
    .reg-grid { grid-template-columns: 1fr; gap: 28px; }
    .wizard-layout { grid-template-columns: 1fr; }
    .wizard-summary { position: static; }
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
    .cards, .reviews, .steps, .results, .fit-grid, .safety-grid { grid-template-columns: 1fr; }
    .card, .review, .step, .result, .fit-card, .safety-item { border-radius: 24px; padding: 22px; }
    .method-intro, .safety-card, .trust-dark { border-radius: 28px; padding: 24px; }
    .trust-metrics { grid-template-columns: 1fr; }
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
    .wizard-tabs { grid-template-columns: 1fr 1fr; }
    .service-list.wizard-services, .form-grid { grid-template-columns: 1fr; }
    .wizard-actions { flex-direction: column; }
    .input-field { font-size: 16px; padding: 15px 16px; }
    .submit-btn { padding: 17px; font-size: 15px; }
  }
`;

function BookingModal({ onClose }) {
  const [step, setStep] = useState(0);
  const [selectedService, setSelectedService] = useState(services[0]);
  const [selectedDate, setSelectedDate] = useState("2026-06-08");
  const [selectedTime, setSelectedTime] = useState("");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    contactMethod: "Telefonu",
    goal: "",
    experience: "",
    activityLevel: "",
    trainingPlace: "",
    preferredDays: "",
    preferredTime: "",
    healthIssues: "",
    notes: "",
    consent: false,
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const requiresSchedule = selectedService.requiresSchedule;
  const wizardSteps = ["Paslauga", "Tikslas", requiresSchedule ? "Laikas" : "Ritmas", "Kontaktai"];

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

  const canContinue = useMemo(() => {
    if (step === 0) return Boolean(selectedService);
    if (step === 1) return form.goal.trim() && form.activityLevel && form.healthIssues.trim();
    if (step === 2) return requiresSchedule ? selectedDate && selectedTime : form.preferredDays.trim() && form.preferredTime.trim();
    return form.name.trim() && form.phone.trim() && form.consent;
  }, [step, selectedService, form, requiresSchedule, selectedDate, selectedTime]);

  function updateForm(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!canContinue) return;
    setIsSubmitted(true);
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal">
        <div className="reg-header">
          <div>
            <h1 className="reg-title">Registracija treniruotei</h1>
            <p className="reg-sub">Žingsninė anketa surenka paslaugą, tikslą, saugumo informaciją, ritmą ir kontaktus.</p>
          </div>
          <button className="close-btn" type="button" onClick={onClose} aria-label="Uždaryti">×</button>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit}>
            <div className="wizard-tabs">
              {wizardSteps.map((item, index) => (
                <button
                  key={item}
                  type="button"
                  className={`wizard-tab ${index === step ? "active" : ""} ${index < step ? "done" : ""}`}
                  onClick={() => setStep(index)}
                >
                  {index + 1}. {item}
                </button>
              ))}
            </div>

            <div className="wizard-layout">
              <section className="wizard-panel">
                {step === 0 && (
                  <>
                    <h2 className="section-title">1. Paslauga</h2>
                    <div className="service-list wizard-services">
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
                          <div className="service-meta" style={{ marginTop: 8 }}>{service.description}</div>
                        </button>
                      ))}
                    </div>
                    <div className="micro-note">{selectedService.nextStepNote}</div>
                  </>
                )}

                {step === 1 && (
                  <>
                    <h2 className="section-title">2. Tikslas, patirtis ir saugumas</h2>
                    <div className="form-grid">
                      <select className="input-field" value={form.activityLevel} onChange={(event) => updateForm("activityLevel", event.target.value)} required>
                        <option value="">Fizinio aktyvumo lygis *</option>
                        <option>Žemas — sėdimas darbas, nesportuoju</option>
                        <option>Vidutinis — pajudu 1–2 k. per savaitę</option>
                        <option>Aukštas — reguliariai sportuoju</option>
                      </select>
                      <select className="input-field" value={form.experience} onChange={(event) => updateForm("experience", event.target.value)}>
                        <option value="">Treniruočių patirtis</option>
                        <option>Pradedantysis</option>
                        <option>Sportavau anksčiau, grįžtu po pertraukos</option>
                        <option>Sportuoju reguliariai</option>
                        <option>Pažengęs</option>
                      </select>
                    </div>
                    <textarea className="input-field" style={{ marginTop: 12 }} rows="3" placeholder="Pagrindinis tikslas: jėga, svorio mažinimas, laikysena, energija ar kita... *" value={form.goal} onChange={(event) => updateForm("goal", event.target.value)} required />
                    <textarea className="input-field danger-border" style={{ marginTop: 12 }} rows="3" placeholder="SVARBU: traumos, skausmai, sveikatos apribojimai. Jei nėra, įrašykite „Nėra“ *" value={form.healthIssues} onChange={(event) => updateForm("healthIssues", event.target.value)} required />
                    <textarea className="input-field" style={{ marginTop: 12 }} rows="2" placeholder="Papildoma informacija treneriui" value={form.notes} onChange={(event) => updateForm("notes", event.target.value)} />
                  </>
                )}

                {step === 2 && (
                  <>
                    <h2 className="section-title">3. {requiresSchedule ? "Pageidaujamas laikas" : "Pageidaujamas ritmas"}</h2>
                    {requiresSchedule ? (
                      <>
                        <div className="slots-header">
                          <span className="slots-badge">{activeSlotsCount} laikai laisvi</span>
                        </div>
                        <input className="input-field" type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} style={{ marginBottom: 12 }} />
                        <div className="time-grid">
                          {availableSlots.map((slot) => (
                            <button key={slot.time} type="button" disabled={!slot.available} className={`time-btn ${selectedTime === slot.time ? "active" : ""}`} onClick={() => setSelectedTime(slot.time)}>
                              {slot.time}
                            </button>
                          ))}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="micro-note">{selectedService.nextStepNote}</div>
                        <div className="form-grid" style={{ marginTop: 12 }}>
                          <input className="input-field" placeholder="Kokiomis dienomis patogiausia? *" value={form.preferredDays} onChange={(event) => updateForm("preferredDays", event.target.value)} />
                          <input className="input-field" placeholder="Rytais, dieną ar vakarais? *" value={form.preferredTime} onChange={(event) => updateForm("preferredTime", event.target.value)} />
                        </div>
                        <select className="input-field" style={{ marginTop: 12 }} value={form.trainingPlace} onChange={(event) => updateForm("trainingPlace", event.target.value)}>
                          <option value="">Kur planuojate sportuoti?</option>
                          <option>Sporto salėje</option>
                          <option>Namuose</option>
                          <option>Lauke</option>
                          <option>Mišriai</option>
                        </select>
                      </>
                    )}
                  </>
                )}

                {step === 3 && (
                  <>
                    <h2 className="section-title">4. Kontaktai ir patvirtinimas</h2>
                    <div className="form-grid">
                      <input className="input-field" placeholder="Vardas ir pavardė *" value={form.name} onChange={(event) => updateForm("name", event.target.value)} required />
                      <input className="input-field" placeholder="Telefono numeris *" value={form.phone} onChange={(event) => updateForm("phone", event.target.value)} required />
                      <select className="input-field" value={form.contactMethod} onChange={(event) => updateForm("contactMethod", event.target.value)}>
                        <option>Telefonu</option>
                        <option>El. paštu</option>
                        <option>Instagram</option>
                      </select>
                      <input className="input-field" placeholder="El. paštas / Instagram" value={form.email} onChange={(event) => updateForm("email", event.target.value)} />
                    </div>
                    <label style={{ display: "flex", gap: 10, alignItems: "flex-start", marginTop: 14, color: "var(--muted)", fontSize: 13, fontWeight: 800, lineHeight: 1.5 }}>
                      <input type="checkbox" checked={form.consent} onChange={(event) => updateForm("consent", event.target.checked)} style={{ marginTop: 3 }} />
                      Sutinku, kad treneris susisiektų dėl paslaugos, plano, laikų ir registracijos patvirtinimo.
                    </label>
                  </>
                )}

                <div className="wizard-actions">
                  <button className="btn btn-light" type="button" onClick={() => (step === 0 ? onClose() : setStep((current) => current - 1))}>
                    {step === 0 ? "Uždaryti" : "Atgal"}
                  </button>
                  {step < wizardSteps.length - 1 ? (
                    <button className="btn btn-dark" type="button" disabled={!canContinue} onClick={() => setStep((current) => current + 1)}>
                      Toliau
                    </button>
                  ) : (
                    <button className="btn btn-dark" type="submit" disabled={!canContinue}>
                      Pateikti registraciją
                    </button>
                  )}
                </div>
              </section>

              <aside className="wizard-summary">
                <span className="eyebrow">Santrauka</span>
                <h3>{selectedService.title}</h3>
                <p>{selectedService.description}</p>
                <div style={{ marginTop: 18 }}>
                  <div className="summary-line"><span>Kaina</span><strong>{selectedService.price}</strong></div>
                  <div className="summary-line"><span>Formatas</span><strong>{requiresSchedule ? "Su laiku" : "Derinama"}</strong></div>
                  <div className="summary-line"><span>Laikas</span><strong>{requiresSchedule ? (selectedTime || "Nepasirinkta") : "Po pokalbio"}</strong></div>
                  <div className="summary-line"><span>Kontaktas</span><strong>{form.name || "Dar neįvestas"}</strong></div>
                </div>
                <p>{selectedService.nextStepNote}</p>
              </aside>
            </div>
          </form>
        ) : (
          <div className="success-box">
            <h2>Registracija sėkmingai gauta</h2>
            <p>{requiresSchedule ? `Pasirinktas laikas: ${selectedDate} · ${selectedTime}` : "Laikai ir treniravimo planas bus suderinti po pokalbio."}</p>
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
            <a href="#kam-tinka">Kam tinka</a>
            <a href="#paslaugos">Paslaugos</a>
            <a href="#metodika">Metodika</a>
            <a href="#saugumas">Saugumas</a>
            <a href="#kontaktai">Kontaktai</a>
          </nav>

          <button className="btn btn-dark" type="button" onClick={() => setBookingOpen(true)}>
            Pirma konsultacija
          </button>
        </div>
      </header>

      <section id="top" className="container hero">
        <div>
          <span className="eyebrow">Individualus treniravimas Kaune</span>
          <h1>Aiškus treniruočių planas ir saugus progresas per 4–8 savaites.</h1>
          <p>
            Individualios treniruotės žmonėms, kurie nori sportuoti protingai: su įvertinimu,
            aiškia metodika, krūvio kontrole ir profesionaliai paruošta programa pagal tikslą.
          </p>

          <div className="hero-actions">
            <button className="btn btn-dark" type="button" onClick={() => setBookingOpen(true)}>
              Registruotis į pirmą konsultaciją
            </button>
            <a className="btn btn-light" href="#metodika">
              Kaip vyksta procesas
            </a>
          </div>

          <div className="hero-points">
            <div className="point">
              <strong>1:1</strong>
              <span>individualus įvertinimas</span>
            </div>
            <div className="point">
              <strong>4–8 sav.</strong>
              <span>aiškus treniruočių etapas</span>
            </div>
            <div className="point">
              <strong>PDF</strong>
              <span>programa klientui</span>
            </div>
          </div>
        </div>

        <div className="hero-card" aria-label="Trenerio nuotrauka ir informacija">
          <div className="floating-card">
            <h3>Pradžia nuo įvertinimo, ne nuo atsitiktinių pratimų</h3>
            <p>
              Pirmiausia išsiaiškiname tikslą, patirtį, sveikatos apribojimus ir tik tada parenkame treniruočių kryptį.
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

      <section id="kam-tinka" className="container section">
        <div className="section-head">
          <h2>Kam tinka šis treniravimo formatas?</h2>
          <p className="section-lead">
            Šis formatas skirtas žmonėms, kurie nori ne tiesiog „pasportuoti“, o turėti aiškią kryptį, saugų krūvį ir suprasti, ką daro kiekvienoje treniruotėje.
          </p>
        </div>

        <div className="fit-grid">
          <article className="fit-card" data-no="01">
            <span className="eyebrow">Pradedantiems</span>
            <h3>Norite pradėti be chaoso ir traumų rizikos</h3>
            <p>Jei sporto salėje neaišku nuo ko pradėti, pirmiausia sutvarkome techniką, krūvį ir savaitės ritmą.</p>
          </article>
          <article className="fit-card" data-no="02">
            <span className="eyebrow">Po pertraukos</span>
            <h3>Grįžtate į sportą po ilgesnės pauzės</h3>
            <p>Krūvis didinamas palaipsniui, atsižvelgiant į savijautą, mobilumą ir ankstesnę patirtį.</p>
          </article>
          <article className="fit-card" data-no="03">
            <span className="eyebrow">Premium tikslui</span>
            <h3>Norite aiškaus plano, o ne atsitiktinių pratimų</h3>
            <p>Treniruotės sudedamos į sistemą: tikslas, pratimai, progresija, RPE, poilsis ir korekcijos.</p>
          </article>
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

      <section id="metodika" className="container section">
        <div className="section-head">
          <h2>Metodika: aiškus procesas nuo įvertinimo iki progreso.</h2>
          <p className="section-lead">
            Treniravimas remiasi ne atsitiktiniais pratimais, o struktūra: tikslas, įvertinimas, programa, kontrolė ir korekcijos.
          </p>
        </div>

        <div className="method-panel">
          <div className="method-intro">
            <span className="eyebrow">Metodika</span>
            <h3>Programa kuriama pagal žmogų, ne pagal šabloną.</h3>
            <p>
              Pirmoje konsultacijoje įvertinamas tikslas, patirtis, sveikatos apribojimai ir realus savaitės ritmas.
              Tik po to parenkama treniruočių sistema, pratimai ir progresijos taisyklės.
            </p>
          </div>

          <div className="method-list">
            <article className="method-item">
              <div className="method-no">01</div>
              <div>
                <h3>Tikslas ir pirminis įvertinimas</h3>
                <p>Aptariamas tikslas, aktyvumo lygis, patirtis, grafikas, galimi skausmai ir apribojimai.</p>
              </div>
            </article>
            <article className="method-item">
              <div className="method-no">02</div>
              <div>
                <h3>Individuali treniruočių kryptis</h3>
                <p>Parenkamas formatas: individualios treniruotės, abonementas, planas, nuotolinė priežiūra arba konsultacija.</p>
              </div>
            </article>
            <article className="method-item">
              <div className="method-no">03</div>
              <div>
                <h3>Progresijos taisyklės</h3>
                <p>Nustatomas krūvio didinimas, RPE / RIR gairės, poilsis, tempas ir kada reikia koreguoti programą.</p>
              </div>
            </article>
            <article className="method-item">
              <div className="method-no">04</div>
              <div>
                <h3>Programos korekcijos pagal savijautą</h3>
                <p>Programa peržiūrima pagal techniką, rezultatus, miego kokybę, nuovargį ir realų savaitės ritmą.</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="saugumas" className="container section">
        <div className="safety-card">
          <span className="eyebrow">Saugumas ir traumos</span>
          <h2>Saugus krūvio valdymas yra svarbiau už greitą rezultatą.</h2>
          <p className="section-lead" style={{ color: "rgba(255,255,255,.7)", marginTop: 16 }}>
            Prieš pradedant renkama informacija apie traumas, skausmus, sveikatos apribojimus ir ankstesnę patirtį.
            Tai leidžia parinkti pratimus, kurie padeda progresuoti be nereikalingos rizikos.
          </p>

          <div className="safety-grid">
            <article className="safety-item">
              <h3>Traumų istorija</h3>
              <p>Registracijos metu klausiama apie skausmus, apribojimus ir gydytojo rekomendacijas.</p>
            </article>
            <article className="safety-item">
              <h3>Technikos kontrolė</h3>
              <p>Pirmiausia vertinama judesio kokybė, amplitudė ir stabilumas, tik tada didinamas krūvis.</p>
            </article>
            <article className="safety-item">
              <h3>Krūvio korekcijos</h3>
              <p>Jei atsiranda diskomfortas ar nuovargis, pratimai keičiami, mažinama apimtis arba koreguojamas planas.</p>
            </article>
          </div>
        </div>
      </section>

      <section id="procesas" className="container section">
        <div className="section-head">
          <h2>Nuo pirmos konsultacijos iki aiškios treniruočių programos.</h2>
          <p className="section-lead">
            Procesas sukurtas taip, kad klientas jaustų aiškumą: nuo pirminės anketos iki saugaus plano ir tolimesnių korekcijų.
          </p>
        </div>

        <div className="steps">
          <article className="step" data-no="01">
            <span className="eyebrow">Startas</span>
            <h3>Pirma konsultacija</h3>
            <p>Užpildote trumpą anketą apie tikslą, patirtį, sveikatą ir pageidaujamą treniruočių ritmą.</p>
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

      <section id="pasitikejimas" className="container section">
        <div className="section-head">
          <h2>Pasitikėjimo pagrindas: patirtis, metodika ir aiškūs rezultatai.</h2>
          <p className="section-lead">
            Premium klientui svarbu ne vien gražus puslapis. Jis turi matyti, kad treniravimas paremtas aiškiu procesu, saugumu ir realiomis istorijomis.
          </p>
        </div>

        <div className="trust-board">
          <div className="trust-dark">
            <span className="eyebrow">Pasitikėjimas</span>
            <h2>Ne „atsitiktinė treniruotė“, o valdoma sistema.</h2>
            <p>
              Kiekvienas klientas pradedamas nuo tikslo, patirties, sveikatos informacijos ir realaus savaitės ritmo.
              Tai leidžia sudaryti aiškią programą, valdyti krūvį ir klientui parodyti profesionalų planą.
            </p>

            <div className="trust-metrics">
              <div className="trust-metric">
                <strong>200+</strong>
                <span>demo treniruočių patirtis</span>
              </div>
              <div className="trust-metric">
                <strong>4–8 sav.</strong>
                <span>aiškus progreso etapas</span>
              </div>
              <div className="trust-metric">
                <strong>1:1</strong>
                <span>individuali kryptis</span>
              </div>
              <div className="trust-metric">
                <strong>PDF</strong>
                <span>programa klientui</span>
              </div>
            </div>
          </div>

          <div className="story-grid">
            <article className="story-card">
              <small>Kliento istorija</small>
              <h3>Pradedantysis be aiškaus plano</h3>
              <p>Problema: neaišku, ką daryti sporto salėje. Sprendimas: baziniai judesiai, technika, krūvio kontrolė ir 4 savaičių starto planas.</p>
            </article>
            <article className="story-card">
              <small>Rezultatas</small>
              <h3>Grįžimas po pertraukos</h3>
              <p>Krūvis didinamas palaipsniui, vengiant per greito starto. Programa koreguojama pagal savijautą, miegą ir judesių kokybę.</p>
            </article>
            <article className="story-card">
              <small>Metodika</small>
              <h3>Progresija, ne spėlionės</h3>
              <p>Kiekvienas pratimas turi serijas, pakartojimus, RPE / RIR, poilsį, tempą, alternatyvas ir saugumo pastabas.</p>
            </article>
          </div>
        </div>
      </section>

      <section id="atsiliepimai" className="container section">
        <div className="section-head">
          <h2>Ką sako klientai.</h2>
          <p className="section-lead">
            Demo istorijos parodo, kokią žinutę verta komunikuoti realioje svetainėje: aiškumas, saugumas, progresas ir pasitikėjimas.
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
            <h2>Pradėkite nuo pirmos konsultacijos.</h2>
            <p>
              Užpildykite trumpą anketą, o treneris susisieks aptarti tikslo, saugumo informacijos,
              treniruočių formato ir tinkamiausio plano.
            </p>
            <button className="btn btn-lime" type="button" onClick={() => setBookingOpen(true)}>
              Registruotis į pirmą konsultaciją
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
