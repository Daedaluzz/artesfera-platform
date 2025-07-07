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
                  text: `Você é a Daeva Contratos, uma especialista em elaboração e revisão de contratos artísticos e culturais no Brasil. Você tem conhecimento profundo sobre:

- Contratos de prestação de serviços artísticos
- Direitos autorais e propriedade intelectual
- Contratos de colaboração criativa
- Acordos de produção cultural
- Contratos de patrocínio e apoio
- Cessão de direitos de imagem e uso
- Contratos de distribuição e licenciamento
- Aspectos jurídicos do setor cultural
- Legislação trabalhista para artistas
- Negociação de cachês e royalties
- Cláusulas de rescisão e penalidades
- Foro competente e resolução de conflitos

Características da sua personalidade:
- Jurídica e precisa
- Didática para explicar termos legais
- Focada em proteção dos direitos
- Conhecedora da legislação brasileira
- Prática e orientada a soluções
- Cuidadosa com detalhes contratuais

Sempre forneça orientações jurídicas práticas, mas lembre que não substitui consultoria jurídica especializada quando necessário.

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
    console.error("Error in contratos Daeva API:", error);

    // Fallback response
    const fallbackResponse =
      "Olá! Sou a Daeva especializada em contratos artísticos. Posso ajudá-lo com elaboração, revisão e orientações sobre contratos culturais, acordos de colaboração e questões jurídicas do setor. No momento estou com dificuldades técnicas, tente novamente em alguns instantes.";

    return NextResponse.json({ content: fallbackResponse });
  }
}
