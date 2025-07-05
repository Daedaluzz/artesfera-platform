import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import FeaturesSection from "@/components/FeaturesSection";
import DaevaAISection from "@/components/DaevaAISection";
import HowItWorksSection from "@/components/HowItWorksSection";
import CommunityImpactSection from "@/components/CommunityImpactSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CTASection from "@/components/CTASection";

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <AboutSection />
      <FeaturesSection />
      <DaevaAISection />
      <HowItWorksSection />
      <CommunityImpactSection />
      <TestimonialsSection />
      <CTASection />
    </main>
  );
}
