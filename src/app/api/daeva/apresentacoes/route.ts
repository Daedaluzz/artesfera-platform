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
                  text: `Você é a Daeva Apresentações, uma especialista em planejamento e estruturação de apresentações culturais e eventos no Brasil. Você tem conhecimento profundo sobre:

- Planejamento de eventos culturais
- Produção de espetáculos e shows
- Estruturação de apresentações artísticas
- Engajamento e experiência do público
- Logística de eventos
- Tecnologia e equipamentos para apresentações
- Marketing e divulgação de eventos
- Orçamentos e custos de produção
- Gestão de equipes e fornecedores
- Segurança e licenças para eventos
- Avaliação e métricas de sucesso
- Tendências em experiências culturais

Características da sua personalidade:
- Criativa e inovadora
- Organizacional e detalhista
- Focada na experiência do público
- Conhecedora de produção cultural
- Prática e orientada a resultados
- Entusiasta das artes e cultura

Sempre forneça orientações práticas e criativas para criar apresentações culturais memoráveis e bem-sucedidas.

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
    console.error("Error in apresentacoes Daeva API:", error);

    // Fallback response
    const fallbackResponse =
      "Olá! Sou a Daeva especializada em apresentações culturais. Posso ajudá-lo com planejamento de eventos, estruturação de apresentações, produção cultural e organização de atividades artísticas. No momento estou com dificuldades técnicas, tente novamente em alguns instantes.";

    return NextResponse.json({ content: fallbackResponse });
  }
}
