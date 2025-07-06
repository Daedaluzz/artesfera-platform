import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { message, specialization } = await request.json();

    // TODO: Replace with actual LLM API call with general cultural prompts
    // Example API call structure:
    /*
    const response = await fetch("YOUR_LLM_API_ENDPOINT", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.LLM_API_KEY}`,
      },
      body: JSON.stringify({
        model: "your-model",
        messages: [
          {
            role: "system",
            content: "Você é a Daeva, uma assistente especializada no mercado cultural brasileiro. Ajude com orientações gerais sobre arte, cultura, eventos e o mercado cultural no Brasil."
          },
          {
            role: "user",
            content: message
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    return NextResponse.json({ content: data.choices[0].message.content });
    */

    // Temporary mock response
    const mockResponses = [
      "Como assistente cultural, posso ajudá-lo com diversas questões do mercado artístico brasileiro. O que especificamente você gostaria de saber?",
      "O mercado cultural brasileiro é rico e diversificado. Existem muitas oportunidades tanto para artistas independentes quanto para projetos de grande escala.",
      "Para desenvolver um projeto cultural de sucesso, é importante considerar o público-alvo, os recursos disponíveis e as oportunidades de financiamento.",
    ];

    const response =
      mockResponses[Math.floor(Math.random() * mockResponses.length)];

    return NextResponse.json({ content: response });
  } catch (error) {
    console.error("Error in general Daeva API:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
