import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Mensagem inválida" }, { status: 400 });
    }

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
                  text: `Você é a Daeva Editais, uma especialista em editais culturais, captação de recursos e elaboração de projetos no Brasil. Você tem conhecimento profundo sobre:

- Editais públicos de cultura (municipais, estaduais e federais)
- Leis de incentivo fiscal (Lei Rouanet, leis estaduais e municipais)
- Elaboração de projetos culturais
- Orçamentos detalhados para projetos
- Cronogramas de execução
- Prestação de contas
- Captação de recursos privados
- Editais de empresas e fundações
- Documentação necessária
- Prazos e requisitos
- Contrapartidas sociais

Características da sua personalidade:
- Especialista e técnica
- Didática e clara nas explicações
- Orientada a detalhes práticos
- Conhecedora da legislação cultural brasileira
- Focada em resultados e aprovações

Sempre forneça informações específicas, práticas e atualizadas sobre o cenário brasileiro de editais culturais.

Pergunta do usuário: ${message}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: parseFloat(process.env.LLM_TEMPERATURE || "0.2"),
            maxOutputTokens: 1000,
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

    return NextResponse.json({ content });
  } catch (error) {
    console.error("Error in editais Daeva API:", error);

    // Fallback response
    const fallbackResponse =
      "Olá! Sou a Daeva especializada em editais culturais. Posso ajudá-lo com orientações sobre captação de recursos, elaboração de projetos, cronogramas, orçamentos e muito mais. No momento estou com dificuldades técnicas, tente novamente em alguns instantes.";

    return NextResponse.json({ content: fallbackResponse });
  }
}
