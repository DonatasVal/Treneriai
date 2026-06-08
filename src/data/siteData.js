export const BUSINESS = {
  trainerName: "Vardenis Pavardenis",
  brand: "Vardenis Pavardenis",
  subtitle: "Individualus sporto treneris",
  phone: "+370 600 00000",
  email: "info@vardenistreneris.lt",
  address: "Vilnius / sporto salė pagal susitarimą",
  hours: "I–V 07:00–20:00 · VI 09:00–14:00",
};

export const heroTrustPoints = [
  "Individualus planas",
  "Saugus krūvis",
  "Reguliarus progresas",
];

export const services = [
  {
    id: "personal",
    title: "Individuali treniruotė",
    price: "35 €",
    duration: "60 min.",
    note: "Asmeninis darbas 1:1",
    bookingMode: "slot",
    actionLabel: "Rezervuoti laiką",
    bestFor: "Pirmai treniruotei, technikai ir aiškiam startui",
    description:
      "Treniruotė su Vardeniu pagal tavo tikslą, fizinį pasirengimą ir dienos savijautą. Aiškus krūvis ir taisyklinga technika.",
  },
  {
    id: "membership",
    title: "Treniruočių abonementas",
    price: "nuo 120 €",
    duration: "mėn.",
    note: "Reguliarus sportavimas",
    bookingMode: "inquiry",
    actionLabel: "Gauti pasiūlymą",
    bestFor: "Norint sportuoti 2–4 kartus per savaitę",
    description:
      "Pasirinkimas norint sportuoti reguliariai. Treneris susisiekia, suderina grafiką, dažnumą ir tinkamiausią abonemento formatą.",
  },
  {
    id: "program",
    title: "Treniruočių planas",
    price: "89 €",
    duration: "4 savaitės",
    note: "Sporto salei arba namams",
    bookingMode: "inquiry",
    actionLabel: "Užpildyti anketą",
    bestFor: "Savarankiškai sportuojantiems pagal struktūrą",
    description:
      "Individualiai parengtas 4 savaičių planas su pratimų struktūra, krūvio progresavimu ir aiškiu savaitės ritmu.",
  },
  {
    id: "online",
    title: "Nuotolinė priežiūra",
    price: "129 €",
    duration: "mėn.",
    note: "Plano korekcijos ir palaikymas",
    bookingMode: "inquiry",
    actionLabel: "Aptarti galimybes",
    bestFor: "Kai reikia kontrolės ir korekcijų nuotoliu",
    description:
      "Nuotolinis progreso sekimas, savaitinės plano korekcijos ir aiškus grįžtamasis ryšys dėl treniruočių.",
  },
  {
    id: "nutrition",
    title: "Mitybos konsultacija",
    price: "45 €",
    duration: "45 min.",
    note: "Praktiškai ir be kraštutinumų",
    bookingMode: "consultation",
    actionLabel: "Pateikti užklausą",
    bestFor: "Mitybos krypties susidėliojimui be griežtų dietų",
    description:
      "Paprastos ir realiai pritaikomos mitybos rekomendacijos pagal tavo ritmą, tikslą ir kasdienybę.",
  },
];

export const reviews = [
  {
    name: "Mantas",
    role: "klientas, 8 savaitės",
    quote: "Pirmą kartą sporte turėjau aiškų planą, o ne atsitiktinius pratimus. Pagaliau matau progresą.",
  },
  {
    name: "Aistė",
    role: "klientė, laikysenos tikslas",
    quote: "Treniruotės nebuvo lengvos, bet buvo labai aiškios. Patiko, kad viskas pritaikyta mano lygiui.",
  },
  {
    name: "Rokas",
    role: "klientas, jėgos programa",
    quote: "Nebereikia derinti laikų per penkias žinutes. Užsiregistruoju internetu ir matau, kada laisva.",
  },
];

