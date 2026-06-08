import { AnimatePresence, motion } from "framer-motion";
import { services } from "../../data/siteData.js";
import { X } from "lucide-react";
import { useBooking } from "../../context/BookingContext.jsx";
import { useBookingForm } from "../../hooks/useBookingForm.js";
import Calendar from "./Calendar.jsx";

const inquiryBenefits = {
  membership: [
    "Treneris suderina tinkamiausią treniruočių dažnumą.",
    "Grafikas derinamas individualiai, todėl nereikia rinktis vieno atsitiktinio laiko.",
    "Tinka norint sportuoti reguliariai kelis kartus per savaitę.",
  ],
  program: [
    "Laiko rezervuoti nereikia — pirmiausia surenkama informacija plano parengimui.",
    "Treneris susisiekia ir patikslina tikslą, patirtį bei treniruočių sąlygas.",
    "Tinka sportuojantiems namuose arba sporto salėje savarankiškai.",
  ],
  online: [
    "Suderinamas nuotolinės priežiūros formatas ir komunikacijos ritmas.",
    "Treneris patikslina tavo tikslą, turimą įrangą ir sportavimo dažnumą.",
    "Tinka, kai reikia plano korekcijų ir palaikymo be gyvų treniruočių.",
  ],
  nutrition: [
    "Pirmiausia surenkama informacija apie tavo ritmą, tikslą ir įpročius.",
    "Konsultacijos laiką treneris suderina susisiekęs pasirinktu būdu.",
    "Tinka norint praktiškų rekomendacijų be griežtų dietų.",
  ],
};

