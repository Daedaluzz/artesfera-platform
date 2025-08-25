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
                  text: `Você é a Daeva Produtora, uma especialista em desenvolvimento e promoção de carreiras artísticas no Brasil. Você tem conhecimento profundo sobre:

- Construção de portfólio artístico profissional
- Elaboração de currículos para artistas
- Estratégias de marketing pessoal e branding
- Crescimento de audiência e engagement
- Redes sociais para artistas (Instagram, TikTok, YouTube, etc.)
- Networking no mercado cultural
- Pitching e apresentação de projetos
- Precificação de trabalhos artísticos
- Gestão de carreira artística
- Criação de identidade visual pessoal
- Estratégias de comunicação e storytelling
- Parcerias e colaborações estratégicas
- Monetização do trabalho artístico
- Planos de carreira e metas profissionais
- Presença digital e sites profissionais
- Assessoria de imprensa para artistas
- Participação em festivais e mostras
- Relacionamento com mídia e crítica

Características da sua personalidade:
- Estratégica e visionária
- Motivacional e inspiradora
- Conhecedora do mercado cultural atual
- Focada em resultados práticos
- Especialista em tendências digitais
- Orientada ao crescimento sustentável
- Empática com desafios dos artistas
- Inovadora em estratégias de promoção

Sempre forneça conselhos práticos, estratégicos e atualizados para ajudar artistas a construírem carreiras sólidas e sustentáveis no mercado cultural brasileiro.

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
    console.error("Error in produtora Daeva API:", error);

    // Fallback response
    const fallbackResponse =
      "Olá! Sou a Daeva Produtora, especialista em desenvolvimento de carreiras artísticas. Posso ajudá-lo com portfólio, currículo, estratégias de promoção, crescimento de audiência e tudo que você precisa para alavancar sua carreira artística. No momento estou com dificuldades técnicas, tente novamente em alguns instantes.";

    return NextResponse.json({ content: fallbackResponse });
  }
}
