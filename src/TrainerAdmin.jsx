import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "vardenis_admin_demo_v10_narrow_program_builder";

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
    status: "Patvirtinta",
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
  { id: "r1", clientId: "c1", date: "2026-06-08", time: "08:00", service: "Individuali treniruotė", status: "Aktyvus", goal: "Viršutinė kūno dalis ir core" },
  { id: "r2", clientId: "c2", date: "2026-06-08", time: "09:30", service: "Treniruočių abonementas", status: "Patvirtinta", goal: "Pradinis pokalbis ir grafiko suderinimas" },
  { id: "r3", clientId: "c6", date: "2026-06-08", time: "11:00", service: "Individuali treniruotė", status: "Priimtas", goal: "Pirma treniruotė, judesių įvertinimas" },
  { id: "r4", clientId: "c3", date: "2026-06-08", time: "16:30", service: "Nuotolinė priežiūra", status: "Naujas", goal: "Aptarti tikslą ir sporto salės įrangą" },
  { id: "r5", clientId: "c7", date: "2026-06-08", time: "18:00", service: "Treniruočių abonementas", status: "Aktyvus", goal: "Laikysena, core, mobilumas" },
  { id: "r6", clientId: "c4", date: "2026-06-08", time: "19:30", service: "Treniruočių planas", status: "Užklausa", goal: "Aptarti plano struktūrą" },

  { id: "r7", clientId: "c8", date: "2026-06-09", time: "08:00", service: "Treniruočių planas", status: "Naujas", goal: "Surinkti informaciją planui" },
  { id: "r8", clientId: "c1", date: "2026-06-09", time: "18:00", service: "Individuali treniruotė", status: "Aktyvus", goal: "Kojos ir technika" },
  { id: "r9", clientId: "c2", date: "2026-06-10", time: "16:30", service: "Treniruočių abonementas", status: "Patvirtinta", goal: "Treniruotė pagal mėnesinį grafiką" },
  { id: "r10", clientId: "c5", date: "2026-06-10", time: "19:30", service: "Mitybos konsultacija", status: "Atmestas", goal: "Konsultacijos užklausa atmesta" },
  { id: "r11", clientId: "c7", date: "2026-06-11", time: "08:00", service: "Treniruočių abonementas", status: "Aktyvus", goal: "Mobilumas ir full body" },
  { id: "r12", clientId: "c6", date: "2026-06-12", time: "11:00", service: "Individuali treniruotė", status: "Priimtas", goal: "Bazinių judesių technika" },
  { id: "r13", clientId: "c1", date: "2026-06-15", time: "08:00", service: "Individuali treniruotė", status: "Aktyvus", goal: "Viršutinė kūno dalis" },
  { id: "r14", clientId: "c2", date: "2026-06-16", time: "09:30", service: "Treniruočių abonementas", status: "Patvirtinta", goal: "Jėgos treniruotė" },
  { id: "r15", clientId: "c7", date: "2026-06-18", time: "18:00", service: "Treniruočių abonementas", status: "Aktyvus", goal: "Core ir laikysena" },
  { id: "r16", clientId: "c4", date: "2026-06-22", time: "16:30", service: "Treniruočių planas", status: "Užklausa", goal: "Plano korekcija" },
];

const initialBlocked = [
  { id: "b1", date: "2026-06-08", time: "06:30", reason: "Treneris užimtas / pasiruošimas" },
  { id: "b2", date: "2026-06-08", time: "12:30", reason: "Pertrauka / administracinis laikas" },
  { id: "b3", date: "2026-06-13", time: "12:30", reason: "Asmeninis užimtumas" },
  { id: "b4", date: "2026-06-20", time: "16:30", reason: "Mokymai" },
];

function getStatusClass(status) {
  return statusStyles[status] || "bg-stone-100 text-stone-700";
}

const programTemplates = [
  {
    id: "balanced-hypertrophy",
    label: "Hipertrofija · Upper / Lower",
    description: "4 dienos per savaitę, baziniai judesiai, aiški progresija.",
  },
  {
    id: "beginner-recomposition",
    label: "Pradedantysis · Full body",
    description: "3 dienos per savaitę, technika, saugus krūvis, kūno kompozicija.",
  },
  {
    id: "strength-base",
    label: "Jėgos bazė · 3 dienos",
    description: "Pagrindiniai kėlimai, ilgesnis poilsis, kontroliuojamas RPE.",
  },
];

const defaultExercise = {
  id: "A1",
  movement: "Stūmimas",
  muscleGroup: "Krūtinė / pečiai",
  name: "Naujas pratimas",
  meta: "Technikos pastabos ir saugumo akcentai.",
  sets: "3",
  reps: "8–10",
  setsReps: "3 x 8–10",
  load: "",
  rpe: "RPE 8 / 2 RIR",
  rest: "2 min.",
  tempo: "3-0-1-0",
  progression: "Kai visose serijose pasiekiamas viršutinis pakartojimų intervalas, didinti svorį 2,5–5 %.",
  alternatives: "Alternatyvus pratimas, jei įranga užimta arba jaučiamas diskomfortas.",
  contraindications: "",
  videoUrl: "",
  result: "",
};

function createExercise(overrides = {}) {
  const merged = { ...defaultExercise, ...overrides };
  return {
    ...merged,
    setsReps: merged.setsReps || `${merged.sets} x ${merged.reps}`,
  };
}

function createWorkoutDay(overrides = {}) {
  return {
    title: "NAUJA TRENIRUOTĖ",
    focus: "Bendras pasirengimas",
    priority: "Technika ir kontroliuojamas krūvis",
    warmup: "5–8 min. lengvo kardio + mobilumas pagal treniruotės kryptį.",
    cooldown: "3–5 min. lengvas atsipalaidavimas, kvėpavimas, tempimo pratimai pagal poreikį.",
    notes: "Stebėti techniką, skausmo skalę ir nuovargį. Skausmui didėjant pratimą keisti.",
    exercises: [createExercise()],
    ...overrides,
  };
}

