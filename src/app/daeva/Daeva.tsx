"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Brain,
  MessageCircle,
  ArrowUp,
  Sparkles,
  FileText,
  Handshake,
  Lightbulb,
  Search,
  DollarSign,
  Calendar,
  Presentation,
  Star,
  Users,
  TrendingUp,
  Camera,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import DaevaSidebar from "@/components/DaevaSidebar";

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
}

type SpecializationType =
  | "general"
  | "editais"
  | "contratos"
  | "apresentacoes"
  | "produtora";

interface SpecializationConfig {
  title: string;
  subtitle: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  placeholder: string;
  suggestions: Array<{
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    text: string;
  }>;
  apiEndpoint: string;
  welcomeMessage: string;
}

const specializationConfigs: Record<SpecializationType, SpecializationConfig> =
  {
    general: {
      title: "Daeva AI",
      subtitle: "Sua assistente especializada no mercado cultural brasileiro",
      icon: Sparkles,
      placeholder: "Digite sua mensagem para a Daeva...",
      apiEndpoint: "/api/daeva/general",
      welcomeMessage:
        "Olá! Sou a Daeva, sua assistente especializada no mercado cultural brasileiro. Como posso ajudá-lo hoje?",
      suggestions: [
        { icon: Brain, text: "Como posso me candidatar a editais culturais?" },
        { icon: FileText, text: "Ajude-me a criar um projeto cultural" },
        {
          icon: Handshake,
          text: "Preciso de um contrato para colaboração artística",
        },
        {
          icon: Lightbulb,
          text: "Quais são as tendências do mercado cultural atual?",
        },
      ],
    },
    editais: {
      title: "Daeva Editais",
      subtitle:
        "Especialista em editais culturais, captação de recursos e elaboração de projetos",
      icon: FileText,
      placeholder: "Pergunte sobre editais culturais, captação de recursos...",
      apiEndpoint: "/api/daeva/editais",
      welcomeMessage:
        "Olá! Sou a Daeva especializada em editais culturais. Posso ajudá-lo com orientações sobre captação de recursos, elaboração de projetos, cronogramas, orçamentos e muito mais. Como posso ajudá-lo hoje?",
      suggestions: [
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
      ],
    },
    contratos: {
      title: "Daeva Contratos",
      subtitle:
        "Especialista em elaboração e revisão de contratos artísticos e culturais",
      icon: MessageCircle,
      placeholder: "Pergunte sobre contratos artísticos, acordos culturais...",
      apiEndpoint: "/api/daeva/contratos",
      welcomeMessage:
        "Olá! Sou a Daeva especializada em contratos artísticos. Posso ajudá-lo com elaboração, revisão e orientações sobre contratos culturais, acordos de colaboração e questões jurídicas do setor. Como posso ajudá-lo hoje?",
      suggestions: [
        {
          icon: FileText,
          text: "Como elaborar um contrato de prestação de serviços artísticos?",
        },
        {
          icon: Handshake,
          text: "Quais cláusulas são essenciais em contratos culturais?",
        },
        {
          icon: DollarSign,
          text: "Como definir valores e formas de pagamento em contratos?",
        },
        {
          icon: Calendar,
          text: "Como estabelecer prazos e cronogramas contratuais?",
        },
      ],
    },
    apresentacoes: {
      title: "Daeva Apresentações",
      subtitle:
        "Especialista em planejamento e estruturação de apresentações culturais",
      icon: Presentation,
      placeholder:
        "Pergunte sobre apresentações culturais, planejamento de eventos...",
      apiEndpoint: "/api/daeva/apresentacoes",
      welcomeMessage:
        "Olá! Sou a Daeva especializada em apresentações culturais. Posso ajudá-lo com planejamento de eventos, estruturação de apresentações, produção cultural e organização de atividades artísticas. Como posso ajudá-lo hoje?",
      suggestions: [
        {
          icon: Presentation,
          text: "Como planejar uma apresentação cultural impactante?",
        },
        {
          icon: Calendar,
          text: "Quais são as etapas de produção de um evento cultural?",
        },
        {
          icon: DollarSign,
          text: "Como calcular custos de produção de apresentações?",
        },
        {
          icon: Brain,
          text: "Como engajar o público em apresentações culturais?",
        },
      ],
    },
    produtora: {
      title: "Daeva Produtora",
      subtitle:
        "Especialista em desenvolvimento de carreiras artísticas e promoção profissional",
      icon: Star,
      placeholder: "Pergunte sobre carreira artística, portfólio, promoção...",
      apiEndpoint: "/api/daeva/produtora",
      welcomeMessage:
        "Olá! Sou a Daeva Produtora, especialista em desenvolvimento de carreiras artísticas. Posso ajudá-lo com portfólio, currículo, estratégias de promoção, crescimento de audiência e tudo que você precisa para alavancar sua carreira artística. Como posso ajudá-lo hoje?",
      suggestions: [
        {
          icon: FileText,
          text: "Como criar um portfólio artístico profissional?",
        },
        {
          icon: Users,
          text: "Estratégias para crescer minha audiência nas redes sociais",
        },
        {
          icon: TrendingUp,
          text: "Como precificar meus trabalhos artísticos?",
        },
        {
          icon: Camera,
          text: "Dicas para criar uma identidade visual forte",
        },
      ],
    },
  };

