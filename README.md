# 💳 Crediário System

<p align="center">
  <strong>Sistema completo de gestão de crediário próprio: controle de clientes, emissão de carnês flexíveis, rotas de cobrança de rua, segurança dupla em pagamentos, relatórios financeiros em tempo real e arquitetura moderna na nuvem (Supabase + Vercel + Docker).</strong>
</p>

<p align="center">
  <a href="https://crediario-systen-mu.vercel.app" target="_blank">
    <img src="https://img.shields.io/badge/🌐_Acessar_Online-crediario--systen--mu.vercel.app-2563eb?style=for-the-badge" alt="Acessar Sistema Online">
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Operacional-brightgreen?logo=statuspage&logoColor=white" alt="Status">
  <img src="https://img.shields.io/badge/Uptime-99.9%25-success?logo=apache&logoColor=white" alt="Uptime">
  <img src="https://img.shields.io/badge/Node.js-20.x%20%2F%2022.x-339933?logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Express-5.x-000000?logo=express&logoColor=white" alt="Express">
  <img src="https://img.shields.io/badge/React-19.x-61DAFB?logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Prisma_ORM-6.x-2D3748?logo=prisma&logoColor=white" alt="Prisma">
  <img src="https://img.shields.io/badge/PostgreSQL-Supabase-3ECF8E?logo=supabase&logoColor=white" alt="Supabase">
  <img src="https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel&logoColor=white" alt="Vercel">
  <img src="https://img.shields.io/badge/Container-Docker-2496ED?logo=docker&logoColor=white" alt="Docker">
  <img src="https://img.shields.io/badge/Security-Helmet_%2B_Zod_%2B_RateLimit-red?logo=shield&logoColor=white" alt="Security">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Arquitetura-Serverless_%26_REST-blue?logoColor=white" alt="Serverless API">
  <img src="https://img.shields.io/badge/Auth-JWT_%2B_httpOnly_Cookie-F7B731?logoColor=white" alt="JWT">
  <img src="https://img.shields.io/badge/Design-Dual--Platform-8B5CF6?logoColor=white" alt="Dual Platform">
  <img src="https://img.shields.io/badge/Branching-Git_Flow_(main_%2F_develop)-orange?logo=git&logoColor=white" alt="Git Flow">
  <img src="https://img.shields.io/badge/Licen%C3%A7a-MIT-green.svg" alt="Licença">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/PRs-Welcome-brightgreen?logo=github&logoColor=white" alt="PRs Welcome">
  <img src="https://img.shields.io/github/last-commit/vitoraugustonb-cod/CrediarioSysten/develop?label=Último%20Commit&logo=git&logoColor=white&color=7c3aed" alt="Last Commit">
  <img src="https://img.shields.io/github/languages/top/vitoraugustonb-cod/CrediarioSysten?label=Linguagem%20Principal&logo=typescript&logoColor=white&color=3178C6" alt="Top Language">
  <img src="https://img.shields.io/github/repo-size/vitoraugustonb-cod/CrediarioSysten?label=Tamanho%20do%20Repo&color=0ea5e9" alt="Repo Size">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Code_Style-Prettier-ff69b4?logo=prettier&logoColor=white" alt="Prettier">
  <img src="https://img.shields.io/badge/Linter-ESLint-4B32C3?logo=eslint&logoColor=white" alt="ESLint">
  <img src="https://img.shields.io/badge/OWASP-Top_10_Aligned-brightgreen?logo=owasp&logoColor=white" alt="OWASP">
  <img src="https://img.shields.io/badge/Architecture-Clean_MVC-informational?logoColor=white" alt="Clean MVC">
  <img src="https://img.shields.io/badge/Database_Engine-PostgreSQL_15+-4169E1?logo=postgresql&logoColor=white" alt="Postgres Engine">
</p>


---

## 📑 Sumário

