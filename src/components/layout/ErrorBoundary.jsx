import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error?.message || "Nežinoma klaida" };
  }

  componentDidCatch(error, info) {
    console.error("Application error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="grid min-h-screen place-items-center bg-bone p-6 text-ink">
          <section className="max-w-xl rounded-[2rem] border border-ink/10 bg-white p-8 shadow-soft">
            <h1 className="font-display text-3xl font-extrabold tracking-[-.06em]">
              Įvyko klaida
            </h1>
            <p className="mt-3 leading-7 text-ink/60">
              Pabandykite perkrauti puslapį. Klaidos tekstas: {this.state.message}
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 rounded-full bg-forest px-5 py-3 text-sm font-black text-white"
            >
              Perkrauti
            </button>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}