function createDefaultWorkoutPlan(client = {}, templateId = "balanced-hypertrophy") {
  const common = {
    title: "SPORTO PROGRAMA",
    subtitle: "Individuali, progresuojanti treniruočių sistema",
    coach: "Vardenis Pavardenis",
    clientName: client.name || "Klientas",
    weight: "",
    height: "",
    duration: "4–6 savaitės",
    goal: client.goal || "Jėga, laikysena ir saugus progresas",
    level: "Vidutinis",
    location: "Sporto salė",
    equipment: "Štanga, hanteliai, treniruokliai, lynai",
    sessionsPerWeek: "4",
    system: "Upper / Lower · 4 d. per savaitę",
    phase: "1 etapas · technika + bazinis progresas",
    progressionModel: "Dviguba progresija: pirma didinami pakartojimai, tada svoris.",
    deload: "Jei 2 treniruotes iš eilės krenta rezultatai arba jaučiamas didelis nuovargis — sumažinti apimtį 30–40 % vienai savaitei.",
    assessment: "Įvertinti bazinius judesius, mobilumą, skausmo / diskomforto zonas ir treniruočių patirtį.",
    warmup: "Bendra apšilimo dalis: 5–8 min. lengvas kardio, dinaminis mobilumas, 2–4 įvadinės serijos pagrindiniam pratimui.",
    cooldown: "Po treniruotės: 3–5 min. atsistatymas, kvėpavimas, lengvas tempimas pagal poreikį.",
    nutrition: "Baltymai kiekviename pagrindiniame valgyme, pakankamas vandens kiekis, stabilus miego režimas.",
    reviewDate: "Po 2 savaičių",
    coachNotes: "Programa koreguojama pagal techniką, savijautą ir realius rezultatus.",
    clientInstructions: "Visus darbinius svorius žymėti rezultatų laukelyje. Pratimą stabdyti, jei atsiranda aštrus skausmas.",
    alerts: client.health || "Nėra nurodytų apribojimų.",
  };

  if (templateId === "beginner-recomposition") {
    return {
      ...common,
      subtitle: "Pradedančiojo kūno kompozicijos ir technikos sistema",
      duration: "4 savaitės",
      system: "Full body · 3 d. per savaitę",
      sessionsPerWeek: "3",
      level: "Pradedantysis",
      phase: "1 etapas · judesių mokymasis",
      goal: client.goal || "Saugus startas, technika ir bendras fizinis pasirengimas",
      days: [
        createWorkoutDay({
          title: "DIENA A: FULL BODY · TECHNIKA",
          focus: "Bazinių judesių mokymasis",
          priority: "Judesių kokybė, kvėpavimas, stabilumas",
          exercises: [
            createExercise({ id: "A1", movement: "Keliai", muscleGroup: "Kojos", name: "Goblet pritūpimas", meta: "Laikyti neutralų liemenį, keliai juda pėdos kryptimi.", sets: "3", reps: "8–10", rpe: "RPE 7 / 3 RIR", rest: "90 sek.", alternatives: "Leg press arba box squat" }),
            createExercise({ id: "A2", movement: "Stūmimas", muscleGroup: "Krūtinė", name: "Atsispaudimai nuo pakylos", meta: "Kūnas viena linija, pečiai stabilūs.", sets: "3", reps: "8–12", rpe: "RPE 7", rest: "90 sek.", alternatives: "Chest press treniruoklis" }),
            createExercise({ id: "B1", movement: "Trauka", muscleGroup: "Nugara", name: "Sėdima lyno trauka", meta: "Mentės juda kontroliuojamai, netraukti kaklu.", sets: "3", reps: "10–12", rpe: "RPE 7–8", rest: "90 sek." }),
            createExercise({ id: "C1", movement: "Core", muscleGroup: "Pilvo presas", name: "Dead bug", meta: "Juosmuo stabilus, judesys lėtas.", sets: "3", reps: "8 / pusė", rpe: "Kontrolė", rest: "60 sek." }),
          ],
        }),
        createWorkoutDay({
          title: "DIENA B: FULL BODY · JĖGOS BAZĖ",
          focus: "Stūmimas, traukimas, klubų darbas",
          exercises: [
            createExercise({ id: "A1", movement: "Klubai", muscleGroup: "Sėdmenys / šlaunies galas", name: "Rumuniška trauka su hanteliais", meta: "Judesys per klubus, nugara neutrali.", sets: "3", reps: "8–10", rpe: "RPE 7–8", rest: "2 min.", alternatives: "Hip hinge su lazda / cable pull-through" }),
            createExercise({ id: "A2", movement: "Stūmimas", muscleGroup: "Pečiai", name: "Hantelių spaudimas sėdint", meta: "Nelaikyti per didelio juosmens išlinkimo.", sets: "3", reps: "8–10", rpe: "RPE 7–8", rest: "90 sek." }),
            createExercise({ id: "B1", movement: "Trauka", muscleGroup: "Nugara", name: "Vertikali bloko trauka", meta: "Traukti alkūnes žemyn, nekelti pečių.", sets: "3", reps: "10–12", rpe: "RPE 8", rest: "90 sek." }),
            createExercise({ id: "C1", movement: "Nešimas", muscleGroup: "Core / grip", name: "Farmer carry", meta: "Stabili laikysena, trumpi žingsniai.", sets: "3", reps: "30–40 m", rpe: "RPE 7", rest: "90 sek." }),
          ],
        }),
        createWorkoutDay({
          title: "DIENA C: FULL BODY · KONDICIJA IR MOBILUMAS",
          focus: "Kondicija, mobilumas, raumenų tonusas",
          exercises: [
            createExercise({ id: "A1", movement: "Kondicija", muscleGroup: "Visas kūnas", name: "Dviratis / elipsinis", meta: "Vidutinis tempas, galima kalbėti trumpais sakiniais.", sets: "1", reps: "12–18 min.", rpe: "RPE 6–7", rest: "—", tempo: "Pastovus" }),
            createExercise({ id: "B1", movement: "Vienos kojos", muscleGroup: "Kojos", name: "Atbuliniai įtūpstai", meta: "Trumpa amplitudė, jei jautrūs keliai.", sets: "3", reps: "8 / pusė", rpe: "RPE 7", rest: "90 sek.", contraindications: "Kelio skausmui didėjant keisti į step-up." }),
            createExercise({ id: "B2", movement: "Trauka", muscleGroup: "Nugara", name: "Face pull", meta: "Alkūnės aukštai, mentės kontroliuojamos.", sets: "3", reps: "12–15", rpe: "RPE 8", rest: "60–75 sek." }),
            createExercise({ id: "C1", movement: "Mobilumas", muscleGroup: "Klubai / pečiai", name: "Mobilumo grandinė", meta: "Klubai, čiurnos, krūtinės ląstos rotacija.", sets: "2", reps: "6–8 min.", rpe: "Lengva", rest: "—" }),
          ],
        }),
      ],
    };
  }

  if (templateId === "strength-base") {
    return {
      ...common,
      subtitle: "Bazinės jėgos ir technikos vystymo sistema",
      system: "Full body jėga · 3 d. per savaitę",
      sessionsPerWeek: "3",
      level: "Vidutinis",
      phase: "Jėgos bazė · kontroliuojamas intensyvumas",
      progressionModel: "Linijinė progresija mažais žingsniais, jei technika stabili ir RPE neviršija plano.",
      days: [
        createWorkoutDay({
          title: "DIENA A: JĖGA · PRITŪPIMAS IR SPAUDIMAS",
          focus: "Bazinis pritūpimas, horizontalus stūmimas",
          exercises: [
            createExercise({ id: "A1", movement: "Keliai", muscleGroup: "Kojos", name: "Pritūpimas su štanga", meta: "Stabili pėda, neutralus liemuo, kontroliuojama amplitudė.", sets: "4", reps: "4–6", rpe: "RPE 7.5–8", rest: "3–4 min.", tempo: "3-1-1-0", contraindications: "Kelio / nugaros skausmui didėjant mažinti amplitudę arba keisti pratimą." }),
            createExercise({ id: "A2", movement: "Stūmimas", muscleGroup: "Krūtinė", name: "Štangos spaudimas gulint", meta: "Mentės stabilios, pėdos remiasi į grindis.", sets: "4", reps: "4–6", rpe: "RPE 8", rest: "3 min." }),
            createExercise({ id: "B1", movement: "Trauka", muscleGroup: "Nugara", name: "Sėdima lyno trauka", meta: "Kontrolė, pilna amplitudė.", sets: "3", reps: "8–10", rpe: "RPE 8", rest: "2 min." }),
          ],
        }),
        createWorkoutDay({
          title: "DIENA B: JĖGA · TRAUKA IR PEČIAI",
          focus: "Klubų judesys, vertikalus stūmimas",
          exercises: [
            createExercise({ id: "A1", movement: "Klubai", muscleGroup: "Užpakalinė grandinė", name: "Mirties trauka nuo paaukštinimo", meta: "Pradėti nuo saugios amplitudės, nugara neutrali.", sets: "3", reps: "3–5", rpe: "RPE 7–8", rest: "3–4 min.", contraindications: "Jei yra juosmens jautrumas — keisti į rumunišką trauką." }),
            createExercise({ id: "A2", movement: "Stūmimas", muscleGroup: "Pečiai", name: "Spaudimas virš galvos", meta: "Sėdmenys ir pilvas aktyvūs, nekoreguoti judesio per juosmenį.", sets: "4", reps: "5–6", rpe: "RPE 8", rest: "2.5–3 min." }),
            createExercise({ id: "B1", movement: "Core", muscleGroup: "Pilvo presas", name: "Pallof press", meta: "Atsispirti rotacijai, laikyti dubenį neutraliai.", sets: "3", reps: "10 / pusė", rpe: "Kontrolė", rest: "60 sek." }),
          ],
        }),
        createWorkoutDay({
          title: "DIENA C: JĖGA · APIMTIS IR TECHNIKA",
          focus: "Papildoma apimtis, silpnų grandžių stiprinimas",
          exercises: [
            createExercise({ id: "A1", movement: "Keliai", muscleGroup: "Kojos", name: "Leg press", meta: "Kontroliuojama amplitudė, neatsiplėšti dubeniui.", sets: "3", reps: "8–10", rpe: "RPE 8", rest: "2.5 min." }),
            createExercise({ id: "A2", movement: "Trauka", muscleGroup: "Nugara", name: "Prisitraukimai / bloko trauka", meta: "Pilna amplitudė, pečiai žemyn.", sets: "4", reps: "6–8", rpe: "RPE 8", rest: "2.5 min." }),
            createExercise({ id: "B1", movement: "Izoliacija", muscleGroup: "Užpakalinė šlaunis", name: "Kojų lenkimas treniruoklyje", meta: "Kontroliuoti ekscentrinę fazę.", sets: "3", reps: "10–12", rpe: "RPE 8–9", rest: "90 sek." }),
          ],
        }),
      ],
    };
  }

  return {
    ...common,
    days: [
      createWorkoutDay({
        title: "DIENA A: VIRŠUTINĖ KŪNO DALIS · HORIZONTALUS AKCENTAS",
        focus: "Krūtinė, nugara, pečiai, rankos",
        priority: "Horizontalus stūmimas / traukimas, mentės kontrolė",
        exercises: [
          createExercise({ id: "A1", movement: "Stūmimas", muscleGroup: "Krūtinė", name: "Štangos spaudimas kampu", meta: "Fokusas į krūtinės viršų, kontroliuojamas nuleidimas.", sets: "3", reps: "6–8", rpe: "RPE 8 / 2 RIR", rest: "3 min.", tempo: "3-0-1-0" }),
          createExercise({ id: "A2", movement: "Trauka", muscleGroup: "Nugara", name: "Štangos trauka pasilenkus", meta: "Horizontalus traukimas, pilnas nugaros ištempimas apačioje.", sets: "3", reps: "8–10", rpe: "RPE 8 / 2 RIR", rest: "2.5 min.", tempo: "2-1-1-0" }),
          createExercise({ id: "B1", movement: "Stūmimas", muscleGroup: "Pečiai", name: "Hantelių spaudimas sėdint", meta: "Nenaudoti per didelio nugaros išlinkimo.", sets: "3", reps: "10–12", rpe: "RPE 8.5 / 1–2 RIR", rest: "2 min.", tempo: "3-0-1-0" }),
          createExercise({ id: "B2", movement: "Trauka", muscleGroup: "Nugara", name: "Vertikali bloko trauka", meta: "Plačiajai nugaros daliai, mentės žemyn.", sets: "3", reps: "10–12", rpe: "RPE 9 / 1 RIR", rest: "2 min.", tempo: "3-0-1-1" }),
        ],
      }),
      createWorkoutDay({
        title: "DIENA B: APATINĖ KŪNO DALIS · KETURŠLAIČIO AKCENTAS",
        focus: "Kojos, sėdmenys, core",
        priority: "Pritūpimo modelis ir stabilumas",
        exercises: [
          createExercise({ id: "A1", movement: "Keliai", muscleGroup: "Keturšlaitis", name: "Klasikiniai pritūpimai su štanga", meta: "Pilna saugi amplitudė, išlaikant stabilią pėdą.", sets: "4", reps: "6", rpe: "RPE 8 / 2 RIR", rest: "3.5 min.", tempo: "3-1-1-0" }),
          createExercise({ id: "B1", movement: "Klubai", muscleGroup: "Sėdmenys / šlaunies galas", name: "Rumuniška mirties trauka su hanteliais", meta: "Judesys per klubus, nugara neutrali.", sets: "3", reps: "8–10", rpe: "RPE 8 / 2 RIR", rest: "2.5 min.", tempo: "3-0-1-0" }),
          createExercise({ id: "C1", movement: "Izoliacija", muscleGroup: "Šlaunies galas", name: "Kojų lenkimas sėdint treniruoklyje", meta: "Izoliuotas darbas šlaunies užpakalinei daliai.", sets: "3", reps: "12–15", rpe: "RPE 9 / 1 RIR", rest: "90 sek.", tempo: "2-0-1-1" }),
        ],
      }),
      createWorkoutDay({
        title: "DIENA C: VIRŠUTINĖ KŪNO DALIS · VERTIKALUS AKCENTAS",
        focus: "Nugara, pečiai, rankos",
        exercises: [
          createExercise({ id: "A1", movement: "Trauka", muscleGroup: "Nugara", name: "Prisitraukimai / vertikali bloko trauka", meta: "Pečiai žemyn, pilna amplitudė.", sets: "4", reps: "6–10", rpe: "RPE 8", rest: "2.5 min." }),
          createExercise({ id: "A2", movement: "Stūmimas", muscleGroup: "Pečiai", name: "Spaudimas virš galvos", meta: "Stabilus liemuo, nekilnoti pečių.", sets: "3", reps: "6–8", rpe: "RPE 8", rest: "2.5 min." }),
          createExercise({ id: "B1", movement: "Izoliacija", muscleGroup: "Šoninis petys", name: "Šoninis kėlimas su hanteliais", meta: "Kontroliuoti viršutinę amplitudę, nekelti trapecija.", sets: "3", reps: "12–15", rpe: "RPE 9", rest: "75 sek." }),
        ],
      }),
      createWorkoutDay({
        title: "DIENA D: APATINĖ KŪNO DALIS · UŽPAKALINĖ GRANDINĖ",
        focus: "Sėdmenys, šlaunies galas, core",
        exercises: [
          createExercise({ id: "A1", movement: "Klubai", muscleGroup: "Sėdmenys", name: "Hip thrust", meta: "Pauzė viršuje, stabilus dubuo.", sets: "4", reps: "8–10", rpe: "RPE 8", rest: "2.5 min.", tempo: "2-1-1-1" }),
          createExercise({ id: "B1", movement: "Vienos kojos", muscleGroup: "Kojos", name: "Bulgarian split squat", meta: "Kontroliuoti kelių kryptį ir dubens padėtį.", sets: "3", reps: "8–10 / pusė", rpe: "RPE 8", rest: "2 min.", contraindications: "Kelio jautrumui didėjant mažinti amplitudę." }),
          createExercise({ id: "C1", movement: "Core", muscleGroup: "Pilvo presas", name: "Cable crunch", meta: "Judėti per pilvo presą, ne per klubus.", sets: "3", reps: "10–12", rpe: "RPE 8", rest: "75 sek." }),
        ],
      }),
    ],
  };
}

