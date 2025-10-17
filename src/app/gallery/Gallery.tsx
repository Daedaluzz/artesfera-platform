"use client";

import { motion } from "framer-motion";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { useState } from "react";
import {
  Heart,
  Eye,
  Share2,
  MapPin,
  Calendar,
  Palette,
  Music,
  Camera,
  Pen,
  Theater,
  BookOpen,
} from "lucide-react";

// Mock data for artworks - diverse portfolio pieces from registered artists
const artworksData = [
  {
    id: 1,
    title: "Reflexões Urbanas",
    description:
      "Série fotográfica que captura a essência da vida urbana contemporânea através de reflexos e sombras nas metrópoles brasileiras.",
    image:
      "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&q=80",
    artist: {
      name: "Mariana Santos",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80",
      location: "São Paulo, SP",
      verified: true,
    },
    category: "Fotografia",
    medium: "Fotografia Digital",
    year: "2024",
    views: 2847,
    likes: 342,
    tags: ["Fotografia Urbana", "Preto e Branco", "Contemporâneo"],
    featured: true,
  },
  {
    id: 2,
    title: "Cores do Cerrado",
    description:
      "Pintura em acrílico que celebra a paleta de cores vibrantes e a biodiversidade única do cerrado brasileiro.",
    image:
      "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=800&q=80",
    artist: {
      name: "Rafael Oliveira",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80",
      location: "Brasília, DF",
      verified: true,
    },
    category: "Artes Visuais",
    medium: "Acrílico sobre Tela",
    year: "2024",
    views: 1923,
    likes: 289,
    tags: ["Pintura", "Arte Contemporânea", "Natureza", "Brasileiro"],
    featured: true,
  },
  {
    id: 3,
    title: "Silêncio Sonoro",
    description:
      "Instalação sonora interativa que explora a relação entre som e silêncio no ambiente urbano moderno.",
    image:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80",
    artist: {
      name: "Lucas Ferreira",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80",
      location: "Rio de Janeiro, RJ",
      verified: false,
    },
    category: "Música",
    medium: "Instalação Sonora",
    year: "2025",
    views: 1456,
    likes: 198,
    tags: ["Arte Sonora", "Instalação", "Experimental", "Interativo"],
    featured: false,
  },
  {
    id: 4,
    title: "Narrativas Ancestrais",
    description:
      "Série de ilustrações digitais inspiradas em contos e mitos da cultura afro-brasileira, resgatando memórias ancestrais.",
    image:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80",
    artist: {
      name: "Aisha Moreira",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80",
      location: "Salvador, BA",
      verified: true,
    },
    category: "Design",
    medium: "Ilustração Digital",
    year: "2024",
    views: 3124,
    likes: 456,
    tags: ["Ilustração", "Digital Art", "Cultura Afro", "Storytelling"],
    featured: true,
  },
  {
    id: 5,
    title: "Corpo em Movimento",
    description:
      "Registro fotográfico de performance de dança contemporânea que questiona os limites entre corpo, espaço e tempo.",
    image:
      "https://images.unsplash.com/photo-1508807526345-15e9b5f4eaff?w=800&q=80",
    artist: {
      name: "Carolina Andrade",
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80",
      location: "Porto Alegre, RS",
      verified: true,
    },
    category: "Dança",
    medium: "Performance/Fotografia",
    year: "2024",
    views: 2341,
    likes: 387,
    tags: ["Dança Contemporânea", "Performance", "Fotografia", "Arte do Corpo"],
    featured: false,
  },
  {
    id: 6,
    title: "Geometrias do Cotidiano",
    description:
      "Colagem digital que explora formas geométricas encontradas na arquitetura brasileira modernista e sua relação com o dia a dia.",
    image:
      "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800&q=80",
    artist: {
      name: "Pedro Henrique",
      avatar:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&q=80",
      location: "Belo Horizonte, MG",
      verified: false,
    },
    category: "Design",
    medium: "Colagem Digital",
    year: "2024",
    views: 1678,
    likes: 234,
    tags: ["Design Gráfico", "Geometria", "Arquitetura", "Modernismo"],
    featured: false,
  },
  {
    id: 7,
    title: "Retratos da Resistência",
    description:
      "Série de retratos em grafite que homenageiam figuras importantes da luta por direitos sociais no Brasil.",
    image:
      "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80",
    artist: {
      name: "Thiago Costa",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80",
      location: "Recife, PE",
      verified: true,
    },
    category: "Artes Visuais",
    medium: "Grafite sobre Parede",
    year: "2024",
    views: 4521,
    likes: 678,
    tags: ["Grafite", "Arte Urbana", "Retrato", "Ativismo"],
    featured: true,
  },
  {
    id: 8,
    title: "Tecituras Poéticas",
    description:
      "Instalação têxtil que combina técnicas ancestrais de tecelagem com poesia visual contemporânea.",
    image:
      "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=800&q=80",
    artist: {
      name: "Juliana Ribeiro",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80",
      location: "Curitiba, PR",
      verified: true,
    },
    category: "Literatura",
    medium: "Instalação Têxtil",
    year: "2025",
    views: 1834,
    likes: 312,
    tags: ["Arte Têxtil", "Poesia Visual", "Instalação", "Tradicional"],
    featured: false,
  },
  {
    id: 9,
    title: "Melodias da Floresta",
    description:
      "Composição musical experimental que utiliza sons da Amazônia gravados em expedição de 3 meses pela região.",
    image:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80",
    artist: {
      name: "André Souza",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80",
      location: "Manaus, AM",
      verified: true,
    },
    category: "Música",
    medium: "Composição Musical",
    year: "2024",
    views: 2156,
    likes: 421,
    tags: ["Música Experimental", "Amazônia", "Ambiental", "Field Recording"],
    featured: true,
  },
  {
    id: 10,
    title: "Fragmentos de Memória",
    description:
      "Série fotográfica analógica que explora a nostalgia e a passagem do tempo através de objetos esquecidos.",
    image:
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&q=80",
    artist: {
      name: "Beatriz Lima",
      avatar:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&q=80",
      location: "Florianópolis, SC",
      verified: false,
    },
    category: "Fotografia",
    medium: "Fotografia Analógica",
    year: "2024",
    views: 2945,
    likes: 512,
    tags: ["Fotografia Analógica", "Nostalgia", "Still Life", "Vintage"],
    featured: false,
    forSale: true,
    price: "R$ 750",
  },
  {
    id: 11,
    title: "Diálogos Cênicos",
    description:
      "Registro de performance teatral experimental que quebra a quarta parede e convida o público a participar da narrativa.",
    image:
      "https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&q=80",
    artist: {
      name: "Roberto Almeida",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80",
      location: "São Paulo, SP",
      verified: true,
    },
    category: "Teatro",
    medium: "Performance Teatral",
    year: "2025",
    views: 1567,
    likes: 267,
    tags: ["Teatro Experimental", "Performance", "Interativo", "Contemporâneo"],
    featured: false,
  },
  {
    id: 12,
    title: "Paisagens Interiores",
    description:
      "Pinturas abstratas em óleo que representam estados emocionais através de cores e texturas orgânicas.",
    image:
      "https://images.unsplash.com/photo-1578301978018-3005759f48f7?w=800&q=80",
    artist: {
      name: "Fernanda Neves",
      avatar:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&q=80",
      location: "Goiânia, GO",
      verified: true,
    },
    category: "Artes Visuais",
    medium: "Óleo sobre Tela",
    year: "2024",
    views: 3467,
    likes: 589,
    tags: ["Pintura Abstrata", "Óleo", "Expressionismo", "Emoção"],
    featured: true,
  },
];

