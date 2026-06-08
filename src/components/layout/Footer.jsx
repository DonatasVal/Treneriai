import { Link } from "react-router-dom";
import { BUSINESS } from "../../data/siteData.js";

export default function Footer() {
  return (
    <footer className="bg-forest py-10 text-white/58">
      <div className="mx-auto flex w-[min(1180px,calc(100%-42px))] flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="font-display text-xl font-extrabold tracking-[-.05em] text-white">{BUSINESS.brand}</div>
          <div className="mt-1 text-sm">{BUSINESS.subtitle}</div>
        </div>
        <div className="flex flex-wrap gap-5 text-sm font-bold">
          <Link to="/admin" className="transition hover:text-white">Admin panelė</Link>
          <a href="#kontaktai" className="transition hover:text-white">Kontaktai</a>
          <a href="#paslaugos" className="transition hover:text-white">Paslaugos</a>
        </div>
      </div>
    </footer>
  );
}
