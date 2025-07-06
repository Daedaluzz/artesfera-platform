import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { message: _message, specialization: _specialization } =
      await request.json();

    // TODO: Replace with actual LLM API call with contratos-specific prompts
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
            content: "Você é a Daeva especializada em contratos artísticos e culturais. Você é expert em elaboração, revisão e orientação sobre contratos no setor cultural, incluindo prestação de serviços artísticos, direitos autorais, colaborações criativas e aspectos jurídicos específicos do mercado cultural brasileiro."
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

    // Temporary mock response specific to contratos
    const mockResponses = [
      "Um contrato de prestação de serviços artísticos deve incluir: identificação das partes, descrição detalhada dos serviços, valor e forma de pagamento, prazo de execução, direitos autorais, cláusulas de cancelamento e foro competente.",
      "Cláusulas essenciais incluem: definição clara do escopo do trabalho, remuneração e reajustes, direitos de imagem e uso, responsabilidades de cada parte, penalidades por descumprimento e condições de rescisão.",
      "Para definir valores, considere: complexidade do trabalho, tempo de execução, custos envolvidos, experiência do profissional e padrões de mercado. O pagamento pode ser à vista, parcelado ou por etapas do projeto.",
      "Estabeleça marcos claros do projeto, prazos para cada entrega, consequências por atrasos e flexibilidade para ajustes necessários. Sempre documente mudanças por meio de aditivos contratuais.",
    ];

    const response =
      mockResponses[Math.floor(Math.random() * mockResponses.length)];

    return NextResponse.json({ content: response });
  } catch (error) {
    console.error("Error in contratos Daeva API:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