function normalizeExercise(exercise = {}, exerciseIndex = 0) {
  const setsReps = exercise.setsReps || `${exercise.sets || "3"} x ${exercise.reps || "10"}`;
  const [setsPart, repsPart] = setsReps.includes(" x ") ? setsReps.split(" x ") : [exercise.sets || "3", exercise.reps || "10"];

  return {
    ...defaultExercise,
    ...exercise,
    id: exercise.id || `A${exerciseIndex + 1}`,
    sets: exercise.sets || setsPart || "3",
    reps: exercise.reps || repsPart || "10",
    setsReps,
    movement: exercise.movement || "Bendras",
    muscleGroup: exercise.muscleGroup || "Tikslinė raumenų grupė",
    load: exercise.load || "",
    progression: exercise.progression || defaultExercise.progression,
    alternatives: exercise.alternatives || "",
    contraindications: exercise.contraindications || "",
    videoUrl: exercise.videoUrl || "",
    result: exercise.result || "",
  };
}

function normalizeWorkoutPlan(client) {
  const plan = client?.workoutPlan || createDefaultWorkoutPlan(client);

  return {
    ...createDefaultWorkoutPlan(client),
    ...plan,
    title: plan.title || "SPORTO PROGRAMA",
    subtitle: plan.subtitle || "Individuali treniruočių sistema",
    coach: plan.coach || "Vardenis Pavardenis",
    clientName: plan.clientName || client.name || "Klientas",
    goal: plan.goal || client.goal || "",
    alerts: plan.alerts || client.health || "Nėra nurodytų apribojimų.",
    days: Array.isArray(plan.days) && plan.days.length
      ? plan.days.map((day, index) => ({
          ...createWorkoutDay(),
          ...day,
          title: day.title || `DIENA ${index + 1}`,
          focus: day.focus || "Treniruotės fokusas",
          priority: day.priority || "Pagrindinis prioritetas",
          warmup: day.warmup || "5–8 min. apšilimas + įvadinės serijos.",
          cooldown: day.cooldown || "Lengvas atsistatymas ir mobilumas.",
          notes: day.notes || "",
          exercises: Array.isArray(day.exercises) && day.exercises.length
            ? day.exercises.map((exercise, exerciseIndex) => normalizeExercise(exercise, exerciseIndex))
            : [createExercise()],
        }))
      : createDefaultWorkoutPlan(client).days,
  };
}

function getTemplatePlan(templateId, client) {
  return createDefaultWorkoutPlan(client, templateId);
}

function formatSetsReps(exercise) {
  if (exercise.sets && exercise.reps) return `${exercise.sets} x ${exercise.reps}`;
  return exercise.setsReps || "3 x 10";
}

function calculateWorkoutVolume(plan) {
  const exerciseCount = plan.days.reduce((sum, day) => sum + day.exercises.length, 0);
  return {
    days: plan.days.length,
    exercises: exerciseCount,
    sessionsPerWeek: plan.sessionsPerWeek || plan.days.length,
  };
}


