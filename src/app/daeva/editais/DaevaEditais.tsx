"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  ArrowUp,
  Sparkles,
  MessageCircle,
  Brain,
  Search,
  DollarSign,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import DaevaSidebar from "@/components/DaevaSidebar";

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function DaevaEditais() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showTitle, setShowTitle] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const resetChat = () => {
    setMessages([]);
    setInputValue("");
    setIsLoading(false);
    setShowTitle(true);
    setHasInteracted(false);
  };

  useEffect(() => {
    // Only scroll to bottom if there are messages and user has interacted
    if (messages.length > 0 && hasInteracted) {
      scrollToBottom();
    }
  }, [messages, hasInteracted]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Mark that user has interacted
    setHasInteracted(true);

    // Hide title on first message
    if (messages.length === 0) {
      setShowTitle(false);
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulate AI response specific to editais
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content:
          "Olá! Sou a Daeva especializada em editais culturais. Posso ajudá-lo com orientações sobre captação de recursos, elaboração de projetos, cronogramas, orçamentos e muito mais. Como posso ajudá-lo hoje?",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestions = [
    {
      icon: Search,
      text: "Como encontrar editais adequados para meu projeto cultural?",
    },
    {
      icon: FileText,
      text: "Ajude-me a estruturar um projeto para edital de cultura",
    },
    {
      icon: DollarSign,
      text: "Como elaborar um orçamento detalhado para edital?",
    },
    {
      icon: Calendar,
      text: "Quais são os prazos típicos de editais culturais?",
    },
  ];

  return (
    <div className="fixed top-16 left-0 right-0 bottom-0 flex overflow-hidden">
      {/* Sidebar */}
      <DaevaSidebar onResetChat={resetChat} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative">
        {/* Main Chat Container */}
        <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full px-4 lg:px-0 h-full">
          {/* Header with animated title */}
          <AnimatePresence>
            {showTitle && (
              <motion.div
                initial={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15, scale: 0.98 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="flex flex-col items-center justify-center flex-1 px-4"
              >
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-center mb-8"
                >
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-brand-navy-blue/20 dark:bg-brand-yellow/20 backdrop-blur-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-brand-navy-blue dark:text-brand-yellow" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-brand-black dark:text-brand-white">
                      Daeva{" "}
                      <span className="text-brand-navy-blue dark:text-brand-yellow">
                        Editais
                      </span>
                    </h1>
                  </div>
                  <p className="text-sm sm:text-base text-brand-black/70 dark:text-brand-white/70 max-w-xl mx-auto leading-relaxed">
                    Especialista em editais culturais, captação de recursos e
                    elaboração de projetos
                  </p>
                </motion.div>

                {/* Suggestion Cards */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl mb-6"
                >
                  {suggestions.map((suggestion, index) => {
                    const IconComponent = suggestion.icon;
                    return (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => {
                          setInputValue(suggestion.text);
                          setHasInteracted(true);
                        }}
                        className="relative p-3 rounded-[16px] backdrop-blur-[12px] bg-white/[0.12] dark:bg-white/[0.06] border border-white/[0.2] dark:border-white/[0.12] shadow-[0_4px_20px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.3),inset_0_-1px_0_rgba(255,255,255,0.08),inset_0_0_15px_8px_rgba(255,255,255,0.04)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(255,255,255,0.06),inset_0_0_15px_8px_rgba(255,255,255,0.02)] transition-all duration-200 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(255,255,255,0.12),inset_0_0_20px_10px_rgba(255,255,255,0.06)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.16),inset_0_1px_0_rgba(255,255,255,0.3),inset_0_-1px_0_rgba(255,255,255,0.08),inset_0_0_20px_10px_rgba(255,255,255,0.04)] text-left group"
                      >
                        <div className="flex items-start gap-2.5">
                          <div className="w-6 h-6 rounded-lg bg-brand-navy-blue/15 dark:bg-brand-yellow/15 flex items-center justify-center flex-shrink-0 transition-colors duration-200 group-hover:bg-brand-navy-blue/25 dark:group-hover:bg-brand-yellow/25">
                            <IconComponent className="w-3.5 h-3.5 text-brand-navy-blue dark:text-brand-yellow" />
                          </div>
                          <p className="text-xs text-brand-black dark:text-brand-white leading-relaxed font-medium">
                            {suggestion.text}
                          </p>
                        </div>
                      </motion.button>
                    );
                  })}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Messages Container */}
          <div className="flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto px-4 pb-4 pt-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex items-start gap-3 ${
                      message.type === "user" ? "flex-row-reverse" : ""
                    }`}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-lg ${
                        message.type === "assistant"
                          ? "bg-brand-navy-blue/15 dark:bg-brand-yellow/15"
                          : "bg-brand-blue/15"
                      }`}
                    >
                      {message.type === "assistant" ? (
                        <FileText className="w-3.5 h-3.5 text-brand-navy-blue dark:text-brand-yellow" />
                      ) : (
                        <MessageCircle className="w-3.5 h-3.5 text-brand-blue" />
                      )}
                    </div>

                    {/* Message Bubble */}
                    <div
                      className={`flex-1 max-w-2xl p-3 rounded-[16px] backdrop-blur-[12px] border ${
                        message.type === "assistant"
                          ? "bg-white/[0.12] dark:bg-white/[0.06] border-white/[0.2] dark:border-white/[0.12] shadow-[0_4px_20px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.3),inset_0_-1px_0_rgba(255,255,255,0.08),inset_0_0_15px_8px_rgba(255,255,255,0.04)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(255,255,255,0.06),inset_0_0_15px_8px_rgba(255,255,255,0.02)]"
                          : "bg-brand-navy-blue/8 dark:bg-brand-yellow/8 border-brand-navy-blue/15 dark:border-brand-yellow/15 shadow-[0_4px_20px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(255,255,255,0.08),inset_0_0_15px_8px_rgba(255,255,255,0.03)]"
                      }`}
                    >
                      <p className="text-sm text-brand-black dark:text-brand-white leading-relaxed">
                        {message.content}
                      </p>
                    </div>
                  </motion.div>
                ))}

                {/* Loading indicator */}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-7 h-7 rounded-full bg-brand-navy-blue/15 dark:bg-brand-yellow/15 flex items-center justify-center backdrop-blur-lg">
                      <FileText className="w-3.5 h-3.5 text-brand-navy-blue dark:text-brand-yellow animate-pulse" />
                    </div>
                    <div className="flex-1 max-w-2xl p-3 rounded-[16px] backdrop-blur-[12px] bg-white/[0.12] dark:bg-white/[0.06] border border-white/[0.2] dark:border-white/[0.12]">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-brand-navy-blue/30 dark:bg-brand-yellow/30 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-brand-navy-blue/30 dark:bg-brand-yellow/30 rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-brand-navy-blue/30 dark:bg-brand-yellow/30 rounded-full animate-bounce delay-200"></div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="sticky bottom-0 p-4">
            <div className="max-w-2xl mx-auto relative">
              <div className="relative rounded-[18px] backdrop-blur-[12px] bg-white/[0.2] dark:bg-white/[0.1] border border-white/[0.25] dark:border-white/[0.15] shadow-[0_6px_25px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(255,255,255,0.1),inset_0_0_15px_8px_rgba(255,255,255,0.08)] dark:shadow-[0_6px_25px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.25),inset_0_-1px_0_rgba(255,255,255,0.04),inset_0_0_15px_8px_rgba(255,255,255,0.04)]">
                <textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Pergunte sobre editais culturais, captação de recursos..."
                  rows={1}
                  className="w-full px-4 py-3 pr-12 bg-transparent border-none outline-none resize-none text-brand-black dark:text-brand-white placeholder:text-brand-black/50 dark:placeholder:text-brand-white/50 text-sm leading-relaxed max-h-28 overflow-y-auto"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full"
                >
                  <ArrowUp className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