export default function Daeva() {
  const searchParams = useSearchParams();
  const [specialization, setSpecialization] = useState<SpecializationType>(
    (searchParams.get("spec") as SpecializationType) || "general"
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showTitle, setShowTitle] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const currentConfig = specializationConfigs[specialization];

  // Reset chat function
  const resetChat = () => {
    setMessages([]);
    setInputValue("");
    setIsLoading(false);
    setShowTitle(true);
    setHasInteracted(false);
  };

  // Handle specialization change
  const handleSpecializationChange = (newSpec: SpecializationType) => {
    setSpecialization(newSpec);
    resetChat(); // Reset chat when changing specialization
    // Update URL without page reload
    const url = new URL(window.location.href);
    if (newSpec === "general") {
      url.searchParams.delete("spec");
    } else {
      url.searchParams.set("spec", newSpec);
    }
    window.history.pushState({}, "", url.toString());
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Only scroll to bottom if there are messages and user has interacted
    if (messages.length > 0 && hasInteracted) {
      scrollToBottom();
    }
  }, [messages, hasInteracted]);

  // Dynamic API call based on specialization with streaming support
  const sendMessageToAPI = async (
    message: string,
    specialization: SpecializationType,
    onStreamChunk?: (chunk: string) => void
  ) => {
    try {
      const response = await fetch(currentConfig.apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          specialization,
          stream: !!onStreamChunk, // Enable streaming if callback provided
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from API");
      }

      // Handle streaming response
      if (onStreamChunk && response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullContent = "";

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split("\n");

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const data = line.slice(6);
                if (data === "[DONE]") {
                  return fullContent;
                }

                try {
                  const parsed = JSON.parse(data);
                  if (parsed.content) {
                    fullContent += parsed.content;
                    onStreamChunk(parsed.content);
                  }
                } catch (e) {
                  // Ignore invalid JSON lines
                }
              }
            }
          }
        } finally {
          reader.releaseLock();
        }

        return fullContent;
      } else {
        // Non-streaming response
        const data = await response.json();
        return data.content || "Desculpe, ocorreu um erro. Tente novamente.";
      }
    } catch (error) {
      console.error("API Error:", error);
      // Fallback to simulated response for now
      return currentConfig.welcomeMessage;
    }
  };

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
    const messageContent = inputValue.trim();
    setInputValue("");
    setIsLoading(true);

    try {
      // Create the assistant message placeholder
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: "",
        timestamp: new Date(),
      };

      // Add the empty assistant message to start streaming
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);

      // Call the API with streaming support
      await sendMessageToAPI(
        messageContent,
        specialization,
        (chunk: string) => {
          // Update the assistant message content as chunks arrive
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessage.id
                ? { ...msg, content: msg.content + chunk }
                : msg
            )
          );
        }
      );
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        type: "assistant",
        content: "Desculpe, ocorreu um erro. Tente novamente.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] overflow-hidden flex">
      {/* Sidebar */}
      <DaevaSidebar
        onResetChat={resetChat}
        onSpecializationChange={handleSpecializationChange}
        currentSpecialization={specialization}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
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
                className="text-center"
              >
                <div className="flex items-center justify-center gap-3 mb-4">
                  {specialization !== "general" && (
                    <div className="w-12 h-12 rounded-xl bg-brand-navy-blue/20 dark:bg-brand-yellow/20 backdrop-blur-lg flex items-center justify-center">
                      <currentConfig.icon className="w-6 h-6 text-brand-navy-blue dark:text-brand-yellow" />
                    </div>
                  )}
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-brand-black dark:text-brand-white">
                    {specialization === "general" ? (
                      <>
                        Daeva{" "}
                        <span className="text-brand-navy-blue dark:text-brand-yellow">
                          AI
                        </span>
                      </>
                    ) : (
                      <>
                        Daeva{" "}
                        <span className="text-brand-navy-blue dark:text-brand-yellow">
                          {specialization === "editais" && "Editais"}
                          {specialization === "contratos" && "Contratos"}
                          {specialization === "apresentacoes" &&
                            "Apresentações"}
                        </span>
                      </>
                    )}
                  </h1>
                </div>
                <p className="text-sm sm:text-base text-brand-black/70 dark:text-brand-white/70 max-w-xl mx-auto leading-relaxed">
                  {currentConfig.subtitle}
                </p>
              </motion.div>

              {/* Dynamic Suggestion Cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg mb-6"
              >
                {currentConfig.suggestions.map((suggestion, index) => {
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
        {messages.length > 0 && (
          <div className="flex-1 overflow-y-auto px-4 py-4">
            <div className="max-w-3xl mx-auto space-y-4">
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
                      <Sparkles className="w-3.5 h-3.5 text-brand-navy-blue dark:text-brand-yellow" />
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
                    <div className="text-sm text-brand-black dark:text-brand-white leading-relaxed">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          // Custom styling for markdown elements
                          h1: ({ ...props }) => (
                            <h1
                              className="text-lg font-bold mb-3 text-brand-navy-blue dark:text-brand-yellow"
                              {...props}
                            />
                          ),
                          h2: ({ ...props }) => (
                            <h2
                              className="text-base font-bold mb-2 text-brand-navy-blue dark:text-brand-yellow"
                              {...props}
                            />
                          ),
                          h3: ({ ...props }) => (
                            <h3
                              className="text-sm font-semibold mb-2 text-brand-navy-blue dark:text-brand-yellow"
                              {...props}
                            />
                          ),
                          p: ({ ...props }) => (
                            <p className="mb-3 last:mb-0" {...props} />
                          ),
                          ul: ({ ...props }) => (
                            <ul className="mb-3 pl-4 space-y-1" {...props} />
                          ),
                          ol: ({ ...props }) => (
                            <ol
                              className="mb-3 pl-4 space-y-1 list-decimal"
                              {...props}
                            />
                          ),
                          li: ({ ...props }) => (
                            <li className="text-sm list-disc" {...props} />
                          ),
                          strong: ({ ...props }) => (
                            <strong
                              className="font-semibold text-brand-navy-blue dark:text-brand-yellow"
                              {...props}
                            />
                          ),
                          em: ({ ...props }) => (
                            <em className="italic" {...props} />
                          ),
                          code: ({ ...props }) => (
                            <code
                              className="bg-brand-navy-blue/10 dark:bg-brand-yellow/10 px-1 py-0.5 rounded text-xs font-mono"
                              {...props}
                            />
                          ),
                          pre: ({ ...props }) => (
                            <pre
                              className="bg-brand-navy-blue/10 dark:bg-brand-yellow/10 p-3 rounded-lg text-xs font-mono overflow-x-auto mb-3"
                              {...props}
                            />
                          ),
                          blockquote: ({ ...props }) => (
                            <blockquote
                              className="border-l-2 border-brand-navy-blue/30 dark:border-brand-yellow/30 pl-4 italic mb-3"
                              {...props}
                            />
                          ),
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
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
                    <Sparkles className="w-3.5 h-3.5 text-brand-navy-blue dark:text-brand-yellow animate-pulse" />
                  </div>
                  <div className="flex-1 max-w-2xl p-3 rounded-[16px] backdrop-blur-[12px] bg-white/[0.12] dark:bg-white/[0.06] border border-white/[0.2] dark:border-white/[0.12]">
                    <div className="flex space-x-1.5">
                      <div className="w-1.5 h-1.5 bg-brand-navy-blue/40 dark:bg-brand-yellow/40 rounded-full animate-bounce" />
                      <div
                        className="w-1.5 h-1.5 bg-brand-navy-blue/40 dark:bg-brand-yellow/40 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      />
                      <div
                        className="w-1.5 h-1.5 bg-brand-navy-blue/40 dark:bg-brand-yellow/40 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Input Area */}
        <div className="flex-shrink-0 p-4">
          <div className="max-w-3xl mx-auto relative">
            <div className="relative rounded-[18px] backdrop-blur-[12px] bg-white/[0.2] dark:bg-white/[0.1] border border-white/[0.25] dark:border-white/[0.15] shadow-[0_6px_25px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(255,255,255,0.1),inset_0_0_15px_8px_rgba(255,255,255,0.08)] dark:shadow-[0_6px_25px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.25),inset_0_-1px_0_rgba(255,255,255,0.04),inset_0_0_15px_8px_rgba(255,255,255,0.04)]">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Digite sua mensagem para a Daeva..."
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

            {/* Disclaimer Text */}
            <p className="text-xs text-brand-black/80 dark:text-brand-white/80 text-center mt-2">
              A Daeva pode cometer erros. Considere verificar informações
              importantes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