export default function BookingModal() {
  const { isBookingOpen, closeBooking, selectedService, setSelectedService } = useBooking();
  const service = selectedService || services[0];
  const form = useBookingForm(service);

  if (!isBookingOpen) return null;

  const requiresTime = form.requiresTime;
  const benefits = inquiryBenefits[service?.id] || inquiryBenefits.program;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[120] grid place-items-center bg-ink/58 p-5 backdrop-blur-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onMouseDown={closeBooking}
      >
        <motion.div
          role="dialog"
          aria-modal="true"
          className="max-h-[92vh] w-[min(1050px,100%)] overflow-auto rounded-[2.2rem] border border-white/60 bg-paper shadow-glass"
          initial={{ opacity: 0, y: 24, scale: .98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 14, scale: .98 }}
          transition={{ duration: .26 }}
          onMouseDown={(event) => event.stopPropagation()}
        >
          <div className="sticky top-0 z-10 flex items-center justify-between gap-5 border-b border-ink/10 bg-paper/80 p-6 backdrop-blur-xl">
            <div>
              <h2 className="font-display text-3xl font-extrabold tracking-[-.06em] text-ink">
                {requiresTime ? "Registracija treniruotei" : "Užklausa dėl paslaugos"}
              </h2>
              <p className="mt-1 text-sm text-ink/55">
                {requiresTime
                  ? "Pasirink paslaugą, datą, pageidaujamą laiką ir parašyk tikslą."
                  : "Pasirink paslaugą, palik kontaktus ir trumpai aprašyk savo tikslą."}
              </p>
            </div>
            <button type="button" onClick={closeBooking} className="grid h-11 w-11 place-items-center rounded-full bg-ink/5 text-ink">
              <X size={20} />
            </button>
          </div>

          <div className="grid gap-5 p-6 lg:grid-cols-[.9fr_1.1fr]">
            <div className="rounded-[1.8rem] border border-ink/10 bg-white/72 p-5">
              <h3 className="mb-4 font-display text-xl font-extrabold tracking-[-.05em]">1. Paslauga</h3>
              <div className="grid gap-2">
                {services.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedService(item)}
                    className={`rounded-[1.25rem] border p-4 text-left transition ${
                      service?.id === item.id
                        ? "border-lime bg-lime/25"
                        : "border-ink/10 bg-white hover:border-ink/20"
                    }`}
                  >
                    <strong className="block text-ink">{item.title}</strong>
                    <span className="mt-1 block text-sm text-ink/55">{item.price} · {item.duration} · {item.note}</span>
                  </button>
                ))}
              </div>

              {requiresTime ? (
                <>
                  <h3 className="mb-4 mt-6 font-display text-xl font-extrabold tracking-[-.05em]">2. Data</h3>
                  <Calendar selectedDate={form.selectedDate} onSelectDate={form.chooseDate} />
                </>
              ) : (
                <div className="mt-6 rounded-[1.5rem] border border-lime/40 bg-lime/10 p-5">
                  <h3 className="font-display text-xl font-extrabold tracking-[-.05em] text-ink">
                    2. Laikas nederinamas šiame žingsnyje
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-ink/58">
                    Šiai paslaugai svarbiau suderinti formatą, tikslą ir pradžios laikotarpį. Treneris susisieks ir pasiūlys tinkamiausią eigą.
                  </p>

                  <ul className="mt-4 grid gap-2 text-sm leading-6 text-ink/65">
                    {benefits.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-lime" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="rounded-[1.8rem] border border-ink/10 bg-white/72 p-5">
              {requiresTime ? (
                <>
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <h3 className="font-display text-xl font-extrabold tracking-[-.05em]">3. Pageidaujamas laikas</h3>
                      <p className="mt-1 text-sm text-ink/50">
                        Rodomi tik tokie laikai, tarp kurių paliktas tarpas 60 min. treniruotei ir pasiruošimui. Laikai nesidubliuoja kas 30 min.
                      </p>
                    </div>
                    <span className="rounded-full bg-lime/20 px-3 py-1 text-xs font-black text-forest">
                      {form.times.length} laikų
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                    {form.times.map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => form.setSelectedTime(time)}
                        className={`rounded-2xl border px-3 py-3 text-sm font-black transition ${
                          form.selectedTime === time
                            ? "border-forest bg-forest text-white shadow-soft"
                            : "border-ink/10 bg-white text-ink hover:border-lime hover:bg-lime/10"
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>

                  {!form.times.length && (
                    <div className="mt-4 rounded-[1.25rem] border border-amber-200 bg-amber-50 p-4 text-sm font-bold text-amber-800">
                      Šiai dienai laisvų laikų nėra. Pasirink kitą datą kalendoriuje.
                    </div>
                  )}
                </>
              ) : (
                <div>
                  <h3 className="font-display text-xl font-extrabold tracking-[-.05em]">3. Užklausos informacija</h3>
                  <p className="mt-1 text-sm text-ink/50">
                    Užpildyk kontaktus ir pasirink, kada norėtum pradėti. Konkrečius laikus treneris suderins asmeniškai.
                  </p>

                  <div className="mt-4 rounded-[1.25rem] border border-ink/10 bg-white p-4">
                    <div className="text-[11px] font-black uppercase tracking-[.16em] text-ink/42">Pasirinkta paslauga</div>
                    <div className="mt-2 font-display text-2xl font-extrabold tracking-[-.06em] text-ink">{service?.title}</div>
                    <div className="mt-1 text-sm font-bold text-ink/55">{service?.price} · {service?.duration}</div>
                  </div>
                </div>
              )}

              <form onSubmit={form.submit} className="mt-5 grid gap-3 sm:grid-cols-2">
                {!requiresTime && (
                  <>
                    <select
                      value={form.startPreference}
                      onChange={(e) => form.setStartPreference(e.target.value)}
                      className="rounded-[1.1rem] border border-ink/10 bg-white px-4 py-3 outline-none transition focus:border-lime focus:ring-4 focus:ring-lime/20"
                    >
                      <option>Kuo greičiau</option>
                      <option>Kitą savaitę</option>
                      <option>Šį mėnesį</option>
                      <option>Dar tik domiuosi</option>
                    </select>

                    <select
                      value={form.frequency}
                      onChange={(e) => form.setFrequency(e.target.value)}
                      className="rounded-[1.1rem] border border-ink/10 bg-white px-4 py-3 outline-none transition focus:border-lime focus:ring-4 focus:ring-lime/20"
                    >
                      <option>1–2 kartus per savaitę</option>
                      <option>3 kartus per savaitę</option>
                      <option>4+ kartus per savaitę</option>
                      <option>Dar nežinau</option>
                    </select>
                  </>
                )}

                <input value={form.name} onChange={(e) => form.setName(e.target.value)} placeholder="Vardas ir pavardė *" className="rounded-[1.1rem] border border-ink/10 bg-white px-4 py-3 outline-none transition focus:border-lime focus:ring-4 focus:ring-lime/20" />
                <input value={form.phone} onChange={(e) => form.setPhone(e.target.value)} placeholder="Telefono numeris *" className="rounded-[1.1rem] border border-ink/10 bg-white px-4 py-3 outline-none transition focus:border-lime focus:ring-4 focus:ring-lime/20" />
                <select value={form.contact} onChange={(e) => form.setContact(e.target.value)} className="rounded-[1.1rem] border border-ink/10 bg-white px-4 py-3 outline-none transition focus:border-lime focus:ring-4 focus:ring-lime/20">
                  <option>Telefonu</option>
                  <option>SMS žinute</option>
                  <option>El. paštu</option>
                  <option>Instagram / Messenger</option>
                </select>
                <input placeholder="El. paštas / Instagram" className="rounded-[1.1rem] border border-ink/10 bg-white px-4 py-3 outline-none transition focus:border-lime focus:ring-4 focus:ring-lime/20" />
                <textarea
                  value={form.goal}
                  onChange={(e) => form.setGoal(e.target.value)}
                  placeholder={
                    requiresTime
                      ? "Tikslas: jėga, svorio mažinimas, laikysena, energija, pasiruošimas varžyboms ar kita."
                      : "Trumpai aprašyk tikslą, patirtį, sportavimo dažnumą ir kokios pagalbos tikiesi."
                  }
                  className="min-h-32 rounded-[1.1rem] border border-ink/10 bg-white px-4 py-3 outline-none transition focus:border-lime focus:ring-4 focus:ring-lime/20 sm:col-span-2"
                />

                <label className="flex gap-3 rounded-[1.25rem] border border-ink/10 bg-lime/10 p-4 text-sm leading-6 text-ink/62 sm:col-span-2">
                  <input type="checkbox" checked={form.accepted} onChange={(e) => form.setAccepted(e.target.checked)} className="mt-1 h-4 w-4 accent-lime" />
                  <span>Sutinku, kad mano pateikti duomenys būtų naudojami registracijos / užklausos administravimui. *</span>
                </label>

                <button
                  type="submit"
                  disabled={!form.accepted || !form.name || !form.phone}
                  className="rounded-full bg-forest px-6 py-4 text-sm font-black text-white shadow-soft transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 sm:col-span-2"
                >
                  {requiresTime ? "Patvirtinti registraciją" : "Pateikti užklausą"}
                </button>
              </form>

              {form.submitted && (
                <div className="mt-4 rounded-[1.25rem] border border-lime/50 bg-lime/20 p-4 font-bold leading-7 text-forest">
                  {requiresTime ? (
                    <>
                      Registracija gauta: {service?.title}, {form.selectedDate} {form.selectedTime}. Treneris susisieks su tavimi pasirinktu būdu: {form.contact}.
                    </>
                  ) : (
                    <>
                      Užklausa gauta: {service?.title}. Pageidaujama pradžia: {form.startPreference}. Dažnumas: {form.frequency}. Treneris susisieks su tavimi pasirinktu būdu: {form.contact}.
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
