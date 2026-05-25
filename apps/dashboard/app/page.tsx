import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";

export default async function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#09090b] text-white">
      <Navbar />
      <Hero />
    </div>
  );
}
