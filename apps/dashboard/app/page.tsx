import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import LiveDemoSection from "@/components/landing/LiveDemoSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";

export default async function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#09090b] text-white">
      <Navbar />
      <Hero />
      <LiveDemoSection />
      <FeaturesSection />
      <HowItWorksSection />
    </div>
  );
}
