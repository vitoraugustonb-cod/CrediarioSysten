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
  <img src="https://img.shields.io/badge/Code_Quality-TypeScript_Strict-blue?logo=typescript&logoColor=white" alt="TS Strict">
  <img src="https://img.shields.io/badge/Commits-Conventional%20Commits-yellow?logo=git&logoColor=white" alt="Conventional Commits">
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
  - [⚡ Diferenciais Técnicos](#-diferenciais-técnicos)
- [💻 Stack Tecnológica & Justificativas](#-stack-tecnológica--justificativas)
- [🏗️ Arquitetura em Nuvem & Camadas](#️-arquitetura-em-nuvem--camadas)
- [🐳 Execução com Docker & Docker Compose](#-execução-com-docker--docker-compose)
- [☁️ Deploy e Infraestrutura (Vercel + Supabase)](#️-deploy-e-infraestrutura-vercel--supabase)
  - [💾 Backup, Restauração e Resiliência de Dados](#3-backup-restauração-e-resiliência-de-dados)
- [🔒 Segurança & Hardening Avançado](#-segurança--hardening-avançado)
  - [🛡️ Ciclo de Vida da Sessão & Autenticação Segura](#️-ciclo-de-vida-da-sessão--autenticação-segura)
- [🌿 Estratégia de Branching (Git Flow)](#-estratégia-de-branching-git-flow)
- [🎨 Design & Usabilidade](#-design--usabilidade)
  - [📸 Demonstração Visual das Interfaces](#-demonstração-visual-das-interfaces)
  - [⌨️ Acessibilidade & Atalhos no Painel Desktop](#️-acessibilidade--atalhos-no-painel-desktop)
  - [📱 Matriz de Compatibilidade de Dispositivos & Browsers](#-matriz-de-compatibilidade-de-dispositivos--browsers)
- [⚙️ Funcionalidades Principais](#️-funcionalidades-principais)
- [📐 Regras de Negócio Financeiras](#-regras-de-negócio-financeiras)
  - [🔄 Fluxo de Liquidação Atômica de Parcela](#-fluxo-de-liquidação-atômica-de-parcela)
- [🗂️ Estrutura do Projeto](#️-estrutura-do-projeto)
- [🛠️ Como Executar Localmente](#️-como-executar-localmente)
  - [🔧 Troubleshooting (Resolução de Problemas Comuns)](#-troubleshooting-resolução-de-problemas-comuns)
- [🔐 Contas de Acesso Padrão](#-contas-de-acesso-padrão)
- [🌐 Referência da API REST](#-referência-da-api-rest)
  - [📦 Exemplos de Payloads (Request & Response)](#-exemplos-de-payloads-request--response)
  - [⚠️ Padronização de Códigos de Status HTTP & Respostas de Erro](#️-padronização-de-códigos-de-status-http--respostas-de-erro)
- [🗃️ Modelo de Dados (Prisma Schema)](#️-modelo-de-dados-prisma-schema)
- [⚙️ Variáveis de Ambiente](#️-variáveis-de-ambiente)
- [⚡ Performance e Otimizações](#-performance-e-otimizações)
- [🧪 Testes e Qualidade de Código](#-testes-e-qualidade-de-código)
- [📊 Observabilidade, Logs e Monitoramento](#-observabilidade-logs-e-monitoramento)
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

### 3. Backup, Restauração e Resiliência de Dados

Para garantir a integridade patrimonial das cobranças e continuidade do negócio:

- **Backups Automáticos Diários:** O Supabase realiza snapshots automáticos diários com retenção e integridade física.
- **Exportação Manual (Dump Completo via `pg_dump`):**
  ```bash
  # Gerar dump comprimido contendo dados e schema
  pg_dump -h db.[REF].supabase.co -U postgres -p 5432 -d postgres -F c -b -v -f crediario_backup_$(date +%Y%m%d).dump
  ```
- **Restauração em Banco de Contingência:**
  ```bash
  # Restaurar dump em uma nova base
  pg_restore -h db.[REF_NOVO].supabase.co -U postgres -p 5432 -d postgres -v -c crediario_backup_20260315.dump
  ```
- **Point-in-Time Recovery (PITR):** Suporte à restauração para qualquer segundo dos últimos 7 dias através dos registros de WAL (Write-Ahead Logging) do PostgreSQL.

### 4. Política de Retenção e Ciclo de Vida dos Registros

Para atender a conformidades fiscais e garantir auditoria retroativa sem sobrecarregar o banco de dados:

| Entidade / Registro | Período de Retenção | Política de Limpeza | Justificativa Regulatória |
| :--- | :--- | :--- | :--- |
| **Vendas & Carnês** | 5 Anos após quitação | Arquivamento histórico | Art. 174 do CTN (Prescrição tributária e fiscal) |
| **Recibos de Pagamento** | Permanente | Imutável (Somente leitura) | Comprovação jurídica de quitação de títulos |
| **Clientes Inativos** | Indefinido | Soft Delete (`ativo: false`) | Preservação da integridade referencial com vendas antigas |
| **Logs de Tentativas de Login** | 90 Dias | Expiração automática (Cron) | Detecção forense de ataques sem acúmulo de dados |
| **Sessões JWT / Cookies** | 8 Horas | Invalidação automática | Mitigação de sequestro de sessão em dispositivos móveis |

### 5. Plano de Continuidade e Disaster Recovery (RPO & RTO)

Para assegurar a operação contínua mesmo em caso de falhas severas na infraestrutura:

| Métrica | Meta Operacional | Estratégia Adotada |
| :--- | :--- | :--- |
| **RPO (Recovery Point Objective)** | **< 15 minutos** | Gravação contínua em WAL (Write-Ahead Logging) no Supabase e transações atômicas síncronas. |
| **RTO (Recovery Time Objective)** | **< 30 minutos** | Script de provisionamento rápido e restauração de schema via `prisma db push` + dump de contingência. |

```mermaid
flowchart TD
    Incidente["🚨 Incidente Detectado (Falha de Região / Queda de Banco)"] --> Triagem["1. Diagnóstico de Conectividade"]
    Triagem --> Decisao{"Supabase Operacional?"}
    Decisao -- Sim --> Reparo["Restauração via PITR para minuto anterior à falha"]
    Decisao -- Não --> Contingencia["2. Apontar DIRECT_URL / DATABASE_URL para Base Backup"]
    Contingencia --> Restore["3. pg_restore do último snapshot consolidado"]
    Restore --> Validacao["4. Validação de Integridade Contábil"]
    Reparo --> Validacao
    Validacao --> Normalizacao["✅ Operação Normalizada (Cobranças Liberadas)"]
```

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

### 🛡️ Ciclo de Vida da Sessão & Autenticação Segura

```mermaid
sequenceDiagram
    autonumber
    actor U as Usuário
    participant FE as Frontend React (SPA)
    participant RL as Rate Limiter (IP Guard)
    participant API as Auth Controller & Middleware
    participant DB as Supabase PostgreSQL

    U->>FE: Fornece e-mail e senha
    FE->>RL: POST /login (credenciais)
    alt Tentativas excedidas (> 5 em 15 min)
        RL-->>FE: 429 Too Many Requests
    else Taxa permitida
        RL->>API: Encaminha requisição
        API->>DB: Consulta usuário por e-mail
        DB-->>API: Retorna hash e status ativo
        API->>API: Compara senha e valida se ativo === true
        API-->>FE: 200 OK (Cookie httpOnly com JWT + perfil)
    end

    Note over FE,API: Requisições subsequentes autenticadas
    FE->>API: GET /clientes (Cookie enviado pelo browser)
    API->>API: authMiddleware decodifica e valida JWT
    API->>DB: Checa status ativo instantâneo
    DB-->>API: Usuário ativo confirmado
    API-->>FE: Resposta com dados autorizados
```

---

## 🛡️ Privacidade de Dados e Conformidade LGPD

O **Crediário System** foi concebido em conformidade com as diretrizes da **Lei Geral de Proteção de Dados (Lei nº 13.709/2018 - LGPD)**, garantindo a proteção dos dados cadastrais e financeiros de consumidores e colaboradores:

1. **Princípio da Minimização:**
   - Coleta restrita ao essencial para execução do contrato comercial de crediário: Nome, Telefone de Contato e Referências de Localização/Endereço.
   - Nenhum dado biométrico, sensível ou prescindível é solicitado ou armazenado no banco de dados.

2. **Segurança de Trânsito e Repouso:**
   - Toda comunicação entre cliente, API e banco opera sob túneis criptografados **TLS 1.3 / HTTPS**.
   - Conexão com o banco PostgreSQL no Supabase requer autenticação forte com credenciais protegidas em variáveis de ambiente isoladas.

3. **Direito de Acesso e Retificação:**
   - Clientes possuem direito de atualização facilitada de número telefônico e referências residenciais através do endpoint gerencial `PATCH /clientes/:id`.

4. **Trilha de Auditoria e Transparência:**
   - Cada modificação contábil ou cadastral registra a identidade do operador responsável, a estampa de tempo precisa (`timestamp`) e o histórico de estados (`dadosAnteriores` vs `dadosNovos`).

5. **Isolamento de Credenciais:**
   - Senhas de operadores são convertidas com função criptográfica de hashing unidirecional de alta complexidade (`bcrypt`) antes de serem gravadas no banco de dados.

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

### ⌨️ Acessibilidade & Atalhos no Painel Desktop

Para operadores de caixa e gerentes que buscam agilidade na rotina de escritório, o painel desktop oferece atalhos de teclado e conformidade com padrões de acessibilidade:

| Combinação de Teclas | Ação no Sistema |
| :---: | :--- |
| <kbd>/</kbd> ou <kbd>Ctrl</kbd> + <kbd>K</kbd> | Foco imediato na barra de busca global de clientes |
| <kbd>Esc</kbd> | Fechar modais ativos, gavetas de detalhes ou limpar filtros |
| <kbd>Tab</kbd> / <kbd>Shift</kbd> + <kbd>Tab</kbd> | Navegação sequencial acessível entre formulários e tabelas |
| <kbd>Alt</kbd> + <kbd>V</kbd> | Acesso direto ao fluxo de emissão de Nova Venda |
| <kbd>Enter</kbd> | Submissão rápida de pesquisas e confirmação de diálogos |

- **Contraste Visual AA:** Paleta calibrada para legibilidade superior em ambientes com variação de luminosidade.
- **Outline de Foco:** Marcadores de foco destacados (`focus-visible`) para operação 100% via teclado sem mouse.

### 📱 Matriz de Compatibilidade de Dispositivos & Browsers

O frontend responsivo é testado e homologado para os seguintes ambientes:

| Navegador / Plataforma | Suporte | Versão Mínima | Modo Recomendado |
| :--- | :---: | :---: | :--- |
| **Google Chrome (Desktop)** | ✅ Homologado | 110+ | Painel Gerencial em alta resolução |
| **Google Chrome (Android)** | ✅ Homologado | 115+ | Instalado como Atalho Web / PWA |
| **Apple Safari (iOS)** | ✅ Homologado | 16.4+ | Adicionar à Tela de Início (Full Screen) |
| **Mozilla Firefox** | ✅ Homologado | 115+ (ESR) | Modo Navegador Desktop |
| **Microsoft Edge** | ✅ Homologado | 110+ | Ambientes corporativos Windows |
| **Samsung Internet** | ✅ Homologado | 22+ | Cobrança em campo em aparelhos Samsung |

---

## ⚙️ Funcionalidades Principais

### 👥 Matriz de Controle de Acesso Baseado em Funções (RBAC)

O sistema implementa controle rígido de autorização por perfil de acesso (Role-Based Access Control) validado em cada requisição na camada de middleware:

| Recurso / Ação Operacional | Gerente (`GERENTE`) | Cobrador de Rua (`VENDEDOR_COBRADOR`) | Justificativa de Compliance |
| :--- | :---: | :---: | :--- |
| **Login com Rate Limiter** | ✅ Permitido | ✅ Permitido | Acesso unificado com auditoria por IP |
| **Consulta de Clientes & Saldo** | ✅ Total | ✅ Própria rota/geral | Necessário para atendimento em campo |
| **Cadastro de Novo Cliente** | ✅ Permitido | ✅ Permitido | Agilidade para abertura de fichas na rua |
| **Emissão de Nova Venda (Carnê)** | ✅ Permitido | ✅ Permitido | Fechamento imediato de negócios em visita |
| **Baixa de Parcela com Dupla Digitação** | ✅ Permitido | ✅ Permitido | Operação central de liquidação |
| **Ajuste Manual / Estorno de Parcela** | ✅ Exclusivo | ❌ Bloqueado | Prevenção de adulteração de valores |
| **Prorrogação de Vencimento** | ✅ Exclusivo | ❌ Bloqueado | Política de risco e negociação contratual |
| **Gestão de Operadores & Usuários** | ✅ Exclusivo | ❌ Bloqueado | Controle administrativo de credenciais |
| **Ativação / Desativação de Contas** | ✅ Exclusivo | ❌ Bloqueado | Revogação instantânea de acesso à equipe |
| **Dashboard Consolidado (KPIs)** | ✅ Total | ❌ Bloqueado | Dados estratégicos e financeiros globais |
| **Prestação de Contas da Equipe** | ✅ Todos os cobradores | ❌ Bloqueado | Auditoria do montante total arrecadado |
| **Prestação de Contas Individual** | ✅ Visualiza todos | ✅ Apenas o próprio dia | Conferência diária do dinheiro em espécie |

---

### 👤 Perfil: Gerente (Desktop)
- Dashboard financeiro em tempo real (Faturamento, Inadimplência, Projeções).
- Gestão de Usuários (criação e desativação instantânea de operadores).
- Gestão de Clientes e cálculo automático de Saldo Devedor.
- Catálogo de Produtos e precificação.
- Relatórios de prestação de contas diária da equipe.

### 🛵 Guia Operacional: Rotina Diária de Cobrança em Campo

Para garantir a eficiência operacional e a exatidão financeira na rotina de porta em porta, o cobrador segue um fluxo padronizado de 5 etapas:

```mermaid
flowchart LR
    E1["1. Abertura do Dia & Sincronização"] --> E2["2. Filtragem de Vencidos & Hoje"]
    E2 --> E3["3. Localização do Cliente na Rota"]
    E3 --> E4["4. Baixa com Dupla Digitação"]
    E4 --> E5["5. Fechamento de Caixa Diário"]
```

1. **Sincronização Matinal:** Ao efetuar login no aparelho mobile, a listagem inicial carrega automaticamente os títulos pendentes agrupados por prioridade (parcelas vencidas em destaque vermelho e vencendo no dia em amarelo).
2. **Localização e Contato:** Cada registro exibe os dados essenciais de contato, referências de endereço e saldo consolidado do cliente, permitindo confirmação rápida da identidade antes de abordar a cobrança.
3. **Liquidação Segura (Anti-Erro):** O cobrador informa o valor em dinheiro ou transferência e o sistema exige a **dupla digitação de conferência**, evitando erros por digitação rápida ou toques involuntários em tela sensível.
4. **Tratamento de Excedentes:** Caso o cliente pague um valor superior ao da parcela atual, o motor do sistema calcula e distribui o excedente como amortização na próxima parcela vincenda automaticamente.
5. **Fechamento e Prestação de Contas:** Ao final do expediente de cobrança, a tela de *Prestação de Contas Pessoal* exibe o total arrecadado no dia e a quantidade de parcelas recebidas para conferência física com a gerência.

---

### 🛵 Perfil: Vendedor / Cobrador (Mobile)
- Lista de cobranças diárias priorizada (Hoje e Atrasadas).
- Baixa rápida com conferência de segurança.
- Quitação e amortização de parcelas com cálculo automático de excedentes.
- Cadastro e consulta instantânea de clientes em campo.
- Resumo pessoal de arrecadação do dia.

### 📲 Comunicação e Comprovantes via WhatsApp

Para agilizar o atendimento em campo e reforçar a transparência com os clientes, o sistema oferece integração direta com a API de links do WhatsApp:

- **Envio Imediato de Recibo Digital:** Ao confirmar uma baixa de parcela ou quitação adiantada, o cobrador pode disparar um comprovante com mensagem pré-formatada com apenas um clique.
- **Lembrete de Vencimento:** Notificações amigáveis automáticas informando a data de vencimento da parcela e chave Pix para pagamento antecipado.
- **Formatação do Comprovante:**
  ```text
  📄 *COMPROVANTE DE PAGAMENTO - CREDIÁRIO SYSTEM*
  -----------------------------------------------
  👤 Cliente: Maria Silva
  📅 Data/Hora: 19/09/2026 às 14:32
  🔢 Parcela: 03/10
  💵 Valor Pago: R$ 150,00
  📉 Saldo Devedor Restante: R$ 1.050,00
  -----------------------------------------------
  Cobrador: Carlos Vendedor | Autenticação: #TX-98412
  Obrigado pela preferência!
  ```

---

## 📐 Regras de Negócio Financeiras

O sistema implementa lógica financeira robusta para garantir consistência das operações de crediário:

### 📖 Glossário Financeiro do Crediário

Para facilitar o entendimento de desenvolvedores, contadores e administradores, apresentamos os termos técnicos aplicados na regra de negócio:

| Termo | Definição no Sistema |
| :--- | :--- |
| **Carnê de Crediário** | Conjunto sequencial de parcelas geradas a partir de uma venda a prazo com vencimentos mensais programados. |
| **Entrada (Down Payment)** | Valor inicial pago pelo cliente no ato da compra, abatido imediatamente do saldo total financiado. |
| **Amortização em Cascata** | Aplicação automática de valores pagos a mais em relação ao valor da parcela atual diretamente sobre a parcela pendente subsequente. |
| **Parcela Parcial (`PARCIAL`)** | Parcela cujo valor recebido foi menor que o valor total estipulado; permanece ativa com saldo remanescente em aberto. |
| **Saldo Devedor Consolidado** | Soma total de todas as parcelas pendentes, atrasadas e saldos parciais de um cliente em todas as suas compras ativas. |
| **Prestação de Contas** | Relatório diário de fechamento que concilia os pagamentos recebidos por cada cobrador com o dinheiro em caixa. |
| **Liquidação Atômica** | Operação indivisível no banco de dados que garante a gravação do pagamento, atualização da parcela e criação da auditoria de forma inseparável. |
| **Dupla Digitação** | Mecanismo de segurança na interface mobile exigindo digitar e confirmar o valor recebido antes de submeter a baixa. |

---

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

#### 🔄 Fluxo de Liquidação Atômica de Parcela

```mermaid
sequenceDiagram
    autonumber
    actor C as Cobrador Mobile
    participant API as Parcela Controller
    participant TX as Prisma $transaction
    participant DB as PostgreSQL (Supabase)

    C->>API: PATCH /parcelas/:id/pagamento { valor: 150.00 }
    API->>TX: Inicia transação atômica isolada
    TX->>DB: SELECT parcela com bloqueio de concorrência
    DB-->>TX: Estado atual (status, valorTotal, valorPago)
    alt Parcela já se encontra PAGA
        TX-->>API: Aborta transação (Rollback imediato)
        API-->>C: 409 Conflict: Parcela já liquidada
    else Saldo Pendente Válido
        TX->>DB: INSERT Pagamento (valor, data, operadorId)
        alt valor >= saldoRestante (Quitação / Excedente)
            TX->>DB: UPDATE Parcela SET status = 'PAGA'
            opt Existe valor excedente
                TX->>DB: Amortiza sobra na próxima parcela pendente da venda
            end
        else Pagamento Parcial
            TX->>DB: UPDATE Parcela SET status = 'PARCIAL', valorPago += valor
        end
        TX->>DB: INSERT Auditoria (usuário, ação, timestamp, saldoAnterior)
        TX-->>API: Commit concluído com sucesso
        API-->>C: 200 OK (Parcela atualizada + confirmação)
    end
```

### 📅 Atualização Automática de Status

Um job de atualização verifica parcelas `PENDENTE` e `PARCIAL` com `dataVencimento < hoje` e as marca automaticamente como `ATRASADA`, garantindo que o dashboard de inadimplência reflita a realidade em tempo real.

### 🧾 Saldo Devedor do Cliente

O **saldo devedor consolidado** de um cliente é calculado como:
```
Saldo = Σ(valor de todas as parcelas PENDENTE, ATRASADA e PARCIAL) - Σ(valorPago das PARCIAL)
```

### 🔒 Regra de Dupla Digitação (Anti-Erro Mobile)

Na interface mobile, o cobrador precisa **confirmar o valor digitado duas vezes** antes de registrar um pagamento — prevenindo lançamentos errados por toque acidental em campo.

### 💳 Pagamento Adiantado pela Ficha do Cliente

Para proporcionar flexibilidade comercial quando o cliente deseja adiantar valores voluntariamente fora da rota diária:

- **Acesso Rápido na Aba Clientes:** O operador pesquisa o cliente pelo nome ou telefone, independentemente de haver parcelas vencendo no dia ou em atraso.
- **Liquidação por Ordem Cronológica (FIFO):** Caso o cliente pague um valor avulso sem especificar a parcela, o motor financeiro liquida a parcela pendente mais antiga em aberto, abatendo juros futuros se aplicável.
- **Abatimento no Saldo Devedor Consolidado:** O valor pago reduz imediatamente o saldo devedor do cliente em todas as visões (Painel Desktop do Gerente e Mobile do Cobrador).
- **Trilha de Auditoria:** O pagamento adiantado recebe tag `ORIGEM: FICHA_CLIENTE_ADIANTAMENTO` com ID do operador, data e hora exatas da transação.

---

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


### 🖥️ Pré-requisitos por Sistema Operacional

Antes de iniciar, certifique-se de possuir os seguintes requisitos instalados de acordo com o seu sistema operacional:

- **Node.js:** Versão 20.x LTS ou 22.x LTS ([Download](https://nodejs.org/))
- **Git:** Versão 2.40+ ([Download](https://git-scm.com/))
- **Docker & Docker Compose (Opcional):** Para execução em containers ([Download](https://www.docker.com/))

<details>
<summary><strong>Instruções para Windows (PowerShell)</strong></summary>

```powershell
# Verificar versões instaladas
node -v
npm -v
git --version

# Clonar e acessar diretório
git clone https://github.com/vitoraugustonb-cod/CrediarioSysten.git
Set-Location CrediarioSysten
git checkout develop
```
</details>

<details>
<summary><strong>Instruções para Linux (Ubuntu / Debian / Arch)</strong></summary>

```bash
# Atualizar repositórios e instalar dependências essenciais
sudo apt update && sudo apt install -y curl git build-essential

# Instalar Node.js via NVM (recomendado)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20

# Clonar repositório
git clone https://github.com/vitoraugustonb-cod/CrediarioSysten.git
cd CrediarioSysten
git checkout develop
```
</details>

<details>
<summary><strong>Instruções para macOS (Homebrew / Zsh)</strong></summary>

```zsh
# Instalação via Homebrew
brew install node git

# Clonar repositório
git clone https://github.com/vitoraugustonb-cod/CrediarioSysten.git
cd CrediarioSysten
git checkout develop
```
</details>

---

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

### 🔧 Troubleshooting (Resolução de Problemas Comuns)

| Sintoma / Erro | Causa Mais Comum | Solução Recomendada |
| :--- | :--- | :--- |
| `prepared statement does not exist` | Conexão via PgBouncer sem parâmetro | Adicione `?pgbouncer=true` ao final do `DATABASE_URL` |
| `P1001: Can't reach database server` | Senha com caracteres especiais ou IP | Codifique caracteres da senha em URL encode ou use `DIRECT_URL` |
| `CORS Error: Missing Allow Origin` | Frontend rodando em porta diferente do .env | Verifique se `FRONTEND_URL=http://localhost:5173` está no `backend/.env` |
| `Cookie não persiste após login local` | Flag `secure: true` exigindo HTTPS | Configure `NODE_ENV=development` no `.env` para permitir cookies HTTP locais |
| `prisma db push` trava ou falha | Tentativa de migrar via Pooler (6543) | Certifique-se de preencher a variável `DIRECT_URL` apontando para a porta 5432 |

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

### 📦 Exemplos de Payloads (Request & Response)

<details>
<summary><strong>POST /login — Autenticação de Operador</strong></summary>

**Request Body:**
```json
{
  "email": "gerente@crediario.com",
  "senha": "suasenhaforte"
}
```

**Response (200 OK):**
```json
{
  "usuario": {
    "id": 1,
    "nome": "Administrador Geral",
    "email": "gerente@crediario.com",
    "perfil": "GERENTE"
  },
  "message": "Autenticado com sucesso"
}
```
> O token JWT é transmitido de forma transparente via header `Set-Cookie: token=...; HttpOnly; Secure; SameSite=Lax`.
</details>

<details>
<summary><strong>POST /vendas — Emissão de Venda e Carnê Automático</strong></summary>

**Request Body:**
```json
{
  "clienteId": 4,
  "tipoVenda": "MOVEIS",
  "valorEntrada": 100.00,
  "numParcelas": 6,
  "itens": [
    { "produtoId": 2, "quantidade": 1, "precoUnitario": 700.00 }
  ]
}
```

**Response (201 Created):**
```json
{
  "id": 12,
  "clienteId": 4,
  "valorTotal": 700.00,
  "valorEntrada": 100.00,
  "numParcelas": 6,
  "parcelas": [
    { "numero": 1, "valor": 100.00, "status": "PENDENTE", "dataVencimento": "2026-04-15T00:00:00.000Z" },
    { "numero": 2, "valor": 100.00, "status": "PENDENTE", "dataVencimento": "2026-05-15T00:00:00.000Z" }
  ]
}
```
</details>

<details>
<summary><strong>PATCH /parcelas/:id/pagamento — Baixa com Dupla Conferência</strong></summary>

**Request Body:**
```json
{
  "valorPago": 100.00,
  "confirmacaoValor": 100.00
}
```

**Response (200 OK):**
```json
{
  "sucesso": true,
  "parcela": {
    "id": 35,
    "numero": 1,
    "status": "PAGA",
    "valor": 100.00,
    "valorPago": 100.00
  },
  "excedenteAmortizado": 0.00,
  "recibo": {
    "codigoAutenticacao": "AUTH-7894-B6",
    "dataPagamento": "2026-03-15T14:32:10.000Z",
    "operador": "João Silva (Cobrador)"
  }
}
```
</details>

### ⚠️ Padronização de Códigos de Status HTTP & Respostas de Erro

A API utiliza envelopes JSON estruturados para respostas de erro, permitindo tratamento padronizado no frontend e mensagens amigáveis em tela:

```json
{
  "erro": "Saldo informado inválido para quitação",
  "codigo": "FINANCIAL_VALIDATION_ERROR",
  "detalhes": [
    {
      "campo": "valorPago",
      "mensagem": "O valor informado não pode ser negativo ou nulo"
    }
  ]
}
```

### 📑 Catálogo Estruturado de Códigos de Negócio

Para além dos códigos HTTP tradicionais, a API expõe códigos semânticos padronizados no campo `codigo` do payload JSON de erro:

| Código de Negócio | HTTP | Causa Raiz | Ação Recomendada pelo Frontend |
| :--- | :---: | :--- | :--- |
| `AUTH_INVALID_CREDENTIALS` | `401` | E-mail ou senha incorretos informados no login | Exibir alerta de credenciais e focar no campo e-mail |
| `AUTH_TOKEN_EXPIRED` | `401` | Sessão expirada ou cookie httpOnly ausente | Redirecionar usuário para `/login` com aviso |
| `USER_ACCOUNT_INACTIVE` | `403` | Operador desativado pela gerência | Bloquear acesso e orientar contato com a gerência |
| `ACCESS_DENIED_ROLE` | `403` | Cobrador tentando acessar rota de administração | Exibir aviso de privilégio insuficiente |
| `FINANCIAL_VALIDATION_ERROR` | `400` | Valor negativo, zero ou entrada maior que venda | Destacar campos com validação Zod no formulário |
| `PARCELA_ALREADY_PAID` | `409` | Parcela já liquidada por outro operador | Atualizar status da parcela e notificar quitação prévia |
| `CONCURRENCY_CONFLICT` | `409` | Duas baixas disparadas simultaneamente no mesmo registro | Solicitar recarregamento dos dados para checar novo saldo |
| `CLIENTE_NOT_FOUND` | `404` | Identificador de cliente não localizado no banco | Informar que a ficha do cliente pode ter sido removida |
| `RATE_LIMIT_EXCEEDED` | `429` | Mais de 5 tentativas erradas de login em 15min | Exibir cronômetro de espera antes de nova tentativa |
| `DATABASE_CONNECTION_ERROR` | `500` | Timeout de conexão com o pooler PostgreSQL | Exibir modal de instabilidade temporária com retry |

---

| Código HTTP | Significado | Aplicação no Sistema |
| :---: | :--- | :--- |
| **`200 OK`** | Sucesso | Leitura de dados, atualizações de parcelas e relatórios |
| **`201 Created`** | Criado com Sucesso | Nova venda emitida, cliente cadastrado ou produto incluído |
| **`400 Bad Request`** | Erro de Validação | Falha de validação no schema Zod ou valor contábil inconsistente |
| **`401 Unauthorized`** | Não Autenticado | Ausência de cookie de sessão, token expirado ou inválido |
| **`403 Forbidden`** | Acesso Negado | Cobrador tentando acessar endpoints exclusivos da gerência |
| **`404 Not Found`** | Recurso Inexistente | Cliente, parcela ou produto não localizado pelo identificador |
| **`409 Conflict`** | Conflito de Estado | Concorrência: tentativa de baixar parcela que já foi liquidada |
| **`429 Too Many Requests`** | Taxa Excedida | Bloqueio de IP por exceder 5 tentativas de login em 15 minutos |
| **`500 Internal Error`** | Erro de Servidor | Falha não prevista capturada pelo middleware global de tratamento |

---




## 🗃️ Modelo de Dados (Prisma Schema)

O banco de dados é modelado com **Prisma ORM** e possui as seguintes entidades principais:

### 📊 Diagrama Entidade-Relacionamento (ERD)

O diagrama abaixo ilustra a modelagem relacional completa do banco de dados no PostgreSQL (Supabase), demonstrando cardinalidades, chaves e trilha de auditoria:

```mermaid
erDiagram
    USUARIO {
        int id PK
        string nome
        string email UK
        string senha
        PerfilUsuario perfil
        boolean ativo
        datetime criadoEm
    }

    CLIENTE {
        int id PK
        string nome
        string telefone
        string referencias
        datetime criadoEm
    }

    PRODUTO {
        int id PK
        string nome
        decimal preco
        CategoriaProduto categoria
        datetime criadoEm
    }

    VENDA {
        int id PK
        int clienteId FK
        int vendedorId FK
        decimal valorTotal
        decimal valorEntrada
        int numParcelas
        TipoVenda tipoVenda
        datetime dataVenda
    }

    ITEM_VENDA {
        int id PK
        int vendaId FK
        int produtoId FK
        int quantidade
        decimal precoUnitario
    }

    PARCELA {
        int id PK
        int vendaId FK
        int numero
        decimal valor
        decimal valorPago
        date dataVencimento
        StatusParcela status
        datetime criadoEm
    }

    PAGAMENTO {
        int id PK
        int parcelaId FK
        int vendaId FK
        int operadorId FK
        decimal valor
        datetime dataPagamento
    }

    AUDITORIA {
        int id PK
        int parcelaId FK
        int usuarioId FK
        string acao
        string dadosAnteriores
        string dadosNovos
        datetime timestamp
    }

    USUARIO ||--o{ VENDA : "emite"
    USUARIO ||--o{ PAGAMENTO : "recebe"
    USUARIO ||--o{ AUDITORIA : "registra"
    CLIENTE ||--o{ VENDA : "compra"
    VENDA ||--|{ ITEM_VENDA : "possui"
    PRODUTO ||--o{ ITEM_VENDA : "compoe"
    VENDA ||--|{ PARCELA : "gera carnet"
    VENDA ||--o{ PAGAMENTO : "recebe amortizacoes"
    PARCELA ||--o{ PAGAMENTO : "liquidada por"
    PARCELA ||--o{ AUDITORIA : "possui trilha"
```

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

### 🗄️ Indexação e Otimização no PostgreSQL

Para sustentar milhares de parcelas sem degradação de tempo de resposta em consultas de rua:

- **Índices Estratégicos:**
  - `idx_parcelas_status_vencimento`: Acelera a filtragem diária de parcelas `ATRASADA` e `PENDENTE` na rota matinal do cobrador.
  - `idx_vendas_cliente_data`: Otimiza a consulta do histórico financeiro completo e consolidação do saldo devedor por cliente.
  - `idx_pagamentos_operador_data`: Permite agregação instantânea para prestação de contas no fechamento do dia.
- **Modo Transaction do PgBouncer:** Mantém as conexões ativas apenas durante a execução de transações SQL, liberando slots imediatamente após o commit, permitindo que dezenas de instâncias serverless compartilhem um pool compacto de 15 conexões sem rejeição de tráfego.

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

### 🔍 Pirâmide de Testes e Estratégia de Homologação

O projeto adota uma matriz progressiva de testes para garantir que nenhuma alteração de código quebre as regras contábeis ou fluxos de tela:

```
       ▲
      / \      [E2E: Playwright] - Fluxo completo de venda e baixa de parcela
     /───\
    /     \    [Integração: Supertest + Vitest] - Endpoints da API com banco de teste
   /───────\
  /         \  [Unitários: Zod + Cálculos] - Matemática de rateio e juros
 /───────────\
/             \ [Estático: TypeScript Strict + ESLint + Prettier]
```

- **Testes Unitários:** Foco em funções puras de cálculo de parcelas, validação de entradas financeiras e schemas Zod.
- **Testes de Integração:** Validação da atomicidade das transações do Prisma (`$transaction`), garantindo rollback em caso de falha.
- **Auditoria Contínua:** Verificação automática de integridade referencial e tipagem semântica antes de cada commit.

---

### Como Rodar Verificações

```bash
# Verificação de tipos TypeScript
npm --prefix backend run tsc -- --noEmit

# Verificação de tipos TypeScript (Frontend)
npm --prefix frontend run tsc -- --noEmit
```

---

## 📊 Observabilidade, Logs e Monitoramento

A aplicação conta com padrões de telemetria e rastreabilidade para auditoria financeira e diagnóstico de operação:

### 1. Health Checks Automatizados
- Endpoint de monitoramento: `GET /health`
- Resposta de disponibilidade:
  ```json
  {
    "status": "ok",
    "timestamp": "2026-03-15T21:00:00.000Z",
    "database": "connected"
  }
  ```

### 2. Logs Estruturados de Auditoria
Operações financeiras críticas (baixas de cobrança, ajustes manuais e logins) emitem eventos estruturados em JSON para integração com ferramentas de análise (Vercel Logs, Logtail, Grafana Loki):

```json
{
  "level": "info",
  "timestamp": "2026-03-15T14:32:10.142Z",
  "event": "PARCELA_PAGA",
  "operadorId": 2,
  "parcelaId": 35,
  "valorRecebido": 100.00,
  "ipOrigem": "177.18.xxx.xxx"
}
```

### 3. Trilha de Auditoria Contábil (`Auditoria`)
Toda mutação nas parcelas gera um registro permanente na tabela `Auditoria` com snapshot anterior, novo estado e operador responsável, prevenindo contestações financeiras.

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

<details>
<summary><strong>5. Como funciona o estorno de um pagamento registrado incorretamente?</strong></summary>
<p>Por diretrizes de compliance contábil, operadores de rua não possuem privilégio de exclusão ou estorno. Caso ocorra inconsistência, o perfil <strong>Gerente</strong> realiza a retificação pela rota gerencial <code>PATCH /parcelas/:id/ajuste</code>, gerando rastro indelével de auditoria.</p>
</details>

<details>
<summary><strong>6. O sistema aplica juros ou encargos automáticos em parcelas vencidas?</strong></summary>
<p>O sistema segue a prática de carnê de valor de parcela contratado no ato da venda. Encargos ou descontos pontuais podem ser concedidos pelo gerente ou ajustados no fechamento da renegociação, mantendo transparência com o consumidor.</p>
</details>

<details>
<summary><strong>7. O que ocorre se a internet do cobrador oscilar durante a baixa de uma parcela?</strong></summary>
<p>A transação opera sob bloco atômico no PostgreSQL. Se o pacote de rede for interrompido antes do commit, o banco executa rollback integral. Se o commit tiver ocorrido, nova tentativa retornará o status atualizado sem debitar ou duplicar a quitação.</p>
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

### ✅ Checklist para Abertura de Pull Request

Antes de submeter o seu Pull Request apontando para a branch `develop`, confirme se todas as etapas abaixo foram cumpridas:

- [ ] **Compilação Estática:** O código compila sem erros (`npm --prefix backend run tsc -- --noEmit` e `npm --prefix frontend run tsc -- --noEmit`).
- [ ] **Conventional Commits:** Todas as mensagens de commit seguem estritamente o formato `tipo(escopo): descricao concisa`.
- [ ] **Variáveis de Ambiente:** Nenhuma chave secreta, senha, token ou arquivo `.env` foi adicionado acidentalmente ao commit.
- [ ] **Dual-Platform:** Modificações de interface foram testadas tanto no layout Desktop (gerência) quanto no Mobile (cobrador).
- [ ] **Atomicidade de Transações:** Operações financeiras com múltiplos passos utilizam obrigatoriamente `prisma.$transaction`.
- [ ] **Documentação Atualizada:** O [README.md](README.md) ou schemas associados foram atualizados refletindo as novas rotas ou regras.

---

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

## 👤 Autor & Agradecimentos

<div align="center">
  <p>Desenvolvido com dedicação por <strong>Vitor Augusto</strong>.</p>
  <p>
    <a href="https://github.com/vitoraugustonb-cod" target="_blank">
      <img src="https://img.shields.io/badge/GitHub-vitoraugustonb--cod-181717?style=for-the-badge&logo=github" alt="GitHub Profile">
    </a>
  </p>
  <p>
    <em>Agradecimentos especiais à comunidade de código aberto pelo fornecimento das tecnologias fundamentais que compõem este ecossistema: React, TypeScript, Node.js, Express, Prisma ORM, Vite, Supabase, Vercel e Docker.</em>
  </p>
</div>

---

## 📜 Licença

Distribuído sob a licença **MIT**. Consulte o arquivo `LICENSE` para mais detalhes.
