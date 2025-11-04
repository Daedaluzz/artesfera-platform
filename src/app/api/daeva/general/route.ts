import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { message, documentText, documentName } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Mensagem inválida" }, { status: 400 });
    }

    // Build specialized prompt for cultural grants assistance
    let systemPrompt = `Você é a Daeva, uma IA especializada em editais culturais e fomento à cultura no Brasil. Sua missão é ajudar artistas, produtores culturais e fazedores de cultura a entender editais, criar projetos culturais competitivos e navegar nos processos de seleção pública.

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
- Focada em soluções viáveis`;

    // Add document context if available
    if (documentText && documentName) {
      systemPrompt += `\n\nVocê está analisando o seguinte documento: "${documentName}"

Conteúdo do documento:
${documentText}

Com base neste documento, forneça orientações específicas e práticas para o usuário.`;
    }

    systemPrompt += `\n\nResponda sempre em português brasileiro de forma clara e estruturada.

Pergunta do usuário: ${message}`;

    // Google Gemini API call
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

    if (!geminiResponse.ok) {
      throw new Error(`Gemini API error: ${geminiResponse.status}`);
    }

    const data = await geminiResponse.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!content) {
      throw new Error("No content received from Gemini API");
    }

    return NextResponse.json({ 
      content,
      hasDocument: !!(documentText && documentName),
      documentName: documentName || null
    });
  } catch (error) {
    console.error("Error in general Daeva API:", error);

    // Enhanced fallback response for cultural grants
    const fallbackResponse =
      "Olá! Sou a Daeva, sua assistente especializada em editais culturais e fomento à cultura. No momento estou com dificuldades técnicas, mas posso ajudá-lo com análise de editais, elaboração de projetos culturais e orientações sobre processos seletivos. Tente novamente em alguns instantes.";

    return NextResponse.json({ content: fallbackResponse });
  }
}
