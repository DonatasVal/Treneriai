import { useMemo, useState } from "react";

const services = [
  {
    id: "one",
    title: "Individuali treniruotė",
    price: "35 €",
    meta: "60 min. · Asmeninis darbas 1:1",
    description: "Technika, laikysena, jėga ir garantuotas saugumas pritaikytas Jūsų fizinei būklei.",
    durationMin: 60,
    requiresSchedule: true,
    bookingType: "vizitas",
    nextStepNote: "Pasirinkite patogų laiką. Treneris peržiūrės anketą ir asmeniškai patvirtins vizitą.",
  },
  {
    id: "sub",
    title: "Treniruočių abonementas",
    price: "nuo 120 €",
    meta: "mėn. · Reguliari priežiūra",
    description: "Ilgalaikis progresas, aiškus savaitės ritmas ir nuolatinė rezultatų kontrolė.",
    durationMin: 0,
    requiresSchedule: false,
    bookingType: "abonementas",
    nextStepNote: "Datos rinktis nereikia. Užpildžius anketą, susisieksime suderinti Jums patogiausią ilgalaikį grafiką.",
  },
  {
    id: "plan",
    title: "Individualus planas",
    price: "89 €",
    meta: "4 savaitės · Sporto salei / namams",
    description: "Profesionali programa su aiškiais pratimais, apkrovų logika ir video demonstracijomis.",
    durationMin: 0,
    requiresSchedule: false,
    bookingType: "planas",
    nextStepNote: "Datos rinktis nereikia. Susisieksime asmeniškai, kad surinktume papildomą informaciją plano paruošimui.",
  },
  {
    id: "online",
    title: "Nuotolinė priežiūra",
    price: "129 €",
    meta: "mėn. · Nuolatinis palaikymas",
    description: "Asmeninis planavimas, technikos analizė iš video ir savaitinės korekcijos.",
    durationMin: 0,
    requiresSchedule: false,
    bookingType: "nuotoliu",
    nextStepNote: "Datos rinktis nereikia. Susisieksime aptarti Jūsų esamą režimą ir tolimesnio bendradarbiavimo formatą.",
  },
  {
    id: "food",
    title: "Mitybos strategija",
    price: "45 €",
    meta: "45 min. · Praktiški sprendimai",
    description: "Asmeninis mitybos ritmas be kraštutinumų, kurį realu išlaikyti ilgalaikėje perspektyvoje.",
    durationMin: 45,
    requiresSchedule: true,
    bookingType: "konsultacija",
    nextStepNote: "Pasirinkite konsultacijos laiką. Treneris susisieks dėl patvirtinimo.",
  },
];

const slots = ["07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"];

