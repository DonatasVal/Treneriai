import { motion } from "framer-motion";
import { Activity, ArrowRight, CalendarCheck, LineChart, MoveUpRight } from "lucide-react";
import { BUSINESS } from "../data/siteData.js";

export default function Hero({ onBook }) {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid min-h-[calc(100vh-80px)] w-[min(1180px,calc(100%-42px))] grid-cols-1 items-center gap-12 py-16 lg:grid-cols-[.94fr_1.06fr] lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .72, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-lime/20 px-4 py-2 text-[11px] font-black uppercase tracking-[.2em] text-moss">
            <span className="h-2 w-2 rounded-full bg-lime animate-pulse-dot" />
            Individualios treniruotės
          </div>

          <h1 className="mt-7 max-w-3xl font-display text-[clamp(3.45rem,7vw,6.6rem)] font-extrabold leading-[.88] tracking-[-.085em] text-ink">
            Kūnas, kuris dirba pagal <span className="text-moss">planą</span>, ne pagal nuotaiką.
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-8 text-ink/65">
            {BUSINESS.trainerName} padeda susikurti aiškų treniruočių ritmą: jėga, laikysena, ištvermė ir realus progresas be atsitiktinių pratimų.
          </p>

          <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={onBook}
              className="group inline-flex items-center gap-3 rounded-full bg-forest px-7 py-4 text-sm font-black text-white shadow-lift transition hover:-translate-y-1 hover:bg-ink"
            >
              Rezervuoti treniruotę
              <ArrowRight size={18} className="transition group-hover:translate-x-1" />
            </button>
            <a
              href="#paslaugos"
              className="inline-flex items-center gap-2 text-sm font-black text-ink/65 transition hover:text-ink"
            >
              Peržiūrėti formatą <MoveUpRight size={16} />
            </a>
          </div>

          <div className="mt-9 flex flex-wrap gap-3">
            {["Registracija 24/7", "Aiškus planas", "Progreso sekimas"].map((item) => (
              <span key={item} className="rounded-full border border-ink/10 bg-white/70 px-4 py-2 text-sm font-extrabold text-ink/70 shadow-soft">
                {item}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: .97, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: .9, delay: .08, ease: [0.2, 0.8, 0.2, 1] }}
          className="relative min-h-[560px] overflow-hidden rounded-[2.4rem] border border-white/70 bg-forest shadow-lift kinetic-grid"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(199,244,90,.34),transparent_26%),linear-gradient(135deg,rgba(255,255,255,.08),rgba(255,255,255,0))]" />
          <div className="absolute right-10 top-10 h-[430px] w-[270px] rounded-t-full rounded-b-[2rem] bg-[linear-gradient(180deg,#F4F1EA_0_16%,#C7F45A_16%_20%,#111827_20%_64%,#2B312D_64%)] shadow-glass animate-breathe">
            <div className="absolute left-1/2 top-8 h-20 w-20 -translate-x-1/2 rounded-full bg-paper shadow-soft" />
            <div className="absolute left-1/2 top-[122px] h-28 w-36 -translate-x-1/2 rounded-[2rem] border border-white/15 bg-white/5" />
          </div>

          <div className="glass absolute left-7 top-8 max-w-[260px] rounded-[1.65rem] p-5 shadow-glass">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-lime text-forest">
                <LineChart size={20} />
              </div>
              <div>
                <div className="font-display text-3xl font-extrabold tracking-[-.06em]">8 sav.</div>
                <div className="text-xs font-bold uppercase tracking-[.12em] text-ink/50">progreso ciklas</div>
              </div>
            </div>
          </div>

          <div className="glass absolute bottom-7 left-7 right-7 rounded-[2rem] p-6 shadow-glass">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-lime/80 px-3 py-1 text-[11px] font-black uppercase tracking-[.16em] text-forest">
                  <Activity size={14} /> šiandien
                </div>
                <h2 className="font-display text-3xl font-extrabold leading-none tracking-[-.06em] text-ink">
                  Jėga, technika, ritmas
                </h2>
                <p className="mt-3 max-w-md text-sm leading-6 text-ink/62">
                  Treniruotės planuojamos pagal realų užimtumą — klientas renkasi laiką, treneris valdo grafiką.
                </p>
              </div>
              <div className="rounded-3xl bg-ink px-5 py-4 text-white">
                <CalendarCheck size={22} />
                <div className="mt-2 text-2xl font-black tracking-[-.05em]">19:00</div>
                <div className="text-xs font-bold text-white/55">laisvas laikas</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
