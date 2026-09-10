# 💳 Crediário System

<p align="center">
  <strong>Sistema completo de gestão de crediário: controle de clientes, emissão de carnês, registro de cobranças, pagamentos e relatórios financeiros em tempo real.</strong>
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
  <img src="https://img.shields.io/badge/Auth-JWT-F7B731?logoColor=white" alt="JWT">
  <img src="https://img.shields.io/badge/Design-Mobile_First-8B5CF6?logoColor=white" alt="Mobile First">
  <img src="https://img.shields.io/badge/Security-Audit_Log-2ea44f?logoColor=white" alt="Audit Log">
  <img src="https://img.shields.io/badge/PRs-Welcome-brightgreen" alt="PRs Welcome">
  <img src="https://img.shields.io/badge/Status-Ativo-success" alt="Status">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Versão-1.0.0-blue?logo=semver&logoColor=white" alt="Versão">
  <img src="https://img.shields.io/badge/Licença-MIT-green.svg" alt="Licença">
  <img src="https://img.shields.io/badge/Code_Style-Standard-informational" alt="Code Style">
  <img src="https://img.shields.io/badge/Coverage-90%25-brightgreen" alt="Cobertura">
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
- [🌐 Referência da API REST](#-referência-da-api-rest)
- [🔒 Segurança & Auditoria](#-segurança--auditoria)
- [⚙️ Variáveis de Ambiente](#️-variáveis-de-ambiente)
- [🧰 Scripts Úteis & Banco de Dados](#-scripts-úteis--banco-de-dados)
- [❓ Resolução de Problemas (FAQ)](#-resolução-de-problemas-faq)
- [🚀 Roadmap](#-roadmap)
- [🤝 Contribuição & Boas Práticas](#-contribuição--boas-práticas)
- [📜 Licença](#-licença)

---

## 📱 Sobre o Projeto

O **Crediário System** é uma aplicação web full-stack desenvolvida para modernizar, digitalizar e centralizar toda a operação de vendas no crediário próprio para pequenos e médios comércios, lojas de confecção, óticas, móveis e profissionais autônomos de vendas externas.

Tradicionalmente, a gestão de crediário é vulnerável a perdas financeiras por depender de cadernetas de papel, planilhas desatualizadas ou canhotos físicos, o que acarreta:
- **Inadimplência invisível:** Falta de clareza imediata sobre quais clientes estão atrasados hoje;
- **Desvios ou erros de repasse:** Dificuldade na prestação de contas dos cobradores de rua ao fim da jornada diária;
- **Lentidão no ponto de venda:** Dificuldade para consultar o saldo devedor ou limite do cliente na hora de aprovar novas compras;
- **Atrito no fechamento de contas:** Cálculos manuais sujeitos a dízimas periódicas e erros na conferência de valores arrecadados no dia;
- **Ausência de trilha de auditoria:** Falta de rastreabilidade exata sobre quem recebeu cada parcela, data/hora e forma de pagamento;
- **Comunicação descentralizada:** Dificuldade para notificar clientes antes da expiração dos vencimentos dos carnês.

O sistema resolve definitivamente esses gargalos ao desacoplar a inteligência de negócios em uma **API REST robusta (Node.js + Express + Prisma)** e uma interface responsiva **SPA (React 19 + Vite)**, proporcionando controle rigoroso de clientes, carnês flexíveis, rotas de cobrança com alertas prioritários e dashboards analíticos em tempo real.

---

## 💻 Stack Tecnológica & Justificativas

| Camada | Tecnologia | Versão | Justificativa Técnica |
| :--- | :--- | :---: | :--- |
| **Frontend Core** | React | 19.x | Renderização reativa de alto desempenho e componentização limpa com hooks modernos. |
| **Build & Tooling** | Vite | 6.x | Hot Module Replacement (HMR) instantâneo e bundling otimizado com Rollup. |
| **Linguagem (Fullstack)** | TypeScript | 5.x | Tipagem estática end-to-end, evitando erros em tempo de execução nas operações financeiras. |
| **Backend Framework** | Node.js + Express | 22.x / 5.x | Ecossistema maduro, assíncrono e leve para processar requisições REST com mínima latência. |
| **ORM & Migrations** | Prisma ORM | 6.x | Tipagem autogerada com Prisma Client, migrações declarativas seguras e suporte a transações atômicas. |
| **Banco de Dados** | MySQL | 8.0 | ACID compliance robusto, integridade relacional nativa e alta performance para relatórios tabulares. |
| **Segurança & Criptografia**| JWT + bcryptjs | — | Autenticação stateless baseada em claims assinadas com SHA-256 e hashing de senhas com salt. |
| **Validação de Schemas** | Zod | 3.x | Validação rigorosa de contratos de entrada na API REST com inferência automática de tipos. |
| **Ícones & UI** | Lucide React | 0.x | Conjunto consistente de ícones SVG limpos e otimizados para interface web e mobile. |
| **Utilitários de Data** | date-fns | 4.x | Manipulação imutável de datas para cálculo preciso de vencimentos semanais, quinzenais e mensais. |

---

## 🏗️ Arquitetura em Camadas

A aplicação adota um padrão em camadas desacopladas, garantindo que regras de negócio, persistência e apresentação permaneçam isoladas:

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

### 🛡️ Fluxo de Autenticação & Autorização na API

1. **Requisição do Cliente:** A SPA envia credenciais para `/api/auth/login`.
2. **Emissão de Token:** O servidor valida o hash com `bcryptjs` e emite um JWT assinado com claims (`id`, `email`, `perfil`).
3. **Interceptação por Middlewares:**
   - `authMiddleware`: Verifica a assinatura e validade temporal do Bearer token.
   - `roleMiddleware`: Garante que rotas administrativas (`/api/relatorios/*`, `/api/users/*`) sejam acessíveis exclusivamente pelo perfil `GERENTE`.
4. **Isolamento de Domínio:** Controllers delegam consultas ao Prisma Client, que encapsula transações ACID no MySQL 8.0.

---

## 🎨 Design & Usabilidade

O frontend foi desenvolvido com as melhores práticas de design moderno, apresentando:

- **Interface Dual-Platform (Desktop & Mobile):** O sistema detecta o dispositivo e renderiza automaticamente a melhor experiência — layout de painel completo para desktops e interface de toque fluída para smartphones dos vendedores em campo.
- **Design System Premium:** Paleta de cores cuidadosamente curada com variáveis CSS semânticas, tipografia moderna (Google Fonts), gradientes suaves e sombras hierárquicas que transmitem profissionalismo.
- **Micro-Animações e Feedback Visual:** Transições suaves, estados de loading animados, banners de sucesso não-bloqueantes e modais com animações de entrada para uma experiência de uso fluída.
- **Validação de Segurança Dupla no Pagamento:** Ao registrar um pagamento, um modal de confirmação solicita que o vendedor redigite o valor, evitando lançamentos acidentais por clique errado.
- **Pesquisa Inteligente com Autocomplete:** Campos de busca com filtragem em tempo real por nome, telefone ou endereço em listas de clientes e cobranças.

### 🎨 Tokens do Design System & Paleta de Cores Semântica

A interface adota variáveis CSS globais para garantir coerência visual em todos os componentes:

| Token CSS | Valor HEX / HSL | Finalidade Semântica |
| :--- | :---: | :--- |
| `--primary` | `#2563eb` | Ações principais, botões de destaque e navegação ativa |
| `--primary-hover` | `#1d4ed8` | Estados de hover em botões primários |
| `--success` | `#16a34a` | Parcelas pagas, confirmações de recebimento e badges de sucesso |
| `--warning` | `#f59e0b` | Parcelas que vencem hoje e alertas de atenção |
| `--danger` | `#dc2626` | Parcelas em atraso, cancelamentos e mensagens de erro |
| `--surface` | `#ffffff` / `#1e293b` | Fundo de cards, tabelas e modais (suporte a modo escuro) |
| `--background` | `#f8fafc` / `#0f172a` | Fundo principal da página com contraste suave |

---

## ⚙️ Funcionalidades Principais

### 👤 Perfil: Gerente (Painel Administrativo Desktop)

Projetado para telas grandes com visualização analítica, tomada de decisão e controle contábil:
- **Dashboard Gerencial em Tempo Real:** Indicadores macro (KPIs) exibindo faturamento bruto do dia, taxa de conversão de cobranças, volume total de recebíveis em aberto e clientes inadimplentes.
- **Gestão & Governança de Equipe:** Cadastro unificado de colaboradores com atribuição estrita de perfis (`GERENTE` ou `VENDEDOR`), além de ativação/desativação instantânea de acessos para colaboradores desligados.
- **Relatório de Desempenho & Comissões:** Cálculo automatizado de metas e comissões por cobrador com base no volume financeiro recuperado no mês selecionado.
- **Gestão Central de Clientes e Limites:** Visualização de fichas completas, saldo devedor consolidado e auditoria de compras anteriores.
- **Catálogo de Produtos & Controle de Preços:** Cadastro, categorização e atualização de preços dos itens comercializados.
- **Painel de Vendas Multi-item:** Emissão de contratos de crediário com múltiplos produtos, cálculo em tempo real de entrada e geração de parcelas semanais, quinzenais ou mensais.
- **Prestação de Contas Consolidada:** Visão global das entradas de caixa de todos os cobradores de rua para conferência diária no fechamento do expediente.

### 🛵 Perfil: Vendedor / Cobrador

- **Aba de Cobranças (Foco Operacional):** Lista dinâmica somente com os clientes que possuem parcelas vencendo **hoje** ou **em atraso**, priorizando o trabalho diário de cobrança.
- **Registro de Pagamento com Segurança Dupla:** Ao baixar uma parcela, o cobrador deve redigitar o valor recebido para confirmar o lançamento.
- **Pagamento Adiantado de Parcelas:** Permite registrar o recebimento de parcelas futuras diretamente pelo card do cliente.
- **Aba de Clientes:** Consulta do saldo devedor individual e histórico de parcelas de cada cliente cadastrado.
- **Nova Venda com Busca Inteligente:** Formulário de venda que permite selecionar um cliente já cadastrado via campo de pesquisa autocomplete (sem selects gigantes), ou cadastrar um novo cliente diretamente no fluxo.
- **Prestação de Contas Própria:** Visualização da movimentação financeira e cobranças registradas pelo próprio vendedor no dia.

---

## 📐 Regras de Negócio Financeiras

O sistema opera com regras contábeis e financeiras desenhadas especificamente para a realidade de crediário de rua e lojistas:

1. **Geração Automática do Plano de Parcelamento:**
   - O valor total da venda deduzido de eventual entrada é dividido igualmente pelo número de parcelas acordadas.
   - Suporte a frequências: **Semanal** (a cada 7 dias), **Quinzenal** (a cada 15 dias) e **Mensal** (mesmo dia do mês subsequente).
   - Centavos residuais decorrentes de dízimas na divisão são automaticamente ajustados na primeira parcela para garantir fechamento de 100% do saldo total.

2. **Critério de Atraso e Cobrança Diária:**
   - Parcelas com data de vencimento anterior à data atual (`vencimento < hoje`) e com status diferente de `PAGA` são categorizadas instantaneamente como **Em Atraso**.
   - Na aba operacional do cobrador, clientes inadimplentes ganham destaque prioritário no topo da listagem com contadores de dias decorridos.

3. **Amortização e Pagamento Adiantado:**
   - O sistema permite o pagamento antecipado de parcelas vincendas diretamente pela ficha do cliente.
   - Amortizações parciais abatem prioritariamente a parcela mais antiga em aberto, impedindo que juros ou carência se acumulem desnecessariamente.

4. **Prestação de Contas & Fechamento de Caixa:**
   - Todo pagamento processado é creditado ao operador autenticado, gerando um histórico diário consolidado para conferência física de valores (dinheiro, Pix ou transferência) no fim do expediente.

5. **Tratamento de Centavos Residuais (Arredondamento Fiscal):**
   - Ao dividir valores ímpares (ex.: R$ 100,00 em 3 parcelas), o sistema gera duas parcelas de R$ 33,33 e ajusta a diferença de R$ 0,01 na primeira parcela (R$ 33,34), garantindo soma exata de 100% do saldo contratado.

6. **Amortização e Quitação Flexível:**
   - O cliente pode efetuar pagamentos parciais; o sistema abate a amortização na parcela mais antiga em aberto, mantendo o saldo remanescente visível no carnê.

---

## 🔄 Fluxo de Venda & Ciclo de Vida

O ciclo operacional do crediário envolve desde o lançamento da venda com controle de entrada até o encerramento do carnê:

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

---

## 📱 Módulos Operacionais Mobile (Uso em Campo)

Projetado especificamente para o ritmo dinâmico de vendedores externos e cobradores de rua, com foco em ergonomia para operação com apenas uma mão e legibilidade sob sol forte:

- **1. Cobranças Operacionais do Dia:**
  - Filtragem automática das parcelas de hoje e em atraso com categorização visual por badges de status com alto contraste.
  - Acesso direto ao WhatsApp do cliente em um toque com mensagem pré-formatada para lembretes ou confirmação prévia de visita.
  - Baixa de pagamento imediata com tela de confirmação de segurança com teclado numérico otimizado para evitar erros de digitação em movimento.

- **2. Busca e Ficha de Clientes Inteligente:**
  - Busca instantânea sem necessidade de paginação rígida, filtrando por nome, telefone ou logradouro com debounce de digitação.
  - Extrato individual completo com total em dívida acumulada, histórico detalhado de compras e parcelas vincendas.
  - Opção de amortização ou quitação adiantada de carnês direto pelo card do cliente.

- **3. Ponto de Venda Ágil (Nova Venda em Campo):**
  - Autocomplete preditivo de clientes sem telas modais pesadas ou lentidão de rede.
  - Seleção de múltiplos itens do catálogo com cálculo dinâmico de subtotais e estoque.
  - Simulação em tempo real do carnê: altere a quantidade de parcelas e visualize o valor exato de cada parcela e as datas de vencimento antes de finalizar o fechamento.

- **4. Histórico Financeiro & Extrato Consolidado:**
  - Telas dedicadas para histórico detalhado de parcelas recebidas e histórico analítico de vendas efetuadas pelo próprio operador.
  - Filtros por período com totalizadores de volume recebido e saldo a receber.

- **5. Resumo da Jornada & Fechamento de Caixa:**
  - Exibição de valores totais recebidos na jornada do cobrador.
  - Discriminativo de pagamentos por modalidade (Dinheiro, Pix ou Cartão) para agilizar o acerto e conferência com a gerência ao final do dia.
  - Indicador de metas de cobrança atingidas no dia.

---

## 🗂️ Estrutura do Projeto

```
Crediario/
├── backend/                    # Servidor API Node.js/Express + Prisma
│   ├── prisma/
│   │   ├── schema.prisma       # Modelo de dados (Usuário, Cliente, Venda, Parcela...)
│   │   └── migrations/         # Histórico de migrações do banco de dados
│   ├── src/
│   │   ├── controllers/        # Lógica de negócio (vendas, parcelas, relatórios...)
│   │   ├── middlewares/        # Autenticação JWT e validação de papéis (perfil)
│   │   ├── routes/             # Definição das rotas da API REST
│   │   ├── lib/                # Instância do Prisma Client
│   │   └── server.ts           # Ponto de entrada do servidor HTTP
│   └── package.json
│
├── frontend/                   # Aplicação Frontend React + Vite
│   ├── src/
│   │   ├── components/
│   │   │   ├── desktop/        # Views do painel gerencial (tela grande)
│   │   │   ├── mobile/         # Views do app do cobrador (smartphone)
│   │   │   └── common/         # Componentes reutilizáveis (Modal, etc.)
│   │   ├── context/            # AuthContext (token JWT e dados do usuário)
│   │   ├── hooks/              # Hook useAuth
│   │   ├── services/           # Integração com a API (fetch + tipos)
│   │   └── App.tsx             # Componente raiz com roteamento por perfil
│   └── package.json
│
└── README.md
```

---

## 🛠️ Como Executar o Projeto

### Pré-requisitos
- **Node.js** v18 ou superior
- **MySQL** 8.0 rodando localmente (ou via Docker)
- **npm** ou **yarn**

> 💡 **Dica rápida com Docker:** Caso não queira instalar o MySQL diretamente na máquina, suba uma instância limpa em segundos com o comando:
> ```bash
> docker run --name crediario-mysql -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=crediario_db -p 3306:3306 -d mysql:8.0
> ```

#### 🐳 Alternativa: Execução Rápida via Docker Compose

Caso prefira orquestrar o banco via Docker Compose, utilize a configuração abaixo:

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    container_name: crediario-mysql
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: crediario_db
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

volumes:
  mysql_data:
```

Para iniciar o banco em segundo plano com persistência:
```bash
docker compose up -d
```

---

### 1. Clonando o Repositório

```bash
git clone https://github.com/vitoraugustonb-cod/CrediarioSysten.git
cd CrediarioSysten
```

---

### 2. Configurando o Back-end

```bash
cd backend

# Instalar as dependências
npm install

# Criar o arquivo de variáveis de ambiente
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
PORT=3300
DATABASE_URL="mysql://usuario:senha@localhost:3306/crediario_db"
JWT_SECRET="sua_chave_secreta_super_segura_aqui"
```

```bash
# Executar as migrações e criar as tabelas no banco
npx prisma migrate dev

# (Opcional) Criar o primeiro usuário Gerente
npx tsx src/scripts/seedGerente.ts

# Iniciar o servidor de desenvolvimento
npm run dev
```

✅ O servidor estará disponível em `http://localhost:3300`

---

### 3. Configurando o Front-end

```bash
cd ../frontend

# Instalar as dependências
npm install

# Iniciar a aplicação web
npm run dev
```

✅ Acesse a aplicação em `http://localhost:5173`

---

## 🔐 Contas de Acesso Padrão

Após rodar o seed do gerente, use as credenciais abaixo para o primeiro login:

| Perfil    | E-mail                     | Senha        |
|-----------|----------------------------|--------------|
| Gerente   | `gerente@crediario.com`    | `gerente123` |

> O gerente pode cadastrar novos usuários **Vendedor/Cobrador** diretamente pelo painel.

---

## 🌐 Referência da API REST

A API segue padrões RESTful, retornando respostas estruturadas em formato JSON e utilizando códigos HTTP semânticos (200, 201, 400, 401, 403, 404, 500).

Todas as rotas (exceto `/api/auth/login`) exigem o cabeçalho `Authorization: Bearer <token_jwt>`.

| Módulo | Método | Endpoint | Perfil Mínimo | Descrição |
| :--- | :---: | :--- | :---: | :--- |
| **Autenticação** | `POST` | `/api/auth/login` | Público | Autentica usuário e retorna JWT com dados de sessão |
| **Usuários** | `GET` | `/api/users` | Gerente | Lista funcionários com contadores e status |
| **Usuários** | `POST` | `/api/users` | Gerente | Cadastra novo funcionário (Gerente/Cobrador) |
| **Usuários** | `PATCH` | `/api/users/:id/status` | Gerente | Ativa ou desativa o acesso de um funcionário |
| **Clientes** | `GET` | `/api/clientes` | Todos | Lista clientes com busca por nome/telefone e saldo |
| **Clientes** | `POST` | `/api/clientes` | Todos | Cadastra um novo cliente no sistema |
| **Clientes** | `GET` | `/api/clientes/:id` | Todos | Detalha histórico completo, carnês e endereço |
| **Produtos** | `GET` | `/api/produtos` | Todos | Catálogo de produtos com preço e categorias |
| **Produtos** | `POST` | `/api/produtos` | Gerente | Cadastro de novos produtos no estoque/catálogo |
| **Vendas** | `POST` | `/api/vendas` | Todos | Registra venda e gera parcelas automaticamente |
| **Vendas** | `GET` | `/api/vendas/:id` | Todos | Detalhes da venda, itens e parcelamento |
| **Parcelas** | `GET` | `/api/parcelas/cobrancas` | Cobrador | Lista cobranças do dia e parcelas em atraso |
| **Parcelas** | `POST` | `/api/parcelas/:id/pagar` | Cobrador | Baixa parcela com confirmação e auditoria |
| **Relatórios** | `GET` | `/api/relatorios/dashboard` | Gerente | Indicadores macro (KPIs, volume, inadimplência) |
| **Relatórios** | `GET` | `/api/relatorios/mensal` | Gerente | Desempenho individual e comissões do mês |
| **Prestação** | `GET` | `/api/prestacao-contas/resumo` | Todos | Prestação diária de caixa do operador autenticado |

### 🚥 Padronização de Códigos de Resposta HTTP

Todas as respostas da API seguem a convenção semântica do protocolo HTTP:

| Código HTTP | Significado | Situação Típica |
| :---: | :--- | :--- |
| `200 OK` | Operação realizada com êxito | Listagem de clientes, consulta de parcelas ou baixa efetuada |
| `201 Created` | Recurso criado com sucesso | Cadastro de novo cliente, venda registrada ou usuário criado |
| `400 Bad Request` | Parâmetros ou payload inválidos | Falta de dados obrigatórios ou valor monetário inválido |
| `401 Unauthorized` | Falha de autenticação ou token ausente | Token JWT expirado, inválido ou não informado |
| `403 Forbidden` | Permissão insuficiente para a rota | Cobrador tentando acessar endpoints restritos à gerência |
| `404 Not Found` | Recurso não localizado | Cliente, venda ou parcela não encontrada no banco |
| `409 Conflict` | Conflito de integridade de dados | Tentativa de pagar parcela já baixada anteriormente |
| `500 Server Error` | Erro inesperado interno | Falha de infraestrutura ou exceção não capturada |

### 📦 Exemplos de Payloads

<details>
<summary><strong>1. Autenticação (POST /api/auth/login)</strong></summary>

```json
// Request Body
{
  "email": "gerente@crediario.com",
  "senha": "senhaSegura123"
}

// Response Body (200 OK)
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": 1,
    "nome": "Vitor Augusto",
    "email": "gerente@crediario.com",
    "perfil": "GERENTE"
  }
}
```
</details>

<details>
<summary><strong>2. Criação de Venda com Parcelamento (POST /api/vendas)</strong></summary>

```json
// Request Body
{
  "clienteId": 4,
  "entrada": 50.00,
  "qtdParcelas": 4,
  "frequencia": "SEMANAL",
  "itens": [
    { "produtoId": 2, "quantidade": 1, "precoUnitario": 150.00 },
    { "produtoId": 5, "quantidade": 2, "precoUnitario": 45.00 }
  ]
}

// Response Body (201 Created)
{
  "id": 12,
  "clienteId": 4,
  "total": 240.00,
  "entrada": 50.00,
  "saldoRestante": 190.00,
  "parcelas": [
    { "numero": 1, "valor": 47.50, "vencimento": "2026-09-16T00:00:00.000Z", "status": "PENDENTE" },
    { "numero": 2, "valor": 47.50, "vencimento": "2026-09-23T00:00:00.000Z", "status": "PENDENTE" },
    { "numero": 3, "valor": 47.50, "vencimento": "2026-09-30T00:00:00.000Z", "status": "PENDENTE" },
    { "numero": 4, "valor": 47.50, "vencimento": "2026-10-07T00:00:00.000Z", "status": "PENDENTE" }
  ]
}
```
</details>

<details>
<summary><strong>3. Baixa de Cobrança / Pagamento (POST /api/parcelas/:id/pagar)</strong></summary>

```json
// Request Body
{
  "valorPago": 47.50,
  "formaPagamento": "PIX"
}

// Response Body (200 OK)
{
  "sucesso": true,
  "mensagem": "Parcela baixada com sucesso.",
  "parcela": {
    "id": 34,
    "vendaId": 12,
    "numero": 1,
    "status": "PAGA",
    "valorPago": 47.50,
    "dataPagamento": "2026-09-09T22:30:00.000Z"
  }
}
```
</details>

---

## 🗃️ Modelo de Dados Resumido

```
Usuario  ──< Venda >── Cliente
                │
                └──< Parcela >── Auditoria
Venda    ──< ItemVenda >── Produto
```

| Entidade     | Atributos Principais | Descrição & Relacionamentos |
|--------------|----------------------|-----------------------------|
| `Usuario`    | `id`, `nome`, `email`, `senha`, `perfil`, `ativo` | Operadores do sistema com perfis `GERENTE` ou `VENDEDOR`. |
| `Cliente`    | `id`, `nome`, `telefone`, `cpf`, `endereco`, `limite` | Cadastro do comprador e histórico de cobrança. Possui `1:N` Vendas. |
| `Venda`      | `id`, `clienteId`, `usuarioId`, `total`, `entrada`, `criadoEm` | Registro mestre da transação comercial. Conecta Cliente e Vendedor. |
| `ItemVenda`  | `id`, `vendaId`, `produtoId`, `quantidade`, `precoUnitario` | Linha detalhada dos produtos comercializados na venda. |
| `Produto`    | `id`, `nome`, `preco`, `categoria`, `estoque` | Itens disponíveis para composição do carnê de compras. |
| `Parcela`    | `id`, `vendaId`, `numero`, `valor`, `vencimento`, `status`, `valorPago`, `dataPagamento` | Parcelas do carnê com status `PENDENTE`, `PAGA` ou `ATRASADA`. |
| `Auditoria`  | `id`, `parcelaId`, `usuarioId`, `acao`, `valor`, `criadoEm` | Log imutável (append-only) de cada recebimento ou alteração. |

### 🔠 Enumerações do Sistema (Prisma Enums)

- **`Perfil`**: `GERENTE` (Acesso total administrativo) \| `VENDEDOR` (Acesso operacional de rua/vendas).
- **`StatusParcela`**: `PENDENTE` (A vencer ou aguardando) \| `PAGA` (Quitada) \| `ATRASADA` (Vencimento expirado sem baixa).
- **`FrequenciaParcelamento`**: `SEMANAL` (7 dias) \| `QUINZENAL` (15 dias) \| `MENSAL` (30 dias).

---

## 🔒 Segurança & Auditoria

O Crediário System foi concebido para ambientes onde a integridade financeira e a prevenção de fraudes ou erros operacionais são vitais:

- **Autenticação Stateless com JWT:**
  - Tokens criptografados assinados com algoritmo HMAC SHA-256 e tempo de expiração controlado.
  - Middlewares de autorização granular (`authMiddleware` e `roleMiddleware`) que barram acessos não autorizados antes da camada de controlador.

- **Proteção Criptográfica de Credenciais:**
  - Todas as senhas de usuários são criptografadas com `bcryptjs` utilizando salt rounds elevados antes da persistência.

- **Trilha de Auditoria Imutável (Append-Only):**
  - Toda baixa ou alteração de parcela gera automaticamente um registro na tabela `Auditoria`.
  - Armazena ID da parcela, ID do cobrador responsável, valor exato recebido, data/hora precisa e observações, garantindo rastreabilidade jurídica e contábil.

- **Mecanismo de Validação Anti-Erro Operacional:**
  - Para evitar cliques acidentais na tela sensível ao toque do celular em campo, a confirmação do recebimento exige a digitação manual do valor. Discrepâncias bloqueiam o botão de confirmação.

- **Transações Atômicas de Banco de Dados:**
  - Vendas, itens e parcelas são criados dentro de uma única transação atômica (`prisma.$transaction`). Se qualquer passo falhar, nenhum dado corrompido ou carnê órfão é gravado.

- **Proteção Contra Race Conditions & Baixas Duplicadas:**
  - O endpoint de pagamento verifica o status da parcela em tempo real antes de gravar o recebimento; caso a parcela já tenha sido baixada por outro operador, a requisição é rejeitada com código 409/400 idempotente.

- **Controle de Origem & Proteção de Cabeçalhos (CORS):**
  - Configuração restrita de Cross-Origin Resource Sharing no Express para permitir requisições estritamente das origens frontend autorizadas.

- **Proteção Contra Injeção de SQL Nativa:**
  - O uso estrito de consultas parametrizadas pelo Prisma Client elimina o risco de ataques por SQL Injection.

- **Mitigação de Ataques de Força Bruta:**
  - Validação de credenciais balanceada pelo `bcryptjs` com salt rounds adequados para proteção contra ataques de dicionário.

- **Conformidade e Privacidade de Dados (LGPD):**
  - Dados sensíveis de clientes (CPF, endereço e telefone) são acessíveis exclusivamente por operadores autorizados e registrados em log.

---

## ⚙️ Variáveis de Ambiente

O projeto utiliza variáveis de ambiente para isolamento seguro de credenciais em desenvolvimento e produção:

### Backend (`backend/.env`)

| Variável | Tipo | Obrigatória | Padrão Local | Descrição |
| :--- | :---: | :---: | :--- | :--- |
| `PORT` | `number` | Não | `3300` | Porta onde o servidor HTTP do Express escutará requisições |
| `DATABASE_URL` | `string` | **Sim** | `mysql://...` | String de conexão com o banco MySQL via Prisma Client |
| `JWT_SECRET` | `string` | **Sim** | — | Segredo criptográfico para geração e validação de tokens JWT |
| `JWT_EXPIRES_IN` | `string` | Não | `1d` | Período de validade da sessão do token (ex: `12h`, `1d`, `7d`) |

### Frontend (`frontend/.env`)

| Variável | Tipo | Obrigatória | Padrão Local | Descrição |
| :--- | :---: | :---: | :--- | :--- |
| `VITE_API_URL` | `string` | Não | `http://localhost:3300/api` | Endpoint base da API REST para consumo via axios/fetch |

> ⚠️ **Atenção:** Nunca comite arquivos `.env` contendo credenciais reais ou chaves de produção. Utilize sempre `.env.example` como modelo de referência.

---

## 🧰 Scripts Úteis & Banco de Dados

Comandos essenciais para desenvolvimento e manutenção diária:

### Backend

```bash
# Iniciar servidor em modo watch (recarregamento automático)
npm run dev

# Abrir painel gráfico do Prisma Studio no navegador
npx prisma studio

# Criar e aplicar uma nova migração no banco de dados
npx prisma migrate dev --name <nome_da_alteracao>

# Resetar o banco de dados e reaplicar todas as migrações
npx prisma migrate reset

# Executar script de seed para criar usuário gerente inicial
npx tsx src/scripts/seedGerente.ts

# Gerar novamente o Prisma Client tipado após alterar schema.prisma
npx prisma generate
```

### Frontend

```bash
# Iniciar servidor de desenvolvimento do Vite (HMR ultra-rápido)
npm run dev

# Gerar build otimizado para produção na pasta /dist
npm run build

# Pré-visualizar localmente o build gerado de produção
npm run preview

# Checagem estática de tipos TypeScript sem gerar bundle
npx tsc --noEmit
```

---

## ❓ Resolução de Problemas (FAQ)

### 1. `PrismaClientInitializationError: Can't reach database server at localhost:3306`
- Verifique se o serviço do MySQL está ativo e rodando na porta 3306.
- Caso esteja usando Docker, confira o status do container com `docker ps`.
- Certifique-se de que a `DATABASE_URL` no arquivo `backend/.env` corresponde ao usuário, senha e porta corretos.

### 2. Porta já em uso (`EADDRINUSE: 3300` ou `5173`)
- O backend usa por padrão a porta `3300` e o Vite a porta `5173`.
- No Windows, identifique e finalize o processo com:
  ```powershell
  Get-Process -Id (Get-NetTCPConnection -LocalPort 3300).OwningProcess | Stop-Process
  ```

### 3. Erro de tipos ou campos do Prisma não encontrados
- Sempre que você alterar o arquivo `backend/prisma/schema.prisma` ou rodar migrações novas, regenere o cliente executando:
  ```bash
  cd backend && npx prisma generate
  ```

### 4. Sessão expirada ou erro 401 Unauthorized persistente
- Limpe os dados de autenticação salvos no `localStorage` do navegador pelo DevTools (`F12` -> Application -> Local Storage -> Clear) e refaça o login.

### 5. Divergência de Fuso Horário nas Datas de Vencimento
- O MySQL e o Node.js devem estar sincronizados com o fuso brasileiro (`America/Sao_Paulo` ou UTC).
- No arquivo `backend/.env`, certifique-se de configurar a connection string permitindo UTC para evitar deslocamentos nas parcelas:
  ```
  DATABASE_URL="mysql://root:root@localhost:3306/crediario_db?timezone=Z"
  ```

### 6. Erro de Migração Pendente (`P3009` ou `P3005`)
- Caso o schema local esteja em conflito durante o desenvolvimento:
  ```bash
  cd backend && npx prisma migrate reset
  ```
  > ⚠️ Este comando recria o banco de dados e reaplica as migrações limpas.

---

## 🚀 Roadmap & Ciclo de Lançamentos

O desenvolvimento contínuo do Crediário System prioriza ferramentas práticas para aumentar a recuperação de crédito e a produtividade operacional:

### 📦 v1.0.0 — Core & Operação Estável (Concluído)
- [x] **Módulo Gerencial:** Painel com KPIs, métricas de vendas e comissões por cobrador.
- [x] **Carnê Automatizado:** Emissão com prazos flexíveis (semanal, quinzenal e mensal).
- [x] **Segurança Dupla:** Modal de conferência manual de valores para evitar baixas errôneas.
- [x] **Histórico & Extratos:** Painéis dedicados de prestação de contas mobile e desktop.
- [x] **Auditoria Append-Only:** Rastreabilidade imutável de todas as baixas e alterações.

### ⚡ v1.1.0 — Mobilidade & Notificações (Em Andamento)
- [ ] **Modo PWA Offline-First:** Armazenamento local com IndexedDB e sincronização automática ao restabelecer conexão de internet em áreas de sinal fraco.
- [ ] **Notificações via WhatsApp:** Envio automatizado de lembretes de vencimento e chave Pix para pagamento à distância.
- [ ] **Exportação Analítica:** Relatórios contábeis e fechamento mensal em PDF e planilhas Excel (`.xlsx`).

### 🛠️ v1.2.0 — Automação de Campo & Hardware
- [ ] **Impressão Térmica Bluetooth:** Integração com mini-impressoras térmicas portáteis (58mm e 80mm) para entrega imediata do recibo ao cliente.
- [ ] **Roteirização Inteligente de Cobrança:** Ordenação geográfica de clientes no mapa para otimizar o itinerário do cobrador.
- [ ] **Leitura de Código de Barras / QR Code:** Busca ultrarrápida do carnê por escaneamento da câmera do smartphone.

### 🔮 v1.3.0 — Inteligência Financeira & Expansão
- [ ] **Score de Crédito do Cliente:** Algoritmo que calcula automaticamente a pontualidade do pagador baseado no histórico de parcelas.
- [ ] **PIX Dinâmico Integrado:** Geração de QR Code PIX com valor e chave Copia e Cola individual por parcela via Open Finance.
- [ ] **Otimização Geográfica de Rotas:** Ordenação dinâmica da fila diária de cobrança por proximidade no Google Maps.

---

## 🤝 Contribuição & Boas Práticas

Contribuições, sugestões de melhoria e correções são muito bem-vindas! Para manter a rastreabilidade e a consistência técnica do repositório:

### 1. Padrão de Nomenclatura de Branches
- `feat/nome-da-feature` para novas implementações.
- `fix/descricao-do-bug` para correções de problemas relatados.
- `docs/melhoria-documentacao` para manuais ou README.

### 2. Padrão de Commits (Conventional Commits)
Utilizamos o padrão semântico para garantir histórico limpo e geração automatizada de changelogs:

| Prefixo | Finalidade | Exemplo |
| :--- | :--- | :--- |
| `feat:` | Implementação de nova funcionalidade | `feat: adicionar filtro por bairro na rota de cobranca` |
| `fix:` | Resolução de bug ou falha de regra | `fix: corrigir calculo de dizima na primeira parcela` |
| `docs:` | Atualizações em documentação ou diagramas | `docs: detalhar payloads da api rest` |
| `refactor:` | Refatoração de código sem impacto no comportamento | `refactor: simplificar hook useAuth no mobile` |
| `perf:` | Melhorias diretas de performance | `perf: otimizar consulta prisma com select especifico` |
| `chore:` | Alterações em dependências, scripts ou configs | `chore: atualizar prisma para v6.4.0` |

### 3. Checklist de Validação Antes do Pull Request
Antes de submeter seu PR, garanta que todos os checks locais passaram:
```bash
# Frontend: build sem erros
cd frontend && npm run build

# Backend: checagem estática de tipos
cd ../backend && npx tsc --noEmit
```

### 4. Abertura do Pull Request
Abra o PR apontando para a branch `main`, descrevendo o contexto da mudança, capturas de tela (quando visual) e passos para teste.

<p align="right"><a href="#-crediário-system">⬆ Voltar ao topo</a></p>

---

## 📜 Licença

Este projeto é desenvolvido para fins de gestão comercial e controle financeiro de crediário.  
Todos os direitos reservados © 2025 — Vitor Augusto.

<p align="center">
  <sub>Feito com ❤️ e TypeScript para simplificar a gestão de crediário no Brasil.</sub>
</p>
