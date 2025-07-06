# ArtEsfera - Ecossistema de Suporte e Fomento à Arte

## **O que é a ArtEsfera**

A **ArtEsfera** é um ecossistema digital revolucionário dedicado ao suporte, fomento e profissionalização de **todas as formas de arte**. A plataforma foi criada especificamente para artistas, criadores, fazedores de cultura e negócios culturais no Brasil.

## **Principais Funcionalidades**

### **1. Marketplace Cultural**

- **Galeria Digital**: Espaço para artistas exporem e venderem suas obras
- **Contratação de Talentos**: Conexão entre artistas e contratantes
- **Descoberta de Novos Talentos**: Vitrine para artistas emergentes ganharem visibilidade

### **2. Daeva AI - Assistente Cultural Inteligente**

A plataforma possui uma **assistente de IA especializada no mercado cultural brasileiro** com quatro especializações:

- **🎯 Daeva Geral**: Orientações gerais sobre o mercado cultural
- **📋 Daeva Editais**: Especialista em captação de recursos, elaboração de projetos para editais culturais, orçamentos e cronogramas
- **📝 Daeva Contratos**: Especialista em contratos artísticos, acordos culturais e questões jurídicas do setor
- **🎭 Daeva Apresentações**: Especialista em planejamento de eventos culturais e estruturação de apresentações

### **3. Profissionalização Artística**

- **Suporte Técnico**: Ferramentas e orientações para profissionalização
- **Capacitação**: Recursos educacionais para desenvolvimento artístico
- **Networking**: Conexão entre profissionais do setor cultural

### **4. Fomento Cultural**

- **Acesso a Editais**: Orientação sobre oportunidades de financiamento
- **Elaboração de Projetos**: Suporte na criação de projetos culturais
- **Captação de Recursos**: Estratégias para obtenção de funding

## **Para Quem é Destinada**

### **Artistas e Criadores**

- Pintores, escultores, fotógrafos
- Músicos, atores, dançarinos
- Escritores, poetas, dramaturgos
- Artistas digitais e multimídia

### **Fazedores de Cultura**

- Produtores culturais
- Curadores
- Gestores culturais
- Organizadores de eventos

### **Negócios Culturais**

- Galerias de arte
- Casas de espetáculo
- Editoras
- Gravadoras
- Empresas que contratam serviços artísticos

### **Contratantes**

- Empresas buscando talentos artísticos
- Organizadores de eventos
- Instituições culturais
- Marcas que precisam de conteúdo criativo

## **Diferenciais da Plataforma**

### **🤖 Inteligência Artificial Especializada**

- Primeira IA focada especificamente no mercado cultural brasileiro
- Conhecimento profundo sobre editais, contratos e produção cultural
- Respostas personalizadas para cada área de especialização

### **🎨 Glassmorfismo e Design Moderno**

- Interface elegante e intuitiva
- Experiência visual sofisticada
- Design responsivo para todos os dispositivos

### **🇧🇷 Foco no Mercado Brasileiro**

- Conhecimento específico da legislação cultural brasileira
- Informações sobre editais e políticas públicas nacionais
- Rede focada na realidade do artista brasileiro

### **🔗 Ecossistema Completo**

- Não é apenas um marketplace ou apenas consultoria
- Integra descoberta, contratação, profissionalização e fomento
- Ambiente único que atende todas as necessidades do setor cultural

## **Impacto e Missão**

A **ArtEsfera** tem como missão **democratizar o acesso ao mercado cultural**, oferecendo ferramentas profissionais e inteligência artificial para que artistas de todos os níveis possam:

- **Profissionalizar** suas carreiras
- **Acessar** oportunidades de financiamento
- **Conectar-se** com o mercado
- **Desenvolver** projetos culturais de qualidade
- **Navegar** com segurança pelos aspectos legais e contratuais da arte

## **Visão de Futuro**

A plataforma representa uma **revolução digital no setor cultural brasileiro**, criando um ambiente onde a arte e a tecnologia se encontram para fortalecer toda a cadeia produtiva cultural, desde o artista individual até grandes instituições culturais.

A **ArtEsfera** não é apenas uma plataforma - é um **movimento de transformação digital da cultura brasileira**.

---

## 🚀 Desenvolvimento e Tecnologia

### **Stack Tecnológico**

- **Framework**: Next.js 15 com App Router
- **Linguagem**: TypeScript
- **UI/Styling**: Tailwind CSS v4 + shadcn/ui
- **Animações**: Motion (Framer Motion)
- **Ícones**: Lucide React
- **Temas**: next-themes (modo claro/escuro)

### **Arquitetura da Aplicação**

#### **Páginas Principais**

- `/` - Landing page com seções informativas
- `/gallery` - Galeria de arte e marketplace
- `/projects` - Projetos culturais em destaque
- `/daeva` - Chat com IA especializada
- `/contact` - Formulário de contato
- `/login` e `/register` - Autenticação de usuários
- `/profile` - Perfil do usuário

#### **Sistema Daeva AI**

O sistema de IA foi arquitetado com uma abordagem modular e escalável:

```
src/app/daeva/
├── Daeva.tsx              # Interface principal dinâmica
├── page.tsx               # Wrapper Next.js
└── api/daeva/            # Rotas de API
    ├── general/route.ts   # IA geral
    ├── editais/route.ts   # Especialista em editais
    ├── contratos/route.ts # Especialista em contratos
    └── apresentacoes/route.ts # Especialista em apresentações
```