const categoryIcons: Record<string, React.ElementType> = {
  "Artes Visuais": Palette,
  Música: Music,
  Fotografia: Camera,
  Design: Pen,
  Teatro: Theater,
  Dança: Palette,
  Literatura: BookOpen,
};

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [likedArtworks, setLikedArtworks] = useState<number[]>([]);

  const toggleLike = (artworkId: number) => {
    setLikedArtworks((prev) =>
      prev.includes(artworkId)
        ? prev.filter((id) => id !== artworkId)
        : [...prev, artworkId]
    );
  };

  const filteredArtworks =
    selectedCategory === "Todos"
      ? artworksData
      : artworksData.filter((artwork) => artwork.category === selectedCategory);

  const categories = [
    "Todos",
    "Artes Visuais",
    "Música",
    "Teatro",
    "Dança",
    "Literatura",
    "Design",
    "Fotografia",
  ];
  return (
    <div className="py-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif text-brand-black dark:text-brand-white mb-6">
          Galeria{" "}
          <span className="text-brand-navy-blue dark:text-brand-yellow">
            ArtEsfera
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-brand-black/80 dark:text-brand-white/80 max-w-3xl mx-auto leading-relaxed">
          Descubra projetos incríveis, artistas talentosos e a diversidade
          criativa que move nossa comunidade
        </p>
      </motion.div>

      {/* Filter Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="mb-12"
      >
        <div className="relative p-6 rounded-[20px] backdrop-blur-[15px] bg-white/[0.2] dark:bg-black/20 border border-white/[0.3] dark:border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.5),inset_0_-1px_0_rgba(255,255,255,0.1),inset_0_0_20px_10px_rgba(255,255,255,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.3),inset_0_-1px_0_rgba(255,255,255,0.05),inset_0_0_20px_10px_rgba(255,255,255,0.04)]">
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((filter) => (
              <motion.button
                key={filter}
                onClick={() => setSelectedCategory(filter)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`group relative px-6 py-3 rounded-[12px] backdrop-blur-[10px] border shadow-[0_4px_16px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(255,255,255,0.1)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(255,255,255,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.6),inset_0_-1px_0_rgba(255,255,255,0.15)] dark:hover:shadow-[0_8px_24px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.3),inset_0_-1px_0_rgba(255,255,255,0.08)] font-medium transition-all duration-300 overflow-hidden cursor-pointer before:content-[''] before:absolute before:top-[-2px] before:left-[-100%] before:w-full before:h-[calc(100%+4px)] before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent before:transition-all before:duration-600 before:ease-in-out before:pointer-events-none before:z-10 hover:before:left-full hover:backdrop-blur-xl hover:translate-y-[-1px] after:content-[''] after:absolute after:top-0 after:left-0 after:right-0 after:h-px after:bg-gradient-to-r after:from-transparent after:via-white/40 after:to-transparent ${
                  selectedCategory === filter
                    ? "bg-brand-navy-blue/20 dark:bg-brand-yellow/20 border-brand-navy-blue/40 dark:border-brand-yellow/40 text-brand-navy-blue dark:text-brand-yellow"
                    : "bg-white/[0.1] dark:bg-white/[0.05] border-white/[0.2] dark:border-white/[0.1] text-brand-black dark:text-brand-white hover:text-brand-navy-blue dark:hover:text-brand-yellow hover:bg-white/20 dark:hover:bg-white/8"
                }`}
              >
                <span className="relative z-10">{filter}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Gallery Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16"
      >
        {filteredArtworks.map((artwork, index) => {
          const CategoryIcon = categoryIcons[artwork.category];
          const isLiked = likedArtworks.includes(artwork.id);

          return (
            <motion.div
              key={artwork.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="group relative rounded-[20px] backdrop-blur-[15px] bg-white/[0.2] dark:bg-black/20 border border-white/[0.3] dark:border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.5),inset_0_-1px_0_rgba(255,255,255,0.1),inset_0_0_20px_10px_rgba(255,255,255,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.3),inset_0_-1px_0_rgba(255,255,255,0.05),inset_0_0_20px_10px_rgba(255,255,255,0.04)] overflow-hidden hover:shadow-[0_16px_48px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_16px_48px_rgba(0,0,0,0.4)] transition-all duration-500"
            >
              {/* Artwork Image */}
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={artwork.image}
                  alt={artwork.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {artwork.featured && (
                  <div className="absolute top-4 left-4 z-10">
                    <Badge className="bg-brand-yellow/90 dark:bg-brand-navy-blue/90 text-brand-black dark:text-brand-white border-0">
                      Destaque
                    </Badge>
                  </div>
                )}

                {/* Overlay with Actions */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <motion.button
                        onClick={(e) => {
                          e.preventDefault();
                          toggleLike(artwork.id);
                        }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={`p-2 rounded-full backdrop-blur-[10px] bg-white/20 border border-white/30 transition-colors ${
                          isLiked
                            ? "text-brand-red"
                            : "text-white hover:text-brand-red"
                        }`}
                      >
                        <Heart
                          className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`}
                        />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 rounded-full backdrop-blur-[10px] bg-white/20 border border-white/30 text-white hover:text-brand-blue transition-colors"
                      >
                        <Share2 className="w-5 h-5" />
                      </motion.button>
                    </div>
                    <div className="flex items-center gap-3 text-white text-sm">
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {artwork.views.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        {artwork.likes}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Artwork Details */}
              <div className="p-5">
                {/* Artist Info */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white/30">
                    <Image
                      src={artwork.artist.avatar}
                      alt={artwork.artist.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <p className="text-sm font-semibold text-brand-black dark:text-brand-white truncate">
                        {artwork.artist.name}
                      </p>
                      {artwork.artist.verified && (
                        <Badge className="bg-brand-blue/20 text-brand-blue dark:bg-brand-blue/30 dark:text-brand-blue text-xs px-1.5 py-0 h-4 border-0">
                          ✓
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-brand-black/60 dark:text-brand-white/60 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {artwork.artist.location}
                    </p>
                  </div>
                </div>

                {/* Artwork Title */}
                <h3 className="text-lg font-bold mb-2 text-brand-black dark:text-brand-white line-clamp-2">
                  {artwork.title}
                </h3>

                {/* Category & Medium */}
                <div className="flex items-center gap-2 mb-3">
                  <CategoryIcon className="w-4 h-4 text-brand-navy-blue dark:text-brand-yellow" />
                  <span className="text-sm text-brand-black/70 dark:text-brand-white/70">
                    {artwork.medium}
                  </span>
                  <span className="text-xs text-brand-black/40 dark:text-brand-white/40">
                    •
                  </span>
                  <Calendar className="w-3 h-3 text-brand-black/50 dark:text-brand-white/50" />
                  <span className="text-sm text-brand-black/70 dark:text-brand-white/70">
                    {artwork.year}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-brand-black/60 dark:text-brand-white/60 mb-4 line-clamp-2">
                  {artwork.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {artwork.tags.slice(0, 3).map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-white/50 dark:bg-white/10 text-brand-black dark:text-brand-white border-white/30 text-xs"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Load More Button */}
      <div className="text-center">
        <SecondaryButton>Carregar Mais Obras</SecondaryButton>
      </div>
    </div>
  );
}
