import { useSiteFX } from "@/hooks/useSiteFX";
import SiteHeader from "@/sections/SiteHeader";
import HeroSection from "@/sections/HeroSection";
import { Ticker, Stats } from "@/sections/TickerStats";
import { Services, FleetVideo, FleetGallery } from "@/sections/ServicesFleet";
import { Process, Reviews } from "@/sections/ProcessReviews";
import ContactSection from "@/sections/ContactSection";
import SiteFooter from "@/sections/SiteFooter";

export default function Home() {
  useSiteFX();

  return (
    <div className="ell">
      <SiteHeader />
      <main id="top">
        <HeroSection />
        <Ticker />
        <Stats />
        <Services />
        <FleetVideo />
        <FleetGallery />
        <Process />
        <Reviews />
        <ContactSection />
      </main>
      <SiteFooter />
    </div>
  );
}
