# 💳 Crediário System

<p align="center">
  <strong>Sistema completo de gestão de crediário: controle de clientes, emissão de carnês, registro de cobranças, pagamentos e relatórios financeiros em tempo real.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-22.x-339933?logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Express-5.x-000000?logo=express&logoColor=white" alt="Express">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Prisma_ORM-6.x-2D3748?logo=prisma&logoColor=white" alt="Prisma">
  <img src="https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql&logoColor=white" alt="MySQL">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Arquitetura-API_REST-blue?logoColor=white" alt="API REST">
  <img src="https://img.shields.io/badge/Auth-JWT-F7B731?logoColor=white" alt="JWT">
  <img src="https://img.shields.io/badge/Design-Mobile_First-8B5CF6?logoColor=white" alt="Mobile First">
  <img src="https://img.shields.io/badge/Licença-Privada-red" alt="Licença">
  <img src="https://img.shields.io/badge/Status-Em_Desenvolvimento-orange" alt="Status">
</p>

---

## 📑 Sumário

- [📱 Sobre o Projeto](#-sobre-o-projeto)
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
- [🚀 Roadmap](#-roadmap)
- [🤝 Contribuição & Boas Práticas](#-contribuição--boas-práticas)
- [📜 Licença](#-licença)

---

## 📱 Sobre o Projeto

O **Crediário System** é uma aplicação web full-stack desenvolvida para digitalizar e centralizar toda a gestão de vendas no crediário para pequenos e médios comércios.

O sistema resolve a dor de controlar manualmente cadernetas e carnês físicos, substituindo-os por uma plataforma digital intuitiva e segura. Construído com uma arquitetura desacoplada entre uma **API REST (Node.js + Express)** e um **Frontend SPA (React + Vite)**, o sistema oferece controle completo de clientes, geração de carnês de parcelamento, lançamento de cobranças diárias e dashboards financeiros — tudo com controle de acesso baseado em perfis de usuário.

---

## 🎨 Design & Usabilidade

O frontend foi desenvolvido com as melhores práticas de design moderno, apresentando:

- **Interface Dual-Platform (Desktop & Mobile):** O sistema detecta o dispositivo e renderiza automaticamente a melhor experiência — layout de painel completo para desktops e interface de toque fluída para smartphones dos vendedores em campo.
- **Design System Premium:** Paleta de cores cuidadosamente curada com variáveis CSS semânticas, tipografia moderna (Google Fonts), gradientes suaves e sombras hierárquicas que transmitem profissionalismo.
- **Micro-Animações e Feedback Visual:** Transições suaves, estados de loading animados, banners de sucesso não-bloqueantes e modais com animações de entrada para uma experiência de uso fluída.
- **Validação de Segurança Dupla no Pagamento:** Ao registrar um pagamento, um modal de confirmação solicita que o vendedor redigite o valor, evitando lançamentos acidentais por clique errado.
- **Pesquisa Inteligente com Autocomplete:** Campos de busca com filtragem em tempo real por nome, telefone ou endereço em listas de clientes e cobranças.

---

## ⚙️ Funcionalidades Principais

### 👤 Perfil: Gerente

- **Dashboard Gerencial em Tempo Real:** KPIs da empresa com total de clientes, vendas do dia, valor em aberto e cobranças realizadas.
- **Gestão de Funcionários:** Cadastro, ativação e desativação de vendedores/cobradores.
- **Gestão de Clientes & Produtos:** Visão global de todos os clientes cadastrados, saldo devedor acumulado e catálogo de produtos com categorias.
- **Registro de Vendas Completo:** Criação de vendas com múltiplos itens, valor de entrada opcional e geração automática do carnê de parcelas (periodicidade mensal, quinzenal ou semanal).
- **Visualização de Carnê:** Consulta detalhada de todas as parcelas de cada venda, com status atualizado em tempo real.
- **Relatório Mensal Consolidado:** Desempenho individual de cada funcionário com total cobrado, número de cobranças e comissão.
- **Prestação de Contas Global:** Visão da movimentação financeira diária de todos os cobradores da empresa.

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
        M -->|Confirmação Válida| N[Status: PAGA]
        N --> O[Geração de Registro Imutável de Auditoria]
    end
```

---

## 📱 Módulos Operacionais Mobile

Projetado com foco em usabilidade sob luz solar e operações de rua rápidas com apenas uma mão:

- **1. Cobranças Operacionais do Dia:**
  - Filtragem automática das parcelas de hoje e em atraso com categorização visual (badges coloridos).
  - Acesso direto ao WhatsApp do cliente em um toque para envio de lembretes ou contato prévio.
  - Baixa de pagamento imediata com tela de confirmação de segurança.

- **2. Busca e Ficha de Clientes:**
  - Busca instantânea sem necessidade de paginação rígida, filtrando por nome, telefone ou logradouro.
  - Extrato individual com total em dívida, histórico de compras e parcelas vincendas.
  - Opção de amortização ou quitação adiantada de carnês direto pelo card do cliente.

- **3. Ponto de Venda Ágil (Nova Venda):**
  - Autocomplete preditivo de clientes sem telas modais pesadas.
  - Seleção de múltiplos itens do catálogo com cálculo dinâmico de subtotais.
  - Simulação em tempo real do carnê: altere a quantidade de parcelas e visualize o valor exato de cada parcela antes de finalizar.

- **4. Histórico Financeiro & Extrato Consolidado:**
  - Telas dedicadas para histórico detalhado de parcelas recebidas e histórico analítico de vendas efetuadas.
  - Filtros por período com totalizadores de volume recebido e saldo a receber.

- **5. Resumo do Dia & Fechamento de Caixa:**
  - Exibição de valores totais recebidos na jornada do cobrador.
  - Discriminativo de pagamentos por modalidade para simplificar o acerto final com a gerência.

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
- **MySQL** 8.0 rodando localmente (ou outro banco suportado pelo Prisma)
- **npm** ou **yarn**

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

---

## 🗃️ Modelo de Dados Resumido

```
Usuario  ──< Venda >── Cliente
                │
                └──< Parcela >── Auditoria
Venda    ──< ItemVenda >── Produto
```

| Entidade     | Descrição                                                  |
|--------------|------------------------------------------------------------|
| `Usuario`    | Gerentes e Vendedores/Cobradores com autenticação JWT      |
| `Cliente`    | Dados cadastrais e histórico de compras no crediário       |
| `Venda`      | Cabeçalho da venda com valor total, entrada e parcelas     |
| `ItemVenda`  | Produtos individuais associados a cada venda               |
| `Parcela`    | Carnê gerado automaticamente com vencimento e status       |
| `Auditoria`  | Log imutável de todas as operações em parcelas             |

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

## 🚀 Roadmap

O desenvolvimento contínuo do Crediário System prioriza ferramentas práticas para aumentar a recuperação de crédito e a produtividade operacional:

- [x] **Módulo Gerencial:** Painel com KPIs, métricas de vendas e comissões por cobrador.
- [x] **Carnê Automatizado:** Emissão com prazos flexíveis (semanal, quinzenal e mensal).
- [x] **Segurança Dupla:** Modal de conferência manual de valores para evitar baixas errôneas.
- [x] **Histórico & Extratos:** Painéis dedicados de prestação de contas mobile e desktop.
- [ ] **Modo PWA Offline-First:** Armazenamento local com IndexedDB e sincronização automática ao restabelecer conexão de internet em áreas de sinal fraco.
- [ ] **Impressão Térmica Bluetooth:** Integração com mini-impressoras térmicas portáteis (58mm e 80mm) para entrega imediata do recibo ao cliente.
- [ ] **Notificações via WhatsApp:** Envio automatizado de lembretes de vencimento e chave Pix para pagamento à distância.
- [ ] **Exportação Analítica:** Relatórios contábeis e fechamento mensal em PDF e planilhas Excel (`.xlsx`).
- [ ] **Roteirização Inteligente de Cobrança:** Ordenação geográfica de clientes no mapa para otimizar o itinerário do cobrador.

---

## 🤝 Contribuição & Boas Práticas

Contribuições, sugestões e melhorias são bem-vindas! Para manter a rastreabilidade e a qualidade do código:

1. **Faça um Fork** do projeto e crie uma branch descritiva:
   ```bash
   git checkout -b feature/minha-nova-funcionalidade
   ```
2. **Siga o padrão Conventional Commits**:
   - `feat:` Novas funcionalidades ou telas
   - `fix:` Correções de bugs ou validações
   - `docs:` Modificações em documentação ou README
   - `refactor:` Melhorias internas de código sem alterar comportamento
   - `chore:` Ajustes de pacotes, configs ou ferramentas
3. **Valide a tipagem estática e linting**:
   ```bash
   # No frontend
   npm run build
   # No backend
   npx tsc --noEmit
   ```
4. **Abra um Pull Request** detalhando o problema resolvido ou a melhoria implementada.

---

## 📜 Licença

Este projeto é desenvolvido para fins de gestão comercial e controle financeiro de crediário.  
Todos os direitos reservados © 2025 — Vitor Augusto.
