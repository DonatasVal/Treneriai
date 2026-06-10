import { useEffect, useMemo, useState } from "react";

const services = [
  {
    id: "one",
    title: "Pirma konsultacija ir įvertinimas",
    price: "35 €",
    meta: "60 min. · Saugi pradžia",
    description: "Įvertiname tikslą, patirtį, judėjimo istoriją ir parenkame tinkamiausią treniruočių kryptį.",
    bullets: ["Tikslas ir lūkesčiai", "Patirties bei apribojimų peržiūra", "Pirminė treniruočių kryptis"],
    result: "aiškus startas be spėlionių ir saugesnis pirmas krūvis.",
    durationMin: 60,
    requiresSchedule: true,
    bookingType: "vizitas",
    nextStepNote: "Pasirinkite jums tinkamą datą ir laiką. Treneris patvirtins registraciją asmeniškai.",
  },
  {
    id: "sub",
    title: "Individualios treniruotės",
    price: "nuo 120 €",
    meta: "mėn. · Darbas 1:1",
    description: "Reguliarus darbas su technikos kontrole, krūvio valdymu ir progresu pagal jūsų fizinę būklę.",
    bullets: ["Gyvos treniruotės 1:1", "Technikos ir krūvio kontrolė", "Korekcijos pagal savijautą"],
    result: "nuoseklus progresas, aiškus savaitės ritmas ir mažiau chaoso.",
    durationMin: 0,
    requiresSchedule: false,
    bookingType: "abonementas",
    nextStepNote: "Datos rinktis nereikia. Užsiregistravus susisieksime apsitarti treniravimo plano, savaitinio ritmo ir tinkamiausių laikų.",
  },
  {
    id: "plan",
    title: "Sporto programa savarankiškam darbui",
    price: "89 €",
    meta: "4 savaitės · PDF planas",
    description: "Individualus planas su pratimais, serijomis, pakartojimais, poilsiu, tempu ir alternatyvomis.",
    bullets: ["Pratimai ir alternatyvos", "Serijos, pakartojimai, poilsis", "PDF programa klientui"],
    result: "ne pratimų sąrašas, o aiški veiksmų sistema pagal tikslą.",
    durationMin: 0,
    requiresSchedule: false,
    bookingType: "planas",
    nextStepNote: "Datos rinktis nereikia. Po registracijos susisieksime, surinksime papildomą informaciją ir paruošime individualų planą.",
  },
  {
    id: "online",
    title: "Nuotolinė priežiūra",
    price: "129 €",
    meta: "mėn. · Planas ir korekcijos",
    description: "Tinka, kai sportuojate savarankiškai, bet norite aiškios struktūros, palaikymo ir plano korekcijų.",
    bullets: ["Programos korekcijos", "Reguliarus grįžtamasis ryšys", "Progreso ir savijautos stebėjimas"],
    result: "kryptis ir kontrolė net tada, kai treniruojatės nuotoliu.",
    durationMin: 0,
    requiresSchedule: false,
    bookingType: "nuotoliu",
    nextStepNote: "Datos rinktis nereikia. Užsiregistravus susisieksime aptarti tikslo, esamo režimo, treniruočių plano ir komunikacijos formato.",
  },
  {
    id: "food",
    title: "Bendros mitybos gairės",
    price: "45 €",
    meta: "45 min. · Papildomas priedas",
    description: "Praktiškos sporto mitybos gairės, padedančios palaikyti treniruočių tikslą, energiją ir atsistatymą.",
    bullets: ["Valgymo struktūra", "Treniruočių dienų gairės", "Praktiški pasirinkimai kasdienai"],
    result: "aiškesnė mitybos kryptis, suderinta su treniruočių programa.",
    durationMin: 45,
    requiresSchedule: true,
    bookingType: "konsultacija",
    nextStepNote: "Pasirinkite pageidaujamą konsultacijos datą ir laiką. Treneris susisieks dėl patvirtinimo.",
  },
];

const slots = ["07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"];

const existingSessions = [
  {
    id: "s1",
    date: "2026-06-08",
    start: "10:00",
    durationMin: 60,
    status: "confirmed",
  },
  {
    id: "s2",
    date: "2026-06-08",
    start: "17:00",
    durationMin: 60,
    status: "confirmed",
  },
];

