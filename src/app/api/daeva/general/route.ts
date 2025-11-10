import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(request: NextRequest) {
  try {
    const {
      message,
      documentText,
      documentName,
      stream = false,
      conversationHistory = [],
    } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Mensagem inválida" }, { status: 400 });
    }

    // Type for conversation message
    interface ConversationMessage {
      role: "user" | "assistant";
      content: string;
      timestamp?: number;
    }

    // Build specialized prompt for cultural grants assistance
    let systemPrompt = `Você é a Daeva, uma IA especializada em editais culturais e fomento à cultura no Brasil. Continue a conversa de forma natural, sem se reapresentar a cada resposta.

Suas especialidades incluem:
- Análise e interpretação de editais culturais (Lei Aldir Blanc, ProAC, editais municipais, estaduais e federais)
- Orientação para elaboração de projetos culturais
- Explicação de critérios de avaliação e pontuação
- Sugestões de melhorias em propostas
- Cronogramas e orçamentos para projetos culturais
- Documentação necessária para inscrições
- Estratégias para maximizar chances de aprovação

Características da sua comunicação:
- Clara e didática
- Prática e orientada a resultados
- Empática com os desafios dos proponentes
- Conhecedora da realidade cultural brasileira
- Focada em soluções viáveis
- Continue conversas de forma natural, sem se reapresentar

IMPORTANTE: Não se apresente novamente a cada resposta. Responda diretamente à pergunta do usuário de forma conversacional.`;

    // Add document context if available
    if (documentText && documentName) {
      systemPrompt += `\n\nVocê está analisando o seguinte documento: "${documentName}"

Conteúdo do documento:
${documentText}

Com base neste documento, forneça orientações específicas e práticas para o usuário.`;
    }

    systemPrompt += `\n\nResponda sempre em português brasileiro de forma clara e estruturada.`;

    console.log("API Key exists:", !!process.env.LLM_API_KEY);
    console.log("Model:", process.env.LLM_MODEL);
    console.log("Temperature:", process.env.LLM_TEMPERATURE);

    // Initialize Google GenAI client
    const ai = new GoogleGenAI({
      apiKey: process.env.LLM_API_KEY,
    });

    if (stream) {
      // Handle streaming response
      if (conversationHistory && conversationHistory.length > 0) {
        // Use chat interface for conversation history
        const history = (conversationHistory as ConversationMessage[]).map((msg) => ({
          role: msg.role === "assistant" ? "model" : msg.role,
          parts: [{ text: msg.content }],
        }));

        const chat = ai.chats.create({
          model: process.env.LLM_MODEL || "gemini-2.5-flash",
          history: history,
          config: {
            systemInstruction: systemPrompt,
            temperature: parseFloat(process.env.LLM_TEMPERATURE || "0.7"),
            maxOutputTokens: 4000,
            topP: 0.95,
            topK: 40,
          },
        });

        const stream = await chat.sendMessageStream({
          message: message,
        });

        // Create a readable stream
        const encoder = new TextEncoder();
        const readableStream = new ReadableStream({
          async start(controller) {
            try {
              for await (const chunk of stream) {
                const text = chunk.text || "";
                if (text) {
                  controller.enqueue(
                    encoder.encode(
                      `data: ${JSON.stringify({ content: text })}\n\n`
                    )
                  );
                }
              }
              controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
              controller.close();
            } catch (error) {
              console.error("Streaming error:", error);
              controller.error(error);
            }
          },
        });

        return new Response(readableStream, {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
          },
        });
      } else {
        // Simple streaming without conversation history
        const response = await ai.models.generateContentStream({
          model: process.env.LLM_MODEL || "gemini-2.5-flash",
          contents: message,
          config: {
            systemInstruction: systemPrompt,
            temperature: parseFloat(process.env.LLM_TEMPERATURE || "0.7"),
            maxOutputTokens: 4000,
            topP: 0.95,
            topK: 40,
          },
        });

        // Create a readable stream
        const encoder = new TextEncoder();
        const readableStream = new ReadableStream({
          async start(controller) {
            try {
              for await (const chunk of response) {
                const text = chunk.text || "";
                if (text) {
                  controller.enqueue(
                    encoder.encode(
                      `data: ${JSON.stringify({ content: text })}\n\n`
                    )
                  );
                }
              }
              controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
              controller.close();
            } catch (error) {
              console.error("Streaming error:", error);
              controller.error(error);
            }
          },
        });

        return new Response(readableStream, {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
          },
        });
      }
    } else {
      // Handle non-streaming response (existing code)
      const response = await ai.models.generateContent({
        model: process.env.LLM_MODEL || "gemini-2.5-flash",
        contents: message,
        config: {
          systemInstruction: systemPrompt,
          temperature: parseFloat(process.env.LLM_TEMPERATURE || "0.7"),
          maxOutputTokens: 4000,
          topP: 0.95,
          topK: 40,
        },
      });

      console.log("Gemini response received");

      const content = response.text;

      if (!content) {
        console.error("No content in response:", response);
        throw new Error("No content received from Gemini API");
      }

      return NextResponse.json({
        content,
        hasDocument: !!(documentText && documentName),
        documentName: documentName || null,
      });
    }
  } catch (error) {
    console.error("Error in general Daeva API:", error);

    // Enhanced fallback response for cultural grants
    const fallbackResponse =
      "Olá! Sou a Daeva. No momento estou com dificuldades técnicas, mas posso ajudá-lo com análise de editais, elaboração de projetos culturais e orientações sobre processos seletivos. Tente novamente em alguns instantes.";

    return NextResponse.json({ content: fallbackResponse });
  }
}
