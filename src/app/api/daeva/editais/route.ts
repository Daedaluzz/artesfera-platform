import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { message, specialization } = await request.json();

    // TODO: Replace with actual LLM API call with editais-specific prompts
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
            content: "Você é a Daeva especializada em editais culturais. Você é expert em captação de recursos, elaboração de projetos culturais, orçamentos, cronogramas, e navegação por editais públicos e privados no Brasil. Forneça orientações detalhadas e práticas sobre editais culturais."
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

    // Temporary mock response specific to editais
    const mockResponses = [
      "Para encontrar editais adequados, recomendo consultar plataformas como o Mapa Cultural, FUNARTE e sites de secretarias estaduais de cultura. É importante criar alertas para editais que se alinhem com seu perfil artístico.",
      "Um projeto para edital deve ter objetivos claros, cronograma realista, orçamento detalhado e contrapartidas sociais bem definidas. A fundamentação teórica e a viabilidade técnica são essenciais.",
      "O orçamento deve incluir custos diretos (produção, materiais, pessoal) e indiretos (administração, impostos). Sempre considere uma margem para imprevistos de 5-10% do valor total.",
      "Os prazos variam muito, mas geralmente editais ficam abertos por 30-60 dias. É crucial se organizar com antecedência e ter um banco de projetos prontos para adaptação rápida.",
    ];

    const response =
      mockResponses[Math.floor(Math.random() * mockResponses.length)];

    return NextResponse.json({ content: response });
  } catch (error) {
    console.error("Error in editais Daeva API:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