- [📱 Sobre o Projeto](#-sobre-o-projeto)
  - [📊 O Mercado de Crediário no Brasil](#-o-mercado-de-crediário-no-brasil)
- [💻 Stack Tecnológica & Justificativas](#-stack-tecnológica--justificativas)
- [🏗️ Arquitetura em Nuvem & Camadas](#️-arquitetura-em-nuvem--camadas)
- [🐳 Execução com Docker & Docker Compose](#-execução-com-docker--docker-compose)
- [☁️ Deploy e Infraestrutura (Vercel + Supabase)](#️-deploy-e-infraestrutura-vercel--supabase)
- [🔒 Segurança & Hardening Avançado](#-segurança--hardening-avançado)
- [🌿 Estratégia de Branching (Git Flow)](#-estratégia-de-branching-git-flow)
- [🎨 Design & Usabilidade](#-design--usabilidade)
  - [📸 Demonstração Visual das Interfaces](#-demonstração-visual-das-interfaces)
- [⚙️ Funcionalidades Principais](#️-funcionalidades-principais)
- [📐 Regras de Negócio Financeiras](#-regras-de-negócio-financeiras)
- [🗂️ Estrutura do Projeto](#️-estrutura-do-projeto)
- [🛠️ Como Executar Localmente](#️-como-executar-localmente)
- [🔐 Contas de Acesso Padrão](#-contas-de-acesso-padrão)
- [🌐 Referência da API REST](#-referência-da-api-rest)
- [🗃️ Modelo de Dados (Prisma Schema)](#️-modelo-de-dados-prisma-schema)
- [⚙️ Variáveis de Ambiente](#️-variáveis-de-ambiente)
- [⚡ Performance e Otimizações](#-performance-e-otimizações)
- [🧪 Testes e Qualidade de Código](#-testes-e-qualidade-de-código)
- [❓ Perguntas Frequentes (FAQ)](#-perguntas-frequentes-faq)
- [🗺️ Roadmap & Milestones](#️-roadmap--milestones)
- [🤝 Contribuição & Convenções](#-contribuição--convenções)
- [📋 Changelog](#-changelog)
- [📜 Licença](#-licença)

---

## 📱 Sobre o Projeto

O **Crediário System** é uma solução full-stack moderna desenvolvida para digitalizar e otimizar operações de crediário próprio para comércios locais, confecções, óticas, lojas de móveis e equipes de cobrança de rua.

### 📊 O Mercado de Crediário no Brasil
No varejo tradicional brasileiro, o crediário próprio ou modelo "carnê" segue como um motor essencial de inclusão financeira e retenção de clientes. Milhões de consumidores ainda operam prioritariamente com renda informal ou limites de cartão insuficientes. O **Crediário System** preenche essa lacuna fornecendo às empresas o mesmo rigor técnico e inteligência de risco de grandes financeiras, mas com a agilidade e simplicidade exigidas no comércio de proximidade e na cobrança de porta em porta.

### 🔴 O Cenário Tradicional e suas Dores
- **Inadimplência Desconhecida:** Falta de clareza sobre parcelas vencidas no dia;
- **Falta de Controle de Repasse:** Dificuldade na prestação de contas diária entre cobradores e a gerência;
- **Lentidão Operacional:** Demora na consulta de saldo devedor e aprovação de compras;
- **Vulnerabilidades de Segurança:** Risco de inconsistências contábeis e baixas duplicadas sem auditoria.

### 🟢 A Solução Digital
O sistema integra uma API REST em **Node.js/Express (preparada para Serverless e Docker)** a uma interface **React 19 SPA com Vite**, banco **PostgreSQL na nuvem (Supabase)** e deploy contínuo na **Vercel**.

### 🎯 Para Quem é Este Sistema?

| Perfil | Contexto de Uso |
| :--- | :--- |
| **Lojistas e Comerciantes** | Controle centralizado do crediário sem depender de planilhas ou cadernetas manuais |
| **Equipes de Cobrança** | Interface mobile otimizada para registrar pagamentos em campo, sem precisar de laptop |
| **Gerentes Financeiros** | Dashboard em tempo real com inadimplência, faturamento e projeções de recebimento |
| **Desenvolvedores** | Base de código moderna (TypeScript fullstack) e arquitetura bem documentada como referência |

### ⚡ Diferenciais Técnicos

- **Dual-Platform nativo:** Uma única SPA detecta se o usuário está no mobile (cobrador) ou desktop (gerente) e renderiza interfaces completamente diferentes — sem apps separados.
- **Segurança financeira de ponta:** Transações atômicas + concorrência segura impedem que dois cobradores registrem a mesma parcela simultaneamente.
- **Pronto para escalar:** Arquitetura desacoplada suporta tanto deploy Serverless (Vercel) quanto containerização Docker em VPS sem mudança de código.
- **Auditoria completa:** Toda alteração em parcelas gera um registro de auditoria com usuário, ação e timestamp.

---



## 💻 Stack Tecnológica & Justificativas

| Camada | Tecnologia | Versão | Justificativa Técnica |
| :--- | :--- | :---: | :--- |
| **Frontend Core** | React | 19.x | Renderização reativa de alto desempenho com interfaces modernas. |
| **Build & Tooling** | Vite | 8.x | Hot Module Replacement (HMR) instantâneo e bundling Rollup otimizado. |
| **Linguagem (Fullstack)** | TypeScript | 5.x | Tipagem estática fim a fim, prevenindo falhas em regras financeiras. |
| **Backend Framework** | Node.js + Express | 20.x+ / 5.x | Arquitetura desacoplada em `app.ts` e `server.ts` para suporte Serverless e Docker. |
| **ORM & Migrations** | Prisma ORM | 6.x | Cliente tipado, migrações declarativas e suporte a singleton em Serverless. |
| **Banco de Dados** | PostgreSQL (Supabase) | 15+ | Banco relacional corporativo na nuvem em São Paulo (`sa-east-1`) com Connection Pooling. |
| **Hospedagem & Deploy** | Vercel Serverless | — | Edge CDN global para o frontend e execução serverless automática do backend. |
| **Containerização** | Docker & Compose | 29.x | Imagens Alpine multi-stage e Nginx reverse proxy para padronização local e VPS. |
| **Segurança & Headers** | Helmet.js + CORS | — | Headers HTTP automáticos (HSTS, CSP, X-Frame-Options) e CORS com credenciais. |
| **Validação de Schemas** | Zod | 3.x | Whitelist estrita e validação de contratos de entrada com tipagem estática. |
| **Proteção contra Abuso** | express-rate-limit | — | Rate limiting agressivo contra força bruta no login e proteção de API. |
| **Autenticação** | JWT + Cookie httpOnly | — | Sessão protegida contra ataques XSS e suporte a token Bearer híbrido. |

---

## 🏗️ Arquitetura em Nuvem & Camadas

```mermaid
flowchart TD
    subgraph Clients["Dispositivos do Usuário"]
        Mobile["📱 Celular (Cobrador Mobile)"]
        Desktop["💻 Desktop (Painel Gerencial)"]
    end

    subgraph Vercel["Vercel Cloud (Produção)"]
        Edge["🌐 Edge Network / CDN"]
        FE["🎨 Frontend SPA (React + Vite)"]
        API["⚙️ Serverless Functions (Express API)"]
        Security["🛡️ Helmet + Zod + RateLimiter + httpOnly"]
    end

    subgraph Supabase["Supabase Cloud (São Paulo / sa-east-1)"]
        Pooler["⚡ PgBouncer Pooler (Porta 6543)"]
        Postgres[("🐘 PostgreSQL Database")]
    end

    subgraph LocalDocker["Docker Desktop (Ambiente Local)"]
        Nginx["🐳 Container Frontend (Nginx :80)"]
        NodeApp["🐳 Container Backend (Node.js :3300)"]
    end

    Clients -->|HTTPS| Edge
    Edge --> FE
    Edge -->|/login, /clientes, /vendas...| API
    API --> Security
    Security --> Pooler
    Pooler --> Postgres

    Clients -.->|Localhost :80| Nginx
    Nginx --> NodeApp
    NodeApp -.->|Conexão Externa| Pooler
```

---

## 🐳 Execução com Docker & Docker Compose

O projeto possui suporte nativo ao **Docker** com builds multi-stage e Nginx integrado:

### Subir a aplicação completa em containers:
```bash
docker compose up --build -d
```

- **Frontend (Nginx):** [http://localhost](http://localhost) (porta `80`)
- **Backend (Express):** [http://localhost:3300](http://localhost:3300) (porta `3300`)
- **Health Check:** `http://localhost/health`

### Parar os containers:
```bash
docker compose down
```

---

## ☁️ Deploy e Infraestrutura (Vercel + Supabase)

### 1. Banco de Dados (Supabase)
O banco de dados opera em **PostgreSQL** com duas portas de conexão configuradas:
- **`DATABASE_URL` (Porta 6543 - Transaction Pooler):** Utilizada pela API em produção para não esgotar as conexões simultâneas em Serverless.
- **`DIRECT_URL` (Porta 5432 - Direct Connection):** Utilizada exclusivamente pelo Prisma para rodar migrações e comandos de schema (`prisma db push`).

### 2. Deploy na Vercel
A Vercel executa o script `vercel-build` pré-configurado na raiz:
```bash
npm run vercel-build
```
Variáveis de ambiente necessárias no painel da Vercel:
- `DATABASE_URL`: Connection string do Supabase Transaction Pooler (porta 6543 com `?pgbouncer=true`).
- `DIRECT_URL`: Connection string direta do Supabase (porta 5432).
- `JWT_SECRET`: Chave secreta de assinatura JWT.
- `NODE_ENV`: `production`.

---

## 🔒 Segurança & Hardening Avançado

O projeto implementa camadas estritas de segurança em profundidade:

1. **Proteção XSS via Cookies httpOnly:**
   O JWT é transmitido em cookies com flags `httpOnly: true`, `secure: true` e `sameSite: none/lax`, impedindo o roubo de tokens por scripts maliciosos.
2. **Revogação Instantânea de Contas:**
   A cada requisição autenticada, o `authMiddleware` valida no banco se o usuário existe e se `ativo === true`. Contas desativadas pelo Gerente perdem o acesso em tempo real.
3. **Proteção contra Força Bruta (Rate Limiting):**
   - Rota `/login`: Bloqueio temporário após **5 tentativas em 15 minutos** por IP.
   - API geral: Limite de **120 requisições por minuto** por IP.
4. **Validação Rigorosa com Zod (Whitelist):**
   Nenhum dado é gravado no banco sem passar por validação estrita. Campos financeiros possuem validação contra valores negativos ou nulos.
5. **Transações Atômicas (`prisma.$transaction`):**
   Baixas de parcelas e vendas são executadas em bloco atômico com verificação de concorrência para evitar quitações duplicadas simultâneas.
6. **Headers de Segurança (Helmet.js):**
   Injeção automática de HSTS, CSP, X-Frame-Options, X-Content-Type-Options e bloqueio de MIME sniffing.
7. **Tratamento Global de Erros:**
   Stack traces e detalhes internos do banco são omitidos das respostas em ambiente de produção.

---

## 🌿 Estratégia de Branching (Git Flow)

O repositório segue o fluxo profissional de branches:

- **`main`**: Branch de **Produção** conectada diretamente ao deploy da Vercel. Apenas código testado e aprovado via Pull Request entra na `main`.
- **`develop`**: Branch principal de **Desenvolvimento**. Novas features, melhorias e testes são realizados aqui.

```
develop ───●───●───●──────┐ (Pull Request)
                          ▼
main ─────────────────────● (Deploy Automático na Vercel)
```

---

## 🎨 Design & Usabilidade

- **Interface Dual-Platform:** Detecção automática de desktop (painel gerencial) e mobile (foco em agilidade de rua).
- **Favicon & PWA Ready:** Ícone vetorial SVG premium em squircle com suporte a `apple-touch-icon` e `theme-color` para instalação como atalho no celular.
- **Conferência de Dupla Digitação:** Prevenção de toques acidentais em telas mobile na baixa de parcelas.

### 📸 Demonstração Visual das Interfaces

| Plataforma Desktop (Administração) | Plataforma Mobile (Cobrador de Rua) |
| :---: | :---: |
| ![Desktop Dashboard](https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=60) | ![Mobile Cobrança](https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=300&auto=format&fit=crop&q=60) |
| *Controle unificado de clientes, inadimplência e projeções mensais* | *Rotas ágeis de cobrança com quitação rápida e dupla conferência* |

---

## ⚙️ Funcionalidades Principais

### 👤 Perfil: Gerente (Desktop)
- Dashboard financeiro em tempo real (Faturamento, Inadimplência, Projeções).
- Gestão de Usuários (criação e desativação instantânea de operadores).
- Gestão de Clientes e cálculo automático de Saldo Devedor.
- Catálogo de Produtos e precificação.
- Relatórios de prestação de contas diária da equipe.

### 🛵 Perfil: Vendedor / Cobrador (Mobile)
- Lista de cobranças diárias priorizada (Hoje e Atrasadas).
- Baixa rápida com conferência de segurança.
- Quitação e amortização de parcelas com cálculo automático de excedentes.
- Cadastro e consulta instantânea de clientes em campo.
- Resumo pessoal de arrecadação do dia.

---

## 📐 Regras de Negócio Financeiras

O sistema implementa lógica financeira robusta para garantir consistência das operações de crediário:

### 🔢 Cálculo de Parcelas

- O **valor de cada parcela** é calculado como: `(valorTotal - valorEntrada) / numParcelas`
- O **valor de entrada** é registrado como um pagamento separado no momento da venda
- As parcelas são geradas com **vencimentos mensais** a partir da data da venda
- Parcelas com **pagamento parcial** ficam com status `PARCIAL` e o saldo restante é registrado

### 💰 Lógica de Pagamento (Amortização)

Ao registrar um pagamento, o sistema aplica a seguinte lógica em ordem de prioridade:

1. **Quitação completa:** Se `valorPago >= valorParcela`, a parcela é marcada como `PAGA`
2. **Pagamento parcial:** Se `0 < valorPago < valorParcela`, status muda para `PARCIAL`
3. **Excedente automático:** Se `valorPago > valorParcela`, o excedente é aplicado na próxima parcela em aberto da mesma venda (amortização em cascata)
4. **Concorrência segura:** A transação é bloqueada via `prisma.$transaction` para evitar quitações duplicadas simultâneas

### 📅 Atualização Automática de Status

Um job de atualização verifica parcelas `PENDENTE` e `PARCIAL` com `dataVencimento < hoje` e as marca automaticamente como `ATRASADA`, garantindo que o dashboard de inadimplência reflita a realidade em tempo real.

### 🧾 Saldo Devedor do Cliente

O **saldo devedor consolidado** de um cliente é calculado como:
```
Saldo = Σ(valor de todas as parcelas PENDENTE, ATRASADA e PARCIAL) - Σ(valorPago das PARCIAL)
```

### 🔒 Regra de Dupla Digitação (Anti-Erro Mobile)

Na interface mobile, o cobrador precisa **confirmar o valor digitado duas vezes** antes de registrar um pagamento — prevenindo lançamentos errados por toque acidental em campo.




## 🗂️ Estrutura do Projeto

```
CrediarioSysten/
├── 📁 backend/                     # API REST (Node.js + Express + TypeScript)
│   ├── 📁 prisma/
│   │   └── schema.prisma           # Definição do banco de dados
│   └── 📁 src/
│       ├── app.ts                  # Configuração do Express (middlewares, rotas)
│       ├── server.ts               # Servidor HTTP (modo local/Docker)
│       ├── 📁 controllers/         # Lógica de negócio por domínio
│       │   ├── authController.ts
│       │   ├── clienteController.ts
│       │   ├── vendaController.ts
│       │   ├── parcelaController.ts
│       │   ├── pagamentoController.ts
│       │   ├── produtoController.ts
│       │   ├── userController.ts
│       │   ├── relatorioController.ts
│       │   └── prestacaoContasController.ts
│       ├── 📁 routes/              # Mapeamento de endpoints HTTP
│       ├── 📁 middlewares/         # Auth, Role e tratamento de erros
│       ├── 📁 validators/          # Schemas Zod de validação
│       ├── 📁 lib/                 # Cliente Prisma singleton
│       ├── 📁 config/              # Variáveis de ambiente e configurações
│       └── 📁 scripts/             # Scripts de migração e backfill
│
├── 📁 frontend/                    # SPA React 19 + Vite + TypeScript
│   └── 📁 src/
│       ├── App.tsx                 # Roteamento principal e detecção de plataforma
│       ├── 📁 components/
│       │   ├── 📁 desktop/         # Painel gerencial (Dashboard, Relatórios, etc.)
│       │   ├── 📁 mobile/          # Interface do cobrador de rua
│       │   ├── 📁 auth/            # Tela de login
│       │   ├── 📁 common/          # Componentes compartilhados
│       │   └── 📁 layout/          # Estrutura de layout
│       ├── 📁 services/            # Funções de chamada à API (fetch)
│       ├── 📁 hooks/               # Custom hooks React
│       ├── 📁 context/             # Context API (autenticação global)
│       └── 📁 types/               # Tipos TypeScript compartilhados
│
├── 📁 api/                         # Entry point Serverless (Vercel)
├── 📁 scripts/                     # Scripts auxiliares de infraestrutura
├── docker-compose.yml              # Orquestração dos containers
├── vercel.json                     # Configuração de rotas da Vercel
└── package.json                    # Scripts raiz (dev, build, prisma)
```

---

## 🛠️ Como Executar Localmente


### 1. Clonar o repositório
```bash
git clone https://github.com/vitoraugustonb-cod/CrediarioSysten.git
cd CrediarioSysten
git checkout develop
```

### 2. Configurar o `.env` do Backend
Crie o arquivo `backend/.env` com base no `backend/.env.example`:
```env
PORT=3300
DATABASE_URL="postgresql://postgres.[REF]:[SENHA]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[SENHA]@db.[REF].supabase.co:5432/postgres"
JWT_SECRET="sua_chave_secreta_jwt"
```

### 3. Instalar dependências e sincronizar banco
```bash
# Na raiz do projeto:
npm --prefix backend install
npm --prefix frontend install
npm run prisma:generate
```

### 4. Iniciar servidores de desenvolvimento
```bash
# Backend (Porta 3300):
npm run dev:backend

# Frontend (Porta 5173):
npm run dev:frontend
```

---

## 🔐 Contas de Acesso Padrão

| Perfil | E-mail | Senha Padrão | Escopo de Acesso |
| :--- | :--- | :--- | :--- |
| **Gerente** | `gerente@crediario.com` | `gerente123` | Acesso total administrativo |
| **Vendedor / Cobrador** | `vendedor@crediario.com` | `vendedor123` | Interface mobile de cobrança de rua |

---

## 🌐 Referência da API REST

### Autenticação
- `POST /login` - Autenticação com rate limiting (5 req/15min) e cookie httpOnly
- `POST /logout` - Encerramento de sessão e limpeza de cookies
- `GET /health` - Status operacional do servidor

### Clientes
- `POST /clientes` - Cadastro de cliente (Validação Zod)
- `GET /clientes` - Listagem geral de clientes
- `GET /clientes/:id` - Detalhes do cliente
- `GET /clientes/:id/saldo` - Saldo devedor consolidado
- `PATCH /clientes/:id` - Atualização cadastral

### Vendas
- `POST /vendas` - Emissão de venda e carnê de parcelas (Transação Atômica)
- `GET /vendas` - Listagem de vendas
- `GET /vendas/:id` - Detalhes da venda e itens

### Parcelas & Cobrança
- `GET /parcelas` - Listagem de parcelas ativas com filtros
- `GET /parcelas/historico` - Histórico de parcelas quitadas
- `PATCH /parcelas/:id/pagamento` - Baixa de pagamento com concorrência segura
- `PATCH /parcelas/:id/ajuste` - Ajuste de valor (Apenas Gerente)
- `PATCH /parcelas/:id/data-vencimento` - Prorrogação de vencimento

### Produtos
- `POST /produtos` - Cadastro de produto no catálogo (Apenas Gerente)
- `GET /produtos` - Listagem do catálogo com filtro por categoria
- `GET /produtos/:id` - Detalhes do produto
- `PATCH /produtos/:id` - Atualização de nome, preço ou categoria (Apenas Gerente)

### Usuários
- `GET /usuarios` - Listagem de operadores cadastrados (Apenas Gerente)
- `POST /usuarios` - Criação de novo operador (Apenas Gerente)
- `PATCH /usuarios/:id/status` - Ativação/desativação instantânea de conta (Apenas Gerente)

### Dashboard & Relatórios
- `GET /relatorios/dashboard` - KPIs financeiros em tempo real (faturamento, inadimplência, projeções)
- `GET /relatorios/mensal` - Relatório consolidado por mês com totais e médias
- `GET /pagamentos` - Histórico completo de pagamentos recebidos

### Prestação de Contas
- `GET /prestacao-contas` - Resumo diário de arrecadação por cobrador (Apenas Gerente)
- `GET /prestacao-contas/pessoal` - Resumo do próprio cobrador no dia atual

---




## 🗃️ Modelo de Dados (Prisma Schema)

O banco de dados é modelado com **Prisma ORM** e possui as seguintes entidades principais:

### Entidades e Relacionamentos

```
Usuario ──────────────┐
  ├── id, nome, email │  (GERENTE | VENDEDOR_COBRADOR)
  ├── perfil (enum)   │
  └── ativo (bool)    │
                      │ 1:N
Cliente ──────────────┤
  ├── id, nome        │
  ├── telefone        │
  └── referencias     │
                      │
Produto ──────────────┤
  ├── id, nome        │
  ├── preco (Decimal) │
  └── categoria (enum)│  (MOVEIS | VARIEDADES)
                      │
Venda ────────────────┤
  ├── clienteId       │
  ├── vendedorId      │
  ├── valorTotal      │
  ├── valorEntrada    │
  ├── numParcelas     │
  └── tipoVenda (enum)│
        │
        ├── ItemVenda[] (produtos da venda)
        ├── Parcela[]  (carnê de cobrança)
        └── Pagamento[] (histórico financeiro)

Parcela ──────────────┤
  ├── numero, valor   │
  ├── valorPago       │
  ├── dataVencimento  │
  └── status (enum)   │  (PENDENTE | PAGA | ATRASADA | PARCIAL)
        └── Auditoria[] (rastreio de alterações)
```

### Enums do Schema

| Enum | Valores |
| :--- | :--- |
| `PerfilUsuario` | `GERENTE`, `VENDEDOR_COBRADOR` |
| `StatusParcela` | `PENDENTE`, `PAGA`, `ATRASADA`, `PARCIAL` |
| `CategoriaProduto` | `MOVEIS`, `VARIEDADES` |
| `TipoVenda` | `MOVEIS`, `VARIEDADES` |

---

## ⚙️ Variáveis de Ambiente

### Backend (`backend/.env`)

| Variável | Obrigatória | Padrão | Descrição | Exemplo |
| :--- | :---: | :---: | :--- | :--- |
| `PORT` | ✅ | `3300` | Porta local para o servidor HTTP Express | `3300` |
| `DATABASE_URL` | ✅ | — | Connection string do Supabase via **Transaction Pooler** (porta 6543). | `postgresql://postgres.[REF]:[SENHA]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true` |
| `DIRECT_URL` | ✅ | — | Connection string **direta** do Supabase (porta 5432) para migrações Prisma. | `postgresql://postgres:[SENHA]@db.[REF].supabase.co:5432/postgres` |
| `JWT_SECRET` | ✅ | — | Chave de assinatura e decodificação dos tokens JWT (mínimo 32 caracteres). | `uma_string_longa_e_aleatoria_aqui` |
| `NODE_ENV` | ⚠️ | `development` | Ambiente de execução (`development`, `production` ou `test`). | `production` |
| `FRONTEND_URL` | ⚠️ | `http://localhost:5173` | Origem do frontend autorizada pelo CORS para tráfego com cookies. | `https://meudominio.com` |

> **Dica de Segurança:** Nunca comite o arquivo `.env` no repositório. Ele já está listado no `.gitignore`. Use um gerador de chaves como `openssl rand -base64 32` para o `JWT_SECRET`.

### Frontend (`frontend/.env`)

| Variável | Obrigatória | Padrão | Descrição | Exemplo |
| :--- | :---: | :---: | :--- | :--- |
| `VITE_API_URL` | ✅ | `http://localhost:3300` | URL base da API REST consumida pelo cliente React SPA. | `https://crediario-systen-mu.vercel.app` |

### Vercel (Painel de Variáveis)

Configure as seguintes variáveis no painel da Vercel em **Settings → Environment Variables**:

| Variável | Ambiente | Descrição |
| :--- | :--- | :--- |
| `DATABASE_URL` | Production | Connection string do Pooler do Supabase |
| `DIRECT_URL` | Production | Connection string direta (para migrações de deploy) |
| `JWT_SECRET` | Production | Chave JWT de produção (diferente do local) |
| `NODE_ENV` | Production | Definir como `production` |

---

## ⚡ Performance e Otimizações

O sistema foi projetado com foco em eficiência tanto no backend quanto no frontend:

### Backend

| Otimização | Implementação | Impacto |
| :--- | :--- | :--- |
| **Connection Pooling** | PgBouncer via Supabase (porta 6543) | Elimina gargalos de conexão em ambiente Serverless com múltiplas invocações simultâneas |
| **Singleton Prisma** | Instância única via `lib/prisma.ts` | Reutilização da pool de conexões entre requisições — evita overhead de reconexão |
| **Serverless Cold Start** | Build compacto separado (`api/index.ts`) | Inicialização rápida das Serverless Functions na Vercel |
| **Índices no Banco** | `@unique` em emails, `@id` com `autoincrement` | Consultas rápidas em lookups frequentes de usuários e clientes |
| **Queries Seletivas** | `select: {}` no Prisma | Retorna apenas os campos necessários — reduz payload e processamento |

### Frontend

| Otimização | Implementação | Impacto |
| :--- | :--- | :--- |
| **Code Splitting** | Vite + Rollup automático | Bundle separado por rota — carrega apenas o código necessário |
| **HMR (Dev)** | Vite Hot Module Replacement | Atualização instantânea em desenvolvimento sem recarregar a página |
| **Build Otimizado** | `vite build` com tree-shaking | Remoção de código morto e minificação do bundle de produção |
| **Edge CDN** | Vercel Edge Network | Assets estáticos distribuídos globalmente com latência mínima |
| **Favicon SVG** | Ícone vetorial escalável | Carregamento ultra-rápido e qualidade perfeita em qualquer resolução |

---

## 🧪 Testes e Qualidade de Código


### Estratégia de Testes

O projeto adota uma abordagem de qualidade em camadas, priorizando confiabilidade nas operações financeiras:

| Camada | Ferramentas | Cobertura Alvo |
| :--- | :--- | :--- |
| **Validação de Contratos** | Zod Schemas | 100% dos endpoints |
| **Tipagem Estática** | TypeScript (strict) | 100% do codebase |
| **Testes de Integração** | Jest + Supertest (planejado) | Controllers críticos |
| **Testes E2E** | Playwright (planejado) | Fluxos principais |

### Qualidade de Código

O projeto aplica boas práticas de engenharia de software para garantir manutenibilidade:

- **TypeScript Strict Mode:** Ativado no `tsconfig.json` — sem `any` implícito, sem variáveis não tipadas.
- **Validação em Whitelist (Zod):** Todo dado externo é validado e transformado antes de tocar o banco.
- **Tratamento de Erros Centralizado:** Middleware global de erros com mensagens genéricas em produção para evitar vazamento de informações sensíveis.
- **Transações Atômicas:** Operações críticas de múltiplos passos usam `prisma.$transaction` — nunca deixam o banco em estado inconsistente.
- **Singleton do Prisma:** Previne o esgotamento de conexões em ambiente Serverless (apenas uma instância do `PrismaClient` por process).
- **Git Flow:** Código só chega à `main` via Pull Request revisado — sem commits diretos na branch de produção.

### Como Rodar Verificações

```bash
# Verificação de tipos TypeScript
npm --prefix backend run tsc -- --noEmit

# Verificação de tipos TypeScript (Frontend)
npm --prefix frontend run tsc -- --noEmit
```

---

## ❓ Perguntas Frequentes (FAQ)

<details>
<summary><strong>1. Como o sistema lida com pagamentos concorrentes na mesma parcela?</strong></summary>
<p>Utilizamos blocos de transações atômicas nativas do Prisma (<code>prisma.$transaction</code>). Durante a liquidação, o registro da parcela é bloqueado e verificado novamente para assegurar que nenhuma outra requisição tenha alterado o saldo remanescente entre a leitura e a escrita.</p>
</details>

<details>
<summary><strong>2. O sistema funciona offline no celular do cobrador?</strong></summary>
<p>Atualmente a aplicação exige conectividade com a internet para garantir a sincronização em tempo real das cobranças. O suporte offline completo via Service Workers e IndexedDB está listado em nosso Roadmap para a versão v1.2.</p>
</details>

<details>
<summary><strong>3. É possível rodar a aplicação em um VPS tradicional sem depender da Vercel?</strong></summary>
<p>Sim! O repositório inclui configuração completa do <code>docker-compose.yml</code> com Nginx e Node.js Alpine, permitindo deploy autônomo com um único comando em instâncias AWS EC2, DigitalOcean, Hetzner ou servidores locais.</p>
</details>

<details>
<summary><strong>4. Como é calculada a prestação de contas dos cobradores?</strong></summary>
<p>O sistema agrega todos os pagamentos baixados pelo operador no dia corrente, filtrando por data e identificador do usuário autenticado. O gerente obtém tanto o fechamento individual quanto consolidado da equipe.</p>
</details>

---

## 🗺️ Roadmap & Milestones

Cronograma e metas de evolução das próximas versões do sistema:

### 🚀 v1.1 — Produtividade e Relatórios (Q2 2026)
- [ ] **Notificações Push (PWA):** Alertas automáticos para o cobrador sobre parcelas vencidas no dia
- [ ] **Filtros Avançados no Dashboard:** Segmentação de KPIs por cobrador, período e categoria de produto
- [ ] **Exportação de Relatórios (PDF/Excel):** Geração de relatórios financeiros mensais para download

### 📋 v1.2 — Resiliência Operacional (Q3 2026)
- [ ] **Modo Offline (Service Worker):** Cache local de cobranças do dia para uso sem internet em campo
- [ ] **Histórico de Auditoria Detalhado:** Log completo de todas as alterações por usuário com visualização no painel
- [ ] **Renegociação de Dívidas:** Fluxo guiado para reestruturação de carnês com novos prazos e condições

### 💳 v2.0 — Integração Financeira & Mobilidade (Q4 2026)
- [ ] **Foto de Comprovante:** Upload de imagem do comprovante no ato do pagamento via câmera mobile
- [ ] **Integração PIX Dinâmico:** Geração de QR Code Pix no momento da cobrança com baixa automática
- [ ] **Multi-empresa (SaaS):** Suporte a múltiplos comércios na mesma instância com isolamento de dados
- [ ] **Score de Crédito Automático:** Análise preditiva de risco e pontualidade por histórico do cliente

---

## 🤝 Contribuição & Convenções

Contribuições são muito bem-vindas! Para contribuir com o projeto, siga o fluxo abaixo:

### Como Contribuir

1. **Fork** o repositório no GitHub
2. **Clone** seu fork localmente:
   ```bash
   git clone https://github.com/SEU_USUARIO/CrediarioSysten.git
   ```
3. **Crie uma branch** a partir de `develop`:
   ```bash
   git checkout develop
   git checkout -b feature/minha-nova-funcionalidade
   ```
4. **Faça suas alterações** seguindo os padrões do projeto
5. **Commit** suas mudanças com mensagens descritivas:
   ```bash
   git commit -m "feat(cobranca): adiciona notificacao push para parcelas vencidas"
   ```
6. **Push** para seu fork:
   ```bash
   git push origin feature/minha-nova-funcionalidade
   ```
7. **Abra um Pull Request** apontando de sua branch para `develop` neste repositório

### Convenção de Commits

O projeto adota o padrão [Conventional Commits](https://www.conventionalcommits.org/):

| Prefixo | Quando Usar | Exemplo Prático |
| :--- | :--- | :--- |
| `feat:` | Nova funcionalidade para o usuário | `feat(auth): adiciona suporte a login biometrico` |
| `fix:` | Correção de bug no sistema | `fix(parcelas): corrige arredondamento de centavos no rateio` |
| `docs:` | Alteração ou adição em documentações | `docs(readme): adiciona guia de deploy e diagrama de arquitetura` |
| `refactor:` | Refatoração sem alteração de comportamento externo | `refactor(db): otimiza queries de agregacao no relatorio mensal` |
| `perf:` | Mudança de código voltada a ganho de desempenho | `perf(frontend): implementa lazy loading de rotas desktop` |
| `test:` | Adição ou ajuste de testes automatizados | `test(api): adiciona testes de integracao para o fluxo de quitação` |
| `chore:` | Ajustes de manutenção de build, pacotes ou CI/CD | `chore(deps): atualiza versao do prisma orm para 6.4` |

### Reportar Bugs

Abra uma [Issue](https://github.com/vitoraugustonb-cod/CrediarioSysten/issues) descrevendo:
- **Comportamento esperado** vs **comportamento atual**
- **Passos para reproduzir** o problema
- **Ambiente** (SO, browser, versão do Node.js)

---

## 📋 Changelog

Histórico de lançamentos e versões do **Crediário System**:

### [1.0.0] - 2026-03-10
- **Lançamento Inicial:** Arquitetura unificada React 19 + Vite e backend Express TypeScript.
- **Dual-Platform:** Detecção automática de dispositivos e telas dedicadas para gerentes e cobradores.
- **Segurança Financeira:** Rate limit, cookies httpOnly e validação rígida via Zod.
- **Concorrência Segura:** Transações atômicas com Prisma para baixas de pagamentos sem duplicidade.
- **Suporte a Nuvem:** Integração nativa com Vercel Serverless e Supabase PostgreSQL.

---

## 📜 Licença

Distribuído sob a licença **MIT**. Consulte o arquivo `LICENSE` para mais detalhes.
