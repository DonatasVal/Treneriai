import Header from "../components/layout/Header.jsx";
import Hero from "../components/sections/Hero.jsx";
import AboutTrainer from "../components/sections/AboutTrainer.jsx";
import Services from "../components/sections/Services.jsx";
import Process from "../components/sections/Process.jsx";
import Results from "../components/sections/Results.jsx";
import Reviews from "../components/sections/Reviews.jsx";
import Contact from "../components/sections/Contact.jsx";
import Footer from "../components/layout/Footer.jsx";
import BookingModal from "../components/booking/BookingModal.jsx";

export default function LandingPage() {
  return (
    <main>
      <Header />
      <Hero />
      <AboutTrainer />
      <Services />
      <Process />
      <Results />
      <Reviews />
      <Contact />
      <Footer />
      <BookingModal />
    </main>
  );
}
