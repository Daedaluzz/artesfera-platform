import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "Nenhum arquivo foi enviado" },
        { status: 400 }
      );
    }

    // Check if file is PDF
    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Apenas arquivos PDF são aceitos" },
        { status: 400 }
      );
    }

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Arquivo muito grande. Limite máximo: 10MB" },
        { status: 400 }
      );
    }

    // For now, simulate successful PDF processing
    // In a real implementation, you would extract the actual text from the PDF
    const mockExtractedText = `
EDITAL PARA FOMENTO À CULTURA - LEI ALDIR BLANC

TÍTULO: Programa de Apoio a Projetos Culturais 2024

OBJETIVO: Selecionar projetos culturais que promovam a diversidade cultural brasileira e fortaleçam a economia criativa.

MODALIDADES:
- Artes Visuais: R$ 15.000 a R$ 50.000
- Música: R$ 10.000 a R$ 30.000
- Teatro e Dança: R$ 20.000 a R$ 60.000
- Literatura: R$ 5.000 a R$ 25.000
- Audiovisual: R$ 30.000 a R$ 100.000

CRITÉRIOS DE AVALIAÇÃO:
1. Relevância cultural (peso 3)
2. Viabilidade técnica (peso 2)
3. Impacto social (peso 2)
4. Cronograma de execução (peso 2)
5. Orçamento detalhado (peso 1)

DOCUMENTOS NECESSÁRIOS:
- Projeto cultural detalhado
- Cronograma de execução
- Orçamento discriminado
- Portfólio do proponente
- Certidões negativas
- Contrapartida social

PRAZO DE INSCRIÇÃO: 30 dias a partir da publicação
EXECUÇÃO: 12 meses
PRESTAÇÃO DE CONTAS: Relatório final em 30 dias após conclusão

Para mais informações, consulte o edital completo.
    `;

    return NextResponse.json({
      success: true,
      fileName: file.name,
      fileSize: file.size,
      extractedText: mockExtractedText.trim(),
      pageCount: 5, // Mock page count
    });
  } catch (error) {
    console.error("Error processing PDF:", error);
    return NextResponse.json(
      { error: "Erro ao processar o arquivo PDF" },
      { status: 500 }
    );
  }
}