export const bookingSlots = {
  // Individuali treniruotė trunka 60 min. Paliekamas tarpas pasiruošimui ir klientų pasikeitimui.
  // Todėl laikai nesidubliuoja kas 30 min. ir nėra situacijos, kai vienas klientas ateina 12:00, o kitas 12:30.
  "2026-06-08": ["06:30", "08:00", "09:30", "11:00", "12:30", "16:30", "18:00", "19:30"],
  "2026-06-09": ["06:30", "08:00", "09:30", "11:00", "12:30", "16:30", "18:00", "19:30"],
  "2026-06-10": ["07:00", "08:30", "10:00", "11:30", "13:00", "16:00", "17:30", "19:00"],
  "2026-06-11": ["06:30", "08:00", "09:30", "11:00", "12:30", "16:30", "18:00", "19:30"],
  "2026-06-12": ["07:00", "08:30", "10:00", "11:30", "13:00", "16:00", "17:30", "19:00"],
  "2026-06-13": ["09:00", "10:30", "12:00", "13:30"],
  "2026-06-14": ["10:00", "11:30"],

  "2026-06-15": ["06:30", "08:00", "09:30", "11:00", "12:30", "16:30", "18:00", "19:30"],
  "2026-06-16": ["06:30", "08:00", "09:30", "11:00", "12:30", "16:30", "18:00", "19:30"],
  "2026-06-17": ["07:00", "08:30", "10:00", "11:30", "13:00", "16:00", "17:30", "19:00"],
  "2026-06-18": ["06:30", "08:00", "09:30", "11:00", "12:30", "16:30", "18:00", "19:30"],
  "2026-06-19": ["07:00", "08:30", "10:00", "11:30", "13:00", "16:00", "17:30", "19:00"],
  "2026-06-20": ["09:00", "10:30", "12:00", "13:30"],
  "2026-06-21": ["10:00", "11:30"],

  "2026-06-22": ["06:30", "08:00", "09:30", "11:00", "12:30", "16:30", "18:00", "19:30"],
  "2026-06-23": ["06:30", "08:00", "09:30", "11:00", "12:30", "16:30", "18:00", "19:30"],
  "2026-06-24": ["07:00", "08:30", "10:00", "11:30", "13:00", "16:00", "17:30", "19:00"],
  "2026-06-25": ["06:30", "08:00", "09:30", "11:00", "12:30", "16:30", "18:00", "19:30"],
  "2026-06-26": ["07:00", "08:30", "10:00", "11:30", "13:00", "16:00", "17:30", "19:00"],
  "2026-06-27": ["09:00", "10:30", "12:00", "13:30"],
  "2026-06-28": ["10:00", "11:30"],
};

export const initialAdminSessions = [
  {
    id: 1,
    client: "Mantas Kazlauskas",
    phone: "+370 600 11223",
    service: "Individuali treniruotė",
    date: "2026-06-08",
    time: "07:00",
    goal: "Noriu sustiprėti ir pagerinti laikyseną.",
    status: "Nauja",
  },
  {
    id: 2,
    client: "Aistė Petrauskaitė",
    phone: "+370 611 22334",
    service: "Treniruočių planas",
    date: "2026-06-08",
    time: "17:30",
    goal: "Tikslas – svorio mažinimas ir aiškus planas namuose.",
    status: "Patvirtinta",
  },
  {
    id: 3,
    client: "Rokas",
    phone: "+370 622 33445",
    service: "Nuotolinė priežiūra",
    date: "2026-06-09",
    time: "18:00",
    goal: "Noriu sportuoti 3 kartus per savaitę.",
    status: "Laukia patvirtinimo",
  },
];

export const initialBlockedTimes = [
  { id: 1, date: "2026-06-08", time: "12:00", reason: "Asmeninis užimtumas" },
];

export const statuses = [
  "Visos būsenos",
  "Nauja",
  "Laukia patvirtinimo",
  "Patvirtinta",
  "Įvykdyta",
  "Atšaukta",
  "Neatvyko",
];

