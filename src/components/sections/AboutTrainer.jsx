import { motion } from "framer-motion";
import { Award, CheckCircle2, ShieldCheck, Target } from "lucide-react";
import { trainerProfile } from "../../data/siteData.js";
import { useSafeMotion } from "../../hooks/useMotion.js";

export default function AboutTrainer() {
  const { fadeUp } = useSafeMotion();

  return (
    <section id="apie" className="bg-paper py-24">
      <div className="mx-auto grid w-[min(1180px,calc(100%-42px))] gap-12 lg:grid-cols-[.92fr_1.08fr] lg:items-center">
        <motion.div {...fadeUp} className="relative overflow-hidden rounded-[2.4rem] border border-ink/10 bg-forest p-8 text-white shadow-lift">
          <div className="absolute inset-0 kinetic-grid opacity-25" />
          <div className="absolute right-[-80px] top-[-80px] h-64 w-64 rounded-full bg-lime/25 blur-3xl" />

          <div className="relative">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-lime px-4 py-2 text-xs font-black uppercase tracking-[.16em] text-forest">
              <ShieldCheck size={16} /> Apie trenerį
            </div>

            <div className="grid min-h-[420px] place-items-center rounded-[2rem] border border-white/10 bg-white/[.06] p-8 text-center">
              <div>
                <div className="mx-auto grid h-28 w-28 place-items-center rounded-full bg-paper text-4xl font-black text-forest shadow-soft">
                  VP
                </div>
                <h2 className="mt-8 font-display text-5xl font-extrabold leading-none tracking-[-.075em]">
                  {trainerProfile.name}
                </h2>
                <p className="mt-3 text-white/62">{trainerProfile.role}</p>

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-white/[.07] p-4">
                    <Award className="mx-auto text-lime" size={22} />
                    <div className="mt-2 text-sm font-black">{trainerProfile.experience}</div>
                  </div>
                  <div className="rounded-2xl bg-white/[.07] p-4">
                    <Target className="mx-auto text-lime" size={22} />
                    <div className="mt-2 text-sm font-black">Individuali priežiūra</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div {...fadeUp}>
          <p className="text-xs font-black uppercase tracking-[.2em] text-moss/75">Apie trenerį</p>
          <h2 className="mt-3 font-display text-[clamp(2.6rem,5vw,4.7rem)] font-extrabold leading-[.94] tracking-[-.075em] text-ink">
            Ne atsitiktinės treniruotės, o aiški sistema.
          </h2>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-ink/62">
            {trainerProfile.bio}
          </p>

          <div className="mt-8 grid gap-3">
            {trainerProfile.principles.map((item) => (
              <div key={item} className="flex gap-3 rounded-2xl border border-ink/10 bg-white p-4 shadow-soft">
                <CheckCircle2 className="mt-0.5 shrink-0 text-forest" size={20} />
                <span className="font-bold leading-6 text-ink/72">{item}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-[1.6rem] border border-ink/10 bg-bone/70 p-5">
            <div className="text-[11px] font-black uppercase tracking-[.16em] text-ink/42">Specializacija</div>
            <p className="mt-2 font-display text-2xl font-extrabold tracking-[-.05em] text-ink">
              {trainerProfile.focus}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
