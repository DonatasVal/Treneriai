import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Dumbbell } from "lucide-react";
import { BUSINESS } from "../../data/siteData.js";
import { useBooking } from "../../context/BookingContext.jsx";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { openBooking } = useBooking();

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    ["Apie", "#apie"],
    ["Paslaugos", "#paslaugos"],
    ["Procesas", "#procesas"],
    ["Rezultatai", "#rezultatai"],
    ["Kontaktai", "#kontaktai"],
  ];

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "border-ink/10 bg-paper/70 shadow-soft backdrop-blur-xl"
          : "border-ink/5 bg-paper/90"
      }`}
    >
      <div className={`mx-auto flex w-[min(1180px,calc(100%-42px))] items-center justify-between gap-6 transition-all duration-300 ${scrolled ? "min-h-16" : "min-h-20"}`}>
        <a href="/" className="flex items-center gap-3">
          <motion.div
            whileHover={{ rotate: -8, scale: 1.04 }}
            className="grid h-11 w-11 place-items-center rounded-2xl bg-forest text-lime shadow-soft"
          >
            <Dumbbell size={20} />
          </motion.div>
          <div>
            <div className="font-display text-lg font-extrabold tracking-[-.04em] text-ink">
              {BUSINESS.brand}
            </div>
            <div className="text-[10px] font-extrabold uppercase tracking-[.18em] text-ink/50">
              {BUSINESS.subtitle}
            </div>
          </div>
        </a>

        <nav className="hidden items-center gap-2 md:flex">
          {links.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="rounded-full px-4 py-2 text-sm font-extrabold text-ink/65 transition hover:bg-ink/5 hover:text-ink"
            >
              {label}
            </a>
          ))}
          <button
            type="button"
            onClick={() => openBooking()}
            className="rounded-full bg-forest px-5 py-3 text-sm font-extrabold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-ink"
          >
            Registruotis
          </button>
        </nav>
      </div>
    </header>
  );
}
