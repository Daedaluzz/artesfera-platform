"use client";

interface JsonLdProps {
  data?: object;
}

export default function JsonLd({ data }: JsonLdProps) {
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "ArtEsfera",
    alternateName: "ArtEsfera Ecosystem",
    description:
      "ArtEsfera é um ecossistema de suporte, fomento e profissionalização de todas as formas da arte. Descubra, contrate e exponha talentos únicos em um ambiente digital revolucionário.",
    url: "https://app.artesfera.tech",
    sameAs: [
      "https://www.instagram.com/artesfera",
      "https://www.facebook.com/artesfera",
      "https://twitter.com/artesfera",
    ],
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://app.artesfera.tech/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@type": "Organization",
      name: "ArtEsfera",
      logo: {
        "@type": "ImageObject",
        url: "https://app.artesfera.tech/logo.svg",
      },
    },
  };

  const structuredData = data || defaultStructuredData;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
