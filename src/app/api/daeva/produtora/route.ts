import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { message, stream = false } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Mensagem inválida" }, { status: 400 });
    }

    const prompt = `Você é a Daeva Produtora, uma especialista em desenvolvimento e promoção de carreiras artísticas no Brasil. Você tem conhecimento profundo sobre:

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

Pergunta do usuário: ${message}`;

    if (stream) {
      // Create a streaming response
      const encoder = new TextEncoder();
      const readableStream = new ReadableStream({
        async start(controller) {
          try {
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
                      parts: [{ text: prompt }],
                    },
                  ],
                  generationConfig: {
                    temperature: parseFloat(
                      process.env.LLM_TEMPERATURE || "0.2"
                    ),
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

            // Split content into words and stream them with better handling
            const words = content.split(/(\s+)/); // This preserves spaces and line breaks
            for (let i = 0; i < words.length; i++) {
              if (words[i].trim()) {
                // Only send non-empty words
                controller.enqueue(
                  encoder.encode(
                    `data: ${JSON.stringify({ content: words[i] })}\n\n`
                  )
                );

                // Add a small delay between words to simulate typing
                await new Promise((resolve) => setTimeout(resolve, 30));
              }
            }

            // Signal end of stream
            controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
            controller.close();
          } catch (error) {
            console.error("Error in streaming response:", error);

            const fallbackResponse =
              "Olá! Sou a Daeva especializada em produção e promoção de carreiras artísticas. No momento estou com dificuldades técnicas, tente novamente em alguns instantes.";
            const words = fallbackResponse.split(/(\s+)/);

            for (let i = 0; i < words.length; i++) {
              if (words[i].trim()) {
                controller.enqueue(
                  encoder.encode(
                    `data: ${JSON.stringify({ content: words[i] })}\n\n`
                  )
                );
                await new Promise((resolve) => setTimeout(resolve, 30));
              }
            }

            controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
            controller.close();
          }
        },
      });

      return new NextResponse(readableStream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    } else {
      // Non-streaming response (original behavior)
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
                parts: [{ text: prompt }],
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
    }
  } catch (error) {
    console.error("Error in produtora Daeva API:", error);

    // Fallback response
    const fallbackResponse =
      "Olá! Sou a Daeva especializada em produção e promoção de carreiras artísticas. Posso ajudá-lo com desenvolvimento de portfólio, estratégias de marketing, crescimento de audiência e gestão de carreira. No momento estou com dificuldades técnicas, tente novamente em alguns instantes.";

    return NextResponse.json({ content: fallbackResponse });
  }
}
