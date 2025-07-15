import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { CreatorShowcase } from "@/components/creator-showcase";
import { ServicesSection } from "@/components/services-section";
import { HowItWorks } from "@/components/how-it-works";
import { SuccessStories } from "@/components/success-stories";
import { ComingSoonBanner } from "@/components/coming-soon-banner";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <HeroSection />
        <CreatorShowcase />
        <HowItWorks />
        <SuccessStories />
        <ComingSoonBanner />
      </main>
      <Footer />
    </div>
  );
}
