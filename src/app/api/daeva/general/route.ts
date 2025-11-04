import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const {
      message,
      documentText,
      documentName,
      stream = false, // Temporarily disable streaming to debug
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

    systemPrompt += `\n\nResponda sempre em português brasileiro de forma clara e estruturada.

Pergunta do usuário: ${message}`;

    console.log("API Key exists:", !!process.env.LLM_API_KEY);
    console.log("Model:", process.env.LLM_MODEL);
    console.log("Temperature:", process.env.LLM_TEMPERATURE);

    // Google Gemini API call - simplified for debugging
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${process.env.LLM_MODEL}:generateContent?key=${process.env.LLM_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: systemPrompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: parseFloat(process.env.LLM_TEMPERATURE || "0.7"),
            maxOutputTokens: 1500,
          },
        }),
      }
    );

    console.log("Gemini response status:", geminiResponse.status);

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error("Gemini API error:", errorText);
      throw new Error(
        `Gemini API error: ${geminiResponse.status} - ${errorText}`
      );
    }

    // Handle regular response
    const data = await geminiResponse.json();
    console.log("Gemini response data:", JSON.stringify(data, null, 2));

    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!content) {
      console.error("No content in response:", data);
      throw new Error("No content received from Gemini API");
    }

    return NextResponse.json({
      content,
      hasDocument: !!(documentText && documentName),
      documentName: documentName || null,
    });
  } catch (error) {
    console.error("Error in general Daeva API:", error);

    // Enhanced fallback response for cultural grants
    const fallbackResponse =
      "Olá! Sou a Daeva, sua assistente especializada em editais culturais e fomento à cultura. No momento estou com dificuldades técnicas, mas posso ajudá-lo com análise de editais, elaboração de projetos culturais e orientações sobre processos seletivos. Tente novamente em alguns instantes.";

    return NextResponse.json({ content: fallbackResponse });
  }
}
