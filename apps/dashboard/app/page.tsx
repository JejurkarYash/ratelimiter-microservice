import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import LiveDemoSection from "@/components/landing/LiveDemoSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import AnalyticsShowcaseSection from "@/components/landing/AnalyticsShowcaseSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

export default async function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#09090b] text-white">
      <Navbar />
      <Hero />
      <LiveDemoSection />
      <FeaturesSection />
      <HowItWorksSection />
      <AnalyticsShowcaseSection />
      <CTASection />
      <Footer />
    </div>
  );
}
