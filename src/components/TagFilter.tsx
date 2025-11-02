/**
 * Dynamic Tag Filter Component
 * 
 * Advanced filtering component for the public gallery that works with user-generated tags
 */

"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Filter, Tag, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { publicGalleryService, GalleryFilters } from "@/services/publicGalleryService";

interface TagFilterProps {
  onFiltersChange: (filters: GalleryFilters) => void;
  currentFilters: GalleryFilters;
}

export function TagFilter({ onFiltersChange, currentFilters }: TagFilterProps) {
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [availableCategories, setAvailableCategories] = useState<{ category: string; count: number }[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>(currentFilters.tags || []);
  const [selectedCategory, setSelectedCategory] = useState<string>(currentFilters.category || "Todos");
  const [sortBy, setSortBy] = useState<'createdAt' | 'views' | 'likes' | 'title'>(currentFilters.sortBy || "createdAt");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(currentFilters.sortOrder || "desc");
  const [showAllTags, setShowAllTags] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load available tags and categories on component mount
  useEffect(() => {
    const loadFilterData = async () => {
      try {
        setLoading(true);
        const [tags, categories] = await Promise.all([
          publicGalleryService.getAvailableTags(),
          publicGalleryService.getAvailableCategories()
        ]);
        
        setAvailableTags(tags);
        setAvailableCategories(categories);
      } catch (error) {
        console.error('Error loading filter data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFilterData();
  }, []);

  // Filter tags based on search term
  const filteredTags = availableTags.filter(tag =>
    tag.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Display limited tags or all tags based on showAllTags state
  const displayedTags = showAllTags ? filteredTags : filteredTags.slice(0, 12);

  // Update filters when any filter changes
  useEffect(() => {
    const newFilters: GalleryFilters = {
      tags: selectedTags.length > 0 ? selectedTags : undefined,
      category: selectedCategory !== "Todos" ? selectedCategory : undefined,
      sortBy: sortBy,
      sortOrder: sortOrder
    };

    onFiltersChange(newFilters);
  }, [selectedTags, selectedCategory, sortBy, sortOrder, onFiltersChange]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const clearAllFilters = () => {
    setSelectedTags([]);
    setSelectedCategory("Todos");
    setSortBy("createdAt");
    setSortOrder("desc");
    setSearchTerm("");
  };

  const hasActiveFilters = selectedTags.length > 0 || selectedCategory !== "Todos" || 
                         sortBy !== "createdAt" || sortOrder !== "desc";

  const sortOptions: { value: 'createdAt' | 'views' | 'likes' | 'title'; label: string; order: 'asc' | 'desc' }[] = [
    { value: "createdAt", label: "Mais Recentes", order: "desc" },
    { value: "createdAt", label: "Mais Antigos", order: "asc" },
    { value: "title", label: "A-Z", order: "asc" },
    { value: "title", label: "Z-A", order: "desc" },
    { value: "views", label: "Mais Visualizados", order: "desc" },
    { value: "likes", label: "Mais Curtidos", order: "desc" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="mb-8"
    >
      <div className="relative rounded-[20px] backdrop-blur-[15px] bg-white/[0.2] dark:bg-black/20 border border-white/[0.3] dark:border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.5),inset_0_-1px_0_rgba(255,255,255,0.1),inset_0_0_20px_10px_rgba(255,255,255,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.3),inset_0_-1px_0_rgba(255,255,255,0.05),inset_0_0_20px_10px_rgba(255,255,255,0.04)]">
        
        {/* Filter Header */}
        <div className="p-6 border-b border-white/20 dark:border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Filter className="w-5 h-5 text-brand-navy-blue dark:text-brand-yellow" />
              <h3 className="text-lg font-semibold text-brand-black dark:text-brand-white">
                Filtros de Busca
              </h3>
              {hasActiveFilters && (
                <Badge className="bg-brand-navy-blue/20 dark:bg-brand-yellow/20 text-brand-navy-blue dark:text-brand-yellow border-0">
                  {selectedTags.length + (selectedCategory !== "Todos" ? 1 : 0)} filtros ativos
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <motion.button
                  onClick={clearAllFilters}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-sm text-brand-navy-blue dark:text-brand-yellow hover:text-brand-navy-blue/80 dark:hover:text-brand-yellow/80 transition-colors cursor-pointer"
                >
                  Limpar Filtros
                </motion.button>
              )}
              <motion.button
                onClick={() => setIsExpanded(!isExpanded)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full hover:bg-white/20 dark:hover:bg-white/10 transition-colors cursor-pointer"
              >
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-brand-black dark:text-brand-white" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-brand-black dark:text-brand-white" />
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Expandable Filter Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="p-6 space-y-6">
                
                {/* Categories */}
                <div>
                  <h4 className="text-sm font-semibold text-brand-black dark:text-brand-white mb-3 flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Categorias
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    <motion.button
                      onClick={() => handleCategoryChange("Todos")}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`px-4 py-2 rounded-[12px] text-sm font-medium transition-all duration-300 cursor-pointer ${
                        selectedCategory === "Todos"
                          ? "bg-brand-navy-blue/20 dark:bg-brand-yellow/20 border-brand-navy-blue/40 dark:border-brand-yellow/40 text-brand-navy-blue dark:text-brand-yellow border"
                          : "bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 text-brand-black dark:text-brand-white hover:bg-white/20 dark:hover:bg-white/8"
                      }`}
                    >
                      Todos
                    </motion.button>
                    {availableCategories.map(({ category, count }) => (
                      <motion.button
                        key={category}
                        onClick={() => handleCategoryChange(category)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`px-4 py-2 rounded-[12px] text-sm font-medium transition-all duration-300 cursor-pointer flex items-center gap-2 ${
                          selectedCategory === category
                            ? "bg-brand-navy-blue/20 dark:bg-brand-yellow/20 border-brand-navy-blue/40 dark:border-brand-yellow/40 text-brand-navy-blue dark:text-brand-yellow border"
                            : "bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 text-brand-black dark:text-brand-white hover:bg-white/20 dark:hover:bg-white/8"
                        }`}
                      >
                        {category}
                        <Badge className="bg-white/30 dark:bg-white/20 text-xs px-1.5 py-0 h-4">
                          {count}
                        </Badge>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Tag Search */}
                <div>
                  <h4 className="text-sm font-semibold text-brand-black dark:text-brand-white mb-3 flex items-center gap-2">
                    <Search className="w-4 h-4" />
                    Buscar Tags
                  </h4>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-brand-black/40 dark:text-brand-white/40" />
                    <input
                      type="text"
                      placeholder="Digite para buscar tags..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-[12px] backdrop-blur-[10px] bg-white/20 dark:bg-white/10 border border-white/30 dark:border-white/20 text-brand-black dark:text-brand-white placeholder-brand-black/50 dark:placeholder-brand-white/50 focus:outline-none focus:ring-2 focus:ring-brand-navy-blue/30 dark:focus:ring-brand-yellow/30 transition-all"
                    />
                  </div>
                </div>

                {/* Available Tags */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-brand-black dark:text-brand-white flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      Tags Disponíveis ({filteredTags.length})
                    </h4>
                    {filteredTags.length > 12 && (
                      <button
                        onClick={() => setShowAllTags(!showAllTags)}
                        className="text-sm text-brand-navy-blue dark:text-brand-yellow hover:text-brand-navy-blue/80 dark:hover:text-brand-yellow/80 transition-colors cursor-pointer"
                      >
                        {showAllTags ? "Mostrar menos" : "Mostrar todas"}
                      </button>
                    )}
                  </div>
                  
                  {loading ? (
                    <div className="flex flex-wrap gap-2">
                      {Array.from({ length: 12 }).map((_, i) => (
                        <div
                          key={i}
                          className="h-8 w-20 bg-white/20 dark:bg-white/10 rounded-lg animate-pulse"
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {displayedTags.map((tag) => (
                        <motion.button
                          key={tag}
                          onClick={() => handleTagToggle(tag)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer ${
                            selectedTags.includes(tag)
                              ? "bg-brand-navy-blue/30 dark:bg-brand-yellow/30 text-brand-navy-blue dark:text-brand-yellow border border-brand-navy-blue/50 dark:border-brand-yellow/50"
                              : "bg-white/20 dark:bg-white/10 text-brand-black dark:text-brand-white border border-white/30 dark:border-white/20 hover:bg-white/30 dark:hover:bg-white/20"
                          }`}
                        >
                          {tag}
                        </motion.button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Selected Tags */}
                {selectedTags.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-brand-black dark:text-brand-white mb-3 flex items-center gap-2">
                      Tags Selecionadas ({selectedTags.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedTags.map((tag) => (
                        <motion.div
                          key={tag}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="flex items-center gap-2 px-3 py-1.5 bg-brand-navy-blue/20 dark:bg-brand-yellow/20 text-brand-navy-blue dark:text-brand-yellow border border-brand-navy-blue/40 dark:border-brand-yellow/40 rounded-lg text-sm font-medium"
                        >
                          {tag}
                          <button
                            onClick={() => handleTagToggle(tag)}
                            className="hover:bg-white/20 rounded-full p-0.5 transition-colors cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sort Options */}
                <div>
                  <h4 className="text-sm font-semibold text-brand-black dark:text-brand-white mb-3">
                    Ordenar Por
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {sortOptions.map((option) => (
                      <motion.button
                        key={`${option.value}-${option.order}`}
                        onClick={() => {
                          setSortBy(option.value);
                          setSortOrder(option.order);
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`px-4 py-2 rounded-[12px] text-sm font-medium transition-all duration-300 cursor-pointer ${
                          sortBy === option.value && sortOrder === option.order
                            ? "bg-brand-navy-blue/20 dark:bg-brand-yellow/20 border-brand-navy-blue/40 dark:border-brand-yellow/40 text-brand-navy-blue dark:text-brand-yellow border"
                            : "bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 text-brand-black dark:text-brand-white hover:bg-white/20 dark:hover:bg-white/8"
                        }`}
                      >
                        {option.label}
                      </motion.button>
                    ))}
                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}