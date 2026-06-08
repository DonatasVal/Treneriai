import { motion } from "framer-motion";
import { reviews } from "../../data/siteData.js";
import { useSafeMotion } from "../../hooks/useMotion.js";

export default function Reviews() {
  const { fadeUp } = useSafeMotion();

  return (
    <section id="atsiliepimai" className="py-24">
      <div className="mx-auto w-[min(1180px,calc(100%-42px))]">
        <div className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[.2em] text-moss/75">Klientų patirtis</p>
          <h2 className="mt-3 font-display text-[clamp(2.5rem,5vw,4.5rem)] font-extrabold leading-[.92] tracking-[-.075em] text-ink">
            Klientų atsiliepimai ir realūs pokyčiai.
          </h2>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {reviews.map((review, index) => (
            <motion.article
              key={review.name}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: index * 0.04 }}
              className="rounded-[2rem] border border-ink/10 bg-white/82 p-7 shadow-soft"
            >
              <div className="mb-5 text-lime">★★★★★</div>
              <p className="text-lg font-semibold leading-8 tracking-[-.02em] text-ink">
                „{review.quote}“
              </p>
              <div className="mt-7 flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-full bg-forest font-black text-lime">
                  {review.name[0]}
                </div>
                <div>
                  <div className="font-black text-ink">{review.name}</div>
                  <div className="text-sm text-ink/50">{review.role}</div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
