import { motion } from "framer-motion";
import { useBooking } from "../../context/BookingContext.jsx";
import { useSafeMotion } from "../../hooks/useMotion.js";

const steps = [
  ["01", "Tikslas", "Išsiaiškinamas tavo tikslas, ribojimai, laikas ir dabartinis fizinis pasirengimas."],
  ["02", "Sistema", "Sudaromas ritmas: pratimai, krūvis, poilsis ir aiški progreso logika."],
  ["03", "Korekcija", "Treniruotės koreguojamos pagal realų rezultatą, o ne pagal bendrą šabloną."],
];

export default function Method() {
  const { openBooking } = useBooking();
  const { fadeUp } = useSafeMotion();

  return (
    <section id="metodas" className="bg-forest py-24 text-white">
      <div className="mx-auto grid w-[min(1180px,calc(100%-42px))] gap-12 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
        <motion.div {...fadeUp}>
          <p className="text-xs font-black uppercase tracking-[.2em] text-lime">Metodas</p>
          <h2 className="mt-3 font-display text-[clamp(2.6rem,5vw,4.8rem)] font-extrabold leading-[.94] tracking-[-.075em]">
            Progresas atsiranda tada, kai treniruotė turi kryptį.
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-8 text-white/62">
            Svetainės tonas sąmoningai ramus ir konkretus — kaip geras treneris: ne žada magiją, o sukuria sistemą, kurios lengva laikytis.
          </p>
          <button
            type="button"
            onClick={() => openBooking()}
            className="mt-8 rounded-full bg-lime px-7 py-4 text-sm font-black text-forest shadow-soft transition hover:-translate-y-1"
          >
            Pradėti nuo pirmos treniruotės
          </button>
        </motion.div>

        <div className="grid gap-4">
          {steps.map(([number, title, text], index) => (
            <motion.div
              key={number}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: index * 0.04 }}
              className="rounded-[1.8rem] border border-white/10 bg-white/[.06] p-6"
            >
              <div className="grid gap-4 sm:grid-cols-[80px_1fr]">
                <div className="font-display text-5xl font-extrabold tracking-[-.07em] text-lime">{number}</div>
                <div>
                  <h3 className="font-display text-2xl font-extrabold tracking-[-.05em]">{title}</h3>
                  <p className="mt-2 leading-7 text-white/62">{text}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
