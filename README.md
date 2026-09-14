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

---

## 📑 Sumário

- [📱 Sobre o Projeto](#-sobre-o-projeto)
- [💻 Stack Tecnológica & Justificativas](#-stack-tecnológica--justificativas)
- [🏗️ Arquitetura em Nuvem & Camadas](#️-arquitetura-em-nuvem--camadas)
- [🐳 Execução com Docker & Docker Compose](#-execução-com-docker--docker-compose)
- [☁️ Deploy e Infraestrutura (Vercel + Supabase)](#️-deploy-e-infraestrutura-vercel--supabase)
- [🔒 Segurança & Hardening Avançado](#-segurança--hardening-avançado)
- [🌿 Estratégia de Branching (Git Flow)](#-estratégia-de-branching-git-flow)
- [🎨 Design & Usabilidade](#-design--usabilidade)
- [⚙️ Funcionalidades Principais](#️-funcionalidades-principais)
- [📐 Regras de Negócio Financeiras](#-regras-de-negócio-financeiras)
- [🗂️ Estrutura do Projeto](#️-estrutura-do-projeto)
- [🛠️ Como Executar Localmente](#️-como-executar-localmente)
- [🔐 Contas de Acesso Padrão](#-contas-de-acesso-padrão)
- [🌐 Referência da API REST](#-referência-da-api-rest)
- [🗃️ Modelo de Dados (Prisma Schema)](#️-modelo-de-dados-prisma-schema)
- [⚙️ Variáveis de Ambiente](#️-variáveis-de-ambiente)
- [📜 Licença](#-licença)

---

## 📱 Sobre o Projeto

O **Crediário System** é uma solução full-stack moderna desenvolvida para digitalizar e otimizar operações de crediário próprio para comércios locais, confecções, óticas, lojas de móveis e equipes de cobrança de rua.

### 🔴 O Cenário Tradicional e suas Dores
- **Inadimplência Desconhecida:** Falta de clareza sobre parcelas vencidas no dia;
- **Falta de Controle de Repasse:** Dificuldade na prestação de contas diária entre cobradores e a gerência;
- **Lentidão Operacional:** Demora na consulta de saldo devedor e aprovação de compras;
- **Vulnerabilidades de Segurança:** Risco de inconsistências contábeis e baixas duplicadas sem auditoria.

### 🟢 A Solução Digital
O sistema integra uma API REST em **Node.js/Express (preparada para Serverless e Docker)** a uma interface **React 19 SPA com Vite**, banco **PostgreSQL na nuvem (Supabase)** e deploy contínuo na **Vercel**.

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

| Variável | Obrigatória | Descrição | Exemplo |
| :--- | :---: | :--- | :--- |
| `PORT` | ✅ | Porta do servidor HTTP local | `3300` |
| `DATABASE_URL` | ✅ | Connection string do Supabase via **Transaction Pooler** (porta 6543). Obrigatória em produção Serverless. | `postgresql://postgres.[REF]:[SENHA]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true` |
| `DIRECT_URL` | ✅ | Connection string **direta** do Supabase (porta 5432). Usada exclusivamente pelo Prisma para migrações. | `postgresql://postgres:[SENHA]@db.[REF].supabase.co:5432/postgres` |
| `JWT_SECRET` | ✅ | Chave secreta de 256 bits para assinatura e verificação dos tokens JWT. | `uma_string_longa_e_aleatoria_aqui` |
| `NODE_ENV` | ⚠️ | Define o ambiente de execução. Afeta logs, CORS e modo de erro. | `development` \| `production` |
| `FRONTEND_URL` | ⚠️ | URL da origem do frontend (para CORS com credenciais). | `http://localhost:5173` |

> **Dica de Segurança:** Nunca comite o arquivo `.env` no repositório. Ele já está listado no `.gitignore`. Use um gerador de chaves como `openssl rand -base64 32` para o `JWT_SECRET`.

### Frontend (`frontend/.env`)

| Variável | Obrigatória | Descrição | Exemplo |
| :--- | :---: | :--- | :--- |
| `VITE_API_URL` | ✅ | URL base da API REST consumida pelo frontend. | `http://localhost:3300` |

### Vercel (Painel de Variáveis)

Configure as seguintes variáveis no painel da Vercel em **Settings → Environment Variables**:

| Variável | Ambiente | Descrição |
| :--- | :--- | :--- |
| `DATABASE_URL` | Production | Connection string do Pooler do Supabase |
| `DIRECT_URL` | Production | Connection string direta (para migrações de deploy) |
| `JWT_SECRET` | Production | Chave JWT de produção (diferente do local) |
| `NODE_ENV` | Production | Definir como `production` |

---

## 📜 Licença


Distribuído sob a licença **MIT**. Consulte o arquivo `LICENSE` para mais detalhes.