**Características técnicas:**

- Interface única que adapta conteúdo baseado em especialização
- Estado gerenciado via React hooks
- Parâmetros URL para navegação direta (`?spec=editais`)
- API routes preparadas para integração com LLM
- Sidebar responsiva com glassmorfismo

#### **Componentes UI Reutilizáveis**

```
src/components/
├── ui/                    # Componentes base shadcn
│   ├── button.tsx
│   ├── primary-button.tsx # CTA primário customizado
│   ├── secondary-button.tsx # CTA secundário customizado
│   └── ...
├── NavBar.tsx             # Navegação principal
├── Footer.tsx             # Rodapé
├── ThemeToggle.tsx        # Toggle modo claro/escuro
├── DaevaSidebar.tsx       # Sidebar do chat IA
└── [Seções da landing]    # HeroSection, FeaturesSection, etc.
```

### **Design System e Glassmorfismo**

#### **Princípios de Design**

- **Glassmorfismo**: Elementos translúcidos com backdrop-blur
- **Mobile-first**: Design responsivo começando pelo mobile
- **Acessibilidade**: ARIA labels, navegação por teclado, alto contraste
- **Animações suaves**: Spring physics com Framer Motion

#### **Paleta de Cores Brand**

Cores personalizadas definidas em `src/app/globals.css`:

```css
/* Cores principais */
--brand-yellow: #F4D03F
--brand-orange: #F39C12
--brand-pink: #E91E63
--brand-blue: #3498DB
--brand-navy-blue: #2C3E50
--brand-black: #1A1A1A
--brand-white: #FFFFFF
```

#### **Efeitos Glassmórficos Padrão**

- **Backgrounds**: `bg-white/[0.08] backdrop-blur-[12px]`
- **Bordas**: `border border-white/[0.15]`
- **Sombras**: Múltiplas camadas com inset shadows
- **Hover**: Intensificação do blur e efeitos de reflexo

### **Começando o Desenvolvimento**

#### **Pré-requisitos**

- Node.js 18+
- npm, yarn, pnpm ou bun

#### **Instalação e Execução**

```bash
# Clonar o repositório
git clone [repository-url]
cd artesfera-platform-v0.1

# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build
npm run start
```

Acesse [http://localhost:3000](http://localhost:3000) para visualizar a aplicação.

#### **Scripts Disponíveis**

```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build de produção
npm run start    # Servidor de produção
npm run lint     # Linting com ESLint
```

### **Estrutura de Arquivos**

```
artesfera-platform-v0.1/
├── public/                # Assets estáticos
│   ├── icons/            # Ícones SVG
│   ├── images/           # Imagens
│   └── favicons/         # Favicons
├── src/
│   ├── app/              # App Router (Next.js 13+)
│   │   ├── globals.css   # Estilos globais e variáveis
│   │   ├── layout.tsx    # Layout raiz
│   │   ├── page.tsx      # Landing page
│   │   └── [páginas]/    # Páginas da aplicação
│   ├── components/       # Componentes React
│   │   ├── ui/           # Componentes UI base
│   │   └── [seções]/     # Componentes de seções
│   └── lib/              # Utilitários e configurações
├── docs/                 # Documentação
│   └── daeva-architecture.md # Arquitetura do sistema Daeva
├── .github/
│   └── instructions/     # Padrões de desenvolvimento
└── package.json
```

### **Padrões de Código**

#### **Convenções**

- **Componentes**: PascalCase (ex: `HeroSection.tsx`)
- **Variáveis/Funções**: camelCase
- **Arquivos**: kebab-case quando aplicável
- **Interfaces**: Prefixo `I` quando necessário

#### **Estilo de Código**

- TypeScript obrigatório
- ESLint + Prettier configurados
- Hooks funcionais (useState, useEffect, etc.)
- Props tipadas com interfaces TypeScript

### **Integração de APIs**

#### **Sistema Daeva AI**

As rotas de API estão preparadas para integração com provedores de LLM:

```typescript
// Exemplo de integração futura
const response = await fetch("/api/daeva/editais", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    message: "Como elaborar um projeto cultural?",
    specialization: "editais",
  }),
});
```

#### **Variáveis de Ambiente**

Para produção, configurar:

```env
LLM_API_KEY=your_api_key
LLM_API_ENDPOINT=https://api.provider.com
LLM_MODEL=model-name
```

### **Deployment**

#### **Vercel (Recomendado)**

A aplicação está otimizada para deployment na Vercel:

```bash
# Deploy automático via GitHub
# ou manual via Vercel CLI
npx vercel
```

#### **Outras Plataformas**

- **Netlify**: Suporte completo para Next.js
- **AWS**: Via Serverless Next.js
- **Docker**: Containerização disponível

### **Documentação Adicional**

- **[Arquitetura Daeva](./docs/daeva-architecture.md)**: Documentação completa do sistema de IA
- **[Padrões de Código](./.github/instructions/standart.instructions.md)**: Guidelines de desenvolvimento
- **[Histórico de Mudanças](./history.md)**: Log de atualizações

### **Contribuição**

Para contribuir com o projeto:

1. Fork o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

### **Licença**

Este projeto é propriedade da ArtEsfera. Todos os direitos reservados.

---

**ArtEsfera** - Transformando a cultura brasileira através da tecnologia.
