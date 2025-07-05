"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Marina Silva",
    role: "Artista Visual",
    company: "Independente",
    content:
      "A ArtEsfera transformou minha carreira. Consegui conectar com empresas que realmente valorizam arte autêntica. Em 6 meses, tripliquei meus projetos.",
    rating: 5,
    avatar: "MS",
  },
  {
    name: "Carlos Eduardo",
    role: "Diretor de Marketing",
    company: "Cultural Brasil",
    content:
      "Encontrar artistas talentosos nunca foi tão fácil. A plataforma nos conectou com profissionais perfeitos para nossas campanhas culturais.",
    rating: 5,
    avatar: "CE",
  },
  {
    name: "Ana Beatriz",
    role: "Designer Gráfica",
    company: "Freelancer",
    content:
      "O sistema de match é incrível! Me conectou com projetos que se alinham perfeitamente com meu estilo. A ArtEsfera entende o mercado criativo.",
    rating: 5,
    avatar: "AB",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-16 left-1/3 w-40 h-40 bg-brand-pink/8 rounded-full blur-3xl opacity-60 animate-pulse" />
        <div className="absolute bottom-24 right-1/4 w-32 h-32 bg-brand-blue/12 rounded-full blur-2xl opacity-50 animate-pulse delay-1000" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-brand-black dark:text-brand-white mb-6">
            O que Nossa Comunidade Diz
          </h2>
          <p className="text-lg sm:text-xl text-brand-black/80 dark:text-brand-white/80 max-w-3xl mx-auto">
            Histórias reais de artistas e empresas que encontraram seu match
            perfeito na ArtEsfera.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="relative p-6 rounded-[20px] backdrop-blur-[15px] bg-white/25 dark:bg-black/25 border border-white/30 dark:border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.5),inset_0_-1px_0_rgba(255,255,255,0.1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.3),inset_0_-1px_0_rgba(255,255,255,0.05)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_16px_48px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.6),inset_0_-1px_0_rgba(255,255,255,0.15)] dark:hover:shadow-[0_16px_48px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(255,255,255,0.1)] overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent after:content-[''] after:absolute after:top-0 after:left-0 after:w-px after:h-full after:bg-gradient-to-b after:from-white/60 after:via-transparent after:to-white/20">
                {" "}
                {/* Quote Icon */}
                <div className="absolute top-4 right-4 opacity-10">
                  <Quote className="w-8 h-8 text-brand-navy-blue dark:text-brand-yellow" />
                </div>
                <div className="relative z-10">
                  {/* Rating */}
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-brand-navy-blue dark:text-brand-yellow fill-current"
                      />
                    ))}
                  </div>

                  {/* Content */}
                  <p className="text-brand-black/80 dark:text-brand-white/80 mb-6 leading-relaxed italic">
                    &ldquo;{testimonial.content}&rdquo;
                  </p>

                  {/* Author */}
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-brand-navy-blue/20 dark:bg-brand-yellow/20 flex items-center justify-center mr-3 backdrop-blur-sm border border-brand-navy-blue/30 dark:border-brand-yellow/30">
                      <span className="text-brand-navy-blue dark:text-brand-yellow font-semibold text-sm">
                        {testimonial.avatar}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-brand-black dark:text-brand-white">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-brand-black/60 dark:text-brand-white/60">
                        {testimonial.role} • {testimonial.company}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-lg text-brand-black/70 dark:text-brand-white/70 mb-6">
            Junte-se a mais de{" "}
            <span className="font-semibold text-brand-navy-blue dark:text-brand-yellow">
              1.000+ profissionais
            </span>{" "}
            que já encontraram seu match perfeito
          </p>
        </motion.div>
      </div>
    </section>
  );
}
