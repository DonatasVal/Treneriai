import { motion } from "framer-motion";
import { processSteps } from "../../data/siteData.js";
import { useSafeMotion } from "../../hooks/useMotion.js";

export default function Process() {
  const { fadeUp } = useSafeMotion();

  return (
    <section id="procesas" className="bg-forest py-24 text-white">
      <div className="mx-auto w-[min(1180px,calc(100%-42px))]">
        <div className="grid gap-8 lg:grid-cols-[.85fr_1.15fr] lg:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[.2em] text-lime">Procesas</p>
            <h2 className="mt-3 font-display text-[clamp(2.6rem,5vw,4.8rem)] font-extrabold leading-[.94] tracking-[-.075em]">
              Klientui aišku, kas vyksta po užklausos.
            </h2>
          </div>
          <p className="text-lg leading-8 text-white/62">
            Ši dalis sumažina neaiškumą: žmogus supranta, ar rezervuoja treniruotę, ar siunčia užklausą dėl plano, abonemento arba nuotolinės priežiūros.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {processSteps.map((step, index) => (
            <motion.article
              key={step.number}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: index * 0.04 }}
              className="rounded-[1.8rem] border border-white/10 bg-white/[.06] p-6"
            >
              <div className="font-display text-5xl font-extrabold tracking-[-.07em] text-lime">{step.number}</div>
              <h3 className="mt-5 font-display text-2xl font-extrabold tracking-[-.05em]">{step.title}</h3>
              <p className="mt-3 leading-7 text-white/62">{step.text}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
