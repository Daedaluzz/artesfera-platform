import { NextRequest, NextResponse } from "next/server";

interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export async function POST(request: NextRequest) {
  try {
    const {
      message,
      documentText,
      documentName,
      conversationHistory,
      // stream = false, // Temporarily disable streaming to debug
    } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Mensagem inválida" }, { status: 400 });
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

    console.log("Primary API Key exists:", !!process.env.LLM_API_KEY);
    console.log("Fallback API Key exists:", !!process.env.LLM_API_KEY2);
    console.log("Model:", process.env.LLM_MODEL);
    console.log("Temperature:", process.env.LLM_TEMPERATURE);

    // Helper function to make Gemini API call with a specific key
    const makeGeminiCall = async (apiKey: string, keyType: string) => {
      console.log(`Attempting API call with ${keyType} key`);

      // Build conversation contents with history
      const contents = [];

      // Add system prompt as first message
      contents.push({
        parts: [{ text: systemPrompt }],
      });

      // Add conversation history if available
      if (conversationHistory && Array.isArray(conversationHistory)) {
        (conversationHistory as ConversationMessage[]).forEach((msg) => {
          if (msg.role === "user") {
            contents.push({
              parts: [{ text: msg.content }],
            });
          } else if (msg.role === "assistant") {
            contents.push({
              parts: [{ text: msg.content }],
            });
          }
        });
      }

      // Add current user message
      contents.push({
        parts: [{ text: `Pergunta do usuário: ${message}` }],
      });

      console.log(
        `Building conversation with ${contents.length} parts (including ${
          conversationHistory?.length || 0
        } history messages)`
      );

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${process.env.LLM_MODEL}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents,
            generationConfig: {
              temperature: parseFloat(process.env.LLM_TEMPERATURE || "0.7"),
              maxOutputTokens: 4000, // Increased token limit for longer responses
              topP: 0.95, // Add topP for better generation
              topK: 40, // Add topK for more diverse responses
            },
            safetySettings: [
              {
                category: "HARM_CATEGORY_HARASSMENT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE",
              },
              {
                category: "HARM_CATEGORY_HATE_SPEECH",
                threshold: "BLOCK_MEDIUM_AND_ABOVE",
              },
              {
                category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE",
              },
              {
                category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE",
              },
            ],
          }),
        }
      );

      return { response, keyType };
    };

    // Try primary API key first, then fallback to secondary
    let geminiResponse;
    let usedKeyType = "primary";

    try {
      if (!process.env.LLM_API_KEY) {
        throw new Error("Primary API key not configured");
      }

      const result = await makeGeminiCall(process.env.LLM_API_KEY, "primary");
      geminiResponse = result.response;
      usedKeyType = result.keyType;

      if (!geminiResponse.ok) {
        const errorText = await geminiResponse.text();
        console.error("Primary API key failed:", errorText);
        throw new Error(
          `Primary API error: ${geminiResponse.status} - ${errorText}`
        );
      }
    } catch (primaryError) {
      console.warn("Primary API key failed, trying fallback:", primaryError);

      if (!process.env.LLM_API_KEY2) {
        throw new Error(
          "Fallback API key not configured and primary key failed"
        );
      }

      try {
        const result = await makeGeminiCall(
          process.env.LLM_API_KEY2,
          "fallback"
        );
        geminiResponse = result.response;
        usedKeyType = result.keyType;

        if (!geminiResponse.ok) {
          const errorText = await geminiResponse.text();
          console.error("Fallback API key also failed:", errorText);
          throw new Error(
            `Both API keys failed. Fallback error: ${geminiResponse.status} - ${errorText}`
          );
        }
      } catch (fallbackError) {
        console.error("Both API keys failed:", fallbackError);
        throw new Error("Both primary and fallback API keys failed");
      }
    }

    console.log(`Successfully used ${usedKeyType} API key`);
    console.log("Gemini response status:", geminiResponse.status);

    // Handle regular response
    const data = await geminiResponse.json();
    console.log("Gemini response data:", JSON.stringify(data, null, 2));

    const candidate = data.candidates?.[0];
    const content = candidate?.content?.parts?.[0]?.text;

    // Check for finish reason to understand why generation stopped
    const finishReason = candidate?.finishReason;
    console.log("Finish reason:", finishReason);

    if (finishReason === "MAX_TOKENS") {
      console.warn("Response truncated due to token limit");
    } else if (finishReason === "SAFETY") {
      console.warn("Response blocked by safety filters");
    }

    if (!content) {
      console.error("No content in response:", data);
      throw new Error("No content received from Gemini API");
    }

    return NextResponse.json({
      content,
      hasDocument: !!(documentText && documentName),
      documentName: documentName || null,
      finishReason: finishReason || "STOP", // Include finish reason for debugging
      usedApiKey: usedKeyType, // Include which API key was used
    });
  } catch (error) {
    console.error("Error in general Daeva API:", error);

    // Enhanced fallback response for cultural grants
    const fallbackResponse =
      "Olá! Sou a Daeva, sua assistente especializada em editais culturais e fomento à cultura. No momento estou com dificuldades técnicas, mas posso ajudá-lo com análise de editais, elaboração de projetos culturais e orientações sobre processos seletivos. Tente novamente em alguns instantes.";

    return NextResponse.json({ content: fallbackResponse });
  }
}