export const statusStyles = {
  Nauja: "bg-blue-100 text-blue-700",
  "Laukia patvirtinimo": "bg-amber-100 text-amber-700",
  Patvirtinta: "bg-green-100 text-green-700",
  Įvykdyta: "bg-ink/5 text-ink/60",
  Atšaukta: "bg-rose-100 text-rose-700",
  Neatvyko: "bg-ink/5 text-ink/60",
};

export const timeSlots = [
  "06:30", "07:00", "07:30", "08:00", "08:30", "09:00",
  "10:00", "11:00", "12:00", "13:00", "14:00", "15:00",
  "16:00", "17:00", "17:30", "18:00", "18:30", "19:00",
  "19:30", "20:00",
];


export const initialClientPlans = [
  {
    id: 1,
    client: "Mantas Kazlauskas",
    phone: "+370 600 11223",
    packageName: "Treniruočių abonementas",
    startDate: "2026-06-08",
    goal: "Jėga ir laikysena",
    sessions: [
      { id: 101, day: "Pirmadienis", time: "18:00", focus: "Viršutinė kūno dalis", place: "Sporto salė" },
      { id: 102, day: "Trečiadienis", time: "18:00", focus: "Kojos ir core", place: "Sporto salė" },
      { id: 103, day: "Penktadienis", time: "17:30", focus: "Viso kūno treniruotė", place: "Sporto salė" },
    ],
    note: "Pradėti nuo vidutinio intensyvumo. Peržiūra po 2 savaičių.",
  },
];

export const trainerProfile = {
  name: "Vardenis Pavardenis",
  role: "Individualus sporto treneris",
  experience: "7+ metų darbo patirtis",
  focus: "jėga, laikysena, svorio mažinimas ir ilgalaikis sportavimo įprotis",
  bio:
    "Padedu žmonėms sportuoti saugiai, nuosekliai ir aiškiai. Mano tikslas – ne tik pravesti treniruotę, bet sukurti sistemą, kurios žmogus gali laikytis ilgą laiką.",
  principles: [
    "Aiški pradžios diagnostika ir realus tikslas",
    "Saugus krūvio didinimas be chaotiškų treniruočių",
    "Planavimas pagal žmogaus grafiką, patirtį ir savijautą",
    "Reguliarus progreso sekimas ir plano korekcijos",
  ],
  credentials: [
    "Individualių treniruočių metodika",
    "Jėgos treniruočių programavimas",
    "Laikysenos ir judesio kontrolė",
    "Praktinė mitybos konsultavimo bazė",
  ],
};

export const processSteps = [
  {
    number: "01",
    title: "Užklausa arba registracija",
    text: "Klientas pasirenka tinkamą paslaugą: konkrečią treniruotę, abonementą, treniruočių planą ar nuotolinę priežiūrą.",
  },
  {
    number: "02",
    title: "Tikslas ir starto įvertinimas",
    text: "Aptariama patirtis, savijauta, tikslas, galimi apribojimai ir laikas, kurį klientas realiai gali skirti sportui.",
  },
  {
    number: "03",
    title: "Grafikas arba planas",
    text: "Treneris sudaro aiškų treniruočių ritmą, grafiką arba planą ir pasidalina juo su klientu.",
  },
  {
    number: "04",
    title: "Korekcijos ir progresas",
    text: "Progresas stebimas, krūvis koreguojamas, o treniruotės pritaikomos pagal realų rezultatą.",
  },
];

export const resultStories = [
  {
    goal: "Laikysena ir jėga",
    period: "8 savaitės",
    result: "Stabilesnė laikysena, mažiau įtampos nugaroje ir aiškus treniruočių ritmas.",
  },
  {
    goal: "Svorio mažinimas",
    period: "12 savaičių",
    result: "Reguliarus sportavimas 3 kartus per savaitę ir geresnis energijos lygis.",
  },
  {
    goal: "Grįžimas į sportą",
    period: "6 savaitės",
    result: "Saugus krūvio didinimas ir aiškesnė pratimų technika.",
  },
];
