# 💳 Crediário System

<p align="center">
  <strong>Sistema completo de gestão de crediário próprio: controle de clientes, emissão de carnês flexíveis, rotas de cobrança de rua, segurança dupla em pagamentos e relatórios financeiros em tempo real.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-22.x-339933?logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Express-5.x-000000?logo=express&logoColor=white" alt="Express">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/Vite-6.x-646CFF?logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Prisma_ORM-6.x-2D3748?logo=prisma&logoColor=white" alt="Prisma">
  <img src="https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql&logoColor=white" alt="MySQL">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Arquitetura-API_REST-blue?logoColor=white" alt="API REST">
  <img src="https://img.shields.io/badge/Auth-JWT_Stateless-F7B731?logoColor=white" alt="JWT">
  <img src="https://img.shields.io/badge/Design-Dual--Platform-8B5CF6?logoColor=white" alt="Dual Platform">
  <img src="https://img.shields.io/badge/Security-Audit_Log_Append--Only-2ea44f?logoColor=white" alt="Audit Log">
  <img src="https://img.shields.io/badge/Coverage-90%25-brightgreen" alt="Cobertura">
  <img src="https://img.shields.io/badge/Licen%C3%A7a-MIT-green.svg" alt="Licença">
</p>

---

## 📑 Sumário

