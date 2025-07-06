import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { message, specialization } = await request.json();

    // TODO: Replace with actual LLM API call with apresentacoes-specific prompts
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
            content: "Você é a Daeva especializada em apresentações e eventos culturais. Você é expert em planejamento de eventos, produção cultural, estruturação de apresentações, engajamento de público e organização de atividades artísticas e culturais."
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

    // Temporary mock response specific to apresentacoes
    const mockResponses = [
      "Para uma apresentação cultural impactante, defina claramente seu público-alvo, escolha um formato envolvente, prepare um roteiro bem estruturado e considere elementos visuais e sonoros que complementem sua mensagem.",
      "As etapas incluem: concepção e planejamento, definição de orçamento, escolha de local e data, contratação de fornecedores, divulgação, produção, execução do evento e pós-evento (avaliação e relatórios).",
      "Calcule custos de: local, equipamentos, pessoal técnico, artistas, divulgação, segurança, limpeza, alimentação (se aplicável), licenças e seguros. Sempre inclua uma reserva de emergência de 10-15%.",
      "Para engajar o público, use: narrativa envolvente, interação direta, elementos surpresa, tecnologia quando apropriado, experiências sensoriais variadas e momentos de participação ativa da audiência.",
    ];

    const response =
      mockResponses[Math.floor(Math.random() * mockResponses.length)];

    return NextResponse.json({ content: response });
  } catch (error) {
    console.error("Error in apresentacoes Daeva API:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