function timeToMinutes(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function rangesOverlap(startA, endA, startB, endB) {
  return Math.max(startA, startB) < Math.min(endA, endB);
}

function isSlotAvailable({ date, time, durationMin, sessions }) {
  const start = timeToMinutes(time);
  const end = start + durationMin;

  return !sessions.some((session) => {
    if (session.date !== date) return false;
    if (["cancelled", "rejected", "Atšaukta", "Atmestas"].includes(session.status)) return false;

    const sessionStart = timeToMinutes(session.start || session.time);
    const sessionEnd = sessionStart + session.durationMin;

    return rangesOverlap(start, end, sessionStart, sessionEnd);
  });
}

const css = `
  :root {
    --ink: #172019;
    --muted: #657169;
    --soft: #8a958d;
    --paper: #fbfaf5;
    --cream: #f2ecdf;
    --cream-2: #f7f3ea;
    --white: rgba(255, 255, 255, .78);
    --line: rgba(23, 32, 25, .10);
    --line-strong: rgba(23, 32, 25, .16);
    --forest: #193722;
    --forest-2: #244b33;
    --sage: #e8efe3;
    --sage-2: #f1f6ed;
    --lime: #c7ef5f;
    --lime-soft: #f1fad8;
    --rose: #fff1f2;
    --shadow: 0 24px 70px rgba(30, 42, 31, .10);
    --shadow-soft: 0 16px 44px rgba(30, 42, 31, .07);
  }

  * { box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  body {
    margin: 0;
    background: var(--paper);
    color: var(--ink);
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    text-rendering: optimizeLegibility;
  }
  button, input, select, textarea { font: inherit; }
  a { color: inherit; }

  .landing {
    min-height: 100vh;
    background:
      radial-gradient(circle at 12% 8%, rgba(199, 239, 95, .16), transparent 27%),
      radial-gradient(circle at 86% 4%, rgba(255, 255, 255, .94), transparent 27%),
      linear-gradient(180deg, #fbfaf5 0%, #f3eee3 52%, #fbfaf5 100%);
  }

  .container { width: min(1180px, calc(100% - 44px)); margin: 0 auto; }

  .header {
    position: sticky;
    top: 0;
    z-index: 30;
    backdrop-filter: blur(22px);
    background: rgba(251, 250, 245, .84);
    border-bottom: 1px solid rgba(23, 32, 25, .08);
  }

  .nav {
    min-height: 76px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 12px;
    text-decoration: none;
    color: var(--ink);
    min-width: max-content;
  }

  .brand-mark {
    width: 44px;
    height: 44px;
    border-radius: 15px;
    display: grid;
    place-items: center;
    background: var(--forest);
    color: white;
    font-weight: 950;
    letter-spacing: -.04em;
    box-shadow: 0 16px 42px rgba(25, 55, 34, .22);
  }

  .brand strong { display: block; font-size: 15px; letter-spacing: -.035em; }
  .brand span { display: block; margin-top: 2px; color: var(--muted); font-size: 12px; font-weight: 750; }

  .nav-links {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 7px;
    border: 1px solid rgba(23, 32, 25, .07);
    background: rgba(255, 255, 255, .58);
    border-radius: 999px;
  }

  .nav-links a {
    color: rgba(23, 32, 25, .62);
    text-decoration: none;
    font-size: 13px;
    font-weight: 850;
    padding: 10px 12px;
    border-radius: 999px;
  }

  .nav-links a:hover {
    color: var(--forest);
    background: rgba(25, 55, 34, .06);
  }

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
    transition: transform .18s ease, box-shadow .18s ease, background .18s ease, border-color .18s ease;
    white-space: nowrap;
  }

  .btn:hover { transform: translateY(-2px); }
  .btn:disabled { opacity: .48; cursor: not-allowed; transform: none; }
  .btn-dark { background: var(--forest); color: white; box-shadow: 0 18px 45px rgba(25, 55, 34, .20); }
  .btn-light { background: rgba(255,255,255,.82); color: var(--ink); border: 1px solid var(--line); }
  .btn-lime { background: var(--lime); color: var(--forest); box-shadow: 0 16px 40px rgba(150, 180, 55, .18); }

  .hero {
    padding: 72px 0 42px;
    display: grid;
    grid-template-columns: minmax(0, 1.02fr) minmax(360px, .98fr);
    gap: 54px;
    align-items: center;
  }

  .eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    border: 1px solid rgba(23, 32, 25, .10);
    background: rgba(255, 255, 255, .70);
    border-radius: 999px;
    padding: 8px 12px;
    color: rgba(23, 32, 25, .58);
    font-size: 11px;
    font-weight: 950;
    text-transform: uppercase;
    letter-spacing: .13em;
  }

  .eyebrow::before {
    content: "";
    width: 8px;
    height: 8px;
    border-radius: 999px;
    background: var(--lime);
    box-shadow: 0 0 0 6px rgba(199, 239, 95, .24);
  }

  .hero h1 {
    margin: 22px 0 0;
    max-width: 880px;
    font-size: clamp(2.65rem, 4.8vw, 4.9rem);
    line-height: .98;
    letter-spacing: -.06em;
    font-weight: 950;
    text-wrap: balance;
  }

  .hero p {
    margin: 22px 0 0;
    color: rgba(23, 32, 25, .66);
    font-size: clamp(1.02rem, 1.35vw, 1.16rem);
    line-height: 1.72;
    max-width: 650px;
  }

  .hero-trust {
    margin-top: 18px;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    color: rgba(23, 32, 25, .70);
    font-size: 13px;
    font-weight: 850;
    background: rgba(255,255,255,.62);
    border: 1px solid rgba(23, 32, 25, .08);
    border-radius: 999px;
    padding: 9px 12px;
  }

  .hero-trust::before {
    content: "";
    width: 8px;
    height: 8px;
    border-radius: 999px;
    background: var(--forest);
    flex: 0 0 auto;
  }

  .hero-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 30px; }

  .hero-points {
    margin-top: 34px;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
    max-width: 720px;
  }

  .point {
    border: 1px solid rgba(23, 32, 25, .08);
    background: rgba(255,255,255,.68);
    border-radius: 22px;
    padding: 18px;
    box-shadow: var(--shadow-soft);
  }

  .point strong { display: block; color: var(--forest); font-size: 21px; font-weight: 950; letter-spacing: -.04em; }
  .point span { display: block; margin-top: 5px; color: var(--muted); font-size: 13px; line-height: 1.38; font-weight: 750; }

  .hero-card {
    min-height: 570px;
    border-radius: 42px;
    position: relative;
    overflow: hidden;
    border: 1px solid rgba(23, 32, 25, .10);
    box-shadow: var(--shadow);
    background:
      linear-gradient(180deg, rgba(255,255,255,.18), rgba(255,255,255,.72)),
      linear-gradient(135deg, #dfe8d7 0%, #f8f2e6 54%, #dce8d4 100%);
  }

  .hero-card::before {
    content: "";
    position: absolute;
    inset: 28px 28px 142px;
    border-radius: 32px;
    border: 0;
    background:
      linear-gradient(180deg, rgba(25, 55, 34, .04), rgba(25, 55, 34, .18)),
      url("/treneris-hero.png") center / cover no-repeat;
    display: block;
  }

  .floating-card {
    position: absolute;
    left: 26px;
    right: 26px;
    bottom: 26px;
    background: rgba(255,255,255,.88);
    border: 1px solid rgba(23, 32, 25, .08);
    backdrop-filter: blur(16px);
    border-radius: 30px;
    padding: 24px;
    box-shadow: 0 18px 48px rgba(25, 55, 34, .13);
  }

  .floating-card h3 { margin: 0; font-size: 22px; letter-spacing: -.04em; line-height: 1.12; }
  .floating-card p { margin: 12px 0 0; color: var(--muted); line-height: 1.62; font-size: 14.5px; }

  .mini-row { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 18px; }
  .mini-pill {
    border-radius: 999px;
    padding: 8px 10px;
    background: var(--sage-2);
    color: var(--forest);
    font-size: 12px;
    font-weight: 900;
  }

  .section { padding: 64px 0; }
  .section-head { max-width: 780px; margin-bottom: 30px; }

  .section-head h2,
  .contact-card h2,
  .safety-card h2,
  .trust-dark h2 {
    margin: 0;
    color: var(--ink);
    font-size: clamp(2rem, 3.2vw, 3.45rem);
    line-height: 1.02;
    letter-spacing: -.055em;
    font-weight: 950;
    text-wrap: balance;
  }

  .section-lead {
    margin: 16px 0 0;
    color: rgba(23, 32, 25, .62);
    font-size: 1.04rem;
    line-height: 1.72;
  }

  .promise-section { padding-top: 28px; }
  .promise-card {
    display: grid;
    grid-template-columns: .82fr 1.18fr;
    gap: 28px;
    align-items: center;
    border: 1px solid rgba(23, 32, 25, .09);
    background: rgba(255, 255, 255, .72);
    border-radius: 38px;
    padding: 34px;
    box-shadow: var(--shadow-soft);
  }

  .promise-card h2 {
    margin: 12px 0 0;
    font-size: clamp(1.8rem, 2.6vw, 3rem);
    line-height: 1.04;
    letter-spacing: -.05em;
  }

  .promise-card p {
    margin: 0;
    color: rgba(23, 32, 25, .66);
    font-size: 1.05rem;
    line-height: 1.75;
  }

  .promise-points {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin-top: 18px;
  }

  .promise-points span {
    border-radius: 18px;
    background: var(--lime-soft);
    color: var(--forest);
    padding: 12px;
    font-size: 13px;
    font-weight: 900;
  }

  .fit-grid,
  .cards,
  .steps,
  .reviews,
  .results,
  .safety-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 18px;
  }

  .fit-card,
  .card,
  .step,
  .review,
  .result,
  .safety-item,
  .story-card,
  .wizard-panel,
  .wizard-summary {
    border: 1px solid rgba(23, 32, 25, .08);
    background: rgba(255,255,255,.74);
    border-radius: 30px;
    padding: 26px;
    box-shadow: var(--shadow-soft);
  }

  .fit-card { position: relative; overflow: hidden; }
  .fit-card::after {
    content: attr(data-no);
    position: absolute;
    right: 20px;
    top: 16px;
    color: rgba(25, 55, 34, .10);
    font-size: 54px;
    font-weight: 950;
    letter-spacing: -.06em;
  }

  .fit-card h3,
  .card h3,
  .step h3,
  .story-card h3,
  .safety-item h3 {
    margin: 14px 0 0;
    font-size: 21px;
    line-height: 1.12;
    letter-spacing: -.04em;
  }

  .fit-card p,
  .card p,
  .step p,
  .story-card p,
  .safety-item p,
  .review p {
    margin: 12px 0 0;
    color: var(--muted);
    line-height: 1.65;
  }

  .about-grid {
    display: grid;
    grid-template-columns: .88fr 1.12fr;
    gap: 22px;
    align-items: stretch;
  }

  .about-photo {
    min-height: 520px;
    border-radius: 38px;
    position: relative;
    overflow: hidden;
    border: 1px solid rgba(23, 32, 25, .10);
    background:
      linear-gradient(145deg, rgba(25,55,34,.12), rgba(255,255,255,.58)),
      #e7eadf;
    box-shadow: var(--shadow-soft);
  }

  .about-photo::after {
    content: "Trenerio nuotraukos vieta";
    position: absolute;
    inset: 24px;
    border: 1px dashed rgba(25, 55, 34, .24);
    border-radius: 30px;
    display: grid;
    place-items: center;
    color: rgba(25,55,34,.48);
    font-weight: 900;
    letter-spacing: .04em;
    text-transform: uppercase;
    font-size: 12px;
  }

  .about-text {
    min-height: 520px;
    border-radius: 38px;
    padding: 34px;
    border: 1px solid rgba(23, 32, 25, .08);
    background: rgba(255,255,255,.76);
    box-shadow: var(--shadow-soft);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .about-text p {
    color: rgba(23, 32, 25, .68);
    font-size: 1.04rem;
    line-height: 1.72;
    margin: 0;
  }

  .about-list { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-top: 26px; }
  .about-item { border-radius: 22px; background: var(--sage-2); padding: 16px; }
  .about-item strong { display: block; color: var(--forest); letter-spacing: -.03em; }
  .about-item span { display: block; margin-top: 6px; color: var(--muted); font-size: 13px; line-height: 1.48; font-weight: 700; }

  .card { display: flex; flex-direction: column; min-height: 100%; }
  .service-kicker {
    display: inline-flex;
    width: fit-content;
    border-radius: 999px;
    padding: 7px 10px;
    background: var(--sage-2);
    color: var(--forest);
    font-size: 12px;
    font-weight: 900;
  }

  .service-bullets {
    list-style: none;
    padding: 0;
    margin: 18px 0 0;
    display: grid;
    gap: 9px;
  }

  .service-bullets li {
    color: rgba(23,32,25,.68);
    font-size: 14px;
    line-height: 1.45;
    font-weight: 760;
    display: flex;
    gap: 9px;
  }

  .service-bullets li::before {
    content: "";
    width: 7px;
    height: 7px;
    border-radius: 999px;
    background: var(--lime);
    margin-top: 7px;
    flex: 0 0 auto;
  }

  .card-result {
    margin-top: 18px;
    border-radius: 20px;
    background: rgba(242, 236, 223, .78);
    padding: 14px;
    color: rgba(23, 32, 25, .70);
    font-size: 13px;
    line-height: 1.55;
    font-weight: 760;
  }

  .card-result strong { color: var(--forest); }

  .card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-top: auto;
    padding-top: 20px;
  }

  .price {
    color: var(--forest);
    font-size: 16px;
    font-weight: 950;
    letter-spacing: -.03em;
  }

  .btn-card { padding: 11px 15px; font-size: 13px; }

  .method-panel {
    display: grid;
    grid-template-columns: .8fr 1.2fr;
    gap: 20px;
    align-items: stretch;
  }

  .method-intro {
    border-radius: 36px;
    padding: 34px;
    background: var(--forest);
    color: white;
    box-shadow: 0 24px 70px rgba(25, 55, 34, .18);
  }

  .method-intro .eyebrow,
  .safety-card .eyebrow,
  .contact-card .eyebrow {
    color: rgba(255,255,255,.76);
    border-color: rgba(255,255,255,.16);
    background: rgba(255,255,255,.08);
  }

  .method-intro h3 {
    margin: 16px 0 0;
    font-size: clamp(1.7rem, 2.25vw, 2.55rem);
    line-height: 1.04;
    letter-spacing: -.05em;
  }

  .method-intro p { color: rgba(255,255,255,.72); line-height: 1.72; }
  .method-list { display: grid; gap: 14px; }

  .method-item {
    border-radius: 28px;
    padding: 22px;
    border: 1px solid rgba(23, 32, 25, .08);
    background: rgba(255,255,255,.76);
    display: grid;
    grid-template-columns: 62px 1fr;
    gap: 16px;
    box-shadow: var(--shadow-soft);
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

  .method-item h3 { margin: 0; font-size: 20px; letter-spacing: -.035em; }
  .method-item p { margin: 8px 0 0; color: var(--muted); line-height: 1.6; }

  .safety-card {
    border-radius: 40px;
    padding: 38px;
    background:
      radial-gradient(circle at 80% 8%, rgba(199,239,95,.18), transparent 30%),
      var(--forest);
    color: white;
    box-shadow: 0 26px 76px rgba(25, 55, 34, .18);
  }

  .safety-card h2,
  .contact-card h2 { color: white; }

  .safety-card .section-lead,
  .contact-card p {
    color: rgba(255,255,255,.72);
  }

  .safety-grid { margin-top: 28px; }
  .safety-item {
    background: rgba(255,255,255,.09);
    border-color: rgba(255,255,255,.14);
    box-shadow: none;
  }

  .safety-item h3 { color: white; }
  .safety-item p { color: rgba(255,255,255,.72); }

  .steps { grid-template-columns: repeat(4, 1fr); }
  .step { position: relative; overflow: hidden; }
  .step::after {
    content: attr(data-no);
    position: absolute;
    right: 18px;
    top: 14px;
    color: rgba(25, 55, 34, .09);
    font-size: 46px;
    font-weight: 950;
  }

  .results {
    grid-template-columns: repeat(4, 1fr);
    background: rgba(255,255,255,.64);
    border: 1px solid rgba(23, 32, 25, .08);
    border-radius: 34px;
    padding: 16px;
    box-shadow: var(--shadow-soft);
  }

  .result {
    text-align: center;
    box-shadow: none;
    background: transparent;
    border: 0;
  }

  .result strong {
    display: block;
    font-size: 34px;
    color: var(--forest);
    letter-spacing: -.05em;
  }

  .result span {
    display: block;
    margin-top: 6px;
    color: var(--muted);
    font-size: 13px;
    line-height: 1.4;
    font-weight: 800;
  }

  .trust-board {
    display: grid;
    grid-template-columns: .95fr 1.05fr;
    gap: 20px;
    align-items: stretch;
  }

  .trust-dark {
    border-radius: 38px;
    padding: 34px;
    background: rgba(255,255,255,.76);
    border: 1px solid rgba(23, 32, 25, .08);
    box-shadow: var(--shadow-soft);
  }

  .trust-dark p { color: var(--muted); line-height: 1.7; }
  .trust-metrics { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-top: 24px; }
  .trust-metric { border-radius: 20px; background: var(--sage-2); padding: 14px; }
  .trust-metric strong { display: block; color: var(--forest); font-weight: 950; font-size: 20px; }
  .trust-metric span { display: block; color: var(--muted); font-size: 12px; margin-top: 4px; font-weight: 800; }
  .story-grid { display: grid; gap: 14px; }
  .story-card small { color: var(--forest); font-weight: 950; text-transform: uppercase; letter-spacing: .12em; }

  .reviews { grid-template-columns: repeat(3, 1fr); }
  .review p { font-size: 17px; color: rgba(23,32,25,.72); }
  .review strong { display: block; margin-top: 18px; color: var(--forest); }

  .contact-card {
    display: grid;
    grid-template-columns: 1.05fr .95fr;
    gap: 28px;
    align-items: center;
    border-radius: 42px;
    padding: 40px;
    background: var(--forest);
    color: white;
    box-shadow: 0 26px 76px rgba(25, 55, 34, .18);
    position: relative;
    overflow: hidden;
  }

  .contact-card::before {
    content: "";
    position: absolute;
    inset: -90px auto auto -80px;
    width: 260px;
    height: 260px;
    border-radius: 999px;
    background: rgba(199,239,95,.18);
  }

  .contact-card > * { position: relative; z-index: 1; }
  .contact-card h2 { margin-top: 14px; }
  .contact-card p { line-height: 1.72; max-width: 650px; }

  .contact-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 22px;
  }

  .contact-box {
    border-radius: 30px;
    background: rgba(255,255,255,.10);
    border: 1px solid rgba(255,255,255,.14);
    padding: 20px;
  }

  .contact-line {
    display: flex;
    justify-content: space-between;
    gap: 18px;
    padding: 16px 0;
    border-bottom: 1px solid rgba(255,255,255,.12);
  }

  .contact-line:last-child { border-bottom: 0; }
  .contact-line span { color: rgba(255,255,255,.62); font-size: 13px; font-weight: 800; }
  .contact-line strong { text-align: right; font-weight: 950; }

  .footer {
    padding: 26px 0 46px;
    color: rgba(23, 32, 25, .48);
    font-size: 13px;
    font-weight: 800;
  }

  /* Booking modal */
  .modal-backdrop {
    position: fixed;
    inset: 0;
    z-index: 90;
    background: rgba(14, 24, 18, .54);
    backdrop-filter: blur(16px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 22px;
  }

  .modal {
    width: min(1100px, 100%);
    max-height: calc(100vh - 44px);
    overflow: auto;
    border-radius: 38px;
    background: var(--paper);
    padding: 30px;
    box-shadow: 0 30px 90px rgba(0,0,0,.26);
    border: 1px solid rgba(255,255,255,.44);
  }

  .reg-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 22px; margin-bottom: 22px; }
  .reg-title { margin: 0; font-size: clamp(2rem, 3vw, 3rem); line-height: 1.02; letter-spacing: -.055em; }
  .reg-sub { margin: 9px 0 0; color: var(--muted); line-height: 1.6; font-size: 14.5px; }

  .close-btn {
    width: 42px;
    height: 42px;
    border-radius: 999px;
    border: 1px solid var(--line);
    background: white;
    color: var(--ink);
    font-size: 24px;
    cursor: pointer;
  }

  .wizard-tabs {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
    margin-bottom: 18px;
  }

  .wizard-tab {
    border: 1px solid var(--line);
    background: rgba(255,255,255,.72);
    color: rgba(23,32,25,.58);
    border-radius: 999px;
    padding: 11px 10px;
    font-size: 12px;
    font-weight: 900;
    cursor: pointer;
  }

  .wizard-tab.active { background: var(--forest); color: white; border-color: var(--forest); }
  .wizard-tab.done { background: var(--lime-soft); color: var(--forest); }

  .wizard-layout {
    display: grid;
    grid-template-columns: minmax(0, 1.35fr) minmax(280px, .65fr);
    gap: 18px;
    align-items: start;
  }

  .wizard-summary { position: sticky; top: 96px; }
  .wizard-summary h3 { margin: 16px 0 0; font-size: 24px; line-height: 1.08; letter-spacing: -.04em; }
  .wizard-summary p { color: var(--muted); line-height: 1.62; }

  .summary-line {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    padding: 12px 0;
    border-bottom: 1px solid var(--line);
  }

  .summary-line span { color: var(--muted); font-size: 13px; font-weight: 850; }
  .summary-line strong { text-align: right; }

  .section-title { margin: 0 0 14px; font-size: 23px; line-height: 1.1; letter-spacing: -.04em; }

  .input-field {
    width: 100%;
    border: 1px solid rgba(23, 32, 25, .11);
    background: white;
    border-radius: 18px;
    padding: 15px 16px;
    font-size: 15px;
    color: var(--ink);
    outline: none;
  }

  .input-field::placeholder { color: #9aa39d; }
  .input-field:focus { border-color: var(--forest); box-shadow: 0 0 0 4px rgba(25, 55, 34, .07); }
  .danger-border { border-color: rgba(220, 38, 38, .30) !important; background: #fffafa; }

  .field-hint {
    margin-top: 7px;
    color: rgba(23, 32, 25, .54);
    font-size: 12px;
    font-weight: 800;
    line-height: 1.48;
  }

  .form-grid,
  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .quick-goals { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
  .quick-goal {
    border: 1px solid rgba(23, 32, 25, .10);
    background: var(--sage-2);
    color: var(--forest);
    border-radius: 999px;
    padding: 10px 12px;
    font-size: 13px;
    font-weight: 900;
    cursor: pointer;
  }

  .service-list.wizard-services {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .service-card {
    border: 1px solid rgba(23, 32, 25, .10);
    background: white;
    border-radius: 22px;
    padding: 18px;
    text-align: left;
    cursor: pointer;
  }

  .service-card.active { border-color: var(--forest); background: var(--lime-soft); }
  .service-name { margin: 0; font-size: 17px; letter-spacing: -.03em; }
  .service-meta { color: var(--muted); font-size: 13px; line-height: 1.45; font-weight: 760; }

  .micro-note {
    margin-top: 12px;
    border-radius: 18px;
    background: var(--lime-soft);
    color: var(--forest);
    padding: 12px 14px;
    font-size: 12px;
    line-height: 1.55;
    font-weight: 850;
  }

  .slots-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
  .slots-badge { display: inline-flex; border-radius: 999px; padding: 8px 10px; background: var(--lime-soft); color: var(--forest); font-size: 12px; font-weight: 950; }
  .time-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 9px; }

  .time-btn {
    border: 1px solid rgba(23, 32, 25, .10);
    background: white;
    color: var(--ink);
    border-radius: 16px;
    padding: 13px 0;
    font-weight: 950;
    cursor: pointer;
  }

  .time-btn.active { background: var(--forest); color: white; border-color: var(--forest); }
  .time-btn:disabled { color: #a8b0aa; background: #f1f0ea; cursor: not-allowed; text-decoration: line-through; }
  .wizard-actions { display: flex; justify-content: space-between; gap: 12px; margin-top: 22px; }
  .success-box { border-radius: 28px; background: var(--lime-soft); padding: 28px; color: var(--forest); }

  @media (max-width: 1040px) {
    .nav-links { display: none; }
    .hero { grid-template-columns: 1fr; padding-top: 54px; }
    .hero-card { min-height: 480px; }
    .promise-card,
    .about-grid,
    .method-panel,
    .trust-board,
    .contact-card {
      grid-template-columns: 1fr;
    }
    .cards,
    .fit-grid,
    .reviews,
    .safety-grid {
      grid-template-columns: 1fr 1fr;
    }
    .steps,
    .results {
      grid-template-columns: repeat(2, 1fr);
    }
    .wizard-layout { grid-template-columns: 1fr; }
    .wizard-summary { position: static; }
    .time-grid { grid-template-columns: repeat(4, 1fr); }
  }

  @media (max-width: 640px) {
    .container { width: calc(100% - 24px); }
    .brand span { display: none; }
    .brand-mark { width: 40px; height: 40px; border-radius: 14px; }
    .nav { min-height: 68px; }
    .nav .btn { padding: 11px 14px; font-size: 13px; }
    .btn { width: 100%; padding: 15px 18px; }
    .hero { padding: 34px 0 34px; gap: 26px; }
    .hero h1 { font-size: clamp(2.15rem, 10vw, 3.15rem); line-height: 1; letter-spacing: -.054em; }
    .hero p { font-size: 15.5px; line-height: 1.62; }
    .hero-actions { flex-direction: column; }
    .hero-trust { border-radius: 18px; align-items: flex-start; }
    .hero-points,
    .promise-points,
    .cards,
    .fit-grid,
    .reviews,
    .safety-grid,
    .steps,
    .results {
      grid-template-columns: 1fr;
    }
    .hero-card { min-height: 420px; border-radius: 30px; }
    .hero-card::before { inset: 16px 16px 118px; border-radius: 22px; }
    .floating-card { left: 16px; right: 16px; bottom: 16px; border-radius: 22px; padding: 18px; }
    .section { padding: 44px 0; }
    .section-head h2,
    .contact-card h2,
    .safety-card h2,
    .trust-dark h2 {
      font-size: clamp(1.9rem, 9vw, 2.65rem);
    }
    .promise-card,
    .contact-card,
    .safety-card,
    .method-intro,
    .trust-dark,
    .about-text {
      border-radius: 28px;
      padding: 24px;
    }
    .fit-card,
    .card,
    .step,
    .review,
    .result,
    .safety-item,
    .story-card {
      border-radius: 24px;
      padding: 22px;
    }
    .about-photo { min-height: 360px; border-radius: 28px; }
    .about-list,
    .form-grid,
    .form-row,
    .service-list.wizard-services {
      grid-template-columns: 1fr;
    }
    .method-item { grid-template-columns: 1fr; }
    .card-footer,
    .contact-actions,
    .wizard-actions {
      align-items: flex-start;
      flex-direction: column;
    }
    .contact-line { flex-direction: column; gap: 5px; }
    .contact-line strong { text-align: left; }
    .modal-backdrop { padding: 0; align-items: stretch; }
    .modal { width: 100%; max-height: 100vh; border-radius: 0; padding: 20px; }
    .reg-header { gap: 12px; }
    .reg-title { font-size: 28px; }
    .wizard-tabs { grid-template-columns: 1fr 1fr; }
    .wizard-tab { font-size: 11px; padding: 10px 8px; }
    .time-grid { grid-template-columns: repeat(2, 1fr); }
    .input-field { font-size: 16px; padding: 15px 16px; }
    .wizard-panel,
    .wizard-summary {
      border-radius: 24px;
      padding: 18px;
    }
  }

  /* Modern premium motion layer */
  .landing {
    position: relative;
    overflow-x: hidden;
  }

  .landing::before {
    content: "";
    position: fixed;
    inset: -20% -10% auto -10%;
    height: 52vh;
    pointer-events: none;
    background:
      radial-gradient(circle at 18% 26%, rgba(199, 239, 95, .13), transparent 28%),
      radial-gradient(circle at 78% 18%, rgba(255, 255, 255, .72), transparent 30%);
    filter: blur(6px);
    opacity: .9;
    z-index: 0;
    animation: ambientDrift 16s ease-in-out infinite alternate;
  }

  .header,
  .hero,
  .section,
  .footer {
    position: relative;
    z-index: 1;
  }

  @keyframes ambientDrift {
    from { transform: translate3d(-1.5%, -1%, 0) scale(1); }
    to { transform: translate3d(1.5%, 2%, 0) scale(1.04); }
  }

  @keyframes softFloat {
    0%, 100% { transform: translate3d(0, 0, 0); }
    50% { transform: translate3d(0, -10px, 0); }
  }

  @keyframes softPulse {
    0%, 100% { box-shadow: 0 18px 45px rgba(25, 55, 34, .20); }
    50% { box-shadow: 0 24px 58px rgba(25, 55, 34, .27); }
  }

  @keyframes shineSweep {
    from { transform: translateX(-120%) rotate(8deg); opacity: 0; }
    20% { opacity: .55; }
    to { transform: translateX(160%) rotate(8deg); opacity: 0; }
  }

  .hero-card {
    animation: softFloat 7s ease-in-out infinite;
  }

  .floating-card,
  .promise-card,
  .contact-card {
    overflow: hidden;
  }

  .floating-card::after,
  .promise-card::after,
  .contact-card::after {
    content: "";
    position: absolute;
    inset: -40% auto -40% -70%;
    width: 34%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.42), transparent);
    transform: translateX(-120%) rotate(8deg);
    pointer-events: none;
  }

  .floating-card::after {
    animation: shineSweep 8s ease-in-out infinite;
    animation-delay: 1.4s;
  }

  .promise-card::after {
    animation: shineSweep 10s ease-in-out infinite;
    animation-delay: 2.8s;
  }

  .contact-card::after {
    animation: shineSweep 11s ease-in-out infinite;
    animation-delay: 3.6s;
  }

  .btn-dark {
    animation: softPulse 5.5s ease-in-out infinite;
  }

  .btn,
  .card,
  .fit-card,
  .step,
  .review,
  .story-card,
  .method-item,
  .time-btn,
  .service-card,
  .quick-goal {
    will-change: transform;
  }

  .card,
  .fit-card,
  .step,
  .review,
  .story-card,
  .method-item,
  .service-card {
    transition:
      transform .28s ease,
      box-shadow .28s ease,
      border-color .28s ease,
      background .28s ease;
  }

  .card:hover,
  .fit-card:hover,
  .step:hover,
  .review:hover,
  .story-card:hover,
  .method-item:hover,
  .service-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 22px 56px rgba(30, 42, 31, .11);
    border-color: rgba(25, 55, 34, .16);
  }

  .nav-links a,
  .mini-pill,
  .service-kicker,
  .promise-points span,
  .about-item,
  .trust-metric {
    transition: transform .22s ease, background .22s ease, border-color .22s ease;
  }

  .mini-pill:hover,
  .service-kicker:hover,
  .promise-points span:hover,
  .about-item:hover,
  .trust-metric:hover {
    transform: translateY(-3px);
  }

  .motion-ready .reveal-item {
    opacity: 0;
    transform: translateY(24px);
    filter: blur(8px);
  }

  .motion-ready .reveal-item.is-visible {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
    transition:
      opacity .75s ease,
      transform .75s cubic-bezier(.2, .8, .2, 1),
      filter .75s ease;
  }

  .motion-ready .hero .reveal-item {
    transform: translateY(18px);
  }

  .motion-ready .hero .reveal-item.is-visible {
    transition-duration: .9s;
  }

  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation: none !important;
      transition: none !important;
      scroll-behavior: auto !important;
    }

    .motion-ready .reveal-item {
      opacity: 1 !important;
      transform: none !important;
      filter: none !important;
    }
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
  const wizardSteps = [
    "Tikslas",
    "Patirtis",
    "Formatas",
    requiresSchedule ? "Laikas" : "Ritmas",
    "Kontaktai",
  ];

  const availableSlots = useMemo(() => {
    return slots.map((slot) => ({
      time: slot,
      available: !selectedService.requiresSchedule
        ? true
        : isSlotAvailable({
            date: selectedDate,
            time: slot,
            durationMin: selectedService.durationMin,
            sessions: existingSessions,
          }),
    }));
  }, [selectedDate, selectedService]);

  const activeSlotsCount = availableSlots.filter((slot) => slot.available).length;

  const canContinue = useMemo(() => {
    if (step === 0) return Boolean(form.goal.trim());
    if (step === 1) return Boolean(form.activityLevel && form.healthIssues.trim());
    if (step === 2) return Boolean(selectedService);
    if (step === 3) {
      return requiresSchedule
        ? Boolean(selectedDate && selectedTime)
        : Boolean(form.preferredDays.trim() && form.preferredTime.trim());
    }
    return Boolean(form.name.trim() && form.phone.trim() && form.consent);
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
            <h1 className="reg-title">Pirma konsultacija</h1>
            <p className="reg-sub">Trumpas įvertinimas padeda suprasti tikslą, patirtį, saugumo informaciją ir tinkamiausią treniravimo formatą.</p>
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
                    <h2 className="section-title">1. Koks pagrindinis tikslas?</h2>
                    <p className="reg-sub" style={{ marginBottom: 16 }}>
                      Pirma įvertiname situaciją, o tik tada parenkame tinkamiausią treniravimo formatą.
                    </p>

                    <textarea
                      className="input-field"
                      rows="4"
                      placeholder="Pvz.: sustiprėti, sumažinti svorį, grįžti po pertraukos, pagerinti laikyseną..."
                      value={form.goal}
                      onChange={(event) => updateForm("goal", event.target.value)}
                    />

                    <div className="quick-goals">
                      {["Svorio mažinimas", "Jėga", "Laikysena", "Grįžimas po pertraukos"].map((goal) => (
                        <button
                          key={goal}
                          type="button"
                          className="quick-goal"
                          onClick={() => updateForm("goal", goal)}
                        >
                          {goal}
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {step === 1 && (
                  <>
                    <h2 className="section-title">2. Patirtis ir saugumas</h2>
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

                    <label style={{ display: "block", marginTop: 12 }}>
                      <textarea
                        className="input-field danger-border"
                        rows="3"
                        placeholder="Traumos, skausmai, sveikatos apribojimai. Jei nėra, įrašykite „Nėra“ *"
                        value={form.healthIssues}
                        onChange={(event) => updateForm("healthIssues", event.target.value)}
                        required
                      />
                      <div className="field-hint">
                        Tai padeda parinkti saugų krūvį, pratimų alternatyvas ir programos korekcijas.
                      </div>
                    </label>

                    <textarea
                      className="input-field"
                      style={{ marginTop: 12 }}
                      rows="2"
                      placeholder="Papildoma informacija treneriui"
                      value={form.notes}
                      onChange={(event) => updateForm("notes", event.target.value)}
                    />
                  </>
                )}

                {step === 2 && (
                  <>
                    <h2 className="section-title">3. Tinkamiausias formatas</h2>
                    <p className="reg-sub" style={{ marginBottom: 16 }}>
                      Pasirinkite paslaugą. Ji gali būti patikslinta po pirmo pokalbio, jei tikslui labiau tiktų kitas formatas.
                    </p>

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

                {step === 3 && (
                  <>
                    <h2 className="section-title">4. {requiresSchedule ? "Pageidaujamas laikas" : "Pageidaujamas ritmas"}</h2>
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

                {step === 4 && (
                  <>
                    <h2 className="section-title">5. Kontaktai ir patvirtinimas</h2>
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
                      Sutinku, kad treneris susisiektų dėl pirmos konsultacijos, tinkamiausio formato ir registracijos patvirtinimo.
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
            <h2>Užklausa sėkmingai gauta</h2>
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

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const elements = Array.from(
      document.querySelectorAll(
        ".hero > div, .hero-card, .section, .card, .fit-card, .step, .review, .story-card, .method-item, .contact-card"
      )
    );

    if (reduceMotion) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return undefined;
    }

    document.documentElement.classList.add("motion-ready");

    elements.forEach((element, index) => {
      element.classList.add("reveal-item");
      element.style.transitionDelay = `${Math.min((index % 6) * 55, 275)}ms`;
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
    );

    elements.forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
      document.documentElement.classList.remove("motion-ready");
    };
  }, []);

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
            <a href="#paslaugos">Paslaugos</a>
            <a href="#metodika">Metodika</a>
            <a href="#kam-tinka">Kam tinka</a>
            <a href="#saugumas">Saugumas</a>
            <a href="#kontaktai">Kontaktai</a>
          </nav>

          <button className="btn btn-dark" type="button" onClick={() => setBookingOpen(true)}>
            Registruotis
          </button>
        </div>
      </header>

      <section id="top" className="container hero">
        <div>
          <span className="eyebrow">Individualus treniravimas</span>
          <h1>Aiškus treniruočių planas, saugus krūvis ir pamatuojamas progresas</h1>
          <p>
            Pirmiausia įvertiname tikslą, patirtį ir galimus apribojimus. Tada sudaromas treniruočių planas,
            kurio galima laikytis realiame gyvenime.
          </p>

          <div className="hero-trust">Pirma konsultacija padeda parinkti tinkamą kryptį dar prieš pradedant krūvį.</div>

          <div className="hero-actions">
            <button className="btn btn-dark" type="button" onClick={() => setBookingOpen(true)}>
              Registruotis į pirmą konsultaciją
            </button>
            <a className="btn btn-light" href="#paslaugos">
              Peržiūrėti paslaugas
            </a>
          </div>

          <div className="hero-points">
            <div className="point">
              <strong>1:1</strong>
              <span>pirminis įvertinimas</span>
            </div>
            <div className="point">
              <strong>4–8 sav.</strong>
              <span>struktūruotas treniruočių etapas</span>
            </div>
            <div className="point">
              <strong>PDF</strong>
              <span>programos dokumentas klientui</span>
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

      <section id="paslaugos" className="container section">
        <div className="section-head">
          <h2>Paslaugos pagal jūsų tikslą ir patirtį.</h2>
          <p className="section-lead">
            Pasirinkite formatą pagal tai, kaip norite dirbti: gyvai, savarankiškai arba su nuotoline priežiūra.
          </p>
        </div>

        <div className="cards">
          {services.map((service) => (
            <article className="card" key={service.id}>
              <span className="service-kicker">{service.meta}</span>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <ul className="service-bullets">
                {service.bullets.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <div className="card-result">
                <strong>Rezultatas:</strong> {service.result}
              </div>
              <div className="card-footer">
                <span className="price">{service.price}</span>
                <button className="btn btn-dark btn-card" type="button" onClick={() => setBookingOpen(true)}>
                  Registruotis
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="metodika" className="container section">
        <div className="section-head">
          <h2>Mano metodika: aiškus įvertinimas, saugus krūvis ir realus progresas.</h2>
          <p className="section-lead">
            Treniruotės neprasideda nuo atsitiktinių pratimų. Pirmiausia įvertiname tikslą, patirtį ir galimus apribojimus,
            tada parenkame planą, kurio galima laikytis realiame gyvenime.
          </p>
        </div>

        <div className="method-panel">
          <div className="method-intro">
            <span className="eyebrow">Pažadas klientui</span>
            <h3>Mažiau chaoso, daugiau struktūros.</h3>
            <p>
              Tikslas — parinkti saugų krūvį, palaikyti nuoseklumą ir padėti klientui matyti realų progresą.
              Programos koreguojamos pagal savijautą, techniką ir realų savaitės ritmą.
            </p>
          </div>

          <div className="method-list">
            <article className="method-item">
              <div className="method-no">01</div>
              <div>
                <h3>Įvertinimas</h3>
                <p>Aptariamas tikslas, patirtis, aktyvumo lygis, galimi skausmai, apribojimai ir savaitės ritmas.</p>
              </div>
            </article>
            <article className="method-item">
              <div className="method-no">02</div>
              <div>
                <h3>Individualus planas</h3>
                <p>Parenkamas treniruočių formatas, pratimai, krūvis, poilsis ir progresavimo kryptis.</p>
              </div>
            </article>
            <article className="method-item">
              <div className="method-no">03</div>
              <div>
                <h3>Korekcijos</h3>
                <p>Planą keičiame pagal techniką, savijautą, nuovargį ir tai, kas realiai veikia klientui.</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="kam-tinka" className="container section">
        <div className="section-head">
          <h2>Kam tinka šis treniravimo formatas?</h2>
          <p className="section-lead">
            Skirta žmonėms, kurie nori sportuoti aiškiai, saugiai ir be chaoso — nuo pirmo įvertinimo iki realiai įgyvendinamo plano.
          </p>
        </div>

        <div className="fit-grid">
          <article className="fit-card" data-no="01">
            <span className="eyebrow">Pradedantiems</span>
            <h3>Norite pradėti be spėlionių ir traumų rizikos</h3>
            <p>Pirmiausia sutvarkome techniką, krūvį ir savaitės ritmą, kad sporto pradžia būtų aiški.</p>
          </article>
          <article className="fit-card" data-no="02">
            <span className="eyebrow">Po pertraukos</span>
            <h3>Grįžtate į sportą po ilgesnės pauzės</h3>
            <p>Krūvis didinamas palaipsniui, atsižvelgiant į savijautą, mobilumą ir ankstesnę patirtį.</p>
          </article>
          <article className="fit-card" data-no="03">
            <span className="eyebrow">Aiškiam tikslui</span>
            <h3>Norite plano, o ne atsitiktinių pratimų</h3>
            <p>Treniruotės sudedamos į sistemą: tikslas, pratimai, progresija, poilsis ir korekcijos.</p>
          </article>
        </div>
      </section>

      <section id="apie" className="container section">
        <div className="section-head">
          <h2>Profesionalus požiūris į treniruotes, krūvį ir kliento savijautą.</h2>
          <p className="section-lead">
            Tikslas — ne tik „pavargti treniruotėje“, o suprasti, ką darote, kodėl tai darote ir kaip saugiai judėti į priekį.
          </p>
        </div>

        <div className="about-grid">
          <div className="about-photo" />
          <div className="about-text">
            <div>
              <p>
                Dirbu su žmonėmis, kurie nori sustiprėti, pagerinti laikyseną, grįžti į sportą po pertraukos arba tiesiog turėti aiškų, realų treniruočių planą.
              </p>
              <p style={{ marginTop: 18 }}>
                Mano darbo principas paprastas: ne motyvaciniai pažadai, o struktūra. Kiekviena programa pradedama nuo tikslo, patirties ir saugumo informacijos.
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

      <section id="saugumas" className="container section">
        <div className="safety-card">
          <span className="eyebrow">Saugumas ir atsakomybė</span>
          <h2>Saugus krūvio valdymas yra svarbiau už greitą rezultatą.</h2>
          <p className="section-lead" style={{ color: "rgba(255,255,255,.72)", marginTop: 16 }}>
            Klausiama apie patirtį ir apribojimus ne dėl biurokratijos, o tam, kad būtų galima parinkti saugesnį krūvį, pratimų alternatyvas ir tinkamą progresiją.
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
              <h3>Atsakomybės riba</h3>
              <p>Treneris nekuria medicininio gydymo plano. Esant sveikatos problemoms rekomenduojama konsultuotis su specialistu.</p>
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
            <h3>Registracija</h3>
            <p>Pasirenkate paslaugą, laiką ir trumpai aprašote tikslą bei saugumo informaciją.</p>
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

      <section id="pasitikejimas" className="container section">
        <div className="section-head">
          <h2>Pasitikėjimo pagrindas: aiškumas, metodika ir realus procesas.</h2>
          <p className="section-lead">
            Premium klientui svarbu matyti, kad treniravimas paremtas ne pažadais, o saugumu, struktūra ir profesionaliu darbo procesu.
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
                <span>treniruočių patirtis</span>
              </div>
              <div className="trust-metric">
                <strong>4–8 sav.</strong>
                <span>aiškus etapas</span>
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
              <p>Kiekvienas pratimas turi serijas, pakartojimus, poilsį, tempą, alternatyvas ir saugumo pastabas.</p>
            </article>
          </div>
        </div>
      </section>

      <section id="atsiliepimai" className="container section">
        <div className="section-head">
          <h2>Ką sako klientai.</h2>
          <p className="section-lead">
            Realioje svetainėje čia būtų įkelti tikri kliento atsiliepimai, orientuoti į aiškumą, saugumą ir progresą.
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
              Užpildykite trumpą formą, o treneris susisieks aptarti tikslo, saugumo informacijos,
              treniruočių formato ir tinkamiausio plano.
            </p>
            <div className="contact-actions">
              <button className="btn btn-lime" type="button" onClick={() => setBookingOpen(true)}>
                Registruotis į pirmą konsultaciją
              </button>
              <a className="btn btn-light" href="tel:+37060000000">
                Skambinti
              </a>
            </div>
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
