import { motion } from "framer-motion";
import { resultStories } from "../../data/siteData.js";
import { useSafeMotion } from "../../hooks/useMotion.js";

export default function Results() {
  const { fadeUp } = useSafeMotion();

  return (
    <section id="rezultatai" className="bg-bone/70 py-24">
      <div className="mx-auto w-[min(1180px,calc(100%-42px))]">
        <div className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[.2em] text-moss/75">Rezultatų kryptys</p>
          <h2 className="mt-3 font-display text-[clamp(2.5rem,5vw,4.5rem)] font-extrabold leading-[.92] tracking-[-.075em] text-ink">
            Aiškiau matomas progresas, kai jis yra matuojamas.
          </h2>
          <p className="mt-5 text-lg leading-8 text-ink/62">
            Profesionaliau atrodo ne pažadai, o aiški struktūra: tikslas, laikotarpis ir rezultatas.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {resultStories.map((story, index) => (
            <motion.article
              key={story.goal}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: index * 0.04 }}
              className="rounded-[2rem] border border-ink/10 bg-white p-7 shadow-soft"
            >
              <div className="mb-7 flex items-center justify-between gap-4">
                <span className="rounded-full bg-lime/25 px-4 py-2 text-xs font-black uppercase tracking-[.14em] text-forest">
                  {story.period}
                </span>
                <span className="text-3xl font-black text-lime">★</span>
              </div>
              <h3 className="font-display text-2xl font-extrabold tracking-[-.055em] text-ink">
                {story.goal}
              </h3>
              <p className="mt-4 leading-7 text-ink/62">{story.result}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
