import { motion } from "framer-motion";
import { services } from "../../data/siteData.js";
import { ArrowRight, CircleDot } from "lucide-react";
import { useBooking } from "../../context/BookingContext.jsx";
import { useSafeMotion } from "../../hooks/useMotion.js";

export default function Services() {
  const { openBooking } = useBooking();
  const { fadeUp } = useSafeMotion();

  return (
    <section id="paslaugos" className="bg-bone/60 py-24">
      <div className="mx-auto w-[min(1180px,calc(100%-42px))]">
        <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[.2em] text-moss/75">Paslaugos</p>
            <h2 className="mt-3 font-display text-[clamp(2.5rem,5vw,4.5rem)] font-extrabold leading-[.92] tracking-[-.075em] text-ink">
              Ne šiaip treniruotė — struktūra.
            </h2>
          </div>
          <p className="max-w-2xl text-lg leading-8 text-ink/62">
            Klientas pasirenka paslaugą, datą ir pageidaujamą laiką. Treneris admin panelėje mato registracijas, statusus ir savo savaitės užimtumą.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {services.map((service, index) => (
            <motion.article
              key={service.id}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: index * 0.04 }}
              className="card-shine group rounded-[2rem] border border-ink/10 bg-paper/82 p-6 shadow-soft transition hover:-translate-y-2 hover:border-lime/60 hover:bg-white hover:shadow-lift"
            >
              <div className="mb-6 grid h-14 w-14 place-items-center rounded-2xl border border-lime/40 bg-lime/20 text-forest transition group-hover:scale-105 group-hover:bg-lime">
                <CircleDot size={22} />
              </div>
              <h3 className="font-display text-2xl font-extrabold leading-none tracking-[-.055em] text-ink">
                {service.title}
              </h3>
              <p className="mt-4 text-sm leading-6 text-ink/60">{service.description}</p>
              <div className="mt-4 rounded-2xl bg-lime/10 p-3 text-xs font-extrabold leading-5 text-forest">
                Kam tinka: {service.bestFor}
              </div>
              <div className="mt-6 border-t border-ink/10 pt-5">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <div className="font-display text-3xl font-extrabold tracking-[-.06em] text-ink">{service.price}</div>
                    <div className="text-xs font-extrabold uppercase tracking-[.12em] text-ink/42">{service.duration}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => openBooking(service)}
                    className="inline-flex items-center gap-2 rounded-full bg-forest px-4 py-3 text-xs font-black text-white transition hover:bg-ink"
                    aria-label={`${service.actionLabel}: ${service.title}`}
                  >
                    {service.actionLabel}
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