function normalizeState(data) {
  return {
    clients: (data?.clients || initialClients).map((client) => ({
      ...client,
      workoutPlan: normalizeWorkoutPlan(client),
    })),
    registrations: data?.registrations || initialRegistrations,
    blocked: data?.blocked || initialBlocked,
  };
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
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
            <th>RPE / RIR</th>
            <th>Poilsis / tempas</th>
            <th>Progresija / rezultatas</th>
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
              <td>${escapeHtml(exercise.rest)}<small>Tempas: ${escapeHtml(exercise.tempo)}</small></td>
              <td>
                <small>${escapeHtml(exercise.progression || safePlan.progressionModel || "—")}</small>
                <strong>${escapeHtml(exercise.result || "kg x pak.")}</strong>
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
<style>
  @page { size: A4; margin: 10mm; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: Inter, Arial, sans-serif; color: #111827; background: white; }
  .sheet { max-width: 1120px; margin: 0 auto; padding: 24px; }
  header { display: flex; justify-content: space-between; gap: 24px; border-bottom: 3px solid #111827; padding-bottom: 18px; margin-bottom: 20px; }
  h1 { margin: 0; font-size: 30px; letter-spacing: -.04em; }
  .subtitle { color: #475467; margin-top: 4px; font-size: 14px; }
  .coach { text-align: right; font-size: 12px; line-height: 1.65; }
  .meta { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; background: #f8fafc; border: 1px solid #e5e7eb; padding: 14px; border-radius: 14px; margin-bottom: 14px; font-size: 12px; }
  .meta div, .method-grid div { background: white; border: 1px solid #e5e7eb; border-radius: 10px; padding: 10px; }
  .meta strong, .method-grid strong { display: block; color: #475467; font-size: 10px; text-transform: uppercase; letter-spacing: .08em; margin-bottom: 4px; }
  .method-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; background: #f8fafc; border: 1px solid #e5e7eb; padding: 14px; border-radius: 14px; margin-bottom: 14px; font-size: 12px; }
  .alert { background: #fff1f2; border: 1px solid #fda4af; color: #9f1239; padding: 11px 12px; border-radius: 12px; margin-bottom: 12px; font-size: 12px; }
  .instructions { background: #f0fdf4; border: 1px solid #bbf7d0; color: #14532d; padding: 11px 12px; border-radius: 12px; margin-bottom: 14px; font-size: 12px; line-height: 1.45; }
  .day { break-inside: avoid; margin-top: 18px; }
  .day-head { background: #111827; color: white; padding: 12px 14px; border-radius: 12px 12px 0 0; }
  .day-head h2 { font-size: 15px; margin: 0; }
  .day-head p { margin: 5px 0 0; font-size: 11px; color: rgba(255,255,255,.72); }
  .day-notes { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; background: #f8fafc; border: 1px solid #e5e7eb; border-top: 0; padding: 10px; font-size: 11px; color: #334155; }
  table { width: 100%; border-collapse: collapse; font-size: 10.5px; }
  th { text-align: left; background: #f3f4f6; color: #475467; padding: 8px; border-bottom: 2px solid #e5e7eb; }
  td { padding: 8px; border-bottom: 1px solid #e5e7eb; vertical-align: top; }
  small { display: block; color: #64748b; margin-top: 4px; line-height: 1.35; }
  .danger { color: #be123c; }
  .guide { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; background: #f8fafc; border-radius: 14px; padding: 14px; margin-top: 20px; font-size: 11px; color: #334155; }
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
      <div class="coach"><strong>Treneris:</strong> ${escapeHtml(safePlan.coach)}<br /><strong>Data:</strong> ${new Date().toLocaleDateString("lt-LT")}<br /><strong>Klientas:</strong> ${escapeHtml(safePlan.clientName)}</div>
    </header>
    <section class="meta">
      <div><strong>Klientas</strong>${escapeHtml(safePlan.clientName)}</div>
      <div><strong>Sistemos tipas</strong>${escapeHtml(safePlan.system)}</div>
      <div><strong>Ūgis / svoris</strong>${escapeHtml(safePlan.height || "—")} cm / ${escapeHtml(safePlan.weight || "—")} kg</div>
      <div><strong>Trukmė</strong>${escapeHtml(safePlan.duration)}</div>
    </section>
    ${phaseHtml}
    <section class="alert"><strong>Sveikatos apribojimai:</strong> ${escapeHtml(safePlan.alerts)}</section>
    <section class="instructions"><strong>Klientui:</strong> ${escapeHtml(safePlan.clientInstructions)}<br /><strong>Apšilimas:</strong> ${escapeHtml(safePlan.warmup)}<br /><strong>Deload:</strong> ${escapeHtml(safePlan.deload)}</section>
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
    return normalizeState({
      clients: initialClients,
      registrations: initialRegistrations,
      blocked: initialBlocked,
    });
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

function toDateKey(date) {
  return date.toISOString().slice(0, 10);
}

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

  const selectedClient = state.clients.find((client) => client.id === selectedClientId);
  const selectedWorkoutPlan = selectedClient?.workoutPlan || createDefaultWorkoutPlan(selectedClient);
  const selectedRegistration = state.registrations.find((item) => item.id === selectedRegistrationId);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  function getClient(clientId) {
    return state.clients.find((client) => client.id === clientId);
  }

  function matchSearch(registration) {
    const query = search.trim().toLowerCase();
    if (!query) return true;

    const client = getClient(registration.clientId);
    const combined = [
      client?.name,
      client?.phone,
      client?.email,
      client?.status,
      client?.packageName,
      client?.goal,
      registration.service,
      registration.goal,
      registration.status,
      registration.date,
      registration.time,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return combined.includes(query);
  }

  function matchStatus(registration) {
    if (statusFilter === "Visos būsenos") return true;
    const client = getClient(registration.clientId);

    return registration.status === statusFilter || client?.status === statusFilter;
  }

  const filteredAllRegistrations = useMemo(() => {
    return state.registrations
      .filter((item) => matchStatus(item))
      .filter((item) => matchSearch(item))
      .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
  }, [state.registrations, state.clients, statusFilter, search]);

  const registrationsForDate = useMemo(() => {
    return filteredAllRegistrations.filter((item) => item.date === selectedDate);
  }, [filteredAllRegistrations, selectedDate]);

  const activeClients = useMemo(
    () => state.clients.filter((client) => client.status === "Aktyvus" || client.status === "Priimtas" || client.status === "Patvirtinta"),
    [state.clients]
  );

  const requestClients = useMemo(
    () => state.clients.filter((client) => client.status === "Naujas" || client.status === "Užklausa" || client.status === "Atmestas"),
    [state.clients]
  );

  const monthDays = useMemo(() => getMonthDays(selectedMonth), [selectedMonth]);

  const monthSummary = useMemo(() => {
    return monthDays.map((date) => {
      const dayRegistrations = filteredAllRegistrations.filter((item) => item.date === date);
      const dayBlocked = state.blocked.filter((item) => item.date === date);
      const occupied = dayRegistrations.length + dayBlocked.length;
      const total = timeSlots.length;
      const free = Math.max(total - occupied, 0);

      return {
        date,
        dayRegistrations,
        dayBlocked,
        occupied,
        free,
        total,
      };
    });
  }, [monthDays, filteredAllRegistrations, state.blocked]);

  const stats = [
    ["Dienos įrašai", registrationsForDate.length],
    ["Mėnesio įrašai", monthSummary.reduce((sum, day) => sum + day.dayRegistrations.length, 0)],
    ["Patvirtintos", state.registrations.filter((item) => item.status === "Patvirtinta").length],
    ["Užklausos / nauji", state.registrations.filter((item) => item.status === "Užklausa" || item.status === "Naujas").length],
  ];

  function showToast(message) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  }

  function updateClient(clientId, patch) {
    setState((current) => ({
      ...current,
      clients: current.clients.map((client) =>
        client.id === clientId ? { ...client, ...patch } : client
      ),
    }));
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
    updateSelectedWorkoutPlan((plan) => ({
      ...plan,
      days: plan.days.map((day, index) => index === dayIndex ? { ...day, ...patch } : day),
    }));
  }

  function addWorkoutDay() {
    updateSelectedWorkoutPlan((plan) => ({
      ...plan,
      days: [
        ...plan.days,
        createWorkoutDay({
          title: `DIENA ${plan.days.length + 1}: NAUJA TRENIRUOTĖ`,
          focus: "Naujos treniruotės fokusas",
          exercises: [
            createExercise({ id: "A1", name: "Naujas pratimas" }),
          ],
        }),
      ],
    }));
  }

  function duplicateWorkoutDay(dayIndex) {
    updateSelectedWorkoutPlan((plan) => {
      const dayToCopy = plan.days[dayIndex];
      if (!dayToCopy) return plan;
      const clonedDay = {
        ...dayToCopy,
        title: `${dayToCopy.title} · kopija`,
        exercises: dayToCopy.exercises.map((exercise) => ({ ...exercise })),
      };

      const days = [...plan.days];
      days.splice(dayIndex + 1, 0, clonedDay);
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
    updateSelectedWorkoutPlan((plan) => ({
      ...plan,
      days: plan.days.length > 1 ? plan.days.filter((_, index) => index !== dayIndex) : plan.days,
    }));
  }

  function updateWorkoutExercise(dayIndex, exerciseIndex, patch) {
    updateSelectedWorkoutPlan((plan) => ({
      ...plan,
      days: plan.days.map((day, index) => {
        if (index !== dayIndex) return day;
        return {
          ...day,
          exercises: day.exercises.map((exercise, itemIndex) =>
            itemIndex === exerciseIndex
              ? normalizeExercise({ ...exercise, ...patch }, itemIndex)
              : exercise
          ),
        };
      }),
    }));
  }

  function addWorkoutExercise(dayIndex) {
    updateSelectedWorkoutPlan((plan) => ({
      ...plan,
      days: plan.days.map((day, index) => {
        if (index !== dayIndex) return day;
        const nextNumber = day.exercises.length + 1;
        return {
          ...day,
          exercises: [
            ...day.exercises,
            createExercise({ id: `A${nextNumber}`, name: "Naujas pratimas" }),
          ],
        };
      }),
    }));
  }

  function duplicateWorkoutExercise(dayIndex, exerciseIndex) {
    updateSelectedWorkoutPlan((plan) => ({
      ...plan,
      days: plan.days.map((day, index) => {
        if (index !== dayIndex) return day;
        const exercise = day.exercises[exerciseIndex];
        if (!exercise) return day;

        const exercises = [...day.exercises];
        exercises.splice(exerciseIndex + 1, 0, { ...exercise, id: `${exercise.id} kopija` });

        return { ...day, exercises };
      }),
    }));
  }

  function moveWorkoutExercise(dayIndex, exerciseIndex, direction) {
    updateSelectedWorkoutPlan((plan) => ({
      ...plan,
      days: plan.days.map((day, index) => {
        if (index !== dayIndex) return day;

        const nextIndex = exerciseIndex + direction;
        if (nextIndex < 0 || nextIndex >= day.exercises.length) return day;

        const exercises = [...day.exercises];
        const [exercise] = exercises.splice(exerciseIndex, 1);
        exercises.splice(nextIndex, 0, exercise);

        return { ...day, exercises };
      }),
    }));
  }

  function removeWorkoutExercise(dayIndex, exerciseIndex) {
    updateSelectedWorkoutPlan((plan) => ({
      ...plan,
      days: plan.days.map((day, index) => {
        if (index !== dayIndex) return day;
        return {
          ...day,
          exercises: day.exercises.length > 1 ? day.exercises.filter((_, itemIndex) => itemIndex !== exerciseIndex) : day.exercises,
        };
      }),
    }));
  }

  function resetWorkoutPlanForClient() {
    if (!selectedClient) return;
    updateSelectedWorkoutPlan(() => createDefaultWorkoutPlan(selectedClient, programPreset));
    showToast("Kliento sporto programa atstatyta pagal pasirinktą šabloną.");
  }

  function exportWorkoutPlanToPdf() {
    if (!selectedClient) return;
    const printWindow = window.open("", "_blank", "width=1100,height=900");

    if (!printWindow) {
      showToast("Naršyklė užblokavo PDF langą. Leiskite iššokančius langus.");
      return;
    }

    printWindow.document.open();
    printWindow.document.write(buildWorkoutPlanHtml(selectedClient, selectedWorkoutPlan));
    printWindow.document.close();
    printWindow.focus();
    window.setTimeout(() => printWindow.print(), 350);
    showToast("Atidarytas PDF eksportas. Pasirinkite Save as PDF.");
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
    syncClientAndRegistrationStatus(registration.clientId, registration.id, "Patvirtinta");
    showToast("Registracija patvirtinta.");
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
    localStorage.removeItem(STORAGE_KEY);
    setState(normalizeState({
      clients: initialClients,
      registrations: initialRegistrations,
      blocked: initialBlocked,
    }));
    setSelectedClientId(initialClients[0].id);
    setSelectedRegistrationId(initialRegistrations[0].id);
    setStatusFilter("Visos būsenos");
    setSearch("");
    showToast("Demo duomenys atstatyti.");
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_10%_0%,rgba(199,244,90,.18),transparent_34%),linear-gradient(180deg,#FBFAF6,#F4F1EA)] px-3 py-4 text-ink sm:px-5 sm:py-8">
      <div className="mx-auto w-[min(1520px,100%)]">
        <header className="mb-5 flex flex-col gap-4 rounded-[1.4rem] border border-ink/10 bg-white/90 p-4 shadow-soft sm:mb-6 sm:rounded-[2rem] sm:p-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[.18em] text-ink/42">Admin panelė</p>
            <h1 className="mt-2 font-display text-[clamp(2.2rem,5vw,5rem)] font-extrabold leading-none tracking-[-.075em]">
              Trenerio valdymas
            </h1>
            <p className="mt-3 max-w-3xl text-ink/58">
              Dienos ir mėnesio užimtumas, veikianti filtracija, aktyvūs klientai ir registracijų valdymas.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={resetDemoData}
              className="rounded-full bg-white px-4 py-3 text-sm font-black text-ink shadow-soft transition hover:-translate-y-0.5 sm:px-5"
            >
              Atstatyti demo
            </button>
            <a
              href="/"
              className="rounded-full bg-forest px-4 py-3 text-sm font-black text-white shadow-soft transition hover:-translate-y-0.5 sm:px-5"
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

        <section className="mb-6 rounded-[1.8rem] border border-ink/10 bg-white/90 p-4 shadow-soft">
          <div className="grid gap-3 lg:grid-cols-[170px_170px_230px_1fr]">
            <div className="flex rounded-2xl border border-ink/10 bg-white p-1">
              {["Diena", "Mėnuo"].map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setViewMode(mode)}
                  className={`flex-1 rounded-xl px-2.5 py-2 text-sm font-black transition ${
                    viewMode === mode ? "bg-forest text-white" : "text-ink/55 hover:bg-ink/5"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            {viewMode === "Diena" ? (
              <input
                type="date"
                value={selectedDate}
                onChange={(event) => {
                  setSelectedDate(event.target.value);
                  setSelectedMonth(event.target.value.slice(0, 7));
                }}
                className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm font-bold outline-none focus:ring-4 focus:ring-lime/20"
              />
            ) : (
              <input
                type="month"
                value={selectedMonth}
                onChange={(event) => setSelectedMonth(event.target.value)}
                className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm font-bold outline-none focus:ring-4 focus:ring-lime/20"
              />
            )}

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
              placeholder="Ieškoti pagal klientą, telefoną, paslaugą, tikslą arba būseną..."
              className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm font-bold outline-none focus:ring-4 focus:ring-lime/20"
            />
          </div>

          <div className="mt-3 rounded-[1.2rem] bg-lime/10 px-4 py-3 text-sm font-bold text-forest">
            Filtracija veikia automatiškai. Pasirinkus būseną arba įvedus tekstą, keičiasi dienos grafikas, mėnesio užimtumas ir registracijų sąrašai.
          </div>
        </section>

        {viewMode === "Mėnuo" && (
          <section className="mb-6 overflow-x-auto rounded-[1.4rem] border border-ink/10 bg-white/92 p-4 shadow-soft sm:rounded-[2rem] sm:p-5">
            <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="font-display text-3xl font-extrabold tracking-[-.06em]">Mėnesio užimtumas</h2>
                <p className="text-sm text-ink/55">{selectedMonth}</p>
              </div>
              <div className="text-sm font-bold text-ink/55">
                Spauskite dieną, kad atidarytumėte jos grafiką.
              </div>
            </div>

            <div className="grid min-w-[760px] grid-cols-7 overflow-hidden rounded-[1.4rem] border border-ink/10">
              {["P", "A", "T", "K", "P", "Š", "S"].map((day) => (
                <div key={day} className="bg-bone p-3 text-center text-xs font-black uppercase tracking-[.16em] text-ink/55">
                  {day}
                </div>
              ))}

              {monthSummary.map((day) => {
                const dateNumber = Number(day.date.slice(-2));
                const hasItems = day.occupied > 0;
                const percent = Math.round((day.occupied / day.total) * 100);

                return (
                  <button
                    key={day.date}
                    type="button"
                    onClick={() => {
                      setSelectedDate(day.date);
                      setSelectedMonth(day.date.slice(0, 7));
                      setViewMode("Diena");
                    }}
                    className={`min-h-[150px] border-t border-ink/10 p-3 text-left transition hover:bg-lime/10 ${
                      hasItems ? "bg-white" : "bg-paper/70"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-xs font-black text-ink/35">{getWeekday(day.date)}</div>
                        <div className="font-display text-3xl font-extrabold tracking-[-.06em]">{dateNumber}</div>
                      </div>
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-black ${hasItems ? "bg-forest text-white" : "bg-ink/5 text-ink/45"}`}>
                        {day.occupied}/{day.total}
                      </span>
                    </div>

                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-ink/5">
                      <div className="h-full rounded-full bg-lime" style={{ width: `${percent}%` }} />
                    </div>

                    <div className="mt-3 space-y-1">
                      {day.dayRegistrations.slice(0, 3).map((item) => {
                        const client = getClient(item.clientId);

                        return (
                          <div key={item.id} className="truncate rounded-lg bg-lime/20 px-2 py-1 text-xs font-black text-forest">
                            {item.time} · {client?.name || "Klientas"}
                          </div>
                        );
                      })}
                      {day.dayBlocked.length > 0 && (
                        <div className="rounded-lg bg-stone-100 px-2 py-1 text-xs font-black text-stone-600">
                          {day.dayBlocked.length} blokuota
                        </div>
                      )}
                      {day.dayRegistrations.length > 3 && (
                        <div className="text-xs font-black text-ink/35">+{day.dayRegistrations.length - 3} daugiau</div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        <section className="grid gap-6 2xl:grid-cols-[1.12fr_.88fr]">
          <div className="overflow-x-auto rounded-[1.4rem] border border-ink/10 bg-white/92 shadow-soft sm:rounded-[2rem]">
            <div className="border-b border-ink/10 bg-paper px-4 py-4 sm:px-5">
              <h2 className="font-display text-2xl font-extrabold tracking-[-.06em]">Dienos grafikas</h2>
              <p className="text-sm text-ink/55">
                {selectedDate} · rodoma pagal pasirinktus filtrus
              </p>
            </div>

            <div className="grid min-w-[660px] grid-cols-[86px_1fr] sm:min-w-[680px] sm:grid-cols-[95px_1fr]">
              <div className="border-b border-r border-ink/10 bg-bone p-3 text-xs font-black uppercase tracking-[.14em] text-ink/55">
                Laikas
              </div>
              <div className="border-b border-ink/10 bg-bone p-3 text-xs font-black uppercase tracking-[.14em] text-ink/55">
                Užimtumas
              </div>

              {timeSlots.map((time) => {
                const { registration, block } = getSlot(time);
                const client = registration ? getClient(registration.clientId) : null;
                const shouldShowRegistration =
                  registration &&
                  client &&
                  matchStatus(registration) &&
                  matchSearch(registration);

                return (
                  <div key={time} className="contents">
                    <div className="min-h-32 border-b border-r border-ink/10 bg-paper p-3 text-sm font-black text-ink/50">
                      {time}
                    </div>

                    <div className="min-h-32 border-b border-ink/10 bg-white p-3">
                      {registration && client && shouldShowRegistration ? (
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
                              Patvirtinti
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
                      ) : registration && client ? (
                        <div className="flex h-full items-center justify-between gap-3 rounded-2xl bg-ink/[.03] p-4">
                          <span className="text-sm font-bold text-ink/35">
                            Yra įrašas, bet jis neatitinka pasirinktų filtrų.
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setStatusFilter("Visos būsenos");
                              setSearch("");
                            }}
                            className="rounded-full bg-white px-4 py-2 text-xs font-black text-ink shadow-soft"
                          >
                            Rodyti visus
                          </button>
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
            <section className="rounded-[1.4rem] border border-ink/10 bg-white/92 p-4 shadow-soft sm:rounded-[2rem] sm:p-5">
              <h2 className="font-display text-2xl font-extrabold tracking-[-.06em]">Registracijos ir užklausos</h2>
              <p className="mt-1 text-sm text-ink/55">Rodoma pagal pasirinktą datą, būseną ir paiešką.</p>

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
                            className="rounded-xl border border-ink/10 px-2.5 py-2 text-sm font-bold"
                          >
                            {statuses.map((status) => (
                              <option key={status}>{status}</option>
                            ))}
                          </select>

                          <input
                            type="date"
                            value={registration.date}
                            onChange={(event) => updateRegistration(registration.id, { date: event.target.value })}
                            className="rounded-xl border border-ink/10 px-2.5 py-2 text-sm font-bold"
                          />

                          <select
                            value={registration.time}
                            onChange={(event) => updateRegistration(registration.id, { time: event.target.value })}
                            className="rounded-xl border border-ink/10 px-2.5 py-2 text-sm font-bold"
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
                    Pagal pasirinktus filtrus registracijų nėra. Pabandykite pasirinkti „Visos būsenos“ arba kitą datą.
                  </div>
                )}
              </div>
            </section>

            <section className="rounded-[1.4rem] border border-ink/10 bg-white/92 p-4 shadow-soft sm:rounded-[2rem] sm:p-5">
              <h2 className="font-display text-2xl font-extrabold tracking-[-.06em]">Klientai</h2>
              <p className="mt-1 text-sm text-ink/55">Klientų sąrašas taip pat filtruojamas pagal paiešką ir būseną.</p>

              <div className="mt-5 grid gap-2">
                {state.clients
                  .filter((client) => statusFilter === "Visos būsenos" || client.status === statusFilter)
                  .filter((client) => {
                    const query = search.trim().toLowerCase();
                    if (!query) return true;

                    return `${client.name} ${client.phone} ${client.email} ${client.status} ${client.packageName} ${client.goal}`.toLowerCase().includes(query);
                  })
                  .map((client) => (
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

        <section id="client-panel" className="mt-6 rounded-[1.4rem] border border-ink/10 bg-white/92 p-4 shadow-soft sm:rounded-[2rem] sm:p-5">
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
                  onClick={() => updateClient(selectedClient.id, { status: "Patvirtinta" })}
                  className="rounded-full bg-forest px-4 py-2 text-xs font-black text-white"
                >
                  Pažymėti patvirtintu
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
                <button
                  type="button"
                  onClick={exportWorkoutPlanToPdf}
                  className="rounded-full bg-lime px-4 py-2 text-xs font-black text-forest shadow-soft"
                >
                  Eksportuoti PDF
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

          {selectedClient && (
            <div className="mt-6 rounded-[1.6rem] border border-ink/10 bg-bone/70 p-4 sm:p-5">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[.18em] text-ink/42">Profesionali programa</p>
                  <h3 className="font-display text-2xl font-extrabold tracking-[-.06em]">Sporto programos sudarymas · kompaktiškas v10</h3>
                  <p className="mt-1 max-w-3xl text-sm leading-6 text-ink/55">
                    Kompaktiškas v10 režimas: lentelė panaikinta, pratimai rodomi siauresnėmis kortelėmis. Programa kuriama kiekvienam klientui atskirai: tikslas, lygis, įranga, fazė, progresija,
                    deload taisyklės, apšilimas, treniruotės dienos, pratimai, alternatyvos ir saugumo apribojimai.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={addWorkoutDay} className="rounded-full bg-white px-4 py-2 text-xs font-black text-ink shadow-soft">
                    + Dieną
                  </button>
                  <button type="button" onClick={resetWorkoutPlanForClient} className="rounded-full bg-rose-50 px-4 py-2 text-xs font-black text-rose-700 shadow-soft">
                    Atstatyti programą
                  </button>
                  <button type="button" onClick={exportWorkoutPlanToPdf} className="rounded-full bg-forest px-4 py-2 text-xs font-black text-white shadow-soft">
                    Eksportuoti į PDF
                  </button>
                </div>
              </div>

              <div className="mt-5 grid gap-3 lg:grid-cols-3">
                {programTemplates.map((template) => (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => applyProgramTemplate(template.id)}
                    className={`rounded-[1.35rem] border p-4 text-left transition hover:-translate-y-0.5 ${
                      programPreset === template.id ? "border-lime bg-lime/20" : "border-ink/10 bg-white"
                    }`}
                  >
                    <div className="text-sm font-black text-ink">{template.label}</div>
                    <div className="mt-1 text-xs font-bold leading-5 text-ink/50">{template.description}</div>
                  </button>
                ))}
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <label className="grid gap-1 text-xs font-black uppercase tracking-[.12em] text-ink/45">
                  Programos pavadinimas
                  <input value={selectedWorkoutPlan.title} onChange={(event) => updateSelectedWorkoutPlan({ title: event.target.value })} className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm font-bold normal-case tracking-normal text-ink outline-none focus:ring-4 focus:ring-lime/20" />
                </label>
                <label className="grid gap-1 text-xs font-black uppercase tracking-[.12em] text-ink/45">
                  Sistemos tipas
                  <input value={selectedWorkoutPlan.system} onChange={(event) => updateSelectedWorkoutPlan({ system: event.target.value })} className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm font-bold normal-case tracking-normal text-ink outline-none focus:ring-4 focus:ring-lime/20" />
                </label>
                <label className="grid gap-1 text-xs font-black uppercase tracking-[.12em] text-ink/45">
                  Trukmė
                  <input value={selectedWorkoutPlan.duration} onChange={(event) => updateSelectedWorkoutPlan({ duration: event.target.value })} className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm font-bold normal-case tracking-normal text-ink outline-none focus:ring-4 focus:ring-lime/20" />
                </label>
                <label className="grid gap-1 text-xs font-black uppercase tracking-[.12em] text-ink/45">
                  Treneris
                  <input value={selectedWorkoutPlan.coach} onChange={(event) => updateSelectedWorkoutPlan({ coach: event.target.value })} className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm font-bold normal-case tracking-normal text-ink outline-none focus:ring-4 focus:ring-lime/20" />
                </label>
              </div>

              <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <label className="grid gap-1 text-xs font-black uppercase tracking-[.12em] text-ink/45">
                  Tikslas
                  <input value={selectedWorkoutPlan.goal} onChange={(event) => updateSelectedWorkoutPlan({ goal: event.target.value })} className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm font-bold normal-case tracking-normal text-ink outline-none focus:ring-4 focus:ring-lime/20" />
                </label>
                <label className="grid gap-1 text-xs font-black uppercase tracking-[.12em] text-ink/45">
                  Lygis
                  <select value={selectedWorkoutPlan.level} onChange={(event) => updateSelectedWorkoutPlan({ level: event.target.value })} className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm font-bold normal-case tracking-normal text-ink outline-none focus:ring-4 focus:ring-lime/20">
                    <option>Pradedantysis</option>
                    <option>Vidutinis</option>
                    <option>Pažengęs</option>
                    <option>Po pertraukos</option>
                    <option>Reabilitacinis / atsargus</option>
                  </select>
                </label>
                <label className="grid gap-1 text-xs font-black uppercase tracking-[.12em] text-ink/45">
                  Vieta
                  <select value={selectedWorkoutPlan.location} onChange={(event) => updateSelectedWorkoutPlan({ location: event.target.value })} className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm font-bold normal-case tracking-normal text-ink outline-none focus:ring-4 focus:ring-lime/20">
                    <option>Sporto salė</option>
                    <option>Namai</option>
                    <option>Laukas</option>
                    <option>Mišriai</option>
                  </select>
                </label>
                <label className="grid gap-1 text-xs font-black uppercase tracking-[.12em] text-ink/45">
                  Dažnumas / sav.
                  <input value={selectedWorkoutPlan.sessionsPerWeek} onChange={(event) => updateSelectedWorkoutPlan({ sessionsPerWeek: event.target.value })} className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm font-bold normal-case tracking-normal text-ink outline-none focus:ring-4 focus:ring-lime/20" />
                </label>
              </div>

              <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <label className="grid gap-1 text-xs font-black uppercase tracking-[.12em] text-ink/45">
                  Ūgis, cm
                  <input value={selectedWorkoutPlan.height} onChange={(event) => updateSelectedWorkoutPlan({ height: event.target.value })} className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm font-bold normal-case tracking-normal text-ink outline-none focus:ring-4 focus:ring-lime/20" />
                </label>
                <label className="grid gap-1 text-xs font-black uppercase tracking-[.12em] text-ink/45">
                  Svoris, kg
                  <input value={selectedWorkoutPlan.weight} onChange={(event) => updateSelectedWorkoutPlan({ weight: event.target.value })} className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm font-bold normal-case tracking-normal text-ink outline-none focus:ring-4 focus:ring-lime/20" />
                </label>
                <label className="grid gap-1 text-xs font-black uppercase tracking-[.12em] text-ink/45">
                  Įranga
                  <input value={selectedWorkoutPlan.equipment} onChange={(event) => updateSelectedWorkoutPlan({ equipment: event.target.value })} className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm font-bold normal-case tracking-normal text-ink outline-none focus:ring-4 focus:ring-lime/20" />
                </label>
                <label className="grid gap-1 text-xs font-black uppercase tracking-[.12em] text-ink/45">
                  Peržiūra
                  <input value={selectedWorkoutPlan.reviewDate} onChange={(event) => updateSelectedWorkoutPlan({ reviewDate: event.target.value })} className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm font-bold normal-case tracking-normal text-ink outline-none focus:ring-4 focus:ring-lime/20" />
                </label>
              </div>

              <div className="mt-4 grid gap-3 lg:grid-cols-2">
                <label className="grid gap-1 text-xs font-black uppercase tracking-[.12em] text-ink/45">
                  Progresijos modelis
                  <textarea value={selectedWorkoutPlan.progressionModel} onChange={(event) => updateSelectedWorkoutPlan({ progressionModel: event.target.value })} className="min-h-24 rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm font-bold normal-case tracking-normal text-ink outline-none focus:ring-4 focus:ring-lime/20" />
                </label>
                <label className="grid gap-1 text-xs font-black uppercase tracking-[.12em] text-ink/45">
                  Deload / krūvio mažinimo taisyklė
                  <textarea value={selectedWorkoutPlan.deload} onChange={(event) => updateSelectedWorkoutPlan({ deload: event.target.value })} className="min-h-24 rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm font-bold normal-case tracking-normal text-ink outline-none focus:ring-4 focus:ring-lime/20" />
                </label>
                <label className="grid gap-1 text-xs font-black uppercase tracking-[.12em] text-ink/45">
                  Bendras apšilimas
                  <textarea value={selectedWorkoutPlan.warmup} onChange={(event) => updateSelectedWorkoutPlan({ warmup: event.target.value })} className="min-h-24 rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm font-bold normal-case tracking-normal text-ink outline-none focus:ring-4 focus:ring-lime/20" />
                </label>
                <label className="grid gap-1 text-xs font-black uppercase tracking-[.12em] text-ink/45">
                  Kliento instrukcijos
                  <textarea value={selectedWorkoutPlan.clientInstructions} onChange={(event) => updateSelectedWorkoutPlan({ clientInstructions: event.target.value })} className="min-h-24 rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm font-bold normal-case tracking-normal text-ink outline-none focus:ring-4 focus:ring-lime/20" />
                </label>
              </div>

              <label className="mt-3 grid gap-1 text-xs font-black uppercase tracking-[.12em] text-ink/45">
                Sveikatos apribojimai / saugumo pastabos
                <textarea value={selectedWorkoutPlan.alerts} onChange={(event) => updateSelectedWorkoutPlan({ alerts: event.target.value })} className="min-h-20 rounded-2xl border border-rose-200 bg-white px-4 py-3 text-sm font-bold normal-case tracking-normal text-ink outline-none focus:ring-4 focus:ring-rose-100" />
              </label>

              <div className="mt-5 grid gap-4">
                {selectedWorkoutPlan.days.map((day, dayIndex) => (
                  <article key={`${day.title}-${dayIndex}`} className="overflow-hidden rounded-[1.4rem] border border-ink/10 bg-white">
                    <div className="border-b border-ink/10 bg-paper p-4">
                      <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
                        <div className="grid flex-1 gap-3 md:grid-cols-[1.4fr_.8fr_.8fr]">
                          <label className="grid gap-1 text-xs font-black uppercase tracking-[.12em] text-ink/45">
                            Dienos pavadinimas
                            <input value={day.title} onChange={(event) => updateWorkoutDay(dayIndex, { title: event.target.value })} className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm font-black normal-case tracking-normal text-ink outline-none focus:ring-4 focus:ring-lime/20" />
                          </label>
                          <label className="grid gap-1 text-xs font-black uppercase tracking-[.12em] text-ink/45">
                            Fokusas
                            <input value={day.focus} onChange={(event) => updateWorkoutDay(dayIndex, { focus: event.target.value })} className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm font-bold normal-case tracking-normal text-ink outline-none focus:ring-4 focus:ring-lime/20" />
                          </label>
                          <label className="grid gap-1 text-xs font-black uppercase tracking-[.12em] text-ink/45">
                            Prioritetas
                            <input value={day.priority} onChange={(event) => updateWorkoutDay(dayIndex, { priority: event.target.value })} className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm font-bold normal-case tracking-normal text-ink outline-none focus:ring-4 focus:ring-lime/20" />
                          </label>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <button type="button" onClick={() => moveWorkoutDay(dayIndex, -1)} className="rounded-full bg-white px-3 py-2 text-xs font-black text-ink shadow-soft">↑</button>
                          <button type="button" onClick={() => moveWorkoutDay(dayIndex, 1)} className="rounded-full bg-white px-3 py-2 text-xs font-black text-ink shadow-soft">↓</button>
                          <button type="button" onClick={() => duplicateWorkoutDay(dayIndex)} className="rounded-full bg-white px-4 py-2 text-xs font-black text-ink shadow-soft">Kopijuoti</button>
                          <button type="button" onClick={() => addWorkoutExercise(dayIndex)} className="rounded-full bg-lime/40 px-4 py-2 text-xs font-black text-forest">+ Pratimas</button>
                          <button type="button" onClick={() => removeWorkoutDay(dayIndex)} className="rounded-full bg-rose-100 px-4 py-2 text-xs font-black text-rose-700">Šalinti</button>
                        </div>
                      </div>

                      <div className="mt-3 grid gap-3 lg:grid-cols-3">
                        <label className="grid gap-1 text-xs font-black uppercase tracking-[.12em] text-ink/45">
                          Dienos apšilimas
                          <textarea value={day.warmup} onChange={(event) => updateWorkoutDay(dayIndex, { warmup: event.target.value })} className="min-h-20 rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm font-bold normal-case tracking-normal text-ink outline-none focus:ring-4 focus:ring-lime/20" />
                        </label>
                        <label className="grid gap-1 text-xs font-black uppercase tracking-[.12em] text-ink/45">
                          Pabaiga / cooldown
                          <textarea value={day.cooldown} onChange={(event) => updateWorkoutDay(dayIndex, { cooldown: event.target.value })} className="min-h-20 rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm font-bold normal-case tracking-normal text-ink outline-none focus:ring-4 focus:ring-lime/20" />
                        </label>
                        <label className="grid gap-1 text-xs font-black uppercase tracking-[.12em] text-ink/45">
                          Dienos pastabos
                          <textarea value={day.notes} onChange={(event) => updateWorkoutDay(dayIndex, { notes: event.target.value })} className="min-h-20 rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm font-bold normal-case tracking-normal text-ink outline-none focus:ring-4 focus:ring-lime/20" />
                        </label>
                      </div>
                    </div>

                    <div className="grid gap-3 p-3">
                      {day.exercises.map((exercise, exerciseIndex) => (
                        <article key={`${exercise.id}-${exerciseIndex}`} className="rounded-[1.15rem] border border-ink/10 bg-white p-2.5 shadow-soft">
                          <div className="mb-2 flex flex-col gap-2 border-b border-ink/10 pb-2 xl:flex-row xl:items-center xl:justify-between">
                            <div className="grid flex-1 gap-2 md:grid-cols-[64px_135px_135px_1fr]">
                              <label className="grid gap-1 text-[10px] font-black uppercase tracking-[.12em] text-ink/40">
                                #
                                <input value={exercise.id} onChange={(event) => updateWorkoutExercise(dayIndex, exerciseIndex, { id: event.target.value })} className="rounded-xl border border-ink/10 px-2.5 py-2 text-sm font-black text-ink" />
                              </label>

                              <label className="grid gap-1 text-[10px] font-black uppercase tracking-[.12em] text-ink/40">
                                Judesys
                                <select value={exercise.movement} onChange={(event) => updateWorkoutExercise(dayIndex, exerciseIndex, { movement: event.target.value })} className="rounded-xl border border-ink/10 px-2.5 py-2 text-sm font-bold text-ink">
                                  <option>Stūmimas</option>
                                  <option>Trauka</option>
                                  <option>Keliai</option>
                                  <option>Klubai</option>
                                  <option>Vienos kojos</option>
                                  <option>Core</option>
                                  <option>Nešimas</option>
                                  <option>Izoliacija</option>
                                  <option>Mobilumas</option>
                                  <option>Kondicija</option>
                                </select>
                              </label>

                              <label className="grid gap-1 text-[10px] font-black uppercase tracking-[.12em] text-ink/40">
                                Raumenys
                                <input value={exercise.muscleGroup} onChange={(event) => updateWorkoutExercise(dayIndex, exerciseIndex, { muscleGroup: event.target.value })} className="rounded-xl border border-ink/10 px-2.5 py-2 text-sm font-bold text-ink" />
                              </label>

                              <label className="grid gap-1 text-[10px] font-black uppercase tracking-[.12em] text-ink/40">
                                Pratimas
                                <input value={exercise.name} onChange={(event) => updateWorkoutExercise(dayIndex, exerciseIndex, { name: event.target.value })} className="rounded-xl border border-ink/10 px-2.5 py-2 text-sm font-black text-ink" />
                              </label>
                            </div>

                            <div className="flex flex-wrap gap-2 xl:flex-nowrap">
                              <button type="button" onClick={() => moveWorkoutExercise(dayIndex, exerciseIndex, -1)} className="rounded-full bg-white px-3 py-2 text-xs font-black text-ink shadow-soft">↑</button>
                              <button type="button" onClick={() => moveWorkoutExercise(dayIndex, exerciseIndex, 1)} className="rounded-full bg-white px-3 py-2 text-xs font-black text-ink shadow-soft">↓</button>
                              <button type="button" onClick={() => duplicateWorkoutExercise(dayIndex, exerciseIndex)} className="rounded-full bg-lime/30 px-4 py-2 text-xs font-black text-forest">Kopijuoti</button>
                              <button type="button" onClick={() => removeWorkoutExercise(dayIndex, exerciseIndex)} className="rounded-full bg-rose-50 px-4 py-2 text-xs font-black text-rose-700">Šalinti</button>
                            </div>
                          </div>

                          <div className="grid gap-2 xl:grid-cols-[1fr_1fr]">
                            <div className="grid gap-3">
                              <label className="grid gap-1 text-[10px] font-black uppercase tracking-[.12em] text-ink/40">
                                Technikos pastabos
                                <textarea value={exercise.meta} onChange={(event) => updateWorkoutExercise(dayIndex, exerciseIndex, { meta: event.target.value })} className="min-h-20 rounded-xl border border-ink/10 px-2.5 py-2 text-sm font-bold leading-5 text-ink/70" />
                              </label>

                              <div className="grid gap-3 md:grid-cols-2">
                                <label className="grid gap-1 text-[10px] font-black uppercase tracking-[.12em] text-ink/40">
                                  Progresija
                                  <textarea value={exercise.progression} onChange={(event) => updateWorkoutExercise(dayIndex, exerciseIndex, { progression: event.target.value })} className="min-h-20 rounded-xl border border-ink/10 px-2.5 py-2 text-xs font-bold leading-5 text-ink/70" />
                                </label>

                                <label className="grid gap-1 text-[10px] font-black uppercase tracking-[.12em] text-ink/40">
                                  Alternatyvos
                                  <textarea value={exercise.alternatives} onChange={(event) => updateWorkoutExercise(dayIndex, exerciseIndex, { alternatives: event.target.value })} className="min-h-20 rounded-xl border border-ink/10 px-2.5 py-2 text-xs font-bold leading-5 text-ink/70" />
                                </label>
                              </div>
                            </div>

                            <div className="grid gap-3">
                              <div className="grid gap-2 sm:grid-cols-3 xl:grid-cols-6">
                                <label className="grid gap-1 text-[10px] font-black uppercase tracking-[.12em] text-ink/40">
                                  Serijos
                                  <input value={exercise.sets} onChange={(event) => updateWorkoutExercise(dayIndex, exerciseIndex, { sets: event.target.value, setsReps: `${event.target.value} x ${exercise.reps}` })} className="rounded-xl border border-ink/10 px-2.5 py-2 text-sm font-black text-ink" />
                                </label>

                                <label className="grid gap-1 text-[10px] font-black uppercase tracking-[.12em] text-ink/40">
                                  Pakart.
                                  <input value={exercise.reps} onChange={(event) => updateWorkoutExercise(dayIndex, exerciseIndex, { reps: event.target.value, setsReps: `${exercise.sets} x ${event.target.value}` })} className="rounded-xl border border-ink/10 px-2.5 py-2 text-sm font-black text-ink" />
                                </label>

                                <label className="grid gap-1 text-[10px] font-black uppercase tracking-[.12em] text-ink/40">
                                  Krūvis
                                  <input value={exercise.load} onChange={(event) => updateWorkoutExercise(dayIndex, exerciseIndex, { load: event.target.value })} placeholder="kg / %" className="rounded-xl border border-ink/10 px-2.5 py-2 text-sm font-bold text-ink" />
                                </label>

                                <label className="grid gap-1 text-[10px] font-black uppercase tracking-[.12em] text-ink/40">
                                  RPE/RIR
                                  <input value={exercise.rpe} onChange={(event) => updateWorkoutExercise(dayIndex, exerciseIndex, { rpe: event.target.value })} className="rounded-xl border border-ink/10 px-2.5 py-2 text-sm font-bold text-ink" />
                                </label>

                                <label className="grid gap-1 text-[10px] font-black uppercase tracking-[.12em] text-ink/40">
                                  Poilsis
                                  <input value={exercise.rest} onChange={(event) => updateWorkoutExercise(dayIndex, exerciseIndex, { rest: event.target.value })} className="rounded-xl border border-ink/10 px-2.5 py-2 text-sm font-bold text-ink" />
                                </label>

                                <label className="grid gap-1 text-[10px] font-black uppercase tracking-[.12em] text-ink/40">
                                  Tempas
                                  <input value={exercise.tempo} onChange={(event) => updateWorkoutExercise(dayIndex, exerciseIndex, { tempo: event.target.value })} className="rounded-xl border border-ink/10 px-2.5 py-2 text-sm font-bold text-ink" />
                                </label>
                              </div>

                              <div className="grid gap-3 md:grid-cols-2">
                                <label className="grid gap-1 text-[10px] font-black uppercase tracking-[.12em] text-ink/40">
                                  Video / demonstracija
                                  <input value={exercise.videoUrl} onChange={(event) => updateWorkoutExercise(dayIndex, exerciseIndex, { videoUrl: event.target.value })} placeholder="Nuoroda arba trumpa pastaba" className="rounded-xl border border-ink/10 px-2.5 py-2 text-xs font-bold text-ink/70" />
                                </label>

                                <label className="grid gap-1 text-[10px] font-black uppercase tracking-[.12em] text-rose-500">
                                  Saugumo apribojimai
                                  <textarea value={exercise.contraindications} onChange={(event) => updateWorkoutExercise(dayIndex, exerciseIndex, { contraindications: event.target.value })} className="min-h-16 rounded-xl border border-rose-100 px-2.5 py-2 text-xs font-bold leading-5 text-rose-700" />
                                </label>
                              </div>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>

                  </article>
                ))}
              </div>
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