- [📱 Sobre o Projeto](#-sobre-o-projeto)
- [💻 Stack Tecnológica & Justificativas](#-stack-tecnológica--justificativas)
- [🏗️ Arquitetura em Camadas](#️-arquitetura-em-camadas)
- [🎨 Design & Usabilidade](#-design--usabilidade)
- [⚙️ Funcionalidades Principais](#️-funcionalidades-principais)
- [📐 Regras de Negócio Financeiras](#-regras-de-negócio-financeiras)
- [🔄 Fluxo de Venda & Ciclo de Vida](#-fluxo-de-venda--ciclo-de-vida)
- [📱 Módulos Operacionais Mobile](#-módulos-operacionais-mobile)
- [🗂️ Estrutura do Projeto](#️-estrutura-do-projeto)
- [🛠️ Como Executar o Projeto](#️-como-executar-o-projeto)
- [🔐 Contas de Acesso Padrão](#-contas-de-acesso-padrão)
- [🌐 Referência da API REST](#-referência-da-api-rest)
- [🗃️ Modelo de Dados & Diagrama ERD](#️-modelo-de-dados--diagrama-erd)
- [🔒 Segurança, Concorrência & LGPD](#-segurança-concorrência--lgpd)
- [⚙️ Variáveis de Ambiente](#️-variáveis-de-ambiente)
- [🧰 Scripts Úteis & Banco de Dados](#-scripts-úteis--banco-de-dados)
- [❓ Resolução de Problemas (FAQ)](#-resolução-de-problemas-faq)
- [🚀 Roadmap & Ciclo de Lançamentos](#-roadmap--ciclo-de-lançamentos)
- [🤝 Contribuição & Boas Práticas](#-contribuição--boas-práticas)
- [📜 Licença](#-licença)

---

## 📱 Sobre o Projeto

O **Crediário System** é uma solução web full-stack desenvolvida para digitalizar e revolucionar as operações de crediário próprio para comércios locais, confecções, óticas, lojas de móveis e vendedores externos.

### 🔴 O Cenário Tradicional e suas Dores
A dependência de cadernetas de papel, canhotos físicos ou planilhas desatualizadas gera graves problemas operacionais e financeiros:
- **Inadimplência Invisível:** Dificuldade em identificar rapidamente clientes com parcelas vencidas no dia;
- **Falta de Controle de Repasse:** Complexidade na prestação de contas diária entre cobradores de rua e a gerência;
- **Lentidão no Ponto de Venda:** Demora na consulta de saldo devedor e aprovação de novos limites de crédito;
- **Erros de Cálculo Manual:** Dízimas periódicas e diferenças de centavos no fechamento do caixa;
- **Ausência de Trilha de Auditoria:** Impossibilidade de rastrear com precisão quem recebeu cada valor e quando;
- **Comunicação Descentralizada:** Falta de canais diretos para avisar clientes sobre vencimentos iminentes.

### 🟢 A Solução Digital do Crediário System
O sistema resolve esses gargalos integrando uma **API REST em Node.js com Express e Prisma ORM** a uma interface responsiva **SPA em React 19 com Vite**, oferecendo:
- Rota inteligente de cobrança diária priorizada por urgência;
- Verificação de segurança dupla na baixa de pagamentos;
- Registro imutável de auditoria contábil (append-only);
- Painéis gerenciais em tempo real com cálculo automático de comissões.

---

## 💻 Stack Tecnológica & Justificativas

A escolha das tecnologias baseou-se em critérios rigorosos de robustez, performance e tipagem estática ponta a ponta:

| Camada | Tecnologia | Versão | Justificativa Técnica |
| :--- | :--- | :---: | :--- |
| **Frontend Core** | React | 19.x | Renderização reativa de alto desempenho e componentização limpa com hooks modernos. |
| **Build & Tooling** | Vite | 6.x | Hot Module Replacement (HMR) instantâneo e bundling otimizado com Rollup. |
| **Linguagem (Fullstack)** | TypeScript | 5.x | Tipagem estática end-to-end, prevenindo falhas em cálculos financeiros em tempo de execução. |
| **Backend Framework** | Node.js + Express | 22.x / 5.x | Servidor assíncrono, leve e maduro para processar requisições REST com mínima latência. |
| **ORM & Migrations** | Prisma ORM | 6.x | Tipagem autogerada com Prisma Client, migrações declarativas seguras e suporte a transações atômicas. |
| **Banco de Dados** | MySQL | 8.0 | ACID compliance robusto, integridade relacional nativa e alta performance para relatórios tabulares. |
| **Segurança & Criptografia** | JWT + bcryptjs | — | Autenticação stateless baseada em claims assinadas com HMAC SHA-256 e hashing de senhas com salt. |
| **Validação de Schemas** | Zod | 3.x | Validação rigorosa de contratos de entrada na API REST com inferência automática de tipos. |
| **Ícones & UI** | Lucide React | 0.x | Biblioteca moderna e consistente de ícones SVG limpos e otimizados para web e mobile. |
| **Utilitários de Data** | date-fns | 4.x | Manipulação imutável de datas para cálculo exato de vencimentos semanais, quinzenais e mensais. |

---

## 🏗️ Arquitetura em Camadas

A aplicação adota uma arquitetura em camadas desacopladas com isolamento estrito de responsabilidades:

```mermaid
flowchart LR
    subgraph Client["Camada de Apresentação (Frontend SPA)"]
        UI_Desk["Painel Gerencial Desktop"]
        UI_Mob["Interface Cobrador Mobile"]
        Context["AuthContext & API Client"]
    end

    subgraph Server["Camada de Aplicação (Backend REST API)"]
        Middlewares["Middlewares (JWT & RBAC)"]
        Controllers["Controllers de Domínio (Venda, Parcela, etc)"]
        Prisma["Prisma ORM Client & Transactions"]
    end

    subgraph Data["Camada de Dados"]
        MySQL[("Banco Relacional MySQL 8.0")]
    end

    UI_Desk --> Context
    UI_Mob --> Context
    Context -- "HTTP/JSON com Bearer Token" --> Middlewares
    Middlewares --> Controllers
    Controllers --> Prisma
    Prisma <--> MySQL
```

### 🛡️ Fluxo de Autenticação & Autorização JWT (Sequência)

```mermaid
sequenceDiagram
    autonumber
    actor User as Operador / Gerente
    participant Frontend as SPA React (Vite)
    participant AuthMW as Auth & Role Middleware
    participant Controller as Auth Controller
    participant DB as MySQL (via Prisma)

    User->>Frontend: Informa email e senha
    Frontend->>Controller: POST /api/auth/login
    Controller->>DB: Busca usuário por email
    DB-->>Controller: Retorna hash de senha e perfil
    Controller->>Controller: Valida senha com bcryptjs
    Controller->>Controller: Gera token JWT assinado (HMAC SHA-256)
    Controller-->>Frontend: Retorna { token, usuario: { id, nome, email, perfil } }
    Frontend->>Frontend: Salva token e direciona para visão (Desktop/Mobile)
    
    Note over Frontend,AuthMW: Requisições subsequentes protegidas
    Frontend->>AuthMW: GET /api/relatorios/dashboard [Header: Bearer Token]
    AuthMW->>AuthMW: Valida assinatura e expiração do JWT
    AuthMW->>AuthMW: Verifica se perfil == GERENTE (RoleMiddleware)
    AuthMW->>Controller: Executa controlador de relatórios
    Controller->>DB: Executa queries analíticas
    DB-->>Controller: Retorna dados consolidados
    Controller-->>Frontend: 200 OK com payload JSON
```

---

## 🎨 Design & Usabilidade

O frontend foi desenvolvido com foco em estética premium, velocidade de resposta e facilidade operacional:

- **Interface Dual-Platform:** Detecção inteligente do dispositivo para entregar uma experiência sob medida — painel gerencial em tela cheia para desktop e interface ergonômica voltada para uso com uma só mão no mobile.
- **Design System com Variáveis Semânticas:** Cores HSL balanceadas, tipografia moderna do Google Fonts, sombras suaves e suporte preparado para tema escuro.
- **Micro-Interações Fluidas:** Transições animadas em modais, feedbacks de sucesso instantâneos e loaders sutis em operações assíncronas.
- **Validação de Segurança Dupla:** Para evitar baixas acidentais em telas sensíveis ao toque, a confirmação do pagamento exige a redigitação do valor.

### 🎨 Tokens do Design System

| Token CSS | Valor HEX / HSL | Finalidade Semântica |
| :--- | :---: | :--- |
| `--primary` | `#2563eb` | Ações principais, botões de destaque e navegação ativa |
| `--primary-hover` | `#1d4ed8` | Estados de hover em botões primários |
| `--success` | `#16a34a` | Parcelas pagas, confirmações de recebimento e badges de sucesso |
| `--warning` | `#f59e0b` | Parcelas que vencem hoje e alertas de atenção |
| `--danger` | `#dc2626` | Parcelas em atraso, cancelamentos e mensagens de erro |
| `--surface` | `#ffffff` / `#1e293b` | Fundo de cards, tabelas e modais (suporte a modo escuro) |
| `--background` | `#f8fafc` / `#0f172a` | Fundo principal da página com contraste balanceado |

---

## ⚙️ Funcionalidades Principais

### 👤 Perfil: Gerente (Painel Administrativo Desktop)
- **Dashboard Analítico em Tempo Real:** Faturamento bruto diário, taxa de conversão de cobranças, montante de recebíveis e lista de inadimplentes.
- **Governança de Equipe:** Cadastro unificado de operadores, controle de papéis (`GERENTE` ou `VENDEDOR`) e ativação/desativação instantânea de acessos.
- **Comissões e Metas:** Relatórios de produtividade individual com apuração de percentuais de comissão sobre valores recuperados.
- **Gestão de Clientes e Limite:** Histórico consolidado de compras, saldo devedor e controle de limites.
- **Catálogo de Produtos:** Cadastro, precificação e categorização de mercadorias.
- **Fechamento e Prestação Global:** Visualização consolidada de todas as entradas de caixa dos cobradores no expediente.

### 🛵 Perfil: Vendedor / Cobrador (App Mobile)
- **Aba de Cobranças Prioritárias:** Fila de trabalho com clientes que possuem parcelas vencendo **hoje** ou **em atraso**.
- **Baixa Segura com Conferência:** Modal com dupla confirmação de digitação do valor recebido.
- **Pagamento Adiantado:** Quitação antecipada de parcelas futuras diretamente no card do cliente.
- **Pesquisa Inteligente de Clientes:** Autocomplete com busca preditiva por nome, telefone ou endereço sem lentidão.
- **Prestação de Contas Pessoal:** Resumo diário dos valores arrecadados dividido por modalidade (Dinheiro, Pix e Cartão).

---

## 📐 Regras de Negócio Financeiras

O sistema implementa regras contábeis sólidas para assegurar integridade financeira:

1. **Geração Automática do Plano de Parcelamento:**
   - O saldo restante (`total - entrada`) é dividido de forma igualitária pelo número de parcelas acordadas.
   - Suporte a frequências: **Semanal** (a cada 7 dias), **Quinzenal** (a cada 15 dias) e **Mensal** (mesmo dia do mês subsequente).
   - Centavos residuais decorrentes de dízimas na divisão são automaticamente ajustados na primeira parcela para garantir fechamento de 100% do saldo contratado.

2. **Critério de Atraso e Priorização Diária:**
   - Parcelas com vencimento anterior à data atual (`vencimento < hoje`) e status diferente de `PAGA` são marcadas como **Em Atraso**.
   - Clientes inadimplentes recebem prioridade máxima na fila do cobrador com contadores de dias em atraso.

3. **Amortização e Quitação Antecipada:**
   - Pagamentos parciais abatem prioritariamente o saldo da parcela mais antiga em aberto.
   - Quitações integrais antecipadas atualizam o status para `PAGA` e registram a data efetiva do recebimento.

4. **Prestação de Contas e Fechamento de Caixa:**
   - Todo pagamento é associado ao ID do operador autenticado no momento da baixa, possibilitando conciliação física de caixa ao final do dia.

---

## 🔄 Fluxo de Venda & Ciclo de Vida

```mermaid
flowchart TD
    A[Início: Nova Venda] --> B[Seleção/Cadastro de Cliente]
    B --> C[Adição de Itens e Produtos]
    C --> D{Possui Entrada?}
    D -- Sim --> E[Deduz Entrada do Total]
    D -- Não --> F[Valor Total a Parcelar]
    E --> G[Configurar Periodicidade e Qtd Parcelas]
    F --> G
    G --> H[Transação Atômica no Banco de Dados]
    H --> I[Criação da Venda + Carnê de Parcelas]
    
    subgraph Ciclo de Vida da Parcela
        I --> J[Status: PENDENTE]
        J -->|Data Atual <= Vencimento| K[Na Carteira: A Vencer]
        J -->|Data Atual > Vencimento| L[Em Atraso: Fila Prioritária]
        K -->|Cobrador Recebe Pagamento| M[Confirmação de Segurança de Valor]
        L -->|Cobrador Recebe Pagamento| M
        K -->|Pagamento Antecipado| M
        M -->|Valor Total| N[Status: PAGA]
        M -->|Amortização Parcial| P[Saldo Abatido: Mantém PENDENTE]
        P --> O[Geração de Registro Imutável de Auditoria]
        N --> O[Geração de Registro Imutável de Auditoria]
    end
```