const existingSessions = [
  { id: "s1", date: "2026-06-08", start: "10:00", durationMin: 60, status: "confirmed" },
  { id: "s2", date: "2026-06-08", start: "17:00", durationMin: 60, status: "confirmed" },
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
    --ink: #0f172a;
    --muted: #64748b;
    --paper: #fbfaf6;
    --bone: #f3f5ef;
    --line: rgba(15, 23, 42, .08);
    --lime: #b7f34a;
    --lime-soft: #eefdd7;
    --forest: #17351f;
    --rose: #fff1f2;
    --shadow-premium: 0 10px 40px -10px rgba(15,23,42,0.08), 0 4px 6px -4px rgba(15,23,42,0.04);
  }

  * { box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  body { margin: 0; background: var(--paper); color: var(--ink); font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; -webkit-font-smoothing: antialiased; }
  button, input, select, textarea { font: inherit; }

  .landing {
    min-height: 100vh;
    background:
      radial-gradient(circle at 5% 10%, rgba(183, 243, 74, .15), transparent 40%),
      radial-gradient(circle at 90% 15%, rgba(255, 255, 255, .8), transparent 30%),
      linear-gradient(180deg, #fcfcf9 0%, #f4f1ea 100%);
  }

  .container { width: min(1180px, calc(100% - 40px)); margin: 0 auto; }
  
  .header {
    position: sticky;
    top: 0;
    z-index: 30;
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    background: rgba(251, 250, 246, .85);
    border-bottom: 1px solid var(--line);
  }

  .nav {
    min-height: 84px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
  }

  .brand { display: flex; align-items: center; gap: 14px; text-decoration: none; color: var(--ink); }
  .brand-mark {
    width: 46px;
    height: 46px;
    border-radius: 14px;
    display: grid;
    place-items: center;
    background: var(--forest);
    color: white;
    font-weight: 900;
    font-size: 16px;
    box-shadow: 0 8px 20px rgba(23, 53, 31, .15);
  }
  .brand strong { display: block; font-size: 17px; letter-spacing: -.03em; font-weight: 800;}
  .brand span { display: block; margin-top: 2px; color: var(--muted); font-size: 13px; font-weight: 600; }

  .nav-links { display: flex; align-items: center; gap: 28px; }
  .nav-links a { color: rgba(15, 23, 42, .65); text-decoration: none; font-size: 14px; font-weight: 700; transition: 0.2s;}
  .nav-links a:hover { color: var(--ink); }

  .btn {
    border: 0;
    border-radius: 999px;
    padding: 15px 26px;
    font-weight: 800;
    font-size: 15px;
    cursor: pointer;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: transform .2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow .2s ease, background .2s ease;
  }

  .btn:hover { transform: translateY(-2px); }
  .btn:active { transform: translateY(0); }
  .btn-dark { background: var(--forest); color: white; box-shadow: 0 12px 30px rgba(23, 53, 31, .18); }
  .btn-light { background: white; color: var(--ink); border: 1px solid var(--line); box-shadow: 0 4px 12px rgba(15,23,42,0.03);}
  .btn-lime { background: var(--lime); color: var(--forest); box-shadow: 0 12px 30px rgba(183, 243, 74, .25);}

  .hero {
    padding: 80px 0 60px;
    display: grid;
    grid-template-columns: 1.05fr .95fr;
    gap: 50px;
    align-items: center;
  }

  .eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    border: 1px solid var(--line);
    background: rgba(255, 255, 255, .8);
    border-radius: 999px;
    padding: 8px 14px;
    color: rgba(15, 23, 42, .65);
    font-size: 12px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: .1em;
  }

  .eyebrow::before {
    content: "";
    width: 8px;
    height: 8px;
    border-radius: 999px;
    background: var(--lime);
    box-shadow: 0 0 0 4px rgba(183, 243, 74, .25);
  }

  .hero h1 {
    margin: 24px 0 0;
    max-width: 860px;
    font-size: clamp(2.5rem, 5.2vw, 4.8rem);
    line-height: 1.05;
    letter-spacing: -.05em;
    font-weight: 900;
    text-wrap: balance;
  }

  .hero p {
    margin: 24px 0 0;
    color: rgba(15, 23, 42, .65);
    font-size: clamp(1.05rem, 1.45vw, 1.15rem);
    line-height: 1.7;
    max-width: 580px;
  }

  .hero-actions { display: flex; flex-wrap: wrap; gap: 16px; margin-top: 36px; }

  .hero-points {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-top: 40px;
  }

  .point {
    background: rgba(255, 255, 255, .6);
    border: 1px solid var(--line);
    border-radius: 20px;
    padding: 18px;
  }

  .point strong { display: block; font-size: 22px; letter-spacing: -.04em; font-weight: 800;}
  .point span { display: block; margin-top: 4px; color: var(--muted); font-size: 13px; font-weight: 600; }

  .hero-card {
    position: relative;
    min-height: 640px;
    border-radius: 32px;
    overflow: hidden;
    border: 1px solid rgba(15, 23, 42, .06);
    background:
      linear-gradient(145deg, rgba(15, 23, 42, .03), transparent 45%),
      linear-gradient(180deg, #e6eadf, #ffffff);
    box-shadow: var(--shadow-premium);
  }

  .hero-card::before {
    content: "Trenerio nuotrauka";
    position: absolute;
    inset: 24px 24px 130px;
    border-radius: 24px;
    display: grid;
    place-items: center;
    background:
      radial-gradient(circle at 18% 18%, rgba(183, 243, 74, .15), transparent 40%),
      linear-gradient(135deg, rgba(23, 53, 31, .04), rgba(255, 255, 255, .5));
    border: 2px dashed rgba(23, 53, 31, .15);
    color: rgba(23, 53, 31, .5);
    font-size: 13px;
    font-weight: 800;
    letter-spacing: .1em;
    text-transform: uppercase;
  }

  .floating-card {
    position: absolute;
    left: 24px;
    right: 24px;
    bottom: 24px;
    border-radius: 24px;
    background: rgba(255, 255, 255, .92);
    border: 1px solid rgba(255, 255, 255, .8);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    padding: 24px;
    box-shadow: 0 10px 30px -10px rgba(0,0,0,0.1);
  }

  .floating-card h3 { margin: 0; font-size: 20px; letter-spacing: -.04em; font-weight: 800;}
  .floating-card p { margin: 8px 0 0; font-size: 14px; line-height: 1.6; color: var(--muted); }
  .mini-row { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 16px; }
  .mini-pill { border-radius: 8px; background: var(--lime-soft); color: var(--forest); padding: 6px 12px; font-size: 12px; font-weight: 800; }

  .section { padding: 80px 0; }
  .section-head {
    display: flex;
    align-items: end;
    justify-content: space-between;
    gap: 30px;
    margin-bottom: 40px;
  }

  .section h2 {
    margin: 0;
    max-width: 700px;
    font-size: clamp(2rem, 4vw, 3.5rem);
    line-height: 1.05;
    letter-spacing: -.05em;
    font-weight: 900;
  }

  .section-lead {
    max-width: 440px;
    color: rgba(15, 23, 42, .65);
    font-size: 16px;
    line-height: 1.6;
    font-weight: 500;
  }

  .cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
  .card {
    background: rgba(255, 255, 255, .9);
    border: 1px solid var(--line);
    border-radius: 24px;
    padding: 32px;
    box-shadow: var(--shadow-premium);
    transition: 0.3s;
  }
  .card:hover { transform: translateY(-4px); box-shadow: 0 20px 40px -10px rgba(15,23,42,0.12); }

  .card h3 { margin: 0; font-size: 22px; letter-spacing: -.04em; font-weight: 800;}
  .card p { margin: 12px 0 0; color: var(--muted); line-height: 1.6; font-size: 15px; }
  .price { margin-top: 24px; display: inline-flex; border-radius: 12px; background: var(--lime-soft); color: var(--forest); padding: 8px 14px; font-size: 14px; font-weight: 800; }

  .fit-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
  .fit-card {
    position: relative;
    overflow: hidden;
    min-height: 260px;
    border: 1px solid var(--line);
    border-radius: 24px;
    background: rgba(255, 255, 255, .9);
    padding: 32px;
    box-shadow: var(--shadow-premium);
  }
  .fit-card::after {
    content: attr(data-no);
    position: absolute;
    right: 20px;
    bottom: -10px;
    color: rgba(15, 23, 42, .03);
    font-size: 80px;
    font-weight: 900;
    letter-spacing: -.05em;
  }
  .fit-card h3 { margin: 18px 0 0; font-size: 20px; letter-spacing: -.04em; font-weight: 800;}
  .fit-card p { margin: 12px 0 0; color: var(--muted); line-height: 1.6; font-size: 15px; }

  .method-panel {
    display: grid;
    grid-template-columns: 1fr 1.2fr;
    gap: 24px;
    align-items: stretch;
  }
  .method-intro {
    border-radius: 32px;
    background: var(--forest);
    color: white;
    padding: 40px;
  }
  .method-intro h3 { margin: 24px 0 0; font-size: 32px; line-height: 1.1; letter-spacing: -.05em; font-weight: 800;}
  .method-intro p { margin: 16px 0 0; color: rgba(255,255,255,.75); line-height: 1.6; font-size: 16px;}
  .method-list { display: grid; gap: 16px; }
  .method-item {
    display: grid;
    grid-template-columns: 48px 1fr;
    gap: 20px;
    align-items: start;
    border: 1px solid var(--line);
    border-radius: 24px;
    background: white;
    padding: 24px;
    box-shadow: 0 4px 12px rgba(15,23,42,0.02);
  }
  .method-no {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: grid;
    place-items: center;
    background: var(--lime-soft);
    color: var(--forest);
    font-weight: 800;
    font-size: 16px;
  }
  .method-item h3 { margin: 0; font-size: 18px; letter-spacing: -.03em; font-weight: 800;}
  .method-item p { margin: 8px 0 0; color: var(--muted); line-height: 1.6; font-size: 14px; }

  .safety-card {
    border-radius: 32px;
    background:
      radial-gradient(circle at 10% 0%, rgba(183, 243, 74, .15), transparent 40%),
      var(--forest);
    color: white;
    padding: 48px;
  }
  .safety-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 32px; }
  .safety-item {
    border: 1px solid rgba(255,255,255,.1);
    border-radius: 20px;
    background: rgba(255,255,255,.05);
    padding: 24px;
  }
  .safety-item h3 { margin: 0; font-size: 18px; letter-spacing: -.03em; font-weight: 800;}
  .safety-item p { margin: 10px 0 0; color: rgba(255,255,255,.7); line-height: 1.6; font-size: 14px; }

  .trust-board {
    display: grid;
    grid-template-columns: 1fr 1.1fr;
    gap: 24px;
    align-items: stretch;
  }
  .trust-dark {
    border-radius: 32px;
    background: var(--forest);
    color: white;
    padding: 40px;
  }
  .trust-dark h2 { color: white; margin-top: 20px; }
  .trust-dark p { color: rgba(255,255,255,.75); line-height: 1.6; font-size: 16px;}
  .trust-metrics { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-top: 32px; }
  .trust-metric { border: 1px solid rgba(255,255,255,.1); background: rgba(255,255,255,.05); border-radius: 20px; padding: 20px; }
  .trust-metric strong { display: block; font-size: 32px; letter-spacing: -.05em; font-weight: 900;}
  .trust-metric span { display: block; margin-top: 4px; color: rgba(255,255,255,.65); font-size: 13px; font-weight: 700; }
  .story-grid { display: grid; gap: 16px; }
  .story-card { border: 1px solid var(--line); border-radius: 24px; background: white; padding: 24px; box-shadow: 0 4px 12px rgba(15,23,42,0.02);}
  .story-card small { display: inline-flex; border-radius: 8px; background: var(--lime-soft); color: var(--forest); padding: 6px 12px; font-weight: 800; font-size: 12px;}
  .story-card h3 { margin: 16px 0 0; font-size: 20px; letter-spacing: -.03em; font-weight: 800;}
  .story-card p { margin: 10px 0 0; color: var(--muted); line-height: 1.6; font-size: 14px; }

  .about-grid { display: grid; grid-template-columns: 1fr 1.1fr; gap: 24px; align-items: stretch; }
  .about-photo {
    position: relative;
    min-height: 480px;
    border-radius: 32px;
    background:
      radial-gradient(circle at 18% 18%, rgba(183, 243, 74, .15), transparent 40%),
      linear-gradient(135deg, rgba(23, 53, 31, .04), rgba(255, 255, 255, .6));
    border: 2px dashed rgba(23, 53, 31, .15);
    overflow: hidden;
    display: grid;
    place-items: center;
  }

  .about-photo::after {
    content: "Trenerio nuotrauka";
    border-radius: 12px;
    background: rgba(255, 255, 255, .9);
    border: 1px solid rgba(23, 53, 31, .1);
    color: rgba(23, 53, 31, .6);
    padding: 10px 16px;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: .1em;
    text-transform: uppercase;
    box-shadow: 0 10px 30px rgba(15, 23, 42, .05);
  }

  .about-text {
    border-radius: 32px;
    background: var(--forest);
    color: white;
    padding: 40px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .about-text p { color: rgba(255, 255, 255, .75); font-size: 16px; line-height: 1.65; margin: 0; }
  .about-list { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 32px; }
  .about-item { border: 1px solid rgba(255, 255, 255, .1); border-radius: 20px; padding: 20px; background: rgba(255, 255, 255, .05); }
  .about-item strong { display: block; font-size: 15px;}
  .about-item span { display: block; margin-top: 6px; color: rgba(255, 255, 255, .65); font-size: 13px; line-height: 1.5; }

  .steps { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
  .step { position: relative; min-height: 260px; background: white; border: 1px solid var(--line); border-radius: 24px; padding: 32px; overflow: hidden; box-shadow: 0 4px 12px rgba(15,23,42,0.02);}
  .step::before { content: attr(data-no); position: absolute; right: 20px; bottom: 0px; font-size: 90px; font-weight: 900; letter-spacing: -.05em; color: rgba(15, 23, 42, .03); }
  .step h3 { margin: 32px 0 0; font-size: 20px; letter-spacing: -.03em; font-weight: 800;}
  .step p { margin: 12px 0 0; color: var(--muted); line-height: 1.6; font-size: 14px; }

  .results {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }

  .result {
    background: rgba(255, 255, 255, .9);
    border: 1px solid var(--line);
    border-radius: 24px;
    padding: 32px;
    box-shadow: var(--shadow-premium);
  }

  .result strong { display: block; font-size: 40px; line-height: 1; letter-spacing: -.05em; font-weight: 900;}
  .result span { display: block; margin-top: 12px; color: var(--muted); font-size: 14px; font-weight: 600; line-height: 1.5; }

  .reviews { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
  .review { background: white; border: 1px solid var(--line); border-radius: 24px; padding: 32px; box-shadow: 0 4px 12px rgba(15,23,42,0.02);}
  .review p { margin: 0; color: rgba(15, 23, 42, .75); line-height: 1.6; font-size: 15px;}
  .review strong { display: block; margin-top: 24px; font-size: 15px;}

  .contact-card {
    display: grid;
    grid-template-columns: 1.2fr 1fr;
    gap: 32px;
    align-items: center;
    border-radius: 32px;
    background: var(--forest);
    color: white;
    padding: 48px;
    overflow: hidden;
  }

  .contact-card h2 { color: white; margin-top: 16px;}
  .contact-card p { color: rgba(255, 255, 255, .75); font-size: 16px; line-height: 1.6; max-width: 500px; margin-bottom: 32px;}
  .contact-box { background: rgba(255, 255, 255, .05); border: 1px solid rgba(255, 255, 255, .1); border-radius: 24px; padding: 32px; }
  .contact-line { display: flex; justify-content: space-between; gap: 16px; padding: 14px 0; border-bottom: 1px solid rgba(255, 255, 255, .1); }
  .contact-line:last-child { border-bottom: 0; padding-bottom: 0;}
  .contact-line:first-child { padding-top: 0;}
  .contact-line span { color: rgba(255, 255, 255, .65); font-weight: 600; font-size: 14px;}
  .contact-line strong { text-align: right; font-size: 15px;}

  .footer { padding: 32px 0 48px; color: rgba(15, 23, 42, .45); font-size: 13px; font-weight: 500; text-align: center;}

  .modal-backdrop {
    position: fixed;
    inset: 0;
    z-index: 100;
    background: rgba(15, 23, 42, .6);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    display: grid;
    place-items: center;
    padding: 24px;
  }

  .modal {
    width: min(1140px, 100%);
    max-height: min(92vh, 980px);
    overflow: auto;
    background: #fcfcf9;
    border-radius: 28px;
    padding: 48px;
    box-shadow: 0 40px 100px -20px rgba(0,0,0,0.3);
  }

  .reg-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 20px; }
  .reg-title { font-size: 32px; font-weight: 900; margin: 0 0 8px 0; letter-spacing: -0.04em; }
  .reg-sub { color: var(--muted); font-size: 15px; margin-bottom: 32px; line-height: 1.5; max-width: 600px;}
  .close-btn { background: #f3f4f1; border: 0; width: 44px; height: 44px; border-radius: 50%; font-size: 22px; cursor: pointer; flex: 0 0 auto; display: grid; place-items: center; transition: 0.2s; color: var(--ink);}
  .close-btn:hover { background: #e5e7eb; }
  
  .wizard-tabs { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin: 24px 0 32px; }
  .wizard-tab { border: 1px solid var(--line); background: white; color: var(--muted); border-radius: 14px; padding: 14px; text-align: left; font-size: 13px; font-weight: 700; cursor: pointer; transition: 0.2s;}
  .wizard-tab.active { background: var(--forest); color: white; border-color: var(--forest); box-shadow: 0 8px 20px rgba(23, 53, 31, .15);}
  .wizard-tab.done { background: var(--lime-soft); color: var(--forest); border-color: rgba(183,243,74,.5); }
  
  .wizard-layout { display: grid; grid-template-columns: 1fr .7fr; gap: 32px; align-items: start; }
  .wizard-panel { border: 1px solid var(--line); background: white; border-radius: 24px; padding: 32px; box-shadow: 0 4px 12px rgba(15,23,42,0.02);}
  .wizard-summary { position: sticky; top: 24px; background: var(--forest); color: white; border-radius: 24px; padding: 32px; box-shadow: 0 20px 40px -10px rgba(23,53,31,0.2);}
  .wizard-summary h3 { margin: 20px 0 0; font-size: 24px; letter-spacing: -.03em; font-weight: 800;}
  .wizard-summary p { color: rgba(255,255,255,.7); line-height: 1.6; font-size: 14px; margin: 12px 0 0; }
  .summary-line { display: flex; justify-content: space-between; gap: 12px; border-bottom: 1px solid rgba(255,255,255,.1); padding: 12px 0; font-size: 14px; }
  .summary-line:last-of-type { border-bottom: none; padding-bottom: 0;}
  .summary-line span { color: rgba(255,255,255,.6); }
  
  .section-title { font-size: 20px; font-weight: 800; margin: 0 0 16px 0; letter-spacing: -0.02em; }
  
  .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
  .input-field { width: 100%; border: 1px solid var(--line); background: #fcfcf9; border-radius: 12px; padding: 16px; font-size: 16px; color: #111827; transition: border 0.2s;}
  .input-field::placeholder { color: #98a2b3; }
  .input-field:focus { outline: none; border-color: var(--forest); background: white;}
  .danger-border { border: 1px solid #fca5a5 !important; background: #fffbfa; }
  
  .field-hint { margin-top: 8px; font-size: 13px; color: var(--muted); line-height: 1.5;}
  .field-hint.secure { color: #059669; font-weight: 500; display: flex; align-items: start; gap: 6px;}

  .quick-goals { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 16px;}
  .quick-goal { background: #f3f4f1; border: 1px solid var(--line); padding: 8px 14px; border-radius: 8px; font-size: 13px; font-weight: 600; color: var(--ink); cursor: pointer; transition: 0.2s;}
  .quick-goal:hover { background: var(--lime-soft); color: var(--forest); border-color: var(--lime);}

  .service-list { display: flex; flex-direction: column; gap: 16px; }
  .service-list.wizard-services { display: grid; grid-template-columns: 1fr 1fr; gap: 16px;}
  .service-card { background: white; border: 1px solid var(--line); border-radius: 16px; padding: 20px; text-align: left; cursor: pointer; transition: 0.2s; }
  .service-card:hover { transform: translateY(-2px); border-color: rgba(17,24,39,0.2); box-shadow: 0 8px 20px rgba(15,23,42,0.04);}
  .service-card.active { background: var(--lime-soft); border: 2px solid var(--lime); box-shadow: none;}
  .service-name { font-size: 16px; font-weight: 800; margin: 0 0 6px 0; }
  .service-meta { color: var(--muted); font-size: 14px; line-height: 1.5;}

  .slots-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; gap: 12px; }
  .slots-badge { background: var(--lime-soft); color: var(--forest); font-size: 13px; font-weight: 700; padding: 6px 12px; border-radius: 8px; white-space: nowrap; }
  .time-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; margin-bottom: 24px; }
  .time-btn { background: white; border: 1px solid var(--line); border-radius: 12px; padding: 14px 0; font-weight: 700; font-size: 15px; text-align: center; cursor: pointer; transition: 0.2s; }
  .time-btn:hover:not(:disabled) { border-color: var(--forest); }
  .time-btn.active { background: var(--forest); color: white; border-color: var(--forest); }
  .time-btn:disabled { background: #f3f4f1; color: #98a2b3; cursor: not-allowed; text-decoration: line-through; border-color: transparent; }
  
  .wizard-actions { display: flex; justify-content: space-between; gap: 16px; margin-top: 32px; pt-32px; border-top: 1px solid var(--line); padding-top: 24px;}
  .wizard-actions .btn:disabled { opacity: .5; cursor: not-allowed; transform: none; box-shadow: none;}
  
  .micro-note { margin-top: 16px; border-radius: 12px; background: var(--lime-soft); color: var(--forest); padding: 16px; font-size: 14px; line-height: 1.6; font-weight: 600; }
  .success-box { background: var(--lime-soft); color: var(--forest); padding: 40px; border-radius: 24px; text-align: center; }
  .success-box h2 { margin: 0 0 16px 0; font-size: 28px; font-weight: 900;}
  .success-box p { font-size: 16px; line-height: 1.6; margin-bottom: 32px;}

  @media (max-width: 980px) {
    .container { width: min(100% - 32px, 1180px); }
    .nav { min-height: 72px; }
    .nav-links { display: none; }
    .hero { grid-template-columns: 1fr; padding: 50px 0 40px; gap: 40px; }
    .hero-card { min-height: 480px; }
    .section-head { align-items: start; flex-direction: column; gap: 16px;}
    .cards, .reviews, .fit-grid { grid-template-columns: 1fr 1fr; }
    .method-panel, .trust-board { grid-template-columns: 1fr; }
    .safety-grid { grid-template-columns: 1fr; }
    .steps { grid-template-columns: 1fr 1fr; }
    .results { grid-template-columns: 1fr 1fr; }
    .about-grid { grid-template-columns: 1fr; }
    .wizard-layout { grid-template-columns: 1fr; }
    .wizard-summary { position: static; }
    .time-grid { grid-template-columns: repeat(4, 1fr); }
  }

  @media (max-width: 640px) {
    .brand span { display: none; }
    .btn { width: 100%; padding: 16px 20px; }
    .nav .btn { width: auto; padding: 12px 18px; font-size: 14px; }
    .hero { padding-top: 32px; }
    .hero h1 { font-size: clamp(2.2rem, 10vw, 3rem); line-height: 1.05; }
    .hero-actions { flex-direction: column; }
    .hero-points { grid-template-columns: 1fr; gap: 12px;}
    .hero-card::before { inset: 16px 16px 140px; }
    .floating-card { left: 16px; right: 16px; bottom: 16px; padding: 20px; }
    .section { padding: 56px 0; }
    .cards, .reviews, .steps, .results, .fit-grid, .safety-grid { grid-template-columns: 1fr; }
    .trust-metrics { grid-template-columns: 1fr; }
    .about-photo { min-height: 360px; }
    .about-list { grid-template-columns: 1fr; }
    .contact-card { grid-template-columns: 1fr; padding: 32px; }
    .contact-line { flex-direction: column; gap: 4px; border-bottom: none; padding: 12px 0;}
    .contact-line strong { text-align: left; }
    .contact-box { padding: 24px;}
    .modal-backdrop { padding: 0; align-items: flex-end; }
    .modal { width: 100%; max-height: 95vh; border-radius: 28px 28px 0 0; padding: 32px 24px; }
    .reg-title { font-size: 26px; }
    .time-grid { grid-template-columns: repeat(3, 1fr); }
    .form-grid { grid-template-columns: 1fr; }
    .wizard-tabs { grid-template-columns: 1fr 1fr; gap: 8px;}
    .service-list.wizard-services { grid-template-columns: 1fr; }
    .wizard-actions { flex-direction: column; gap: 12px;}
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
            <p className="reg-sub">Užpildykite anketą. Tai padės įvertinti jūsų situaciją ir pasiūlyti geriausią treniravimo formatą.</p>
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
                    <h2 className="section-title">1. Koks jūsų pagrindinis tikslas?</h2>
                    <p className="reg-sub" style={{ marginBottom: 20 }}>
                      Ką norite pasiekti per artimiausius 3 mėnesius?
                    </p>

                    <textarea
                      className="input-field"
                      rows="4"
                      placeholder="Pvz.: sustiprėti, numesti svorio, pasiruošti varžyboms, išmokti taisyklingos technikos..."
                      value={form.goal}
                      onChange={(event) => updateForm("goal", event.target.value)}
                    />

                    <div className="quick-goals">
                      {["Sumažinti svorį", "Auginti raumenų masę", "Pagerinti laikyseną", "Pradėti po ilgos pertraukos"].map((goal) => (
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
                    <h2 className="section-title">2. Patirtis ir fizinė būklė</h2>
                    <div className="form-grid">
                      <select className="input-field" value={form.activityLevel} onChange={(event) => updateForm("activityLevel", event.target.value)} required>
                        <option value="">Fizinio aktyvumo lygis *</option>
                        <option>Sėdimas darbas, nesportuoju</option>
                        <option>Pajudu 1–2 kartus per savaitę</option>
                        <option>Reguliariai sportuoju 3+ kartus</option>
                      </select>
                      <select className="input-field" value={form.experience} onChange={(event) => updateForm("experience", event.target.value)}>
                        <option value="">Treniruočių patirtis</option>
                        <option>Pradedantysis (niekada nesportavau)</option>
                        <option>Turiu patirties, bet buvo ilga pertrauka</option>
                        <option>Sportuoju nuolat</option>
                      </select>
                    </div>

                    <label style={{ display: "block", marginTop: 20 }}>
                      <textarea
                        className="input-field danger-border"
                        rows="3"
                        placeholder="Traumos, skausmai, sveikatos apribojimai (Jei nėra, rašykite „Nėra“) *"
                        value={form.healthIssues}
                        onChange={(event) => updateForm("healthIssues", event.target.value)}
                        required
                      />
                      <div className="field-hint secure">
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                        Tavo saugumas – mūsų prioritetas. Ši informacija yra konfidenciali ir padeda treneriui parinkti saugų krūvį.
                      </div>
                    </label>

                    <textarea
                      className="input-field"
                      style={{ marginTop: 20 }}
                      rows="2"
                      placeholder="Papildomos pastabos treneriui (neprivaloma)"
                      value={form.notes}
                      onChange={(event) => updateForm("notes", event.target.value)}
                    />
                  </>
                )}

                {step === 2 && (
                  <>
                    <h2 className="section-title">3. Tinkamiausias formatas</h2>
                    <p className="reg-sub" style={{ marginBottom: 20 }}>
                      Pasirinkite pirminį formatą. Vėliau jį galėsime pakoreguoti pokalbio metu.
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
                          <div className="service-meta" style={{fontWeight: 600, color: "var(--ink)", marginBottom: 8}}>{service.price} · {service.meta}</div>
                          <div className="service-meta">{service.description}</div>
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
                          <span className="slots-badge">{activeSlotsCount} laisvi laikai</span>
                        </div>
                        <input className="input-field" type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} style={{ marginBottom: 20 }} />
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
                        <div className="form-grid" style={{ marginTop: 20 }}>
                          <input className="input-field" placeholder="Kokiomis dienomis patogiausia? *" value={form.preferredDays} onChange={(event) => updateForm("preferredDays", event.target.value)} required/>
                          <input className="input-field" placeholder="Rytais, dieną ar vakarais? *" value={form.preferredTime} onChange={(event) => updateForm("preferredTime", event.target.value)} required/>
                        </div>
                        <select className="input-field" style={{ marginTop: 4 }} value={form.trainingPlace} onChange={(event) => updateForm("trainingPlace", event.target.value)}>
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
                        <option>Susisiekti telefonu</option>
                        <option>Susisiekti el. paštu</option>
                        <option>Susisiekti Instagram</option>
                      </select>
                      <input className="input-field" placeholder="El. paštas arba Instagram slapyvardis" value={form.email} onChange={(event) => updateForm("email", event.target.value)} />
                    </div>
                    <label style={{ display: "flex", gap: 12, alignItems: "flex-start", marginTop: 20, color: "var(--muted)", fontSize: 14, fontWeight: 500, lineHeight: 1.5, cursor: "pointer" }}>
                      <input type="checkbox" checked={form.consent} onChange={(event) => updateForm("consent", event.target.checked)} style={{ width: 20, height: 20, marginTop: 2 }} />
                      Sutinku, kad treneris susisiektų su manimi nurodytais kontaktais aptarti treniruočių formatą ir patvirtinti registraciją.
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
                    <button className="btn btn-lime" type="submit" disabled={!canContinue}>
                      Pateikti registraciją
                    </button>
                  )}
                </div>
              </section>

              <aside className="wizard-summary">
                <span className="eyebrow" style={{background: "rgba(255,255,255,0.1)", color: "white", borderColor: "rgba(255,255,255,0.2)"}}>Santrauka</span>
                <h3>{selectedService.title}</h3>
                <p>{selectedService.description}</p>
                <div style={{ marginTop: 24 }}>
                  <div className="summary-line"><span>Kaina</span><strong>{selectedService.price}</strong></div>
                  <div className="summary-line"><span>Formatas</span><strong>{requiresSchedule ? "Tiksliu laiku" : "Derinama asmeniškai"}</strong></div>
                  <div className="summary-line"><span>Laikas</span><strong>{requiresSchedule ? (selectedTime || "Nepasirinkta") : "Po pokalbio"}</strong></div>
                  <div className="summary-line"><span>Klientas</span><strong>{form.name || "Nenurodyta"}</strong></div>
                </div>
                <div style={{ marginTop: 24, fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.5}}>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" style={{display: "inline", marginBottom: -3, marginRight: 4}}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  Jūsų duomenys perduodami saugiai.
                </div>
              </aside>
            </div>
          </form>
        ) : (
          <div className="success-box">
            <h2>Registracija sėkmingai gauta!</h2>
            <p>{requiresSchedule ? `Pasirinktas laikas: ${selectedDate} · ${selectedTime}` : "Treneris su Jumis susisieks artimiausiu metu suderinti detalių."}</p>
            <button className="btn btn-dark" type="button" onClick={onClose}>Grįžti į svetainę</button>
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
              <span>Premium asmeninis treneris</span>
            </span>
          </a>

          <nav className="nav-links" aria-label="Pagrindinė navigacija">
            <a href="#kam-tinka">Sprendžiamos problemos</a>
            <a href="#paslaugos">Formatas ir paslaugos</a>
            <a href="#metodika">Metodika</a>
            <a href="#saugumas">Saugumas</a>
          </nav>

          <button className="btn btn-dark" type="button" onClick={() => setBookingOpen(true)}>
            Pradėti pokytį
          </button>
        </div>
      </header>

      <section id="top" className="container hero">
        <div>
          <span className="eyebrow">Aukščiausio lygio treniravimas</span>
          <h1>Fizinis pasirengimas be chaoso. Aiškus planas ir saugus progresas.</h1>
          <p>
            Moksliškai pagrįstas treniravimas pritaikytas Jūsų gyvenimo ritmui. 
            Pradedame nuo detalaus fizinės būklės įvertinimo, kad užtikrintume saugumą ir maksimalų rezultatą.
          </p>

          <div className="hero-actions">
            <button className="btn btn-dark" type="button" onClick={() => setBookingOpen(true)}>
              Registruotis pirmai konsultacijai
            </button>
            <a className="btn btn-light" href="#metodika">
              Kaip veikia sistema?
            </a>
          </div>

          <div className="hero-points">
            <div className="point">
              <strong>1:1</strong>
              <span>Asmeninis dėmesys ir technikos kontrolė</span>
            </div>
            <div className="point">
              <strong>4–8 sav.</strong>
              <span>Aiškus treniruočių etapas ir pamatuojamas progresas</span>
            </div>
            <div className="point">
              <strong>100%</strong>
              <span>Individualizuota programa PDF formatu</span>
            </div>
          </div>
        </div>

        <div className="hero-card" aria-label="Trenerio nuotrauka ir informacija">
          <div className="floating-card">
            <h3>Nespėliokite sporto salėje</h3>
            <p>
              Kiekviena treniruotė turi tikslą, o kiekvienas pratimas – logiką. 
              Krūvį pritaikau pagal Jūsų savijautą, patirtį ir galimus apribojimus.
            </p>
            <div className="mini-row">
              <span className="mini-pill">Technikos analizė</span>
              <span className="mini-pill">Laikysenos korekcija</span>
              <span className="mini-pill">Mitybos strategija</span>
            </div>
          </div>
        </div>
      </section>

      <section id="kam-tinka" className="container section">
        <div className="section-head">
          <h2>Kokias problemas mes sprendžiame?</h2>
          <p className="section-lead">
            Mano sistema skirta žmonėms, kurie vertina savo laiką, nori išvengti traumų ir siekia suprasti treniruočių procesą.
          </p>
        </div>

        <div className="fit-grid">
          <article className="fit-card" data-no="01">
            <span className="eyebrow">Pradedantiems</span>
            <h3>Nežinote nuo ko pradėti sporto salėje</h3>
            <p>Supažindinu su įranga, išmokau bazinių judesių technikos ir sudarau aiškų, lengvai suprantamą savaitės ritmą be perdegimo.</p>
          </article>
          <article className="fit-card" data-no="02">
            <span className="eyebrow">Po pertraukos / Traumų</span>
            <h3>Baimė susižeisti ar atnaujinti skausmus</h3>
            <p>Krūvį didiname itin konservatyviai. Parenkame pratimų alternatyvas, kurios stiprina kūną neapkraunant pažeidžiamų zonų.</p>
          </article>
          <article className="fit-card" data-no="03">
            <span className="eyebrow">Užstrigusiam progresui</span>
            <h3>Sportuojate, bet nematote rezultato</h3>
            <p>Įvedame sistemą: apkrovų planavimas (RPE/RIR), progresyvus perkrovimas (Progressive Overload) ir atsistatymo stebėjimas.</p>
          </article>
        </div>
      </section>

      <section id="apie" className="container section">
        <div className="section-head">
          <h2>Treneris, orientuotas į edukaciją ir jūsų savarankiškumą.</h2>
          <p className="section-lead">
            Mano tikslas — ne padaryti jus priklausomu nuo trenerio, o išmokyti taisyklingai judėti ir suprasti savo kūną.
          </p>
        </div>

        <div className="about-grid">
          <div className="about-photo" />
          <div className="about-text">
            <div>
              <p>
                Savo praktikoje nenaudoju šabloninių „kopijuoti-įklijuoti“ programų. Kiekvienas kūnas juda skirtingai, 
                todėl treniravimas prasideda nuo judesių įvertinimo ir jūsų gyvenimo būdo analizės.
              </p>
              <p style={{ marginTop: 24 }}>
                Dirbame su faktais: matuojame progresą, filmuojame techniką analizėms ir koreguojame planą remiantis 
                objektyviais duomenimis, o ne emocijomis.
              </p>
            </div>

            <div className="about-list">
              <div className="about-item">
                <strong>Aukštasis išsilavinimas</strong>
                <span>Sporto mokslo pagrindai ir nuolatinis tobulinimasis.</span>
              </div>
              <div className="about-item">
                <strong>Saugumo prioritetas</strong>
                <span>Krūvis visuomet pritaikomas pagal dienos savijautą.</span>
              </div>
              <div className="about-item">
                <strong>Skaidrumas</strong>
                <span>Jūs visada žinosite kodėl darome būtent šį pratimą.</span>
              </div>
              <div className="about-item">
                <strong>Ilgalaikis palaikymas</strong>
                <span>Konsultacijos ir adaptacijos visame proceso kelyje.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="paslaugos" className="container section">
        <div className="section-head">
          <h2>Pasirinkite Jums tinkamiausią formatą.</h2>
          <p className="section-lead">
            Nuo intensyvaus darbo gyvai iki struktūruotos nuotolinės priežiūros – visos paslaugos paremtos ta pačia kokybės metodika.
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
          <h2>Sistemiškas procesas: nuo anketos iki rezultato.</h2>
          <p className="section-lead">
            Chaosą keičiame struktūra. Štai kaip atrodys mūsų bendradarbiavimo eiga nuo pirmo kontakto.
          </p>
        </div>

        <div className="method-panel">
          <div className="method-intro">
            <span className="eyebrow">Darbo metodika</span>
            <h3>Nėra atsitiktinių sprendimų. Viskas pamatuota.</h3>
            <p>
              Kiekvienas klientas įvedamas per tą patį griežtą kokybės standartą. Taip užtikrinamas sklandus įėjimas į sporto režimą ir suvaldoma bet kokia traumų rizika.
            </p>
          </div>

          <div className="method-list">
            <article className="method-item">
              <div className="method-no">01</div>
              <div>
                <h3>Anketa ir pirminis kontaktas</h3>
                <p>Užpildote saugumo anketą. Treneris peržiūri informaciją ir susisiekia aptarti lūkesčių.</p>
              </div>
            </article>
            <article className="method-item">
              <div className="method-no">02</div>
              <div>
                <h3>Fizinio pasirengimo įvertinimas</h3>
                <p>Gyvo ar nuotolinio susitikimo metu vertinamas mobilumas, bazinių judesių kokybė ir silpnosios grandys.</p>
              </div>
            </article>
            <article className="method-item">
              <div className="method-no">03</div>
              <div>
                <h3>Individualios programos sukūrimas</h3>
                <p>Paruošiamas PDF dokumentas su pratimais, serijomis, pauzėmis ir technikos akcentais.</p>
              </div>
            </article>
            <article className="method-item">
              <div className="method-no">04</div>
              <div>
                <h3>Sisteminga progreso kontrolė</h3>
                <p>Stebime rezultatus. Atsiradus stagnacijai ar nuovargiui, operatyviai koreguojame krūvį (Deload).</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="saugumas" className="container section">
        <div className="safety-card">
          <span className="eyebrow" style={{background: "rgba(255,255,255,0.1)", color: "white", borderColor: "rgba(255,255,255,0.2)"}}>Saugumas – Nr. 1</span>
          <h2 style={{marginTop: 20}}>Jūsų sveikata svarbiau už greitus skaičius.</h2>
          <p className="section-lead" style={{ color: "rgba(255,255,255,.8)", marginTop: 16 }}>
            Niekada neaukojame pratimų technikos vardan didesnio svorio. Trenerio pareiga – išsaugoti Jūsų sąnarius 
            ir stuburą sveikus ilgaamžiškam sportavimui.
          </p>

          <div className="safety-grid">
            <article className="safety-item">
              <h3>Traumų prevencija</h3>
              <p>Identifikuojame ankstesnes traumas anketavimo metu. Vengiame rizikingų amplitudžių ir judesių, kurie kelia diskomfortą.</p>
            </article>
            <article className="safety-item">
              <h3>Technikos stebėjimas</h3>
              <p>Darbas pradedamas su minimaliais svoriais, siekiant sukurti tobulą neuromuskulinį ryšį ir judesio modelį.</p>
            </article>
            <article className="safety-item">
              <h3>Krūvio (RPE) valdymas</h3>
              <p>Naudojame nuovargio vertinimo skalę. Jei šiandien jūsų kūnas pavargęs, treniruotė adaptuojama čia ir dabar.</p>
            </article>
          </div>
        </div>
      </section>

      <section id="pasitikejimas" className="container section">
        <div className="section-head">
          <h2>Pasitikėjimas grįstas permatomu darbu.</h2>
          <p className="section-lead">
            Jūs perkate ne tiesiog trenerio laiką. Jūs investuojate į profesionalią sistemą, kuri suteikia aiškumą ir ramybę.
          </p>
        </div>

        <div className="trust-board">
          <div className="trust-dark">
            <span className="eyebrow" style={{background: "rgba(255,255,255,0.1)", color: "white", borderColor: "rgba(255,255,255,0.2)"}}>Mūsų standartas</span>
            <h2>Gausite dokumentuotą savo progreso istoriją.</h2>
            <p>
              Mano klientai gauna detalias sporto programas, kurias patogu peržiūrėti telefone ar atsispausdinti. 
              Matote kiekvieną savo žingsnį ir žinote, kur link judame.
            </p>

            <div className="trust-metrics">
              <div className="trust-metric">
                <strong>200+</strong>
                <span>Klientų sėkmės istorijų</span>
              </div>
              <div className="trust-metric">
                <strong>100%</strong>
                <span>Individualizuotas turinys</span>
              </div>
            </div>
            
            <button className="btn btn-lime" style={{marginTop: 32, width: "100%"}} type="button" onClick={() => setBookingOpen(true)}>
              Pradėti bendradarbiavimą
            </button>
          </div>

          <div className="story-grid">
            <article className="story-card">
              <small>Kliento istorija</small>
              <h3>Nuo nugaros skausmų iki pasitikėjimo</h3>
              <p><strong>Situacija:</strong> Sėdimas darbas ir nuolatinė įtampa juosmenyje. <br/><strong>Sprendimas:</strong> Mobilumo ir core stabilizavimo protokolas, palaipsniui pereinant prie bazinės jėgos.</p>
            </article>
            <article className="story-card">
              <small>Sėkmės atvejis</small>
              <h3>Užstrigęs progresas salėje</h3>
              <p><strong>Situacija:</strong> 2 metus sportuota be aiškaus rezultato. <br/><strong>Sprendimas:</strong> Įdiegta periodizacija, dvigubos progresijos modelis ir subalansuotas atsistatymas.</p>
            </article>
          </div>
        </div>
      </section>

      <section id="kontaktai" className="container section">
        <div className="contact-card">
          <div>
            <span className="eyebrow" style={{background: "rgba(255,255,255,0.1)", color: "white", borderColor: "rgba(255,255,255,0.2)"}}>Kontaktai</span>
            <h2>Pasiruošę pradėti?</h2>
            <p>
              Pirmas žingsnis – užpildyti trumpą anketą. Tai niekuo neįpareigoja, tačiau padeda suprasti jūsų lūkesčius.
            </p>
            <button className="btn btn-lime" type="button" onClick={() => setBookingOpen(true)}>
              Užpildyti registracijos anketą
            </button>
          </div>

          <div className="contact-box">
            <div className="contact-line">
              <span>Telefonas</span>
              <strong>+370 600 00000</strong>
            </div>
            <div className="contact-line">
              <span>El. paštas</span>
              <strong>hello@treneris.lt</strong>
            </div>
            <div className="contact-line">
              <span>Lokacija</span>
              <strong>Premium Gym, Vilnius</strong>
            </div>
            <div className="contact-line">
              <span>Darbo valandos</span>
              <strong>I–V · 07:00–19:00</strong>
            </div>
          </div>
        </div>
      </section>

      <footer className="container footer">
        <div style={{fontWeight: 800, marginBottom: 8, color: "var(--ink)"}}>Vardenis Pavardenis</div>
        © {new Date().getFullYear()} Asmeninio treniravimo paslaugos. Visos teisės saugomos.
      </footer>

      {bookingOpen && <BookingModal onClose={() => setBookingOpen(false)} />}
    </main>
  );
}