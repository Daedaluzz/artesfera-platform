"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";

export default function CTASection() {
  const router = useRouter();
  const { user, signInWithGoogle } = useAuth();

  const handleGetStarted = async () => {
    if (user) {
      router.push("/dashboard");
    } else {
      try {
        await signInWithGoogle();
        router.push("/dashboard");
      } catch (error) {
        console.error("Error signing in:", error);
        router.push("/login");
      }
    }
  };

  const handleLearnMore = () => {
    // Scroll to about section or navigate to dedicated about page
    const aboutSection = document.querySelector(
      'section[data-section="about"]'
    );
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push("/about");
    }
  };

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Main Glass Container */}
      <div className="max-w-6xl mx-auto relative">
        <div className="relative rounded-[20px] backdrop-blur-[15px] bg-white/[0.37] dark:bg-black/30 border border-white/[0.3] dark:border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.5),inset_0_-1px_0_rgba(255,255,255,0.1),inset_0_0_20px_10px_rgba(255,255,255,0.15)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.3),inset_0_-1px_0_rgba(255,255,255,0.05),inset_0_0_20px_10px_rgba(255,255,255,0.08)] overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/80 before:to-transparent after:content-[''] after:absolute after:top-0 after:left-0 after:w-px after:h-full after:bg-gradient-to-b after:from-white/80 after:via-transparent after:to-white/30">
          {/* Background Elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-10 right-20 w-24 h-24 bg-brand-yellow/20 rounded-full blur-2xl opacity-70 animate-pulse" />
            <div className="absolute bottom-16 left-16 w-32 h-32 bg-brand-blue/15 rounded-full blur-3xl opacity-60 animate-pulse delay-1000" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-brand-orange/10 rounded-full blur-3xl opacity-50 animate-pulse delay-500" />
          </div>

          <div className="relative z-10 px-8 py-16 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-brand-black dark:text-brand-white mb-6">
                Pronto para Transformar sua Carreira?
              </h2>
              <p className="text-lg sm:text-xl text-brand-black/80 dark:text-brand-white/80 max-w-3xl mx-auto mb-8">
                Junte-se à revolução que está conectando arte e negócios. Sua
                próxima grande oportunidade está esperando na ArtEsfera.
              </p>
              {/* CTA Buttons - Stacked vertically */}
              <div className="flex flex-col gap-3 justify-center items-center max-w-sm mx-auto">
                {/* Primary CTA */}
                <PrimaryButton
                  fullWidth
                  onClick={handleGetStarted}
                  showArrow
                  arrowIcon={
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" />
                  }
                >
                  {user ? "Acessar Dashboard" : "Comece Gratuitamente"}
                </PrimaryButton>

                {/* Secondary CTA */}
                <SecondaryButton fullWidth onClick={handleLearnMore}>
                  Saiba Mais
                </SecondaryButton>
              </div>

              {/* Trust Indicators */}
              <div className="mt-12 pt-8 border-t border-white/20 dark:border-white/10">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-brand-black/60 dark:text-brand-white/60">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-brand-green rounded-full mr-2" />
                    Cadastro 100% Gratuito
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-brand-green rounded-full mr-2" />
                    Sem Taxas Ocultas
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-brand-green rounded-full mr-2" />
                    Suporte 24/7
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
