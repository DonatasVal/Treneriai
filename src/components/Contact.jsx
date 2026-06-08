import { BUSINESS } from "../data/siteData.js";
import { Calendar, Mail, MapPin, Phone } from "lucide-react";

export default function Contact({ onBook }) {
  const rows = [
    [Phone, "Telefonas", BUSINESS.phone],
    [Mail, "El. paštas", BUSINESS.email],
    [MapPin, "Adresas", BUSINESS.address],
    [Calendar, "Darbo laikas", BUSINESS.hours],
  ];

  return (
    <section id="kontaktai" className="bg-bone/70 py-24">
      <div className="mx-auto w-[min(1180px,calc(100%-42px))]">
        <div className="grid gap-10 lg:grid-cols-[.85fr_1.15fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-[.2em] text-moss/75">Kontaktai</p>
            <h2 className="mt-3 font-display text-[clamp(2.5rem,5vw,4.5rem)] font-extrabold leading-[.92] tracking-[-.075em] text-ink">
              Registracija be ilgo derinimo.
            </h2>
            <p className="mt-6 text-lg leading-8 text-ink/62">
              Klientas pasirenka pageidaujamą laiką, o treneris admin panelėje patvirtina arba perkelia registraciją.
            </p>

            <button
              type="button"
              onClick={onBook}
              className="mt-8 rounded-full bg-forest px-7 py-4 text-sm font-black text-white shadow-lift transition hover:-translate-y-1 hover:bg-ink"
            >
              Registruotis treniruotei
            </button>
          </div>

          <div className="rounded-[2.2rem] border border-ink/10 bg-white/86 p-6 shadow-soft">
            <div className="grid gap-4 sm:grid-cols-2">
              {rows.map(([Icon, label, value]) => (
                <div key={label} className="rounded-[1.6rem] border border-ink/10 bg-paper p-5">
                  <div className="mb-4 grid h-11 w-11 place-items-center rounded-2xl bg-lime/25 text-forest">
                    <Icon size={20} />
                  </div>
                  <div className="text-[11px] font-black uppercase tracking-[.16em] text-ink/42">{label}</div>
                  <div className="mt-2 font-extrabold leading-6 text-ink">{value}</div>
                </div>
              ))}
            </div>

            <div className="mt-4 min-h-[280px] rounded-[1.8rem] border border-ink/10 bg-[linear-gradient(135deg,rgba(199,244,90,.18),rgba(255,255,255,.86)),radial-gradient(circle_at_24%_25%,rgba(24,37,29,.1),transparent_22%)] p-6">
              <div className="max-w-sm">
                <div className="text-[11px] font-black uppercase tracking-[.16em] text-ink/42">Lokacija</div>
                <h3 className="mt-3 font-display text-3xl font-extrabold tracking-[-.06em] text-ink">
                  Sporto salė / studija
                </h3>
                <p className="mt-3 leading-7 text-ink/58">
                  Čia galima įterpti Google Maps, parkavimą, įėjimo instrukcijas ir sporto klubo pavadinimą.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
