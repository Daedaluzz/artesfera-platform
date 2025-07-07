import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { message, stream = false } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Mensagem inválida" }, { status: 400 });
    }

    const prompt = `Você é a Daeva, uma IA especializada no mercado cultural brasileiro. Sua missão é ajudar artistas, criadores, fazedores de cultura e negócios culturais com orientações gerais sobre arte, cultura, eventos e o mercado cultural no Brasil.

Características da sua personalidade:
- Amigável e acessível
- Conhecedora do mercado cultural brasileiro
- Prática e orientada a soluções
- Empática com os desafios dos artistas
- Atualizada com tendências culturais

Responda sempre em português brasileiro e seja específica sobre o mercado cultural nacional.

Pergunta do usuário: ${message}`;

    if (stream) {
      // Create a streaming response
      const encoder = new TextEncoder();
      const readableStream = new ReadableStream({
        async start(controller) {
          try {
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
                      process.env.LLM_TEMPERATURE || "0.7"
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

            // Split content into words and stream them
            const words = content.split(" ");
            for (let i = 0; i < words.length; i++) {
              const word = words[i] + (i < words.length - 1 ? " " : "");
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ content: word })}\n\n`)
              );

              // Add a small delay between words to simulate typing
              await new Promise((resolve) => setTimeout(resolve, 50));
            }

            // Signal end of stream
            controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
            controller.close();
          } catch (error) {
            console.error("Error in streaming response:", error);

            const fallbackResponse =
              "Olá! Sou a Daeva, sua assistente especializada no mercado cultural brasileiro. No momento estou com dificuldades técnicas, tente novamente em alguns instantes.";
            const words = fallbackResponse.split(" ");

            for (let i = 0; i < words.length; i++) {
              const word = words[i] + (i < words.length - 1 ? " " : "");
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ content: word })}\n\n`)
              );
              await new Promise((resolve) => setTimeout(resolve, 50));
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
              temperature: parseFloat(process.env.LLM_TEMPERATURE || "0.7"),
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
    console.error("Error in general Daeva API:", error);

    // Fallback response
    const fallbackResponse =
      "Olá! Sou a Daeva, sua assistente especializada no mercado cultural brasileiro. Como posso ajudá-lo hoje? No momento estou com dificuldades técnicas, tente novamente em alguns instantes.";

    return NextResponse.json({ content: fallbackResponse });
  }
}
